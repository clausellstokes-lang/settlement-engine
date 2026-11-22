# SAME-1 · BRIEF 3 — THE HIDEABLE-HOUSE WALKER OF THE SAMENESS POOLS

Written by SAME-1 for its builder. This file and the files it names are your whole assignment. The rule is the chair's, re-stated at 17:13 UTC 2026-11-20. It replaces any earlier wording.

## THE RULE
1. **RED:** a wording of a pool NEEDS a house of a hideable kind. The test is `src/domain/people/cardVeil.js :: isHideableHouse` (criminal or clandestine), or the wording needs any fact about crime or a clandestine thing. A shared read (a gallery, a player view) may withhold such a house, so a wording that needs it either leaks it or falls silent.
2. **LISTED, NOT RED:** every OTHER house a wording needs (guild, church, court, market, watch, walls, a named house of the place's own). Write them pool by pool into ONE committed file, `tests/lint/samenessHideable.houseReadings.json` (the house-reading wordings). At the join, the security reader tests that list against the veil's own registry, which lives on the veil's lane. You MAKE NO NEW LIST of what may be withheld, and you read nothing under `src/domain/veil/`.
3. **EXEMPT BY DECLARATION ONLY,** in the walker's own declared list, each entry with its reason. There are two classes: a field withheld from every shared read, and the trouble half's ruled design (its hooks are dropped on a public page; its cause sentence is held equal on a served and a possible-world document). Nothing else is exempt.

## WHERE YOU WORK
Branch `lane/same-1-hideable-2026-11-20` in a worktree at `/home/user/same-hide`, cut from `origin/lane/same-1-2026-11-20` (run `git fetch origin lane/same-1-2026-11-20` first). Symlink `node_modules` from `/home/user/settlement-engine/node_modules` and keep it out of git. Commit by explicit paths, author `Claude <noreply@anthropic.com>`. Never push and never `--no-verify`. Another builder is rendering on this machine: run nothing heavier than a single vitest file.

## READ, AND NO WIDER
- `tests/lint/factLayers.shared.mjs`: `corpusPools`, and how it reads a pool's lines and their declared facts. This is your backbone; import it, do not copy it.
- `tests/lint/factLayers.poolTable.json`.
- `src/domain/facts/factVocabulary.js`: how a fact names a house or its kind.
- `src/domain/people/cardVeil.js`: `isHideableHouse` and what it reads.
- `tests/lint/poolDominance.walker.test.js`'s head, for the walker's shape.
- `tests/lint/mutationCoverage.shared.mjs`, and one row of `scripts/mutation-coverage-manifest.json` for a `tests/lint/*.walker.test.js`.

## MEASURE FIRST (it can refute this brief; report it before you write the walker)
1. HOW A WORDING NEEDS A HOUSE. Find the shape: a `needs` or `requires` key, a declared fact, a name test. Show three real examples by `path :: symbol`. If wordings do not declare their needs anywhere `corpusPools` can read, STOP and report: the walker cannot be built on that backbone.
2. REACH. List the lane branches of the seats curing sameness with `git ls-remote origin 'refs/heads/lane/*2026-11-20*'`; the seats are DEPTH-2, PAGE-6, PAGE-7, GOALS-3, PLACE-1 and PEOPLE-1. For each branch, fetch it, and in a THROWAWAY worktree at its tip (removed afterwards) list the pools it adds or changes against `origin/lane/join-2026-11-14`, and whether `corpusPools` at that tip reaches each one. NAME every pool it does not reach, with its seat and file.
3. TODAY'S COUNT on this line: how many wordings would red under rule 1, and how many house readings rule 2 lists. If any wording reds today, do NOT commit a red walker. Report the list (pool, wording key, the house kind) and stop: SAME-1 takes it to the chair.

## FILES (new only, plus ONE appended manifest row)
1. `tests/lint/samenessHideable.walker.test.js`. It renders nothing and runs in seconds. Its arms:
   - rule 1 over every pool `corpusPools` returns;
   - rule 2's list must equal the committed json exactly: a new house reading reds until it is listed, and a listed one that has gone reds until it is removed;
   - the exemption list, by declaration, each entry naming a real pool;
   - a planted red: a fixture pool whose wording needs a criminal house reds, and the same pool exempted by declaration passes.
2. `tests/lint/samenessHideable.houseReadings.json`.
3. ONE row APPENDED to `scripts/mutation-coverage-manifest.json`, touching nothing else in that file. Prove it with `npx vitest run tests/lint/mutationCoverageManifest.test.js`, and put the row in your report verbatim: SAME-1 sends it to the chair.

## RULES
- Never the whole suite, and never the repository's lighting or wiring census.
- Read a gate's exit with `sh scripts/gate-tail.sh <command>`, never through a pipe. Every run goes to a file, read by its count lines.
- No test run with GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY or GIT_PREFIX in the environment.
- Before each commit, bare `npx eslint` on your files and `npx vitest run` on your walker and on `tests/lint/factLayers.walker.test.js` (you import its helpers).
- A wording you think wrong is a line in your report, never an edit. No file under `src/` changes.

Your final message is at most 200 words: the commit, the reach table (the pools named, not reached), today's counts, and the manifest row verbatim.
