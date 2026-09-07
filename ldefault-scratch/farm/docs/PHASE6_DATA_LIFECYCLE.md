# Phase 6 — The Data Layer, Built Complete with Lifecycle Activation

Owner directive (2026-07-10): the product is pre-launch, so the data layer must
not be designed for a user base that doesn't exist yet. Build it ONCE, to
completion, with every capability assigned an explicit activation stage —
**pre-launch / at-launch / post-launch** — and doing real work in each stage.
Nothing may exist that is inert until launch; launch day changes CONFIG, not code.

This supersedes the original Phase 6 scope (funnel analytics + tuning loop +
worldbuilder dataset) — same three ambitions, re-architected around lifecycle.

---

## 1. The structural spine: corpus provenance

Every analytics event, telemetry row, and rollup carries a **provenance stamp**:

| Corpus | What it is | Consent | Enters research dataset? |
|---|---|---|---|
| `synthetic` | Deterministic config-space sweeps + e2e runs | n/a | Never (but publishable AS synthetic) |
| `dogfood` | The owner's / elevated users' own usage | implicit | Never |
| `production` | Real users after launch | consent v2 (silent opt-out) | Yes, k-anonymized |

This single dimension is what lets ONE pipeline — same event schemas, same
tables, same rollups, same dashboards — serve all three stages. Pre-launch data
flows through the identical plumbing production data will use; launch is a
filter change. The existing `isObviousBot` stamping folds in as a provenance
qualifier on `production`. Two-corpus separation from the original design
generalizes to this table.

**Pull-forward:** the provenance stamp lands during the merge program's
instrumentation-touching waves (4/5), not in Phase 6 proper — so no event
schema churns after surfaces are adopted. <!-- @enforced-by the provenance pin, §5 -->

## 2. The stage matrix

| Capability | Pre-launch (active NOW) | At launch | Post-launch |
|---|---|---|---|
| **Event spine** (generationTelemetry, funnel events, milestone fingerprints, pricing moments, tabs/dwell/saves) | Exercised end-to-end by synthetic sweeps, e2e, dogfood; contract-tested so day-one data is trustworthy | Consent-gated `production` collection flips ON | Unchanged |
| **Synthetic corpus generator** | THE tuning data source: seeded config-space sweeps emit the full event stream as a `synthetic` cohort; unifies with the Wave-D eval corpus (the eval fixtures ARE pre-launch analytics) | Frozen as the launch regression baseline | The counterfactual twin: predicted-vs-actual divergence is itself the signal |
| **Funnel + dashboards** (landing→forge→save→signup→realm→pay; AdminTrends) | Render against synthetic/dogfood — proves every denominator, query, and view before a real user exists | Live on day one, min-n guards showing "insufficient n" for tiny cohorts | Cohort analysis, retention curves |
| **Tuning loop** | Tune generation against synthetic distributions (hook variety, famine, monoculture, faith spread once Phase 4 lands) — real tuning work, now | Watch real-vs-synthetic divergence | Closed loop: real behavior + support-ticket topics (mig 055) joined to generation_id cohorts |
| **COGS / pricing lane** (ai_usage_events 078, price book 114/115) | Calibrate credit costs on synthetic narrate runs; verify binding quotes against actual token usage BEFORE anyone pays | Margins watch board armed | Nightly usage-calibrated resync (already built — their cron) |
| **Launch health** (client_error_events 081, edge error rates, refund rates) | Alert thresholds tested against injected errors | The launch-day watch board | SLO drift tracking |
| **Worldbuilder dataset** | Schema + k-anonymized export pipeline built and PROVEN on the synthetic corpus (a synthetic sample is itself publishable/demoable) | Accumulation begins — consented `production` corpus only, structure-only (never names/prose/secrets, per the Privacy & data copy) | Versioned snapshots ship when per-cell n ≥ registry floors |
| **Statistical guards** | Per-metric min-n floors + methods added to METRICS_REGISTRY.md; enforced by pin | Same guards protect the small launch cohorts from misleading reads | Same guards gate dataset snapshot releases |
| **Retention pull** (owner gap item, 2026-07-10) | "Your realm this week" digest engine built + tested against synthetic chronicles (pg_cron rollup → send-email template, honoring the account email-prefs/unsubscribe that land in merge wave 4); in-app "while you were away" panel ships live immediately | Digest cron arms for consented `production` users | The living world writes to lapsed DMs — the sim as its own re-engagement engine |

## 3. The switchboard

One documented config surface (env + flags), no scattered toggles:

- `ANALYTICS_STAGE` ∈ { `pre`, `launch`, `post` } — read by collectors, crons,
  and alerting; NOT by dashboards (they always render, filtered by corpus).
- Launch day = set stage to `launch`, which: enables `production` collection
  (still consent-gated per user), arms rollup crons and alert thresholds,
  freezes the synthetic baseline snapshot. Zero code deploy.
- `post` is entered deliberately once cohorts clear registry floors — it
  unlocks dataset accumulation cadence and experiment capability, nothing else.

## 4. What the merge already provides (this phase is assembly, not greenfield)

From the adopted chain and platform: ai_usage_events COGS metering (078), spend
caps + reservation (079/086), analytics rollups with fixed RLS (062/100),
paid-conversion trends split (117), AI price book + resync cron (114/115),
client_error_events sink (081), support tickets (055), hardened ingest-events
(anti-amplification), admin trend panels. From our line: the E1 instrumentation
spine (generation_id, milestone fingerprints, event-keyed narrative snapshots),
consent v2 silent opt-out, analytics-props-hygiene + funnel-event-contract lint,
METRICS_REGISTRY.md, and the Wave-D distribution-envelope corpus.

Phase 6 proper therefore reduces to: the provenance dimension, the synthetic
corpus generator, the registry extension (stage + floor + method per metric),
the switchboard, the dataset export pipeline, dashboard assembly, and the
quote-binding + continuity-tiers lane (deliberately deferred to land with the
credit-menu changes, unchanged from the earlier decision).

## 5. Enforcement pins (born at A+, authored with the feature)

- **Provenance pin**: every emitted event carries a valid corpus stamp — lint
  rule beside analytics-props-hygiene + a runtime schema check in ingest.
- **Registry completeness pin**: every event name in the codebase has a
  METRICS_REGISTRY row declaring question, denominator, activation stage, and
  min-n floor; the existing 116-event coverage pin extends to the new columns.
- **Min-n guard pin**: every dashboard/view query path proves it renders
  "insufficient n" below floor (tested with synthetic micro-cohorts).
- **Consent-per-corpus pin**: `production` research events require consent;
  `synthetic`/`dogfood` are structurally excluded from the research dataset —
  pglite tests execute the actual RLS/rollup SQL to prove both directions.
- **Config-only launch pin**: a test asserts collectors/crons read stage from
  the switchboard, and greps that no code path branches on a hardcoded stage.

## 6. Sequencing

Phase 6 implementation stays after Phase 4 (faith) and Phase 5 (content) so the
data layer instruments them rather than chasing them — with two pull-forwards
into the merge program: (a) the provenance stamp rides the instrumentation
surfaces as they're adopted in waves 4/5; (b) the registry stage/floor columns
land with wave 5's gate fusion so the pins exist before any new collector does.
At Phase 6's close, the pre-launch lane is not scaffolding to discard — it is
the permanent regression-and-counterfactual harness the post-launch loop reads
against forever.
