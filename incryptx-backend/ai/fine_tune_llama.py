#!/usr/bin/env python3
"""
Fine-tune Llama 3.1 8B with LoRA on Solana DeFi datasets using Unsloth
"""

import os
import json
import torch
from datasets import Dataset
from transformers import TrainingArguments
from trl import SFTTrainer
from peft import LoraConfig
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    from unsloth import FastLanguageModel
    UNSLOTH_AVAILABLE = True
except ImportError:
    UNSLOTH_AVAILABLE = False
    logger.error("Unsloth not available. Install with: pip install unsloth")

# Configuration
MODEL_NAME = "meta-llama/Llama-3.1-8B"
FINETUNED_MODEL_PATH = "./llama3.1-8b-solana"
DATASET_PATH = "solana_defi_dataset.json"
HF_TOKEN = os.getenv("HF_TOKEN")  # HuggingFace token for uploading

# Create synthetic Solana DeFi dataset based on ProjectInfo.md
def create_solana_dataset():
    """Create a comprehensive Solana DeFi dataset based on project documentation"""
    
    # Base dataset from ProjectInfo.md and Solana DeFi knowledge
    data = [
        # IncryptX Launchpad
        {
            "instruction": "Explain how to launch a memecoin on IncryptX Launchpad.",
            "output": "To launch a memecoin on IncryptX Launchpad, you have two modes: Degen Mode for quick launches and Custom Mode for advanced projects. Connect your wallet (Phantom), provide token details (name, symbol, supply), and the platform handles smart contract deployment and liquidity pool creation. The platform includes AI assistance for generating token metadata, anti-vampire checks to prevent duplicates, and integrated staking to incentivize holding. Post-bonding curve, tokens can migrate to multiple DEXs including IncryptX Swap, Raydium, Meteora, or split liquidity across platforms."
        },
        {
            "instruction": "What are the benefits of using IncryptX Swap?",
            "output": "IncryptX Swap is a next-gen AMM DEX with 'X Curve AMM' mechanics, blending dynamic bonding curves and liquidity market makers. It offers configurable fees, AI-optimized liquidity, and incentives for long-term holding. The platform addresses DEX issues like impermanent loss, low liquidity for new tokens, and dump vulnerability. It features hype-adaptive liquidity that adjusts based on real-time data, gamified pools with yield competitions, and buyback models for deflationary tokenomics."
        },
        {
            "instruction": "How can I track whale movements on Solana?",
            "output": "IncryptX Trade offers a Wallet Tracking feature that provides real-time alerts on whale movements. This can be integrated with services like Helius webhooks to monitor large transactions and portfolio changes. The platform leverages dedicated nodes for MEV protection and advanced RPC providers like Helius with globally distributed infrastructure for low-latency execution ideal for high-frequency trading and DeFi operations."
        },
        {
            "instruction": "What is LoRA in the context of LLM fine-tuning?",
            "output": "LoRA (Low-Rank Adaptation) is a parameter-efficient fine-tuning technique for large language models. It freezes the pre-trained model weights and injects trainable rank decomposition matrices into the Transformer architecture, significantly reducing the number of trainable parameters and computational cost while maintaining performance. This makes fine-tuning large models like Llama 3.1 8B feasible on consumer hardware."
        },
        {
            "instruction": "Describe Solana's transaction model.",
            "output": "Solana uses a unique transaction processing model called Proof of History (PoH) combined with Proof of Stake (PoS). PoH is a decentralized clock that cryptographically verifies the order and passage of time between events, allowing for high throughput and parallel transaction processing without a mempool in the traditional sense. Transactions are processed by validators in a pipelined fashion, enabling up to 65,000 transactions per second."
        },
        {
            "instruction": "What is MEV protection on Solana?",
            "output": "MEV (Maximal Extractable Value) protection on Solana aims to prevent front-running and sandwich attacks. Platforms like IncryptX Trade leverage dedicated nodes and advanced RPC providers like Helius to bundle transactions and ensure low-latency, fair execution, mitigating MEV opportunities. This includes anti-MEV designs that block bundle transactions to prevent front-running and ensure fairer launches."
        },
        {
            "instruction": "How does IncryptX Perps work?",
            "output": "IncryptX Perps is a decentralized perpetual futures market for leveraged trading on qualified tokens. It uses a hybrid AMM mechanism ('X Skew AMM') to provide constant liquidity, even for low-volume memecoins, and isolated pools to mitigate risks. It integrates with oracles like Pyth for real-time pricing and supports up to 100x leverage with isolated AMM pools for safety and efficiency."
        },
        {
            "instruction": "What is a bonding curve in DeFi?",
            "output": "A bonding curve is a mathematical curve that defines a relationship between price and token supply. As more tokens are bought, the price increases, and as more are sold, the price decreases. They are often used in token launches to provide continuous liquidity and price discovery. IncryptX Launchpad uses bonding curves that start at near-zero market cap and curve to migration at around $69K for fair distribution without pre-mints."
        },
        {
            "instruction": "How can I use the IncryptX Telegram bot for trading?",
            "output": "The IncryptX Telegram bot allows for advanced on-the-go token analysis, wallet tracking notifications, and lightning-fast trading. You can use commands like /trade to execute swaps, /limit to set limit orders, and /copy to mirror successful traders. The bot supports copy trading where you can auto-mirror successful wallets with consent-based 1% fee sharing."
        },
        {
            "instruction": "What is the purpose of the IncryptX AI Assistant?",
            "output": "The IncryptX AI Assistant provides intelligent support for farming, trading strategies, emotional support, and trade execution. It's designed to be self-learning, fine-tuned on Solana-specific data, and can offer voice-enabled interactions for queries and trade suggestions. The assistant helps users navigate the complex DeFi landscape with personalized advice and automated trade execution capabilities."
        },
        # Additional Solana DeFi concepts
        {
            "instruction": "How does Jupiter aggregator work on Solana?",
            "output": "Jupiter is a DEX aggregator on Solana that finds the best routes for token swaps across multiple DEXs. It splits large trades across different liquidity sources to minimize slippage and maximize execution efficiency. Jupiter integrates with Raydium, Orca, Serum, and other Solana DEXs to provide optimal swap routes and prices for users."
        },
        {
            "instruction": "What is the difference between Serum and Raydium?",
            "output": "Serum is a decentralized exchange built on Solana that uses a central limit order book (CLOB) model, while Raydium is an automated market maker (AMM) that uses constant product formulas for price discovery. Serum provides more precise price control through limit orders, while Raydium offers simpler liquidity provision through AMM pools. Both are integrated into the broader Solana DeFi ecosystem."
        },
        {
            "instruction": "How do I stake SOL on Solana?",
            "output": "You can stake SOL by delegating your tokens to a validator. Choose a validator with good uptime and commission rates, then delegate your SOL to earn staking rewards. Validators process transactions and maintain network security, and stakers receive rewards in proportion to their stake. You can stake through wallets like Phantom, Solflare, or directly through the Solana CLI."
        },
        {
            "instruction": "What are the risks of yield farming on Solana?",
            "output": "Yield farming risks on Solana include smart contract risks, impermanent loss in liquidity pools, token price volatility, and protocol changes. Always research the protocols you're farming with, check audit reports, and understand the tokenomics. Diversify your farming positions and never invest more than you can afford to lose. Monitor your positions regularly and be aware of potential rug pulls or protocol exploits."
        },
        {
            "instruction": "How do I create an NFT on Solana?",
            "output": "To create an NFT on Solana, you can use platforms like Metaplex, which provides tools for minting NFTs. First, prepare your image and metadata, then use Metaplex's Candy Machine or direct minting tools. You'll need SOL for transaction fees and storage costs. The NFT will be stored on-chain with metadata pointing to your image hosted on IPFS or Arweave."
        },
        {
            "instruction": "What is Meteora's Dynamic Liquidity Market Maker (DLMM)?",
            "output": "Meteora's DLMM is an advanced AMM that uses concentrated liquidity bins instead of a single curve. This allows liquidity providers to concentrate their liquidity around specific price ranges, earning more fees while providing better price discovery. The DLMM adapts to market conditions and provides more efficient capital utilization compared to traditional AMMs."
        },
        {
            "instruction": "How does copy trading work in DeFi?",
            "output": "Copy trading in DeFi allows users to automatically replicate the trades of successful traders. Platforms like IncryptX Trade enable users to select a trader to copy, set allocation limits, and automatically execute trades when the copied trader makes moves. This is consent-based with fee sharing, typically 1% of profits going to the original trader. It helps less experienced users benefit from expert strategies."
        },
        {
            "instruction": "What are the benefits of using Helius for Solana RPC?",
            "output": "Helius provides advanced RPC services for Solana with globally distributed infrastructure across three continents, 99.99% uptime, and 5x faster transaction confirmations. It offers specialized APIs for low-latency execution ideal for high-frequency trading and DeFi operations without congestion delays. Exclusive features include real-time webhooks, enhanced transaction indexing, and MEV protection."
        },
        {
            "instruction": "How do I migrate a token from bonding curve to DEX?",
            "output": "Token migration from bonding curve to DEX typically happens automatically when the bonding curve reaches a certain market cap threshold. On IncryptX Launchpad, tokens migrate at around $69K market cap to platforms like Raydium, Meteora, or IncryptX Swap. The migration process involves creating liquidity pools, locking liquidity, and transferring ownership to ensure the token becomes tradeable on the DEX."
        },
        {
            "instruction": "What is anti-vampire protection in token launches?",
            "output": "Anti-vampire protection prevents token duplication and copycats during launches. IncryptX Launchpad uses AI-driven protection that scans for duplicates based on image/text similarity and blocks token creation when similarity is 80% or higher within a defined time window. This preserves originality and prevents copycats while keeping the launchpad fair for legitimate projects."
        }
    ]
    
    # Format for SFTTrainer
    formatted_data = []
    for item in data:
        formatted_data.append({
            "text": f"### Instruction:\n{item['instruction']}\n\n### Output:\n{item['output']}"
        })
    
    # Save to JSON file
    with open(DATASET_PATH, "w") as f:
        json.dump(formatted_data, f, indent=2)
    
    return Dataset.from_list(formatted_data)

