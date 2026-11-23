// R3 MEASURE FIRST (VEIL-22's R3 builder): born towns A (as born) and B (every hideable house taken out after every step),
// each stored and read THROUGH THE SERVER (gallery read; Reveal DM off and on) under the veil "groupings opened by hand,
// every hideable house hidden whole" (the default veil with the three family groupings and the plot-hooks tab opened).
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC; const GEN = process.env.RV9_GEN || SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SIZES = (process.env.RV9_SIZES || 'village,town,town,city,city,metropolis,metropolis').split(',');
const CRISES = (process.env.RV9_CRISES || 'none,infiltrated,none,insurgency,occupied,indebted,none,under_siege,wartime,politically_fractured').split(',');
const N = Number(process.env.RV9_N || 1); const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
it('R3 measure', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const admin = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: 'postgres' }); await admin.connect();
  const dbn = `${process.env.RV9_SERVER_DB}_${SHARD[0]}`; await admin.query(`drop database if exists ${dbn} with (force)`); await admin.query(`create database ${dbn} template ${process.env.RV9_SERVER_TPL}`); await admin.end();
  const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbn }); await db.connect(); await db.query(`select set_config('test.uid', '', false)`);
  const { generateSettlementPipeline } = await import(`${GEN}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${GEN}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${GEN}/src/store/configSlice.js`);
  let composePublicProse = null; let withPublicProse = null;
  try { composePublicProse = (await import(`${GEN}/src/components/new/publicProseCompose.js`)).composePublicProse; withPublicProse = (await import(`${GEN}/src/domain/display/publicProse.js`)).withPublicProse; } catch { /* master: no composer */ }
  const { isHideableHouse } = await import(`${SRC}/src/domain/people/cardVeil.js`);
  const { criminalStructureKeyOf } = await import(`${SRC}/src/domain/facts/criminalStructureKey.js`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const birth = (cfg, seed, drop) => {
    const cut = (list) => { if (!Array.isArray(list)) return; for (let i = list.length - 1; i >= 0; i -= 1) if (drop(list[i])) list.splice(i, 1); };
    let t = generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {}, onStep: drop ? (name, ctx) => { cut(ctx.institutions); if (isRec(ctx.settlement)) cut(ctx.settlement.institutions); } : undefined });
    if (drop) cut(t.institutions);
    if (composePublicProse) { t = { ...t }; delete t.publicProse; t = withPublicProse(t, composePublicProse(t)); }
    return JSON.parse(JSON.stringify(t));
  };
  let nrow = 0;
  const served = async (rec, dm) => {
    const ov = veil.writeShareVeil({}, OPEN.map((a) => ({ address: a, hidden: false })), { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
    nrow += 1; const id = `abcd9f${String(SHARD[0]).padStart(2, '0')}-0000-0000-0000-${String(nrow).padStart(12, '0')}`;
    await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable,gallery_share_narrated)
      values ($1,'11111111-1111-1111-1111-111111111111',$2,'town',$3,true,$4,now(),$5,'unlisted',$6,$7,true,false)`, [id, rec.name || 'x', JSON.stringify(rec), `m${SHARD[0]}x${nrow}`, `ml${SHARD[0]}x${nrow}`, JSON.stringify(ov), dm]);
    const r = (await db.query('select * from public.get_gallery_dossier($1)', [`m${SHARD[0]}x${nrow}`])).rows[0]?.data;
    await db.query('delete from public.settlements where id = $1', [id]);
    return r;
  };
  const pick = (s) => {
    const ps = s?.powerStructure || {}; const es = s?.economicState || {}; const sp = es.safetyProfile || {};
    return {
      factions: (ps.factions || []).map((f) => ({ n: f.faction ?? f.name, c: f.category ?? null, g: f.isGoverning === true, p: f.power })),
      rels: (ps.factionRelationships || []).map((r) => ({ pair: r.pair, type: r.type, dir: r.direction })),
      complexity: es.economicComplexity, drag: sp.economicDragDesc ?? null, guard: sp.guardEffectivenessDesc ?? null, safetyDesc: sp.safetyDesc ?? null,
      crimeTypes: Array.isArray(sp.crimeTypes) ? sp.crimeTypes.map((c) => c?.type) : sp.crimeTypes === undefined ? '(absent)' : sp.crimeTypes,
      hooks: Array.isArray(sp.plotHooks) ? sp.plotHooks : sp.plotHooks === undefined ? '(absent)' : sp.plotHooks,
      tensions: (s?.history?.currentTensions || []).map((t) => ({ type: t.type, f: t.factions })),
      events: (s?.history?.historicalEvents || []).map((e) => e.type), timeline: (s?.history?.eventsTimeline || []).map((e) => e.type),
      instDesc: Object.fromEntries((s?.institutions || []).map((h) => [h.name, h.desc ?? null])),
      prose: s?.publicProse?.blocks?.['defense:criminal'] ?? null,
      key: criminalStructureKeyOf(s), why: { ci: sp.criminalInstitutions ?? null, chains: (es.activeChains || []).filter((c) => c?.needKey === 'criminal_economy').map((c) => c.status), covInc: (es.incomeSources || []).some((r) => r?.isCriminal === true), covSvc: (s?.availableServices?.criminal || []).some((x) => x?.institution === '(covert)'), crimFac: (ps.factions || []).filter((f) => f.category === 'criminal').map((f) => f.faction), names: (s?.institutions || []).map((h) => h.name).filter((n) => /smuggl|black market|gambl|fence|bandit|outlaw|thieves|multiple criminal|underground city|front business/i.test(n)) }, incomeN: (es.incomeSources || []).length, incomeSum: (es.incomeSources || []).reduce((a, r) => a + Number(r.percentage || 0), 0),
      governing: ps.governingFaction ?? null, gov: ps.government ?? null,
      inst: es.safetyProfile?.compound?.inst ? Object.fromEntries(Object.entries(es.safetyProfile.compound.inst).filter(([k]) => /Criminal|Thieves|BlackMarket|Smuggling|GangInfra/.test(k))) : null,
    };
  };
  const out = []; let idx = 0;
  for (let k = 0; k < N; k += 1) for (const size of SIZES) for (const crisis of CRISES) {
    idx += 1; if (idx % SHARD[1] !== SHARD[0]) continue;
    const seed = `r3m-${size}-${crisis}-${k}-${idx}`;
    const cfg = { ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) };
    let A; try { A = birth(cfg, seed, null); } catch (e) { out.push({ seed, threw: String(e.message).slice(0, 100) }); continue; }
    const H = (A.institutions || []).filter((h) => isHideableHouse(h));
    const rec = { seed, size, crisis, hidden: H.map((h) => h.name), stored: pick(A) };
    if (H.length) { try { rec.B = pick(birth(cfg, seed, (h) => isHideableHouse(h))); } catch (e) { rec.Bthrew = String(e.message).slice(0, 100); } }
    for (const dm of [false, true]) { rec[dm ? 'dm' : 'off'] = pick(await served(A, dm)); }
    out.push(rec);
  }
  await db.end();
  writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
}, 14_400_000);
