/**
 * index.test.ts — EXECUTION test for verify-checkout-session (finding F23).
 * Runs under `deno task test:edge`.
 *
 * The client must not trust the ?checkout=success URL. This endpoint confirms a
 * session is paid AND belongs to the authenticated caller. `deps.stripe` /
 * `deps.resolveUser` are injection seams (no network, no real JWT).
 */
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';

Deno.env.set('STRIPE_SECRET_KEY', 'sk_test_dummy');
Deno.env.set('SUPABASE_URL', 'https://stub.supabase.co');
Deno.env.set('SUPABASE_ANON_KEY', 'anon_dummy');

const { handleVerifyCheckoutSession } = await import('./index.ts');

const SESSION_ID = 'cs_test_xyz789';

// deno-lint-ignore no-explicit-any
function stripeReturning(session: any) {
  return { checkout: { sessions: { retrieve: () => Promise.resolve(session) } } };
}
const stripeThrowing = { checkout: { sessions: { retrieve: () => Promise.reject(new Error('stripe down')) } } };

const session = (over: Record<string, unknown> = {}) => ({
  id: SESSION_ID,
  status: 'complete',
  payment_status: 'paid',
  metadata: { product: 'premium', supabase_user_id: 'user_owner' },
  ...over,
});

const post = (body: unknown) =>
  new Request('https://edge/verify-checkout-session', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: 'Bearer jwt' },
    body: JSON.stringify(body),
  });

const asUser = (id: string | null) => (id ? () => Promise.resolve({ id }) : () => Promise.resolve(null));

Deno.test('paid session belonging to the caller verifies (200, verified:true)', async () => {
  // deno-lint-ignore no-explicit-any
  const deps: any = { stripe: stripeReturning(session()), resolveUser: asUser('user_owner') };
  const res = await handleVerifyCheckoutSession(post({ sessionId: SESSION_ID }), deps);
  assertEquals(res.status, 200);
  const json = await res.json();
  assertEquals(json.verified, true);
  assertEquals(json.product, 'premium');
});

Deno.test('unpaid session for the caller is verified:false (200)', async () => {
  // deno-lint-ignore no-explicit-any
  const deps: any = { stripe: stripeReturning(session({ payment_status: 'unpaid' })), resolveUser: asUser('user_owner') };
  const res = await handleVerifyCheckoutSession(post({ sessionId: SESSION_ID }), deps);
  assertEquals(res.status, 200);
  const json = await res.json();
  assertEquals(json.verified, false);
});

Deno.test('a session owned by a DIFFERENT user is a terminal 403', async () => {
  // deno-lint-ignore no-explicit-any
  const deps: any = { stripe: stripeReturning(session()), resolveUser: asUser('someone_else') };
  const res = await handleVerifyCheckoutSession(post({ sessionId: SESSION_ID }), deps);
  assertEquals(res.status, 403);
  const json = await res.json();
  assertEquals(json.verified, false);
});

Deno.test('missing auth is a 401', async () => {
  // deno-lint-ignore no-explicit-any
  const deps: any = { stripe: stripeReturning(session()), resolveUser: asUser(null) };
  const res = await handleVerifyCheckoutSession(post({ sessionId: SESSION_ID }), deps);
  assertEquals(res.status, 401);
});

Deno.test('Stripe failure is a transient 503', async () => {
  // deno-lint-ignore no-explicit-any
  const deps: any = { stripe: stripeThrowing, resolveUser: asUser('user_owner') };
  const res = await handleVerifyCheckoutSession(post({ sessionId: SESSION_ID }), deps);
  assertEquals(res.status, 503);
});

Deno.test('malformed session id is a terminal 400', async () => {
  // deno-lint-ignore no-explicit-any
  const deps: any = { stripe: stripeReturning(session()), resolveUser: asUser('user_owner') };
  const res = await handleVerifyCheckoutSession(post({ sessionId: 'nope' }), deps);
  assertEquals(res.status, 400);
});

// ── CORS: migrated to the shared fail-closed module (round-1 backend-5 /
// backend-functions-2, W-R2-TRUST). The legacy inline allowlist emitted
// `origin || '*'` — a wildcard on a MISSING Origin, the exact leak the shared
// module forbids. These pin that no code path (preflight, disallowed origin,
// missing origin) ever returns '*'.
const optionsReq = (origin?: string) =>
  new Request('https://edge/verify-checkout-session', {
    method: 'OPTIONS',
    headers: origin ? { origin } : {},
  });

Deno.test('CORS: OPTIONS preflight with a MISSING Origin never returns "*" (the old leak)', async () => {
  const res = await handleVerifyCheckoutSession(optionsReq(), {});
  const acao = res.headers.get('Access-Control-Allow-Origin');
  assertEquals(acao === '*', false);
  assertEquals(acao, 'https://settlementforge.com'); // pinned to the first allowed host
});

Deno.test('CORS: a DISALLOWED origin is pinned to the first host, never "*"', async () => {
  const res = await handleVerifyCheckoutSession(optionsReq('https://evil.example.com'), {});
  const acao = res.headers.get('Access-Control-Allow-Origin');
  assertEquals(acao === '*', false);
  assertEquals(acao, 'https://settlementforge.com');
});

Deno.test('CORS: an ALLOWED origin is echoed with Allow-Credentials from the shared module', async () => {
  const res = await handleVerifyCheckoutSession(optionsReq('https://settlementforge.com'), {});
  assertEquals(res.headers.get('Access-Control-Allow-Origin'), 'https://settlementforge.com');
  assertEquals(res.headers.get('Access-Control-Allow-Credentials'), 'true');
});
