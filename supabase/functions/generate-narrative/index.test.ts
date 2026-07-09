/**
 * index.test.ts — EXECUTION test of the generate-narrative MONEY PATH.
 *
 * Deno test (runs under the `deno-tests` CI job / `deno task test:edge`, NOT
 * vitest). The spend → stream → provider-failure → refund path is the second
 * money-path trust boundary (after stripe-webhook) and previously had ZERO
 * executed coverage — only regex-over-source contracts in vitest, which can't
 * prove that a spend happens before streaming, that a provider failure refunds
 * the EXACT spend row, or that a refund failure surfaces on the stream.
 *
 * `handleGenerateNarrative(req, deps)` is the exported handler. It has THREE
 * injectable seams (production `serve()` passes none, so behavior is identical):
 *   • deps.userClient(authHeader) — anon client bound to the caller's JWT. Runs
 *     auth.getUser() and spend_credits AS THE USER.
 *   • deps.adminClient()          — service-role client. Runs refund_credits.
 *   • deps.anthropicFetch         — the provider fetch (threaded into callModel).
 *
 * We inject recording stubs so each test asserts what the handler actually did.
 *
 * NOTE (mirrors stripe-webhook/index.test.ts): the env vars below are read at
 * MODULE LOAD (ANTHROPIC_API_KEY especially — callAnthropic bails before fetch
 * without it), so they must be set before the dynamic import.
 */
import { assertEquals, assert } from 'https://deno.land/std@0.224.0/assert/mod.ts';

Deno.env.set('ANTHROPIC_API_KEY', 'sk-ant-test-dummy');
Deno.env.set('SUPABASE_URL', 'https://stub.supabase.co');
Deno.env.set('SUPABASE_ANON_KEY', 'anon_dummy');
Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'service_role_dummy');

const { handleGenerateNarrative } = await import('./index.ts');

// ── Stubs ────────────────────────────────────────────────────────────────────

type SpendResult = { ok: boolean; reason?: string; balance: number; spend_id?: string; elevated?: boolean };

type NarrateLimit = { allowed: boolean; window_seconds?: number };

interface UserStubOpts {
  user?: { id: string } | null;
  authError?: { message: string } | null;
  spend?: SpendResult;
  spendError?: { message: string } | null;
  narrateLimit?: NarrateLimit | null;
  narrateLimitError?: { message: string } | null;
}

/** Recording stub of the anon+JWT user client: auth.getUser + spend_credits +
 *  consume_narrate_rate_limit. narrateLimit defaults to null (→ { data:null }),
 *  which the handler treats as "allowed" (fail-open) — so the existing money-path
 *  tests keep passing untouched. */
function makeUserStub(opts: UserStubOpts = {}) {
  const {
    user = { id: 'user_1' },
    authError = null,
    spend = { ok: true, balance: 42, spend_id: 'spend_row_1', elevated: false },
    spendError = null,
    narrateLimit = null,
    narrateLimitError = null,
  } = opts;
  const calls = { authHeaders: [] as string[], rpc: [] as Array<{ fn: string; args: unknown }> };
  const client = {
    auth: {
      getUser: () => Promise.resolve({ data: { user }, error: authError }),
    },
    rpc: (fn: string, args: unknown) => {
      calls.rpc.push({ fn, args });
      if (fn === 'spend_credits') return Promise.resolve({ data: spend, error: spendError });
      if (fn === 'consume_narrate_rate_limit') return Promise.resolve({ data: narrateLimit, error: narrateLimitError });
      return Promise.resolve({ data: null, error: null });
    },
  };
  // deps.userClient is (authHeader) => client
  const factory = (authHeader: string) => { calls.authHeaders.push(authHeader); return client; };
  return { calls, factory };
}

interface AdminStubOpts {
  refundError?: { message: string } | null;
}

/** Recording stub of the service-role admin client: refund_credits. */
function makeAdminStub(opts: AdminStubOpts = {}) {
  const { refundError = null } = opts;
  const calls = { rpc: [] as Array<{ fn: string; args: unknown }> };
  const client = {
    rpc: (fn: string, args: unknown) => {
      calls.rpc.push({ fn, args });
      if (fn === 'refund_credits') return Promise.resolve({ error: refundError });
      return Promise.resolve({ error: null });
    },
  };
  return { calls, factory: () => client };
}

/** Provider fetch that always returns a valid Anthropic body (thesis + no-op
 *  refinement JSON). Records how many times it was called. */
function makeOkFetch(records: { calls: number }) {
  return ((_url: string | URL | Request, _init?: RequestInit) => {
    records.calls++;
    // `{"items":[]}` is valid JSON that every refinement pass's apply() accepts
    // as a clean no-op, and a harmless (if terse) thesis string.
    return Promise.resolve(new Response(JSON.stringify({ content: [{ text: '{"items":[]}' }] }), { status: 200 }));
  }) as typeof fetch;
}

