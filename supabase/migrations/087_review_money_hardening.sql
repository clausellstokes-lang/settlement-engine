-- 087_review_money_hardening.sql
--
-- Money / AI-cost hardening from the whole-codebase review (HEAD 1eaa03b). Four
-- independent, append-only fixes; the stripe-webhook + edge functions are updated
-- in the same change to use what this adds.
--
--   1. profiles.stripe_subscription_id — record the user's CURRENT subscription
--      so a redelivered / out-of-order customer.subscription.deleted for an OLD
--      (already-cancelled) subscription can't downgrade a user who has since
--      re-subscribed and is currently premium. Stripe redelivers + reorders
--      webhooks; the deleted-branch matched by stripe_customer_id ALONE.
--   2. refund_credits — close a concurrent double-refund window. The idempotency
--      guard is a check-then-insert with no lock; two redelivered refunds of the
--      same spend could both pass the check and double-credit. Adds FOR UPDATE on
--      the spend row (serializes refunds of one spend) + a DB-level unique index
--      (a backstop independent of the function path).
--   3. consume_ai_generate_rate_limit — make the ai_user_rate_limit operator
--      config LIVE. The defaults were 86400/60 and edge callers pass only p_user,
--      so the system_config tunable was dead. Defaults become NULL and the
--      function reads the config row when the caller doesn't override.
--   4. drop the deprecated, race-prone check_ai_spend_cap (079) — superseded by
--      the atomic reserve_ai_spend (086). Leaving it defined + granted invites
--      accidental reuse of the non-atomic path; nothing calls it now.

-- ── 1. Current-subscription column ──────────────────────────────────────────
alter table public.profiles add column if not exists stripe_subscription_id text;

-- ── 2. refund_credits: serialize idempotency (net-current body = 085) ───────
-- Forked VERBATIM from 085's net-current body; the ONLY changes are the FOR
-- UPDATE on the spend-row read and the unique index below. Auth gates, the
-- dual-write, the legacy-counter bump, the optional admin audit, search_path,
-- and the 033/085 grant posture are all preserved exactly.
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
  is_service := coalesce(current_setting('request.jwt.claim.role', true), auth.role()) = 'service_role';

  if not is_service and auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  -- FOR UPDATE: serialize concurrent refunds of the SAME spend so the
  -- check-then-insert idempotency below is atomic. A second (redelivered)
  -- refund blocks until the first COMMITs, then sees its grant and raises
  -- 'already refunded' instead of double-crediting.
  select * into spend_row
    from public.credit_ledger
    where id = spend_ledger_row
    for update;

  if not found or spend_row.kind <> 'spend' then
    raise exception 'spend row not found';
  end if;

  is_admin := public.current_user_is_privileged();

  if not is_service and spend_row.user_id <> auth.uid() and not is_admin then
    raise exception 'not authorized to refund this spend';
  end if;

  -- Idempotency: don't double-refund. Any prior grant row referencing this
  -- spend id means it's already been refunded.
  if exists (
    select 1 from public.credit_ledger
    where source = 'refund'
      and metadata->>'refund_of' = spend_ledger_row::text
  ) then
    raise exception 'already refunded';
  end if;

  insert into public.credit_ledger (user_id, kind, amount, source, metadata)
    values (
      spend_row.user_id,
      'grant',
      spend_row.amount,
      'refund',
      jsonb_build_object('refund_of', spend_ledger_row, 'reason', refund_reason)
    );

  insert into public.credit_transactions (user_id, amount, reason)
    values (spend_row.user_id, spend_row.amount, 'refund');

  update public.profiles
    set credits = credits + spend_row.amount,
        updated_at = now()
    where id = spend_row.user_id
    returning credits into new_balance;

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

revoke execute on function public.refund_credits(uuid, text) from public;
revoke execute on function public.refund_credits(uuid, text) from anon;
revoke execute on function public.refund_credits(uuid, text) from authenticated;
grant  execute on function public.refund_credits(uuid, text) to service_role;

-- DB-level backstop, independent of the function: at most one refund grant per
-- spend. A concurrent / out-of-band duplicate insert fails on this unique index
-- even if it somehow bypasses the FOR UPDATE serialization above.
create unique index if not exists ux_credit_ledger_one_refund_per_spend
  on public.credit_ledger ((metadata->>'refund_of'))
  where source = 'refund';

-- ── 3. consume_ai_generate_rate_limit: live operator config (net-current=079) ─
-- Defaults change from 86400/60 to NULL so the function can DISTINGUISH "caller
-- didn't override" from "caller passed the default" and read the
-- ai_user_rate_limit system_config row in that case (falling back to 86400/60 if
-- the row is missing/malformed). The edge callers pass only p_user, so they now
-- honour the operator tunable. Arity is unchanged; existing callers still work.
create or replace function public.consume_ai_generate_rate_limit(
  p_user           uuid,
  p_window_seconds integer default null,
  p_user_limit     integer default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_window     timestamptz;
  v_user_key   text;
  v_user_count integer;
  v_cfg        jsonb;
begin
  -- When the caller doesn't override, read the operator-tunable config row.
  if p_window_seconds is null or p_user_limit is null then
    select value into v_cfg from public.system_config where key = 'ai_user_rate_limit';
    if p_window_seconds is null then
      p_window_seconds := coalesce((v_cfg ->> 'window_seconds')::integer, 86400);
    end if;
    if p_user_limit is null then
      p_user_limit := coalesce((v_cfg ->> 'per_user_limit')::integer, 60);
    end if;
  end if;

  if p_window_seconds is null or p_window_seconds < 1 then p_window_seconds := 86400; end if;
  if p_user_limit is null or p_user_limit < 1 then p_user_limit := 60; end if;

  v_window := to_timestamp(
    floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds
  );
  v_user_key := coalesce(nullif(btrim(p_user::text), ''), '00000000-0000-0000-0000-000000000000');

  insert into public.ai_generate_rate_limits as arl (user_key, window_start, count)
  values (v_user_key, v_window, 1)
  on conflict (user_key, window_start)
    do update set count = arl.count + 1
  returning arl.count into v_user_count;

  return jsonb_build_object(
    'allowed',        (v_user_count <= p_user_limit),
    'count',          v_user_count,
    'limit',          p_user_limit,
    'window_start',   v_window,
    'window_seconds', p_window_seconds
  );
end;
$$;

revoke all on function public.consume_ai_generate_rate_limit(uuid, integer, integer) from public;
grant execute on function public.consume_ai_generate_rate_limit(uuid, integer, integer) to service_role;

-- ── 4. Drop the deprecated, race-prone read-only spend-cap check ────────────
-- Superseded by reserve_ai_spend (086, atomic admission under an advisory lock).
-- generate-narrative + generate-chronicle both migrated off it; nothing calls it
-- now. Removing it prevents accidental reuse of the non-atomic admission path.
drop function if exists public.check_ai_spend_cap();
