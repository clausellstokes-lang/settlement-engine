# BIRTH-2 — HAND-BACK (the tenth chair's seat; kept current at every push)

## 0. WHERE THE SEAT STANDS (written 09:06 UTC 2026-11-25)
- Prompt: `docs/chair/2026-11-24/tenth/prompts/START-BIRTH-2.txt` + `START-GEN-COMMON.txt` on `lane/chair-2026-11-08`.
- Base: `origin/lane/close-7-2026-11-24-cures` at 0ec96f13d8 (point 116, troubles lit, guard merged; engine 0.10.0).
- Branch: `lane/birth-2-2026-11-25` (this file, probes). Units go up as `lane/birth-2-2026-11-25-<unit>-wip`, cut at the base.
- First message to the chair sent ~09:00 UTC.
- RULINGS (chair branch `docs/chair/2026-11-24/tenth/gen/RULING-G.md`): G1 (09:10) A5 "BESIDE" on seven terms; G2 (09:20)
  D4: the chip "holds power" from derivePowerStrata (same audience), and the two birth-time readers cured (expect C 0, V 2).
- G4 (09:39 UTC read): the chip NOT built (G2 (1) withdrawn); SummaryTab's sort DROPPED (dead code); NAME SummaryTab and its
  rendering tests for a later removal; list which of the nine readers are LIVE with wrong-print counts on C and V.
- UNIT A5 as of 09:31 UTC: BUILT on `lane/birth-2-2026-11-25-a5-wip` (worktree /home/user/wt/a5) at 9cbf5cf16. Field `dmStanding`.
  Writers set it: annotateFactionStanding, rivalDescOf (''), settleStandingToRoster, settleStandingToLegitimacy,
  settleSeatHolderToRecord (2 writes); rename via rewriteProse + a path row. Red 10/15 at base, green 15/15.
  NAMED, NOT BUILT: `rulingPower.js` transfer (play) replaces a whole desc with no tail; the copied field goes stale, so the
  veil fails closed there. Proof census `probes/a5proof.census.jsx` (12 V births: all clean).
- UNIT D4 as of 09:39 UTC: `-d4-wip` at 66e313f4a (3 commits: 1c1ec43f4 sort; 2cf611af9 G2 narrative readers; 66e313f4a G4:
  SummaryTab back to base, history readers via the leaf, test now tests/generators/powersStrongestFirstReaders.test.js, red
  7/11 at base, green 11/11). Live readers: aiLayer extractFullContext; narrativeGenerator genSettSummary/genPressureDetail
  topFaction; historyGenerator dominantFaction, secFaction, altFaction. Dead: SummaryTab (4 readers), buildPersonaSlice (no
  caller). Re-birth at 2cf611af9: records moved C 0, V 0 (the two "wrong" lines were never wrong: corrected to the chair).
  Records at 66e313f4a: read from the page battery's record hashes (pb-d4 vs pb-base).