/** Provider fetch that fails with a NON-retryable status (400 isn't in the
 *  429/500/503/529 retry set) so callAnthropic throws immediately — no backoff. */
function makeFailFetch(records: { calls: number }) {
  return ((_url: string | URL | Request, _init?: RequestInit) => {
    records.calls++;
    return Promise.resolve(new Response('provider is down', { status: 400 }));
  }) as typeof fetch;
}

const MINIMAL_SETTLEMENT = { name: 'Testburg', tier: 'village' };

function narrativeRequest(headers: Record<string, string> = { Authorization: 'Bearer test.jwt' }) {
  return new Request('https://edge/generate-narrative', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify({ type: 'narrative', settlement: MINIMAL_SETTLEMENT }),
  });
}

/** Drain an NDJSON stream body into parsed frames. */
async function readFrames(res: Response): Promise<Array<Record<string, unknown>>> {
  const text = await res.text();
  return text
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line));
}

// ── (a) Happy path: spend BEFORE stream, done frame carries creditsRemaining ──
Deno.test('happy path — spends via the user client before streaming; done frame carries creditsRemaining', async () => {
  const userStub = makeUserStub({ spend: { ok: true, balance: 42, spend_id: 'spend_row_1', elevated: false } });
  const adminStub = makeAdminStub();
  const fetchRecord = { calls: 0 };

  const res = await handleGenerateNarrative(narrativeRequest(), {
    userClient: userStub.factory,
    adminClient: adminStub.factory,
    anthropicFetch: makeOkFetch(fetchRecord),
  });

  // The spend is awaited BEFORE the streaming Response is constructed, so by the
  // time the handler resolves the spend has already been recorded on the user
  // client — this is the "spend before streaming" ordering guarantee.
  assertEquals(res.status, 200);
  const spend = userStub.calls.rpc.find((c) => c.fn === 'spend_credits');
  assert(spend !== undefined, 'spend_credits must be called before the stream is returned');
  assertEquals((spend!.args as { feature: string }).feature, 'narrative'); // standard tier → base feature
  // The spend runs as the USER (the anon+JWT client), never as admin.
  assertEquals(adminStub.calls.rpc.length, 0);

  const frames = await readFrames(res);
  const done = frames.find((f) => f.done === true);
  assert(done !== undefined, 'stream must emit a done frame');
  assertEquals(done!.creditsRemaining, 42);          // canonical post-spend balance
  assertEquals(done!.type, 'narrative');
  // A successful generation never refunds.
  assertEquals(adminStub.calls.rpc.some((c) => c.fn === 'refund_credits'), false);
});

// ── (b) Provider failure AFTER spend → refund targets the EXACT spend_id ──────
Deno.test('provider failure after spend refunds the EXACT spend_id via the admin client', async () => {
  const userStub = makeUserStub({ spend: { ok: true, balance: 41, spend_id: 'spend_row_ABC', elevated: false } });
  const adminStub = makeAdminStub();
  const fetchRecord = { calls: 0 };

  const res = await handleGenerateNarrative(narrativeRequest(), {
    userClient: userStub.factory,
    adminClient: adminStub.factory,
    anthropicFetch: makeFailFetch(fetchRecord),
  });

  assertEquals(res.status, 200);            // failure is reported IN the stream, not as an HTTP error
  assert(userStub.calls.rpc.some((c) => c.fn === 'spend_credits'), 'must have spent before the failure');

  const frames = await readFrames(res);
  // Refund ran on the service-role client against the exact ledger row the spend created.
  const refund = adminStub.calls.rpc.find((c) => c.fn === 'refund_credits');
  assert(refund !== undefined, 'refund_credits must run after a post-spend provider failure');
  assertEquals((refund!.args as { spend_ledger_row: string }).spend_ledger_row, 'spend_row_ABC');
  // The stream tells the client the thesis failed and the credit was refunded.
  const errFrame = frames.find((f) => typeof f.error === 'string' && f.refunded === true);
  assert(errFrame !== undefined, 'stream must carry an error+refunded frame');
});

