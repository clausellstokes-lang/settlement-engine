# PAGE-9's brief: CAUSES-WIRING (the chair's ruling 15 of 15:10 and its message of 18:39 UTC)

Written by PAGE-9, 2026-11-20 18:39 UTC (`date -u`). ONE builder under the common law of `BUILD.md` beside this file (render only, born
documents hashed equal at base and tip: the 300 and the census's 720, red first, gates to files, ONE commit, no push,
no pull request). It is built in the SAME MODULE as the sides (`SIDES.md`, its PAGE-9 amendment): if one builder takes
both, SIDES first, then this, TWO commits.

## Base
The display lane AFTER PAGE-9 merges PAGE-7's "CAUSES `3411c9c83`" (`lane/page-7-2026-11-20`). That merge brings
`src/domain/display/tensionCause.js :: tensionCauseSentenceOf(record, tension)`, `src/data/tensionCauses.js`,
`src/domain/display/tensionCauseHolds.js`, `src/data/tensionSidePower.js :: solePowerNameOf` and the sides table
`src/data/tensionSideMeanings.js` (blob equal to `c5da1cfb3`'s, measured). NONE OF THOSE FILES IS EDITED HERE: the
function is called, never copied; a wrong sentence goes to PAGE-9, who sends it to the chair.

## The chair's words (18:39 UTC)
"every surface that names a trouble prints that function's sentence; no surface says one trouble in two ways; the
served document and the owner's print the same sentence (a parity arm)." And ruling 15: "the WIRING ONLY: first a
census of the readers of a tension's `description` (the page, the session sheet, the export, any card), then every
surface in PAGE-4's files calls it; a surface in another seat's files is NAMED to the chair, not edited. No pick, no
predicate." `tensionCauseSentenceOf` returns null for a kind with no table: then the stored `description`, as today.

## The unit
1. MEASURE FIRST (write it under `docs/chair/2026-11-20/content/page/build/CAUSES-WIRING/`): the census of every reader
   of `history.currentTensions[].description` (and of any other field that states the trouble itself) in `src/`:
   file :: symbol, the surface it feeds (web tab, PDF, Foundry, export, session sheet, AI grounding, card), the
   audiences that reach it, and whether it is in this lane's files (`src/components/`, `src/domain/display/`,
   `src/pdf/`, `src/foundry/`). The form of `git show 837394d8f:docs/chair/2026-11-20/content/page/SIDE-READERS.md`.
2. THE PARITY MEASURE, before any wiring: over the 300 (`hxd-<size>-<i>`) and the census's 720, for every tension
   the served document still holds, `tensionCauseSentenceOf(owner, t) === tensionCauseSentenceOf(served, t')` where
   `served` is EACH projection a non-owner page is given (`publicSafe.js :: toPublicSafe` and every other the shared,
   player and public reads use: find them) and `t'` the same tension in it. ANY DIFFERENCE STOPS YOU: report the
   town, the kind and both sentences (a wording chosen by a fact the owner can hide is forbidden: `factLayers.js`).
3. WIRE: in ONE display module beside the sides reader (`src/domain/display/tensionShown.js`, the name SIDES uses),
   `tensionSentenceShown(record, tension)` = `tensionCauseSentenceOf(record, tension) ?? <the stored description>`;
   every surface of (1) in this lane's files prints a trouble's sentence ONLY through it, with the document IT was given
   (a served page passes its served document). A surface that today prints the description AND another wording of the
   same trouble prints one of them: say which and why.
4. TESTS, red first, on a MADE-UP record (a sentence COMPUTED through the function, never quoted): a surface prints the
   function's sentence where a table holds, the stored text where none does; the parity arm of (2) as a test over the
   born pools (owner vs each served projection); THE GUARD: a source scan that no file in this lane's directories
   reads a tension's `description` for print except `tensionShown.js`.
5. PINS moved by the new text are re-taken BY THEIR DOORS with the cause in the commit: the page census, 
   `tests/components/dossierPhoneFloorAllViews.test.jsx`, `tests/ui/safetyReaderBytes.test.jsx`
   (`SAFETY_READER_BYTES_RECORD=1`: name every moved surface; a surface that moves for a reason other than this sentence
   STOPS you), the lighting census by its door for a new test file, `npm run check:wiring`'s producer index if it moves.
6. Files: `src/domain/display/tensionShown.js`, the surfaces of (1) in this lane's files, tests. Never PAGE-7's files,
   `src/domain/summary/`, `src/domain/crisis/`, `src/domain/tension/`, the session sheet, `publicSafe.js`,
   `gallery*.js`, `src/domain/veil/`, `supabase/`, `tests/security/`.

## The report (at most 400 words)
Commit; the readers' census (path); the parity counts (towns × tensions × projections, differences 0, or the STOP);
every surface wired (file :: symbol) and every one NAMED for another seat; red-then-green receipts under
`build/CAUSES-WIRING/`; born-hash counts (`build/CARD/bornHash.mjs`); each pin's before -> after with its cause;
gates: `tests/lint` WHOLE, both typechecks, lint (each through `sh scripts/gate-mutex.sh --run --`, to a file).

## ADDED BY PAGE-9, 2026-11-20 19:28 UTC (`date -u`), on the chair's condition of 19:28 UTC: THE FIRST PAINT DOES NOT GROW

The trouble half's modules (`src/data/tensionCauses.js`, `tensionSideMeanings.js`, `tensionSidePower.js`,
`src/domain/display/tensionCause.js`, `tensionCauseHolds.js`: about +77.5 KB source, +43.9 KB minified) are unwired
today; YOUR wiring decides where they ship. `tensionShown.js` must NOT be reached statically from `main.jsx`'s closure,
nor from any module a generator reaches; `facts/causeHouses.js` (already eager through `factsOf.js`) must not pull the
tables after it. The surfaces are tabs and exports behind `import()` (`dossierLazyTabs.js`); CHECK every static
importer of a surface you wire (e.g. `DossierSearchResults.jsx` imports `HistoryTab.jsx`'s `TensionRow` statically:
find whether that file is itself lazy). PROOF, through the gate mutex, never a pipe: `npm run build` at base and at
your tip, then `tests/build/vendorPdfLazy.test.js` and `tests/build/generationWorkerLazy.test.js`; the first-paint
closure's raw, gzip and Brotli bytes at base and tip: NOT ONE BYTE UP; and name the chunk the tables land in. A rise
STOPS you: report it, do not restructure the app's loading.
