# SUB-BRIEF: RULING (5) ON ALL FOUR STRINGS: THE COVERT TIE CLOSED (item 1 of BRIEF-VEIL-13, FIRST)

You are a builder working FOR the seat VEIL-13 of the settlement-engine integration program, in the seat's scratch
worktree. The seat (your parent) reads your diff line by line, runs the guards itself and pushes; YOU DO NOT PUSH. This
is a security lane: when an owner shares a town, whatever the owner hid must not reach a reader, in the page OR in the
data the server sends. Slips here are leaks. Measure first, red first. A failure falls toward WITHHOLDING, never
toward sending. TODAY'S LIVE SERVER TELLS THIS TIE (2 of 240 born towns): this commit closes it.

## Where you are
- Worktree `/home/user/wt/veil13`, local branch `veil13`, base `2937f9ac9` (the lane's tip). `npm ci` is done. Never
  touch `/home/user/settlement-engine` (the main checkout) or any other worktree; never run a git command that moves a
  ref other than your one commit on `veil13`. The seat left two UNCOMMITTED files in the worktree that are yours to
  carry in your commit: `docs/chair/2026-11-14/COHERENCE-VEIL-HANDBACK-PART14.md` (the seat's hand-back; add your rows)
  and this sub-brief.
- Local PostgreSQL 16 cluster, running: `PGHOST=/var/tmp/rv7 PGUSER=postgres` (if down:
  `su postgres -c "/usr/lib/postgresql/16/bin/pg_ctl -D /var/tmp/v13pg -l /var/tmp/v13log/pg.log -w start"`). A unix
  socket only. Nothing else, ever: no hosted database, no production credential, no `supabase` command.
- The security reader's plant library (NEVER commit it; read-only): `/var/tmp/v13/lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/`
  (`run-all.sh`, `hand/run.sh`, `twin.probe.jsx`, `jdiff.mjs`, `expect.mjs`, `born/`), `REVIEW-VEIL-6/` beside it
  (`native/chain.sh`, `vitest.config.mjs`), and the reader's newer plants
  `/var/tmp/v13/lib/docs/chair/2026-11-14/probes/REVIEW-VEIL-8/` (`hand/town-g.json`, `hand/veil-g.json`, `show.mjs`,
  `README.md`).
- THE ACCEPTANCE RUN: `cd /var/tmp/v13 && RV6_PGMOD=/var/tmp/v13/pgmod sh lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/run-all.sh /home/user/wt/veil13 <outdir> > <file> 2>&1; echo $?`
  (about 30 s). At the base: `/var/tmp/v13/out/runall-base.txt`: exit 1, a07 and d06 the only FAIL rows (items B and C;
  other commits own them), the twin equal on 15 of 15.
- A HAND ROW of the library: after run-all has built chain `x212` from the worktree,
  `sh lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/hand/run.sh x212 <town.json> <veil.json> <prefix> <outdir>` stores
  and reads it (gallery, link, import; base, veil, Reveal DM); the twin by the line run-all.sh uses with
  `RV7_LIKE='<prefix>%'`; compared by `jdiff.mjs`; inspected by `node lib/docs/chair/2026-11-14/probes/REVIEW-VEIL-8/show.mjs <response.json> '<regex>'`.
- A RED RUN IS RUN ON THE BASE'S BYTES, never on the tree you are editing:
  `mkdir -p /var/tmp/v13/red-2937 && git -C /home/user/wt/veil13 archive 2937f9ac9 | tar -x -C /var/tmp/v13/red-2937`,
  `node_modules` symlinked in; copy your new guard arm into it to show it red there.
- Every run's output goes to a file under `/var/tmp/v13/out/r5/`; read only the lines you need. Never read a gate
  through a pipe: `sh scripts/gate-tail.sh <command...>` prints the tail and exits with the gate's own code.

## Read first (whole, in this order)
1. `docs/chair/2026-11-14/COHERENCE-VEIL-HANDBACK-PART12.md`: sections 0, 0b (ruling (5) and the 04:55 addition),
   5 (ruling (5) by run: how the 240 born towns were counted) and 7 (the design, first bullet).
2. `docs/chair/2026-11-14/COHERENCE-VEIL-HANDBACK-PART14.md` (the seat's file; section 0).
3. 212 (`supabase/migrations/212_share_veil_later_cures.sql`): `_gallery_apply_member_overrides` WHOLE, the helper(s)
   `_second_homes` uses to say "a copy of a tie" (its own rule), the pressure-sentence arm wherever it now lives (ruling
   (3): it goes with the ties' description eye) and the name-position helper rule (1) uses, each WHOLE; every caller of
   what you change (grep). The rollback `supabase/rollback/212_share_veil_later_cures.down.sql` where it restates
   `_gallery_apply_member_overrides`.
4. The twin: `src/domain/display/galleryVeil.js :: galleryPayloadFor` WHOLE, and the twin functions of every 212 helper
   you call (`src/domain/display/gallerySecondHomes.js`), WHOLE.
5. The public sanitiser's drop of covert ties (find it: the frozen 211's `_gallery_veil` / the projection, and its JS
   twin): read the condition WHOLE, to know exactly which ties are dropped and when Reveal DM keeps them.
6. Hand rows: `docs/chair/2026-11-14/veil-probe-11/hand/town-p.json`, `town-pc.json`, `veil-p.json`; the reader's
   `REVIEW-VEIL-8/hand/town-g.json`, `veil-g.json` (its gcov1 to gcov3 strings) and the section of
   `/var/tmp/v13/lib/docs/chair/2026-11-14/REVIEW-VEIL-212-8-2026-11-14.md` that speaks of the covert tie (grep covert).
7. `tests/security/galleryVeilHandRows.pglite.test.js`: its structure and one existing arm WHOLE (to add yours in the
   same form); `docs/chair/2026-11-14/veil-probe-11/measure/born-ties.probe.jsx` WHOLE (the born count's instrument).

## The ruling you build (the chair; PART 12 sections 0 and 0b, whole there)
Ruling (5): "the public sanitiser drops a covert tie from `relationships[]` and `prominentRelationship` still tells it:
a second home of the tie, withheld BY IDENTITY when the tie it tells is dropped, in 212 and in the twin, a hand row red
first and the born count." The 04:55 addition: "the covert tie reaches a reader in FOUR strings: prominentRelationship's
three (full, tension, phrasing) AND `pressureSentence`. RULED: ruling (5) covers all four: the three by identity, as
built; the pressure sentence, which the record ties to no tie, BY THE WORDS: it is withheld where it names both ends of
a tie the public sanitiser dropped (the current and the stored wording both), listed with its count (the born run found
0 of 240: say so; the reader's hand row must go). Ruling (3) stands for every other pressure sentence."

## The design (PART 12 section 7, first bullet; the seat's, within the ruling)
- The veil's apply sees only the sanitised projection, where a dropped tie looks like a copy whose people were renamed.
  `_gallery_apply_member_overrides(base, dm_full, ...)` (restated by 212, run on every read, marked or not) holds the
  full town: withhold `prominentRelationship` WHOLE where `dm_full.relationships[]` holds a tie flagged `covert: true`
  that is its tie (the same two ends and type, or a copy equal to its text: `_second_homes`' own rule) and the
  projection's `relationships[]` holds no covert tie that is. No new helper if one CASE around the splice does it (if
  you add or re-sign a helper, the rollback drops it by signature). Twin: `galleryPayloadFor` (the raw town; the
  client's projection of the same read), rule for rule.
- The pressure sentence: withheld where it names both ends of such a dropped tie (the position of each end, as rule
  (1)), and by the words against the dropped tie's description and tension and the stored wording
  (`prominentRelationship.full` / `.tension`), the current and the stored wording both.
- WHERE UNSURE, WITHHOLD: if the full town cannot be read, or a tie's ends cannot be resolved, the prominent relationship
  and the pressure sentence go; a read never raises where 211 serves.
- Residual row (for PART 14, not built): a snapshot frozen BEFORE the cure keeps a copy whose tie was dropped at
  freezing (no identity left in the copy); say what it follows.

## The work: ONE commit, red first, in 212 AND the twin, rule for rule
- RED FIRST, at the base's bytes (the archive): a new arm in `tests/security/galleryVeilHandRows.pglite.test.js`
  (VEIL-13 RULING 5: THE COVERT TIE'S FOUR STRINGS), by identity: town-p (COVERTMARK) and the reader's town-g shape
  (gcov1 to gcov3 and its pressure sentence), each of the four strings asserted ABSENT from the server's response
  (gallery, link, import; Reveal DM off) and from the twin's, AND by markers the earlier guards lacked: the ends'
  names in another script, a name of symbols only, a dotted capital I (U+0130), a sharp s (U+00DF). CONTROLS, asserted
  PRESENT: town-pc (an open prominent tie); with Reveal DM on where the sanitiser keeps the covert tie; a pressure
  sentence that names only one end of the dropped tie, or names the ends of an open tie; another person's tie. The
  paths at which server and twin differ on every plant: zero. Say the red count at the base and the green after.
- The library: town-g through `hand/run.sh` and the twin: the gcov strings gone, and town-p/town-pc the same.
- e06 and every other acceptance row unchanged: run-all exit 1 with a07 and d06 the only FAIL rows; the twin 15 of 15.
- BORN, by run, server AND twin, on the same 240 born towns PART 12 section 5 counted (both stored shapes): towns whose
  response tells a covert tie the projection drops, before (expected 2) and after (expected 0), per string; and the
  pressure sentences withheld after (expected 0). If before is not 2, STOP and report what you found.
- COST: the deep and large rows of run-all (their ms before and after), and the largest born town's read, 211 / before
  / after.

## Never
- NEVER change `supabase/migrations/211_server_side_share_veil.sql` or its rollback (sha256 `eface6d0…be0b01`,
  `ce8474ff…49712f`): prove both before you commit.
- NEVER push, never `--no-verify`, never a pull request, never another branch, never `git reset/checkout/stash/clean`
  in either checkout, never the whole test suite (tests in it run git against the real repository), never a hosted
  database, a production credential, `supabase db push` or `migration repair`.
- A guard or pin is re-keyed by identity, never loosened. No adjacent repair: if another pin or check goes red, do not
  touch it: name it with its message. No new key in the settlement record, no new word in the vocabulary file. 212
  stays ONE transaction, create-or-replace, idempotent, after the frozen 211. No model identifier anywhere but the
  trailer below.

## Before you commit
- `GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=3 tests/security/galleryVeilHandRows.pglite.test.js tests/security/gallerySecondHomes.pglite.test.js tests/security/galleryVeilCures.pglite.test.js > /var/tmp/v13/out/r5/guards.txt 2>&1; echo $?`
  (if the mutex refuses the shared tier, run the vitest line through `sh scripts/gate-tail.sh`): each file's counts (at
  the base 50 of 50: 13, 5, 32).
- The acceptance run after your change; town-g, town-p, town-pc through the server and the twin.
- The three gates through gate-tail: `npm run typecheck:domain:strict`, `npm run typecheck:ratchet`, `npx eslint <touched src and test files>`.
- Proof files (verdict lines, not logs) into `docs/chair/2026-11-14/veil-probe-13/out/` (`R5-red-at-2937f9ac9.txt`,
  `R5-green.txt`, `R5-born.txt`); any probe you write into `docs/chair/2026-11-14/veil-probe-13/measure/`. PART 14:
  the bytes table (a row for this commit), a row in section 3 (what moved in 212, in the twin, red and green, the
  counts, the born counts, the cost, the residual row), and strike item 1 of section 4.
- Commit on `veil13` by explicit paths (`git add <paths>`; never `-A`), `git commit -F <file>`. The message: what now
  withholds the four strings; red and green with counts; the born count before and after; the cost; the sha256 of 212
  and of its rollback after the change; the two frozen 211 checksums proved; and it ends with exactly these two lines:
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
  `Claude-Session: https://claude.ai/code/session_01ACmDYY85RhuYUf5cbAgxUq`

## Your final report (at most 300 words)
The commit sha; both sha256 of 212 and its rollback; what moved in each engine (function and the rule in one line
each); red and green counts; the born counts before and after, per string, server and twin; the guards' counts; the
acceptance run's counts; the cost numbers; every pin red and left; anything not done; executed told from plausible.
