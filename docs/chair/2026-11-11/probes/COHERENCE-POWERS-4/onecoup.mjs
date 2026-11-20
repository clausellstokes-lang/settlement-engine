// node onecoup.mjs <tree> <key> — one corpus birth's coup label, roster, and the coup's incumbent and challengers
import path from 'node:path';
import { jobsFor } from './corpus.mjs';
const tree = path.resolve(process.argv[2]); const imp = (p) => import(path.join(tree, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { coupContenders, coupRiskLabel } = await imp('src/domain/rulingPowerCoup.js');
await loadGenerationLawPayloads();
const j = (await jobsFor(imp, 'RS')).find((x) => x.key === process.argv[3]);
const s = generateSettlementPipeline(j.cfg, null, { seed: j.seed, customContent: {} });
const c = coupContenders(s);
console.log(coupRiskLabel(c), '|', s.powerStructure.factions.map((f) => `${f.isGoverning ? '*' : ''}${f.faction}(${f.power})`).join(', '),
  '| incumbent', JSON.stringify(c?.incumbent && { n: c.incumbent.name || c.incumbent.faction, gated: c.incumbent.gated, w: c.incumbent.amplifiedWeight }),
  '| challengers', JSON.stringify((c?.challengers || []).map((x) => [x.name || x.faction, x.weight])));
