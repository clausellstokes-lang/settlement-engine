# READ-ALL worklist · HISTORY · history, arrival and culture rows

4 flagged sentences (HIGH 0), read at the joined tree of 59185b62a on 2026-11-15 (the WIDE read: 29 more fresh towns, twelve cities under siege and famine, twelve at war, five calm hamlets, ONE reader each). EACH IS A CANDIDATE: a reader judged it against ONE town's facts (`town read in`): verify it by the record before you cure it. `towns` = how many of the 720 census towns printed the sentence (names and figures aside) at the census of 5d1e3096b2, TWO ROUNDS OLD: a hint of its width, not of its falsity: your own census run is the measure. The machine form is `WORKLIST-HISTORY.json` beside this file (each row's `fold` is its key in an inventory).

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

- `src/data/arrivalProse.js` · 3 · 26
- `src/data/historyData.js` · 1 · 7

## By writer (file :: function, table or pool; flagged sentences · towns printing, summed)

- src/data/arrivalProse.js :: ARRIVAL_PEOPLE.greek · 1 · 14
- src/data/historyData.js :: HISTORICAL_EVENTS_DATA.severity · 1 · 7
- src/data/arrivalProse.js :: ARRIVAL_SENSES.dominant · 1 · 6
- src/data/arrivalProse.js :: ARRIVAL_SENSES.lines · 1 · 6

## The sentences, HIGH first, then widest first

| sev | towns | id | section | town read in | sentence (as that town prints it) | what the reader said | writer |
|---|---|---|---|---|---|---|---|
| MED | 14 | C2355 | Summary/Overview | bar0-city-under_siege+famine-rand-11 | A patron stands drinks at a wine shop, and makes sure everyone knows who is paying. | names a wine shop; HOUSES has no wine shop or vintner (only inns and taverns) | src/data/arrivalProse.js (line 372 at 59185b62a) ARRIVAL_PEOPLE.greek |
| MED | 7 | C46403 | World/History | bar0-city-wartime-rand-17 | An uncontrolled surge of magic left its mark on the temple district and on the people who were there, and the effects have never fully faded | Names a 'temple district'; HOUSES has no temple, only parish churches and monasteries | src/data/historyData.js (line 1614 at 59185b62a) HISTORICAL_EVENTS_DATA.severity |
| MED | 6 | C52132 | Summary/Overview | bar0-city-wartime-rand-9 | Fortesaltus lives on what comes out of the ground, and the dust of it is on everything. | 'lives on what comes out of the ground' but INCOME is mostly trade and tolls; Iron & Metalwork is only 5%, mining one house of 39 | src/data/arrivalProse.js (line 208 at 59185b62a) ARRIVAL_SENSES.dominant |
| MED | 6 | C53735 | Summary/Overview | bar0-hamlet-calm-rand-10 | The smell of incense drifts out into the press of the lane. | incense and 'the press of the lane' in a hamlet of 80 with no church of its own (access only) and an unattended shrine | src/data/arrivalProse.js (line 189 at 59185b62a) ARRIVAL_SENSES.lines |
