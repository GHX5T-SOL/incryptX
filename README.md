# IncryptX – Solana DeFi Platform (Launchpad • Trade • Perps • Socials)

![IncryptX Logo](https://i.ibb.co/4ntZscFS/Incrypt-Logo.png)

[![GitHub Stars](https://img.shields.io/github/stars/GHX5T-SOL/incryptX?style=social)](https://github.com/GHX5T-SOL/incryptX)
[![GitHub Forks](https://img.shields.io/github/forks/GHX5T-SOL/incryptX?style=social)](https://github.com/GHX5T-SOL/incryptX/fork)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](#license--usage)
[![Deployed on Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black.svg)](https://incryptx-demo.vercel.app)

IncryptX is a professional, end‑to‑end DeFi platform on Solana. It unifies a permissionless Launchpad, advanced Trading, Perpetuals (Perps), Socials (Twitter‑like feed), and a Telegram bot into a cohesive product. This repository uses mocked data to demonstrate the user interface and product flow.

## Live Demo

- Demo: [incryptx-demo.vercel.app](https://incryptx-demo.vercel.app)
- X (Twitter): [@Incrypt_defi](https://x.com/Incrypt_defi)
- Repository: [GHX5T-SOL/incryptX](https://github.com/GHX5T-SOL/incryptX)
- Contact: <incryptinvestments@protonmail.com>

## Core Features

- **Launchpad**: Degen and Custom launches, staking integration, Anti‑Vamp Mode (AI blocks token creations with ≥80% similarity in a time window), and multi‑DEX migration.
- **Trade**: Swap, advanced trading (limit/stop), P2P escrow, leaderboards, wallet tracking, copy trading.
- **Perps**: Decentralized perpetuals with isolated AMM pools and eligibility gating.
- **Socials**: On‑chain, Twitter‑like feed with posts, replies, reposts, hashtags, and optional cross‑posting to X.
- **Telegram Bot**: Launch, trade, and portfolio actions from chat with command shortcuts.

## Tech Stack

- React, Vite, React Router, Framer Motion, Recharts, Tailwind CSS, Heroicons
- Mock data services and wallet adapter shims for demonstration

## Quick Start

1. **Clone the Repo** 📥

   ```bash
   git clone https://github.com/GHX5T-SOL/incryptX.git
   cd incryptX
   ```

2. **Install Dependencies** 🛠️

   ```bash
   npm install
   ```

3. **Run Locally** 🔥

   ```bash
   npm run dev
   ```
   Open <http://localhost:5173>

4. **Build for Prod** 🏗️

   ```bash
   npm run build
   ```

## Project Structure

```text
incryptx/
├── public/             # Static assets & mock data
│   ├── assets/
│   │   ├── images/
│   │   └── mock-data/ # JSON files for tokens, users, posts
├── src/
│   ├── components/     # Reusable UI bits (Navbar, Modal, etc.)
│   ├── hooks/          # Custom hooks (mock wallet, data, API)
│   ├── pages/
│   ├── utils/          # Helpers (generators, validators)
│   ├── App.jsx         # Main app with routes
│   └── main.jsx        # Entry point
├── tailwind.config.js
├── vite.config.js      # Vite setup
└── README.md           # This awesome file! 📖
```

## Notes

- This repository uses mocked data and simulated flows for product demonstration.
- Replace assets and connectors with production integrations before going live.

## Deployment

Hosted on Vercel for fast, automatic deployments.

## Contributing

For feature proposals and bug reports, please open an issue. For partnerships and commercial discussions, email <incryptinvestments@protonmail.com>.

## License & Usage

All rights reserved. The IncryptX brand, trademarks, logos, names, and visual identity are proprietary. You may not:
- Reuse the IncryptX brand, marks, or assets in derivative or competing products
- Redistribute this project as a rebranded version
- Use the codebase to launch public services without prior written consent

Permitted usage:

- Private evaluation and local development for non‑commercial purposes

For commercial licensing, partnership, or integration inquiries, contact: <incryptinvestments@protonmail.com>

## Security & Responsible Disclosure

If you discover a vulnerability, please email <incryptinvestments@protonmail.com> with details and reproduction steps.

## Links
- Logo: [IncryptX Logo](https://i.ibb.co/4ntZscFS/Incrypt-Logo.png)
- GitHub: [GHX5T-SOL/incryptX](https://github.com/GHX5T-SOL/incryptX)
- Demo: [incryptx-demo.vercel.app](https://incryptx-demo.vercel.app)
- X (Twitter): [@Incrypt_defi](https://x.com/Incrypt_defi)
