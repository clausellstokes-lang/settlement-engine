-- 080_credit_balance_reconciliation.sql
--
-- Close the dual-source-of-truth gap on the money path.
--
-- The credit ledger (migration 007) is the declared single source of truth:
-- get_credit_balance() sums the append-only grant/spend rows. Migration 007's
-- own header says "never trust a counter column." Migration 024 then added a
-- profiles.credits CACHE (write-after-spend at 024:199) for cheap reads — a
-- deliberate but real second source that can DRIFT from the ledger if any write
-- path ever updates one without the other (a bug, a manual patch, a partial
-- transaction). Nothing detected that drift; a silent over-credit is lost
-- revenue and a silent under-credit is a support ticket.
--
-- This migration converts that silent latent into a DETECTED, queryable
-- condition: a reconciliation function that snapshots current drift into a log
-- table, and a daily pg_cron job that runs it. It does NOT mutate balances —
-- reconciliation is observe-only so a logic bug here can never itself corrupt
-- the money path; an operator (or a follow-up migration) decides the fix.

-- ── Drift log ───────────────────────────────────────────────────────────────
-- Holds the CURRENT set of drifting accounts (replaced on each run), not an
-- unbounded history, so a query/alert sees "who is drifting right now".
create table if not exists public.credit_drift_log (
  user_id        uuid primary key references auth.users(id) on delete cascade,
  cached_credits integer not null,
  ledger_balance integer not null,
  drift          integer not null,   -- cached_credits - ledger_balance
  role           text,
  is_founder     boolean,
  detected_at    timestamptz not null default now()
);

comment on table public.credit_drift_log is
  'Accounts whose profiles.credits cache disagrees with get_credit_balance() (the ledger source of truth). Populated by reconcile_credit_balances(); observe-only — never used to mutate balances. Empty = no drift.';

alter table public.credit_drift_log enable row level security;
-- No anon/authenticated policy: only the service role (which bypasses RLS) and
-- the SECURITY DEFINER reconcile function touch this. Admin read goes through an
-- existing admin RPC pattern, not direct table access.

-- ── Reconciliation function ───────────────────────────────────────────────────
-- Recomputes drift for every account and replaces the log with the current set.
-- Returns the number of drifting accounts (0 = clean). SECURITY DEFINER so it
-- can read profiles + ledger regardless of the caller; service-role only.
create or replace function public.reconcile_credit_balances()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  drift_count integer;
begin
  -- Snapshot-replace: the log always reflects the latest reconciliation pass.
  delete from public.credit_drift_log;

  insert into public.credit_drift_log (user_id, cached_credits, ledger_balance, drift, role, is_founder)
  select
    p.id,
    p.credits,
    public.get_credit_balance(p.id) as ledger_balance,
    p.credits - public.get_credit_balance(p.id) as drift,
    p.role,
    p.is_founder
  from public.profiles p
  -- Exclude the elevated/unlimited sentinel: staff/dev accounts deliberately do
  -- NOT track the ledger (the spend RPC returns a -2 sentinel balance for them),
  -- so their cache is expected to diverge and is not real drift.
  where coalesce(p.credits, 0) >= 0
    and coalesce(p.role, 'user') not in ('admin', 'developer', 'support')
    and p.credits is distinct from public.get_credit_balance(p.id);

  get diagnostics drift_count = row_count;
  if drift_count > 0 then
    raise notice 'credit reconciliation: % account(s) drifting between profiles.credits and get_credit_balance()', drift_count;
  end if;
  return drift_count;
end;
$$;

revoke all on function public.reconcile_credit_balances() from public, anon, authenticated;
-- service_role bypasses RLS and runs the cron job; no broad grant needed.

-- ── Daily schedule (defensive, mirrors migration 039) ─────────────────────────
-- Install pg_cron if we have the privilege; otherwise leave a notice and rely on
-- the operator (or an external scheduler) to run reconcile_credit_balances()
-- nightly. No hard dependency on pg_cron so local dev / restricted projects
-- apply this migration cleanly.
do $$
begin
  execute 'create extension if not exists pg_cron with schema extensions';
exception when others then
  raise notice 'pg_cron unavailable; run reconcile_credit_balances() nightly via an external scheduler';
end $$;

do $$
begin
  perform cron.schedule('credit-balance-reconcile-daily', '15 4 * * *',
    $job$ select public.reconcile_credit_balances(); $job$);
exception when others then
  raise notice 'pg_cron unavailable; schedule credit-balance-reconcile-daily manually';
end $$;
