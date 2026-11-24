# REVIEW-GRANTS-1 — unit (1): FOR-THE-OWNER-URGENT.sql

Written 2026-11-24 15:43 UTC. Commit read: `0ea91fe18` on `lane/grants-1-2026-11-24` (HEAD of this checkout).
`origin/master` (what is live) fetched: its migrations 001–203 are byte-identical to the line's (blob ids compared
file by file). Every database below is PGlite in this container, loaded with the seat's `measure/boot.mjs`; every
catalog query is my own (`review-urgent.mjs`, `probe-*.mjs`, `rpc-sites.mjs` in this folder). Nothing was applied
anywhere else. CONFIRMED = executed here; PLAUSIBLE = read only.

## VERDICT: CLEAR 0ea91fe18

No defect makes the SQL unsafe. Four non-blocking findings follow (F1–F4); the owner should read F1 and F2 before he runs it.

## (i) The SQL itself (CONFIRMED)

- 360 lines. Outside the comment lines there are exactly three statement shapes: two read-only `select`s over a
  105-row `values` list (block 0 and block 2, identical lists), one `select count(*)` (block 0b), and 105 lines
  each matching exactly
  `do $$ begin if to_regprocedure('<sig>') is not null then revoke execute on function <sig> from public, anon, authenticated; end if; end $$;`
  with the guard's signature identical to the revoke's (parsed by regex; any other shape throws). 105 distinct
  signatures, the same set in block 0, block 1 and block 2. No grant, no DDL, no write but the revokes.
- Run whole, twice, on the 203 and on the 210 replay: no error; 108 result sets. A function dropped beforehand is
  skipped by the guard (no error) and reads `exists_here = false` in block 2.
- Partial application: each of the 105 has, on its own, no user path (ii, iii), so any subset of the revokes harms
  no user path. (In Supabase Studio a multi-statement run is one implicit transaction, so it is all or nothing:
  PLAUSIBLE, product knowledge.)
- What the owner sees, per my run on 203: block 0 — 105 rows, all `exists_here = true`, **69** rows `true, true`
  and 36 rows already `false, false`; block 0b — one number; block 2 — 105 rows, all `false, false`.
  Before/after calls: as `anon` and `authenticated`, `has_active_transfer_lock` and `_seat_holder_last_active`
  went from ok to "permission denied"; as `service_role` both stayed ok.

## (ii) Each function, by my own replay (CONFIRMED, 210 and 203 alike)

- All 105 exist in both replays, all owned by `postgres`, all in `public`, all SECURITY DEFINER, no other
  overload of any of the 105 names.
- Intent, from the replay WITHOUT the hosted default: **none** of the 105 is executable by `anon` or
  `authenticated` (their last stated grant is `service_role` alone, or nobody).
- Ten last-stated grants, quoted:
  - 139:124 `revoke all on function public._surveyor_byok_secret() from public;` (no grant: NOBODY)
  - 191:468–469 `revoke all on function public.surveyor_byok_get(uuid, text) from public;` / `grant execute ... to service_role;`
  - 143:148–149 `surveyor_byok_set_health(uuid, text, text, text, boolean)`: revoke from public / grant to service_role
  - 191:410–411 `surveyor_byok_set_probe_tier(uuid, text, text, text, text, jsonb)`: revoke from public / grant to service_role
  - 144:338–339 `surveyor_usage_precheck(uuid, text, text)`: revoke from public / grant to service_role
  - 024:378–379 `handle_premium_downgrade(uuid)`: revoke from public / grant to service_role
  - 118:91–92 `claim_free_narrative(uuid)`: revoke from public / grant to service_role
  - 107:701–702 `apply_redemption(text)`: revoke from public / grant to service_role
  - 194:412,416 `unsubscribe_via_token(uuid, text)`: revoke from public, anon, authenticated / grant to service_role
  - 066:286–287 `verify_recovery_answer(text, smallint, text)`: revoke from anon, authenticated / grant to service_role
- Policies, views, matviews, column defaults, check/exclusion constraints, indexes, trigger definitions: no
  `pg_depend` row onto any of the 105, and no text hit in the deparsed expressions.
- Callers (word search of `prosrc` over every non-C function): 57 hits, **every caller SECURITY DEFINER**
  (owner `postgres`); no SECURITY INVOKER function and no invoker trigger function calls any of the 105.

