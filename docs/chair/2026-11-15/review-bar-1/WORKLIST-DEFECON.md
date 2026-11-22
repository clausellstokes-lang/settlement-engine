# READ-ALL worklist · DEFECON · the safety, defence and economy generators and their display

5 flagged sentences (HIGH 0), read at the joined line e5b421802 on 2026-11-14. EACH IS A CANDIDATE: a reader judged it against ONE town's facts (`town read in`): verify it by the record before you cure it. `towns` = how many of the 720 census towns print the sentence (names and figures aside): the measure of its width, not of its falsity. The machine form is `WORKLIST-DEFECON.json` beside this file (each row's `fold` is its key in an inventory).

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

- `src/generators/safetyProfile.js` · 4 · 319
- `src/domain/display/defenseDisplay.js` · 1 · 168

## By writer (file :: function, table or pool; flagged sentences · towns printing, summed)

- src/generators/safetyProfile.js :: generateSafetyProfile · 2 · 221
- src/domain/display/defenseDisplay.js :: CRIM_STRUCTURE_DATA · 1 · 168
- src/generators/safetyProfile.js :: SMUGGLING_HOOKS · 2 · 98

## The sentences, HIGH first, then widest first

| sev | towns | id | section | town read in | sentence (as that town prints it) | what the reader said | writer |
|---|---|---|---|---|---|---|---|
| MED | 188 | C7312 | Systems/Defense | bar0-metropolis-calm-rand-2 | Everyone comes and goes by the gates, so smugglers have to get past the garrison and city watch. | 'Everyone comes and goes by the gates'; the Underground network moves goods and people beneath the walls without touching a street | src/generators/safetyProfile.js (line 380 at e5b421802) generateSafetyProfile |
| MED | 168 | C4063 | Systems/Defense | bar0-city-wartime-rand-2 | Criminal activity is coordinated enough to maintain routes and territories but lacks a single controlling authority. | says crime lacks a single controlling authority; GOVERNMENT lists Thieves' Guild as a power and PEOPLE has Vandansüren Taichiud as its rank-1 head | src/domain/display/defenseDisplay.js (line 177 at e5b421802) CRIM_STRUCTURE_DATA |
| MED | 49 | C0296 | Summary/Plot Hooks | bar0-city-under_siege+famine-rand-2 | The smuggling network is moving something unusual this week, not the normal contraband. | smuggling network 'moving something this week' as if goods travel; under siege nothing comes in or goes out | src/generators/safetyProfile.js (line 970 at e5b421802) SMUGGLING_HOOKS |
| MED | 49 | C0297 | Summary/Plot Hooks | bar0-city-under_siege+famine-rand-2 | Someone wants to know what it is before it arrives. | something expected to 'arrive' this week; under siege nothing comes in by road, gate or water | src/generators/safetyProfile.js (line 970 at e5b421802) SMUGGLING_HOOKS |
| MED | 33 | C8585 | Systems/Defense | bar0-thorp-calm-rand-2 | Petty theft is the primary risk; organized crime has a limited foothold. | organized crime has a limited foothold, but the same page says the hall is free of criminals and no criminal power exists | src/generators/safetyProfile.js (line 322 at e5b421802) generateSafetyProfile |
