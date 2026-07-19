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

// ── Anonymous single_dossier rate limiter (backend-1) ────────────────────────
// The amplifiable path (mint Stripe sessions + write dossier_purchases with the
// public anon key) must be throttled BEFORE Stripe is reached, like every other
// anon edge fn. The `rateLimit` dep is the injection seam; production passes the
// migration-035-backed limiter with an in-memory backstop.

Deno.test('anonymous single_dossier over the rate limit is rejected (429) before Stripe', async () => {
  const stripe = makeStripe();
  const token = 'x'.repeat(40);
  const res = await handleCreateCheckout(
    req({ product: 'single_dossier', checkoutToken: token }),
    {
      stripeClient: stripe.stripeClient,
      userClient: makeUserClient(null),
      adminClient: makeAdminClient(),
      rateLimit: () => Promise.resolve(false),   // over the limit
    },
  );
  assertEquals(res.status, 429);
  assertEquals(stripe.created.length, 0);         // never reached Stripe
});

Deno.test('the rate limiter gates ONLY the single_dossier path (a credits checkout is not throttled)', async () => {
  const stripe = makeStripe();
  const res = await handleCreateCheckout(
    req({ product: 'credits_25' }, { Authorization: 'Bearer jwt' }),
    {
      stripeClient: stripe.stripeClient,
      userClient: makeUserClient({ id: 'u1', email: 'u1@x.com' }),
      adminClient: makeAdminClient(),
      rateLimit: () => Promise.resolve(false),   // would block if consulted
    },
  );
  // A non-anonymous product never consults the single_dossier limiter.
  assertEquals(res.status, 200);
  assertEquals(stripe.created.length, 1);
});

// ── Founder Lifetime seat cap (advertised 30 seats, enforced server-side) ────
// founder_seats_taken() feeds both the pricing-page counter AND this gate; a
// sold-out founder tier must never reach Stripe.

Deno.test('founder_lifetime with seats remaining creates a checkout session', async () => {
  const stripe = makeStripe();
  const res = await handleCreateCheckout(
    req({ product: 'founder_lifetime' }, { Authorization: 'Bearer jwt' }),
    { stripeClient: stripe.stripeClient, userClient: makeUserClient({ id: 'u1', email: 'u1@x.com' }), adminClient: makeAdminClient('cus_existing', 10) },
  );
  assertEquals(res.status, 200);
  assertEquals(stripe.created.length, 1);
  assertEquals((stripe.created[0].metadata as Record<string, string>).product, 'founder_lifetime');
});

Deno.test('founder_lifetime at the 30-seat cap is rejected (400) and never reaches Stripe', async () => {
  const stripe = makeStripe();
  const res = await handleCreateCheckout(
    req({ product: 'founder_lifetime' }, { Authorization: 'Bearer jwt' }),
    { stripeClient: stripe.stripeClient, userClient: makeUserClient({ id: 'u1', email: 'u1@x.com' }), adminClient: makeAdminClient('cus_existing', 30) },
  );
  assertEquals(res.status, 400);
  assertEquals(stripe.created.length, 0);   // seat 31 is never offered for sale
});

// ── Redeem codes (migration 107) ──────────────────────────────────────────────
// reserve_redemption runs BEFORE the Stripe session exists (server-attached
// discount only — NEVER allow_promotion_codes), bind_redemption_session stamps
// the session id right after create, and every failure path degrades to a
// non-fatal redeemNotice: a bad code must never fail a paying checkout.

/** Admin stub answering the redeem lifecycle + founder counter, recording every rpc. */
function makeRedeemAdminClient(cfg: {
  reservation?: Record<string, unknown> | null;   // reserve_redemption's data payload
  reserveError?: { message: string } | null;
} = {}) {
  const rpcCalls: Array<{ fn: string; args: Record<string, unknown> }> = [];
  // deno-lint-ignore no-explicit-any
  const client: any = {
    from: (_t: string) => ({
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: { stripe_customer_id: 'cus_existing' }, error: null }) }) }),
      update: () => ({ eq: () => Promise.resolve({ error: null }) }),
    }),
    rpc: (fn: string, args: Record<string, unknown> = {}) => {
      rpcCalls.push({ fn, args });
      if (fn === 'founder_seats_taken') return Promise.resolve({ data: 0, error: null });
      if (fn === 'reserve_redemption') {
        return Promise.resolve({ data: cfg.reservation ?? null, error: cfg.reserveError ?? null });
      }
      if (fn === 'bind_redemption_session') return Promise.resolve({ data: { ok: true }, error: null });
      if (fn === 'revert_redemption') return Promise.resolve({ data: { ok: true, redemption_id: 'red_1' }, error: null });
      return Promise.resolve({ data: null, error: { message: `unexpected rpc ${fn}` } });
    },
  };
  return { rpcCalls, adminClient: () => client };
}

