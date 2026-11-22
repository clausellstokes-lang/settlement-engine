# REVIEW-BAR-2 worklist · NARRATIVE · the told history: origin prose and the narrative tables

10 flagged sentences (HIGH 0), read at the joined line f8042b61a on 2026-11-15 (REVIEW-BAR-2: thirty fresh towns, each whole). EACH IS A CANDIDATE: a reader judged it against ONE town's facts (`town read in`): verify it by the record before you cure it. `towns` = how many of the 720 census towns printed the sentence at the read before (5d1e3096b, a day old; names and figures aside): the measure of its width, not of its falsity. The machine form is `WORKLIST-NARRATIVE.json` beside this file (each row's `fold` is its key in an inventory).

## YOUR FILES (no other seat holds them)

- `src/generators/narrativeGenerator.js`
- `src/generators/narrative/settlementOriginProse.js`
- `src/data/narrativeData.js`
- `src/data/stressInstitutionEffects.js`
- `src/generators/narrativeText.js`
- `src/domain/facts/founder.js`
- `src/generators/narrative/foundingRowAdmits.js`

## By file (flagged sentences · towns printing, summed)

- `src/generators/narrative/settlementOriginProse.js` · 5 · 313
- `src/data/stressInstitutionEffects.js` · 1 · 12
- `src/generators/narrativeText.js` · 2 · 9
- `src/data/narrativeData.js` · 2 · 4

## By writer (file :: function, table or pool; flagged sentences · towns printing, summed)

- src/generators/narrative/settlementOriginProse.js :: ORIGIN_POOLS · 5 · 313
- src/data/stressInstitutionEffects.js :: STRESS_INSTITUTION_EFFECTS.needs · 1 · 12
- src/generators/narrativeText.js :: PRESSURE_SENTENCES · 2 · 9
- src/data/narrativeData.js :: STRESS_DESCS.famine · 2 · 4

## The sentences, HIGH first, then widest first

| sev | towns | id | section | town read in | sentence (as that town prints it) | what the reader said | writer |
|---|---|---|---|---|---|---|---|
| MED | 104 | C29731 | Summary/Overview | bar0-town-occupied-rand-5 | Sited on a route already worn deep before anyone built here; a road a century old will not be abandoned in one. | route 'worn deep before anyone built here' yet 'a century old'; town is 222 years old, grew from a logging camp, so road cannot predate it | src/generators/narrative/settlementOriginProse.js (line 100 at f8042b61a) ORIGIN_POOLS |
| MED | 104 | C30771 | Summary/Overview | bar0-village-calm-rand-3 | Sited on a route already worn deep before anyone built here; a road a century old will not be abandoned in one. | route 'worn deep before anyone built here' yet 'a century old'; town is 177 years old, so the road cannot predate it | src/generators/narrative/settlementOriginProse.js (line 100 at f8042b61a) ORIGIN_POOLS |
| MED | 56 | C24150 | Summary/Overview | bar0-thorp-calm-rand-5 | The settlement grew along its verge, and for generations its news came on somebody else's cart. | says news came 'for generations'; the thorp is only 20 years old | src/generators/narrative/settlementOriginProse.js (line 97 at f8042b61a) ORIGIN_POOLS |
| MED | 31 | C14951 | Summary/Overview | bar0-hamlet-under_siege-rand-5 | All three still hold. | says the river's milling use still holds; HOUSES has only Access to external mill, no mill of its own (grain taken a day away) | src/generators/narrative/settlementOriginProse.js (line 117 at f8042b61a) ORIGIN_POOLS |
| MED | 18 | C25604 | Summary/Overview | bar0-town-calm-rand-4 | A road settlement: it makes its living from other people's journeys, in stabling and meals and small repairs. | says it lives by travellers' stabling and meals; FOUNDING is mineral deposits, exports salts/alum/sulfur, income markets/guilds; no stable on HOUSES | src/generators/narrative/settlementOriginProse.js (line 99 at f8042b61a) ORIGIN_POOLS |
| MED | 12 | C5063 | World/NPCs | bar0-city-under_siege+famine-rand-5 | Secret: Is receiving grain shipments through a covert route and selling them at triple the official price after dark | Potter receives grain shipments by a covert route and sells them; siege: nothing comes in by road, imports cover None (C4353, C4820). | src/data/stressInstitutionEffects.js (line 102 at f8042b61a) STRESS_INSTITUTION_EFFECTS.needs |
| MED | 7 | C5767 | Summary/Overview | bar0-city-wartime-rand-3 | Conscription has hollowed out the skilled workforce. | says conscription hollowed out the skilled workforce; Foundations reads Labor capacity Adequate | src/generators/narrativeText.js (line 252 at f8042b61a) PRESSURE_SENTENCES |
| MED | 2 | C10035 | Summary/Overview | bar0-city-wartime-rand-5 | Krasnoka is at war and, for now, on the right side of it: contracts are flowing, the garrison is reinforced, and the crown is paying. | says on the right side, crown paying, contracts flowing; the crisis page says a war it may not win, and the war takes most money | src/generators/narrativeText.js (line 243 at f8042b61a) PRESSURE_SENTENCES |
| MED | 2 | C34238 | Summary/Overview | bar0-village-famine-rand-5 | Dionkastro is orderly in the way that a settlement is orderly when order is being enforced. | calls the town orderly; stability is Desperate, hunger eroding order, and Foundations print Law & order Collapsed | src/data/narrativeData.js (line 191 at f8042b61a) STRESS_DESCS.famine |
| MED | 2 | C34241 | Summary/Overview | bar0-village-famine-rand-5 | A guard patrol passes and everyone steps aside. | a guard patrol passes; DEFENCE has no garrison or watch, and the militia 'cannot maintain consistent patrol'; streets 'badly guarded' | src/data/narrativeData.js (line 191 at f8042b61a) STRESS_DESCS.famine |
