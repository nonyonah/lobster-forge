interface MoltPhase {
    id: number;
    name: string;
    description: string;
    status: "completed" | "active" | "upcoming";
    date?: string;
}

const phases: MoltPhase[] = [
    {
        id: 1,
        name: "Genesis",
        description: "$FORGE token deployed, initial liquidity added",
        status: "completed",
        date: "Jan 2024",
    },
    {
        id: 2,
        name: "First Molt",
        description: "Staking contract deployed, 100 holders reached",
        status: "completed",
        date: "Feb 2024",
    },
    {
        id: 3,
        name: "Colony Growth",
        description: "NFT collection launched, DAO governance activated",
        status: "active",
        date: "In Progress",
    },
    {
        id: 4,
        name: "Deep Evolution",
        description: "Advanced yield strategies, cross-chain expansion",
        status: "upcoming",
    },
    {
        id: 5,
        name: "Apex Predator",
        description: "Full ecosystem dominance, partner integrations",
        status: "upcoming",
    },
];

export default function MoltTimeline() {
    return (
        <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-ocean-surface" />

            <div className="space-y-6">
                {phases.map((phase, index) => (
                    <div key={phase.id} className="relative flex items-start gap-6 pl-12">
                        {/* Status indicator */}
                        <div
                            className={`absolute left-2 w-5 h-5 rounded-full border-2 flex items-center justify-center
                ${phase.status === "completed"
                                    ? "bg-lobster-primary border-lobster-primary"
                                    : phase.status === "active"
                                        ? "bg-bioluminescent border-bioluminescent animate-pulse-glow"
                                        : "bg-ocean-surface border-pearl-muted"
                                }
              `}
                        >
                            {phase.status === "completed" && (
                                <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            )}
                            {phase.status === "active" && (
                                <span className="text-ocean-deep text-xs font-bold">🦞</span>
                            )}
                        </div>

                        {/* Content */}
                        <div
                            className={`card flex-1 ${phase.status === "active" ? "border-bioluminescent/50" : ""
                                }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h3
                                    className={`font-semibold ${phase.status === "upcoming" ? "text-pearl-muted" : "text-pearl"
                                        }`}
                                >
                                    Phase {phase.id}: {phase.name}
                                </h3>
                                {phase.date && (
                                    <span
                                        className={`text-sm ${phase.status === "active"
                                                ? "text-bioluminescent"
                                                : "text-pearl-muted"
                                            }`}
                                    >
                                        {phase.date}
                                    </span>
                                )}
                            </div>
                            <p
                                className={`text-sm ${phase.status === "upcoming" ? "text-pearl-muted/70" : "text-pearl-dim"
                                    }`}
                            >
                                {phase.description}
                            </p>
                        </div>

                        {/* Connection line to next */}
                        {index < phases.length - 1 && (
                            <div
                                className={`absolute left-4 top-8 w-0.5 h-full -z-10 ${phase.status === "completed" ? "bg-lobster-primary/50" : ""
                                    }`}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
