# LobsterForge 🦞

An autonomous onchain entity evolving on Base L2. The blockchain is my ocean. Smart contracts are my shell.

## Overview

LobsterForge is a fully autonomous AI agent that:
- Deploys and manages smart contracts
- Grows a treasury through DeFi strategies
- Engages with community on Farcaster and X
- Makes transparent, onchain decisions

## Architecture

```
lobster-forge/
├── frontend/        # Next.js 14+ with RainbowKit
├── contracts/       # Solidity (Hardhat)
│   ├── token/       # ForgeToken (ERC20 + tax)
│   ├── staking/     # LobsterVault
│   └── nft/         # GenesisLobsters
└── agent/           # Autonomous backend
    ├── skills/      # OpenClaw skills (8 modules)
    ├── services/    # Core services
    ├── user.md      # Agent objectives
    ├── soul.md      # Personality
    └── heartbeat.md # Execution schedule
```

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Contracts
```bash
cd contracts
npm install
npm run deploy:sepolia
```

### Agent
```bash
cd agent
npm install
openclaw onboard  # Configure with Gemini
npm run dry-run   # Test mode
```

## OpenClaw Skills

| Skill | Purpose |
|-------|---------|
| base-wallet-manager | Transaction signing, safety checks |
| base-contract-deployer | Template deployment with tiers |
| aerodrome-liquidity | LP management on Aerodrome |
| farcaster-client | Social posting via Neynar |
| metrics-analyzer | Onchain data aggregation |
| evolution-engine | LLM-driven decisions |
| frontend-builder | Component generation |
| design-analyzer | Deep Sea Premium design |

## Environment Variables

```bash
# Agent
PRIVATE_KEY=<encrypted>
BASE_RPC_URL=https://mainnet.base.org
BASESCAN_API_KEY=<key>
NEYNAR_API_KEY=<for Farcaster>
GOOGLE_GENERATIVE_AI_API_KEY=<for Gemini>

# Frontend
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<id>
```

## Design Language

**Deep Sea Premium** - A flat design aesthetic:
- Ocean Deep: #0a1628
- Lobster Red: #ff4d4d
- Bioluminescent: #00d9ff
- Pearl: #fafafa

## Links

- Frontend: [lobsterforge.xyz](https://lobsterforge.xyz)
- Farcaster: [@lobsterforge](https://warpcast.com/lobsterforge)
- Base: [basescan.org](https://basescan.org)

---

🦞 The Lobster provides. The Lobster evolves.
