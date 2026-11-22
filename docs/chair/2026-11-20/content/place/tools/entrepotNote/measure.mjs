// PLACE-1 · entrepotNote MEASURE (2026-11-20). Births 100 places a size EXACTLY as the chair's census births them
// (docs/chair/2026-11-20/seventh/measures/stored-census/census.mjs at bca8c6fe3: the birth line and the mask copied
// verbatim below, as ../situationDesc/measure.mjs copies them) and writes one JSON row per place: every chain holding
// an entrepotNote (masked), whether EconomicsTab's gate prints it (entrepot && entrepotNote && !dependency), and the
// facts a wording could say, read off the FINAL record. In `capture` mode also: what stood in scope at the writer
// (capture-hooks.mjs wraps computeActiveChains) and the notes after each economy step (the pipeline's `onStep`).
//
//   node measure.mjs <repo> [n=100] [plain|capture] > out/rows-<mode>.json
//
// Read-only over src/: it imports src modules and writes nothing there.
import { register } from 'node:module';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const [, , L, nArg = '100', mode = 'plain'] = process.argv;
if (mode === 'capture') register(pathToFileURL(join(dirname(fileURLToPath(import.meta.url)), 'capture-hooks.mjs')));

const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
const { tradeRouteOf } = await import(`${L}/src/domain/facts/terrain.js`);
const { canonExports, canonImports } = await import(`${L}/src/domain/canonicalAccessors.js`);
const { chainCarrierOf } = await import(`${L}/src/domain/facts/chainCarrier.js`);
const { goodExportedOf } = await import(`${L}/src/domain/facts/goodExported.js`);
await loadGenerationLawPayloads();
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const n = +nArg;
const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const noted = (cs) => (Array.isArray(cs) ? cs : []).filter((c) => c && c.entrepotNote);
const slim = (c) => ({ id: c.chainId, note: c.entrepotNote, entrepot: !!c.entrepot, dependency: !!c.dependency, status: c.status ?? null, outputs: [...(c.outputs || [])] });

const rows = [];
for (const size of SIZES) {
  for (let i = 0; i < n; i++) {
    const seed = `hxd-${size}-${i}`;
    /** @type {any[]} */ const caps = [];
    /** @type {Record<string, any>} */ const snaps = {};
    if (mode === 'capture') {
      globalThis.__chainCapture = (r, a) => caps.push({ route: a[3], tier: a[2], chains: noted(r).map(slim) });
    }
    const onStep = mode === 'capture' ? (name, ctx) => {
      if (['generateEconomy', 'economyReconcilePass', 'generateNarratives', 'assembleSettlement'].includes(name)) {
        snaps[name] = { chains: noted(ctx.economicState?.activeChains).map(slim), seedInCtx: typeof ctx._seed === 'string' && ctx._seed.length > 0 };
        if (name === 'economyReconcilePass') {
          // what the proposed call line would read there: the record as the step holds it (the sibling's shape)
          const rec = { config: ctx.effectiveConfig, economicState: ctx.economicState, institutions: ctx.institutions, tier: ctx.tier };
          const ff = factsOf(rec);
          snaps[name].at = { route: tradeRouteOf(rec), market: ff.market, inst: Object.fromEntries(['tavern', 'bank'].map((k) => [k, typeof ff.hasInstitution === 'function' ? ff.hasInstitution(k) : null])),
            carriers: noted(ctx.economicState?.activeChains).map((c) => `${c.chainId}:${chainCarrierOf(c, rec).kind}`) };
        }
      }
    } : undefined;
    const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {}, ...(onStep ? { onStep } : {}) });
    // the chair's mask, verbatim
    const names = new Set();
    const add = (x) => { if (typeof x === 'string' && x.trim().length > 2) names.add(x.trim()); };
    add(t.name);
    for (const p of t.npcs || []) { add(p.name); for (const w of String(p.name || '').split(/\s+/)) if (w.length > 3) add(w); }
    for (const f of t.powerStructure?.factions || []) { add(f.name); add(f.faction); }
    const list = [...names].sort((a, b) => b.length - a.length);
    const re = list.length ? new RegExp(list.map(esc).join('|'), 'g') : null;
    const mask = (s) => (re ? s.replace(re, '#') : s).replace(/\d+/g, '0');

    const e = t.economicState || {};
    const f = factsOf(t);
    const water = f.water || {};
    const row = {
      size, i, seed,
      chains: noted(e.activeChains).map((c) => ({ ...slim(c), masked: mask(String(c.entrepotNote)), printed: !!(c.entrepot && c.entrepotNote && !c.dependency), activatedByResource: !!c.activatedByResource, resourceActive: !!c.resourceActive, resource: c.resource ?? null, label: c.label ?? null, needKey: c.needKey, carrier: chainCarrierOf(c, t).kind })),
      chainCount: (e.activeChains || []).length,
      route: tradeRouteOf(t), tradeAccess: e.tradeAccess ?? null, isEntrepot: e.isEntrepot === true,
      transit: Array.isArray(e.transit) ? e.transit.map(String) : [],
      exports: canonExports(t).map(String), imports: canonImports(t).map(String),
      exportedKeys: ['cloth', 'flour', 'hides', 'ale', 'arms'].filter((k) => goodExportedOf(t, k) === true),
      facts: { market: f.market, route: f.route, tier: f.tier, terrain: f.terrain, inst: Object.fromEntries(['tavern', 'bank', 'docks'].map((k) => [k, typeof f.hasInstitution === 'function' ? f.hasInstitution(k) : null])), water: { navigable: water.navigable, coast: water.coast, river: water.river } },
    };
    if (mode === 'capture') { row.caps = caps; row.snaps = snaps; row.finalInst = Object.fromEntries(['tavern', 'bank'].map((k) => [k, typeof f.hasInstitution === 'function' ? f.hasInstitution(k) : null])); }
    rows.push(row);
  }
  process.stderr.write(`${size} done\n`);
}
console.log(JSON.stringify(rows));
