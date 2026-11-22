# SAME-2 · BRIEF H — THE HIDEABLE WALKER, PHASE 3 (the chair's order of 17:46 and its words of 17:45 and 18:38)

Written by SAME-2 for its builder, 2026-11-20. This file, `SAME-1-HIDEABLE-BRIEF.md` beside it, `hideable/MEASURE.txt`
and the walker's own header are your whole assignment.

## WHERE YOU WORK
A worktree at `/home/user/same2-hide` on a new branch `lane/same-2-hideable-2026-11-20`, cut from
`origin/lane/same-2-2026-11-20` (SAME-2's tip: the walker is merged there, d7fb46735). Symlink `node_modules` to
`/home/user/settlement-engine/node_modules`; keep it out of git. Commit by explicit paths, author
`Claude <noreply@anthropic.com>`. NEVER push, never `--no-verify`. The walker's base is 43ab0f5eb (the join line).
You OWN `tests/lint/samenessHideable.walker.test.js` and its three JSON files, and new files under
`docs/chair/2026-11-20/content/same/hideable/`. Read the walker WHOLE first. Nothing under `src/` changes;
`tests/lint/factLayers.shared.mjs` and `scripts/mutation-coverage-manifest.json` are not edited (if you find one must
be, STOP and say why).

## THE MEASURE FIRST (it can refute this brief)
For every hand-listed pool (`samenessHideable.handPools.json`, 42 rows): how many lines, of which shape (declared rows
with `needs`/marks; bare strings), and how many lines the phase-3 reading below would red today on the base. Write it
to `hideable/PHASE3-MEASURE.txt`. If more than about 40 lines would red, or a pool's lines cannot be read without a
render, STOP and return the measure (≤ 150 words).

## THE UNITS (each its own commit, each red first: plant, see the named test fail, restore, see it pass)
1. THE GAP. Rules 1 and 2 read the dossier corpus's pools only; a hand-listed pool's LINES are not read (a new crime
   line in `NPC_FACTION_LOYALTY`'s criminal key, or in the arrival pools, would not red). Close it: for every
   hand-listed pool, read its lines: a declared row by its `needs` (rule 1 by atom; rule 2 lists its other houses); a
   bare string by the crime-word list (`CRIME_KEY_WORDS`, the same list that guards the crime pools' keys); a pool
   keyed by a crime word is a CRIME POOL (every line reds unless dm-only or withheld). Lines red today are BANKED in
   `existingReds.json` with their text hash (shrink-only; raise `EXISTING_CEILING` ONCE, by exactly the banked count,
   in this commit, and say the figure). Planted reds: a new crime line in a hand-listed criminal key; a new bare
   string with a crime word in a non-crime hand pool.
2. THE EXEMPTION'S PROOF. An exemption stands only WITH THE LINE OF CODE that withholds its block from every shared
   read. DS-HK-1 "clock smuggling_rise" was exempted as the trouble half's hooks: find that line (cite `path ::
   symbol` and, where one exists, the test that proves it), and require each `EXEMPT` entry to carry it (a field
   `withheldBy`, checked to exist in the file named). If you cannot prove DS-HK-1's, BANK it like DS-GEN-1 crime_wave.
   Apply the same check to every other EXEMPT entry.
3. THE HEADER. Write in the walker's header, in these words: "an indirectly drawn pool escapes the totality arm; the
   hand list is its remedy". The declared crime-pool list with its key check stands as it is.
4. DAILY LIFE (DAILY-1, `lane/daily-1-2026-11-20`, NOT on this base: read it with `git show`, never merge it). Its
   ninth slot `commoner_resentments_dm` is derived ONLY when the caller says the audience is the owner: the chair
   rules it dm-only BY CONSTRUCTION, not by an exemption row. MEASURE how the slot is gated (cite `path :: symbol`)
   and write in `hideable/PHASE3-REPORT.md` the arm the walker needs at the join to recognise it by construction
   (what it reads, what reds). Build that arm now only if it can be planted against a fixture without DAILY's code;
   otherwise it is a named owed item.
5. THE NEW POOLS RULED SINCE 17:48 (on other lanes' branches): the powers' second tranche (the people lane,
   `powerLineVariants.js`), the founding (108 + 36 lines), the hooks' tranche 3 (60, the depth lane), the safety
   line's 19 more rows (the place lane). Find each branch and commit (`git ls-remote origin 'refs/heads/lane/*'`;
   people-2, depth-2/3, place-1). Run your phase-3 reading over each pool at that commit (read-only: `git show` or a
   detached scratch worktree, removed after) and write per pool: lines, reds by rule 1, houses listed by rule 2. No
   hand-list row is added for a pool not on this base; the report is what the seats and the join read.

RECEIPTS (to files; count lines only; `sh scripts/gate-tail.sh <cmd>` for every gate): `npx vitest run
tests/lint/samenessHideable.walker.test.js tests/lint/mutationCoverageManifest.test.js
tests/lint/factLayers.walker.test.js` red (planted) then green per unit; bare `npx eslint` on the walker.

RETURN (≤ 200 words; details in `hideable/PHASE3-REPORT.md`): the commits; the measure; the banked count and the new
ceiling; DS-HK-1 proved or banked (with the line); DAILY's gate; per new pool its reds. Never the whole suite. No test
run with GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY or GIT_PREFIX in the environment.
A line you think wrong is a line in your report, never an edit.
