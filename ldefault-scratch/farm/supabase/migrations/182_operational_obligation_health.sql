-- ────────────────────────────────────────────────────────────────────────────
-- 182_operational_obligation_health.sql — one operator truth surface over the
-- three durable external-obligation lifecycles.
--
-- WHY
--   Migrations 175, 180, and 181 make account erasure, payment refunds, and
--   Stripe webhook handling crash-recoverable. Durability alone is not
--   operability: an obligation can remain retryable for days while each worker
--   is behaving exactly as designed. Before this migration, answering "is money
--   or privacy work stuck?" required three table queries plus two private
--   system_config reads, and there was no durable acknowledgement that an
--   operator had seen an exceptional row.
--
-- WHAT THIS ADDS
--   • report_operational_obligation_health — a service-only aggregate snapshot
--     with queue depth, service-objective age breaches, due work, stale leases,
--     attempts, worker heartbeats, and one severity verdict. It returns no user
--     ids, email, notes, money amounts, or raw error text.
--   • list_operational_obligation_attention — a bounded service-only work list
--     containing opaque obligation keys, lifecycle facts, and acknowledgement
--     state. It deliberately does not hide acknowledged rows.
--   • acknowledge_operational_obligation — an audited acknowledgement overlay.
--     It neither changes the underlying lifecycle nor cancels a retry. Financial
--     and privacy work cannot be made "green" by dismissing it.
--
-- SECURITY
--   The acknowledgement table is RLS-on with no client policy. Every function
--   rejects non-service callers in its body and has EXECUTE granted only to the
--   service role. The admin-actions Edge function is the human-facing role gate.
--
-- COMPATIBILITY
--   This migration reads only the net-current columns introduced by 175, 180,
--   and 181. It changes none of their claim/release/finalize semantics and is
--   safe to deploy before the operator panel.
--
-- Depends on: 051 write_audit, 175 account_deletion_cleanup_jobs,
--             180 payment_refund_obligations recovery columns,
--             181 processed_webhook_events leases.
--
-- @rollback:
--   drop function if exists public.acknowledge_operational_obligation(text, text, uuid, text, boolean);
--   drop function if exists public.list_operational_obligation_attention(integer, integer);
--   drop function if exists public.report_operational_obligation_health(integer);
--   drop table if exists public.operational_obligation_acknowledgements;
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists public.operational_obligation_acknowledgements (
  source           text not null
                     check (source in (
                       'account_deletion',
                       'payment_refund',
                       'stripe_webhook'
                     )),
  obligation_key   text not null check (btrim(obligation_key) <> ''),
  acknowledged_by uuid references auth.users(id) on delete set null,
  acknowledged_at timestamptz not null default now(),
  note             text,
  cleared_at       timestamptz,
  updated_at       timestamptz not null default now(),
  primary key (source, obligation_key),
  constraint operational_ack_note_bounded
    check (note is null or char_length(note) <= 1000)
);

alter table public.operational_obligation_acknowledgements
  enable row level security;

revoke all on table public.operational_obligation_acknowledgements
  from public, anon, authenticated;
grant select, insert, update
  on table public.operational_obligation_acknowledgements
  to service_role;

comment on table public.operational_obligation_acknowledgements is
  'Service-only operator acknowledgement overlay for durable privacy, money, and webhook obligations. Acknowledgement never mutates or hides the underlying obligation lifecycle.';

-- Keep the service-role assertion inside every function. Grants are necessary
-- but insufficient documentation of the trust boundary, and body-level checks
-- protect a future accidental grant.
create or replace function public._require_operational_service_role()
returns void
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_role text;
begin
  v_role := coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    auth.role()
  );
  if v_role <> 'service_role' then
    raise exception 'operational obligation reporting is service-role only';
  end if;
end;
$$;

revoke all on function public._require_operational_service_role()
  from public, anon, authenticated, service_role;
grant execute on function public._require_operational_service_role()
  to service_role;

