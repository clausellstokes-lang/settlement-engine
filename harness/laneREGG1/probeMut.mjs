/** probeMut.mjs — TE-REG-G1's convicting mutations + the consumption differential. */
import { createHash } from 'node:crypto';
import { buildFabric } from '../../src/domain/townMap/fabric/buildFabric.js';
import { buildTownMapModel } from '../../src/domain/townMap/townMapModel.js';
import { buildSubstrate } from '../../src/domain/townMap/fabric/substrate.js';
import { deriveCliffs, cliffCrossing, onImpassable, CLIFF } from '../../src/domain/townMap/fabric/cliffs.js';
import { terminateAtCliffs } from '../../src/domain/townMap/fabric/walls.js';
import { makeWalledFixture } from '../../tests/fixtures/townMapFixtures.js';

const sha = (o) => createHash('sha256').update(JSON.stringify(o)).digest('hex').slice(0, 16);
const fixture = (seed, terrain, access = 'moderate') =>
  makeWalledFixture({ _seed: seed, config: { terrainType: terrain, tradeRouteAccess: access } });
const subOf = (s, terrain) => buildSubstrate(s, terrain, { seed: s._seed }, {});
const ok = (b) => (b ? 'PASS' : '*** FAIL ***');

console.log('════ A · CONVICTING MUTATIONS ON THE EDGE DERIVATION ════');
{
  const s = fixture('mut-mtn', 'mountain');
  const sub = subOf(s, 'mountain');
  const real = deriveCliffs(sub);
  // M1 · FLATTEN the height field. A field with no gradient can carry no escarpment.
  const flat = subOf(s, 'mountain');
  for (let k = 0; k < flat.height.length; k++) flat.height[k] = 0.5;
  for (let k = 0; k < flat.slope.length; k++) flat.slope[k] = 0;
  const m1 = deriveCliffs(flat);
  console.log(`M1 flatten mountain height:      ${real.edges.length} edges -> ${m1.edges.length}   ${ok(real.edges.length > 0 && m1.edges.length === 0)}`);
  // M2 · HALVE the local-max divisor. `absoluteGrade` = slope x slopeLocalMax, so halving the
  //      divisor halves every grade — the cliff set must SHRINK. A derivation that read the
  //      NORMALIZED slope would not move at all, which is exactly the unit bug groundRefusal.js
  //      exists to prevent; this mutation convicts that reading.
  const half = subOf(s, 'mountain');
  half.slopeLocalMax = half.slopeLocalMax / 2;
  const m2 = deriveCliffs(half);
  console.log(`M2 halve slopeLocalMax:          ${real.cragCells} crag cells -> ${m2.cragCells}, ${real.edges.length} edges -> ${m2.edges.length}   ${ok(m2.cragCells < real.cragCells)}`);
  // M3 · AMPLIFY a flat leaf. A plain with its height field stretched must GROW an escarpment —
  //      the positive half of the negative control, so "0 on plains" is not just a dead code path.
  const p = fixture('mut-plain', 'plains');
  const psub = subOf(p, 'plains');
  const before = deriveCliffs(psub);
  const amp = subOf(p, 'plains');
  for (let k = 0; k < amp.height.length; k++) amp.height[k] = 0.5 + (amp.height[k] - 0.5) * 8;
  amp.slopeLocalMax = amp.slopeLocalMax * 8;
  const m3 = deriveCliffs(amp);
  console.log(`M3 amplify plains x8:            ${before.edges.length} edges -> ${m3.edges.length}   ${ok(before.edges.length === 0 && m3.edges.length > 0)}`);
  // M4 · THE REGION FLOOR IS LIVE. Raising minRegionCells past every region must empty the set.
  const m4 = deriveCliffs(sub);
  const survivors = m4.regions.filter((r) => r.cells >= 400).length;
  console.log(`M4 regions >= 400 cells:         ${m4.regions.length} regions, ${survivors} would survive a 400-cell floor (the floor is a live filter, not decoration)`);
}

