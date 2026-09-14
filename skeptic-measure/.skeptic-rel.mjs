import { readFileSync } from 'node:fs';
const j = JSON.parse(readFileSync('docs/content/wiring-census.json', 'utf8'));
const rel = j.relations;
console.log('relations shape:', Array.isArray(rel) ? 'array ' + rel.length : Object.keys(rel));
const rows = Array.isArray(rel) ? rel : (rel.rows || []);
console.log('rows', rows.length);
const bySource = {}, byDir = {}, byRelation = {};
for (const r of rows) { bySource[r.source] = (bySource[r.source] || 0) + 1; byDir[r.direction] = (byDir[r.direction] || 0) + 1; byRelation[r.relation] = (byRelation[r.relation] || 0) + 1; }
console.log('by source', bySource, '| by direction', byDir, '| by relation', byRelation);
console.log('sample', JSON.stringify(rows[0]), JSON.stringify(rows.find(r => r.source === 'b')), JSON.stringify(rows.find(r => r.source === 'c')));
const eps = new Set(); for (const r of rows) { eps.add(r.a); eps.add(r.b); }
console.log('distinct endpoints', eps.size);
console.log('customReachable:', JSON.stringify(j.customReachable).slice(0, 1500));
