import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
const ROOT = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/lane-932-headroom';
const start = process.argv[2];
const seen = new Set();
const stack = [resolve(ROOT, start)];
const re = /(?:from\s*['"]([^'"]+)['"])|(?:import\s*\(\s*['"]([^'"]+)['"])/g;
function resolveSpec(from, spec) {
  if (!spec.startsWith('.')) return null;
  let p = resolve(dirname(from), spec);
  if (existsSync(p) && statSync(p).isFile()) return p;
  for (const ext of ['.js', '.jsx', '/index.js']) if (existsSync(p + ext)) return p + ext;
  return null;
}
while (stack.length) {
  const f = stack.pop();
  if (seen.has(f)) continue;
  seen.add(f);
  let src; try { src = readFileSync(f, 'utf8'); } catch { continue; }
  let m; re.lastIndex = 0;
  while ((m = re.exec(src))) {
    const spec = m[1] || m[2];
    const r = resolveSpec(f, spec);
    if (r) stack.push(r);
  }
}
const rel = [...seen].map(p => p.slice(ROOT.length + 1)).sort();
const buckets = {};
for (const r of rel) { const k = r.split('/').slice(0, 3).join('/'); buckets[k] = (buckets[k] || 0) + 1; }
console.log('TOTAL MODULES REACHED:', rel.length);
console.log(Object.entries(buckets).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${v}\t${k}`).join('\n'));
const probes = ['commercialReasons','commodityFlow','supplyKernel','foodStockpile','peaceTermsCatalog','beliefMap','dispatchEV','goodsCatalog','simulationRules','settlementRumors','tradeWar','entrepots','treatyTransfer','strategicPosture','commonsVoiceKernel','foreignGuestHold','errandMint'];
console.log('--- probes reachable from', start, '---');
for (const p of probes) console.log(rel.some(r => r.endsWith('/' + p + '.js')) ? 'YES ' + p : 'no   ' + p);
