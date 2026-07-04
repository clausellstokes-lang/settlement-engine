/**
 * emptyOutput.test.ts — EXECUTION tests that a BILLED-but-BLANK provider response
 * is treated as a thesis-stage FAILURE (full refund), not a silent success.
 *
 * Deno test (runs under `deno task test:edge`, NOT vitest). Companion to
 * index.test.ts, which induces failure by leaving the provider key unset (a
 * thrown "not configured" error). THIS file exercises the OTHER failure mode:
 * the provider call SUCCEEDS (HTTP 200) but yields no usable text —
 *   (a) an Anthropic 200 with an empty content block, and
 *   (b) an OpenAI Responses 200 with status:'incomplete' + empty output_text
 *       (reasoning-token budget starvation — finding #2).
 * Before the fix both wrote aiClone.thesis='' with done:true and charged the
 * full spend for blank output. Now an empty/whitespace thesis (and an incomplete
 * OpenAI response) throws into the SAME refund path as a thrown provider error:
 * shouldRefundOnFailure('thesis') → full refund via the captured spend_id.
 *
 * Provider selection is server-authoritative (resolveModelPreference reads
 * system_config forced_override + profiles), so the admin stub's `from()`
 * returns a forced_override to pin the provider under test. `fetch` is stubbed
 * per-test to return the exact provider envelope we want to exercise.
 */
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';

// Set BOTH keys BEFORE importing the module — callAnthropic/callOpenAI read them
// into module-scope constants at load, and these tests need the key check to
// PASS so the (mocked) fetch is reached rather than short-circuiting.
Deno.env.set('SUPABASE_URL', 'https://stub.supabase.co');
Deno.env.set('SUPABASE_ANON_KEY', 'anon_dummy');
Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'service_role_dummy');
Deno.env.set('ANTHROPIC_API_KEY', 'sk-ant-stub');
Deno.env.set('OPENAI_API_KEY', 'sk-openai-stub');

const { handleGenerateNarrative } = await import('./index.ts');

/** user-client stub: verified identity + spend_credits (records every rpc). */
function makeUserClient(spendResult: Record<string, unknown>) {
  const rpc: Array<{ fn: string; args: unknown }> = [];
  // deno-lint-ignore no-explicit-any
  const client: any = {
    auth: {
      getUser: () => Promise.resolve({ data: { user: { id: 'payer1', email: 'p@x.com' } }, error: null }),
    },
    rpc: (fn: string, args: unknown) => {
      rpc.push({ fn, args });
      if (fn === 'spend_credits') return Promise.resolve({ data: spendResult, error: null });
      if (fn === 'current_user_is_privileged') return Promise.resolve({ data: false, error: null });
      return Promise.resolve({ data: null, error: null });
    },
  };
  return { rpc, userClient: () => client };
}

/** Admin (service-role) stub: gate + refund + spend-cap + a `from()` that pins the
 *  server-resolved model preference via a system_config forced_override. */
function makeAdminClient(forcedOverride: string) {
  const rpc: Array<{ fn: string; args: unknown }> = [];
  // deno-lint-ignore no-explicit-any
  const from = (table: string): any => ({
    select: () => ({
      eq: () => ({
        maybeSingle: () => {
          if (table === 'system_config') {
            return Promise.resolve({ data: { value: { forced_override: forcedOverride } }, error: null });
          }
          return Promise.resolve({ data: null, error: null });
        },
      }),
    }),
    // ai_usage_events insert (metering) — best-effort no-op.
    insert: () => Promise.resolve({ error: null }),
  });
  // deno-lint-ignore no-explicit-any
  const client: any = {
    from,
    rpc: (fn: string, args: unknown) => {
      rpc.push({ fn, args });
      if (fn === 'account_is_active') return Promise.resolve({ data: true, error: null });
      if (fn === 'reserve_ai_spend') {
        return Promise.resolve({ data: { allowed: true, reservation_id: 'res_stub' }, error: null });
      }
      if (fn === 'release_ai_spend_reservation') return Promise.resolve({ data: true, error: null });
      if (fn === 'get_credit_balance') return Promise.resolve({ data: 100, error: null });
      if (fn === 'consume_ai_generate_rate_limit') return Promise.resolve({ data: { allowed: true }, error: null });
      if (fn === 'refund_credits') return Promise.resolve({ data: { ok: true }, error: null });
      return Promise.resolve({ data: null, error: null });
    },
  };
  return { rpc, adminClient: () => client };
}

const SETTLEMENT = {
  name: 'Testford',
  tier: 'village',
  population: 400,
  config: { terrainType: 'hills', culture: 'frontier', tradeRouteAccess: 'road' },
};

const req = (body: unknown) =>
  new Request('https://edge/generate-narrative', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer jwt' },
    body: JSON.stringify(body),
  });

async function drain(res: Response): Promise<Record<string, unknown>[]> {
  if (!res.body) return [];
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let out = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    out += decoder.decode(value, { stream: true });
  }
  return out.trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
}

/** Install a fetch stub for the provider host, restore the real fetch after. */
function withFetch(handler: (url: string, init: RequestInit) => Response, run: () => Promise<void>) {
  const real = globalThis.fetch;
  // deno-lint-ignore no-explicit-any
  (globalThis as any).fetch = (input: string | URL | Request, init?: RequestInit) =>
    Promise.resolve(handler(String(input), init ?? {}));
  return run().finally(() => { globalThis.fetch = real; });
}

