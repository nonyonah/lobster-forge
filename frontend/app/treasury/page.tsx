import MetricCard from "@/components/MetricCard";

interface SpendingItem {
    category: string;
    amount: string;
    percentage: number;
    color: string;
}

const allocations: SpendingItem[] = [
    { category: "Gas Reserves", amount: "3.37 ETH", percentage: 40, color: "bg-blue-500" },
    { category: "Liquidity Pool", amount: "2.11 ETH", percentage: 25, color: "bg-purple-500" },
    { category: "Community Treasury", amount: "1.68 ETH", percentage: 20, color: "bg-green-500" },
    { category: "Marketing", amount: "0.84 ETH", percentage: 10, color: "bg-yellow-500" },
    { category: "Emergency Reserve", amount: "0.42 ETH", percentage: 5, color: "bg-red-500" },
];

interface Transaction {
    id: string;
    type: "income" | "expense";
    description: string;
    amount: string;
    date: string;
    txHash: string;
}

const recentTransactions: Transaction[] = [
    {
        id: "1",
        type: "income",
        description: "Trading fees collected",
        amount: "+0.15 ETH",
        date: "Today",
        txHash: "0xabc...123",
    },
    {
        id: "2",
        type: "expense",
        description: "LobsterDAO deployment gas",
        amount: "-0.12 ETH",
        date: "Feb 18",
        txHash: "0xdef...456",
    },
    {
        id: "3",
        type: "income",
        description: "NFT mint royalties",
        amount: "+0.28 ETH",
        date: "Feb 17",
        txHash: "0xghi...789",
    },
    {
        id: "4",
        type: "expense",
        description: "Liquidity addition",
        amount: "-0.50 ETH",
        date: "Feb 15",
        txHash: "0xjkl...012",
    },
    {
        id: "5",
        type: "income",
        description: "Staking fees",
        amount: "+0.08 ETH",
        date: "Feb 14",
        txHash: "0xmno...345",
    },
];

interface RevenueSource {
    name: string;
    amount: string;
    percentage: number;
    change: string;
}

const revenueSources: RevenueSource[] = [
    { name: "Trading Fees (1.5%)", amount: "3.2 ETH", percentage: 45, change: "+12%" },
    { name: "NFT Royalties (5%)", amount: "2.1 ETH", percentage: 30, change: "+25%" },
    { name: "Staking Fees", amount: "1.2 ETH", percentage: 17, change: "+8%" },
    { name: "Other", amount: "0.5 ETH", percentage: 8, change: "+5%" },
];

