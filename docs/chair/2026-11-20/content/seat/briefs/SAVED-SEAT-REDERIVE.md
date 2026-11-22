# SAVED-SEAT-REDERIVE: the owed arm. The re-derive road EXECUTED for a law-1 place under a lit world's config. Builder BSR.

Written 2026-11-22T04:20:35Z by SEAT-10, on the chair's order of 04:06Z (item 2 of the chair's second base). It is owed by UK-LEGACY's sweep (d).

## THE QUESTION

Does a law-1 place stay law 1, its people's bands with it, when the **re-derive road** runs while the world in the form is LIT?

The saved-place test (`tests/domain/seat/seatLawSavedTown.test.js`) has five arms: save, load, regen, clone, both transfers, apply-and-regenerate, the legacy edge and import. None of them drives the re-derive road.

## THE ROAD (read it; PLAUSIBLE until your arm runs it)

- `store/campaignAdvanceSession.js` calls `store/editSlice.js :: applyRosterDecreesAtTick(get, set, request)` (the tick's half of the roster ops).
- That calls `lane.regenerateWithLayer(live, storedConfigFor(get(), saveId, live), layerForRun, DECLARATION_CONSULT)`.
- `store/settlementRederiveAction.js :: regenerateWithLayer` calls `domain/edit/dmLayer.js :: rederive`, which calls `generateSettlementPipeline(config′, …)`: a BIRTH-shaped re-run, classified non-minting.
- `editSlice.js :: storedConfigFor(state, saveId, record)` reads the save ROW's `config`, else the record's `_config`, else `{}`. It never reads the form (`state.config`).
- `tests/store/rosterOpsAtTick.test.js` drives this function on real state: start from how it arms the store, stages a roster decree and runs the tick. `tests/lib/engineRemoteRederive.test.js` shows the lane in local mode.

## THE ARM (one `it`, in the existing file, its numbering continued)

- **The place:** a law-1 place: a town born DARK through `birthConfig` on the file's own planted build (`build(false)`). Hold it as a SAVED ROW, with the row's `config` the town's own (markerless).
- **The lit world:** before the tick, the store's FORM config holds a LIT world's marker. Do it the way arm 4 does: a lit town (`build(true)`) Library-loaded first through the file's `libraryLoad`. Assert that precondition, as arm 4 does: `state.config._seatLawVersion === 2`, or the edge is not reached.
- **The road EXECUTED:** run `applyRosterDecreesAtTick` for that save with one roster decree due, so the re-derivation actually runs. Assert that it ran: the derived record differs from the live one by the newcomer, or by whatever the tick's envelope says it did. A guard that the road was not skipped is required.
- **The measure:**
  - (a) `resolveSeatLawVersion` of the derived record is 1, and the derived record carries no `_seatLawVersion` on its `config` or `_config`.
  - (b) **Its people's bands with it:** the derived record's NPC power levels or bands equal those of the SAME re-derivation (same seed, same layer) run with the seat marker absent from every config in play. Use a one-tree differential, as arm 4's tail does. NO stored digest.
  - (c) `coupContenders(derived)` equals the same call read on the dark dial (the file's `onDark`).
- **Labels:** every `expect` names its label, as the file does. Use `expectPresentThenAbsent` for any absence (the negative-assertion walker).

## RED FIRST, BY A PLANTED FAULT (in a scratch copy, NEVER committed)

- **The plant:** the road made to read the law off the config it is handed, the FORM. In `editSlice.js :: storedConfigFor`, return `state.config` (the form) in place of the row's config.
- With the plant, the arm must red with a message naming (a) or (b). Quote the plant's diff and the red's first two lines.
- On the CLEAN tree (no plant), the arm is green, and the file is 6/6.
- **IF THE ARM IS RED ON THE CLEAN TREE, that is a FINDING.** STOP. Do not change `src/`, do not weaken the arm. Report its first two lines and the path by symbol.

## WHERE AND WHAT YOU MAY TOUCH

- **Tree:** ONLY the scratch clone `/tmp/claude-0/-home-user-settlement-engine/063b430e-c1e9-57b8-bc28-1d71aefb0933/scratchpad/bsr`, on its local branch `saved-seat-rederive`, at the commit of this brief. NEVER `/home/user/settlement-engine`.
- **Files:** `tests/domain/seat/seatLawSavedTown.test.js` (ONE new `it`; the file's header list of arms extended by one line) and your report `docs/chair/2026-11-20/content/seat/briefs/SAVED-SEAT-REDERIVE-REPORT.md`. NOTHING under `src/`.
- **Git:** commit in the clone by explicit paths. No push, no pull request.

## GREEN

- The file 6/6 clean.
- The file 6/6 in a FLIPPED scratch copy: exactly the two dials, `seatLaw.js :: NEW_SETTLEMENT_SEAT_LAW_VERSION = HOLDER_SEAT_LAW_VERSION` and `seatCircumstances.js :: SEAT_CONTEST_LIT = true`. Quote its diff.
- `tests/store/rosterOpsAtTick.test.js` green, untouched.
- `tests/lint/negativeAssertionAnchor.walker.test.js` green.
- `tests/lint/sovereigntyLightingContract.walker.test.js`: EXPECTED red on the census's title count (+1, your new `it`). Report the figure; do not re-take it. That door is the integrator's.

## LIMITS

- **Runs:** single files only, through `TMPDIR=/tmp GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=1 <files>`, output to a file. Never read a gate through a pipe. No whole-suite run, no build.
- **Environment:** never with GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY or GIT_PREFIX set. No supabase, no hosted database, no deploy.
- **Wall time:** about 60 minutes.
- **If your own permission check refuses any action:** that refusal stands. Report it in one line and try nothing else to the same end.

## OUTPUT

The report holds:
- the arm (its title, what it drives, the guard that the road ran);
- the plant's diff and the red's first two lines;
- the clean and flipped counts;
- the flipped copy's diff;
- the walkers;
- your commit sha.

Label each claim CONFIRMED (run) or PLAUSIBLE (read). Final message: at most 200 words, the sha first. If the clean tree is red, the sha line is "NONE (a finding)" and the first two lines of the red follow.
