# TAIL-EXPORTS-PDF · hand-back (kept current after every batch)

Seat: TAIL-EXPORTS-PDF (a builder seat of THE EXPORTS). Branch `lane/tail-exports-pdf-2026-11-14`, cut from the joined
line `lane/join-2026-11-14` at **48fedbe98** (read back from origin 2026-11-14 23:59 UTC). Worklist: the chair's
`docs/chair/2026-11-14/read-all-3/WORKLIST3-EXPORTS-PDF.{md,json}` (137 rows) and the three `PDF/` rows of
`WORKLIST3-REST` not written by spatialGenerator.js (04297, 25077, 25075): 140 rows. At the base every row's fold
still printed (none "gone at the base").

## The rulings worked to (the chair's, 2026-11-14; each vetoable by the owner)

- **E1** THE EXPORT PRINTS WHAT THE TAB PRINTS, THROUGH THE TAB'S OWN LEAF. Where the tab composes inline, a NEW leaf
  under `src/domain/display/`, called by the PDF; the component's switch to it is named for the group that holds it.
- **E2** A slash label is not a name (prose form from `powerSentenceName.js`); "X governs, with Y pressing close behind"
  reads the two powers' own strengths, and where Y is the stronger the line takes a twin true of that order.
- **E3** Under a crisis the laws of BRIEF-TAIL stand; a row that lives on what the crisis stops is marked by the SERVICES
  seat's one leaf (`crisisStoppedRow.js`, lane/tail-services-2026-11-14, ruling S1): call it once it is on the branch.
- **E4** The readers' header showed no seat (`npcs[].memberships`) and no live tensions (`history.currentTensions`):
  rows resting on either are checked against the record first.
- **E5** A label with no value is checked in the dump before it is believed; a real one is cured by not printing the
  label without its value.
- **E6** Measured with the exports' inventory (`SURFACES=PDF,Journal inventory.py`), `inventory_diff.py`; at the last
  batch the tabs' inventory too, before and after.
- **E7** A gendered title against its holder is the record's: struck "the record's: RECORD-MEASURE-2, class k".
- **P1** The widest rows first (black market, luxury goods, imports cover, armed citizens, the enforcement words, the
  headlines of `src/pdf/lib/headlines.js`).

## Instruments, and how they are re-made

- The census: `git archive origin/lane/census-3-2026-11-14 docs/chair/2026-11-14/probes/CENSUS-3` to a scratch dir;
  `sh <probes>/census3.sh <tree with node_modules> <out-dir> 4` (the after runs with `--count-only`: the inventory reads
  only `corpus.ndjson.gz` and `dumps/`). About 11 minutes of births and render here, 5 of count and trace.
- The inventory: `git archive origin/lane/chair-2026-11-08 docs/chair/2026-11-14/probes/READ-ALL` (as it stood at
  2026-11-14 23:59 UTC, with the SURFACES switch); `SURFACES=PDF,Journal python3 inventory.py <run> <out.json>`;
  `python3 inventory_diff.py before.json after.json worklist.all.json` (the 140 rows as one json list).
- Verification by record: a small reader over `corpus.ndjson.gz` and the dumps' `== <surface>/<section> ==` blocks
  (not committed; each measure below names the record fields it read).

## Batch 1 — the widest rows (P1): the PDF's economics, overview and defence chapters, and the power headline

Writers: `src/pdf/sections/EconomicsTrade.jsx`, `Overview.jsx`, `DefenseSecurity.jsx`, `ResourcesProduction.jsx`,
`src/pdf/lib/viewModelBodySlices.js` (the economics slice), `src/pdf/lib/headlines.js` (powerHeadline,
defenseHeadline, economicsHeadline). New leaves (E1): `src/domain/display/shadowEconomyShown.js`,
`criticalImportsShown.js`, `noForceLine.js`. Display only: no record moves (no field diff; nothing in generators or data).

Guard: `tests/pdf/tailExportsPdfBatch1.test.jsx` (births of the census's own seeds; NOT pairs each naming what prints
instead, KEEP pairs). At the base 48fedbe98: 12 NOT red, 7 KEEP green; at the tip: 19 green.

### Cured (towns printing, before -> after; the measure is where the row was false by the record)

| id | sentence | before -> after | measure (false by the record, before) | the cure |
|---|---|---|---|---|
| 05842 | Black market capture: N% of economy | 720 -> 476 | 244: a capture under 3, where the Economics tab prints no Shadow Economy block (`EconomicsTab.jsx`: `bmc < 3`) | the line prints at the tab's floor, with the tab's figure (`shadowCaptureShown`); the block's crime patterns and criminal chains print as before |
| 32399 | luxury goods (CRITICAL DEPENDENCIES; IMPORT DEPENDENCIES · CRITICAL) | 420 -> 115 | the terrain's need list printed raw; the tab prints a critical good only where an Imports pill meets it or as "Needed, and not brought in" (each held to its declaration: a thorp or a hamlet trades in no luxury goods) | both lists print `criticalImportsShown` (the tab's composition, `importsAsPrinted().needed` and the pills) |
| 24552 | Spices | 144 -> 88 | the same list | the same cure |
| 31993 | fine textiles | 144 -> 44 | the same list | the same cure |
| 32248 | imports cover N% of gap (PDF Overview) | 255 -> 252 | 3 towns where the tab's food row brings nothing in (a siege); in the rest the Overview printed the viability view's figures beside the tab's row (r2r-city-12: no deficit line beside the tab's "Short: 71 lbs/day") | the Overview's food line reads the tab's row (`foodCarrier.js :: foodBlockShown`), as the Economics chapter's block already did |
| 07849 | Defense relies on armed citizens. | 240 -> 0 | the PDF's own line beside a headline that said "no one under arms"; the tab prints its own line in all 240 | the tab's words through a leaf (`noForceLine.js`); the headline says "no organized force" |
| 26502 | The criminals outmatch those who keep order. | 220 -> 217 | 3: no criminal house, no crime pattern, no shadow share the tab prints (`criminalsStandHere`) | the Defense desk's own denial, "No criminal infrastructure has been identified." |
| 29174 | Those who keep order clearly outmatch the criminals. | 126 -> 85 | 41: the same | the same |
| 29175 | Those who keep order roughly match the criminals. | 101 -> 83 | 18: the same | the same |
| 01243, 11772, 01239, 07328, 08661, 12107, 16891, 08662, and the powerHeadline rows of one town | X governs, with Y pressing close behind. | of the 332 towns printing the shape, 188 had Y the stronger (`powerStructure.factions[].power`) | Y outweighs X | the twin "X holds the seat, but more weight lies with Y."; every power named in the line takes its prose form ("The Guard") |
| 30854, 14754, 14828 | the economics headline's export clause | 30854 3 -> 0 | the first export of the record's raw list ("transit trade", a toll), and an export named under a siege that stops trade | the headline names the first export the tab's Exports print (`tradeListsAsPrinted`), none where a siege stops trade; its food clause reads the tab's row |

