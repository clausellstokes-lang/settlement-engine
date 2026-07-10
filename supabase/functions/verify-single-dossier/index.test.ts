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

const { handleVerifyDossier, withinBackstop, _resetBackstopsForTest } = await import('./index.ts');

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

/** Admin (service-role) stub for the delivery-stash read/claim (migration 122).
 *  `row` is what the dossier_purchases select returns (null → missing row →
 *  settlement:null). Records the claim update so a test can assert it was stamped. */
function makeAdmin(row: { settlement: unknown } | null) {
  const updates: Array<{ patch: unknown; token: string }> = [];
  // deno-lint-ignore no-explicit-any
  const client: any = {
    from: (_table: string) => ({
      select: (_cols: string) => ({
        eq: (_col: string, _val: string) => ({
          maybeSingle: () => Promise.resolve({ data: row, error: null }),
        }),
      }),
      update: (patch: unknown) => ({
        eq: (_col: string, val: string) => {
          updates.push({ patch, token: val });
          return Promise.resolve({ error: null });
        },
      }),
    }),
  };
  return { updates, adminClient: () => client };
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

Deno.test('a complete, paid single_dossier session verifies, returns the stashed settlement, and stamps the claim', async () => {
  const stripe = makeStripe(paidSession());
  const admin = makeAdmin({ settlement: { name: 'Riverbend', tier: 'village' } });
  const res = await handleVerifyDossier(
    req({ sessionId: VALID_SESSION, checkoutToken: VALID_TOKEN }),
    { stripeClient: stripe.stripeClient, rateLimit: allowAll, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);
  assertEquals(stripe.retrievals.length, 1);
  const body = await res.json();
  assertEquals(body.verified, true);
  // Delivery stash (122): the server-persisted settlement rides back on the response…
  assertEquals(body.settlement, { name: 'Riverbend', tier: 'village' });
  // …and the claim is stamped, keyed on the session's checkout_token.
  assertEquals(admin.updates.length, 1);
  assertEquals(admin.updates[0].token, VALID_TOKEN);
});

Deno.test('a verified session with a MISSING stash row falls back to settlement:null (no claim stamp)', async () => {
  const stripe = makeStripe(paidSession());
  const admin = makeAdmin(null);   // no dossier_purchases row for this token
  const res = await handleVerifyDossier(
    req({ sessionId: VALID_SESSION, checkoutToken: VALID_TOKEN }),
    { stripeClient: stripe.stripeClient, rateLimit: allowAll, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.verified, true);
  assertEquals(body.settlement, null);   // client stash fallback
  assertEquals(admin.updates.length, 0); // nothing to claim
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

// ── Fail-open backstop (limiter-outage path) ────────────────────────────────
// These test the in-memory backstop directly (the DB limiter is bypassed by the
// injected rateLimit stub in the handler tests above). The backstop only runs in
// production when the DB RPC can't give a verdict; its job is to bound Stripe
// amplification WITHOUT being defeated by x-forwarded-for spoofing.

Deno.test('backstop: a single honest IP is throttled after its per-IP cap', () => {
  _resetBackstopsForTest();
  const ip = '203.0.113.7';
  let allowed = 0;
  for (let i = 0; i < 40; i++) if (withinBackstop(ip)) allowed++;
  // Per-IP ceiling is 30; the same IP cannot exceed it within one window.
  assertEquals(allowed, 30);
});

Deno.test('backstop: x-forwarded-for rotation cannot bypass the global ceiling', () => {
  _resetBackstopsForTest();
  // Attacker rotates a fresh spoofed IP every request. Each fresh IP would pass
  // its own per-IP bucket, so WITHOUT the global ceiling this would be unbounded.
  // With it, total allowed attempts across all IPs is capped at BACKSTOP_MAX_GLOBAL.
  let allowed = 0;
  for (let i = 0; i < 500; i++) {
    if (withinBackstop(`10.0.${Math.floor(i / 256)}.${i % 256}`)) allowed++;
  }
  assertEquals(allowed, 120);  // BACKSTOP_MAX_GLOBAL — rotation is defeated
});

Deno.test('backstop: an over-limit IP does not consume global budget', () => {
  _resetBackstopsForTest();
  // One IP hammers past its per-IP cap (30). The over-limit attempts must NOT
  // count against the global ceiling, so other IPs still get their fair share.
  for (let i = 0; i < 200; i++) withinBackstop('198.51.100.1');  // 30 allowed, 170 rejected
  let otherAllowed = 0;
  for (let i = 0; i < 200; i++) if (withinBackstop(`172.16.${Math.floor(i / 256)}.${i % 256}`)) otherAllowed++;
  // Global ceiling is 120; the first IP consumed only its 30 allowed hits, so a
  // rotation of fresh IPs can still use the remaining 90 before the global cap.
  assertEquals(otherAllowed, 90);
});
