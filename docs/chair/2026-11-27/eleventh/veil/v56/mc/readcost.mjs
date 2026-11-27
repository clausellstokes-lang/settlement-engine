// MC (VEIL-56), READ-COST's cure measured on LOCAL TRIAL COPIES (V11 (i) and (ii)), n115.mjs's rows.
//   node readcost.mjs <db (a copy of a template holding 212)> <stored dir> <out json> <fixed-salt.sql> <trial.sql ...>
// Loads n115's 840 public rows (the 140 stored documents x {unmarked, default, hand} x Reveal off/on). Applies the fixed salt
// (so two reads of one row serve the same bytes). PHASE "as built": times list_gallery_dossiers (the gallery page's first call,
// its defaults; 20 reads) and get_gallery_dossier (20 rows: the hand marker, Reveal off, every 7th document) and records the
// md5 of the list's whole answer, of each dossier row's served columns (view_count aside) and of the tile helper's whole
// answer. Then EACH TRIAL FILE in turn is applied ON TOP of the last and the same is measured and compared with "as built":
// the list's answer, each dossier row and the helper's rows must be the same bytes. A timing recipe and a byte comparison.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const pg = (await import('/var/tmp/v18/pgmod/node_modules/pg/lib/index.js')).default;
const [DB, DIR, OUT, SALT, ...TRIALS] = process.argv.slice(2);
const OWNER = '11111111-1111-1111-1111-111111111111';
const MARK = {
  unmarked: {},
  default: { $veil: { v: 1, deltas: [] } },
  hand: { $veil: { v: 1, deltas: ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'].map((address) => ({ address, hidden: false })), mode: 'live', at: '2026-11-01T00:00:00.000Z' } },
};
const md5 = (s) => createHash('md5').update(s).digest('hex');
const files = readdirSync(DIR).filter((f) => /^r3m-.*\.json$/.test(f)).sort();
const db = new pg.Client({ host: '/var/tmp/rv7', user: 'postgres', database: DB }); await db.connect();
let n = 0; const handSlug = [];
for (const f of files) {
  const raw = readFileSync(`${DIR}/${f}`, 'utf8'); const doc = JSON.parse(raw);
  for (const mk of Object.keys(MARK)) for (const dm of [false, true]) {
    n += 1; const id = `abcd5115-0000-0000-0000-${String(n).padStart(12, '0')}`; const sl = `t${n}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,$2,$3,'town',$4,true,$5,now(),$6,'unlisted',$7,$8,true)`, [id, OWNER, doc.name || 'x', raw, sl, `${sl}l`, JSON.stringify(MARK[mk]), dm]);
    if (mk === 'hand' && !dm) handSlug.push(sl);
  }
}
await db.query(readFileSync(SALT, 'utf8'));
await db.query('analyze');
const slugs = handSlug.filter((_, i) => i % 7 === 0);
const med = (a) => { const s = [...a].sort((x, y) => x - y); return +s[s.length >> 1].toFixed(1); };
const ms = async (q, p) => { const t0 = process.hrtime.bigint(); const r = await db.query(q, p); return [Number(process.hrtime.bigint() - t0) / 1e6, r]; };
const LIST = "select coalesce(jsonb_agg(to_jsonb(x) order by x.id), '[]')::text t from public.list_gallery_dossiers(0, 24, 'relevant', '', '{}'::jsonb, true) x";
const measure = async (label) => {
  const lt = []; let lmd5 = null;
  for (let i = 0; i < 20; i += 1) { const [t, r] = await ms(LIST); lt.push(t); lmd5 = md5(r.rows[0].t); }
  const gt = []; const gm = {};
  for (const sl of slugs) { const [t, r] = await ms("select (to_jsonb(g) - 'view_count')::text t from public.get_gallery_dossier($1) g", [sl]); gt.push(t); gm[sl] = r.rows[0] ? md5(r.rows[0].t) : null; }
  const hr = (await db.query("select md5(coalesce(string_agg(to_jsonb(h)::text, '|' order by h.id), '')) m, count(*)::int c from public._gallery_public_tile_rows() h")).rows[0];
  const hasOld = (await db.query("select count(*)::int c from pg_proc where proname = '_gallery_public_tile_rows_old'")).rows[0].c > 0;
  const old = hasOld ? (await db.query("select md5(coalesce(string_agg(to_jsonb(h)::text, '|' order by h.id), '')) m from public._gallery_public_tile_rows_old() h")).rows[0].m : null;
  const res = { label, listMedianMs: med(lt), dossierMedianMs: med(gt), listMd5: lmd5, dossierMd5: gm, helperMd5: hr.m, helperRows: hr.c, oldHelperMd5: old };
  console.log(JSON.stringify({ ...res, dossierMd5: undefined })); return res;
};
const out = { db: DB, publicRows: n, dossierSlugs: slugs.length, phases: [] };
const base = await measure('as built'); out.phases.push(base);
for (const t of TRIALS) {
  const a0 = Date.now(); await db.query(readFileSync(t, 'utf8')); const applyMs = Date.now() - a0;
  const r = await measure(t.split('/').pop()); r.applyMs = applyMs;
  r.sameAsBuilt = { list: r.listMd5 === base.listMd5, dossierRows: Object.keys(base.dossierMd5).filter((k) => base.dossierMd5[k] === r.dossierMd5[k]).length,
    dossierOf: slugs.length, helper: r.helperMd5 === base.helperMd5, helperVsOld: r.oldHelperMd5 == null ? null : r.oldHelperMd5 === r.helperMd5 };
  console.log(t.split('/').pop(), 'same as built:', JSON.stringify(r.sameAsBuilt));
  out.phases.push(r);
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
await db.end();
