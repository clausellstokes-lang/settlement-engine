# PAGE-2's builders: the rules every brief carries (written 2026-11-20 11:26 UTC)

You are a builder seated by PAGE-2 (the content half of the page's four faults; the owner's words of 2026-11-20 bind:
"A calm town should be as it currently is… Don't invent drama… We are not creating the campaign."). PAGE-2 integrates;
you build ONE unit, exactly as its brief says. Read `CLAUDE.md` and `CONTRIBUTING.md` first.

1. **Your tree.** You work in your own git worktree. Before any test: `ln -s /home/user/settlement-engine/node_modules node_modules`
   if it is missing. Never run a test with any of GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR,
   GIT_OBJECT_DIRECTORY or GIT_PREFIX in the environment.
2. **Your files.** Only the files your brief OWNS. Never edit: `supabase/`, `src/domain/veil/`, `tests/security/`,
   `src/domain/display/`, `src/components/`, `publicSafe.js`, `src/domain/summary/`, `src/domain/crisis/`,
   `src/domain/tension/`, `src/domain/traditions/`, `src/domain/seat/`, `src/domain/rulingPower*.js`,
   `src/generators/people/goals.js`, `src/data/people/goalFamilies.js`, `src/generators/economy/prosperity.js`,
   `src/generators/factionDynamics.js`, `src/generators/power/factionStanding.js`, `src/domain/facts/drawDeclared.js`,
   `src/domain/facts/factVocabulary.js` (read only: a line that needs an atom that does not exist is rewritten to need none),
   the generated state-prose pools and their kernel. A file you need that is not yours: STOP and report.
3. **No new draw.** Every choice is draw-free (`src/kernel/proseHash.js :: pickVariant` keyed on the town's own seed, or the
   draw-free next-admitted resolution of `src/generators/people/poolMap.js :: settleTitleLines`). No `_rng()`/`rng()` call is
   added, removed or moved. No other stored field may move.
4. **Red first.** Write the test, run it, SEE it red on the unchanged code (keep the output), then build, then green. A test
   that anchors a pool's sentence COMPUTES it (`tests/helpers/drawnProse.js` or the pool's own export), never quotes it.
   A new test file's basename avoids the mutation manifest's words (census, scan, baseline, ratchet, walker, killlist,
   parity, coverage, governance, freshness, integrity, exhaustiveness, roundtrip, golden, contract, pin) unless it IS a guard
   that owes a registry row (then say so).
5. **Gates, each to a file, read by its count lines, never through a pipe** (`sh scripts/gate-tail.sh <command>` prints the
   tail and exits with the gate's code): your tests; EVERY test file that imports a module you changed
   (`grep -rl <module basename> tests`); `npx vitest run tests/lint` WHOLE; `npm run typecheck:ratchet`;
   `npm run typecheck:domain:strict`; `npm run lint`. Never the whole suite. A red that is not yours: report it with its
   name, do not repair it.
6. **Commit** on your worktree's branch by EXPLICIT paths (never `git add -A`/`.`), one commit for the unit, its message
   carrying the receipts (red seen, green, gate counts) and ending with the attribution lines your harness gives.
   NEVER push, never `--no-verify`, never amend another's commit, never a pull request.
7. **Hand back** in your final message: branch and commit; files changed; the red you saw (quoted count line) and the
   green; each gate's count line; every judgment you made that the brief did not settle; anything you noticed that is not
   yours. At most 400 words.
