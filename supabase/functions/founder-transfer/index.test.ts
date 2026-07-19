/**
 * index.test.ts — EXECUTION test of the founder-transfer choreography (§6.3, M-6).
 * Drives the real handler through the master switch, auth, the single-session gate,
 * velocity, and the initiate happy path against recording stubs.
 */
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';

Deno.env.set('SUPABASE_URL', 'https://stub.supabase.co');
Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'svc');
Deno.env.set('SUPABASE_ANON_KEY', 'anon');
Deno.env.set('STRIPE_SECRET_KEY', 'sk_test_dummy');
Deno.env.set('STRIPE_PRICE_SEAT_TRANSFER', 'price_transfer');
// RESEND configured so sendTransferEmail actually dispatches (into the injected
// emailDispatch stub) — lets the run_due cooling-notification tests assert the token email.
Deno.env.set('RESEND_API_KEY', 're_test');
Deno.env.set('RESEND_FROM_EMAIL', 'noreply@settlementforge.com');
Deno.env.set('STRIPE_PRICE_CREDITS_25', 'price_c25'); // the §4.4 rate anchor (credits election)

const { handleFounderTransfer, __resetRateCacheForTest } = await import('./index.ts');

const req = (body: unknown, headers: Record<string, string> = { Authorization: 'Bearer jwt' }) =>
  new Request('https://edge/founder-transfer', { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) });

/** Configurable stubs. rpcData maps fn → return value; tables maps table → the row a
 *  select resolves. sessionRow feeds current_account_session (null = missing → allow). */
// deno-lint-ignore no-explicit-any
function makeDeps(cfg: {
  enabled?: boolean;
  user?: { id: string; email: string } | null;
  sessionRow?: { session_id: string } | null;
  rate?: boolean;
  rpc?: Record<string, unknown>;
  rows?: Record<string, unknown>;
  connectOn?: boolean;              // deps.connectEnabled (payout_onboarding)
  // deno-lint-ignore no-explicit-any
  stripe?: any;                     // deps.stripeClient (payout_onboarding)
} = {}) {
  const rpcCalls: Array<{ fn: string; args: unknown }> = [];
  const updateCalls: Array<{ table: string; obj: Record<string, unknown> }> = [];
  const rpc = (fn: string, args: unknown) => {
    rpcCalls.push({ fn, args });
    if (fn === 'founder_transfer_enabled') return Promise.resolve({ data: cfg.enabled ?? true, error: null });
    if (fn === 'ingest_check_rate') return Promise.resolve({ data: cfg.rate ?? true, error: null });
    const map = cfg.rpc ?? {};
    return Promise.resolve({ data: map[fn] ?? null, error: null });
  };
  // deno-lint-ignore no-explicit-any
  const from = (table: string): any => {
    if (table === 'current_account_session') {
      return { select: () => ({ eq: () => ({ maybeSingle: () => Promise.resolve({ data: cfg.sessionRow ?? null, error: null }) }) }), upsert: () => Promise.resolve({ error: null }) };
    }
    // A fully chainable recorder: reads terminate at maybeSingle; mutations (.update())
    // record their patch and the chain is awaitable (then) so an awaited .update().eq()…
    // resolves. Covers payout_onboarding's pending-case lookup + connect stamp + re-arm.
    // deno-lint-ignore no-explicit-any
    const b: any = {
      select: () => b, eq: () => b, not: () => b, in: () => b, limit: () => b,
      maybeSingle: () => Promise.resolve({ data: (cfg.rows ?? {})[table] ?? null, error: null }),
      update: (obj: Record<string, unknown>) => { updateCalls.push({ table, obj }); return b; },
      // deno-lint-ignore no-explicit-any
      then: (resolve: any, reject: any) => Promise.resolve({ error: null }).then(resolve, reject),
    };
    return b;
  };
  // deno-lint-ignore no-explicit-any
  const admin: any = { rpc, from, auth: { admin: { getUserById: () => Promise.resolve({ data: { user: { updated_at: '2000-01-01T00:00:00Z' } }, error: null }) } } };
  // deno-lint-ignore no-explicit-any
  const userClient: any = { auth: { getUser: () => Promise.resolve({ data: { user: cfg.user === undefined ? { id: 'u1', email: 'from@x.com' } : cfg.user }, error: null }) }, rpc };
  return {
    rpcCalls,
    updateCalls,
    deps: {
      adminClient: () => admin, userClient: () => userClient,
      emailDispatch: () => Promise.resolve({ id: 'em' }),
      ...(cfg.connectOn !== undefined ? { connectEnabled: () => cfg.connectOn } : {}),
      ...(cfg.stripe ? { stripeClient: cfg.stripe } : {}),
    },
  };
}

