-- ════════════════════════════════════════════════════════════════════════════════════════
-- EMERGENCY_REVOKE.sql — close the SECURITY DEFINER functions that anon and authenticated can
-- call but no browser code calls (finding V10-8). Written 2026-11-20 01:38 UTC by SEC-GRANTS against
-- origin/master's migrations 001..203 (what production runs). FOR THE OWNER'S HAND ONLY.
--
-- RUN ORDER (see OWNER_NOTE.md): CHECK_C_PREFLIGHT.sql and CHECK_B_REVOKE_LIST.sql first (read-only, one row
-- each), then this file once, then CHECK_B_REVOKE_LIST.sql (all counts 0) and CHECK_A_KEYS.sql (all false).
--
-- WHAT IT DOES, in ONE transaction:
--   1. For each of the 157 functions below: revoke EXECUTE from PUBLIC, anon and authenticated.
--      PUBLIC is included because Postgres grants EXECUTE to PUBLIC on every new function, and
--      anon/authenticated inherit PUBLIC: revoking only from anon/authenticated would leave
--      every function whose migration never revoked PUBLIC still callable by anon.
--   2. For the same functions: grant EXECUTE to service_role. service_role already holds it
--      (Supabase's default privileges grant it on every function); the grant only guarantees
--      that removing PUBLIC can never take a door away from the edge functions. It widens nothing.
--   The two BYOK key functions come first.
--
-- WHAT IT LEAVES ALONE: every function the browser, the Vercel /api pages, or an edge
--   function acting with the USER's token calls; every function referenced by a row-security
--   policy, a check constraint, a view or a column default; every function called from inside
--   a SECURITY INVOKER function or trigger (those run as the visitor and need the visitor's
--   grant); every trigger function; every SECURITY INVOKER helper (it runs with the caller's
--   own rights, so it grants nothing). Those wait for the permanent migration 213.
--
-- NO drop, NO alter, NO data change, NO change to row security. Idempotent: running it twice
--   is the same as running it once. If any signature below does not exist on production the
--   whole transaction fails and NOTHING changes; CHECK_B_REVOKE_LIST.sql's missing_count lists
--   such signatures in advance (it must be empty).
--
-- UNDO (only if something breaks): grant execute on function <signature> to anon, authenticated;
--   for the one function named in the error. Do not undo the two BYOK functions.
-- ════════════════════════════════════════════════════════════════════════════════════════
begin;

-- ── the two BYOK key functions (the master secret; a user's decrypted provider key) ──────
revoke execute on function public._surveyor_byok_secret() from public, anon, authenticated;
revoke execute on function public.surveyor_byok_get(uuid,text) from public, anon, authenticated;

-- ── every other SECURITY DEFINER function with no browser caller ─────────────────────────
revoke execute on function public._assert_service_admin_actor(uuid) from public, anon, authenticated;
revoke execute on function public._audit_action(uuid,uuid,text,jsonb,jsonb,text) from public, anon, authenticated;
revoke execute on function public._buyback_payout_hold_days() from public, anon, authenticated;
revoke execute on function public._consume_action_rate_limit(uuid,text,integer) from public, anon, authenticated;
revoke execute on function public._founder_transfer_dial(text,integer) from public, anon, authenticated;
revoke execute on function public._gallery_public_tile_rows() from public, anon, authenticated;
revoke execute on function public._log_founder_transfer_event(uuid,text,text,jsonb) from public, anon, authenticated;
revoke execute on function public._seat_buyback_cents() from public, anon, authenticated;
revoke execute on function public._seat_holder_last_active(uuid) from public, anon, authenticated;
revoke execute on function public._seat_stewardship_dial(text,integer) from public, anon, authenticated;
revoke execute on function public.add_internal_note(uuid,uuid,text) from public, anon, authenticated;
revoke execute on function public.admin_billing_summary(uuid,uuid) from public, anon, authenticated;
revoke execute on function public.admin_diagnostic_bundle(uuid,uuid,boolean,text) from public, anon, authenticated;
revoke execute on function public.admin_grant_credits(uuid,integer,text) from public, anon, authenticated;
revoke execute on function public.admin_list_internal_notes(uuid) from public, anon, authenticated;
revoke execute on function public.admin_list_warnings(uuid) from public, anon, authenticated;
revoke execute on function public.admin_remove_gallery_item(uuid,uuid,text) from public, anon, authenticated;
revoke execute on function public.admin_remove_gallery_map(uuid,uuid,text) from public, anon, authenticated;
revoke execute on function public.admin_revoke_share_link(uuid,uuid,text) from public, anon, authenticated;
revoke execute on function public.admin_set_content_banned(uuid,text,uuid,boolean,text) from public, anon, authenticated;
revoke execute on function public.admin_set_role(uuid,text) from public, anon, authenticated;
revoke execute on function public.admin_soft_delete_map(uuid,uuid,boolean,text) from public, anon, authenticated;
revoke execute on function public.admin_soft_delete_settlement(uuid,uuid,boolean,text) from public, anon, authenticated;
revoke execute on function public.admin_support_messages(text,integer) from public, anon, authenticated;
revoke execute on function public.admin_user_full(uuid,text) from public, anon, authenticated;
revoke execute on function public.admin_user_summary(uuid) from public, anon, authenticated;
revoke execute on function public.aggregate_ai_usage_stats(integer) from public, anon, authenticated;
revoke execute on function public.analytics_monthly_prune() from public, anon, authenticated;
revoke execute on function public.analytics_nightly_maintenance() from public, anon, authenticated;
revoke execute on function public.append_retention_cohorts(date) from public, anon, authenticated;
revoke execute on function public.apply_redemption(text) from public, anon, authenticated;
revoke execute on function public.assert_current_session() from public, anon, authenticated;
revoke execute on function public.attach_ai_spend_to_claim(uuid,text,uuid) from public, anon, authenticated;
revoke execute on function public.bind_redemption_session(uuid,text) from public, anon, authenticated;
revoke execute on function public.bump_map_import(text) from public, anon, authenticated;
revoke execute on function public.cancel_stale_auto_reload_attempts() from public, anon, authenticated;
revoke execute on function public.claim_ai_request(uuid,text,integer) from public, anon, authenticated;
revoke execute on function public.claim_auto_reload_payment_intent(uuid,uuid,text,integer,integer) from public, anon, authenticated;
revoke execute on function public.claim_dossier_purchase_by_session(text,uuid,uuid) from public, anon, authenticated;
revoke execute on function public.claim_due_buyback_payout() from public, anon, authenticated;
revoke execute on function public.claim_due_transfer_payout() from public, anon, authenticated;
revoke execute on function public.claim_founder_seat_buyback(uuid,text) from public, anon, authenticated;
revoke execute on function public.claim_free_narrative(uuid) from public, anon, authenticated;
revoke execute on function public.claim_next_founder_seat(uuid) from public, anon, authenticated;
revoke execute on function public.claim_ticket(uuid,uuid) from public, anon, authenticated;
revoke execute on function public.clawback_dossier_entitlement(text) from public, anon, authenticated;
revoke execute on function public.clawback_referral(text) from public, anon, authenticated;
revoke execute on function public.cleanup_ai_generate_rate_limits(integer) from public, anon, authenticated;
revoke execute on function public.cleanup_ai_spend_reservations(integer) from public, anon, authenticated;
revoke execute on function public.cleanup_dossier_verify_rate_limits(integer) from public, anon, authenticated;
revoke execute on function public.cleanup_email_rate_limits(integer) from public, anon, authenticated;
revoke execute on function public.cleanup_recovery_rate_limits(integer) from public, anon, authenticated;
revoke execute on function public.cleanup_token_buckets(integer) from public, anon, authenticated;
revoke execute on function public.cleanup_user_action_rate_limits(integer) from public, anon, authenticated;
revoke execute on function public.consume_ai_generate_rate_limit(uuid,integer,integer) from public, anon, authenticated;
revoke execute on function public.consume_dossier_verify_rate_limit(text,integer,integer) from public, anon, authenticated;
revoke execute on function public.consume_email_rate_limit(text,text,integer,integer,integer) from public, anon, authenticated;
revoke execute on function public.consume_recovery_rate_limit(text,text,integer,integer,integer) from public, anon, authenticated;
revoke execute on function public.consume_token_bucket(text,double precision,double precision,double precision) from public, anon, authenticated;
revoke execute on function public.current_user_has_role(text[]) from public, anon, authenticated;
revoke execute on function public.dismiss_operator_message(uuid) from public, anon, authenticated;
revoke execute on function public.email_has_active_transfer_lock(text) from public, anon, authenticated;
revoke execute on function public.expire_stale_transfer_cases() from public, anon, authenticated;
revoke execute on function public.founder_buyback_enabled() from public, anon, authenticated;
revoke execute on function public.founder_transfer_enabled() from public, anon, authenticated;
revoke execute on function public.free_narrative_available(uuid) from public, anon, authenticated;
revoke execute on function public.gen_account_number() from public, anon, authenticated;
revoke execute on function public.gen_external_name() from public, anon, authenticated;
revoke execute on function public.get_my_operator_message(uuid) from public, anon, authenticated;
revoke execute on function public.grant_dossier_entitlement(uuid,uuid,text,text) from public, anon, authenticated;
revoke execute on function public.grant_referral(uuid,text,integer) from public, anon, authenticated;
revoke execute on function public.handle_premium_downgrade(uuid) from public, anon, authenticated;
revoke execute on function public.has_active_transfer_lock(uuid) from public, anon, authenticated;
revoke execute on function public.has_role(uuid,text[]) from public, anon, authenticated;
revoke execute on function public.import_gallery_map(text) from public, anon, authenticated;
revoke execute on function public.ingest_check_rate(text,integer,integer) from public, anon, authenticated;
revoke execute on function public.issue_buyback_challenge(uuid) from public, anon, authenticated;
revoke execute on function public.issue_transfer_challenge(uuid,text,text) from public, anon, authenticated;
revoke execute on function public.link_ticket_faq(uuid,uuid,text) from public, anon, authenticated;
revoke execute on function public.list_ticket_pool(text,integer) from public, anon, authenticated;
revoke execute on function public.load_sim_metrics(jsonb) from public, anon, authenticated;
revoke execute on function public.mark_low_balance_notified(uuid,text) from public, anon, authenticated;
revoke execute on function public.merge_neighbour_backlink(uuid,text,uuid,jsonb,jsonb) from public, anon, authenticated;
revoke execute on function public.persist_world_pulse_advance(uuid,jsonb,jsonb,bigint) from public, anon, authenticated;
revoke execute on function public.post_ticket_reply(uuid,uuid,text,text) from public, anon, authenticated;
revoke execute on function public.profile_has_premium_access(uuid) from public, anon, authenticated;
revoke execute on function public.purge_analytics_for_user(uuid) from public, anon, authenticated;
revoke execute on function public.purge_dossier_purchases(integer) from public, anon, authenticated;
revoke execute on function public.purge_expired_plan_inactive_assets() from public, anon, authenticated;
revoke execute on function public.purge_expired_plan_inactive_settlements() from public, anon, authenticated;
revoke execute on function public.record_referral_grant_detail(uuid,text,text,text) from public, anon, authenticated;
revoke execute on function public.reelect_transfer_payout(uuid,uuid) from public, anon, authenticated;
revoke execute on function public.release_ai_spend_reservation(uuid) from public, anon, authenticated;
revoke execute on function public.release_founder_seat_on_clawback(uuid) from public, anon, authenticated;
revoke execute on function public.release_free_narrative(uuid) from public, anon, authenticated;
revoke execute on function public.report_ai_usage(date,date) from public, anon, authenticated;
revoke execute on function public.report_channel_funnel(date,date) from public, anon, authenticated;
revoke execute on function public.report_client_error_alert() from public, anon, authenticated;
revoke execute on function public.report_client_errors(date,date) from public, anon, authenticated;
revoke execute on function public.report_config_variance(text,date,date) from public, anon, authenticated;
revoke execute on function public.report_crosstab(text,text,date,date,integer) from public, anon, authenticated;
revoke execute on function public.report_distribution(text,date,date,text,integer) from public, anon, authenticated;
revoke execute on function public.report_edit_heatmap(date,date) from public, anon, authenticated;
revoke execute on function public.report_funnel(date,date) from public, anon, authenticated;
revoke execute on function public.report_gallery_map(uuid,text,text) from public, anon, authenticated;
revoke execute on function public.report_market_archetype_popularity(date,date) from public, anon, authenticated;
revoke execute on function public.report_market_preset_adoption(date,date) from public, anon, authenticated;
revoke execute on function public.report_npc_distribution(text,date,date) from public, anon, authenticated;
revoke execute on function public.report_preferences(date,date) from public, anon, authenticated;
revoke execute on function public.report_proposal_decisions(date,date) from public, anon, authenticated;
revoke execute on function public.report_pulse_mutations(date,date) from public, anon, authenticated;
revoke execute on function public.report_referral_funnel(date,date) from public, anon, authenticated;
revoke execute on function public.report_regional_arcs(date,date) from public, anon, authenticated;
revoke execute on function public.report_regional_impacts(date,date) from public, anon, authenticated;
revoke execute on function public.report_regional_propagation(date,date) from public, anon, authenticated;
revoke execute on function public.report_retention() from public, anon, authenticated;
revoke execute on function public.report_stressor_genesis(date,date) from public, anon, authenticated;
revoke execute on function public.report_summary(date,date) from public, anon, authenticated;
revoke execute on function public.report_trend(text,text,date,date) from public, anon, authenticated;
revoke execute on function public.reserve_ai_spend(uuid,numeric) from public, anon, authenticated;
revoke execute on function public.reserve_redemption(text,uuid,text) from public, anon, authenticated;
revoke execute on function public.revert_redemption(text) from public, anon, authenticated;
revoke execute on function public.revoke_map_unlisted(uuid) from public, anon, authenticated;
revoke execute on function public.revoke_surveyor_entitlement(uuid,text) from public, anon, authenticated;
revoke execute on function public.revoke_surveyor_entitlement_by_subscription(text) from public, anon, authenticated;
revoke execute on function public.rollup_analytics_daily(date) from public, anon, authenticated;
revoke execute on function public.rollup_analytics_v2_daily(date) from public, anon, authenticated;
revoke execute on function public.rollup_intent_atlas_daily(date) from public, anon, authenticated;
revoke execute on function public.rollup_sim_metrics(text) from public, anon, authenticated;
revoke execute on function public.service_adjust_credits(uuid,uuid,integer,text) from public, anon, authenticated;
revoke execute on function public.set_account_disabled(uuid,uuid,boolean,text) from public, anon, authenticated;
revoke execute on function public.set_founder_display_optin(text,text) from public, anon, authenticated;
revoke execute on function public.set_gallery_comment_hidden(uuid,boolean,text,uuid) from public, anon, authenticated;
revoke execute on function public.set_ticket_status(uuid,uuid,text,text) from public, anon, authenticated;
revoke execute on function public.surveyor_byok_set_health(uuid,text,text,text,boolean) from public, anon, authenticated;
revoke execute on function public.surveyor_byok_set_probe_tier(uuid,text,text,text,text,jsonb) from public, anon, authenticated;
revoke execute on function public.surveyor_stage_enabled(text) from public, anon, authenticated;
revoke execute on function public.surveyor_usage_precheck(uuid,text,text) from public, anon, authenticated;
revoke execute on function public.sweep_seat_abandonment() from public, anon, authenticated;
revoke execute on function public.sweep_seat_dormancy_nudges() from public, anon, authenticated;
revoke execute on function public.system_clawback_credits(text,text) from public, anon, authenticated;
revoke execute on function public.transfer_case_abort(uuid,text,text) from public, anon, authenticated;
revoke execute on function public.transfer_case_bind_nominee(uuid,uuid) from public, anon, authenticated;
revoke execute on function public.transfer_case_finalize(uuid) from public, anon, authenticated;
revoke execute on function public.transfer_case_mark_awaiting_payment(uuid,text) from public, anon, authenticated;
revoke execute on function public.transfer_case_mark_paid(uuid,text,integer) from public, anon, authenticated;
revoke execute on function public.transfer_case_open(smallint,uuid,text,text) from public, anon, authenticated;
revoke execute on function public.transfer_case_regress_awaiting_payment(text) from public, anon, authenticated;
revoke execute on function public.transfer_case_reverse(uuid,text) from public, anon, authenticated;
revoke execute on function public.update_external_name(text) from public, anon, authenticated;
revoke execute on function public.update_profile_names(text,text,text) from public, anon, authenticated;
revoke execute on function public.verify_buyback_challenge(uuid,text) from public, anon, authenticated;
revoke execute on function public.verify_transfer_challenge(uuid,text,text,text) from public, anon, authenticated;
revoke execute on function public.write_ai_operation_log(uuid,text,text,text,text,text[],text[],text,text,text,boolean,numeric,integer,boolean,uuid,boolean,text,text) from public, anon, authenticated;
revoke execute on function public.write_audit(text,uuid,text,text,text,jsonb,jsonb,boolean,boolean,boolean,uuid) from public, anon, authenticated;

-- ── keep the service role's door (already granted; see header point 2) ─────────────────────
grant execute on function public._surveyor_byok_secret() to service_role;
grant execute on function public.surveyor_byok_get(uuid,text) to service_role;
grant execute on function public._assert_service_admin_actor(uuid) to service_role;
grant execute on function public._audit_action(uuid,uuid,text,jsonb,jsonb,text) to service_role;
grant execute on function public._buyback_payout_hold_days() to service_role;
grant execute on function public._consume_action_rate_limit(uuid,text,integer) to service_role;
grant execute on function public._founder_transfer_dial(text,integer) to service_role;
grant execute on function public._gallery_public_tile_rows() to service_role;
grant execute on function public._log_founder_transfer_event(uuid,text,text,jsonb) to service_role;
grant execute on function public._seat_buyback_cents() to service_role;
grant execute on function public._seat_holder_last_active(uuid) to service_role;
grant execute on function public._seat_stewardship_dial(text,integer) to service_role;
grant execute on function public.add_internal_note(uuid,uuid,text) to service_role;
grant execute on function public.admin_billing_summary(uuid,uuid) to service_role;
grant execute on function public.admin_diagnostic_bundle(uuid,uuid,boolean,text) to service_role;
grant execute on function public.admin_grant_credits(uuid,integer,text) to service_role;
grant execute on function public.admin_list_internal_notes(uuid) to service_role;
grant execute on function public.admin_list_warnings(uuid) to service_role;
grant execute on function public.admin_remove_gallery_item(uuid,uuid,text) to service_role;
grant execute on function public.admin_remove_gallery_map(uuid,uuid,text) to service_role;
grant execute on function public.admin_revoke_share_link(uuid,uuid,text) to service_role;
grant execute on function public.admin_set_content_banned(uuid,text,uuid,boolean,text) to service_role;
grant execute on function public.admin_set_role(uuid,text) to service_role;
grant execute on function public.admin_soft_delete_map(uuid,uuid,boolean,text) to service_role;
grant execute on function public.admin_soft_delete_settlement(uuid,uuid,boolean,text) to service_role;
grant execute on function public.admin_support_messages(text,integer) to service_role;
grant execute on function public.admin_user_full(uuid,text) to service_role;
grant execute on function public.admin_user_summary(uuid) to service_role;
grant execute on function public.aggregate_ai_usage_stats(integer) to service_role;
grant execute on function public.analytics_monthly_prune() to service_role;
grant execute on function public.analytics_nightly_maintenance() to service_role;
grant execute on function public.append_retention_cohorts(date) to service_role;
grant execute on function public.apply_redemption(text) to service_role;
grant execute on function public.assert_current_session() to service_role;
grant execute on function public.attach_ai_spend_to_claim(uuid,text,uuid) to service_role;
grant execute on function public.bind_redemption_session(uuid,text) to service_role;
grant execute on function public.bump_map_import(text) to service_role;
grant execute on function public.cancel_stale_auto_reload_attempts() to service_role;
grant execute on function public.claim_ai_request(uuid,text,integer) to service_role;
grant execute on function public.claim_auto_reload_payment_intent(uuid,uuid,text,integer,integer) to service_role;
grant execute on function public.claim_dossier_purchase_by_session(text,uuid,uuid) to service_role;
grant execute on function public.claim_due_buyback_payout() to service_role;
grant execute on function public.claim_due_transfer_payout() to service_role;
grant execute on function public.claim_founder_seat_buyback(uuid,text) to service_role;
grant execute on function public.claim_free_narrative(uuid) to service_role;
grant execute on function public.claim_next_founder_seat(uuid) to service_role;
grant execute on function public.claim_ticket(uuid,uuid) to service_role;
grant execute on function public.clawback_dossier_entitlement(text) to service_role;
grant execute on function public.clawback_referral(text) to service_role;
grant execute on function public.cleanup_ai_generate_rate_limits(integer) to service_role;
grant execute on function public.cleanup_ai_spend_reservations(integer) to service_role;
grant execute on function public.cleanup_dossier_verify_rate_limits(integer) to service_role;
grant execute on function public.cleanup_email_rate_limits(integer) to service_role;
grant execute on function public.cleanup_recovery_rate_limits(integer) to service_role;
grant execute on function public.cleanup_token_buckets(integer) to service_role;
grant execute on function public.cleanup_user_action_rate_limits(integer) to service_role;
grant execute on function public.consume_ai_generate_rate_limit(uuid,integer,integer) to service_role;
grant execute on function public.consume_dossier_verify_rate_limit(text,integer,integer) to service_role;
grant execute on function public.consume_email_rate_limit(text,text,integer,integer,integer) to service_role;
grant execute on function public.consume_recovery_rate_limit(text,text,integer,integer,integer) to service_role;
grant execute on function public.consume_token_bucket(text,double precision,double precision,double precision) to service_role;
grant execute on function public.current_user_has_role(text[]) to service_role;
grant execute on function public.dismiss_operator_message(uuid) to service_role;
grant execute on function public.email_has_active_transfer_lock(text) to service_role;
grant execute on function public.expire_stale_transfer_cases() to service_role;
grant execute on function public.founder_buyback_enabled() to service_role;
grant execute on function public.founder_transfer_enabled() to service_role;
grant execute on function public.free_narrative_available(uuid) to service_role;
grant execute on function public.gen_account_number() to service_role;
grant execute on function public.gen_external_name() to service_role;
grant execute on function public.get_my_operator_message(uuid) to service_role;
grant execute on function public.grant_dossier_entitlement(uuid,uuid,text,text) to service_role;
grant execute on function public.grant_referral(uuid,text,integer) to service_role;
grant execute on function public.handle_premium_downgrade(uuid) to service_role;
grant execute on function public.has_active_transfer_lock(uuid) to service_role;
grant execute on function public.has_role(uuid,text[]) to service_role;
grant execute on function public.import_gallery_map(text) to service_role;
grant execute on function public.ingest_check_rate(text,integer,integer) to service_role;
grant execute on function public.issue_buyback_challenge(uuid) to service_role;
grant execute on function public.issue_transfer_challenge(uuid,text,text) to service_role;
grant execute on function public.link_ticket_faq(uuid,uuid,text) to service_role;
grant execute on function public.list_ticket_pool(text,integer) to service_role;
grant execute on function public.load_sim_metrics(jsonb) to service_role;
grant execute on function public.mark_low_balance_notified(uuid,text) to service_role;
grant execute on function public.merge_neighbour_backlink(uuid,text,uuid,jsonb,jsonb) to service_role;
grant execute on function public.persist_world_pulse_advance(uuid,jsonb,jsonb,bigint) to service_role;
grant execute on function public.post_ticket_reply(uuid,uuid,text,text) to service_role;
grant execute on function public.profile_has_premium_access(uuid) to service_role;
grant execute on function public.purge_analytics_for_user(uuid) to service_role;
grant execute on function public.purge_dossier_purchases(integer) to service_role;
grant execute on function public.purge_expired_plan_inactive_assets() to service_role;
grant execute on function public.purge_expired_plan_inactive_settlements() to service_role;
grant execute on function public.record_referral_grant_detail(uuid,text,text,text) to service_role;
grant execute on function public.reelect_transfer_payout(uuid,uuid) to service_role;
grant execute on function public.release_ai_spend_reservation(uuid) to service_role;
grant execute on function public.release_founder_seat_on_clawback(uuid) to service_role;
grant execute on function public.release_free_narrative(uuid) to service_role;
grant execute on function public.report_ai_usage(date,date) to service_role;
grant execute on function public.report_channel_funnel(date,date) to service_role;
grant execute on function public.report_client_error_alert() to service_role;
grant execute on function public.report_client_errors(date,date) to service_role;
grant execute on function public.report_config_variance(text,date,date) to service_role;
grant execute on function public.report_crosstab(text,text,date,date,integer) to service_role;
grant execute on function public.report_distribution(text,date,date,text,integer) to service_role;
grant execute on function public.report_edit_heatmap(date,date) to service_role;
grant execute on function public.report_funnel(date,date) to service_role;
grant execute on function public.report_gallery_map(uuid,text,text) to service_role;
grant execute on function public.report_market_archetype_popularity(date,date) to service_role;
grant execute on function public.report_market_preset_adoption(date,date) to service_role;
grant execute on function public.report_npc_distribution(text,date,date) to service_role;
grant execute on function public.report_preferences(date,date) to service_role;
grant execute on function public.report_proposal_decisions(date,date) to service_role;
grant execute on function public.report_pulse_mutations(date,date) to service_role;
grant execute on function public.report_referral_funnel(date,date) to service_role;
grant execute on function public.report_regional_arcs(date,date) to service_role;
grant execute on function public.report_regional_impacts(date,date) to service_role;
grant execute on function public.report_regional_propagation(date,date) to service_role;
grant execute on function public.report_retention() to service_role;
grant execute on function public.report_stressor_genesis(date,date) to service_role;
grant execute on function public.report_summary(date,date) to service_role;
grant execute on function public.report_trend(text,text,date,date) to service_role;
grant execute on function public.reserve_ai_spend(uuid,numeric) to service_role;
grant execute on function public.reserve_redemption(text,uuid,text) to service_role;
grant execute on function public.revert_redemption(text) to service_role;
grant execute on function public.revoke_map_unlisted(uuid) to service_role;
grant execute on function public.revoke_surveyor_entitlement(uuid,text) to service_role;
grant execute on function public.revoke_surveyor_entitlement_by_subscription(text) to service_role;
grant execute on function public.rollup_analytics_daily(date) to service_role;
grant execute on function public.rollup_analytics_v2_daily(date) to service_role;
grant execute on function public.rollup_intent_atlas_daily(date) to service_role;
grant execute on function public.rollup_sim_metrics(text) to service_role;
grant execute on function public.service_adjust_credits(uuid,uuid,integer,text) to service_role;
grant execute on function public.set_account_disabled(uuid,uuid,boolean,text) to service_role;
grant execute on function public.set_founder_display_optin(text,text) to service_role;
grant execute on function public.set_gallery_comment_hidden(uuid,boolean,text,uuid) to service_role;
grant execute on function public.set_ticket_status(uuid,uuid,text,text) to service_role;
grant execute on function public.surveyor_byok_set_health(uuid,text,text,text,boolean) to service_role;
grant execute on function public.surveyor_byok_set_probe_tier(uuid,text,text,text,text,jsonb) to service_role;
grant execute on function public.surveyor_stage_enabled(text) to service_role;
grant execute on function public.surveyor_usage_precheck(uuid,text,text) to service_role;
grant execute on function public.sweep_seat_abandonment() to service_role;
grant execute on function public.sweep_seat_dormancy_nudges() to service_role;
grant execute on function public.system_clawback_credits(text,text) to service_role;
grant execute on function public.transfer_case_abort(uuid,text,text) to service_role;
grant execute on function public.transfer_case_bind_nominee(uuid,uuid) to service_role;
grant execute on function public.transfer_case_finalize(uuid) to service_role;
grant execute on function public.transfer_case_mark_awaiting_payment(uuid,text) to service_role;
grant execute on function public.transfer_case_mark_paid(uuid,text,integer) to service_role;
grant execute on function public.transfer_case_open(smallint,uuid,text,text) to service_role;
grant execute on function public.transfer_case_regress_awaiting_payment(text) to service_role;
grant execute on function public.transfer_case_reverse(uuid,text) to service_role;
grant execute on function public.update_external_name(text) to service_role;
grant execute on function public.update_profile_names(text,text,text) to service_role;
grant execute on function public.verify_buyback_challenge(uuid,text) to service_role;
grant execute on function public.verify_transfer_challenge(uuid,text,text,text) to service_role;
grant execute on function public.write_ai_operation_log(uuid,text,text,text,text,text[],text[],text,text,text,boolean,numeric,integer,boolean,uuid,boolean,text,text) to service_role;
grant execute on function public.write_audit(text,uuid,text,text,text,jsonb,jsonb,boolean,boolean,boolean,uuid) to service_role;

commit;
