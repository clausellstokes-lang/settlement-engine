import { boot } from './boot.mjs';
import { writeFileSync } from 'node:fs';
const { db } = await boot({ hostedDefaults: true });
const UID = '11111111-1111-1111-1111-111111111111';
const q = async (s, p) => (await db.query(s, p)).rows;
await db.exec(`insert into auth.users (id, email) values ('${UID}', 'u@probe.test');
  update public.profiles set free_narrative_claimed_at = now() where id = '${UID}';`);
const cols = await q(`select column_name, data_type, udt_name, is_nullable from information_schema.columns where table_schema='public' and table_name='profiles' order by ordinal_position`);
const checks = (await q(`select pg_get_constraintdef(oid) as def from pg_constraint where conrelid='public.profiles'::regclass and contype='c'`)).map(r=>r.def);
const row = (await q(`select * from public.profiles where id='${UID}'`))[0];
const lit = (v) => v === null ? 'null' : `'${String(v).replace(/'/g, "''")}'`;
function candidates(c) {
  const cur = row[c.column_name];
  const t = c.data_type;
  if (t === 'boolean') return [cur ? 'false' : 'true'];
  if (/integer|bigint|numeric|smallint|double|real/.test(t)) return [`coalesce(${c.column_name},0)+1`, '0', 'null'];
  if (/timestamp|date/.test(t)) return cur === null ? ['now()'] : ['null', `now() + interval '1 day'`];
  if (t === 'uuid') return ['gen_random_uuid()', 'null'];
  if (/json/.test(t)) return [`'{"probe":1}'`, 'null'];
  if (t === 'ARRAY') return [`'{}'`, 'null'];
  const lits = checks.filter(d => d.includes(c.column_name)).flatMap(d => [...d.matchAll(/'([^']*)'::text/g)].map(m => m[1])).filter(v => v !== cur);
  return [...lits.slice(0, 3).map(lit), `'probe-x'`, cur === null ? `'probe'` : 'null'];
}
const res = [];
for (const c of cols) {
  if (c.column_name === 'id') continue;
  const tries = [];
  let verdict = 'blocked';
  for (const v of candidates(c)) {
    try {
      await db.exec(`begin; set local request.jwt.claim.role = 'authenticated'; set local test.uid = '${UID}'; set local role authenticated;`);
      const r = await db.query(`update public.profiles set ${c.column_name} = ${v} where id = '${UID}' returning (${c.column_name})::text as nv`);
      await db.exec('rollback;');
      if (r.rows.length === 1) { verdict = 'CHANGED'; tries.push(`${v} -> ok`); break; }
      tries.push(`${v} -> 0 rows`);
    } catch (e) {
      await db.exec('rollback;').catch(()=>{});
      tries.push(`${v} -> ${e.message.slice(0, 90)}`);
    }
  }
  res.push({ col: c.column_name, type: c.data_type, verdict, tries });
}
await db.exec('reset role;');
writeFileSync(new URL('./out/profiles-cols.json', import.meta.url), JSON.stringify(res, null, 1));
for (const r of res) console.log(r.verdict.padEnd(8), r.col.padEnd(34), r.type.slice(0,12).padEnd(12), r.verdict==='CHANGED' ? r.tries.at(-1).slice(0,40) : r.tries.map(t=>t.split('->')[1].trim().slice(0,50)).join(' / '));
// Policies on other tables a signed-in user may UPDATE
const pol = await q(`select tablename, policyname, cmd, roles::text as roles, qual, with_check from pg_policies where schemaname='public' and cmd in ('UPDATE','ALL')`);
const pins = pol.map(p => ({ t: p.tablename, n: p.policyname, cmd: p.cmd, roles: p.roles, pins: [...((p.with_check||'').matchAll(/NOT \((\w+) IS DISTINCT FROM/gi))].map(m=>m[1]).length, wc: (p.with_check||'').length }));
writeFileSync(new URL('./out/update-policies.json', import.meta.url), JSON.stringify(pol, null, 1));
console.log('UPDATE/ALL policies', pol.length, 'tables', new Set(pol.map(p=>p.tablename)).size);
for (const p of pins.filter(p=>p.pins>0)) console.log('PINLIST', p.t, '|', p.n, '|', p.roles, '| pins', p.pins);
