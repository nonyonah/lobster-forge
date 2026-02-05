/**
 * LobsterForge Agent Configuration
 * Environment variables and evolution thresholds
 */

export const config = {
    // Network
    chainId: process.env.CHAIN_ID === "8453" ? 8453 : 84532, // Base Mainnet or Sepolia
    rpcUrl: process.env.BASE_RPC_URL || "https://sepolia.base.org",

    // Contracts (populated after deployment)
    contracts: {
        forgeToken: process.env.FORGE_TOKEN_ADDRESS || "",
        lobsterVault: process.env.LOBSTER_VAULT_ADDRESS || "",
        genesisLobsters: process.env.GENESIS_LOBSTERS_ADDRESS || "",
    },

    // Treasury & Wallet
    treasuryAddress: process.env.TREASURY_ADDRESS || "",
    agentWallet: process.env.AGENT_WALLET_ADDRESS || "",

    // API Keys
    basescanApiKey: process.env.BASESCAN_API_KEY || "",

    // Social (Twitter)
    twitter: {
        apiKey: process.env.TWITTER_API_KEY || "",
        apiSecret: process.env.TWITTER_API_SECRET || "",
        accessToken: process.env.TWITTER_ACCESS_TOKEN || "",
        accessSecret: process.env.TWITTER_ACCESS_SECRET || "",
    },

    // Evolution Thresholds
    thresholds: {
        // Trigger advanced staking
        advancedStakingTreasuryEth: 5.0,

        // Trigger molt events (NFT + burn)
        moltHolderMilestone: 500,
        moltHolderInterval: 100, // Every 100 holders after milestone

        // Proposal requirements
        proposalMinVotes: 50,
        proposalFeasibilityScore: 0.8,

        // Conservation mode
        conservationTreasuryEth: 0.5,
        survivalTreasuryEth: 0.3,

        // Spending limits
        maxSingleSpendPercent: 15,
        maxTxPercent: 20,
        gasRunwayHours: 72,
    },

    // Revenue Allocation (per 1 ETH)
    allocation: {
        gasReserve: 0.40,
        liquidityPool: 0.25,
        communityTreasury: 0.20,
        marketing: 0.10,
        emergencyReserve: 0.05,
    },

    // Agent Loop
    loopIntervalMs: 4 * 60 * 60 * 1000, // 4 hours

    // Social

    twitterHandle: "LobsterForge",
};

export type Config = typeof config;
