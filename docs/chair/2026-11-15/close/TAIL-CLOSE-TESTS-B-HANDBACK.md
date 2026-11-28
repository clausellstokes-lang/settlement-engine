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
   **ANSWERED (crisis seat, through the chair): a premise not met, RE-KEYED BY IDENTITY.** Since 2ac50c55 (TAIL-DEFECON-3's
   declared move: an iron hook prints only where the import list holds iron) both hamlets import only Salt and Incense,
   and I measured that they print no iron hook at all. The same two lines now read r2r-town-20 (the doubled line; it imports
   iron ore) and r2r-town-1 (the rations line; it imports iron), and I measured each printing its line. The words, the
   anchors and the expected lines are unchanged. The test is GREEN (2/2).

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

## Ledger 2: the lighting census's each-family PARK debt (the chair's second assignment; both halves)

Walker: `tests/lint/sovereigntyLightingContract.walker.test.js`, arm "⛔ THE EACH-FAMILY PARK DEBT ONLY SHRINKS".
I measured its own sets in a THROWAWAY copy only, and nothing there is committed: its ROOT was pointed at the scratch
tree and both sets were dumped. The census register was never refrozen or touched.

| | ceiling | at 1b386d3f (before) | now |
|---|---|---|---|
| files parked ONLY on `each`/`for` | 108 | **137** | **107** |
| files with an inline literal table still parked (CONTEXT_PARAM) | 50 | **53** | **49** |

- **The 29 newly parked files:** none of them existed when the 108 ceiling was set (30f273b8). 28 are cured. Each
  `test.each`/`it.each` table is now a plain parameterless `test` that runs every row through
  `collectSeedFailures`/`expectNoSeedFailures`. The rows, expects and expected values are the same, and each row's
  message carries what its old title named. Component rows call `cleanup()` per row, and the existing per-test
  timeouts are kept. One table was split in two for the 20 s timeout (tailCrisisBatch7's FALSE rows, 1–4 and 5–8).
- **Also cured, as the chair named them** (older debt inside the 108): tests/domain/cultureProfiles,
  tests/domain/customContentAdmission.
- **Two more loops converted:** the shared helper import would have exempted two bare seed loops in TESTS-A's half
  (displayEconShadowFloor "ONE HOME", displayEconStoresFacetTimber "one home"), so both are converted rather than
  hidden.
- **Proof:** all 30 files are CREDITED by the walker's own `parkReasonsFor`. Run alone, every row that passed before
  passes inside its plain test, and every row that was red is red still (and named). eslint is clean. Both earlier
  walkers read the same counts over the whole corpus (negatives 59 files / 101 sites, all of them TESTS-A's half
  plus my held file; no new site).
- **Held back as moving:** `tests/domain/tailCrisisBatch8.test.js` (lane/tail-crisis-2026-11-14).
- **Rows red before and after, the same rows (not findings):** displayEconCrisisMarks TWIN [r2s-famine-hamlet-0,
  r2s-under_siege-town-1] and KEEP [r2s-famine-hamlet-0]; displayEconRelianceFoodWords KEEP [r2s-famine-town-1];
  tailDisplayCivic3V1 CURED [r2r-metropolis-50].
- **Finding, under src/, not mine:** `tests/domain/tailCrisisBatch7.test.js` cannot load, before and after.
  TypeError "Cannot read properties of undefined (reading 'face')" at src/domain/crisis/crisisHooks.js:102
  (`CAST_REASONS.face`), which looks like a circular import reached through crisisCast.js → plotHooks.js →
  tonightSheet.js. Its rows have never run in this tree, so its conversion is checked by reading, not by a run.
- **Overlap, for the chair:** four of these files (displayEconCrisisMarks, displayEconFlowsMagicFood,
  displayEconRelianceFoodWords, resourcesCatalogueLabel) and magicRoleFoodProvision sit in TESTS-A's half of the
  negative walker and still carry TESTS-A's un-anchored negatives, moved but unchanged. TESTS-A will be editing the
  same files.

## The merge of the joined line at 80a2d0c5d (the chair's "MERGE 80a2d0c5d")

One merge commit, 6747ed79. Ten files conflicted, the five named plus five more that both sides edited:
displayEconShadowFloor, displayEconShortWords, displayEconStoresFacetTimber, tailDisplayCivic3V1 and
economicHistoryRecent. Every one is settled with BOTH EDITS STANDING. My park cures keep their structure (plain
parameterless row loops, collected seed loops), and the other half's work sits inside them: its anchored negatives
(helper calls and markers), new anchor columns, and re-keyed rows and values (displayEconRelianceFoodWords KEEP
13%→14%; economicHistoryRecent #181 re-keyed to "the Shortage", whose negative is now anchored on the prefix that
side asserts). After the merge, every file that differs from 80a2d0c5d is one of mine; no other seat's file was
touched.

- **Each of the ten, run alone:** green, except displayEconCrisisMarks (3 red: the NOT, TWIN and KEEP rows of
  r2s-famine-hamlet-0 and r2s-under_siege-town-1) and tailDisplayCivic3V1 (1 red row: r2r-metropolis-50). Each red
  is EXACTLY what the joined line's own version reds when run alone in this tree, so these are not mine and not new.
- **All ten are CREDITED by the lighting census.** Both walkers print nothing for any of them.
- **tailNarrativeRows** (no longer moving: its branch is on this tip): it had 3 sites at the merge (382, 434, 448),
  all regex negatives. Each now carries a one-line marker naming a positive on the same subject on the line directly
  above it (for 382, the founder's own toMatch was moved up beside it; the claim, rows and values are unchanged).
  19/19 pass, before and after.
- **Two new files arrived parked on `each`:** tests/domain/tailDisplayCivic4BatchA and tailDisplayCivic4BatchB (the
  estate read 109 against the 108 ceiling). Both are cured the same way.
- **Still held as moving:** tests/domain/tailCrisisBatch8.test.js (it has its own commit on lane/tail-crisis, not
  yet on 80a2d0c5d). (tail-corpus-def's three-dot diff flags these files only because that branch has multiple merge
  bases; it has no commit of its own on any of them.)
- **Measured at the merged tip, before my post-merge edits (6747ed79) → after:**
  - Negative walker, my half: 1 file / 3 sites → 0 / 0. Whole corpus: 8 files / 10 sites → 7 / 7, all in TESTS-A's half
    or the held file.
  - Seed walker, my half: 0 → 0. Whole corpus: 1 file / 2 loops (tests/domain/tailCrisisBatch4, TESTS-A's half).
  - Lighting census: each-only parked files 109 → 107 (ceiling 108); literal-table still parked 49 (ceiling 50).
  - Both walkers stay red, only on rows outside my half.
