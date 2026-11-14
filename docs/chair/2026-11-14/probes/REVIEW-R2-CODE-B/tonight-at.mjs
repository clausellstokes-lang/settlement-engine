// tonight-at.mjs <tree> <births.ndjson.gz> <seed,seed,...> <regex>: compose the Tonight sheet at <tree> for each seed from
// that tree's births and print every string leaf matching regex (path => value).
import fs from 'node:fs'; import zlib from 'node:zlib';
const [tree, births, seeds, re] = process.argv.slice(2); const want = new Set(seeds.split(',')); const RX = new RegExp(re);
const { loadGenerationLawPayloads } = await import(tree + '/src/domain/density/densityCreateBoundary.js'); await loadGenerationLawPayloads();
const { composeTonightSheet } = await import(tree + '/src/domain/summary/tonightSheet.js');
for (const l of zlib.gunzipSync(fs.readFileSync(births)).toString().split('\n')) { if (!l) continue; const { seed, s } = JSON.parse(l); if (!want.has(seed)) continue;
  const j = composeTonightSheet(s); console.log('##', seed);
  (function f(o, p) { if (typeof o === 'string') { if (RX.test(o)) console.log(p, '=>', o.slice(0, 240)); } else if (o && typeof o === 'object') for (const k in o) f(o[k], p + '.' + k); })(j, ''); }
