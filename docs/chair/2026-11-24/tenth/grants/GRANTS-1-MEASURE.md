# GRANTS-1 — unit (1), the measure (written 2026-11-24 15:04 UTC)

Commit read: `9b0ffaa9750f65f122e07c5d2b368797569b5055` (the working line `lane/join-2026-11-14`, migrations 001–210). No file under `supabase/` or `src/` was changed. Every database below is PGlite, in memory, in this container. CONFIRMED = executed there; PLAUSIBLE = read only. **Nothing here is a reading of the production database**: whether production carries the hosted default grants is the owner's read-only query to make (the fix's plain file opens with it).

## Method (CONFIRMED)

The harness (scratch, not committed) does the following. It boots PGlite with pgcrypto, uuid-ossp, citext, pg_trgm and unaccent in schema `extensions`. It models the platform: schemas `auth`, `storage`, `cron`, `net` and `vault`; the roles `anon`, `authenticated` and `service_role` (nologin, noinherit, service_role with bypassrls); `auth.uid()`, `auth.role()` and `auth.jwt()` read from settings; `auth.users`; stubs for `storage.*`, `cron.schedule`/`unschedule` and `net.http_post`. Then, as `postgres`, the role that next replays the migrations, it runs

    alter default privileges in schema public grant execute on functions to anon, authenticated, service_role;
    alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
    alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;

This mirrors the hosted default: the platform's bootstrap sets these default privileges for the role that runs `db push`. That is PLAUSIBLE from training knowledge, and the repository says it itself (113, 135, 204's amendment; 087 §1c "service_role works today via Supabase's default privileges"). `alter default privileges` without FOR ROLE binds to the current role, which is the replaying role.

Next it replays 001–210 in order: a whole file first, and on failure statement by statement, so that one environmental failure never drops the rest. **All 210 applied.** 197 applied whole; the 13 statements that failed are the defensive `create extension pg_cron` blocks (in 024, 034, 035, 039, 054, 066, 079, 086, 115, 122, 125, 156 and 166). Nothing else failed.

A second database replays the same chain WITHOUT the default privileges. Its `proacl` is the migrations' own stated intent:
- **SERVER**: explicit grant to `service_role` alone.
- **USER**: `authenticated` is granted but `anon` is not.
- **ANYONE**: `anon` or PUBLIC is granted.
- **NOBODY**: owner only.
- **UNSTATED**: no grant statement ever.
- **TRIGGER**: trigger functions.

A function "checks the caller" only if its body (or a helper it calls) reads the role claim (`auth.role()`, `request.jwt.claim.role`, `service_role`, `_assert_service_*`). An `auth.uid()` alone is no check against `anon`: an anon PostgREST caller has `auth.uid()` NULL, and several bodies treat NULL as "the server". A `has_role(p_actor, …)` on an argument is no check either: the caller supplies the actor.

## (a) F1 — counts (CONFIRMED)

| intent | functions | SECURITY DEFINER | executable by anon or authenticated under the hosted default | the same in vanilla Postgres |
|---|---|---|---|---|
| SERVER | 187 | 180 | 125 (all by anon too) | 0 |
| NOBODY | 60 | 15 | 10 | 0 |
| USER | 79 | 79 | 79 (59 by anon) | 79 (anon only where PUBLIC was left) |
| ANYONE | 38 | 37 | 38 | 38 |
| UNSTATED | 18 | 3 | 18 | 18 |
| TRIGGER | 22 | 11 | 13 | 12 |
| **all** | **404** | **325** | | |

Server-only or owner-only and exposed: 135. Of those, 8 are SECURITY INVOKER, so the caller's own RLS applies. 40 are SECURITY DEFINER with a real role check: defense in depth, the 113 case. **87 are SECURITY DEFINER with NO real check of the caller: THE LIST.** None of the 87 appears in any RLS policy or view. None is called from `src/`. Every edge call to them goes through a service-role client (supabaseAdmin / adminClient / admin, and stripe-webhook's `supabase` built from `adminClient`). PLAUSIBLE by grep: a revoke from `anon` and `authenticated` breaks no caller found.

