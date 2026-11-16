# BAR4-RECORD · hand-back (kept current in every push)

Seat: BAR4-RECORD, the ninth builder seat of round BAR4 (seated on BAR4-SERVICES's K6 finding). Base: `c4ac1ef84a` (the
joined line's tip, the same tree as `a71788851f`). Branch: `lane/bar4-record-2026-11-16`. The second tree of my books is
`c4ac1ef84a`.

## THE KINDS

| kind | detector | 720 before → after | fresh 300 before → after | named exclusions | guard and positive control |
|---|---|---|---|---|---|
| R1 · the house short of its input that the page still counts | `tests/helpers/houseInputSplit.js :: houseInputSplits` (record `resourceAnalysis.gaps[]` kind `missing` against the page's own gap reader `resourceGapLines`) | 67 rows in 64 towns → 0 | 17 rows in 16 towns → 0 | none | `tests/generators/bar4RecordHouseInput.test.js`: zero in the 64 towns where it fired; POSITIVE CONTROL a planted `missing` row for a caravanserai on a connected road (r2r-hamlet-14) must fire |

## The measure before (K2, sent to the chair 08:0x UTC)

By house and by which field was false (a: input really at hand, `gaps[]` false; b: input really absent, the page's
reader false), 720 / fresh 300:
- (a) caravanserai on a connected road, no siege: 15 / 6; charcoal burner by a raw timber import ("Shipbuilding timber"): 6 / 0;
  fishmonger by the food record's fish: 3 / 0 (two of the three rest on a food ledger that names a spent river_fish:
  BAR4-CORPUS-ECO's, named below).
- (b) charcoal burner 33 / 4 and sawmill 6 / 5 answered by the grove's "Sacred wood" EXPORT or a worked import ("Carved wood
  and amber", "timber fittings"); sawmill by its own "Milled lumber" 2 / 0; smelter by "Iron fittings and arrowheads" /
  "Gold and silver work" 1 / 1; a BESIEGED caravanserai answered by the cut road 1 / 1.

## Batch 1 · ONE reading of "this house's input is at hand"

THE CURE: a new fact module `src/domain/facts/houseInputAtHand.js :: houseInputAtHand(record, chainKey, house)` →
`'local' | 'route' | 'imported' | 'missing'`, called by BOTH the gap's writer (`resourceGenerator.js :: supplyOfInput`,
`evaluateInstitutionChain`) and the page's reader (`validationOnPage.js :: inputAnswered`). Its reading:
- local: a LIVE native resource (key or commodities) names the input; or the town's production names the RAW good itself;
  or a local producer house of the roster (the table moved from the generator: one home);
- route: a connected route, no siege, and the input comes by any route (grapes, glass sand, camels) or the house's trade
  IS the route (market/transport tags);
- imported: an import names the raw good by its own name (bracket struck, plural read singular, the chain's terrain
  synonyms: "Precious metals" for gold/silver ore), and NOT a worked good; or the food record names the source or
  imports the staple;
- A HOUSE'S OWN OUTPUT NEVER ANSWERS ITS INPUT, nor an unrelated good: no export answers an input.
The page's chain-input table (`CHAIN_INPUTS`) and the generator's terrain synonyms moved into the module (one home each);
`resourceGenerator.js` re-exports `terrainSynonymsFor`.

THE DECLARED MOVE (record field diff by family, base `c4ac1ef84a` → tip): ONLY `resourceAnalysis.gaps`, in 41 towns of the
720 and 11 of the fresh 300. No economy field moves (production, exports, income, chains, bands: unchanged).

THE PAGE (gap lines, each tree's own reader): 720: +33 "No timber reaches the charcoal burner.", +8 "No timber reaches the
sawmill.", +1 "No iron ore, copper ore or gold or silver ore reaches the smelter." (r2r-city-17), +1 "No camels reach the
caravanserai." (r2s-under_siege-town-1, besieged); NONE LOST. Fresh 300: +4, +5, +1, +1 of the same. The row's mark follows
the line by the rule that already ties them (read town bar0-village-famine-rand-21, row C46104: "Lumber milling (short)" and
"Short of timber." now on each tab).

Tests re-keyed by identity (dated notes in the files): `tests/components/readerValidationOnPage.test.js` (ruling 3's plural
now read on an import; soak1k-22's stored vintner row predates M-V: the true gap it now anchors on is the clay).

WHAT ELSE READS `resourceAnalysis.gaps` (the chair's question): (1) the page's gap lines, web tab and PDF alike
(`resourceGapLines`; the PDF's `structuralGaps`); (2) the shortage marks, through that same line
(`crisisStoppedRow.js :: housesShortOfInput`); (3) the staff panel's raw rows, elevated viewers only (`staffValidationRows`);
(4) the analysis's own export-potential rows (`evaluateInstitutionDeps`); (5) the rename and edit registers (paths only).
NO viability score, critical-issue count, verdict sentence or hook reads it, and the record diff confirms it: in the 41
towns (and the 60 reference rows) `economicViability`, `structuralViolations` and every other field are unchanged.

## Batch 2 · a sawn good is made only where the sawmill has its timber (the chair's grant, 08:19 UTC)

THE CURE: `computeActiveChains.js` (granted for this gate alone; the file is at its 800-line ceiling, so the change adds no
line): the output gate of 'Milled timber' and 'Milled lumber' (`CHAIN_OUTPUT_INST_GATES`), in the export step and in the
made list (`outputMadeHere`), also asks `houseInputAtHand.js :: sawnGoodFed`: some sawmill of the roster has its timber by
the one reading, asked at the economy's own hour over the live resources and the roster (the imports are not drawn yet:
a sawmill fed only by an import would make no sawn good; no town of either population is in that case).

THE DECLARED MOVE (batch 1's tip → batch 2, the 720): `economicState.localProduction` loses "Milled lumber" in 19 towns;
`economicState.primaryExports` loses it in 4 (r2r-village-42, r2r-village-52, r2s-recently_betrayed-town-1,
r2s-insurgency-town-0; in the last two the freed export slot takes "Furs and pelts" / "Caravan trade goods");
`arrivalScene` re-reads the exports in those 4 ("The smell of sawn timber is everywhere in Rossholme" and "Stacks of
seasoning planks line the road in" go; the slot draws another line of its own pool). The fresh 300: localProduction in 3
towns. The read town bar0-village-famine-rand-21: localProduction, exports, arrivalScene. NO PROSPERITY BAND, NO FOOD BAND,
NO INCOME SHARE AND NO CHAIN STATE MOVES (the field diff to depth four names only those three fields).
Of the 19+3 towns, 3 of the 720 (r2r-village-42, r2r-village-52, r2s-indebted-village-2) are the sawmills the record calls
short; the other 16 (and the 3 fresh) are a "Sawmill (commercial)" with no timber that the gap writer never asks (below).

THE DETECTOR'S OUTPUT ARM (`houseInputSplit.js :: OUTPUTS`): a house the record calls short whose output the town still
makes or sells: 3 towns of the 720 and the read town at batch 1's tip → 0; fresh 0 → 0. Its positive control: a short
sawmill (r2r-village-4) planted with a "Milled lumber" export fires.

FOUND, NOT CURED (a question to the chair): the gap writer asks a house only by the chain's exact house name
(`chain.processingInstitutions.includes(institution.name)`), so a ladder rung ("Sawmill (commercial)") is never called short:
in 16 towns of the 720 such a sawmill has no timber, now makes nothing, and prints no gap line and no mark (silence, not two
values; its "Lumber milling" row stands bare, the R1 kind by another door).

## Every new or changed line (THE VETO LIST)

No sentence is new or reworded: the gap lines are the designed ones (`resourceGapLines`), now printed where the record
says the house is short. Read in: "No timber reaches the charcoal burner." r2r-hamlet-9 (hamlet), r2r-metropolis-2
(metropolis), r2s-under_siege-metropolis-1 (siege); "No timber reaches the sawmill." r2r-village-4, r2s-indebted-village-2,
bar0-village-famine-rand-21 (famine); "No camels reach the caravanserai." r2s-under_siege-town-1, bar0-hamlet-under_siege-rand-113.

## Named for others (one line to the chair each)

- THE ECONOMY PART: GRANTED and CURED in batch 2 (below). Was: the river_milling chain still made and exported "Milled lumber" beside "No timber reaches
  the sawmill." (3 towns of the 720, 0 fresh, and the read town): the line I would change is
  `src/generators/computeActiveChains.js:727-728` (`CHAIN_OUTPUT_INST_GATES` 'Milled timber'/'Milled lumber'): the gate also
  asks `houseInputAtHand` of the sawmill. Awaiting the chair's word.
- BAR4-SCENES: its sawn-timber gate reads timber at hand by its own reading; AFTER THE JOIN it should call `houseInputAtHand` (the chair, 08:19).
- BAR4-CORPUS-ECO: the food ledger names `fish` as a source where `river_fish` is depleted (r2s-indebted-village-2): the
  fishmonger reads the ledger and is called fed.
- `tradeListDisplay.js :: needMetBy` (no seat's): the fact cannot import it (it rides a lazy chunk the eager engine core may
  not reach); the fact's worked-good words mirror its `WORKED_GOOD` plus "work"/"carved": one home once that matcher has a leaf.

## THE BOOKS MY CURES MOVE

| test | arm | old → new | door | batch |
|---|---|---|---|---|
| `tests/lint/presumedThings.walker.test.js` | ARM 1 "every source literal that names a thing declares it, or has its row" | ONE fresh hit: the chain-input table's `mineralHot` row (`raw: 'mineral hot springs'`, resource hot_springs_mineral) MOVED, text unchanged, from `src/domain/display/validationOnPage.js` to `src/domain/facts/houseInputAtHand.js`; its stale row left by the door's `--shrink` in the cure's own commit (amendment 3); the line is the chain table's name for the input, true wherever the gap line prints it | the register's door (the close) | 1 |
| `tests/lint/tradeListWriters.walker.test.js` | "every row is live" | the row `src/generators/resourceGenerator.js: COPIES 1` is stale (the analysis's copy of `localProduction`/`primaryImports` is gone: the fact reads the record) | the register's own row (the close) | 1 |

Reference configurations moved (of the 525, against `c4ac1ef84a`, each record generated at both trees and compared): 60,
every one a desert-road row (hamlet to metropolis, every culture: the caravanserai the road now feeds), and in ONE field
family only: `resourceAnalysis.gaps`. `tests/property/generatorGoldenMaster.test.js` is green at the base and red at my
tip on those 60 (expected; the reference is not mine to re-take).

## Registrations owed

- manifest entry owed: `tests/generators/bar4RecordHouseInput.test.js` (kills: a gap writer or a page reader that reads the
  house's input another way: the split reappears in the 64 towns).
- roster row owed: `src/domain/facts/houseInputAtHand.js` imports `RESOURCE_DATA` (`data/goods/identity.js`) and
  `RESOURCE_CHAINS` (`data/goods/chains.js`).

## Left, in order

1. The chair's word on the ladder rungs the gap writer never asks ("Sawmill (commercial)", batch 2).
2. The inventory diff of the census at my tip (720) and the 525 reference count; the final net (amendment 2) with its build.

## How the instruments are re-made

`git archive` of `docs/chair/2026-11-14/probes/READ-ALL` (chair's lane) and `.../CENSUS-3` (census lane) to the scratch
directory. Births: `TREE=<tree> OUT=<dir> SEEDS=<seeds> node CENSUS-3/births.mjs` (the 720: `CENSUS-3/seeds.txt`; fresh:
`READ-ALL/packets11/seeds.fresh300.txt`; read towns: `packets10/seeds.bar4.txt`). My measures over `corpus.ndjson.gz`, each
`TREE=<tree> CORPUS=<corpus> node <script>`: `r1.mjs` (every `missing` house, printed or split, and which source of the
page's reader answered it), `classify.mjs` (a / b per row), `redbase.mjs` (the detector helper's count), `rdiff.mjs`
(`A=<corpus> B=<corpus> TA=<tree> TB=<tree>`: the record field diff by family and the gap lines gone and come, each tree's
own reader). A read town's page: `census3.sh <tree> <out> 1 --seeds <one seed> --count-only`, then the dump.
