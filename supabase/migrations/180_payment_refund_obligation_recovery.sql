-- ────────────────────────────────────────────────────────────────────────────
-- 180_payment_refund_obligation_recovery.sql — leased recovery for durable
-- payment refund obligations.
--
-- Migration 177 records an obligation BEFORE asking Stripe for the refund. That
-- closes the accounting gap, but a crash after the insert (or after Stripe
-- accepts the request and before its response is recorded) still needs an
-- unattended reconciler. This migration supplies that durable recovery path:
--
--   pending/requires_action obligation
--     -> service-only SKIP LOCKED lease
--     -> Stripe create with the ORIGINAL deterministic idempotency key, or
--        retrieve the already-linked Refund
--     -> status through record_payment_refund_obligation (177 ordering remains
--        the only lifecycle mutation surface)
--     -> lease release + bounded retry for nonterminal/transient outcomes.
--
-- Recovery bookkeeping is deliberately separate from the Stripe lifecycle
-- `status`. A stale worker cannot release a newer lease, expired leases are
-- reclaimable, and terminal rows are never claimed. If a newer Stripe event
-- legitimately changes a terminal row back to a nonterminal state, NULL
-- next_attempt_at is treated as immediately due so recovery cannot go dormant.
--
-- LIVE RECONCILIATION ORDERING
--   A linked row can already carry an event-derived pending status. A live
--   refunds.retrieve() must be able to advance that stale snapshot to succeeded,
--   but stamping the worker's wall-clock as a fake Stripe event would mask a
--   genuinely newer event. The claim therefore returns the exact
--   stripe_event_created_at snapshot it leased. After a live retrieve the worker
--   feeds that SAME timestamp through record_payment_refund_obligation:
--     * equal-timestamp safety rank advances pending/requires_action -> terminal;
--     * a real event newer than the claimed snapshot rejects the stale worker;
--     * equal-time failed/canceled still outranks succeeded.
--   A create response is not given this authority because Stripe idempotent
--   replay may return the original response rather than a fresh lifecycle read.
--
-- The generated stripe_idempotency_key exactly reconstructs every existing
-- producer's key. The claim also returns the canonical immutable obligation
-- identity (purpose, PaymentIntent, amount, reason) used to rebuild request
-- metadata. Nullable user/attempt/Checkout links are deliberately excluded from
-- Stripe parameters because later delivery or account deletion may fill/null
-- them. Replaying refunds.create after a lost response therefore sends the same
-- key and parameters. Unknown future purposes receive one stable
-- PaymentIntent-scoped fallback; new producers must use the claim contract.
--
-- The pg_cron dispatcher is inert until its private system_config row has both
-- URL and secret configured. The Edge worker independently checks the matching
-- PAYMENT_REFUND_CRON_SECRET and the database kill switch.
--
-- Depends on: 002 system_config, 177 payment_refund_obligations.
--
-- @rollback:
--   do $$ begin perform cron.unschedule(jobid) from cron.job
--          where jobname = 'payment-refund-recovery-five-minute';
--        exception when others then null; end $$;
--   drop function if exists public.run_payment_refund_recovery();
--   drop function if exists public._payment_refund_recovery_cron_should_dispatch(jsonb);
--   drop function if exists public.release_payment_refund_obligation_lease(text, uuid, text, integer);
--   drop function if exists public.claim_payment_refund_obligations(integer, integer);
--   delete from public.system_config
--     where key in ('payment_refund_recovery_cron', 'payment_refund_recovery_last_run');
--   drop index if exists public.idx_payment_refund_obligations_recovery_claim;
--   drop index if exists public.idx_payment_refund_obligations_idempotency_key;
--   alter table public.payment_refund_obligations
--     drop column if exists recovery_last_reconciled_at,
--     drop column if exists recovery_last_error,
--     drop column if exists recovery_last_attempt_at,
--     drop column if exists recovery_lease_expires_at,
--     drop column if exists recovery_lease_token,
--     drop column if exists recovery_next_attempt_at,
--     drop column if exists recovery_attempts,
--     drop column if exists stripe_idempotency_key;
-- ────────────────────────────────────────────────────────────────────────────

