-- 110_restrict_get_credit_balance_to_owner.sql
--
-- Close an IDOR on the credit-balance reader.
--
-- WHY
--   public.get_credit_balance(target_user uuid) (net-current body: 018; search_path
--   later pinned to `public, pg_temp` by 094 via ALTER, which does NOT recreate the
--   body) is SECURITY DEFINER and takes a CALLER-SUPPLIED uuid, then sums THAT user's
--   credit ledger with NO internal authorization check. It is granted to
--   `authenticated` (018:134) and — because a new function's EXECUTE defaults to
--   PUBLIC and nothing ever revoked it — is also reachable by `anon` through
--   PostgREST. So any authenticated (or anon) caller could
--       supabase.rpc('get_credit_balance', { target_user: '<any-uuid>' })
--   and read ANOTHER user's balance, or use it as a UUID-existence oracle. Low
--   severity (leaks one integer keyed by a known uuid; no money moves) but a real
--   IDOR, and the anon default-grant is the strictly-worse variant of the same hole.
--
-- WHAT
--   1. CREATE OR REPLACE the function from its net-current 018 body — the balance
--      math is byte-identical — converted from `language sql` to `language plpgsql`
--      so it can gate access, adding an ownership guard:
--        - A genuine end-user (non-NULL auth.uid()) may read only their OWN balance.
--        - The trusted internal callers are unaffected because they reach the body
--          with a NULL auth.uid():
--            * spend_credits reads get_credit_balance(auth.uid())          → self
--            * system_grant_credits / service_adjust_credits (103) / the
--              reconcile_credit_balances cron (080/082) run as service_role or via
--              pg_cron, where auth.uid() is NULL → may read any target.
--          (They are SECURITY DEFINER functions owned by the same role, so they can
--          execute get_credit_balance regardless of the API-role grants below.)
--        - Elevated staff (current_user_is_privileged, 018) may read any balance for
--          support, matching the codebase's existing privilege pattern.
--   2. Lock the API surface to the two legitimate DIRECT callers: REVOKE from public
--      + anon (closes the anon path — REVOKE FROM public also drops the default
--      EXECUTE the CREATE granted to PUBLIC, which is what exposed anon), then GRANT
--      to authenticated (the client reader in creditLedger.js, passes user.id) and
--      service_role (the generate-narrative precheck, passes the user's OWN id).
--   3. Re-declare 094's search_path hardening (public, pg_temp). CREATE OR REPLACE
--      resets proconfig, so it is set here explicitly rather than left to 094.
--
--   Same signature, return type, STABLE, and SECURITY DEFINER, so every existing
--   caller (SQL, edge, client) stays source-compatible.
--
-- @rollback: recreate 018's SQL body verbatim (`create or replace function
--   public.get_credit_balance(target_user uuid) ... language sql ...`) and
--   `grant execute on function public.get_credit_balance(uuid) to authenticated;`
--   — NOTE that reinstates the IDOR AND the anon read; roll back only to unblock a
--   broken deploy, then re-fix.

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
  if auth.uid() is not null
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

-- Lock the API surface: drop the PUBLIC/anon reach, keep the two intended direct
-- callers. service_role must be granted EXPLICITLY here because REVOKE FROM public
-- removes the default grant it inherited via PUBLIC (generate-narrative's precheck
-- calls this as service_role).
revoke all on function public.get_credit_balance(uuid) from public, anon;
grant execute on function public.get_credit_balance(uuid) to authenticated, service_role;

comment on function public.get_credit_balance(uuid) is
  'Current credit balance for target_user. IDOR-guarded (110): an authenticated caller may read only their own balance (auth.uid()); service_role/pg_cron/the SECURITY DEFINER money functions (NULL auth.uid()) and elevated staff may read any target. Monthly allowance grants expire independently; allocated monthly spends do not consume purchased packs after expiry.';
