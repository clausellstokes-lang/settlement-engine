// node item2.mjs <out>: the census's Item 2 table re-taken from <out>/hits.json: towns of the corpus by kind, any surface and each surface; distinct lines
import fs from 'node:fs';
const hits = JSON.parse(fs.readFileSync(process.argv[2] + '/hits.json', 'utf8'));
const K = {}; for (const h of hits) { const k = (K[h.pattern] ||= { any: new Set(), tab: new Set(), tonight: new Set(), pdf: new Set(), journal: new Set(), lines: new Set() });
  k.any.add(h.seed); k[h.surface]?.add(h.seed); k.lines.add(h.norm); }
const order = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', ...Object.keys(K).filter((k) => /^L/.test(k)).sort((x, y) => +x.slice(1) - +y.slice(1))];
console.log('| kind | any | tabs | Tonight | PDF | journal | distinct lines |'); console.log('|---|---|---|---|---|---|---|');
for (const k of order) { const v = K[k]; if (!v) { console.log(`| ${k} | 0 | 0 | 0 | 0 | 0 | 0 |`); continue; } console.log(`| ${k} | ${v.any.size} | ${v.tab.size} | ${v.tonight.size} | ${v.pdf.size} | ${v.journal.size} | ${v.lines.size} |`); }
