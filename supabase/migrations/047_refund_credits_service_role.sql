-- 047_refund_credits_service_role.sql
--
-- CRITICAL money-path fix (review finding F1).
--
-- Migration 033 revoked EXECUTE on refund_credits from `authenticated`/`anon`
-- and granted it to `service_role` only, moving every automatic refund of a
-- FAILED paid AI generation onto the service-role client (generate-narrative,
-- generate-chronicle). But the function body (009_profile_security.sql:295)
-- still opens with:
--
--     if auth.uid() is null then raise exception 'not authenticated'; end if;
--
-- auth.uid() is NULL under the service-role key, so the RPC's ONLY permitted
-- caller ALWAYS raises. Net effect in production: every failed paid generation
-- charged the user and refunded nothing; the edge function surfaced a
-- `{refund:'failed', spend_id, supportNote}` stream message and told the user
-- to contact support. The pglite credit tests mocked auth.uid() to the spend
-- owner, so the exact regression was structurally invisible to them.
--
-- This migration makes service-role invocation a FIRST-CLASS contract of the
-- function (the way spend_credits/024, grant/017, and 018 already gate
-- privileged writes) rather than a path the body rejects:
--
--   1. Detect the caller role via the house idiom
--      `coalesce(current_setting('request.jwt.claim.role', true), auth.role())`.
--   2. service_role  -> trusted; skip the auth.uid() presence check AND the
--                       per-row ownership check (the edge function only reaches
--                       the refund path on a genuine, server-verified failure).
--   3. everyone else -> unchanged owner/admin semantics (defence-in-depth; 033
--                       still revokes user EXECUTE, so no user JWT can call it,
--                       but the branch is kept in case a future migration
--                       re-grants a privileged human caller).
--
-- It also converts refund idempotency from a check-then-insert (a TOCTOU race
-- under concurrent retries) into a STRUCTURAL guarantee: a partial unique index
-- on (metadata->>'refund_of') for refund grants. The function keeps its
-- friendly 'already refunded' error for the common case but now cannot
-- double-refund even under a race, because the second insert violates the index.

-- ── Structural idempotency: at most one refund grant per spend row ──────────
create unique index if not exists idx_credit_ledger_one_refund_per_spend
  on public.credit_ledger ((metadata->>'refund_of'))
  where kind = 'grant' and source = 'refund';

-- ── refund_credits: service-role is a first-class caller ────────────────────
create or replace function public.refund_credits(spend_ledger_row uuid, refund_reason text default null)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  spend_row  record;
  is_service boolean;
  is_admin   boolean;
  new_balance integer;
begin
  -- Trusted server context? (edge functions call via the service-role client)
  is_service := coalesce(current_setting('request.jwt.claim.role', true), auth.role()) = 'service_role';

  -- A human caller must be authenticated; the service role need not be.
  if not is_service and auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  select * into spend_row
    from public.credit_ledger
    where id = spend_ledger_row;

  if not found or spend_row.kind <> 'spend' then
    raise exception 'spend row not found';
  end if;

  is_admin := (not is_service) and public.current_user_is_privileged();

  -- Ownership check applies only to human callers. The service role is trusted
  -- because it only reaches this path after a server-verified generation failure
  -- and never exposes the RPC to the client.
  if not is_service and spend_row.user_id <> auth.uid() and not is_admin then
    raise exception 'not authorized to refund this spend';
  end if;

  -- Idempotency: don't double-refund. Backed by
  -- idx_credit_ledger_one_refund_per_spend so this is a friendly early-out for
  -- the common case, not the sole guard — a concurrent second insert fails hard.
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

  -- Audit if a privileged HUMAN initiated it (service-role refunds are
  -- system actions, audited via the edge-function logs instead).
  if is_admin and auth.uid() is not null and auth.uid() <> spend_row.user_id then
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

-- Preserve the 033 grant posture (idempotent — safe to re-assert).
revoke execute on function public.refund_credits(uuid, text) from authenticated;
revoke execute on function public.refund_credits(uuid, text) from anon;
grant  execute on function public.refund_credits(uuid, text) to service_role;
