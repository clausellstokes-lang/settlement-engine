// R3-TELL-5 unit (ii) step 0's reading (VEIL-31's builder): node step0-an.mjs <step0 dir> [towns,...]
// (1) THE SEARCH: every `allegiance` key served at a path but npcs[i].allegiance (a hit is a STOP), and the person copies seen.
// (2) THE ROWS: per institution tag of availableServices.criminal, the pages that serve it (controls: births with nothing
//     hidden; hidden: the 92), and for each named town its served rows per page group.
import { readFileSync } from 'node:fs';
const dir = process.argv[2]; const only = new Set((process.argv[3] || '').split(',').filter(Boolean));
const births = [0, 1, 2, 3].flatMap((s) => JSON.parse(readFileSync(`${dir}/step0-shard${s}.json`, 'utf8')).births);
const hits = births.flatMap((b) => b.hits.map((h) => `${b.seed} ${h}`));
const cp = births.reduce((a, b) => ({ members: a.members + b.copies.members, psMembers: a.psMembers + b.copies.psMembers, relEnds: a.relEnds + b.copies.relEnds }), { members: 0, psMembers: 0, relEnds: 0 });
console.log(`STEP 0 (1) THE SEARCH: births ${births.length} (hidden ${births.filter((b) => b.hidden.length).length}), pages ${births.reduce((a, b) => a + Object.keys(b.pages).length, 0)}; allegiance keys outside npcs[i].allegiance: ${hits.length}${hits.length ? ' STOP' : ''}`);
for (const h of hits.slice(0, 40)) console.log(`  HIT ${h}`);
console.log(`  person copies served (summed over pages): factions[].members[] ${cp.members}, powerStructure.factions[].members[] ${cp.psMembers}, object-valued relation ends ${cp.relEnds}`);
const tagOf = (row) => { const [, inst, served] = row.split('|'); return served === '1' ? '<a served house>' : inst; };
const tally = (hid) => { const m = new Map();
  for (const b of births.filter((x) => (hid ? x.hidden.length : !x.hidden.length))) {
    const seen = new Set(); for (const [k, p] of Object.entries(b.pages)) if (k.startsWith('twin:')) for (const r of p.svc) seen.add(`${b.size}|${tagOf(r)}`);
    for (const s of seen) m.set(s, (m.get(s) || 0) + 1); }
  return [...m.entries()].sort(); };
console.log('STEP 0 (2) THE CRIMINAL SERVICES BY TAG (births serving it on some twin page): controls');
for (const [k, n] of tally(false)) console.log(`  ${k} ${n}`);
console.log('  hidden-house towns:');
for (const [k, n] of tally(true)) console.log(`  ${k} ${n}`);
for (const b of births.filter((x) => only.has(x.seed))) {
  console.log(`TOWN ${b.seed} (${b.size}, ${b.crisis}) hidden ${JSON.stringify(b.hidden)}; stored svc ${JSON.stringify(b.stored.svc)} ops ${JSON.stringify(b.stored.ops)} types ${JSON.stringify(b.stored.types)}`);
  const groups = new Map();
  for (const [k, p] of Object.entries(b.pages)) { const v = JSON.stringify({ svc: p.svc, ops: p.ops, types: p.types, houses: p.houses }); (groups.get(v) || groups.set(v, []).get(v)).push(k); }
  for (const [v, ks] of groups) console.log(`  ${ks.length} pages [${ks.slice(0, 4).join(' ')}${ks.length > 4 ? ' ...' : ''}]: ${v}`);
}
