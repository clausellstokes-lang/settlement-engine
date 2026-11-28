// usage: node fielddiff.mjs <oldDir> <newDir>  -> per key, the moved field paths (array indices collapsed to [])
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const [a, b] = process.argv.slice(2);
const norm = (p) => p.replace(/\[\d+\]/g, '[]');
function walk(x, y, p, acc) {
  if (JSON.stringify(x) === JSON.stringify(y)) return;
  const ox = x && typeof x === 'object', oy = y && typeof y === 'object';
  if (ox && oy && Array.isArray(x) === Array.isArray(y)) {
    if (Array.isArray(x)) { const n = Math.max(x.length, y.length); for (let i = 0; i < n; i++) walk(x[i], y[i], `${p}[${i}]`, acc); }
    else { for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) walk(x[k], y[k], p ? `${p}.${k}` : k, acc); }
    return;
  }
  acc.add(norm(p));
}
const all = {};
for (const f of readdirSync(a).filter((f) => f.endsWith('.json') && !f.startsWith('_'))) {
  const acc = new Set();
  walk(JSON.parse(readFileSync(join(a, f), 'utf8')), JSON.parse(readFileSync(join(b, f), 'utf8')), '', acc);
  console.log(`== ${f.replace(/__/g, '|').replace(/\.json$/, '')} (${acc.size} paths)`);
  for (const p of [...acc].sort()) { console.log('  ' + p); all[p] = (all[p] || 0) + 1; }
}
console.log('== UNION (path: keys)');
for (const [p, n] of Object.entries(all).sort()) console.log(`  ${p}: ${n}`);