Deno.test('master switch OFF → feature_unavailable for every action (KEY-INERT)', async () => {
  const { deps } = makeDeps({ enabled: false });
  const res = await handleFounderTransfer(req({ action: 'initiate', to_email: 'nom@x.com' }), deps);
  assertEquals(res.status, 503);
  assertEquals((await res.json()).error, 'feature_unavailable');
});

Deno.test('missing Authorization → 401', async () => {
  const { deps } = makeDeps({});
  const res = await handleFounderTransfer(req({ action: 'status' }, {}), deps);
  assertEquals(res.status, 401);
});

Deno.test('a SUPERSEDED session → 401 (no transfer step taken)', async () => {
  const { deps } = makeDeps({ sessionRow: { session_id: 'other-session' } });
  // The JWT here has no decodable session_id claim, so the gate would allow — force a
  // superseded state by giving a real-ish token with a session_id claim.
  const jwtWith = (sid: string) => {
    const b64 = (o: unknown) => btoa(JSON.stringify(o)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return `${b64({ alg: 'HS256' })}.${b64({ sub: 'u1', session_id: sid })}.sig`;
  };
  const res = await handleFounderTransfer(req({ action: 'status' }, { Authorization: `Bearer ${jwtWith('my-session')}` }), deps);
  assertEquals(res.status, 401);
  assertEquals((await res.json()).error, 'session_superseded');
});

Deno.test('velocity over-cap → 429', async () => {
  const { deps } = makeDeps({ rate: false });
  const res = await handleFounderTransfer(req({ action: 'status' }), deps);
  assertEquals(res.status, 429);
});

Deno.test('initiate opens the case and issues+emails the outgoing challenge', async () => {
  const { deps, rpcCalls } = makeDeps({
    rows: { founder_seats: { seat_id: 7 } },
    rpc: {
      transfer_case_open: { ok: true, case_id: 'case-1' },
      issue_transfer_challenge: { ok: true, code: '123456' },
    },
  });
  const res = await handleFounderTransfer(req({ action: 'initiate', to_email: 'nom@x.com', payout_form: 'account_credits' }), deps);
  const body = await res.json();
  assertEquals(res.status, 200);
  assertEquals(body.ok, true);
  assertEquals(body.case_id, 'case-1');
  // Opened with the caller's seat + payout election, then issued the outgoing code.
  const open = rpcCalls.find((c) => c.fn === 'transfer_case_open');
  assertEquals((open!.args as { p_seat: number; p_payout_form: string }).p_seat, 7);
  assertEquals((open!.args as { p_payout_form: string }).p_payout_form, 'account_credits');
  assertEquals(rpcCalls.some((c) => c.fn === 'issue_transfer_challenge'), true);
});

Deno.test('initiate refuses when the case cannot open (e.g. not yet eligible)', async () => {
  const { deps } = makeDeps({
    rows: { founder_seats: { seat_id: 7 } },
    rpc: { transfer_case_open: { ok: false, reason: 'not_yet_eligible' } },
  });
  const res = await handleFounderTransfer(req({ action: 'initiate', to_email: 'nom@x.com' }), deps);
  assertEquals(res.status, 409);
  assertEquals((await res.json()).reason, 'not_yet_eligible');
});

Deno.test('an unknown action → 400', async () => {
  const { deps } = makeDeps({});
  const res = await handleFounderTransfer(req({ action: 'wat' }), deps);
  assertEquals(res.status, 400);
});

// ───────────────────────────── run_due (the due-runner, §6.6) ─────────────────────
/** A recording admin stub that models the case-list + events + profiles reads the
 *  sweeps make, plus rpc + auth.admin. */
// deno-lint-ignore no-explicit-any
function makeRunDueDeps(cfg: {
  secret?: string;
  cases?: Array<Record<string, unknown>>;
  events?: Array<{ case_id: string; event: string }>;
  profiles?: Record<string, { stripe_subscription_id?: string | null }>;
  users?: Record<string, string>;
  expired?: number;
  canceled?: number;
  // deno-lint-ignore no-explicit-any
  payoutClaims?: Array<any>;   // returned one-per-call from claim_due_transfer_payout, then none_due
  connectOn?: boolean;
  priceUnitAmount?: number | null; // stripe price stub unit_amount (null ⇒ prices.retrieve throws)
} = {}) {
  const calls = {
    rpc: [] as Array<{ fn: string; args: unknown }>,
    updateUser: [] as Array<{ id: string; attrs: Record<string, unknown> }>,
    emails: [] as Array<{ to: string; subject: string; text: string }>,
    updates: [] as Array<{ table: string; obj: Record<string, unknown> }>,
    upserts: [] as Array<{ table: string; rows: unknown }>,
    transfers: [] as Array<{ params: Record<string, unknown>; idempotencyKey: string | undefined }>,
    accounts: [] as Array<Record<string, unknown>>,
  };
  const cases = cfg.cases ?? [];
  const events = cfg.events ?? [];
  const profiles = cfg.profiles ?? {};
  const users = cfg.users ?? {};
  const payoutClaims = [...(cfg.payoutClaims ?? [])];
  const rpc = (fn: string, args: unknown) => {
    calls.rpc.push({ fn, args });
    if (fn === 'expire_stale_transfer_cases') return Promise.resolve({ data: cfg.expired ?? 0, error: null });
    if (fn === 'cancel_stale_auto_reload_attempts') return Promise.resolve({ data: cfg.canceled ?? 0, error: null });
    if (fn === 'transfer_case_finalize') return Promise.resolve({ data: { ok: true }, error: null });
    if (fn === 'claim_due_transfer_payout') {
      return Promise.resolve({ data: payoutClaims.length ? payoutClaims.shift() : { ok: false, reason: 'none_due' }, error: null });
    }
    if (fn === 'system_grant_credits') return Promise.resolve({ data: 100, error: null });
    return Promise.resolve({ data: null, error: null });
  };
  // deno-lint-ignore no-explicit-any
  const from = (table: string): any => {
    const filters: Record<string, unknown> = {};
    let mutation = false;
    // deno-lint-ignore no-explicit-any
    const builder: any = {
      select() { return builder; },
      eq(col: string, val: unknown) { filters[col] = val; return builder; },
      lte(col: string, val: unknown) { filters[`${col}__lte`] = val; return builder; },
      in() { return builder; },
      limit() { return builder; },
      not() { return builder; },
      update(obj: Record<string, unknown>) { calls.updates.push({ table, obj }); mutation = true; return builder; },
      upsert(rows: unknown) { calls.upserts.push({ table, rows }); return Promise.resolve({ error: null }); },
      maybeSingle() {
        if (table === 'founder_transfer_events') {
          const found = events.find((e) => e.case_id === filters.case_id && e.event === filters.event);
          return Promise.resolve({ data: found ? { id: 'ev' } : null, error: null });
        }
        if (table === 'profiles') {
          return Promise.resolve({ data: (profiles as Record<string, unknown>)[filters.id as string] ?? null, error: null });
        }
        if (table === 'founder_transfer_cases') {
          // payout_onboarding pending-case lookup.
          return Promise.resolve({ data: (cfg as { pendingPayoutCase?: unknown }).pendingPayoutCase ?? null, error: null });
        }
        return Promise.resolve({ data: null, error: null });
      },
      // deno-lint-ignore no-explicit-any
      then(resolve: any, reject: any) {
        if (mutation) return Promise.resolve({ error: null }).then(resolve, reject);
        let data: Array<Record<string, unknown>> = [];
        if (table === 'founder_transfer_cases') {
          data = cases.filter((c) => c.state === filters.state);
          if (filters['cooling_ends_at__lte']) {
            data = data.filter((c) => c.cooling_ends_at && (c.cooling_ends_at as string) <= (filters['cooling_ends_at__lte'] as string));
          }
        }
        return Promise.resolve({ data, error: null }).then(resolve, reject);
      },
    };
    return builder;
  };
  // deno-lint-ignore no-explicit-any
  const admin: any = {
    rpc, from,
    auth: {
      admin: {
        getUserById: (id: string) => Promise.resolve({ data: { user: { id, email: users[id] ?? `${id}@x.com` } }, error: null }),
        updateUserById: (id: string, attrs: Record<string, unknown>) => { calls.updateUser.push({ id, attrs }); return Promise.resolve({ data: {}, error: null }); },
      },
    },
  };
  // deno-lint-ignore no-explicit-any
  const stripeStub: any = {
    prices: { retrieve: () => cfg.priceUnitAmount === null ? Promise.reject(new Error('no price')) : Promise.resolve({ unit_amount: cfg.priceUnitAmount ?? 499, currency: 'usd' }) },
    transfers: { create: (params: Record<string, unknown>, opts: { idempotencyKey?: string }) => { calls.transfers.push({ params, idempotencyKey: opts?.idempotencyKey }); return Promise.resolve({ id: 'tr_1' }); } },
    accounts: { create: (params: Record<string, unknown>) => { calls.accounts.push(params); return Promise.resolve({ id: 'acct_1' }); } },
    accountLinks: { create: () => Promise.resolve({ url: 'https://connect.stripe/onboard' }) },
    customers: { create: () => Promise.resolve({ id: 'cus_1' }) },
  };
  return {
    calls,
    deps: {
      adminClient: () => admin,
      userClient: () => ({}),
      stripeClient: stripeStub,
      cronSecret: () => cfg.secret ?? 'sekret',
      connectEnabled: () => cfg.connectOn ?? false,
      emailDispatch: (o: { to: string; subject: string; text: string }) => { calls.emails.push(o); return Promise.resolve({ id: 'em' }); },
    },
  };
}

const dueReq = (secret: string | null) =>
  new Request('https://edge/founder-transfer', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(secret !== null ? { 'x-cron-secret': secret } : {}) },
    body: JSON.stringify({ action: 'run_due' }),
  });

