# BIRTH-AUDIT · the houses a town is born with and no supply for · HAND-BACK

Seat BIRTH-AUDIT (BRIEF-BIRTH-AUDIT, the chair's lane at `docs/chair/2026-11-14/briefs/`). Base: the joined line
`lane/join-2026-11-14` at **cfc2b680a** (the tip the prompt named; no later tip used). Branch `lane/birth-audit-2026-11-17`.
Read-only: nothing under `src/` or `tests/` is changed on any pushed commit; the prototype is `PROTOTYPE.patch` beside this file.
Nothing merged.

**How every figure was made.** Births: PAGE-COPY's `births.mjs` (the chair's lane, `docs/chair/2026-11-16/probes/PAGE-COPY/`,
its `seedcfg.mjs` configurations) for the census's 720 (`seeds.txt`), the wide read's 150 (`bar0-<shape>-rand-27..41`, the
ten shapes of BRIEF-BAR6 B2) and the fresh 300 (`seeds.fresh300.txt`); the 525 reference configurations by
`probes/birthsRef.mjs` (born as the golden master births them, as `AUDIT/ref525-F.mjs` does). Prototype births: the same
scripts in a scratch tree with `PROTOTYPE.patch` applied and the rule chosen by the environment (`BIRTH_RULE`), driven by
`probes/births-all.sh`. Every run below was seen to end with exit 0 (the logs' `EXIT 0`; the gate-tail runs' own exit).
The counts are records read by the tree's own functions (`housesShortOf`, `resourceGapLines`, `importsAsPrinted`): a line
"printable" here is one those functions give the page; no tab was rendered (budget), so a line the page draws only at
render is not counted. The fresh 300 is counted at the base only; the rules are counted over the 720, the 150 and the 525.

| probe (`docs/chair/2026-11-17/birth/probes/`) | what it counts | output (`out/`) |
|---|---|---|
| `q1census.mjs` + `q1tables.mjs` + `q1bykind.mjs` | Q1: every marked house, its cause | `q1.base.json.gz`, `q1.tables.base.md`, `q1.bykind.base.md` |
| `kinds.mjs` + `q2table.mjs` | Q2: the kind of each house | `q2.table.md` |
| `q2land.mjs` | the land under each source house | `q2land.base.txt`, `q2land.base.json.gz` |
| `q4rules.mjs` | a rule's marks, born-short in calm connected towns, printable lines new and gone | `q4.<rule>.json` |
| `q4needed.mjs` | R1's page: a lifted house beside "Needed, and not brought in" | `q4needed.<rule>.720.txt` |
| `q4r4.mjs` | R4: a source house on its own spent ground, what else the record says | `q4r4.base.md` |
| `q4roster.mjs` | R3: houses lost and gained | (in this text) |
| `fieldDiff.mjs` | towns and stored field families moved, people/ties/names/roster | `diffs.summary.json` |

Commands, from the repository root at cfc2b680a with `node_modules` (each as run; `<r>` a births directory):
`OUT=out.json node …/q1census.mjs 720=<r>/base-720/corpus.ndjson.gz 150=… 300=…` ·
`BASE=<base tree> TIP=<prototype tree> BIRTH_RULE=<rule> node …/q4rules.mjs 720=<base>,<rule> 150=<base>,<rule>` ·
`node …/fieldDiff.mjs <base corpus> <rule corpus>` · `sh …/births-all.sh <tree> <out> <page-copy dir> <label>=<rule> …`.

---

## Q1 · THE CENSUS OF THE SHORT HOUSES (base cfc2b680a)

Every house `housesShortOf` marks, with its catalogue id, its good, the reading that marked it ((i) a gap of the record,
(ii) a spent ground, (iii) a trade's good, the war's iron hook), the tier, the crises and the route's state, row by row in
`out/q1.base.json.gz` (3,236 rows); the tables by house in `out/q1.tables.base.md`. CAUSE: the same record read again
with every crisis taken away AT THE READING (`config.stressTypes` and the stress container emptied); still marked = BORN
SHORT. (The birth is not re-drawn: what a crisis made the birth write stays written.)

| population | towns | with a marked house | with a born-short house | houses marked | born short | made by the crisis | calm (no crisis) + connected road | **of them with a born-short house** |
|---|---|---|---|---|---|---|---|---|
| the 720 | 720 | 464 | 464 | 2,066 | 2,058 | 8 | 225 | **151** (144 leaving out marks on a spent ground) |
| the 150 | 150 | 103 | 103 | 381 | 371 | 10 | 64 | **40** (38) |
| the fresh 300 | 300 | 196 | 195 | 789 | 767 | 22 | 136 | **81** (76) |

