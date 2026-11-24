# V53-RENUMBER: THE VEIL'S MIGRATIONS 211 -> 212 AND 212 -> 213, PREPARED AS ONE COMMITTED SCRIPT (VEIL-53 unit (4))

THE LAW (START-VEIL-53 (4); RULING V1; VEIL-50's plan (c) "THE NUMBERS", its census): the working line's
`211_close_visitor_reach.sql` (the grants fix) is FINAL. The veil's `211_server_side_share_veil.sql` becomes
`212_server_side_share_veil.sql` and `212_share_veil_later_cures.sql` becomes `213_share_veil_later_cures.sql`, AT THE JOIN, BY
ONE SCRIPT, REVIEWED BY VEIL-50, RUN LAST (five built branches cite the old names: NEVER run it on a lane branch). Your build is
the SCRIPT and its DRY RUN on a scratch copy of the trial join; the trial join itself is never changed.

## YOUR TREES AND FILES
- Read from `/home/user/join53` (the trial join, ba7460c33; read only).
- The script: `/home/user/settlement-engine/docs/chair/2026-11-24/tenth/veil/out/v53/renumber/renumber.mjs` (node, no
  dependency outside node:*), with `renumber-census.txt` (your census) and `RENUMBER.md` (its report) beside it. You do not
  commit; VEIL-53 commits after reading.
- The dry run: a scratch worktree `git -C /home/user/settlement-engine worktree add --detach /var/tmp/v53/renum-dry ba7460c33`,
  `node_modules` symlinked from `/home/user/join53/node_modules`; run the script there; run the gates there; leave the
  worktree for VEIL-53 (do not remove it); NEVER commit in it.

## THE SCRIPT'S SHAPE (each edit asserted; a drift STOPS it before any write)
1. Run from a tree's root; refuses unless `supabase/migrations/211_close_visitor_reach.sql`,
   `211_server_side_share_veil.sql` and `212_share_veil_later_cures.sql` all exist and no `213_*.sql` does.
2. `git mv` the four files: the two migrations and their two `supabase/rollback/*.down.sql` (212 first, then 211).
3. An EXPLICIT LIST of edits: each `{ file, from, to, count }` where `count` is the exact number of occurrences of `from`
   expected in that file before the edit (the script reads every file first, checks EVERY count, and writes only if all hold).
   No regex sweep over the tree, no edit to any file under `docs/chair/` (the record is never rewritten).
4. A `--check` mode that only verifies the counts and prints the plan.

## WHAT THE LIST MUST COVER (VEIL-50's census; verify each by `git grep` on the trial join, find what it missed)
- The two migrations' and the two rollbacks' own headers and their mentions of each other (10 and 27 mentions).
- PATH PINS: `tests/lint/{crimeTypesReaders,recentConflictReaders,rosterChoicePools,rosterChoiceRegistry}.walker.test.js`;
  `tests/security/galleryRosterChoices.pglite.test.js` (`MIGRATION_212_URL`); `tests/security/galleryVeilCures.pglite.test.js`
  (the rollback file names). A comment or a message string that says "212" OF THE VEIL'S FILE becomes "213" where it is a path,
  a function's home a walker reads, or an assertion's text; a pure history comment may stay (list which you leave and why).
- CHAIN BOUNDS, WHICH CHANGE MEANING, NOT ONLY SPELLING (each with its meaning in the census, one line each):
  `tests/security/galleryServerVeil.pglite.test.js` (`buildDb(210)` "before the veil" -> 211, the grants included;
  `files.at(-1)).toMatch(/^210_/)` -> `/^211_/`; any `>= 211` "the veil's files" -> `>= 212`);
  `tests/security/galleryVeilHandRows.pglite.test.js` (`<= 211` "through the frozen veil" -> `<= 212`; `db211` and its "211
  alone" message strings: rename to the new number where the assertion text pins them, consistently);
  `tests/security/galleryVeilCures.pglite.test.js` (AT210 / AT211 controls; the rollback chain: 001..213, then 213's down = a
  chain stopped at 212, then 212's down = stopped at 211, the GRANTS' head). Find every other test that bounds the chain by a
  number between 209 and 213 (`buildDb(`, `upTo`, `migrationFiles(`, `Number(n.slice(0, 3))`, `startsWith('21`).
- The rehearsal: `scripts/ops/migrationRehearsalCore.mjs` (`MIGRATION_TRAIN_REPO_HEAD`, the wave entries' from/to, the
  purposes' rollback names, `expectedObjects`) and `tests/ops/migrationRehearsal.test.js` (repoHead, pendingCount, the ranges,
  the wave list). NOTE: the trial join resolved these two files AT THE LINE'S SIDE, so the veil's wave entries are ABSENT
  there: read the veil's own side (`git -C /home/user/join53 show 9e6547f0f:<path>`) and the line's
  (`git -C /home/user/join53 show f9531eb3a:<path>`) and make the script ADD the veil's waves as 212 and 213 after the
  grants' 211 (the counts the test pins follow).
- The three docs' head lines: `ARCHITECTURE.md`, `docs/CURRENT_STATE.md`, `docs/DEPLOY.md` (resolved at the line's side too:
  the veil's paragraphs are absent; restore them from 9e6547f0f's side, renumbered, after the grants' paragraph).
- REGISTERS BY THEIR DOORS (the script does NOT hand-edit them; it names the door to run after): 
  `tests/lint/.source-citation-baseline.json` (citations into the migration files), `tests/lint/.tuning-register.json` (a cause
  naming "migration 212's client twin"), the lighting census baseline if titles move. For each: its door's command, run in the
  dry run after the script; say what it re-took.
- Prose citations in `src/` comments ("212's", "211 ::": `rosterChoiceRegistry.js`, `galleryRosterChoices.js`,
  `gallerySecondHomes.js`, `galleryVeil.js`, `galleryWithholdAlways.js`, `gallery.js`, `pageRederive.js`): re-cited ONLY where a
  walker reads them (find which walkers read them: grep `tests/lint` for the patterns), else left as history; say which.
- `supabase/applied-head.json` is the owner's: NOT touched.

## THE DRY RUN AND ITS REDS
In `/var/tmp/v53/renum-dry`: `node renumber.mjs --check`, then the run, then the doors; then, through
`sh scripts/gate-mutex.sh --run -- ...` (from the dry worktree; never through a pipe; each to a log under `/var/tmp/v53/renum/`):
`tests/lint` whole; `tests/security` whole (`--maxWorkers=2`); `tests/ops` whole; the four lint walkers and the four security
files above by name. KNOWN, which the script MUST cure: `tests/lint/testRatchet.test.js` "an OWNER-GATED row leaves the census only against a NAMED
GRANT" reds at the trial join because `docs/DEPLOY.md` (resolved at the line's side) names 211 while the chain's head on disk is
`212_share_veil_later_cures.sql`; after the script the head is `213_share_veil_later_cures.sql` and DEPLOY.md must name it
(`/var/tmp/v53/grants/lintfails.txt` holds the 66 `tests/lint` reds of 639d98124 = the trial join's).
Compare with the trial join's own reds (`tests/lint` and `tests/security` on ba7460c33: run those two
there too if no log exists under `/var/tmp/v53/`; the known: `traditionDescriptionSharedPage` TRAD-2 x3, `rosterChoiceInversion`
VR26 x2, `recentConflictReaders`). EVERY RED THE SCRIPT LEAVES, BY NAME, with its cause; a red the script can cure by one more
listed edit: add the edit and re-run; a red that needs a ruling: list it.

## LAWS
No push, no commit, no pull request, no network, no hosted database, never the `supabase` command. Heavy runs one at a time
through the mutex. A permission refusal: stop that line, report it. Cite code by symbol.

## YOUR FINAL MESSAGE (at most 200 words)
The script's path and its edit count; the dry run's gates (counts) against the trial join's; the reds it leaves, by name, each
with "cured by an added edit" or "needs a ruling: <why>"; the registers re-taken by their doors.
