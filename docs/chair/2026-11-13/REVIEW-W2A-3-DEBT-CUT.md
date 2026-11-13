# REVIEW-W2A-3: the debt cut (the cold list's 55 HIGH and 426 MEDIUM, by owner and by lane in flight)

This is a measure, not a review: it gives no verdict and changes nothing on any lane. The chair asked for it on 2026-11-13. The source is `REVIEW-W2A-3-COLD-LIST.json` beside this file: twenty fresh towns at 817980b33, in the app's configuration shape. The scripts and their outputs are in `probes/REVIEW-W2A-3/debt/`.

## The tips read (origin, 2026-11-13 ~13:5x UTC)
| lane | tip | towns it re-deals of my 20 (roster, cast or powers differ from 817980b33) |
|---|---|---|
| `lane/w2-write-2026-11-13` (the corpus) | 4f52408b7 | none: all 20 records identical |
| `lane/w2-fix-data-2026-11-13` (the data files) | 7574ae27e | none: identity kept in all 20 (18 move fields only) |
| `lane/coherence-upkeep-2026-11-12` (defence, upkeep) | 9fccbd8ed | 4: city-calm, city-famine, city-wartime, metropolis-politically_fractured |
| `lane/merge-11-point-47-wip-2026-11-13` (the agreement lane on the line) | b629ab345 | 15, mostly the cast |
| `lane/powers-follow-up-2026-11-13` | **not on origin** | — |

