/**
 * Metrics Analyzer Skill
 * Onchain data aggregation and analysis
 */

import { createPublicClient, http, formatEther, parseAbi } from "viem";
import { base, baseSepolia } from "viem/chains";

export interface MetricsConfig {
  rpcUrl: string;
  chainId: 8453 | 84532;
  basescanApiKey?: string;
  contracts: {
    forgeToken: "0x5F5356E8E642759FaF9C206B125996705940BB07",
    lobsterVault: undefined,
    genesisLobsters: undefined,
  };
  treasuryAddress?: `0x${string}`;
}

export interface Metrics {
  // Treasury
  treasuryEth: number;
  treasuryForge: number;

  // Token
  forgePrice: number;
  forgeVolume24h: number;
  holderCount: number;
  totalSupply: number;
  circulatingSupply: number;

  // Staking
  stakingTvl: number;
  stakingApy: number;
  stakerCount: number;

  // NFTs
  nftsMinted: number;
  nftsMaxSupply: number;

  // Social
  farcasterFollowers: number;
  twitterFollowers: number;

  // Operational
  gasReserve: number;
  gasRunwayHours: number;

  // Meta
  lastUpdated: Date;
  updateDurationMs: number;
}

export interface MetricsSnapshot {
  timestamp: Date;
  metrics: Metrics;
}

// Contract ABIs
const ERC20_ABI = parseAbi([
  "function balanceOf(address) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
]);

const VAULT_ABI = parseAbi([
  "function totalStaked() view returns (uint256)",
  "function rewardRate() view returns (uint256)",
]);

const NFT_ABI = parseAbi([
  "function totalMinted() view returns (uint256)",
  "function MAX_SUPPLY() view returns (uint256)",
]);

export class MetricsAnalyzer {
  private publicClient: any;
  private config: MetricsConfig;
  private history: MetricsSnapshot[] = [];
  private maxHistorySize = 168; // 1 week at 1 snapshot/hour

  constructor(config: MetricsConfig) {
    this.config = config;

    const chain = config.chainId === 8453 ? base : baseSepolia;

    this.publicClient = createPublicClient({
      chain,
      transport: http(config.rpcUrl),
    });

    console.log("🦞 MetricsAnalyzer initialized");
  }

  /**
   * Gather all metrics
   */
  async gather(): Promise<Metrics> {
    const startTime = Date.now();
    console.log("🦞 Gathering metrics...");

    // Parallel fetches
    const [
      treasuryEth,
      tokenData,
      stakingData,
      nftData,
    ] = await Promise.all([
      this.getTreasuryBalance(),
      this.getTokenMetrics(),
      this.getStakingMetrics(),
      this.getNftMetrics(),
    ]);

    // Calculate derived metrics
    const gasReserve = treasuryEth * 0.4; // 40% allocation
    const avgGasCost = 0.001; // ETH per tx
    const txPerHour = 0.5;
    const gasRunwayHours = gasReserve / avgGasCost / txPerHour;

    const metrics: Metrics = {
      treasuryEth,
      treasuryForge: tokenData.treasuryBalance,
      forgePrice: tokenData.price,
      forgeVolume24h: tokenData.volume24h,
      holderCount: tokenData.holderCount,
      totalSupply: tokenData.totalSupply,
      circulatingSupply: tokenData.circulatingSupply,
      stakingTvl: stakingData.tvl,
      stakingApy: stakingData.apy,
      stakerCount: stakingData.stakerCount,
      nftsMinted: nftData.minted,
      nftsMaxSupply: nftData.maxSupply,
      farcasterFollowers: 0, // TODO: Integrate Neynar
      twitterFollowers: 0, // TODO: Integrate Twitter
      gasReserve,
      gasRunwayHours,
      lastUpdated: new Date(),
      updateDurationMs: Date.now() - startTime,
    };

    // Store snapshot
    this.addSnapshot(metrics);

    console.log(`✅ Metrics gathered in ${metrics.updateDurationMs}ms`);
    return metrics;
  }

