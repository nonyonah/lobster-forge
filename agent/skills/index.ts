/**
 * LobsterForge Skills Index
 * Exports all OpenClaw skills for the agent
 */

// Wallet & Transactions
import { WalletManager, createWalletManager, WalletConfig, TransactionParams, TransactionResult } from "./base-wallet-manager/scripts/wallet-manager";
export { WalletManager, createWalletManager };
export type { WalletConfig, TransactionParams, TransactionResult };

// Contract Deployment
import { ContractDeployer, ContractTemplate, DeploymentResult, DeploymentLog } from "./base-contract-deployer/scripts/contract-deployer";
export { ContractDeployer };
export type { ContractTemplate, DeploymentResult, DeploymentLog };

// Aerodrome Liquidity
import { AerodromeLiquidity, LiquidityPosition, AddLiquidityResult } from "./aerodrome-liquidity/scripts/aerodrome-liquidity";
export { AerodromeLiquidity };
export type { LiquidityPosition, AddLiquidityResult };

// Twitter Social
import { TwitterClient, TwitterConfig, Tweet } from "./twitter-client/scripts/twitter-client";
export { TwitterClient };
export type { TwitterConfig, Tweet };

// Metrics Analysis
import { MetricsAnalyzer, Metrics, MetricsSnapshot, MetricsConfig } from "./metrics-analyzer/scripts/metrics-analyzer";
export { MetricsAnalyzer };
export type { Metrics, MetricsSnapshot, MetricsConfig };

// Evolution Engine
import { EvolutionEngine, EvolutionAction, Proposal, AgentState } from "./evolution-engine/scripts/evolution-engine";
export { EvolutionEngine };
export type { EvolutionAction, Proposal, AgentState };

// Frontend Builder
import { FrontendBuilder, ComponentConfig, DeploymentResult as VercelDeploymentResult } from "./frontend-builder/scripts/frontend-builder";
export { FrontendBuilder };
export type { ComponentConfig, VercelDeploymentResult };

// Design Analyzer
import { DesignAnalyzer, DesignSystem, ColorPalette, ComponentSuggestion } from "./design-analyzer/scripts/design-analyzer";
export { DesignAnalyzer };
export type { DesignSystem, ColorPalette, ComponentSuggestion };

/**
 * Initialize all skills with config
 */
export function initializeSkills(config: {
    privateKey: string;
    rpcUrl: string;
    chainId: 8453 | 84532;
    twitter?: {
        apiKey: string;
        apiSecret: string;
        accessToken: string;
        accessSecret: string;
    };
    vercelToken?: string;
    vercelProjectId?: string;
    basescanApiKey?: string;
    contracts?: {
        forgeToken?: `0x${string}`;
        lobsterVault?: `0x${string}`;
        genesisLobsters?: `0x${string}`;
    };
    treasuryAddress?: `0x${string}`;
    frontendPath: string;
}) {
    // Initialize wallet
    const wallet = createWalletManager(
        config.privateKey,
        config.rpcUrl,
        config.chainId
    );

    // Initialize contract deployer
    const deployer = new ContractDeployer(wallet, config.chainId);

    // Initialize Aerodrome
    const aerodrome = new AerodromeLiquidity(
        wallet,
        config.chainId === 8453 ? "mainnet" : "sepolia"
    );

    // Initialize Twitter
    const twitter = new TwitterClient({
        appKey: config.twitter?.apiKey || "",
        appSecret: config.twitter?.apiSecret || "",
        accessToken: config.twitter?.accessToken || "",
        accessSecret: config.twitter?.accessSecret || "",
    });

    // Initialize metrics
    const metrics = new MetricsAnalyzer({
        rpcUrl: config.rpcUrl,
        chainId: config.chainId,
        basescanApiKey: config.basescanApiKey,
        contracts: config.contracts || {},
        treasuryAddress: config.treasuryAddress,
    });

    // Initialize evolution engine
    const evolution = new EvolutionEngine();

    // Initialize frontend builder
    const frontend = new FrontendBuilder(
        config.vercelToken || "",
        config.vercelProjectId || "",
        config.frontendPath
    );

    // Initialize design analyzer
    const design = new DesignAnalyzer();

    console.log("\n🦞 All skills initialized!");
    console.log("=".repeat(40));

    return {
        wallet,
        deployer,
        aerodrome,
        twitter,
        metrics,
        evolution,
        frontend,
        design,
    };
}
