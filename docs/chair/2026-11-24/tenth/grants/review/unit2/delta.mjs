// Delta re-check (31c44a1f36): the new 0b as the owner would run it (file 2 and 0b in the SAME role), file 7 on
// the live chain after files 1-4 and on the line after 211, and file 7's signature text under another search_path.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { boot211 } from './boot211.mjs';
const ROOT = process.env.ROOT211;
const F = (n) => readFileSync(join(ROOT, 'docs/chair/2026-11-24/tenth/grants/FOR-THE-OWNER-GRANTS', n), 'utf8');
const R0b = F('0b-read-part-b-default.sql'), B = F('2-part-b-default.sql'), S7 = F('7-standing-check.sql'), R6a = F('6a-read-after-part-c-profiles.sql'), R6b = F('6b-read-after-part-d-triggers.sql');
const truth = async (db, tag) => { await db.exec(`create function public.zz_t_${tag}() returns int language sql as 'select 1'; revoke all on function public.zz_t_${tag}() from public; grant execute on function public.zz_t_${tag}() to service_role;`);
  return (await db.query(`select has_function_privilege('anon','public.zz_t_${tag}()','execute') v, has_function_privilege('authenticated','public.zz_t_${tag}()','execute') s`)).rows[0]; };
{ const { db } = await boot211({ upTo: 203, mode: 'none' });
  await db.exec(`create role other_admin; grant usage, create on schema public to other_admin; set role other_admin;`);
  await db.exec(B); const read = (await db.query(R0b)).rows[0]; await db.exec('reset role');
  console.log('B and 0b both as other_admin -> read:', JSON.stringify(read), '| truth for a postgres-made function:', JSON.stringify(await truth(db, 'o'))); }
{ const { db } = await boot211({ upTo: 203, mode: 'owner', files: ['1', '2', '3', '4'] });
  console.log('live 203 + files 1-4: 0b', JSON.stringify((await db.query(R0b)).rows[0]), '| truth', JSON.stringify(await truth(db, 'l')));
  await db.exec('drop function public.zz_t_l()');
  const r7 = (await db.query(S7)).rows; console.log('live: file 7 rows', r7.length, JSON.stringify(r7.slice(0, 12)));
  console.log('live: 6a true columns', (await db.query(R6a)).rows.filter((r) => r.signed_in_may_update).map((r) => r.column_name).join(','));
  console.log('live: 6b', JSON.stringify((await db.query(R6b)).rows));
  await db.exec(`set search_path = public`); const r7b = (await db.query(S7)).rows; console.log('live, search_path=public only: file 7 rows', r7b.length, JSON.stringify(r7b.slice(0, 5)));
  const ext = (await db.query(`select p.oid::regprocedure::text s from pg_proc p where p.pronamespace='public'::regnamespace and exists (select 1 from unnest(p.proargtypes::oid[]) t join pg_type ty on ty.oid=t where ty.typnamespace not in ('pg_catalog'::regnamespace,'public'::regnamespace))`)).rows;
  console.log('public functions with an argument type outside pg_catalog/public:', JSON.stringify(ext)); }
{ const { db } = await boot211({ upTo: 210, mode: 'mig' });
  const r7 = (await db.query(S7)).rows; console.log('line 210+211: file 7 rows', r7.length, JSON.stringify(r7));
  console.log('line: 0b', JSON.stringify((await db.query(R0b)).rows[0])); }
