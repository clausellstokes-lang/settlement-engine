READS WHOLE: this brief and `tests/lib/gallery.test.js` and NOTHING ELSE WHOLE (212 and the registry are NOT read; any other file by excerpt only, a symbol at a time). WINDOW 1,000,000; BUDGET ABOUT 150,000: past 120,000 write what you have and stop.

# V39-P2: A SECOND RED AT THE LANE'S TIP, MEASURED (the ninth chair's unit (P2), seated by VEIL-39; MEASURE ONLY, NO CURE)

THE RED (found by VEIL-38): `tests/lib/gallery.test.js`, the test "a share marked with a veil renders through it: the defaults hide, a delta shows", red at af708f2fd (and at the new tip 2d7ed483f, which differs only in another test file) on the assertion near its line 620: `availableServices.criminal` has 0 rows, 1 wanted. Already red at b983c16b6.

ANSWER THREE THINGS:
(i) THE COMMIT THAT TURNED IT RED. Walk the lane's history back from af708f2fd (`git log --first-parent af708f2fd`; the code moved only at merges and a few seat commits: test the commits whose `git diff --stat <c>^1 <c>` touches `src/`, `supabase/` or `tests/lib/gallery.test.js`, newest first, bisecting) to the last commit where the test is GREEN and the first where it is RED. Each run is that ONE test file alone: `env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE npx vitest run tests/lib/gallery.test.js -t "<the title>"` in a detached scratch worktree (`git worktree add --detach /home/user/wt/p2 <commit>`; then `cp -al /home/user/wt/lp/node_modules /home/user/wt/p2/node_modules`, re-linked only where `package-lock.json` differs; `git -C /home/user/wt/p2 checkout --detach <next commit>` to move). Single files only: the box's heavy lane is busy, never run a directory. Logs to `/var/tmp/v18/out/v39/p2/`, read by tail.
(ii) THE CAUSE in one line: which rule, in which file and symbol, now removes that row (read the diff of the first red commit by excerpt).
(iii) WHICH IT IS. A STALE PIN (a ruled unit moved the rule on purpose: name the unit and its ruling) or A FAULT (an owner's delta that no longer shows on the page a player reads: then say what the player sees). REFUTE THIS HYPOTHESIS FIRST (the chair's, PLAUSIBLE only): unit (viii) (crimeTypes withheld always, the page re-deriving; merged as c2625fb1f, into this lane at 929739889) made the crime lists withhold-always, so the payload no longer carries the row and the delta shows only after the page's re-derivation. Also name the R3 units that touch `availableServices.criminal` by positive account (R3-TELL-5 unit (ii); R3-CURE-2/-8's covert and keyless rows) as rival causes, each confirmed or refuted by the bisection.

WHAT YOU MAY WRITE: your report `docs/chair/2026-11-20/veil/out/v39/p2/P2-MEASURE.md` (at most 30 lines; CONFIRMED or PLAUSIBLE on each answer) and its logs, committed by explicit path on your branch `lane/veil-39-2026-11-23-p2-wip` (already cut for you, worktree /home/user/wt/p2wip). No test, no src, no 212, no registry change anywhere. Never push; never `--no-verify`. A refusal by your permission check stands: report it, try nothing else to the same end. Every hour from `date -u`.

YOUR LAST MESSAGE: at most 150 words: (i), (ii), (iii), the commit.

## ADDENDUM: THE RESTATEMENT (the chair's ruling, 2026-11-23 01:21 UTC: A STALE PIN; R3-TELL-5 unit (ii), 369331d72, rulings 73 (2), 74 (ii))
READS WHOLE: `tests/lib/gallery.test.js` only (already read). WRITES: that ONE file, in the worktree /home/user/wt/tip on the branch
`lane/veil-39-2026-11-23-tip` (the lane's tip 2d7ed483f), ONE test-only commit by explicit path. No 212, no registry, no file under src/.
THE TEST MUST SAY BOTH FACES OF THE RULE AND STILL PROVE ITS OWN TITLE: (1) the fixture's 'Black market' is a house the read LISTS
(present in the fixture and shown on that read by the delta): the row is accounted for and STAYS ("a delta shows" still holds);
(2) the same delta with that house NOT listed on the read: `availableServices.criminal` is served as [] AND the row's words arrive
nowhere in the served document (an unaccounted row LEAVES). IF (1) DOES NOT GO GREEN WITH THE HOUSE LISTED, STOP: write nothing,
report (your cause is then not the whole cause). RECEIPTS (single-file runs, GIT_* unset, logs to /var/tmp/v18/out/v39/p2/): the one
test RED at 2d7ed483f (before your edit), GREEN after; the file whole green; then `tests/lint` whole through `sh scripts/gate-mutex.sh
--run --` (retry a give-up, exit 3; the heavy lane is busy until about 02:30 UTC): its count beside the tip's 48 of 3,304 and the
failing files' names. Commit message: the cause, the ruling, the receipts. Never push; never `--no-verify`. LAST MESSAGE at most 120
words: the commit, the receipts.
