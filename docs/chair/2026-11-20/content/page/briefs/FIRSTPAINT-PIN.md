# FIRSTPAINT-PIN — the causes' two fact leaves ride lazy (PAGE-7's brief, 2026-11-20 20:08 UTC)

You are PAGE-7's builder. PAGE-7 integrates; you build. Read `CLAUDE.md`, `CONTRIBUTING.md`, and the comment blocks
of `vite.config.js` around `FIRSTPAINT2_LAZY_DOMAIN` (the BAR4-FIRSTPAINT pin of `facts/houseInputAtHand.js` and its
three siblings, 2026-11-16, is your precedent, line for line) before you change anything.

## The fault (measured by PAGE-7, 20:05 UTC)

The chair's ruling of 19:59: before "PAGE-TROUBLE", one `npm run build` at the tip, then `VERIFY_DIST=1` on
`tests/build/vendorPdfLazy.test.js` and `tests/build/generationWorkerLazy.test.js` through the mutex. A rise is
cured on the lane.

| build | first paint raw | gzip | Brotli | worker |
|---|---|---|---|---|
| the line, 8196e5712 (the chair's) | 1,177,668 | 374,676 | 314,472 | 2,617,934 |
| f7f5986b5 (PAGE-7's base, before the causes) | 1,177,668 | 374,669 | 314,517 | 2,587,927 |
| 634bb257b (the lane tip, causes merged at 01c2bbb99) | 3,282,737 | 941,766 | 768,543 | 2,589,546 |

At the tip `vendorPdfLazy` fails 7 arms (the FIX-B2 chunk `narrative-mutations` and the prose leaves reached first
paint; coherence-lazy and data-lazy are in the entry closure). The cause, read in `dist/`: the EAGER `engine-core`
chunk holds `src/domain/facts/causeHouses.js` (its group table and `causeHouseStands`), and that function's call to
`liveInstitutionNames` imports it from `coherence-lazy` (`import{l as Ma}from"./coherence-lazy-…js"`). That is an
engine-core → coherence-lazy edge. `causeHouses.js` and `src/domain/facts/entrepot.js` (a zero-import leaf; its
`isEntrepot` reader also sits in engine-core) are new leaves of `facts/factsOf.js` (pinned to coherence-lazy). The
derivation walked through factsOf.js into them and put them in eager engine-core, the same premise as houseInputAtHand.js.
`tests/architecture/engineCoreLazyEdge.test.js` and `factHomesLazy.test.js` pass at the tip (6/6). They did not see it.

## The cure

1. In `vite.config.js`, pin `'/src/domain/facts/causeHouses.js'` and `'/src/domain/facts/entrepot.js'` in
   `FIRSTPAINT2_LAZY_DOMAIN`, at the END of the list. Put a comment block in the file's convention above them: the
   premise, the importers (factsOf.js pinned here, `display/tensionCauseHolds.js`, imported by nothing yet), the imports
   (`liveInstitutionNames.js`, which already rides this chunk; entrepot.js none, so coherence-lazy gains no edge), and the
   MEASURED before/after figures (raw, gzip, Brotli, engine-core, coherence-lazy, the engine chunk, the worker). End with
   "Pinned here, never left unpinned (FP-G11)." No source line moves anywhere else.
2. In `tests/architecture/factHomesLazy.test.js`, add the two paths to its guarded list (line ~32, beside
   `houseInputAtHand.js`), with a one-line comment, IF the list's shape takes them as it takes the four. Otherwise
   leave the test and say why.

MANIFEST: `vite.config.js`, `tests/architecture/factHomesLazy.test.js`. Nothing else. STOP and report, do not
improvise, if:
- the pin mints a chunk cycle (`tests/build/bootSmoke.test.js`);
- first paint does not come back within about 1 KB of the base row above;
- the fix seems to need another file.

## Receipts (each quoted in your report)

- RED: `npm run build` at your start, then `VERIFY_DIST=1 sh scripts/gate-mutex.sh --run -- sh scripts/gate-tail.sh npx
  vitest run tests/build/vendorPdfLazy.test.js tests/build/generationWorkerLazy.test.js`. Quote the failing arms and
  the three first-paint figures and the worker's.
- RED for the guard, if you add rows: the guard alone at your start with the rows added and the pin not yet made.
  This only means something if the guard reads the build. If it reads the source graph, say so and skip it.
- GREEN: the same build and the same two tests after. Quote every figure. The worker ceiling arm (2,579,708) is red
  at the base too: report the worker figure, never move a ceiling. Also run
  `VERIFY_DIST=1 ... tests/build/bootSmoke.test.js`, `tests/architecture` whole through the mutex, and `npm run lint`.
- One commit on your branch, author `Claude <noreply@anthropic.com>`. Trailers:
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` and
  `Claude-Session: https://claude.ai/code/session_019yED1NhG5mE6FfoVaq52BV`. Hooks on, never `--no-verify`.

DO NOT: push, merge, open a pull request, take the lighting or wiring census, touch any other file, or read a gate
through a pipe (use `scripts/gate-tail.sh`). Every time label comes from `date -u`. Keep your report short: the
receipts, the figures table before and after, and anything you stopped on.
