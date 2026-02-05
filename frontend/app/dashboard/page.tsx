import MetricCard from "@/components/MetricCard";
import Link from "next/link";

// Mock data - would be replaced with real wallet/contract data
const userHoldings = {
    forgeBalance: "12,450",
    forgeValue: "$1,245.00",
    stakedAmount: "5,000",
    stakingApy: "12.5%",
    pendingRewards: "125.5",
    nftsOwned: 3,
};

const nfts = [
    { id: 1, name: "Genesis Lobster #042", rarity: "Rare", image: "🦞" },
    { id: 2, name: "Molted Shell #128", rarity: "Common", image: "🐚" },
    { id: 3, name: "Deep Sea Explorer #007", rarity: "Legendary", image: "🌊" },
];

const recentActivity = [
    { type: "Stake", amount: "2,500 $FORGE", time: "2 hours ago", hash: "0x1234...5678" },
    { type: "Claim", amount: "45.2 $FORGE", time: "1 day ago", hash: "0xabcd...ef01" },
    { type: "Purchase", amount: "1 NFT", time: "3 days ago", hash: "0x9876...5432" },
];

export default function DashboardPage() {
    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Your Colony Dashboard</h1>
                    <p className="text-pearl-dim">Welcome back, fellow lobster 🦞</p>
                </div>

                {/* Wallet Not Connected State */}
                <div className="card bg-ocean-surface text-center py-12 mb-8">
                    <div className="text-5xl mb-4">🔗</div>
                    <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
                    <p className="text-pearl-dim mb-6 max-w-md mx-auto">
                        Connect your wallet to view your $FORGE holdings, staking rewards,
                        and NFT collection.
                    </p>
                    <button className="btn-primary">Connect Wallet</button>
                </div>

                {/* Holdings Overview */}
                <section className="mb-12">
                    <h2 className="text-xl font-semibold mb-4">Holdings Overview</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MetricCard
                            label="$FORGE Balance"
                            value={userHoldings.forgeBalance}
                            subValue={userHoldings.forgeValue}
                            icon="🦞"
                        />
                        <MetricCard
                            label="Staked Amount"
                            value={userHoldings.stakedAmount}
                            subValue={`${userHoldings.stakingApy} APY`}
                            trend="up"
                            icon="🔒"
                        />
                        <MetricCard
                            label="Pending Rewards"
                            value={userHoldings.pendingRewards}
                            subValue="$FORGE claimable"
                            icon="🎁"
                        />
                        <MetricCard
                            label="NFTs Owned"
                            value={userHoldings.nftsOwned}
                            subValue="View collection"
                            icon="🖼️"
                        />
                    </div>
                </section>

                {/* Staking Section */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Staking</h2>
                        <span className="text-sm text-bioluminescent">APY: 12.5%</span>
                    </div>
                    <div className="card">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Stake */}
                            <div>
                                <h3 className="font-medium text-pearl-dim mb-4">Stake $FORGE</h3>
                                <div className="bg-ocean-surface rounded-lg p-4 mb-4">
                                    <div className="flex justify-between text-sm text-pearl-muted mb-2">
                                        <span>Amount</span>
                                        <span>Balance: 12,450</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            placeholder="0.0"
                                            className="flex-1 bg-transparent text-2xl font-semibold outline-none"
                                        />
                                        <button className="text-sm text-lobster-primary font-medium">MAX</button>
                                    </div>
                                </div>
                                <button className="btn-primary w-full">Stake</button>
                            </div>

                            {/* Unstake */}
                            <div>
                                <h3 className="font-medium text-pearl-dim mb-4">Unstake $FORGE</h3>
                                <div className="bg-ocean-surface rounded-lg p-4 mb-4">
                                    <div className="flex justify-between text-sm text-pearl-muted mb-2">
                                        <span>Amount</span>
                                        <span>Staked: 5,000</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            placeholder="0.0"
                                            className="flex-1 bg-transparent text-2xl font-semibold outline-none"
                                        />
                                        <button className="text-sm text-lobster-primary font-medium">MAX</button>
                                    </div>
                                </div>
                                <button className="btn-secondary w-full">Unstake</button>
                            </div>
                        </div>

                        {/* Claim Rewards */}
                        <div className="mt-8 pt-6 border-t border-white/10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-pearl-dim text-sm">Claimable Rewards</p>
                                    <p className="text-2xl font-bold">125.5 <span className="text-lobster-primary">$FORGE</span></p>
                                </div>
                                <button className="btn-primary">Claim Rewards</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* NFT Gallery */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Your NFT Collection</h2>
                        <Link href="/evolution" className="text-sm text-bioluminescent hover:underline">
                            View all NFTs →
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {nfts.map((nft) => (
                            <div key={nft.id} className="card card-hover">
                                <div className="aspect-square bg-ocean-surface rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-6xl">{nft.image}</span>
                                </div>
                                <h3 className="font-medium mb-1">{nft.name}</h3>
                                <span
                                    className={`text-sm px-2 py-1 rounded ${nft.rarity === "Legendary"
                                            ? "bg-yellow-500/20 text-yellow-400"
                                            : nft.rarity === "Rare"
                                                ? "bg-purple-500/20 text-purple-400"
                                                : "bg-gray-500/20 text-gray-400"
                                        }`}
                                >
                                    {nft.rarity}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Recent Activity */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                    <div className="card">
                        <div className="space-y-4">
                            {recentActivity.map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === "Stake"
                                                    ? "bg-blue-500/20"
                                                    : activity.type === "Claim"
                                                        ? "bg-green-500/20"
                                                        : "bg-purple-500/20"
                                                }`}
                                        >
                                            {activity.type === "Stake" && "🔒"}
                                            {activity.type === "Claim" && "🎁"}
                                            {activity.type === "Purchase" && "🖼️"}
                                        </div>
                                        <div>
                                            <p className="font-medium">{activity.type}</p>
                                            <p className="text-sm text-pearl-dim">{activity.amount}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-pearl-muted">{activity.time}</p>
                                        <a
                                            href={`https://basescan.org/tx/${activity.hash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-bioluminescent hover:underline"
                                        >
                                            {activity.hash}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
