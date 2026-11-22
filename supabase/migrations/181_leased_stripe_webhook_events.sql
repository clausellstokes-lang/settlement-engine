-- ────────────────────────────────────────────────────────────────────────────
-- 181_leased_stripe_webhook_events.sql — crash-recoverable outer Stripe event
-- idempotency.
--
-- WHY
--   The original processed_webhook_events row was inserted before the handler
--   and meant "done" immediately. A runtime death after that insert but before a
--   refund/cleanup/grant could make every Stripe redelivery return [duplicate]
--   forever. Keep completed-event deduplication, but represent in-progress work
--   as a lease that a later Stripe retry can reclaim after a bounded interval.
--
-- SCOPE
--   The existing event-id primary key remains the deduplication identity. This
--   migration adds processing/retry/done lifecycle columns and three
--   service-only RPCs: claim creates or reclaims a lease, complete converts the
--   matching lease into a permanent done row, and release preserves matching
--   unfinished work as immediately claimable retry state.
--
-- ORDERING
--   Claim first attempts an insert, then locks an existing event row. A completed
--   row is immutable dedupe; a live processing lease reports in_progress; retry
--   state and stale leases rotate their token and increment cumulative attempts.
--   Complete and release compare the current token, so a timed-out worker cannot
--   finalize or release a newer claimant's work. first_claimed_at never changes,
--   keeping service-objective age visible across handled failures and redelivery.
--
-- SECURITY
--   RLS remains enabled with no client policies. Every lifecycle RPC checks
--   service_role in its body, all ambient execution is revoked, and EXECUTE is
--   granted back only to service_role.
--
-- COMPATIBILITY
--   Existing rows predate leases and represented completed events; they are
--   backfilled as done. The table default remains done only as transitional
--   rolling compatibility with an older webhook instance that still performs
--   the legacy direct INSERT. Canonical deploy must prove the claim RPC is
--   visible through PostgREST before cutting over the new webhook; remove the
--   fallback and this compatibility default after all pre-181 instances retire.
--   New code claims explicitly through the service-only RPC.
--
-- DEPENDENCIES
--   107 processed_webhook_events; gen_random_uuid available in the project
--   database.
--
-- DEPLOYMENT
--   WRITTEN-NOT-DEPLOYED. Apply the migration, verify the claim RPC through
--   PostgREST, then deploy the leased webhook handler. Keep the compatibility
--   default until every pre-181 handler instance is retired.
--
-- @rollback:
--   Roll back the webhook handler before the database contract. Ensure no row is
--   unresolved (processing or retry), then drop
--   claim_stripe_webhook_event(text,text,integer),
--   complete_stripe_webhook_event(text,uuid), and
--   release_stripe_webhook_event(text,uuid); drop the stale-processing and
--   unresolved-age indexes and the lease/status constraints; finally drop
--   attempts, first_claimed_at,
--   completed_at, locked_at, lease_token, and status to restore migration 107's
--   table shape.
-- ────────────────────────────────────────────────────────────────────────────

-- ── 1. Lease schema and completed-row backfill ───────────────────────────────
alter table public.processed_webhook_events
  add column if not exists status text not null default 'done',
  add column if not exists lease_token uuid,
  add column if not exists locked_at timestamptz,
  add column if not exists completed_at timestamptz default now(),
  add column if not exists first_claimed_at timestamptz,
  add column if not exists attempts integer not null default 0;

alter table public.processed_webhook_events
  alter column completed_at set default now(),
  alter column first_claimed_at set default now();

update public.processed_webhook_events
set status = 'done',
    first_claimed_at = coalesce(first_claimed_at, processed_at),
    completed_at = coalesce(completed_at, processed_at),
    lease_token = null,
    locked_at = null
where status is distinct from 'done'
   or first_claimed_at is null
   or completed_at is null;

alter table public.processed_webhook_events
  alter column first_claimed_at set not null;

alter table public.processed_webhook_events
  drop constraint if exists processed_webhook_events_status_valid;
alter table public.processed_webhook_events
  add constraint processed_webhook_events_status_valid
  check (status in ('processing', 'retry', 'done'));

alter table public.processed_webhook_events
  drop constraint if exists processed_webhook_events_lease_matches_status;
alter table public.processed_webhook_events
  add constraint processed_webhook_events_lease_matches_status
  check (
    (
      status = 'processing'
      and lease_token is not null
      and locked_at is not null
      and completed_at is null
    )
    or
    (
      status = 'retry'
      and lease_token is null
      and locked_at is null
      and completed_at is null
    )
    or
    (
      status = 'done'
      and lease_token is null
      and locked_at is null
      and completed_at is not null
    )
  );

create index if not exists idx_processed_webhook_events_stale_processing
  on public.processed_webhook_events(locked_at)
  where status = 'processing';

create index if not exists idx_processed_webhook_events_unresolved_age
  on public.processed_webhook_events(first_claimed_at)
  where status in ('processing', 'retry');

