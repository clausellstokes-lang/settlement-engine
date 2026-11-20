# BAR2-LABELS-2 hand-back (2026-11-15)

I succeed BAR2-LABELS on `lane/bar2-labels-2026-11-15`, starting from its tip d1e7b3f9e. Its hand-back (`BAR2-LABELS-HANDBACK.md`, beside this file) is my state; I redid nothing it committed. The line's base is f8042b61a. All work was done in scratch worktrees. Nothing was merged: the chair's "MERGE THE LINE AT <tip>" has not come, so the books (F2) have not been run after a merge.

## The rulings I worked to
LB0 to LB6 (`docs/chair/2026-11-14/briefs/BAR2-LABELS.md` on `lane/chair-2026-11-08`), the chair's prompt to this seat (LB2 re-read, LB4 by the gate, LB6 rest), and **the chair's grant LB7** (15:04 UTC, vetoable): in `src/generators/steps/assembleSettlement.js` only, (1) the call `withGuardPaidFromDefence` hands the military gate in its `read`; (2) one late re-read of the validator's two funding reasons by the gate, at the same seam. The rule stays in my files. It is draw-free and no step moves.

## Batch 4: LB4, the defenders' pay has one home (`defenseProfile.economicGates.military`)

THE FIELD, sent to the chair (BAR2-CORPUS and BAR2-PEOPLE mark their lines by it): `defenseProfile.economicGates.military` = `fundedGate(0.6, keepOfRecord(economicState))`, a function of the STANDING prosperity label only: 1 (Comfortable, Prosperous, Wealthy), 0.88 (Moderate), 0.76 (Poor), 0.72 (Struggling, Subsistence); absent where no force or wall stands. The page's own wages line (DS-DEF-11 WALLED-STRAINED, "fall short on the watch's wages") falls below 1, so that is the cut.

STEP ORDER (told to the chair): generateEconomy writes the guard line (`economicState.js` → `generateSafetyProfile`), and structuralValidationPass writes the validator's reason, BEFORE assembleSettlement writes the gate (`assembleSettlement.js:255`). The cure reads the gate at that seam, after the profile (grant LB7). No step moved.

MEASURE FIRST (the census's 720 at f8042b61a, the record's own text):

| line (writer) | prints | false by the gate | where false |
|---|---|---|---|
| "disciplined but resource-constrained … irregular pay" (`safetyProfile.js`, reads `pri.economy`) | 19 | **17** | gate 1 (Prosperous 10, Comfortable 7) |
| "well paid, well equipped" (`safetyProfile.js` and `patrolTwin`, read `pri.economy`) | 42 | **1** | r2r-town-9, gate 0.88 (Moderate) |
| "chronically underfunded: poor equipment, low morale" (`structuralValidator.js`, reads `resolvedMilPriority`) | 54 | **26** | gate 1 |
| "so underfunded that they are barely maintained" (its sibling, the same dial) | 0 | 0 | — |
| "exists on paper. Chronically underpaid" (`paperTruth`, reads the Economic Survival purse word) | 5 with the pay claim | 0 | the claim prints only at 0.76: **struck, no change** |

THE CURE: `safetyLineTruth.js :: payTruth` (the guard line, in `keptGuardLine` after `paperTruth` and `patrolTruth`). Below 1, "well paid, well equipped" becomes the irregular-pay line, and its crisis twin becomes `patrolTwin`'s unpaid twin in the same crisis. At 1, "irregular pay" becomes `PAID_IN_FULL`. `structuralValidator.js :: settleFundingReasons`: at 1, a funding reason becomes `FUNDED_EMBATTLED`, with its severity and its size tail kept. Below 1, or with no gate, nothing changes (the input is returned by reference).

GUARD: `tests/generators/bar2DefendersPay.test.js`. It has 4 arms: three NOT/KEEP pairs, and the chair's law over every birth in the file (a gate of 1 never prints irregular pay or underfunding; a gate below 1 never prints well paid). All 4 are red at d1e7b3f9e and green at the tip. A plant (the validator's cut at `> 1`, not committed) reds its arm.