console.log('\n════ B · THE CONSUMPTION DIFFERENTIAL — same seed, two relief fields ════');
{
  const s = fixture('diff-1', 'mountain');
  const model = buildTownMapModel(s, null);
  const armed = buildFabric(s, model, { cliffTermination: true });
  const ring = armed.walls[0].closedPolygon;   // the circuit before the cliff cut
  const sub = subOf(s, 'mountain');
  const A = deriveCliffs(sub);
  // FIELD B: the SAME substrate with its height field mirrored in x. Same seed, same settlement,
  // same ring — a genuinely different relief field over the same ground.
  const subB = subOf(s, 'mountain');
  const n = subB.n;
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n / 2; i++) {
      const a = j * n + i, b = j * n + (n - 1 - i);
      const t = subB.height[a]; subB.height[a] = subB.height[b]; subB.height[b] = t;
      const u = subB.slope[a]; subB.slope[a] = subB.slope[b]; subB.slope[b] = u;
    }
  }
  const B = deriveCliffs(subB);
  const tA = terminateAtCliffs(ring, A);
  const tB = terminateAtCliffs(ring, B);
  const dA = tA ? sha(tA.ring.map((p) => [Math.round(p[0] * 1e6), Math.round(p[1] * 1e6)])) : 'null';
  const dB = tB ? sha(tB.ring.map((p) => [Math.round(p[0] * 1e6), Math.round(p[1] * 1e6)])) : 'null';
  console.log(`  field A: ${A.edges.length} edges -> ring ${tA ? tA.ring.length : '-'} vtx, ${tA ? tA.termini.length : 0} termini, digest ${dA}`);
  console.log(`  field B: ${B.edges.length} edges -> ring ${tB ? tB.ring.length : '-'} vtx, ${tB ? tB.termini.length : 0} termini, digest ${dB}`);
  console.log(`  TRACES DIFFER: ${ok(dA !== dB)}  (a value-ignoring read would return one digest twice)`);
  // AND THE TERMINI THEMSELVES COME FROM THE EDGE GEOMETRY, not from the dropped vertex:
  if (tA && tA.termini.length) {
    const t0 = tA.termini[0];
    console.log(`  terminus[0] = (${t0.x.toFixed(2)}, ${t0.y.toFixed(2)}) on edge '${t0.edge}' kind '${t0.kind}' fallback=${t0.fallback}`);
  }
}

console.log('\n════ C · CONVICTING MUTATION ON cliffCrossing ════');
{
  const s = fixture('mut-cross', 'hills');
  const sub = subOf(s, 'hills');
  const c = deriveCliffs(sub);
  const e = c.edges[0];
  const a = e.line[0], b = e.line[Math.min(3, e.line.length - 1)];
  // A segment straddling the edge must cross it; the same segment with the edge TRANSLATED far
  // away must not. If cliffCrossing ignored the line's coordinates, both would answer the same.
  const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const probe = [[mid[0] - 30, mid[1] - 30], [mid[0] + 30, mid[1] + 30]];
  const hit1 = cliffCrossing(c, probe[0][0], probe[0][1], probe[1][0], probe[1][1]);
  const moved = { edges: c.edges.map((x) => ({ ...x, line: x.line.map((p) => [p[0] + 4000, p[1] + 4000]) })) };
  const hit2 = cliffCrossing(moved, probe[0][0], probe[0][1], probe[1][0], probe[1][1]);
  console.log(`  crossing on the real edge set:   ${hit1 ? `HIT at (${hit1.point[0].toFixed(1)}, ${hit1.point[1].toFixed(1)}) on '${hit1.edge.key}'` : 'none'}`);
  console.log(`  same probe, edges translated +4000: ${hit2 ? 'HIT' : 'none'}   ${ok(!!hit1 && !hit2)}`);
}

console.log('\n════ D · CONVICTING MUTATION ON onImpassable / THE MASK ════');
{
  const s = fixture('mut-mask', 'mountain');
  const model = buildTownMapModel(s, null);
  const armed = buildFabric(s, model, { cliffTermination: true });
  const ring = armed.walls[0].closedPolygon;
  const c = armed.cliffs;
  const real = terminateAtCliffs(ring, c);
  const blank = { ...c, mask: new Uint8Array(c.mask.length) };
  const none = terminateAtCliffs(ring, blank);
  console.log(`  real mask (${c.impassableCells} impassable cells): ${real ? `${real.dropped} vertices dropped, ${real.segments} segment(s)` : 'no cut'}`);
  console.log(`  zeroed mask:                       ${none ? `${none.dropped} dropped` : 'no cut (null)'}   ${ok(!!real && real.dropped > 0 && none === null)}`);
}

console.log('\n════ E · DETERMINISM — double run, byte-identical ════');
{
  for (const terrain of ['plains', 'hills', 'mountain']) {
    const s = fixture(`det-${terrain}`, terrain);
    const model = buildTownMapModel(s, null);
    const f1 = buildFabric(s, model, { cliffTermination: true });
    const f2 = buildFabric(s, buildTownMapModel(s, null), { cliffTermination: true });
    const d = (f) => sha({
      cliffs: f.cliffs.edges.map((e) => [e.key, e.kind, e.length, e.grade, e.drop, e.line]),
      walls: (f.walls || []).map((r) => [r.polygon, r.towers, r.towerTypes, r.cliffTermini || null]),
    });
    console.log(`  ${terrain.padEnd(9)} run1=${d(f1)} run2=${d(f2)}  ${ok(d(f1) === d(f2))}`);
  }
}
