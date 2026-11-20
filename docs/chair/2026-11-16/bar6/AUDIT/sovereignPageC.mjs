// BAR6-AUDIT-C · 6e on the page: which towns print a sovereign word, and what in the record supplies the sovereign.
//   node sovereignPageC.mjs <render-dir>   (V=1 lists the towns with one supplier or none)
import fs from 'node:fs'; import zlib from 'node:zlib';
const W = new URL('../../../../../tests/helpers/pageLaws/', import.meta.url).pathname; // the tree's own laws
const { readTownC, sentencesOfPage } = await import(W + 'pageC.mjs');
const { SOV_FACT } = await import(W + 'law6.mjs');
const dir = process.argv[2];
const SOV = /\b(the lord'?s?|a lord'?s (dues|directives|steward|reeve)|lord'?s (dues|directives|properties)|liege|overlords?|the crown|crown[- ](appointed|officers?|supply|contracts?|authority|requisition|officials?|pays|lands?)|noble oversight|in the name of the crown)\b/;
const recs = new Map(); for (const l of zlib.gunzipSync(fs.readFileSync(dir + '/corpus.ndjson.gz')).toString().split('\n')) if (l) { const o = JSON.parse(l); recs.set(o.seed, o.s); }
const why = new Map(); let towns = 0;
for (const [seed, rec] of recs) {
  const T = readTownC(fs.readFileSync(`${dir}/dumps/${seed}.txt`, 'utf8'), rec);
  const hits = sentencesOfPage(T).filter((x) => SOV.test(x.s)); if (!hits.length) continue; towns++;
  const ps = rec.powerStructure || {};
  const parts = { gov: [ps.governingName, ps.government && JSON.stringify(ps.government)].join(' '), factions: (ps.factions || []).map((f) => f.faction).join(' '), houses: T.houses.join(' '), npcs: (rec.npcs || []).flatMap((n) => [n?.role, n?.title]).join(' '), neigh: JSON.stringify(rec.neighborRelationship || ''), founding: JSON.stringify(rec.history?.founding || '') };
  const by = Object.entries(parts).filter(([, v]) => SOV_FACT.test(v)).map(([k, v]) => k + ':' + (v.match(SOV_FACT) || [''])[0]);
  const k = by.join(',') || 'NONE'; why.set(k, (why.get(k) || 0) + 1);
  if (process.env.V && by.length <= 1) console.log(seed, k, '|', hits[0].s.slice(0, 120));
}
console.log('towns with a sovereign word', towns); for (const [k, v] of [...why].sort((a, b) => b[1] - a[1]).slice(0, 25)) console.log(v, k);
