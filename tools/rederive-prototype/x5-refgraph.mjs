/**
 * X5 — the held-facts reference graph: which record fields reference another held entity, and
 * BY WHAT (display name · id · positional index).
 *
 * Method: generate a city and a metropolis; collect every held entity (npc, power faction, npc
 * faction group, institution) with its name(s) and id; then walk the WHOLE record and classify
 * every string leaf that carries one of those names or ids, OUTSIDE the entity's own home entry.
 *   exact  = the leaf IS the name/id           → a JOIN KEY
 *   prose  = the name occurs inside a sentence → a MENTION
 * The declared rename surfaces (`domain/factionRename.js`) are printed beside the measurement.
 *
 * usage: node --import ./hook.mjs x5-refgraph.mjs
 */
import { instrumentedRoot, runHeadless, TREE } from './instrument.mjs';
import { keyOf, sample63 } from './lib.mjs';

const { NPC_RENAME_SURFACES, FACTION_RENAME_SURFACES, NON_CASCADED_SURFACES } = await import(`${TREE}/src/domain/factionRename.js`);

const collapse = (p) => p.replace(/\[\d+\]/g, '[]');
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function walkStrings(root) {
  const out = [];
  (function w(v, path) {
    if (v === null || v === undefined) return;
    if (typeof v === 'string') { out.push([path, v]); return; }
    if (typeof v !== 'object') return;
    if (Array.isArray(v)) { v.forEach((x, i) => w(x, `${path}[${i}]`)); return; }
    for (const [k, x] of Object.entries(v)) w(x, path ? `${path}.${k}` : k);
  })(root, '');
  return out;
}

const ROWS = [
  sample63().find(r => r.settType === 'city'),
  sample63().find(r => r.settType === 'metropolis'),
  sample63().find(r => r.settType === 'town'),
];

const agg = new Map(); // `${collapsedPath}|${kind}|${mode}` -> count
const seenExample = new Map();

for (const row of ROWS) {
  const rec = runHeadless(row, instrumentedRoot(row._seed).root).settlement;
  /** entity registry: [kind, token, tokenType, homePrefixes[]] */
  const ents = [];
  (rec.npcs || []).forEach((n, i) => {
    if (n?.name) ents.push(['npc', n.name, 'name', [`npcs[${i}]`]]);
    if (n?.id) ents.push(['npc', String(n.id), 'id', [`npcs[${i}]`]]);
  });
  (rec.powerStructure?.factions || []).forEach((f, i) => {
    for (const t of [f?.faction, f?.name]) if (t) ents.push(['powerFaction', t, 'name', [`powerStructure.factions[${i}]`]]);
    if (f?.id) ents.push(['powerFaction', String(f.id), 'id', [`powerStructure.factions[${i}]`]]);
  });
  (rec.factions || []).forEach((f, i) => {
    for (const t of [f?.name, f?.faction]) if (t) ents.push(['npcFactionGroup', t, 'name', [`factions[${i}]`]]);
  });
  (rec.institutions || []).forEach((n, i) => {
    if (n?.name) ents.push(['institution', n.name, 'name', [`institutions[${i}]`]]);
    if (n?.id) ents.push(['institution', String(n.id), 'id', [`institutions[${i}]`]]);
  });
  // de-dup tokens that belong to more than one home (a name shared by an npc and a faction)
  const leaves = walkStrings(rec);
  for (const [kind, token, tokenType, homes] of ents) {
    if (!token || token.length < 3) continue;
    const re = new RegExp(`(^|[^\\p{L}\\p{N}_])${esc(token)}($|[^\\p{L}\\p{N}_])`, 'u');
    for (const [path, value] of leaves) {
      if (homes.some(hp => path.startsWith(hp))) continue;
      let mode = null;
      if (value === token) mode = 'exact';
      else if (value.length > token.length && re.test(value)) mode = 'prose';
      if (!mode) continue;
      const id = `${collapse(path)}|${kind}|${tokenType}|${mode}`;
      agg.set(id, (agg.get(id) || 0) + 1);
      if (!seenExample.has(id)) seenExample.set(id, `${token.slice(0, 26)}`);
    }
  }
}

console.log('=== X5 — MEASURED reference graph (city + metropolis + town) ===');
console.log('referencing path\treferenced entity\tjoin key\tmode\toccurrences\texample');
const rows = [...agg.entries()].sort((a, b) => b[1] - a[1]);
for (const [id, n] of rows) {
  const [p, kind, tokenType, mode] = id.split('|');
  console.log(`${p}\t${kind}\t${tokenType}\t${mode}\t${n}\t${seenExample.get(id)}`);
}
console.log(`\ndistinct (path, entity kind, join key, mode) rows: ${rows.length}`);

const exactRows = rows.filter(([id]) => id.endsWith('|exact'));
console.log(`\n--- JOIN KEYS ONLY (mode=exact) : ${exactRows.length} rows ---`);
for (const [id, n] of exactRows) {
  const [p, kind, tokenType] = id.split('|');
  console.log(`  ${p.padEnd(52)} → ${kind} by ${tokenType}   (${n})`);
}
const byName = exactRows.filter(([id]) => id.split('|')[2] === 'name');
const byId = exactRows.filter(([id]) => id.split('|')[2] === 'id');
console.log(`\nexact joins BY DISPLAY NAME: ${byName.length} paths · BY ID: ${byId.length} paths`);

console.log('\n=== the estate\'s own DECLARED lists, for comparison ===');
console.log(`NPC_RENAME_SURFACES (${NPC_RENAME_SURFACES.length}):`);
for (const s of NPC_RENAME_SURFACES) console.log(`  ${s.kind}\t${s.path}`);
console.log(`FACTION_RENAME_SURFACES (${FACTION_RENAME_SURFACES.length}):`);
for (const s of FACTION_RENAME_SURFACES) console.log(`  ${s.kind}\t${s.path}`);
console.log(`NON_CASCADED_SURFACES (${NON_CASCADED_SURFACES.length}):`);
for (const s of NON_CASCADED_SURFACES) console.log(`  ${s.path}`);
console.log('\n⛔ NOTE: there is NO declared rename surface list for INSTITUTIONS.');
