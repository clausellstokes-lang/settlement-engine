// R3-TELL-8b unit (viii) STEP 2 (i), THE ARM (VEIL-32's second builder; ruling 84's two halves, ruling 88; brief R3-TELL-8 and
// its amendments). An instrument beside tell2.sh, over the R3 gate's 140 births (tell-common.mjs :: pool, byte for byte as
// tell2.sh births them: the 92 hidden-house towns and the 48 controls), BOTH ENGINES (the SERVER, get_gallery_dossier on
// RV9_SERVER_TPL = v27x211 + this tree's 212; the TWIN, projectShareVeil over galleryPayloadFor), every setting
// tell-common.mjs :: settings computes (own, g:000..g:110, allOpen, off), 'allShown' (nothing hidden) and 'unmarked' (the old
// stored shape), Reveal off and DM. Per page:
//   h1     HALF 1, TOTAL: the served document carries `economicState.safetyProfile.crimeTypes` (1) or not (0)
//   open   the types' grouping proven open by the served data (criminalInstitutions an array: TELL8 1e, 6,528 of 6,528)
//   ref    THE RECORD REFERENCE over the SERVED page (ruling 88: the writer over the served page governs):
//          generateSafetyProfile(served config, tier, houses) then settleCrimeLinesToSignal over the served seats, houses,
//          tensions and services, [type, desc] pairs; '#none' where the grouping is not proven open (the page draws none)
//   shown  the list the shared PAGE PRINTS: the page's own path over the served document (the server's: projectServedVeil
//          with the served marker, then pageRederive.js :: rederiveForPage; the twin's: rederiveForPage over its
//          projection), [type, desc] pairs, '#absent' where the page holds no list
//   h2     HALF 2: shown != ref (1) or equal (0)
//   rr     ruling 88's count: the writer over the served page against the writer with the STORED services, income rows and
//          chains (the record's own settle inputs) and the served config, tier and houses: differ (1) or not (0)
//   ma     the merchant-army hook: the served flag getStressFlags(served config, served houses).merchantArmy, and whether the
//          hook is served; `mh` 1 where the hook pool is served (plotHooks an array) and the stored record had the hook and
//          the hook's presence differs from the served flag (a shortfall or a surplus)
// Per birth: the stored list, the stored hook. LOCAL cluster only (PGHOST). Out: compact JSON (RV9_OUT).
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
import { loadEngine, loadVeil, clone, isRec, OPEN } from '../../../v27/tell/measure/tell-common.mjs';
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SRC = process.env.RV6_SRC;
const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
const MA_HOOK = "The merchant guild's private security force just detained someone";

