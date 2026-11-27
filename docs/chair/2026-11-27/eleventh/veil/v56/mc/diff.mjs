// MC (VEIL-56): THE DIFFERENTIAL a proposed speed cure must pass: every door's served body, row for row, on the stored set.
//   node diff.mjs <db> <stored dir> <out json>
// The db must hold the FIXED-SALT copy of _gallery_veil (fixed-salt.sql: the one salt a call replaced by a constant, so two
// databases serve comparable bytes); the base and the trial databases differ ONLY by the trial's functions. For each stored
// document, ONE AT A TIME (so the gallery read's tile join stays at six public rows): six rows (unmarked {}, the default
// veil, the owner's hand marker; Reveal DM off and on), each with its own map of one member; the four doors read (the
// gallery read, the party link, the import as another user, the map member); the md5 of each served body's text and its
// length recorded; then the rows deleted. Two outputs are compared by cmp-diff.mjs. It judges nothing about what is served:
// it only says whether two databases serve the same bytes.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const pg = (await import('/var/tmp/v18/pgmod/node_modules/pg/lib/index.js')).default;
const [DB, DIR, OUT] = process.argv.slice(2);
const OWNER = '11111111-1111-1111-1111-111111111111'; const READER = '22222222-2222-2222-2222-222222222222';
const MARK = {
  unmarked: {},
  default: { $veil: { v: 1, deltas: [] } },
  hand: { $veil: { v: 1, deltas: ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'].map((address) => ({ address, hidden: false })), mode: 'live', at: '2026-11-01T00:00:00.000Z' } },
};
const files = readdirSync(DIR).filter((f) => /^r3m-.*\.json$/.test(f)).sort();
const db = new pg.Client({ host: '/var/tmp/rv7', user: 'postgres', database: DB }); await db.connect();
const md5 = (s) => createHash('md5').update(s).digest('hex');
const rows = []; const t0 = Date.now(); let n = 0;
await db.query(`select set_config('test.uid', '', false)`);
for (const f of files) {
  const raw = readFileSync(`${DIR}/${f}`, 'utf8'); const doc = JSON.parse(raw); const made = [];
  for (const mk of Object.keys(MARK)) for (const dm of [false, true]) {
    n += 1; const id = `abcd9000-0000-0000-0000-${String(n).padStart(12, '0')}`; const sl = `d${n}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,$2,$3,'town',$4,true,$5,now(),$6,'unlisted',$7,$8,true)`, [id, OWNER, doc.name || 'x', raw, sl, `${sl}l`, JSON.stringify(MARK[mk]), dm]);
    await db.query(`insert into public.saved_maps (user_id, name, map_data, is_public, public_slug, share_kind, gallery_share_campaign, gallery_importable)
      values ($1, 'm', $2, true, $3, 'map_with_campaign', true, true)`, [OWNER, JSON.stringify({ campaign: { settlementIds: [id] } }), `${sl}m`]);
    made.push({ id, sl, mk, dm });
  }
  for (const { id, sl, mk, dm } of made) {
    const g = await db.query('select to_jsonb(g.data)::text d from public.get_gallery_dossier($1) g', [sl]);
    const l = await db.query("select (public.get_unlisted_dossier($1) -> 'dossier')::text d", [`${sl}l`]);
    await db.query(`select set_config('test.uid', $1, false)`, [READER]);
    const im = await db.query('select to_jsonb(g.data)::text d from public.import_gallery_dossier($1) g', [sl]);
    await db.query(`select set_config('test.uid', '', false)`);
    const m = await db.query("select (public.get_gallery_map($1) #> '{members,0,settlement}')::text d", [`${sl}m`]);
    for (const [door, r] of [['gallery', g], ['link', l], ['import', im], ['map', m]]) {
      const d = r.rows[0]?.d ?? null;
      rows.push({ seed: f.replace(/\.json$/, ''), mk, dm, door, len: d == null ? -1 : d.length, md5: d == null ? null : md5(d) });
    }
    await db.query('delete from public.saved_maps where public_slug = $1', [`${sl}m`]);
    await db.query('delete from public.settlements where id = $1', [id]);
  }
}
writeFileSync(OUT, JSON.stringify({ db: DB, reads: rows.length, seconds: Math.round((Date.now() - t0) / 1000), rows }));
console.log(DB, 'reads', rows.length, 'null bodies', rows.filter((r) => r.md5 == null).length, 'seconds', Math.round((Date.now() - t0) / 1000));
await db.end();
