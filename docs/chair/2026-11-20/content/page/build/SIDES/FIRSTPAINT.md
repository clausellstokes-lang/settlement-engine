# SIDES: the first-paint proof at the cured base (PAGE-9's builder, 2026-11-20)

EXECUTED, through the gate mutex, `npm run build` then `closure.mjs` (the vendorPdfLazy test's own entry-closure walk; gzip -9,
Brotli q11) on each tree:

| tree | files | raw | gzip | Brotli |
|---|---|---|---|---|
| cured base 26830ee84 (`git archive` of the merge, no SIDES; `v2.closure.curedbase.txt`) | 8 | 1,178,011 | 374,772 | 314,541 |
| tip, SIDES (`v2.closure.tip.txt`) | 8 | 1,178,011 | 374,769 | 314,649 |
| tip minus cured base | 0 | **0** | **-3** | **+108** |

THE +108 BROTLI IS CHUNK-HASH NAMES, NOT THE TABLES. The only closure file that moves is the entry chunk `index-*.js`, at
the SAME raw size (488,958 B at both) and Brotli 128,741 -> 128,849. With every `-<8-character hash>.js` replaced by
`-HASH.js` (`sed -E 's/-[A-Za-z0-9_-]{8}\.js/-HASH.js/g'` over each file split on `,`/`;`), the two index files are
BYTE-IDENTICAL (`cmp`: "IDENTICAL after chunk-hash normalisation"). They differ only in the names of lazy chunks whose
contents moved (the tabs and exports that now import the reader), so their hashes moved. The coordinator accepted the
drift at 21:4x UTC as a vetoable call put to the chair.

WHERE THE TABLES LAND: `src/data/tensionSideMeanings.js` rides `data-lazy-B8ZYWI0g.js` (lazy: NOT in the first-paint
closure at the cured base) and `pdfRender.worker-BBrQcHwr.js` (lazy). `tensionShown.js` and `tensionSidePower.js` carry no
string marker (minified); they ride with their lazy importers.

THE CURED BASE READS +18 RAW against the coordinator's expected ~1,177,993: it is this branch's merge 26830ee84 (the
reader-bytes cure f4798f692 + PAGE-7's afacca8a6), a different tree from PAGE-7's tip, built from a `git archive`.

THE LAZY TESTS (`tests/build/vendorPdfLazy.test.js`, `tests/build/generationWorkerLazy.test.js`, VERIFY_DIST=1): 5 failed |
61 passed (66) at the cured base and at the tip, the same five (`v2.buildtests.{curedbase,tip}.full.txt`, diffed equal):
the worker bundle ceiling, the engine chunk's presence, and the three closure budgets. No new red.

The first measure (before PAGE-7's cure, `closure.base.txt` / `closure.tip.txt`, `STOP.md`) stands as history: there the
table rode `data-lazy` INTO first paint (+12,204 raw).
