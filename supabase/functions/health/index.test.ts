/**
 * index.test.ts — execution test for the health/uptime endpoint.
 *
 * Runs the real handler with an injected dbPing stub and pins: the method gate,
 * the liveness shape, and the deep-probe up/down/status-code branches. No live
 * Supabase (SERVICE_KEY set so the deep branch reaches the injected ping).
 */
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { installScopedTestEnv } from '../_shared/scopedTestEnv.ts';

const scopedEnv = installScopedTestEnv({
  SUPABASE_URL: 'https://stub.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'service_role_dummy',
});

const { handleHealth } = await import('./index.ts');
// The import above has read the stubs at module scope; hand the ambient environment
// back so nothing this suite supplied is visible while any OTHER suite runs.
scopedEnv.release();

const get = (path: string) => new Request(`https://edge.test/functions/v1/${path}`, { method: 'GET' });

scopedEnv.test('OPTIONS preflight returns 200 with no body', async () => {
  const res = await handleHealth(new Request('https://edge.test/functions/v1/health', { method: 'OPTIONS' }));
  assertEquals(res.status, 200);
});

scopedEnv.test('non-GET is rejected', async () => {
  const res = await handleHealth(new Request('https://edge.test/functions/v1/health', { method: 'POST' }));
  assertEquals(res.status, 405);
});

scopedEnv.test('liveness: GET returns 200 ok:true with the service tag', async () => {
  const res = await handleHealth(get('health'));
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.ok, true);
  assertEquals(body.service, 'settlementforge-edge');
  assertEquals(typeof body.ts, 'string');
});

scopedEnv.test('deep probe: DB up → 200 db:up', async () => {
  const res = await handleHealth(get('health?deep=1'), { dbPing: () => Promise.resolve(true) });
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.db, 'up');
  assertEquals(body.ok, true);
});

scopedEnv.test('deep probe: DB down → 503 db:down ok:false', async () => {
  const res = await handleHealth(get('health?deep=1'), { dbPing: () => Promise.resolve(false) });
  assertEquals(res.status, 503);
  const body = await res.json();
  assertEquals(body.db, 'down');
  assertEquals(body.ok, false);
});

scopedEnv.test('deep probe: a throwing ping degrades to down, never throws', async () => {
  const res = await handleHealth(get('health?deep=1'), { dbPing: () => Promise.reject(new Error('boom')) });
  assertEquals(res.status, 503);
  const body = await res.json();
  assertEquals(body.db, 'down');
});
