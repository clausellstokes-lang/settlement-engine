# The landing of the seam after BAR6 and of the three audit branches on the joined line: part one, six points, no collision

The joined line `lane/join-2026-11-14` stands at cfc2b680a516db49287c7a067b2007da8f3f92ce (the close of BAR4 and all eleven
branches of BAR6). The chair rehearsed the join of the six branches below on a scratch tree at that tip (2026-11-17, 04:10
UTC), in this order, each by a merge with no fast-forward: NOT ONE COLLISION. Two seam seats (SCENES and DESKS) are still
measuring and land in a part two of their own.

## The six points, in this order

| point | branch | at | what it is | after its merge: `git rev-parse HEAD^{tree}` · `HEAD:src` |
|---|---|---|---|---|
| 1 | `lane/bar6-seam-pdf-2026-11-17` | fb095a3107744d145245139ed6970422f2c0e74b | the seam's PDF seat | b016b240acc4271e179068a04a5b46cb9a855ab7 · 62a9ba1fe2a61013dcc3fb81d0cd7215825ed2d1 |
| 2 | `lane/bar6-seam-culture-2026-11-17` | 084af6faef12ccff867c7da1f13da057a65ef58a | the seam's culture seat | 41ebd898212a89c36ba5c3717d8237f65d84f4cf · 6f91a92950bc7075f0c06850b99a9edf0cc8d200 |
| 3 | `lane/bar6-seam-econ-2026-11-17` | 5c8422787745a8ac65d1d16f5cd33020cebe0f13 | the seam's economy seat | 07f5ded3d4fbc0cde0a870dca3a11afbc190ff6e · 0c89a43d7c466cc603b98a4fa47f85d4a72294c8 |
| 4 | `lane/birth-audit-2026-11-17` | 7adfa7055463d7c825bc0b783b8930af8cd54d12 | the born-short audit (documents and probes only) | 277ecba651004cc2284f90450988333af82ef87b · 0c89a43d7c466cc603b98a4fa47f85d4a72294c8 |
| 5 | `lane/bar7-audit-h-2026-11-17` | f4b8c52686189c3154f2689099bfbc16a285ccce | the next round's audit H (new files only) | 88eff13335f73543c9dec723fab7d4a78bcba43f · 0c89a43d7c466cc603b98a4fa47f85d4a72294c8 |
| 6 | `lane/bar7-audit-i-2026-11-17` | 6fbf6ac747e067e9222437778b06787c37d0cc6c | the next round's audit I (new files only) | 1b8845bd8275025d7e71299f2e6a9379307e648c · 0c89a43d7c466cc603b98a4fa47f85d4a72294c8 |

THE HASH DECIDES at every point (each reading above is with the line at cfc2b680a and nothing else committed between;
your own hand-back commit comes AFTER the sixth merge). Any other reading is a STOP: say which point and what you read.
A collision at any point is a STOP too: the rehearsal met none.

## What the merged tree reads (the chair's checks at the rehearsal tree of the six)

Hard gates green: `npm run typecheck:domain:strict`; `npm run typecheck:ratchet`; `npx eslint` on the changed sources;
`npx vitest run tests/architecture`; `npm run build` with `tests/build/vendorPdfLazy.test.js` and
`tests/build/bootSmoke.test.js`. RED ON PURPOSE OR BY NAME, and not yours to cure (re-take nothing):
- `tests/domain/bar6ScenesGoods.test.js`, one arm, and `tests/generators/bar4ScenePresumption.test.js`'s census arm (2 of
  the 720): the seam's SCENES seat holds both; they land in part two.
- `tests/pdf/tailExportsPdf2Batch2.test.jsx`: 2 of 16 cases (E17/house, E17/pill: red before the seam); the next round's.
- the two doors' fresh and stale rows, `tests/lint/presumptionClasses.walker.test.js`, the stored figures and every pin
  that reads the reference files: the ONE close's (a new word of the owner in the chair's chat).

## Alone at each seam point (as you did for the round): the branch's added tests, eslint on its changed sources, the strict gate

Point 1: `tests/pdf/seamPdfReadsTheTabs.test.jsx`. Point 2: `tests/domain/bar6CultureLines.test.js` (modified, its own).
Point 3: `tests/domain/bar6SeamEcon.test.js`. Points 4 to 6 add no test file (detectors under `tests/helpers/pageLaws/`,
runners and documents under `docs/chair/2026-11-17/`): the strict gate and `npx vitest run tests/architecture` after the sixth.
