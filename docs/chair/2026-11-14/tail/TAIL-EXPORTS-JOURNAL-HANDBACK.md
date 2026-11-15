# TAIL-EXPORTS-JOURNAL · hand-back

Seat: TAIL-EXPORTS-JOURNAL (builder; the EXPORTS). Branch `lane/tail-exports-journal-2026-11-14`, cut from the joined
line `lane/join-2026-11-14` at **48fedbe98** (read back from origin 2026-11-14 ~23:59 UTC). Files held:
`src/foundry/**`, `src/generators/spatialGenerator.js`, tests. Work in a scratch worktree; nothing merged; plain pushes.

## The rulings worked to (the chair's, 2026-11-14; each vetoable by the owner)

- **E1** The export prints what the tab prints, through the tab's own leaf; no humanize, label or gate of its own.
- **E2** A slash label is not a name: "Military/Guard" in a sentence or beside a verb takes the power's prose form
  (`powerSentenceName.js`); "X governs, with Y pressing close behind" reads the two powers' own strengths.
- **E3** Under a crisis the laws stand on every surface; a row that lives on what the crisis stops is marked by ONE
  leaf (the SERVICES seat's, ruling S1); not pushed for a shape: PARK with its measure.
- **E4** The readers' header showed no seat and no live tension: a flag of "no seat" or of "tensions" is checked
  against `npcs[].memberships` and `history.currentTensions` first; true rows struck.
- **E5** A label with no value: look at the dump first; a real one is cured by not printing the label without its value.
- **E6** Measure with the exports' inventory (`SURFACES=PDF,Journal`); at the last batch the tabs' inventory too.
- **E7** A gendered title against its holder is the record's (RECORD-MEASURE-2, class k): struck.
- **J1** The layout line names only what stands; the cure is in the generator and moves the record (a declared move).
- **J2** The widest rows first.

## Batches

### Batch 1 — J1, the layout line (`spatialGenerator.js :: generateSpatialLayout`) · commit 26e9210a0

Verified by the record over the 720 (corpus at 48fedbe98), measure = towns where the noun is false of those that print it:

| row ids (REST) | noun | printing | false |
|---|---|---|---|
| 06892, 15413 | "a single defended gate" (mountain village) | 13 | 13 (no gate: `defenseFactsOf.hasGate`) |
| 11680, 15424 | "the citadel above the wells" (desert metropolis) | 6 | 3 (no Citadel on the roster) |
| 29937, 15452 | "citadel above the wells" (desert city) | 4 | 3 |
| 19224, 15433 | "the citadel at the summit" (mountain city) | 9 | 5 |
| 25015, 15443 | "the keep visible above the market quarter" (walled hill town) | 15 | 11 |
| 25017, 15445 | "Stone-walled village" round a palisade | 6 | 6 (`wallKind` palisade) |
| 29939, 15454, 21700, 15436 | "warehouses and chandlers at the waterfront" (port town, walled and open) | 19 | 16 (one house or neither) |

All sixteen layout rows cured. "market quarter" is true in all 47 towns that print it (a market house stands): kept.
The cure: one table of (noun; fact): a gate and stone walls, the defence answer; a citadel or a keep, a Citadel on the
roster; warehouses and chandlers, both their houses. No slot re-drawn; a denied noun takes the line's twin without it.
Twins are lines already declared or banked where one fits, so the presumed-things walker sees no new line.

**Declared move** (field diff by family, `births-only.sh` + `fielddiff.mjs`, depth 3): towns moved 57 of 720;
families 1: `spatialLayout.layout` 57.

Guard: `tests/generators/layoutNamesWhatStands.test.js` (11 RED red at base; 6 KEEP green before and after; a plant reds
the 6). Re-keyed by identity: `spatialGenerator.test.js`'s keep pin (its fixture gains the Citadel; the twin asserted);
`census2dTables.test.js`'s gate template row (two rows now) and its `walls` guarantee (`.walled.palisade`). Ledger:
`docs/census/declarations/SPATIAL_TEXT.json` carries every twin.

### Batch 2 — E1 and E5, the journal's own leaves (`journalPages.js`) · commit 39315b391

- **E1** The Exploitation table named resources by its own humanize; the tab's card prints
  `plainGoodName(resourceDisplayName(rawResource))`. 12 resources differed, in up to 75 towns each (medicinal herbs 75,
  animal hides 62, hot_springs_mineral 43, mountain_timber 39, alpine_pasture 36, iron ore 28, gold/silver ore 18,
  oasis_water 16, glass sand 9+9, desert_salt 9, camel_herds 8). The table calls the tab's leaf.
- **E5** The NPC Quick Reference printed an empty "Member of" cell for 2,040 rows of the 720 (looked at in the dumps:
  real; the person holds no membership). The cell prints the journal's own mark for none, "—".

Guard: `tests/foundry/journalPrintsTheTabsLeaf.test.js` (5 RED red at base; KEEP green before and after).

### The census runs

Before: `census3.sh` at 48fedbe98 → `before.json` (exports 35,779 sentences), `before.tabs.json` (tabs 29,876).
After: ONE run at 39315b391 covering both batches (an operator's slip lost the batch-1 run: a relative path; I ran one
after-run for the two instead of two, since batch 1 moves only the record's layout string and batch 2 only the journal's
rendering, and the inventory diff tells them apart).

**After run, read whole** (exports, `SURFACES=PDF,Journal`): before 35,779 sentences, after 35,787; gone 103, new 111,
fewer 12, more 2. Every batch-1 row is GONE or fewer by exactly its measure (gate 13→0 ×2; metropolis citadel 6→3;
city citadel 4→1; mountain citadel 9→4; keep 15→4; walled port 11→1; open port 8→2; stone village 6→0). Every other
line that left: the 2,040 quick-reference rows with an empty cell (71 folds, now "—") and 32 Exploitation rows
(352 town-prints) renamed by the tab's leaf. In more towns: "Hill town of stone houses climbing above the market
quarter" 3→14 (the declared twin). The inheritors, read: the same "—" rows, the renamed resource rows, and the layout
twins of the veto list; no other sentence inherits.
**The tabs' inventory** (E6, before and after): 29,876 = 29,876; gone 0, new 0, fewer 0. The tabs print no layout
line (no tab sentence moved by J1). Three tab sentences gained one town ("Patron deity", "Assign a patron god…",
"Upgrade to premium…", r2r-thorp-0, Systems/Power): that town is the first dossier its render worker drew in the
before run, whose Power tab then lacked the faith panel: the instrument's first render, not a cure (no file of this
seat reaches the Power tab).

