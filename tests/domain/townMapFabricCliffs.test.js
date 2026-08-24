/**
 * tests/domain/townMapFabricCliffs.test.js — TE-REG-G1: §297.2b THE ESCARPMENT BOUNDARY and
 * ODQ §577 THE SEGMENTED CIRCUIT.
 *
 * ⚠⚠ EVERY ARM CARRIES A COUNTERFACTUAL, because every mechanism here can pass vacuously. An
 * edge pin passes if edges are emitted for any reason at all; a termination pin passes if the
 * wall changes for any reason at all; a "flat plain grows no cliff" pin passes on a derivation
 * that never emits anything. So each positive arm is paired with the case that MUST answer the
 * other way, and it is the PAIR that carries the proof.
 *
 * ⭐ THE ONE-WRITER ARM IS THE LOAD-BEARING ONE. This module invents no grade: it consumes
 * `groundRefusal.REFUSAL.crag`, and arm 3 asserts the cell sets agree exactly. A second
 * threshold here would be the defect the §297.2b hold was written to prevent.
 */
import { describe, it, expect } from 'vitest';
import { buildFabric } from '../../src/domain/townMap/fabric/buildFabric.js';
import { buildTownMapModel } from '../../src/domain/townMap/townMapModel.js';
import { buildSubstrate, sampleAt } from '../../src/domain/townMap/fabric/substrate.js';
import { buildableMask, REFUSAL } from '../../src/domain/townMap/fabric/groundRefusal.js';
import {
  deriveCliffs, cliffCrossing, onImpassable, segmentTouchesImpassable, CLIFF, CLIFF_KINDS,
} from '../../src/domain/townMap/fabric/cliffs.js';
import { terminateAtCliffs } from '../../src/domain/townMap/fabric/walls.js';
import { circuitDrawnRuns } from '../../src/domain/townMap/fabric/wallCircuit.js';
import { buildBoundaryArrangement, BOUNDARY_ROLES } from '../../src/domain/townMap/fabric/fabricDcel.js';
import { GENERATION_NODES } from '../../src/domain/townMap/fabric/stageManifest.js';
import { makeWalledFixture } from '../fixtures/townMapFixtures.js';

const fixture = (seed, terrain, access = 'moderate') =>
  makeWalledFixture({ _seed: seed, config: { terrainType: terrain, tradeRouteAccess: access } });
const subOf = (s, terrain) => buildSubstrate(s, terrain, { seed: s._seed }, {});
const build = (s, armed) => buildFabric(s, buildTownMapModel(s, null), armed ? { cliffTermination: true } : {});

/** THE INSTRUMENT: drawn wall segments standing on impassable relief. ⚠ The subject is
 *  `circuitDrawnRuns` — the ink the lens strokes — not the closed polygon, because the chord
 *  across surrendered ground is geometry no wall is drawn on. */
function wallOverCliffOps(fabric, cliffs) {
  let ops = 0;
  for (const r of circuitDrawnRuns(fabric.wallCircuit)) {
    for (let i = 0; i + 1 < r.line.length; i++) {
      const a = r.line[i], b = r.line[i + 1];
      if (segmentTouchesImpassable(cliffs, a[0], a[1], b[0], b[1])) ops++;
    }
  }
  return ops;
}

/** A deterministic digest of geometry, for the byte-identity arms. */
function digest(v) {
  const round = (x) => Math.round(x * 1e6);
  const walk = (x) => (Array.isArray(x) ? `[${x.map(walk).join(',')}]`
    : typeof x === 'number' ? String(round(x))
      : x && typeof x === 'object' ? `{${Object.keys(x).sort().map((k) => `${k}:${walk(x[k])}`).join(',')}}`
        : String(x));
  return walk(v);
}