-- ── 2. Atomic claim, live-lease refusal, and stale reclaim ───────────────────
create or replace function public.claim_stripe_webhook_event(
  p_event_id text,
  p_event_type text,
  p_stale_after_seconds integer default 300
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_caller_role text;
  v_event_id text := nullif(btrim(p_event_id), '');
  v_event_type text := nullif(btrim(p_event_type), '');
  v_stale interval := make_interval(
    secs => greatest(30, least(coalesce(p_stale_after_seconds, 300), 3600))
  );
  v_lease uuid := gen_random_uuid();
  v_row public.processed_webhook_events%rowtype;
begin
  v_caller_role := coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    auth.role()
  );
  if v_caller_role <> 'service_role' then
    raise exception 'claim_stripe_webhook_event is service-role only';
  end if;
  if v_event_id is null then
    raise exception 'event id is required';
  end if;

  insert into public.processed_webhook_events (
    event_id,
    event_type,
    status,
    lease_token,
    locked_at,
    completed_at,
    first_claimed_at,
    attempts
  ) values (
    v_event_id,
    v_event_type,
    'processing',
    v_lease,
    now(),
    null,
    now(),
    1
  )
  on conflict (event_id) do nothing
  returning * into v_row;

  if found then
    return jsonb_build_object(
      'claimed', true,
      'lease_token', v_row.lease_token,
      'attempts', v_row.attempts
    );
  end if;

  select *
    into v_row
    from public.processed_webhook_events
   where event_id = v_event_id
   for update;

  if v_row.status = 'done' then
    return jsonb_build_object('claimed', false, 'reason', 'done');
  end if;
  if v_row.status = 'processing'
     and v_row.locked_at > now() - v_stale then
    return jsonb_build_object(
      'claimed', false,
      'reason', 'in_progress',
      'retry_after_seconds',
      greatest(
        1,
        ceil(extract(epoch from (v_row.locked_at + v_stale - now())))::int
      )
    );
  end if;

  update public.processed_webhook_events
     set event_type = coalesce(v_event_type, event_type),
         status = 'processing',
         lease_token = v_lease,
         locked_at = now(),
         completed_at = null,
         attempts = attempts + 1
   where event_id = v_event_id
   returning * into v_row;

  return jsonb_build_object(
    'claimed', true,
    'lease_token', v_row.lease_token,
    'attempts', v_row.attempts,
    'reclaimed', true
  );
end;
$$;

-- ── 3. Token-guarded completion and immediate retry release ─────────────────
create or replace function public.complete_stripe_webhook_event(
  p_event_id text,
  p_lease_token uuid
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_caller_role text;
begin
  v_caller_role := coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    auth.role()
  );
  if v_caller_role <> 'service_role' then
    raise exception 'complete_stripe_webhook_event is service-role only';
  end if;

  update public.processed_webhook_events
     set status = 'done',
         completed_at = now(),
         processed_at = now(),
         lease_token = null,
         locked_at = null
   where event_id = p_event_id
     and status = 'processing'
     and lease_token = p_lease_token;
  return found;
end;
$$;

-- Release only the token-matched unfinished row into durable retry state. The
-- row remains immediately claimable, while its first-claim clock and cumulative
-- attempts survive for operational escalation.
create or replace function public.release_stripe_webhook_event(
  p_event_id text,
  p_lease_token uuid
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_caller_role text;
begin
  v_caller_role := coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    auth.role()
  );
  if v_caller_role <> 'service_role' then
    raise exception 'release_stripe_webhook_event is service-role only';
  end if;

  update public.processed_webhook_events
     set status = 'retry',
         lease_token = null,
         locked_at = null,
         completed_at = null
   where event_id = p_event_id
     and status = 'processing'
     and lease_token = p_lease_token;
  return found;
end;
$$;

-- ── 4. Service-only execution surface and catalog documentation ─────────────
revoke all on function public.claim_stripe_webhook_event(text, text, integer)
  from public, anon, authenticated, service_role;
revoke all on function public.complete_stripe_webhook_event(text, uuid)
  from public, anon, authenticated, service_role;
revoke all on function public.release_stripe_webhook_event(text, uuid)
  from public, anon, authenticated, service_role;
grant execute on function public.claim_stripe_webhook_event(text, text, integer)
  to service_role;
grant execute on function public.complete_stripe_webhook_event(text, uuid)
  to service_role;
grant execute on function public.release_stripe_webhook_event(text, uuid)
  to service_role;

comment on table public.processed_webhook_events is
  'Crash-recoverable Stripe event idempotency. Completed rows dedupe forever; processing rows carry leases; released retry rows preserve first-claim age and cumulative attempts until redelivery. RLS-on with no client policies.';
comment on function public.claim_stripe_webhook_event(text, text, integer) is
  'Service-only atomic Stripe event claim. Returns done for completed duplicates, in_progress for a live lease, or a fresh lease for new, released, or stale work.';
