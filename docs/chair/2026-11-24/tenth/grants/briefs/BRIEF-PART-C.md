# BRIEF — GRANTS-1 PART C (profiles: an ALLOWED list of column grants) for ONE builder

You build part C of migration 211 on the branch `lane/grants-1-2026-11-24-c-wip`, cut from the seat's tip of
`lane/grants-1-2026-11-24` (create it with `git checkout -b lane/grants-1-2026-11-24-c-wip`). You commit there, by
explicit paths, and you NEVER push. You apply nothing to any database; every database is PGlite in a test. Never
`npm run check`, never `--no-verify`, never the `supabase` command. Read this brief, then ONLY the files it names.

## The law (the chair's RULING-G1 §4, §6(ii), §9)
- `revoke update on public.profiles from anon, authenticated;` then
  `grant update (avatar_url, email_notifications, model_preference, public_identity_opt_in) on public.profiles to authenticated;`
  These are exactly the columns a DIRECT client update writes in both trees (the seat's grep: `src/components/account/AccountIdentitySection.jsx`,
  `src/lib/auth.js :: supabaseUpdateProfilePreferences`). `display_name` is NOT on the list. The 087 policy is NOT restated.
- THE CLIENT'S ROUTE ROUND THE CIVILITY GUARD is removed, in ITS OWN COMMIT, RED FIRST:
  `src/lib/auth.js :: supabaseUpdateDisplayName` today writes `display_name` straight to the table when the RPC
  `update_display_name` errors (a civility refusal included). After: an RPC error is THROWN to the caller, never routed round
  (the user_metadata mirror runs only after an RPC success). Its test is `tests/security/profile_escalation.test.js`
  (`describe('updateDisplayName client path')`): FIRST change that test to say "an RPC refusal is shown and NO table write happens"
  (and remove the cases that pin the fallback), run it and see it RED against the current code, THEN change auth.js, see it GREEN.

## Files you may change (and no other)
1. `docs/chair/2026-11-24/tenth/grants/measure/211/partC.sql`: copy `measure/211/partC.draft.sql` to it UNCHANGED (the seat wrote it), then
   `node docs/chair/2026-11-24/tenth/grants/measure/compose-211.mjs` composes `supabase/migrations/211_close_visitor_reach.sql`.
   CAUTION: the compose script also picks up `partB.sql` if present. RENAME `measure/211/partB.sql` to `measure/211/partB.held.sql` before
   composing and back after; part C's commit must change only part C's lines in 211 (check `git diff` of 211: header untouched, part A
   untouched, part C appended).
   In `measure/211/header.sql` add, under `WHAT`, one line for PART C, and under `@rollback`, the undo line from partC.draft.sql's comment
   (`grant update on public.profiles to authenticated;`), then re-compose.
2. `tests/security/profileColumnGrants.pglite.test.js`: from the seat's draft `briefs/profileColumnGrants.pglite.test.js.draft`
   (rename; keep its classes; fix only what fails to run). It must be seen RED with 211 lacking part C (run it BEFORE composing) and GREEN after.
3. `scripts/mutation-coverage-manifest.json`: one row for the new test file, `{"kind":"rationale","ref":"pglite-executed"}`, inserted right
   after `tests/security/hostedDefaultGrants.pglite.test.js` (keep the file's `JSON.stringify(m, null, 2) + '\n'` form).
4. `src/lib/auth.js` and `tests/security/profile_escalation.test.js`: the client commit above.
5. `tests/ops/migrationRehearsal.test.js` / `scripts/ops/migrationRehearsalCore.mjs`: ONLY if the 211 wave's purpose or pinned rollback note must say part C
   (run `npx vitest run tests/ops/migrationRehearsal.test.js`; if green, leave both alone).

## Proof you run, each to a log under `docs/chair/2026-11-24/tenth/grants/measure/out/` (force-add logs: `*.log` is git-ignored)
- `npx vitest run tests/security/profileColumnGrants.pglite.test.js` RED before compose (`partC-red.log`), GREEN after (`partC-green.log`).
- `npx vitest run tests/security/profile_escalation.test.js` RED after the test change and before the auth.js change (`partC-client-red.log`), GREEN after (`partC-client-green.log`).
- Then ONE run: `npx vitest run tests/security/hostedDefaultGrants.pglite.test.js tests/security/profileEscalation.pglite.test.js tests/ops/migrationRehearsal.test.js tests/docs/migrationRollbackDiscipline.test.js tests/lint/mutationCoverageManifest.test.js tests/security/migrationSequenceAll.pglite.test.js` (`partC-gates.log`).
- Then `tests/lint` whole: `sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint > <log> 2>&1; echo "exit $?" >> <log>` (`partC-lint.log`). Read
  failures BY NAME; a red that is not yours is listed, never "fixed". Read logs with `tail` or `grep`, never whole.
- Never read a gate through a pipe for its exit status.

## Two commits, in this order
1. `grants-1: part C client: a display_name refusal is shown, never routed round the civility guard` (auth.js + profile_escalation.test.js; red/green logs).
2. `grants-1: migration 211 part C (profiles by an allowed list of column grants) and its column test` (everything else).
End each message with the two attribution lines:
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_019yED1QhZzoXHC1uiNEomy3`.

## Your report (at most 200 words)
The two commit hashes; each red and green by test name and count; the `tests/lint` count and every red by name; anything in this brief that was wrong.
