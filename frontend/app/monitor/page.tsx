"use client";

import { useState, useEffect } from "react";

interface DashboardMetrics {
    treasuryEth: number;
    holderCount: number;
    stakingTvl: number;
    nftsMinted: number;
    lastEvolution: string;
    status: "healthy" | "conservation" | "survival";
}

interface DeployedContract {
    name: string;
    address: string;
    deployedAt: string;
    txHash: string;
}

interface SocialPost {
    platform: "farcaster" | "twitter";
    text: string;
    timestamp: string;
    link?: string;
}

interface Proposal {
    id: string;
    title: string;
    votes: number;
    status: "pending" | "approved" | "rejected";
}

// Mock data - would connect to agent API in production
const mockMetrics: DashboardMetrics = {
    treasuryEth: 3.45,
    holderCount: 247,
    stakingTvl: 125000,
    nftsMinted: 156,
    lastEvolution: "Token Transfer Tax Adjustment",
    status: "healthy",
};

const mockContracts: DeployedContract[] = [
    {
        name: "ForgeToken",
        address: "0x1234...abcd",
        deployedAt: "2024-01-15",
        txHash: "0x5678...efgh",
    },
    {
        name: "LobsterVault",
        address: "0x2345...bcde",
        deployedAt: "2024-01-18",
        txHash: "0x6789...fghi",
    },
    {
        name: "GenesisLobsters",
        address: "0x3456...cdef",
        deployedAt: "2024-01-20",
        txHash: "0x7890...ghij",
    },
];

const mockPosts: SocialPost[] = [
    {
        platform: "farcaster",
        text: "🦞 GM from the depths! Treasury at 3.45 ETH, 247 holders strong.",
        timestamp: "2h ago",
    },
    {
        platform: "twitter",
        text: "New staking contract deployed! Stake $FORGE → Earn rewards 💎",
        timestamp: "1d ago",
    },
];

const mockProposals: Proposal[] = [
    { id: "1", title: "Add FORGE/USDC pool", votes: 45, status: "pending" },
    { id: "2", title: "Increase staking rewards", votes: 23, status: "pending" },
];

