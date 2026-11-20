// REVIEW-VEIL-10 — THE CHRONICLE DOOR. A born town with a criminal house; the DM's own Make Changes events made by the
// app's own pipeline (applyEvent): IMPOSE_CORRUPTION by that house (payload.criminalInstitution, as buildEvent writes it)
// and ADD_INSTITUTION of a criminal house. Their log entries stored in campaign_state.eventLog as the store does. The
// share: the DEFAULT veil (writeShareVeil({}, [])), Reveal DM off, live and snapshot. Read as anon: get_gallery_dossier
// (data and the chronicle column), get_unlisted_dossier, and get_gallery_map (a campaign map whose member is this town).
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC; const GEN = process.env.RV10_GEN || SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
it('REVIEW-VEIL-10: the chronicle door', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  const dbn = process.env.RV10_DB; await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV10_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect();
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { applyEvent } = await import(`${SRC}/src/domain/events/applyEvent.js`);
  const { generateSettlementPipeline } = await import(`${GEN}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${GEN}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${GEN}/src/store/configSlice.js`);
  const compose = (await import(`${GEN}/src/components/new/publicProseCompose.js`)).composePublicProse; const withPP = (await import(`${GEN}/src/domain/display/publicProse.js`)).withPublicProse;
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const out = []; let n = 0;
  for (const [size, crisis] of [['city', 'none'], ['town', 'infiltrated'], ['metropolis', 'none'], ['city', 'insurgency'], ['town', 'none'], ['metropolis', 'indebted']]) {
    const seed = `rv10-chron-${size}-${crisis}`;
    const cfg = { ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) };
    let A = generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} }); A = { ...A }; delete A.publicProse; A = JSON.parse(JSON.stringify(withPP(A, compose(A))));
    const crim = (A.institutions || []).filter((h) => isRec(h) && /criminal/i.test(String(h.category || '')));
    if (!crim.length) { out.push({ seed, crim: 0 }); continue; }
    const house = crim[0].name; const npc = (A.npcs || []).find((p) => isRec(p) && p.name && p.id);
    const evs = [
      { id: 'ev_1', type: 'IMPOSE_CORRUPTION', targetId: npc.id, payload: { severity: 0.5, criminalInstitution: house, scope: 'individual' }, timestamp: '2026-11-01T00:00:00.000Z' },
      { id: 'ev_2', type: 'ADD_INSTITUTION', targetId: house, payload: { category: crim[0].category }, timestamp: '2026-11-02T00:00:00.000Z' },
    ];
    let S = A; const log = [];
    for (const ev of evs) { const r = applyEvent({ settlement: S, systemState: null, event: ev, now: ev.timestamp }); if (r.veto) { log.push({ vetoed: ev.type, why: r.veto.message }); continue; } log.push(JSON.parse(JSON.stringify(r.logEntry))); S = r.nextSettlement || S; }
    S = JSON.parse(JSON.stringify(S));
    for (const mode of ['live', 'snapshot']) {
      n += 1; const id = `abcd3000-0000-0000-0000-${String(n).padStart(12, '0')}`;
      const pubForSnap = veil.galleryPayloadFor(S, { shareDm: false, memberOverrides: {} });
      const ov = veil.writeShareVeil({}, [], mode === 'live' ? { mode: 'live', at: '2026-11-03T00:00:00.000Z' } : { mode: 'snapshot', at: '2026-11-03T00:00:00.000Z', snapshot: pubForSnap });
      await db.query(`insert into public.settlements (id,user_id,name,tier,data,campaign_state,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
        values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,$4,true,$5,now(),$6,'unlisted',$7,false,true,false)`, [id, `C${n}`, JSON.stringify(S), JSON.stringify({ eventLog: log.filter((e) => !e.vetoed) }), `ch${n}`, `chl${n}`, JSON.stringify(ov)]);
      await db.query(`insert into public.saved_maps (id,user_id,name,is_public,public_slug,share_kind,gallery_share_campaign,map_data) values ($1,'11111111-1111-1111-1111-111111111111','M',true,$2,'map_with_campaign',true,$3)`,
        [id.replace('abcd3000', 'abcd3100'), `mp${n}`, JSON.stringify({ campaign: { settlementIds: [id] } })]);
      await db.query('set role anon');
      const g = (await db.query('select data, chronicle from public.get_gallery_dossier($1)', [`ch${n}`])).rows[0];
      const l = (await db.query('select public.get_unlisted_dossier($1) x', [`chl${n}`])).rows[0]?.x;
      const m = (await db.query('select public.get_gallery_map($1) x', [`mp${n}`])).rows[0]?.x;
      await db.query('reset role');
      const has = (v) => (v == null ? null : JSON.stringify(v).toLowerCase().includes(String(house).toLowerCase()));
      out.push({ seed, mode, house, npc: npc.name, events: log.map((e) => e.vetoed ? `VETO ${e.vetoed}: ${e.why}` : `${e.event.type}: ${e.narrativeSummary}`),
        galleryDataHasHouse: has(g?.data), galleryDataInstitutionSent: (g?.data?.institutions || []).some((h) => h.name === house),
        galleryChronicle: g?.chronicle, galleryChronicleHasHouse: has(g?.chronicle),
        linkHasHouse: has(l?.dossier), linkKeys: l && Object.keys(l),
        mapMemberDataHasHouse: has(m?.members?.[0]?.settlement), mapMemberChronicleHasHouse: has(m?.members?.[0]?.chronicle), mapMembers: m?.members?.length,
        npcAllegianceSentGallery: (g?.data?.npcs || []).find((p) => p.name === npc.name)?.allegiance ?? null });
    }
  }
  await db.end();
  writeFileSync(process.env.RV10_OUT, JSON.stringify(out, null, 1));
}, 14_400_000);
