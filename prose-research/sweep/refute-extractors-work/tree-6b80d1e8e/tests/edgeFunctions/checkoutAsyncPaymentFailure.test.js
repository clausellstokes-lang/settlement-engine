/**
 * Delayed Checkout payment lifecycle contract.
 *
 * Checkout payment methods are controlled by Stripe when create-checkout omits
 * a method allowlist, so the webhook must handle both terminal async outcomes:
 * success fulfils through the normal paid branch; failure releases pre-payment
 * reservations without granting anything.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const source = readFileSync(
  resolve(process.cwd(), 'supabase', 'functions', 'stripe-webhook', 'index.ts'),
  'utf8',
);
const dispatchStart = source.indexOf('async function dispatchStripeEvent');
const dispatch = source.slice(dispatchStart);
const failureStart = dispatch.indexOf("case 'checkout.session.async_payment_failed'");
const expiredStart = dispatch.indexOf("case 'checkout.session.expired'");
const failureBranch = dispatch.slice(failureStart, expiredStart);

describe('delayed Checkout payment terminal events', () => {
  it('keeps async success paired with the paid checkout fulfilment branch', () => {
    expect(dispatch).toMatch(
      /case 'checkout\.session\.completed':\s*case 'checkout\.session\.async_payment_succeeded':/,
    );
    expect(dispatch).toContain("if (session.payment_status === 'unpaid')");
  });

  it('releases both session-bound reservations on async payment failure', () => {
    expect(failureStart).toBeGreaterThan(-1);
    expect(expiredStart).toBeGreaterThan(failureStart);
    expect(failureBranch).toContain("supabase.rpc('revert_redemption'");
    expect(failureBranch).toContain('p_session_id: failed.id');
    expect(failureBranch).toContain("supabase.rpc('transfer_case_regress_awaiting_payment'");
    expect(failureBranch).toContain('p_session: failed.id');
  });

  it('fails into Stripe retry on release errors and never fulfils in the failure branch', () => {
    expect(failureBranch).toContain('if (revertErr)');
    expect(failureBranch).toContain('if (regressErr)');
    expect(failureBranch).toMatch(/if \(revertErr\)[\s\S]*throw new Error/);
    expect(failureBranch).toMatch(/if \(regressErr\)[\s\S]*throw new Error/);
    expect(failureBranch).not.toContain('applyRedemptionIfBound');
    expect(failureBranch).not.toContain('grantCredits');
    expect(failureBranch).not.toContain('mirrorCheckoutMoneyEvent');
  });
});
