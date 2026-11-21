# SIDES: STOPPED at the first-paint proof (PAGE-9's builder, 2026-11-20)

STOP RULE MET: "the first-paint closure up by any byte". Nothing is committed for SIDES. The work stands UNCOMMITTED in
this worktree (`src/domain/display/tensionShown.js`, `tests/domain/display/tensionShown.test.js`, four wired surfaces;
the surface diff is `wiring.uncommitted.patch` here). The only commit on the branch past the base is the chair's cure,
cherry-picked as told: f4798f692 (`-x 9716feaa7`).

## The proof (EXECUTED, `closure.mjs`, the vendorPdfLazy test's own closure walk)
| | raw | gzip | Brotli |
|---|---|---|---|
| base 53bc3d7da (`closure.base.txt`) | 3,286,201 | 942,892 | 769,600 |
| tip, SIDES wired (`closure.tip.txt`) | 3,298,405 | 946,042 | 771,356 |
| delta | +12,204 | +3,150 | +1,756 |

The whole raw rise is ONE chunk: `data-lazy` 1,822,689 -> 1,834,893 (+12,204). The sides table
(`src/data/tensionSideMeanings.js`) lands in `data-lazy` (vite.config.js routes every non-eager `/src/data/` module there)
and in `pdfRender.worker` (lazy). `data-lazy` is ALREADY in the first-paint closure at base (PAGE-7's `factsOf.js` ->
`causeHouses.js` -> `liveInstitutionNames.js` edge, per the coordinator), so any wiring of the table puts its bytes in
first paint, wherever the importing surface sits: the surfaces themselves are lazy (`dossierLazyTabs.js` HistoryTab /
OverviewTab, `DossierSearchResults.jsx` via React.lazy, the PDF view model behind the export). No load restructuring was
attempted (forbidden). INFERRED: once `data-lazy` leaves first paint (PAGE-7's cure), the same wiring adds 0 B to it.

The two lazy tests at tip: 8 failed | 58 passed (66), the SAME red list as base (`buildtests.{base,tip}.full.txt`,
diffed equal): no new red.

## What else was done before the stop (all EXECUTED)
- Reader census: `READERS.md`.
- Red: `red.out.txt` (module missing); guard red on exactly the 7 tension-side reads before wiring: `guard.red.txt`.
- Green after wiring: `green.out.txt` (19/19).
- Parity arm over the 300 + 720 (`parity.mjs` / `parity.out.txt`): 1,020 towns, 1,749 tensions x 5 projections = 8,745
  pairs, 25,380 sides: differences 0 (allowed 0, stop 0). The owner's shown sides differ from the stored words (beyond a
  capital) on 421 tensions.
- Born hash (`bornHash.base.txt` / `bornHash.tip.txt`, build/CARD/bornHash.mjs): 300 and 720, `cmp` identical.
- Named fills (`namedFills.out.txt`): "Guild members" (craft power) is filled from the roster's sole `economy` power: 28x
  "Merchant Guilds", but also "Grain Holders" (2) and "Merchant oligarchy" (1). The roster has no craft mark; the chair
  should rule on MEANS_CATEGORY['craft power'] before this ships.
- Gates (tests/lint, typechecks, lint) and pins NOT run: the stop came first.
