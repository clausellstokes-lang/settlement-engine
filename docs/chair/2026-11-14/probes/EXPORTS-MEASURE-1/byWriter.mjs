// node byWriter.mjs <out> <file-substring>[::fn-substring] [tierSplit]: the census's hits of one writer: towns, by surface, kind, tier; the distinct lines (first 70 chars) with towns
import fs from 'node:fs';
const [out, w] = process.argv.slice(2); const [file, fn] = w.split('::');
const hits = JSON.parse(fs.readFileSync(out + '/hits.json', 'utf8')).filter((h) => h.writer && String(h.writer.file).includes(file) && (!fn || String(h.writer.fn || h.writer.function || '').includes(fn)));
const t = new Set(hits.map((h) => h.seed)); const by = (k) => { const m = {}; for (const h of hits) (m[h[k]] ||= new Set()).add(h.seed); return Object.fromEntries(Object.entries(m).map(([a, b]) => [a, b.size])); };
const tier = (s) => s.replace(/^r2[rs]-([a-z_]+-)?/, '').replace(/-\d+$/, '').replace(/^.*-/, '');
const tm = {}; for (const s of t) tm[tier(s)] = (tm[tier(s)] || 0) + 1;
console.log('towns', t.size, 'surface', JSON.stringify(by('surface')), 'kind', JSON.stringify(by('pattern')), 'tier', JSON.stringify(tm));
const L = {}; for (const h of hits) (L[h.line.slice(0, 80)] ||= new Set()).add(h.seed);
for (const [l, s] of Object.entries(L).sort((a, b) => b[1].size - a[1].size).slice(0, +(process.env.N || 8))) console.log(s.size, l);
if (process.env.TOWNS) fs.writeFileSync(process.env.TOWNS, JSON.stringify([...t]));
