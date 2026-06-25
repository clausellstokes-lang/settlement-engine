/**
 * index.test.ts — EXECUTION test of the generate-chronicle money/AI trust boundary.
 *
 * generate-chronicle was the only money/AI edge function with NO exported
 * handler+deps seam and NO execution test — everything was inlined in
 * `serve(async req => {...})`, so its boundary was only ever asserted by regex
 * over the source. A refactor that spent before the active gate, leaked the 086
 * reservation on a pre-stream throw, or dropped the model-failure refund would
 * have stayed green.
 *
 * Deno test (runs under the `deno-tests` CI job / `deno task test:edge`, NOT vitest).
 * It RUNS the real handler with injected supabase stubs and asserts:
 *   - an INACTIVE account (account_is_active=false) is rejected and NEVER spends
 *   - a null account_is_active result FAILS CLOSED (never spends)
 *   - a model FAILURE refunds via refund_credits with the EXACT captured spend_id,
 *     releases the 086 reservation, and spends EXACTLY ONCE (no double-spend)
 *   - a pre-stream throw (insufficient credits) RELEASES the 086 reservation
 *   - an oversized body is rejected (413) WITHOUT burning a rate-limit unit
 *     (the body cap now runs before consume_ai_generate_rate_limit)
 *
 * The model failure is induced naturally: the Anthropic fetch is stubbed to a
 * non-ok response (the real `!resp.ok` throw path), not a mocked-out one.
 *
 * `handleGenerateChronicle` is the exported handler; we inject recording stubs via
 * its `deps` seam (production passes nothing).
 *
 * NOTE: authored without a local Deno runtime — verified in CI.
 */
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';

Deno.env.set('SUPABASE_URL', 'https://stub.supabase.co');
Deno.env.set('SUPABASE_ANON_KEY', 'anon_dummy');
Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'service_role_dummy');
Deno.env.set('ANTHROPIC_API_KEY', 'sk-stub');

const { handleGenerateChronicle } = await import('./index.ts');

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

/** Admin (service-role) stub: account_is_active gate, the 086 reservation
 *  (reserve_ai_spend / release_ai_spend_reservation), the rate limiter, the COGS
 *  metering insert, and the refund_credits RPC. `activeResult` drives the gate;
 *  every rpc is recorded so a test can assert which RPCs ran and with what args. */
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
      // reserve_ai_spend (086): allow with an id so the release path runs; the
      // release is a no-op stub. consume_ai_generate_rate_limit fails open, but we
      // allow it explicitly so the stub doesn't depend on that asymmetry.
      if (fn === 'reserve_ai_spend') {
        return Promise.resolve({ data: { allowed: true, reservation_id: 'res_stub' }, error: null });
      }
      if (fn === 'release_ai_spend_reservation') {
        return Promise.resolve({ data: true, error: null });
      }
      if (fn === 'consume_ai_generate_rate_limit') {
        return Promise.resolve({ data: { allowed: true }, error: null });
      }
      return Promise.resolve({ data: null, error: null });
    },
    // COGS metering writes ai_usage_events via the admin client; no-op the insert.
    from: (_table: string) => ({
      insert: (_rows: unknown) => Promise.resolve({ error: null }),
    }),
  };
  return { rpc, adminClient: () => client };
}

const GROUNDING = { headlines: [{ scope: 'realm', significance: 'major', headline: 'A quiet season' }] };

