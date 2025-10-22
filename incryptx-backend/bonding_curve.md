<code_editing_rules>
- Modular: Break into lib.rs instructions (init_pool, buy, sell, migrate).
- Testing: Include Anchor tests for curve math, e.g., assert price rises linearly.
</code_editing_rules>
<project_guidelines>
- Reference Solana Rust SDK for Token CPI; Anchor for PDAs.
- Security: Check signer ownership, bump seeds; anti-rug auto-lock LP.
</project_guidelines>
<persistence>
- Assume 1B supply default; document for custom.
- Use devnet for tests.
</persistence>
<self_reflection>
- Rubric: Feasibility (Pump.fun-like curve), Security (PDA/ownership), Modularity (reusable CPI), Testing (unit + validator), Scalability (handle 10k buys), Best Practices (Anchor 0.30+).
- Iterate: Ensure no overflow in u64 math.
</self_reflection>
Task: Create 'programs/incryptx-launchpad/programs/bonding_curve/src/lib.rs' and tests. Implement linear bonding curve: init with name/symbol/image (IPFS hash), buy (add SOL, mint tokens), sell (burn tokens, get SOL), migrate at threshold (CPI to AMM). Include anti-snipe VRF stub. Generate full Anchor code + tests.md with `anchor test` examples. Output code blocks.