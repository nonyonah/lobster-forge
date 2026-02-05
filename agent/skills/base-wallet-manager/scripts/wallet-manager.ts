/**
 * Base Wallet Manager Skill
 * Transaction signing and nonce management for Base L2
 */

import {
    createWalletClient,
    createPublicClient,
    http,
    parseEther,
    formatEther,
    parseGwei,
    type Hash,
    type TransactionReceipt,
} from "viem";
import { base, baseSepolia } from "viem/chains";
import { privateKeyToAccount, type PrivateKeyAccount } from "viem/accounts";

export interface WalletConfig {
    privateKey: `0x${string}`;
    rpcUrl: string;
    chainId: 8453 | 84532;
    treasuryThresholds: {
        maxTxPercent: number;
        survivalEth: number;
        conservationEth: number;
    };
}

export interface TransactionParams {
    to: `0x${string}`;
    value?: bigint;
    data?: `0x${string}`;
    gasLimit?: bigint;
    maxFeePerGas?: bigint;
    maxPriorityFeePerGas?: bigint;
}

export interface TransactionResult {
    hash: Hash;
    receipt: TransactionReceipt;
    gasUsed: bigint;
    effectiveGasPrice: bigint;
    totalCost: bigint;
}

export class WalletManager {
    private account: PrivateKeyAccount;
    private publicClient: ReturnType<typeof createPublicClient>;
    private walletClient: ReturnType<typeof createWalletClient>;
    private nonceMap: Map<string, number> = new Map();
    private config: WalletConfig;

    constructor(config: WalletConfig) {
        this.config = config;
        this.account = privateKeyToAccount(config.privateKey);

        const chain = config.chainId === 8453 ? base : baseSepolia;

        this.publicClient = createPublicClient({
            chain,
            transport: http(config.rpcUrl),
        });

        this.walletClient = createWalletClient({
            account: this.account,
            chain,
            transport: http(config.rpcUrl),
        });

        console.log(`🦞 WalletManager initialized: ${this.account.address}`);
    }

    /**
     * Get wallet address
     */
    get address(): `0x${string}` {
        return this.account.address;
    }

    /**
     * Get current ETH balance
     */
    async getBalance(address?: `0x${string}`): Promise<number> {
        const balance = await this.publicClient.getBalance({
            address: address || this.account.address,
        });
        return parseFloat(formatEther(balance));
    }

    /**
     * Get next nonce (with local tracking)
     */
    async getNextNonce(): Promise<number> {
        const address = this.account.address;
        const onchainNonce = await this.publicClient.getTransactionCount({
            address,
        });

        const localNonce = this.nonceMap.get(address) || 0;
        const nextNonce = Math.max(onchainNonce, localNonce);

        this.nonceMap.set(address, nextNonce + 1);
        return nextNonce;
    }

    /**
     * Reset nonce tracking (sync with chain)
     */
    async resetNonce(): Promise<void> {
        const onchainNonce = await this.publicClient.getTransactionCount({
            address: this.account.address,
        });
        this.nonceMap.set(this.account.address, onchainNonce);
        console.log(`🦞 Nonce reset to ${onchainNonce}`);
    }

    /**
     * Get current gas prices
     */
    async getGasPrices(): Promise<{
        gasPrice: bigint;
        maxFeePerGas: bigint;
        maxPriorityFeePerGas: bigint;
    }> {
        const gasPrice = await this.publicClient.getGasPrice();

        // Base L2 typically uses lower priority fees
        const maxPriorityFeePerGas = parseGwei("0.001");
        const maxFeePerGas = gasPrice + maxPriorityFeePerGas;

        return { gasPrice, maxFeePerGas, maxPriorityFeePerGas };
    }

    /**
     * Estimate gas for transaction
     */
    async estimateGas(params: TransactionParams): Promise<bigint> {
        return await this.publicClient.estimateGas({
            account: this.account,
            to: params.to,
            value: params.value,
            data: params.data,
        });
    }

