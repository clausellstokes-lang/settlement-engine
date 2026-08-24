import { buildFabric } from '../../src/domain/townMap/fabric/buildFabric.js';
import { buildTownMapModel } from '../../src/domain/townMap/townMapModel.js';
import { makeWalledFixture } from '../../tests/fixtures/townMapFixtures.js';
import { circuitDrawnRuns } from '../../src/domain/townMap/fabric/wallCircuit.js';
import { onImpassable, segmentCrossings } from '../../src/domain/townMap/fabric/cliffs.js';

for (const [terrain, seed] of [['hills','sw-a'],['hills','sw-b'],['mountain','sw-a'],['mountain','sw-b'],['mountain','sw-c']]) {
  const s = makeWalledFixture({ _seed: `${seed}-${terrain}`, config: { terrainType: terrain, tradeRouteAccess: 'moderate' } });
  const f = buildFabric(s, buildTownMapModel(s, null), { cliffTermination: true });
  const c = f.cliffs;
  console.log(`\n=== ${terrain}/${seed} : ${c.edges.length} edges, ${c.impassableCells} impassable cells ===`);
  for (const r of circuitDrawnRuns(f.wallCircuit)) {
    for (let i = 0; i + 1 < r.line.length; i++) {
      const a = r.line[i], b = r.line[i+1];
      const dx=b[0]-a[0], dy=b[1]-a[1], len=Math.sqrt(dx*dx+dy*dy);
      const steps=Math.max(3, Math.ceil(len/c.cell)*2);
      const badT=[];
      for (let k=1;k<steps;k++){ const t=k/steps; if (onImpassable(c, a[0]+dx*t, a[1]+dy*t)) badT.push(t.toFixed(3)); }
      const xs = segmentCrossings(c, a[0],a[1],b[0],b[1]);
      if (!badT.length && !xs.length) continue;
      const ring = r.ring;
      const term = (ring.cliffTermini||[]);
      const nearA = term.filter(t=>Math.hypot(t.x-a[0],t.y-a[1])<0.5).length;
      const nearB = term.filter(t=>Math.hypot(t.x-b[0],t.y-b[1])<0.5).length;
      console.log(`  E${ring.epoch} seg[${i}] (${a[0].toFixed(1)},${a[1].toFixed(1)})->(${b[0].toFixed(1)},${b[1].toFixed(1)}) len=${len.toFixed(1)} | badSamples=${badT.length}/${steps-1} at t=${badT.slice(0,6).join(',')} | crossings=${xs.length} | endpointIsTerminus A:${nearA} B:${nearB} | chordEdges=${JSON.stringify(ring.cliffChordEdges)} polyLen=${ring.polygon.length}`);
    }
  }
}
