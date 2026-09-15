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
 *
 * ⭐⭐ W5b ADDS THE ARM THE WHOLE WAVE EXISTS FOR: ONE RENDER, ONE CHARGE. A render is many tab
 * invocations, and the fake below is a MODEL OF MIGRATION 203'S SERIALISER — one live session per
 * (user, save, advance_seq, rendered_for), minted by whichever caller wins and joined by the rest.
 * The arms drive three and seven tabs of one render through the REAL handler and count what
 * actually reached `spend_credits` and `claim_free_scribe`. The SQL those arms model is pinned
 * separately, as SQL, in tests/edgeFunctions/contracts.test.js.
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

/**
 * ⭐⭐ A MODEL OF MIGRATION 203'S SERIALISER, and the only stateful stub in this file. The SQL
 * holds ONE live session per (user, save, advance_seq, rendered_for) with a partial unique index
 * and mints it with `insert ... on conflict do nothing`; this Map is that index. `first` is true
 * for the caller that minted and false for every caller that joined, `expire()` is the TTL running
 * out, and `abort` refuses once any tab has landed — each of which is one line of the SQL.
 */
function renderSessions() {
  const live = new Map<string, { id: string; free: boolean | null; landed: number }>();
  const all = new Map<string, { id: string; free: boolean | null; landed: number }>();
  let minted = 0;
  const keyOf = (a: Record<string, unknown>) => [a.p_user, a.p_save, a.p_seq, a.p_rendered_for].join('::');
  return {
    open(args: Record<string, unknown>) {
      const key = keyOf(args);
      const held = live.get(key);
      if (held) return { session_id: held.id, first: false, free: held.free, tabs_landed: held.landed };
      minted += 1;
      const row = { id: `sess_${minted}`, free: null as boolean | null, landed: 0 };
      live.set(key, row);
      all.set(row.id, row);
      return { session_id: row.id, first: true, free: null, tabs_landed: 0 };
    },
    close(args: Record<string, unknown>) {
      const row = all.get(String(args.p_session));
      if (!row) return null;
      row.landed += 1;
      if (row.free === null && typeof args.p_free === 'boolean') row.free = args.p_free;
      return null;
    },
    abort(args: Record<string, unknown>) {
      const row = all.get(String(args.p_session));
      if (!row || row.landed > 0) return false;
      for (const [k, v] of live) if (v.id === row.id) live.delete(k);
      return true;
    },
    /** The TTL running out: the row survives, its hold on the live key does not. */
    expire() { live.clear(); },
    minted: () => minted,
  };
}

