/**
 * index.test.ts — behavioural contract for engine-generate (ENGINE-1 unit 3).
 *
 * Runs the real handler with a stubbed service-role client and pins:
 *   - REPLAY: for the three cases in tests/fixtures/engine-generate-cases.json the
 *     function's settlement hashes to the bundle's own birth (birthConfig + pipeline, the
 *     same `_shared/engineBundle.js`, in this Deno process). The other link of the chain —
 *     the bundle's birth equals the IN-PROCESS birth for the same cases — is
 *     tests/build/engineBundleReplay.test.js, which reads the same fixture in Node.
 *   - the version pin: a version the server does not serve is 409 engine_version_retired
 *     carrying the served version, and generates nothing;
 *   - the rate guard: anonymous per IP and signed-in per account, 6 a minute, the 7th 429;
 *     staff unlimited and never metered; a limiter error fails CLOSED;
 *   - the bot guard: 403 before any body is read or any client is made.
 */
import { assert, assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { installScopedTestEnv } from '../_shared/scopedTestEnv.ts';
import {
  birthConfig,
  generateSettlementPipeline,
  loadGenerationLawPayloads,
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
};

/** A service-role stub: auth.getUser, profiles.role, the session table, ingest_check_rate. */
function makeAdmin(opts: StubOpts = {}) {
  const counts = new Map<string, number>();
  const rpcCalls: Array<Record<string, unknown>> = [];
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
      };
      return q;
    },
    rpc(fn: string, args: Record<string, unknown> = {}) {
      rpcCalls.push({ fn, ...args });
      if (opts.rateError) return Promise.resolve({ data: null, error: { message: 'limiter down' } });
      const key = String(args.p_key);
      const n = (counts.get(key) ?? 0) + 1;
      counts.set(key, n);
      return Promise.resolve({ data: n <= Number(args.p_max), error: null });
    },
  };
  return { rpcCalls, adminClient: () => { made++; return client; }, made: () => made };
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
    const expected = generateSettlementPipeline(birthConfig(cases.config), null, { seed, customContent: {} });
    assertEquals(await sha256(JSON.stringify(body.settlement)), await sha256(JSON.stringify(expected)), `seed ${seed}`);
  }
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
  assertEquals((await handleEngineGenerate(post({ seed: 's', config: { pad: 'x'.repeat(40_000) } }), opts)).status, 413);
  assertEquals(admin.rpcCalls.length, 0);
});
