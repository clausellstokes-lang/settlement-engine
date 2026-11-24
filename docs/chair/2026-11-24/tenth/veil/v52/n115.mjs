// VEIL-52 (1)(c), N115's MEASURE IN FIGURES (a timing recipe, not a hiding instrument: it judges nothing a read serves).
//   node n115.mjs <db> <stored dir> <rows: 1|840> <out json>
// LOADS the stored set's 140 documents as PUBLIC rows of the owner (11111111-...): rows=840 is every document x three markers
// (unmarked {}, the default veil, the owner's hand: the tip's writeShareVeil outputs, literal below; galleryImportEqualsRead's
// MARKERS) x Reveal off and on; rows=1 is the first document alone, hand marker, Reveal off. One map per document (its one
// member). Columns a chain lacks are left out (master's chain has every one used here).
// TIMES each door on the hand marker, Reveal off, rows of each document: the gallery read (get_gallery_dossier), the link
// (get_unlisted_dossier), the import (import_gallery_dossier, as the reader 22222222-...), the map member (get_gallery_map);
// one pass over the 140 documents (rows=840) or 30 reads of the one (rows=1); per door: median, p90, mean ms.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
const pg = (await import('/var/tmp/v18/pgmod/node_modules/pg/lib/index.js')).default;
const [DB, DIR, ROWS, OUT] = process.argv.slice(2);
const OWNER = '11111111-1111-1111-1111-111111111111'; const READER = '22222222-2222-2222-2222-222222222222';
const MARK = {
  unmarked: {},
  default: { $veil: { v: 1, deltas: [] } },
  hand: { $veil: { v: 1, deltas: ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'].map((address) => ({ address, hidden: false })), mode: 'live', at: '2026-11-01T00:00:00.000Z' } },
};
const files = readdirSync(DIR).filter((f) => /^r3m-.*\.json$/.test(f)).sort();
const docs = (ROWS === '1' ? files.slice(0, 1) : files).map((f) => ({ seed: f.replace(/\.json$/, ''), doc: JSON.parse(readFileSync(`${DIR}/${f}`, 'utf8')) }));
const db = new pg.Client({ host: process.env.PGHOST || '/var/tmp/rv7', user: 'postgres', database: DB }); await db.connect();
const cols = new Set((await db.query("select column_name c from information_schema.columns where table_schema='public' and table_name='settlements'")).rows.map((r) => r.c));
const want = ['gallery_member_overrides', 'gallery_share_dm', 'gallery_importable', 'unlisted_slug', 'visibility'];
const missing = want.filter((c) => !cols.has(c));
await db.query(`select set_config('test.uid', '', false)`);
let n = 0; const handSlug = [];
for (const [i, { doc }] of docs.entries()) {
  for (const mk of ROWS === '1' ? ['hand'] : Object.keys(MARK)) for (const dm of ROWS === '1' ? [false] : [false, true]) {
    n += 1; const id = `abcd5115-0000-0000-0000-${String(n).padStart(12, '0')}`; const sl = `t${n}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,$2,$3,'town',$4,true,$5,now(),$6,'unlisted',$7,$8,true)`, [id, OWNER, doc.name || 'x', JSON.stringify(doc), sl, `${sl}l`, JSON.stringify(MARK[mk]), dm]);
    if (mk === 'hand' && !dm) {
      await db.query(`insert into public.saved_maps (user_id, name, map_data, is_public, public_slug, unlisted_slug, visibility, share_kind, gallery_share_campaign, gallery_importable)
        values ($1, 'm', $2, true, $3, $4, 'unlisted', 'map_with_campaign', true, true)`, [OWNER, JSON.stringify({ campaign: { settlementIds: [id] } }), `${sl}m`, `${sl}ml`]);
      handSlug.push(sl);
    }
  }
}
await db.query('analyze');
const pub = (await db.query('select count(*)::int n from public.settlements where is_public')).rows[0].n;
const DOORS = {
  gallery: (sl) => db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [sl]),
  link: (sl) => db.query("select public.get_unlisted_dossier($1) -> 'dossier' d", [`${sl}l`]),
  import: async (sl) => { await db.query(`select set_config('test.uid', $1, false)`, [READER]); const r = await db.query('select to_jsonb(g.data) d from public.import_gallery_dossier($1) g', [sl]); await db.query(`select set_config('test.uid', '', false)`); return r; },
  map: (sl) => db.query("select public.get_gallery_map($1) #> '{members,0,settlement}' d", [`${sl}m`]),
};
// READ-COST (the chair, 22:48): N115_LISTS=1 times the gallery's LIST reads instead, the tile lists the gallery page calls first
// (gallery.js :: fetchPublicGalleryViaRpc's list_gallery_dossiers with its defaults, fetchFeatured's list_featured_dossiers,
// fetchCurated's list_curated_dossiers), 20 reads each, the same rows.
if (process.env.N115_LISTS === '1') {
  for (const k of Object.keys(DOORS)) delete DOORS[k];
  DOORS.list_gallery = () => db.query("select count(*)::int d from public.list_gallery_dossiers(0, 24, 'relevant', '', '{}'::jsonb, true)");
  DOORS.list_featured = () => db.query('select count(*)::int d from public.list_featured_dossiers()');
  DOORS.list_curated = () => db.query('select count(*)::int d from public.list_curated_dossiers()');
}
const t = {}; const empty = {};
for (const door of Object.keys(DOORS)) t[door] = [];
const passes = 1; // one pass: rows=840 is 140 reads a door (three passes outran a 30-minute window on the tip: 22:06, killed)
for (let p = 0; p < passes; p += 1) for (const sl of (process.env.N115_LISTS === '1' ? Array(20).fill(handSlug[0]) : ROWS === '1' ? Array(30).fill(handSlug[0]) : handSlug)) for (const [door, f] of Object.entries(DOORS)) {
  const t0 = process.hrtime.bigint(); const r = await f(sl); const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  t[door].push(ms); if (r.rows[0]?.d == null) empty[door] = (empty[door] || 0) + 1;
}
const stat = (a) => { const s = [...a].sort((x, y) => x - y); return { n: s.length, median: +s[s.length >> 1].toFixed(2), p90: +s[Math.floor(s.length * 0.9)].toFixed(2), mean: +(s.reduce((x, y) => x + y, 0) / s.length).toFixed(2) }; };
const res = { db: DB, rows: ROWS, publicRows: pub, missingColumns: missing, empty, doors: Object.fromEntries(Object.entries(t).map(([k, v]) => [k, stat(v)])) };
writeFileSync(OUT, JSON.stringify(res, null, 1));
console.log(JSON.stringify(res));
await db.end();
