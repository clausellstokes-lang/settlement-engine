# Function grants catalogue — chain 001..203 (origin/master), 2026-11-20 01:45 UTC

Every function of schema `public` that `anon` or `authenticated` may EXECUTE (`has_function_privilege`) on a scratch
PostgreSQL 16 holding origin/master's migrations 001..203 (db832c892) under the Supabase-like scaffold
(`proof/scaffold.sql`). Extension members (pgcrypto) are excluded. **283 functions.**

Counts by class: **INTERNAL — revoked now** 157; **DOOR THAT TRUSTS A PARAMETER** 1; **DELIBERATE DOOR** 85; **VISITOR-NEEDED — left alone** 12; **INTERNAL — invoker helper, for 213** 15; **TRIGGER — left alone** 13.

How each column was read (the catalogue of the chain, and the tree at origin/master):
* **callers**: `browser` = a `.rpc('name'` call in `src/` or `api/` (multi-line aware, `proof/inputs/browser_rpc_all.txt`);
  `edge(user token)` = an edge function's client built with the caller's own JWT, which runs as `authenticated`;
  `edge(service)` = an edge client built with the service key (`proof/inputs/edge_rpc_all.txt`); `scripts(service)` =
  `scripts/`, which use the service key; `RLS policy` / `check constraint` / `trigger` = a catalogue dependency
  (`pg_depend`); `sql:` = another function whose body names it (`[D]` definer, `[I]` invoker: an invoker caller runs as
  the visitor, so the visitor needs the grant).
* **caller check**: a text scan of the body (comments stripped) for `auth.uid()`, a role or JWT test, or a privilege
  helper (`current_user_is_privileged`, `has_role`, `_assert_service_admin_actor`, …). "none" on a DEFINER function
  means nothing inside stops a caller who names any user or row.
* **writes / reads**: tables named after `insert into` / `update` / `delete from`, and after `from` / `join` (text scan).
* **anon before**: calling it as `anon` with placeholder arguments on the chain BEFORE the script (`proof/harness.sh`,
  each call rolled back). `OK` = it ran to completion as anon.

