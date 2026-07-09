/**
 * index.test.ts — EXECUTION test for create-checkout's single-dossier hardening
 * (findings F21/F23). Runs under the `deno-tests` CI job / `deno task test:edge`.
 *
 * Covers the size guard (a pre-payment 413) and the server-side persistence of
 * the settlement into dossier_purchases before the Stripe session is created.
 * `deps.adminClient` records the upsert; `deps.stripe` stubs session creation so
 * no network is touched.
 */
import { assertEquals, assertStringIncludes } from 'https://deno.land/std@0.224.0/assert/mod.ts';

Deno.env.set('STRIPE_SECRET_KEY', 'sk_test_dummy');
Deno.env.set('STRIPE_PRICE_SINGLE_DOSSIER', 'price_single_dossier_test');
Deno.env.set('SUPABASE_URL', 'https://stub.supabase.co');
Deno.env.set('SUPABASE_ANON_KEY', 'anon_dummy');
Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'service_role_dummy');
Deno.env.set('CLIENT_URL', 'https://settlementforge.com');

const { handleCreateCheckout } = await import('./index.ts');

const TOKEN = 'tok_abcdefabcdefabcdefabcdef'; // 26 chars, > 24

interface Upsert { table: string; row: Record<string, unknown>; opts: unknown }
function makeStub() {
  const calls: { upserts: Upsert[]; sessionsCreated: Record<string, unknown>[] } = {
    upserts: [],
    sessionsCreated: [],
  };
  const adminClient = () => ({
    from: (table: string) => ({
      upsert: (row: Record<string, unknown>, opts: unknown) => {
        calls.upserts.push({ table, row, opts });
        return Promise.resolve({ error: null });
      },
      // present so the (unused-in-anon-path) profile lookup wouldn't explode
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null }) }) }),
      update: () => ({ eq: () => Promise.resolve({ error: null }) }),
    }),
  });
  // deno-lint-ignore no-explicit-any
  const stripe: any = {
    checkout: {
      sessions: {
        create: (params: Record<string, unknown>) => {
          calls.sessionsCreated.push(params);
          return Promise.resolve({ id: 'cs_test_created', url: 'https://stripe.test/checkout' });
        },
      },
    },
    customers: { create: () => Promise.resolve({ id: 'cus_x' }) },
  };
  return { calls, deps: { adminClient, stripe } };
}

const post = (body: unknown) =>
  new Request('https://edge/create-checkout', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

Deno.test('single_dossier: oversized settlement is rejected 413 BEFORE any Stripe call or persist', async () => {
  const stub = makeStub();
  const huge = { name: 'x'.repeat(600 * 1024) }; // > 512KB serialized
  const res = await handleCreateCheckout(post({ product: 'single_dossier', checkoutToken: TOKEN, settlement: huge }), stub.deps);
  assertEquals(res.status, 413);
  const json = await res.json();
  assertStringIncludes(String(json.error), 'too large');
  assertEquals(stub.calls.upserts.length, 0);         // nothing persisted
  assertEquals(stub.calls.sessionsCreated.length, 0); // never reached Stripe
});

Deno.test('single_dossier: persists the settlement + byte_size, then creates the session with a dt token', async () => {
  const stub = makeStub();
  const settlement = { name: 'Greycairn', tier: 'town', population: 1300 };
  const res = await handleCreateCheckout(post({ product: 'single_dossier', checkoutToken: TOKEN, settlement }), stub.deps);
  assertEquals(res.status, 200);
  const json = await res.json();
  assertEquals(json.url, 'https://stripe.test/checkout');

  // Persisted before the session was created.
  assertEquals(stub.calls.upserts.length, 1);
  const up = stub.calls.upserts[0];
  assertEquals(up.table, 'dossier_purchases');
  assertEquals(up.row.checkout_token, TOKEN);
  assertEquals((up.row.settlement as { name: string }).name, 'Greycairn');
  assertEquals(typeof up.row.byte_size, 'number');
  assertEquals((up.opts as { onConflict: string }).onConflict, 'checkout_token');

  // The success_url carries dt=<token> so the returning browser recovers its
  // exact token, and metadata keeps checkout_token for the webhook binding.
  assertEquals(stub.calls.sessionsCreated.length, 1);
  const params = stub.calls.sessionsCreated[0];
  assertStringIncludes(String(params.success_url), `dt=${TOKEN}`);
  assertStringIncludes(String(params.success_url), 'session_id={CHECKOUT_SESSION_ID}');
  assertEquals((params.metadata as { checkout_token: string }).checkout_token, TOKEN);
});

Deno.test('single_dossier without a settlement still creates the session (client stash is the fallback)', async () => {
  const stub = makeStub();
  const res = await handleCreateCheckout(post({ product: 'single_dossier', checkoutToken: TOKEN }), stub.deps);
  assertEquals(res.status, 200);
  assertEquals(stub.calls.upserts.length, 0);
  assertEquals(stub.calls.sessionsCreated.length, 1);
});

Deno.test('missing checkout token for single_dossier is a 400 (no persist, no Stripe call)', async () => {
  const stub = makeStub();
  const res = await handleCreateCheckout(post({ product: 'single_dossier', settlement: { name: 'x' } }), stub.deps);
  assertEquals(res.status, 400);
  assertEquals(stub.calls.upserts.length, 0);
  assertEquals(stub.calls.sessionsCreated.length, 0);
});
