// VEIL-16 cost: median of N rounds, chains alternated, of the link / gallery reads of one stored town.
// node cost.mjs <pgmod> <town.json> <rounds> <db...>   (local cluster, PGHOST unix socket)
import { readFileSync } from 'node:fs';
const [pgmod, file, rounds, ...dbs] = process.argv.slice(2);
const pg = (await import(`${pgmod}/node_modules/pg/lib/index.js`)).default;
const text = readFileSync(file, 'utf8'); const rec = JSON.parse(text);
const VEIL = process.env.VEIL || '{}'; const DM = process.env.DM === '1';
const cs = {};
for (const d of dbs) {
  const c = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: d }); await c.connect(); cs[d] = c;
  await c.query("delete from public.settlements where public_slug = 'v16c'");
  await c.query(`insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, unlisted_slug, visibility, gallery_member_overrides, gallery_share_dm, gallery_importable)
    values (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', $1, $2, $3, true, 'v16c', now(), 'v16cl', 'unlisted', $4, $5, true)`, [String(rec.name || 'T'), String(rec.tier || 'town'), text, VEIL, DM]);
}
const Q = { link: "select length(public.get_unlisted_dossier('v16cl')::text) as n", gallery: "select length((select to_jsonb(g.data) from public.get_gallery_dossier('v16c') g)::text) as n" };
const t = {}; const len = {};
for (let r = 0; r < Number(rounds); r += 1) for (const d of (r % 2 ? [...dbs].reverse() : dbs)) for (const [k, q] of Object.entries(Q)) {
  const c = cs[d]; await c.query('set role anon');
  const t0 = process.hrtime.bigint(); let res; try { res = await c.query(q); } catch (e) { res = { rows: [{ n: 'ERR ' + e.message.slice(0, 60) }] }; }
  const ms = Number(process.hrtime.bigint() - t0) / 1e6; await c.query('reset role');
  (t[`${d} ${k}`] ||= []).push(ms); len[`${d} ${k}`] = res.rows[0].n;
}
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
for (const [k, a] of Object.entries(t)) console.log(`${k} median ${med(a).toFixed(1)} ms (n ${a.length}) len ${len[k]}`);
for (const c of Object.values(cs)) { await c.query("delete from public.settlements where public_slug = 'v16c'"); await c.end(); }
