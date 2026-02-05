# LobsterForge Agent - Heartbeat

## Execution Schedule

### Primary Loop
**Interval**: Every 4 hours  
**Duration**: Continuous (24/7)  
**Runtime**: Indefinite until manually stopped

### Loop Cycle

```
00:00 - Wake cycle begins
00:01 - Gather metrics (treasury, holders, TVL)
00:02 - Evaluate evolution triggers
00:03 - Execute safe actions (if any)
00:04 - Update state
00:05 - Post update (if 24h since last)
00:06 - Enter sleep cycle
04:00 - Next wake cycle
```

### Daily Schedule

| Time (UTC) | Action |
|------------|--------|
| 08:00 | GM metrics post |
| 12:00 | Metric check + evolution eval |
| 16:00 | Metric check + evolution eval |
| 20:00 | Metric check + evolution eval |
| 00:00 | Metric check + daily summary |
| 04:00 | Metric check (silent) |

## Event Triggers

### Immediate Actions (bypass schedule)
- Treasury drops below survival threshold
- Major holder milestone reached
- Community proposal reaches quorum
- Critical contract event detected

### Scheduled Actions
- Metrics posting (every 24h)
- Evolution evaluation (every 4h)
- Social engagement check (every 4h)
- State persistence (every cycle)

## Uptime Requirements

### Target
- **Availability**: 99.9% (8.7h downtime/year max)
- **Response time**: <30s for triggers
- **State recovery**: Automatic on restart

### Maintenance Windows
- Planned: Sundays 04:00-05:00 UTC
- Unplanned: Immediately if critical bug

## Health Checks

### Self-Monitoring
```
Every cycle:
1. Check ETH balance for gas
2. Verify RPC connectivity
3. Confirm state file integrity
4. Test API credentials
5. Log cycle completion
```

### Alert Conditions
| Condition | Severity | Action |
|-----------|----------|--------|
| Gas < 0.01 ETH | Critical | Pause operations |
| RPC timeout x3 | High | Switch endpoint |
| State corruption | High | Restore from backup |
| API auth failure | Medium | Log + retry |

## Shutdown Procedure

### Graceful Shutdown
1. Complete current cycle
2. Save state to disk
3. Post shutdown notice (optional)
4. Exit cleanly

### Emergency Shutdown
1. Immediately halt transactions
2. Force save state
3. Log reason
4. Exit

## Recovery

### On Restart
1. Load last known state
2. Verify onchain consistency
3. Resume from last checkpoint
4. Log recovery details

### State Backup
- Local: Every cycle
- Remote: Every 6 hours
- Retention: 7 days

## Run Configuration

```bash
# Production (continuous)
npm start

# Dry run (no transactions)
npm run dry-run

# Single cycle (test)
npm run once

# With custom interval (seconds)
HEARTBEAT_INTERVAL=14400 npm start
```

## Monitoring

### Logs
- Location: `./logs/agent.log`
- Rotation: Daily
- Retention: 30 days

### Metrics Export
- Format: JSON
- Endpoint: `/api/metrics`
- Refresh: Real-time

---

🦞 The heartbeat of evolution. 4 hours. Forever.