DECLARED MOVE of the record, on the census's 720 (before f8042b61a, after my tree at 51c0b37da + batch 4; `famdiff.mjs`): batch 4 moves **44 towns in 2 families**: `structuralViolations` **26** and `economicState.safetyProfile.guardEffectivenessDesc` **18** (the 17 irregular-pay towns and r2r-town-9). The grain cure is display only. **0 of the 525** reference configurations move (their dials never reach these lines).

THE INVENTORY DIFF (before → after, `inventory_diff.py`): C6890 16→0 GONE (plus r2r-town-28's town-watch form: 17); C27195 0→0; C25137 4→3 (r2r-town-9); C9161 54→28 (−26); C26982 22→20, and with its non-first forms the grain lines lose 12 printings in 11 towns (one town lost two cards). Every other line in fewer towns belongs to my predecessor's batches (below). THE INHERITORS of mine, each read where it prints: "Fortification and forces are present and paid, but the pressure on them never lets up." +26 (r2r-city-47, r2r-thorp-45 with its size tail: Warning rows, gate 1); "The garrison and city watch are disciplined, paid in full and properly equipped." +16 and its town-watch form +1 (r2r-city-28, beside "accounts have money in hand"); the irregular-pay line +1 (r2r-town-9, beside its own DS-DEF-11 "fall short on the watch's wages"); the grain cards' shared clause passing to the next card (+1 "Law enforcement … iron brought in, which a siege …", r2s-recently_betrayed-town-3) and +2 "Mercenary hire … iron brought in." (r2r-town-34). All of these are true by the record.

THE PAGE'S WAGES LINE AGAINST MY THREE (the chair's ask): after the cure, in **no town** does a pay line of mine contradict DS-DEF-11, and the law holds on all 720. Two disagreements remain, both in other seats' lines, by the same field:
- DS-DEF-2's "accounts have money in hand: … can keep its defenders paid" (it reads the Economic Survival band) prints at a gate below 1 in **4** towns: r2r-town-9, r2r-town-39, r2s-succession_void-town-0, -town-1 (all at 0.88). This is for BAR2-CORPUS.
- The stability label "Tense (militarised, chronically underfunded)" (`src/generators/power/governanceNarrative.js:273`) prints in 7 towns and is **false in 6** (gate 1): r2r-town-28, r2r-city-6, r2r-city-28, r2r-metropolis-3, r2r-metropolis-53, r2s-monster_pressure-city-0. It is the same class as mine. **NAMED** for the seat that holds `power/governanceNarrative.js` (BAR2-PEOPLE, as I read the chair's line).

## Item 1: what my predecessor owed (its batches 1 to 3)
- **The after census and the inventory diff** (before f8042b61a, after my batch-4 tree, which carries batches 1 to 3 and 51c0b37da), the predecessor's rows: C1229 488→447 (−41, as measured); C16557 63→41 (−22; its hand-back says 21 false, and its own family diff moved 22: the one more is also a sawmill without managed woodland); C14738/C15234 18→6 (−12); "Military role: absent" 184→151 (−33); "Medical role: absent" 184→161 (−23); **"Economic role: absent" 118→110 (−8, not the 40 it states)**: the rest of its 40 are other folds of the row or other surfaces, which I have not settled. Reliance words: Integral 195→181, Relied upon 146→134, None 366→388, Present 13→17 (its 38 moves). THE MAGIC HEADLINE: the availability words GONE as headlines (Limited 200, Common 192, Rare 90, Broad 66, Pervasive 64) and the level words NEW (Medium 307, High 229, Low 184 = 720). The availability still prints below as "Availability <word>" (read in r2r-city-0: "Low", then "Availability moderate"). Widest inheritors read where they print: the level word (r2r-city-11, r2r-city-1, r2r-city-0), "No arcane practitioner stands with the defence." (+41, r2r-city-16), "Wards, detection and counterspell are beyond its defenders." (+40), the timber sawn line (+22, r2r-city-12), "Reliance on magic: None" (+22, r2r-city-23), "Relied upon" (+12, r2r-city-21), "No # is set to keep order here…" (+12, r2r-hamlet-0, the inventory's fold of "No one"), and the arcane advisory twins (+9, r2r-metropolis-10). Every one is true by the record where I read it. One inventory artifact: "<N>s, detection and counterspell are beyond its defenders." (1 town) is the fold of "Wards" as a name.
- **The 525 reference configurations**: each record hashed at f8042b61a and at the batch-4 tree (my probe: `generateSettlementPipeline` over `tests/helpers/goldenMasterCorpus.js`, sha256 of the record and of every field family). **41 of 525 move** (town 13, city 16, metropolis 12): `economicState.incomeSources` 29 (batch 3, the timber line) and `powerStructure.factions` 12 (batch 1, LB0). Batches 2 (display only) and 4 move **none** of the 525.

