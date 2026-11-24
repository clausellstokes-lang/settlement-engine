// THE CHAIR'S OWN MEASURE (scratch): of the functions 211 part A closes, which could PUBLIC run BEFORE 211 with no
// hosted default at all (plain Postgres)? Any such function is one where the revoke cuts off every role that leaned
// on PUBLIC, not only anon and authenticated.
import { readFileSync } from 'node:fs';
import { bootHostedChain } from '/home/user/wt/grants/tests/security/hostedDefaultHarness.js';
const sql = readFileSync('/home/user/wt/grants/supabase/migrations/211_close_visitor_reach.sql', 'utf8');
const sigs = [...new Set([...sql.matchAll(/^revoke execute on function (public\.[a-z_0-9]+\([^)]*\)) from public, anon, authenticated;/gm)].map((m) => m[1]))];
for (const [label, opts] of [['plain Postgres, chain to 210', { hostedDefaults: false, upTo: 210 }], ['plain Postgres, chain to 203', { hostedDefaults: false, upTo: 203 }]]) {
  const { db } = await bootHostedChain(opts);
  await db.exec(`do $$ begin if not exists (select 1 from pg_roles where rolname = 'probe_plain') then create role probe_plain; end if; end $$;`);
  const open = []; let missing = 0;
  for (const s of sigs) {
    const r = await db.query(`select to_regprocedure($1) is not null as there, case when to_regprocedure($1) is not null then has_function_privilege('probe_plain', to_regprocedure($1), 'execute') end as pub`, [s]);
    if (!r.rows[0].there) { missing++; continue; }
    if (r.rows[0].pub) open.push(s);
  }
  console.log(`${label}: ${sigs.length} signatures in part A; ${missing} not in this chain; a role with no grant of its own (PUBLIC only) can run ${open.length}:`);
  for (const s of open) console.log('   ' + s);
}
