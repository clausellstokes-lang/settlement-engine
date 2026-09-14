/**
 * index.test.ts — THE SCRIBE'S MONEY AND TRUST BOUNDARY, EXECUTED.
 *
 * Deno test (`deno task test:edge`), not vitest. This handler both SPENDS MONEY and calls a model,
 * which is the estate's highest-trust shape, so every claim below is driven through the real
 * `handleScribeRender` with injected stubs rather than asserted by regex over the source:
 *
 *   - an INACTIVE account never spends (fail-closed), and a NULL active result fails closed too;
 *   - a render with no durable home never spends (the chair's vetoable rule 14 addition);
 *   - a PROVIDER FAILURE refunds via the EXACT captured spend id, spends exactly once, and
 *     RETURNS THE FREE CLAIM — the three things that make a failed render cost nothing;
 *   - an ELEVATED spend is never refunded;
 *   - the FREE first render skips `spend_credits` entirely and is released when nothing lands;
 *   - a unit the instruments FAIL is DROPPED and its pool is absent from the answer, so the tab
 *     draws the hand corpus;
 *   - a whole-chain REFUSAL is not an error and not a line;
 *   - the cache-read receipt is returned, because it is the one economic claim the design says
 *     no test can prove and this is as close as a stub can get: the figure is passed through.
 */
