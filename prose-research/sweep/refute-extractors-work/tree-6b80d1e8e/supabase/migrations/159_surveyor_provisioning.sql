-- ────────────────────────────────────────────────────────────────────────────
-- 159_surveyor_provisioning.sql — SURVEYOR PROVISIONING (DESIGN_MONEY_WAVE §5 /
-- #16, slice M-4). Closes the audit §5 gap: purchase→grant through the webhook
-- fortress + admin verbs. Surveyor stays ENTITLEMENT-truth (139), NOT a
-- profiles.tier value — the sim never reads it (premium-seam law).
--
-- ⚠ NUMBERING: 159 per manager coordination (this wave takes 157-161; siblings
--   hold 156; renumber contiguously at fold). See 157_money_events.sql's header.
--
-- WHAT
--   1. surveyor_entitlements gains the Stripe binding (stripe_subscription_id UNIQUE,
--      stripe_customer_id) so the webhook can key a revoke on the deleted sub.
--   2. grant/revoke service-role definer RPCs (upsert reactivates a revoked row;
--      revoke_by_subscription is the stale-sub-safe webhook path).
--   3. RIDER (audit 1.3 FIX ORDERED): surveyor_byok_set gains an entitlement gate —
--      refuse unless has_surveyor_entitlement() OR the caller is a founder (the One
--      Door #15 population). Recreated from 139's net-current body + that one delta,
--      pg_temp preserved (116 discipline).
--
-- Depends on: 139 (surveyor_entitlements, surveyor_byok_keys, has_surveyor_
--   entitlement, _surveyor_byok_secret). Re-runnable.
-- @rollback: alter table public.surveyor_entitlements drop column if exists
--   stripe_subscription_id, drop column if exists stripe_customer_id;
--   drop function public.grant_surveyor_entitlement(uuid, text, text, text);
--   drop function public.revoke_surveyor_entitlement(uuid, text);
--   drop function public.revoke_surveyor_entitlement_by_subscription(text);
--   AND recreate 139's surveyor_byok_set body verbatim (dropping the entitlement gate).
-- ────────────────────────────────────────────────────────────────────────────

-- ── 1. Stripe binding on the entitlement ───────────────────────────────────────
alter table public.surveyor_entitlements add column if not exists stripe_subscription_id text;
alter table public.surveyor_entitlements add column if not exists stripe_customer_id text;

-- One entitlement row may record at most one live sub id (a webhook revoke keys on
-- it). Partial unique: NULLs (manual/founder grants) don't collide.
create unique index if not exists uidx_surveyor_entitlement_subscription
  on public.surveyor_entitlements(stripe_subscription_id)
  where stripe_subscription_id is not null;

-- ── 2. Provisioning RPCs (service-role only) ───────────────────────────────────

-- grant/re-grant: reactivates a revoked row, stamps granted_at, clears revoked_at,
-- records the sub/customer ids. COALESCE keeps a prior recorded id when the caller
-- passes none (manual re-grant of a Stripe-provisioned seat).
create or replace function public.grant_surveyor_entitlement(
  p_user uuid,
  p_source text,
  p_subscription_id text default null,
  p_customer_id text default null
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare caller_role text;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'grant_surveyor_entitlement is service-role only (got: %)', caller_role;
  end if;
  if p_user is null then raise exception 'p_user is required'; end if;

  insert into public.surveyor_entitlements
    (user_id, status, source, granted_at, revoked_at, stripe_subscription_id, stripe_customer_id)
    values (p_user, 'active', coalesce(nullif(btrim(p_source), ''), 'subscription'), now(), null, p_subscription_id, p_customer_id)
  on conflict (user_id) do update set
    status = 'active',
    source = coalesce(nullif(btrim(p_source), ''), public.surveyor_entitlements.source),
    granted_at = now(),
    revoked_at = null,
    stripe_subscription_id = coalesce(p_subscription_id, public.surveyor_entitlements.stripe_subscription_id),
    stripe_customer_id = coalesce(p_customer_id, public.surveyor_entitlements.stripe_customer_id);
  return true;
end;
$$;
revoke all on function public.grant_surveyor_entitlement(uuid, text, text, text) from public;
grant execute on function public.grant_surveyor_entitlement(uuid, text, text, text) to service_role;

-- revoke by user (admin/concierge path).
create or replace function public.revoke_surveyor_entitlement(p_user uuid, p_reason text default null)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare caller_role text; v_count int;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'revoke_surveyor_entitlement is service-role only (got: %)', caller_role;
  end if;
  update public.surveyor_entitlements
    set status = 'revoked', revoked_at = now()
    where user_id = p_user and status = 'active';
  get diagnostics v_count = row_count;
  return v_count > 0;
end;
$$;
revoke all on function public.revoke_surveyor_entitlement(uuid, text) from public;
grant execute on function public.revoke_surveyor_entitlement(uuid, text) to service_role;

-- revoke by subscription (the webhook path). STALE-SUB-SAFE: revokes ONLY the row
-- recording this sub id; returns true iff a row was revoked (so the webhook can
-- `break` before the Cartographer downgrade). A deletion for an unknown sub → false.
create or replace function public.revoke_surveyor_entitlement_by_subscription(p_subscription_id text)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare caller_role text; v_count int;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'revoke_surveyor_entitlement_by_subscription is service-role only (got: %)', caller_role;
  end if;
  if p_subscription_id is null or btrim(p_subscription_id) = '' then return false; end if;
  update public.surveyor_entitlements
    set status = 'revoked', revoked_at = now()
    where stripe_subscription_id = p_subscription_id and status = 'active';
  get diagnostics v_count = row_count;
  return v_count > 0;
end;
$$;
revoke all on function public.revoke_surveyor_entitlement_by_subscription(text) from public;
grant execute on function public.revoke_surveyor_entitlement_by_subscription(text) to service_role;

-- ── 3. surveyor_byok_set — 139 body + the entitlement-gate RIDER (116 discipline) ─
-- Recreated from 139's net-current body VERBATIM with ONE delta: a gate that refuses
-- unless the caller holds an active Surveyor entitlement OR is a founder (the One
-- Door #15 population). The gate raises BEFORE any pgcrypto call, so an unentitled
-- caller never reaches the vault. pg_temp pin preserved.
create or replace function public.surveyor_byok_set(p_provider text, p_key text)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare v_uid uuid; v_provider text;
begin
  v_uid := auth.uid();
  if v_uid is null then raise exception 'not authenticated'; end if;
  if p_key is null or btrim(p_key) = '' then raise exception 'key is required'; end if;
  -- RIDER (audit 1.3): BYOK is a Surveyor-tier capability. Refuse unless the caller
  -- holds an active entitlement or is a founder.
  if not (public.has_surveyor_entitlement()
          or exists (select 1 from public.profiles where id = v_uid and is_founder)) then
    raise exception 'a Surveyor entitlement is required to set a provider key';
  end if;
  v_provider := coalesce(nullif(btrim(p_provider), ''), 'anthropic');
  insert into public.surveyor_byok_keys (user_id, provider, ciphertext, created_at, rotated_at)
  values (v_uid, v_provider, pgp_sym_encrypt(p_key, public._surveyor_byok_secret()), now(), now())
  on conflict (user_id, provider)
  do update set ciphertext = excluded.ciphertext, rotated_at = now();
  return true;
end;
$$;
revoke all on function public.surveyor_byok_set(text, text) from public;
grant execute on function public.surveyor_byok_set(text, text) to authenticated;
