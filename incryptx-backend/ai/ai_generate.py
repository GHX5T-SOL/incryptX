import os
import io
import re
import json
import base64
import hashlib
import requests
import asyncio
from dataclasses import dataclass
from typing import Optional, Dict, Any, Tuple, List

from PIL import Image

try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'))
except Exception:
    pass

import torch
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    CLIPProcessor,
    CLIPModel,
)

try:
    from unsloth import FastLanguageModel
    UNSLOTH_AVAILABLE = True
except ImportError:
    UNSLOTH_AVAILABLE = False

try:
    from diffusers import StableDiffusionPipeline
    SD_AVAILABLE = True
except ImportError:
    SD_AVAILABLE = False

try:
    from elevenlabs import generate, set_api_key, voices
    ELEVENLABS_AVAILABLE = True
except ImportError:
    ELEVENLABS_AVAILABLE = False


@dataclass
class AIGenerateConfig:
    text_model: str = "gpt2"
    clip_model: str = "openai/clip-vit-base-patch32"
    sd_model: str = "runwayml/stable-diffusion-v1-5"
    device: str = "cuda" if torch.cuda.is_available() else "cpu"
    
    # Fine-tuned model settings
    use_finetuned: bool = True
    finetuned_model_path: str = "./llama3.1-8b-solana"
    fallback_model: str = "unsloth/llama-3.1-8b-bnb-4bit"
    
    # Voice settings
    use_voice: bool = True
    elevenlabs_api_key: Optional[str] = os.environ.get("ELEVENLABS_API_KEY")
    voice_id: str = "21m00Tcm4TlvDq8ikWAM"  # Default voice
    
    # IPFS/Web3 storage
    web3_storage_token: Optional[str] = os.environ.get("WEB3_STORAGE_TOKEN")
    pinata_jwt: Optional[str] = os.environ.get("PINATA_JWT")
    pinata_api_key: Optional[str] = os.environ.get("PINATA_API_KEY")
    pinata_secret_api_key: Optional[str] = os.environ.get("PINATA_SECRET_API_KEY")


def load_text_model(cfg: AIGenerateConfig):
    """Load text model - prefer fine-tuned Llama 3.1 8B if available"""
    if cfg.use_finetuned and UNSLOTH_AVAILABLE:
        try:
            # Try to load fine-tuned model first
            if os.path.exists(cfg.finetuned_model_path):
                model, tokenizer = FastLanguageModel.from_pretrained(
                    model_name=cfg.finetuned_model_path,
                    max_seq_length=2048,
                    dtype=None,
                    load_in_4bit=True,
                )
                print("Loaded fine-tuned Llama 3.1 8B model")
                return tokenizer, model
            else:
                print("Fine-tuned model not found, loading base Llama 3.1 8B")
                model, tokenizer = FastLanguageModel.from_pretrained(
                    model_name=cfg.fallback_model,
                    max_seq_length=2048,
                    dtype=None,
                    load_in_4bit=True,
                )
                return tokenizer, model
        except Exception as e:
            print(f"Failed to load Llama model: {e}, falling back to {cfg.text_model}")
    
    # Fallback to original model
    tokenizer = AutoTokenizer.from_pretrained(cfg.text_model)
    model = AutoModelForCausalLM.from_pretrained(cfg.text_model)
    model.to(cfg.device)
    return tokenizer, model


def load_sd_pipeline(cfg: AIGenerateConfig):
    if not SD_AVAILABLE:
        raise ImportError("Stable Diffusion not available. Install with: pip install diffusers")
    
    pipe = StableDiffusionPipeline.from_pretrained(cfg.sd_model, torch_dtype=torch.float16 if cfg.device == "cuda" else torch.float32)
    pipe = pipe.to(cfg.device)
    pipe.safety_checker = None
    return pipe


def load_clip(cfg: AIGenerateConfig):
    clip_model = CLIPModel.from_pretrained(cfg.clip_model)
    clip_processor = CLIPProcessor.from_pretrained(cfg.clip_model)
    clip_model.to(cfg.device)
    return clip_model, clip_processor


def normalize_ticker(name: str) -> str:
    # derive a simple ticker from name: uppercase letters/numbers, length 3-5
    cleaned = re.sub(r"[^A-Za-z0-9]", "", name).upper()
    if len(cleaned) < 3:
        cleaned = (cleaned + "X" * 3)[:3]
    return cleaned[:5]


