// V43-LOWER7 (brief docs/chair/2026-11-20/veil/briefs/V43-LOWER7-BRIEF.md at fb908ddf6): THE SERVED ROWS behind the GATE-2
// families of the eight towns. tell2.probe.jsx's `towns` mode, its births byte for byte (tell-common.mjs :: pool, N=2, every
// birth; RV9_ONLY the eight seeds), read as the gate reads them: the twin (projectShareVeil over galleryPayloadFor) and the
// server (get_gallery_dossier, local cluster, createdb -T v28tpl), settings `own` and `off` (tell-common.mjs :: settings),
// Reveal off and DM. Beside each: THE HOUSE-FREE TWIN (the same seed, every hideable house cut after every step:
// tell-common.mjs :: birth(cfg, seed, isHideableHouse), the call out/v31/twins/twins.probe.jsx makes), read the same way.
// Per read: the signature (tell2-signature.mjs, to check against the gate's), the surface's kind-C families with their
// items (tell-surface.mjs, the signature's own), and the raw rows the brief names. Out: RV9_OUT (JSON).
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
import { loadEngine, loadVeil, isRec } from '../../v27/tell/measure/tell-common.mjs';
import { makeSurface, namesOf } from '../../v27/tell/measure/tell-surface.mjs';
import { signatureOf } from '../../v27/tell2/measure/tell2-signature.mjs';
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SRC = process.env.RV6_SRC;
const ONLY = new Set((process.env.RV9_ONLY || '').split(',').filter(Boolean));

it('V43-LOWER7 rows', async () => {
  const E = await loadEngine(SRC); const V = await loadVeil(SRC);
  const { hasMarketInstitution } = await import(`${SRC}/src/domain/facts/market.js`);
  const surfaceC = makeSurface(() => ({}));
  const recs = (v) => (Array.isArray(v) ? v.filter(isRec) : []);
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const dbn = process.env.RV9_SERVER_DB; if (!/^v43x/.test(dbn)) throw new Error(`database prefix must be v43x: ${dbn}`);
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV9_SERVER_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect(); await db.query(`select set_config('test.uid', '', false)`);
  let nrow = 0;
  const server = async (rec, dm, ov) => { // tell2.probe.jsx :: server, as it stands
    nrow += 1; const id = `abcd7f77-0000-0000-0000-${String(nrow).padStart(12, '0')}`; const sl = `l7x${nrow}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted',$6,$7,true)`, [id, rec.name || 'x', JSON.stringify(rec), sl, `${sl}l`, JSON.stringify(ov), dm]);
    const d = (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [sl])).rows[0]?.d;
    await db.query('delete from public.settlements where id = $1', [id]);
    return d;
  };
  /** The rows the brief names, as the page serves them. */
  const rowsOf = (d) => {
    const { H, P } = namesOf(E.isHideableHouse, d);
    const powers = [...recs(d.powerStructure?.factions), ...recs(d.factions)];
    const inP = (n) => P.has(String(n ?? ''));
    return {
      governingName: d.powerStructure?.governingName ?? null, government: d.powerStructure?.government ?? null,
      powers: powers.filter((f) => inP(f.faction ?? f.name) || String(f.category ?? '').toLowerCase() === 'criminal')
        .map((f) => ({ name: f.faction ?? f.name, category: f.category, isGoverning: f.isGoverning, captureState: f.captureState, modifier: f.modifier, crisisNote: f.crisisNote, hidden: f.hidden })),
      inst: recs(d.institutions).filter((h) => H.has(String(h.name ?? '')) || /criminal/i.test(String(h.category ?? '')) || /criminal/i.test(String(h.priorityCategory ?? '')))
        .map((h) => ({ name: h.name, category: h.category, priorityCategory: h.priorityCategory, tags: h.tags, source: h.source })),
      chains: recs(d.economicState?.activeChains).map((c) => ({ name: c.name ?? c.chainName ?? c.id, needKey: c.needKey, processingInstitutions: c.processingInstitutions })),
      spOps: d.economicState?.safetyProfile?.criminalInstitutions ?? '(absent)',
      imports: d.economicState?.primaryImports ?? '(absent)',
      relations: recs(d.powerStructure?.factionRelationships).map((r) => ({ pair: r.pair, type: r.type, captureState: r.captureState })),
      capture: d.powerStructure?.criminalCaptureState ?? '(absent)',
      tensions: recs(d.history?.currentTensions).map((t) => ({ type: t.type, factions: t.factions, label: t.label ?? t.name })),
    };
  };
  const read = (d) => {
    if (!isRec(d)) return null;
    const s = surfaceC(d, namesOf(E.isHideableHouse, d));
    const fams = {}; for (const [k, v] of Object.entries(s)) if (v.kind === 'C') fams[k] = v.items;
    return { sig: signatureOf(d, E.isHideableHouse, hasMarketInstitution).sig, fams, rows: rowsOf(d) };
  };
  const out = [];
  for (const b of E.pool(2, [0, 1])) {
    if (!ONLY.has(b.seed)) continue;
    const A = E.birth(b.cfg, b.seed, null);
    const Bt = E.birth(b.cfg, b.seed, (h) => E.isHideableHouse(h));
    const held = recs(A.institutions).filter((h) => E.isHideableHouse(h)).map((h) => ({ name: h.name, category: h.category, tags: h.tags }));
    for (const [form, doc] of [['town', A], ['houseFree', Bt]]) for (const dm of [false, true]) {
      const { deltas } = V.settings(doc, dm);
      for (const set of ['own', 'off']) {
        const ov = V.write(deltas[set]);
        out.push({ seed: b.seed, size: b.size, form, dm, set, held: form === 'town' ? held : undefined, twin: read(V.twin(doc, dm, ov)), server: read(await server(doc, dm, ov)) });
      }
    }
  }
  await db.end();
  const ad = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await ad.connect(); await ad.query(`drop database if exists ${dbn} with (force)`); await ad.end();
  writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
}, 3_600_000);
