import { readFileSync } from 'node:fs';
import { CUSTOM_CONTENT_MANIFEST } from './src/domain/content/customContentManifest.js';
const j = JSON.parse(readFileSync('docs/content/wiring-census.json', 'utf8'));
const cr = j.customReachable;
const byVia = {};
for (const r of cr.rows) byVia[r.via] = (byVia[r.via] || 0) + 1;
console.log('customReachable hit rows', cr.rows.length, 'by via', byVia);
console.log('distinct (block,pool) pairs', new Set(cr.rows.map(r => r.block + '::' + r.pool)).size);
console.log('byKind', JSON.stringify(cr.byKind));
const on = {}; for (const r of cr.rows) on[r.on] = (on[r.on] || 0) + 1;
console.log('matched tokens', JSON.stringify(on));
const cats = CUSTOM_CONTENT_MANIFEST.categories;
console.log('manifest categories', cats.length, cats.map(c => c.key + (c.authorable === false ? '(NOT authorable)' : '')).join(' · '));
for (const c of cats) {
  const mech = (c.fields || []).filter(f => f.effect === 'mechanical');
  console.log('  ', c.key, '| fields', (c.fields || []).length, '| mechanical', mech.length, '| enum values', mech.flatMap(f => f.values || []).length, '|', mech.map(f => f.key).join(','));
}
