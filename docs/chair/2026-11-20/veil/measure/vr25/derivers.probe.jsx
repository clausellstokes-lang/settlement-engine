// VR25 DERIVERS (VEIL-20, item 3a; the chair's ruling VR25 of 2026-11-20 01:15 UTC, vetoable by the owner).
// For each field VEIL-19's import measure found mis-drawing on the importer's record (R2-IMPORT-MEASURE.md, the (c)
// list), and for the VR19 rows withheld on every read since (economyOutput, prosperity), this probe asks: does a
// deriver exist that reads SERVED fields only?
//   S   the served document: born -> composed -> JSON -> galleryPayloadFor + projectShareVeil under the DEFAULT veil
//       (writeShareVeil({}, [])), Reveal DM off; then every withhold-always path DELETED (the 80 of the import measure
//       and the VR19 additions), as the server will send it after R2.
//   RED (the importer's app today): the field read off S as the importer's readers read it: it is absent.
//   CANDIDATE D_f: the engine's own function, run on S wrapped in a recorder that notes every read of a key that is
//       ABSENT and withheld (a read of a withheld path); fields re-derived earlier in the chain are put back first and
//       may be read. GREEN: zero withheld reads, a finite value (no default).
//   FIDELITY: D_f on the FULL stored town (nothing withheld, nothing hidden) equals the stored value: proves the
//       deriver is the engine's own rule, not a look-alike. Counted per field over every town.
//   SERVED-TOWN: on towns with NO hideable house (the veil removes nothing), D_f(S) equals the stored value.
// Run: RV6_SRC=<tree> RV9_PROBE=<this file> npx vitest run --config <vitest.config.mjs beside it>; out: VR25_OUT.
import { it } from 'vitest';
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';

const SRC = process.env.RV6_SRC;
const OUT = process.env.VR25_OUT || '/var/tmp/v18/out/v20/vr25';
const FIELDS77 = readFileSync(`${SRC}/docs/chair/2026-11-20/veil/out/v19/r2imp-fields77.txt`, 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);
const EXTRA = ['economicState.compound.raw', 'economicState.safetyProfile.compound', 'economicState.safetyProfile.safetyRatio'];
const VR19 = ['economicState.compound.economyOutput', 'economicState.safetyProfile.blackMarketCapture', 'economicState.prosperity', 'history.founding.overcoming'];
const norm = (p) => p.replace(/ \(only in [AB]\)$/, '').replace(/\[\]$/, '').replace(/\[\]/g, '');
const WITHHELD = [...new Set([...FIELDS77, ...EXTRA, ...VR19].map(norm))];
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const segsOf = (p) => { const m = p.match(/^publicProse\.blocks\.([^.]+)\.(.*)$/); return m ? ['publicProse', 'blocks', m[1], ...m[2].split('.')] : p.split('.'); };
function del(o, segs) {
  if (Array.isArray(o)) { for (const x of o) del(x, segs); return; }
  if (!isRec(o)) return;
  const [h, ...t] = segs; if (!(h in o)) return;
  if (!t.length) { delete o[h]; return; }
  del(o[h], t);
}
const WSET = new Set(WITHHELD);
const withheldHit = (path) => { for (const w of WSET) if (path === w || path.startsWith(`${w}.`)) return w; return null; };
// The recorder: a deep proxy; a get or `in` of an ABSENT key whose path is withheld is a withheld read.
function recorder(root) {
  const hits = new Set();
  const cache = new WeakMap();
  const wrap = (o, path) => {
    if (!o || typeof o !== 'object') return o;
    if (cache.has(o)) return cache.get(o);
    const p = new Proxy(o, {
      get(t, k, r) {
        if (typeof k === 'symbol') return Reflect.get(t, k, r);
        const child = Array.isArray(t) && /^\d+$/.test(k) ? path : (path ? `${path}.${k}` : k);
        if (!(k in t)) { const w = withheldHit(child); if (w) hits.add(w); return undefined; }
        return wrap(Reflect.get(t, k, r), child);
      },
      has(t, k) { if (typeof k !== 'symbol' && !(k in t)) { const child = path ? `${path}.${k}` : k; const w = withheldHit(child); if (w) hits.add(w); } return Reflect.has(t, k); },
    });
    cache.set(o, p);
    return p;
  };
  return { rec: wrap(root, ''), hits };
}
const clone = (v) => JSON.parse(JSON.stringify(v));
// RED: the importer's reader finds the field (or any leaf of it) absent on the served document
const hasUndefined = (v) => v === undefined || (Array.isArray(v) ? v.some(hasUndefined) : isRec(v) ? Object.values(v).some(hasUndefined) : false);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

