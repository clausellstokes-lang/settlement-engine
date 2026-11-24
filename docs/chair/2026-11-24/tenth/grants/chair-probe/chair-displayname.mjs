// THE CHAIR'S OWN MEASURE (scratch): on the chain as production stands (203, nothing run), can a signed-in user write
// display_name directly, round the rename function's civility guard? And the fields part C is for.
import { bootHostedChain } from '/home/user/wt/grants/tests/security/hostedDefaultHarness.js';
const OWNER = '11111111-1111-1111-1111-111111111111';
const { db } = await bootHostedChain({ upTo: 203 });
await db.exec(`insert into auth.users (id, email) values ('${OWNER}', 'o@probe.test') on conflict do nothing;`);
const asUser = async (sql) => {
  try { await db.exec(`set request.jwt.claim.role = 'authenticated'; set test.uid = '${OWNER}'; set role authenticated;`);
    const r = await db.query(sql); return 'OK ' + JSON.stringify(r.rows[0] ?? {}); }
  catch (e) { return 'REFUSED (' + String(e?.message || e).slice(0, 110) + ')'; }
  finally { await db.exec(`reset role; reset request.jwt.claim.role; set test.uid = '';`); }
};
console.log('203, nothing run, as a signed-in user on their own profile row:');
console.log('  display_name written directly:        ', await asUser(`update public.profiles set display_name = 'written round the guard' where id = '${OWNER}' returning display_name`));
console.log('  free_narrative_claimed_at set to null: ', await asUser(`update public.profiles set free_narrative_claimed_at = null where id = '${OWNER}' returning 1 as changed`));
console.log('  tier set to premium:                   ', await asUser(`update public.profiles set tier = 'premium' where id = '${OWNER}' returning tier`));
const cols = await db.query(`select column_name from information_schema.columns where table_schema='public' and table_name='profiles' order by ordinal_position`);
const open = [];
for (const c of cols.rows) {
  const t = (await db.query(`select data_type from information_schema.columns where table_schema='public' and table_name='profiles' and column_name=$1`, [c.column_name])).rows[0].data_type;
  const r = await asUser(`update public.profiles set ${c.column_name} = ${c.column_name} where id = '${OWNER}' returning 1 as ok`);
  if (r.startsWith('OK')) open.push(c.column_name);
}
console.log(`  columns whose no-op self-update is ACCEPTED today: ${open.length} of ${cols.rows.length}`);