### Struck (true by the record, one line each)

- 14590 "It leans on magic to hold.": the Overview tab's own reliance reading is Integral (181) or Relied upon (108) in all 289 towns that print it.
- 22724, 11233 "Rich/Good farmland": the line is the food record's own fertility multiplier (`foodSecurity.effectiveAgriculture`); the crisis's cut on the fields prints beside it.
- 26504 "The crisis has left about a third…": the viability's crisis multiplier (0.3 under a siege, 0.35 under a famine) is the siege's cut on the fields, not a famine's; the tab says the same ("what the town can still grow is not near enough").
- 31963 "druidic provision covers 28": the tab's own row prints "+ 28 by druidic provision" (the record's pounds; 5% is its share).
- 00567, 00570, 00468, 05244, 00568, 05243 ("Household Elder", "Headman", "Acting Household Elder"): the person's record role, seated by `memberships` (rank 1 of that power) (E4).
- 00464 "… carries the most weight": the record's own weight puts her first (`npcs[].power` 9, the top).
- 26502, 29174, 29175 where they still print: criminals stand by the record, and the line is the record's ratio.

### Every new or changed line (the owner's veto list)

| line (surface) | towns | read in (smallest · largest · a crisis) |
|---|---|---|
| "No organized force. Defense relies on individual armed citizens. No command structure, no training, no coordinated response." (PDF Defense & Security; the Defense tab's own words) | 240 | r2r-thorp-36 (5) · r2s-recently_betrayed-village-2 (394) · r2s-famine-hamlet-0 |
| "<Readiness>: no walls and no organized force." (PDF and journal Defense headline; was "no one under arms") | 146 + 72 + 23 | r2r-thorp-36 (5) · r2s-recently_betrayed-village-2 (394) · r2s-famine-hamlet-1 |
| "No criminal infrastructure has been identified." (PDF Overview, the enforcement row; the Defense desk's denial) | 62 | r2r-thorp-7 (9) · r2s-infiltrated-city-1 (3,578) · none under the four crises |
| "X holds the seat, but more weight lies with Y." (PDF and journal Power headline; the twin of "pressing close behind") | 188 | r2s-politically_fractured-thorp-0 (9) · r2s-succession_void-metropolis-3 (295,750) · r2s-under_siege-town-1 |
| a power in the headline in its prose form ("with The Guard pressing close behind", "more weight lies with The Guard") | 4 + 3 + … | r2s-recently_betrayed-town-3 (322) · r2r-town-28 (2,273) |
| the economics headline names the first export the tab's Exports print, none under a siege that stops trade, and its food clause reads the tab's row | 42 -> 54 "It grows less food than it eats, and nothing comes in…", and the export clauses re-keyed | r2r-village-21 (the siege), r2r-city-5, r2r-metropolis-24 |
| the PDF Overview's food line reads the tab's row ("Deficit: N · imports cover N% of gap · magical provision covers N", as the Economics chapter's block) | 274 -> 306 "Deficit: #" | r2r-city-12 (Short 71, as the tab), r2r-hamlet-14 ("magical", the tradition not held), r2s-under_siege-town-2 (no import under the siege) |


### Lines this batch silenced in other towns (explained)

Read whole in the exports' inventory diff (before 48fedbe98 -> this tree; 97 gone, 140 new, 83 fewer, 30 more):

- the terrain-critical goods the tab does not print (the same cure as 32399): gold/silver ore 200 -> 78, Metals 219 -> 130,
  Quality textiles 67 -> 24, Mountain Timber 168 -> 128, Desert Salt 50 -> 20, timber (for large vessels) 58 -> 36, Quality
  textiles and cloth 34 -> 13, Preserved provisions for winter 32 -> 18, iron ore, Grain, Salt, stone, Charcoal and fuel by a
  few; IMPORT DEPENDENCIES / CRITICAL 698 -> 636 and CRITICAL DEPENDENCIES 702 -> 658 where no critical good is left;
- SHADOW ECONOMY 720 -> 573: the heading where the block held only the 0–2% line (the crime patterns and criminal chains,
  true where the record holds them, still print: CRIMINAL SUPPLY CHAINS unchanged);
- the economics headline's export clauses naming "transit trade" (a toll the tab moves off its Exports) and the
  under-siege exports; their towns inherit the tab's first export or the bare food clause;
- "divine provision covers #" 82 -> 50: the 32 now print "magical provision covers #" in the Overview, as the Economics
  block and the tab do where the town holds no divine tradition (r2r-hamlet-14);
- the "pressing close behind" lines where the rival is the stronger (each inherits its twin).

THE TABS' INVENTORY (E6, this the last batch of this seat): before -> after, 0 gone, 0 new, 0 fewer; 3 sentences in one
town more (r2r-thorp-0's premium deity panel, "Patron deity" 717 -> 718): the first town a render worker draws, a cold
start of that panel; no file of this batch is in its closure. No tab sentence moved by these cures.

The residual's share in the economics slice keeps the canon's 0 where no gap is left (`parityContract.js` SHARED_FIELDS);
that change follows the after run and prints nothing (every reader of the share prints it only under a deficit).

### The three silences told to the chair before the push (not vetoed, 2026-11-15 01:04)

| silenced line | towns | why |
|---|---|---|
| "Black market capture: N% of economy" where N is under 3 | 244 (720 -> 476) | the Economics tab's floor (`shadowEconomyShown.js`) |
| the terrain-critical goods the tab does not print (Metals 219 -> 130, gold/silver ore 200 -> 78, Mountain Timber 168 -> 128, luxury goods 420 -> 115, and the rest above) | 44 lose the CRITICAL DEPENDENCIES block whole (702 -> 658); 62 the IMPORT DEPENDENCIES · CRITICAL block (698 -> 636) | `criticalImportsShown.js` |
| the economics headline's "transit trade" export clause | 25 | it names the first export the tab's Exports print (`tradeListsAsPrinted`) |

The chair's reason (for the record): E1 is fact by fact. Where the tab has a leaf for a fact, that leaf is the page's one
voice on it, and a second voice in the PDF that says more than the leaf was the readers' flag. It does NOT mean the PDF
may print nothing the tabs lack: a chapter's own content with no tab leaf stays and is judged by the record.

## Rows named for other groups

- The Economics tab's switch to `shadowEconomyShown.js` and `criticalImportsShown.js` (its inline `bmc < 3` and
  `shownCriticals`): DISPLAY-ECON (holds `EconomicsTab.jsx`).
- The Defense tab's switch to `noForceLine.js` (its inline `!hasAnyForce` line): DEFECON (holds `DefenseTab.jsx`). In 14
  towns the tab prints its line and the PDF does not (the PDF's FORCE_GROUPS and the tab's `hasAnyForce` read the
  forces differently): the PDF's, left for a later batch.
- 04297 "Agricultural Rents" (REST, `treasury.js :: INCOME_SOURCE_FORMS`): cured in this surface by E1 (an income row's
  home): not reached.

## What is left of the worklist

Batch 1 reached the P1 rows and the power headline. Left, by shape (ids in the worklist):

- E3, the crisis-stopped rows (Fresh meat 10661, Fresh bread 10652, Pastries 21359, Fresh produce 10665, Game meat 10827,
  Glass vessels 11208; the Services chains 11357, 11346, 06926/06925/06924/06927, 14345, 23255, 06946, 17048, 29819; the
  REST rows 25077, 25075): the SERVICES seat's leaf `crisisStoppedRow.js` is pushed on lane/tail-services-2026-11-14
  (73291c8e2); this branch does not hold it. The chair's call: land it on the joined line, or let this seat's next batch
  carry it.
- The tension parties printed slash-joined and as "Parties: A vs B vs C" (12337/21292, 08830/21270, 19353/21313,
  08832/21271, 16958/21310, 08229/21260, 21900/21318, 10541/21277, 16959/21311, 22265/21319, 21077/21316, 25433, 20948/21314,
  21325, 21330, 21327, 21315, 15728/21296, 26756/21332, 21320, 32723/21345, 21835, 12102): checked against
  `history.currentTensions` first (E4); not reached.
- The EXPORT pills and local-production words (17065, 10234, 21452, 16334, 04302, 07554, 10246, 10709, 22454, 10202, 22983,
  25129, 04300, 05888, 23156, 15575, 25173, 10860, 22340; Flour 10343, Milling 17068, Pottery 21728, Gemcutting 10863,
  Stoneworking 25018; ENTREPÔT 08499; Pilgrim Trade 01055; Agricultural Rents 04297): not reached.
- Court only 07370; THE RULING THREE OF … 25228/25218; the remaining headline rows (30855 river fish under a famine that
  failed fish, 17282 mineral salts, 29786 viability's caravans, 31610 the crisis lede under a governing power, 01241/20306 a
  governing power under a void or suppressed): not reached.


## Registers named stale, guards owed

- Registers: none re-taken. The prose-numerics baseline (`tests/lint/proseNumerics.test.js`), the golden view model, the
  observed-shape readers' walker, the writer-reach walker, layerBoundaries, houseLabelEverySurface and coherenceAgreeCures
  are red at the base 48fedbe98 and red identically here (the same failing assertions): carried, not this seat's. The
  presumed-things walker (`--check`) and the twelve-birth grid read the same as at the base.
- Gates at this tip: domain strict 1113 / ceiling 1113; type ratchet 167 / ceiling 167; eslint clean on the touched files.
- Guards owed: the tabs' switches to the three new leaves (DISPLAY-ECON, DEFECON) and a guard that the tab and the PDF
  read one leaf for each (a walker, once the tabs read them).

## For the successor (handed back at the budget line, 2026-11-15 01:08)

- FIRST ACT (the chair's E9/E10/E15-era notes): merge origin/lane/join-2026-11-14 AT eeaa06816 into this branch (a merge
  commit of its own, the only merge this seat makes), `npm ci` if the lockfile moved, and re-take the BEFORE census at
  the merged tree. The crisis leaf is whole there: `crisisStoppedRow.js :: rowStoppedBy(settlement, 'service' | 'house' |
  'chain' | 'income', row)`, `crisisMarkText`, `markedDescription`, `ordinaryTimesLine`, `STOPPED_WORD`; table
  `src/data/crisisDependence.js` (a chain by `activeChains[].chainId`, an income share by `incomeSources[].source`). Call it
  for the E3 rows listed above, and for REST 25077, 25075 (transit trade under a siege or a plague) and 04297.
- Chair note E15 (1): row 29296, the PDF cover's "Top export: Salted fish (naval route only)" in r2r-village-21 (no sea
  access, imports nothing on the record): the cover's route note is to read the town's own trade access, or the tab's
  leaf for it.
- Chair note E15 (2): STRIKE any row saying a chain prints "(impaired)" where the header said running under a siege:
  `chainStateOnPage.js` reads the Economics tab's `chainAsShown`, and under a siege the page's state is Impaired. (None
  of this batch's rows had that shape.)
- Instruments as above; this seat's runs were at /tmp (scratch) and are not carried: re-take them.

---

# TAIL-EXPORTS-PDF-2 · the successor's batches (kept current after every batch)

Seat: TAIL-EXPORTS-PDF-2, the successor of TAIL-EXPORTS-PDF, on the same branch (`lane/tail-exports-pdf-2026-11-14`),
continued from its tip 1ed03ef1e (read back from origin 2026-11-15 01:13 UTC). The batch above (batch 1) is the
predecessor's and was not redone.

## The chair's rulings since (2026-11-15; each vetoable by the owner)

- **E16** THE ONE KIND OF MERGE THIS SEAT MAKES: origin/lane/join-2026-11-14 AT eb054d53f (a merge commit of its own;
  `npm ci` again if the lockfile moved). That tip holds the crisis leaf whole (`src/domain/display/crisisStoppedRow.js`:
  `stoppingCrisesOf`, `rowStoppedBy(settlement, 'service' | 'house' | 'chain' | 'income', row, crises?)`,
  `crisisMarkText`, `markedDescription`, `ordinaryTimesLine`, `STOPPED_WORD`; its table `src/data/crisisDependence.js`),
  the first shift of twelve other groups and four declared moves of the record. After the merge, RE-TAKE THE BEFORE
  and strike any row gone there. A later tip is merged only if the chair names it (one is coming: the leaf's second
  cause, "Short of <input>.", and more houses in its table).
- **E17** THE E3 ROWS: the PDF's service, house, chain and income rows under a crisis CALL THE LEAF and print its mark and
  its head line as the tabs do; the PDF keeps no wording of its own for them. With them REST 25077, 25075 (the chain
  rows) and 04297 ("Agricultural Rents": checked against the merged tree first; its source is being renamed "Harvest"
  where no landlord stands, by another seat, not yet landed: if it still prints, leave it and name it).
- **E15** (1) Row 29296, the cover's "Top export: Salted fish (naval route only)" on a village with no sea access: the
  route note reads the town's own trade access (or the tab's leaf for it). (2) STRIKE the rows that say a chain prints
  "(impaired)" where the land says running, under a siege: the PDF calls the same reader as the tab.
- **E18** (named by the defence display's seat) row 28960, the PDF's "(Powerful)" label beside a thieves' power the
  record calls Minor or Suppressed: the label reads the power, or is not printed there.
- **E7 stands**: a gendered title against its holder is another seat's (TAIL-TITLES): struck "the record's: class k".

## The merge (E16)

538c6ea10 `merge(TAIL-EXPORTS-PDF-2, ruling E16): the joined line at eb054d53f`: clean, no conflict; the lockfile did not
move (one `npm ci` in the scratch tree). THE BEFORE re-taken at 538c6ea10 (census 720 towns, 0 birth errors; exports'
inventory: 35,855 distinct PDF/Journal sentences; the tabs' inventory: 30,037).

Gone at the merged base (struck "gone at the base"): the power-headline rows 23017, 09844, 12953, 08708, 21874, 09841,
09847, 29320, 16524, 20306, 06586, 08417 and 12102 (each printed nowhere), 30855 (the river-fish headline under a fish
famine: printed nowhere).

## Batch 2 — E17 (the crisis leaf on the PDF's rows), E15 (1) (the cover's export), E18 (a criminal house by its label), and the EXPORT badges of the chain flow (E1)

Writers: `src/pdf/sections/Institutions.jsx`, `Services.jsx`, `SupplyChainFlow.jsx`, `EconomicsTrade.jsx`, `Cover.jsx`,
`DefenseSecurity.jsx`; a new PDF lib file `src/pdf/lib/crisisMarksOnPage.js` (a thin reader over the tabs' leaf
`crisisStoppedRow.js`: it keeps no word of its own). Display only: no record moves (nothing in generators or data; the
view model is not touched: the joins are made in the sections, as T1-15's were).

THE CURES:
- **E17**: under a siege, an outbreak or a famine, the PDF's rows call the leaf (`rowStoppedBy`) and print its words:
  a house's description and a service row's description lead with the mark ("Stopped by the siege. …", as the
  Institutions and Services tabs print them); a service pill, which prints no description, takes the leaf's word after
  its name ("Accommodation (stopped)", as the Institutions tab's doors print it); a chain's card (Services chapter) leads
  its flow with the mark; a chain's row in the Economics chapter's flow and an income share take the mark; each chapter
  (Institutions, Services, Economics & Trade) prints the leaf's head line once, where at least one of its rows is
  marked (`ordinaryTimesLine`). The chair's rows: 11357, 11346 (the grain chains under a grain famine), 25077, 25075
  (the crossroads chain under a siege and an outbreak).
- **E15 (1)**: the cover names the first export the tab's Exports print (the economics slice's `exportsShown`,
  `tradeListsAsPrinted`), with the mark that list keeps, and none where a siege stops trade (`tradeStopped`).
- **E18**: the PDF's criminal operations name each house by its label (`institutionHouseLabel`): no catalogue grade
  ("(Powerful)").
- **E1, the EXPORT badges** (rows 17065, 10234, 21452, 16334, 04302, 07554, 10246, 10709, 22454, 10202, 22983, 25129,
  04300, 05888, 23156, 15575, 25173, 10860, 22340): an output of the Economics chapter's chain flow is badged EXPORT where
  the tab's printed Exports (`tradeListsAsPrinted`) hold it BY ITS OWN NAME, none under a siege that stops trade. The
  flow badged it by the good id, which is a family ("timber", "fuel", "clay", "leather": "Milled lumber" off "Shipbuilding
  timber", "Peat fuel" off "Coal", "Fired brick" off "Pottery and ceramics"), or by a first-word match ("Milled lumber"
  off "Milled flour"). The Economics tab's chain cards print no per-output badge (the dumps hold none); the web panel
  `SupplyChainsPanel.jsx :: ChainRow` carries the same family-and-first-word read and is named below.

Guard: `tests/pdf/tailExportsPdf2Batch2.test.jsx` (births of the census's own seeds; NOT pairs each naming what prints
instead, with the chapter's head line; KEEP pairs; CALM: a calm town marks nothing). At the merged base 538c6ea10:
16 NOT red, 7 KEEP/CALM green; at the tip: 23 green.

### Cured (towns printing, before -> after, by the exports' inventory diff; the measure is where the row was false)

| id | sentence | before -> after | measure (false by the record, before) | the cure |
|---|---|---|---|---|
| 11357 | Grain fields » Mills » Baked goods (PDF Services) | 3 of 68+3 printings marked "Scarce in the famine." | 3: the towns under a famine that failed the grain; the 68 unmarked are calm (64) or under an outbreak (4), which stops no grain | the leaf's mark (E17) |
| 11346 | Grain fields » Brewery » Ale (barrel), Beer (barrel), Malt | 2 marked of 12 | 2: the same; the 10 unmarked are calm | the same |
| 25077 | Strategic Crossroads » Toll bridge + Coaching inn + Customs house » Transit trade profit | 2 marked of 29 | 2: a siege (r2r-metropolis-14, the town read) and an outbreak; the 27 unmarked are calm (26) or a famine (1), which stops no road | the same |
| 25075 | Strategic Crossroads » Coaching inn » Transit trade profit | 1 marked of 3 | 1: the outbreak (r2s-plague_onset-city-0, the town read) | the same |
| (E17, the rows of the tabs' table) | 155 service and house rows and pills, 776 town-printings | each now carries the leaf's mark or word where the leaf stops it (e.g. "Hospitality" 369 -> 336 and "Hospitality (stopped)" 0 -> 19; "Gate control" 196 -> 181; "Grain milling (a day away)" 240 -> 224 and "… (scarce)" 0 -> 16) | the leaf's own rule, the tabs' marks | the same |
| 29296 | Top export: Salted fish (naval route only) | 1 -> 0 | 1: a village under siege whose tab prints "No significant exports." | the cover reads the tab's Exports (E15 (1)) |
| (E15 (1)) | the cover's "Top export: …" | 61 covers change: 43 name the tab's first export instead ("Transit trade", a toll the tab moves off its Exports, 32 -> 0); 18 print none (13 under a siege; 5 whose tab prints "No significant exports.") | the record's raw first export beside the tab's list | the same |
| 28960 (the PDF's form) | Thieves' Guild (Powerful) | 44 + 1 -> 0 | 45: of the towns printing it, the record holds no thieves' power in 28, a Minor or Suppressed one in 15, a Significant one in 2; none Powerful | the house's label (E18) |
| 17065 | Milled lumber EXPORT | 91 -> 13 | 78: not on the printed Exports by name | the badge reads the printed Exports by name |
| 10234 | Fish oil EXPORT | 77 -> 49 | 28 | the same |
| 21452 | Peat fuel EXPORT | 76 -> 21 | 55 | the same |
| 16334, 04302, 07554, 10246, 10709, 22454, 10202, 25129, 04300, 05888, 23156, 15575, 25173, 10860, 22340 | Master-crafted weapons 58, Agricultural surplus 18, Crossbow bolts 17, Fishing boats 13, Fuel wood 8, Refined ingots 8, Fired brick 6, Structural timber 4, Agricultural produce 3, Boots and shoes 2, Saddles and harness 2, Leather armour 2, Surplus food 2, Gem appraisal 2, Raw gemstones 1 · EXPORT | each -> 0 | every printing | the same |
| 22983 | Roof tiles EXPORT | 6 -> 4 | 2 | the same |

### Struck (true by the record, or the tab's own twin; one line each)

- 10661 Fresh meat, 10652 Fresh bread (under a siege), 21359 Pastries, 10665 Fresh produce (under a famine): the PDF now
  prints them as the tabs do, through the leaf, and the leaf's table (`crisisDependence.js`) holds no dependence the
  crisis stops for them (a siege stops travellers and goods, not the town's own meat and bread; the famines read failed
  fish or livestock where these print, or the table holds Pastries and Fresh produce on nothing). NAMED for TAIL-SERVICES
  (the table): 274 -> 273, 262 -> 258, 143, 116 (the few now marked are a famine of their own food).
- 04297 "Agricultural Rents": STILL PRINTS at the merged tree (PDF Economics & Trade and the Economics tab alike,
  "Payments in kind or coin from tenant farmers"); left, and NAMED for the seat renaming the source "Harvest" (E17).
- 10343 Flour (PDF Economics & Trade): the tab's "Produced locally" prints flour in every one of the 82 towns the PDF
  does (`localProductionAsPrinted`); 17068 Milling, 21728 Pottery, 10863 Gemcutting, 25018 Stoneworking (PDF Resources &
  Production): the Resources tab prints each in every town the PDF does (50, 11, 10, 8). The tab's twin (E1); named for
  the group of the Resources tab.
- 07370 "Court only": the Defense tab prints it in the same 102 towns through the same leaf (`defenseDisplay.js`); E1,
  named for DEFECON.
- 25228, 25218 "THE RULING THREE OF …": seated by `npcs[].memberships` (ranks 1-3 of that power, r2r-hamlet-12); the Power
  tab prints the same (E4).
- The tension parties (12337/21292, 08830/21270, 19353/21313, 08832/21271, 16958/21310, 08229/21260, 21900/21318,
  10541/21277, 16959/21311, 22265/21319, 21077/21316, 25433, 20948/21314, 21325, 21330, 21327, 21315, 15728/21296,
  26756/21332, 21320, 32723/21345, 21835, 12102): the parties are the record's live tension's own
  (`history.currentTensions[].factions`): 34 of the 38 rows match it word for word in the town read; 21900/21318 are its
  "Pro-magic"/"Anti-magic" humanized; 21077 and 12102 no longer print in the town read at the merged base (E4).
- 16735, 09845, 09822, 07329 (the power headline, one town each at the base): the governing power is the stronger by the
  record's own figures there (49/36, 38/37, 33/27, 18/16): true; the batch-1 twin holds the other order.
- Gone at the base: see the merge, above.

### Every new or changed line (the owner's veto list)

| line (surface) | towns | read in (smallest · largest · a crisis) |
|---|---|---|
| "The descriptions here are of ordinary times. While the siege lasts, a row it touches is marked." (PDF Institutions, Services, Economics & Trade; the tabs' leaf, `ordinaryTimesLine`) | 31 | r2r-thorp-45 · r2r-metropolis-14 · (all under the siege) |
| "… While the famine lasts, a row it touches is marked." | 41 | r2r-thorp-38 · r2s-famine-metropolis-0 |
| "… While the outbreak lasts, a row it touches is marked." | 28 | r2r-thorp-41 · r2s-plague_onset-metropolis-0 |
| the leaf's marks before a row's description ("Stopped by the siege.", "Scarce in the famine.", "Curtailed by the outbreak.") on the PDF's houses, service rows, chain cards and flow rows, and income shares | 29 / 41 / 27 | r2r-thorp-45 · r2r-metropolis-14 · r2s-famine-city-3 |
| the leaf's word after a pill's name ("Accommodation (stopped)", "Fresh bread (scarce)", "Lodging (curtailed)") (PDF Services) | e.g. "Hospitality (stopped)" 19 | r2r-thorp-45 · r2s-under_siege-town-0 · r2s-plague_onset-city-0 |
| the cover's "Top export:" names the tab's first export, none under a siege or where the tab prints none | 61 covers | r2r-village-21 (none, the siege) · r2r-city-0 (unchanged) · r2r-metropolis-23 |
| a criminal house by its label ("Thieves' Guild", was "Thieves' Guild (Powerful)") (PDF Defense & Security) | 45 | r2r-metropolis-12 · r2r-metropolis-23 |
| an output's "EXPORT" badge only where the tab's Exports print it by name (PDF Economics & Trade, the chain flow) | 51 badge sentences, 859 printings silenced | r2s-mass_migration-hamlet-1 · r2r-village-52 · r2s-religious_conversion-hamlet-2 |

### Lines this batch silenced in other towns (explained)

Read whole in the exports' inventory diff (before 538c6ea10 -> this tree; 35,855 -> 36,112 sentences; 38 gone, 295 new,
180 fewer, 41 more):
- the EXPORT badges (51 sentences, 859 printings): each an output the tab's printed Exports do not hold by name; the
  widest: Enchanting services 115 -> 0, Milled lumber 91 -> 13, Peat fuel 76 -> 21, Master-crafted weapons 58 -> 0,
  Cast iron goods 53 -> 0, Pig iron 53 -> 3, Refined iron ingots 54 -> 7, Advanced weapons and armor 66 -> 27, Building
  materials 37 -> 0, Coin minting 22 -> 0. By script over the 720 records: Enchanting services, Cast iron goods,
  Building materials and Coin minting are on the printed Exports of NO town (193, 108, 98, 40 towns make them): every
  badge they wore came from the good's family. Their INHERITORS are the same outputs unbadged ("Enchanting services"
  78 -> 193 …);
- the 155 service and house rows and pills of the E17 cure: not silences: each prints with the leaf's mark ("Hospitality"
  -> "Hospitality (stopped)"; "Hospitality: A bed by the hearth …" -> "Hospitality: Stopped by the siege. A bed by the
  hearth …", which the inventory reads as two sentences);
- the cover's "Top export: …" (61 covers, above); "Thieves' Guild (Powerful)" (45, above).
- THE INHERITORS (338): the unbadged outputs, the leaf's marks and head lines, the marked rows' descriptions split from
  their marks, and the covers' new first exports: read (the widest twenty in the diff; the marks by the leaf's rule in
  their towns; the covers above).

THE TABS' INVENTORY (before -> after; run although this is not this seat's last batch): 0 gone, 0 new, 0 fewer; 3
sentences in one town more (the premium deity panel's cold start, "Patron deity" 716 -> 717, as at batch 1). No tab
sentence moved.

The silences over twenty towns (the EXPORT badges; the "(Powerful)" grade) were told to the chair before the push.

### Gates at this tip

Domain strict 1113 / ceiling 1113; type ratchet 167 / ceiling 167; eslint clean on the touched files (one warning
carried: `Cover.jsx` `num` unused, at the base too). The presumed-things walker (`--check`): fresh 145 · stale 2, the
same at the base and the tip (red at both, carried). The twelve-birth grid: 2 falls (r2r-city-0 P7a,
r2s-insurgency-metropolis-0 P7a), the same at the base. The 33 test files naming the touched files: 380 pass, 2 fail at
the tip: `houseLabelEverySurface` (red identically at the base: carried) and `tradeListWriters.walker` (red at an
intermediate form of this batch that re-assigned the exports prop; cured before the commit: the flow reads the printed
list through a helper and writes no list; green).

## Rows named for other groups (batch 2)

- TAIL-SERVICES (the leaf's table, `crisisDependence.js`): Fresh meat and Fresh bread under a siege, Pastries and Fresh
  produce under a famine (10661, 10652, 21359, 10665) print as the tabs print them; whether they live on what the crisis
  stops is the table's call. The leaf's second cause, "Short of <input>.", is awaited for the rows of a house that
  lacks its input: 06926, 06925, 06924, 06927, 14345 (the charcoal burner without timber), 23255 (salt works without
  salt), 10827 (game meat without hunting grounds), 11208 (glassblower without sand), 17048 (sawmill without timber),
  06946 (coastal timber unworked), 29819 (vintner without grapes): PARKED with their measures (44, 17, 2, 2, 13, 36, 35,
  13, 3, 2, 1) until the chair names the tip that holds it.
- DEFECON: the Defense tab's criminal operations print "Thieves' Guild (Powerful)" in the same 45 towns (`DefenseTab.jsx`,
  the raw name): its switch to `institutionHouseLabel`. TAIL-EXPORTS-JOURNAL: the journal's "Thieves' Guild (Powerful):
  Controls the criminal hierarchy." (28960, `foundry/journalPages.js`, 44 + 1 towns).
- The web panel `SupplyChainsPanel.jsx :: ChainRow` badges an output by the good's family and first word (the PDF's
  old read): its switch to the printed Exports by name, for the group that holds it.
- 04297 "Agricultural Rents": the seat renaming the income source.

## What is left of the worklist (after batch 2)

- ENTREPÔT 08499 (148): the PDF tags ENTREPÔT from the record's `economicState.isEntrepot`; the Economics tab says
  entrepôt only where a chain on its page is an entrepôt. By record, `isEntrepot` stands on 41 thorps, hamlets and
  villages working no entrepôt chain (16 thorps, 14 hamlets, 11 villages): the next batch (a silence over twenty: to the
  chair first).
- 01055 "<N> Trade" (Pilgrim Trade), 17282 (mineral salts headline), 29786 (viability's caravans), 31610 (the crisis
  lede under a governing power), 01241 (a governing power under a void): not reached.
- The rows PARKED for the leaf's second cause (above).

## For the successor of TAIL-EXPORTS-PDF-2 (handed back at the budget line, 2026-11-15 02:05 UTC; count 337,230)

- The branch's tip is 44d3088b4 (batch 2 on the E16 merge 538c6ea10). No further merge is named: merge only a tip the
  chair names (the leaf's second cause, "Short of <input>.", is the one awaited; it un-parks the eleven rows above).
- FIRST ACT: the BEFORE is this seat's AFTER of batch 2 only if the tree is unchanged; this seat's runs were in its
  scratchpad and are not carried: re-take the census at the tip (`census3.sh <tree> <out> 4`, about 14 minutes of
  births and render here, 7 of count and trace; the inventory reads only `corpus.ndjson.gz` and `dumps/`, so it can be
  taken as soon as the render ends) and `SURFACES=PDF,Journal inventory.py`.
- NEXT, by width: ENTREPÔT 08499 (148; the cure: the tag where a chain on the page is an entrepôt, as the Economics
  tab's flows say it; it silences 41 small towns whose record flags `isEntrepot` with no entrepôt chain: tell the chair
  before the push). Then 01055, 17282, 29786, 31610, 01241 (one to four towns each: behind every wider row, the chair's
  2026-11-15 rule).
- Instruments: as the predecessor's, above. The probe pattern that saved most reads: a vitest file that births a seed
  and renders one PDF section by calling its function component (the batch tests' `text()`), writing to a file
  (console output is silenced in this repo's vitest config).
- A census run reads the tree it is given live at worker start: never edit the tree while its render runs.

## The chair's answer after the hand-back (2026-11-15 02:10 UTC; vetoable by the owner), for the successor

1. NO VETO on batch 2's two silences: the EXPORT badge by the tab's printed name (859 printings) and "Thieves' Guild
   (Powerful)" 45 -> 0. Both stand.
2. THE TIP FOR THE ELEVEN PARKED ROWS: the joined line at **d817736d8** holds the leaf's second cause ("Short of
   <input>.", services 8df172bf0) and the journal's calls. THE SUCCESSOR'S FIRST ACT is now: merge
   origin/lane/join-2026-11-14 AT d817736d8 (the only merge; a merge commit of its own; `npm ci` if the lockfile moved),
   re-take the BEFORE at the merged tree, and cure the eleven (06926, 06925, 06924, 06927, 14345, 23255, 10827, 11208,
   17048, 06946, 29819) through the leaf, as the tab does. Then widest first (ENTREPÔT 08499); a row in fewer than five
   towns waits.
3. **04297 "Agricultural Rents"** (REST; 360 towns read; the reader's town r2r-thorp-58, a thorp of 7 with no landlord
   power): an INCOME SHARE of the record, `economicState.incomeSources[]`, written by
   `src/generators/economy/economicState.js` (the `incomeBuild` seed, lines 69-81: every thorp, hamlet and village takes
   "Agricultural Rents", 65%, "Payments in kind or coin from tenant farmers; the primary revenue at this scale."; a
   town without a market takes it at 30%), sibling-read by `src/generators/economy/incomeLineSiblings.js` (its only-line
   twin) and keyed to a tax form by `src/domain/worldPulse/treasury.js :: INCOME_SOURCE_FORMS` ('land_rents', the
   reader's traced writer). The PDF (Economics & Trade, INCOME SOURCES) and the Economics tab print the record's
   `source` and `desc` alike: neither is this group's to change. At this seat's merged tree (eb054d53f) it still
   printed; the rename to "Harvest" where no landlord stands is the seat that holds `economicState.js` (generators:
   a declared move of the record). The PDF needs no change of its own when it lands: it prints the record's name.

# TAIL-EXPORTS-PDF-3 · the third seat's batch (kept current after every batch)

Seat: TAIL-EXPORTS-PDF-3, the successor of TAIL-EXPORTS-PDF-2, on the same branch, continued from its tip 10c414e9b
(read back from origin 2026-11-15 02:20 UTC). Batches 1 and 2 above are the predecessors' and were not redone.

## The chair's rulings since (2026-11-15 02:15 UTC; each vetoable by the owner)

- **E20** NO VETO on batch 2's two silences (the EXPORT badge by the tab's printed name; "Thieves' Guild (Powerful)"
  45 towns to none).
- **E21** ENTREPÔT (08499; 148 printings): THE EXPORT PRINTS WHAT THE TAB PRINTS, THROUGH THE TAB'S OWN LEAF: the PDF's
  tag stands where a chain on the page is an entrepôt, as the Economics tab's flows say it. The silence of the 41
  thorps, hamlets and villages whose record flags `isEntrepot` with no entrepôt chain is ACCEPTED IN ADVANCE; the
  record's flag is NAMED for the record's next measure.
- **E22** THE ELEVEN PARKED ROWS: through the leaf (`rowStoppedBy` and its second cause), as the tab prints them.
- **E23** TWO HEADINGS OVER THE ORIGIN LINE (the narrative seat's batch 3 re-said the origin rows: the origin says WHERE,
  not WHY): the PDF's "Reason settled:" and the journal's "Why this place exists" take the heading the TAB prints over
  the same line. The journal's one heading under `src/foundry/` is LENT to this seat for this.
- THEN 01055, 17282, 29786, 31610, 01241 only if each prints in five towns or more at the tip; else NAMED as left.

## The merge (the chair's first act)

36eaba1af `merge(TAIL-EXPORTS-PDF-3): the joined line at d817736d8`: clean, no conflict; the lockfile did not move (one
`npm ci` in the scratch tree). THE BEFORE at 36eaba1af: census 720 towns, 0 birth errors; exports' inventory 36,213
distinct PDF/Journal sentences; the tabs' inventory 30,125.

## Batch 3 — E22 (the leaf's second cause on the PDF's rows), E21 (ENTREPÔT by the page's chains), E23 (the origin heading)

Writers: `src/pdf/lib/crisisMarksOnPage.js` (the PDF's reader over the tabs' leaf, now with the leaf's second cause:
`rowShortOf`, `shortMarkText`, `SHORT_WORD`; it keeps no word of its own), `src/pdf/lib/viewModelBodySlices.js`
(`isEntrepot`), a NEW leaf `src/domain/display/entrepotShown.js` (`entrepotChainCount`, `pageSaysEntrepot`: the tab's
chip "Entrepôt (N)" composed inline in `EconomicsTab.jsx :: EconomicFlowsSection`, now one reader), `src/pdf/sections/
Overview.jsx` (the label), `src/foundry/journalPages.js` (the heading, lent by E23). Display only: no record moves.

THE CURES:
- **E22**: a house, its service rows (with a description) and its pills (no description) print the leaf's second cause
  where the page itself says no input reaches that house (the Resources tab's gap line): "Short of timber. A collier's
  kilns …" (PDF Institutions, the house), "Charcoal supply: Short of timber. Produce and sell …" (PDF Institutions, a
  service row), "Charcoal supply (short)" (PDF Services, a pill; "stopped, short" where both causes stand, as the
  Institutions tab's doors print it); each chapter whose rows carry such a mark prints the leaf's head sentence once
  ("A row marked short is what its house makes when supplied.", `ordinaryTimesLine(crises, shortMarked)`), calm town or
  not. A chain card and an income share take no second cause: the leaf gives none, and the tabs' chain cards print none.
- **E21**: the Economics & Trade chapter's ENTREPÔT tag stands where a chain of the record's `activeChains` is flagged
  `entrepot` (the tab's chip), not on the record's town-wide `isEntrepot`.
- **E23**: "Reason settled: <line>" -> "Settlement Origin: <line>" (PDF Overview, under the owner-kept CHARACTER &
  ORIGIN band); "## Why this place exists" -> "## Settlement Origin" (Foundry journal, Overview page). "Settlement
  Origin" is the Overview tab's Section title over the same line (`OverviewTab.jsx`, a literal: no leaf holds it, so no
  leaf was made for one heading). SET AGAINST THE REWORDED ROWS BY READING THE DIFF of lane/tail-narrative-2026-11-14 at
  b6a0c074c (`settlementOriginProse.js`, `narrativeText.js`: every reworded row says where the place stands or how it
  trades, none why it was founded), NOT by a census of that branch: it is not merged here.

Guard: `tests/pdf/tailExportsPdf3Batch3.test.jsx` (births of the census's own seeds; 8 NOT pairs each naming what prints
instead, or null for the accepted ENTREPÔT silence; 1 NOW; 3 KEEP; 2 UNSHORT: a town the page says is short of nothing
prints no short mark). At the merged base 36eaba1af: the 8 NOT and the NOW red, KEEP and UNSHORT green; at the tip: 14
green.

### Cured (towns printing, before -> after, by the exports' inventory diff; the measure is where the row was false)

| id | sentence | before -> after | measure | the cure |
|---|---|---|---|---|
| 08499 | ENTREPÔT (PDF Economics & Trade) | 148 -> 320 (41 gone, 213 gained) | 41: the record flags `isEntrepot` with no entrepôt chain (16 thorps, 14 hamlets, 11 villages; the town read, r2s-under_siege-thorp-0, among them) | the tag where the tab's chip prints (E21) |
| (E22) the houses short of their input | Potter, Brickmaker (clay), Charcoal burner, Sawmill (timber), Dairy farmer, Tannery (livestock), Salt works (salt), and Fishmonger, Smelter, Apothecary, Alchemist shop, Caravanserai | e.g. "Pottery and ceramics: Plates, jugs, storage crocks." 269 -> 97 and "Pottery and ceramics: Short of clay." 0 -> 172; "Charcoal supply" 153 -> 123 and "(short)" 0 -> 30; "Short of clay." 193, "Short of timber." 37, "Short of livestock." 36, "Short of salt." 25 | where the page's own gap line says no input reaches the house: the PDF's marks are the tabs' in exactly the same towns (Short of clay 193/193, timber 37/37, livestock 36/36, salt 25/25; the head sentence 270/270) | the leaf's second cause (E22) |
| (E23) | Reason settled: … / Why this place exists | 720 -> 0 each | the origin line says where, not why (the narrative seat's N6) | the tab's heading |

### Struck, or named (the eleven parked rows and the five narrow ones; one line each)

- 06926, 06925, 06924, 06927, 14345 (the charcoal burner's chain card), 17048 (Mill + Sawmill), 23255 (Salt works »
  Preserved foods), 06946 (Coastal timber » River ferry): CHAIN CARDS of the PDF's Services chapter. The leaf's second
  cause is for a house and its service rows only (`rowShortOf(kind: 'service' | 'house')`), and the tabs' chain cards
  print no short mark; the PDF now prints them as the tab does, and the house and its rows beside them carry the mark
  where the page says the house is short (r2r-metropolis-24: "Short of timber." on the Charcoal burner and "Charcoal
  supply (short)"). In the town the reader read (r2s-religious_conversion-hamlet-2) the page says no input is short at
  all. Still printing 44, 17, 2, 2, 13, 3, 36, 2: NAMED for TAIL-SERVICES (a chain's second cause, if the leaf takes one).
- 10827 "Game meat: Venison, boar, rabbit." (35): the page says nothing of the Hunter's lodge's input (no gap line); the
  reader read the record's Furs & Pelts chain gap; the Services tab prints it unmarked in the same towns. Struck: the tab's
  twin.
- 11208 Glassblower (13), 29819 Vintner (1): the leaf does not mark them by the chair's ruling S7
  (`INPUT_GAP_HELD_EVERYWHERE`: the gap stands in 13 of 13 and 184 of 184 towns that hold the house: the record's fault,
  not the town's state); the tabs print them unmarked. Struck here; NAMED for the record (the gap held everywhere).
- 01055 "<N> Trade" (3 towns), 31610 (3), 17282 (4), 01241 (1), 29786 (1): each prints in fewer than five towns at the
  tip: NAMED as left (the chair's rule); the PDF's worklist is done.
- 04297 "Agricultural Rents" (REST): STRUCK AS NAMED (the chair, 2026-11-15 02:15 UTC): the PDF prints the record's
  income source; its name is cured at the source by the seat that holds `economicState.js` ("Harvest"). No PDF change.

### Every new or changed line (the owner's veto list)

| line (surface) | towns | read in (smallest · largest · a crisis) |
|---|---|---|
| "A row marked short is what its house makes when supplied." (PDF Institutions, Services; the tabs' leaf, `SUPPLIED_LINE`) | 270 | r2r-hamlet-12 · r2r-metropolis-24 · r2s-occupied-city-2 |
| the leaf's "Short of <input>." before a house's or a service row's description (PDF Institutions) | clay 193, timber 37, livestock 36, salt 25 | r2r-hamlet-12 · r2r-metropolis-24 · r2s-famine-town-1 |
| the leaf's word after a pill's name ("Pottery and ceramics (short)", "Fresh milk (short)") (PDF Services) | e.g. 172, 36 | r2r-hamlet-12 · r2r-city-1 · r2s-occupied-town-1 |
| ENTREPÔT where a chain on the page is an entrepôt (PDF Economics & Trade): 213 towns gain it, 41 lose it | 320 | r2r-thorp-1 (gains: a smuggling entrepôt chain; the tab says "Entrepôt (1)") · r2r-metropolis-24 · r2s-under_siege-thorp-0 (loses) |
| "Settlement Origin: <the origin line>" (PDF Overview) | 720 | r2r-thorp-0 · r2r-city-0 · r2s-under_siege-thorp-0 |
| "## Settlement Origin" (Foundry journal, Overview) | 720 | the same |

### Lines this batch silenced in other towns (explained)

Read whole in the exports' inventory diff (36,213 -> 36,268 sentences; 37 gone, 92 new, 32 fewer, 1 moved):
- GONE: "Why this place exists" (720) and the "Reason settled: …" lines (each its "Settlement Origin: …" twin, the same
  towns); "Salted fish: Salt-cured fish." 4 -> 0 (the Salt works' rows, now "Short of salt." before the same line).
- FEWER (32): every one a house's or a service's row that now prints with the leaf's mark (the inventory reads "Pottery
  and ceramics: Short of clay." and "Plates, jugs, storage crocks." as two sentences): Pottery and ceramics, Fired brick,
  Roof tiles (clay); Charcoal supply, Lumber milling (timber); Fresh milk, Cheese, Butter, Tanned leather, Rawhide
  (livestock); Salt production, Salted fish (salt); Herbal remedies, Compound medicines, Potion brewing, Iron refining
  (the apothecary's, the alchemist's and the smelter's inputs). Nothing went silent.
- ENTREPÔT: the 41 small towns (accepted, E21).
- THE INHERITORS (93): the headings, the leaf's marks and head sentence, the descriptions split from their marks, and
  ENTREPÔT in 213 towns (each where the Economics tab prints "Entrepôt (N)"): read.

THE TABS' INVENTORY (before -> after, this seat's last batch): 30,125 -> 30,125; 0 gone, 0 new, 0 fewer, 0 more. No tab
sentence moved.

### Gates at this tip

Domain strict 1113 / ceiling 1113; type ratchet 167 / ceiling 167; eslint clean on the touched files. The presumed-things
walker (`--check`): fresh 145 · stale 2, identical at the base and the tip (red at both, carried). The twelve-birth grid:
2 falls (r2r-city-0 P7a, r2s-insurgency-metropolis-0 P7a), the same as batch 2's. The 95 test files naming the touched
files (and the new guard): 12 tests fail at the tip and the SAME 12 at the base 36eaba1af, in five files
(`houseLabelEverySurface`, `journalMarksCrisisRows`, `coherenceAgreeCures`, `observedShapeReaders.walker`,
`goldenViewModel`, whose failure output is identical at both): carried from the joined line, not this batch's.

## Rows named for other groups (batch 3)

- TAIL-SERVICES (the leaf): a chain card whose house the page says is short (the eight chain rows above) takes no second
  cause on any surface; whether a chain takes one is the leaf's call.
- THE RECORD (its next measure): `economicState.isEntrepot` stands on 41 thorps, hamlets and villages working no
  entrepôt chain and is absent from 213 towns that work one (64 cities, 68 metropolises, 45 towns): no surface reads it
  now but `generalDeskRead.js`, the world pulse's `urbanFabricKernel.js` and the dossier-state prose's ladders. The gap
  held everywhere for the Glassblower and the Vintner (S7).
- THE ECONOMICS TAB'S GROUP: `EconomicsTab.jsx :: EconomicFlowsSection` counts its chip inline: its switch to
  `entrepotShown.js :: entrepotChainCount`. THE OVERVIEW TAB'S GROUP: the heading "Settlement Origin" is a literal in
  `OverviewTab.jsx`; a leaf for it, if one is wanted, is theirs.

## What is left of the worklist (after batch 3)

- THE PDF'S WORKLIST IS DONE by the chair's rule: 01055 (3 towns), 31610 (3), 17282 (4), 01241 (1), 29786 (1) print in
  fewer than five towns at the tip and are NAMED as left; the eight chain rows wait on the leaf (TAIL-SERVICES).
- No register is left stale by this batch (no pin or baseline names the touched lines).
