// scope-at.mjs <tree> <births.ndjson.gz> <regex over line>: cultureScopeLine at <tree> over that tree's births; count/print matches.
import fs from 'node:fs'; import zlib from 'node:zlib';
const [tree, births, re] = process.argv.slice(2); const RX = new RegExp(re);
const { loadGenerationLawPayloads } = await import(tree + '/src/domain/density/densityCreateBoundary.js'); await loadGenerationLawPayloads();
const { cultureScopeLine } = await import(tree + '/src/domain/summary/settlementQuickGuide.js');
let n = 0, ex = [];
for (const l of zlib.gunzipSync(fs.readFileSync(births)).toString().split('\n')) { if (!l) continue; const { seed, s } = JSON.parse(l);
  let v; try { v = cultureScopeLine(s); } catch (e) { v = 'ERR ' + e.message; } v = typeof v === 'string' ? v : JSON.stringify(v);
  if (RX.test(v)) { n++; if (ex.length < 4) ex.push(seed + ' :: ' + v.slice(0, 200)); } }
console.log('matches', n); console.log(ex.join('\n'));