THE HEADLINE: **in 151 of the census's 720 towns with no crisis and a connected road a born-short house stands (464 towns in
all)**; 40 of the 150; 81 of the fresh 300. Only 8 of the 720's 2,066 marks are the crisis's own, every one under a siege (6 glassmakers, a caravanserai and a vintner, whose goods the road would bring; the 150: 10, 8 of them glassmakers). The birth makes the rest.

BY KIND OF HOUSE (Q2's kinds; `out/q1.bykind.base.md`), the 720, houses · towns:

| kind | no source and no import (a gap, or the trade's good) | on a spent ground | of all, born short in calm connected towns |
|---|---|---|---|
| (i) buys and works | 1,522 · 412 | 169 · 91 | 529 + 56 houses · 136 + 37 towns |
| (ii) is the source | 179 · 151 | 60 · 60 | 54 + 18 · 47 + 18 |
| (iii) other | 3 · 3 | 133 · 63 | 0 + 32 · 0 + 16 |

The commonest, the 720 (houses; all born short; in calm connected towns): potter 172 (62), weavers 148 (57), vintner 148
(58), brickmaker 132 (49), cobblers' guild 127 (47), fuller 117 (47), carpenters 99 (29), tanner 95 (36), cooper 94 (27),
commercial sawmill 81 (26), woodcarver 65 (20), charcoal burner 63 + 5 of coal (16), tanners 63 (20), stone quarry 45 (12),
mine 40 (13, all spent ground), dairy farmer 36 (14), fish market 34 (spent), salt works 30 (10). The full table:
`out/q1.tables.base.md`.

WHERE MY COUNT DIFFERS FROM THE CHAIR'S 372, AND WHY. The chair's count (a gap of kind `missing` on the record) is **371 at
cfc2b680a** (372 at afa46d644: the base moved by one town). Every one of the 371 is also in mine: the page's re-reading of
the gap never answers it (0 towns). Mine is 464 = 371 + 93 towns the gap count cannot see: 64 marked only by the trade's
good (BAR6-MARKS's reading (iii): the fuller, the weavers, the cobblers, the smiths, which no chain names so no gap is
written), 17 only by a spent ground, 11 by both, 1 by all three. 150: 80 + 23; 300: 154 + 42.

---

## Q2 · THE KIND OF EACH HOUSE

The table to strike rows from is `out/q2.table.md` (one row an id: its kind, its material, the one-line reason, its marks in
the 720 · 150 · 300); its source is `probes/kinds.mjs`, which the prototype's leaf copies. 86 ids: every id of
`HOUSE_TRADE_INPUT`, every house `RESOURCE_CHAINS` names that has a catalogue id (the guild names the chains list, "Weavers'
guild", "Dyers' guild", "Fulling mill", "Butcher", stand in no catalogue and are read by trade, `FINISHING_TRADES`),
`SPENT_GROUND_WORKERS`, `GROUNDS_WORKED_OFF_CHAIN`, and every id the three populations saw marked.

THE CASES THAT DECIDE THE RULE, said plainly (the catalogue's own line quoted):

| house | kind | why |
|---|---|---|
| commercial sawmill (and the sawmill) | **(i) buys and works** | "converts raw logs … whenever logs can be had"; logs are floated and carted to a saw |
| potter | **(i)** | "made whenever clay can be had"; "Clay and raw materials" is already a word of the imports list |
| brickmaker | **(i)** | "whenever clay can be had … requires clay and fuel"; clay is carted to the kilns |
| vintner | **(i)** | "from local grapes or imported must": it presses what reaches the cellar |
| charcoal burner | **(ii) is the source** | "operates kilns in nearby woodland": the burner works in the wood (managed forest, mountain timber, shipbuilding timber) |
| dairy farmer | **(ii)** | it keeps the herd it milks: grazing land, alpine pasture, a fertile floodplain, camel herds |
| stone quarry | **(ii)** | "the only source of proper building stone the place has had": on a stone quarry ground |
| salt works | **(ii)** | "evaporates saline brine … where brine lies near": salt flats, desert salt, the fishing grounds (whose commodities hold salt), or a coast (R5) |

The other (ii): the mines, the peat cutter, the fishers' landings, the hunter's lodge, the wildfowler, the shepherd, the
woodcutter's camp. (iii) other: the route houses and markets (their trade IS the route: the reader answers them already),
the stores and walls (granary, citadel, palisade), the right to a neighbour's mill, the commons and the households' plots
(the land itself, every settled place has them), the magic houses and councils the spent-ground reading marks on a chain
they are listed on, the stable and beast services, the midwife, a craft guild of many trades.

THE LAND UNDER THE SOURCE HOUSES (`probes/q2land.mjs`, `out/q2land.base.txt`), the 720, every live house of the kind:

| house | its ground live | all depleted | absent | marked short |
|---|---|---|---|---|
| stone quarry | 39 | 45 | **57** | 45: **every one on its own depleted quarry**; the 57 on no stone are NOT marked |
| charcoal burner | 44 | 34 | 75 | 63 absent (+5 depleted) |
| dairy farmer | 6 | 2 | 34 | 36 |
| salt works | 45 | 8 | 40 (+1 on a coast with no fishing ground) | 24 absent (all on a river), 1 coast, 5 depleted; the 16 absent unmarked are fed by a "Salt" import |

A FINDING THE BRIEF'S PREMISE DID NOT HOLD: no stone quarry is marked for having no stone. The 45 marked quarries all stand on
a quarry ground the record has spent (and 44 of them beside the import "Dressed stone (local quarry depleted)"); the 57 that
stand on no stone at all are silent, because the reader calls the quarry its own producer of stone
(`houseInputAtHand.js :: localProducerSupplies`, the table `LOCAL_PRODUCERS`): a house answers its own input. The same
reading answers 16 salt works on no brine (their "Salt" import, a siege's or famine's necessity, feeds the house that should
make it).

---

## Q3 · THE MAP OF THE CODE

**(a) WHERE A HOUSE IS DRAWN.** The pipeline (`src/generators/steps/index.js`): `resolveConfig` → `buildGenerationContext` →
**`resolveResources`** (the nearby resources and their depletion rolls, `nearbyResourcesDepleted`: drawn FIRST) →
`resolveStress` → `resolveNeighbour` → **`assembleInstitutions`** → `subsumptionPass` → **`cascadePass`** → `isolationPass` →
`stressConfirmPass` → **`generateEconomy`** (imports) → `generatePower` … → `generatePopulation` → **`generateNarratives`**
(the resource analysis and its gaps) → `assembleSettlement` → `resolveCrisisCast`.
- THE MAIN DRAW, `steps/assembleInstitutions.js` (the step body from its `registerStep`): a row `required` (or forced by a
  toggle) is pushed with no draw; every other row passes `rowRoll`: `minTier`, `exclusionConditions`, `tradeRouteRequired` /
  `terrainAccess`, `forbiddenTradeRoutes`, `terrainRequired`, `forbiddenResources`, the row guards (population floor, a
  named prerequisite); then `getBaseChance` (`institutionProbability.js`: the priority sliders by the row's
  `priorityCategory`, the neighbour, the goods toggles) × `getResourceMultiplier` (the resources' `instBoosts` and
  `EXTRACTION_BOOSTS`: a stone quarry ground multiplies a quarry's chance by up to 2.5). **A resource only BOOSTS a house; it
  never gates one.** A row that returns from `rowRoll` takes no draw; a row with a chance takes `rng.chance(p)` (an
  exclusive group one `rng.random()` for the seat).
- THE SECOND DRAW, `cascadeGenerator.js :: applyCascadeInstitutions` (from `cascadePass`): a house the roster's supply chains
  boost (`supplyChainData.js`: a brickmaker boosts the stone quarry, a sawmill the charcoal burner, a weaver the dairy
  farmer, a fish house the salt works) is drawn again at `min(baseChance × boost, 0.45)` with `_rng()`; it reads the route
  and terrain gates, never the resources.
- WHY A SOURCE HOUSE STANDS WHERE THE LAND GIVES NOTHING: neither draw asks the land. The catalogue's rows: stone quarry
  hamlet→metropolis 0.18–0.10, charcoal burner 0.20–0.15, dairy farmer hamlet 0.25 / village 0.22, salt works 0.20 (hamlet,
  no route gate) and village→metropolis 0.12–0.15 with `tradeRouteRequired: ['port','river']`, `terrainAccess:
  ['coastal','riverside']`; none `required`. The resource is drawn BEFORE the house (`resolveResources`), and no later step
  spends it (depletion is the same step's roll). In the 720 the quarries on no stone came 43 from the main draw and 14 from
  the cascade; the salt works on no brine 24 and 16; the dairies 22 and 12; the charcoal burners 72 and 3. THE SALT WORKS
  ON A RIVER: the row's route gate admits a river, which has no brine; its chain is `desertSalt` (raw `desert_salt`), and
  the record still writes it an active chain `salt_flats` of state `entrepot` with no salt flats on the record
  (r2r-hamlet-18, r2r-village-38).

**(b) WHERE THE IMPORTS LIST IS WRITTEN.** `economicState.primaryImports`, at the economy's hour (`generateEconomy` →
`economy/economicState.js`): `economy/primaryTradeLists.js :: buildPrimaryTradeLists` (the trade streams' imports, the
crises' necessities "Grain", "Salt", "Iron (weapons)", "Medicinal herbs"; capped at 10), `computeActiveChains.js ::
deriveImportsFromChains` (an ACTIVE chain's `dependency.resource`, the `UPSTREAM_IMPORT_LABELS` of a chain running without
its upstream: "Iron ore", "Clay and raw materials", "Raw hides and animal products", "Cut stone and masonry" …; the tier's
"Bulk grain and foodstuffs", "Luxury textiles and exotic goods"; capped at 10), the spent ground's shortage imports
(`resourceSemantics.js :: resourceShortageImport`, "Dressed stone (local quarry depleted)"), then `generateEconomy`'s
custom folding and `economyReconcilePass`'s subsumption. **An input joins the list because a house needs it only through a
chain that RUNS** (its dependency or its missing upstream); a house whose chain never activated (a potter with no clay: no
clay chain) adds nothing. The gaps are written later (`generateNarratives` → `resourceGenerator.js ::
generateResourceAnalysis` → `evaluateInstitutionChain`), over the imports already written.

**(c) THE READERS.** `houseInputAtHand(record, chainKey, house, chain)` answers `local` (a live native resource or its
commodity; the made list naming the raw good; a local producer of the roster, `LOCAL_PRODUCERS`), `route` (a connected road
no siege shuts, for an input whose `CHAIN_INPUTS` entry carries `route: true` (grapes, glass sand, camels) and the record's
need list does not name, or for a route house), `imported` (the imports name the raw good by its own name; the food
record), else `missing`. Its callers: AT THE BIRTH `resourceGenerator.js :: supplyOfInput` (the stored gaps:
`resourceAnalysis.gaps[]`, kinds `imported` / `missing`), `computeActiveChains.js :: sawnGoodFed` (the sawn goods), and the
arrival scene (`facts/tradeAtWork.js` reads `housesShortOf` on the record in the making: stored `arrivalScene`); AT PRINT
`display/validationOnPage.js :: resourceGapLines` (the Resources tab's "No clay reaches the potter."; it re-reads the
reader, `inputAnswered`), `display/crisisStoppedRow.js :: housesShortOfInput` (the cards' and rows' "Short of clay.", the
Services title, the chain card head `setsWithMarkedHousesWorse`), `facts/houseInputAtHand.js :: housesShortOf` (the one
fact: `tradeAtWork.js`, `sceneSupply.js`, `halfWayGoods.js`, `factsOf.js`), `facts/timberAtHand.js` (the scene's timber
atoms). The need line "Needed, and not brought in: …" is a different reader: `display/tradeListDisplay.js ::
importsAsPrinted` over the terrain need list (`resourceAnalysis.imports.critical`), met by `needMetBy`. The staff panel
prints the stored gaps verbatim (`validationOnPage.js :: staffValidationRows`); the PDF reads `resourceGapLines`
(`pdf/lib/viewModelBodySlices.js`).

**(d) THE ORDER OF THE DRAWS, PROVED BY BIRTH** (`fieldDiff.mjs`, base cfc2b680a against the prototype tree; towns changed
of the 720 · the 150 · the 525; "people" = `npcs`, "ties" = `relationships`):

| site | edit | towns changed | people · ties · names moved | stored field families moved |
|---|---|---|---|---|
| — | the prototype applied, no rule on | 0 · 0 · 0 | 0 | none |
| all three sites at once | a no-op at each (`NOOP_read`, `NOOP_draw`, `NOOP_import`: the site's test computed, nothing changed) | 0 · 0 · 0 | 0 | none |
| THE READER, at print only (R1p) | `houseInputAtHand` answers `route` for a buyer; the birth's own call passes `{ atBirth: true }` | 11 · 4 · 1 | 0 | `arrivalScene` (the arrival reads the fact on the record in the making) |
| THE READER, everywhere (R1) | the same, the birth's call too | 331 · 58 · 222 | 0 | `resourceAnalysis.gaps` 329 · 57 · 222; `priorityNotes` 36 · 4 · 0; `arrivalScene` 11 · 4 · 1 |
| THE READER, the coast (R5) | `desertSalt` is `local` on a port route or coastal terrain | 9 · 0 · 36 | 0 | `resourceAnalysis.gaps` only |
| THE IMPORT, at the gaps' hour (R2) | `generateResourceAnalysis`, before `evaluateInstitutionChain` | 375 · 68 · 141 | 0 | `economicState.primaryImports` 375 · 68 · 141; `gaps` 298 · 54 · 114; `economicViability.plotHooks` 33 · 7 · 1; `.summary` 13 · 3 · 0; `arrivalScene` 11 · 4 · 1 |
| THE DRAW, draw kept (R3b) | `rowRoll` and the cascade give a barren source house the chance 0; the draw is still taken | 241 · 46 · 55 | **191 · 36 · 7** people; 190 · 35 · 6 ties; 0 names | roster 191 · 36 · 7, then everything drawn after it; `simulationTrace` 241 · 46 · 55 |
| THE DRAW, draw skipped (R3a) | the same rows return from `rowRoll` (no draw) and from the cascade | 547 · 128 · 204 | **543 · 126 · 204**; 533 · 123 · 204 ties | the stream shifts: every family after the roster |

An edit at the reader or at the import site consumes no draw and moves only its own fields (no person, tie or name moves
in any population). An edit at the draw moves the roster and, since people are drawn by house, re-draws people and ties
wherever a house goes, even with the draw kept; skipping the draw shifts the stream and re-draws three towns in four.

---

## Q4 · THE CANDIDATE RULES (prototyped in `PROTOTYPE.patch`, counted by `q4rules.mjs`)

THE TARGET: born-short houses (not on a spent ground) in calm towns on a connected road. BASE: **563 houses in 144 towns of
the 720; 115 in 38 of the 150.** Marks on a spent ground in those towns (the record's own Depleted list, a true mark):
124 · 25.

| rule | marks, the 720 (base 2,066) | born-short left in calm connected towns, the 720 · the 150 | towns whose printable lines moved, the 720 · the 150 | stored records moved, the 720 · the 150 · the 525 |
|---|---|---|---|---|
| R1 the reader's rule | 561 | **42 in 38** · 11 in 8 | 377 · 70 (no new line; lines gone) | 331 · 58 · 222 (R1p: 11 · 4 · 1) |
| R2 the import written | 656 | **32 in 30** · 7 in 7 | 375 · 68 | 375 · 68 · 141 |
| R3b source gated, draw kept | 1,955 | 527 in 134 · 104 in 34 | 141 · 26 | 241 · 46 · 55 (people 191 · 36 · 7) |
| R3a source gated, draw skipped | 1,951 | 535 in 142 · 107 in 37 | 471 · 110 | 547 · 128 · 204 (people 543 · 126 · 204) |
| R5 the coast | 2,062 | 563 in 144 · 115 in 38 | 6 · 0 | 9 · 0 · 36 |
| R2 + R5 (no draw) | 652 | **30 in 29** · 7 in 7 (dairy 14, salt works 8, charcoal burner 4, luxury quarter 4) | 376 · 68 | 376 · 68 · 141 |
| **R2 + R3b + R5** | **577** | **4 in 4 · 1 in 1** (the luxury goods quarter, every one) | 413 · 80 | 435 · 88 · 167 (people 191 · 36 · 6) |

**R1 · THE READER'S RULE.** A house of kind (i) is answered `route` by a connected road no siege shuts (and on a spent ground
too). Left in calm connected towns: dairy farmer 14, charcoal burner 14, salt works 10, luxury goods quarter 4 (all kind
(ii) but the luxury quarter, whose good no chain carries). THE PAGE (`q4needed.mjs`, `out/q4needed.R1p.720.txt`): of the 1,505 houses R1 lifts in the 720 (R1p reads the same), **558 then stand beside a line that still says their good is "Needed, and not brought
in"** (the vintner 137 "…: grapes", the potter 92 and the brickmaker 70 "…: clay", the sawmill 30 + 24, the cooper 26 + 19,
the carpenters 26 + 22 "…: timber" or "…: mountain_timber", the glassblower 12; r2r-town-18, r2r-town-22, r2r-town-33):
a house at work beside a line saying its material is not brought in is FALSE, the very pair BAR5-CHAINS (b) cured for the
vintner on a road (today a vintner on a road whose need list names grapes is marked; one whose need list does not is
answered by the road and the page is silent). The other 947 are silent (the fuller with no wool on any list, the
weavers, the cobblers: r2r-village-14, r2r-town-14, r2r-town-17). Lines made printable: none; gone: the marks and the
gap lines ("No clay reaches the potter." 155 towns; "No grapes reach the vintner." 137). In plain words: the page stops
saying the potter is short of clay; where the town's need list names clay it still says clay is needed and not brought in,
beside a potter at work.

**R2 · THE IMPORT WRITTEN AT THE BIRTH.** At `resourceGenerator.js :: generateResourceAnalysis`, before the gaps
(`evaluateInstitutionChain`), on a connected road no siege shuts: for each live native house of kind (i) whose every input
the reader answers `missing`, the input's word of the list's own vocabulary is appended to `economicState.primaryImports`
(not a new field): "Wool", "Timber", "Iron ore", "Clay and raw materials", "Raw hides and animal products", "Grain",
"Grapes and must", "Livestock", "Glass sand", "Medicinal herbs", "Salted fish"; the gap is then written `imported` ("Potter
runs on imported clay"). STORED FAMILIES: imports 375 of the 720 (68 · 141 of the 525), gaps 298 (54 · 114), the
viability's plot hooks 33 (7 · 1) and its summary's hook count 13 (3 · 0), the arrival scene 11 (4 · 1); no person, tie,
name or house. NEW PRINTABLE LINES (the Imports line, three towns each): "Clay and raw materials" 176 (r2r-village-4,
r2r-village-6, r2r-village-16); "Raw hides and animal products" 163 (r2r-village-9, -14, -27); "Timber" 157 (r2r-hamlet-3,
-17, -32); "Wool" 146 (r2r-village-14, -26, -28); "Grapes and must" 137 (r2r-town-18, -22, -33); "Iron ore" 43
(r2r-hamlet-10, -19, -26); "Glass sand" 12 (r2r-town-8, -35, -40); "Medicinal herbs" 4; "Salted fish" 4. A new plot hook
where the iron comes in by cart (r2r-hamlet-30: "The iron carts are three weeks late …"; r2r-hamlet-35: "Iron has doubled
in price this season …"). A NEW MARK, 11 towns: "Charcoal burner: Short of coal." (r2r-metropolis-2, -28, -40): the
burner's timber gap now reads the cooper's imported "Timber", so its other ground (spent coal) speaks; a source house fed
by another house's import is R3's case. Beside a need line: 2 (the smelter's other ores, r2r-city-5, r2r-city-36). Left in
calm connected towns: dairy farmer 14, salt works 10, charcoal burner 4, luxury goods quarter 4. In plain words: the
Imports line now names the wool the fuller works and the clay the potter turns; the house is not marked, and under a
siege it reads "Curtailed by the siege." as every house on an imported input does.

**R3 · THE SOURCE HOUSE GATED AT ITS DRAW** (the four the gaps mark: stone quarry, charcoal burner, dairy farmer, salt works;
their grounds as in Q2), at both draw sites. R3b (draw kept): **208 houses go in 178 towns of the 720** (charcoal burner 75,
stone quarry 57, salt works 42, dairy farmer 34; 43 in 35 of the 150; 4 in 4 of the 525); in 123 of the 178 nothing else
of the roster moves (nothing stands in the house's place: its row's draw is taken and does not fill); in 68 the roster
moves further (a freed cascade place, a boost the removed house gave, an exclusive seat: veteran's lodge, fuller, cooper,
ropemaker, the luxury quarter gained a few each). THE RE-DRAW SPREADS to people and ties in **191 of the 720, 36 of the
150, 7 of the 525** (no name moves). R3a (draw skipped): the stream shifts: people re-drawn in 543 · 126 · 204; the roster
of 546 towns moves (lost and gained tanners, potters, red-light districts by the dozen). The 57 quarries R3 removes were
never marked (the reader answers them by themselves, Q2). In plain words: a town with no pasture has no dairy, a town with
no wood no charcoal burner, a river town no salt works; and about one census town in four is born with other people.

**R4 · THE SOURCE HOUSE KEPT AND READ AS WORKED OUT** (`q4r4.mjs`, `out/q4r4.base.md`; no draw moves). The source houses on
their own spent ground, the 720: stone quarry 45 (every one marked, by a GAP: the gap writer calls the spent quarry
"lacks access to stone"; 44 beside "Dressed stone (local quarry depleted)"), mine 32 (23 marked, by the spent-ground
reading; 26 beside the shortage import), charcoal burner 34 (5 marked), fishers' landings 12, salt works 8 (5 marked by a
gap), dairy 2, and a few others. THE LINES THAT MUST AGREE where the house is read as worked out: the gap line ("No stone
reaches the stone quarry.", 45 towns, says the stone is elsewhere: it should read the spent ground, as the mark and the
Depleted list do); the exports (4 towns still export stone beside a spent quarry; 7 a mine's ore); the chain card's state
(13 stone chains and 8 salt chains on a spent own ground stand in a state other than impaired); the income share (1 "Stone Quarrying"; 27 shares naming iron or ore beside a spent mine). Is that a truer town than one with no quarry? YES: a
worked-out quarry is a thing towns have, the imports already print it, and it moves nothing stored. The mark's words
already say "Short of stone." (`SPENT_GROUND_YIELD.stone_quarry`); only the gap line and the three record readings above
disagree.

**R5 · THE SALT WORKS.** Its input is the chain `desertSalt` (raw `desert_salt`); the reader answers it `local` where a live
resource holds salt (salt flats, desert salt, the fishing grounds' commodities "fish, salt"). The record: of the 720's 54 salt works on a coast (a port route or coastal terrain), 45 stand on a live salt ground, 8 on a spent one, ONE on none (marked). The rest of the wrong model is the river: 24 salt works on a river (riverside, forest, plains terrain),
no brine, marked "Short of salt.", with a stored chain `salt_flats` of state `entrepot`. THE SMALLEST TRUE READING: on a
port route or coastal terrain the sea is the brine (`local`): R5 moves the gaps of 9 of the 720 and 36 of the 525 and lifts
4 marks, 6 gap lines ("No salt reaches the salt works.": r2r-village-36, r2r-village-53, r2r-town-3); the river salt works
is R3's (the row's `river` admits a house the river cannot feed).

---

## Q5 · RECOMMENDATION

ONE RULE, BY KIND OF HOUSE:

| kind | the rule | where |
|---|---|---|
| (i) buys and works | its input is BROUGHT IN where nothing here answers it and a connected road no siege shuts: the import is written at the birth (R2), and the page reads it as every imported input (curtailed under a siege) | the birth's resource analysis |
| (ii) is the source, its ground absent | NOT DRAWN where the land does not give its material (R3b: the draw kept), at both draw sites; on a coast the sea is the salt works' ground (R5) | the two draws; the reader for the coast |
| (ii) is the source, its ground spent | KEPT and read as WORKED OUT (R4): the gap line reads the spent ground; the mark is unchanged | the page's gap line |
| (iii) other | as today | — |

THE SMALLEST SET OF EDITS (measured in the prototype: `PROTOTYPE.patch`, 84 lines added in 6 files):
1. A new import-free leaf of the kinds, `src/domain/facts/houseKinds.js` (the prototype's `birthKinds.js` without its
   environment switch: the (i) ids, the (ii) ids and their grounds, the import words; ~30 lines). THE OWNER'S TABLE.
2. `src/generators/resourceGenerator.js :: generateResourceAnalysis`: the import written before `evaluateInstitutionChain`
   (~18 lines); add "Luxury goods" for `luxury_goods_quarter` (the 4 left).
3. `src/domain/facts/houseInputAtHand.js :: houseInputAtHand`: the coast line for `desertSalt` (2 lines).
4. `src/generators/steps/assembleInstitutions.js :: rowRoll`: a barren source row's chance 0, the draw kept (~5 lines).
5. `src/generators/cascadeGenerator.js :: applyCascadeInstitutions` and `steps/cascadePass.js` (the nearby resources handed
   in): the same at the cascade (~7 lines).
6. R4: `src/domain/display/validationOnPage.js :: resourceGapLines`: a source house on its own spent ground reads the spent
   ground, not "No stone reaches …" (~5 lines); the exports and the chain state of a spent own ground are the record's
   (named below, not in this wave).

THE GUARD (a law over fixed seeds, the census's 720 and the 150): **"In a town with no crisis and a connected road, no house
of kind (i) or (ii) is marked short, unless it stands on a spent ground of its own (a ground the record's Depleted list
names)."** Counted at R2 + R3b + R5: 4 houses in 4 towns of the 720 (the luxury goods quarter: r2r-city-21, r2r-city-23,
r2r-metropolis-17) and 1 of the 150 (bar0-metropolis-calm-rand-34): edit 2's word closes them. The spent-ground marks (124
houses in the 720's calm connected towns, 23 in the 150's) are the named exception: true marks. Its positive control: the
same law fails on the base (563 houses in 144 towns).

THE SEATS (disjoint files, in this order):
- **BIRTH-1 · THE IMPORT AND THE COAST** (no draw moves): `src/domain/facts/houseKinds.js` (new), `src/generators/resourceGenerator.js`,
  `src/domain/facts/houseInputAtHand.js`, the guard `tests/domain/birthKindsLaw.test.js` (new). Moves, measured with R2 + R5 born together (the 720 · the 150 · the 525): the imports 375 · 68 · 141, the gaps 301 · 54 · 116, the plot hooks 33 · 7 · 1, the viability summary 13 · 3 · 0, the arrival scene 11 · 4 · 1; no person, tie, name or house.
- **BIRTH-2 · THE SOURCE AT ITS DRAW** (re-draws people: THE OWNER'S, for the size of the move): `src/generators/steps/assembleInstitutions.js`
  (`rowRoll` only), `src/generators/cascadeGenerator.js`, `src/generators/steps/cascadePass.js`; reads BIRTH-1's leaf, so it lands after.
- **BIRTH-3 · THE WORKED-OUT GROUND** (a reading at print): `src/domain/display/validationOnPage.js`; independent of both.

THE BOOKS THE CURE MOVES (the close's): the 525 reference configurations (golden master; BIRTH-1: 141 imports, 116 gaps, 1 plot hook, 1 arrival scene; BIRTH-2: 7 rosters with their people, 55 traces), the census's stored figures read off the record (the BR1
table of BAR6-RECORD, the marks' counts of BAR6-MARKS), the test keys re-held by town (`bar5MarksLaw2`, `crisisStoppedRows`
S5, `bar3LabelWords2` L3 key towns may lose their short house), the PAGE-COPY renders. Not run here (budget): the vitest
suites, the build, the generated annex.

WHAT SHOULD NOT BE DONE, WITH THE COUNT:
- **R1 alone** (the reader's rule): it leaves 558 houses of the 720 at work beside "Needed, and not brought in: <their
  good>", the falsehood BAR5-CHAINS cured for the vintner.
- **R3 by skipping the draw** (R3a): people re-drawn in 543 of the 720, 126 of the 150, 204 of the 525; with the draw kept
  (R3b) 191 · 36 · 7.
- **An import fed to a source house** (R2 widened to kind (ii)): it would make the charcoal burner burn the cooper's bought
  timber (11 towns already read so under R2 alone) and the salt works boil imported salt (16 today): an import feeds a
  buyer, never the work on the ground.
- **Gating a source house on a spent ground** (R3 over depleted ground): 45 quarries, 32 mines, 34 charcoal burners, 8
  salt works the record already prints as worked out would go, with their people.

WHERE TWO RULES ARE CLOSE: R2 against R1 for kind (i): both lift ~1,400–1,500 marks and move no person; R2 wins by the 558
false need lines R1 leaves, at the cost of 375 stored import lists. I would change my mind if the owner reads the need
list itself as the error (then R1 with the need line read through the kinds would do, moving 331 gaps and no imports).
R3b against leaving the source houses marked: R3b removes 208 houses and re-draws people in 191 of the 720 for 26 marks in the calm connected towns (dairy farmer 14, salt works 8, charcoal burner 4 after R2 + R5); the marks it removes are TRUE ("Short of livestock." of
a dairy with no pasture). If the owner will not move people for it, BIRTH-2 is held and the guard names those three
kinds as counted exceptions (measured at R2 + R5: those 26 beside the luxury quarter's 4, 30 houses in 29 towns of the 720; 7 in 7 of the 150).

## WHAT IS LEFT (named, with what was measured)
1. The 57 stone quarries (and 16 salt works) on no ground, unmarked, answered by themselves (`LOCAL_PRODUCERS`); BIRTH-2
   removes them; without BIRTH-2 the reader should not let a source house answer its own input.
2. The buyers on a spent ground with no shortage import (169 houses in 91 towns of the 720; 56 in 37 calm connected):
   R2 as prototyped does not write their shortage import; the guard keeps them as the spent-ground exception.
3. R4's record readings (the exports of a spent ground, 4 + 7 towns; the chain states, 13 + 8) are the economy's, not printed here.
4. The fresh 300 counted at the base only; no tab rendered (the lines are the record's readers' own).
