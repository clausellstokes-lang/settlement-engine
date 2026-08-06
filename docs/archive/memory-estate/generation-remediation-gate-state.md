---
name: generation-remediation-gate-state
description: "The minifold/composite-r4 generation remediation lane — full gate run 2026-07-26, 20 reds, all attributed to uncommitted tree work"
metadata: 
  node_type: memory
  type: project
  originSessionId: c0eb8c59-b585-45a4-afa4-24af69125d15
  modified: 2026-07-28T11:38:07.286Z
---

The generation remediation lane lives in the worktree
`.claude/worktrees/minifold` on branch `claude/composite-r4` (base commit
`8033ddbe`), driven by `docs/GENERATION_REMEDIATION_HANDOFF.md` +
`docs/GENERATION_CONTRACTS.md`. On 2026-07-26 the repository-wide gate was run
for the first time.

**Green:** typecheck (exit 0), typecheck:domain:strict (0 errors), lint (0
errors / 25 pre-existing warnings), sizeBaseline 3/3, generatorGoldenMaster 3/3
(manifest already regenerated, 187 re-hashed + 336 culture-grid keys = 523), all
8 `validate:*` scripts, `git diff --check`.

**Red:** full `npx vitest run` = 13 files / 20 tests failed, 18387 passed, 636s.
**All 11 failing files pass at base `8033ddbe` (159/159)** — every red is caused
by the uncommitted work, none pre-existing. `npm run build`, `verify:dist`, and
`check:edge-behavior` have still never run: `npm run check` short-circuits at the
failing suite.

