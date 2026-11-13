-- every comment on a function, relation, column or schema object in the compared schemas (catalog.sql does not hold them)
select 'K|' || d.classoid::regclass::text || '|' || coalesce(case d.classoid when 'pg_proc'::regclass then d.objoid::regprocedure::text
         when 'pg_class'::regclass then d.objoid::regclass::text else d.objoid::text end, '') || '|' || d.objsubid || '|' || md5(d.description)
  from pg_description d
 where d.classoid in ('pg_proc'::regclass, 'pg_class'::regclass)
   and (d.classoid <> 'pg_proc'::regclass or exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace where p.oid = d.objoid and n.nspname not in ('pg_catalog', 'information_schema')))
   and (d.classoid <> 'pg_class'::regclass or exists (select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace where c.oid = d.objoid and n.nspname in ('public', 'auth', 'storage', 'cron')))
 order by 1;