it('R3-TELL-8b (i): the arm', async () => {
  const E = await loadEngine(SRC); const V = await loadVeil(SRC);
  const { generateSafetyProfile, settleCrimeLinesToSignal } = await import(`${SRC}/src/generators/safetyProfile.js`);
  const { getStressFlags } = await import(`${SRC}/src/generators/priorityHelpers.js`);
  const { rederiveForPage } = await import(`${SRC}/src/domain/veil/pageRederive.js`);
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  const dbn = `${process.env.RV9_SERVER_DB}_${SHARD[0]}`; await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV9_SERVER_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect(); await db.query(`select set_config('test.uid', '', false)`);
  let nrow = 0;
  /** The server's gallery read: { data, ov } (the served marker the page projects with). */
  const server = async (rec, dm, ov) => {
    nrow += 1; const id = `abcd8b${String(SHARD[0]).padStart(2, '0')}-0000-0000-0000-${String(nrow).padStart(12, '0')}`; const sl = `s8b${SHARD[0]}x${nrow}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
      values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted',$6,$7,true)`, [id, rec.name || 'x', JSON.stringify(rec), sl, `${sl}l`, JSON.stringify(ov == null ? {} : ov), dm]);
    const r = (await db.query('select to_jsonb(g.data) d, g.gallery_member_overrides o from public.get_gallery_dossier($1) g', [sl])).rows[0];
    await db.query('delete from public.settlements where id = $1', [id]);
    return { data: r?.d, ov: r?.o };
  };
  const has = (o, k) => isRec(o) && Object.prototype.hasOwnProperty.call(o, k);
  const spOf = (d) => (isRec(d?.economicState?.safetyProfile) ? d.economicState.safetyProfile : null);
  const pairs = (xs) => (Array.isArray(xs) ? xs.map((c) => (isRec(c) ? [String(c.type), typeof c.desc === 'string' ? c.desc : `#${typeof c.desc}`] : [`#${typeof c}`, ''])) : '#notarray');
  const listOf = (d) => { const sp = spOf(d); return !sp || !has(sp, 'crimeTypes') ? '#absent' : pairs(sp.crimeTypes); };
  const recs = (v) => (Array.isArray(v) ? v.filter(isRec) : []);
  const writer = (d, econ, services) => {
    try {
      const sp = generateSafetyProfile(d.config, d.tier, recs(d.institutions));
      return pairs(settleCrimeLinesToSignal({ ...(econ || {}), safetyProfile: sp }, { seats: d.powerStructure?.factions, estate: d.institutions, tensions: d.history?.currentTensions, services })?.safetyProfile?.crimeTypes);
    } catch (e) { return `#threw ${String(e?.message).slice(0, 80)}`; }
  };
  const out = { meta: { src: SRC, shard: SHARD, started: new Date().toISOString() }, towns: [] };
  const ONLY = process.env.RV9_ONLY ? new Set(process.env.RV9_ONLY.split(',')) : null;
  for (const b of E.pool(Number(process.env.RV9_N || 2), SHARD)) {
    if (ONLY && !ONLY.has(b.seed)) continue;
    const A = E.birth(b.cfg, b.seed, null);
    const hideable = recs(A.institutions).filter((h) => E.isHideableHouse(h));
    const storedSp = spOf(A) || {};
    const maHookStored = (storedSp.plotHooks || []).some((h) => String(h).startsWith(MA_HOOK));
    const rec = { seed: b.seed, size: b.size, crisis: b.crisis, hidden: hideable.map((h) => h.name), stored: pairs(storedSp.crimeTypes), maHookStored: maHookStored ? 1 : 0, pages: {} };
    for (const dm of [false, true]) {
      const { sc, deltas } = V.settings(A, dm);
      const cards = hideable.map((h) => ({ address: `card:institution:${V.veil.CARD_KINDS.institution.idOf(h)}`, hidden: false }));
      const sets = Object.fromEntries(Object.entries(deltas).filter(([k]) => k !== 'g:111'));
      if (hideable.length) sets.allShown = [...V.sw.setCriminalVeil(V.opened(OPEN), sc.defaults, false, sc.present, sc.model), ...cards];
      const entries = [...Object.entries(sets).map(([k, d]) => [k, V.write(d)]), ['unmarked', {}]];
      for (const [k, ov] of entries) {
        const sv = await server(clone(A), dm, ov);
        const twinDoc = V.twin(A, dm, ov);
        const unmarked = !V.veil.readShareVeil(ov).marked;
        const pageOf = { sv: () => rederiveForPage(V.veil.projectServedVeil(clone(sv.data), sv.ov), { unveiled: !V.veil.isServedVeil(sv.ov) && unmarked }),
          tw: () => rederiveForPage(clone(twinDoc), { unveiled: unmarked }) };
        for (const [eng, page] of [['tw', twinDoc], ['sv', sv.data]]) {
          const d = isRec(page) ? page : {}; const sp = spOf(d);
          const open = Array.isArray(sp?.criminalInstitutions) ? 1 : 0;
          const ref = open && isRec(d.config) ? writer(d, d.economicState, d.availableServices) : '#none';
          let shown; try { shown = listOf(pageOf[eng]()); } catch (e) { shown = `#threw ${String(e?.message).slice(0, 80)}`; }
          const want = ref === '#none' ? '#absent' : ref;
          const rrec = open && isRec(d.config) ? writer(d, A.economicState, A.availableServices) : '#none';
          let ma = null; try { ma = isRec(d.config) ? (getStressFlags(d.config, recs(d.institutions)).merchantArmy ? 1 : 0) : null; } catch { ma = '#threw'; }
          const hooks = Array.isArray(sp?.plotHooks) ? 1 : 0;
          const maHook = (sp?.plotHooks || []).some((h) => String(h).startsWith(MA_HOOK)) ? 1 : 0;
          rec.pages[`${dm ? 'dm' : 'off'}|${k}|${eng}`] = {
            h1: has(sp, 'crimeTypes') ? 1 : 0, open, ref, shown, h2: JSON.stringify(shown) === JSON.stringify(want) ? 0 : 1,
            rr: JSON.stringify(ref) === JSON.stringify(rrec) ? 0 : 1, ma, hooks, maHook, mh: hooks && maHookStored && ma !== maHook ? 1 : 0,
          };
        }
      }
    }
    out.towns.push(rec);
  }
  await db.end();
  out.meta.ended = new Date().toISOString();
  writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
}, 14_400_000);
