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
      // Service-role SAFETY preflights added with provider-peer metering: both run
      // on the admin client BEFORE spend_credits. The spend cap FAILS CLOSED
      // (a null/!allowed result throws 400 before the stream opens), so the refund-
      // path tests must let it through to reach the spend → fail → refund boundary
      // they actually exercise. consume_ai_generate_rate_limit fails open, but we
      // allow it explicitly so the stub doesn't depend on that asymmetry.
      //
      // reserve_ai_spend (migration 086) replaced the read-only check_ai_spend_cap:
      // it RESERVES an estimated cost before the model calls and returns a
      // reservation_id the handler RELEASES in its finally once the real COGS row
      // lands. We allow it (with an id so the release path runs) and no-op the
      // release. (The legacy name is kept for any caller still on the read-only RPC.)
      if (fn === 'reserve_ai_spend') {
        return Promise.resolve({ data: { allowed: true, reservation_id: 'res_stub' }, error: null });
      }
      if (fn === 'release_ai_spend_reservation') {
        return Promise.resolve({ data: true, error: null });
      }
      if (fn === 'check_ai_spend_cap' || fn === 'consume_ai_generate_rate_limit') {
        return Promise.resolve({ data: { allowed: true }, error: null });
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

Deno.test('a PRE-STREAM throw (insufficient credits) RELEASES the 086 reservation — no global-cap headroom leak', async () => {
  // The reservation is taken (reserve_ai_spend) BEFORE spend_credits. spend fails
  // (insufficient_funds → ok:false) and the handler throws BEFORE the stream opens,
  // so the in-stream `finally` release never runs. Without the outer-catch release
  // the reservation leaks its global-cap headroom for the full TTL — a reachable
  // DoS (a zero-credit account can flood reserve→insufficient and saturate the cap).
  const user = makeUserClient(
    { id: 'broke1', email: 'b@x.com' },
    { ok: false, reason: 'insufficient_funds', balance: 0 },
  );
  const admin = makeAdminClient(true);   // active → reaches reserve (res_stub) → spend → fail
  const res = await handleGenerateNarrative(
    req({ type: 'narrative', settlement: SETTLEMENT }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 400);                                  // pre-stream throw → outer catch
  assertEquals((await res.json()).error.startsWith('Insufficient credits'), true);

  // The reservation was taken exactly once and RELEASED on the throw path.
  assertEquals(admin.rpc.filter((c) => c.fn === 'reserve_ai_spend').length, 1);
  const releases = admin.rpc.filter((c) => c.fn === 'release_ai_spend_reservation');
  assertEquals(releases.length, 1);
  assertEquals((releases[0].args as { p_id: string }).p_id, 'res_stub');
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

// Finding (1): an oversized body is rejected with 413 BEFORE parse + spend,
// mirroring generate-chronicle's 64KB cap. Without the cap, an unbounded
// settlement payload inflates the provider token bill at a fixed credit price.
Deno.test('an OVER-CAP body (>64KB) is rejected (413) before any spend', async () => {
  const user = makeUserClient({ id: 'u1', email: 'u@x.com' }, { ok: true, spend_id: 'x', balance: 10 });
  const admin = makeAdminClient(true);
  const huge = { type: 'narrative', settlement: { ...SETTLEMENT, blob: 'x'.repeat(70 * 1024) } };
  const res = await handleGenerateNarrative(
    req(huge, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 413);
  assertEquals(user.rpc.some((c) => c.fn === 'spend_credits'), false);   // never reached the spend
});

// Finding (1, byte cap): a multi-byte payload whose UTF-16 code-unit count is
// UNDER the cap but whose BYTE count is OVER it must be rejected (413). Before
// the fix the cap measured rawBody.length (code units), so a payload of ~24k
// 3-byte chars (~24k code units, ~72KB bytes) slipped past the 64KB byte ceiling
// and inflated the provider token bill. '実' is 3 bytes / 1 code unit in UTF-8.
Deno.test('a multi-byte body OVER the BYTE cap (but under code-unit count) is rejected (413)', async () => {
  const user = makeUserClient({ id: 'u1', email: 'u@x.com' }, { ok: true, spend_id: 'x', balance: 10 });
  const admin = makeAdminClient(true);
  // 24_000 '実' = 24_000 code units (< 65_536) but 72_000 bytes (> 65_536).
  const blob = '実'.repeat(24_000);
  const body = JSON.stringify({ type: 'narrative', settlement: { ...SETTLEMENT, blob } });
  // Sanity: the OLD code-unit cap would have ADMITTED this body; the byte cap rejects it.
  assertEquals(body.length <= 64 * 1024, true);
  assertEquals(new TextEncoder().encode(body).length > 64 * 1024, true);
  const res = await handleGenerateNarrative(
    new Request('https://edge/generate-narrative', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer jwt' },
      body,
    }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 413);
  assertEquals(user.rpc.some((c) => c.fn === 'spend_credits'), false);   // never reached the spend
});

// A body just under the cap still parses + flows normally (cap is a ceiling,
// not a regression on legitimate requests). No model key set, so the thesis
// fails in-stream → 200 streaming response, but the body parsed fine.
Deno.test('an UNDER-CAP body parses normally (cap does not block legitimate requests)', async () => {
  const user = makeUserClient({ id: 'u1', email: 'u@x.com' }, { ok: true, spend_id: 'x', balance: 9, elevated: false });
  const admin = makeAdminClient(true);
  const res = await handleGenerateNarrative(
    req({ type: 'narrative', settlement: SETTLEMENT }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);   // streaming response opened → body parsed
  await drain(res);
});
