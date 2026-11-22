# FRAME-9 — hand-back (the session sheet's lane, the owner after FRAME-8)

Last written 2026-11-22T09:22:46Z (`date -u`) by FRAME-9 on `lane/frame-9-2026-11-22`. Seated by the eighth chair (session_01ACmDYY29VRchM87v1yhL9Q); prompt `docs/chair/2026-11-21/eighth/prompts/FRAME-9.txt` on `origin/lane/chair-2026-11-08` (9d7a3c1dd). A successor needs this file, that prompt and the briefs named here.

## WHERE THE LANE STANDS (PARKED at the owner's word, relayed by the chair 09:08 UTC; resume only on "GO FRAME-9")

1. LANE `lane/frame-9-2026-11-22` at this commit (on FRAME-8's `b2dee95f5`, code `7e86f4d8c`). DONE AND PROVEN: the six re-keyed rows, by hand, because neither door can move a row (`a019eae28` classes, `ea7d49a8a` widened; proof `d40add0d5`: three rows re-keyed in each register, 0 other rows differ, 1785/4632 rows unchanged).
2. The two doors are DONE AND PROVEN: lighting census `4af89997c` (3,723 → 3,724; 34/34) and tuning inventory `28cf667e0` (76/76; FRAME_TUNING measured in, unsigned).
3. `tests/lint` WHOLE at `28cf667e0`: GREEN, 220/220 files, 3,271/3,271 tests.
4. UNIT 1 STILL OWES THREE PROOFS, all UNRUN (the chain was stopped at the park, before it started):
   - (c) confinement: `trees.mjs af2fc858f <tip> <dir> --words=none`;
   - first paint: `frame9/tools/firstpaint-index.sh af2fc858f <tip> <dir>`;
   - (b) 2,592 vs 2,541: `frame9/tools/proofb-explain.sh <dir>`.
   Each runs through `scripts/gate-mutex.sh --run`.
5. F3+F4 (unit 2): `lane/frame-9-2026-11-22-f3f4-wip` at `7625a3cf1`.
   - F3 is built and GREEN where run: red first 4 titles; 118 files, 1,055 passed, 1 expected fail; W3 sheets naming the resource 0 → 26 of 26; stranger 330/330; calm owner 267/267.
   - UNRUN: both typechecks, `tests/lint` whole, the lit-law measure (`frame8/tools/F3F4/litHall.mjs`).
   - F4: NOT STARTED. Not yet read by FRAME-9.
6. P1 (unit 3): `lane/frame-9-2026-11-22-p1-wip` at `5b3c4d3c3`. `frame9/P1-LINES.txt` (49 lines) is written and awaits the CHAIR'S RULING: the new face reasons; the hook's colon form, which needs `crisisHooks.js`, outside the manifest; and three cross-crisis links that move by construction. Nothing under `src/`; the pre-measure and proofs are unrun.
7. NEXT STEP AT "GO": run the three proofs of item 4; then read 7625a3cf1 whole and resume the F3F4 builder (typechecks, `tests/lint`, F4); send P1-LINES.txt to the chair. Unit 4 then takes the line tip `git ls-remote` shows (2486d1301 at 08:54).
8. My count: about 165k tokens used (own estimate).

## RULINGS IN FORCE (one list)

1-69. As listed in `FRAME-8-HANDBACK.md` (66-69 in it; 1-65 by its references), all in force.
70. **FRAME-9's prompt governs** where it says more (the eighth chair, 2026-11-22 08:17 UTC): the unit order 1-6 above; the finish line (E30: this lane does not hold the first deploy).
71. **COMMON-EIGHTH 1-12** bind every seat. Item 11: after any change to a test file, `tests/lint` is run WHOLE before the commit is called green. Item 12: up to two builders at once where their manifests do not touch; heavy runs one at a time.
72. **The six moved rows are re-keyed by hand** (the chair, 2026-11-20 22:10 UTC; restated in FRAME-9's prompt): same text, same hash, new file key; a move, not a raise.

## FOR THE OWNER'S SIGNING

- `src/domain/tension/sideArchetypes.js#FRAME_TUNING`: FRAME-1's STARTING DIALS, PREVIEWED ON 330 PLACES, NOT SWEPT (only `creditor.criminal` was read again). It is a DRAFT row of the register and has been in the inventory since `28cf667e0`. What each number does is in `FRAME-7-HANDBACK.md`'s signing section.
- P1's `CRISIS_COUNTERPART_TUNING` joins this list when it comes.

## FOR THE JOIN AND THE SECURITY READER

As in FRAME-6's, FRAME-7's and FRAME-8's hand-backs. F3+F4 will add three things:
- the chain-cause reader `src/domain/display/chainCauseShown.js`, for the join's fold of `EconomicsTab.jsx`, `SupplyChainsPanel.jsx`, `pdf/sections/SupplyChainFlow.jsx` and `pdf/sections/Services.jsx`;
- the export F4 reads, `data/people/dmPowerLines.js :: CAPTURE_RUNG_LABELS`;
- F4's capture line, a fact about crime, owner-only by construction.

## STORED FIGURES THIS LANE MOVED (named, signed by nobody)

None yet under FRAME-9. FRAME-7's (C2b(b)): the golden master's 227 rows; FENCE 1 `9bcbfbef` → `9dc8b4dd`; `generationForkCensus` A1 control `26932f67` → `f1a55652`. All unsigned.

## RUNNING COST IN WORKER BYTES

As FRAME-8 recorded it: the worker at 2,588,252 at the lane's base `bcec56844`; first paint 1,177,668 / 374,666 / 314,465. SR1 adds Brotli +107 (accepted on the first-paint proof) and the worker's +2,599 (on the owner's size list; cause: the stake reasons' wordings).
