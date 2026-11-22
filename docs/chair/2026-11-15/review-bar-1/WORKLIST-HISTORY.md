# READ-ALL worklist · HISTORY · history, arrival and culture rows

5 flagged sentences (HIGH 1), read at the joined line e5b421802 on 2026-11-14. EACH IS A CANDIDATE: a reader judged it against ONE town's facts (`town read in`): verify it by the record before you cure it. `towns` = how many of the 720 census towns print the sentence (names and figures aside): the measure of its width, not of its falsity. The machine form is `WORKLIST-HISTORY.json` beside this file (each row's `fold` is its key in an inventory).

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

- `src/data/arrivalProse.js` · 4 · 80
- `src/data/historyDescVariants.js` · 1 · 12

## By writer (file :: function, table or pool; flagged sentences · towns printing, summed)

- src/data/arrivalProse.js :: ARRIVAL_SENSES.dominant · 2 · 60
- src/data/arrivalProse.js :: ARRIVAL_PEOPLE.steppe · 1 · 15
- src/data/historyDescVariants.js :: HISTORY_DESC_VARIANTS.occupation_legacy · 1 · 12
- src/data/arrivalProse.js :: ARRIVAL_PEOPLE.greek · 1 · 5

## The sentences, HIGH first, then widest first

| sev | towns | id | section | town read in | sentence (as that town prints it) | what the reader said | writer |
|---|---|---|---|---|---|---|---|
| HIGH | 12 | C11143 | World/History | bar0-town-occupied-rand-2 | When the occupiers left, they left behind a town of former collaborators and former resisters, none of it ever settled | 'When the occupiers left'; CRISIS is Under Occupation now, the occupation 8 years ago still holds, occupiers have not left | src/data/historyDescVariants.js (line 65 at e5b421802) HISTORY_DESC_VARIANTS.occupation_legacy |
| MED | 36 | C11863 | Summary/Overview | bar0-village-famine-rand-2 | Racks of drying fish line the way in, and the smell of salt and catch is everywhere. | racks of drying fish and the smell of catch everywhere, yet FOOD failed source is fish (famine cut 65%); fishing has failed | src/data/arrivalProse.js (line 141 at e5b421802) ARRIVAL_SENSES.dominant |
| MED | 24 | C0015 | Summary/Overview | bar0-city-under_siege+famine-rand-2 | The clatter of looms follows you through Evangeopolis, from one shutter to the next. | clatter of looms through the streets is ordinary working life under a siege and famine that stopped field work and trade | src/data/arrivalProse.js (line 155 at e5b421802) ARRIVAL_SENSES.dominant |
| MED | 15 | C11864 | Summary/Overview | bar0-village-famine-rand-2 | A caravan broker shouts terms to a line of laden animals and the people leading them. | a caravan broker haggling over a line of laden animals reads as busy trade; the town has no market and little trade stops under famine | src/data/arrivalProse.js (line 351 at e5b421802) ARRIVAL_PEOPLE.steppe |
| MED | 5 | C0016 | Summary/Overview | bar0-city-under_siege+famine-rand-2 | A money changer sits at his table with coins from many mints. | money changer with coins from many mints presumes ordinary trade; CRISIS under siege, trade stopped, nothing comes in | src/data/arrivalProse.js (line 357 at e5b421802) ARRIVAL_PEOPLE.greek |
