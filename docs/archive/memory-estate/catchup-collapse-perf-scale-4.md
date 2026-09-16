---
name: catchup-collapse-perf-scale-4
description: performance-scale-4 CATCH-UP COLLAPSE (owner ruling 2026-07-14) — M10b catch-up now ONE orchestrated interval, not N sequential advances; BUILT + full-gate-green on review-fixes-2026-07-08, UNSTAGED/not committed. Key hazard: the M10b lastLivingAdvanceAt stamp must live in BOTH advance AND resume Phase-2.
metadata:
  node_type: memory
  type: project
  originSessionId: 049d4c82-58c0-4be1-956a-d47c628ee704
---

**performance-scale-4 CATCH-UP COLLAPSE — BUILT 2026-07-14, full gate green, UNSTAGED (not committed, not pushed) on branch review-fixes-2026-07-08 (off tip d33c8ff8).** Owner ruling 2026-07-14 "collapse to one record" resolved the perf-scale-4 stop-and-report: the M10b living/autonomous advance-on-open catch-up ran up to CATCH_UP_CAP_WEEKS (26) SEQUENTIAL full store advances (26 deep-clone snapshots + 26 localStorage cache writes + 26 awaited cloud syncs) on campaign open. Now it routes the whole span through ONE orchestrated interval.

**3 files changed (all lazy-chunk / domain — first-paint closure UNCHANGED at 1,216,273 B, margin 77 under 1,216,350):**
- `src/domain/worldPulse/advanceInterval.js` — `simulateCampaignWorldInterval` gained an optional `weeks` (number) param that overrides the interval→week table for a FRESH run (a catch-up is an arbitrary 1..26-week span, not a DM-named interval). Ignored on resume (the parked cursor's `ticksTotal` is authoritative). Absent ⇒ byte-identical to every existing caller (dormancy for goldens).
- `src/store/campaignAdvanceSession.js` — `runAdvanceCampaignWorld` reads `options.weeks`; a positive int FORCES the multi-tick orchestrator (regardless of the `advanceMultiTick` killswitch — the single-tick legacy path can only run 1 week) and threads `weeks` into `multiTickArgs`. `runCatchUpCampaignWorld` replaced its N-iteration `advanceCampaignWorld` loop with ONE `advanceCampaignWorld(id, 'one_week', { now, autoResolve, weeks: n })`; weeksCaughtUp = n (complete) / ticksDone (living pause) / 0 (blocked or thrown-before-commit; the interval is atomic).
- `tests/store/catchUpCampaignWorld.test.js` — determinism pin re-referenced (see below); LIVING-resume pin rewritten to the new resume semantics; new "one catch-up = one undo step" pin added.

**Perf: 26-week catch-up ~605ms → ~35ms (~17x) in headless Node; prod also drops 25 of 26 awaited cloud syncs (network round-trips), so the real-world win is larger.**

**INTENDED persist-shape changes (owner accepted, record prominently — existing saves UNAFFECTED; only NEW catch-ups produce the collapsed shape):**
1. `worldState.pulseHistory` for a caught-up span: N records → 1 composed record (Stage 5 collapse in `collapseIntervalHistory`).
2. UNDO: one catch-up = ONE `pulseUndoStack` snapshot = ONE undo step (was N).
3. Analytics: ONE `WORLD_PULSE_ADVANCED` per catch-up (was N).
4. Behavior shift — LIVING resume now CONTINUES the remaining weeks of the same interval to completion (resolveIntervalMajors resumes the full span), where pre-collapse it finished only the paused week and deferred the rest to the next open. This matches the DM Advance-button semantics.

**Determinism CONFIRMED empirically (field-level diff probe):** a catch-up of N weeks is byte-identical to N manual one-week advances in EVERY worldState field AND every member save EXCEPT `pulseHistory` (catch=1 record, manual=N); and byte-identical (incl. collapsed history) to a single `weeks=N` orchestrated advance. The intervalStartTick difference between the one-interval path and N separate intervals did NOT diverge content for the tested fixtures.

**⚠️ HAZARD (lifecycle-path bug found + fixed during this work — the owner's most-bitten class): the M10b `lastLivingAdvanceAt` stamp must live in BOTH `runAdvanceCampaignWorld` AND `runResolveIntervalMajors` Phase-2.** Pre-collapse the catch-up looped single-week advances, so each pause carried the prior week's stamp in its live-cloned `preWorldState`, and resume inherited it. Under the collapse the WHOLE catch-up is one interval: the pause cursor's `preWorldState` is the PRE-interval snapshot (predates the pause's stamp, which `runAdvanceCampaignWorld` applies only to the COMMITTED worldState, never to the cursor's pre-tick inputs). `runResolveIntervalMajors` re-derives worldState wholesale from that snapshot, so without a re-stamp on resume it REVERTED `lastLivingAdvanceAt` to the pre-catch-up value → the whole span re-ran on the next open (phantom re-catch-up — the exact double-count M10b exists to prevent). Fix: added an `advancesOnOpen`-gated re-stamp (`lastLivingAdvanceAt = now`) to `runResolveIntervalMajors`' Phase-2 commit, gated on advancesOnOpen ONLY (NOT tick-moved — a last-tick pause resumes to the same tick yet must retain the stamp). Inert for dm_advanced/frozen (byte-identical; no golden carries a living paused-resume fixture). This also corrects the same latent revert for any MANUAL living-world multi-week advance that pauses.

**Gate (full `npm run check` components, all green):** catchUp 16/16, domain interval+pause+orchestrator 58/58, store+worldPulse sweep 435/435, property goldens 89/89 (byte-identical), any-cast baseline unchanged (total 2248), typecheck full + domain:strict clean, eslint 0 errors (14 pre-existing warnings), build OK, verify:dist closure 1,216,273 ≤ 1,216,350, FULL suite 792 files / 8786 tests pass.
