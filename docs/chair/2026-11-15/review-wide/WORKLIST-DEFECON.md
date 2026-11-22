# READ-ALL worklist · DEFECON · the safety, defence and economy generators and their display

8 flagged sentences (HIGH 0), read at the joined tree of 59185b62a on 2026-11-15 (the WIDE read: 29 more fresh towns, twelve cities under siege and famine, twelve at war, five calm hamlets, ONE reader each). EACH IS A CANDIDATE: a reader judged it against ONE town's facts (`town read in`): verify it by the record before you cure it. `towns` = how many of the 720 census towns printed the sentence (names and figures aside) at the census of 5d1e3096b2, TWO ROUNDS OLD: a hint of its width, not of its falsity: your own census run is the measure. The machine form is `WORKLIST-DEFECON.json` beside this file (each row's `fold` is its key in an inventory).

## YOUR FILES (no other seat holds them)

- `src/generators/economy/foodBalance.js`
- `src/data/resourceData.js`
- `src/generators/isolationGenerator.js`
- `src/generators/safetyProfile.js`
- `src/generators/economy/economicState.js`
- `src/generators/economy/prosperity.js`
- `src/generators/economy/incomeLineSiblings.js`
- `src/generators/economy/tradeGoods.js`
- `src/generators/economy/viability.js`
- `src/generators/safetyLineTruth.js`
- `src/domain/display/defenseDisplay.js`
- `src/domain/display/dossierViewModel.js`
- `src/generators/computeActiveChains.js`
- `src/generators/resourceGenerator.js`
- `src/generators/steps/cascadePass.js`

## By file (flagged sentences · towns printing, summed)

- `src/generators/economy/foodBalance.js` · 3 · 105
- `src/generators/safetyProfile.js` · 3 · 49
- `src/generators/safetyLineTruth.js` · 1 · 29
- `src/domain/display/defenseDisplay.js` · 1 · 26

## By writer (file :: function, table or pool; flagged sentences · towns printing, summed)

- src/generators/economy/foodBalance.js :: deriveFoodBalanceAnalysis · 3 · 105
- src/generators/safetyLineTruth.js :: NO_DOMINANT · 1 · 29
- src/generators/safetyProfile.js :: COURT_NO_PRISON · 1 · 28
- src/domain/display/defenseDisplay.js :: ORGANIZED_RING_NOTES · 1 · 26
- src/generators/safetyProfile.js :: generateSafetyProfile · 2 · 21

## The sentences, HIGH first, then widest first

| sev | towns | id | section | town read in | sentence (as that town prints it) | what the reader said | writer |
|---|---|---|---|---|---|---|---|
| MED | 43 | C20434 | Summary/Overview | bar0-city-under_siege+famine-rand-19 | Settlement cannot cover ~3512 lbs of food per day (46% of needs) and has no dependable trade route. | Gives shortfall ~3512 lbs (46%), which counts 2151 imports; the Food Security panel says no food comes in by trade and short is 5,663 | src/generators/economy/foodBalance.js (line 457 at 59185b62a) deriveFoodBalanceAnalysis |
| MED | 31 | C10009 | Systems/Outlook | bar0-city-under_siege+famine-rand-14 | What is already in store is all there will be until it lifts. | 'stored food is all there will be'; FOOD shows 8% grown and 28% made by magic, and C9893 says what is still harvested stretches stores | src/generators/economy/foodBalance.js (line 227 at 59185b62a) deriveFoodBalanceAnalysis |
| MED | 31 | C19458 | Systems/Outlook | bar0-city-under_siege+famine-rand-18 | What is already in store is all there will be until it lifts. | "What is in store is all there will be": FOOD has 14% grown and 56% by magic daily (12,596 lbs/day); C19352 says what is harvested stretches the store | src/generators/economy/foodBalance.js (line 227 at 59185b62a) deriveFoodBalanceAnalysis |
| MED | 29 | C12387 | Systems/Defense | bar0-city-under_siege+famine-rand-15 | No single dominant organisation: just the steady pressure of too many people with too little, and too few consequences for taking. | says 'no single dominant organisation' in crime; page says one syndicate controls the criminal hierarchy and decides what crime is allowed | src/generators/safetyLineTruth.js (line 161 at 59185b62a) NO_DOMINANT |
| MED | 28 | C30841 | Systems/Defense | bar0-city-wartime-rand-11 | A court exists, though there is nowhere to hold the guilty. | 'nowhere to hold the guilty' (also C30860, C30935) vs Commander's secret of a prisoner who died 'in the cells' | src/generators/safetyProfile.js (line 993 at 59185b62a) COURT_NO_PRISON |
| MED | 26 | C30870 | Systems/Defense | bar0-city-wartime-rand-11 | Ask who runs crime here and the answer is one ring. | 'the answer is one ring' (one syndicate) but HOUSES has Multiple criminal factions and Rival gangs 'several gangs at odds' | src/domain/display/defenseDisplay.js (line 652 at 59185b62a) ORGANIZED_RING_NOTES |
| MED | 13 | C55188 | Systems/Defense | bar0-hamlet-calm-rand-12 | The constant monster threat keeps the guard exceptionally well-drilled and alert. | calls the guard exceptionally well-drilled; the citizen militia is part-time volunteers with no training or command | src/generators/safetyProfile.js (line 311 at 59185b62a) generateSafetyProfile |
| MED | 8 | C55187 | Systems/Defense | bar0-hamlet-calm-rand-12 | The walls leave few ways in, and the guard watches them. | says the guard watches the ways in; DEFENCE watch none, garrison none, only a citizen militia; C55201 says the palisade has no gate | src/generators/safetyProfile.js (line 382 at 59185b62a) generateSafetyProfile |
