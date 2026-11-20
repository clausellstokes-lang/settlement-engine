-- Settlement Generator — Migration 213
-- FUNCTION GRANTS, DEFAULT DENY (finding V10-8, CRITICAL; lane SEC-GRANTS-2, 2026-11-20).
--
-- ⚠⚠ NOT DEPLOYED BY THE LANE THAT WROTE IT. Migrations are owner-gated at deploy
-- (`supabase db push` plus a bump of supabase/applied-head.json in the same act). This file
-- is UNAPPLIED until the owner applies it, after 211 and 212.
--
-- ── WHY ─────────────────────────────────────────────────────────────────────────────────
-- Supabase's default privileges grant EXECUTE on every new function of schema public to
-- anon, authenticated and service_role (its initial schema: `alter default privileges in
-- schema public grant all on functions to postgres, anon, authenticated, service_role`).
-- A migration that writes only `revoke … from public` therefore leaves both visitor roles
-- their own grants, and a SECURITY DEFINER function with no caller check inside is a door
-- for anyone holding the site's public key. On the chain 001..210, 157 functions meant for
-- the server alone were executable by anon and authenticated (a user's DECRYPTED provider
-- key, the BYOK master secret, the admin functions that take the acting admin's id from the
-- caller, credits, seats, purges, the audit log), and three admin doors had a guard a NULL
-- slips (`caller_role not in (…)` is NULL for anon: nothing raised).
-- docs/chair/2026-11-20/security/ holds the catalogue (CATALOGUE.md, every function a visitor
-- may execute, classed, with its callers) and the proof instruments; the emergency script
-- (EMERGENCY_REVOKE.sql, run by the owner's own hand) closed the same 157 and the three.
--
-- ── WHAT IT CHANGES ─────────────────────────────────────────────────────────────────────
-- §1 THE GUARDS, each re-stated from its NET-CURRENT body (the last create-or-replace in
--    001..210, with 094/131's `search_path = public, pg_temp` pin) with ONE line changed:
--    • set_curated (011), set_featured (168), set_featured_map (168):
--        `caller_role not in ('developer','admin')` → `coalesce(caller_role, '') not in (…)`.
--        A caller with no profile row (anon) is now refused like a plain user.
--    • list_ticket_thread (055): `v_owner <> auth.uid()` → `v_owner is distinct from auth.uid()`.
--        Executed on the chain: anon read the user-visible thread of ANY ticket whose id it
--        named (the guard was NULL for anon). Now: empty, as for any non-owner.
--    • get_credit_balance (110): the NULL-uid skip now trusts only a caller whose role is
--        service_role or who carries no request role at all (pg_cron, migrations, postgres):
--        `auth.uid() is not null` → `(auth.uid() is not null or coalesce(auth.role(),
--        'service_role') <> 'service_role')`. anon holds no grant on it; this closes the
--        skip should one ever be granted, or a definer door pass a visitor's target.
--    create or replace keeps each function's grants, owner and comment.
-- §2 THE DOORS CLOSED TO anon ONLY (the browser calls them as a signed-in user):
--    set_curated, set_featured, set_featured_map (REVIEW-VEIL-10's line, as in the emergency
--    script) and list_ticket_thread (its callers are account-actions and admin-actions,
--    through the USER's token: authenticated). Revoked from PUBLIC and anon; list_ticket_thread is
--    then granted to authenticated and service_role (a no-op where the grant exists: it guarantees
--    the user-token callers keep the call whatever the database's ACL held before).
-- §3 THE 157, by full signature, verbatim from EMERGENCY_REVOKE.sql: revoked from PUBLIC,
--    anon and authenticated; granted to service_role (already held by the default
--    privileges; the grant only guarantees removing PUBLIC never takes a door from the edge).
--    PUBLIC is named because Postgres grants EXECUTE to PUBLIC on every new function and both
--    visitor roles inherit it.
-- §4 THE INVOKER HELPERS no visitor context runs (21): revoked from PUBLIC, anon and
--    authenticated; granted to service_role (scripts/ call civility_blocked,
--    _gallery_sanitize_public_json and civility_normalize with the service key). PROVEN on
--    the chain (docs/chair/2026-11-20/security/proof/visitor-closure.sql): no policy, check
--    constraint, column default, view, index or invoker trigger names any of them, and no
--    invoker function a visitor context runs calls them; their only callers are SECURITY
--    DEFINER bodies (which run as their owner) and the service role. Among them seven of the
--    eight older gallery helpers (ruling VR27 as amended).
--    LEFT EXECUTABLE BY THE VISITOR, deliberately (each is run AS the visitor):
--      _gallery_world_snapshot_is_safe(jsonb) — the INVOKER trigger
--        _saved_maps_world_snapshot_guard runs it on every saved_maps write (a map save);
--      format_ticket_number(bigint) — the INVOKER trigger support_ticket_assign_number runs it
--        on the browser's own support_messages insert (FeedbackWidget, founderChairRequest);
--      _deity_chart_axes_valid(jsonb) — a CHECK constraint;
--      current_user_has_premium_access(), current_user_is_highest(),
--        current_user_is_support_or_higher(), current_user_is_privileged(),
--        account_is_active(uuid) — named by row-security policies.
--    NOT CHANGED, by ruling VR38 (the chair, 2026-11-20): account_is_active(uuid) answers yes/no for
--    ANY user id it is given (anon and any signed-in user can ask). Twelve row-security policies and
--    twenty-four doors run through it, and founders_roll and record_referral_intent pass other users'
--    ids as the visitor, so a caller check inside it would break the founders roll and the referral.
--    Accepted residual; a split (a guarded visitor door and an internal twin) is proposed for after
--    the deploy in docs/chair/2026-11-20/security/SEC-GRANTS-2-HANDBACK.md.
--    NOT TOUCHED: the share veil's own helpers (`_gallery_veil_*`, `_gallery_doors_*`, created
--    by 211 and 212) and `_gallery_public_tile_rows()` are 212's to revoke (ruling VR27 as
--    amended). `_gallery_public_tile_rows()` is also one of §3's 157 (it was in the emergency
--    script); revoking it a second time is a no-op.
--
-- ── IDEMPOTENT ON BOTH HISTORIES ────────────────────────────────────────────────────────
-- A production where the owner already ran EMERGENCY_REVOKE.sql and a database built from
-- the migrations alone end in the SAME grants (proved: every function's ACL compared). No
-- statement depends on the prior grant state; every revoke of a privilege not held is a no-op.
-- If any signature below does not exist the whole migration fails and nothing changes.
--
-- NO table, column, row, policy or data change. NO change to who may call a door the browser,
-- the /api pages or an edge function acting with the user's token calls.
--
-- @rollback: re-run the five §1 bodies as they stood at 210, verbatim — set_curated from 011,
--   set_featured and set_featured_map from 168, list_ticket_thread from 055, get_credit_balance from 110
--   (each with 094/131's `set search_path = public, pg_temp` pin) — and re-grant the 21 §4 helpers to
--   anon and authenticated (they are SECURITY INVOKER: they run with the caller's own rights). That
--   reversal restores the five bodies and the 21 grants and leaves every revoke of the 157 and of the four
--   doors standing, on every history (executed by the reader REVIEW-GRANTS-1 on ten histories and on the
--   production order from 203); it does not restore any earlier state of production's grants. Those two
--   steps, executable: docs/chair/2026-11-20/security/review/rollback-213.sql (the reader's, kept with its
--   review). Nothing is destroyed on reversal: 213
--   creates no object and touches no row. Like 202..210 this is re-stated functions plus grants, so it
--   ships no .down.sql (a down script must drop something; 213 adds nothing to drop).
--   NOT to be reversed, deliberately: the 157, the three admin doors' and list_ticket_thread's revokes
--   (with the 210 body anon would read any ticket's thread again). Re-granting them to the
--   visitor roles re-opens V10-8 (a user's decrypted provider key, the BYOK master secret, the
--   actor-trusting admin functions); supabase/rollback/README.md forbids reversing a security tightening
--   as a blanket down. One function at a time, by hand, only if forced:
--   `grant execute on function public.<signature> to anon, authenticated;`.

-- ═══ §1 THE GUARDS ═══════════════════════════════════════════════════════════════════

-- ── set_curated: net-current body, ONE line changed (the guard) ──
create or replace function public.set_curated(
  target_id   uuid,
  curated     boolean,
  sort_order  integer default null
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  caller_role text;
  before_state jsonb;
begin
  -- Gate: only developer / admin roles can curate.
  select role into caller_role
    from public.profiles
    where id = auth.uid();

  if coalesce(caller_role, '') not in ('developer', 'admin') then
    raise exception 'Only admins can change curation status';
  end if;

  -- Capture before-state for the audit log.
  select jsonb_build_object(
    'is_curated', is_curated,
    'curated_order', curated_order,
    'name', name
  ) into before_state
    from public.settlements
    where id = target_id;

  if before_state is null then
    raise exception 'Settlement not found';
  end if;

  -- Apply the change. If marking as curated, the row must also be public.
  if curated then
    update public.settlements
      set is_curated    = true,
          curated_order = sort_order
      where id = target_id and is_public = true;
    if not found then
      raise exception 'Cannot curate a non-public settlement. Publish it first.';
    end if;
  else
    update public.settlements
      set is_curated    = false,
          curated_order = null
      where id = target_id;
  end if;

  -- Audit log entry via the existing _audit_action helper. The
  -- admin_actions table's target_id column references auth.users(id),
  -- so we can't put a settlement_id there directly — instead we pass
  -- target_id=NULL and store the settlement context inside the
  -- before/after JSON payloads (with the settlement id explicit).
  perform public._audit_action(
    auth.uid(),
    null,
    case when curated then 'gallery_curate' else 'gallery_uncurate' end,
    before_state || jsonb_build_object('settlement_id', target_id),
    jsonb_build_object(
      'settlement_id', target_id,
      'is_curated',    curated,
      'curated_order', sort_order
    ),
    null
  );
end;
$$;

-- ── set_featured: net-current body, ONE line changed (the guard) ──
create or replace function public.set_featured(
  target_id   uuid,
  featured    boolean,
  sort_order  integer default null
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  caller_role text;
  before_state jsonb;
begin
  select role into caller_role from public.profiles where id = auth.uid();
  if coalesce(caller_role, '') not in ('developer', 'admin') then
    raise exception 'Only admins can change featured status';
  end if;

  select jsonb_build_object('is_featured', is_featured, 'featured_order', featured_order, 'name', name)
    into before_state from public.settlements where id = target_id;
  if before_state is null then raise exception 'Settlement not found'; end if;

  if featured then
    update public.settlements set is_featured = true, featured_order = sort_order
      where id = target_id and is_public = true;
    if not found then raise exception 'Cannot feature a non-public settlement. Publish it first.'; end if;
  else
    update public.settlements set is_featured = false, featured_order = null where id = target_id;
  end if;

  perform public._audit_action(
    auth.uid(), null,
    case when featured then 'gallery_feature' else 'gallery_unfeature' end,
    before_state || jsonb_build_object('settlement_id', target_id),
    jsonb_build_object('settlement_id', target_id, 'is_featured', featured, 'featured_order', sort_order),
    null
  );
end;
$$;

-- ── set_featured_map: net-current body, ONE line changed (the guard) ──
create or replace function public.set_featured_map(
  target_id   uuid,
  featured    boolean,
  sort_order  integer default null
)
returns void
language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  caller_role text;
  before_state jsonb;
begin
  select role into caller_role from public.profiles where id = auth.uid();
  if coalesce(caller_role, '') not in ('developer', 'admin') then
    raise exception 'Only admins can change featured status';
  end if;

  select jsonb_build_object('is_featured', is_featured, 'featured_order', featured_order, 'name', name)
    into before_state from public.saved_maps where id = target_id;
  if before_state is null then raise exception 'Map not found'; end if;

  if featured then
    update public.saved_maps set is_featured = true, featured_order = sort_order
      where id = target_id and is_public = true;
    if not found then raise exception 'Cannot feature a non-public map. Publish it first.'; end if;
  else
    update public.saved_maps set is_featured = false, featured_order = null where id = target_id;
  end if;

  perform public._audit_action(
    auth.uid(), null,
    case when featured then 'gallery_feature_map' else 'gallery_unfeature_map' end,
    before_state || jsonb_build_object('map_id', target_id),
    jsonb_build_object('map_id', target_id, 'is_featured', featured, 'featured_order', sort_order),
    null
  );
end;
$$;

-- ── list_ticket_thread: net-current body, ONE line changed (the guard) ──
create or replace function public.list_ticket_thread(p_id uuid)
returns table (
  id uuid,
  author_role text,
  kind text,
  visibility text,
  body text,
  created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_owner uuid;
  v_agent boolean;
begin
  if p_id is null then raise exception 'a ticket id is required'; end if;
  v_agent := public.current_user_is_support_or_higher();
  select sm.user_id into v_owner from public.support_messages sm where sm.id = p_id;
  if v_owner is null then
    -- ticket missing or (for a non-agent) not theirs → empty
    if not v_agent then return; end if;
  end if;
  if not v_agent and v_owner is distinct from auth.uid() then
    return; -- not the owner, not an agent → nothing
  end if;

  return query
    select e.id, e.author_role, e.kind, e.visibility, e.body, e.created_at
      from public.support_ticket_events e
     where e.ticket_id = p_id
       -- the OWNER never sees an internal note; an agent sees everything.
       and (v_agent or e.visibility = 'user')
     order by e.created_at asc;
end;
$$;

-- ── get_credit_balance: net-current body, ONE line changed (the guard) ──
create or replace function public.get_credit_balance(target_user uuid)
returns integer
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  bal integer;
begin
  -- IDOR guard: a genuine end-user (non-NULL auth.uid()) may read only their own
  -- balance, unless they are elevated staff. service_role / pg_cron / migrations and
  -- the SECURITY DEFINER money functions reach here with auth.uid() = NULL and are
  -- trusted to read any target.
  if (auth.uid() is not null or coalesce(auth.role(), 'service_role') <> 'service_role')
     and target_user is distinct from auth.uid()
     and not public.current_user_is_privileged()
  then
    raise exception 'get_credit_balance: not authorized to read another user''s credit balance'
      using errcode = '42501';  -- insufficient_privilege
  end if;

  -- Balance math verbatim from 018 (net-current): active grants minus their
  -- allocated spends, minus legacy un-allocated non-elevated spends.
  with active_grants as (
    select id, amount
    from public.credit_ledger
    where user_id = target_user
      and kind = 'grant'
      and (expires_at is null or expires_at > now())
  ),
  allocated as (
    select grant_id, sum(amount)::integer as amount
    from public.credit_spend_allocations
    group by grant_id
  ),
  legacy_spends as (
    select coalesce(sum(s.amount), 0)::integer as amount
    from public.credit_ledger s
    where s.user_id = target_user
      and s.kind = 'spend'
      and coalesce(s.metadata->>'elevated', 'false') <> 'true'
      and not exists (
        select 1 from public.credit_spend_allocations a
        where a.spend_id = s.id
      )
  )
  select (
    coalesce(sum(g.amount - coalesce(a.amount, 0)), 0)
    - (select amount from legacy_spends)
  )::integer
  into bal
  from active_grants g
  left join allocated a on a.grant_id = g.id;

  return bal;
end;
$$;

-- ═══ §2 THE DOORS CLOSED TO anon ONLY ════════════════════════════════════════════════
revoke execute on function public.set_curated(uuid,boolean,integer), public.set_featured(uuid,boolean,integer), public.set_featured_map(uuid,boolean,integer) from public, anon;
revoke execute on function public.list_ticket_thread(uuid) from public, anon;
grant execute on function public.list_ticket_thread(uuid) to authenticated, service_role;

-- ═══ §3 THE 157 (verbatim from EMERGENCY_REVOKE.sql; the two BYOK key functions first) ═══
revoke execute on function public._surveyor_byok_secret() from public, anon, authenticated;
revoke execute on function public.surveyor_byok_get(uuid,text) from public, anon, authenticated;
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

-- ═══ §4 THE INVOKER HELPERS NO VISITOR CONTEXT RUNS (21) ════════════════════════════
revoke execute on function public._civility_stem_hits(text) from public, anon, authenticated;
revoke execute on function public._civility_token_hits(text) from public, anon, authenticated;
revoke execute on function public._gallery_apply_member_overrides(jsonb,jsonb,jsonb,boolean,boolean,boolean) from public, anon, authenticated;
revoke execute on function public._gallery_chronicle_entry(jsonb) from public, anon, authenticated;
revoke execute on function public._gallery_chronicle_json(jsonb) from public, anon, authenticated;
revoke execute on function public._gallery_dm_full_json(jsonb) from public, anon, authenticated;
revoke execute on function public._gallery_map_backdrop(jsonb) from public, anon, authenticated;
revoke execute on function public._gallery_npc_key(jsonb) from public, anon, authenticated;
revoke execute on function public._gallery_sanitize_public_json(jsonb,text[]) from public, anon, authenticated;
revoke execute on function public._gc_dim_sql(text) from public, anon, authenticated;
revoke execute on function public._make_public_slug() from public, anon, authenticated;
revoke execute on function public._make_unlisted_slug() from public, anon, authenticated;
revoke execute on function public._trunc_unit(text) from public, anon, authenticated;
revoke execute on function public.civility_blocked(text) from public, anon, authenticated;
revoke execute on function public.civility_normalize(text) from public, anon, authenticated;
revoke execute on function public.is_allowed_email_category(text) from public, anon, authenticated;
revoke execute on function public.is_allowed_security_question_id(text) from public, anon, authenticated;
revoke execute on function public.market_k_min_campaigns() from public, anon, authenticated;
revoke execute on function public.market_k_min_users() from public, anon, authenticated;
revoke execute on function public.mask_email(text) from public, anon, authenticated;
revoke execute on function public.normalize_external_name(text) from public, anon, authenticated;
grant execute on function public._civility_stem_hits(text) to service_role;
grant execute on function public._civility_token_hits(text) to service_role;
grant execute on function public._gallery_apply_member_overrides(jsonb,jsonb,jsonb,boolean,boolean,boolean) to service_role;
grant execute on function public._gallery_chronicle_entry(jsonb) to service_role;
grant execute on function public._gallery_chronicle_json(jsonb) to service_role;
grant execute on function public._gallery_dm_full_json(jsonb) to service_role;
grant execute on function public._gallery_map_backdrop(jsonb) to service_role;
grant execute on function public._gallery_npc_key(jsonb) to service_role;
grant execute on function public._gallery_sanitize_public_json(jsonb,text[]) to service_role;
grant execute on function public._gc_dim_sql(text) to service_role;
grant execute on function public._make_public_slug() to service_role;
grant execute on function public._make_unlisted_slug() to service_role;
grant execute on function public._trunc_unit(text) to service_role;
grant execute on function public.civility_blocked(text) to service_role;
grant execute on function public.civility_normalize(text) to service_role;
grant execute on function public.is_allowed_email_category(text) to service_role;
grant execute on function public.is_allowed_security_question_id(text) to service_role;
grant execute on function public.market_k_min_campaigns() to service_role;
grant execute on function public.market_k_min_users() to service_role;
grant execute on function public.mask_email(text) to service_role;
grant execute on function public.normalize_external_name(text) to service_role;
