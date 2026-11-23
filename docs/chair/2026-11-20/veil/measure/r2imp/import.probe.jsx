// @vitest-environment jsdom
// R2-IMPORT (VEIL-19, VR16 cond. 2): an import that arrives WITHOUT the withhold-always fields. For each born town:
//   A  the import as today: born -> composed -> JSON -> galleryPayloadFor (default share) -> the tree's own
//      fetchDossierForImport (supabase rpc mocked to answer the payload) -> importGallerySettlementImpl (saves.save
//      mocked to capture the entry) -> the save's recompose (composePublicProse, as lib/saves.js publicProseForRow) -> JSON.
//   B  the same with every withhold-always path deleted from the payload the rpc answers.
//   F  (per field) only that field deleted (cheap readers only), to attribute B's differences.
// Readers: the importer's own derivations (see READERS). Records throws, NaN, "undefined"/"null"/"NaN" in strings
// new in B, and leaf differences. Render arm: OutputContainer as the OWNER, walked (pageCensusWalk), A vs B.
import { it, vi, expect } from 'vitest';
import { writeFileSync, readFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC; const OUT = '/var/tmp/v18/out/r2imp';
const mocks = vi.hoisted(() => ({ store: {}, payload: null, captured: null }));
vi.mock(`${process.env.RV6_SRC}/src/store/index.js`, () => { const useStore = (sel) => sel(mocks.store); useStore.subscribe = () => () => {}; useStore.getState = () => mocks.store; useStore.setState = () => {}; return { useStore, default: useStore }; });
vi.mock(`${process.env.RV6_SRC}/src/generators/aiLayer`, () => ({ runTemplateNarrative: vi.fn() }));
vi.mock(`${process.env.RV6_SRC}/src/lib/analytics.js`, () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ isConfigured: true, supabase: {
  auth: { getSession: async () => ({ data: { session: null } }), getUser: async () => ({ data: { user: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }) },
  from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }), single: async () => ({ data: null, error: null }) }) }) }),
  rpc: async (name) => (name === 'import_gallery_dossier' ? { data: [{ id: 'src-1', name: mocks.payload?.name || 'T', tier: mocks.payload?.tier, data: JSON.parse(JSON.stringify(mocks.payload)) }], error: null } : { data: null, error: null }) } }));
vi.mock(`${process.env.RV6_SRC}/src/lib/saves.js`, async (orig) => ({ ...(await orig()), saves: { save: async (e) => { mocks.captured = e; return 'new-id'; } } }));

const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const FIELDS77 = readFileSync(`${OUT}/fields77.txt`, 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);
const EXTRA = ['economicState.compound.raw', 'economicState.safetyProfile.compound', 'economicState.safetyProfile.safetyRatio'];
const norm = (p) => p.replace(/ \(only in [AB]\)$/, '').replace(/\[\]$/, '').replace(/\[\]/g, '');
const FIELDS = [...FIELDS77, ...EXTRA];

