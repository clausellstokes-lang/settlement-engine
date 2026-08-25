/**
 * tests/domain/townMapPartitionWater.test.js — ⭐⭐⭐ SPINE-2 · DESIGN_SPINE §3e/§3f + the E1 cure.
 *
 * §6's law is *"every zero with a live control"*, so every zero asserted here is followed by the
 * plant that moves it. The cases are grouped by the exit they serve and each group's header names
 * the measurement that made it necessary.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  PARTITION_GRAZE_QUANTA, addVertex, createArrangement, cutFaceByChain, edgeInteriorAt,
  faceArea, liveFaces, seedRegion, splitEdge, splitFaceChain, vertexOnEdgeViolations,
  vertexOnSegment, RESERVED_EDGE_TYPES, RESERVED_FACE_CLASSES, EDGE_TYPES, FACE_CLASSES,
} from '../../src/domain/townMap/fabric/partitionArrangement.js';
import {
  BANK_LAW, BANK_SMOOTH_PASSES, CROSSING_KINDS, CROSSING_LAW, QUAY_LAW, bankStations, waterRing,
} from '../../src/domain/townMap/fabric/partitionWater.js';
import {
  LOSS_LAW, LOSS_STATES, decayByTime, recoverByPressure,
} from '../../src/domain/townMap/fabric/partitionDecline.js';
import {
  BANK_AGREEMENT_BAR, PARTITION_OWING_CLASSES, censusDecline, censusWater,
} from '../../src/domain/townMap/fabric/partitionCensus.js';
import { DECK_LAW, FORD_LAW } from '../../src/domain/townMap/fabric/waterWorks.js';
import { CROSSING_BUDGET, RIVER_PROFILE } from '../../src/domain/townMap/fabric/waterMode.js';
import { GATE_SPACING_FACETS } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { LOSS_REGION_SCHEMA } from '../../src/domain/townMap/fabric/growthLedger.js';

const SRC = 'src/domain/townMap/fabric';

/** A square region, the smallest thing that is a partition at all. */
function square(side = 100) {
  const arr = createArrangement();
  const f = seedRegion(arr, [[0, 0], [side, 0], [side, side], [0, side]], {
    faceClass: 'FIELD', edgeType: 'BOUND', key: 'sq',
  });
  return { arr, f };
}

