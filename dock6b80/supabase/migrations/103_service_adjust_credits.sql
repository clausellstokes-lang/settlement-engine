-- 103_service_adjust_credits.sql
--
-- Money-path fix (LOW finding, admin-actions): the edge `grant_credits` action
-- was a read-modify-write race on the real-money balance. It read
-- profiles.credits in TypeScript, computed next = prev + delta, then called the
-- ABSOLUTE-set service_set_credits(next) — a concurrent user spend_credits
-- between the read and the write was silently clobbered. service_set_credits
-- additionally derives its ledger adjustment from the LEGACY profiles.credits
-- cached counter, which drifts from the ledger truth whenever a grant expires
-- (018's get_credit_balance is the single source of truth).
--
-- Fix: a DELTA-based, service-role-only RPC that applies the adjustment
-- atomically in ONE transaction, LEDGER-FIRST:
--   * locks the target's profiles row FOR UPDATE — the same lock spend_credits
--     (018) takes first, so admin adjustments serialize against user spends;
--   * computes the previous balance from get_credit_balance (ledger truth),
--     NOT the cached counter;
--   * clamps a negative adjustment at zero (matching the edge function's old
--     Math.max(0, prev + delta) intent) — the clamped no-op returns without
--     writing;
--   * writes the delta as a credit_ledger row ('grant' for +, 'spend' for −,
--     source 'admin_adjust') + the legacy credit_transactions mirror, then
--     refreshes the profiles.credits cache from get_credit_balance — the exact
--     dual-write discipline of system_grant_credits (018) / refund_credits (085);
--   * audits to admin_actions.
--
-- NOTE on negative adjustments: the 'spend' row is deliberately UNALLOCATED
-- (no credit_spend_allocations rows), so get_credit_balance counts it via its
-- legacy_spends branch. Like every legacy spend it keeps subtracting even if
-- the grants it notionally consumed later expire — acceptable for a manual
-- admin refund-reversal, and no worse than the absolute-set it replaces.
--
-- service_set_credits ("set the balance to exactly N", still used by the edge
-- update_user_credits action) is ALSO recreated below from its NET-CURRENT
-- body (017 — the only definition; 053 merely reuses it) with the same two
-- corrections: the profile row is locked FOR UPDATE, and prev comes from
-- get_credit_balance instead of the drift-prone profiles.credits cache, so the
-- ledger row it writes is the true delta. Wire shape ({prev,next,delta}) and
-- the audit rows are unchanged.
--
-- Depends on: 017 (_assert_service_admin_actor), 018 (get_credit_balance),
--             007 (credit_ledger), 009 (admin_actions), 001 (credit_transactions).
-- Re-runnable: create or replace + revoke/grant.
-- @rollback: supabase/rollback/103_service_adjust_credits.down.sql — drops the
--            new function and restores 017's service_set_credits verbatim.
--            Function bodies only; no rows touched.

create or replace function public.service_adjust_credits(
  actor_user uuid,
  target_user uuid,
  delta integer,
  reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  prev_balance integer;
  effective_delta integer;
  new_balance integer;
begin
  perform public._assert_service_admin_actor(actor_user);

  if target_user is null then
    raise exception 'target_user is required';
  end if;
  if delta is null or delta = 0 then
    raise exception 'delta must be a non-zero integer';
  end if;
  if abs(delta) > 100000 then
    raise exception 'delta exceeds per-call limit (100000)';
  end if;

  -- Serialize against concurrent balance writers: spend_credits (018) opens by
  -- locking the spender's profiles row FOR UPDATE, so taking the same lock here
  -- makes the read-compute-write below atomic w.r.t. user spends and other
  -- admin adjustments.
  perform 1 from public.profiles where id = target_user for update;
  if not found then
    raise exception 'target profile not found';
  end if;

  -- Ledger truth, not the legacy cached counter.
  prev_balance := public.get_credit_balance(target_user);

  -- Clamp: a refund/deduction never drives the balance below zero (the edge
  -- function's previous Math.max(0, prev + delta) behavior, kept).
  effective_delta := greatest(delta, -greatest(prev_balance, 0));

  if effective_delta = 0 then
    return jsonb_build_object(
      'prev', prev_balance,
      'next', prev_balance,
      'delta', 0,
      'requested_delta', delta
    );
  end if;

  insert into public.credit_ledger (user_id, kind, amount, source, metadata)
  values (
    target_user,
    case when effective_delta > 0 then 'grant' else 'spend' end,
    abs(effective_delta),
    'admin_adjust',
    jsonb_build_object(
      'admin_actor', actor_user,
      'previous_balance', prev_balance,
      'requested_delta', delta,
      'reason', reason
    )
  );

  insert into public.credit_transactions (user_id, amount, reason)
  values (target_user, effective_delta, 'admin_adjust');

  new_balance := public.get_credit_balance(target_user);

  update public.profiles
    set credits = new_balance,
        updated_at = now()
    where id = target_user;

  insert into public.admin_actions
    (actor_id, target_id, action, before_value, after_value, reason)
  values (
    actor_user,
    target_user,
    'admin_adjust_credits',
    jsonb_build_object('credits', prev_balance),
    jsonb_build_object('credits', new_balance, 'delta', effective_delta),
    reason
  );

  return jsonb_build_object(
    'prev', prev_balance,
    'next', new_balance,
    'delta', effective_delta,
    'requested_delta', delta
  );
end;
$$;

revoke all on function public.service_adjust_credits(uuid, uuid, integer, text) from public;
grant execute on function public.service_adjust_credits(uuid, uuid, integer, text) to service_role;

-- ── service_set_credits: recreated from 017's NET-CURRENT body ──────────────
-- Two changes only (marked 103): the FOR UPDATE lock, and prev_credits read
-- from the ledger truth. Everything else — validations, dual-write, audit
-- shape, return shape, grants — is 017 verbatim.
create or replace function public.service_set_credits(
  actor_user uuid,
  target_user uuid,
  new_credits integer,
  reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  prev_credits integer;
  delta integer;
  after_row jsonb;
begin
  perform public._assert_service_admin_actor(actor_user);

  if target_user is null then
    raise exception 'target_user is required';
  end if;
  if new_credits is null or new_credits < 0 then
    raise exception 'new_credits must be a non-negative integer';
  end if;
  if new_credits > 100000 then
    raise exception 'new_credits exceeds per-call limit (100000)';
  end if;

  -- 103: lock the row (spend_credits takes the same lock first) so the
  -- read-compute-write below cannot interleave with a concurrent user spend.
  perform 1 from public.profiles where id = target_user for update;
  if not found then
    raise exception 'target profile not found';
  end if;

  -- 103: ledger truth, not the legacy cached counter — so the ledger row
  -- written below is the TRUE delta even when the cache has drifted (e.g. an
  -- expired grant the cache never learned about).
  prev_credits := public.get_credit_balance(target_user);

  delta := new_credits - prev_credits;

  if delta <> 0 then
    insert into public.credit_ledger (user_id, kind, amount, source, metadata)
    values (
      target_user,
      case when delta > 0 then 'grant' else 'spend' end,
      abs(delta),
      'admin_set',
      jsonb_build_object(
        'admin_actor', actor_user,
        'previous_balance', prev_credits,
        'new_balance', new_credits,
        'reason', reason
      )
    );

    insert into public.credit_transactions (user_id, amount, reason)
    values (target_user, delta, 'admin_set');
  end if;

  update public.profiles p
    set credits = new_credits,
        updated_at = now()
    where p.id = target_user
    returning to_jsonb(p.*) into after_row;

  insert into public.admin_actions
    (actor_id, target_id, action, before_value, after_value, reason)
  values
    (
      actor_user,
      target_user,
      'admin_set_credits',
      jsonb_build_object('credits', prev_credits),
      jsonb_build_object('credits', new_credits, 'delta', delta, 'profile', after_row),
      reason
    );

  return jsonb_build_object('prev', prev_credits, 'next', new_credits, 'delta', delta);
end;
$$;

grant execute on function public.service_set_credits(uuid, uuid, integer, text) to service_role;

comment on function public.service_set_credits(uuid, uuid, integer, text) is
  'Service-role-only admin credit set. Verifies actor_user is elevated, locks the profile row, computes the delta from the ledger (get_credit_balance), writes credit_ledger/credit_transactions/profiles atomically, and audits admin_actions. (Recreated by 103 from 017 with the lock + ledger-truth prev.)';

comment on function public.service_adjust_credits(uuid, uuid, integer, text) is
  'Service-role-only DELTA credit adjustment (admin grant/refund). Locks the profile row, reads the balance from the ledger (get_credit_balance), clamps at zero, writes credit_ledger + credit_transactions + the profiles.credits cache atomically, and audits admin_actions. Replaces the edge read-modify-write over the absolute-set service_set_credits.';
