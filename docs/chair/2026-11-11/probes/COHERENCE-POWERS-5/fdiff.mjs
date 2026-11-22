// fdiff.mjs <a.ndjson.gz> <b.ndjson.gz> — paired by seed: births that differ, and moved leaf paths by family (indices folded)
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const [A, B] = process.argv.slice(2);
const load = async (f) => { const m = new Map(); for await (const l of readline.createInterface({ input: fs.createReadStream(f).pipe(zlib.createGunzip()) })) { if (!l) continue; const r = JSON.parse(l); m.set(r.seed || r.key, r.s || r.rec); } return m; };
const leaves = (v, p, o) => { if (v && typeof v === 'object') { const ks = Object.keys(v); if (!ks.length) o[p] = JSON.stringify(v); for (const k of ks) leaves(v[k], p + (Array.isArray(v) ? `[${k}]` : `.${k}`), o); } else o[p] = v; return o; };
const a = await load(A), b = await load(B); const fam = {}; const ex = {}; let diff = 0;
for (const [k, x] of a) { const y = b.get(k); if (JSON.stringify(x) === JSON.stringify(y)) continue; diff++;
  const la = leaves(x, '', {}), lb = leaves(y, '', {}); const seen = new Set();
  for (const p of new Set([...Object.keys(la), ...Object.keys(lb)])) { if (la[p] === lb[p]) continue; const f = p.replace(/\[\d+\]/g, '[]'); const key = f.split(/\.|\[/).slice(0, 4).join('.');
    fam[f] ||= { n: 0, births: 0 }; fam[f].n++; if (!seen.has(f)) { seen.add(f); fam[f].births++; } (ex[f] ||= []).length < 2 && ex[f].push(`${k}: ${JSON.stringify(la[p])?.slice(0, 90)} -> ${JSON.stringify(lb[p])?.slice(0, 90)}`); } }
console.log('births', a.size, 'differ', diff);
for (const [f, v] of Object.entries(fam).sort((x, y) => y[1].n - x[1].n)) console.log(String(v.n).padStart(7), String(v.births).padStart(5), f, '|', ex[f][0]);
