/**
 * Operational obligation health (migration 182).
 *
 * Executes the real migration over the net-current queue shapes. The important
 * contract is not merely that the report functions exist: due/stale/manual work
 * must raise attention, acknowledgements must remain non-resolving, and no
 * client role may read or acknowledge the service-owned queues.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const webhookLeaseMigration = readFileSync(resolve(
  process.cwd(),
  'supabase/migrations/181_leased_stripe_webhook_events.sql',
), 'utf8');
const operationalHealthMigration = readFileSync(resolve(
  process.cwd(),
  'supabase/migrations/182_operational_obligation_health.sql',
), 'utf8');

const ADMIN = '11111111-1111-1111-1111-111111111111';
const DELETION_JOB = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const BOUNDARY_DELETION_JOB = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
let db;

async function asRole(role) {
  await db.query(
    `select set_config('request.jwt.claim.role', $1, false)`,
    [role],
  );
}

async function readHealth() {
  const { rows } = await db.query(
    `select public.report_operational_obligation_health(30) as health`,
  );
  return rows[0].health;
}

async function claimWebhook(eventId) {
  const { rows } = await db.query(
    `select public.claim_stripe_webhook_event(
      $1,
      'invoice.paid',
      300
    ) as claim`,
    [eventId],
  );
  return rows[0].claim;
}

async function withIsolatedObligations(run) {
  await db.exec('begin');
  try {
    await db.exec(`
      truncate table
        public.account_deletion_cleanup_jobs,
        public.payment_refund_obligations,
        public.processed_webhook_events
    `);
    await run();
  } finally {
    // PostgreSQL's now() is fixed at transaction start. Besides restoring the
    // shared fixture, rollback keeps exact threshold timestamps deterministic.
    await db.exec('rollback');
  }
}

beforeAll(async () => {
  db = new PGlite();
  await db.exec(`
    do $do$ begin
      if not exists (select from pg_roles where rolname = 'anon') then
        create role anon;
      end if;
      if not exists (select from pg_roles where rolname = 'authenticated') then
        create role authenticated;
      end if;
      if not exists (select from pg_roles where rolname = 'service_role') then
        create role service_role;
      end if;
    end $do$;

    create schema if not exists auth;
    create or replace function auth.role()
    returns text language sql stable as $fn$
      select coalesce(
        nullif(current_setting('request.jwt.claim.role', true), ''),
        'authenticated'
      )
    $fn$;
    create table auth.users (id uuid primary key);
    insert into auth.users (id) values ('${ADMIN}');

    create table public.profiles (
      id uuid primary key references auth.users(id),
      role text not null
    );
    insert into public.profiles (id, role) values ('${ADMIN}', 'admin');

    create or replace function public.has_role(p_user_id uuid, p_roles text[])
    returns boolean language sql stable set search_path = public, pg_temp as $fn$
      select exists (
        select 1 from public.profiles
         where id = p_user_id and role = any(p_roles)
      )
    $fn$;

    create table public.audit_log (
      id uuid primary key default gen_random_uuid(),
      action text not null,
      target_id text,
      actor_id uuid,
      created_at timestamptz not null default now()
    );
    create or replace function public.write_audit(
      p_action text,
      p_target_user_id uuid default null,
      p_target_type text default null,
      p_target_id text default null,
      p_reason text default null,
      p_before jsonb default null,
      p_after jsonb default null,
      p_was_destructive boolean default false,
      p_was_reversible boolean default true,
      p_user_notified boolean default false,
      p_actor_id uuid default null
    ) returns uuid language plpgsql security definer
      set search_path = public, pg_temp as $fn$
    declare v_id uuid;
    begin
      insert into public.audit_log (action, target_id, actor_id)
      values (p_action, p_target_id, p_actor_id)
      returning id into v_id;
      return v_id;
    end $fn$;

    create table public.system_config (
      key text primary key,
      value jsonb not null
    );
    insert into public.system_config (key, value) values
      ('account_deletion_last_run',
       '{"at":"2026-07-24T12:00:00Z","ok":true}'::jsonb),
      ('payment_refund_recovery_last_run',
       '{"at":"2026-07-24T12:01:00Z","ok":false}'::jsonb);

    create table public.account_deletion_cleanup_jobs (
      id uuid primary key,
      status text not null,
      attempts integer not null default 0,
      next_attempt_at timestamptz not null default now(),
      locked_at timestamptz,
      created_at timestamptz not null default now()
    );
    insert into public.account_deletion_cleanup_jobs (
      id, status, attempts, next_attempt_at, locked_at, created_at
    ) values (
      '${DELETION_JOB}', 'retry', 11, now() - interval '1 hour',
      null, now() - interval '2 days'
    );

    create table public.payment_refund_obligations (
      payment_intent_id text primary key,
      status text not null,
      recovery_attempts integer not null default 0,
      recovery_next_attempt_at timestamptz,
      recovery_lease_token uuid,
      recovery_lease_expires_at timestamptz,
      created_at timestamptz not null default now()
    );
    insert into public.payment_refund_obligations (
      payment_intent_id, status, recovery_attempts,
      recovery_next_attempt_at, created_at
    ) values
      ('pi_manual', 'requires_action', 3, now() - interval '5 minutes',
       now() - interval '3 hours'),
      ('pi_done', 'succeeded', 1, null, now() - interval '1 day');

    create table public.processed_webhook_events (
      event_id text primary key,
      event_type text,
      processed_at timestamptz not null default now()
    );
  `);
  await db.exec(webhookLeaseMigration);
  await db.exec(`
    insert into public.processed_webhook_events (
      event_id, event_type, status, lease_token, locked_at, completed_at,
      first_claimed_at, attempts
    ) values (
      'evt_stale', 'invoice.paid', 'processing', gen_random_uuid(),
      now() - interval '2 hours', null, now() - interval '2 hours', 2
    )
  `);
  await db.exec(operationalHealthMigration);
}, 60_000);

describe('migration 182 operational obligation health', () => {
  it('reports factual cross-queue attention and worker heartbeats', async () => {
    await asRole('service_role');
    const { rows } = await db.query(
      `select public.report_operational_obligation_health(30) as health`,
    );
    const health = rows[0].health;

    expect(health).toMatchObject({
      schemaVersion: 1,
      severity: 'critical',
      healthy: false,
      accountDeletion: {
        open: 1,
        due: 1,
        retrying: 1,
        highAttempt: 1,
        warningAgeBreaches: 0,
        criticalAgeBreaches: 1,
      },
      paymentRefund: {
        open: 1,
        requiresAction: 1,
        terminalFailed: 0,
        warningAgeBreaches: 0,
        criticalAgeBreaches: 1,
      },
      stripeWebhook: {
        open: 1,
        processing: 1,
        retrying: 0,
        staleLeases: 1,
        warningAgeBreaches: 0,
        criticalAgeBreaches: 1,
      },
      workerHeartbeats: {
        accountDeletion: { ok: true },
        paymentRefund: { ok: false },
      },
    });
  });

  it('enforces every service-objective age boundary without false green', async () => {
    await asRole('service_role');
    await withIsolatedObligations(async () => {
      // Both durable queues have next attempts in the future, while the webhook
      // has a fresh lease. Only unresolved age may escalate these pending rows.
      await db.exec(`
        insert into public.account_deletion_cleanup_jobs (
          id, status, attempts, next_attempt_at, locked_at, created_at
        ) values (
          '${BOUNDARY_DELETION_JOB}', 'pending', 0,
          now() + interval '2 days', null,
          now() - interval '59 minutes 59 seconds'
        );

        insert into public.payment_refund_obligations (
          payment_intent_id, status, recovery_attempts,
          recovery_next_attempt_at, created_at
        ) values (
          'pi_boundary', 'pending', 0,
          now() + interval '2 days',
          now() - interval '14 minutes 59 seconds'
        );

        insert into public.processed_webhook_events (
          event_id, event_type, status, lease_token, locked_at, completed_at,
          first_claimed_at, attempts
        ) values (
          'evt_boundary', 'invoice.paid', 'processing', gen_random_uuid(),
          now(), null, now() - interval '14 minutes 59 seconds', 1
        )
      `);

      expect(await readHealth()).toMatchObject({
        severity: 'healthy',
        healthy: true,
        accountDeletion: {
          due: 0,
          warningAgeBreaches: 0,
          criticalAgeBreaches: 0,
        },
        paymentRefund: {
          due: 0,
          warningAgeBreaches: 0,
          criticalAgeBreaches: 0,
        },
        stripeWebhook: {
          staleLeases: 0,
          warningAgeBreaches: 0,
          criticalAgeBreaches: 0,
        },
      });

      await db.exec(`
        update public.account_deletion_cleanup_jobs
           set created_at = now() - interval '1 hour';
        update public.payment_refund_obligations
           set created_at = now() - interval '15 minutes';
        update public.processed_webhook_events
           set first_claimed_at = now() - interval '15 minutes'
      `);

      expect(await readHealth()).toMatchObject({
        severity: 'warning',
        healthy: false,
        accountDeletion: {
          due: 0,
          warningAgeBreaches: 1,
          criticalAgeBreaches: 0,
        },
        paymentRefund: {
          due: 0,
          warningAgeBreaches: 1,
          criticalAgeBreaches: 0,
        },
        stripeWebhook: {
          staleLeases: 0,
          warningAgeBreaches: 1,
          criticalAgeBreaches: 0,
        },
      });

      const warningAttention = await db.query(
        `select source, reason
           from public.list_operational_obligation_attention(20, 30)`,
      );
      expect(warningAttention.rows).toEqual([
        { source: 'account_deletion', reason: 'warning_age' },
        { source: 'payment_refund', reason: 'warning_age' },
        { source: 'stripe_webhook', reason: 'warning_age' },
      ]);

      await db.exec(`
        update public.account_deletion_cleanup_jobs
           set status = 'retry',
               created_at = now() - interval '23 hours 59 minutes 59 seconds';
        update public.payment_refund_obligations
           set created_at = now() - interval '59 minutes 59 seconds';
        update public.processed_webhook_events
           set first_claimed_at = now() - interval '59 minutes 59 seconds'
      `);

      expect(await readHealth()).toMatchObject({
        severity: 'warning',
        accountDeletion: {
          due: 0,
          retrying: 1,
          warningAgeBreaches: 1,
          criticalAgeBreaches: 0,
        },
        paymentRefund: {
          warningAgeBreaches: 1,
          criticalAgeBreaches: 0,
        },
        stripeWebhook: {
          warningAgeBreaches: 1,
          criticalAgeBreaches: 0,
        },
      });

      await db.exec(`
        update public.account_deletion_cleanup_jobs
           set created_at = now() - interval '24 hours';
        update public.payment_refund_obligations
           set created_at = now() - interval '60 minutes';
        update public.processed_webhook_events
           set first_claimed_at = now() - interval '60 minutes'
      `);

      expect(await readHealth()).toMatchObject({
        severity: 'critical',
        healthy: false,
        accountDeletion: {
          warningAgeBreaches: 0,
          criticalAgeBreaches: 1,
        },
        paymentRefund: {
          warningAgeBreaches: 0,
          criticalAgeBreaches: 1,
        },
        stripeWebhook: {
          warningAgeBreaches: 0,
          criticalAgeBreaches: 1,
        },
      });

      const criticalAttention = await db.query(
        `select source, reason
           from public.list_operational_obligation_attention(20, 30)`,
      );
      expect(criticalAttention.rows).toEqual([
        { source: 'account_deletion', reason: 'critical_age' },
        { source: 'payment_refund', reason: 'critical_age' },
        { source: 'stripe_webhook', reason: 'critical_age' },
      ]);
    });
  });

  it('retains webhook age and attempts across release and redelivery', async () => {
    await asRole('service_role');
    await withIsolatedObligations(async () => {
      const firstClaim = await claimWebhook('evt_redelivery');
      expect(firstClaim).toMatchObject({ claimed: true, attempts: 1 });

      await db.exec(`
        update public.processed_webhook_events
           set first_claimed_at = now() - interval '60 minutes'
         where event_id = 'evt_redelivery'
      `);
      const firstClock = await db.query(`
        select first_claimed_at
          from public.processed_webhook_events
         where event_id = 'evt_redelivery'
      `);

      const released = await db.query(
        `select public.release_stripe_webhook_event($1, $2::uuid) as ok`,
        ['evt_redelivery', firstClaim.lease_token],
      );
      expect(released.rows[0].ok).toBe(true);

      const retryState = await db.query(`
        select status, attempts, lease_token, locked_at, first_claimed_at
          from public.processed_webhook_events
         where event_id = 'evt_redelivery'
      `);
      expect(retryState.rows[0]).toMatchObject({
        status: 'retry',
        attempts: 1,
        lease_token: null,
        locked_at: null,
        first_claimed_at: firstClock.rows[0].first_claimed_at,
      });
      expect(await readHealth()).toMatchObject({
        severity: 'critical',
        stripeWebhook: {
          open: 1,
          processing: 0,
          retrying: 1,
          criticalAgeBreaches: 1,
        },
      });

      const secondClaim = await claimWebhook('evt_redelivery');
      expect(secondClaim).toMatchObject({ claimed: true, attempts: 2 });
      const reclaimed = await db.query(`
        select status, attempts, first_claimed_at
          from public.processed_webhook_events
         where event_id = 'evt_redelivery'
      `);
      expect(reclaimed.rows[0]).toEqual({
        status: 'processing',
        attempts: 2,
        first_claimed_at: firstClock.rows[0].first_claimed_at,
      });
      expect(await readHealth()).toMatchObject({
        severity: 'critical',
        stripeWebhook: {
          open: 1,
          processing: 1,
          retrying: 0,
          staleLeases: 0,
          criticalAgeBreaches: 1,
        },
      });
    });
  });

  it('lists independent stale leases and orders critical work first', async () => {
    await asRole('service_role');
    await withIsolatedObligations(async () => {
      await db.exec(`
        insert into public.payment_refund_obligations (
          payment_intent_id, status, recovery_attempts,
          recovery_next_attempt_at, recovery_lease_token,
          recovery_lease_expires_at, created_at
        ) values (
          'pi_stale_future', 'pending', 1,
          now() + interval '2 days', gen_random_uuid(),
          now() - interval '1 minute', now() - interval '1 minute'
        );

        insert into public.processed_webhook_events (
          event_id, event_type, status, lease_token, locked_at, completed_at,
          first_claimed_at, attempts
        ) values
          (
            'evt_warning_attempts', 'invoice.paid', 'processing',
            gen_random_uuid(), now(), null, now() - interval '20 minutes', 5
          ),
          (
            'evt_critical_age', 'invoice.paid', 'processing',
            gen_random_uuid(), now(), null, now() - interval '60 minutes', 1
          )
      `);

      expect(await readHealth()).toMatchObject({
        severity: 'critical',
        paymentRefund: {
          due: 0,
          staleLeases: 1,
          warningAgeBreaches: 0,
        },
        stripeWebhook: {
          highAttempt: 1,
          warningAgeBreaches: 1,
          criticalAgeBreaches: 1,
        },
      });

      const attention = await db.query(
        `select source, obligation_key, reason
           from public.list_operational_obligation_attention(20, 30)`,
      );
      expect(attention.rows[0]).toEqual({
        source: 'stripe_webhook',
        obligation_key: 'evt_critical_age',
        reason: 'critical_age',
      });
      expect(attention.rows).toContainEqual({
        source: 'payment_refund',
        obligation_key: 'pi_stale_future',
        reason: 'stale_lease',
      });
      expect(attention.rows.findIndex(
        (row) => row.obligation_key === 'evt_critical_age',
      )).toBeLessThan(attention.rows.findIndex(
        (row) => row.obligation_key === 'evt_warning_attempts',
      ));
    });
  });

  it('keeps acknowledged work visible and leaves its lifecycle untouched', async () => {
    await asRole('service_role');
    const acknowledged = await db.query(
      `select public.acknowledge_operational_obligation(
        'payment_refund',
        'pi_manual',
        '${ADMIN}'::uuid,
        'Stripe support case opened',
        false
      ) as ok`,
    );
    expect(acknowledged.rows[0].ok).toBe(true);

    const attention = await db.query(
      `select * from public.list_operational_obligation_attention(20, 30)`,
    );
    const refund = attention.rows.find(
      (row) => row.source === 'payment_refund',
    );
    expect(refund).toMatchObject({
      obligation_key: 'pi_manual',
      status: 'requires_action',
      reason: 'requires_action',
      acknowledgement_note: 'Stripe support case opened',
    });
    expect(refund.acknowledged_at).toBeTruthy();

    const lifecycle = await db.query(
      `select status from public.payment_refund_obligations
        where payment_intent_id = 'pi_manual'`,
    );
    expect(lifecycle.rows[0].status).toBe('requires_action');
    const audit = await db.query(
      `select action, target_id from public.audit_log`,
    );
    expect(audit.rows).toEqual([{
      action: 'acknowledge_operational_obligation',
      target_id: 'payment_refund:pi_manual',
    }]);
  });

  it('rejects client roles and refuses acknowledgements for absent work', async () => {
    await asRole('authenticated');
    await expect(
      db.query(`select public.report_operational_obligation_health(30)`),
    ).rejects.toThrow(/service-role only/i);

    await asRole('service_role');
    const absent = await db.query(
      `select public.acknowledge_operational_obligation(
        'stripe_webhook',
        'evt_absent',
        '${ADMIN}'::uuid,
        null,
        false
      ) as ok`,
    );
    expect(absent.rows[0].ok).toBe(false);
  });
});