// ── (c) Refund failure → {refund:'failed', spend_id, supportNote} NDJSON line ─
Deno.test('a refund RPC failure surfaces a {refund:"failed", spend_id, supportNote} line on the stream', async () => {
  const userStub = makeUserStub({ spend: { ok: true, balance: 40, spend_id: 'spend_row_XYZ', elevated: false } });
  const adminStub = makeAdminStub({ refundError: { message: 'ledger locked' } });
  const fetchRecord = { calls: 0 };

  const res = await handleGenerateNarrative(narrativeRequest(), {
    userClient: userStub.factory,
    adminClient: adminStub.factory,
    anthropicFetch: makeFailFetch(fetchRecord),
  });

  const frames = await readFrames(res);
  // The refund was ATTEMPTED against the right row…
  const refund = adminStub.calls.rpc.find((c) => c.fn === 'refund_credits');
  assert(refund !== undefined);
  assertEquals((refund!.args as { spend_ledger_row: string }).spend_ledger_row, 'spend_row_XYZ');
  // …and because it failed, a loud support line is emitted (no silent swallow).
  const failLine = frames.find((f) => f.refund === 'failed');
  assert(failLine !== undefined, 'a refund-failure line must be emitted');
  assertEquals(failLine!.spend_id, 'spend_row_XYZ');
  assert(typeof failLine!.supportNote === 'string' && (failLine!.supportNote as string).length > 0);
});

// ── (d) Unauthenticated → 401, NO spend ──────────────────────────────────────
Deno.test('an invalid JWT is rejected 401 with no spend', async () => {
  const userStub = makeUserStub({ user: null, authError: { message: 'bad jwt' } });
  const adminStub = makeAdminStub();
  const fetchRecord = { calls: 0 };

  const res = await handleGenerateNarrative(narrativeRequest(), {
    userClient: userStub.factory,
    adminClient: adminStub.factory,
    anthropicFetch: makeOkFetch(fetchRecord),
  });

  assertEquals(res.status, 401);
  const body = await res.json();
  assertEquals(body.error, 'Not authenticated');
  // The spend RPC is never reached, and the provider is never called.
  assertEquals(userStub.calls.rpc.length, 0);
  assertEquals(adminStub.calls.rpc.length, 0);
  assertEquals(fetchRecord.calls, 0);
});

Deno.test('a missing Authorization header is rejected 401 before the user client is built', async () => {
  const userStub = makeUserStub();
  const adminStub = makeAdminStub();
  const fetchRecord = { calls: 0 };

  const res = await handleGenerateNarrative(narrativeRequest({}), {
    userClient: userStub.factory,
    adminClient: adminStub.factory,
    anthropicFetch: makeOkFetch(fetchRecord),
  });

  assertEquals(res.status, 401);
  const body = await res.json();
  assertEquals(body.error, 'Missing authorization header');
  // Bail happens before the user client is even constructed.
  assertEquals(userStub.calls.authHeaders.length, 0);
  assertEquals(userStub.calls.rpc.length, 0);
  assertEquals(fetchRecord.calls, 0);
});

// ── (f) Velocity ceiling: a throttled user is rejected 429 before any spend ───
Deno.test('a velocity-throttled user is rejected 429 before any spend or provider call', async () => {
  const userStub = makeUserStub({ narrateLimit: { allowed: false, window_seconds: 3600 } });
  const adminStub = makeAdminStub();
  const fetchRecord = { calls: 0 };

  const res = await handleGenerateNarrative(narrativeRequest(), {
    userClient: userStub.factory,
    adminClient: adminStub.factory,
    anthropicFetch: makeOkFetch(fetchRecord),
  });

  assertEquals(res.status, 429);
  assertEquals(res.headers.get('Retry-After'), '3600');
  const body = await res.json();
  assert(typeof body.error === 'string' && body.error.length > 0, 'a throttle message is returned');
  // The limiter ran on the USER client, but NO spend and NO provider call happened,
  // and refund (admin) was never touched — a throttled call costs nothing.
  assert(userStub.calls.rpc.some((c) => c.fn === 'consume_narrate_rate_limit'), 'the limiter must run');
  assertEquals(userStub.calls.rpc.some((c) => c.fn === 'spend_credits'), false);
  assertEquals(fetchRecord.calls, 0);
  assertEquals(adminStub.calls.rpc.length, 0);
});

// ── (g) Fail-open: a limiter error never blocks a legitimate paying user ──────
Deno.test('a limiter error fails open — the narration still proceeds to spend', async () => {
  const userStub = makeUserStub({ narrateLimitError: { message: 'limiter unavailable' } });
  const adminStub = makeAdminStub();
  const fetchRecord = { calls: 0 };

  const res = await handleGenerateNarrative(narrativeRequest(), {
    userClient: userStub.factory,
    adminClient: adminStub.factory,
    anthropicFetch: makeOkFetch(fetchRecord),
  });

  assertEquals(res.status, 200);
  // The limiter was consulted and errored, but the spend still ran (fail-open).
  assert(userStub.calls.rpc.some((c) => c.fn === 'consume_narrate_rate_limit'));
  assert(userStub.calls.rpc.some((c) => c.fn === 'spend_credits'), 'fail-open must still spend');
});
