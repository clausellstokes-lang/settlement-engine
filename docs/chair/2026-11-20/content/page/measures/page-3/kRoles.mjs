// K1's role enumeration: every pool role (poolMap.js) and every role printed by the given k300 censuses,
// banded by the BASE rule (a copy of 6b82c8e4a's powerBandOfRole) and by the tree's own powerBandOfRole.
// usage: node kRoles.mjs <tree> [k300.json ...]
import { readFileSync } from 'node:fs';
const [, , L, ...censuses] = process.argv;
const { powerBandOfRole } = await import(`${L}/src/generators/npcGenerator.js`);
const pm = await import(`${L}/src/generators/people/poolMap.js`);
const H = ['mayor', 'lord', 'governor', 'bishop', 'archmage', 'guild_master', 'captain', 'commander', 'crime lord'];
const M = ['council_member', 'priest', 'wealthy_merchant', 'wizard', 'knight', 'magister', 'sergeant'];
const oldBand = (role) => { const r = String(role || '').toLowerCase(); return H.some((k) => r.includes(k)) ? 'high' : M.some((k) => r.includes(k)) ? 'moderate' : 'low'; };
const roles = new Map(); const add = (r, src) => { if (!roles.has(r)) roles.set(r, new Set()); roles.get(r).add(src); };
for (const row of Object.values(pm.POOL_BY_TITLE)) add(row[0], 'POOL_BY_TITLE');
for (const row of Object.values(pm.POOL_BY_SHELF)) add(row[0], 'POOL_BY_SHELF');
for (const r of Object.values(pm.SEAT_ROLE_BY_TIER)) add(r, 'SEAT_ROLE_BY_TIER');
add('Local Figure', 'ANY_HOUSE'); add('Guild Master', 'filterByGuild');
const cards = new Map();
for (const f of censuses) for (const t of JSON.parse(readFileSync(f, 'utf8'))) for (const c of t.cards) { add(c.role, 'printed'); cards.set(c.role, (cards.get(c.role) || 0) + 1); }
console.log(`roles: ${roles.size} (pool ${[...roles.values()].filter((s) => [...s].some((x) => x !== 'printed')).length}, printed ${[...roles.values()].filter((s) => s.has('printed')).length})`);
const moved = [...roles.keys()].filter((r) => oldBand(r) !== powerBandOfRole(r));
console.log(`roles whose band moves: ${moved.length}`);
for (const r of moved) console.log(`  ${r}: ${oldBand(r)} -> ${powerBandOfRole(r)} (${[...roles.get(r)].join(', ')}; printed cards ${cards.get(r) || 0}${censuses.length > 1 ? ` over ${censuses.length} censuses` : ''})`);
