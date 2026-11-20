# SEC-GRANTS-2 hand-back: migration 213 (function grants, default deny) — 2026-11-20 03:28 UTC

Branch `lane/sec-grants-2-2026-11-20`, cut from origin/lane/sec-grants-2026-11-20 at **6d0ff09f6** (the assignment said
0024c8de0; the extra commit is docs-only, read back and accepted by the chair at 02:41 UTC). Commits:
**3a6102946** (213, the walker, its allowlist, the manifest row, the proof) and **d0119f048** (213's register rows),
then this hand-back's commit. Everything below ran on a scratch PostgreSQL 16 in this container (unix socket only,
`listen_addresses=''`) or in pglite; nothing touched a hosted database.

## What 213 holds, item by item

**1. The revokes by name, idempotent on every history.** §3 is the emergency script's 157 statements byte for byte
(revoke from public, anon, authenticated; grant service_role); §2 the three admin doors and `list_ticket_thread`
revoked from public, anon, and `list_ticket_thread` granted to authenticated, service_role (the chair's safeguard);
§4 the 21 helpers of item 4. Applied twice on four histories built from the same chain: fresh (`post`), the emergency
script first (`posta`: production, by the owner's report of 02:48 UTC), the emergency script and the ticket thread's
two lines first (`postt`), and the owner's first two BYOK revokes only. **All end in identical ACLs and identical
bodies for every function** (440 on 001..210+213; 511 with the share veil). `proof/run213.sh`, outputs `proof/out213/`
and `proof/out213-veil/` (`acl-post.txt` = `acl-posta.txt` = `acl-postt.txt`).

**2. The guards inside**, each re-stated from its net-current text (the last create-or-replace in 001..210, with
094/131's `public, pg_temp` pin, so the chain's `pg_get_functiondef` differs in ONE line):

| function (source) | before → after |
|---|---|
| set_curated (011), set_featured (168), set_featured_map (168) | `if caller_role not in ('developer', 'admin') then` → `if coalesce(caller_role, '') not in ('developer', 'admin') then` |
| list_ticket_thread (055) | `if not v_agent and v_owner <> auth.uid() then` → `if not v_agent and v_owner is distinct from auth.uid() then` |
| get_credit_balance (110) | `if auth.uid() is not null` → `if (auth.uid() is not null or coalesce(auth.role(), 'service_role') <> 'service_role')` |

`list_ticket_thread` was a door the emergency script left open (reported 02:38 UTC): anon read any ticket's
user-visible thread by its id (`out213/ticket-pre.txt`: `anon … rows=1 PRIVATE THREAD TEXT`; after: permission denied;
the owner 1 row, another user 0, a support agent 2). THE OTHER DOORS, BY EXECUTION: every door called as anon with every
uuid argument set in turn to a real row of each of 36 tables (a ticket, a reply, a redemption, a referral, a transfer
case, a founder-seat transfer and buyback, custom content and its revisions, operator messages, comments, reports,
users…; `proof/fill-rows.sql`, `fill-rows-2.sql`, `doors-anon-values.sh`, outputs `out213/wide-values-*.tsv`), on
a copy in production's likely state (emergency script, plus the ticket lines) and after 213: no door acts or reads for anon beyond public
reads (the vote count and comments of a public town) and `account_is_active` (VR38). NOT FED A REAL ROW: doors whose
arguments are not uuids (slugs: `get_gallery_dossier`, `get_unlisted_*`, `import_gallery_dossier`,
`list_gallery_more_by_creator`, `bump_public_view`; codes: `validate_redeem_code`, `record_referral_intent`; no
argument: the `list_my_*`, `founders_roll`, `founder_seats_taken`), and the one uuid table left empty,
`operator_message_delivery_jobs`. The NULL-slip text scan (the walker's second arm) on the pre-213 chain finds exactly
the four above plus `reactivate_free_settlement`'s `owner_tier <> 'free'`; EXECUTED: NULL only for a caller with no
profile row, who can reach only a settlement it owns and is then refused ("account is not active"): a reviewed
exception in the allowlist, not a door.

**3. `account_is_active(uuid)`: the table** (sent to the chair before its ruling of 02:42 UTC): 12 row-security policies pass `auth.uid()` as the visitor;
24 visitor doors pass the caller's own id; `founders_roll()` (anon and signed-in) passes every listed founder's id;
`record_referral_intent` passes the referrer's id; the service-only functions and 15 edge sites pass other ids with
the service key; pg_cron paths may carry no JWT. **RULING VR38: LEAVE IT** — built to: 213 does not touch it; the
allowlist carries it as `residual: 'VR38'`. THE PROPOSAL FOR AFTER THE DEPLOY: the body gains `p_uid = auth.uid() or
auth.role() = 'service_role' or auth.role() is null`, and a twin `_account_is_active_any(uuid)` (the old body, closed
to visitors, granted service_role) serves `founders_roll` and the referral's `v_referrer` line (two bodies, one line
each). Its regression probes are already written: `proof/flows213.sql` (FOUNDERS anon/authenticated roll rows=1,
REFERRAL, SERVICE and NOJWT account_is_active).

**4. The invoker helpers.** `proof/visitor-closure.sql` computes every function a visitor context runs as the visitor
(named by a policy, check constraint, default, view, index or invoker trigger; then every function an invoker body in
that set names). Of the 15 "for 213" and the 12 "visitor-needed": **21 revoked** (the 15, plus `_civility_stem_hits`,
`_civility_token_hits`, `civility_normalize`, `_gallery_chronicle_entry`, `_gallery_npc_key`,
`_gallery_sanitize_public_json` — reached only from definer bodies and the service role); **6 stay**:
`_gallery_world_snapshot_is_safe` (the map trigger: a map save still works, `flows.sql` MAP insert identical),
`format_ticket_number` (the browser's own support_messages insert: `flows213.sql` TICKET numbered=true),
`_deity_chart_axes_valid` (a check constraint), and the three `current_user_*` policy helpers. Seven of VR27's eight
older gallery helpers are in the 21; the eighth is the map trigger's. Making that trigger definer is NOT proposed:
nothing is gained (the helper is a pure invoker validator that grants nothing). Not touched: `_gallery_veil_*` (212
revokes them by its own loop: 70 exist, 0 visitor-executable on the composition), `_gallery_doors_*`,
`_gallery_public_tile_rows()` (also in the 157, so revoked twice: a no-op).

**6. The walker**, `tests/security/functionGrantsWalker.pglite.test.js` + `visitorFunctionAllowlist.js`: the whole
chain in pglite under the scaffold's default privileges (3 s, no file fails). **Allowlist: 105 = 86 doors (85 with a
named caller check + `account_is_active` as residual VR38) + 6 visitor-needed + 13 triggers.** Red on: an unlisted
executable function; a stale row; a wrong anon grant; a door whose check left its body; an orphaned visitor-needed
function; a NULL-slippable guard (second arm, no false reds on the chain; one reviewed exception); its own negative
controls plant a definer function and a slip inside a rolled-back transaction. RED FIRST by a planted migration
(`out213/walker-plant-red.log`: 3 arms red), plant removed; 10 of 10 green. Manifest row: `rationale /
pglite-executed`, as its pglite siblings.

**7. The proof.** On 001..210 and on 001..212 (veil-21 d5323b8b8: 211 sha256 eface6d0…, 212 fec111c2…) then 213:
reader calls and admin/actor/ticket probes denied as anon and authenticated; `flows.sql` byte-identical; `flows213.sql`
(sign-up, browser ticket, founders roll, referral, user-token edge calls, service-role and no-JWT calls) identical
except the two revoked helpers called directly; **the 810-call harness changed only at 179 anon + 178 authenticated
denials (exactly the expected set) and 3 service_role calls of the admin doors** now refused like a plain user (no
service-role caller exists: the browser alone calls them). The chair re-runs with the final 212 by `run213.sh <dir> <213>`.

## 5. Default privileges — PROPOSAL (the owner's decision; nothing built)
**The brief's line alone closes nothing (EXECUTED):** after `alter default privileges in schema public revoke execute on
functions from public, anon, authenticated`, a new function's ACL is `{=X/postgres,…}` and anon calls it. Per-schema
defaults only add to the global ones; PUBLIC's EXECUTE is global. What works (executed, Supabase-like scaffold):
```sql
alter default privileges revoke execute on functions from public;                                  -- global: PUBLIC
alter default privileges in schema public revoke execute on functions from anon, authenticated;   -- Supabase's grant
alter default privileges in schema public grant execute on functions to service_role;
```
→ new function: anon false, authenticated false, service_role true. **No `for role` clause:** without it,
`alter default privileges` changes the defaults of the role that RUNS it. Migrations run as `postgres`, so it covers
every function a migration creates, and every function made in the dashboard's SQL editor (also `postgres`). It does
NOT cover a function another role creates: EXECUTED with a second role carrying Supabase-like defaults of its own, its
new function came out `{=X/other_admin, anon=X, authenticated=X, service_role=X, …}` (anon true) while postgres's came
out `{postgres=X, service_role=X}`. On Supabase that is `supabase_admin` (extensions installed from the dashboard, its
own schemas) and an extension's own install; Supabase's initial schema gives `supabase_admin` the same grant-all
defaults in public. A `for role supabase_admin` line would need membership in that role, which `postgres` does not
hold on hosted Supabase as far as I know (PLAUSIBLE, not executed there). So default-deny closes OUR functions only;
the walker (and CHECK_213's `unlisted_open`) still sees a function any role leaves open. THE CHAIR'S PLAN (its message
queued 03:29 UTC): the deploy does not need default-deny, since 213's walker already reds on any new function left
open and unlisted; default-deny is a second lock, its own migration AFTER the deploy, with explicit grants for the 41. **What it breaks:** nothing that exists (defaults apply at creation; `create or replace` keeps an
ACL). It changes the habit: every new door's migration must `grant execute … to authenticated` (and `anon` for a
signed-out read), and a door DROPPED and re-created (a signature change) silently loses its grant. Measured: **41 of
the 92 visitor-callable functions hold their grant only through today's default** (`out213/default-privilege-reliance.txt`);
the same migration should grant those 41 explicitly. **What the walker then checks:** its stale-row arm already reds on a
listed door no longer open to a visitor (the dropped-and-recreated case); a test that calls each door is not needed for
that. The scaffold needs no change (the migration is in the chain).

## 8. For the deploy document (plain words)
213 goes **after 212** (it needs nothing 211 or 212 creates; only its number follows them), in the same `supabase db
push`, with the applied-head bump. **What a user sees: nothing.** It removes, by name, the right of signed-out visitors
and signed-in users to call 178 server-only functions (157 already closed on production by the emergency script: a
no-op there), stops signed-out visitors calling the three admin buttons and the ticket thread, and makes five checks
refuse a caller with no account instead of letting it through. Every page, save, share, gallery read, import, map,
ticket, credit and Surveyor path was run before and after: identical. **After it, run `CHECK_213.sql` once** (read-only,
one statement, one row). Expected: `closed_still_open_count 0 · missing_count 0 · service_role_lacking_count 0 ·
anon_doors_open 0 · signed_in_doors_closed 0 · guards_in_place 5 · unlisted_open_count 0`. The two rows, in the
check's column order (closed_still_open_count · missing_count · service_role_lacking_count · anon_doors_open ·
signed_in_doors_closed · guards_in_place · unlisted_open_count), as the reader REVIEW-GRANTS-1 measured them:
**BEFORE 213**, on a production where the emergency script ran: `21 · 0 · 0 · 1 · 0 · 0 · 21` if the ticket thread's
two lines were NOT run by hand (`21 · 0 · 0 · 0 · 0 · 0 · 21` if they were). **AFTER 213: `0 · 0 · 0 · 0 · 0 · 5 · 0`.**
The after-row is the one that decides. If the push stops before 213 has run, the owner runs nothing by hand and tells
the chair. `unlisted_open` names any function a visitor may call that is not on the written list, including anything
made by hand; any other after-row: send the row.

## Declared reds on this branch (by construction, the chair's ruling of 02:42 UTC)
The gap at 211–212: `migrationContiguity`, `migrationSequenceAll` (gapless arm), `docCounts` and
`architectureFreshness` (the count reads 211 files against the final 213), `migrationRehearsal` (whole file).
**On the composition** (veil-21 + 3a6102946 + the register commit, made there as 4752cd67d): tests/docs, tests/ops,
the sequence and ordering tests, the walker and the manifest test **300 of 300**; `check-migration-head`: 213 files,
contiguous; **tests/security whole 2015 of 2017**, the two reds being the veil's own pins on "212 is the last file",
both ATTRIBUTED (37 of 37 on clean veil-21) and both cured in the composition's register commit (37 of 37 after):
`galleryVeilSignalCopies.pglite.test.js` ("the chain applies whole": `/^212_/` → `/^213_/`) and
`galleryVeilCures.pglite.test.js` (its rollback arm built "001..212" as `buildDb()`, every file on disk, now `buildDb(212)`).
Those two files exist only on the veil lane, so their lines are in the patch, not in this branch's commit. At the close
the lines both lanes changed resolve to 213's values; `out213-veil/213-registers-on-veil21.patch` (the composition's
commit, 7 files) applies cleanly on veil-21's tree (`git apply --check`). **Green here:** tests/security 1919 of 1920 (the gap alone); the walker 10/10;
`typecheck:ratchet`, `typecheck:domain:strict`, `lint`. Stored figures moved: the migration count (211→213 with the
veil), the repo head (212→213), pending 91→92 from 121 and 12→13 from 200 — written in the register commit, not frozen
by me.

## Executed vs plausible; what to attack
EXECUTED: everything above, on copies. PLAUSIBLE: production's grants and bodies equal the chain's (the owner's checks
so far agree; CHECK_213 settles it); hosted Supabase accepts the default-privilege lines as on PG16. ATTACK: the
visitor closure's text match (a function named only through dynamic SQL would be missed; none found by
`execute format('%I(`); a reader could grep again); the 21 revokes against any invoker caller I did not see (scripts/
call three of them with the service key: still granted); the get_credit_balance line against a caller that reaches it
with uid NULL and a role other than service_role (none on the chain: the harness diff shows no change there); and the
NULL-slip arm's limits (it reads `if/elsif/when` lines only; a guard written as a `where` filter is not checked).
