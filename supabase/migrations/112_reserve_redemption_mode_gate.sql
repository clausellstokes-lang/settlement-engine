-- 112_reserve_redemption_mode_gate.sql
--
-- Move the redeem-code applies_to/mode check INTO reserve_redemption, gated BEFORE
-- the once-per-user redemptions row is created.
--
-- WHY
--   A redeem code carries an applies_to ('subscription' | 'one_time' | 'any'). The
--   mode check lived in create-checkout, AFTER reserve_redemption had already claimed
--   the seat and inserted the (code, user_id) row. When a user typed a valid code into
--   the WRONG modal (e.g. a subscription-only code in the credit-pack / payment-mode
--   PurchaseModal), create-checkout reverted that reservation — but a reverted row still
--   counts as the user's once-per-user redemption (validate/reserve treat any existing
--   (code,user) row as already_used). So a single wrong-modal keystroke permanently
--   BURNED the code, even for a later, correct subscription checkout where it WOULD apply.
--   The user did nothing abusive; only the deliberate expiry/abandonment burn should
--   consume the redemption.
--
-- WHAT
--   Recreate reserve_redemption with a `p_mode` param (the Stripe session mode:
--   'subscription' | 'payment'). After the atomic uses_count claim returns applies_to,
--   a mode mismatch hands the seat straight back (guarded decrement) and returns
--   `mode_mismatch` WITHOUT ever inserting the redemptions row — so nothing is burned and
--   the code stays redeemable on the correct purchase type. `p_mode` DEFAULTS null (the
--   old, mode-blind behaviour), so any existing 2-arg caller is unaffected. The old
--   2-arg overload is dropped to avoid an ambiguous-call error against the new default.
--   Body forked from 107's net-current definition; every prior guard preserved.
--
-- @rollback: drop function public.reserve_redemption(text, uuid, text); then recreate
--   the 2-arg 107 version. NOTE that reinstates the wrong-modal burn this fixes.

drop function if exists public.reserve_redemption(text, uuid);

create or replace function public.reserve_redemption(p_code text, p_user uuid, p_mode text default null)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  caller_role  text;
  v_code       text;
  v_coupon     text;
  v_kind       text;
  v_credit     integer;
  v_applies    text;
  v_redemption uuid;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'reserve_redemption is service-role only (got: %)', caller_role;
  end if;

  if p_user is null then
    return jsonb_build_object('ok', false, 'reason', 'user_required');
  end if;

  -- GUARDED ATOMIC INCREMENT: one statement takes the code's row lock, and the
  -- WHERE is re-evaluated after the lock clears — so of two concurrent reserves on
  -- the last seat (uses_count = max_uses - 1), exactly one gets a row and the loser
  -- falls through to 'invalid_code'.
  update public.redeem_codes
     set uses_count = uses_count + 1
   where code = btrim(coalesce(p_code, ''))
     and active
     and (expires_at is null or expires_at > now())
     and uses_count < max_uses
   returning code, stripe_coupon_id, kind, credit_amount, applies_to
    into v_code, v_coupon, v_kind, v_credit, v_applies;

  if v_code is null then
    return jsonb_build_object('ok', false, 'reason', 'invalid_code');
  end if;

  -- MODE GATE (112): reject a code that cannot ride this checkout mode BEFORE the
  -- once-per-user row is created, so a wrong-modal attempt never burns the redemption.
  -- Mirrors create-checkout's redeemAppliesToMode exactly: 'subscription' rides only
  -- subscription mode, 'one_time' only payment mode, 'any'/null rides both. A null
  -- p_mode skips the gate (mode-blind back-compat). Hand the just-claimed seat back.
  if p_mode is not null and (
       (v_applies = 'subscription' and p_mode <> 'subscription')
    or (v_applies = 'one_time'     and p_mode <> 'payment')
  ) then
    update public.redeem_codes
       set uses_count = greatest(uses_count - 1, 0)
     where code = v_code;
    return jsonb_build_object('ok', false, 'reason', 'mode_mismatch', 'applies_to', v_applies);
  end if;

  insert into public.redemptions (code, user_id, status)
    values (v_code, p_user, 'reserved')
    on conflict (code, user_id) do nothing
    returning id into v_redemption;

  if v_redemption is null then
    -- Once-per-user gate hit: hand the seat straight back (same transaction).
    update public.redeem_codes
       set uses_count = greatest(uses_count - 1, 0)
     where code = v_code;
    return jsonb_build_object('ok', false, 'reason', 'already_used');
  end if;

  return jsonb_build_object(
    'ok', true,
    'stripe_coupon_id', v_coupon,
    'kind', v_kind,
    'credit_amount', v_credit,
    'applies_to', v_applies,
    'redemption_id', v_redemption
  );
end;
$$;

revoke all on function public.reserve_redemption(text, uuid, text) from public;
grant execute on function public.reserve_redemption(text, uuid, text) to service_role;

comment on function public.reserve_redemption(text, uuid, text) is
  'create-checkout seat claim: guarded atomic uses_count increment, a MODE GATE (p_mode) that refuses an applies_to/mode mismatch BEFORE creating the once-per-user row (so a wrong-modal code is never burned), then the reserved redemptions row. p_mode null = mode-blind back-compat. A once-per-user conflict rolls the increment back in the same transaction.';