def text_generate_name_ticker_desc(tokenizer, model, prompt: str, max_new_tokens: int = 64) -> Tuple[str, str, str]:
    """Generate memecoin name, ticker, and description using fine-tuned model"""
    if UNSLOTH_AVAILABLE and hasattr(model, 'generate'):
        # Use fine-tuned Llama model
        prompt_text = f"Generate a memecoin based on: {prompt}\nName, ticker, and description:"
        inputs = tokenizer(prompt_text, return_tensors="pt").to(model.device)
        
        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_new_tokens=max_new_tokens,
                temperature=0.7,
                do_sample=True,
                pad_token_id=tokenizer.eos_token_id
            )
        
        text = tokenizer.decode(outputs[0], skip_special_tokens=True)
        # Extract generated content after the prompt
        generated_text = text[len(prompt_text):].strip()
    else:
        # Fallback to original method
        input_ids = tokenizer.encode(prompt + "\nName, ticker and one-line description:", return_tensors="pt").to(model.device)
        out = model.generate(input_ids, do_sample=True, max_new_tokens=max_new_tokens, temperature=0.9, top_p=0.9)
        text = tokenizer.decode(out[0], skip_special_tokens=True)
        generated_text = text[-120:]
    
    # Parse the generated text
    lines = [l.strip() for l in generated_text.splitlines() if l.strip()]
    if lines:
        gen_line = lines[0]
    else:
        gen_line = generated_text
    
    # Extract name, ticker, and description
    parts = [p.strip() for p in gen_line.split(',')]
    name = parts[0] if parts else "MemeX"
    name = name[:24] if name else "MemeX"
    
    ticker = normalize_ticker(name)
    
    if len(parts) > 2:
        desc = ','.join(parts[2:]).strip()
    else:
        desc = f"Autogenerated memecoin {name} ({ticker}) for the Solana ecosystem."
    
    return name, ticker, desc


def generate_voice_response(text: str, cfg: AIGenerateConfig) -> Optional[str]:
    """Generate voice response using ElevenLabs TTS"""
    if not cfg.use_voice or not ELEVENLABS_AVAILABLE or not cfg.elevenlabs_api_key:
        return None
    
    try:
        set_api_key(cfg.elevenlabs_api_key)
        
        # Generate audio
        audio = generate(
            text=text,
            voice=cfg.voice_id,
            model="eleven_multilingual_v2"
        )
        
        # Save audio to temporary file
        audio_path = f"/tmp/voice_response_{hashlib.md5(text.encode()).hexdigest()[:8]}.mp3"
        with open(audio_path, "wb") as f:
            f.write(audio)
        
        return audio_path
    except Exception as e:
        print(f"Voice generation failed: {e}")
        return None


async def generate_solana_query_response(query: str, cfg: AIGenerateConfig) -> Dict[str, Any]:
    """Generate comprehensive response for Solana DeFi queries"""
    tokenizer, model = load_text_model(cfg)
    
    # Create enhanced prompt for Solana-specific queries
    enhanced_prompt = f"""You are an expert Solana DeFi assistant. Answer the following question with detailed, actionable advice:

Question: {query}

Provide a comprehensive answer covering:
1. Key concepts and explanations
2. Step-by-step instructions if applicable
3. Best practices and tips
4. Common pitfalls to avoid
5. Relevant Solana protocols and tools

Answer:"""
    
    if UNSLOTH_AVAILABLE and hasattr(model, 'generate'):
        inputs = tokenizer(enhanced_prompt, return_tensors="pt").to(model.device)
        
        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_new_tokens=512,
                temperature=0.7,
                do_sample=True,
                pad_token_id=tokenizer.eos_token_id,
                eos_token_id=tokenizer.eos_token_id
            )
        
        response = tokenizer.decode(outputs[0], skip_special_tokens=True)
        # Extract only the generated response
        response = response[len(enhanced_prompt):].strip()
    else:
        # Fallback response
        response = f"I understand you're asking about: {query}. This is a Solana DeFi related question. For detailed assistance, please provide more specific information about your needs."
    
    # Generate voice response if enabled
    voice_path = None
    if cfg.use_voice:
        voice_path = generate_voice_response(response, cfg)
    
    return {
        "query": query,
        "response": response,
        "voice_path": voice_path,
        "model_used": "fine-tuned-llama" if UNSLOTH_AVAILABLE else "fallback"
    }


