// REVIEW-VEIL-13 — THE LEAD FROM ANOTHER LANE (the chair, the seventh, REVIEW-VEIL-13.txt): `brokerageLegalityOf` reads a
// house's OWN tags (serviceKeys + 'brokerage' + 'criminal'), so an illegal brokerage whose function eye is shut (the eye
// takes tags, facets, serviceKeys) may stop counting as hideable inside the veil itself. Executed on born towns:
// (0) CENSUS: every born illegal brokerage; is it hideable ALSO by category or facet (then the lead cannot bite)?
// (1) PLANT: a born town given ONE illegal brokerage that is hideable BY ITS TAGS ALONE (category 'economic', no facet),
//     named "Quillmarrow Listening House", with a holder card and a power-free sentence naming it in another house's desc.
//     Stored with the DEFAULT veil (live). Served by get_gallery_dossier (anon) and the twin (galleryPayloadFor ->
//     projectServedVeil/projectShareVeil), Reveal DM off and on. Search: the name, case-blind, in every served string/key.
//     Also: does the default veil hold the plant's card address; does isHideable() accept it on the stored and the
//     public-safe copy; does the stored -> public-safe projection keep `tags`.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const strs = (v, out = []) => { if (typeof v === 'string') out.push(v); else if (Array.isArray(v)) v.forEach((x) => strs(x, out)); else if (isRec(v)) for (const [k, x] of Object.entries(v)) { out.push(k); strs(x, out); } return out; };
const PLANT = 'Quillmarrow Listening House';
const hits = (doc, name) => strs(doc).filter((s) => s.toLowerCase().includes(name.toLowerCase()));
it('brk', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const DB = 'brk';
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  await admin.query(`drop database if exists ${DB} with (force)`); await admin.query(`create database ${DB} template ${process.env.RV10_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: DB }); await db.connect();
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const CV = await import(`${SRC}/src/domain/people/cardVeil.js`);
  const BT = await import(`${SRC}/src/data/informationBrokerageTuning.js`);
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  let compose = null; let withPP = null;
  try { compose = (await import(`${SRC}/src/components/new/publicProseCompose.js`)).composePublicProse; withPP = (await import(`${SRC}/src/domain/display/publicProse.js`)).withPublicProse; } catch { /* none */ }
  await loadGenerationLawPayloads();
  const out = []; const say = (s) => { out.push(s); };
  const census = { towns: 0, illegal: 0, byCat: {}, tagsOnly: 0, ex: [] };
  let planted = 0; let n = 0;
  const N = Number(process.env.RV10_N || 1);
  for (let k = 0; k < N; k += 1) for (const size of ['village', 'town', 'city', 'metropolis']) for (const crisis of ['none', 'infiltrated', 'indebted', 'none']) {
    n += 1; const seed = `rv13-brk-${size}-${crisis}-${k}-${n}`;
    const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded', priorities: { ...(DEFAULT_CONFIG.priorities || {}), criminal: 85 } };
    let A = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) }), null, { seed, customContent: {} });
    A = { ...A }; if (compose) { delete A.publicProse; A = withPP(A, compose(A)); } A = JSON.parse(JSON.stringify(A));
    census.towns += 1;
    for (const i of A.institutions || []) {
      if (BT.brokerageLegalityOf(i) !== 'illegal') continue;
      census.illegal += 1; const cat = `${i.category}|${i.priorityCategory}|clan=${CV.isClandestineInstitution(i)}`; census.byCat[cat] = (census.byCat[cat] || 0) + 1;
      const bare = { ...i }; delete bare.tags; delete bare.facets; delete bare.serviceKeys;
      if (!CV.isHideableHouse(bare)) { census.tagsOnly += 1; if (census.ex.length < 4) census.ex.push(`${seed}: ${i.name}`); }
    }
    // (1) the plant, on the first 6 towns
    if (planted >= 6) continue; planted += 1;
    const host = (A.institutions || []).find((i) => !CV.isHideableHouse(i) && typeof i.description === 'string');
    const plant = { name: PLANT, category: 'economic', priorityCategory: 'economic', tags: ['brokerage', 'criminal'], serviceKeys: ['info_query', 'info_plant'], description: 'Ledgers of whispers kept behind a chandler’s shop.', id: 'inst_rv13_quill' };
    A.institutions = [...(A.institutions || []), plant];
    if (host) host.description = `${host.description} Its clerks buy what the ${PLANT} sells.`;
    const card = (A.npcs || []).find((p) => isRec(p) && !isRec(p.institution));
    if (card) card.institution = { kind: 'house', key: PLANT, title: 'Keeper of Ledgers', veiled: true };
    const tagsOnly = !CV.isHideableHouse({ ...plant, tags: undefined, serviceKeys: undefined }) && CV.isHideableHouse(plant);
    const defaults = veil.defaultVeilFor(A);
    const addrs = (Array.isArray(defaults) ? defaults : (defaults?.hidden || defaults?.addresses || Object.keys(defaults || {}))).map((a) => (typeof a === 'string' ? a : a?.address)).filter(Boolean);
    const pid = addrs.find((a) => /^card:institution:/.test(a) && a.toLowerCase().includes('quill')) || null;
    if (planted === 1) say(`  defaults shape: ${Array.isArray(defaults) ? 'array' : typeof defaults} keys=${JSON.stringify(Object.keys(defaults || {})).slice(0, 120)} sample=${JSON.stringify(addrs.filter((a) => /institution/.test(a)).slice(0, 4))}`);
    const ov = veil.writeShareVeil({}, [], { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
    say(`${seed}: plant tags-only=${tagsOnly}; default veil holds its card: ${pid}; isHideable(stored)=${pid ? veil.isHideable(pid, A) : 'n/a'}`);
    const ovMarked = ov;
    for (const [mk, dm] of [[true, false], [true, true], [false, false]]) {
      const ov = mk ? ovMarked : {};
      const pub = veil.galleryPayloadFor(A, { shareDm: dm, memberOverrides: ov });
      const twin = veil.projectServedVeil(pub, ov);
      const psInst = (pub.institutions || []).find((i) => i && i.name === PLANT);
      const id = `abcd9c13-0000-0000-0000-${String(n * 4 + (dm ? 1 : 0) + (mk ? 0 : 2)).padStart(12, '0')}`; const slug = `brk${n}${dm ? 'd' : 'p'}${mk ? 'm' : 'u'}`;
      await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
        values ($1,'11111111-1111-1111-1111-111111111111','I','town',$2,true,$3,now(),$4,$5,true,false)`, [id, JSON.stringify(A), slug, JSON.stringify(ov), dm]);
      await db.query('set role anon'); const row = (await db.query('select * from public.get_gallery_dossier($1)', [slug])).rows[0]; await db.query('reset role');
      await db.query('delete from public.settlements where id = $1', [id]);
      const served = row?.data ?? row?.settlement ?? row;
      const sh = hits(served, 'quillmarrow'); const th = hits(twin, 'quillmarrow');
      say(`  dm=${dm}: public-safe copy keeps the plant's tags: ${psInst ? JSON.stringify(psInst.tags ?? null) : 'plant not in public-safe copy'}; isHideable(public-safe)=${pid ? veil.isHideable(pid, pub) : 'n/a'}`);
      say(`  ${mk ? 'DEFAULT VEIL' : 'CONTROL unmarked'} dm=${dm}: SERVER hits ${sh.length}${sh.length ? ' e.g. ' + JSON.stringify(sh.slice(0, 2)).slice(0, 220) : ''} | TWIN hits ${th.length}${th.length ? ' e.g. ' + JSON.stringify(th.slice(0, 2)).slice(0, 220) : ''}`);
    }
  }
  say(`CENSUS: ${census.towns} born towns (criminal dial 85), ${census.illegal} illegal brokerages; by category|priorityCategory|clandestine: ${JSON.stringify(census.byCat)}; hideable by tags ALONE: ${census.tagsOnly} ${JSON.stringify(census.ex)}`);
  writeFileSync(process.env.RV10_OUT, out.join('\n') + '\n');
  await db.end();
});
