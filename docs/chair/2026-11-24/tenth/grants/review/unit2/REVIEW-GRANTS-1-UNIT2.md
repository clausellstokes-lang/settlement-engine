# REVIEW-GRANTS-1 — unit (2): migration 211, its tests, the client change, and the owner's full file

Written 2026-11-24 18:37 UTC. Commit read: `39bfb0831` on `lane/grants-1-2026-11-24` (it holds the line's
tip f03e9a868), in a detached scratch worktree; `origin/master` fetched as the live site. Formed before reading any other
verdict. Every database is PGlite in this container under the hosted default privileges (the seat's `boot.mjs` loads
migrations; every catalog query is mine: the `*.mjs` in this folder). CONFIRMED = executed; PLAUSIBLE = read.

| part | verdict |
|---|---|
| A, the functions | CLEAR |
| B, the default for new functions | CLEAR (two silent no-op modes; the read can't see one of them) |
| C, profiles by column grants | CLEAR |
| D, the guard on settlements and saved_maps | CLEAR |
| the owner's files 0a–5 and their page | NOT CLEAR, for visibility only: no read shows that C or D took effect, and B's only read is 0b, run before |

## A (CONFIRMED, 001–210 + 211 and 001–203 + owner file 1)
- Part A is 245 `revoke … from public, anon, authenticated` lines (244 SERVER or NOBODY functions plus `_audit_action`) and 187
  `grant … to service_role` lines, and nothing else. Every re-grant is a function the migrations grant to service_role,
  and every such function is re-granted.
- Open before: 134. Open after: 0. No function outside the 245 changed for anon or authenticated, and service_role lost
  nothing. The one intended grant lost is `_audit_action`'s PUBLIC default, as ruled; all its callers are definer.
- No pg_depend row and no expression text in a policy, view, default, constraint, index or trigger names a listed
  function. The 47 SECURITY INVOKER callers are listed helpers calling listed helpers: none is runnable by anon or
  authenticated, none is a trigger, and their roots are definer.
- Call sites: of 383 `.rpc(` calls, 234 literal ones and 9 dynamic ones reach a listed function. The sets are
  identical on master and on the line, and every receiver is a service-role client, including
  `_shared/pricingResync` (`deps.adminClient`, passed by admin-actions and pricing-resync-cron) and
  generate-chronicle's `admin`.
- Nit (CONFIRMED): the header says three are "LEFT OPEN", but `operator_message_class_for_template` is closed to both
  roles before and after.

## B (CONFIRMED in PGlite)
- It changes only the default of the role that runs it, in schema public. On the hosted platform that is `postgres`
  (the SQL editor's and `db push`'s role: PLAUSIBLE). 0b's functions row goes from
  `{anon=X,authenticated=X,service_role=X}` to `{service_role=X/postgres}`. A new function written with the two
  convention lines is then closed to both roles; one with no grant line stays open through PUBLIC.
- Silent no-op 1: run as another role, it succeeds with no message and changes nothing for postgres. 0b shows the row
  unchanged, but only if the owner runs 0b again.
- Silent no-op 2: a GLOBAL default grant (no `IN SCHEMA`) survives the per-schema revoke, and 0b's
  `where defaclnamespace = 'public'` hides that row. Whether production has one is PLAUSIBLE-unlikely.
- The definitive read is one transaction that rolls back:
  `begin; create function public.zz_probe() …; revoke … from public; grant … to service_role;
  select has_function_privilege('anon','public.zz_probe()','execute'); rollback;`.
- Running file 2 before 204–210 are pushed: 0 functions differ from the line's order (`b-first.log`).

## C (CONFIRMED)
- Master's direct profiles writes are `avatar_url` (AccountIdentitySection 169 and 196), `public_identity_opt_in`
  (213), and auth.js's preferences patch (`avatar_url`, `email_notifications`, `model_preference`). That leaves the
  display_name fallback (auth.js 413–420), which the page names.
- Every edge write to profiles uses a service client. No invoker function or trigger writes profiles. The tests go red
  without C (2 arms). profile_escalation goes red against master's auth.js (2 arms), and the client diff is right.

## D (CONFIRMED, 203 and 210)
- Every column the guard names exists, with exactly the guard's default. Every function that writes them is
  SECURITY DEFINER, and no invoker trigger assigns one.
- No client or edge payload carries a guarded column. The settlements and saved_maps upserts carry none, so the
  BEFORE INSERT check passes on the conflict path.
- The tests go red without D (6 arms), and the definer writers still write.

## Owner's files
- Files 2, 3 and 4 are statement-for-statement the migration. File 1 holds the same 245 revokes and 187 re-grants,
  each guarded. The lists in 0a and 5 equal file 1's.
- File 5 re-reads part A only. Nothing reads `has_column_privilege('authenticated','public.profiles','<col>','UPDATE')`
  or the two `trg_guard_server_owned_columns` rows in `pg_trigger`. The page doesn't tell the owner to re-run 0b after 2.
- Rehearsal (`scripts/ops/migrationRehearsalCore.mjs` 849–867): the 211 wave's purpose says "Grants only: no table,
  no column, no row", and expectedObjects names `_surveyor_byok_secret`. Neither covers the function and the two
  triggers 211 creates. Minor.

## (d) (body read; CONFIRMED by catalog)
- `has_role(uuid,text[])` (definer, anon-executable): tells anyone whether a uuid holds a role.
  `profile_has_premium_access(uuid)` (definer, anon): whether a uuid is premium or developer/admin. It has no caller,
  no policy and no client use.
- `account_is_active(uuid)`: banned/disabled/deleted as one boolean. It is used by 12 RLS policies and by the edge
  functions through service clients, so it must stay open to authenticated.
- `_gallery_sanitize_public_json` and `_gallery_world_snapshot_is_safe`: invoker and pure, over the caller's own
  argument, with no table read. A caller learns nothing.
- The first deploy may go without changing them. They answer yes/no about a uuid the caller must already hold, and
  part A removes the forged-actor RPCs that made the staff oracle useful. Later: revoke both oracles from anon.

## Residual risk, plain words
After 211, a visitor can still learn whether a given account id is staff or premium. A part-B run by the wrong role
would quietly do nothing. And every result here is a replay: only reads on production prove production.
