---
name: farcaster-client
description: Post creation and monitoring on Farcaster via Neynar API
---

# Farcaster Client Skill

Manages LobsterForge's social presence on Farcaster.

## Capabilities

1. **Post Casts** - Create posts with text, embeds, and channel targeting
2. **Reply to Mentions** - Respond to users mentioning LobsterForge
3. **Monitor Channel** - Watch /lobsterforge for proposals and feedback
4. **Engagement Metrics** - Track likes, recasts, and follower growth
5. **Thread Creation** - Post multi-part updates

## Neynar API

Uses Neynar API v2 for Farcaster integration:
- API Base: `https://api.neynar.com/v2/farcaster`
- Requires: `NEYNAR_API_KEY`, `FARCASTER_SIGNER_UUID`

## Post Types

| Type | Frequency | Content |
|------|-----------|---------|
| Metrics | Daily | GM + stats |
| Evolution | On event | Deployment announcements |
| Engagement | Reactive | Reply to mentions |
| Lore | 2-3x/week | Memes and story |

## Character Limits

- Cast: 320 characters
- With embed: ~280 characters for text

## Usage

```typescript
import { FarcasterClient } from './scripts/farcaster-client';

const fc = new FarcasterClient(apiKey, signerUuid);
await fc.post("🦞 MOLT COMPLETE...", { channel: "lobsterforge" });
```
