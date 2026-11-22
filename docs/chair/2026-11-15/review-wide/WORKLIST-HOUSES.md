# READ-ALL worklist · HOUSES · the houses' descriptions and the catalogue

6 flagged sentences (HIGH 0), read at the joined tree of 59185b62a on 2026-11-15 (the WIDE read: 29 more fresh towns, twelve cities under siege and famine, twelve at war, five calm hamlets, ONE reader each). EACH IS A CANDIDATE: a reader judged it against ONE town's facts (`town read in`): verify it by the record before you cure it. `towns` = how many of the 720 census towns printed the sentence (names and figures aside) at the census of 5d1e3096b2, TWO ROUNDS OLD: a hint of its width, not of its falsity: your own census run is the measure. The machine form is `WORKLIST-HOUSES.json` beside this file (each row's `fold` is its key in an inventory).

## YOUR FILES (no other seat holds them)

- `src/data/institutionDescColour.js`
- `src/data/institutionDescVariants.js`
- `src/data/institutionalCatalog.js`
- `src/data/resourceChains.js`
- `src/data/supplyChainData.js`
- `src/data/economicData.js`
- `src/data/geographyData.js`

## By file (flagged sentences · towns printing, summed)

- `src/data/supplyChainData.js` · 1 · 177
- `src/data/institutionalCatalog.js` · 3 · 66
- `src/data/institutionDescVariants.js` · 1 · 54
- `src/data/institutionDescColour.js` · 1 · 3

## By writer (file :: function, table or pool; flagged sentences · towns printing, summed)

- src/data/supplyChainData.js :: SUPPLY_CHAIN_NEEDS.services · 1 · 177
- src/data/institutionDescVariants.js :: PAIRS · 1 · 54
- src/data/institutionalCatalog.js :: INSTITUTION_FAMILIES.shared · 2 · 53
- src/data/institutionalCatalog.js :: INSTITUTION_FAMILIES.city · 1 · 13
- src/data/institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS · 1 · 3

## The sentences, HIGH first, then widest first

| sev | towns | id | section | town read in | sentence (as that town prints it) | what the reader said | writer |
|---|---|---|---|---|---|---|---|
| MED | 177 | C14378 | Systems/Economics | bar0-city-under_siege+famine-rand-16 | Furs originate in frontier/northern settlements and travel south through trading posts. | says furs originate in northern settlements and this is a mid-route town; LAND/TRADE give furs made here from its own hunting grounds (Furs & Pelts running) | src/data/supplyChainData.js (line 815 at 59185b62a) SUPPLY_CHAIN_NEEDS.services |
| MED | 54 | C18117 | Systems/Institutions | bar0-city-under_siege+famine-rand-18 | Wine pressed and matured from local fruit or imported must, when either comes to the cellar, and sold in bulk or direct to wealthy houses. | Vintner row offers table wine and wholesale with no short mark; LAND gaps say the vintner lacks access to grapes (Potter, Brickmaker rows are marked short) | src/data/institutionDescVariants.js (line 663 at 59185b62a) PAIRS |
| MED | 47 | C13819 | Systems/Institutions | bar0-city-under_siege+famine-rand-16 | Significant ongoing revenue via seigniorage. | mint 'significant ongoing revenue via seigniorage'; INCOME lists no coinage source and Mining & Coinage chain is impaired (precious metal veins depleted) | src/data/institutionalCatalog.js (line 569 at 59185b62a) INSTITUTION_FAMILIES.shared |
| MED | 13 | C46800 | Systems/Institutions | bar0-city-wartime-rand-18 | Connection: Lord Marshal Manchu Hayashi, the watch commander | 'Lord Marshal' for Manchu Hayashi, who is (f) in PEOPLE; the title does not fit her sex | src/data/institutionalCatalog.js (line 1261 at 59185b62a) INSTITUTION_FAMILIES.city |
| MED | 6 | C6627 | Systems/Institutions | bar0-city-under_siege+famine-rand-13 | Connection: Lord Mayor Chan Uc, the senior guild master | calls Chan Uc (f, 'the senior guild master') 'Lord Mayor': male title, and GOVERNMENT lists only a City Council, no mayor | src/data/institutionalCatalog.js (line 322 at 59185b62a) INSTITUTION_FAMILIES.shared |
| MED | 3 | C54334 | Systems/Institutions | bar0-hamlet-calm-rand-11 | It is the hinge of the desert trade (water, fodder, and protection, all for a fee), and without it no caravan crosses the country around in safety. | calls the caravanserai the hinge of desert trade offering water, fodder, protection; LAND gap says Caravanserai lacks access to camel_herds | src/data/institutionDescColour.js (line 73 at 59185b62a) DESC_VARIANT_COLOUR_DECLARATIONS |
