-- 085_refund_credits_service_role.sql
--
-- Net-state fix (CRITICAL, money): refund_credits is GRANTed to service_role
-- only (migration 033) but its net-current body (migration 009) opens with
-- `if auth.uid() is null then raise 'not authenticated'` and later
-- `if spend_row.user_id <> auth.uid() and not is_admin then raise`.
--
-- generate-narrative (and generate-chronicle) call refund_credits via the
-- SERVICE-ROLE client (supabaseAdmin), where auth.uid() is NULL. So every
-- AI-failure refund threw 'not authenticated' — spend_credits ran on the USER
-- client and succeeded, but the refund never landed and the user stayed charged.
--
-- This re-declares public.refund_credits(uuid, text) from 009's NET-CURRENT body
-- VERBATIM (033 only changed the GRANT), changing ONLY the auth gate to be
-- service-role-aware:
--   - When the caller IS service_role (the trusted server, which has already
--     verified the user's JWT in the edge function and refunds by spend_id),
--     SKIP the `auth.uid() is null` raise AND the `spend_row.user_id <> auth.uid()`
--     ownership raise.
--   - When NOT service_role, preserve the existing auth.uid() + ownership checks
--     EXACTLY (a user may still refund only their OWN spend; admins any spend).
--
-- Idempotency, the dual-write, the legacy-counter bump, the optional admin audit,
-- search_path, and the 033 grant posture are all preserved. The service-role
-- detection idiom mirrors enforce_save_limit (migration 033, line ~112).

create or replace function public.refund_credits(spend_ledger_row uuid, refund_reason text default null)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  spend_row record;
  is_admin boolean;
  is_service boolean;
  new_balance integer;
begin
  -- The trusted server calls this via the service-role client (auth.uid() NULL),
  -- having already verified the user's JWT in the edge function; it refunds by
  -- spend_id. service_role therefore skips the user auth + ownership gates.
  is_service := coalesce(current_setting('request.jwt.claim.role', true), auth.role()) = 'service_role';

  if not is_service and auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  select * into spend_row
    from public.credit_ledger
    where id = spend_ledger_row;

  if not found or spend_row.kind <> 'spend' then
    raise exception 'spend row not found';
  end if;

  is_admin := public.current_user_is_privileged();

  if not is_service and spend_row.user_id <> auth.uid() and not is_admin then
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

  -- Audit if admin-initiated. (Under service_role auth.uid() is NULL, so this
  -- guard is falsy and no audit row is written — matching the prior behavior for
  -- a non-admin caller.)
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

-- Re-affirm the 033 grant posture: refund_credits is service-role only. A user
-- must never self-refund a SUCCESSFUL spend (free generations); the edge
-- functions reach it only after a verified generation failure.
revoke execute on function public.refund_credits(uuid, text) from public;
revoke execute on function public.refund_credits(uuid, text) from anon;
revoke execute on function public.refund_credits(uuid, text) from authenticated;
grant  execute on function public.refund_credits(uuid, text) to service_role;

comment on function public.refund_credits(uuid, text) is
  'Service-role-callable (edge functions, post-failure) or admin-callable: refund a specific spend ledger row. Idempotent. Returns new balance. service_role skips the user auth + ownership gates (it refunds by spend_id after JWT verification in the edge fn).';
