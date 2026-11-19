// W2-C-LEAVES-9: the 720-birth field diff by family (the record's top-level key). node fdiff9.mjs <base.ndjson.gz> <tip.ndjson.gz>
import fs from 'node:fs'; import zlib from 'node:zlib';
const rd = (f) => new Map(zlib.gunzipSync(fs.readFileSync(f)).toString().split('\n').filter(Boolean).map((l) => { const r = JSON.parse(l); return [r.seed, r.s]; }));
const a = rd(process.argv[2]), b = rd(process.argv[3]); const fam = {}; let moved = 0;
for (const [seed, x] of a) { const y = b.get(seed); if (!y) continue; let any = false;
  for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) if (JSON.stringify(x[k]) !== JSON.stringify(y[k])) { fam[k] = (fam[k] || 0) + 1; any = true; }
  if (any) moved++; }
console.log('births', a.size, b.size, 'moved', moved); for (const [k, n] of Object.entries(fam).sort((p, q) => q[1] - p[1])) console.log(k, n);
