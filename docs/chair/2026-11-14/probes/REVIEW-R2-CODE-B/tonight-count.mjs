// tonight-count.mjs <tree> <births.ndjson.gz> <regex>...: compose the Tonight sheet at <tree> for every town; per regex, the towns whose sheet JSON matches.
import fs from 'node:fs'; import zlib from 'node:zlib';
const [tree, births, ...res] = process.argv.slice(2); const RX = res.map((r) => new RegExp(r));
const { loadGenerationLawPayloads } = await import(tree + '/src/domain/density/densityCreateBoundary.js'); await loadGenerationLawPayloads();
const { composeTonightSheet } = await import(tree + '/src/domain/summary/tonightSheet.js');
const hit = RX.map(() => []);
for (const l of zlib.gunzipSync(fs.readFileSync(births)).toString().split('\n')) { if (!l) continue; const { seed, s } = JSON.parse(l);
  const j = JSON.stringify(composeTonightSheet(s)); RX.forEach((r, i) => { if (r.test(j)) hit[i].push(seed); }); }
res.forEach((r, i) => console.log(hit[i].length + '\t' + r + '\t' + hit[i].slice(0, 5).join(' ')));
fs.writeFileSync(process.env.LIST || '/dev/null', JSON.stringify(Object.fromEntries(res.map((r, i) => [r, hit[i]]))));
