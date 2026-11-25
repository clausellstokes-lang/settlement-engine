# STANDWALK: the standing table's totality walker and the stored-tail census (VEIL-51, unit 4 item 3; RULING V15; V14 (1), (2))

Written by VEIL-51 on 2026-11-25 under VEIL-55's yes of 01:24 UTC ("YES to item 3 now, TEST-ONLY"). You are ONE builder. TEST-ONLY:
you write new files under `tests/` only (plus, if a walker demands it, its one registration row). You never touch `src/`, `supabase/`,
`scripts/` (read them; never edit), a baseline, an allowlist or another walker. You commit locally; you do NOT push, open no pull
request, never use `--no-verify`.

## YOUR TREE
`/home/user/wt/walker` on branch `lane/veil-51-2026-11-24-walker-wip`, which VEIL-51 points at aa54a6791 (R5D's code: the table
`scripts/veil/standingForms.data.json`, its door `scripts/veil/standingForms.mjs`, the cut in 212 and the twin) before you start; read
`git log -1` and STOP if HEAD is not aa54a6791. `node_modules` is linked. Never run a command with GIT_DIR, GIT_WORK_TREE or
GIT_INDEX_FILE in its environment. Every vitest run through the gate mutex from the tree:
`env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE GATE_MUTEX_MAX_POLLS=1000000 sh scripts/gate-mutex.sh --run -- npx vitest run <file> > <log> 2>&1; echo rc=$? >> <log>`
(other runs of this seat hold the lock for long stretches: wait; never route round it; never kill another process). Logs under
`/var/tmp/v51/out/standwalk/`. Never read a result through a pipe.

## WHAT EXISTS (read first, whole): `scripts/veil/standingForms.mjs`
It derives the forms `annotateFactionStanding` appends STATICALLY from a source text (`--derive`), checks that every form the tip's
`src/generators/power/factionStanding.js` derives is a row (`--check`, exported `check`-equivalents: read what it exports), cuts a desc
(`cutDesc`, `compileRows`, `readTable`), and `--write` re-derives the tip, master and master's history (rows only grow). Nothing in
`tests/` runs it today.

## WHAT YOU BUILD: `tests/lint/standingFormsTotality.walker.test.js` (new; one file; three `it`s)
1. TOTALITY BY CONSTRUCTION (V14 (2)): every form the tip's writer source derives (the module's own derivation over
   `src/generators/power/factionStanding.js`, and the local helpers it inlines) is a row of the table; and every row matches its own
   template's sample expansion. Import the module's functions; do not re-implement the derivation. THE RED FIRST: the same check run on
   a PLANTED SOURCE TEXT (the tip's writer text with one extra standing sentence added to one branch, built in the test as a string,
   never written to `src/`) must find exactly that form missing: assert the planted check reds with that form named, and the tip's
   check is green.
2. MASTER'S FORMS PINNED (V14 (2)): the forms `git show db832c892:<the writer's path at master>` derives (find the path at that commit:
   `factionStanding.js`, or the older `powerGenerator.js` the module's header names) are all rows of the table. The test may not call
   git at run time: commit a RECORDED EXTRACTION as a fixture (`tests/fixtures/standingForms.master-db832c892.json`: the derived
   templates, the commit, the path, and the command that made it), and assert (a) every recorded template is a row, (b) the fixture
   names db832c892. Say in the hand-back how you made the fixture.
3. THE CENSUS OF STORED TAILS (V14 (1), (2)), as a measure under `STANDWALK_POOLS=<dirA>:<dirB>` (skipped without it, so the gate's
   default run stays light; say so in the test's title): for every stored power desc in both stored pools
   (`/var/tmp/v51/out/p1/stored-today` from the tip's engine, `/var/tmp/v51/out/p1/stored-master` from db832c892; `r3m-*.json` only),
   the table's cut (`cutDesc`) gives base + standing; the GROUND TRUTH is the birth's own writer run over the stored roster with the
   stored bases (for today-born the tree's `annotateFactionStanding` as R5D's `pageRederive.js :: rederiveStanding` calls it; for
   master-born, the master writer is out of reach at run time: count master's descs whose cut is null, and descs whose base still
   ends in a sentence that matches a recorded master template). Classes per pool: CUT EXACTLY (the cut's standing equals the writer's
   tail, or for master a recorded template), NO TAIL (the writer writes none and the cut finds none), UNCUT (a tail the cut misses),
   AMBIGUOUS (two rows match at the same start), WRONG (the cut removes text the writer did not write). Write the counts with
   `appendFileSync` to `STANDWALK_MEASURES` and assert UNCUT, AMBIGUOUS and WRONG are 0, listing every case if not (do not tune).

## RED FIRST, AND WHAT YOU HAND BACK
- Run the file once without the pools (the gate's run): green for 1 and 2, the census skipped. The planted red in 1 must fire.
- Run once WITH the pools (`STANDWALK_POOLS=/var/tmp/v51/out/p1/stored-today:/var/tmp/v51/out/p1/stored-master`): record the counts;
  if UNCUT, AMBIGUOUS or WRONG is not 0, KEEP THE RED (it is the finding) and list the cases in the hand-back.
- `npx eslint <your files>` 0 errors; the walkers that judge a new test file (`proseDrawnAnchors`, `negativeAssertionAnchor`,
  `moduleScopeCwdRatchet`, `mutationCoverageManifest`) each once, no worse than at aa54a6791 by title (run each there first if you
  must compare). No `process.cwd()` at module scope.
- Commit ONCE (plain `git commit`, the hooks run), trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- HAND BACK in at most 250 words: the commit; the three arms' results; the census counts per pool and class; the fixture's making;
  eslint and the walkers; anything you could not follow.
