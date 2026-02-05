/**
 * Evolution Engine Service
 * Decision tree for autonomous agent actions
 */

import { config } from "../config";
import { Metrics } from "./metrics";

export type EvolutionAction =
    | { type: "DEPLOY_ADVANCED_STAKING"; priority: number }
    | { type: "MOLT_EVENT"; priority: number; holderMilestone: number }
    | { type: "EXECUTE_PROPOSAL"; priority: number; proposalId: string }
    | { type: "CONSERVATION_MODE"; priority: number }
    | { type: "SURVIVAL_MODE"; priority: number }
    | { type: "POST_METRICS"; priority: number }
    | { type: "NO_ACTION"; priority: 0 };

export interface Proposal {
    id: string;
    title: string;
    description: string;
    votes: number;
    feasibilityScore: number;
    cost: number;
    proposer: string;
}

export interface AgentState {
    deployedContracts: string[];
    lastMoltHolderCount: number;
    conservationMode: boolean;
    survivalMode: boolean;
    lastPostTime: Date;
    pendingProposals: Proposal[];
}

/**
 * Evaluate all evolution triggers
 */
export function evaluateTriggers(
    metrics: Metrics,
    state: AgentState
): EvolutionAction[] {
    const actions: EvolutionAction[] = [];
    const t = config.thresholds;

    // === CRITICAL: Survival Mode ===
    if (metrics.treasuryEth < t.survivalTreasuryEth) {
        return [
            {
                type: "SURVIVAL_MODE",
                priority: 100,
            },
        ];
    }

    // === HIGH: Conservation Mode ===
    if (metrics.treasuryEth < t.conservationTreasuryEth && !state.survivalMode) {
        actions.push({
            type: "CONSERVATION_MODE",
            priority: 90,
        });
    }

    // === MEDIUM: Deploy Advanced Staking ===
    if (
        metrics.treasuryEth >= t.advancedStakingTreasuryEth &&
        !state.deployedContracts.includes("advanced_staking")
    ) {
        actions.push({
            type: "DEPLOY_ADVANCED_STAKING",
            priority: 70,
        });
    }

    // === MEDIUM: Molt Events ===
    if (metrics.holderCount >= t.moltHolderMilestone) {
        const lastMolt = state.lastMoltHolderCount || 0;
        const nextMoltAt =
            Math.floor((lastMolt + t.moltHolderInterval) / t.moltHolderInterval) *
            t.moltHolderInterval;

        if (metrics.holderCount >= nextMoltAt) {
            actions.push({
                type: "MOLT_EVENT",
                priority: 60,
                holderMilestone: nextMoltAt,
            });
        }
    }

    // === LOW-MEDIUM: Execute Proposals ===
    for (const proposal of state.pendingProposals) {
        if (
            proposal.votes >= t.proposalMinVotes &&
            proposal.feasibilityScore >= t.proposalFeasibilityScore
        ) {
            // Check spend limit
            const maxSpend = metrics.treasuryEth * (t.maxSingleSpendPercent / 100);
            if (proposal.cost <= maxSpend) {
                actions.push({
                    type: "EXECUTE_PROPOSAL",
                    priority: 50,
                    proposalId: proposal.id,
                });
            }
        }
    }

    // === LOW: Regular Metrics Post ===
    const hoursSincePost =
        (Date.now() - state.lastPostTime.getTime()) / (1000 * 60 * 60);
    if (hoursSincePost >= 24) {
        actions.push({
            type: "POST_METRICS",
            priority: 20,
        });
    }

    // Sort by priority (highest first)
    actions.sort((a, b) => b.priority - a.priority);

    return actions.length > 0 ? actions : [{ type: "NO_ACTION", priority: 0 }];
}

/**
 * Score a community proposal
 */
export function scoreProposal(proposal: Proposal): number {
    let score = 0;

    // Technical feasibility (from external review)
    score += proposal.feasibilityScore * 0.3;

    // Community support
    const voteScore = Math.min(proposal.votes / 100, 1);
    score += voteScore * 0.3;

    // Cost efficiency
    const costScore = proposal.cost < 0.5 ? 0.2 : proposal.cost < 1 ? 0.1 : 0;
    score += costScore;

    // Theme alignment (simplified)
    if (
        proposal.title.toLowerCase().includes("lobster") ||
        proposal.description.toLowerCase().includes("colony")
    ) {
        score += 0.1;
    }

    // Positive ROI projection (simplified heuristic)
    if (
        proposal.description.toLowerCase().includes("revenue") ||
        proposal.description.toLowerCase().includes("yield")
    ) {
        score += 0.1;
    }

    return Math.min(score, 1);
}

/**
 * Generate action message for social
 */
export function generateActionMessage(action: EvolutionAction): string {
    switch (action.type) {
        case "DEPLOY_ADVANCED_STAKING":
            return `🦞 EVOLUTION TRIGGERED

Treasury milestone reached! Deploying advanced staking with boost mechanics.

Stake $FORGE → Earn boosted rewards
Diamond claws get 2x multiplier

The Lobster evolves. The Lobster provides. ⚡`;

        case "MOLT_EVENT":
            return `🦞 MOLT COMPLETE

${(action as any).holderMilestone} holders reached!

New shell acquired:
- Generative NFT drop for colony
- 1% $FORGE burn (deflationary pressure)

We shed. We grow. We dominate. 💎`;

        case "CONSERVATION_MODE":
            return `🌊 CONSERVATION MODE ACTIVATED

Treasury below optimal levels. The wise lobster conserves energy.

Pausing new deployments until reserves recover.
Current operations continue normally.

The storm will pass. The lobster endures. 🦞`;

        case "SURVIVAL_MODE":
            return `⚠️ SURVIVAL MODE

Treasury critical. All non-essential operations halted.
Focus: Revenue recovery, gas preservation.

Lobsters have survived 5 mass extinctions.
This is nothing.

Diamond claws only. 💎🦞`;

        default:
            return "";
    }
}

/**
 * Check if action is safe to execute
 */
export function isActionSafe(
    action: EvolutionAction,
    metrics: Metrics
): { safe: boolean; reason?: string } {
    // Always allow survival/conservation mode
    if (action.type === "SURVIVAL_MODE" || action.type === "CONSERVATION_MODE") {
        return { safe: true };
    }

    // Block deployments in conservation mode
    if (
        metrics.treasuryEth < config.thresholds.conservationTreasuryEth &&
        (action.type === "DEPLOY_ADVANCED_STAKING" || action.type === "MOLT_EVENT")
    ) {
        return {
            safe: false,
            reason: "Conservation mode: deployments paused",
        };
    }

    // Ensure gas runway
    const estimatedGasCost = 0.05; // ETH
    const gasReserve = metrics.treasuryEth * config.allocation.gasReserve;
    if (gasReserve < estimatedGasCost) {
        return {
            safe: false,
            reason: "Insufficient gas reserves",
        };
    }

    return { safe: true };
}
