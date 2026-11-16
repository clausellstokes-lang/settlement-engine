# BAR5-AUDIT-B · HAND-BACK · laws 2, 3 and 5 (seat B)

**STATUS: FINAL.** Tip read: `9867b4b17` (the joined line, `lane/join-2026-11-14`). Nothing under `src/` changed, no test file was added, and nothing is cured.

## How to run it again

- Render with PAGE-COPY, in a scratch tree that has had `npm ci`: `HOLDERS=<PAGE-COPY>/holders.tipA.json sh <PAGE-COPY>/census3.sh <tree> <out> 4 --seeds <seeds> --count-only`.
- Laws 2 and 3: `node docs/chair/2026-11-16/bar5/AUDIT/runB.mjs <out> <result.json> [<SECOND-CHECK.final72.json>]`. Add `GONE=<SECOND-CHECK.final75.json>` for the read before.
- Writers: `node …/traceB.mjs <result.json> <out> <tree> <PAGE-COPY> <scratch>` runs PAGE-COPY's own `writers2.mjs`.
- Tables: `node …/reportB.mjs <result.traced.json> <label>`.
- Precision draw: `node …/sampleB.mjs <result.json> <out> <draw.json> 20 <seed>`.
- Law 5: `node …/law5-inventory.mjs <tree> <out.json> <SECOND-CHECK.final72.json>`. This is static; no town is born.
- The detectors (`tests/helpers/pageLaws/`):
  - `pageB.mjs` reads a dump into cards, Services entries and chains, and decides whether a row is marked.
  - `law2.mjs` and `law3.mjs` are the laws.
  - Each law is a pure function over one town (`readTown(dump, record)`), returning `{ law, rule, town, tab, i, line, against: { tab, i, line }, why }`.
- What they read:
  - The dossier tabs only. The PDF and the journal are copies and are not counted twice.
  - LAW 2 skips Plot Hooks, Rumours, History, Notes and NPC `Secret:` lines: a hook, a rumour or the past states its own fact.
  - LAW 2 strips house names and people's names before it reads, since "Pilgrim Fuchs" is a man.