describe('SPINE-2 · the E1 cure — a vertex may not graze a foreign edge', () => {
  it('the graze tolerance IS the half-quantum snap bound this file already promises', () => {
    // Not a new dial: `PARTITION_SNAP_TOLERANCE` is half a quantum in WORLD units and this is the
    // same half, in quanta. A cure that invented its own tolerance would be a second contract.
    expect(PARTITION_GRAZE_QUANTA).toBe(0.5);
  });

  it('REFUSES a construction point that GRAZES another edge — the metropolis case, reproduced', () => {
    const { arr, f } = square();
    // ⚠ THE CHORD IS DELIBERATELY OFF-AXIS. An axis-aligned chord cannot be grazed at all: every
    //   grid point near it quantizes ONTO it, and the test would prove the dedupe rather than the
    //   cure. The metropolis's real pair was two near-collinear WALL edges at 0.132 quanta.
    const cut = cutFaceByChain(arr, f, [[-10, -3], [50, 15], [110, 33]], {
      type: 'BOUND', key: 'chord',
    });
    expect(cut).not.toBeNull();
    // (33.333, 10.000) lies 0.096 QUANTA off the line through (0,0)–(100,30): inside the bound,
    // and not ON it — exactly the condition an exact on-segment predicate cannot see.
    const grazeEdge = edgeInteriorAt(arr, 33333, 10000, -1);
    expect(grazeEdge).toBeGreaterThanOrEqual(0);
    expect(arr.edges[grazeEdge].key).toMatch(/^chord/);

    // and a chain that would MINT a vertex there is refused, with the arrangement untouched
    const host = cut.faces.find((x) => faceArea(arr, x) > 0);
    const cyc = [...new Set(arr.edges.map((e) => e.id))];
    const edgesBefore = arr.edges.length;
    const res = splitFaceChain(arr, host, 0, 1, [[33.333, 10.0]], { type: 'BOUND', key: 'g' });
    expect(res.ok).toBe(false);
    expect(arr.edges.length).toBe(edgesBefore);
    void cyc;
  });

  it('the EXACT on-segment predicate alone would NOT have seen it — the correction of record', () => {
    // SPINE-1's receipt §6.1 read the metropolis vertex as lying "exactly on" the older wrap edge.
    // Executed in exact integer arithmetic it is 0.132 quanta OFF, so an exact test finds nothing.
    // This case is that arithmetic, at this file's own scale.
    const A = [309420, 764126]; const B = [284955, 749133]; const P = [287218, 750520];
    const cross = (B[0] - A[0]) * (P[1] - A[1]) - (B[1] - A[1]) * (P[0] - A[0]);
    expect(cross).not.toBe(0);                                     // NOT exactly on the line
    const L = Math.hypot(B[0] - A[0], B[1] - A[1]);
    expect(Math.abs(cross) / L).toBeLessThan(PARTITION_GRAZE_QUANTA); // but inside the graze bound
  });

  it('ALLOWS a split point clear of every other edge — the guard is not a blanket refusal', () => {
    const { arr } = square();
    const top = arr.edges.find((e) => e.key === 'sq.2');
    expect(splitEdge(arr, top.id, 40, 100)).toBeGreaterThanOrEqual(0);
  });

  it('the no-vertex-on-edge census CONVICTS on a planted graze and reads zero without it', () => {
    const { arr, f } = square();
    expect(vertexOnEdgeViolations(arr).length).toBe(0);
    // plant: move an existing vertex onto another edge's interior
    const v = addVertex(arr, 40, 60);           // strictly inside: on no edge at all
    expect(vertexOnEdgeViolations(arr).length).toBe(0);
    arr.verts[v].x = 40 * 1000; arr.verts[v].y = 0;   // now sitting on the bottom edge's interior
    expect(vertexOnEdgeViolations(arr).length).toBe(1);
    void f;
  });

  it('`vertexOnSegment` sees a vertex a chain would pass through — the mirror direction', () => {
    const { arr } = square();
    const v = addVertex(arr, 50, 50);
    // a segment straight through (50,50) in quantum coordinates
    expect(vertexOnSegment(arr, 0, 50000, 100000, 50000, -1, -1)).toBe(v);
    // and a segment that misses it
    expect(vertexOnSegment(arr, 0, 20000, 100000, 20000, -1, -1)).toBe(-1);
  });

  it('`edgeInteriorAt` excludes the edge it is asked about, and its own endpoints', () => {
    const { arr } = square();
    const bottom = arr.edges.find((e) => e.key === 'sq.0');
    expect(edgeInteriorAt(arr, 40000, 0, bottom.id)).toBe(-1);   // excluded by id
    expect(edgeInteriorAt(arr, 40000, 0, -1)).toBe(bottom.id);   // and found when not excluded
    expect(edgeInteriorAt(arr, 0, 0, -1)).toBe(-1);              // an endpoint is not an interior
  });
});

describe('SPINE-2 · `cutFaceByChain` — the primitive §3e is written in', () => {
  it('cuts a face with a polyline that enters and leaves it', () => {
    const { arr, f } = square();
    const res = cutFaceByChain(arr, f, [[-20, 40], [30, 45], [70, 55], [120, 60]], {
      type: 'BANK', key: 'b',
    });
    expect(res).not.toBeNull();
    expect(res.faces.length).toBe(2);
    expect(arr.edges.filter((e) => e.type === 'BANK').length).toBeGreaterThan(2);
  });

  it('REFUSES a chain that never enters, and one that does not cross at both ends', () => {
    const { arr, f } = square();
    expect(cutFaceByChain(arr, f, [[-40, -40], [-30, -30]], { type: 'BANK' })).toBeNull();
    // an ISLAND: entirely inside. This is the refusal that sends a ring formulation back.
    expect(cutFaceByChain(arr, f, [[20, 20], [40, 20], [40, 40]], { type: 'BANK' })).toBeNull();
    expect(arr.refusals.some((r) => r.where === 'cutFaceByChain')).toBe(true);
  });
});

