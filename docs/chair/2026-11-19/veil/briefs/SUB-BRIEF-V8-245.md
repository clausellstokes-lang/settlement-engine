# SUB-BRIEF: V8-2, V8-4, V8-5 — BY IDENTITY (VEIL-18, list item 1)

You are a builder working FOR the seat VEIL-18 (its assignment: `lane/chair-2026-11-08 ::
docs/chair/2026-11-19/veil/prompts/VEIL-18.txt`). The seat reads your diff line by line, runs the guards itself and
pushes; YOU DO NOT PUSH. A security lane: slips are leaks. Measure first, red first. A failure falls toward
WITHHOLDING, never toward sending.

## Where you are
- Worktree `/home/user/wt/b1`, local branch `v18-b1`, base `1f501779b` (= origin/lane/veil-17-2026-11-19; 212
  `d1b5da91…`). `node_modules` is a hard-linked copy (real directory). Never touch `/home/user/settlement-engine`
  (the seat's checkout) or any other worktree; never run a git command that moves a ref other than your commits on
  `v18-b1`.
- Local PostgreSQL 16 cluster, running: `PGHOST=/var/tmp/rv7 PGUSER=postgres` (if down:
  `su postgres -c "/usr/lib/postgresql/16/bin/pg_ctl -D /var/tmp/v18pg -l /var/tmp/v18log/pg.log -w start"`). Unix
  socket only. Nothing else, ever: no hosted database, no production credential, no `supabase` command. Chains:
  `sh /var/tmp/v18/lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-6/native/chain.sh <db> <211|212> <tree>/supabase/migrations`.
  `pg@8.13.1`: `RV6_PGMOD=/var/tmp/v18/pgmod`.
- The security readers' library (NEVER commit it; read-only): `/var/tmp/v18/lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/`
  (`run-all.sh`, `hand/run.sh`, `twin.probe.jsx`, `jdiff.mjs`, `expect.mjs`), `REVIEW-VEIL-6/` beside it, and
  `/var/tmp/v18/lib/docs/chair/2026-11-14/probes/REVIEW-VEIL-8/` (`hand/town-g.json`, `hand/veil-g.json`, `show.mjs`,
  and the reader's rv8g outputs in `out/`). The finding text is quoted below.
- THE ACCEPTANCE RUN: `cd /var/tmp/v18 && PGHOST=/var/tmp/rv7 RV6_PGMOD=/var/tmp/v18/pgmod sh lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-7/run-all.sh /home/user/wt/b1 <outdir> > <file> 2>&1; echo $?`.
  At the base (the seat ran it): exit 1, a07 and d06 the only FAIL rows (items B and C: not yours), checks 37 / PASS
  35, the twin 15 of 15 equal.
- A RED RUN IS RUN ON THE BASE'S BYTES: `/var/tmp/v18/base` is `git archive 1f501779b` with `node_modules` linked;
  copy your new guard arm into a COPY of it (`cp -a /var/tmp/v18/base /var/tmp/v18/red-b1` first; never edit
  `/var/tmp/v18/base` itself) to show it red there.
- Every run's output to `/var/tmp/v18/out/b1/`; read only the lines you need. Never read a gate through a pipe:
  `sh scripts/gate-tail.sh <command...>`.

## Never
- NEVER change `supabase/migrations/211_server_side_share_veil.sql` or its rollback (sha256
  `eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01`,
  `ce8474ffc251b4c4bd6005d5a409d4a15bd20fef6b507534ef6338d3bd49712f`): prove both before each commit.
- NEVER push, never `--no-verify`, never a pull request, never another branch, never `git reset/checkout/stash/clean`,
  never the whole test suite (tests in it run git against the real repository), never `tests/scripts/`, never a hosted
  database, a production credential, `supabase db push` or `migration repair`.
- A guard or pin is re-keyed by identity, never loosened. No adjacent repair: another pin red is NAMED with its message,
  not touched. No new key in the settlement record, no new word in the vocabulary file. No model identifier anywhere
  but the trailer. Only these files: 212 (`supabase/migrations/212_share_veil_later_cures.sql`), its rollback,
  `src/domain/display/gallerySecondHomes.js` and `src/domain/display/galleryVeil.js` (the twin; prefer
  gallerySecondHomes.js), `tests/security/galleryVeilHandRows.pglite.test.js`, and new files under
  `docs/chair/2026-11-19/veil/` (`measure/`, `out/`). Do NOT edit `src/components/gallery/CurateMode.jsx` or
  `src/domain/display/criminalVeilSwitch.js` (another seat's). Do not add a new reader of `.institutions` outside the
  twin files already registered; do not add a new top-level named numeric constant in `src/` (the tuning walker).

## THE LAWS (binding, the chair's)
A house hidden whole, and anything that gives it away (its name in any spelling, case or script; lists, sentences,
labels, ids, traces; booleans derived from it; its income row; its effects in history notes; covert ties), never
reaches a non-owner read (the gallery read, the party link, the import send, the public page, the map; both stored
shapes; reveal-to-DM on and off). WHERE THE VEIL CANNOT BE SURE, IT WITHHOLDS. THE COST LAW: no read more than twice
the frozen 211 on the reader's 300 KB row, its V8-3 row and the largest born town; a read never fails where 211
serves. RED FIRST: each cure is shown red on its own row before it is cured. Every cure goes into 212 AND the twin,
rule for rule (the server and the twin send the same document: 0 paths).

## Read first (whole)
1. `docs/chair/2026-11-19/veil/COHERENCE-VEIL-HANDBACK-PART18.md` (sections 0, 3, 5) and
   `docs/chair/2026-11-14/COHERENCE-VEIL-HANDBACK-PART17.md` section 0.
2. 212 WHOLE (it is the file you change; `supabase/migrations/212_share_veil_later_cures.sql`, about 160 KB), and the
   twin `src/domain/display/gallerySecondHomes.js` WHOLE.
3. `tests/security/galleryVeilHandRows.pglite.test.js` (its harness and the V8-3 / V8-9 arms: the form of a new arm).

## THE THREE FINDINGS (REVIEW-VEIL-212-8, verbatim) AND THE SEAT'S NOTES (not binding)

V8-2 (LOW): "A defence row is tied to its house by NAME, not by identity (design (i)): a house whose description eye
is shut and whose defence row still carries another name (its birth name) keeps the hidden description there."
Evidence: `hand/town-g.json` (open house "Old Wheel", `catalogId: mill`, its description eye shut by hand), gallery and
link: `defenseProfile.institutions.walls[0]` = `{"name":"Mill","desc":"gdesc1 the cellar under the wheel hides the
ledgers"}`; the row under the current name loses its `desc`. Both engines. "`institutionRename.js` cascades
`defenseProfile.institutions.<category>[].name`, so a rename made in the editor does not leave this; a record renamed by
any other writer does. The identity exists (`catalogId` = the fold of the row's name)."
NOTE: the defence rows find their house by name (`_gallery_veil_sources` 'houses', keyed by card name; applied in
`_gallery_veil_second_homes` at the `defenseProfile.institutions` loop); identity is `catalogId` (`catalogIdForName` =
the catalogue lookup of the trimmed lowered name). The cure by identity: a row belongs to a house when its name is the
house's name OR the row name's catalogue id is the house's `catalogId`; it follows that house's description eye. Where
two houses could own one row (two houses of one catalogue id), the row follows the eye that WITHHOLDS (the veil cannot
be sure).

V8-4 (LOW, for the chair's ruling (1)): "A shown power in master's top-level `factions[]` has no floor: the floors are
`powerStructure.factions[]` only, so the same shown power keeps its name in one list and loses it in the other."
Evidence: `hand/town-g.json` (house "Thieves' guild (powerful)" hidden whole; shown power "Thieves' Guild" in both
lists): `powerStructure.factions[0].faction` = "Thieves' Guild" (kept); `factions[0]` arrives as
`{"desc":…,"power":10}`, its `faction` gone. Both engines.
NOTE: `_gallery_veil_name_floor` floors only `powerStructure.factions[]`. Find ruling (1) (PART 12 section 0 / 0b;
grep `ruling (1)` in `docs/chair/2026-11-14/COHERENCE-VEIL-HANDBACK-PART12.md`) and build to it. The cure by identity:
a top-level `factions[]` entry that IS a shown power (the same power: its `faction`/`name` equals a floored
`powerStructure.factions[]` entry's, in the one fold) takes the same floor; an entry that matches no shown power gets
no floor (it stays swept). Do not floor anything a hidden house's own record could have written beyond what the
powerStructure floor already keeps.

V8-5 (LOW, for a ruling): "A person whose own name holds a hidden house's name (here the name without its qualifier)
is removed whole, and the tie that names them is left pointing at nobody." Evidence: `hand/town-g.json`: the person
"Thieves' Guild Master Orrin" is not in `npcs[]`; `relationships[0]` arrives with `from: "npc.orrin"`, its `npc1Name`
gone, `to`/`npc2Name` = Mira Vane. "A reader infers a removed person and the id spells who." Both engines.
NOTE (the seat's predecessor): the reader's own remedy (keep the person named) would send the hidden house's name
inside the person's name, against the law; the lawful cure by identity is that A TIE WHOSE END THE SWEEP REMOVED LEAVES
WITH IT (the tie is withheld whole, in both stored shapes: `from`/`to` and `npc1Id`/`npc2Id`; and any copy that carries
the tie, such as `prominentRelationship`, follows: read 212's existing tie rules to see which copies follow a tie).
COUNT what this also drops on born towns (the born probe below, default veil and every eye shut): say the number.

## The work: THREE commits, one per finding (V8-2, then V8-4, then V8-5), each red first, in 212 AND the twin
For each finding:
- MEASURE FIRST: run the reader's town-g on the base (both engines) and confirm the finding as written; if it does not
  reproduce as written, STOP that item and report (do not invent a finding).
- RED FIRST at the base's bytes: a new arm of `tests/security/galleryVeilHandRows.pglite.test.js`
  ("V8-2 THE DEFENCE ROW BY IDENTITY", "V8-4 THE TOP-LEVEL POWER'S FLOOR", "V8-5 A TIE WHOSE END IS GONE"), built on
  town-g's shape (copy what you need into the test; the reader's library is never committed): every read (gallery,
  link, import; DM off and on; both stored shapes where the finding reaches them): the cured answer, and the server and
  the twin send the same document (0 paths). Plus a KEEP row each (V8-2: a row of an OPEN house whose description eye
  is open keeps its `desc`; V8-4: an entry that names no shown power stays swept; V8-5: a tie between two people who
  both stand is untouched).
- If a finding CANNOT be cured by identity without breaking the law (it would send what the law withholds), do not
  build it: write it, in plain words, into `docs/chair/2026-11-19/veil/out/WHAT-212-DOES-NOT-CLOSE.md` (one section per
  item: what a reader of a shared page sees, why identity cannot close it, what would) and say so in your report.
- Green per commit: the arm; born unmoved except where the cure is meant to move it
  (`docs/chair/2026-11-14/veil-probe-13/measure/r5-born.probe.jsx`, `R5_N=4`, base chain against tree chain,
  `docs/chair/2026-11-14/veil-probe-16/measure/born-cmp.mjs`: 0 differ, or each differ named and counted as the cure's
  own); the six guard files
  (`GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=2 tests/security/galleryVeilHandRows.pglite.test.js tests/security/gallerySecondHomes.pglite.test.js tests/security/galleryVeilCures.pglite.test.js tests/security/galleryServerVeil.pglite.test.js tests/security/gallerySanitizer.pglite.test.js tests/security/galleryMapMemberCount.pglite.test.js`)
  plus the twin's tests (`tests/domain/display/publicSafe*.test.js`, `tests/components/publicProseVeil*.test.js`,
  `tests/lib/gallery.test.js`); the acceptance run (expected: exit 1, a07 and d06 only, twin 15 of 15). Once, after
  the last commit: the cost (`docs/chair/2026-11-19/veil/measure/v89-cost.sh`'s cost8 rows `5 10000 0 1` and
  `50 500 500 1`, x211 | base | after, medians of 5) — the cost law must hold. At each commit that moves src/:
  `npm run typecheck:domain:strict`, `npm run typecheck:ratchet`, `npx eslint <touched files>`, each through gate-tail.
- 212's header list of cures gains an entry per finding (follow the file's own form); the rollback drops any new
  signature.
- Proof files (verdict lines, not logs) into `docs/chair/2026-11-19/veil/out/` (`V8245-red.txt`, `V8245-green.txt`,
  `V8245-born.txt`, `V8245-cost.txt`).
- Commit on `v18-b1` by explicit paths (`git add <paths>`; never `-A`), `git commit -F <file>`. Each message: the
  finding, the rule by identity, red and green with counts, born, the sha256 of 212 and of its rollback after the
  change, the two frozen 211 checksums proved; ending with exactly these two lines:
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
  `Claude-Session: https://claude.ai/code/session_01FbPLbfLKEi1ew5DHWeD5vU`
  Do NOT edit any hand-back file (the seat writes it). If the pre-commit hook refuses, report it; never bypass it.

## Your final report (at most 300 words)
The three commit shas (or which item went to WHAT-212-DOES-NOT-CLOSE and why); both sha256 of 212 and its rollback
after the last; each rule in plain words; red and green with counts; what V8-5 drops on born towns; cost; guards;
acceptance; the gates; every pin red and left; anything not done; executed told from plausible.
