# REVIEW-BAR-2 worklist · DEFECON · the safety, defence and economy generators and their display

8 flagged sentences (HIGH 0), read at the joined line f8042b61a on 2026-11-15 (REVIEW-BAR-2: thirty fresh towns, each whole). EACH IS A CANDIDATE: a reader judged it against ONE town's facts (`town read in`): verify it by the record before you cure it. `towns` = how many of the 720 census towns printed the sentence at the read before (5d1e3096b, a day old; names and figures aside): the measure of its width, not of its falsity. The machine form is `WORKLIST-DEFECON.json` beside this file (each row's `fold` is its key in an inventory).

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

- `src/domain/display/defenseDisplay.js` · 1 · 488
- `src/generators/economy/prosperity.js` · 1 · 200
- `src/generators/economy/incomeLineSiblings.js` · 1 · 63
- `src/generators/safetyProfile.js` · 4 · 52
- `src/generators/safetyLineTruth.js` · 1 · 3

## By writer (file :: function, table or pool; flagged sentences · towns printing, summed)

- src/domain/display/defenseDisplay.js :: deriveSupportingCapabilities · 1 · 488
- src/generators/economy/prosperity.js :: complexityByExports · 1 · 200
- src/generators/economy/incomeLineSiblings.js :: TIMBER_LINE · 1 · 63
- src/generators/safetyProfile.js :: generateSafetyProfile · 4 · 52
- src/generators/safetyLineTruth.js :: patrolTruth · 1 · 3

## The sentences, HIGH first, then widest first

| sev | towns | id | section | town read in | sentence (as that town prints it) | what the reader said | writer |
|---|---|---|---|---|---|---|---|
| MED | 488 | C1229 | Systems/Defense | bar0-city-under_siege+famine-rand-3 | No arcane practitioners on the rolls. | 'No arcane practitioners on the rolls' but TRADE makes Spellcasting (minor) here and Divine & Magical Healing chain runs | src/domain/display/defenseDisplay.js (line 272 at f8042b61a) deriveSupportingCapabilities |
| MED | 200 | C4306 | Systems/Economics | bar0-city-under_siege+famine-rand-5 | Diversified — broad institutional economic base | economy printed 'Diversified — broad institutional economic base' while INCOME has Smuggling Network Revenue at 51%, a single source the page itself says supports most households | src/generators/economy/prosperity.js (line 422 at f8042b61a) complexityByExports |
| MED | 63 | C16557 | Systems/Economics | bar0-metropolis-calm-rand-3 | Timber Trade Local forest provides sustainable timber revenue; managed felling and sawmilling keep production consistent. | claims managed felling keeps timber production consistent; LAND gives Timber & Lumber vulnerable with Managed woodland absent | src/generators/economy/incomeLineSiblings.js (line 84 at f8042b61a) TIMBER_LINE |
| MED | 18 | C14738 | Systems/Defense | bar0-hamlet-under_siege-rand-4 | Those holding the place keep order, and more harshly as the food runs down. | says those holding the place keep order; no watch, militia or garrison (DEFENCE none) and Law & order reads Collapsed | src/generators/safetyProfile.js (line 150 at f8042b61a) generateSafetyProfile |
| MED | 18 | C15234 | Systems/Defense | bar0-hamlet-under_siege-rand-5 | Those holding the place keep order, and more harshly as the food runs down. | says those holding the place keep order; nobody is paid to keep order, DEFENCE has no watch or force, Law & order reads Collapsed | src/generators/safetyProfile.js (line 150 at f8042b61a) generateSafetyProfile |
| MED | 16 | C6890 | Systems/Defense | bar0-city-wartime-rand-3 | The garrison and city watch are disciplined but resource-constrained: motivated with inadequate equipment and irregular pay. | garrison and watch have 'inadequate equipment and irregular pay'; the same tab says defenders 'still paid on time' and the watch is 'well-funded' | src/generators/safetyProfile.js (line 414 at f8042b61a) generateSafetyProfile |
| MED | 3 | C25137 | Systems/Defense | bar0-town-calm-rand-3 | The garrison and town watch are well paid, well equipped and patrol properly. | says garrison and watch are well paid and well equipped; C25170 says accounts fall short on the watch's wages, C25150 says defenders cannot be kept equipped | src/generators/safetyLineTruth.js (line 81 at f8042b61a) patrolTruth |
| MED | 0 | C27195 | Systems/Defense | bar0-town-calm-rand-5 | The town watch is disciplined but resource-constrained: motivated with inadequate equipment and irregular pay. | watch has 'irregular pay'; contradicts C27210 'keep its defenders paid' and 'accounts have money in hand' against GOVERNMENT 'chronically underfunded' | src/generators/safetyProfile.js (line 414 at f8042b61a) generateSafetyProfile |
