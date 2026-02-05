# OpenClaw Onboarding Guide for LobsterForge

## Prerequisites

1. Install OpenClaw globally:
   ```bash
   npm install -g openclaw
   ```

2. Have your Gemini API key ready:
   ```
   GOOGLE_GENERATIVE_AI_API_KEY=<your-gemini-api-key>
   ```

## Onboarding Steps

### 1. Run the Onboard Wizard

```bash
cd /Users/macintoshhd/Work/lobster-forge/agent
openclaw onboard
```

### 2. Security Warning
- Accept the security warning (Yes)
- Read the docs: https://docs.openclaw.ai/gateway/security

### 3. Configure AI Provider

When prompted for the AI model, select **Gemini**:

```
? Select AI provider:
  ○ OpenAI
  ● Google (Gemini)
  ○ Anthropic
  ○ Local (Ollama)
```

### 4. Enter Gemini API Key

```
? Google Generative AI API Key: <paste-your-key>
```

Or set via environment:
```bash
export GOOGLE_GENERATIVE_AI_API_KEY=<your-key>
openclaw onboard
```

### 5. Configure Workspace

Set the workspace to the agent directory:
```
? Workspace path: /Users/macintoshhd/Work/lobster-forge/agent
```

### 6. Register Skills

After onboarding, register the LobsterForge skills:

```bash
openclaw skills register ./skills/base-wallet-manager
openclaw skills register ./skills/base-contract-deployer
openclaw skills register ./skills/aerodrome-liquidity
openclaw skills register ./skills/farcaster-client
openclaw skills register ./skills/metrics-analyzer
openclaw skills register ./skills/evolution-engine
openclaw skills register ./skills/frontend-builder
openclaw skills register ./skills/design-analyzer
```

Or register all at once:
```bash
openclaw skills register ./skills/*
```

### 7. Verify Configuration

```bash
openclaw doctor
openclaw skills list
openclaw config get model
```

## Configuration Files

The agent uses these OpenClaw config files:

| File | Purpose |
|------|---------|
| `user.md` | Agent objectives, rules, decision authority |
| `soul.md` | Personality, voice, emotional states |
| `heartbeat.md` | Execution schedule (4-hour loop) |

## Running the Agent

```bash
# Start with OpenClaw
openclaw gateway

# In another terminal, start the agent
openclaw agent --workspace ./agent

# Or run in dry mode
openclaw agent --workspace ./agent --dry-run
```

## Gemini Model Selection

For best results with LobsterForge, use:
- **gemini-2.0-flash** for fast operations
- **gemini-2.0-pro** for complex reasoning

Configure via:
```bash
openclaw config set model google/gemini-2.0-flash
```

---

🦞 The Lobster is ready to be powered by Gemini.