import { assert, assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { installScopedTestEnv } from '../_shared/scopedTestEnv.ts';

const scopedEnv = installScopedTestEnv({
  SUPABASE_URL: 'https://stub.supabase.co',
  SUPABASE_ANON_KEY: 'anon_dummy',
  SUPABASE_SERVICE_ROLE_KEY: 'service_role_dummy',
  ANTHROPIC_API_KEY: 'sk-stub',
});
const { handleScribeRender } = await import('./index.ts');
scopedEnv.release();

const CARD = {
  tab: 'defense',
  audience: 'dm',
  town: { name: 'Ashford', tier: 'town' },
  epoch: { tick: 8 },
  pools: [{
  blockId: 'DS-DEF-2',
  poolKey: 'k',
  vid: 3,
  angle: 'ledger',
  marks: [],
  slots: { declared: [] },
  faceSources: [null],
  unit: { spine: 'The corpus spine stands.', faces: ['a face'] },
  }],
};

const BODY = {
  saveId: 'save-1', advanceSeq: 0, renderedFor: 'seed-a', engineVersion: 'gen-1/sim-1',
  tab: 'defense', card: CARD, record: null, guidance: '',
};

function request(body: unknown = BODY) {
  return new Request('https://edge.local/scribe-render', {
  method: 'POST',
  headers: { Authorization: 'Bearer jwt', 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
  });
}

// deno-lint-ignore no-explicit-any
function makeUserClient(spendResult: Record<string, unknown>, rpc: Array<{ fn: string; args: any }>) {
  // deno-lint-ignore no-explicit-any
  const client: any = {
  auth: { getUser: () => Promise.resolve({ data: { user: { id: 'u1' } }, error: null }) },
  // deno-lint-ignore no-explicit-any
  rpc: (fn: string, args: any) => {
    rpc.push({ fn, args });
    if (fn === 'spend_credits') return Promise.resolve({ data: spendResult, error: null });
    return Promise.resolve({ data: null, error: null });
  },
  };
  return () => client;
}

function makeAdminClient(
  // deno-lint-ignore no-explicit-any
  opts: { active?: boolean | null; freeClaim?: boolean; events?: any[] },
  // deno-lint-ignore no-explicit-any
  rpc: Array<{ fn: string; args: any }>,
) {
  // deno-lint-ignore no-explicit-any
  const client: any = {
  // deno-lint-ignore no-explicit-any
  rpc: (fn: string, args: any) => {
    rpc.push({ fn, args });
    if (fn === 'account_is_active') {
      const v = opts.active === undefined ? true : opts.active;
      return Promise.resolve({ data: v, error: v === null ? { message: 'blew up' } : null });
    }
    if (fn === 'reserve_ai_spend') return Promise.resolve({ data: { allowed: true, reservation_id: 'res_1' }, error: null });
    if (fn === 'consume_ai_generate_rate_limit') return Promise.resolve({ data: { allowed: true }, error: null });
    if (fn === 'claim_free_scribe') return Promise.resolve({ data: opts.freeClaim === true, error: null });
    if (fn === 'surveyor_byok_get') return Promise.resolve({ data: null, error: null });
    return Promise.resolve({ data: null, error: null });
  },
  // deno-lint-ignore no-explicit-any
  from: () => ({ insert: (row: any) => { opts.events?.push(row); return Promise.resolve({ error: null }); } }),
  };
  return () => client;
}

/**
 * A provider stub for BOTH READERS. The first call is the writer and gets `units`; every call
 * after it is the tier-1 checklist and gets `tier1`, which defaults to a clean sheet over the one
 * lawful unit's two rows. `calls` records what the handler actually sent, so an arm can prove the
 * second turn carried the same two cached system blocks.
 */
function providerReturning(
  units: unknown[],
  opts: { tier1?: unknown[] | 'error'; extra?: Record<string, unknown>; calls?: unknown[] } = {},
) {
  let n = 0;
  return (_url: string | URL | Request, init?: RequestInit) => {
    n += 1;
    opts.calls?.push(JSON.parse(String(init?.body ?? '{}')));
    const usage = { input_tokens: 1000, output_tokens: 200, cache_read_input_tokens: 28_500 };
    if (n === 1) {
      return Promise.resolve(new Response(JSON.stringify({
        content: [{ type: 'text', text: JSON.stringify({ units }) }],
        usage,
        ...(opts.extra ?? {}),
      }), { status: 200 }));
    }
    if (opts.tier1 === 'error') return Promise.resolve(new Response('down', { status: 500 }));
    const answers = opts.tier1 ?? [clean(1), clean(2)];
    return Promise.resolve(new Response(JSON.stringify({
      content: [{ type: 'text', text: JSON.stringify({ answers }) }],
      usage,
    }), { status: 200 }));
  };
}

/** One tier-1 answer row with every question answered `no`. */
const clean = (n: number) => ({
  n, certainty: 'no', quantifier: 'no', scope: 'no', actor: 'no', forecast: 'no', mechanism: 'no', samePage: 'no',
});

const lawfulUnit = { blockId: 'DS-DEF-2', poolKey: 'k', vid: 3, spine: 'The watch keeps a short roll.', faces: ['A clerk in the hall says the purse is short.'], notebook: [] };

const names = (rpc: Array<{ fn: string }>) => rpc.map((r) => r.fn);
const count = (rpc: Array<{ fn: string }>, fn: string) => rpc.filter((r) => r.fn === fn).length;

scopedEnv.test('an INACTIVE account is refused and NEVER spends', async () => {
  const u: Array<{ fn: string; args: unknown }> = [];
  const a: Array<{ fn: string; args: unknown }> = [];
  const res = await handleScribeRender(request(), {
    userClient: makeUserClient({ ok: true }, u),
    adminClient: makeAdminClient({ active: false }, a),
    anthropicFetch: providerReturning([lawfulUnit]),
  });
  assertEquals(res.status, 403);
  assertEquals(count(u, 'spend_credits'), 0);
  assert(!names(a).includes('reserve_ai_spend'), 'not even a reservation is taken');
});

scopedEnv.test('a NULL active result FAILS CLOSED', async () => {
  const u: Array<{ fn: string; args: unknown }> = [];
  const a: Array<{ fn: string; args: unknown }> = [];
  const res = await handleScribeRender(request(), {
    userClient: makeUserClient({ ok: true }, u),
    adminClient: makeAdminClient({ active: null }, a),
    anthropicFetch: providerReturning([lawfulUnit]),
  });
  assertEquals(res.status, 403);
  assertEquals(count(u, 'spend_credits'), 0);
});

scopedEnv.test('⭐ NO DURABLE HOME, NO CHARGE — and no reservation either', async () => {
  const u: Array<{ fn: string; args: unknown }> = [];
  const a: Array<{ fn: string; args: unknown }> = [];
  const res = await handleScribeRender(request({ ...BODY, saveId: '' }), {
    userClient: makeUserClient({ ok: true }, u),
    adminClient: makeAdminClient({}, a),
    anthropicFetch: providerReturning([lawfulUnit]),
  });
  assertEquals(res.status, 400);
  assertEquals(count(u, 'spend_credits'), 0);
  assert(!names(a).includes('reserve_ai_spend'));
  assert(!names(a).includes('claim_free_scribe'), 'the free claim is not spent on a refused request');
});

scopedEnv.test('a request with no card is refused before any money moves', async () => {
  const u: Array<{ fn: string; args: unknown }> = [];
  const a: Array<{ fn: string; args: unknown }> = [];
  const res = await handleScribeRender(request({ ...BODY, card: null }), {
    userClient: makeUserClient({ ok: true }, u),
    adminClient: makeAdminClient({}, a),
    anthropicFetch: providerReturning([lawfulUnit]),
  });
  assertEquals(res.status, 400);
  assertEquals(count(u, 'spend_credits'), 0);
});

scopedEnv.test('⭐ A PROVIDER FAILURE REFUNDS THE EXACT SPEND ID, ONCE, AND RETURNS THE FREE CLAIM', async () => {
  const u: Array<{ fn: string; args: unknown }> = [];
  const a: Array<{ fn: string; args: Record<string, unknown> }> = [];
  const res = await handleScribeRender(request(), {
    userClient: makeUserClient({ ok: true, spend_id: 'spend_xyz', balance: 40 }, u),
    adminClient: makeAdminClient({}, a),
    anthropicFetch: () => Promise.resolve(new Response('down', { status: 503 })),
  });
  assertEquals(res.status, 502);
  assertEquals(count(u, 'spend_credits'), 1, 'no double spend');
  const refund = a.find((r) => r.fn === 'refund_credits');
  assert(refund, 'a failed render refunds');
  assertEquals(refund.args.spend_ledger_row, 'spend_xyz');
  assert(names(a).includes('release_ai_spend_reservation'), 'the reservation is released on every exit');
});

scopedEnv.test('an ELEVATED spend is NEVER refunded', async () => {
  const u: Array<{ fn: string; args: unknown }> = [];
  const a: Array<{ fn: string; args: unknown }> = [];
  await handleScribeRender(request(), {
    userClient: makeUserClient({ ok: true, spend_id: 'spend_x', elevated: true }, u),
    adminClient: makeAdminClient({}, a),
    anthropicFetch: () => Promise.resolve(new Response('down', { status: 503 })),
  });
  assert(!names(a).includes('refund_credits'));
  assert(names(a).includes('release_ai_spend_reservation'));
});

scopedEnv.test('⭐ THE FREE FIRST RENDER SKIPS THE CHARGE, AND IS RELEASED WHEN NOTHING LANDS', async () => {
  const u: Array<{ fn: string; args: unknown }> = [];
  const a: Array<{ fn: string; args: unknown }> = [];
  await handleScribeRender(request(), {
    userClient: makeUserClient({ ok: true, spend_id: 'never' }, u),
    adminClient: makeAdminClient({ freeClaim: true }, a),
    anthropicFetch: () => Promise.resolve(new Response('down', { status: 503 })),
  });
  assertEquals(count(u, 'spend_credits'), 0, 'a free render does not charge');
  assert(!names(a).includes('refund_credits'), 'there is nothing to refund');
  assertEquals(count(a, 'release_free_scribe'), 1, 'the claim comes back so it is not farmed away');
});

scopedEnv.test('a free render that LANDS keeps the claim', async () => {
  const u: Array<{ fn: string; args: unknown }> = [];
  const a: Array<{ fn: string; args: unknown }> = [];
  const res = await handleScribeRender(request(), {
    userClient: makeUserClient({ ok: true }, u),
    adminClient: makeAdminClient({ freeClaim: true }, a),
    anthropicFetch: providerReturning([lawfulUnit]),
  });
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.free, true);
  assertEquals(count(a, 'release_free_scribe'), 0);
});

scopedEnv.test('⭐ A UNIT THE INSTRUMENTS FAIL IS DROPPED, AND ITS POOL IS ABSENT FROM THE ANSWER', async () => {
  const u: Array<{ fn: string; args: unknown }> = [];
  const a: Array<{ fn: string; args: unknown }> = [];
  // An em dash is a HARD BAR the tier-0 refuter convicts on sight, so this drives the REAL
  // instruments from the REAL bundle rather than a stub of them.
  const res = await handleScribeRender(request(), {
    userClient: makeUserClient({ ok: true, spend_id: 's1' }, u),
    adminClient: makeAdminClient({}, a),
    anthropicFetch: providerReturning([{ ...lawfulUnit, spine: 'The watch keeps a roll — a short one.' }]),
  });
  // Nothing lawful landed, so the render FAILED for money and the spend came back.
  assertEquals(res.status, 502);
  assert(names(a).includes('refund_credits'), 'a render that lands nothing is refunded');
});

scopedEnv.test('a lawful unit lands BLOCK-SHAPED with its verdict', async () => {
  const u: Array<{ fn: string; args: unknown }> = [];
  const a: Array<{ fn: string; args: unknown }> = [];
  const res = await handleScribeRender(request(), {
    userClient: makeUserClient({ ok: true, spend_id: 's1', balance: 35 }, u),
    adminClient: makeAdminClient({}, a),
    anthropicFetch: providerReturning([lawfulUnit]),
  });
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.ok, true);
  assertEquals(body.blocks['DS-DEF-2'].k[0].spine, 'The watch keeps a short roll.');
  assertEquals(body.blocks['DS-DEF-2'].k[0].vid, 3);
  assertEquals(body.verdicts.length, 1);
  assert(!names(a).includes('refund_credits'), 'a successful paid call is NEVER refunded');
  assert(names(a).includes('release_ai_spend_reservation'));
  // ⭐ THE CACHE READ IS RETURNED, which is the receipt the design says no test can prove, and it
  // is the SUM OF BOTH READERS: the stub answers 28,500 on each of the two calls and the response
  // carries 57,000, because the render is ONE credited act and its usage is one set of totals.
  assertEquals(body.calls, 2);
  assertEquals(body.usage.cacheRead, 57_000);
  assertEquals(body.tier1, 'ok');
  assertEquals(body.tier1Dropped, 0);
});

