---
name: osr-schema4-mint-sizing-and-blockers
description: "⭐⭐ THE SCHEMA-4 MINT IS ONE ATOMIC UNIT ENDING IN A CHAIR COMMIT, and it is NOT one-lane sized (Opus schema-4 lane, 2026-08-10, measured; the review-ledger gate + corpus-visibility + CR-TRFZ-4 halves LANDED unstaged at b52223d7): 7 modules / 20 import sites / 8 gate-bearing suites, of which observedShapeSentinel is 12-of-15 exact-bound; ⚠⚠ the heuristic detector is BYTE-FROZEN to git blob 0310fa9f so no in-detector fix is possible; ⚠⚠ the '23 true-positive' debt marker is a STRUCTURED TAG — the prose phrase the brief names matches only 12 of 23"
metadata:
  type: project
  date: 2026-08-10
  branch: claude/composite-r4
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-10T23:54:17.413Z
---

## What landed (unstaged, tree at b52223d7, chair commits)

- `scripts/migrate-observed-shape-readers.mjs` — `issues` now carry `rowId` and the
  gate reads DECISIONS FIRST, so a reviewed growth row is discharged by its own
  accepted decision. `issues` changed meaning from "the reconciliation is not CLEAN"
  to "the reconciliation is not REVIEWED". 5-case control executed, including a
  **non-vacuity probe**: a forged issue naming a non-existent row is refused ONLY by
  this arm (the decisions loop cannot see it), so the arm is not dead code.
- Same file — `corpusCompatibilityOf` records every corpus-definition key with both
  sides visible. Execution keys (seeds/configs/generations/pulseIntervals) must
  match; observation keys (simulationFlagsLit/steadingsMinted/**shapeCount**) are
  BANKED. ⚠ It also closed a second hole: nothing validated an artifact's
  `corpus.meta` at all, so an ABSENT key compared `undefined` and passed — the
  repo's own migration fixture had been sitting in exactly that hole.
- `scripts/check-test-ratchet.mjs` — see [[trfz4-load-throw-classification-measured]].

## ⚠⚠ Why the mint is atomic and cannot be sliced

CR-TRFZ-4 reds the gate via the walker's 24 skips → the walker can only go green in
heuristic mode → heuristic mode needs the schema-4 baseline → the baseline needs a
COMMIT (`validateBaselineHistory` hunts a committed genesis in
`rev-list --ancestry-path <subjectSha>..HEAD`, which is 0 commits when subject===HEAD).
Every piece is load-bearing for the next.

## Measured denominator (why it is not one-lane)

7 modules, 20 import sites across 9 files, 8 gate-bearing suites. Heaviest:
`observedShapeSentinel.test.js` **12 of 15 tests** bind to exact-origin or literal
schema 3; `observedShapeMigration.test.js` 13 of 14 need rewire or replacement;
`observedShapeBaseline.test.js` 4 of 19 `test.each` cases must be replaced (its
`count above one` case IS the count===1 law schema 4 deletes).

⚠ The count===1 law has **TWO independent copies** — `observed-shape-baseline.mjs`
`validateInventory` and `check-observed-shape-readers.mjs` `rowOf`; only the first
has a test. Change one and not the other and it fails open AT THE GATE.

⚠ `check:observed-shape-readers` is **NOT in the `check` chain** — this instrument
gates only through `npm run test:ratchet`, i.e. the vitest suites.

⚠ Making the heuristic leg the ratchet leg moves `src/components/` (88 files / 250
identities / 378 counts) into DIRECT ratchet enforcement and makes CR-OSR-SCOPE-1's
gate role moot. That is a scope expansion the freeze rulings did not name.

## ⚠⚠ The heuristic detector is byte-frozen — EXECUTED

`assertGovernedLegacyDetectorSource` reconstructs git blob
`0310fa9fdda873c1b382cf18c3936707e8e4addf` and admits exactly ONE enrichment.
Appending a single comment line was REFUSED in a live run. So **no fix, filter, or
family-union can be implemented inside `legacy-reader-shape-scan.mjs`** — it must be
a post-filter over findings, or a new governed detector version.

## ⚠⚠ The 23-row debt marker is a TAG, not prose — MEASURED

Mandate wording says the rows are "noted `TRUE-POSITIVE, banked pending repair`".
Against the real 2,326-row ledger that phrase matches **12 of 23**; the other 11 say
`TRUE-POSITIVE:` / `TRUE-POSITIVE singular/plural drift:` / etc. The structured tag
`[CR-OSR-FREEZE-3-R2 triage a]` matches exactly **23** and survives a
reword-one-note negative control (tag-keyed still 23, prose-keyed drops to 11).
**A prose-keyed debt surface would silently lose 11 true positives.**

## ⚠ The estate census cannot be measured on this shared tree

`sovereigntyLightingContract.walker.test.js` CENSUS is exact-equality and SEQUENCED.
It red on `files: 2383 vs 2382` — and tracked test files number exactly 2382, so the
+1 is TC-4's untracked `tests/domain/townCartographyBuildings.test.js` ALONE. Because
the census stops at its first red figure, the `titles` arm (which this lane's +3
tests do move, 19500 → 19503 expected) is UNMEASURABLE until that foreign file lands.
Never re-record the census from a tree carrying another lane's dirt.

Related: [[osr-schema3-freeze-refused-measured]] · [[osr-review-ledger-cannot-clear-growth-rows]] ·
[[osr-171-growth-rows-triaged]] · [[osr-heuristic-leg-detector-mechanisms]] ·
[[trfz4-load-throw-classification-measured]] · [[osr-m6-family-union-measured]].