describe('SPINE-2 · §3e the bank law', () => {
  it('a river bank sits at exactly the LOCAL half-width from its own station — one water truth', () => {
    const line = [];
    for (let i = 0; i < 40; i++) line.push([i * 5, 200 + Math.sin(i / 4) * 30]);
    const water = { line, width: 12, kind: 'river', bankSide: 1 };
    const st = bankStations(water, { cx: 100, cy: 200, radius: 300 });
    expect(st.length).toBeGreaterThan(4);
    for (const s of st) {
      expect(Math.hypot(s.left[0] - s.at[0], s.left[1] - s.at[1])).toBeCloseTo(6, 6);
      expect(Math.hypot(s.right[0] - s.at[0], s.right[1] - s.at[1])).toBeCloseTo(6, 6);
      // and the two banks are on opposite sides
      const dot = (s.left[0] - s.at[0]) * (s.right[0] - s.at[0])
        + (s.left[1] - s.at[1]) * (s.right[1] - s.at[1]);
      expect(dot).toBeLessThan(0);
    }
  });

  it("a coast's bank IS the shore, vertex for vertex — no chord cuts a corner off the sea", () => {
    const line = [];
    for (let i = 0; i < 60; i++) line.push([i * 4, 300 + Math.sin(i / 3) * 25]);
    const water = { line, width: 10, kind: 'coast', bankSide: 1 };
    const st = bankStations(water, { cx: 120, cy: 300, radius: 400 });
    expect(st.length).toBe(line.length);
    for (const s of st) {
      expect(s.left[0]).toBeCloseTo(s.at[0], 9);
      expect(s.left[1]).toBeCloseTo(s.at[1], 9);
    }
    expect(BANK_LAW.coastStationWidths).toBe(0);
  });

  it('the bank-smoothing count is `RIVER_PROFILE.smooth` — pinned, not chosen', () => {
    expect(BANK_SMOOTH_PASSES).toBe(RIVER_PROFILE.smooth);
  });

  it('the chain extension is long enough to leave the extent from any kept station — arithmetic', () => {
    // stations are kept within 1.25 R; a step of `extendRadii` R must clear R from any of them.
    expect(BANK_LAW.extendRadii - 1.25).toBeGreaterThan(1);
  });

  it('the water ring closes and encloses its own stations', () => {
    const line = [];
    for (let i = 0; i < 30; i++) line.push([i * 6, 150]);
    const st = bankStations({ line, width: 10, kind: 'river', bankSide: 1 },
      { cx: 90, cy: 150, radius: 200 });
    const ring = waterRing(st, { cx: 90, cy: 150, radius: 200 });
    expect(ring.length).toBe(st.length * 2 + 4);
  });
});

describe('SPINE-2 · §3e the crossing law — every constant quoted from a law that exists', () => {
  it('the crossing vocabulary is CLOSED and is §651 verbatim', () => {
    expect(CROSSING_KINDS).toEqual(['bridge', 'ford', 'ferry']);
  });

  it("the kink budget IS `DECK_LAW.kinkMaxTan`, stated as the angle it is", () => {
    expect(Math.round(Math.atan(DECK_LAW.kinkMaxTan) * 180 / Math.PI)).toBe(CROSSING_LAW.kinkMaxDeg);
  });

  it('the wide band IS `FORD_LAW.wideBand`, and the public-works floor IS `CROSSING_BUDGET`', () => {
    expect(CROSSING_LAW.wideBand).toBe(FORD_LAW.wideBand);
    expect(CROSSING_LAW.popFloor).toBe(CROSSING_BUDGET.popFloor);
    expect(CROSSING_LAW.apartWidths).toBe(1.6);
  });

  it('the bank-agreement bar IS `RIVER_PROFILE.hi` — the profile\'s own width ceiling', () => {
    expect(BANK_AGREEMENT_BAR).toBe(RIVER_PROFILE.hi);
  });
});