-- ── 1. Recovery identity, lease, and retry bookkeeping ──────────────────────
alter table public.payment_refund_obligations
  add column if not exists stripe_idempotency_key text
    generated always as (
      case purpose
        when 'auto_reload_unfulfilled'
          then 'auto-reload-unfulfilled-refund-' || payment_intent_id
        when 'deleted_account_checkout'
          then 'deleted-account-checkout-refund-' || payment_intent_id
        when 'deleted_account_invoice'
          then 'deleted-account-invoice-refund-' || payment_intent_id
        else 'unfulfilled-payment-refund-' || payment_intent_id
      end
    ) stored,
  add column if not exists recovery_attempts integer not null default 0,
  add column if not exists recovery_next_attempt_at timestamptz default now(),
  add column if not exists recovery_lease_token uuid,
  add column if not exists recovery_lease_expires_at timestamptz,
  add column if not exists recovery_last_attempt_at timestamptz,
  add column if not exists recovery_last_error text,
  add column if not exists recovery_last_reconciled_at timestamptz;

do $$
begin
  if not exists (
    select 1
      from pg_constraint
     where conrelid = 'public.payment_refund_obligations'::regclass
       and conname = 'payment_refund_obligations_recovery_attempts_nonnegative'
  ) then
    alter table public.payment_refund_obligations
      add constraint payment_refund_obligations_recovery_attempts_nonnegative
      check (recovery_attempts >= 0);
  end if;

  if not exists (
    select 1
      from pg_constraint
     where conrelid = 'public.payment_refund_obligations'::regclass
       and conname = 'payment_refund_obligations_recovery_lease_coherent'
  ) then
    alter table public.payment_refund_obligations
      add constraint payment_refund_obligations_recovery_lease_coherent
      check (
        (recovery_lease_token is null and recovery_lease_expires_at is null)
        or
        (recovery_lease_token is not null and recovery_lease_expires_at is not null)
      );
  end if;
end;
$$;

create unique index if not exists idx_payment_refund_obligations_idempotency_key
  on public.payment_refund_obligations (stripe_idempotency_key);

create index if not exists idx_payment_refund_obligations_recovery_claim
  on public.payment_refund_obligations (
    recovery_next_attempt_at,
    recovery_lease_expires_at,
    created_at
  )
  where status in ('pending', 'requires_action');

comment on column public.payment_refund_obligations.stripe_idempotency_key is
  'Stored deterministic Stripe idempotency key used by the original refund producer and the recovery worker. Replaying after a lost Stripe response returns the same operation.';
comment on column public.payment_refund_obligations.recovery_lease_token is
  'Opaque token for the active recovery lease. Release is token-guarded so a stale worker cannot clear a newer claim.';
comment on column public.payment_refund_obligations.recovery_next_attempt_at is
  'Next eligible recovery time. NULL is dormant for terminal rows but is treated as immediately due if a newer Stripe event returns the lifecycle to a nonterminal status.';
comment on column public.payment_refund_obligations.stripe_event_created_at is
  'Ordering watermark of the newest accepted Stripe lifecycle event. A live leased reconciliation may advance status at the exact claimed watermark (never a fabricated later timestamp); resolved_at/recovery_last_reconciled_at retain when that live observation was accepted.';

