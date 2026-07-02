/**
 * index.test.ts — EXECUTION test of the create-customer-portal identity gate.
 *
 * Deno test (runs under the `deno-tests` CI job / `deno task test:edge`, NOT vitest).
 * The billing portal grants full control of a Stripe customer (saved payment
 * methods, subscription cancel). Previously the null-stripe_customer_id branch
 * adopted the FIRST customers.list({ email }) result — a bare email match —
 * so a caller whose account email collides with someone else's Stripe customer
 * could open the portal on the stranger's customer AND bind it to their
 * profile. This RUNS the real handler with injected Stripe + supabase stubs
 * and asserts the boundary:
 *   - an email-only match (no metadata.supabase_user_id) is NEVER adopted —
 *     a fresh customer keyed to the verified user id is created instead
 *   - an existing customer IS reused only when metadata.supabase_user_id
 *     matches the JWT-verified user
 *   - a profile with stripe_customer_id short-circuits (no list/create)
 *   - no auth → 400 before any Stripe call
 *
 * `handleCreateCustomerPortal` is the exported handler; we inject recording
 * stubs via its `deps` seam (production passes nothing).
 *
 * The env vars below must be set BEFORE importing index.ts (the Stripe client
 * reads STRIPE_SECRET_KEY at module load).
 */
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';

Deno.env.set('STRIPE_SECRET_KEY', 'sk_test_dummy');
Deno.env.set('SUPABASE_URL', 'https://stub.supabase.co');
Deno.env.set('SUPABASE_ANON_KEY', 'anon_dummy');
Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'service_role_dummy');
Deno.env.set('CLIENT_URL', 'https://settlementforge.com');

const { handleCreateCustomerPortal } = await import('./index.ts');

type StripeCustomer = { id: string; metadata?: Record<string, string> };

/** Recording Stripe stub: seeded customers.list results + created/portal capture. */
function makeStripe(listResults: StripeCustomer[] = []) {
  const created: Array<Record<string, unknown>> = [];
  const portalSessions: Array<Record<string, unknown>> = [];
  let listCalls = 0;
  const stripeClient = {
    customers: {
      list: (_params: Record<string, unknown>) => {
        listCalls += 1;
        return Promise.resolve({ data: listResults });
      },
      create: (params: Record<string, unknown>) => {
        created.push(params);
        return Promise.resolve({ id: 'cus_fresh', metadata: params.metadata });
      },
    },
    billingPortal: {
      sessions: {
        create: (params: Record<string, unknown>) => {
          portalSessions.push(params);
          return Promise.resolve({ url: 'https://stripe.test/portal' });
        },
      },
    },
  };
  return {
    created,
    portalSessions,
    getListCalls: () => listCalls,
    // deno-lint-ignore no-explicit-any
    stripeClient: stripeClient as any,
  };
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

/** Admin stub: profile read returns the given stripe_customer_id; records updates. */
function makeAdminClient(customerId: string | null = null) {
  const updates: Array<Record<string, unknown>> = [];
  // deno-lint-ignore no-explicit-any
  const adminClient = (): any => ({
    from: (_t: string) => ({
      select: () => ({ eq: () => ({ maybeSingle: () => Promise.resolve({ data: { stripe_customer_id: customerId }, error: null }) }) }),
      update: (values: Record<string, unknown>) => ({
        eq: () => {
          updates.push(values);
          return Promise.resolve({ error: null });
        },
      }),
    }),
  });
  return { updates, adminClient };
}

const req = (headers: Record<string, string> = {}) =>
  new Request('https://edge/create-customer-portal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
  });

Deno.test('a bare email match without matching supabase_user_id metadata is NEVER adopted', async () => {
  // A stranger's customer shares the caller's email (no identity metadata).
  const stripe = makeStripe([{ id: 'cus_stranger', metadata: {} }]);
  const admin = makeAdminClient(null);
  const res = await handleCreateCustomerPortal(
    req({ Authorization: 'Bearer jwt' }),
    { stripeClient: stripe.stripeClient, userClient: makeUserClient({ id: 'u1', email: 'shared@x.com' }), adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);
  // A fresh customer keyed to the verified user id was created instead.
  assertEquals(stripe.created.length, 1);
  assertEquals((stripe.created[0].metadata as Record<string, string>).supabase_user_id, 'u1');
  // The portal session and the profile bind to the fresh customer, never cus_stranger.
  assertEquals(stripe.portalSessions[0].customer, 'cus_fresh');
  assertEquals(admin.updates[0].stripe_customer_id, 'cus_fresh');
});

Deno.test('an existing customer with metadata.supabase_user_id === user.id IS reused (no duplicate)', async () => {
  const stripe = makeStripe([
    { id: 'cus_other_user', metadata: { supabase_user_id: 'someone_else' } },
    { id: 'cus_mine', metadata: { supabase_user_id: 'u1' } },
  ]);
  const admin = makeAdminClient(null);
  const res = await handleCreateCustomerPortal(
    req({ Authorization: 'Bearer jwt' }),
    { stripeClient: stripe.stripeClient, userClient: makeUserClient({ id: 'u1', email: 'me@x.com' }), adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);
  assertEquals(stripe.created.length, 0);                        // reused, not duplicated
  assertEquals(stripe.portalSessions[0].customer, 'cus_mine');   // the identity match, not data[0]
  assertEquals(admin.updates[0].stripe_customer_id, 'cus_mine');
});

Deno.test('a profile with stripe_customer_id short-circuits — no list, no create', async () => {
  const stripe = makeStripe([{ id: 'cus_stranger', metadata: {} }]);
  const admin = makeAdminClient('cus_profile');
  const res = await handleCreateCustomerPortal(
    req({ Authorization: 'Bearer jwt' }),
    { stripeClient: stripe.stripeClient, userClient: makeUserClient({ id: 'u1', email: 'me@x.com' }), adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);
  assertEquals(stripe.getListCalls(), 0);
  assertEquals(stripe.created.length, 0);
  assertEquals(stripe.portalSessions[0].customer, 'cus_profile');
});

Deno.test('no Authorization header is rejected (400) before any Stripe call', async () => {
  const stripe = makeStripe();
  const admin = makeAdminClient(null);
  const res = await handleCreateCustomerPortal(
    req(),  // no Authorization header
    { stripeClient: stripe.stripeClient, userClient: makeUserClient({ id: 'u1' }), adminClient: admin.adminClient },
  );
  assertEquals(res.status, 400);
  assertEquals(stripe.getListCalls(), 0);
  assertEquals(stripe.created.length, 0);
  assertEquals(stripe.portalSessions.length, 0);
});

Deno.test('a user without an email cannot mint a customer (400, no Stripe calls)', async () => {
  const stripe = makeStripe();
  const admin = makeAdminClient(null);
  const res = await handleCreateCustomerPortal(
    req({ Authorization: 'Bearer jwt' }),
    { stripeClient: stripe.stripeClient, userClient: makeUserClient({ id: 'u1', email: null }), adminClient: admin.adminClient },
  );
  assertEquals(res.status, 400);
  assertEquals(stripe.getListCalls(), 0);
  assertEquals(stripe.created.length, 0);
});
