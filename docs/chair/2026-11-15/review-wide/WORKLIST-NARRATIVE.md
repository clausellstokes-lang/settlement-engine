# READ-ALL worklist · NARRATIVE · the told history: origin prose and the narrative tables

10 flagged sentences (HIGH 0), read at the joined tree of 59185b62a on 2026-11-15 (the WIDE read: 29 more fresh towns, twelve cities under siege and famine, twelve at war, five calm hamlets, ONE reader each). EACH IS A CANDIDATE: a reader judged it against ONE town's facts (`town read in`): verify it by the record before you cure it. `towns` = how many of the 720 census towns printed the sentence (names and figures aside) at the census of 5d1e3096b2, TWO ROUNDS OLD: a hint of its width, not of its falsity: your own census run is the measure. The machine form is `WORKLIST-NARRATIVE.json` beside this file (each row's `fold` is its key in an inventory).

## YOUR FILES (no other seat holds them)

- `src/generators/narrativeGenerator.js`
- `src/generators/narrative/settlementOriginProse.js`
- `src/data/narrativeData.js`
- `src/data/stressInstitutionEffects.js`
- `src/generators/narrativeText.js`
- `src/domain/facts/founder.js`
- `src/generators/narrative/foundingRowAdmits.js`

## By file (flagged sentences · towns printing, summed)

- `src/data/stressInstitutionEffects.js` · 4 · 37
- `src/data/narrativeData.js` · 3 · 6
- `src/generators/narrativeText.js` · 3 · 1

## By writer (file :: function, table or pool; flagged sentences · towns printing, summed)

- src/data/stressInstitutionEffects.js :: STRESS_INSTITUTION_EFFECTS.needs · 4 · 37
- src/data/narrativeData.js :: STRESS_DESCS.under_siege · 2 · 6
- src/generators/narrativeText.js :: PRESSURE_SENTENCES · 3 · 1
- src/data/narrativeData.js :: STRESS_DESCS.wartime · 1 · 0

## The sentences, HIGH first, then widest first

| sev | towns | id | section | town read in | sentence (as that town prints it) | what the reader said | writer |
|---|---|---|---|---|---|---|---|
| MED | 12 | C14995 | World/NPCs | bar0-city-under_siege+famine-rand-16 | Secret: Is receiving grain shipments through a covert route and selling them at triple the official price after dark | midwife receives grain shipments by a covert route; siege cuts every road, FOOD brought in 0%, 'No food comes in by trade' (C14274) | src/data/stressInstitutionEffects.js (line 102 at 59185b62a) STRESS_INSTITUTION_EFFECTS.needs |
| MED | 12 | C17349 | World/NPCs | bar0-city-under_siege+famine-rand-17 | Secret: Is receiving grain shipments through a covert route and selling them at triple the official price after dark | states grain shipments arrive by a covert route; FOOD brought in 0% and the siege has shut every road and gate | src/data/stressInstitutionEffects.js (line 102 at 59185b62a) STRESS_INSTITUTION_EFFECTS.needs |
| MED | 12 | C3989 | World/NPCs | bar0-city-under_siege+famine-rand-11 | Secret: Is receiving grain shipments through a covert route and selling them at triple the official price after dark | grain shipments arriving by a covert route under siege; FOOD gives brought in 0% and the page says no food comes in at all | src/data/stressInstitutionEffects.js (line 102 at 59185b62a) STRESS_INSTITUTION_EFFECTS.needs |
| MED | 3 | C4391 | Summary/Overview | bar0-city-under_siege+famine-rand-12 | A runner comes out of the small side gate, sees your group, stops. | runner comes out of a side gate; CRISIS Under Siege: nothing goes in or out by gate, and C04387 says the gates are closed | src/data/narrativeData.js (line 163 at 59185b62a) STRESS_DESCS.under_siege |
| MED | 3 | C6106 | Summary/Overview | bar0-city-under_siege+famine-rand-13 | A runner comes out of the small side gate, sees your group, stops. | a runner comes out of a side gate and meets arrivals, but the city is under siege with gates closed and nothing going in or out | src/data/narrativeData.js (line 163 at 59185b62a) STRESS_DESCS.under_siege |
| MED | 1 | C17218 | World/NPCs | bar0-city-under_siege+famine-rand-17 | Secret: Has documentation proving the famine was caused by export decisions made by Royal Authority, and has been paid to lose it | says the famine was caused by Royal Authority's export decisions; FOOD gives failed source livestock and TRADE exports list no food | src/data/stressInstitutionEffects.js (line 107 at 59185b62a) STRESS_INSTITUTION_EFFECTS.needs |
| MED | 1 | C34042 | Summary/Overview | bar0-city-wartime-rand-13 | Being on the right side of it keeps the forges of Rundplatz running day and night, and the fish trade has never paid better, and the place now needs the war to go on to pay for what the war has already cost it. | says the fish trade has never paid better; the Tensions section says the fish trade is under strain | src/generators/narrativeText.js (line 246 at 59185b62a) PRESSURE_SENTENCES |
| MED | 0 | C4398 | Summary/Overview | bar0-city-under_siege+famine-rand-12 | Word came into Dionrion three days ago that the relief column had turned back; Eudokia Limniotes, the Lord Warden, has not made it public, and the effort of not making it public is beginning to show. | calls Eudokia Limniotes 'the Lord Warden'; PEOPLE gives her as f, 'the dean' heading the Ecclesiastical Council | src/generators/narrativeText.js (line 108 at 59185b62a) PRESSURE_SENTENCES |
| MED | 0 | C52131 | Summary/Overview | bar0-city-wartime-rand-9 | This is not a market city's traffic. | 'not a market city's traffic' but INCOME is Market Taxes 30%, Entrepôt 14%, Toll 14%; HOUSES has daily markets and market squares | src/data/narrativeData.js (line 372 at 59185b62a) STRESS_DESCS.wartime |
| MED | 0 | C6113 | Summary/Overview | bar0-city-under_siege+famine-rand-13 | Word came into Edznaxochitl three days ago that the relief column had turned back; Chan Uc, the Lord Mayor, has not made it public, and the effort of not making it public is beginning to show. | Chan Uc is f, 'the senior guild master'; text calls her 'the Lord Mayor': male title and an office GOVERNMENT does not list | src/generators/narrativeText.js (line 108 at 59185b62a) PRESSURE_SENTENCES |
