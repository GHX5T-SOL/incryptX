# IncryptX - Replit Setup Documentation

## Overview
IncryptX is a comprehensive Solana DeFi platform featuring a Launchpad, DEX, Perpetuals, and Social trading features. This is a React/Vite-based frontend application that has been configured to run in the Replit environment.

## Current Status
- ✅ Vite development server configured for Replit
- ✅ Dependencies installed with legacy peer deps support
- ✅ Frontend workflow running on port 5000
- ✅ Node.js 20 and Python 3.11 installed for build support

## Project Architecture
- **Frontend**: React 18 + Vite 7 + TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **Blockchain**: Solana Web3.js + Wallet Adapter
- **3D Graphics**: Three.js + React Three Fiber
- **Charts**: Recharts
- **Build System**: Vite with Node.js polyfills

## Replit Configuration
### Vite Server Settings (vite.config.js)
- Host: `0.0.0.0` (binds to all interfaces)
- Port: `5000` (Replit's exposed port)
- AllowedHosts: `all` (enables Replit proxy access)
- HMR: WebSocket over HTTPS for live reload

### Workflow
- Name: "Frontend" 
- Command: `npm run dev`
- Port: 5000 (webview output)

## Development Setup
1. Dependencies installed with: `npm install --legacy-peer-deps`
2. System dependencies: systemd, pkg-config (for native module builds)
3. Languages: Node.js 20.19.3, Python 3.11.13

## Key Features
- **Launchpad**: Token creation and launching
- **Trade**: Swap, advanced trading, P2P escrow
- **Perps**: Perpetual contracts
- **Social**: On-chain social features
- **AI Integration**: Avatar and chat features

## Mock Data
The application uses mock data for demonstration located in:
- `public/assets/mock-data/` (JSON files)
- Custom hooks in `src/hooks/` for data management

## Notes
- Application uses Solana wallet adapters (mocked for demo)
- 3D avatars and animations included
- Responsive design optimized for modern browsers
- All dependencies compatible with Node.js 20+

## Recent Changes
- 2025-09-11: Initial Replit setup and configuration
- Added allowedHosts configuration for Replit proxy
- Configured HMR for proper development experience