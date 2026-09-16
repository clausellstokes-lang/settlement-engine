/**
 * rateLimit.test.ts — pins the Wave-D AI per-IP burst gate (checkAiIpRate +
 * aiIpRateGuard) in _shared/rateLimit.ts (item 2).
 *
 * Deno test (runs under the `deno-tests` CI job / `deno task test:edge`). A stub
 * `admin.rpc` stands in for the migration-156 consume_token_bucket RPC so no DB is
 * touched. The load-bearing properties:
 *   - SKIP on a missing / sentinel IP (no RPC call at all) — the reason the gate is
 *     inert in tests / local, where there is no cf-connecting-ip.
 *   - a definite over-limit → 'over' (→ 429).
 *   - a limiter-INFRASTRUCTURE error (rpc error OR a thrown transport error OR an
 *     unexpected shape) → 'error' (→ 503 DENY). NEVER a silent open.
 *   - aiIpRateGuard maps those to a ready 429 / 503 Response and null-to-proceed.
 */
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { checkAiIpRate, aiIpRateGuard } from './rateLimit.ts';

/** Build a stub admin whose consume_token_bucket returns a fixed verdict, and
 *  record whether rpc() was called (to prove the sentinel-IP path skips it). */
function makeAdmin(result: { data: unknown; error: unknown } | 'throw') {
  const calls: Array<{ fn: string; args: unknown }> = [];
  const admin = {
    // deno-lint-ignore no-explicit-any
    rpc: (fn: string, args: unknown): any => {
      calls.push({ fn, args });
      if (result === 'throw') return Promise.reject(new Error('rpc transport down'));
      return Promise.resolve(result);
    },
  };
  return { admin, calls };
}

/** Add the system_config query seam used in production and record its key. */
function withConfig(
  base: ReturnType<typeof makeAdmin>,
  result: { data: { value?: unknown } | null; error: unknown } | 'throw',
) {
  const configCalls: Array<{ table: string; column: string; value: string }> = [];
  const admin = {
    ...base.admin,
    from: (table: string) => ({
      select: (_columns: string) => ({
        eq: (column: string, value: string) => ({
          maybeSingle: () => {
            configCalls.push({ table, column, value });
            if (result === 'throw') return Promise.reject(new Error('config transport down'));
            return Promise.resolve(result);
          },
        }),
      }),
    }),
  };
  return { ...base, admin, configCalls };
}

const CORS = { 'Access-Control-Allow-Origin': 'https://x.test' };

Deno.test('SKIP: a missing IP short-circuits (ok, skipped) and never calls the RPC', async () => {
  const { admin, calls } = makeAdmin({ data: { allowed: false }, error: null });
  const r = await checkAiIpRate(admin, null);
  assertEquals(r, { ok: true, reason: 'skipped' });
  assertEquals(calls.length, 0);
});

Deno.test('SKIP: the 0.0.0.0 sentinel short-circuits (ok, skipped) and never calls the RPC', async () => {
  const { admin, calls } = makeAdmin({ data: { allowed: false }, error: null });
  const r = await checkAiIpRate(admin, '0.0.0.0');
  assertEquals(r, { ok: true, reason: 'skipped' });
  assertEquals(calls.length, 0);   // the property the AI-fn tests rely on to stay inert
});

Deno.test('UNDER: a real IP with allowed=true proceeds (ok, under) and keys on aiip:<ip>', async () => {
  const { admin, calls } = makeAdmin({ data: { allowed: true }, error: null });
  const r = await checkAiIpRate(admin, '203.0.113.7');
  assertEquals(r, { ok: true, reason: 'under' });
  assertEquals(calls.length, 1);
  assertEquals((calls[0].args as { p_key: string }).p_key, 'aiip:203.0.113.7');
});

Deno.test('LIVE CONFIG: operator capacity/refill values reach consume_token_bucket', async () => {
  const wired = withConfig(
    makeAdmin({ data: { allowed: true }, error: null }),
    { data: { value: { capacity: 7, refill_per_sec: 0.25 } }, error: null },
  );
  const r = await checkAiIpRate(wired.admin, '203.0.113.7');
  assertEquals(r, { ok: true, reason: 'under' });
  assertEquals(wired.configCalls, [{
    table: 'system_config',
    column: 'key',
    value: 'ai_ip_rate_limit',
  }]);
  assertEquals(wired.calls[0].args, {
    p_key: 'aiip:203.0.113.7',
    p_capacity: 7,
    p_refill_per_sec: 0.25,
    p_cost: 1,
  });
});

Deno.test('CONFIG FALLBACK: missing, malformed, or failed reads keep conservative defaults', async () => {
  for (const configResult of [
    { data: null, error: null },
    { data: { value: { capacity: 0, refill_per_sec: 'fast' } }, error: null },
    { data: null, error: { message: 'read failed' } },
    'throw' as const,
  ]) {
    const wired = withConfig(
      makeAdmin({ data: { allowed: true }, error: null }),
      configResult,
    );
    assertEquals((await checkAiIpRate(wired.admin, '203.0.113.7')).ok, true);
    assertEquals(wired.calls[0].args, {
      p_key: 'aiip:203.0.113.7',
      p_capacity: 40,
      p_refill_per_sec: 40 / 3600,
      p_cost: 1,
    });
  }
});

Deno.test('OVER: allowed=false is a definite over-limit (not ok, over → 429)', async () => {
  const { admin } = makeAdmin({ data: { allowed: false }, error: null });
  const r = await checkAiIpRate(admin, '203.0.113.7');
  assertEquals(r, { ok: false, reason: 'over' });
});

Deno.test('FAIL-CLOSED: an RPC error is a limiter-infra error (not ok, error → 503)', async () => {
  const { admin } = makeAdmin({ data: null, error: { message: 'boom' } });
  const r = await checkAiIpRate(admin, '203.0.113.7');
  assertEquals(r, { ok: false, reason: 'error' });   // never silently open
});

Deno.test('FAIL-CLOSED: a thrown transport error → (not ok, error → 503)', async () => {
  const { admin } = makeAdmin('throw');
  const r = await checkAiIpRate(admin, '203.0.113.7');
  assertEquals(r, { ok: false, reason: 'error' });
});

Deno.test('FAIL-CLOSED: an unexpected RPC shape (no allowed field) → (not ok, error)', async () => {
  const { admin } = makeAdmin({ data: { nope: true }, error: null });
  const r = await checkAiIpRate(admin, '203.0.113.7');
  assertEquals(r, { ok: false, reason: 'error' });
});

Deno.test('aiIpRateGuard: proceeds (null) when under rate or skipped', async () => {
  const under = makeAdmin({ data: { allowed: true }, error: null });
  assertEquals(await aiIpRateGuard(under.admin, '203.0.113.7', CORS), null);
  const skipped = makeAdmin({ data: { allowed: false }, error: null });
  assertEquals(await aiIpRateGuard(skipped.admin, '0.0.0.0', CORS), null); // sentinel → proceed
});

Deno.test('aiIpRateGuard: over-limit → a 429 Response; infra error → a 503 Response', async () => {
  const over = makeAdmin({ data: { allowed: false }, error: null });
  const res429 = await aiIpRateGuard(over.admin, '203.0.113.7', CORS);
  assertEquals(res429?.status, 429);
  assertEquals(res429?.headers.get('Access-Control-Allow-Origin'), 'https://x.test');

  const err = makeAdmin({ data: null, error: { message: 'boom' } });
  const res503 = await aiIpRateGuard(err.admin, '203.0.113.7', CORS);
  assertEquals(res503?.status, 503);   // limiter-infra error DENIES with 503, never opens
});
