/**
 * cliffSweep.mjs — the TE-REG-G1 instrument set. Run:
 *   node cliffSweep.mjs <treeRoot> [<baseRoot>]
 *
 * ⚠ THE WALL-OVER-CLIFF OPS METRIC IS COMPUTED AGAINST **ONE** ESCARPMENT SET for both flag
 * states — the armed build's `fabric.cliffs` — because the escarpment is a property of the
 * GROUND and both builds stand on the same substrate. An instrument that derived a different
 * cliff set per arm would be measuring two subjects.
 */
import { join } from 'node:path';
const ROOT = process.argv[2];
const { buildFabric } = await import(join(ROOT, 'src/domain/townMap/fabric/buildFabric.js'));
const { buildTownMapModel } = await import(join(ROOT, 'src/domain/townMap/townMapModel.js'));
const { makeWalledFixture } = await import(join(ROOT, 'tests/fixtures/townMapFixtures.js'));
const { cliffCrossing, segmentCrossings, onImpassable, segmentTouchesImpassable } = await import(join(ROOT, 'src/domain/townMap/fabric/cliffs.js'));
const { circuitDrawnRuns } = await import(join(ROOT, 'src/domain/townMap/fabric/wallCircuit.js'));

const TERRAINS = ['plains', 'riverside', 'forest', 'desert', 'coastal', 'hills', 'mountain'];
const SEEDS = ['sw-a', 'sw-b', 'sw-c', 'sw-d', 'sw-e'];

/** WALL-OVER-CLIFF OPS: drawn circuit segments that cross an escarpment, or stand on impassable
 *  relief. Both clauses matter: a segment can straddle a cliff without a vertex on it. */
export function wallOverCliffOps(fabric, cliffs) {
  if (!cliffs || !cliffs.edges.length) return { ops: 0, crossing: 0, standing: 0, segs: 0 };
  let standing = 0, segs = 0;
  // ⭐ THE SUBJECT IS THE **DRAWN** CURTAIN — `circuitDrawnRuns`, the accessor the lens strokes —
  // not the closed polygon: an "op" is a drawing operation (§217 op ceilings), and the ring's
  // chord across a surrendered scarp is geometry the ink never emits.
  // ⭐⭐ AND THE TEST IS `segmentTouchesImpassable`: EXACT cell traversal, the SAME writer the
  // §577 cut itself uses. Sampling could not close (257 -> 209 -> 12 -> 6 -> 5, every survivor a
  // sub-cell phase artifact or an endpoint touch at t = 1e-12), and the honest cure is to ask the
  // exactly-answerable question rather than to fit a tolerance. ⚠ The OFF arm must still convict,
  // or the metric is vacuous — that pairing is what makes this a correction, not a fit.
  for (const r of circuitDrawnRuns(fabric.wallCircuit)) {
    const line = r.line;
    for (let i = 0; i + 1 < line.length; i++) {
      const a = line[i], b = line[i + 1];
      segs++;
      if (segmentTouchesImpassable(cliffs, a[0], a[1], b[0], b[1])) standing++;
    }
  }
  return { ops: standing, crossing: 0, standing, segs };
}

const rows = [];
for (const terrain of TERRAINS) {
  for (const seed of SEEDS) {
    const s = makeWalledFixture({ _seed: `${seed}-${terrain}`, config: { terrainType: terrain, tradeRouteAccess: 'moderate' } });
    const model = buildTownMapModel(s, null);
    const off = buildFabric(s, model, {});
    const on = buildFabric(s, model, { cliffTermination: true });
    const c = on.cliffs;
    const oOff = wallOverCliffOps(off, c);
    const oOn = wallOverCliffOps(on, c);
    rows.push({
      terrain, seed, family: on.meta.terrainFamily || '',
      edges: c.edges.length, brink: c.counts.brink, foot: c.counts.foot,
      regions: c.regions.length, cragCells: c.cragCells,
      opsOff: oOff.ops, opsOn: oOn.ops,
      xOff: oOff.crossing, sOff: oOff.standing, xOn: oOn.crossing, sOn: oOn.standing,
      segsOff: oOff.segs, segsOn: oOn.segs,
      segments: (on.walls || []).reduce((a, r) => a + (r.cliffSegments || 0), 0),
      termini: (on.walls || []).reduce((a, r) => a + (r.cliffTermini || []).length, 0),
      dropped: (on.walls || []).reduce((a, r) => a + (r.cliffDropped || 0), 0),
      fallbacks: (on.walls || []).reduce((a, r) => a + (r.cliffFallbacks || 0), 0),
    });
  }
}
console.log(JSON.stringify(rows));