// delete a dotted path; arrays met on the way are walked element-wise
function del(o, segs) {
  if (Array.isArray(o)) { let n = 0; for (const x of o) n += del(x, segs); return n; }
  if (!isRec(o)) return 0;
  const [h, ...t] = segs;
  if (!(h in o)) return 0;
  if (!t.length) { delete o[h]; return 1; }
  return del(o[h], t);
}
function has(o, segs) {
  if (Array.isArray(o)) return o.some((x) => has(x, segs));
  if (!isRec(o)) return false;
  const [h, ...t] = segs; if (!(h in o) || o[h] === undefined) return false; return t.length ? has(o[h], t) : true;
}
const segsOf = (f) => { const p = norm(f); const m = p.match(/^publicProse\.blocks\.([^.]+)\.(.*)$/); return m ? ['publicProse', 'blocks', m[1], ...m[2].split('.')] : p.split('.'); };
// walk a value: leaves map path->value (arrays by index), NaN and bad strings counted
function leaves(v, p = '', out = new Map(), seen = new WeakSet(), depth = 0) {
  if (depth > 14) return out;
  if (typeof v === 'function') return out;
  if (v && typeof v === 'object') { if (seen.has(v)) return out; seen.add(v);
    if (v instanceof Set) v = [...v]; if (v instanceof Map) v = Object.fromEntries(v);
    if (Array.isArray(v)) v.forEach((x, i) => leaves(x, `${p}[${i}]`, out, seen, depth + 1));
    else for (const k of Object.keys(v)) leaves(v[k], p ? `${p}.${k}` : k, out, seen, depth + 1);
    return out; }
  out.set(p, v); return out;
}
const GROUPS = {
  activeConditions: ['activeConditions[].severity', 'activeConditions[].severityBand'],
  readinessScore: ['defenseProfile.readiness.score'],
  ecoCompound: ['economicState.compound.criminalEffective', 'economicState.compound.criminalPreStress', 'economicState.compound.magicInfluence', 'economicState.compound.militaryEffective', 'economicState.compound.religionInfluence', 'economicState.compound.raw'],
  safetyCompound: ['economicState.safetyProfile.compound'],
  safetyRatio: ['economicState.safetyProfile.safetyRatio'],
  safetyFlags: ['economicState.safetyProfile.flags.anyActive', 'economicState.safetyProfile.flags.arcaneBlackMarket', 'economicState.safetyProfile.flags.merchantArmy', 'economicState.safetyProfile.flags.religiousFraud'],
  foodAndSituation: ['economicState.foodSecurity.storageMonths', 'economicState.foodSecurity.storageNote', 'economicState.situationDesc'],
  incomeWeight: ['economicState.incomeSources[].weight'],
  historyAnchors: ['history.eventsTimeline[].anchored', 'history.eventsTimeline[].year', 'history.historicalEvents[].anchored'],
  legacyAnnotations: ['history.legacyAnnotations[]'],
  powerMisc: ['powerStructure.economyInputFingerprint', 'powerStructure.factionRelationships[].ratio', 'powerStructure.factions[].contestsNiche', 'powerStructure.factions[].rawPower'],
  legitimacyBreakdown: ['powerStructure.publicLegitimacy.breakdown.prosperity', 'powerStructure.publicLegitimacy.breakdown.safety'],
  legitimacyFlags: ['powerStructure.publicLegitimacy.crimMultiplier', 'powerStructure.publicLegitimacy.govMultiplier', 'powerStructure.publicLegitimacy.isApproved', 'powerStructure.publicLegitimacy.isContested', 'powerStructure.publicLegitimacy.isEndorsed', 'powerStructure.publicLegitimacy.isTolerated'],
  publicProseBlocks: null, quarters: ['spatialLayout.quarters[] (only in A)'],
  stressCast: null, stressorsCast: null,
};
const BAD = /\bNaN\b|\bundefined\b|\[object Object\]|(^|[^A-Za-z_])null([^A-Za-z_]|$)/;
const ctx = (v) => { const i = v.search(BAD); return v.slice(Math.max(0, i - 90), i + 40); };
const badOf = (m) => { const r = []; for (const [p, v] of m) { if (typeof v === 'number' && !Number.isFinite(v)) r.push([p, String(v)]); else if (typeof v === 'string' && BAD.test(v)) r.push([p, ctx(v)]); } return r; };
function cmp(a, b) { // a,b: reader outputs
  const la = leaves(a); const lb = leaves(b); const diffs = [];
  for (const k of new Set([...la.keys(), ...lb.keys()])) { if (/(^|\.)raw\.|importedAt/.test(k)) continue; const x = la.get(k); const y = lb.get(k); if (!(x === y || (Number.isNaN(x) && Number.isNaN(y)))) diffs.push([k, x, y]); }
  const badA = new Set(badOf(la).map((r) => r[1])); const newBad = badOf(lb).filter((r) => !badA.has(r[1]));
  return { diffs, newBad };
}

