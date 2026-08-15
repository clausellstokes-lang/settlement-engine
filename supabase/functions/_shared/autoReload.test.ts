/**
 * autoReload.test.ts — the auto-reload trigger helper (M-3c, §4).
 * Injects fake Stripe + admin clients and asserts: the claim gates, the off-session
 * PI shape (amount/currency/metadata/idempotencyKey), the PI-id stamp, the SCA and
 * failure branches, and — above all — that NOTHING throws into the debit path.
 */
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';

Deno.env.set('STRIPE_PRICE_CREDITS_25', 'price_credits_25');

const { maybeAutoReload, __resetPriceCacheForTest } = await import('./autoReload.ts');

const U = 'user-1';

function makeAdmin(
  claim: unknown,
  opts: {
    customerId?: string | null;
    stamped?: boolean;
    boundPaymentIntent?: string | null;
    bindError?: { message: string } | null;
    active?: boolean | null;
    activeError?: { message: string } | null;
  } = {},
) {
  const updates: Array<{ table: string; vals: Record<string, unknown>; id: string }> = [];
  const rpcCalls: Array<{ fn: string; args: unknown }> = [];
  let boundPaymentIntent = opts.boundPaymentIntent ?? null;
  const client = {
    rpc: (fn: string, args: unknown) => {
      rpcCalls.push({ fn, args });
      if (fn === 'mark_low_balance_notified') return Promise.resolve({ data: opts.stamped ?? false, error: null });
      if (fn === 'account_is_active') {
        return Promise.resolve({
          data: opts.active === undefined ? true : opts.active,
          error: opts.activeError ?? null,
        });
      }
      if (fn === 'claim_auto_reload_payment_intent') {
        if (opts.bindError) return Promise.resolve({ data: null, error: opts.bindError });
        const pi = (args as Record<string, unknown>).p_payment_intent as string;
        if (boundPaymentIntent && boundPaymentIntent !== pi) {
          return Promise.resolve({ data: { ok: false, reason: 'not_claimed' }, error: null });
        }
        boundPaymentIntent = pi;
        return Promise.resolve({ data: { ok: true, state: 'pending' }, error: null });
      }
      return Promise.resolve({ data: claim, error: null });
    },
    from: (table: string) => ({
      select: () => ({ eq: () => ({ maybeSingle: () => Promise.resolve({ data: opts.customerId === undefined ? { stripe_customer_id: 'cus_1' } : { stripe_customer_id: opts.customerId }, error: null }) }) }),
      update: (vals: Record<string, unknown>) => {
        let id = '';
        const finish = () => {
          updates.push({ table, vals, id });
          return Promise.resolve({ error: null });
        };
        const builder = {
          eq: (column: string, value: string) => {
            if (column === 'id') id = value;
            return builder;
          },
          in: (_c: string, _states: string[]) => builder,
          is: (_c: string, _value: null) => builder,
          then: (
            resolve: (value: { error: null }) => unknown,
            reject?: (reason: unknown) => unknown,
          ) => finish().then(resolve, reject),
        };
        return builder;
      },
    }),
  };
  return { updates, rpcCalls, binding: () => boundPaymentIntent, admin: client };
}

// deno-lint-ignore no-explicit-any
function makeStripe(cfg: { unit?: number; currency?: string; defaultPm?: string | null; listPm?: string | null; piCreate?: (p: any, o: any) => any } = {}): any {
  const created: Array<{ params: unknown; opts: unknown }> = [];
  const stripe = {
    _created: created,
    prices: { retrieve: () => Promise.resolve({ unit_amount: cfg.unit ?? 499, currency: cfg.currency ?? 'usd' }) },
    customers: { retrieve: () => Promise.resolve({ invoice_settings: { default_payment_method: cfg.defaultPm ?? null } }) },
    paymentMethods: { list: () => Promise.resolve({ data: cfg.listPm === null ? [] : [{ id: cfg.listPm ?? 'pm_default' }] }) },
    paymentIntents: {
      create: (params: unknown, opts: unknown) => {
        created.push({ params, opts });
        if (cfg.piCreate) return cfg.piCreate(params, opts);
        return Promise.resolve({ id: 'pi_ok' });
      },
    },
  };
  return stripe;
}

