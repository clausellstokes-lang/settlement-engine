// THE CHAIR'S OWN WALK (scratch): the owner's ten steps, in the order of READ-ME-FIRST.md, from the folder he is sent,
// on the chain as production stands (to 203), and once more with the urgent file already run before it.
import { readFileSync, readdirSync } from 'node:fs';
import { bootHostedChain } from '/home/user/wt/grants/tests/security/hostedDefaultHarness.js';
const O = process.argv[2];
const steps = readdirSync(O).filter((f) => /^step-\d\d-.*\.sql$/.test(f)).sort();
const walk = async (label, pre) => {
  const { db } = await bootHostedChain({ upTo: 203 });
  if (pre) await db.exec(readFileSync(pre, 'utf8'));
  console.log(`\n===== ${label}`);
  for (const f of steps) {
    const sql = readFileSync(O + '/' + f, 'utf8');
    try {
      const res = await db.exec(sql);                 // every statement, as the editor would run the paste
      const last = res[res.length - 1];
      const rows = last?.rows ?? [];
      let what;
      if (/^step-0[15]/.test(f)) what = JSON.stringify(rows[0]);
      else if (/^step-02/.test(f)) what = JSON.stringify(rows[0]);
      else if (/^step-07/.test(f)) what = `${rows.length} rows; true on: ${rows.filter((r) => r.signed_in_may_update).map((r) => r.column_name).join(', ')}`;
      else if (/^step-09/.test(f)) what = rows.map((r) => `${r.on_table}:${r.tgenabled}`).join(' | ');
      else if (/^step-10/.test(f)) what = `${rows.length} rows`;
      else what = `ran, ${res.length} statement(s), last returned ${rows.length} rows`;
      console.log(`  ${f}: ${what}`);
    } catch (e) { console.log(`  ${f}: RAISED ${String(e?.message || e).slice(0, 160)}`); }
  }
  for (const f of ['optional-detail-every-function-after.sql']) {
    const rows = (await db.exec(readFileSync(O + '/' + f, 'utf8'))).pop().rows;
    console.log(`  ${f}: ${rows.length} rows; exist here ${rows.filter((r) => r.exists_here).length}; anon true ${rows.filter((r) => r.anon).length}; authenticated true ${rows.filter((r) => r.authenticated).length}; service_role true ${rows.filter((r) => r.service_role).length}`);
  }
};
await walk('production as it stands (203), then the ten steps');
await walk('production with the URGENT file already run, then the ten steps', process.argv[3]);
