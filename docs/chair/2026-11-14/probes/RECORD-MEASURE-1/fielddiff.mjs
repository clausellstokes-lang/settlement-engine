// field diff by family: node fielddiff.mjs <before corpus> <after corpus> [depth=2]
// a FAMILY is the record path cut at <depth> keys (arrays index-free). Prints, a family a row, the towns where it moved.
import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);
const load = require('./load.cjs');
const [A, B, D = '2'] = process.argv.slice(2); const depth = Number(D);
const a = Object.fromEntries(load(A).map((r) => [r.seed, r.s])), b = Object.fromEntries(load(B).map((r) => [r.seed, r.s]));
const SKIP = new Set(['simulationTrace', 'generationCoherenceReceipt']);
const fam = {}, moved = new Set();
const walk = (x, y, path, seed, d) => {
  if (JSON.stringify(x) === JSON.stringify(y)) return;
  if (d >= depth || !x || !y || typeof x !== 'object' || typeof y !== 'object' || Array.isArray(x) !== Array.isArray(y)) { (fam[path] ??= new Set()).add(seed); return; }
  if (Array.isArray(x)) { (fam[path] ??= new Set()).add(seed); return; }
  for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) walk(x[k], y[k], path ? path + '.' + k : k, seed, d + 1);
};
for (const seed of Object.keys(a)) { for (const k of new Set([...Object.keys(a[seed]), ...Object.keys(b[seed] || {})])) { if (SKIP.has(k)) continue; const before = Object.keys(fam).length; walk(a[seed][k], b[seed]?.[k], k, seed, 1); } }
for (const [p, s] of Object.entries(fam)) for (const x of s) moved.add(x);
const skipMoved = new Set(); for (const seed of Object.keys(a)) for (const k of SKIP) if (JSON.stringify(a[seed][k]) !== JSON.stringify(b[seed]?.[k])) skipMoved.add(seed + ':' + k);
console.log(`towns moved ${moved.size} of ${Object.keys(a).length}; families ${Object.keys(fam).length}` + (skipMoved.size ? `; (also simulationTrace/receipt in ${new Set([...skipMoved].map((x) => x.split(':')[0])).size})` : ''));
for (const [p, s] of Object.entries(fam).sort((x, y) => y[1].size - x[1].size)) console.log(`${s.size}\t${p}`);