Executed as `anon` in PGlite (CONFIRMED):
- `handle_premium_downgrade(victim)` returned ok, and the victim's tier went from premium to free.
- `_surveyor_byok_secret()` returned the BYOK passphrase.
- `claim_free_narrative(victim)` ran.

Executed as `authenticated`: `release_free_narrative(own id)` set the claim back to NULL.

`surveyor_byok_get(any user)` failed in PGlite only because `pgp_sym_decrypt` lives in schema `extensions`, outside its `search_path = public, pg_temp`. If production resolves it, the call returns the victim's decrypted key. If production does not, BYOK decryption is broken there for everyone. Both are PLAUSIBLE, and the question is the owner's.

Outside the list but adjacent:
- `_audit_action(…)` (UNSTATED, SECURITY DEFINER, never granted or revoked) inserts `admin_actions` rows with a caller-chosen actor, for PUBLIC even in vanilla Postgres.
- 59 USER-class functions are executable by `anon` on the hosted default. Most refuse a NULL `auth.uid()`; they are not swept here.
- `has_role(uuid, text[])` (USER, no check) answers "is this id staff?", which helps whoever forges `p_actor`. Settlements' `moderation_banned_by` shows the owner of a banned row the staff id that banned it.

### THE LIST (87; "last stated" is the last migration that creates the function; "grants last" is the last migration that grants or revokes it)

