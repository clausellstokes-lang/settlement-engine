// MC (VEIL-56), THE PLATFORM's LIMITS against this machine: what ONE member of a campaign map costs, untracked.
//   node sizes.mjs <db (a copy of a template holding 212)> <stored dir> <unmarked|hand> <out json>
// Loads the 140 stored documents as the owner's public rows under the marker (unmarked {} or the owner's hand marker,
// b-steps.mjs's literal), ONE single-member map per document and ONE map of all 140. Reads (untracked) the 140 single
// maps once each, then the 140-member map once: per-member ms by the seed's size class, and the whole map's ms (the sum
// of the singles should approach it). A timing recipe: it judges nothing a read serves.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
const pg = (await import('/var/tmp/v18/pgmod/node_modules/pg/lib/index.js')).default;
const [DB, DIR, MK, OUT] = process.argv.slice(2);
const OWNER = '11111111-1111-1111-1111-111111111111';
const HAND = { $veil: { v: 1, deltas: ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'].map((address) => ({ address, hidden: false })), mode: 'live', at: '2026-11-01T00:00:00.000Z' } };
const ov = MK === 'hand' ? HAND : {};
const files = readdirSync(DIR).filter((f) => /^r3m-.*\.json$/.test(f)).sort();
const db = new pg.Client({ host: '/var/tmp/rv7', user: 'postgres', database: DB }); await db.connect();
const ids = []; const meta = [];
for (const [i, f] of files.entries()) {
  const id = `abcd8000-0000-0000-0000-${String(i + 1).padStart(12, '0')}`; ids.push(id);
  const raw = readFileSync(`${DIR}/${f}`, 'utf8'); const doc = JSON.parse(raw);
  await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,gallery_member_overrides,gallery_share_dm,gallery_importable)
    values ($1,$2,$3,'town',$4,true,$5,now(),$6,false,true)`, [id, OWNER, doc.name || 'x', raw, `sz${i}`, JSON.stringify(ov)]);
  await db.query(`insert into public.saved_maps (user_id, name, map_data, is_public, public_slug, share_kind, gallery_share_campaign, gallery_importable)
    values ($1, 'm', $2, true, $3, 'map_with_campaign', true, true)`, [OWNER, JSON.stringify({ campaign: { settlementIds: [id] } }), `szm${i}`]);
  meta.push({ seed: f.replace(/\.json$/, ''), size: f.split('-')[1], bytes: raw.length });
}
await db.query(`insert into public.saved_maps (user_id, name, map_data, is_public, public_slug, share_kind, gallery_share_campaign, gallery_importable)
  values ($1, 'm', $2, true, 'szall', 'map_with_campaign', true, true)`, [OWNER, JSON.stringify({ campaign: { settlementIds: ids } })]);
await db.query('analyze');
const time = async (slug) => { const t0 = process.hrtime.bigint(); const r = await db.query("select jsonb_array_length(public.get_gallery_map($1) -> 'members') n", [slug]); return { ms: Number(process.hrtime.bigint() - t0) / 1e6, n: r.rows[0].n }; };
await time('szm0'); // warm
for (const [i, m] of meta.entries()) { const r = await time(`szm${i}`); m.ms = +r.ms.toFixed(1); m.served = r.n; }
const whole = await time('szall');
const empty0 = await (async () => { const t0 = process.hrtime.bigint(); await db.query("select public.get_gallery_map('nosuch')"); return Number(process.hrtime.bigint() - t0) / 1e6; })();
const st = (a) => { const s = [...a].sort((x, y) => x - y); return { n: s.length, mean: +(s.reduce((x, y) => x + y, 0) / s.length).toFixed(1), median: s[s.length >> 1], p90: s[Math.floor(s.length * 0.9)], max: s[s.length - 1] }; };
const bySize = {}; for (const m of meta) (bySize[m.size] ||= []).push(m.ms);
const res = { db: DB, marker: MK, members: meta.length, single: st(meta.map((m) => m.ms)), bySize: Object.fromEntries(Object.entries(bySize).map(([k, v]) => [k, st(v)])),
  sumOfSingles: +meta.reduce((x, m) => x + m.ms, 0).toFixed(0), wholeMapMs: +whole.ms.toFixed(0), wholeServed: whole.n, missMs: +empty0.toFixed(2), perDoc: meta };
writeFileSync(OUT, JSON.stringify(res, null, 1));
console.log(JSON.stringify({ ...res, perDoc: undefined }));
await db.end();
