/**
 * index.test.ts — EXECUTION test of the verify-single-dossier money gate (review B16 #3).
 *
 * Deno test (runs under the `deno-tests` CI job / `deno task test:edge`, NOT vitest).
 * This is the ONLY server check before a paid single-dossier PDF is released, and
 * the only throttle in front of an attacker-amplifiable Stripe API call. It runs
 * the real handler with an injected recording Stripe stub + a stub rate limiter
 * and asserts:
 *   - malformed session ids / tokens are rejected (400) before Stripe is hit
 *   - the over-limit path returns 429 before Stripe is hit
 *   - a session only verifies when status=complete AND paid AND
 *     metadata.product=single_dossier AND metadata.checkout_token matches
 *
 * `handleVerifyDossier` is the exported handler; `deps` injects the stubs
 * (production passes nothing).
 */
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';

Deno.env.set('STRIPE_SECRET_KEY', 'sk_test_dummy');
Deno.env.set('CLIENT_URL', 'https://settlementforge.com');

const { handleVerifyDossier } = await import('./index.ts');

const VALID_SESSION = 'cs_test_' + 'a'.repeat(40);
const VALID_TOKEN = 't'.repeat(40);  // 24..128 chars

/** Recording Stripe stub returning a configurable session; counts retrievals. */
function makeStripe(session: Record<string, unknown>) {
  const retrievals: string[] = [];
  const stripeClient = {
    checkout: {
      sessions: {
        retrieve: (id: string) => { retrievals.push(id); return Promise.resolve(session); },
      },
    },
  };
  // deno-lint-ignore no-explicit-any
  return { retrievals, stripeClient: stripeClient as any };
}

const paidSession = (overrides: Record<string, unknown> = {}) => ({
  id: VALID_SESSION,
  status: 'complete',
  payment_status: 'paid',
  metadata: { product: 'single_dossier', checkout_token: VALID_TOKEN },
  ...overrides,
});

const req = (body: unknown) =>
  new Request('https://edge/verify-single-dossier', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

const allowAll = () => Promise.resolve(true);
const denyAll = () => Promise.resolve(false);

Deno.test('a malformed session id is rejected (400) before Stripe is called', async () => {
  const stripe = makeStripe(paidSession());
  const res = await handleVerifyDossier(
    req({ sessionId: 'not_a_session', checkoutToken: VALID_TOKEN }),
    { stripeClient: stripe.stripeClient, rateLimit: allowAll },
  );
  assertEquals(res.status, 400);
  assertEquals(stripe.retrievals.length, 0);   // never hit Stripe
});

Deno.test('an over-length session id is rejected (400) before Stripe is called', async () => {
  const stripe = makeStripe(paidSession());
  const res = await handleVerifyDossier(
    req({ sessionId: 'cs_test_' + 'a'.repeat(300), checkoutToken: VALID_TOKEN }),
    { stripeClient: stripe.stripeClient, rateLimit: allowAll },
  );
  assertEquals(res.status, 400);
  assertEquals(stripe.retrievals.length, 0);
});

Deno.test('a too-short checkout token is rejected (400) before Stripe is called', async () => {
  const stripe = makeStripe(paidSession());
  const res = await handleVerifyDossier(
    req({ sessionId: VALID_SESSION, checkoutToken: 'short' }),
    { stripeClient: stripe.stripeClient, rateLimit: allowAll },
  );
  assertEquals(res.status, 400);
  assertEquals(stripe.retrievals.length, 0);
});

Deno.test('the over-limit path returns 429 before Stripe is called (amplification guard)', async () => {
  const stripe = makeStripe(paidSession());
  const res = await handleVerifyDossier(
    req({ sessionId: VALID_SESSION, checkoutToken: VALID_TOKEN }),
    { stripeClient: stripe.stripeClient, rateLimit: denyAll },
  );
  assertEquals(res.status, 429);
  assertEquals(stripe.retrievals.length, 0);
});

Deno.test('a complete, paid single_dossier session with a matching token verifies', async () => {
  const stripe = makeStripe(paidSession());
  const res = await handleVerifyDossier(
    req({ sessionId: VALID_SESSION, checkoutToken: VALID_TOKEN }),
    { stripeClient: stripe.stripeClient, rateLimit: allowAll },
  );
  assertEquals(res.status, 200);
  assertEquals(stripe.retrievals.length, 1);
  const body = await res.json();
  assertEquals(body.verified, true);
});

Deno.test('a token MISMATCH is not verified (403) even for a paid session', async () => {
  const stripe = makeStripe(paidSession({ metadata: { product: 'single_dossier', checkout_token: 'a-different-token-aaaaaaaaaaa' } }));
  const res = await handleVerifyDossier(
    req({ sessionId: VALID_SESSION, checkoutToken: VALID_TOKEN }),
    { stripeClient: stripe.stripeClient, rateLimit: allowAll },
  );
  assertEquals(res.status, 403);
  const body = await res.json();
  assertEquals(body.verified, false);
});

Deno.test('an unpaid session is not verified (403)', async () => {
  const stripe = makeStripe(paidSession({ payment_status: 'unpaid' }));
  const res = await handleVerifyDossier(
    req({ sessionId: VALID_SESSION, checkoutToken: VALID_TOKEN }),
    { stripeClient: stripe.stripeClient, rateLimit: allowAll },
  );
  assertEquals(res.status, 403);
});

Deno.test('the wrong product (not single_dossier) is not verified (403)', async () => {
  const stripe = makeStripe(paidSession({ metadata: { product: 'credits_25', checkout_token: VALID_TOKEN } }));
  const res = await handleVerifyDossier(
    req({ sessionId: VALID_SESSION, checkoutToken: VALID_TOKEN }),
    { stripeClient: stripe.stripeClient, rateLimit: allowAll },
  );
  assertEquals(res.status, 403);
});
