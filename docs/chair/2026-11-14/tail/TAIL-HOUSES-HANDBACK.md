# TAIL-HOUSES hand-back · the houses' descriptions and the catalogue

Seat: TAIL-HOUSES (builder). Branch `lane/tail-houses-2026-11-14`, cut from the joined line `lane/join-2026-11-14` at **bcad1a358**. Worklist: `docs/chair/2026-11-14/read-all/WORKLIST-HOUSES.{md,json}` on the chair's lane (194 rows, read at e5b421802). Kept current after every batch.

## The rulings worked to (the chair's, 2026-11-14; each vetoable by the owner)

- **(H1)** THE CRISIS CLASS IS NOT YOURS (a house's description of ordinary times printed under a siege, a plague or a famine): the SERVICES seat builds ONE leaf and one table for the Services and the Institutions tabs: you rewrite no description for a crisis: strike those rows as "the SERVICES seat's class" and list them in your hand-back with each house's catalogue id.
- **(H2)** YOURS: the rows false in ordinary times: a house described with what the town lacks (sea charts in a town with no water; a vintner selling where no grapes reach him; markets "in every quarter" in a place with one), a description that contradicts the house's own chain state, a catalogue row whose size words the tier cannot hold, a chain printed "Running" that the record's own chain state denies.
- **(H3)** A cure in src/data/institutionalCatalog.js that would change which houses a town is BORN with is a declared move of the record and a STOP: you cure descriptions and declarations, not the roster's draws. The record's own incoherence (a house the size cannot hold) is being measured by another seat: NAME what you meet.
- **(H5)**, 2026-11-15 00:00-00:40 UTC: THE CRISIS-WORDED ROWS ARE THE LEAF'S (H1 stands: no text is rewritten for a crisis). The leaf is built and landed: `src/domain/display/crisisStoppedRow.js` with its table `src/data/crisisDependence.js` (services by name, houses by catalogue id, chains by chain id, income shares by source). THIS SEAT'S PART, by script, no cure: for each H1 candidate and each crisis row of X9, is the row's house (catalogue id) in the table for the crisis that makes the row false? IN THE TABLE: struck "answered by the leaf". NOT IN THE TABLE: the id, the crisis and the row, to the chair in ONE message (the services seat adds them).
- **(H6)**: NO RESOURCE WORD IN THE VOCABULARY ("a chain's input reaches its house" is the record's own chain state: the leaf marks a house short of its input; a text claims the trade by the hedge form). The Vintner finding (184 of 184 without grapes) is passed to the record's seat. The hedged texts stay as they are.
- **(H7)**: THE ORDINARY-TIMES ROWS, by shape, in batches: a house text naming a council, a guild rule or a charter the town does not have reads the record (a condition by an atom this branch holds, or a twin that claims no more than every printing town bears; `ruling body` and `rival power` are on other branches: a line that needs one is PARKED with its measure); a mine's or quarry's text over a depleted resource takes the hedge form; a text naming a citadel, a gate or a wall reads the defence, or takes a twin without it; a supply chain's output named where the chain does not run takes the hedge form.
- **(H8)**: A CLASS BEING MEASURED, not this seat's to move: prose written before its facts are final (true when drawn, false because the record moved afterwards): such a row is NAMED with that reason.
- **(X9)**: THE EXPORTS' READ, `docs/chair/2026-11-14/read-all-3/WORKLIST3-HOUSES.{md,json}` (98 rows only the PDF and the journal print), measured with `SURFACES=PDF,Journal python3 inventory.py <out-dir> x.json`. Order: H5's check first; then H7's rows by width; then what is left of X9.
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

## Batch 2 · THE PERSON'S SEX: a house description gives its one person a sex the roster draws either way

THE SHAPE (H2): "Casks for storage and carriage, all his making." where the cooper (`npcs[].institution.key` = the house) is a woman; "Women brew and sell ale." where the alewife is a man. 26 texts of 21 houses (1 catalogue row, 25 variants) reworded to name no sex: Lord's reeve (2), Shepherd (2), Charcoal burner (hamlet, forest), Peat cutter, Lord's steward (2), Ale house (3), Mill, Blacksmith, Carpenter, Cooper, Woodcarver, Cartographer's workshop, Village reeve (2), Fence, Village musician (2), Blacksmiths (3-10), Jeweller (2), Village scribe. The Shepherd's two lines also named a cloth trade the hamlet may not have ("a mainstay of the cloth trade", 22215's second reason): now "Wool is what the flocks are chiefly kept for." The Woodcarver's "For the church" (the walker's `temple` word) and the Scribe's "the priest's helper" leave with them. No draw moved; desc only.

Before: after1 (the batch-1 tree). False before: 139 town-rows over the 26 texts (the house's person of the other sex); the 10 worklist rows:

| id | towns | false before | sentence (before) |
|---|---|---|---|
| B04586 | 70 -> 0 | 29 | Casks for storage and carriage, all his making. |
| B08883 | 49 -> 0 | 24 | For the church he shapes sacred images and reliquaries. |
| B27992 | 11 -> 0 | 6 | Women brew and sell ale. |
| B02719 | 7 -> 0 | 4 | A mapmaker who draws and sells his work: road maps of the region, property surveys, and rough sketches of the wilds pieced from travellers' tales. |
| B09755 | 7 -> 0 | 3 | He works to commission, values stones, and now and then buys from customers who keep quiet about provenance. |
| B27993 | 6 -> 0 | 3 | Women brew the ale and sell it. |
| B14866 | 3 -> 0 | 3 | Placed by a lord who never visits, he holds official charge of the settlement. |
| B20237 | 3 -> 0 | 3 | The paperwork backs him. |
| 22215 | 2 -> 0 | 2 | The textile trade leans on him. |
| B22002 | 1 -> 0 | 1 | Through his songs the settlement's history is remembered. |

After: all 10 GONE (78 false town-rows -> 0). THE INVENTORY DIFF (after1 -> after2): gone 29, new 29, in more towns 0, IN FEWER TOWNS 1: "A handful of things about this village cannot all be true at once" 40 -> 38, the batch-1 Fishmonger fix landing (r2r-village-49, r2r-village-57; see batch 1). The 29 inheritors are exactly the rewordings (read in place: r2r-city-1 the cooper, r2r-village-11 the mill and ale house, r2r-thorp-16 the reeve). One count reads 44 against its sibling's 45 ("Water or wind drives the grindstones ..."): a fold artifact (r2r-village-49 holds a name token "Water"); the line prints there. My first wording made 4 fresh walker hits (`mill`, `house: reeve` x2, `smith`): reworded before the commit ("Whoever keeps them ...", "Chosen from among the peasants to ...", "Several ironworkers ..."), not banked.

Guard: `tests/data/tailHouses2Pronouns.test.js`: 18 RED pairs (18 of 18 red at the base, each where the house's person is of the other sex), 5 KEEP pairs (green at the base and after).

Gates: eslint 0; typecheck:domain:strict 0; ratchet 167/167; presumed-things fresh 145 (unchanged from batch 1; base 147), 3 stale rows and 2 first-register rows removed by `--shrink`; grid 0 rises (the same 2 falls); the 85 test files naming the touched files: the same 4 carried reds, nothing else.

NOT TAKEN (gendered, not flagged, walker-bound): the Town crier ("his wage", beside banked `market` words: a reword is a fresh hit until the word goes), "Sage's quarter: learned men", the Druid Circle's "when they trouble men" (generic), the Lord's appointee "A man of the lord's choosing" (02794, left with the governance shape).

### The veto list, batch 2

- "A distant lord's officer, set here to watch the settlement and remit what it owes. The writ is legitimate; the welcome is not." (3 towns): r2s-indebted-thorp-0 (12), r2r-thorp-4 (30)
- "Placed by a lord who never visits, this officer holds official charge of the settlement. The paperwork backs the office. The neighbours do not." (3 towns): r2r-thorp-16 (10), r2s-mass_migration-thorp-0 (21)
- "Keeps flocks of sheep for wool and mutton, driving them by season between the low winter pastures and the high summer grazing. Wool is what the flocks are chiefly kept for." (3 towns): r2r-hamlet-9 (33), r2s-succession_void-hamlet-0 (99)
- "Runs sheep for their wool and meat, moving the flocks with the seasons: down to the lowland in winter, up to the hills in summer. Wool is the first of what the flocks yield." (2 towns): r2r-hamlet-45 (85), r2r-hamlet-27 (96)
- "Works kilns in the woodland close by, turning timber into the fuel that burns hottest. Without the kilns nothing gets from the trees to the fire." (prints in no census town)
- "Cuts peat from the marsh nearby and dries it into blocks for the hearth. Seasonal work: what it sells is winter warmth." (6 towns): r2s-insurgency-hamlet-1 (75), r2r-village-4 (391)
- "A lord's agent runs the hamlet's holdings, gathers the rents, and speaks for noble authority." (7 towns): r2r-hamlet-0 (22), r2s-slave_revolt-hamlet-2 (98)
- "The office acts for the lord: it administers the land, takes in rent, and imposes the noble's will." (4 towns): r2r-hamlet-40 (27), r2s-plague_onset-hamlet-3 (97)
- "Home-based. Ale brewed in the house and sold from it." (11 towns): r2s-slave_revolt-village-2 (106), r2s-infiltrated-village-2 (388), r2s-under_siege-village-2 (224)
- "Run from the home. Ale is brewed and sold under the same roof." (9 towns): r2r-village-49 (168), r2s-slave_revolt-village-0 (386)
- "A household trade. The ale is brewed at home and sold there." (6 towns): r2s-under_siege-village-3 (123), r2r-village-51 (359)
- "Works metal full-time. Tools and horseshoes depend on this work." (13 towns): r2r-village-55 (102), r2r-village-34 (355), r2s-under_siege-village-2 (224)
- "Houses, carts, and furniture, all of it made here." (6 towns): r2r-village-18 (225), r2r-village-48 (387)
- "Casks for storage and carriage, all made here." (70 towns): r2r-town-36 (440), r2r-metropolis-45 (198,530), r2s-under_siege-city-0 (13,252)
- "Carves both plain and decorative pieces from wood: handles for tools, religious figures, furniture inlay. Sacred images and reliquaries are carved here too." (49 towns): r2r-town-49 (1,724), r2r-metropolis-8 (344,689)
- "A mapmaker's workshop, drawing and selling road maps of the region, property surveys, and rough sketches of the wilds pieced from travellers' tales. Uncommon enough that most villages lack one." (7 towns): r2r-village-33 (132), r2r-village-4 (391), r2s-under_siege-village-0 (281)
- "Chosen from among the peasants to arrange the work owed, settle quarrels, and stand for the village before any outside power." (3 towns): r2r-village-17 (156), r2s-monster_pressure-village-0 (267)
- "A peasant elected by the others, to parcel out the labour dues, mediate disputes, and speak for the village to those above it." (2 towns): r2r-village-45 (270), r2s-slave_revolt-village-0 (386)
- "The one to see when stolen goods need moving without noise. The dealing is done from behind a legitimate trade." (7 towns): r2s-monster_pressure-village-3 (207), r2r-town-33 (1,471)
- "A singer, fiddler, or piper who lives here, playing the festivals and the weddings, and in song keeping the local history alive." (1 towns): r2s-under_siege-village-2 (224)
- "The village's own singer, fiddler, or piper, heard at every festival and wedding. Through those songs the settlement's history is remembered." (1 towns): r2r-village-14 (371)
- "Several ironworkers, each to a specialty." (15 towns): r2r-town-4 (691), r2r-town-58 (2,468), r2s-under_siege-town-1 (1,339)
- "Sets precious metal and gemstones into rings, necklaces, seals, and other luxuries. The work is to commission; stones are valued, and now and then bought from customers who keep quiet about provenance." (7 towns): r2r-town-3 (1,168), r2s-under_siege-town-3 (2,192), r2s-occupied-town-3 (2,018)
- "Rings, necklaces, seals, and finery, worked from gold and gemstone. Orders are taken, stones appraised, and the occasional purchase from a discreet seller is not refused." (3 towns): r2r-town-14 (1,359), r2r-town-54 (2,451)
- "One of the few here who can read and write: letters copied, plain contracts set down, documents read out for those who cannot. Usually schooled at a monastery, or by whoever here could teach." (prints in no census town)
- "Water or wind drives the grindstones, and with them goes the sole right to grind. Whoever keeps them tends to be the richest in the village, and the least loved." (45 towns): r2s-occupied-village-0 (85), r2s-recently_betrayed-village-2 (394)

## TAIL-HOUSES-2 · H5: the crisis rows against the leaf's table (no cure)

Seat: TAIL-HOUSES-2 (successor), on this branch from ac4710206, scratch worktree. THE CHECK, by script: each row's house by its text (`institutionalCatalog` + `INSTITUTION_DESC_VARIANTS` + `DESC_VARIANT_SIBLINGS`; the journal's `House: text` prefix; a chain row by `SUPPLY_CHAIN_NEEDS` id) -> `catalogIdForName` -> `HOUSE_DEPENDENCE` / `CHAIN_DEPENDENCE` of `src/data/crisisDependence.js` at the joined line 96b4015f4; the crisis is the reader's reason confirmed by the read-in town's record (`crisisOf(...).kinds`, the famine's `foodRecord.failedSource`; census at ac4710206); a row is ANSWERED where the dependence holds a word the crisis stops (siege: travellers, goods; outbreak: travellers, gatherings; famine: the failed food). The rows are 79 H1 candidates (the hand-back's table; the prompt's 81 counted two more that the table does not hold) and the 39 X9 rows whose reason names a crisis.

### ANSWERED BY THE LEAF (struck: the house or chain is in the table for its crisis)

| id | from | towns | key | crisis | sentence |
|---|---|---|---|---|---|
| 16646 | H1 | 8 | barge_and_river_transport_company | under_siege | River barges run in fleet, some to a schedule and some to order. |
| 04601 | H1 | 8 | barge_and_river_transport_company | under_siege | Bulk freight, passengers, and army supply all move on them through the river network. |
| B12717 | H1 | 177 | furs_north | under_siege | Mid-route settlements profit from the trade. |
| 14115 | H1 | 84 | inns_and_taverns_district | under_siege | Multiple inn districts catering to merchants, travelers, and long-term visitors. |
| B11971 | H1 | 71 | customs_house | under_siege | Levies duties on goods entering and leaving by the main roads. |
| 17954 | H1 | 67 | inns_and_taverns_district | under_siege | Several inn districts, given over to merchants, travellers, and those who stay long. |
| 09333 | H1 | 59 | major_annual_fairs | under_siege | Foreign traders attend, and credit by letter is taken. |
| B15261 | H1 | 52 | coaching_inn | plague_onset | Purpose-built for road travellers: stabling for relay horses, scheduled coach departures,  |
| B12169 | H1 | 49 | post_relay_station | under_siege | Maintains a team of horses for rapid message relay out of the coaching inn. |
| 28847 | H1 | 43 | international_trade_center | under_siege | Where foreign merchant agents gather, trade disputes are arbitrated, and commodities chang |
| B02335 | H1 | 42 | market_square | plague_onset | A broad open square given over to market days and fairs. |
| 04663 | H1 | 41 | camel_caravan | under_siege | Camel Caravan Trade |
| B06577 | H1 | 41 | subsistence_farming | famine | Each household farms just enough land to feed itself. |
| B06932 | H1 | 41 | subsistence_farming | famine | Every household works just enough land to stay alive, and no more. |
| 12702 | H1 | 36 | customs_house | under_siege | Levies charged on all trade in and out by road, collected by officials of crown or town. |
| 11393 | H1 | 36 | international_trade_center | under_siege | Hub for international merchant representatives, trade arbitration, and commodity exchange. |
| B06555 | H1 | 36 | customs_house | under_siege | Duties are taken here on goods passing along the main roads. |
| 03172 | H1 | 33 | access_to_parish_church | under_siege | A walk of a few miles to the village house of worship for services. |
| 21103 | H1 | 33 | access_to_parish_church | under_siege | The nearest house of worship is the village's, a walk of a few miles away for services. |
| 17675 | H1 | 32 | access_to_parish_church | under_siege | Services mean a walk of a few miles to the village house of worship. |
| B05738 | H1 | 32 | fish_market | famine | Covered stalls under the wardens' eye, selling the morning's catch or the week's salted ba |
| B11640 | H1 | 31 | post_relay_station | under_siege | Keeps relay horses at the coaching inn for fast message riders. |
| B13370 | H1 | 31 | fisher_s_landing | famine | Near water, it is the chief source of protein. |
| B11969 | H1 | 28 | customs_house | under_siege | Levies charged on all trade in and out by road or harbour, collected by officials of crown |
| 05276 | H1 | 23 | brewery | famine | Commercial brewing of ale and beer supplies the taverns and ships across the region, emplo |
| 04797 | H1 | 20 | river_ferry | plague_onset | Carts, beasts and walkers wait their turn on the bank. |
| B22199 | H1 | 20 | harbour_master_s_office | under_siege | Traffic is regulated here, anchorage fees collected, berths handed out, and sea-law enforc |
| 06937 | H1 | 18 | customs_house | under_siege | Duties are taken here on goods passing through the port or the main roads. |
| 04796 | H1 | 17 | river_ferry | plague_onset | Carts, beasts and walkers wait their turn at the landing. |
| 04423 | H1 | 17 | caravan_masters_exchange | under_siege | Bonded freight, route intelligence, armed convoy assembly, and commercial dispute resoluti |
| 04683 | H1 | 12 | caravan_trade | plague_onset | Caravan & Overland TradeTrade & entrepôt✓ Running |
| 13412 | H1 | 8 | annual_fair | plague_onset | Merchants from across the region, and luxuries to be had. |
| B02702 | H1 | 8 | travelers_inn | plague_onset | A lone inn catering to whoever the road brings: merchants, pilgrims, travellers. |
| B03102 | H1 | 7 | weekly_market | plague_onset | A weekly sale of local goods. |
| 22419 | H1 | 6 | travelers_inn | under_siege | The village's # inn for the traders, pilgrims, and wayfarers who pass. |
| 02485 | H1 | 5 | stable_yard | under_siege | A common stable for travellers to lodge their mounts; the stableman sees to basic shoeing  |
| B27818 | H1 | 5 | caravanserai | under_siege | Where caravans come, it is the desert settlement's economic heart. |
| 23217 | H1 | 3 | caravaneer_s_post | under_siege | Traders enrol their goods, hire escorts, and strike joint ventures. |
| 12766 | H1 | 2 | wayside_inn | under_siege | Lodging above the stable and a common table for passing travellers. |
| 14229 | X9 | 84 | inns_and_taverns_district | under_siege | Inns and taverns (district): Multiple inn districts catering to merchants, travelers, and  |
| 16007 | X9 | 63 | major_annual_fairs | under_siege | Major annual fairs: Merchants from abroad. |
| 16005 | X9 | 59 | major_annual_fairs | plague_onset | Major annual fairs: Foreign traders attend, and credit by letter is taken. |
| 06909 | X9 | 56 | coaching_inn | plague_onset | Coaching inn: Built for the road: relay stabling, coaches on a schedule, meals at set hour |
| 16006 | X9 | 55 | major_annual_fairs | plague_onset | Major annual fairs: International merchants. |
| 06286 | X9 | 54 | caravan_trade | plague_onset | Caravan masters' exchange » Overland cargo transport, Escorted caravan, Pack animal hire |
| 06910 | X9 | 52 | coaching_inn | under_siege | Coaching inn: Purpose-built for road travellers: stabling for relay horses, scheduled coac |
| 11342 | X9 | 46 | grain, brewing, food_processing | famine | Grain fields » Bakers + Butchers » Baked goods, Preserved foods |
| 16266 | X9 | 42 | market_square | plague_onset | Market square: A broad open square given over to market days and fairs. |
| 04157 | X9 | 33 | access_to_parish_church | under_siege | Access to a house of worship: The nearest house of worship is the village's, a walk of a f |
| 10228 | X9 | 32 | fish_market | famine | Fish market: Covered stalls under the wardens' eye, selling the morning's catch or the wee |
| 14320 | X9 | 21 | international_trade_center | under_siege | International trade center: A centre for overseas trade representatives, the settling of c |
| 29533 | X9 | 8 | travelers_inn | plague_onset | Travelers' inn: A lone inn catering to whoever the road brings: merchants, pilgrims, trave |
| 04705 | X9 | 8 | annual_fair | plague_onset | Annual fair: Merchants from across the region, and luxuries to be had. |
| 29535 | X9 | 6 | travelers_inn | under_siege | Travelers' inn: The village's # inn for the traders, pilgrims, and wayfarers who pass. |
| 06309 | X9 | 3 | caravan_trade | under_siege | Caravanserai + Carriers' guild » Overland cargo transport, Escorted caravan, Pack animal h |
| 19207 | X9 | 2 | mountain_pass_trade | under_siege | Mountain Pass » Customs house » Strategic control, Trade access fees |

14115 also carries an ordinary-times reason (inn DISTRICTS in a city of 2,679): left with the size class (H2).

### NOT IN THE TABLE (sent to the chair for the services seat; the dependence the reason names in brackets)

| id | from | towns | key (its line now) | crisis | sentence | reason |
|---|---|---|---|---|---|---|
| B17254 | H1 | 87 | apothecary_district (NONE) | under_siege | Some focus on chirurgery, others on herbal preparations, others on imported medi | goods (imported medicines) |
| 05285 | H1 | 83 | brewery (food: grain) | under_siege | Commercial-scale ale and beer production supplying taverns and regional distribu | goods (regional distribution) |
| 15651 | H1 | 82 | multiple_market_squares (NONE) | under_siege | Permanent markets in more than # square, each serving its own #. | doubtful: markets stand inside the walls |
| B02399 | H1 | 71 | apothecary_district (NONE) | under_siege | A cluster of apothecaries pressed close enough that competition drives them apar | goods (imported medicines) |
| B00206 | H1 | 66 | apothecary_district (NONE) | under_siege | # leans to chirurgery, another to herbal preparations, a # to imported medicines | goods (imported medicines) |
| B17798 | H1 | 65 | bowyers_fletchers_guild (NONE) | under_siege | Supplies the watch, the garrison, and the caravans. | goods/travellers (the caravans) |
| B21481 | H1 | 62 | bowyers_fletchers_guild (NONE) | under_siege | The watch, the garrison, and the caravans buy here. | goods/travellers (the caravans) |
| 16857 | H1 | 58 | fish_market (food: fish) | under_siege | Salted, smoked and dried fish come in by cart, sold by weight and inspected for  | goods (fish carted in) |
| B09671 | H1 | 54 | bowyers_fletchers_guild (NONE) | under_siege | Guild bowyers and fletchers selling arrows by the sheaf, special broadheads, and | goods/travellers (the caravans) |
| 17955 | H1 | 50 | city_granaries (NONE) | under_siege | Several large grain stores feed the city between them. | doubtful: stores within |
| 06002 | H1 | 49 | fish_market (food: fish) | under_siege | Covered stalls under the wardens' eye, selling salt fish and dried fish carted i | goods (fish carted in) |
| 21670 | H1 | 46 | great_cathedral (NONE) | under_siege | The region's chief religious authority sits here, and the faithful travel to it. | travellers (the faithful travel to it) |
| 18556 | H1 | 43 | daily_markets (NONE) | plague_onset | Standing markets in more than #, open every day. | gatherings (plague); siege doubtful |
| B04464 | H1 | 42 | cemetery_network (NONE) | under_siege | Burial has left the walls: grounds beyond every gate, each with its road and its | travellers (grounds beyond every gate) |
| B20720 | H1 | 40 | burial_ground (NONE) | under_siege | The rite waits for a priest passing through; the burial does not. | travellers (a priest passing through) |
| 15650 | H1 | 37 | daily_markets (NONE) | under_siege | Permanent market activity in multiple locations. | gatherings (plague); siege doubtful |
| B04463 | H1 | 34 | cemetery_network (NONE) | under_siege | Burial has left the walls entirely: grounds beyond every gate, each with its own | travellers (grounds beyond every gate) |
| 16534 | H1 | 33 | chroniclers_exchange (NONE) | under_siege | Reports arrive from several roads and are checked against each other before anyt | travellers (reports by road) |
| 04579 | H1 | 30 | stone_quarry (NONE) | under_siege | Building stone from here has gone to every part of the region. | goods (stone sent out) |
| 07216 | H1 | 18 | bowyers_fletchers_guild (NONE) | under_siege | Enough to resupply the caravans and outfit their guards. | goods/travellers (the caravans) |
| B02583 | H1 | 13 | carriers_guild (goods) | plague_onset | A guild of professional carters, teamsters, and pack-animal drivers who move goo | travellers (carriers on the road) |
| B09887 | H1 | 7 | shipyard (NONE) | under_siege | Here large merchant and war vessels are built at city scale, across multiple dry | goods (timber imports) |
| B15590 | H1 | 7 | maltster (food: grain) | under_siege | Requires grain surplus. | goods (grain brought in) |
| B03247 | H1 | 7 | cartographer_s_workshop (NONE) | under_siege | Adventurers, merchants, and army scouts all stop here. | travellers |
| 17650 | H1 | 6 | hunter_s_lodge (food: game) | under_siege | Sends out hunting parties over the surrounding country and brings venison, pelts | travellers (parties out over the country) |
| B13214 | H1 | 5 | periodic_market (NONE) | plague_onset | Monthly or seasonal trading day. | gatherings |
| 14145 | H1 | 3 | hunter_s_lodge (food: game) | under_siege | Musters hunting parties across the lands about the settlement, selling venison,  | travellers (parties out over the country) |
| 16376 | X9 | 67 | (not a leaf row) (NONE) | famine | Medium - agricultural heartland, but exposed to raids | not a row the leaf reads (terrain / resource-chain / export line) |
| 25093 | X9 | 67 | (not a leaf row) (NONE) | famine | Strategic value: Medium - agricultural heartland, but exposed to raids | not a row the leaf reads (terrain / resource-chain / export line) |
| 29823 | X9 | 54 | vintner (NONE) | under_siege | Vintner: Wine pressed and matured, from local fruit or imported must, sold in bu | NOT A CRISIS ROW: the grape gap (batch 1 text) |
| 07705 | X9 | 43 | daily_markets (NONE) | plague_onset | Daily markets: Standing markets in more than #, open every day. | gatherings (plague); siege doubtful |
| 06456 | X9 | 42 | cemetery_network (NONE) | under_siege | Cemetery network: Burial has left the walls: grounds beyond every gate, each wit | travellers (grounds beyond every gate) |
| 07706 | X9 | 40 | daily_markets (NONE) | plague_onset | Daily markets: Trade that never closes, spread across several sites. | gatherings (plague); siege doubtful |
| 06455 | X9 | 34 | cemetery_network (NONE) | under_siege | Cemetery network: Burial has left the walls entirely: grounds beyond every gate, | travellers (grounds beyond every gate) |
| 16297 | X9 | 12 | reed_marsh (NONE) | famine | Marshlands » Subsistence farming » Honey and beeswax, Foraged goods | NOT A CRISIS ROW: the foraging chain state |
| 29353 | X9 | 11 | town_council (NONE) | plague_onset | Town council: Where nothing official exists, the town's notable men gather and g | NOT A CRISIS ROW: governance (H7) |
| 13074 | X9 | 6 | hunter_s_lodge (food: game) | under_siege | Hunter's lodge: Sends out hunting parties over the surrounding country and bring | travellers (parties out over the country) |
| 21555 | X9 | 5 | periodic_market (NONE) | plague_onset | Periodic market: Monthly or seasonal trading day. | gatherings |
| 13072 | X9 | 3 | hunter_s_lodge (food: game) | under_siege | Hunter's lodge: Musters hunting parties across the lands about the settlement, s | travellers (parties out over the country) |
| 14635 | X9 | 2 | (not a leaf row) (NONE) | under_siege | It sends out medicines, restorative treatments, mineral salts and lumber. | not a row the leaf reads (terrain / resource-chain / export line) |
| 09159 | X9 | 1 | (not a leaf row) (NONE) | famine | Exports: Milled flour, Fulled cloth, Roof tiles, Luxury manufactured goods, Fine | not a row the leaf reads (terrain / resource-chain / export line) |

### NO CRISIS THE LEAF READS (the reason is an occupation or a legitimacy crisis; kept for H7 governance, not the leaf's)

B14388 (city_administration, r2s-occupied-city-2), B03373 (city_administration, r2s-occupied-city-3), 03031 (village_headman, r2s-insurgency-hamlet-0), 02668 (merchant_oligarchy, r2s-occupied-metropolis-3), 20701 (guild_consortium, r2s-occupied-metropolis-0), 00186 (household_elder, r2s-plague_onset-thorp-2), 14950 (household_elder, r2s-plague_onset-thorp-2), B05076 (head_of_household_consensus, r2r-thorp-24), 03077 (message_network_high_magic, r2s-occupied-metropolis-0), 14953 (village_headman, r2s-recently_betrayed-hamlet-2), B02540 (informal_elder_consensus, r2s-occupied-hamlet-2), 03033 (village_headman, r2r-hamlet-24), 03522 (town_council, r2s-occupied-town-0), 15808 (terrain line, r2r-thorp-45), 25089 (terrain line, r2r-thorp-45), 06454 (cemetery_network, r2s-occupied-metropolis-1), 16377 (terrain line, r2s-occupied-hamlet-1), 16785 (merchant_oligarchy, r2s-occupied-town-1), 15809 (terrain line, r2r-thorp-41), 25090 (terrain line, r2r-thorp-41), 14179 (informal_elder_consensus, r2s-occupied-hamlet-2)

The four terrain lines "difficult to besiege" (15808, 25089, 15809, 25090) and "controls caravan routes" (16377) are geographyData strengths, not leaf rows: left with X9. "Fresh meat: Beef, pork, mutton." and "Fresh bread: Daily bread." (named in the prompt's X9) are NOT rows of WORKLIST3-HOUSES (98 rows, none of them): another group's (the services' menu), not checked here.

## TAIL-HOUSES-2 · Batch 3 · H7: a house text names a citadel, a gate, a deposit, a founding or a payer the record denies

THE SHAPE (H7, ordinary times): the metropolis wall house names "the citadel ring" where no Citadel is born; the town burial ground names "the gate" where the defence has none; the Stone quarry is at work, and "half the region's building stone", where its stone quarry is depleted or stone is imported; the Mine is "the reason the settlement grew" where no founding names a mine (every printing town); the city Garrison is "in noble or royal pay" under a ruler who is no lord; the thorp's fishing community "takes what the water gives" where its river fish are depleted. 13 texts (4 catalogue rows, 9 variants) and one more (the burial ground) reworded to claim no more than every printing town bears, the input hedges in S5's one form ("whenever <input> can be had"). The citadel is approved by the chair (01:00 UTC): 36 towns print a Massive-walls text with NO Citadel (10 + 8 + 18); in the 84 others the Citadel prints its own row. The burial ground's gate was "waiting on order" (R-Q: the cascade can add the gate after the description draw; an H8-shaped row): the new text names no gate, true with one or without, so it leaves the wait (the ledger's `needs: gate` with it; `institutionProseDeclared` re-keyed 75 -> 74). Every text-keyed copy moved with its text (colour column, declaration ledger, `DESC_VARIANT_DECLARATIONS` keys); NO DRAW MOVED (same pools, same hash, same index).

MEASURE (the record, `measure3.mjs` over the base corpus): false town-rows before:

| id | towns | false before | sentence (before) | read by |
|---|---|---|---|---|
| 14069 | 55 -> 0 | 41 | Much of the region's building stone was cut here. | quarry not available or stone imported |
| 10137 | 42 -> 0 | 18 | Ground beside each house of worship, with burial beyond the gate ... | `gate` atom false |
| B22510 | 41 -> 0 | 8 | Walls within walls: ... and the citadel ring. | no Citadel |
| 02534 | 40 -> 0 | 18 | A defence built in layers: ... the ring about the citadel ... | no Citadel |
| B03000 | 39 -> 0 | 26 | A stone quarry, with yards beside it for dressing the stone. | quarry not available |
| B11885 | 39 -> 0 | 10 | Layered wall systems: outer wall, inner wall, citadel ring. | no Citadel |
| B00345 | 39 -> 0 | 26 | Half the region's building stone was cut here. | quarry not available or stone imported |
| B02922 | 36 -> 0 | 15 | A shaft driven into the deposits, with winding gear and ore carts at the pithead. | a mineral deposit not available |
| B27842 | 36 -> 0 | 36 | Where they ran deep, the settlement grew around the mine. | no founding names a mine |
| B02989 | 32 -> 0 | 25 | A standing body of soldiers, in noble or royal pay. | `ruler: lord` false |
| 04579 | 30 -> 0 | 25 | Building stone from here has gone to every part of the region. | (H5 listed it for the leaf: now cured at the writer) |
| 28857 | 30 -> 0 | 30 | Where the deposits ran deep, the mine is the reason the settlement grew. | no founding names a mine |
| B27830 | 30 -> 0 | 30 | Where the deposits ran deep, the mine is why the place grew at all. | no founding names a mine |
| B28049 | 30 -> 0 | 25 | Yards for dressing stone stand beside the quarry face. | quarry not available |
| B02747 | 30 -> 0 | 15 | A mine of shafts and adits, with its winding gear and ore carts. | a mineral deposit not available |
| B20091 | 14 -> 0 | 1 | The nets, the traps, the drying racks: what the water gives ... | river fish not available |
| X9 06139 | 42 -> 0 (journal) | 18 | Burial grounds: Ground beside each house of worship, with burial beyond the gate ... | as 10137 |
| X9 10250 | 14 -> 0 (journal) | 1 | Fishing community: The nets, the traps ... | as B20091 |

Also moved with their pool (not worklist rows, the same claim): the Garrison's catalogue line "Professional soldiers. Noble or royal." (45 towns, 36 false) and its sibling "Professional soldiers, kept by noble or crown." (43, 33 false).

THE INVENTORY DIFF (before -> after3; the tabs): sentences 29,862 -> 29,853, gone 23, new 14, IN FEWER TOWNS 0, in more towns 0; the 18 worklist rows GONE. The exports (`SURFACES=PDF,Journal`): gone 37, new 28, in fewer 0, in more 0. THE INHERITORS are the 14 rewordings, plus three lines in two towns that are an instrument artifact, not this cure ("Patron deity", "Assign a patron god ...", "Upgrade to premium ..." in r2s-mass_migration-city-3 and one more): THE BEFORE RUN WAS RE-RENDERED IN PART: the census renders from the tree's own data files, and my edits began while it rendered, so the 183 dumps written after them were re-rendered on a clean worktree at the base (5a5166898, `wtbase`), whose checkout differs from `npm ci`'s in those prompt lines; the after run is one clean render. Read in place: r2r-metropolis-11 (the walls, no Citadel), r2r-town-2 (the burial ground), r2r-city-3 (the quarry, the garrison).

DECLARED MOVE: family `institutions[].desc` only (no draw moved; the same index in every pool).

Guard: `tests/data/tailHouses3DefenceDeposit.test.js`: 12 RED pairs (12 of 12 red at the base, each with the record's denial asserted), 6 KEEP pairs (green before and after); a plant of the old Garrison line reds 1 of 12.

Gates: eslint 0 on the touched files; typecheck:domain:strict 0; typecheck:ratchet OK; presumed-things `--check` fresh 145 at the base -> 144, stale 0 after `--shrink` (10 widened rows and 1 first-register row of the old texts); my first wording made 7 fresh hits (`soldiers`, `garrison`, `districts`, `house of worship` beside banked rows of the old texts; the door banks only what stood at the widening's base): reworded before the commit, not banked. page-census `--grid`: 0 rises (the same 2 falls). The 89 test files naming the touched files: reds CARRIED (the same at the base): gapLineHousesByKind, urbanBandInstitutions G5, wiringCensusDeclared, generatorGoldenMaster, and presumedThings.walker ARM 1 / ARM 2 (4 stale arm-2 rows) / ARM 3 (red at the base too); the one pin this batch moved (institutionProseDeclared) re-keyed and green.

STRUCK (H7, verified): B15417 "Refined iron ingots" and B04587 "Cast iron goods" (126 towns): the chain card's header reads the chain state (`domain/chainYield.js`, EconomicsTab.jsx:205: "Normally yields" wherever the chain is impaired or its input depleted; seen in r2r-city-53); a Vulnerable chain still runs. 02916 "A principal source of the town's trade." is the town WEEKLY MARKET's line (`town|Economy|Weekly market`), not the salt works' as read: true of a market; its crown charter is batch 4's.

### The veto list, batch 3

- "Layered wall systems: an outer wall and an inner wall, with gatehouses along both." (39 towns): r2r-metropolis-11 (16,770), r2s-succession_void-metropolis-3 (295,750), r2s-famine-metropolis-3 (32,388)
- "Walls within walls: an outer line and an inner line, with gatehouses at every stage." (41 towns): r2r-metropolis-16 (15,584), r2s-occupied-metropolis-3 (262,531), r2s-famine-metropolis-2 (29,083)
- "A defence built in layers, an outer wall and an inner wall, with gatehouses throughout." (40 towns): r2s-plague_onset-metropolis-1 (15,873), r2r-metropolis-8 (344,689), r2s-famine-metropolis-0 (39,834)
- "A ground for each congregation, and burial out beyond the houses where a ground has filled." (42 towns): r2s-occupied-town-2 (310), r2s-under_siege-town-2 (2,453), r2s-famine-town-1 (1,336)
- "A stone quarry and its dressing yards, worked whenever good stone can be had." (55 towns): r2s-religious_conversion-town-1 (909), r2r-metropolis-13 (328,486), r2s-famine-city-2 (13,213)
- "A stone quarry, with yards beside it for dressing the stone, worked whenever good stone can be had." (39 towns): r2s-monster_pressure-town-2 (1,344), r2s-succession_void-metropolis-3 (295,750), r2s-famine-metropolis-1 (35,674)
- "Yards for dressing stone stand beside the quarry face, at work whenever good stone can be had." (30 towns): r2s-insurgency-town-2 (2,081), r2r-metropolis-8 (344,689), r2s-famine-metropolis-0 (39,834)
- "A mine of shafts and adits, with its winding gear and ore carts, worked whenever ore can be had." (30 towns): r2r-town-12 (1,099), r2s-succession_void-metropolis-3 (295,750), r2s-famine-metropolis-0 (39,834)
- "A mine of shafts and adits, with winding gear and ore carts at the head, worked whenever ore can be had." (30 towns): r2s-occupied-town-0 (1,580), r2r-metropolis-6 (216,641), r2s-famine-city-2 (13,213)
- "A shaft driven into the deposits, with winding gear and ore carts at the pithead, worked whenever ore can be had." (36 towns): r2s-infiltrated-town-2 (660), r2r-metropolis-8 (344,689), r2s-famine-metropolis-1 (35,674)
- "The nets, the traps, the drying racks, worked by the fishing households whenever fish can be had." (14 towns): r2r-thorp-36 (5), r2s-plague_onset-thorp-1 (25), r2s-famine-thorp-0 (19)
- "A professional force, under arms full-time." (45 towns): r2s-wartime-city-1 (2,054), r2s-plague_onset-city-1 (14,812), r2s-occupied-city-3 (4,671)
- "A professional force, kept under arms for pay." (43 towns): r2s-recently_betrayed-city-0 (2,407), r2r-city-19 (14,810), r2s-famine-city-0 (2,909)
- "A standing force, paid to bear arms." (32 towns): r2r-city-44 (2,408), r2s-politically_fractured-city-0 (14,572), r2s-famine-city-2 (13,213)


## Rows NOT cured (what is left, by class)

STRUCK, gone at the base (prints in 0 census towns at bcad1a358): B17989.

### Parked for the owner (H4: the fortification, divine-healing and pilgrimage rows of supplyChainData.js; not changed)

- 15712 (60 towns; read in r2s-plague_onset-village-2): Pilgrimage & Holy SitesReligion & civic✓ Running  — Pilgrimage running; isolated village under Plague, no exports, people do not travel
- 09319 (7 towns; read in r2r-metropolis-14): Foraging & Smallholding: Blessed stores; divine provision fills the gap  — divine provision fills the gap; STATE food deficit 83%, imports cover None, viable False

### Candidates for the H1 strike (the SERVICES seat's class): the reader's reason is a crisis (siege, plague, famine, occupation)

NOT YET VERIFIED BY THE RECORD row by row (the budget went to the two batches): each still needs the census check that it is TRUE in every town that prints it outside the crisis before it is struck; several also carry an ordinary-times reason (marked +).

| id | towns | house / writer | sentence |
|---|---|---|---|
| 16646 | 8 | institutionDescVariants.js :: PAIRS | River barges run in fleet, some to a schedule and some to order. |
| 04601 | 8 | institutionDescVariants.js :: PAIRS | Bulk freight, passengers, and army supply all move on them through the river network. |
| B12717 | 177 | supplyChainData.js :: SUPPLY_CHAIN_NEEDS.services | Mid-route settlements profit from the trade. |
| B17254 | 87 | institutionalCatalog.js :: INSTITUTION_FAMILIES.shared | Some focus on chirurgery, others on herbal preparations, others on imported medicines. |
| 14115 + | 84 | institutionalCatalog.js :: INSTITUTION_FAMILIES.shared | Multiple inn districts catering to merchants, travelers, and long-term visitors. |
| 05285 | 83 | institutionalCatalog.js :: INSTITUTION_FAMILIES.shared | Commercial-scale ale and beer production supplying taverns and regional distribution. |
| 15651 | 82 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | Permanent markets in more than one square, each serving its own quarter. |
| B11971 | 71 | institutionDescVariants.js :: DESC_VARIANT_SIBLINGS | Levies duties on goods entering and leaving by the main roads. |
| B02399 | 71 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | A cluster of apothecaries pressed close enough that competition drives them apart in trade, some to surgery, some to her |
| 17954 | 67 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | Several inn districts, given over to merchants, travellers, and those who stay long. |
| B00206 | 66 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | One leans to chirurgery, another to herbal preparations, a third to imported medicines. |
| B17798 | 65 | institutionalCatalog.js :: INSTITUTION_FAMILIES.shared | Supplies the watch, the garrison, and the caravans. |
| B21481 | 62 | institutionDescVariants.js :: PAIRS | The watch, the garrison, and the caravans buy here. |
| 09333 | 59 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | Foreign traders attend, and credit by letter is taken. |
| 16857 | 58 | institutionDescVariants.js :: DESC_VARIANT_SIBLINGS | Salted, smoked and dried fish come in by cart, sold by weight and inspected for rot. |
| B09671 | 54 | institutionDescVariants.js :: PAIRS | Guild bowyers and fletchers selling arrows by the sheaf, special broadheads, and composite bows to order, supplying the  |
| B15261 | 52 | institutionalCatalog.js :: INSTITUTION_FAMILIES.shared | Purpose-built for road travellers: stabling for relay horses, scheduled coach departures, meals served at fixed hours, a |
| 17955 | 50 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | Several large grain stores feed the city between them. |
| 06002 | 49 | institutionDescVariants.js :: DESC_VARIANT_SIBLINGS | Covered stalls under the wardens' eye, selling salt fish and dried fish carted in by the barrel, each checked for rot. |
| B12169 | 49 | institutionalCatalog.js :: INSTITUTION_FAMILIES.shared | Maintains a team of horses for rapid message relay out of the coaching inn. |
| 21670 | 46 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | The region's chief religious authority sits here, and the faithful travel to it. |
| 18556 | 43 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | Standing markets in more than one quarter, open every day. |
| 28847 | 43 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | Where foreign merchant agents gather, trade disputes are arbitrated, and commodities change hands. |
| B02335 | 42 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | A broad open square given over to market days and fairs. |
| B04464 | 42 | institutionDescVariants.js :: PAIRS | Burial has left the walls: grounds beyond every gate, each with its road and its gatekeepers, and a trade in plots the r |
| 04663 | 41 | supplyChainData.js :: SUPPLY_CHAIN_NEEDS.services | Camel Caravan Trade |
| B06577 | 41 | institutionalCatalog.js :: INSTITUTION_FAMILIES.thorp | Each household farms just enough land to feed itself. |
| B06932 | 41 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | Every household works just enough land to stay alive, and no more. |
| B20720 | 40 | institutionDescVariants.js :: PAIRS | The rite waits for a priest passing through; the burial does not. |
| 15650 | 37 | institutionalCatalog.js :: INSTITUTION_FAMILIES.city | Permanent market activity in multiple locations. |
| 12702 | 36 | institutionDescVariants.js :: PAIRS | Levies charged on all trade in and out by road, collected by officials of crown or town. |
| 11393 | 36 | institutionalCatalog.js :: INSTITUTION_FAMILIES.metropolis | Hub for international merchant representatives, trade arbitration, and commodity exchange. |
| B06555 | 36 | institutionDescVariants.js :: DESC_VARIANT_SIBLINGS | Duties are taken here on goods passing along the main roads. |
| B04463 | 34 | institutionalCatalog.js :: INSTITUTION_FAMILIES.metropolis | Burial has left the walls entirely: grounds beyond every gate, each with its own road, its own gatekeepers, and a trade  |
| 03172 | 33 | institutionalCatalog.js :: INSTITUTION_FAMILIES.thorp | A walk of a few miles to the village house of worship for services. |
| 21103 | 33 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | The nearest house of worship is the village's, a walk of a few miles away for services. |
| 16534 | 33 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | Reports arrive from several roads and are checked against each other before anything is sold. |
| 17675 | 32 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | Services mean a walk of a few miles to the village house of worship. |
| B05738 | 32 | institutionDescVariants.js :: PAIRS | Covered stalls under the wardens' eye, selling the morning's catch or the week's salted barrels by weight, each checked  |
| B11640 | 31 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | Keeps relay horses at the coaching inn for fast message riders. |
| B13370 | 31 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | Near water, it is the chief source of protein. |
| 04579 | 30 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | Building stone from here has gone to every part of the region. |
| B11969 | 28 | institutionDescVariants.js :: PAIRS | Levies charged on all trade in and out by road or harbour, collected by officials of crown or town. |
| B14388 | 26 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | Officials, clerks, and ward officers run the city's affairs between them. |
| 05276 | 23 | institutionDescVariants.js :: PAIRS | Commercial brewing of ale and beer supplies the taverns and ships across the region, employing many and consuming grain  |
| 04797 | 20 | institutionDescVariants.js :: PAIRS | Carts, beasts and walkers wait their turn on the bank. |
| B22199 | 20 | institutionDescVariants.js :: PAIRS | Traffic is regulated here, anchorage fees collected, berths handed out, and sea-law enforced. |
| 06937 | 18 | institutionDescVariants.js :: PAIRS | Duties are taken here on goods passing through the port or the main roads. |
| 07216 | 18 | institutionDescVariants.js :: PAIRS | Enough to resupply the caravans and outfit their guards. |
| B03373 | 18 | institutionalCatalog.js :: INSTITUTION_FAMILIES.shared | An administrative apparatus of officials, clerks, and ward officers manages city affairs. |
| 04796 | 17 | institutionDescVariants.js :: DESC_VARIANT_SIBLINGS | Carts, beasts and walkers wait their turn at the landing. |
| 04423 | 17 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | Bonded freight, route intelligence, armed convoy assembly, and commercial dispute resolution are all conducted here. |
| 03031 | 14 | institutionalCatalog.js :: INSTITUTION_FAMILIES.shared | A single respected figure acts as de facto authority. |
| 02668 | 14 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | A handful of rich merchant houses monopolise power here; a political post is, in practice, something one purchases. |
| 20701 | 13 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | The guild masters, banded into a consortium, hold the real civic power. |
| 00186 | 13 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | One head of household carries the settlement's voice by common habit, with no appointment behind it. |
| 14950 | 13 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | Nobody named them to it; everybody defers to it anyway. |
| B05076 | 13 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | Common matters are settled by all the family heads together, each voice equal. |
| B02583 | 13 | institutionalCatalog.js :: INSTITUTION_FAMILIES.town | A guild of professional carters, teamsters, and pack-animal drivers who move goods overland for hire. |
| 03077 | 12 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | A station costs as much as a merchant house, so only the crown and the great guilds keep them. |
| 04683 | 12 | supplyChainData.js :: SUPPLY_CHAIN_NEEDS.upstreamChains | Caravan & Overland TradeTrade & entrepôt✓ Running |
| 14953 | 11 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | Nobody voted, nobody appointed, everybody accepts it. |
| B02540 | 9 | institutionalCatalog.js :: INSTITUTION_FAMILIES.hamlet | A free hamlet with no lord's representative. |
| 03033 | 8 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | A single trusted figure runs things by common agreement, holding no office. |
| 13412 | 8 | institutionDescVariants.js :: PAIRS | Merchants from across the region, and luxuries to be had. |
| B02702 | 8 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | A lone inn catering to whoever the road brings: merchants, pilgrims, travellers. |
| B09887 | 7 | institutionDescVariants.js :: PAIRS | Here large merchant and war vessels are built at city scale, across multiple dry docks, with ropewalk, sail loft, and de |
| B03102 | 7 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | A weekly sale of local goods. |
| B15590 | 7 | institutionDescVariants.js :: DESC_VARIANT_SIBLINGS | Requires grain surplus. |
| B03247 | 7 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | Adventurers, merchants, and army scouts all stop here. |
| 17650 | 6 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | Sends out hunting parties over the surrounding country and brings venison, pelts, and game to sell. |
| 22419 | 6 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | The village's one inn for the traders, pilgrims, and wayfarers who pass. |
| 03522 | 5 | institutionalCatalog.js :: INSTITUTION_FAMILIES.town | An informal council of prominent citizens manages town affairs in the absence of formal authority. |
| 02485 | 5 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | A common stable for travellers to lodge their mounts; the stableman sees to basic shoeing and feed. |
| B27818 | 5 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | Where caravans come, it is the desert settlement's economic heart. |
| B13214 | 5 | institutionalCatalog.js :: INSTITUTION_FAMILIES.hamlet | Monthly or seasonal trading day. |
| 14145 | 3 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | Musters hunting parties across the lands about the settlement, selling venison, pelts, and game at market. |
| 23217 | 3 | institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS | Traders enrol their goods, hire escorts, and strike joint ventures. |
| 12766 | 2 | institutionDescVariants.js :: PAIRS | Lodging above the stable and a common table for passing travellers. |

### Left for the next seat: ordinary-times rows of my files (H2), unverified, by shape

**GOVERNANCE: a governing house described against the record's government (informal / no formal authority / elected / crown / noble pay / a power the record does not list)** (21 rows):

- 29000 (8; institutionDescVariants.js :: PAIRS): With no formal government in place, a loose council of leading citizens runs the town. — says no formal government, a loose council rules; GOVERNMENT is Church Council (Dominant) and 00999 says it governs
- 15890 (38; institutionalCatalog.js :: INSTITUTION_FAMILIES.city): Powerful political force. — merchant guilds called a powerful political force; GOVERNMENT lists no Merchant Guilds power
- 15765 (33; institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS): Politically, a power in their own right. — merchant guilds called a political power; GOVERNMENT lists no guild power
- 02600 (32; institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS): A force to be reckoned with in politics. — calls the merchant guilds a political force; GOVERNMENT powers list no Merchant Guilds
- B02989 (32; institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS): A standing body of soldiers, in noble or royal pay. — Garrison in noble or royal pay; government is a Corrupt City Council, no noble or royal power listed
- 02783 (26; institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS): A looser arrangement than a council, but one that works. — calls the government a looser arrangement than a council; GOVERNMENT is the Corrupt City Council
- B05150 (16; institutionalCatalog.js :: INSTITUTION_FAMILIES.shared): Connection: Alderman Fastrada Wolf, the senior guild master — calls Fastrada Wolf (f) Alderman; PEOPLE gives her only the title senior guild master; no alderman office in GOVERNMENT
- 20218 (15; institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS): The city is administered by a standing body of officials, clerks, and ward officers, less formally constituted — says city run by officials less formally constituted than a council; GOVERNMENT is a Corrupt City Council
- 03029 (13; institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS): A single household head speaks for the settlement without ever being chosen to. — a single unchosen household head speaks for the place; GOVERNMENT is an Elder Council (Dominant)
- B05317 (13; institutionalCatalog.js :: INSTITUTION_FAMILIES.city): Connection: Lord Marshal Caecilia Severus, the watch commander — 'Lord Marshal' office is not in PEOPLE; roster gives Caecilia Severus only as watch commander
- 02643 (12; institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS): A governor appointed by king or duke holds sway, and the city runs as a noble fief. — governor 'holds sway', city runs as noble fief; Noble Governorship is Minor and has 'only the office'
- 02494 (11; institutionalCatalog.js :: INSTITUTION_FAMILIES.shared): A consortium of guild masters holds effective civic power. — guild masters 'hold effective civic power'; GOVERNMENT has Grand Guild Consortium Minor, Military/Guard and Order of the
- 28852 (11; institutionDescVariants.js :: PAIRS): Where nothing official exists, the town's notable men gather and govern by consensus. — says notables govern where nothing official exists; GOVERNMENT and 19214: the Corrupt Council governs
- 06984 (11; institutionalCatalog.js :: INSTITUTION_FAMILIES.metropolis): Each station costs as much as a merchant house, and only the crown or the great guilds keep one. — only the crown keeps a message station; GOVERNMENT is a City-State Council, no crown among the powers
- 03508 (10; institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS): An elected council backed by a complete administrative staff. — 'an elected council' governs; GOVERNMENT is a Military City Council seated by the watch commander and Lord Marshal
- 28580 (9; institutionalCatalog.js :: INSTITUTION_FAMILIES.shared): Wealthy merchant families hold exclusive civic power; political office is effectively purchased. — says merchant families hold exclusive civic power; Merchant oligarchy is only Minor, Thieves' Guild Significant, stabili
- 02794 (6; institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS): A man of the lord's choosing governs, and noble authority overrides whatever the town was accustomed to. — Noble authority overrides all; the underworld controls vice and officials and the appointee has lost standing
- 21211 (6; institutionalCatalog.js :: INSTITUTION_FAMILIES.village): The oldest or most respected resident guides village decisions in the absence of formal authority. — says decisions guided 'in the absence of formal authority'; GOVERNMENT is Headman's Authority, Dominant
- 02461 (5; institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS): A civic council put in by vote, with the full apparatus of office beneath it. — describes a civic council elected by vote; the city is governed by an Ecclesiastical Council
- 02785 (4; institutionalCatalog.js :: INSTITUTION_FAMILIES.town): A lord's appointed official governs; noble authority supersedes local custom. — says the lord's appointee governs and supersedes custom; GOVERNMENT has Feudal Appointee Suppressed, Military/Guard Stro
- B05290 (4; institutionalCatalog.js :: INSTITUTION_FAMILIES.shared): Connection: Household Elder Calvus Corvinus, the camp foreman — title Household Elder for the camp foreman; HOUSES has no Household elder and roster gives camp foreman only

**MINE / QUARRY: a depleted deposit or a founding the record denies ("the settlement grew around the mine"; "half the region's building stone was cut here")** (12 rows):

- B15417 (126; supplyChainData.js :: SUPPLY_CHAIN_NEEDS.outputs): Refined iron ingots — offers refined iron ingots; Smelting & Refining impaired, iron ore depleted, TRADE makes no iron
- B04587 (126; supplyChainData.js :: SUPPLY_CHAIN_NEEDS.outputs): Cast iron goods — offers cast iron goods; Smelting & Refining impaired, iron ore depleted, TRADE makes no iron
- 14069 (55; institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS): Much of the region's building stone was cut here. — quarry cuts much of the region's building stone, yet TRADE lists Stone among the city's imports
- B03000 (39; institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS): A stone quarry, with yards beside it for dressing the stone. — quarry worked with dressing yards, but LAND gives Stone quarry depleted and TRADE imports dressed stone (local quarry de
- B00345 (39; institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS): Half the region's building stone was cut here. — half the region's building stone cut here; TRADE imports Stone, LAND lists no stone resource, and 15555 says religious w
- B02922 (36; institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS): A shaft driven into the deposits, with winding gear and ore carts at the pithead. — mine with winding gear and ore carts at work; Iron Ore Deposits depleted, iron imported
- B27842 (36; institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS): Where they ran deep, the settlement grew around the mine. — settlement grew around the mine; FOUNDING says settled by veterans granted land after a forgotten war
- 28857 (30; institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS): Where the deposits ran deep, the mine is the reason the settlement grew. — says the mine is why it grew; founding reason is a counting house, and iron ore is imported as local mines are exhausted
- B27830 (30; institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS): Where the deposits ran deep, the mine is why the place grew at all. — says the mine is why the place grew at all; FOUNDING: a military command, reason foresters finding richer woodland
- B28049 (30; institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS): Yards for dressing stone stand beside the quarry face. — yards dress stone beside the quarry face; LAND has Stone quarry depleted, TRADE imports dressed stone because local quar
- B02747 (30; institutionalCatalog.js :: INSTITUTION_FAMILIES.shared): A mine of shafts and adits, with its winding gear and ore carts. — mine with winding gear and ore carts presented as working; LAND Iron Ore Deposits depleted, TRADE: local iron mines exha
- B20091 (14; institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS): The nets, the traps, the drying racks: what the water gives, the fishing households take. — fishing households take what the water gives; LAND gives River Fisheries as depleted

**WALLS: a citadel ring or a gate the record does not hold** (5 rows):

- 10137 (42; institutionDescVariants.js :: PAIRS): Ground beside each house of worship, with burial beyond the gate where a ground has filled its own. — burial beyond the gate; DEFENCE walls none, so no gate (tag reaches unwalled towns)
- B22510 (41; institutionDescVariants.js :: PAIRS): Walls within walls: an outer line, an inner line, and the citadel ring. — names a citadel ring; DEFENCE gives only Massive walls and fortifications and HOUSES has no Citadel
- 02534 (40; institutionDescVariants.js :: PAIRS): A defence built in layers: outer wall, inner wall, and the ring about the citadel, with garrisons and gatehous — layered defence ending in a ring about the citadel; DEFENCE and HOUSES have no Citadel
- B11885 (39; institutionalCatalog.js :: INSTITUTION_FAMILIES.metropolis): Layered wall systems: outer wall, inner wall, citadel ring. — names a citadel ring; DEFENCE gives only Massive walls and fortifications and HOUSES has no Citadel
- 12559 (2; economicData.js :: TRADE_DEPENDENCY_NEEDS.svcs): Law enforcement, patrol and gate control here depend on iron brought in by magic: no trade road reaches Kamala — names gate control; DEFENCE walls none, no gates on HOUSES

**SUPPLY CHAIN outputs and draws-on lines (supplyChainData.js, resourceChains.js) the chain state denies** (21 rows):

- 15793 (1; geographyData.js :: TERRAIN_DATA.institutionModifiers): Population of 5,280 with only 1 craft institution. — 'only 1 craft institution'; HOUSES lists Craft guilds (30-80), blacksmiths, tanner, dyer, potter, brewery, fuller, ropem
- B06447 (69; resourceChains.js :: RESOURCE_CHAINS.dependsOn): Draws on: herb gathering areas — draws on herb gathering areas; LAND gives Foraging areas absent (Foraging & Smallholding vulnerable) and no herb resourc
- 02662 (64; institutionalCatalog.js :: INSTITUTION_FAMILIES.shared): A guild of professional cartographers producing regional maps, sea charts, property surveys, and military reco — Cartographers make sea charts; town is Hills at a crossroads with no coast or water access
- 20982 (45; institutionDescVariants.js :: DESC_VARIANT_SIBLINGS): The market wardens keep a roofed fish market where carted barrels of salt fish are weighed out and inspected b — carted barrels of salt fish weighed out; TRADE imports list no fish
- 16366 (40; supplyChainData.js :: SUPPLY_CHAIN_NEEDS.intermediateGoods): Refined ingots — names refined ingots as made here; HOUSES has no Smelter or Mint
- 06832 (39; resourceChains.js :: RESOURCE_CHAINS.dependsOn): Draws on: mountain forest, logging routes — draws on mountain forest and logging routes; the other says the timber goes unworked, no house takes it up
- 02916 (34; institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS): A principal source of the town's trade. — Salt works 'a principal source of the town's trade'; salt is in neither exports nor made-here
- 20983 (33; institutionDescVariants.js :: PAIRS): The market wardens keep a roofed fish market where fresh catch and salted barrels are weighed out and inspecte — fresh catch weighed at the fish market; the other says nobody fishes this year, TRADE imports salted fish (fisheries exh
- B13188 (33; institutionDescVariants.js :: PAIRS): Modest revenue, but steady. — toll bridge revenue 'steady'; trade access is isolated, no road, river or port reaches the village, and TRADE shows no t
- 12916 (26; institutionDescVariants.js :: DESC_VARIANT_SIBLINGS): Major forces (hundreds to thousands). — mercenary forces of hundreds to thousands in a city of 2679 people
- B12963 (22; resourceChains.js :: RESOURCE_CHAINS.finalProducts): Mineral hot springs→mineral water→salts→therapeutic pools→medicines→restorative treatments — describes hot springs worked up to restorative treatments; LAND gap: hot spring resource available but not being process
- B02898 (15; institutionDescVariants.js :: PAIRS): A rough jetty and its salting-and-drying racks, where the hamlet's catch is landed and cured. — catch landed and cured: LAND has no fishing resource and TRADE makes no fish
- 14325 (11; geographyData.js :: TERRAIN_DATA.mustImport): Needed, and not brought in: stone (for major construction), metals. — says metals are not brought in; TRADE imports Iron (weapons)
- 12014 (9; institutionDescVariants.js :: PAIRS): It keeps the taverns stocked and sends beer across the region, and stands among the larger buyers of grain and — brewery sends beer across the region; TRADE exports: none and 28748 says no export column
- 21986 (9; institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS): The settlement's living is timber, wood for the charcoal kilns, and the carting of it. — wood for the charcoal kilns; HOUSES has no charcoal burner
- B22024 (9; institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS): Timber, charcoal wood, and the hauling of both keep the place alive. — timber, charcoal wood and hauling keep the place alive; TRADE exports herbs, honey, sacred wood only and imports salt an
- 22677 (7; institutionalCatalog.js :: INSTITUTION_FAMILIES.town): These men fight in formation on salary, not for treasure. — presents salaried soldiers in town; DEFENCE hired: none, garrison none
- 22676 (6; institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS): These are salaried men who fight in formation, not for plunder. — presents salaried soldiers in town; DEFENCE hired: none and garrison none
- 14350 (2; geographyData.js :: TERRAIN_DATA.mustImport): Needed, and not brought in: timber (for large vessels), livestock, clay. — timber for vessels needed and not brought in; 07815 lists Shipbuilding Timber among the village's own resources
- 14282 (1; geographyData.js :: TERRAIN_DATA.mustImport): Needed, and not brought in: quality textiles, fish. — fish needed and not brought in, yet HOUSES lists a Fishmonger who buys and sells fish (04642)
- 03036 (1; institutionDescVariants.js :: PAIRS): A small concern feeding the local alehouses, and one that only runs when grain is in surplus. — 'the local alehouses' plural; HOUSES has one Alehouse, and grain is in 61% deficit, not surplus


## The chair's later notes

- **(H4)**, 23:08 UTC: THE FORTIFICATION, DIVINE-HEALING AND PILGRIMAGE ROWS OF src/data/supplyChainData.js ARE PARKED FOR THE OWNER by an earlier ruling (they do not move before the release; the no-lane seat counted them: 57 of 720 towns): YOU DO NOT CHANGE THEM, whatever your worklist says of a row they write: verify, measure, and NAME such rows in your hand-back under "parked for the owner", with the towns. Not changed (listed above with their towns-printing counts; the per-town measure is owed).
- **X9**, 00:00 UTC: the exports' read, `docs/chair/2026-11-14/read-all-3/WORKLIST3-HOUSES.{md,json}` (98 rows only the PDF and the journal print). NOT TAKEN: neither batch measured the export surfaces (`SURFACES=PDF,Journal inventory.py`). A cure at the writer cures every surface, so the 65 rewordings of batches 1 and 2 reach the exports too; the rest of that worklist is LEFT.

## Registers named stale (re-derived at the close, not here)

- `supabase/functions/_shared/engineBundle.js` and the `ai*Bundle.js` files carry the old catalogue and variant texts (no bundle rebuilt).
- `tests/property/generatorGoldenMaster.test.js`: red at the base (carried); both batches move its `institutions[].desc` too.
- The generation worker's byte ceiling (`tests/build/generationWorkerLazy.test.js`) was not re-measured (no build); the rewordings are near-neutral in length (batch 1 adds roughly 1.2 KB of text, batch 2 removes a little).

## Guards owed

- The H1 candidates need each house's catalogue id beside its row (the ruling asks for it) and the record check that each is true outside its crisis.
- A walker-shaped guard for the INPUT GAP shape (a house text that claims present work on its input) would need a resource word in the vocabulary: PARKED for the chair (no new word without the chair).
- The Vintner is born without grapes in every census town that holds one (184 of 184): for the record seat.

## Tips

- Batch 1: a2550c0ef (pushed). Batch 2: this file's commit (the tip of `lane/tail-houses-2026-11-14`).
- Handed back at the end of batch 2 by time (the session's token count read 0, so judged by the clock: about seventy minutes of work).

## The chair's note on batch 1 (00:01 UTC, read after the hand-back)

"batch 1's rewording stands (true in every town that prints it; nothing silenced; no draw moved)". S5: the SERVICES seat's leaf will MARK a house's row "short of <input>" where the record says the input does not reach it, printing beside these texts; "keep each hedge short and in one form ("whenever clay can be had"), and do not write the shortage itself into a text". OWED (not done here): batch 1's hedges take several forms ("whenever clay can be had", "when there is clay to shape", "as far as the clay to hand allows", "in any year that either reaches the cellar", "when there are beasts to run", "where one can be kept"): the next seat brings them to the one form "whenever <input> can be had", a text-only re-key by the same script (no draw moved). No text of either batch writes the shortage itself.
