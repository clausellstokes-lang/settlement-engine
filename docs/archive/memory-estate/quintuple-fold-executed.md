---
name: quintuple-fold-executed
description: "⭐⭐ QUINTUPLE FOLD DONE 2026-07-20 — composite-r4 @ 5d9218c6 (i·c·h·e·d + seams + 6 fixes; mig head 168); ⚠⚠ closure 1,036,399, MARGIN ONLY 3,601; 3 vetoable fold calls in owner queue; full-suite reds must be re-run in ISOLATION before defect-hunting"
metadata: 
  node_type: memory
  type: project
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-20T17:53:37.364Z
---

THE QUINTUPLE FOLD (2026-07-20): vision-i/c/h/e/d folded into claude/composite-r4,
final tip `5d9218c6` (base a9caa573; merges abd4c91f · 32e4149d · e238fa89 · seams
d3058c72 · dba1b31d · e4b54995 · fixes 5d9218c6). Migration head 168 contiguous.
Two-shard suite 14,902 passed / 5 expected-red files (4 parked goldens +
advancePauseResume, all base-proven). Manager-verified against git.

**The hazards that survive:**
- ⚠⚠ CLOSURE 1,036,399 ≤ 1,040,000 — **margin 3,601 bytes**, the tightest the
  composite has ever run. vision-d's crash forensics is EAGER (+8,002 B, booted
  synchronously from store/index.js). Shave candidate = a thinner forensics seam;
  the budget raise stays owner-gated. NO new eager bytes without headroom review.
- ⚠ TRIAGE RULE: pglite + long-async tests are LOAD-FLAKY under the full two-shard
  run (contention timeouts) but reliably green in isolation — re-run any full-suite
  red file ALONE before treating it as a defect (~18 files false-flagged this fold).
- ⚠ Auto-merge LIES quietly on check-chains and docs: the ci/package.json
  validate-step unions and two doc-freshness names had to be hand-restored; treat
  every auto-merged shared registry/manifest as suspect and verify the union.

**Vetoable fold calls (ratified, owner queue):** (1) migration 168 pg_temp pin — 14
SECURITY DEFINER fns now `set search_path = public, pg_temp` per the owner's own
migrationSearchPathPin ratchet; behavior-preserving, migration unshipped (prod head
117). (2) deepCraftKillList ceilings re-pinned to measured (borderRadius 100→101,
tintedCallouts 161→164); veto-alternative = de-round the new instances. (3)
campaignSlice error-literal seam DEFERRED (one literal only, outside the ratchet,
no store→t() precedent).

**Why:** pass 2 (V-F+V-J+V-K) and every later lane budget against the 3,601 margin;
the triage rule prevents wasted defect-hunts at every future fold/gate.
**How to apply:** measure closure after EVERY merge; halt on breach, no unilateral
shaves. Related: [[minifold-complete-build-closed]] [[vision-k-assize-commons-shipped]]
[[lane-end-gate-gotchas]].
