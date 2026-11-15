# ADAPTATION of SUB-BRIEF-IMPRESSION-RUN.md for the fifteenth seat (VEIL-15), item 1

The written sub-brief `docs/chair/2026-11-14/veil-probe-13/briefs/SUB-BRIEF-IMPRESSION-RUN.md` binds you WHOLE, and so do
the sections "Where you are", "Never" and "Before you commit" of `SUB-BRIEF-RULING-5.md` beside it, with ONLY these
changes (the seat VEIL-15's; the paths of the thirteenth seat's container are gone):

## Where you are (replaces every path of both files)
- Worktree `/home/user/wt-veil15`, local branch `veil15`, base **625e2a8ef** (the lane's tip; f2bffdbf0 + VEIL-13's
  hand-back + VEIL-14's item 0, which touched `src/domain/display/publicSafe.js` and two pins only: NOTHING the
  sub-brief names has moved since f2bffdbf0, measured by `git diff --stat f2bffdbf0 625e2a8ef -- <its files>`: empty).
  `npm ci` is done. Never touch `/home/user/settlement-engine` (the main checkout) or any other worktree.
- The seat left two UNCOMMITTED files that are yours to carry: `docs/chair/2026-11-14/COHERENCE-VEIL-HANDBACK-PART16.md`
  (the seat's hand-back: where the sub-brief says PART 14, read PART 16: a bytes row in section 1, a row in section 2,
  item 1 of section 3 struck) and this file.
- Local PostgreSQL 16 cluster, running: `PGHOST=/var/tmp/rv7 PGUSER=postgres` (if down:
  `su postgres -c "/usr/lib/postgresql/16/bin/pg_ctl -D /var/tmp/v15pg -l /var/tmp/v15log/pg.log -w start"`).
  pg@8.13.1 at `/var/tmp/v15/pgmod` (RV6_PGMOD).
- The reader's library (NEVER commit it; read-only): `/var/tmp/v15/lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/`,
  `REVIEW-VEIL-6/` beside it, `/var/tmp/v15/lib/docs/chair/2026-11-14/probes/REVIEW-VEIL-8/`.
- THE ACCEPTANCE RUN: `cd /var/tmp/v15 && PGHOST=/var/tmp/rv7 RV6_PGMOD=/var/tmp/v15/pgmod sh lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/run-all.sh /home/user/wt-veil15 <outdir> > <file> 2>&1; echo $?`.
  At the base (PART 15 section 7; DO NOT re-run it at the base): exit 1, 35 of 37, a07 and d06 the only FAIL rows, the
  twin 15 of 15.
- RED RUNS on the base's bytes: `/var/tmp/v15/red-625` (an integrity-counted archive of 625e2a8ef, 9419 files,
  `node_modules` linked). Copy your new or re-keyed guard rows into it to show them red there.
- Every run's output under `/var/tmp/v15/out/run12/`. Proof files (verdict lines, not logs):
  `docs/chair/2026-11-14/veil-probe-15/out/RUN12-red-at-625e2a8ef.txt`, `RUN12-green.txt`, `RUN12-born.txt`; any probe you
  write into `docs/chair/2026-11-14/veil-probe-15/measure/`.
- THE GUARDS at the base (PART 15 section 7): `galleryVeilHandRows` 14, `gallerySecondHomes` 6, `galleryVeilCures` 32
  (52 of 52); also run `galleryServerVeil` (17 of 17 at the base), `gallerySanitizer` and every other
  `tests/security/gallery*.pglite.test.js` file that loads 212's helpers (its loader may name `_gallery_veil_clauses`):
  each file's counts before and after, by `GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=3 <files> > <file> 2>&1; echo $?`
  (if the mutex refuses the shared tier: the vitest line through `sh scripts/gate-tail.sh`).
- THE V13-1 PLANT ON THE LINK (the chair's condition for the fresh security reader): your change is to the applier, so the
  arm `VEIL-13 RULING 5` of `galleryVeilHandRows` (the covert tie's markers on the party link) must stay green, and the
  hand towns p and pc through the link must give what they gave at the base: say so with the counts.

## Changes to "Before you commit"
- DO NOT COMMIT. Leave every change in the worktree; write the commit message (the sub-brief's content; the sha256 of 212
  and of its rollback after the change; the two frozen 211 checksums proved) to `/var/tmp/v15/out/run12/COMMIT_MSG.txt`,
  ending with exactly these two lines:
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
  `Claude-Session: https://claude.ai/code/session_01ACmDYXQnk1kQraViwfnQC5`
  The seat reads your diff line by line, runs the guards and the acceptance run itself, commits and pushes.
- The three gates through `sh scripts/gate-tail.sh`: `npm run typecheck:domain:strict` (ceiling 1113), `npm run
  typecheck:ratchet` (ceiling 167), `npx eslint <touched src and test files>`.
- A test title you add moves the lighting census (`tests/lint/sovereigntyLightingContract.walker.test.js`): run that one
  file after your change and report its verdict; do NOT re-take the census (the seat does that, through its door, in its
  own commit).
- OVER 23 BORN CHANCE RUNS: STOP before anything else and report the count and the runs; the seat tells the chair.
