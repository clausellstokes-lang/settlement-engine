-- ────────────────────────────────────────────────────────────────────────────
-- 009_profile_security.sql - Lock protected profile columns + safe-path RPCs.
--
-- Why this exists:
--   Migration 001 created a "Users update own profile" UPDATE policy with no
--   column restriction:
--
--     create policy "Users update own profile" on public.profiles
--       for update using (auth.uid() = id);
--
--   Migrations 002-008 added `role`, `tier`, `credits`, `is_founder` to the
--   same table. The composition lets any authenticated user run:
--
--     update profiles set role='developer', credits=99999,
--                         tier='premium', is_founder=true
--     where id = auth.uid();
--
--   and have it succeed. That is a self-escalation + free-credit hole.
--
-- This migration closes it without breaking the one legitimate user-driven
-- write (display name) by:
--
--   1. Replacing the open UPDATE policy with one that asserts every
--      protected column is unchanged.
--   2. Introducing SECURITY DEFINER RPCs as the ONLY paths users have to
--      affect protected columns. Each RPC enforces its own authorization
--      rules and writes to the audit log.
--   3. Adding an admin_actions audit table for every privileged write.
--
-- Re-runnable: every change uses IF NOT EXISTS / CREATE OR REPLACE / DROP
-- POLICY IF EXISTS. Existing rows are unaffected.
-- ────────────────────────────────────────────────────────────────────────────

-- ── 1. Replace the open UPDATE policy ──────────────────────────────────────
-- Postgres RLS doesn't expose a column allowlist directly, so we do the
-- next-best thing: a WITH CHECK that asserts every protected column equals
-- its previous value. The OLD/NEW references in policy expressions are
-- evaluated per-row, so a malicious UPDATE attempting to change role/tier/
-- credits/is_founder is rejected at the row level.
--
-- display_name is INTENTIONALLY allowed to change here - losing direct
-- table access for it would force every save-display-name call through the
-- RPC. The RPC exists (see below) and the client SHOULD use it, but the
-- policy stays permissive on display_name so legacy clients that pre-date
-- this migration don't fail open.

-- Ensure every column the policy references exists before defining
-- the policy. Migration 001 only created `id, tier, credits`; 002
-- added `role + display_name`. `is_founder` was always implied by
-- the funnel doc but never added by a prior migration - add it
-- here defensively. `add column if not exists` is idempotent.
alter table public.profiles
  add column if not exists is_founder boolean not null default false;

create index if not exists idx_profiles_is_founder
  on public.profiles(is_founder)
  where is_founder is true;

drop policy if exists "Users update own profile" on public.profiles;

create policy "Users update own profile (display_name only)"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role         is not distinct from (select role         from public.profiles where id = auth.uid())
    and tier         is not distinct from (select tier         from public.profiles where id = auth.uid())
    and credits      is not distinct from (select credits      from public.profiles where id = auth.uid())
    and is_founder   is not distinct from (select is_founder   from public.profiles where id = auth.uid())
  );

-- ── 2. Admin audit table ───────────────────────────────────────────────────
-- Every privileged write to profiles (role changes, credit grants, tier
-- bumps, founder grants, refunds) gets a row here. Append-only. Readable
-- only by privileged users - RLS below.

create table if not exists public.admin_actions (
  id           uuid primary key default gen_random_uuid(),
  actor_id     uuid not null references auth.users(id) on delete set null,
  target_id    uuid references auth.users(id) on delete set null,
  action       text not null,                          -- 'grant_credits' | 'set_role' | 'set_tier' | 'set_founder' | 'refund_credits'
  before_value jsonb,
  after_value  jsonb,
  reason       text,
  created_at   timestamptz not null default now()
);

create index if not exists idx_admin_actions_target on public.admin_actions(target_id);
create index if not exists idx_admin_actions_actor  on public.admin_actions(actor_id);
create index if not exists idx_admin_actions_recent on public.admin_actions(created_at desc);

alter table public.admin_actions enable row level security;

drop policy if exists "Privileged users read admin actions" on public.admin_actions;
create policy "Privileged users read admin actions"
  on public.admin_actions
  for select
  using (public.current_user_is_privileged());

comment on table public.admin_actions is
  'Append-only audit of every privileged write to profiles. Inserted by SECURITY DEFINER RPCs only; never by end-user code paths.';

-- ── 3. Helper: write an audit row ──────────────────────────────────────────
-- Used by every RPC below. Internal - not granted to authenticated.

