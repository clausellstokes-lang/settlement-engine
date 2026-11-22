# SAVED-SEAT-REDERIVE: the report. Builder BSR, for SEAT-10.

Written 2026-11-22T04:28:59Z by builder BSR, on the brief `SAVED-SEAT-REDERIVE.md` (at 0494bac43), in the scratch clone on local branch `saved-seat-rederive`. Nothing under `src/` moved. No push, no pull request.

## THE ANSWER

A law-1 saved town stays law 1, its people's bands with it, when the re-derive road runs while the form holds a LIT world's config. CONFIRMED (run): the arm is green on the clean tree, green on the flipped tree, and red under the plant.

## THE ARM

- **Title:** `6. THE RE-DERIVE ROAD (executed): a saved law-1 town re-derived at the tick under a lit world's form config stays law 1, its people's bands with it`, in `tests/domain/seat/seatLawSavedTown.test.js`. The file's header list of arms is extended by one line (6).
- **What it drives** (CONFIRMED, run): a town born DARK through `birthConfig` (`build(false)`, `bear()`), held as a library ROW whose `config` is the town's own (markerless). A lit town (`build(true)`, seed `saved-seat-lit-first`) is Library-loaded FIRST through the file's `libraryLoad`, so the form config holds `_seatLawVersion: 2`. Then the row is opened with `hydrateFromSave`, one npc add-decree is staged through `editSlice.js :: stageAddDecreeIntent`, EM-E1's real `decreeHook.js :: applyDecreesToSaves` marks it applied, and `editSlice.js :: applyRosterDecreesAtTick` runs. That function reaches `settlementRederiveAction.js :: regenerateWithLayer` and so `dmLayer.js :: rederive` and the real pipeline. It is armed the way `tests/store/rosterOpsAtTick.test.js` arms it.
- **The precondition:** `state.config._seatLawVersion === 2` at the tick, asserted the way arm 4 asserts it.
- **The guard that the road ran:** `staged.ok`, the hook's one cause, `receipt.rederived === true`, `receipt.minted` equal to the decree's id, the live view replaced, the roster grown by exactly one, the newcomer present on the derived record and absent from the live one (`expectPresentThenAbsent`), and the library row equal to the derived record.
- **The measure:**
  - (a) `resolveSeatLawVersion` is 1 on both homes, the live view and the library row. `_seatLawVersion` is absent from `config` and `_config` on both, checked with `expectPresentThenAbsent` and anchored by the lit form's keys.
  - (b) The people's `[id, role, powerLevel, powerBandOfRole(role, record)]` equal those of the same road, with the same seed, decree and layer, run with the seat marker stripped from the form. That makes the marker absent from every config in play (the control's form absence is anchored). It is a one-tree differential with no stored digest, and both runs are guarded `rederived` with the same `minted`.
  - (c) `coupContenders(derived)` equals `onDark(() => coupContenders(derived))`. A live discriminator backs this: the same town stamped 2 reads apart on the lit build.

## RED FIRST, BY THE PLANT (scratch copy `scratchpad/bsr-plant`, never committed)

The plant's diff:

```diff
--- a/src/store/editSlice.js
+++ b/src/store/editSlice.js
@@ -982,6 +982,7 @@ function recordDecrees(record) {
  * @returns {object}
  */
 function storedConfigFor(state, saveId, record) {
+  return state.config; // PLANT (SAVED-SEAT-REDERIVE): the road reads the FORM
   const row = (state?.savedSettlements || [])
     .find((entry) => String(/** @type {{id?: unknown}} */ (entry)?.id ?? '') === saveId);
   const stored = isPlainObject(row) ? row.config : undefined;
```

The red's first two lines (CONFIRMED, run; 1 failed | 5 passed (6)). The failure names (a):

```
 FAIL  tests/domain/seat/seatLawSavedTown.test.js > SAVED-SEAT — a saved town keeps the seat law it was born under, on the LIT build > 6. THE RE-DERIVE ROAD (executed): a saved law-1 town re-derived at the tick under a lit world's form config stays law 1, its people's bands with it
AssertionError: (a) the live view: the re-derived town reads the seat law LIT — a FINDING: expected 2 to be 1 // Object.is equality
```

(b) is sensitive too (CONFIRMED, run). In the plant copy only, with the (a) block cut out and arm 6 alone run, it reds on `(b) the people's power levels or bands moved under the lit form config`. So the differential is not vacuous.

## THE COUNTS (CONFIRMED, run; each a single file through the brief's mutex line, `--maxWorkers=1`, output to a file)

| tree | `seatLawSavedTown.test.js` |
|---|---|
| clean (this clone) | 6 passed (6) |
| plant (`scratchpad/bsr-plant`) | 1 failed, 5 passed (6) |
| flipped (`scratchpad/bsr-flipped`) | 6 passed (6) |

## THE FLIPPED COPY'S DIFF (exactly the two dials; scratch, never committed)

```diff
--- a/src/domain/seat/seatCircumstances.js
+++ b/src/domain/seat/seatCircumstances.js
@@ -47,7 +47,7 @@
-export const SEAT_CONTEST_LIT = false;
+export const SEAT_CONTEST_LIT = true;
--- a/src/domain/seat/seatLaw.js
+++ b/src/domain/seat/seatLaw.js
@@ -74,7 +74,7 @@
-export const NEW_SETTLEMENT_SEAT_LAW_VERSION = DEFAULT_SEAT_LAW_VERSION;
+export const NEW_SETTLEMENT_SEAT_LAW_VERSION = HOLDER_SEAT_LAW_VERSION;
```

## THE NEIGHBOURS AND THE WALKERS (CONFIRMED, run, on the clean clone)

- `tests/store/rosterOpsAtTick.test.js` (untouched): 6 passed (6).
- `tests/lint/negativeAssertionAnchor.walker.test.js`: 9 passed (9).
- `tests/lint/sovereigntyLightingContract.walker.test.js`: 1 failed, 33 passed (34). This red was EXPECTED. The census's title count reads `expected 31665 to be 31664`, which is +1 for the new `it`. It was not re-taken here; that door is the integrator's.
- ESLint on the changed test file: clean.

## WHAT IS PLAUSIBLE ONLY (read, not run)

- The remote lane (`regenerateWithLayerRemote`, `VITE_ENGINE_REMOTE`) hands the same `config` to the probe and the replay, so it inherits the local road's reading. That is PLAUSIBLE: the arm runs the local lane only.
- `storedConfigFor` has ONE call site in `src/` (`editSlice.js :: applyRosterDecreesAtTick`, CONFIRMED by grep): the one this arm drives.

## THE COMMIT

The arm and this report are in ONE commit in the clone, on `saved-seat-rederive`. The commit's sha is the first line of the builder's hand-back to SEAT-10, because a file cannot carry its own sha.
