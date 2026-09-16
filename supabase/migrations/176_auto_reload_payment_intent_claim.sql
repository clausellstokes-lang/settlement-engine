-- ────────────────────────────────────────────────────────────────────────────
-- 176_auto_reload_payment_intent_claim.sql — atomic PaymentIntent identity
-- claim for one credit auto-reload attempt.
--
-- WHY
--   The webhook used to read an unbound attempt and then issue a conditional
--   UPDATE by id/user/state. Two distinct succeeded PaymentIntents could both
--   read stripe_payment_intent_id = null, overwrite each other's binding, and
--   each grant once because credit idempotency is intentionally per PI. The
--   trigger's post-create stamp could overwrite a webhook-first binding too.
--
-- WHAT
--   claim_auto_reload_payment_intent performs the identity bind in ONE UPDATE.
--   It succeeds only when the row's user, amount, credits, and settleable state
--   match AND stripe_payment_intent_id is null or already the same PI. Once one
--   distinct PI wins, every other PI loses without mutating the row.
--
-- SECURITY
--   Service-role only, SECURITY DEFINER, pg_temp-pinned search_path. The caller
--   supplies all expected money fields so the atomic UPDATE reasserts the same
--   attempt invariants the webhook checked before granting.
--
-- Re-runnable: create-or-replace + grants.
-- Depends on: 158_credit_auto_reload.sql.
-- @rollback: drop function if exists
--   public.claim_auto_reload_payment_intent(uuid, uuid, text, integer, integer);
-- ────────────────────────────────────────────────────────────────────────────

create or replace function public.claim_auto_reload_payment_intent(
  p_attempt uuid,
  p_user uuid,
  p_payment_intent text,
  p_amount_cents integer,
  p_credits_delta integer
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  caller_role text;
  v_state text;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'claim_auto_reload_payment_intent is service-role only (got: %)', caller_role;
  end if;

  if p_attempt is null or p_user is null
     or p_payment_intent is null or btrim(p_payment_intent) = ''
     or p_amount_cents is null or p_amount_cents <= 0
     or p_credits_delta is null or p_credits_delta <= 0 then
    return jsonb_build_object('ok', false, 'reason', 'invalid_input');
  end if;

  update public.credit_auto_reload_attempts
    set stripe_payment_intent_id = p_payment_intent
    where id = p_attempt
      and user_id = p_user
      and amount_cents = p_amount_cents
      and credits_delta = p_credits_delta
      and (
        (
          state in ('pending', 'requires_action', 'failed', 'canceled')
          and (
            stripe_payment_intent_id is null
            or stripe_payment_intent_id = p_payment_intent
          )
        )
        or (
          -- The trigger resumes after confirm=true; the webhook can finish first.
          -- Let that continuation recognize the SAME completed PI idempotently,
          -- but never bind a null/different PI on an already-succeeded attempt.
          state = 'succeeded'
          and stripe_payment_intent_id = p_payment_intent
        )
      )
    returning state into v_state;

  if not found then
    return jsonb_build_object('ok', false, 'reason', 'not_claimed');
  end if;

  return jsonb_build_object('ok', true, 'state', v_state);
end;
$$;

revoke all on function public.claim_auto_reload_payment_intent(
  uuid, uuid, text, integer, integer
) from public;
grant execute on function public.claim_auto_reload_payment_intent(
  uuid, uuid, text, integer, integer
) to service_role;

comment on function public.claim_auto_reload_payment_intent(
  uuid, uuid, text, integer, integer
) is
  'Service-role atomic identity claim for an auto-reload attempt. Binds exactly one PaymentIntent when the attempt user, amount, credits, and settleable state match; null-or-same PI makes retries idempotent while distinct PIs cannot overwrite or double-grant.';