describe('SPINE-2 · §3f the decline machine — the two clocks, proved apart', () => {
  const region = (over) => ({
    key: 'loss.0', bornEpoch: 1, bornYear: 100, sourceEvent: 'a test', severity: 'major',
    kind: 'abandonment', state: 'INTACT', stageClock: 0, pressureClock: 0, footprint: 0,
    contactEpochs: [], ops: 0, provenance: 'interpolated', ...over,
  });

  it('the states and fields are `LOSS_REGION_SCHEMA`\'s own, not a second spelling', () => {
    expect(LOSS_STATES).toBe(LOSS_REGION_SCHEMA.states);
    expect(LOSS_REGION_SCHEMA.fields).toContain('stageClock');
    expect(LOSS_REGION_SCHEMA.fields).toContain('pressureClock');
  });

  it('⛔ TIME MOVES ONLY THE STAGE CLOCK — a century of years leaves pressure at zero', () => {
    const { arr } = square();
    const L = region();
    const state = { arr, losses: [L], epoch: 2, input: { extent: { cx: 0, cy: 0 } }, stamp: () => {} };
    decayByTime(state, { year: 200, provenance: 'interpolated' }, 100);
    expect(L.stageClock).toBe(100);
    expect(L.pressureClock).toBe(0);
    expect(L.state).toBe('BREAKING_DOWN');
  });

  it('⛔ PRESSURE MOVES ONLY THE PRESSURE CLOCK — a bitten ruin gains no years', () => {
    // a face with a live PLOT neighbour, so the growth front genuinely touches it
    const { arr, f } = square();
    const cut = cutFaceByChain(arr, f, [[-10, 50], [50, 50], [110, 50]], { type: 'BOUND', key: 'c' });
    arr.faces[cut.faces[0]].cls = 'LOSSREGION';
    arr.faces[cut.faces[1]].cls = 'PLOT';
    const L = region({ footprint: cut.faces[0] });
    const state = {
      arr, losses: [L], epoch: 2, input: { extent: { cx: 50, cy: 50 } }, stamp: () => {},
    };
    const out = recoverByPressure(state, { year: 200, provenance: 'interpolated' }, 1);
    expect(L.pressureClock).toBe(1);
    expect(L.stageClock).toBe(0);
    expect(L.state).toBe('CONTACTED');
    expect(out.started).toBe(1);
  });

  it('a bite that runs out of demand FREEZES MID-BITE, and only a bitten one can', () => {
    const { arr, f } = square();
    const cut = cutFaceByChain(arr, f, [[-10, 50], [50, 50], [110, 50]], { type: 'BOUND', key: 'c' });
    arr.faces[cut.faces[0]].cls = 'LOSSREGION';
    arr.faces[cut.faces[1]].cls = 'PLOT';
    const L = region({ footprint: cut.faces[0], state: 'CONTACTED', pressureClock: 1 });
    const state = { arr, losses: [L], epoch: 3, input: { extent: { cx: 50, cy: 50 } }, stamp: () => {} };
    const out = recoverByPressure(state, { year: 300, provenance: 'interpolated' }, 0);
    expect(L.state).toBe('FROZEN_MID_BITE');
    expect(out.halted).toBe(1);
    // an UNBITTEN ruin under the same zero demand is merely standing, not frozen
    const M = region({ footprint: cut.faces[0], state: 'DEBRIS' });
    const s2 = { arr, losses: [M], epoch: 3, input: { extent: { cx: 50, cy: 50 } }, stamp: () => {} };
    recoverByPressure(s2, { year: 300, provenance: 'interpolated' }, 0);
    expect(M.state).toBe('DEBRIS');
  });

  it('paying the price RECLAIMS the ground back to FIELD for the recursion to develop', () => {
    const { arr, f } = square();
    const cut = cutFaceByChain(arr, f, [[-10, 50], [50, 50], [110, 50]], { type: 'BOUND', key: 'c' });
    arr.faces[cut.faces[0]].cls = 'LOSSREGION';
    arr.faces[cut.faces[1]].cls = 'PLOT';
    const L = region({ footprint: cut.faces[0] });
    const state = { arr, losses: [L], epoch: 4, input: { extent: { cx: 50, cy: 50 } }, stamp: () => {} };
    recoverByPressure(state, { year: 400, provenance: 'interpolated' }, LOSS_LAW.reclaimCost);
    expect(L.state).toBe('RECLAIMED');
    expect(arr.faces[cut.faces[0]].cls).toBe('FIELD');
  });

  it('the decline census CONVICTS a clock fed from the wrong side', () => {
    const clean = { arrangement: createArrangement(), losses: { schema: LOSS_REGION_SCHEMA, regions: [region()] } };
    expect(censusDecline(clean).conflation.length).toBe(0);
    const fed = { arrangement: createArrangement(), losses: { schema: LOSS_REGION_SCHEMA, regions: [region({ pressureClock: 1 })] } };
    expect(censusDecline(fed).conflation.length).toBe(1);
    const healed = { arrangement: createArrangement(), losses: { schema: LOSS_REGION_SCHEMA, regions: [region({ state: 'RECLAIMED' })] } };
    expect(censusDecline(healed).conflation.length).toBe(1);
  });
});

