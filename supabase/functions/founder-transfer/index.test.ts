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

const { handleFounderTransfer } = await import('./index.ts');

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
} = {}) {
  const rpcCalls: Array<{ fn: string; args: unknown }> = [];
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
    // deno-lint-ignore no-explicit-any
    const b: any = { select: () => b, eq: () => b, not: () => b, maybeSingle: () => Promise.resolve({ data: (cfg.rows ?? {})[table] ?? null, error: null }), update: () => ({ eq: () => Promise.resolve({ error: null }) }) };
    return b;
  };
  // deno-lint-ignore no-explicit-any
  const admin: any = { rpc, from, auth: { admin: { getUserById: () => Promise.resolve({ data: { user: { updated_at: '2000-01-01T00:00:00Z' } }, error: null }) } } };
  // deno-lint-ignore no-explicit-any
  const userClient: any = { auth: { getUser: () => Promise.resolve({ data: { user: cfg.user === undefined ? { id: 'u1', email: 'from@x.com' } : cfg.user }, error: null }) }, rpc };
  return {
    rpcCalls,
    deps: { adminClient: () => admin, userClient: () => userClient, emailDispatch: () => Promise.resolve({ id: 'em' }) },
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
