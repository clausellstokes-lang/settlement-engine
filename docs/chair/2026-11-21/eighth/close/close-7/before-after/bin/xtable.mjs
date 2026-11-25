import { readFileSync } from 'node:fs';
const O = process.argv[2]; const c = process.argv[3];
const L = [['LINE', 'line-C-by-line'], ['LINE (CURES rows)', 'line-C-by-cures'], ['LINE (BATCH rows)', 'line-C-by-batch'], ['CURES', 'cures-C-by-cures'], ['CURES (BATCH rows)', 'cures-C-by-batch'], ['BATCH', 'batch-C-by-batch']]
  .map(([l, f]) => [l, JSON.parse(readFileSync(`${O}/xcount/${f.replace(/-C-/g, `-${c}-`)}.json`, 'utf8'))]);
const all = L[5][1].rowsKnown;
console.log(['row', ...L.map(([l]) => l)].join(' | '));
for (const r of all) console.log([r, ...L.map(([, x]) => (x.rowsKnown.includes(r) ? Object.values(x.counts[r] || {}).reduce((a, b) => a + b, 0) : 'n/a'))].join(' | '));
