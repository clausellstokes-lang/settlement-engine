// THE CHAIR'S OWN MEASURE (scratch): which functions a VISITOR may run hand back a column that looks like an account id?
import { bootHostedChain } from '/home/user/wt/grants/tests/security/hostedDefaultHarness.js';
const { db } = await bootHostedChain();
const r = await db.query(`
  select p.oid::regprocedure::text as sig, pg_get_function_result(p.oid) as result
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and has_function_privilege('anon', p.oid, 'execute')
    and pg_get_function_result(p.oid) ~* '(user_id|owner_id|author_id|profile_id|creator_id)'
  order by 1`);
console.log('functions a visitor may run whose RESULT names an account-id column:', r.rows.length);
for (const x of r.rows) console.log('  ' + x.sig + '  ->  ' + x.result.replace(/\s+/g, ' ').slice(0, 260));
const o = await db.query(`
  select p.oid::regprocedure::text as sig, p.prosecdef as definer,
         has_function_privilege('anon', p.oid, 'execute') as anon, has_function_privilege('authenticated', p.oid, 'execute') as auth
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname in ('has_role', 'profile_has_premium_access', 'account_is_active') order by 1`);
for (const x of o.rows) console.log(`  oracle ${x.sig}: definer ${x.definer}, visitor ${x.anon}, signed-in ${x.auth}`);
