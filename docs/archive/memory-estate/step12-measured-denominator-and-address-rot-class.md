---
name: step12-measured-denominator-and-address-rot-class
description: "Step 12 (npm run test) measured whole at 79419449: 39 files / 54 tests red across 14 dirs, not the 2 dirs the brief named — plus the hand-keyed-address rot class cured 3x at e37f9495"
metadata: 
  node_type: memory
  type: project
  originSessionId: 0be2ac61-89a4-425a-9361-67c3f5ab1681
  modified: 2026-08-07T12:50:53.717Z
---

# Step 12 is a PROGRAM, not a lane — and the brief that says otherwise measured two directories

**MEASURED 2026-08-07, clean tree, single-lane (gate mutex held, no other vitest
runner), at `79419449`:**

```
npm run test  ->  [gate-tail] exit: 1
Test Files  39 failed | 2310 passed | 1 skipped (2350)
     Tests  54 failed | 27182 passed | 55 skipped (27291)
  Duration  710.34s
```

The step-12 brief described this as "6 tests/domain files + 17 tests/lint tests."
That set is real and complete **for those two directories** — and it is a little
under half the failures. Twenty more files fail in `tests/architecture`,
`tests/build`, `tests/copy`, `tests/data`, `tests/design`, `tests/docs`,
`tests/edgeFunctions`, `tests/joins`, `tests/lib`, `tests/ops`, `tests/property`,
`tests/security`, `tests/store`, `tests/ui`.

⚠️ **THE LESSON, GENERALIZED: a failure census scoped to a subtree reads exactly
like a whole-suite census in the report that quotes it.** Nothing in "6 files / 17
tests" says "…in the two directories I ran." Before inheriting any red-set as a
denominator, re-run the WHOLE gate step, not the directories the previous lane
named. The full suite takes ~710s — budget for it detached; a 2-minute foreground
window cannot hold it.

## THE HAND-KEYED-ADDRESS ROT CLASS — three live instances in one measurement

A pin hand-copies a **derivable address** (a source formula, a file path, a
function's home) purely as filler to make a match unique. The thing it copied then
moves for reasons the pin does not care about, and the pin goes false. **In all
three instances below the CODE WAS RIGHT AND THE PIN WAS WRONG — measured before
touching anything.** Cured at `e37f9495`.

1. `tests/domain/changeAuthorityPolicy.contract.test.js` — the
   `faction_government_challenge` SOURCE_ANCHOR embedded `factionCompetition.js`'s
   `probability:` expression. WR-5 (`e1654184`) added `+ warPressure * 0.08` and
   re-wrapped it over three lines; no authority changed; `src.includes(ANCHOR)`
   went false.
2. `tests/data/stressTypeRegistration.test.js` — `STRESS_BOOSTS` was hand-keyed to
   `src/generators/historyGenerator.js`; the history leaf extraction moved it to
   `src/generators/history/historyEventStrands.js`. Both live definitions cover all
   15 registered stress types, so nothing was half-wired.
3. `src/domain/fieldManifest.js` — `neighbourNetwork[].relationshipType`'s
   `pulseWriter` named `applyWorldPulse.js#writeRelationshipLabelToNeighbourNetworks`;
   the god-module split moved the function to `applyWorldPulseRelationshipGraph.js`
   while `applyWorldPulse.js` kept importing and calling it at two sites. **The write
   never stopped** — this was NOT the field-freezing bug the test exists to catch.

### The cure shape: POINT at a load-bearing token, DERIVE the boundary

- Anchor on a token whose change IS the change you care about (a `candidateType`
  literal, a table NAME), never on neighbouring lines used as filler.
- Compute the block boundary from the source's own structure. For
  changeAuthorityPolicy: brace-balance forward from the site to the `}`/`]` that
  closes the object literal the site is a key of. Measured: that literal is 52
  lines and holds **exactly one** `applyMode`, so locality is not weakened —
  whereas the naive "up to the next `candidateType:`" boundary spans 172 lines and
  3 `applyMode`s and would have been a real loosening.
- **Assert the site token occurs EXACTLY ONCE** — `indexOf` takes the first hit, so
  a second copy silently retargets the pin (the first-match retarget class).
- Better still, delete the address: `stressTypeRegistration` now addresses tables
  BY NAME and LOCATES them BY SEARCH across `src/data` + `src/generators`,
  requiring coverage at EVERY definition site. That is strictly stronger than the
  old file-keyed list — a second definition site is now covered automatically
  instead of waiting for a human to add a row — and it is pinned non-vacuous
  (>50 files scanned, every named table resolves to ≥1 site).

## How to apply

- ⭐ **Every repair run as a MUTANT.** A pin that RUNS is not a pin that ASSERTS,
  and a mutant that plants nothing passes — assert the file actually changed, then
  restore from a backup and `cmp` byte-identity. The stressTypeRegistration mutant
  is the model: deleting `famine:` reddened the walker naming
  `src/generators/history/historyEventStrands.js`, which is the proof that the
  repair **restored enforcement at the relocated home** rather than removing it.
- **A rotted pin is not permission to re-record.** Measure the code first. All
  three above would have been "silenced" by a re-record, and all three were green
  code.
- ⚠️ Adding comment lines to a `src/domain` file risks the tolerance-zero size
  ratchet — run `tests/lint/sizeBaseline.test.js` before committing such an edit.
  (It passed for the `fieldManifest.js` edit; the risk was real, not theoretical.)

## What step 12 still owes (all deliberately deferred, documented, NOT bugs to re-find)

- **THE MIGRATION TRAIN — OWNER-GATED.** Migration 195 landed past the rehearsal
  manifest's head of 194, with no rollback and no DEPLOY.md update. Reds
  `tests/ops/migrationRehearsal`, `tests/docs/deployRunbookFreshness`,
  `tests/docs/migrationRollbackDiscipline`.
- **THE ANY-CAST BURN.** 3 files / 34 holes over baseline: `commercialReasons.js`
  31, `envoyPulse.js` 2, `warDeployment.js` 1. ⛔ `--update` stays forbidden — it
  banks the 31 permanently. The envoyPulse pair was already MEASURED (at
  `173e9d7b`) to need real `wizardNews`/`regionalGraph` shapes threaded through
  `pulseKernel.js`.
- **TWO REAL ARCHITECTURE REGRESSIONS the walkers caught correctly** — a new
  39-module worldPulse import cycle (`layerBoundaries`), and 3 new
  `src/domain -> src/generators` edges onto `generators/hookThemes.js`
  (`domainGeneratorsBoundary`). Plus `src/domain/spatial/distanceRead.js`
  re-entering the first-paint static graph via `worldState -> warCoalitionLedger`
  (`userRouteIdentityLeaf`) — a genuine bundle regression, not a pin fault.
- **THE EDGE BUNDLES** (4 files) — stale artifacts; `npm run build:edge-shared`,
  with inputs STAGED, in a lane that owns them.
- ⚠️ `tests/lint/sovereigntyLightingContract.walker` reds because the ESTATE FILE
  COUNT moved (2346 -> 2350) — the recorded "any new test file reds the lighting
  census" hazard, now live.

**Steps 1-11 of `npm run check` exit 0. Steps 13 (build) and 14 (verify:dist)
remain dark behind step 12 and have still never run on this branch.**
