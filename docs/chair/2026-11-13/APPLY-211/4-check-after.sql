select count(*) as helpers,
       count(*) filter (where has_function_privilege('anon', p.oid, 'execute')
                           or has_function_privilege('authenticated', p.oid, 'execute')) as callable_by_readers
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
 where n.nspname = 'public' and p.proname like '\_gallery\_veil%';
select proname, proconfig from pg_proc
 where proname in ('get_gallery_dossier', 'get_unlisted_dossier', 'import_gallery_dossier', 'get_gallery_map');
