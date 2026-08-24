/**
 * probeOverGround.mjs — ⭐⭐⭐ REG-2 EXIT LEG 2: **WALL-OVER-WATER AND WALL-OVER-CLIFF OPS = 0.**
 *
 * ⭐ IT MEASURES THE **DRAWN** MARK, NOT THE RING. The band is a ribbon `bandHalfOfRun[j]` wide, so
 * a curtain whose CENTRELINE clears the bank by a hair can still put its outer edge in the water —
 * exactly the shape `terminateAtCliffs`' own header records ("a predicate sampled at vertices
 * measures the vertices, not the line"), one dimension further out. Every band piece is walked at
 * the substrate's cell pitch across BOTH faces; every joint and gatehouse is sampled over its own
 * footprint. A mark with ANY sample on refused ground is one op, counted whole.
 *
 * ⚠ THE BASE IS MEASURED BY THE SAME CODE, so the figure that matters is the DELTA: a wall that
 * was already over water before this wave is not this wave's op, and hiding that would be the
 * §441 J7 class (a claim whose baseline was never taken).
 */
import { CORPUS, buildOne } from '../exemplars.mjs';
import { circuitDrawnRuns } from '../../src/domain/townMap/fabric/wallCircuit.js';
import { isInWater } from '../../src/domain/townMap/fabric/waterMode.js';
import { deriveCliffs, onImpassable } from '../../src/domain/townMap/fabric/cliffs.js';

const offsetOpen = (line, dOut, cx, cy) => {
  const n = line.length; const o = [];
  for (let i = 0; i < n; i++) {
    const a = line[Math.max(0, i - 1)], b = line[i], c = line[Math.min(n - 1, i + 1)];
    let nx = 0, ny = 0;
    for (const [p, q] of [[a, b], [b, c]]) {
      const ex = q[0] - p[0], ey = q[1] - p[1]; const L = Math.hypot(ex, ey);
      if (L < 1e-9) continue;
      nx += -ey / L; ny += ex / L;
    }
    let L = Math.hypot(nx, ny);
    if (L < 1e-9) { nx = 1; ny = 0; L = 1; }
    nx /= L; ny /= L;
    if ((b[0] - cx) * nx + (b[1] - cy) * ny < 0) { nx = -nx; ny = -ny; }
    o.push([b[0] + nx * dOut, b[1] + ny * dOut]);
  }
  return o;
};
/** Walk a polyline at `pitch` and call back at every sample. */
const walk = (line, pitch, f) => {
  for (let i = 0; i + 1 < line.length; i++) {
    const [x0, y0] = line[i], [x1, y1] = line[i + 1];
    const L = Math.hypot(x1 - x0, y1 - y0);
    const steps = Math.max(1, Math.ceil(L / pitch));
    for (let k = 0; k <= steps; k++) f(x0 + (x1 - x0) * (k / steps), y0 + (y1 - y0) * (k / steps));
  }
};

