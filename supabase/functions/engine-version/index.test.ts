/**
 * index.test.ts — behavioural contract for engine-version (ENGINE-1 unit 4).
 *
 * Pins: the body is exactly { engineVersion, builtFromCommit, deployedAt } read from the
 * bundle's meta; the version is the one engine-generate serves (one stamp, two readers);
 * the method gate.
 */
import { assert, assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import engineMeta from '../_shared/engineBundle.meta.json' with { type: 'json' };
import { handleEngineVersion } from './index.ts';
import { ENGINE_VERSION } from '../engine-generate/index.ts';

const url = 'https://edge.test/functions/v1/engine-version';

Deno.test('GET returns exactly { engineVersion, builtFromCommit, deployedAt } from the bundle meta', async () => {
  const res = handleEngineVersion(new Request(url, { method: 'GET' }));
  assertEquals(res.status, 200);
  assertEquals(res.headers.get('Cache-Control'), 'no-store');
  const body = await res.json();
  assertEquals(Object.keys(body).sort(), ['builtFromCommit', 'deployedAt', 'engineVersion']);
  assertEquals(body.engineVersion, engineMeta.engineVersion);
  assertEquals(body.builtFromCommit, engineMeta.builtFromCommit);
  assertEquals(body.deployedAt, engineMeta.generatedAt);
  assert(/^[0-9a-f]{16}$/.test(body.engineVersion));
  assert(/^[0-9a-f]{40}$/.test(body.builtFromCommit));
  assert(!Number.isNaN(Date.parse(body.deployedAt)));
});

Deno.test('the version engine-version reports is the version engine-generate serves', async () => {
  const body = await handleEngineVersion(new Request(url, { method: 'GET' })).json();
  assertEquals(body.engineVersion, ENGINE_VERSION);
});

Deno.test('method gate: OPTIONS 200, HEAD 200 with no body, POST 405', async () => {
  assertEquals(handleEngineVersion(new Request(url, { method: 'OPTIONS' })).status, 200);
  const head = handleEngineVersion(new Request(url, { method: 'HEAD' }));
  assertEquals(head.status, 200);
  assertEquals(head.body, null);
  const post = handleEngineVersion(new Request(url, { method: 'POST', body: '{}' }));
  assertEquals(post.status, 405);
  await post.body?.cancel();
});
