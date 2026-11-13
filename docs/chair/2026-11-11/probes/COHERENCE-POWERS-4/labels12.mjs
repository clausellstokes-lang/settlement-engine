// node labels12.mjs <tree> <keys...> — every label a birth carries that a power change could move
import path from 'node:path';
import { jobsFor } from './corpus.mjs';
const tree = path.resolve(process.argv[2]); const imp = (p) => import(path.join(tree, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { coupContenders, coupRiskLabel } = await imp('src/domain/rulingPowerCoup.js');
await loadGenerationLawPayloads();
const want = new Set(process.argv.slice(3)); const out = {};
for (const j of (await jobsFor(imp, 'RS')).filter((x) => want.has(x.key))) {
  const s = generateSettlementPipeline(j.cfg, null, { seed: j.seed, customContent: {} });
  const c = coupRiskLabel(coupContenders(s));
  out[j.key] = { coup: typeof c === 'string' ? c : c?.label, capture: s.powerStructure.criminalCaptureState, stability: s.powerStructure.stability,
    legit: s.powerStructure.legitimacy ?? null, labels: s.powerStructure.factions.map((f) => [f.faction, f.power, f.powerLabel]),
    imp: s.npcs.map((n) => [n.name, n.importance]).filter((x) => x[1] !== 'minor') };
}
console.log(JSON.stringify(out));