Deno.test('run_due: secret not configured → 503 cron_not_configured', async () => {
  const { deps } = makeRunDueDeps({ secret: '' });
  const res = await handleFounderTransfer(dueReq('anything'), { ...deps, cronSecret: () => '' });
  assertEquals(res.status, 503);
  assertEquals((await res.json()).error, 'cron_not_configured');
});

Deno.test('run_due: wrong secret → 403 forbidden', async () => {
  const { deps } = makeRunDueDeps({ secret: 'right' });
  const res = await handleFounderTransfer(dueReq('wrong'), deps);
  assertEquals(res.status, 403);
  assertEquals((await res.json()).error, 'forbidden');
});

Deno.test('run_due: cooling case issues an abort token + emails BOTH parties the link', async () => {
  const { deps, calls } = makeRunDueDeps({
    secret: 's',
    cases: [{ id: 'c1', state: 'cooling', from_user: 'from1', to_user: 'to1', seat_id: 7, to_email_lower: 'nom@x.com', cooling_ends_at: '2999-01-01T00:00:00Z' }],
  });
  const res = await handleFounderTransfer(dueReq('s'), deps);
  const body = await res.json();
  assertEquals(res.status, 200);
  assertEquals(body.swept.coolingNotified, 1);
  // The abort token hash was logged (the idempotency claim) …
  const logged = calls.rpc.find((c) => c.fn === '_log_founder_transfer_event' && (c.args as { p_event: string }).p_event === 'abort_token_issued');
  assertEquals(Boolean(logged), true);
  // … and BOTH parties got the cooling email carrying the session-independent abort link.
  assertEquals(calls.emails.length, 2);
  assertEquals(calls.emails.every((e) => e.text.includes('transfer_abort=')), true);
});

