import { buildSubstrate, measuredRelief, reliefField } from '../../src/domain/townMap/fabric/substrate.js';
import { buildableMask } from '../../src/domain/townMap/fabric/groundRefusal.js';
import { makeWalledFixture } from '../../tests/fixtures/townMapFixtures.js';
const cases = [
  ['fjord', 'mountain', 'port'], ['mountain','mountain','moderate'], ['hills','hills','moderate'],
  ['coastal','coastal','moderate'], ['plains','plains','moderate'],
];
for (const [k, terrain, access] of cases) {
  const s = makeWalledFixture({ _seed: `cliff-${k}`, config: { terrainType: terrain, tradeRouteAccess: access } });
  const sub = buildSubstrate(s, terrain, { seed: s._seed }, {});
  const rf = reliefField(sub);
  const m = buildableMask(sub);
  console.log(`${k.padEnd(10)} fam=${sub.family.padEnd(9)} shape.relief=${sub.shape.relief.toFixed(2)} ramp=${(sub.shape.ramp||0).toFixed(2)} ridged=${(sub.shape.ridged||0).toFixed(2)} | spread=${rf.spread.toFixed(3)} localMax=${rf.localMax.toFixed(5)} gradeP90=${m.grade.p90.toFixed(4)} gradeMax=${m.grade.max.toFixed(4)} crag=${m.cragCells}`);
}
