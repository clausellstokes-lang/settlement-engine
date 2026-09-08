// X1 — THE PROJECTED JSON-LEAF EXTRACTOR.
// The two machine-projected homes hold a frozen JSON-ish tree
//   blockId -> { title, slots, pools: { poolKey: [ { angle, text, slots, audience } ] } }
// and only the "text" leaf is prose. The block id and the pool key are carried out
// because they are HASH INPUTS to drawVariant (renaming one re-rolls every draw),
// and because per-pool uniformity is measured on exactly this key.
// Usage: node x1-json-leaves.mjs <DOCK> <OUT.json>
import { readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const D = process.argv[2];
const OUT = process.argv[3];
const rows = [];

const HOMES = [
  ...readdirSync(path.join(D, 'src/data/dossierStateProse'))
    .filter((f) => f.endsWith('.generated.js'))
    .map((f) => ['R1', `src/data/dossierStateProse/${f}`]),
  ['R2', 'src/data/dossierCausalProse.generated.js'],
];

for (const [register, rel] of HOMES) {
  const ns = await import(path.join(D, rel));
  for (const exp of Object.values(ns)) {
    if (!exp || typeof exp !== 'object') continue;
    for (const [blockId, block] of Object.entries(exp)) {
      if (!block || typeof block !== 'object' || !block.pools) continue;
      for (const [poolKey, variants] of Object.entries(block.pools)) {
        if (!Array.isArray(variants)) continue;
        variants.forEach((v, i) => {
          if (!v || typeof v.text !== 'string') return;
          rows.push({
            register,
            file: rel,
            p: `${blockId}.pools["${poolKey}"][${i}]`,
            pool: `${blockId} :: ${poolKey}`,
            shape: /\{[a-z_][a-z_0-9]*\}/i.test(v.text) ? 'slot-string' : 'object-string',
            viaFn: 0,
            angle: v.angle || null,
            audience: v.audience || null,
            slots: Array.isArray(v.slots) ? v.slots.length : 0,
            text: v.text.replace(/\s+/g, ' ').trim(),
          });
        });
      }
    }
  }
}

writeFileSync(OUT, JSON.stringify(rows));
const byReg = {};
const byAngle = {};
for (const r of rows) { byReg[r.register] = (byReg[r.register] || 0) + 1; byAngle[r.angle] = (byAngle[r.angle] || 0) + 1; }
console.log('# json leaves:', rows.length, JSON.stringify(byReg));
console.log('# pools:', new Set(rows.map((r) => r.pool)).size, ' angles:', JSON.stringify(byAngle));
