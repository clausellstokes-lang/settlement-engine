# SUB-BRIEF: THE BOUNDARY INVERTED (V8-1, HIGH)

You are a builder working FOR the seat VEIL-12 of the settlement-engine integration program, in the seat's own scratch
worktree. The seat (your parent) reads your diff line by line, runs the guards itself and pushes; YOU DO NOT PUSH. This
is a security lane: when an owner shares a town, whatever the owner hid must not reach a reader, in the page OR in the
data the server sends. Slips here are leaks. Measure first, red first.

## Where you are
- Worktree `/home/user/veil12-wt`, local branch `veil12`, base `ac0bb20a4` (the lane's tip). `npm ci` is done. Never
  touch `/home/user/settlement-engine` (the main checkout) or any other worktree; never run git commands that move
  refs other than your one commit on `veil12`.
- Local PostgreSQL 16 cluster, running: `PGHOST=/var/tmp/rv7 PGUSER=postgres` (if down:
  `su postgres -c "/usr/lib/postgresql/16/bin/pg_ctl -D /var/tmp/v12pg -l /var/tmp/v12pg.log -w start"`). A unix socket
  only. Nothing else, ever: no hosted database, no production credential, no `supabase` command.
- The security reader's plant library (NEVER commit it; read-only): `/var/tmp/v12/lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/`
  (`run-all.sh`, `hand/run.sh`, `twin.probe.jsx`, `jdiff.mjs`, `expect.mjs`), `REVIEW-VEIL-6/` beside it (`native/chain.sh`,
  `vitest.config.mjs`), and the reader's newer plants `/var/tmp/v12/lib/docs/chair/2026-11-14/probes/REVIEW-VEIL-8/`
  (`hand/town-f.json`, `hand/veil-f.json`, `show.mjs`, `README.md`).
- THE ACCEPTANCE RUN: `cd /var/tmp/v12 && RV6_PGMOD=/var/tmp/v12/pgmod sh lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/run-all.sh /home/user/veil12-wt <outdir> > <file> 2>&1; echo $?`
  (about 20 s). At the base: `/var/tmp/v12/out/run-all-at-ac0bb20a4.txt`: exit 1, a07 and d06 red (items B and C, other
  commits own them), the twin equal on 15 of 15.
- THE READER'S V8-1 ROWS: after run-all has built chain `x212` from the worktree, store and read town-f by
  `sh lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/hand/run.sh x212 lib/docs/chair/2026-11-14/probes/REVIEW-VEIL-8/hand/town-f.json lib/docs/chair/2026-11-14/probes/REVIEW-VEIL-8/hand/veil-f.json rv8f <outdir>`,
  the twin by the same command line run-all.sh uses with `RV7_LIKE='rv8f%'`, compared by `jdiff.mjs`, inspected by
  `node lib/docs/chair/2026-11-14/probes/REVIEW-VEIL-8/show.mjs <response.json> '<regex>'`.
- A RED RUN IS RUN ON THE BASE'S BYTES, never on the tree you are editing: `mkdir /var/tmp/v12/red-ac0 && git -C /home/user/veil12-wt archive ac0bb20a4 | tar -x -C /var/tmp/v12/red-ac0`, `node_modules` symlinked in.
- Every run's output goes to a file under `/var/tmp/v12/out/v81/`; read only the lines you need. Never read a gate
  through a pipe: `sh scripts/gate-tail.sh <command...>` prints the tail and exits with the gate's own code.

## Read first (whole, in this order)
1. `docs/chair/2026-11-14/COHERENCE-VEIL-HANDBACK-PART12.md`: section 0b (the 04:42 ruling, below in full) and section
   8, item 1 (where the boundary bites).
2. The reader's row: `git -C /home/user/settlement-engine show 72a3bb24f:docs/chair/2026-11-14/REVIEW-VEIL-212-8-2026-11-14.md | sed -n '22p;32,41p'`.
3. `docs/chair/2026-11-14/COHERENCE-VEIL-HANDBACK-PART13.md` (the seat's file; section 0a, call 1, is the seat's reading
   of which letters block: build to it).
4. `supabase/migrations/212_share_veil_later_cures.sql`: section 4c's header and every helper from
   `_gallery_veil_fold` to `_gallery_veil_name_sweep` (about lines 256 to 727) WHOLE, the case table read as data; and
   every other use of the search's `p`, `blank` or `raw` (grep the file).
5. `src/domain/display/gallerySecondHomes.js`: THE NAME SEARCH (about lines 135 to 512: `NAME_SEP`, `NAME_BOUND`,
   `BOUND_END`, `namePrep`, `nameFold`, `madeReady`, `needleOf`, `lettersOf`, `buildNameSearch` and the sweep) WHOLE.
6. `tests/security/galleryVeilHandRows.pglite.test.js` WHOLE (V7-1 EVERY SCRIPT, V7-4/V7-9 THE FORMS, V7-7, V7-1 THE
   TABLES, and VEIL-11 THE WORDS' FOLD IS ONE, the model for an every-code-point equality arm); in
   `tests/security/gallerySecondHomes.pglite.test.js` every use of `NAME_BOUND` or `buildNameSearch`.

## The ruling you build (the chair, 2026-11-14 04:42 UTC, whole)
THE SECURITY READER'S FIRST HIGH, V8-1, EXECUTED at a12ccfee3 in both engines: the name search asks a word boundary as
"the string's start or end, or a character of the explicit separator set"; any OTHER neighbour blocks the match, so a
hidden house's exact name is SENT when it adjoins a Hangul particle, kana, Han, Thai, an arrow, a star, an emoji, the
trade-mark sign, U+02BC, or Armenian punctuation (U+0589 and U+055D lie inside a "letters" range). Its plants: town-f and
veil-f: `primaryExports` and `situationDesc` keep "Black market에서 샀다", "これはBlack marketです", "去Black market买东西",
"Docks→Black market→Warehouse", "★Black market★", "Նա գնաց Գողերի գիլդիա։", "Гильдия теней에서". RULED: THE BOUNDARY IS
INVERTED, in 212 and in the twin: a name matches UNLESS the neighbour on that side is a letter or a digit of a script
that separates its words by spaces; every other neighbour is a boundary (any separator, symbol, mark or punctuation of
any script; any letter of an unspaced script; Hangul, whose particles join their noun). The class of blocking letters
is ONE table, the same in both engines, proved equal over every code point as the fold was; no punctuation or modifier
apostrophe sits inside it. Red first on the reader's rows; its controls (space, 's, plural, squeezed) and V7-7 (an
open house's longer name and a shown power's name stay) remain green; the cost law re-measured; the new checksums in
the commit.

## The design (the seat's, within the ruling)
- THE BLOCKING TABLE: the letters and digits (Unicode General Category L* and N*) of the scripts Latin, Greek, Cyrillic,
  Armenian and Georgian, and the ASCII digits, over the code points a prepared text can hold (a code point the
  preparation rewrites, by NFKD or the skew map, or removes, U+0300 to U+036F, is no member; U+212A, the cut-out mark,
  must stay OUT so that a cut-out open name is a boundary, never a block). Generate it ONCE by a script you commit
  beside the lane's other generators (`docs/chair/2026-11-14/veil-probe-12/gen-name-bound.mjs`, stating its Unicode
  version and the node version it ran on); write it as ranges, the SAME literal character for character in 212 (one
  helper or the restated constant) and the twin (`NAME_BOUND`). No punctuation (P*), symbol (S*), mark (M*),
  separator (Z*), control, modifier letter of the Common script (U+02BC) or format character sits inside it. Mind the
  astral code points: the twin's regexes that use the table need the `u` flag; PostgreSQL takes `\U000xxxxx`.
