import { CORPUS, buildOne } from '../exemplars.mjs';
console.log(['leaf','tier','regime','grade','wear','exp','upkeep','prosp','mil','deficit'].join('\t'));
for (const spec of CORPUS) {
  const { fabric } = buildOne(spec, { rampart: true });
  const r = fabric.meta.bandRegime; if (!r) continue;
  console.log([spec.key, fabric.meta.tier, r.regime, r.wear.grade, r.wear.wear, r.wear.exposure,
    r.wear.upkeep, r.wear.inputs.prosperity, r.wear.inputs.military, r.wear.inputs.deficit].join('\t'));
}

/* ⭐ `crumbling` IS DARK IN THE CORPUS (max wear 0.46 against a 0.55 cut), so it is exercised by
 * FIXTURE — the same discipline the rung ladder needed. A very old, poor, peaceful town that kept
 * the circuit its peak built is the settlement the grade is FOR. */
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { buildTownMapModel } from '../../src/domain/townMap/townMapModel.js';
import { buildFabric } from '../../src/domain/townMap/fabric/buildFabric.js';
import { wearGrade } from '../../src/domain/townMap/fabric/rampartWorks.js';
console.log('\n─── the grade ladder, exercised on the DERIVATION over its own input space ───');
console.log(['stood(y)', 'prosperity', 'military', 'deficit', 'wear', 'grade'].join('\t'));
for (const c of [
  { wallStoodYears: 40, prosperityRank: 4, military: 0.6, deficit: 0 },
  { wallStoodYears: 180, prosperityRank: 3, military: 0.2, deficit: 0 },
  { wallStoodYears: 300, prosperityRank: 1, military: 0.1, deficit: 0.6 },
  { wallStoodYears: 300, prosperityRank: 0, military: 0, deficit: 0.9 },
  { wallStoodYears: null, prosperityRank: 0, military: 0, deficit: 1 },
]) {
  const g = wearGrade(c);
  console.log([c.wallStoodYears, c.prosperityRank, c.military, c.deficit, g.wear, g.grade].join('\t'));
}
const F = { seed: 'reg2-crumble-1', settType: 'town' };
let s2 = generateSettlementPipeline({ settType: F.settType }, null, { seed: F.seed });
s2 = { ...s2, tier: 'city', defenseProfile: { ...(s2.defenseProfile || {}), defensiveTerrain: 'sheltered vale' } };
const fab = buildFabric(s2, buildTownMapModel(s2, null), { rampart: true });
const r2r = fab.meta.bandRegime;
console.log(`\nFIXTURE reg2-crumble-1 (a demoted, sheltered, unprosperous town): grade=${r2r && r2r.wear.grade} wear=${r2r && r2r.wear.wear} deficit=${r2r && r2r.wear.inputs.deficit} walled=${fab.walls.length > 0}`);
if (fab.walls.length) console.log(`  ring grade (old-core bump applies per ring): ${fab.walls.map((w) => `${w.kind}=${w.rampart.wear.grade}`).join(', ')}`);
