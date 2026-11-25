// GRANTS-1 (4): does `alter default privileges ... revoke execute on functions` hold in the harness?
import { boot } from './boot.mjs';
import { writeFileSync } from 'node:fs';
const { db } = await boot({ hostedDefaults: true });
const q = async (s) => (await db.query(s)).rows;
const priv = async (sig) => (await q(`select has_function_privilege('anon', '${sig}'::regprocedure, 'execute') as anon,
  has_function_privilege('authenticated', '${sig}'::regprocedure, 'execute') as authd,
  has_function_privilege('service_role', '${sig}'::regprocedure, 'execute') as svc,
  (select proacl::text from pg_proc where oid = '${sig}'::regprocedure) as acl`))[0];
const out = {};
out.runner = (await q('select current_user as u'))[0].u;
await db.exec(`alter default privileges for role postgres in schema public revoke execute on functions from anon, authenticated;`);
await db.exec(`create function public.zz_after_schema_revoke() returns int language sql as 'select 1';`);
out.after_schema_level_revoke_anon_authenticated = await priv('public.zz_after_schema_revoke()');
await db.exec(`alter default privileges for role postgres revoke execute on functions from public;`);
await db.exec(`create function public.zz_after_public_revoke() returns int language sql as 'select 1';`);
out.after_global_revoke_public_too = await priv('public.zz_after_public_revoke()');
await db.exec(`grant execute on function public.zz_after_public_revoke() to authenticated;`);
out.named_grant_still_works = await priv('public.zz_after_public_revoke()');
out.existing_function_unchanged = await priv('public.handle_premium_downgrade(uuid)');
await db.exec(`create or replace function public.handle_premium_downgrade(target_user uuid) returns jsonb language sql security definer set search_path = public as $$ select '{}'::jsonb $$;`);
out.existing_after_create_or_replace = await priv('public.handle_premium_downgrade(uuid)');
out.default_acl = await q(`select defaclrole::regrole::text as role, coalesce(defaclnamespace::regnamespace::text, '(global)') as schema, defaclobjtype, defaclacl::text from pg_default_acl order by 2, 3`);
writeFileSync(new URL('./out/probe-defaults.json', import.meta.url), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