const req = (body: unknown, headers: Record<string, string> = {}) =>
  new Request('https://edge/generate-chronicle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

/** Swap globalThis.fetch for the duration of `run`, then restore it. */
async function withFetch(stub: typeof fetch, run: () => Promise<void>) {
  const original = globalThis.fetch;
  globalThis.fetch = stub;
  try {
    await run();
  } finally {
    globalThis.fetch = original;
  }
}

Deno.test('an INACTIVE account is rejected (fail-closed) and NEVER spends a credit', async () => {
  const user = makeUserClient({ id: 'banned1', email: 'b@x.com' }, { ok: true, spend_id: 'nope', balance: 10 });
  const admin = makeAdminClient(false);   // account_is_active=false
  const res = await handleGenerateChronicle(
    req({ grounding: GROUNDING }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 403);
  assertEquals((await res.json()).error, 'Account is not active');
  assertEquals(user.rpc.some((c) => c.fn === 'spend_credits'), false);   // gate ran before spend
  // No reservation was taken (gate precedes reserve), so none can leak.
  assertEquals(admin.rpc.some((c) => c.fn === 'reserve_ai_spend'), false);
});

Deno.test('a null account_is_active result FAILS CLOSED — never spends', async () => {
  const user = makeUserClient({ id: 'unknown1', email: 'u@x.com' }, { ok: true, spend_id: 'x', balance: 10 });
  const admin = makeAdminClient(null);    // RPC error ⇒ null
  const res = await handleGenerateChronicle(
    req({ grounding: GROUNDING }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 403);
  assertEquals(user.rpc.some((c) => c.fn === 'spend_credits'), false);
});

Deno.test('a model FAILURE refunds via the captured spend_id, releases the reservation, and does NOT double-spend', async () => {
  const SPEND_ID = 'ledger_row_abc123';
  const user = makeUserClient(
    { id: 'payer1', email: 'p@x.com' },
    { ok: true, spend_id: SPEND_ID, balance: 9, elevated: false },
  );
  const admin = makeAdminClient(true);    // active → reaches the spend + the model call
  // Anthropic returns a non-ok response → the handler's `!resp.ok` throws → refund.
  await withFetch(
    () => Promise.resolve(new Response('upstream sad', { status: 529 })),
    async () => {
      const res = await handleGenerateChronicle(
        req({ grounding: GROUNDING }, { Authorization: 'Bearer jwt' }),
        { userClient: user.userClient, adminClient: admin.adminClient },
      );
      assertEquals(res.status, 502);
      const body = await res.json();
      assertEquals(body.refunded, true);

      // Spend ran EXACTLY ONCE (no double-spend on the failure path).
      assertEquals(user.rpc.filter((c) => c.fn === 'spend_credits').length, 1);

      // Refund ran via the SERVICE-ROLE client, targeting the EXACT captured spend_id.
      const refunds = admin.rpc.filter((c) => c.fn === 'refund_credits');
      assertEquals(refunds.length, 1);
      assertEquals((refunds[0].args as { spend_ledger_row: string }).spend_ledger_row, SPEND_ID);

      // The 086 reservation was released on the failure path (no headroom leak).
      assertEquals(admin.rpc.filter((c) => c.fn === 'release_ai_spend_reservation').length, 1);
    },
  );
});

Deno.test('a pre-stream throw (insufficient credits) RELEASES the 086 reservation — no headroom leak', async () => {
  // reserve_ai_spend is taken BEFORE spend_credits. spend fails (insufficient →
  // ok:false), so the handler returns 402 BEFORE the model call. The in-path
  // release must still fire so the reservation's global-cap headroom isn't held
  // for its full TTL (a zero-credit account could otherwise flood reserve→402).
  const user = makeUserClient(
    { id: 'broke1', email: 'b@x.com' },
    { ok: false, reason: 'insufficient_funds', balance: 0 },
  );
  const admin = makeAdminClient(true);
  const res = await handleGenerateChronicle(
    req({ grounding: GROUNDING }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 402);
  assertEquals(admin.rpc.filter((c) => c.fn === 'reserve_ai_spend').length, 1);
  const releases = admin.rpc.filter((c) => c.fn === 'release_ai_spend_reservation');
  assertEquals(releases.length, 1);
  assertEquals((releases[0].args as { p_id: string }).p_id, 'res_stub');
});

Deno.test('an OVERSIZED body is rejected (413) WITHOUT burning a rate-limit unit', async () => {
  // Regression for the reorder: the body cap + parse now run BEFORE
  // consume_ai_generate_rate_limit, so a malformed/oversized body can't exhaust a
  // legitimate user's daily quota. Before the fix the limiter ran first and a 413
  // still consumed a unit.
  const user = makeUserClient({ id: 'flooder1', email: 'f@x.com' }, { ok: true, spend_id: 'x', balance: 10 });
  const admin = makeAdminClient(true);
  const huge = JSON.stringify({ grounding: { blob: 'x'.repeat(70 * 1024) } });
  const res = await handleGenerateChronicle(
    req(huge, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 413);
  // The rate-limit unit was NOT consumed for a rejected oversized body.
  assertEquals(admin.rpc.some((c) => c.fn === 'consume_ai_generate_rate_limit'), false);
  // And nothing downstream of the parse ran (no reservation, no spend).
  assertEquals(admin.rpc.some((c) => c.fn === 'reserve_ai_spend'), false);
  assertEquals(user.rpc.some((c) => c.fn === 'spend_credits'), false);
});

Deno.test('a request with NO authorization header is rejected (401) before any spend', async () => {
  const user = makeUserClient({ id: 'u1' }, { ok: true, spend_id: 'x', balance: 10 });
  const admin = makeAdminClient(true);
  const res = await handleGenerateChronicle(
    req({ grounding: GROUNDING }),   // no Authorization
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 401);
  assertEquals(user.rpc.some((c) => c.fn === 'spend_credits'), false);
});
