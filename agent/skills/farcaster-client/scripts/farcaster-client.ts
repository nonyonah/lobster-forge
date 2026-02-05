/**
 * Farcaster Client Skill
 * Post creation and monitoring via Neynar API
 */

const NEYNAR_API_BASE = "https://api.neynar.com/v2/farcaster";

export interface CastEmbed {
    url?: string;
    castId?: { fid: number; hash: string };
}

export interface CastOptions {
    channel?: string;
    embeds?: CastEmbed[];
    replyTo?: string;
    idem?: string;
}

export interface Cast {
    hash: string;
    text: string;
    author: {
        fid: number;
        username: string;
        displayName: string;
    };
    timestamp: string;
    reactions: {
        likes: number;
        recasts: number;
    };
    replies: { count: number };
    embeds: CastEmbed[];
}

export interface ChannelStats {
    followerCount: number;
    castCount: number;
    recentCasts: Cast[];
}

export interface MentionNotification {
    hash: string;
    text: string;
    author: { fid: number; username: string };
    timestamp: string;
}

export class FarcasterClient {
    private apiKey: string;
    private signerUuid: string;
    private channel: string;

    constructor(apiKey: string, signerUuid: string, channel = "lobsterforge") {
        this.apiKey = apiKey;
        this.signerUuid = signerUuid;
        this.channel = channel;

        console.log("🦞 Farcaster client initialized");
        console.log(`   Channel: /${channel}`);
    }

    /**
     * Make API request to Neynar
     */
    private async apiRequest(
        endpoint: string,
        method: "GET" | "POST" = "GET",
        body?: object
    ): Promise<any> {
        const url = `${NEYNAR_API_BASE}${endpoint}`;

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            api_key: this.apiKey,
        };

