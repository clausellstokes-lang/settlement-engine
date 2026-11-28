// faction descs that differ between two births dirs (same seeds): count, by old-opening -> new-opening, examples
import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path';
const load = (d) => new Map(fs.readdirSync(d).filter((f) => f.endsWith('.gz')).flatMap((f) => zlib.gunzipSync(fs.readFileSync(path.join(d, f))).toString().trim().split('\n').map((l) => JSON.parse(l))).map((r) => [r.key, r]));
const A = load(process.argv[2]), B = load(process.argv[3]); const N = Number(process.argv[4] || 2);
const by = {}; let towns = new Set(), n = 0; const other = new Set();
for (const [k, a] of A) { const b = B.get(k);
  if (JSON.stringify(a.fp) !== JSON.stringify(b.fp)) for (const p of Object.keys({ ...a.fp, ...b.fp })) if (a.fp[p] !== b.fp[p]) other.add(p);
  a.factions.forEach((f, i) => { const g = b.factions[i]; if (f.d !== g.d) { n++; towns.add(k); const key = `${String(f.d).slice(0, 45)} -> ${String(g.d).slice(0, 60)}`; (by[key] ??= []).push(`${k} [${a.stress}] ${f.n} ${f.p} ${f.l}`); } }); }
console.log('descs moved', n, 'towns', towns.size, '| leaf paths moved:', [...other].join(', '));
for (const [k, v] of Object.entries(by).sort((x, y) => y[1].length - x[1].length)) console.log(v.length, k, '\n   ', v.slice(0, N).join(' | '));
