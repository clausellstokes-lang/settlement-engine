-- ────────────────────────────────────────────────────────────────────────────
-- 190_credit_pack_clawback.sql — reverse a refunded/disputed credit-pack grant
-- (CYCLE-3 Wave 8 M2, policy ruling 2026-07-26).
--
-- WHY
--   grantCreditsForSessionOnce mints pack credits on checkout.session.completed
--   (system_grant_credits, source 'purchase', delivery key = the checkout
--   SESSION id), but the charge.refunded / charge.dispute.created arm never
--   reversed them: a refunded pack kept its credits. Neither existing RPC can
--   express the ruling — system_grant_credits rejects amount <= 0, and
--   service_adjust_credits clamps the balance at zero and takes no per-session
--   claim, so a redelivered webhook could double-deduct.
--
-- SCOPE
--   One narrow service-only RPC: system_clawback_credits(p_session_id,
--   p_reason). Finds the ONE pack grant the session minted (at most one —
--   'purchase''s delivery claim key is the session id), claims the reversal
--   once in credit_grant_idempotency (source 'purchase_clawback', key = the
--   session id — the exact mirror of the grant's own claim), and writes the
--   FULL granted amount back as an UNALLOCATED 'spend' ledger row.
--   get_credit_balance (018) counts an unallocated spend via its legacy_spends
--   branch with no clamp, so the balance MAY GO NEGATIVE by design: the debt
--   nets against future grants. Goodwill flows are credit GRANTS, never
--   partial refunds, so every reversal class claws back the full amount
--   (CRIT-1 policy). A session that never granted a pack reads no_pack_grant
--   and no-ops; a redelivery reads already_clawed_back and no-ops.
--
-- ORDERING
--   Grant lookup → idempotency claim → profiles row lock (the 103/018 lock, so
--   the reversal serializes against concurrent user spends) → ledger 'spend'
--   row → credit_transactions mirror → profiles.credits cache refresh from
--   ledger truth → admin audit. All one transaction: an error anywhere commits
--   nothing, so the webhook may throw for Stripe redelivery with no claim lost.
--   Unlike 103 the missing-profile case does NOT raise: the ledger rows are the
--   money truth and a raise would strand the reversal in an endless redelivery
--   loop; the cache refresh simply touches zero rows.
--
-- SECURITY
--   SECURITY DEFINER, search_path = public, pg_temp. Body checks service_role;
--   all ambient execution revoked; EXECUTE granted back only to service_role.
--
-- DEPENDENCIES
--   001 (profiles, credit_transactions); 007 (credit_ledger); 018
--   (get_credit_balance); 024 (credit_grant_idempotency, _audit_action in use
--   by system_grant_credits since 017/009).
--
-- DEPLOYMENT
--   WRITTEN-NOT-DEPLOYED. Apply with the 190-aware stripe-webhook deploy: the
--   webhook's clawbackCreditPackForSession throws on RPC transport failure
--   (Stripe redelivers), so applying the migration BEFORE the function deploy
--   is safe (nothing calls it yet) and the reverse order self-heals through
--   redelivery once the migration lands.
--
-- @rollback:
--   Deploy a webhook without clawbackCreditPackForSession first, then
--   drop function public.system_clawback_credits(text, text);
--   delete from public.credit_grant_idempotency where source = 'purchase_clawback'
--   only if the matching 'purchase_clawback' credit_ledger rows are also being
--   reversed by hand — the claim row and the ledger row must live and die
--   together or a re-applied 190 could double-deduct.
-- ────────────────────────────────────────────────────────────────────────────

create or replace function public.system_clawback_credits(
  p_session_id text,
  p_reason text default 'charge_reversal'
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_caller_role text;
  v_session text := nullif(btrim(p_session_id), '');
  v_grant_id uuid;
  v_user uuid;
  v_amount integer;
  v_claimed text;
  v_reversal_id uuid;
  v_prev integer;
  v_next integer;
begin
  v_caller_role := coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    auth.role()
  );
  if v_caller_role <> 'service_role' then
    raise exception 'system_clawback_credits is service-role only';
  end if;
  if v_session is null then
    raise exception 'session id is required';
  end if;

  -- The pack grant this session minted. At most one exists: system_grant_credits'
  -- delivery claim for source 'purchase' is keyed on the session id (024), so the
  -- order/limit is belt-and-suspenders against out-of-band ledger writes.
  select id, user_id, amount
    into v_grant_id, v_user, v_amount
    from public.credit_ledger
   where source = 'purchase'
     and kind = 'grant'
     and metadata->>'stripe_session_id' = v_session
   order by created_at
   limit 1;
  if v_grant_id is null then
    return jsonb_build_object('ok', false, 'reason', 'no_pack_grant');
  end if;

  -- Claim-once, the exact mirror of the grant's own delivery claim (024): the
  -- reversal claims (source 'purchase_clawback', key = session) atomically. A
  -- redelivered refund/dispute conflicts here and no-ops — the ledger is never
  -- double-deducted.
  insert into public.credit_grant_idempotency (source, idempotency_key, user_id)
    values ('purchase_clawback', v_session, v_user)
    on conflict do nothing
    returning idempotency_key into v_claimed;
  if v_claimed is null then
    return jsonb_build_object('ok', false, 'reason', 'already_clawed_back');
  end if;

  -- Serialize against concurrent balance writers (the 018/103 lock discipline).
  -- Deliberately NO raise when the profiles row is gone: the ledger rows are the
  -- money truth and the reversal must not strand in a redelivery loop; the cache
  -- refresh below simply touches zero rows.
  perform 1 from public.profiles where id = v_user for update;

  v_prev := public.get_credit_balance(v_user);

  -- The reversal: the FULL granted amount as an UNALLOCATED 'spend' row.
  -- get_credit_balance counts it via its legacy_spends branch with no clamp, so
  -- the balance MAY go negative — a debt that nets against future grants
  -- (ruling 2026-07-26; goodwill = credit grants, never partial refunds).
  insert into public.credit_ledger (user_id, kind, amount, source, metadata)
    values (
      v_user, 'spend', v_amount, 'purchase_clawback',
      jsonb_build_object(
        'stripe_session_id', v_session,
        'reversed_ledger_id', v_grant_id,
        'reason', coalesce(p_reason, 'charge_reversal')
      )
    )
    returning id into v_reversal_id;

  update public.credit_grant_idempotency
     set ledger_id = v_reversal_id
   where source = 'purchase_clawback'
     and idempotency_key = v_session;

  insert into public.credit_transactions (user_id, amount, reason)
    values (v_user, -v_amount, 'purchase_clawback');

  v_next := public.get_credit_balance(v_user);
  update public.profiles
     set credits = v_next, updated_at = now()
   where id = v_user;

  perform public._audit_action(
    null,
    v_user,
    'system_clawback_credits',
    jsonb_build_object('source', 'purchase_clawback', 'amount', v_amount, 'stripe_session_id', v_session),
    jsonb_build_object('prev_balance', v_prev, 'new_balance', v_next, 'reversed_ledger_id', v_grant_id),
    coalesce(p_reason, 'charge_reversal')
  );

  return jsonb_build_object(
    'ok', true,
    'user_id', v_user,
    'amount', v_amount,
    'prev', v_prev,
    'next', v_next
  );
end;
$$;

revoke all on function public.system_clawback_credits(text, text) from public;
grant execute on function public.system_clawback_credits(text, text) to service_role;

comment on function public.system_clawback_credits(text, text) is
  'Service-role-only credit-pack refund clawback (Wave 8 M2). Claims once per checkout session (credit_grant_idempotency source purchase_clawback, mirroring the grant''s own claim), reverses the FULL pack grant as an unallocated spend ledger row (balance may go negative — the debt nets against future grants), mirrors credit_transactions, refreshes the profiles.credits cache from ledger truth, and audits admin_actions. No-ops for sessions that never granted a pack and for redeliveries.';
