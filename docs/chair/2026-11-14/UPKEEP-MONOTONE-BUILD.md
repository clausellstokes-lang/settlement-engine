# UPKEEP-MONOTONE-BUILD: the defence rating made monotone, built as measured (UPKEEP-13's hand-back, kept current)

Seat UPKEEP-13, 2026-11-14, for the chair (session_01ACmDYZrFEVXyZEUg1NDxxC). Brief:
docs/chair/2026-11-14/briefs/BRIEF-UPKEEP-13.md on lane/chair-2026-11-08. Branch: **lane/upkeep-monotone-2026-11-14**,
cut from the defence lane's tip **26474cda9** as first read (the lane moved to ffe0750d4, then 9c32016c9, by
UPKEEP-12: not a stop). Worked in a scratch worktree on the local branch `upkeep13-own` (the checkout's own local
branch already bore the side branch's name), pushed by explicit refspec. Every figure here is EXECUTED unless it
says PLAUSIBLE.

## The rulings worked to (copied from the brief; the chair's of 2026-11-14 08:58 UTC, each vetoable by the owner)
1. P2: build the chair's candidate: the first limit held SCORE BY SCORE, and readiness's sustaining total held to
   the force on the limit's own line.
2. P3: build as measured: the thirteen houses placed as the measure's table places them. The cross-ladder order it
   names (a village's Weekly market above a town's Market square) is NOT built: named, for a later measure.
3. P4: build the form, at ONE point a person (`people.milPerHead: 1`, with its reason row); two points a person
   stays shown beside it for the owner.
4. X1 to X5 and X9: built with P2.
5. P5: the score stands and the line moves: NOT this seat's (the display seat's).
6. Scope: a house of crime lowers order by design (the monotone law does not reach it); the six renames across a
   function or a government are not "a larger house of its own kind": both LISTED here, not cured.
- 09:09 UTC: merge the defence lane's tip (UPKEEP-12's H1) early, before the buckets file is touched: done (b42be5de9).
- 10:40 UTC: the Scroll scribe and the Enchanter's shop join `magicDef` (UPKEEP-12's M3/M5), its own commit,
  measured and declared: done (a88b5b343). Merge the lane's tip when the next item is green.

## The instruments (outside every repository tree; re-made as below)
- The guard: `tests/generators/defenceMonotone.test.js` (the reader's set over the reader's 972 births).
- The measure's probes (lane/upkeep-measure-2-2026-11-14, probes/UPKEEP-MEASURE-2), copied out; `born.mjs` given a
  `NOREC` switch (summary rows only); `measure.sh <sha> <label> <prev>` births the 3,756 and the 972 at a detached
  tree, runs mono2 and the guard. **THE CENSUS'S 720 is the page census's plan** (`r2r-*`, `r2s-*`: the reader's
  972 less its 252 `rv5` births), NOT the corpus's `fresh6`: the measure's c2 census row (55 moved, min -3) is
  re-made exactly on it, and on `fresh6` the same tree moves 37.
- The probe reproduced at the base byte for byte (sorted mono2 ndjson equal to results/mono2.tip.ndjson.gz).

## The commits, each one cause (guard: changes with a fall in the reader's set, births; widened set)
| commit | cause | guard | widened | 3,756: readiness moved / bands; score bands; powers; threats (vs the previous commit) |
|---|---|---|---|---|
| 1ea3ef45a | the guard, RED at the base | 1,751 in 292 | 5,195 in 604 | (test only) |
| b42be5de9 | merge ffe0750d4 (H1, the label) | 1,751 in 292 | | 0 / 82 (Undefended -> Vulnerable); 0; 82; 0 |
| 7fd82a164 | P2 (c2.patch) | 61 in 35 | 2,463 in 496 | 279 (3 up, 276 down) / 22; 425; 22; 141 |
| b49b871fd | X1 the will's hold score by score | 23 in 23 | 2,588 in 498 | 433 / 51; 207; 40; 21 |
| fa643850b | X4 the will's floor | 23 in 23 | 2,047 in 493 | 238 (all up) / 30; 62; 26; 15 |
| 5c1e69750 | X2 the traditions' cap on counted points | 22 in 21 | 2,046 in 493 | 22 / 2; 3; 2; 0 |
| 3d463ce0b | X3 the siege's two reliefs | 22 in 21 | 2,044 in 491 | 52 / 1; 8; 1; 4 |
| 1f6cc23d0 | X5 "monasteries" | 3 in 2 | 2,025 in 481 | 99 / 11; 7; 11; 2 |
| 2212a735e | X9 hundredths | **0** | 2,022 in 480 | 14 / 0; 0; 0; 0 |
| bb0aaa3fe | P3 (c3.patch) | 0 | 2,022 in 480 | 271 / 24; 49; 24; 5 |
| a88b5b343 | magicDef: Scroll scribe, Enchanter's shop | 0 | | 0 / 0; 0; 0; 0 (only `defenseProfile.institutions.magicDef` moves: 898 of 3,756 records, 214 of 972; the chair's 7 go from empty to held) |
| 7509b3794 | P4 at 1 a person (`people.milPerHead`) | 0 | 2,020 in 480 | 385 (all down) / 66; 256; 14; 0 |

