// REVIEW-POWERS-5 fd5.mjs — BASE=<corpus.ndjson.gz> TIP=<corpus.ndjson.gz> OUT=<file.json> node fd5.mjs
// A whole-record field diff of two corpora of the same seeds: every leaf path that differs (array indices folded to []),
// with the towns it moved in and examples. Keys added or removed are listed as +key / -key. Reads only.
import fs from 'node:fs'; import zlib from 'node:zlib';
const load = (f) => new Map(zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map((l) => { const r = JSON.parse(l); return [r.seed, r.s]; }));
const B = load(process.env.BASE), T = load(process.env.TIP);
const C = {}; const towns = new Set();
const hit = (p, seed, a, b) => { const c = (C[p] ||= { towns: new Set(), n: 0, ex: [] }); c.towns.add(seed); towns.add(seed); c.n++; if (c.ex.length < 8) c.ex.push(`${seed}: ${JSON.stringify(a)?.slice(0, 160)} -> ${JSON.stringify(b)?.slice(0, 160)}`); };
const walk = (a, b, p, seed) => {
  if (a === b) return;
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    if (Array.isArray(a) !== Array.isArray(b)) return hit(p, seed, a, b);
    if (Array.isArray(a)) { if (a.length !== b.length) hit(p + '.length', seed, a.length, b.length); const n = Math.min(a.length, b.length); for (let i = 0; i < n; i++) walk(a[i], b[i], p + '[]', seed); return; }
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      if (!(k in a)) { hit('+key ' + p + '.' + k, seed, undefined, b[k]); continue; }
      if (!(k in b)) { hit('-key ' + p + '.' + k, seed, a[k], undefined); continue; }
      walk(a[k], b[k], p + '.' + k, seed);
    }
    return;
  }
  if (Number.isNaN(a) && Number.isNaN(b)) return;
  hit(p, seed, a, b);
};
for (const [seed, t] of T) { const b = B.get(seed); if (!b) { hit('_missing_in_base', seed); continue; } walk(b, t, '', seed); }
const rows = Object.entries(C).map(([p, c]) => ({ path: p, towns: c.towns.size, n: c.n, ex: c.ex })).sort((x, y) => y.towns - x.towns);
fs.writeFileSync(process.env.OUT, JSON.stringify({ seeds: T.size, townsMoved: [...towns], rows }, null, 1));
console.log('seeds', T.size, 'towns moved', towns.size, 'paths', rows.length);
for (const r of rows.slice(0, 60)) console.log(r.towns, r.n, r.path);
