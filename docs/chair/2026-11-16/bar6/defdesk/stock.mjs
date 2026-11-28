// stock.mjs <G.json> <file-substr>... : lines of my files in the true stock (a class with status any|colour|other|none)
import fs from 'node:fs';
const [f, ...files] = process.argv.slice(2);
const j = JSON.parse(fs.readFileSync(f, 'utf8'));
const STOCK = new Set(['any', 'colour', 'other', 'none']);
const by = {}; let n = 0; const rows = [];
for (const x of j) {
  if (!files.some((s) => x.file.includes(s))) continue;
  const cls = Object.entries(x.status || {}).filter(([, v]) => STOCK.has(v)).map(([k, v]) => `${k}:${v}`);
  if (!cls.length) continue;
  n++; by[x.file] = (by[x.file] || 0) + 1; rows.push(`${x.pool} | ${cls.join(',')} | ${x.text.slice(0, 120)}`);
}
console.log('STOCK', n, JSON.stringify(by));
if (process.env.LIST) for (const r of rows) console.log(r);
