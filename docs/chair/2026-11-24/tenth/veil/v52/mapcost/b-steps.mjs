// MAP-COST (b) (VEIL-52; V28 (3)): get_gallery_map's cost BY STEP on the today-born stored 140, local PostgreSQL 16.
//   node b-steps.mjs <db (a template copy holding the -wip's 212)> <stored dir> <out json>
// Loads the 140 as the owner's settlements, twice: UNMARKED ({}) and MARKED (the owner's hand marker, n115's literal); one public
// map_with_campaign per set listing its 140. Reads get_gallery_map once per map with `track_functions = 'all'`, then reads
// pg_stat_user_functions: every function's calls, total and self time (ms): the per-step split (sanitise, splice/apply, the veil's
// resolve/apply, the re-key, withhold-always) and the per-member cost (total / 140).
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
const pg = (await import('/var/tmp/v18/pgmod/node_modules/pg/lib/index.js')).default;
const [DB, DIR, OUT] = process.argv.slice(2);
const OWNER = '11111111-1111-1111-1111-111111111111';
const HAND = { $veil: { v: 1, deltas: ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'].map((address) => ({ address, hidden: false })), mode: 'live', at: '2026-11-01T00:00:00.000Z' } };
const files = readdirSync(DIR).filter((f) => /^r3m-.*\.json$/.test(f)).sort();
const db = new pg.Client({ host: '/var/tmp/rv7', user: 'postgres', database: DB }); await db.connect();
const out = { db: DB, members: files.length, maps: {} };
for (const [name, ov] of [['unmarked', {}], ['marked', HAND]]) {
  const ids = [];
  for (const [i, f] of files.entries()) {
    const id = `abcd6${name === 'unmarked' ? '0' : '1'}00-0000-0000-0000-${String(i + 1).padStart(12, '0')}`; ids.push(id);
    const doc = JSON.parse(readFileSync(`${DIR}/${f}`, 'utf8'));
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,$2,$3,'town',$4,true,$5,now(),$6,false,true)`, [id, OWNER, doc.name || 'x', JSON.stringify(doc), `mc${name}${i}`, JSON.stringify(ov)]);
  }
  await db.query(`insert into public.saved_maps (user_id, name, map_data, is_public, public_slug, share_kind, gallery_share_campaign, gallery_importable)
    values ($1, 'm', $2, true, $3, 'map_with_campaign', true, true)`, [OWNER, JSON.stringify({ campaign: { settlementIds: ids } }), `mc-${name}`]);
}
await db.query('analyze');
for (const name of ['unmarked', 'marked']) {
  await db.query('select pg_stat_reset()');
  await db.query("set track_functions = 'all'");
  const t0 = process.hrtime.bigint();
  const r = await db.query("select jsonb_array_length(public.get_gallery_map($1) -> 'members') n", [`mc-${name}`]);
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  await db.query('select pg_stat_force_next_flush()');
  await db.query("set track_functions = 'none'");
  const f = (await db.query(`select funcname, calls, round(total_time::numeric, 1) total_ms, round(self_time::numeric, 1) self_ms
    from pg_stat_user_functions where schemaname = 'public' order by self_time desc limit 25`)).rows;
  out.maps[name] = { wallMs: +ms.toFixed(1), members: r.rows[0]?.n, perMemberMs: +(ms / (r.rows[0]?.n || 1)).toFixed(1), functions: f };
  console.log(name, 'wall ms', ms.toFixed(0), 'members', r.rows[0]?.n);
  for (const x of f.slice(0, 12)) console.log('  ', x.funcname, x.calls, 'total', x.total_ms, 'self', x.self_ms);
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
await db.end();
