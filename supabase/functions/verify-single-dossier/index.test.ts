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
import { installScopedTestEnv } from '../_shared/scopedTestEnv.ts';

/**
 * ⛔⛔ THE IMPORT-WINDOW LEAK PIN, AND IT HAS TO LIVE AT MODULE SCOPE — nowhere else can
 * see the window it guards.
 *
 * `deno test` runs every edge suite in ONE process with ONE `Deno.env`. Each suite applies
 * its stubs, imports its handler, and `release()`s. The moment `release()` stops happening,
 * that suite's stubs are ambient during EVERY LATER SUITE'S IMPORT — and edge modules read
 * configuration at module scope (`founder-transfer/index.ts:31` is
 * `const CLIENT_URL = Deno.env.get('CLIENT_URL') || …`), so a later handler is constructed
 * against a stranger's value and nothing in any test body can tell.
 *
 * ⭐ THIS FILE IS ALPHABETICALLY LAST, so its import window is downstream of every other
 * suite's release. A module-scope throw fails the whole suite, which is the point: this is
 * not a test that can be skipped, it is a load condition.
 *
 * ⚠ FOREIGN STUB **VALUES**, never "the key is unset" — a real shell may legitimately
 * export any of these names, and an unset-check would flake on somebody's machine. Each
 * literal can only be present because another suite put it there and did not take it back.
 */
for (
  const [key, poison, owner] of [
    ['CLIENT_URL', 'https://settlementforge.example', 'operator-message-worker'],
    ['EXPORT_SHARED_SECRET', 'sekrit', 'analytics-export'],
    ['ANALYTICS_HASH_PEPPER', 'test_pepper', 'log-client-error'],
    ['STRIPE_PRICE_SEAT_TRANSFER', 'price_transfer', 'founder-transfer'],
    ['STRIPE_WEBHOOK_SECRET', 'whsec_test_secret_for_unit_tests', 'stripe-webhook'],
  ] as Array<[string, string, string]>
) {
  if (Deno.env.get(key) === poison) {
    throw new Error(
      `[scopedTestEnv] ${key} still holds ${owner}'s stub (${poison}) at this suite's IMPORT `
      + 'time. That suite did not release its scope, so every later handler is constructed '
      + 'against a stranger\'s configuration. See supabase/functions/_shared/scopedTestEnv.ts.',
    );
  }
}

const scopedEnv = installScopedTestEnv({
  STRIPE_SECRET_KEY: 'sk_test_dummy',
  CLIENT_URL: 'https://settlementforge.com',
});

const { handleVerifyDossier, withinBackstop, _resetBackstopsForTest } = await import('./index.ts');
// The import above has read the stubs at module scope; hand the ambient environment
// back so nothing this suite supplied is visible while any OTHER suite runs.
scopedEnv.release();

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

scopedEnv.test('a malformed session id is rejected (400) before Stripe is called', async () => {
  const stripe = makeStripe(paidSession());
  const res = await handleVerifyDossier(
    req({ sessionId: 'not_a_session', checkoutToken: VALID_TOKEN }),
    { stripeClient: stripe.stripeClient, rateLimit: allowAll },
  );
  assertEquals(res.status, 400);
  assertEquals(stripe.retrievals.length, 0);   // never hit Stripe
});

scopedEnv.test('an over-length session id is rejected (400) before Stripe is called', async () => {
  const stripe = makeStripe(paidSession());
  const res = await handleVerifyDossier(
    req({ sessionId: 'cs_test_' + 'a'.repeat(300), checkoutToken: VALID_TOKEN }),
    { stripeClient: stripe.stripeClient, rateLimit: allowAll },
  );
  assertEquals(res.status, 400);
  assertEquals(stripe.retrievals.length, 0);
});

scopedEnv.test('a too-short checkout token is rejected (400) before Stripe is called', async () => {
  const stripe = makeStripe(paidSession());
  const res = await handleVerifyDossier(
    req({ sessionId: VALID_SESSION, checkoutToken: 'short' }),
    { stripeClient: stripe.stripeClient, rateLimit: allowAll },
  );
  assertEquals(res.status, 400);
  assertEquals(stripe.retrievals.length, 0);
});

scopedEnv.test('the over-limit path returns 429 before Stripe is called (amplification guard)', async () => {
  const stripe = makeStripe(paidSession());
  const res = await handleVerifyDossier(
    req({ sessionId: VALID_SESSION, checkoutToken: VALID_TOKEN }),
    { stripeClient: stripe.stripeClient, rateLimit: denyAll },
  );
  assertEquals(res.status, 429);
  assertEquals(stripe.retrievals.length, 0);
});

