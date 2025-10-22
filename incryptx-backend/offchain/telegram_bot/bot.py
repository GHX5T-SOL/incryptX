#!/usr/bin/env python3
import os
import asyncio
import json
import shlex
from typing import Optional

from dotenv import load_dotenv
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

import aiohttp

BOT_RATE_LIMIT_SECONDS = 1.0

load_dotenv()
BOT_TOKEN = os.getenv("BOT_TOKEN", "")
HELIUS_RPC = os.getenv("HELIUS_RPC", "https://api.devnet.solana.com")

# --- Utilities ---
_last_called: dict[int, float] = {}

async def rate_limited(user_id: int) -> bool:
    now = asyncio.get_event_loop().time()
    last = _last_called.get(user_id, 0.0)
    if now - last < BOT_RATE_LIMIT_SECONDS:
        return False
    _last_called[user_id] = now
    return True

async def ai_bridge_analyze(topic: str) -> str:
    # Call TS bridge via node if available (stub)
    # Fallback to simple echo
    return f"Analysis result for: {topic} (stub)"

async def call_ai_generate(prompt: str) -> dict:
    # Integrate with existing ai/ai_generate.py via subprocess
    # Non-blocking using asyncio.create_subprocess_exec
    script_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "ai", "ai_generate.py"))
    # If not present, return stub
    if not os.path.exists(script_path):
        return {"name": "DERP", "ticker": "DERP", "description": f"Auto {prompt}", "logo_ipfs": "ipfs://stub"}
    proc = await asyncio.create_subprocess_exec(
        "python3", script_path, "--mode", "gen", "--prompt", prompt,
        stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
    )
    stdout, _ = await proc.communicate()
    try:
        return json.loads(stdout.decode("utf-8"))
    except Exception:
        return {"name": "DERP", "ticker": "DERP", "description": f"Auto {prompt}", "logo_ipfs": "ipfs://stub"}

async def fetch_portfolio(pubkey: str) -> dict:
    # Minimal RPC fetch stub (balances, tokens)
    async with aiohttp.ClientSession() as session:
        # get balance
        async with session.post(HELIUS_RPC, json={
            "jsonrpc": "2.0", "id": 1, "method": "getBalance", "params": [pubkey]
        }) as resp:
            bal = await resp.json()
        return {"lamports": bal.get("result", {}).get("value", 0)}

# --- Handlers ---
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text("Welcome to IncryptX Bot! Use /launch /trade /copy /analyze /portfolio")

async def launch(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not await rate_limited(update.effective_user.id):
        return
    prompt = " ".join(context.args) if context.args else "meme dog coin"
    await update.message.reply_text("Generating memecoin with AI...")
    ai = await call_ai_generate(prompt)
    # Anti-vamp + init_pool CPI would be done here (stubbed)
    await update.message.reply_text(f"Created: {ai.get('name')} ({ai.get('ticker')}) - {ai.get('logo_ipfs')}")

async def trade(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not await rate_limited(update.effective_user.id):
        return
    # Expect format: /trade $TOKEN buy 1.23
    txt = " ".join(context.args)
    await update.message.reply_text(f"Trade request received: {txt} (stub)")

async def copy(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not await rate_limited(update.effective_user.id):
        return
    # Example: /copy <leader_pubkey>
    leader = context.args[0] if context.args else ""
    if not leader:
        await update.message.reply_text("Usage: /copy <leader_pubkey>")
        return
    await update.message.reply_text(f"Copy-trading enabled for {leader} (stub)")

async def analyze(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not await rate_limited(update.effective_user.id):
        return
    topic = " ".join(context.args) if context.args else "market"
    res = await ai_bridge_analyze(topic)
    await update.message.reply_text(res)

async def portfolio(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not await rate_limited(update.effective_user.id):
        return
    pk = context.args[0] if context.args else ""
    if not pk:
        await update.message.reply_text("Usage: /portfolio <wallet_pubkey>")
        return
    data = await fetch_portfolio(pk)
    await update.message.reply_text(f"Lamports: {data.get('lamports', 0)}")

# Wallet tracking stub (webhook/polling)
async def wallet_tracker_task() -> None:
    while True:
        await asyncio.sleep(30)  # placeholder

def main() -> None:
    if not BOT_TOKEN:
        raise SystemExit("BOT_TOKEN not set")
    application = Application.builder().token(BOT_TOKEN).build()
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("launch", launch))
    application.add_handler(CommandHandler("trade", trade))
    application.add_handler(CommandHandler("copy", copy))
    application.add_handler(CommandHandler("analyze", analyze))
    application.add_handler(CommandHandler("portfolio", portfolio))

    # Start background tracking task
    async def on_startup(app: Application) -> None:
        app.job_queue.run_repeating(lambda *_: None, interval=3600)  # placeholder
        app.create_task(wallet_tracker_task())

    application.run_polling(allowed_updates=Update.ALL_TYPES, stop_signals=None)

if __name__ == "__main__":
    main()