describe('§297.2b · the escarpment boundary — the artifact the CLIFF hold named as missing', () => {
  it('1 · a cliff-bearing terrain publishes escarpment edges; a flat plain publishes EXACTLY ZERO', () => {
    const mountain = deriveCliffs(subOf(fixture('cliff-mtn', 'mountain'), 'mountain'));
    const plains = deriveCliffs(subOf(fixture('cliff-plain', 'plains'), 'plains'));
    expect(mountain.edges.length).toBeGreaterThan(20);
    // ⛔ THE NEGATIVE CONTROL, AND IT IS EXACT RATHER THAN A BAND. A flat world must not grow a
    // phantom cliff, and "few" would not be an answer: `REFUSAL.crag` is the grade at which the
    // flat families refuse NOTHING, so zero is the only honest number.
    expect(plains.edges).toHaveLength(0);
    expect(plains.cragCells).toBe(0);
    expect(plains.reason).toMatch(/NO ESCARPMENT/);
  });

  it('2 · PLANTED CONTROLS, BOTH DIRECTIONS — a flattened mountain loses every edge; an amplified plain grows them', () => {
    const s = fixture('cliff-mtn', 'mountain');
    const real = deriveCliffs(subOf(s, 'mountain'));
    const flat = subOf(s, 'mountain');
    for (let k = 0; k < flat.height.length; k++) flat.height[k] = 0.5;
    for (let k = 0; k < flat.slope.length; k++) flat.slope[k] = 0;
    expect(real.edges.length).toBeGreaterThan(0);
    expect(deriveCliffs(flat).edges).toHaveLength(0);
    // ⭐ AND THE POSITIVE HALF, which is what stops arm 1's zero from being a dead code path: a
    // plain whose ground is stretched MUST grow an escarpment. Without this, a derivation that
    // never emitted anything would pass every negative arm in this file.
    const p = fixture('cliff-plain', 'plains');
    const amp = subOf(p, 'plains');
    for (let k = 0; k < amp.height.length; k++) amp.height[k] = 0.5 + (amp.height[k] - 0.5) * 8;
    amp.slopeLocalMax *= 8;
    expect(deriveCliffs(amp).edges.length).toBeGreaterThan(0);
  });

  it('3 · ONE WRITER — the escarpment mints no grade; its cells ARE groundRefusal\'s crag cells', () => {
    for (const terrain of ['plains', 'hills', 'mountain']) {
      const sub = subOf(fixture(`one-writer-${terrain}`, terrain), terrain);
      expect(deriveCliffs(sub).cragCells).toBe(buildableMask(sub).cragCells);
    }
    // ⚠ AND THE THRESHOLD IS THE IMPORTED ONE, asserted by value so a lane that re-spelled it
    // locally would red here rather than drift silently.
    expect(REFUSAL.crag).toBe(0.030);
  });

  it('4 · BRINK AND FOOT ARE FACTS, NOT LABELS — a brink\'s gentle side really is the higher ground', () => {
    const sub = subOf(fixture('cliff-mtn', 'mountain'), 'mountain');
    const c = deriveCliffs(sub);
    expect(c.counts.brink).toBeGreaterThan(0);
    expect(c.counts.foot).toBeGreaterThan(0);
    for (const e of c.edges) expect(CLIFF_KINDS).toContain(e.kind);
    // Re-measure the classification from the OTHER end: probe either side of the boundary and
    // check that the gentler side of a `brink` stands higher than the steeper one. A label the
    // geometry does not support is exactly what this arm exists to refuse.
    //
    // ⚠⚠ THE CLAIM IS **DOMINANCE, NOT PURITY**, AND MEASUREMENT IS WHY. My first spelling
    // asserted every sampled vertex agreed and MEASURED 17 of 24. The cause is not a
    // misclassification: `deriveCliffs` classifies per vertex and then ABSORBS SLIVERS — an arc
    // shorter than `CLIFF.minEdgeCells` joins its longer neighbour rather than being dropped,
    // because a gap in an impassable boundary is a gate the ground never cut. So a published edge
    // deliberately carries a minority of opposite-kind vertices. MEASURED (`probeKind.mjs`):
    // **84.0% of vertices agree on hills and 81.7% on mountain**, with the per-edge majority
    // holding on 47/49 and 96/99 edges. ⭐ THE CLASS: **A LABEL PRODUCED BY COALESCING IS A
    // STATEMENT ABOUT THE RUN, AND A PIN THAT ASSERTS IT OF EVERY MEMBER IS PINNING A PROPERTY
    // THE DERIVATION NEVER CLAIMED.** The floor below is stated as "decisively above chance", not
    // fitted to the reading.
    const R = CLIFF.probeCells * sub.cell;
    const agreementOf = (edges) => {
      let n = 0, agreed = 0;
      for (const e of edges) {
        for (let i = 1; i + 1 < e.line.length; i++) {
          const a = e.line[i - 1], b = e.line[i + 1], p = e.line[i];
          let nx = -(b[1] - a[1]), ny = b[0] - a[0];
          const l = Math.sqrt(nx * nx + ny * ny) || 1;
          nx /= l; ny /= l;
          const g1 = sampleAt(sub, sub.slope, p[0] + nx * R, p[1] + ny * R);
          const g2 = sampleAt(sub, sub.slope, p[0] - nx * R, p[1] - ny * R);
          const up = g1 < g2;
          const hG = sampleAt(sub, sub.height, up ? p[0] + nx * R : p[0] - nx * R, up ? p[1] + ny * R : p[1] - ny * R);
          const hC = sampleAt(sub, sub.height, up ? p[0] - nx * R : p[0] + nx * R, up ? p[1] - ny * R : p[1] + ny * R);
          n++;
          if ((hG > hC ? 'brink' : 'foot') === e.kind) agreed++;
        }
      }
      return { n, share: n ? agreed / n : 0 };
    };
    const real = agreementOf(c.edges);
    expect(real.n).toBeGreaterThan(500);
    expect(real.share).toBeGreaterThan(0.70);
    // ⛔ THE VACUITY GUARD, and without it the 0.70 floor proves nothing: FLIP every label and
    // the same statistic must collapse below its own complement. A test that cannot fail on
    // deliberately wrong labels is measuring the probe, not the classification.
    const flipped = agreementOf(c.edges.map((e) => ({ ...e, kind: e.kind === 'brink' ? 'foot' : 'brink' })));
    expect(flipped.share).toBeLessThan(0.30);
  });

  it('5 · a boulder field is not an escarpment — the region floor is a LIVE filter', () => {
    const sub = subOf(fixture('cliff-hills', 'hills'), 'hills');
    const c = deriveCliffs(sub);
    for (const r of c.regions) expect(r.cells).toBeGreaterThanOrEqual(CLIFF.minRegionCells);
    // The mask is the FILTERED set, so it must be a strict subset of the raw crag cells wherever
    // any region was rejected — the property `onImpassable` depends on for agreeing with `edges`.
    expect(c.impassableCells).toBeLessThanOrEqual(c.cragCells);
  });
});

