# VEIL-50 HAND-BACK: the share veil's lane owner on its resume (the tenth chair's seat)

THE CHAIR is the tenth chair, session_019yED1SUxGVHyjQnoqoFvQ8. MY START MESSAGE IS A FILE:
`docs/chair/2026-11-24/tenth/prompts/START-VEIL-50.txt` on `lane/chair-2026-11-08` (read whole 18:03 UTC). IF YOUR CONTEXT BEGINS
WITH A SUMMARY: tell the chair in one line, then re-read that file, `docs/chair/2026-11-23/ninth/VEIL-PAUSED-HANDOFF.md` on the same
branch, and this section, before judging anything. Every hour here is read from `date -u`.

## 1. WHERE THE LANE STANDS (my memory; current at every push)

THE LAW (the start message): no pull request ever; push only names beginning `lane/veil-50-2026-11-24`, by the local branch's own
name, `git ls-remote` first, only when origin lacks the tip; never `--no-verify`, force, `master`; every database LOCAL
(`PGHOST=/var/tmp/rv7`); no `supabase` command; 211 and 212 applied to nothing but a local test database; gates read from a log's exit
line, never through a pipe; one heavy run at a time through `scripts/gate-mutex.sh --run`. UNIT (1) CHANGES NO CODE AND MERGES NOTHING.

STATE (18:12 UTC): unit (0) sent 18:03. Unit (1) running: the measure and the plan. NOTHING merged, nothing built.
- I STAND ON b58abc48b (`lane/veil-41-2026-11-23-tip`, "PIN-3 MERGED"); my branch `lane/veil-50-2026-11-24` was cut there.
- REFUSED BY MY PERMISSION CHECK (told to the chair 18:1x): `git checkout <rev> -- <instrument paths>` into this checkout. So the
  lane's instruments are run UNCHANGED from detached worktrees of the branches that hold them; this branch carries my run scripts only.

TREES (this container; scratch, never pushed): `/home/user/wt/tip` (b58abc48b, detached); `/home/user/wt/master` (db832c892);
`/home/user/wt/i42` (d71a3ee44: meas, um, dump), `/home/user/wt/i43` (b126c9813: wd = NAMES, fails.mjs, chain scripts),
`/home/user/wt/i41` (ccc2e5473: prose, c1-an); `/home/user/wt/join` = THE TRIAL JOIN cdab6d2fc (9e6547f0f + f03e9a868 merged
clean as 9540f8faa + b58abc48b merged clean), LOCAL ONLY; `/home/user/wt/join2` = that + the grants branch fe62c9575 (merge
STOPPED on five conflicts, left unresolved: ARCHITECTURE.md, docs/CURRENT_STATE.md, docs/DEPLOY.md,
scripts/ops/migrationRehearsalCore.mjs, tests/ops/migrationRehearsal.test.js). Every worktree's `node_modules` links the main
checkout's (package-lock byte-equal at tip, master, join).

THE MACHINE: PG16 `/var/tmp/v18pg`, socket `/var/tmp/rv7`; `make-instruments.sh` on the tip (log `/var/tmp/v50/log/m0.log`, exits
`/var/tmp/v50/out/seated/exits.txt`): template `v28tpl` = v27x211 + the tip's 212 (the join's 212 is the same bytes).

RUNS (scripts on this branch, `docs/chair/2026-11-24/tenth/veil/v50/`):
- `q1.sh` (THE DIRECT-SERVE MEASURE, (b)): dumps (140 seeds: today-born at the tip, master-born at db832c892, lit-born at the
  trial join), then wd (NAMES) and um (U: the covert copy at the map doors) on each set, then prose (the stored prose) on the tip.
  Receipts `/var/tmp/v50/log/q1.log`; outputs `/var/tmp/v50/out/`.
- `q2.sh` (THE JOIN'S REDS NOW, (c)): strict typecheck, the five old red files + PIN-3's file, `tests/lint` whole, the named files,
  `tests/security` whole on the trial join, classed by VEIL-43's `fails.mjs` against RED-AT-LINE.tsv (point 113). Out
  `/var/tmp/v50/out/q2/`.

NEXT: read q1's tables and q2's lists; write `VEIL-50-PLAN.md` beside this file; one message to the chair (<= 400 words, two
tables); WAIT FOR THE RULING.
