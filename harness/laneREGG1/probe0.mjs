import { buildFabric } from './src/domain/townMap/fabric/buildFabric.js';
import { buildTownMapModel } from './src/domain/townMap/townMapModel.js';
import { makeTownFixture, makeWalledFixture } from './tests/fixtures/townMapFixtures.js';
import { buildSubstrate } from './src/domain/townMap/fabric/substrate.js';
import { buildableMask, REFUSAL } from './src/domain/townMap/fabric/groundRefusal.js';

const build = (s) => buildFabric(s, buildTownMapModel(s, null), {});
for (const [name, terrain] of [['plains','plains'],['riverside','riverside'],['hills','hills'],['mountain','mountain']]) {
  const s = makeWalledFixture({ _seed: `probe-${name}`, config: { terrainType: terrain, tradeRouteAccess: 'moderate' } });
  const t0 = Date.now();
  const f = build(s);
  const sub = buildSubstrate(s, terrain, { seed: s._seed }, {});
  const m = buildableMask(sub);
  console.log(`${name.padEnd(10)} fam=${String(sub.family).padEnd(10)} crag=${String(m.cragCells).padStart(5)} wet=${String(m.wetCells).padStart(5)} gmax=${m.grade.max.toFixed(4)} p90=${m.grade.p90.toFixed(4)} walls=${(f.walls||[]).length} ms=${Date.now()-t0}`);
}