- THE BOUNDARY, BOTH SIDES, BOTH ENGINES: where an end of a name is itself in the table (`lb`/`rb`, judged by the same
  table), the neighbour on that side must not be in the table; the start and the end of the text are boundaries. Where
  an end is not in the table (a Han, Hangul or symbol end) no boundary is asked, as now. Ask it WITHOUT CONSUMING the
  neighbour where both engines allow it (a negative lookbehind and lookahead: PostgreSQL's ARE has both; a lookaround
  may hold no capturing group), so two hits that share one neighbour are both found; then follow every use of `p` and
  of `blank` (the whole-text pass and its marks in `_gallery_veil_name_hits`, the cut-out of open names in
  `_gallery_veil_name_ready` and the twin's `cuts`, whatever re-emits a captured boundary) and make each right for the
  new form. If a lookbehind cannot be had in one engine, say so with the error and STOP: do not invent another shape.
- The English plural `(?:e?s)?` stays where it is (before the right boundary). "a Black marketeer" stays (an `e` after
  the name blocks). Nothing else about the search moves: not the fold, the preparation, the case classes, the needle,
  the floors, the walk, the bound, the cut-out's longest-first order. V8-3 (one pass) and V8-9 (bounded batches) are
  the next commits: do not start them.

## The work: ONE commit, red first, in migration 212 AND the client's twin, rule for rule
RED FIRST, at the base's bytes (keep the outputs): (a) the reader's town-f through `hand/run.sh` and the twin: every
row the reader lists as kept is red; (b) YOUR OWN plants, with markers the earlier guards lacked, added to
`tests/security/galleryVeilHandRows.pglite.test.js` as a new arm (server: gallery, link and import, Reveal DM off and
on; the twin as a read of its own; the paths at which server and twin differ: zero): a hidden name in Latin, in
Cyrillic, in Greek with a final sigma, with a dotted capital I, with a sharp s, of symbols only, and in Han, each beside
neighbours the reader did not plant: a Devanagari, an Arabic and a Hebrew letter, a Khmer or Lao letter, a Tibetan tsheg,
the middle dot U+00B7, a currency sign, a mathematical operator, a box-drawing character, a combining mark outside U+0300
to U+036F (U+0483, U+20DD), a variation selector U+FE0F, an emoji with a zero-width joiner, a digit of another script
(Arabic-Indic, Devanagari), the Greek question mark and ano teleia, U+055A to U+055F, U+058A, U+10FB, U+02BB, U+02BC; on
the left and on the right; two hits sharing one neighbour; a hidden name glued to an open name's cut-out. THE CONTROLS
THAT MUST STILL ARRIVE, in the same arm: a name inside a longer word of a spaced alphabet on either side (Latin, Greek,
Cyrillic, Armenian, Georgian letters, upper and lower case, and an ASCII digit), "a Black marketeer", an open house
whose longer name holds the hidden one, a shown power named as a hidden house, the town's own name. (c) A SECOND NEW
ARM, THE TABLE IS ONE: for every code point of every plane (or, if that is too slow in pglite, of the basic plane and
every astral code point of the five scripts and their neighbours' blocks, said so), the server's membership in the
blocking table equals the twin's; and for every code point c of the basic plane, the hit of a hidden name with c on its
left and on its right is the same in both engines (batched into few calls). Re-key the V7-1 THE TABLES arm by identity
if it pins the old `NAME_BOUND` or the old pattern text: the new expectation named, never loosened.

GREEN after: the reader's town-f rows withheld by every server read and by the twin, its controls as the reader says;
your arms green; the three guards (`galleryVeilHandRows`, `gallerySecondHomes`, `galleryVeilCures`) green with their born
counts unmoved, or every moved count named with the town and the string (a born string newly withheld is the rule's
price: count it and name it, never hide it); the acceptance run: only a07 and d06 red, the twin 15 of 15.

THE COST, re-measured (state each as 211 / before / after, ms): the acceptance run's deep and large rows, and the
reader's `hand/cost8.sql` (read its header for the variables) at its 500 + 500 row with 50 houses and its 2,000 +
2,000 row with 200 houses (do not run the 10,000 rows: V8-3 owns them).

ALSO: the rollback `supabase/rollback/212_share_veil_later_cures.down.sql` follows 212's helper set (drops BY SIGNATURE)
if you add, remove or re-sign a helper. 212 stays ONE transaction, create-or-replace, idempotent, after the frozen 211;
helpers `immutable`, written `public.<name>`, no dynamic SQL from data; the revoke loop last. Section 4c's header comment
is restated to say what now stands (a boundary is any neighbour not in the table), in the lane's plain style.

## Never
- NEVER change `supabase/migrations/211_server_side_share_veil.sql` or its rollback (sha256 `eface6d0…be0b01`,
  `ce8474ff…49712f`): prove both before you commit.
- NEVER push, never `--no-verify`, never a pull request, never another branch, never `git reset/checkout/stash/clean`
  in either checkout, never a hosted database, a production credential, `supabase db push` or `migration repair`.
- No adjacent repair: if another pin or check goes red, do not touch it: name it with its message. No new key in the
  settlement record, no new word in the vocabulary file. No model identifier anywhere but the trailer below.

## Before you commit
- `GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=3 tests/security/galleryVeilHandRows.pglite.test.js tests/security/gallerySecondHomes.pglite.test.js tests/security/galleryVeilCures.pglite.test.js > /var/tmp/v12/out/v81/guards.txt 2>&1; echo $?`
  (if the mutex script refuses the shared tier, run the same vitest line through `sh scripts/gate-tail.sh`): each file's counts.
- The acceptance run after your change, and town-f through the server and the twin.
- The three gates through gate-tail: `npm run typecheck:domain:strict`, `npm run typecheck:ratchet`, `npx eslint <touched src and test files>`.
- Proof files (verdict lines, not logs) into `docs/chair/2026-11-14/veil-probe-12/out/` (`V8-1-red-at-ac0bb20a4.txt`,
  `V8-1-green.txt`, `V8-1-cost.txt`); PART 13: the bytes table (a row for this commit), a row in section 3 (what moved in
  212, in the twin, red and green, the counts, the cost), and strike item 1 of section 4.
- Commit on `veil12` by explicit paths (`git add <paths>`; never `-A`), `git commit -F <file>`. The message: what the
  boundary now is; red and green with counts; the cost; the sha256 of 212 and of its rollback after the change; the two
  frozen 211 checksums proved; and it ends with exactly these two lines:
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
  `Claude-Session: https://claude.ai/code/session_01ACmDYZAhTjYpK9Ymx63SPw`

## Your final report (at most 300 words)
The commit sha; both sha256; the table (its size in ranges and code points; what left it compared with the old
`bnd`); the red and green counts on the reader's rows and on yours; the guards' counts; the acceptance run's counts;
the cost rows; every pin red and left; anything not done; executed told from plausible.