## Item 3: LB2 re-read, STRUCK
I bore the three seeds as the census bears a seed, at f8042b61a, and read the record:
- bar0-city-under_siege+famine-rand-4: Invasion & War "Strong" = `defenseProfile.scores.military` 76; the defence word "Lightly defended" = `defenseProfile.readiness` 37 (label Lightly Defended). The record holds city walls and gates, a garrison and a professional city watch.
- bar0-town-occupied-rand-5: "Adequate" = military 43 ("Walls, and a watch to keep them."); "Vulnerable" = readiness 19. The record holds town walls and a town watch.
- bar0-village-calm-rand-5: "Adequate" = military 46 ("No walls or garrison, but enough here to turn away raiders"); "Lightly defended" = readiness 31. The record holds a village watch.
These are two different facts that may honestly differ: the bar rates ONE threat; the defence word rates the readiness over all five. The page says so above the bars ("Each bar shows how ready the settlement is for that threat"). The readers' header gave no force, but every town holds the force its rating names. Rows C2730 C30315 C32534 are **struck**, as is the predecessor's park of an LB2 cap: there is no premise left for it.

## EVERY NEW OR CHANGED LINE (for the owner's veto)
- `safetyLineTruth.js :: PAID_IN_FULL` "The {force} is/are disciplined, paid in full and properly equipped. Effective in a fight; vulnerable to sustained corruption." (17 towns): r2r-town-28 (the smallest size it reaches), r2r-city-6, r2r-metropolis-0 (the largest). No siege, famine or occupation is among its towns; under one, the crisis twins stand unchanged.
- `structuralValidator.js :: FUNDED_EMBATTLED` "Embattled region. Fortification and forces are present and paid, but the pressure on them never lets up." (26 towns): r2r-thorp-45 (smallest, with its "beleaguered outpost" tail), r2r-metropolis-2 (largest), r2s-famine-metropolis-2 (famine), r2s-occupied-metropolis-2 (occupation).
- The irregular-pay line (unchanged words) now also prints in r2r-town-9, in place of "well paid".
- The grain need line: no new words; the food goods are left out where `importPct` is 0 (11 towns, e.g. r2r-town-10, r2r-town-34, r2s-religious_conversion-town-1).

