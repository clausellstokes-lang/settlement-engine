# SEC-GRANTS — deliverable one: the emergency revoke (V10-8) — 2026-11-20 01:46 UTC

Built and proven against **origin/master's migrations 001..203** (db832c892), what production runs. Nothing here touched
a hosted database; everything ran on a scratch PostgreSQL 16 in a cloud container (unix socket only,
`listen_addresses=''`).

| file | what |
|---|---|
| `EMERGENCY_REVOKE.sql` | the script for the owner's hand: one transaction, 157 `revoke execute … from public, anon, authenticated` (the two BYOK key functions first), then the same 157 `grant execute … to service_role` (already held; keeps the edge's door if PUBLIC was its path). No drop, alter or data change. Idempotent (proved by running it twice). |
| `CHECK_A_KEYS.sql` … `CHECK_E_ANON_CATALOGUE.sql` | read-only, ONE statement and ONE row each (Supabase's editor shows only the last result and cuts at 100 rows). A: the two key functions, four booleans. B: the 157 — still open / missing / service_role lacking, counts and lists (after: all 0). C: the pre-flight — anything (policy, default, constraint, view, trigger, index, an INVOKER body in any schema, a definer owned by another role) using one of the 157 as the visitor; must be 0; red by plant (`proof/preflight-plant.sql` → `out/preflight-plant.txt`: 4 of 4 caught). D: is the BYOK secret set (never printed) and how many keys are stored. E: every anon-executable function in one cell, the chair's shape. |
| `OWNER_NOTE.md` | one page for the owner: what was open, the log search, what to rotate, what users will notice. |
| `CATALOGUE.md` | all 283 functions anon or authenticated may execute on the chain, classed, with callers, caller check, reads/writes, and the anon outcome before. |
| `proof/` | the scaffold, chain builder, plant, reader calls, product flows, call harness, `run.sh`; `inputs/` the caller lists and classification; `out/` the outputs of the run recorded here. |

## Classes (chain 001..203)
* **INTERNAL — revoked now: 157.** SECURITY DEFINER, executable by anon/authenticated, with no caller in `src/`, `api/`,
  or an edge function's user-token client, not referenced by a policy, constraint, default or view, and not called
  from any SECURITY INVOKER function or trigger body. 99 of them are called by edge functions with the service key,
  12 by `scripts/` (service key); service_role keeps them all.
* **DELIBERATE DOOR: 85.** Called by the browser (or `api/`, or an edge function with the user's token). All are
  DEFINER; every one that takes a user or row id compares it to `auth.uid()` or is gated by a privilege helper
  (read for the five that take a user id: `get_credit_balance`, `welcome_credit_available`,
  `has_dossier_entitlement`, `set_my_email_preference`, `set_my_telemetry_consent`).
* **DOOR THAT TRUSTS A PARAMETER: 1.** `account_is_active(uuid)`: DEFINER, anon-callable, answers for any user id
  (a yes/no leak, no write). Row-security policies call it as the visitor, so it cannot be revoked; it needs a
  caller check inside (213).
* **Left out, and why** — VISITOR-NEEDED (12): referenced by a policy or check constraint (`current_user_has_premium_access`,
  `current_user_is_highest`, `current_user_is_support_or_higher`, `_deity_chart_axes_valid`) or called from an
  INVOKER body that runs as the visitor (`_gallery_world_snapshot_is_safe` from the saved_maps trigger,
  `format_ticket_number` from the support-ticket trigger, the civility chain, `_gallery_chronicle_entry`,
  `_gallery_npc_key`, `_gallery_sanitize_public_json`). INVOKER helpers (15): they run with the caller's own rights,
  so anon gains nothing through them; revoked in 213 once the walker proves no visitor path. TRIGGER functions
  (13): PostgreSQL refuses to call them directly (`proof/out/trigger-direct-call.txt`).

## The scaffold question
The readers' scaffold (REVIEW-VEIL-6 `native/scaffold.sql`, 72a3bb24f) ends with
`alter default privileges in schema public grant execute on functions to anon, authenticated, service_role`.
Supabase's own initial schema (github.com/supabase/postgres, develop,
`migrations/db/init-scripts/00000000000000-initial-schema.sql`, read 2026-11-20 by a fetch) has
`alter default privileges in schema public grant all on functions to postgres, anon, authenticated, service_role;`
and the same `for user supabase_admin`. For functions ALL is EXECUTE, so **the line matches for functions**. It omits
Supabase's matching grants on tables and sequences, `service_role`'s BYPASSRLS, and its `auth.role()` defaults to
'anon' rather than reading the JWT claim; `proof/scaffold.sql` adds all three (the last mattered: with a
`current_user`-based `auth.role()` every service-only function refuses the service role inside a definer, which hid
the edge paths from the proof's first run). The Supabase docs page on functions could not be read (host not reachable
from this container).

## The proof (`proof/run.sh`, outputs in `proof/out/`)
Two databases from the same chain, `pre` (as production) and `post` (script applied twice); a fake master secret and a
fake key planted for user 2222.
* `reader-pre.txt`: as anon and as authenticated(1111), `_surveyor_byok_secret()` returns the secret and
  `surveyor_byok_get(2222)` returns the decrypted key. `reader-post.txt`: all four calls `permission denied`.
* `check-before.txt` / `check-after.txt` (checks A–E): before, A all true, B still_open 157, C 0; after, A all false,
  B 0/0/0, C 0, E 145 (299 before).
* `flows-pre.txt` = `flows-post.txt`, byte for byte: save/edit (RLS and every settlements trigger as the visitor),
  unlisted share and anon read, publish, anon gallery list/page/more-by-creator/view bump/founders roll, vote,
  comment, import by another premium user, map save (its INVOKER trigger) and publish, credit balance, Surveyor
  entitlement, BYOK status and set (which uses the revoked secret function from inside its definer), and the edge's
  service-role `surveyor_byok_get`, `surveyor_usage_precheck`, `account_is_active`.
* `harness-pre.tsv` / `harness-post.tsv`: all 270 callable functions × anon, authenticated, service_role, each call in
  a rolled-back transaction with the role's JWT claim set. `diff-summary.txt`: the only changes are the 157 revoked
  functions refusing anon and authenticated by name; **0 other outcomes changed**; 114 of the 157 run to completion as
  service_role, identically before and after. Before the script, 77 of the 157 ran to completion as anon.

* `actor.sql` → `out/actor-pre.txt` / `out/actor-post.txt` (the chair's VEIL-DOORS class): as anon, naming admin
  1111 as `p_actor`, `admin_soft_delete_settlement`, `admin_set_content_banned`, `set_account_disabled` and
  `admin_billing_summary` succeed, and `handle_premium_downgrade(2222)` makes a premium user free. After the script,
  all five are denied. Every function on this chain that takes a `p_actor` and is anon-executable (18) is in the
  script; none has a browser caller (the admin pages call the `admin-actions` edge function, which uses the service
  key). `_gallery_public_tile_rows`, `handle_premium_downgrade` and both `purge_expired_plan_inactive_*` are in it too.
* `CHECK_E_ANON_CATALOGUE.sql` has the shape of the chair's production query (proname, identity arguments,
  prosecdef, for anon), in one row. The chain's results are in `out/anon-catalogue-pre.txt` (299) and `-post.txt` (145). Both
  counts include pgcrypto's 36 functions, which this chain installs in `public`; Supabase puts them in `extensions`.

## Limits (what is executed and what is not)
EXECUTED on the chain: everything above. NOT EXECUTED: anything on production. PLAUSIBLE: production's grants equal the
chain's (the check settles it). Caller analysis is static: a caller hidden behind a computed function name would be
missed (none found: no `execute format('%I(...)')` in any body; the only computed `.rpc(` names are the
service-role admin and founder-transfer dispatchers). The harness uses placeholder arguments, so for the deep paths the
flows are the proof. If production's grants were made by a role other than `postgres`, a revoke by `postgres` would
not remove them; the AFTER check shows that as a remaining row.

Reproduce: `sh proof/run.sh $PWD/proof <dir of 001..203 .sql files> $PWD/proof/out` with a scratch cluster at
`PGHOST=/var/tmp/sg`.