const OPTS = { rampart: true, cliffTermination: true };
const rows = [];
for (const spec of CORPUS) {
  for (const [tag, opts] of [['BASE', { cliffTermination: true }], ['ARMED', OPTS]]) {
    const { fabric } = buildOne(spec, opts);
    if (!fabric.walls.length) continue;
    const cliffs = deriveCliffs(fabric.sub || fabric.substrate || null);
    const pitch = cliffs && cliffs.cell ? cliffs.cell * 0.5 : 2;
    const drawn = circuitDrawnRuns(fabric.wallCircuit);
    let overW = 0, overC = 0, marks = 0, samples = 0;
    const convicted = [];
    const wgs = fabric.walls.flatMap((r) => (r.waterGates || []).map((g) => ({ x: g.x, y: g.y, span: g.span })));
    // ⭐ THE ONE LAWFUL CROSSING, AND IT IS THE RULE'S OWN ACT RATHER THAN A TOLERANCE. §161m.3:
    // *where the circuit crosses the channel the wall does not stop — it closes with a marked
    // work.* A mark inside a water gate's own span is that work, or the curtain it closes.
    const licensed = (x, y) => wgs.some((g) => Math.hypot(x - g.x, y - g.y) <= g.span * 0.75);
    for (const ring of fabric.walls) {
      let cx = 0, cy = 0;
      for (const p of ring.polygon) { cx += p[0]; cy += p[1]; }
      cx /= ring.polygon.length; cy /= ring.polygon.length;
      const R = ring.rampart;
      const pieces = drawn.filter((r) => r.ring === ring);
      for (const pc of pieces) {
        // the drawn mark's own extent: the band's two faces when armed, the centreline when not
        const lines = [];
        if (R) {
          const mid = pc.line[Math.floor(pc.line.length / 2)];
          let bi = 0, bd = Infinity;
          for (let i = 0; i < ring.polygon.length; i++) {
            const d = (ring.polygon[i][0] - mid[0]) ** 2 + (ring.polygon[i][1] - mid[1]) ** 2;
            if (d < bd) { bd = d; bi = i; }
          }
          const h = R.bandHalfOfRun[ring.runOfVertex[bi]] || 0.5;
          lines.push(offsetOpen(pc.line, h, cx, cy), offsetOpen(pc.line, -h, cx, cy));
        } else lines.push(pc.line);
        let nw = 0, nc = 0, n = 0, lic = 0;
        for (const L of lines) walk(L, pitch, (x, y) => {
          samples++; n++;
          const iw = isInWater(fabric.water, x, y);
          if (iw && licensed(x, y)) { lic++; return; }
          if (iw) nw++;
          if (cliffs && onImpassable(cliffs, x, y)) nc++;
        });
        marks++;
        if (nw) { overW++; convicted.push({ cls: 'band', what: 'water', share: +(nw / n).toFixed(3), n, lic }); }
        if (nc) { overC++; convicted.push({ cls: 'band', what: 'cliff', share: +(nc / n).toFixed(3), n }); }
      }
      // the joint works and the gatehouses, sampled over their own footprints
      for (const j of (R ? R.joints : (ring.towers || []).map((t, i) => ({ x: t[0], y: t[1], r: 1.05 })))) {
        let nw = 0, nc = 0, n = 0;
        for (let a = 0; a < 8; a++) {
          const ang = (a / 8) * Math.PI * 2;
          for (const f of [0, 0.6, 1]) {
            const x = j.x + Math.cos(ang) * (j.r || 1) * f, y = j.y + Math.sin(ang) * (j.r || 1) * f;
            samples++; n++;
            const iw = isInWater(fabric.water, x, y);
            if (iw && licensed(x, y)) continue;
            if (iw) nw++;
            if (cliffs && onImpassable(cliffs, x, y)) nc++;
          }
        }
        marks++;
        if (nw) { overW++; convicted.push({ cls: 'joint', what: 'water', share: +(nw / n).toFixed(3), n, kind: j.kind || 'tower', cl: j.cls }); }
        if (nc) { overC++; convicted.push({ cls: 'joint', what: 'cliff', share: +(nc / n).toFixed(3), n, kind: j.kind || 'tower', cl: j.cls }); }
      }
      for (const g of (R ? R.gatehouses : [])) {
        let nw = 0, nc = 0, n = 0;
        for (let a = 0; a < 8; a++) {
          const ang = (a / 8) * Math.PI * 2;
          const x = g.x + Math.cos(ang) * g.half, y = g.y + Math.sin(ang) * g.half;
          samples++; n++;
          const iw = isInWater(fabric.water, x, y);
          if (iw && licensed(x, y)) continue;
          if (iw) nw++;
          if (cliffs && onImpassable(cliffs, x, y)) nc++;
        }
        marks++;
        if (nw) { overW++; convicted.push({ cls: 'gatehouse', what: 'water', share: +(nw / n).toFixed(3), n }); }
        if (nc) { overC++; convicted.push({ cls: 'gatehouse', what: 'cliff', share: +(nc / n).toFixed(3), n }); }
      }
    }
    rows.push({ leaf: spec.key, arm: tag, marks, samples, overWater: overW, overCliff: overC,
      cliffEdges: cliffs ? cliffs.edges.length : 0, convicted });
  }
}
const h = ['leaf', 'arm', 'marks', 'samples', 'overWater', 'overCliff', 'cliffEdges'];
console.log(h.join('\t'));
for (const r of rows) console.log(h.map((k) => r[k]).join('\t'));
const sum = (arm, k) => rows.filter((r) => r.arm === arm).reduce((n, r) => n + r[k], 0);
console.log(`\nBASE  : over-water ${sum('BASE', 'overWater')} · over-cliff ${sum('BASE', 'overCliff')} over ${sum('BASE', 'marks')} marks`);
console.log(`ARMED : over-water ${sum('ARMED', 'overWater')} · over-cliff ${sum('ARMED', 'overCliff')} over ${sum('ARMED', 'marks')} marks`);
console.log('\nEVERY CONVICTED MARK, with the SHARE of its own samples on refused ground:');
for (const r of rows) for (const c of r.convicted) console.log(`  ${r.leaf.padEnd(12)} ${r.arm.padEnd(6)} ${c.what} ${c.cls}${c.kind ? '/' + c.kind + '(cls' + c.cl + ')' : ''} share=${c.share} of ${c.n} samples`);
