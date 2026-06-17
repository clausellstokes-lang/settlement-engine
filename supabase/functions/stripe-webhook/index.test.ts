/**
 * index.test.ts — EXECUTION test of the stripe-webhook trust boundary (A+ tests-tooling.2).
 *
 * Deno test (runs under the `deno-tests` CI job / `deno task test:edge`, NOT vitest).
 * The webhook is the highest-dollar attacker surface — anyone can POST to its public
 * URL — and was previously asserted only by regex over the handler source. This RUNS
 * the real handler with forged vs. correctly-signed requests and asserts the boundary:
 * no metadata is read and no DB write happens until the Stripe signature verifies.
 *
 * `handleStripeWebhook` is the exported handler; we inject a recording supabase stub
 * via its `deps.adminClient` seam (production passes nothing).
 *
 * NOTE: authored without a local Deno runtime — verified in CI, not on the author's
 * machine. The unsigned/bad-signature cases need no crypto and are the core boundary
 * proof; the signed cases use a SubtleCrypto HMAC signer matching Stripe's v1 scheme.
 */
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';

const SECRET = 'whsec_test_secret_for_unit_tests';
Deno.env.set('STRIPE_SECRET_KEY', 'sk_test_dummy');
Deno.env.set('STRIPE_WEBHOOK_SECRET', SECRET);
Deno.env.set('SUPABASE_URL', 'https://stub.supabase.co');
Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'service_role_dummy');

const { handleStripeWebhook } = await import('./index.ts');

/** A recording stub of the service-role admin client. Captures every RPC/auth/table
 *  write so a test can assert what the handler did (or, for forgeries, did NOT do). */
function makeStub() {
  const calls: { rpc: Array<{ fn: string; args: unknown }>; authUpdates: unknown[]; profileUpdates: unknown[] } = {
    rpc: [], authUpdates: [], profileUpdates: [],
  };
  const client = {
    auth: { admin: { updateUserById: (_id: string, attrs: unknown) => { calls.authUpdates.push(attrs); return Promise.resolve({ error: null }); } } },
    from: (_table: string) => ({
      update: (vals: unknown) => ({ eq: (_col: string, _val: string) => { calls.profileUpdates.push(vals); return Promise.resolve({ error: null }); } }),
      select: () => ({ eq: () => ({ maybeSingle: () => Promise.resolve({ data: null, error: null }) }) }),
    }),
    rpc: (fn: string, args: unknown) => { calls.rpc.push({ fn, args }); return Promise.resolve({ error: null }); },
  };
  return { calls, adminClient: () => client };
}

/** Stripe v1 signature header: t=<ts>,v1=HMAC_SHA256(secret, `${ts}.${payload}`). */
async function sign(payload: string, secret: string, ts = Math.floor(Date.now() / 1000)): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = await crypto.subtle.sign('HMAC', key, enc.encode(`${ts}.${payload}`));
  const hex = Array.from(new Uint8Array(mac)).map((b) => b.toString(16).padStart(2, '0')).join('');
  return `t=${ts},v1=${hex}`;
}

const req = (body: string, headers: Record<string, string> = {}) =>
  new Request('https://edge/stripe-webhook', { method: 'POST', headers, body });

const checkoutEvent = (metadata: Record<string, string>, extra: Record<string, unknown> = {}) =>
  JSON.stringify({
    id: 'evt_1', type: 'checkout.session.completed',
    data: { object: { id: 'cs_1', metadata, ...extra } },
  });

Deno.test('rejects a request with NO signature (400) before any DB write', async () => {
  const stub = makeStub();
  const res = await handleStripeWebhook(req(checkoutEvent({ supabase_user_id: 'u1', product: 'premium' })), stub);
  assertEquals(res.status, 400);
  assertEquals(await res.text(), 'Missing signature');
  assertEquals(stub.calls.rpc.length, 0);
  assertEquals(stub.calls.authUpdates.length, 0);
});

Deno.test('rejects a request with a BAD signature (400) before any DB write', async () => {
  const stub = makeStub();
  const body = checkoutEvent({ supabase_user_id: 'u1', product: 'premium' });
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': 't=1,v1=deadbeef' }), stub);
  assertEquals(res.status, 400);
  assertEquals(await res.text(), 'Invalid signature');
  assertEquals(stub.calls.rpc.length, 0);
  assertEquals(stub.calls.authUpdates.length, 0);
});

Deno.test('a correctly-signed premium checkout upgrades the user', async () => {
  const stub = makeStub();
  const body = checkoutEvent({ supabase_user_id: 'u1', product: 'premium' });
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  assertEquals(res.status, 200);
  assertEquals(stub.calls.authUpdates.length, 1);                          // tier upgrade ran
  assertEquals(stub.calls.rpc.some((c) => c.fn === 'restore_premium_settlements'), true);
});

Deno.test('credit grant trusts ONLY session.metadata.credits, not smuggled body fields', async () => {
  const stub = makeStub();
  // metadata.credits=10 is the trusted field; a top-level body credits=99999 is noise.
  const body = checkoutEvent({ supabase_user_id: 'u1', credits: '10' }, { credits: 99999 });
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  assertEquals(res.status, 200);
  const grant = stub.calls.rpc.find((c) => c.fn === 'system_grant_credits');
  assertEquals(grant !== undefined, true);
  assertEquals((grant!.args as { amount: number }).amount, 10);            // the metadata value, not 99999
});