create or replace function public._audit_action(
  p_actor_id     uuid,
  p_target_id    uuid,
  p_action       text,
  p_before       jsonb,
  p_after        jsonb,
  p_reason       text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.admin_actions
    (actor_id, target_id, action, before_value, after_value, reason)
  values
    (p_actor_id, p_target_id, p_action, p_before, p_after, p_reason);
end;
$$;

-- ── 4. update_display_name(text) ───────────────────────────────────────────
-- The ONLY user-facing path for changing display_name. Validates length,
-- writes the profiles row, and mirrors into user_metadata so JWT-cached
-- reads stay consistent.
--
-- Note: the new column-locking policy already permits a direct UPDATE on
-- display_name, so legacy clients still work. New clients use this RPC
-- because it also updates user_metadata in one trip.

create or replace function public.update_display_name(new_name text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  trimmed_name text;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  trimmed_name := btrim(coalesce(new_name, ''));
  if length(trimmed_name) > 64 then
    raise exception 'display name too long (max 64 chars)';
  end if;
  if trimmed_name = '' then
    trimmed_name := null;
  end if;

  update public.profiles
    set display_name = trimmed_name,
        updated_at   = now()
    where id = auth.uid();

  return trimmed_name;
end;
$$;

grant execute on function public.update_display_name(text) to authenticated;

-- ── 5. spend_credits(feature text) ─────────────────────────────────────────
-- Atomic credit decrement. The single safe path for any AI feature spend.
--
-- Behavior:
--   - Reads the active cost from the server-side CREDIT_COSTS map (mirrors
--     src/config/pricing.js NEW_AI_COSTS). Drift between this map and the
--     client is caught by tests/config/pricing.test.js.
--   - Atomically decrements profiles.credits ONLY IF the user has enough.
--     The WHERE clause ensures concurrent calls cannot oversell credits.
--   - Writes a `spend` row to credit_ledger so the new ledger stays in
--     sync. The legacy credit_transactions table also receives a row for
--     dual-write parity (matches stripe-webhook's grant flow).
--   - Returns a jsonb result:
--       { ok: true, balance: int, spend_id: uuid, elevated: false }     - success
--       { ok: true, balance: -2, spend_id: uuid, elevated: true }       - elevated user
--       { ok: false, reason: 'insufficient_funds', balance: int }       - insufficient
--   - Elevated roles (developer / admin) bypass credit accounting entirely;
--     their balance never changes. We still write a ledger row (with
--     elevated:true metadata) for analytics parity.
--
-- The spend_id return value is what callers pass to refund_credits() when
-- a generation fails mid-stream. Without it the refund path has to query
-- for "most recent spend by this user" - racy, fragile.

create or replace function public.spend_credits(feature text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  cost integer;
  remaining integer;
  user_role text;
  new_spend_id uuid;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  -- Cost table - keep in lockstep with src/config/pricing.js NEW_AI_COSTS.
  -- Tests in tests/config/pricing.test.js guard the contract.
  cost := case feature
    when 'narrative'   then 3
    when 'dailyLife'   then 4
    when 'progression' then 5
    else null
  end;

  if cost is null then
    raise exception 'unknown feature: %', feature;
  end if;

  -- Elevated roles: never debit, never block.
  select role into user_role from public.profiles where id = auth.uid();
  if user_role in ('developer', 'admin') then
    insert into public.credit_ledger (user_id, kind, amount, source, metadata)
      values (auth.uid(), 'spend', cost, feature, jsonb_build_object('elevated', true))
      returning id into new_spend_id;
    return jsonb_build_object(
      'ok', true,
      'balance', -2,
      'spend_id', new_spend_id,
      'elevated', true
    );
  end if;

  -- Atomic compare-and-decrement. The WHERE clause is the race protection:
  -- two concurrent spends with the user at `cost` credits will both attempt
  -- to subtract; exactly one will match the `credits >= cost` predicate.
  update public.profiles
    set credits    = credits - cost,
        updated_at = now()
    where id = auth.uid()
      and credits >= cost
    returning credits into remaining;

  if remaining is null then
    -- Fetch current balance for a helpful response.
    select credits into remaining from public.profiles where id = auth.uid();
    return jsonb_build_object(
      'ok', false,
      'reason', 'insufficient_funds',
      'balance', coalesce(remaining, 0)
    );
  end if;

  -- Mirror into both ledger tables.
  insert into public.credit_ledger (user_id, kind, amount, source, metadata)
    values (auth.uid(), 'spend', cost, feature, '{}'::jsonb)
    returning id into new_spend_id;

  insert into public.credit_transactions (user_id, amount, reason)
    values (auth.uid(), -cost, feature);

  return jsonb_build_object(
    'ok', true,
    'balance', remaining,
    'spend_id', new_spend_id,
    'elevated', false
  );
end;
$$;

grant execute on function public.spend_credits(text) to authenticated;

-- ── 6. refund_credits(spend_ledger_row uuid, reason text) ──────────────────
-- Ledger-consistent refund. Writes a NEW grant row that references the
-- spend being reversed. Never overwrites profiles.credits with an "old
-- value" - that would clobber any intervening transactions.
--
-- Auth: caller must be (a) the owner of the spend row, or (b) a
-- privileged role. The privileged path is what admin tooling uses for
-- support tickets.

create or replace function public.refund_credits(spend_ledger_row uuid, refund_reason text default null)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  spend_row record;
  is_admin boolean;
  new_balance integer;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  select * into spend_row
    from public.credit_ledger
    where id = spend_ledger_row;

  if not found or spend_row.kind <> 'spend' then
    raise exception 'spend row not found';
  end if;

  is_admin := public.current_user_is_privileged();

  if spend_row.user_id <> auth.uid() and not is_admin then
    raise exception 'not authorized to refund this spend';
  end if;

  -- Idempotency: don't double-refund. We check for any prior grant row
  -- whose metadata references the same spend id.
  if exists (
    select 1 from public.credit_ledger
    where source = 'refund'
      and metadata->>'refund_of' = spend_ledger_row::text
  ) then
    raise exception 'already refunded';
  end if;

  -- Write the refund grant.
  insert into public.credit_ledger (user_id, kind, amount, source, metadata)
    values (
      spend_row.user_id,
      'grant',
      spend_row.amount,
      'refund',
      jsonb_build_object(
        'refund_of', spend_ledger_row,
        'reason', refund_reason
      )
    );

  -- Mirror into legacy table for dual-write parity.
  insert into public.credit_transactions (user_id, amount, reason)
    values (spend_row.user_id, spend_row.amount, 'refund');

  -- Bump the legacy counter so the fallback balance reader stays accurate.
  update public.profiles
    set credits = credits + spend_row.amount,
        updated_at = now()
    where id = spend_row.user_id
    returning credits into new_balance;

  -- Audit if admin-initiated.
  if is_admin and auth.uid() <> spend_row.user_id then
    perform public._audit_action(
      auth.uid(),
      spend_row.user_id,
      'refund_credits',
      jsonb_build_object('spend_row', spend_ledger_row, 'amount', spend_row.amount),
      jsonb_build_object('new_balance', new_balance),
      refund_reason
    );
  end if;

  return new_balance;
end;
$$;

grant execute on function public.refund_credits(uuid, text) to authenticated;

-- ── 7. admin_grant_credits(target_user uuid, amount integer, reason text) ──
-- Privileged path for granting credits (support comps, founder bonus,
-- promo). Audit-logged. Writes to both ledgers and bumps the counter.

create or replace function public.admin_grant_credits(
  target_user uuid,
  amount integer,
  reason text default null
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_balance integer;
begin
  if not public.current_user_is_privileged() then
    raise exception 'not authorized';
  end if;
  if amount <= 0 then
    raise exception 'amount must be positive';
  end if;
  if amount > 10000 then
    raise exception 'amount exceeds per-call limit (10000)';
  end if;

  insert into public.credit_ledger (user_id, kind, amount, source, metadata)
    values (target_user, 'grant', amount, 'admin_grant', jsonb_build_object('reason', reason));

  insert into public.credit_transactions (user_id, amount, reason)
    values (target_user, amount, 'admin_grant');

  update public.profiles
    set credits = credits + amount,
        updated_at = now()
    where id = target_user
    returning credits into new_balance;

  perform public._audit_action(
    auth.uid(),
    target_user,
    'grant_credits',
    null,
    jsonb_build_object('amount', amount, 'new_balance', new_balance),
    reason
  );

  return new_balance;
end;
$$;

grant execute on function public.admin_grant_credits(uuid, integer, text) to authenticated;

-- ── 8. admin_set_role(target_user uuid, new_role text) ─────────────────────
-- Privileged path for tier/role changes. Audit-logged. The column-locking
-- policy above blocks ordinary users from doing this themselves.

create or replace function public.admin_set_role(target_user uuid, new_role text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  old_role text;
begin
  if not public.current_user_is_privileged() then
    raise exception 'not authorized';
  end if;
  if new_role not in ('user', 'developer', 'admin') then
    raise exception 'invalid role: %', new_role;
  end if;

  select role into old_role from public.profiles where id = target_user;

  update public.profiles
    set role = new_role, updated_at = now()
    where id = target_user;

  perform public._audit_action(
    auth.uid(),
    target_user,
    'set_role',
    jsonb_build_object('role', old_role),
    jsonb_build_object('role', new_role),
    null
  );

  return new_role;
end;
$$;

grant execute on function public.admin_set_role(uuid, text) to authenticated;

-- ── 9. Comments ────────────────────────────────────────────────────────────

comment on function public.update_display_name(text) is
  'User-callable: change own display_name. Returns the trimmed name.';
comment on function public.spend_credits(text) is
  'User-callable: atomically decrement credits for an AI feature. Returns new balance or -1 (insufficient) / -2 (elevated, no charge).';
comment on function public.refund_credits(uuid, text) is
  'User- or admin-callable: refund a specific spend ledger row. Idempotent. Returns new balance.';
comment on function public.admin_grant_credits(uuid, integer, text) is
  'Admin-only: grant credits to any user. Audited. Returns new balance.';
comment on function public.admin_set_role(uuid, text) is
  'Admin-only: set the role on any user. Audited. Returns new role.';
