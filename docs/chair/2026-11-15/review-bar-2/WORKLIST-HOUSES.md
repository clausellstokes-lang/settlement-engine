# REVIEW-BAR-2 worklist · HOUSES · the houses' descriptions and the catalogue

11 flagged sentences (HIGH 0), read at the joined line f8042b61a on 2026-11-15 (REVIEW-BAR-2: thirty fresh towns, each whole). EACH IS A CANDIDATE: a reader judged it against ONE town's facts (`town read in`): verify it by the record before you cure it. `towns` = how many of the 720 census towns printed the sentence at the read before (5d1e3096b, a day old; names and figures aside): the measure of its width, not of its falsity. The machine form is `WORKLIST-HOUSES.json` beside this file (each row's `fold` is its key in an inventory).

## YOUR FILES (no other seat holds them)

- `src/data/institutionDescColour.js`
- `src/data/institutionDescVariants.js`
- `src/data/institutionalCatalog.js`
- `src/data/resourceChains.js`
- `src/data/supplyChainData.js`
- `src/data/economicData.js`
- `src/data/geographyData.js`

## By file (flagged sentences · towns printing, summed)

- `src/data/institutionDescVariants.js` · 2 · 63
- `src/data/institutionalCatalog.js` · 6 · 63
- `src/data/institutionDescColour.js` · 2 · 6
- `src/data/geographyData.js` · 1 · 1

## By writer (file :: function, table or pool; flagged sentences · towns printing, summed)

- src/data/institutionDescVariants.js :: DESC_VARIANT_SIBLINGS · 1 · 60
- src/data/institutionalCatalog.js :: INSTITUTION_FAMILIES.town · 2 · 49
- src/data/institutionalCatalog.js :: INSTITUTION_FAMILIES.shared · 4 · 14
- src/data/institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS · 2 · 6
- src/data/institutionDescVariants.js :: PAIRS · 1 · 3
- src/data/geographyData.js :: TERRAIN_DATA.institutionModifiers · 1 · 1

## The sentences, HIGH first, then widest first

| sev | towns | id | section | town read in | sentence (as that town prints it) | what the reader said | writer |
|---|---|---|---|---|---|---|---|
| MED | 60 | C13357 | Systems/Institutions | bar0-hamlet-calm-rand-5 | Charcoal kilns, tended day and night while a burn lasts, whenever wood can be had. | charcoal burner shown at work producing charcoal (also C13402); LAND gaps say it lacks access to its timber input and the page marks no shortage | src/data/institutionDescVariants.js (line 1948 at f8042b61a) DESC_VARIANT_SIBLINGS |
| MED | 41 | C27929 | Systems/Institutions | bar0-town-occupied-rand-3 | Each congregation keeps its own ground beside its house of worship, and one that has filled its ground buries beyond the gate instead. | burials 'beyond the gate'; DEFENCE walls none, so no gate | src/data/institutionalCatalog.js (line 948 at f8042b61a) INSTITUTION_FAMILIES.town |
| MED | 8 | C26642 | Systems/Institutions | bar0-town-calm-rand-5 | Connection: Captain-Mayor Zorana Pavlov, the watch captain | titles Zorana Pavlov 'Captain-Mayor'; PEOPLE gives only 'the watch captain' (first of Military Council); GOVERNMENT lists no mayoralty | src/data/institutionalCatalog.js (line 1260 at f8042b61a) INSTITUTION_FAMILIES.town |
| MED | 6 | C15795 | Systems/Institutions | bar0-metropolis-calm-rand-3 | The ruling criminal syndicate, suffered because open gang war would be worse. | calls Thieves' Guild 'the ruling criminal syndicate'; GOVERNMENT has Shadow Senate Dominant and Thieves' Guild only Minor (corrupted by the Senate) | src/data/institutionDescColour.js (line 492 at f8042b61a) DESC_VARIANT_COLOUR_DECLARATIONS |
| MED | 6 | C34394 | Systems/Institutions | bar0-village-famine-rand-5 | The hamlet benefits from fees paid in kind. | calls the place 'The hamlet'; the town is a village of 251 | src/data/institutionalCatalog.js (line 1469 at f8042b61a) INSTITUTION_FAMILIES.shared |
| MED | 6 | C6173 | Systems/Institutions | bar0-city-wartime-rand-3 | Connection: Lord Mayor Declan O'Neill, the senior guild master | calls Declan O'Neill Lord Mayor; GOVERNMENT lists only City Council, and PEOPLE gives his title as senior guild master, first of City Council | src/data/institutionalCatalog.js (line 322 at f8042b61a) INSTITUTION_FAMILIES.shared |
| MED | 3 | C13894 | Systems/Institutions | bar0-hamlet-under_siege-rand-3 | It needs grain to spare before it can work at all. | maltster row unmarked and 'needs grain to spare' yet FOOD is Deficit (grown 32%, gap 40%) under siege; no grain can be spare | src/data/institutionDescVariants.js (line 187 at f8042b61a) PAIRS |
| MED | 2 | C2149 | Systems/Institutions | bar0-city-under_siege+famine-rand-4 | Connection: Lord Mayor Maroula Mosele, the senior craft-guild master | 'Lord Mayor' for Maroula Mosele, who is (f) in PEOPLE; GOVERNMENT is City Council, no lord mayor office | src/data/institutionalCatalog.js (line 899 at f8042b61a) INSTITUTION_FAMILIES.shared |
| MED | 1 | C2828 | Systems/Outlook | bar0-city-under_siege+famine-rand-4 | Population of 2,338 with only 1 craft institution. | 'Only 1 craft institution': HOUSES has Carpenters, Sawmill, Tanners, Bakers, Chandler, Craft guilds, Alchemist quarter; 'Add craft guilds' though Craft guilds (30-80) exist | src/data/geographyData.js (line 560 at f8042b61a) TERRAIN_DATA.institutionModifiers |
| MED | 0 | C0434 | Systems/Institutions | bar0-city-under_siege+famine-rand-3 | In trade, a power in their own right. | calls merchant guilds 'a power in their own right'; GOVERNMENT lists no merchant power (Religious, Noble, Military/Guard, War Council, Shield Compact) | src/data/institutionDescColour.js (line 351 at f8042b61a) DESC_VARIANT_COLOUR_DECLARATIONS |
| MED | 0 | C25669 | Systems/Institutions | bar0-town-calm-rand-4 | Connection: Mayor Zenobia Flavius, the senior craft-guild master | calls Zenobia Flavius 'Mayor'; PEOPLE gives her only 'the senior craft-guild master'; GOVERNMENT lists no mayor, only a Town Council | src/data/institutionalCatalog.js (line 899 at f8042b61a) INSTITUTION_FAMILIES.shared |
