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
// Resend config so the referral tests exercise the notification step through
// the injected dispatch seam (no real network — dispatch is always stubbed).
Deno.env.set('RESEND_API_KEY', 're_test_dummy');
Deno.env.set('RESEND_FROM_EMAIL', 'SettlementForge <hello@test.invalid>');

const { handleStripeWebhook } = await import('./index.ts');

/** processed_webhook_events stub, shared by every admin-client stub below.
 *  The handler claims each event id here (INSERT, PK = event_id) before running
 *  any handler, and releases the claim on a handler failure so Stripe's
 *  redelivery re-runs. Two modes:
 *    'track'  — real claim semantics: a replayed event id reads the PK conflict.
 *    'absent' — the table is not migrated yet: every claim errors (42P01) and
 *               the handler must fail OPEN into the per-grant guards.
 */
function makeClaimTable(mode: 'track' | 'absent' = 'track') {
  const claimed = new Set<string>();
  const inserts: string[] = [];
  const releases: string[] = [];
  const builder = () => ({
    insert: (row: { event_id: string; event_type: string }) => ({
      select: () => ({
        maybeSingle: () => {
          inserts.push(row.event_id);
          if (mode === 'absent') {
            return Promise.resolve({ data: null, error: { code: '42P01', message: 'relation "processed_webhook_events" does not exist' } });
          }
          if (claimed.has(row.event_id)) {
            return Promise.resolve({ data: null, error: { code: '23505', message: 'duplicate key value violates unique constraint "processed_webhook_events_pkey"' } });
          }
          claimed.add(row.event_id);
          return Promise.resolve({ data: { event_id: row.event_id }, error: null });
        },
      }),
    }),
    delete: () => ({
      eq: (_col: string, val: string) => { releases.push(val); claimed.delete(val); return Promise.resolve({ error: null }); },
    }),
  });
  return { claimed, inserts, releases, builder };
}

/** A recording stub of the service-role admin client. Captures every RPC/auth/table
 *  write so a test can assert what the handler did (or, for forgeries, did NOT do). */
function makeStub(claimMode: 'track' | 'absent' = 'track') {
  const claims = makeClaimTable(claimMode);
  const calls: { rpc: Array<{ fn: string; args: unknown }>; authUpdates: unknown[]; profileUpdates: unknown[] } = {
    rpc: [], authUpdates: [], profileUpdates: [],
  };
  const client = {
    auth: { admin: { updateUserById: (_id: string, attrs: unknown) => { calls.authUpdates.push(attrs); return Promise.resolve({ error: null }); } } },
    from: (table: string) => {
      if (table === 'processed_webhook_events') return claims.builder();
      return {
        update: (vals: unknown) => ({ eq: (_col: string, _val: string) => { calls.profileUpdates.push(vals); return Promise.resolve({ error: null }); } }),
        // Chainable select builder: supports any number of .eq() before .maybeSingle()
        // (the checkout dedup chains .eq('source',…).eq('metadata->>stripe_session_id',…)).
        select: () => {
          const builder = { eq: () => builder, ilike: () => builder, maybeSingle: () => Promise.resolve({ data: null, error: null }) };
          return builder;
        },
      };
    },
    rpc: (fn: string, args: unknown) => { calls.rpc.push({ fn, args }); return Promise.resolve({ error: null }); },
  };
  return { calls, claims, adminClient: () => client };
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
  assertEquals(stub.claims.inserts.length, 0);   // no event claim before verification
});