## THE BOOKS (F2 partial: the merge has not come)
The sweep of every test file that pins a line or function batch 4 touched (29 files; `pinned.txt`), run at my tree:
- Two reds were turned by my cure, and both are cured in this commit. `tests/lint/heldKeyWriterCensus.walker.test.js` A3 (a LAW: every imported call of the assembly step is registered): it takes `settleFundingReasons` as an exempt row with its reason (it writes nothing; `structuralViolations` is a READING). `tests/generators/tailDisplayCivic3V3.test.js` row 7: its liveness anchor in r2r-town-9 was the "well paid" line my cure rules false there (gate 0.88). It is re-keyed by identity, the same slot of the same town, with a dated note.
- One red is carried: `tests/generators/payOneHome.test.js` (rv2-famine-city-0's purse clause) is red at f8042b61a too.
- The gates on the touched files: eslint 0; domain strict 1113 = its ceiling; the type ratchet 167 = its ceiling; the presumed-things walker 1 fresh hit, the same at d1e7b3f9e (the predecessor's ARCANE_NONE_WITH_SERVICE line, carried); the twelve-birth grid 0 falls at base and tip.
- Goldens: batch 4 moves 0 of the 525. All four batches together move 41 of the 525 (above).
- I touched neither `src/domain/facts/factVocabulary.js` nor `factsOf.js`.

## Item 4: the rest of LB6
- **C26982, the need line "… depend on grain brought in", CURED in batch 4** (`chainNeedShown.js :: chainNeedLine`, display). The goods it names come from the trade imports as printed, but the food record can say that no food comes in at all (`economicState.foodSecurity.importPct` 0: all food is grown here). On the base 720, the calm form naming a food good (grain, livestock or game) prints in **297** towns and is **false in 11** (r2r-town-10, -21, -22, -34, -35, -40, r2s-infiltrated-town-3, r2s-insurgency-town-0, r2s-recently_betrayed-town-1, -3, r2s-religious_conversion-town-1). The cure: where `importPct` is 0, the calm form leaves the food goods out. The card names its other needs, or states none (11 towns, under the 20 to report). The siege form ("from outside, which the siege has cut off") and the isolated forms are unchanged: under a siege, an `importPct` of 0 is the siege's own cut.
- **C2572, "Fully exploited" medicinal herbs, STRUCK as a grade.** On the 720 it prints in 13 towns, and none of them has its foraging grounds in `nearbyResourcesDepleted`. In the read town (bar0-city-under_siege+famine-rand-4, born at f8042b61a), `foraging_areas` is depleted, but the town's Ancient Grove yields medicinal herbs (the page's own "Commodities available"), so the herbs are worked. What remains is the card's source label, "Draws on: herb gathering areas", which names the spent ground rather than the grove. That is false in 0 of 720 and in 1 read town. NAMED, not cured: the label comes from the chain's `rawResource` source list (`ResourcesTab.jsx` / the resource analysis).
- **C23858, "The table rests on salted fish.", NAMED** for the seat that holds `src/domain/foodways.js` (not my file). On the 720 it prints in 18 towns, with fishing grounds depleted in **0**. In the read town (bar0-thorp-calm-rand-4, born), `fishing_grounds` IS in `nearbyResourcesDepleted` ("no longer sustain a commercial catch"), and the line agrees with the food record ("its fishing comes first"). The disagreement is between the food record and the land: the food balance (`foodBalance.js`, mine) still counts the fishing of a depleted ground. Curing that would move the food record's draw, which is a STOP under the brief's law. PARKED, measure 0 of 720.
- **C3396, "exploits it: <a person>", NAMED for BAR2-PLACES**: the writer is the crisis cast (`src/domain/crisis/crisisCast.js`, the `exploiter` role), as the ruling foresaw.
- C23849 (fold 0, the port-traffic line): not reached.

## Guards
`tests/generators/bar2PayAndGrain.test.js` (batch 4), beside the predecessor's three.

## Instruments, re-made
- The censuses: `census3.sh <tree> <out> 4` from a `git archive` of CENSUS-3 (before: a worktree at f8042b61a with node_modules symlinked; after: the batch tree). The read towns are born with `--seeds <file> --count-only` (33 s).
- The family diff: `pr/famdiff.mjs <before corpus> <after corpus>`. The 525: `g/run.sh <tree> <label>` (a vitest probe over `goldenMasterCorpus.js`, one hash a record and a field family), then `g/cmp.mjs`. The LB4 measure: `pr/lb4.mjs`, `pr/wages.mjs`. All of these are in this seat's scratchpad.

## What is left
- **C23849** (fold 0) is not reached.
- The herbs card's "Draws on" label and the salted-fish/food-record conflict are named above.
- The books after the chair's "MERGE THE LINE AT <tip>" are owed: the merge has not come.
