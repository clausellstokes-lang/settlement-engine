-- REVIEW-VEIL-6: the catalogue of a chain, one line an object, for a line-by-line comparison of two chains.
-- The third review's `native/catalog.sql` (functions with body, arguments, volatility, definer, configuration, ACL,
-- owner and full definition; relations with ACL and row security; policies; default ACLs; triggers; constraints),
-- and added here: every column, every index, every comment on a function, every column-level grant, the schemas'
-- ACLs, and the cron table's rows.
\pset tuples_only on
\pset format unaligned
\i :dir/catalog.sql
select 'A|' || c.oid::regclass::text || '.' || a.attname || '|' || format_type(a.atttypid, a.atttypmod) || '|' || a.attnotnull::text || '|' || coalesce(pg_get_expr(d.adbin, d.adrelid), '') || '|' || coalesce(a.attacl::text, '')
  from pg_attribute a join pg_class c on c.oid = a.attrelid join pg_namespace n on n.oid = c.relnamespace left join pg_attrdef d on d.adrelid = a.attrelid and d.adnum = a.attnum
 where n.nspname in ('public', 'auth', 'storage', 'cron') and a.attnum > 0 and not a.attisdropped and c.relkind in ('r', 'v', 'm', 'p')
union all select 'I|' || schemaname || '.' || indexname || '|' || md5(indexdef) from pg_indexes where schemaname in ('public', 'auth', 'storage', 'cron')
union all select 'M|' || p.oid::regprocedure::text || '|' || md5(coalesce(obj_description(p.oid, 'pg_proc'), '')) from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and obj_description(p.oid, 'pg_proc') is not null
union all select 'S|' || nspname || '|' || coalesce(nspacl::text, '') || '|' || pg_get_userbyid(nspowner) from pg_namespace where nspname in ('public', 'auth', 'storage', 'cron', 'extensions')
union all select 'J|' || coalesce(jobname, '') || '|' || coalesce(schedule, '') || '|' || md5(coalesce(command, '')) from cron.job
union all select 'V|' || c.oid::regclass::text || '|' || md5(pg_get_viewdef(c.oid)) from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relkind in ('v', 'm')
order by 1;
