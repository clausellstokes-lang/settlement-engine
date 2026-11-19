# BAR3-SERVICES-3 · hand-back (kept current in every push)

Seat BAR3-SERVICES-3 (group SERVICES), successor of BAR3-SERVICES-2, branch `lane/bar3-services-2026-11-15`. Started at
its tip d29d2fb43 (as told; the line at 52f0a1684 already merged on it, 7a57fc34f). The two earlier hand-backs beside this
file stay as they are. The second tree of my books is 52f0a1684.

## The rulings worked to (the chair's, 2026-11-15; each vetoable by the owner)

- SV8 (20:08 UTC): the field work beyond the gates under a siege: the mark follows the record's own reading of the siege,
  town by town; where the record says the work goes on, unmarked or curtailed as the record bears; where it says the
  siege cut it, the siege's mark; where the record cannot tell the two apart, STOP with the table.
- SV7b (20:55 UTC): a siege twin that says the house goes on, thinly, is a row still on offer (its house reads
  "Curtailed by the siege." by SV7's rule); a twin that says the service stopped leaves the house "Stopped".

- SV8b (21:45 UTC): the fishing houses and the hunter's lodges follow the record's own reading (copied whole under
  batch 4).
- THIS IS MY HAND-BACK: by time (about eighty minutes); after this push I push nothing more.

## Batch 3 — SV8 and SV7b, one rule each at the leaf

### SV8: THE MEASURE FIRST (`sv8.mjs`, `grown.mjs`: the 720 at d29d2fb43, every live field house of a siege town)

40 houses in 26 siege towns printed unmarked (farmland 7, subsistence farming 11, charcoal burner 6, mine 5, salt works
3, dairy farmer 3, woodcutter's camp 2, shepherd 2, beekeeper 1: my predecessors' count, re-measured exactly). The
record's reading of the siege, town by town:
- THE FOOD BALANCE: every one of the 31 siege towns of the 720 keeps a grown share (`foodSecurity.foodRecord.grownPct`)
  of 14 to 43 in a hundred: the generator keeps a third of what the land grows (`foodBalance.js`: `productionMult *=
  SIEGE_PRODUCTION_KEPT`, 0.3) and the page says so in that town's own words ("The crisis has left about a third of the
  usual local food production.", r2r-village-21; "Rotbrücke grows far less food than it needs").
- THE CHAINS: of the 78 own-ground chain cards in those 31 towns, 61 print "impaired" (57 running -> impaired, 4
  impaired), 15 keep "vulnerable", 1 "magically sustained", 1 a port's sea "running": NONE prints stopped. Every field
  house above with a chain on the record (charcoal 3, mine 4, salt 3, beekeeper 1, subsistence 6 by its forage chain)
  reads that chain impaired or vulnerable.
- NO siege town's record says the field work was cut (no grown share of 0, no field chain stopped). THE RECORD TELLS THE
  TWO APART AND SAYS, IN EVERY TOWN: THE WORK GOES ON, CURTAILED. Not a stop.
- ONE VOICE OF THE RECORD SAYS OTHERWISE, AND IT IS NOT MINE: the siege's general viability note "Field work and trade
  have stopped, and everything now turns on how long the food and water last." (`src/data/stressTypes.js ::
  STRESS_TYPE_MAP.under_siege.viabilityNote`, printed four times on r2r-village-21's page) and the food note "... the
  outlying farms are abandoned or burned. What is already in store is all there will be until it lifts."
  (`src/generators/economy/foodBalance.js`) contradict the same page's "about a third of the usual local food
  production". NAMED for the chair (the stress data's and the food balance's holders): the house mark follows the
  figures, which every town's record holds.

### SV8: THE CURE (declarations in `src/data/crisisDependence.js`, one rule in `crisisStoppedRow.js`)

- A new dependence `FIELD_WORK` ('field work': the town's own land worked: fields, herds, hives, woods, pits, pans),
  declared on the ten field houses: farmland, subsistence_farming, charcoal_burner, mine, salt_works, dairy_farmer,
  woodcutter_s_camp, shepherd, beekeeper, and shepherd_collective (the same flocks held in common: the class; in no siege
  town of the 720). No vocabulary atom: a declaration in my data file, as GATES is.
- `crisisStoppedRow.js :: CURTAILED_BY`: under a siege `FIELD_WORK` is CURTAILED, not stopped: a row living on it alone
  takes the siege's partial kind `under_siege:curtailed` (SV7's), whose mark is "Curtailed by the siege.", door word
  "curtailed", head line the siege's. A row living on what the siege stops as well stays stopped; a later crisis that
  stops the row (a famine on the dairy's livestock) marks it before the curtailment. The rows of each house carry it by
  SV1 (Grain at harvest, Fresh milk, Livestock management, Honey, Salt production, Raw extraction, Charcoal supply; and on
  the same menus Cheese, Butter, Cream, Wool shearing, Livestock sales, Beeswax, Mead (small batch), Cured goods, Wood
  management, Surplus sale where they print: each lives on the same land).
- Calm towns, outbreaks and famines: unchanged (FIELD_WORK is read by the siege alone).
- AFTER (the same corpus, the tree's own leaf): 40 of 40 houses read "Curtailed by the siege."; 0 unmarked. Their 27
  printed rows likewise.

### SV7b: THE MEASURE AND THE CURE (`sv7b.mjs`)

The siege twins of `institutionServices.js :: SERVICE_DESC_SIBLINGS`, read by their own words: TWO say the service goes
on, thinly: the coaching inn's "Lodging" ("Beds, meals, and stabling, though with the roads held the rooms stand mostly
empty.") and the daily market's "Fresh produce" ("Whatever the kitchen gardens still give, sold early and gone by
mid-morning."); FOUR say it stopped (the external mill's "ground by hand at home", the fair's "None can reach it", the
carriers' "wagons stand idle", the coaching inn's relay horses "none go out"). Declared once:
`crisisDependence.js :: SIEGE_TWINS_ON_OFFER` (the two texts); the leaf's SV7 test (`houseRowGoesOn`) counts such a twin
as a row on offer. Before: 6 coaching inns "Stopped by the siege." (r2r-metropolis-14, r2s-under_siege-town-0, -town-1,
-metropolis-0, -metropolis-2, -metropolis-3); AFTER: all 6 "Curtailed by the siege.". The external mill (11), the annual fair (2) and the
carriers' guild (2) keep "Stopped by the siege.". The daily markets (4 siege cities) were marked by nothing before and
after: the declaration changes no line there.

### The batch's guard

`tests/components/bar3ServicesRows.test.jsx`, a third `describe` (batch 3): FIELD 9 pairs (the smallest town it reaches,
r2s-under_siege-thorp-0, to the largest, -metropolis-0; each house checked on the Institutions tab, the PDF's
`markedOnPage` and the Journal, and its row on the Services tab, a short mark of S5 allowed between), ON_OFFER 2 coaching
inns (tab, PDF, Journal; "Lodging" printed with no door word): EVERY PAIR RED AT 52f0a1684 (my two source files put back
to that tree's, run alone: FIELD and ON_OFFER red, KEEP_FIELD green; the base stands as the plant); KEEP_FIELD 4 (a calm
mine, a farmland under an outbreak: unmarked; a farmland under a famine: "Scarce in the famine."; the external mill under
a siege: "Stopped by the siege."), green at both. Green at the tip: 8 of 8.

### Gates (batch 3, at the tip)

eslint on the three touched files: exit 0. `typecheck:domain:strict`: exit 0. `typecheck:ratchet`: OK (167, ceiling
167). The pins of the symbols I changed, each alone, green: `crisisStoppedRows` (11), `bar2ServicesRows` (5),
`displayEconCrisisMarks` (5), `journalMarksCrisisRows` (16), `tailExportsPdf2Batch2` (3), `generationWorkerLazy` (6, 5
skipped). The three corpus walkers (amendment 11) name no offender in my file (each red at the base for the bar2 files
my predecessor named).

### The inventory diff (batch 3: d29d2fb43 -> my tip, the 720)

Read whole (`inventory_diff.py before.json after.json`): sentences 30033 -> 30042; gone 0; new 9; fewer 9; more 1.
- IN FEWER TOWNS, EVERY ONE MINE AND EXPLAINED: the Institutions tab's door rows of the field houses' services, each
  moved by exactly its towns to its "(curtailed)" form: Grain at harvest 115 -> 108 (+7 "(curtailed)"), Charcoal supply
  115 -> 110 (+5) and "(short)" 38 -> 37 (+1 "(curtailed, short)"), Salt production 64 -> 61 (+3), Raw extraction 85 ->
  82 (+3) and "(short)" 40 -> 38 (+2 "(curtailed, short)"), Fresh milk "(short)" 20 -> 17 (+3 "(curtailed, short)"),
  Livestock management 46 -> 44 (+2), Honey 5 -> 4 (+1): 27 rows, the measure's 27 printed rows. The calm towns keep
  every one.
- IN MORE TOWNS: "Curtailed by the siege." 11 -> 31 towns (the 40 field houses and their rows in 26 siege towns, and the
  6 coaching inns of SV7b, whose towns already printed "Stopped by the siege." on other houses and keep it: "Stopped by
  the siege." prints in no fewer towns).
- THE INHERITORS (10, all read): the nine "(curtailed)" door rows and "Curtailed by the siege." itself, in the towns
  above; each is the cure's own line. Nothing else moved.

## Batch 4 — ruling SV8b (the chair's, 21:45 UTC; vetoable by the owner)

THE RULING, AS SENT: "THE MARK FOLLOWS THE RECORD'S OWN READING, AS FOR THE FIELDS: (a) THE FISHING HOUSES (10): they read
the same fact the chain's own card reads: where the record holds the water open under this siege (the display's leaf for
an open sea, `seaOpenTo`, or the chain's own state), the house is Curtailed or unmarked as that fact bears; where the
record holds the water closed, Stopped stands; (b) THE HUNTER'S LODGES (3): Stopped stands (the grounds lie beyond the
walls) UNLESS the food record's share under the siege counts game for that town: then Curtailed. Measure each town first;
if the record cannot tell, they stay as they are and you say so."

THE MEASURE (`sv8b.mjs`, the 720 at b47e7ac74: every fishing community, fisher's landing and hunter's lodge of a siege
town; all 13 read "Stopped by the siege." before):
- FISHING (10): none is a port (`tradeAccess` river, road or crossroads), so `seaOpenTo` opens no water. THREE work a
  fishing chain on the record whose card reads the work going on: r2r-village-21 (fishing_grounds: running -> impaired),
  r2s-under_siege-hamlet-0 (river_fish: impaired; fishing_grounds: vulnerable), r2s-under_siege-village-1 (river_fish,
  depleted: vulnerable): CURTAILED. SEVEN work no chain on the record (r2r-thorp-45, r2r-thorp-58,
  r2s-under_siege-thorp-0, -thorp-3, -hamlet-1, -hamlet-2, -village-3): THE RECORD CANNOT TELL: "Stopped by the siege."
  STANDS. (For the chair: the food record counts fish in the grown share of all ten; the ruling reads the chain, so I did
  not cure by the food record.)
- HUNTING (3): r2s-under_siege-hamlet-3's food record counts game (`foodSources` = game): CURTAILED.
  r2s-under_siege-town-0 (fish only) and -town-1 (none): STOPPED STANDS.

THE CURE: `crisisDependence.js :: GATES_WORK_HELD_BY_RECORD` (hunter_s_lodge: foodSource game; fishing_community and
fisher_s_landing: waterGrounds fishing_grounds, river_fish) and `crisisStoppedRow.js :: houseDependenceIn`. Under a siege,
where the town's record holds the house's work beyond the gates going on, the house's `beyond the gates` becomes
`field work` (SV8's curtailment: "Curtailed by the siege."). Where the chain's card keeps a working state (a port's open
sea: no town of the 720), it is dropped instead. The house's rows follow it by SV1. AFTER (the leaf over the same
corpus): 4 houses read "Curtailed by the siege." (3 landings, 1 lodge), with their 6 rows (Fresh fish 3, Salted fish 1,
Game meat 1, Hunting guide hire 1); the 9 others keep "Stopped by the siege.".

THE GUARD: `bar3ServicesRows.test.jsx` batch 3's FIELD table + 3 pairs (r2s-under_siege-hamlet-0 fisher's landing "Fresh
fish", -hamlet-3 hunter's lodge "Game meat", r2r-village-21 fisher's landing "Salted fish"): each red at b47e7ac74, and so
at 52f0a1684, on the tab, the PDF, the Journal and the Services tab. KEEP_FIELD + 2 (r2s-under_siege-thorp-0 fishing
community, -town-1 hunter's lodge: "Stopped by the siege."), green at both. 8 of 8 green at the tip.

THE PIN MOVED BY THE DECLARED CURE (a guard of the line, re-keyed by identity beside a dated note):
`tests/components/crisisStoppedRows.test.jsx`, S8's r2s-under_siege-hamlet-3 hunter_s_lodge: "Stopped by the siege." ->
"Curtailed by the siege." (11 of 11 green).

GATES (batch 4, at the tip, each alone): eslint exit 0; `typecheck:domain:strict` exit 0; `typecheck:ratchet` OK (167,
ceiling 167). Green: `engineCoreLazyEdge` (the new import `crisisStoppedRow.js -> ./chainStateShown.js`, a display leaf
beside it), `factLayers`, `layerBoundaries`, `writerReach` (no register row moved), `observedShapeReaders`,
`chainPrintSites`, `ruinFilterRoster`, `tuningRegister`, `presumedThings`, `proseWiringCensus`, `crisisStoppedRows`,
`bar2ServicesRows`, `displayEconCrisisMarks`, `journalMarksCrisisRows`, `tailExportsPdf2Batch2`,
`generationWorkerLazy`. The three corpus walkers are red at the base only, naming neither of my files. NOT RE-RUN: the
census after batch 4 (my budget). The cure moves no record, and its reach is measured by the tree's own leaf over the
after corpus (above). A successor runs `census3.sh` at the tip and `inventory_diff.py after.json after4.json`; expected:
the 6 rows' door words "(stopped)" -> "(curtailed)" and "Curtailed by the siege." in 4 towns more at most, nothing else.

## THE BOOKS (amendments 2, 10 and 11: my tip against 52f0a1684)

- (a) the files that pin what I changed (`HOUSE_DEPENDENCE`, `rowStoppedBy`, `houseRowGoesOn`, `houseDependenceIn`, `markedOnPage`, the
  marks): all green at the tip (above). None is red, so none was run at 52f0a1684.
- (b) THE LAW SUITES, each alone at the tip through `gate-tail.sh` (my predecessor's "not run" first): GREEN:
  `defenceFactReaders` (22), `noLegacyFactionReaders` (4), `siteCoherenceRatchet` (9), `tuningRegister` (76),
  `chainPrintSites` (6; no `dist/` in my tree), `factLayers` (15), `layerBoundaries` (8), `engineCoreLazyEdge` (3),
  `presumedThings` (43), `ruinFilterRoster` (12), `observedShapeReaders` (47), `writerReach` (52), `proseComposed` (87),
  `proseEntryContradiction` (29), `proseWiringCensus` (79), `rosterDuplicateDraws` (3), `hookThemeDraws` (13),
  `upkeepVocation` (2). `pipelinePinnedMode`, `generationForkCensus`: golden-derived, red at the base on purpose (amendment 10): not
  re-taken, not mine.
- RED AT BOTH TREES WITH THE SAME MESSAGE (the base's): `negativeAssertionAnchor.walker` (2 failed),
  `seedLoopTotality.walker` (2 failed), `proseDrawnAnchors.walker` (1 failed): the same bar2 offenders my predecessor
  named; none is my file.
- A LAW RED AT MY TIP ONLY: none.
- THE BOOKS MY CURES MOVE: NONE (no golden, digest, count or register row; the pins moved are guards of the line,
  re-keyed by identity). My batch changes `src/data/crisisDependence.js` and
  `src/domain/display/crisisStoppedRow.js`, which no generator imports (`grep -rl` under `src/`: the tabs, the PDF, the
  Journal, `economicsCrisisMarks.js`, and a comment row of `goods.schema.js`): no record moves: 0 OF THE 525 REFERENCE
  CONFIGURATIONS (by construction; against 52f0a1684 the generator tree differs only by my first predecessor's
  `servicesGenerator.js` rows, which it measured at 0 of 525).
- MANIFEST ENTRIES OWED: none (no new file under `tests/generators`). ROSTER ROWS OWED: none (no new goods import).

## Every new or changed line (THE VETO LIST)

| line | towns it is read in |
|---|---|
| (SV8) "Curtailed by the siege." on a field house (farmland, subsistence farming, charcoal burner, mine, salt works, dairy farmer, woodcutter's camp, shepherd, beekeeper) and on its rows, the door word "curtailed" | r2s-under_siege-thorp-0 (thorp: Subsistence farming), r2s-under_siege-village-0 (village: Farmland "Grain at harvest", Dairy farmer "Fresh milk", Charcoal burner "Charcoal supply"), r2s-under_siege-metropolis-0 (metropolis: Charcoal burner) |
| (SV8b) "Curtailed by the siege." on a fisher's landing whose fishing chain the record holds, and on a hunter's lodge whose food record counts game; on their rows, the door word "curtailed" | r2s-under_siege-hamlet-0 (hamlet: Fisher's landing), r2s-under_siege-hamlet-3 (hamlet: Hunter's lodge), r2r-village-21 (village, a siege: Fisher's landing); the largest it reaches is a village |
| (SV7b) "Curtailed by the siege." on a coaching inn whose "Lodging" is the siege twin that goes on | r2s-under_siege-town-0 (town), r2s-under_siege-metropolis-0 (metropolis), r2r-metropolis-14 (metropolis, a siege) |

## Left, in order (for a successor)

1. THE CENSUS AFTER BATCH 4 (owed: see batch 4): `census3.sh` at the tip, `inventory_diff.py` against my `after.json`.
2. SV8b'S ONE OPEN QUESTION, FOR THE CHAIR: the seven fishing houses whose water runs no chain on the record keep
   "Stopped by the siege." though the food record counts fish in the share those towns still grow (the ruling reads the
   chain; I did not cure by the food record). The two lines I named (the siege's "Field work and trade have stopped";
   the stores line) are routed by the chair (the places seat; the economy branch): not mine.
3. The first hand-back's items 3 and 4: r2s-plague_onset-thorp-2's depleted fishery with no chain; the salt works on
   spent flats beside live fishing grounds; the mine on no ore ground (r2r-metropolis-14 and r2s-under_siege-metropolis-3
   work depleted iron deposits: they now read "Curtailed by the siege." too). NOT STARTED (my budget).
4. NAMED FOR OTHER SEATS (unchanged): C24313 (BAR3-PLACES), C33899 (BAR3-PEOPLE), "Fake relics ... corrupt clergy"
   (`safetyProfile.js`'s holder), the market's "stall fee" line under a siege (the state-prose corpus's holder).

## How the instruments are re-made

`git archive` of `docs/chair/2026-11-14/probes/READ-ALL` (chair's lane) and `.../CENSUS-3` (census lane) to the scratch
directory; `census3.sh <tree> <out> 4 --count-only` (about 15 minutes here; NOTE: the render reads the tree live but
each worker loads the code once at its start: never edit the tree's `src/` while a run is in its births); `inventory.py
<out> <json>`. My measures (each a few lines over `corpus.ndjson.gz` with the tree's own leaf, `TREE=<tree>
CORPUS=<out>/corpus.ndjson.gz node <script>`): `sv8.mjs` (every field house of a siege town: its mark, the grown share,
its chains' states as the card prints them, its rows' marks), `sv8b.mjs` (the fishing houses and hunter's lodges of siege towns: access, grounds, food sources, chains as the card
prints them, marks), `grown.mjs` (the siege towns' grown shares and every
own-ground chain's state), `sv7b.mjs` (the houses beside a siege twin, by twin, with the house's mark), `keep.mjs` (the
field houses by crisis and mark).
