interface MetricCardProps {
    label: string;
    value: string | number;
    subValue?: string;
    trend?: "up" | "down" | "neutral";
    icon?: React.ReactNode;
}

export default function MetricCard({
    label,
    value,
    subValue,
    trend,
    icon,
}: MetricCardProps) {
    const trendColors = {
        up: "text-green-400",
        down: "text-red-400",
        neutral: "text-pearl-muted",
    };

    const trendIcons = {
        up: "↑",
        down: "↓",
        neutral: "→",
    };

    return (
        <div className="card card-hover">
            <div className="flex items-start justify-between mb-3">
                <span className="metric-label">{label}</span>
                {icon && <span className="text-lobster-primary text-xl">{icon}</span>}
            </div>
            <div className="metric-value">{value}</div>
            {(subValue || trend) && (
                <div className="mt-2 flex items-center gap-2">
                    {trend && (
                        <span className={`text-sm font-medium ${trendColors[trend]}`}>
                            {trendIcons[trend]}
                        </span>
                    )}
                    {subValue && (
                        <span className="text-sm text-pearl-dim">{subValue}</span>
                    )}
                </div>
            )}
        </div>
    );
}
