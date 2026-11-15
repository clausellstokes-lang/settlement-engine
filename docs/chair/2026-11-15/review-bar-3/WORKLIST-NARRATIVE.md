# READ-ALL worklist · NARRATIVE · the told history: origin prose and the narrative tables

11 flagged sentences (HIGH 0), read at the joined tree of 59185b62a on 2026-11-15 (REVIEW-BAR-3: thirty fresh towns, two readers each). EACH IS A CANDIDATE: a reader judged it against ONE town's facts (`town read in`): verify it by the record before you cure it. `towns` = how many of the 720 census towns printed the sentence (names and figures aside) at the census of 5d1e3096b2, TWO ROUNDS OLD: a hint of its width, not of its falsity: your own census run is the measure. The machine form is `WORKLIST-NARRATIVE.json` beside this file (each row's `fold` is its key in an inventory).

## YOUR FILES (no other seat holds them)

- `src/generators/narrativeGenerator.js`
- `src/generators/narrative/settlementOriginProse.js`
- `src/data/narrativeData.js`
- `src/data/stressInstitutionEffects.js`
- `src/generators/narrativeText.js`
- `src/domain/facts/founder.js`
- `src/generators/narrative/foundingRowAdmits.js`

## By file (flagged sentences · towns printing, summed)

- `src/generators/narrative/settlementOriginProse.js` · 1 · 28
- `src/generators/narrativeText.js` · 3 · 24
- `src/generators/narrativeGenerator.js` · 2 · 17
- `src/data/stressInstitutionEffects.js` · 4 · 14
- `src/data/narrativeData.js` · 1 · 0

## By writer (file :: function, table or pool; flagged sentences · towns printing, summed)

- src/generators/narrative/settlementOriginProse.js :: ORIGIN_POOLS · 1 · 28
- src/generators/narrativeText.js :: POLITICAL_FLAVOR · 3 · 24
- src/generators/narrativeGenerator.js :: genCoherence · 2 · 17
- src/data/stressInstitutionEffects.js :: STRESS_INSTITUTION_EFFECTS.needs · 4 · 14
- src/data/narrativeData.js :: STRESS_DESCS.occupied · 1 · 0

## The sentences, HIGH first, then widest first

| sev | towns | id | section | town read in | sentence (as that town prints it) | what the reader said | writer |
|---|---|---|---|---|---|---|---|
| MED | 28 | C30340 | Summary/Overview | bar0-town-occupied-rand-7 | Founded on the bank, where the current does the hauling; every trade here is priced against what the water carries for nothing. | Settlement Origin says founded on the river bank for the current; FOUNDING reason is the local soil, and C31778 prints the soil origin | src/generators/narrative/settlementOriginProse.js (line 117 at 59185b62a) ORIGIN_POOLS |
| MED | 16 | C18651 | Summary/Overview | bar0-metropolis-calm-rand-7 | Whoever controls trade and tithes holds more practical power than whoever holds the official seat. | Says trade and tithes outweigh the seat; Ducal Governorship Strong, Merchant Guilds Suppressed, Religious Minor, legitimacy Endorsed, stability Ordered | src/generators/narrativeGenerator.js (line 642 at 59185b62a) genCoherence |
| MED | 12 | C5938 | World/NPCs | bar0-city-under_siege+famine-rand-8 | Secret: Is receiving grain shipments through a covert route and selling them at triple the official price after dark | Potter receives grain shipments by a covert route under the siege; FOOD brought in 0%, gates shut, 'nothing has come through them since the siege began' | src/data/stressInstitutionEffects.js (line 102 at 59185b62a) STRESS_INSTITUTION_EFFECTS.needs |
| MED | 10 | C24238 | Summary/Overview | bar0-thorp-calm-rand-6 | "The tensions here are the domestic kind (inheritances, boundaries, precedence at the festival), and they are managed rather than resolved, passed down like the disputes they are, each generation adding a footnote and settling nothing" | says tensions are domestic inheritances/boundaries, managed; the record's live tension is magical controversy (C24267), legitimacy Contested | src/generators/narrativeText.js (line 474 at 59185b62a) POLITICAL_FLAVOR |
| MED | 10 | C33769 | Summary/Overview | bar0-village-calm-rand-7 | "The tensions here are the domestic kind (inheritances, boundaries, precedence at the festival), and they are managed rather than resolved, passed down like the disputes they are, each generation adding a footnote and settling nothing" | calls tensions domestic and managed; the town's live tension is a souring trade dispute and both power pairs are escalating | src/generators/narrativeText.js (line 474 at 59185b62a) POLITICAL_FLAVOR |
| MED | 4 | C24620 | Summary/Overview | bar0-thorp-calm-rand-7 | "Stable enough that its tensions are the slow kind: inherited grievances, unresolved inheritances, debts that have been rolled over so many times no one remembers the original amount" | says tensions are slow inherited grievances and debts; the record's live tension is the great flood quarrel (C24650); legitimacy Contested, Law & order Critical | src/generators/narrativeText.js (line 450 at 59185b62a) POLITICAL_FLAVOR |
| MED | 1 | C18650 | Summary/Overview | bar0-metropolis-calm-rand-7 | ℹEconomic activity flows through religious institutions, but formal governance rests with Ducal Governorship. | Economy flows through port, market and guild income; Religious Authorities are Minor and tithes only 7% of INCOME | src/generators/narrativeGenerator.js (line 642 at 59185b62a) genCoherence |
| MED | 1 | C35876 | World/NPCs | bar0-village-famine-rand-6 | Secret: Has documentation proving the famine was caused by export decisions made by Headman's Authority, and has been paid to lose it | says documents prove the famine was caused by export decisions; FOOD gives the failed source as fish and the page says the fishing failed | src/data/stressInstitutionEffects.js (line 107 at 59185b62a) STRESS_INSTITUTION_EFFECTS.needs |
| MED | 1 | C5844 | World/NPCs | bar0-city-under_siege+famine-rand-8 | Secret: Has documentation proving the famine was caused by export decisions made by Military/Guard, and has been paid to lose it | slash-joined roster label 'Military/Guard' used as one power's name beside a verb ('decisions made by Military/Guard') | src/data/stressInstitutionEffects.js (line 107 at 59185b62a) STRESS_INSTITUTION_EFFECTS.needs |
| MED | 0 | C30299 | Summary/Overview | bar0-town-occupied-rand-7 | The market is open, the streets are busy, the gates are attended by soldiers whose armour is not local. | market open, streets busy under occupation with curfew (safety 'Controlled — Occupation Curfew', stability Suppressed); ordinary busy-ness contradicts it | src/data/narrativeData.js (line 210 at 59185b62a) STRESS_DESCS.occupied |
| MED | 0 | C35910 | World/NPCs | bar0-village-famine-rand-6 | Secret: Helped cause the original shortfall that triggered the famine, believing it would only last a week | secret says Rain Nah helped cause the shortfall that triggered the famine; FOOD and the page say the fishing failed (failed source fish) | src/data/stressInstitutionEffects.js (line 97 at 59185b62a) STRESS_INSTITUTION_EFFECTS.needs |
