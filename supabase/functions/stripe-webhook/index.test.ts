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
      // Chainable select builder: supports any number of .eq() before .maybeSingle()
      // (the checkout dedup chains .eq('source',…).eq('metadata->>stripe_session_id',…)).
      select: () => {
        const builder = { eq: () => builder, ilike: () => builder, maybeSingle: () => Promise.resolve({ data: null, error: null }) };
        return builder;
      },
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

// ── Async payment methods (payment_status guard) ─────────────────────────────
// Delayed-notification methods (ACH debit, some wallets) fire
// checkout.session.completed with payment_status='unpaid' BEFORE the money
// settles — fulfillment must wait for checkout.session.async_payment_succeeded.

Deno.test('an UNPAID checkout.session.completed does NOT fulfil (no grant, no upgrade)', async () => {
  const stub = makeStub();
  const body = checkoutEvent({ supabase_user_id: 'u1', credits: '60' }, { payment_status: 'unpaid' });
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  assertEquals(res.status, 200);                                           // ack — Stripe should NOT retry
  assertEquals(stub.calls.rpc.length, 0);                                  // no credit grant
  assertEquals(stub.calls.authUpdates.length, 0);                          // no tier change
  assertEquals(stub.calls.profileUpdates.length, 0);
});

Deno.test('an UNPAID premium checkout does NOT upgrade the user', async () => {
  const stub = makeStub();
  const body = checkoutEvent({ supabase_user_id: 'u1', product: 'premium' }, { payment_status: 'unpaid' });
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  assertEquals(res.status, 200);
  assertEquals(stub.calls.authUpdates.length, 0);
  assertEquals(stub.calls.rpc.some((c) => c.fn === 'restore_premium_settlements'), false);
});

Deno.test('checkout.session.async_payment_succeeded fulfils once the async payment settles', async () => {
  const stub = makeStub();
  const body = JSON.stringify({
    id: 'evt_async_1', type: 'checkout.session.async_payment_succeeded',
    data: { object: { id: 'cs_async_1', payment_status: 'paid', metadata: { supabase_user_id: 'u1', credits: '60' } } },
  });
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  assertEquals(res.status, 200);
  const grant = stub.calls.rpc.find((c) => c.fn === 'system_grant_credits');
  assertEquals(grant !== undefined, true);
  assertEquals((grant!.args as { amount: number }).amount, 60);
});

Deno.test('a PAID checkout.session.completed still fulfils (guard only blocks unpaid)', async () => {
  const stub = makeStub();
  const body = checkoutEvent({ supabase_user_id: 'u1', product: 'premium' }, { payment_status: 'paid' });
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  assertEquals(res.status, 200);
  assertEquals(stub.calls.authUpdates.length, 1);
});

// ── Monthly allowance (invoice.paid / invoice.payment_succeeded) ──────────────
// Subscription renewals grant 30 expiring credits/month. Stripe delivers
// at-least-once AND fires invoice.paid + invoice.payment_succeeded for the same
// invoice — so the path must grant EXACTLY ONCE per invoice id. (review B16 #10)

/** Richer stub for the invoice path: profile lookup by stripe_customer_id resolves
 *  a user, and the credit_ledger dedup reports an invoice as already-granted once
 *  the test records it. `granted` is the set of invoice ids the handler has granted. */
function makeInvoiceStub() {
  const granted = new Set<string>();
  const rpc: Array<{ fn: string; args: unknown }> = [];
  const client = {
    auth: { admin: { updateUserById: () => Promise.resolve({ error: null }) } },
    from: (table: string) => ({
      select: (_cols?: string) => {
        // chainable .eq() that ends in .maybeSingle()
        const chain: Record<string, string> = {};
        const builder = {
          eq: (col: string, val: string) => { chain[col] = val; return builder; },
          ilike: () => builder,
          maybeSingle: () => {
            if (table === 'profiles') {
              return Promise.resolve({ data: { id: 'sub_user', is_founder: false }, error: null });
            }
            if (table === 'credit_ledger') {
              // dedup: report existing only when this invoice was already granted.
              const invoiceId = chain['metadata->>stripe_invoice_id'];
              return Promise.resolve({ data: granted.has(invoiceId) ? { id: 'existing' } : null, error: null });
            }
            return Promise.resolve({ data: null, error: null });
          },
        };
        return builder;
      },
      update: () => ({ eq: () => Promise.resolve({ error: null }) }),
    }),
    rpc: (fn: string, args: unknown) => {
      rpc.push({ fn, args });
      if (fn === 'system_grant_credits') {
        const meta = (args as { metadata?: { stripe_invoice_id?: string } }).metadata;
        if (meta?.stripe_invoice_id) granted.add(meta.stripe_invoice_id);
      }
      return Promise.resolve({ error: null });
    },
  };
  return { rpc, granted, adminClient: () => client };
}

