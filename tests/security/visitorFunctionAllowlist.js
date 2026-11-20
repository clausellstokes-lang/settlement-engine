/**
 * visitorFunctionAllowlist.js — THE WRITTEN ALLOWLIST of every function of schema public that a visitor
 * role (anon, authenticated) may EXECUTE, by full signature (migration 213, finding V10-8; lane SEC-GRANTS-2,
 * 2026-11-20). Read by tests/security/functionGrantsWalker.pglite.test.js, which builds the chain under
 * Supabase's default privileges and reds on any visitor-executable function not listed here, on any listed
 * function that no longer exists, and on any door whose listed caller check is no longer in its body.
 *
 * WHY A LIST: Supabase's default privileges grant EXECUTE on every new function of schema public to anon,
 * authenticated and service_role. A migration that writes only `revoke … from public` leaves both visitor
 * roles their own grants; 157 server-only SECURITY DEFINER functions were open that way (V10-8). A new
 * function is therefore a door by default, and this list is where a migration author says, on purpose,
 * that it is one.
 *
 * CLASSES (one per entry):
 *   door           — a SECURITY DEFINER function the browser, the /api pages or an edge function acting with
 *                    the USER's token calls. `check` is the text its body relies on to limit the caller (the
 *                    caller's own id, a privilege helper, or for a public read the visibility predicate);
 *                    the walker reds if that text leaves the body. `anon` is whether anon holds the grant.
 *                    A door with NO caller check carries `residual` instead: the ruling that accepted it.
 *   visitor-needed — a function a VISITOR context runs as the visitor's own role (a row-security policy, a
 *                    check constraint, an INVOKER trigger's body). `context` names it; the walker reds if the
 *                    function is no longer reached from any visitor context (then it should be revoked).
 *   trigger        — a trigger function: PostgreSQL refuses a direct call, so the grant opens nothing.
 *
 * TO ADD A FUNCTION THE VISITOR MUST CALL: grant it explicitly in its migration (`grant execute on function
 * public.f(…) to authenticated` and `anon` only for a signed-out read) and add its row here with the check
 * its body relies on. TO ADD ANY OTHER FUNCTION: revoke it in its migration (`revoke execute on function
 * public.f(…) from public, anon, authenticated; grant execute on function public.f(…) to service_role;`).
 *
 * NOT LISTED, AND NOT 213's (ruling VR27 as amended): the share veil's own helpers, `public._gallery_veil_*`
 * and `public._gallery_doors_*` (created by migrations 211 and 212), and `public._gallery_public_tile_rows()`
 * are 212's to revoke from the visitor roles. 213 does not touch the veil's helpers; `_gallery_public_tile_rows()`
 * is also one of the emergency script's 157, so 213 revokes it a second time (a no-op where 212 already has).
 */

/** @typedef {{ class: 'door', anon: boolean, check: string, note: string }
 *   | { class: 'door', anon: boolean, residual: string, note: string }
 *   | { class: 'visitor-needed', anon: boolean, context: string }
 *   | { class: 'trigger' }} VisitorFunctionEntry */

