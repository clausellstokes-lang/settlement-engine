-- every public function: signature, provolatile, proacl, pg_get_functiondef; sorted by signature
select p.oid::regprocedure::text as sig, p.provolatile, coalesce(p.proacl::text, '') as acl, pg_get_functiondef(p.oid) as def
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
 where n.nspname = 'public' and p.prokind in ('f', 'p', 'w')
 order by 1;
