# BRIEF — GRANTS-1 PART D (settlements and saved_maps: the columns the server owns) for ONE builder

You build part D of migration 211 on the branch `lane/grants-1-2026-11-24-d-wip`, cut from the seat's tip of
`lane/grants-1-2026-11-24` AFTER part C has merged there (`git checkout -b lane/grants-1-2026-11-24-d-wip`). You commit there, by
explicit paths, and you NEVER push. You apply nothing to any database; every database is PGlite in a test. Never
`npm run check`, never `--no-verify`, never the `supabase` command. Read this brief, then ONLY the files it names.

## The law (the chair's RULING-G1 §5, §6(iii))
- A guard trigger in 171's idiom, on a function that is SECURITY INVOKER (a definer trigger function would read its owner as
  `current_user`). It refuses a change by `anon` or `authenticated` to the columns the server owns. A row a user inserts carries their
  defaults. The definer RPCs that write those columns (view counts, import counts, bans, soft-deletes, the downgrade retention window)
  still write: the test proves each with one call.
- The columns (the seat grepped both trees; no page writes any of them directly):
  settlements: moderation_banned_at, moderation_banned_by, moderation_ban_reason, admin_deleted_at, is_featured, featured_order,
  is_curated, curated_order, view_count, retention_expires_at, inactive_reason, inactive_since, reactivated_free_at.
  saved_maps: moderation_banned_at, moderation_banned_by, moderation_ban_reason, admin_deleted_at, is_featured, featured_order,
  view_count, import_count, retention_expires_at, inactive_reason, inactive_since.
  Kept OUT and listed (the seat's `GRANTS-1-APART.md` §3): is_public, public_slug, published_at, unlisted_slug, visibility, content
  and gallery_* columns.

## Files you may change (and no other)
1. `docs/chair/2026-11-24/tenth/grants/measure/211/partD.sql`: copy `measure/211/partD.draft.sql` (the seat wrote it). Change it only
   where it fails to run, and say each change in your report. Compose with `node docs/chair/2026-11-24/tenth/grants/measure/compose-211.mjs`
   (order: header, A, C, D, B; part B is already in place and stays LAST). In `measure/211/header.sql` add one `WHAT` line for PART D and
   its undo lines under `@rollback`, then re-compose. `git diff` of 211 must show only part D's lines and the header's two additions.
2. `tests/security/serverOwnedColumns.pglite.test.js`: from the seat's draft `briefs/serverOwnedColumns.pglite.test.js.draft`
   (rename; keep its classes and its cases; fix only what fails to run: seeds above all). RED before part D is composed
   (`partD-red.log`), GREEN after (`partD-green.log`).
3. `tests/security/functionGrantClasses.js`: regenerate with
   `EXTRA_TRIGGERS='_guard_server_owned_columns()' node docs/chair/2026-11-24/tenth/grants/measure/register.mjs`, so the new trigger
   function has its row (class TRIGGER). Then `npx vitest run tests/security/hostedDefaultGrants.pglite.test.js` must be green.
4. `scripts/mutation-coverage-manifest.json`: one row for the new test, `{"kind":"rationale","ref":"pglite-executed"}`, after the
   profileColumnGrants row (keep the `JSON.stringify(m, null, 2) + '\n'` form).
5. `scripts/ops/migrationRehearsalCore.mjs` and `tests/ops/migrationRehearsal.test.js`: ONLY if the 211 wave must now name the trigger
   function in `expectedObjects` (it need not; leave both alone if `npx vitest run tests/ops/migrationRehearsal.test.js` is green).

## Proof, each to a log under `docs/chair/2026-11-24/tenth/grants/measure/out/` (force-add: `*.log` is git-ignored)
- The red and green above.
- ONE run: `npx vitest run tests/security/hostedDefaultGrants.pglite.test.js tests/security/profileColumnGrants.pglite.test.js tests/security/serverOwnedColumns.pglite.test.js tests/ops/migrationRehearsal.test.js tests/lint/migrationSearchPathPin.test.js tests/lint/mutationCoverageManifest.test.js tests/security/migrationSequenceAll.pglite.test.js` (`partD-gates.log`).
- `tests/lint` whole through the mutex: `sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint > <log> 2>&1; echo "exit $?" >> <log>`
  (`partD-lint.log`). Read failures BY NAME with `grep`/`tail`; a red that is not yours is listed, never "fixed".

## One commit
`grants-1: migration 211 part D (the columns of settlements and saved_maps the server owns) and its column test`, ending with
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_019yED1QhZzoXHC1uiNEomy3`.

## The lighting census (a new test file moves its file count)
After your commits, on a CLEAN tree (commit first), re-take the census by its own door and commit its baseline alone:
`LIGHTING_CENSUS_REFREEZE='GRANTS-1-<C or D>' LIGHTING_CENSUS_NOTE='<one new pglite test file>' npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js`
(it exits non-zero BY DESIGN; then run the walker plainly and see it green). Commit `tests/lint/.lighting-census-baseline.json` alone.
`tests/security/pgliteHookTimeoutRatchet.test.js` already lists `bootHostedChain`; a new test that boots through it needs nothing there.

## Your report (at most 200 words)
The commit hash; red and green by test name and count; every change to the seat's drafts; the `tests/lint` count and its reds by name.
