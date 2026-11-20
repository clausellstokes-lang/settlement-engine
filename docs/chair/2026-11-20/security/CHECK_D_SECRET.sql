-- CHECK_D_SECRET.sql — READ-ONLY, one statement, one row. 2026-11-20 02:08 UTC, SEC-GRANTS. Never prints the secret.
-- secret_visible_to_this_session: is app.settings.byok_secret set for the session you run this in.
-- secret_stored_for: where a stored setting of it exists (database or role names), without its value.
-- stored_byok_keys: how many users have a provider key stored (a rotation costs nothing when this is 0).
select coalesce(nullif(btrim(current_setting('app.settings.byok_secret', true)), ''), null) is not null
         as secret_visible_to_this_session,
       (select string_agg(coalesce('database ' || db.datname, 'all databases')
                          || coalesce(' / role ' || r.rolname, ''), ', ')
          from pg_db_role_setting s
          left join pg_database db on db.oid = s.setdatabase
          left join pg_roles r on r.oid = s.setrole
          cross join lateral unnest(s.setconfig) c
         where c like 'app.settings.byok_secret=_%') as secret_stored_for,
       (select count(*) from public.surveyor_byok_keys) as stored_byok_keys;
