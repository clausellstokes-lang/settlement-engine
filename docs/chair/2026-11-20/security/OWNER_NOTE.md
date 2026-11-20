# For the owner: the open functions (V10-8) — 2026-11-20 02:09 UTC

**What was open.** Supabase gives `anon` (anyone holding the public site key, i.e. anyone) and `authenticated` (any
signed-in user) the right to call every database function in `public`. Several migrations closed functions with
`revoke … from public`, which does not remove those two grants. On a copy of production's migrations (001..203),
anyone could call 157 functions that only the server is meant to call. The worst two: `_surveyor_byok_secret()`
returns the BYOK master secret, and `surveyor_byok_get(user, 'anthropic')` returns that user's **decrypted** AI provider
key (user ids are visible to anyone through the public gallery). An anonymous caller who names an admin's user id as
the "actor" (the admin functions trust that argument) soft-deleted another user's town, banned it, disabled an account
and read billing on the copy; others downgrade any user's plan, purge a user's analytics, run the inactive-plan purge
on demand, hide any comment, write fake audit rows, use up anyone's rate limits or AI budget, read the admin reports.
Production printed `true` for the key functions before your two revokes, and its function list matches the copy's
so far; the other 155 are still open there until the script runs.

**Each check file is one statement and answers in one row** (Supabase's SQL editor shows only the last result and cuts
at 100 rows). All are read-only. Run each on its own.

**Before.** `CHECK_C_PREFLIGHT.sql`: `visitor_reference_count` must be **0** (nothing made by hand uses one of the 157 as
the visitor). `CHECK_B_REVOKE_LIST.sql`: `missing_count` must be **0**; `still_open_count` is how many will close (155
after your two). If either is not 0, stop and send the row to the chair.

**Run.** `EMERGENCY_REVOKE.sql`, once (one transaction; all or nothing; repeating your two lines is harmless).

**After.** `CHECK_B_REVOKE_LIST.sql`: all three counts **0**. `CHECK_A_KEYS.sql`: four `false`. Then, in the site:
1. sign out and in again (or sign up a test account);
2. save a settlement, edit it, save again;
3. share it by private link and open the link in a private window;
4. open the gallery and one gallery page, signed out;
5. open the admin page and one user in it.

**Undo, if one thing breaks:** `grant execute on function public.<the function named in the error> to anon, authenticated;`
for that one function only, then tell the chair. Never for the two BYOK functions.

**Did anyone use it before it was shut?** In the dashboard's Logs (API / edge logs), search request paths for
`/rest/v1/rpc/_surveyor_byok_secret` and `/rest/v1/rpc/surveyor_byok_get` (GET and POST). Nothing in the product calls
`_surveyor_byok_secret` over the API, so **any** hit is someone else. `surveyor_byok_get` is called legitimately only by
the AI edge functions with the service key; a hit with the anon key or a user's token is someone else. Then search
`/rest/v1/rpc/` for the names in `CHECK_B_REVOKE_LIST.sql`: the browser calls none of them. Logs reach back only as far
as your plan keeps them, and the request body (which user was named) is usually not logged.

**The secret.** `CHECK_D_SECRET.sql` says whether `app.settings.byok_secret` is set (true/false, and where it is stored)
and how many keys are stored, without printing the secret. With **0 stored keys** (your answer) a new secret costs
nothing: no key needs re-encrypting and no user is affected; replacing it is advisable if any log hit shows the secret
function was called. `docs/DEPLOY.md` names it as a DB secret (`app.settings.byok_secret`) but gives no command, so this
note does not give one. If keys are ever stored and the key function was used by someone else, those users must replace
their keys at their provider; a new secret does not help them.

**What the script changes for a user: nothing visible.** It removes the right to call those 157 functions from
anonymous and signed-in callers and keeps it for the server (service role). On the copy every product path was run
before and after with identical results — save, edit, share, publish, gallery, vote, comment, import, maps, credits,
Surveyor settings, BYOK set — and every open function was called as each role: the only changes are the 157 closed ones
refusing anon and signed-in callers. No drop, no alter, no data or row-security change; it rotates nothing.
