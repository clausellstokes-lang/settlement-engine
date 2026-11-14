// fd14.mjs <dirA> <dirB> [max-examples]: per birth, leaf paths that differ (indices normalised); counts by path, births by path
import fs from 'node:fs'; import zlib from 'node:zlib';
const [A, B, MAX] = process.argv.slice(2);
const load = (d) => { const m = new Map(); for (const f of fs.readdirSync(d).filter((x) => x.endsWith('.ndjson.gz'))) for (const l of zlib.gunzipSync(fs.readFileSync(d + '/' + f)).toString().split('\n')) if (l) { const r = JSON.parse(l); m.set(r.key, r.s); } return m; };
const a = load(A), b = load(B);
const paths = new Map(), births = new Map(), ex = new Map(); let differ = 0;
function walk(x, y, p, out) {
  if (x === y) return;
  if (x && y && typeof x === 'object' && typeof y === 'object') { for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) walk(x[k], y[k], p + '.' + k, out); return; }
  out.push([p.replace(/\.\d+(?=\.|$)/g, '[]'), p, x, y]);
}
for (const [k, sa] of a) { const sb = b.get(k); const out = []; walk(sa, sb, 's', out); if (!out.length) continue; differ++;
  const seen = new Set(); for (const [np, p, x, y] of out) { paths.set(np, (paths.get(np) || 0) + 1); if (!seen.has(np)) { seen.add(np); births.set(np, (births.get(np) || 0) + 1); }
    if (!ex.has(np)) ex.set(np, []); if (ex.get(np).length < Number(MAX || 2)) ex.get(np).push(k + ' ' + p + ': ' + JSON.stringify(x)?.slice(0, 90) + ' -> ' + JSON.stringify(y)?.slice(0, 90)); } }
console.log('births', a.size, b.size, 'differ', differ);
for (const [np, n] of [...paths].sort((p, q) => q[1] - p[1])) { console.log(String(births.get(np)).padStart(4), 'births', String(n).padStart(5), 'leaves', np); for (const e of ex.get(np)) console.log('       ', e); }
