-- ────────────────────────────────────────────────────────────────────────────
-- 104_fix_admin_summary_campaign_count.sql — repair the permanently-NULL
-- "campaigns" metric in admin_user_summary (053).
--
-- 053's summary counted `settlements.campaign_id is not null` — but no migration
-- ever created a campaign_id column on settlements (013 added `campaign_state`
-- jsonb; 055's campaign_id lives on support_tickets). The SELECT therefore raised
-- undefined_column on EVERY schema version, the "pre-013" exception handler
-- swallowed it, and the admin panel's campaign count has been silently NULL since
-- 053 shipped. 053's own comment states the intent: "campaigns: settlements
-- carrying campaign state (column added in 013)".
--
-- Fix: recreate admin_user_summary from its NET-CURRENT body (053 — the only
-- definition after 050) with the count keyed on `campaign_state is not null`.
-- The undefined_column guard is kept (it now guards the real pre-013 case).
-- Everything else — the redacted posture (masked email, no payment ids), the
-- support+ gate, the grants — is byte-identical to 053. search_path pins pg_temp
-- per 094 (which already ALTERed the live function; the declaration here just
-- matches that effective state).
--
-- Additive-over (CREATE OR REPLACE, same signature). Safe to re-run.
--
-- @rollback: pure read-only function recreation, no data mutation and no schema
-- change — reverting = CREATE OR REPLACE admin_user_summary with 053's
-- net-current body (the `campaign_id`-keyed count). No credit/PII data is
-- written or destroyed; the only observable effect is the admin panel's
-- campaign metric returning to NULL. Non-urgent, data-safe either direction.
-- ────────────────────────────────────────────────────────────────────────────

create or replace function public.admin_user_summary(target_user uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  p record;
  settlement_count int;
  public_count     int;
  campaign_count   int;
  ticket_count     int;
  warning_count    int;
begin
  if not public.current_user_is_support_or_higher() then
    raise exception 'not authorized';
  end if;
  if target_user is null then
    raise exception 'target_user is required';
  end if;

  select id, role, tier, is_founder, display_name, email, credits,
         created_at, disabled_at, banned_at
    into p
    from public.profiles
    where id = target_user;

  if not found then
    raise exception 'target profile not found';
  end if;

  select count(*)::int into settlement_count
    from public.settlements where user_id = target_user;
  -- gallery items = the user's public dossiers.
  select count(*)::int into public_count
    from public.settlements where user_id = target_user and is_public = true;
  -- campaigns: settlements carrying campaign state (campaign_state, added in
  -- 013 — 053 mistakenly counted a `campaign_id` column that never existed, so
  -- this metric was permanently NULL). Guard the column so this summary still
  -- works on a pre-013 schema (e.g. test rigs).
  begin
    select count(*)::int into campaign_count
      from public.settlements
      where user_id = target_user and campaign_state is not null;
  exception when undefined_column then
    campaign_count := null;
  end;
  begin
    select count(*)::int into ticket_count
      from public.support_messages where user_id = target_user;
  exception when undefined_table then
    ticket_count := null;
  end;
  select count(*)::int into warning_count
    from public.warnings where user_id = target_user;

  -- Redacted shape: masked email, status flags, counts. NEVER raw email / any
  -- payment id. account_age_days is derived (account age, not the raw ts).
  return jsonb_build_object(
    'id',              p.id,
    'role',            p.role,
    'tier',            p.tier,
    'is_founder',      p.is_founder,
    'display_name',    p.display_name,
    'email_masked',    public.mask_email(p.email),
    'credits',         p.credits,
    'created_at',      p.created_at,
    'account_age_days', greatest(0, (extract(epoch from (now() - p.created_at)) / 86400)::int),
    'settlements',     settlement_count,
    'gallery_items',   public_count,
    'campaigns',       campaign_count,
    'tickets',         ticket_count,
    'warnings',        warning_count,
    'disabled',        (p.disabled_at is not null),
    'banned',          (p.banned_at is not null),
    'disabled_at',     p.disabled_at,
    'banned_at',       p.banned_at,
    'redacted',        true
  );
end;
$$;

revoke all on function public.admin_user_summary(uuid) from public;
grant execute on function public.admin_user_summary(uuid) to authenticated;

comment on function public.admin_user_summary(uuid) is
  'A4 redacted user-management summary (support+). Masked email, status flags, counts. No raw email / payment ids. 104: the campaign count keys on campaign_state (013) — 053 counted a campaign_id column that never existed.';
