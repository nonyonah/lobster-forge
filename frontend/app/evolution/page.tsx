import MetricCard from "@/components/MetricCard";

interface Contract {
    id: string;
    name: string;
    type: string;
    address: string;
    deployedAt: string;
    gas: string;
    tvl?: string;
    users?: number;
    status: "active" | "deprecated";
}

const deployedContracts: Contract[] = [
    {
        id: "1",
        name: "$FORGE Token",
        type: "ERC-20",
        address: "0x1234...5678",
        deployedAt: "Jan 15, 2024",
        gas: "0.02 ETH",
        tvl: "45.2 ETH",
        users: 247,
        status: "active",
    },
    {
        id: "2",
        name: "LobsterVault v1",
        type: "Staking",
        address: "0xabcd...ef01",
        deployedAt: "Feb 2, 2024",
        gas: "0.05 ETH",
        tvl: "23.1 ETH",
        users: 89,
        status: "active",
    },
    {
        id: "3",
        name: "Genesis Lobsters",
        type: "ERC-721",
        address: "0x9876...5432",
        deployedAt: "Feb 10, 2024",
        gas: "0.08 ETH",
        users: 156,
        status: "active",
    },
    {
        id: "4",
        name: "LobsterDAO",
        type: "Governance",
        address: "0xfedc...ba98",
        deployedAt: "Feb 18, 2024",
        gas: "0.12 ETH",
        users: 67,
        status: "active",
    },
    {
        id: "5",
        name: "Liquidity Pool Router",
        type: "DeFi",
        address: "0x1111...2222",
        deployedAt: "Feb 25, 2024",
        gas: "0.15 ETH",
        tvl: "12.5 ETH",
        users: 34,
        status: "active",
    },
];

interface EvolutionTrigger {
    name: string;
    description: string;
    current: number;
    target: number;
    unit: string;
    reward: string;
}

const evolutionTriggers: EvolutionTrigger[] = [
    {
        name: "500 Holders",
        description: "Deploy advanced staking with boost mechanics",
        current: 247,
        target: 500,
        unit: "holders",
        reward: "Tiered Staking + NFT Airdrop",
    },
    {
        name: "10 ETH Treasury",
        description: "Deploy LobsterDAO governance upgrades",
        current: 8.42,
        target: 10,
        unit: "ETH",
        reward: "On-chain Voting + Proposals",
    },
    {
        name: "1000 Farcaster Followers",
        description: "Launch community prediction market",
        current: 523,
        target: 1000,
        unit: "followers",
        reward: "Prediction Market Contract",
    },
];

interface Proposal {
    id: string;
    title: string;
    proposer: string;
    votes: number;
    status: "active" | "passed" | "rejected";
    endTime: string;
}

const proposals: Proposal[] = [
    {
        id: "1",
        title: "Add $FORGE/USDC liquidity pool on Aerodrome",
        proposer: "0x7890...1234",
        votes: 45,
        status: "active",
        endTime: "2 days",
    },
    {
        id: "2",
        title: "Create partnership with BaseSwap",
        proposer: "0xdef0...5678",
        votes: 67,
        status: "passed",
        endTime: "Ended",
    },
    {
        id: "3",
        title: "Deploy yield aggregator integration",
        proposer: "0xaaaa...bbbb",
        votes: 23,
        status: "active",
        endTime: "5 days",
    },
];

