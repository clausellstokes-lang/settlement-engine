# TAIL-HOUSES hand-back · the houses' descriptions and the catalogue

Seat: TAIL-HOUSES (builder). Branch `lane/tail-houses-2026-11-14`, cut from the joined line `lane/join-2026-11-14` at **bcad1a358**. Worklist: `docs/chair/2026-11-14/read-all/WORKLIST-HOUSES.{md,json}` on the chair's lane (194 rows, read at e5b421802). Kept current after every batch.

## The rulings worked to (the chair's, 2026-11-14; each vetoable by the owner)

- **(H1)** THE CRISIS CLASS IS NOT YOURS (a house's description of ordinary times printed under a siege, a plague or a famine): the SERVICES seat builds ONE leaf and one table for the Services and the Institutions tabs: you rewrite no description for a crisis: strike those rows as "the SERVICES seat's class" and list them in your hand-back with each house's catalogue id.
- **(H2)** YOURS: the rows false in ordinary times: a house described with what the town lacks (sea charts in a town with no water; a vintner selling where no grapes reach him; markets "in every quarter" in a place with one), a description that contradicts the house's own chain state, a catalogue row whose size words the tier cannot hold, a chain printed "Running" that the record's own chain state denies.
- **(H3)** A cure in src/data/institutionalCatalog.js that would change which houses a town is BORN with is a declared move of the record and a STOP: you cure descriptions and declarations, not the roster's draws. The record's own incoherence (a house the size cannot hold) is being measured by another seat: NAME what you meet.
- BRIEF-TAIL's laws as written (silence is true; a twin for a mute state; no draw moved; one home for one fact; no new vocabulary word without the chair).

## Instruments (how they are re-made)

A scratch worktree outside the main checkout, its own `npm ci`. The probes `git archive`d out of `lane/chair-2026-11-08` (`docs/chair/2026-11-14/probes/READ-ALL/`) and `lane/census-3-2026-11-14` (`docs/chair/2026-11-14/probes/CENSUS-3/`) to a directory outside every tree. One run: `sh census3.sh <wt> <out> 4`; `inventory.py <out> <inv.json>`; `inventory_diff.py before.json after.json <batch rows.json>`. A row's measure is by script over `corpus.ndjson.gz` only (no render to verify).

## Batch 1 · INPUT GAP: a house described at work on an input that never reaches it

THE SHAPE: "Potter exists but lacks access to clay" (`resourceAnalysis.gaps[]`, kind `missing`) and the page prints "No clay reaches the potter.", while the potter's card says it throws and fires pottery. The descriptions are drawn at birth (`steps/institutionDescDraw.js`), before the economy names the gap (`generateNarratives` -> `resourceAnalysis.gaps`), and the vocabulary has no resource word; so, on the precedent of 383f1d9a7 (the Mine), each text is REWORDED to claim the trade and not the present work ("whenever clay can be had"). 39 texts (13 catalogue rows, 26 variants and twins) of 11 houses: Potter, Brickmaker, Vintner, Dairy farmer (hamlet, village), Salt works (hamlet; village and up), Charcoal burner (the three no-forest twins), Sawmill, Tannery, Fishmonger, Glassblower, Smelter (the catalogue row and the two twins of W2-FIX-DATA-11). Every text-keyed copy moved with its text: the colour column (still COLOUR), the declaration ledger's rows, the declarations and sibling sets by key. NO DRAW MOVED: the same pools, the same hash, the same index.

MEASURE: a row is false in a town where the house printing it has a gap of kind `missing` (the Smelter: no chain of it with a live input and no ore imported). Before: census at bcad1a358 (720 towns, 29,874 distinct sentences).

Rows CURED (43; towns printing before -> after; town-rows false by the record before):

| id | towns | false before | sentence (before) |
|---|---|---|---|
| B27786 | 105 -> 0 | 69 | Wheel-thrown pottery for domestic use. |
| B07347 | 105 -> 0 | 69 | Fired in a small kiln. |
| B13260 | 105 -> 0 | 67 | Moulds and fires clay bricks for construction. |
| B05604 | 96 -> 0 | 2 | Converts raw ore to refined metal using charcoal-fueled furnaces. |
| B06417 | 90 -> 0 | 59 | Domestic ware thrown on the wheel: plates, jugs, and storage jars, all fired in a modest kiln. |
| B22004 | 74 -> 0 | 44 | Throws pottery at the wheel for the household (plates, jugs, vessels for storage) and fires it in a small kiln. |
| 10284 | 64 -> 0 | 64 | He sells by the barrel to taverns and by the bottle to the rich. |
| 28851 | 64 -> 0 | 64 | Where no vine grows, he imports and blends instead. |
| B12199 | 64 -> 0 | 64 | Makes and ages wine, whether from grapes grown near or must brought in. |
| B21511 | 63 -> 0 | 28 | The work depends on clay beds and fuel. |
| B04836 | 63 -> 0 | 28 | Clay is moulded and fired into building brick here, which allows sturdier, more lasting construction. |
| B17053 | 60 -> 0 | 37 | Shapes and fires clay into bricks for building. |
| B04629 | 60 -> 0 | 26 | Charcoal kilns, tended day and night while a burn lasts. |
| B27728 | 60 -> 0 | 26 | What they make feeds the hottest fires in the settlement. |
| 28978 | 54 -> 0 | 54 | Wine pressed and matured, from local fruit or imported must, sold in bulk to the taverns and direct to wealthy houses. |
| 11522 | 54 -> 0 | 54 | In a region without vines, the vintner turns importer and blender. |
| B04627 | 54 -> 0 | 2 | Charcoal furnaces reduce raw ore to refined metal, cast in bars for whoever will buy them. |
| B22261 | 48 -> 0 | 27 | Turf-covered kilns burn wood slowly down to charcoal, the fuel that forge and oven need to run hot. |
| B02406 | 45 -> 0 | 16 | A collier's kilns, smoking under their turf, turning whatever wood can be had into charcoal for forge and oven. |
| B06896 | 43 -> 0 | 10 | Evaporation pans or brine processing along the coast or riverbank. |
| B15887 | 21 -> 0 | 7 | Salt is won from local brine in broad evaporation pans. |
| B11634 | 18 -> 0 | 16 | Keeps cattle or goats for milk, butter, and cheese. |
| B20202 | 18 -> 0 | 16 | The only reliable fat and protein source during grain shortages. |
| B07025 | 14 -> 0 | 11 | Expands construction and furniture output. |
| B11635 | 11 -> 0 | 10 | Keeps cattle or goats for milk, butter, and soft cheese. |
| B06879 | 11 -> 0 | 10 | Essential protein and fat during lean grain seasons. |
| B16690 | 11 -> 0 | 10 | Sells the surplus to neighbours. |
| B05601 | 7 -> 0 | 5 | Converts hides into leather using oak bark. |
| B11633 | 6 -> 0 | 4 | Keeps a herd of cattle or goats for milk, butter, and cheese. |
| B10986 | 6 -> 0 | 4 | In a bad grain year it is the only fat and protein to be had. |
| B15022 | 6 -> 0 | 5 | Powered by water or ox, the saw reduces logs to planks and beams, widening the settlement's output of building timber and furniture. |
| B06894 | 5 -> 0 | 0 | Evaporates naturally saline brine into the raw salt used for preservation. |
| B22413 | 5 -> 0 | 0 | Viable only where salt flats, springs, or other workable brine deposits provide a local supply. |
| B15829 | 4 -> 0 | 3 | Runs cattle or goats for their milk, butter, and soft cheese. |
| B09217 | 3 -> 0 | 3 | Glass worked on a small scale: bottles, window panes, goblets. |
| B15828 | 3 -> 0 | 3 | Runs cattle or goats for their milk, butter, and cheese. |
| B04301 | 3 -> 0 | 0 | Boils or dries naturally saline brine, yielding the raw salt that preserves food. |
| B11476 | 3 -> 0 | 0 | It works only where salt flats, springs, or other workable deposits provide a local supply. |
| B11430 | 3 -> 0 | 2 | It lifts what building and furniture-making the village can do. |
| B04484 | 3 -> 0 | 3 | Buys, salts, and sells fish. |
| B06893 | 2 -> 0 | 1 | Evaporates brine to leave salt behind: the raw mineral used to preserve nearly everything. |
| B21518 | 2 -> 0 | 1 | The works can operate only where a strong local brine source supports it. |
| B09951 | 1 -> 0 | 1 | Hides become leather here, cured with oak bark. |

False before: 925 town-rows; after: every row GONE. Notes: the four hamlet Salt works rows (B06894, B22413, B04301, B11476) are false where the works stands on IMPORTED salt ("viable only where ... a local supply"), 0 by the `missing` measure but false by the reader's reason in every town that prints them (the works stands without a local supply); cured with their pool. The Smelter rows B05604 and B04627 are false in ordinary times in 2 towns each (6 census towns hold a Smelter with no ore at all); in their other towns the falsity is a siege's imports (H1, the SERVICES seat's class).

THE INVENTORY DIFF (before -> after1): sentences gone 64, new 52, IN FEWER TOWNS 0, in more towns 1. The one rise ("A handful of things about this village cannot all be true at once", 38 -> 40: r2r-village-49, r2r-village-57) was my own first wording of the Fishmonger catalogue line ("The link between the catch and the table." names a catch where the village has no fish source: the coherence battery's food-words, rightly); reworded to "The link between the fisher and the buyer." and both villages re-born: `record_coherence_battery` passes in both (as at the base). TRUE LINES REPLACED, told to the chair before the push: the reworded texts print also where the input DOES reach (e.g. "Plates, jugs, storage vessels." left 105 towns), each replaced by its rewording, true there as well. THE INHERITORS are exactly the 52 rewordings; read in place (r2s-famine-town-1, r2r-city-1, r2r-town-16: the card beside "No clay reaches the potter." / "No grapes reach the vintner.").

DECLARED MOVE: family `institutions[].desc` only (the field diff of r2r-village-49 before -> after1: its two descs, and the coherence receipt the fishmonger fix returns to pass).

Guard: `tests/data/tailHouses1Gaps.test.js`: 31 RED pairs (31 of 31 red at the base, each for its old text with the house lacking its input), 8 KEEP pairs (a house with its input still names its trade; green before and after); a plant of the old Potter catalogue line reds 1 of 31.

Gates: eslint 0 on the touched files; typecheck:domain:strict exit 0; typecheck:ratchet OK (167, ceiling 167); presumed-things `--check` fresh 147 at the base -> 145 (the two banked `smith` hits "forge and oven" of the charcoal twins left), the strip ban 1 (carried); 10 stale rows (the old literals) removed by `--shrink`; my first wording made 3 fresh hits (weekly market x2, salt flats x2, fishing): reworded before the commit, not banked. page-census `--grid`: 0 rises (2 falls: r2r-city-0, r2s-insurgency-metropolis-0, P7a). The test files that name the touched files (87): reds CARRIED from the joined line (the same at bcad1a358): gapLineHousesByKind (the half-way line), urbanBandInstitutions G5 (world_law_magic), wiringCensusDeclared (the annex columns), generatorGoldenMaster (byte-identical output: red at the base; this batch moves its descs too).

NAMED FOR THE SERVICES SEAT (their file, the Services column beside the same card): "Pottery and ceramics: Plates, jugs, storage crocks.", "Fired brick: Standard-size fired clay bricks by the cartload.", "Table wine" print in the towns where no clay / no grapes reach the house.

NAMED FOR THE RECORD SEAT (H3): every census Vintner lacks its grapes (184 of 184 gaps `missing`, none imported); Potter 172 / Brickmaker 132 / Charcoal burner 69 / Dairy farmer 36 / Salt works 25 houses stand with their input `missing`.

### The veto list, batch 1: every new line (towns printing; the smallest and the largest it reaches, and a siege, famine or occupation)

- "A wheel and a small kiln for domestic pottery: plates, jugs, storage vessels, made whenever clay can be had." (105 towns): r2s-slave_revolt-village-3 (171), r2s-succession_void-metropolis-3 (295,750), r2s-famine-town-1 (1,336)
- "Pottery for the household (plates, jugs, vessels for storage), thrown at the wheel and fired in a small kiln whenever there is clay to throw." (74 towns): r2s-plague_onset-village-2 (141), r2r-metropolis-8 (344,689), r2s-occupied-town-0 (1,580)
- "A wheel and a modest kiln for domestic ware: plates, jugs, and storage jars, as far as the clay to hand allows." (90 towns): r2r-village-43 (149), r2r-metropolis-13 (328,486), r2s-under_siege-city-1 (2,679)
- "Moulds and fires clay bricks for construction whenever clay can be had. Enables more permanent buildings. Requires clay and fuel." (105 towns): r2s-monster_pressure-village-2 (242), r2r-metropolis-8 (344,689), r2s-famine-town-3 (737)
- "Shapes and fires clay into bricks for building, when there is clay to shape. With them, structures can be made to last. Clay and fuel are needed." (60 towns): r2s-mass_migration-village-2 (219), r2r-metropolis-13 (328,486), r2s-occupied-town-0 (1,580)
- "Moulds and a kiln for building brick, fired whenever clay reaches them; brick allows sturdier, more lasting construction. The work depends on clay and fuel." (63 towns): r2s-recently_betrayed-town-2 (1,298), r2r-metropolis-14 (271,164), r2s-under_siege-city-3 (5,059)
- "Presses and ages wine from local grapes or imported must, in any year that either reaches the cellar. What it makes is sold in bulk, and by the bottle to wealthy clients." (66 towns): r2s-recently_betrayed-city-0 (2,407), r2s-succession_void-metropolis-3 (295,750), r2s-occupied-city-2 (13,152)
- "A cellar of presses and casks for wine, from grapes grown near or must brought in, whenever either can be had. Such wine as it holds goes by the barrel, and by the bottle to the rich." (64 towns): r2r-town-22 (540), r2r-metropolis-13 (328,486), r2s-under_siege-city-2 (11,745)
- "Wine pressed and matured from local fruit or imported must, when either comes to the cellar, and sold in bulk or direct to wealthy houses." (54 towns): r2s-wartime-town-1 (1,916), r2r-metropolis-8 (344,689), r2s-occupied-city-3 (4,671)
- "A dairy for milk, butter, and cheese from cattle or goats, wherever there are beasts to milk. Seasonal. Production peaks in summer." (18 towns): r2r-hamlet-12 (27), r2r-hamlet-52 (99), r2s-occupied-hamlet-3 (43)
- "Milk, butter, and cheese from cattle or goats, when there are beasts to run. The work is seasonal, and heaviest in summer." (3 towns): r2s-monster_pressure-hamlet-3 (48), r2s-politically_fractured-hamlet-1 (63), r2s-under_siege-hamlet-1 (57)
- "A dairy for milk, butter, and cheese, from a herd of cattle or goats where one can be kept. Seasonal work, cresting in the summer months." (6 towns): r2r-hamlet-15 (42), r2s-succession_void-hamlet-0 (99)
- "A dairy for milk, butter, and soft cheese, from cattle or goats wherever beasts can be kept. Any surplus goes to neighbours." (11 towns): r2s-occupied-village-1 (132), r2r-village-4 (391)
- "Milk, butter, and soft cheese from cattle or goats, when there are beasts to run. What isn't used is sold on." (4 towns): r2r-village-31 (234), r2r-village-14 (371)
- "A herd of cattle or goats, where one can be kept, for milk, butter, and soft cheese. Any surplus is sold on." (prints in no census town)
- "Evaporation pans and brine-works, at work whenever a saline source can be had. Every household needs salt." (43 towns): r2r-village-56 (117), r2r-metropolis-13 (328,486), r2s-under_siege-village-3 (123)
- "Evaporation pans and brine-works for making salt whenever brine can be had, and no household does without salt." (20 towns): r2r-village-41 (81), r2s-wartime-metropolis-3 (43,550), r2s-famine-town-2 (407)
- "Broad evaporation pans, where salt is won from brine whenever brine can be had. Salt is a necessity in every home." (21 towns): r2s-insurgency-village-1 (200), r2r-metropolis-45 (198,530), r2s-occupied-city-2 (13,152)
- "Evaporates saline brine, whenever brine can be had, into the raw salt used for preservation. It works best where brine lies near." (5 towns): r2r-hamlet-3 (50), r2r-hamlet-45 (85)
- "Boils or dries saline brine when brine can be had, yielding the raw salt that preserves food. It works best where workable brine lies close by." (3 towns): r2s-recently_betrayed-hamlet-0 (73), r2r-hamlet-10 (90)
- "Evaporates brine, when brine can be had, to leave salt behind: the raw mineral used to preserve nearly everything. A strong brine source close by serves it best." (2 towns): r2r-hamlet-18 (56), r2r-hamlet-53 (95)
- "Turf-covered kilns for burning wood slowly down to charcoal whenever wood can be had: the fuel that burns hottest." (48 towns): r2s-religious_conversion-hamlet-2 (49), r2r-metropolis-13 (328,486), r2s-under_siege-metropolis-0 (46,527)
- "Charcoal kilns, tended day and night while a burn lasts, whenever there is wood to burn. Charcoal feeds the hottest fires." (60 towns): r2r-hamlet-56 (74), r2s-succession_void-metropolis-3 (295,750), r2s-under_siege-village-0 (281)
- "A collier's kilns under their turf, for turning whatever wood can be had into charcoal, the fuel that burns hottest." (45 towns): r2s-plague_onset-hamlet-2 (24), r2r-metropolis-8 (344,689), r2s-occupied-city-1 (10,359)
- "Water- or ox-powered saw. Converts raw logs to planks and beams whenever logs reach it, for building and furniture." (14 towns): r2r-village-42 (144), r2r-village-26 (335)
- "A saw driven by water or ox, for cutting raw logs into planks and beams whenever logs can be had, for building and furniture-making." (3 towns): r2s-slave_revolt-village-2 (106), r2r-village-11 (374)
- "Powered by water or ox, the saw reduces logs to planks and beams whenever logs reach it, for building timber and furniture." (6 towns): r2r-village-52 (162), r2r-village-4 (391)
- "Converts hides into leather using oak bark, whenever hides can be had. Foul-smelling. Placed downstream. Essential for shoes, harness, and straps." (7 towns): r2r-village-9 (95), r2s-religious_conversion-village-3 (351), r2s-under_siege-village-2 (224)
- "Turns hides to leather with oak bark, when hides can be had. The stink of it keeps it downstream. Without it there are no shoes, no harness, no straps." (2 towns): r2r-village-52 (162), r2r-village-14 (371)
- "Hides become leather here whenever they can be had, cured with oak bark. It reeks, and so it sits downstream, but shoes, harness, and straps all depend on it." (1 towns): r2s-wartime-village-2 (370)
- "Buys, salts, and sells fish, when there is fish to be had. The link between the fisher and the buyer. Near water: fresh. Inland: dried or salted." (3 towns): r2r-village-49 (168), r2s-religious_conversion-village-0 (264)
- "Buys whatever catch can be had, salts it, and sells it on. The trade that carries fish from the net to the table. By the water it comes fresh; inland, dried or salted." (3 towns): r2r-village-31 (234), r2r-village-36 (368)
- "Deals in fish, when fish can be had: bought, salted, and sold. It bridges the fisherman and the eater. Near water the stock is fresh, further inland dried or salted." (5 towns): r2s-monster_pressure-village-2 (242), r2r-village-51 (359)
- "Small-scale glasswork, when sand can be had: bottles, window panes, goblets. Requires silica sand, potash, and a skilled furnace operator." (5 towns): r2r-town-55 (511), r2r-town-51 (2,465), r2s-famine-town-0 (1,696)
- "Glass worked on a small scale, whenever sand reaches the furnace: bottles, window panes, goblets. It calls for silica sand, potash, and a skilled hand at the furnace." (3 towns): r2r-town-41 (745), r2s-occupied-town-1 (1,994)
- "A modest glassworks for bottles, panes, and goblets, dependent on silica sand, potash, and a practised furnace operator." (5 towns): r2s-slave_revolt-town-3 (1,271), r2r-town-9 (2,161), r2s-famine-town-1 (1,336)
- "Converts raw ore to refined metal using charcoal-fueled furnaces, whenever ore reaches it." (96 towns): r2s-religious_conversion-town-0 (474), r2r-metropolis-8 (344,689), r2s-under_siege-city-2 (11,745)
- "Charcoal furnaces for reducing raw ore to refined metal whenever ore reaches them, cast in bars for whoever will buy them." (54 towns): r2s-monster_pressure-town-1 (1,295), r2r-metropolis-13 (328,486), r2s-under_siege-town-1 (1,339)
- "Refines crude ore into workable metal over charcoal fire whenever ore can be had, and sells it on by the bar." (46 towns): r2s-infiltrated-town-1 (319), r2s-politically_fractured-metropolis-2 (160,904), r2s-famine-town-0 (1,696)

## Left of the worklist

Batch 2 (the pronoun shape) next; then the governance shape and the size words. The crisis-class strikes (H1) are listed at the close.
