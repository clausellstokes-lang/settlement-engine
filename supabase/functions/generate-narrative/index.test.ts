/**
 * index.test.ts — EXECUTION test of the generate-narrative money/AI trust boundary
 * (A+ tests-tooling — the highest-trust untested edge handler: it both spends money
 * and calls the model).
 *
 * Deno test (runs under the `deno-tests` CI job / `deno task test:edge`, NOT vitest).
 * generate-narrative spends credits up-front (the atomic spend_credits RPC) BEFORE
 * streaming, then must (a) NEVER spend for an inactive account (fail-closed gate) and
 * (b) REFUND via the captured spend_id when the generation fails — without double-
 * spending. Previously this was asserted only by regex over the handler source — a
 * refactor that spent before the active gate, dropped the refund, or used the wrong
 * ledger row would have kept those green. This RUNS the real handler with injected
 * supabase stubs and asserts the boundary:
 *   - an INACTIVE account (account_is_active=false) is rejected and NEVER spends
 *   - a null account_is_active result FAILS CLOSED (never spends)
 *   - a thesis-generation FAILURE refunds via refund_credits with the EXACT spend_id
 *     captured from spend_credits, and spend_credits ran EXACTLY ONCE (no double-spend)
 *   - an elevated account that fails does NOT call refund_credits (never charged)
 *
 * The generation failure is induced naturally: ANTHROPIC_API_KEY is unset, so the
 * thesis callModel throws "Anthropic API key is not configured" — the real failure
 * path, not a mocked-out one.
 *
 * `handleGenerateNarrative` is the exported handler; we inject recording stubs via
 * its `deps` seam (production passes nothing).
 *
 * NOTE: authored without a local Deno runtime — verified in CI.
 */
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';

Deno.env.set('SUPABASE_URL', 'https://stub.supabase.co');
Deno.env.set('SUPABASE_ANON_KEY', 'anon_dummy');
Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'service_role_dummy');
// No model keys → the thesis call throws on the real path, exercising the refund.
Deno.env.delete('ANTHROPIC_API_KEY');
Deno.env.delete('OPENAI_API_KEY');

const { handleGenerateNarrative } = await import('./index.ts');

/** user-client stub: getUser() resolves the verified JWT identity, and rpc()
 *  handles spend_credits. `spendResult` is what spend_credits returns; every rpc
 *  call is recorded so a test can assert spend ran exactly once (no double-spend). */
function makeUserClient(
  user: { id: string; email?: string | null } | null,
  spendResult: Record<string, unknown>,
  authError = false,
) {
  const rpc: Array<{ fn: string; args: unknown }> = [];
  // deno-lint-ignore no-explicit-any
  const client: any = {
    auth: {
      getUser: () => Promise.resolve({
        data: { user: authError ? null : user },
        error: authError ? { message: 'bad jwt' } : null,
      }),
    },
    rpc: (fn: string, args: unknown) => {
      rpc.push({ fn, args });
      if (fn === 'spend_credits') return Promise.resolve({ data: spendResult, error: null });
      return Promise.resolve({ data: null, error: null });
    },
  };
  return { rpc, userClient: () => client };
}

/** Admin (service-role) stub: account_is_active gate + the refund_credits RPC.
 *  `activeResult` drives the gate; every rpc is recorded so a test can assert that
 *  refund_credits was (or was NOT) called and with which spend_ledger_row. */
function makeAdminClient(activeResult: boolean | null) {
  const rpc: Array<{ fn: string; args: unknown }> = [];
  // deno-lint-ignore no-explicit-any
  const client: any = {
    rpc: (fn: string, args: unknown) => {
      rpc.push({ fn, args });
      if (fn === 'account_is_active') {
        return Promise.resolve({
          data: activeResult,
          error: activeResult === null ? { message: 'rpc blew up' } : null,
        });
      }
      return Promise.resolve({ data: null, error: null });
    },
  };
  return { rpc, adminClient: () => client };
}

/** A minimal-but-real settlement: enough for summarizeSettlement to run without
 *  throwing, so the handler reaches the streaming thesis call (which then fails). */
