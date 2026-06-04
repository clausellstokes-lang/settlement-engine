-- ────────────────────────────────────────────────────────────────────────────
-- 007_credit_ledger.sql - Append-only credit grant + spend ledger.
--
-- Why this exists:
--   The existing credit_transactions table (migration 001) collapses grants
--   and spends into a single signed integer. That works for "what's my
--   balance" but breaks down on every interesting question:
--
--     • "Has the user paid us, or are they only spending free grants?"
--     • "Did this founder-grant ever expire?"
--     • "Refund the credits from order #XYZ" (split refund?)
--     • "How many credits in the wild are about to expire today?"
--
--   This migration introduces a structured ledger with separate grants
--   and spends, per-grant source + metadata, and per-grant expiry. The
--   computed balance lives in a SQL function - no counter column on
--   profiles to drift out of sync.
--
-- Migration strategy:
--   1. Create credit_ledger table.
--   2. Backfill from credit_transactions (signed amount becomes either a
--      grant row or a spend row depending on sign).
--   3. Create get_credit_balance(user_id) SQL function.
--   4. (Application code) Edge functions begin writing to credit_ledger
--      instead of credit_transactions for new transactions.
--   5. credit_transactions stays read-only as a historical record. We do
--      NOT drop it - too risky to lose audit before we're sure the new
--      ledger handles every case.
--
-- Safe to run more than once (every CREATE uses IF NOT EXISTS and the
-- backfill is idempotent on its INSERT ... ON CONFLICT DO NOTHING).
-- ────────────────────────────────────────────────────────────────────────────

-- ── Tables ────────────────────────────────────────────────────────────────

create table if not exists public.credit_ledger (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  kind            text not null check (kind in ('grant', 'spend')),
  amount          integer not null check (amount > 0),    -- always positive; kind decides direction
  source          text not null,                          -- 'purchase' | 'founder_grant' | 'welcome' | 'daily_refresh' | 'promo' | 'refund' | 'narrative' | 'daily_life' | 'progression' | 'admin_grant'
  metadata        jsonb not null default '{}'::jsonb,     -- stripe_session_id, settlement_id, admin_actor, etc.
  expires_at      timestamptz,                            -- null = never; non-null = grant expires at this timestamp
  reversed_by     uuid references public.credit_ledger(id) on delete set null, -- for refunds: the spend row this grant cancels
  created_at      timestamptz not null default now()
);

-- Hot path: "balance for this user". An index on (user_id, expires_at)
-- lets the balance function filter expired grants quickly.
create index if not exists idx_credit_ledger_user
  on public.credit_ledger(user_id);

-- Partial index for perpetual grants (the dominant case: founder
-- lifetime and credit-pack purchases never expire). We CANNOT include
-- `or expires_at > now()` in the predicate because `now()` is STABLE,
-- not IMMUTABLE, and Postgres requires partial-index predicates to be
-- IMMUTABLE. Time-bounded grants still get filtered correctly by the
-- balance function's case-when clause; they just don't enjoy this
-- particular index optimisation.
create index if not exists idx_credit_ledger_user_active
  on public.credit_ledger(user_id, expires_at)
  where expires_at is null;

-- ── Balance function ──────────────────────────────────────────────────────
-- Single source of truth for "how many credits does this user have right
-- now". Reads from the ledger and ignores expired grants. Use this
-- everywhere - never trust a counter column.

create or replace function public.get_credit_balance(target_user uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    sum(case
      when kind = 'grant' and (expires_at is null or expires_at > now()) then amount
      when kind = 'spend' then -amount
      else 0
    end),
    0
  )::integer
  from public.credit_ledger
  where user_id = target_user;
$$;

grant execute on function public.get_credit_balance(uuid) to authenticated;

-- ── RLS ────────────────────────────────────────────────────────────────────

alter table public.credit_ledger enable row level security;

-- Users read their own ledger rows. Inserts are restricted to service
-- role (edge functions); admin-grant / refund flows go through the
-- admin-actions function.
create policy "Users read own ledger"
  on public.credit_ledger
  for select
  using (auth.uid() = user_id);

-- ── Backfill from credit_transactions ─────────────────────────────────────
-- Safe to re-run: the explicit row IDs make this idempotent. If the
-- table is empty (first run), this no-ops.

insert into public.credit_ledger (id, user_id, kind, amount, source, created_at)
select
  ct.id,                                      -- reuse the same id so re-runs no-op
  ct.user_id,
  case when ct.amount >= 0 then 'grant' else 'spend' end as kind,
  abs(ct.amount)                              as amount,
  case
    when ct.reason = 'purchase'    then 'purchase'
    when ct.reason = 'refund'      then 'refund'
    when ct.reason = 'narrative'   then 'narrative'
    when ct.reason = 'daily_life'  then 'daily_life'
    when ct.reason = 'progression' then 'progression'
    else ct.reason
  end                                          as source,
  ct.created_at
from public.credit_transactions ct
where not exists (
  select 1 from public.credit_ledger cl where cl.id = ct.id
)
  and ct.amount != 0;

-- ── Comments (for schema documentation) ───────────────────────────────────

comment on table public.credit_ledger is
  'Append-only ledger of credit grants and spends. Balance is computed by get_credit_balance(); never trust a counter column.';

comment on column public.credit_ledger.kind is
  '"grant" adds credits to the user; "spend" subtracts them.';

comment on column public.credit_ledger.source is
  'Why the row exists. Examples: purchase, founder_grant, welcome, daily_refresh, promo, refund (grants); narrative, daily_life, progression (spends).';

comment on column public.credit_ledger.expires_at is
  'When this grant becomes inert. NULL = never expires (purchased credits, founder grants). Non-NULL = balance function stops counting it after this timestamp.';

comment on column public.credit_ledger.metadata is
  'Free-form JSON. Common keys: stripe_session_id, settlement_id, admin_actor, refund_of (ledger row id), promo_code.';

comment on function public.get_credit_balance(uuid) is
  'Single source of truth for current credit balance. Sums grants (excluding expired) minus spends.';
