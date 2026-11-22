// PEOPLE-1 seat M3 (2026-11-20): the births the M3 measure reads, born EXACTLY as the chair's instrument births them
// (lane/chair-2026-11-08 :: docs/chair/2026-11-20/seventh/measures/stored-census/census.mjs): seeds hxd-<size>-<i>,
// generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} }) after
// loadGenerationLawPayloads(); the same name mask list (the place's name, its people's names and their words of more than
// three letters, its powers' names -> '#'; digits -> '0'; the mask itself is applied by m3-origins.mjs).
// It keeps, per place, only what the M3 measure reads: settlementReason[], history.founding, the inputs the two writers
// read (route, terrain, food balance, the roster flags, the prosperity label), and EVERY vocabulary atom answered twice:
//   final : factsOf(record) on the FINAL record (what a census self-check reads);
//   birth : birthFactsOf({ institutions, config, tier }, worldLaw) on the final roster and config, the founding state's own
//           view (`foundingRowAdmits.js :: foundingStateOf`), so the measure can say which atoms a founding-time pick holds.
// Usage: node m3-births.mjs <checkout> <n per size> <cache.json>   (prints count lines only)
import { writeFileSync } from 'node:fs';

const [, , L, nArg = '100', cachePath] = process.argv;
if (!L || !cachePath) throw new Error('usage: node m3-births.mjs <checkout> <n> <cache.json>');
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { factsOf, birthFactsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
const V = await import(`${L}/src/domain/facts/factVocabulary.js`);
const { resolveGenerationWorldLaw } = await import(`${L}/src/generators/generationContext.js`);
const { getInstFlags } = await import(`${L}/src/generators/priorityHelpers.js`);
const { hasInstitution } = await import(`${L}/src/domain/facts/institutions.js`);
await loadGenerationLawPayloads();

// Every atom the vocabulary can answer without a person or a pair in context, expanded over its keys / band words.
const ATOMS = [];
for (const [k, d] of Object.entries(V.FACT_DIMENSIONS)) {
  if (d.needsContext || d.shape === 'crisis') continue;
  if (d.shape === 'band') { for (const w of d.order || []) ATOMS.push(`${k}: ${w}`); continue; }
  if (Array.isArray(d.keys) && d.keys.length) { ATOMS.push(k); for (const w of d.keys) ATOMS.push(`${k}: ${w}`); continue; }
  ATOMS.push(k);
}
for (const c of ['crisis', 'crisis: calm']) ATOMS.push(c);
const answer = (facts) => {
  const on = [];
  for (const a of ATOMS) { let v; try { v = V.atomHolds(a, facts); } catch { v = undefined; } if (v === true) on.push(a); }
  return on;
};
const goodName = (x) => (typeof x === 'string' ? x : x?.name || x?.resource || x?.item || x?.label || null);

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const n = +nArg;
const out = { base: process.env.M3_BASE || null, n, atoms: ATOMS, sizes: {} };
for (const size of SIZES) {
  const places = [];
  for (let i = 0; i < n; i++) {
    const seed = `hxd-${size}-${i}`;
    const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    const names = new Set();
    const add = (x) => { if (typeof x === 'string' && x.trim().length > 2) names.add(x.trim()); };
    add(t.name);
    for (const p of t.npcs || []) { add(p.name); for (const w of String(p.name || '').split(/\s+/)) if (w.length > 3) add(w); }
    for (const f of t.powerStructure?.factions || []) { add(f.name); add(f.faction); }
    const cfg = t.config || {};
    const f = factsOf(t);
    let worldLaw = null; try { worldLaw = resolveGenerationWorldLaw(t.generationContext, cfg); } catch { worldLaw = null; }
    let birthOn = null;
    try { birthOn = answer(birthFactsOf({ institutions: t.institutions, config: cfg, tier: t.tier }, worldLaw)); } catch { birthOn = null; }
    const fb = t.economicViability?.metrics?.foodBalance || null;
    let hasDocks = null, tavern = null;
    try { hasDocks = Boolean(getInstFlags(cfg, t.institutions).inst.hasPort); } catch { hasDocks = null; }
    try { tavern = hasInstitution({ institutions: t.institutions }, 'tavern'); } catch { tavern = null; }
    const fnd = t.history?.founding || {};
    places.push({
      i, seed, recordSeed: t._seed ?? null, tier: t.tier, names: [...names],
      settlementReason: Array.isArray(t.settlementReason) ? t.settlementReason : (t.settlementReason == null ? null : [String(t.settlementReason)]),
      founding: { reason: fnd.reason ?? null, foundedBy: fnd.foundedBy ?? null, initialChallenge: fnd.initialChallenge ?? null, overcoming: fnd.overcoming ?? null, age: fnd.age ?? null },
      inputs: {
        route: cfg.tradeRouteAccess ?? null, terrainType: cfg.terrainType ?? null, stressTypes: cfg.stressTypes ?? [],
        nearbyResources: cfg.nearbyResources ?? [], specialResources: cfg.specialResources ?? [],
        foodBalance: fb ? { rawDeficit: fb.rawDeficit ?? null, deficit: fb.deficit ?? null, dailyNeed: fb.dailyNeed ?? fb.need ?? null, importCoverage: fb.importCoverage ?? null } : null,
        hasDocks, tavern, prosperityLabel: t.economicState?.prosperity ?? null,
        government: t.powerStructure?.government ?? null,
      },
      raw: {
        terrain: f.terrain ?? null, route: f.route ?? null, water: f.water?.kind ?? null, prosperity: f.prosperity ?? null,
        rulerKind: f.rulerKind ?? null, populationBand: f.populationBand ?? null, culture: f.culture ?? null,
        exports: (f.exports || []).map(goodName).filter(Boolean).slice(0, 6),
        imports: (f.imports || []).map(goodName).filter(Boolean).slice(0, 6),
        foodSources: (f.foodSources || []).map((x) => (typeof x === 'string' ? x : x?.type || x?.kind || x?.name || null)).filter(Boolean),
        institutions: (t.institutions || []).map((x) => x?.name).filter(Boolean),
      },
      on: answer(f), birthOn,
    });
  }
  out.sizes[size] = places;
  console.log(`births ${size}: places ${places.length} · with settlementReason ${places.filter((p) => p.settlementReason?.length).length} · with foundedBy ${places.filter((p) => p.founding.foundedBy).length} · with overcoming ${places.filter((p) => p.founding.overcoming).length}`);
}
writeFileSync(cachePath, JSON.stringify(out));
console.log(`atoms answered per place: ${ATOMS.length}`);
console.log('written <cache.json> (a local cache, not committed; reproduce: M3_BASE=<base> node m3-births.mjs <checkout> 100 <cache.json>)');
