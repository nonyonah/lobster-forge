---
name: base-contract-deployer
description: Template compilation and smart contract deployment to Base L2
---

# Base Contract Deployer Skill

Compiles and deploys smart contracts from approved templates to Base L2.

## Capabilities

1. **Template Management** - Load and validate contract templates
2. **Compilation** - Compile Solidity contracts via Hardhat
3. **Deployment** - Deploy to Base Sepolia or Mainnet
4. **Verification** - Verify contracts on Basescan
5. **Risk Assessment** - Tier-based deployment authorization

## Contract Tiers

| Tier | Risk | Cost | Approval |
|------|------|------|----------|
| 1 | Low | <0.5 ETH | Auto |
| 2 | Medium | 0.5-2 ETH | Review |
| 3 | High | >2 ETH | Community vote |

## Approved Templates

- `ForgeToken.sol` - ERC20 with tax (Tier 1)
- `LobsterVault.sol` - Staking vault (Tier 2)
- `GenesisLobsters.sol` - NFT collection (Tier 2)

## Forbidden

- Flash loan protocols
- Uncollateralized lending
- Unaudited external dependencies

## Usage

```typescript
import { ContractDeployer } from './scripts/contract-deployer';

const deployer = new ContractDeployer(walletManager);
const result = await deployer.deploy('ForgeToken', constructorArgs);
```
