/**
 * index.test.ts — EXECUTION test of the generate-chronicle MONEY PATH.
 *
 * Deno test (runs under the `deno-tests` CI job / `deno task test:edge`, NOT
 * vitest). Chronicle is the third money-path trust boundary (after stripe-webhook
 * and generate-narrative) and previously had ZERO executed coverage — only
 * regex-over-source contracts in tests/edgeFunctions/contracts.test.js
 * (cross-function secrets / bot-guard / JWT-posture loops), which can't prove
 * that a spend happens BEFORE the model call, that a provider failure refunds the
 * EXACT spend row exactly once, or that auth / malformed-body bail before any
 * spend.
 *
 * `handleGenerateChronicle(req, deps)` is the exported handler. It has THREE
 * injectable seams (production `serve()` passes none, so behavior is identical):
 *   • deps.userClient(authHeader) — anon client bound to the caller's JWT. Runs
 *     auth.getUser() and spend_credits AS THE USER (RLS-scoped).
 *   • deps.adminClient()          — service-role client. Runs refund_credits,
 *     granted only to service_role (migrations 033/047/050).
 *   • deps.anthropicFetch         — the provider fetch to the Anthropic API.
 *
 * We inject recording stubs so each test asserts what the handler actually did.
 *
 * Refund idempotency: refund_credits(spend_ledger_row, refund_reason) has NO
 * separate idempotency-key parameter — idempotency is STRUCTURAL, keyed on the
 * spend_ledger_row itself (migration 050: idx_credit_ledger_one_refund_per_spend;
 * a duplicate refund of the same spend is a NO-OP returning the current balance).
 * So passing spend_ledger_row = spend_id IS passing the idempotency key. The
 * handler does exactly that (mirrors generate-narrative), and at the app layer it
 * calls refund at most once per failure — asserted below.
 *
 * NOTE (mirrors generate-narrative/index.test.ts): env vars are read at MODULE
 * LOAD (ANTHROPIC_API_KEY into the request header), so they are set before the
 * dynamic import. The provider fetch is stubbed, so the key value is inert here.
 */
import { assertEquals, assert } from 'https://deno.land/std@0.224.0/assert/mod.ts';

Deno.env.set('ANTHROPIC_API_KEY', 'sk-ant-test-dummy');
Deno.env.set('SUPABASE_URL', 'https://stub.supabase.co');
Deno.env.set('SUPABASE_ANON_KEY', 'anon_dummy');
Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'service_role_dummy');

const { handleGenerateChronicle } = await import('./index.ts');

// ── Stubs ────────────────────────────────────────────────────────────────────

type SpendResult = { ok: boolean; reason?: string; balance: number; spend_id?: string; elevated?: boolean };

interface UserStubOpts {
  user?: { id: string } | null;
  authError?: { message: string } | null;
  spend?: SpendResult | null;
  spendError?: { message: string } | null;
}

/** Recording stub of the anon+JWT user client: auth.getUser + spend_credits. */
function makeUserStub(opts: UserStubOpts = {}) {
  const {
    user = { id: 'user_1' },
    authError = null,
    spend = { ok: true, balance: 7, spend_id: 'spend_row_1', elevated: false },
    spendError = null,
  } = opts;
  const calls = { authHeaders: [] as string[], rpc: [] as Array<{ fn: string; args: unknown }> };
  const client = {
    auth: {
      getUser: () => Promise.resolve({ data: { user }, error: authError }),
    },
    rpc: (fn: string, args: unknown) => {
      calls.rpc.push({ fn, args });
      if (fn === 'spend_credits') return Promise.resolve({ data: spend, error: spendError });
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
      if (fn === 'refund_credits') return Promise.resolve({ data: 7, error: refundError });
      return Promise.resolve({ data: null, error: null });
    },
  };
  return { calls, factory: () => client };
}

/** Provider fetch that returns a valid Anthropic chronicle body. */
function makeOkFetch(records: { calls: number }) {
  return ((_url: string | URL | Request, _init?: RequestInit) => {
    records.calls++;
    return Promise.resolve(
      new Response(JSON.stringify({ content: [{ text: 'The Silver Fair opened under a bruised sky.' }] }), { status: 200 }),
    );
  }) as typeof fetch;
}