def generate_logo(pipe: StableDiffusionPipeline, prompt: str, out_png: str) -> Image.Image:
    result = pipe(prompt, num_inference_steps=25, guidance_scale=7.5)
    image: Image.Image = result.images[0]
    image.save(out_png)
    return image


def upload_to_web3_storage(file_path: str, token: str) -> Optional[str]:
    with open(file_path, 'rb') as f:
        data = f.read()
    r = requests.post(
        "https://api.web3.storage/upload",
        headers={"Authorization": f"Bearer {token}"},
        data=data,
        timeout=60,
    )
    if r.status_code == 200:
        cid = r.json().get('cid') or r.json().get('cid', None)
        if not cid:
            # legacy response
            cid = r.json().get('cid') or r.json().get('value', {}).get('cid')
        if cid:
            return f"ipfs://{cid}"
    return None


def upload_to_pinata(file_path: str, jwt: Optional[str] = None, api_key: Optional[str] = None, secret_key: Optional[str] = None) -> Optional[str]:
    url = "https://api.pinata.cloud/pinning/pinFileToIPFS"
    with open(file_path, 'rb') as f:
        files = {"file": (os.path.basename(file_path), f)}
        headers = {}
        if jwt:
            headers["Authorization"] = f"Bearer {jwt}"
        elif api_key and secret_key:
            headers["pinata_api_key"] = api_key
            headers["pinata_secret_api_key"] = secret_key
        r = requests.post(url, files=files, headers=headers, timeout=60)
    if r.status_code in (200, 201):
        ipfs_hash = r.json().get('IpfsHash')
        if ipfs_hash:
            return f"ipfs://{ipfs_hash}"
    return None


def clip_similarity(clip_model, clip_processor, text: str, image: Image.Image) -> float:
    inputs = clip_processor(text=[text], images=image, return_tensors="pt", padding=True).to(clip_model.device)
    with torch.no_grad():
        outputs = clip_model(**inputs)
        logits_per_image = outputs.logits_per_image  # (batch, 1)
        probs = logits_per_image.softmax(dim=1)
    # for single text prompt: probs[0][0] can be used; normalize to 0..1
    score = float(probs[0][0].item())
    return score


def anti_vamp_check(clip_model, clip_processor, new_text: str, new_image: Optional[Image.Image], corpus: List[Dict[str, Any]], threshold: float = 0.8) -> bool:
    # Returns True if similar (potential vamp) found
    for item in corpus:
        old_text = item.get('text', '')
        old_img_path = item.get('image_path')
        score_text = 1.0 if old_text and new_text and old_text.lower() == new_text.lower() else 0.0
        score_img = 0.0
        if new_image and old_img_path and os.path.exists(old_img_path):
            try:
                old_img = Image.open(old_img_path).convert('RGB')
                score_img = clip_similarity(clip_model, clip_processor, new_text or old_text, old_img)
            except Exception:
                pass
        score = max(score_text, score_img)
        if score >= threshold:
            return True
    return False


def parse_x_link_text(url: str) -> str:
    # Simple fetch for tweet text via public HTML (not API); robust impl should use X API
    try:
        r = requests.get(url, timeout=30)
        if r.status_code == 200:
            m = re.search(r"<meta property=\"og:description\" content=\"(.*?)\">", r.text)
            if m:
                return re.sub(r"\s+", " ", m.group(1)).strip()
    except Exception:
        pass
    return ""


def gen_from_prompt(prompt: str, cfg: Optional[AIGenerateConfig] = None) -> Dict[str, Any]:
    cfg = cfg or AIGenerateConfig()
    tokenizer, model = load_text_model(cfg)
    name, ticker, desc = text_generate_name_ticker_desc(tokenizer, model, prompt)
    return {"name": name, "ticker": ticker, "description": desc}


