// node cmp-counts.mjs label=counts.json ... : every row, its total per label (and by size where they differ)
import { readFileSync } from 'node:fs';
const SZ = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const L = process.argv.slice(2).map((a) => { const [l, f] = a.split('='); return [l, JSON.parse(readFileSync(f, 'utf8')).counts]; });
const rows = []; for (const [, c] of L) for (const r of Object.keys(c)) if (!rows.includes(r)) rows.push(r);
const tot = (c, r) => (c[r] ? SZ.reduce((a, z) => a + (c[r][z] || 0), 0) : null);
console.log(['row', ...L.map(([l]) => l), 'by size (where any differ)'].join('\t'));
for (const r of rows) {
  const t = L.map(([, c]) => tot(c, r)); const by = L.map(([, c]) => SZ.map((z) => (c[r] ? c[r][z] || 0 : '-')).join('/'));
  console.log([r, ...t.map((x) => (x === null ? 'n/a' : x)), new Set(by).size > 1 ? by.join(' | ') : ''].join('\t'));
}