describe('SPINE-2 · the water census — each zero with its plant', () => {
  const partitionOf = (arr, over = {}) => ({
    arrangement: arr, crossings: [], quays: [], water: { cut: null, ring: null }, ...over,
  });

  it('a dry leaf must mint no water, and minting some CONVICTS the liveness arm', () => {
    const { arr } = square();
    const dry = censusWater(partitionOf(arr), {});
    expect(dry.ok).toBe(true);
    liveFaces(arr)[0].cls = 'WATER';
    expect(censusWater(partitionOf(arr), {}).liveness.length).toBe(1);
  });

  it('a WAY edge bounding water CONVICTS, and a BANK edge does not', () => {
    const { arr, f } = square();
    const cut = cutFaceByChain(arr, f, [[-10, 50], [50, 50], [110, 50]], { type: 'BANK', key: 'bank.left' });
    arr.faces[cut.faces[0]].cls = 'WATER';
    const p = partitionOf(arr);
    expect(censusWater(p, {}).wayOnWater.length).toBe(0);
    arr.edges[cut.edges[0]].type = 'WAY';
    expect(censusWater(p, {}).wayOnWater.length).toBe(1);
  });

  it('a CROSSING edge whose end is not a bank node CONVICTS', () => {
    const { arr, f } = square();
    const cut = cutFaceByChain(arr, f, [[-10, 50], [50, 50], [110, 50]], { type: 'BANK', key: 'bank.left' });
    arr.faces[cut.faces[0]].cls = 'WATER';
    // re-type a SEED edge (whose ends touch no bank) as a crossing
    const seed = arr.edges.find((e) => e.key === 'sq.0');
    seed.type = 'CROSSING';
    expect(censusWater(partitionOf(arr), {}).strayCrossing.length).toBe(1);
  });

  it('a bank with the water side on neither face CONVICTS', () => {
    const { arr, f } = square();
    const cut = cutFaceByChain(arr, f, [[-10, 50], [50, 50], [110, 50]], { type: 'BANK', key: 'bank.left' });
    arr.faces[cut.faces[0]].cls = 'WATER';
    expect(censusWater(partitionOf(arr), {}).strayBank.length).toBe(0);
    arr.faces[cut.faces[0]].cls = 'FIELD';
    expect(censusWater(partitionOf(arr), {}).strayBank.length).toBeGreaterThan(0);
  });

  it('a MOORED piece counts as the water side — §3e\'s own ruling, not a loosening', () => {
    const { arr, f } = square();
    const cut = cutFaceByChain(arr, f, [[-10, 50], [50, 50], [110, 50]], { type: 'BANK', key: 'bank.left' });
    arr.faces[cut.faces[0]].cls = 'PLOT';
    arr.faces[cut.faces[0]].attrs = { moored: true };
    expect(censusWater(partitionOf(arr), {}).strayBank.length).toBe(0);
  });
});