Deno.test('run_due: a cooling case that already has the token is NOT re-issued (idempotent)', async () => {
  const { deps, calls } = makeRunDueDeps({
    secret: 's',
    cases: [{ id: 'c1', state: 'cooling', from_user: 'from1', to_user: 'to1', seat_id: 7, to_email_lower: 'nom@x.com', cooling_ends_at: '2999-01-01T00:00:00Z' }],
    events: [{ case_id: 'c1', event: 'abort_token_issued' }],
  });
  const res = await handleFounderTransfer(dueReq('s'), deps);
  assertEquals((await res.json()).swept.coolingNotified, 0);
  assertEquals(calls.rpc.some((c) => c.fn === '_log_founder_transfer_event' && (c.args as { p_event: string }).p_event === 'abort_token_issued'), false);
  assertEquals(calls.emails.length, 0);
});

Deno.test('run_due: a due (cooling-elapsed) case finalizes + runs the edge leg (non-subscribed → downgraded)', async () => {
  const { deps, calls } = makeRunDueDeps({
    secret: 's',
    cases: [
      { id: 'cd', state: 'cooling', from_user: 'fromD', to_user: 'toD', seat_id: 3, to_email_lower: 'n@x.com', cooling_ends_at: '2000-01-01T00:00:00Z' },
      { id: 'cd', state: 'finalized', from_user: 'fromD', to_user: 'toD', seat_id: 3 },
    ],
    profiles: { fromD: { stripe_subscription_id: null } },
  });
  const res = await handleFounderTransfer(dueReq('s'), deps);
  const body = await res.json();
  assertEquals(res.status, 200);
  assertEquals(body.swept.finalized, 1);
  assertEquals(calls.rpc.some((c) => c.fn === 'transfer_case_finalize'), true);
  // Non-subscribed ex-founder → handle_premium_downgrade fired.
  assertEquals(calls.rpc.some((c) => c.fn === 'handle_premium_downgrade'), true);
  // Incoming holder → restore_premium_settlements fired.
  assertEquals(calls.rpc.some((c) => c.fn === 'restore_premium_settlements'), true);
  // Both auth mirrors: from → tier free + is_founder false; to → tier premium + is_founder true.
  const fromMirror = calls.updateUser.find((u) => u.id === 'fromD');
  assertEquals((fromMirror!.attrs as { user_metadata: { tier: string; is_founder: boolean } }).user_metadata.tier, 'free');
  assertEquals((fromMirror!.attrs as { user_metadata: { is_founder: boolean } }).user_metadata.is_founder, false);
  const toMirror = calls.updateUser.find((u) => u.id === 'toD');
  assertEquals((toMirror!.attrs as { user_metadata: { is_founder: boolean } }).user_metadata.is_founder, true);
});

