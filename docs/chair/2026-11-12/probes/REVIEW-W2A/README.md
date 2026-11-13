# REVIEW-W2A probes (the reviewer's own instruments, saved for the next reader)

The census's own tools are on `lane/second-wave-census-2026-11-12` (probes/SECOND-WAVE-CENSUS). Copy `census.sh`,
`births.mjs`, `count.mjs`, `compare.mjs`, `load.mjs`, `seeds.txt` and `pools.snapshot.json` into ONE folder with these
files. `$S` below is that folder's parent: the scripts expect `$S/tools/`, and the trees at `$S/base` and `$S/tip`
(worktrees with `npm ci` run). The paths are hard-coded to that layout, so edit them if yours differs.

- **Fresh towns:** `render.rvw.jsx` is the census renderer with one extra arm, `rvw-<size>[-<crisis>]-<i>`.
  `sh render.sh <tree> <out> <seedsfile> <workers>` renders through the tree's own OutputContainer as the owner sees it.
  `seeds40.txt` is my cold 40 (§1 of the review).
- **`probe2.mjs`:** `town(seed)` births one rvw town. Run with `node probe2.mjs <keyRegex> <seed…>`; it prints every
  record path whose key matches the regex.
- **Cure 6:** `p6.mjs` (S=… node p6.mjs <census-out>) diffs the base and tip gap readers on the corpus and classes every
  removed line against `resourceAnalysis.gaps[].kind`, `primaryImports` and `imports.critical`. `gapkind.mjs` does the
  same on the cold 40. This is F1.
- **Cure 5a:** `p5a.mjs` (TREE=… node p5a.mjs <census-out>) gives the pool and variant of each removed capture line and
  the page evidence beside it. This is F3.
- **Cure 5b:** `p5b.mjs` lists every town whose criminal structure moved, with its capture state and hall card.
- **Page arm against the counter:** `armcmp.mjs <tree> <census-out>` compares the tree's `pageCensusFindings` with
  `counts.perseed.json`, per seed, per row. `newrows.mjs` counts P2siege/P3source and the Magic "supplied by" line
  (F2; the Python check in the review §9 restricts it to the Systems/Magic view).
- **Pool layers:** `pools-slack.mjs` gives each pool's table layer minus the highest layer its lines declare (needs
  `tests/lint/factLayers.shared.mjs`; copy it into `tests/lint/` of a scratch tree to run).
- **`columns/`:** the census counter's per-seed rows on the 720 at deb1544eb, 2c6435650 and 96d698de7. Run
  `node compare.mjs` on any two of them.

**For the second seat's diff, look first at:**
- whether the Imports line still prints `resourceAnalysis.imports.critical` as arrivals (F1);
- whether `magicSource.js` names houses through `institutionDisplayName` and once each (F2);
- what the capture desk draws at `none` (F3);
- whether `EconomicsTab.jsx` now reads `importsAsPrinted` (F4);
- the DS-POW-6/DS-DEF-4 capture pools' layers (F5).
Re-run `p6.mjs` and `newrows.mjs` on the second seat's tip; they answer F1 and F2 in minutes.
