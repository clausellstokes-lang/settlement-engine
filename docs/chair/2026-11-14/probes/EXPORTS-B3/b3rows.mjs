// node b3rows.mjs <corpus> <tree>: rows by status; partial rows whose printed processing/output non-null; unexploited rows with houses
import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus, T] = process.argv.slice(2);
const { resourcesSlice } = await import(T + '/src/pdf/lib/viewModelBodySlices.js');
const n = {}; const towns = {}; const add = (k, seed) => { n[k] = (n[k] || 0) + 1; (towns[k] ||= new Set()).add(seed); };
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if (!l) continue; const { seed, s } = JSON.parse(l);
  for (const r of resourcesSlice(s).chainRows) { add('rows:' + r.status, seed); if (r.processing) add('proc:' + r.status, seed); if (r.output) add('out:' + r.status, seed);
    if (r.processing && /^Needs: /.test(r.processing)) add('needsLabel', seed); } }
for (const k of Object.keys(n).sort()) console.log(k, 'rows', n[k], 'towns', towns[k].size);