X1 and X4 are one hunk of the measure's cx.patch, split because the measure names them as two causes. X2 is kept
as measured although I would have removed `tradF` (left at 1). The only word changed in any hunk is the
comment attribution (the chair's ruling, not "the chair's candidate").

## Beside the measure's own figures
- **P2 alone** (vs the merged tip): readiness 279 (3/276), score bands 425, threats 141, guard 61 in 35, widened
  2,463 in 496: the measure's own. Bands 22 and powers 22 against its 23/23: the one Vulnerable -> Undefended birth
  H1 holds at Vulnerable. Census: 55; 82 score bands; 34 threats: the measure's; 7 bands and 7 powers against 8/8,
  the same hold.
- **P2 + X1..X5**: guard 3 in 2; widened 2,025 in 481; readiness 717 (217/500), mean -0.13; score bands 622;
  threats 171: the measure's own. Bands 73 and powers 58 against 80/65: exactly its 7 Vulnerable -> Undefended.
  Census: 125; 119; 39: the measure's; bands 16, powers 15 against 18/17 (its 2 V -> U).
- **ALL** (vs the merged tip): readiness 1,214 (249 up, 965 down), mean -0.61; score bands 889; threats 176;
  census 208; 166; 39: the measure's own. Bands 153 against 214, powers 94 against 157. CLASSED BIRTH BY BIRTH
  against the measure's ALL tree re-made (call.patch on 26474cda9): every score of every birth is equal; the 61
  bands only the measure moves are all Vulnerable -> Undefended that H1 holds at Vulnerable; the 63 powers only
  the measure re-draws are those 61 and two Lightly Defended -> Undefended (Vulnerable here): each a label
  difference. Source: my four files equal call.patch to the line, plus H1, the magicDef row and the attributions.
- Undefended on the 3,756: 464 at the base, 534 under the measure's ALL; with H1 382 at the merged tip, 389 here.

## HANDED BACK at the chair's 11:03 ruling (count 327,400 read by the chair; the next item is larger than 50,000)
The build is complete through P4 and the magicDef row (7509b3794); the guard is at 0 there. What is left, in order:

## Left (line by line), as of 7509b3794
- Step 3, THE PINS. The build's kin (27 files: every test naming the generator, the weights or the profile; the
  list is `grep -rln "defenseGenerator\|defencePartsOf\|generateDefenseProfile\|defenceWeights" tests`) run at
  7509b3794: 7 failed, 591 passed, 5 skipped. Classed against the merged tip b42be5de9 (the four failing files
  run there: 2 failed):
  - BASE REDS, moved further, NOT this seat's door: tests/property/generatorGoldenMaster.test.js ("every config
    produces byte-identical output") and tests/property/espionageDormancyFence.test.js ("THE DRIVEN GOLDEN: 360
    settlements"): red at b42be5de9 already. The build is a declared move; the golden door's writing mode is not run.
  - NEW, THE BUILD'S (5), each to be traced to its cause before any re-key:
    1-3. tests/generators/magicCountOnce.test.js: the static arm, the drop arm and the two-role listing. Received:
       `count6-calm-city-2`, "Multiple monasteries", "monster: clergy+hospital". CAUSE (EXECUTED by the received
       row; the chain PLAUSIBLE): X5 makes "Multiple monasteries" open the clergy, and the house already opens the
       hospital, so it feeds the monster score through two parts. My recommendation: name the monastery's ladder
       (Multiple monasteries, Major monasteries (5-10)) beside the monastery among the named two-job houses, re-keyed
       by identity with X5 as the cause, if the single "Monastery or friary" is already named there; else a ruling.
    4. tests/generators/defenseEconomicGate.test.js, "a healthy economy with identical buildings scores meaningfully
       higher": 74 is not above 74. PLAUSIBLE cause: P4 (both economies' military full at the same people's measure).
       Not traced.
    5. tests/generators/defenseEconomicGate.test.js, "divine + druid famine mitigation is at least as good as druid
       alone": 27, expected 28. A MONOTONE FALL on a hand fixture outside the reader's set (adding the divine to the
       druid lowers a score by one). A FINDING for the fresh reader: trace it (dims.mjs / why3.mjs of the probes)
       before anything; never loosened.
  - tests/lint/defenceDerived.walker.test.js and defenceParts.test.js: GREEN at 7509b3794 (in the 23 passing files).
