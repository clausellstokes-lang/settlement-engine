/**
 * tests/domain/townMapWallCircuit.test.js — ⭐⭐⭐ THE §230 / §232 / §234 PILOT PINS (MF-B8b).
 *
 * Every arm here exists because something PASSED while the defect was live. MF-B8 shipped three
 * standing "0 drawn bodies in reserved ground" censuses over 22,934 bodies while 1,502 bodies
 * actually stood in reserved ground, so a pin that only asserts "the census reads 0" is worth
 * nothing on its own. Each law below therefore carries its COUNTERFACTUAL: an arm that plants
 * the exact defect and asserts the instrument reds.
 */
import { describe, it, expect } from 'vitest';
import { buildFabric } from '../../src/domain/townMap/fabric/buildFabric.js';
import { buildTownMapModel } from '../../src/domain/townMap/townMapModel.js';
import {
  deriveWallCircuit, circuitClaims, circuitDrawnRuns, circuitBandSide, circuitHold,
  circuitProbe, circuitProbeExhaustive,
  verifyCircuit, assertCircuitFresh, contentHash, ringsText, inputsText,
  WALL_CIRCUIT_INPUTS, WALL_CIRCUIT_NODE, splitAtGates, GATE_RADIUS_SHARE,
} from '../../src/domain/townMap/fabric/wallCircuit.js';
import {
  claimSegments, claimIndex, deepestPenetration, segToPolyDist, PENETRATION_EPS,
  segSegClosest, segSegDist, nearestOnSeg, latticeAreaShare,
  ringNearestSegment, ringNearestIndex,
} from '../../src/domain/townMap/fabric/reservedGround.js';
import { districtStraddlers, FAUBOURG_SUFFIX } from '../../src/domain/townMap/fabric/districtPartition.js';
import {
  deriveEpochs, boundEpoch, pointIn, TIER_CIRCUIT_CAP, OUTGROWN_SHARE,
} from '../../src/domain/townMap/fabric/epochAxis.js';
import { traceWalls } from '../../src/domain/townMap/fabric/walls.js';
import { centroid as polyCentroid } from '../../src/domain/townMap/fabric/fabricGeometry.js';
import { makeTownFixture, makeWalledFixture, makeDemotedFixture, makeChaoticFixture } from '../fixtures/townMapFixtures.js';

const build = (s) => buildFabric(s, buildTownMapModel(s, null), {});

/** ⚠ A WALL PIN NEEDS A WALL. The plain town fixture carries no `defenseProfile`, so its
 *  circuit list is empty and every arm below would pass vacuously (MF-B1b's own standard). */
const WALLED = Object.freeze([
  ['city', () => makeWalledFixture()],
  ['metropolis', () => makeWalledFixture({ _seed: 'fixture-walled-metro', tier: 'metropolis', population: 70000 })],
  ['demoted', () => makeWalledFixture({ _seed: 'fixture-walled-demoted', tier: 'city', population: 3500 })],
  ['chaotic', () => makeWalledFixture({ ...makeChaoticFixture(), _seed: 'fixture-walled-chaos', tier: 'city', population: 20000, defenseProfile: { walls: 'stone' } })],
]);
const ALL = Object.freeze([
  ...WALLED,
  ['unwalled town', () => makeTownFixture()],
  ['unwalled demoted', () => makeDemotedFixture()],
]);

/** Every FILLED body the leaf draws — the §195.0 drawn set, restated for this suite. */
function drawnBodySet(f) {
  const out = [];
  const merged = (f.lod && f.lod.mergedKeys) || new Set();
  for (const p of f.parcels) {
    if (merged.has(p.key)) continue;
    if (p.polygon && p.polygon.length >= 3) out.push({ key: p.key, kind: 'parcel', poly: p.polygon });
    if (p.backHouse && p.backHouse.length >= 3) out.push({ key: `${p.key}#back`, kind: 'backHouse', poly: p.backHouse });
  }
  for (const m of (f.lod ? f.lod.masses : [])) if (m.polygon && m.polygon.length >= 3) out.push({ key: m.key, kind: 'mass', poly: m.polygon });
  for (const h of (f.shanty ? f.shanty.huts : [])) if (h.polygon && h.polygon.length >= 3) out.push({ key: h.key, kind: 'hut', poly: h.polygon });
  for (const lm of f.landmarks) for (let i = 0; i < (lm.solids || []).length; i++) {
    if (lm.solids[i] && lm.solids[i].length >= 3) out.push({ key: `${lm.instanceKey}#${i}`, kind: 'institution', poly: lm.solids[i] });
  }
  for (const h of (f.habitation || [])) for (let i = 0; i < (h.solids || []).length; i++) {
    if (h.solids[i] && h.solids[i].length >= 3) out.push({ key: `${h.key}#${i}`, kind: 'steading', poly: h.solids[i] });
  }
  for (const b of ((f.faubourgs && f.faubourgs.buildings) || [])) if (b.polygon && b.polygon.length >= 3) out.push({ key: b.key, kind: 'faubourg', poly: b.polygon });
  for (const b of ((f.faubourgs && f.faubourgs.leanTos) || [])) if (b.polygon && b.polygon.length >= 3) out.push({ key: b.key, kind: 'leanTo', poly: b.polygon });
  for (const b of ((f.stateMarks && f.stateMarks.bodies) || [])) if (b.polygon && b.polygon.length >= 3) out.push({ key: b.key, kind: b.kind || 'state', poly: b.polygon });
  return out;
}

/** Every reserved surface the finished fabric publishes, as ONE claim list. */
const reservedClaims = (f) => f.channels.concat(circuitClaims(f.wallCircuit));

