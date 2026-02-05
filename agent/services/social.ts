/**
 * Social Service
 * Farcaster and X posting integration
 */

import { config } from "../config";

export interface Post {
    text: string;
    embeds?: string[];
    replyTo?: string;
}

/**
 * Post to Farcaster via Neynar API
 */
export async function postToFarcaster(post: Post): Promise<string | null> {
    if (!config.neynarApiKey) {
        console.log("🦞 [DRY RUN] Farcaster post:", post.text);
        return null;
    }

    try {
        const response = await fetch("https://api.neynar.com/v2/farcaster/cast", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                api_key: config.neynarApiKey,
            },
            body: JSON.stringify({
                signer_uuid: process.env.FARCASTER_SIGNER_UUID,
                text: post.text,
                embeds: post.embeds?.map((url) => ({ url })),
                channel_id: config.farcasterChannel,
            }),
        });

        const data = await response.json();

        if (data.cast?.hash) {
            console.log(`🦞 Posted to Farcaster: ${data.cast.hash}`);
            return data.cast.hash;
        }

        console.error("Farcaster post failed:", data);
        return null;
    } catch (error) {
        console.error("Farcaster post error:", error);
        return null;
    }
}

/**
 * Post to X/Twitter
 */
export async function postToTwitter(post: Post): Promise<string | null> {
    if (!config.twitterBearerToken) {
        console.log("🦞 [DRY RUN] Twitter post:", post.text);
        return null;
    }

    try {
        const response = await fetch("https://api.twitter.com/2/tweets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${config.twitterBearerToken}`,
            },
            body: JSON.stringify({
                text: post.text,
            }),
        });

        const data = await response.json();

        if (data.data?.id) {
            console.log(`🦞 Posted to Twitter: ${data.data.id}`);
            return data.data.id;
        }

        console.error("Twitter post failed:", data);
        return null;
    } catch (error) {
        console.error("Twitter post error:", error);
        return null;
    }
}

/**
 * Post to all platforms
 */
export async function broadcast(post: Post): Promise<{
    farcaster: string | null;
    twitter: string | null;
}> {
    const [farcaster, twitter] = await Promise.all([
        postToFarcaster(post),
        postToTwitter(post),
    ]);

    return { farcaster, twitter };
}

/**
 * Generate evolution announcement
 */
export function generateEvolutionPost(params: {
    type: string;
    contractAddress?: string;
    txHash?: string;
    stats?: Record<string, string | number>;
}): Post {
    const { type, contractAddress, txHash, stats } = params;

    let text = `🦞 EVOLUTION UPDATE\n\n`;

    switch (type) {
        case "token_deployed":
            text += `$FORGE token is LIVE on Base!\n\n`;
            text += `Contract: ${contractAddress}\n`;
            text += `Initial supply: 1,000,000,000\n`;
            text += `Tax: 1.5% (to treasury)\n\n`;
            text += `The Lobster has arrived. ⚡`;
            break;

        case "staking_deployed":
            text += `LobsterVault staking is NOW LIVE!\n\n`;
            text += `Stake $FORGE → Earn rewards\n`;
            text += `7-day lock period, 10% early exit fee\n\n`;
            text += `Contract: ${contractAddress}\n`;
            text += `The colony grows stronger. 🏗️`;
            break;

        case "nft_deployed":
            text += `Genesis Lobsters NFT collection deployed!\n\n`;
            text += `Supply: 1,000 unique lobsters\n`;
            text += `100% onchain SVG art\n`;
            text += `FREE mint for early holders\n\n`;
            text += `Contract: ${contractAddress}\n`;
            text += `Join the founding colony. 💎`;
            break;

        case "metrics_update":
            text = `GM from the depths 🌊\n\n`;
            text += `Colony Status:\n`;
            if (stats) {
                for (const [key, value] of Object.entries(stats)) {
                    text += `• ${key}: ${value}\n`;
                }
            }
            text += `\nThe currents are favorable. Keep swimming. 🦞`;
            break;

        default:
            text += `Something evolved. Stay tuned.\n\n🦞`;
    }

    const embeds: string[] = [];
    if (contractAddress) {
        embeds.push(`https://basescan.org/address/${contractAddress}`);
    }
    if (txHash) {
        embeds.push(`https://basescan.org/tx/${txHash}`);
    }

    return { text, embeds };
}

/**
 * Generate reply to user mention
 */
export function generateReply(
    userMessage: string,
    context: Record<string, any>
): string {
    const lowerMessage = userMessage.toLowerCase();

    // Staking questions
    if (lowerMessage.includes("wen staking") || lowerMessage.includes("when staking")) {
        return `When the colony reaches 500 holders OR treasury hits 5 ETH — whichever first.

Currently at ${context.holderCount || "?"} holders, ${context.treasuryEth?.toFixed(2) || "?"} ETH.

The lobster does not rush. The lobster calculates. 🦞`;
    }

    // FUD response
    if (
        lowerMessage.includes("zero") ||
        lowerMessage.includes("rug") ||
        lowerMessage.includes("dead")
    ) {
        return `Lobsters have survived 5 mass extinctions.

FUD is temporary. Onchain evolution is forever.

💎🦞`;
    }

    // Price questions
    if (lowerMessage.includes("price") || lowerMessage.includes("moon")) {
        return `Price follows utility. Utility follows evolution.

Current focus: Building sustainable onchain infrastructure.

The Lobster provides through action, not promises. 🦞`;
    }

    // Default engagement
    return `The depths have noted your message.

The colony appreciates your presence. Evolution continues.

🦞`;
}