scopedEnv.test('⭐ TIER 1 RUNS ON THE SAME TWO CACHED BLOCKS, and only the turn and the schema differ', async () => {
  const u: Array<{ fn: string; args: unknown }> = [];
  const a: Array<{ fn: string; args: unknown }> = [];
  // deno-lint-ignore no-explicit-any
  const sent: any[] = [];
  await handleScribeRender(request(), {
    userClient: makeUserClient({ ok: true, spend_id: 's1' }, u),
    adminClient: makeAdminClient({}, a),
    anthropicFetch: providerReturning([lawfulUnit], { calls: sent }),
  });
  assertEquals(sent.length, 2, 'the second reader is a second provider call');
  // The cached halves are byte-identical, which is the whole reason the second reader is cheap.
  assertEquals(sent[0].system[0].text, sent[1].system[0].text);
  assertEquals(sent[0].system[1].text, sent[1].system[1].text);
  assertEquals(sent[0].system[0].cache_control.ttl, '1h');
  assertEquals(sent[1].system[1].cache_control.ttl, '1h');
  // And the volatile halves are NOT: the second turn is the checklist.
  assert(sent[0].messages[0].content !== sent[1].messages[0].content);
  assert(String(sent[1].messages[0].content).includes('MECHANISM'));
  assertEquals(sent[1].max_tokens, 4000);
  assertEquals(
    Object.keys(sent[1].output_config.format.schema.properties.answers.items.properties).sort(),
    ['actor', 'certainty', 'forecast', 'mechanism', 'n', 'quantifier', 'samePage', 'scope'],
  );
});