it('VR25 derivers', async () => {
  mkdirSync(OUT, { recursive: true });
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const { composePublicProse } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const { withPublicProse } = await import(`${SRC}/src/domain/display/publicProse.js`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { isHideableHouse } = await import(`${SRC}/src/domain/people/cardVeil.js`);
  const { getInstFlags } = await import(`${SRC}/src/generators/priorityHelpers.js`);
  const { generateDefenseProfile } = await import(`${SRC}/src/generators/defenseGenerator.js`);
  const { keepOfRecord } = await import(`${SRC}/src/domain/facts/keep.js`);
  const { promoteStressorsToConditions } = await import(`${SRC}/src/domain/conditionPromotion.js`);
  const { computePublicLegitimacy } = await import(`${SRC}/src/generators/factionDynamics.js`);
  const { generateSpatialLayout } = await import(`${SRC}/src/generators/spatialGenerator.js`);
  const { computeBaseProsperity, deriveProsperityLabel } = await import(`${SRC}/src/generators/economy/prosperity.js`);
  await loadGenerationLawPayloads();

  const COMPOUND_KEYS = ['criminalEffective', 'criminalPreStress', 'militaryEffective', 'magicInfluence', 'religionInfluence', 'economyOutput', 'raw'];
  // Each deriver: (rec) -> value, and `put(rec, value)` puts it back for the next derivers in the chain.
  const DERIVERS = [
    { f: 'economicState.compound', get: (r) => Object.fromEntries(COMPOUND_KEYS.map((k) => [k, r.economicState?.compound?.[k]])),
      d: (r) => { const x = getInstFlags(r.config || {}, r.institutions || []); return Object.fromEntries(COMPOUND_KEYS.map((k) => [k, x[k]])); },
      put: (r, v) => { r.economicState.compound = { ...(r.economicState.compound || {}), ...v }; } },
    { f: 'economicState.safetyProfile.compound', get: (r) => { const c = r.economicState?.safetyProfile?.compound; return c ? Object.fromEntries(COMPOUND_KEYS.map((k) => [k, c[k]])) : undefined; },
      d: (r) => { const x = getInstFlags(r.config || {}, r.institutions || []); return Object.fromEntries(COMPOUND_KEYS.map((k) => [k, x[k]])); },
      put: (r, v) => { const sp = r.economicState.safetyProfile; if (sp) sp.compound = { ...(sp.compound || {}), ...v }; } },
    { f: 'economicState.safetyProfile.safetyRatio', get: (r) => r.economicState?.safetyProfile?.safetyRatio,
      d: (r) => { const c = r.economicState.compound; return Math.round((c.militaryEffective / Math.max(8, c.criminalEffective)) * 10) / 10; },
      put: (r, v) => { if (r.economicState.safetyProfile) r.economicState.safetyProfile.safetyRatio = v; } },
    { f: 'economicState.foodSecurity.storageMonths', get: (r) => r.economicState?.foodSecurity?.storageMonths,
      d: (r) => r.economicState?.foodSecurity?.foodRecord?.storageMonths,
      put: (r, v) => { if (r.economicState.foodSecurity) r.economicState.foodSecurity.storageMonths = v; } },
    { f: 'economicState.prosperity', get: (r) => r.economicState?.prosperity,
      d: (r) => { const e = r.economicState || {}; const c = r.config || {}; const names = (r.institutions || []).map((i) => i?.name);
        const base = computeBaseProsperity(r.tier, c.tradeRouteAccess, r.institutions || [], c, names, e.incomeSources || [], e.foodSecurity || null).label;
        return base === 'Subsistence' ? { notKnown: 'a Subsistence base takes the birth draw' } : deriveProsperityLabel(base, c, r.institutions || []); },
      put: (r, v) => { if (typeof v === 'string') r.economicState.prosperity = v; } },
    { f: 'defenseProfile.readiness.score', get: (r) => r.defenseProfile?.readiness?.score,
      d: (r) => generateDefenseProfile(r, keepOfRecord(r.economicState)).readiness.score,
      put: (r, v) => { if (r.defenseProfile?.readiness) r.defenseProfile.readiness.score = v; } },
    { f: 'activeConditions.severity', get: (r) => (r.activeConditions || []).map((c) => [c.archetype, c.severity]),
      d: (r) => { const fresh = promoteStressorsToConditions({ ...r, activeConditions: [] }); const by = new Map((fresh.activeConditions || []).map((c) => [c.archetype, c.severity]));
        return (r.activeConditions || []).map((c) => [c.archetype, by.has(c.archetype) ? by.get(c.archetype) : { notKnown: 'no stressor promotes it' }]); },
      put: (r, v) => { (r.activeConditions || []).forEach((c, i) => { if (typeof v[i]?.[1] === 'number') c.severity = v[i][1]; }); } },
    { f: 'powerStructure.publicLegitimacy.breakdown', get: (r) => { const b = r.powerStructure?.publicLegitimacy?.breakdown; return b ? { prosperity: b.prosperity, safety: b.safety } : undefined; },
      d: (r) => { const b = computePublicLegitimacy(r.economicState, r.defenseProfile?.readiness?.label, r.tier).breakdown; return { prosperity: b.prosperity, safety: b.safety }; },
      put: () => {} },
    { f: 'spatialLayout.quarters', get: (r) => r.spatialLayout?.quarters,
      d: (r) => generateSpatialLayout(r.tier, r.institutions || [], r.config?.tradeRouteAccess, r.config?.terrainType).quarters,
      put: () => {} },
  ];

  const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
  const CR = [null, 'infiltrated', 'insurgency', 'under_siege', null, 'occupied', 'famine', 'slave_revolt', null, 'politically_fractured', 'indebted', 'wartime', null, 'plague_onset', 'succession_void', 'recently_betrayed', null, 'monster_pressure', 'religious_conversion', 'mass_migration', null, 'infiltrated', 'under_siege', 'insurgency'];
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: process.env.VR25_MAGIC !== 'false', contentProfile: 'grounded' };
  const N = Number(process.env.VR25_N || 48);
  const mo = veil.writeShareVeil({}, []);
  const res = { withheld: WITHHELD.length, towns: [], per: {} };
  const tally = (f) => (res.per[f] = res.per[f] || { towns: 0, redAbsent: 0, withheldReads: {}, notKnown: 0, threw: [], fidelityEq: 0, fidelityNe: 0, fidelityNeEx: [], servedTownEq: 0, servedTownNe: 0, servedTownNeEx: [], hiddenTownMoved: 0 });
  for (let i = 0; i < N; i += 1) {
    const size = SIZES[i % 6]; const crisis = CR[i % CR.length]; const seed = `vr25-${size}-${crisis || 'calm'}-${i}`;
    const cfg = birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
    let t; try { t = generateSettlementPipeline(cfg, null, { seed, customContent: {} }); } catch (e) { res.towns.push({ seed, birthThrew: String(e.message).slice(0, 200) }); continue; }
    t = clone(withPublicProse(t, composePublicProse(t)));
    const hidden = (t.institutions || []).filter((h) => isHideableHouse(h)).length;
    const served = clone(veil.projectShareVeil(veil.galleryPayloadFor(t, { shareDm: false, memberOverrides: mo }), mo));
    for (const w of WITHHELD) del(served, segsOf(w));
    const full = clone(t);
    const chain = clone(served);
    for (const D of DERIVERS) {
      const T = tally(D.f); T.towns += 1;
      if (hasUndefined(D.get(served))) T.redAbsent += 1;
      const { rec, hits } = recorder(chain);
      let v; try { v = D.d(rec); } catch (e) { T.threw.push(`${seed}: ${String(e?.message || e).slice(0, 160)}`); continue; }
      for (const h of hits) T.withheldReads[h] = (T.withheldReads[h] || 0) + 1;
      if (JSON.stringify(v ?? null).includes('notKnown')) T.notKnown += 1;
      // fidelity on the full stored town
      let vf; try { vf = D.d(clone(full)); } catch { vf = Symbol('threw'); }
      if (eq(vf, D.get(full))) T.fidelityEq += 1; else { T.fidelityNe += 1; if (T.fidelityNeEx.length < 4) T.fidelityNeEx.push({ seed, derived: JSON.stringify(vf)?.slice(0, 200), stored: JSON.stringify(D.get(full))?.slice(0, 200) }); }
      if (hidden === 0) { if (eq(v, D.get(full))) T.servedTownEq += 1; else { T.servedTownNe += 1; if (T.servedTownNeEx.length < 4) T.servedTownNeEx.push({ seed, derived: JSON.stringify(v)?.slice(0, 200), stored: JSON.stringify(D.get(full))?.slice(0, 200) }); } }
      else if (!eq(v, D.get(full))) T.hiddenTownMoved += 1;
      try { D.put(chain, clone(v)); } catch { /* a field with no home in this town */ }
    }
    // VR26 ARM (side measure): does the SERVED legitimacy score give back the withheld prosperity? For each prosperity
    // label, the engine's own computePublicLegitimacy over the served document with that label; the labels whose score
    // equals the served score. Identified = one contribution class remains; told = it is the stored label's class.
    const ps = served.powerStructure?.publicLegitimacy?.score;
    if (Number.isFinite(ps) && t.economicState?.prosperity) {
      const LABELS = ['Struggling', 'Poor', 'Moderate', 'Comfortable', 'Prosperous', 'Wealthy'];
      const fits = LABELS.filter((L) => computePublicLegitimacy({ ...chain.economicState, prosperity: L }, chain.defenseProfile?.readiness?.label, chain.tier).score === ps);
      const trueFit = computePublicLegitimacy({ ...chain.economicState, prosperity: t.economicState.prosperity }, chain.defenseProfile?.readiness?.label, chain.tier).score === ps;
      const inv = res.inversion = res.inversion || { towns: 0, storedScoreIsFormula: 0, oneClass: 0, oneClassIsTrue: 0, hiddenMovedProsperity: 0, hiddenMovedAndTold: 0, ex: [] };
      inv.towns += 1; if (trueFit) inv.storedScoreIsFormula += 1;
      const classes = new Set(fits.map((L) => ({ Struggling: -20, Poor: -10, Moderate: 0, Comfortable: 8, Prosperous: 15, Wealthy: 20 })[L]));
      if (classes.size === 1) { inv.oneClass += 1; if (fits.includes(t.economicState.prosperity)) inv.oneClassIsTrue += 1; }
      const derived = DERIVERS.find((D) => D.f === 'economicState.prosperity');
      let dv = null; try { dv = derived.d(clone(served)); } catch { /* none */ }
      if (hidden && typeof dv === 'string' && dv !== t.economicState.prosperity) { inv.hiddenMovedProsperity += 1; if (classes.size === 1 && fits.includes(t.economicState.prosperity)) { inv.hiddenMovedAndTold += 1; if (inv.ex.length < 4) inv.ex.push({ seed, stored: t.economicState.prosperity, servedTownImplies: dv, score: ps, fits }); } }
    }
    res.towns.push({ seed, hidden });
  }
  writeFileSync(`${OUT}/derivers-${process.env.VR25_TAG || 'run'}.json`, JSON.stringify(res, null, 1));
}, 7200000);
