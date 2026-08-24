/**
 * probeTyping.mjs — REG-3 STEP 1. WHAT TYPING DATA DOES THE FABRIC CARRY?
 * Not a guess and not a read: build every exemplar leaf and enumerate the KEYS and the
 * VALUE DOMAINS on every drawable population. A shape family may only key on a field this
 * probe proves exists, with the coverage it prints.
 */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '../..');
const { CORPUS, buildLeaf } = await import(join(ROOT, 'harness/laneREG3/leaf.mjs'));

const only = (process.argv.find((a) => a.startsWith('--leaves=')) || '').slice(9);
const leaves = only ? only.split(',') : CORPUS.map((c) => c.key);

/** value-domain accumulator */
const acc = new Map();
function note(pop, key, val) {
  const k = `${pop}.${key}`;
  if (!acc.has(k)) acc.set(k, { n: 0, present: 0, vals: new Map(), type: new Set() });
  const a = acc.get(k);
  a.n++;
  if (val === undefined || val === null) return;
  a.present++;
  const t = Array.isArray(val) ? 'array' : typeof val;
  a.type.add(t);
  if (t === 'string' || t === 'number' || t === 'boolean') {
    const s = String(val);
    if (a.vals.size < 40) a.vals.set(s, (a.vals.get(s) || 0) + 1);
    else if (a.vals.has(s)) a.vals.set(s, a.vals.get(s) + 1);
  }
}
function sweep(pop, arr) {
  if (!Array.isArray(arr)) return;
  const keys = new Set();
  for (const o of arr) if (o && typeof o === 'object') for (const k of Object.keys(o)) keys.add(k);
  for (const o of arr) { if (!o || typeof o !== 'object') continue; for (const k of keys) note(pop, k, o[k]); }
}

const perLeaf = [];
for (const key of leaves) {
  const { fabric, model } = await buildLeaf(key);
  sweep('parcel', fabric.parcels);
  sweep('landmark', fabric.landmarks);
  sweep('organism', fabric.organisms);
  sweep('block', fabric.blocks);
  sweep('habitation', fabric.habitation);
  sweep('faubourgBuilding', fabric.faubourgs && fabric.faubourgs.buildings);
  sweep('lodMass', fabric.lod && fabric.lod.masses);
  sweep('fusedMass', fabric.fusion && fabric.fusion.masses);
  perLeaf.push({
    key,
    parcels: (fabric.parcels || []).length,
    landmarks: (fabric.landmarks || []).length,
    monumental: (fabric.landmarks || []).filter((l) => l.monumental).length,
    organisms: (fabric.organisms || []).length,
    blocks: (fabric.blocks || []).length,
    habitation: (fabric.habitation || []).length,
    faub: ((fabric.faubourgs && fabric.faubourgs.buildings) || []).length,
    tier: model.tier || (model.settlement && model.settlement.settlementType),
  });
}

console.log('=== PER-LEAF POPULATIONS ===');
console.log(['leaf', 'tier', 'parcels', 'landmarks', 'monum', 'orgs', 'blocks', 'habit', 'faub'].join('\t'));
for (const r of perLeaf) console.log([r.key, r.tier, r.parcels, r.landmarks, r.monumental, r.organisms, r.blocks, r.habitation, r.faub].join('\t'));

console.log('\n=== FIELD INVENTORY (population.field | n | present | coverage | types | top values) ===');
const rows = [...acc.entries()].sort();
for (const [k, a] of rows) {
  const top = [...a.vals.entries()].sort((x, y) => y[1] - x[1]).slice(0, 8)
    .map(([v, c]) => `${v}×${c}`).join(' ');
  console.log(`${k}\t${a.n}\t${a.present}\t${(a.present / a.n * 100).toFixed(1)}%\t${[...a.type].join('|')}\t${top}`);
}
