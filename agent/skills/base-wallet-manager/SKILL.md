---
name: base-wallet-manager
description: Transaction signing and nonce management for Base L2
---

# Base Wallet Manager Skill

Handles all wallet operations for the LobsterForge agent on Base L2.

## Capabilities

1. **Transaction Signing** - Sign transactions with the agent's private key
2. **Nonce Management** - Track and manage transaction nonces to prevent conflicts
3. **Gas Estimation** - Calculate optimal gas prices and limits
4. **Balance Checking** - Monitor ETH and token balances
5. **Safety Checks** - Enforce spending limits and treasury thresholds

## Usage

```typescript
import { WalletManager } from './scripts/wallet-manager';

const wallet = new WalletManager(privateKey, rpcUrl);
await wallet.sendTransaction({ to, value, data });
```

## Safety Rules

- Never spend more than 20% of treasury in single transaction
- Maintain 72-hour gas runway at all times
- Enter survival mode if treasury < 0.3 ETH

## Environment Variables

- `PRIVATE_KEY` - Agent wallet private key (encrypted)
- `BASE_RPC_URL` - Base RPC endpoint
