/**
 * index.test.ts — EXECUTION test of the create-checkout money gate (review B16 #2/#3).
 *
 * Deno test (runs under the `deno-tests` CI job / `deno task test:edge`, NOT vitest).
 * create-checkout is the linchpin of the webhook's documented trust model: the
 * webhook FAITHFULLY grants whatever credits/product/user_id land in
 * session.metadata, so the metadata MUST be derived server-side here. Previously
 * this was asserted only by regex over the handler source — a refactor that read
 * credits/product from the request body, or put a body-supplied user_id into the
 * metadata, would have kept those green. This RUNS the real handler with injected
 * Stripe + supabase stubs and asserts the boundary:
 *   - credits come from the server CREDIT_AMOUNTS map (not the body)
 *   - product is validated against the server PRICE_MAP (a fake product 400s)
 *   - supabase_user_id comes from getUser() (the verified JWT), never the body
 *
 * `handleCreateCheckout` is the exported handler; we inject recording stubs via
 * its `deps` seam (production passes nothing).
 *
 * NOTE: authored without a local Deno runtime — verified in CI. The env vars
 * below must be set BEFORE importing index.ts (PRICE_MAP reads them at module load).
 */
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';

Deno.env.set('STRIPE_SECRET_KEY', 'sk_test_dummy');
Deno.env.set('SUPABASE_URL', 'https://stub.supabase.co');
Deno.env.set('SUPABASE_ANON_KEY', 'anon_dummy');
Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'service_role_dummy');
Deno.env.set('CLIENT_URL', 'https://settlementforge.com');
// Configure the price ids the catalog maps to (PRICE_MAP reads env at load).
Deno.env.set('STRIPE_PRICE_CREDITS_25', 'price_credits_25');
Deno.env.set('STRIPE_PRICE_PREMIUM', 'price_premium');
Deno.env.set('STRIPE_PRICE_SINGLE_DOSSIER', 'price_single_dossier');
Deno.env.set('STRIPE_PRICE_FOUNDER_LIFETIME', 'price_founder_lifetime');

const { handleCreateCheckout } = await import('./index.ts');

/** Recording Stripe stub: captures the params handed to checkout.sessions.create. */
function makeStripe() {
  const created: Array<Record<string, unknown>> = [];
  const customers: Array<Record<string, unknown>> = [];
  const stripeClient = {
    customers: {
      create: (params: Record<string, unknown>) => {
        customers.push(params);
        return Promise.resolve({ id: 'cus_stub' });
      },
    },
    checkout: {
      sessions: {
        create: (params: Record<string, unknown>) => {
          created.push(params);
          return Promise.resolve({ url: 'https://stripe.test/session', id: 'cs_stub' });
        },
      },
    },
  };
  // deno-lint-ignore no-explicit-any
  return { created, customers, stripeClient: stripeClient as any };
}

/** supabase user-client stub: getUser() returns the given user (the verified JWT). */
function makeUserClient(user: { id: string; email?: string | null } | null, authError = false) {
  // deno-lint-ignore no-explicit-any
  return (_authHeader: string): any => ({
    auth: {
      getUser: () => Promise.resolve({
        data: { user: authError ? null : user },
        error: authError ? { message: 'bad jwt' } : null,
      }),
    },
  });
}

/** Admin stub: profile read returns an existing stripe_customer_id by default;
 *  rpc('founder_seats_taken') resolves the given seat count (default: plenty free). */
function makeAdminClient(customerId: string | null = 'cus_existing', seatsTaken: number | null = 0) {
  // deno-lint-ignore no-explicit-any
  return (): any => ({
    from: (_t: string) => ({
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: { stripe_customer_id: customerId }, error: null }) }) }),
      update: () => ({ eq: () => Promise.resolve({ error: null }) }),
    }),
    rpc: (fn: string) => Promise.resolve(
      fn === 'founder_seats_taken'
        ? { data: seatsTaken, error: null }
        : { data: null, error: { message: `unexpected rpc ${fn}` } },
    ),
  });
}

