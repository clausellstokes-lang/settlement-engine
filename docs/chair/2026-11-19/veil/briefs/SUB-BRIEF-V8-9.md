# SUB-BRIEF: V8-9, NO UNBOUNDED PATTERN (VEIL-17, STEP 2, first item)

VEIL-16's draft (`docs/chair/2026-11-14/veil-probe-16/briefs/SUB-BRIEF-V8-9.md`) brought to the joined tip by VEIL-17,
who owns it. You are a builder working FOR the seat VEIL-17. The seat reads your diff line by line, runs the guards
itself and pushes; YOU DO NOT PUSH. A security lane: slips are leaks. Measure first, red first. A failure falls toward
WITHHOLDING, never toward sending.

## Where you are
- Worktree `/home/user/wt/veil17`, local branch `veil17`, base `ad093c92c` (the joined tip: the veil 4fa35f294 joined with
  pull request #75's head 8f3b8bf4b; 212 unchanged by the join). `npm ci` is done. Never touch
  `/home/user/settlement-engine` (the main checkout) or any other worktree; never run a git command that moves a ref
  other than your one commit on `veil17`.
- Local PostgreSQL 16 cluster, running: `PGHOST=/var/tmp/rv7 PGUSER=postgres` (if down:
  `su postgres -c "/usr/lib/postgresql/16/bin/pg_ctl -D /var/tmp/v17pg -l /var/tmp/v17log/pg.log -w start"`). Unix socket
  only. Nothing else, ever: no hosted database, no production credential, no `supabase` command. `/var/tmp/v16` is a
  symlink to `/var/tmp/v17`, so every older instrument's path works as written. Chains:
  `sh /var/tmp/v17/lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-6/native/chain.sh <db> <211|212> <tree>/supabase/migrations`.
  `pg@8.13.1` is in `/var/tmp/v17/pgmod`.
- The security reader's library (NEVER commit it; read-only): `/var/tmp/v17/lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/`
  (`run-all.sh`, `hand/run.sh`, `twin.probe.jsx`, `jdiff.mjs`, `expect.mjs`, `born/`), `REVIEW-VEIL-6/` beside it, and
  `/var/tmp/v17/lib/docs/chair/2026-11-14/probes/REVIEW-VEIL-8/` (`hand/cost8.sql` holds the reader's V8-3 and V8-9 rows).
  The reader's finding text: `/var/tmp/v17/RV8.md` line 25.
- THE ACCEPTANCE RUN: `cd /var/tmp/v17 && PGHOST=/var/tmp/rv7 RV6_PGMOD=/var/tmp/v17/pgmod sh lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/run-all.sh /home/user/wt/veil17 <outdir> > <file> 2>&1; echo $?`.
  At the base (VEIL-16, PART 17 section 6): exit 1, a07 and d06 the only FAIL rows (items B and C, not yours), e06 PASS,
  the twin 15 of 15.
- A RED RUN IS RUN ON THE BASE'S BYTES: `git -C /home/user/wt/veil17 archive ad093c92c | tar -x -C /var/tmp/v17/red-d7abcdc (ready: the joined tip d7abcdc55, byte-equal to ad093c92c outside docs/chair, node_modules linked)`,
  `node_modules` linked; copy your new guard arm into it to show it red there.
- Instruments: `docs/chair/2026-11-14/veil-probe-16/measure/` (`cost.mjs`, `prof.mjs`, `big.probe.jsx` — Langengrund,
  regenerate to `/var/tmp/v17/out/big0.json` if absent, `born-cmp.mjs`, `v83-cost.sh`) and
  `docs/chair/2026-11-14/veil-probe-13/measure/r5-born.probe.jsx` (born, `R5_N=4`); `V83-born.txt` in
  `veil-probe-16/out/` shows how VEIL-16 ran born and the V13-1 plant (`veil-probe-11/hand/town-p.json`, `town-pc.json`,
  `veil-p.json`). Every run's output to `/var/tmp/v17/out/v89/`; read only the lines you need. Never read a gate through
  a pipe: `sh scripts/gate-tail.sh <command...>`.

## Never
- NEVER change `supabase/migrations/211_server_side_share_veil.sql` or its rollback (sha256 `eface6d0…be0b01`,
  `ce8474ff…49712f`): prove both before you commit.
- NEVER push, never `--no-verify`, never a pull request, never another branch, never `git reset/checkout/stash/clean`,
  never the whole test suite (tests in it run git against the real repository), never `tests/scripts/`, never a hosted
  database, a production credential, `supabase db push` or `migration repair`.
- A guard or pin is re-keyed by identity, never loosened. No adjacent repair: another pin red is NAMED with its message,
  not touched. No new key in the settlement record, no new word in the vocabulary file. No model identifier anywhere but
  the trailer. Only these files: 212 (`supabase/migrations/212_share_veil_later_cures.sql`), its rollback,
  `src/domain/display/gallerySecondHomes.js` (the twin), `tests/security/galleryVeilHandRows.pglite.test.js`, and new
  files under `docs/chair/2026-11-19/veil/` (`measure/`, `out/`).

## The finding and the ruling
THE READER (REVIEW-VEIL-212-8, V8-9, MEDIUM, availability; design (v): a read never fails where 211 serves): "The one
alternation is compiled with no bound on its size: past a size the sharer controls the read RAISES." 600 houses hidden
whole, each name about 145 characters: 211 serves; 212 raises `invalid memory alloc request size 1941052248`; 1,000 of
about 75 (VEIL-16 measured 80): `invalid memory alloc request size 1556588520`; 1,500 of about 145: `regular expression is
too complex`; 300 of 145 and 1,000 of 40 are served. "PLAUSIBLE, not measured: just under the refusal the compile holds up
to a gigabyte in one backend." The reader's cure: "a bound on the pattern (names, or folded length) with the closed
answer past it, as the walk has at 64 levels."
THE LAW (binding): NO UNBOUNDED PATTERN; THE CLOSED ANSWER AT ANY BOUND, NEVER AN ERROR. A READ NEVER FAILS WHERE 211
SERVES. THE COST LAW: no read more than TWICE the frozen 211 on the reader's 300 KB row, its V8-3 row and the largest born
town (Langengrund). WHERE THE VEIL CANNOT BE SURE, IT WITHHOLDS.

## Read first (whole)
1. `docs/chair/2026-11-14/COHERENCE-VEIL-HANDBACK-PART17.md` sections 0 to 3.
2. 212: `_gallery_veil_name_search`, `_gallery_veil_name_needle`, `_gallery_veil_name_ready`, `_gallery_veil_name_hits`
   and every other place 212 runs a pattern BUILT FROM THE STORED TOWN (grep `regexp_` and `~` whose pattern is not a
   literal: list each with its line in your report), and where the search's answer is read (`_gallery_veil_second_homes`).
3. The twin: `buildNameSearch` (and every `new RegExp(` in `src/domain/display/` whose source is built from the stored
   town), `sweepHiddenNames`, their caller in `withholdSecondHomes`.

## The design (yours, within the law; the seat's notes, not binding)
- MEASURE FIRST, both engines: the compile's memory (the backend's RSS) and time against the pattern's length, for Latin
  names, for names outside ASCII (each letter a bracket class) and for one long name; the twin's `new RegExp` time and
  the read's time in Node. Then the largest pattern any born town makes (the born probe's towns and Langengrund): the bound
  must stand far above every birth and far below every refusal, with its margins said.