/** Provider fetch that returns a non-ok status → handler throws `Anthropic 500`. */
function makeFailFetch(records: { calls: number }) {
  return ((_url: string | URL | Request, _init?: RequestInit) => {
    records.calls++;
    return Promise.resolve(new Response('provider is down', { status: 500 }));
  }) as typeof fetch;
}

/** Provider fetch that returns 200 but with empty prose → `Empty chronicle`. */
function makeEmptyFetch(records: { calls: number }) {
  return ((_url: string | URL | Request, _init?: RequestInit) => {
    records.calls++;
    return Promise.resolve(new Response(JSON.stringify({ content: [{ text: '   ' }] }), { status: 200 }));
  }) as typeof fetch;
}

const GROUNDING = {
  calendar: { season: 'Harvestide', year: 312 },
  headlines: [{ scope: 'region', significance: 'major', headline: 'A bridge falls at Karn', summary: 'The toll road is severed.' }],
  stressors: [{ label: 'Banditry', severity: 0.6, affected: ['Karn', 'Evermoor'] }],
  realmArcs: [{ headline: 'The Duke musters levies' }],
};

function chronicleRequest(
  body: unknown = { grounding: GROUNDING },
  headers: Record<string, string> = { Authorization: 'Bearer test.jwt' },
) {
  return new Request('https://edge/generate-chronicle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

// ── (a) Happy path: spend BEFORE the model call; success carries creditsRemaining ─
Deno.test('happy path — spends via the user client before the model call; returns chronicle + creditsRemaining', async () => {
  const userStub = makeUserStub({ spend: { ok: true, balance: 7, spend_id: 'spend_row_1', elevated: false } });
  const adminStub = makeAdminStub();
  const fetchRecord = { calls: 0 };

  const res = await handleGenerateChronicle(chronicleRequest(), {
    userClient: userStub.factory,
    adminClient: adminStub.factory,
    anthropicFetch: makeOkFetch(fetchRecord),
  });

  assertEquals(res.status, 200);
  // The spend is awaited BEFORE the provider is called — "spend before work".
  const spend = userStub.calls.rpc.find((c) => c.fn === 'spend_credits');
  assert(spend !== undefined, 'spend_credits must be called before the model call');
  assertEquals((spend!.args as { feature: string }).feature, 'chronicle');
  assertEquals(fetchRecord.calls, 1);
  // The spend runs as the USER, never as admin.
  assertEquals(adminStub.calls.rpc.length, 0);

  const body = await res.json();
  assertEquals(body.chronicle, 'The Silver Fair opened under a bruised sky.');
  assertEquals(body.creditsRemaining, 7);
  // A successful generation never refunds.
  assertEquals(adminStub.calls.rpc.some((c) => c.fn === 'refund_credits'), false);
});

// ── (b) Provider failure AFTER spend → refund the EXACT spend_id, EXACTLY ONCE ──
Deno.test('provider failure after spend refunds the EXACT spend_id exactly once via the admin client', async () => {
  const userStub = makeUserStub({ spend: { ok: true, balance: 6, spend_id: 'spend_row_ABC', elevated: false } });
  const adminStub = makeAdminStub();
  const fetchRecord = { calls: 0 };

  const res = await handleGenerateChronicle(chronicleRequest(), {
    userClient: userStub.factory,
    adminClient: adminStub.factory,
    anthropicFetch: makeFailFetch(fetchRecord),
  });

  assertEquals(res.status, 502);
  const body = await res.json();
  assertEquals(body.error, 'Anthropic 500');
  assertEquals(body.refunded, true);

  assert(userStub.calls.rpc.some((c) => c.fn === 'spend_credits'), 'must have spent before the failure');
  // Refund ran on the service-role client, targeting the exact ledger row the
  // spend created — and exactly once (no double-refund at the app layer).
  const refunds = adminStub.calls.rpc.filter((c) => c.fn === 'refund_credits');
  assertEquals(refunds.length, 1);
  assertEquals((refunds[0].args as { spend_ledger_row: string }).spend_ledger_row, 'spend_row_ABC');
  // spend_ledger_row IS the structural idempotency key (migration 050).
  assert(typeof (refunds[0].args as { refund_reason?: string }).refund_reason === 'string');
});

// ── (b2) Empty prose (200 but no text) is a failure → refund + 502 ────────────
Deno.test('an empty chronicle body refunds and returns 502', async () => {
  const userStub = makeUserStub({ spend: { ok: true, balance: 6, spend_id: 'spend_row_EMPTY', elevated: false } });
  const adminStub = makeAdminStub();
  const fetchRecord = { calls: 0 };

  const res = await handleGenerateChronicle(chronicleRequest(), {
    userClient: userStub.factory,
    adminClient: adminStub.factory,
    anthropicFetch: makeEmptyFetch(fetchRecord),
  });

  assertEquals(res.status, 502);
  const body = await res.json();
  assertEquals(body.error, 'Empty chronicle');
  assertEquals(body.refunded, true);
  const refunds = adminStub.calls.rpc.filter((c) => c.fn === 'refund_credits');
  assertEquals(refunds.length, 1);
  assertEquals((refunds[0].args as { spend_ledger_row: string }).spend_ledger_row, 'spend_row_EMPTY');
});

// ── (b3) Elevated spend that fails is NOT refunded (no phantom credits) ────────
Deno.test('an elevated spend that fails is NOT refunded — refunding a non-debit would mint credits', async () => {
  const userStub = makeUserStub({ spend: { ok: true, balance: -2, spend_id: 'spend_row_ELEV', elevated: true } });
  const adminStub = makeAdminStub();
  const fetchRecord = { calls: 0 };

  const res = await handleGenerateChronicle(chronicleRequest(), {
    userClient: userStub.factory,
    adminClient: adminStub.factory,
    anthropicFetch: makeFailFetch(fetchRecord),
  });

  assertEquals(res.status, 502);
  // The elevated guard short-circuits the refund — the admin client is untouched.
  assertEquals(adminStub.calls.rpc.some((c) => c.fn === 'refund_credits'), false);
});

// ── (c) Spend RPC error → 402, NO work, NO refund ─────────────────────────────
Deno.test('a spend_credits RPC error returns 402 with no provider call and no refund', async () => {
  const userStub = makeUserStub({ spend: null, spendError: { message: 'ledger locked' } });
  const adminStub = makeAdminStub();
  const fetchRecord = { calls: 0 };

  const res = await handleGenerateChronicle(chronicleRequest(), {
    userClient: userStub.factory,
    adminClient: adminStub.factory,
    anthropicFetch: makeOkFetch(fetchRecord),
  });

  assertEquals(res.status, 402);
  const body = await res.json();
  assertEquals(body.error, 'ledger locked');
  // Spend failed → the provider is never called and nothing is refunded.
  assertEquals(fetchRecord.calls, 0);
  assertEquals(adminStub.calls.rpc.length, 0);
});

// ── (c2) Insufficient credits ({ ok:false }) → 402 with balance, NO work ──────
Deno.test('an insufficient-credits spend returns 402 with the balance and does no work', async () => {
  const userStub = makeUserStub({ spend: { ok: false, reason: 'insufficient_funds', balance: 0 } });
  const adminStub = makeAdminStub();
  const fetchRecord = { calls: 0 };

  const res = await handleGenerateChronicle(chronicleRequest(), {
    userClient: userStub.factory,
    adminClient: adminStub.factory,
    anthropicFetch: makeOkFetch(fetchRecord),
  });

  assertEquals(res.status, 402);
  const body = await res.json();
  assertEquals(body.error, 'insufficient_funds');
  assertEquals(body.balance, 0);
  assertEquals(fetchRecord.calls, 0);
  assertEquals(adminStub.calls.rpc.length, 0);
});

// ── (d) Unauthenticated → 401, NO spend ──────────────────────────────────────
Deno.test('an invalid JWT is rejected 401 with no spend', async () => {
  const userStub = makeUserStub({ user: null, authError: { message: 'bad jwt' } });
  const adminStub = makeAdminStub();
  const fetchRecord = { calls: 0 };

  const res = await handleGenerateChronicle(chronicleRequest(), {
    userClient: userStub.factory,
    adminClient: adminStub.factory,
    anthropicFetch: makeOkFetch(fetchRecord),
  });

  assertEquals(res.status, 401);
  const body = await res.json();
  assertEquals(body.error, 'Unauthorized');
  // The spend RPC is never reached, and the provider is never called.
  assertEquals(userStub.calls.rpc.length, 0);
  assertEquals(adminStub.calls.rpc.length, 0);
  assertEquals(fetchRecord.calls, 0);
});

Deno.test('a missing Authorization header is rejected 401 before the user client is built', async () => {
  const userStub = makeUserStub();
  const adminStub = makeAdminStub();
  const fetchRecord = { calls: 0 };

  const res = await handleGenerateChronicle(chronicleRequest({ grounding: GROUNDING }, {}), {
    userClient: userStub.factory,
    adminClient: adminStub.factory,
    anthropicFetch: makeOkFetch(fetchRecord),
  });

  assertEquals(res.status, 401);
  const body = await res.json();
  assertEquals(body.error, 'Missing authorization');
  // Bail happens before the user client is even constructed.
  assertEquals(userStub.calls.authHeaders.length, 0);
  assertEquals(userStub.calls.rpc.length, 0);
  assertEquals(fetchRecord.calls, 0);
});

// ── (e) Malformed / missing grounding → 400 BEFORE any spend ──────────────────
Deno.test('a body with no grounding payload is rejected 400 before any spend', async () => {
  const userStub = makeUserStub();
  const adminStub = makeAdminStub();
  const fetchRecord = { calls: 0 };

  const res = await handleGenerateChronicle(chronicleRequest({ notGrounding: true }), {
    userClient: userStub.factory,
    adminClient: adminStub.factory,
    anthropicFetch: makeOkFetch(fetchRecord),
  });

  assertEquals(res.status, 400);
  const body = await res.json();
  assertEquals(body.error, 'Missing grounding payload');
  // Auth ran (getUser) but the spend never did, and neither did the provider.
  assertEquals(userStub.calls.rpc.some((c) => c.fn === 'spend_credits'), false);
  assertEquals(fetchRecord.calls, 0);
  assertEquals(adminStub.calls.rpc.length, 0);
});

Deno.test('a syntactically invalid JSON body is rejected 400 before any spend', async () => {
  const userStub = makeUserStub();
  const adminStub = makeAdminStub();
  const fetchRecord = { calls: 0 };

  // Raw non-JSON body — req.json() rejects, the handler catches → null → 400.
  const res = await handleGenerateChronicle(chronicleRequest('{ this is not json'), {
    userClient: userStub.factory,
    adminClient: adminStub.factory,
    anthropicFetch: makeOkFetch(fetchRecord),
  });

  assertEquals(res.status, 400);
  const body = await res.json();
  assertEquals(body.error, 'Missing grounding payload');
  assertEquals(userStub.calls.rpc.some((c) => c.fn === 'spend_credits'), false);
  assertEquals(fetchRecord.calls, 0);
  assertEquals(adminStub.calls.rpc.length, 0);
});

// ── Method / preflight guards (contract completeness) ─────────────────────────
Deno.test('a non-POST method is rejected 405 before any client work', async () => {
  const userStub = makeUserStub();
  const adminStub = makeAdminStub();
  const fetchRecord = { calls: 0 };

  const req = new Request('https://edge/generate-chronicle', { method: 'GET' });
  const res = await handleGenerateChronicle(req, {
    userClient: userStub.factory,
    adminClient: adminStub.factory,
    anthropicFetch: makeOkFetch(fetchRecord),
  });

  assertEquals(res.status, 405);
  assertEquals(userStub.calls.authHeaders.length, 0);
  assertEquals(fetchRecord.calls, 0);
});

Deno.test('an OPTIONS preflight returns 200 with CORS headers and does no work', async () => {
  const userStub = makeUserStub();
  const adminStub = makeAdminStub();
  const fetchRecord = { calls: 0 };

  const req = new Request('https://edge/generate-chronicle', { method: 'OPTIONS' });
  const res = await handleGenerateChronicle(req, {
    userClient: userStub.factory,
    adminClient: adminStub.factory,
    anthropicFetch: makeOkFetch(fetchRecord),
  });

  assertEquals(res.status, 200);
  assertEquals(res.headers.get('Access-Control-Allow-Origin'), '*');
  assertEquals(fetchRecord.calls, 0);
});
