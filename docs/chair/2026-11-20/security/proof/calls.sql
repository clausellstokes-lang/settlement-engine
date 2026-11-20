\pset format unaligned
\pset tuples_only on
select p.oid::regprocedure::text || E'\t' ||
  format('public.%I(%s)', p.proname, coalesce((
    select string_agg(case
      when t::regtype = 'uuid'::regtype then '''22222222-2222-2222-2222-222222222222''::uuid'
      when t::regtype in ('text'::regtype,'character varying'::regtype) then '''x''::text'
      when t::regtype in ('integer'::regtype,'bigint'::regtype,'smallint'::regtype,'numeric'::regtype,'double precision'::regtype,'real'::regtype) then '1::' || format_type(t, null)
      when t::regtype = 'boolean'::regtype then 'false'
      when t::regtype in ('jsonb'::regtype,'json'::regtype) then '''{}''::' || format_type(t, null)
      when t::regtype = 'date'::regtype then 'current_date'
      when t::regtype in ('timestamp with time zone'::regtype,'timestamp without time zone'::regtype) then 'now()'
      else '''{}''::' || format_type(t, null) end, ', ' order by ord)
    from unnest(p.proargtypes::oid[]) with ordinality a(t, ord)), ''))
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and pg_get_function_result(p.oid) <> 'trigger'
  and (has_function_privilege('anon', p.oid, 'execute') or has_function_privilege('authenticated', p.oid, 'execute'))
  and not exists (select 1 from pg_depend d where d.classid = 'pg_proc'::regclass and d.objid = p.oid and d.deptype = 'e')
order by 1;
