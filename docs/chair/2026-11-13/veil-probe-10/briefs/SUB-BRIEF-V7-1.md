# SUB-BRIEF: the name search rebuilt (V7-1 and the findings that turn on the sweep)

You are a builder working FOR the seat VEIL-10 of the settlement-engine integration program, in the seat's own scratch
worktree. The seat (your parent) reviews your commit and pushes it; YOU DO NOT PUSH. This is a security lane: when an
owner shares a town, whatever the owner hid (a house, a person, an event, a power) must not reach a reader, in the
page OR in the data the server sends. Slips here are leaks. Work carefully, measure first, red first.

## Where you are
- Worktree: `/var/tmp/v10/wt`, local branch `veil10`, tip `4f7c60cbb` (= origin's lane tip). `npm ci` is done there.
  Do all work there. `/home/user/settlement-engine` is the primary checkout: do not touch it.
- Local PostgreSQL 16 cluster, already running: `PGHOST=/var/tmp/rv7 PGUSER=postgres` (unix socket only). If it is
  down (a container restart): `su postgres -c "/usr/lib/postgresql/16/bin/pg_ctl -D /var/tmp/v10pg -l /var/tmp/v10pg.log -w start"`.
- The security reader's plant library (NEVER commit it to the lane): `/var/tmp/v10/lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/`
  (`run-all.sh`, `expect.mjs`, `hand/expected.json`, `hand/town-*.json`, `hand/veil-*.json`, `hand/deep-cost.sql`).
  THE ACCEPTANCE RUN: `cd /var/tmp/v10 && RV6_PGMOD=/var/tmp/v10/pgmod sh lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/run-all.sh /var/tmp/v10/wt <outdir> > <file> 2>&1; echo $?`
  (about 90 seconds). Its red print at the starting tip: `/var/tmp/v10/out/run-all-red-at-7d99e9b8e.txt`.
- Write every run's output to a file under `/var/tmp/v10/out/` and read only the lines you need (never dump a log).

## Read first (whole, in this order)
1. `/tmp/claude-0/-home-user-settlement-engine/afdf28cd-ad8c-5a20-be1d-b538cfcaba82/scratchpad/BRIEF.md` (the seat's brief; long lines:
   `fold -s -w 220`). Its section THE DESIGN, RULED and THE LAWS OF THIS LANE bind you.
2. `/var/tmp/v10/wt/docs/chair/2026-11-13/COHERENCE-VEIL-HANDBACK-PART11.md`: section 4 is THE DESIGN YOU BUILD.
3. `/tmp/claude-0/-home-user-settlement-engine/afdf28cd-ad8c-5a20-be1d-b538cfcaba82/scratchpad/chair/REVIEW.folded`: the security read you
   answer: section 0's table (V7-1, V7-4, V7-6, V7-7, V7-9, V7-10) and section 8's eight shapes for the builder.
4. `supabase/migrations/212_share_veil_later_cures.sql` WHOLE (the file you change), and in the FROZEN
   `supabase/migrations/211_server_side_share_veil.sql` the function `_gallery_veil_drop_hooks` (the shape of an
   iterative walk) and `_gallery_veil_lower`, `_gallery_veil_str`, `_gallery_veil_inst_id`.
5. `src/domain/display/gallerySecondHomes.js` WHOLE (the client's twin) and `src/domain/display/galleryVeil.js :: applyVeil`.
6. `tests/security/galleryVeilHandRows.pglite.test.js` WHOLE (the guard you extend) and, in
   `tests/security/gallerySecondHomes.pglite.test.js`, the arm titled 'THE TWO FOLDS ARE ONE'.
7. The library's `hand/expected.json`, the five hand towns with their veils, `run-all.sh`, `expect.mjs`.

## The work: ONE commit (two if it reads better), red first
Build PART 11 section 4, points 1 to 5, in migration 212 AND in the client's twin, rule for rule: the fold of every
script; case in the needle from one explicit table carried identically by both engines; ONE search a string for all
hidden names at once (name, label where no name, name without its bracketed qualifier, the catalogue identity, each
processing name only the house answers to; squeezed and camel-cased spellings; an English plural); keys as well as
values; ids and joins swept like any string; the floors (the town's `name`; the `id` and `name` of a house still listed;
a shown power's `faction` / `name`); open names that hold a hidden one blanked first; an entry of a list whose own `id`
or `name` is taken leaves the list whole; the whole text asked first; an ITERATIVE walk bounded at 64 levels with the
closed answer at the bound. It REPLACES the eighth seat's sweep (`_gallery_veil_fold`, `_folded_name`, `_names`,
`_sweep` and the prefilter in `_gallery_veil_second_homes`; `foldName`, `foldedHolds`, `namesText`, `sweepNames` in the
twin): do not patch the old sweep. The laws of section 4 are fixed; the mechanism is yours where a measurement refutes
mine (say what you changed and the measure). Keep what is by identity already (the two derived lists by positive
account, the five booleans, the chains by the processor match): do not widen or narrow them here; the trace entries,
the income rows, every existence flag and the second homes (V7-2, V7-5, V7-8) are the NEXT commits, not yours.

MEASURE FIRST, before writing the walk: the cost of one alternation of ~1,200 names against ~10,000 short strings and
against one 300 KB text in PostgreSQL 16 on the local cluster (a ten-line SQL probe). THE COST LAW: a read with houses
hidden costs no more than TWICE the same read on the frozen 211 alone, on the reader's 300 KB row
(`hand/deep-cost.sql -v depth=10 -v houses=600 -v strings=10000 -v dm=false`, chains `x211` and `x212` as `run-all.sh`
builds them). If the law of names cannot be met inside that cost, STOP and report the numbers.

RED FIRST: extend `tests/security/galleryVeilHandRows.pglite.test.js` with arms of your OWN plants (not copies of the
reader's towns), each run red at 4f7c60cbb's bytes (keep the output) and green after:
- EVERY SCRIPT (the chair's record 414): a house hidden whole named in Cyrillic, in Greek, in a script with no case
  and no spaces (Han or Thai), in Arabic, in symbols only, in mixed scripts, with a dotted capital I (U+0130), with a
  sharp s, with the Kelvin sign; each name planted in a sentence, an export, a person's goal (lower-cased and
  upper-cased copies too) and the derived list: zero arrivals, as written, in any case, squeezed.
- THE FORMS (V7-4): a key; a join (`from` / `to`); an id beside a name; camel case; squeezed; the name without its
  bracketed qualifier; a plural; a label with no name (V7-9).
- WHAT IS NOT HIDDEN STAYS (V7-7): an open house whose name holds a hidden one keeps its name and its strings; a shown
  power named as a hidden house keeps its name; an open house whose name EQUALS a hidden one's (different ids) keeps
  its name; the town's own name; every string that names no hidden house, counted (zero taken).
- THE BOUND (V7-10): a document 3,000 levels deep with a house hidden whole is served, Reveal DM on and off; a hidden
  name planted below level 64 does not arrive (the closed answer).
- SERVER AGAINST TWIN: on every arm, the paths at which the gallery read and the twin differ: zero, or each named.
Re-key (never loosen) the arm 'THE TWO FOLDS ARE ONE' of gallerySecondHomes.pglite.test.js to the new fold: the
server's fold equals the client's for every character of the basic plane, alone and inside a name. If another pin of
the lane goes red because a helper's name or count moved (galleryVeilCures counts helpers), do NOT touch it: name it
in your report with its message.

ALSO: `supabase/rollback/212_share_veil_later_cures.down.sql` must still return the database to the frozen 211's
catalogue: update its drops BY SIGNATURE to 212's helper set as you leave it (read the file's own shape). 212 stays ONE
transaction, create-or-replace, idempotent, running after the frozen 211; every new helper is `immutable`, written
`public.<name>`, with no dynamic SQL built from data; the closing revoke loop stays last.

## Never
- NEVER change `supabase/migrations/211_server_side_share_veil.sql` or `supabase/rollback/211_server_side_share_veil.down.sql`
  (sha256 `eface6d0…be0b01`, `ce8474ff…49712f`): prove both checksums before you commit.
- NEVER push, never `--no-verify`, never a pull request, never anything on another branch, never a hosted database, a
  production credential, `supabase db push` or `migration repair`. Local pglite and the local cluster only.
- Never read a gate through a pipe: `sh scripts/gate-tail.sh <command>`. No adjacent repair, however tempting.
- No model identifier in any file or commit message except the trailer below.

## Before you commit
- The guard arms green: `npx vitest run tests/security/galleryVeilHandRows.pglite.test.js tests/security/gallerySecondHomes.pglite.test.js --maxWorkers=3 > <file> 2>&1` (the second file takes about eight minutes).
- The acceptance run: its print saved; say which of its 37 checks and three timed rows are green and which stay red for the next commits.
- The three gates, each through gate-tail: `npm run typecheck:domain:strict`, `npm run typecheck:ratchet`, `npx eslint <the files you touched>`.
- Copy your red and green proof files (small: verdict lines, not logs) into `docs/chair/2026-11-13/veil-probe-10/out/`.
- Update PART 11: the bytes table (212's and its rollback's new sha256), a row in section 3, and section 4 where your mechanism differs.
- Commit on `veil10` by explicit paths with `git commit -F <file>`; the message states the red and the green, the two
  timings against 211, both new checksums of 212, and ends with exactly these two lines:
  `Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>`
  `Claude-Session: https://claude.ai/code/session_01ACmDYWqpMCGn19T8PYUa5t`

## Your final report (at most 300 words)
The commit sha; 212's and its rollback's sha256; the acceptance run's counts (which checks still red and why); the
timings on the 300 KB row (211 against 212) and the deep row; the guard's counts; every pin you saw red and did not
touch; anything of this brief you did not do; executed told from plausible.
