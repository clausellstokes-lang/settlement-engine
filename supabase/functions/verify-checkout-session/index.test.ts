/**
 * index.test.ts — EXECUTION test for verify-checkout-session (finding F23).
 * Runs under `deno task test:edge`.
 *
 * The client must not trust the ?checkout=success URL. This endpoint confirms a
 * session is paid AND belongs to the authenticated caller. `deps.stripe` /
 * `deps.resolveUser` / `deps.rateLimit` are injection seams (no network, no real
 * JWT). The default rateLimit (checkUserIpRate, 'vcs' prefix) is FAIL-CLOSED, so
 * every non-OPTIONS case injects allowAll — same idiom as verify-single-dossier.
 */
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { installScopedTestEnv } from '../_shared/scopedTestEnv.ts';

const scopedEnv = installScopedTestEnv({
  STRIPE_SECRET_KEY: 'sk_test_dummy',
  SUPABASE_URL: 'https://stub.supabase.co',
  SUPABASE_ANON_KEY: 'anon_dummy',
});

const { handleVerifyCheckoutSession } = await import('./index.ts');
// The import above has read the stubs at module scope; hand the ambient environment
// back so nothing this suite supplied is visible while any OTHER suite runs.
scopedEnv.release();

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

const allowAll = () => Promise.resolve(true);
const denyAll = () => Promise.resolve(false);

/** Recording Stripe stub: counts retrievals so ordering pins can assert the
 *  amplifiable call was never made. Mirrors verify-single-dossier's makeStripe. */
// deno-lint-ignore no-explicit-any
function makeStripe(sessionObj: any) {
  const retrievals: string[] = [];
  const stripeClient = {
    checkout: {
      sessions: {
        retrieve: (id: string) => { retrievals.push(id); return Promise.resolve(sessionObj); },
      },
    },
  };
  // deno-lint-ignore no-explicit-any
  return { retrievals, stripe: stripeClient as any };
}

/**
 * ⛔⛔ THE LEAK-ABSENCE PIN, AND THIS IS THE FILE THAT EARNED IT. `deno test` runs every
 * edge suite in ONE process with ONE `Deno.env`; an unrestored module-top
 * `Deno.env.set('CLIENT_URL', 'https://settlementforge.example')` in
 * `operator-message-worker` (alphabetically `o…`, so ahead of this `v…`) re-pointed
 * `cors.ts`'s FIRST allowed origin and red this file's CORS pins in the deno-tests CI job.
 *
 * ⭐ IT ASSERTS FOREIGN STUB **VALUES**, NEVER "THE KEY IS UNSET", and that is deliberate:
 * a real deployment shell may legitimately export any of these names, so an unset-check
 * would be a flake on somebody's machine. Each literal below can only be present because
 * some OTHER suite put it there and failed to take it back, which is exactly the defect.
 *
 * ⚠ IT IS NOT A SUBSTITUTE FOR THE SOURCE SCAN, AND NEITHER IS A SUBSTITUTE FOR IT: the
 * scan (scripts/edgeEnvScopeGuard.mjs, run by `npm run validate:edge`) refuses the SHAPE
 * that causes leaks; this pin refuses the leak itself, at runtime, in the shared process
 * where it actually happens.
 */
scopedEnv.test('no earlier edge suite leaked its own env stubs into this process', () => {
  const foreignStubs: Array<[string, string, string]> = [
    ['CLIENT_URL', 'https://settlementforge.example', 'operator-message-worker'],
    ['EXPORT_SHARED_SECRET', 'sekrit', 'analytics-export'],
    ['ANALYTICS_HASH_PEPPER', 'test_pepper', 'log-client-error'],
    ['STRIPE_PRICE_SEAT_TRANSFER', 'price_transfer', 'founder-transfer'],
  ];
  for (const [key, poison, owner] of foreignStubs) {
    assertEquals(
      Deno.env.get(key) === poison,
      false,
      `${key} still holds ${owner}'s scoped stub (${poison}) — that suite's `
      + 'installScopedTestEnv scope did not restore. See _shared/scopedTestEnv.ts.',
    );
  }
  // NON-VACUITY: the four names above must be the ones the suites really use, or this pin
  // watches nothing. This suite's OWN stub proves the reader works at all.
  assertEquals(Deno.env.get('STRIPE_SECRET_KEY'), 'sk_test_dummy');
});