const okClaim = { ok: true, attempt_id: 'att_1', credits_delta: 23, amount_cents: 459 };

Deno.test('claim ok → off-session PI created and its identity claimed atomically', async () => {
  __resetPriceCacheForTest();
  const a = makeAdmin(okClaim);
  const s = makeStripe({ unit: 499, currency: 'usd', defaultPm: 'pm_card' });
  await maybeAutoReload(a.admin, U, { stripe: s });
  // claim called with the starter unit price + 25 denominator
  assertEquals(a.rpcCalls[0].fn, 'claim_auto_reload_attempt');
  assertEquals((a.rpcCalls[0].args as Record<string, unknown>).p_unit_amount_cents, 499);
  assertEquals((a.rpcCalls[0].args as Record<string, unknown>).p_credits_per_unit, 25);
  // one PI create with the claimed amount + purpose/attempt metadata + idempotencyKey
  assertEquals(s._created.length, 1);
  const params = s._created[0].params as Record<string, unknown>;
  assertEquals(params.amount, 459);
  assertEquals(params.currency, 'usd');
  assertEquals(params.off_session, true);
  assertEquals(params.confirm, true);
  assertEquals((params.metadata as Record<string, string>).purpose, 'credit_auto_reload');
  assertEquals((params.metadata as Record<string, string>).attempt_id, 'att_1');
  assertEquals((s._created[0].opts as Record<string, string>).idempotencyKey, 'auto-reload-att_1');
  // PI identity is claimed atomically through migration 176; no direct UPDATE
  // can overwrite a webhook-first or competing PI binding.
  const bind = a.rpcCalls.find((c) => c.fn === 'claim_auto_reload_payment_intent');
  assertEquals((bind!.args as Record<string, unknown>).p_attempt, 'att_1');
  assertEquals((bind!.args as Record<string, unknown>).p_payment_intent, 'pi_ok');
  assertEquals((bind!.args as Record<string, unknown>).p_amount_cents, 459);
  assertEquals((bind!.args as Record<string, unknown>).p_credits_delta, 23);
  assertEquals(a.binding(), 'pi_ok');
  assertEquals(a.updates.some((u) => u.vals.stripe_payment_intent_id === 'pi_ok'), false);
});

Deno.test('a trigger continuation cannot overwrite a different PI that already claimed the attempt', async () => {
  __resetPriceCacheForTest();
  const a = makeAdmin(okClaim, { boundPaymentIntent: 'pi_webhook_winner' });
  const s = makeStripe({ defaultPm: 'pm_card' });
  await maybeAutoReload(a.admin, U, { stripe: s });
  assertEquals(s._created.length, 1);
  assertEquals(a.binding(), 'pi_webhook_winner');
  assertEquals(a.updates.some((u) => u.vals.stripe_payment_intent_id === 'pi_ok'), false);
});

Deno.test('a refused claim creates NO PaymentIntent', async () => {
  __resetPriceCacheForTest();
  const a = makeAdmin({ ok: false, reason: 'above_threshold' });
  const s = makeStripe();
  await maybeAutoReload(a.admin, U, { stripe: s });
  assertEquals(s._created.length, 0);
  assertEquals(a.updates.length, 0);
});

Deno.test('a non-USD starter price is rejected before claim or charge', async () => {
  __resetPriceCacheForTest();
  const a = makeAdmin(okClaim);
  const s = makeStripe({ unit: 499, currency: 'eur' });
  await maybeAutoReload(a.admin, U, { stripe: s });
  assertEquals(a.rpcCalls.length, 0);
  assertEquals(s._created.length, 0);
  assertEquals(a.updates.length, 0);
});

Deno.test('a starter price with no currency is rejected before claim or charge', async () => {
  __resetPriceCacheForTest();
  const a = makeAdmin(okClaim);
  const s = makeStripe();
  s.prices.retrieve = () => Promise.resolve({ unit_amount: 499 });
  await maybeAutoReload(a.admin, U, { stripe: s });
  assertEquals(a.rpcCalls.length, 0);
  assertEquals(s._created.length, 0);
});

