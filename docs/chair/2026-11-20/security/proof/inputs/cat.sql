\pset format unaligned
\pset fieldsep_zero
\pset footer off
select p.oid::regprocedure as sig, p.prosecdef as definer,
  has_function_privilege('anon', p.oid, 'execute') as anon,
  has_function_privilege('authenticated', p.oid, 'execute') as authd,
  has_function_privilege('service_role', p.oid, 'execute') as svc,
  replace(pg_get_function_result(p.oid),E'\n',' ') as ret, l.lanname,
  (p.prosrc ~* 'auth\.uid\(\)') as uid, (p.prosrc ~* 'auth\.role\(\)|auth\.jwt\(\)|current_user|session_user|current_setting\(''request') as role_chk,
  coalesce(array_to_string(p.proacl::text[], ' '), '<default>') as acl
from pg_proc p join pg_namespace n on n.oid = p.pronamespace join pg_language l on l.oid = p.prolang
where n.nspname = 'public'
  and not exists (select 1 from pg_depend d where d.classid = 'pg_proc'::regclass and d.objid = p.oid and d.deptype = 'e')
order by 1::text;
