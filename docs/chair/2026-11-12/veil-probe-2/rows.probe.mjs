/**
 * COHERENCE-VEIL-2: the review's correctness rows (F1, F2, F3, F7), read by the real client at 210, at
 * the reviewed 211 (ad17ec005, ORIG_211 names its text) and at the working 211, on the native cluster.
 *   PG_MODULE=<pg install> PGHOST=<socket dir> PGPORT=<port> PGUSER=postgres ORIG_211=<file> FORCE_ALL=<json> \
 *   npx vitest run --config docs/chair/2026-11-12/veil-probe-2/vitest.config.mjs rows
 * REUSE=1 reads the databases a previous run built. Writes veil-probe-2/out/rows.json.
 */
import { it, vi } from 'vitest';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { nativeChain, open, OWNER } from './native.mjs';
import { H, BROWSER, everyEye } from './client.mjs';

vi.mock('../../../../src/lib/supabase.js', async () => (await import('./client.mjs')).fakeSupabase());
const OUT = resolve(process.cwd(), 'docs/chair/2026-11-12/veil-probe-2/out');

it('the review rows', async () => {
  const F = '211_server_side_share_veil.sql';
  const build = (n, t, r) => (process.env.REUSE ? open(n) : nativeChain(n, t, r));
  const dbs = { at210: await build('cv210', 210, {}), ...(process.env.ORIG_211 ? { orig211: await build('cv211o', 999, { [F]: process.env.ORIG_211 }) } : {}), work211: await build('cv211w', 999, process.env.WORK_211 ? { [F]: process.env.WORK_211 } : {}) };
  const out = { failed: Object.fromEntries(Object.entries(dbs).map(([k, v]) => [k, v.failed])), rows: {} };
  const gallery = await import('../../../../src/lib/gallery.js');
  const veil = await import('../../../../src/domain/display/galleryVeil.js');
  const { generateSettlementPipeline: gen } = await import('../../../../src/generators/generateSettlementPipeline.js');
  const { composePublicProse } = await import('../../../../src/components/new/publicProseCompose.js');
  let n = 0;
  async function put(db, rec, ov, extra = {}) {
    n += 1;
    const id = `aaaaaaaa-0000-0000-0000-${String(n).padStart(12, '0')}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,$2,'T','town',$3,true,$4,now(),$5,'unlisted',$6,$7,true)`, [id, OWNER, typeof rec === 'string' ? rec : JSON.stringify(rec), `p${n}`, `l${n}`, JSON.stringify(ov), !!extra.dm]);
    return { id, slug: `p${n}`, link: `l${n}` };
  }
  async function read(db, slug, link) {
    H.db = db; H.uid = '';
    const g = await gallery.fetchPublicDossier(slug); const gResp = H.last;
    const l = await gallery.fetchPublicDossier(link); const lResp = H.last;
    return { g, gResp, l, lResp };
  }
  const has = (v, s) => JSON.stringify(v ?? null).includes(s);
  const cell = async (name, rec, ovOf, secret, extra) => {
    const row = {};
    for (const [k, { db }] of Object.entries(dbs)) {
      const ov = ovOf(veil);
      const { slug, link } = await put(db, rec, ov, extra);
      const r = await read(db, slug, link);
      row[k] = {
        galleryResp: r.gResp?.error ? `RAISE ${r.gResp.error.slice(0, 60)}` : has(r.gResp, secret),
        galleryPage: r.g ? has(r.g.settlement, secret) : 'no page',
        linkResp: r.lResp?.error ? `RAISE ${r.lResp.error.slice(0, 60)}` : has(r.lResp, secret),
        linkPage: r.l ? has(r.l.settlement, secret) : 'no page',
        mode: r.g?.galleryMode,
      };
    }
    out.rows[name] = row;
  };

  // F2: one minimal town per row, every eye the panel offers shut through its own model and writer
  // the card's own eyes (its box and every depth eye on it), not the class switches, which hide by kind
  const cardEyes = (v, pub) => v.curateModelFor(pub, []).sections.flatMap((s) => s.cards.flatMap((c) => [...(c.whole ? [c.whole.address] : []), ...c.eyes.map((e) => e.address)]));
  const shutAll = (rec) => (v) => v.writeShareVeil({}, cardEyes(v, v.galleryPayloadFor(JSON.parse(typeof rec === 'string' ? rec : JSON.stringify(rec)), {})).map((address) => ({ address, hidden: true })));
  const town = (extra) => ({ name: 'T', ...extra });
  const F2 = [
    ['F2 event label null', town({ history: { historicalEvents: [{ label: null, description: 'EVSECRET_LABELNULL' }] } }), 'EVSECRET_LABELNULL'],
    ['F2 event label ""', town({ history: { historicalEvents: [{ label: '', description: 'EVSECRET_LABELEMPTY' }] } }), 'EVSECRET_LABELEMPTY'],
    ['F2 event label 0', town({ history: { historicalEvents: [{ label: 0, description: 'EVSECRET_LABELZERO' }] } }), 'EVSECRET_LABELZERO'],
    ['F2 event name 1e-7', town({ history: { historicalEvents: [{ name: 1e-7, description: 'EVSECRET_TINYNAME' }] } }), 'EVSECRET_TINYNAME'],
    ['F2 institution id 1e-7', town({ institutions: [{ id: 1e-7, name: 'House', desc: 'INSTSECRET_TINYID' }] }), 'INSTSECRET_TINYID'],
    ['F2 institution id 9007199254740993 (raw)', '{"name":"T","institutions":[{"id":9007199254740993,"name":"House","desc":"INSTSECRET_BIGID"}]}', 'INSTSECRET_BIGID'],
    ['F2 conflict parties [1e-7,"x"]', town({ conflicts: [{ parties: [1e-7, 'x'], stakes: 'CONFSECRET_STAKES', desc: 'CONFSECRET_DESC' }] }), 'CONFSECRET'],
    ['F2 npc id 1e-7', town({ npcs: [{ id: 1e-7, name: 'A', personality: { core: 'NPCSECRET_TINYID' } }] }), 'NPCSECRET_TINYID'],
  ];
  for (const [name, rec, secret] of F2) await cell(name, rec, shutAll(rec), secret);

  // F3: an institution id beyond double range (a raw write)
  for (const v of ['1e400', '-1e400', '1e-400']) {
    const raw = `{"name":"T","institutions":[{"id":${v},"name":"House","desc":"ok"}]}`;
    await cell(`F3 institution id ${v}`, raw, (vv) => vv.writeShareVeil({}, []), 'House');
  }

  // F1: the Force-all request, Reveal DM on, frozen by the client's own writer; the live row edited after
  if (process.env.FORCE_ALL) {
    const req = JSON.parse(readFileSync(process.env.FORCE_ALL, 'utf-8'));
    const raw = gen(req.config, null, { seed: req.seed, customContent: {} });
    const rec = { ...raw, publicProse: composePublicProse(raw) };
    const copy = veil.galleryPayloadFor(rec, { shareDm: true });
    const live = structuredClone(rec);
    live.institutions[0].desc = `POSTSNAPSHOT_SPOILER ${live.institutions[0].desc || ''}`;
    const at = '2026-11-12T00:00:00.000Z';
    const ovF = (v) => v.writeShareVeil({}, [], { mode: 'snapshot', at, snapshot: copy });
    out.copyJsLen = JSON.stringify(copy).length;
    out.copyStored = !!ovF(veil).$veil.snapshot;
    await cell('F1 Force all, Reveal DM on, snapshot', live, ovF, 'POSTSNAPSHOT_SPOILER', { dm: true });
    for (const [k, { db }] of Object.entries(dbs)) {
      out.rows['F1 Force all, Reveal DM on, snapshot'][k].pgTextLen = (await db.query('select length($1::jsonb::text) as n', [JSON.stringify(copy)])).rows[0].n;
    }
  }

  // F7: a snapshot member of a public map, edited after freezing; the member's own listing beside it
  {
    const raw = gen({ settType: 'village', ...BROWSER }, null, { seed: 'server-veil-village-3', customContent: {} });
    const rec = { ...raw, publicProse: composePublicProse(raw) };
    const copy = veil.galleryPayloadFor(rec, {});
    const live = structuredClone(rec);
    live.institutions[0].desc = 'MAPSPOILER_AFTER_FREEZE';
    const row = {};
    for (const [k, { db }] of Object.entries(dbs)) {
      const { id, slug } = await put(db, live, veil.writeShareVeil({}, [], { mode: 'snapshot', at: '2026-11-12T00:00:00.000Z', snapshot: copy }));
      const mapSlug = `map-${n}`;
      await db.query(`insert into public.saved_maps (id,user_id,name,map_data,is_public,public_slug,share_kind,gallery_share_campaign)
        values (gen_random_uuid(),$1,'m',$2,true,$3,'map_with_campaign',true)`, [OWNER, JSON.stringify({ campaign: { settlementIds: [id] } }), mapSlug]);
      H.db = db; H.uid = '';
      const map = await gallery.fetchGalleryMap(mapSlug);
      const mResp = H.last;
      const g = await gallery.fetchPublicDossier(slug);
      row[k] = { listingPage: has(g.settlement, 'MAPSPOILER_AFTER_FREEZE'), mapResp: has(mResp, 'MAPSPOILER_AFTER_FREEZE'),
        mapPage: has(map?.members, 'MAPSPOILER_AFTER_FREEZE') };
    }
    out.rows['F7 snapshot map member edited after freezing'] = row;
  }
  mkdirSync(OUT, { recursive: true });
  writeFileSync(resolve(OUT, 'rows.json'), JSON.stringify(out, null, 1));
  for (const { db } of Object.values(dbs)) await db.end();
});