const req = (body: unknown, headers: Record<string, string> = {}) =>
  new Request('https://edge/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });

Deno.test('credits are derived from CREDIT_AMOUNTS server-side, NOT from the request body', async () => {
  const stripe = makeStripe();
  // The body tries to smuggle credits=99999; the metadata must carry 25 (the
  // server CREDIT_AMOUNTS value for credits_25), never the attacker number.
  const res = await handleCreateCheckout(
    req({ product: 'credits_25', credits: 99999 }, { Authorization: 'Bearer jwt' }),
    { stripeClient: stripe.stripeClient, userClient: makeUserClient({ id: 'u1', email: 'u1@x.com' }), adminClient: makeAdminClient() },
  );
  assertEquals(res.status, 200);
  assertEquals(stripe.created.length, 1);
  const metadata = (stripe.created[0].metadata as Record<string, string>);
  assertEquals(metadata.credits, '25');     // the server value, not 99999
  assertEquals(metadata.product, 'credits_25');
});

Deno.test('supabase_user_id in the metadata comes from getUser(), never the body', async () => {
  const stripe = makeStripe();
  // The body claims a different user id; the verified JWT resolves to u_real.
  const res = await handleCreateCheckout(
    req({ product: 'credits_25', supabase_user_id: 'attacker_victim_id' }, { Authorization: 'Bearer jwt' }),
    { stripeClient: stripe.stripeClient, userClient: makeUserClient({ id: 'u_real', email: 'u@x.com' }), adminClient: makeAdminClient() },
  );
  assertEquals(res.status, 200);
  const metadata = (stripe.created[0].metadata as Record<string, string>);
  assertEquals(metadata.supabase_user_id, 'u_real');   // from getUser(), not the body
});

Deno.test('an unknown product is rejected (400) and never reaches Stripe', async () => {
  const stripe = makeStripe();
  const res = await handleCreateCheckout(
    req({ product: 'free_credits_lol' }, { Authorization: 'Bearer jwt' }),
    { stripeClient: stripe.stripeClient, userClient: makeUserClient({ id: 'u1' }), adminClient: makeAdminClient() },
  );
  assertEquals(res.status, 400);
  assertEquals(stripe.created.length, 0);     // no session created for a fake product
});

Deno.test('a non-anonymous product with NO auth header is rejected (400) before Stripe', async () => {
  const stripe = makeStripe();
  const res = await handleCreateCheckout(
    req({ product: 'credits_25' }),  // no Authorization header
    { stripeClient: stripe.stripeClient, userClient: makeUserClient({ id: 'u1' }), adminClient: makeAdminClient() },
  );
  assertEquals(res.status, 400);
  assertEquals(stripe.created.length, 0);
});

Deno.test('single_dossier is anonymous-allowed with a valid checkout token and carries no user id', async () => {
  const stripe = makeStripe();
  const token = 'x'.repeat(40);  // 24..128 chars
  const res = await handleCreateCheckout(
    req({ product: 'single_dossier', checkoutToken: token }),  // no auth — allowed
    { stripeClient: stripe.stripeClient, userClient: makeUserClient(null), adminClient: makeAdminClient() },
  );
  assertEquals(res.status, 200);
  const metadata = (stripe.created[0].metadata as Record<string, string>);
  assertEquals(metadata.product, 'single_dossier');
  assertEquals(metadata.supabase_user_id, '');           // anonymous → empty
  assertEquals(metadata.checkout_token, token);
  assertEquals(metadata.anonymous, 'true');
});

Deno.test('single_dossier without a valid checkout token is rejected (400)', async () => {
  const stripe = makeStripe();
  const res = await handleCreateCheckout(
    req({ product: 'single_dossier', checkoutToken: 'short' }),
    { stripeClient: stripe.stripeClient, userClient: makeUserClient(null), adminClient: makeAdminClient() },
  );
  assertEquals(res.status, 400);
  assertEquals(stripe.created.length, 0);
});

// ── Founder Lifetime seat cap (advertised 500 seats, enforced server-side) ────
// founder_seats_taken() feeds both the pricing-page counter AND this gate; a
// sold-out founder tier must never reach Stripe.

Deno.test('founder_lifetime with seats remaining creates a checkout session', async () => {
  const stripe = makeStripe();
  const res = await handleCreateCheckout(
    req({ product: 'founder_lifetime' }, { Authorization: 'Bearer jwt' }),
    { stripeClient: stripe.stripeClient, userClient: makeUserClient({ id: 'u1', email: 'u1@x.com' }), adminClient: makeAdminClient('cus_existing', 499) },
  );
  assertEquals(res.status, 200);
  assertEquals(stripe.created.length, 1);
  assertEquals((stripe.created[0].metadata as Record<string, string>).product, 'founder_lifetime');
});

Deno.test('founder_lifetime at the 500-seat cap is rejected (400) and never reaches Stripe', async () => {
  const stripe = makeStripe();
  const res = await handleCreateCheckout(
    req({ product: 'founder_lifetime' }, { Authorization: 'Bearer jwt' }),
    { stripeClient: stripe.stripeClient, userClient: makeUserClient({ id: 'u1', email: 'u1@x.com' }), adminClient: makeAdminClient('cus_existing', 500) },
  );
  assertEquals(res.status, 400);
  assertEquals(stripe.created.length, 0);   // seat 501 is never offered for sale
});

Deno.test('a founder seat-count failure FAILS CLOSED (400, no session)', async () => {
  const stripe = makeStripe();
  // rpc resolves an error (seatsTaken=null + patched rpc): simulate via a stub
  // whose rpc always errors.
  // deno-lint-ignore no-explicit-any
  const adminClient = (): any => ({
    from: () => ({
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: { stripe_customer_id: 'cus_x' }, error: null }) }) }),
      update: () => ({ eq: () => Promise.resolve({ error: null }) }),
    }),
    rpc: () => Promise.resolve({ data: null, error: { message: 'counter unavailable' } }),
  });
  const res = await handleCreateCheckout(
    req({ product: 'founder_lifetime' }, { Authorization: 'Bearer jwt' }),
    { stripeClient: stripe.stripeClient, userClient: makeUserClient({ id: 'u1', email: 'u1@x.com' }), adminClient },
  );
  assertEquals(res.status, 400);
  assertEquals(stripe.created.length, 0);
});