def gen_logo(prompt: str, out_dir: str = ".", cfg: Optional[AIGenerateConfig] = None) -> Dict[str, Any]:
    cfg = cfg or AIGenerateConfig()
    os.makedirs(out_dir, exist_ok=True)
    pipe = load_sd_pipeline(cfg)
    out_png = os.path.join(out_dir, f"logo_{hashlib.md5(prompt.encode()).hexdigest()[:8]}.png")
    image = generate_logo(pipe, prompt, out_png)

    ipfs_uri = None
    if cfg.pinata_jwt or (cfg.pinata_api_key and cfg.pinata_secret_api_key):
        ipfs_uri = upload_to_pinata(out_png, cfg.pinata_jwt, cfg.pinata_api_key, cfg.pinata_secret_api_key)
    elif cfg.web3_storage_token:
        ipfs_uri = upload_to_web3_storage(out_png, cfg.web3_storage_token)

    return {"path": out_png, "ipfs": ipfs_uri}


def gen_from_x_link(x_url: str, cfg: Optional[AIGenerateConfig] = None) -> Dict[str, Any]:
    cfg = cfg or AIGenerateConfig()
    tweet_text = parse_x_link_text(x_url)
    if not tweet_text:
        tweet_text = "Meme coin idea: fun dog, lasers, community vibes"
    return gen_from_prompt(tweet_text, cfg)


async def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", choices=["prompt", "x", "logo", "query", "voice"], required=True)
    parser.add_argument("--input", required=True, help="Prompt text, X link, or query")
    parser.add_argument("--out_dir", default=".")
    parser.add_argument("--anti_vamp_demo", action="store_true")
    parser.add_argument("--use_voice", action="store_true", help="Generate voice response")
    parser.add_argument("--voice_id", default="21m00Tcm4TlvDq8ikWAM", help="ElevenLabs voice ID")
    args = parser.parse_args()

    cfg = AIGenerateConfig()
    cfg.use_voice = args.use_voice
    cfg.voice_id = args.voice_id

    if args.mode == "prompt":
        data = gen_from_prompt(args.input, cfg)
        print(json.dumps(data, indent=2))
    elif args.mode == "x":
        data = gen_from_x_link(args.input, cfg)
        print(json.dumps(data, indent=2))
    elif args.mode == "logo":
        if not SD_AVAILABLE:
            print("Stable Diffusion not available. Install with: pip install diffusers")
            return
        data = gen_logo(args.input, args.out_dir, cfg)
        print(json.dumps(data, indent=2))
    elif args.mode == "query":
        data = await generate_solana_query_response(args.input, cfg)
        print(json.dumps(data, indent=2))
    elif args.mode == "voice":
        if not ELEVENLABS_AVAILABLE:
            print("ElevenLabs not available. Install with: pip install elevenlabs")
            return
        voice_path = generate_voice_response(args.input, cfg)
        result = {"text": args.input, "voice_path": voice_path}
        print(json.dumps(result, indent=2))

    if args.anti_vamp_demo and args.mode == "logo":
        clip_m, clip_p = load_clip(cfg)
        # Demo corpus; replace with cached prior launches
        corpus = [{"text": "funny dog meme", "image_path": data.get("path")}]
        img = Image.open(data.get("path")).convert('RGB')
        is_similar = anti_vamp_check(clip_m, clip_p, "funny dog meme", img, corpus, threshold=0.8)
        print(json.dumps({"anti_vamp_possible_duplicate": is_similar}))


if __name__ == "__main__":
    """
    Sample runs:
    - Text gen:    python ai_generate.py --mode prompt --input "Generate a degen dog meme coin"
    - From X:      python ai_generate.py --mode x --input "https://x.com/.../status/12345"
    - Logo gen:    python ai_generate.py --mode logo --input "retro neon dog meme coin logo" --out_dir ./out
    - Anti-vamp:   python ai_generate.py --mode logo --input "doge logo" --anti_vamp_demo
    - Query:       python ai_generate.py --mode query --input "How do I launch a memecoin on Solana?"
    - Voice:       python ai_generate.py --mode voice --input "Hello, this is a test" --use_voice

    Notes:
    - For GPU, ensure CUDA + set env WEB3_STORAGE_TOKEN or PINATA_JWT for IPFS uploads.
    - For voice, set ELEVENLABS_API_KEY environment variable.
    - For fine-tuned model, ensure llama3.1-8b-solana directory exists with trained weights.
    - For Colab, pip install -r requirements.txt and run the same commands.
    """
    import asyncio
    asyncio.run(main())
