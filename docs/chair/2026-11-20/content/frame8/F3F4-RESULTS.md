# FRAME-9 · F3+F4: results (PARKED AT THE OWNER'S STOP, 2026-11-22 ~09:10 UTC)

Brief: `frame9/F3F4-BUILD-2.md`. Branch `frame9-f3f4`, on `ffd084a45`. Started from the saved `9d494fc5e` (cherry-picked, then finished).

## State at the stop
- **F3: built, GREEN on what ran; NOT fully gated.** Typecheck (`typecheck:ratchet`, `typecheck:domain:strict`) UNRUN (queued behind another seat's mutex hold and stopped). `tests/lint` whole UNRUN.
- **F4: NOT STARTED in the tree** (its tests were drafted in a scratch file only; nothing under `src/` for F4).
- **The chair's lit-law question (08:54 UTC): UNRUN.** Script `tools/F3F4/litHall.mjs` written (births the pool through the lit tree's own `birthConfig`, reads `factions[].captureState` and `powerStructure.criminalCaptureState`, applies F4's rule); stopped while queued for the mutex. No answer yet.
- Stopped while: waiting on the gate mutex for the two typechecks and the lit measure.

## F3 as built
- (i) settled: the FIRST impaired chain in `economicState.activeChains`' order; where it has no printed name, no source or no cause, NO row (the next chain is never put in its place). The pool holds no such first chain: 0 of 26 (`tools/F3F4/f3f4.mjs`, `firstChainLacks: 0`), so no STOP.
- (ii) settled: "N more impaired" counts ALL the other impaired chains.
- Red first (src at `ffd084a45`, the tests of this commit): 4 failing titles in `frameSheetRulings.test.js` — "frame-calm-village-20 (one chain impaired)…", "frame-calm-city-22 (five chains impaired)…", "FAIL CLOSED (FRAME-9 (i))…", "over the 63: every W3 owner sheet names its impaired resource…"; and `chainCauseVocabulary.walker.test.js` fails to load (no reader). Green: 26/26 in those two files.
- Targeted gate (tests/domain/summary, tension, display, crisis whole; every test file importing `tonightSheet.js`/`troubleCast.js`; the sheet's renderers' tests; `frameShareVeil.test.jsx`): 118 files passed, 1055 passed + 1 expected fail. No pin outside the list moved. eslint on touched files: clean.
- Counts (330-town pool, `frame6/tools/pool.mjs 55`; `tools/F3F4/f3f4.mjs` + `cmp.mjs`, base `b2dee95f5` vs this tree): W3 owner sheets naming the impaired resource 0 of 26 -> 26; stranger 330/330 equal; calm owner 267/267 equal; framed owner moved W3 26 only (W1 19, W2 13, W4 5 equal).
- Veil reader: over the 26 W3 sheets' 101 impaired chains, 0 are criminal-economy chains, and 0 of the 26 printed chains are worked by a hideable house (`cardVeil.js :: isHideableHouse`, the roster houses of the chain's trade). A criminal chain has no source (catalogue `resource` null), so under the fail-closed rule it can never print. The row names no house.
- First paint: `tonightSheet.js` is loaded only from lazy modules (TableView, SessionMode by React.lazy; the Overview/Daily Life/Economics tabs via `dossierLazyTabs.js`; the PDF; the journal; `crisisPage.js`). The build is FRAME-9's.

## Next step
Run `typecheck:ratchet` and `typecheck:domain:strict` on this commit; then build F4 per the brief (drafted tests to be re-written from the brief), the lit-law measure, and `tests/lint` whole at the last commit.