## (iii) Live call sites (CONFIRMED by grep, both trees)

- `src/`: no `.rpc(` call to any of the 105 in either tree; no dynamic `.rpc(<variable>` in `src/` at all.
  The src hits are comments or edge-function action names (`AdminUsersPanel`, `SupportQueuePanel`,
  `AccountTickets`, `AdminBroadcastPanel`), which go through admin-actions / account-actions.
- `supabase/functions/`: 154 literal `.rpc('<listed>')` calls per tree plus 9 dynamic ones (admin-actions
  `REPORT_FNS` and `OPERATOR_MESSAGE_RPCS`, founder-transfer `switchRpc`). Every receiver resolves to a client
  built by `createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)` with no Authorization header override
  (each factory body read in both trees), or to a shared helper whose every caller passes that client
  (`autoReload`, `ai-analyst/byok.ts`, `accountDeletionCleanup`, `paymentRefundRecovery`, `stripeWebhookLease`).
  The user-token clients (founder-transfer `userClient`, verify-checkout-session, send-email `userClient`,
  the construct/interpret/parley/custom-content/surveyor-autonomy user factories, og-image anon) call none of the 105.
- Outside both directories: `api/` and `scripts/ops` call none of the 105.
- **No call with a visitor's or a user's token to a function in the file.** Every function with a direct server
  call (96 of 105) has an explicit migration grant to `service_role`, so `revoke ... from public` cannot take
  the server's right away.

## (iv) The effect, executed (CONFIRMED, 210 and 203)

After the file's block 1, applied twice: 0 of the 105 executable by `anon` or `authenticated`; 69 changed;
**no function outside the 105 changed** for `anon` or `authenticated`; every function the no-default replay grants
to `anon` (68) or `authenticated` (147) is still executable by that role; no function lost `service_role`.
`service_role` executes 101 of the 105; the other 4 (`insert_operator_direct_message`, `issue_warning`,
`materialize_my_operator_broadcast_receipts`, `set_account_banned`) are NOBODY functions `service_role` never had
in any replay, already closed before the file, called only from definer wrappers: the file changes nothing for them.

## (v) What is not in it

The 105 equal groups 1 and 2 of `measure/out/revoke-block.sql` (21 + 84) name for name: nothing of groups 1–2 is left out.

## Findings (none blocking)

- **F1 (CONFIRMED by count) — the plain words overstate.** Lines 4–5 say 105 functions "can today be called by
  anyone"; under the hosted default 69 can, 36 are already closed (block 0 will show them `false, false`).
- **F2 (PLAUSIBLE, Studio behaviour) — the "before" is invisible if the file is run whole in the SQL editor**,
  which shows the last statement's result only (block 2). To see the before, run block 0 alone first.
- **F3 (read) — block 2 does not read `service_role`.** The header's "the server keeps every right it has" is
  true in my replay but is not shown to the owner; a third column `has_function_privilege('service_role', ...)`
  would show it.
- **F4 (CONFIRMED) — `_audit_action(uuid,uuid,text,jsonb,jsonb,text)` is named in RULING-G1 part A but is in no
  group** (UNSTATED, so outside revoke-block.sql). It is executable by anon/authenticated (PUBLIC even without the
  hosted default), has no role check, and every caller is SECURITY DEFINER, so the same guarded revoke would be safe.
  For the migration, not for this file.

## Residual risk, plain words

This file closes the 69 open doors that hand back secrets or change another user's account or money; it does not
close the 140 group-3 functions (among them `reserve_ai_spend` / `release_ai_spend_reservation`, which can fill or
undo the AI spend cap, and `write_ai_operation_log`), nor `_audit_action`, nor the direct table writes the measure
found: a signed-in user can still reset `profiles.free_narrative_claimed_at` themself (another road to repeated free
narratives) and can clear a staff ban on their own settlement or map and republish it. And every result here is a
replay: production's real grants are what block 0 and block 2 show.

## Files

`review-urgent.mjs` (ii, iv; `review-210.log`, `review-203.log`, `out-review-*.json`), `rpc-sites.mjs` (iii;
`rpc-sites-HEAD.txt`, `rpc-sites-master.txt`, `callsites-raw.txt`), `probe-owner-run.mjs` (i), `probe-overloads.mjs`,
`probe-adjacent.mjs` (F4, residual), `names.txt`.
