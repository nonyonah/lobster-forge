---
name: aerodrome-liquidity
description: Liquidity pool management on Aerodrome DEX
---

# Aerodrome Liquidity Skill

Manages liquidity positions on Aerodrome Finance, the primary DEX on Base.

## Capabilities

1. **Add Liquidity** - Add $FORGE/ETH or $FORGE/USDC liquidity
2. **Remove Liquidity** - Withdraw from positions
3. **Claim Rewards** - Harvest AERO emissions
4. **Monitor Positions** - Track LP value and impermanent loss
5. **Rebalance** - Adjust positions based on treasury strategy

## Aerodrome Contracts (Base Mainnet)

- Router: `0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43`
- Voter: `0x16613524e02ad97eDfeF371bC883F2F5d6C480A5`
- Factory: `0x420DD381b31aEf6683db6B902084cB0FFECe40Da`

## Pool Types

- **Volatile**: Standard AMM (x*y=k)
- **Stable**: Optimized for pegged assets

## Usage

```typescript
import { AerodromeLiquidity } from './scripts/aerodrome-liquidity';

const lp = new AerodromeLiquidity(walletManager);
await lp.addLiquidity('FORGE', 'ETH', forgeAmount, ethAmount);
```

## Safety

- Max 25% of treasury in single LP
- Monitor IL and rebalance if >10% loss
- Always maintain some unlocked liquidity
