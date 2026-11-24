// THE CHAIR'S OWN MEASURE (scratch): what do the owner's reads SHOW at each moment he might run them?
import { readFileSync } from 'node:fs';
import { bootHostedChain } from '/home/user/wt/grants/tests/security/hostedDefaultHarness.js';
const D = '/home/user/wt/grants/docs/chair/2026-11-24/tenth/grants/FOR-THE-OWNER-GRANTS/';
const read = async (db, f) => (await db.query(readFileSync(D + f, 'utf8').replace(/^\s*--.*$/gm, ''))).rows;
const show = async (label, db) => {
  const s = await read(db, '7-standing-check.sql');
  const b = await read(db, '0b-read-part-b-default.sql');
  const a = await read(db, '5-read-check-after.sql');
  const openA = a.filter((r) => Object.values(r).some((v) => v === true) && (r.visitor_can_call === true || r.signed_in_can_call === true || r.anon === true || r.authenticated === true)).length;
  console.log(`\n[${label}] standing check rows: ${s.length}; part B read: ${JSON.stringify(b[0])}; file 5 rows: ${a.length}, keys ${Object.keys(a[0] || {}).join(',')}; open among them: ${openA}`);
  for (const r of s.slice(0, 12)) console.log('    ' + JSON.stringify(r));
};
// 1. production as it stands, nothing run
let c = await bootHostedChain({ upTo: 203 });
await show('203, nothing run', c.db);
// 2. production + the owner's files 1..4, before the deploy
for (const f of ['1-part-a-functions.sql', '2-part-b-default.sql', '3-part-c-profiles.sql', '4-part-d-settlements-maps.sql']) await c.db.exec(readFileSync(D + f, 'utf8'));
await show('203 + the owner\'s files 1 to 4 (before the deploy)', c.db);
// 3. the whole chain (after the deploy)
c = await bootHostedChain();
await show('001 to 211 (after the deploy)', c.db);
