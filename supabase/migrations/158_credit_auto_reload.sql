-- ────────────────────────────────────────────────────────────────────────────
-- 158_credit_auto_reload.sql — AI-CREDIT AUTO-RELOAD, reload-to-target
-- (DESIGN_MONEY_WAVE §4 / #13, slice M-3). "When balance falls below X credits,
-- bring it back up to Y." OFF by default; every reload lands in money_events (157)
-- + the credit ledger.
--
-- ⚠ NUMBERING: 158 per manager coordination (this wave takes 157-161; the
--   perimeter/Wave-E siblings hold 156; renumber contiguously at fold — no number
--   is hardcoded in code). See 157_money_events.sql's header for the full note.
--
-- SECURITY POSTURE
--   Both tables RLS ON, owner SELECT own rows. SETTINGS are written only through
--   set_auto_reload_settings() (SECURITY DEFINER, authenticated, validates ranges,
--   upserts the caller's OWN row). ATTEMPTS are service-role only (the trigger runs
--   in the edge with the admin client) — no client policy → default-deny.
--   claim_auto_reload_attempt / cancel_stale_auto_reload_attempts /
--   mark_low_balance_notified are SERVICE-ROLE definer (the debit-point trigger +
--   the due-runner + the notification path). All definer functions pin
--   `search_path = public, pg_temp` (094/131 invariant).
--
-- CLAIM ATOMICITY (the concurrency design): claim_auto_reload_attempt re-reads
--   settings + balance, refuses unless below threshold, computes the delta and the
--   amount (from the edge-supplied Stripe unit price — the ONE place that can read
--   Stripe), enforces the 10-minute cooldown + the monthly cap, then INSERTs the
--   pending row. The partial UNIQUE index (one OPEN attempt per user) is the
--   concurrency claim: two truly-concurrent crossings both pass the checks, both
--   INSERT, one wins and the loser reads the unique violation and refuses. Pricing
--   inputs are threaded IN (not computed after the claim) so the whole
--   balance→delta→amount→cap→claim decision is one atomic RPC (resolves the §4.1/
--   §4.3 ordering: the edge fetches the cached Stripe price, the DB owns the money
--   decision).
--
-- Depends on: 001 (auth.users), 007/024/110 (credit_ledger, get_credit_balance),
--   116 (system_grant_credits net-current body). Re-runnable.
-- @rollback: drop function public.mark_low_balance_notified(uuid, text);
--   drop function public.cancel_stale_auto_reload_attempts();
--   drop function public.claim_auto_reload_attempt(uuid, numeric, integer);
--   drop function public.set_auto_reload_settings(boolean, integer, integer, integer);
--   drop table public.credit_auto_reload_attempts; drop table public.credit_auto_reload_settings;
--   AND recreate 116's system_grant_credits body verbatim (dropping the
--   'auto_reload' delivery-key arm) — see 116 for the exact body.
-- ────────────────────────────────────────────────────────────────────────────

-- ── settings (one row per user; OFF by default) ────────────────────────────────
create table if not exists public.credit_auto_reload_settings (
  user_id           uuid primary key references auth.users(id) on delete cascade,
  enabled           boolean not null default false,
  threshold_credits int not null default 5   check (threshold_credits between 1 and 500),
  target_credits    int not null default 25  check (target_credits between 2 and 1000),
  monthly_cap_cents int not null default 4000 check (monthly_cap_cents between 500 and 20000),
  notified_at       timestamptz,             -- last low-balance notification (dedup)
  notified_bucket   text,                    -- the 'YYYY-MM' of the last notification
  updated_at        timestamptz not null default now(),
  check (target_credits > threshold_credits)
);
alter table public.credit_auto_reload_settings enable row level security;
comment on table public.credit_auto_reload_settings is
  'Per-user auto-reload config (158, §4). OFF by default; owner-readable, written only via set_auto_reload_settings(). The sim never reads it (premium-seam law).';

drop policy if exists "Owner reads own auto-reload settings" on public.credit_auto_reload_settings;
create policy "Owner reads own auto-reload settings" on public.credit_auto_reload_settings
  for select using (auth.uid() = user_id);

-- ── attempts (one row per reload try; service-role writes) ──────────────────────
create table if not exists public.credit_auto_reload_attempts (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid not null references auth.users(id) on delete cascade,
  state                    text not null default 'pending'
                             check (state in ('pending','requires_action','succeeded','failed','canceled')),
  credits_delta            int not null check (credits_delta > 0),
  amount_cents             int not null check (amount_cents > 0),
  month_bucket             text not null,          -- 'YYYY-MM' (UTC) for cap sums
  stripe_payment_intent_id text unique,
  failure_reason           text,
  created_at               timestamptz not null default now(),
  resolved_at              timestamptz
);
alter table public.credit_auto_reload_attempts enable row level security;
comment on table public.credit_auto_reload_attempts is
  'Auto-reload attempts (158, §4). Service-role writes; owner-readable. The partial UNIQUE index (one OPEN attempt per user) is the concurrency claim.';

