// VEIL-DOORS — THE LIST COST ROWS (the assignment's cost law for a list). node listcost.mjs <pgmod> <template db> <pool.json> <N> <out>
// A database from the template, N public rows from the born pool (cycled; each marked with the default veil, a third
// unmarked, a sixth Reveal DM), then each list read timed: list_gallery_dossiers (relevance, the default page; a
// prosperity filter; a name sort; page 3), list_gallery_more_by_creator, get_gallery_dossier on one row. Median of 9
// after 2 warm runs, by EXPLAIN-free wall time on the server (clock_timestamp around the call, in one statement).
import { readFileSync, writeFileSync } from 'node:fs';
const [pgmod, tpl, poolPath, nStr, outPath] = process.argv.slice(2);
const pg = (await import(`${pgmod}/node_modules/pg/lib/index.js`)).default;
const N = Number(nStr); const pool = JSON.parse(readFileSync(poolPath, 'utf8'));
const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
const dbn = `lc_${tpl}_${N}`; await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${tpl}`); await admin.end();
const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect();
await db.query(`select set_config('test.uid', '', false)`);
const VEIL = { $veil: { v: 1, mode: 'live', at: '2026-11-01T00:00:00.000Z', deltas: [] } };
for (let i = 0; i < N; i += 1) {
  const t = pool[i % pool.length]; const ov = i % 3 === 2 ? {} : VEIL;
  await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_facet_culture,gallery_facet_prosperity)
    values (gen_random_uuid(),'11111111-1111-1111-1111-111111111111',$1,'town',$2,true,$3,now() - ($4 || ' minutes')::interval,$5,$6,true,$7,$8)`,
  [`${t.name} ${i}`, JSON.stringify(t), `lc${i}`, String(i), JSON.stringify(ov), i % 6 === 5, t?.config?.culture || null, t?.economicState?.prosperity || null]);
}
await db.query('analyze');
const time = async (sql, args) => { const r = []; for (let k = 0; k < 11; k += 1) { const t0 = process.hrtime.bigint(); await db.query(sql, args); r.push(Number(process.hrtime.bigint() - t0) / 1e6); } const m = r.slice(2).sort((a, b) => a - b); return m[Math.floor(m.length / 2)]; };
const rows = {
  'list relevance p0': await time(`select * from public.list_gallery_dossiers(0, 24, 'relevant', '', '{}'::jsonb, true)`),
  'list prosperity filter': await time(`select * from public.list_gallery_dossiers(0, 24, 'relevant', '', '{"prosperity":["Comfortable","Wealthy","Prosperous","Modest"]}'::jsonb, true)`),
  'list name_asc p3': await time(`select * from public.list_gallery_dossiers(3, 24, 'name_asc', '', '{}'::jsonb, true)`),
  'list search': await time(`select * from public.list_gallery_dossiers(0, 24, 'relevant', 'a', '{}'::jsonb, true)`),
  'more by creator': await time(`select * from public.list_gallery_more_by_creator('lc0', 6)`),
  'dossier one': await time(`select * from public.get_gallery_dossier('lc1')`),
};
await db.end();
writeFileSync(outPath, JSON.stringify({ tpl, N, rows }, null, 1));
console.log(JSON.stringify(rows));