scopedEnv.test('paid session belonging to the caller verifies (200, verified:true)', async () => {
  // deno-lint-ignore no-explicit-any
  const deps: any = { stripe: stripeReturning(session()), resolveUser: asUser('user_owner'), rateLimit: allowAll };
  const res = await handleVerifyCheckoutSession(post({ sessionId: SESSION_ID }), deps);
  assertEquals(res.status, 200);
  const json = await res.json();
  assertEquals(json.verified, true);
  assertEquals(json.product, 'premium');
});

scopedEnv.test('unpaid session for the caller is verified:false (200)', async () => {
  // deno-lint-ignore no-explicit-any
  const deps: any = { stripe: stripeReturning(session({ payment_status: 'unpaid' })), resolveUser: asUser('user_owner'), rateLimit: allowAll };
  const res = await handleVerifyCheckoutSession(post({ sessionId: SESSION_ID }), deps);
  assertEquals(res.status, 200);
  const json = await res.json();
  assertEquals(json.verified, false);
});

scopedEnv.test('a session owned by a DIFFERENT user is a terminal 403', async () => {
  // deno-lint-ignore no-explicit-any
  const deps: any = { stripe: stripeReturning(session()), resolveUser: asUser('someone_else'), rateLimit: allowAll };
  const res = await handleVerifyCheckoutSession(post({ sessionId: SESSION_ID }), deps);
  assertEquals(res.status, 403);
  const json = await res.json();
  assertEquals(json.verified, false);
});

scopedEnv.test('missing auth is a 401', async () => {
  // deno-lint-ignore no-explicit-any
  const deps: any = { stripe: stripeReturning(session()), resolveUser: asUser(null), rateLimit: allowAll };
  const res = await handleVerifyCheckoutSession(post({ sessionId: SESSION_ID }), deps);
  assertEquals(res.status, 401);
});

scopedEnv.test('Stripe failure is a transient 503', async () => {
  // deno-lint-ignore no-explicit-any
  const deps: any = { stripe: stripeThrowing, resolveUser: asUser('user_owner'), rateLimit: allowAll };
  const res = await handleVerifyCheckoutSession(post({ sessionId: SESSION_ID }), deps);
  assertEquals(res.status, 503);
});

scopedEnv.test('malformed session id is a terminal 400', async () => {
  // deno-lint-ignore no-explicit-any
  const deps: any = { stripe: stripeReturning(session()), resolveUser: asUser('user_owner'), rateLimit: allowAll };
  const res = await handleVerifyCheckoutSession(post({ sessionId: 'nope' }), deps);
  assertEquals(res.status, 400);
});

// ── Rate limiter (CYCLE-3 Wave 8 M23): this was the last money endpoint with no
// server-side rate limit. The `rateLimit` dep is the injection seam; production
// passes nothing and gets the FAIL-CLOSED checkUserIpRate default ('vcs' prefix,
// per-user 30/h + per-IP 90/h). Same test idiom as verify-single-dossier.

scopedEnv.test('over-limit is a 429 before Stripe is called (amplification guard)', async () => {
  const stripe = makeStripe(session());
  const res = await handleVerifyCheckoutSession(
    post({ sessionId: SESSION_ID }),
    { stripe: stripe.stripe, resolveUser: asUser('user_owner'), rateLimit: denyAll },
  );
  assertEquals(res.status, 429);
  const body = await res.json();
  assertEquals(body.verified, false);
  assertEquals(stripe.retrievals.length, 0);   // never hit Stripe
});

scopedEnv.test('under-limit passes through untouched (200, verified:true, one Stripe retrieve)', async () => {
  const stripe = makeStripe(session());
  const res = await handleVerifyCheckoutSession(
    post({ sessionId: SESSION_ID }),
    { stripe: stripe.stripe, resolveUser: asUser('user_owner'), rateLimit: allowAll },
  );
  assertEquals(res.status, 200);
  assertEquals((await res.json()).verified, true);
  assertEquals(stripe.retrievals, [SESSION_ID]);
});

scopedEnv.test('the limiter is keyed on the JWT-verified user id, never body-supplied', async () => {
  const seen: string[] = [];
  const recordingAllow = (_req: Request, userId: string) => { seen.push(userId); return Promise.resolve(true); };
  // deno-lint-ignore no-explicit-any
  const deps: any = { stripe: stripeReturning(session()), resolveUser: asUser('user_owner'), rateLimit: recordingAllow };
  await handleVerifyCheckoutSession(post({ sessionId: SESSION_ID }), deps);
  assertEquals(seen, ['user_owner']);
});

