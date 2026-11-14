import fs from 'node:fs'; import zlib from 'node:zlib';
const [a, b, corpus] = process.argv.slice(2);
const A = await import(`${a}/src/domain/display/dossierViewModel.js`); const B = await import(`${b}/src/domain/display/dossierViewModel.js`);
const recs = zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n').filter(Boolean).map((l) => JSON.parse(l));
let lost = 0, changed = 0, same = 0; const ex = [];
for (const { seed, s } of recs) {
  const x = A.deriveMagicSupplyView(s), y = B.deriveMagicSupplyView(s);
  if (!x.supply && !y.supply && x.statable === y.statable) continue;
  if (x.statable && !y.statable) { lost++; ex.push(`LOST ${seed}: ${x.supply}`); continue; }
  if (x.supply === y.supply) same++; else { changed++; if (changed % 6 === 1 && ex.length < 30) ex.push(`${seed}:\n  was ${x.supply}\n  now ${y.supply}`); }
}
console.log({ lost, changed, same }); console.log(ex.join('\n'));