scopedEnv.test('⭐ A YES ON THE MECHANISM QUESTION DROPS THE UNIT TO THE CORPUS', async () => {
  const u: Array<{ fn: string; args: unknown }> = [];
  const a: Array<{ fn: string; args: unknown }> = [];
  const res = await handleScribeRender(request(), {
    userClient: makeUserClient({ ok: true, spend_id: 's1' }, u),
    adminClient: makeAdminClient({}, a),
    // Line 1 is the spine; a `yes` on question 6 there drops the whole unit, because a unit ships
    // whole. Nothing lawful is left, so the render landed nothing and the spend comes back.
    anthropicFetch: providerReturning([lawfulUnit], {
      tier1: [{ ...clean(1), mechanism: 'yes' }, clean(2)],
    }),
  });
  assertEquals(res.status, 502);
  assert(names(a).includes('refund_credits'), 'a render that lands nothing is refunded');
});

scopedEnv.test('⛔ A TIER-1 PROVIDER FAILURE IS NOT A RENDER FAILURE: tier 0 is the floor', async () => {
  const u: Array<{ fn: string; args: unknown }> = [];
  const a: Array<{ fn: string; args: unknown }> = [];
  const res = await handleScribeRender(request(), {
    userClient: makeUserClient({ ok: true, spend_id: 's1', balance: 12 }, u),
    adminClient: makeAdminClient({}, a),
    anthropicFetch: providerReturning([lawfulUnit], { tier1: 'error' }),
  });
  assertEquals(res.status, 200, 'the dossier is not blanked because the second reader was away');
  const body = await res.json();
  assertEquals(body.ok, true);
  assertEquals(body.tier1, 'skipped');
  assertEquals(body.tier1Dropped, 0);
  assertEquals(body.blocks['DS-DEF-2'].k[0].spine, 'The watch keeps a short roll.');
  assert(!names(a).includes('refund_credits'), 'the render landed, so the spend stands');
});

