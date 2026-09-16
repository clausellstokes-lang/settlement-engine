-- ────────────────────────────────────────────────────────────────────────────
-- 163_seat_payout_release.sql — THE PAYOUT RELEASE PRIMITIVES (DESIGN_MONEY_WAVE
-- §6.6, slice M-8). Three pieces the due-runner's payout limb needs:
--   1. claim_due_transfer_payout() — the atomic 'scheduled'→'releasing' claim (the
--      double-payout guard, together with the Stripe idempotency key).
--   2. system_grant_credits — a 116-DISCIPLINE recreate adding the 'seat_payout'
--      delivery-key arm so THE CREDITS ELECTION ($49.50 as service credits) grants
--      exactly once per case/buyback (§6.6 payout election).
--   3. reelect_transfer_payout() — RE-OPENS A PARKED ELECTION: a 'connect_cash'
--      payout that parked at 'held' (Connect absent at due time) is switched to
--      'account_credits' and re-armed to 'scheduled' so the next sweep releases it
--      as credits (§6.6 "the election is re-openable while parked").
--
-- ⚠ NUMBERING: 163 is the next contiguous number on the money-wave branch (157-162
--   taken here; 156 is a sibling-lane gap). No migration NUMBER is hardcoded in code
--   — the RPC NAMES are the interface; the fold renumbers ALL lanes contiguously.
--
-- SECURITY: claim_due_transfer_payout is SERVICE-ROLE, claim-once (atomic UPDATE ...
--   WHERE payout_status='scheduled' RETURNING, guarded by FOR UPDATE SKIP LOCKED so
--   concurrent runners never both claim one row). It ALSO re-picks a STALE 'releasing'
--   row (a runner crashed after claiming, before Stripe returned) — safe because the
--   Stripe transfer carries idempotencyKey payout-<case_id>, so a re-send is the SAME
--   transfer object, never a second payout. All definer functions pin the search_path.
--
-- Depends on: 160 (founder_transfer_cases), 158 (system_grant_credits net-current
--   body — recreated here VERBATIM + the seat_payout delta). Re-runnable.
-- @rollback: drop function if exists public.claim_due_transfer_payout();
--   drop function if exists public.reelect_transfer_payout(uuid, uuid);
--   (system_grant_credits: re-apply 158's definition — drop the seat_payout arm).
-- ────────────────────────────────────────────────────────────────────────────

-- ── 1. claim_due_transfer_payout — the atomic release claim (§6.6) ──────────────
-- Claims ONE due payout to 'releasing' and returns its details; the due-runner then
-- performs the Stripe transfer / credits grant and marks it released/held/failed.
-- Returns {ok:false, reason:'none_due'} when nothing is due. Buybacks have their own
-- claim (claim_due_buyback_payout, 164) — this one is transfer cases only.
create or replace function public.claim_due_transfer_payout()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare caller_role text; v_case public.founder_transfer_cases%rowtype;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'claim_due_transfer_payout is service-role only (got: %)', caller_role;
  end if;

  update public.founder_transfer_cases
    set payout_status = 'releasing', updated_at = now()
    where id = (
      select id from public.founder_transfer_cases
      where (payout_status = 'scheduled' and payout_due_at is not null and payout_due_at <= now())
         or (payout_status = 'releasing' and updated_at < now() - interval '10 minutes')
      order by payout_due_at nulls last
      limit 1
      for update skip locked
    )
    returning * into v_case;

  if not found then
    return jsonb_build_object('ok', false, 'reason', 'none_due');
  end if;
  return jsonb_build_object('ok', true,
    'case_id', v_case.id, 'from_user', v_case.from_user,
    'payout_form', v_case.payout_form, 'payout_amount_cents', v_case.payout_amount_cents,
    'connect_account_id', v_case.connect_account_id);
end;
$$;
revoke all on function public.claim_due_transfer_payout() from public;
grant execute on function public.claim_due_transfer_payout() to service_role;
comment on function public.claim_due_transfer_payout() is
  'Atomic release claim for founder transfer payouts (163, §6.6): claims ONE scheduled-and-due (or stale-releasing) case to payout_status=releasing under FOR UPDATE SKIP LOCKED, returns its details. The claim + the Stripe idempotencyKey payout-<case_id> make double-release impossible. service_role only.';

-- ── 2. system_grant_credits — 116-DISCIPLINE RECREATE (the seat_payout arm) ─────
-- Recreated from 158's net-current body VERBATIM with exactly two deltas for the new
-- 'seat_payout' source (THE CREDITS ELECTION, §6.6):
--   (1) delivery_key CASE gains
--         when source = 'seat_payout'
--           then coalesce(metadata->>'case_id', metadata->>'buyback_id')
--       so a transfer-payout (keyed by case_id) OR a buyback-payout (keyed by
--       buyback_id) credits grant dedups once per release.
--   (2) the required-idempotency-metadata guard includes 'seat_payout'.
-- Everything else — the service-role check, amount bounds, the atomic claim, the
-- founder per-user key + its stripe_session_id guard, the auto_reload arm (158), the
-- pg_temp pin (094/131), the <<grant_fn>> label + audit — is 158 unchanged.
create or replace function public.system_grant_credits(
  target_user uuid,
  amount integer,
  source text,
  metadata jsonb default '{}'::jsonb,
  expires_at timestamptz default null
)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
<<grant_fn>>
declare
  new_balance integer;
  caller_role text;
  delivery_key text;
  claimed_key text;
  new_ledger_id uuid;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'system_grant_credits is service-role only (got: %)', caller_role;
  end if;
  if amount <= 0 or amount > 10000 then
    raise exception 'amount must be between 1 and 10000 (got: %)', amount;
  end if;
  if source is null or length(source) = 0 then
    raise exception 'source is required';
  end if;

  -- founder_grant is deduped once-per-ACCOUNT (per-user key). 'purchase'/
  -- 'monthly_allowance' stay per-delivery; 'auto_reload' dedups per payment intent;
  -- 'seat_payout' dedups per case/buyback so a due-runner replay grants exactly once
  -- (163 delta).
  delivery_key := case
    when source = 'founder_grant' then 'founder:' || target_user::text
    when source = 'purchase' then metadata->>'stripe_session_id'
    when source = 'monthly_allowance' then metadata->>'stripe_invoice_id'
    when source = 'auto_reload' then metadata->>'stripe_payment_intent_id'
    when source = 'seat_payout' then coalesce(metadata->>'case_id', metadata->>'buyback_id')
    else null
  end;

  -- founder_grant's delivery key no longer comes from metadata, but the ledger row
  -- MUST still carry the real checkout session id: the founder refund clawback
  -- looks the buyer up by metadata->>'stripe_session_id' = the refunded session.
  if source = 'founder_grant'
     and coalesce(metadata->>'stripe_session_id', '') = '' then
    raise exception 'founder_grant requires metadata.stripe_session_id (refund clawback key)';
  end if;

  if source in ('purchase', 'monthly_allowance', 'auto_reload', 'seat_payout')
     and coalesce(delivery_key, '') = '' then
    raise exception 'idempotency metadata is required for source %', source;
  end if;

  if delivery_key is not null then
    insert into public.credit_grant_idempotency (source, idempotency_key, user_id)
      values (source, delivery_key, target_user)
      on conflict do nothing
      returning idempotency_key into claimed_key;

    if claimed_key is null then
      return public.get_credit_balance(target_user);
    end if;
  end if;

  insert into public.credit_ledger (user_id, kind, amount, source, metadata, expires_at)
    values (target_user, 'grant', amount, source, coalesce(metadata, '{}'::jsonb), expires_at)
    returning id into new_ledger_id;

  if delivery_key is not null then
    update public.credit_grant_idempotency cgi
      set ledger_id = new_ledger_id
      where cgi.source = grant_fn.source
        and idempotency_key = delivery_key;
  end if;

  insert into public.credit_transactions (user_id, amount, reason)
    values (target_user, amount, source);

  new_balance := public.get_credit_balance(target_user);
  update public.profiles
    set credits = new_balance, updated_at = now()
    where id = target_user;

  perform public._audit_action(
    null,
    target_user,
    'system_grant_credits',
    jsonb_build_object('source', source, 'amount', amount),
    jsonb_build_object('new_balance', new_balance, 'expires_at', expires_at) || coalesce(metadata, '{}'::jsonb),
    null
  );

  return new_balance;
end;
$$;

revoke all on function public.system_grant_credits(uuid, integer, text, jsonb, timestamptz) from public;
grant execute on function public.system_grant_credits(uuid, integer, text, jsonb, timestamptz) to service_role;

-- ── 3. reelect_transfer_payout — RE-OPEN A PARKED ELECTION (§6.6) ────────────────
-- A 'connect_cash' payout parks at 'held' when Connect is absent at due time (LAW 1)
-- and is NEVER re-claimed by claim_due_transfer_payout (that claim only picks
-- 'scheduled'-and-due or stale-'releasing' rows). This lets the outgoing holder
-- re-open the election to 'account_credits' — the only immediate option pre-Connect —
-- by flipping the form AND re-arming payout_status to 'scheduled' so the next
-- due-runner sweep releases it as credits. Claim-once on (held AND connect_cash AND
-- the caller is the from_user): an already-released / already-credits / not-held case
-- is refused ('not_reelectable'). payout_due_at is coalesced to now() so the re-armed
-- case is immediately due. service_role only (the edge calls it with the admin client
-- and passes the JWT-verified caller as p_from — a holder can re-elect only their own
-- case). Appends a 'payout_reelected' audit event in the same transaction.
create or replace function public.reelect_transfer_payout(p_case uuid, p_from uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare caller_role text; v_case public.founder_transfer_cases%rowtype;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'reelect_transfer_payout is service-role only (got: %)', caller_role;
  end if;

  update public.founder_transfer_cases
    set payout_form = 'account_credits', payout_status = 'scheduled',
        payout_due_at = coalesce(payout_due_at, now()), updated_at = now()
    where id = p_case and from_user = p_from
      and payout_status = 'held' and payout_form = 'connect_cash'
    returning * into v_case;

  if not found then
    return jsonb_build_object('ok', false, 'reason', 'not_reelectable');
  end if;
  perform public._log_founder_transfer_event(p_case, 'outgoing', 'payout_reelected',
    jsonb_build_object('to_form', 'account_credits'));
  return jsonb_build_object('ok', true, 'case_id', v_case.id);
end;
$$;
revoke all on function public.reelect_transfer_payout(uuid, uuid) from public;
grant execute on function public.reelect_transfer_payout(uuid, uuid) to service_role;
comment on function public.reelect_transfer_payout(uuid, uuid) is
  'Re-open a parked payout election (163, §6.6): a held connect_cash payout → account_credits + re-armed to scheduled so the due-runner releases it as credits. Claim-once, caller-scoped by from_user; service_role only.';