Deno.test('run_due: a SUBSCRIBED ex-founder KEEPS premium (no downgrade, tier not touched)', async () => {
  const { deps, calls } = makeRunDueDeps({
    secret: 's',
    cases: [{ id: 'cs', state: 'finalized', from_user: 'fromS', to_user: 'toS', seat_id: 4 }],
    profiles: { fromS: { stripe_subscription_id: 'sub_live_123' } },
  });
  await handleFounderTransfer(dueReq('s'), deps);
  // The subscribed ex-founder is NOT downgraded …
  assertEquals(calls.rpc.some((c) => c.fn === 'handle_premium_downgrade'), false);
  // … and their auth mirror flips ONLY is_founder (tier absent ⇒ merge keeps premium).
  const fromMirror = calls.updateUser.find((u) => u.id === 'fromS');
  assertEquals((fromMirror!.attrs as { user_metadata: Record<string, unknown> }).user_metadata.tier, undefined);
  assertEquals((fromMirror!.attrs as { user_metadata: { is_founder: boolean } }).user_metadata.is_founder, false);
});

// ───────────────────────── THE PAYOUT LIMB (§6.6, M-8) ─────────────────────────
// Release via the due-runner: connect_cash → Stripe transfer (idempotency-keyed);
// account_credits → seat_payout credits grant; Connect/rate absent → parked 'held'.