Triage (full detail in the handoff's "Session addendum — 2026-07-26"):
- **11 reds = ONE cause**, seed-probe drift (resourceEdits/ports/
  resourceDynamicsLifecycle/undoLastEvent). The tests pin the roster a seed
  produces; the roster moved. The lane had already re-pinned them once mid-flight
  and later work invalidated the pins again.
- **4 reds** = distribution shifts (capture rate, plot-hook repetition, chain
  stability, siege suppression). Only the capture one is measured; see
  [[criminal-capture-shift-owner-ruling]].
- **1 red** = founding-seeds narrative probe.
- **3 reds** = registration ratchets; the `stressorEdits` frozen-file-set one was
  fixed, mutation-coverage-manifest (3 new test files) and the edge-shared hash
  (`npm run build:edge-shared`) remain open.

**Why:** the handoff claimed the work was "substantially complete, only the gate
remains". It is not — the gate is the part that found the real state.

**How to apply:** never trust a handoff's "validation checkpoint" as the current
state; re-run the gate and attribute every red against a detached base worktree
before planning. See [[wrong-lineage-worktree-trap-2026-07-14]] and
[[lane-end-gate-gotchas]] (the full suite takes 636s, inside the 10-min cap only
just). ⚠️ This worktree is written by concurrent sessions while you work — see
[[minifold-tree-is-live]].

---

**UPDATE 2026-07-26 (later, from a parallel session @ 0e07c36c):** `npm run
build` + `npm run verify:dist` DID run — build succeeds; verify:dist
single-threaded = 1 failed | 284 passed, the one red being vendorPdfLazy's
engine-chunk ceiling (693932 > the unchanged 660_000), attributable to the
~300-file uncommitted src work. Parallel-load runs report 3 reds — FAKE; use
`--no-file-parallelism`.

**UPDATE 2026-07-26 PM (the fix wave, Fable-managed / Opus-implemented):**
16 of the 17 then-current reds dispatched and closed or in flight —
resource seed cluster (7) re-pinned with semantics CONFIRMED intact; ports (4)
= REAL producer defect fixed (world law built without the positional
tradeRoute; zero-golden-shift proven); founding-seeds re-pinned (economy-lane
cause); captureBirthScale recalibrated per owner ruling (N=400); edge-shared
regenerated; plot-hook "worst ≤ 15%" restated as exceedance count
(mis-specified max — ~80% false-alarm, base failed it too at N≥200); chain
stability = owner ruled "tune depletion down" (DEPLETION_PROB.city, in
flight); cascade Town-watch/Professional-city-watch pair = cascade-borrowed
`required` flag scoped via hasOwnRequiredContract (in flight); vendorPdfLazy =
owner ruled pins + ceiling 673_000 (in flight). A claimed rulingStructure
"sibling" of the ports defect was REFUTED by execution — see
[[rulingstructure-traderoute-misnomer]].

**FINAL (2026-07-26 evening): the fix wave CLOSED.** Convergence run over all
15 ever-red files: 13 green; the 2 reds are (a) generatorGoldenMaster — the
DELIBERATE 84-city-key drift, re-capture owed in ONE pass at lane close (three
overlapping causes ledgered in the handoff's "GOLDEN RE-CAPTURE OWED" section);
(b) mutationCoverageManifest TOTALITY — a FOREIGN test file born 16:24 by the
concurrent deity session (deityPanelManifestParity.test.jsx), their obligation.
Owner rulings taken this wave: capture "recalibrate" · chain stability "tune
depletion down" (city 0.55→0.35, flat town↔city step = veto surface) · chunk
"pins + 673,000". Cascade root cause was the wave's deepest find:
cascade-borrowed `required` flags froze ladder collapse (83/600 settlements) —
fixed by authority scoping (hasOwnRequiredContract); the borrowed flag still
immunizes cascade adds vs decline/closure/calamity = open owner call (+103
golden keys). Owner-decision queue: handoff bottom section (5 items).

**LANE CLOSED (2026-07-26 ~23:30):** the ONE-PASS golden re-capture is DONE —
187/523 keys re-hashed (city 84 + village 84 + town 19, exactly as ledgered),
frozen double-run + third mid-convergence green, PDF golden green as-was,
ledger entry "THE ONE-PASS GOLDEN RE-CAPTURE (generation lane close)".
Convergence: 16/16 ever-red files green (the transient manifest red was the
live security session's new test racing its own manifest entry — they closed
it themselves; twice today a TOTALITY red self-resolved this way — check
MISSING before acting). Owner rulings final: producer required:false SHIPPED
(+103 keys, immunity flip proven); flat town↔city step KEPT. Edge gate:
deno runs fine in the worktree (old env claim stale); blockers were a
committed TS2345 in customContentCore.ts:300 and deno.lock drift @ a88be4f1 —
fix dispatched 23:28. Residuals ledgered: name-keyed closure backstop
(reader-side ruling open); persisted pre-fix settlements keep borrowed
required flags (migration owner-gated).

**COMMITTED (2026-07-27 ~00:15):** the lane's work is banked in two commits on
claude/composite-r4 — `c9e5ca62` (lane close: producer fix, golden capture,
edge-gate unblock, docs) and `7a3ab4b7` (owner queue resolved: reader-side
required scoping across 6 pulse sites retires the persisted-data migration;
hasOwnRequiredContract + hasCascadeProvenance exported; calamity.js carries a
SANCTIONED INLINE MIRROR held by a parity ratchet in calamity.test.js — anyone
extending the law must run that file; tradeRoute→neighbourRelationship renamed
across the power lane with POWER_INTENT_VERSION 1→2, transience proven).
Both survival-checked; staged by explicit list; NOTHING PUSHED (owner-gated).
⚠️ census lesson: `grep -v requiredForTier` hid sites written
`required || requiredForTier` on one line — exclude by the DISTINCT token
(requiredStreak) instead. Foreign red left attributed: sizeBaseline
settlementSlice.js 1268>1265 from a concurrent session's uncommitted work.

**UPDATE 2026-07-27 ~16:40: BOTH COMMITTED** — walker fix @ `777998fb`,
undoFlatRowGuard re-point @ `2719ff79` (owner "do these where appropriate";
pathspec commits, lint-staged stash cycle ran twice, survival checks clean
both times). undoFlatRowGuard now exercises recordCanonFlavorEntryImpl
directly (store.getState/store.setState are the immer get/set — a working
harness recipe for testing retired-surface Impls). Green at HEAD and with the
R-5b retirement in-tree — lands safely ahead of their fold. The R-5b fold no
longer owes this test an update. Fold-program tail (SQL lanes, bundle repair,
full gate, push) untouched — twin session's; push owner-gated.

**UPDATE 2026-07-27 ~16:30 (walker collection red CLEARED — fix IN-TREE, UNCOMMITTED):**
`tests/store/operationRegistry.walker.test.js` was erroring at COLLECTION
("could not locate slice object in configSlice.js") — cause: the R-5b
retirement lane's uncommitted `(set, get)` → `(set, _get)` rename in
configSlice.js; the walker's locator pinned the exact `(set, get)` shape.
Fixed in the walker (its only dirt, +84/−10): locator widened — first param
must stay literally `set` (the census keys on that identifier; pinned as a
decision), later params any name/arity — and ALL THREE collection-time throws
converted to per-file collected failures asserted by a dedicated first test
with kind messages, + locator shape pins (tolerance and rejection halves).
23/23 green. tests/store sweep (--no-file-parallelism, 420s): 951/953; both
reds attributed NOT this fix: (a) undoFlatRowGuard.test.js:109
"recordCanonFlavorEntry is not a function" = R-5b's uncommitted
settlementSlice.js retirement of that store surface — their diff comment calls
the surface dead, but this guard test is a live consumer they haven't updated;
their obligation. (b) pulseUndoAdvertising resolveIntervalMajors 40s timeout =
cross-SESSION machine load (two concurrent gates forking workers); 13/13 green
alone. ⚠️ the fake-red class extends past `--no-file-parallelism`: concurrent
sessions' gates contend the same machine — check `ps aux | grep vitest` before
believing a timeout.

**UPDATE 2026-07-28 (drain-watch blind spot):** when WAITING for another
session's vitest to drain before gating minifold, a `ps` grep for
`minifold/node_modules/vitest` matches only the fork WORKERS
(`…/node_modules/vitest/dist/workers/forks.js`) — the MAIN process is
`node …/node_modules/.bin/vitest run …` (`.bin/` breaks the substring) and its
`npm exec vitest` parent has no path at all. A watcher on the narrow pattern
reports FALSE DRAINS in worker-less gaps (collection, between files) and you
lose the launch race repeatedly. Cure: grep `minifold.*vitest`, poll at 1 s,
and put the drain-wait AND the gate launch in ONE background command so the
gate fires atomically on true drain. Also confirmed: the harness restores the
persisted shell cwd for background Bash tasks (it prepends the cd itself), but
print `pwd` + `rev-parse --abbrev-ref HEAD` in the gate output as the receipt.

**FINAL RULINGS COMMITTED (2026-07-27 ~00:50, `9201597f`):** the owner delegated
the last two open edges; manager ruled and shipped: (1) TIER SHIFTS ADOPT —
applyTierOutcomeToSettlement restamps the settled roster against the new tier's
catalog (required:true + cascadeAdded cleared by absence; source stays as
history); closes the demoted-seat inconsistency (closure-protected but
calamity-strikeable). ⚠️ deliberately DEFERRED: the symmetric RELEASE (a
promoted settlement's stale required:true, e.g. Town watch riding into a city)
— recorded in the tierOutcomeApply docstring + ledger, a separate ruling.
(2) CALAMITY MIRROR STAYS; the parity ratchet is now a generated 50-shape
product over exported REQUIRED_CONTRACT_FLAG_KEYS — extending the law without
extending the list is the one drift mode, and the list lives in the same
module as the law. ⚠️ tierOutcomeApply has an any-cast baseline of 20
(monotone-down) — new code there must be typed against settlement.schema, not
any-cast. Program state: THREE commits (c9e5ca62, 7a3ab4b7, 9201597f), nothing
pushed (owner-gated), zero open engineering items in the lane.
