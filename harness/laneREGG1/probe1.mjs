import { buildSubstrate } from '../../src/domain/townMap/fabric/substrate.js';
import { deriveCliffs } from '../../src/domain/townMap/fabric/cliffs.js';
import { makeWalledFixture } from '../../tests/fixtures/townMapFixtures.js';

const rows = [];
for (const terrain of ['plains','riverside','forest','desert','hills','mountain','coastal']) {
  const s = makeWalledFixture({ _seed: `probe-${terrain}`, config: { terrainType: terrain, tradeRouteAccess: 'moderate' } });
  const sub = buildSubstrate(s, terrain, { seed: s._seed }, {});
  const t0 = Date.now();
  const c = deriveCliffs(sub);
  const ms = Date.now() - t0;
  const lens = c.edges.map((e) => Math.round(e.length));
  rows.push({ terrain, fam: sub.family, cells: c.cragCells, regions: c.regions.length,
    edges: c.edges.length, brink: c.counts.brink, foot: c.counts.foot, coll: c.keyCollisions,
    longest: lens[0] || 0, ms });
  console.log(`${terrain.padEnd(10)} ${c.reason}`);
}
console.log('');
console.table(rows);
