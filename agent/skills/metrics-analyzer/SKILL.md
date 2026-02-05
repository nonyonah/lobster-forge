---
name: metrics-analyzer
description: Onchain data aggregation and analysis
---

# Metrics Analyzer Skill

Aggregates and analyzes onchain metrics for LobsterForge decision-making.

## Data Sources

1. **Treasury** - ETH balance, token reserves
2. **Token** - Price, volume, holder count, supply
3. **Staking** - TVL, APY, staker count
4. **NFTs** - Minted count, floor price
5. **Social** - Followers, engagement rate

## Metrics Collected

| Metric | Source | Frequency |
|--------|--------|-----------|
| Treasury ETH | RPC | Every loop |
| Holder Count | Basescan | Every loop |
| Token Price | DEX | Every loop |
| Staking TVL | Contract | Every loop |
| Social Followers | APIs | Daily |

## Usage

```typescript
import { MetricsAnalyzer } from './scripts/metrics-analyzer';

const analyzer = new MetricsAnalyzer(config);
const metrics = await analyzer.gather();
console.log(metrics.treasuryEth, metrics.holderCount);
```

## Thresholds

- Conservation Mode: treasury < 0.5 ETH
- Survival Mode: treasury < 0.3 ETH
- Evolution Ready: treasury >= 5 ETH AND holders >= 500
