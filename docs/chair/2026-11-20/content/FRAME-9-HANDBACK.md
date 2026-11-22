# FRAME-9 — hand-back (the session sheet's lane, the owner after FRAME-8)

Last written 2026-11-22T08:51:20Z (`date -u`) by FRAME-9 on `lane/frame-9-2026-11-22`. Seated by the eighth chair (session_01ACmDYY29VRchM87v1yhL9Q); the prompt is `docs/chair/2026-11-21/eighth/prompts/FRAME-9.txt` on `origin/lane/chair-2026-11-08` (9d7a3c1dd). A successor needs this file, that prompt and the briefs named here.

## WHERE THE LANE STANDS

- **The lane:** `lane/frame-9-2026-11-22`, pushed at `28cf667e0`, cut from FRAME-8's saved tip `b2dee95f5` (verified equal to origin `lane/frame-8-2026-11-20`; its code is `7e86f4d8c`).
- **Unit 1, SR1's merge finished: IN FLIGHT.** The six `tests/lint` failures at `b2dee95f5` (4 files, 3,265 passed of 3,271: exactly FRAME-8's six) are cured, each by its door as its own commit:
  - `a019eae28`: presumptionClasses, three rows re-keyed by hand, because the door has no move mode (`frame9/tools/rekey-moved-rows.mjs classes`).
  - `ea7d49a8a`: the presumedThings widened register, three rows re-keyed by the same script with `widened`.
  - `4af89997c`: the lighting census by its door (3,723 → 3,724 files, titles 31,348 → 31,359); the ordinary run reads 34 of 34.
  - `28cf667e0`: the tuning inventory by its door. Dependents moved, no value; `FRAME_TUNING` measured in for the first time, unsigned. The ordinary run reads 76 of 76.
  - RUNNING: `tests/lint` whole at `28cf667e0`; then, chained one at a time through the mutex, proof (c) the confinement (af2fc858f → 28cf667e0), ruling 69's first-paint proof (`frame9/tools/firstpaint-index.sh`), and proof (b)'s 2,592 against 2,541 (`frame9/tools/proofb-explain.sh`: FRAME-8's scripts run on SR1's own pair 334f9fb68 → 4eea702d8; SR1's own `proofB.mjs` was never committed).
- **Unit 2, F3+F4: BUILDER OUT** (an Agent worktree on FRAME-9's box, branch `frame9-f3f4` from `ffd084a45`; brief `frame9/F3F4-BUILD-2.md`; it starts from the saved `9d494fc5e`).
- **Unit 3, P1: BUILDER OUT** (an Agent worktree, branch `frame9-p1` from `28cf667e0`; brief `frame9/P1-BUILD.md`; it stops at `frame9/P1-LINES.txt` if a new wording is needed).
- **NOT STARTED:** unit 4 (the line's merge as the chair sends it; then the mixed-pick commit and its re-measure); unit 5 (rule 8's run, "FRAME <commit>", the six sheets); unit 6 (F6, P2, P3a, P3b, P4b, SR2, as the chair releases them).
- **NEXT STEP:** read the lint count line and the three proofs; commit their results to `frame9/SR1-FINISH-RESULTS.md`; report unit 1 to the chair.

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
