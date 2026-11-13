select p.proname || '(' || pg_get_function_identity_arguments(p.oid) || ')' || '|' ||
       md5(p.prosrc || '|' || p.provolatile::text || '|' || p.prosecdef::text || '|' || coalesce(array_to_string(p.proconfig, ';'), ''))
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
 where n.nspname = 'public' and (p.proname like '\_gallery\_veil%' or p.proname in ('_gallery_apply_member_overrides', 'get_gallery_dossier', 'get_unlisted_dossier', 'import_gallery_dossier', 'get_gallery_map'))
 order by 1;