- THE SEAT'S NOTE ON A SURE SPLIT (you may build it if you prove it): a pattern holds no quotation mark, so every match of
  the alternation lies inside one token; a token holds a match of `p` iff it holds a match of one of its alternatives; so
  splitting the alternatives into parts, each compiled under a bound, and taking the UNION of the tokens each part marks
  on the SAME unmarked text gives the same hit set as the one alternation (never run the parts one after another over a
  text another part has already marked). The open-name search (`held` in `_name_search`) the same. With that, a bound is
  still owed on the NUMBER of parts (or the total) and on any single needle or cut-out (`blank`: one open name of 100,000
  characters is one pattern), with the closed answer past it.
- THE CLOSED ANSWER past the bound: where the search cannot be built or run under the bound, every key and string of the
  projection may hold a hidden name: each leaves as a hit would, the floors aside (the town's name; a listed house's id and
  name; a shown power's faction and name), in both engines alike; the read serves (never raises). State in your report, in
  plain words, what such a share's reader then sees.
- No change to what any read sends below the bound: born and every earlier plant unmoved.

## The work: ONE commit, red first, in 212 AND the twin, rule for rule
- RED FIRST at the base's bytes: a new arm of `tests/security/galleryVeilHandRows.pglite.test.js` ("V8-9 THE PATTERN'S
  BOUND"): the reader's rows (600 x 145, 1,000 x 80, 1,500 x 145) and markers the earlier guards lacked (the same count of
  names in Greek or Cyrillic, with a dotted capital I and a sharp s; one open name of 100,000 characters that holds a
  hidden one; names of symbols only), each with a string elsewhere that names a hidden house and a string that names none:
  at the base the server raises (red); at green every read (gallery, link, import; DM off and on) serves, sends no hidden
  name, and the server and the twin send the same document (0 paths). Just under the bound: exact answers, equal to the
  base where the base serves. Just over: the closed answer in both engines. Keep the arm's run time reasonable (state it).