Deno.test('a reserved free_month code attaches a SERVER-side discount and binds the session', async () => {
  const stripe = makeStripe();
  const admin = makeRedeemAdminClient({
    reservation: { ok: true, stripe_coupon_id: 'coupon_free_month', kind: 'free_month', credit_amount: null, applies_to: 'subscription', redemption_id: 'red_1' },
  });
  const res = await handleCreateCheckout(
    req({ product: 'premium', redeemCode: '  SFC-TESTTESTTEST  ' }, { Authorization: 'Bearer jwt' }),
    { stripeClient: stripe.stripeClient, userClient: makeUserClient({ id: 'u1', email: 'u1@x.com' }), adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);

  // The reserve used the VERIFIED user id and the trimmed code from the body.
  const reserve = admin.rpcCalls.find((c) => c.fn === 'reserve_redemption');
  assertEquals(reserve !== undefined, true);
  assertEquals(reserve!.args.p_user, 'u1');
  assertEquals(reserve!.args.p_code, 'SFC-TESTTESTTEST');
  assertEquals(reserve!.args.p_mode, 'subscription');   // the mode gate (112) sees the session mode

  // The discount is server-attached from the RPC's coupon id; the checkout
  // page is never opened to arbitrary promotion codes.
  const params = stripe.created[0];
  assertEquals((params.discounts as Array<{ coupon: string }>)[0].coupon, 'coupon_free_month');
  assertEquals('allow_promotion_codes' in params, false);

  // The reserved seat was bound to the created session for the webhook.
  const bind = admin.rpcCalls.find((c) => c.fn === 'bind_redemption_session');
  assertEquals(bind!.args.p_redemption_id, 'red_1');
  assertEquals(bind!.args.p_session_id, 'cs_stub');

  const body = await res.json();
  assertEquals(body.url, 'https://stripe.test/session');
  assertEquals(body.redeemNotice, undefined);      // applied cleanly — no notice
});

Deno.test('a reserved credits-kind code attaches NO discount (the webhook grants on completion)', async () => {
  const stripe = makeStripe();
  const admin = makeRedeemAdminClient({
    reservation: { ok: true, stripe_coupon_id: null, kind: 'credits', credit_amount: 15, applies_to: 'any', redemption_id: 'red_2' },
  });
  const res = await handleCreateCheckout(
    req({ product: 'credits_25', redeemCode: 'SFC-CREDITCODE12' }, { Authorization: 'Bearer jwt' }),
    { stripeClient: stripe.stripeClient, userClient: makeUserClient({ id: 'u1', email: 'u1@x.com' }), adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);
  assertEquals('discounts' in stripe.created[0], false);   // nothing rides the session
  // …but the seat is still bound so apply_redemption can grant the credits.
  const bind = admin.rpcCalls.find((c) => c.fn === 'bind_redemption_session');
  assertEquals(bind!.args.p_redemption_id, 'red_2');
  assertEquals(bind!.args.p_session_id, 'cs_stub');
});

Deno.test('a code that fails to reserve proceeds WITHOUT a discount and returns a redeemNotice', async () => {
  const stripe = makeStripe();
  const admin = makeRedeemAdminClient({
    reservation: { ok: false, reason: 'invalid_code' },
  });
  const res = await handleCreateCheckout(
    req({ product: 'credits_25', redeemCode: 'SFC-NOTACODE0000' }, { Authorization: 'Bearer jwt' }),
    { stripeClient: stripe.stripeClient, userClient: makeUserClient({ id: 'u1', email: 'u1@x.com' }), adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);                           // the paying checkout survives
  assertEquals(stripe.created.length, 1);
  assertEquals('discounts' in stripe.created[0], false);
  assertEquals(admin.rpcCalls.some((c) => c.fn === 'bind_redemption_session'), false);
  const body = await res.json();
  assertEquals(typeof body.redeemNotice, 'string');        // the UI can say it didn't apply
  assertEquals(typeof body.url, 'string');
});

Deno.test('a mode_mismatch reservation returns a notice WITHOUT reverting (no burn)', async () => {
  // A subscription-only code typed into the credit-pack (payment-mode) modal. The mode
  // gate (112) refuses it inside reserve_redemption BEFORE any once-per-user row exists,
  // so create-checkout must NOT run the revert lifecycle that used to burn the code —
  // it just surfaces the non-fatal notice and the paying checkout proceeds.
  const stripe = makeStripe();
  const admin = makeRedeemAdminClient({
    reservation: { ok: false, reason: 'mode_mismatch', applies_to: 'subscription' },
  });
  const res = await handleCreateCheckout(
    req({ product: 'credits_25', redeemCode: 'SFC-SUBONLYCODE0' }, { Authorization: 'Bearer jwt' }),
    { stripeClient: stripe.stripeClient, userClient: makeUserClient({ id: 'u1', email: 'u1@x.com' }), adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);
  assertEquals(stripe.created.length, 1);                        // checkout proceeds at full price
  assertEquals('discounts' in stripe.created[0], false);
  const reserve = admin.rpcCalls.find((c) => c.fn === 'reserve_redemption');
  assertEquals(reserve!.args.p_mode, 'payment');                 // the payment mode was passed in
  // The gate refused before creating a row → nothing to revert or bind → NOT burned.
  assertEquals(admin.rpcCalls.some((c) => c.fn === 'revert_redemption'), false);
  assertEquals(admin.rpcCalls.some((c) => c.fn === 'bind_redemption_session'), false);
  const body = await res.json();
  assertEquals(typeof body.redeemNotice, 'string');
});

Deno.test('an anonymous single_dossier purchase IGNORES the redeem code (never reserves)', async () => {
  const stripe = makeStripe();
  const admin = makeRedeemAdminClient();
  const token = 'x'.repeat(40);
  const res = await handleCreateCheckout(
    req({ product: 'single_dossier', checkoutToken: token, redeemCode: 'SFC-ANONATTEMPT0' }),  // no auth
    { stripeClient: stripe.stripeClient, userClient: makeUserClient(null), adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);
  assertEquals(admin.rpcCalls.some((c) => c.fn === 'reserve_redemption'), false);  // no seat touched
  assertEquals('discounts' in stripe.created[0], false);
  const body = await res.json();
  assertEquals(typeof body.redeemNotice, 'string');        // told why, purchase unharmed
});

// (The former "applies_to mismatch hands the reserved seat back" test is gone: the
// mode gate now lives INSIDE reserve_redemption (112), which refuses a mismatch BEFORE
// any row exists — so create-checkout never receives an ok:true wrong-mode reservation
// to revert. The "a mode_mismatch reservation returns a notice WITHOUT reverting" test
// above covers the replacement behaviour, including that no coupon rides the session.)

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

// ── Durable-rights save binding (migration 108) ───────────────────────────────
// A SIGNED-IN single_dossier buyer may bind the durable re-download right to one
// saved settlement. The save is verified server-side for ownership before it is
// stashed in session.metadata.save_id — a forged/foreign saveId must never bind
// rights to someone else's save (generic 400, no session created). A signed-in
// purchase WITHOUT a saveId stays valid (one-shot semantics). Anonymous ignores it.

/** Admin stub that resolves BOTH the profile read (stripe_customer_id via
 *  .single()) and the settlements ownership read (id + user_id via .maybeSingle()).
 *  `save` is the row the settlements lookup returns (null = not found). Records the
 *  settlements ids queried so a test can assert the lookup happened. */
function makeSaveAdminClient(save: { id: string; user_id: string } | null) {
  const settlementLookups: string[] = [];   // shared across every adminClient() call
  // deno-lint-ignore no-explicit-any
  const factory = (): any => ({
    from: (table: string) => ({
      select: (_cols?: string) => ({
        eq: (_col: string, val: string) => ({
          // profiles read → stripe_customer_id via .single()
          single: () => Promise.resolve({ data: { stripe_customer_id: 'cus_existing' }, error: null }),
          // settlements read → id + user_id via .maybeSingle()
          maybeSingle: () => {
            if (table === 'settlements') {
              settlementLookups.push(val);
              return Promise.resolve({ data: save, error: null });
            }
            return Promise.resolve({ data: null, error: null });
          },
        }),
      }),
      update: () => ({ eq: () => Promise.resolve({ error: null }) }),
    }),
    rpc: (fn: string) => Promise.resolve(
      fn === 'founder_seats_taken' ? { data: 0, error: null } : { data: null, error: { message: `unexpected rpc ${fn}` } },
    ),
  });
  return { factory, settlementLookups };
}

Deno.test('a signed-in single_dossier binds save_id ONLY after ownership verification', async () => {
  const stripe = makeStripe();
  const token = 'x'.repeat(40);
  const admin = makeSaveAdminClient({ id: 'save_1', user_id: 'u1' });   // owned by the buyer
  const res = await handleCreateCheckout(
    req({ product: 'single_dossier', checkoutToken: token, saveId: 'save_1' }, { Authorization: 'Bearer jwt' }),
    { stripeClient: stripe.stripeClient, userClient: makeUserClient({ id: 'u1', email: 'u1@x.com' }), adminClient: admin.factory },
  );
  assertEquals(res.status, 200);
  assertEquals(stripe.created.length, 1);
  const metadata = (stripe.created[0].metadata as Record<string, string>);
  assertEquals(metadata.product, 'single_dossier');
  assertEquals(metadata.supabase_user_id, 'u1');
  assertEquals(metadata.save_id, 'save_1');            // the verified save id rode the metadata
});

Deno.test('a FORGED saveId (a save the buyer does not own) is rejected (400), no session', async () => {
  const stripe = makeStripe();
  const token = 'x'.repeat(40);
  const admin = makeSaveAdminClient({ id: 'save_victim', user_id: 'someone_else' });  // foreign save
  const res = await handleCreateCheckout(
    req({ product: 'single_dossier', checkoutToken: token, saveId: 'save_victim' }, { Authorization: 'Bearer jwt' }),
    { stripeClient: stripe.stripeClient, userClient: makeUserClient({ id: 'u1', email: 'u1@x.com' }), adminClient: admin.factory },
  );
  assertEquals(res.status, 400);
  assertEquals(stripe.created.length, 0);              // a forged binding never reaches Stripe
});

Deno.test('an UNKNOWN saveId (no such save) is rejected (400), no session', async () => {
  const stripe = makeStripe();
  const token = 'x'.repeat(40);
  const admin = makeSaveAdminClient(null);             // settlements lookup misses
  const res = await handleCreateCheckout(
    req({ product: 'single_dossier', checkoutToken: token, saveId: 'save_ghost' }, { Authorization: 'Bearer jwt' }),
    { stripeClient: stripe.stripeClient, userClient: makeUserClient({ id: 'u1', email: 'u1@x.com' }), adminClient: admin.factory },
  );
  assertEquals(res.status, 400);
  assertEquals(stripe.created.length, 0);
});

Deno.test('a signed-in single_dossier WITHOUT a saveId stays valid (one-shot) with empty save_id', async () => {
  const stripe = makeStripe();
  const token = 'x'.repeat(40);
  const admin = makeSaveAdminClient(null);
  const res = await handleCreateCheckout(
    req({ product: 'single_dossier', checkoutToken: token }, { Authorization: 'Bearer jwt' }),  // no saveId
    { stripeClient: stripe.stripeClient, userClient: makeUserClient({ id: 'u1', email: 'u1@x.com' }), adminClient: admin.factory },
  );
  assertEquals(res.status, 200);
  const metadata = (stripe.created[0].metadata as Record<string, string>);
  assertEquals(metadata.save_id, '');                  // no binding, but the purchase proceeds
  assertEquals(admin.settlementLookups.length, 0);     // no ownership read attempted
});

Deno.test('an ANONYMOUS single_dossier IGNORES saveId (never reads settlements, empty save_id)', async () => {
  const stripe = makeStripe();
  const token = 'x'.repeat(40);
  const admin = makeSaveAdminClient({ id: 'save_1', user_id: 'whoever' });
  const res = await handleCreateCheckout(
    req({ product: 'single_dossier', checkoutToken: token, saveId: 'save_1' }),  // no auth → anonymous
    { stripeClient: stripe.stripeClient, userClient: makeUserClient(null), adminClient: admin.factory },
  );
  assertEquals(res.status, 200);
  const metadata = (stripe.created[0].metadata as Record<string, string>);
  assertEquals(metadata.anonymous, 'true');
  assertEquals(metadata.save_id, '');                  // anonymous never binds durable rights
  assertEquals(admin.settlementLookups.length, 0);     // anonymous never reads settlements
});

// ── Delivery stash (dossier_purchases, migration 122) ───────────────────────
// Ported OURS-only lane: an anonymous single_dossier buyer's settlement is
// persisted server-side (keyed on checkout_token) BEFORE the Stripe session, the
// size guard is an early return (buyer sees it pre-payment), and the success URL
// echoes the delivery token (dt) so a wiped localStorage can still recover it.

/** Admin stub that records dossier_purchases upserts (the delivery stash). */
function makeStashAdmin() {
  const upserts: Array<{ row: Record<string, unknown>; opts: unknown }> = [];
  // deno-lint-ignore no-explicit-any
  const adminClient = (): any => ({
    from: (_t: string) => ({
      upsert: (row: Record<string, unknown>, opts: unknown) => {
        upserts.push({ row, opts });
        return Promise.resolve({ error: null });
      },
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: { stripe_customer_id: null }, error: null }) }) }),
      update: () => ({ eq: () => Promise.resolve({ error: null }) }),
    }),
    rpc: (_fn: string) => Promise.resolve({ data: 0, error: null }),
  });
  return { upserts, adminClient };
}