    /**
     * Check if transaction is safe to execute
     */
    async isSafeTransaction(
        valueEth: number,
        treasuryEth: number
    ): Promise<{ safe: boolean; reason?: string }> {
        const { maxTxPercent, survivalEth } = this.config.treasuryThresholds;

        // Check percentage limit
        const percent = (valueEth / treasuryEth) * 100;
        if (percent > maxTxPercent) {
            return {
                safe: false,
                reason: `Transaction ${percent.toFixed(1)}% exceeds ${maxTxPercent}% limit`,
            };
        }

        // Check survival threshold
        if (treasuryEth - valueEth < survivalEth) {
            return {
                safe: false,
                reason: `Would drop treasury below survival threshold (${survivalEth} ETH)`,
            };
        }

        return { safe: true };
    }

    /**
     * Send transaction with safety checks
     */
    async sendTransaction(
        params: TransactionParams,
        options?: { skipSafetyCheck?: boolean; treasuryBalance?: number }
    ): Promise<TransactionResult> {
        const valueEth = params.value ? parseFloat(formatEther(params.value)) : 0;

        // Safety check
        if (!options?.skipSafetyCheck && params.value) {
            const treasuryEth = options?.treasuryBalance || await this.getBalance();
            const safetyCheck = await this.isSafeTransaction(valueEth, treasuryEth);

            if (!safetyCheck.safe) {
                throw new Error(`Transaction blocked: ${safetyCheck.reason}`);
            }
        }

        // Get gas prices
        const { maxFeePerGas, maxPriorityFeePerGas } = await this.getGasPrices();

        // Estimate gas if not provided
        const gasLimit = params.gasLimit || await this.estimateGas(params);

        // Send transaction
        const hash = await this.walletClient.sendTransaction({
            to: params.to,
            value: params.value,
            data: params.data,
            gas: gasLimit,
            maxFeePerGas: params.maxFeePerGas || maxFeePerGas,
            maxPriorityFeePerGas: params.maxPriorityFeePerGas || maxPriorityFeePerGas,
        });

        console.log(`🦞 Transaction sent: ${hash}`);

        // Wait for confirmation
        const receipt = await this.publicClient.waitForTransactionReceipt({ hash });

        const totalCost = receipt.gasUsed * receipt.effectiveGasPrice;

        console.log(`🦞 Transaction confirmed: ${receipt.status}`);
        console.log(`   Gas used: ${receipt.gasUsed}`);
        console.log(`   Total cost: ${formatEther(totalCost)} ETH`);

        return {
            hash,
            receipt,
            gasUsed: receipt.gasUsed,
            effectiveGasPrice: receipt.effectiveGasPrice,
            totalCost,
        };
    }

    /**
     * Send ETH to address
     */
    async sendEth(
        to: `0x${string}`,
        amountEth: string | number
    ): Promise<TransactionResult> {
        return this.sendTransaction({
            to,
            value: parseEther(amountEth.toString()),
        });
    }

    /**
     * Check gas runway in hours
     */
    async getGasRunway(avgTxCostEth = 0.001): Promise<number> {
        const balance = await this.getBalance();
        const txCount = balance / avgTxCostEth;
        const txPerHour = 0.5; // 1 tx every 2 hours on average
        return txCount / txPerHour;
    }

    /**
     * Get basescan link for transaction
     */
    getBasescanTxUrl(hash: Hash): string {
        const baseUrl = this.config.chainId === 8453
            ? "https://basescan.org"
            : "https://sepolia.basescan.org";
        return `${baseUrl}/tx/${hash}`;
    }

    /**
     * Get basescan link for address
     */
    getBasescanAddressUrl(address: `0x${string}`): string {
        const baseUrl = this.config.chainId === 8453
            ? "https://basescan.org"
            : "https://sepolia.basescan.org";
        return `${baseUrl}/address/${address}`;
    }
}

// Export factory function
export function createWalletManager(
    privateKey: string,
    rpcUrl: string,
    chainId: 8453 | 84532 = 84532
): WalletManager {
    return new WalletManager({
        privateKey: privateKey as `0x${string}`,
        rpcUrl,
        chainId,
        treasuryThresholds: {
            maxTxPercent: 20,
            survivalEth: 0.3,
            conservationEth: 0.5,
        },
    });
}
