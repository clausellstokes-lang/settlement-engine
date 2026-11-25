-- READS ONLY, after file 4. The two guard triggers: present and enabled (tgenabled O = enabled).
-- Expected: two rows, settlements and saved_maps, each enabled O, both calling _guard_server_owned_columns.
select tgrelid::regclass::text as on_table, tgname, tgenabled, tgfoid::regproc::text as function
  from pg_trigger where tgname = 'trg_guard_server_owned_columns' and not tgisinternal order by 1;
