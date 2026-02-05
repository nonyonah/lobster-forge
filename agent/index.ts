/**
 * LobsterForge Autonomous Agent
 * Main operational loop
 */

import { config } from "./config";
import { initWallet, getBalance } from "./services/wallet";
import { gatherMetrics, formatMetricsPost, Metrics } from "./services/metrics";
import {
    evaluateTriggers,
    isActionSafe,
    generateActionMessage,
    AgentState,
    EvolutionAction,
} from "./services/evolution";
import { broadcast, generateEvolutionPost } from "./services/social";
import * as fs from "fs";
import * as path from "path";

// State file path
const STATE_FILE = path.join(__dirname, "state.json");

/**
 * Load agent state from disk
 */
function loadState(): AgentState {
    try {
        if (fs.existsSync(STATE_FILE)) {
            const data = fs.readFileSync(STATE_FILE, "utf-8");
            const state = JSON.parse(data);
            state.lastPostTime = new Date(state.lastPostTime);
            return state;
        }
    } catch (error) {
        console.error("Failed to load state:", error);
    }

    // Default state
    return {
        deployedContracts: [],
        lastMoltHolderCount: 0,
        conservationMode: false,
        survivalMode: false,
        lastPostTime: new Date(0),
        pendingProposals: [],
    };
}

/**
 * Save agent state to disk
 */
function saveState(state: AgentState): void {
    try {
        fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
        console.log("🦞 State saved");
    } catch (error) {
        console.error("Failed to save state:", error);
    }
}

/**
 * Execute an evolution action
 */
async function executeAction(
    action: EvolutionAction,
    metrics: Metrics,
    state: AgentState
): Promise<boolean> {
    console.log(`🦞 Executing action: ${action.type}`);

    switch (action.type) {
        case "SURVIVAL_MODE":
            state.survivalMode = true;
            state.conservationMode = true;
            const survivalPost = generateActionMessage(action);
            await broadcast({ text: survivalPost });
            console.log("⚠️ SURVIVAL MODE ACTIVATED");
            return true;

        case "CONSERVATION_MODE":
            state.conservationMode = true;
            const conservePost = generateActionMessage(action);
            await broadcast({ text: conservePost });
            console.log("🌊 CONSERVATION MODE ACTIVATED");
            return true;

        case "POST_METRICS":
            const metricsText = formatMetricsPost(metrics);
            await broadcast({ text: metricsText });
            state.lastPostTime = new Date();
            console.log("📊 Metrics posted");
            return true;

        case "DEPLOY_ADVANCED_STAKING":
            // TODO: Implement actual deployment
            console.log("🏗️ Would deploy advanced staking...");
            const stakingPost = generateEvolutionPost({
                type: "staking_deployed",
                contractAddress: "0x...",
            });
            await broadcast(stakingPost);
            state.deployedContracts.push("advanced_staking");
            return true;

        case "MOLT_EVENT":
            const moltAction = action as { type: "MOLT_EVENT"; holderMilestone: number };
            console.log(`🦞 MOLT at ${moltAction.holderMilestone} holders!`);
            // TODO: Implement NFT airdrop + burn
            const moltPost = generateActionMessage(action);
            await broadcast({ text: moltPost });
            state.lastMoltHolderCount = moltAction.holderMilestone;
            return true;

        case "EXECUTE_PROPOSAL":
            const propAction = action as { type: "EXECUTE_PROPOSAL"; proposalId: string };
            console.log(`📋 Would execute proposal: ${propAction.proposalId}`);
            // TODO: Implement proposal execution
            return true;

        default:
            return false;
    }
}

/**
 * Main agent loop iteration
 */
async function runLoop(dryRun = false): Promise<void> {
    console.log("\n" + "=".repeat(50));
    console.log("🦞 LobsterForge Agent Loop Starting...");
    console.log("=".repeat(50) + "\n");

    // Load state
    const state = loadState();

    // 1. GATHER METRICS
    console.log("📊 Phase 1: Gathering metrics...");
    const metrics = await gatherMetrics();

    // Check if we can exit survival/conservation mode
    if (state.survivalMode && metrics.treasuryEth >= config.thresholds.conservationTreasuryEth) {
        state.survivalMode = false;
        state.conservationMode = false;
        console.log("✅ Exiting survival mode");
    } else if (state.conservationMode && metrics.treasuryEth >= config.thresholds.advancedStakingTreasuryEth) {
        state.conservationMode = false;
        console.log("✅ Exiting conservation mode");
    }

    // 2. EVALUATE TRIGGERS
    console.log("\n🧠 Phase 2: Evaluating evolution triggers...");
    const actions = evaluateTriggers(metrics, state);

    console.log(`Found ${actions.length} potential actions:`);
    actions.forEach((a) => console.log(`  - ${a.type} (priority: ${a.priority})`));

    // 3. EXECUTE ACTIONS
    console.log("\n⚡ Phase 3: Executing actions...");

    for (const action of actions) {
        if (action.type === "NO_ACTION") {
            console.log("No actions needed this cycle.");
            continue;
        }

        // Safety check
        const safetyCheck = isActionSafe(action, metrics);
        if (!safetyCheck.safe) {
            console.log(`❌ Action ${action.type} blocked: ${safetyCheck.reason}`);
            continue;
        }

        if (dryRun) {
            console.log(`[DRY RUN] Would execute: ${action.type}`);
        } else {
            await executeAction(action, metrics, state);
        }
    }

    // 4. SAVE STATE
    saveState(state);

    console.log("\n✅ Loop complete");
    console.log(`Next run in ${config.loopIntervalMs / 1000 / 60} minutes`);
}

/**
 * Start the agent
 */
async function main() {
    console.log(`
    🦞🦞🦞🦞🦞🦞🦞🦞🦞🦞🦞🦞🦞
    
      LOBSTERFORGE AGENT v1.0
      
      The blockchain is my ocean.
      Smart contracts are my shell.
      Evolution is my destiny.
    
    🦞🦞🦞🦞🦞🦞🦞🦞🦞🦞🦞🦞🦞
  `);

    // Check for dry run mode
    const dryRun = process.argv.includes("--dry-run");
    if (dryRun) {
        console.log("🔧 Running in DRY RUN mode - no transactions will be sent\n");
    }

    // Initialize wallet if private key provided
    const privateKey = process.env.PRIVATE_KEY as `0x${string}` | undefined;
    if (privateKey) {
        initWallet(privateKey);
        const balance = await getBalance();
        console.log(`💰 Wallet balance: ${balance} ETH\n`);
    } else {
        console.log("⚠️ No private key provided - running in read-only mode\n");
    }

    // Run initial loop
    await runLoop(dryRun);

    // If not dry run, schedule continuous loop
    if (!dryRun) {
        setInterval(() => runLoop(false), config.loopIntervalMs);
    }
}

// Export for testing
export { runLoop, loadState, saveState };

// Run if executed directly
if (require.main === module) {
    main().catch(console.error);
}