Some of these lanes sit on older bases. They do not carry this lane's cures, for example the ring-note rewording and the restored gap lines. Where a line leaves such a lane's page only because the older base silenced it, I do not count it as cured (#629).

## Method
1. **Owner** (`attrib.mjs`, `attrib2.mjs`).
   - Each sentence is matched at 817980b33 by its longest fixed runs. Town, person, power and house names, tier nouns and numbers are folded out first. The search covers `src/` and `docs/content` (`git grep -F`).
   - Where no literal matches, the source comes from the reader's own `source` field, or from a rule for the recurring page rows: chain cards, legitimacy chips, NPC house rows, run-together pills and the gap reader.
   - This attributes 469 of the 481 lines. The 12 left are chip fragments.
   - The groups:
     - **corpus**: `RECEIPT_POOLS_DOSSIER_STATE.md` and its generated pools;
     - **data**: the `src/data/**` tables, other than the catalogue;
     - **catalogue**: `institutionalCatalog`, `institutionDesc*`, `institutionBacking`, `institutionLadders`;
     - **code**: by file, with generators and page code together.
2. **Touched at a tip, by script** (`lanes.mjs`). A line is touched at a tip if any of these holds:
   - its literal is gone from that tree;
   - its corpus variant is gone, or its inline declaration tag (`[street · no crisis: under_siege]`) differs from 817980b33;
   - the sentence no longer prints on that lane's render of the same town, and the town is not re-dealt there.
   A changed file alone is reported but not counted: big files change for other reasons.
3. **Read, at the tips.** My twenty seeds were rendered at each of the four tips through each tree's own `OutputContainer`, in the same configuration.
   - **HIGH:** every line that leaves a lane's page in a town whose identity that lane keeps was read against what prints in its place, in the same tab (`replace.mjs`).
   - **MEDIUM:** thirty lines that leave a page were sampled at even intervals and read the same way. 17 were cured (true, or silent with nothing false in their place) and 13 were reworded but still false.
   - The other 40 MEDIUM lines that leave a page are shown as unread. At the sample's rate, about 23 of them would be cured and 17 still false.
   - A line that leaves the page only in a town the lane re-deals is not counted as cured.

## THE TABLE: by owner and rank
| owner | rank | lines | cured on a named lane (read) | left a lane's page, unread | touched, still false | gone only where re-dealt | no lane in flight touches |
|---|---|---|---|---|---|---|---|
| corpus | HIGH | 13 | 10 | 0 | 0 | 0 | 3 |
| corpus | MED | 81 | 8 | 21 | 14 | 1 | 37 |
| data | HIGH | 15 | 3 | 0 | 1 | 3 | 8 |
| data | MED | 82 | 2 | 4 | 0 | 6 | 70 |
| catalogue | HIGH | 2 | 0 | 0 | 0 | 0 | 2 |
| catalogue | MED | 56 | 6 | 7 | 2 | 1 | 40 |
| code | HIGH | 25 | 3 | 0 | 0 | 2 | 20 |
| code | MED | 195 | 1 | 8 | 4 | 12 | 170 |
| unattributed | MED | 12 | 0 | 0 | 0 | 0 | 12 |
| **all** | **HIGH** | **55** | **16** | 0 | **1** | **5** | **33** |
| **all** | **MED** | **426** | **17** | 40 (≈23 cured, ≈17 false at the sample's rate) | **20** | 20 | **329** |

**Cured, by lane.**
- HIGH, all read:
  - the corpus lane (write): 10;
  - the agreement lane (merge): 3, the three "ruling three" headers, now "Who leads X";
  - the data lane (data): 3, the auction house's "persons" twice and a thorp's "lower districts".
- MED, read:
  - the data lane: 8;
  - the corpus lane: 6;
  - one each on the upkeep lane, on upkeep with merge, and on write with data.

**What "touched, still false" is.** These are lines reworded or declared at a tip whose new form is still false:
- the ring note's "one ring" beside rival gangs (on the older bases);
- "short of what it needs" still naming a Cartographer's *guild* that is a workshop;
- a ferry across a river in a coastal village;
- "keeps its defences in working order" beside an impaired fortification chain;
- "None of the luxury goods … comes from the country here" in a town with luxury and gems;
- the services "covers" debug row (HIGH #247), still printed at upkeep and merge.

## The HIGH lines no lane in flight touches (33)
Five more HIGH leave the page only in re-dealt towns; they are listed after these.

| # | town | sentence | the fact it contradicts | file |
|---|---|---|---|---|
| 1 | thorp-calm-1 | The harbour at Chalahau announces itself beyond the last rise: masts above the roofs, gulls wheeling over the quays, and salt bright in the air. | institutions[] has no harbour, quay or port (Subsistence farming, Access to external mill, Burial ground, Dwellings, Water source, Palisade); economic | `src/data/narrativeData.js` |
| 2 | thorp-calm-1 | Craftspeople sit in rows, each row a different trade, each worker deep in their own work. | population 12, tier thorp; no craft house in institutions[] (only "Access to external mill"); Economics: "Subsistence — survival economy" | `src/data/arrivalProse.js` |
| 22 | thorp-calm-1 | Local enforcement is present and responsive. | compound.inst hasWatch/hasMilitia/hasGarrison false; defenseProfile.institutions watch/militia/garrison []; same tab: "There is no watch." and Legal I | `src/generators/safetyProfile.js` |
| 33 | thorp-calm-2 | A raised ceremonial precinct overlooks a broad and busy open plaza. | population 12; institutions[] has no precinct, temple or plaza (only Wayside shrine, Burial ground, Access to parish church) | `src/data/cultureProfiles.js` |
| 36 | thorp-calm-2 | The church wants approval rights over who may trade and when. The village reeve disagrees. | no church in the thorp (institutions[] has "Access to parish church"; World/Faith: "The thorp has no church of its own"); no reeve (only Household eld | `src/data/powerSiblings.js` |
| 55 | thorp-calm-2 | Xochioatl runs on a working balance: the law is present, crime exists, and neither has the run of the thorp. | no watch/militia/court (compound.inst all false); same tab: "Nobody here is paid to keep order.", "If you are wronged at Xochioatl, there is nowhere t | `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` |
| 56 | thorp-calm-2 | Clerical care. Basic wound and disease management. | no clergy: Burial ground "No clergy lives near enough", Wayside shrine "No clergy in residence", World/Faith "no church of its own"; printed because c | `src/domain/display/defenseDisplay.js` |
| 156 | thorp-famine-1 | Local ore feeds the smithy directly. | institutions[] has no smith, smithy or mine (Subsistence farming, Access to external mill, Burial ground, Lord's reeve, Dwellings, Water source). | `src/generators/economy/economicState.js` |
| 161 | thorp-famine-1 | Many households go short, and a bad season would bring real hunger. | stress "famine" forced; foodSecurity.hasFamine true; Crisis: "the children are visibly hungry". The bad season has already come. | `src/components/new/tabs/EconomicsTab.jsx` |
| 190 | hamlet-calm-1 | Stone masons work imported material; the quarrying income notation reflects processing margin only. | no masons or quarry in institutions[] (9 houses, none stone); "income notation reflects processing margin" is generator machinery. | `src/generators/economy/economicState.js` |
| 210 | metropolis-under_siege-1 | Hochfurt counts its mouths and its days of legal every morning, and the people on the walls watch each other as closely as they watch the enemy. | {commodity} slot filled with "legal" (from the export "Legal services"); should be food/grain. | `src/generators/narrativeText.js` |
| 236 | metropolis-under_siege-1 | A working quarry with dressed-stone yards and a crew of masons. | config.nearbyResourcesDepleted includes "stone_quarry"; primaryImports "Dressed stone (local quarry depleted)"; Economics: "Stone quarry (depleted)";  | `src/data/institutionalCatalog.js` |
| 300 | metropolis-under_siege-1 | An active port-based smuggling operation moves contraband through the settlement. The routes are established and the operators have learned the patrol schedules | sentence cut off with an ellipsis; "port-based" in an inland forest town (terrain "forest", tradeRouteAccess "isolated"). | `src/generators/safetyProfile.js` |
| 309 | metropolis-under_siege-1 | Wants Secure enough legal reserves to outlast the blockade | {commodity} filled with "legal" (from "Legal services"). | `src/generators/npcGenerator.js` |
| 310 | metropolis-under_siege-1 | Secret: Has been skimming from the legal reserves to pay a personal debt that predates the siege | {commodity} filled with "legal". | `src/data/stressInstitutionEffects.js` |
| 333 | hamlet-under_siege-1 | One importer now brings in all the grain and has quadrupled the price; the locals are arguing over whether to pay, find another supplier, or take the grain. | Under siege with foodSecurity.importCoverage 0; Economics: "No food comes into Lidostagnum by trade."; Outlook: "its trade route is cut". | `src/generators/economy/foodBalance.js` |
| 358 | hamlet-under_siege-1 | The military command has taken charge of the streets, and more harshly as the food runs down. | compound.inst.hasGarrison/hasMilitia/hasWatch false; defenseProfile.institutions garrison/militia/watch []; Crisis tab: "no military, garrison or watc | `src/generators/safetyProfile.js` |
| 366 | hamlet-plague_onset-1 | Caergarth lives by its forges: the clang of iron is in every lane. | Only "Resident smith (part-time)" ("Tool repair and horseshoeing. Farms on the side."); incomeSources Agricultural Rents 89%, Iron & Metalwork 11%. | `src/data/arrivalProse.js` |
| 421 | metropolis-calm-1 | A working quarry with dressed-stone yards and a crew of masons. Builds the walls and churches of half the region. | config.nearbyResourcesDepleted includes "stone_quarry"; primaryImports "Dressed stone (local quarry depleted)"; stone chain "impaired"; Resources: "De | `src/data/institutionalCatalog.js` |
| 464 | metropolis-calm-1 | The settlement's gates and walls are… | Sentence cut off mid-clause (source sentence continues "checkpoints that smugglers work around..."). | `src/generators/safetyProfile.js` |
| 553 | town-calm-1 | Stone Quarrying Local quarry provides dressed stone to regional builders: reliable income with low transport overhead. | no Stone quarry house: resourceAnalysis.gaps [{chain:"stone",missing:["Stone quarry","Stonemasons' guild"]}]; primaryImports "Cut stone and masonry";  | `src/generators/economy/economicState.js` |
| 628 | city-infiltrated-1 | Work on the animal hides here stops half-way: no tannery or leatherworkers' guild finishes it. | institutions[] "Tanners" (Master Tanner Erene Yorqin, "The making of leather") and "Cobbler's guild"; resourceAnalysis.gaps missing ["Tannery","Leathe | `src/domain/display/validationOnPage.js` |
| 680 | city-wartime-1 | A part from the wizard's tower has gone missing, and the black market has it; the fence wants a price the wizard will not pay. | economicState.compound.inst.hasWizardTower=false, hasBlackMarket=false; magic house is 'Mages' guild' | `src/generators/safetyProfile.js` |
| 715 | city-wartime-1 | An active overland smuggling operation moves contraband through the settlement. The routes are established and the operators have learned the patrol schedules.  | the sentence is cut off mid-clause with an ellipsis; source sentence continues 'checkpoints that smugglers work around...' | `src/generators/safetyProfile.js` |
| 854 | town-under_siege+famine-1 | The siege has entered its second week; Military Council controls the rationing and the gates, which means they control everything else too, for now. | economicState.compound.inst.hasWalls=false, hasGates=false; Defense tab: "Unfortified. No perimeter walls." and "You can walk into Cobapan from any di | `src/generators/narrativeText.js` |
| 891 | city-famine-1 | Stormthorpe is two bad weeks from genuine starvation; Military/Guard controls the remaining reeds reserves and is not discussing it openly. | "reeds" filled into the food-commodity slot; the reserves (City granaries) are held by Knud Leidolfsson of Arcane Council (stress.cast.levers), not Mi | `src/generators/narrativeText.js` |
| 911 | city-famine-1 | Work on the medicinal herbs here stops half-way: no apothecary or alchemist shop finishes it. | institutions[] has "Apothecary district" (Apothecary Hlíf Amlethsson, service Herbal remedies) | `src/domain/display/validationOnPage.js` |
| 920 | city-famine-1 | Secret: Controls a hidden cache of reeds reserves that could feed the settlement for two more weeks | {commodity} slot filled with "reeds" (a thatch export), which feeds nobody | `src/data/stressInstitutionEffects.js` |
| 921 | city-famine-1 | Secret: Is receiving reeds shipments through a covert route and selling them at triple the official price after dark | {commodity} slot filled with "reeds" | `src/data/stressInstitutionEffects.js` |
| 963 | town-under_siege-1 | Lagomagnum counts its mouths and its days of crafts every morning, and the people on the walls watch each other as closely as they watch the enemy. | Slot {commodity} filled with 'crafts' instead of a food good; record foodSecurity.storageNote '6.3 months buffer' of grain (page: 'six months of grain | `src/generators/narrativeText.js` |
| 964 | town-under_siege-1 | Lagomagnum's market lives off through-traffic. | stress.type 'under_siege' ('nothing comes in by road'); economicState.situationDesc 'The market is shut and the caravans have stopped coming.' | `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` |
| 990 | town-under_siege-1 | Its Potter cannot work without clay, and the country around the town produces none, so the town buys from outside or the work stops. | No Potter in institutions; gap is {institution:'Brickmaker', chain:'clay'}; under siege nothing can be bought from outside. | `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` |
| 995 | town-under_siege-1 | Lagomagnum grows about a quarter of what it eats, and carts bring in a little of the rest. | foodSecurity.importPct 0, importCoverage 0; Outlook 'The siege has cut every road in'. | `src/components/new/tabs/EconomicsTab.jsx` |

**Gone only in towns the lane re-deals (5, not counted as cured):**

| # | town | sentence | file | re-dealt on |
|---|---|---|---|---|
| 61 | metropolis-politically_fractured-1 | Military/GuardVigilantesThieves' Guild | `src/data/historyData.js` | merge |
| 128 | metropolis-politically_fractured-1 | Secret: On the payroll of the thieves' guild as a silent informant | `src/data/npcData.js` | merge |
| 200 | hamlet-calm-1 | The ruling three of Headman's Authority | `src/components/new/tabs/WhoRunsThisTownPanel.jsx` | merge |
| 324 | hamlet-under_siege-1 | The siege has entered its second week; Priestly Guidance controls the rationing and the gates, which means they control  | `src/generators/narrativeText.js` | merge |
| 720 | city-wartime-1 | Secret: On the payroll of the thieves' guild as a silent informant | `src/data/npcData.js` | upkeep, merge |

**The HIGH lines that are cured or touched (17):**

| # | town | sentence | status | lane |
|---|---|---|---|---|
| 17 | thorp-calm-1 | The fish in Chalahau's country is worked all the way through: the ground gives it, Fishmonger finishes it, and | cured | write |
| 21 | thorp-calm-1 | The ruling three of Headman's Authority | cured | merge |
| 25 | thorp-calm-1 | Chalahau is walled, and every arrival goes through a gate and into the gate tally; trouble can only get in whe | cured | write |
| 54 | thorp-calm-2 | The ruling three of Elder Council | cured | merge |
| 172 | thorp-famine-1 | The ruling three of Feudal Stewardship | cured | merge |
| 178 | thorp-famine-1 | Waters rose with little warning and reshaped the lower districts, drowning livelihoods and redrawing who owned | cured | data |
| 247 | metropolis-under_siege-1 | Needs GrainSupply route severed. Operating at minimal capacity or shut down.· covers Grain, Timber, Wool / fla | touched, still false | upkeep, merge |
| 283 | metropolis-under_siege-1 | Hochfurt's Garrison stands idle: its supply has failed upstream, though the building and the skilled hands are | cured | write |
| 340 | hamlet-under_siege-1 | Plenty passes through Lidostagnum, and little of it stops. | cured | write |
| 344 | hamlet-under_siege-1 | A merchant who comes to Lidostagnum for one thing usually leaves with two or three. | cured | write |
| 417 | metropolis-calm-1 | A formal house for the sale of costly goods: estates, livestock, art, and now and then persons. | cured | data |
| 451 | metropolis-calm-1 | Vatannuur's Garrison stands idle: its supply has failed upstream, though the building and the skilled hands ar | cured | write |
| 683 | city-wartime-1 | A formal house for the sale of costly goods: estates, livestock, art, and now and then persons. | cured | data |
| 805 | village-calm-1 | Carts bring Langenbrunn what its workshops need, and carry the worked master-crafted plate armour away again. | cured | write |
| 867 | town-under_siege+famine-1 | Cobapan's market sells little, though the port is busy; most of the traffic does not stop, and the traders her | cured | write |
| 983 | town-under_siege-1 | Plenty passes through Lagomagnum, and little of it stops. The town is poor, and its people say so to anyone wh | cured | write |
| 1056 | town-occupied-1 | Polano's Town watch stands idle: its supply has failed upstream, though the building and the skilled hands are | cured | write |

## Where the untouched debt sits (HIGH / MED, the top files)
| HIGH | MED | owner :: file |
|---|---|---|
| 6 | 5 | code :: `src/generators/safetyProfile.js`: the safety profile's enforcement lines; cut-off smuggling and gates sentences; a "military command" in a hamlet with no force; "Local enforcement is present" in a thorp with no watch |
| 4 | 4 | code :: `src/generators/narrativeText.js`: the crisis slot filled with an export ("days of legal", "reeds reserves", "days of crafts"); "controls … the gates" where there are none |
| 3 | 35 | corpus :: `RECEIPT_POOLS_DOSSIER_STATE.md`: through-traffic under a siege; "the law is present" in a thorp with no law; "Its Potter" for a Brickmaker |
| 3 | 20 | code :: `src/generators/economy/economicState.js`: income lines naming a smithy, quarry or masons the roster lacks (most are section 7, ruled to the agreement lane) |
| 3 | 3 | data :: `src/data/stressInstitutionEffects.js`: NPC secrets with the crisis slot filled by an export |
| 2 | 40 | code :: `src/components/new/tabs/EconomicsTab.jsx`: chain cards "✓ Running" against the record; pills of goods not produced; "carts bring in" under a siege |
| 2 | 16 | catalogue :: `src/data/institutionalCatalog.js`: "A working quarry" where the quarry is depleted; catalogue ranges in rows |
| 2 | 1 | code :: `src/domain/display/validationOnPage.js`: "no tannery … finishes it" beside Tanners; "no apothecary … finishes it" beside an Apothecary district (**this file is held by the first leaves lane**) |
| 1 | 5 | code :: `src/domain/display/defenseDisplay.js`: "Clerical care" with no clergy (also the first leaves lane's file) |
| 2 | 6 | data :: `src/data/arrivalProse.js`: forges in every lane of a hamlet; rows of craftspeople in a thorp of 12 |

Untouched MEDIUM by mechanism:

| Mechanism | Lines |
|---|---|
| internal text | 74 |
| a house the town lacks | 61 |
| two homes that disagree | 58 |
| a resource or chain state | 34 |
| normal times under a crisis | 32 |
| a ruler, power or threat | 18 |
| a size | 11 |
| a figure | 11 |
| broken text | 9 |
| denies a house or force | 9 |
| a count | 7 |
| other | 5 |

## What I did not measure
- I read 30 of the 70 MEDIUM lines that leave a page. The other 40 are estimated at the sample's rate.
- For the 329 untouched MEDIUM lines, I did not check whether a lane's changed file meant to reach them. A changed file alone is not counted as a cure.
- `lane/powers-follow-up-2026-11-13` is not on origin.
- The lanes' merged tree was not built. A line cured on one lane may print again where the lanes compose; that is the round's to judge.
