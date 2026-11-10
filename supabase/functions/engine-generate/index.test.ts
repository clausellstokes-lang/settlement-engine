/**
 * index.test.ts — behavioural contract for engine-generate (ENGINE-1 unit 3).
 *
 * Runs the real handler with a stubbed service-role client and pins:
 *   - REPLAY: for the three cases in tests/fixtures/engine-generate-cases.json the
 *     function's settlement hashes to the bundle's own birth (birthConfig + pipeline, the
 *     same `_shared/engineBundle.js`, in this Deno process). The other link of the chain —
 *     the bundle's birth equals the IN-PROCESS birth for the same cases — is
 *     tests/build/engineBundleReplay.test.js, which reads the same fixture in Node.
 *   - the step list (ENGINE-2 unit 1): the reply carries the core's `pipelineHistory`;
 *   - the version pin: a version the server does not serve is 409 engine_version_retired
 *     carrying the served version, and generates nothing;
 *   - the rate guard: anonymous per IP and signed-in per account, 6 a minute, the 7th 429;
 *     staff unlimited and never metered; a limiter error fails CLOSED;
 *   - the bot guard: 403 before any body is read or any client is made;
 *   - account_is_active for a signed-in caller: an inactive account is 403, unmetered.
 */
import { assert, assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { installScopedTestEnv } from '../_shared/scopedTestEnv.ts';
import {
  birthConfig,
  generateSettlementPipeline,
  getStepMeta,
  loadGenerationLawPayloads,
  regenHistoryPipeline,
  regenNPCsPipeline,
} from '../_shared/engineBundle.js';
import engineMeta from '../_shared/engineBundle.meta.json' with { type: 'json' };
import cases from '../../../tests/fixtures/engine-generate-cases.json' with { type: 'json' };

const scopedEnv = installScopedTestEnv({
  SUPABASE_URL: 'https://stub.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'service_role_dummy',
});

const { handleEngineGenerate, ENGINE_VERSION, ENGINE_GENERATE_RATE_LIMITS } = await import('./index.ts');
// The import above has read the stubs at module scope; hand the ambient environment
// back so nothing this suite supplied is visible while any OTHER suite runs.
scopedEnv.release();

const BROWSER_UA = 'Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/120';

async function sha256(s: string): Promise<string> {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(d)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

type StubOpts = {
  users?: Record<string, string>; // jwt -> user id
  roles?: Record<string, string>; // user id -> profiles.role
  rateError?: boolean;
  inactive?: Record<string, boolean>; // user id -> account_is_active false
  insertError?: boolean; // analytics_events insert answers an error
};

/** A service-role stub: auth.getUser, profiles.role, the session table, ingest_check_rate. */
function makeAdmin(opts: StubOpts = {}) {
  const counts = new Map<string, number>();
  const rpcCalls: Array<Record<string, unknown>> = []; // ingest_check_rate only
  const activeCalls: string[] = [];
  const inserts: Array<{ table: string; row: Record<string, unknown> }> = []; // the cost log
  let made = 0;
  const client = {
    auth: {
      getUser(jwt: string) {
        const id = opts.users?.[jwt];
        return Promise.resolve(id ? { data: { user: { id } }, error: null } : { data: { user: null }, error: { message: 'bad jwt' } });
      },
    },
    from(table: string) {
      let id = '';
      const q = {
        select() { return q; },
        eq(_c: string, v: string) { id = v; return q; },
        maybeSingle() {
          if (table === 'profiles') return Promise.resolve({ data: opts.roles?.[id] ? { role: opts.roles[id] } : null, error: null });
          return Promise.resolve({ data: null, error: null });
        },
        upsert() { return Promise.resolve({ error: null }); },
        insert(row: Record<string, unknown>) {
          inserts.push({ table, row });
          return Promise.resolve({ error: opts.insertError ? { message: 'insert down' } : null });
        },
      };
      return q;
    },
    rpc(fn: string, args: Record<string, unknown> = {}) {
      if (fn === 'account_is_active') {
        activeCalls.push(String(args.p_uid));
        return Promise.resolve({ data: !opts.inactive?.[String(args.p_uid)], error: null });
      }
      rpcCalls.push({ fn, ...args });
      if (opts.rateError) return Promise.resolve({ data: null, error: { message: 'limiter down' } });
      const key = String(args.p_key);
      const n = (counts.get(key) ?? 0) + 1;
      counts.set(key, n);
      return Promise.resolve({ data: n <= Number(args.p_max), error: null });
    },
  };
  return { rpcCalls, activeCalls, inserts, adminClient: () => { made++; return client; }, made: () => made };
}

function post(body: unknown, headers: Record<string, string> = {}) {
  return new Request('https://edge.test/functions/v1/engine-generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'user-agent': BROWSER_UA, 'cf-connecting-ip': '203.0.113.7', ...headers },
    body: JSON.stringify(body),
  });
}

scopedEnv.test('the served version is the bundle meta\'s content hash', () => {
  assertEquals(ENGINE_VERSION, engineMeta.engineVersion);
  assert(/^[0-9a-f]{16}$/.test(ENGINE_VERSION));
});

scopedEnv.test('REPLAY: three seeds — the function\'s settlement hashes to the bundle\'s own birth', async () => {
  assertEquals(cases.seeds.length, 3);
  await loadGenerationLawPayloads();
  for (const seed of cases.seeds) {
    const admin = makeAdmin();
    const res = await handleEngineGenerate(post({ seed, config: cases.config }), { adminClient: admin.adminClient });
    assertEquals(res.status, 200);
    const body = await res.json();
    assertEquals(body.engineVersion, ENGINE_VERSION);
    assert(!Number.isNaN(Date.parse(body.generatedAt)));
    // The expected side is the LOCAL birth under the STORE's own content runtime (remote-path
    // R2): the store stamps every standalone generation with the vanilla environment, and the
    // function stamps its birth with the same, so the two records are one record.
    const expected = generateSettlementPipeline(birthConfig(cases.config), null,
      { seed, customContent: {}, contentProvenance: cases.storeContentProvenance });
    assertEquals(await sha256(JSON.stringify(body.settlement)), await sha256(JSON.stringify(expected)), `seed ${seed}`);
    assertEquals(body.settlement.customContentProvenance?.environment?.environmentId, 'system:vanilla');
  }
});

scopedEnv.test('REPLAY: a config that turned custom content off is born with no stamp, as the store births it (remote-path R2)', async () => {
  await loadGenerationLawPayloads();
  const seed = cases.seeds[1];
  const config = { ...cases.config, useCustomContent: false };
  const res = await handleEngineGenerate(post({ seed, config }), { adminClient: makeAdmin().adminClient });
  assertEquals(res.status, 200);
  const body = await res.json();
  const expected = generateSettlementPipeline(birthConfig(config), null, { seed, customContent: {} });
  assertEquals(await sha256(JSON.stringify(body.settlement)), await sha256(JSON.stringify(expected)), `seed ${seed}`);
  assertEquals(body.settlement.customContentProvenance, undefined);
});

scopedEnv.test('REPLAY: the reply carries the core\'s pipelineHistory — the reveal\'s step list, one row per step (ENGINE-2 unit 1)', async () => {
  await loadGenerationLawPayloads();
  const seed = cases.seeds[0];
  const admin = makeAdmin();
  const res = await handleEngineGenerate(post({ seed, config: cases.config }), { adminClient: admin.adminClient });
  assertEquals(res.status, 200);
  const body = await res.json();
  assert(Array.isArray(body.pipelineHistory) && body.pipelineHistory.length > 0, 'a non-empty step list');
  for (const row of body.pipelineHistory) {
    assertEquals(Object.keys(row).sort(), ['id', 'summary']);
    assert(typeof row.id === 'string' && row.id.length > 0);
  }
  assertEquals(new Set(body.pipelineHistory.map((row: { id: string }) => row.id)).size, body.pipelineHistory.length);
});

scopedEnv.test('REPLAY: a pinned engineVersion equal to the served one is honoured', async () => {
  const admin = makeAdmin();
  const res = await handleEngineGenerate(
    post({ seed: cases.seeds[0], config: cases.config, engineVersion: ENGINE_VERSION }),
    { adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);
  assertEquals((await res.json()).engineVersion, ENGINE_VERSION);
});

scopedEnv.test('409: a pinned engineVersion the server does not serve is engine_version_retired, with the served version', async () => {
  const admin = makeAdmin();
  const res = await handleEngineGenerate(
    post({ seed: 's', config: cases.config, engineVersion: '0000000000000000' }),
    { adminClient: admin.adminClient },
  );
  assertEquals(res.status, 409);
  const body = await res.json();
  assertEquals(body.error, 'engine_version_retired');
  assertEquals(body.engineVersion, ENGINE_VERSION);
  assertEquals(body.requested, '0000000000000000');
  assertEquals(body.settlement, undefined);
  assertEquals(admin.rpcCalls.length, 0); // refused before the meter
});

scopedEnv.test('rate: an anonymous IP gets 6 a minute, the 7th is 429 rate_limited', async () => {
  assertEquals(ENGINE_GENERATE_RATE_LIMITS.perMinute.max, 6);
  assertEquals(ENGINE_GENERATE_RATE_LIMITS.perDay.max, 200);
  const admin = makeAdmin();
  const statuses: number[] = [];
  for (let i = 0; i < 7; i++) {
    const res = await handleEngineGenerate(post({ seed: `anon-${i}`, config: { settType: 'thorp' } }), { adminClient: admin.adminClient });
    statuses.push(res.status);
    await res.body?.cancel();
  }
  assertEquals(statuses, [200, 200, 200, 200, 200, 200, 429]);
  assert(admin.rpcCalls.every((c) => String(c.p_key).includes(':ip:203.0.113.7')), 'anonymous traffic is keyed by IP');
  assert(admin.rpcCalls.some((c) => c.p_key === 'engd:u:ip:203.0.113.7' && c.p_window_seconds === 86_400 && c.p_max === 200));
});

scopedEnv.test('rate: a signed-in caller is metered per account, not per IP', async () => {
  const admin = makeAdmin({ users: { 'jwt-u1': 'user-1' }, roles: { 'user-1': 'user' } });
  const res = await handleEngineGenerate(
    post({ seed: 'acct', config: { settType: 'thorp' } }, { Authorization: 'Bearer jwt-u1' }),
    { adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);
  await res.body?.cancel();
  assertEquals(admin.rpcCalls.map((c) => c.p_key), ['engm:u:u:user-1', 'engd:u:u:user-1']);
  assertEquals(admin.activeCalls, ['user-1']);
});

scopedEnv.test('account: an inactive signed-in account is 403 and never metered; anonymous callers skip the check', async () => {
  const admin = makeAdmin({ users: { 'jwt-u2': 'user-2' }, roles: { 'user-2': 'user' }, inactive: { 'user-2': true } });
  const res = await handleEngineGenerate(
    post({ seed: 'inactive', config: { settType: 'thorp' } }, { Authorization: 'Bearer jwt-u2' }),
    { adminClient: admin.adminClient },
  );
  assertEquals(res.status, 403);
  await res.body?.cancel();
  assertEquals(admin.rpcCalls.length, 0);
  const anon = makeAdmin();
  const ok = await handleEngineGenerate(post({ seed: 'anon-active', config: { settType: 'thorp' } }), { adminClient: anon.adminClient });
  assertEquals(ok.status, 200);
  await ok.body?.cancel();
  assertEquals(anon.activeCalls, []);
});

scopedEnv.test('rate: staff are unlimited and never metered', async () => {
  const admin = makeAdmin({ users: { 'jwt-staff': 'staff-1' }, roles: { 'staff-1': 'developer' } });
  for (let i = 0; i < 8; i++) {
    const res = await handleEngineGenerate(
      post({ seed: `staff-${i}`, config: { settType: 'thorp' } }, { Authorization: 'Bearer jwt-staff' }),
      { adminClient: admin.adminClient },
    );
    assertEquals(res.status, 200);
    await res.body?.cancel();
  }
  assertEquals(admin.rpcCalls.length, 0);
});

scopedEnv.test('rate: a limiter error fails CLOSED (429), and a bad JWT is simply anonymous', async () => {
  const admin = makeAdmin({ rateError: true });
  const res = await handleEngineGenerate(
    post({ seed: 'x', config: { settType: 'thorp' } }, { Authorization: 'Bearer not-a-user' }),
    { adminClient: admin.adminClient },
  );
  assertEquals(res.status, 429);
  assertEquals((await res.json()).error, 'rate_limited');
  assert(String(admin.rpcCalls[0]?.p_key).includes(':ip:'), 'the unresolved JWT fell back to the IP key');
});

scopedEnv.test('bot guard: an obvious bot UA is 403 before any client is made', async () => {
  const admin = makeAdmin();
  const res = await handleEngineGenerate(
    post({ seed: 'x', config: {} }, { 'user-agent': 'curl/8.0' }),
    { adminClient: admin.adminClient },
  );
  assertEquals(res.status, 403);
  await res.body?.cancel();
  assertEquals(admin.made(), 0);
  assertEquals(admin.rpcCalls.length, 0);
});

scopedEnv.test('method and shape: OPTIONS 200, GET 405, bad JSON / seed / config 400, oversize 413', async () => {
  const admin = makeAdmin();
  const opts = { adminClient: admin.adminClient };
  const url = 'https://edge.test/functions/v1/engine-generate';
  assertEquals((await handleEngineGenerate(new Request(url, { method: 'OPTIONS' }), opts)).status, 200);
  assertEquals((await handleEngineGenerate(new Request(url, { method: 'GET' }), opts)).status, 405);
  const badJson = new Request(url, { method: 'POST', headers: { 'user-agent': BROWSER_UA }, body: '{' });
  assertEquals((await handleEngineGenerate(badJson, opts)).status, 400);
  assertEquals((await handleEngineGenerate(post({ config: {} }), opts)).status, 400);
  assertEquals((await handleEngineGenerate(post({ seed: 's', config: [] }), opts)).status, 400);
  assertEquals((await handleEngineGenerate(post({ seed: 's', config: { pad: 'x'.repeat(300_000) } }), opts)).status, 413);
  assertEquals(admin.rpcCalls.length, 0);
});

// ── ENGINE-4 unit 1: the two non-birth ops ─────────────────────────────────────────────

scopedEnv.test('DERIVE: three seeds — the settlement is the bundle\'s own pipeline call with the pins, verbatim (no birthConfig)', async () => {
  await loadGenerationLawPayloads();
  for (const seed of cases.seeds) {
    const config = birthConfig(cases.config);
    const record = generateSettlementPipeline(config, null, { seed });
    // Every chooser of a step or none (the runner's rule): generatePopulation's two.
    const pins = JSON.parse(JSON.stringify({ npcs: record.npcs || [], relationships: record.relationships || [] }));
    const admin = makeAdmin();
    const res = await handleEngineGenerate(post({ op: 'derive', seed, config, pins }), { adminClient: admin.adminClient });
    assertEquals(res.status, 200);
    const body = await res.json();
    assertEquals(body.engineVersion, ENGINE_VERSION);
    assertEquals(body.pipelineHistory, undefined);
    const expected = generateSettlementPipeline(JSON.parse(JSON.stringify(config)), null, { seed, pins: JSON.parse(JSON.stringify(pins)) });
    assertEquals(await sha256(JSON.stringify(body.settlement)), await sha256(JSON.stringify(expected)), `seed ${seed}`);
    assertEquals(admin.rpcCalls.length, 2, 'derive is metered by the same two windows as generate');
  }
});

scopedEnv.test('DERIVE: a body over the generate cap (256 KB) is accepted for derive and refused 413 for generate', async () => {
  const pad = 'x'.repeat(300 * 1024);
  const admin = makeAdmin();
  const gen = await handleEngineGenerate(post({ seed: 's', config: { pad } }), { adminClient: admin.adminClient });
  assertEquals(gen.status, 413);
  assertEquals((await gen.json()).maxBytes, 256 * 1024);
  const derive = await handleEngineGenerate(post({ op: 'derive', seed: cases.seeds[0], config: cases.config, pins: { pad } }), { adminClient: makeAdmin().adminClient });
  assert(derive.status !== 413, `derive answered ${derive.status}`);
  const huge = await handleEngineGenerate(post({ op: 'derive', seed: 's', config: { pad: 'x'.repeat(1024 * 1024) } }), { adminClient: makeAdmin().adminClient });
  assertEquals(huge.status, 413);
});

scopedEnv.test('GENERATE: a wizard-sized body (the chair\'s measured 39,940-byte exclude-all) is served, not 413 (remote-path R4)', async () => {
  await loadGenerationLawPayloads();
  const toggles: Record<string, unknown> = {};
  for (let i = 0; toggles && JSON.stringify(toggles).length < 40_000; i += 1) {
    toggles[`metropolis::Economy::Institution number ${i}`] = { allow: false, require: false, forceExclude: true };
  }
  const config = { ...cases.config, _institutionToggles: toggles };
  const res = await handleEngineGenerate(post({ seed: cases.seeds[0], config }), { adminClient: makeAdmin().adminClient });
  assertEquals(res.status, 200);
});

scopedEnv.test('OPS: an unknown op and a non-object pins bag are refused 400', async () => {
  const admin = makeAdmin();
  const bad = await handleEngineGenerate(post({ op: 'advance', seed: 's', config: {} }), { adminClient: admin.adminClient });
  assertEquals(bad.status, 400);
  assertEquals((await bad.json()).error, 'invalid_op');
  const pins = await handleEngineGenerate(post({ op: 'derive', seed: 's', config: {}, pins: [1] }), { adminClient: admin.adminClient });
  assertEquals(pins.status, 400);
  assertEquals((await pins.json()).error, 'invalid_pins');
  assertEquals(admin.made(), 0, 'shape refusals reach no client');
});

scopedEnv.test('STEPMETA: the registry rows, with no identity, no rate guard and no client', async () => {
  const admin = makeAdmin();
  const res = await handleEngineGenerate(post({ op: 'stepMeta' }), { adminClient: admin.adminClient });
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.engineVersion, ENGINE_VERSION);
  assertEquals(body.stepMeta, JSON.parse(JSON.stringify(getStepMeta())));
  assert(body.stepMeta.length > 0);
  assertEquals(admin.made(), 0);
  const pinned = await handleEngineGenerate(post({ op: 'stepMeta', engineVersion: 'old0000000000000' }), { adminClient: admin.adminClient });
  assertEquals(pinned.status, 409);
});

scopedEnv.test('REGEN: three seeds — each section\'s parts are the bundle\'s own pass over the body, verbatim, metered (ENGINE-5 unit 1)', async () => {
  await loadGenerationLawPayloads();
  for (const seed of cases.seeds) {
    const config = birthConfig(cases.config);
    const settlement = JSON.parse(JSON.stringify(generateSettlementPipeline(config, null, { seed })));
    const replay = `${seed}-regen`;
    for (const section of ['npcs', 'history']) {
      const admin = makeAdmin();
      const body = { op: 'regenSection', section, settlement, config: settlement.config, seed: replay, ...(section === 'npcs' ? { locks: {} } : {}) };
      const res = await handleEngineGenerate(post(body), { adminClient: admin.adminClient });
      assertEquals(res.status, 200);
      const reply = await res.json();
      assertEquals(reply.engineVersion, ENGINE_VERSION);
      assert(!Number.isNaN(Date.parse(reply.generatedAt)));
      const wire = JSON.parse(JSON.stringify(body));
      const expected = section === 'npcs'
        ? regenNPCsPipeline(wire.settlement, wire.config, { locks: {}, seed: replay })
        : regenHistoryPipeline(wire.settlement, wire.config, { seed: replay });
      assertEquals(await sha256(JSON.stringify(reply.parts)), await sha256(JSON.stringify(expected)), `${section} ${seed}`);
      assertEquals(reply.parts._regenSeed, replay);
      assertEquals(admin.rpcCalls.length, 2, 'regenSection is metered by the same two windows as generate');
    }
  }
});

scopedEnv.test('REGEN: no seed — the pass mints one and reports it; a record over the generate cap rides the 1 MiB cap', async () => {
  await loadGenerationLawPayloads();
  const config = birthConfig(cases.config);
  const settlement = JSON.parse(JSON.stringify(generateSettlementPipeline(config, null, { seed: cases.seeds[0] })));
  // Carried past the generate cap (256 KB) by a key the pass does not read.
  settlement._capPad = 'x'.repeat(300 * 1024);
  assert(new TextEncoder().encode(JSON.stringify(settlement)).length > 256 * 1024, 'the record is over the generate cap');
  const res = await handleEngineGenerate(post({ op: 'regenSection', section: 'history', settlement, config: settlement.config }), { adminClient: makeAdmin().adminClient });
  assertEquals(res.status, 200);
  const reply = await res.json();
  assert(typeof reply.parts._regenSeed === 'string' && reply.parts._regenSeed.length > 0, 'a minted seed');
  assert(reply.parts.history && typeof reply.parts.history === 'object');
  const huge = await handleEngineGenerate(post({ op: 'regenSection', section: 'npcs', settlement: { pad: 'x'.repeat(1024 * 1024) }, config: {} }), { adminClient: makeAdmin().adminClient });
  assertEquals(huge.status, 413);
});

scopedEnv.test('REGEN: a bad section, settlement, locks or seed is refused 400 with no client', async () => {
  const admin = makeAdmin();
  const cases400: Array<[Record<string, unknown>, string]> = [
    [{ op: 'regenSection', section: 'economy', settlement: {}, config: {} }, 'invalid_section'],
    [{ op: 'regenSection', settlement: {}, config: {} }, 'invalid_section'],
    [{ op: 'regenSection', section: 'npcs', settlement: [1], config: {} }, 'invalid_settlement'],
    [{ op: 'regenSection', section: 'npcs', settlement: {}, config: {}, locks: [1] }, 'invalid_locks'],
    [{ op: 'regenSection', section: 'npcs', settlement: {}, config: {}, seed: '' }, 'invalid_seed'],
    [{ op: 'regenSection', section: 'npcs', settlement: {} }, 'invalid_config'],
  ];
  for (const [body, error] of cases400) {
    const res = await handleEngineGenerate(post(body), { adminClient: admin.adminClient });
    assertEquals(res.status, 400, JSON.stringify(body));
    assertEquals((await res.json()).error, error);
  }
  assertEquals(admin.made(), 0, 'shape refusals reach no client');
});

scopedEnv.test('COST LOG: one engine_generate row per metered call — op, outcome, duration, version, a keyed caller hash, no IP (ENGINE-5 unit 4)', async () => {
  await loadGenerationLawPayloads();
  const admin = makeAdmin();
  const res = await handleEngineGenerate(post({ seed: cases.seeds[0], config: cases.config }), { adminClient: admin.adminClient });
  assertEquals(res.status, 200);
  assertEquals(admin.inserts.length, 1);
  const { table, row } = admin.inserts[0];
  assertEquals(table, 'analytics_events');
  assertEquals(row.event, 'engine_generate');
  assertEquals(row.actor_id, null);
  assertEquals(row.consent_tier, 'product');
  const props = row.props as Record<string, unknown>;
  assertEquals(props.op, 'generate');
  assertEquals(props.outcome, 'ok');
  assertEquals(props.engine_version, ENGINE_VERSION);
  assertEquals(props.caller, 'ip');
  assertEquals(props.staff, false);
  assert(typeof props.duration_ms === 'number' && props.duration_ms >= 0);
  assert(/^[0-9a-f]{16}$/.test(String(props.caller_hash)), 'a 16-hex keyed hash');
  assert(!JSON.stringify(row).includes('203.0.113.7'), 'the IP is never stored');
  // The same caller hashes the same; an account hashes apart from its IP.
  const again = makeAdmin({ users: { jwt1: 'user-1' } });
  await handleEngineGenerate(post({ op: 'derive', seed: cases.seeds[0], config: cases.config }), { adminClient: admin.adminClient });
  await handleEngineGenerate(post({ op: 'derive', seed: cases.seeds[0], config: cases.config }, { Authorization: 'Bearer jwt1' }), { adminClient: again.adminClient });
  const second = admin.inserts[1].row.props as Record<string, unknown>;
  const account = again.inserts[0].row.props as Record<string, unknown>;
  assertEquals(second.op, 'derive');
  assertEquals(second.caller_hash, props.caller_hash);
  assertEquals(account.caller, 'account');
  assert(account.caller_hash !== props.caller_hash);
  assert(!JSON.stringify(again.inserts[0].row).includes('user-1'), 'the account id is never stored');
});

scopedEnv.test('COST LOG: rate_limited, refused (inactive) and failed are logged; stepMeta and shape refusals are not; a log failure never changes the reply', async () => {
  const limited = makeAdmin();
  for (let i = 0; i < 7; i++) await handleEngineGenerate(post({ op: 'derive', seed: 's', config: {} }), { adminClient: limited.adminClient });
  assertEquals(limited.inserts.at(-1)?.row.props && (limited.inserts.at(-1)!.row.props as Record<string, unknown>).outcome, 'rate_limited');
  assertEquals(limited.inserts.length, 7);
  const inactive = makeAdmin({ users: { jwtX: 'user-x' }, inactive: { 'user-x': true } });
  const r403 = await handleEngineGenerate(post({ seed: 's', config: {} }, { Authorization: 'Bearer jwtX' }), { adminClient: inactive.adminClient });
  assertEquals(r403.status, 403);
  assertEquals((inactive.inserts[0].row.props as Record<string, unknown>).outcome, 'refused');
  const failing = makeAdmin();
  const r422 = await handleEngineGenerate(post({ op: 'regenSection', section: 'npcs', settlement: { institutions: 5 }, config: {} }), { adminClient: failing.adminClient });
  assertEquals(r422.status, 422);
  assertEquals((failing.inserts[0].row.props as Record<string, unknown>).outcome, 'failed');
  assertEquals((failing.inserts[0].row.props as Record<string, unknown>).op, 'regenSection');
  const quiet = makeAdmin();
  await handleEngineGenerate(post({ op: 'stepMeta' }), { adminClient: quiet.adminClient });
  await handleEngineGenerate(post({ op: 'derive', seed: '', config: {} }), { adminClient: quiet.adminClient });
  assertEquals(quiet.inserts.length, 0);
  await loadGenerationLawPayloads();
  const broken = makeAdmin({ insertError: true });
  const ok = await handleEngineGenerate(post({ seed: cases.seeds[0], config: cases.config }), { adminClient: broken.adminClient });
  assertEquals(ok.status, 200);
  assert((await ok.json()).settlement, 'the town still answers');
});
