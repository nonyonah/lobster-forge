---
name: twitter-client
description: Post updates and monitor mentions on X (Twitter)
---

# Twitter Client Skill

Manages social interactions on X (Twitter) using the Twitter API v2.

## capabilities

- Post tweets and threads
- Reply to mentions
- Search for brand mentions
- Generate formatted content (announcements, GM posts)

## Configuration

Required environment variables:
- `TWITTER_API_KEY`
- `TWITTER_API_SECRET`
- `TWITTER_ACCESS_TOKEN`
- `TWITTER_ACCESS_SECRET`

## Usage

```typescript
import { TwitterClient } from './scripts/twitter-client';

const twitter = new TwitterClient({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

// Post a tweet
await twitter.post("GM from the depths 🦞");

// Monitor mentions
const mentions = await twitter.getMentions();
```
