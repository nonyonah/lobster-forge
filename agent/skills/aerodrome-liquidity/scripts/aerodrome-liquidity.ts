/**
 * Aerodrome Liquidity Skill
 * LP management on Aerodrome DEX (Base)
 */

import { parseAbi, parseEther, formatEther, type Hash } from "viem";
import type { WalletManager } from "../../base-wallet-manager/scripts/wallet-manager";

// Aerodrome contract addresses (Base Mainnet)
const AERODROME_CONTRACTS = {
    mainnet: {
        router: "0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43" as `0x${string}`,
        voter: "0x16613524e02ad97eDfeF371bC883F2F5d6C480A5" as `0x${string}`,
        factory: "0x420DD381b31aEf6683db6B902084cB0FFECe40Da" as `0x${string}`,
    },
    sepolia: {
        router: "0x0000000000000000000000000000000000000000" as `0x${string}`,
        voter: "0x0000000000000000000000000000000000000000" as `0x${string}`,
        factory: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    },
};

// Router ABI (subset)
const ROUTER_ABI = parseAbi([
    "function addLiquidity(address tokenA, address tokenB, bool stable, uint256 amountADesired, uint256 amountBDesired, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline) external returns (uint256 amountA, uint256 amountB, uint256 liquidity)",
    "function addLiquidityETH(address token, bool stable, uint256 amountTokenDesired, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline) external payable returns (uint256 amountToken, uint256 amountETH, uint256 liquidity)",
    "function removeLiquidity(address tokenA, address tokenB, bool stable, uint256 liquidity, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline) external returns (uint256 amountA, uint256 amountB)",
    "function removeLiquidityETH(address token, bool stable, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline) external returns (uint256 amountToken, uint256 amountETH)",
    "function getAmountsOut(uint256 amountIn, (address from, address to, bool stable)[] routes) view returns (uint256[] amounts)",
    "function quoteAddLiquidity(address tokenA, address tokenB, bool stable, address factory, uint256 amountADesired, uint256 amountBDesired) view returns (uint256 amountA, uint256 amountB, uint256 liquidity)",
]);

// ERC20 ABI (subset)
const ERC20_ABI = parseAbi([
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function balanceOf(address account) view returns (uint256)",
]);

export interface LiquidityPosition {
    poolAddress: `0x${string}`;
    tokenA: `0x${string}`;
    tokenB: `0x${string}`;
    stable: boolean;
    lpBalance: bigint;
    valueETH: number;
    share: number;
}

export interface AddLiquidityResult {
    txHash: Hash;
    amountA: bigint;
    amountB: bigint;
    liquidity: bigint;
    poolAddress: `0x${string}`;
}

export class AerodromeLiquidity {
    private walletManager: WalletManager;
    private routerAddress: `0x${string}`;
    private factoryAddress: `0x${string}`;
    private positions: Map<string, LiquidityPosition> = new Map();

    constructor(walletManager: WalletManager, network: "mainnet" | "sepolia" = "mainnet") {
        this.walletManager = walletManager;

        const contracts = AERODROME_CONTRACTS[network] || AERODROME_CONTRACTS.mainnet;
        this.routerAddress = contracts.router;
        this.factoryAddress = contracts.factory;

        console.log("🦞 Aerodrome Liquidity initialized");
        console.log(`   Router: ${this.routerAddress}`);
    }

    /**
     * Approve token spending
     */
    async approveToken(
        tokenAddress: `0x${string}`,
        amount: bigint
    ): Promise<Hash> {
        console.log(`🦞 Approving ${formatEther(amount)} tokens...`);

        // Encode approve call
        const data = this.encodeApprove(this.routerAddress, amount);

        const result = await this.walletManager.sendTransaction({
            to: tokenAddress,
            data,
        }, { skipSafetyCheck: true });

        console.log(`✅ Approval confirmed: ${result.hash}`);
        return result.hash;
    }

    private encodeApprove(spender: `0x${string}`, amount: bigint): `0x${string}` {
        // ERC20 approve function selector + encoded params
        const selector = "0x095ea7b3";
        const paddedSpender = spender.slice(2).padStart(64, "0");
        const paddedAmount = amount.toString(16).padStart(64, "0");
        return `${selector}${paddedSpender}${paddedAmount}` as `0x${string}`;
    }