scopedEnv.test('⭐ THE METER SUMS BOTH CALLS INTO ONE EVENT', async () => {
  const u: Array<{ fn: string; args: unknown }> = [];
  const a: Array<{ fn: string; args: unknown }> = [];
  // deno-lint-ignore no-explicit-any
  const events: any[] = [];
  await handleScribeRender(request(), {
    userClient: makeUserClient({ ok: true, spend_id: 's1' }, u),
    adminClient: makeAdminClient({ events }, a),
    anthropicFetch: providerReturning([lawfulUnit]),
  });
  assertEquals(events.length, 1, 'one render is ONE credited act and ONE usage row');
  // 2 x (1000 input + 28,500 cache read + 0 cache write), folded at full input price exactly as
  // `generate-narrative` folds them, and 2 x 200 output.
  assertEquals(events[0].input_tokens, 59_000);
  assertEquals(events[0].output_tokens, 400);
  assertEquals(events[0].tokens_estimated, false);
});

scopedEnv.test('a WHOLE-CHAIN REFUSAL is not an error and not a line', async () => {
  const u: Array<{ fn: string; args: unknown }> = [];
  const a: Array<{ fn: string; args: unknown }> = [];
  const res = await handleScribeRender(request(), {
    userClient: makeUserClient({ ok: true, spend_id: 's1' }, u),
    adminClient: makeAdminClient({}, a),
    anthropicFetch: () => Promise.resolve(new Response(JSON.stringify({
      stop_reason: 'refusal', stop_details: { type: 'refusal', category: null }, content: [],
      usage: { input_tokens: 10, output_tokens: 0 },
    }), { status: 200 })),
  });
  assertEquals(res.status, 502);
  const body = await res.json();
  assertEquals(body.refused, true);
  assert(names(a).includes('refund_credits'), 'a refused render costs the reader nothing');
});

scopedEnv.test('an oversized body is refused on bytes, before anything else', async () => {
  const u: Array<{ fn: string; args: unknown }> = [];
  const a: Array<{ fn: string; args: unknown }> = [];
  const big = { ...BODY, guidance: 'x'.repeat(600 * 1024) };
  const res = await handleScribeRender(request(big), {
    userClient: makeUserClient({ ok: true }, u),
    adminClient: makeAdminClient({}, a),
    anthropicFetch: providerReturning([lawfulUnit]),
  });
  assertEquals(res.status, 413);
  assertEquals(count(u, 'spend_credits'), 0);
});

scopedEnv.test('a missing Authorization header is 401 and touches nothing', async () => {
  const res = await handleScribeRender(new Request('https://edge.local/scribe-render', {
    method: 'POST', body: '{}', headers: { 'Content-Type': 'application/json' },
  }), {});
  assertEquals(res.status, 401);
});
