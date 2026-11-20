\pset format unaligned
\pset fieldsep_zero
\pset footer off
with exposed as (
  select p.oid, p.proname, p.oid::regprocedure::text sig, p.prosecdef, pg_get_function_result(p.oid) ret
  from pg_proc p join pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public' and (has_function_privilege('anon',p.oid,'execute') or has_function_privilege('authenticated',p.oid,'execute'))
    and not exists (select 1 from pg_depend d where d.classid='pg_proc'::regclass and d.objid=p.oid and d.deptype='e')
), objrefs as (
  select e.sig, string_agg(distinct d.classid::regclass::text || ':' || coalesce(
     case d.classid when 'pg_policy'::regclass then (select pol.polname||' on '||pol.polrelid::regclass from pg_policy pol where pol.oid=d.objid)
       when 'pg_rewrite'::regclass then (select r.ev_class::regclass::text from pg_rewrite r where r.oid=d.objid)
       when 'pg_attrdef'::regclass then (select a.adrelid::regclass::text from pg_attrdef a where a.oid=d.objid)
       when 'pg_constraint'::regclass then (select c.conname from pg_constraint c where c.oid=d.objid)
       when 'pg_trigger'::regclass then (select t.tgname||' on '||t.tgrelid::regclass from pg_trigger t where t.oid=d.objid)
       when 'pg_class'::regclass then d.objid::regclass::text
       when 'pg_proc'::regclass then d.objid::regprocedure::text
       else d.objid::text end, '?'), '; ') refs
  from exposed e join pg_depend d on d.refclassid='pg_proc'::regclass and d.refobjid=e.oid and d.deptype in ('n','a')
  group by e.sig
), bodyrefs as (
  select e.sig, string_agg(distinct g.proname || case when g.prosecdef then '[D]' else '[I]' end, ',') callers,
         bool_or(not g.prosecdef) any_invoker
  from exposed e join pg_proc g on g.oid<>e.oid and g.prosrc ~ ('\m'||e.proname||'\M')
  join pg_namespace gn on gn.oid=g.pronamespace and gn.nspname in ('public','auth','storage','cron')
  group by e.sig
)
select e.sig, e.prosecdef, e.ret, coalesce(o.refs,''), coalesce(b.callers,''), coalesce(b.any_invoker,false)
from exposed e left join objrefs o using(sig) left join bodyrefs b using(sig) order by 1;