-- ── 2. Service-only lease claim and release RPCs ────────────────────────────
create or replace function public.claim_payment_refund_obligations(
  p_limit integer default 10,
  p_lease_seconds integer default 120
)
returns table (
  payment_intent_id text,
  stripe_refund_id text,
  checkout_session_id text,
  user_id uuid,
  attempt_id uuid,
  purpose text,
  amount_cents integer,
  currency text,
  reason text,
  status text,
  stripe_event_created_at timestamptz,
  stripe_idempotency_key text,
  lease_token uuid,
  recovery_attempts integer
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_caller_role text;
  v_limit integer := greatest(1, least(coalesce(p_limit, 10), 100));
  v_lease_seconds integer :=
    greatest(30, least(coalesce(p_lease_seconds, 120), 900));
begin
  v_caller_role := coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    auth.role()
  );
  if v_caller_role <> 'service_role' then
    raise exception 'claim_payment_refund_obligations is service-role only (got: %)',
      coalesce(v_caller_role, 'none');
  end if;

  return query
  with candidates as (
    select obligation.payment_intent_id
      from public.payment_refund_obligations obligation
     where obligation.status in ('pending', 'requires_action')
       and (
         obligation.recovery_next_attempt_at is null
         or obligation.recovery_next_attempt_at <= now()
       )
       and (
         obligation.recovery_lease_token is null
         or obligation.recovery_lease_expires_at <= now()
       )
     order by
       obligation.recovery_next_attempt_at nulls first,
       obligation.created_at,
       obligation.payment_intent_id
     limit v_limit
     for update of obligation skip locked
  ),
  claimed as (
    update public.payment_refund_obligations obligation
       set recovery_attempts = obligation.recovery_attempts + 1,
           recovery_lease_token = gen_random_uuid(),
           recovery_lease_expires_at =
             now() + make_interval(secs => v_lease_seconds),
           recovery_last_attempt_at = now(),
           updated_at = now()
      from candidates candidate
     where obligation.payment_intent_id = candidate.payment_intent_id
     returning
       obligation.payment_intent_id,
       obligation.stripe_refund_id,
       obligation.checkout_session_id,
       obligation.user_id,
       obligation.attempt_id,
       obligation.purpose,
       obligation.amount_cents,
       obligation.currency,
       obligation.reason,
       obligation.status,
       obligation.stripe_event_created_at,
       obligation.stripe_idempotency_key,
       obligation.recovery_lease_token,
       obligation.recovery_attempts,
       obligation.created_at
  )
  select
    claimed.payment_intent_id,
    claimed.stripe_refund_id,
    claimed.checkout_session_id,
    claimed.user_id,
    claimed.attempt_id,
    claimed.purpose,
    claimed.amount_cents,
    claimed.currency,
    claimed.reason,
    claimed.status,
    claimed.stripe_event_created_at,
    claimed.stripe_idempotency_key,
    claimed.recovery_lease_token,
    claimed.recovery_attempts
    from claimed
   order by claimed.created_at, claimed.payment_intent_id;
end;
$$;

create or replace function public.release_payment_refund_obligation_lease(
  p_payment_intent_id text,
  p_lease_token uuid,
  p_error text default null,
  p_retry_seconds integer default 300
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_caller_role text;
  v_updated text;
  v_retry_seconds integer :=
    greatest(30, least(coalesce(p_retry_seconds, 300), 86400));
  v_error text := nullif(left(btrim(coalesce(p_error, '')), 1000), '');
begin
  v_caller_role := coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    auth.role()
  );
  if v_caller_role <> 'service_role' then
    raise exception 'release_payment_refund_obligation_lease is service-role only (got: %)',
      coalesce(v_caller_role, 'none');
  end if;

  update public.payment_refund_obligations obligation
     set recovery_lease_token = null,
         recovery_lease_expires_at = null,
         recovery_next_attempt_at = case
           when obligation.status in ('pending', 'requires_action')
             then now() + make_interval(secs => v_retry_seconds)
           else null
         end,
         recovery_last_error = case
           when obligation.status in ('succeeded', 'failed', 'canceled')
             then null
           else v_error
         end,
         recovery_last_reconciled_at = case
           when v_error is null then now()
           else obligation.recovery_last_reconciled_at
         end,
         updated_at = now()
   where obligation.payment_intent_id = btrim(coalesce(p_payment_intent_id, ''))
     and obligation.recovery_lease_token = p_lease_token
  returning obligation.payment_intent_id into v_updated;

  return v_updated is not null;
end;
$$;

revoke all on function public.claim_payment_refund_obligations(integer, integer)
  from public, anon, authenticated, service_role;
grant execute on function public.claim_payment_refund_obligations(integer, integer)
  to service_role;

revoke all on function public.release_payment_refund_obligation_lease(
  text, uuid, text, integer
) from public, anon, authenticated, service_role;
grant execute on function public.release_payment_refund_obligation_lease(
  text, uuid, text, integer
) to service_role;

