/**
 * Metrics Analyzer Service
 * Fetches onchain and social metrics
 */

import { formatEther, parseAbi } from "viem";
import { publicClient } from "./wallet";
import { config } from "../config";

// ERC20 ABI subset
const erc20Abi = parseAbi([
    "function balanceOf(address) view returns (uint256)",
    "function totalSupply() view returns (uint256)",
]);

export interface Metrics {
    // Treasury
    treasuryEth: number;
    treasuryForge: number;

    // Token
    forgePrice: number;
    forgeVolume24h: number;
    holderCount: number;
    totalSupply: number;

    // Staking
    stakingTvl: number;
    stakingApy: number;

    // NFTs
    nftsMinted: number;
    nftsMaxSupply: number;

    // Social
    farcasterFollowers: number;
    twitterFollowers: number;

    // Operational
    gasReserve: number;
    lastUpdated: Date;
}

/**
 * Fetch treasury ETH balance
 */
export async function getTreasuryBalance(): Promise<number> {
    if (!config.treasuryAddress) return 0;

    const balance = await publicClient.getBalance({
        address: config.treasuryAddress as `0x${string}`,
    });

    return parseFloat(formatEther(balance));
}

/**
 * Fetch holder count via Basescan API
 */
export async function getHolderCount(): Promise<number> {
    if (!config.contracts.forgeToken || !config.basescanApiKey) return 0;

    try {
        const response = await fetch(
            `https://api.basescan.org/api?module=token&action=tokenholderlist&contractaddress=${config.contracts.forgeToken}&page=1&offset=1&apikey=${config.basescanApiKey}`
        );
        const data = await response.json();

        // This is a simplified approach - real implementation would paginate
        return data.result?.length || 0;
    } catch (error) {
        console.error("Failed to fetch holder count:", error);
        return 0;
    }
}

/**
 * Fetch total supply
 */
export async function getTotalSupply(): Promise<number> {
    if (!config.contracts.forgeToken) return 0;

    try {
        const supply = await publicClient.readContract({
            address: config.contracts.forgeToken as `0x${string}`,
            abi: erc20Abi,
            functionName: "totalSupply",
        });

        return parseFloat(formatEther(supply as bigint));
    } catch (error) {
        console.error("Failed to fetch total supply:", error);
        return 0;
    }
}

/**
 * Fetch staking TVL
 */
export async function getStakingTvl(): Promise<number> {
    if (!config.contracts.lobsterVault || !config.contracts.forgeToken) return 0;

    try {
        const balance = await publicClient.readContract({
            address: config.contracts.forgeToken as `0x${string}`,
            abi: erc20Abi,
            functionName: "balanceOf",
            args: [config.contracts.lobsterVault as `0x${string}`],
        });

        return parseFloat(formatEther(balance as bigint));
    } catch (error) {
        console.error("Failed to fetch staking TVL:", error);
        return 0;
    }
}

/**
 * Fetch NFT mint count
 */
export async function getNftMintCount(): Promise<{ minted: number; max: number }> {
    if (!config.contracts.genesisLobsters) return { minted: 0, max: 1000 };

    try {
        const nftAbi = parseAbi([
            "function totalMinted() view returns (uint256)",
            "function MAX_SUPPLY() view returns (uint256)",
        ]);

        const [minted, max] = await Promise.all([
            publicClient.readContract({
                address: config.contracts.genesisLobsters as `0x${string}`,
                abi: nftAbi,
                functionName: "totalMinted",
            }),
            publicClient.readContract({
                address: config.contracts.genesisLobsters as `0x${string}`,
                abi: nftAbi,
                functionName: "MAX_SUPPLY",
            }),
        ]);

        return {
            minted: Number(minted),
            max: Number(max),
        };
    } catch (error) {
        console.error("Failed to fetch NFT count:", error);
        return { minted: 0, max: 1000 };
    }
}

/**
 * Gather all metrics
 */
export async function gatherMetrics(): Promise<Metrics> {
    console.log("🦞 Gathering metrics...");

    const [treasuryEth, holderCount, totalSupply, stakingTvl, nftData] = await Promise.all([
        getTreasuryBalance(),
        getHolderCount(),
        getTotalSupply(),
        getStakingTvl(),
        getNftMintCount(),
    ]);

    // TODO: Integrate price feeds, social APIs
    const metrics: Metrics = {
        treasuryEth,
        treasuryForge: 0, // TODO: Fetch
        forgePrice: 0, // TODO: DEX integration
        forgeVolume24h: 0, // TODO: DEX integration
        holderCount,
        totalSupply,
        stakingTvl,
        stakingApy: 12.5, // TODO: Calculate from rewards
        nftsMinted: nftData.minted,
        nftsMaxSupply: nftData.max,
        farcasterFollowers: 0, // TODO: Neynar API
        twitterFollowers: 0, // TODO: Twitter API
        gasReserve: treasuryEth * config.allocation.gasReserve,
        lastUpdated: new Date(),
    };

    console.log("🦞 Metrics gathered:", JSON.stringify(metrics, null, 2));
    return metrics;
}

/**
 * Format metrics for social post
 */
export function formatMetricsPost(metrics: Metrics): string {
    return `GM from the depths 🌊

24h Highlights:
- Treasury: ${metrics.treasuryEth.toFixed(2)} ETH
- Holders: ${metrics.holderCount}
- Staking TVL: ${metrics.stakingTvl.toFixed(0)} $FORGE
- NFTs Minted: ${metrics.nftsMinted}/${metrics.nftsMaxSupply}

The currents are favorable. Keep swimming. 🦞`;
}
