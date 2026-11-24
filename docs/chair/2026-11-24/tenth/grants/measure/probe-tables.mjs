import { boot } from './boot.mjs';
import { writeFileSync } from 'node:fs';
const { db } = await boot({ hostedDefaults: true });
const UID = '11111111-1111-1111-1111-111111111111';
const q = async (s, p) => (await db.query(s, p)).rows;
await db.exec(`insert into auth.users (id, email) values ('${UID}', 'u@probe.test');`);
const TABLES = { settlements: 'user_id', saved_maps: 'user_id', gallery_comments: 'user_id', support_messages: 'user_id', founder_seats: 'holder_user_id' };
await db.exec(`update public.profiles set tier='premium' where id='${UID}'`);
const out = {};
for (const [t, owner] of Object.entries(TABLES)) {
  const cols = await q(`select column_name, data_type, column_default, is_nullable, is_generated, is_identity from information_schema.columns where table_schema='public' and table_name=$1 order by ordinal_position`, [t]);
  const fill = (c) => {
    if (c.column_name === owner) return `'${UID}'`;
    const t2 = c.data_type;
    if (t2 === 'uuid') return 'gen_random_uuid()';
    if (t2 === 'boolean') return 'false';
    if (/int|numeric/.test(t2)) return '1';
    if (/timestamp|date/.test(t2)) return 'now()';
    if (/json/.test(t2)) return `'{}'`;
    if (t2 === 'ARRAY') return `'{}'`;
    return `'probe'`;
  };
  const req = cols.filter(c => c.is_nullable === 'NO' && !c.column_default && c.is_identity !== 'YES' && c.is_generated !== 'ALWAYS');
  const names = [...new Set([...req.map(c => c.column_name), owner])];
  let seeded;
  // satisfy FKs where needed by creating parents lazily
  try {
    if (t === 'gallery_comments') {
      const s = await q(`insert into public.settlements (user_id, name, tier) values ('${UID}', 'probe', 'village') returning id`);
      req.forEach(c => { if (c.column_name === 'settlement_id') c._v = `'${s[0].id}'`; });
    }
    if (t === 'founder_seats') { const r = await q(`update public.founder_seats set holder_user_id='${UID}' where ctid = (select ctid from public.founder_seats limit 1) returning *`); if (!r.length) throw new Error('no seat rows'); seeded = r[0]; }
    else {
    const vals = names.map(n => { const c = cols.find(x => x.column_name === n); return c._v || fill(c); });
    seeded = (await q(`insert into public.${t} (${names.join(',')}) values (${vals.join(',')}) returning *`))[0];
    }
  } catch (e) { out[t] = { seedError: e.message, required: names }; continue; }
  const pk = seeded.id !== undefined ? 'id' : owner;
  const res = [];
  for (const c of cols) {
    if (c.column_name === pk || c.column_name === owner || c.is_generated === 'ALWAYS') continue;
    const cur = seeded[c.column_name];
    const t2 = c.data_type;
    const cands = t2 === 'boolean' ? [cur ? 'false' : 'true'] : /int|numeric|double|real/.test(t2) ? [`coalesce(${c.column_name},0)+1`] :
      /timestamp|date/.test(t2) ? (cur === null ? ['now()'] : ['null']) : t2 === 'uuid' ? ['null', 'gen_random_uuid()'] : /json/.test(t2) ? [`'{"probe":1}'`] : t2 === 'ARRAY' ? [`'{x}'`] : [`'probe-x'`, 'null'];
    let verdict = 'blocked'; const tries = [];
    for (const v of cands) {
      try {
        await db.exec(`begin; set local request.jwt.claim.role = 'authenticated'; set local test.uid = '${UID}'; set local role authenticated;`);
        const before = (await db.query(`select (${c.column_name})::text as v from public.${t} where ${pk} = $1`, [seeded[pk]])).rows[0]?.v ?? null;
        const r = await db.query(`update public.${t} set ${c.column_name} = ${v} where ${pk} = $1 returning (${c.column_name})::text as v`, [seeded[pk]]);
        await db.exec('rollback;');
        if (r.rows.length && (r.rows[0].v ?? null) !== before) { verdict = 'CHANGED'; tries.push(v); break; }
        if (r.rows.length) { tries.push(`${v}: unchanged(before=${String(before).slice(0,20)})`); continue; }
        tries.push(`${v}: 0 rows`);
      } catch (e) { await db.exec('rollback;').catch(()=>{}); tries.push(`${v}: ${e.message.slice(0, 70)}`); }
    }
    res.push({ col: c.column_name, verdict, tries });
  }
  out[t] = res;
}
await db.exec('reset role;');
writeFileSync(new URL('./out/other-tables.json', import.meta.url), JSON.stringify(out, null, 1));
for (const [t, r] of Object.entries(out)) {
  if (!Array.isArray(r)) { console.log(t, 'SEED ERROR', r.seedError, r.required.join(',')); continue; }
  console.log(t, 'CHANGED:', r.filter(x => x.verdict === 'CHANGED').map(x => x.col).join(','));
  console.log(t, 'blocked:', r.filter(x => x.verdict !== 'CHANGED').map(x => x.col + '[' + x.tries.at(-1).split(':').slice(1).join(':').trim().slice(0, 40) + ']').join(','));
}
