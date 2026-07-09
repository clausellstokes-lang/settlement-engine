/**
 * index.test.ts — EXECUTION test for verify-single-dossier (findings F21/F23).
 * Runs under `deno task test:edge`.
 *
 * Proves: a verified paid session returns the server-persisted settlement and
 * stamps the claim; a missing row falls back to settlement:null; a mismatch is a
 * terminal 403; Stripe failure is a transient 503; over-limit is 429.
 * `deps.stripe` / `deps.adminClient` are injection seams (no network).
 */
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';

Deno.env.set('STRIPE_SECRET_KEY', 'sk_test_dummy');
Deno.env.set('SUPABASE_URL', 'https://stub.supabase.co');
Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'service_role_dummy');

const { handleVerifySingleDossier } = await import('./index.ts');

const SESSION_ID = 'cs_test_abc123';
const TOKEN = 'tok_abcdefabcdefabcdefabcdef';

// deno-lint-ignore no-explicit-any
function makeAdmin({ allowed = true, row = null as any } = {}) {
  const calls = { rpc: [] as unknown[], updates: [] as { col: string; val: string }[] };
  const client = {
    rpc: (fn: string, args: unknown) => { calls.rpc.push({ fn, args }); return Promise.resolve({ data: { allowed }, error: null }); },
    from: (_table: string) => ({
      select: () => ({ eq: () => ({ maybeSingle: () => Promise.resolve({ data: row, error: null }) }) }),
      update: () => ({ eq: (c: string, v: string) => { calls.updates.push({ col: c, val: v }); return Promise.resolve({ error: null }); } }),
    }),
  };
  return { calls, adminClient: () => client };
}

// deno-lint-ignore no-explicit-any
function stripeReturning(session: any) {
  return { checkout: { sessions: { retrieve: () => Promise.resolve(session) } } };
}
const stripeThrowing = { checkout: { sessions: { retrieve: () => Promise.reject(new Error('stripe down')) } } };

const paidSession = {
  id: SESSION_ID,
  status: 'complete',
  payment_status: 'paid',
  metadata: { product: 'single_dossier', checkout_token: TOKEN },
};

const post = (body: unknown) =>
  new Request('https://edge/verify-single-dossier', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

Deno.test('verified paid session returns the persisted settlement and stamps the claim', async () => {
  const admin = makeAdmin({ row: { settlement: { name: 'Greycairn' } } });
  // deno-lint-ignore no-explicit-any
  const deps: any = { stripe: stripeReturning(paidSession), adminClient: admin.adminClient };
  const res = await handleVerifySingleDossier(post({ sessionId: SESSION_ID, checkoutToken: TOKEN }), deps);
  assertEquals(res.status, 200);
  const json = await res.json();
  assertEquals(json.verified, true);
  assertEquals(json.settlement.name, 'Greycairn');
  // claimed_at stamped on the matched row.
  assertEquals(admin.calls.updates.some((u) => u.col === 'checkout_token' && u.val === TOKEN), true);
});

Deno.test('verified paid session with a MISSING row falls back to settlement:null (client stash covers it)', async () => {
  const admin = makeAdmin({ row: null });
  // deno-lint-ignore no-explicit-any
  const deps: any = { stripe: stripeReturning(paidSession), adminClient: admin.adminClient };
  const res = await handleVerifySingleDossier(post({ sessionId: SESSION_ID, checkoutToken: TOKEN }), deps);
  assertEquals(res.status, 200);
  const json = await res.json();
  assertEquals(json.verified, true);
  assertEquals(json.settlement, null);
  // No row → no claim stamp.
  assertEquals(admin.calls.updates.length, 0);
});

Deno.test('token mismatch is a terminal 403', async () => {
  const admin = makeAdmin({ row: { settlement: { name: 'Greycairn' } } });
  // deno-lint-ignore no-explicit-any
  const deps: any = { stripe: stripeReturning(paidSession), adminClient: admin.adminClient };
  const res = await handleVerifySingleDossier(post({ sessionId: SESSION_ID, checkoutToken: 'tok_wrongwrongwrongwrongwr' }), deps);
  assertEquals(res.status, 403);
  const json = await res.json();
  assertEquals(json.verified, false);
});

Deno.test('unpaid session is a terminal 403', async () => {
  const admin = makeAdmin();
  const unpaid = { ...paidSession, payment_status: 'unpaid' };
  // deno-lint-ignore no-explicit-any
  const deps: any = { stripe: stripeReturning(unpaid), adminClient: admin.adminClient };
  const res = await handleVerifySingleDossier(post({ sessionId: SESSION_ID, checkoutToken: TOKEN }), deps);
  assertEquals(res.status, 403);
});

Deno.test('Stripe failure is a transient 503 (client can retry)', async () => {
  const admin = makeAdmin();
  // deno-lint-ignore no-explicit-any
  const deps: any = { stripe: stripeThrowing, adminClient: admin.adminClient };
  const res = await handleVerifySingleDossier(post({ sessionId: SESSION_ID, checkoutToken: TOKEN }), deps);
  assertEquals(res.status, 503);
});

Deno.test('over the rate limit is a 429', async () => {
  const admin = makeAdmin({ allowed: false });
  // deno-lint-ignore no-explicit-any
  const deps: any = { stripe: stripeReturning(paidSession), adminClient: admin.adminClient };
  const res = await handleVerifySingleDossier(post({ sessionId: SESSION_ID, checkoutToken: TOKEN }), deps);
  assertEquals(res.status, 429);
});

Deno.test('malformed request is a terminal 400', async () => {
  const admin = makeAdmin();
  // deno-lint-ignore no-explicit-any
  const deps: any = { stripe: stripeReturning(paidSession), adminClient: admin.adminClient };
  const res = await handleVerifySingleDossier(post({ sessionId: 'not-a-session', checkoutToken: TOKEN }), deps);
  assertEquals(res.status, 400);
});
