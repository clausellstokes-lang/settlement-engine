// node fielddiff.mjs <corpusA> <corpusB>: the record's field diff, town by town (top-level families that differ, counted); 0 = display only
import fs from 'node:fs'; import zlib from 'node:zlib';
const load = (p) => new Map(zlib.gunzipSync(fs.readFileSync(p)).toString().split('\n').filter(Boolean).map((l) => { const o = JSON.parse(l); return [o.seed, o.s]; }));
const A = load(process.argv[2]), B = load(process.argv[3]); const fam = {}; let towns = 0;
for (const [seed, a] of A) { const b = B.get(seed); if (!b) { fam['(missing)'] = (fam['(missing)'] || 0) + 1; continue; } let d = false;
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) { fam[k] = (fam[k] || 0) + 1; d = true; }
  if (d) towns++; }
console.log(`towns ${A.size} vs ${B.size}; towns whose record differs: ${towns}; families: ${JSON.stringify(fam)}`);
