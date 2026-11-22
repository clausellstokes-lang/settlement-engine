# AI Spend Alarm Runbook

The daily early-warning for AI provider spend (R-28). `scripts/ai-spend-alarm.mjs`
reads the day's spend snapshot (the exact shape `check_ai_spend_cap()` returns —
migration `079_ai_spend_safety.sql`), evaluates it against the warning/critical
bands in `src/domain/ops/aiSpendAlarm.js`, prints the verdict, and — only when a
webhook destination is configured AND a band is crossed — POSTs a plain-language
ops notice. It applies nothing and blocks nothing: the migration-079 hard cap
remains the only mechanism that can stop a spend. This alarm is the warning that
fires while there is still headroom to act.

> Steps marked `[OWNER]` need production credentials / the scheduled-routine
> machinery that are not (and must not be) in the repo. Until both are done the
> alarm is deliberately **WRITTEN-NOT-ENABLED**: present, testable, inert.

---

## 1. Current posture (pre-activation)

- **Key-inert** (the Turnstile pattern): with `AI_SPEND_ALARM_WEBHOOK` unset the
  script computes and prints the verdict but sends nothing.
- **Unscheduled** (the `tuning-weekly.mjs` precedent): nothing runs it daily until
  the owner creates the routine below.
- Deletion of the script itself is noticed by `tests/docs/opsScriptsExist.test.js`;
  the band evaluator is covered by `tests/domain/aiSpendAlarm.test.js`.

## 2. Activation — the two `[OWNER]` steps

1. `[OWNER]` **Set the destination.** Export `AI_SPEND_ALARM_WEBHOOK` in the
   environment the routine runs in (a Slack/Discord/ops incoming-webhook URL).
   Setting the key is the whole activation switch; unsetting it re-inerts the
   alarm without touching code.
2. `[OWNER]` **Create the daily routine** (the existing scheduled-agent machinery —
   one command to create). Each run must:
   1. call `check_ai_spend_cap()` through the admin client and write the returned
      JSON (`{ daily_spend, daily_cap, monthly_spend, monthly_cap, enabled }`) to a
      temp file, then
   2. run `node scripts/ai-spend-alarm.mjs --snapshot <that file>`.

   The script is dependency-free and never touches the DB itself — the routine
   owns snapshot acquisition, mirroring `check-migration-head.mjs`.

Optional: `AI_SPEND_ALARM_THRESHOLDS` — a JSON `{ "warning": 0.x, "critical": 0.y }`
fraction override of the proposed defaults in `src/domain/ops/aiSpendAlarm.js`.

## 3. Verifying a run

Dry-run with a fixture snapshot (no webhook set — prints, sends nothing):

```sh
echo '{"daily_spend":9,"daily_cap":10,"monthly_spend":40,"monthly_cap":100,"enabled":true}' > /tmp/spend.json
node scripts/ai-spend-alarm.mjs --snapshot /tmp/spend.json
```

Expect a JSON verdict with `level` at or above `warning` and
`outcome.reason: "unconfigured"`. With the webhook set, the same input POSTs the
notice and reports `dispatched: true`. A transport failure is swallowed and
reported (`dispatch_error`) — an alarm outage must never crash the job.

## 4. What this alarm is not

- **Not enforcement.** The migration-079 hard cap fails closed on its own; the
  alarm only buys reaction time before generations start returning
  `503 daily capacity reached`.
- **Not a dashboard.** Counts live on the admin surface; this is the push channel.