const SPEND_ID = 'ledger_row_empty';

/** Assert the drained stream shows a thesis-failure + refund via the captured id. */
function assertRefunded(lines: Record<string, unknown>[], admin: ReturnType<typeof makeAdminClient>) {
  // The stream never emitted a `done:true` success line for blank output.
  assertEquals(lines.some((l) => l.done === true), false);
  const errLine = lines.find((l) => typeof l.error === 'string');
  assertEquals(errLine !== undefined, true);
  assertEquals(errLine!.refunded, true);
  // Refund ran EXACTLY once against the captured spend_id.
  const refunds = admin.rpc.filter((c) => c.fn === 'refund_credits');
  assertEquals(refunds.length, 1);
  assertEquals((refunds[0].args as { spend_ledger_row: string }).spend_ledger_row, SPEND_ID);
}

Deno.test('an EMPTY Anthropic thesis (200 with blank content) refunds and is NOT a success', async () => {
  const user = makeUserClient({ ok: true, spend_id: SPEND_ID, balance: 9, elevated: false });
  const admin = makeAdminClient('anthropic_claude_opus_4_8');
  await withFetch(
    (url) => {
      // Anthropic Messages: 200 with an empty text block (billed, no output).
      if (url.includes('api.anthropic.com')) {
        return new Response(
          JSON.stringify({ content: [{ type: 'text', text: '   ' }], usage: { input_tokens: 500, output_tokens: 0 } }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        );
      }
      return new Response('{}', { status: 200 });
    },
    async () => {
      const res = await handleGenerateNarrative(
        req({ type: 'narrative', settlement: SETTLEMENT }),
        { userClient: user.userClient, adminClient: admin.adminClient },
      );
      assertEquals(res.status, 200);          // stream opens; failure is in-band
      assertRefunded(await drain(res), admin);
      // Spend ran exactly once — no double-spend on the empty-output path.
      assertEquals(user.rpc.filter((c) => c.fn === 'spend_credits').length, 1);
    },
  );
});

Deno.test('an OpenAI status:incomplete response (reasoning starved the budget) refunds', async () => {
  const user = makeUserClient({ ok: true, spend_id: SPEND_ID, balance: 9, elevated: false });
  const admin = makeAdminClient('openai_gpt_5_2');
  let sawReasoning = false;
  let sawHeadroom = false;
  await withFetch(
    (url, init) => {
      if (url.includes('api.openai.com')) {
        // Finding #2: the request must carry an explicit minimal reasoning effort
        // and headroom above the 600-token thesis budget so reasoning can't starve
        // the visible output silently.
        const sent = JSON.parse(String(init.body ?? '{}'));
        sawReasoning = sent?.reasoning?.effort === 'low';
        sawHeadroom = typeof sent?.max_output_tokens === 'number' && sent.max_output_tokens > 600;
        // Responses API: reasoning consumed the whole budget → incomplete + empty.
        return new Response(
          JSON.stringify({
            status: 'incomplete',
            incomplete_details: { reason: 'max_output_tokens' },
            output_text: '',
            output: [],
            usage: { input_tokens: 500, output_tokens: 600 },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        );
      }
      return new Response('{}', { status: 200 });
    },
    async () => {
      const res = await handleGenerateNarrative(
        req({ type: 'narrative', settlement: SETTLEMENT }),
        { userClient: user.userClient, adminClient: admin.adminClient },
      );
      assertEquals(res.status, 200);
      assertRefunded(await drain(res), admin);
      assertEquals(sawReasoning, true);   // reasoning:{ effort:'low' } was sent
      assertEquals(sawHeadroom, true);    // max_output_tokens > the pass budget
    },
  );
});

Deno.test('a NON-EMPTY OpenAI completed response streams a done:true success (control)', async () => {
  const user = makeUserClient({ ok: true, spend_id: SPEND_ID, balance: 9, elevated: false });
  const admin = makeAdminClient('openai_gpt_5_2');
  await withFetch(
    (url) => {
      if (url.includes('api.openai.com')) {
        // A real completed thesis + then non-empty refinement/dailyLife passes.
        // Refinement passes JSON.parse the body, so return a JSON object; the
        // thesis/dailyLife just take the text. A single generic body that is
        // valid JSON works for all: prose passes read output_text as-is, JSON
        // passes parse it. Use a JSON object string so safeJsonParse succeeds.
        return new Response(
          JSON.stringify({
            status: 'completed',
            output_text: '{"thesis":"A frontier village clinging to the hills."}',
            usage: { input_tokens: 500, output_tokens: 40 },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        );
      }
      return new Response('{}', { status: 200 });
    },
    async () => {
      const res = await handleGenerateNarrative(
        req({ type: 'narrative', settlement: SETTLEMENT }),
        { userClient: user.userClient, adminClient: admin.adminClient },
      );
      assertEquals(res.status, 200);
      const lines = await drain(res);
      // A completed, non-empty thesis reaches done:true and NEVER refunds.
      assertEquals(lines.some((l) => l.done === true), true);
      assertEquals(admin.rpc.some((c) => c.fn === 'refund_credits'), false);
    },
  );
});
