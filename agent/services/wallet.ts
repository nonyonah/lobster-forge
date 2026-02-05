/**
 * Wallet Manager Service
 * Handles transaction signing and nonce management
 */

import { createWalletClient, createPublicClient, http, parseEther, formatEther } from "viem";
import { base, baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { config } from "../config";

// Determine chain
const chain = config.chainId === 8453 ? base : baseSepolia;

// Create clients
const publicClient = createPublicClient({
    chain,
    transport: http(config.rpcUrl),
});

let walletClient: ReturnType<typeof createWalletClient> | null = null;

/**
 * Initialize wallet from private key
 */
export function initWallet(privateKey: `0x${string}`) {
    const account = privateKeyToAccount(privateKey);

    walletClient = createWalletClient({
        account,
        chain,
        transport: http(config.rpcUrl),
    });

    console.log(`🦞 Wallet initialized: ${account.address}`);
    return account.address;
}

/**
 * Get current ETH balance
 */
export async function getBalance(address?: `0x${string}`): Promise<string> {
    const targetAddress = address || walletClient?.account?.address;
    if (!targetAddress) throw new Error("No wallet initialized");

    const balance = await publicClient.getBalance({ address: targetAddress });
    return formatEther(balance);
}

/**
 * Get current nonce
 */
export async function getNonce(): Promise<number> {
    if (!walletClient?.account) throw new Error("No wallet initialized");

    return await publicClient.getTransactionCount({
        address: walletClient.account.address,
    });
}

/**
 * Send ETH transaction
 */
export async function sendEth(
    to: `0x${string}`,
    amountEth: string,
    options?: { gasLimit?: bigint }
): Promise<`0x${string}`> {
    if (!walletClient?.account) throw new Error("No wallet initialized");

    const hash = await walletClient.sendTransaction({
        to,
        value: parseEther(amountEth),
        gas: options?.gasLimit,
    });

    console.log(`🦞 Transaction sent: ${hash}`);
    return hash;
}

/**
 * Wait for transaction confirmation
 */
export async function waitForTx(hash: `0x${string}`) {
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log(`🦞 Transaction confirmed: ${receipt.status}`);
    return receipt;
}

/**
 * Estimate gas for a transaction
 */
export async function estimateGas(params: {
    to: `0x${string}`;
    data?: `0x${string}`;
    value?: bigint;
}): Promise<bigint> {
    if (!walletClient?.account) throw new Error("No wallet initialized");

    return await publicClient.estimateGas({
        account: walletClient.account,
        ...params,
    });
}

/**
 * Get gas price
 */
export async function getGasPrice(): Promise<bigint> {
    return await publicClient.getGasPrice();
}

/**
 * Check if transaction is safe (within limits)
 */
export async function isSafeTransaction(
    amountEth: number,
    treasuryEth: number
): Promise<{ safe: boolean; reason?: string }> {
    const maxPercent = config.thresholds.maxTxPercent;
    const percent = (amountEth / treasuryEth) * 100;

    if (percent > maxPercent) {
        return {
            safe: false,
            reason: `Transaction ${percent.toFixed(1)}% exceeds ${maxPercent}% limit`,
        };
    }

    if (treasuryEth - amountEth < config.thresholds.survivalTreasuryEth) {
        return {
            safe: false,
            reason: "Would drop below survival threshold",
        };
    }

    return { safe: true };
}

export { publicClient, walletClient };
