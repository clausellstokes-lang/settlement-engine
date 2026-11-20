# Brief: BUILD-HOOKS (DEPTH-1's builder; written 2026-11-20 14:55 UTC, on the chair's word of 14:50 UTC)

ONE UNIT: append the 60 approved person hooks to their pools and tag each with its theme. You work in your own worktree on
the branch `lane/depth-1-2026-11-20-hooks` (cut from `lane/depth-1-2026-11-20`); you COMMIT there by explicit paths with the
receipts in the message (author as configured; never `--no-verify`); you never push, never take a census, never run the whole
suite. Read `CLAUDE.md` first ("Gate reading": never read a gate through a pipe; use `sh scripts/gate-tail.sh <command...>`).

## The lines (the ONLY text you add)
`docs/chair/2026-11-20/content/depth/lines/HOOKS-1.md` (`other` 30, `government` 8) and `HOOKS-2.md` (`economy` 14,
`criminal` 8): each `N. NEW [theme] "line"`, in the order written. The file's foot records the integrator's edits (already
applied in the NEW lines) and THE CHAIR'S WORD: `other` 30 is "They were asked to put in a good word for someone, said yes, and
have not yet put the word in." tagged `hidden_debt` (the theme table above it is stale on that one line). Copy every line
BYTE-EXACT from the NEW lines; change no word.

## The files you own (no other file)
1. `src/data/npcData.js :: NPC_FACTION_LOYALTY`: each group's new lines APPENDED after its last existing row, as plain strings,
   in file order, with a one-line comment above each group's block (`// DEPTH-1 (the chair's word of 2026-11-20 14:50 UTC):
   appended so every stored index and saved town is unchanged`). No existing row is moved, edited or removed.
2. `src/domain/hookThemes.js :: AUTHORED_HOOK_THEMES`: one `[template, theme]` entry per new line, the theme as bracketed
   (`other` 30: `hidden_debt`), placed beside its group's existing entries.
3. ONE new test, `tests/generators/depthHooksAppended.test.js` (the name avoids the mutation manifest's pattern words), that
   COMPUTES, never quotes a hook sentence (`tests/helpers/drawnProse.js` states the law): (a) each of the four pools is longer
   than before by exactly its count (30, 8, 14, 8), measured against the pool's length at `lane/depth-1-2026-11-20`'s base
   written as numbers (40, 24, 24, 18); (b) THE APPENDED RULE: every row a pool held before keeps its index (a fingerprint of the
   first n rows' texts, computed at test time from `git show`-free means: assert the first n rows equal the rows that are not
   new, i.e. `pool.slice(0, n)` contains no row of the tail, and the tail's rows all carry a theme other than `untyped`);
   (c) THE DRAW TAKES THEM: birth the city towns `hxd-city-0` .. `hxd-city-4` the way `docs/chair/2026-11-20/content/depth/
   measure/born.mjs` does and assert at least one card's hook is a row of some pool's TAIL (computed from the pools, not quoted).

## Red first (record each in the commit message, with the failing title)
- Step 1: append the rows to `npcData.js` ONLY; run `tests/lint/hookThemeTotality.walker.test.js`: it must RED (new templates
  untagged). Step 2: tag them in `hookThemes.js`: it must GREEN. Step 3: your new test, red against the pools as they were
  (`git stash` is forbidden: prove red by running it with the appends commented out in a scratch copy, or by reasoning recorded
  as PLAUSIBLE), then green.

## Green at your commit (each to a file; read its count line)
Your new test; `tests/lint/hookThemeTotality.walker.test.js`; `tests/lint/poolDominance.walker.test.js`; every test file that
names `NPC_FACTION_LOYALTY`, `hookThemes` or `themeOfText` (find them by grep under `tests/`); `npx eslint` on the three files.
A red you did not cause is reported with its title and left alone; a pin that legitimately moves because a pool grew (a count,
a share, a drawn line) is NAMED in your answer with file and title and NOT re-recorded by you: DEPTH-1 rules on it.

## Answer (at most 200 words)
The commit sha; the three red-first receipts; every test run with its count line; every moved pin by file and title.