const SETTLEMENT = {
  name: 'Testford',
  tier: 'village',
  population: 400,
  config: { terrainType: 'hills', culture: 'frontier', tradeRouteAccess: 'road' },
};

const req = (body: unknown, headers: Record<string, string> = {}) =>
  new Request('https://edge/generate-narrative', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });

/** Drain an NDJSON stream body to completion (the refund runs inside the stream). */
async function drain(res: Response): Promise<string> {
  if (!res.body) return '';
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let out = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    out += decoder.decode(value, { stream: true });
  }
  return out;
}

Deno.test('an INACTIVE account is rejected (fail-closed) and NEVER spends a credit', async () => {
  const user = makeUserClient({ id: 'banned1', email: 'b@x.com' }, { ok: true, spend_id: 'should_not_happen', balance: 10 });
  const admin = makeAdminClient(false);   // account_is_active=false
  const res = await handleGenerateNarrative(
    req({ type: 'narrative', settlement: SETTLEMENT }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 400);
  assertEquals((await res.json()).error, 'Account is not active');
  assertEquals(user.rpc.some((c) => c.fn === 'spend_credits'), false);   // gate ran before spend
});

Deno.test('a null account_is_active result FAILS CLOSED — never spends', async () => {
  const user = makeUserClient({ id: 'unknown1', email: 'u@x.com' }, { ok: true, spend_id: 'x', balance: 10 });
  const admin = makeAdminClient(null);    // RPC error ⇒ null
  const res = await handleGenerateNarrative(
    req({ type: 'narrative', settlement: SETTLEMENT }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 400);
  assertEquals(user.rpc.some((c) => c.fn === 'spend_credits'), false);
});

Deno.test('a thesis FAILURE refunds via the captured spend_id and does NOT double-spend', async () => {
  const SPEND_ID = 'ledger_row_abc123';
  const user = makeUserClient(
    { id: 'payer1', email: 'p@x.com' },
    { ok: true, spend_id: SPEND_ID, balance: 9, elevated: false },
  );
  const admin = makeAdminClient(true);    // active → reaches the spend + the thesis call
  const res = await handleGenerateNarrative(
    req({ type: 'narrative', settlement: SETTLEMENT }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);          // a streaming response opens (200); failure is in-band
  const body = await drain(res);          // run the stream to completion (refund happens inside)

  // The thesis call failed (no API key) → the stream emitted a refunded error line.
  const lines = body.trim().split('\n').map((l) => JSON.parse(l));
  const errLine = lines.find((l) => typeof l.error === 'string' && l.error.includes('Thesis generation failed'));
  assertEquals(errLine !== undefined, true);
  assertEquals(errLine.refunded, true);

  // Spend ran EXACTLY ONCE (no double-spend on the failure path).
  const spends = user.rpc.filter((c) => c.fn === 'spend_credits');
  assertEquals(spends.length, 1);

  // Refund ran via the SERVICE-ROLE client, targeting the EXACT captured spend_id.
  const refunds = admin.rpc.filter((c) => c.fn === 'refund_credits');
  assertEquals(refunds.length, 1);
  assertEquals((refunds[0].args as { spend_ledger_row: string }).spend_ledger_row, SPEND_ID);
});

Deno.test('an ELEVATED account that fails does NOT refund (it was never charged)', async () => {
  const user = makeUserClient(
    { id: 'dev1', email: 'dev@x.com' },
    { ok: true, spend_id: 'elev_row', balance: -2, elevated: true },
  );
  const admin = makeAdminClient(true);
  const res = await handleGenerateNarrative(
    req({ type: 'narrative', settlement: SETTLEMENT }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);
  await drain(res);
  // refund() short-circuits for elevated accounts → refund_credits never called.
  assertEquals(admin.rpc.some((c) => c.fn === 'refund_credits'), false);
});

Deno.test('a request with NO authorization header is rejected (400) before any spend', async () => {
  const user = makeUserClient({ id: 'u1' }, { ok: true, spend_id: 'x', balance: 10 });
  const admin = makeAdminClient(true);
  const res = await handleGenerateNarrative(
    req({ type: 'narrative', settlement: SETTLEMENT }),   // no Authorization
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 400);
  assertEquals(user.rpc.some((c) => c.fn === 'spend_credits'), false);
});
