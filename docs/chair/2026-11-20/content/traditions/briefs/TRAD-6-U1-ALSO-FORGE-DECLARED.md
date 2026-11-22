# TRAD-6 unit 1 cure — the forge's "also" gloss declares in a form the presumption walker reads

Written 2026-11-22 by TRAD-6 (the traditions lane's integrator) under `docs/chair/2026-11-21/eighth/prompts/TRAD-6.txt`, unit 1.
Base: `lane/trad-6-2026-11-22` (code = `cd6989657`). Your branch: `lane/trad-6-2026-11-22-u1-wip`. Commit there by explicit paths;
NEVER push; never `--no-verify`; never touch any other file.

## THE RED (measured by TRAD-6 at `cd6989657`)
`tests/lint/presumptionClasses.walker.test.js` › "no NEW undeclared line: every hit is banked (declare the line; the door never banks
a new one)" fails with ONE fresh hit: `src/data/traditionDescriptionTable.js · goods:none · also honours the forge`.
WHY: the line DOES declare `institution: smith` (and `institution` answers the goods class), but it writes
`needs: Object.freeze(['institution: smith'])`, and the walker's scanner (`tests/lint/presumptionClasses.shared.mjs :: scanSource`)
reads a declaration only as a literal `needs: [ ... ]`. The plain forge glosses ("honours the forge") are three words and so are
never scanned; the "also" line is four, so it is the first of the table's lines the walker reads. The other fifteen "also" lines hold
no class word or are `plain(...)`.

## THE CURE (no wording moves; the walker and its register are NOT touched: BG1, not this lane's)
In `src/data/traditionDescriptionTable.js` ONLY:
1. Make `line` (`const line = (line) => Object.freeze(line);`) freeze each array-valued field of the row as well as the row (so a row
   written with a plain array literal stays deep-frozen exactly as the `Object.freeze([...])` rows are). Keep it small and typed as
   the file's JSDoc expects; no packed statements.
2. Write the forge "also" row of `ELEMENT_GLOSS_ALSO` as `line({ text: 'also honours the forge', needs: ['institution: smith'] })`.
   Text unchanged, character for character. Change NO other row (the other rows' form is not in the walker's way).

## RED FIRST, THEN GREEN (through `sh /home/user/settlement-engine/scripts/gate-mutex.sh --run -- …`, each to a file, read by its count lines, never through a pipe)
- At the base: `npx vitest run tests/lint/presumptionClasses.walker.test.js` → exactly the one test above red. After: green.
- After: every test file naming `traditionDescriptionTable` or `traditionDescription` (`grep -rl` under `tests/`), green.
- After: `npx vitest run tests/lint` WHOLE (COMMON-EIGHTH 11) — report its file and test counts and every red by name.
  (`git fetch origin review-fixes-2026-07-08 && git branch -f review-fixes-2026-07-08 FETCH_HEAD` first if the branch is absent.)
- `npx eslint src/data/traditionDescriptionTable.js`; `npm run typecheck:ratchet`; `npm run typecheck:domain:strict`.
- If the lighting census (`tests/lint/.lighting-census-baseline.json`) reds, it is re-taken ONLY by its own door, as its own commit.

## REPORT (at most 200 words)
The commit(s) and sha; the red and green counts; `tests/lint` whole counts; anything that did not go as written.

## YOUR WORKTREE
`/tmp/claude-0/-home-user-settlement-engine/f32b5de0-9c35-5ed3-8594-a8590d8f5904/scratchpad/wt/u1` (cut by TRAD-6 on your branch, `node_modules`
linked). Work and run everything there. The mutex is shared with the integrator's runs: a give-up (exit 3) is retried, never routed round.
