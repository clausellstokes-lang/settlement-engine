# TAIL-CLOSE-TESTS-B — hand-back (kept current with each push)

Seat: TAIL-CLOSE-TESTS-B (close). Branch `lane/tail-close-tests-b-2026-11-15`, cut from the joined line
`lane/join-2026-11-14` at 7efc7686. My half: every walker-listed file sorting AFTER
`tests/generators/conflictRelationsTwin.test.js`.

Measured with the walkers' own scan code (sliced verbatim from the two walker files), counting sites above each
file's frozen ceiling.

## Counts, my half

| | at 7efc7686 (before) | now |
|---|---|---|
| negative walker: files / un-anchored sites over ceiling | 54 / 103 | (batch 1) see below |
| seed walker: files / bare seed loops over ceiling | 18 / 37 | (batch 1) see below |

Whole corpus at 7efc7686: negatives over ceiling 112 files / 203 sites, generation-facing population 53
(quarantine 3); seed loops over ceiling 31 files / 60 loops, generation-facing population 20 (quarantine 1).

## Batches

- **Batch 1 (15 files):** defenceParts, famineFrameStore, foodwaysCultureLineHolds, importerHookNoTrade,
  incomeRowsBorneOut, power/occupiedSeatReads, power/tailPowers4Batch1, relationLinesSayTheRecord,
  stableHistoryMajorCount, stressFactionsClaimWhatTheRecordHolds, tailDefeconExportSide, tailDisplayCivic3V3,
  tailTies2Batch1 (tests/generators), pdf/chainStateThreeSurfaces, pdf/tailExportsPdfBatch1.
  NEG 27→0, SEED 9→0. Tests run alone: 172 pass / 3 fail before, and the same 172 / 3 after (the same tests).
  eslint is clean on all 15.
  Markers (each backed by a positive on the same subject directly above): stableHistoryMajorCount ×3
  (an added `toContain` of a phrase the history really prints); tailTies2Batch1 ×2 (the exact `toBe` of the
  same line now sits directly above it); pdf/tailExportsPdfBatch1 ×1 (an added per-surface `toContain`).

## Findings (the stronger form red, left red and true)

1. `tests/generators/tailTies2Batch1.test.js` › "NOT (T6): under one ruler no tie line is about a vote; …":
   the collected loop reports **2 of 8** failing (`[2] r2r-hamlet-4`, `[3] r2r-village-16`, "expected true to
   be false" on `rulingBodyOf`). The bare loop stopped at r2r-hamlet-4 and hid r2r-village-16. It was already
   red at the join on one seed.

## Already red at the join, not mine, unchanged

- `tests/generators/incomeRowsBorneOut.test.js` › "r2r-thorp-24: …" (expected [ 'Harvest' ] to include
  'Agricultural Rents').
- `tests/generators/tailTies2Batch1.test.js` › "NOT (powerSiblings): …" (the occupied hamlet's seat line is
  the occupation twin).

## Held back as moving (three-dot diff against the ten builder branches, per the chair's correction)

- `tests/generators/tailNarrativeRows.test.js` (lane/tail-narrative-2026-11-14). It waits for "SWEPT <tip>".

## What is left

Batches 2–4 are in progress (the rest of my half), then the moving file after the sweep.
