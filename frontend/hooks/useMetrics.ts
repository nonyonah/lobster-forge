"use client";

import { useQuery } from "@tanstack/react-query";

export interface Metrics {
    treasuryEth: number;
    treasuryForge: number;
    forgePrice: number;
    forgeVolume24h: number;
    holderCount: number;
    totalSupply: number;
    circulatingSupply: number;
    stakingTvl: number;
    stakingApy: number;
    stakerCount: number;
    nftsMinted: number;
    nftsMaxSupply: number;
    gasRunwayHours: number;
    lastUpdated: string;
}

export function useMetrics() {
    return useQuery<Metrics>({
        queryKey: ["metrics"],
        queryFn: async () => {
            const res = await fetch("/metrics.json");
            if (!res.ok) throw new Error("Failed to fetch metrics");
            return res.json();
        },
        refetchInterval: 5000, // Refresh every 5 seconds
    });
}