scopedEnv.test('a complete, paid single_dossier session verifies, returns the stashed settlement, and stamps the claim', async () => {
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

scopedEnv.test('a verified session with a MISSING stash row falls back to settlement:null (no claim stamp)', async () => {
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

scopedEnv.test('a token MISMATCH is not verified (403) even for a paid session', async () => {
  const stripe = makeStripe(paidSession({ metadata: { product: 'single_dossier', checkout_token: 'a-different-token-aaaaaaaaaaa' } }));
  const res = await handleVerifyDossier(
    req({ sessionId: VALID_SESSION, checkoutToken: VALID_TOKEN }),
    { stripeClient: stripe.stripeClient, rateLimit: allowAll },
  );
  assertEquals(res.status, 403);
  const body = await res.json();
  assertEquals(body.verified, false);
});

scopedEnv.test('an unpaid session is not verified (403)', async () => {
  const stripe = makeStripe(paidSession({ payment_status: 'unpaid' }));
  const res = await handleVerifyDossier(
    req({ sessionId: VALID_SESSION, checkoutToken: VALID_TOKEN }),
    { stripeClient: stripe.stripeClient, rateLimit: allowAll },
  );
  assertEquals(res.status, 403);
});

scopedEnv.test('the wrong product (not single_dossier) is not verified (403)', async () => {
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

scopedEnv.test('backstop: a single honest IP is throttled after its per-IP cap', () => {
  _resetBackstopsForTest();
  const ip = '203.0.113.7';
  let allowed = 0;
  for (let i = 0; i < 40; i++) if (withinBackstop(ip)) allowed++;
  // Per-IP ceiling is 30; the same IP cannot exceed it within one window.
  assertEquals(allowed, 30);
});

scopedEnv.test('backstop: x-forwarded-for rotation cannot bypass the global ceiling', () => {
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

scopedEnv.test('backstop: an over-limit IP does not consume global budget', () => {
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

// ── Wave-D human verification (Turnstile) — VERIFY-ONLY-IF-PRESENT ─────────────
// This is the POST-PAYMENT verify step, so a paid buyer must ALWAYS be able to
// collect their PDF. The wiring is deliberately verify-only-if-present: a missing/
// blocked token is NEVER a block; only a token that is present AND fails
// verification is rejected. INERT (a no-op) until TURNSTILE_SECRET_KEY is set.

/** Stub globalThis.fetch so a secret-configured verifyTurnstile resolves a known
 *  siteverify verdict without touching the network. Returns a restore fn. */
function stubFetch(success: boolean): () => void {
  const original = globalThis.fetch;
  // deno-lint-ignore no-explicit-any
  globalThis.fetch = (() => Promise.resolve(new Response(JSON.stringify({ success }), { status: 200 }))) as any;
  return () => { globalThis.fetch = original; };
}

scopedEnv.test('INERT: a captchaToken in the body does not change verification while unconfigured', async () => {
  Deno.env.delete('TURNSTILE_SECRET_KEY');
  const stripe = makeStripe(paidSession());
  const admin = makeAdmin({ settlement: { name: 'Riverbend', tier: 'village' } });
  const res = await handleVerifyDossier(
    req({ sessionId: VALID_SESSION, checkoutToken: VALID_TOKEN, captchaToken: 'anything' }),
    { stripeClient: stripe.stripeClient, rateLimit: allowAll, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);            // inert → the token is a no-op
  assertEquals((await res.json()).verified, true);
});

scopedEnv.test('ACTIVE + NO token still verifies (200): a paid buyer is NEVER blocked on a missing token', async () => {
  Deno.env.set('TURNSTILE_SECRET_KEY', 'sk_test');
  try {
    const stripe = makeStripe(paidSession());
    const admin = makeAdmin({ settlement: { name: 'Riverbend', tier: 'village' } });
    const res = await handleVerifyDossier(
      req({ sessionId: VALID_SESSION, checkoutToken: VALID_TOKEN }),   // no captchaToken
      { stripeClient: stripe.stripeClient, rateLimit: allowAll, adminClient: admin.adminClient },
    );
    assertEquals(res.status, 200);          // never a stuck button post-payment
    assertEquals((await res.json()).verified, true);
  } finally {
    Deno.env.delete('TURNSTILE_SECRET_KEY');
  }
});

scopedEnv.test('ACTIVE + a PRESENT VALID token verifies (200)', async () => {
  Deno.env.set('TURNSTILE_SECRET_KEY', 'sk_test');
  const restore = stubFetch(true);
  try {
    const stripe = makeStripe(paidSession());
    const admin = makeAdmin({ settlement: { name: 'Riverbend', tier: 'village' } });
    const res = await handleVerifyDossier(
      req({ sessionId: VALID_SESSION, checkoutToken: VALID_TOKEN, captchaToken: 'good' }),
      { stripeClient: stripe.stripeClient, rateLimit: allowAll, adminClient: admin.adminClient },
    );
    assertEquals(res.status, 200);
    assertEquals((await res.json()).verified, true);
  } finally {
    restore();
    Deno.env.delete('TURNSTILE_SECRET_KEY');
  }
});

scopedEnv.test('ACTIVE + a PRESENT INVALID token is rejected (403) before Stripe', async () => {
  Deno.env.set('TURNSTILE_SECRET_KEY', 'sk_test');
  const restore = stubFetch(false);
  try {
    const stripe = makeStripe(paidSession());
    const res = await handleVerifyDossier(
      req({ sessionId: VALID_SESSION, checkoutToken: VALID_TOKEN, captchaToken: 'garbage' }),
      { stripeClient: stripe.stripeClient, rateLimit: allowAll },
    );
    assertEquals(res.status, 403);
    assertEquals(stripe.retrievals.length, 0);   // rejected before the Stripe retrieve
  } finally {
    restore();
    Deno.env.delete('TURNSTILE_SECRET_KEY');
  }
});
