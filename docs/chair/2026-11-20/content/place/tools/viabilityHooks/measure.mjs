// PLACE-1 · viabilityHooks MEASURE (2026-11-20). Births 100 places a size EXACTLY as the chair's census births them
// (docs/chair/2026-11-20/seventh/measures/stored-census/census.mjs at bca8c6fe3: the birth line and the mask copied
// verbatim below, as ../entrepotNote/measure.mjs and ../safetyDesc/measure.mjs copy them) and writes one JSON row per
// place: every economicViability.plotHooks[] entry (raw, masked, its template id), the facts a wording could say, read
// off the FINAL record, and (always on: the pipeline's own `onStep` observer, no loader, no draw) the hooks and the
// facts as they stood when `generateNarratives` (the step that calls `viability.js :: generateEconomicViability`)
// returned, the seed in scope there, and every later step that changed the hooks.
//
//   node measure.mjs <repo> [n=100] > <scratch>/rows.json      (about 2 minutes; the JSON is not committed)
//
// Read-only over src/: it imports src modules and writes nothing there.
const [, , L, nArg = '100'] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
const { getActiveRng } = await import(`${L}/src/kernel/rngContext.js`).catch(() => ({ getActiveRng: () => null }));
const { templateOf } = await import('./templates.mjs');
await loadGenerationLawPayloads();
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const n = +nArg;
const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const INST = ['granary', 'mill', 'docks', 'tavern', 'smith', 'bank', 'temple'];
const birthStressorsOf = (cfg) => (Array.isArray(cfg?.stressTypes) ? cfg.stressTypes.filter((t) => typeof t === 'string').map((type) => ({ type })) : []);

/** The facts a hook wording could say, from one record (the writer's partial one, or the final one). */
function factRow(rec) {
  const f = factsOf(rec);
  const safe = (g) => { try { const v = g(); return v === undefined ? null : v; } catch (e) { return `ERR:${e.message}`; } };
  return {
    route: safe(() => f.route), market: safe(() => f.market), guild: safe(() => f.guild), tier: safe(() => f.tier), terrain: safe(() => f.terrain),
    foodBand: safe(() => f.famine?.shownBand ?? f.famine?.band), foodBandRaw: safe(() => f.famine?.band), famine: safe(() => f.famine?.famine), starving: safe(() => f.famine?.starvingAllowed),
    foodSources: safe(() => f.foodSources), failedSource: safe(() => f.failedSource), stores: safe(() => f.storesMonths), surplus: safe(() => f.growsMoreThanEats),
    imports: safe(() => (Array.isArray(f.imports) ? f.imports.map(String) : null)), war: safe(() => f.warState),
    water: safe(() => ({ navigable: f.water?.navigable ?? null, river: f.water?.river ?? null, coast: f.water?.coast ?? null })),
    inst: Object.fromEntries(INST.map((k) => [k, safe(() => (typeof f.hasInstitution === 'function' ? f.hasInstitution(k) : null))])),
    crisis: safe(() => (Array.isArray(f.crisis?.kinds) ? f.crisis.kinds : null)),
  };
}
const slim = (hs) => (Array.isArray(hs) ? hs : []).map((h) => ({ hook: String(h?.hook ?? ''), category: h?.category ?? null, severity: h?.severity ?? null }));

const rows = [];
for (const size of SIZES) {
  for (let i = 0; i < n; i++) {
    const seed = `hxd-${size}-${i}`;
    /** @type {any} */ let atWriter = null;
    /** @type {string[]} */ const changedBy = [];
    let last = null;
    const onStep = (name, ctx) => {
      const now = JSON.stringify(slim(ctx.economicViability?.plotHooks));
      if (name === 'generateNarratives') {
        const ev = ctx.economicViability || {};
        const cfg = { ...(ctx.effectiveConfig || {}), tier: ctx.tier };
        atWriter = {
          hooks: slim(ev.plotHooks),
          ctxSeed: typeof ctx._seed === 'string' && ctx._seed.length > 0 ? ctx._seed : null,
          rngSeed: (() => { try { return getActiveRng()?.seed ?? null; } catch { return null; } })(),
          configSeed: typeof ctx.effectiveConfig?._seed === 'string' ? ctx.effectiveConfig._seed : null,
          importChannel: ev.metrics?.foodBalance?.importChannel ?? null,
          // the facts thunk the writer hands `deriveSupplyRiskAnalysis` (viability.js), rebuilt the same way
          facts: factRow({ institutions: ctx.institutions, config: cfg, tier: ctx.tier, economicState: ctx.economicState, stressors: birthStressorsOf(cfg) }),
          stressTypes: cfg.stressTypes || [],
        };
      } else if (last !== null && now !== last) changedBy.push(name);
      if (name === 'generateNarratives' || last !== null) last = now;
    };
    const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {}, onStep });
    // the chair's mask, verbatim
    const names = new Set();
    const add = (x) => { if (typeof x === 'string' && x.trim().length > 2) names.add(x.trim()); };
    add(t.name);
    for (const p of t.npcs || []) { add(p.name); for (const w of String(p.name || '').split(/\s+/)) if (w.length > 3) add(w); }
    for (const f of t.powerStructure?.factions || []) { add(f.name); add(f.faction); }
    const list = [...names].sort((a, b) => b.length - a.length);
    const re = list.length ? new RegExp(list.map(esc).join('|'), 'g') : null;
    const mask = (s) => (re ? s.replace(re, '#') : s).replace(/\d+/g, '0');

    const ev = t.economicViability || {};
    rows.push({
      size, i, seed,
      hooks: slim(ev.plotHooks).map((h) => ({ ...h, masked: mask(h.hook), template: templateOf(h.hook) })),
      importChannel: ev.metrics?.foodBalance?.importChannel ?? null,
      deficitPercent: ev.metrics?.foodBalance?.deficitPercent ?? null,
      tradeRouteAccess: t.config?.tradeRouteAccess ?? null,
      stressTypes: t.config?.stressTypes || [],
      facts: factRow(t),
      atWriter, changedBy,
    });
  }
  process.stderr.write(`${size} done\n`);
}
console.log(JSON.stringify(rows));
