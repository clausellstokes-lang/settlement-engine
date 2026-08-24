/** renderWearFixture.mjs — the §614.2 crumbling fixture, rendered for the judging round. */
import { writeFileSync } from 'node:fs';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { buildTownMapModel } from '../../src/domain/townMap/townMapModel.js';
import { buildFabric } from '../../src/domain/townMap/fabric/buildFabric.js';
import { renderFolio } from '../renderFolio.mjs';
let s = generateSettlementPipeline({ settType: 'town' }, null, { seed: 'reg2-crumble-1' });
s = { ...s, tier: 'city', defenseProfile: { ...(s.defenseProfile || {}), defensiveTerrain: 'sheltered vale' } };
const fabric = buildFabric(s, buildTownMapModel(s, null), { rampart: true });
const out = renderFolio(fabric, { lens: 'parchment' });
writeFileSync(process.argv[2], out.svg);
const r = fabric.walls.map((w) => `${w.kind}:${w.rampart.wear.grade}`);
// a crop box on the ring that carries the WORST grade
const worst = fabric.walls.slice().sort((a, b) => (b.rampart.wear.grade === 'crumbling' ? 1 : 0) - (a.rampart.wear.grade === 'crumbling' ? 1 : 0))[0];
const p = worst.rampart.joints[0];
console.log(`WEAR ${r.join(' ')} prim=${out.primitiveCount} CROP ${Math.round(p.x - 60)} ${Math.round(p.y - 60)} 120 120`);
