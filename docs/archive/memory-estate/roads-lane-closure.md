---
name: roads-lane-closure
description: "⭐ THE ROADS lane (R-1..R-4) closure 2026-07-19 on claude/the-roads (tip fa0bd2e7, base aad6265e, NOT folded): lane-end full-suite closer fixed 6 REAL registration/hygiene defects the predecessor's load-heavy run misdiagnosed as flake (RC-a..RC-f). ⚠️ ONE PRE-EXISTING BLOCKER REMAINS: 35 domain-strict errors (separate gate, not in vitest). The 6-defect list is a REUSABLE cross-cutting checklist for ANY new engine wave."
metadata:
  node_type: memory
  type: project
  originSessionId: c7979c3b-d9d7-48bb-a499-e2271011bf43
  modified: 2026-07-19T20:13:20.951Z
---

## THE ROADS lane-end closure (2026-07-19)

Branch `claude/the-roads`, base `aad6265e` (the-composite), tip WAS `b059e808`
(R-1a..R-4c) → after closure `fa0bd2e7` (+6 lettered RC commits, NOT folded, NOT
pushed — the manager validates and folds; R-5..R-7 dispatch separately).

**Why this matters:** the predecessor's full-suite run showed "23 failed files"
under heavy parallel load and called it ALL load-flake. It was NOT. On a quiet
machine, 6 of those were **deterministic REAL roads-introduced defects** — the
classic focused-gates blind spot (the roads focused gates never run these
cross-cutting structural walkers). Base comparison (a throwaway worktree at
aad6265e) was the decisive classifier: fail-on-base ⇒ parked; pass-on-base +
fail-on-roads ⇒ real.

### The 6 defects fixed (RC-a..RC-f) — A REUSABLE CHECKLIST FOR ANY NEW WAVE
1. **spatialUsage coverage** (`spatialLedgerCoverage.walker`): a new `setSpatialLedger('key')`
   must be in `TRACKED_LEDGER_KEYS` or `EXEMPT_LEDGER_KEYS` (src/lib/spatialUsage.js).
   Roads wrote TWO keys — `roads` + `roadsReturnedCaptives` — both unregistered → EXEMPT.
2. **clamp baseline** (`clampPrimitiveBaseline`): a new local `clamp01` def reds the ratchet;
   the baseline is AT its ceiling (61/61) so it CANNOT be baselined — you MUST `import { clamp01 }
   from src/kernel/math.js`. (Byte-neutral only for finite-numeric inputs: the kernel is ISFINITE
   ⇒0 on strings, roads' local was COERCE. `clampNum` is invisible to the DEF_RE — only `clamp01`
   matches.)
3. **significance vocabulary** (`significanceVocabulary`): only `major`/`notable` are real tiers;
   `minor`/`moderate` are DEAD (significanceRank is binary). Sweep `minor`→`notable`. In roads this
   also nudged roadsBeat.score 34→42 for those beats (display ranking only, binary consumer neutral).
4. **impactKind registration** (`impactKindWalkers` ×3): a new `impactKind: 'X'` needs a WHAT_PHRASES
   entry (settlementRumors.js) AND an EXPECTED_VOICE entry (in the TEST file — usually `null`, the
   tradition/npc_ladder unvoiced precedent; newsVoiceCategory already returns null via the
   set-but-unclassified guard).
5. **any-cast baseline** (`domainAnyCastBaseline`): new `any` type-holes red the frozen baseline —
   FIX THE TYPES, don't widen. Roads: `whereabouts?: any` (schema) + 2 corruptionWeb `@param {any}`.
   JSDoc-only ⇒ runtime byte-neutral.
6. **consumer allowlist** (`militaryStrength.test.js`): importing `militaryStrength.js` needs the
   importer added to that test's ALLOWED set (single-consumer guard). Roads reads it for §7 escort
   protection.

### ⚠️ PRE-EXISTING BLOCKER — NOT fixed by this closure, out of vitest scope
`npm run typecheck:domain:strict` (ceiling 0, a FOLD gate, NOT part of the vitest suite) fails with
**35 strict errors: roadsKernel.js +30, roads/state.js +4, pulseKernel.js +1** — CONFIRMED IDENTICAL
at the committed tip b059e808 (my closure edits added ZERO). The roads lane's new files were never
made strict-clean. Errors are mechanical-ish (unknown→SpatialDigest/ArmyTransitRecord/number casts,
`{}|null`→`string|null`, the pulseKernel name-swap `saves` wiring TS2353) — all JSDoc-erasable ⇒
byte-neutral to fix, but ~35 sites needing type imports. Needs its own strict-clean slice before fold.

### Verification receipts (all executed, quiet machine)
- Build green; `verify:dist` closure **1,041,061** vs base **1,040,998** = **+63 B** (index +51,
  engine-core +12; ZERO roads code in any eager chunk — all roads markers resolve into lazy
  advanceInterval/worldSnapshot chunks; law 11 upheld). The budget red (1,040,000) is the
  sibling-owned composite breach, expected.
- Full suite = **2 FOREGROUND SHARDS** (`--shard=1/2` ~2.5 min, `--shard=2/2` ~3 min) — matches
  [[lane-end-gate-gotchas]]. Sharding halved parallelism ⇒ **near-zero flake**: only 4 reds total =
  EXACTLY the 4 parked golden families (beliefMapGolden, goldenViewModel, generatorGoldenMaster,
  worldpulseDeityGolden — all fail on base too, owner-gated regen). 13,742 tests, 6 fixes green,
  zero regression.
- §8 census belts held: participation-filter behavior changed ONLY in worldSnapshot.js +
  npcLadderState.js (isOffStage widening, same-reference dormant path preserved).

### Flake caution (the full-suite-at-once trap)
Running the whole suite in ONE invocation self-induces load: 11 pglite files time out in
`beforeAll: new PGlite()` (10s hook), advancePauseResume re-entrancy tests time out, the
120-paired-seed siege test (ordering.test.js) times out at 20s, fullPdf.render flakes on canvas
toDataURL. ALL pass serialized/sharded. Classify via isolation (serialized) + base comparison,
never trust the raw at-once failing set.
