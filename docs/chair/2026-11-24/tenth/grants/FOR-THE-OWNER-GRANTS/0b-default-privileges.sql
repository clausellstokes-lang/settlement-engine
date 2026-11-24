-- READS ONLY. The default privileges for new objects in schema public, per role and object type
-- (f = functions). After file 2, the migrating role's 'f' row names neither anon nor authenticated.
select defaclrole::regrole::text as role, defaclobjtype as kind, defaclacl::text as acl
  from pg_default_acl where defaclnamespace = 'public'::regnamespace order by 1, 2;
