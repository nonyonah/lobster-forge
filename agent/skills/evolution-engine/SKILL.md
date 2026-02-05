---
name: evolution-engine
description: LLM-driven decision tree for autonomous evolution
---

# Evolution Engine Skill

The brain of LobsterForge - evaluates metrics and decides on evolution actions.

## Decision Tree

```
1. SURVIVAL MODE: treasury < 0.3 ETH
   → Halt all spending, focus on recovery

2. CONSERVATION MODE: treasury < 0.5 ETH
   → Pause deployments, maintain operations

3. ADVANCED STAKING: treasury ≥ 5 ETH
   → Deploy tiered staking with boost

4. MOLT EVENT: holders ≥ 500 (+ every 100)
   → NFT airdrop + burn 1% supply

5. PROPOSAL EXECUTION: votes ≥ 50, feasibility ≥ 0.8
   → Simulate, deploy if safe

6. METRICS POST: 24+ hours since last
   → Generate and post update
```

## Proposal Scoring

| Factor | Weight |
|--------|--------|
| Uses approved template | 0.3 |
| No obvious bugs | 0.2 |
| Gas efficient | 0.1 |
| Voter support (>50) | 0.2 |
| Lobster theme alignment | 0.1 |
| Positive ROI projection | 0.1 |

**Deploy threshold: score ≥ 0.8**

## Usage

```typescript
import { EvolutionEngine } from './scripts/evolution-engine';

const engine = new EvolutionEngine();
const actions = engine.evaluate(metrics, state);
await engine.execute(actions[0]);
```
