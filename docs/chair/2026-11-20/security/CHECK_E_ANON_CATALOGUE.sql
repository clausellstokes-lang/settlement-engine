-- CHECK_E_ANON_CATALOGUE.sql — READ-ONLY, one statement, one row. 2026-11-20 02:08 UTC, SEC-GRANTS.
-- Every function of schema public that anon may execute, in one cell (the chair's shape: name, identity arguments,
-- D = security definer / I = invoker), so the editor's 100-row cut cannot truncate it.
select count(*) as anon_executable_count,
       string_agg(p.proname || '(' || pg_get_function_identity_arguments(p.oid) || ')'
                  || case when p.prosecdef then ' D' else ' I' end, ' ; ' order by p.proname, pg_get_function_identity_arguments(p.oid)) as anon_executable
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and has_function_privilege('anon', p.oid, 'execute');
