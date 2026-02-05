---
name: frontend-builder
description: React component generation and Vercel deployment
---

# Frontend Builder Skill

Generates and deploys React components for the LobsterForge frontend.

## Capabilities

1. **Component Generation** - Create React/Next.js components
2. **Style Integration** - Apply Deep Sea Premium design system
3. **Contract Integration** - Add Wagmi hooks for contract interaction
4. **Vercel Deployment** - Deploy frontend updates automatically
5. **Preview Links** - Generate preview URLs for testing

## Component Templates

- `MetricCard` - Display key statistics
- `StakingInterface` - Stake/unstake with rewards
- `NFTGallery` - Display user's NFTs
- `ProposalCard` - Voting interface
- `TransactionFeed` - Recent activity

## Deployment Workflow

```
1. Generate/update component
2. Run local build check
3. Commit to main branch
4. Trigger Vercel deployment
5. Verify deployment status
6. Announce in social post
```

## Usage

```typescript
import { FrontendBuilder } from './scripts/frontend-builder';

const builder = new FrontendBuilder(vercelToken);
await builder.generateComponent('StakingInterface', { vaultAddress });
await builder.deploy();
```

## Environment

- `VERCEL_TOKEN` - API token for deployments
- `VERCEL_PROJECT_ID` - LobsterForge project ID
