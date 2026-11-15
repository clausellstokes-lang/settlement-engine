# READ-ALL worklist · HOUSES · the houses' descriptions and the catalogue

4 flagged sentences (HIGH 0), read at the joined line e5b421802 on 2026-11-14. EACH IS A CANDIDATE: a reader judged it against ONE town's facts (`town read in`): verify it by the record before you cure it. `towns` = how many of the 720 census towns print the sentence (names and figures aside): the measure of its width, not of its falsity. The machine form is `WORKLIST-HOUSES.json` beside this file (each row's `fold` is its key in an inventory).

## YOUR FILES (no other seat holds them)

- `src/data/institutionDescColour.js`
- `src/data/institutionDescVariants.js`
- `src/data/institutionalCatalog.js`
- `src/data/resourceChains.js`
- `src/data/supplyChainData.js`
- `src/data/economicData.js`
- `src/data/geographyData.js`

## By file (flagged sentences · towns printing, summed)

- `src/data/supplyChainData.js` · 2 · 952
- `src/data/institutionalCatalog.js` · 1 · 13
- `src/data/institutionDescVariants.js` · 1 · 8

## By writer (file :: function, table or pool; flagged sentences · towns printing, summed)

- src/data/supplyChainData.js :: SUPPLY_CHAIN_NEEDS.criminal_economy · 2 · 952
- src/data/institutionalCatalog.js :: INSTITUTION_FAMILIES.city · 1 · 13
- src/data/institutionDescVariants.js :: PAIRS · 1 · 8

## The sentences, HIGH first, then widest first

| sev | towns | id | section | town read in | sentence (as that town prints it) | what the reader said | writer |
|---|---|---|---|---|---|---|---|
| MED | 476 | C3818 | Systems/Economics | bar0-city-wartime-rand-2 | Shadow Economy: 33% capture▲ | prints shadow economy 33% capture; INCOME gives Shadow Economy (untaxed) as 19% of the town's money | src/data/supplyChainData.js (line 1394 at e5b421802) SUPPLY_CHAIN_NEEDS.criminal_economy |
| MED | 476 | C5673 | Systems/Economics | bar0-hamlet-under_siege-rand-2 | Shadow Economy: 5% capture▲ | prints a 5% Shadow Economy capture; INCOME lists only Harvest 100%, and TRADE has no imports or exports to hide | src/data/supplyChainData.js (line 1394 at e5b421802) SUPPLY_CHAIN_NEEDS.criminal_economy |
| MED | 13 | C6365 | Systems/Institutions | bar0-metropolis-calm-rand-2 | Connection: Lord Marshal Arwa al-Kindi, the watch commander | 'Lord Marshal' title for Arwa al-Kindi, who is female (f) in PEOPLE | src/data/institutionalCatalog.js (line 1261 at e5b421802) INSTITUTION_FAMILIES.city |
| MED | 8 | C8996 | Systems/Institutions | bar0-town-calm-rand-2 | With no formal government in place, a loose council of leading citizens runs the town. | says no formal government in place and the council answers to no one; GOVERNMENT has Church Council dominant, Stable, Tolerated, with rival powers | src/data/institutionDescVariants.js (line 758 at e5b421802) PAIRS |