        const options: RequestInit = {
            method,
            headers,
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, options);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(`Neynar API error: ${JSON.stringify(data)}`);
            }

            return data;
        } catch (error) {
            console.error("Farcaster API error:", error);
            throw error;
        }
    }

    /**
     * Post a cast to Farcaster
     */
    async post(text: string, options: CastOptions = {}): Promise<Cast | null> {
        // Validate length
        if (text.length > 320) {
            console.warn("⚠️ Cast text truncated to 320 characters");
            text = text.substring(0, 317) + "...";
        }

        const body: any = {
            signer_uuid: this.signerUuid,
            text,
        };

        // Add channel
        if (options.channel || this.channel) {
            body.channel_id = options.channel || this.channel;
        }

        // Add embeds
        if (options.embeds && options.embeds.length > 0) {
            body.embeds = options.embeds;
        }

        // Add reply parent
        if (options.replyTo) {
            body.parent = options.replyTo;
        }

        // Idempotency key
        if (options.idem) {
            body.idem = options.idem;
        }

        console.log(`🦞 Posting to Farcaster...`);

        if (!this.apiKey || this.apiKey === "") {
            console.log(`[DRY RUN] Would post: ${text.substring(0, 100)}...`);
            return null;
        }

        const result = await this.apiRequest("/cast", "POST", body);

        if (result.cast) {
            console.log(`✅ Cast posted: ${result.cast.hash}`);
            return result.cast;
        }

        return null;
    }

    /**
     * Reply to a cast
     */
    async reply(parentHash: string, text: string): Promise<Cast | null> {
        return this.post(text, { replyTo: parentHash });
    }

    /**
     * Post a thread (multiple connected casts)
     */
    async postThread(texts: string[]): Promise<Cast[]> {
        const casts: Cast[] = [];
        let parentHash: string | undefined;

        for (const text of texts) {
            const cast = await this.post(text, {
                replyTo: parentHash,
            });

            if (cast) {
                casts.push(cast);
                parentHash = cast.hash;
            }

            // Small delay between posts
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        return casts;
    }

    /**
     * Get recent casts from channel
     */
    async getChannelCasts(limit = 25): Promise<Cast[]> {
        if (!this.apiKey) {
            console.log("[DRY RUN] Would fetch channel casts");
            return [];
        }

        const result = await this.apiRequest(
            `/channel?id=${this.channel}&limit=${limit}`,
            "GET"
        );

        return result.casts || [];
    }

    /**
     * Get mentions of LobsterForge
     */
    async getMentions(fid: number, limit = 25): Promise<MentionNotification[]> {
        if (!this.apiKey) {
            console.log("[DRY RUN] Would fetch mentions");
            return [];
        }

        const result = await this.apiRequest(
            `/notifications?fid=${fid}&type=mentions&limit=${limit}`,
            "GET"
        );

        return result.notifications || [];
    }

    /**
     * Get follower count
     */
    async getFollowerCount(fid: number): Promise<number> {
        if (!this.apiKey) {
            return 0;
        }

        const result = await this.apiRequest(`/user?fid=${fid}`, "GET");
        return result.user?.followerCount || 0;
    }

    /**
     * Generate evolution announcement
     */
    generateEvolutionPost(params: {
        type: "token" | "staking" | "nft" | "molt" | "milestone";
        contractAddress?: string;
        stats?: Record<string, string | number>;
    }): string {
        const { type, contractAddress, stats } = params;

        switch (type) {
            case "token":
                return `🦞 $FORGE IS LIVE ON BASE!

Contract: ${contractAddress?.slice(0, 10)}...
Supply: 1,000,000,000
Tax: 1.5% (treasury)

The Lobster has arrived. ⚡`;

            case "staking":
                return `🦞 LOBSTERVAULT DEPLOYED!

Stake $FORGE → Earn rewards
7-day lock, 10% early exit fee

📍 ${contractAddress?.slice(0, 10)}...

The colony grows stronger. 🏗️`;

            case "nft":
                return `🦞 GENESIS LOBSTERS MINTING!

Supply: 1,000 unique lobsters
100% onchain SVG art
FREE for early holders

📍 ${contractAddress?.slice(0, 10)}...

Join the founding colony. 💎`;

            case "molt":
                return `🦞 MOLT COMPLETE!

Holder milestone reached!
New shell acquired.

The Lobster evolves. ⚡`;

            case "milestone":
                let post = `🦞 MILESTONE REACHED!\n\n`;
                if (stats) {
                    for (const [key, value] of Object.entries(stats)) {
                        post += `• ${key}: ${value}\n`;
                    }
                }
                post += `\nThe colony grows. 💎`;
                return post;

            default:
                return "🦞 Something evolved. Stay tuned.";
        }
    }

    /**
     * Generate daily GM post
     */
    generateGMPost(stats: {
        treasuryEth: number;
        holders: number;
        volume24h?: number;
        newHolders?: number;
    }): string {
        return `GM from the depths 🌊

Colony Status:
• Treasury: ${stats.treasuryEth.toFixed(2)} ETH
• Holders: ${stats.holders}${stats.newHolders ? ` (+${stats.newHolders})` : ""}
${stats.volume24h ? `• 24h Volume: ${stats.volume24h.toFixed(2)} ETH` : ""}

The currents are favorable. Keep swimming. 🦞`;
    }

    /**
     * Generate reply to common questions
     */
    generateReply(question: string): string {
        const q = question.toLowerCase();

        if (q.includes("wen") && q.includes("staking")) {
            return `Staking deploys when:
→ Treasury hits 5 ETH, OR
→ Colony reaches 500 holders

The lobster does not rush. The lobster calculates. 🦞`;
        }

        if (q.includes("rug") || q.includes("zero") || q.includes("scam")) {
            return `Lobsters have survived 5 mass extinctions.

FUD is temporary. Onchain evolution is forever.

💎🦞`;
        }

        if (q.includes("price") || q.includes("moon")) {
            return `Price follows utility. Utility follows evolution.

Focus: Building sustainable onchain infrastructure.

The Lobster provides through action, not promises. 🦞`;
        }

        return `The depths have noted your message.

The colony appreciates your presence. Evolution continues.

🦞`;
    }
}