const invoiceEvent = (type: string, invoiceId: string, billingReason = 'subscription_cycle') =>
  JSON.stringify({
    id: `evt_${invoiceId}_${type}`,
    type,
    data: { object: { id: invoiceId, customer: 'cus_sub', customer_email: 'sub@x.com', billing_reason: billingReason, period_end: 1893456000, lines: { data: [{ period: { end: 1893456000 } }] } } },
  });

Deno.test('a signed invoice.paid grants exactly 30 monthly credits with a computed expiry', async () => {
  const stub = makeInvoiceStub();
  const body = invoiceEvent('invoice.paid', 'in_1');
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  assertEquals(res.status, 200);
  const grants = stub.rpc.filter((c) => c.fn === 'system_grant_credits');
  assertEquals(grants.length, 1);
  const args = grants[0].args as { amount: number; source: string; expires_at: string | null };
  assertEquals(args.amount, 30);
  assertEquals(args.source, 'monthly_allowance');
  assertEquals(typeof args.expires_at, 'string');   // expiry derived from the period end
});

Deno.test('a NON-subscription invoice (billing_reason=manual) does NOT grant the monthly allowance', async () => {
  const stub = makeInvoiceStub();
  const body = invoiceEvent('invoice.paid', 'in_manual', 'manual');
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  assertEquals(res.status, 200);
  // Only subscription_create / subscription_cycle invoices carry the allowance.
  assertEquals(stub.rpc.some((c) => c.fn === 'system_grant_credits'), false);
});

Deno.test('a replayed invoice.paid (same invoice id) does NOT double-grant', async () => {
  const stub = makeInvoiceStub();
  const body = invoiceEvent('invoice.paid', 'in_dup');
  await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  const grants = stub.rpc.filter((c) => c.fn === 'system_grant_credits');
  assertEquals(grants.length, 1);   // the second delivery is a no-op
});

Deno.test('invoice.paid + invoice.payment_succeeded for the SAME invoice grant only once', async () => {
  const stub = makeInvoiceStub();
  const paid = invoiceEvent('invoice.paid', 'in_double_fire');
  const succeeded = invoiceEvent('invoice.payment_succeeded', 'in_double_fire');
  await handleStripeWebhook(req(paid, { 'stripe-signature': await sign(paid, SECRET) }), stub);
  await handleStripeWebhook(req(succeeded, { 'stripe-signature': await sign(succeeded, SECRET) }), stub);
  const grants = stub.rpc.filter((c) => c.fn === 'system_grant_credits');
  assertEquals(grants.length, 1);   // Stripe's double-fire is collapsed to one grant
});

// ── Checkout one-shot grants (credit packs / founder bonus) ───────────────────
// checkout.session.completed is ALSO delivered at-least-once; a redelivered
// purchase must NOT double-grant real money. grantCreditsForSessionOnce dedups
// on the (source, stripe_session_id) credit_ledger row, mirroring the invoice
// path. (holistic-review money-path risk #4)

/** Stub whose credit_ledger dedup keys on stripe_session_id and whose
 *  system_grant_credits records the granted session ids. */
function makeCheckoutStub() {
  const granted = new Set<string>();
  const rpc: Array<{ fn: string; args: unknown }> = [];
  const client = {
    auth: { admin: { updateUserById: () => Promise.resolve({ error: null }) } },
    from: (table: string) => ({
      select: (_cols?: string) => {
        const chain: Record<string, string> = {};
        const builder = {
          eq: (col: string, val: string) => { chain[col] = val; return builder; },
          maybeSingle: () => {
            if (table === 'credit_ledger') {
              const sid = chain['metadata->>stripe_session_id'];
              return Promise.resolve({ data: granted.has(sid) ? { id: 'existing' } : null, error: null });
            }
            return Promise.resolve({ data: null, error: null });
          },
        };
        return builder;
      },
      update: () => ({ eq: () => Promise.resolve({ error: null }) }),
    }),
    rpc: (fn: string, args: unknown) => {
      rpc.push({ fn, args });
      if (fn === 'system_grant_credits') {
        const meta = (args as { metadata?: { stripe_session_id?: string } }).metadata;
        if (meta?.stripe_session_id) granted.add(meta.stripe_session_id);
      }
      return Promise.resolve({ error: null });
    },
  };
  return { rpc, granted, adminClient: () => client };
}