describe('§230 · ONE circuit object, and every consumer pulls it through the accessor', () => {
  it('publishes a content hash that its own accessors verify', () => {
    for (const [name, make] of ALL) {
      const f = build(make());
      expect(f.wallCircuit.nodeId).toBe(WALL_CIRCUIT_NODE);
      expect({ name, ok: f.wallCircuit.contentHash === contentHash(ringsText(f.wallCircuit.rings)) })
        .toEqual({ name, ok: true });
      expect(() => verifyCircuit(f.wallCircuit)).not.toThrow();
    }
  });

  it('⛔ COUNTERFACTUAL — a MUTATED circuit reds at EVERY accessor', () => {
    const f = build(makeWalledFixture());
    const node = f.wallCircuit;
    expect(node.rings.length).toBeGreaterThan(0);
    const tampered = {
      ...node,
      rings: node.rings.map((r, i) => (i ? r : { ...r, polygon: r.polygon.map(([x, y]) => [x + 3, y]) })),
    };
    expect(() => verifyCircuit(tampered)).toThrow(/STALE OR MUTATED/);
    expect(() => circuitClaims(tampered)).toThrow(/STALE OR MUTATED/);
    expect(() => circuitDrawnRuns(tampered)).toThrow(/STALE OR MUTATED/);
    expect(() => circuitBandSide(tampered, 500, 500)).toThrow(/STALE OR MUTATED/);
    expect(() => circuitHold(tampered, 500, 500, -1)).toThrow(/STALE OR MUTATED/);
    // ⭐ MF-PERF1 · AND THE MEASURING INSTRUMENTS RED AT ACQUISITION. `circuitProbe` verifies
    // ONCE and then answers many questions, which is the whole of its performance value — so
    // the freshness gate has to fire on the ACQUISITION or the value would have been bought
    // by weakening §230. Both rigs are named, because the exhaustive one is the pin's own
    // reference and a reference that skipped the gate would be a second, unguarded door.
    expect(() => circuitProbe(tampered)).toThrow(/STALE OR MUTATED/);
    expect(() => circuitProbeExhaustive(tampered)).toThrow(/STALE OR MUTATED/);
  });

  it('⛔ COUNTERFACTUAL — a circuit from ANOTHER GENERATION of the fabric reds', () => {
    // §230.1's own hypothesis made impossible: the fabric is re-cut, a lane re-uses the wall
    // it already had, and nothing notices. `assertCircuitFresh` notices.
    const a = build(makeWalledFixture());
    const b = build(makeWalledFixture({ _seed: 'fixture-walled-other', population: 24000 }));
    const liveInputs = {};
    for (const k of WALL_CIRCUIT_INPUTS) liveInputs[k] = null;
    liveInputs.hasWalls = true;
    liveInputs.frontage = b.meta.plotFrontage;
    liveInputs.builtRadius = b.meta.builtRadius;
    expect(() => assertCircuitFresh(a.wallCircuit, liveInputs)).toThrow(/STALE GENERATION/);
    expect(a.wallCircuit.inputsHash).not.toBe(b.wallCircuit.inputsHash);
  });

  it('refuses an UNDECLARED input rather than hashing a subset of what it read', () => {
    expect(() => deriveWallCircuit({ hasWalls: false, somethingNew: 1 }, {}))
      .toThrow(/undeclared input 'somethingNew'/);
  });

  it('the input hash MOVES when a declared input MOVES — a count would not have caught it', () => {
    const base = {}; for (const k of WALL_CIRCUIT_INPUTS) base[k] = null;
    base.roads = [{ key: 'r1', line: [[0, 0], [10, 10]] }];
    const moved = { ...base, roads: [{ key: 'r1', line: [[0, 0], [10, 11]] }] };
    expect(contentHash(inputsText(base))).not.toBe(contentHash(inputsText(moved)));
  });
});

