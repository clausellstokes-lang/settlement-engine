# SAME-1 · BRIEF 2 — THE SAMENESS DOOR

Written by SAME-1 for its builder. This file, brief 1 (`SAME-1-CENSUS-BRIEF.md` beside it) and the files they name are your whole assignment.

## WHAT THE DOOR IS FOR
The chair found two shared sentences by chance: the recent conflict sentence, the same in about half of all places of every size, and the economy sentence, which the page turned out not to print at all. THE DOOR MAKES THAT CHANCE IMPOSSIBLE: EVERY SENTENCE THE PAGE PRINTS IS MEASURED, BY A DOOR, FOR GOOD. It has TWO LAWS. **A PRINTED SLOT WITH NO ROW REDS** (no field is ever unread again). **A CEILING ONLY TIGHTENS** (`--tighten` is the chair's door; nothing raises a ceiling).

## WHERE YOU WORK
Branch `lane/same-1-door-2026-11-20`, a worktree at `/home/user/same-door`, cut from `lane/same-1-2026-11-20` at the commit SAME-1 names in your prompt. Symlink `node_modules` to `/home/user/settlement-engine/node_modules` and keep the symlink out of git. Commit by explicit paths, author `Claude <noreply@anthropic.com>`. Never push and never `--no-verify`.

## BUILT ON
`scripts/sameness-census.mjs`, `scripts/census/sameness-census.render.census.jsx` and `scripts/census/sameness-census.classes.json` (brief 1's builder). Read the first two WHOLE before you change them: you own them now. For the door's shape and its noise rule, read `scripts/census/pool-dominance.mjs`'s header and its `judge`, `confirmRises`, `bankNew` and `shareError`, and `tests/lint/poolDominance.walker.test.js`. That is precedent; import nothing from them.

## FILES (new only, plus brief 1's three files; nothing under `src/` changes)
1. `scripts/sameness-census.mjs` gains `--check`, `--write` and `--tighten`, plus the pure functions they share, exported: `judge(table, register, opts)`, `writeRows`, `tighten`, `readRegister`. `--measure` and `--from` stay as they are.
2. `scripts/census/sameness-census.register.json` — THE REGISTER. It sits beside the repository's other registers (`page-census.register.json` and `pool-dominance.register.json`). It holds `_law`, `corpus` (the plan's identity: prefix, n, sizes) and `rows`. Each row is keyed `<slot>` and has one entry per size: `{ places, distinct, top, seen, meet, ceiling }`. The row also has `class` (CATALOGUE | LABEL | STATE | NARRATIVE, from the classes file; a `?` stays visible) and `reason`. `meet` is the share a DM meets again: TOP share for a slot printing at most 1.5 sentences a place, SEEN otherwise; the ceiling bounds `meet`. You may also add a `paths` map, which records the slot's stored-path attribution.
3. `tests/lint/samenessCensus.walker.test.js` — WRITE IT BUT DO NOT COMMIT IT until SAME-1 tells you the chair has ruled (it would enter `npm run check`, and its manifest row edits an existing file). It holds no render. It contains the judge's planted reds: a printed slot with no row; a rise beyond the noise on both readings; a rise on one reading only (a note); a write that would raise a ceiling (refused); a tighten that lowers a ceiling but never raises one. It also checks the register's shape.

## THE SLOT'S IDENTITY (the first thing you measure; it can refute this brief)
Brief 1 keyed a stored sentence by the SHORTEST stored path that held it word for word. The same printed line therefore flips between two slots from place to place. The recent conflict sentence files under `pressureSentence` where the two fields agree and under `powerStructure.recentConflict` where they do not, and the publicProse mirrors do the same. A flipping key makes law 1 red by chance.

Make the identity a property of WHERE THE PAGE PRINTS the sentence: the surface plus a stable printed position. The position is the heading path when it is stable; otherwise the canonical stored path, chosen by an alias rule written into the register, so a path that is new to the register is a new slot and reds, as law 1 intends. Composed sentences under no stable heading (153 slots in brief 1) need a key of their own. Use the composing module plus the nearest stable heading, or something better that you measure.

PROVE IT: on hxd vs hxu at one tree, count the slots seen in one corpus and not the other with two or more holders, and say which of them come from identity rather than true rarity. The target is zero from identity. Report the number before and after your key.

## THE RULE (`--check`)
Render hxd, 50 a size, the six sizes, with brief 1's plan and mask. Count. Then judge each row against the register:
- **RED, unregistered:** a slot printed in ≥ `MIN_PLACES` places of one size with no row for that size. Choose `MIN_PLACES` by measurement: the smallest value at which hxd and hxu agree on the slot set by the proof above. State it in the header with its measurement. A slot below it is a NOTE.
- **RED, rise:** a row's `meet` above its ceiling by more than `NOISE_SE` standard errors of a share AT the ceiling over its holders (binomial; for SEEN, take the error over places), confirmed by re-rendering under `hxu` at the same tree. It reds only if it is over on BOTH. One reading alone is a NOTE printed with both readings. hxu is rendered only when a row needs confirming.
- **NOTE, stale:** a row whose slot is no longer printed. It stays visible and is never silently dropped. `--write` retires it by name into `retired`, with its last reading.
- **NOTE, loose:** a ceiling above `meet` by more than the noise on both readings, for `--tighten`.

## THE DOORS THAT WRITE
- `--write` adds a row for every unregistered slot at the HIGHER of hxd and hxu, rounded up to 0.01, classed from the classes file. It retires stale rows. It NEVER raises an existing ceiling: if a run would raise one, nothing is written and the command exits 1.
- `--tighten` (the chair's) lowers each loose ceiling to the higher of the two readings and NEVER raises one.
- Both print what they changed, one line per row.

## RUN TIME AND FLAKINESS
Report the wall time of `--check` with no confirmation and with one. Prove the check is not flaky: run `--check` twice at one tree and get identical results (the render is deterministic per seed). Run it once at a tree where a planted generator change re-deals the draws but changes no sentence's pool, for example a different `n`; or show, with the noise rule, that a fresh sample puts no row over on both readings. Rendering must not depend on the clock or the machine.

## DELIVERABLES
The files above, the register written by `--write` at your tip (both corpora rendered), and `docs/chair/2026-11-20/content/same/door/REPORT.txt` (at most 300 words). The report covers the identity proof's numbers, `MIN_PLACES`, `NOISE_SE` and why, the run times, the flake proof, and how many rows each class holds and how many still carry `?`.

## RULES
Never the whole suite. Never the repository's lighting or wiring census. Never a pipe for a gate's exit: use `sh scripts/gate-tail.sh <command>`. Every run goes to a file and is read by its count lines. No test run with GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY or GIT_PREFIX in the environment. Run bare `npx eslint` on every changed file and `npx vitest run tests/lint/samenessCensus.walker.test.js` before each commit. A sentence you think wrong is a line in your report, never an edit. Your final message is at most 200 words: the commits, the identity numbers, the run times, the flake proof's result, and anything that surprised you.
