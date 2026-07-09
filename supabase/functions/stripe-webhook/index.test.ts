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

type ProfileRow = { id: string; is_founder: boolean };
interface StubOpts {
  /** profiles resolvable by stripe_customer_id (the only trusted binding). */
  profileByCustomerId?: Record<string, ProfileRow>;
  /** profiles resolvable by exact lowercased email (invoice grant fallback). */
  profileByEmail?: Record<string, ProfileRow>;
}

/** A recording stub of the service-role admin client. Captures every RPC/auth/table
 *  write so a test can assert what the handler did (or, for forgeries, did NOT do).
 *  Lookups (.eq('stripe_customer_id'|'email', …).maybeSingle()) resolve from the
 *  configured maps so F5 binding behavior can be exercised. */
function makeStub(opts: StubOpts = {}) {
  const { profileByCustomerId = {}, profileByEmail = {} } = opts;
  const calls: {
    rpc: Array<{ fn: string; args: unknown }>;
    authUpdates: unknown[];
    profileUpdates: Array<{ table: string; vals: Record<string, unknown>; col: string; val: string }>;
  } = { rpc: [], authUpdates: [], profileUpdates: [] };
  const client = {
    auth: { admin: { updateUserById: (_id: string, attrs: unknown) => { calls.authUpdates.push(attrs); return Promise.resolve({ error: null }); } } },
    from: (table: string) => {
      let col = '', val = '';
      const chain: Record<string, unknown> = {
        update: (vals: Record<string, unknown>) => ({
          eq: (c: string, v: string) => { calls.profileUpdates.push({ table, vals, col: c, val: v }); return Promise.resolve({ error: null }); },
        }),
        select: () => chain,
        eq: (c: string, v: string) => { col = c; val = v; return chain; },
        maybeSingle: () => {
          let data: ProfileRow | null = null;
          if (col === 'stripe_customer_id') data = profileByCustomerId[val] ?? null;
          else if (col === 'email') data = profileByEmail[val] ?? null;
          return Promise.resolve({ data, error: null });
        },
      };
      return chain;
    },
    rpc: (fn: string, args: unknown) => { calls.rpc.push({ fn, args }); return Promise.resolve({ error: null }); },
  };
  return { calls, adminClient: () => client };
}

const subDeletedEvent = (customerId: string) =>
  JSON.stringify({ id: 'evt_sub', type: 'customer.subscription.deleted', data: { object: { id: 'sub_1', customer: customerId } } });

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

// ── F5: destructive subscription lifecycle resolves by BINDING only ─────────
Deno.test('subscription.deleted for an UNBOUND customer skips the downgrade (F5)', async () => {
  const stub = makeStub(); // no customer-id binding exists
  const body = subDeletedEvent('cus_unknown');
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  assertEquals(res.status, 200);
  // No email guessing for a destructive action → no downgrade, no auth change.
  assertEquals(stub.calls.rpc.some((c) => c.fn === 'handle_premium_downgrade'), false);
  assertEquals(stub.calls.authUpdates.length, 0);
});

Deno.test('subscription.deleted for a BOUND non-founder downgrades exactly that user (F5)', async () => {
  const stub = makeStub({ profileByCustomerId: { cus_bound: { id: 'u9', is_founder: false } } });
  const body = subDeletedEvent('cus_bound');
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  assertEquals(res.status, 200);
  const dg = stub.calls.rpc.find((c) => c.fn === 'handle_premium_downgrade');
  assertEquals(dg !== undefined, true);
  assertEquals((dg!.args as { target_user: string }).target_user, 'u9');
  // The webhook must NEVER write a stripe_customer_id binding outside checkout.
  assertEquals(stub.calls.profileUpdates.some((u) => 'stripe_customer_id' in u.vals), false);
});

// ── F21/F23: single_dossier binds the paid session to the persisted dossier ──
Deno.test('single_dossier checkout backfills dossier_purchases.stripe_session_id from the checkout_token', async () => {
  const stub = makeStub();
  const body = checkoutEvent(
    { product: 'single_dossier', checkout_token: 'tok_abcdefabcdefabcdefabcdef', supabase_user_id: '' },
    { id: 'cs_paid_1' },
  );
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  assertEquals(res.status, 200);
  const bind = stub.calls.profileUpdates.find(
    (u) => u.table === 'dossier_purchases' && 'stripe_session_id' in u.vals,
  );
  assertEquals(bind !== undefined, true);
  assertEquals(bind!.col, 'checkout_token');
  assertEquals(bind!.val, 'tok_abcdefabcdefabcdefabcdef');
  assertEquals((bind!.vals as { stripe_session_id: string }).stripe_session_id, 'cs_paid_1');
  // No account mutations for an anonymous one-shot.
  assertEquals(stub.calls.authUpdates.length, 0);
});

Deno.test('single_dossier session bind is idempotent on replay (same session id, no throw)', async () => {
  const stub = makeStub();
  const body = checkoutEvent(
    { product: 'single_dossier', checkout_token: 'tok_abcdefabcdefabcdefabcdef', supabase_user_id: '' },
    { id: 'cs_paid_2' },
  );
  const signed = { 'stripe-signature': await sign(body, SECRET) };
  const r1 = await handleStripeWebhook(req(body, signed), stub);
  const r2 = await handleStripeWebhook(req(body, signed), stub);
  assertEquals(r1.status, 200);
  assertEquals(r2.status, 200);
  const binds = stub.calls.profileUpdates.filter(
    (u) => u.table === 'dossier_purchases' && 'stripe_session_id' in u.vals,
  );
  // Both deliveries write the SAME session id to the SAME token row — a no-op
  // on the second pass (idempotent by same value).
  assertEquals(binds.length, 2);
  assertEquals(binds.every((b) => (b.vals as { stripe_session_id: string }).stripe_session_id === 'cs_paid_2'), true);
});

Deno.test('single_dossier without a checkout_token is a no-op bind (not an error)', async () => {
  const stub = makeStub();
  const body = checkoutEvent({ product: 'single_dossier', supabase_user_id: '' }, { id: 'cs_paid_3' });
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  assertEquals(res.status, 200);
  assertEquals(stub.calls.profileUpdates.some((u) => u.table === 'dossier_purchases'), false);
});