## Rows struck (true by the record, or not this seat's)

- **10566, 10565, 10563** "Founded N years ago, with N events on record and N tensions still unresolved." (372+257+68):
  E4: the tension count equals `history.currentTensions` in all 720 towns. (Noticed, not chased: the event count differs
  from `history.historicalEvents` in 70 towns: the view model's events are not that field alone; not flagged.)
- **00874, 00882, 00880** "<name> (Headman · Holds the seat)", "(Master of the Guilds…", "(Lord Warden…" (60+32+8):
  E4: every person named holds rank 1 in the governing power (`memberships`); the Tonight tab prints the same role;
  the unclosed bracket is the packet split on " · " (E5).
- **24868, 24847, 24870, 24861** "Standing: member of X" (6+6+3+2): E4: of 1,715 "member/first/… of X" parts on the
  journal's NPC pages, none names a power the page's person does not hold.
- **34594** "| Emad al-Libi | the miller | The Highborn Circle | 3 |" (17): E4: all 18,973 filled "Member of" cells
  are memberships the person holds.
- **10492** "Foodways: The table rests on the mill's flour." (6): false in 0 of the 6 (none under a grain famine).
- **E7** every madam / district madam / midwife / foundling-mother row (33591, 34201, 33595, 33594, 33574, 33590,
  33593, 34196, 33582, 33599, 34194, 34516, 34521, 34181, 33732, 33729, 33578, 33734, 33740, 33589, 34515, 33736):
  the record's: RECORD-MEASURE-2, class k.
- **The "(impaired)" rows** (25494, 14328, 10751, 22442, 11307, 15703, 10241, 13079, 05991, 22764, 05776, 23236, 24555,
  31379, 25032, 06251): not this seat's to cure: the Economics tab prints the same "Impaired" through the same leaf
  (`chainStateShown.js :: chainAsShown`, which the journal reads via `pdf/lib/chainStateOnPage.js`). Of the chains the
  journal prints impaired, the record's status is impaired 999 times, running 83, entrepot 11: the leaf re-grades them.
  NAMED for the leaf's group (DISPLAY-ECON) as a question, not a fault: is "Impaired" true of a running chain?

## Rows named for other groups (with their measure, and the leaf to call)

- **EXPORTS-PDF (`src/pdf/lib/headlines.js`)**, printed by the PDF and the journal alike (the journal calls the leaf):
  - 29767 "Viable, as long as the two trade routes it depends on stay open." (159): `viabilityHeadline` counts
    `metrics.dependencyCount` as routes; at least the 6 isolated towns among the 159 are false.
  - 29778 "most of the food it lacks comes in by teleportation circle" (3): the channel named is not the main one.
  - 30724, 15673 "…no walls; the barracks is all that stands guard." (3+2): false 5 of 5 (a Town watch stands too):
    `defenseHeadline` names the first force as "all".
  - 14728, 14727, 14751, 14750 "Its income rests on milled flour / salted fish; …" (11+3+6+2): under a famine of that
    food: false 3 (flour) and 2 (fish). 14724 "imports make up some of the gap" under a siege (2): false 2 of 2.
  - The "It sends out …" rows (14629, 14617, 14621, 14639, 14638, 14613, 14642, 14628, 14612, 14616, 14620, 14631,
    14619, 14607, 14609, 14615; REST 14610): `resourcesHeadline` reads `exportPotential`, not the trade lists; the PDF's
    call passes the same slice.
  - E2's "X governs, with Y pressing close behind" is `powerHeadline` (the journal's Power lede): the PDF's file.
