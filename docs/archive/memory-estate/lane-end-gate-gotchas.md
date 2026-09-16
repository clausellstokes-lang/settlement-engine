---
name: lane-end-gate-gotchas
description: "⚠️ Lane-end/full-suite gotchas (2026-07-19): the full vitest suite EXCEEDS the 10-min Bash cap — run as two foreground shards; guidanceRegistry title= census false-positives on component props named `title`; +1 migration or +1 edge fn trips ~5 doc/contract tests no focused gate covers"
metadata:
  node_type: memory
  type: project
  originSessionId: c7979c3b-d9d7-48bb-a499-e2271011bf43
  modified: 2026-07-19T19:59:26.843Z
---

Three durable facts from the Wave B finisher closure (2026-07-19):

1. **The full vitest suite exceeds the 10-minute Bash timeout** under any load
   (one file alone, advancePauseResume, ran 142 s). Cure: run it as TWO
   FOREGROUND SHARDS — `--shard=1/2` then `--shard=2/2` (~4.6 + ~3.3 min),
   each bare with its exit code read directly — then classify failures via
   isolation runs. Never background-and-wait (the proven stall).

2. **`guidanceRegistry.walker`'s title= census is textual** — it counts
   `title=` occurrences and FALSE-POSITIVES on React component props named
   `title` (e.g. a local `<Mechanism title=…>` that renders an `<h3>`, not a
   native tooltip). Cure: name such props `heading`, and use `aria-label` for
   real button tooltips. (Sibling fact, recorded at C13: the kill-list greps
   also count COMMENT text.)

3. **Adding a migration or an edge function trips ~5 full-suite doc/contract
   tests no focused gate covers**: migrationContiguity, migrationSequenceAll
   (gapless), docCounts, architectureFreshness, deployRunbookFreshness (+
   abuseModelFreshness for security-adjacent edges, + verifyJwtPosture's
   INTENDED_ANON list for anon cron functions). The focused-gates blind spot
   re-bit twice in one lane. Any brief adding a migration/edge fn must name
   this cluster in its expected-reds or order the doc updates.

**How to apply:** bind all three into every implementer/closer brief's
discipline block. Related: [[piped-gate-exit-masking]],
[[stale-dist-gate-gotcha]], [[c13-one-door-shipped]].
