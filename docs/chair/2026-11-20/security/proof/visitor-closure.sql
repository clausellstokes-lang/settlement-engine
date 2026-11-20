-- visitor-closure.sql: every function of schema public that a VISITOR context runs (as the visitor's own role).
-- Seeds: a function named by a policy, check constraint, column default, view, index, or an INVOKER trigger function
-- (a trigger runs as the writing role), and the invoker trigger functions themselves. Then: every function named in
-- the body of an INVOKER function already in the set (a DEFINER body runs as its owner: the chain stops there).
\pset format unaligned
\pset tuples_only on
with recursive pub as (
  select p.oid, p.proname, p.prosecdef, p.prosrc, pg_get_function_result(p.oid) ret
  from pg_proc p join pg_namespace n on n.oid=p.pronamespace
  where n.nspname in ('public','auth','storage') and not exists (select 1 from pg_depend d where d.classid='pg_proc'::regclass and d.objid=p.oid and d.deptype='e')
), objseed as (
  select distinct d.refobjid oid, d.classid::regclass::text || ':' || coalesce(
     case d.classid when 'pg_policy'::regclass then (select pol.polname||' on '||pol.polrelid::regclass from pg_policy pol where pol.oid=d.objid)
       when 'pg_rewrite'::regclass then (select r.ev_class::regclass::text from pg_rewrite r where r.oid=d.objid)
       when 'pg_attrdef'::regclass then (select a.adrelid::regclass::text from pg_attrdef a where a.oid=d.objid)
       when 'pg_constraint'::regclass then (select c.conname||' on '||c.conrelid::regclass from pg_constraint c where c.oid=d.objid)
       when 'pg_class'::regclass then d.objid::regclass::text
       when 'pg_trigger'::regclass then (select t.tgname||' on '||t.tgrelid::regclass from pg_trigger t where t.oid=d.objid)
       else d.objid::text end, '?') why
  from pg_depend d where d.refclassid='pg_proc'::regclass and d.deptype in ('n','a')
    and d.classid in ('pg_policy'::regclass,'pg_rewrite'::regclass,'pg_attrdef'::regclass,'pg_constraint'::regclass,'pg_class'::regclass,'pg_trigger'::regclass)
), seed as (
  select o.oid, o.why from objseed o join pub on pub.oid=o.oid
  where not (o.why like 'pg_trigger:%' and pub.prosecdef)   -- a DEFINER trigger function runs as its owner
), walk(oid, why, depth) as (
  select oid, why, 0 from seed
  union
  select c.oid, w.why || ' -> ' || g.proname, w.depth+1
  from walk w join pub g on g.oid=w.oid and not g.prosecdef
  join pub c on c.oid<>g.oid and regexp_replace(g.prosrc, '--[^\n]*', '', 'g') ~ ('\m'||c.proname||'\M')
  where w.depth < 6
)
select p.oid::regprocedure::text, case when p.prosecdef then 'DEFINER' else 'invoker' end,
       has_function_privilege('anon',p.oid,'execute') a, has_function_privilege('authenticated',p.oid,'execute') au,
       string_agg(distinct w.why, ' || ')
from walk w join pub p on p.oid=w.oid
where p.oid::regprocedure::text not like 'auth.%' and p.oid::regprocedure::text not like 'storage.%'
group by 1,2,3,4 order by 1;
