# READ-ALL worklist · DEFECON · the safety, defence and economy generators and their display

8 flagged sentences (HIGH 0), read at the joined line e5b421802 on 2026-11-14. EACH IS A CANDIDATE: a reader judged it against ONE town's facts (`town read in`): verify it by the record before you cure it. `towns` = how many of the 720 census towns print the sentence (names and figures aside): the measure of its width, not of its falsity. The machine form is `WORKLIST-DEFECON.json` beside this file (each row's `fold` is its key in an inventory).

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

- `src/generators/safetyProfile.js` · 7 · 128
- `src/generators/safetyLineTruth.js` · 1 · 35

## By writer (file :: function, table or pool; flagged sentences · towns printing, summed)

- src/generators/safetyProfile.js :: STANDARD_PATROL · 2 · 71
- src/generators/safetyProfile.js :: generateSafetyProfile · 5 · 57
- src/generators/safetyLineTruth.js :: patrolTruth · 1 · 35

## The sentences, HIGH first, then widest first

| sev | towns | id | section | town read in | sentence (as that town prints it) | what the reader said | writer |
|---|---|---|---|---|---|---|---|
| MED | 46 | 01020 | Systems/Defense | r2s-under_siege-city-3 | The garrison and city watch maintain standard patrol coverage. | standard patrol coverage under siege (stability Critical, safety Desperate Active Siege); tag reaches siege towns; routine patrols not so | src/generators/safetyProfile.js (line 999 at e5b421802) STANDARD_PATROL |
| MED | 35 | 01018 | Systems/Defense | r2r-city-44 | The garrison and city watch are well paid, well equipped and patrol properly. | well paid, well equipped, patrol properly; defence Defensible, legitimacy 0, hunger eroding order, monsters on roads, famine | src/generators/safetyLineTruth.js (line 76 at e5b421802) patrolTruth |
| MED | 25 | 01022 | Systems/Defense | r2s-famine-city-0 | The garrison and city watch walk the usual rounds. | watch and garrison walk the usual rounds; stability Desperate (hunger eroding order); tag reaches occupations where officers do not rule freely | src/generators/safetyProfile.js (line 1001 at e5b421802) STANDARD_PATROL |
| MED | 18 | 00442 | Systems/Economics | r2r-thorp-54 | Goods change hands here in back rooms and after dark, and nobody accounts for them. | back-room dark trade; HOUSES has no fence or black market, LAND no Black market chain; isolated, exports and imports none | src/generators/safetyProfile.js (line 709 at e5b421802) generateSafetyProfile |
| MED | 15 | 01272 | Systems/Defense | r2s-wartime-thorp-2 | Whatever the army's buyers will take is sold to them dear, and not all of it is as sound as it is said to be. | goods sold dear to army's buyers; trade access isolated, exports none, imports none, undefended, famine | src/generators/safetyProfile.js (line 642 at e5b421802) generateSafetyProfile |
| MED | 15 | 00345 | Systems/Defense | r2s-wartime-thorp-2 | Deserters passing through need food and discretion, and some here give both. | gives deserters food; famine deficit 72%, stores 0.1 months, no line offers food in famine; isolated thorp | src/generators/safetyProfile.js (line 644 at e5b421802) generateSafetyProfile |
| MED | 8 | 00606 | Systems/Defense | r2s-mass_migration-thorp-3 | Lodging and a way onward, sold quietly to newcomers who were told to move on. | 'Lodging ... sold quietly'; HOUSES has no inn or lodging house, thorp of 7 | src/generators/safetyProfile.js (line 654 at e5b421802) generateSafetyProfile |
| MED | 1 | 01026 | Systems/Defense | r2r-town-9 | The garrison and town watch keep what rounds they can while the supplies they need are cut off. | says supplies the forces need are cut off; CRISIS none, safety Very Safe, Well-Defended, imports cover 846 | src/generators/safetyProfile.js (line 377 at e5b421802) generateSafetyProfile |
