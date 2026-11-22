// usage: node leafdiff.mjs <treeA> <treeB> <out.json>  -- births both trees in one process, diffs leaf paths
import { writeFileSync } from 'node:fs';
const [ta, tb, outPath] = process.argv.slice(2);
const A = (await import(`${ta}/src/generators/generateSettlementPipeline.js`)).generateSettlementPipeline;
const B = (await import(`${tb}/src/generators/generateSettlementPipeline.js`)).generateSettlementPipeline;
const { goldenCorpus, keyOf } = await import(`${ta}/tests/helpers/goldenMasterCorpus.js`);
const PICK = new Set(['hamlet|germanic|riverside|river|civilized|golden-master-v3','town|germanic|plains|road|civilized|golden-master-v3','city|germanic|coastal|port|civilized|golden-master-v3']);
function leaves(x, p, out) {
  if (x && typeof x === 'object') {
    const isArr = Array.isArray(x);
    const ks = Object.keys(x);
    if (ks.length === 0) out.set(p, JSON.stringify(x));
    for (const k of ks) leaves(x[k], isArr ? `${p}[${k}]` : `${p}.${k}`, out);
  } else out.set(p, JSON.stringify(x));
}
const norm = (p) => p.replace(/\[\d+\]/g, '[]');
const agg = {}; const lenAgg = {}; const picks = {};
for (const c of goldenCorpus()) {
  const k = keyOf(c); const { _seed, ...cfg } = c;
  const sa = A(cfg, null, { seed: _seed, customContent: {} });
  const sb = B(cfg, null, { seed: _seed, customContent: {} });
  const la = new Map(), lb = new Map(); leaves(sa, '', la); leaves(sb, '', lb);
  const rowPaths = new Set(); const diffs = [];
  for (const [p, v] of la) if (lb.get(p) !== v) { rowPaths.add(norm(p) + (lb.has(p) ? '' : ' (gone)')); diffs.push([p, v, lb.get(p)]); }
  for (const [p, v] of lb) if (!la.has(p)) { rowPaths.add(norm(p) + ' (new)'); diffs.push([p, undefined, v]); }
  for (const p of rowPaths) { agg[p] ??= {}; agg[p][c.settType] = (agg[p][c.settType] || 0) + 1; }
  // array length changes on a few interesting arrays
  for (const f of ['npcs','relationships','conflicts']) if ((sa[f]||[]).length !== (sb[f]||[]).length) lenAgg[f] = (lenAgg[f]||0)+1;
  if (PICK.has(k)) picks[k] = diffs;
}
writeFileSync(outPath, JSON.stringify({ agg, lenAgg, picks }, null, 1));
console.log('done paths=' + Object.keys(agg).length, JSON.stringify(lenAgg));