| function | sec | anon | auth | class | callers | caller check | writes | reads | anon before |
|---|---|---|---|---|---|---|---|---|---|
| `_assert_service_admin_actor(uuid)` | DEFINER | Y | Y | INTERNAL — revoked now | sql: service_adjust_credits[D],service_set_credits[D],service_update_profile_metadata | role/jwt | — | profiles | ERR service role required (got: anon) |
| `_audit_action(uuid,uuid,text,jsonb,jsonb,text)` | DEFINER | Y | Y | INTERNAL — revoked now | sql: admin_grant_credits[D],admin_set_role[D],admin_user_full[D],refund_credits[D],re | none (trusts its parameters) | admin_actions | — | OK rows=1 |
| `_buyback_payout_hold_days()` | DEFINER | Y | Y | INTERNAL — revoked now | sql: claim_due_buyback_payout[D] | none (trusts its parameters) | — | system_config | OK rows=1 |
| `_consume_action_rate_limit(uuid,text,integer)` | DEFINER | Y | Y | INTERNAL — revoked now | sql: add_gallery_comment[D],report_gallery_comment[D],report_gallery_map[D],toggle_ga | none (trusts its parameters) | user_action_rate_limits | now | OK rows=1 |
| `_founder_transfer_dial(text,integer)` | DEFINER | Y | Y | INTERNAL — revoked now | sql: expire_stale_transfer_cases[D],transfer_case_finalize[D],transfer_case_mark_paid | none (trusts its parameters) | — | system_config | OK rows=1 |
| `_gallery_public_tile_rows()` | DEFINER | Y | Y | INTERNAL — revoked now | sql: get_gallery_dossier[D],list_gallery_dossiers[D],list_gallery_more_by_creator[D], | none (trusts its parameters) | — | gallery_comments, gallery_reactions, gallery_votes, settlements | OK rows=1 |
| `_log_founder_transfer_event(uuid,text,text,jsonb)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service); sql: expire_stale_transfer_cases[D],issue_transfer_challenge[D],reelect_transfer_payo | none (trusts its parameters) | founder_transfer_events | — | ERR new row for relation "founder_transfer_events" violates  |
| `_seat_buyback_cents()` | DEFINER | Y | Y | INTERNAL — revoked now | sql: claim_founder_seat_buyback[D],sweep_seat_abandonment[D] | none (trusts its parameters) | — | system_config | OK rows=1 |
| `_seat_holder_last_active(uuid)` | DEFINER | Y | Y | INTERNAL — revoked now | sql: sweep_seat_abandonment[D],sweep_seat_dormancy_nudges[D] | none (trusts its parameters) | — | current_account_session, profiles | OK rows=1 |
| `_seat_stewardship_dial(text,integer)` | DEFINER | Y | Y | INTERNAL — revoked now | sql: sweep_seat_abandonment[D],sweep_seat_dormancy_nudges[D] | none (trusts its parameters) | — | system_config | OK rows=1 |
| `_surveyor_byok_secret()` | DEFINER | Y | Y | INTERNAL — revoked now | sql: surveyor_byok_get[D],surveyor_byok_set[D] | none (trusts its parameters) | — | — | OK rows=1 |
| `add_internal_note(uuid,uuid,text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | priv-helper | internal_notes | — | ERR not authorized |
| `admin_billing_summary(uuid,uuid)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | priv-helper | — | profiles | ERR not authorized |
| `admin_diagnostic_bundle(uuid,uuid,boolean,text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | priv-helper | — | profiles | ERR not authorized |
| `admin_grant_credits(uuid,integer,text)` | DEFINER | Y | Y | INTERNAL — revoked now | — | auth.uid(), priv-helper | credit_ledger, credit_transactions, profiles | — | ERR not authorized |
| `admin_list_internal_notes(uuid)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | priv-helper | — | internal_notes | ERR not authorized |
| `admin_list_warnings(uuid)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | priv-helper | — | warnings | ERR not authorized |
| `admin_remove_gallery_item(uuid,uuid,text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | priv-helper | settlements | — | ERR not authorized |
| `admin_remove_gallery_map(uuid,uuid,text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | priv-helper | saved_maps | — | ERR not authorized |
| `admin_revoke_share_link(uuid,uuid,text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | priv-helper | settlements | — | ERR not authorized |
| `admin_set_content_banned(uuid,text,uuid,boolean,text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | priv-helper | saved_maps, settlements | — | ERR not authorized |
| `admin_set_role(uuid,text)` | DEFINER | Y | Y | INTERNAL — revoked now | — | auth.uid(), priv-helper | profiles | — | ERR not authorized |
| `admin_soft_delete_map(uuid,uuid,boolean,text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | priv-helper | saved_maps | — | ERR not authorized |
| `admin_soft_delete_settlement(uuid,uuid,boolean,text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | priv-helper | settlements | — | ERR not authorized |
| `admin_support_messages(text,integer)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | priv-helper | — | support_messages | ERR not authorized |
| `admin_user_full(uuid,text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | auth.uid(), priv-helper | — | pg_namespace, pg_proc, profiles | ERR not authorized: full PII requires admin or developer |
| `admin_user_summary(uuid)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | priv-helper | — | profiles, settlements, support_messages, warnings | ERR not authorized |
| `aggregate_ai_usage_stats(integer)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | none (trusts its parameters) | — | ai_usage_events | OK rows=1 |
| `analytics_monthly_prune()` | DEFINER | Y | Y | INTERNAL — revoked now | scripts(service) | none (trusts its parameters) | analytics_events, edit_events, ingest_rate_buckets, settlement_snapshots | analytics_retention_cohorts, export_cursors | OK rows=1 |
| `analytics_nightly_maintenance()` | DEFINER | Y | Y | INTERNAL — revoked now | scripts(service) | none (trusts its parameters) | — | — | OK rows=1 |
| `append_retention_cohorts(date)` | DEFINER | Y | Y | INTERNAL — revoked now | scripts(service); sql: analytics_nightly_maintenance[D] | none (trusts its parameters) | analytics_retention_cohorts | analytics_device_links, analytics_events, analytics_identity_links | OK rows=1 |
| `apply_redemption(text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | redemptions | redeem_codes | ERR apply_redemption is service-role only (got: anon) |
| `assert_current_session()` | DEFINER | Y | Y | INTERNAL — revoked now | sql: spend_credits[D] | none (trusts its parameters) | — | — | OK rows=1 |
| `attach_ai_spend_to_claim(uuid,text,uuid)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | none (trusts its parameters) | ai_request_claims | — | OK rows=1 |
| `bind_redemption_session(uuid,text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | redemptions | — | ERR bind_redemption_session is service-role only (got: anon) |
| `bump_map_import(text)` | DEFINER | Y | Y | INTERNAL — revoked now | — | auth.uid() | map_imports, saved_maps | — | OK rows=1 |
| `cancel_stale_auto_reload_attempts()` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | credit_auto_reload_attempts | — | ERR cancel_stale_auto_reload_attempts is service-role only ( |
| `claim_ai_request(uuid,text,integer)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | none (trusts its parameters) | ai_request_claims | — | OK rows=1 |
| `claim_auto_reload_payment_intent(uuid,uuid,text,integer,integer)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | credit_auto_reload_attempts | — | ERR claim_auto_reload_payment_intent is service-role only (g |
| `claim_dossier_purchase_by_session(text,uuid,uuid)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | dossier_entitlements, single_dossier_purchases | settlements | ERR claim_dossier_purchase_by_session is service-role only ( |
| `claim_due_buyback_payout()` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | founder_seat_buybacks, skip | — | ERR claim_due_buyback_payout is service-role only (got: anon |
| `claim_due_transfer_payout()` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | founder_transfer_cases, skip | — | ERR claim_due_transfer_payout is service-role only (got: ano |
| `claim_founder_seat_buyback(uuid,text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | founder_seat_buybacks, founder_seat_transfers, founder_seats, profiles | — | ERR claim_founder_seat_buyback is service-role only (got: an |
| `claim_free_narrative(uuid)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | none (trusts its parameters) | profiles | — | OK rows=1 |
| `claim_next_founder_seat(uuid)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | founder_seats, skip | — | ERR claim_next_founder_seat is service-role only (got: anon) |
| `claim_ticket(uuid,uuid)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | priv-helper | support_messages | — | ERR not authorized |
| `clawback_dossier_entitlement(text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | dossier_entitlements, single_dossier_purchases | — | ERR clawback_dossier_entitlement is service-role only (got:  |
| `clawback_referral(text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | referrals | — | ERR clawback_referral is service-role only (got: anon) |
| `cleanup_ai_generate_rate_limits(integer)` | DEFINER | Y | Y | INTERNAL — revoked now | — | none (trusts its parameters) | ai_generate_rate_limits | — | OK rows=1 |
| `cleanup_ai_spend_reservations(integer)` | DEFINER | Y | Y | INTERNAL — revoked now | — | none (trusts its parameters) | ai_spend_reservations | — | OK rows=1 |
| `cleanup_dossier_verify_rate_limits(integer)` | DEFINER | Y | Y | INTERNAL — revoked now | — | none (trusts its parameters) | dossier_verify_rate_limits | — | OK rows=1 |
| `cleanup_email_rate_limits(integer)` | DEFINER | Y | Y | INTERNAL — revoked now | — | none (trusts its parameters) | email_rate_limits | — | OK rows=1 |
| `cleanup_recovery_rate_limits(integer)` | DEFINER | Y | Y | INTERNAL — revoked now | — | none (trusts its parameters) | recovery_rate_limits | — | OK rows=1 |
| `cleanup_token_buckets(integer)` | DEFINER | Y | Y | INTERNAL — revoked now | — | none (trusts its parameters) | token_buckets | — | OK rows=1 |
| `cleanup_user_action_rate_limits(integer)` | DEFINER | Y | Y | INTERNAL — revoked now | — | none (trusts its parameters) | user_action_rate_limits | — | OK rows=1 |
| `consume_ai_generate_rate_limit(uuid,integer,integer)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | none (trusts its parameters) | ai_generate_rate_limits | now, system_config | OK rows=1 |
| `consume_dossier_verify_rate_limit(text,integer,integer)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | none (trusts its parameters) | dossier_verify_rate_limits | now | OK rows=1 |
| `consume_email_rate_limit(text,text,integer,integer,integer)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | none (trusts its parameters) | email_rate_limits | now | OK rows=1 |
| `consume_recovery_rate_limit(text,text,integer,integer,integer)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | none (trusts its parameters) | recovery_rate_limits | now | OK rows=1 |
| `consume_token_bucket(text,double precision,double precision,double precision)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | none (trusts its parameters) | token_buckets | — | OK rows=1 |
| `current_user_has_role(text[])` | DEFINER | Y | Y | INTERNAL — revoked now | — | auth.uid(), priv-helper | — | — | OK rows=1 |
| `dismiss_operator_message(uuid)` | DEFINER | - | Y | INTERNAL — revoked now | — | auth.uid() | operator_message_receipts | get_my_operator_message | ERR permission denied for function dismiss_operator_message |
| `email_has_active_transfer_lock(text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | none (trusts its parameters) | — | users | OK rows=1 |
| `expire_stale_transfer_cases()` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | founder_transfer_cases | — | ERR expire_stale_transfer_cases is service-role only (got: a |
| `founder_buyback_enabled()` | DEFINER | Y | Y | INTERNAL — revoked now | — | none (trusts its parameters) | — | system_config | OK rows=1 |
| `founder_transfer_enabled()` | DEFINER | Y | Y | INTERNAL — revoked now | — | none (trusts its parameters) | — | system_config | OK rows=1 |
| `free_narrative_available(uuid)` | DEFINER | - | Y | INTERNAL — revoked now | — | auth.uid(), priv-helper | — | profiles, uid | ERR permission denied for function free_narrative_available |
| `gen_account_number()` | DEFINER | Y | Y | INTERNAL — revoked now | sql: handle_new_user[D] | none (trusts its parameters) | — | profiles | OK rows=1 |
| `gen_external_name()` | DEFINER | Y | Y | INTERNAL — revoked now | sql: handle_new_user[D] | none (trusts its parameters) | — | profiles | OK rows=1 |
| `get_my_operator_message(uuid)` | DEFINER | - | Y | INTERNAL — revoked now | sql: dismiss_operator_message[D],mark_operator_message_read[D] | auth.uid() | — | operator_message_receipts, operator_messages | ERR permission denied for function get_my_operator_message |
| `grant_dossier_entitlement(uuid,uuid,text,text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | dossier_entitlements | settlements | ERR grant_dossier_entitlement is service-role only (got: ano |
| `grant_referral(uuid,text,integer)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | referrals | — | ERR grant_referral is service-role only (got: anon) |
| `handle_premium_downgrade(uuid)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service); sql: transfer_case_finalize[D] | none (trusts its parameters) | profiles, saved_maps, settlements | — | OK rows=1 |
| `has_active_transfer_lock(uuid)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service); sql: claim_founder_seat_buyback[D],email_has_active_transfer_lock[D] | none (trusts its parameters) | — | founder_transfer_cases | OK rows=1 |
| `has_role(uuid,text[])` | DEFINER | Y | Y | INTERNAL — revoked now | sql: acknowledge_operational_obligation[D],add_internal_note[D],admin_billing_summary | none (trusts its parameters) | — | profiles | OK rows=1 |
| `import_gallery_map(text)` | DEFINER | Y | Y | INTERNAL — revoked now | sql: bump_map_import[D] | auth.uid() | — | saved_maps | OK rows=1 |
| `ingest_check_rate(text,integer,integer)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | none (trusts its parameters) | ingest_rate_buckets | now | OK rows=1 |
| `issue_buyback_challenge(uuid)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | founder_seat_buyback_challenges | — | ERR issue_buyback_challenge is service-role only (got: anon) |
| `issue_transfer_challenge(uuid,text,text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | founder_transfer_challenges | founder_transfer_cases, founder_transfer_events | ERR issue_transfer_challenge is service-role only (got: anon |
| `link_ticket_faq(uuid,uuid,text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | priv-helper | support_messages | — | ERR not authorized |
| `list_ticket_pool(text,integer)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | priv-helper | — | profiles, support_messages | ERR not authorized |
| `load_sim_metrics(jsonb)` | DEFINER | Y | Y | INTERNAL — revoked now | scripts(service) | none (trusts its parameters) | world_sim_metrics | — | ERR load_sim_metrics expects a jsonb array of metric rows |
| `mark_low_balance_notified(uuid,text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | credit_auto_reload_settings | p_bucket | ERR mark_low_balance_notified is service-role only (got: ano |
| `merge_neighbour_backlink(uuid,text,uuid,jsonb,jsonb)` | DEFINER | Y | Y | INTERNAL — revoked now | — | auth.uid() | settlements | — | ERR not authenticated |
| `persist_world_pulse_advance(uuid,jsonb,jsonb,bigint)` | DEFINER | Y | Y | INTERNAL — revoked now | — | auth.uid() | saved_maps, settlements | — | ERR not authenticated |
| `post_ticket_reply(uuid,uuid,text,text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | priv-helper | support_messages, support_ticket_events | profiles | ERR ticket not found |
| `profile_has_premium_access(uuid)` | DEFINER | Y | Y | INTERNAL — revoked now | — | none (trusts its parameters) | — | profiles | OK rows=1 |
| `purge_analytics_for_user(uuid)` | DEFINER | Y | Y | INTERNAL — revoked now | — | none (trusts its parameters) | analytics_device_links, analytics_events, analytics_identity_links, edit_events, settlemen | — | OK rows=1 |
| `purge_dossier_purchases(integer)` | DEFINER | Y | Y | INTERNAL — revoked now | — | none (trusts its parameters) | dossier_purchases | — | OK rows=1 |
| `purge_expired_plan_inactive_assets()` | DEFINER | Y | Y | INTERNAL — revoked now | — | none (trusts its parameters) | saved_maps, settlements | dossier_entitlements | OK rows=1 |
| `purge_expired_plan_inactive_settlements()` | DEFINER | Y | Y | INTERNAL — revoked now | — | none (trusts its parameters) | settlements | — | OK rows=1 |
| `record_referral_grant_detail(uuid,text,text,text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | referrals | — | ERR record_referral_grant_detail is service-role only (got:  |
| `reelect_transfer_payout(uuid,uuid)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | founder_transfer_cases | — | ERR reelect_transfer_payout is service-role only (got: anon) |
| `release_ai_spend_reservation(uuid)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | none (trusts its parameters) | ai_spend_reservations | — | OK rows=1 |
| `release_founder_seat_on_clawback(uuid)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | founder_seat_transfers, founder_seats | — | ERR release_founder_seat_on_clawback is service-role only (g |
| `release_free_narrative(uuid)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | none (trusts its parameters) | profiles | — | OK rows=1 |
| `report_ai_usage(date,date)` | DEFINER | Y | Y | INTERNAL — revoked now | — | none (trusts its parameters) | — | v_ai_usage | OK rows=0 |
| `report_channel_funnel(date,date)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | none (trusts its parameters) | — | analytics_events | OK rows=0 |
| `report_client_error_alert()` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | none (trusts its parameters) | — | client_error_events, recent | OK rows=1 |
| `report_client_errors(date,date)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | none (trusts its parameters) | — | client_error_events | OK rows=0 |
| `report_config_variance(text,date,date)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | none (trusts its parameters) | — | analytics_events | ERR structure of query does not match function result type |
| `report_crosstab(text,text,date,date,integer)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | none (trusts its parameters) | — | analytics_events | ERR invalid row field: x |
| `report_distribution(text,date,date,text,integer)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | none (trusts its parameters) | — | — | ERR invalid field: x |
| `report_edit_heatmap(date,date)` | DEFINER | Y | Y | INTERNAL — revoked now | — | none (trusts its parameters) | — | v_edit_heatmap | OK rows=0 |
| `report_funnel(date,date)` | DEFINER | Y | Y | INTERNAL — revoked now | — | none (trusts its parameters) | — | v_funnel_first_gen | OK rows=0 |
| `report_gallery_map(uuid,text,text)` | DEFINER | Y | Y | INTERNAL — revoked now | — | auth.uid() | gallery_map_reports | saved_maps | ERR Sign in to report a map |
| `report_market_archetype_popularity(date,date)` | DEFINER | Y | Y | INTERNAL — revoked now | — | none (trusts its parameters) | — | analytics_events | OK rows=0 |
| `report_market_preset_adoption(date,date)` | DEFINER | Y | Y | INTERNAL — revoked now | — | none (trusts its parameters) | — | analytics_events | OK rows=0 |
| `report_npc_distribution(text,date,date)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | none (trusts its parameters) | — | settlement_snapshots | ERR invalid npc field: x |
| `report_preferences(date,date)` | DEFINER | Y | Y | INTERNAL — revoked now | — | none (trusts its parameters) | — | v_settlement_preferences | OK rows=0 |
| `report_proposal_decisions(date,date)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | none (trusts its parameters) | — | analytics_events | OK rows=0 |
| `report_pulse_mutations(date,date)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | none (trusts its parameters) | — | world_pulse_effects | OK rows=0 |
| `report_referral_funnel(date,date)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service); scripts(service) | none (trusts its parameters) | — | moments, referrals | OK rows=0 |
| `report_regional_arcs(date,date)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | none (trusts its parameters) | — | analytics_events | OK rows=0 |
| `report_regional_impacts(date,date)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | none (trusts its parameters) | — | analytics_events | OK rows=0 |
| `report_regional_propagation(date,date)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | none (trusts its parameters) | — | analytics_events | OK rows=0 |
| `report_retention()` | DEFINER | Y | Y | INTERNAL — revoked now | scripts(service) | none (trusts its parameters) | — | analytics_retention_cohorts | OK rows=0 |
| `report_stressor_genesis(date,date)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | none (trusts its parameters) | — | analytics_events, world_pulse_effects | OK rows=0 |
| `report_summary(date,date)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | none (trusts its parameters) | — | analytics_events, edit_events | OK rows=16 |
| `report_trend(text,text,date,date)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | none (trusts its parameters) | — | analytics_events, data, edit_events, series | ERR invalid granularity: x |
| `reserve_ai_spend(uuid,numeric)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service); sql: record_referral_intent[D] | none (trusts its parameters) | ai_spend_reservations | ai_usage_events, system_config | OK rows=1 |
| `reserve_redemption(text,uuid,text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service); sql: validate_redeem_code[D] | role/jwt | redeem_codes, redemptions | — | ERR reserve_redemption is service-role only (got: anon) |
| `revert_redemption(text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | redeem_codes, redemptions | — | ERR revert_redemption is service-role only (got: anon) |
| `revoke_map_unlisted(uuid)` | DEFINER | Y | Y | INTERNAL — revoked now | — | auth.uid() | saved_maps | — | ERR not authenticated |
| `revoke_surveyor_entitlement(uuid,text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | surveyor_entitlements | — | ERR revoke_surveyor_entitlement is service-role only (got: a |
| `revoke_surveyor_entitlement_by_subscription(text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | surveyor_entitlements | — | ERR revoke_surveyor_entitlement_by_subscription is service-r |
| `rollup_analytics_daily(date)` | DEFINER | Y | Y | INTERNAL — revoked now | sql: analytics_nightly_maintenance[D] | none (trusts its parameters) | analytics_daily_rollups | analytics_events | OK rows=1 |
| `rollup_analytics_v2_daily(date)` | DEFINER | Y | Y | INTERNAL — revoked now | sql: analytics_nightly_maintenance[D] | none (trusts its parameters) | analytics_daily_rollups | analytics_events | OK rows=1 |
| `rollup_intent_atlas_daily(date)` | DEFINER | Y | Y | INTERNAL — revoked now | scripts(service); sql: analytics_nightly_maintenance[D] | none (trusts its parameters) | analytics_daily_rollups | clusters, edit_events | OK rows=1 |
| `rollup_sim_metrics(text)` | DEFINER | Y | Y | INTERNAL — revoked now | scripts(service) | none (trusts its parameters) | — | world_sim_metrics | OK rows=0 |
| `service_adjust_credits(uuid,uuid,integer,text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | priv-helper | admin_actions, credit_ledger, credit_transactions, profiles | — | ERR service role required (got: anon) |
| `set_account_disabled(uuid,uuid,boolean,text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | priv-helper | profiles | — | ERR not authorized: disabling an account requires admin or d |
| `set_founder_display_optin(text,text)` | DEFINER | Y | Y | INTERNAL — revoked now | — | auth.uid() | founder_seats | — | ERR sign-in required |
| `set_gallery_comment_hidden(uuid,boolean,text,uuid)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | none (trusts its parameters) | gallery_comments | — | OK rows=1 |
| `set_ticket_status(uuid,uuid,text,text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | priv-helper | support_messages, support_ticket_events | profiles | ERR not authorized |
| `surveyor_byok_get(uuid,text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service); scripts(service) | none (trusts its parameters) | — | surveyor_byok_keys | OK rows=1 |
| `surveyor_byok_set_health(uuid,text,text,text,boolean)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | none (trusts its parameters) | surveyor_byok_keys | — | ERR invalid byok health class: x |
| `surveyor_byok_set_probe_tier(uuid,text,text,text,text,jsonb)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service); scripts(service) | none (trusts its parameters) | surveyor_byok_keys | — | ERR invalid byok probe tier: x |
| `surveyor_stage_enabled(text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service); scripts(service) | none (trusts its parameters) | — | system_config | OK rows=1 |
| `surveyor_usage_precheck(uuid,text,text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | none (trusts its parameters) | — | ai_usage_events, surveyor_user_settings, system_config | OK rows=1 |
| `sweep_seat_abandonment()` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | founder_seat_transfers, founder_seats, money_events, profiles | — | ERR sweep_seat_abandonment is service-role only (got: anon) |
| `sweep_seat_dormancy_nudges()` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | founder_seats | — | ERR sweep_seat_dormancy_nudges is service-role only (got: an |
| `system_clawback_credits(text,text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service); scripts(service) | role/jwt | credit_grant_idempotency, credit_ledger, credit_transactions, profiles | — | ERR system_clawback_credits is service-role only |
| `transfer_case_abort(uuid,text,text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | founder_transfer_cases | — | ERR transfer_case_abort is service-role only (got: anon) |
| `transfer_case_bind_nominee(uuid,uuid)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | founder_transfer_cases | founder_seats, users | ERR transfer_case_bind_nominee is service-role only (got: an |
| `transfer_case_finalize(uuid)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | founder_seat_transfers, founder_seats, founder_transfer_cases, profiles | — | ERR transfer_case_finalize is service-role only (got: anon) |
| `transfer_case_mark_awaiting_payment(uuid,text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | founder_transfer_cases | — | ERR transfer_case_mark_awaiting_payment is service-role only |
| `transfer_case_mark_paid(uuid,text,integer)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | founder_transfer_cases | — | ERR transfer_case_mark_paid is service-role only (got: anon) |
| `transfer_case_open(smallint,uuid,text,text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | founder_transfer_cases | founder_seats, p_from, profiles, true, users | ERR transfer_case_open is service-role only (got: anon) |
| `transfer_case_regress_awaiting_payment(text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | founder_transfer_cases | — | ERR transfer_case_regress_awaiting_payment is service-role o |
| `transfer_case_reverse(uuid,text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | founder_seat_transfers, founder_seats, founder_transfer_cases, profiles | — | ERR transfer_case_reverse is service-role only (got: anon) |
| `update_external_name(text)` | DEFINER | Y | Y | INTERNAL — revoked now | — | auth.uid() | profiles | reserved_external_names | ERR not authenticated |
| `update_profile_names(text,text,text)` | DEFINER | Y | Y | INTERNAL — revoked now | — | auth.uid() | profiles | — | ERR not authenticated |
| `verify_buyback_challenge(uuid,text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | founder_seat_buyback_challenges | — | ERR verify_buyback_challenge is service-role only (got: anon |
| `verify_transfer_challenge(uuid,text,text,text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | role/jwt | founder_transfer_challenges | founder_transfer_events | ERR verify_transfer_challenge is service-role only (got: ano |
| `write_ai_operation_log(uuid,text,text,text,text,text[],text[],text,text,text,boolean,numeric,integer,boolean,uuid,boolean,text,text)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service) | none (trusts its parameters) | ai_operation_log | — | OK rows=1 |
| `write_audit(text,uuid,text,text,text,jsonb,jsonb,boolean,boolean,boolean,uuid)` | DEFINER | Y | Y | INTERNAL — revoked now | edge(service); sql: acknowledge_operational_obligation[D],add_internal_note[D],admin_billing_summary | auth.uid() | audit_log | profiles | OK rows=1 |
| `account_is_active(uuid)` | DEFINER | Y | Y | DOOR THAT TRUSTS A PARAMETER | edge(service); RLS policy; sql: _apply_custom_content_command_authorable[D],add_gallery_comment[D],apply_create_ | none (trusts its parameters) | — | profiles | OK rows=1 |
| `add_gallery_comment(uuid,text)` | DEFINER | Y | Y | DELIBERATE DOOR | browser; scripts(service) | auth.uid() | gallery_comments | settlements | ERR Sign in to comment |
| `apply_create_route_command(uuid,text,uuid,uuid,timestamp with time zone,jsonb,jsonb,jsonb,jsonb,jsonb,jsonb,jsonb,jsonb,jsonb)` | DEFINER | - | Y | DELIBERATE DOOR | browser; scripts(service) | auth.uid() | settlements | p_event, p_expected_ai_data, p_expected_campaign_state, p_expected_data, p_partner_expecte | ERR permission denied for function apply_create_route_comman |
| `apply_custom_content_command(uuid,text,text,jsonb)` | DEFINER | - | Y | DELIBERATE DOOR | browser; scripts(service) | auth.uid() | — | custom_content_definitions | ERR permission denied for function apply_custom_content_comm |
| `apply_cut_trade_route_command(uuid,text,uuid,timestamp with time zone,jsonb,jsonb,jsonb,jsonb,jsonb,jsonb,jsonb)` | DEFINER | - | Y | DELIBERATE DOOR | browser; scripts(service) | auth.uid() | settlements | coalesce, p_event, p_expected_ai_data, p_expected_campaign_state | ERR permission denied for function apply_cut_trade_route_com |
| `apply_import_reconciliation_command(uuid,text,text,uuid,uuid,text,text,jsonb,jsonb)` | DEFINER | - | Y | DELIBERATE DOOR | browser; scripts(service) | auth.uid() | loop, saved_maps, settlements | p_source_checksum, v_expected_ids | ERR permission denied for function apply_import_reconciliati |
| `apply_reviewed_supply_chain_command(uuid,text,text,jsonb)` | DEFINER | - | Y | DELIBERATE DOOR | browser; scripts(service) | auth.uid() | application_command_journal, custom_content_definitions, custom_content_revisions, of | _content_sha256, v_chain_id, v_content_hash, v_evidence_revision, v_expected_head_id, v_ex | ERR permission denied for function apply_reviewed_supply_cha |
| `bump_public_view(text,text)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid() | gallery_views, settlements | — | OK rows=1 |
| `claim_current_session(text)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid(), role/jwt | current_account_session | — | ERR not authenticated |
| `compare_and_swap_campaign_content_binding(uuid,text,text,uuid,text,jsonb,jsonb)` | DEFINER | - | Y | DELIBERATE DOOR | browser; scripts(service) | auth.uid() | saved_maps | p_expected_binding_hash, prior, v_target_hash | ERR permission denied for function compare_and_swap_campaign |
| `current_user_is_privileged()` | DEFINER | Y | Y | DELIBERATE DOOR | edge(user token); scripts(service); RLS policy; sql: admin_grant_credits[D],admin_set_role[D],free_narrative_available[D],get_ai_pric | auth.uid() | — | profiles | OK rows=1 |
| `delete_gallery_comment(uuid)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid() | gallery_comments | — | ERR not authenticated |
| `export_custom_content_archive(uuid)` | DEFINER | - | Y | DELIBERATE DOOR | browser; scripts(service); sql: import_custom_content_archive[D] | auth.uid() | — | application_command_journal, content_environment_activations, content_environment_revision | ERR permission denied for function export_custom_content_arc |
| `founder_seats_taken()` | DEFINER | Y | Y | DELIBERATE DOOR | browser | none (trusts its parameters) | — | profiles | OK rows=1 |
| `founders_roll()` | DEFINER | Y | Y | DELIBERATE DOOR | browser | none (trusts its parameters) | — | credit_grant_idempotency, profiles | OK rows=0 |
| `get_ai_pricing()` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid(), priv-helper | — | profiles, system_config | OK rows=1 |
| `get_credit_balance(uuid)` | DEFINER | - | Y | DELIBERATE DOOR | browser; edge(service); scripts(service); sql: claim_auto_reload_attempt[D],free_narrative_available[D],reconcile_credit_balanc | auth.uid(), priv-helper | — | active_grants, allocated, credit_ledger, credit_spend_allocations, legacy_spends, uid | ERR permission denied for function get_credit_balance |
| `get_gallery_dossier(text)` | DEFINER | Y | Y | DELIBERATE DOOR | browser+api; edge(user token) | none (trusts its parameters) | — | _gallery_public_tile_rows, profiles, settlements | OK rows=0 |
| `get_gallery_map(text)` | DEFINER | Y | Y | DELIBERATE DOOR | browser; sql: import_gallery_map[D],list_gallery_maps[D],publish_map[D] | none (trusts its parameters) | saved_maps | settlements | OK rows=1 |
| `get_gallery_reaction_state(uuid)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid() | — | gallery_reactions, settlements | OK rows=0 |
| `get_gallery_vote_state(uuid)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid() | — | gallery_votes, settlements | OK rows=1 |
| `get_my_email_preferences()` | DEFINER | - | Y | DELIBERATE DOOR | browser | auth.uid() | — | email_preferences | ERR permission denied for function get_my_email_preferences |
| `get_my_operator_service_export()` | DEFINER | - | Y | DELIBERATE DOOR | browser | auth.uid() | — | consent_change_records, operator_message_receipts, operator_messages | ERR permission denied for function get_my_operator_service_e |
| `get_my_operator_unread_count()` | DEFINER | - | Y | DELIBERATE DOOR | browser | auth.uid() | — | operator_message_receipts | ERR permission denied for function get_my_operator_unread_co |
| `get_my_security_question_ids()` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid() | — | security_answers | OK rows=0 |
| `get_unlisted_dossier(text)` | DEFINER | Y | Y | DELIBERATE DOOR | browser+api | none (trusts its parameters) | — | profiles, settlements | OK rows=1 |
| `get_unlisted_map(text)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | none (trusts its parameters) | — | saved_maps | OK rows=1 |
| `has_dossier_entitlement(uuid)` | DEFINER | Y | Y | DELIBERATE DOOR | browser; scripts(service) | auth.uid() | — | dossier_entitlements | OK rows=1 |
| `has_surveyor_entitlement()` | DEFINER | Y | Y | DELIBERATE DOOR | browser; edge(user token); scripts(service); sql: surveyor_byok_set[D] | auth.uid(), priv-helper | — | surveyor_entitlements | OK rows=1 |
| `import_custom_content_archive(uuid,text,text,jsonb)` | DEFINER | - | Y | DELIBERATE DOOR | browser; scripts(service) | auth.uid() | application_command_journal, content_environment_activations, content_environment_revision | _content_sha256, _content_uuid, _custom_content_archive_destination_text, _custom_content_ | ERR permission denied for function import_custom_content_arc |
| `import_gallery_dossier(text)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid() | — | settlements | OK rows=0 |
| `is_current_session()` | DEFINER | Y | Y | DELIBERATE DOOR | browser; sql: assert_current_session[D] | auth.uid(), role/jwt | — | current_account_session | OK rows=1 |
| `list_curated_dossiers()` | DEFINER | Y | Y | DELIBERATE DOOR | browser | none (trusts its parameters) | — | settlements | OK rows=0 |
| `list_featured_dossiers()` | DEFINER | Y | Y | DELIBERATE DOOR | browser | none (trusts its parameters) | — | settlements | OK rows=0 |
| `list_featured_maps()` | DEFINER | Y | Y | DELIBERATE DOOR | browser | none (trusts its parameters) | — | saved_maps | OK rows=0 |
| `list_founder_seats_public()` | DEFINER | Y | Y | DELIBERATE DOOR | browser | none (trusts its parameters) | — | founder_seat_transfers, founder_seats | OK rows=30 |
| `list_gallery_comments(uuid)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid() | — | gallery_comments, profiles, settlements | OK rows=0 |
| `list_gallery_dossiers(integer,integer,text,text,jsonb,boolean)` | DEFINER | Y | Y | DELIBERATE DOOR | browser; scripts(service) | none (trusts its parameters) | — | _gallery_public_tile_rows, counted, filtered, profiles | OK rows=0 |
| `list_gallery_maps(integer,integer,text,text,jsonb)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | none (trusts its parameters) | — | base, profiles, saved_maps, settlements | OK rows=0 |
| `list_gallery_more_by_creator(text,integer)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | none (trusts its parameters) | — | _gallery_public_tile_rows, profiles, settlements, source | OK rows=0 |
| `list_gallery_reports(text,integer)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | priv-helper | — | gallery_reports, settlements | OK rows=0 |
| `list_my_gallery_dossiers()` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid() | — | _gallery_public_tile_rows, profiles, settlements | OK rows=0 |
| `list_my_operator_messages(integer,timestamp with time zone,uuid)` | DEFINER | - | Y | DELIBERATE DOOR | browser; scripts(service) | auth.uid() | — | operator_message_receipts, operator_messages | ERR permission denied for function list_my_operator_messages |
| `list_my_tickets()` | DEFINER | Y | Y | DELIBERATE DOOR | edge(user token) | auth.uid() | — | support_messages, support_ticket_events | OK rows=0 |
| `list_my_unlisted_dossiers()` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid() | — | settlements | OK rows=0 |
| `list_my_unlisted_maps()` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid() | — | saved_maps | OK rows=0 |
| `list_open_report_targets()` | DEFINER | Y | Y | DELIBERATE DOOR | browser | priv-helper | — | gallery_comment_reports, gallery_comments, gallery_map_reports, gallery_reports, saved_map | OK rows=0 |
| `list_ticket_thread(uuid)` | DEFINER | Y | Y | DELIBERATE DOOR | edge(user token) | auth.uid(), priv-helper | — | support_messages, support_ticket_events | OK rows=0 |
| `mark_operator_message_read(uuid)` | DEFINER | - | Y | DELIBERATE DOOR | browser | auth.uid() | operator_message_receipts | get_my_operator_message | ERR permission denied for function mark_operator_message_rea |
| `mutate_settlement_batch(uuid,jsonb,uuid[],jsonb)` | DEFINER | - | Y | DELIBERATE DOOR | browser; sql: persist_world_pulse_advance[D] | auth.uid() | settlements | profiles | ERR permission denied for function mutate_settlement_batch |
| `my_transfer_case_status()` | DEFINER | Y | Y | DELIBERATE DOOR | edge(user token) | auth.uid() | — | founder_seats, founder_transfer_cases | OK rows=0 |
| `publish_map(uuid,text,text,text[],boolean,text,text,boolean,jsonb,jsonb,text,jsonb)` | DEFINER | Y | Y | DELIBERATE DOOR | browser; scripts(service); sql: _saved_maps_world_snapshot_guard[I] | auth.uid() | saved_maps | settlements | ERR not authenticated |
| `publish_settlement(uuid)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid() | settlements | — | ERR not authenticated |
| `reactivate_free_settlement(uuid)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid() | settlements | profiles | ERR not authenticated |
| `record_referral_intent(text)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid() | referrals | profiles | ERR not authenticated |
| `report_gallery_comment(uuid,text,text)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid() | gallery_comment_reports | gallery_comments, settlements | ERR Sign in to report a comment |
| `report_gallery_dossier(uuid,text,text)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid() | gallery_reports | settlements | ERR Sign in to report a dossier |
| `resolve_gallery_report(uuid,text,text)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid(), priv-helper | gallery_reports | — | ERR Only admins can resolve gallery reports |
| `resolve_report_target(text,uuid,text,text)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid(), priv-helper | gallery_comment_reports, gallery_map_reports, gallery_reports | — | ERR Only admins can resolve reports |
| `revoke_settlement_unlisted(uuid)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid() | settlements | — | ERR not authenticated |
| `rotate_map_unlisted_slug(uuid)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid() | saved_maps | — | ERR not authenticated |
| `rotate_settlement_unlisted_slug(uuid)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid() | settlements | — | ERR not authenticated |
| `set_auto_reload_settings(boolean,integer,integer,integer)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid() | credit_auto_reload_settings | — | ERR not authenticated |
| `set_curated(uuid,boolean,integer)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid() | settlements | profiles | ERR Settlement not found |
| `set_featured(uuid,boolean,integer)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid() | settlements | profiles | ERR Settlement not found |
| `set_featured_map(uuid,boolean,integer)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid() | saved_maps | profiles | ERR Map not found |
| `set_founder_credit_listed(boolean)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid() | profiles | — | ERR not authenticated |
| `set_my_email_preference(uuid,text,boolean)` | DEFINER | - | Y | DELIBERATE DOOR | browser | auth.uid() | email_preferences | — | ERR permission denied for function set_my_email_preference |
| `set_my_security_answers(text,text,text,text)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid() | security_answers | — | ERR not authenticated |
| `set_my_telemetry_consent(uuid,jsonb,text)` | DEFINER | - | Y | DELIBERATE DOOR | browser | auth.uid() | profiles | — | ERR permission denied for function set_my_telemetry_consent |
| `share_map_unlisted(uuid)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid() | saved_maps | — | ERR not authenticated |
| `share_settlement_unlisted(uuid)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid() | settlements | — | ERR not authenticated |
| `spend_credits(text,text,text)` | DEFINER | Y | Y | DELIBERATE DOOR | edge(user token); scripts(service); sql: enforce_allocation_within_grant[D],refund_credits[D],service_adjust_credits[D],s | auth.uid(), priv-helper | credit_ledger, credit_spend_allocations, credit_transactions, of, profiles | system_config | ERR not authenticated |
| `surveyor_byok_clear(text)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid() | surveyor_byok_keys | — | ERR not authenticated |
| `surveyor_byok_set(text,text)` | DEFINER | Y | Y | DELIBERATE DOOR | browser; scripts(service) | auth.uid() | surveyor_byok_keys | profiles | ERR not authenticated |
| `surveyor_byok_status(text)` | DEFINER | Y | Y | DELIBERATE DOOR | browser; edge(user token); scripts(service) | auth.uid() | — | surveyor_byok_keys | ERR not authenticated |
| `surveyor_price_estimates()` | DEFINER | Y | Y | DELIBERATE DOOR | browser; sql: surveyor_usage_precheck[D] | auth.uid() | — | system_config | ERR not authenticated |
| `surveyor_settings_get()` | DEFINER | Y | Y | DELIBERATE DOOR | browser; edge(user token) | auth.uid() | — | surveyor_user_settings | ERR not authenticated |
| `surveyor_settings_set(jsonb)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid() | surveyor_user_settings | — | ERR not authenticated |
| `toggle_gallery_reaction(uuid,text)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid() | gallery_reactions | settlements | ERR Sign in to react |
| `toggle_gallery_vote(uuid)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid() | gallery_votes | settlements | ERR Sign in to vote |
| `unpublish_map(uuid)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid() | saved_maps | — | ERR not authenticated |
| `unpublish_settlement(uuid)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid() | settlements | — | ERR not authenticated |
| `update_display_name(text)` | DEFINER | Y | Y | DELIBERATE DOOR | browser; scripts(service) | auth.uid() | profiles | — | ERR not authenticated |
| `validate_redeem_code(text)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid() | — | redeem_codes, redemptions | ERR not authenticated |
| `welcome_credit_available(uuid)` | DEFINER | Y | Y | DELIBERATE DOOR | browser | auth.uid(), priv-helper | — | credit_ledger | OK rows=1 |
| `_civility_stem_hits(text)` | invoker | Y | Y | VISITOR-NEEDED — left alone | sql: _civility_token_hits[I] | n/a: runs as the caller | — | civility_terms | ERR permission denied for table civility_terms |
| `_civility_token_hits(text)` | invoker | Y | Y | VISITOR-NEEDED — left alone | sql: civility_blocked[I] | n/a: runs as the caller | — | — | ERR permission denied for table civility_terms |
| `_deity_chart_axes_valid(jsonb)` | invoker | Y | Y | VISITOR-NEEDED — left alone | check constraint | n/a: runs as the caller | — | — | OK rows=1 |
| `_gallery_chronicle_entry(jsonb)` | invoker | Y | Y | VISITOR-NEEDED — left alone | sql: _gallery_chronicle_json[I] | n/a: runs as the caller | — | — | OK rows=1 |
| `_gallery_npc_key(jsonb)` | invoker | Y | Y | VISITOR-NEEDED — left alone | sql: _gallery_apply_member_overrides[I] | n/a: runs as the caller | — | regexp_replace | OK rows=1 |
| `_gallery_sanitize_public_json(jsonb,text[])` | invoker | Y | Y | VISITOR-NEEDED — left alone | scripts(service); sql: _gallery_apply_member_overrides[I],get_gallery_dossier[D],get_gallery_map[D],get | n/a: runs as the caller | — | — | OK rows=1 |
| `_gallery_world_snapshot_is_safe(jsonb)` | invoker | Y | Y | VISITOR-NEEDED — left alone | scripts(service); sql: _saved_maps_world_snapshot_guard[I],publish_map[D] | n/a: runs as the caller | — | — | OK rows=1 |
| `civility_normalize(text)` | invoker | Y | Y | VISITOR-NEEDED — left alone | scripts(service); sql: civility_blocked[I] | n/a: runs as the caller | — | — | OK rows=1 |
| `current_user_has_premium_access()` | DEFINER | Y | Y | VISITOR-NEEDED — left alone | RLS policy; sql: _apply_custom_content_command_authorable[D],apply_import_reconciliation_command[ | auth.uid() | — | profiles | OK rows=1 |
| `current_user_is_highest()` | DEFINER | Y | Y | VISITOR-NEEDED — left alone | RLS policy; sql: admin_user_full[D] | auth.uid(), priv-helper | — | — | OK rows=1 |
| `current_user_is_support_or_higher()` | DEFINER | Y | Y | VISITOR-NEEDED — left alone | RLS policy; sql: admin_list_internal_notes[D],admin_list_warnings[D],admin_support_messages[D],ad | auth.uid(), priv-helper | — | — | OK rows=1 |
| `format_ticket_number(bigint)` | invoker | Y | Y | VISITOR-NEEDED — left alone | sql: support_ticket_assign_number[I] | n/a: runs as the caller | — | — | OK rows=1 |
| `_gallery_apply_member_overrides(jsonb,jsonb,jsonb,boolean,boolean,boolean)` | invoker | Y | Y | INTERNAL — invoker helper, for 213 | sql: get_gallery_dossier[D],import_gallery_dossier[D] | n/a: runs as the caller | — | — | OK rows=1 |
| `_gallery_chronicle_json(jsonb)` | invoker | Y | Y | INTERNAL — invoker helper, for 213 | sql: get_gallery_dossier[D],get_gallery_map[D] | n/a: runs as the caller | — | — | OK rows=1 |
| `_gallery_dm_full_json(jsonb)` | invoker | Y | Y | INTERNAL — invoker helper, for 213 | sql: get_gallery_dossier[D],import_gallery_dossier[D] | n/a: runs as the caller | — | compass | OK rows=1 |
| `_gallery_map_backdrop(jsonb)` | invoker | Y | Y | INTERNAL — invoker helper, for 213 | sql: get_gallery_map[D],list_gallery_maps[D] | n/a: runs as the caller | — | — | OK rows=1 |
| `_gc_dim_sql(text)` | invoker | Y | Y | INTERNAL — invoker helper, for 213 | sql: report_crosstab[D],report_distribution[D] | n/a: runs as the caller | — | — | OK rows=1 |
| `_make_public_slug()` | invoker | Y | Y | INTERNAL — invoker helper, for 213 | sql: publish_map[D],publish_settlement[D] | n/a: runs as the caller | — | — | OK rows=1 |
| `_make_unlisted_slug()` | invoker | Y | Y | INTERNAL — invoker helper, for 213 | sql: rotate_map_unlisted_slug[D],rotate_settlement_unlisted_slug[D],share_map_unliste | n/a: runs as the caller | — | — | OK rows=1 |
| `_trunc_unit(text)` | invoker | Y | Y | INTERNAL — invoker helper, for 213 | sql: report_distribution[D],report_trend[D] | n/a: runs as the caller | — | — | OK rows=1 |
| `civility_blocked(text)` | invoker | Y | Y | INTERNAL — invoker helper, for 213 | scripts(service); sql: add_gallery_comment[D],update_display_name[D] | n/a: runs as the caller | — | civility_allow | ERR permission denied for table civility_allow |
| `is_allowed_email_category(text)` | invoker | Y | Y | INTERNAL — invoker helper, for 213 | sql: can_email_user[D],set_my_email_preference[D],unsubscribe_via_token[D] | n/a: runs as the caller | — | — | OK rows=1 |
| `is_allowed_security_question_id(text)` | invoker | Y | Y | INTERNAL — invoker helper, for 213 | sql: set_my_security_answers[D] | n/a: runs as the caller | — | — | OK rows=1 |
| `market_k_min_campaigns()` | invoker | Y | Y | INTERNAL — invoker helper, for 213 | sql: report_market_archetype_popularity[D],report_market_preset_adoption[D] | n/a: runs as the caller | — | — | OK rows=1 |
| `market_k_min_users()` | invoker | Y | Y | INTERNAL — invoker helper, for 213 | sql: report_market_archetype_popularity[D],report_market_preset_adoption[D] | n/a: runs as the caller | — | — | OK rows=1 |
| `mask_email(text)` | invoker | Y | Y | INTERNAL — invoker helper, for 213 | sql: admin_diagnostic_bundle[D],admin_support_messages[D],admin_user_full[D],admin_us | n/a: runs as the caller | — | — | OK rows=1 |
| `normalize_external_name(text)` | invoker | Y | Y | INTERNAL — invoker helper, for 213 | sql: update_external_name[D] | n/a: runs as the caller | — | — | OK rows=1 |
| `_saved_maps_world_snapshot_guard()` | invoker | Y | Y | TRIGGER — left alone | trigger | n/a: runs as the caller | — | — | (trigger: not callable) |
| `enforce_allocation_within_grant()` | DEFINER | Y | Y | TRIGGER — left alone | trigger | none (trusts its parameters) | — | credit_ledger, credit_spend_allocations | (trigger: not callable) |
| `enforce_moderation_ban()` | invoker | Y | Y | TRIGGER — left alone | trigger | n/a: runs as the caller | — | — | (trigger: not callable) |
| `enforce_save_limit()` | DEFINER | Y | Y | TRIGGER — left alone | trigger | auth.uid(), role/jwt | — | profiles, settlements, uid | (trigger: not callable) |
| `enforce_version_history_cap()` | invoker | Y | Y | TRIGGER — left alone | trigger | n/a: runs as the caller | — | — | (trigger: not callable) |
| `grant_welcome_credit()` | DEFINER | Y | Y | TRIGGER — left alone | — | none (trusts its parameters) | credit_ledger, credit_transactions, profiles | — | (trigger: not callable) |
| `guard_inactive_profile_billing()` | invoker | Y | Y | TRIGGER — left alone | trigger | n/a: runs as the caller | — | old, true | (trigger: not callable) |
| `handle_new_user()` | DEFINER | Y | Y | TRIGGER — left alone | trigger | none (trusts its parameters) | credit_ledger, credit_transactions, profiles | — | (trigger: not callable) |
| `support_ticket_assign_number()` | invoker | Y | Y | TRIGGER — left alone | trigger | n/a: runs as the caller | — | — | (trigger: not callable) |
| `support_ticket_touch()` | invoker | Y | Y | TRIGGER — left alone | trigger | n/a: runs as the caller | — | — | (trigger: not callable) |
| `sync_profile_email()` | DEFINER | Y | Y | TRIGGER — left alone | trigger | none (trusts its parameters) | profiles | — | (trigger: not callable) |
| `touch_custom_content_updated_at()` | invoker | Y | Y | TRIGGER — left alone | trigger | n/a: runs as the caller | — | — | (trigger: not callable) |
| `update_updated_at()` | invoker | Y | Y | TRIGGER — left alone | trigger | n/a: runs as the caller | — | — | (trigger: not callable) |
