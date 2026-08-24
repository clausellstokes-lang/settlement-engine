/** probeWall.mjs — measure the SEALED wall geometry: turns, runs, towers, gates, ops.
 *  No repo bytes; read-only over buildOne. */
import { CORPUS, buildOne } from '../exemplars.mjs';
import { circuitDrawnRuns } from '../../src/domain/townMap/fabric/wallCircuit.js';

const deg = (a, b, c) => {
  const a1 = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const a2 = Math.atan2(c[1] - b[1], c[0] - b[0]);
  let d = a2 - a1;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return Math.abs(d) * 180 / Math.PI;
};
const q = (arr, p) => { if (!arr.length) return 0; const s = arr.slice().sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };

const allTurns = [];
const rows = [];
for (const spec of CORPUS) {
  const { fabric } = buildOne(spec, {});
  if (!fabric.walls.length) { rows.push({ leaf: spec.key, tier: fabric.meta.tier, rings: 0 }); continue; }
  const drawn = circuitDrawnRuns(fabric.wallCircuit);
  let towers = 0, gates = 0, runs = 0, verts = 0, drawnPieces = 0, ditch = 0, wg = 0, termini = 0;
  const turns = [];
  for (const ring of fabric.walls) {
    towers += ring.towers.length; gates += ring.gates.length; runs += (ring.runs || []).length;
    verts += ring.polygon.length; wg += (ring.waterGates || []).length;
    termini += (ring.cliffTermini || []).length;
    drawnPieces += drawn.filter((r) => r.ring === ring).length;
    if (ring.ditch) ditch += 1;
    const P = ring.polygon, n = P.length;
    for (let i = 0; i < n; i++) turns.push(deg(P[(i - 1 + n) % n], P[i], P[(i + 1) % n]));
  }
  allTurns.push(...turns);
  rows.push({
    leaf: spec.key, tier: fabric.meta.tier, rings: fabric.walls.length, verts, runs,
    drawnPieces, towers, gates, wg, termini, ditchRings: ditch,
    form: fabric.walls[0].form, band: Math.round(fabric.walls[0].band * 100) / 100,
    stone: Math.round((fabric.walls[0].bandParts.stone) * 100) / 100,
    halfRing: fabric.walls[0].halfRing,
    t50: Math.round(q(turns, 0.50) * 10) / 10, t75: Math.round(q(turns, 0.75) * 10) / 10,
    t90: Math.round(q(turns, 0.90) * 10) / 10, tmax: Math.round(Math.max(...turns) * 10) / 10,
    perim: Math.round(fabric.walls[0].polygon.reduce((s, p, i, a) => s + (i ? Math.hypot(p[0] - a[i - 1][0], p[1] - a[i - 1][1]) : 0), 0)),
  });
}
console.log(JSON.stringify(rows, null, 1));
console.log('CORPUS TURN QUANTILES over ' + allTurns.length + ' ring vertices: p25=' + q(allTurns, .25).toFixed(1)
  + ' p50=' + q(allTurns, .50).toFixed(1) + ' p75=' + q(allTurns, .75).toFixed(1)
  + ' p90=' + q(allTurns, .90).toFixed(1) + ' p95=' + q(allTurns, .95).toFixed(1) + ' max=' + Math.max(...allTurns).toFixed(1));