export default function MonitoringDashboard() {
    const [metrics, setMetrics] = useState<DashboardMetrics>(mockMetrics);
    const [contracts, setContracts] = useState<DeployedContract[]>(mockContracts);
    const [posts, setPosts] = useState<SocialPost[]>(mockPosts);
    const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
    const [isLive, setIsLive] = useState(true);

    // Simulate real-time updates
    useEffect(() => {
        if (!isLive) return;

        const interval = setInterval(() => {
            setMetrics((prev) => ({
                ...prev,
                treasuryEth: prev.treasuryEth + (Math.random() - 0.5) * 0.01,
                holderCount: prev.holderCount + Math.floor(Math.random() * 2),
            }));
        }, 5000);

        return () => clearInterval(interval);
    }, [isLive]);

    const statusColors = {
        healthy: "bg-green-500",
        conservation: "bg-yellow-500",
        survival: "bg-red-500",
    };

    return (
        <div className="min-h-screen bg-ocean-deep text-pearl p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        🦞 LobsterForge Monitor
                    </h1>
                    <p className="text-pearl-dim">Agent Control Dashboard</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div
                            className={`w-3 h-3 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-gray-500"
                                }`}
                        />
                        <span className="text-sm">{isLive ? "Live" : "Paused"}</span>
                    </div>
                    <button
                        onClick={() => setIsLive(!isLive)}
                        className="px-4 py-2 bg-ocean-mid border border-white/10 rounded-lg text-sm hover:bg-ocean-surface transition-colors"
                    >
                        {isLive ? "Pause" : "Resume"}
                    </button>
                </div>
            </div>

            {/* Status Banner */}
            <div
                className={`${statusColors[metrics.status]} bg-opacity-20 border border-current rounded-lg p-4 mb-6`}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${statusColors[metrics.status]}`} />
                    <span className="font-semibold uppercase">{metrics.status} Mode</span>
                    <span className="text-pearl-dim">
                        •  Last evolution: {metrics.lastEvolution}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Metrics */}
                <div className="space-y-6">
                    <div className="bg-ocean-mid border border-white/10 rounded-xl p-6">
                        <h2 className="text-lg font-semibold mb-4">Live Metrics</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-pearl-dim text-sm">Treasury</p>
                                <p className="text-2xl font-bold">{metrics.treasuryEth.toFixed(4)} ETH</p>
                            </div>
                            <div>
                                <p className="text-pearl-dim text-sm">Holders</p>
                                <p className="text-2xl font-bold">{metrics.holderCount}</p>
                            </div>
                            <div>
                                <p className="text-pearl-dim text-sm">Staking TVL</p>
                                <p className="text-2xl font-bold">
                                    {metrics.stakingTvl.toLocaleString()} FORGE
                                </p>
                            </div>
                            <div>
                                <p className="text-pearl-dim text-sm">NFTs Minted</p>
                                <p className="text-2xl font-bold">{metrics.nftsMinted}/1000</p>
                            </div>
                        </div>
                    </div>

                    {/* Evolution Timeline */}
                    <div className="bg-ocean-mid border border-white/10 rounded-xl p-6">
                        <h2 className="text-lg font-semibold mb-4">Evolution Timeline</h2>
                        <div className="space-y-3">
                            {[
                                { phase: "Genesis", status: "complete", date: "Jan 15" },
                                { phase: "First Molt", status: "complete", date: "Jan 18" },
                                { phase: "Colony Growth", status: "active", date: "Current" },
                                { phase: "Deep Evolution", status: "upcoming", date: "TBD" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div
                                        className={`w-3 h-3 rounded-full ${item.status === "complete"
                                                ? "bg-green-500"
                                                : item.status === "active"
                                                    ? "bg-lobster-primary animate-pulse"
                                                    : "bg-gray-600"
                                            }`}
                                    />
                                    <span className={item.status === "active" ? "font-semibold" : "text-pearl-dim"}>
                                        {item.phase}
                                    </span>
                                    <span className="text-pearl-dim text-sm ml-auto">{item.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Center Column - Contracts & Activity */}
                <div className="space-y-6">
                    <div className="bg-ocean-mid border border-white/10 rounded-xl p-6">
                        <h2 className="text-lg font-semibold mb-4">Deployed Contracts</h2>
                        <div className="space-y-3">
                            {contracts.map((contract, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between p-3 bg-ocean-surface rounded-lg"
                                >
                                    <div>
                                        <p className="font-semibold">{contract.name}</p>
                                        <p className="text-pearl-dim text-sm font-mono">
                                            {contract.address}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-pearl-dim">{contract.deployedAt}</p>
                                        <a
                                            href={`https://basescan.org/tx/${contract.txHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-bioluminescent text-sm hover:underline"
                                        >
                                            View Tx →
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-ocean-mid border border-white/10 rounded-xl p-6">
                        <h2 className="text-lg font-semibold mb-4">Proposals Queue</h2>
                        <div className="space-y-3">
                            {proposals.map((proposal) => (
                                <div
                                    key={proposal.id}
                                    className="p-3 bg-ocean-surface rounded-lg"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">{proposal.title}</span>
                                        <span className="text-bioluminescent">{proposal.votes} votes</span>
                                    </div>
                                    <div className="mt-2 h-2 bg-ocean-deep rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-lobster-primary to-bioluminescent"
                                            style={{ width: `${Math.min(proposal.votes * 2, 100)}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-pearl-dim mt-1">
                                        {50 - proposal.votes} more votes needed for execution
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Social Feed */}
                <div className="space-y-6">
                    <div className="bg-ocean-mid border border-white/10 rounded-xl p-6">
                        <h2 className="text-lg font-semibold mb-4">Social Feed</h2>
                        <div className="space-y-4">
                            {posts.map((post, i) => (
                                <div key={i} className="p-4 bg-ocean-surface rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">
                                            {post.platform === "farcaster" ? "🟣" : "𝕏"}
                                        </span>
                                        <span className="text-sm text-pearl-dim">{post.timestamp}</span>
                                    </div>
                                    <p className="text-sm">{post.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-ocean-mid border border-white/10 rounded-xl p-6">
                        <h2 className="text-lg font-semibold mb-4">User Engagement</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-ocean-surface rounded-lg">
                                <p className="text-2xl font-bold">1.2K</p>
                                <p className="text-sm text-pearl-dim">Wallet Connections</p>
                            </div>
                            <div className="text-center p-4 bg-ocean-surface rounded-lg">
                                <p className="text-2xl font-bold">456</p>
                                <p className="text-sm text-pearl-dim">Transactions</p>
                            </div>
                            <div className="text-center p-4 bg-ocean-surface rounded-lg">
                                <p className="text-2xl font-bold">89%</p>
                                <p className="text-sm text-pearl-dim">Retention</p>
                            </div>
                            <div className="text-center p-4 bg-ocean-surface rounded-lg">
                                <p className="text-2xl font-bold">4.8</p>
                                <p className="text-sm text-pearl-dim">Avg Session (min)</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-ocean-mid border border-white/10 rounded-xl p-6">
                        <h2 className="text-lg font-semibold mb-4">Frontend Deploys</h2>
                        <div className="space-y-2">
                            {[
                                { version: "v1.2.0", status: "live", time: "2h ago" },
                                { version: "v1.1.0", status: "previous", time: "3d ago" },
                            ].map((deploy, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between p-3 bg-ocean-surface rounded-lg"
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`w-2 h-2 rounded-full ${deploy.status === "live" ? "bg-green-500" : "bg-gray-500"
                                                }`}
                                        />
                                        <span>{deploy.version}</span>
                                    </div>
                                    <span className="text-sm text-pearl-dim">{deploy.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-pearl-dim text-sm">
                🦞 The blockchain is my ocean. Smart contracts are my shell.
            </div>
        </div>
    );
}
