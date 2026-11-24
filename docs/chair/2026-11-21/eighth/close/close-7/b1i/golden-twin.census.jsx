/** @vitest-environment node */
import { test } from 'vitest';
import { writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
test('golden twin', async () => {
  const out = {};
  for (const T of ['/home/user/wt/lit', '/home/user/wt/b1i']) {
    const { generateSettlementPipeline } = await import(/* @vite-ignore */ `${T}/src/generators/generateSettlementPipeline.js`);
    const { goldenCorpus, keyOf } = await import(/* @vite-ignore */ `${T}/tests/helpers/goldenMasterCorpus.js`);
    const rows = typeof goldenCorpus === 'function' ? goldenCorpus() : goldenCorpus;
    out[T] = Object.fromEntries(rows.map((c) => { const { _seed, ...cfg } = c; const s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} }); return [keyOf(c), createHash('sha256').update(JSON.stringify(s)).digest('hex')]; }));
  }
  const A = out['/home/user/wt/lit']; const B = out['/home/user/wt/b1i'];
  const moved = Object.keys(A).filter((k) => A[k] !== B[k]);
  writeFileSync(process.env.PROBE_OUT, `rows ${Object.keys(A).length} moved ${moved.length}\n${moved.join('\n')}\n`);
}, 3600000);