Deno.test('run_due: connect_cash payout releases via ONE Stripe transfer keyed payout-<case>', async () => {
  const { deps, calls } = makeRunDueDeps({
    secret: 's', connectOn: true,
    payoutClaims: [{ ok: true, case_id: 'c1', from_user: 'from1', payout_form: 'connect_cash', payout_amount_cents: 4950, connect_account_id: 'acct_x' }],
  });
  const res = await handleFounderTransfer(dueReq('s'), deps);
  const body = await res.json();
  assertEquals(res.status, 200);
  assertEquals(body.swept.payoutsReleased, 1);
  // Exactly ONE Stripe transfer, idempotency-keyed payout-<case_id> — a redelivery
  // re-sends the SAME transfer object (the double-payout guard's Stripe half).
  assertEquals(calls.transfers.length, 1);
  assertEquals(calls.transfers[0].idempotencyKey, 'payout-c1');
  assertEquals(calls.transfers[0].params.amount, 4950);
  assertEquals(calls.transfers[0].params.destination, 'acct_x');
  // The claim loop ran twice (one job, then none_due) — a claimed row is 'releasing'
  // and never re-claimed: the atomic-claim half of the double-payout guard.
  assertEquals(calls.rpc.filter((c) => c.fn === 'claim_due_transfer_payout').length, 2);
  // payout_status → released + the transfer id stamped.
  const upd = calls.updates.find((u) => u.table === 'founder_transfer_cases');
  assertEquals((upd!.obj as { payout_status: string }).payout_status, 'released');
  assertEquals((upd!.obj as { stripe_transfer_id: string }).stripe_transfer_id, 'tr_1');
  // Mirrored into money_events under event_key payout:<case_id>.
  const me = calls.upserts.find((u) => u.table === 'money_events');
  assertEquals(Boolean(me), true);
  assertEquals((me!.rows as Array<{ event_key: string }>)[0].event_key, 'payout:c1');
});

Deno.test('run_due: connect_cash with Connect ABSENT parks the payout at held (no Stripe call)', async () => {
  const { deps, calls } = makeRunDueDeps({
    secret: 's', connectOn: false,
    payoutClaims: [{ ok: true, case_id: 'c2', from_user: 'from2', payout_form: 'connect_cash', payout_amount_cents: 4950, connect_account_id: null }],
  });
  const res = await handleFounderTransfer(dueReq('s'), deps);
  assertEquals((await res.json()).swept.payoutsReleased, 0);
  assertEquals(calls.transfers.length, 0);
  const upd = calls.updates.find((u) => u.table === 'founder_transfer_cases');
  assertEquals((upd!.obj as { payout_status: string }).payout_status, 'held');
});

Deno.test('run_due: account_credits election grants seat_payout credits round(4950/rate) and releases', async () => {
  __resetRateCacheForTest();
  const { deps, calls } = makeRunDueDeps({
    secret: 's', connectOn: false, priceUnitAmount: 495, // 19.8 c/credit → round(4950*25/495) = 250
    payoutClaims: [{ ok: true, case_id: 'c3', from_user: 'from3', payout_form: 'account_credits', payout_amount_cents: 4950, connect_account_id: null }],
  });
  const res = await handleFounderTransfer(dueReq('s'), deps);
  assertEquals((await res.json()).swept.payoutsReleased, 1);
  assertEquals(calls.transfers.length, 0); // the credits election never touches Connect
  const grant = calls.rpc.find((c) => c.fn === 'system_grant_credits');
  assertEquals(Boolean(grant), true);
  const gArgs = grant!.args as { amount: number; source: string; metadata: { case_id: string } };
  assertEquals(gArgs.amount, 250);
  assertEquals(gArgs.source, 'seat_payout');
  assertEquals(gArgs.metadata.case_id, 'c3'); // dedup key → grant-once per case
  const upd = calls.updates.find((u) => u.table === 'founder_transfer_cases');
  assertEquals((upd!.obj as { payout_status: string }).payout_status, 'released');
});

