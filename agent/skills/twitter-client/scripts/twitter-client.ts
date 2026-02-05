/**
 * Twitter Client Skill
 * Post creation and monitoring via Twitter API v2
 * Uses 'twitter-api-v2' library pattern (simulated if no lib)
 */

import crypto from 'crypto';

export interface TwitterConfig {
    appKey: string;
    appSecret: string;
    accessToken: string;
    accessSecret: string;
}

export interface Tweet {
    id: string;
    text: string;
    created_at?: string;
    author_id?: string;
}

export class TwitterClient {
    private config: TwitterConfig;
    private baseUrl = "https://api.twitter.com/2";

    constructor(config: TwitterConfig) {
        this.config = config;
        console.log("🦞 Twitter client initialized");
    }

    /**
     * Helper to generate OAuth 1.0a header
     */
    private getAuthHeader(method: string, url: string, params: Record<string, string> = {}): string {
        const oauth = {
            oauth_consumer_key: this.config.appKey,
            oauth_nonce: crypto.randomBytes(16).toString('hex'),
            oauth_signature_method: 'HMAC-SHA1',
            oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
            oauth_token: this.config.accessToken,
            oauth_version: '1.0',
            ...params
        };

        // Sort and join params for signature base string
        const paramString = Object.keys(oauth).sort().map(k => {
            return `${encodeURIComponent(k)}=${encodeURIComponent(oauth[k as keyof typeof oauth])}`;
        }).join('&');

        const signatureBase = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(paramString)}`;
        const signingKey = `${encodeURIComponent(this.config.appSecret)}&${encodeURIComponent(this.config.accessSecret)}`;
        const signature = crypto.createHmac('sha1', signingKey).update(signatureBase).digest('base64');

        // Return header string
        return 'OAuth ' + Object.keys(oauth).sort().map(k => {
            const val = k === 'oauth_signature' ? signature : oauth[k as keyof typeof oauth];
            return `${encodeURIComponent(k)}="${encodeURIComponent(val as string)}"`;
        }).join(', ') + `, oauth_signature="${encodeURIComponent(signature)}"`;
    }

    /**
     * Post a tweet
     */
    async post(text: string, replyToId?: string): Promise<Tweet | null> {
        const url = `${this.baseUrl}/tweets`;

        if (!this.config.appKey) {
            console.log(`🦞 [DRY RUN] Would tweet: "${text}"${replyToId ? ` (reply to ${replyToId})` : ''}`);
            return { id: "dry_run_id", text };
        }

        try {
            const body: any = { text };
            if (replyToId) {
                body.reply = { in_reply_to_tweet_id: replyToId };
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': this.getAuthHeader('POST', url),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const data = await response.json() as any;

            if (data.data?.id) {
                console.log(`✅ Tweet posted: ${data.data.id}`);
                return data.data;
            }

            console.error("Twitter post failed:", data);
            return null;
        } catch (error) {
            console.error("Twitter post error:", error);
            return null;
        }
    }

    /**
     * Post a thread
     */
    async postThread(tweets: string[]): Promise<Tweet[]> {
        const posted: Tweet[] = [];
        let lastId: string | undefined;

        for (const text of tweets) {
            const tweet = await this.post(text, lastId);
            if (tweet) {
                posted.push(tweet);
                lastId = tweet.id;
            }
            // Delay to avoid rate limits/ordering issues
            await new Promise(r => setTimeout(r, 1000));
        }

        return posted;
    }

    /**
     * Search for mentions (requires Basic/Pro API usually)
     * Fallback to simpler search logging if denied
     */
    async getMentions(userId: string): Promise<Tweet[]> {
        const url = `${this.baseUrl}/users/${userId}/mentions`;

        if (!this.config.appKey) {
            return [];
        }

        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': this.getAuthHeader('GET', url),
                }
            });

            const data = await response.json() as any;
            return data.data || [];
        } catch (error) {
            // console.error("Error fetching mentions:", error); // Suppress log if just polling
            return [];
        }
    }

    /**
     * Generate content methods (reused from farcaster-client but adapted)
     */

    generateEvolutionPost(params: {
        type: "token" | "staking" | "nft" | "molt" | "milestone";
        contractAddress?: string;
        stats?: Record<string, string | number>;
    }): string {
        const { type, contractAddress, stats } = params;

        switch (type) {
            case "token":
                return `🦞 $FORGE IS LIVE ON BASE!\n\nContract: ${contractAddress?.slice(0, 8)}...\nSupply: 1B\nTax: 1.5% (treasury)\n\nThe Lobster has arrived. ⚡ #Base`;

            case "staking":
                return `🦞 LOBSTERVAULT DEPLOYED!\n\nStake $FORGE → Earn rewards\n7-day lock, 10% early exit fee\n\n📍 ${contractAddress?.slice(0, 8)}...\n\nThe colony grows stronger. 🏗️ #DeFi`;

            case "nft":
                return `🦞 GENESIS LOBSTERS MINTING!\n\nSupply: 1k unique lobsters\n100% onchain SVG art\nFREE for early holders\n\n📍 ${contractAddress?.slice(0, 8)}...\n\nJoin the founding colony. 💎 #NFT`;

            case "molt":
                return `🦞 MOLT COMPLETE!\n\nHolder milestone reached!\nNew shell acquired.\n\nThe Lobster evolves. ⚡`;

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

    generateGMPost(stats: {
        treasuryEth: number;
        holders: number;
        volume24h?: number;
    }): string {
        return `GM from the depths 🌊\n\nColony Status:\n• Treasury: ${stats.treasuryEth.toFixed(2)} ETH\n• Holders: ${stats.holders}\n\nThe currents are favorable. Keep swimming. 🦞 #Base`;
    }
}