/** @type {Readonly<Record<string, VisitorFunctionEntry>>} */
export const VISITOR_FUNCTION_ALLOWLIST = Object.freeze({
  'public._deity_chart_axes_valid(jsonb)': { class: 'visitor-needed', anon: true, context: 'CHECK constraint (custom content deity chart axes): evaluated as the writing visitor' },
  'public._gallery_world_snapshot_is_safe(jsonb)': { class: 'visitor-needed', anon: true, context: 'run AS THE VISITOR by the INVOKER trigger _saved_maps_world_snapshot_guard on every saved_maps write (a map save)' },
  'public._saved_maps_world_snapshot_guard()': { class: 'trigger' },
  'public.account_is_active(uuid)': { class: 'door', anon: true, residual: 'VR38', note: 'TRUSTS A PARAMETER: ACCEPTED RESIDUAL (ruling VR38, 2026-11-20): yes/no on whether ANY account id is active; twelve row-security policies and twenty-four doors run through it, and founders_roll and record_referral_intent pass other users\' ids as the visitor' },
  'public.add_gallery_comment(uuid,text)': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.apply_create_route_command(uuid,text,uuid,uuid,timestamp with time zone,jsonb,jsonb,jsonb,jsonb,jsonb,jsonb,jsonb,jsonb,jsonb)': { class: 'door', anon: false, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.apply_custom_content_command(uuid,text,text,jsonb)': { class: 'door', anon: false, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.apply_cut_trade_route_command(uuid,text,uuid,timestamp with time zone,jsonb,jsonb,jsonb,jsonb,jsonb,jsonb,jsonb)': { class: 'door', anon: false, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.apply_import_reconciliation_command(uuid,text,text,uuid,uuid,text,text,jsonb,jsonb)': { class: 'door', anon: false, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.apply_reviewed_supply_chain_command(uuid,text,text,jsonb)': { class: 'door', anon: false, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.bump_public_view(text,text)': { class: 'door', anon: true, check: 'is_public = true', note: 'public read' },
  'public.claim_current_session(text)': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.compare_and_swap_campaign_content_binding(uuid,text,text,uuid,text,jsonb,jsonb)': { class: 'door', anon: false, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.current_user_has_premium_access()': { class: 'visitor-needed', anon: true, context: 'row-security policies (premium map and content writes): evaluated as the visitor; reads only the caller\'s own profile' },
  'public.current_user_is_highest()': { class: 'visitor-needed', anon: true, context: 'row-security policies: evaluated as the visitor; reads only the caller\'s own role' },
  'public.current_user_is_privileged()': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own role (also named by row-security policies)' },
  'public.current_user_is_support_or_higher()': { class: 'visitor-needed', anon: true, context: 'row-security policies (support tables): evaluated as the visitor; reads only the caller\'s own role' },
  'public.delete_gallery_comment(uuid)': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.enforce_allocation_within_grant()': { class: 'trigger' },
  'public.enforce_moderation_ban()': { class: 'trigger' },
  'public.enforce_save_limit()': { class: 'trigger' },
  'public.enforce_version_history_cap()': { class: 'trigger' },
  'public.export_custom_content_archive(uuid)': { class: 'door', anon: false, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.format_ticket_number(bigint)': { class: 'visitor-needed', anon: true, context: 'run AS THE VISITOR by the INVOKER trigger support_ticket_assign_number on the browser\'s own support_messages insert' },
  'public.founder_seats_taken()': { class: 'door', anon: true, check: 'count(*)', note: 'public read' },
  'public.founders_roll()': { class: 'door', anon: true, check: 'founder_credit_listed', note: 'public read' },
  'public.get_ai_pricing()': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.get_credit_balance(uuid)': { class: 'door', anon: false, check: 'coalesce(auth.role(), \'service_role\')', note: 'the caller\'s own balance, or staff; the NULL-uid skip trusts only the service role or no request role (213)' },
  'public.get_gallery_dossier(text)': { class: 'door', anon: true, check: 'is_public = true', note: 'public read' },
  'public.get_gallery_map(text)': { class: 'door', anon: true, check: 'is_public = true', note: 'public read' },
  'public.get_gallery_reaction_state(uuid)': { class: 'door', anon: true, check: 'is_public = true', note: 'public read' },
  'public.get_gallery_vote_state(uuid)': { class: 'door', anon: true, check: 'is_public = true', note: 'public read' },
  'public.get_my_email_preferences()': { class: 'door', anon: false, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.get_my_operator_service_export()': { class: 'door', anon: false, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.get_my_operator_unread_count()': { class: 'door', anon: false, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.get_my_security_question_ids()': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.get_unlisted_dossier(text)': { class: 'door', anon: true, check: 'unlisted_slug =', note: 'public read' },
  'public.get_unlisted_map(text)': { class: 'door', anon: true, check: 'unlisted_slug =', note: 'public read' },
  'public.grant_welcome_credit()': { class: 'trigger' },
  'public.guard_inactive_profile_billing()': { class: 'trigger' },
  'public.handle_new_user()': { class: 'trigger' },
  'public.has_dossier_entitlement(uuid)': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.has_surveyor_entitlement()': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.import_custom_content_archive(uuid,text,text,jsonb)': { class: 'door', anon: false, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.import_gallery_dossier(text)': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.is_current_session()': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.list_curated_dossiers()': { class: 'door', anon: true, check: 'is_public = true', note: 'public read' },
  'public.list_featured_dossiers()': { class: 'door', anon: true, check: 'is_public = true', note: 'public read' },
  'public.list_featured_maps()': { class: 'door', anon: true, check: 'is_public = true', note: 'public read' },
  'public.list_founder_seats_public()': { class: 'door', anon: true, check: 'display_name_status = \'approved\'', note: 'public read' },
  'public.list_gallery_comments(uuid)': { class: 'door', anon: true, check: 'is_public = true', note: 'public read' },
  'public.list_gallery_dossiers(integer,integer,text,text,jsonb,boolean)': { class: 'door', anon: true, check: '_gallery_public_tile_rows()', note: 'public read' },
  'public.list_gallery_maps(integer,integer,text,text,jsonb)': { class: 'door', anon: true, check: 'is_public = true', note: 'public read' },
  'public.list_gallery_more_by_creator(text,integer)': { class: 'door', anon: true, check: 'is_public = true', note: 'public read' },
  'public.list_gallery_reports(text,integer)': { class: 'door', anon: true, check: 'current_user_is_privileged()', note: 'staff' },
  'public.list_my_gallery_dossiers()': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.list_my_operator_messages(integer,timestamp with time zone,uuid)': { class: 'door', anon: false, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.list_my_tickets()': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.list_my_unlisted_dossiers()': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.list_my_unlisted_maps()': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.list_open_report_targets()': { class: 'door', anon: true, check: 'current_user_is_privileged()', note: 'staff' },
  'public.list_ticket_thread(uuid)': { class: 'door', anon: false, check: 'is distinct from auth.uid()', note: 'the ticket owner or a support agent; called through the user token by account-actions and admin-actions; anon closed and the guard made NULL-safe by 213' },
  'public.mark_operator_message_read(uuid)': { class: 'door', anon: false, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.mutate_settlement_batch(uuid,jsonb,uuid[],jsonb)': { class: 'door', anon: false, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.my_transfer_case_status()': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.publish_map(uuid,text,text,text[],boolean,text,text,boolean,jsonb,jsonb,text,jsonb)': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.publish_settlement(uuid)': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.reactivate_free_settlement(uuid)': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.record_referral_intent(text)': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.report_gallery_comment(uuid,text,text)': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.report_gallery_dossier(uuid,text,text)': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.resolve_gallery_report(uuid,text,text)': { class: 'door', anon: true, check: 'current_user_is_privileged()', note: 'staff' },
  'public.resolve_report_target(text,uuid,text,text)': { class: 'door', anon: true, check: 'current_user_is_privileged()', note: 'staff' },
  'public.revoke_settlement_unlisted(uuid)': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.rotate_map_unlisted_slug(uuid)': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.rotate_settlement_unlisted_slug(uuid)': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.set_auto_reload_settings(boolean,integer,integer,integer)': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.set_curated(uuid,boolean,integer)': { class: 'door', anon: false, check: 'coalesce(caller_role, \'\')', note: 'admin door: the browser calls it as a signed-in admin; anon closed and the guard made NULL-safe by 213' },
  'public.set_featured(uuid,boolean,integer)': { class: 'door', anon: false, check: 'coalesce(caller_role, \'\')', note: 'admin door: the browser calls it as a signed-in admin; anon closed and the guard made NULL-safe by 213' },
  'public.set_featured_map(uuid,boolean,integer)': { class: 'door', anon: false, check: 'coalesce(caller_role, \'\')', note: 'admin door: the browser calls it as a signed-in admin; anon closed and the guard made NULL-safe by 213' },
  'public.set_founder_credit_listed(boolean)': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.set_my_email_preference(uuid,text,boolean)': { class: 'door', anon: false, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.set_my_security_answers(text,text,text,text)': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.set_my_telemetry_consent(uuid,jsonb,text)': { class: 'door', anon: false, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.share_map_unlisted(uuid)': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.share_settlement_unlisted(uuid)': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.spend_credits(text,text,text)': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.support_ticket_assign_number()': { class: 'trigger' },
  'public.support_ticket_touch()': { class: 'trigger' },
  'public.surveyor_byok_clear(text)': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.surveyor_byok_set(text,text)': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.surveyor_byok_status(text)': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.surveyor_price_estimates()': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.surveyor_settings_get()': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.surveyor_settings_set(jsonb)': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.sync_profile_email()': { class: 'trigger' },
  'public.toggle_gallery_reaction(uuid,text)': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.toggle_gallery_vote(uuid)': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.touch_custom_content_updated_at()': { class: 'trigger' },
  'public.unpublish_map(uuid)': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.unpublish_settlement(uuid)': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.update_display_name(text)': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.update_updated_at()': { class: 'trigger' },
  'public.validate_redeem_code(text)': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },
  'public.welcome_credit_available(uuid)': { class: 'door', anon: true, check: 'auth.uid()', note: 'the caller\'s own rows' },

});

/**
 * A guard a NULL can slip, REVIEWED and executed (the walker's second arm reds on any other):
 * reactivate_free_settlement's `owner_tier <> 'free'` reads the caller's own tier. It is NULL only for a
 * caller with no profiles row; such a caller can reach only a settlement it owns (`owner_id <> auth.uid()`
 * raises first, after `auth.uid() is null` raises), and the write is then refused by
 * enforce_account_active_write (a caller with no profile is not an active account). Executed on the chain
 * 001..210 + 213 by SEC-GRANTS-2, 2026-11-20: "ERROR: account is not active".
 */
export const REVIEWED_NULL_SLIPS = Object.freeze({
  'public.reactivate_free_settlement(uuid)': "if owner_tier <> 'free' then",
});
