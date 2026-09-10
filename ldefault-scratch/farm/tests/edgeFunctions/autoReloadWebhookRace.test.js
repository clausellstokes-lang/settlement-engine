/**
 * Structural companion to the executable Deno regression in
 * stripe-webhook/index.test.ts. This runs in the default Vitest gate and pins the
 * race-closing order even on machines without Deno.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const source = readFileSync(
  resolve(process.cwd(), 'supabase', 'functions', 'stripe-webhook', 'index.ts'),
  'utf8',
);
const triggerSource = readFileSync(
  resolve(process.cwd(), 'supabase', 'functions', '_shared', 'autoReload.ts'),
  'utf8',
);
const claimMigration = readFileSync(
  resolve(
    process.cwd(),
    'supabase',
    'migrations',
    '176_auto_reload_payment_intent_claim.sql',
  ),
  'utf8',
);
const succeededStart = source.indexOf('async function handleAutoReloadSucceeded');
const failedStart = source.indexOf('async function handleAutoReloadFailed');
const succeeded = source.slice(succeededStart, failedStart);
const failed = source.slice(failedStart, source.indexOf('async function dispatchStripeEvent'));

describe('auto-reload webhook event-before-stamp race', () => {
  it('rejects a non-USD starter price before claiming an attempt or creating a charge', () => {
    const currencyGuard = triggerSource.indexOf('currency !== AUTO_RELOAD_CURRENCY');
    // Pin the money-moving operations, not their formatting or the local name of
    // the injected Stripe client. The executable Deno suite owns runtime behavior;
    // this companion keeps the safety order visible in the default Vitest gate.
    const claim = triggerSource.search(
      /admin\.rpc\(\s*['"]claim_auto_reload_attempt['"]/,
    );
    const charge = triggerSource.indexOf('paymentIntents.create');
    expect(currencyGuard).toBeGreaterThan(-1);
    expect(claim).toBeGreaterThan(currencyGuard);
    expect(charge).toBeGreaterThan(claim);
    expect(triggerSource).toContain('currency: AUTO_RELOAD_CURRENCY');
  });

  it('rechecks account activity after async payment-method lookup and before charging', () => {
    const paymentMethod = triggerSource.indexOf("if (!paymentMethod)");
    const activeGate = triggerSource.indexOf("'account_is_active'", paymentMethod);
    const charge = triggerSource.indexOf('paymentIntents.create', activeGate);
    expect(paymentMethod).toBeGreaterThan(-1);
    expect(activeGate).toBeGreaterThan(paymentMethod);
    expect(charge).toBeGreaterThan(activeGate);
    expect(triggerSource).toContain("stillActive !== true");
    expect(triggerSource).toContain("'account_inactive'");
  });

  it('loads and validates metadata.attempt_id before binding or granting', () => {
    expect(succeededStart).toBeGreaterThan(-1);
    const lookup = succeeded.indexOf('readAutoReloadAttempt(supabase, attemptId');
    const bind = succeeded.indexOf('claimAutoReloadPaymentIntent(');
    const grant = succeeded.indexOf("await grantCredits(supabase, userId, credits, 'auto_reload'");
    expect(lookup).toBeGreaterThan(-1);
    expect(bind).toBeGreaterThan(lookup);
    expect(grant).toBeGreaterThan(bind);
    expect(succeeded).toContain('autoReloadAttemptMatches(attempt, userId, pi, credits, true)');
  });

  it('refunds a charge if account deletion wins before webhook fulfillment', () => {
    const lookup = succeeded.indexOf('readAutoReloadAttempt(supabase, attemptId');
    const activeGate = succeeded.indexOf('billingAccountIsActive(', lookup);
    const refund = succeeded.indexOf('await refundUnfulfilledAutoReloadPayment(', activeGate);
    const grant = succeeded.indexOf("await grantCredits(supabase, userId, credits, 'auto_reload'");
    expect(activeGate).toBeGreaterThan(lookup);
    expect(refund).toBeGreaterThan(activeGate);
    expect(grant).toBeGreaterThan(refund);
    expect(succeeded).toContain("'account_inactive'");
  });

  it('requires exact USD collection before the attempt can bind or grant', () => {
    expect(source).toContain("const DEFAULT_PAYMENT_CURRENCY = 'usd'");
    expect(source).toContain('pi.currency?.toLowerCase() !== DEFAULT_PAYMENT_CURRENCY');
    expect(source).toContain('attempt.amount_cents !== pi.amount');
    expect(source).toContain('attempt.amount_cents !== pi.amount_received');
    const match = succeeded.indexOf('autoReloadAttemptMatches(attempt, userId, pi, credits, true)');
    const bind = succeeded.indexOf('claimAutoReloadPaymentIntent(');
    const grant = succeeded.indexOf("await grantCredits(supabase, userId, credits, 'auto_reload'");
    expect(match).toBeGreaterThan(-1);
    expect(bind).toBeGreaterThan(match);
    expect(grant).toBeGreaterThan(bind);
  });

  it('atomically claims null-or-same PI identity before completing the exact bound row', () => {
    expect(claimMigration).toMatch(
      /stripe_payment_intent_id is null\s+or stripe_payment_intent_id = p_payment_intent/s,
    );
    expect(claimMigration).toMatch(
      /user_id = p_user[\s\S]*amount_cents = p_amount_cents[\s\S]*credits_delta = p_credits_delta/,
    );
    expect(succeeded).not.toContain(".update({ stripe_payment_intent_id: pi.id })");
    expect(succeeded).toMatch(
      /\.eq\('id', attemptId\)\s*\.eq\('user_id', userId\)\s*\.eq\('stripe_payment_intent_id', pi\.id\)/s,
    );
    expect(succeeded).toContain('if (completeErr) throw new Error');
  });

  it('refunds every succeeded PI that loses identity validation or the atomic claim', () => {
    const refundHelper = source.indexOf('async function refundUnfulfilledAutoReloadPayment');
    const mismatchRefund = succeeded.indexOf('await refundUnfulfilledAutoReloadPayment(');
    const lostClaim = succeeded.indexOf('if (!binding.ok)');
    const lostClaimRefund = succeeded.indexOf('await refundUnfulfilledAutoReloadPayment(', lostClaim);
    expect(refundHelper).toBeGreaterThan(-1);
    expect(source).toContain('auto-reload-unfulfilled-refund-${pi.id}');
    expect(source).toContain('function refundLedgerEventKey(');
    expect(source).toContain("purpose === 'auto_reload_unfulfilled'");
    expect(source).toContain('`refund:auto-reload:${paymentIntentId}`');
    expect(source).toContain('`refund:unfulfilled:${paymentIntentId}`');
    expect(source).toContain('event_key: refundLedgerEventKey(context.purpose, context.paymentIntentId)');
    expect(mismatchRefund).toBeGreaterThan(-1);
    expect(lostClaim).toBeGreaterThan(mismatchRefund);
    expect(lostClaimRefund).toBeGreaterThan(lostClaim);
  });

  it('the trigger uses the same atomic claim and never directly stamps a PI id', () => {
    expect(triggerSource).toContain("admin.rpc('claim_auto_reload_payment_intent'");
    expect(triggerSource).not.toMatch(
      /\.update\(\{\s*stripe_payment_intent_id:\s*pi\??\.id/,
    );
  });

  it('also resolves a payment_failed event by validated attempt metadata', () => {
    expect(failedStart).toBeGreaterThan(-1);
    expect(failed).toContain('readAutoReloadAttempt(supabase, attemptId');
    expect(failed).toContain('claimAutoReloadPaymentIntent(');
    expect(failed).toMatch(
      /\.eq\('id', attemptId\)\s*\.eq\('user_id', userId\)\s*\.eq\('stripe_payment_intent_id', pi\.id\)\s*\.in\('state', AUTO_RELOAD_FAILURE_TRANSITION_STATES\)/s,
    );
    expect(failed).toContain('if (failErr) throw new Error');
  });
});