- QUEUE (scratchpad queue.sh, progress in queue.progress): d4 summary C/V; a5 proof base/a5 C/V; page battery base/d4/a5 C/V
  (CLOSE-7's page-battery.mjs copied to /home/user/c7tools/read25). THEN OWED for each unit: tests/lint whole, tests/copy
  whole, named tests, a build; push each -wip; hand in to CLOSE-7 and the chair.
- Corpora: C = `close-7/read24/make-plan.mjs`, V = `make-visitor-plan.mjs` over the chair's `read/plan-lit.json`.
- Probes run as: vitest config rooted at the checkout, include the probe file (see the probe headers).

## 1. UNIT A5: THE STANDING SENTENCE STORED AS ITS OWN FIELD (RULING G1, "BESIDE")
- Branch `lane/birth-2-2026-11-25-a5-wip`, cut at 0ec96f13d8; commit 9cbf5cf16.
- THE FIELD: `dmStanding` on each power of `powerStructure.factions`: the standing sentence, '' where the power has none.
  The description keeps the sentence at its end, as today. Absent on an old record; no load adds it.
- PRIVATE BY ITS NAME (G1 term 1): `src/domain/display/publicSafe.js :: PRIVATE_KEY_RE` holds `\bdm` (flag i); its SQL twin,
  the sanitiser `key ~* '(secret|private|\m(dm|gm)|...'`, at `supabase/migrations/210_public_prose_text_projection.sql`
  line 153 (and the same token in 189, 205, 206, 207). Nothing under supabase/ is changed.
- WRITERS (G1 term 3), each sets the field in the statement that writes the tail: `factionStanding.js ::
  annotateFactionStanding`; `applyDensityLaw.js :: rivalDescOf` (a rival's own line: ''); `rosterText.js ::
  settleStandingToRoster` and `settleStandingToLegitimacy`; `factionStanding.js :: settleSeatHolderToRecord` (its cut of a
  seat line on other rows, and its settle of the holder's row; `cutLine` and `settled` apply one change to both texts).
- THE PLAY PATH, NAMED, NOT BUILT: `src/domain/rulingPower.js` (the transfer's `nextFactions` map, the not-kept branch)
  replaces a governing power's whole description with `GOVERNMENT_DESCS` and writes NO tail; the copied field goes stale, so
  the veil's cut fails closed there (the whole description withheld on a non-owner read). One property in that object
  (`dmStanding: ''` where the field is present) would end it; advance time, so not built.
- EDITORS (G1 term 4): the rename (`factionRename.js :: applyFactionRenameToSettlement`) applies `rewriteProse` to the field
  as to the description, with a declared path row; the user's edit and the AI refine leave it alone (fail closed, by design).
- RED FIRST: `tests/generators/power/standingStoredAsField.test.js`: 10 of 15 red at the base, 15 of 15 green.
- PROOF OVER EVERY BIRTH (`probes/a5proof.census.jsx`, oracle: the writer wrapped; base hashes from `probes/d4order`):
  | corpus | births | record equal but for the key | field missing | desc not ending with it | writer mismatch (writes) | public / grounding keys | load round-trip | journal / grounding equal |
  |---|---|---|---|---|---|---|---|---|
  | C | 900 | 900 | 0 | 0 | 0 (23,362) | 0 / 0 | 900 | 900 / 900 |
  | V | 900 | 900 | 0 | 0 | 0 (20,905) | 0 / 0 | 900 | 900 / 900 |
  The PDF view model and the search enumeration carry the raw record (the view model under `active`, `npcs.factions`,
  `relationships.factions`, `raw`; the search as `settlement`): they differ only by the key; compared stripped in
  `probes/a5vm.census.jsx` (PENDING). Pages: the page battery (PENDING).
- BYTES: ~440 B a birth on average, ~1.8 KB at most (the A5 measure, 09:0x).
- EXPORTS THAT CARRY THE RAW KEY (the owner's own): the settlement JSON (the record itself), and anything built from the view
  model's raw passthroughs; the Foundry journal pages do not print it (equal 1,800 of 1,800).
- FOR THE VEIL's LANE (paused; nothing of it touched): (1) the field is `dmStanding`; (2) it must join what no non-owner read
  sends (Reveal-DM reads keep private keys, so the name alone does that on today's projections); (3) the cut: the
  description's end where it equals `dmStanding` (a description that no longer ends with it, after a user edit, an AI refine
  or the play transfer above, is withheld whole: the fail-closed case); `dmStanding` === '' means a new place's power with no
  tail; (4) a record whose powers hold no `dmStanding` is an old record: the frozen table cuts it, as before.
- FROZEN SURFACES IT MOVES (named for the owner's signing, none re-recorded): PENDING the gate run (goldens, the observed-shape
  baseline, the edge bundles under supabase/functions/_shared).

## 2. UNIT D4: THE POWERS STRONGEST-FIRST (RULINGS G2, G4)
- Branch `lane/birth-2-2026-11-25-d4-wip`, cut at 0ec96f13d8; commits 1c1ec43f4, 2cf611af9, 66e313f4a.
- THE ONE SORTING READER: `src/domain/display/powersStrongestFirst.js :: powersStrongestFirst` (a stable copy, ties in roster
  order, as `pdf/lib/viewModel.js` already sorts).
- MEASURED at 0ec96f13d8: out of power order C 69/900 (city 29, metropolis 40), V 121/900 (town 1, city 51, metropolis 69).
  Causes read: `applyDensityLaw.js :: resizeSeats` appends minted rivals after the last sort; `rulerKin.js :: foldKin` adds a
  folded share to the ruler in place (V dp-town-93, dp-city-134: the first row is not the strongest).
- THE NINE READERS OF INTAKE ITEM 1, LIVE OR NOT, and how often each would print wrongly on C / V:
  | reader | live? | wrong C / V |
  |---|---|---|
  | `SummaryTab.jsx :: characterSentence` ("Power rests with") | DEAD (SummaryTab mounted nowhere) | 0 / 2 |
  | SummaryTab copy text (three) | DEAD | 5 / 14 |
  | SummaryTab Power tile | DEAD | 0 / 2 |
  | SummaryTab `FactionBar` five | DEAD | 14 / 74 |
  | `narrativeGenerator.js :: genPressureDetail` topFaction (stored) | live at birth | 0 / 0 stored lines wrong |
  | `narrativeGenerator.js :: genSettSummary` topFaction (NPC secrets) | live at birth | 0 / 0 stored lines wrong |
  | `historyGenerator.js` dominantFaction | birth (sorted then) and regeneration | 0 / 0 at birth |
  | `historyGenerator.js` secFaction / altFaction | birth (sorted then) and regeneration | 0 / 0 at birth |
  | `aiLayer.js :: extractFullContext` five (template narrative) | LIVE (`OutputContainer.jsx :: runTemplateNarrative`) | 14 / 74 |
  All the live ones now read through the leaf. Other live print sites checked: the PDF and Foundry (`viewModel.js` sorts
  already); `headlines.js` (the governing row first); `LibraryToolbar.jsx` (names only, 20 > any roster);
  `personaSlicer.js :: buildPersonaSlice` (roster of 8; no caller: dead).
- FOR A LATER TIDY (G4): `src/components/new/SummaryTab.jsx` is mounted nowhere; tests that render it:
  tests/components/economyFreshnessNote.test.jsx, governingModifierSurfaces.test.jsx, phoneChromeFloor.census.test.js,
  statBandsOverDigits.test.jsx; tests/ui/prosperityInCrisisSurfaces.test.jsx, summaryTabPhase2.test.jsx (its comment);
  tests/pdf/labelLadderParity.test.jsx; and lint walkers that list it (copyCorruption, proseNumerics, writerReach, and others).
- RED FIRST: `tests/generators/powersStrongestFirstReaders.test.js`: 7 of 11 red at the base, 11 of 11 green.
- RECORDS MOVED (re-born at 2cf611af9): C 0, V 0. At 66e313f4a: PENDING (the page battery's record hashes).