Deno.test('rejects a request with a BAD signature (400) before any DB write', async () => {
  const stub = makeStub();
  const body = checkoutEvent({ supabase_user_id: 'u1', product: 'premium' });
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': 't=1,v1=deadbeef' }), stub);
  assertEquals(res.status, 400);
  assertEquals(await res.text(), 'Invalid signature');
  assertEquals(stub.calls.rpc.length, 0);
  assertEquals(stub.calls.authUpdates.length, 0);
  assertEquals(stub.claims.inserts.length, 0);   // a forgery cannot squat on an event id
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
function makeInvoiceStub(claimMode: 'track' | 'absent' = 'track') {
  const claims = makeClaimTable(claimMode);
  const granted = new Set<string>();
  const rpc: Array<{ fn: string; args: unknown }> = [];
  const client = {
    auth: { admin: { updateUserById: () => Promise.resolve({ error: null }) } },
    from: (table: string) => table === 'processed_webhook_events' ? claims.builder() : ({
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
  return { rpc, granted, claims, adminClient: () => client };
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
  // claimMode 'absent' bypasses the event-level claim (fails open) so this test
  // keeps proving the INNER per-invoice ledger dedup on its own — the outer
  // event-id guard has its own tests below and must never be the only defense.
  const stub = makeInvoiceStub('absent');
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
function makeCheckoutStub(claimMode: 'track' | 'absent' = 'track') {
  const claims = makeClaimTable(claimMode);
  const granted = new Set<string>();
  const rpc: Array<{ fn: string; args: unknown }> = [];
  const client = {
    auth: { admin: { updateUserById: () => Promise.resolve({ error: null }) } },
    from: (table: string) => table === 'processed_webhook_events' ? claims.builder() : ({
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
  return { rpc, granted, claims, adminClient: () => client };
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
  // claimMode 'absent' fails the event-level claim open, so this stays a proof
  // of the INNER (source, stripe_session_id) ledger dedup standing alone.
  const stub = makeCheckoutStub('absent');
  const body = checkoutEvent({ supabase_user_id: 'u1', credits: '60' });
  await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  const grants = stub.rpc.filter((c) => c.fn === 'system_grant_credits');
  assertEquals(grants.length, 1);   // the redelivery is a no-op (idempotent on session id)
});

// ── Event-level idempotency (processed_webhook_events, migration 107) ────────
// The claims above are per-GRANT. Stripe also redelivers whole EVENTS
// (at-least-once), so the handler claims each event id via INSERT on the
// processed_webhook_events PK right after signature verification: a duplicate
// delivery reads 200 '[duplicate]' and runs NO handler. The claim fails OPEN
// (the inner guards stay authoritative for money) and is RELEASED when a
// handler throws, so Stripe's retry loop still re-runs genuine failures.

Deno.test('a replayed EVENT id runs handlers exactly once and reads [duplicate]', async () => {
  const stub = makeCheckoutStub();
  const body = checkoutEvent({ supabase_user_id: 'u1', credits: '60' });
  const first = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  const second = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  assertEquals(first.status, 200);
  assertEquals(await first.text(), JSON.stringify({ received: true }));   // first delivery fulfils
  assertEquals(second.status, 200);                                       // ack — Stripe stops redelivering
  assertEquals(await second.text(), '[duplicate]');
  assertEquals(stub.claims.inserts.length, 2);                            // both deliveries attempted the claim
  assertEquals(stub.rpc.filter((c) => c.fn === 'system_grant_credits').length, 1);  // handler ran ONCE
});

Deno.test('the event claim is TYPE-AGNOSTIC: even an unhandled event type is claimed and deduped', async () => {
  const stub = makeStub();
  const body = JSON.stringify({ id: 'evt_unhandled_1', type: 'charge.refund.updated', data: { object: {} } });
  const first = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  const second = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  assertEquals(first.status, 200);
  assertEquals(await second.text(), '[duplicate]');
  assertEquals(stub.claims.claimed.has('evt_unhandled_1'), true);         // claim persists (success path)
});

Deno.test('a claim-table failure fails OPEN: the handler still fulfils (availability over strictness)', async () => {
  const stub = makeCheckoutStub('absent');                                // table not migrated yet
  const body = checkoutEvent({ supabase_user_id: 'u1', credits: '60' });
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  assertEquals(res.status, 200);
  assertEquals(await res.text(), JSON.stringify({ received: true }));     // NOT treated as a duplicate
  assertEquals(stub.rpc.filter((c) => c.fn === 'system_grant_credits').length, 1);  // grant went through
});

Deno.test('a handler failure RELEASES the event claim so a redelivery re-runs (retry-safe)', async () => {
  // system_grant_credits fails once (transient), then succeeds — the classic
  // case the file-wide "throw → non-2xx → Stripe redelivers" design exists for.
  // The event claim must not convert that redelivery into a dropped grant.
  const claims = makeClaimTable();
  const granted = new Set<string>();
  let grantAttempts = 0;
  const client = {
    auth: { admin: { updateUserById: () => Promise.resolve({ error: null }) } },
    from: (table: string) => table === 'processed_webhook_events' ? claims.builder() : ({
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
      if (fn === 'system_grant_credits') {
        grantAttempts += 1;
        if (grantAttempts === 1) return Promise.resolve({ error: { message: 'transient network failure' } });
        const meta = (args as { metadata?: { stripe_session_id?: string } }).metadata;
        if (meta?.stripe_session_id) granted.add(meta.stripe_session_id);
      }
      return Promise.resolve({ error: null });
    },
  };
  const deps = { adminClient: () => client };
  const body = checkoutEvent({ supabase_user_id: 'u1', credits: '60' });

  // First delivery: the grant RPC fails → the handler throws (serve turns that
  // into a non-2xx → Stripe will redeliver). The claim must be released.
  let firstThrew = false;
  try {
    await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), deps);
  } catch { firstThrew = true; }
  assertEquals(firstThrew, true);
  assertEquals(claims.releases, ['evt_1']);              // claim released on failure
  assertEquals(claims.claimed.has('evt_1'), false);

  // Redelivery: re-claims, re-runs, and this time the grant lands.
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), deps);
  assertEquals(res.status, 200);
  assertEquals(await res.text(), JSON.stringify({ received: true }));
  assertEquals(grantAttempts, 2);                        // handler genuinely re-ran
  assertEquals(granted.size, 1);                         // and the money moved exactly once
});

// ── Out-of-order delivery: .deleted BEFORE .completed (premium branch) ───────
// Stripe does not guarantee order. If subscription.deleted for sub A lands while
// checkout.session.completed for sub A is in retry backoff, the deleted handler
// no-ops (tier not yet premium); the late completed must then NOT grant premium
// against the already-dead subscription — nothing would ever downgrade it.

/** Stripe stub whose subscriptions.retrieve reports the given live status. */
function makeStripeStatusStub(status: string) {
  const retrieved: string[] = [];
  return {
    retrieved,
    // deno-lint-ignore no-explicit-any
    stripeClient: { subscriptions: { retrieve: (id: string) => { retrieved.push(id); return Promise.resolve({ id, status }); } } } as any,
  };
}

Deno.test('a late premium checkout for an ALREADY-CANCELED subscription does NOT upgrade', async () => {
  const stub = makeStub();
  const stripeStub = makeStripeStatusStub('canceled');
  const body = checkoutEvent({ supabase_user_id: 'u1', product: 'premium' }, { subscription: 'sub_dead' });
  const res = await handleStripeWebhook(
    req(body, { 'stripe-signature': await sign(body, SECRET) }),
    { adminClient: stub.adminClient, stripeClient: stripeStub.stripeClient },
  );
  assertEquals(res.status, 200);                                           // ack — retrying won't revive it
  assertEquals(stripeStub.retrieved, ['sub_dead']);                        // live status was consulted
  assertEquals(stub.calls.authUpdates.length, 0);                          // NOT upgraded
  assertEquals(stub.calls.profileUpdates.length, 0);                       // dead sub id never recorded
  assertEquals(stub.calls.rpc.some((c) => c.fn === 'restore_premium_settlements'), false);
});

Deno.test('a premium checkout for a LIVE subscription upgrades and records the sub id', async () => {
  const stub = makeStub();
  const stripeStub = makeStripeStatusStub('active');
  const body = checkoutEvent({ supabase_user_id: 'u1', product: 'premium' }, { subscription: 'sub_live' });
  const res = await handleStripeWebhook(
    req(body, { 'stripe-signature': await sign(body, SECRET) }),
    { adminClient: stub.adminClient, stripeClient: stripeStub.stripeClient },
  );
  assertEquals(res.status, 200);
  assertEquals(stub.calls.authUpdates.length, 1);                          // upgraded
  assertEquals(
    (stub.calls.profileUpdates[0] as Record<string, unknown>).stripe_subscription_id,
    'sub_live',
  );
});

// ── customer.subscription.deleted: stale-delete guard (migration 087) ────────
// Stripe redelivers + reorders webhooks. A .deleted for an OLD subscription must
// not downgrade a user who has since re-subscribed and is currently premium.
function makeSubDeletedStub(recordedSubId: string | null, tier = 'premium') {
  const claims = makeClaimTable();
  const rpc: Array<{ fn: string; args: unknown }> = [];
  const profileUpdates: Array<Record<string, unknown>> = [];
  // deno-lint-ignore no-explicit-any
  const client: any = {
    auth: { admin: { updateUserById: () => Promise.resolve({ error: null }) } },
    from: (table: string) => table === 'processed_webhook_events' ? claims.builder() : ({
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
  const claims = makeClaimTable();
  const emailFilters: Array<{ op: string; value: string }> = [];
  const rpc: Array<{ fn: string; args: unknown }> = [];
  const client = {
    auth: { admin: { updateUserById: () => Promise.resolve({ error: null }) } },
    from: (table: string) => table === 'processed_webhook_events' ? claims.builder() : ({
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

// ── Referral money path (migration 107) ──────────────────────────────────────
// grant_referral claims pending → granted ONCE per referee (zero-dollar-gated),
// then the webhook rewards BOTH parties: founders get 10 credits, everyone else
// a 1-month 100%-off coupon at the Stripe customer level. Refund / dispute /
// payment_failed events claw the reward back. Emails are fire-and-forget.

/** One configurable world for the referral tests: a supabase stub with a
 *  pending referral + per-user profiles, and a recording Stripe stub. */
function makeReferralWorld(cfg: {
  claimMode?: 'track' | 'absent';
  profiles?: Record<string, Record<string, unknown>>;
  customerToProfile?: string;
  pendingReferral?: { referralId: string; referrerUserId: string } | null;
  grantedClawback?: {
    invoiceId: string;
    referralId: string;
    referrer: { userId: string; reward: string | null; coupon: string | null };
    referee: { userId: string; reward: string | null; coupon: string | null };
  } | null;
  emails?: Record<string, string>;
  customerDiscounts?: Record<string, string | null>;
} = {}) {
  const claims = makeClaimTable(cfg.claimMode ?? 'track');
  const profiles = cfg.profiles ?? {};
  const rpc: Array<{ fn: string; args: Record<string, unknown> }> = [];
  const profileUpdates: Array<Record<string, unknown>> = [];
  const grantedInvoices = new Set<string>();
  const grantedPartyKeys = new Set<string>();
  let pending = cfg.pendingReferral ?? null;
  let clawable = cfg.grantedClawback ?? null;

  const client = {
    auth: {
      admin: {
        updateUserById: () => Promise.resolve({ error: null }),
        getUserById: (id: string) =>
          Promise.resolve({ data: { user: { email: cfg.emails?.[id] ?? null } }, error: null }),
      },
    },
    from: (table: string) => {
      if (table === 'processed_webhook_events') return claims.builder();
      return {
        select: (_cols?: string) => {
          const chain: Record<string, unknown> = {};
          const builder = {
            eq: (col: string, val: string) => { chain[col] = val; return builder; },
            ilike: () => builder,
            in: (col: string, vals: string[]) => { chain[`in:${col}`] = vals; return builder; },
            order: () => builder,
            limit: () => builder,
            maybeSingle: () => {
              if (table === 'profiles') {
                if (chain['in:role']) {
                  return Promise.resolve({ data: { id: 'admin_u' }, error: null });
                }
                if (chain['stripe_customer_id']) {
                  const target = cfg.customerToProfile ? profiles[cfg.customerToProfile] : null;
                  return Promise.resolve({ data: target ?? null, error: null });
                }
                if (chain['id']) {
                  return Promise.resolve({ data: profiles[chain['id'] as string] ?? null, error: null });
                }
              }
              if (table === 'credit_ledger') {
                if (chain['source'] === 'monthly_allowance') {
                  const inv = chain['metadata->>stripe_invoice_id'] as string;
                  return Promise.resolve({ data: grantedInvoices.has(inv) ? { id: 'existing' } : null, error: null });
                }
                if (chain['source'] === 'referral_reward') {
                  const key = chain['metadata->>referral_party_key'] as string;
                  return Promise.resolve({ data: grantedPartyKeys.has(key) ? { id: 'existing' } : null, error: null });
                }
                return Promise.resolve({ data: null, error: null });
              }
              return Promise.resolve({ data: null, error: null });
            },
          };
          return builder;
        },
        update: (vals: Record<string, unknown>) => {
          profileUpdates.push(vals);
          // deno-lint-ignore no-explicit-any
          const b: any = {
            eq: () => b,
            is: () => b,
            select: () => ({ maybeSingle: () => Promise.resolve({ data: vals, error: null }) }),
            then: (res: (v: unknown) => unknown) => Promise.resolve({ error: null }).then(res),
          };
          return b;
        },
      };
    },
    rpc: (fn: string, args: Record<string, unknown>) => {
      rpc.push({ fn, args });
      if (fn === 'system_grant_credits') {
        const meta = (args.metadata ?? {}) as Record<string, string>;
        if (meta.stripe_invoice_id) grantedInvoices.add(meta.stripe_invoice_id);
        if (meta.referral_party_key) grantedPartyKeys.add(meta.referral_party_key);
        return Promise.resolve({ data: 40, error: null });
      }
      if (fn === 'grant_referral') {
        const cents = args.p_amount_paid_cents as number;
        if (!cents || cents <= 0) {
          return Promise.resolve({ data: { ok: false, reason: 'non_positive_amount' }, error: null });
        }
        if (pending) {
          const claimed = pending;
          pending = null;                       // claim-once: pending → granted
          return Promise.resolve({
            data: { ok: true, referral_id: claimed.referralId, referrer_user_id: claimed.referrerUserId },
            error: null,
          });
        }
        return Promise.resolve({ data: { ok: false, reason: 'no_pending_referral' }, error: null });
      }
      if (fn === 'record_referral_grant_detail') {
        return Promise.resolve({ data: { ok: true }, error: null });
      }
      if (fn === 'clawback_referral') {
        if (clawable && args.p_invoice_id === clawable.invoiceId) {
          const row = clawable;
          clawable = null;                      // claim-once: granted → clawed_back
          return Promise.resolve({
            data: {
              ok: true,
              referral_id: row.referralId,
              referrer_user_id: row.referrer.userId,
              referee_user_id: row.referee.userId,
              referrer_reward: row.referrer.reward,
              referee_reward: row.referee.reward,
              referrer_coupon_applied: row.referrer.coupon,
              referee_coupon_applied: row.referee.coupon,
            },
            error: null,
          });
        }
        return Promise.resolve({ data: { ok: false, reason: 'no_granted_referral' }, error: null });
      }
      if (fn === 'service_adjust_credits') {
        return Promise.resolve({ data: { prev: 10, next: 0, delta: -10 }, error: null });
      }
      return Promise.resolve({ data: null, error: null });
    },
  };

  // Recording Stripe stub for the coupon/customer/clawback surface.
  const couponCreates: Array<Record<string, unknown>> = [];
  const customerUpdates: Array<{ id: string; params: Record<string, unknown>; options?: Record<string, unknown> }> = [];
  const customerCreates: Array<Record<string, unknown>> = [];
  const deletedDiscounts: string[] = [];
  const stripeClient = {
    coupons: {
      create: (params: Record<string, unknown>) => { couponCreates.push(params); return Promise.resolve(params); },
    },
    customers: {
      create: (params: Record<string, unknown>) => { customerCreates.push(params); return Promise.resolve({ id: 'cus_created_1' }); },
      update: (id: string, params: Record<string, unknown>, options?: Record<string, unknown>) => {
        customerUpdates.push({ id, params, options });
        return Promise.resolve({ id });
      },
      retrieve: (id: string) => {
        const coupon = cfg.customerDiscounts?.[id] ?? null;
        return Promise.resolve({ id, deleted: false, discount: coupon ? { coupon: { id: coupon } } : null });
      },
      deleteDiscount: (id: string) => { deletedDiscounts.push(id); return Promise.resolve({ id }); },
    },
    checkout: { sessions: { list: () => Promise.resolve({ data: [] }) } },
    charges: { retrieve: (id: string) => Promise.resolve({ id, invoice: null, payment_intent: null }) },
    subscriptions: { retrieve: (id: string) => Promise.resolve({ id, status: 'active' }) },
    // deno-lint-ignore no-explicit-any
  } as any;

  return {
    rpc, profileUpdates, couponCreates, customerUpdates, customerCreates, deletedDiscounts,
    claims,
    adminClient: () => client,
    stripeClient,
  };
}

const REFERRAL_PROFILES: Record<string, Record<string, unknown>> = {
  referee_u: { id: 'referee_u', is_founder: false, stripe_customer_id: 'cus_sub', stripe_subscription_id: 'sub_1', tier: 'premium' },
  referrer_u: { id: 'referrer_u', is_founder: false, stripe_customer_id: 'cus_referrer', stripe_subscription_id: null, tier: 'free' },
};

const referralInvoiceEvent = (type: string, invoiceId: string, amountPaid: number) =>
  JSON.stringify({
    id: `evt_${invoiceId}_${type}_${amountPaid}`,
    type,
    data: {
      object: {
        id: invoiceId, customer: 'cus_sub', customer_email: 'referee@x.com',
        billing_reason: 'subscription_create', subscription: 'sub_1',
        amount_paid: amountPaid,
        period_end: 1893456000, lines: { data: [{ period: { end: 1893456000 } }] },
      },
    },
  });

Deno.test('the referee FIRST paid invoice grants BOTH parties the referral reward', async () => {
  const emailsSent: Array<{ to: string; subject: string }> = [];
  const world = makeReferralWorld({
    profiles: REFERRAL_PROFILES,
    customerToProfile: 'referee_u',
    pendingReferral: { referralId: 'ref_1', referrerUserId: 'referrer_u' },
    emails: { referee_u: 'referee@x.com', referrer_u: 'referrer@x.com' },
  });
  const body = referralInvoiceEvent('invoice.paid', 'in_first', 599);
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), {
    adminClient: world.adminClient,
    stripeClient: world.stripeClient,
    referralEmailDispatch: (opts) => { emailsSent.push({ to: opts.to, subject: opts.subject }); return Promise.resolve({ id: 'em_1' }); },
  });
  assertEquals(res.status, 200);

  // grant_referral saw the real invoice + amount.
  const grant = world.rpc.find((c) => c.fn === 'grant_referral');
  assertEquals(grant !== undefined, true);
  assertEquals(grant!.args.p_referee, 'referee_u');
  assertEquals(grant!.args.p_invoice_id, 'in_first');
  assertEquals(grant!.args.p_amount_paid_cents, 599);

  // Both (non-founder) parties got the customer-level coupon…
  assertEquals(world.customerUpdates.length, 2);
  assertEquals(world.customerUpdates.map((u) => u.id).sort(), ['cus_referrer', 'cus_sub']);
  for (const u of world.customerUpdates) {
    assertEquals(u.params.coupon, 'referral_free_month');
    assertEquals(typeof (u.options as { idempotencyKey?: string })?.idempotencyKey, 'string');
  }
  // …and both were recorded for clawback.
  const details = world.rpc.filter((c) => c.fn === 'record_referral_grant_detail');
  assertEquals(details.length, 2);
  assertEquals(details.every((d) => d.args.p_reward === 'free_month' && d.args.p_coupon_id === 'referral_free_month'), true);

  // The monthly allowance still granted alongside (same invoice).
  assertEquals(world.rpc.some((c) => c.fn === 'system_grant_credits' && (c.args as { source?: string }).source === 'monthly_allowance'), true);

  // Both parties were notified.
  assertEquals(emailsSent.length, 2);
  assertEquals(emailsSent.map((e) => e.to).sort(), ['referee@x.com', 'referrer@x.com']);
});

Deno.test('a REPLAYED qualifying invoice does not double-grant the referral', async () => {
  const world = makeReferralWorld({
    profiles: REFERRAL_PROFILES,
    customerToProfile: 'referee_u',
    pendingReferral: { referralId: 'ref_1', referrerUserId: 'referrer_u' },
    emails: { referee_u: 'referee@x.com', referrer_u: 'referrer@x.com' },
  });
  const deps = {
    adminClient: world.adminClient,
    stripeClient: world.stripeClient,
    referralEmailDispatch: () => Promise.resolve({ id: 'em' }),
  };
  // Stripe fires invoice.paid AND invoice.payment_succeeded for the same
  // invoice — different event ids, so the event claim does not dedupe them;
  // grant_referral's claim-once must.
  const paid = referralInvoiceEvent('invoice.paid', 'in_first', 599);
  const succeeded = referralInvoiceEvent('invoice.payment_succeeded', 'in_first', 599);
  await handleStripeWebhook(req(paid, { 'stripe-signature': await sign(paid, SECRET) }), deps);
  await handleStripeWebhook(req(succeeded, { 'stripe-signature': await sign(succeeded, SECRET) }), deps);

  assertEquals(world.rpc.filter((c) => c.fn === 'grant_referral').length, 2);          // both asked
  assertEquals(world.customerUpdates.length, 2);                                       // one coupon per party, once
  assertEquals(world.rpc.filter((c) => c.fn === 'record_referral_grant_detail').length, 2);
});

Deno.test('a zero-dollar first payment NEVER grants a referral (invoice AND founder)', async () => {
  const world = makeReferralWorld({
    profiles: REFERRAL_PROFILES,
    customerToProfile: 'referee_u',
    pendingReferral: { referralId: 'ref_1', referrerUserId: 'referrer_u' },
  });
  const deps = { adminClient: world.adminClient, stripeClient: world.stripeClient };

  // 100%-discounted / trialing first invoice: amount_paid = 0.
  const freeInvoice = referralInvoiceEvent('invoice.paid', 'in_free', 0);
  await handleStripeWebhook(req(freeInvoice, { 'stripe-signature': await sign(freeInvoice, SECRET) }), deps);

  // Fully-discounted founder checkout: amount_total = 0.
  const freeFounder = JSON.stringify({
    id: 'evt_founder_free', type: 'checkout.session.completed',
    data: { object: { id: 'cs_free', payment_status: 'paid', amount_total: 0, metadata: { supabase_user_id: 'referee_u', product: 'founder_lifetime' } } },
  });
  await handleStripeWebhook(req(freeFounder, { 'stripe-signature': await sign(freeFounder, SECRET) }), deps);

  assertEquals(world.rpc.some((c) => c.fn === 'grant_referral'), false);   // gate held at the webhook layer
  assertEquals(world.customerUpdates.length, 0);
  assertEquals(world.deletedDiscounts.length, 0);
});

Deno.test('a FOUNDER referee gets 10 credits, not a coupon (paid founder checkout qualifies)', async () => {
  const world = makeReferralWorld({
    profiles: {
      // Post-upgrade state: the founder branch flips is_founder before the
      // reward step reads the profile.
      referee_u: { id: 'referee_u', is_founder: true, stripe_customer_id: 'cus_founder' },
      referrer_u: REFERRAL_PROFILES.referrer_u,
    },
    pendingReferral: { referralId: 'ref_1', referrerUserId: 'referrer_u' },
    emails: { referee_u: 'referee@x.com', referrer_u: 'referrer@x.com' },
  });
  const body = JSON.stringify({
    id: 'evt_founder_paid', type: 'checkout.session.completed',
    data: { object: { id: 'cs_founder', payment_status: 'paid', amount_total: 9900, customer: 'cus_founder', metadata: { supabase_user_id: 'referee_u', product: 'founder_lifetime' } } },
  });
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), {
    adminClient: world.adminClient,
    stripeClient: world.stripeClient,
    referralEmailDispatch: () => Promise.resolve({ id: 'em' }),
  });
  assertEquals(res.status, 200);

  // The session id doubled as the invoice-id claim key.
  const grant = world.rpc.find((c) => c.fn === 'grant_referral');
  assertEquals(grant!.args.p_invoice_id, 'cs_founder');
  assertEquals(grant!.args.p_amount_paid_cents, 9900);

  // Referee (founder): 10 credits through the ledger, keyed per party.
  const reward = world.rpc.find((c) => c.fn === 'system_grant_credits' && (c.args as { source?: string }).source === 'referral_reward');
  assertEquals(reward !== undefined, true);
  assertEquals((reward!.args as { amount: number }).amount, 10);
  assertEquals(((reward!.args as { metadata: { referral_party_key: string } }).metadata).referral_party_key, 'ref_1:referee');

  // Referrer (non-founder): the coupon — and ONLY the referrer.
  assertEquals(world.customerUpdates.length, 1);
  assertEquals(world.customerUpdates[0].id, 'cus_referrer');

  // Bookkeeping: credits_10 for the referee, free_month for the referrer.
  const details = world.rpc.filter((c) => c.fn === 'record_referral_grant_detail');
  assertEquals(details.length, 2);
  assertEquals(details.find((d) => d.args.p_party === 'referee')!.args.p_reward, 'credits_10');
  assertEquals(details.find((d) => d.args.p_party === 'referrer')!.args.p_reward, 'free_month');
});

Deno.test('charge.refunded claws the referral back and removes unconsumed discounts', async () => {
  const world = makeReferralWorld({
    profiles: REFERRAL_PROFILES,
    grantedClawback: {
      invoiceId: 'in_first', referralId: 'ref_1',
      referrer: { userId: 'referrer_u', reward: 'free_month', coupon: 'referral_free_month' },
      referee: { userId: 'referee_u', reward: 'free_month', coupon: 'referral_free_month' },
    },
    // The referrer's coupon still sits unconsumed; the referee already burned
    // theirs (duration 'once'), so no discount remains on their customer.
    customerDiscounts: { cus_referrer: 'referral_free_month', cus_sub: null },
  });
  const body = JSON.stringify({
    id: 'evt_refund_1', type: 'charge.refunded',
    data: { object: { id: 'ch_1', invoice: 'in_first', payment_intent: 'pi_1' } },
  });
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), {
    adminClient: world.adminClient, stripeClient: world.stripeClient,
  });
  assertEquals(res.status, 200);
  const claw = world.rpc.find((c) => c.fn === 'clawback_referral');
  assertEquals(claw!.args.p_invoice_id, 'in_first');
  // Only the UNCONSUMED discount is removed; the consumed one has nothing left.
  assertEquals(world.deletedDiscounts, ['cus_referrer']);

  // A redelivered refund (new event id, same charge) finds no granted referral
  // and reverses nothing again.
  const redelivery = JSON.stringify({
    id: 'evt_refund_2', type: 'charge.refunded',
    data: { object: { id: 'ch_1', invoice: 'in_first', payment_intent: 'pi_1' } },
  });
  await handleStripeWebhook(req(redelivery, { 'stripe-signature': await sign(redelivery, SECRET) }), {
    adminClient: world.adminClient, stripeClient: world.stripeClient,
  });
  assertEquals(world.deletedDiscounts, ['cus_referrer']);   // unchanged
  assertEquals(world.rpc.filter((c) => c.fn === 'clawback_referral').length, 2);
});

Deno.test('invoice.payment_failed claws back and deducts a credits_10 reward via service_adjust_credits', async () => {
  const world = makeReferralWorld({
    profiles: REFERRAL_PROFILES,
    grantedClawback: {
      invoiceId: 'in_first', referralId: 'ref_1',
      referrer: { userId: 'referrer_u', reward: 'free_month', coupon: 'referral_free_month' },
      referee: { userId: 'referee_u', reward: 'credits_10', coupon: null },
    },
    customerDiscounts: { cus_referrer: 'referral_free_month' },
  });
  const body = JSON.stringify({
    id: 'evt_pf_1', type: 'invoice.payment_failed',
    data: { object: { id: 'in_first', customer: 'cus_sub' } },
  });
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), {
    adminClient: world.adminClient, stripeClient: world.stripeClient,
  });
  assertEquals(res.status, 200);

  // Coupon party: discount removed. Credit party: atomic −10 via 103's RPC,
  // attributed to the resolved elevated actor with the referral in the reason.
  assertEquals(world.deletedDiscounts, ['cus_referrer']);
  const adjust = world.rpc.find((c) => c.fn === 'service_adjust_credits');
  assertEquals(adjust !== undefined, true);
  assertEquals(adjust!.args.actor_user, 'admin_u');
  assertEquals(adjust!.args.target_user, 'referee_u');
  assertEquals(adjust!.args.delta, -10);
  assertEquals(String(adjust!.args.reason).includes('ref_1'), true);
});

Deno.test('a THROWING email dispatch never fails the money path (rewards still land, 200)', async () => {
  const world = makeReferralWorld({
    profiles: REFERRAL_PROFILES,
    customerToProfile: 'referee_u',
    pendingReferral: { referralId: 'ref_1', referrerUserId: 'referrer_u' },
    emails: { referee_u: 'referee@x.com', referrer_u: 'referrer@x.com' },
  });
  const body = referralInvoiceEvent('invoice.paid', 'in_first', 599);
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), {
    adminClient: world.adminClient,
    stripeClient: world.stripeClient,
    referralEmailDispatch: () => { throw new Error('resend is down'); },
  });
  assertEquals(res.status, 200);                            // handler unaffected
  assertEquals(world.customerUpdates.length, 2);            // both rewards applied
  assertEquals(world.rpc.filter((c) => c.fn === 'record_referral_grant_detail').length, 2);
});

// ── Redeem codes (migration 107) ──────────────────────────────────────────────
// create-checkout reserved the seat and bound the session id. On a PAID
// completion the webhook flips it via apply_redemption (the AUTHORITATIVE
// claim-once — system_grant_credits takes no atomic claim for source
// 'redeem_code') and grants credits-kind codes; checkout.session.expired hands
// the seat back via revert_redemption. free_month codes need no DB action:
// the coupon already rode the session.

/** Stub with one reservable redemption (claim-once across apply/revert) and a
 *  credit_ledger dedup keyed on (source, session) so the redeem grant and the
 *  pack/founder grant for the SAME session never cross-dedup. */
function makeRedeemStub(cfg: {
  redemption?: { redemptionId: string; userId: string; kind: string; creditAmount: number | null; sessionId: string } | null;
} = {}) {
  const claims = makeClaimTable();
  const granted = new Set<string>();               // `${source}:${session}` + `${source}:user:${user}`
  const rpc: Array<{ fn: string; args: Record<string, unknown> }> = [];
  let reserved = cfg.redemption ?? null;
  const client = {
    auth: { admin: { updateUserById: () => Promise.resolve({ error: null }) } },
    from: (table: string) => table === 'processed_webhook_events' ? claims.builder() : ({
      select: (_cols?: string) => {
        const chain: Record<string, string> = {};
        const builder = {
          eq: (col: string, val: string) => { chain[col] = val; return builder; },
          limit: () => builder,
          maybeSingle: () => {
            if (table === 'credit_ledger') {
              // The founder once-per-account pre-check keys on (source, user_id);
              // the session dedup keys on (source, stripe_session_id).
              if (chain['user_id']) {
                const prior = granted.has(`${chain['source']}:user:${chain['user_id']}`);
                return Promise.resolve({ data: prior ? { id: 'existing' } : null, error: null });
              }
              const key = `${chain['source']}:${chain['metadata->>stripe_session_id']}`;
              return Promise.resolve({ data: granted.has(key) ? { id: 'existing' } : null, error: null });
            }
            return Promise.resolve({ data: null, error: null });
          },
        };
        return builder;
      },
      update: () => ({ eq: () => Promise.resolve({ error: null }) }),
    }),
    rpc: (fn: string, args: Record<string, unknown>) => {
      rpc.push({ fn, args });
      if (fn === 'system_grant_credits') {
        const src = args.source as string;
        const meta = (args.metadata ?? {}) as { stripe_session_id?: string };
        if (meta.stripe_session_id) granted.add(`${src}:${meta.stripe_session_id}`);
        granted.add(`${src}:user:${args.target_user}`);
        return Promise.resolve({ data: 40, error: null });
      }
      if (fn === 'apply_redemption') {
        if (reserved && args.p_session_id === reserved.sessionId) {
          const row = reserved;
          reserved = null;                          // claim-once: reserved → applied
          return Promise.resolve({
            data: { ok: true, redemption_id: row.redemptionId, code: 'SFC-STUBCODE0000', user_id: row.userId, kind: row.kind, credit_amount: row.creditAmount },
            error: null,
          });
        }
        return Promise.resolve({ data: { ok: false, reason: 'no_reserved_redemption' }, error: null });
      }
      if (fn === 'revert_redemption') {
        if (reserved && args.p_session_id === reserved.sessionId) {
          const row = reserved;
          reserved = null;                          // claim-once: reserved → reverted
          return Promise.resolve({ data: { ok: true, redemption_id: row.redemptionId }, error: null });
        }
        return Promise.resolve({ data: { ok: false, reason: 'no_reserved_redemption' }, error: null });
      }
      if (fn === 'grant_referral') {
        return Promise.resolve({ data: { ok: false, reason: 'no_pending_referral' }, error: null });
      }
      return Promise.resolve({ data: null, error: null });
    },
  };
  return { rpc, granted, claims, adminClient: () => client };
}

const redeemCheckoutEvent = (eventId: string, sessionId: string, metadata: Record<string, string>, extra: Record<string, unknown> = {}) =>
  JSON.stringify({
    id: eventId, type: 'checkout.session.completed',
    data: { object: { id: sessionId, payment_status: 'paid', metadata, ...extra } },
  });

Deno.test('a paid checkout with a bound credits-kind redemption grants the code credits exactly once (replay-safe)', async () => {
  const stub = makeRedeemStub({
    redemption: { redemptionId: 'red_1', userId: 'u1', kind: 'credits', creditAmount: 15, sessionId: 'cs_r1' },
  });
  const first = redeemCheckoutEvent('evt_redeem_1', 'cs_r1', { supabase_user_id: 'u1', credits: '25' });
  // Stripe redelivery arrives under a NEW event id, so the event claim cannot
  // dedupe it — apply_redemption's claim-once (plus the ledger dedup) must.
  const second = redeemCheckoutEvent('evt_redeem_2', 'cs_r1', { supabase_user_id: 'u1', credits: '25' });
  const res1 = await handleStripeWebhook(req(first, { 'stripe-signature': await sign(first, SECRET) }), stub);
  const res2 = await handleStripeWebhook(req(second, { 'stripe-signature': await sign(second, SECRET) }), stub);
  assertEquals(res1.status, 200);
  assertEquals(res2.status, 200);

  const applies = stub.rpc.filter((c) => c.fn === 'apply_redemption');
  assertEquals(applies.length, 2);                          // both deliveries asked
  assertEquals(applies[0].args.p_session_id, 'cs_r1');

  // The code's 15 credits granted ONCE, session-scoped, source 'redeem_code'.
  const redeemGrants = stub.rpc.filter((c) => c.fn === 'system_grant_credits' && c.args.source === 'redeem_code');
  assertEquals(redeemGrants.length, 1);
  assertEquals(redeemGrants[0].args.amount, 15);
  assertEquals(redeemGrants[0].args.target_user, 'u1');
  assertEquals((redeemGrants[0].args.metadata as { stripe_session_id: string }).stripe_session_id, 'cs_r1');

  // The pack purchase itself still granted once alongside — no cross-dedup.
  const packGrants = stub.rpc.filter((c) => c.fn === 'system_grant_credits' && c.args.source === 'purchase');
  assertEquals(packGrants.length, 1);
  assertEquals(packGrants[0].args.amount, 25);
});

Deno.test('a free_month redemption applies WITHOUT any credit grant (the coupon rode the session)', async () => {
  const stub = makeRedeemStub({
    redemption: { redemptionId: 'red_2', userId: 'u1', kind: 'free_month', creditAmount: null, sessionId: 'cs_r2' },
  });
  const body = redeemCheckoutEvent('evt_redeem_fm', 'cs_r2', { supabase_user_id: 'u1', product: 'premium' });
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  assertEquals(res.status, 200);
  assertEquals(stub.rpc.filter((c) => c.fn === 'apply_redemption').length, 1);
  assertEquals(stub.rpc.some((c) => c.fn === 'system_grant_credits' && c.args.source === 'redeem_code'), false);
  // The premium fulfilment itself still ran.
  assertEquals(stub.rpc.some((c) => c.fn === 'restore_premium_settlements'), true);
});

Deno.test('an UNPAID completed session does NOT consume the redemption (waits for settlement)', async () => {
  const stub = makeRedeemStub({
    redemption: { redemptionId: 'red_u', userId: 'u1', kind: 'credits', creditAmount: 15, sessionId: 'cs_u1' },
  });
  const body = redeemCheckoutEvent('evt_redeem_unpaid', 'cs_u1', { supabase_user_id: 'u1', credits: '25' }, { payment_status: 'unpaid' });
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  assertEquals(res.status, 200);
  assertEquals(stub.rpc.some((c) => c.fn === 'apply_redemption'), false);   // seat still reserved
  assertEquals(stub.rpc.some((c) => c.fn === 'system_grant_credits'), false);
});

Deno.test('checkout.session.expired reverts the reservation; a replayed expiry no-ops (200)', async () => {
  const stub = makeRedeemStub({
    redemption: { redemptionId: 'red_e', userId: 'u1', kind: 'credits', creditAmount: 15, sessionId: 'cs_exp' },
  });
  const expiredEvent = (eventId: string) => JSON.stringify({
    id: eventId, type: 'checkout.session.expired',
    data: { object: { id: 'cs_exp' } },
  });
  const first = expiredEvent('evt_exp_1');
  const second = expiredEvent('evt_exp_2');   // redelivery under a new event id
  const res1 = await handleStripeWebhook(req(first, { 'stripe-signature': await sign(first, SECRET) }), stub);
  const res2 = await handleStripeWebhook(req(second, { 'stripe-signature': await sign(second, SECRET) }), stub);
  assertEquals(res1.status, 200);
  assertEquals(res2.status, 200);                           // no_reserved_redemption is a clean ack
  const reverts = stub.rpc.filter((c) => c.fn === 'revert_redemption');
  assertEquals(reverts.length, 2);
  assertEquals(reverts[0].args.p_session_id, 'cs_exp');
  assertEquals(stub.rpc.some((c) => c.fn === 'system_grant_credits'), false);  // nothing ever granted
});

Deno.test('RED-TEAM: a $0 session carrying a redeem discount fulfils the redemption but NEVER mints a referral', async () => {
  // A free_month code zeroed this founder checkout (amount_total = 0,
  // payment_status 'no_payment_required'). The purchase itself fulfils — the
  // customer paid with the code — but the referral qualifying gate requires
  // real money moved, so grant_referral must never even be asked.
  const stub = makeRedeemStub({
    redemption: { redemptionId: 'red_z', userId: 'u1', kind: 'free_month', creditAmount: null, sessionId: 'cs_zero' },
  });
  const body = JSON.stringify({
    id: 'evt_zero_redeem', type: 'checkout.session.completed',
    data: {
      object: {
        id: 'cs_zero', payment_status: 'no_payment_required', amount_total: 0,
        metadata: { supabase_user_id: 'u1', product: 'founder_lifetime' },
      },
    },
  });
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  assertEquals(res.status, 200);

  // The redemption was consumed — the discount was legitimate spend of the code…
  assertEquals(stub.rpc.filter((c) => c.fn === 'apply_redemption').length, 1);
  // …and the founder fulfilment ran (seat + one-time bonus)…
  assertEquals(stub.rpc.some((c) => c.fn === 'restore_premium_settlements'), true);
  assertEquals(stub.rpc.some((c) => c.fn === 'system_grant_credits' && c.args.source === 'founder_grant'), true);
  // …but the zero-dollar gate held: no referral reward can ride a $0 invoice.
  assertEquals(stub.rpc.some((c) => c.fn === 'grant_referral'), false);
});

Deno.test('a free-tier referrer with NO Stripe customer gets one created and the coupon waits on it', async () => {
  const world = makeReferralWorld({
    profiles: {
      referee_u: REFERRAL_PROFILES.referee_u,
      referrer_u: { id: 'referrer_u', is_founder: false, stripe_customer_id: null },
    },
    customerToProfile: 'referee_u',
    pendingReferral: { referralId: 'ref_1', referrerUserId: 'referrer_u' },
    emails: { referee_u: 'referee@x.com', referrer_u: 'referrer@x.com' },
  });
  const body = referralInvoiceEvent('invoice.paid', 'in_first', 599);
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), {
    adminClient: world.adminClient,
    stripeClient: world.stripeClient,
    referralEmailDispatch: () => Promise.resolve({ id: 'em' }),
  });
  assertEquals(res.status, 200);
  // Customer created from the auth email, then the coupon attached to it.
  assertEquals(world.customerCreates.length, 1);
  assertEquals((world.customerCreates[0] as { email: string }).email, 'referrer@x.com');
  assertEquals(world.customerUpdates.some((u) => u.id === 'cus_created_1' && u.params.coupon === 'referral_free_month'), true);
  // And the binding was persisted to the profile.
  assertEquals(world.profileUpdates.some((u) => u.stripe_customer_id === 'cus_created_1'), true);
});

