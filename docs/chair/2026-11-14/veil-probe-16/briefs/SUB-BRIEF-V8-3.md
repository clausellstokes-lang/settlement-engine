# SUB-BRIEF: V8-3, THE NAME WALK IN ONE PASS (item 3, first of five, of BRIEF-VEIL-16)

You are a builder working FOR the seat VEIL-16, in the seat's scratch worktree. The seat reads your diff line by line,
runs the guards itself and pushes; YOU DO NOT PUSH. A security lane: slips are leaks. Measure first, red first. A
failure falls toward WITHHOLDING, never toward sending. This item is a COST cure: what every read sends must not move
by one byte.

## Where you are
- Worktree `/home/user/wt/veil16`, local branch `veil16`, base `d0afa93dd` (the lane's tip). `npm ci` is done. Never
  touch `/home/user/settlement-engine` (the main checkout) or any other worktree; never run a git command that moves a
  ref other than your one commit on `veil16`. The seat left UNCOMMITTED files in the worktree that are yours to carry in
  your commit: `docs/chair/2026-11-14/COHERENCE-VEIL-HANDBACK-PART17.md` (the seat's hand-back; add your rows) and
  everything under `docs/chair/2026-11-14/veil-probe-16/` (this sub-brief, `measure/`, `out/`).
- Local PostgreSQL 16 cluster, running: `PGHOST=/var/tmp/rv7 PGUSER=postgres` (if down:
  `su postgres -c "/usr/lib/postgresql/16/bin/pg_ctl -D /var/tmp/v16pg -l /var/tmp/v16log/pg.log -w start"`). A unix
  socket only. Nothing else, ever: no hosted database, no production credential, no `supabase` command. Chains are
  built by `sh /var/tmp/v16/lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-6/native/chain.sh <db> 212 <tree>/supabase/migrations`
  (`x211` is built with spec `211`; `x212` exists at the base's bytes: rebuild it, or build `x212n`, from your tree).
  `pg@8.13.1` is in `/var/tmp/v16/pgmod`.
- The security reader's plant library (NEVER commit it; read-only): `/var/tmp/v16/lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/`
  (`run-all.sh`, `hand/run.sh`, `hand/deep-cost.sql`, `twin.probe.jsx`, `jdiff.mjs`, `expect.mjs`, `born/`),
  `REVIEW-VEIL-6/` beside it (`native/chain.sh`, `vitest.config.mjs`, `cold.probe.jsx`), and the reader's newer plants
  `/var/tmp/v16/lib/docs/chair/2026-11-14/probes/REVIEW-VEIL-8/` (`hand/cost8.sql` is THE V8-3 ROW; `show.mjs`).
- THE ACCEPTANCE RUN: `cd /var/tmp/v16 && PGHOST=/var/tmp/rv7 RV6_PGMOD=/var/tmp/v16/pgmod sh lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/run-all.sh /home/user/wt/veil16 <outdir> > <file> 2>&1; echo $?`
  (about 30 s). At the base: exit 1, a07 and d06 the only FAIL rows (items B and C; other commits own them), e06 PASS,
  the twin equal on 15 of 15, the deep and large rows PASS.
- A HAND ROW of the library: after a chain is built, `sh lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/hand/run.sh <db> <town.json> <veil.json> <prefix> <outdir>`
  stores and reads it (gallery, link, import; base, veil, Reveal DM); compared by `jdiff.mjs`.
- A RED RUN IS RUN ON THE BASE'S BYTES, never on the tree you are editing: the archive `/var/tmp/v16/red-d0a` (9434
  files, `node_modules` linked). Copy your new guard arm into it to show it red there.
- The seat's instruments, in `docs/chair/2026-11-14/veil-probe-16/measure/`: `cost.mjs` (median of N rounds, chains
  alternated, the link and gallery reads of one stored town: `PGHOST=/var/tmp/rv7 node cost.mjs /var/tmp/v16/pgmod <town.json> <rounds> <db...>`),
  `prof.mjs` (per-function self time by `track_functions = all`), `big.probe.jsx` (regenerates the largest born town;
  its output is `/var/tmp/v16/out/big0.json`, Langengrund, 503,699 characters: use that file).
- Every run's output goes to a file under `/var/tmp/v16/out/v83/`; read only the lines you need. Never read a gate
  through a pipe: `sh scripts/gate-tail.sh <command...>` prints the tail and exits with the gate's own code.

## Read first (whole)
1. `docs/chair/2026-11-14/COHERENCE-VEIL-HANDBACK-PART17.md` sections 0 to 2 (the rulings; the base, measured).
2. 212 (`supabase/migrations/212_share_veil_later_cures.sql`), WHOLE, these helpers: `_gallery_veil_name_pad`,
   `_gallery_veil_name_sep`, `_gallery_veil_name_prep`, `_gallery_veil_name_ready`, `_gallery_veil_name_hits`,
   `_gallery_veil_name_hit`, `_gallery_veil_named`, `_gallery_veil_name_near`, `_gallery_veil_name_floor`,
   `_gallery_veil_name_taken`, `_gallery_veil_name_sweep`, and the lines of `_gallery_veil_second_homes` that call them
   (grep); the rollback's lines for each helper you add or drop (`supabase/rollback/212_share_veil_later_cures.down.sql`).
3. The twin: `src/domain/display/gallerySecondHomes.js` :: `buildNameSearch` (its `hit` and `holds`) and
   `sweepHiddenNames`, whole.
4. The guard: `tests/security/galleryVeilHandRows.pglite.test.js`, its harness (the top of the file to the first `it(`)
   and the arms V7-10 THE BOUND and V7-4/V7-9 THE FORMS, whole.

## The finding and the ruling
THE READER (REVIEW-VEIL-212-8, V8-3, MEDIUM, availability; the cost law (iv)), copied: "The walk asks every child
container of a node on the way whether it may hold a hit by scanning the whole set of hit strings
(`_gallery_veil_name_near`: one `position()` a hit, a child): children × hits." And: "`_name_near` can ask one
precomputed alternation of the hit strings, or mark the hit strings' positions once; as it stands it is a nested loop
the sharer controls." And (1.5): "I would state the law on the walk's own terms (children × hits must not appear), not
only as a ratio to 211: 211 is itself slow on the row that shows V8-3."
THE SEAT'S MEASURE (PART 17 section 2): besides the `position()` per hit, `_name_near` makes each child's WHOLE text
ready again (`_gallery_veil_name_ready`: pad, prep, the separator runs, every cut-out) at every level on the way: on
Langengrund that, with `_name_hits`, is most of the link's excess (x211 223.9 ms, x212 525.2 ms: 2.35 x).
THE BRIEF'S LAW (binding): ONE PASS. THE COST LAW: no more than TWICE the frozen 211 on the reader's 300 KB row
(run-all's large rows), on its V8-3 row (cost8.sql, 5 houses, 10,000 hit rows: x211 6,960 ms at the base) and on the
largest born town (Langengrund's link, no veil record: x211 223.9 ms, so at most about 447 ms); a read never fails where
211 serves. ON THE WALK'S OWN TERMS: no step whose work is children × hits, nor one that makes a child's text ready
again per level.

## The design (yours, within the law; the seat's note, not binding)
An alternation of the hit strings is itself a pattern whose size the sharer controls (V8-9's habitat: it raised past
600 names): prefer marking the hits' places ONCE. One way: the one marked pass `_name_hits` already makes (the k-th
`"..."` of the made-ready text is the k-th string token, key or value, of `v::text`, if and only if neither the escape
step, the preparation nor a cut-out makes or eats a quotation mark: PROVE that by plants, or do not rely on it) names
the hit tokens by ordinal; the walk can then carry each container's span (its token range, or its offset and length in
the root's text) and ask a sorted array of hit places by `width_bucket` (logarithmic), never a scan per hit and never a
re-made-ready text. Whatever you build: the separators-only names (`raws`, asked as written) keep their answer; the
floors, the bound at level 64 (withheld whole if it holds a hit at any depth: the closed answer) and every rebuild are
unchanged; the helper count and the rollback move together (the rollback drops by signature what 212 adds).
THE TWIN asks the pattern of each string and walks every node once (no children × hits): it does NOT change unless
your proof shows a rule moved (then STOP and report: this item moves no rule). TIME the twin on the V8-3 row (the
reader: "not timed yet") and report it.

## The work: ONE commit, red first, in 212 only
- RED FIRST, at the base's bytes: the cost rows of PART 17 section 2 are the red (3.05 x on the V8-3 row, 2.35 x on
  Langengrund's link). Add, as a new arm of `tests/security/galleryVeilHandRows.pglite.test.js` ("V8-3 THE WALK IN ONE
  PASS"), (a) an EQUALITY arm: plants where the walk's answer is easy to get wrong: hits at levels 1, 2, 30, 62, 63, 64,
  65; a hit only in a KEY; a hit string holding an escaped quotation mark, a reverse solidus, a control character, an
  astral code point, a dotted capital I (U+0130), a sharp s; a hit in another script (Greek, Cyrillic, Han) and of
  symbols only; a separators-only name; two siblings holding the same hit; a floor holding a hit; a hit inside a
  cut-out open name beside one outside it; and the controls (a near-miss string that holds no hidden name) — served by
  every read (gallery, link, import; DM off and on) EQUAL to the twin (0 paths), and equal to the base's bytes'
  responses (run the arm in the red archive: it must be GREEN there too, since the answers do not move); and (b) a
  SCALING arm, red at the base: the V8-3 row's shape at N and at 4N (hits and children together), asserting the 4N read
  takes under 8 times the N read (linear is about 4, the base's children × hits about 16); choose N so the base is red
  and the green stable in 5 runs of 5; if pglite's timings cannot carry that margin, say so and keep (a) only.
- Green: (a) 0 paths and equal to the base; (b) green 5 of 5; the cost table (x211 | base | after, ms, native
  cluster, medians): cost8.sql's four V8-3 rows of PART 17 section 2, run-all's deep and large rows, Langengrund's link
  (no veil record, and the default veil: `VEIL='{"$veil":{"v":1,"mode":"live","deltas":[]}}'` or the guard's own
  default-veil record) and gallery read (the default veil) by `cost.mjs`, 15 rounds; and the twin on the V8-3 row.
  Every row within the cost law, or STOP and report the numbers (do not commit over the law).
- THE ANSWERS DID NOT MOVE, on births you did not tune on: `REVIEW-VEIL-13`'s born probe
  (`docs/chair/2026-11-14/veil-probe-13/measure/r5-born.probe.jsx`, `R5_N=4`) on a chain of the base's migrations and
  one of your tree's: every read's fingerprint `h` equal (0 of all rows differ); and the V13-1 plant on the link:
  `docs/chair/2026-11-14/veil-probe-11/hand/town-p.json` and `town-pc.json` with `veil-p.json` through `hand/run.sh`
  on both chains: 18 of 18 responses 0 paths differ, COVERTMARK in no link response.
- 212 stays ONE transaction, create-or-replace, idempotent, after the frozen 211: applied twice exit 0; down then up
  (the rollback, then 212 again) exit 0 with the helper counts said.

## Never
- NEVER change `supabase/migrations/211_server_side_share_veil.sql` or its rollback (sha256 `eface6d0…be0b01`,
  `ce8474ff…49712f`): prove both before you commit.
- NEVER push, never `--no-verify`, never a pull request, never another branch, never `git reset/checkout/stash/clean`
  in either checkout, never the whole test suite (tests in it run git against the real repository), never a hosted
  database, a production credential, `supabase db push` or `migration repair`.
- A guard or pin is re-keyed by identity, never loosened. No adjacent repair: if another pin or check goes red, do not
  touch it: name it with its message. No new key in the settlement record, no new word in the vocabulary file. No model
  identifier anywhere but the trailer below. Only the files named here: 212, its rollback, the guard file, PART 17 and
  `veil-probe-16/` (src/ only if you STOP and the seat says so).

## Before you commit
- `GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=2 tests/security/galleryVeilHandRows.pglite.test.js tests/security/gallerySecondHomes.pglite.test.js tests/security/galleryVeilCures.pglite.test.js tests/security/galleryServerVeil.pglite.test.js tests/security/gallerySanitizer.pglite.test.js tests/security/galleryMapMemberCount.pglite.test.js > /var/tmp/v16/out/v83/guards.txt 2>&1; echo $?`
  (the shared tier takes two workers): each file's counts (at the base 117 of 117: galleryVeilHandRows 15,
  gallerySecondHomes 6, galleryVeilCures 32, galleryServerVeil 17, gallerySanitizer 36, galleryMapMemberCount 11).
- The acceptance run after your change (expected unchanged from the base: exit 1, a07 and d06 only).
- `npx eslint tests/security/galleryVeilHandRows.pglite.test.js` through gate-tail (no src/ file moves: say so).
- Proof files (verdict lines, not logs) into `docs/chair/2026-11-14/veil-probe-16/out/` (`V83-red-at-d0afa93dd.txt`,
  `V83-green.txt`, `V83-born.txt`, `V83-cost.txt`); any probe you write into `veil-probe-16/measure/`. PART 17: the bytes
  table (a row for this commit), a row in section 3 (what moved in 212, the twin unmoved, red and green, the counts,
  born, the cost table), and strike V8-3 in section 4's item 3.
- Commit on `veil16` by explicit paths (`git add <paths>`; never `-A`), `git commit -F <file>`. The message: what the
  walk now does; red and green with counts; born unmoved; the cost table; the sha256 of 212 and of its rollback after
  the change; the two frozen 211 checksums proved; and it ends with exactly these two lines:
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
  `Claude-Session: https://claude.ai/code/session_01ACmDYZzgz9Ccd3g2MxkQvn`

## Your final report (at most 300 words)
The commit sha; both sha256 of 212 and its rollback; the design in three lines; red and green with counts; the cost
table; born; the V13-1 plant; guards; acceptance; every pin red and left; anything not done; executed told from
plausible.
