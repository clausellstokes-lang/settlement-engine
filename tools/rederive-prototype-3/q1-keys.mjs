/**
 * Q1.a — enumerate the record's top-level keys, their shapes, and every field that
 * LOOKS like a digest of other fields (a receipt). Five tiers.
 * usage: node --import ./hook3.mjs q1-keys.mjs
 */
import { clone, keyOf, sample63 } from './lib.mjs';
import { generate } from './seam.mjs';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const recs = {};
for (const t of TIERS) {
  const row = sample63().find(r => r.settType === t);
  if (!row) { console.log(`no row for ${t}`); continue; }
  recs[t] = { row, rec: generate(row) };
}

const shapeOf = (v) => {
  if (v === null) return 'null';
  if (Array.isArray(v)) return `array[${v.length}]`;
  if (typeof v === 'object') return `object{${Object.keys(v).length}}`;
  return typeof v;
};

console.log('=== Q1.a — every top-level record key, by tier ===');
const allKeys = new Set();
for (const t of Object.keys(recs)) for (const k of Object.keys(recs[t].rec)) allKeys.add(k);
console.log(`total distinct top-level keys: ${allKeys.size}`);
console.log('key'.padEnd(32) + TIERS.map(t => t.slice(0, 9).padEnd(11)).join(''));
for (const k of [...allKeys].sort()) {
  console.log(k.padEnd(32) + TIERS.map(t => (recs[t] ? shapeOf(recs[t].rec[k]) : '-').padEnd(11)).join(''));
}

// ---- collections with a stable key: for every array of objects anywhere, which id-ish fields exist on ALL entries and are UNIQUE?
console.log('\n=== Q1.b — arrays of objects: candidate stable keys (present on every entry AND unique) ===');
const CANDS = ['id', 'name', 'type', 'key', 'npcId', 'institutionId', 'factionId', 'slug', 'category', 'targetId', 'label', 'title', 'pair', 'faction'];
const found = new Map(); // path -> {n, keys:Set, tiers:Set}
function walk(v, path, tier) {
  if (v === null || typeof v !== 'object') return;
  if (Array.isArray(v)) {
    const objs = v.filter(x => x !== null && typeof x === 'object' && !Array.isArray(x));
    if (objs.length === v.length && v.length > 0) {
      const ok = [];
      for (const c of CANDS) {
        if (!objs.every(o => o[c] !== undefined && o[c] !== null)) continue;
        const vals = objs.map(o => JSON.stringify(o[c]));
        if (new Set(vals).size === vals.length) ok.push(c);
      }
      const e = found.get(path) || { n: 0, keys: new Map(), tiers: new Set(), lens: [] };
      e.n += 1; e.tiers.add(tier); e.lens.push(v.length);
      for (const c of ok) e.keys.set(c, (e.keys.get(c) || 0) + 1);
      found.set(path, e);
    }
    v.forEach(x => walk(x, `${path}[]`, tier));
    return;
  }
  for (const [k, val] of Object.entries(v)) walk(val, path ? `${path}.${k}` : k, tier);
}
for (const t of Object.keys(recs)) walk(recs[t].rec, '', t);
const rows = [...found.entries()].sort((a, b) => a[0].localeCompare(b[0]));
for (const [p, e] of rows) {
  const uk = [...e.keys.entries()].filter(([, n]) => n === e.n).map(([k]) => k);
  console.log(`${p.padEnd(56)} seen=${String(e.n).padEnd(3)} lens=${e.lens.join(',').slice(0, 22).padEnd(24)} stableKeys=${uk.length ? uk.join(',') : '⛔ NONE'}`);
}

// ---- digest-like fields
console.log('\n=== Q1.c — digest-looking leaves (name matches fingerprint|hash|checksum|receipt|signature, or a long hex value) ===');
const dig = new Map();
function walk2(v, path, tier) {
  if (v === null) return;
  if (Array.isArray(v)) { v.forEach((x, i) => walk2(x, `${path}[]`, tier)); return; }
  if (typeof v === 'object') { for (const [k, val] of Object.entries(v)) walk2(val, path ? `${path}.${k}` : k, tier); return; }
  const nameHit = /fingerprint|hash|checksum|signature|digest/i.test(path);
  const valHit = typeof v === 'string' && /[0-9a-f]{8,}/.test(v);
  if (nameHit || valHit) {
    const e = dig.get(path) || { tiers: new Set(), sample: String(v).slice(0, 48) };
    e.tiers.add(tier); dig.set(path, e);
  }
}
for (const t of Object.keys(recs)) walk2(recs[t].rec, '', t);
for (const [p, e] of [...dig.entries()].sort()) console.log(`${p.padEnd(56)} tiers=${e.tiers.size} e.g. ${e.sample}`);