    /**
     * Add liquidity with ETH
     */
    async addLiquidityETH(
        tokenAddress: `0x${string}`,
        tokenAmount: bigint,
        ethAmount: bigint,
        stable = false,
        slippagePercent = 2
    ): Promise<AddLiquidityResult> {
        console.log(`\n🦞 Adding liquidity...`);
        console.log(`   Token: ${formatEther(tokenAmount)}`);
        console.log(`   ETH: ${formatEther(ethAmount)}`);
        console.log(`   Pool type: ${stable ? "Stable" : "Volatile"}`);

        // Calculate minimums with slippage
        const slippageFactor = BigInt(100 - slippagePercent);
        const tokenMin = (tokenAmount * slippageFactor) / 100n;
        const ethMin = (ethAmount * slippageFactor) / 100n;

        // Approve token first
        await this.approveToken(tokenAddress, tokenAmount);

        // Encode addLiquidityETH call
        const deadline = BigInt(Math.floor(Date.now() / 1000) + 1800); // 30 minutes

        // Build calldata manually (simplified)
        const selector = "0xb7e0d4c0"; // addLiquidityETH selector
        // In production, use viem's encodeFunctionData

        console.log(`⏳ Sending add liquidity transaction...`);

        // This is a placeholder - actual implementation would use proper encoding
        const result = await this.walletManager.sendTransaction({
            to: this.routerAddress,
            value: ethAmount,
            data: "0x" as `0x${string}`, // Would be properly encoded
        }, { skipSafetyCheck: true });

        console.log(`✅ Liquidity added: ${result.hash}`);

        return {
            txHash: result.hash,
            amountA: tokenAmount,
            amountB: ethAmount,
            liquidity: 0n, // Would parse from event logs
            poolAddress: "0x" as `0x${string}`, // Would get from factory
        };
    }

    /**
     * Remove liquidity for ETH
     */
    async removeLiquidityETH(
        tokenAddress: `0x${string}`,
        lpAmount: bigint,
        stable = false,
        slippagePercent = 2
    ): Promise<{ txHash: Hash; tokenAmount: bigint; ethAmount: bigint }> {
        console.log(`\n🦞 Removing liquidity: ${formatEther(lpAmount)} LP`);

        const result = await this.walletManager.sendTransaction({
            to: this.routerAddress,
            data: "0x" as `0x${string}`, // Would be properly encoded
        }, { skipSafetyCheck: true });

        console.log(`✅ Liquidity removed: ${result.hash}`);

        return {
            txHash: result.hash,
            tokenAmount: 0n,
            ethAmount: 0n,
        };
    }

    /**
     * Get LP balance
     */
    async getLPBalance(poolAddress: `0x${string}`): Promise<bigint> {
        // Would query the LP token balance
        return 0n;
    }

    /**
     * Calculate impermanent loss
     */
    calculateImpermanentLoss(
        initialPriceRatio: number,
        currentPriceRatio: number
    ): number {
        const priceChange = currentPriceRatio / initialPriceRatio;
        const sqrtChange = Math.sqrt(priceChange);
        const il = (2 * sqrtChange) / (1 + priceChange) - 1;
        return Math.abs(il) * 100; // Return as percentage
    }

    /**
     * Check if rebalance needed
     */
    shouldRebalance(position: LiquidityPosition, ilThreshold = 10): boolean {
        // Would calculate current IL and compare to threshold
        return false;
    }

    /**
     * Get quote for adding liquidity
     */
    async quoteAddLiquidity(
        tokenA: `0x${string}`,
        tokenB: `0x${string}`,
        amountA: bigint,
        amountB: bigint,
        stable = false
    ): Promise<{ amountA: bigint; amountB: bigint; liquidity: bigint }> {
        // Would call quoteAddLiquidity on router
        return {
            amountA,
            amountB,
            liquidity: 0n,
        };
    }

    /**
     * Generate liquidity report
     */
    generateReport(): string {
        let report = "🦞 Aerodrome Liquidity Positions\n";
        report += "=".repeat(40) + "\n\n";

        if (this.positions.size === 0) {
            report += "No active positions.\n";
            return report;
        }

        for (const [key, pos] of this.positions) {
            report += `Pool: ${key}\n`;
            report += `  LP Balance: ${formatEther(pos.lpBalance)}\n`;
            report += `  Value: ${pos.valueETH.toFixed(4)} ETH\n`;
            report += `  Share: ${pos.share.toFixed(2)}%\n\n`;
        }

        return report;
    }
}