// ── Durable single-dossier export rights (migration 108) ──────────────────────
// The paid single_dossier branch now feeds the export-rights ladder ON TOP of the
// unchanged one-shot download:
//   * SIGNED-IN + save_id metadata → grant_dossier_entitlement (claim-once); a
//     grant failure must NOT break fulfilment.
//   * ANONYMOUS → record single_dossier_purchases (token hashed = the claim proof;
//     email lowercased = audit-only; amount_cents), idempotent on the session id; a
//     missing checkout token SKIPS the record (nothing to claim against), a missing
//     email still records (empty audit value). Neither ever fails fulfilment.
//   * REFUND / dispute of the single_dossier charge → clawback_dossier_entitlement
//     (reverses the right + poisons the voucher), keyed by the checkout session id.

/** sha256 hex mirror of the handler's helper, so a test can assert the STORED
 *  token hash equals sha256(rawToken) — proving the raw token never lands. */
async function sha256hexTest(s: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Recording stub for the dossier paths: an in-memory single_dossier_purchases
 *  table keyed on session id (upsert ignoreDuplicates = the real PK semantics),
 *  plus the grant/clawback RPCs. `grantResult` / `grantError` drive the grant
 *  outcome; `clawResult` drives the clawback outcome. */
function makeDossierStub(cfg: {
  grantResult?: Record<string, unknown>;
  grantError?: { message: string } | null;
  clawResult?: Record<string, unknown>;
} = {}) {
  const claims = makeClaimTable('track');
  const rpc: Array<{ fn: string; args: Record<string, unknown> }> = [];
  const purchases = new Map<string, Record<string, unknown>>();   // session_id → row
  const upserts: Array<{ row: Record<string, unknown>; ignoreDuplicates: boolean }> = [];
  const client = {
    auth: { admin: { updateUserById: () => Promise.resolve({ error: null }) } },
    from: (table: string) => {
      if (table === 'processed_webhook_events') return claims.builder();
      if (table === 'single_dossier_purchases') {
        return {
          upsert: (row: Record<string, unknown>, opts?: { onConflict?: string; ignoreDuplicates?: boolean }) => {
            upserts.push({ row, ignoreDuplicates: opts?.ignoreDuplicates === true });
            const key = row.stripe_session_id as string;
            // ON CONFLICT DO NOTHING: never overwrite an existing row (PK dedup).
            if (!purchases.has(key)) purchases.set(key, row);
            return Promise.resolve({ error: null });
          },
        };
      }
      // credit_ledger / profiles generic reads used by other branches.
      return {
        select: () => {
          const b = { eq: () => b, ilike: () => b, maybeSingle: () => Promise.resolve({ data: null, error: null }) };
          return b;
        },
        update: () => ({ eq: () => Promise.resolve({ error: null }) }),
      };
    },
    rpc: (fn: string, args: Record<string, unknown>) => {
      rpc.push({ fn, args });
      if (fn === 'grant_dossier_entitlement') {
        if (cfg.grantError) return Promise.resolve({ data: null, error: cfg.grantError });
        return Promise.resolve({ data: cfg.grantResult ?? { ok: true, already_existed: false, entitlement_id: 'ent_1' }, error: null });
      }
      if (fn === 'clawback_dossier_entitlement') {
        // Poison the voucher (mirrors the RPC) so an idempotency assertion holds.
        const sid = args.p_session_id as string;
        const row = purchases.get(sid);
        if (row) row.status = 'refunded';
        return Promise.resolve({ data: cfg.clawResult ?? { ok: true, entitlement_id: 'ent_1' }, error: null });
      }
      return Promise.resolve({ data: null, error: null });
    },
  };
  return { rpc, purchases, upserts, claims, adminClient: () => client };
}

const dossierCheckoutEvent = (id: string, metadata: Record<string, string>, extra: Record<string, unknown> = {}) =>
  JSON.stringify({
    id: `evt_${id}`, type: 'checkout.session.completed',
    data: { object: { id, payment_status: 'paid', metadata: { product: 'single_dossier', ...metadata }, ...extra } },
  });

Deno.test('a signed-in single_dossier with save_id metadata grants the durable entitlement', async () => {
  const stub = makeDossierStub();
  const body = dossierCheckoutEvent('cs_dossier_signed', { supabase_user_id: 'u1', save_id: 'save_1', anonymous: 'false' });
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  assertEquals(res.status, 200);
  const grant = stub.rpc.find((c) => c.fn === 'grant_dossier_entitlement');
  assertEquals(grant !== undefined, true);
  assertEquals(grant!.args.p_user, 'u1');
  assertEquals(grant!.args.p_save_id, 'save_1');
  assertEquals(grant!.args.p_session_id, 'cs_dossier_signed');
  assertEquals(grant!.args.p_source, 'purchase');
  // A signed-in grant does NOT write the anonymous retro-claim voucher.
  assertEquals(stub.upserts.length, 0);
});

Deno.test('a REPLAYED signed-in dossier session does NOT double-grant (event-level dedup)', async () => {
  const stub = makeDossierStub();
  const body = dossierCheckoutEvent('cs_dossier_dup', { supabase_user_id: 'u1', save_id: 'save_1' });
  const first = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  const second = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  assertEquals(first.status, 200);
  assertEquals(second.status, 200);
  assertEquals(await second.text(), '[duplicate]');   // the redelivery ran no handler
  assertEquals(stub.rpc.filter((c) => c.fn === 'grant_dossier_entitlement').length, 1);
});

Deno.test('a grant FAILURE does not break fulfilment (single_dossier still acks 200)', async () => {
  const stub = makeDossierStub({ grantError: { message: 'transient rpc failure' } });
  const body = dossierCheckoutEvent('cs_dossier_grantfail', { supabase_user_id: 'u1', save_id: 'save_1' });
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  assertEquals(res.status, 200);                       // fulfilment survives a durable-grant error
  assertEquals(await res.text(), JSON.stringify({ received: true }));
});

Deno.test('an ANONYMOUS single_dossier records the purchase (email lowercased, token hashed, amount)', async () => {
  const stub = makeDossierStub();
  const rawToken = 'tok_' + 'z'.repeat(40);
  const body = dossierCheckoutEvent(
    'cs_dossier_anon',
    { anonymous: 'true', checkout_token: rawToken },
    { amount_total: 299, customer_details: { email: '  Buyer@Example.COM  ' } },
  );
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  assertEquals(res.status, 200);
  assertEquals(stub.upserts.length, 1);
  const row = stub.upserts[0].row;
  assertEquals(stub.upserts[0].ignoreDuplicates, true);            // idempotent on the PK
  assertEquals(row.stripe_session_id, 'cs_dossier_anon');
  assertEquals(row.buyer_email_lower, 'buyer@example.com');        // trimmed + lowercased
  assertEquals(row.checkout_token_hash, await sha256hexTest(rawToken));  // the HASH, never the token
  assertEquals(row.checkout_token_hash !== rawToken, true);
  assertEquals(row.amount_cents, 299);
  // No durable entitlement is minted for an anonymous purchase.
  assertEquals(stub.rpc.some((c) => c.fn === 'grant_dossier_entitlement'), false);
});

Deno.test('a REPLAYED anonymous dossier session records the voucher only once (PK dedup)', async () => {
  const stub = makeDossierStub();
  const rawToken = 'tok_' + 'y'.repeat(40);
  const body = dossierCheckoutEvent(
    'cs_dossier_anon_dup',
    { anonymous: 'true', checkout_token: rawToken },
    { amount_total: 299, customer_details: { email: 'dup@example.com' } },
  );
  await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  // A DIFFERENT event id for the SAME session (Stripe redelivery via a resend):
  const body2 = body.replace('evt_cs_dossier_anon_dup', 'evt_cs_dossier_anon_dup_resend');
  await handleStripeWebhook(req(body2, { 'stripe-signature': await sign(body2, SECRET) }), stub);
  assertEquals(stub.purchases.size, 1);                // exactly one voucher row survives
});

Deno.test('an anonymous dossier session with NO customer email still RECORDS (email is audit-only)', async () => {
  // Same-device model: the checkout token is the claim proof; buyer_email_lower is
  // audit/support-only. Stripe returning no email must NOT block the claim voucher.
  const stub = makeDossierStub();
  const rawToken = 'tok_' + 'w'.repeat(40);
  const body = dossierCheckoutEvent(
    'cs_dossier_noemail',
    { anonymous: 'true', checkout_token: rawToken },
    { amount_total: 299, customer_details: { email: null } },
  );
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  assertEquals(res.status, 200);
  assertEquals(await res.text(), JSON.stringify({ received: true }));
  assertEquals(stub.upserts.length, 1);                            // the token-claim voucher is recorded
  const row = stub.upserts[0].row;
  assertEquals(row.buyer_email_lower, '');                         // empty audit value, satisfies NOT NULL
  assertEquals(row.checkout_token_hash, await sha256hexTest(rawToken));   // the claim proof still lands
});

Deno.test('an anonymous dossier session with NO checkout token SKIPS the record (nothing to claim, still 200)', async () => {
  // No token → the same-device claim has no proof to verify against, so there is
  // nothing to record. The one-shot download still worked; fulfilment never blocks.
  const stub = makeDossierStub();
  const body = dossierCheckoutEvent(
    'cs_dossier_notoken',
    { anonymous: 'true' },   // no checkout_token in metadata
    { amount_total: 299, customer_details: { email: 'buyer@example.com' } },
  );
  const res = await handleStripeWebhook(req(body, { 'stripe-signature': await sign(body, SECRET) }), stub);
  assertEquals(res.status, 200);
  assertEquals(await res.text(), JSON.stringify({ received: true }));
  assertEquals(stub.upserts.length, 0);                // no voucher row written
});

Deno.test('a refund of a single_dossier charge claws back the entitlement AND poisons the voucher', async () => {
  const stub = makeDossierStub();
  // Seed a voucher for the session so the poison is observable.
  const rawToken = 'tok_' + 'r'.repeat(40);
  const paid = dossierCheckoutEvent(
    'cs_dossier_refund',
    { anonymous: 'true', checkout_token: rawToken },
    { amount_total: 299, customer_details: { email: 'refundme@example.com' } },
  );
  await handleStripeWebhook(req(paid, { 'stripe-signature': await sign(paid, SECRET) }), stub);
  assertEquals(stub.purchases.get('cs_dossier_refund')!.status, undefined);   // unclaimed (no status set on insert)

  // A charge.refunded whose charge has no invoice → resolveChargeClawbackKeys
  // resolves the checkout session id via payment_intent. Stub that Stripe surface.
  const refundBody = JSON.stringify({
    id: 'evt_dossier_refund', type: 'charge.refunded',
    data: { object: { id: 'ch_1', invoice: null, payment_intent: 'pi_1' } },
  });
  // deno-lint-ignore no-explicit-any
  const stripeClient = {
    charges: { retrieve: (id: string) => Promise.resolve({ id, invoice: null, payment_intent: 'pi_1' }) },
    checkout: { sessions: { list: () => Promise.resolve({ data: [{ id: 'cs_dossier_refund' }] }) } },
  } as any;
  const res = await handleStripeWebhook(
    req(refundBody, { 'stripe-signature': await sign(refundBody, SECRET) }),
    { adminClient: stub.adminClient, stripeClient },
  );
  assertEquals(res.status, 200);
  const claw = stub.rpc.find((c) => c.fn === 'clawback_dossier_entitlement');
  assertEquals(claw !== undefined, true);
  assertEquals(claw!.args.p_session_id, 'cs_dossier_refund');
  assertEquals(stub.purchases.get('cs_dossier_refund')!.status, 'refunded');  // voucher poisoned
});
