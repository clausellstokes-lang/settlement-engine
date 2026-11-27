// MC (VEIL-56), V28 (8), THE LOCK: N concurrent readers of ONE campaign map (N = 1, 2, 4, 8), wall time each.
//   node lock.mjs <db (a copy of a template holding 212)> <stored dir> <members K> <out json> [variant label]
// Loads K of the stored documents (every (140/K)-th, sorted by name: a mix of sizes) as the owner's public UNMARKED rows ({}),
// one public map_with_campaign listing them. Then, for each N, opens N connections, fires get_gallery_map on all N at once,
// and records each reader's wall ms and the batch's. The view count is read before and after (it must rise by N).
// The VARIANT (the counter moved after the read, or out of the read) is applied by the caller with psql before this runs;
// this script only measures. A timing recipe: it judges nothing a read serves.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
const pg = (await import('/var/tmp/v18/pgmod/node_modules/pg/lib/index.js')).default;
const [DB, DIR, K, OUT, LABEL] = process.argv.slice(2);
const OWNER = '11111111-1111-1111-1111-111111111111';
const conn = () => new pg.Client({ host: '/var/tmp/rv7', user: 'postgres', database: DB });
const all = readdirSync(DIR).filter((f) => /^r3m-.*\.json$/.test(f)).sort();
const k = Number(K); const step = all.length / k;
const files = Array.from({ length: k }, (_, i) => all[Math.floor(i * step)]);
const db = conn(); await db.connect();
const ids = [];
for (const [i, f] of files.entries()) {
  const id = `abcd7000-0000-0000-0000-${String(i + 1).padStart(12, '0')}`; ids.push(id);
  const doc = JSON.parse(readFileSync(`${DIR}/${f}`, 'utf8'));
  await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,gallery_member_overrides,gallery_share_dm,gallery_importable)
    values ($1,$2,$3,'town',$4,true,$5,now(),'{}',false,true) on conflict (id) do nothing`, [id, OWNER, doc.name || 'x', JSON.stringify(doc), `lk${i}`]);
}
await db.query(`insert into public.saved_maps (user_id, name, map_data, is_public, public_slug, share_kind, gallery_share_campaign, gallery_importable)
  values ($1, 'm', $2, true, 'lk-map', 'map_with_campaign', true, true) on conflict do nothing`, [OWNER, JSON.stringify({ campaign: { settlementIds: ids } })]);
await db.query('analyze');
const vc = async () => (await db.query("select view_count from public.saved_maps where public_slug = 'lk-map'")).rows[0].view_count;
const out = { db: DB, variant: LABEL || 'as built', members: k, files, runs: [] };
// one warm read first (catalogue and buffer caches), not counted
await db.query("select jsonb_array_length(public.get_gallery_map('lk-map') -> 'members') n");
for (const n of [1, 2, 4, 8]) {
  const cs = Array.from({ length: n }, conn); await Promise.all(cs.map((c) => c.connect()));
  const v0 = await vc();
  const t0 = process.hrtime.bigint();
  const each = await Promise.all(cs.map(async (c) => {
    const a = process.hrtime.bigint();
    const r = await c.query("select jsonb_array_length(public.get_gallery_map('lk-map') -> 'members') n");
    return { ms: +(Number(process.hrtime.bigint() - a) / 1e6).toFixed(0), members: r.rows[0].n };
  }));
  const batch = +(Number(process.hrtime.bigint() - t0) / 1e6).toFixed(0);
  const v1 = await vc();
  await Promise.all(cs.map((c) => c.end()));
  const ms = each.map((e) => e.ms).sort((x, y) => x - y);
  const run = { n, batchMs: batch, readerMs: ms, min: ms[0], max: ms[ms.length - 1], viewCountRise: v1 - v0, members: [...new Set(each.map((e) => e.members))] };
  out.runs.push(run); console.log(JSON.stringify(run));
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
await db.end();
