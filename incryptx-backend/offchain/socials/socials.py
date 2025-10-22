#!/usr/bin/env python3
import os
import time
import json
import argparse
from typing import List, Dict, Any

import requests
import tweepy
from dotenv import load_dotenv

load_dotenv()

TW_BEARER = os.getenv("TWITTER_BEARER", "")
HELIUS_RPC = os.getenv("HELIUS_RPC", "https://api.devnet.solana.com")

def get_twitter_client() -> tweepy.Client:
    if not TW_BEARER:
        raise SystemExit("TWITTER_BEARER not set in .env")
    return tweepy.Client(bearer_token=TW_BEARER, wait_on_rate_limit=True)

def scan_tweets(username: str, hashtag: str = "#IncryptXLaunch", max_results: int = 10) -> List[Dict[str, Any]]:
    client = get_twitter_client()
    query = f"{hashtag} from:{username}"
    resp = client.search_recent_tweets(query=query, max_results=max_results, tweet_fields=["created_at","author_id","text"])  # type: ignore
    tweets = []
    for tw in resp.data or []:
        tweets.append({"id": tw.id, "text": tw.text, "author_id": tw.author_id, "created_at": str(tw.created_at)})
    return tweets

def verify_launch(username: str, profile_pda: str) -> bool:
    # Stub: verify username is linked to profile PDA on-chain (via Anchorpy)
    # Here we simply return True to proceed in dev mode
    return bool(username and profile_pda)

def post_update(text: str) -> None:
    # Stub: Would call OAuth 1.0 endpoints to post tweet via write creds
    print(f"[auto_post] {text}")

def bounty_hunt() -> List[str]:
    # Stub: search mentions and return hashes submitted on-chain
    return ["hash_stub_1", "hash_stub_2"]

def auto_from_onchain_events() -> None:
    # Poll Helius RPC for program logs (stub)
    print("[auto_from_onchain] checked events")

def main_loop(username: str) -> None:
    while True:
        try:
            tweets = scan_tweets(username)
            for t in tweets:
                if "launch" in t["text"].lower():
                    post_update(f"Detected launch tweet {t['id']} from {username}")
            auto_from_onchain_events()
        except Exception as e:
            print(f"[err] {e}")
        time.sleep(300)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--poll", action="store_true")
    parser.add_argument("--user", default="IncryptX")
    parser.add_argument("--test-scan", action="store_true")
    args = parser.parse_args()
    if args.test_scan:
        # Mock mode: print a fake tweet
        print(json.dumps([{"id":"1","text":"#IncryptXLaunch new meme","author_id":"u","created_at":"now"}]))
    elif args.poll:
        main_loop(args.user)
    else:
        print("Use --test-scan or --poll")