describe('§230 · the ink and the reservation open in the same places', () => {
  it('the drawn runs and the claim runs come from ONE splitter at ONE gate radius', () => {
    // ⭐⭐ §5 W2 · THE PIN'S **INTENT** IS UNCHANGED AND ITS ARITHMETIC HAD TO MOVE, so it is
    // restated rather than relaxed. Until this wave a ring published ONE band, so counting
    // pieces was a fair proxy for "the ink and the reservation open in the same places".
    // §239.2 is a PER-RUN policy (7/7 walled plates show a wall-side street on some runs, 0/7
    // on every run), so the reservation is now cut per typed run AND at the gates, and a piece
    // count is necessarily larger. ⭐ THE HONEST QUESTION IS THE ONE THE PROXY STOOD FOR: every
    // open gate breaks BOTH surfaces in the same place — asked as the OPENING POINTS rather
    // than as a tally.
    for (const [name, make] of WALLED) {
      const f = build(make());
      expect(f.wallCircuit.gateRadius).toBeCloseTo(f.meta.builtRadius * GATE_RADIUS_SHARE, 9);
      const drawn = circuitDrawnRuns(f.wallCircuit);
      const claims = circuitClaims(f.wallCircuit);
      expect(claims.length).toBeGreaterThanOrEqual(drawn.length);
      // ⭐⭐ ASKED AS **THE OPENING ITSELF**, which is exact for both surfaces and needs no
      // tolerance about vertex spacing: at an OPEN gate neither the ink nor the reservation may
      // come within the gate's own radius. A run END may legitimately sit a whole facet away
      // from a gate (a citywall's median segment is 133 units); what may NEVER happen is either
      // surface covering the opening the road goes through.
      const nearestLine = (lines, g) => {
        let best = Infinity;
        for (const line of lines) {
          for (let i = 0; i + 1 < line.length; i++) {
            const a = line[i], b = line[i + 1];
            const dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy;
            let t = L > 0 ? ((g.x - a[0]) * dx + (g.y - a[1]) * dy) / L : 0;
            t = t < 0 ? 0 : t > 1 ? 1 : t;
            const d = Math.hypot(g.x - (a[0] + dx * t), g.y - (a[1] + dy * t));
            if (d < best) best = d;
          }
        }
        return best;
      };
      const R = f.wallCircuit.gateRadius;
      for (const ring of f.wallCircuit.rings) {
        const ink = drawn.filter((r) => r.ring === ring).map((r) => r.line);
        const res = claims.filter((c) => c.key.indexOf(`wall.${ring.kind}.`) === 0).map((c) => c.line);
        for (const g of ring.gates) {
          if (g.bricked) continue;
          expect(nearestLine(ink, g), `${name}: the INK covers open gate ${g.key}`)
            .toBeGreaterThan(R * 0.9);
          expect(nearestLine(res, g), `${name}: the RESERVATION covers open gate ${g.key} — the ink opens where the reservation does not`)
            .toBeGreaterThan(R * 0.9);
        }
        // …and a BRICKED gate is closed in BOTH, which is the other half of "one splitter".
        for (const g of ring.gates) {
          if (!g.bricked) continue;
          expect(nearestLine(ink, g), `${name}: bricked gate ${g.key} left an opening in the ink`)
            .toBeLessThan(R);
        }
      }
    }
  });

  it('⛔ COUNTERFACTUAL — splitting by DROPPING VERTICES opens a hole of the wrong size', () => {
    const line = [];
    for (let x = 0; x < 200; x += 40) line.push([x, 0]);
    for (let y = 0; y < 200; y += 40) line.push([200, y]);
    for (let x = 200; x > 0; x -= 40) line.push([x, 200]);
    for (let y = 200; y > 0; y -= 40) line.push([0, y]);
    const gates = [{ x: 80, y: 0, bricked: false, key: 'g' }];
    /** The width of the opening AT THE GATE: the two run-ends that face each other across it. */
    const openingAtGate = (runs, gx, gy) => {
      const ends = [];
      for (const r of runs) { ends.push(r[0]); ends.push(r[r.length - 1]); }
      const near = ends
        .map((p) => ({ p, d: Math.hypot(p[0] - gx, p[1] - gy) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      return Math.hypot(near[0].p[0] - near[1].p[0], near[0].p[1] - near[1].p[1]);
    };
    expect(openingAtGate(splitAtGates(line, gates, 25), 80, 0)).toBeCloseTo(50, 6);  // the gate's diameter

    // the vertex-dropping spelling the LENS still used at b8: only the vertex AT the gate is
    // within the radius, so the opening becomes the vertex SPACING either side of it — 80.
    const dropped = []; let run = [];
    for (let i = 0; i <= line.length; i++) {
      const p = line[i % line.length];
      if (Math.hypot(p[0] - 80, p[1] - 0) < 25) { if (run.length > 1) dropped.push(run); run = []; } else run.push(p);
    }
    if (run.length > 1) dropped.push(run);
    expect(openingAtGate(dropped, 80, 0)).toBeCloseTo(80, 6);
  });

  it('the reservation CONTAINS the drawn stroke on BOTH faces, not merely in total width', () => {
    for (const [name, make] of WALLED) {
      const f = build(make());
      for (const ring of f.wallCircuit.rings) {
        const p = ring.bandParts;
        const outward = p.half + p.shift, inward = p.half - p.shift;
        expect({ name, kind: ring.kind, outOK: outward + 1e-9 >= p.inkHalf, inOK: inward + 1e-9 >= p.inkHalf })
          .toEqual({ name, kind: ring.kind, outOK: true, inOK: true });
      }
    }
  });
});

describe('§200 / §17.4 / §205A · reserved ground, asked of the body\'s AREA', () => {
  it('0 DRAWN bodies stand in any reserved claim, on every leaf', () => {
    for (const [name, make] of ALL) {
      const f = build(make());
      const segs = claimSegments(reservedClaims(f));
      const idx = claimIndex(segs);
      let worst = 0, n = 0;
      for (const b of drawnBodySet(f)) {
        const pen = deepestPenetration(b.poly, segs, idx).pen;
        if (pen > PENETRATION_EPS) { n++; if (pen > worst) worst = pen; }
      }
      expect({ name, n, worst: Math.round(worst * 100) / 100 }).toEqual({ name, n: 0, worst: 0 });
    }
  }, 120000);

  it('⛔ COUNTERFACTUAL — the VERTEX predicate MF-B8 used acquits a planted straddler', () => {
    // The exact body the owner saw: a range the claim runs through, every corner outside the
    // band. The area-true predicate convicts it; the vertex one does not.
    const segs = claimSegments([{ key: 'wall.plant', line: [[0, 0], [100, 0]], width: 8 }]);
    const idx = claimIndex(segs);
    const straddler = [[48, -8], [52, -8], [52, 8], [48, 8]];
    expect(deepestPenetration(straddler, segs, idx).pen).toBeGreaterThan(PENETRATION_EPS);

    let vertexPen = -Infinity;
    for (const p of straddler) for (const s of segs) {
      const dx = s.bx - s.ax, dy = s.by - s.ay;
      const L = dx * dx + dy * dy;
      let t = L > 0 ? ((p[0] - s.ax) * dx + (p[1] - s.ay) * dy) / L : 0;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      const d = Math.hypot(p[0] - (s.ax + dx * t), p[1] - (s.ay + dy * t));
      if (s.half - d > vertexPen) vertexPen = s.half - d;
    }
    expect(vertexPen).toBeLessThan(PENETRATION_EPS);
  });

  it('⛔ COUNTERFACTUAL — a body planted across a REAL leaf\'s wall band reds the census', () => {
    const f = build(makeWalledFixture());
    const segs = claimSegments(reservedClaims(f));
    const idx = claimIndex(segs);
    const s = segs.find((q) => q.key.startsWith('wall.'));
    expect(s).toBeTruthy();
    const mx = (s.ax + s.bx) / 2, my = (s.ay + s.by) / 2;
    const ux = s.bx - s.ax, uy = s.by - s.ay;
    const L = Math.hypot(ux, uy) || 1;
    const nx = -uy / L, ny = ux / L, reach = s.half * 2;
    const planted = [
      [mx + nx * reach - (ux / L) * 2, my + ny * reach - (uy / L) * 2],
      [mx + nx * reach + (ux / L) * 2, my + ny * reach + (uy / L) * 2],
      [mx - nx * reach + (ux / L) * 2, my - ny * reach + (uy / L) * 2],
      [mx - nx * reach - (ux / L) * 2, my - ny * reach - (uy / L) * 2],
    ];
    expect(deepestPenetration(planted, segs, idx).pen).toBeGreaterThan(PENETRATION_EPS);
  });

  it('segToPolyDist is 0 for CONTAINMENT and for CROSSING, and exact otherwise', () => {
    const box = [[0, 0], [10, 0], [10, 10], [0, 10]];
    expect(segToPolyDist({ ax: 2, ay: 5, bx: 8, by: 5 }, box)).toBe(0);
    expect(segToPolyDist({ ax: -5, ay: 5, bx: 15, by: 5 }, box)).toBe(0);
    expect(segToPolyDist({ ax: -4, ay: 5, bx: -4, by: 6 }, box)).toBeCloseTo(4, 9);
  });
});

/**
 * ⭐⭐⭐ MF-ARCH · PREDICATE UNIFICATION — the three surfaces the pilot's cure did NOT reach.
 *
 * MF-B8b cured the predicate that decides whether a body stands in RESERVED GROUND. It did not
 * audit the other laws that test geometry against geometry, and three of them were blind in the
 * same way. Each arm below is paired: the area-true answer, and a COUNTERFACTUAL that plants
 * the exact shape the old predicate acquitted.
 */
describe('MF-ARCH · every geometry-vs-geometry predicate, asked of AREA', () => {
  it('⛔ COUNTERFACTUAL — a street SPANNING a river in one segment has NO vertex in it', () => {
    // §205A's channel-crossing census asked the channel's VERTICES. A street whose two ends sit
    // on opposite banks crosses between them and scores clean at every vertex.
    const river = [[0, 0], [100, 0]];
    const half = 6;
    const street = [[50, -20], [50, 20]];        // one segment, straight across
    let vertexIn = false;
    for (const p of street) {
      const r = nearestOnSeg(p[0], p[1], river[0][0], river[0][1], river[1][0], river[1][1]);
      if (Math.sqrt(r.d2) < half) vertexIn = true;
    }
    expect(vertexIn).toBe(false);               // the blind reading ACQUITS

    const c = segSegClosest(street[0][0], street[0][1], street[1][0], street[1][1],
      river[0][0], river[0][1], river[1][0], river[1][1]);
    expect(c.d).toBe(0);                        // the segment reading CONVICTS
    expect(c.x).toBeCloseTo(50, 9);             // …and hands back WHERE, for the deck test
    expect(c.y).toBeCloseTo(0, 9);
  });

  it('segSegClosest returns a point ON the first segment, and agrees with segSegDist', () => {
    const cases = [
      [0, 0, 10, 0, 5, 3, 5, 9],       // apart, perpendicular
      [0, 0, 10, 0, -4, -4, -4, 4],    // apart, beyond the end
      [0, 0, 10, 0, 3, -2, 7, 2],      // crossing
      [0, 0, 10, 0, 0, 0, 10, 0],      // collinear, identical
    ];
    for (const [ax, ay, bx, by, cx, cy, dx, dy] of cases) {
      const c = segSegClosest(ax, ay, bx, by, cx, cy, dx, dy);
      expect(c.d).toBeCloseTo(segSegDist(ax, ay, bx, by, cx, cy, dx, dy), 12);
      // the returned point lies on AB
      const r = nearestOnSeg(c.x, c.y, ax, ay, bx, by);
      expect(Math.sqrt(r.d2)).toBeLessThan(1e-9);
    }
  });

  it('⛔ COUNTERFACTUAL — counting CORNERS is not measuring AREA', () => {
    // §203's containment arm said "MAJORITY AREA" in its own comment and counted corners.
    // A plus-shaped body whose four extreme corners sit in a neighbour's cells while its bulk
    // is at home: the corner count convicts, the area acquits.
    const cell = 10;
    // owner 7 owns the middle column of cells (x in [10,20)); everything else is owner 3.
    const ownerOf = (x, y) => (x >= 10 && x < 20 ? 7 : 3);
    // A tall thin bar wholly inside the middle column, with two small ears poking out.
    const bar = [
      [11, 2], [19, 2], [19, 30], [11, 30],
    ];
    const share = latticeAreaShare(bar, cell, ownerOf, 7);
    expect(share.share).toBeCloseTo(1, 9);      // ALL of its area is at home

    // ⭐ THE SHAPE THAT SEPARATES THEM: a fat block at home with ONE THIN FINGER reaching out,
    // and the finger carries most of the VERTICES while the block carries most of the AREA.
    // ⚠ My first spelling of this arm used a plus-sign and it PASSED THE CORNER TEST — 8 of its
    // 12 corners were at home, so the corner count acquitted and the counterfactual proved
    // nothing. **A counterfactual that does not exhibit the defect is not a counterfactual**,
    // and only running it said so.
    const finger = [
      [11, 10], [19, 10], [19, 17],
      [25, 17], [30, 17], [35, 17], [40, 17],
      [40, 18], [35, 18], [30, 18], [25, 18],
      [19, 18], [19, 26], [11, 26],
    ];
    let corners = 0;
    for (const p of finger) if (ownerOf(p[0], p[1]) === 7) corners++;
    expect(corners).toBe(6);
    expect(corners * 2).toBeLessThanOrEqual(finger.length);  // the CORNER count CONVICTS it
    const fingerShare = latticeAreaShare(finger, cell, ownerOf, 7);
    expect(fingerShare.share).toBeGreaterThan(0.8);          // the AREA ACQUITS it
  });

  it('latticeAreaShare is EXACT — a body wholly inside one cell scores 1, split evenly 0.5', () => {
    const cell = 10;
    const inOne = [[1, 1], [9, 1], [9, 9], [1, 9]];
    expect(latticeAreaShare(inOne, cell, () => 4, 4).share).toBeCloseTo(1, 12);
    expect(latticeAreaShare(inOne, cell, () => 5, 4).share).toBeCloseTo(0, 12);
    // straddling the x = 10 line exactly half and half
    const split = [[5, 1], [15, 1], [15, 9], [5, 9]];
    expect(latticeAreaShare(split, cell, (x) => (x < 10 ? 1 : 2), 1).share).toBeCloseTo(0.5, 12);
    // and the clipped areas sum to the body's own area
    const s = latticeAreaShare(split, cell, () => 1, 1);
    expect(s.total).toBeCloseTo(10 * 8, 9);
  });

  it('the §205A census SEES a body the claim runs through with every corner dry', () => {
    // A quay-shaped bar the channel passes along, corners clear of the centreline band.
    const segs = claimSegments([{ key: 'water', line: [[0, 0], [100, 0]], width: 8 }]);
    const idx = claimIndex(segs);
    const bar = [[40, -6], [60, -6], [60, 6], [40, 6]];
    let vertexPen = -Infinity;
    for (const p of bar) for (const s of segs) {
      const r = nearestOnSeg(p[0], p[1], s.ax, s.ay, s.bx, s.by);
      const d = s.half - Math.sqrt(r.d2);
      if (d > vertexPen) vertexPen = d;
    }
    expect(vertexPen).toBeLessThan(0);                            // blind reading: dry
    expect(deepestPenetration(bar, segs, idx).pen).toBeGreaterThan(PENETRATION_EPS);
  });

  it('the three cured censuses report the SAME figures the audit predicted, on a real leaf', () => {
    // ⚠ NOT A SNAPSHOT OF A NUMBER — a cross-check between two independent instruments. The
    // external audit (MFARCH-predaudit) predicted the city's §205A count would rise by exactly
    // 7 under the area-true predicate; the census, cured, rose by exactly 7. The pin holds the
    // INVARIANT that makes both true: the census's crossing count is never BELOW what the
    // area-true predicate finds over the census's own subject set.
    const f = build(makeWalledFixture());
    const rel = f.water;
    if (!rel || !rel.line || rel.line.length < 2) { expect(f.meta.waterCrossings).toBe(0); return; }
    const segs = claimSegments([{ key: 'water', line: rel.line, width: (rel.width || 0) * 1.24 }]);
    const idx = claimIndex(segs);
    let bodies = 0;
    for (const lm of (f.landmarks || [])) {
      for (const poly of (lm.solids || [])) {
        if (poly && poly.length >= 3 && deepestPenetration(poly, segs, idx).pen > 0) bodies++;
      }
    }
    expect(f.meta.waterCrossings).toBeGreaterThanOrEqual(bodies);
  }, 120000);
});

describe('§232 · the wall is a district partition', () => {
  it('0 district geometries straddle the band, on every walled leaf', () => {
    for (const [name, make] of WALLED) {
      const f = build(make());
      const s = districtStraddlers(f.umbrella.partition, f.wallCircuit);
      expect({ name, straddlers: s.straddlers, keys: s.keys }).toEqual({ name, straddlers: 0, keys: [] });
      expect(s.sampled).toBeGreaterThan(1000);
    }
  }, 120000);

  it('⛔ COUNTERFACTUAL — a straddling district reds the census', () => {
    const f = build(makeWalledFixture());
    const claim = circuitClaims(f.wallCircuit)[0];
    const mid = claim.line[Math.floor(claim.line.length / 2)];
    const R = claim.width * 3;
    const planted = [{
      districtId: 'district.planted',
      polygon: [[mid[0] - R, mid[1] - R], [mid[0] + R, mid[1] - R], [mid[0] + R, mid[1] + R], [mid[0] - R, mid[1] + R]],
    }];
    const s = districtStraddlers(planted, f.wallCircuit, 1.0);
    expect({ n: s.straddlers, keys: s.keys }).toEqual({ n: 1, keys: ['district.planted'] });
  });

  it('⛔ COUNTERFACTUAL — the partition traced WITHOUT the wall as a boundary straddles', () => {
    // The pre-cure construction is still carried out on the fabric (`growthUmbrella`), so the
    // cure can be shown to be the thing doing the work rather than the seed being kind.
    const f = build(makeWalledFixture());
    const before = f.growthUmbrella.partition;
    expect(before.length).toBeGreaterThan(1);
    expect(districtStraddlers(before, f.wallCircuit).straddlers).toBeGreaterThan(0);
  });

  it('extramural ground is its OWN district, never an intramural quarter continued', () => {
    // ⚠ NOT EVERY WALLED LEAF HAS A FAUBOURG, and that is correct rather than a gap: where the
    // town outgrew its first circuit the LATER ring is fitted to today's fabric, so there is no
    // ground outside it (measured: the walled city fixture publishes 0 extramural regions).
    // The arm therefore asserts the law across the set AND that the set is not vacuous.
    let withFaubourgs = 0;
    for (const [name, make] of WALLED) {
      const f = build(make());
      const outs = f.umbrella.partition.filter((c) => c.wallSide === 'extramural');
      if (outs.length) withFaubourgs++;
      for (const c of outs) {
        expect({ name, suffixed: c.districtId.endsWith(FAUBOURG_SUFFIX), own: c.districtId !== c.parentDistrictId, parent: !!c.parentDistrictId })
          .toEqual({ name, suffixed: true, own: true, parent: true });
      }
      // no district id published twice — the landed one-element-per-district-id contract
      const ids = f.umbrella.partition.map((c) => c.districtId);
      expect({ name, unique: new Set(ids).size }).toEqual({ name, unique: ids.length });
    }
    expect(withFaubourgs).toBeGreaterThan(0);
  }, 120000);

  it('circuitHold projects onto the band face and leaves a legal point alone', () => {
    const f = build(makeWalledFixture());
    const claim = circuitClaims(f.wallCircuit)[0];
    const mid = claim.line[Math.floor(claim.line.length / 2)];
    expect(circuitHold(f.wallCircuit, mid[0], mid[1], -1)).toEqual([mid[0], mid[1]]);
    const held = circuitHold(f.wallCircuit, mid[0] + 60, mid[1] + 60, -1);
    expect(circuitBandSide(f.wallCircuit, held[0], held[1])).toBeLessThanOrEqual(0);
  });

  it('an UNWALLED leaf keeps its partition untouched — the law has nothing to stop at', () => {
    const f = build(makeTownFixture());
    expect(f.wallCircuit.rings.length).toBe(0);
    expect(districtStraddlers(f.umbrella.partition, f.wallCircuit).straddlers).toBe(0);
    for (const c of f.umbrella.partition) expect(c.districtId.endsWith(FAUBOURG_SUFFIX)).toBe(false);
  });
});

/**
 * ⭐⭐⭐ ODQ §240 · THE EPOCH / VERSION AXIS. Every arm here exists because MF-ARCH measured the
 * defect it closes: **1,331 of 19,563 drawn bodies (6.8%) stood outside the circuit traced from
 * the umbrella they helped form**, and every ring on every leaf came from ONE node, ONE input
 * hash, ONE pass — the epochs were in the OUTPUT and absent from the DERIVATION.
 */
describe('§240 · generation proceeds in ordered epochs, and each wall bounds its own', () => {
  it('the ring count is DERIVED from tier thresholds, never a knob (§240.2)', () => {
    // A village earns none, a town one, a city two, and the ladder is arithmetic over §5's own
    // footprint bands rather than a dial. ⚠ The extents are shares of TODAY'S built radius.
    // ⚠ `foundingAge` JOINS THE DECLARED SET AT §5 W2 — it is G-42's gate, exactly as the
    // vintage is the circuit's, and a ladder asked without it understates to one epoch.
    const A = { ageAtBuild: 49, year: 142 };
    const town = deriveEpochs({ hasWalls: true, extentTier: 'town', builtRadius: 309, vintage: A, foundingAge: 191 });
    expect(town.circuits).toBe(1);
    const city = deriveEpochs({ hasWalls: true, extentTier: 'city', builtRadius: 392, vintage: { ageAtBuild: 5, year: 99 }, foundingAge: 104 });
    expect(city.circuits).toBe(2);
    expect(city.extents[0]).toBeLessThan(city.extents[1]);
    // ⛔ COUNTERFACTUAL — the SAME tier with no room to have outgrown its wall earns ONE. A
    // ladder that returned 2 for every city would be a knob wearing a derivation's clothes.
    const tight = deriveEpochs({ hasWalls: true, extentTier: 'city', builtRadius: 290, vintage: { ageAtBuild: 5, year: 99 }, foundingAge: 104 });
    expect(tight.extents[0]).toBeGreaterThan(OUTGROWN_SHARE);
    expect(tight.circuits).toBe(1);
    // and an unwalled year earns none at all
    expect(deriveEpochs({ hasWalls: false, extentTier: 'city', builtRadius: 392, vintage: null, foundingAge: 104 }).circuits).toBe(0);
    // ⭐⭐⭐ §252.3(a) · THE METROPOLIS CAP IS 3, LIFTED **WITH** THE RUN CHAIN AND THEN BY
    // MEASUREMENT (`laneMFW2-receipt.md` §6's op-ceiling arithmetic). The village cap is a
    // MAINTENANCE cap, not an earning rule — a below-town settlement earns no town+ threshold
    // and therefore no circuit, and a dossier that states walls gets one as a TRUTH OVERRIDE.
    expect(TIER_CIRCUIT_CAP.village).toBe(1);
    expect(TIER_CIRCUIT_CAP.metropolis).toBe(3);
    const vill = deriveEpochs({ hasWalls: true, extentTier: 'village', builtRadius: 179, vintage: A, foundingAge: 240 });
    expect(vill.truthOverride).toBe(true);
    expect(vill.circuits).toBe(1);
    // ⛔⛔ §240.2's BINDING CONDITION, ASSERTED AT THE DOOR: the ladder is DERIVED, never
    // dialled. A caller that hands it a count is REFUSED rather than obeyed.
    expect(() => deriveEpochs({
      hasWalls: true, extentTier: 'city', builtRadius: 392, vintage: A, foundingAge: 104, epochs: 3,
    })).toThrow(/DERIVED, never dialled/);
    expect(() => deriveEpochs({
      hasWalls: true, extentTier: 'city', builtRadius: 392, vintage: A, foundingAge: 104, population: 20000,
    })).toThrow(/undeclared input/);
  });

  it('every walled leaf carries one ring PER EPOCH, each naming its own version', () => {
    let multi = 0;
    for (const [name, make] of WALLED) {
      const f = build(make());
      const node = f.wallCircuit;
      expect({ name, rings: node.rings.length > 0 }).toEqual({ name, rings: true });
      const walled = node.epochs.filter((e) => e.walled);
      expect({ name, n: node.rings.length }).toEqual({ name, n: walled.length });
      // the epoch index is ON the ring and it is unique — two versions of the wall are never
      // one fact, which is the whole of §241.2
      const idx = node.rings.map((r) => r.epoch).sort();
      expect({ name, unique: new Set(idx).size }).toEqual({ name, unique: idx.length });
      // outermost first, so `rings[0]` is the working circuit exactly as every consumer expects
      expect({ name, first: node.rings[0].kind }).toEqual({ name, first: 'main' });
      if (node.rings.length > 1) { multi++; expect(node.rings[node.rings.length - 1].kind).toBe('old-core'); }
    }
    expect(multi).toBeGreaterThan(0);
  }, 240000);

  it('⭐⭐⭐ §240.1 · every circuit COMPLETELY BOUNDS its own epoch — 0 on every ring', () => {
    // ⛔⛔ ⟦§297.5d⟧ **THE INDEPENDENCE ARM WAS VACUOUS ON EVERY HALF-RING AND THE BUG WAS ONE
    //    OPERATOR PLACEMENT.** It read `if (!pointIn(r.polygon, …) && !r.halfRing) out++` — the
    //    half-ring test sat INSIDE the per-point condition, so on a bankside leaf the loop ran
    //    to completion and could not increment: not "exempt where the river defends", but
    //    **counted nothing at all**. §297.5 named it: the arm is vacuous on 6 of 10 walled
    //    leaves, and its `0` was the empty sum. ⭐ THE CLASS: **an exemption written into the
    //    CONVICTION rather than beside it silently empties the census instead of narrowing it.**
    // ⭐ RE-AUTHORED WITH THE DERIVATION'S OWN RULE, never a distance: a hull point the traced
    //    ring drops is exempt only if the CLOSED circuit held it — the river is the fourth wall,
    //    and that is the water filter's own predicate rather than a second spelling of it
    //    (`walls.js` computes `containmentResidual` this exact way).
    let examined = 0, halfRings = 0, rescued = 0;
    for (const [name, make] of WALLED) {
      const f = build(make());
      for (const r of f.wallCircuit.rings) {
        // the derivation's own residual, measured where the half-ring predicate is in scope
        expect({ name, epoch: r.epoch, residual: r.containmentResidual }).toEqual({ name, epoch: r.epoch, residual: 0 });
        // and re-measured here from the published hull, so the claim is not self-reported only
        if (r.halfRing) halfRings++;
        let out = 0;
        for (const p of r.epochHull) {
          examined++;
          if (pointIn(r.polygon, p[0], p[1])) continue;
          if (r.halfRing && r.closedPolygon && pointIn(r.closedPolygon, p[0], p[1])) { rescued++; continue; }
          out++;
        }
        expect({ name, epoch: r.epoch, out }).toEqual({ name, epoch: r.epoch, out: 0 });
      }
    }
    // ⛔ NON-VACUITY, BOTH HALVES. The census must have examined points at all, and — the arm
    //    §297.5d actually ordered — a half-ring must EXIST in the fixture set, or "exempt where
    //    the river defends" is a rule nothing exercises.
    expect(examined, 'the containment arm examined no hull points at all').toBeGreaterThan(100);
    expect(halfRings, 'no half-ring in the fixture set — the water exemption is untested').toBeGreaterThan(0);
    // ⚠ `rescued` is REPORTED, not asserted positive: on this fixture set the closure may leave
    //    nothing for the exemption to catch, and a pin demanding it would be pinning the fixture
    //    rather than the law. The half-ring's EXISTENCE is the arm; the rescue count is data.
    expect(Number.isInteger(rescued)).toBe(true);
  }, 240000);

  it('⭐⭐⭐ §241.6 · NO DRAWN BODY STANDS OUTSIDE ITS OWN EPOCH\'S CIRCUIT — the 6.8% target', () => {
    // MF-ARCH measured 1,331 of 19,563 drawn bodies (6.8%) outside the circuit traced from the
    // umbrella they helped form. THIS is that census, re-asked per epoch.
    // ⚠ THE EPOCH OF A BODY IS THE INNERMOST EPOCH WHOSE **HULL** CONTAINS IT — the fabric the
    // ring was traced FROM, one derivation step BEFORE the ring. Not "is it inside the ring",
    // which would be the self-referential class: a set defined by the predicate it is tested by.
    let members = 0, suburb = 0;
    for (const [name, make] of WALLED) {
      const f = build(make());
      const node = f.wallCircuit;
      const walled = node.epochs.filter((e) => e.walled && e.body);
      for (const b of drawnBodySet(f)) {
        const c = polyCentroid(b.poly);
        let idx = -1;
        for (const e of walled) if (pointIn(e.body, c[0], c[1])) { idx = e.index; break; }
        if (idx < 0) { suburb++; continue; }
        members++;
        // ⭐ HELD BY ITS OWN EPOCH'S CIRCUIT **OR BY ANY LATER ONE**, and the "or" is the law
        // rather than a slackening. A body can sit a couple of units outside the OLD CORE's
        // traced ring while standing 169 units inside the CITY wall — MEASURED, one market
        // solid on the city fixture, 15 units inside epoch 0's hull and 2.5 outside its ring.
        // The old wall was built through or past it; the town it stands in is the later one.
        // The strict per-ring claim (§240.1, every point of an epoch's own boundary inside its
        // own ring) is pinned separately above and holds at 0 on every ring.
        // ⚠ the river is the fourth wall: a body the CLOSED circuit held and only the half-ring
        // filter dropped is DEFENDED. The exemption is the filter's own rule, never a distance.
        const held = node.rings.some((r) => r.epoch >= idx
          && (pointIn(r.polygon, c[0], c[1]) || (r.halfRing && pointIn(r.closedPolygon, c[0], c[1]))));
        expect({ name, epoch: idx, key: b.key, held }).toEqual({ name, epoch: idx, key: b.key, held: true });
      }
    }
    // ⛔ AND THE ARM IS NOT VACUOUS FROM EITHER END: there ARE members, and there IS a suburb.
    expect(members).toBeGreaterThan(1000);
    expect(suburb).toBeGreaterThan(0);
  }, 240000);

  it('⛔ COUNTERFACTUAL — boundEpoch is what makes it true; a trace that steps inside is caught', () => {
    // A square hull and a ring that has been pulled inside it on one face — exactly the shape
    // the terrain pull produced before it was guarded.
    const hull = [[0, 0], [100, 0], [100, 100], [0, 100]];
    const cut = [[-10, -10], [110, -10], [110, 110], [50, 40], [-10, 110]];
    let before = 0;
    for (const p of hull) if (!pointIn(cut, p[0], p[1])) before++;
    expect(before).toBeGreaterThan(0);                 // the defect is present in the input
    const { ring, pushed } = boundEpoch(cut, hull);
    expect(pushed).toBeGreaterThan(0);
    let after = 0;
    for (const p of hull) if (!pointIn(ring, p[0], p[1])) after++;
    expect(after).toBe(0);
    // and a ring that already bounds its hull is left ALONE — no silent inflation
    const clear = [[-10, -10], [110, -10], [110, 110], [-10, 110]];
    expect(boundEpoch(clear, hull)).toEqual({ ring: clear, pushed: 0, worst: 0 });
  });

  it('⭐⭐⭐ §240.4 · ADDING A LATER RING DOES NOT RE-DERIVE AN EARLIER EPOCH', () => {
    // THE NAMED HAZARD, pinned directly. The epoch boundary is an inertia seam: every fact of
    // epoch 0 is held fixed and a second circuit is added beside it. Epoch 0 must come back
    // byte-identical INCLUDING its keyed-random draws (which gates were bricked, whether the
    // ditch was afforded) — not merely similar.
    const s0 = makeWalledFixture({ _seed: 'epoch-inertia', tier: 'city', population: 20000 });
    const f = build(s0);
    const node = f.wallCircuit;
    const e0 = node.epochs.find((e) => e.walled);
    const handles = {
      hasWalls: true, settlement: s0, umbrella: f.umbrella, tierScale: {
        extentTier: f.meta.extentTier, builtRadius: f.meta.builtRadius,
        highWater: f.meta.highWater || { demoted: false, deficit: 0 },
      },
      sub: f.substrate, water: f.water, web: f.web, seeding: { seed: f.meta.seed, variant: 0 },
      frontage: f.meta.plotFrontage, glacisClear: f.meta.glacisClear !== false,
    };
    const E0 = { index: 0, kind: 'old-core', extent: e0.extent, body: e0.body };
    const outer = node.epochs.filter((e) => e.walled)[1];
    const E1 = outer
      ? { index: 1, kind: 'main', extent: outer.extent, body: outer.body }
      : { index: 1, kind: 'main', extent: 1, body: f.growthUmbrella.components[0] };
    const alone = traceWalls({ ...handles, epochBodies: [E0] });
    const withLater = traceWalls({ ...handles, epochBodies: [E1, E0] });
    expect(alone.length).toBe(1);
    expect(withLater.length).toBe(2);                  // ⚠ the arm actually ADDED a ring
    const a = alone[0], b = withLater[1];
    expect(b.epoch).toBe(0);
    expect(JSON.stringify(b.polygon)).toBe(JSON.stringify(a.polygon));
    expect(JSON.stringify(b.towers)).toBe(JSON.stringify(a.towers));
    // ⭐ THE DRAWS, not only the geometry: `bricked` is a keyed chance and `ditch` an afforded
    // one. A shared sequential rng walked in ring order would move BOTH — the outer ring is
    // traced FIRST, so epoch 0's draws would come after draws that did not exist before.
    expect(JSON.stringify(b.gates.map((g) => [g.key, g.bricked]))).toBe(JSON.stringify(a.gates.map((g) => [g.key, g.bricked])));
    expect(!!b.ditch).toBe(!!a.ditch);
  }, 240000);

  it('the OLD CORE is its own fabric, not a scaled copy of the modern silhouette', () => {
    // ⛔ THE DEFECT THIS REPLACES: the older ring used to be `shrinkAbout(todayOutline, ratio)`,
    // so it shared the modern outline's every lobe — a concentric decoration (§157). Two rings
    // derived from two epochs' cells cannot be similar by construction, so the pin asks the
    // question a scaled copy would fail: are the two rings the SAME SHAPE up to scale?
    const f = build(makeWalledFixture({ _seed: 'fixture-walled-metro', tier: 'metropolis', population: 70000 }));
    const rings = f.wallCircuit.rings;
    expect(rings.length).toBeGreaterThan(1);
    const main = rings[0], old = rings[rings.length - 1];
    const bearingSet = (r) => {
      const cx = r.polygon.reduce((t, p) => t + p[0], 0) / r.polygon.length;
      const cy = r.polygon.reduce((t, p) => t + p[1], 0) / r.polygon.length;
      const rad = r.polygon.map((p) => Math.sqrt((p[0] - cx) ** 2 + (p[1] - cy) ** 2));
      const mean = rad.reduce((t, v) => t + v, 0) / rad.length;
      return rad.map((v) => v / mean);                 // the shape, scale removed
    };
    const A = bearingSet(main), B = bearingSet(old);
    // a scaled copy has an IDENTICAL normalized radius profile at equal vertex counts
    const same = A.length === B.length && A.every((v, i) => Math.abs(v - B[i]) < 1e-9);
    expect(same).toBe(false);
  }, 240000);

  it('the epoch ladder is a DECLARED input, so a stale circuit cannot survive it', () => {
    const f = build(makeWalledFixture());
    expect(WALL_CIRCUIT_INPUTS).toContain('epochExtents');
    // the node publishes the whole ladder, suburb included
    const kinds = f.wallCircuit.epochs.map((e) => e.kind);
    expect(kinds.filter((k) => k === 'suburb').length).toBeLessThanOrEqual(1);
    expect(f.wallCircuit.epochs.filter((e) => e.walled).length).toBe(f.wallCircuit.rings.length);
    // ⛔ and the content hash SEES the epoch index: two rings of one geometry at two epochs
    // are two facts, and a hash that could not tell them apart would pass an epoch relabelling
    const relabelled = f.wallCircuit.rings.map((r) => ({ ...r, epoch: r.epoch + 10 }));
    expect(ringsText(relabelled)).not.toBe(ringsText(f.wallCircuit.rings));
  }, 120000);
});

/**
 * ⭐⭐⭐ MF-PERF1 · MF-ARCH's ITEM 5 — THE SPATIAL INDEX, AND THE PROOF THAT AN INDEX MAY MAKE AN
 * ANSWER FASTER AND MAY NEVER MAKE IT DIFFERENT (handed off unstarted by MF-ARCH-2 §9.1).
 *
 * ⚠⚠ AND THE FORM OF THIS PIN IS THE FINDING. §234's spatial-indexing rule asks for "an
 * indexed-vs-exhaustive equivalence pin on fixtures asserting IDENTICAL OUTPUTS, not merely
 * identical counts" — because a nearest-segment query returns a POINT as well as a distance,
 * two segments can tie at that distance, and `circuitHold` PROJECTS a district boundary onto
 * whichever point wins. An index that agreed about every distance and disagreed about one tie
 * would move a drawn district edge while every count stayed equal. So the arms below compare
 * the whole answer — the winning segment INDEX, the squared distance and both coordinates —
 * and one of them is a tie fixture built so that a naive index must fail it.
 */
describe('§234 · MF-PERF1 · the ring index reproduces the walk EXACTLY, ties included', () => {
  it('⭐ the indexed nearest EQUALS the walked nearest, index and point, over a real circuit', () => {
    const f = build(makeWalledFixture({ _seed: 'fixture-walled-metro', tier: 'metropolis', population: 70000 }));
    const rings = f.wallCircuit.rings.filter((r) => r.polygon && r.polygon.length >= 8);
    expect(rings.length).toBeGreaterThan(0);
    let compared = 0, indexedRings = 0;
    for (const ring of rings) {
      const idx = ringNearestIndex(ring.polygon);
      // ⛔ NON-VACUITY, FIRST ARM: if the "index" quietly fell back to the walk, every
      // comparison below would be a tautology. It must actually have built a tree.
      expect(idx.indexed).toBe(true);
      expect(idx.nodes).toBeGreaterThan(2);
      indexedRings++;
      // The lattice the §232 partition actually queries, plus the ring's own vertices (the
      // degenerate case: a query sitting exactly ON a segment endpoint, where two segments
      // meet at distance zero and the tie-break is the only thing that decides).
      /** @type {Array<[number, number]>} */ const probes = [];
      for (let i = 0; i < 128; i += 3) for (let j = 0; j < 128; j += 3) probes.push([(i + 0.5) * (1000 / 128), (j + 0.5) * (1000 / 128)]);
      for (const p of ring.polygon) probes.push([p[0], p[1]]);
      for (const [x, y] of probes) {
        const a = ringNearestSegment(ring.polygon, x, y);
        const b = idx.nearest(x, y);
        compared++;
        // toEqual on the WHOLE record: i, d2, qx, qy. Not a tolerance, not a count.
        if (a.i !== b.i || a.d2 !== b.d2 || a.qx !== b.qx || a.qy !== b.qy) expect({ x, y, walked: a, indexed: b }).toEqual({ x, y, walked: a, indexed: a });
      }
    }
    expect(indexedRings).toBeGreaterThan(0);
    expect(compared).toBeGreaterThan(2000);
  }, 240000);

  it('⛔ COUNTERFACTUAL — a TIE fixture where an out-of-order index returns a different POINT', () => {
    // A square, queried at its own centre: all four sides are exactly equidistant. The walk
    // improves on strict `<` in ascending index order, so it keeps segment 0 — and segment 0's
    // (qx, qy) is a different point from segments 1, 2 and 3's.
    const square = [[0, 0], [100, 0], [100, 100], [0, 100]];
    const walked = ringNearestSegment(square, 50, 50);
    expect(walked.i).toBe(0);
    // ⭐ IT IS A REAL TIE — proved, not assumed: every side is at the same squared distance,
    // and each returns its OWN point, so the tie-break is load-bearing rather than cosmetic.
    const perSide = [0, 1, 2, 3].map((i) => {
      const a = square[i], b = square[(i + 1) % 4];
      return nearestOnSeg(50, 50, a[0], a[1], b[0], b[1]);
    });
    expect(new Set(perSide.map((r) => r.d2)).size).toBe(1);
    expect(new Set(perSide.map((r) => `${r.qx},${r.qy}`)).size).toBe(4);
    // A ring of four cannot earn a tree (see ringNearestIndex's floor), so the tie-break is
    // asserted again on a DENSE ring that does: a regular 64-gon queried at its centre.
    /** @type {Array<[number, number]>} */ const poly = [];
    for (let k = 0; k < 64; k++) {
      // no runtime trig in the domain, and none here either: a diamond-parameterized ring is
      // enough to produce exact ties, because opposite sides are congruent by construction.
      const t = (k / 64) * 4, q = Math.floor(t), u = t - q;
      const pts = [[1, 0], [0, 1], [-1, 0], [0, -1]];
      const a = pts[q], b = pts[(q + 1) % 4];
      poly.push([500 + 300 * (a[0] + (b[0] - a[0]) * u), 500 + 300 * (a[1] + (b[1] - a[1]) * u)]);
    }
    const idx = ringNearestIndex(poly);
    expect(idx.indexed).toBe(true);
    const w = ringNearestSegment(poly, 500, 500);
    const got = idx.nearest(500, 500);
    // ⭐ THE TIE IS PROVED FIRST, then the tie-break. The centre of a diamond is equidistant
    // from the middle sub-segment of all four sides, and those four carry four DIFFERENT
    // points — so an index free to visit its tree in any order would return a different `qx`.
    const winners = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      if (nearestOnSeg(500, 500, a[0], a[1], b[0], b[1]).d2 === w.d2) winners.push(i);
    }
    expect(winners.length).toBeGreaterThan(1);                       // a genuine tie
    // ⚠ AND THE TIED SEGMENTS CARRY MORE THAN ONE DISTINCT POINT — measured, 8 tied segments
    // and 4 distinct points, because the two sub-segments meeting at each side's perpendicular
    // foot both answer with that shared vertex. Four points is four different answers an
    // out-of-order index could have returned, which is exactly what this arm forbids.
    expect(new Set(winners.map((i) => {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      const r = nearestOnSeg(500, 500, a[0], a[1], b[0], b[1]);
      return `${r.qx},${r.qy}`;
    })).size).toBeGreaterThan(1);
    expect(w.i).toBe(Math.min(...winners));                          // the walk keeps the lowest
    // …and the index keeps the SAME one, point included.
    expect({ i: got.i, d2: got.d2, qx: got.qx, qy: got.qy }).toEqual({ i: w.i, d2: w.d2, qx: w.qx, qy: w.qy });
  });

  it('⭐ the PROBE and the EXHAUSTIVE rig give identical §232 answers on every corpus query', () => {
    // ⚠ THE SUBJECT IS EVERY QUERY THE PARTITION MAKES, not a sample of convenient ones: the
    // 128² lattice `partitionAtTheWall` walks, and the district-region vertices `circuitHold`
    // projects. A pin over a handful of hand-chosen points could not have seen a tie.
    for (const [name, make] of WALLED) {
      const f = build(make());
      const node = f.wallCircuit;
      if (!node.rings.filter((r) => r.kind !== 'old-core' && r.bandParts).length) continue;
      const fast = circuitProbe(node);
      const slow = circuitProbeExhaustive(node);
      const seen = new Set();
      let n = 0;
      const check = (x, y) => {
        n++;
        const a = slow.side(x, y), b = fast.side(x, y);
        seen.add(a);
        if (a !== b) expect({ name, x, y, exhaustive: a, indexed: b }).toEqual({ name, x, y, exhaustive: a, indexed: a });
        for (const want of [-1, 1]) {
          const p = slow.hold(x, y, want), q = fast.hold(x, y, want);
          if (p[0] !== q[0] || p[1] !== q[1]) expect({ name, x, y, want, exhaustive: p, indexed: q }).toEqual({ name, x, y, want, exhaustive: p, indexed: p });
        }
      };
      const cell = 1000 / 128;
      for (let i = 0; i < 128; i += 2) for (let j = 0; j < 128; j += 2) check((i + 0.5) * cell, (j + 0.5) * cell);
      for (const region of (f.umbrella.partition || [])) for (const [x, y] of region.polygon) check(x, y);
      // ⛔ NON-VACUITY: the sweep must have reached BOTH sides of the wall and the band itself,
      // or an "identical answers" pass would only mean the query set never met the circuit.
      expect({ name, n: n > 3000, sides: [...seen].sort() }).toEqual({ name, n: true, sides: [-1, 0, 1] });
    }
  }, 240000);

  it('⭐ MF-ARCH item 5 · a census that did not run can never read as a clean one', () => {
    // "Skipped for scale" and "measured and found nothing" are different facts and a bare 0
    // cannot tell them apart. Every return of the straddler census now carries its own status.
    const walled = build(makeWalledFixture());
    const w = districtStraddlers(walled.umbrella.partition, walled.wallCircuit);
    expect(w.complete).toBe(true);
    expect(w.status).toMatch(/^COMPLETE/);
    expect(w.sampling).toEqual({ kind: 'lattice', step: 2.0, regions: walled.umbrella.partition.length });
    expect(w.sampled).toBeGreaterThan(0);            // it really examined ground
    expect(w.straddlers).toBe(0);                     // §232 still holds
    // ⛔ THE ARM THAT MATTERS: an unwalled leaf ALSO reports 0 straddlers, and it must NOT be
    // readable as the same fact. Its status says NOT APPLICABLE and its `complete` is false.
    const open = build(makeTownFixture());
    const u = districtStraddlers(open.umbrella.partition, open.wallCircuit);
    expect(u.straddlers).toBe(0);                     // the same number …
    expect(u.complete).toBe(false);                   // … and provably not the same claim
    expect(u.status).toMatch(/^NOT APPLICABLE/);
    expect(u.sampled).toBe(0);
  }, 240000);
});
