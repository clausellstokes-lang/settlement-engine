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


## TAIL-HOUSES-2 · Batch 4 · H7 and the chair's 00:38 note: one hedge form; no coast, crown or charcoal the record denies

THE SHAPES. (a) THE ONE HEDGE FORM (owed by batch 1, confirmed by the chair 00:38 UTC): batch 1's input hedges brought to "whenever <input> can be had" (22 fragments over the Potter, Brickmaker, Dairy farmer, Salt works, Charcoal burner and its sibling twins, Sawmill, Tannery, Fishmonger and Smelter texts), TEXT ONLY: the same pools, hash and index; true wherever they printed before (a hedge re-worded, nothing silenced). NOT TOUCHED, by the chair's word: the Vintner's and the Glassblower's texts (the record denies their input in every town that holds them, 184 of 184 and 13 of 13: the record's fault, being measured). (b) SEA CHARTS (02662): the Cartographer's guild's three texts (the catalogue line and its two variants) name sea charts in a city with no coast: false in 147 of the 176 census towns that print one; each now NEEDS `coast` in a sibling set (`DESC_VARIANT_SIBLINGS`) and its twin, the same words less "sea charts", prints where there is none (the two variants leave the colour column, the ledger marks them `colourReadBy`). (c) A CROWN OR A NOBLE the ruler is not (H7 "a charter the town does not have"): the Weekly market's five charter lines (137 false town-rows of 160 over the seven crown lines; batch 4's commit message says 129: this figure is the right one) (town and village: "Held by royal charter", "Requires a charter from the crown", "Royal charter required", "Requires royal/noble charter", "Held under royal or noble charter"; false where `ruler: lord` is not: 33/37, 30/34, 45/49, 7/10, 6/7) name no grantor; the high-magic Message network's two lines ("only the crown and the great guilds keep them": 8/12, 8/11) say "only the richest powers". The Mint's "noble or royal charter" lines are LEFT (a coinage right is the sovereign's by its nature; not flagged). (d) CHARCOAL WOOD where no Charcoal burner stands (21986, B22024: 8 of 9 each): the woodcutters' living is "timber and the carting of it". NOT TAKEN: 12014 the brewery "sends beer across the region" (false in 1 of 9: r2s-occupied-town-2 exports none): its text is BANKED in the walker's register (`house: brewery`, `house: tavern`); a rewording is a fresh hit until the words go: left, named.

MEASURE before (after3 = the batch-3 tree) -> after4: 02662 64 -> 13 / 55 -> 7 / 57 -> 9 (176 -> 29, exactly the 147 false; the 29 coastal keep their sea charts); 03077 12 -> 0; 06984 11 -> 0; 21986 9 -> 0; B22024 9 -> 0. THE INVENTORY DIFF (tabs): 29,853 -> 29,856, gone 32, new 35, IN FEWER TOWNS 6: the three sea-charts texts (the cure: their 147 false towns take the twin) and three lines in ONE town ("Patron deity", "Assign a patron god ...", "Upgrade to premium ...", 717 -> 716, r2r-thorp-2): a render flake of the premium prompt (batch 3's diff showed the same three lines move in two towns), nothing of this batch prints there. The exports: gone 57, new 63, in fewer 6 (the same). THE INHERITORS: the 35 rewordings and twins (read in place: r2r-city-0 the cartographers with no coast, r2r-city-9 with one; r2r-town-1 the market; r2r-hamlet-21 the woodcutters; r2r-city-17 the brickmaker and smelter).

DECLARED MOVE: `institutions[].desc` only (the sea-charts twins are a declaration's twin in the same slot; no draw moved).

Guard: `tests/data/tailHouses4CoastCrown.test.js`: 9 RED pairs (9 of 9 red at the base, each with the record's denial asserted), 3 KEEP pairs (a coastal city keeps its sea charts; green at the base and after), and ONE HEDGE FORM (no catalogue, variant or twin text keeps one of batch 1's older hedges; red at the base). `tests/data/tailHouses1Gaps.test.js` re-keyed by identity (five rewording fragments).

Gates: eslint 0; typecheck:domain:strict 0; typecheck:ratchet OK; presumed-things `--check` fresh 144 (unchanged), stale 0 (the brewery's rewording made 2 fresh hits and was reverted, above); page-census `--grid`: 0 rises (the same 2 falls); the 90 test files naming the touched files: only the carried reds (gapLineHousesByKind, urbanBandInstitutions G5, wiringCensusDeclared, generatorGoldenMaster, presumedThings.walker ARM 1/2/3).

### The veto list, batch 4 (every new line; towns printing; the smallest and largest it reaches, and a crisis town)

- "A dairy for milk, butter, and cheese from cattle or goats, whenever livestock can be had." (18 towns): r2r-hamlet-12 (27), r2r-hamlet-52 (99), r2s-famine-hamlet-2 (92)
- "Boils or dries saline brine whenever brine can be had, yielding the raw salt that preserves food." (3 towns): r2s-recently_betrayed-hamlet-0 (73), r2r-hamlet-10 (90)
- "A collier's kilns under their turf, turning wood into charcoal whenever wood can be had: the fuel that burns hottest." (45 towns): r2s-plague_onset-hamlet-2 (24), r2r-metropolis-8 (344,689), r2s-famine-city-2 (13,213)
- "Timber and the hauling of it keep the place alive." (9 towns): r2r-hamlet-12 (27), r2s-succession_void-village-3 (301), r2s-occupied-village-1 (132)
- "A dairy for milk, butter, and cheese, from a herd of cattle or goats, whenever livestock can be had." (6 towns): r2r-hamlet-15 (42), r2s-succession_void-hamlet-0 (99)
- "Evaporates brine, whenever brine can be had, to leave salt behind: the raw mineral used to preserve nearly everything." (2 towns): r2r-hamlet-18 (56), r2r-hamlet-53 (95)
- "The settlement's living is timber and the carting of it." (9 towns): r2r-hamlet-46 (33), r2r-village-47 (375)
- "Charcoal kilns, tended day and night while a burn lasts, whenever wood can be had." (60 towns): r2r-hamlet-56 (74), r2s-succession_void-metropolis-3 (295,750), r2s-famine-city-0 (2,909)
- "Converts raw logs to planks and beams whenever logs can be had, for building and furniture." (14 towns): r2r-village-42 (144), r2r-village-26 (335)
- "Powered by water or ox, the saw reduces logs to planks and beams whenever logs can be had, for building timber and furniture." (6 towns): r2r-village-52 (162), r2r-village-4 (391)
- "A dairy for milk, butter, and soft cheese, from cattle or goats, whenever livestock can be had." (11 towns): r2s-occupied-village-1 (132), r2r-village-4 (391)
- "Shapes and fires clay into bricks for building, whenever clay can be had." (60 towns): r2s-mass_migration-village-2 (219), r2r-metropolis-13 (328,486), r2s-famine-city-3 (11,818)
- "Buys fish whenever fish can be had, salts it, and sells it on." (3 towns): r2r-village-31 (234), r2r-village-36 (368)
- "Turns hides to leather with oak bark, whenever hides can be had." (2 towns): r2r-village-52 (162), r2r-village-14 (371)
- "Milk, butter, and soft cheese from cattle or goats, whenever livestock can be had." (4 towns): r2r-village-31 (234), r2r-village-14 (371)
- "Requires a charter." (10 towns): r2r-village-49 (168), r2r-village-14 (371), r2s-famine-village-2 (214)
- "Pottery for the household (plates, jugs, vessels for storage), thrown at the wheel and fired in a small kiln whenever clay can be had." (74 towns): r2s-plague_onset-village-2 (141), r2r-metropolis-8 (344,689), r2s-famine-metropolis-0 (39,834)
- "Held under charter." (7 towns): r2s-plague_onset-village-1 (214), r2s-slave_revolt-village-0 (386)
- "A wheel and a modest kiln for domestic ware: plates, jugs, and storage jars, made whenever clay can be had." (90 towns): r2r-village-43 (149), r2r-metropolis-13 (328,486), r2s-famine-city-1 (3,402)
- "Evaporation pans and brine-works, at work whenever brine can be had." (43 towns): r2r-village-56 (117), r2r-metropolis-13 (328,486), r2s-famine-metropolis-1 (35,674)
- "Buys, salts, and sells fish, whenever fish can be had." (3 towns): r2r-village-49 (168), r2s-religious_conversion-village-0 (264)
- "Deals in fish, whenever fish can be had: bought, salted, and sold." (5 towns): r2s-monster_pressure-village-2 (242), r2r-village-51 (359)
- "Requires a market charter." (34 towns): r2s-occupied-town-2 (310), r2s-recently_betrayed-town-1 (2,359)
- "Held by charter." (37 towns): r2s-succession_void-town-3 (321), r2r-town-58 (2,468), r2s-famine-town-3 (737)
- "Charter required." (49 towns): r2s-infiltrated-town-1 (319), r2r-town-51 (2,465), r2s-famine-town-0 (1,696)
- "Charcoal furnaces for reducing raw ore to refined metal whenever ore can be had, cast in bars for whoever will buy them." (54 towns): r2s-monster_pressure-town-1 (1,295), r2r-metropolis-13 (328,486), r2s-famine-city-3 (11,818)
- "Converts raw ore to refined metal using charcoal-fueled furnaces, whenever ore can be had." (96 towns): r2s-religious_conversion-town-0 (474), r2r-metropolis-8 (344,689), r2s-famine-metropolis-0 (39,834)
- "Moulds and a kiln for building brick, fired whenever clay can be had; brick allows sturdier, more lasting construction." (63 towns): r2s-recently_betrayed-town-2 (1,298), r2r-metropolis-14 (271,164), r2s-famine-city-2 (13,213)
- "Professional cartographers, guild-organised, producing regional maps, property surveys, and reconnaissance maps for the army." (48 towns): r2s-infiltrated-city-1 (3,578), r2s-succession_void-metropolis-3 (295,750), r2s-famine-metropolis-0 (39,834)
- "A guild of professional cartographers producing regional maps, property surveys, and military reconnaissance maps." (51 towns): r2r-city-51 (2,414), r2r-metropolis-8 (344,689), r2s-occupied-metropolis-3 (262,531)
- "A guild of professional cartographers turning out regional maps, property surveys, and military reconnaissance." (48 towns): r2s-recently_betrayed-city-3 (2,781), r2s-mass_migration-metropolis-3 (248,369), r2s-famine-city-1 (3,402)
- "Each station costs as much as a merchant house, and only the richest powers keep #." (11 towns): r2s-monster_pressure-metropolis-1 (18,805), r2s-mass_migration-metropolis-2 (139,708), r2s-famine-metropolis-2 (29,083)
- "A station costs as much as a merchant house, so only the richest powers keep them." (12 towns): r2r-metropolis-11 (16,770), r2s-mass_migration-metropolis-3 (248,369), r2s-famine-metropolis-0 (39,834)
- "Milk, butter, and cheese from cattle or goats, whenever livestock can be had." (3 towns): r2s-monster_pressure-hamlet-3 (48), r2s-politically_fractured-hamlet-1 (63), r2s-under_siege-hamlet-1 (57)
- "Hides become leather here whenever hides can be had, cured with oak bark." (1 towns): r2s-wartime-village-2 (370)

## TAIL-HOUSES-2 · the chair's later notes (00:38-01:01 UTC)

- **(00:38)** THE ONE-HEDGE-FORM PASS is this seat's after H5: done in batch 4 (not the Vintner's nor the Glassblower's texts: named, the record's fault).
- **(H9, 00:45)** "Thieves' guild (powerful)" beside a thieves' power the record calls Minor or Suppressed (15 towns): the parenthesis is in the house's NAME, which is the catalogue row's identity (`catalogIdForName`, `crisisDependence.js` keys, the roster's walkers): a rename moves every record (a declared move, not a description cure). PARKED by the chair's H11 (01:24 UTC), measure 15 towns: a twin at one tab's name print would leave the Services tab, the PDF and the journal printing the old name. The two honest cures for a later seat: (a) ONE HOME for a house's printed name, called by every surface; (b) the roster seating the plain row where the record's thieves' power is below Significant (a declared move of the roster). NOT DONE here.
- **(01:00)** The citadel silence approved; its measure is in batch 3.
- **(H10, 01:01)** `ruling body` and `rival power` stand on the joined line at eeaa06816. MERGE ONLY WHEN a governance row is keyed to one (one merge commit, the before re-taken at the merged tree). NOT MERGED: no governance row was taken in this seat's two batches.

## TAIL-HOUSES-2 · what is left for the next seat (as TAIL-HOUSES-2 left it; see TAIL-HOUSES-3's WHAT IS LEFT below)

1. **THE GOVERNANCE ROWS (H7, 21 rows, the list above under "Left for the next seat")**: every one needs `ruling body` or `rival power` (the merchant guilds as "a political force"; "a loose council where nothing official exists"; "a single household head ... without ever being chosen"; "an elected council"): H10 says how: merge the joined line at eeaa06816 first (its own commit), re-take the before at the merged tree, then key each with a twin where the slot would fall mute. Add the governance rows of the H5 check here (occupation and legitimacy reasons, not the leaf's: B14388, B03373, 02668, 20701, B05076, 03077 (cured in batch 4), B02540, 03522, 16785, 14179; 03031, 00186, 14950, 14953, 03033) and X9's 29352, 29354, 15791, 16720.
2. **H7's remaining ordinary-times rows of the first worklist** (by shape, unmeasured): B06447 "Draws on: herb gathering areas" (69) and 06832 (39) (resourceChains dependsOn vs the chain state); 20982/20983 (45/33) the fish market's carted or fresh fish vs imports and depleted fisheries; 16366 "Refined ingots" where no Smelter or Mint (40); B13188 the toll bridge "steady" where isolated (33); 12916 "Major forces (hundreds to thousands)" in a city of 2,679 (26; size words, H2); 22677/22676 salaried soldiers where none are hired (7/6); B12963 the hot-springs chain (22); B02898 the hamlet's jetty (15); 14325/14350/14282 geography mustImport lines (11/2/1); 03036 "the local alehouses" (1); 15793 "only 1 craft institution" (1); 12014 the brewery (1, banked text: see batch 4).
3. **X9's remainder** (the exports' read; 39 rows still print at after4; 18 are gone at the tip, cured by batch 1 at the writer: 05998, 21727, 24070, 21725, 21726, 05997, 05999, 06472, 24068, 23260, 23261, 07711, 07712, 06381, 25383, 11211, 15796, 25384):

- 12239 (113; geographyData.js :: TERRAIN_DATA.economicStrengths): High - controls sea routes and naval access — hamlet of 23 with no force, defence Vulnerable, cannot control sea routes or naval access
- 25084 (113; geographyData.js :: TERRAIN_DATA.economicStrengths): Strategic value: High - controls sea routes and naval access — hamlet of 23 with no force, defence Vulnerable, cannot control sea routes or naval access
- 04687 (99; institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS): Ancient grove » Subsistence farming » Honey and beeswax, Foraged goods — chain run from Ancient grove; LAND says chain Foraging & Smallholding draws on Foraging areas, absent, and is 
- 29818 (93; supplyChainData.js :: SUPPLY_CHAIN_NEEDS.outputs): Vintner + Brewery » Meals and drink, Preserved foods — Vintner + Brewery » Meals and drink; gaps: Vintner exists but lacks access to grapes
- 32564 (76; geographyData.js :: TERRAIN_DATA.mustImport): stone (for major construction) — stone for major construction as critical dependency; TRADE imports list no stone; thorp of 7
- 06896 (64; supplyChainData.js :: SUPPLY_CHAIN_NEEDS.upstreamChains): Cloth Finishing & Clothing (impaired) — says Cloth Finishing & Clothing is impaired; LAND gives that chain as running
- 32789 (58; geographyData.js :: TERRAIN_DATA.mustImport): timber (for large vessels) — timber for large vessels as critical dependency; TRADE imports none, no shipyard in HOUSES, thorp of 20
- 14363 (47; supplyChainData.js :: SUPPLY_CHAIN_NEEDS.outputs): Iron ore deposits » Smelter + Specialized metalworkers » Refined iron ingots, Pig iron, Cast iron goods — iron ingots and pig iron from Smelter; LAND gaps say the Smelter lacks access to copper ore and gold/silver or
- 22250 (34; geographyData.js :: TERRAIN_DATA.mustImport): Quality textiles and cloth — quality textiles and cloth; TRADE made here lists none, HOUSES has no weaver, imports none, isolated
- 25094 (34; geographyData.js :: TERRAIN_DATA.economicStrengths): Strategic value: Medium - controls caravan routes, water sources are strategic — controls caravan routes; trade access isolated, exports and imports none
- 10230 (33; institutionDescVariants.js :: PAIRS): Fish market: The market wardens keep a roofed fish market where fresh catch and salted barrels are weighed out — fish market weighs 'fresh catch'; LAND: River Fisheries depleted, imports salted fish because the local fisher
- 04165 (32; institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS): Access to external mill: The lord's mill, and by banalité the only # grain may lawfully be ground at. — presumes a lord and banalite mill; GOVERNMENT is Headman's Authority only, no lord listed
- 29206 (29; geographyData.js :: TERRAIN_DATA.mustImport): Timber and building wood — timber and building wood as a trade good; desert thorp, LAND has no woodland, TRADE made here and imports list
- 15713 (21; geographyData.js :: TERRAIN_DATA.mustImport): Livestock for meat and draft — livestock for meat and draft; LAND has no grazing, TRADE made here lists no livestock, desert thorp
- 16720 (21; institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS): Merchant guilds: Each holds a grip on the trade in its particular wares. — each merchant guild holds a grip on trade; GOVERNMENT lists Merchant Guilds as Suppressed
- 22797 (19; institutionDescVariants.js :: PAIRS): River ferry: The river is crossed here by a flat-bottomed ferry, worked by a family that has held the right to — ferry 'held the right to it for generations'; the village is only 42 years old
- 05868 (15; supplyChainData.js :: SUPPLY_CHAIN_NEEDS.services): Boatbuilding & River Transport (impaired) — Boatbuilding & River Transport (impaired); LAND gives the chain running, Managed woodland available
- 06310 (10; supplyChainData.js :: SUPPLY_CHAIN_NEEDS.outputs): Caravanserai » Overland cargo transport, Escorted caravan, Pack animal hire — caravanserai offers cargo transport, escorted caravans, pack animal hire; LAND gaps: it lacks camel herds (dep
- 29820 (9; supplyChainData.js :: SUPPLY_CHAIN_NEEDS.outputs): Vintner » Meals and drink, Preserved foods — Vintner » Meals and drink, Preserved foods; gaps: Vintner exists but lacks access to grapes
- 29354 (8; institutionDescVariants.js :: PAIRS): Town council: With no formal government in place, a loose council of leading citizens runs the town. — 'no formal government in place'; GOVERNMENT names Church Council as governing power with Dominant strength
- 29542 (7; institutionDescVariants.js :: PAIRS): Traveling performers: Bards, jugglers, and acrobats, come for the fairs. — performers 'come for the fairs'; HOUSES has no Annual fair, only a weekly market
- 29543 (7; institutionDescVariants.js :: PAIRS): Traveling performers: The fairs bring bards, jugglers, and acrobats through. — 'The fairs bring bards, jugglers, and acrobats'; HOUSES has no Annual fair, only a weekly market
- 15791 (6; institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS): Lord's appointee: A man of the lord's choosing governs, and noble authority overrides whatever the town was ac — 'A man of the lord's choosing governs'; PEOPLE: the lord's appointee Nada ibn Zuhr is female (f)
- 29541 (6; institutionalCatalog.js :: INSTITUTION_FAMILIES.town): Traveling performers: Bards, jugglers, acrobats visit during fairs. — performers 'visit during fairs'; HOUSES has no Annual fair, only a weekly market
- 29352 (5; institutionalCatalog.js :: INSTITUTION_FAMILIES.town): Town council: An informal council of prominent citizens manages town affairs in the absence of formal authorit — says an informal council acts without formal authority; GOVERNMENT has Town Council governing, with a Mayor
- 10509 (5; supplyChainData.js :: SUPPLY_CHAIN_NEEDS.resourceSubstitutes): Foraging & Smallholding (impaired) — chain printed impaired; LAND gives Foraging & Smallholding running, its resource Foraging areas available
- 21584 (4; supplyChainData.js :: SUPPLY_CHAIN_NEEDS.services): Pilgrimage & Holy Sites (impaired) — prints Pilgrimage & Holy Sites as impaired; LAND gives the chain as running on available hot springs
- 11352 (4; supplyChainData.js :: SUPPLY_CHAIN_NEEDS.outputs): Grain fields » Dairy farmer » Baked goods, Preserved foods — Dairy farmer made to yield baked goods and preserved foods from grain fields; gaps say the dairy farmer lacks 
- 20868 (3; supplyChainData.js :: SUPPLY_CHAIN_NEEDS.outputs): Oasis and Water Rights » Caravanserai » Water trade, Dates and fruit, Caravan resupply — shows the Caravanserai producing water trade and caravan resupply; LAND gap says it lacks access to camel herd
- 06314 (3; institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS): Caravanserai: A walled waystation offering merchants, their beasts, and their goods a safe night's rest. — calls the caravanserai a 'walled' waystation; DEFENCE walls: none
- 10518 (2; institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS): Foraging areas (depleted) » Subsistence farming » Honey and beeswax, Foraged goods — foraging areas (depleted) given as feeding honey and foraged goods with no 'normally'; LAND: Wild Foraging Are
- 19204 (2; supplyChainData.js :: SUPPLY_CHAIN_NEEDS.services): Mountain Pass Control (impaired) — Mountain Pass Control printed impaired; LAND gives that chain as running
- 06275 (2; supplyChainData.js :: SUPPLY_CHAIN_NEEDS.upstreamChains): Caravan & Overland Trade (impaired) — Caravan & Overland Trade printed impaired; LAND gives it as running
- 25069 (2; supplyChainData.js :: SUPPLY_CHAIN_NEEDS.services): Strategic Crossroads Toll (impaired) — Strategic Crossroads Toll printed impaired; LAND gives it as running
- 11602 (2; supplyChainData.js :: SUPPLY_CHAIN_NEEDS.outputs): Grazing land (depleted) » Tanner (established) » Boots and shoes, Saddles and harness, Leather armour — tanner yields boots, saddles, leather armour from grazing land; LAND gives grazing land as depleted and Leathe
- 08266 (1; supplyChainData.js :: SUPPLY_CHAIN_NEEDS.services): Divine & Magical Healing (impaired) — says Divine & Magical Healing is impaired; LAND gives that chain as running, its hot springs available
- 14624 (1; resourceChains.js :: RESOURCE_CHAINS.intermediateGoods): It sends out gold/silver bars. — says it sends out gold/silver bars; TRADE exports none and LAND gap says gold/silver ore cannot produce final 
- 14634 (1; resourceChains.js :: RESOURCE_CHAINS.finalProducts): It sends out medicines, restorative treatments, mineral salts and cut gems. — says it sends out cut gems; TRADE exports list no gems, HOUSES has no gem-cutter, and LAND says gemstones cann
- 19869 (1; geographyData.js :: TERRAIN_DATA.naturalFeatures): Nearby resources: Mountain Timber, Alpine Pasture, Hunting Grounds, Defended Pass, Iron Deposits — lists a Defended Pass; DEFENCE has no wall, garrison, militia or hired force, only a Town watch; defence word 

   The widest are the geography strengths ("High - controls sea routes and naval access", 113 towns, a hamlet of 23 with no force; "agricultural heartland"; "difficult to besiege" under a siege; "controls caravan routes" where isolated) and the mustImport lines: `geographyData.js :: TERRAIN_DATA`, terrain-keyed text that no town fact conditions yet. The caravanserai's "walled" (06314) takes the `walls` atom's twin; the external mill's "lord's mill, by banalité" (04165) the `ruler: lord` atom's; the travelling performers' "fairs" (29541-29543) want an Annual fair on the roster (no `institution: fair` atom: a twin without the fair).
4. **Named, not this group's**: the Smelting & Refining chain card's outputs (B15417/B04587) are already headed "Normally yields" by `domain/chainYield.js` where the chain is refused (struck); H9's display twin-name (the Institutions tab).

## TAIL-HOUSES-2 · instruments and tips

- The scratch worktree `<scratchpad>/wt` (detached at the branch tip, its own `npm ci`), a second `<scratchpad>/wtbase` (detached at a base commit, node_modules symlinked) for base re-renders and base test runs. THE CENSUS RENDERS FROM THE TREE'S OWN DATA FILES: never edit (or stash) `src/data` while a census of that tree renders (batch 3's before was re-rendered in part for that reason: 183 dumps on `wtbase`).
- The measure script `measure3.mjs <tree> <corpus.ndjson.gz> <rows.json> <out.json>`: rows `{id, text, house?, false: <js over s (record), f (factsOf), cond, has, imports, atomHolds>}`; the veto-list script `veto.py <inventory.json> <new-sentences.json>` (both in this seat's scratchpad: re-made from this description in minutes).
- H5's script: each row's house by its text over the catalogue, `INSTITUTION_DESC_VARIANTS` and `DESC_VARIANT_SIBLINGS` (the journal's `House: text` prefix; a chain row by `SUPPLY_CHAIN_NEEDS` id) -> `catalogIdForName` -> the joined line's `crisisDependence.js` (copied out as a module).
- The walker: `node scripts/presumed-things-door.mjs --check` (fresh / stale), `--shrink` after a rewording; the door banks only what stood at the widening's base, so a reworded text whose old form was BANKED must avoid the banked word.
- Tips: H5 5a5166898; batch 3 2c10ddefe; batch 4 this file's commit. Handed back after batch 4 by time (about 75 minutes; the token count read 0).

## TAIL-HOUSES-3 · the chair's rulings since (2026-11-15 02:10 UTC; each vetoable by the owner)

- **(H12)** THE GOVERNANCE ROWS STAY PARKED: the atom `ruling body` takes NO NEW LINE until the chair says so (a measuring seat is answering whether the density resize changes the governing power's one-or-many kind after the lines are written). Make no merge for them now.
- **(H13)** THE ORDER: the exports' rows first (X9: the 39 still printing on the PDF and the journal: the geography strengths are the widest); then the rows of the first worklist that print in FIVE TOWNS OR MORE; a row in fewer than five towns waits. H9 ("(powerful)") stays parked as H11 wrote it; the brewery's banked text (12014) waits for the close.
- **(H14)** Everything NEW on the tabs at the first landed tip was read cold (READ-ALL-4): no row of these files was flagged: nothing to take.
- **(H15)**, 02:26 UTC (read at 03:00, after batch 5's push): H12 IS LIFTED: on the 720 the density resize NEVER changes the governing power (its name, `government` and category the same when the lines are written as at the end, 720 of 720): `ruling body` is safe at every step and takes new lines again. THE GOVERNANCE ROWS ARE OPEN, in their place by width (the exports' rows still first): merge the joined line at d817736d8 for them (`git fetch origin lane/join-2026-11-14`; it holds both atoms; the only merge this seat makes) and re-take the before there. STILL NOT TO BE KEYED ON: the governing power's capture state (it moves after the write in 103 towns) and its legitimacy crisis note (11).
- **(U1)** The account's weekly usage warning: commit and push every batch the moment it holds, WHAT IS LEFT current in the same push; hand back at 250,000; one line to the chair only at the hand-back, a stop, or a question.

## TAIL-HOUSES-3 · Batch 5 · X9 first (H13): a strategic line or a house text claims a navy, caravans, generations, a fair, a lord or fish the record denies

Seat: TAIL-HOUSES-3, on this branch from 9525e011b (read back from origin), scratch worktree; the before run on a second clean worktree at the same tip (`wtbase`), so the tree under edit never rendered.

THE SHAPES (H2/H7, ordinary times; every text-keyed copy moved with its text: the colour column, `DESC_VARIANT_SIBLINGS` and `DESC_VARIANT_DECLARATIONS` keys, the declaration ledger `docs/census/declarations/institutionDescVariants.INSTITUTION_DESC_VARIANTS.json`; NO DRAW MOVED: the same pools, hash and index):
- (G) THE TERRAIN'S STRATEGIC LINE (`geographyData.js :: TERRAIN_DATA.strategicValue`, printed raw by the PDF and the journal): the coast's "controls sea routes and naval access" is backed by no naval force in ANY of the 113 coastal census towns (no navy, fleet or admiral house; a thorp of 7 prints it); reworded "a coastal position, within reach of the sea routes and naval access" (the rating word "High - " kept: `defenseStateProse.js :: TERRAIN_PRIZE_OF` binds it). The desert's "controls caravan routes" is false in 14 of 34 (isolated, or no caravan house or chain); reworded to the hedge "water sources are strategic, and command any caravan route that comes this way" (true where caravans come, and claims none where none do).
- (F) THE RIVER FERRY "for generations" (the catalogue row, two variants and their three water twins): false in 10 of 119 ferry towns (`history.age` under 60: the read-in village is 42 years old); reworded to hold the right without a span ("holds the crossing rights", "held in one family", "the family that holds the right to it"). No age word in the vocabulary, so no twin: the reworded line replaced a true one in 109 towns (silence of the span only; the family's right still prints).
- (P) TRAVELLING PERFORMERS "come for the fairs" (the town catalogue row and its two variants): false in 11 of 20 (no Annual fair or Major annual fairs); "festivals" in their place (no house claimed).
- (M) THE HAMLET'S EXTERNAL MILL named the lord's or the manor's, by banalité (the catalogue row and two variants): false in 104 of 120 (`ruler: lord` does not hold). A sibling keyed on `ruler: lord` was not taken: the ruler kind is not settled at the description draw (`birthFactsOf` carries no `powerStructure`: an H8-shaped key). Reworded to claim no lord and no mill house ("Grain is taken out of the hamlet to be ground."); my first wording named "mill" and made 3 fresh walker hits: reworded before the commit. Silences the banalité in the 16 lord-ruled hamlets (fewer than 20).
- (C) THE FISH MARKET'S INPUT, in the one hedge form "whenever fish can be had" (its three fresh-catch texts and their three carted twins): the catch is false in 32 of 104 (the fisheries depleted, none live); the carted salt fish in 152 of 152 (no fish source and no fish among the primary imports). Also cures H5's 16857 and 06002 (siege, "fish carted in": listed for the services seat) and B05738 at the writer.

MEASURE (the record, `bydesc.mjs` over the base corpus; towns printing by the inventory): before -> after, tabs and exports (`SURFACES=PDF,Journal`):

| id | list | towns before -> after | false before | sentence (before) |
|---|---|---|---|---|
| 12239 | X9 | 113 -> 0 (PDF) | 113 | High - controls sea routes and naval access |
| 25084 | X9 | 113 -> 0 (journal) | 113 | Strategic value: High - controls sea routes and naval access |
| 16377 | X9 | 34 -> 0 (PDF) | 14 | Medium - controls caravan routes, water sources are strategic |
| 25094 | X9 | 34 -> 0 (journal) | 14 | Strategic value: Medium - controls caravan routes, ... |
| 20982 | W1 | 45 -> 0 | 45 | The market wardens keep a roofed fish market where carted barrels of salt fish ... |
| 20983 | W1 | 33 -> 0 | 17 | The market wardens keep a roofed fish market where fresh catch and salted barrels ... |
| 10230 | X9 | 33 -> 0 (journal) | 17 | Fish market: (the same) |
| 10228 | X9 | 32 -> 0 (journal) | 7 | Fish market: Covered stalls ... the morning's catch ... |
| 16857 | H5 | 58 -> 0 | 58 | Salted, smoked and dried fish come in by cart, ... |
| 06002 | H5 | 49 -> 0 | 49 | Covered stalls ... salt fish and dried fish carted in by the barrel ... |
| B05738 | H5 | 32 -> 0 | 7 | Covered stalls ... the morning's catch or the week's salted barrels ... |
| 04165 | X9 | 32 -> 0 (journal) | 26 | Access to external mill: The lord's mill, and by banalité ... |
| 22797 | X9 | 19 -> 0 (journal) | 2 | River ferry: The river is crossed here ... for generations. |
| 29541 | X9 | 6 -> 0 (journal) | 2 | Traveling performers: Bards, jugglers, acrobats visit during fairs. |
| 29542 | X9 | 7 -> 0 (journal) | 6 | Traveling performers: ... come for the fairs. |
| 29543 | X9 | 7 -> 0 (journal) | 3 | Traveling performers: The fairs bring ... |

THE INVENTORY DIFF (before -> after5). Tabs: 29,856 -> 29,856, gone 17, new 17, IN FEWER TOWNS 0, in more 3 (the premium prompt's render flake, "Patron deity" / "Assign a patron god ..." / "Upgrade to premium ...", 716 -> 717, as in batches 3 and 4: nothing of this batch prints there). Exports: 35,765 -> 35,765, gone 35, new 35, in fewer 0, in more 0. All 16 rows GONE. THE INHERITORS are exactly the 17 (tabs) and 35 (exports) rewordings; read in place: r2r-hamlet-28 and r2r-thorp-59 (the coast line, no navy), r2r-thorp-46 (desert, isolated), r2r-village-56 (the ferry), r2r-town-15 (the performers), r2r-hamlet-3 (the mill), r2r-town-0 and r2r-town-3 (the fish market).

TOLD TO THE CHAIR at the hand-back, not before the push (ruling U1's diet; each is a REWORDING that replaced a line true in more than twenty towns, not a silence): the ferry's span (109 towns), the fish market's hedges (72 of the catch's 104), the coast line (the 48 port towns of town size and up with docks; no naval fact backs "controls" in any).

DECLARED MOVE: `institutions[].desc` and `resourceAnalysis.strategicValue` (text only; no draw moved).

Guard: `tests/data/tailHouses5ExportsTerrain.test.js`: 19 RED pairs (19 of 19 red at the base, each with the record's denial asserted: no navy, isolated, `history.age` < 60, no fair, no lord, fisheries spent, no fish in), 5 KEEP pairs (green at the base and after). The RED table is its own plant: each pair reds on the old text.

Gates: eslint 0 on the touched files; typecheck:domain:strict 0; typecheck:ratchet OK (167, ceiling 167); presumed-things `--check` fresh 144 (as at the base), 3 first-register stale rows (the old mill literals) removed by `--shrink`; page-census `--grid`: 0 rises (the same 2 falls, P7a); the 99 test files naming the touched files: only CARRIED reds (each red at the base): gapLineHousesByKind, urbanBandInstitutions G5, wiringCensusDeclared, generatorGoldenMaster, and coherenceAgreeCures (2: the gate tally; red at 9525e011b too).

### The veto list, batch 5 (every new line; towns printing; the smallest and largest it reaches, and a crisis town)

- "Nothing is ground here; the grain goes out of the hamlet for grinding." (32 towns): r2r-hamlet-0 (22), r2s-slave_revolt-hamlet-2 (98), r2s-famine-hamlet-2 (92)
- "The hamlet's grain is carried elsewhere to be ground." (44 towns): r2r-hamlet-44 (21), r2s-succession_void-hamlet-0 (99), r2s-famine-hamlet-3 (22)
- "Grain is taken out of the hamlet to be ground." (44 towns): r2r-hamlet-16 (20), r2r-hamlet-24 (100), r2s-occupied-hamlet-0 (20)
- "A flat-bottomed ferry over the water, the crossing rights held in # family." (17 towns): r2r-village-53 (269), r2r-metropolis-52 (78,043), r2s-famine-town-2 (407)
- "The water is crossed here by a flat-bottomed ferry, worked by the family that holds the right to it." (13 towns): r2r-village-41 (81), r2r-metropolis-13 (328,486)
- "The ferryman's family holds the crossing rights, and every crossing pays the family its fare." (50 towns): r2s-under_siege-village-3 (123), r2r-metropolis-8 (344,689)
- "The river is crossed here by a flat-bottomed ferry, worked by the family that holds the right to it." (19 towns): r2r-village-56 (117), r2s-mass_migration-metropolis-0 (44,124), r2s-occupied-town-3 (2,018)
- "A flat-bottomed ferry over the river, the crossing rights held in # family." (20 towns): r2s-succession_void-village-2 (87), r2r-metropolis-46 (131,927), r2s-famine-village-1 (90)
- "The market wardens keep a roofed fish market where, whenever fish can be had, carted barrels of salt fish are weighed out and inspected before sale." (45 towns): r2r-town-36 (440), r2r-metropolis-14 (271,164), r2s-under_siege-town-1 (1,339)
- "The market wardens keep a roofed fish market where, whenever fish can be had, fresh catch and salted barrels are weighed out and inspected before sale." (33 towns): r2r-town-3 (1,168), r2r-metropolis-6 (216,641), r2s-occupied-city-2 (13,152)
- "Salted, smoked and dried fish come in by cart whenever fish can be had, sold by weight and inspected for rot." (58 towns): r2r-town-24 (423), r2s-occupied-metropolis-3 (262,531), r2s-under_siege-town-2 (2,453)
- "Covered stalls under the wardens' eye, selling the morning's catch or the week's salted barrels by weight whenever fish can be had, each checked for rot." (32 towns): r2r-town-18 (1,095), r2r-metropolis-8 (344,689), r2s-famine-city-0 (2,909)
- "Covered stalls under the wardens' eye, selling salt fish and dried fish carted in by the barrel whenever fish can be had, each checked for rot." (49 towns): r2s-infiltrated-town-2 (660), r2s-succession_void-metropolis-3 (295,750), r2s-famine-town-3 (737)
- "Whenever fish can be had, the morning's catch or the week's salted barrels are sold by weight and inspected for rot." (39 towns): r2s-politically_fractured-town-0 (843), r2r-metropolis-13 (328,486), r2s-under_siege-town-0 (2,137)
- "Bards, jugglers, and acrobats, come for the festivals." (7 towns): r2r-town-36 (440), r2s-recently_betrayed-town-1 (2,359)
- "The festivals bring bards, jugglers, and acrobats through." (7 towns): r2r-town-21 (1,181), r2r-town-51 (2,465)
- "Bards, jugglers, acrobats visit at festival time." (6 towns): r2s-politically_fractured-town-0 (843), r2r-town-58 (2,468)
- "Medium - water sources are strategic, and command any caravan route that comes this way" (34 towns): r2s-infiltrated-thorp-3 (6), r2r-metropolis-12 (142,760), r2s-occupied-hamlet-1 (95)
- "High - a coastal position, within reach of the sea routes and naval access" (113 towns): r2r-thorp-59 (7), r2r-metropolis-13 (328,486), r2s-under_siege-thorp-1 (16)

### Struck by TAIL-HOUSES-3 (verified by the record; one line why)

- 16376 / 25093 (67; "agricultural heartland, but exposed to raids", read under a famine): the clause is already conditioned at its writer (`resourceGenerator.js :: STRATEGIC_CLAUSES`, grain or grazing land; else "open country"); grazing land is farmland; the famine is H1's class.
- 15808 / 25089 (54) and 15809 / 25090 (13) ("difficult to besiege", read under a siege or a weak defence): a property of the forest ground (the desk's FAVOURABLE terrain map, `defenseStateProse.js :: TERRAIN_DEFENCE_OF`, bound by `defenseStateProseDesk.test.js`); a siege under way does not make the ground easy; the defence's strength prints on its own line.
- 06314 (3; the caravanserai "walled" where the town has no walls): the walls are the waystation's own compound's, not the town's defence.
- B06447 (69) / 06832 (39) ("Draws on: ..." where the resource is absent): a requirement list, not a claim of presence (`registeredWords.js:801`: "NOT A CLAIM: ... 'Draws on: …'").
- 22677 (7) / 22676 (6) (the Free company hall's "salaried men" where the defence hires none): the hall is the band's own billet "between campaigns"; its men are soldiers for hire whether or not this town has hired them.
- 16366 (40; "Refined ingots" under Mining & Coinage with a Jeweller and no Smelter or Mint): refining precious metal to the ingot is the goldsmith's own work; the chain's processor holds.
- B13188 (33; the toll bridge's "Modest revenue, but steady" where isolated, 3 of 33): isolation is the trade route's abstraction, not an empty bridge; the keeper takes fees from whoever crosses (the siege twin already speaks for the cut roads).

### Named for other groups (not this group's files; the leaf or the writer to call)

- THE PDF'S CHAIN FLOW (`src/pdf/.../SupplyChainFlow`, `EconomicsTrade.jsx`): `resource » house » outputs` printed as made where the chain's input is absent or depleted, while the tab's card reads `domain/chainYield.js` ("Normally yields"): 04687 (99), 14363 (47), 16297 (12), 06310 (10), 11352 (4), 20868 (3), 10518 (2), 11602 (2). One cure: the flow reads `chainYieldRefused` as the card does.
- THE CHAIN STATE'S "(impaired)" against LAND's "running" (upstream / services labels): 06896 (64), 05868 (15), 10509 (5), 19204 (2), 06275 (2), 25069 (2) for the chain-state writer; 21584 (4, pilgrimage) and 08266 (1, divine healing) are H4's (parked for the owner).
- THE MUST-IMPORT LIST printed as a CRITICAL DEPENDENCY (`resourceGenerator.js :: buildViabilityReport`, the PDF's "Critical dependencies"): "stone (for major construction)" in a thorp of 7 (32564, 76), "timber (for large vessels)" with no shipyard (32789, 58), 22250 (34), 29206 (29), 15713 (21), and the tab's "Needed, and not brought in: ..." beside an import of iron (14325, 11): the classification is by terrain, not by tier or by the imports; the texts are terrain words and true as such.
- THE FACTION BOOST (`faction_boost` adds a Mercenary quarter with the raw catalogue text after the description draw, so its tier sibling is never read): 12916 "Major forces (hundreds to thousands)" in r2s-under_siege-city-1 (2,679), the one town where it is false.
- THE RECORD SEAT: the Vintner's grapes (29818, 93; 29820, 9): H6, as named.
- A stale comment only: `defenseStateProse.js:845` quotes the old coastal line in prose (not this group's file).

## WHAT IS LEFT (TAIL-HOUSES-3, at batch 5's push; superseded by TAIL-HOUSES-4's list below)

1. **Batch 6 (in hand at this push, NOT DONE yet)**: the Fisher's landing's three texts take the one hedge for their catch ("whenever fish can be had"): false only where the fisheries are spent and none live (12 of 76 landings: B02898 2 of 15, its two siblings 6 of 31 and 4 of 30; the coastal hamlets with no fishing-grounds resource fish the sea: the record's food sources hold fish and no gap is named, so not false there).
2. **THE GOVERNANCE ROWS, OPEN BY H15 (NOT STARTED: the next seat's first work after batch 6, or before it: they are wider)**: FIRST the one merge: `git fetch origin lane/join-2026-11-14`, merge d817736d8 into this branch in its own commit (it holds `ruling body` and `rival power`), `npm ci` if the lockfile moved, then RE-TAKE THE BEFORE at the merged tree (census + both inventories). Then by width, the rows printing in five towns or more at this push's base (towns printing): 15890 (38) "Powerful political force.", 15765 (33), 02600 (32) (the merchant guilds as a political power: `rival power`); B14388 (26), B03373 (18), 20218 (15) (officials and clerks "run the city" / "less formally constituted than a council"); 02783 (26) "A looser arrangement than a council"; B05150 (16) "Alderman" and B05317 (13) "Lord Marshal" (a title the person does not hold: the PEOPLE line read only the first title: check `memberships` first); 03031 (14), 03029 (13), 00186 (13), 14950 (13), 14953 (11), 03033 (8) (a single unchosen figure or household head); 02668 (14), 20701 (13), 02494 (11), 28580 (9) (merchant houses or guild masters "hold the real civic power"); B05076 (13) (family heads, each voice equal); 02643 (12) (a governor "holds sway, the city a noble fief"); 28852 (11), 29000 (8), 03522 (5), 21211 (6) ("where nothing official exists", "in the absence of formal authority"); 03508 (10), 02461 (5) ("an elected council"); B02540 (9) "A free hamlet with no lord's representative."; 02794 (6) / X9 15791 (6) "A man of the lord's choosing" (also the person's sex: batch 2's shape); X9 16720 (21), 16785 (14), 29353 (11), 14179 (9), 29354 (8), 29352 (5). NOT TO BE KEYED ON (H15): the power's capture state, its legitimacy note.
3. **PARKED (H4)**: 15712 (60), 09319 (7), 21584, 08266.
4. **WAITS (H13)**: H9 "(powerful)" (15 towns, H11's two cures); 12014 the brewery (banked text) for the close; every row printing in fewer than five towns (X9: 14624, 14634, 19869, 14635, 09159; W1: 03036, 15793, 14350, 14282, 12559 and the H1 table's small rows).
5. **The X9 rows H5 answered by the leaf or sent to the services seat**: as H5 lists them (no cure here).


## TAIL-HOUSES-3 · instruments and tips

- `<scratchpad>/wt` (detached at the branch tip, its own `npm ci`) for edits; `<scratchpad>/wtbase` (detached at the base, node_modules symlinked) for the BEFORE census, so the tree under edit never renders mid-edit. Census: `sh census3.sh <tree> <out> 4` (births + render about 12 minutes, count + trace 6 more); `inventory.py` twice (the tabs; `SURFACES=PDF,Journal`); `inventory_diff.py before after rows.json`.
- `bydesc.mjs <tree> <corpus>`: a house's desc by a needle, counted false by a test over the record (`factsOf`, `atomHolds`, `history.age`, `config.nearbyResources[Depleted]`, `economicState.primaryImports`); `rekey5.py <tree>`: exact old -> new over the four data files and the declaration ledger. Both re-made from this description in minutes.
- THE RECORD'S FACTS FOR THESE SHAPES: the settlement's age is `history.age` (`config.settlementAgeYears` is 0 under `auto`); the `fish` atom holds wherever fish is a food source, even with the fisheries depleted: read `config.nearbyResourcesDepleted` for a spent fishery; the ruler kind is NOT settled at the description draw (`birthFactsOf` has no `powerStructure`), so a desc sibling keyed on `ruler: ...` would not read; a house added by `faction_boost` keeps the raw catalogue text (no sibling read).
- Tip: batch 5 57a19f800; this hand-back's commit is the tip. Handed back by time (about 50 minutes of this seat; the count read 0), before batch 6, with H15 just read.

## TAIL-HOUSES-4 · the chair's rulings (2026-11-15 03:06 UTC; each vetoable by the owner)

- **(H16)** FIRST, THE WIDE ROWS NOBODY HAS VERIFIED: the two tables the predecessors left unverified ("Candidates for the H1 strike" and "Left for the next seat: ordinary-times rows"), WIDEST FIRST (B12717 177 towns; B17254 87; then down to five towns): each row measured over EVERY town that prints it. A crisis reason is the services seat's class (the crisis leaf marks the row on every surface): STRIKE it for the leaf if it is true in ordinary times; an ordinary-times reason is this seat's: cure by a condition, a twin or the one hedge form, or strike with the measure.
- **(H17)** BATCH 6 as the hand-back has it (the fisher's landing: false in 12 of 76).
- **(H18)** THE GOVERNANCE ROWS (about thirty, 5 to 38 towns): a house's description is drawn BEFORE the powers exist (`birthFactsOf` holds no power structure), so a sibling keyed on `ruling body` or `rival power` CANNOT READ at the draw. No merge for them now; two ways only: (i) a rewording true in every town that prints the line that keeps it a good line (it claims the house's own trade and standing, not who governs); (ii) a row no such rewording saves is PARKED with its measure for THE LATE RE-READ (a pass that re-checks a drawn line's declared needs against the settled record and swaps in its twin; being built on the crisis branch; the chair names the tip). Do not key a description on a power atom before that word.
- **(H19)** The titles a person does not hold (B05150 "Alderman", B05317 "Lord Marshal"): check the record's `memberships` first; strike what the record bears.
- A row printing in fewer than five towns waits. H9 and the brewery's banked text stay as H11 and H13 left them.
- **(U1)** the account's weekly usage warning: commit and push every batch the moment it holds, with WHAT IS LEFT current in the same push; hand back at 250,000 (or about seventy minutes); one line to the chair at the hand-back, a stop, or a question only.

## TAIL-HOUSES-4 · Batch 6 (H17): the Fisher's landing claims its catch in the one hedge form

THE SHAPE (H2, verified by the record): the Fisher's landing's three texts (the catalogue line, `institutionalCatalog.js` shared; PAIRS[21]'s two, `institutionDescVariants.js`, the hamlet and the village pools) land, cure and live on a catch where the town's fisheries are spent and none live (`config.nearbyResourcesDepleted` holds every fishing resource of `config.nearbyResources`): 12 of the 76 census landings (the rough jetty 2 of 15, the crude landing 6 of 31, the rough landing 4 of 30; B02898, its siblings, and the H1 candidate B13370, the crude landing's second sentence). The `fish` atom holds wherever fish is a food source, spent or not, and the vocabulary has no spent-resource word, so no twin can key: THE ONE HEDGE FORM, text only (the same pools, hash and index; the colour declaration and the declaration ledger re-keyed by identity). No draw moved. DECLARED MOVE: `institutions[].desc` only.

THE TRUE LINES IT REPLACES: 64 towns (the live-fishery landings take the hedge too). Over twenty: told to the chair in the hand-back line (U1: no line a batch); the hedge claims nothing a live fishery denies.

| old | new |
|---|---|
| A rough landing with racks for drying and salting fish. Primary protein source near water. | A rough landing with racks for drying and salting fish. Whenever fish can be had, the primary protein source near water. |
| A crude landing hung with racks for drying and salting the catch. Near water, it is the chief source of protein. | A crude landing hung with racks for drying and salting the catch. Near water, and whenever fish can be had, it is the chief source of protein. |
| A rough jetty and its salting-and-drying racks, where the hamlet's catch is landed and cured. | A rough jetty and its salting-and-drying racks, where the hamlet's catch is landed and cured whenever fish can be had. |

Guard: `tests/data/tailHouses6FishersLanding.test.js`: 12 RED pairs (the 12 spent-fishery landings; 12 of 12 red at the base, each with the record's spent fishery asserted), 3 KEEP pairs (a live fishery prints each text's racks; green at the base and after).

MEASURE (before = the base b3ac30f8a; after = this tree): THE INVENTORY DIFF (tabs): 29,856 -> 29,856; gone 3, new 3, in fewer towns 0, in more towns 0: the three old texts (31, 30, 15 towns) and their hedged forms (31, 30, 15), the same towns. The exports: gone 4, new 4, in fewer 0 (the same, and the journal's "Fisher's landing: ..." line). Rows: B13370 31 -> 0, B02898 15 -> 0 (the catalogue line, 30 -> 0, is the third). THE INHERITORS: the three hedged lines only, read in place.

### The veto list, batch 6 (towns printing; the smallest and the largest it reaches, and a crisis town)
- "Near water, and whenever fish can be had, it is the chief source of protein." (31): r2r-hamlet-44 (21), r2r-village-11 (374), r2r-village-21 (under siege)
- "Whenever fish can be had, the primary protein source near water." (30): r2r-hamlet-28 (23; famine), r2r-village-2 (388)
- "A rough jetty and its salting-and-drying racks, where the hamlet's catch is landed and cured whenever fish can be had." (15): r2r-hamlet-16 (20; famine), r2r-hamlet-5 (97)

Gates: eslint 0 on the touched files; typecheck:domain:strict 0; typecheck:ratchet OK (167, ceiling 167); presumed-things `--check` fresh 144, stale 0 (unchanged); page-census `--grid` 0 rises (the same 2 falls, r2r-city-0 and r2s-insurgency-metropolis-0 P7a); the 87 test files naming the touched files (with batch 7's tree): only the carried reds (gapLineHousesByKind, urbanBandInstitutions G5, wiringCensusDeclared, generatorGoldenMaster).

## TAIL-HOUSES-4 · Batch 7 (H18 (i), and batch 2's shape): a governing house claims its own trade, not a government or a sex the record denies

THE SHAPE (verified by the record). "City administration" (the city's and the metropolis's government-group house; `institutionalCatalog.js` shared, and PAIRS[258] for both tiers) says it is "less formally constituted than a council" / "a looser arrangement than a council": every census town that prints one of its three texts is governed by a council, a senate or an assembly (`powerStructure.government`: B14388 and 02783 26 of 26, B03373 18 of 18, 20218 15 of 15). The house's text is drawn before the powers exist (H18), so no sibling can key on the government: the three texts are reworded to claim the house's own trade (its officials carry out the city's business, whoever sits above it), true under any government. "Lord's appointee" (PAIRS[181], the town pool): "A man of the lord's choosing governs" where the appointee (rank 1 of the Feudal Appointee) is a woman, 5 of 6 (02794; X9 15791): now "One of the lord's choosing"; the government is true in 6 of 6. Text only: the same pools, hash and index; the colour declarations and the declaration ledger re-keyed by identity. No draw moved; no power atom read. DECLARED MOVE: `institutions[].desc` only.

THE TRUE LINES IT REPLACES: 1 (the one man-led appointee town, r2s-under_siege-town-2).

| old | new |
|---|---|
| An administrative apparatus of officials, clerks, and ward officers manages city affairs. Less formally constituted than a council but functional. Governance by bureaucratic inertia. | An administrative apparatus of officials, clerks, and ward officers carries out the city's business, whoever sits above it. Functional, and moved by bureaucratic inertia. |
| Officials, clerks, and ward officers run the city's affairs between them. A looser arrangement than a council, but one that works. It governs by the momentum of its own paperwork. | Officials, clerks, and ward officers do the city's daily business between them, whoever gives the orders. It runs by the momentum of its own paperwork. |
| The city is administered by a standing body of officials, clerks, and ward officers, less formally constituted than a council yet functional all the same. What moves it is bureaucratic inertia. | A standing body of officials, clerks, and ward officers carries out the city's administration, functional whatever rules above it. What moves it is bureaucratic inertia. |
| A man of the lord's choosing governs, and noble authority overrides whatever the town was accustomed to. | One of the lord's choosing governs, and noble authority overrides whatever the town was accustomed to. |

Guard: `tests/data/tailHouses7GovernanceWords.test.js`: 11 RED pairs (9 City administration towns, each with its council government asserted; 2 woman-led appointee towns; 11 of 11 red at the base), 2 KEEP pairs (the man-led appointee town keeps "noble authority overrides ..."; a town on the appointee's twin keeps "Rule falls to the lord's appointee"; green at the base and after).

### The veto list, batch 7 (towns printing; the smallest and the largest it reaches, and a crisis town)
- "Officials, clerks, and ward officers do the city's daily business between them, whoever gives the orders. It runs by the momentum of its own paperwork." (26): r2r-city-31 (3,183), r2s-mass_migration-metropolis-3 (248,369), r2s-under_siege-city-3 (under siege)
- "An administrative apparatus of officials, clerks, and ward officers carries out the city's business, whoever sits above it. Functional, and moved by bureaucratic inertia." (18): r2r-city-44 (2,408; famine), r2s-mass_migration-metropolis-2 (139,708)
- "A standing body of officials, clerks, and ward officers carries out the city's administration, functional whatever rules above it. What moves it is bureaucratic inertia." (15): r2s-occupied-city-0 (5,170; occupied), r2r-metropolis-14 (271,164; under siege)
- "One of the lord's choosing governs, and noble authority overrides whatever the town was accustomed to." (6): r2s-succession_void-town-0 (1,089), r2s-under_siege-town-2 (2,453; under siege), r2r-town-37 (plague)

MEASURE (before = batch 6's after, ba3af4202's tree; after = this tree): THE INVENTORY DIFF (tabs): 29,856 -> 29,854; gone 8 (the old texts' sentences: 26, 26, 26, 18, 18, 18, 15, 6), new 6 (their rewordings, the same towns), IN FEWER TOWNS 3: "Patron deity", "Assign a patron god ...", "Upgrade to premium ..." 719 -> 717 in r2r-thorp-0 and r2r-thorp-1 (the first two towns rendered; no City administration or appointee there: the premium prompt's render flake that batches 3 and 4 also saw). The exports: gone 12, new 10, in fewer 0. Rows: B14388 26 -> 0, 02783 26 -> 0, B03373 18 -> 0, 20218 15 -> 0, 02794 6 -> 0 (X9 15791, the same text, with it). THE INHERITORS: the six rewording sentences only, read in place.

Gates (this tree): eslint 0 on the touched files; typecheck:domain:strict 0; typecheck:ratchet OK (167, ceiling 167); presumed-things `--check` fresh 144, stale 0 (the same rows as the base); page-census `--grid` 0 rises (the same 2 falls); the 87 test files naming the touched files: only the carried reds (gapLineHousesByKind, urbanBandInstitutions G5, wiringCensusDeclared, generatorGoldenMaster).

## TAIL-HOUSES-4 · H16: the two unverified tables measured, widest first (no cure unless named)

THE MEASURE. Base: this branch at b3ac30f8a (the census `census3.sh <base> before 4`: 720 births, 0 errors; the tabs' inventory 29,856 sentences, the exports' 35,765). Each row's `fold` read in the inventory (the towns that print it), each printing town's record read off `corpus.ndjson.gz`: its crisis (`stress[].type` in under_siege, famine, plague_onset, occupied) and, OUTSIDE the crisis, the fact the reader's reason names. "ord" = the printing towns in no crisis; "false" = ordinary towns where the record denies the claim. Every row printing in five towns or more of the two tables is here.

### GONE AT THE BASE (the fold no longer prints; cured by batches 3-5): struck
16857, 14069, 20982, 10137, B22510, 02534, B03000, B00345, B11885, B27842, 20983, B02989, 04579, 28857, B27830, B28049, B20091, 03077, 21986, B22024 (20 rows).

### STRUCK FOR THE LEAF (a crisis reason; TRUE in ordinary times: printing / ord / false in ord)
| id | towns | ord | false | the ordinary-times fact read |
|---|---|---|---|---|
| B12717 | 177 | 148 | 0 | the furs chain card's entrepôt note: the trade's geography, said of the trade, not of the town; prints only on an active furs chain |
| B17254, B02399, B00206 | 87, 71, 66 | 71, 64, 57 | 0 | apothecaries' "imported medicines": every printing town imports (the 6 isolated ones too: `primaryImports` non-empty) |
| 05285 / 05276 | 83 / 23 | 77 / 17 | 0 | a brewery's regional trade (05276's "ships" is the verb) |
| 15651, 18556, 15650 | 82, 43, 37 | 71, 33, 33 | 0 | markets in more than one square: city and metropolis only |
| B17798 / B21481 / B09671 | 65 / 62 / 54 | 53 / 56 / 48 | 3 / 0 / 2 | the watch, the garrison and the caravans: every ordinary town holds a garrison; the caravans fail only where the town is isolated (3 and 2 towns: fewer than five, WAITS) |
| 09333, 28847, 11393 | 59, 43, 36 | 53, 37, 28 | 1 each | foreign traders / international merchants: false only in one isolated town each (WAITS; the roster seats a fair or a trade centre with no route: H3, NAMED) |
| B15261, B12169, B11640 | 52, 49, 31 | 41, 38, 24 | 0 | the coaching inn's relay horses: the roster forbids it where isolated; a coaching inn stands in every printing town |
| 17955 | 50 | 43 | 0 | grain stores: city only |
| 06002, B05738 | 49, 32 | 40, 27 | 0 | the fish market already in the one hedge form ("whenever fish can be had") |
| 21670 | 46 | 39 | 0 | the region's chief religious authority: metropolis only |
| B02335 | 42 | 39 | 0 | a market square for market days and fairs (a town's square) |
| B04464, B04463 | 42, 34 | 39, 29 | 0 | burial beyond every gate: walls with gates in every printing town |
| B06577, B06932 | 41, 41 | 33, 27 | 0 | subsistence farming: thorps only |
| B20720, 03172, 21103, 17675 | 40, 33, 33, 32 | 32, 28, 27, 21 | 0 | the village house of worship a walk away / a passing priest: every printing hamlet and thorp holds "Access to parish church" |
| 04663, 04683 | 41, 12 | 33, 9 | 0 | the caravan chain cards: no printing town is isolated |
| 12702, B11969, 06937 | 36, 28, 18 | 28, 23, 17 | 1 / 0 / 0 | customs by road, harbour or port: the harbour and port texts need `institution: docks` (06937's seven river towns hold docks); 12702 false in one isolated town (WAITS) |
| 16534 | 33 | 29 | 0 | reports from several roads: no printing town isolated |
| 04797, 04796 | 20, 17 | 14, 14 | 0 | the ferry's bank and landing |
| B22199 | 20 | 18 | 1 | the harbour master: one river town (WAITS) |
| 07216 | 18 | 13 | 0 | the caravans' own guards (not the garrison) |
| 04423, B02583 | 17, 13 | 14, 9 | 0 / 1 | the caravan exchange (no printing town isolated) and the carters' guild (one isolated town: WAITS) |
| 16646, 04601 | 8, 8 | 6, 6 | 0 | river barges: river towns only |
| 13412, B02702, 22419, B03247 | 8, 8, 6, 7 | 7, 6, 5, 5 | 0 | the road's trade and travellers (an isolated village still has its track: "whoever the road brings") |
| B09887, B03102, B15590, 02485, B27818, B13214 | 7, 7, 7, 5, 5, 5 | 6, 5, 6, 3, 3, 3 | read, no predicate | the house's own trade, read in its ordinary towns: a shipyard (port towns only), a weekly sale, "requires grain surplus", a stable, "where caravans come" (already hedged), a trading day |

### STRUCK (an ordinary-times reason the record does not bear)
| id | towns | the fact read |
|---|---|---|
| B05150 (H19) | 16 | "Alderman": the named person holds rank 1 in the governing power (16 of 16), and that power is a Guild Council, whose office is Alderman (`officeTitles.js`): the record bears the title |
| B05317 (H19) | 13 | "Lord Marshal": rank 1 in the governing power, a Military City Council or Grand Military Council (Lord Marshal): 13 of 13 |
| B06447 | 69 | "Draws on: herb gathering areas" under the Resources tab's medicinal-herbs exploitation, which the terrain (forest) gives: the line names the kind of source, not a LAND resource |
| 06832 | 39 | "Draws on: mountain forest, logging routes": every printing town is mountain terrain with `mountain_timber` or `managed_forest` |
| B12963 | 22 | the hot-springs chain is printed under its exploitation state ("Unexploited", with its Needs): every printing town holds a hot-springs resource |
| 14325 | 11 | "not brought in: stone, metals": no ordinary printing town imports a metal or stone |
| 16366 | 40 | "Refined ingots" with no smelter, mint or foundry: 2 of 37 (WAITS) |
| B15417, B04587 | 126 | already struck by TAIL-HOUSES-2 (the card says "Normally yields" where the chain is refused: `domain/chainYield.js`) |

### FALSE IN ORDINARY TIMES, LEFT WITH THE MEASURE (this seat's class; not cured here)
| id | towns | false | the fact | the cure it needs |
|---|---|---|---|---|
| B11971 / B06555 | 71 / 36 | 6 / 1 | customs "by the main roads" in an isolated town (`route: isolated`) | these ARE the no-docks twins of the port texts: a twin of a twin is not read by `drawInstitutionDesc` (it takes the first `twinOf` only). A third text keyed `route: isolated`, or the twin reworded "by road" (replaces about 90 true lines: tell the chair first). The roster seating a customs house where the town has no route is NAMED (H3). |
| 17954 | 67 | 6 | "Several inn districts" in a city of 2,781 to 4,774 (the house is "Inns and taverns (district)") | a size twin (`population` band), or the size class's seat |
| 17650 | 6 | 6 of 6 | a Hunter's lodge "sends out hunting parties" where the town has no hunting-grounds resource | batch 1's input-gap shape: the hedge "whenever game can be had" |

## TAIL-HOUSES-4 · H18: the governance rows measured (printing towns at the base; the government is `powerStructure.government`, the powers `powerStructure.factions[]`)

### TRUE in every printing town (the house is its own government's, and the text says that government): STRUCK
03031 (14: Headman's Authority 14 of 14), 14953 (11: the same), 03033 (8: the same), 02668 (14: Merchant oligarchy 8, Grand Merchant Oligarchy 6), 28580 (9: the oligarchies), 20701 (13: Merchant Guild Council 7, Grand Guild Consortium 6), 02494 (11: the same two), B05076 (13: Household Council 13), 02643 (12: Noble Governorship 8, Ducal Governorship 4), B02540 (9: Free Elder Council 9).

### CURED BY REWORDING (H18 (i)): batch 7, above
B14388 (26), 02783 (26), B03373 (18), 20218 (15): City administration "less formal than a council": every printing town is governed by a council, senate or assembly (26, 26, 18, 15 of the same). 02794 (6) and X9 15791 (6): "A man of the lord's choosing" where the appointee is a woman (5 of 6; the government, a Feudal Appointee, is true in 6 of 6).

### PARKED FOR THE LATE RE-READ (H18 (ii)): no rewording keeps a good line true in every printing town; the measure
| id | towns | false | the claim, and the record |
|---|---|---|---|
| 15890 / 15765 / 02600 | 38 / 33 / 32 (the house in 42, 33, 32) | 10 / 7 / 6 | the merchant guilds "a powerful political force" where no merchant, guild or trade power stands among the factions (`rival power`). A rewording exists that claims the house's trade, not its politics ("A power in the city's trade."), but it replaces the true line in about 80 towns: told to the chair first, not done |
| 00186 / 14950 / 03029 | 13 / 13 / 13 | 11 / 11 / 10 | the Household elder: one head of household speaks for the settlement unchosen, where the government is an Elder Council or a Household Council (true only under a Headman's Authority) |
| 28852 / 29000 / 03522 | 11 / 8 / 5 | 11 / 8 / 5 | the Town council "where nothing official exists" / "no formal government" / "in the absence of formal authority": every printing town has a named council |
| 21211 | 6 | 6 | the Village elder "in the absence of formal authority": an Elder, Household or Headman government in each |
| 03508 / 02461 | 10 / 5 | 10 / 3 | Mayor and council "an elected council" where the government is a theocratic, merchant, military or other council not chosen by vote |
| X9 16720, 16785, 29353, 14179, 29354, 29352 | 21, 14, 11, 9, 8, 5 | not measured here | as TAIL-HOUSES-3 listed them (the X9 governance rows); owed |

## WHAT IS LEFT (TAIL-HOUSES-4, at its hand-back after batch 7; supersedes TAIL-HOUSES-3's list above)

0. **FIRST (the chair, 03:57 UTC, from the bar's own read of ten fresh towns at 5d1e3096b, met by both readers)**: 29000 "With no formal government in place, a loose council of leading citizens runs the town." (the Town council, PAIRS; 8 towns, false in 8 of 8: a Church Council governs the one the readers met): by H18 (i), a rewording that claims no absence of government and is true in every printing town (the house's own business, e.g. its leading citizens meeting over the town's common affairs, not who rules). Its siblings 28852 and 03522 (the same house, the same claim; 11 and 5 of the same) go with it. NOT DONE: this seat handed back by time. THE CHAIR'S NOTE ON THE HEDGE: where a hedge is written, let it govern the verb ("at work whenever good stone can be had" beside a depleted quarry still reads as a claim); batch 6's hedges govern theirs ("landed and cured whenever fish can be had").

1. **H16 is DONE for every row of the two tables printing in five towns or more** (above: struck for the leaf, struck, gone at the base, or left with the measure). LEFT WITH THE MEASURE, this seat's class: the customs house "by the main roads" in an isolated town (B11971 6, B06555 1: a twin of a twin is not read; a third text keyed `route: isolated`, or the twin reworded "by road" after telling the chair: about 90 true lines); 17954 "Several inn districts" in a city under 5,000 (6 of 58: a `population` twin); 17650 the Hunter's lodge with no hunting grounds (6 of 6: batch 1's hedge, "whenever game can be had").
2. **H18 PARKED FOR THE LATE RE-READ, with the measure** (above): the merchant guilds' politics (15890 10, 15765 7, 02600 6: a trade rewording exists, about 80 true lines replaced: the chair first); the Household elder (00186 11, 14950 11, 03029 10); the Town council's "nothing official" (28852 11, 29000 8, 03522 5); the Village elder (21211 6); Mayor and council "elected" (03508 10, 02461 3). The X9 governance rows (16720, 16785, 29353, 14179, 29354, 29352) are NOT measured: owed. When the chair names the late re-read's tip on the joined line: each parked row takes a declaration (`ruling body` / `rival power`) and a twin read at the re-read, not at the draw.
3. **PARKED (H4)**: 15712 (60), 09319 (7), 21584, 08266.
4. **WAITS (H13)**: H9 "(powerful)" (15 towns, H11's two cures); 12014 the brewery (banked text) for the close; every row printing in fewer than five towns, and the rows false in fewer than five ordinary towns listed above (B17798 3, B09671 2, 09333/28847/11393 1 each, 12702 1, B22199 1, B02583 1, 16366 2).
5. **The X9 rows H5 answered by the leaf or sent to the services seat**: as H5 lists them (no cure here).

## TAIL-HOUSES-4 · instruments and tips

- Tips: batch 6 ba3af4202; batch 7 and this hand-back are the tip. Handed back by time (about seventy minutes of this seat), after batch 7.
- `<scratchpad>/wtbase` (detached at the base, node_modules symlinked) for the BEFORE census; `<scratchpad>/wt` (own `npm ci`) for batch 6; `<scratchpad>/wt7` (node_modules symlinked to wt's) for batch 7, so no tree renders mid-edit. Census `census3.sh <tree> <out> 4`: births + render about 25 minutes with gates running beside it; the count/trace stage is not needed for the inventory (stopped once the dumps are in). `inventory.py` twice (the tabs; `SURFACES=PDF,Journal`); `inventory_diff.py before after rows.json`.
- The measure scripts (`tools/lib.py` and inline Python): corpus by seed; a row's printing towns from the inventory's fold; a desc row's houses by its first 60 characters over `institutions[].desc`; the crisis by `stress[].type`; the government by `powerStructure.government`, the powers by `powerStructure.factions[].faction`, a person's office by `npcs[].memberships[]` (rank 1 of the governing power) and `src/data/officeTitles.js`. Re-made in minutes.
- THE RECORD'S FACTS FOR THESE SHAPES: a spent fishery is `config.nearbyResourcesDepleted` against `config.nearbyResources` (`fish`, `river_fish`, `fishing_grounds`); the hot springs' keys are `hot_springs` and `hot_springs_mineral`; `route: isolated` is the route atom (`revenueHomes.js` uses it); a twin is found as the FIRST `twinOf` of a sibling set (`institutionDescDraw.js`), so a twin cannot have its own twin; an `institutionalCatalog.js` desc is single-quoted (escape an apostrophe).

## TAIL-HOUSES-5 · the chair's ruling (2026-11-15 04:42 UTC; vetoable by the owner)

- **(H20)** (1) THE GOVERNANCE ROWS (about twenty-five, 5 to 38 towns: a house's description that claims who governs or what standing a power has, DRAWN BEFORE THE POWERS EXIST): each takes ONE of two cures, by its measure: (i) a rewording true in every printing town that claims the house's own trade and standing; (ii) A DECLARED NEED RESOLVED AT THE LATE RE-READ, with a twin: the description is drawn as today (no draw moves) and the late pass swaps in the twin where the settled record does not bear the claim. FIRST MAKE THE LATE PASS REACH A HOUSE'S DESCRIPTION if it does not yet (say what it took; the pass must stay BYTE-IDENTICAL on the 720 until a description declares: show it); one row built end to end and measured before the rest. A row whose twin would be false somewhere too is reworded or silenced instead. (2) THE HEDGED LINES MAY TAKE THEIR PLAIN LINE BACK where the record bears it (the fisher's landing, 64 true towns hedged; the fish market, 72; the ferry, 109): ONLY if (1) is done and the count allows: a declared need on the input, the plain line kept where the record bears it, the hedge as the twin. Else name it. (3) TWO ROWS FROM TONIGHT'S READ OF THE NEWEST LINES (`institutionDescColour.js`): "Timber and the hauling of it keep the place alive." and "The settlement's living is timber and the carting of it." (9 towns each) where the harvest is nine tenths of the income: the line needs timber among the income sources or the exports (measure), by the same late pass if the income is not settled at the draw. THEN the three rows the predecessor left; THEN HAND BACK.
- **(U2)**, 04:49 UTC: the line must pass first: four red files in the houses' area, each run alone at the merged tree: a regression of an earlier cure in this group's files is cured; a pin a declared move explains is re-keyed by identity; a cause outside these files is named with its commit. Never skip, weaken or delete a test. Then H20 as written. **(05:06)** every new test: negatives anchored (`tests/helpers/anchoredNegatives.js`), seed loops through the totality helper, no literal state-prose anchor; `scripts/mutation-coverage-manifest.json` not edited. **(H21, 05:07)** NO VETO on batch 10.
- **(U1)** stands: commit and push every batch the moment it holds, WHAT IS LEFT current in the same push; hand back at 250,000 (or about seventy minutes); one line to the chair at the hand-back, a stop, or a question.

THE MERGE (the only one): the joined line at **3e482b329** (the late re-read cd0b1ab7b; both atoms), merge commit **01714675f** on this branch. The BEFORE census at that merged tree: 720 births, 0 errors; the tabs' inventory 29,945 sentences, the exports' 36,850.

## TAIL-HOUSES-5 · Batch 8 (H20 (ii)): THE LATE RE-READ REACHES A HOUSE'S DESCRIPTION; the Household elder and the Merchant oligarchy read the settled powers

WHAT IT TOOK (`src/generators/steps/assembleSettlement.js`, LENT; the crisis seat's hunks untouched): ONE call after the stress late re-read (which stands after `resolveFactionLabelsAtClose`, the last roster write), skipped where the DM holds the institutions, and ONE function at the file's end, `readHouseDescsLate`: for each institution whose stored `desc` is a key of `institutionDescVariants.js :: DESC_LATE_SIBLINGS` (keyed by the WHOLE description, matched in the tier noun the draw spoke it in: `speakTierNoun(key, tierNounFor(tier))`), `resolveSibling` against `factsOf(settlement)` (the settled record) stores the twin where the original is refused. The draw never reads the table (the description is drawn and resolved at the draw exactly as before). The crisis seat's two hazards: (1) the late pass resolves the ORIGINAL KEY, never a text a first resolve left (a late key is a text the draw stores unresolved by any late need); (2) every new late declaration is a declared move, measured by the births-only field diff below. THE WINDOW: between the draw (assembleInstitutions) and the late pass no writer reads a house's `desc` for a fact the late table keys (the receipt and the render read after).

BYTE-IDENTITY: with the table empty, births on the 720 against the merged base: **720 of 720 records identical**.

THE ROWS (each measured on the record at the merged base):
| row | texts | towns | refused by | twin prints |
|---|---|---|---|---|
| the Household elder (03029, 00186, 14950; the catalogue line with them) | 3 | 37 (13, 13, 11) | needs `ruler: elder`, excludes `ruling body` (one elder ruler: a headman) | 37 of 37 (every census Household elder sits under an Elder or a Household Council) |
| the Merchant oligarchy (X9 16785; its two siblings) | 3 | 37 (14, 14, 9) | excludes `rival power` (another power at Significant or above) | 23 of 37; 14 keep the original |

| old (original, kept where the settled record admits it) | twin (stored where it refuses) |
|---|---|
| One household head acts as de facto voice for the settlement. No formal appointment, no title. Just the person everyone goes to when something needs deciding. | One household head is the person everyone goes to first when something needs deciding. No formal appointment, no title. |
| A single household head speaks for the settlement without ever being chosen to. No office, no title, no vote. Simply the door people knock on when a thing has to be settled. | A single household head, never chosen to anything, is the door people knock on first when a thing has to be settled. No office, no title, no vote. |
| One head of household carries the settlement's voice by common habit, with no appointment behind it. Nobody named them to it; everybody defers to it anyway. | One head of household is heard first on the settlement's common matters, by habit rather than appointment. Nobody named them to it. |
| Wealthy merchant families hold exclusive civic power; political office is effectively purchased. | Wealthy merchant families hold the civic offices; political office is effectively purchased. |
| Civic power belongs solely to the wealthy merchant families, and office is bought in all but name. | Civic power rests with the wealthy merchant families, and office is bought in all but name. |
| A handful of rich merchant houses monopolise power here; a political post is, in practice, something one purchases. | A handful of rich merchant houses hold the seat of power here; a political post is, in practice, something one purchases. |

DECLARED MOVE, births on the 720: **60 records, `institutions[].desc` only** (37 + 23). The colour marks of the late-declared variant keys and their ledger rows are taken off (a late-declared text is not a colour line). Guard: `tests/generators/houseDescLateReRead.test.js` (12 red pairs: red 12 of 12 under the plant that drops the late call, which is the base's behaviour; 3 KEEP pairs; the headman unit; the table; the pass's place in the source).

MEASURE (before = the merged base 01714675f; after = this batch's tree 5d906f6e4): THE INVENTORY DIFF (tabs): 29,945 -> 29,946; gone 6 (the Household elder's six sentences: 13, 13, 13, 13, 11, 11), new 7 (the twins, the same towns), IN FEWER TOWNS 3 (the oligarchy's three originals: 14 -> 5, 14 -> 6, 9 -> 3: by exactly the 23 refused), in more towns 3 ("Patron deity", "Assign a patron god ...", "Upgrade to premium ..." 716 -> 717: the premium prompt's render flake that batches 3, 4 and 7 also saw; no house of this batch there). The exports: 36,850 -> 36,854; gone 9, new 13, in fewer 6 (the same three, each with its "Merchant oligarchy: " journal line), in more 0. Rows: 03029 13 -> 0, 00186 13 -> 0, 14950 13 -> 0; X9 16785 14 -> 6 (the 8 refused). THE INHERITORS: the seven twin sentences only (tabs), read in place (r2r-thorp-12, r2r-thorp-10, r2r-thorp-28, r2r-city-43, r2r-city-39, r2r-city-30).

Gates (this tree): eslint 0 on the touched files; typecheck:domain:strict 0; typecheck:ratchet OK (167, ceiling 167); presumed-things `--check` the same output as the merged base (fresh 145, stale 3: the base's).

## TAIL-HOUSES-5 · Batch 9 (H20 (i)): a governing house claims no absence of government and no election the record denies

Every census town that prints one of these nine texts has a named government that denies the claim: the Town council (29000, 28852, 03522; X9 29354, 29353, 29352): 24 of 24 governed by a named council; the Village elder (21211 and its two siblings): 24 of 24 under an Elder, a Household or a Priestly government; the city's and the metropolis's Mayor and council (03508, 02461, the catalogue line): 29 towns under theocratic, merchant, military, arcane and other councils ("elected" true in a handful at most). Text only (the same pools, hash and index); no power atom read. The walker's three banked "house: reeve" rows for the old village texts removed (stale: the rewordings name no reeve; `--check` the same as the base, banked 4,547 -> 4,544). DECLARED MOVE (births against batch 8): 66 records, `institutions[].desc` only. Guard: `tests/data/tailHouses9GovernanceAbsence.test.js` (15 red pairs, 15 of 15 red at the base; 3 keep).

| old | new |
|---|---|
| An informal council of prominent citizens manages town affairs in the absence of formal authority. Less accountable than an elected council, more stable than nothing. | A council of prominent citizens sees to the town's common affairs. Less accountable than an elected council, but steady. |
| With no formal government in place, a loose council of leading citizens runs the town. It answers to no one in particular, but it beats having no one at all. | A loose council of leading citizens sees to the town's common business. It answers to no one in particular, but the work gets done. |
| Where nothing official exists, the town's notable men gather and govern by consensus. Less answerable than an elected body, and steadier than the void it fills. | The town's notables gather and settle its common business by consensus. Less answerable than an elected body, but steady. |
| The oldest or most respected resident guides village decisions in the absence of formal authority. Less official than a reeve, more stable than nothing. | The oldest or most respected resident guides village decisions, by standing rather than by office. |
| In the want of any formal power, the oldest or most respected villager steers the decisions. Less official than a reeve, but better than no one at all. | The oldest or most respected villager steers the decisions, by standing rather than office, and is heeded all the same. |
| Where no formal authority exists, the eldest or best-regarded resident guides what the village decides. Short of a reeve in standing, yet steadier than a vacancy. | The eldest or best-regarded resident guides what the village decides: an authority of regard, not of office. |
| Elected civic council with full administrative apparatus. | Civic council with full administrative apparatus. |
| An elected council backed by a complete administrative staff. | A civic council backed by a complete administrative staff. |
| A civic council put in by vote, with the full apparatus of office beneath it. | A civic council with the full apparatus of office beneath it. |

## TAIL-HOUSES-5 · Batch 10 (H20 (i) and (3)): the merchant guilds and the woodcutter's camp claim their own trade

- The city's Merchant guilds (15-40) (15890, 15765, 02600): a politics claim where no merchant, guild or trade power stands among the powers: 16 of 42, 7 of 32, 8 of 33. NO ATOM reads a merchant power (`rival power` is any power's; `guild` holds wherever this house stands), so no late twin can key: the three lines claim the guilds' trade. **THE TRUE LINES IT REPLACES: 76 towns: told to the chair before the push; the chair, H21 (05:07 UTC): NO VETO, on the owner's veto list with the count.**
- The Woodcutter's camp (H20 (3)): timber is in none of the income sources in 15 of 18 printing towns (the harvest is most of the income). NO ATOM reads an income source or an export by good (the vocabulary's `exports` is presence only), so the late pass cannot key it: the lines claim the camp's and the crews' own living (3 true lines replaced). Batch 4's guard re-keyed by identity.
- DECLARED MOVE (births against batch 9): 125 records, `institutions[].desc` only. Guard: `tests/data/tailHouses10OwnTrade.test.js` (15 red pairs, 15 of 15 red at the base; 2 keep).

| old | new |
|---|---|
| Powerful political force. | A power in the city's trade. |
| A force to be reckoned with in politics. | A force to be reckoned with in the city's trade. |
| Politically, a power in their own right. | In trade, a power in their own right. |
| A forest-edge camp of fellers and a yard where the logs are stacked. Timber and the hauling of it keep the place alive. | A forest-edge camp of fellers and a yard where the logs are stacked. Timber and the hauling of it are the camp's whole living. |
| Axe crews work the treeline and stack their cut in a yard nearby. The settlement's living is timber and the carting of it. | Axe crews work the treeline and stack their cut in a yard nearby. The crews live by timber and the carting of it. |

## TAIL-HOUSES-5 · Batch 11 (the three rows left)

- 17650, the Hunter's lodge "sends out hunting parties" with no hunting grounds (6 of 6): THE ONE HEDGE FORM, the hedge governing the verb: "Whenever game can be had, it sends out hunting parties over the surrounding country and brings back venison, pelts, and game to sell. It doubles as the local authority on the wilds, the safe trails and the treacherous ones."
- B11971 / B06555, the Customs house's no-docks twins "by the main roads" in an isolated town (6 of 71, 1 of 36): a twin's own twin is not read at the draw, so the third text is declared in `DESC_LATE_SIBLINGS` (`route: isolated`) and resolved at the late re-read: "Levies duties on goods entering and leaving by road. Run by royal or municipal officials." / "Duties are taken here on goods passing along the road. Royal or municipal officers run it." No true line replaced (the road towns keep the main roads; the ~90-line rewording avoided).
- 17954, "Several inn districts" in a city under 5,000 (6 of 67): NOT CURED: the population band reads every city `large` (`populationBand.js`: by `popToTier`, a city of 2,781 is a city): NAMED for the size class's seat.
- DECLARED MOVE (births against batch 10): 13 records, `institutions[].desc` only. Guard: `tests/data/tailHouses11RowsLeft.test.js` (7 red pairs, 7 of 7 red at the base; 2 keep).

MEASURE, BATCHES 9-11 TOGETHER (ONE census for the three: their sentences are disjoint, so the diff reads each by its own lines; a departure from one census a batch, made for time and named): before = batch 8's after (5d906f6e4's tree); after = b1a889fb2's tree (the same code as this tip's). THE INVENTORY DIFF (tabs): 29,946 -> 29,944; gone 22 (the old texts' sentences), new 20 (their rewordings, the same towns), IN FEWER TOWNS 2: the customs house's "by the main roads" 71 -> 65 and "along the main roads" 36 -> 35 (the 6 and the 1 isolated towns, by exactly the measure), in more towns 0. The exports: 36,854 -> 36,853; gone 36, new 35, in fewer 4 (the same two and their "Customs house: " journal lines), in more 0. Rows: 29000 8 -> 0, 28852 11 -> 0, 03522 5 -> 0, 21211 6 -> 0, 03508 10 -> 0, 02461 5 -> 0, 15890 38 -> 0, 15765 33 -> 0, 02600 32 -> 0, 17650 6 -> 0, B11971 71 -> 65, B06555 36 -> 35 (both "still in the town read": the reader's towns were sieges, the crisis leaf's class); X9 29353, 29354, 29352 gone on the exports. THE INHERITORS: the rewordings and the two late customs twins only (the widest: "A power in the city's trade." 42, read in r2r-city-0), read in place.

GATES (this tip): eslint 0 on every touched file; typecheck:domain:strict 0; typecheck:ratchet OK (167, ceiling 167); presumed-things `--check` the same as the merged base (fresh 145, stale 3; banked 4,547 -> 4,544 by batch 9's three stale rows); page-census `--grid` 0 rises (the same 2 falls, r2r-city-0 and r2s-insurgency-metropolis-0 P7a). THE 121 TEST FILES NAMING THE TOUCHED FILES, at the tip: 16 red; THREE WERE BATCH 8'S AND ARE REPAIRED in ee83c8cb5 (`heldKeyWriterCensus` A3: the late pass's two imports classed; `wiringCensusDeclared`: DESC_LATE_SIBLINGS is a declaration channel, the file now red only by the base's row; `dossierContent`: the late twins are pool lines); two were 20-second timeouts under the census's load and pass alone at the tip (`stressSummaryName`, `moneyChangersTownFloor`); the rest are RED AT THE MERGED BASE, run there: `generatorGoldenMaster`, `espionageDormancyFence` (the driven golden), `worldFactRederive` A7, `nameHeldThroughAssembly` A1, `generationForkCensus` (4), `simulationSpine` (1), `urbanBandInstitutions` (2), `crisisStoppedRows` (2), `labelJoins` (claimStanding.js), `gapLineHousesByKind` (U2, below), and `writerReach` (52 skipped). The golden family is THE OWNER'S DOOR: this seat's desc moves (batches 8-11, 264 records' `institutions[].desc` on the 720) add to what it will show; not re-taken.

### Struck or left by TAIL-HOUSES-5 (verified by the record; one line why)
- X9 16720 "Merchant guilds: Each holds a grip on the trade in its particular wares." (21): STRUCK: it claims the house's own trade (what H18 (i) asks a house to claim); a Suppressed or absent merchant POWER does not deny a guild's hold on its wares.
- X9 14179 "A free hamlet with no lord's representative." (9): false in ONE town (r2s-occupied-hamlet-2, an Occupation Authority at Strong): WAITS (fewer than five).
- The governance rows TAIL-HOUSES-4 struck stand (03031, 14953, 03033, 02668, 28580, 20701, 02494, B05076, 02643, B02540).

### H20 (2), THE HEDGED LINES: NAMED, NOT DONE
No atom of the vocabulary reads a live input: `fish` holds wherever fish is a food source, spent or not; the leaf that answers "a chain works resource K here" (`src/domain/facts/chainWorking.js`) is not a vocabulary word; nothing reads a ferry's crossing. A declared need on the input needs a word the vocabulary lacks (the chair's): e.g. `worked: <resource>` read off `chainWorking.js`. The fisher's landing (64 true towns hedged), the fish market (72) and the ferry (109) keep their hedges.

### The veto list, batches 8-11 (towns printing; the smallest and the largest it reaches, and a crisis town)
- "One household head is the person everyone goes to first when something needs deciding." (11): r2s-politically_fractured-thorp-0 (9), r2s-occupied-thorp-2 (28), r2s-wartime-thorp-2 (famine)
- "A single household head, never chosen to anything, is the door people knock on first" (13): r2s-wartime-thorp-3 (6), r2s-succession_void-thorp-2 (30), r2s-under_siege-thorp-0 (under siege)
- "One head of household is heard first on the settlement's common matters" (13): r2s-insurgency-thorp-2 (9), r2r-thorp-46 (26), r2s-plague_onset-thorp-2 (plague onset)
- "Wealthy merchant families hold the civic offices" (6): r2s-politically_fractured-town-0 (843), r2r-metropolis-19 (76,626)
- "Civic power rests with the wealthy merchant families" (8): r2s-insurgency-town-1 (648), r2s-religious_conversion-metropolis-1 (42,064), r2s-occupied-town-1 (occupied)
- "A handful of rich merchant houses hold the seat of power here" (9): r2r-town-22 (540), r2s-slave_revolt-metropolis-3 (88,966), r2s-famine-town-1 (famine)
- "A council of prominent citizens sees to the town's common affairs. Less accountable than an elected council, but steady." (5): r2s-famine-town-3 (737), r2s-slave_revolt-town-2 (2,239), r2s-famine-town-3 (famine)
- "A loose council of leading citizens sees to the town's common business. It answers to no one in particular, but the work gets done." (8): r2s-mass_migration-town-0 (649), r2r-town-58 (2,468)
- "The town's notables gather and settle its common business by consensus. Less answerable than an elected body, but steady." (11): r2r-town-41 (745), r2r-town-28 (2,273), r2s-plague_onset-town-1 (plague onset)
- "The oldest or most respected resident guides village decisions, by standing rather than by office." (6): r2r-village-18 (225), r2s-recently_betrayed-village-2 (394)
- "The oldest or most respected villager steers the decisions, by standing rather than office, and is heeded all the same." (7): r2r-village-29 (137), r2s-insurgency-village-3 (264)
- "The eldest or best-regarded resident guides what the village decides: an authority of regard, not of office." (6): r2s-indebted-village-1 (228), r2r-village-47 (375)
- "Civic council with full administrative apparatus." (8): r2r-city-45 (3,440), r2r-metropolis-39 (87,995)
- "A civic council backed by a complete administrative staff." (10): r2s-recently_betrayed-city-3 (2,781), r2s-infiltrated-metropolis-3 (33,900)
- "A civic council with the full apparatus of office beneath it." (5): r2s-under_siege-city-1 (2,679), r2s-succession_void-metropolis-3 (295,750), r2s-under_siege-city-1 (under siege)
- "A power in the city's trade." (42): r2s-recently_betrayed-city-0 (2,407), r2s-plague_onset-city-1 (14,812), r2s-under_siege-city-3 (under siege)
- "A force to be reckoned with in the city's trade." (32): r2s-wartime-city-1 (2,054), r2r-city-36 (14,784), r2s-under_siege-city-1 (under siege)
- "In trade, a power in their own right." (33): r2r-city-44 (2,408), r2s-insurgency-city-1 (14,488), r2r-city-44 (famine)
- "A forest-edge camp of fellers and a yard where the logs are stacked. Timber and the hauling of it are the camp's whole living." (9): r2r-hamlet-12 (27), r2s-succession_void-village-3 (301), r2s-occupied-village-1 (occupied)
- "Axe crews work the treeline and stack their cut in a yard nearby. The crews live by timber and the carting of it." (9): r2r-hamlet-46 (33), r2r-village-47 (375)
- "Whenever game can be had, it sends out hunting parties over the surrounding country and brings back venison, pelts, and game to sell. It doubles as the local authority on the wilds, the safe trails and the treacherous ones." (6): r2r-village-2 (388), r2r-town-51 (2,465), r2s-famine-town-1 (famine)
- "Levies duties on goods entering and leaving by road. Run by royal or municipal officials." (6): r2r-town-12 (1,099), r2r-metropolis-54 (55,265)
- "Duties are taken here on goods passing along the road. Royal or municipal officers run it." (1): r2r-metropolis-44 (32,972), r2r-metropolis-44 (32,972)

## TAIL-HOUSES-5 · U2: the four red files in the houses' area (the chair, 04:49 UTC), each run ALONE at the merged tree 01714675f

| file | red at the merged tree | class | done |
|---|---|---|---|
| `tests/data/tailHouses1Gaps.test.js` | 6 of 31 (the PRECONDITION, not the cure: "the house lacks its input" no longer holds) | (ii) a pin a declared move explains: the defence lane's fcf4cae69 ("grapes and glass sand reach their house by any route the town can bring goods in on") closed the Vintner's and the Glassblower's gap in r2r-city-5, r2r-town-16, r2r-town-32, r2r-town-8, r2r-town-41; r2r-village-3's Sawmill draws another text | RE-KEYED BY IDENTITY: each pair names a town that still lacks the input and prints the same two texts (r2r-city-48, r2r-metropolis-9, r2r-metropolis-54, r2r-village-6; the two Glassblower texts print with the gap in no census town: r2r-town-293 and r2r-town-406, found by search beyond the 720) |
| `tests/data/w2FixData6Rows.test.js` | 3 | the Mine row: (ii) THIS GROUP'S OWN MOVE: TAIL-HOUSES-2 batch 3 (2c10ddefe; the one hedge form) put the town mine in "worked whenever ore can be had", which the pin's `/worked/` refused. RE-KEYED BY IDENTITY: the pin requires the hedge and still refuses the crews and the depths. The Brewer row (r2s-monster_pressure-village-1 has no "Ale (barrel)" service now) and the chair's row 4 (the income source reads "Harvest" where the pin wants "Agricultural Rents": r2r-thorp-0, -30, -50, r2r-hamlet-4, r2r-village-8): (iii) not in this group's files (`institutionServices.js`; the economy's income sources) | the Mine row re-keyed; the two others NAMED |
| `tests/components/houseLabelEverySurface.test.jsx` | 1 ("allowed 1, found 0" on the Defense page and both PDF profiles for rr2s-town-under_siege-rand-1) | (iii) the defence lane's allowance (`DEFENCE_ALLOWANCE`) is struck by a later cure on those surfaces (the label it banks no longer prints): a shrink the defence or the PDF lane owns (candidates by `git log`: d98f781f3 TAIL-DEFECON-D batch 1, 44d3088b4 TAIL-EXPORTS-PDF-2 batch 2; not bisected) | NAMED, not changed |
| `tests/domain/display/gapLineHousesByKind.test.js` | 7 of 7 (the ANCHOR: "the gap row names a house its roster holds by family" holds in none of its seven towns now) | (iii) the gap rows moved under it (the same family of moves as fcf4cae69); the writer it guards is `resourceChains.js :: processingInstitutions` (this group's file), unchanged by this seat | NAMED: owed, a re-key of its seven towns by identity (a search over the census's gap rows); not done for time |

## WHAT IS LEFT (TAIL-HOUSES-5, at its hand-back; supersedes TAIL-HOUSES-4's list above)

0. U2 (the chair's first order, 04:49): the four files run alone at the merged tree and classed (above): two re-keyed by identity, the rest NAMED with their cause. H20 (1) is DONE for every governance row printing in five towns or more: cured by the late re-read (the Household elder, the Merchant oligarchy), by rewording (the Town council, the Village elder, the Mayor and council, the merchant guilds' politics), struck (16720; TAIL-HOUSES-4's ten), or waiting (14179, false in one town).
1. **H20 (2)**: NAMED (above): the hedged lines need a vocabulary word for a live input (the chair's).
2. **17954** "Several inn districts" (6 of 67): the size class's (no atom separates a city under 5,000).
3. **PARKED (H4)**: 15712 (60), 09319 (7), 21584, 08266. **WAITS (H13)**: H9 "(powerful)" (15 towns, H11's two cures); 12014 the brewery (banked text) for the close; every row printing in fewer than five towns, and the rows false in fewer than five ordinary towns (B17798 3, B09671 2, 09333/28847/11393 1 each, 12702 1, B22199 1, B02583 1, 16366 2, 14179 1).
4. The X9 rows H5 answered by the leaf or sent to the services seat: as H5 lists them (no cure here).
5. GATES OWED AT THE CLOSE: the golden family re-taken through the owner's door (batches 8-11 move `institutions[].desc` in 60 + 66 + 125 + 13 records of the 720); `gapLineHousesByKind`'s seven anchor towns re-keyed by identity (U2); the two walkers (`negativeAssertionAnchor`, `seedLoopTotality`) name earlier seats' standing negatives in tailHouses1-7 and w2FixData6Rows (the close seats' to cure; this seat's new tests and re-keys are anchored).

## TAIL-HOUSES-5 · instruments and tips

- TIPS: the merge 01714675f; batch 8 5d906f6e4 (pushed with its hand-back 95b552bca); batches 9, 10, 11 36bcb60b5, 6510d746b, 99438070f; batch 8's gates ee83c8cb5; the U2 re-keys 61648f2a2; this hand-back is the tip. Handed back by time (about seventy minutes), after U2 and H20.
- Scratch: `<scratchpad>/wt` (own `npm ci`; the branch's tip, as `th5-work`), `<scratchpad>/wtbase` (detached at the merge 01714675f, node_modules symlinked) for the BEFORE census and the base reds, `<scratchpad>/wta` and `<scratchpad>/wtb` (detached at a committed batch) for the AFTER censuses, so no tree renders mid-edit. The births-only field diff: `births.mjs` (TREE= OUT= SEEDS=, about one minute) and a per-record JSON walk (`tools/fdiff.py`: identical records; differing fields by family).
- THE LATE TABLE: `institutionDescVariants.js :: DESC_LATE_SIBLINGS`, keyed by the WHOLE stored description; an entry is `[{ text, needs/excludes }, { text: twin, twinOf }]`. The atoms the powers answer only at the late pass: `ruling body`, `rival power`, `ruler: <kind>`. A key must not be a colour line (`institutionDescColour.js`) and its ledger row loses `colour`. The table's guard counts its keys.
- THE RECORD'S FACTS FOR THESE SHAPES: the government `powerStructure.government` (its kind by `rulerKind.js`; a body by `rulingBody.js`); a rival of standing by `rivalPower.js` (any non-governing power at Significant or above: a merchant rival counts, so a merchant claim cannot key on it); the route by `config.tradeRouteAccess`; income by `economicState.incomeSources[].source`.

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
