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

## THE BOOKS MY CURES MOVE (F2)

HELD FOR THE CHAIR'S "MERGE THE LINE AT <tip>" (the prompt's order: the merge, its push, then the books). Known so far:
PP11 moves `powerStructure.stability` in 6 of the 720 and 0 of the 525.

## Rows named for other seats

As the predecessors' (the record's seat: PP1's 170 and C25259; the density law's seat: C32434; the seat of
`npcGenerator.js`: the parked hook). Nothing new.

## How the instruments are re-made

As the predecessors': `git archive` CENSUS-3 and READ-ALL out of their lanes to a scratch directory. For a record-only
measure (PP11's), `births.mjs` alone (`TREE=<tree> OUT=<out> SEEDS=<CENSUS-3>/seeds.txt node births.mjs`, about three
minutes) at a base tree and at the cured tree, and a field-by-field diff of the two `corpus.ndjson.gz`. THE 525 COUNT:
a node script that imports `<tree>/tests/helpers/goldenMasterCorpus.js`, calls `loadGenerationLawPayloads()`, births
each row as `generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} })` and hashes the record whole and
by top-level field (keyed by `keyOf`), run at both trees and diffed.