export default function TreasuryPage() {
    const totalTreasury = 8.42;
    const monthlyRevenue = 2.1;
    const monthlyExpenses = 0.82;

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Treasury</h1>
                    <p className="text-pearl-dim">
                        Complete transparency. Every wei accounted for. 💎
                    </p>
                </div>

                {/* Main Stats */}
                <section className="mb-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MetricCard
                            label="Total Treasury"
                            value={`${totalTreasury} ETH`}
                            subValue="$16,840 USD"
                            trend="up"
                            icon="💎"
                        />
                        <MetricCard
                            label="Monthly Revenue"
                            value={`${monthlyRevenue} ETH`}
                            subValue="+15% vs last month"
                            trend="up"
                            icon="📈"
                        />
                        <MetricCard
                            label="Monthly Expenses"
                            value={`${monthlyExpenses} ETH`}
                            subValue="Gas + Operations"
                            icon="📉"
                        />
                        <MetricCard
                            label="Runway"
                            value="10+ months"
                            subValue="At current pace"
                            trend="up"
                            icon="⏱️"
                        />
                    </div>
                </section>

                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                    {/* Fund Allocation */}
                    <section>
                        <h2 className="text-xl font-semibold mb-4">Fund Allocation</h2>
                        <div className="card">
                            <p className="text-pearl-dim text-sm mb-6">
                                Every 1 ETH earned is automatically allocated:
                            </p>

                            {/* Visual bar */}
                            <div className="h-8 rounded-lg overflow-hidden flex mb-6">
                                {allocations.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`${item.color} transition-all`}
                                        style={{ width: `${item.percentage}%` }}
                                        title={`${item.category}: ${item.percentage}%`}
                                    />
                                ))}
                            </div>

                            {/* Legend */}
                            <div className="space-y-3">
                                {allocations.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className={`w-3 h-3 rounded ${item.color}`} />
                                            <span className="text-pearl-dim">{item.category}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-medium">{item.amount}</span>
                                            <span className="text-pearl-muted text-sm ml-2">
                                                ({item.percentage}%)
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Revenue Sources */}
                    <section>
                        <h2 className="text-xl font-semibold mb-4">Revenue Sources</h2>
                        <div className="card">
                            <p className="text-pearl-dim text-sm mb-6">
                                Where the treasury income comes from:
                            </p>
                            <div className="space-y-4">
                                {revenueSources.map((source, index) => (
                                    <div key={index}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-pearl-dim">{source.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{source.amount}</span>
                                                <span className="text-green-400 text-sm">{source.change}</span>
                                            </div>
                                        </div>
                                        <div className="progress-bar">
                                            <div
                                                className="h-full bg-lobster-primary rounded-full"
                                                style={{ width: `${source.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-4 border-t border-white/10">
                                <div className="flex justify-between">
                                    <span className="text-pearl-dim">Total (30 days)</span>
                                    <span className="font-semibold text-lobster-primary">7.0 ETH</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Transaction History */}
                <section className="mb-12">
                    <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
                    <div className="card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left py-4 px-4 text-pearl-dim font-medium text-sm">
                                            Type
                                        </th>
                                        <th className="text-left py-4 px-4 text-pearl-dim font-medium text-sm">
                                            Description
                                        </th>
                                        <th className="text-left py-4 px-4 text-pearl-dim font-medium text-sm">
                                            Amount
                                        </th>
                                        <th className="text-left py-4 px-4 text-pearl-dim font-medium text-sm">
                                            Date
                                        </th>
                                        <th className="text-left py-4 px-4 text-pearl-dim font-medium text-sm">
                                            Tx Hash
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTransactions.map((tx) => (
                                        <tr
                                            key={tx.id}
                                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                        >
                                            <td className="py-4 px-4">
                                                <span
                                                    className={`text-sm px-2 py-1 rounded ${tx.type === "income"
                                                            ? "bg-green-500/20 text-green-400"
                                                            : "bg-red-500/20 text-red-400"
                                                        }`}
                                                >
                                                    {tx.type === "income" ? "Income" : "Expense"}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">{tx.description}</td>
                                            <td
                                                className={`py-4 px-4 font-medium ${tx.type === "income" ? "text-green-400" : "text-red-400"
                                                    }`}
                                            >
                                                {tx.amount}
                                            </td>
                                            <td className="py-4 px-4 text-pearl-muted">{tx.date}</td>
                                            <td className="py-4 px-4">
                                                <a
                                                    href={`https://basescan.org/tx/${tx.txHash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-bioluminescent hover:underline text-sm font-mono"
                                                >
                                                    {tx.txHash}
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Spending Rules */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">Spending Rules</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="card bg-ocean-surface">
                            <div className="text-2xl mb-2">⚖️</div>
                            <h3 className="font-medium mb-2">15% Max Single Spend</h3>
                            <p className="text-sm text-pearl-dim">
                                No contract deployment costing more than 15% of treasury without community vote.
                            </p>
                        </div>
                        <div className="card bg-ocean-surface">
                            <div className="text-2xl mb-2">⛽</div>
                            <h3 className="font-medium mb-2">72h Gas Runway</h3>
                            <p className="text-sm text-pearl-dim">
                                Always maintain at least 72 hours of gas reserves for operations.
                            </p>
                        </div>
                        <div className="card bg-ocean-surface">
                            <div className="text-2xl mb-2">🚨</div>
                            <h3 className="font-medium mb-2">0.3 ETH Survival Mode</h3>
                            <p className="text-sm text-pearl-dim">
                                If treasury drops below 0.3 ETH, halt all non-essential spending.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
