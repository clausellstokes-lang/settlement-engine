// PG: the plant's lines printed only on the plant (a reader printing from nothing), counted by tab and line (names stripped to a shape)
import { readFileSync } from 'node:fs';
const M = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const by = {}; const lost = {};
for (const t of M.towns) for (const [tab, v] of Object.entries(t.tabs)) {
  for (const l of v.onlyPlant) { const k = `${tab} | ${l.length > 120 ? l.slice(0, 120) + '…' : l}`; by[k] = (by[k] || 0) + 1; }
  for (const l of v.onlyPage) { const k = `${tab}`; lost[k] = (lost[k] || 0) + 1; }
}
console.log(`POOL ${M.pool} towns ${M.towns.length}`);
console.log('PRINTED ONLY ON THE PLANT (top 40):'); for (const [k, n] of Object.entries(by).sort((a, b) => b[1] - a[1]).slice(0, 40)) console.log(`  ${n}\t${k}`);
console.log('lines the plant drops, by tab:', JSON.stringify(lost));