-- Aggregate health for probes and the admin console. Age is measured from the
-- durable obligation's creation (or a webhook's immutable first claim), never
-- from its next retry or most recent lease. Backoff and lease renewal therefore
-- cannot make old unresolved work look healthy. "Attention" remains factual
-- rather than a count that acknowledgement can suppress, so alert recovery
-- stays tied to actual completion.
create or replace function public.report_operational_obligation_health(
  p_stale_minutes integer default 30
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_stale interval := make_interval(
    mins => greatest(5, least(coalesce(p_stale_minutes, 30), 1440))
  );
  v_deletion_warning_age constant interval := interval '1 hour';
  v_deletion_critical_age constant interval := interval '24 hours';
  v_refund_warning_age constant interval := interval '15 minutes';
  v_refund_critical_age constant interval := interval '60 minutes';
  v_webhook_warning_age constant interval := interval '15 minutes';
  v_webhook_critical_age constant interval := interval '60 minutes';
  v_deletion jsonb;
  v_refund jsonb;
  v_webhook jsonb;
  v_workers jsonb;
  v_acks jsonb;
  v_critical integer;
  v_warning integer;
  v_severity text;
begin
  perform public._require_operational_service_role();

  select jsonb_build_object(
    'open', count(*) filter (where j.status <> 'done'),
    'due', count(*) filter (
      where j.status in ('pending', 'retry')
        and j.next_attempt_at <= now()
    ),
    'retrying', count(*) filter (where j.status = 'retry'),
    'processing', count(*) filter (where j.status = 'processing'),
    'staleLeases', count(*) filter (
      where j.status = 'processing'
        and (j.locked_at is null or j.locked_at <= now() - v_stale)
    ),
    'highAttempt', count(*) filter (
      where j.status <> 'done' and j.attempts >= 10
    ),
    'warningAgeBreaches', count(*) filter (
      where j.status <> 'done'
        and j.created_at <= now() - v_deletion_warning_age
        and j.created_at > now() - v_deletion_critical_age
    ),
    'criticalAgeBreaches', count(*) filter (
      where j.status <> 'done'
        and j.created_at <= now() - v_deletion_critical_age
    ),
    'maxAttempts', coalesce(max(j.attempts) filter (where j.status <> 'done'), 0),
    'oldestOpenSeconds', coalesce(
      floor(extract(epoch from now() - min(j.created_at)
        filter (where j.status <> 'done')))::bigint,
      0
    )
  ) into v_deletion
  from public.account_deletion_cleanup_jobs j;

  select jsonb_build_object(
    'open', count(*) filter (
      where r.status in ('pending', 'requires_action')
    ),
    'due', count(*) filter (
      where r.status in ('pending', 'requires_action')
        and coalesce(r.recovery_next_attempt_at, r.created_at) <= now()
        and (
          r.recovery_lease_token is null
          or r.recovery_lease_expires_at <= now()
        )
    ),
    'requiresAction', count(*) filter (where r.status = 'requires_action'),
    'terminalFailed', count(*) filter (where r.status in ('failed', 'canceled')),
    'leased', count(*) filter (
      where r.status in ('pending', 'requires_action')
        and r.recovery_lease_token is not null
        and r.recovery_lease_expires_at > now()
    ),
    'staleLeases', count(*) filter (
      where r.status in ('pending', 'requires_action')
        and r.recovery_lease_token is not null
        and r.recovery_lease_expires_at <= now()
    ),
    'highAttempt', count(*) filter (
      where r.status in ('pending', 'requires_action')
        and r.recovery_attempts >= 10
    ),
    'warningAgeBreaches', count(*) filter (
      where r.status in ('pending', 'requires_action')
        and r.created_at <= now() - v_refund_warning_age
        and r.created_at > now() - v_refund_critical_age
    ),
    'criticalAgeBreaches', count(*) filter (
      where r.status in ('pending', 'requires_action')
        and r.created_at <= now() - v_refund_critical_age
    ),
    'maxAttempts', coalesce(max(r.recovery_attempts)
      filter (where r.status in ('pending', 'requires_action')), 0),
    'oldestOpenSeconds', coalesce(
      floor(extract(epoch from now() - min(r.created_at)
        filter (where r.status in ('pending', 'requires_action'))))::bigint,
      0
    )
  ) into v_refund
  from public.payment_refund_obligations r;

  select jsonb_build_object(
    'open', count(*),
    'processing', count(*) filter (where w.status = 'processing'),
    'retrying', count(*) filter (where w.status = 'retry'),
    'staleLeases', count(*) filter (
      where w.status = 'processing'
        and (w.locked_at is null or w.locked_at <= now() - v_stale)
    ),
    'highAttempt', count(*) filter (
      where w.attempts >= 5
    ),
    'warningAgeBreaches', count(*) filter (
      where w.first_claimed_at <= now() - v_webhook_warning_age
        and w.first_claimed_at > now() - v_webhook_critical_age
    ),
    'criticalAgeBreaches', count(*) filter (
      where w.first_claimed_at <= now() - v_webhook_critical_age
    ),
    'maxAttempts', coalesce(max(w.attempts), 0),
    'oldestOpenSeconds', coalesce(
      floor(extract(epoch from now() - min(w.first_claimed_at)))::bigint,
      0
    ),
    'oldestProcessingSeconds', coalesce(
      floor(extract(epoch from now() - min(w.first_claimed_at)
        filter (where w.status = 'processing')))::bigint,
      0
    )
  ) into v_webhook
  from public.processed_webhook_events w
  where w.status in ('processing', 'retry');

  select jsonb_build_object(
    'accountDeletion', coalesce(
      (select value from public.system_config
        where key = 'account_deletion_last_run'),
      '{"ok":false,"reason":"never_run"}'::jsonb
    ),
    'paymentRefund', coalesce(
      (select value from public.system_config
        where key = 'payment_refund_recovery_last_run'),
      '{"ok":false,"reason":"never_run"}'::jsonb
    )
  ) into v_workers;

  select coalesce(
    jsonb_object_agg(source, active_count),
    '{}'::jsonb
  ) into v_acks
  from (
    select source, count(*)::integer as active_count
      from public.operational_obligation_acknowledgements
     where cleared_at is null
     group by source
  ) counts;

  v_critical :=
      coalesce((v_deletion ->> 'highAttempt')::integer, 0)
    + coalesce((v_deletion ->> 'criticalAgeBreaches')::integer, 0)
    + coalesce((v_refund ->> 'requiresAction')::integer, 0)
    + coalesce((v_refund ->> 'terminalFailed')::integer, 0)
    + coalesce((v_refund ->> 'highAttempt')::integer, 0)
    + coalesce((v_refund ->> 'criticalAgeBreaches')::integer, 0)
    + coalesce((v_webhook ->> 'criticalAgeBreaches')::integer, 0);
  v_warning :=
      coalesce((v_deletion ->> 'due')::integer, 0)
    + coalesce((v_deletion ->> 'retrying')::integer, 0)
    + coalesce((v_deletion ->> 'staleLeases')::integer, 0)
    + coalesce((v_deletion ->> 'warningAgeBreaches')::integer, 0)
    + coalesce((v_refund ->> 'due')::integer, 0)
    + coalesce((v_refund ->> 'staleLeases')::integer, 0)
    + coalesce((v_refund ->> 'warningAgeBreaches')::integer, 0)
    + coalesce((v_webhook ->> 'retrying')::integer, 0)
    + coalesce((v_webhook ->> 'staleLeases')::integer, 0)
    + coalesce((v_webhook ->> 'highAttempt')::integer, 0)
    + coalesce((v_webhook ->> 'warningAgeBreaches')::integer, 0);
  v_severity := case
    when v_critical > 0 then 'critical'
    when v_warning > 0 then 'warning'
    else 'healthy'
  end;

  return jsonb_build_object(
    'schemaVersion', 1,
    'generatedAt', now(),
    'staleAfterSeconds', floor(extract(epoch from v_stale))::integer,
    'severity', v_severity,
    'healthy', v_severity = 'healthy',
    'accountDeletion', v_deletion,
    'paymentRefund', v_refund,
    'stripeWebhook', v_webhook,
    'workerHeartbeats', v_workers,
    'activeAcknowledgements', v_acks
  );
end;
$$;

-- A bounded exceptional-work list. Ordinary pending rows are included once due
-- or once their age crosses a service objective. This is an attention surface,
-- not a shadow copy of every queue.
create or replace function public.list_operational_obligation_attention(
  p_limit integer default 100,
  p_stale_minutes integer default 30
)
returns table (
  source text,
  obligation_key text,
  status text,
  attempts integer,
  age_seconds bigint,
  reason text,
  acknowledged_at timestamptz,
  acknowledgement_note text
)
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_limit integer := greatest(1, least(coalesce(p_limit, 100), 500));
  v_stale interval := make_interval(
    mins => greatest(5, least(coalesce(p_stale_minutes, 30), 1440))
  );
  v_deletion_warning_age constant interval := interval '1 hour';
  v_deletion_critical_age constant interval := interval '24 hours';
  v_refund_warning_age constant interval := interval '15 minutes';
  v_refund_critical_age constant interval := interval '60 minutes';
  v_webhook_warning_age constant interval := interval '15 minutes';
  v_webhook_critical_age constant interval := interval '60 minutes';
begin
  perform public._require_operational_service_role();

  return query
  with attention as (
    select
      'account_deletion'::text as source,
      j.id::text as obligation_key,
      j.status,
      j.attempts,
      floor(extract(epoch from now() - j.created_at))::bigint as age_seconds,
      case
        when j.attempts >= 10
          or j.created_at <= now() - v_deletion_critical_age
          then 0
        else 1
      end::integer as severity_rank,
      case
        when j.attempts >= 10 then 'high_attempt'
        when j.created_at <= now() - v_deletion_critical_age
          then 'critical_age'
        when j.status = 'processing'
          and (j.locked_at is null or j.locked_at <= now() - v_stale)
          then 'stale_lease'
        when j.status = 'retry' then 'retrying'
        when j.created_at <= now() - v_deletion_warning_age
          then 'warning_age'
        else 'due'
      end::text as reason
    from public.account_deletion_cleanup_jobs j
    where j.status <> 'done'
      and (
        j.attempts >= 10
        or j.created_at <= now() - v_deletion_warning_age
        or j.status = 'retry'
        or (
          j.status in ('pending', 'retry')
          and j.next_attempt_at <= now()
        )
        or (
          j.status = 'processing'
          and (j.locked_at is null or j.locked_at <= now() - v_stale)
        )
      )

    union all

    select
      'payment_refund',
      r.payment_intent_id,
      r.status,
      r.recovery_attempts,
      floor(extract(epoch from now() - r.created_at))::bigint,
      case
        when r.status in ('requires_action', 'failed', 'canceled')
          or r.recovery_attempts >= 10
          or r.created_at <= now() - v_refund_critical_age
          then 0
        else 1
      end,
      case
        when r.status in ('failed', 'canceled') then 'terminal_failed'
        when r.status = 'requires_action' then 'requires_action'
        when r.recovery_attempts >= 10 then 'high_attempt'
        when r.created_at <= now() - v_refund_critical_age
          then 'critical_age'
        when r.recovery_lease_token is not null
          and r.recovery_lease_expires_at <= now() then 'stale_lease'
        when r.created_at <= now() - v_refund_warning_age
          then 'warning_age'
        else 'due'
      end
    from public.payment_refund_obligations r
    where r.status in (
      'pending', 'requires_action', 'failed', 'canceled'
    )
      and (
        r.status in ('requires_action', 'failed', 'canceled')
        or r.recovery_attempts >= 10
        or (
          r.recovery_lease_token is not null
          and r.recovery_lease_expires_at <= now()
        )
        or (
          r.status in ('pending', 'requires_action')
          and r.created_at <= now() - v_refund_warning_age
        )
        or (
          coalesce(r.recovery_next_attempt_at, r.created_at) <= now()
          and (
            r.recovery_lease_token is null
            or r.recovery_lease_expires_at <= now()
          )
        )
      )

    union all

    select
      'stripe_webhook',
      w.event_id,
      w.status,
      w.attempts,
      floor(extract(epoch from now() - w.first_claimed_at))::bigint,
      case
        when w.first_claimed_at <= now() - v_webhook_critical_age
          then 0
        else 1
      end,
      case
        when w.first_claimed_at <= now() - v_webhook_critical_age
          then 'critical_age'
        when w.attempts >= 5 then 'high_attempt'
        when w.status = 'processing'
          and (w.locked_at is null or w.locked_at <= now() - v_stale)
          then 'stale_lease'
        when w.status = 'retry' then 'retrying'
        else 'warning_age'
      end
    from public.processed_webhook_events w
    where w.status in ('processing', 'retry')
      and (
        w.first_claimed_at <= now() - v_webhook_warning_age
        or w.status = 'retry'
        or w.attempts >= 5
        or (
          w.status = 'processing'
          and (w.locked_at is null or w.locked_at <= now() - v_stale)
        )
      )
  )
  select
    a.source,
    a.obligation_key,
    a.status,
    a.attempts,
    a.age_seconds,
    a.reason,
    ack.acknowledged_at,
    ack.note
  from attention a
  left join public.operational_obligation_acknowledgements ack
    on ack.source = a.source
   and ack.obligation_key = a.obligation_key
   and ack.cleared_at is null
  order by
    a.severity_rank,
    case a.reason
      when 'terminal_failed' then 0
      when 'requires_action' then 1
      when 'high_attempt' then 2
      when 'critical_age' then 3
      when 'stale_lease' then 4
      when 'retrying' then 5
      when 'warning_age' then 6
      else 7
    end,
    a.age_seconds desc,
    a.source,
    a.obligation_key
  limit v_limit;
end;
$$;

-- Acknowledgement is explicitly non-resolving. Clearing an acknowledgement
-- means "return this to unacknowledged attention," not "the obligation is done."
create or replace function public.acknowledge_operational_obligation(
  p_source text,
  p_obligation_key text,
  p_actor uuid,
  p_note text default null,
  p_clear boolean default false
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_source text := btrim(coalesce(p_source, ''));
  v_key text := btrim(coalesce(p_obligation_key, ''));
  v_note text := nullif(left(btrim(coalesce(p_note, '')), 1000), '');
  v_exists boolean := false;
begin
  perform public._require_operational_service_role();
  if not public.has_role(p_actor, array['admin', 'developer']) then
    raise exception 'not authorized: operational acknowledgement requires admin or developer';
  end if;
  if v_source not in (
    'account_deletion',
    'payment_refund',
    'stripe_webhook'
  ) or v_key = '' then
    raise exception 'invalid operational obligation identity';
  end if;

  if v_source = 'account_deletion' then
    select exists(
      select 1 from public.account_deletion_cleanup_jobs
       where id::text = v_key and status <> 'done'
    ) into v_exists;
  elsif v_source = 'payment_refund' then
    select exists(
      select 1 from public.payment_refund_obligations
       where payment_intent_id = v_key
         and status in ('pending', 'requires_action', 'failed', 'canceled')
    ) into v_exists;
  else
    select exists(
      select 1 from public.processed_webhook_events
       where event_id = v_key and status in ('processing', 'retry')
    ) into v_exists;
  end if;
  if not v_exists then
    return false;
  end if;

  insert into public.operational_obligation_acknowledgements (
    source,
    obligation_key,
    acknowledged_by,
    acknowledged_at,
    note,
    cleared_at,
    updated_at
  ) values (
    v_source,
    v_key,
    p_actor,
    now(),
    v_note,
    case when p_clear then now() else null end,
    now()
  )
  on conflict (source, obligation_key) do update
     set acknowledged_by = excluded.acknowledged_by,
         acknowledged_at = excluded.acknowledged_at,
         note = excluded.note,
         cleared_at = excluded.cleared_at,
         updated_at = excluded.updated_at;

  perform public.write_audit(
    p_action            => case
      when p_clear then 'clear_operational_acknowledgement'
      else 'acknowledge_operational_obligation'
    end,
    p_target_user_id    => null,
    p_target_type       => 'operational_obligation',
    p_target_id         => v_source || ':' || v_key,
    p_reason            => v_note,
    p_before            => null,
    p_after             => jsonb_build_object(
      'source', v_source,
      'acknowledged', not p_clear
    ),
    p_was_destructive   => false,
    p_was_reversible    => true,
    p_user_notified     => false,
    p_actor_id          => p_actor
  );
  return true;
end;
$$;

revoke all on function public.report_operational_obligation_health(integer)
  from public, anon, authenticated, service_role;
revoke all on function public.list_operational_obligation_attention(integer, integer)
  from public, anon, authenticated, service_role;
revoke all on function public.acknowledge_operational_obligation(
  text, text, uuid, text, boolean
) from public, anon, authenticated, service_role;

grant execute on function public.report_operational_obligation_health(integer)
  to service_role;
grant execute on function public.list_operational_obligation_attention(integer, integer)
  to service_role;
grant execute on function public.acknowledge_operational_obligation(
  text, text, uuid, text, boolean
) to service_role;

comment on function public.report_operational_obligation_health(integer) is
  'Service-only aggregate health snapshot over account deletion, payment refund, and Stripe webhook obligations. Returns lifecycle counts and worker heartbeats without PII or raw errors.';
comment on function public.list_operational_obligation_attention(integer, integer) is
  'Service-only bounded exceptional-work list. Acknowledged obligations remain visible until their authoritative lifecycle completes.';
comment on function public.acknowledge_operational_obligation(
  text, text, uuid, text, boolean
) is
  'Audited operator acknowledgement overlay. Never retries, cancels, resolves, or hides the underlying privacy/financial/webhook obligation.';
