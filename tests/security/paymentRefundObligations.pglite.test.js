/**
 * Net-current durable payment-refund obligations (migration 177).
 *
 * Applies the complete migration to PGlite and exercises the real RPC rather
 * than a copied SQL model. The tests cover service-only posture, generic
 * Checkout and auto-reload contexts, immutable/fill-once identity, and the
 * status ordering required when a synchronous handler races unordered Stripe
 * events.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const migrationPath = resolve(
  process.cwd(),
  'supabase/migrations/177_payment_refund_obligations.sql',
);
const migration = readFileSync(migrationPath, 'utf8');

const USER = '11111111-1111-1111-1111-111111111111';
const OTHER_USER = '22222222-2222-2222-2222-222222222222';
const ATTEMPT = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const OTHER_ATTEMPT = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';

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

    insert into auth.users (id) values ('${USER}'), ('${OTHER_USER}');
    insert into public.credit_auto_reload_attempts (id, user_id)
      values ('${ATTEMPT}', '${USER}'), ('${OTHER_ATTEMPT}', '${OTHER_USER}');
  `);
  await next.exec(migration);
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
    paymentIntentId: 'pi_auto_reload',
    purpose: 'auto_reload_unfulfilled',
    amountCents: 459,
    currency: 'USD',
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

async function read(paymentIntentId = 'pi_auto_reload') {
  const { rows } = await db.query(
    `select * from public.payment_refund_obligations
      where payment_intent_id = $1`,
    [paymentIntentId],
  );
  return rows[0] ?? null;
}

/**
 * Wall-clock ceiling for the hook that boots PGlite. A hook timeout is a
 * DEADLOCK GUARD, not a performance budget: the inherited 10000ms default sits
 * exactly on pglite's boot-noise band under gate load (measured 2026-07-27:
 * failing hooks 11.2-20.7s, passing hooks 8.6-10.0s), so an untimed hook goes
 * FLAKY red and the tests it feeds never execute. This beforeEach builds a
 * FRESH database per test, so every single test pays the full cold-boot cost.
 * Never tune this to a measurement (that is how a previous 30000ms went
 * brittle); generous is the point. Kept in step with the sibling suites
 * (tierCreditMultiplierSql, surveyorProbeTierSql) and enforced by
 * tests/security/pgliteHookTimeoutRatchet.test.js.
 */
const PGLITE_BOOT_TIMEOUT_MS = 180_000;

beforeEach(async () => {
  db = await makeDb();
}, PGLITE_BOOT_TIMEOUT_MS);

