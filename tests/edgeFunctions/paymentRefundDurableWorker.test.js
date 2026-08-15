/**
 * Default-gate structural contract for the migration-180 refund reconciler.
 *
 * SQL behavior is executed by paymentRefundRecovery.pglite.test.js. These pins
 * keep the Edge trust boundary and Stripe crash-recovery sequence visible on
 * machines where the optional Deno behavior suite is unavailable.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (...parts) =>
  readFileSync(resolve(process.cwd(), ...parts), 'utf8');
const worker = read('supabase/functions/payment-refund-worker/index.ts');
const shared = read(
  'supabase/functions/_shared/paymentRefundRecovery.ts',
);
const refundRequest = read(
  'supabase/functions/_shared/paymentRefundRequest.ts',
);
const migration = read(
  'supabase/migrations/180_payment_refund_obligation_recovery.sql',
);
const webhook = read('supabase/functions/stripe-webhook/index.ts');

describe('durable payment-refund recovery worker', () => {
  it('reuses each existing producer idempotency key exactly', () => {
    const mappings = [
      [
        'auto_reload_unfulfilled',
        'auto-reload-unfulfilled-refund-',
      ],
      [
        'deleted_account_checkout',
        'deleted-account-checkout-refund-',
      ],
      [
        'deleted_account_invoice',
        'deleted-account-invoice-refund-',
      ],
    ];
    for (const [purpose, prefix] of mappings) {
      expect(migration).toContain(`when '${purpose}'`);
      expect(migration).toContain(`then '${prefix}' || payment_intent_id`);
      expect(webhook).toContain(prefix);
    }
    expect(shared).toContain(
      '{ idempotencyKey: job.stripe_idempotency_key }',
    );
  });

  it('builds replay parameters only from canonical immutable obligation identity', () => {
    expect(webhook).toContain(
      'metadata: buildPaymentRefundRequestMetadata(prior)',
    );
    expect(shared).toContain(
      'metadata: buildPaymentRefundRequestMetadata(job)',
    );
    for (const field of [
      'refund_purpose',
      'payment_intent_id',
      'obligation_amount_cents',
      'reason',
    ]) {
      expect(refundRequest).toContain(field);
    }
    expect(refundRequest).not.toMatch(
      /supabase_user_id\s*:|attempt_id\s*:|checkout_session_id\s*:/,
    );
  });

  it('coalesces Checkout and subscription-create invoice delivery onto one refund identity', () => {
    const start = webhook.indexOf('async function handleInactiveAccountInvoice');
    const end = webhook.indexOf('async function handleInactiveAccountSubscription', start);
    const handler = webhook.slice(start, end);
    expect(handler).toContain(
      "invoice.billing_reason === 'subscription_create'",
    );
    expect(handler).toContain("? 'deleted_account_checkout'");
    expect(handler).toContain(
      '? `deleted-account-checkout-refund-${paymentIntentId}`',
    );
    expect(handler).toContain(": 'deleted_account_invoice'");
  });

  it('recovers both lost-create responses and already-linked nonterminal refunds', () => {
    const retrieve = shared.indexOf(
      'stripeApi.refunds.retrieve(job.stripe_refund_id)',
    );
    const create = shared.indexOf('stripeApi.refunds.create(');
    const process = shared.indexOf(
      'async function processClaimedRefundObligation(',
    );
    const observe = shared.indexOf(
      'const observation = await createOrRetrieveRefund(stripeApi, job)',
      process,
    );
    const record = shared.indexOf('await recordObservedStatus(', observe);
    const release = shared.indexOf('await releaseLease(', record);
    expect(retrieve).toBeGreaterThan(-1);
    expect(create).toBeGreaterThan(-1);
    expect(observe).toBeGreaterThan(process);
    expect(record).toBeGreaterThan(observe);
    expect(release).toBeGreaterThan(record);
    expect(shared).toContain('charge_already_refunded');
    expect(shared).toContain('refundedCents < job.amount_cents');
  });

  it('keeps lifecycle status behind migration 177 ordering instead of direct writes', () => {
    expect(shared).toContain('"record_payment_refund_obligation"');
    expect(shared).toContain(
      'p_stripe_event_created_at: reconciliationEventFloor',
    );
    expect(shared).toMatch(
      /authoritativeReconciliation[\s\S]*?\? job\.stripe_event_created_at[\s\S]*?: null/,
    );
    expect(shared).not.toMatch(
      /\.from\(["']payment_refund_obligations["']\)/,
    );
    expect(migration).toContain(
      'lifecycle status remains owned by record_payment_refund_obligation',
    );
    expect(migration).not.toMatch(
      /release_payment_refund_obligation_lease[\s\S]*?set\s+status\s*=/i,
    );
  });

  it('uses the claimed event floor to advance stale pending snapshots without outranking a newer event', () => {
    expect(migration).toContain(
      'obligation.stripe_event_created_at',
    );
    expect(migration).toContain(
      'equal-timestamp safety rank advances pending/requires_action -> terminal',
    );
    expect(shared).toContain(
      'return { refund, authoritativeReconciliation: true }',
    );
    expect(shared).toContain(
      'authoritativeReconciliation: false',
    );
  });

  it('claims only due nonterminal rows with expiring tokenized SKIP LOCKED leases', () => {
    expect(migration).toMatch(
      /status in \('pending', 'requires_action'\)[\s\S]*?recovery_next_attempt_at[\s\S]*?recovery_lease_expires_at[\s\S]*?for update of obligation skip locked/i,
    );
    expect(migration).toContain('recovery_lease_token = gen_random_uuid()');
    expect(migration).toContain(
      'obligation.recovery_lease_token = p_lease_token',
    );
    expect(migration).toContain(
      'recovery_attempts = obligation.recovery_attempts + 1',
    );
  });

  it('uses a high-entropy cron secret plus a private kill switch and inert dispatch seed', () => {
    expect(worker).toContain(
      'timingSafeEqualText(providedSecret, expectedSecret)',
    );
    expect(worker).toContain('PAYMENT_REFUND_CRON_SECRET');
    expect(worker).toContain('"payment_refund_recovery_cron"');
    expect(worker).not.toContain('botGuard(');
    expect(migration).toMatch(
      /'payment_refund_recovery_cron', jsonb_build_object\([\s\S]*?'url', null[\s\S]*?'secret', null/,
    );
    expect(migration).toContain(
      '$job$select public.run_payment_refund_recovery();$job$',
    );
  });
});