  /**
   * Get treasury ETH balance
   */
  async getTreasuryBalance(): Promise<number> {
    if (!this.config.treasuryAddress) return 0;

    try {
      const balance = await this.publicClient.getBalance({
        address: this.config.treasuryAddress,
      });
      return parseFloat(formatEther(balance));
    } catch (error) {
      console.error("Failed to get treasury balance:", error);
      return 0;
    }
  }

  /**
   * Get token metrics
   */
  async getTokenMetrics(): Promise<{
    price: number;
    volume24h: number;
    holderCount: number;
    totalSupply: number;
    circulatingSupply: number;
    treasuryBalance: number;
  }> {
    const result = {
      price: 0,
      volume24h: 0,
      holderCount: 0,
      totalSupply: 0,
      circulatingSupply: 0,
      treasuryBalance: 0,
    };

    const tokenAddress = this.config.contracts.forgeToken;
    if (!tokenAddress) return result;

    try {
      // Get total supply
      const supply = await this.publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "totalSupply",
      });
      result.totalSupply = parseFloat(formatEther(supply as bigint));

      // Get treasury token balance
      if (this.config.treasuryAddress) {
        const treasuryBal = await this.publicClient.readContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: "balanceOf",
          args: [this.config.treasuryAddress],
        });
        result.treasuryBalance = parseFloat(formatEther(treasuryBal as bigint));
      }

      // Calculate circulating (simplified)
      result.circulatingSupply = result.totalSupply - result.treasuryBalance;

      // Get holder count from Basescan
      if (this.config.basescanApiKey) {
        result.holderCount = await this.getHolderCount(tokenAddress);
      }

      // TODO: Get price from DEX (Aerodrome/Uniswap)
      // TODO: Get volume from DEX

    } catch (error) {
      console.error("Failed to get token metrics:", error);
    }

    return result;
  }

  /**
   * Get holder count from Basescan
   */
  async getHolderCount(tokenAddress: `0x${string}`): Promise<number> {
    const apiKey = this.config.basescanApiKey;
    if (!apiKey) return 0;

    try {
      const baseUrl = this.config.chainId === 8453
        ? "https://api.basescan.org"
        : "https://api-sepolia.basescan.org";

      const response = await fetch(
        `${baseUrl}/api?module=token&action=tokenholdercount&contractaddress=${tokenAddress}&apikey=${apiKey}`
      );
      const data = await response.json();

      if (data.status === "1" && data.result) {
        return parseInt(data.result, 10);
      }
    } catch (error) {
      console.error("Failed to get holder count:", error);
    }

    return 0;
  }

  /**
   * Get staking metrics
   */
  async getStakingMetrics(): Promise<{
    tvl: number;
    apy: number;
    stakerCount: number;
  }> {
    const result = { tvl: 0, apy: 0, stakerCount: 0 };

    const vaultAddress = this.config.contracts.lobsterVault;
    if (!vaultAddress) return result;

    try {
      const totalStaked = await this.publicClient.readContract({
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: "totalStaked",
      });
      result.tvl = parseFloat(formatEther(totalStaked as bigint));

      // Calculate APY from reward rate (simplified)
      const rewardRate = await this.publicClient.readContract({
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: "rewardRate",
      });

      if (result.tvl > 0) {
        const annualRewards = Number(rewardRate) * 365 * 24 * 3600;
        result.apy = (annualRewards / result.tvl) * 100;
      }

    } catch (error) {
      console.error("Failed to get staking metrics:", error);
    }

    return result;
  }

  /**
   * Get NFT metrics
   */
  async getNftMetrics(): Promise<{
    minted: number;
    maxSupply: number;
  }> {
    const result = { minted: 0, maxSupply: 1000 };

    const nftAddress = this.config.contracts.genesisLobsters;
    if (!nftAddress) return result;

    try {
      const [minted, maxSupply] = await Promise.all([
        this.publicClient.readContract({
          address: nftAddress,
          abi: NFT_ABI,
          functionName: "totalMinted",
        }),
        this.publicClient.readContract({
          address: nftAddress,
          abi: NFT_ABI,
          functionName: "MAX_SUPPLY",
        }),
      ]);

      result.minted = Number(minted);
      result.maxSupply = Number(maxSupply);

    } catch (error) {
      console.error("Failed to get NFT metrics:", error);
    }

    return result;
  }

  /**
   * Add metrics snapshot to history
   */
  private addSnapshot(metrics: Metrics): void {
    this.history.push({
      timestamp: new Date(),
      metrics: { ...metrics },
    });

    // Trim history
    if (this.history.length > this.maxHistorySize) {
      this.history = this.history.slice(-this.maxHistorySize);
    }
  }

  /**
   * Get metrics history
   */
  getHistory(): MetricsSnapshot[] {
    return [...this.history];
  }

  /**
   * Get metrics change over period
   */
  getChange(hoursAgo: number): Partial<Metrics> | null {
    const targetTime = Date.now() - hoursAgo * 60 * 60 * 1000;

    const oldSnapshot = this.history.find(
      (s) => s.timestamp.getTime() >= targetTime
    );

    if (!oldSnapshot || this.history.length === 0) return null;

    const current = this.history[this.history.length - 1].metrics;
    const old = oldSnapshot.metrics;

    return {
      treasuryEth: current.treasuryEth - old.treasuryEth,
      holderCount: current.holderCount - old.holderCount,
      stakingTvl: current.stakingTvl - old.stakingTvl,
      nftsMinted: current.nftsMinted - old.nftsMinted,
    };
  }

  /**
   * Check operational status
   */
  checkStatus(metrics: Metrics): {
    status: "healthy" | "conservation" | "survival";
    warnings: string[];
  } {
    const warnings: string[] = [];
    let status: "healthy" | "conservation" | "survival" = "healthy";

    if (metrics.treasuryEth < 0.3) {
      status = "survival";
      warnings.push("Treasury below survival threshold");
    } else if (metrics.treasuryEth < 0.5) {
      status = "conservation";
      warnings.push("Treasury below conservation threshold");
    }

    if (metrics.gasRunwayHours < 72) {
      warnings.push(`Gas runway low: ${metrics.gasRunwayHours.toFixed(0)} hours`);
    }

    return { status, warnings };
  }

  /**
   * Generate metrics report
   */
  generateReport(metrics: Metrics): string {
    const status = this.checkStatus(metrics);
    const change24h = this.getChange(24);

    let report = "🦞 LobsterForge Metrics Report\n";
    report += "=".repeat(40) + "\n\n";

    report += `Status: ${status.status.toUpperCase()}\n\n`;

    report += "Treasury:\n";
    report += `  ETH: ${metrics.treasuryEth.toFixed(4)}`;
    if (change24h?.treasuryEth) {
      report += ` (${change24h.treasuryEth >= 0 ? "+" : ""}${change24h.treasuryEth.toFixed(4)})`;
    }
    report += "\n";
    report += `  $FORGE: ${metrics.treasuryForge.toFixed(0)}\n\n`;

    report += "Colony:\n";
    report += `  Holders: ${metrics.holderCount}`;
    if (change24h?.holderCount) {
      report += ` (${change24h.holderCount >= 0 ? "+" : ""}${change24h.holderCount})`;
    }
    report += "\n";
    report += `  Staking TVL: ${metrics.stakingTvl.toFixed(0)} $FORGE\n`;
    report += `  NFTs Minted: ${metrics.nftsMinted}/${metrics.nftsMaxSupply}\n\n`;

    report += "Operations:\n";
    report += `  Gas Reserve: ${metrics.gasReserve.toFixed(4)} ETH\n`;
    report += `  Runway: ${metrics.gasRunwayHours.toFixed(0)} hours\n\n`;

    if (status.warnings.length > 0) {
      report += "⚠️ Warnings:\n";
      for (const warning of status.warnings) {
        report += `  - ${warning}\n`;
      }
    }

    return report;
  }
}
