-- ────────────────────────────────────────────────────────────────────────────
-- 175_account_deletion_cleanup_queue.sql — durable account-erasure completion.
--
-- Migration 054 safely anonymised and locked due accounts, but it marked a
-- deletion_request `done` inside Postgres before the two external obligations
-- had succeeded: revoking the GoTrue account and stopping every Stripe
-- subscription. Its pg_cron job also called that SQL-only processor directly, so
-- unattended runs could never perform either external operation.
--
-- This migration makes external completion part of the durable lifecycle:
--
--   requested -> processing + account_deletion_cleanup_jobs row
--             -> done ONLY after GoTrue revocation, complete paginated Stripe
--                cancellation, and transactional Stripe-linkage clearing.
--
-- The queue row is created in the SAME transaction as profile anonymisation.
-- Claims use leases + SKIP LOCKED, auth progress is checkpointed independently,
-- failures retain all billing linkage and become retryable, and stale processing
-- leases are reclaimable. The Edge worker and the manual admin action share one
-- TypeScript cleanup implementation; this migration supplies its service-role-
-- only claim/checkpoint/fail/complete RPCs.
--
-- Existing soft-deleted / formerly-done rows are backfilled conservatively.
-- They return to `processing` until an idempotent cleanup pass proves the external
-- obligations complete. Existing process_deletion audit rows are detected so the
-- finalizer never writes a duplicate; new requests receive exactly one final
-- destructive/irreversible/notified audit row only after full completion.
--
-- The old SQL-only `account-deletions-daily` cron is unscheduled. A replacement
-- hourly dispatcher reads the private `account_deletion_cron` system_config row
-- and pg_net POSTs to account-deletion-worker with x-cron-secret. The seed is
-- deliberately INERT (url/secret null), and the Edge function independently
-- checks both its env secret and the database kill switch.
--
-- Re-runnable: create-if-not-exists / create-or-replace / on-conflict seeds /
-- unschedule-before-schedule. Written, not deployed: do not bump applied-head.
--
-- Depends on: 002 system_config, 051 write_audit, 052 deletion_requests,
--             054 profiles.deleted_at + process_account_deletions,
--             139/159 Surveyor entitlement + Stripe linkage.
--
-- @rollback:
--   do $$ begin perform cron.unschedule(jobid) from cron.job
--          where jobname = 'account-deletion-cleanup-hourly';
--        exception when others then null; end $$;
--   drop function if exists public.run_account_deletion_cleanup();
--   drop function if exists public._account_deletion_cron_should_dispatch(jsonb);
--   drop function if exists public.complete_account_deletion_cleanup_job(uuid, uuid, text, text, text, text);
--   drop function if exists public.fail_account_deletion_cleanup_job(uuid, uuid, text, int);
--   drop function if exists public.mark_account_deletion_auth_revoked(uuid, uuid);
--   drop function if exists public.claim_account_deletion_cleanup_jobs(int, int);
--   drop table if exists public.account_deletion_cleanup_jobs;
--   delete from public.system_config where key in ('account_deletion_cron', 'account_deletion_last_run');
--   -- Restore migration 054's process_account_deletions body + direct cron only
--   -- if deliberately reverting to the weaker SQL-only completion semantics.
-- ────────────────────────────────────────────────────────────────────────────

