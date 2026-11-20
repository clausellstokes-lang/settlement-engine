import fs from 'node:fs';
const r = JSON.parse(fs.readFileSync('census.json', 'utf8'));
const [, , size, minSeen = '0.15', minHolders = '15', limit = '60'] = process.argv;
const rows = r[size].filter((x) => x.holders >= +minHolders && x.seen >= +minSeen).sort((a, b) => b.seen - a.seen).slice(0, +limit);
console.log(`== ${size}: paths where a second place prints >= ${(+minSeen * 100).toFixed(0)}% of a place's sentences (holders >= ${minHolders} of 50): ${rows.length}`);
for (const x of rows) console.log(`${(x.seen * 100).toFixed(0).padStart(3)}% seen | top ${String(x.topN).padStart(2)}/${String(x.holders).padEnd(2)} | ${String(x.distinct).padStart(4)} distinct | ${String(x.perPlace).padStart(5)}/place | ${x.path}\n        "${x.top.slice(0, 118)}"`);
