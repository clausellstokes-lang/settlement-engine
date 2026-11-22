import path from 'node:path'; import fs from 'node:fs';
import { jobsFor } from './corpus.mjs';
const tree = path.resolve(process.argv[2]); const imp = (p) => import(path.join(tree, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
await loadGenerationLawPayloads();
let same = 0, diff = 0; const ex = [];
for (const j of (await jobsFor(imp, 'R')).filter((_, i) => i % 6 === 0)) {
  globalThis.__probe = {};
  generateSettlementPipeline(j.cfg, null, { seed: j.seed, customContent: {} });
  const pre = new Set((globalThis.__probe.plans || []).flatMap((p) => p.roster));
  const cfg = { ...j.cfg }; delete cfg._densityLawVersion;
  const s = generateSettlementPipeline(cfg, null, { seed: j.seed, customContent: {} });
  const nl = new Set((s.powerStructure?.factions || []).map((f) => f.faction));
  const eq = pre.size === nl.size && [...pre].every((x) => nl.has(x));
  if (eq) same++; else { diff++; if (ex.length < 5) ex.push(`${j.key}: pre ${[...pre].join(',')} | nolaw ${[...nl].join(',')}`); }
}
console.log('same', same, 'diff', diff); for (const e of ex) console.log(e);
