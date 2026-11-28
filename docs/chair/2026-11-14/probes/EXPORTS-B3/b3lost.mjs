// node b3lost.mjs <corpus> <baseTree> <tipTree>: row by row, what the cure took off: worked rows' houses and goods, unexploited rows' goods past two
import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus, B, T] = process.argv.slice(2);
const { resourcesSlice: rb } = await import(B + '/src/pdf/lib/viewModelBodySlices.js');
const { resourcesSlice: rt } = await import(T + '/src/pdf/lib/viewModelBodySlices.js');
const c = { workedHouses: [0, new Set()], workedGoods: [0, new Set()], unexpGoodsCut: [0, new Set()], unexpHousesChanged: [0, new Set()], rowsDiffer: [0, new Set()] };
const add = (k, seed) => { c[k][0]++; c[k][1].add(seed); };
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if (!l) continue; const { seed, s } = JSON.parse(l);
  const a = rb(s).chainRows, b = rt(s).chainRows; if (a.length !== b.length) add('rowsDiffer', seed);
  a.forEach((x, i) => { const y = b[i]; if (!y || y.resource !== x.resource || y.status !== x.status) { add('rowsDiffer', seed); return; }
    if (x.status !== 'unexploited') { if (x.processing) add('workedHouses', seed); if (x.output) add('workedGoods', seed); }
    else { if (x.output !== y.output) add('unexpGoodsCut', seed); if ((x.processing ? 'Needs: ' + x.processing : null) !== y.processing) add('unexpHousesChanged', seed); } }); }
for (const [k, [n, s]] of Object.entries(c)) console.log(k, 'rows', n, 'towns', s.size);
