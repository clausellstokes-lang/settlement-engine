/**
 * byokFailClosed.test.ts — EXECUTION proof of the BYOK fail-closed boundary
 * (owner ruling, 2026-07-30: "on vault error the request fails with a clear retryable
 * error; the user's chosen key boundary is never silently crossed").
 *
 * The shell is driven end to end with injected clients and a fetch spy, so the three
 * facts that matter are OBSERVED rather than argued:
 *   1. vault error + a stored key  => 503 byok_vault_unavailable, ZERO provider fetches,
 *      ZERO money RPCs (no reserve, no spend, so nothing to release or refund).
 *   2. vault error + NO stored key => the managed house path is untouched: the request
 *      walks straight on into the credit flow (proved by the cap refusal it meets there,
 *      which is a DIFFERENT 503 carrying no `code`).
 *   3. the witness is consulted ONLY on the failed branch — a healthy vault read costs
 *      no extra round-trip.
 *
 * The resolver's own branch matrix lives in tests/edgeFunctions/byokFailClosed.test.js;
 * this file pins what the SHELL does with the answer.
 */
import { assertEquals, assert } from 'https://deno.land/std@0.224.0/assert/mod.ts';

Deno.env.set('SUPABASE_URL', 'https://stub.supabase.co');
Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'service_dummy');
Deno.env.set('SUPABASE_ANON_KEY', 'anon_dummy');
Deno.env.set('ANTHROPIC_API_KEY', 'sk-house-key-never-to-be-used');

const { handleAiAnalyst } = await import('./index.ts');

type RpcCall = { fn: string; args: Record<string, unknown> };

/** Canned RPC answers keyed by function name; anything unnamed answers {data:null}. */
function makeClient(
  answers: Record<string, () => { data: unknown; error: unknown }>,
  seen: RpcCall[],
) {
  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: { id: 'user-1' } }, error: null }),
    },
    rpc: (fn: string, args: Record<string, unknown>) => {
      seen.push({ fn, args });
      const a = answers[fn];
      return Promise.resolve(a ? a() : { data: null, error: null });
    },
    from: () => ({
      select: () => ({ eq: () => ({ maybeSingle: () => Promise.resolve({ data: null, error: null }) }) }),
      insert: () => Promise.resolve({ error: null }),
      upsert: () => Promise.resolve({ error: null }),
    }),
  };
}

const askRequest = () =>
  new Request('https://x.test/ai-analyst', {
    method: 'POST',
    // No session_id claim in the header => the single-session gate allows and never
    // reads a table; no cf-connecting-ip => the IP bucket is skipped.
    headers: { Authorization: 'Bearer test-token', 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: 'Who governs Ashford?', audience: 'dm', slices: [] }),
  });

const VAULT_ERROR = () => ({ data: null, error: { message: 'vault read failed' } });
const ENTITLED = () => ({ data: true, error: null });
const ACTIVE = () => ({ data: true, error: null });

/** A fetch that must never be called; every invocation is recorded. */
function fetchSpy() {
  const calls: string[] = [];
  const impl = ((input: string | URL | Request) => {
    calls.push(String(input));
    return Promise.resolve(new Response('{}', { status: 200 }));
  }) as unknown as typeof fetch;
  return { calls, impl };
}

const MONEY_RPCS = ['reserve_ai_spend', 'spend_credits', 'refund_credits', 'release_ai_spend_reservation'];

Deno.test('vault error + a stored key: typed 503, no provider call, no money RPC', async () => {
  const adminSeen: RpcCall[] = [];
  const userSeen: RpcCall[] = [];
  const spy = fetchSpy();
  const res = await handleAiAnalyst(askRequest(), {
    adminClient: () => makeClient({ account_is_active: ACTIVE, surveyor_byok_get: VAULT_ERROR }, adminSeen) as never,
    // The witness answers with the user's own key row: they HAVE a key of their own.
    userClient: () => makeClient({
      has_surveyor_entitlement: ENTITLED,
      surveyor_byok_status: () => ({ data: [{ provider: 'anthropic', has_key: true, health: 'healthy' }], error: null }),
    }, userSeen) as never,
    anthropicFetch: spy.impl,
  });

  assertEquals(res.status, 503);
  const body = await res.json();
  assertEquals(body.code, 'byok_vault_unavailable');
  assertEquals(body.retryable, true);
  assert(typeof body.error === 'string' && body.error.length > 0, 'the refusal carries plain-language copy');

  // THE BOUNDARY: no request ever left for the provider under the house key.
  assertEquals(spy.calls.length, 0);
  // THE MONEY: nothing was reserved or spent, so there is nothing to release or refund.
  const money = adminSeen.concat(userSeen).filter((c) => MONEY_RPCS.includes(c.fn));
  assertEquals(money.map((c) => c.fn), []);
  // The witness WAS consulted (that is how the ambiguity was settled).
  assertEquals(userSeen.filter((c) => c.fn === 'surveyor_byok_status').length, 1);
});

Deno.test('vault error + NO stored key: the managed house path is untouched', async () => {
  const adminSeen: RpcCall[] = [];
  const userSeen: RpcCall[] = [];
  const spy = fetchSpy();
  const res = await handleAiAnalyst(askRequest(), {
    adminClient: () => makeClient({
      account_is_active: ACTIVE,
      surveyor_byok_get: VAULT_ERROR,
      // Stop the walk at the FIRST money gate: reaching it at all is the proof that the
      // fail-closed branch did not fire for a user with no key of their own.
      reserve_ai_spend: () => ({ data: { allowed: false, reservation_id: null }, error: null }),
    }, adminSeen) as never,
    userClient: () => makeClient({
      has_surveyor_entitlement: ENTITLED,
      surveyor_byok_status: () => ({ data: [], error: null }), // no key row
    }, userSeen) as never,
    anthropicFetch: spy.impl,
  });

  assertEquals(res.status, 503);
  const body = await res.json();
  // A cap refusal, NOT the vault refusal: same status, different typed identity.
  assertEquals(body.code, undefined);
  assertEquals(adminSeen.filter((c) => c.fn === 'reserve_ai_spend').length, 1);
  assertEquals(spy.calls.length, 0); // the cap stopped it before the provider, as designed
});

Deno.test('a healthy vault read never consults the witness (no extra round-trip)', async () => {
  const adminSeen: RpcCall[] = [];
  const userSeen: RpcCall[] = [];
  const spy = fetchSpy();
  await handleAiAnalyst(askRequest(), {
    adminClient: () => makeClient({
      account_is_active: ACTIVE,
      surveyor_byok_get: () => ({ data: { key: 'sk-user-own-key' }, error: null }),
      reserve_ai_spend: () => ({ data: { allowed: false, reservation_id: null }, error: null }),
    }, adminSeen) as never,
    userClient: () => makeClient({ has_surveyor_entitlement: ENTITLED }, userSeen) as never,
    anthropicFetch: spy.impl,
  });
  assertEquals(userSeen.filter((c) => c.fn === 'surveyor_byok_status').length, 0);
});
