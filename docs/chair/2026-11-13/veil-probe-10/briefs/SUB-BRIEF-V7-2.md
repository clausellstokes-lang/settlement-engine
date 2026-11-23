# SUB-BRIEF: a second home follows its source's eye BY IDENTITY (V7-2)

You are a builder working FOR the seat VEIL-10 of the settlement-engine integration program, in the seat's own scratch
worktree. The seat (your parent) reviews your commit and pushes it; YOU DO NOT PUSH. This is a security lane: when an
owner shares a town, whatever the owner hid must not reach a reader, in the page OR in the data the server sends.
Slips here are leaks. Measure first, red first.

## Where you are
- Worktree `/var/tmp/v10/wt`, local branch `veil10`; your base is its current tip (`git log --oneline -3`; the tip is
  the name-search commit of the builder before you). `npm ci` is done. Do not touch `/home/user/settlement-engine`.
- Local PostgreSQL 16 cluster, running: `PGHOST=/var/tmp/rv7 PGUSER=postgres` (if down:
  `su postgres -c "/usr/lib/postgresql/16/bin/pg_ctl -D /var/tmp/v10pg -l /var/tmp/v10pg.log -w start"`).
- The security reader's plant library (NEVER commit it): `/var/tmp/v10/lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/`.
  THE ACCEPTANCE RUN: `cd /var/tmp/v10 && RV6_PGMOD=/var/tmp/v10/pgmod sh lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/run-all.sh /var/tmp/v10/wt <outdir> > <file> 2>&1; echo $?`.
- Every run's output goes to a file under `/var/tmp/v10/out/`; read only the lines you need.

## Read first (whole, in this order)
1. `/tmp/claude-0/-home-user-settlement-engine/afdf28cd-ad8c-5a20-be1d-b538cfcaba82/scratchpad/BRIEF.md` (the seat's brief; `fold -s -w 220`):
   THE DESIGN, RULED, point (i), and THE LAWS OF THIS LANE bind you.
2. `docs/chair/2026-11-13/COHERENCE-VEIL-HANDBACK-PART11.md` (what is done; you add a row).
3. `/tmp/claude-0/-home-user-settlement-engine/afdf28cd-ad8c-5a20-be1d-b538cfcaba82/scratchpad/chair/REVIEW.folded`: section 0's row V7-2.
4. `supabase/migrations/212_share_veil_later_cures.sql` WHOLE: `_gallery_veil_card` (the impression arm),
   `_gallery_veil_pieces`, `_embeds`, `_sources`, `_tie_pieces`, `_second_homes` (its first part: the ties, the siege
   narrative, the legacy annotation), `_gallery_veil_apply`. In the FROZEN 211: `_gallery_veil_cards`, `_gallery_veil_card_id`.
5. `src/domain/display/gallerySecondHomes.js` WHOLE and `src/domain/display/galleryVeil.js :: applyVeil`.
6. THE COMPOSERS, to learn what each second home is BUILT FROM (find them by search; read each whole function):
   the legacy annotation (`legacyGenerator.js :: annotationBody` and its caller), `history.siegeNarrative`,
   `prominentRelationship` (`full`, `tension`, `phrasing`) and `pressureSentence` (written inside `assembleSettlement`),
   a person's `presentation.impression`. Also whether the product's editor recomposes any of them when its source is
   edited (the reader did not trace it).
7. `tests/security/galleryVeilHandRows.pglite.test.js` WHOLE (the guard you extend); the library's `hand/town-e.json`,
   `hand/veil-e.json` and the `e01` to `e07` rows of `hand/expected.json`.

## The ruling you build (the chair's record 418, restated in the seat's brief)
The text cures match a hidden sentence word for word, so a source edited after the birth leaves its birth wording in
the second home. RULED: A SECOND HOME FOLLOWS ITS SOURCE'S EYE BY IDENTITY, NEVER BY MATCHING TEXT, wherever the record
gives an identity (the annotation by its entry's event; the siege narrative with any shut tension it tells of; a tie's
copies by the tie; the impression by its person). Where ONLY THE WORDS tie a copy to its source, the row is LISTED with
its count and matched on the current and the stored wording both (keep the existing embed test as that fallback, in
both directions: a piece of the source inside the copy, or a piece of the copy inside the source).

## The work: ONE commit, red first, in migration 212 AND the client's twin, rule for rule
For each of the five homes: say what the composer builds it from; give it the identity rule (the home is withheld
WHOLE when the eye of a source it is built from is shut, whatever the words now say); where the record gives no
identity say so and keep the words. Do not touch the name search, the derived lists, the flags, the income rows or the
trace (other commits). MEASURE what the identity rule costs the page: on the guard's born towns
(`tests/security/gallerySecondHomes.pglite.test.js :: TOWNS`, both stored shapes), with the DEFAULT veil and with every
eye shut, count each home sent before and after your change; a home that is withheld where its source is OPEN is a
fault; a home newly withheld where its source is shut but its words did not embed it is the rule's price: count it and
name it in PART 11 for the owner's veto.

RED FIRST: extend `tests/security/galleryVeilHandRows.pglite.test.js` with arms of your OWN plants (not copies of the
reader's town): each of the five homes with its hidden source (a) as born, (b) amended by appending, (c) amended by a
prefix, (d) rewritten wholly, (e) lower-cased and upper-cased; AND the controls that must STILL ARRIVE: each home where
its source's eye is open (another event's annotation, another tie, another person's impression, a narrative with no
shut tension), the events' names, the people, the tie's ends. Server (gallery, link, import, Reveal DM off and on) and
the twin as a read of its own; the paths at which server and twin differ: zero. Run red at your base's bytes (keep the
output), green after.

