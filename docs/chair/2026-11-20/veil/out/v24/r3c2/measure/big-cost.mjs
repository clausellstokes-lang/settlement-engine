// R3-CURE-2 (VEIL-24's builder; the first cure's big-cost.mjs, chains r3c2_*): VEIL-19's builder: THE LARGEST BORN TOWN's reads timed on three chains (x211, base, after): the town written by
// r5-born.probe.jsx's R5_BIG, stored with the default veil record (Reveal DM off and on), read as anon, R rounds in turn, medians.
// LOCAL scratch cluster only.   node bcd-big-cost.mjs   (paths and chain names below)
const pg = (await import('/var/tmp/v18/pgmod/node_modules/pg/lib/index.js')).default;
const { readFileSync } = await import('node:fs');
const town = readFileSync('/tmp/claude-0/-home-user-settlement-engine/492b6dc9-c4af-5ca1-8fef-4386ff3f6ec2/scratchpad/big.json', 'utf8');
const dbs = ['r3c2_x211', 'r3c2_base', 'r3c2_after']; const R = 9; const t = {};
const ov = JSON.stringify({ $veil: { v: 1, mode: 'live', deltas: [] } });
const cs = {};
for (const d of dbs) { const c = new pg.Client({ host: '/var/tmp/rv7', user: 'postgres', database: d }); await c.connect(); cs[d] = c;
  await c.query("delete from public.settlements where public_slug like 'b2big%'");
  for (const [slug, dm] of [['b2big-off', false], ['b2big-dm', true]]) await c.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable) values (gen_random_uuid(),'11111111-1111-1111-1111-111111111111','Big','metropolis',$1::jsonb,true,$2,now(),$3,'unlisted',$4::jsonb,$5,true)`, [town, slug, slug + 'l', ov, dm]); }
for (let i = 0; i < R; i++) for (const d of dbs) for (const [k, q, a] of [['gallery off', 'select to_jsonb(g.data) as d from public.get_gallery_dossier($1) g', 'b2big-off'], ['gallery dm', 'select to_jsonb(g.data) as d from public.get_gallery_dossier($1) g', 'b2big-dm'], ['link', "select public.get_unlisted_dossier($1) -> 'dossier' as d", 'b2big-offl']]) {
  const c = cs[d]; await c.query("set role anon"); const t0 = process.hrtime.bigint(); const r = await c.query(q, [a]); const ms = Number(process.hrtime.bigint() - t0) / 1e6; await c.query('reset role');
  if (!r.rows[0]?.d) throw new Error(`${d} ${k}: no row`);
  (t[`${k} ${d}`] ||= []).push(ms); }
for (const d of dbs) await cs[d].query("delete from public.settlements where public_slug like 'b2big%'");
for (const k of ['gallery off', 'gallery dm', 'link']) { const m = dbs.map(d => { const v = t[`${k} ${d}`].sort((a, b) => a - b); return v[(v.length - 1) / 2].toFixed(1); }); console.log(`the largest born town, ${k}: x211 ${m[0]} | base ${m[1]} | after ${m[2]} ms (after/x211 ${(m[2] / m[0]).toFixed(2)})`); }
for (const d of dbs) await cs[d].end();