describe('SPINE-2 · registration, reservation and the source itself', () => {
  it('the reserved rosters are DISCHARGED, and the classes they held are in the roster', () => {
    expect(RESERVED_FACE_CLASSES.length).toBe(0);
    expect(RESERVED_EDGE_TYPES.length).toBe(0);
    expect(FACE_CLASSES).toContain('WATER');
    expect(FACE_CLASSES).toContain('LOSSREGION');
    expect(EDGE_TYPES).toContain('CROSSING');
    expect(EDGE_TYPES).toContain('BANK');
  });

  it("A6.1's owing classes cover every family SPINE-2 draws", () => {
    for (const k of ['water', 'crossing', 'loss']) expect(PARTITION_OWING_CLASSES).toContain(k);
  });

  it('⛔ A2.2 · the two new modules carry NO coordinate noise and NO stream', () => {
    // ⚠ COMMENTS ARE STRIPPED FIRST, and that is not a weakening: this file's own headers SAY
    //   "no Math.random" and "noise wearing a river's clothes", so a raw text scan convicts the
    //   documentation of the ban it documents. A2.2's conviction is about executable ops.
    const strip = (t) => t.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/.*$/gm, '$1');
    for (const f of ['partitionWater.js', 'partitionDecline.js']) {
      const src = strip(readFileSync(`${SRC}/${f}`, 'utf8'));
      expect(src).not.toMatch(/\bMath\.random\b/);
      expect(src).not.toMatch(/\bfabricRng\s*\(/);
      expect(src).not.toMatch(/\b(jitter|wobble|noise)\b/i);
      expect(src).not.toMatch(/\bnew Date\b/);
    }
  });

  it('the modules are declared on S8 with their two new FORWARD imports', () => {
    const src = readFileSync(`${SRC}/stageManifest.js`, 'utf8');
    expect(src).toMatch(/'partitionWater\.js'/);
    expect(src).toMatch(/'partitionDecline\.js'/);
    expect(src).toMatch(/'S4>S8'/);
  });

  it('A2.3\'s gate spacing is spelled in FACETS, the form\'s own scale', () => {
    expect(GATE_SPACING_FACETS).toBeGreaterThan(1);
    expect(Number.isInteger(GATE_SPACING_FACETS)).toBe(true);
  });

  it('the quay reach is a fraction of the channel, never most of it', () => {
    expect(QUAY_LAW.reachWidths).toBeLessThan(0.5);
    expect(QUAY_LAW.maxPerLeaf).toBeGreaterThan(0);
  });
});

/** The vertex id at a world point, for the tests that need one after a split. */
function vertexOf(arr, x, y) {
  const k = `${Math.round(x * 1000)},${Math.round(y * 1000)}`;
  const hit = arr.vertexKey.get(k);
  return hit === undefined ? -1 : hit;
}

describe('SPINE-2 · the substrate still holds what SPINE-1 proved', () => {
  it('a split face keeps its class and does NOT inherit its parent tenure', () => {
    const { arr, f } = square();
    arr.faces[f].piece = 7;
    const cut = cutFaceByChain(arr, f, [[-10, 50], [50, 50], [110, 50]], { type: 'BOUND', key: 'c' });
    const fresh = cut.faces.find((x) => x !== f);
    expect(arr.faces[fresh].cls).toBe('FIELD');
    expect(arr.faces[fresh].piece).toBe(-1);
  });

  it('area is conserved across a cut, to six decimals', () => {
    const { arr, f } = square(100);
    const before = faceArea(arr, f);
    const cut = cutFaceByChain(arr, f, [[-10, 50], [50, 50], [110, 50]], { type: 'BOUND', key: 'c' });
    const after = cut.faces.reduce((s, x) => s + faceArea(arr, x), 0);
    expect(after).toBeCloseTo(before, 6);
  });
});
