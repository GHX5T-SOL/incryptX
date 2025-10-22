import pytest
from types import SimpleNamespace

import bot as botmod  # run pytest from telegram_bot dir

class DummyMessage:
    def __init__(self):
        self.sent = []
    async def reply_text(self, text: str):
        self.sent.append(text)

class DummyUser:
    def __init__(self):
        self.id = 1

@pytest.mark.asyncio
async def test_start_handler():
    msg = DummyMessage()
    upd = SimpleNamespace(message=msg, effective_user=DummyUser())
    ctx = SimpleNamespace(args=[])
    await botmod.start(upd, ctx)
    assert any("Welcome" in s for s in msg.sent)

@pytest.mark.asyncio
async def test_analyze_handler():
    msg = DummyMessage()
    upd = SimpleNamespace(message=msg, effective_user=DummyUser())
    ctx = SimpleNamespace(args=["BTC"])
    await botmod.analyze(upd, ctx)
    assert any("Analysis" in s for s in msg.sent)
