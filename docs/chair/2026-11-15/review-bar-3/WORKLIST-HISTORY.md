# READ-ALL worklist · HISTORY · history, arrival and culture rows

12 flagged sentences (HIGH 0), read at the joined tree of 59185b62a on 2026-11-15 (REVIEW-BAR-3: thirty fresh towns, two readers each). EACH IS A CANDIDATE: a reader judged it against ONE town's facts (`town read in`): verify it by the record before you cure it. `towns` = how many of the 720 census towns printed the sentence (names and figures aside) at the census of 5d1e3096b2, TWO ROUNDS OLD: a hint of its width, not of its falsity: your own census run is the measure. The machine form is `WORKLIST-HISTORY.json` beside this file (each row's `fold` is its key in an inventory).

## YOUR FILES (no other seat holds them)

- `src/generators/history/historyRouteContext.js`
- `src/data/historyData.js`
- `src/data/arrivalProse.js`
- `src/data/cultureProfiles.js`
- `src/data/stressTypes.js`
- `src/data/historyDescVariants.js`
- `src/generators/historyGenerator.js`
- `src/domain/foodways.js`

## By file (flagged sentences · towns printing, summed)

- `src/data/arrivalProse.js` · 7 · 83
- `src/data/stressTypes.js` · 1 · 33
- `src/domain/foodways.js` · 1 · 7
- `src/data/historyData.js` · 3 · 6

## By writer (file :: function, table or pool; flagged sentences · towns printing, summed)

- src/data/arrivalProse.js :: ARRIVAL_SENSES.dominant · 3 · 34
- src/data/stressTypes.js :: STRESS_TYPE_MAP.wartime · 1 · 33
- src/data/arrivalProse.js :: ARRIVAL_SENSES.lines · 1 · 14
- src/data/arrivalProse.js :: ARRIVAL_PEOPLE.greek · 1 · 14
- src/data/arrivalProse.js :: ARRIVAL_PEOPLE.arabic · 1 · 13
- src/data/arrivalProse.js :: ARRIVAL_PEOPLE.south_asian · 1 · 8
- src/domain/foodways.js :: SOURCE_PHRASES · 1 · 7
- src/data/historyData.js :: HISTORICAL_EVENTS_DATA.severity · 2 · 6
- src/data/historyData.js :: HISTORICAL_EVENTS_DATA.byMemory · 1 · 0

## The sentences, HIGH first, then widest first

| sev | towns | id | section | town read in | sentence (as that town prints it) | what the reader said | writer |
|---|---|---|---|---|---|---|---|
| MED | 33 | C8742 | Summary/Crisis | bar0-city-wartime-rand-7 | A crown officer has arrived with requisition orders that will strip the settlement of something it cannot spare. | a crown officer issues requisition orders to a sovereign city-state that answers to no higher lord | src/data/stressTypes.js (line 177 at 59185b62a) STRESS_TYPE_MAP.wartime |
| MED | 22 | C2300 | Summary/Overview | bar0-city-under_siege+famine-rand-7 | Bolts of cloth hang drying in long bright strips across every yard. | bolts of cloth drying in every yard, but Economics says little cloth is made here; Textiles & Cloth chain impaired (grazing depleted), imports cut by siege | src/data/arrivalProse.js (line 166 at 59185b62a) ARRIVAL_SENSES.dominant |
| MED | 14 | C13758 | Summary/Overview | bar0-hamlet-under_siege-rand-6 | A dog drives a handful of animals across the road, and you wait for them. | A dog drives animals across the road; under siege nothing moves and livestock are penned between the houses | src/data/arrivalProse.js (line 173 at 59185b62a) ARRIVAL_SENSES.lines |
| MED | 14 | C30302 | Summary/Overview | bar0-town-occupied-rand-7 | A patron stands drinks at a wine shop, and makes sure everyone knows who is paying. | names a wine shop; HOUSES has taverns and inns but no wine shop | src/data/arrivalProse.js (line 372 at 59185b62a) ARRIVAL_PEOPLE.greek |
| MED | 13 | C24627 | Summary/Overview | bar0-thorp-calm-rand-7 | A broker sits in the shade, matching buyers to goods from routes you have never travelled. | a broker matching buyers to goods from far routes: HOUSES has no market or trader, imports none, 'No market or fair stands' (C24646) | src/data/arrivalProse.js (line 322 at 59185b62a) ARRIVAL_PEOPLE.arabic |
| MED | 8 | C13759 | Summary/Overview | bar0-hamlet-under_siege-rand-6 | Each lane of stalls has someone who speaks for it, and they are all speaking at once. | Lanes of stalls with speakers in a hamlet of 54, all speaking at once, under a siege where field work and trade have stopped | src/data/arrivalProse.js (line 358 at 59185b62a) ARRIVAL_PEOPLE.south_asian |
| MED | 7 | C36357 | Systems/Economics | bar0-village-famine-rand-7 | Most meals start from game from the woods. | 'Most meals start from game'; FOOD ledger: grown 59%, brought in 22%, magic 8%; no hunted share. Contradicts C36353 (grows three parts in five) | src/domain/foodways.js (line 28 at 59185b62a) SOURCE_PHRASES |
| MED | 6 | C0013 | Summary/Overview | bar0-city-under_siege+famine-rand-6 | Hartgrund lives on what comes out of the ground, and the dust of it is on everything. | Says the city lives on what comes out of the ground; INCOME is 60% smuggling, quarrying 1%, mining chain vulnerable (iron absent), grown food 8%. | src/data/arrivalProse.js (line 208 at 59185b62a) ARRIVAL_SENSES.dominant |
| MED | 6 | C15699 | World/History | bar0-hamlet-under_siege-rand-8 | The coastal trade the settlement was built upon failed, and the wealth it once carried drained away within a few hard years | trade collapse is 32 years ago in a town 32 years old: the trade it was 'built upon' collapses at founding, yet wealth 'once carried' drained | src/data/historyData.js (line 1461 at 59185b62a) HISTORICAL_EVENTS_DATA.severity |
| MED | 6 | C21235 | Summary/Overview | bar0-metropolis-calm-rand-8 | Großgasse lives on what comes out of the ground, and the dust of it is on everything. | says the town lives on what comes out of the ground; INCOME is trade, finance, guild fees; quarry and grain fields depleted, iron only 3% | src/data/arrivalProse.js (line 208 at 59185b62a) ARRIVAL_SENSES.dominant |
| MED | 0 | C26792 | Summary/Overview | bar0-town-calm-rand-7 | The right of the current authority to rule is openly and widely questioned, and no one can agree on who, if anyone, holds a legitimate claim | says authority's right to rule is openly and widely questioned; header has Stable, legitimacy Endorsed, score 78 | src/data/historyData.js (line 1646 at 59185b62a) HISTORICAL_EVENTS_DATA.byMemory |
| MED | 0 | C31794 | World/History | bar0-town-occupied-rand-7 | A speculative frenzy in healing waters (bottled) (taxed by occupation) and property collapsed almost overnight, ruining fortunes and hardening class resentment for a generation | the Crash (12 years ago) prose carries the trade label's mark '(taxed by occupation)' inside the sentence; a leaked export tag | src/data/historyData.js (line 1442 at 59185b62a) HISTORICAL_EVENTS_DATA.severity |
