import { readFileSync } from 'node:fs';
import { CIVIC_OBJECT_CLASSES, isCovertPath } from './src/domain/prose/wiringCensus.js';
const j = JSON.parse(readFileSync('docs/content/wiring-census.json', 'utf8'));
console.log('classes', Object.keys(CIVIC_OBJECT_CLASSES).length, Object.keys(CIVIC_OBJECT_CLASSES).join(','));
console.log('objectClass named on', j.rows.filter(r => r.objectClass).length, 'of', j.rows.length);
let amb = 0; const ex = [];
for (const r of j.rows) {
  const words = new Set(String(r.pool).toLowerCase().split(/[^a-z]+/).filter(Boolean));
  const hits = Object.entries(CIVIC_OBJECT_CLASSES).filter(([, t]) => t.some(x => words.has(x))).map(([k]) => k);
  if (hits.length > 1) { amb++; if (ex.length < 12) ex.push(`${r.block} :: ${r.pool.slice(0, 52)} -> ${hits.join('/')} chosen=${r.objectClass}`); }
}
console.log('pool keys matching MORE THAN ONE class (first-wins):', amb);
ex.forEach(e => console.log('   ', e));
console.log('--- covert rows ---');
j.rows.filter(r => r.covert).forEach(r => console.log('   ', r.block, '::', r.pool, '| reads', JSON.stringify(r.reads)));
const cov = new Set();
for (const r of j.rows) for (const f of (r.reads || [])) if (isCovertPath(f)) cov.add(f);
console.log('distinct covert read paths:', [...cov].join(' · '));
