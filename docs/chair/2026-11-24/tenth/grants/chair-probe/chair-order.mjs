// THE CHAIR'S OWN MEASURE (scratch): DOES THE ORDER MATTER?
//   TESTED ORDER:  001..210 under the hosted defaults, then 211 (part B last).
//   OWNER-FIRST:   001..203 under the hosted defaults, THEN the owner's files 1, 2, 3, 4 by hand (part B now in force),
//                  THEN the deploy's push of 204..211.
// Under OWNER-FIRST every function 204..210 CREATE is born without the by-name grants. Any function whose reach
// then differs from the tested order leaned on the hosted default; if a page needs it, the deploy would break it.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { bootHostedChain, migrationFiles, splitSql, MIGRATIONS_DIR } from '/home/user/wt/grants/tests/security/hostedDefaultHarness.js';
const OWNER_DIR = '/home/user/wt/grants/docs/chair/2026-11-24/tenth/grants/FOR-THE-OWNER-GRANTS/';
const dump = async (db) => {
  const r = await db.query(`select p.oid::regprocedure::text as sig,
      has_function_privilege('anon', p.oid, 'execute') as anon,
      has_function_privilege('authenticated', p.oid, 'execute') as auth,
      has_function_privilege('service_role', p.oid, 'execute') as svc
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' order by 1`);
  return new Map(r.rows.map((x) => [x.sig, `${x.anon ? 'A' : '-'}${x.auth ? 'U' : '-'}${x.svc ? 'S' : '-'}`]));
};
const replay = async (db, files) => {
  const failures = [];
  for (const f of files) {
    const src = readFileSync(join(MIGRATIONS_DIR, f), 'utf8');
    try { await db.exec(src); continue; } catch { /* statement by statement */ }
    for (const stmt of splitSql(src)) { try { await db.exec(stmt); } catch (e) { failures.push(`${f}: ${String(e?.message || e).slice(0, 100)}`); } }
  }
  return failures;
};
const a = await bootHostedChain();                       // tested order
const A = await dump(a.db);
const b = await bootHostedChain({ upTo: 203 });          // owner first
for (const f of ['1-part-a-functions.sql', '2-part-b-default.sql', '3-part-c-profiles.sql', '4-part-d-settlements-maps.sql']) {
  await b.db.exec(readFileSync(OWNER_DIR + f, 'utf8'));
}
const later = migrationFiles().filter((f) => Number(f.slice(0, 3)) > 203);
const fails = await replay(b.db, later);
const B = await dump(b.db);
console.log(`tested order: ${A.size} functions; owner-first order: ${B.size} functions; later files replayed: ${later.join(', ')}; statement failures in them: ${fails.length}`);
for (const x of fails) console.log('   fail ' + x);
let diff = 0;
for (const [sig, v] of A) { const w = B.get(sig); if (w !== v) { diff++; console.log(`  DIFFERS  ${sig}: tested ${v}, owner-first ${w ?? '(absent)'}`); } }
for (const sig of B.keys()) if (!A.has(sig)) { diff++; console.log(`  ONLY IN OWNER-FIRST  ${sig}`); }
console.log(`functions whose reach differs between the two orders: ${diff}  (A = a visitor, U = a signed-in user, S = the server)`);
// and the tables' side: profiles' column grants and the triggers, the same in both?
for (const [label, db] of [['tested', a.db], ['owner-first', b.db]]) {
  const c = await db.query(`select count(*) filter (where has_column_privilege('authenticated', 'public.profiles', column_name, 'UPDATE')) as n from information_schema.columns where table_schema = 'public' and table_name = 'profiles'`);
  const t = await db.query(`select count(*) as n from pg_trigger where tgname = 'trg_guard_server_owned_columns' and not tgisinternal`);
  console.log(`${label}: profiles columns a signed-in user may update: ${c.rows[0].n}; guard triggers: ${t.rows[0].n}`);
}
