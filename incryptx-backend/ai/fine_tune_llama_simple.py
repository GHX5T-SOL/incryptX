#!/usr/bin/env python3
"""
Simplified fine-tune Llama 3.1 8B with LoRA on Solana DeFi datasets using standard transformers
"""

import os
import json
import torch
from datasets import Dataset
from transformers import (
    AutoTokenizer, 
    AutoModelForCausalLM, 
    TrainingArguments, 
    Trainer,
    BitsAndBytesConfig
)
from peft import LoraConfig, get_peft_model, TaskType
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
MODEL_NAME = "microsoft/DialoGPT-medium"  # Using a smaller model for demo
FINETUNED_MODEL_PATH = "./dialoGPT-solana"
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
        }
    ]
    
    # Format for training
    formatted_data = []
    for item in data:
        formatted_data.append({
            "text": f"Human: {item['instruction']}\nAssistant: {item['output']}"
        })
    
    # Save to JSON file
    with open(DATASET_PATH, "w") as f:
        json.dump(formatted_data, f, indent=2)
    
    return Dataset.from_list(formatted_data)

def fine_tune_llama():
    """Fine-tune Llama 3.1 8B with LoRA on Solana DeFi dataset"""
    
    logger.info("Starting DialoGPT fine-tuning with LoRA...")
    
    # 1. Load the model and tokenizer
    logger.info("Loading DialoGPT model...")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    
    # Add padding token if it doesn't exist
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
    
    # Configure quantization for memory efficiency
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_use_double_quant=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.bfloat16
    )
    
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME,
        quantization_config=bnb_config,
        device_map="auto",
        trust_remote_code=True
    )
    
    # 2. Prepare the dataset
    logger.info(f"Creating Solana DeFi dataset at {DATASET_PATH}...")
    solana_dataset = create_solana_dataset()
    logger.info(f"Dataset created with {len(solana_dataset)} examples")
    
    # 3. Configure LoRA adapters
    logger.info("Configuring LoRA adapters...")
    lora_config = LoraConfig(
        task_type=TaskType.CAUSAL_LM,
        r=16,
        lora_alpha=32,
        lora_dropout=0.1,
        target_modules=["c_attn", "c_proj", "wte", "wpe"]
    )
    
    model = get_peft_model(model, lora_config)
    model.print_trainable_parameters()
    
    # 4. Fine-tune the model
    logger.info("Starting training...")
    training_args = TrainingArguments(
        output_dir=FINETUNED_MODEL_PATH,
        per_device_train_batch_size=1,
        gradient_accumulation_steps=4,
        warmup_steps=10,
        max_steps=50,  # Reduced for quick demo
        learning_rate=2e-4,
        fp16=True,
        logging_steps=1,
        save_steps=25,
        evaluation_strategy="no",
        save_total_limit=2,
        remove_unused_columns=False,
        push_to_hub=False,
        report_to="none"
    )
    
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=solana_dataset,
        tokenizer=tokenizer,
    )
    
    trainer.train()
    logger.info("Training completed successfully")
    
    # 5. Save the fine-tuned model
    logger.info(f"Saving fine-tuned model to {FINETUNED_MODEL_PATH}...")
    model.save_pretrained(FINETUNED_MODEL_PATH)
    tokenizer.save_pretrained(FINETUNED_MODEL_PATH)
    logger.info("Model saved successfully")
    
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
        prompt = f"Human: {query}\nAssistant:"
        inputs = tokenizer(prompt, return_tensors="pt")
        
        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_new_tokens=100,
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
