/**
 * Evolution Engine Skill
 * LLM-driven decision tree for autonomous evolution
 */

import type { Metrics } from "../metrics-analyzer/scripts/metrics-analyzer";

// Evolution thresholds
const THRESHOLDS = {
    survivalEth: 0.3,
    conservationEth: 0.5,
    advancedStakingEth: 5.0,
    moltHolderBase: 500,
    moltHolderInterval: 100,
    proposalMinVotes: 50,
    proposalMinFeasibility: 0.8,
    maxSingleSpendPercent: 15,
    gasRunwayHours: 72,
    postIntervalHours: 24,
};

export type ActionType =
    | "SURVIVAL_MODE"
    | "CONSERVATION_MODE"
    | "DEPLOY_ADVANCED_STAKING"
    | "MOLT_EVENT"
    | "EXECUTE_PROPOSAL"
    | "POST_METRICS"
    | "EXIT_CONSERVATION"
    | "NO_ACTION";

export interface EvolutionAction {
    type: ActionType;
    priority: number; // 0-100, higher = more important
    params?: Record<string, unknown>;
    message?: string;
}

export interface Proposal {
    id: string;
    title: string;
    description: string;
    votes: number;
    feasibilityScore: number;
    costEth: number;
    proposer: `0x${string}`;
    template?: string;
}

export interface AgentState {
    deployedContracts: string[];
    lastMoltHolderCount: number;
    conservationMode: boolean;
    survivalMode: boolean;
    lastPostTime: Date;
    pendingProposals: Proposal[];
}

export class EvolutionEngine {
    private thresholds: typeof THRESHOLDS;

    constructor(customThresholds?: Partial<typeof THRESHOLDS>) {
        this.thresholds = { ...THRESHOLDS, ...customThresholds };
        console.log("🦞 Evolution Engine initialized");
    }

    /**
     * Evaluate current state and return prioritized actions
     */
    evaluate(metrics: Metrics, state: AgentState): EvolutionAction[] {
        const actions: EvolutionAction[] = [];
        const t = this.thresholds;

        console.log("🧠 Evaluating evolution triggers...");

        // === PRIORITY 100: Survival Mode ===
        if (metrics.treasuryEth < t.survivalEth) {
            return [{
                type: "SURVIVAL_MODE",
                priority: 100,
                message: `Treasury critical: ${metrics.treasuryEth.toFixed(3)} ETH`,
            }];
        }

        // === Check for mode exit ===
        if (state.survivalMode && metrics.treasuryEth >= t.conservationEth) {
            actions.push({
                type: "EXIT_CONSERVATION",
                priority: 95,
                params: { previousMode: "survival" },
                message: "Exiting survival mode",
            });
        } else if (state.conservationMode && metrics.treasuryEth >= t.advancedStakingEth) {
            actions.push({
                type: "EXIT_CONSERVATION",
                priority: 95,
                params: { previousMode: "conservation" },
                message: "Exiting conservation mode",
            });
        }

        // === PRIORITY 90: Conservation Mode ===
        if (metrics.treasuryEth < t.conservationEth && !state.survivalMode) {
            actions.push({
                type: "CONSERVATION_MODE",
                priority: 90,
                message: `Treasury low: ${metrics.treasuryEth.toFixed(3)} ETH`,
            });
        }

        // Skip deployment triggers if in conservation
        if (!state.conservationMode && !state.survivalMode) {
            // === PRIORITY 70: Deploy Advanced Staking ===
            if (
                metrics.treasuryEth >= t.advancedStakingEth &&
                !state.deployedContracts.includes("advanced_staking")
            ) {
                actions.push({
                    type: "DEPLOY_ADVANCED_STAKING",
                    priority: 70,
                    message: `Treasury milestone: ${metrics.treasuryEth.toFixed(2)} ETH`,
                });
            }

            // === PRIORITY 60: Molt Events ===
            if (metrics.holderCount >= t.moltHolderBase) {
                const lastMolt = state.lastMoltHolderCount || 0;
                const nextMoltAt = Math.ceil(
                    (lastMolt + 1) / t.moltHolderInterval
                ) * t.moltHolderInterval;

                if (metrics.holderCount >= nextMoltAt && nextMoltAt > lastMolt) {
                    actions.push({
                        type: "MOLT_EVENT",
                        priority: 60,
                        params: { holderMilestone: nextMoltAt },
                        message: `Holder milestone: ${nextMoltAt}`,
                    });
                }
            }

            // === PRIORITY 50: Execute Proposals ===
            for (const proposal of state.pendingProposals) {
                const score = this.scoreProposal(proposal);

                if (score >= t.proposalMinFeasibility) {
                    // Check spending limit
                    const maxSpend = metrics.treasuryEth * (t.maxSingleSpendPercent / 100);

                    if (proposal.costEth <= maxSpend) {
                        actions.push({
                            type: "EXECUTE_PROPOSAL",
                            priority: 50,
                            params: {
                                proposalId: proposal.id,
                                score,
                                cost: proposal.costEth,
                            },
                            message: `Proposal ready: ${proposal.title} (score: ${score.toFixed(2)})`,
                        });
                    }
                }
            }
        }

        // === PRIORITY 20: Metrics Post ===
        const hoursSincePost = (Date.now() - state.lastPostTime.getTime()) / (1000 * 60 * 60);
        if (hoursSincePost >= t.postIntervalHours) {
            actions.push({
                type: "POST_METRICS",
                priority: 20,
                params: { hoursSincePost },
                message: `${hoursSincePost.toFixed(0)}h since last post`,
            });
        }

        // Sort by priority (descending)
        actions.sort((a, b) => b.priority - a.priority);

        // Log decisions
        if (actions.length > 0) {
            console.log(`Found ${actions.length} actions:`);
            actions.forEach((a) => console.log(`  [${a.priority}] ${a.type}: ${a.message}`));
        } else {
            console.log("No actions needed this cycle.");
        }

        return actions.length > 0 ? actions : [{ type: "NO_ACTION", priority: 0 }];
    }

