# W2-FIX-DATA-HISTORY — the hand-back (kept current after every item; the lane's sixth seat makes the lane's one statement)

**Seat.** The data lane's history, culture and arrival seat, on its own branch `lane/w2-fix-data-history-2026-11-13`, cut from **`90f0a7b9b` exactly** (the data lane's tip when the brief was written; read back from origin at the start: equal). Chair: `session_01FE9mEws7PXYRYdjQPbSX15`. Every figure is EXECUTED unless marked PLAUSIBLE. The chair's rulings this seat works to are copied in section 6.

**Files held (and no others under src/):** `src/data/historyData.js`, `src/data/historyDescVariants.js`, `src/generators/historyGenerator.js`, `src/data/cultureProfiles.js`, `src/data/arrivalProse.js`, `src/data/inlandDescriptions.js`; the tests and registers that pin them.

## 0. Instruments (scratchpad; re-made in minutes)

- **Births, 1,540 in the app's shape** (the fifth seat's families, rebuilt): CENSUS-2's `probes/CENSUS-2/seedcfg.mjs` verbatim for the census 720 (`r2r-*`, `r2s-*`) and the readers' 80 (`rr2s-*`, `rww-*`, `rpf-*`); REVIEW-W2A-3's `seeds20.txt` (`rw3-*`, the same cfgFor arm); the fresh 720 added to seedcfg as the fourth seat defined them (`w2fd4r-<size>-<0..59>`: every dial random but the crises, Random off, none ticked; `w2fd4s-<crisis>-<size>-<0..9>`: one forced crisis over siege, famine, occupation, plague, war, insurgency). CENSUS-2's `births.mjs` writes the corpus (about 60 s a tree).
- **The census at the base**: `census2.sh <base tree> <out> 4 --seeds seeds1540.txt` (the 720 are its first 720 rows): its own exit 0, counts.txt 83 rows (the chair's hazard checked). Hits in the six files: **720: 318 (kind a 186, c 105, b 3); 1,540: 776 (a 464, c 231, b 6)** (town+line).
- **Record counters** (`rows.mjs`, through the tree's `factsOf`), a leaf-by-leaf **field diff** (REVIEW-R2-STAGES' `fielddiff.mjs`), a **sentence diff** of moved births, a **read of 30 moved births** by stride, and the **governing tests** (every test file naming the history modules, 43 then 44, `--reporter=json`, at the item's parent and at the item, compared title by title).

## 1. Items done (each commit carries its receipts: counts, field diff, the towns read, the guard, red first, the governing tests)

| item | rows | commit | count (1,540 births, app shape; record level) | moves (field diff) |
|---|---|---|---|---|
| A | INC ww-543, ww-572, ww-1524; CENSUS-2 `historyDescVariants.js :: economic_disparity` | `0bdeef11c` | the Divide's merchants where no market 119 -> 0; trade dispute 17 -> 0; the crash 28 -> 0 | 180: history (+ receipt 131, arrival memory 5) |
| C | review L4; INC ww-254, ww-724, ww-752, ww-754..756 | `3384e3b58` | occupation tension with no occupation on the timeline 73 -> 0; "former occupier officer" under an occupation 9 -> 0 | 82: history (+ receipt 73) |
| L | the chair's row (#267, R2 #368); INC ww-1489 | `01f58571f` | a false "runs mostly on" 135 -> 0 (72 "Among the trades", 63 no lead) | 135: tension descriptions only |
| D | review L4 (stages of expansion, administrative precinct, organized neighbourhoods); CENSUS-2 kind c, 10 siblings | `c7888bdc7` | the 13 large-place details: thorps 117 -> 0, hamlets 109 -> 0, villages 100 -> 48 (the 7 rows the ruling allows there) | 267: culturalIdentity.architecturalDetail 259, arrivalScene 111 (36 re-deal later beats on the arrival's substream) |
| B | INC ww-10, ww-345; CENSUS-2 foodways kinds a, c | `825bcf243` | herding/farming without both 130 -> 0; ovens and vendors with no market 61 -> 0; "urban food supply" in small 65 -> 0; waterworks 141 -> 0 | 413: foodwaysLine and culturalIdentity.foodways only |
| E | CENSUS-2 `historyGenerator.js :: generateRelationshipEvent`; INC ww-26, ww-90 | `ab58c3ec3` | extraction with no mine 81 -> 0; mining contract 47 -> 0; Compact's merchant guilds 40 -> 4; quarrymen's guild 21 -> 2 (pre-trim roster residue); civic/cathedral in a village 25 -> 0; arcane district 48 -> 0; plague healer 40 -> 0; wild-magic district hook 22 -> 0 | 226: history only, no draw |
| F | INC ww-541; CENSUS-2 arrival kinds a, b; inland kind b | `9d952d02b` | lanes of trades in small 19 -> 0; tea 15 -> 0, oath 16 -> 0 with no market; planks under siege 3 -> 0; inland fish "brought in by cart" under siege 3 -> 0 | 78: arrivalScene 54 (14 re-deal), institutions[].desc 25 |
| R | the registers of A..F through their doors | `79376ba81` | presumed-things widened register: --shrink removed 9 stale rows (stale 0 after; the fifth seat's two fire rows among them); the manifest rationale for this seat's test file | registers only |
| G | INC pf-160, ww-1230, ww-1261; CENSUS-2 historyData factions | `009ee1466` | ailing ruler under elders 69 -> 0, poisoned ruler 59 -> 0; warehouse 244 -> 0; open purge under infiltration 32 -> 0; pilgrimage tension with no temple 11 -> 0 | 401: history (+ receipt 43) |

## 2. The INCREMENT's MED rows in my files (hand-back 5 section 8), line by line

| line | state |
|---|---|
| ww-254, ww-724, ww-752, ww-754, ww-755, ww-756 | CURED C |
| ww-945 | GONE at the base (fifth seat's item 1); the timeline's form CURED C |
| ww-543, ww-572, ww-1524 | CURED A |
| ww-896 | GONE at the base ("someone in the household knows") |
| ww-1230 | CURED G |
| pf-160 | CURED G |
| pf-325 | PARKED (section 3) |
| pf-363 | NOT THIS FILE'S: a Tonight-sheet composition (the trace to EVENT_TYPE_NAMES is the cut's PLAUSIBLE); not in the record |
| ww-10, ww-345 | CURED B (ww-345's first sentence, "The table rests on bread from the home fields" under a failed grain, is domain/foodways.js's own frame: not this seat's file) |
| ww-1465 | STOP: the row already declares `population: ≥ middling`; src/generators/foodGenerator.js :: generateFoodSecurity strips it (`.map(textOf)`). 59 small places at this tree |
| ww-618, ww-779, ww-1030, ww-1351 ("Caravan organization Vulnerable2-order chain") | NOT THIS FILE'S: the Services tab's chain-depth chip (machinery), traced to cultureProfiles only by the words "Caravan organization" |
| ww-26, ww-90 | CURED E (ww-1518 gone at the base) |
| ww-541 | CURED F |
| ww-1450 | PARKED (section 3) |
| ww-1487 | GONE at the base (0 of 1,540) |
| ww-1261 | CURED G |
| ww-1489 | CURED L |
| ww-397, ww-758, ww-1085 (auction "persons", SAME FAULT) | GONE at the base (the third seat's item 5) |
| ww-542, ww-602, ww-1334 (tension faction labels on the Overview) | OPEN, not cured: the labels are the template's factions as substituted (historyGenerator.js :: buildHistoricalEvent's substituteNames against powerStructure.factions); two homes that disagree; a cure is the powers' reading, not a data row |

## 3. Parked, with the word each needs

- ww-1450 "Fresh pots stand drying in a row outside a workshop." (the kilns key reached by a charcoal burner or peat cutter): `institution: potter`.
- The germanic "A craftsman shows off a finished piece in his doorway" where no craft house stands (CENSUS-2 a/workshops, 9 at the base): a crafts presence word.
- pf-325 (a priest-ruled village, the seat held and well, the past Succession Crisis's present-tense hook): a fact that the ruler is ailing or the seat is open.
- The Iron Dispute's deposits where they are worked out: `depleted: <resource>` (the lane's parked word).

## 4. Calls taken without the chair

1. **Item A declares whole templates**, not lines (the Divide's effects and hooks are drawn by rolls that read no declaration; historyGenerator.js at 791 then 793 of its 800 lines). Given up: 10 of 138 removed Divide events named no merchant. The crash declared too: the pool's next template, as false without a market.
2. **Item C** leaves the memory table's unanchored words in the table, reached by no town.
3. **Item D's twins carry no house atom** because they name none: the arrival reads the original rows only, so a twin that kept "palisade" would print unchecked.
4. **Item B rewords rather than declares**: the reader strips declarations; the words now sit in the reader's own source and market words. The meso "dense populations" row is NOT reworded (it would delete a line true in large places): a STOP for foodGenerator.js.
5. **Item E's Great Construction holds a third, non-twin member** (a town with no house of worship: "Its civic buildings were raised ..."), reached by the door's argmax; it prints in none of the 1,540.
6. **Item F rewords the inland fish stall** (a plain map value; its sibling column is institutionDescVariants.js's and its facts carry no crisis).
7. **Item R's --shrink** removed every stale row, the fifth seat's two great-fire rows with them (in this seat's files), so presumedThings' "no stale row" is green here; the lane's own H1i commit (492b7b969) removes the same two: at the merge the register is taken from one side and re-derived by the door.
8. **Pins re-keyed by cause, assertions kept or strengthened:** w2FixData2Tensions (market answered), narrativeQualityCorpus (a market square), hookTablesDeclared (17 -> 18 -> 20; elder), tensionTemplateDeclaration D-1b (no unanchored tension, a tension kept), w2FixData4Round (the twin materialized).
9. `npm ci` set `core.hooksPath=.husky/_` (known); local config and refs compared before and after every push and suite: nothing else moved. lint-staged's own transient stash was dropped by lint-staged each time.

## 5. Carried reds (identical at the base and at every item)

The governing set's three: `proseComposed` A13, the generator golden master, `census2eTables`' CULTURE_ARCHITECTURAL_DETAILS row. The ten titles of the review's H1 are the sixth seat's (not cured here).

## 6. The chair's rulings, copied

- The brief (W2-FIX-DATA-HISTORY, 2026-11-13): the files above; the work in order (the INCREMENT's MED rows by hand-back 5's section 8; the review's L4 where the file is mine; the census's writers in my files, the writer cured, not the line, every hit read against its town; then a plain merge of the data lane's tip and the hand-back). RULED: record 386's method (read where it prints: three towns of its own cells, a siege, a famine or an occupation among them, the smallest and the largest size; a twin carries its siblings' conditions; a line naming a house, role, force, good or place reads the roster through its declared disqualifier; a line that cannot be made true is not written, a line true somewhere is declared off, never deleted; every disqualifier cure has its guard town); the size ruling (plural streets, an agora, a civic or market square, masonry, neighbourhoods and suburbs are a size error in a thorp or a hamlet; quarters and districts below the middling band, a village of up to about 350 included); a history line speaks of an event only where the town's own timeline holds it, and a line of an occupation that "ended long ago" is not said under one in force; a cure in data moves the record: its field diff confined to its family and declared with its counts, a draw on its own stream; no new key in the record; no new word in the vocabulary file (park with the word); no hidable name in a stored composed sentence; registers only through their doors; pins re-keyed by identity with cause; never bank a baseline row or skip a test; the review's ten H1 reds are known; census.sh's counter exit and a non-empty counts.txt read; never rewrite a commit at or below 90f0a7b9b; pushes to this branch only.
- **21:48 UTC:** the first cut's #267 (R2 #368): the lead reads the income shares; "mostly" only above half; otherwise less, or nothing; measured, declared, read, guarded (item L).
- **21:50 UTC:** CENSUS-2's command (lane at 2686272b1; probes unchanged since 484b55929): run at the start and before the hand-back, with `--files` for the six files; every hit read, then cured or named with its reason; each kind's count at base and tip; its limits said beside any zero.

## 7. The merge (step 4) and what it left

- `3f2396316`: a plain merge of the data lane's tip `43e80bfde`; NOTHING CONFLICTED (git merged every shared register: the culture ledger, the manifest, the widened register, w2FixData4Round, textOf).
- `974ea7492`: the registers the merge left behind, each through its door: the wiring census re-made (`--dry`, write, `--check`); textOf's pin 105 -> 109 (item F's four rows); the main presumed-things register's two Great Construction rows (answered by items E and G's declarations).
- Read at the merged tip against the lane's tip (244 titles of the registers' walkers, ledgers, census tables, pins and guards): every title green on the lane is green here; red on both: poolDominance's three titles and presumedThings' "every source literal" (the lane's 8).
- **STOP for the chair (origin, item G):** `historyData:HISTORICAL_EVENTS_DATA.plotHooks:succession_crisis` top1 0.81 against its ceiling 0.64: with the ailing and the poisoned ruler declared off an elders' rule (69 and 59 false lines), "A would-be heir approaches outsiders" is the one hook left there. The cure is a line written for the elders' case, which the timeline's hook roll cannot take without moving every succession crisis's roll (the list's length is the roll's range); or a ruling on the row. Declared, not banked.
- poolDominance by measure, also declared: + 1 stale row (CULTURE_PROFILES.south_asian.architecturalDetails, no longer drawn by the arrival: item D's twins speak), + 2 loose (HISTORY_DESC_SIBLINGS, item E; plotHooks:market_crash, item A). No door run (not this seat's).
- **The census at the tip** (CENSUS-2's census2.sh on the 720 at `974ea7492`, `--files` the six; its own exit 0, counts.txt 72 rows, read): hits in the six files **318 -> 61** (town+line by kind: a 186 -> 34, c 105 -> 21, b 3 -> 0). The 61, read: the foodways "dense populations" 21 (the STOP, foodGenerator.js); the Great Construction's "or a cathedral" in towns that hold a house of worship but no cathedral 12 (a hedge the item-E declaration admits; candidate, LOW) and its quarry words where the quarry is no house now 13 (past tense; candidate, LOW: the worked-out word, parked); the quarry foreman's descendants 5 (past; LOW); the germanic craftsman 4 (PARKED, a crafts word); the history place words for wharves and a sawmill district 3 and the fire's riverside quarter 1 (route words in towns: candidates, not read further); the pilgrimage faction label 1 (a timeline-anchored tension's label); the guild war 1 (pre-trim roster). Its limits: the dossier's views only (not the PDF, the Foundry journal, the exports, the shared page or the Tonight sheet), and it cannot see two lines of a page disagreeing.