-- ── 1. Durable, service-role-only queue ─────────────────────────────────────
create table if not exists public.account_deletion_cleanup_jobs (
  id                    uuid primary key default gen_random_uuid(),
  deletion_request_id   uuid not null unique
                          references public.deletion_requests(id) on delete cascade,
  user_id               uuid not null,
  status                text not null default 'pending'
                          check (status in ('pending', 'processing', 'retry', 'done')),
  attempts              int not null default 0 check (attempts >= 0),
  next_attempt_at       timestamptz not null default now(),
  locked_at             timestamptz,
  lease_token           uuid,
  auth_revoked_at       timestamptz,
  stripe_cleaned_at     timestamptz,
  completed_at          timestamptz,
  last_failed_at        timestamptz,
  last_error            text,
  audit_before          jsonb,
  audit_actor_id        uuid,
  audit_required        boolean not null default true,
  audit_written_at      timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists idx_account_deletion_cleanup_jobs_claim
  on public.account_deletion_cleanup_jobs (status, next_attempt_at, created_at)
  where status in ('pending', 'processing', 'retry');

alter table public.account_deletion_cleanup_jobs enable row level security;
revoke all on table public.account_deletion_cleanup_jobs from public;
revoke all on table public.account_deletion_cleanup_jobs from anon;
revoke all on table public.account_deletion_cleanup_jobs from authenticated;
grant select, insert, update on table public.account_deletion_cleanup_jobs to service_role;

comment on table public.account_deletion_cleanup_jobs is
  'Durable service-role-only completion queue for account deletion. A request stays processing until a leased Edge worker checkpoints GoTrue revocation, proves all Stripe subscriptions canceled, and atomically clears linkage + marks both job and request done.';

-- ── 2. Replace 054 processor: local erasure + transactional queue enqueue ────
create or replace function public.process_account_deletions(
  p_actor       uuid default null,
  p_grace_days  int  default 7,
  p_limit       int  default 100
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  r            record;
  v_grace      int;
  v_limit      int;
  v_cutoff     timestamptz;
  v_email      text;
  v_dname      text;
  v_before     jsonb;
  v_queued     int := 0;
  v_ids        uuid[] := array[]::uuid[];
begin
  if p_actor is not null
     and not public.has_role(p_actor, array['admin', 'developer']) then
    raise exception 'not authorized: processing deletions requires admin or developer';
  end if;

  v_grace  := greatest(0, least(coalesce(p_grace_days, 7), 365));
  v_limit  := greatest(1, least(coalesce(p_limit, 100), 1000));
  v_cutoff := now() - make_interval(days => v_grace);

  -- A queue row and the anonymisation are one transaction. SKIP LOCKED permits
  -- cron/manual overlap without duplicate work; the request-id UNIQUE constraint
  -- is the final idempotency boundary.
  for r in
    select dr.id, dr.user_id
      from public.deletion_requests dr
      where dr.status = 'requested'
        and dr.user_id is not null
        and dr.requested_at <= v_cutoff
      order by dr.requested_at asc, dr.id asc
      limit v_limit
      for update skip locked
  loop
    v_email := null;
    v_dname := null;
    if r.user_id is not null then
      select email, display_name into v_email, v_dname
        from public.profiles where id = r.user_id for update;
    end if;
    v_before := jsonb_build_object(
      'email_masked', public.mask_email(v_email),
      'had_display_name', (v_dname is not null)
    );

    if r.user_id is not null then
      update public.profiles
         set display_name = null,
             email        = null,
             deleted_at   = coalesce(deleted_at, now()),
             disabled_at  = coalesce(disabled_at, now()),
             updated_at   = now()
       where id = r.user_id;
    end if;

    update public.deletion_requests
       set status       = 'processing',
           processed_by = p_actor,
           processed_at = now(),
           email        = null
     where id = r.id;

    insert into public.account_deletion_cleanup_jobs (
      deletion_request_id, user_id, audit_before, audit_actor_id
    ) values (
      r.id, r.user_id, v_before, p_actor
    )
    on conflict (deletion_request_id) do nothing;
    v_queued := v_queued + 1;
    v_ids := array_append(v_ids, r.id);
  end loop;

  return jsonb_build_object(
    'processed', v_queued,
    'queued', v_queued,
    'ids', v_ids,
    'cutoff', v_cutoff,
    'grace_days', v_grace
  );
end;
$$;

revoke all on function public.process_account_deletions(uuid, int, int) from public;
revoke all on function public.process_account_deletions(uuid, int, int) from anon;
revoke all on function public.process_account_deletions(uuid, int, int) from authenticated;
grant execute on function public.process_account_deletions(uuid, int, int) to service_role;

comment on function public.process_account_deletions(uuid, int, int) is
  'Service-role-only local account-erasure stage. For due requests, atomically anonymises/locks the profile, leaves the request processing, and enqueues one durable external cleanup job. It never marks a request done; complete_account_deletion_cleanup_job does so only after GoTrue + Stripe success.';

-- ── 3. Queue claim/checkpoint/failure/completion RPCs ───────────────────────
create or replace function public.claim_account_deletion_cleanup_jobs(
  p_limit int default 50,
  p_stale_after_minutes int default 30
)
returns table (
  job_id uuid,
  deletion_request_id uuid,
  user_id uuid,
  lease_token uuid,
  attempts int,
  auth_revoked_at timestamptz,
  stripe_subscription_id text,
  stripe_customer_id text,
  surveyor_subscription_id text,
  surveyor_customer_id text
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_limit int := greatest(1, least(coalesce(p_limit, 50), 200));
  v_stale interval := make_interval(
    mins => greatest(5, least(coalesce(p_stale_after_minutes, 30), 1440))
  );
begin
  return query
  with candidates as (
    select j.id
      from public.account_deletion_cleanup_jobs j
      where (
        j.status in ('pending', 'retry')
        and j.next_attempt_at <= now()
      ) or (
        j.status = 'processing'
        and (j.locked_at is null or j.locked_at <= now() - v_stale)
      )
      order by
        case when j.status = 'processing' then 0
             when j.status = 'retry' then 1 else 2 end,
        j.next_attempt_at asc,
        j.created_at asc,
        j.id asc
      limit v_limit
      for update skip locked
  ),
  claimed as (
    update public.account_deletion_cleanup_jobs j
       set status       = 'processing',
           attempts     = j.attempts + 1,
           locked_at    = now(),
           lease_token  = gen_random_uuid(),
           updated_at   = now()
      from candidates c
     where j.id = c.id
     returning j.*
  )
  select c.id, c.deletion_request_id, c.user_id, c.lease_token, c.attempts,
         c.auth_revoked_at, p.stripe_subscription_id, p.stripe_customer_id,
         se.stripe_subscription_id, se.stripe_customer_id
    from claimed c
    left join public.profiles p on p.id = c.user_id
    left join public.surveyor_entitlements se on se.user_id = c.user_id
    order by c.created_at asc, c.id asc;
end;
$$;

create or replace function public.mark_account_deletion_auth_revoked(
  p_job_id uuid,
  p_lease_token uuid
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_updated uuid;
begin
  update public.account_deletion_cleanup_jobs
     set auth_revoked_at = coalesce(auth_revoked_at, now()),
         updated_at = now()
   where id = p_job_id
     and status = 'processing'
     and lease_token = p_lease_token
  returning id into v_updated;
  return v_updated is not null;
end;
$$;

create or replace function public.fail_account_deletion_cleanup_job(
  p_job_id uuid,
  p_lease_token uuid,
  p_error text,
  p_retry_seconds int default 300
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_updated uuid;
  v_retry int := greatest(30, least(coalesce(p_retry_seconds, 300), 86400));
begin
  update public.account_deletion_cleanup_jobs
     set status          = 'retry',
         next_attempt_at = now() + make_interval(secs => v_retry),
         locked_at       = null,
         lease_token     = null,
         last_failed_at  = now(),
         last_error      = left(coalesce(nullif(btrim(p_error), ''), 'external cleanup failed'), 1000),
         updated_at      = now()
   where id = p_job_id
     and status = 'processing'
     and lease_token = p_lease_token
  returning id into v_updated;
  return v_updated is not null;
end;
$$;

create or replace function public.complete_account_deletion_cleanup_job(
  p_job_id uuid,
  p_lease_token uuid,
  p_expected_subscription_id text default null,
  p_expected_customer_id text default null,
  p_expected_surveyor_subscription_id text default null,
  p_expected_surveyor_customer_id text default null
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  j record;
  v_subscription_id text;
  v_customer_id text;
  v_surveyor_subscription_id text;
  v_surveyor_customer_id text;
begin
  select * into j
    from public.account_deletion_cleanup_jobs
   where id = p_job_id
     and status = 'processing'
     and lease_token = p_lease_token
   for update;

  if not found or j.auth_revoked_at is null then
    return false;
  end if;

  select stripe_subscription_id, stripe_customer_id
    into v_subscription_id, v_customer_id
    from public.profiles
   where id = j.user_id
   for update;
  if not found then
    return false;
  end if;

  -- A webhook/operator change after claim means the worker did not inspect the
  -- current linkage. Refuse to clear it; the lease will be failed/retried and the
  -- next claim will receive the new ids.
  if v_subscription_id is distinct from p_expected_subscription_id
     or v_customer_id is distinct from p_expected_customer_id then
    return false;
  end if;

  select stripe_subscription_id, stripe_customer_id
    into v_surveyor_subscription_id, v_surveyor_customer_id
    from public.surveyor_entitlements
   where user_id = j.user_id
   for update;
  if not found then
    v_surveyor_subscription_id := null;
    v_surveyor_customer_id := null;
  end if;
  if v_surveyor_subscription_id is distinct from p_expected_surveyor_subscription_id
     or v_surveyor_customer_id is distinct from p_expected_surveyor_customer_id then
    return false;
  end if;

  update public.profiles
     set stripe_subscription_id = null,
         stripe_customer_id = null,
         updated_at = now()
   where id = j.user_id;

  -- Customer enumeration in the shared worker cancels ALL subscriptions,
  -- including the Surveyor subscription whose id is not stored on profiles.
  -- Remove that second linkage and revoke the interface entitlement in the same
  -- completion transaction. Also erase the encrypted BYOK credential: an
  -- anonymised/locked shell must not retain a third-party API secret.
  update public.surveyor_entitlements
     set status = 'revoked',
         revoked_at = coalesce(revoked_at, now()),
         stripe_subscription_id = null,
         stripe_customer_id = null
   where user_id = j.user_id;
  delete from public.surveyor_byok_keys where user_id = j.user_id;

  update public.account_deletion_cleanup_jobs
     set status            = 'done',
         stripe_cleaned_at = now(),
         completed_at      = now(),
         next_attempt_at   = now(),
         locked_at         = null,
         lease_token       = null,
         last_error        = null,
         updated_at        = now()
   where id = j.id;

  update public.deletion_requests
     set status = 'done',
         processed_at = now(),
         email = null
   where id = j.deletion_request_id;

  if j.audit_required and j.audit_written_at is null then
    perform public.write_audit(
      p_action          => 'process_deletion',
      p_target_user_id  => j.user_id,
      p_target_type     => 'deletion_request',
      p_target_id       => j.deletion_request_id::text,
      p_reason          => 'soft-delete and external cleanup completed after grace window',
      p_before          => coalesce(j.audit_before, jsonb_build_object('backfilled', true)),
      p_after           => jsonb_build_object(
        'anonymized', true,
        'status', 'done',
        'locked', true,
        'auth_revoked', true,
        'billing_canceled', true
      ),
      p_was_destructive => true,
      p_was_reversible  => false,
      p_user_notified   => true,
      p_actor_id        => j.audit_actor_id
    );
    update public.account_deletion_cleanup_jobs
       set audit_written_at = now()
     where id = j.id;
  elsif not j.audit_required and j.audit_written_at is null then
    -- Legacy 054 rows already have their one process_deletion audit entry. Keep
    -- that append-only history intact, but add a distinctly named completion
    -- event so the backfilled external obligation is itself auditable without
    -- duplicating/falsifying the original action.
    perform public.write_audit(
      p_action          => 'complete_deletion_external_cleanup',
      p_target_user_id  => j.user_id,
      p_target_type     => 'deletion_request',
      p_target_id       => j.deletion_request_id::text,
      p_reason          => 'backfilled GoTrue and Stripe cleanup completed',
      p_before          => jsonb_build_object('backfilled', true),
      p_after           => jsonb_build_object(
        'status', 'done',
        'auth_revoked', true,
        'billing_canceled', true
      ),
      p_was_destructive => true,
      p_was_reversible  => false,
      p_user_notified   => true,
      p_actor_id        => j.audit_actor_id
    );
    update public.account_deletion_cleanup_jobs
       set audit_written_at = now()
     where id = j.id;
  end if;

  return true;
end;
$$;

do $$
declare
  fn text;
begin
  foreach fn in array array[
    'claim_account_deletion_cleanup_jobs(int,int)',
    'mark_account_deletion_auth_revoked(uuid,uuid)',
    'fail_account_deletion_cleanup_job(uuid,uuid,text,int)',
    'complete_account_deletion_cleanup_job(uuid,uuid,text,text,text,text)'
  ]
  loop
    execute format('revoke all on function public.%s from public', fn);
    execute format('revoke all on function public.%s from anon', fn);
    execute format('revoke all on function public.%s from authenticated', fn);
    execute format('grant execute on function public.%s to service_role', fn);
  end loop;
end;
$$;

comment on function public.claim_account_deletion_cleanup_jobs(int, int) is
  'Service-role-only lease claim. Returns oldest retry/stale/pending jobs with current billing linkage; SKIP LOCKED + a unique lease token permits concurrent workers and stale recovery.';
comment on function public.mark_account_deletion_auth_revoked(uuid, uuid) is
  'Service-role-only durable checkpoint for successful GoTrue revocation. Lease-token guarded so a stale worker cannot mutate a reclaimed job.';
comment on function public.fail_account_deletion_cleanup_job(uuid, uuid, text, int) is
  'Service-role-only retry transition. Retains auth checkpoint + all profile billing linkage, clears the lease, and schedules a bounded retry.';
comment on function public.complete_account_deletion_cleanup_job(uuid, uuid, text, text, text, text) is
  'Service-role-only completion transaction. Requires the active lease + auth checkpoint + unchanged inspected Stripe linkage, then atomically clears linkage, marks job/request done, and writes the one final process_deletion audit row.';

-- ── 4. Backfill every existing soft-deleted/incomplete account safely ───────
-- A soft-deleted profile without any live request is legacy/corrupt state. Give
-- it a synthetic processing request so external cleanup has a durable parent.
insert into public.deletion_requests (
  user_id, email, requested_at, status, processed_at
)
select p.id, null, coalesce(p.deleted_at, now()), 'processing', coalesce(p.deleted_at, now())
  from public.profiles p
 where p.deleted_at is not null
   and not exists (
     select 1 from public.deletion_requests dr
      where dr.user_id = p.id and dr.status <> 'cancelled'
   );

-- Backfill processing and formerly-done local erasures. Re-banning an already
-- banned/missing auth user and re-canceling an already-gone Stripe subscription
-- are both intentionally idempotent. Existing audit rows suppress duplicates.
insert into public.account_deletion_cleanup_jobs (
  deletion_request_id, user_id, status, audit_before, audit_actor_id,
  audit_required, created_at, updated_at
)
select dr.id,
       dr.user_id,
       'pending',
       jsonb_build_object('backfilled', true),
       dr.processed_by,
       not exists (
         select 1 from public.audit_log a
          where a.action = 'process_deletion'
            and a.target_type = 'deletion_request'
            and a.target_id = dr.id::text
       ),
       coalesce(dr.processed_at, dr.requested_at, now()),
       now()
  from public.deletion_requests dr
  join public.profiles p on p.id = dr.user_id
 where p.deleted_at is not null
   and dr.status in ('processing', 'done')
on conflict (deletion_request_id) do nothing;

update public.deletion_requests dr
   set status = 'processing',
       email = null
  from public.account_deletion_cleanup_jobs j
 where j.deletion_request_id = dr.id
   and j.status <> 'done'
   and dr.status = 'done';

-- ── 5. Secret-gated pg_net dispatcher, inert until configured ───────────────
insert into public.system_config (key, value)
values ('account_deletion_cron', jsonb_build_object(
  'enabled', true,
  'url', null,
  'secret', null,
  'graceDays', 7,
  'enqueueLimit', 500,
  'claimBatchSize', 25,
  'maxJobsPerRun', 50,
  'staleAfterMinutes', 30,
  'note', 'Hourly durable account-deletion cleanup. INERT until url + secret are set by service-role SQL. url is the deployed account-deletion-worker URL; secret must equal ACCOUNT_DELETION_CRON_SECRET. Set enabled=false to pause. The Edge worker re-checks this row before enqueuing or claiming work. maxJobsPerRun is deliberately bounded for Edge runtime; unclaimed jobs remain durable for the next hourly page.'
))
on conflict (key) do nothing;

create or replace function public._account_deletion_cron_should_dispatch(cfg jsonb)
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

create or replace function public.run_account_deletion_cleanup()
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
   where key = 'account_deletion_cron';
  verdict := public._account_deletion_cron_should_dispatch(cfg);
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
      raise notice 'pg_net unavailable; account-deletion-worker not dispatched';
      return 'pg_net_unavailable';
  end;
  return 'dispatched:' || coalesce(req_id::text, 'unknown');
end;
$$;

revoke all on function public._account_deletion_cron_should_dispatch(jsonb) from public;
revoke all on function public._account_deletion_cron_should_dispatch(jsonb) from anon;
revoke all on function public._account_deletion_cron_should_dispatch(jsonb) from authenticated;
grant execute on function public._account_deletion_cron_should_dispatch(jsonb) to service_role;
revoke all on function public.run_account_deletion_cleanup() from public;
revoke all on function public.run_account_deletion_cleanup() from anon;
revoke all on function public.run_account_deletion_cleanup() from authenticated;
grant execute on function public.run_account_deletion_cleanup() to service_role;

comment on function public.run_account_deletion_cleanup() is
  'Hourly pg_net dispatcher for account-deletion-worker. Service-role only, fail-closed, and inert until account_deletion_cron has enabled=true plus non-empty url/secret.';

do $$
begin
  execute 'create extension if not exists pg_net with schema extensions';
exception when others then
  raise notice 'pg_net unavailable; account deletion dispatch remains inert';
end;
$$;

do $$
begin
  execute 'create extension if not exists pg_cron with schema extensions';
exception when others then
  raise notice 'pg_cron unavailable; schedule run_account_deletion_cleanup manually';
end;
$$;

-- Remove migration 054's unsafe direct SQL completion job even if pg_cron is
-- unavailable on this environment (the exception-safe block keeps local applies
-- green). Then schedule only the secret-gated dispatcher.
do $$
begin
  perform cron.unschedule(jobid) from cron.job
    where jobname in ('account-deletions-daily', 'account-deletion-cleanup-hourly');
  perform cron.schedule(
    'account-deletion-cleanup-hourly',
    '15 * * * *',
    $job$select public.run_account_deletion_cleanup();$job$
  );
exception when undefined_function or undefined_table or invalid_schema_name or insufficient_privilege then
  raise notice 'pg_cron unavailable; old deletion cron cannot be inspected and the replacement must be scheduled manually';
end;
$$;