Deno.test('an OVERSIZED settlement is rejected (413) BEFORE any Stripe call or persist', async () => {
  const stripe = makeStripe();
  const admin = makeStashAdmin();
  const huge = { blob: 'x'.repeat(520 * 1024) };   // > MAX_DOSSIER_BYTES (512KB)
  const res = await handleCreateCheckout(
    req({ product: 'single_dossier', checkoutToken: 't'.repeat(40), settlement: huge }),
    { stripeClient: stripe.stripeClient, userClient: makeUserClient(null), adminClient: admin.adminClient },
  );
  assertEquals(res.status, 413);
  assertEquals(stripe.created.length, 0);   // rejected pre-payment
  assertEquals(admin.upserts.length, 0);    // and never persisted
});

Deno.test('an anonymous single_dossier persists the settlement + byte_size, then creates the session with a dt token', async () => {
  const stripe = makeStripe();
  const admin = makeStashAdmin();
  const token = 't'.repeat(40);
  const settlement = { name: 'Riverbend', tier: 'village', population: 400 };
  const res = await handleCreateCheckout(
    req({ product: 'single_dossier', checkoutToken: token, settlement }),   // no auth → anonymous
    { stripeClient: stripe.stripeClient, userClient: makeUserClient(null), adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);
  // The settlement was stashed on the checkout_token with its byte size.
  assertEquals(admin.upserts.length, 1);
  assertEquals(admin.upserts[0].row.checkout_token, token);
  assertEquals(admin.upserts[0].row.settlement, settlement);
  assertEquals(typeof admin.upserts[0].row.byte_size, 'number');
  // The session was created and its success URL carries the delivery token (dt).
  assertEquals(stripe.created.length, 1);
  const successUrl = String(stripe.created[0].success_url);
  assertEquals(successUrl.includes(`dt=${token}`), true);
});

Deno.test('a single_dossier WITHOUT a settlement still creates the session (client stash fallback)', async () => {
  const stripe = makeStripe();
  const admin = makeStashAdmin();
  const res = await handleCreateCheckout(
    req({ product: 'single_dossier', checkoutToken: 't'.repeat(40) }),   // no settlement
    { stripeClient: stripe.stripeClient, userClient: makeUserClient(null), adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);
  assertEquals(admin.upserts.length, 0);    // nothing to stash server-side
  assertEquals(stripe.created.length, 1);   // checkout still proceeds
});

// ── Wave-D human verification (Turnstile) ─────────────────────────────────────
// verifyTurnstile gates the session-creation door BEFORE any Stripe call. It is
// INERT (a no-op, ok:true) until TURNSTILE_SECRET_KEY is set — so the money path
// is byte-identical while unconfigured — and FAILS CLOSED (403) when active: a
// missing/failed token shows the house-register error and never reaches Stripe.
// verifyTurnstile itself is pinned in _shared/verifyTurnstile.test.ts; these pin
// the create-checkout WIRING (inert byte-path, fail-closed, active happy path).

/** Stub globalThis.fetch so a secret-configured verifyTurnstile resolves a known
 *  siteverify verdict without touching the network. Returns a restore fn. */
function stubFetch(success: boolean): () => void {
  const original = globalThis.fetch;
  // deno-lint-ignore no-explicit-any
  globalThis.fetch = (() => Promise.resolve(new Response(JSON.stringify({ success }), { status: 200 }))) as any;
  return () => { globalThis.fetch = original; };
}

Deno.test('INERT: a captchaToken in the body does not change the flow while unconfigured (byte-identical)', async () => {
  Deno.env.delete('TURNSTILE_SECRET_KEY');
  const stripe = makeStripe();
  const res = await handleCreateCheckout(
    req({ product: 'credits_25', captchaToken: 'anything' }, { Authorization: 'Bearer jwt' }),
    { stripeClient: stripe.stripeClient, userClient: makeUserClient({ id: 'u1', email: 'u1@x.com' }), adminClient: makeAdminClient() },
  );
  assertEquals(res.status, 200);            // inert → the token is a no-op
  assertEquals(stripe.created.length, 1);   // checkout proceeds exactly as before
});

Deno.test('ACTIVE + a MISSING token FAILS CLOSED (403) before any Stripe call', async () => {
  Deno.env.set('TURNSTILE_SECRET_KEY', 'sk_test');
  try {
    const stripe = makeStripe();
    const res = await handleCreateCheckout(
      req({ product: 'credits_25' }, { Authorization: 'Bearer jwt' }),   // no captchaToken
      { stripeClient: stripe.stripeClient, userClient: makeUserClient({ id: 'u1', email: 'u1@x.com' }), adminClient: makeAdminClient() },
    );
    assertEquals(res.status, 403);
    assertEquals(stripe.created.length, 0);   // the door never opened
  } finally {
    Deno.env.delete('TURNSTILE_SECRET_KEY');
  }
});

Deno.test('ACTIVE + a VALID token proceeds (200) to Stripe', async () => {
  Deno.env.set('TURNSTILE_SECRET_KEY', 'sk_test');
  const restore = stubFetch(true);
  try {
    const stripe = makeStripe();
    const res = await handleCreateCheckout(
      req({ product: 'credits_25', captchaToken: 'good-token' }, { Authorization: 'Bearer jwt' }),
      { stripeClient: stripe.stripeClient, userClient: makeUserClient({ id: 'u1', email: 'u1@x.com' }), adminClient: makeAdminClient() },
    );
    assertEquals(res.status, 200);
    assertEquals(stripe.created.length, 1);
  } finally {
    restore();
    Deno.env.delete('TURNSTILE_SECRET_KEY');
  }
});

Deno.test('ACTIVE + a FAILED token is rejected (403) before Stripe', async () => {
  Deno.env.set('TURNSTILE_SECRET_KEY', 'sk_test');
  const restore = stubFetch(false);
  try {
    const stripe = makeStripe();
    const res = await handleCreateCheckout(
      req({ product: 'credits_25', captchaToken: 'bad-token' }, { Authorization: 'Bearer jwt' }),
      { stripeClient: stripe.stripeClient, userClient: makeUserClient({ id: 'u1', email: 'u1@x.com' }), adminClient: makeAdminClient() },
    );
    assertEquals(res.status, 403);
    assertEquals(stripe.created.length, 0);
  } finally {
    restore();
    Deno.env.delete('TURNSTILE_SECRET_KEY');
  }
});
