<project_guidelines>
- Language: Rust for Solana; Python/TS for off-chain/AI.
- Security: Always include PDA checks in Anchor examples.
- Tools: Cursor AI for gen; Hugging Face for LLM fine-tuning.
</project_guidelines>
<coding_principles>
- Modular: Separate setup into env, tools, deps sections.
- Testing: Include test-validator init.
</coding_principles>
<persistence>
- Assume macOS/Linux; document Windows alternatives.
- Proceed with reasonable defaults (e.g., Solana devnet).
</persistence>
<self_reflection>
- Rubric: Completeness (all tools covered), Feasibility (step-by-step CLI), Modularity (sections), Security (keygen safe), Testing (validator spin), AI Readiness (HF install).
- Iterate for top marks: Ensure GPU-optional paths.
</self_reflection>
Task: Generate a detailed Markdown file 'setup.md' for IncryptX backend setup. Include sections: 1. Solana/Anchor install. 2. Rust/Python/Node deps. 3. Git init for backend repo. 4. Comput3 signup for GPU. 5. VS Code/Cursor extensions (Rust Analyzer, Solana Tools). Output only the MD content.