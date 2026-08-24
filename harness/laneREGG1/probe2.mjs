import { buildFabric } from './src/domain/townMap/fabric/buildFabric.js';
import { buildTownMapModel } from './src/domain/townMap/townMapModel.js';
import { makeWalledFixture } from './tests/fixtures/townMapFixtures.js';

const build = (s, opts) => buildFabric(s, buildTownMapModel(s, null), opts);
for (const terrain of ['plains','hills','mountain']) {
  const s = makeWalledFixture({ _seed: `cliff-${terrain}`, config: { terrainType: terrain, tradeRouteAccess: 'moderate' } });
  const off = build(s, {});
  const on  = build(s, { cliffTermination: true });
  console.log(`\n=== ${terrain} ===`);
  console.log('  cliffs(off):', off.cliffs === undefined ? 'ABSENT' : 'present');
  console.log('  cliffs(on) :', on.cliffs ? on.cliffs.reason : 'ABSENT');
  for (const [tag, f] of [['off', off], ['on', on]]) {
    for (const r of (f.walls || [])) {
      console.log(`  ${tag} E${r.epoch} poly=${r.polygon.length} towers=${r.towers.length} termini=${(r.cliffTermini||[]).length} segs=${r.cliffSegments||0} dropped=${r.cliffDropped||0} fb=${r.cliffFallbacks||0} runs=${JSON.stringify(r.runCounts)}`);
    }
  }
}