it('R2-IMPORT', async () => {
  const W = process.env.R2_ONLY || 'all';
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const { composePublicProse } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const { withPublicProse } = await import(`${SRC}/src/domain/display/publicProse.js`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { importGallerySettlementImpl } = await import(`${SRC}/src/store/galleryImportSettlement.js`);
  const { buildViewModel } = await import(`${SRC}/src/pdf/lib/viewModel.js`);
  const { normalizeIncomeSources } = await import(`${SRC}/src/pdf/lib/viewModelBodySlices.js`);
  const { buildJournalPages } = await import(`${SRC}/src/foundry/journalPages.js`);
  const { composeCrisisPage } = await import(`${SRC}/src/domain/crisis/crisisPage.js`);
  const { composeTonightSheet } = await import(`${SRC}/src/domain/summary/tonightSheet.js`);
  const { extractSettlementContext } = await import(`${SRC}/src/components/new/dailyLifeLogic.js`);
  const { buildThreatAssessment } = await import(`${SRC}/src/domain/display/threatAssessment.js`);
  const dd = await import(`${SRC}/src/domain/display/defenseDisplay.js`);
  const { readCorruptionClimate } = await import(`${SRC}/src/domain/corruption.js`);
  const { deriveUndercity } = await import(`${SRC}/src/domain/undercity/colonization.js`);
  const { densityCandidatePowersFrom } = await import(`${SRC}/src/domain/worldPulse/factionDensityKernel.js`);
  const { deriveAllDistricts } = await import(`${SRC}/src/domain/districtProfile.js`);
  const { buildTownLayoutV2 } = await import(`${SRC}/src/domain/townMap/townLayoutV2.js`);
  const { buildTownMapModel } = await import(`${SRC}/src/domain/townMap/townMapModel.js`);
  const { CAUSAL_VIEWS, deriveCausalView } = await import(`${SRC}/src/domain/causalViews.js`);
  const esp = await import(`${SRC}/src/domain/worldPulse/espionage/espionageMath.js`);
  const { substrateSignatureOf } = await import(`${SRC}/src/lib/spatialSubstrateDerive.js`);
  const { entityCatalog } = await import(`${SRC}/src/domain/explanation.js`);
  const { storesMonthsOf } = await import(`${SRC}/src/domain/facts/storesMonths.js`);
  const { computeTreatyGrainDraw } = await import(`${SRC}/src/domain/worldPulse/treatyTransfer.js`);
  const { foodLedger } = await import(`${SRC}/src/domain/foodLedger.js`);
  const { defenseLedger } = await import(`${SRC}/src/domain/defenseLedger.js`);
  await loadGenerationLawPayloads();

  const layoutSum = (l) => ({ districts: (l?.districts || []).map((d) => [d.id, d.name, d.category]), keys: Object.keys(l || {}).sort(), json: JSON.stringify(l).length });
  const READERS = {
    publicProseRecomposed: (r) => composePublicProse(r),
    pdfViewModel: (r) => { const vm = buildViewModel({ settlement: r }); const { raw, active, ...rest } = vm; return rest; },
    journalPages: (r) => buildJournalPages(buildViewModel({ settlement: r }), { settlement: r }),
    normalizeIncomeSources: (r) => normalizeIncomeSources(r.economicState?.incomeSources),
    crisisPage: (r) => composeCrisisPage(r),
    tonightSheet: (r) => composeTonightSheet(r),
    dailyLifeContext: (r) => extractSettlementContext(r),
    threatAssessment: (r) => buildThreatAssessment(r),
    defenseDisplay: (r) => ({ g: dd.deriveGuardAssessment(r), s: dd.deriveSafetyLine(r), rd: dd.deriveDefenseReadiness(r), sc: dd.deriveSupportingCapabilities(r), v: dd.deriveDefenseVulnerabilities(r), af: dd.deriveArmedForces(r), f: dd.foodEnduranceLine(r) }),
    readCorruptionClimate: (r) => readCorruptionClimate(r),
    deriveUndercity: (r) => deriveUndercity(r),
    densityCandidatePowersFrom: (r) => densityCandidatePowersFrom(r),
    deriveAllDistricts: (r) => deriveAllDistricts(r),
    townLayoutV2: (r) => layoutSum(buildTownLayoutV2(r)),
    townMapModelV1: (r) => layoutSum(buildTownMapModel(r)),
    causalViews: (r) => Object.fromEntries((CAUSAL_VIEWS || []).map((v) => [v.id || v.name || v, deriveCausalView(r, v.id || v.name || v)])),
    espionage: (r) => (r.npcs || []).slice(0, 6).map((n) => [esp.covertCompetence01(r, n), esp.operativeNotoriety01(r, n)]),
    substrateSignature: (r) => substrateSignatureOf(r),
    entityCatalog: (r) => entityCatalog(r),
    storesMonthsOf: (r) => storesMonthsOf(r),
    treatyGrainDraw: (r) => computeTreatyGrainDraw({ payer: r, payee: r, takeFraction: 0.25 }),
    foodLedger: (r) => foodLedger(r),
    defenseLedger: (r) => defenseLedger(r),
  };
  const run = (rec, only = null) => { const o = {}; for (const [k, f] of Object.entries(READERS)) { if (only && !only.includes(k)) continue; try { o[k] = { ok: f(rec) }; } catch (e) { o[k] = { threw: String(e?.stack || e).split('\n').slice(0, 3).join(' | ').slice(0, 300) }; } } return o; };

  const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
  const CR = [null, 'infiltrated', 'insurgency', 'under_siege', null, 'occupied', 'famine', 'slave_revolt', null, 'politically_fractured', 'indebted', 'wartime', null, 'plague_onset', 'succession_void', 'recently_betrayed', null, 'monster_pressure', 'religious_conversion', 'mass_migration', null, 'infiltrated', 'under_siege', 'insurgency'];
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const N = Number(process.env.R2_N || 24); const RENDER_N = Number(process.env.R2_RENDER || 0);
  const get = () => ({ auth: { user: { id: 'u1' }, tier: 'premium', role: null }, maxSaves: () => Infinity, savedSettlements: [] });
  const importOf = async (payload) => { mocks.payload = payload; mocks.captured = null; await importGallerySettlementImpl(get, () => {}, 'slug-x'); const s = mocks.captured.settlement; return { mem: s, saved: JSON.parse(JSON.stringify(withPublicProse(s, composePublicProse(s)))) }; };

  const res = { fields: FIELDS, towns: [], presence: {}, recomputed: {}, readerB: {}, perField: {}, render: {} };
  const bump = (o, k, seed, ex) => { const r = o[k] = o[k] || { towns: [], ex: [] }; if (!r.towns.includes(seed)) r.towns.push(seed); if (r.ex.length < 4 && ex) r.ex.push(ex); };
  for (let i = 0; i < N; i += 1) {
    const size = SIZES[i % 6]; const crisis = CR[i]; const seed = `r2imp-${size}-${crisis || 'calm'}-${i}`;
    const cfg = birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
    let t; try { t = generateSettlementPipeline(cfg, null, { seed, customContent: {} }); } catch (e) { res.towns.push({ seed, birthThrew: String(e.message).slice(0, 200) }); continue; }
    t = JSON.parse(JSON.stringify(withPublicProse(t, composePublicProse(t))));
    const served = JSON.parse(JSON.stringify(veil.galleryPayloadFor(t, { shareDm: false, memberOverrides: {} })));
    for (const f of FIELDS) if (has(served, segsOf(f))) bump(res.presence, f, seed);
    const strip = (fs) => { const c = JSON.parse(JSON.stringify(served)); for (const f of fs) del(c, segsOf(f)); return c; };
    const A = await importOf(served); const B = await importOf(strip(FIELDS));
    for (const f of FIELDS) if (has(served, segsOf(f)) && has(B.saved, segsOf(f))) bump(res.recomputed, f, seed);
    const rA = run(A.saved); const rB = run(B.saved); const rBm = run(B.mem);
    for (const k of Object.keys(READERS)) {
      if (rB[k].threw && !rA[k].threw) bump(res.readerB, `${k} :: THROWS`, seed, rB[k].threw);
      if (rA[k].threw) bump(res.readerB, `${k} :: throws in A too`, seed, rA[k].threw);
      if (rA[k].ok !== undefined && rB[k].ok !== undefined) { const c = cmp(rA[k].ok, rB[k].ok);
        if (c.diffs.length) bump(res.readerB, `${k} :: differs`, seed, c.diffs.slice(0, 3).map((d) => d.map((x) => String(x).slice(0, 120))));
        if (c.newBad.length) bump(res.readerB, `${k} :: NEW NaN/undefined/null`, seed, c.newBad.slice(0, 3)); }
      if (rBm[k].threw && !rA[k].threw) bump(res.readerB, `${k} :: THROWS (in-memory, before save recompose)`, seed, rBm[k].threw);
    }
    // per field attribution
    if (W !== 'render') for (const f of FIELDS) {
      if (!has(served, segsOf(f))) continue;
      const F = await importOf(strip([f])); const rF = run(F.saved);
      for (const k of Object.keys(READERS)) {
        if (rF[k].threw && !rA[k].threw) bump(res.perField, `${f} || ${k} || THROWS`, seed, rF[k].threw);
        if (rA[k].ok !== undefined && rF[k].ok !== undefined) { const c = cmp(rA[k].ok, rF[k].ok);
          if (c.diffs.length) bump(res.perField, `${f} || ${k} || differs`, seed, c.diffs.slice(0, 2).map((d) => d.map((x) => String(x).slice(0, 140))));
          if (c.newBad.length) bump(res.perField, `${f} || ${k} || NEW NaN/undefined/null`, seed, c.newBad.slice(0, 2)); }
      }
    }
    // render arm
    if (i < RENDER_N) {
      const React = (await import(`${SRC}/node_modules/react/index.js`)).default;
      const { render, fireEvent, waitFor, cleanup } = await import(`${SRC}/node_modules/@testing-library/react/dist/index.js`);
      const { walkDossier, storeFor } = await import(`${SRC}/tests/components/pageCensusWalk.shared.mjs`);
      const OutputContainer = (await import(`${SRC}/src/components/OutputContainer.jsx`)).default;
      if (!window.matchMedia) window.matchMedia = (q) => ({ media: q, matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
      const walk = async (rec) => { mocks.store = storeFor(rec, vi.fn); try { const { container } = render(React.createElement(OutputContainer, { settlement: rec })); const v = await walkDossier(container, { fireEvent, waitFor, expect }); cleanup(); return { v }; } catch (e) { cleanup(); return { threw: String(e?.message || e).slice(0, 300) }; } };
      const vA = await walk(A.saved);
      const diffViews = (va, vb) => { const o = {}; for (const name of new Set([...Object.keys(va), ...Object.keys(vb)])) { const a = va[name] || ['[NO VIEW]']; const b = vb[name] || ['[NO VIEW]'];
          const sa = new Set(a); const sb = new Set(b); const onlyA = a.filter((l) => !sb.has(l)); const onlyB = b.filter((l) => !sa.has(l));
          if (onlyA.length || onlyB.length) o[name] = { onlyA: onlyA.slice(0, 5).map((l) => l.slice(0, 220)), onlyB: onlyB.slice(0, 5).map((l) => l.slice(0, 220)), badB: onlyB.filter((l) => BAD.test(l)).map(ctx).slice(0, 3) }; } return o; };
      if (process.env.R2_GROUPS) { res.renderGroup = res.renderGroup || {};
        for (const [g, list] of Object.entries(GROUPS)) { const fs = list || FIELDS.filter((f) => (g === 'publicProseBlocks' ? f.startsWith('publicProse.') : g === 'stressCast' ? f.startsWith('stress.cast') : f.startsWith('stressors.cast')));
          const G = await importOf(strip(fs)); const vG = await walk(G.saved);
          (res.renderGroup[g] = res.renderGroup[g] || {})[seed] = vG.threw ? { threw: vG.threw } : (vA.v ? diffViews(vA.v, vG.v) : { threwA: vA.threw }); } }
      const vB = await walk(B.saved);
      const out = res.render[seed] = { threwA: vA.threw || null, threwB: vB.threw || null, views: 0, viewDiffs: {} };
      if (vA.v && vB.v) { out.views = Object.keys(vA.v).length;
        for (const name of new Set([...Object.keys(vA.v), ...Object.keys(vB.v)])) { const a = vA.v[name] || ['[NO VIEW]']; const b = vB.v[name] || ['[NO VIEW]'];
          const sa = new Set(a); const sb = new Set(b); const onlyA = a.filter((l) => !sb.has(l)); const onlyB = b.filter((l) => !sa.has(l));
          const bad = onlyB.filter((l) => BAD.test(l));
          if (onlyA.length || onlyB.length) out.viewDiffs[name] = { onlyA: onlyA.slice(0, 6).map((l) => l.slice(0, 200)), onlyB: onlyB.slice(0, 6).map((l) => l.slice(0, 200)), nA: onlyA.length, nB: onlyB.length, badB: bad.slice(0, 4) }; } }
    }
    res.towns.push({ seed, ok: true });
    writeFileSync(`${OUT}/raw-${process.env.R2_TAG || 'run'}.json`, JSON.stringify(res, null, 1));
  }
}, 14400000);