| # | function (signature) | last stated | grants last | could do |
|---|---|---|---|---|
| 1 | `handle_premium_downgrade(target_user uuid)` | 024 | 024 | downgrade any user to free and switch off their saves and maps |
| 2 | `purge_expired_plan_inactive_settlements()` | 023 | 023 | run the retention purge (deletes expired retained saves) on demand |
| 3 | `purge_expired_plan_inactive_assets()` | 165 | 165 | run the retention purge (deletes expired retained saves and maps) on demand |
| 4 | `consume_email_rate_limit(p_ip text, p_recipient text, p_window_seconds integer, p_ip_limit integer, p_recipient_limit integer)` | 034 | 034 | consume or exhaust any key's rate limit (inflict lockouts) |
| 5 | `cleanup_email_rate_limits(p_retention_seconds integer)` | 034 | 034 | run a retention cleanup (deletes rows) on demand |
| 6 | `consume_dossier_verify_rate_limit(p_ip text, p_window_seconds integer, p_ip_limit integer)` | 035 | 035 | consume or exhaust any key's rate limit (inflict lockouts) |
| 7 | `cleanup_dossier_verify_rate_limits(p_retention_seconds integer)` | 035 | 035 | run a retention cleanup (deletes rows) on demand |
| 8 | `ingest_check_rate(p_key text, p_max integer, p_window_seconds integer)` | 036 | 036 | consume or exhaust any key's rate limit (inflict lockouts) |
| 9 | `purge_analytics_for_user(p_user_id uuid)` | 036 | 036 | erase any user's analytics, edit events and snapshots |
| 10 | `rollup_analytics_daily(p_day date)` | 038 | 038 | write analytics rollup rows on demand |
| 11 | `report_funnel(p_from date, p_to date)` | 038 | 038 | read an admin analytics report |
| 12 | `report_preferences(p_from date, p_to date)` | 038 | 038 | read an admin analytics report |
| 13 | `report_edit_heatmap(p_from date, p_to date)` | 038 | 038 | read an admin analytics report |
| 14 | `report_ai_usage(p_from date, p_to date)` | 038 | 038 | read an admin analytics report |
| 15 | `report_retention()` | 198 | 038 | read an admin analytics report |
| 16 | `analytics_nightly_maintenance()` | 198 | 198 | run analytics maintenance or pruning on demand |
| 17 | `analytics_monthly_prune()` | 198 | 198 | run analytics maintenance or pruning on demand |
| 18 | `report_trend(p_metric text, p_granularity text, p_from date, p_to date)` | 117 | 117 | read an admin analytics report |
| 19 | `report_distribution(p_field text, p_from date, p_to date, p_granularity text, p_limit integer)` | 040 | 040 | read an admin analytics report |
| 20 | `report_summary(p_from date, p_to date)` | 117 | 117 | read an admin analytics report |
| 21 | `report_crosstab(p_row text, p_col text, p_from date, p_to date, p_limit integer)` | 040 | 040 | read an admin analytics report |
| 22 | `report_pulse_mutations(p_from date, p_to date)` | 041 | 041 | read an admin analytics report |
| 23 | `report_stressor_genesis(p_from date, p_to date)` | 041 | 041 | read an admin analytics report |
| 24 | `report_proposal_decisions(p_from date, p_to date)` | 041 | 041 | read an admin analytics report |
| 25 | `report_config_variance(p_config_signature text, p_from date, p_to date)` | 041 | 041 | read an admin analytics report |
| 26 | `report_regional_impacts(p_from date, p_to date)` | 042 | 042 | read an admin analytics report |
| 27 | `report_channel_funnel(p_from date, p_to date)` | 042 | 042 | read an admin analytics report |
| 28 | `report_regional_arcs(p_from date, p_to date)` | 042 | 042 | read an admin analytics report |
| 29 | `report_npc_distribution(p_field text, p_from date, p_to date)` | 042 | 042 | read an admin analytics report |
| 30 | `report_regional_propagation(p_from date, p_to date)` | 043 | 043 | read an admin analytics report |
| 31 | `write_audit(p_action text, p_target_user_id uuid, p_target_type text, p_target_id text, p_reason text, p_before jsonb, p_after jsonb, p_was_destructive boolean, p_was_reversible boolean, p_user_notified boolean, p_actor_id uuid)` | 051 | 051 | forge admin-audit rows under any actor |
| 32 | `add_internal_note(p_actor uuid, p_target uuid, p_note text)` | 053 | 053 | act as any staff member: the role check reads the actor id the caller passes |
| 33 | `set_account_disabled(p_actor uuid, p_target uuid, p_disabled boolean, p_reason text)` | 053 | 053 | act as any staff member: the role check reads the actor id the caller passes |
| 34 | `admin_soft_delete_settlement(p_actor uuid, p_id uuid, p_delete boolean, p_reason text)` | 053 | 053 | act as any staff member: the role check reads the actor id the caller passes |
| 35 | `admin_remove_gallery_item(p_actor uuid, p_id uuid, p_reason text)` | 053 | 053 | act as any staff member: the role check reads the actor id the caller passes |
| 36 | `admin_revoke_share_link(p_actor uuid, p_id uuid, p_reason text)` | 053 | 053 | act as any staff member: the role check reads the actor id the caller passes |
| 37 | `admin_billing_summary(p_actor uuid, p_target uuid)` | 053 | 053 | act as any staff member: the role check reads the actor id the caller passes |
| 38 | `admin_diagnostic_bundle(p_actor uuid, p_target uuid, p_full boolean, p_reason text)` | 053 | 053 | act as any staff member: the role check reads the actor id the caller passes |
| 39 | `claim_ticket(p_actor uuid, p_id uuid)` | 055 | 055 | act as any staff member: the role check reads the actor id the caller passes |
| 40 | `set_ticket_status(p_actor uuid, p_id uuid, p_status text, p_reason text)` | 055 | 055 | act as any staff member: the role check reads the actor id the caller passes |
| 41 | `link_ticket_faq(p_actor uuid, p_id uuid, p_faq text)` | 055 | 055 | act as any staff member: the role check reads the actor id the caller passes |
| 42 | `consume_recovery_rate_limit(p_ip text, p_email text, p_window_seconds integer, p_ip_limit integer, p_email_limit integer)` | 066 | 066 | consume or exhaust any key's rate limit (inflict lockouts) |
| 43 | `cleanup_recovery_rate_limits(p_retention_seconds integer)` | 066 | 066 | run a retention cleanup (deletes rows) on demand |
| 44 | `consume_ai_generate_rate_limit(p_user uuid, p_window_seconds integer, p_user_limit integer)` | 087 | 087 | exhaust any user's AI rate limit |
| 45 | `cleanup_ai_generate_rate_limits(p_retention_seconds integer)` | 079 | 079 | run a retention cleanup (deletes rows) on demand |
| 46 | `reserve_ai_spend(p_user uuid, p_estimate numeric)` | 086 | 086 | reserve arbitrary AI spend (fill the global spend cap: denial of AI to everyone) |
| 47 | `release_ai_spend_reservation(p_id uuid)` | 086 | 086 | release any spend reservation (undo the spend cap's admission) |
| 48 | `cleanup_ai_spend_reservations(p_retention_seconds integer)` | 086 | 086 | run a retention cleanup (deletes rows) on demand |
| 49 | `aggregate_ai_usage_stats(p_window_days integer)` | 131 | 114 | read an admin analytics report |
| 50 | `claim_free_narrative(p_user uuid)` | 118 | 118 | burn any user's one free narrative |
| 51 | `release_free_narrative(p_user uuid)` | 118 | 118 | re-open any user's free narrative, own included (unlimited free narratives) |
| 52 | `claim_ai_request(p_user uuid, p_key text, p_ttl_seconds integer)` | 119 | 119 | claim or delete another user's AI idempotency keys |
| 53 | `attach_ai_spend_to_claim(p_user uuid, p_key text, p_spend_id uuid)` | 119 | 119 | attach arbitrary spend ids to another user's AI claim |
| 54 | `purge_dossier_purchases(p_retention_seconds integer)` | 122 | 122 | run a retention cleanup (deletes rows) on demand |
| 55 | `_consume_action_rate_limit(p_uid uuid, p_action text, p_window_seconds integer)` | 125 | 125 | exhaust any user's action rate limit |
| 56 | `cleanup_user_action_rate_limits(p_retention_seconds integer)` | 125 | 125 | run a retention cleanup (deletes rows) on demand |
| 57 | `rollup_analytics_v2_daily(p_day date)` | 133 | 133 | write analytics rollup rows on demand |
| 58 | `report_market_archetype_popularity(p_from date, p_to date)` | 133 | 133 | read an admin analytics report |
| 59 | `report_market_preset_adoption(p_from date, p_to date)` | 133 | 133 | read an admin analytics report |
| 60 | `rollup_intent_atlas_daily(p_day date)` | 134 | 134 | write analytics rollup rows on demand |
| 61 | `_surveyor_byok_secret()` | 139 | 139 | READ THE BYOK SERVER PASSPHRASE (CONFIRMED in PGlite) |
| 62 | `surveyor_byok_set_health(p_user uuid, p_provider text, p_health text, p_error_class text, p_verified boolean)` | 143 | 143 | mark any user's stored key unhealthy (switch off their BYOK) |
| 63 | `write_ai_operation_log(p_user uuid, p_feature text, p_audience text, p_prompt_hash text, p_answer_hash text, p_retrieval_slice_ids text[], p_retrieval_sources text[], p_model text, p_model_version text, p_provider text, p_byok boolean, p_citation_coverage numeric, p_claim_count integer, p_refused boolean, p_spend_id uuid, p_meta_probe boolean, p_canary text, p_refusal_class text)` | 143 | 143 | forge AI operation log rows for any user |
| 64 | `surveyor_usage_precheck(p_user uuid, p_provider text, p_feature text)` | 144 | 144 | read any user's Surveyor usage and settings |
| 65 | `_gallery_public_tile_rows()` | 147 | 147 | read the gallery tile projection directly (public data; owner-only by grant) |
| 66 | `consume_token_bucket(p_key text, p_capacity double precision, p_refill_per_sec double precision, p_cost double precision)` | 156 | 156 | consume or exhaust any key's rate limit (inflict lockouts) |
| 67 | `cleanup_token_buckets(p_retention_seconds integer)` | 156 | 156 | run a retention cleanup (deletes rows) on demand |
| 68 | `_founder_transfer_dial(p_key text, p_default integer)` | 160 | 160 | read an internal config dial |
| 69 | `_seat_buyback_cents()` | 160 | 160 | read an internal config dial |
| 70 | `_seat_stewardship_dial(p_key text, p_default integer)` | 160 | 160 | read an internal config dial |
| 71 | `_log_founder_transfer_event(p_case uuid, p_actor text, p_event text, p_detail jsonb)` | 160 | 160 | forge founder-transfer case events |
| 72 | `has_active_transfer_lock(p_user uuid)` | 160 | 160 | learn whether any user is in a seat transfer |
| 73 | `email_has_active_transfer_lock(p_email text)` | 160 | 160 | probe auth.users by email (transfer-lock oracle) |
| 74 | `_seat_holder_last_active(p_user uuid)` | 164 | 164 | read any user's last-active time |
| 75 | `_buyback_payout_hold_days()` | 164 | 164 | read an internal config dial |
| 76 | `report_client_errors(p_from date, p_to date)` | 167 | 167 | read an admin analytics report |
| 77 | `report_client_error_alert()` | 167 | 167 | read an admin analytics report |
| 78 | `set_gallery_comment_hidden(target_comment_id uuid, hide boolean, hidden_reason_text text, moderator_id uuid)` | 169 | 169 | hide or unhide any gallery comment as any moderator |
| 79 | `admin_soft_delete_map(p_actor uuid, p_id uuid, p_delete boolean, p_reason text)` | 171 | 171 | act as any staff member: the role check reads the actor id the caller passes |
| 80 | `admin_remove_gallery_map(p_actor uuid, p_id uuid, p_reason text)` | 171 | 171 | act as any staff member: the role check reads the actor id the caller passes |
| 81 | `admin_set_content_banned(p_actor uuid, p_kind text, p_id uuid, p_ban boolean, p_reason text)` | 171 | 171 | act as any staff member: the role check reads the actor id the caller passes |
| 82 | `surveyor_byok_set_probe_tier(p_user uuid, p_provider text, p_tier text, p_model text, p_probe_version text, p_profile jsonb)` | 191 | 191 | rewrite any user's key probe tier/profile |
| 83 | `surveyor_byok_get(p_user uuid, p_provider text)` | 191 | 191 | READ ANY USER'S DECRYPTED PROVIDER KEY |
| 84 | `load_sim_metrics(p_rows jsonb)` | 196 | 196 | insert arbitrary simulation metric rows |
| 85 | `rollup_sim_metrics(p_run_id text)` | 196 | 196 | write analytics rollup rows on demand |
| 86 | `append_retention_cohorts(p_day date)` | 198 | 198 | write analytics rollup rows on demand |
| 87 | `report_referral_funnel(p_from date, p_to date)` | 199 | 199 | read an admin analytics report |

## (b) F2 — what a signed-in user can change (CONFIRMED)

**profiles.** The test seeds a user through the real signup trigger. As `authenticated`, it updates each column alone, one transaction per column, rolled back, and calls a column CHANGED when the returned value differs from the value before. **15 change:** `created_at`, `updated_at`, `display_name`, `avatar_url`, `email_notifications`, `model_preference`, `premium_downgraded_at`, `premium_retention_expires_at`, `telemetry_consent`, `first_name`, `last_name`, `preferred_name`, `free_narrative_claimed_at`, `founder_credit_listed`, `public_identity_opt_in`. 12 are refused by the 087 policy's pins.

The columns a user should never set directly:

| column | added by | why |
|---|---|---|
| `free_narrative_claimed_at` | 118 | entitlement: reset it and claim the free narrative again (F2) |
| `premium_downgraded_at`, `premium_retention_expires_at` | 023 | the server's downgrade record; stripe-webhook writes them |
| `founder_credit_listed` | 170 | 170: "`set_founder_credit_listed` — the ONLY user-facing writer", gated on being a founder (the roll also filters `is_founder`, so the effect is the bypass, not a listing) |
| `telemetry_consent` | 036 | 194 writes it through `set_my_telemetry_consent`, which journals each change to `consent_change_records`; a direct write leaves no record |
| `created_at` | 001 | identity the server owns |

`display_name` is written directly by the client today. It bypasses the 195 civility guard, and `src/lib/auth.js :: supabaseUpdateDisplayName` falls back to the direct write whenever the RPC errors, including a civility refusal (PLAUSIBLE: that code is under src/, which is not mine). The client's own direct writes are `display_name`, `avatar_url`, `email_notifications`, `model_preference` and `public_identity_opt_in` (`src/lib/auth.js`, `AccountIdentitySection.jsx`).

**The same shape elsewhere.** These tables carry an UPDATE (or ALL) policy for `public` or `authenticated`: profiles, support_messages (two), deletion_requests (staff), settlements, saved_maps, gallery_comments, founder_seats. Only `support_messages` "Users update own support ticket" has a pin list, and its unpinned columns (email, subject, message, refs, metadata) are user content. **settlements and saved_maps have NO pin list at all** (row-scoped USING / WITH CHECK only, with `access_state = 'active'`). As the owner, in PGlite (CONFIRMED), on a settlement a staff member had banned and soft-deleted:
- publishing was refused by 171's trigger;
- clearing `moderation_banned_at/by/reason` and `admin_deleted_at` then succeeded;
- publishing then succeeded, together with `is_featured`, `featured_order`, `is_curated` and `view_count = 999999`.

saved_maps is the same, plus `import_count`. 171 says these columns are written by "service-role RPCs below; no user policy grants them". The policy does not restrict columns, so that intent does not hold. gallery_comments and founder_seats were not probed (seed failures in the scratch harness: an open item, not a finding).

## (c) What a new migration owes (read, PLAUSIBLE; each a named gate)

- **Number.** 211 is free on the working line (001–210). The paused veil lane holds `211_server_side_share_veil.sql`, frozen as the owner's pack, and its cures in 212 (chair docs 2026-11-12/13). A grants file numbered 211 collides at the join: `tests/security/migrationSequenceAll.pglite.test.js` asserts each number exactly once and the chain gapless. 213 on the line before the veil lands leaves a gap, which reds the same test and `tests/docs/migrationAppliedHead.test.js` (every pending number must exist). Applying 213 to production before 211/212 would also make the CLI refuse the later push without `--include-all` (PLAUSIBLE, CLI knowledge). `supabase/applied-head.json` (203) is read by `scripts/check-migration-head.mjs` and `migrationAppliedHead.test.js`; it is bumped only in the owner's deploy act.
- **The rehearsal manifest.** `scripts/ops/migrationRehearsalCore.mjs :: MIGRATION_WAVES` gets a new wave entry, and `tests/ops/migrationRehearsal.test.js` pins `repoHead` 210, `pendingCount` 89 and the waves list.
- **Rollback.** `profiles` is in `tests/docs/migrationRollbackDiscipline.test.js :: MONEY_PII_TABLES`, so the file needs an inline `-- @rollback:` note or a `supabase/rollback/<n>_*.down.sql`.
- **Counts.** `tests/docs/docCounts.test.js`: DEPLOY.md and ARCHITECTURE.md state the migration count.
- **Policy restatement.** `tests/security/profileEscalation.pglite.test.js` derives the net-current profiles policy by regex replay, so a restatement must keep the `create policy "…" on public.profiles … ;` form. `tests/lint/migrationSearchPathPin.test.js` applies only if a function is created.
- **Test.** The new security test is a pglite file under `tests/security/`. `tests/lint` is run whole after it.

## The proposed shape of the fix (for the chair's ruling; nothing built)

1. **Grants.** One migration revokes EXECUTE, by exact signature, from `public, anon, authenticated` on the 87 functions of THE LIST plus `_audit_action`. It re-grants `service_role` only where the migrations granted it (SERVER), and nothing for NOBODY. No blanket statement. It is safe to run twice. The 40 checked SERVER functions and 8 invoker SERVER functions could join the same list (defense in depth, the 113 shape); that is the ruling's to say. A recommended addition, also the ruling's: `alter default privileges in schema public revoke execute on functions from anon, authenticated` (the owner's role), so that a NEW function is closed until a migration grants it. That changes the platform default for every later migration, and the ruling must weigh it.
2. **profiles.** The forbidden-list policy has been patched four times for a missed column (059, 061, 075, 087). I recommend an ALLOWED list in the database itself: `revoke update on public.profiles from anon, authenticated; grant update (display_name, avatar_url, email_notifications, model_preference, public_identity_opt_in) on public.profiles to authenticated;`, the five columns the client writes. `first_name`, `last_name` and `preferred_name` are added if the ruling keeps them user-writable; no direct client writer was found. A new column is then closed by default, and `updated_at` is set by the trigger, which needs no column grant. The 087 policy is restated as it is (the security reader may prefer both). The alternative, the brief's shape, is to restate 087 with `free_narrative_claimed_at`, `premium_downgraded_at`, `premium_retention_expires_at`, `founder_credit_listed`, `telemetry_consent` and `created_at` pinned.
3. **settlements / saved_maps** (outside F1/F2: the ruling's). A BEFORE UPDATE trigger in the 171 idiom refuses a change, when `current_user` is `anon` or `authenticated`, to `moderation_banned_at/by/reason`, `admin_deleted_at`, `is_featured`, `featured_order`, `is_curated`, `curated_order`, `view_count`, `import_count`, `retention_expires_at`, `inactive_reason`, `inactive_since` and `reactivated_free_at`. It tests `current_user`, not the JWT claim, so that the SECURITY DEFINER RPCs (045/088 view counts, 065 import counts, 171 bans) still write.
4. **Number.** 213, landing after the veil's 211/212, unless the chair or the owner rules otherwise. The plain file, (2)(ii), lets the owner apply the protection by hand now without touching the numbering; the migration re-applies it idempotently later.
5. **Tests.**
   - A pglite test runs the chain under the hosted defaults with a REGISTER that classes every SECURITY DEFINER function; an unclassed one reds, and no SERVER-class function may be executable by `anon` or `authenticated`.
   - A test that a signed-in user can change no `profiles` column outside the ALLOWED list.
   - If item 3 is ruled in, the same test on settlements and saved_maps.
   - Each test is seen red before the fix and green after.

## The chair's four additions (2026-11-24 15:14 UTC; every signature is generated from the PGlite catalog)

Scripts and outputs: `measure/` beside this file. `boot.mjs` is the harness; `catalog.mjs` writes `out/functions.json`, `policies.json`, `views.json` and `bodies.json` (the last not committed; it is regenerated in 4 s). `generate.mjs` writes the three files below. `probe-*.mjs` are the executions cited above. Run each from the repository root.

1. **THE READ-ONLY CHECK: `measure/out/owner-read-check.sql`.** Block 1 lists all 247 functions classed SERVER or NOBODY, by regprocedure, through `to_regprocedure` (a function production lacks reads NULL, never an error), with `has_function_privilege` for `anon` and `authenticated`. Block 2 is `select count(*) from public.surveyor_byok_keys`. CONFIRMED to run in PGlite: before the revoke, 135 of 247 are executable by each role.
2. **THE REVOKE BLOCK: `measure/out/revoke-block.sql`.** It holds 245 lines, one `revoke execute on function <regprocedure> from anon, authenticated;` per function (112 already closed, kept for idempotence). Two are left out because a user path needs them (below).
   - **GROUP 1 (21)** guards secrets and other users' data: the BYOK passphrase and keys, billing and diagnostics, a user's security question, unsubscribe token and last activity, the email lookups, recovery locks, worker queues that hand back rows, and client-error reports.
   - **GROUP 2 (84)** guards another user's account, entitlements and money: tier, credits, refunds, bans, warnings, deletions, tickets, recovery lockouts, the free narrative, surveyor and dossier entitlements, referrals and redemptions, founder seats and transfers, the forged-actor admin RPCs, and the audit log.
   - **GROUP 3 (140)**: reports, rollups, cleanups, rate limits, crons, workers and internal helpers.

   CONFIRMED in PGlite: the block applies twice without error, and afterwards exactly 2 of the 247 stay executable (the two kept below). The only function the block names that production (203) lacks is `report_engine_generations()` (204, already closed); the owner's hand-run copy drops that line.
3. **APART: meant for users, taking a user or actor id: `measure/out/grants-measure-extra.md` §(3).** The table holds 51 id arguments. Read by hand, the ones with no tie to the caller that matter are:
   - `has_role(uuid,text[])` (USER, 050): an oracle for "is this id staff?", which feeds the forged `p_actor` RPCs;
   - `account_is_active(uuid)` (USER, used in RLS policies, so not revocable): reads any user's moderation state;
   - `profile_has_premium_access(uuid)` (ANYONE): reads any user's premium state;
   - `_audit_action(…)` (UNSTATED, PUBLIC even in vanilla Postgres): writes an admin-audit row under any actor.

   None of the four has a caller in `src/`. The others the regex flags take settlement or comment ids, or check the caller's own role (`set_featured`/`set_curated`), or pass `p_expected_owner` on to a checking delegate (`apply_custom_content_command`, PLAUSIBLE). Kept out of the block, because a user path needs them: `_gallery_sanitize_public_json(jsonb,text[])` (called by the invoker `_gallery_apply_member_overrides`) and `_gallery_world_snapshot_is_safe(jsonb)` (called by the invoker trigger `_saved_maps_world_snapshot_guard`). Both are invoker helpers with no secret; on the hosted default, anon can call them directly. The ruling may leave them, or grant them to `authenticated` by name.
4. **DEFAULT PRIVILEGES: `measure/probe-defaults.mjs`, CONFIRMED in PGlite.**
   - `alter default privileges for role postgres in schema public revoke execute on functions from anon, authenticated` alone does NOT hold. A new function still gets PUBLIC's built-in EXECUTE, so anon can call it.
   - Adding the GLOBAL `alter default privileges for role postgres revoke execute on functions from public` (no `in schema`) does hold: a new function is executable by `service_role` only, and a named `grant … to authenticated` still works.
   - Neither touches an EXISTING function, and `create or replace` keeps the old ACL. The by-name block is needed either way.
   - Browser `rpc(` calls that rely on the hosted default for a SIGNED-IN user: **0**. For a LOGGED-OUT browser, 32 USER functions are reachable only through the default (list in the extras); their pages are presumably signed-in only (PLAUSIBLE).
   - Browser calls to never-granted functions: 0.
   - So the hardening would break no page today. A later migration that drops and recreates a browser-called function would need its grant written by name: PLAUSIBLE, and a test should pin it.
   - That the platform lets `postgres` alter its own defaults is PLAUSIBLE.
