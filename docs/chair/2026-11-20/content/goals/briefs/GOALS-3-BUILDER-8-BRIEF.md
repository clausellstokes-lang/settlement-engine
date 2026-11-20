# GOALS-3 · builder 8 · tests/lint WHOLE green at the lane's tip (13 reds the lane made)

Written 2026-11-20 14:49 UTC by GOALS-3. You build; the lane's integrator reads your diff line by line once, at the merge, and re-runs red and green.

## Where you work
`git worktree add /home/user/wt-b8 -b lane/goals-3-2026-11-20-b8 bb901ed13`; `ln -s /home/user/settlement-engine/node_modules /home/user/wt-b8/node_modules`; in the worktree first `git fetch --no-tags --depth=1 origin +refs/heads/review-fixes-2026-07-08:refs/heads/review-fixes-2026-07-08` (two lint files read it). Commits by explicit paths, one per cause, the receipts in each message; COMMIT AS YOU GO (the account's usage warning: a unit half-done must survive you); never push; never a pull request; never `--no-verify`.

## The reds
`tests/lint` WHOLE at 293edcb9e: 13 failed / 3,258 passed (3,271), 8 files; the working line at 43ab0f5eb read 3,271 / 3,271 green, so every red is the goals lane's (its commits since 835fabd2d: units 1, 3, 4, 5, 6 and the cure, 7). The titles and first assertion lines: `goals/measures/lint-whole.293edcb9e.reds.txt`. Files: `mutationCoverageManifest` 1, `negativeAssertionAnchor.walker` 2, `observedShapeReaders.walker` 2, `poolDominance.walker` 1, `presumedThings.walker` 3, `presumptionClasses.walker` 1, `sovereigntyLightingContract.walker` 1 (the lighting census), `writerReach.walker` 2.

## The rule for each red (read the walker's own header WHOLE before touching anything; cite by symbol)
1. First ATTRIBUTE it: which lane commit makes it (`git log 835fabd2d..bb901ed13 --first-parent` and the units' branches), by name. Write the attribution as a table in your report.
2. Then cure it the way the walker's header prescribes, NEVER by weakening the walker, raising a ceiling the header forbids raising, or a row the header forbids ("declare the thing on the line … never add a row"; "draw a declared pool through drawDeclared / filterDeclared; never unwrap it first"). A register the walker says is re-taken by its own door (`node scripts/check-observed-shape-readers.mjs --write`; the lighting census by `LIGHTING_CENSUS_REFREEZE=<lane id> LIGHTING_CENSUS_NOTE=<cause>` then an ordinary green run; the mutation manifest by its own script; the writer-reach digest by its own door) is re-taken by that door on a CLEAN tree, with the cause named.
3. A cure that would change any generated town's text or any draw: STOP and report it instead (the lane's measure `goals-final.mjs` must read identical 0, mirror 83, template>2 14 at your tip, as at 293edcb9e; run it at the end).
4. Read only: `src/domain/facts/drawDeclared.js`, `factVocabulary.js`, `supabase/`, `src/domain/veil/`, `tests/security/`. If a cure needs one of them, stop and report.

## Green
`tests/lint` WHOLE 3,271+ / 0 failed (to a file, read by its count lines: `sh scripts/gate-tail.sh npx vitest run tests/lint`; never through a pipe); `tests/generators/people`, `tests/data/goalFamilies.test.js`, `tests/data/goalSecretRefusals.test.js`, `tests/generators/bar8People.test.js` (the one known red `generationForkCensus` A1, 7c466b88, is not yours); `npm run typecheck:ratchet`, `npm run typecheck:domain:strict`, `npm run lint`; the measure. No run with any GIT_DIR / GIT_WORK_TREE / GIT_INDEX_FILE / GIT_COMMON_DIR / GIT_OBJECT_DIRECTORY / GIT_PREFIX in the environment.

## Your files
The lane's own: `src/generators/people/goals.js`, `src/data/people/goalFamilies.js`, `src/data/people/goalSecretRefusals.js`, `src/data/npcData.js` (the tie reserve only), the lane's test files; and the registers the failing walkers name. Anything else: report first. Report in at most 300 words: commits, the attribution table, each cure in one line, red and green counts with log paths, the measure line, anything undone.
