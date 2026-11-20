// PLACE-1 · viability MEASURE (2026-11-20). Births 100 places a size EXACTLY as the chair's census births them
// (docs/chair/2026-11-20/seventh/measures/stored-census/census.mjs at bca8c6fe3: the birth lines and the mask copied
// verbatim below, as tools/situationDesc/measure.mjs copies them) and writes one JSON row per place: every
// `economicViability.dependencies[]` and `.warnings[]` row (title, category, severity, description, impact, fixes), raw and
// masked; the summary; and the facts a wording could say, read off the FINAL record. In `capture` mode also what is in
// scope at the writer (`viability.js :: generateEconomicViability`, wrapped in memory by capture-hooks.mjs).
//
//   node measure.mjs <repo> [n=100] [plain|capture] > rows-<mode>.json
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
const { canonExports, canonImports } = await import(`${L}/src/domain/canonicalAccessors.js`);
const { tradeRouteOf } = await import(`${L}/src/domain/facts/terrain.js`);
const { tradeListsAsPrinted } = await import(`${L}/src/domain/display/tradeListDisplay.js`);
await loadGenerationLawPayloads();
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const n = +nArg;
const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const card = (w, mask) => ({
  title: String(w?.title ?? ''), category: w?.category ?? null, severity: w?.severity ?? null,
  description: String(w?.description ?? ''), impact: w?.impact == null ? null : String(w.impact),
  fixes: Array.isArray(w?.suggestedFixes) ? w.suggestedFixes.map(String) : [],
  m: {
    title: mask(String(w?.title ?? '')), description: mask(String(w?.description ?? '')),
    impact: w?.impact == null ? null : mask(String(w.impact)),
    fixes: Array.isArray(w?.suggestedFixes) ? w.suggestedFixes.map((x) => mask(String(x))) : [],
  },
});

const rows = [];
for (const size of SIZES) {
  for (let i = 0; i < n; i++) {
    const seed = `hxd-${size}-${i}`;
    /** @type {any[]} */ const caps = [];
    if (mode === 'capture') {
      globalThis.__viaCaptureIn = (a) => caps.push({ impAtWriter: [...(a[0]?.economicState?.primaryImports || [])], expAtWriter: [...(a[0]?.economicState?.primaryExports || [])], seedAtWriter: a[0]?.config?._seed ?? null, terrainT: a[1] ?? null });
      globalThis.__viaCapture = (r) => { const c = caps[caps.length - 1]; c.deps = (r.dependencies || []).map((d) => `${d.title}|${d.description}|${d.impact}`); c.warns = (r.warnings || []).map((d) => `${d.title}|${d.description}`); c.summary = r.summary; };
    }
    const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    // the chair's mask, verbatim
    const names = new Set();
    const add = (x) => { if (typeof x === 'string' && x.trim().length > 2) names.add(x.trim()); };
    add(t.name);
    for (const p of t.npcs || []) { add(p.name); for (const w of String(p.name || '').split(/\s+/)) if (w.length > 3) add(w); }
    for (const f of t.powerStructure?.factions || []) { add(f.name); add(f.faction); }
    const list = [...names].sort((a, b) => b.length - a.length);
    const re = list.length ? new RegExp(list.map(esc).join('|'), 'g') : null;
    const mask = (s) => (re ? s.replace(re, '#') : s).replace(/\d+/g, '0');

    const v = t.economicViability || {};
    const e = t.economicState || {};
    const f = factsOf(t);
    const p = tradeListsAsPrinted(t);
    const row = {
      size, i, seed,
      deps: (v.dependencies || []).map((w) => card(w, mask)),
      warns: (v.warnings || []).map((w) => card(w, mask)),
      summary: String(v.summary || ''), summaryMasked: mask(String(v.summary || '')),
      viable: v.viable, plotHookCount: (v.plotHooks || []).length,
      imports: canonImports(t).map(String), exports: canonExports(t).map(String),
      printed: { exports: p.exports, imports: p.imports, tradeStopped: p.tradeStopped },
      route: tradeRouteOf(t), terrain: f.terrain, market: f.market, guild: f.guild, tier: t.tier,
      stress: (t.config?.stressTypes || []).slice(),
      tradeDeps: (e.tradeDependencies || []).map((d) => ({ institution: d.institution, resource: d.resource, severity: d.severity })),
      importChannel: v.metrics?.foodBalance?.importChannel ?? null,
      foodDeficitPct: v.metrics?.foodBalance?.deficitPercent ?? null,
      water: { navigable: f.water?.navigable, coast: f.water?.coast, river: f.water?.river },
    };
    if (mode === 'capture') row.caps = caps;
    rows.push(row);
  }
  process.stderr.write(`${size} done\n`);
}
console.log(JSON.stringify(rows));