Deno.test('a signed credit-pack checkout grants the metadata credits exactly once', async () => {
  const stub = makeCheckoutStub();
  const body = checkoutEvent({ supabase_user_id: 'u1', credits: '60' });
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  assertEquals(res.status, 200);
  const grants = stub.rpc.filter((c) => c.fn === 'system_grant_credits');
  assertEquals(grants.length, 1);
  assertEquals((grants[0].args as { amount: number; source: string }).amount, 60);
  assertEquals((grants[0].args as { source: string }).source, 'purchase');
});

Deno.test('a replayed credit-pack checkout (same session id) does NOT double-grant', async () => {
  const stub = makeCheckoutStub();
  const body = checkoutEvent({ supabase_user_id: 'u1', credits: '60' });
  await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  const grants = stub.rpc.filter((c) => c.fn === 'system_grant_credits');
  assertEquals(grants.length, 1);   // the redelivery is a no-op (idempotent on session id)
});

// ── customer.subscription.deleted: stale-delete guard (migration 087) ────────
// Stripe redelivers + reorders webhooks. A .deleted for an OLD subscription must
// not downgrade a user who has since re-subscribed and is currently premium.
function makeSubDeletedStub(recordedSubId: string | null, tier = 'premium') {
  const rpc: Array<{ fn: string; args: unknown }> = [];
  const profileUpdates: Array<Record<string, unknown>> = [];
  // deno-lint-ignore no-explicit-any
  const client: any = {
    auth: { admin: { updateUserById: () => Promise.resolve({ error: null }) } },
    from: (table: string) => ({
      select: () => {
        const builder = {
          eq: () => builder,
          ilike: () => builder,
          maybeSingle: () => table === 'profiles'
            ? Promise.resolve({ data: { id: 'sub_user', is_founder: false, stripe_subscription_id: recordedSubId, tier }, error: null })
            : Promise.resolve({ data: null, error: null }),
        };
        return builder;
      },
      // chainable + awaitable so the clear's .update().eq().eq() then-await works
      update: (vals: Record<string, unknown>) => {
        profileUpdates.push(vals);
        const b: any = { eq: () => b, then: (res: (v: unknown) => unknown) => Promise.resolve({ error: null }).then(res) };
        return b;
      },
    }),
    rpc: (fn: string, args: unknown) => { rpc.push({ fn, args }); return Promise.resolve({ error: null }); },
  };
  return { rpc, profileUpdates, adminClient: () => client };
}

const subscriptionDeletedEvent = (subId: string) =>
  JSON.stringify({
    id: `evt_del_${subId}`,
    type: 'customer.subscription.deleted',
    data: { object: { id: subId, customer: 'cus_sub' } },
  });

Deno.test('a STALE subscription.deleted (old sub) does NOT downgrade a re-subscribed user', async () => {
  const stub = makeSubDeletedStub('sub_NEW');            // user's CURRENT subscription
  const body = subscriptionDeletedEvent('sub_OLD');      // redelivered delete of the OLD one
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  assertEquals(res.status, 200);
  assertEquals(stub.rpc.some((c) => c.fn === 'handle_premium_downgrade'), false);  // NOT downgraded
});

Deno.test('a MATCHING subscription.deleted downgrades and clears the recorded subscription', async () => {
  const stub = makeSubDeletedStub('sub_X');
  const body = subscriptionDeletedEvent('sub_X');
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  assertEquals(res.status, 200);
  assertEquals(stub.rpc.some((c) => c.fn === 'handle_premium_downgrade'), true);   // downgraded
  assertEquals(stub.profileUpdates.some((u) => u.stripe_subscription_id === null), true);  // cleared
});

Deno.test('a legacy premium user with NO recorded subscription still downgrades on delete (fallback)', async () => {
  const stub = makeSubDeletedStub(null);                 // pre-column premium user
  const body = subscriptionDeletedEvent('sub_legacy');
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  assertEquals(res.status, 200);
  assertEquals(stub.rpc.some((c) => c.fn === 'handle_premium_downgrade'), true);   // fallback downgrade
});