describe('migration 177 durable payment refund obligations', () => {
  it('applies the full schema with RLS and an RPC-only service-role mutation posture', async () => {
    const { rows } = await db.query(`
      select
        c.relrowsecurity as rls_enabled,
        (
          select count(*)::int
            from pg_policies
           where schemaname = 'public'
             and tablename = 'payment_refund_obligations'
        ) as policy_count,
        has_table_privilege(
          'service_role',
          'public.payment_refund_obligations',
          'SELECT'
        ) as service_select,
        has_table_privilege(
          'service_role',
          'public.payment_refund_obligations',
          'INSERT'
        ) as service_insert,
        has_table_privilege(
          'authenticated',
          'public.payment_refund_obligations',
          'SELECT'
        ) as user_select,
        has_function_privilege(
          'service_role',
          'public.record_payment_refund_obligation(text,text,integer,text,text,text,text,text,uuid,uuid,text,timestamptz,timestamptz)',
          'EXECUTE'
        ) as service_rpc,
        has_function_privilege(
          'authenticated',
          'public.record_payment_refund_obligation(text,text,integer,text,text,text,text,text,uuid,uuid,text,timestamptz,timestamptz)',
          'EXECUTE'
        ) as user_rpc
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public'
        and c.relname = 'payment_refund_obligations'
    `);
    expect(rows[0]).toEqual({
      rls_enabled: true,
      policy_count: 0,
      service_select: true,
      service_insert: false,
      user_select: false,
      service_rpc: true,
      user_rpc: false,
    });
  });

  it('records an auto-reload obligation and normalizes its stable money identity', async () => {
    const result = await record();
    expect(result).toMatchObject({
      payment_intent_id: 'pi_auto_reload',
      stripe_refund_id: null,
      checkout_session_id: null,
      user_id: USER,
      attempt_id: ATTEMPT,
      purpose: 'auto_reload_unfulfilled',
      amount_cents: 459,
      currency: 'usd',
      reason: 'attempt_mismatch',
      status: 'pending',
      failure_reason: null,
      stripe_event_created_at: null,
      resolved_at: null,
    });
  });

  it('moves handler pending to succeeded but a late handler pending cannot regress it', async () => {
    await record();
    const succeeded = await record({
      status: 'succeeded',
      stripeRefundId: 're_handler_success',
    });
    expect(succeeded.status).toBe('succeeded');
    expect(succeeded.resolved_at).not.toBeNull();

    const latePending = await record({
      status: 'pending',
      stripeRefundId: 're_handler_success',
    });
    expect(latePending.status).toBe('succeeded');
    expect(latePending.stripe_refund_id).toBe('re_handler_success');
    expect(latePending.resolved_at).toBe(succeeded.resolved_at);
  });

  it('uses safety precedence for equal-second Stripe events and rejects older/eventless regressions', async () => {
    await record({
      status: 'pending',
      stripeRefundId: 're_async',
      stripeEventCreatedAt: '2026-07-24T12:00:00.000Z',
    });
    const failed = await record({
      status: 'failed',
      stripeRefundId: 're_async',
      failureReason: 'bank_declined',
      // Stripe event.created has only second resolution. A same-second failure
      // must outrank success rather than becoming permanently invisible.
      stripeEventCreatedAt: '2026-07-24T12:00:00.000Z',
    });
    expect(failed.status).toBe('failed');
    expect(failed.failure_reason).toBe('bank_declined');
    expect(new Date(failed.stripe_event_created_at).toISOString())
      .toBe('2026-07-24T12:00:00.000Z');

    const older = await record({
      status: 'succeeded',
      stripeRefundId: 're_async',
      stripeEventCreatedAt: '2026-07-24T11:59:00.000Z',
    });
    expect(older.status).toBe('failed');
    expect(older.failure_reason).toBe('bank_declined');

    const eventless = await record({
      status: 'succeeded',
      stripeRefundId: 're_async',
    });
    expect(eventless.status).toBe('failed');
    expect(eventless.failure_reason).toBe('bank_declined');
  });

  it('requires a Stripe refund identity before any terminal outcome can close the row', async () => {
    await record();
    await expect(record({
      status: 'succeeded',
      stripeRefundId: null,
    })).rejects.toThrow(/stripe_refund_id is required/);
    expect((await read()).status).toBe('pending');
  });

  it('lets event-derived nonterminal status outrank handler observations', async () => {
    await record({
      status: 'requires_action',
      stripeRefundId: 're_action',
      stripeEventCreatedAt: '2026-07-24T12:00:00.000Z',
    });
    const handlerPending = await record({
      status: 'pending',
      stripeRefundId: 're_action',
    });
    expect(handlerPending.status).toBe('requires_action');

    const newerPending = await record({
      status: 'pending',
      stripeRefundId: 're_action',
      stripeEventCreatedAt: '2026-07-24T12:02:00.000Z',
    });
    expect(newerPending.status).toBe('pending');
    expect(newerPending.resolved_at).toBeNull();
  });

  it('supports a generic deleted-account Checkout with nullable account/attempt links', async () => {
    const row = await record({
      paymentIntentId: 'pi_late_checkout',
      purpose: 'deleted_account_subscription_checkout',
      amountCents: 1200,
      reason: 'account_deleted_before_checkout_completion',
      checkoutSessionId: 'cs_late',
      userId: null,
      attemptId: null,
    });
    expect(row).toMatchObject({
      payment_intent_id: 'pi_late_checkout',
      checkout_session_id: 'cs_late',
      user_id: null,
      attempt_id: null,
      purpose: 'deleted_account_subscription_checkout',
      amount_cents: 1200,
      currency: 'usd',
      status: 'pending',
    });
  });

  it('converges subscription-start invoice and Checkout delivery in either order', async () => {
    await record({
      paymentIntentId: 'pi_invoice_first',
      purpose: 'deleted_account_checkout',
      amountCents: 1200,
      reason: 'account_inactive_before_checkout_fulfillment',
      checkoutSessionId: null,
      userId: USER,
      attemptId: null,
    });
    const invoiceFirstFilled = await record({
      paymentIntentId: 'pi_invoice_first',
      purpose: 'deleted_account_checkout',
      amountCents: 1200,
      reason: 'account_inactive_before_checkout_fulfillment',
      checkoutSessionId: 'cs_invoice_first',
      userId: USER,
      attemptId: null,
    });
    expect(invoiceFirstFilled.checkout_session_id).toBe('cs_invoice_first');

    await record({
      paymentIntentId: 'pi_checkout_first',
      purpose: 'deleted_account_checkout',
      amountCents: 1200,
      reason: 'account_inactive_before_checkout_fulfillment',
      checkoutSessionId: 'cs_checkout_first',
      userId: USER,
      attemptId: null,
    });
    const checkoutFirstRepeated = await record({
      paymentIntentId: 'pi_checkout_first',
      purpose: 'deleted_account_checkout',
      amountCents: 1200,
      reason: 'account_inactive_before_checkout_fulfillment',
      checkoutSessionId: null,
      userId: USER,
      attemptId: null,
    });
    expect(checkoutFirstRepeated.checkout_session_id).toBe('cs_checkout_first');

    const { rows } = await db.query(`
      select payment_intent_id, count(*)::int as obligation_count
        from public.payment_refund_obligations
       where payment_intent_id in ('pi_invoice_first', 'pi_checkout_first')
       group by payment_intent_id
       order by payment_intent_id
    `);
    expect(rows).toEqual([
      { payment_intent_id: 'pi_checkout_first', obligation_count: 1 },
      { payment_intent_id: 'pi_invoice_first', obligation_count: 1 },
    ]);
  });

  it('fills nullable context once and rejects conflicting immutable identity', async () => {
    await record({
      paymentIntentId: 'pi_fill_later',
      userId: null,
      attemptId: null,
      checkoutSessionId: null,
    });
    const filled = await record({
      paymentIntentId: 'pi_fill_later',
      stripeRefundId: 're_fill_later',
      userId: USER,
      attemptId: ATTEMPT,
      checkoutSessionId: 'cs_fill_later',
      // Later delivery may explain the same obligation differently. The
      // canonical first-write reason remains the Stripe replay input.
      reason: 'later_delivery_context',
    });
    expect(filled).toMatchObject({
      stripe_refund_id: 're_fill_later',
      checkout_session_id: 'cs_fill_later',
      user_id: USER,
      attempt_id: ATTEMPT,
      reason: 'attempt_mismatch',
    });

    await expect(record({
      paymentIntentId: 'pi_fill_later',
      stripeRefundId: 're_different',
      userId: OTHER_USER,
      attemptId: OTHER_ATTEMPT,
      checkoutSessionId: 'cs_different',
    })).rejects.toThrow(/conflicting immutable refund identity/);
    await expect(record({
      paymentIntentId: 'pi_fill_later',
      amountCents: 460,
    })).rejects.toThrow(/conflicting immutable refund identity/);
  });

  it('enforces global Stripe refund identity uniqueness', async () => {
    await record({
      paymentIntentId: 'pi_first',
      stripeRefundId: 're_unique',
    });
    await expect(record({
      paymentIntentId: 'pi_second',
      stripeRefundId: 're_unique',
    })).rejects.toThrow(/unique|duplicate/i);
  });

  it('preserves the financial obligation while deleted foreign records become null', async () => {
    await record({ stripeRefundId: 're_survives' });
    await db.exec(`delete from auth.users where id = '${USER}'`);
    const row = await read();
    expect(row).toMatchObject({
      payment_intent_id: 'pi_auto_reload',
      stripe_refund_id: 're_survives',
      user_id: null,
      attempt_id: null,
      status: 'pending',
    });
  });

  it('rejects non-service callers before any obligation can be written', async () => {
    await asRole('authenticated');
    await expect(db.query(`
      select public.record_payment_refund_obligation(
        'pi_forbidden', 'auto_reload_unfulfilled', 459, 'usd',
        'attempt_mismatch', 'pending'
      )
    `)).rejects.toThrow(/service-role only/);
    expect(await read('pi_forbidden')).toBeNull();
  });
});