scopedEnv.test('an unauthenticated caller is 401d WITHOUT consulting (or burning) any rate budget', async () => {
  let consulted = 0;
  const countingDeny = () => { consulted += 1; return Promise.resolve(false); };
  // deno-lint-ignore no-explicit-any
  const deps: any = { stripe: stripeReturning(session()), resolveUser: asUser(null), rateLimit: countingDeny };
  const res = await handleVerifyCheckoutSession(post({ sessionId: SESSION_ID }), deps);
  assertEquals(res.status, 401);
  assertEquals(consulted, 0);
});

scopedEnv.test('a malformed session id is 400d before the limiter (garbage never consumes budget)', async () => {
  let consulted = 0;
  const countingDeny = () => { consulted += 1; return Promise.resolve(false); };
  // deno-lint-ignore no-explicit-any
  const deps: any = { stripe: stripeReturning(session()), resolveUser: asUser('user_owner'), rateLimit: countingDeny };
  const res = await handleVerifyCheckoutSession(post({ sessionId: 'nope' }), deps);
  assertEquals(res.status, 400);
  assertEquals(consulted, 0);
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

/**
 * Run a CORS pin against THIS FILE'S OWN env rather than whatever an earlier
 * suite left in the process.
 *
 * WHY: deno.json's `test:edge` task runs `deno test` WITHOUT `--parallel`, so
 * every edge suite shares ONE process and ONE `Deno.env`, and `_shared/cors.ts`
 * re-reads CLIENT_URL / ALLOWED_ORIGINS per request. "The first allowed host" is
 * CLIENT_URL when one is configured, so an alphabetically EARLIER suite's
 * unrestored `Deno.env.set('CLIENT_URL', …)` silently re-pointed the exact value
 * these pins assert (it red the deno-tests CI job with
 * `https://settlementforge.example`). Clearing both keys states the pins' real
 * precondition — NOTHING configured — which is also what keeps them
 * non-vacuous: with no CLIENT_URL to echo, the asserted host can only come from
 * cors.ts's own STATIC_ORIGINS. The ambient values are put back afterwards so
 * this file leaks nothing in its turn.
 *
 * NB: clearing CLIENT_URL also makes cors.ts's `isDevDeployment()` true, which
 * enables its localhost-any-port rule. That is deliberate and irrelevant here —
 * none of these three origins is a localhost origin — so do not "tidy" it by
 * setting CLIENT_URL to the host being asserted, which would make the pin echo
 * a value this file supplied.
 */
async function withNoConfiguredOrigins(body: () => Promise<void>): Promise<void> {
  const priorClientUrl = Deno.env.get('CLIENT_URL');
  const priorAllowedOrigins = Deno.env.get('ALLOWED_ORIGINS');
  Deno.env.delete('CLIENT_URL');
  Deno.env.delete('ALLOWED_ORIGINS');
  try {
    await body();
  } finally {
    if (priorClientUrl === undefined) Deno.env.delete('CLIENT_URL');
    else Deno.env.set('CLIENT_URL', priorClientUrl);
    if (priorAllowedOrigins === undefined) Deno.env.delete('ALLOWED_ORIGINS');
    else Deno.env.set('ALLOWED_ORIGINS', priorAllowedOrigins);
  }
}

scopedEnv.test('CORS: OPTIONS preflight with a MISSING Origin never returns "*" (the old leak)', () =>
  withNoConfiguredOrigins(async () => {
    const res = await handleVerifyCheckoutSession(optionsReq(), {});
    const acao = res.headers.get('Access-Control-Allow-Origin');
    assertEquals(acao === '*', false);
    assertEquals(acao, 'https://settlementforge.com'); // pinned to the first allowed host
  }));

scopedEnv.test('CORS: a DISALLOWED origin is pinned to the first host, never "*"', () =>
  withNoConfiguredOrigins(async () => {
    const res = await handleVerifyCheckoutSession(optionsReq('https://evil.example.com'), {});
    const acao = res.headers.get('Access-Control-Allow-Origin');
    assertEquals(acao === '*', false);
    assertEquals(acao, 'https://settlementforge.com');
  }));

scopedEnv.test('CORS: an ALLOWED origin is echoed with Allow-Credentials from the shared module', () =>
  withNoConfiguredOrigins(async () => {
    const res = await handleVerifyCheckoutSession(optionsReq('https://settlementforge.com'), {});
    assertEquals(res.headers.get('Access-Control-Allow-Origin'), 'https://settlementforge.com');
    assertEquals(res.headers.get('Access-Control-Allow-Credentials'), 'true');
  }));