describe('ODQ §577 · the segmented circuit — the wall stops at the cliff and resumes beyond it', () => {
  it('6 · DORMANCY — unarmed, the circuit is byte-identical and the fabric carries no cliff key', () => {
    for (const terrain of ['plains', 'hills', 'mountain']) {
      const s = fixture(`dormant-${terrain}`, terrain);
      const off = build(s, false);
      const off2 = build(s, false);
      expect(off.cliffs).toBeUndefined();
      expect(digest(off.walls.map((r) => r.polygon))).toBe(digest(off2.walls.map((r) => r.polygon)));
      for (const r of off.walls) {
        // ⛔ AN ABSENT FEATURE THAT STILL PUBLISHES ITS ZERO IS NOT DORMANT — `[]` and `0` are
        // values, and a published value is a byte. This arm is the one that caught it: the first
        // spelling emitted four unconditional keys and moved the flag-off fabric digest on all
        // six proof fixtures, including a plains leaf with no crag cell anywhere.
        expect(r.cliffTermini).toBeUndefined();
        expect(r.cliffSegments).toBeUndefined();
        expect(r.cliffChordEdges).toBeUndefined();
      }
    }
  });

  it('7 · ARMED — a cliff leaf terminates and an armed FLAT leaf does not (the counterfactual pair)', () => {
    const mtn = fixture('armed-mountain', 'mountain');
    const armed = build(mtn, true);
    const bare = build(mtn, false);
    const terminated = armed.walls.filter((r) => (r.cliffTermini || []).length);
    expect(terminated.length).toBeGreaterThan(0);
    expect(digest(armed.walls.map((r) => r.polygon))).not.toBe(digest(bare.walls.map((r) => r.polygon)));
    for (const r of terminated) {
      expect(r.cliffSegments).toBeGreaterThan(0);
      expect(r.cliffChordEdges.length).toBe(r.cliffSegments);
      // Every terminus names an escarpment and says which half of the artifact placed it.
      for (const t of r.cliffTermini) expect(['edge', 'mask']).toContain(t.via);
    }
    // ⛔ THE COUNTERFACTUAL: armed on a plain, NOTHING moves. Without this arm, arm 7 passes on a
    // consumer that segments every circuit it is handed.
    const plain = fixture('armed-plains', 'plains');
    const pOn = build(plain, true), pOff = build(plain, false);
    expect(pOn.cliffs.edges).toHaveLength(0);
    expect(digest(pOn.walls.map((r) => r.polygon))).toBe(digest(pOff.walls.map((r) => r.polygon)));
    for (const r of pOn.walls) expect(r.cliffTermini).toBeUndefined();
  });

  it('8 · WALL-OVER-CLIFF OPS fall to ZERO, and the instrument CONVICTS the unarmed path', () => {
    for (const terrain of ['hills', 'mountain']) {
      const s = fixture(`ops-${terrain}`, terrain);
      const on = build(s, true);
      const off = build(s, false);
      const c = on.cliffs;                       // one escarpment set, one subject, both arms
      expect(c.edges.length).toBeGreaterThan(0);
      // ⚠ THE VACUITY GUARD IS THE FIRST ASSERTION, not the second: a metric that reads 0 on
      // BOTH arms measures nothing. The unarmed circuit must be convicted before the armed
      // circuit's acquittal means anything.
      expect(wallOverCliffOps(off, c)).toBeGreaterThan(0);
      expect(wallOverCliffOps(on, c)).toBe(0);
    }
  });

  it('9 · THE CONSUMPTION DIFFERENTIAL — same seed, two relief fields, two different traces', () => {
    const s = fixture('diff-mountain', 'mountain');
    const armed = build(s, true);
    const ring = armed.walls[0].closedPolygon;
    const A = deriveCliffs(subOf(s, 'mountain'));
    // FIELD B: the same substrate with its height field mirrored in x — same seed, same
    // settlement, same circuit, a genuinely different relief field over the same ground.
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
    expect(tA).toBeTruthy();
    expect(tB).toBeTruthy();
    // ⭐ A VALUE-IGNORING READ CANNOT PASS THIS. A consumer that merely checked "are there
    // cliffs?" would return one ring twice.
    expect(digest(tA.ring)).not.toBe(digest(tB.ring));
  });

  it('10 · CONVICTING MUTATION on the mask — zero it and the circuit stops terminating', () => {
    const s = fixture('mut-mountain', 'mountain');
    const armed = build(s, true);
    const ring = armed.walls[0].closedPolygon;
    const real = terminateAtCliffs(ring, armed.cliffs);
    expect(real).toBeTruthy();
    expect(real.segments).toBeGreaterThan(0);
    expect(terminateAtCliffs(ring, { ...armed.cliffs, mask: new Uint8Array(armed.cliffs.mask.length) })).toBeNull();
  });

  it('11 · CONVICTING MUTATION on the edge set — translate it and no crossing is found', () => {
    const c = deriveCliffs(subOf(fixture('mut-hills', 'hills'), 'hills'));
    const e = c.edges[0];
    const a = e.line[0], b = e.line[Math.min(3, e.line.length - 1)];
    const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const p = [[mid[0] - 30, mid[1] - 30], [mid[0] + 30, mid[1] + 30]];
    expect(cliffCrossing(c, p[0][0], p[0][1], p[1][0], p[1][1])).toBeTruthy();
    const moved = { edges: c.edges.map((x) => ({ ...x, line: x.line.map((q) => [q[0] + 4000, q[1] + 4000]) })) };
    expect(cliffCrossing(moved, p[0][0], p[0][1], p[1][0], p[1][1])).toBeNull();
  });

  it('12 · DETERMINISM — a double run is byte-identical, armed', () => {
    for (const terrain of ['plains', 'hills', 'mountain']) {
      const s = fixture(`det-${terrain}`, terrain);
      const a = build(s, true), b = build(s, true);
      expect(digest(a.cliffs.edges.map((e) => [e.key, e.kind, e.length, e.grade, e.drop, e.line])))
        .toBe(digest(b.cliffs.edges.map((e) => [e.key, e.kind, e.length, e.grade, e.drop, e.line])));
      expect(digest(a.walls.map((r) => [r.polygon, r.towers, r.towerTypes, r.cliffTermini || null])))
        .toBe(digest(b.walls.map((r) => [r.polygon, r.towers, r.towerTypes, r.cliffTermini || null])));
    }
  });
});