function makeAdminClient(
  opts: {
    active?: boolean | null; freeClaim?: boolean;
    // deno-lint-ignore no-explicit-any
    events?: any[]; sessions?: ReturnType<typeof renderSessions>; openError?: boolean;
  },
  // deno-lint-ignore no-explicit-any
  rpc: Array<{ fn: string; args: any }>,
) {
  const sessions = opts.sessions ?? renderSessions();
  // deno-lint-ignore no-explicit-any
  const client: any = {
  // deno-lint-ignore no-explicit-any
  rpc: (fn: string, args: any) => {
    rpc.push({ fn, args });
    if (fn === 'account_is_active') {
      const v = opts.active === undefined ? true : opts.active;
      return Promise.resolve({ data: v, error: v === null ? { message: 'blew up' } : null });
    }
    if (fn === 'open_scribe_render') {
      if (opts.openError) return Promise.resolve({ data: null, error: { message: 'session table unreachable' } });
      return Promise.resolve({ data: sessions.open(args), error: null });
    }
    if (fn === 'close_scribe_render_tab') return Promise.resolve({ data: sessions.close(args), error: null });
    if (fn === 'abort_scribe_render') return Promise.resolve({ data: sessions.abort(args), error: null });
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

/** One tier-1 answer row with every CONTRADICTION TEST answered `no` (ruling 36's six). */
const clean = (n: number) => ({
  n, fieldDenied: 'no', page: 'no', roster: 'no', model: 'no', record: 'no', forecast: 'no',
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

scopedEnv.test('⭐⭐ A FACE FALLS ALONE: the unit LANDS with the corpus at the refused seat', async () => {
  const u: Array<{ fn: string; args: unknown }> = [];
  const a: Array<{ fn: string; args: unknown }> = [];
  // An em dash is a HARD BAR the tier-0 refuter convicts on sight, so this drives the REAL
  // instruments from the REAL bundle. It is in the FACE and not the spine, so under W3b car 3 the
  // face falls to the corpus and the unit still ships — where W3a lost the whole unit, and with
  // it every lawful line beside the one bad row (RUN 2 finding 3).
  const res = await handleScribeRender(request(), {
    userClient: makeUserClient({ ok: true, spend_id: 's1', balance: 7 }, u),
    adminClient: makeAdminClient({}, a),
    anthropicFetch: providerReturning([{ ...lawfulUnit, faces: ['A clerk says the purse is short — and getting shorter.'] }]),
  });
  assertEquals(res.status, 200, 'the render landed');
  const body = await res.json();
  assertEquals(body.ok, true);
  assertEquals(body.patched, 1);
  assertEquals(body.dropped, 0);
  // ⭐ `landBlock` CARRIES A PATCHED UNIT LIKE ANY OTHER: the shape is unchanged, so the artefact
  // and the composer need no new case. The words at the refused seat are the CORPUS's.
  assertEquals(body.blocks['DS-DEF-2'].k[0].spine, 'The watch keeps a short roll.');
  assertEquals(body.blocks['DS-DEF-2'].k[0].faces, ['a face']);
  const patchedRow = body.verdicts.find((v: { verdict: string }) => v.verdict === 'PATCHED');
  assert(patchedRow, 'the artefact carries a PATCHED verdict row');
  assertEquals(patchedRow.patched, ['face 0'], 'and it names the seat');
  // ⭐ EVERY FINDING NAMES ITS OWN ROW, which is RUN 2 finding 4's cure: the spine's own WITHHELD
  // rides beside the face's FAIL and a reader can tell which row earned which arm.
  const seats = patchedRow.findings.map((f: { seat: string }) => f.seat);
  assert(seats.includes('face 0'), `the refused face is named among ${JSON.stringify(seats)}`);
  const failed = patchedRow.findings.filter((f: { channel: string }) => f.channel === 'FAIL');
  assertEquals([...new Set(failed.map((f: { seat: string }) => f.seat))], ['face 0'],
    'and only the face FAILED: the spine and the notebook stand');
  assert(!names(a).includes('refund_credits'), 'a render that landed is not refunded');
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
  assertEquals(body.patched, 0, 'a clean unit ships whole and nothing is patched');
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
  assert(String(sent[1].messages[0].content).includes('CONTRADICTION TESTS'));
  assertEquals(sent[1].max_tokens, 4000);
  assertEquals(
    Object.keys(sent[1].output_config.format.schema.properties.answers.items.properties).sort(),
    ['fieldDenied', 'forecast', 'model', 'n', 'page', 'record', 'roster'],
  );
});

scopedEnv.test('⭐ A YES ON THE RECORD QUESTION, ON THE SPINE, DROPS THE UNIT TO THE CORPUS', async () => {
  const u: Array<{ fn: string; args: unknown }> = [];
  const a: Array<{ fn: string; args: unknown }> = [];
  const res = await handleScribeRender(request(), {
    userClient: makeUserClient({ ok: true, spend_id: 's1' }, u),
    adminClient: makeAdminClient({}, a),
    // Line 1 is the SPINE; a `yes` on the RECORD test there takes the whole unit, because the
    // spine is the fact. Nothing lawful is left, so the render landed nothing and the spend comes
    // back. (A `yes` on a FACE would patch that seat instead — see W3b car 3's arm above.)
    anthropicFetch: providerReturning([lawfulUnit], {
      tier1: [{ ...clean(1), record: 'yes' }, clean(2)],
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

// ════════════════════════════════════════════════════════════════════════════════════════════
// ⭐⭐ W5b — ONE RENDER, ONE CHARGE (migration 203)
// ════════════════════════════════════════════════════════════════════════════════════════════
// The defect: a render is one invocation PER TAB and every one of them ran its own
// `spend_credits`, so a seven-tab render charged seven times what migration 202's header and the
// redraw button both said. Every arm below drives the REAL handler over a whole render.

/** One tab of a render. Same save, same epoch, same seed: that tuple IS the render's identity. */
const tabBody = (tab: string) => ({ ...BODY, tab, card: { ...CARD, tab }, tabsExpected: 3 });

scopedEnv.test('⭐⭐ A THREE-TAB RENDER SPENDS ONCE, CLAIMS THE FREE RENDER ONCE, AND SAYS SO', async () => {
  const u: Array<{ fn: string; args: unknown }> = [];
  const a: Array<{ fn: string; args: unknown }> = [];
  const sessions = renderSessions();
  const flags: boolean[] = [];
  for (const tab of ['defense', 'power', 'daily_life']) {
    const res = await handleScribeRender(request(tabBody(tab)), {
      userClient: makeUserClient({ ok: true, spend_id: 's1', balance: 30 }, u),
      adminClient: makeAdminClient({ sessions }, a),
      anthropicFetch: providerReturning([lawfulUnit]),
    });
    assertEquals(res.status, 200, `${tab} landed`);
    const body = await res.json();
    flags.push(body.charged === true);
    assertEquals(body.first, flags.length === 1, `${tab} knows whether it minted the render`);
  }
  assertEquals(count(u, 'spend_credits'), 1, 'ONE render, ONE charge — this is the whole wave');
  assertEquals(count(a, 'claim_free_scribe'), 1, 'and the free claim is asked for exactly once');
  assertEquals(flags, [true, false, false], 'exactly one tab reports that it was charged');
  assertEquals(sessions.minted(), 1, 'three tabs of one render are one session');
  assertEquals(count(a, 'close_scribe_render_tab'), 3, 'every landed tab is counted against it');
});

scopedEnv.test('⭐ THE FREE FIRST RENDER COVERS THE WHOLE RENDER, not its first tab', async () => {
  const u: Array<{ fn: string; args: unknown }> = [];
  const a: Array<{ fn: string; args: unknown }> = [];
  const sessions = renderSessions();
  const frees: boolean[] = [];
  for (const tab of ['defense', 'power', 'war']) {
    const res = await handleScribeRender(request(tabBody(tab)), {
      userClient: makeUserClient({ ok: true, spend_id: 'never' }, u),
      // The claim is atomic in the real thing; here it answers true whenever it is ASKED, which is
      // the harder stub: if a later tab asked, this arm would see a second `free: true`.
      adminClient: makeAdminClient({ sessions, freeClaim: true }, a),
      anthropicFetch: providerReturning([lawfulUnit]),
    });
    frees.push((await res.json()).free === true);
  }
  assertEquals(count(u, 'spend_credits'), 0, 'a free render charges nothing at all');
  assertEquals(count(a, 'claim_free_scribe'), 1, 'the free claim is taken once, by the render');
  assertEquals(frees, [true, true, true], 'and every tab of it reads as free');
  assertEquals(count(a, 'release_free_scribe'), 0, 'nothing failed, so nothing came back');
});

scopedEnv.test('⭐ A LATER TAB THAT FAILS REFUNDS NOTHING: the render already landed', async () => {
  const u: Array<{ fn: string; args: unknown }> = [];
  const a: Array<{ fn: string; args: unknown }> = [];
  const sessions = renderSessions();
  await handleScribeRender(request(tabBody('defense')), {
    userClient: makeUserClient({ ok: true, spend_id: 's1' }, u),
    adminClient: makeAdminClient({ sessions }, a),
    anthropicFetch: providerReturning([lawfulUnit]),
  });
  const res = await handleScribeRender(request(tabBody('power')), {
    userClient: makeUserClient({ ok: true, spend_id: 's1' }, u),
    adminClient: makeAdminClient({ sessions }, a),
    anthropicFetch: () => Promise.resolve(new Response('down', { status: 503 })),
  });
  assertEquals(res.status, 502, 'that tab drew nothing, so its pools keep the hand corpus');
  assertEquals(count(u, 'spend_credits'), 1, 'it never spent, so there is nothing to double-count');
  assertEquals(count(a, 'refund_credits'), 0, 'and nothing to refund: the render landed');
});

scopedEnv.test('⭐ A FIRST TAB THAT FAILS ABORTS THE SESSION, so the retry is a fresh render', async () => {
  const u: Array<{ fn: string; args: unknown }> = [];
  const a: Array<{ fn: string; args: unknown }> = [];
  const sessions = renderSessions();
  const failed = await handleScribeRender(request(tabBody('defense')), {
    userClient: makeUserClient({ ok: true, spend_id: 'spend_a' }, u),
    adminClient: makeAdminClient({ sessions, freeClaim: true }, a),
    anthropicFetch: () => Promise.resolve(new Response('down', { status: 503 })),
  });
  assertEquals(failed.status, 502);
  assertEquals(count(a, 'abort_scribe_render'), 1);
  assertEquals(count(a, 'release_free_scribe'), 1, 'the free claim comes back with the session');
  // The slot is free again, so the reader's next open MINTS rather than joins.
  const again = await handleScribeRender(request(tabBody('defense')), {
    userClient: makeUserClient({ ok: true, spend_id: 'spend_b' }, u),
    adminClient: makeAdminClient({ sessions }, a),
    anthropicFetch: providerReturning([lawfulUnit]),
  });
  assertEquals(again.status, 200);
  assertEquals((await again.json()).first, true, 'a render that landed nothing was never a render');
  assertEquals(sessions.minted(), 2);
});

scopedEnv.test('⭐ AN EXPIRED SESSION RE-CHARGES: the TTL is what makes a later render a render', async () => {
  const u: Array<{ fn: string; args: unknown }> = [];
  const a: Array<{ fn: string; args: unknown }> = [];
  const sessions = renderSessions();
  await handleScribeRender(request(tabBody('defense')), {
    userClient: makeUserClient({ ok: true, spend_id: 's1' }, u),
    adminClient: makeAdminClient({ sessions }, a),
    anthropicFetch: providerReturning([lawfulUnit]),
  });
  assertEquals(count(u, 'spend_credits'), 1);
  // NEGATIVE CONTROL first: inside the TTL a second tab of the same tuple joins and never spends.
  await handleScribeRender(request(tabBody('power')), {
    userClient: makeUserClient({ ok: true, spend_id: 's1' }, u),
    adminClient: makeAdminClient({ sessions }, a),
    anthropicFetch: providerReturning([lawfulUnit]),
  });
  assertEquals(count(u, 'spend_credits'), 1);
  sessions.expire();
  const later = await handleScribeRender(request(tabBody('defense')), {
    userClient: makeUserClient({ ok: true, spend_id: 's2' }, u),
    adminClient: makeAdminClient({ sessions }, a),
    anthropicFetch: providerReturning([lawfulUnit]),
  });
  assertEquals((await later.json()).charged, true);
  assertEquals(count(u, 'spend_credits'), 2, 'a render after the TTL is a new render and is paid for');
});

scopedEnv.test('⭐ TWO CONCURRENT FIRST TABS CHARGE ONCE: the database is the serialiser', async () => {
  const u: Array<{ fn: string; args: unknown }> = [];
  const a: Array<{ fn: string; args: unknown }> = [];
  const sessions = renderSessions();
  const deps = () => ({
    userClient: makeUserClient({ ok: true, spend_id: 's1', balance: 20 }, u),
    adminClient: makeAdminClient({ sessions }, a),
    anthropicFetch: providerReturning([lawfulUnit]),
  });
  const [one, two] = await Promise.all([
    handleScribeRender(request(tabBody('defense')), deps()),
    handleScribeRender(request(tabBody('power')), deps()),
  ]);
  const charged = [(await one.json()).charged, (await two.json()).charged];
  assertEquals(charged.filter(Boolean).length, 1, 'exactly one of the two paid');
  assertEquals(count(u, 'spend_credits'), 1);
  assertEquals(sessions.minted(), 1);
});

scopedEnv.test('⛔ AN UNREADABLE SESSION FAILS CLOSED, and nothing is charged or claimed', async () => {
  const u: Array<{ fn: string; args: unknown }> = [];
  const a: Array<{ fn: string; args: unknown }> = [];
  const res = await handleScribeRender(request(), {
    userClient: makeUserClient({ ok: true }, u),
    adminClient: makeAdminClient({ openError: true, freeClaim: true }, a),
    anthropicFetch: providerReturning([lawfulUnit]),
  });
  assertEquals(res.status, 503);
  assertEquals(count(u, 'spend_credits'), 0);
  assertEquals(count(a, 'claim_free_scribe'), 0, 'the free render is not spent on a gate we cannot read');
  assert(!names(a).includes('reserve_ai_spend'), 'and no reservation is taken either');
});
