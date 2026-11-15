# REVIEW-BAR-2 worklist · HISTORY · history, arrival and culture rows

7 flagged sentences (HIGH 0), read at the joined line f8042b61a on 2026-11-15 (REVIEW-BAR-2: thirty fresh towns, each whole). EACH IS A CANDIDATE: a reader judged it against ONE town's facts (`town read in`): verify it by the record before you cure it. `towns` = how many of the 720 census towns printed the sentence at the read before (5d1e3096b, a day old; names and figures aside): the measure of its width, not of its falsity. The machine form is `WORKLIST-HISTORY.json` beside this file (each row's `fold` is its key in an inventory).

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

- `src/data/cultureProfiles.js` · 2 · 96
- `src/data/arrivalProse.js` · 5 · 48

## By writer (file :: function, table or pool; flagged sentences · towns printing, summed)

- src/data/cultureProfiles.js :: CULTURE_PROFILES.foodways · 2 · 96
- src/data/arrivalProse.js :: ARRIVAL_PEOPLE.greek · 1 · 20
- src/data/arrivalProse.js :: ARRIVAL_TENSIONS.prosperous · 1 · 14
- src/data/arrivalProse.js :: ARRIVAL_SENSES.dominant · 2 · 12
- src/data/arrivalProse.js :: ARRIVAL_SENSES.lines · 1 · 2

## The sentences, HIGH first, then widest first

| sev | towns | id | section | town read in | sentence (as that town prints it) | what the reader said | writer |
|---|---|---|---|---|---|---|---|
| MED | 64 | C26954 | Systems/Economics | bar0-town-calm-rand-5 | Fermentation, pickling, drying, and shared ovens stretch the harvest through winter. | names shared ovens; none on HOUSES (no bakery or oven house) | src/data/cultureProfiles.js (line 291 at f8042b61a) CULTURE_PROFILES.foodways |
| MED | 32 | C25910 | Systems/Economics | bar0-town-calm-rand-4 | Public ovens, market vendors, and shared dining customs make food distribution visibly civic. | names public ovens; none on HOUSES (no bakery or oven house) | src/data/cultureProfiles.js (line 119 at f8042b61a) CULTURE_PROFILES.foodways |
| MED | 20 | C14917 | Summary/Overview | bar0-hamlet-under_siege-rand-5 | Two citizens argue a point of law loudly enough for a crowd to gather. | a crowd gathers over a point of law; population 29, under siege, no court in HOUSES | src/data/arrivalProse.js (line 367 at f8042b61a) ARRIVAL_PEOPLE.greek |
| MED | 14 | C23710 | Summary/Overview | bar0-thorp-calm-rand-4 | Well-fed children run errands through a busy street. | a busy street in a thorp of 21 people; no streets or crowds can be held | src/data/arrivalProse.js (line 414 at f8042b61a) ARRIVAL_TENSIONS.prosperous |
| MED | 7 | C3297 | Summary/Overview | bar0-city-under_siege+famine-rand-5 | The hammering echoes throughout Hochberg, and most of it is the sound of blades being made. | Says blades are being forged by hammering; C3553 says the siege took the iron and the smiths have nothing to work with. | src/data/arrivalProse.js (line 79 at f8042b61a) ARRIVAL_SENSES.dominant |
| MED | 5 | C10029 | Summary/Overview | bar0-city-wartime-rand-5 | Ore carts and stone carts grind along the road in a line that never seems to end. | ore carts in an endless line; LAND gives iron ore deposits absent, mining chain vulnerable, iron is imported | src/data/arrivalProse.js (line 208 at f8042b61a) ARRIVAL_SENSES.dominant |
| MED | 2 | C34242 | Summary/Overview | bar0-village-famine-rand-5 | Curls of shavings blow across the lane from a carpenter's bench. | a carpenter's bench; HOUSES lists no carpenter or joiner (only woodcutter's camp, thatcher) | src/data/arrivalProse.js (line 217 at f8042b61a) ARRIVAL_SENSES.lines |