describe('§297.2b · the hold is discharged where it was parked', () => {
  it('13 · the arrangement COUNTS its cliff edges instead of publishing a constant zero', () => {
    const s = fixture('dcel-mountain', 'mountain');
    const armed = build(s, true);
    const bare = build(s, false);
    expect(BOUNDARY_ROLES).toContain('CLIFF_EDGE');
    const withCliffs = buildBoundaryArrangement(armed);
    const without = buildBoundaryArrangement(bare);
    expect(withCliffs.cliffEdges).toBeGreaterThan(0);
    expect(withCliffs.boundaries.some((b) => b.role === 'CLIFF_EDGE')).toBe(true);
    // ⛔ THE COUNTERFACTUAL, and it is what makes the count a count: an unarmed fabric carries no
    // escarpment, so the role stays declared-and-empty exactly as it was before this wave.
    expect(without.cliffEdges).toBe(0);
    expect(without.boundaries.some((b) => b.role === 'CLIFF_EDGE')).toBe(false);
  });

  it('14 · the stage manifest assigns cliffs.js to S2, never to FOUNDATIONS', () => {
    const s2 = GENERATION_NODES.find((x) => x.nodeId === 'S2');
    const found = GENERATION_NODES.find((x) => x.nodeId === 'FOUNDATIONS');
    expect(s2.modules).toContain('cliffs.js');
    // ⭐ THE WHOLE SHAPE OF THE DISCHARGE: the derivation lives in the domain and the foundation
    // consumes a published line. A lane that moved it here would re-create the exact defect the
    // §297.2b hold was written to prevent.
    expect(found.modules).not.toContain('cliffs.js');
    expect(found.allowedImports).not.toContain('cliffs.js');
    const s13 = GENERATION_NODES.find((x) => x.nodeId === 'S13');
    expect(s13.allowedImports).toContain('cliffs.js');
    // The escarpment mints no random namespace: it is de-staircased by corner-cutting alone.
    expect(s2.statefulForkSites).toBe(0);
  });

  it('15 · the point predicate and the segment predicate agree — one law, two shapes', () => {
    const c = deriveCliffs(subOf(fixture('agree-mountain', 'mountain'), 'mountain'));
    let checkedIn = 0, checkedOut = 0;
    for (let j = 1; j < c.n; j += 7) {
      for (let i = 1; i < c.n; i += 7) {
        const x = (i + 0.5) * c.cell, y = (j + 0.5) * c.cell;
        const on = onImpassable(c, x, y);
        // A zero-length probe about a point must answer what the point predicate answers.
        expect(segmentTouchesImpassable(c, x, y, x, y)).toBe(on);
        if (on) checkedIn++; else checkedOut++;
      }
    }
    expect(checkedIn).toBeGreaterThan(0);
    expect(checkedOut).toBeGreaterThan(0);
  });
});
