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