Deno.test('a REDELIVERED delete on an already-free user is a no-op (no retention re-stamp)', async () => {
  const stub = makeSubDeletedStub(null, 'free');         // already downgraded
  const body = subscriptionDeletedEvent('sub_old');
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  assertEquals(res.status, 200);
  assertEquals(stub.rpc.some((c) => c.fn === 'handle_premium_downgrade'), false);  // idempotent — not re-downgraded
});

// ── Email-fallback profile binding: ILIKE must be EXACT, never a pattern ─────
// findUserIdForStripeCustomer falls back to email matching when no profile has
// the Stripe customer id. ILIKE treats %/_/\ as wildcards, so an unescaped
// email could bind a money event to the WRONG profile. The handler must escape
// the metacharacters (and route `*`, PostgREST's unescapable wildcard, to eq).

/** Stub where the customer-id lookup MISSES and the email fallback resolves,
 *  recording every email filter (ilike pattern / eq value) the handler issues. */
function makeEmailFallbackStub() {
  const emailFilters: Array<{ op: string; value: string }> = [];
  const rpc: Array<{ fn: string; args: unknown }> = [];
  const client = {
    auth: { admin: { updateUserById: () => Promise.resolve({ error: null }) } },
    from: (table: string) => ({
      select: (_cols?: string) => {
        let matchedEmail = false;
        const builder = {
          eq: (col: string, val: string) => {
            if (table === 'profiles' && col === 'email') { emailFilters.push({ op: 'eq', value: val }); matchedEmail = true; }
            return builder;
          },
          ilike: (col: string, pattern: string) => {
            if (table === 'profiles' && col === 'email') { emailFilters.push({ op: 'ilike', value: pattern }); matchedEmail = true; }
            return builder;
          },
          maybeSingle: () => {
            // The stripe_customer_id lookup misses; only the email match resolves.
            if (table === 'profiles' && matchedEmail) {
              return Promise.resolve({ data: { id: 'email_user', is_founder: false, stripe_subscription_id: 'sub_1', tier: 'premium' }, error: null });
            }
            return Promise.resolve({ data: null, error: null });
          },
        };
        return builder;
      },
      update: () => {
        // chainable + awaitable, matching makeSubDeletedStub's update builder
        // deno-lint-ignore no-explicit-any
        const b: any = { eq: () => b, is: () => b, then: (res: (v: unknown) => unknown) => Promise.resolve({ error: null }).then(res) };
        return b;
      },
    }),
    rpc: (fn: string, args: unknown) => { rpc.push({ fn, args }); return Promise.resolve({ error: null }); },
  };
  return { emailFilters, rpc, adminClient: () => client };
}

const invoiceEventForEmail = (email: string) =>
  JSON.stringify({
    id: 'evt_email_fallback', type: 'invoice.paid',
    data: { object: { id: 'in_email', customer: 'cus_unbound', customer_email: email, billing_reason: 'subscription_cycle', subscription: 'sub_1', period_end: 1893456000, lines: { data: [{ period: { end: 1893456000 } }] } } },
  });

Deno.test('email fallback ESCAPES ILIKE metacharacters (%, _, \\) — exact match, not a pattern', async () => {
  const stub = makeEmailFallbackStub();
  const body = invoiceEventForEmail('a_b%c@x.com');
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  assertEquals(res.status, 200);
  const ilikes = stub.emailFilters.filter((f) => f.op === 'ilike');
  assertEquals(ilikes.length, 1);
  assertEquals(ilikes[0].value, 'a\\_b\\%c@x.com');      // wildcards neutralized
  assertEquals(stub.rpc.some((c) => c.fn === 'system_grant_credits'), true);  // still binds + grants
});

Deno.test('an email containing * (PostgREST wildcard, unescapable in ilike) falls back to exact eq', async () => {
  const stub = makeEmailFallbackStub();
  const body = invoiceEventForEmail('star*man@x.com');
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  assertEquals(res.status, 200);
  assertEquals(stub.emailFilters.some((f) => f.op === 'ilike'), false);       // never a pattern
  const eqs = stub.emailFilters.filter((f) => f.op === 'eq');
  assertEquals(eqs.length, 1);
  assertEquals(eqs[0].value, 'star*man@x.com');
});
