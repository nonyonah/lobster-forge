/**
 * LobsterForge Skills Index
 * Exports all OpenClaw skills for the agent
 */

// Wallet & Transactions
export { WalletManager, createWalletManager } from "./base-wallet-manager/scripts/wallet-manager";
export type { WalletConfig, TransactionParams, TransactionResult } from "./base-wallet-manager/scripts/wallet-manager";

// Contract Deployment
export { ContractDeployer } from "./base-contract-deployer/scripts/contract-deployer";
export type { ContractTemplate, DeploymentResult, DeploymentLog } from "./base-contract-deployer/scripts/contract-deployer";

// Aerodrome Liquidity
export { AerodromeLiquidity } from "./aerodrome-liquidity/scripts/aerodrome-liquidity";
export type { LiquidityPosition, AddLiquidityResult } from "./aerodrome-liquidity/scripts/aerodrome-liquidity";

// Farcaster Social
export { FarcasterClient } from "./farcaster-client/scripts/farcaster-client";
export type { Cast, CastOptions, ChannelStats } from "./farcaster-client/scripts/farcaster-client";

// Metrics Analysis
export { MetricsAnalyzer } from "./metrics-analyzer/scripts/metrics-analyzer";
export type { Metrics, MetricsSnapshot, MetricsConfig } from "./metrics-analyzer/scripts/metrics-analyzer";

// Evolution Engine
export { EvolutionEngine } from "./evolution-engine/scripts/evolution-engine";
export type { EvolutionAction, Proposal, AgentState } from "./evolution-engine/scripts/evolution-engine";

// Frontend Builder
export { FrontendBuilder } from "./frontend-builder/scripts/frontend-builder";
export type { ComponentConfig, DeploymentResult as VercelDeploymentResult } from "./frontend-builder/scripts/frontend-builder";

// Design Analyzer
export { DesignAnalyzer } from "./design-analyzer/scripts/design-analyzer";
export type { DesignSystem, ColorPalette, ComponentSuggestion } from "./design-analyzer/scripts/design-analyzer";

/**
 * Initialize all skills with config
 */
export function initializeSkills(config: {
    privateKey: string;
    rpcUrl: string;
    chainId: 8453 | 84532;
    neynarApiKey?: string;
    farcasterSignerUuid?: string;
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

    // Initialize Farcaster
    const farcaster = new FarcasterClient(
        config.neynarApiKey || "",
        config.farcasterSignerUuid || "",
        "lobsterforge"
    );

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
        farcaster,
        metrics,
        evolution,
        frontend,
        design,
    };
}