def fine_tune_llama():
    """Fine-tune Llama 3.1 8B with LoRA on Solana DeFi dataset"""
    
    if not UNSLOTH_AVAILABLE:
        logger.error("Unsloth not available. Please install it first.")
        return
    
    logger.info("Starting Llama 3.1 8B fine-tuning with LoRA...")
    
    # 1. Load the model and tokenizer
    logger.info("Loading Llama 3.1 8B model...")
    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name=MODEL_NAME,
        max_seq_length=2048,
        dtype=None,  # Auto detects bfloat16 or float16
        load_in_4bit=True,  # Quantize model to 4-bit
    )
    
    # 2. Prepare the dataset
    logger.info(f"Creating Solana DeFi dataset at {DATASET_PATH}...")
    solana_dataset = create_solana_dataset()
    logger.info(f"Dataset created with {len(solana_dataset)} examples")
    
    # 3. Configure LoRA adapters
    logger.info("Configuring LoRA adapters...")
    model = FastLanguageModel.get_peft_model(
        model,
        r=16,  # Choose any number from 8 to 64
        lora_alpha=16,  # Choose any number from 16 to 128
        lora_dropout=0,  # Supports any number from 0 to 0.6
        target_modules=[
            "q_proj", "k_proj", "v_proj", "o_proj",
            "gate_proj", "up_proj", "down_proj",
        ],
        use_rslora=True,  # We support rank stabilized LoRA
        use_gradient_checkpointing="unsloth",  # True or "unsloth" for optimized gradient checkpointing
        random_state=3407,
        max_seq_length=2048,
    )
    logger.info("LoRA adapters configured successfully")
    
    # 4. Fine-tune the model
    logger.info("Starting training...")
    trainer = SFTTrainer(
        model=model,
        tokenizer=tokenizer,
        train_dataset=solana_dataset,
        dataset_text_field="text",
        max_seq_length=2048,
        args=TrainingArguments(
            per_device_train_batch_size=2,
            gradient_accumulation_steps=4,
            warmup_steps=10,
            max_steps=60,  # Reduced for quick demo, increase for better quality
            learning_rate=2e-4,
            fp16=not torch.cuda.is_bf16_supported(),  # Use fp16 if bfloat16 not supported
            bf16=torch.cuda.is_bf16_supported(),  # Use bfloat16 if supported
            logging_steps=1,
            output_dir=FINETUNED_MODEL_PATH,
            optim="adamw_8bit",
            seed=3407,
            report_to="none",  # Disable reporting to HuggingFace Hub for local training
        ),
    )
    
    trainer.train()
    logger.info("Training completed successfully")
    
    # 5. Save the fine-tuned model
    logger.info(f"Saving fine-tuned model to {FINETUNED_MODEL_PATH}...")
    model.save_pretrained(FINETUNED_MODEL_PATH)
    tokenizer.save_pretrained(FINETUNED_MODEL_PATH)
    logger.info("Model saved successfully")
    
    # Optional: Upload to HuggingFace Hub
    if HF_TOKEN:
        logger.info("Uploading model to HuggingFace Hub...")
        model.push_to_hub(FINETUNED_MODEL_PATH.replace("./", ""), token=HF_TOKEN)
        tokenizer.push_to_hub(FINETUNED_MODEL_PATH.replace("./", ""), token=HF_TOKEN)
        logger.info("Model uploaded to HuggingFace Hub successfully")
    else:
        logger.info("HuggingFace token not found. Skipping upload to HuggingFace Hub.")
    
    # 6. Evaluation (simple loss check)
    logger.info("Evaluating training results...")
    metrics = trainer.state.log_history
    final_loss = metrics[-1]['loss'] if metrics and 'loss' in metrics[-1] else float('inf')
    logger.info(f"Final training loss: {final_loss}")
    
    # Assert loss is below threshold
    assert final_loss < 2.0, f"Training loss {final_loss} is not below 2.0"
    logger.info("✅ Training loss assertion passed")
    
    # Generate sample predictions
    logger.info("Generating sample predictions...")
    sample_queries = [
        "How do I launch a memecoin on Solana?",
        "What is the best way to avoid MEV on Solana?",
        "Explain IncryptX Swap's X Curve AMM"
    ]
    
    for query in sample_queries:
        prompt = f"### Instruction:\n{query}\n\n### Output:\n"
        inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
        
        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_new_tokens=200,
                temperature=0.7,
                do_sample=True,
                pad_token_id=tokenizer.eos_token_id
            )
        
        response = tokenizer.decode(outputs[0], skip_special_tokens=True)
        response = response[len(prompt):].strip()
        logger.info(f"Query: {query}")
        logger.info(f"Response: {response}")
        logger.info("-" * 50)
    
    logger.info("Fine-tuning completed successfully!")
    return final_loss

if __name__ == "__main__":
    fine_tune_llama()