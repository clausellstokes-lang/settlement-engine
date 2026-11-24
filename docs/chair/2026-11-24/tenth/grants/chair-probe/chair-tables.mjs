// THE CHAIR'S OWN MEASURE (scratch; never committed): under the modelled hosted defaults, what do the roles
// anon and authenticated hold on TABLES and VIEWS of schema public, beyond what a policy scopes?
import { bootHostedChain } from '/home/user/wt/grants/tests/security/hostedDefaultHarness.js';
const upTo = process.argv[2] === 'P' ? 203 : Infinity;
const { db, files } = await bootHostedChain({ upTo });
console.log(`chain to ${files[files.length - 1]}`);
const q = async (label, sql) => {
  const r = await db.query(sql);
  console.log(`\n== ${label}: ${r.rows.length} row(s)`);
  for (const row of r.rows.slice(0, 60)) console.log('  ' + Object.values(row).join(' | '));
};
await q('TABLES in public with ROW LEVEL SECURITY OFF that anon or authenticated may touch', `
  select c.relname,
         concat_ws(',', case when has_table_privilege('anon', c.oid, 'select') then 'anon:select' end,
                        case when has_table_privilege('anon', c.oid, 'insert') then 'anon:insert' end,
                        case when has_table_privilege('anon', c.oid, 'update') then 'anon:update' end,
                        case when has_table_privilege('anon', c.oid, 'delete') then 'anon:delete' end,
                        case when has_table_privilege('authenticated', c.oid, 'select') then 'auth:select' end,
                        case when has_table_privilege('authenticated', c.oid, 'insert') then 'auth:insert' end,
                        case when has_table_privilege('authenticated', c.oid, 'update') then 'auth:update' end,
                        case when has_table_privilege('authenticated', c.oid, 'delete') then 'auth:delete' end) as reach
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind in ('r', 'p') and not c.relrowsecurity
  order by 1`);
await q('TABLES in public with RLS ON and NO POLICY at all (closed to both roles; listed to be sure)', `
  select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind in ('r', 'p') and c.relrowsecurity
    and not exists (select 1 from pg_policy p where p.polrelid = c.oid) order by 1`);
await q('VIEWS and MATERIALIZED VIEWS in public that anon or authenticated may select, and whether they run as the caller', `
  select c.relname, c.relkind,
         coalesce((select true from unnest(c.reloptions) o where o in ('security_invoker=true', 'security_invoker=on', 'security_invoker=1')), false) as runs_as_caller,
         has_table_privilege('anon', c.oid, 'select') as anon_select,
         has_table_privilege('authenticated', c.oid, 'select') as auth_select
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind in ('v', 'm')
    and (has_table_privilege('anon', c.oid, 'select') or has_table_privilege('authenticated', c.oid, 'select'))
  order by 1`);
await q('POLICIES whose check is literally TRUE for a write (insert, update, delete, all) open to anon, authenticated or public', `
  select c.relname, p.polname, p.polcmd,
         array(select rolname from pg_roles where oid = any(p.polroles)) as roles,
         pg_get_expr(p.polqual, p.polrelid) as using_expr, pg_get_expr(p.polwithcheck, p.polrelid) as check_expr
  from pg_policy p join pg_class c on c.oid = p.polrelid join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and p.polcmd in ('a', 'w', 'd', '*')
    and (pg_get_expr(p.polqual, p.polrelid) = 'true' or pg_get_expr(p.polwithcheck, p.polrelid) = 'true')
    and (p.polroles = '{0}' or exists (select 1 from pg_roles r where r.oid = any(p.polroles) and r.rolname in ('anon', 'authenticated')))
  order by 1, 2`);
await q('POLICIES whose SELECT is literally TRUE for anon, authenticated or public (every row readable): the tables', `
  select c.relname, p.polname, array(select rolname from pg_roles where oid = any(p.polroles)) as roles
  from pg_policy p join pg_class c on c.oid = p.polrelid join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and p.polcmd in ('r', '*') and pg_get_expr(p.polqual, p.polrelid) = 'true'
    and (p.polroles = '{0}' or exists (select 1 from pg_roles r where r.oid = any(p.polroles) and r.rolname in ('anon', 'authenticated')))
  order by 1, 2`);
