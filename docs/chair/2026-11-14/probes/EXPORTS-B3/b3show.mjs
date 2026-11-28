// node b3show.mjs <corpus> <tree> seed...: the slice's chain rows per town (status | processing | output), stress, size
import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus, T, ...seeds] = process.argv.slice(2); const want = new Set(seeds);
const { resourcesSlice } = await import(T + '/src/pdf/lib/viewModelBodySlices.js');
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if (!l) continue; const seed = l.slice(9, l.indexOf('"', 9)); if (!want.has(seed)) continue; const { s } = JSON.parse(l);
  const st = (Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : []).map((x) => x?.type).join(',') || '-';
  console.log(`## ${seed} ${s.tier} ${s.population} stress ${st}`);
  for (const r of resourcesSlice(s).chainRows) console.log(`   ${r.resource} | ${r.status} | ${r.processing ?? '—'} | ${r.output ?? '—'}`); }
