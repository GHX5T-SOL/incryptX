import os
import sys
# Ensure parent directory (containing socials.py) is on path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import json
import types
import pytest
import socials as mod

class DummyTweet:
    def __init__(self, id, text, author_id):
        self.id = id
        self.text = text
        self.author_id = author_id
        self.created_at = "now"

class DummyClient:
    def search_recent_tweets(self, query, max_results, tweet_fields):
        return types.SimpleNamespace(data=[DummyTweet("1", "#IncryptXLaunch go", "u1")])

@pytest.fixture(autouse=True)
def patch_client(monkeypatch):
    monkeypatch.setenv("TWITTER_BEARER", "x")
    monkeypatch.setattr(mod, "get_twitter_client", lambda: DummyClient())

def test_scan_tweets():
    tweets = mod.scan_tweets("user")
    assert tweets and tweets[0]["text"].startswith("#IncryptXLaunch")

def test_post_update(capsys):
    mod.post_update("hello")
    captured = capsys.readouterr()
    assert "[auto_post] hello" in captured.out
