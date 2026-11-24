// Part B probes: what 0b reads before/after, a new function with the convention's two lines and with none,
// part B run by another role (silent?), and a GLOBAL default grant (does the per-schema revoke reach it?).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { boot211 } from './boot211.mjs';
const ROOT = process.env.ROOT211;
const B = readFileSync(join(ROOT, 'docs/chair/2026-11-24/tenth/grants/FOR-THE-OWNER-GRANTS/2-part-b-default.sql'), 'utf8');
const R0b = readFileSync(join(ROOT, 'docs/chair/2026-11-24/tenth/grants/FOR-THE-OWNER-GRANTS/0b-default-privileges.sql'), 'utf8');
const probe = async (db, tag) => {
  await db.exec(`create function public.zz_conv_${tag}() returns int language sql as 'select 1';
    revoke all on function public.zz_conv_${tag}() from public; grant execute on function public.zz_conv_${tag}() to service_role;
    create function public.zz_none_${tag}() returns int language sql as 'select 1';`);
  const r = (await db.query(`select proname, has_function_privilege('anon',oid,'execute') anon, has_function_privilege('authenticated',oid,'execute') auth, has_function_privilege('service_role',oid,'execute') svc from pg_proc where proname like 'zz_%_${tag}'`)).rows;
  return r.map((x) => `${x.proname}: anon=${x.anon} auth=${x.auth} svc=${x.svc}`);
};
const read = async (db) => (await db.query(R0b)).rows.map((r) => `${r.role}/${r.kind}: ${r.acl}`);
const allDefacl = async (db) => (await db.query(`select defaclrole::regrole::text r, defaclnamespace::regnamespace::text ns, defaclobjtype k, defaclacl::text acl from pg_default_acl order by 1,2,3`)).rows.map((x) => `${x.r}/${x.ns}/${x.k}: ${x.acl}`);
// 1. the normal case on the live chain
{ const { db } = await boot211({ upTo: 203, mode: 'none' });
  console.log('0b before:', await read(db)); console.log('new fns before B:', await probe(db, 'a'));
  await db.exec(B); await db.exec(B);
  console.log('0b after B (twice):', await read(db)); console.log('new fns after B:', await probe(db, 'b')); }
// 2. part B run as another role (e.g. the editor set to a different role)
{ const { db } = await boot211({ upTo: 203, mode: 'none' });
  await db.exec(`create role other_admin; grant create on schema public to other_admin; set role other_admin;`);
  let err = null; try { await db.exec(B); } catch (e) { err = e.message; }
  await db.exec('reset role');
  console.log('B as other role: error=', err, '| 0b:', await read(db), '| new fns by postgres:', await probe(db, 'c')); }
// 3. a GLOBAL default grant to anon (no IN SCHEMA) for postgres: does the per-schema revoke close it?
{ const { db } = await boot211({ upTo: 203, mode: 'none' });
  await db.exec(`alter default privileges in schema public grant execute on functions to anon;`); // no-op shape check
  await db.exec(`alter default privileges grant execute on functions to anon, authenticated;`); // GLOBAL
  await db.exec(B);
  console.log('with a global grant: 0b (public only):', await read(db), '| all pg_default_acl:', await allDefacl(db), '| new fns:', await probe(db, 'd')); }
