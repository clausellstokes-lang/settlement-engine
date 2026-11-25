// VEIL-51 UNIT 5 (LEGACY-NAMES) step (1): per path, the stored strings that carry a hideable house's name (offline; no instrument
// edited): node paths.mjs <tree> <stored dir>. A house = an institution `isHideableHouse` holds; a string CARRIES it when the lane's
// fold (gallerySecondHomes.js :: buildNameSearch, case-blind, bare form) finds the house's name in it. Counts: documents and strings
// per path, and three examples each; plus, per path, how many persons' ONLY role names the house (unit 5 (2)'s question).
import { readFileSync, readdirSync } from 'node:fs';
const [, , TREE, DIR] = process.argv;
const { buildNameSearch } = await import(`${TREE}/src/domain/display/gallerySecondHomes.js`);
const { isHideableHouse } = await import(`${TREE}/src/domain/people/cardVeil.js`);
const arr = (v) => (Array.isArray(v) ? v : []);
const PATHS = {
  'relationships[].npc1Role': (d) => arr(d.relationships).map((r) => r?.npc1Role),
  'relationships[].npc2Role': (d) => arr(d.relationships).map((r) => r?.npc2Role),
  'npcs[].role': (d) => arr(d.npcs).map((n) => n?.role),
  'npcs[].secondaryAffiliation': (d) => arr(d.npcs).map((n) => n?.secondaryAffiliation),
  'factions[].members[].secondaryAffiliation': (d) => arr(d.factions).flatMap((f) => arr(f?.members).map((m) => m?.secondaryAffiliation)),
  'factions[].members[].role': (d) => arr(d.factions).flatMap((f) => arr(f?.members).map((m) => m?.role)),
  'factions[].members[].goal.short': (d) => arr(d.factions).flatMap((f) => arr(f?.members).map((m) => m?.goal?.short)),
};
const out = Object.fromEntries(Object.keys(PATHS).map((p) => [p, { docs: new Set(), strings: 0, ex: [] }]));
let docs = 0, withHouse = 0;
for (const f of readdirSync(DIR).filter((x) => /^r3m.*\.json$/.test(x)).sort()) {
  const d = JSON.parse(readFileSync(`${DIR}/${f}`, 'utf8')); docs += 1;
  // the names a hiding read can withhold: every hideable house, and every criminal power (power.entry withholds it with its house)
  const houses = [...arr(d.institutions).filter((h) => h && isHideableHouse(h)).map((h) => h.name), ...arr(d.powerStructure?.factions).filter((p) => p?.category === 'criminal').map((p) => p.faction)].filter(Boolean);
  if (!houses.length) continue; withHouse += 1;
  const search = buildNameSearch(houses, []);
  for (const [p, get] of Object.entries(PATHS)) for (const s of get(d)) {
    const text = typeof s === 'string' ? s : (s && typeof s === 'object' ? JSON.stringify(s) : null);
    if (!text || !search || !search.hit(text)) continue;
    out[p].docs.add(f); out[p].strings += 1; if (out[p].ex.length < 3) out[p].ex.push(`${f}: ${text.slice(0, 90)}`);
  }
}
console.log(`documents ${docs}; with a hideable house ${withHouse}`);
for (const [p, o] of Object.entries(out)) { console.log(`${p}: documents ${o.docs.size}, strings ${o.strings}`); for (const e of o.ex) console.log(`    ${e}`); }