Deno.test('no saved customer → attempt failed (no_customer), no PI', async () => {
  __resetPriceCacheForTest();
  const a = makeAdmin(okClaim, { customerId: null });
  const s = makeStripe();
  await maybeAutoReload(a.admin, U, { stripe: s });
  assertEquals(s._created.length, 0);
  assertEquals(a.updates[0].vals.state, 'failed');
  assertEquals(a.updates[0].vals.failure_reason, 'no_customer');
});

Deno.test('no saved card → attempt failed (no_payment_method), no PI', async () => {
  __resetPriceCacheForTest();
  const a = makeAdmin(okClaim);
  const s = makeStripe({ defaultPm: null, listPm: null });
  await maybeAutoReload(a.admin, U, { stripe: s });
  assertEquals(s._created.length, 0);
  assertEquals(a.updates[0].vals.state, 'failed');
  assertEquals(a.updates[0].vals.failure_reason, 'no_payment_method');
});

Deno.test('falls back to the most-recent card when there is no default', async () => {
  __resetPriceCacheForTest();
  const a = makeAdmin(okClaim);
  const s = makeStripe({ defaultPm: null, listPm: 'pm_recent' });
  await maybeAutoReload(a.admin, U, { stripe: s });
  assertEquals((s._created[0].params as Record<string, unknown>).payment_method, 'pm_recent');
});

Deno.test('account deletion after the attempt claim cancels it before any charge', async () => {
  __resetPriceCacheForTest();
  // claim_auto_reload_attempt returned ok while the account was active; the
  // second gate models deletion winning during payment-method resolution.
  const a = makeAdmin(okClaim, { active: false });
  const s = makeStripe({ defaultPm: 'pm_card' });
  await maybeAutoReload(a.admin, U, { stripe: s });
  assertEquals(
    a.rpcCalls.some((call) => call.fn === 'account_is_active'),
    true,
  );
  assertEquals(s._created.length, 0);
  assertEquals(a.updates[0].vals.state, 'canceled');
  assertEquals(a.updates[0].vals.failure_reason, 'account_inactive');
});

Deno.test('an account-active lookup error fails closed before any charge', async () => {
  __resetPriceCacheForTest();
  const a = makeAdmin(okClaim, {
    active: null,
    activeError: { message: 'profile lookup unavailable' },
  });
  const s = makeStripe({ defaultPm: 'pm_card' });
  await maybeAutoReload(a.admin, U, { stripe: s });
  assertEquals(s._created.length, 0);
  assertEquals(a.updates[0].vals.state, 'canceled');
});

Deno.test('SCA (authentication_required) → requires_action + sca notify, never silent-retry', async () => {
  __resetPriceCacheForTest();
  const a = makeAdmin(okClaim);
  const notified: string[] = [];
  const s = makeStripe({ defaultPm: 'pm_card', piCreate: () => { throw { code: 'authentication_required', raw: { payment_intent: { id: 'pi_sca' } } }; } });
  await maybeAutoReload(a.admin, U, { stripe: s, notify: (kind) => { notified.push(kind); } });
  const upd = a.updates[0];
  assertEquals(upd.vals.state, 'requires_action');
  assertEquals(a.binding(), 'pi_sca');
  assertEquals(upd.vals.stripe_payment_intent_id, undefined);
  assertEquals(notified, ['sca']);
});

Deno.test('a generic PI failure → attempt failed + failed notify', async () => {
  __resetPriceCacheForTest();
  const a = makeAdmin(okClaim);
  const notified: string[] = [];
  const s = makeStripe({ defaultPm: 'pm_card', piCreate: () => { throw { code: 'card_declined' }; } });
  await maybeAutoReload(a.admin, U, { stripe: s, notify: (kind) => { notified.push(kind); } });
  assertEquals(a.updates[0].vals.state, 'failed');
  assertEquals(a.updates[0].vals.failure_reason, 'card_declined');
  assertEquals(notified, ['failed']);
});

