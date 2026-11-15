# BAR2-PEOPLE-3 · hand-back (groups POWERS and TIES; REVIEW-BAR-2; the second successor of BAR2-PEOPLE)

Seat: BAR2-PEOPLE-3, a builder seat, the second successor on `lane/bar2-people-2026-11-15`. Start tip: **e2cb710ea**
(as the prompt named it; the repository's main checkout stood at 923f2b159, behind origin: the scratch worktree was cut
from origin's e2cb710ea). The two predecessors' hand-backs (`BAR2-PEOPLE-HANDBACK.md`, `BAR2-PEOPLE-2-HANDBACK.md`,
beside this file) are the state: batches A, B and C are committed and not redone; batch D (the hook) stays parked.

## The rulings I worked to (the chair's; each vetoable by the owner)

PP1 to PP10 (the first hand-back), PP3a and PP3b (the second), and **PP11** (the chair, 15:47 UTC): the governance line
"Tense (militarised, chronically underfunded)" takes the twin "Tense (militarised)" where the funding gate
`defenseProfile.economicGates.military` reads 1, and stands as it is where the gate is under 1 or was not handed in;
the gate is carried from the readiness-label replay at assembly; four files exactly; draw-free; a declared move.

## Batch E · PP11 (the funding gate reaches the stability line)

THE MEASURE BEFORE (python over the base census's record, births at e2cb710ea): the line prints in **7** of the 720 and
is FALSE IN **6** (gate 1): r2r-town-28, r2r-city-6, r2r-city-28, r2r-metropolis-3, r2r-metropolis-53,
r2s-monster_pressure-city-0; it stands in r2r-town-16 (gate 0.88). As the predecessor measured.

THE CURE (four files; no line added and none moved in any of them):
- `src/generators/steps/assembleSettlement.js`: ONLY the replay's options object, on its own line (:271), takes
  `militaryGate: settlement.defenseProfile.economicGates?.military` (the `generateDefenseProfile` line and the file's
  last lines untouched).
- `src/generators/power/economyReconciliation.js :: projectPower`: takes `militaryGate` beside `defenseLabel` (same
  line) and hands it into `generatePowerStructure`'s projection (same line as the `defenseLabel` spread).
- `src/generators/power/rulingStructure.js` (:698): `militaryGate: projection.militaryGate ?? null` beside
  `defenseLabel` into `buildGovernanceLabels`'s params (governanceNarrative.js).
- `src/generators/power/governanceNarrative.js`: `buildGovernanceLabels` takes it (same line as `defenseLabel`) and
  passes it to `deriveBaselineStability`, whose branch returns `Number(militaryGate) >= 1 ? 'Tense (militarised)' : 'Tense
  (militarised, chronically underfunded)'` (absent: `Number(null)` is 0, the line stands). The file stays at 798 lines
  (F31's power/ ceiling).

MEASURE AFTER (births of the 720 at the cured tree, the record diffed field by field against the base's): **6 towns
move, ONE FIELD: `powerStructure.stability` (6)**; nothing else in any record. The line now prints in 1 of the 720
(r2r-town-16, gate 0.88, true); the twin in the six. THE 525 REFERENCE CONFIGURATIONS: **0 moved** (hashed whole and by
top-level field at e2cb710ea and at the cure: none of the 525 prints the line; their stabilities are "Vulnerable
(decisions shaped from outside…)" 480, "Desperate — hunger…" 36, "Stable" 9).

Guard: `tests/generators/power/bar2People3Funding.test.js`: RED AT THE BASE (e2cb710ea: 4 failed, 1 passed: the three
funded towns r2r-town-28, r2r-city-6, r2s-monster_pressure-city-0 and the law arm), the KEEP (r2r-town-16, gate 0.88,
still prints the line) green before and after; green at the cure (5 of 5); a plant (`>= 0` for `>= 1`, not committed)
reds the KEEP. Gates: eslint on the five touched files, the strict-domain gate and the type ratchet: exit 0; the
presumed-things walker `--check`: its fresh and stale rows IDENTICAL to the base's (the watch line named under PT3);
the twelve-birth grid: 0 falls. The two other tests that name the words ("underfunded"/"militarised":
`embattledReasonNoSlider`, `claimRungsCommanding`) green (8 of 8: they pin other lines).

## EVERY NEW OR CHANGED LINE (the owner's veto list)

The predecessors' lines are in their hand-backs (they stand). Mine:

| line (new) | file | read in (smallest · largest · a crisis) |
|---|---|---|
| "Tense (militarised)" (the twin of "Tense (militarised, chronically underfunded)" where the gate reads 1) | governanceNarrative.js | r2r-town-28 ("Tense (militarised); monsters on the roads") · r2r-metropolis-53 · r2s-monster_pressure-city-0 (the six towns; no siege, famine or occupation among the 720's six: the branch is reached by a strong military and a weak economy) |

## THE MERGE

The chair's word (16:21 UTC): MERGE THE LINE AT dcb069bff. `origin/lane/join-2026-11-14` read dcb069bff; merged into
the branch as ONE merge commit, no conflict (d3831adfc), pushed alone and returned before anything more.

## THE BOOKS (F2), AT THE MERGED TIP: PARTLY RUN; THE REST OWED

(b) THE LAW SUITES (the brief's seventeen, all found by `git ls-files`), one run alone at d3831adfc
(`gate-tail`, log kept): **9 failed, 438 passed (447), in 5 files**. Each red read and classed:

| test · arm | class | what was done |
|---|---|---|
| `tests/lint/defenceFactReaders.walker.test.js` · every file reads its banked count | A LAW (shrink-only register) turned red by BATCH A: `powerStrata.js`'s occupier test (`deciderOf`) copied crisisCast's name rule, whose `garrison\s+rule` alternative is a defence word in a pattern literal: a 28th file read | CURED HERE: the alternative dropped (no generated name carries it; the comment says why); green; the 525 unmoved by it (256 → 256, the same families) |
| `tests/generators/generationForkCensus.test.js` · A6 (the hash channel) | a ROW ADDRESS (`src/data/npcData.js:1637`, the pair-prose `pickVariant` hash call) moved by BATCH C's wrapper (1637 → 1661, the same call, no seed changed) | RE-ADDRESSED BY ITS TEXT beside a dated note (the file's own form); green |
| `tests/lint/writerReach.walker.test.js` · the surfaceReach grammar round-trips | A LAW, RED, NOT CURED (my budget): "narrative on factionRelationships" reads N on every surface where the frozen register reads R (web-display N). The branch's one new reader of that field is BATCH A's `powerStrata.js :: deciderOf` (`row.narrative.includes(…)`, to stay silent where a relation line names the decider); why the walker now reads the field as reaching no surface is NOT YET TRACED. OWED: trace it in `writerReach.walker.test.js`'s reach resolver; cure it, or take batch A's `deciderOf` silence out | OWED (successor) |
| `generationForkCensus` · A1 (the control row's hash) | A STORED FIGURE: the golden control row moved by the declared cures | NAMED below |
| `tests/generators/pipelinePinnedMode.test.js` · A1, A2, A5 (the golden corpus byte-identical) | STORED FIGURES: the golden corpus | NAMED below |
| `tests/lint/presumedThings.walker.test.js` · every literal declares or has its row; no stale row | A STORED REGISTER: batch B's watch line (fresh 3 · stale 3, the same line in three files), as the first hand-back named under PT3 | NAMED below |

(a) EVERY TEST FILE THAT NAMES A FILE THIS BRANCH TOUCHED: the sixteen `src` files where the tip differs from the
line (`git diff --name-only dcb069bff HEAD -- src`), `grep -rl` of each basename over `tests/`: **189 files**. ONE RUN
BEGAN AT d3831adfc AND WAS CUT SHORT BY A CONTAINER RESTART (about 16:38 UTC): its partial log read these reds, every
one a golden or a register: `worldFactRederive` A7 (the goldens byte-identical), `powerEconomyFreshness` A4 (the golden
unmoved), `pipelinePinnedChoosers` A1 (the golden corpus byte-identical), `generationForkRegistry.contract` A3s (the
FINAL comparand tally: same 28 → 26, absent 20: two rows' comparands, golden-derived), and again `generationForkCensus`
A1/A6 and `presumedThings` (above). NOT CLASSED WHOLE: **THE 189-FILE RUN IS OWED, ONCE, AT THE TIP**, by the successor
(the list is re-made by the command above).

THE SIX TESTS OF THE OWNER'S OWN DOOR (`townCartographyCalibration` 2, `dossierProseManifest` 3, `presetLightingWitness`
1): not touched.

## THE BOOKS MY CURES MOVE (named; NOT re-taken)

| test · arm | old → new | door |
|---|---|---|
| `tests/property/generatorGoldenMaster.test.js` and the surfaces that read the same corpus (`pipelinePinnedMode` A1 A2 A5, `pipelinePinnedChoosers` A1, `powerEconomyFreshness` A4, `worldFactRederive` A7, `generationForkCensus` A1: the control row 7ae632298ed9… → b0bc3c2cf78b…) | **256 of the 525 reference configurations move** (hashed whole at dcb069bff and at the tip); by leaf: `relationships[].description` 239, `powerStructure.factions[].desc` 168, `relationships[].tension` 68, `npcs[].structuralPosition` 9, `npcs[].activeConstraint` 9, `prominentRelationship.tension` 4, `prominentRelationship.phrasing` 4, `relationships[].proseVariant` 1. PP11 moves none of them | the close's doors (the golden manifest's re-take) |
| `tests/lint/generationForkRegistry.contract.test.js` · A3s, the FINAL comparand tally | same 28 → 26 (absent 20) | the registry's door |
| `tests/lint/presumedThings.widened.register.json` · arm 1, `watch` | the row "Well-funded city watch; …" (ee08d7b2a92c842c) → "City watch; it answers for keeping order…" (6c12f9d5be13b96e), in rulingStructure.js, claimStanding.js, powerSiblings.js | the close's presumed pass (ruling PT3) |

## Rows named for other seats

As the predecessors' (the record's seat: PP1's 170 and C25259; the density law's seat: C32434; the seat of
`npcGenerator.js`: the parked hook). Nothing new.

## Hand-back at the budget

My count read 175,431 at 16:27 UTC and is near 250,000 now: this is my hand-back, and I push nothing more. OWED by
whoever takes the seat: (1) the `writerReach` law red (above): trace and cure, or take batch A's `deciderOf` silence out;
(2) the 189-file run, once, whole, at the tip, each red classed; (3) the hand-back's books brought current by both.

## How the instruments are re-made

As the predecessors': `git archive` CENSUS-3 and READ-ALL out of their lanes to a scratch directory. For a record-only
measure (PP11's), `births.mjs` alone (`TREE=<tree> OUT=<out> SEEDS=<CENSUS-3>/seeds.txt node births.mjs`, about three
minutes) at a base tree and at the cured tree, and a field-by-field diff of the two `corpus.ndjson.gz`. THE 525 COUNT:
a node script that imports `<tree>/tests/helpers/goldenMasterCorpus.js`, calls `loadGenerationLawPayloads()`, births
each row as `generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} })` and hashes the record whole and
by top-level field (keyed by `keyOf`), run at both trees and diffed; the leaf families by the same walk with each leaf
path's values hashed per config (the four moved families). Scripts used here: `tools/gm.mjs`, `tools/gm2.mjs`,
`tools/gmdiff.py`, `tools/gm2diff.py` (scratch; re-made from this paragraph).