Deno.test('run_due: account_credits with no configured rate parks at held (LAW 1, grants nothing)', async () => {
  __resetRateCacheForTest();
  const { deps, calls } = makeRunDueDeps({
    secret: 's', priceUnitAmount: null, // prices.retrieve throws → no rate
    payoutClaims: [{ ok: true, case_id: 'c4', from_user: 'from4', payout_form: 'account_credits', payout_amount_cents: 4950 }],
  });
  const res = await handleFounderTransfer(dueReq('s'), deps);
  assertEquals((await res.json()).swept.payoutsReleased, 0);
  assertEquals(calls.rpc.some((c) => c.fn === 'system_grant_credits'), false);
  const upd = calls.updates.find((u) => u.table === 'founder_transfer_cases');
  assertEquals((upd!.obj as { payout_status: string }).payout_status, 'held');
});

Deno.test('payout_onboarding: Connect disabled → clean 503 (KEY-INERT, no Stripe call attempted)', async () => {
  const { deps } = makeDeps({});
  const res = await handleFounderTransfer(req({ action: 'payout_onboarding' }), deps);
  assertEquals(res.status, 503);
  assertEquals((await res.json()).error, 'connect_unavailable');
});

Deno.test('payout_onboarding: Connect enabled + a pending cash payout → Express account, stamp + re-arm', async () => {
  const accounts: Array<Record<string, unknown>> = [];
  // deno-lint-ignore no-explicit-any
  const stripeStub: any = {
    accounts: { create: (p: Record<string, unknown>) => { accounts.push(p); return Promise.resolve({ id: 'acct_new' }); } },
    accountLinks: { create: () => Promise.resolve({ url: 'https://connect/onboard' }) },
  };
  const { deps, updateCalls } = makeDeps({ connectOn: true, stripe: stripeStub, rows: { founder_transfer_cases: { id: 'cx' } } });
  const res = await handleFounderTransfer(req({ action: 'payout_onboarding' }), deps);
  const body = await res.json();
  assertEquals(res.status, 200);
  assertEquals(body.url, 'https://connect/onboard');
  assertEquals(accounts.length, 1); // exactly one Express account created
  // The connected account is stamped, and held cash payouts are re-armed to scheduled.
  assertEquals(updateCalls.some((u) => (u.obj as { connect_account_id?: string }).connect_account_id === 'acct_new'), true);
  assertEquals(updateCalls.some((u) => (u.obj as { payout_status?: string }).payout_status === 'scheduled'), true);
});

Deno.test('reelect_payout: re-opens a parked cash election (RPC ok) → 200, caller-scoped', async () => {
  const { deps, rpcCalls } = makeDeps({ rpc: { reelect_transfer_payout: { ok: true, case_id: 'c9' } } });
  const res = await handleFounderTransfer(req({ action: 'reelect_payout', case_id: 'c9' }), deps);
  assertEquals(res.status, 200);
  assertEquals((await res.json()).ok, true);
  const call = rpcCalls.find((c) => c.fn === 'reelect_transfer_payout');
  assertEquals((call!.args as { p_case: string }).p_case, 'c9');
  assertEquals((call!.args as { p_from: string }).p_from, 'u1'); // the JWT-verified caller
});

Deno.test('reelect_payout: a non-reelectable case → 409', async () => {
  const { deps } = makeDeps({ rpc: { reelect_transfer_payout: { ok: false, reason: 'not_reelectable' } } });
  const res = await handleFounderTransfer(req({ action: 'reelect_payout', case_id: 'c9' }), deps);
  assertEquals(res.status, 409);
  assertEquals((await res.json()).reason, 'not_reelectable');
});