drop policy if exists "Owner reads own auto-reload attempts" on public.credit_auto_reload_attempts;
create policy "Owner reads own auto-reload attempts" on public.credit_auto_reload_attempts
  for select using (auth.uid() = user_id);

-- One OPEN attempt per user (the concurrency claim).
create unique index if not exists uidx_auto_reload_one_open
  on public.credit_auto_reload_attempts(user_id)
  where state in ('pending','requires_action');
-- Cap sums + cooldown reads.
create index if not exists idx_auto_reload_attempts_user_month
  on public.credit_auto_reload_attempts(user_id, month_bucket);

-- ── set_auto_reload_settings — the user configures their OWN row ────────────────
create or replace function public.set_auto_reload_settings(
  p_enabled boolean,
  p_threshold int,
  p_target int,
  p_cap int
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare v_uid uuid;
begin
  v_uid := auth.uid();
  if v_uid is null then raise exception 'not authenticated'; end if;
  -- Validate the ranges here too (the table CHECKs are the backstop) so a bad
  -- input raises a clear error rather than a constraint-name leak.
  if p_threshold is null or p_threshold < 1 or p_threshold > 500 then
    raise exception 'threshold_credits must be between 1 and 500';
  end if;
  if p_target is null or p_target < 2 or p_target > 1000 then
    raise exception 'target_credits must be between 2 and 1000';
  end if;
  if p_target <= p_threshold then
    raise exception 'target_credits must exceed threshold_credits';
  end if;
  if p_cap is null or p_cap < 500 or p_cap > 20000 then
    raise exception 'monthly_cap_cents must be between 500 and 20000';
  end if;
  insert into public.credit_auto_reload_settings
    (user_id, enabled, threshold_credits, target_credits, monthly_cap_cents, updated_at)
    values (v_uid, coalesce(p_enabled, false), p_threshold, p_target, p_cap, now())
  on conflict (user_id) do update set
    enabled = excluded.enabled,
    threshold_credits = excluded.threshold_credits,
    target_credits = excluded.target_credits,
    monthly_cap_cents = excluded.monthly_cap_cents,
    updated_at = now();
  return true;
end;
$$;
revoke all on function public.set_auto_reload_settings(boolean, int, int, int) from public;
grant execute on function public.set_auto_reload_settings(boolean, int, int, int) to authenticated;

-- ── claim_auto_reload_attempt — the atomic money decision ───────────────────────
-- Returns jsonb {ok:true, attempt_id, credits_delta, amount_cents} on a claim, or
-- {ok:false, reason} on any refusal. p_unit_amount_cents / p_credits_per_unit are
-- the Stripe starter-pack price the edge read (§4.4) so the amount is derived, never
-- hand-typed.
create or replace function public.claim_auto_reload_attempt(
  p_user uuid,
  p_unit_amount_cents numeric,
  p_credits_per_unit int
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  caller_role text;
  v_settings public.credit_auto_reload_settings%rowtype;
  v_balance int;
  v_delta int;
  v_rate numeric;
  v_amount int;
  v_bucket text;
  v_spent int;
  v_id uuid;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'claim_auto_reload_attempt is service-role only (got: %)', caller_role;
  end if;

  select * into v_settings from public.credit_auto_reload_settings where user_id = p_user;
  if not found then
    -- Never configured → no reload AND no low-balance nudge (the nudge is for users
    -- who set up auto-reload, per §4.3).
    return jsonb_build_object('ok', false, 'reason', 'no_settings');
  end if;

  v_balance := public.get_credit_balance(p_user);

  if not v_settings.enabled then
    -- Configured-but-OFF: report whether they have actually crossed below threshold,
    -- so the caller can fire the low-balance nudge (§4.3) exactly when it applies.
    return jsonb_build_object('ok', false, 'reason', 'disabled',
      'below_threshold', (v_balance < v_settings.threshold_credits));
  end if;

  if v_balance >= v_settings.threshold_credits then
    return jsonb_build_object('ok', false, 'reason', 'above_threshold');
  end if;

  v_delta := v_settings.target_credits - v_balance;
  if v_delta <= 0 then
    return jsonb_build_object('ok', false, 'reason', 'no_delta');
  end if;

  if p_credits_per_unit is null or p_credits_per_unit <= 0
     or p_unit_amount_cents is null or p_unit_amount_cents <= 0 then
    return jsonb_build_object('ok', false, 'reason', 'bad_rate');
  end if;
  v_rate := p_unit_amount_cents::numeric / p_credits_per_unit::numeric;
  v_amount := round(v_delta * v_rate)::int;
  if v_amount <= 0 then
    return jsonb_build_object('ok', false, 'reason', 'no_amount');
  end if;

  v_bucket := to_char((now() at time zone 'utc'), 'YYYY-MM');

  -- Cooldown: one crossing per 10 minutes (a resolved attempt in the window bars it).
  if exists (
    select 1 from public.credit_auto_reload_attempts
    where user_id = p_user and resolved_at is not null
      and resolved_at > now() - interval '10 minutes'
  ) then
    return jsonb_build_object('ok', false, 'reason', 'cooldown');
  end if;

  -- Monthly cap: succeeded + still-open attempts this bucket, plus this amount.
  select coalesce(sum(amount_cents), 0) into v_spent
  from public.credit_auto_reload_attempts
  where user_id = p_user and month_bucket = v_bucket
    and state in ('succeeded', 'pending', 'requires_action');
  if v_spent + v_amount > v_settings.monthly_cap_cents then
    -- Capped, but they ARE below threshold (passed that gate) → the nudge applies.
    return jsonb_build_object('ok', false, 'reason', 'cap', 'below_threshold', true);
  end if;

  -- The claim: the partial unique index bars a second open attempt.
  begin
    insert into public.credit_auto_reload_attempts
      (user_id, state, credits_delta, amount_cents, month_bucket)
      values (p_user, 'pending', v_delta, v_amount, v_bucket)
      returning id into v_id;
  exception when unique_violation then
    return jsonb_build_object('ok', false, 'reason', 'open_attempt');
  end;

  return jsonb_build_object('ok', true, 'attempt_id', v_id, 'credits_delta', v_delta, 'amount_cents', v_amount);
end;
$$;
revoke all on function public.claim_auto_reload_attempt(uuid, numeric, int) from public;
grant execute on function public.claim_auto_reload_attempt(uuid, numeric, int) to service_role;

-- ── cancel_stale_auto_reload_attempts — the expiry sweep (§4.5, due-runner hook) ─
create or replace function public.cancel_stale_auto_reload_attempts()
returns int
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  caller_role text;
  v_count int;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'cancel_stale_auto_reload_attempts is service-role only (got: %)', caller_role;
  end if;
  update public.credit_auto_reload_attempts
    set state = 'canceled', failure_reason = 'expired', resolved_at = now()
    where state in ('pending', 'requires_action')
      and created_at < now() - interval '72 hours';
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;
revoke all on function public.cancel_stale_auto_reload_attempts() from public;
grant execute on function public.cancel_stale_auto_reload_attempts() to service_role;

-- ── mark_low_balance_notified — claim-once per month_bucket (§4.3) ──────────────
-- Returns true iff it stamped (i.e. no notification has gone out this bucket yet).
create or replace function public.mark_low_balance_notified(p_user uuid, p_bucket text)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  caller_role text;
  v_updated int;
begin
  caller_role := coalesce(current_setting('request.jwt.claim.role', true), auth.role());
  if caller_role <> 'service_role' then
    raise exception 'mark_low_balance_notified is service-role only (got: %)', caller_role;
  end if;
  update public.credit_auto_reload_settings
    set notified_at = now(), notified_bucket = p_bucket
    where user_id = p_user
      and (notified_bucket is distinct from p_bucket);
  get diagnostics v_updated = row_count;
  return v_updated > 0;
end;
$$;
revoke all on function public.mark_low_balance_notified(uuid, text) from public;
grant execute on function public.mark_low_balance_notified(uuid, text) to service_role;

-- ── system_grant_credits — 116-DISCIPLINE RECREATE ─────────────────────────────
-- Recreated from 116's net-current body VERBATIM with exactly two deltas for the
-- new 'auto_reload' source:
--   (1) delivery_key CASE gains
--         when source = 'auto_reload' then metadata->>'stripe_payment_intent_id'
--       so an auto-reload grant dedups once-per-payment-intent (the webhook confirm
--       is claim-once against Stripe redelivery).
--   (2) the required-idempotency-metadata guard includes 'auto_reload' (a reload
--       grant MUST carry its PI id — the webhook always passes it).
-- Everything else — the service-role check, amount bounds, the atomic claim, the
-- founder per-user key + its stripe_session_id guard, the pg_temp pin (094/131),
-- the <<grant_fn>> label + audit — is 116 unchanged.
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
  -- 'monthly_allowance' stay per-delivery; 'auto_reload' dedups per payment intent
  -- so a redelivered payment_intent.succeeded grants exactly once (158 delta).
  delivery_key := case
    when source = 'founder_grant' then 'founder:' || target_user::text
    when source = 'purchase' then metadata->>'stripe_session_id'
    when source = 'monthly_allowance' then metadata->>'stripe_invoice_id'
    when source = 'auto_reload' then metadata->>'stripe_payment_intent_id'
    else null
  end;

  -- founder_grant's delivery key no longer comes from metadata, but the ledger row
  -- MUST still carry the real checkout session id: the founder refund clawback
  -- looks the buyer up by metadata->>'stripe_session_id' = the refunded session.
  if source = 'founder_grant'
     and coalesce(metadata->>'stripe_session_id', '') = '' then
    raise exception 'founder_grant requires metadata.stripe_session_id (refund clawback key)';
  end if;

  if source in ('purchase', 'monthly_allowance', 'auto_reload')
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