export default function EvolutionPage() {
    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Evolution Lab</h1>
                    <p className="text-pearl-dim">
                        Watch the ecosystem grow. Every contract is a new shell. 🦞
                    </p>
                </div>

                {/* Stats Overview */}
                <section className="mb-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MetricCard
                            label="Total Contracts"
                            value={deployedContracts.length}
                            subValue="All deployed & verified"
                            icon="📜"
                        />
                        <MetricCard
                            label="Total TVL"
                            value="80.8 ETH"
                            subValue="$161,600 USD"
                            trend="up"
                            icon="💎"
                        />
                        <MetricCard
                            label="Total Users"
                            value="593"
                            subValue="Unique addresses"
                            trend="up"
                            icon="👥"
                        />
                        <MetricCard
                            label="Gas Spent"
                            value="0.42 ETH"
                            subValue="On deployments"
                            icon="⛽"
                        />
                    </div>
                </section>

                {/* Evolution Triggers */}
                <section className="mb-12">
                    <h2 className="text-xl font-semibold mb-4">Evolution Triggers</h2>
                    <p className="text-pearl-dim mb-6">
                        When these milestones are reached, new features are automatically deployed.
                    </p>
                    <div className="grid md:grid-cols-3 gap-6">
                        {evolutionTriggers.map((trigger, index) => {
                            const progress = (trigger.current / trigger.target) * 100;
                            return (
                                <div key={index} className="card">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold">{trigger.name}</h3>
                                        <span className="text-sm text-bioluminescent">
                                            {Math.round(progress)}%
                                        </span>
                                    </div>
                                    <p className="text-sm text-pearl-dim mb-4">{trigger.description}</p>
                                    <div className="progress-bar mb-3">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-pearl-muted">
                                            {trigger.current} / {trigger.target} {trigger.unit}
                                        </span>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-white/10">
                                        <p className="text-xs text-pearl-muted">Unlocks:</p>
                                        <p className="text-sm text-lobster-primary">{trigger.reward}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Deployed Contracts */}
                <section className="mb-12">
                    <h2 className="text-xl font-semibold mb-4">Deployed Contracts</h2>
                    <div className="card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left py-4 px-4 text-pearl-dim font-medium text-sm">
                                            Contract
                                        </th>
                                        <th className="text-left py-4 px-4 text-pearl-dim font-medium text-sm">
                                            Type
                                        </th>
                                        <th className="text-left py-4 px-4 text-pearl-dim font-medium text-sm">
                                            Address
                                        </th>
                                        <th className="text-left py-4 px-4 text-pearl-dim font-medium text-sm">
                                            TVL
                                        </th>
                                        <th className="text-left py-4 px-4 text-pearl-dim font-medium text-sm">
                                            Users
                                        </th>
                                        <th className="text-left py-4 px-4 text-pearl-dim font-medium text-sm">
                                            Deployed
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deployedContracts.map((contract) => (
                                        <tr
                                            key={contract.id}
                                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                        >
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                                    <span className="font-medium">{contract.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="text-sm px-2 py-1 bg-ocean-surface rounded">
                                                    {contract.type}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <a
                                                    href={`https://basescan.org/address/${contract.address}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-bioluminescent hover:underline text-sm font-mono"
                                                >
                                                    {contract.address}
                                                </a>
                                            </td>
                                            <td className="py-4 px-4 text-pearl-dim">
                                                {contract.tvl || "-"}
                                            </td>
                                            <td className="py-4 px-4 text-pearl-dim">
                                                {contract.users || "-"}
                                            </td>
                                            <td className="py-4 px-4 text-pearl-muted text-sm">
                                                {contract.deployedAt}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Community Proposals */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Community Proposals</h2>
                        <button className="btn-secondary text-sm">Submit Proposal</button>
                    </div>
                    <div className="space-y-4">
                        {proposals.map((proposal) => (
                            <div key={proposal.id} className="card">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span
                                                className={`text-xs px-2 py-1 rounded ${proposal.status === "active"
                                                        ? "bg-blue-500/20 text-blue-400"
                                                        : proposal.status === "passed"
                                                            ? "bg-green-500/20 text-green-400"
                                                            : "bg-red-500/20 text-red-400"
                                                    }`}
                                            >
                                                {proposal.status.toUpperCase()}
                                            </span>
                                            <span className="text-pearl-muted text-sm">
                                                by {proposal.proposer}
                                            </span>
                                        </div>
                                        <h3 className="font-medium mb-2">{proposal.title}</h3>
                                        <div className="flex items-center gap-4 text-sm text-pearl-dim">
                                            <span>👍 {proposal.votes} votes</span>
                                            <span>⏰ {proposal.endTime}</span>
                                        </div>
                                    </div>
                                    {proposal.status === "active" && (
                                        <button className="btn-primary text-sm">Vote</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