Deno.test('NEVER throws — a claim RPC that rejects is swallowed', async () => {
  __resetPriceCacheForTest();
  const admin = { rpc: () => Promise.reject(new Error('db down')), from: () => { throw new Error('should not reach'); } };
  const s = makeStripe();
  // Must resolve, not reject.
  await maybeAutoReload(admin, U, { stripe: s });
  assertEquals(true, true);
});

Deno.test('NEVER throws — a Stripe that throws everywhere is swallowed', async () => {
  __resetPriceCacheForTest();
  const a = makeAdmin(okClaim);
  const s = { prices: { retrieve: () => { throw new Error('stripe down'); } } };
  await maybeAutoReload(a.admin, U, { stripe: s });
  // price retrieve failed → dark → no claim, no throw
  assertEquals(a.rpcCalls.length, 0);
});

Deno.test('dark (no-op) when no Stripe key and no injected client', async () => {
  __resetPriceCacheForTest();
  const prev = Deno.env.get('STRIPE_SECRET_KEY');
  Deno.env.delete('STRIPE_SECRET_KEY');
  try {
    const a = makeAdmin(okClaim);
    await maybeAutoReload(a.admin, U, {}); // no deps.stripe, no key
    assertEquals(a.rpcCalls.length, 0);
  } finally {
    if (prev) Deno.env.set('STRIPE_SECRET_KEY', prev);
  }
});

// ── Low-balance nudge (§4.3, slice M-3f) — inert notify seam, claim-once ──────

Deno.test('low-balance nudge fires when auto-reload is OFF and below threshold (claim-once stamp)', async () => {
  __resetPriceCacheForTest();
  const a = makeAdmin({ ok: false, reason: 'disabled', below_threshold: true }, { stamped: true });
  const s = makeStripe();
  const notified: string[] = [];
  await maybeAutoReload(a.admin, U, { stripe: s, notify: (kind) => { notified.push(kind); } });
  const mark = a.rpcCalls.find((c) => c.fn === 'mark_low_balance_notified');
  assertEquals((mark!.args as Record<string, unknown>).p_user, U);
  assertEquals(notified, ['low_balance']);
  assertEquals(s._created.length, 0); // no reload — it's OFF
});

Deno.test('low-balance nudge fires when the monthly cap blocked the reload', async () => {
  __resetPriceCacheForTest();
  const a = makeAdmin({ ok: false, reason: 'cap', below_threshold: true }, { stamped: true });
  const notified: string[] = [];
  await maybeAutoReload(a.admin, U, { stripe: makeStripe(), notify: (kind) => { notified.push(kind); } });
  assertEquals(notified, ['low_balance']);
});

Deno.test('no nudge when disabled but NOT below threshold', async () => {
  __resetPriceCacheForTest();
  const a = makeAdmin({ ok: false, reason: 'disabled', below_threshold: false });
  const notified: string[] = [];
  await maybeAutoReload(a.admin, U, { stripe: makeStripe(), notify: (kind) => { notified.push(kind); } });
  assertEquals(a.rpcCalls.some((c) => c.fn === 'mark_low_balance_notified'), false);
  assertEquals(notified, []);
});

Deno.test('no nudge when above threshold or already nudged this bucket (stamp false)', async () => {
  __resetPriceCacheForTest();
  // above_threshold → not eligible, no mark
  const a1 = makeAdmin({ ok: false, reason: 'above_threshold' });
  const n1: string[] = [];
  await maybeAutoReload(a1.admin, U, { stripe: makeStripe(), notify: (k) => { n1.push(k); } });
  assertEquals(a1.rpcCalls.some((c) => c.fn === 'mark_low_balance_notified'), false);
  assertEquals(n1, []);
  // eligible but the stamp says already-notified this bucket → no duplicate send
  const a2 = makeAdmin({ ok: false, reason: 'cap', below_threshold: true }, { stamped: false });
  const n2: string[] = [];
  await maybeAutoReload(a2.admin, U, { stripe: makeStripe(), notify: (k) => { n2.push(k); } });
  assertEquals(a2.rpcCalls.some((c) => c.fn === 'mark_low_balance_notified'), true);
  assertEquals(n2, []); // stamp false → no send
});
