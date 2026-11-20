// BIRTH-3: the Resources tab's gap lines and the house marks, base reader over base births against tip reader over tip births
//   node linediff.mjs <baseTree> <baseCorpus> <tipTree> <tipCorpus>
import fs from 'node:fs'; import zlib from 'node:zlib';
const [bt, bc, tt, tc] = process.argv.slice(2);
const load = (f) => new Map(zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map((l) => { const o = JSON.parse(l); return [o.seed, o.s]; }));
const VB = await import(bt + '/src/domain/display/validationOnPage.js'), VT = await import(tt + '/src/domain/display/validationOnPage.js');
const HB = await import(bt + '/src/domain/facts/houseInputAtHand.js'), HT = await import(tt + '/src/domain/facts/houseInputAtHand.js');
const B = load(bc), T = load(tc);
const shape = (l) => l.replace(/^No .+? reach(es)? the (.+)\.$/, 'No <good> reach(es) the $2.').replace(/^(The .+? is worked out: its own ground is depleted) \(.+\)\.$/, '$1 (<ground>).');
const add = {}, gone = {}, towns = { add: new Set(), gone: new Set() }; let fishPairB = 0, fishPairT = 0;
for (const [seed, t] of T) { const b = B.get(seed);
  const lb = new Set(VB.resourceGapLines(b).map((l) => l.impact)), lt = new Set(VT.resourceGapLines(t).map((l) => l.impact));
  for (const l of lt) if (!lb.has(l)) { const k = shape(l); add[k] = (add[k] || 0) + 1; towns.add.add(seed); }
  for (const l of lb) if (!lt.has(l)) { const k = shape(l); gone[k] = (gone[k] || 0) + 1; towns.gone.add(seed); }
  const fishImp = (s) => (s.economicState?.primaryImports || []).some((x) => /\bfish\b/i.test(String(x)));
  if (HB.housesShortOf(b).has('Fish market') && fishImp(b)) fishPairB++; if (HT.housesShortOf(t).has('Fish market') && fishImp(t)) fishPairT++;
}
const top = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, 14);
console.log(JSON.stringify({ townsAdded: towns.add.size, townsGone: towns.gone.size, added: top(add), gone: top(gone), fishMarketShortBesideFish: [fishPairB, fishPairT] }, null, 1));
