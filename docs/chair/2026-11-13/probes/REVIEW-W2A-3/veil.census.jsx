import { test, expect } from 'vitest';
import fs from 'node:fs';
import zlib from 'node:zlib';
import { composePublicProse } from '/home/user/wt/tip/src/components/new/publicProseCompose.js';
import { publicVeiledRecordOf } from '/home/user/wt/tip/src/domain/display/publicSafe.js';
import { loadGenerationLawPayloads } from '/home/user/wt/tip/src/domain/density/densityCreateBoundary.js';
const recs = [];
for (const f of fs.readdirSync('/home/user/wt/r-tip/records')) recs.push([f, JSON.parse(fs.readFileSync('/home/user/wt/r-tip/records/' + f, 'utf8'))]);
if (process.env.CORPUS && fs.existsSync(process.env.CORPUS)) {
  for (const l of zlib.gunzipSync(fs.readFileSync(process.env.CORPUS)).toString('utf8').split('\n')) { if (!l.trim()) continue; const o = JSON.parse(l); recs.push([o.seed, o.s]); }
}
test('veil invariance over my towns' + (process.env.CORPUS ? ' and the census corpus' : ''), async () => {
  await loadGenerationLawPayloads();
  const mism = []; let blocks = 0;
  for (const [id, owner] of recs) {
    const s = publicVeiledRecordOf(owner); s._seed = owner._seed;
    const a = composePublicProse(owner).blocks, b = composePublicProse(s).blocks;
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) { blocks++; if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) mism.push({id, k, owner: a[k], stripped: b[k]}); }
  }
  fs.writeFileSync('/home/user/wt/veil/result.json', JSON.stringify({ towns: recs.length, blocks, mism }, null, 1));
  expect(mism).toEqual([]);
}, 3600000);
