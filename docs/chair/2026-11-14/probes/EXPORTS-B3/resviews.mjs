// node resviews.mjs <hits.json> [n]: kind-a hits in the Resources views of the PDF and the journal: towns, by view, and n sample lines
import fs from 'node:fs';
const [p, n = '0'] = process.argv.slice(2); const h = JSON.parse(fs.readFileSync(p, 'utf8'));
const R = (v) => /^PDF\/ResourcesProduction|^Journal\/Resources & Production/.test(v);
const a = h.filter((x) => x.pattern === 'a' && R(x.view)); const towns = new Set(a.map((x) => x.seed)); const byView = {};
for (const x of a) (byView[x.view] ||= new Set()).add(x.seed);
console.log('kind a, Resources views: towns', towns.size, 'hits', a.length, Object.fromEntries(Object.entries(byView).map(([k, v]) => [k, v.size])));
const lines = {}; for (const x of a) { const k = x.norm || x.line; (lines[k] ||= new Set()).add(x.seed); }
Object.entries(lines).sort((x, y) => y[1].size - x[1].size).slice(0, +n).forEach(([l, s]) => console.log(s.size, '|', l.slice(0, 170), '|', [...s].slice(0, 2).join(' ')));
