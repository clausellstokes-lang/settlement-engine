import fs from 'node:fs';
const TREE = process.env.TREE; const L = JSON.parse(fs.readFileSync('layermap/results/layers.json', 'utf8')).rows;
const asked = new Map();
for (const f of fs.readdirSync('out-base/reach')) for (const [k, v] of Object.entries(JSON.parse(fs.readFileSync('out-base/reach/' + f)))) { const e = asked.get(k) || [0, 0]; e[0]++; if (v[1] > 0) e[1]++; asked.set(k, e); }
const all = [];
for (const d of ['economy', 'defense', 'general', 'power', 'stressors', 'warFaith']) {
  const m = await import(`${TREE}/src/data/dossierStateProse/${d}.generated.js`);
  for (const c of Object.values(m)) for (const [b, blk] of Object.entries(c)) for (const k of Object.keys(blk.pools || {})) all.push(`${b}::${k}`);
}
const causal = await import(`${TREE}/src/data/dossierCausalProse.generated.js`);
const call = []; for (const [b, blk] of Object.entries(causal.DOSSIER_CAUSAL_PROSE)) for (const k of Object.keys(blk.pools || {})) call.push(`${b}::${k}`);
const reached = all.filter((k) => asked.has(k)); const un = all.filter((k) => !asked.has(k));
const byLayer = (ks) => { const m = {}; for (const k of ks) { const l = L[k]?.layer ?? '-'; m[l] = (m[l] || 0) + 1; } return m; };
console.log('state pools', all.length, 'asked by the rendered page', reached.length, 'live in some town', reached.filter((k) => asked.get(k)[1] > 0).length);
console.log('unreached', un.length, byLayer(un));
console.log('causal pools', call.length, 'asked', call.filter((k) => asked.has(k)).length);
// the unreached non-world pools: which src files name their block, outside the generated corpus
const blocks = [...new Set(un.filter((k) => L[k]?.layer !== 'W').map((k) => k.split('::')[0]))];
const { execSync } = await import('node:child_process');
const readers = {};
for (const b of blocks) readers[b] = execSync(`git -C ${TREE} grep -l "'${b}'" -- src ':!src/data/dossierStateProse' || true`, { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const unNW = un.filter((k) => L[k]?.layer !== 'W');
const perBlock = {}; for (const k of unNW) { const b = k.split('::')[0]; perBlock[b] = (perBlock[b] || 0) + 1; }
fs.writeFileSync('probe/reach.json', JSON.stringify({ reached, unreached: un, perBlock, readers, asked: Object.fromEntries(asked) }, null, 1));
for (const b of Object.keys(perBlock).sort()) console.log(b, perBlock[b], '←', readers[b].join(' '));
