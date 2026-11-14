import fs from 'node:fs'; import zlib from 'node:zlib';
const [tree, corpus] = process.argv.slice(2);
const { deriveMagicSupplyView } = await import(`${tree}/src/domain/display/dossierViewModel.js`);
const { magicSourceOf } = await import(`${tree}/src/domain/facts/magicSource.js`);
const { institutionDisplayName } = await import(`${tree}/src/domain/display/institutionDisplayName.js`);
const recs = zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n').filter(Boolean).map((l) => JSON.parse(l));
let lines = 0, paren = 0, twice = 0, long = 0; const parens = {}; const ex = [];
for (const { seed, s } of recs) {
  const v = deriveMagicSupplyView(s); if (!v.supply) continue; lines++;
  if (/\(/.test(v.supply)) { paren++; for (const m of v.supply.match(/[^,]*\([^)]*\)/g) || []) parens[m.trim().replace(/^and /, '')] = (parens[m.trim().replace(/^and /, '')] || 0) + 1; }
  if (v.supply.length > 280) long++;
  const names = magicSourceOf(s).houses.map((h) => institutionDisplayName(h).toLowerCase().replace(/\([^)]*\)/g, '').trim());
  if (new Set(names).size !== names.length) { twice++; if (ex.length < 3) ex.push(`${seed}: ${v.supply}`); }
}
console.log({ lines, paren, twice, long }); console.log(Object.entries(parens).sort((a, b) => b[1] - a[1]).slice(0, 25)); console.log(ex.join('\n'));
