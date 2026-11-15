# TAIL-CLOSE-TESTS-B — hand-back (kept current with each push)

Seat: TAIL-CLOSE-TESTS-B (close). Branch `lane/tail-close-tests-b-2026-11-15`, cut from the joined line
`lane/join-2026-11-14` at 7efc7686. My half: every walker-listed file sorting AFTER
`tests/generators/conflictRelationsTwin.test.js`.

Measured with the walkers' own scan code (sliced verbatim from the two walker files), counting sites above each
file's frozen ceiling.

## Counts, my half

| | at 7efc7686 (before) | now |
|---|---|---|
| negative walker: files / un-anchored sites over ceiling | 54 / 103 | 1 / 1 (the moving file, held back) |
| seed walker: files / bare seed loops over ceiling | 18 / 37 | 0 / 0 |

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

- **Batch 2 (17 files):** economicHistoryRecent, layoutNamesWhatStands, power/seatNamedAsItSits,
  power/tailPowers4Batch2, prosperityStanding, safetyForceLines, tailDefeconBatch4Lines,
  tailDefeconCatalogueCommodities, tailDefeconIncomeRows, tailDefeconMadeListWhole, tailTies4Batch1, tailTiesBatch1,
  tensionTemplateDeclaration, timberManagedFelling, w2FixData5OccupationTension, pdf/restoredSubsections (6 sites against
  ceiling 5: the newest site, line 212, is anchored; the row stays 5, since nothing was banked below it),
  pdf/tailExportsPdf3Batch3. NEG 23→0, SEED 7→0. 199 pass / 2 fail before, and the same after. Markers, each with an added
  positive on the same subject: safetyForceLines (corpus-wide), tensionTemplateDeclaration (regex with `i`),
  tailExportsPdf3Batch3 ×2 (multiline regexes; each surface's own heading asserted above).
- **Batch 3 (13 files):** harvestHookFamineHere, houseOfWorkEarns, power/tailPowers3Labels, rosterUnderworldNoName,
  tailCrisisIronHooks, tailDefeconMadeListTableRows, tailTies3Batch1, tailTies4Batch3, tailTiesBatch2,
  w2FixDataHistoryItems, pdf/cultureBlockTwoSurfaces, pdf/tailExportsPdf2Batch2, pdf/threatAssessmentTwoSurfaces.
  NEG 30→0, SEED 13→0. 120 pass / 1 fail before, and the same after. Markers, each with an added positive:
  w2FixDataHistoryItems ×2 (regexes with `i`), tailExportsPdf2Batch2 ×1 (`^$/m`).
- **Batch 4 (20 files):** founderHamletNoMill, foundingRowsRead, gangLineNeedsAGang, people/titleLinesClaimTheTrade,
  people/titleLinesNeedWhatTheyOffer, power/standingReadsTheNamedPower, power/tailPowers3Conflict,
  power/tailPowers4Batch3, standingReadsTheRivalItRead, stressLateReRead, tailDefeconBatch3Lines, tailDefeconMadeList,
  tailDefeconSafetyLines, tailDefeconServiceLines, tailTies4Batch2, upkeepVocation, warContractsSecretProsperity,
  pdf/defenseReadinessWord, pdf/foodWordEverySurface, pdf/tailDisplayCivic3V2. NEG 22→0, SEED 8→0. 207 pass / 1 fail
  before, and the same after. Markers: foundingRowsRead ×2 (the row's own printed phrase, or its exact `null`, asserted
  above), tailDefeconMadeList ×1 (`toEqual([])` on the same list above), warContractsSecretProsperity ×1 (the
  prosperity band asserted above).
- How regexes were converted: a `not.toMatch` became helper calls only where the regex was a plain literal or a literal
  alternation with no flags (one call per alternative, which is exactly equivalent). Every other regex is kept, with a
  positive on the same subject directly above it and a one-line marker. eslint is clean on all 65 files.

## Findings (the stronger form red, left red and true)

1. `tests/generators/tailTies2Batch1.test.js` › "NOT (T6): under one ruler no tie line is about a vote; …":
   the collected loop reports **2 of 8** failing (`[2] r2r-hamlet-4`, `[3] r2r-village-16`, "expected true to
   be false" on `rulingBodyOf`). The bare loop stopped at r2r-hamlet-4 and hid r2r-village-16. It was already
   red at the join on one seed.

2. `tests/generators/tailCrisisIronHooks.test.js` › "no FALSE words print, and the reworded line prints in their
   place": the collected loop reports **2 of 4** failing (r2r-hamlet-35, r2r-hamlet-30; the reworded line is missing
   in both, and r2r-hamlet-35's hooks text is empty). The bare loop showed only r2r-hamlet-35. It was already red at
   the join.

Observation (not red): `tests/generators/foundingRowsRead.test.js` A3 › r2r-thorp-8. Its negative was vacuous, because
the Origin reason is `null` (silent by design, per A5), so the old assertion matched the string "null". That silence is
now pinned exactly with `toBeNull()`.

## Already red at the join, not mine, unchanged

- `tests/generators/economicHistoryRecent.test.js` › "rw3-hamlet-calm-1 (#181)" (the Economic Divide event is not
  found; TypeError on `divide?.yearsAgo`).
- `tests/generators/tailTiesBatch1.test.js` › "NOT: under one ruler no tie names the council…": collected, it reads
  1 of 8 (r2r-village-50), the same seed the bare loop showed.
- `tests/generators/upkeepVocation.test.jsx` › "RED-FIRST, the page".

- `tests/generators/incomeRowsBorneOut.test.js` › "r2r-thorp-24: …" (expected [ 'Harvest' ] to include
  'Agricultural Rents').
- `tests/generators/tailTies2Batch1.test.js` › "NOT (powerSiblings): …" (the occupied hamlet's seat line is
  the occupation twin).

## Held back as moving (three-dot diff against the ten builder branches, per the chair's correction)

- `tests/generators/tailNarrativeRows.test.js` (lane/tail-narrative-2026-11-14). It waits for "SWEPT <tip>".

## What is left

Only the moving file is left (1 negative, at line 382 of tailNarrativeRows). It waits for the chair's "SWEPT <tip>":
then I merge the joined line at that tip, re-measure, and cure what is left and what arrived. The other half's rows
(paths at or before conflictRelationsTwin) are TAIL-CLOSE-TESTS-A's, and both walkers stay red on them.
