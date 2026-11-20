# For the owner: the open functions (V10-8) — 2026-11-20 01:46 UTC

**What was open.** Supabase gives `anon` (anyone holding the public site key, i.e. anyone) and `authenticated` (any
signed-in user) the right to call every database function in `public`. Several migrations closed functions with
`revoke … from public`, which does not remove those two grants. On a copy of production's migrations (001..203),
anyone could call 157 functions that only the server is meant to call. The worst two: `_surveyor_byok_secret()`
returns the BYOK master secret, and `surveyor_byok_get(user, 'anthropic')` returns that user's **decrypted** AI
provider key (user ids are visible to anyone through the public gallery). Others that ran to completion for an
anonymous caller on the copy include: downgrading any user's plan (`handle_premium_downgrade`), purging a user's
analytics, running the inactive-plan purge on demand, hiding any gallery comment, writing fake audit rows, using up
any user's rate limits or AI budget, and reading the admin analytics reports. All of it is proven on the copy;
**on production it is not yet checked** — nobody in the program can see production.

**Step 1 — check (read-only).** In the SQL editor run `EMERGENCY_CHECK.sql`. Its second result answers the urgent
question: if `anon_can` is `true` for the two key functions, production is open. Its first result lists every
function the script will close; if any row says `exists_here = false`, stop and send the rows to the chair.

**Step 2 — close.** Run `EMERGENCY_REVOKE.sql` once (one transaction; all or nothing). Then run `EMERGENCY_CHECK.sql`
again: the first result must be empty and both key functions must show `false`. If a row remains, send it to the chair.

**Did anyone use it? (the API logs).** In the dashboard's Logs (API / edge logs), search request paths for
`/rest/v1/rpc/_surveyor_byok_secret` and `/rest/v1/rpc/surveyor_byok_get` (GET and POST both work for the first).
Nothing in the product calls `_surveyor_byok_secret` over the API, so **any** hit is someone else. `surveyor_byok_get`
is called legitimately only by the AI edge functions with the service key; a hit made with the anon key or a user's
token is someone else. Then search `/rest/v1/rpc/` for any name in `EMERGENCY_CHECK.sql`: the browser calls none of
them. Logs only go back as far as your plan keeps them; earlier use cannot be ruled out, and the request body (which
user was named) is usually not logged.

**What to rotate if it was open.**
* *If `surveyor_byok_get` was called by someone else, or you cannot rule it out:* the stored provider keys
  themselves may be out. Rotating our secret does not help those users: tell everyone who stored a key
  (`select count(*) from public.surveyor_byok_keys` — read-only) to delete it at their provider and set a new one.
* *If `_surveyor_byok_secret` was called:* rotate `app.settings.byok_secret`. Changing it alone makes every stored
  key undecryptable (BYOK fails closed: those users see "set your key" until they enter it again). To keep them working,
  each key must be decrypted with the old secret and re-encrypted with the new one in one transaction; the chair can
  have that script written and proven on the copy first. Do not paste either secret into any chat.

**What the script changes for a user: nothing visible.** It removes the right to call those 157 functions from
anonymous and signed-in callers and keeps it for the server (service role). On the copy every product path was run
before and after with identical results — save, edit, share a private link, publish, gallery list and page, vote,
comment, import, map save and publish, credits, Surveyor settings and BYOK set — and every one of the 283 open
functions was called as each role: the only changes are the 157 closed ones refusing anon and signed-in callers. It
does not drop, alter or change any data, row security, or the 126 functions the browser, its policies or its triggers
still need (those are fixed properly by the permanent migration 213). It rotates nothing.
