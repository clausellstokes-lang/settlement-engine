-- READS ONLY. ONE ROW: the role you are running as, and whether a NEW function that role makes in
-- schema public with this repository's two lines would still be handed to a visitor and to a signed-in user
-- (counting the role's row for schema public AND its global row). Before file 2: true, true. After file 2,
-- run as the SAME role: false, false. If running_as is not the role that runs `supabase db push` (postgres),
-- file 2 changed nothing for the migrations: say so before going on.
select current_user as running_as,
  exists (select 1 from pg_default_acl d cross join lateral aclexplode(d.defaclacl) a
           where d.defaclrole = (select oid from pg_roles where rolname = current_user)
             and d.defaclobjtype = 'f' and d.defaclnamespace in (0, 'public'::regnamespace)
             and a.privilege_type = 'EXECUTE' and a.grantee = (select oid from pg_roles where rolname = 'anon'))
    as new_function_handed_to_visitor,
  exists (select 1 from pg_default_acl d cross join lateral aclexplode(d.defaclacl) a
           where d.defaclrole = (select oid from pg_roles where rolname = current_user)
             and d.defaclobjtype = 'f' and d.defaclnamespace in (0, 'public'::regnamespace)
             and a.privilege_type = 'EXECUTE' and a.grantee = (select oid from pg_roles where rolname = 'authenticated'))
    as new_function_handed_to_signed_in_user;
