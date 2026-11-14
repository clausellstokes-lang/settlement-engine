# W2-FIX-DATA — the hand-back (round one's false lines in the generator's data files)

**Seat.** The first seat of the data lane of the second wave, cut at `31f57e8eb` (the writing lane's tip) on `lane/w2-fix-data-2026-11-13`. Brief: the chair's dispatch of 2026-11-13. Law: `docs/content/SOP_POOLS_AND_CONDITIONS.md`; the fixture `REVIEW-W2B-COLD-LIST.json` (lane/review-w2b-2026-11-13). Every count below is executed; CONFIRMED unless marked PLAUSIBLE.

**Tip:** the branch head after the last commit (the edge bundles, alone, as charter §0.11 asks); its sha is read back from the remote in the hand-back message. Cure commits `915bf42db`..`b91fcfe11`; test hygiene `bcc2e38b2`; the wiring census `e43a4b545`; this file; the bundles.

## 1. The measure first: the fixture rows in my files

106 of the 361 cold rows name one of my ten files as their source. 18 of them are not lines of those files:
- **9 `supplyChainData.js`** (flow-card chips: a chain's name, its "From", its "Via" houses). The file is held by two lanes in flight (agreement, upkeep: it has changed on both since the integration line). **Waiting**, listed in section 4.
- **9 `institutionBacking.js`** (the chips "Merchant guilds (3-8) · Merchant guilds (15-40)", "Adventurers' charter hall · Adventurers' guild", "Craft guilds (5-15)"). The reviewer's matcher found the house NAME in the backing catalogue; the chip row is the economics flow card listing a chain's candidate processing houses by catalogue name. No line of `institutionBacking.js` prints. The cure is the card's: it should read `facts/presence.js :: houseHere` (W2-A-LEAVES's leaf, made for exactly this). Not mine (display code).

The other 88 rows (60 distinct lines) are lines of my files. Every one of them printed false in its own town at the base (the fixture towns re-born at `31f57e8eb` by `birthConfig({...DEFAULT_CONFIG, ...config})` with their seeds; names and populations identical to the fixture's, 30 of 30). The probes are in my scratchpad, re-runnable: `probe/fixture-births.mjs`, `probe/frag.mjs` (the false fragment of each row, read in the town's record, base and tip).

## 2. What was cured, by file (the fixture towns, before → after)

| file | fixture rows | false at base | false at tip | cured |
|---|---|---|---|---|
| `institutionalCatalog.js` | 21 | 21 | 6 | 15 |
| `institutionDescColour.js` | 16 | 16 | 4 | 12 |
| `institutionDescVariants.js` | 9 | 9 | 0 | 9 |
| `institutionServices.js` | 8 | 8 | 2 | 6 |
| `arrivalProse.js` | 7 | 7 | 1 | 6 |
| `historyData.js` | 13 | 13 | 7 | 6 |
| `historyDescVariants.js` | 4 | 4 | 2 | 2 |
| `cultureProfiles.js` | 10 | 10 | 10 | 0 |
| **total** | **88** | **88** | **32** | **56** |

On the census's 720 towns (the 720 records, base `31f57e8eb` and tip), the towns each cured line printed in: the table counts the towns whose RECORD carries each line's false fragment (a conditioned line still prints where it is true, so its count falls only by the towns that made it false; a reworded line falls to 0). Probe: `probe/frag720.mjs` over the census's own birth corpora.

| file | false fragment | fixture rows | towns of 720, base | tip |
|---|---|---|---|---|
| institutionServices.js | carted to a mill outside | #74 | 240 | 229 |
| historyData.js | separate quarters | #69 #84 | 215 | 0 |
| institutionDescColour.js | thousands | #136 #280 | 204 | 161 |
| historyData.js | guard captain is on the payroll | #241 | 160 | 151 |
| institutionDescColour.js | persons | #132 #339 | 151 | 106 |
| historyDescVariants.js | for the throne | #183 | 131 | 0 |
| institutionalCatalog.js | surrounding woodland supply charcoal | #46 #60 #155 #289 | 129 | 0 |
| historyData.js | journeyman denied mastership | #315 | 125 | 119 |
| institutionServices.js | Available every morning | #131 | 120 | 116 |
| institutionDescVariants.js | nearest bridge | #35 #134 #330 #353 | 119 | 0 |
| historyDescVariants.js | wealthy merchants and working poor | #196 | 106 | 0 |
| institutionDescVariants.js | peace with the wild | #234 #281 #296 | 102 | 0 |
| historyData.js | last strong leader died | #31 #300 | 95 | 95 |
| institutionalCatalog.js | via the port | #133 #210 #235 | 85 | 39 |
| institutionDescColour.js | fresh catch | #285 | 78 | 33 |
| cultureProfiles.js | tanks, street kitchens | #73 #189 | 73 | 73 |
| historyData.js | the physician knows | #324 | 73 | 0 |
| institutionDescColour.js | road or harbour | #156 | 67 | 28 |
| institutionDescColour.js | most traded | #36 #62 #354 | 63 | 0 |
| cultureProfiles.js | Public ovens, neighborhood vendors | #177 #256 #304 | 61 | 61 |
| institutionalCatalog.js | working quarry | #47 #63 #157 | 57 | 57 |
| institutionDescColour.js | hold off famine | #212 | 55 | 55 |
| institutionDescColour.js | the village grazes | #15 | 51 | 0 |
| institutionDescVariants.js | whoever the banks refuse | #211 | 50 | 40 |
| institutionServices.js | priest manages the graveyard | #251 #311 | 48 | 0 |
| institutionDescVariants.js | hold the gates | #34 | 46 | 29 |
| institutionDescColour.js | Hundreds of quarters | #158 | 43 | 0 |
| cultureProfiles.js | fortified high precinct | #2 #17 | 41 | 41 |
| institutionDescColour.js | Nothing more exotic | #61 #154 | 39 | 0 |
| institutionDescVariants.js | Night patrols and gate duty | #272 | 39 | 25 |
| institutionalCatalog.js | carts that go out at dusk | #135 | 38 | 38 |
| institutionDescColour.js | A quarry with yards of dressed stone | #288 | 38 | 38 |
| institutionServices.js | Divine healing magic | #23 | 36 | 36 |
| institutionDescColour.js | work a shaft into the deposits | #287 | 36 | 36 |
| institutionServices.js | Rooms for travelers | #312 | 36 | 36 |
| institutionalCatalog.js | Night patrol and gate duty | #329 | 35 | 21 |
| historyData.js | speculative frenzy | #40 | 33 | 33 |
| institutionServices.js | Reliable, guild-backed | #116 | 33 | 31 |
| historyDescVariants.js | Competing guilds struggled | #314 | 23 | 23 |
| arrivalProse.js | beside the timber houses | #250 | 22 | 0 |
| institutionDescColour.js | Salt is won from local brine | #221 #270 | 21 | 21 |
| cultureProfiles.js | break up the stone streets | #253 #298 | 21 | 21 |
| historyData.js | reshaped the lower districts | #3 #7 #29 | 20 | 20 |
| arrivalProse.js | notary's clerk | #171 | 20 | 8 |
| cultureProfiles.js | dominate the older quarter | #268 | 20 | 20 |
| institutionDescVariants.js | too small to keep | #338 | 20 | 0 |
| arrivalProse.js | patron moves through the crowd | #254 | 18 | 7 |
| historyData.js | temple vault | #332 | 17 | 0 |
| arrivalProse.js | nobody looks hungry | #53 | 14 | 15 |
| historyData.js | mark on the waterfront | #204 | 12 | 12 |
| arrivalProse.js | offered water before | #99 | 10 | 9 |
| arrivalProse.js | Racks of new ironwork | #123 | 9 | 7 |
| institutionServices.js | on behalf of the lord | #105 | 8 | 0 |
| arrivalProse.js | fishmonger shouts | #299 | 8 | 0 |
| institutionalCatalog.js | supplying local alehouses. Requires grain surplus | #90 | 7 | 4 |
| historyDescVariants.js | marked the waterfront | #282 | 7 | 7 |
| institutionalCatalog.js | A royal governor or viceroy administers directly | #220 | 5 | 0 |
| institutionalCatalog.js | kilns in the surrounding woodland | #265 | 5 | 0 |
| institutionDescVariants.js | supplying the alehouses nearby | #24 | 3 | 1 |
| institutionalCatalog.js | nearby marshland | #91 | 3 | 3 |

Read with it: "nobody looks hungry" rises 14 → 15 (the arrival redraw re-deals one town into a line that already excludes starving and hunger; the town's band reads above deficit, so the line obeys its leaf, and the two-homes fault of #53 stands, section 3). The conditioned lines' remaining counts are towns where they are true, by the declaration (e.g. "via the port" 85 → 39: the 39 have docks, less the cascade case of section 3).


The commits, one cause each, red first (each new test red at the commit before, green at its own):

| commit | cause | red-first |
|---|---|---|
| `915bf42db` | institution descriptions reworded to presume nothing false | `tests/data/w2FixDataDescs.test.js` (9 rewording members) |
| `4c4a1c269` | institution descriptions declare their disqualifier, each with a twin | the same file (9 condition members) |
| `3efd5044d` | three service lines exclude a siege, each with its twin | `tests/data/w2FixDataServices.test.js` (3) |
| `5c1e94f5a` | two service lines reworded | the same file (2) |
| `b3a5fc4ba` | five arrival beats declare | `tests/data/w2FixDataArrival.test.js` (4) |
| `121588cc4` | the steppe felt tents reworded | the same file (1) |
| `a85032aca` | three history hooks declare the house they presume | `tests/data/w2FixDataHistory.test.js` (2) |
| `b91fcfe11` | five history lines reworded | the same file (5) |

What each town prints now, in place of the false line, is in section 5 (the twin beside its original) and section 6 (the reworded line beside the old).

## 3. Lines still false at the tip, and why (32 fixture rows)

| rows | line | why it is not cured | what it needs |
|---|---|---|---|
| 10 (#2, 17, 73, 177, 189, 253, 256, 268, 298, 304) | `cultureProfiles.js`: three architectural details ("stone streets", "the older quarter", "a fortified high precinct") and two foodways ("Public ovens, neighborhood vendors", "tanks, street kitchens") | **WAITING (the picker).** The detail is materialized in `resolveConfig` (`cultureProfiles.js :: materializeCulturalIdentity`, called before the roster exists, no facts handed) and printed raw by the PDF; the arrival redraw honours a row's declaration only when the materialized one is absent. The foodways line is picked in `domain/foodways.js` from `cultureLines.map(textOf)`, which drops a declaration; `foodways.js` and `foodGenerator.js` are held by the agreement and upkeep lanes. | A size gate (`tier: ≥ town`; the fortified precinct also `walls`) read by the two pickers: `materializeCulturalIdentity` takes the tier (it is in the config) and resolves a refused pick draw-free to the next admitted row; `composeFoodwaysLine` keeps a row's declaration. Recommended for the lane that holds `foodways.js` and the instrument seat (`resolveConfig`'s call). |
| 5 (#3, 7, 29 flood; #204, 282 wild magic) | the event descriptions' place tokens: "reshaped the lower districts" in a thorp of 6 and a village of 99; "left its mark on the waterfront" with no water | **WAITING (the picker).** The token is filled by route in three code files (`history/historyRouteContext.js :: disasterLocation`, `historyTemplate.js :: buildCurrentTensionTokens`, `historyGenerator.js :: generateEventNarrative`'s default tokens), none mine, all reading no size. | A small-place word list for tier ≤ village ("the low ground", "the common", "the lower fields") and `navigable` before a waterfront; one draw kept. |
| 3 (#31, 300 vacuum; #40 market crash) | "The last strong leader died or left" under a stable, unchallenged power; "A speculative frenzy … collapsed" in a prosperous city | **Two homes**: the record's own tension (`history.currentTensions`) disagrees with its power and economy. The line is true to its tension; the tension's choice is the fault. | `historyGenerator.js`'s tension selection reading `powerStructure.stability` and the prosperity band (the powers are drawn first). |
| 1 (#314) | "Competing guilds struggled for control of the market" in a hamlet with neither | The **event** (guild_conflict) is eligible in a hamlet; a reworded variant would leave its canonical description and its name ("The Guild War") false. | The event's eligibility in `historyGenerator.js` reading `guild` (homed). |
| 2 (#221, 270) | the salt works "won from local brine" where it boils bought-in salt (c23) or worked out its flats (c19) | **WAITING (a leaf).** The salt's source is `config.nearbyResources` / `nearbyResourcesDepleted`; no leaf answers "this town works its own salt" at the description draw. | `chainWorking.js :: chainWorksResource` (the agreement lane's leaf, not on this base) or a base-layer leaf over the config's resources, as an atom. The brief's own example; the twin is ready to write the day the atom exists. The trade figure in the same lines IS cured (`915bf42db`). |
| 5 (#47, 63, 157, 288 quarry; #287 mine) | "A working quarry … builds the walls and churches of half the region"; "work a shaft into the deposits" where the quarry and the mine are depleted or the resource is absent | **WAITING (a leaf)**, the same. | The same atom (worked here / depleted). |
| 1 (#91) | the peat cutter's "nearby marshland" in a plains town | **WAITING (a leaf)**: no wetland resource leaf. | A wetland atom. |
| 1 (#90) | the maltster's "Requires grain surplus" in a hamlet in food deficit | The alehouse half is true there (the hamlet has one); the surplus is a statement of what the trade needs, read by the reviewer as a claim. LOW. Not changed. | The chair's read: leave, or reword "when there is grain to spare". |
| 1 (#210) | the customs house "via the port" in a road town with no docks (c18) | PLAUSIBLE: the house was added by the cascade after the description draw, whose rows keep their catalogue line through `shipFreeDesc` and never meet the declared draw. | `assembleInstitutions.js`: the cascade's rows resolved through `drawInstitutionDesc` too (not my file). |
| 1 (#23) | "Divine healing magic" at a resident priest where divine magic is absent and the faith hostile to it | **WAITING (an atom)**: `magicSource.js` reads the divine tradition's houses, but the vocabulary has no atom for it. | A `divine magic` atom over `magicSource.js` (the instrument seat). |
| 1 (#312) | an alehouse offering "Rooms for travelers" | The alehouse takes the inn's services by fuzzy name match; an alehouse menu of its own would add rolls and re-deal the services stream. **Parked**: a ruled shape (the service roll). | The chair's ruling on an Alehouse menu (or the alehouse not matched to the inn). |
| 1 (#53) | "nobody looks hungry" in a metropolis whose food record shows a shortfall | **Two homes**: the line already excludes starving and hunger, and the food band's home reads `secure` there while the food record says "Short: 689 lbs/day". | The food band's home (W2-C-LEAVES / the economy lane). |

## 4. Lines waiting, and the leaf each needs (summary)

| line | the leaf or picker it waits on | whose |
|---|---|---|
| Salt works "won from local brine" / "the local saline source" / "along the coast or riverbank" (3) | an atom "this town works its own <resource>" (`chainWorking.js :: chainWorksResource`, or a base-layer leaf over `config.nearbyResources` and `nearbyResourcesDepleted`) | the agreement lane's leaf; the instrument seat's atom |
| Stone quarry (3) and Mine (3): "a working quarry", "work a shaft into the deposits" | the same atom (worked here / depleted) | the same |
| Charcoal burner in FOREST country whose forest is depleted (c21, c26, c29) — out of forest country it is cured | the same atom over `managed_forest` | the same |
| Peat cutter "nearby marshland" (3) | a wetland resource atom | the instrument seat |
| Priest (resident) / Healing "Divine healing magic" | a divine-magic atom over `magicSource.js` | the instrument seat |
| the three culture architectural details and two foodways lines (section 3) | the pickers `materializeCulturalIdentity` (its caller `resolveConfig.js`) and `domain/foodways.js :: composeFoodwaysLine` honouring a row's declaration; the size atom exists (`tier`) | `foodways.js` is held by the agreement and upkeep lanes |
| the history place tokens "the lower districts", "the waterfront" (5 rows) | a size- and water-aware token list in `historyRouteContext.js`, `historyTemplate.js`, `historyGenerator.js` | not mine (code) |
| the tensions "leadership vacuum" and "market crash" under a stable power and a prosperous economy; the guild_conflict event in a hamlet | the tension / event choice reading the power, the prosperity band and `guild` | `historyGenerator.js` |
| `supplyChainData.js`'s 9 rows (the flow card's chain names and sources) | the file is held by the agreement and upkeep lanes | after they merge |


## 5. NEW LINES, for the owner's veto (each twin beside the line it answers)

### The institution descriptions (`institutionDescVariants.js :: DESC_VARIANT_SIBLINGS`, `4c4a1c269`)

| the line (its disqualifier) | the twin, printed where the line is false (its declaration) |
|---|---|
| Converts barley into malt for brewing. Small operation supplying local alehouses. Requires grain surplus. (needs: institution: tavern) | **Converts barley into malt for brewing. A small operation; the households brew their own ale from it. Requires grain surplus.** (excludes: institution: tavern) |
| Turns barley into malt for the brewers. A small concern feeding the local alehouses, and one that only runs when grain is in surplus. (needs: institution: tavern) | **Turns barley into malt for the households that brew at home. A small concern, and one that only runs when grain is in surplus.** (excludes: institution: tavern) |
| Malts barley for brewing on a modest scale, supplying the alehouses nearby. It needs grain to spare before it can work at all. (needs: institution: tavern) | **Malts barley on a modest scale for brewing at home. It needs grain to spare before it can work at all.** (excludes: institution: tavern) |
| Part-time guards. Night patrol and gate duty. (needs: gate) | **Part-time guards. Night patrols through the lanes.** (presumes nothing) |
| Part-time guards who walk the night and hold the gates. (needs: gate) | **Part-time guards who walk the night and keep the peace.** (presumes nothing) |
| Watchmen serving part-time. Night patrols and gate duty. (needs: gate) | **Men and women serving part-time, walking the night rounds.** (presumes nothing) |
| Kiln crews in the surrounding woodland supply charcoal to the smelters, smiths, and bakers. Metalworking here burns through a forest a generation. (needs: terrain: forest) | **Turf-covered kilns burn wood slowly down to charcoal, the fuel that forge and oven need to run hot.** (excludes: terrain: forest) |
| Crews tend kilns out in the woods and sell charcoal to smelters, smiths, and bakers. The metal trades here use up a forest a generation. (needs: terrain: forest) | **Charcoal kilns, tended day and night while a burn lasts. What they make feeds the hottest fires in the settlement.** (excludes: terrain: forest) |
| Charcoal from woodland kilns feeds the smelters, the smithies, and the bake ovens. At this pace of metalwork, a forest lasts a generation. (needs: terrain: forest) | **A collier's kilns, smoking under their turf, turning whatever wood can be had into charcoal for forge and oven.** (excludes: terrain: forest) |
| Operates kilns in the surrounding woodland, supplying fuel for smithing, baking, and heating. The settlement's most reliable fuel source when timber is abundant. (needs: terrain: forest) | **Turf-covered kilns burn wood slowly down to charcoal, the fuel that forge and oven need to run hot.** (excludes: terrain: forest) |
| Works kilns out in the surrounding woods, producing the fuel for smiths, bakers, and hearths. Where timber runs plentiful, no fuel source is steadier. (needs: terrain: forest) | **Charcoal kilns, tended day and night while a burn lasts. What they make feeds the hottest fires in the settlement.** (excludes: terrain: forest) |
| Tends charcoal kilns in the nearby woodland to feed the forge, the oven, and the fire. When timber is abundant, it is the settlement's surest supply of fuel. (needs: terrain: forest) | **A collier's kilns, smoking under their turf, turning whatever wood can be had into charcoal for forge and oven.** (excludes: terrain: forest) |
| Operates kilns in nearby woodland. Supplies fuel for smithing and baking. Essential intermediate step between forest and forge. (needs: terrain: forest) | **Turf-covered kilns burn wood slowly down to charcoal, the fuel that forge and oven need to run hot.** (excludes: terrain: forest) |
| Tends kilns out in the nearby woods, supplying the fuel that smiths and bakers burn. The necessary link between forest and forge. (needs: terrain: forest) | **Charcoal kilns, tended day and night while a burn lasts. What they make feeds the hottest fires in the settlement.** (excludes: terrain: forest) |
| Works his kilns in the woodland close by, turning timber into the fuel for forge and oven. Without him nothing gets from the trees to the fire. (needs: terrain: forest) | **A collier's kilns, smoking under their turf, turning whatever wood can be had into charcoal for forge and oven.** (excludes: terrain: forest) |
| Levies duties on goods entering and leaving via the port or main roads. Run by royal or municipal officials. (needs: institution: docks) | **Levies duties on goods entering and leaving by the main roads. Run by royal or municipal officials.** (excludes: institution: docks) |
| Duties are taken here on goods passing through the port or the main roads. Royal or municipal officers run it. (needs: institution: docks) | **Duties are taken here on goods passing along the main roads. Royal or municipal officers run it.** (excludes: institution: docks) |
| Levies charged on all trade in and out by road or harbour, collected by officials of crown or town. (needs: institution: docks) | **Levies charged on all trade in and out by road, collected by officials of crown or town.** (excludes: institution: docks) |
| Lends against pledged goods at high interest and asks no questions. The only credit open to labourers, journeymen, and anyone the banks turn away. (needs: institution: bank) | **Lends against pledged goods at high interest and asks no questions. For labourers and journeymen it is the only credit there is.** (excludes: institution: bank) |
| Takes pledges and lends at steep interest, no questions asked. It is the only credit for labourers, journeymen, and whoever the banks refuse. (needs: institution: bank) | **Takes pledges and lends at steep interest, no questions asked. Labourers and journeymen have nowhere else to borrow.** (excludes: institution: bank) |
| High-interest loans against pledged goods, with no questions. For labourers, journeymen, and anyone the banks will not serve, it is the only lender. (needs: institution: bank) | **High-interest loans against pledged goods, with no questions. For labourers and journeymen it is the only lender going.** (excludes: institution: bank) |
| Communal grain storage. Buffers harvests, prevents famine. (excludes: crisis: famine) | **Communal grain storage, meant to carry the town through bad harvests. This year it has not been enough.** (crisis: famine) |
| Shared grain stores that even out the harvests and hold off famine. (excludes: crisis: famine) | **Shared grain stores, built to even out the harvests. The famine is drawing them down faster than any harvest could refill them.** (crisis: famine) |
| The old grounds inside the walls filled generations ago, so the dead are lifted once their term is up and their bones stacked in the charnel house to make room for the next. New ground has been bought outside the gates, and the carts that go out at dusk are a fixed part of the city's evening. Who is lifted and who is left where they lie is settled by what a family endowed. (needs: walls, gate; excludes: crisis: under_siege) | **The old grounds filled generations ago, so the dead are lifted once their term is up and their bones stacked in the charnel house to make room for the next. Since the siege closed the roads, no cart goes out to the new ground, and the newly dead wait in the charnel house. Who is lifted and who is left where they lie is settled by what a family endowed.** (crisis: under_siege) |
| Carts go out at dusk to ground bought beyond the walls, and the charnel house holds what the old plots gave up. What a family endowed decides who is lifted and who is left. (needs: walls; excludes: crisis: under_siege) | **The charnel house holds what the old plots gave up, and with the roads cut it now holds the newly dead as well. What a family endowed decides who is lifted and who is left.** (crisis: under_siege) |
| Organized sellsword companies. Major forces (hundreds to thousands). (needs: tier: = metropolis, mercenary) | **Organized sellsword companies. Real forces, a few score to a few hundred blades apiece.** (needs: mercenary) |
| Sellsword companies under proper organisation, mustering hundreds to thousands. (needs: tier: = metropolis, mercenary) | **Sellsword companies under proper organisation, each mustering a few score blades, the largest some hundreds.** (needs: mercenary) |
| Organised bands of hired blades. Major forces, hundreds to thousands strong. (needs: tier: = metropolis, mercenary) | **Organised bands of hired blades, a few score to a few hundred strong.** (needs: mercenary) |
| A covered fish market under the market wardens. The morning's catch or the week's salted barrels, sold by weight and inspected for rot. (needs: navigable, market) | **A covered fish market under the market wardens. Salted, smoked and dried fish come in by cart, sold by weight and inspected for rot.** (needs: market; excludes: navigable) |
| Covered stalls under the wardens' eye, selling the morning's catch or the week's salted barrels by weight, each checked for rot. (needs: navigable, market) | **Covered stalls under the wardens' eye, selling salt fish and dried fish carted in by the barrel, each checked for rot.** (needs: market; excludes: navigable) |
| The market wardens keep a roofed fish market where fresh catch and salted barrels are weighed out and inspected before sale. (needs: navigable, market) | **The market wardens keep a roofed fish market where carted barrels of salt fish are weighed out and inspected before sale.** (needs: market; excludes: navigable) |

### The services (`institutionServices.js :: SERVICE_DESC_SIBLINGS`, `3efd5044d`)

| the line (excludes crisis: under_siege) | the twin (crisis: under_siege) |
|---|---|
| Grain carted to a mill outside the settlement and brought back as flour. | **With the roads cut, grain is ground by hand at home until the carts can get through again.** |
| Fruit, vegetables, dairy, and eggs. Available every morning. | **Whatever the kitchen gardens still give, sold early and gone by mid-morning.** |
| Organised road transport for goods between towns. Reliable, guild-backed. | **Road transport for goods between towns, guild-backed. With the roads cut, the wagons stand idle in the yard.** |

### The arrival beats and the history hooks gained declarations and no new line (`b3a5fc4ba`, `a85032aca`): the ironwork carts and the travellers' water exclude a siege; the fishmonger needs a market; the patron and the notary's clerk need tier ≥ town; the guard captain needs a watch; the journeyman and the guild master need a guild.


## 6. REWORDED LINES, for the owner's veto (old → new)

| file · commit | old | new |
|---|---|---|
| institution descriptions · `915bf42db` | A flat-bottomed ferry crossing the river. The ferryman's family has held the crossing rights for generations. Essential for anyone who doesn't want a long walk to the nearest bridge. | **A flat-bottomed ferry crossing the river. The ferryman's family has held the crossing rights for generations, and every crossing pays the family its fare.** |
| institution descriptions · `915bf42db` | A flat-bottomed ferry over the river, the crossing rights held in one family for generations. Anyone unwilling to walk the distance to the nearest bridge depends on it. | **A flat-bottomed ferry over the river, the crossing rights held in one family for generations. Carts, beasts and walkers wait their turn on the bank.** |
| institution descriptions · `915bf42db` | The river is crossed by a flat-bottomed ferry, worked by a family that has held the right to it for generations. Without it, the nearest bridge is a long walk off. | **The river is crossed here by a flat-bottomed ferry, worked by a family that has held the right to it for generations.** |
| institution descriptions · `915bf42db` | A royal governor or viceroy administers directly on behalf of the crown. High status, high scrutiny. | **The crown's own seat of government, held by the monarch or by a governor in the crown's name. High status, high scrutiny.** |
| institution descriptions · `915bf42db` | A royal governor or viceroy administers the city directly for the crown. The standing is high, and so is the scrutiny. | **The crown governs the city from here, in person or through a royal governor. The standing is high, and so is the scrutiny.** |
| institution descriptions · `915bf42db` | The crown governs here at first hand, through a royal governor or viceroy. Great prestige, and no less watchfulness. | **The crown governs here at first hand, whether the monarch sits in it or a viceroy does. Great prestige, and no less watchfulness.** |
| institution descriptions · `915bf42db` | A council of senior druids who govern their circle's relationship with the city. They may maintain a hidden grove beneath the streets, mediate between urban expansion and wild places, or serve as ecological advisors to the ruling authority. Found in cities that have made their peace with the wild. | **A council of senior druids who govern their circle's relationship with the city. They may maintain a hidden grove beneath the streets, mediate between urban expansion and wild places, or serve as ecological advisors to the ruling authority.** |
| institution descriptions · `915bf42db` | Senior druids who govern how their circle deals with the city. They may keep a grove hidden beneath the streets, hold the line between the city's spread and the wild, or advise its rulers on the land. Found where a city has come to terms with the wild. | **Senior druids who govern how their circle deals with the city. They may keep a grove hidden beneath the streets, hold the line between the city's spread and the wild, or advise its rulers on the land.** |
| institution descriptions · `915bf42db` | A council of elder druids charged with their circle's standing in the city: sometimes tending a concealed grove below the streets, sometimes mediating between expansion and wild ground, sometimes counselling those in power on ecological matters. It arises only in cities at peace with the wild. | **A council of elder druids charged with their circle's standing in the city: sometimes tending a concealed grove below the streets, sometimes mediating between expansion and wild ground, sometimes counselling those in power on ecological matters.** |
| institution descriptions · `915bf42db` | A lone hand or small cell, in a place too small to keep an assassins guild. Work comes through criminal go-betweens: less dependable, but deniable. | **A lone hand or small cell with no assassins guild behind it. Work comes through criminal go-betweens: less dependable, but deniable.** |
| institution descriptions · `915bf42db` | One killer, or a handful, in a place too small to keep an assassins guild. Contracts arrive by way of criminal intermediaries, less reliable and for that reason harder to trace back. | **One killer, or a handful, answering to no assassins guild. Contracts arrive by way of criminal intermediaries, less reliable and for that reason harder to trace back.** |
| institution descriptions · `915bf42db` | Common animals only. Horses, dogs, falcons. | **Horses, dogs, falcons, trained for the saddle, the hunt and the glove.** |
| institution descriptions · `915bf42db` | Ordinary beasts only: horses, dogs, falcons. | **Horses, dogs and falcons, broken and trained to order.** |
| institution descriptions · `915bf42db` | Horses, dogs, and falcons. Nothing more exotic. | **Horses, dogs, and falcons, each trained for its work.** |
| institution descriptions · `915bf42db` | Hundreds of quarters, one house of worship to each, so that faith runs through every part of the city. | **Every quarter keeps its own parish, so that faith runs through every part of the city.** |
| institution descriptions · `915bf42db` | Evaporation pans or brine processing along the coast or riverbank. Salt is the settlement's most traded commodity by weight. Every household needs it. | **Evaporation pans or brine processing along the coast or riverbank. Every household needs what it makes.** |
| institution descriptions · `915bf42db` | Evaporation pans and brine-works turn the local saline source into salt. By weight, it is the settlement's most traded product, and no household does without it. | **Evaporation pans and brine-works turn the local saline source into salt, and no household does without it.** |
| institution descriptions · `915bf42db` | Salt is won from local brine in broad evaporation pans. It is the settlement's most-traded good by weight and a necessity in every home. | **Salt is won from local brine in broad evaporation pans. It is a necessity in every home.** |
| institution descriptions · `915bf42db` | Formal venue for selling high-value goods: estates, ships, livestock, art, and occasionally persons. Charges buyer's and seller's premiums. | **Formal venue for selling high-value goods: estates, ships, livestock, art, and the contents of great houses. Charges buyer's and seller's premiums.** |
| institution descriptions · `915bf42db` | A formal house for the sale of costly goods: estates, ships, livestock, art, and now and then persons. It takes a premium from buyer and seller both. | **A formal house for the sale of costly goods: estates, ships, livestock, art, and now and then a whole household's goods. It takes a premium from buyer and seller both.** |
| institution descriptions · `915bf42db` | The recognised venue for high-value lots, be they estates, ships, livestock, art, or on occasion persons. Both buyer and seller pay its premium. | **The recognised venue for high-value lots, be they estates, ships, livestock, art, or on occasion a debtor's whole house. Both buyer and seller pay its premium.** |
| institution descriptions · `915bf42db` | Shared pasture for village livestock. | **Shared pasture for the hamlet's livestock.** |
| institution descriptions · `915bf42db` | Open pasture the village grazes in common. | **Open pasture the hamlet grazes in common.** |
| institutionServices.js · `5c1e94f5a` | Funeral rites and burial. The priest manages the graveyard. | **Funeral rites, said by the parish priest, who comes or is sent for.** |
| institutionServices.js · `5c1e94f5a` | Manage village affairs on behalf of the lord. Allocate strips and common access. | **Manage the village's affairs day to day. Allocate strips and common access.** |
| arrivalProse.js · `121588cc4` | Felt tents stand beside the timber houses, and their owners seem at home in either. | **Felt tents stand beside the houses, and their owners seem at home in either.** |
| historyDescVariants.js · `b91fcfe11` | The reigning ruler was failing in health, and rival claimants maneuvered quietly for the throne | **The one who led was failing in health, and rivals maneuvered quietly to take that place** |
| historyDescVariants.js · `b91fcfe11` | A widening gulf between wealthy merchants and working poor breeds lasting resentment | **A widening gulf between the well-off and the working poor breeds lasting resentment** |
| historyData.js · `b91fcfe11` | Someone is poisoning the ruler slowly, and the physician knows | **Someone is poisoning the ruler slowly, and someone in the household knows** |
| historyData.js · `b91fcfe11` | A relic seized during the trial never reached the temple vault it was bound for | **A relic seized during the trial never reached the vault it was bound for** |
| historyData.js · `b91fcfe11` | Collaborator and resistance families still keep to separate quarters, and old property seizures remain legally unresolved (and its lasting effect, the first clause alone) | **Collaborator and resistance families still keep apart, and old property seizures remain legally unresolved** |


## 7. Calls taken without the chair (each only declares or names)

1. **The town watch's gate (R-Q).** The variant texts #0/#1 stay out of `DESC_VARIANT_DECLARATIONS` (the R-Q pin in `institutionProseDeclared.test.js` holds). The gate is declared in their sibling sets, with twins that presume no gate either way, so a gate the cascade adds after the draw (R-Q's reason) cannot make the printed line false. VETOABLE: R-Q may want the declaration left entirely alone.
2. **Two pool-membership pins** (`dossierContent.test.js`, `tierNounPoolDraws.test.js`) accept a member's declared twin (an authored line reached by resolution). Not a loosening: the twin is in `DESC_VARIANT_SIBLINGS`, keyed by the member it answers.
3. **Count pins re-keyed by cause**: `institutionProseDeclared` (64 → 75 declaring ledger rows, 61 → 72 texts; services 49 → 51), `hookTablesDeclared` (15 → 17), `textOf.test.js` (99 → 101), `census2fColour` (the fishmonger's `market`).
4. **The guard captain** needs `watch`, not `garrison` too (the vocabulary has no watch-or-garrison composite); a garrison town with no watch loses the line. VETOABLE.
5. **The ledgers** (`docs/census/declarations/*.json`, hand-kept) edited by script to follow each text and declaration; the colour mark dropped on every row that now declares.

## 8. Parked for the chair (each changes a door, a ruled shape or another lane's file)

1. **The repetition guard's tightening door (the chair's alone).** At `3efd5044d` the member "no ceiling sits loose above its measure" reds on two rows: `ledger:institutionServices:Carriers' guild.Freight haulage` (ceiling 1, measure 0.946) and `…Daily markets.Fresh produce` (ceiling 1, measure 0.873). The siege twins add variety; the rows want `--tighten`. Carried red, named here.
2. The flow-card chips (section 1) and the five picker cures (section 3) are other lanes' files.
3. `src/data/inlandDescriptions.js` (not in my list) still sells "now and then persons" at the auction house where the content is off: the inland text an inland town takes when every variant speaks of ships. Same cure as `915bf42db`.

## 9. The census counter, the field diff, the six surfaces, the gates, the suite

### The census counter (`SECOND-WAVE-CENSUS/census.sh`, base `31f57e8eb` against tip, then `compare.mjs`)

No count rises; no new row. One falls: pattern 10, "hold the gates, no walls", 17 → 0 (the town watch's gate twins). Every other row is equal to the town.

```
row | base | tip | verdict | reader
1a food verdict "only just" vs grows more | 57 | 57 | OLD | SECOND
1b "small margin" vs ≥25% imported | 64 | 64 | OLD | SECOND
2 two store durations | 569 | 569 | OLD | CROSS
3 magic tab vs Arcane None | 190 | 190 | OLD | CROSS
4 "almost level" vs leader far ahead | 106 | 106 | OLD | SECOND
5a hall free vs criminal money | 0 | 0 | — | SECOND
5b Diffuse vs criminal power | 0 | 0 | — | SECOND
6 gap vs imports | 0 | 0 | — | CROSS
7a two founders | 128 | 128 | OLD | GLANCE
7b no wharf vs port origin | 27 | 27 | OLD | CROSS
8 no church vs worship economy | 220 | 220 | OLD | CROSS
9 Critical over reassuring text | 149 | 149 | OLD | GLANCE
10 hold the gates, no walls | 17 | 0 | BETTER | SECOND
11 flow source town lacks | 410 | 410 | OLD | CROSS
F4 income line, no working | 245 | 245 | OLD | CROSS
13 "…and go on." doubled | 0 | 0 | — | GLANCE
14 size words in small places | 167 | 167 | OLD | SECOND
15 burial under Healing | 720 | 720 | OLD | SECOND
16a "ruling three" lists fewer | 331 | 331 | OLD | GLANCE
16b two "Powers (n)" counts | 291 | 291 | OLD | GLANCE
17 non-goods produced locally | 680 | 680 | OLD | GLANCE
18 count ranges as names | 360 | 360 | OLD | GLANCE
19 debug text as tension | 7 | 7 | OLD | GLANCE
20 siege text, no siege | 0 | 0 | — | SECOND
NEW-1 governance vs Defense | 11 | 11 | OLD | SECOND
NEW-2 magic income, no practitioner | 3 | 3 | OLD | CROSS
towns 720 GLANCE base 716 tip 716 | GLANCE excl 17,18 base 586 tip 586
median rows/town base [ 7, 7, 6.6 ] tip [ 7, 7, 6.576388888888889 ]
```

### The field diff (the census's 720 birth corpora, base against tip)

630 of 720 births move, ONLY in strings this lane's lines print, by leaf: `.institutions[].desc` 1270 · `.history.historicalEvents[].description` 223 · `….lastingEffects[]` 155 · `.history.currentTensions[].lastingEffects[]` 73 · `.defenseProfile.institutions.mercenary[].desc` 62 · `.history.historicalEvents[].plotHooks[]` 66 · `.history.currentTensions[].plotHooks[]` 58 · `….description` 56 · `.arrivalScene` 56 · `.availableServices.healing[].desc` 48 (the last rites) · `.defenseProfile.institutions.watch[].desc` 45 · `.availableServices.food[].desc` 15 · `….legal[].desc` 8 · `.history.siegeNarrative` 4 · `.history.legacyAnnotations[].annotation` 4 · `.availableServices.transport[].desc` 2. 17 births change their leaf count: a tension's hook list loses the refused guard captain (the tensions' door filters, kind A). No person, house, roster, power, event, band or score moves; no service leaves a list (a refused service takes its twin).

### The six golden surfaces (the draft record: `docs/chair/2026-11-13/W2-FIX-DATA-shift-record.DRAFT.json`)

| surface | by measure |
|---|---|
| generator golden master | MOVES: 525 of 525 configuration hashes differ base→tip (501 red at base, the agreement lane's; 24 more here) |
| espionage dormancy fence | MOVES: the driven corpus hash `4c0fe1fe…` → `f19acafc…` (red at base) |
| dossier prose manifest | unmoved: failure output byte-identical but for its run time |
| PDF golden (`goldenViewModel`) | unmoved: failure output byte-identical |
| Herald desk golden | unmoved: failure output byte-identical |
| preset-lighting witness | unmoved: green at base and tip |

I signed nothing and ran no golden's door. The two moved surfaces are the merge seat's.

### The gates

At every commit touching `src/`: `check-domain-strict` 0, `typecheck:ratchet` 0, eslint on the touched files 0 (each read through `scripts/gate-tail.sh`). The push hook's three gates passed at the pushes.

### The whole suite, once, at `e43a4b545` + the edge bundles (`npx vitest run --maxWorkers=2`, 107 min, with `review-fixes-2026-07-08` fetched)

At `b91fcfe11` (the last cure): **76 failed** of 39,084 (54 files). The same 54 files run on the base: **61 failed**, and every one of the 61 is red at the tip with the same title (base-only: 0). The **15 new** reds, classed:

| reds | class | state at the tip |
|---|---|---|
| 8 (`engineBundleReplay` 4, `engineServiceCore` 1, `engineServiceStoreParity` 3) | the committed engine bundle is stale against the moved data | **CURED** by the last commit, `npm run build:edge-shared` (charter §0.11): `tests/build/engine*` and `tests/edgeFunctions/` 960/960 green. The re-emission also refreshes the AI bundles whose freshness tests were red at the base (7 of the 61 base reds go green with it: `edgeSharedBundleReproducibility` 4, `aiCharterBundle`, `aiGroundingBundle` and `aiOutputSchemaBundle` freshness 1 each) |
| 2 (`proseWiringCensus` car 0, car 5b) | the wiring census's atom tallies | **CURED** at `e43a4b545` (its own writer; 79/79) |
| 2 (`defenceTwinLines` F10 unit 4) | the pin read every sibling set as a defence twin | **CURED** at `bcc2e38b2` (re-keyed by cause; count pin 10 holds) |
| 1 (`mutationCoverageManifest` TOTALITY) | the four new invariant files had no entry | **CURED** at `bcc2e38b2` (rationale rows) |
| 1 (`negativeAssertionAnchor`) | nine bare not.toMatch in this lane's tests | **CURED** at `bcc2e38b2` (anchored) |
| 1 (`poolDominance` "no ceiling sits loose") | two service rows now more varied than their banked ceiling of 1 | **CARRIED**: tightening is the chair's door (section 8) |

The 61 base reds (unchanged, not classed again here; the list is `suite-fail-titles` in my scratchpad, reproducible by the same command): the agreement lane's golden and fixture rows, the prose walkers, the corpus projection (`census2DeclaredPools`), `factLayers` READERS, presumed-things arm 1 (pageCensusFindings, defenseDisplay, factLayers), and the others named in the W2-B-DECLARE hand-back.

### Not measured

The worker byte ceiling: `institutionDescVariants.js` rides in the generation worker (its header: "its byte ceiling is signed"); this lane adds about 25 KB of source text to it (`institutionDescVariants.js` +23.5 KB, `institutionServices.js` +1.9 KB, before minification). I ran no production build; a rise is bytes OWED for the merge seat to read (rule 38).

