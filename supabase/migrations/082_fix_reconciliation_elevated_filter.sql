-- 082_fix_reconciliation_elevated_filter.sql
--
-- Fix a defect in migration 080's reconcile_credit_balances(): its elevated-
-- account exclusion used a HARDCODED role list ('admin','developer','support')
-- that does not match the set spend_credits actually treats as elevated.
--
-- spend_credits (024:153-159) treats an account as elevated when
--   role in ('developer','admin') OR current_user_is_privileged()
-- and for those accounts it records the spend with metadata.elevated=true and
-- DELIBERATELY SKIPS the profiles.credits cache update — so an elevated account's
-- cache is *expected* to diverge from get_credit_balance() and must never be
-- flagged as drift. The 080 role list got this wrong two ways:
--   - OVER-excluded 'support' (support tracks credits normally → real drift hidden)
--   - UNDER-excluded the privileged-email account (current_user_is_privileged,
--     not a role) → flagged as a false-positive drift every run.
--
-- The drift-proof signal is the LEDGER ITSELF: any account that has ever taken an
-- elevated spend carries a credit_ledger row with metadata.elevated='true'. Keying
-- the exclusion on that records the ACTUAL elevation decisions, so it tracks
-- whatever current_user_is_privileged()/role logic evolves into without re-drifting.
-- Observe-only and same signature (returns integer) → CREATE OR REPLACE is safe.

create or replace function public.reconcile_credit_balances()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  drift_count integer;
begin
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
  where coalesce(p.credits, 0) >= 0
    -- Exclude elevated/unlimited accounts whose cache deliberately diverges (see
    -- header): key on the ledger's own elevated-spend signature, not a role list.
    and not exists (
      select 1 from public.credit_ledger l
      where l.user_id = p.id
        and l.kind = 'spend'
        and l.metadata->>'elevated' = 'true'
    )
    and p.credits is distinct from public.get_credit_balance(p.id);

  get diagnostics drift_count = row_count;
  if drift_count > 0 then
    raise notice 'credit reconciliation: % account(s) drifting between profiles.credits and get_credit_balance()', drift_count;
  end if;
  return drift_count;
end;
$$;

-- CREATE OR REPLACE preserves the ACL, but re-issue the lockdown explicitly so the
-- service-role-only invariant is visible at this migration too.
revoke all on function public.reconcile_credit_balances() from public, anon, authenticated;
