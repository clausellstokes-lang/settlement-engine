# CONFLICT-LINES-2: the second draft set (drafts for the integrator to read)

DEPTH-2's measuring helper, 2026-11-20. These are drafts only. I did not build a probe for them (nothing committed, nothing pushed).
The shares come from `project2.mjs` (written beside this file) over the same 600 births at 105ceb55f (`before.jsonl`). The lines are
in `drafts2.mjs`. The pick is the approved one: the argmax of `hashKey(seed::governanceNarrative:<POOL>::<id>)` over the lines whose
needs hold at the site, with the config passed in. The projection keys on the birth seed and on the ids below, so a build that uses
other ids or another seed will land on different but similar numbers. The three new atoms are read here by the institution row's
name. Under the strict reading, "Water source" matches the row "Water source" only. Under the broad reading it also matches
"Multiple water sources". Outputs: `project2.strict.out.txt`, `project2.broad.out.txt`.

## (A) Three lines for the GRAZING pool on the three new atoms

| id | draft | needs |
|---|---|---|
| n1-water-source | The households cannot agree whose turn it is to keep the water clean, and each says another has missed a turn. | `Water source` |
| n2-mill-trip | The mill is a long way off, and the households argue over whose turn it is to carry everyone's grain there. | `Access to external mill` |
| n3-commons | Some households say others put more beasts on the common grazing than their share, and nobody can agree how many each may keep there. | `Common grazing land` |

**Projected top share**, with the approved 16 plus these 3, the levies pool and the military pools of (B) all applied:

| size | before | strict | broad | the top sentence |
|---|---|---|---|---|
| thorp | 52 | **17** | 17 | grazing (thorp twin) |
| hamlet | 49 | **16** | 16 | n2-mill-trip |
| village | 44 | **11** | 10 | n3-commons |

## (B) The rung `institutionFlags.militaryEffective > 68 && !seatIsMilitary`

All three lines describe the same friction: the armed powers reaching into what the civil side handled. Each sub-branch is its own
pool, and today's line stays at index 0 with its sibling twin unchanged. `rewriteFactionPhrasing` turns "the council" into the
power's name and "the garrison" or "the watch" into the force that stands. No pronoun follows the council: the drafts repeat the
noun instead ("the watch's business").

**Sub-branch `hasMilitaryInstitution && hasCourt`**:

| id | draft | needs |
|---|---|---|
| ma0 | *today's* The military commanders are pushing for expanded authority over civilian courts, and the council is losing ground. | (today's) |
| ma1 | The watch captains want to settle small disputes themselves instead of sending them to the court, and the council has not agreed. | `watch`, `court` |
| ma2 | The garrison wants the say over who comes in at the gates, a say the council has kept until now. | `garrison`, `gate` |
| ma3 | The garrison's officers want their soldiers answerable to them alone, not to the civil court. | `garrison`, `court` |
| ma4 | The watch has started setting fines on the spot, and the council says setting fines was never the watch's business. | `watch` |
| ma5 | The garrison wants a larger share of the settlement's money for the walls, and the council is giving ground. | `garrison`, `walls` |

**Sub-branch `hasCivicInstitution && !hasMilitaryInstitution`**: today's militia-captain line at index 0, plus:

| id | draft | needs |
|---|---|---|
| mb1 | The militia want to decide who keeps the night watch, which the council used to settle. | `militia` |

**The else sub-branch**: today's "strongest armed household" line at index 0, plus `mb1`.

**Projected top share** (all pools applied):

| size | before | after | the top sentence |
|---|---|---|---|
| town | 58 | **12** | l5 (watch) |
| city | 52 | **16** | l2 (millers); the military line falls from 19 to at most 5 (ma5) |
| metropolis | 52 | **9** | l3 (granary) |

In these births the rung fires only in towns, cities and metropolises, and every one of those places takes the first sub-branch,
so `mb1` is not reached here. The city's 16 comes from the hash choosing the levies pool's millers line. In the earlier probe's own
births it was 10.


INTEGRATOR'S EDIT (DEPTH-2, 16:14 UTC by `date -u`, all nine read line by line): ma3 "want their own soldiers judged by their own officers, not before the civil court" -> "want their soldiers answerable to them alone, not to the civil court". Projections only (no probe): thorp 52->17, hamlet 49->16, village 44->11, town 58->12, city 52->16, metropolis 52->9.

THE CHAIR'S WORD (2026-11-20 16:22 UTC): EIGHT AS WRITTEN (n2, n3, ma1-ma5 with the integrator's edit, mb1); n1 REWORDED (applied above). The atom "Water source" READS BROADLY (several water sources include one). They join the conflict unit.
