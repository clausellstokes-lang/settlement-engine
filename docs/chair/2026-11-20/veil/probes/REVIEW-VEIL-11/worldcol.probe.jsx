// REVIEW-VEIL-11 — a public map's WORLD COLUMNS (DOORS's census rows 18 and 21: get_gallery_map's world.snapshot, get_unlisted_map's
// world_snapshot), stored at publish and governed by no veil. The brokerage producer (brokerageServicesRules.js :: query) writes an
// AUTO outcome whose headline is `${asker.patronName} buys an answer from ${asker.houseName}` with asker = bindings[0] and no filter on
// an illegal (covert) house. Per born town with the brokerage layer on: the engine's own brokeragePatronBindings; where bindings[0]
// is a house the member's DEFAULT veil removes whole, the outcome in the producer's exact form is put in pulseHistory, the
// engine's own serializeWorldSnapshotPublic writes the world snapshot, a map_with_campaign row stores it beside the member, and
// get_gallery_map is read as anon: the member's body and the world snapshot are searched for the house's name.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
it('worldcol', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const DB = process.env.RV11_DB || 'wcol';
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  await admin.query(`drop database if exists ${DB} with (force)`); await admin.query(`create database ${DB} template ${process.env.RV10_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: DB }); await db.connect();
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const BP = await import(`${SRC}/src/domain/worldPulse/brokeragePatronage.js`);
  const { serializeWorldSnapshotPublic } = await import(`${SRC}/src/domain/display/worldSnapshotPublic.js`);
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const compose = (await import(`${SRC}/src/components/new/publicProseCompose.js`)).composePublicProse; const withPP = (await import(`${SRC}/src/domain/display/publicProse.js`)).withPublicProse;
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const worldState = { schemaVersion: 1, spatialCanonVersion: 1, simulationRules: { infoMode: 'delayed', infoStatecraftEnabled: true, informationBrokeragesEnabled: true }, pulseHistory: [], proposals: [] };
  const out = { towns: 0, withBinding: 0, firstIllegal: 0, firstHidden: 0, servedInWorld: 0, servedInMember: 0, ex: [] };
  let n = 0; const N = Number(process.env.RV10_N || 1);
  for (let k = 0; k < N; k += 1) for (const size of ['town', 'city', 'city', 'metropolis', 'metropolis']) for (const crisis of ['none', 'none', 'infiltrated', 'politically_fractured', 'indebted']) {
    n += 1; const seed = `rv11-world-${size}-${crisis}-${k}-${n}`;
    let A = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) }), null, { seed, customContent: {} });
    A = { ...A }; delete A.publicProse; A = JSON.parse(JSON.stringify(withPP(A, compose(A))));
    out.towns += 1; const sid = `abcd9900-0000-0000-0000-${String(n).padStart(12, '0')}`;
    const item = { id: sid, settlement: A };
    const bindings = BP.brokeragePatronBindings({ worldState, item });
    if (!bindings.length) continue; out.withBinding += 1;
    const asker = bindings[0]; if (asker.covert) out.firstIllegal += 1; out.anyIllegal = (out.anyIllegal || 0) + (bindings.some((b) => b.covert) ? 1 : 0);
    // the member stored with the DEFAULT veil; is the asker's house removed whole on its share?
    const ov = veil.writeShareVeil({}, [], { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
      values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted',$6,false,true,false)`, [sid, String(A.name || 'Town'), JSON.stringify(A), `wm${n}`, `wml${n}`, JSON.stringify(ov)]);
    const outcome = { id: `candidate.brokerage.brokerage_query.${sid}.3`, type: 'information', candidateType: 'brokerage_query', applyMode: 'auto', targetSaveId: sid,
      headline: `${asker.patronName} buys an answer from ${asker.houseName}`,
      summary: `${asker.patronName} paid ${asker.houseName} of ${A.name} for what it holds on ${A.name}, and was answered at the house's own grade.`, metadata: { settlementId: sid } };
    const ws = { ...worldState, pulseHistory: [{ tick: 3, selectedOutcomes: [outcome], impactDigest: [] }] };
    const snap = serializeWorldSnapshotPublic(ws, {}, [{ id: sid, settlement: A }], { chronicle: true });
    const keys = new Set(); const walk = (v) => { if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === 'object') for (const [kk, vv] of Object.entries(v)) { keys.add(kk); walk(vv); } }; walk(snap); out.keys = [...keys];
    try { await db.query(`insert into public.saved_maps (id,user_id,name,map_data,is_public,public_slug,published_at,share_kind,gallery_share_campaign,gallery_share_world,gallery_world_snapshot,gallery_world_sections)
      values (gen_random_uuid(),'11111111-1111-1111-1111-111111111111','Realm',$1,true,$2,now(),'map_with_campaign',true,true,$3,'["chronicle"]')`, [JSON.stringify({ campaign: { settlementIds: [sid] } }), `map${n}`, JSON.stringify(snap)]); } catch (e) { out.err = String(e.message); out.snap = JSON.stringify(snap).slice(0, 1500); break; }
    await db.query('set role anon'); const m = (await db.query('select public.get_gallery_map($1) as out', [`map${n}`])).rows[0].out; await db.query('reset role');
    await db.query('delete from public.saved_maps where public_slug = $1', [`map${n}`]); await db.query('delete from public.settlements where id = $1', [sid]);
    const member = (m?.members || [])[0]?.settlement || {};
    const hiddenWhole = !(member.institutions || []).some((i) => i?.name === asker.houseName);
    if (hiddenWhole) out.firstHidden += 1;
    const inWorld = JSON.stringify(m?.world || {}).includes(asker.houseName); const inMember = JSON.stringify(member).includes(asker.houseName);
    if (hiddenWhole && inWorld) { out.servedInWorld += 1; if (out.ex.length < 5) out.ex.push(`${seed}: house "${asker.houseName}" (covert ${asker.covert}) hidden whole on the member; world.snapshot serves ${JSON.stringify(JSON.stringify(m.world).match(new RegExp(`.{0,60}${asker.houseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.{0,40}`))?.[0])}`); }
    if (hiddenWhole && inMember) out.servedInMember += 1;
  }
  await db.end(); writeFileSync(process.env.RV10_OUT, JSON.stringify(out, null, 1));
}, 14_400_000);
