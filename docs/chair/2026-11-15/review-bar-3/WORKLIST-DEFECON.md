# READ-ALL worklist · DEFECON · the safety, defence and economy generators and their display

8 flagged sentences (HIGH 0), read at the joined tree of 59185b62a on 2026-11-15 (REVIEW-BAR-3: thirty fresh towns, two readers each). EACH IS A CANDIDATE: a reader judged it against ONE town's facts (`town read in`): verify it by the record before you cure it. `towns` = how many of the 720 census towns printed the sentence (names and figures aside) at the census of 5d1e3096b2, TWO ROUNDS OLD: a hint of its width, not of its falsity: your own census run is the measure. The machine form is `WORKLIST-DEFECON.json` beside this file (each row's `fold` is its key in an inventory).

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

- `src/generators/safetyProfile.js` · 6 · 268
- `src/generators/safetyLineTruth.js` · 1 · 72
- `src/generators/resourceGenerator.js` · 1 · 59

## By writer (file :: function, table or pool; flagged sentences · towns printing, summed)

- src/generators/safetyProfile.js :: generateSafetyProfile · 6 · 268
- src/generators/safetyLineTruth.js :: NO_WATCH_OCCUPIED · 1 · 72
- src/generators/resourceGenerator.js :: buildViabilityReport · 1 · 59

## The sentences, HIGH first, then widest first

| sev | towns | id | section | town read in | sentence (as that town prints it) | what the reader said | writer |
|---|---|---|---|---|---|---|---|
| MED | 136 | C22802 | Systems/Economics | bar0-metropolis-calm-rand-8 | It is noticed, and so far it does little harm. | says shadow trade does little harm; Thieves' Guild has bought people inside the hall, officials corrupted, crime wave tension, Criminal Syndicate Revenue 11% | src/generators/safetyProfile.js (line 715 at 59185b62a) generateSafetyProfile |
| MED | 72 | C25320 | Systems/Defense | bar0-thorp-calm-rand-8 | A quarrel goes to the heads of the oldest families, and most are settled before they come to blows. | quarrels 'settled before they come to blows' by family heads, but page says violence routine, no law enforcement, quarrels settled with fists and knives | src/generators/safetyLineTruth.js (line 154 at 59185b62a) NO_WATCH_OCCUPIED |
| MED | 59 | C7614 | Systems/Resources | bar0-city-wartime-rand-6 | Complete production chain in place | 'Complete production chain in place' for bread and beer; LAND gives Grain & Bread and Brewing & Malting vulnerable, grain fields absent; city imports 32% of food | src/generators/resourceGenerator.js (line 382 at 59185b62a) buildViabilityReport |
| MED | 33 | C17459 | Systems/Defense | bar0-metropolis-calm-rand-6 | Crime exists but is well-managed. | says crime is well-managed; the crime wave tension says crime is rising faster than those in charge can answer it | src/generators/safetyProfile.js (line 323 at 59185b62a) generateSafetyProfile |
| MED | 31 | C14930 | Systems/Defense | bar0-hamlet-under_siege-rand-7 | Fake relics, forged dispensations, and corrupt clergy who treat their position as a commercial opportunity. | Corrupt clergy and fake relics under the church's cover; HOUSES has only Access to parish church, no church or clergy of its own | src/generators/safetyProfile.js (line 470 at 59185b62a) generateSafetyProfile |
| MED | 28 | C31257 | Systems/Defense | bar0-town-occupied-rand-7 | Thieves are scarce now; the danger is informers and occupation officials, and the resistance works out of sight. | 'Thieves are scarce now' contradicts crime wave tension (crime rising faster than the guard can answer), street gang, Criminal opportunity Elevated | src/generators/safetyProfile.js (line 140 at 59185b62a) generateSafetyProfile |
| MED | 20 | C20212 | Systems/Defense | bar0-metropolis-calm-rand-7 | Everyone comes in by the gates, where the guard sees them. | Everyone comes in by the gates; but smugglers get in beneath the walls and a port town takes arrivals by sea at the docks | src/generators/safetyProfile.js (line 308 at 59185b62a) generateSafetyProfile |
| MED | 20 | C26238 | Systems/Defense | bar0-town-calm-rand-6 | Everyone comes in by the gates, where the guard sees them. | says everyone comes in by the gates; the page elsewhere says smugglers have ways in beneath the walls and goods never reach the gate | src/generators/safetyProfile.js (line 308 at 59185b62a) generateSafetyProfile |