- Green: the arm; the cost (the reader's rows and the bound's neighbourhood, ms, x211 | base | after; the compile's memory
  at the bound; the cost8 V8-3 rows and Langengrund's link and gallery, x211 | base | after, `cost.mjs` medians); born
  unmoved (`r5-born.probe.jsx`, `R5_N=4`, base chain against tree chain, `born-cmp.mjs`: 0 differ); the V13-1 plant on the
  link (18 of 18, COVERTMARK on no link); the six guard files
  (`GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=2 tests/security/galleryVeilHandRows.pglite.test.js tests/security/gallerySecondHomes.pglite.test.js tests/security/galleryVeilCures.pglite.test.js tests/security/galleryServerVeil.pglite.test.js tests/security/gallerySanitizer.pglite.test.js tests/security/galleryMapMemberCount.pglite.test.js`)
  plus the twin's tests (`tests/domain/display/publicSafe*.test.js`, `tests/components/publicProseVeil*.test.js`,
  `tests/lib/gallery.test.js`); the acceptance run (expected: exit 1, a07 and d06 only). At the commit (src/ moves):
  `npm run typecheck:domain:strict`, `npm run typecheck:ratchet`, `npx eslint <touched files>`, each through gate-tail.
- Proof files (verdict lines, not logs) into `docs/chair/2026-11-19/veil/out/` (`V89-red-at-ad093c92c.txt`, `V89-green.txt`,
  `V89-born.txt`, `V89-cost.txt`); probes into `docs/chair/2026-11-19/veil/measure/`.
- 212's header list of cures gains an entry for V8-9 (follow the file's own form); the rollback drops any new signature.
- Commit on `veil17` by explicit paths (`git add <paths>`; never `-A`), `git commit -F <file>`. The message: the bound and
  the closed answer; red and green with counts; born unmoved; the cost table; the sha256 of 212 and of its rollback after
  the change; the two frozen 211 checksums proved; ending with exactly these two lines:
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
  `Claude-Session: https://claude.ai/code/session_01FbPLbeX2d8yDneKhVoxZWb`
  Do NOT edit the hand-back file (the seat writes it).

## Your final report (at most 300 words)
The commit sha; both sha256 of 212 and its rollback; the bound and its margins (births, refusal); the closed answer in
plain words; every pattern site listed; red and green with counts; cost; born; guards; acceptance; the gates; every pin
red and left; anything not done; executed told from plausible.

## Two registers you can move (read before writing the twin)
- `tests/lint/tuningRegister.walker.test.js`: a NEW top-level named numeric constant in `src/` (e.g. `export const
  X_BOUND = 4096`) raises `UNREGISTERED_NAMED_CEILING` and reds the walker. It is ALREADY red by one at the base for
  `NAME_WALK_BOUND = 64` (named to the chair for a ruling). Prefer a shape that adds no new named numeric constant (e.g.
  carry the bound beside the existing one in one frozen object, or derive it); if you cannot, say so in your report:
  do not touch the walker.
- `tests/lint/ruinFilterRoster.walker.test.js` and `tests/lint/mutationCoverageManifest.test.js` are red at the base
  for the veil's own files (named to the chair): do not touch them; do not add a NEW reader of `.institutions`.
