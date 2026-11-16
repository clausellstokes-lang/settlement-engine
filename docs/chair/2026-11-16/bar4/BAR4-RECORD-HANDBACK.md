# BAR4-RECORD · hand-back (kept current in every push)

Seat: BAR4-RECORD, the ninth builder seat of round BAR4 (seated on BAR4-SERVICES's K6 finding). Base: `c4ac1ef84a` (the
joined line's tip, the same tree as `a71788851f`). Branch: `lane/bar4-record-2026-11-16`. The second tree of my books is
`c4ac1ef84a`.

## THE KINDS

| kind | detector | 720 before → after | fresh 300 before → after | named exclusions | guard and positive control |
|---|---|---|---|---|---|
| R1 · the house short of its input that the page still counts | `tests/helpers/houseInputSplit.js :: houseInputSplits` (record `resourceAnalysis.gaps[]` kind `missing` against the page's own gap reader `resourceGapLines`) | 67 rows in 64 towns → 0 | 17 rows in 16 towns → 0 | none | `tests/generators/bar4RecordHouseInput.test.js`: zero in the 64 towns where it fired; POSITIVE CONTROL a planted `missing` row for a caravanserai on a connected road (r2r-hamlet-14) must fire |
| R1 · its output arm: the short house whose output the town still makes or sells | the same function, `OUTPUTS` (a sawmill's sawn goods in production and exports) | 3 towns (+ the read town) at b7d3da983 → 0 | 0 → 0 | none | the same file: a short sawmill planted with a "Milled lumber" export (r2r-village-4) must fire |
| R1 · its rung arm: a house of a chain's KIND never asked (cured scope: the sawmill) | the same function, `rungHeads` | 81 towns → 0 | 25 towns → 0 | the other kinds' rungs are a MEASURED KIND, not excluded as true (ruling R2; `rungHeads: null` reads them: 693 in 323 towns / 256 in 126 at my tip) | the same file: zero in the 81 towns; a commercial sawmill with its gap rows struck (r2r-town-2) must fire |

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

## Batch 3 · the sawmill's ladder rung (the chair's rulings of 09:23 and R2 of 09:27 UTC; vetoable by the owner)

THE DETECTOR FIRST, WIDENED (`houseInputSplit.js`, the RUNG arm): a live native house of a chain's KIND (`houseHead`), not
its spelling, its every input absent by the one reading, no chain on it worked, and no gap line naming it. Read over every
kind it counts 774 instances in 328 towns of the 720 and 281 in 127 of the fresh 300 at b193fa89a: NOT A CURE (ruling R2
(1)): the sawmill alone is cured; the rest are a measured kind (the table below). The arm's cured scope (`rungHeads`,
default `['sawmill']`): 81 towns of the 720 and 25 of the fresh 300 → 0 and 0.

AGAINST BAR4-HOUSES' `timber at hand` (`lane/bar4-houses-2026-11-16`, `src/domain/facts/timberAtHand.js`: the Timber &
Lumber chain working its input), every "Sawmill (commercial)" of both populations:

| this reading (houseInputAtHand) | BAR4-HOUSES' (timberAtHandOf) | 720 | fresh | why they differ, and which is true by the record |
|---|---|---|---|---|
| absent | absent | 81 | 25 | they agree: no timber resource live, no timber chain, no raw timber arriving (r2r-town-2): CURED now |
| at hand | at hand | 57 | 24 | they agree (a working managed forest, mountain or shipbuilding timber) |
| at hand (imported) | absent | 83 | 31 | THE QUESTIONS DIFFER, BOTH TRUE: an arriving import ("Timber", "Shipbuilding timber (local shipbuilding stands cleared)", "Timber (local managed woodland cleared)") reaches the sawmill (it runs on bought timber: its gap row says "imported"), while BAR4-HOUSES asks whether the town has timber OF ITS OWN to supply the region's building work (it has not). For the join: ONE reading of "the sawmill's timber" is this fact's; BAR4-HOUSES' description line asks the narrower "timber of its own", and should read this fact's `'local'` kind (not `'imported'`) if it is to be the same home |
| absent | at hand | 0 | 0 | — |

(BAR4-HOUSES' 11 of the 720 counted only the 19 towns that print its sawmill description's timber line; mine counts every
commercial sawmill: the same answer where both look.)

THE CURE: the gap writer asks a house by its KIND where that kind's rungs are admitted (`houseInputAtHand.js ::
houseRunsChain`, `RUNG_HEADS = ['sawmill']`; `houseHead` moved there, one home), in `evaluateInstitutionChain` and
`reachedByAnotherInput`; the page's reader asks the same chains (`chainsOfHouse`), and the gap line names the house by its
prose name, its rung struck ("No timber reaches the sawmill.", as `proseHouseName` reads a house; no gap line printed a
bracket before).

THE DECLARED MOVE (b193fa89a → batch 3): `resourceAnalysis.gaps` in 163 towns of the 720 (81 commercial sawmills now
`missing` timber, 82 now `imported`: the second print nowhere but the elevated staff panel) and 56 of the fresh 300;
`resourceAnalysis.priorityNotes` in 29 of the 720 and 6 fresh (the staff panel's "Military focus highlights gap: timber
processing is incomplete" now names the sawmill's timber first: printed on no DM surface). NOTHING ELSE: no viability score,
verdict, issue count, prosperity band, food band, income or trade list moves. The page: +81 "No timber reaches the
sawmill." in the 720, +25 fresh, none lost; the row takes its mark on each tab (r2r-town-2: "Lumber milling (short)",
"Short of timber.").

THE RUNGS LEFT, A MEASURED KIND FOR THE NEXT ROUND (ruling R2 (1)): by house, what this reading calls absent, the instances
in the 720, one town where the absence is plain (no resource, import or production of the input by any name), and one
where a reader would hold the input at hand by another name (the evidence in brackets; a hint by words, to be read):

| house (rung) | input the fact reads absent | 720 | plainly absent | at hand by another name |
|---|---|---|---|---|
| Weavers/Textile workers | wool/flax | 146 | r2r-town-8 | r2r-town-14 (Dyed cloth and quality textiles) |
| Butchers (3-8) | livestock | 131 | r2r-town-4 | r2r-town-1 (hunting_grounds; game meat) |
| Dyer | wool | 126 | r2r-village-21 | r2r-town-2 (Incense, ritual oil, sacred texts, and vestment cloth (bulk)) |
| Carpenters (5-15) | timber | 99 | r2r-town-5 | r2r-town-31 (Cordage, tar, timber fittings, and bulk vessel supplies) |
| Tanner (established) | livestock/hides | 59 | r2r-town-6 | r2r-city-46 (Felt and leather goods) |
| Tanners | livestock/hides | 35 | r2r-town-2 | r2s-wartime-city-1 (Felt and leather goods) |
| Blacksmith | iron ore | 21 | r2r-village-4 | r2r-village-0 (precious_metals) |
| Apothecary district | medicinal herbs/water from the hot springs | 18 | r2r-city-2 | r2r-city-8 (Ritual wood and herbs (ancient grove damaged)) |
| Blacksmiths (3-10) | iron ore | 15 | r2r-city-5 | r2r-city-17 (Iron fittings and arrowheads) |
| Carpenter | timber | 14 | r2r-village-9 | r2s-monster_pressure-village-0 (Sandalwood and camphor) |
| Carpenter (part-time) | timber | 13 | r2r-hamlet-3 | — |
| Apothecary (established) | medicinal herbs/water from the hot springs | 10 | r2r-town-18 | r2r-town-14 (Herbs and forage (local gathering areas exhausted)) |
| Alchemist quarter | medicinal herbs/water from the hot springs | 6 | r2s-politically_fractured-metropolis-2 | r2s-succession_void-metropolis-1 (Ritual wood and herbs (ancient grove damaged)) |

Read so: a butcher beside hunting grounds works game (r2r-town-1), an apothecary with "Herbs and forage" arriving has
herbs (r2r-town-14): the reading is too narrow for those kinds (it names the input by one word); weavers and carpenters with
nothing of wool or timber are plainly short. The next round's cure is the READING per kind, then the rungs.

## The inventory diffs (the census's 720, each read whole)

- base → batch 1: no sentence gone; in fewer towns only marks moving to their true form ("ServicesCharcoal supply" 110→80
  as "(short)" 37→67; "Short of coal." 8→5 where a charcoal burner on a spent coal ground is now "Short of timber.", its
  input; "Caravan organization (stopped)" → "(stopped, short)" under the siege); every inheritor is a designed gap line or
  its mark.
- batch 1 → batch 2: no sentence gone; "Milled lumber" 38→34; two arrival lines that presumed sawn timber go ("Stacks of
  seasoning planks…" 11→10, "The smell of sawn timber…" 7→6) and the same slot re-draws in three more towns (the pilgrims,
  the kilns: true lines displaced by the export slot's re-read: named); the inheritors READ in their towns, each true:
  "Hurdles and holding pens…" (r2r-village-52: grazing land, livestock exported), "Laden carts from the workings…"
  (r2s-recently_betrayed-town-1: a stone quarry), "Carts of grain rattle toward the mills…" (r2r-village-42: a mill,
  flour exported), "Fresh horses stand saddled…" (r2s-insurgency-town-0: a caravaneer's post); "Furs and pelts (transit)",
  "Caravan trade goods (transit)" fill the freed export slots.
- batch 2 → batch 3: no sentence gone; "ServicesLumber milling" 229→148 as "(short)" 15→96 and "No timber reaches the
  sawmill." 15→96, "Short of timber." 77→122: the commercial sawmills' line and mark. "Patron deity" and its two lines
  716→704 is THE INSTRUMENT: the census was rendered in four slices after a container restart, and each render worker's
  FIRST dossier lacks that block (r2r-thorp-0 lacks it in a whole run too: hence 716 of 720 at every tree); no code of
  mine reads it.

## Every new or changed line (THE VETO LIST)

No sentence is new or reworded: the gap lines are the designed ones (`resourceGapLines`), now printed where the record
says the house is short. Read in: "No timber reaches the charcoal burner." r2r-hamlet-9 (hamlet), r2r-metropolis-2
(metropolis), r2s-under_siege-metropolis-1 (siege); "No timber reaches the sawmill." r2r-village-4, r2s-indebted-village-2,
bar0-village-famine-rand-21 (famine); "No camels reach the caravanserai." r2s-under_siege-town-1, bar0-hamlet-under_siege-rand-113.

Batch 2 moves no sentence but drops "Milled lumber" and the two arrival lines that presumed sawn timber where the sawmill
has none (r2r-village-42, r2r-village-52, bar0-village-famine-rand-21). Batch 3: "No timber reaches the sawmill." now also
names a commercial sawmill (the line's house words strike a rung's bracket, as `proseHouseName` does): read in
r2r-town-2 (town, the smallest size it reaches), r2r-metropolis-2 (metropolis, the largest), r2s-under_siege-city-1 (a
siege), r2s-famine-metropolis-1 (a famine), r2s-occupied-town-3 (an occupation).

## Named for others (one line to the chair each)

- THE ECONOMY PART: GRANTED and CURED in batch 2 (below). Was: the river_milling chain still made and exported "Milled lumber" beside "No timber reaches
  the sawmill." (3 towns of the 720, 0 fresh, and the read town): the line I would change is
  `src/generators/computeActiveChains.js:727-728` (`CHAIN_OUTPUT_INST_GATES` 'Milled timber'/'Milled lumber'): the gate also
  asks `houseInputAtHand` of the sawmill. Awaiting the chair's word.
- BAR4-HOUSES: the commercial sawmill's description reads `timber at hand` (timber of its own); this fact's `'local'` kind
  is the same reading; after the join one home (batch 3's table).
- BAR4-SCENES: its sawn-timber gate reads timber at hand by its own reading; AFTER THE JOIN it should call `houseInputAtHand` (the chair, 08:19).
- BAR4-CORPUS-ECO: the food ledger names `fish` as a source where `river_fish` is depleted (r2s-indebted-village-2): the
  fishmonger reads the ledger and is called fed.
- `tradeListDisplay.js :: needMetBy` (no seat's): the fact cannot import it (it rides a lazy chunk the eager engine core may
  not reach); the fact's worked-good words mirror its `WORKED_GOOD` plus "work"/"carved": one home once that matcher has a leaf.

## THE BOOKS MY CURES MOVE (my final tip against `c4ac1ef84a`, each file run ALONE through `gate-tail.sh`; each red re-run alone at the base, green there)

TWO LAWS MY CURES TURNED, CURED AT THEIR CAUSE (batch 4): `tests/lint/ruinFilterRoster.walker.test.js` (the fact read the raw
`.institutions`: it now reads `liveInstitutions`; the record does not move, 720 re-born and compared); and WEAVE ST-2 in
`tests/build/vendorPdfLazy.test.js` (a module under `src/domain/facts/`, eager by the chunk rule, imported the lazy chains
surface `data/goods/chains.js` and dragged it into first paint, +177 KB: the fact no longer imports the chain table; its
three callers, which already hold it, hand the chain in).

| test | arm | old → new | door | batch |
|---|---|---|---|---|
| `tests/property/generatorGoldenMaster.test.js` | every config byte-identical | 88 of 525 rows drift, all `resourceAnalysis.gaps` | the golden's door (a NEW word of the owner) | 1, 3 |
| `tests/generators/pipelinePinnedMode.test.js` | 3 of 15 ("the golden moved") | golden-derived | the golden's door | 1, 3 |
| `tests/build/engineBundleReplay.test.js`, `engineServiceCore.test.js`, `engineServiceStoreParity.test.js` | the committed edge bundle equals the in-process pipeline | 88 of 525 rows, 110 of 360 fence settlements, 1 of 3 births, 2 of 3 cores, 1 seed + 1 derive differ: the committed `supabase/functions/_shared/engineBundle.js` predates my cures | `npm run build:edge-shared` and commit the bundle (the close) | 1-3 |
| `tests/build/generationWorkerLazy.test.js` | worker bundle ceiling | 2322103 → 2325332 B (+3229: the fact module) | ruling B3: the doors re-record every ceiling once | 1-4 |
| `tests/build/vendorPdfLazy.test.js` | first-paint raw / gzip / Brotli | 1132308 → 1137209 (+4901) / 360756 → 362470 (+1714) / 302830 → 304267 (+1437): the fact is eager by its folder, its home by the brief | ruling B3 | 1-4 |
| `tests/build/vendorPdfLazy.test.js` | the goods roster | `src/domain/facts/houseInputAtHand.js` imports `data/goods/identity.js` (`RESOURCE_DATA`) with no row in `src/domain/goods.schema.js` | roster row owed (the close) | 1 |
| `tests/lint/mutationCoverageManifest.test.js` | every generators test has an entry | `tests/generators/bar4RecordHouseInput.test.js` | manifest entry owed (the close) | 1 |
| `tests/lint/presumedThings.walker.test.js` | ARM 1 | ONE fresh hit: the chain-input table's `mineralHot` line (`'mineral hot springs'`) MOVED, text unchanged, from `validationOnPage.js` to the fact; its stale row out by `--shrink` (amendment 3) | the register's door | 1 |
| `tests/lint/observedShapeReaders.walker.test.js` | the erasure guard | the frozen row `src/generators/resourceGenerator.js / test on institution` (the local producers' `rule.institution.test`) MOVED with its table to the fact: not erosion, the read stands in its new home; NOT re-frozen | the register's door | 1 |
| `tests/lint/writerReach.walker.test.js` | the surfaceReach round trip; the lit arm's corpus digest | "food on breakdown" reach row; the walker corpus digest (my declared record move) | WR1: named, never hidden (the close) | 1-3 |
| `tests/lint/proseWiringCensus.walker.test.js` | the committed census is current | `docs/content/wiring-census.json` stale-bytes | amendment 4: the close re-takes it once | 1-3 |
| `tests/lint/tradeListWriters.walker.test.js` | every row is live | `src/generators/resourceGenerator.js: COPIES 1` stale (the copy of `localProduction`/`primaryImports` is gone) | the register (the close) | 1 |

GREEN at my tip, each alone: the other law suites (rosterDuplicateDraws, hookThemeDraws, upkeepVocation, generationForkCensus,
factLayers, layerBoundaries, defenceFactReaders, noLegacyFactionReaders, siteCoherenceRatchet, proseComposed,
proseEntryContradiction, engineCoreLazyEdge, tuningRegister, chainPrintSites) and BRIEF-BAR4 amendment 2's ten
(customContentPresentationClaims, regenDerivedState, styleLaw, deepCraftKillList, economicStructure, proseCorpusBytes,
stressSecretDeclared, tieProseDeclared, defensePostureAgainstItsFacts, corpusEcoTailGuards), the fork register's contract,
my guard and the files that pin what I changed, the strict-domain gate, the type ratchet, the twelve-birth grid. ONE
`npm run build` (green) and `npm run verify:dist`: it refuses on the five build files above alone (stored artifacts,
ceilings, the owed roster row); `dist/` removed.

## Registrations owed

- manifest entry owed: `tests/generators/bar4RecordHouseInput.test.js` (kills: a gap writer or a page reader that reads the
  house's input another way: the split reappears in the 64 towns).
- roster row owed: `src/domain/facts/houseInputAtHand.js` imports `RESOURCE_DATA` (`data/goods/identity.js`) and
  `RESOURCE_CHAINS` (`data/goods/chains.js`).

## Left, in order

1. THE RUNGS OF THE OTHER KINDS (batch 3's table): the reading per kind first (game for a butcher, herbs by any name), then
   the rungs, measured by the RUNG arm with `rungHeads: null`.
2. The close's doors for THE BOOKS above (nothing of mine is left to run).

## How the instruments are re-made

`git archive` of `docs/chair/2026-11-14/probes/READ-ALL` (chair's lane) and `.../CENSUS-3` (census lane) to the scratch
directory. Births: `TREE=<tree> OUT=<dir> SEEDS=<seeds> node CENSUS-3/births.mjs` (the 720: `CENSUS-3/seeds.txt`; fresh:
`READ-ALL/packets11/seeds.fresh300.txt`; read towns: `packets10/seeds.bar4.txt`). My measures over `corpus.ndjson.gz`, each
`TREE=<tree> CORPUS=<corpus> node <script>`: `r1.mjs` (every `missing` house, printed or split, and which source of the
page's reader answered it), `classify.mjs` (a / b per row), `redbase.mjs` (the detector helper's count), `rdiff.mjs`
(`A=<corpus> B=<corpus> TA=<tree> TB=<tree>`: the record field diff by family and the gap lines gone and come, each tree's
own reader). A read town's page: `census3.sh <tree> <out> 1 --seeds <one seed> --count-only`, then the dump.
