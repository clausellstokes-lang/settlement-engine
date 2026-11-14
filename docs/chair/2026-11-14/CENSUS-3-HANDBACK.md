# CENSUS-3 — hand-back (kept current after every item)

Seat: CENSUS-3, measure only. Branch `lane/census-3-2026-11-14` (local name in my scratch worktree: `census3-own`).
Tree read: `lane/join-2026-11-14` at c2c12792e (later than b6a5f97ab). Nothing under src/, tests/, scripts/ or any
register changed. The chair's "LANDED: <hash>" has not reached me (asked once, 13:3x UTC).

## Rulings worked to
- The brief (docs/chair/2026-11-14/briefs/BRIEF-CENSUS-3.md on lane/chair-2026-11-08). No later ruling received.

## Done
- **Item 1** (e65ae7427): CENSUS-2's command unchanged at c2c12792e, tabs only. Towns of 720 then→now: a 712→516,
  b 70→46, c 301→43, d 382→22, e 60→15, f 720→309, g 720→0, h 20→2. The writers' table (130 writers) with holders.
  Read: f's 300 towns are "(guild)"/"(district)", which the display leaf keeps by ruling (R2-CODE-B round 3 (a)):
  WEAK by ruling. Kind a's ten widest writers came out 6 of 10 false; tightened (patterns.mjs: ELSEWHERE + seven
  words; alchemist x "Apothecary & Alchemy"). That fixes three of the four non-faults (REMEDIES_LINE,
  DESC_VARIANT_SIBLINGS, Last rites, IRON_IMPORTED_LINE); the re-read is NOT done.
- **The instrument, extended (written, run on 2 towns, full run in flight at c2c12792e):** render.census3.jsx (the
  Tonight sheet as REVIEW-BAR-0 renders it; the PDF's text: SettlementPDF's tree, function components executed as
  tests/pdf/chainStateThreeSurfaces.test.jsx walks it, one line per outermost Text, with the props
  generateSettlementPDF builds; the journal: buildJournalPages markdown, markup struck), surfaces-i.mjs (kind i:
  chain state, chain count, chain outputs, food word and figure, stores span, house label, exports list; L14),
  patterns-c3.mjs (L1–L13, L15, L16; what is not checkable is in LAW_NOT_CHECKED), fall.mjs, worklist.mjs,
  recall3.mjs, burndown.mjs. Two-town proof (r2s-under_siege-town-0, r2r-thorp-1): kind i found the PDF card's
  "Active" against the tab's "Running", the PDF's 16 chains against the tab's 17, a PDF card output ("Leather goods")
  the tab's card lacks, the food shortfall 1,881 (PDF, journal) against 1,879 (tab).

- **Items 2, 4, 5 counted at c2c12792e** (the second commit): the four-surface fall table, recall 12 of 103 printing
  HIGH+MED bar rows, the burn-down, and a PROVISIONAL worklist (kinds a,b,c,d,e,h, every surface). In the report.
  HANDED BACK AT THE COUNT (~350k of 400k, read with get_session).

## WHAT IS LEFT, line by line
0. Fix the two on-sight instrument faults first: L8's row count (it misses rows in 717 towns) and i's journal chain
   count (476 towns, unverified); narrow L10 to the law's words; L2's key-in-brackets to non-words.
1. The precision reads of every new kind (i, L1–L16) and the re-read of a (tightened) and f's other arms: `node
   sample.mjs <out>/hits.json <out>/corpus.ndjson.gz <kind> 30` (20 when under 60 distinct lines), then the ten
   widest writers once each; put each figure in precision.json and pass it to worklist.mjs. Two kinds look weak
   on sight: L3 (glued text; the PDF's fixed header "SettlementForge" is struck, others may remain) and L2's
   camelCase arm (now PDF and journal only).
2. (DONE at c2c12792e; re-run at the landed tip) Item 4, recall on the bar's first read: `node recall3.mjs <runBar> REVIEW-BAR-0-LIST.json` (the bar0 towns run
   first in the in-flight script, $S/runBar).
3. (DONE at c2c12792e; re-run at the landed tip) Item 5, the burn-down: `node burndown.mjs <runBar> REVIEW-BAR-0-LIST.json <run-720> JOIN-ROWS.json`.
4. Item 6 at the landed tip: a new detached worktree at the hash, `npm ci` (then restore the shared config:
   `npm ci` writes core.hooksPath=.husky/_ into the main clone's config; it was not set before; I unset it), holders
   re-read (`holders.mjs` with the lanes listed in holders.tipA.json; js and jn against the joined line), then
   `census3.sh <tree> <out> 4` and worklist.mjs with the read precisions. `--reuse` does not cross trees.
5. Item 7: the report's surfaces, recall, burn-down and worklist sections; the one message to the chair.

## How the instruments are re-made
`git archive origin/lane/census-3-2026-11-14 docs/chair/2026-11-14/probes/CENSUS-3 | tar -x -C <scratch>`; run from
there against any tree with node_modules: `sh <probes>/census3.sh <tree> <out> 4 [--seeds f] [--files a,b]`.
Inputs read from other lanes: bar0rows.json = the ten BAR-0-ROWS-*.json of lane/chair-2026-11-08
docs/chair/2026-11-14/bar-0-rows/ concatenated; JOIN-ROWS.json from lane/join-rows-2026-11-14.