ALSO: the rollback `supabase/rollback/212_share_veil_later_cures.down.sql` follows 212's helper set (drops BY
SIGNATURE) if you add, remove or re-sign a helper. 212 stays ONE transaction, create-or-replace, idempotent, after the
frozen 211; helpers `immutable`, written `public.<name>`, no dynamic SQL from data; the revoke loop last.

## Never
- NEVER change `supabase/migrations/211_server_side_share_veil.sql` or its rollback (sha256 `eface6d0…be0b01`,
  `ce8474ff…49712f`): prove both before you commit.
- NEVER push, never `--no-verify`, never a pull request, never another branch, never a hosted database, a production
  credential, `supabase db push` or `migration repair`. Never read a gate through a pipe: `sh scripts/gate-tail.sh <command>`.
- No adjacent repair. No model identifier anywhere but the trailer below. If another pin goes red because of your
  change, do not touch it: name it with its message.

## Before you commit
- `npx vitest run tests/security/galleryVeilHandRows.pglite.test.js tests/security/gallerySecondHomes.pglite.test.js tests/security/galleryVeilCures.pglite.test.js --maxWorkers=3 > <file> 2>&1` (about ten minutes): say each file's counts.
- The acceptance run: e01 to e07 green; say every check still red and why (other commits own them).
- The three gates through gate-tail: `npm run typecheck:domain:strict`, `npm run typecheck:ratchet`, `npx eslint <touched files>`.
- Proof files (verdict lines, not logs) into `docs/chair/2026-11-13/veil-probe-10/out/`; PART 11: the bytes table, a row
  in section 3 per home (its source, its rule, its count), the rows where only words tie.
- Commit on `veil10` by explicit paths, `git commit -F <file>`; the message states red and green, the counts, both
  sha256 of 212 and its rollback, and ends with exactly:
  `Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>`
  `Claude-Session: https://claude.ai/code/session_01ACmDYWqpMCGn19T8PYUa5t`

## Your final report (at most 300 words)
The commit sha; both sha256; per home: the identity, the count before and after; the acceptance run's counts; the
guard's counts; every pin red and left; anything not done; executed told from plausible.
