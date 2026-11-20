// TRAD-5 unit 12 (2026-11-20): THE HOUSES THE POOLS NEED, for the security reader at the join.
// Every house a wording of the table needs or names: KEEPER_HOUSES by element and by act (RELIGIOUS_HOUSES and
// MARKET_PLACES are the table's own rows, known here by identity: the rows of `element.stars` and of `act.fair`), and
// every `needs` atom that reads a house (`institution: <kind>` through facts/institutions.js :: INSTITUTION_KIND_PATTERNS
// less ACCESS_ONLY, as hasInstitution reads it; `market` through facts/market.js :: isMarketInstitution). One row a house:
// its catalogue name, its id (institutionalCatalog.js :: catalogIdForName), the elements or slots that need it, and
// people/cardVeil.js :: isHideableHouse CALLED on the house as the catalogue births it (assembleInstitutions' shape:
// { category, name, ...the catalogue row, catalogId }), at every tier it stands at. With a pool, every born house of those
// ids is also read by isHideableHouse as born. A reader of the engine, never a writer into it.
// Usage: node houses.mjs <out.txt> [pool.ndjson]
import { readFileSync, writeFileSync } from 'node:fs';
import { institutionalCatalog, catalogIdForName } from '../../../../../../src/data/institutionalCatalog.js';
import { isHideableHouse } from '../../../../../../src/domain/people/cardVeil.js';
import { INSTITUTION_KIND_PATTERNS, ACCESS_ONLY } from '../../../../../../src/domain/facts/institutions.js';
import { isMarketInstitution } from '../../../../../../src/domain/facts/market.js';
import * as TABLE from '../../../../../../src/data/traditionDescriptionTable.js';

const [, , outFile, poolFile] = process.argv;
if (!outFile) throw new Error('usage: houses.mjs <out.txt> [pool.ndjson]');
const { KEEPER_HOUSES } = TABLE;

/** every catalogue row, at every tier: { tier, category, name, entry, id } */
const ROWS = [];
for (const [tier, shelves] of Object.entries(institutionalCatalog)) {
  for (const [category, group] of Object.entries(shelves)) for (const [name, entry] of Object.entries(group)) ROWS.push({ tier, category, name, entry, id: catalogIdForName(name) });
}
const born = (r) => ({ category: r.category, name: r.name, ...r.entry, catalogId: r.id });

/** id -> { needs: Set<string>, via: Set<string> } */
const want = new Map();
const add = (id, need, via) => { const o = want.get(id) || { needs: new Set(), via: new Set() }; o.needs.add(need); o.via.add(via); want.set(id, o); };
const religious = new Set(KEEPER_HOUSES.element.stars); const market = new Set(KEEPER_HOUSES.act.fair);
const viaOf = (row) => (religious.has(row) ? 'RELIGIOUS_HOUSES' : market.has(row) ? 'MARKET_PLACES' : 'KEEPER_HOUSES');
for (const [by, map] of Object.entries(KEEPER_HOUSES)) {
  for (const [key, rows] of Object.entries(map)) for (const row of rows) for (const id of row.ids) add(id, `keeper (${by} ${key}, a ${row.kind})`, viaOf(row));
}
// the needs atoms: every line of every exported pool of the table
const atoms = new Map(); // atom -> Set<pool key>
const walk = (v, path) => {
  if (Array.isArray(v)) { for (const l of v) if (l && typeof l === 'object' && Array.isArray(l.needs)) for (const a of l.needs) { if (!atoms.has(a)) atoms.set(a, new Set()); atoms.get(a).add(path); } return; }
  if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`);
};
for (const [k, v] of Object.entries(TABLE)) if (k !== 'KEEPER_HOUSES') walk(v, k);
const houseAtoms = []; const otherAtoms = [];
for (const [atom, pools] of atoms) {
  const m = /^institution:\s*(.+)$/.exec(atom);
  const reads = m ? (r) => !ACCESS_ONLY.test(r.name) && INSTITUTION_KIND_PATTERNS[m[1]]?.test(r.name) : atom === 'market' ? (r) => isMarketInstitution(born(r)) : null;
  if (!reads) { otherAtoms.push(`${atom} (${[...pools].join(', ')})`); continue; }
  houseAtoms.push(atom);
  for (const r of ROWS) if (reads(r)) add(r.id, `needs "${atom}" (${[...pools].join(', ')})`, 'needs atom');
}

const out = []; let hideable = 0; let missing = 0;
const rows = [...want].sort((a, b) => (a[0] < b[0] ? -1 : 1));
for (const [id, o] of rows) {
  const at = ROWS.filter((r) => r.id === id);
  if (!at.length) { missing++; out.push(`${id} | (no catalogue row holds this id) | ${[...o.needs].join('; ')} | via ${[...o.via].join(', ')} | isHideableHouse: not read (no house)`); continue; }
  const verdicts = at.map((r) => isHideableHouse(born(r)));
  const any = verdicts.some(Boolean); if (any) hideable++;
  const names = [...new Set(at.map((r) => r.name))]; const cats = [...new Set(at.map((r) => r.category))];
  out.push(`${names.join(' / ')} | ${id} | ${[...o.needs].join('; ')} | via ${[...o.via].join(', ')} | ${cats.join(', ')} at ${at.map((r) => r.tier).join(', ')} | isHideableHouse: ${any ? 'TRUE' : 'FALSE'}${verdicts.length > 1 ? ` (${verdicts.length} tiers read)` : ''}`);
}
const head = [`houses=${rows.length}; hideable=${hideable}; ids with no catalogue row=${missing}; atoms that read a house: ${houseAtoms.join(', ')}; atoms that read no house: ${otherAtoms.join('; ') || 'none'}`];
if (poolFile) {
  const ids = new Set(want.keys()); let n = 0; let t = 0; const trueRows = [];
  for (const line of readFileSync(poolFile, 'utf8').trim().split('\n')) {
    const town = JSON.parse(line);
    for (const i of town.institutions || []) {
      const id = i?.catalogId || catalogIdForName(i?.name); if (!ids.has(id)) continue;
      n++; if (isHideableHouse(i)) { t++; if (trueRows.length < 10) trueRows.push(`  ${town.name}: ${i.name}`); }
    }
  }
  head.push(`born check (${poolFile.split('/').slice(-2).join('/')}): houses of these ids born in the pool=${n}; isHideableHouse TRUE as born=${t}`, ...trueRows);
}
writeFileSync(outFile, `${[...head, '', 'name | catalogue id | needed by | via | catalogue shelf at tiers | verdict', ...out].join('\n')}\n`);
console.log(head.join('\n'));
