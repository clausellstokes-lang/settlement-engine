/**
 * Durable payment-refund recovery (migration 180).
 *
 * Applies the complete 177 + 180 schema to PGlite. This executes the real
 * generated idempotency key, service-role gates, SKIP LOCKED lease/reclaim,
 * token-guarded retry release, and the interaction with 177's lifecycle ordering
 * rather than testing a copied SQL model.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const migration177 = readFileSync(resolve(
  process.cwd(),
  'supabase/migrations/177_payment_refund_obligations.sql',
), 'utf8');
const migration180 = readFileSync(resolve(
  process.cwd(),
  'supabase/migrations/180_payment_refund_obligation_recovery.sql',
), 'utf8');

const USER = '11111111-1111-1111-1111-111111111111';
const ATTEMPT = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

let db;

async function makeDb() {
  const next = new PGlite();
  await next.exec(`
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
    create or replace function auth.role() returns text language sql stable as $fn$
      select coalesce(
        nullif(current_setting('request.jwt.claim.role', true), ''),
        'authenticated'
      )
    $fn$;
    create table auth.users (id uuid primary key);
    create table public.credit_auto_reload_attempts (
      id uuid primary key,
      user_id uuid references auth.users(id) on delete cascade
    );
    create table public.system_config (
      key text primary key,
      value jsonb not null,
      updated_at timestamptz not null default now()
    );

    insert into auth.users (id) values ('${USER}');
    insert into public.credit_auto_reload_attempts (id, user_id)
      values ('${ATTEMPT}', '${USER}');
  `);
  await next.exec(migration177);
  await next.exec(migration180);
  return next;
}

async function asRole(role) {
  await db.query(
    `select set_config('request.jwt.claim.role', $1, false)`,
    [role],
  );
}

async function record(overrides = {}) {
  const input = {
    paymentIntentId: 'pi_recovery',
    purpose: 'auto_reload_unfulfilled',
    amountCents: 459,
    currency: 'usd',
    reason: 'attempt_mismatch',
    status: 'pending',
    stripeRefundId: null,
    checkoutSessionId: null,
    userId: USER,
    attemptId: ATTEMPT,
    failureReason: null,
    stripeEventCreatedAt: null,
    resolvedAt: null,
    ...overrides,
  };
  await asRole('service_role');
  const { rows } = await db.query(
    `select public.record_payment_refund_obligation(
       $1::text, $2::text, $3::integer, $4::text, $5::text, $6::text,
       $7::text, $8::text, $9::uuid, $10::uuid, $11::text,
       $12::timestamptz, $13::timestamptz
     ) as obligation`,
    [
      input.paymentIntentId,
      input.purpose,
      input.amountCents,
      input.currency,
      input.reason,
      input.status,
      input.stripeRefundId,
      input.checkoutSessionId,
      input.userId,
      input.attemptId,
      input.failureReason,
      input.stripeEventCreatedAt,
      input.resolvedAt,
    ],
  );
  return rows[0].obligation;
}

async function claim(limit = 10, leaseSeconds = 120) {
  await asRole('service_role');
  const { rows } = await db.query(
    `select * from public.claim_payment_refund_obligations($1, $2)`,
    [limit, leaseSeconds],
  );
  return rows;
}

beforeEach(async () => {
  db = await makeDb();
}, 60_000);

describe('migration 180 payment refund recovery', () => {
  it('seeds an inert dispatcher and stores the original producer idempotency keys', async () => {
    await record();
    await record({
      paymentIntentId: 'pi_checkout',
      purpose: 'deleted_account_checkout',
      reason: 'inactive_checkout',
      userId: null,
      attemptId: null,
    });
    await record({
      paymentIntentId: 'pi_invoice',
      purpose: 'deleted_account_invoice',
      reason: 'inactive_invoice',
      userId: null,
      attemptId: null,
    });
    await record({
      paymentIntentId: 'pi_future',
      purpose: 'future_unfulfilled_purpose',
      reason: 'future',
      userId: null,
      attemptId: null,
    });

    const keys = await db.query(`
      select payment_intent_id, stripe_idempotency_key
        from public.payment_refund_obligations
       order by payment_intent_id
    `);
    expect(keys.rows).toEqual([
      {
        payment_intent_id: 'pi_checkout',
        stripe_idempotency_key: 'deleted-account-checkout-refund-pi_checkout',
      },
      {
        payment_intent_id: 'pi_future',
        stripe_idempotency_key: 'unfulfilled-payment-refund-pi_future',
      },
      {
        payment_intent_id: 'pi_invoice',
        stripe_idempotency_key: 'deleted-account-invoice-refund-pi_invoice',
      },
      {
        payment_intent_id: 'pi_recovery',
        stripe_idempotency_key: 'auto-reload-unfulfilled-refund-pi_recovery',
      },
    ]);

    const config = await db.query(`
      select value
        from public.system_config
       where key = 'payment_refund_recovery_cron'
    `);
    expect(config.rows).toHaveLength(1);
    expect(config.rows[0].value).toMatchObject({
      enabled: true,
      url: null,
      secret: null,
      claimBatchSize: 10,
      maxJobsPerRun: 25,
    });
    const verdict = await db.query(`
      select public._payment_refund_recovery_cron_should_dispatch(
        '{"enabled":true,"url":null,"secret":null}'::jsonb
      ) as verdict
    `);
    expect(verdict.rows[0].verdict).toBe('not_configured');
  });

  it('leases a due row once, rejects the stale token, and reclaims an expired lease', async () => {
    await record();
    const first = await claim(1, 30);
    expect(first).toHaveLength(1);
    expect(first[0]).toMatchObject({
      payment_intent_id: 'pi_recovery',
      stripe_idempotency_key: 'auto-reload-unfulfilled-refund-pi_recovery',
      recovery_attempts: 1,
    });
    expect(first[0].lease_token).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    expect(await claim(1, 30)).toEqual([]);

    await db.exec(`
      update public.payment_refund_obligations
         set recovery_lease_expires_at = now() - interval '1 second'
       where payment_intent_id = 'pi_recovery'
    `);
    const reclaimed = await claim(1, 30);
    expect(reclaimed).toHaveLength(1);
    expect(reclaimed[0].lease_token).not.toBe(first[0].lease_token);
    expect(reclaimed[0].recovery_attempts).toBe(2);

    const staleRelease = await db.query(`
      select public.release_payment_refund_obligation_lease(
        'pi_recovery', '${first[0].lease_token}'::uuid, 'stale', 30
      ) as ok
    `);
    expect(staleRelease.rows[0].ok).toBe(false);

    const currentRelease = await db.query(`
      select public.release_payment_refund_obligation_lease(
        'pi_recovery', '${reclaimed[0].lease_token}'::uuid, 'stripe timeout', 30
      ) as ok
    `);
    expect(currentRelease.rows[0].ok).toBe(true);
    const row = await db.query(`
      select recovery_lease_token, recovery_lease_expires_at,
             recovery_last_error, recovery_next_attempt_at > now() as backed_off
        from public.payment_refund_obligations
       where payment_intent_id = 'pi_recovery'
    `);
    expect(row.rows[0]).toEqual({
      recovery_lease_token: null,
      recovery_lease_expires_at: null,
      recovery_last_error: 'stripe timeout',
      backed_off: true,
    });
    expect(await claim(1, 30)).toEqual([]);
  });

  it('claims the original request identity after nullable context fills and is deleted', async () => {
    await record({
      paymentIntentId: 'pi_mutable_context',
      reason: 'first_delivery_reason',
      checkoutSessionId: null,
    });
    await record({
      paymentIntentId: 'pi_mutable_context',
      // A later Checkout delivery may fill this link and carry a different
      // explanation, but neither may change Stripe replay parameters.
      reason: 'later_delivery_reason',
      checkoutSessionId: 'cs_filled_later',
    });
    await db.exec(`delete from auth.users where id = '${USER}'`);

    const [leased] = await claim(1, 30);
    expect(leased).toMatchObject({
      payment_intent_id: 'pi_mutable_context',
      purpose: 'auto_reload_unfulfilled',
      amount_cents: 459,
      reason: 'first_delivery_reason',
      checkout_session_id: 'cs_filled_later',
      user_id: null,
      attempt_id: null,
      stripe_idempotency_key:
        'auto-reload-unfulfilled-refund-pi_mutable_context',
    });
  });

  it('claims requires_action as retryable but never claims a terminal obligation', async () => {
    await record({
      status: 'requires_action',
      stripeRefundId: 're_action',
      stripeEventCreatedAt: '2026-07-24T12:00:00.000Z',
    });
    await record({
      paymentIntentId: 'pi_done',
      status: 'succeeded',
      stripeRefundId: 're_done',
      userId: null,
      attemptId: null,
    });

    const rows = await claim(10, 30);
    expect(rows.map((row) => row.payment_intent_id)).toEqual(['pi_recovery']);
    expect(rows[0].status).toBe('requires_action');
  });

  it('advances an event-derived pending snapshot from a live retrieve without masking newer events', async () => {
    const claimedEventAt = '2026-07-24T12:00:00.000Z';
    await record({
      status: 'pending',
      stripeRefundId: 're_live_reconcile',
      stripeEventCreatedAt: claimedEventAt,
    });
    const [leased] = await claim(1, 30);
    expect(leased.stripe_refund_id).toBe('re_live_reconcile');
    expect(new Date(leased.stripe_event_created_at).toISOString())
      .toBe(claimedEventAt);

    // The worker's refunds.retrieve() says succeeded. It replays the exact
    // event timestamp snapshot returned by its claim, so 177's equal-timestamp
    // safety rank advances pending -> succeeded without fabricating a later
    // Stripe event.
    const reconciled = await record({
      status: 'succeeded',
      stripeRefundId: 're_live_reconcile',
      stripeEventCreatedAt: claimedEventAt,
    });
    expect(reconciled.status).toBe('succeeded');

    // If a genuinely newer lifecycle event wins after claim, replaying the old
    // claimed timestamp cannot overwrite it.
    const newerFailure = await record({
      status: 'failed',
      stripeRefundId: 're_live_reconcile',
      failureReason: 'bank_declined',
      stripeEventCreatedAt: '2026-07-24T12:01:00.000Z',
    });
    expect(newerFailure.status).toBe('failed');
    const staleWorker = await record({
      status: 'succeeded',
      stripeRefundId: 're_live_reconcile',
      stripeEventCreatedAt: claimedEventAt,
    });
    expect(staleWorker.status).toBe('failed');
    expect(staleWorker.failure_reason).toBe('bank_declined');
  });

  it('preserves event ordering and makes a terminal checkpoint dormant on release', async () => {
    await record();
    const [leased] = await claim(1, 30);
    const eventResult = await record({
      status: 'succeeded',
      stripeRefundId: 're_event_won',
      stripeEventCreatedAt: '2026-07-24T12:00:00.000Z',
    });
    expect(eventResult.status).toBe('succeeded');

    // Models the worker's eventless synchronous observation arriving after the
    // webhook. Migration 177 must keep the event-derived terminal state.
    const workerObservation = await record({
      status: 'pending',
      stripeRefundId: 're_event_won',
    });
    expect(workerObservation.status).toBe('succeeded');

    const released = await db.query(`
      select public.release_payment_refund_obligation_lease(
        'pi_recovery', '${leased.lease_token}'::uuid, null, 30
      ) as ok
    `);
    expect(released.rows[0].ok).toBe(true);
    const final = await db.query(`
      select status, stripe_event_created_at, recovery_next_attempt_at,
             recovery_lease_token, recovery_last_error
        from public.payment_refund_obligations
       where payment_intent_id = 'pi_recovery'
    `);
    expect(final.rows[0].status).toBe('succeeded');
    expect(new Date(final.rows[0].stripe_event_created_at).toISOString())
      .toBe('2026-07-24T12:00:00.000Z');
    expect(final.rows[0].recovery_next_attempt_at).toBeNull();
    expect(final.rows[0].recovery_lease_token).toBeNull();
    expect(final.rows[0].recovery_last_error).toBeNull();
  });

  it('is service-role-only at both the SQL grant and in-function role gates', async () => {
    const privileges = await db.query(`
      select
        has_function_privilege(
          'service_role',
          'public.claim_payment_refund_obligations(integer,integer)',
          'EXECUTE'
        ) service_claim,
        has_function_privilege(
          'authenticated',
          'public.claim_payment_refund_obligations(integer,integer)',
          'EXECUTE'
        ) user_claim,
        has_function_privilege(
          'service_role',
          'public.release_payment_refund_obligation_lease(text,uuid,text,integer)',
          'EXECUTE'
        ) service_release,
        has_function_privilege(
          'authenticated',
          'public.release_payment_refund_obligation_lease(text,uuid,text,integer)',
          'EXECUTE'
        ) user_release
    `);
    expect(privileges.rows[0]).toEqual({
      service_claim: true,
      user_claim: false,
      service_release: true,
      user_release: false,
    });

    await asRole('authenticated');
    await expect(db.query(`
      select * from public.claim_payment_refund_obligations(1, 30)
    `)).rejects.toThrow(/service-role only/);
    await expect(db.query(`
      select public.release_payment_refund_obligation_lease(
        'pi_missing', gen_random_uuid(), null, 30
      )
    `)).rejects.toThrow(/service-role only/);
  });
});