- **E3, PARKED** (the S1 leaf, `crisisStoppedRow.js` at 73291c8e2 on lane/tail-services-2026-11-14, declares service and
  house rows only: no income share, no resource chain):
  - 35544, 35551, 35555 "| Fish / Grain / Livestock | full |" under a famine of that food (127/102/95 printing): false
    7, 5, 3. The Resources tab prints the same card "Fully exploited" (`validationOnPage.js :: exploitationGroupsShown`).
  - 11319 "Grain Sales: N%" under a grain famine (194): false 4. 29234 "Toll Revenue: N%" under a siege (115): false 5.
  - 05600 "Bakers: The town's bread." under a siege (10): false 1. A house row: the S1 leaf covers it
    (`stoppedRowMark(settlement, 'house', inst)` + `markedDescription`, the Institutions tab's call). The journal's
    Institutions page can call it once the merge seat lands 73291c8e2 on the joined line.
- **STRUCK, cured at the writer** (the chair's note E9): 04298 / 04297 "Agricultural Rents: 89%" (360): the income
  source where no landlord stands is cured at its source by TAIL-DEFECON-2 (a twin name); the journal prints the record's
  row as the tab does.
  01056 "Pilgrim Trade: 5%" (4): the record's share. 25077 / 25075 REVENUE_HOMES (PDF/Services): not this seat's.
- **The hook writer**: 14041 "In the raids, <name> of Military/Guard takes the worst of it: its people stand on the
  walls." (6): the tab and the PDF print the same text; the journal only adds the crisis tag.

## New or changed lines (the owner's veto list)

Batch 1 (the layout line; towns from the after corpus; the smallest and largest sizes it reaches are its own tier):

| towns | line | read in |
|---|---|---|
| 13 | "Close-built stone houses below the church" | r2r-village-0, r2r-village-17, r2s-under_siege-village-2 |
| 11 | "Hill town of stone houses climbing above the market quarter" (now also in walled towns with no Citadel) | r2r-town-0, r2r-town-8, r2s-under_siege-town-3 |
| 10 | "Walled port town climbing from the harbour" | r2r-town-3, r2r-town-6, r2r-town-18 (no siege, famine or occupation among them) |
| 6 | "Walled village on a south-facing slope, paths converging at the stone cross" | r2r-village-6, r2r-village-40, r2s-famine-village-3 |
| 6 | "Port town climbing from the harbour" | r2r-town-4, r2r-town-25, r2s-famine-town-2 |
| 5 | "Mountain city of terraced districts, lower town in the valley" | r2r-city-46, r2r-city-54, r2s-occupied-city-3 |
| 3 | "Walled desert city of pale stone, caravanserai outside the east gate" | r2r-city-39, r2r-city-43, r2s-famine-city-1 |
| 3 | "Great desert metropolis of white stone: the souk by the wells, caravansaries ringing the walls" | r2r-metropolis-19, r2r-metropolis-25, r2s-indebted-metropolis-0 |

Silenced true: "warehouses" or "chandlers" where only one of the two houses stands (11 towns): the clause names both
or neither (a one-house twin would be a new line the walker cannot clear without a vocabulary atom for the house).

Batch 2: the quick-reference "—" for a person with no power (2,040 rows); the Exploitation table's 12 resource names
(the tab's own names, listed above).

## Registers named stale, guards owed

- The golden master (`tests/property/generatorGoldenMaster.test.js`) is red at the base (525 configs); batch 1 moves
  `spatialLayout.layout`: re-derived at the close, not here.
- `presumedThings.widened.register.json` banks the original layout lines; they still print where their nouns stand:
  no row went stale (`--check`: fresh 147 at base and here; stale 0).
- Owed: a vocabulary atom for a citadel, a warehouse and a chandler (`registeredWords.js :: HOUSE_FAMILIES` says its
  atom "waits for a factsOf getter"): with one, the layout lines could DECLARE their houses instead of branching in code,
  and the one-house waterfront twins could stand. The chair's.
- Noticed in the same table, not flagged, not cured: "Hill city: castle district commanding the heights" (29 cities),
  "fortified harbour", "fortress crown".

## Gates (each batch)

eslint on the touched files, `typecheck:domain:strict`, `typecheck:ratchet`: green. `presumed-things-door.mjs --check`:
147 fresh = base. The twelve-birth grid: the same two falls as base. The lint walkers (presumedThings,
factLayers, defenceFactReaders): the same six reds as base. The 35 suites naming the journal: one red, carried
(`houseLabelEverySurface`, rr2s-town-under_siege).

## Batch 3, OWED (the successor's first): the E3 rows through the crisis leaf

The chair's notes E8–E10 (2026-11-15 00:07–00:31 UTC): the leaf `src/domain/display/crisisStoppedRow.js` with its table
`src/data/crisisDependence.js` is on the joined line, with chains and income shares at **b6c64d36c**
(`rowStoppedBy(settlement, 'service' | 'house' | 'chain' | 'income', row)`; a chain keyed by
`economicState.activeChains[].chainId`, an income share by `economicState.incomeSources[].source`; marks
`crisisMarkText`, `markedDescription`, `ordinaryTimesLine`, `STOPPED_WORD`). THE ONE MERGE this seat may make:
`origin/lane/join-2026-11-14` at b6c64d36c into this branch (a merge commit of its own; the lockfile did not move
between 48fedbe98 and b6c64d36c, nor did `src/foundry/**` or `spatialGenerator.js`). Not made at this hand-back: it
came as the budget closed, and the batch needs its own before run at the merged tree (that tip holds other seats'
display batches, so sentences of the exports move) and its own after run.

The cure, in `journalPages.js`, each row through the leaf as the tab calls it:
- economicsPage's Income rows: `rowStoppedBy(settlement, 'income', s)` → print the mark before the share (how the
  Economics tab prints it at b6c64d36c: read its call first). Rows: 11319 Grain Sales under a grain famine (false 4 of
  194), 29234 Toll Revenue under a siege (false 5 of 115).
- economicsPage's Supply chains: `rowStoppedBy(settlement, 'chain', activeChains[i])`.
- institutionsPage: `stoppedRowMark(settlement, 'house', inst)` + `markedDescription`, and `ordinaryTimesLine` once at
  the page's head (the Institutions tab's call). Row 05600 "Bakers: The town's bread." under a siege (false 1 of 10).
- The Exploitation table's "full" rows under a famine of that food (35544 Fish 7, 35551 Grain 5, 35555 Livestock 3):
  NOT a chain row (the table is `resourceAnalysis.exploitation`, the Resources tab's card, `validationOnPage.js ::
  exploitationGroupsShown`). If the tab's card reads the leaf at that tip, the journal's row reads it the same way;
  if not, it stays parked and is named for the leaf's group.

## What is left of the worklist

Every row of WORKLIST3-EXPORTS-JOURNAL and the Journal/ and layout rows of WORKLIST3-REST is cured, struck, named or
parked above. Nothing of this seat's files is left open but the E3 rows of batch 3 above.

## How the instruments are re-made

`git archive origin/lane/chair-2026-11-08 docs/chair/2026-11-14/probes/READ-ALL` and
`git archive origin/lane/census-3-2026-11-14 docs/chair/2026-11-14/probes/CENSUS-3` into a directory outside every tree;
`sh census3.sh <tree with node_modules> <out> 4`; `SURFACES=PDF,Journal python3 inventory.py <out> x.json` (and without
`SURFACES` for the tabs); `inventory_diff.py before.json after.json <rows.json>`. The field diff:
`git archive origin/lane/record-measure-2026-11-14 docs/chair/2026-11-14/probes/RECORD-MEASURE-1`,
`CENSUS3_PROBES=<CENSUS-3> sh births-only.sh <tree> <out>`, `node fielddiff.mjs <before corpus> <after corpus> 3`.