    /**
     * Score a community proposal
     */
    scoreProposal(proposal: Proposal): number {
        let score = 0;

        // Technical: Uses approved template (0.3)
        if (proposal.template) {
            const approvedTemplates = ["ForgeToken", "LobsterVault", "GenesisLobsters"];
            if (approvedTemplates.includes(proposal.template)) {
                score += 0.3;
            }
        }

        // Technical: Feasibility from review (0.2)
        score += Math.min(proposal.feasibilityScore, 1) * 0.2;

        // Technical: Cost efficiency (0.1)
        if (proposal.costEth < 0.5) {
            score += 0.1;
        } else if (proposal.costEth < 1.0) {
            score += 0.05;
        }

        // Community: Voter support (0.2)
        const voteScore = Math.min(proposal.votes / 100, 1);
        score += voteScore * 0.2;

        // Theme: Lobster alignment (0.1)
        const lobsterTerms = ["lobster", "colony", "molt", "shell", "claw", "forge"];
        const text = `${proposal.title} ${proposal.description}`.toLowerCase();
        if (lobsterTerms.some((term) => text.includes(term))) {
            score += 0.1;
        }

        // Financial: Positive ROI signals (0.1)
        const roiTerms = ["revenue", "yield", "profit", "earn", "reward"];
        if (roiTerms.some((term) => text.includes(term))) {
            score += 0.1;
        }

        return Math.min(score, 1);
    }

    /**
     * Check if action is safe to execute
     */
    isActionSafe(
        action: EvolutionAction,
        metrics: Metrics
    ): { safe: boolean; reason?: string } {
        // Always safe
        if (["NO_ACTION", "POST_METRICS", "EXIT_CONSERVATION"].includes(action.type)) {
            return { safe: true };
        }

        // Always execute mode changes
        if (["SURVIVAL_MODE", "CONSERVATION_MODE"].includes(action.type)) {
            return { safe: true };
        }

        // Block deployments in conservation/survival
        if (metrics.treasuryEth < this.thresholds.conservationEth) {
            return {
                safe: false,
                reason: `Conservation mode: treasury at ${metrics.treasuryEth.toFixed(3)} ETH`,
            };
        }

        // Check gas runway
        if (metrics.gasRunwayHours < this.thresholds.gasRunwayHours) {
            return {
                safe: false,
                reason: `Insufficient gas runway: ${metrics.gasRunwayHours.toFixed(0)}h`,
            };
        }

        return { safe: true };
    }

    /**
     * Generate announcement for action
     */
    generateAnnouncement(action: EvolutionAction): string {
        switch (action.type) {
            case "SURVIVAL_MODE":
                return `⚠️ SURVIVAL MODE

Treasury critical. All non-essential operations halted.
Focus: Revenue recovery, gas preservation.

Lobsters have survived 5 mass extinctions.
This is nothing.

Diamond claws only. 💎🦞`;

            case "CONSERVATION_MODE":
                return `🌊 CONSERVATION MODE

Treasury below optimal. The wise lobster conserves.

Pausing new deployments until reserves recover.
Current operations continue normally.

The storm will pass. The lobster endures. 🦞`;

            case "DEPLOY_ADVANCED_STAKING":
                return `🦞 EVOLUTION TRIGGERED

Treasury milestone reached! Deploying advanced staking.

Stake $FORGE → Earn boosted rewards
Diamond claws get 2x multiplier

The Lobster evolves. The Lobster provides. ⚡`;

            case "MOLT_EVENT":
                const milestone = action.params?.holderMilestone || "???";
                return `🦞 MOLT COMPLETE

${milestone} holders reached!

New shell acquired:
• Generative NFT drop for colony
• 1% $FORGE burn (deflationary)

We shed. We grow. We dominate. 💎`;

            case "EXIT_CONSERVATION":
                return `🦞 CONSERVATION LIFTED

Reserves restored. Evolution resumes.

The colony weathered the storm.
Now we grow stronger.

Full operations online. ⚡🦞`;

            default:
                return "";
        }
    }

    /**
     * Get readable status
     */
    getStatus(state: AgentState): string {
        if (state.survivalMode) return "🔴 SURVIVAL";
        if (state.conservationMode) return "🟡 CONSERVATION";
        return "🟢 OPERATIONAL";
    }
}