- Step 4: merge the defence lane's tip (9c32016c9: UPKEEP-12's H2, #115, #216, docs; none of the four files), then the
  guard and the final measure on the 3,756 and the 720.
- Step 5: the message to the chair. Step 6: the declaration (field diff by family on the 720), the tuning inventory by
  its ritual (one row added), section 2m's five doors, the golden surfaces as files for one draft shift record.
  Step 7: the eight towns for the owner. Step 8: this file finished.

## The births that move a band (the whole build against the merged tip b42be5de9)
Readiness bands: **153 of 3,756** and **31 of 720** (the measure's 214 and 44 less H1's holds, classed above). The
five scores' bands: 889 of the 3,756's score readings, 166 on the 720. Powers re-drawn 94 and 21; AI threats 176 and 39.

## What a fresh reader needs
- Re-make the instruments: copy the measure's probes out (`git archive origin/lane/upkeep-measure-2-2026-11-14
  docs/chair/2026-11-14/probes/UPKEEP-MEASURE-2`), the reader's all.seeds from
  lane/review-upkeep-capacity-2026-11-14 (probes/REVIEW-UPKEEP-CAPACITY/all.seeds); a detached worktree per tree with
  node_modules symlinked; `born.mjs` over corpus.seeds (3,756) and all.seeds (972); the census = all.seeds less rv5.
- The guard runs in about two minutes on one worker; it is the fastest check that the law still holds.

## Named, not built
- P3's cross-ladder order (ruling 2). P4's precise word for "held to its people" (would be new: PARKED; P4 rides the
  fullness line's "more than enough, held in reserve"). P5's lines (the display seat's).
- Outside the law by ruling (6): the 13 criminal houses (order falls by design) and six renames (Citizen militia ->
  Town watch / Professional city watch; Lord's steward -> Lord's appointee; Village reeve -> Town council; Wizard's
  tower -> Mages' guild; Traveling hedge wizard -> Hedge wizard): the widened set's 2,020 falls in 480 births.

## Stops
None. The count field (get_session's context_usage.used_tokens) read 264,797 at both checks (09:46, 10:31): it
looks stale; the seat works on, and says so.

## UPKEEP-15 (the second seat; brief docs/chair/2026-11-14/briefs/BRIEF-UPKEEP-15.md on lane/chair-2026-11-08), kept current
Worked in a scratch worktree on the local branch `u15-own`, pushed by explicit refspec. The tip read back at the start: 8bd8e3078.

### The rulings worked to (the chair's, 2026-11-14, each vetoable by the owner)
- (a) as briefed: the famine fall traced and cured at its cause, never by loosening; the guard widened to made records.
  **11:23 UTC, on my trace:** ACCEPTED AS MEASURED: no score falls; the exact toll is equal in both fixtures; the red is
  the whole-point rounding of two differences after the hundredths change. The equality arm re-keyed BY IDENTITY to the
  famine's own toll on the parts, EXACTLY equal; the "at most" arms kept; a plant reds it (not committed); ONE ARM ADDED:
  every PRINTED score with the divine added is at least the printed score without it; the made records assert the law on
  printed scores as well as exact ones.
- (b) "a healthy economy ... meaningfully higher": trace first; if the people's bound, re-key by identity to a place it
  does not bind and add an arm stating the bound's own case; else a finding. **12:01 UTC, on my finding:** ACCEPTED AS
  TRACED: the cause is the off-ladder rule, not the bound. The fixture's identity is "a market house that counts at
  today's points": re-keyed BY IDENTITY to a market house the catalogue reads at factor 1, the threshold unchanged; ONE
  ARM ADDED keeping the Fish market and stating its own case as measured; a plant (the market's factor equal in both
  economies) reds both arms, not committed.
- (c) magicCountOnce: a larger rung of a named two-job house is the same house (re-key by identity) if the single
  "Monastery or friary" is already named; else STOP with the table. **12:07 UTC, on my second cause:** the classifier
  re-keyed BY IDENTITY to what the cap is (the traditions' counted monster points at the cap; the total asserted); the old
  proxy goes; plants (i) and (ii). **12:16 UTC, on my stop (it corrects 12:07's "both sides"):** the cap is at work where
  the counted points stand at the cap on AT LEAST ONE side of the drop; at the cap on both, the total equal; on one side
  only, the cap with the house and no greater without it; under the cap on both, a second part moving is red; plant (iii).
  FOR THE READER (the chair's line): under the shared cap, taking one tradition's house away can raise another
  tradition's share while the score stands: the law is on scores, and it holds (the total; the printed score).
- (d) the two base goldens stay RED AND NAMED; no golden's door in its writing mode.

### Item (a): done
| commit | cause | births moved |
|---|---|---|
| c1f436213 | the guard widened: `tests/generators/defenceMonotoneMade.test.js`, made records (6 tiers at their people; no crisis or each of the crisis table's 15; three rosters; 8 dial pairs; with and without stores; each of 8 reliefs added to a place holding none, one, two, all but one): 1,105,920 changes | none (test only) |
| 5605b1047 | defenseEconomicGate's famine arm re-keyed to the famine's toll on the parts (-78 and -78); the printed-scores arm added; the plant (divine supply cap 12 -> 4) reds it ("-70 to be -78") | none (test only) |
| 51c4c5033 | `defenceExactOf` (a reader, no figure moves); the made records assert the exact scores at hundredths as well as the printed | none |
- THE TRACE (EXECUTED): adding the divine lowers no score (economic fed 59.6 -> 76.4, starving 32.27 -> 49.07). The famine's
  crisis points are identical (sup 8, mil 5, int 20, mon 4, all taken); its exact economic toll is 27.33 in both (limit 1
  holds the stores to the force, and the famine takes the same 27.33 from the force). 60 - 32 = 28 against 76 - 49 = 27 is
  rounding. NO ARITHMETIC CHANGE: the births it moves: none (the file of seeds is empty, so none is written).
- THE WIDENED GUARD (EXECUTED): at b42be5de9, 279,136 printed score-falls (teleport circle and alchemists on the economic
  score, the granary on the magical, under every crisis); at the build's tip 0 printed, 0 exact at hundredths (raw floats:
  7,707 differences, each at most 1.4e-14). It runs about 5 minutes on one worker.
- NOTED: `tests/lint/sovereigntyLightingContract.walker.test.js` was already red at 8bd8e3078 (the estate's file count
  3,275 against 3,274: UPKEEP-13's guard file); my new file moves it again. Re-taken once through its ritual at the
  declaration, on the clean committed tree.

### Items (b), (c), the kin, the merge and section 2m: done
| commit | cause | births moved |
|---|---|---|
| fc328fccd | (b): the off-ladder rule (P3, bb0aaa3fe) places the fixture's Fish market at the market's least rung (0.8): margin 76/60 -> 74/59. Re-keyed to "Merchant guilds (15-40)" (rung 2 of 3, factor 1; the city's shelf: no market house of the town's shelf reads factor 1, each 0.8 or 0.93), 76/60, threshold unchanged; the Fish market's arm as measured (market 2 and 1.2, supply 74 and 59); the plant (market unpaid) reds both | none |
| cee724f01 | (c) first cause: X5 (1f6cc23d0) gives the monastery's ladder the clergy's names: "Multiple monasteries" and "Major monasteries (5-10)" named beside the Monastery or friary among the two-job houses | none |
| 9b7ef036b | (c) second cause: the cap classed by what it is, its total asserted by case; `defenceExactOf(...).traditionsMonster`; plants (i), (ii), (iii) red | none |
| 007cb1c0a | merge of the defence lane's tip 9d48785a1 (no conflict; no arithmetic file on the lane's side) | the lane's own |
| af0c4f6e1 | 2m, presumed things: P4's reason row said "the military" (the armedForce atom's word); reworded "a place's military score" (a weight's reason, read by no page) | none |
| 90cc017e0 | 2m, fact layers: X2's line tested part ids with literals ("arcane"); read through `TRADITION_PARTS`, as `ARMED` is. ARITHMETIC FILE, NO FIGURE: the same predicate; both guards 0, the grid 0 rises | none |
- THE KIN at fc328fccd (29 test files run, 608 tests): 4 red: the two BASE GOLDENS (generatorGoldenMaster "every config
  produces byte-identical output"; espionageDormancyFence "THE DRIVEN GOLDEN: 360 settlements"), RED AND NAMED, not this
  seat's door (ruling (d)); and the two (c) rows, since cured at 9b7ef036b.
- SECTION 2m'S CHECKS after the merge, each classed against the lane's tip 9d48785a1 run the same way (EXECUTED): presumed
  things exit 1, the lane's 28 fresh hits and one strip, equal to its tip's line for line (the build's one, cured above);
  fact layers exit 1, the lane's 5 rises and 14 falls (the 14 falls are register rows for the generator's old code, the
  lane's to shrink), equal to its tip's (the build's one rise, cured above); observed shapes exit 1 and writer reach exit 1,
  each identical to the lane's tip (stale rows and stale bank members: the lane's; their doors' writing forms need a clean
  committed tree and the writer-reach door is NOT written: the chair banks it at the close). NOT MINE: FOR THE JOIN.

### The final measure (EXECUTED; base: the defence lane's tip 9d48785a1 as merged; tip: this branch)
Births by the measure's `born.mjs` (given a `NOREC` switch and hashes of the persons, ties and quarrels), at
detached trees of 9d48785a1 and of 4204409ec, over the measure's corpus (3,756) and the reader's 972 (the census's
720 = the 972 less rv5).
| | the 3,756 | the census 720 | the 972 |
|---|---|---|---|
| readiness moved | 1,214 (249 up, 965 down) | 208 (21 up, 187 down) | 281 (45 up, 236 down) |
| readiness bands moved | 153: thorp 70, town 56, hamlet 13, city 9, village 4, metropolis 1 | 31: town 15, thorp 11, hamlet 5 | 39 |
| band moves | Lightly Defended -> Vulnerable 96; Defensible -> Lightly Defended 24; Well-Defended -> Defensible 12; Vulnerable -> Undefended 7; Lightly Defended -> Defensible 4; Well-Defended -> Fortress 4; Defensible -> Well-Defended 2; Fortress -> Well-Defended 2; Vulnerable -> Lightly Defended 2 | LD -> V 22; D -> LD 4; WD -> D 3; LD -> D 1; V -> LD 1 | |
| the five scores' bands | 889 (military 380, economic 205, magical 196, internal 78, monster 30) | 166 (military 72, economic 40, magical 37, internal 11, monster 6) | 211 |
| powers re-drawn | 94 | 21 | 27 |
| persons / ties / quarrels re-drawn | 4 / 2 / 0 | 1 / 0 / 0 | 1 / 0 / 0 |
| AI threats re-drawn | 176 | 39 | 48 |
EVERY FIGURE EQUALS UPKEEP-13's ALL against its merged tip: no commit of UPKEEP-15 and not the merge moves a rating.
The guard 0 on the 972; the made records 0 on 1,105,920 (printed and exact). The people's limit holds the war score
of 425 thorps and hamlets of the 3,756 at their people.

### The declaration
- THE FIELD DIFF BY FAMILY on the 720 (records at both trees): `defenseProfile` 413 births (scores 277, readiness 208,
  `institutions` 162: UPKEEP-13's declared magicDef row); `powerStructure` 21 (`publicLegitimacy` 21, factions 2, their
  relationships 2); `simulationTrace` 19; `activeConditions` 12; `economicState.safetyProfile` 2; `npcs` 1; `stress` and
  `stressors` (cast) 1. EVERY non-defence family moves ONLY on births whose defence scores or readiness moved (EXECUTED):
  each is a reader of defence; no other family moves. No draw is added or moved.
- THE TUNING INVENTORY by its ritual: one row, the people's measure. The register gained its unit (982eec996:
  `people.milPerHead: multiplier`, as C1's 94c5d408f gave houseScale its units); the inventory refrozen at 982eec996
  (5f3557110: DEFENCE_TUNING keys 33 -> 34; 280 tables, 539 named, 6,879 bare); the plain run 76 passed. Draft, the
  owner's to sign.
- THE LIGHTING CENSUS re-taken by its ritual (4204409ec: files 3,274 -> 3,279; titles 29,533 -> 29,541); plain run 34 passed.
- SECTION 2m's DOORS, each exit (check forms; shrink forms only where a door would accept one):
  presumed things exit 1 = the lane's tip (28 fresh, one strip: the lane's), no stale row of mine to shrink;
  fact layers exit 1 = the lane's tip (5 rises: the lane's; so `--shrink` is refused there, and its 14 falls wait for
  the lane); observed shapes exit 1 = the lane's tip (stale rows, the lane's); writer reach exit 1 = the lane's tip
  (stale bank members: NOT written, the chair banks the door once, at the close); the twelve-birth grid 0 rises;
  THE PAGE CENSUS over the 720 (`node scripts/census/page-census.mjs`): see the row below.
  THE PAGE CENSUS over the 720, run at BOTH trees (EXECUTED): exit 1 at both. At the lane's tip 9d48785a1 it ROSE on P4
  (96 banked, 98 now: '"three powers stand almost level" beside a leader far ahead') and NEW1 (11 banked, 12 now); at this
  branch's tip only P4 rises (98), and NEW1 reads 11. Every other row is equal at the two trees. So P4's rise is THE
  LANE'S (it stands at its tip), NOT this branch's; the build lowers NEW1 by one against the lane. No `--shrink` is run
  (the door refuses while P4 stands risen). NAMED FOR THE JOIN: P4 at the lane's tip, the lane's to cure.
- THE GOLDEN SURFACES as files (the kin run at fc328fccd): `tests/property/generatorGoldenMaster.test.js` ("every
  config produces byte-identical output") and `tests/property/espionageDormancyFence.test.js` ("THE DRIVEN GOLDEN:
  360 settlements") are RED: MOVED by the build (a declared move: the defence family and its readers, the table
  above); red at the merged base b42be5de9 already (UPKEEP-13). Their doors' writing modes are NOT run (ruling (d)):
  for one draft shift record, the signer's.

### The statement (UPKEEP-15)
THE LAW HOLDS: adding a house, or raising a house a rung, lowers no score and no readiness, on the reader's 972 births
(the guard) and on 1,105,920 made changes (every crisis beside every relief, printed and exact). The one fall the brief
named was NOT a fall (the chair's ruling (a)); the four other reds are traced and re-keyed by identity under the chair's
rulings (b) and (c); the two goldens stay RED AND NAMED (d). After 8bd8e3078 ONE commit touches the arithmetic file and
it moves no figure (90cc017e0, the Set of part ids; and 51c4c5033 / 9b7ef036b add readers only): THE BIRTHS IT MOVES:
NONE, on the 3,756 and the 972 (the final measure equals UPKEEP-13's figures to the birth count).
- Reds standing at this tip: the two goldens (d); and, the lane's own, equal at its tip: presumed things (28 fresh, one
  strip), fact layers (5 rises), observed shapes, writer reach, the page census's P4.
- THE LINES THAT NEWLY PRINT BECAUSE A BAND MOVED are THE READER'S to list (the 31 band moves and 166 score-band moves
  of the 720 are the population): not listed here.
- NAMED, NOT BUILT: as UPKEEP-13 named them (P3's cross-ladder order; P4's own word, PARKED; P5's lines, the display
  seat's; the 13 criminal houses and six renames, outside the law by ruling).
- WHAT IS LEFT: the reader's read of the build; the merge of this branch into the lane (a later seat, after the reader);
  the writer-reach door (the chair, at the close); the goldens' signing and the tuning row's signature (the owner's).
- Instruments (outside every tree; re-made from the measure's probes): `born.mjs` + NOREC and hashes of npcs,
  relationships and conflicts; the summaries compared birth by birth; the eight towns by a probe that births each seed
  at both trees and prints its scores, bands and parts (`defencePartsOf`); `dims`-style per-part dims by a debugging copy
  of the generator exporting `computeDefenseScores`, removed after.

### HANDED BACK, COMPLETE (the chair, 13:24 UTC): the tip 0ca0bbe94
The chair's ruling of 13:24 UTC (vetoable by the owner): the rebuild lands on the joined line AS A POINT OF ITS OWN, by
the merge seat, straight from this branch at 0ca0bbe94 (not through the defence lane); the writer-reach door and the
signatures are the close's, once, on the final tree; the page census's P4 rise at the lane's own tip is the lane's seat's
to trace; a short reader for this stage is seated. WHAT IS LEFT, none of it this seat's: that reader's read; the merge
seat's landing of 0ca0bbe94; the writer-reach door and the signatures at the close; P4 at the lane's tip.