comment on function public.claim_payment_refund_obligations(integer, integer) is
  'Service-role-only SKIP LOCKED claim of due pending/requires_action refund obligations. Creates a bounded expiring lease and returns the original Stripe idempotency key plus canonical immutable request identity; nullable contextual links never enter replay parameters.';
comment on function public.release_payment_refund_obligation_lease(
  text, uuid, text, integer
) is
  'Service-role-only token-guarded lease release. It changes only recovery metadata: nonterminal rows receive bounded retry time, terminal rows become dormant, and lifecycle status remains owned by record_payment_refund_obligation.';

-- ── 3. Secret-gated pg_net dispatcher, inert until configured ───────────────
insert into public.system_config (key, value)
values ('payment_refund_recovery_cron', jsonb_build_object(
  'enabled', true,
  'url', null,
  'secret', null,
  'claimBatchSize', 10,
  'maxJobsPerRun', 25,
  'leaseSeconds', 120,
  'retryBaseSeconds', 60,
  'note', 'Five-minute durable payment-refund recovery. INERT until url + secret are set by service-role SQL. url is the deployed payment-refund-worker URL; secret must equal PAYMENT_REFUND_CRON_SECRET. Set enabled=false to pause. The worker re-checks this private row before claiming work.'
))
on conflict (key) do nothing;

create or replace function public._payment_refund_recovery_cron_should_dispatch(
  cfg jsonb
)
returns text
language plpgsql
immutable
set search_path = public, pg_temp
as $$
begin
  if cfg is null or jsonb_typeof(cfg) <> 'object' then
    return 'not_configured';
  end if;
  if coalesce((cfg ->> 'enabled')::boolean, false) is not true then
    return 'disabled';
  end if;
  if nullif(btrim(cfg ->> 'url'), '') is null
     or nullif(btrim(cfg ->> 'secret'), '') is null then
    return 'not_configured';
  end if;
  return 'ok';
exception when others then
  return 'not_configured';
end;
$$;

create or replace function public.run_payment_refund_recovery()
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  cfg jsonb;
  verdict text;
  req_id bigint;
begin
  select value into cfg
    from public.system_config
   where key = 'payment_refund_recovery_cron';
  verdict := public._payment_refund_recovery_cron_should_dispatch(cfg);
  if verdict <> 'ok' then
    return verdict;
  end if;

  begin
    select net.http_post(
      url := cfg ->> 'url',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-cron-secret', cfg ->> 'secret'
      ),
      body := '{}'::jsonb
    ) into req_id;
  exception
    when undefined_function or undefined_table or invalid_schema_name then
      raise notice 'pg_net unavailable; payment-refund-worker not dispatched';
      return 'pg_net_unavailable';
  end;
  return 'dispatched:' || coalesce(req_id::text, 'unknown');
end;
$$;

revoke all on function public._payment_refund_recovery_cron_should_dispatch(jsonb)
  from public, anon, authenticated, service_role;
grant execute on function public._payment_refund_recovery_cron_should_dispatch(jsonb)
  to service_role;
revoke all on function public.run_payment_refund_recovery()
  from public, anon, authenticated, service_role;
grant execute on function public.run_payment_refund_recovery() to service_role;

comment on function public.run_payment_refund_recovery() is
  'Five-minute pg_net dispatcher for payment-refund-worker. Service-role only, fail-closed, and inert until payment_refund_recovery_cron has enabled=true plus non-empty url/secret.';

do $$
begin
  execute 'create extension if not exists pg_net with schema extensions';
exception when others then
  raise notice 'pg_net unavailable; payment refund recovery dispatch remains inert';
end;
$$;

do $$
begin
  execute 'create extension if not exists pg_cron with schema extensions';
exception when others then
  raise notice 'pg_cron unavailable; schedule run_payment_refund_recovery manually';
end;
$$;

do $$
begin
  perform cron.unschedule(jobid) from cron.job
    where jobname = 'payment-refund-recovery-five-minute';
  perform cron.schedule(
    'payment-refund-recovery-five-minute',
    '*/5 * * * *',
    $job$select public.run_payment_refund_recovery();$job$
  );
exception when undefined_function or undefined_table or invalid_schema_name or insufficient_privilege then
  raise notice 'pg_cron unavailable; payment refund recovery must be scheduled manually';
end;
$$;
