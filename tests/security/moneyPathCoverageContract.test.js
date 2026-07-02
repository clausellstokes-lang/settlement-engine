import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, test, expect } from 'vitest';

/**
 * moneyPathCoverageContract.test.js — anti-rot guard for the money-path coverage STORY.
 *
 * The revenue path is covered on three legs that only make sense together:
 *   1. supabase/functions/stripe-webhook/index.test.ts — the trust boundary (Deno):
 *      runs the real handler against forged vs. signed requests + at-least-once redelivery.
 *   2. tests/security/moneyPathJourney.pglite.test.js — the composed chain (CI, pglite):
 *      webhook grant → AI spend → failure refund → re-spend → monthly allowance, against
 *      the real PL/pgSQL bodies, idempotent at every grant.
 *   3. e2e/flow-b-auth-credits-ai.spec.js — the live browser journey it all stands in
 *      for, which CANNOT run in CI (needs a test Stripe + Supabase project + secrets).
 *
 * Leg 3 never runs in CI, so it can rot silently — deleted or gutted to a stub — and the
 * "the pglite journey is the CI mirror of the documented Playwright flow" claim in leg 2's
 * header would quietly become a lie. This asserts all three legs exist and still carry
 * their load-bearing money-path tokens (the STABLE API/boundary identifiers, not prose),
 * so removing or hollowing any leg fails the gate. It is coverage-of-the-coverage, in the
 * same spirit as the enforcement-claims meta-test.
 */

const REPO = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (rel) => {
  const p = join(REPO, rel);
  expect(existsSync(p), `money-path coverage leg is missing: ${rel}`).toBe(true);
  return readFileSync(p, 'utf8');
};
// Every token here is a real RPC name or HTTP-boundary string the handler emits — it
// changes only if the money API itself changes, never on a reword.
const requireAll = (src, rel, tokens) => {
  for (const t of tokens) {
    expect(src.includes(t), `${rel} must still exercise "${t}" (money-path coverage regressed)`).toBe(true);
  }
};

describe('money-path coverage contract — all three legs present and load-bearing', () => {
  test('leg 1: the stripe-webhook trust boundary test proves signature-gating + idempotent grants', () => {
    const rel = 'supabase/functions/stripe-webhook/index.test.ts';
    const src = read(rel);
    requireAll(src, rel, ['Missing signature', 'Invalid signature', 'system_grant_credits', 'does NOT double-grant']);
    expect(src.split('\n').length, `${rel} looks gutted`).toBeGreaterThan(120);
  });

  test('leg 2: the composed pglite journey exercises grant → spend → refund with idempotency', () => {
    const rel = 'tests/security/moneyPathJourney.pglite.test.js';
    const src = read(rel);
    requireAll(src, rel, [
      'system_grant_credits', 'spend_credits', 'refund_credits',
      'stripe_session_id', 'stripe_invoice_id',
      'grantCount', 'balanceOf',
    ]);
    // The redelivery-idempotency assertion is the whole point — a redelivered grant must not double-credit.
    expect(/does not double|MUST NOT double|idempotent/i.test(src), `${rel} lost its redelivery-idempotency assertion`).toBe(true);
  });

  test('leg 3: the secrets-gated e2e spec still documents the live money journey (cannot be silently gutted)', () => {
    const rel = 'e2e/flow-b-auth-credits-ai.spec.js';
    const src = read(rel);
    // The old token set ('credit'/'Stripe'/'webhook'/'narrative') all occur in
    // COMMENTS and describe-titles, so a gutted spec that kept only its header
    // prose would still pass. Anchor instead on the STABLE boundary/API strings
    // and driver calls that ONLY exist inside the live test BODIES — hollowing a
    // body drops these even if the comment shell survives.
    requireAll(src, rel, [
      '4242 4242 4242 4242',    // the Stripe test card the checkout body fills — body-only
      'get_credit_balance',     // the ledger-backed balance the body polls
      'Generate Narrative',     // the AI-spend chokepoint the body clicks
      'settledBalance',         // driver helper the live bodies call
      'readBalance',            // driver helper the live bodies call
    ]);
    // The two load-bearing live cases must both be present (checkout→grant→spend
    // decrement, and AI-failure refund) — the spec's whole reason to exist.
    expect(
      src.includes('decrements the real balance'),
      `${rel} lost the checkout→grant→AI-spend decrement case`,
    ).toBe(true);
    expect(
      src.includes('refunds the reserved credits'),
      `${rel} lost the AI-failure refund case`,
    ).toBe(true);
    expect(src.split('\n').length, `${rel} looks gutted`).toBeGreaterThan(80);
  });
});