- What counts as a mark:
  - a lead of `Stopped by` / `Curtailed by` / `Scarce in` / `Short of`;
  - a chip's `(stopped)` / `(curtailed)` / `(scarce)` / `(short)`;
  - a card or entry headed `Impaired`;
  - a chain marked Impaired, Stopped or Failed, or printing "Normally yields".
  - `Vulnerable` is a state word, not a mark (the second check's reading at C7834).
- Every rule fires only when the page itself prints the reach it names. That sentence is the instance's `against`.

## 1. THE CONTROLS

On the sixty read towns (`bar0-<shape>-rand-21..26`, rendered at this tip):
- **Every STANDS control of LAW 2 (12) and of LAW 3 (10) is found.**
- **No EXPLAINED control of LAW 2 (7) is found.**
- The four WEAK controls are not found: C17069 and C7834 of LAW 2, C6320 and C24243 of LAW 3.
  - C7834 ("Pilgrims crowd the road in") is a matter of degree in a war, and no rule reads degree.
  - C17069 is a calm-times tone.
  - C6320 and C24243 hang on a source label ("herb gathering areas").

The read before (`SECOND-CHECK.final75.json`, 40 STANDS): **0 are still found** at this tip.
- Seven of the 40 sentences still print.
- The three of LAW 2's shape are now marked: C0543 (`Curtailed by the siege.`), C6632 (`Scarce in the famine.`) and C19622 (`Stopped by the siege.`).
- The other four (C7336, C24951, C30692, C31074) belong to other laws.

The controls were checked again after each narrowing (section 3), and every STANDS control is still found.

| law | kind | id | town | tab | found | by rule |
|---|---|---|---|---|---|---|
| L2 | STANDS | C0333 | city-under_siege+famine-rand-24 | Systems/Institutions | found | L2.siege.abroad L2.siege.cutgood |
| L2 | STANDS | C0927 | city-under_siege+famine-rand-24 | Systems/Services | found | L2.siege.cutgood |
| L2 | STANDS | C5441 | city-under_siege+famine-rand-26 | Systems/Institutions | found | L2.siege.abroad |
| L2 | STANDS | C0350 | city-under_siege+famine-rand-24 | Systems/Institutions | found | L2.siege.abroad |
| L2 | STANDS | C3223 | city-under_siege+famine-rand-25 | Systems/Institutions | found | L2.siege.abroad |
| L2 | STANDS | C5452 | city-under_siege+famine-rand-26 | Systems/Institutions | found | L2.siege.abroad |
| L2 | STANDS | C3231 | city-under_siege+famine-rand-25 | Systems/Institutions | found | L2.famine.meat |
| L2 | STANDS | C8174 | city-wartime-rand-24 | Systems/Institutions | found | L2.war.iron |
| L2 | STANDS | C8475 | city-wartime-rand-24 | Systems/Institutions | found | L2.war.animals |
| L2 | STANDS | C11307 | city-wartime-rand-25 | Summary/Plot Hooks | found | L2.war.iron |
| L2 | STANDS | C43575 | village-famine-rand-26 | Systems/Institutions | found | L2.famine.work |
| L2 | STANDS | C42116 | village-famine-rand-24 | Systems/Defense | found | L2.law.collapsed |
| L2 | EXPLAINED | C2960 | city-under_siege+famine-rand-25 | Summary/Overview | not found | - |
| L2 | EXPLAINED | C5442 | city-under_siege+famine-rand-26 | Systems/Institutions | not found | - |
| L2 | EXPLAINED | C17210 | hamlet-under_siege-rand-24 | Systems/Institutions | not found | - |
| L2 | EXPLAINED | C17771 | hamlet-under_siege-rand-25 | Systems/Institutions | not found | - |
| L2 | EXPLAINED | C18377 | hamlet-under_siege-rand-26 | Systems/Institutions | not found | - |
| L2 | EXPLAINED | C5621 | city-under_siege+famine-rand-26 | Systems/Institutions | not found | - |
| L2 | EXPLAINED | C17209 | hamlet-under_siege-rand-24 | Systems/Institutions | not found | - |
| L2 | WEAK | C17069 | hamlet-under_siege-rand-24 | Summary/Overview | not found | - |
| L2 | WEAK | C7834 | city-wartime-rand-24 | Summary/Overview | not found | - |
| L3 | STANDS | C3874 | city-under_siege+famine-rand-25 | Systems/Economics | found | L3.outputs |
| L3 | STANDS | C3911 | city-under_siege+famine-rand-25 | Systems/Economics | found | L3.outputs |
| L3 | STANDS | C17290 | hamlet-under_siege-rand-24 | Systems/Economics | found | L3.foodLineStopped |
| L3 | STANDS | C17893 | hamlet-under_siege-rand-25 | Systems/Economics | found | L3.chainOverStopped |
| L3 | STANDS | C42011 | village-famine-rand-24 | Systems/Resources | found | L3.failedFood |
| L3 | STANDS | C42947 | village-famine-rand-25 | Systems/Resources | found | L3.failedFood |
| L3 | STANDS | C31652 | town-calm-rand-24 | Systems/Economics | found | L3.needed |
| L3 | STANDS | C39608 | village-calm-rand-24 | Systems/Economics | found | L3.halfway |
| L3 | STANDS | C37887 | town-occupied-rand-25 | Systems/Resources | found | L3.halfway |
| L3 | STANDS | C39597 | village-calm-rand-24 | Systems/Economics | found | L3.foodModel |
| L3 | WEAK | C6320 | city-under_siege+famine-rand-26 | Systems/Resources | not found | - |
| L3 | WEAK | C24243 | metropolis-calm-rand-25 | Systems/Resources | not found | - |

## 2. THE COUNTS

| population | LAW 2 | LAW 3 | towns with any |
|---|---|---|---|
| the sixty read towns | 36 instances in 12 towns | 24 instances in 19 towns | 24 of 60 |
| the census's 720 (PAGE-COPY `seeds.txt`) | 83 instances in 48 towns | 211 instances in 134 towns | 169 of 720 |
| the fresh 300 (`seeds.fresh300.txt`) | 120 instances in 51 towns | 92 instances in 66 towns | 91 of 300 |

How the populations differ:
- The 720 are the census's mix: 15 crisis kinds, and 478 of the 720 towns hold one.
- The fresh 300 are the bar's ten shapes. Half are under a crisis, and siege, famine and war are frequent.
- So LAW 2 runs deeper in the 300, and the 720 holds more of LAW 3's calm-time faults: half-way chains and idle vintners.
- Precision was judged on the 720 only.

The rules (each one's reach, read off the page itself):
- **L2.siege.abroad:** a siege, and "nothing comes in by road" or "Trade by road, gate and water has stopped". An unmarked line names caravans, travellers, pilgrims, or goods "from abroad".
- **L2.siege.cutgood:** a siege, and "depend on medicinal herbs from outside, which the siege has cut off". An unmarked row offers medicines.
- **L2.famine.meat:** a famine whose herds failed, or a town with no pastoral chain, under siege, with nothing coming in. An unmarked row offers meat or dairy.
- **L2.famine.grain:** "✗ Failed this year · Grain". An unmarked row offers grain, flour or bread.
- **L2.famine.work:** "No one can earn a normal living while the famine lasts". An unmarked line promises steady work.
- **L2.war.iron:** "War has taken the iron". The smiths' Repairs, Tool manufacture, Weapon smithing or ironwork, unmarked.
- **L2.war.animals:** "Every sound animal … has a receipt", or "the horses … are old, or lame". Horse or cart hire, unmarked.
- **L2.law.collapsed:** "Law & order · Collapsed". An unmarked line says theft is answered.
- **L3.outputs:** a chain printed Running or Operational lists, as an output or export, a service the page marks stopped.
- **L3.chainOverStopped:** a chain printed Running or Operational, every one of whose houses has every service stopped.
- **L3.failedFood:** "✗ Failed this year · X", and X among the commodities available or produced locally.
- **L3.foodLineStopped:** the food line puts on the table a catch whose fishing the page marks stopped.
- **L3.foodModel:** the food line names game or fish as the table's own food, beside a Farmland house selling its own grain.
- **L3.needed:** "Needed, and not brought in: X" and "that work stands idle", with an unmarked craft house that works X.
- **L3.halfway:** the record's gap says no final goods can be made, and the page names the material ("Partial · X" with "semi-finished", or "Work on the X here stops half-way"). Yet a chain on X prints the finished goods of the missing house.

### The sixty: by law and rule

| law · rule | towns | instances |
|---|---|---|
| **L2** | **12** | **36** |
| **L3** | **19** | **24** |
| L2.famine.meat | 2 | 4 |
| L2.famine.work | 1 | 1 |
| L2.law.collapsed | 3 | 3 |
| L2.siege.abroad | 6 | 13 |
| L2.siege.cutgood | 1 | 5 |
| L2.war.animals | 1 | 2 |
| L2.war.iron | 2 | 8 |
| L3.chainOverStopped | 2 | 2 |
| L3.failedFood | 5 | 5 |
| L3.foodLineStopped | 1 | 1 |
| L3.foodModel | 2 | 2 |
| L3.halfway | 3 | 3 |
| L3.needed | 4 | 4 |
| L3.outputs | 5 | 7 |

### The sixty: the thirty commonest distinct lines of L2 (23 distinct)

| towns | rule | line | writer |
|---|---|---|---|
| 3 | L2.siege.abroad | A cluster of apothecaries pressed close enough that competition drives them apart in trade, some to surgery, some to herb-work, some to medi | `src/data/institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS` |
| 3 | L2.siege.abroad | Guild bowyers and fletchers selling arrows by the sheaf, special broadheads, and composite bows to order, supplying the watch, the garrison, | `src/data/institutionDescVariants.js :: PAIRS` |
| 3 | L2.law.collapsed | A thief is known by name within a day, and everyone shuns them until they make it right. | `src/generators/safetyProfile.js :: NO_WATCH_SMALL` |
| 2 | L2.siege.abroad | Serves merchants, military, and travelers needing fresh mounts. | `src/data/institutionalCatalog.js :: INSTITUTION_FAMILIES.shared` |
| 2 | L2.famine.meat | Services · Fresh meat · Offal and by-products | `src/data/institutionServices.js :: INSTITUTION_SERVICES.Offal and by-products` |
| 2 | L2.famine.meat | Fresh meat | `(untraced)` |
| 2 | L2.siege.abroad | The watch, the garrison, and the caravans buy here. | `src/data/institutionDescVariants.js :: PAIRS` |
| 2 | L2.war.iron | Repairs | `(untraced)` |
| 2 | L2.war.iron | Tool manufacture | `src/data/institutionServices.js :: INSTITUTION_SERVICES.Tool manufacture` |
| 2 | L2.war.iron | Weapon smithing | `src/data/institutionServices.js :: INSTITUTION_SERVICES.Weapon smithing` |
| 1 | L2.siege.abroad | Personal protection for merchants, officials, and travelers. | `src/data/institutionServices.js :: INSTITUTION_SERVICES.Bodyguard service` |
| 1 | L2.siege.cutgood | A cluster of apothecaries pressed close enough that competition drives them apart in trade, some to surgery, some to herb-work, some to medi | `src/data/institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS` |
| 1 | L2.siege.cutgood | Services · Herbal remedies · Specialist compounds | `src/data/institutionServices.js :: INSTITUTION_SERVICES.Specialist compounds` |
| 1 | L2.siege.cutgood | Herbal remedies | `src/data/institutionServices.js :: INSTITUTION_SERVICES.Herbal remedies` |
| 1 | L2.siege.cutgood | Rare medications and treatments available through district-wide sourcing. | `src/data/institutionServices.js :: INSTITUTION_SERVICES.Specialist compounds` |
| 1 | L2.siege.cutgood | Apothecary & Alchemy Remedies and simple preparations, made and sold here: a modest trade. | `src/generators/economy/incomeLineSiblings.js :: REMEDIES_LINE` |
| 1 | L2.siege.abroad | Stabling, horse-dealing, and farriery gathered in one quarter, serving merchants, soldiers, and travellers in want of a fresh mount. | `src/data/institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS` |
| 1 | L2.war.iron | Services · Repairs · Tool manufacture · Weapon smithing | `src/data/institutionServices.js :: INSTITUTION_SERVICES.Tool manufacture` |
| 1 | L2.war.animals | Services · Horse hire | `(untraced)` |
| 1 | L2.war.animals | Horse hire | `(untraced)` |
| 1 | L2.war.iron | Services · Horseshoeing · Repairs · Tool manufacture · Weapon smithing | `src/data/institutionServices.js :: INSTITUTION_SERVICES.Tool manufacture` |
| 1 | L2.siege.abroad | Rents animals to travellers and merchants who need load-carrying capacity for the road. | `src/data/institutionalCatalog.js :: INSTITUTION_FAMILIES.shared` |
| 1 | L2.famine.work | Since no one goes unshod, the work never dries up. | `src/data/institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS` |

### The sixty: L2 by writer file (the false line) and the file holding the fact it should have read

| writer file | rule | towns | instances | the fact is in |
|---|---|---|---|---|
| `src/data/institutionServices.js` | L2.war.iron | 2 | 6 | src/generators/economy/outlookHookSiblings.js :: WAR_IRON_HOOK against crisisStoppedRow.js :: STOPPING_CRISES (no wartime) |
| `src/data/institutionDescVariants.js` | L2.siege.abroad | 5 | 5 | src/data/crisisDependence.js (HOUSE_/SERVICE_DEPENDENCE: no `travellers`/`goods` on the row) via src/domain/display/crisisStoppedRow.js :: rowStoppedBy |
| `src/data/institutionDescColour.js` | L2.siege.abroad | 3 | 4 | src/data/crisisDependence.js (HOUSE_/SERVICE_DEPENDENCE: no `travellers`/`goods` on the row) via src/domain/display/crisisStoppedRow.js :: rowStoppedBy |
| `src/data/institutionalCatalog.js` | L2.siege.abroad | 3 | 3 | src/data/crisisDependence.js (HOUSE_/SERVICE_DEPENDENCE: no `travellers`/`goods` on the row) via src/domain/display/crisisStoppedRow.js :: rowStoppedBy |
| `src/data/institutionServices.js` | L2.siege.cutgood | 1 | 3 | src/domain/display/chainNeedShown.js :: chainNeedLine (the herbs "from outside, cut off") against src/data/crisisDependence.js SERVICE_DEPENDENCE ("Specialist compounds", "Herbal remedies": no `imported input`) |
| `src/generators/safetyProfile.js` | L2.law.collapsed | 3 | 3 | the Law & order band (src/domain/causalState.js law_order) against src/generators/safetyProfile.js :: NO_WATCH_SMALL (drawn on `watch` only) |
| `src/data/institutionServices.js` | L2.famine.meat | 2 | 2 | economicState.foodSecurity (src/generators/economy/foodBalance.js) read by crisisStoppedRow.js :: stoppedBy (the failed source only) |
| `(untraced)` | L2.famine.meat | 2 | 2 | economicState.foodSecurity (src/generators/economy/foodBalance.js) read by crisisStoppedRow.js :: stoppedBy (the failed source only) |
| `(untraced)` | L2.war.iron | 2 | 2 | src/generators/economy/outlookHookSiblings.js :: WAR_IRON_HOOK against crisisStoppedRow.js :: STOPPING_CRISES (no wartime) |
| `(untraced)` | L2.war.animals | 1 | 2 | src/data/narrativeData.js :: STRESS_DESCS.wartime / the arrival scene's war senses against crisisStoppedRow.js :: STOPPING_CRISES (no wartime) |
| `src/data/institutionServices.js` | L2.siege.abroad | 1 | 1 | src/data/crisisDependence.js (HOUSE_/SERVICE_DEPENDENCE: no `travellers`/`goods` on the row) via src/domain/display/crisisStoppedRow.js :: rowStoppedBy |
| `src/data/institutionDescColour.js` | L2.siege.cutgood | 1 | 1 | src/domain/display/chainNeedShown.js :: chainNeedLine (the herbs "from outside, cut off") against src/data/crisisDependence.js SERVICE_DEPENDENCE ("Specialist compounds", "Herbal remedies": no `imported input`) |
| `src/generators/economy/incomeLineSiblings.js` | L2.siege.cutgood | 1 | 1 | src/domain/display/chainNeedShown.js :: chainNeedLine (the herbs "from outside, cut off") against src/data/crisisDependence.js SERVICE_DEPENDENCE ("Specialist compounds", "Herbal remedies": no `imported input`) |
| `src/data/institutionDescColour.js` | L2.famine.work | 1 | 1 | src/data/stressTypes.js :: STRESS_TYPE_MAP.famine (viabilityNote) against src/data/institutionDescColour.js (the line declared colour) |

### The sixty: the thirty commonest distinct lines of L3 (18 distinct)

| towns | rule | line | writer |
|---|---|---|---|
| 3 | L3.outputs | Armed escort · Monster hunting services · Dungeon clearance | `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` |
| 3 | L3.outputs | Armed escort · Mercenary hire · Training services | `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` |
| 3 | L3.needed | Vintner · Crafts / Presses and ages wine from local grapes or imported must, in any year that either reaches the cellar. What it makes is so | `src/data/institutionalCatalog.js :: INSTITUTION_FAMILIES.shared` |
| 1 | L3.failedFood | Open Grazing Land · livestock · wool · dairy · animal hides · Strategic Crossroads · trade access · Stone quarry · stone · Iron Ore Deposits | `src/data/resourceData.js :: RESOURCE_DATA.coal_deposits` |
| 1 | L3.outputs | Lodging · Meals and drink | `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` |
| 1 | L3.chainOverStopped | Taverns & Social Life · Entertainment & culture○ Operational | `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` |
| 1 | L3.foodLineStopped | What each holding grows goes to its own table; beyond that, what it puts on the table itself is the day's catch. | `src/domain/foodways.js :: FRAMES` |
| 1 | L3.chainOverStopped | Faith & Worship · Religion & civic✓ Running | `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` |
| 1 | L3.needed | Smelter · Crafts / Charcoal furnaces for reducing raw ore to refined metal whenever ore can be had, cast in bars for whoever will buy them. | `src/data/institutionDescVariants.js :: DESC_VARIANT_SIBLINGS` |
| 1 | L3.halfway | Herbal remedies · Potions and elixirs | `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` |
| 1 | L3.halfway | Boots and shoes · Saddles and harness · Leather armour | `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` |
| 1 | L3.foodModel | What it puts on the table itself is the hunters' game. Fermentation, pickling, and drying stretch the harvest through winter. | `src/domain/foodways.js :: FRAMES` |
| 1 | L3.foodModel | What it puts on the table itself is the hunters' game. | `src/domain/foodways.js :: FRAMES` |
| 1 | L3.halfway | Quality tools and weapons · Advanced weapons and armor · Master-crafted weapons | `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` |
| 1 | L3.failedFood | Open Grazing Land · livestock · wool · dairy · animal hides · Ancient Grove · medicinal herbs · honey | `src/data/resourceData.js :: RESOURCE_DATA.grazing_land` |
| 1 | L3.failedFood | Wild Foraging Areas · honey · medicinal herbs · Hunting Grounds · game meat · animal hides · furs · Coal or Peat Deposits · coal · Ancient G | `src/data/resourceData.js :: RESOURCE_DATA.grain_fields` |
| 1 | L3.failedFood | River Fisheries · fish · Extensive Grain Fields · grain · flour · Hot Springs / Healing Waters | `src/data/resourceData.js :: RESOURCE_DATA.hot_springs` |
| 1 | L3.failedFood | Ancient Grove · medicinal herbs · honey · Precious Metal Veins · luxury · Open Grazing Land · livestock · wool · dairy · animal hides | `src/data/resourceData.js :: RESOURCE_DATA.precious_metals` |

### The sixty: L3 by writer file (the false line) and the file holding the fact it should have read

| writer file | rule | towns | instances | the fact is in |
|---|---|---|---|---|
| `src/components/new/tabs/EconomicsTab.jsx` | L3.outputs | 5 | 7 | crisisStoppedRow.js (the service rows' marks) against src/domain/display/chainStateShown.js :: chainCrisisStateShown (the chain's state) — two deciders for one service |
| `src/data/resourceData.js` | L3.failedFood | 5 | 5 | foodRecord.failedSource against src/components/new/tabs/ResourcesTab.jsx (commodities from src/data/resourceData.js) and the Trade Profile's produced-locally list |
| `src/data/institutionalCatalog.js` | L3.needed | 3 | 3 | resourceAnalysis.imports.critical (the "Needed, and not brought in" line) against crisisStoppedRow.js :: rowShortOf / housesShortOfInput (no "Short of" on the craft) |
| `src/components/new/tabs/EconomicsTab.jsx` | L3.halfway | 3 | 3 | resourceAnalysis.gaps "Cannot produce final goods" (src/generators/resourceGenerator.js :: evaluateInstitutionDeps) against the chain's outputs (src/generators/computeActiveChains.js) |
| `src/components/new/tabs/EconomicsTab.jsx` | L3.chainOverStopped | 2 | 2 | crisisStoppedRow.js (every service of the via houses stopped) against chainStateShown.js :: chainCrisisStateShown |
| `src/domain/foodways.js` | L3.foodModel | 2 | 2 | economicState.foodSecurity.foodSources (src/generators/economy/foodBalance.js, which leaves out the Farmland house) printed by src/domain/foodways.js :: foodwaysLineOf |
| `src/domain/foodways.js` | L3.foodLineStopped | 1 | 1 | crisisStoppedRow.js (the fishing marked stopped) against src/domain/foodways.js :: foodwaysLineOf |
| `src/data/institutionDescVariants.js` | L3.needed | 1 | 1 | resourceAnalysis.imports.critical (the "Needed, and not brought in" line) against crisisStoppedRow.js :: rowShortOf / housesShortOfInput (no "Short of" on the craft) |


### The 720: by law and rule

| law · rule | towns | instances |
|---|---|---|
| **L2** | **48** | **83** |
| **L3** | **134** | **211** |
| L2.famine.work | 1 | 1 |
| L2.law.collapsed | 29 | 29 |
| L2.siege.abroad | 12 | 24 |
| L2.siege.cutgood | 3 | 15 |
| L2.war.animals | 2 | 5 |
| L2.war.iron | 4 | 9 |
| L3.chainOverStopped | 3 | 3 |
| L3.failedFood | 15 | 20 |
| L3.foodLineStopped | 2 | 2 |
| L3.foodModel | 13 | 13 |
| L3.halfway | 56 | 112 |
| L3.needed | 43 | 43 |
| L3.outputs | 15 | 18 |

### The 720: the thirty commonest distinct lines of L2 (28 distinct)

| towns | rule | line | writer |
|---|---|---|---|
| 29 | L2.law.collapsed | A thief is known by name within a day, and everyone shuns them until they make it right. | `src/generators/safetyProfile.js :: NO_WATCH_SMALL` |
| 5 | L2.siege.abroad | Personal protection for merchants, officials, and travelers. | `src/data/institutionServices.js :: INSTITUTION_SERVICES.Bodyguard service` |
| 4 | L2.siege.abroad | Stabling, horse-dealing, and farriery gathered in one quarter, serving merchants, soldiers, and travellers in want of a fresh mount. | `src/data/institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS` |
| 3 | L2.siege.abroad | A cluster of apothecaries pressed close enough that competition drives them apart in trade, some to surgery, some to herb-work, some to medi | `src/data/institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS` |
| 3 | L2.siege.abroad | Guild bowyers and fletchers selling arrows by the sheaf, special broadheads, and composite bows to order, supplying the watch, the garrison, | `src/data/institutionDescVariants.js :: PAIRS` |
| 3 | L2.siege.abroad | Serves merchants, military, and travelers needing fresh mounts. | `src/data/institutionalCatalog.js :: INSTITUTION_FAMILIES.shared` |
| 3 | L2.siege.cutgood | Services · Herbal remedies · Specialist compounds | `src/data/institutionServices.js :: INSTITUTION_SERVICES.Specialist compounds` |
| 3 | L2.siege.cutgood | Herbal remedies | `src/data/institutionServices.js :: INSTITUTION_SERVICES.Herbal remedies` |
| 3 | L2.siege.cutgood | Rare medications and treatments available through district-wide sourcing. | `src/data/institutionServices.js :: INSTITUTION_SERVICES.Specialist compounds` |
| 3 | L2.war.iron | Services · Horseshoeing · Repairs · Tool manufacture · Weapon smithing | `src/data/institutionServices.js :: INSTITUTION_SERVICES.Tool manufacture` |
| 3 | L2.war.iron | Reforge broken tools, re-edge blades, mend ironwork. | `src/data/institutionServices.js :: INSTITUTION_SERVICES.Repairs` |
| 2 | L2.siege.abroad | The watch, the garrison, and the caravans buy here. | `src/data/institutionDescVariants.js :: PAIRS` |
| 2 | L2.siege.abroad | Enough to resupply the caravans and outfit their guards. | `src/data/institutionDescVariants.js :: PAIRS` |
| 2 | L2.war.animals | Services · Horse hire · Livery and boarding | `src/data/institutionServices.js :: INSTITUTION_SERVICES.Livery and boarding` |
| 2 | L2.war.animals | Horse hire | `(untraced)` |
| 1 | L2.siege.cutgood | A cluster of apothecaries pressed close enough that competition drives them apart in trade, some to surgery, some to herb-work, some to medi | `src/data/institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS` |
| 1 | L2.siege.cutgood | Apothecary & Alchemy Remedies and simple preparations, made and sold here: a modest trade. | `src/generators/economy/incomeLineSiblings.js :: REMEDIES_LINE` |
| 1 | L2.famine.work | Since no one goes unshod, the work never dries up. | `src/data/institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS` |
| 1 | L2.siege.cutgood | Some focus on chirurgery, others on herbal preparations, others on imported medicines. | `src/data/institutionalCatalog.js :: INSTITUTION_FAMILIES.shared` |
| 1 | L2.siege.cutgood | Apothecary & Alchemy Remedies and preparations are made here, but few, while the herbs and reagents they need run short. | `src/generators/economy/incomeLineSiblings.js :: REMEDIES_SHORT_LINE` |
| 1 | L2.siege.abroad | A claimed miracle or relic drew pilgrims in numbers the settlement was never built to hold, and the flood of coin and strangers changed it f | `src/data/historyData.js :: HISTORICAL_EVENTS_DATA.severity` |
| 1 | L2.siege.abroad | Supplies the watch, the garrison, and the caravans. | `src/data/institutionalCatalog.js :: INSTITUTION_FAMILIES.shared` |
| 1 | L2.siege.cutgood | One leans to chirurgery, another to herbal preparations, a third to imported medicines. | `src/data/institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS` |
| 1 | L2.siege.cutgood | Herbalist & Apothecary Herbal remedies, minor alchemical preparations, and potion sales. | `src/generators/economy/incomeLineSiblings.js :: ALCHEMIST_SUPPLEMENTS_LINE` |
| 1 | L2.war.animals | Stabling, horse-dealing, and farriery gathered in one quarter, serving merchants, soldiers, and travellers in want of a fresh mount. | `src/data/institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS` |
| 1 | L2.war.iron | Services · Horseshoeing · Repairs · Tool manufacture | `src/data/institutionServices.js :: INSTITUTION_SERVICES.Tool manufacture` |
| 1 | L2.war.iron | Repairs | `(untraced)` |
| 1 | L2.war.iron | Tool manufacture | `src/data/institutionServices.js :: INSTITUTION_SERVICES.Tool manufacture` |

### The 720: L2 by writer file (the false line) and the file holding the fact it should have read

| writer file | rule | towns | instances | the fact is in |
|---|---|---|---|---|
| `src/generators/safetyProfile.js` | L2.law.collapsed | 29 | 29 | the Law & order band (src/domain/causalState.js law_order) against src/generators/safetyProfile.js :: NO_WATCH_SMALL (drawn on `watch` only) |
| `src/data/institutionServices.js` | L2.siege.cutgood | 3 | 9 | src/domain/display/chainNeedShown.js :: chainNeedLine (the herbs "from outside, cut off") against src/data/crisisDependence.js SERVICE_DEPENDENCE ("Specialist compounds", "Herbal remedies": no `imported input`) |
| `src/data/institutionServices.js` | L2.war.iron | 4 | 8 | src/generators/economy/outlookHookSiblings.js :: WAR_IRON_HOOK against crisisStoppedRow.js :: STOPPING_CRISES (no wartime) |
| `src/data/institutionDescColour.js` | L2.siege.abroad | 6 | 7 | src/data/crisisDependence.js (HOUSE_/SERVICE_DEPENDENCE: no `travellers`/`goods` on the row) via src/domain/display/crisisStoppedRow.js :: rowStoppedBy |
| `src/data/institutionDescVariants.js` | L2.siege.abroad | 7 | 7 | src/data/crisisDependence.js (HOUSE_/SERVICE_DEPENDENCE: no `travellers`/`goods` on the row) via src/domain/display/crisisStoppedRow.js :: rowStoppedBy |
| `src/data/institutionServices.js` | L2.siege.abroad | 5 | 5 | src/data/crisisDependence.js (HOUSE_/SERVICE_DEPENDENCE: no `travellers`/`goods` on the row) via src/domain/display/crisisStoppedRow.js :: rowStoppedBy |
| `src/data/institutionalCatalog.js` | L2.siege.abroad | 4 | 4 | src/data/crisisDependence.js (HOUSE_/SERVICE_DEPENDENCE: no `travellers`/`goods` on the row) via src/domain/display/crisisStoppedRow.js :: rowStoppedBy |
| `src/generators/economy/incomeLineSiblings.js` | L2.siege.cutgood | 3 | 3 | src/domain/display/chainNeedShown.js :: chainNeedLine (the herbs "from outside, cut off") against src/data/crisisDependence.js SERVICE_DEPENDENCE ("Specialist compounds", "Herbal remedies": no `imported input`) |
| `src/data/institutionDescColour.js` | L2.siege.cutgood | 2 | 2 | src/domain/display/chainNeedShown.js :: chainNeedLine (the herbs "from outside, cut off") against src/data/crisisDependence.js SERVICE_DEPENDENCE ("Specialist compounds", "Herbal remedies": no `imported input`) |
| `src/data/institutionServices.js` | L2.war.animals | 2 | 2 | src/data/narrativeData.js :: STRESS_DESCS.wartime / the arrival scene's war senses against crisisStoppedRow.js :: STOPPING_CRISES (no wartime) |
| `(untraced)` | L2.war.animals | 2 | 2 | src/data/narrativeData.js :: STRESS_DESCS.wartime / the arrival scene's war senses against crisisStoppedRow.js :: STOPPING_CRISES (no wartime) |
| `src/data/institutionDescColour.js` | L2.famine.work | 1 | 1 | src/data/stressTypes.js :: STRESS_TYPE_MAP.famine (viabilityNote) against src/data/institutionDescColour.js (the line declared colour) |
| `src/data/institutionalCatalog.js` | L2.siege.cutgood | 1 | 1 | src/domain/display/chainNeedShown.js :: chainNeedLine (the herbs "from outside, cut off") against src/data/crisisDependence.js SERVICE_DEPENDENCE ("Specialist compounds", "Herbal remedies": no `imported input`) |
| `src/data/historyData.js` | L2.siege.abroad | 1 | 1 | src/data/crisisDependence.js (HOUSE_/SERVICE_DEPENDENCE: no `travellers`/`goods` on the row) via src/domain/display/crisisStoppedRow.js :: rowStoppedBy |
| `src/data/institutionDescColour.js` | L2.war.animals | 1 | 1 | src/data/narrativeData.js :: STRESS_DESCS.wartime / the arrival scene's war senses against crisisStoppedRow.js :: STOPPING_CRISES (no wartime) |
| `(untraced)` | L2.war.iron | 1 | 1 | src/generators/economy/outlookHookSiblings.js :: WAR_IRON_HOOK against crisisStoppedRow.js :: STOPPING_CRISES (no wartime) |

### The 720: the thirty commonest distinct lines of L3 (47 distinct)

| towns | rule | line | writer |
|---|---|---|---|
| 37 | L3.halfway | Processed textiles · Guild-manufactured goods · Dyed cloth | `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` |
| 32 | L3.halfway | Finished clothing · Dyed cloth · Tailored garments | `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` |
| 21 | L3.halfway | Boots and shoes · Saddles and harness · Leather armour | `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` |
| 20 | L3.needed | Vintner · Crafts / A cellar of presses and casks for wine, from grapes grown near or must brought in, whenever either can be had. Such wine  | `src/data/institutionDescVariants.js :: PAIRS` |
| 18 | L3.needed | Vintner · Crafts / Presses and ages wine from local grapes or imported must, in any year that either reaches the cellar. What it makes is so | `src/data/institutionalCatalog.js :: INSTITUTION_FAMILIES.shared` |
| 11 | L3.outputs | Armed escort · Monster hunting services · Dungeon clearance | `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` |
| 8 | L3.halfway | Leather goods · Guild-manufactured goods | `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` |
| 6 | L3.halfway | Quality tools and weapons · Advanced weapons and armor · Master-crafted weapons | `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` |
| 4 | L3.needed | Smelter · Crafts / Refines crude ore into workable metal over charcoal fire whenever ore can be had, and sells it on by the bar. | `src/data/institutionDescVariants.js :: DESC_VARIANT_SIBLINGS` |
| 4 | L3.halfway | Herbal remedies · Potions and elixirs | `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` |
| 4 | L3.foodModel | What it puts on the table itself is the day's catch. | `src/domain/foodways.js :: FRAMES` |
| 3 | L3.foodModel | What it puts on the table itself is salted fish. | `src/domain/foodways.js :: FRAMES` |
| 3 | L3.outputs | Lodging · Meals and drink · Stabling | `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` |
| 3 | L3.outputs | Armed escort · Mercenary hire · Training services | `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` |
| 2 | L3.foodModel | What it puts on the table itself is the hunters' game. Fermentation, pickling, and drying stretch the harvest through winter. | `src/domain/foodways.js :: FRAMES` |
| 2 | L3.halfway | Finished clothing · Dyed cloth | `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` |
| 2 | L3.chainOverStopped | Faith & Worship · Religion & civic✓ Running | `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` |
| 1 | L3.failedFood | Fishing Grounds · fish · salt · Wild Foraging Areas · honey · medicinal herbs · Ancient Grove · Stone quarry · stone | `src/data/resourceData.js :: RESOURCE_DATA.foraging_areas` |
| 1 | L3.failedFood | River Fisheries · fish · Wild Foraging Areas · honey · medicinal herbs · Strategic Crossroads · trade access · Stone quarry · stone | `src/data/resourceData.js :: RESOURCE_DATA.crossroads_position` |
| 1 | L3.failedFood | honey · medicinal herbs · stone · Salted fish · Smoked seafood · Honey and beeswax · Foraged goods · Freshwater catch | `src/data/supplyChainData.js :: SUPPLY_CHAIN_NEEDS.rawInputs` |
| 1 | L3.failedFood | Fishing Grounds · fish · salt · Coastal Timber · timber · Magical Ley Line Node · medicinal herbs · Salt Flats | `src/data/resourceData.js :: RESOURCE_DATA.magical_node` |
| 1 | L3.foodModel | What it puts on the table itself is the hunters' game. Irrigation, tanks, street kitchens, preservation, and ritual food rules shape supply  | `src/domain/foodways.js :: FRAMES` |
| 1 | L3.foodModel | What it puts on the table itself is the hunters' game. Smoking, drying, fermenting, and winter storage are central household technologies. | `src/domain/foodways.js :: FRAMES` |
| 1 | L3.foodModel | What it puts on the table itself is fish from the local waters. Fermentation, pickling, and drying stretch the harvest through winter. | `src/domain/foodways.js :: FRAMES` |
| 1 | L3.failedFood | River Fisheries · fish · Ancient Grove · medicinal herbs · honey · Iron Ore Deposits · iron · metalwork · Managed Woodland · timber · Mill S | `src/data/supplyChainData.js :: PROCESSED_TEXTILES` |
| 1 | L3.failedFood | medicinal herbs · honey · iron · metalwork · timber · flour · Salted fish · Smoked seafood · Candles and wax · Freshwater catch · Quality to | `src/data/supplyChainData.js :: ADVANCED_WEAPONS_AND_ARMOR` |
| 1 | L3.failedFood | Extensive Grain Fields · grain · flour · Strategic Crossroads · trade access · Coal or Peat Deposits · coal · Open Grazing Land · livestock  | `src/data/resourceData.js :: RESOURCE_DATA.grain_fields` |
| 1 | L3.failedFood | Deep Natural Harbour · maritime access · Coastal Timber · timber · Magical Ley Line Node · medicinal herbs · Fishing Grounds · fish · salt | `src/data/resourceData.js :: RESOURCE_DATA.magical_node` |
| 1 | L3.failedFood | Wild Foraging Areas · honey · medicinal herbs · Ancient Grove · Precious Metal Veins · luxury · Open Grazing Land · livestock · wool · dairy | `src/data/resourceData.js :: RESOURCE_DATA.precious_metals` |
| 1 | L3.failedFood | River Fisheries · fish · Ancient Grove · medicinal herbs · honey · Hunting Grounds · game meat · animal hides · furs | `src/data/resourceData.js :: RESOURCE_DATA.river_fish` |

### The 720: L3 by writer file (the false line) and the file holding the fact it should have read

| writer file | rule | towns | instances | the fact is in |
|---|---|---|---|---|
| `src/components/new/tabs/EconomicsTab.jsx` | L3.halfway | 56 | 112 | resourceAnalysis.gaps "Cannot produce final goods" (src/generators/resourceGenerator.js :: evaluateInstitutionDeps) against the chain's outputs (src/generators/computeActiveChains.js) |
| `src/data/institutionDescVariants.js` | L3.needed | 24 | 24 | resourceAnalysis.imports.critical (the "Needed, and not brought in" line) against crisisStoppedRow.js :: rowShortOf / housesShortOfInput (no "Short of" on the craft) |
| `src/data/institutionalCatalog.js` | L3.needed | 19 | 19 | resourceAnalysis.imports.critical (the "Needed, and not brought in" line) against crisisStoppedRow.js :: rowShortOf / housesShortOfInput (no "Short of" on the craft) |
| `src/components/new/tabs/EconomicsTab.jsx` | L3.outputs | 15 | 18 | crisisStoppedRow.js (the service rows' marks) against src/domain/display/chainStateShown.js :: chainCrisisStateShown (the chain's state) — two deciders for one service |
| `src/data/resourceData.js` | L3.failedFood | 14 | 14 | foodRecord.failedSource against src/components/new/tabs/ResourcesTab.jsx (commodities from src/data/resourceData.js) and the Trade Profile's produced-locally list |
| `src/domain/foodways.js` | L3.foodModel | 12 | 12 | economicState.foodSecurity.foodSources (src/generators/economy/foodBalance.js, which leaves out the Farmland house) printed by src/domain/foodways.js :: foodwaysLineOf |
| `src/data/supplyChainData.js` | L3.failedFood | 4 | 5 | foodRecord.failedSource against src/components/new/tabs/ResourcesTab.jsx (commodities from src/data/resourceData.js) and the Trade Profile's produced-locally list |
| `src/components/new/tabs/EconomicsTab.jsx` | L3.chainOverStopped | 3 | 3 | crisisStoppedRow.js (every service of the via houses stopped) against chainStateShown.js :: chainCrisisStateShown |
| `src/components/new/tabs/EconomicsTab.jsx` | L3.failedFood | 1 | 1 | foodRecord.failedSource against src/components/new/tabs/ResourcesTab.jsx (commodities from src/data/resourceData.js) and the Trade Profile's produced-locally list |
| `src/data/cultureProfiles.js` | L3.foodModel | 1 | 1 | economicState.foodSecurity.foodSources (src/generators/economy/foodBalance.js, which leaves out the Farmland house) printed by src/domain/foodways.js :: foodwaysLineOf |
| `src/domain/foodways.js` | L3.foodLineStopped | 1 | 1 | crisisStoppedRow.js (the fishing marked stopped) against src/domain/foodways.js :: foodwaysLineOf |
| `src/data/foodwaysPrintSiblings.js` | L3.foodLineStopped | 1 | 1 | crisisStoppedRow.js (the fishing marked stopped) against src/domain/foodways.js :: foodwaysLineOf |


### The fresh 300: by law and rule

| law · rule | towns | instances |
|---|---|---|
| **L2** | **51** | **120** |
| **L3** | **66** | **92** |
| L2.famine.meat | 4 | 8 |
| L2.law.collapsed | 13 | 13 |
| L2.siege.abroad | 28 | 55 |
| L2.siege.cutgood | 5 | 17 |
| L2.war.animals | 1 | 2 |
| L2.war.iron | 10 | 25 |
| L3.chainOverStopped | 7 | 7 |
| L3.failedFood | 22 | 24 |
| L3.foodLineStopped | 1 | 1 |
| L3.foodModel | 2 | 2 |
| L3.halfway | 16 | 27 |
| L3.needed | 10 | 10 |
| L3.outputs | 17 | 21 |

### The fresh 300: the thirty commonest distinct lines of L2 (29 distinct)

| towns | rule | line | writer |
|---|---|---|---|
| 13 | L2.law.collapsed | A thief is known by name within a day, and everyone shuns them until they make it right. | `src/generators/safetyProfile.js :: NO_WATCH_SMALL` |
| 11 | L2.siege.abroad | Personal protection for merchants, officials, and travelers. | `src/data/institutionServices.js :: INSTITUTION_SERVICES.Bodyguard service` |
| 10 | L2.siege.abroad | A cluster of apothecaries pressed close enough that competition drives them apart in trade, some to surgery, some to herb-work, some to medi | `src/data/institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS` |
| 8 | L2.siege.abroad | Guild bowyers and fletchers selling arrows by the sheaf, special broadheads, and composite bows to order, supplying the watch, the garrison, | `src/data/institutionDescVariants.js :: PAIRS` |
| 8 | L2.siege.abroad | Supplies the watch, the garrison, and the caravans. | `src/data/institutionalCatalog.js :: INSTITUTION_FAMILIES.shared` |
| 7 | L2.war.iron | Reforge broken tools, re-edge blades, mend ironwork. | `src/data/institutionServices.js :: INSTITUTION_SERVICES.Repairs` |
| 6 | L2.siege.abroad | The watch, the garrison, and the caravans buy here. | `src/data/institutionDescVariants.js :: PAIRS` |
| 5 | L2.siege.abroad | Serves merchants, military, and travelers needing fresh mounts. | `src/data/institutionalCatalog.js :: INSTITUTION_FAMILIES.shared` |
| 4 | L2.famine.meat | Services · Fresh meat | `(untraced)` |
| 4 | L2.famine.meat | Fresh meat | `(untraced)` |
| 4 | L2.siege.cutgood | Herbal remedies | `src/data/institutionServices.js :: INSTITUTION_SERVICES.Herbal remedies` |
| 4 | L2.siege.abroad | Stabling, horse-dealing, and farriery gathered in one quarter, serving merchants, soldiers, and travellers in want of a fresh mount. | `src/data/institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS` |
| 3 | L2.war.iron | Services · Repairs · Tool manufacture · Weapon smithing | `src/data/institutionServices.js :: INSTITUTION_SERVICES.Tool manufacture` |
| 3 | L2.war.iron | Services · Horseshoeing · Repairs · Tool manufacture | `src/data/institutionServices.js :: INSTITUTION_SERVICES.Tool manufacture` |
| 3 | L2.war.iron | Repairs | `(untraced)` |
| 3 | L2.war.iron | Tool manufacture | `src/data/institutionServices.js :: INSTITUTION_SERVICES.Tool manufacture` |
| 3 | L2.war.iron | Services · Horseshoeing · Repairs · Tool manufacture · Weapon smithing | `src/data/institutionServices.js :: INSTITUTION_SERVICES.Tool manufacture` |
| 3 | L2.siege.abroad | Rents animals to travellers and merchants who need load-carrying capacity for the road. | `src/data/institutionalCatalog.js :: INSTITUTION_FAMILIES.shared` |
| 2 | L2.siege.cutgood | A cluster of apothecaries pressed close enough that competition drives them apart in trade, some to surgery, some to herb-work, some to medi | `src/data/institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS` |
| 2 | L2.siege.cutgood | Services · Herbal remedies · Specialist compounds | `src/data/institutionServices.js :: INSTITUTION_SERVICES.Specialist compounds` |
| 2 | L2.siege.cutgood | Rare medications and treatments available through district-wide sourcing. | `src/data/institutionServices.js :: INSTITUTION_SERVICES.Specialist compounds` |
| 2 | L2.siege.cutgood | Services · Herbal remedies | `src/data/institutionServices.js :: INSTITUTION_SERVICES.Herbal remedies` |
| 2 | L2.siege.cutgood | Apothecary & Alchemy Remedies and simple preparations, made and sold here: a modest trade. | `src/generators/economy/incomeLineSiblings.js :: REMEDIES_LINE` |
| 2 | L2.siege.cutgood | Some focus on chirurgery, others on herbal preparations, others on imported medicines. | `src/data/institutionalCatalog.js :: INSTITUTION_FAMILIES.shared` |
| 2 | L2.war.iron | Weapon smithing | `src/data/institutionServices.js :: INSTITUTION_SERVICES.Weapon smithing` |
| 1 | L2.siege.cutgood | Apothecary & Alchemy Remedies and preparations are made here, but few, while the herbs and reagents they need run short. | `src/generators/economy/incomeLineSiblings.js :: REMEDIES_SHORT_LINE` |
| 1 | L2.war.animals | Services · Horse hire · Livery and boarding | `src/data/institutionServices.js :: INSTITUTION_SERVICES.Livery and boarding` |
| 1 | L2.war.animals | Horse hire | `(untraced)` |
| 1 | L2.war.iron | Services · Repairs · Tool manufacture | `src/data/institutionServices.js :: INSTITUTION_SERVICES.Tool manufacture` |

### The fresh 300: L2 by writer file (the false line) and the file holding the fact it should have read

| writer file | rule | towns | instances | the fact is in |
|---|---|---|---|---|
| `src/data/institutionServices.js` | L2.war.iron | 10 | 22 | src/generators/economy/outlookHookSiblings.js :: WAR_IRON_HOOK against crisisStoppedRow.js :: STOPPING_CRISES (no wartime) |
| `src/data/institutionalCatalog.js` | L2.siege.abroad | 15 | 16 | src/data/crisisDependence.js (HOUSE_/SERVICE_DEPENDENCE: no `travellers`/`goods` on the row) via src/domain/display/crisisStoppedRow.js :: rowStoppedBy |
| `src/data/institutionDescVariants.js` | L2.siege.abroad | 14 | 14 | src/data/crisisDependence.js (HOUSE_/SERVICE_DEPENDENCE: no `travellers`/`goods` on the row) via src/domain/display/crisisStoppedRow.js :: rowStoppedBy |
| `src/data/institutionDescColour.js` | L2.siege.abroad | 13 | 14 | src/data/crisisDependence.js (HOUSE_/SERVICE_DEPENDENCE: no `travellers`/`goods` on the row) via src/domain/display/crisisStoppedRow.js :: rowStoppedBy |
| `src/generators/safetyProfile.js` | L2.law.collapsed | 13 | 13 | the Law & order band (src/domain/causalState.js law_order) against src/generators/safetyProfile.js :: NO_WATCH_SMALL (drawn on `watch` only) |
| `src/data/institutionServices.js` | L2.siege.abroad | 11 | 11 | src/data/crisisDependence.js (HOUSE_/SERVICE_DEPENDENCE: no `travellers`/`goods` on the row) via src/domain/display/crisisStoppedRow.js :: rowStoppedBy |
| `src/data/institutionServices.js` | L2.siege.cutgood | 4 | 10 | src/domain/display/chainNeedShown.js :: chainNeedLine (the herbs "from outside, cut off") against src/data/crisisDependence.js SERVICE_DEPENDENCE ("Specialist compounds", "Herbal remedies": no `imported input`) |
| `(untraced)` | L2.famine.meat | 4 | 8 | economicState.foodSecurity (src/generators/economy/foodBalance.js) read by crisisStoppedRow.js :: stoppedBy (the failed source only) |
| `src/generators/economy/incomeLineSiblings.js` | L2.siege.cutgood | 3 | 3 | src/domain/display/chainNeedShown.js :: chainNeedLine (the herbs "from outside, cut off") against src/data/crisisDependence.js SERVICE_DEPENDENCE ("Specialist compounds", "Herbal remedies": no `imported input`) |
| `(untraced)` | L2.war.iron | 3 | 3 | src/generators/economy/outlookHookSiblings.js :: WAR_IRON_HOOK against crisisStoppedRow.js :: STOPPING_CRISES (no wartime) |
| `src/data/institutionDescColour.js` | L2.siege.cutgood | 2 | 2 | src/domain/display/chainNeedShown.js :: chainNeedLine (the herbs "from outside, cut off") against src/data/crisisDependence.js SERVICE_DEPENDENCE ("Specialist compounds", "Herbal remedies": no `imported input`) |
| `src/data/institutionalCatalog.js` | L2.siege.cutgood | 2 | 2 | src/domain/display/chainNeedShown.js :: chainNeedLine (the herbs "from outside, cut off") against src/data/crisisDependence.js SERVICE_DEPENDENCE ("Specialist compounds", "Herbal remedies": no `imported input`) |
| `src/data/institutionServices.js` | L2.war.animals | 1 | 1 | src/data/narrativeData.js :: STRESS_DESCS.wartime / the arrival scene's war senses against crisisStoppedRow.js :: STOPPING_CRISES (no wartime) |
| `(untraced)` | L2.war.animals | 1 | 1 | src/data/narrativeData.js :: STRESS_DESCS.wartime / the arrival scene's war senses against crisisStoppedRow.js :: STOPPING_CRISES (no wartime) |

### The fresh 300: the thirty commonest distinct lines of L3 (45 distinct)

| towns | rule | line | writer |
|---|---|---|---|
| 14 | L3.outputs | Armed escort · Monster hunting services · Dungeon clearance | `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` |
| 8 | L3.halfway | Processed textiles · Guild-manufactured goods · Dyed cloth | `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` |
| 5 | L3.needed | Vintner · Crafts / Presses and ages wine from local grapes or imported must, in any year that either reaches the cellar. What it makes is so | `src/data/institutionalCatalog.js :: INSTITUTION_FAMILIES.shared` |
| 4 | L3.halfway | Quality tools and weapons · Advanced weapons and armor · Master-crafted weapons | `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` |
| 4 | L3.outputs | Armed escort · Mercenary hire · Training services | `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` |
| 4 | L3.halfway | Finished clothing · Dyed cloth · Tailored garments | `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` |
| 4 | L3.halfway | Boots and shoes · Saddles and harness · Leather armour | `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` |
| 3 | L3.needed | Vintner · Crafts / A cellar of presses and casks for wine, from grapes grown near or must brought in, whenever either can be had. Such wine  | `src/data/institutionDescVariants.js :: PAIRS` |
| 3 | L3.chainOverStopped | Faith & Worship · Religion & civic✓ Running | `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` |
| 2 | L3.failedFood | Open Grazing Land · livestock · wool · dairy · animal hides · Strategic Crossroads · trade access | `src/data/resourceData.js :: RESOURCE_DATA.crossroads_position` |
| 2 | L3.chainOverStopped | Faith & Worship · Religion & civic○ Operational | `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` |
| 2 | L3.outputs | Lodging · Meals and drink | `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` |
| 2 | L3.halfway | Leather goods · Guild-manufactured goods | `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` |
| 1 | L3.failedFood | Fishing Grounds · fish · salt · Coastal Timber · timber · Magical Ley Line Node · medicinal herbs · Deep Natural Harbour · maritime access | `src/data/resourceData.js :: RESOURCE_DATA.magical_node` |
| 1 | L3.failedFood | Deep Natural Harbour · maritime access · Coastal Timber · timber · Fishing Grounds · fish · salt | `src/data/resourceData.js :: RESOURCE_DATA.deep_harbour` |
| 1 | L3.failedFood | Fishing Grounds · fish · salt · Salt Flats · Magical Ley Line Node · medicinal herbs · Deep Natural Harbour · maritime access | `src/data/resourceData.js :: RESOURCE_DATA.magical_node` |
| 1 | L3.failedFood | River Fisheries · fish · Marshlands · peat · honey · medicinal herbs · Hot Springs / Healing Waters · Iron Ore Deposits · iron · metalwork · | `src/data/resourceData.js :: RESOURCE_DATA.hot_springs` |
| 1 | L3.failedFood | Wild Foraging Areas · honey · medicinal herbs · Ancient Grove · Managed Woodland · timber · Extensive Grain Fields · grain · flour | `src/data/resourceData.js :: RESOURCE_DATA.grain_fields` |
| 1 | L3.failedFood | Deep Natural Harbour · maritime access · Salt Flats · salt · Ancient Ruins · trade access · Fishing Grounds · fish · Coastal Timber · timber | `src/data/resourceData.js :: RESOURCE_DATA.deep_harbour` |
| 1 | L3.failedFood | Hunting Grounds · game meat · animal hides · furs · Strategic Crossroads · trade access · Iron Ore Deposits · iron · metalwork · Extensive G | `src/data/resourceData.js :: RESOURCE_DATA.grain_fields` |
| 1 | L3.failedFood | Ancient Grove · medicinal herbs · honey · Iron Ore Deposits · iron · metalwork · Extensive Grain Fields · grain · flour | `src/data/resourceData.js :: RESOURCE_DATA.grain_fields` |
| 1 | L3.failedFood | Managed Woodland · timber · Ancient Grove · medicinal herbs · honey · Coal or Peat Deposits · coal · Extensive Grain Fields · grain · flour | `src/data/resourceData.js :: RESOURCE_DATA.grain_fields` |
| 1 | L3.failedFood | River Fisheries · fish · Wild Foraging Areas · honey · medicinal herbs · Strategic Crossroads · trade access · Iron Ore Deposits · iron · me | `src/data/resourceData.js :: RESOURCE_DATA.crossroads_position` |
| 1 | L3.failedFood | iron · metalwork · Salted fish · Smoked seafood · Freshwater catch · Quality tools and weapons · Advanced weapons and armor · Refined iron i | `src/data/supplyChainData.js :: ADVANCED_WEAPONS_AND_ARMOR` |
| 1 | L3.chainOverStopped | Taverns & Social Life · Entertainment & culture○ Operational | `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` |
| 1 | L3.outputs | Lodging · Meals and drink · Stabling | `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` |
| 1 | L3.foodLineStopped | What each holding grows goes to its own table; beyond that, what it puts on the table itself is fish from the local waters. | `src/domain/foodways.js :: FRAMES` |
| 1 | L3.chainOverStopped | Black market · Criminal economy○ Operational | `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` |
| 1 | L3.needed | Smelter · Crafts / Converts raw ore to refined metal using charcoal-fueled furnaces, whenever ore can be had. | `src/data/institutionalCatalog.js :: INSTITUTION_FAMILIES.shared` |
| 1 | L3.halfway | Finished clothing · Dyed cloth | `src/components/new/tabs/EconomicsTab.jsx :: EconomicFlowsSection` |

### The fresh 300: L3 by writer file (the false line) and the file holding the fact it should have read

| writer file | rule | towns | instances | the fact is in |
|---|---|---|---|---|
| `src/components/new/tabs/EconomicsTab.jsx` | L3.halfway | 16 | 27 | resourceAnalysis.gaps "Cannot produce final goods" (src/generators/resourceGenerator.js :: evaluateInstitutionDeps) against the chain's outputs (src/generators/computeActiveChains.js) |
| `src/data/resourceData.js` | L3.failedFood | 22 | 22 | foodRecord.failedSource against src/components/new/tabs/ResourcesTab.jsx (commodities from src/data/resourceData.js) and the Trade Profile's produced-locally list |
| `src/components/new/tabs/EconomicsTab.jsx` | L3.outputs | 17 | 21 | crisisStoppedRow.js (the service rows' marks) against src/domain/display/chainStateShown.js :: chainCrisisStateShown (the chain's state) — two deciders for one service |
| `src/components/new/tabs/EconomicsTab.jsx` | L3.chainOverStopped | 7 | 7 | crisisStoppedRow.js (every service of the via houses stopped) against chainStateShown.js :: chainCrisisStateShown |
| `src/data/institutionalCatalog.js` | L3.needed | 6 | 6 | resourceAnalysis.imports.critical (the "Needed, and not brought in" line) against crisisStoppedRow.js :: rowShortOf / housesShortOfInput (no "Short of" on the craft) |
| `src/data/institutionDescVariants.js` | L3.needed | 4 | 4 | resourceAnalysis.imports.critical (the "Needed, and not brought in" line) against crisisStoppedRow.js :: rowShortOf / housesShortOfInput (no "Short of" on the craft) |
| `src/data/supplyChainData.js` | L3.failedFood | 2 | 2 | foodRecord.failedSource against src/components/new/tabs/ResourcesTab.jsx (commodities from src/data/resourceData.js) and the Trade Profile's produced-locally list |
| `src/domain/foodways.js` | L3.foodModel | 2 | 2 | economicState.foodSecurity.foodSources (src/generators/economy/foodBalance.js, which leaves out the Farmland house) printed by src/domain/foodways.js :: foodwaysLineOf |
| `src/domain/foodways.js` | L3.foodLineStopped | 1 | 1 | crisisStoppedRow.js (the fishing marked stopped) against src/domain/foodways.js :: foodwaysLineOf |


## 3. PRECISION (the 720, drawn by a fixed seed and judged by hand against the page, by the second check's rules)

**LAW 2: 18 of 20 stand (draw 3, seed 20261117), and 2 are WEAK. LAW 3: 19 of 20 stand (draw 2, seed 20261116), and 1 is WEAK.** Both pass the bar of seventeen in twenty only after narrowing. The draws, in order:

| draw | law | stand | what failed, and the narrowing that followed |
|---|---|---|---|
| 1 | L2 | 12 of 20 | 4 NPC names read as pilgrims ("Pilgrim Fuchs"); 1 a "Normally yields" chain line; 3 horse hire against "the army has the carts and the road" only (C7834 calls that degree). Narrowed: people's names stripped; "Normally yields" counts as a mark; the war-animals reach needs the receipts or old-and-lame line. |
| 1 | L3 | - | not judged row by row: on reading, 13 of the 20 were L3.halfway rows resting on the generic "semi-finished" line, which names no material, so the rule was narrowed before judging. Narrowed: the page must name the material (Partial · <material>, or "Work on the <material> here stops half-way"). |
| 2 | L2 | 14 of 20 | 2 grain rows on the Trade Profile (WEAK; LAW 3's lists); 2 "Divine healing supplements mundane medicine" (EXPLAINED); 1 history "drew more pilgrims" 38 years ago (EXPLAINED); 1 income remedies row (WEAK). Narrowed: History skipped; the medicine words plural; the trade lists left to LAW 3. |
| 2 | L3 | 19 of 20 | 1 a common pasture under "Needed: livestock" (WEAK). Narrowed after: L3.needed reads Crafts houses only (it only removes rows). |
| 3 | L2 | 18 of 20 | 1 income remedies row (WEAK); 1 a toll-keeper's manner (WEAK). |
| after the 300 | L2 | - | not a draw: the fresh 300 showed three kinds the draws had judged not standing, now in many towns. A person's manner ("How they deal … the travellers", WEAK at draw 3; 8 towns of the 300). "Alchemical remedies supplement treatment", the kind of "Divine healing supplements mundane medicine" (EXPLAINED at draw 2). A conditional "could bring pilgrims". Narrowed out; this only removes rows. The counts in section 2 are after it, and every STANDS control on the sixty is still found. |

The counts in section 2 are after the last narrowing. LAW 3 was narrowed once more after draw 2, and that only removes rows: L3.needed now reads Crafts houses only. Every row of each judged draw, with its verdict and note, is in `tables/B.precision.720.json`.

How to read these numbers:
- The two biggest rules repeat few distinct lines. L2.law.collapsed is one sentence in 29 towns of the 720. L3.halfway is three outputs lines in most of its 56 towns.
- So a precision draw is dominated by them, and the share that stands is the share of those few lines that stand.
- Each was judged by its control: C42116 for law.collapsed, C37887 and C39608 for halfway.

LAW 2, draw 3:

| # | rule | town | tab | line | verdict | note |
|---|---|---|---|---|---|---|
| 0 | L2.war.animals | r2s-wartime-metropolis-0 | Institutions | Services · Horse hire · Livery and boarding | **STANDS** | unmarked horse hire while the page says the paddocks hold only the old, the lame and foals (as C8475) |
| 1 | L2.siege.cutgood | r2r-metropolis-14 | Economics | Apothecary & Alchemy Remedies and simple preparations, made and sold here: a modest trade. | **WEAK** | an income row: remedies "made and sold here" while the page says the herbs come from outside and are cut off; made-here may draw on herbs inside the walls (degr |
| 2 | L2.law.collapsed | r2s-wartime-village-3 | Defense | A thief is known by name within a day, and everyone shuns them until they make it right. | **STANDS** | the page says law and order has collapsed; the unmarked line says a thief is shunned until they make it right (as C42116) |
| 3 | L2.siege.abroad | r2r-metropolis-14 | Institutions | A cluster of apothecaries pressed close enough that competition drives them apart in trade | **STANDS** | an unmarked line offering what comes from outside (caravans, travellers, medicines from abroad) while the page says nothing comes in by road (as C0350, C0333) |
| 4 | L2.law.collapsed | r2r-village-37 | Defense | A thief is known by name within a day, and everyone shuns them until they make it right. | **STANDS** | the page says law and order has collapsed; the unmarked line says a thief is shunned until they make it right (as C42116) |
| 5 | L2.law.collapsed | r2r-village-29 | Defense | A thief is known by name within a day, and everyone shuns them until they make it right. | **STANDS** | the page says law and order has collapsed; the unmarked line says a thief is shunned until they make it right (as C42116) |
| 6 | L2.siege.cutgood | r2s-under_siege-metropolis-0 | Services | Rare medications and treatments available through district-wide sourcing. | **STANDS** | an unmarked medicine row while the page says the herbs come from outside and the siege has cut them off (as C0927) |
| 7 | L2.siege.cutgood | r2s-under_siege-metropolis-0 | Institutions | One leans to chirurgery, another to herbal preparations, a third to imported medicines. | **STANDS** | an unmarked medicine row while the page says the herbs come from outside and the siege has cut them off (as C0927) |
| 8 | L2.law.collapsed | r2r-village-26 | Defense | A thief is known by name within a day, and everyone shuns them until they make it right. | **STANDS** | the page says law and order has collapsed; the unmarked line says a thief is shunned until they make it right (as C42116) |
| 9 | L2.siege.abroad | r2s-under_siege-metropolis-0 | Institutions | Guild bowyers and fletchers selling arrows by the sheaf, special broadheads, and composite | **STANDS** | an unmarked line offering what comes from outside (caravans, travellers, medicines from abroad) while the page says nothing comes in by road (as C0350, C0333) |
| 10 | L2.law.collapsed | r2s-succession_void-thorp-0 | Defense | A thief is known by name within a day, and everyone shuns them until they make it right. | **STANDS** | the page says law and order has collapsed; the unmarked line says a thief is shunned until they make it right (as C42116) |
| 11 | L2.siege.cutgood | r2r-metropolis-14 | Services | Herbal remedies | **STANDS** | an unmarked medicine row while the page says the herbs come from outside and the siege has cut them off (as C0927) |
| 12 | L2.siege.cutgood | r2r-metropolis-14 | Institutions | A cluster of apothecaries pressed close enough that competition drives them apart in trade | **STANDS** | an unmarked medicine row while the page says the herbs come from outside and the siege has cut them off (as C0927) |
| 13 | L2.law.collapsed | r2r-village-21 | Defense | A thief is known by name within a day, and everyone shuns them until they make it right. | **STANDS** | the page says law and order has collapsed; the unmarked line says a thief is shunned until they make it right (as C42116) |
| 14 | L2.law.collapsed | r2s-slave_revolt-hamlet-3 | Defense | A thief is known by name within a day, and everyone shuns them until they make it right. | **STANDS** | the page says law and order has collapsed; the unmarked line says a thief is shunned until they make it right (as C42116) |
| 15 | L2.siege.abroad | r2s-under_siege-town-2 | Institutions | Serves merchants, military, and travelers needing fresh mounts. | **STANDS** | an unmarked line offering what comes from outside (caravans, travellers, medicines from abroad) while the page says nothing comes in by road (as C0350, C0333) |
| 16 | L2.siege.abroad | r2r-metropolis-14 | Institutions | Guild bowyers and fletchers selling arrows by the sheaf, special broadheads, and composite | **STANDS** | an unmarked line offering what comes from outside (caravans, travellers, medicines from abroad) while the page says nothing comes in by road (as C0350, C0333) |
| 17 | L2.siege.abroad | r2s-under_siege-city-3 | Institutions | Supplies the watch, the garrison, and the caravans. | **STANDS** | an unmarked line offering what comes from outside (caravans, travellers, medicines from abroad) while the page says nothing comes in by road (as C0350, C0333) |
| 18 | L2.law.collapsed | r2s-famine-village-2 | Defense | A thief is known by name within a day, and everyone shuns them until they make it right. | **STANDS** | the page says law and order has collapsed; the unmarked line says a thief is shunned until they make it right (as C42116) |
| 19 | L2.siege.abroad | r2s-under_siege-metropolis-3 | NPCs | How they deal Talks about the road and the travellers; knows who has passed and when. | **WEAK** | a person's manner ("talks about the road and the travellers"), not an offer of what the siege stops |

LAW 3, draw 2:

| # | rule | town | tab | line | verdict | note |
|---|---|---|---|---|---|---|
| 0 | L3.needed | r2s-succession_void-town-2 | Institutions | Vintner · Crafts / A cellar of presses and casks for wine, from grapes grown near or must  | **STANDS** | "Needed, and not brought in" with "that work stands idle", and the craft printed unmarked with its services (as C31652) |
| 1 | L3.failedFood | r2s-famine-hamlet-0 | Resources | Deep Natural Harbour · maritime access · Coastal Timber · timber · Magical Ley Line Node · | **STANDS** | the failed source listed among the commodities available (as C42011, C42947) |
| 2 | L3.foodModel | r2r-village-23 | Economics | What it puts on the table itself is the hunters' game. Irrigation, tanks, street kitchens, | **STANDS** | the table's own food named as game or fish beside a Farmland house selling its grain and a harvest (as C39597) |
| 3 | L3.halfway | r2s-monster_pressure-city-0 | Economics | Leather goods · Guild-manufactured goods | **STANDS** | the page says this material is worked only to semi-finished goods (Partial · <material>), yet a chain prints the finished goods: X and not-X on two tabs (as C37 |
| 4 | L3.halfway | r2s-famine-city-3 | Economics | Finished clothing · Dyed cloth · Tailored garments | **STANDS** | the page says this material is worked only to semi-finished goods (Partial · <material>), yet a chain prints the finished goods: X and not-X on two tabs (as C37 |
| 5 | L3.halfway | r2r-town-32 | Economics | Processed textiles · Guild-manufactured goods · Dyed cloth | **STANDS** | the page says this material is worked only to semi-finished goods (Partial · <material>), yet a chain prints the finished goods: X and not-X on two tabs (as C37 |
| 6 | L3.needed | r2r-town-34 | Institutions | Vintner · Crafts / A cellar of presses and casks for wine, from grapes grown near or must  | **STANDS** | "Needed, and not brought in" with "that work stands idle", and the craft printed unmarked with its services (as C31652) |
| 7 | L3.failedFood | r2s-famine-hamlet-3 | Resources | Wild Foraging Areas · honey · medicinal herbs · Ancient Grove · Precious Metal Veins · lux | **STANDS** | the failed source listed among the commodities available (as C42011, C42947) |
| 8 | L3.halfway | r2s-wartime-town-0 | Economics | Finished clothing · Dyed cloth | **STANDS** | the page says this material is worked only to semi-finished goods (Partial · <material>), yet a chain prints the finished goods: X and not-X on two tabs (as C37 |
| 9 | L3.halfway | r2r-metropolis-14 | Economics | Leather goods · Guild-manufactured goods | **STANDS** | the page says this material is worked only to semi-finished goods (Partial · <material>), yet a chain prints the finished goods: X and not-X on two tabs (as C37 |
| 10 | L3.needed | r2r-metropolis-20 | Institutions | Vintner · Crafts / Presses and ages wine from local grapes or imported must, in any year t | **STANDS** | "Needed, and not brought in" with "that work stands idle", and the craft printed unmarked with its services (as C31652) |
| 11 | L3.halfway | r2s-occupied-city-1 | Economics | Processed textiles · Guild-manufactured goods · Dyed cloth | **STANDS** | the page says this material is worked only to semi-finished goods (Partial · <material>), yet a chain prints the finished goods: X and not-X on two tabs (as C37 |
| 12 | L3.halfway | r2r-metropolis-3 | Economics | Leather goods · Guild-manufactured goods | **STANDS** | the page says this material is worked only to semi-finished goods (Partial · <material>), yet a chain prints the finished goods: X and not-X on two tabs (as C37 |
| 13 | L3.halfway | r2s-mass_migration-town-0 | Economics | Finished clothing · Dyed cloth · Tailored garments | **STANDS** | the page says this material is worked only to semi-finished goods (Partial · <material>), yet a chain prints the finished goods: X and not-X on two tabs (as C37 |
| 14 | L3.halfway | r2s-occupied-city-1 | Economics | Finished clothing · Dyed cloth · Tailored garments | **STANDS** | the page says this material is worked only to semi-finished goods (Partial · <material>), yet a chain prints the finished goods: X and not-X on two tabs (as C37 |
| 15 | L3.halfway | r2r-city-32 | Economics | Finished clothing · Dyed cloth · Tailored garments | **STANDS** | the page says this material is worked only to semi-finished goods (Partial · <material>), yet a chain prints the finished goods: X and not-X on two tabs (as C37 |
| 16 | L3.needed | r2r-metropolis-40 | Institutions | Vintner · Crafts / Presses and ages wine from local grapes or imported must, in any year t | **STANDS** | "Needed, and not brought in" with "that work stands idle", and the craft printed unmarked with its services (as C31652) |
| 17 | L3.needed | r2r-village-53 | Institutions | Common grazing land · Economy / Shared pasture for village livestock, held in common along | **WEAK** | a common pasture "for village livestock" is no work standing idle; the rule is narrowed to Crafts since (removes this row) |
| 18 | L3.chainOverStopped | r2s-under_siege-hamlet-0 | Economics | Faith & Worship · Religion & civic✓ Running | **STANDS** | a chain Running over houses whose every service is stopped (as C17893) |
| 19 | L3.needed | r2s-monster_pressure-city-2 | Institutions | Vintner · Crafts / Presses and ages wine from local grapes or imported must, in any year t | **STANDS** | "Needed, and not brought in" with "that work stands idle", and the craft printed unmarked with its services (as C31652) |

## 4. THE CURE'S FORM (proposed, not made; by owner of the files)

### LAW 2 · what the crisis stops is not on offer unmarked

1. **Siege, the outside (L2.siege.abroad, L2.siege.cutgood): two facts for one thing.**
   - The mark on a row is decided by the row's DECLARED DEPENDENCE (`src/data/crisisDependence.js`, read by `crisisStoppedRow.js :: rowStoppedBy`). The false line is the row's DESCRIPTION, which asserts its own dependence on the outside.
   - The bowyers sell to "the caravans". The apothecaries sell "medicines brought from abroad". The stables serve "travellers in want of a fresh mount". The bodyguard guards "merchants, officials and travellers".
   - Yet `HOUSE_DEPENDENCE` gives `bowyers_fletchers_guild`, `apothecary_district` and `stable_district` NONE, and `SERVICE_DEPENDENCE` gives "Specialist compounds" and "Repairs" NONE.
   - ONE FACT: the dependence a description asserts belongs on its row (`travellers`, `goods`, or `imported input` where the record imports the herbs). The leaf already prints `Stopped by the siege.` or `Curtailed by the siege.` for those words.
   - The alternative is line by line: these variants are declared `colour` or `needs: watch, garrison` (LAW 5). Declare them `excludes: ['crisis: under_siege']` with a twin, through the existing sibling sets.
   - Owner: the houses' and services' data (`crisisDependence.js`, `institutionDescVariants.js`, `institutionDescColour.js`, `institutionServices.js`, `institutionalCatalog.js`).
2. **War (L2.war.iron, L2.war.animals): the mark cannot reach a war.**
   - `STOPPING_CRISES` (`crisisStoppedRow.js:82`) is siege, plague and famine. The page itself prints war's reach: `WAR_IRON_HOOK` (`outlookHookSiblings.js`) and the war senses ("every sound animal … has a receipt").
   - ONE FACT would cure every such row: a wartime `stoppedBy`, giving iron to the smiths' rows when the iron hook is drawn, and working animals to horse and cart hire.
   - That needs two new dependence words. **This widens the mark system, so it is the owner's call.**
3. **Law collapsed (L2.law.collapsed), the largest single line of LAW 2.**
   - One line, `safetyProfile.js :: NO_WATCH_SMALL` ("A thief is known by name within a day …", line 1018), is drawn when there is no watch. It reads nothing of the law band.
   - Declaring it out of a Collapsed band, with a twin, cures 29 towns of the 720 at once.
4. **Famine (L2.famine.work, L2.famine.meat, L2.famine.grain).**
   - "The work never dries up" (`institutionDescColour.js:157`) is declared `colour`. It wants `excludes: ['crisis: famine']`.
   - For meat: `stoppedBy('famine')` stops only the failed source. A siege-and-famine town whose livestock is all imported (the record's `upstreamMissing livestock`) needs the siege's `goods` stop on its meat rows.
5. **Left line by line:**
   - an income row's `REMEDIES_LINE` under siege (its siege twin `ALCHEMY_UNDER_SIEGE_LINE` exists but did not print in that town);
   - a toll-keeper's manner ("talks about the road and the travellers"), WEAK.

### LAW 3 · one state on every tab

1. **The half-way chains (L3.halfway), the largest rule: two facts for one thing found.**
   - The gap's `missing` list (`resourceAnalysis.gaps`, from the chains' `processingInstitutions` in `src/data/resourceChains.js`) names a house the town HAS under another name.
   - In the 720's half-way towns, **98 of the 171 missing-house names are a house the town holds**: "Fulling mill" with a Fuller in the town (58), and "Leatherworkers' guild" with a Cobbler's guild (40).
   - The alias is already written down twice: `resourceChains.js:311-315` (`MOTIVE_WATER_INDUSTRIES` names Fuller for Fulling mill) and `validationOnPage.js:243` (`tradeFinisherHere`). The gap record does not read either.
   - ONE FACT: the gap reads the finisher by its trade. This should remove most of these rows. **Measure it before taking it as the cure, because I have not traced every path of the gap's writer.**
   - What is left is real: a chain that prints finished goods its gap denies. That wants the chain's outputs (`computeActiveChains.js`) to read the gap.
2. **The idle crafts (L3.needed), mostly the vintner: two facts for one thing.**
   - The "Needed, and not brought in" line comes from `resourceAnalysis.imports.critical` (its reason reads "Required by Vintner but not available …").
   - The `Short of X.` mark reads `resourceAnalysis.gaps[].institution` (`crisisStoppedRow.js :: housesShortOfInput`).
   - The vintner is declared `input` (`crisisDependence.js:1277`) but is never in the gaps, so it is never marked, while the brickmaker is marked Short of clay.
   - ONE FACT: `housesShortOfInput` also reads the critical imports' named house.
3. **The outputs of a running chain (L3.outputs, L3.chainOverStopped): two deciders for one service.**
   - The chain's state (`chainStateShown.js :: chainCrisisStateShown`) and the service rows' marks (`crisisStoppedRow.js`) are decided apart.
   - ONE FACT: the chain's printed outputs take their services' marks, or the chain's state reads `serviceStateShown`.
4. **The failed food among the commodities (L3.failedFood).**
   - `ResourcesTab.jsx` lists the commodities from `resourceData.js`, and the Trade Profile lists what is produced locally. Neither reads `foodRecord.failedSource`.
   - ONE FACT: the failed source is marked where it is listed.
5. **The food model (L3.foodModel, L3.foodLineStopped).**
   - `foodSecurity.foodSources` leaves out the town's own Farmland. This is known and deferred: C39597 R2.
   - The food line (`foodways.js :: foodwaysLineOf`) does not read the fishing's stopped mark.

## 5. LAW 5 · THE STATIC INVENTORY (`law5-inventory.mjs`; every row in `tables/B.law5.inventory.json`)

What was read:
- Every string and template literal in the **31 source files of the pools that print**, as the brief lists them: houses and variants, services, hooks, ties, scenes, the state annex's generated leaves (`src/data/dossierStateProse/*.generated.js`, projected from `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`), food lines and defence lines.
- Each literal was read against the lexicon below.
- `WIDE=1` reads all of `src/`, about 1,040 matches, mostly code messages and rumour pools, and was not counted.

How a line declares (read from the live modules):
- its own object's `needs`, `excludes`, `crisis` or `twinOf`, or a `declaredSet(…)`;
- a declaration channel beside its table (the 30 `DECLARATION_CHANNELS` of `scripts/lib/table-pools.mjs`);
- the annex's `marks`;
- its row's dependence in `crisisDependence.js`.

The result:
- **244 distinct crisis-sensitive lines.**
- **158 are NOT declared for any crisis**: no crisis atom on the line, and no siege-stopped dependence on its row.
  - 101 declare nothing.
  - 20 are declared `colour` ("presumes nothing"), which is false for a line the lexicon catches. Examples are C43575's "the work never dries up" and C0333's "medicines brought from abroad".
  - 26 declare `needs` that are not the crisis. C0350's bowyer line declares `needs: ["watch","garrison"]` and nothing for the caravans.
  - 11 are annex lines drawn by a state key, a band of a measure that may or may not read the crisis. They are reported apart and not resolved here.
- 31 are covered at the row.
- 63 declare on the line; 37 of those with a crisis atom.

| file | sensitive lines | not declared for a crisis | declare nothing | colour | needs, no crisis atom | state-keyed (annex) | classes (of the undeclared) |
|---|---|---|---|---|---|---|---|
| `src/data/institutionDescVariants.js` | 51 | 28 | 5 | 13 | 10 | 0 | plenty 6, outside 19, iron 1, work 1, animals 1, law 1 |
| `src/data/institutionalCatalog.js` | 23 | 23 | 23 | 0 | 0 | 0 | plenty 1, outside 22, animals 2 |
| `src/data/institutionServices.js` | 50 | 20 | 17 | 0 | 3 | 0 | animals 4, iron 2, plenty 6, outside 8 |
| `src/data/cultureProfiles.js` | 17 | 16 | 10 | 0 | 6 | 0 | outside 15, plenty 1 |
| `src/data/dossierStateProse/general.generated.js` | 15 | 12 | 6 | 0 | 0 | 6 | outside 8, plenty 4 |
| `src/data/dossierStateProse/economy.generated.js` | 11 | 7 | 1 | 4 | 0 | 2 | outside 4, plenty 4 |
| `src/components/new/dailyLifeLogic.js` | 6 | 6 | 6 | 0 | 0 | 0 | outside 6 |
| `src/data/arrivalProse.js` | 21 | 5 | 3 | 1 | 1 | 0 | outside 5, plenty 1 |
| `src/data/historyData.js` | 5 | 5 | 3 | 0 | 2 | 0 | outside 5 |
| `src/generators/economy/foodBalance.js` | 6 | 5 | 5 | 0 | 0 | 0 | outside 5 |
| `src/generators/economy/prosperity.js` | 5 | 5 | 3 | 0 | 2 | 0 | outside 5 |
| `src/generators/safetyProfile.js` | 5 | 5 | 5 | 0 | 0 | 0 | outside 2, law 3 |
| `src/data/narrativeData.js` | 5 | 4 | 4 | 0 | 0 | 0 | outside 4 |
| `src/data/npcData.js` | 5 | 4 | 2 | 2 | 0 | 0 | outside 3, plenty 1 |
| `src/domain/dailyLife.js` | 4 | 4 | 4 | 0 | 0 | 0 | plenty 2, outside 2 |
| `src/data/dossierStateProse/stressors.generated.js` | 4 | 3 | 3 | 0 | 0 | 0 | outside 2, plenty 1 |
| `src/data/dossierStateProse/defense.generated.js` | 3 | 2 | 0 | 0 | 0 | 2 | outside 2 |
| `src/generators/economy/incomeLineSiblings.js` | 6 | 2 | 0 | 0 | 2 | 0 | outside 2 |
| `src/data/dossierStateProse/power.generated.js` | 1 | 1 | 0 | 0 | 0 | 1 | outside 1 |
| `src/domain/foodways.js` | 1 | 1 | 1 | 0 | 0 | 0 | plenty 1 |
| **all** | 244 | 158 | 101 | 20 | 26 | 11 | |


THE LEXICON (`LEXICON` in `law5-inventory.mjs`, six classes):
- `outside`: from abroad, imported, caravans, caravanserai, travellers, pilgrims or pilgrimage, merchants from, foreign merchants or goods, passing trade, outside buyers, from distant or far, trade routes, the roads in or out, ships calling, coaches.
- `plenty`: plenty, abundance, feasts, well-fed, never hungry, "without going hungry", fresh meat, bread, fish, milk, produce or game, full larders, beef, pork, mutton, the day's catch.
- `work`: steady work, "the work never dries up", never short of work.
- `animals`: horse hire, renting horses or animals, fresh mounts, draught animals, cart hire.
- `iron`: reforge, mend tools, re-edge, tool manufacture, weapon smithing, ironwork.
- `law`: "thief is known", "until they make it right", crime is rare, doors unlocked, the courts sit, disputes are settled.

ITS MISSES ON THE CONTROLS (`tables/B.law5.lexicon-controls.json`):
- LAW 2: the lexicon catches 11 of the 12 STANDS. It misses **C0927** ("Rare medications … through district-wide sourcing"). That line is false only because the page says its herbs come from outside, so LAW 2's `siege.cutgood` rule catches it and no word list can. Three of the twelve (C3231, C8174, C8475) are service CHIPS; their names are keys, not prose, and their sensitivity lives in `SERVICE_DEPENDENCE`.
- LAW 3: the lexicon misses all ten STANDS. This is expected: LAW 3 is a disagreement between tabs, not a word, and no static list can see it.

THE SOURCE OF EACH LAW 2 CONTROL, and how it declares:
- C0333 and C5441: `institutionDescVariants.js:1004`, declared `colour`.
- C0350, C3223 and C5452: `institutionDescVariants.js:1007-1008` and `institutionalCatalog.js:693`, declared `needs: ["watch","garrison"]` only.
- C43575: `institutionDescVariants.js:403`, declared `colour` (`institutionDescColour.js:157`).
- C42116: `safetyProfile.js:1018`, which declares nothing.
- C11307: the hook `foodBalance.js:831`, which IS declared (`needs: institution: smith`, `excludes: war: peace`). The false half is the unmarked row.
- C0927: `institutionServices.js:733`, whose row dependence is NONE.

WHAT LAW 5 CANNOT SEE:
- Lines composed from record names (the chains' outputs, the commodity lists).
- The crises that have no reach rule here: plague, occupation, insurgency and the other eleven crisis kinds. The 720 holds 478 towns with a crisis; seat B's rules read siege, famine, war and the law band.
- The occupied town has no rule because no control shows its reach.

## 6. FOR THE OWNER, IN PLAIN WORDS

**LAW 2 (a crisis's reach, unmarked):**
- In the 720 it stands in 48 towns (83 lines).
- In the fresh 300 it stands in 51 towns (120 lines).
- About nine in ten of what the detector finds is a real fault.
- Most of it is **five kinds of line**:
  - one defence sentence that says a thief is shunned in a town whose law has collapsed;
  - house and service descriptions that sell to caravans, travellers or "from abroad" in a besieged town;
  - medicines offered when the page says the herbs are cut off;
  - smiths' repairs when war has taken the iron;
  - horse hire when the army holds the horses.
- Behind them are **a few facts**, not hundreds of lines:
  - the mark reads a dependence list that does not know what the descriptions say;
  - the marks cannot reach a war at all.
- In the source, 158 of the 244 crisis-sensitive lines of the printing pools are not declared against any crisis.

**LAW 3 (one thing in two states on two tabs):**
- In the 720 it stands in 134 towns (211 lines), and in the fresh 300 in 66 towns.
- Half of it is one rule, the "half-way" chains: the page says wool or hides are worked only half-way, while its own flows make cloth and boots.
- In those towns, the check for "is the finishing house here?" looks for a "Fulling mill" or a "Leatherworkers' guild". Of the 171 houses it calls missing, 98 are there, as a Fuller or a Cobbler's guild.
- The next cause is the vintner: "grapes needed and not brought in", while the vintner is never marked short.
- The rest are chains printed Running over stopped services, and failed harvests still listed as on offer.

**Where one change cures many:**
- the house aliases in the gap check;
- the vintner's short mark reading the import list;
- a war entry for the marks (that one is yours to decide, as a widening);
- the dependence of about a dozen house and service rows.
