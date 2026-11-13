# W2-FIX-DATA-HISTORY — the hand-back (kept current after every item; the lane's sixth seat makes the lane's one statement)

**Seat.** The data lane's history, culture and arrival seat, on its own branch `lane/w2-fix-data-history-2026-11-13`, cut from **`90f0a7b9b` exactly** (the data lane's tip when the brief was written; read back from origin at the start: equal). Chair: `session_01FE9mEws7PXYRYdjQPbSX15`. Every figure is EXECUTED unless marked PLAUSIBLE. The chair's rulings this seat works to are copied in section 6.

**Files held (and no others under src/):** `src/data/historyData.js`, `src/data/historyDescVariants.js`, `src/generators/historyGenerator.js`, `src/data/cultureProfiles.js`, `src/data/arrivalProse.js`, `src/data/inlandDescriptions.js`; the tests and registers that pin them.

## 0. Instruments (scratchpad; re-made in minutes)

- **Births, 1,540 in the app's shape** (the fifth seat's families, rebuilt): CENSUS-2's `probes/CENSUS-2/seedcfg.mjs` verbatim for the census 720 (`r2r-*`, `r2s-*`) and the readers' 80 (`rr2s-*`, `rww-*`, `rpf-*`); REVIEW-W2A-3's `seeds20.txt` (`rw3-*`, the same cfgFor arm); the fresh 720 added to seedcfg as the fourth seat defined them (`w2fd4r-<size>-<0..59>`: every dial random but the crises, Random off, none ticked; `w2fd4s-<crisis>-<size>-<0..9>`: one forced crisis over siege, famine, occupation, plague, war, insurgency). CENSUS-2's `births.mjs` writes the corpus (about 60 s a tree).
- **The census at the base**: `census2.sh <base tree> <out> 4 --seeds seeds1540.txt` (the 720 are its first 720 rows): its own exit 0, counts.txt 83 rows (the chair's hazard checked). Hits in the six files: **720: 318 (kind a 186, c 105, b 3); 1,540: 776 (a 464, c 231, b 6)** (town+line).
- **Record counters** (`rows.mjs`, through the tree's `factsOf`), a leaf-by-leaf **field diff** (REVIEW-R2-STAGES' `fielddiff.mjs`), a **sentence diff** of moved births, a **read of 30 moved births** by stride, and the **governing tests** (every test file naming the history modules, 43 then 44, `--reporter=json`, at the item's parent and at the item, compared title by title).

## 1. Items done (each commit carries its receipts)

| item | rows | commit | count (1,540 births, app shape) | moves |
|---|---|---|---|---|
| A | INCREMENT ww-543, ww-572, ww-1524; CENSUS-2 `historyDescVariants.js :: economic_disparity` | `0bdeef11c` | the Divide's merchants where no market 119 -> 0; trade dispute 17 -> 0; the crash 28 -> 0; any history merchant where no market 190 -> 56 | 180 births: history; receipt 131; arrival 5 (memory beat) |
| C | review L4; INCREMENT ww-254, ww-724, ww-752, ww-754, ww-755, ww-756 | `3384e3b58` | occupation tension with no occupation on the timeline 73 -> 0; "former occupier officer" under an occupation 9 -> 0 | 82 births: history; receipt 73 |
| L | the chair's row (the first cut's #267, R2 #368); INCREMENT ww-1489 | `01f58571f` | a false "runs mostly on" 135 -> 0 (72 now "Among the trades", 63 no lead) | 135 births: only tension descriptions (+ siegeNarrative copy) |

## 2. The INCREMENT's MED rows in my files (section 8 of hand-back 5), line by line

| line | state |
|---|---|
| ww-254, ww-724, ww-752, ww-754, ww-755, ww-756 | CURED C |
| ww-945 (the officer under an occupation) | GONE at the base (the fifth seat's item 1); the timeline's form CURED C |
| ww-543, ww-572, ww-1524 | CURED A |
| ww-896 ("the physician knows") | GONE at the base (now "someone in the household knows") |
| ww-1230, pf-160, pf-325, pf-363 | OPEN (next) |
| ww-10, ww-345, ww-1465, ww-618, ww-779, ww-1030, ww-1351 (culture) | OPEN (next) |
| ww-26, ww-90, ww-1518 (history generator) | OPEN (next; ww-1518 gone at the base) |
| ww-541, ww-1450, ww-1487 (arrival) | OPEN (next) |
| ww-1261 (historyDescVariants) | OPEN (next) |
| ww-1489 | CURED L |

## 3. Parked, with what each needs

(none yet)

## 4. Calls taken without the chair

1. **Item A declares whole templates, not lines.** The Divide's lasting effects and hooks are drawn by `generateEventNarrative`'s own rolls, which read no declaration, and historyGenerator.js stands at 791 of its 800 effective lines; the template's declaration is the door that exists. Given up: 10 of the 138 removed Divide events named no merchant (variant 0, the arbitration council, the hanged reformer) and were true-ish there. The crash is declared too: it is the pool's next template and speaks of a market as surely.
2. **Pins re-keyed by cause, assertions kept:** `w2FixData2Tensions.test.js` (its fixture answers the market), `narrativeQualityCorpus.test.js` (the sweep's metropolis holds a market square), `hookTablesDeclared.test.js` (17 -> 18 rows), `tensionTemplateDeclaration.test.js` D-1b (the six births now hold no unanchored tension, and keep one).
3. `npm ci` set `core.hooksPath=.husky/_` (known); local config and refs compared before and after every push and suite: nothing else moved.

## 5. Carried reds (identical at the base and at every item)

The governing set's three: `proseComposed` A13, the generator golden master, `census2eTables`' CULTURE_ARCHITECTURAL_DETAILS row. The ten titles of the review's H1 are the sixth seat's (not cured here).

## 6. The chair's rulings, copied

- The brief (W2-FIX-DATA-HISTORY, 2026-11-13): the files above; the work in order (the INCREMENT's MED rows by hand-back 5's section 8; the review's L4 where the file is mine; the census's writers in my files, the writer cured, not the line, every hit read against its town; then a plain merge of the data lane's tip and the hand-back). RULED: record 386's method (read where it prints: three towns of its own cells, a siege, a famine or an occupation among them, the smallest and the largest size; a twin carries its siblings' conditions; a line naming a house, role, force, good or place reads the roster through its declared disqualifier; a line that cannot be made true is not written, a line true somewhere is declared off, never deleted; every disqualifier cure has its guard town); the size ruling (plural streets, an agora, a civic or market square, masonry, neighbourhoods and suburbs are a size error in a thorp or a hamlet; quarters and districts below the middling band, a village of up to about 350 included); a history line speaks of an event only where the town's own timeline holds it, and a line of an occupation that "ended long ago" is not said under one in force; a cure in data moves the record: its field diff confined to its family and declared with its counts, a draw on its own stream; no new key in the record; no new word in the vocabulary file (park with the word); no hidable name in a stored composed sentence; registers only through their doors; pins re-keyed by identity with cause; never bank a baseline row or skip a test; the review's ten H1 reds are known; census.sh's counter exit and a non-empty counts.txt read; never rewrite a commit at or below 90f0a7b9b; pushes to this branch only.
- **21:48 UTC:** the first cut's #267 (R2 #368): the lead reads the income shares; "mostly" only above half; otherwise less, or nothing; measured, declared, read, guarded (item L).
- **21:50 UTC:** CENSUS-2's command (lane at 2686272b1; probes unchanged since 484b55929): run at the start and before the hand-back, with `--files` for the six files; every hit read, then cured or named with its reason; each kind's count at base and tip; its limits said beside any zero.
