// the page's mark (crisisStoppedRow :: housesShortOfInput) against the one fact (housesShortOf), house by house
import fs from 'node:fs'; import zlib from 'node:zlib';
const T = process.argv[2];
const F = await import(T + '/src/domain/facts/houseInputAtHand.js');
const { housesShortOfInput } = await import(T + '/src/domain/display/crisisStoppedRow.js');
const d = {};
for (const f of process.argv.slice(3)) for (const l of zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n')) { const { seed, s } = JSON.parse(l);
  const a = F.housesShortOf(s), b = housesShortOfInput(s);
  for (const h of new Set([...a.keys(), ...b.keys()])) if (a.has(h) !== b.has(h)) (d[`${h}: fact ${a.get(h) ?? '-'} · page ${b.get(h) ?? '-'}`] ||= []).push(seed); }
let n = 0; for (const [k, v] of Object.entries(d)) { n += v.length; console.log(v.length, '|', k, '|', v.slice(0, 3).join(', ')); } console.log('disagreements', n);
