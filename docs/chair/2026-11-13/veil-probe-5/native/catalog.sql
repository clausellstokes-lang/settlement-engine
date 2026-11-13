select 'F|' || n.nspname || '.' || p.oid::regprocedure::text || '|' || md5(p.prosrc) || '|' || p.provolatile::text || '|' || p.prosecdef::text || '|' || coalesce(array_to_string(p.proconfig, ';'), '') || '|' || coalesce(p.proacl::text, '') || '|' || pg_get_userbyid(p.proowner) || '|' || p.prorettype::regtype::text || '|' || p.proparallel::text || '|' || p.proisstrict::text || '|' || md5(case when p.prokind in ('f','p') then pg_get_functiondef(p.oid) else '' end)
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname not in ('pg_catalog', 'information_schema', 'pg_toast')
union all
select 'R|' || n.nspname || '.' || c.relname || '|' || c.relkind::text || '|' || coalesce(c.relacl::text, '') || '|' || c.relrowsecurity::text
  from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname in ('public', 'auth', 'storage', 'cron')
union all
select 'P|' || schemaname || '.' || tablename || '.' || policyname || '|' || cmd || '|' || coalesce(qual, '') || '|' || coalesce(with_check, '') || '|' || array_to_string(roles, ',') from pg_policies
union all
select 'D|' || coalesce(defaclrole::regrole::text, '') || '|' || defaclobjtype::text || '|' || coalesce(defaclacl::text, '') from pg_default_acl
union all
select 'T|' || tgrelid::regclass::text || '.' || tgname || '|' || md5(pg_get_triggerdef(oid)) from pg_trigger where not tgisinternal
union all
select 'C|' || conrelid::regclass::text || '.' || conname || '|' || md5(pg_get_constraintdef(oid)) from pg_constraint where connamespace = 'public'::regnamespace
order by 1;
