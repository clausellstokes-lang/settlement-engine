// b-plant.mjs — R4I-SQL-2's second cure (ADDENDUM 2, N106), proof (b): THE PLANT. Run from the worktree root:
//   PGHOST=/var/tmp/rv7 PGUSER=postgres node docs/chair/2026-11-20/veil/out/v42/sql2/b-plant.mjs <db>
// A record whose powers carry NO `power` (both lists: powerStructure.factions[] and master's top-level factions[]), a criminal
// house hidden whole (absent from the served document, present in `pub`), so the roster choice withholds the criminal power from
// both lists (VR42: the governing one stays). Asked of 212 :: _gallery_veil_roster_choices(doc, pub) directly (the function the
// cure touches; no salt, no re-key) and of the twin galleryRosterChoices.js :: applyRosterChoices on the same inputs:
//   (1) the server adds NO `power` to any served entry of either list (the first guard: top-level; the second: powerStructure);
//   (2) the server's two lists equal the twin's, byte for byte;
//   (3) THE CONTROL: the same record with every entry carrying a JSON number `power`: the server re-derives the shares to 100
//       on both lists (the guards still let a share set through), and equals the twin.
// Prints one line per case and exits 1 on any finding.
import pg from 'pg';
import { applyRosterChoices } from '../../../../../../../src/domain/display/galleryRosterChoices.js';
import { CARD_KINDS } from '../../../../../../../src/domain/display/galleryVeil.js';

const db = process.argv[2];
const clone = (v) => JSON.parse(JSON.stringify(v));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const canon = (v) => JSON.stringify(v, (_k, x) => (isRec(x) ? Object.fromEntries(Object.keys(x).sort().map((k) => [k, x[k]])) : x));
const HOUSES = [{ id: 'inst_den', name: 'Gambling Den', category: 'criminal' }, { id: 'inst_hall', name: 'Town Hall', category: 'government' }];
const PUB = {
  name: 'Plantwell', tier: 'town', institutions: HOUSES,
  powerStructure: { factions: [{ faction: 'Town Council', category: 'government', isGoverning: true }, { faction: 'The Den Crew', category: 'criminal' }, { faction: 'Merchants', category: 'economic' }] },
  factions: [{ name: 'Town Council', dominantCategory: 'government', isGoverning: true }, { name: 'The Den Crew', category: 'criminal' }, { name: 'Merchants', dominantCategory: 'economic' }],
};
const withPower = (p) => {
  const x = clone(p);
  [60, 25, 15].forEach((n, i) => { x.powerStructure.factions[i].power = n; x.factions[i].power = n; });
  return x;
};
const served = (p) => ({ ...clone(p), institutions: clone(p.institutions).filter((h) => h.id !== 'inst_den') });
const client = new pg.Client({ host: process.env.PGHOST || '/var/tmp/rv7', user: process.env.PGUSER || 'postgres', database: db });
await client.connect();
let bad = 0;
for (const [label, pub, wantPower] of [['no power (the plant)', PUB, false], ['every power a number (the control)', withPower(PUB), true]]) {
  const doc = served(pub);
  const srv = (await client.query('select public._gallery_veil_roster_choices($1::jsonb, $2::jsonb) r', [JSON.stringify(doc), JSON.stringify(pub)])).rows[0].r;
  const tw = clone(doc);
  applyRosterChoices(tw, clone(pub), CARD_KINDS.institution.idOf);
  const f = [];
  for (const [list, at] of [['powerStructure.factions', (d) => d.powerStructure?.factions], ['factions', (d) => d.factions]]) {
    const s = at(srv) || []; const t = at(tw) || [];
    const sp = s.map((e) => e.power);
    if (!wantPower && s.some((e) => isRec(e) && 'power' in e)) f.push(`(1) ${list}: the server ADDED power ${JSON.stringify(sp)}`);
    if (wantPower && (s.some((e) => typeof e.power !== 'number') || sp.reduce((a, b) => a + b, 0) !== 100)) f.push(`(3) ${list}: the shares not re-derived to 100: ${JSON.stringify(sp)}`);
    if (s.length !== 2) f.push(`${list}: ${s.length} entries served (2 wanted: the criminal power withheld, VR42's governing one kept)`);
    if (canon(s) !== canon(t)) f.push(`(2) ${list}: server ${canon(s)} | twin ${canon(t)}`);
    f.length || console.log(`  ${label} ${list}: served ${s.map((e) => e.faction || e.name).join(', ')}; power server ${JSON.stringify(sp)} twin ${JSON.stringify(t.map((e) => e.power))}`);
  }
  console.log(`${label}: ${f.length ? `RED: ${f.join(' | ')}` : 'GREEN'}`);
  if (f.length) bad += 1;
}
await client.end();
console.log(bad ? `RED: ${bad} case(s)` : 'GREEN: both cases, both lists');
process.exit(bad ? 1 : 0);
