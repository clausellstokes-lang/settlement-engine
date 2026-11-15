// ORDER-MEASURE-1 · O2: the governing power and its kind at the people (19), history (20) and stress-summary (A1) writes vs the end.
// TREE=<base + snap-hooks.patch> SEEDS=<seeds> CFG=<seedcfg.mjs> node govkind.mjs
import fs from 'node:fs';
const R = process.env.TREE + '/src'; const { makeCfgFor } = await import(process.env.CFG);
const { generateSettlementPipeline } = await import(R + '/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R + '/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R + '/store/configSlice.js'); await loadGenerationLawPayloads();
const cfgFor = makeCfgFor(birthConfig, DEFAULT_CONFIG);
const g = (ps) => { if (!ps) return null; const f = (ps.factions || []).find((x) => x.faction === ps.governingName) || null; const { power, rawPower, powerLabel, desc, ...rest } = f || {}; return JSON.stringify({ gov: ps.governingName, government: ps.government ?? null, fac: f ? rest : null }); };
const diff = {}, KD = {}; let n = 0;
for (const seed of fs.readFileSync(process.env.SEEDS, 'utf8').trim().split('\n')) {
  const at = {};
  globalThis.__OM_SNAP = (label, s) => { if (label === 'A1-stress-summary') at.A1 = g(s.powerStructure); };
  const s = generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {}, onStep: (name, ctx) => { if (name === 'generatePopulation' || name === 'generateNarratives') at[name] = g(ctx.powerStructure); } });
  const end = g(s.powerStructure); n++;
  for (const [k, v] of Object.entries(at)) if (v !== end) { (diff[k] ??= []).push(seed); if (k === "generateNarratives") { const a = JSON.parse(v), b = JSON.parse(end); const keys = (x, y, p) => x && y && typeof x === "object" ? Object.keys({ ...x, ...y }).flatMap((q) => keys(x[q], y[q], p + "." + q)) : (JSON.stringify(x) === JSON.stringify(y) ? [] : [p]); for (const q of keys(a, b, "")) KD[q] = (KD[q] || 0) + 1; } }
}
console.log("fields", JSON.stringify(KD)); console.log("towns", n, 'governing power or its record differs from the end:', JSON.stringify(Object.fromEntries(Object.entries(diff).map(([k, v]) => [k, v.length]))), JSON.stringify(Object.fromEntries(Object.entries(diff).map(([k, v]) => [k, v.slice(0, 3)]))));
