# FRAME-2 · brief B6 — the re-seat of the pinned calm sheet (`repeatOnceTonightTraditions`, soak1k-11)

Written by FRAME-2 (the integrating seat) on `lane/frame-2-2026-11-20`. You are a builder of FRAME-2: one unit, one commit. Read whole before you edit: `CLAUDE.md`; `tests/components/repeatOnceTonightTraditions.test.jsx` (its comments carry the seed's history: keep that idiom); `src/domain/summary/tonightSheet.js`; `src/domain/tension/troubleCast.js` and, if it exists, `src/domain/tension/troubleWeight.js`.

## The ruling (the chair's)

"The pinned calm sheet of `repeatOnceTonightTraditions` (soak1k-11) is re-seated BY IDENTITY to a town with NO trouble of weight that still shows two own wants."

The test pins a calm town's Tonight sheet printing a shared want once (one goal planted on two people). The frame (FRAME-1's build) voiced only one of the two there; since then the frame was narrowed to towns with a trouble of weight (CF11), and the sheet was given an explicit audience (`composeTonightSheet(settlement, { audience })`).

## What to do

1. MEASURE FIRST, at the current tip: run the test file and record its result. If soak1k-11 is green as it stands (it may no longer carry a trouble of weight), the re-seat is not needed: record the receipts (whether soak1k-11 carries a trouble of weight, and the sheet's people) in your commit body, add ONE assertion to the soak1k-11 test that the town casts no frame (so the pin is held BY IDENTITY: if a later change frames it, the test says why it red), and stop there.
2. If it is red: find, by measuring over `soak1k-0..999` (the same birth the test uses), the towns with NO trouble of weight on which the test's procedure (one goal planted on two people) prints the shared want once and the second person names the first; choose the first such seed; re-seat the test to it, adding the history comment in the file's idiom (old seed → new seed, at which commit, why: the chair's ruling, CF11) and the same no-frame assertion. Never weaken an assertion.
3. Do not touch any other test or source file.

## Gates and commit

The test file itself and every test under `tests/components/` that imports `TableView.jsx` or `TonightSheet.jsx` (grep; list with counts); `npm run lint`. Every run to a file under `/tmp/claude-0/-home-user-settlement-engine/a24e1eb5-d90d-5963-a121-dbebc78118f8/scratchpad/`; never through a pipe (`sh scripts/gate-tail.sh <command>`). One commit by explicit path, hooks on, no push, no reset/stash/checkout. Message `test(FRAME-2 · B6): the pinned calm sheet held by identity to a town with no trouble of weight`, with receipts, ending with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_019yED1SkacgZyeUgMMGhdL4`. No GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY or GIT_PREFIX in any command's environment.

Final message: at most 150 words: the sha, red or green at the start, the seed now pinned and why.
