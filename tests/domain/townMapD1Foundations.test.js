/**
 * tests/domain/townMapD1Foundations.test.js — ⭐⭐⭐ MF-D1 · THE FOUNDATIONS' OWN PINS.
 *
 * Four artifacts land in this wave and each one owes a proof that is a MEASUREMENT rather than a
 * restatement of its own docstring:
 *
 *   §287.5  the versioned integer coordinate ABI      — and the TIE RULE it refuses to change
 *   §287.5  exact solid legality                       — and the two rejected predicates, convicted
 *   §287.4  the spatial-receipt seam                   — and the same-pass refusal, as arithmetic
 *   §287.8  the DCEL's face/adjacency/point-location   — on shapes the codex contract cannot hold
 *
 * ⚠ EVERY ARM HERE IS READ-SIDE. Nothing in this file, and nothing it imports, is reachable from
 * `buildFabric`; the wave's byte-identity attribution is what proves that and it reads 0 of 170.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  COORDINATE_ABI, COORDINATE_ABI_VERSION, GEOMETRY_QUANTUM, MAX_WORLD_UNITS, ROUNDING_RULE,
  heightQ, isNegativeZeroText, pointQ, reconcilesToTopologyText, ringText, topologyTextOf, worldQ,
} from '../../src/domain/townMap/fabric/coordinateAbi.js';
import { q6, polygonIntersectionArea, triangulateSimple, triangulationIsSound, isConvexRing,
  pointLocateRing } from '../../src/domain/townMap/fabric/fabricGeometry.js';
import { overlapping } from '../../src/domain/townMap/fabric/groundLaw.js';
import { dualRunLegality, intervalOverlapVerdict, planEraSolid, solidOverlap }
  from '../../src/domain/townMap/fabric/solidLegality.js';
import { canonicalSpatial, noEffectDiagnostic, spatialEffectReceipt, spatialRef,
  NON_SPATIAL_FIELDS, SPATIAL_FIELDS } from '../../src/domain/townMap/fabric/spatialReceipt.js';
import { buildBoundaryArrangement, derivePlanarDcel, faceAdjacency, faceRing, locateFace }
  from '../../src/domain/townMap/fabric/fabricDcel.js';
import { legacySubstrateForkKey, fabricForkKey } from '../../src/domain/townMap/fabric/fabricRng.js';
import { governSurface, parcelsText, waterText } from '../../src/domain/townMap/fabric/publication.js';
import { buildFabric } from '../../src/domain/townMap/fabric/buildFabric.js';
import { buildTownMapModel } from '../../src/domain/townMap/townMapModel.js';
import { makeWalledFixture } from '../fixtures/townMapFixtures.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const FABRIC = join(HERE, '../../src/domain/townMap/fabric');

/** A boundary set built by hand, so the DCEL's arms test the DCEL and not the fabric. */
function segsOf(pairs, role = 'WALL_FACE') {
  return {
    artifactKind: 'CADASTRAL_BOUNDARY_ARRANGEMENT',
    boundaries: pairs.map(([a, b], i) => ({
      boundaryId: `b${i}`, geometry: [[worldQ(a[0]), worldQ(a[1])], [worldQ(b[0]), worldQ(b[1])]],
      role, sourceId: `s${i}`,
    })),
  };
}
const ringSegs = (pts) => pts.map((p, i) => [p, pts[(i + 1) % pts.length]]);

describe('§287.5 · the coordinate ABI is INTEGER, VERSIONED, and does not re-round', () => {
  it('the ABI record is complete and the version is an explicit constant', () => {
    expect(COORDINATE_ABI_VERSION).toBe(1);
    expect(COORDINATE_ABI.abiVersion).toBe(COORDINATE_ABI_VERSION);
    expect(COORDINATE_ABI.geometryQuantum).toEqual({ numerator: 1, denominator: 1000000 });
    expect(COORDINATE_ABI.canonicalRingOrientation).toBe('CCW_OUTER_CW_HOLE');
    expect(COORDINATE_ABI.boundaryRule).toBe('CLOSED');
    expect(COORDINATE_ABI.hashEncoding).toBe('DOMAIN_SEPARATED_CANONICAL_BYTES');
    // ⚠ the y-axis caveat travels WITH the record, not in prose somewhere else
    expect(COORDINATE_ABI.viewToWorldYFlipApplied).toBe(false);
  });

  it('⭐⭐⭐ THE TIE RULE — the ABI integer is READ OUT OF q6, and `Math.round(v*1e6)` DIVERGES', () => {
    // ⛔ THE THREE CASES ARE REAL AND TWO OF THEM ARE EXACT TIES ON EXACTLY REPRESENTABLE
    // DOUBLES. If the ABI re-rounded, the corpus's published six-decimal keys and its integer
    // coordinates would disagree about the same point — which is a hash column that moves for
    // no geometric reason.
    for (const [v, want] of [[-1 / 128, -7813], [-3 / 128, -23438], [1000.1234565, 1000123456]]) {
      expect(worldQ(v), `${v}`).toBe(want);
      expect(Math.round(v * 1e6), `${v} — the naive spelling must DIFFER`).not.toBe(want);
    }
    expect(ROUNDING_RULE.tieBreak).toBe('HALF_AWAY_FROM_ZERO');
    expect(ROUNDING_RULE.reRounded).toBe(false);
    // …and the two agree everywhere a tie is not involved, which is what makes it a WRAP
    for (const v of [0, 1, -1, 0.5, 123.456789, -123.456789]) {
      expect(worldQ(v)).toBe(Math.round(v * 1e6));
    }
  });

  it('the fixed-precision topology key reconciles to the ABI as an IDENTITY', () => {
    for (const v of [0, 1, -1, 0.5, 1 / 128, -1 / 128, 999.999999, -999.999999, 1e-7]) {
      expect(reconcilesToTopologyText(v), `${v}`).toBe(true);
      expect(topologyTextOf(worldQ(v))).toBe(q6(v));
    }
    expect(worldQ(NaN)).toBe(null);
    expect(worldQ(Infinity)).toBe(null);
  });

  it('⛔ the ONE place the legacy text is not canonical: it has TWO spellings of zero', () => {
    // `toFixed` strips the sign before rounding and puts it back, so a value rounding to zero
    // from below publishes "-0.000000". The ABI has one zero, because an integer has one zero.
    expect(q6(-1e-7)).toBe('-0.000000');
    expect(q6(1e-7)).toBe('0.000000');
    expect(isNegativeZeroText(-1e-7)).toBe(true);
    expect(worldQ(-1e-7)).toBe(0);
    expect(worldQ(1e-7)).toBe(0);
    expect(topologyTextOf(0)).toBe('0.000000');
    // the reconciliation names the exception rather than pretending it away
    expect(reconcilesToTopologyText(-1e-7)).toBe(true);
  });

  it('the safe-integer bound is proved, and heightQ REFUSES rather than guessing', () => {
    expect(MAX_WORLD_UNITS).toBe(Math.floor(Number.MAX_SAFE_INTEGER / GEOMETRY_QUANTUM.denominator));
    expect(Number.isSafeInteger(worldQ(MAX_WORLD_UNITS))).toBe(true);
    // the corpus's own measured maximum is 1,286.63 — six orders of magnitude of headroom
    expect(MAX_WORLD_UNITS / 1287).toBeGreaterThan(1e6);
    expect(() => heightQ(1)).toThrow(/UNEXERCISED/);
    expect(pointQ([1, -1])).toEqual([1000000, -1000000]);
    expect(ringText([[0, 0], [1, 0]])).toBe('0,0;1000000,0');
  });
});

describe('§287.5 / §299.3(a) · volume legality by EXACT solid intersection', () => {
  const sq = (x, y, w = 10) => [[x, y], [x + w, y], [x + w, y + w], [x, y + w]];

  it('the exact predicate is area-true, and an ABUTMENT is not an overlap', () => {
    expect(polygonIntersectionArea(sq(0, 0), sq(5, 5))).toBe(25);
    expect(polygonIntersectionArea(sq(0, 0), sq(10, 0))).toBe(0);   // shared edge = party wall
    expect(polygonIntersectionArea(sq(0, 0), sq(0, 0))).toBe(100);
    const L = [[0, 0], [10, 0], [10, 4], [4, 4], [4, 10], [0, 10]];
    expect(isConvexRing(L)).toBe(false);
    expect(polygonIntersectionArea(L, sq(0, 0))).toBe(64);
    expect(triangulationIsSound(L, triangulateSimple(L))).toBe(true);
  });

  it('⛔⛔ THE INTERVAL PREDICATE IS CONVICTED BY A SHAPE THE FABRIC ACTUALLY BUILDS', () => {
    // An L-shaped range and a body tucked into its notch. Their axis-aligned extents overlap;
    // their solids do not share one unit of area. §287.5 forbids the interval test by name and
    // this is the counterexample that makes the ban a measurement.
    const L = planEraSolid('range', 'ground', [[0, 0], [10, 0], [10, 4], [4, 4], [4, 10], [0, 10]]);
    const notch = planEraSolid('cottage', 'ground', [[5, 5], [9, 5], [9, 9], [5, 9]]);
    expect(intervalOverlapVerdict(L, notch)).toBe('OVERLAPPING');       // ⛔ the wrong answer
    const exact = solidOverlap(L, notch);
    expect(exact.kind).toBe('PLANAR_ONLY');
    expect(exact.sharedAreaQ).toBe(0);
    expect(exact.verdict).toBe('DISJOINT_OR_ABUTTING');                  // ⭐ the right one
  });

  it('⛔ collision-by-identity is REFUSED, and so is a cross-support comparison', () => {
    const a = planEraSolid('same', 'ground', sq(0, 0));
    expect(solidOverlap(a, a).kind).toBe('REFUSED');
    expect(solidOverlap(a, a).reason).toBe('SAME_SOLID_ID');
    const bridge = planEraSolid('bridge', 'deck', sq(0, 0));
    expect(solidOverlap(a, bridge).reason).toBe('DIFFERENT_SUPPORT_SURFACE');
  });

  it('the VOLUME branch arrives without changing the contract, and the Z rule is exclusive', () => {
    const lower = { ...planEraSolid('a', 'g', sq(0, 0)), vertical: { kind: 'INTERVAL', baseQ: 0, topQ: 5 } };
    const upper = { ...planEraSolid('b', 'g', sq(0, 0)), vertical: { kind: 'INTERVAL', baseQ: 5, topQ: 9 } };
    const stacked = solidOverlap(lower, upper);
    expect(stacked.kind).toBe('VOLUME');
    expect(stacked.sharedAreaQ).toBe(100);
    expect(stacked.sharedHeightQ).toBe(0);          // [0,5) and [5,9) are disjoint
    expect(stacked.verdict).toBe('DISJOINT_OR_ABUTTING');
    const through = { ...upper, vertical: { kind: 'INTERVAL', baseQ: 3, topQ: 9 } };
    expect(solidOverlap(lower, through).sharedVolumeQ).toBe(200);
  });

  it('⭐ THE DUAL-RUN against the incumbent §17 boolean, on a set built to disagree', () => {
    const L = planEraSolid('range', 'g', [[0, 0], [10, 0], [10, 4], [4, 4], [4, 10], [0, 10]]);
    const notch = planEraSolid('cottage', 'g', [[5, 5], [9, 5], [9, 9], [5, 9]]);
    const over = planEraSolid('overprint', 'g', [[2, 2], [8, 2], [8, 8], [2, 8]]);
    const r = dualRunLegality([L, notch, over], overlapping);
    expect(r.pairs).toBe(3);
    // the interval test claims a collision the exact predicate refuses
    expect(r.intervalFalsePositive).toBeGreaterThan(0);
    // and the incumbent boolean agrees with the exact predicate on this set — which is the
    // honest result: §17's predicate is not WRONG, it is UNQUANTIFIED.
    expect(r.legacyFalsePositive).toBe(0);
    // TWO of the three pairs genuinely share area; only the notch pair does not, and it is the
    // one the interval test gets wrong.
    expect(r.exactOverlapping).toBe(2);
    expect(r.intervalOverlapping).toBe(3);
  });
});

describe('§287.4 · the spatial-receipt seam refuses same-pass feedback BY CONSTRUCTION', () => {
  const spatial = () => canonicalSpatial({ walls: [], channels: [], water: null }, 10);

  it('the spatial digest is built from a NAMED roster, not from the object', () => {
    const s = spatial();
    expect(s.artifactKind).toBe('CANONICAL_SPATIAL');
    expect(s.fieldRoster).toEqual(SPATIAL_FIELDS);
    for (const f of NON_SPATIAL_FIELDS) expect(SPATIAL_FIELDS).not.toContain(f);
    // ⭐ A PROJECTION CHANGE MAY NOT MOVE THE SPATIAL DIGEST — §10.1's whole point, executed.
    const base = { walls: [], channels: [], water: null };
    const painted = { ...base, immersion: { ink: 'heavy' }, lod: { masses: [1, 2, 3] }, meta: { x: 1 } };
    expect(canonicalSpatial(painted, 10).spatialHash).toBe(canonicalSpatial(base, 10).spatialHash);
    // …and a DURABLE change must move it, or the digest is measuring nothing
    const moved = { ...base, channels: [{ key: 'c1', line: [[0, 0], [1, 1]] }] };
    expect(canonicalSpatial(moved, 10).spatialHash).not.toBe(canonicalSpatial(base, 10).spatialHash);
  });

  it('⛔⛔ a receipt dated for the pass that produced it CANNOT BE CONSTRUCTED', () => {
    const s = spatial();
    const mk = (effectiveAt) => spatialEffectReceipt({
      kind: 'ACCESS', temporalMode: 'STATIC_POTENTIAL', sourceSpatialRef: spatialRef(s),
      payload: { originId: 'a', destinationId: 'b', traversable: true },
      sourceIds: ['a'], affectedIds: ['b'], observedAt: 10, effectiveAt,
      dependencies: [{ role: 'SPATIAL', contentHash: s.spatialHash }, { role: 'LAW', contentHash: 'law' }],
    });
    expect(() => mk(10)).toThrow(/STRICTLY later/);
    expect(() => mk(9)).toThrow(/STRICTLY later/);
    expect(mk(11).effectiveAt).toBe(11);
  });

  it('the dependency roster is CLOSED by kind and branch, in order', () => {
    const s = spatial();
    const mk = (deps) => spatialEffectReceipt({
      kind: 'ACCESS', temporalMode: 'STATIC_POTENTIAL', sourceSpatialRef: spatialRef(s),
      payload: {}, sourceIds: ['a'], affectedIds: ['b'], observedAt: 1, effectiveAt: 11,
      dependencies: deps,
    });
    const ok = [{ role: 'SPATIAL', contentHash: 'x' }, { role: 'LAW', contentHash: 'y' }];
    expect(mk(ok).orderedDependencies).toHaveLength(2);
    expect(() => mk([ok[1], ok[0]])).toThrow(/requires exactly/);            // wrong ORDER
    expect(() => mk([...ok, { role: 'OBSERVATION', contentHash: 'z' }])).toThrow(/requires exactly/);
    expect(() => mk([ok[0]])).toThrow(/requires exactly/);
    // a kind with no such branch is refused rather than coerced
    expect(() => spatialEffectReceipt({
      kind: 'SHADE_EXPOSURE', temporalMode: 'STATIC_POTENTIAL', sourceSpatialRef: spatialRef(s),
      payload: {}, sourceIds: ['a'], affectedIds: ['b'], observedAt: 1, effectiveAt: 11,
      dependencies: ok,
    })).toThrow(/no 'STATIC_POTENTIAL' branch/);
  });

  it('a no-effect result is a DIAGNOSTIC, never an empty causal receipt', () => {
    const s = spatial();
    expect(() => spatialEffectReceipt({
      kind: 'ACCESS', sourceSpatialRef: spatialRef(s), payload: {},
      sourceIds: [], affectedIds: [], observedAt: 1, effectiveAt: 11,
      dependencies: [{ role: 'SPATIAL', contentHash: 'x' }, { role: 'LAW', contentHash: 'y' }],
    })).toThrow(/NONEMPTY/);
    const d = noEffectDiagnostic('ACCESS', spatialRef(s), ['a', 'b'], 1);
    expect(d.artifactKind).toBe('SPATIAL_EFFECT_DIAGNOSTIC');
    expect(d.result).toBe('NO_EFFECT');
  });

  it('⭐ THE SOURCE SCAN — no fabric module writes to the world, the dossier or the economy', () => {
    // §287.4's forbidden shape is a map pass that feeds the economy it read. The fabric layer is
    // a pure projection today and this is the scan that keeps it one. Comments are stripped, so
    // a rule NAMED in prose is never a rule BROKEN in code.
    const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
    const offenders = [];
    for (const f of readdirSync(FABRIC).sort()) {
      if (!f.endsWith('.js')) continue;
      const src = strip(readFileSync(join(FABRIC, f), 'utf8'));
      // an assignment INTO the dossier/world/economy, or any persistence call
      if (/\b(settlement|world|worldState|dossier|economicState|resourceAnalysis)\s*(\.\w+)+\s*=[^=]/.test(src)) offenders.push(`${f}: writes the dossier`);
      if (/\b(localStorage|sessionStorage|indexedDB|supabase|writeFileSync|fetch)\s*[.(]/.test(src)) offenders.push(`${f}: persists`);
    }
    expect(offenders).toEqual([]);
    // ⛔ NON-VACUOUS: the shapes it forbids are detected when present.
    expect(/\b(settlement|world)\s*(\.\w+)+\s*=[^=]/.test('  settlement.economicState.x = 1;')).toBe(true);
    expect(/\b(localStorage)\s*[.(]/.test('localStorage.setItem(1)')).toBe(true);
  });
});

describe('§287.8 / §10.15 · the DCEL holds shapes the codex contract cannot', () => {
  it('a square cut by a cross gives four bounded faces, one outer, and Euler closes', () => {
    const arr = segsOf([
      ...ringSegs([[0, 0], [10, 0], [10, 10], [0, 10]]).map(([a, b]) => [a, b]),
      [[5, 0], [5, 10]], [[0, 5], [10, 5]],
    ]);
    // the hand-made set is not noded; the module's own noder is what the fabric path uses, so
    // this fixture pre-nodes by hand to test the EMBEDDING rather than the noder.
    const pre = segsOf([
      [[0, 0], [5, 0]], [[5, 0], [10, 0]], [[10, 0], [10, 5]], [[10, 5], [10, 10]],
      [[10, 10], [5, 10]], [[5, 10], [0, 10]], [[0, 10], [0, 5]], [[0, 5], [0, 0]],
      [[5, 0], [5, 5]], [[5, 5], [5, 10]], [[0, 5], [5, 5]], [[5, 5], [10, 5]],
    ]);
    const dc = derivePlanarDcel(pre);
    const bounded = dc.faces.filter((f) => f.faceKind === 'BOUNDED');
    expect(bounded).toHaveLength(4);
    expect(dc.outerFaceIds).toHaveLength(1);
    expect(dc.componentCount).toBe(1);
    const V = dc.vertices.length, E = dc.halfEdges.length / 2, F = dc.faces.length;
    expect(V - E + F).toBe(1 + dc.componentCount);
    // every bounded face is a quarter of the square
    for (const f of bounded) expect(Number(f.area2) / 2).toBe(25 * 1e12);
    // ADJACENCY: each quarter touches two siblings and the outer face
    const adj = faceAdjacency(dc);
    for (const f of bounded) expect(adj.get(f.faceId).size).toBe(3);
    expect(arr.boundaries.length).toBeGreaterThan(0);
  });

  it('POINT LOCATION obeys the ABI\'s CLOSED boundary rule', () => {
    const pre = segsOf(ringSegs([[0, 0], [10, 0], [10, 10], [0, 10]]));
    const dc = derivePlanarDcel(pre);
    expect(locateFace(dc, 5, 5).kind).toBe('INSIDE');
    expect(locateFace(dc, 0, 5).kind).toBe('BOUNDARY');
    expect(locateFace(dc, 20, 20).kind).toBe('OUTER');
    // the ring the face reports is the ring the point was tested against
    const inside = locateFace(dc, 5, 5);
    const f = dc.faces.find((z) => z.faceId === inside.faceId);
    expect(pointLocateRing(faceRing(dc, f), worldQ(5), worldQ(5), 0.5)).toBe('INSIDE');
  });

  it('⭐⭐ A FOSSIL RING IS A HOLE, and the codex face record cannot hold one', () => {
    const outer = ringSegs([[0, 0], [40, 0], [40, 40], [0, 40]]);
    const inner = ringSegs([[10, 10], [20, 10], [20, 20], [10, 20]]);
    const dc = derivePlanarDcel(segsOf([...outer, ...inner]));
    // two components (the rings do not touch), so TWO outer cycles — and the codex's single
    // `outerFaceId` would name one of them arbitrarily.
    expect(dc.componentCount).toBe(2);
    expect(dc.outerFaceIds).toHaveLength(2);
    expect(dc.faces.filter((f) => f.faceKind === 'BOUNDED')).toHaveLength(2);
    // a point in the annulus is in the LARGER face; a point in the fossil is in the SMALLER
    expect(locateFace(dc, 5, 5).kind).toBe('INSIDE');
    const inFossil = locateFace(dc, 15, 15);
    expect(inFossil.kind).toBe('INSIDE');
    // the smallest containing cycle wins — the fossil, not the circuit that encloses it
    const chosen = dc.faces.find((z) => z.faceId === inFossil.faceId);
    const other = dc.faces.find((z) => z.faceKind === 'BOUNDED' && z.faceId !== chosen.faceId);
    expect(chosen.area2 < other.area2).toBe(true);
    // FOUR cycles contain the fossil's centre — each ring contributes a bounded walk AND an
    // outer walk of equal magnitude — and the smallest BOUNDED one is chosen. That tie-break is
    // load-bearing: without it point location would depend on hash order.
    expect(inFossil.faces.length).toBe(4);
    expect(chosen.faceKind).toBe('BOUNDED');
  });

  it('⛔ AN OPEN CHAIN IS TYPED, NOT THROWN — the half-ring bankside case', () => {
    const dc = derivePlanarDcel(segsOf([[[0, 0], [10, 0]], [[10, 0], [10, 10]]]));
    expect(dc.degenerateFaces).toBe(1);
    expect(dc.faces.filter((f) => f.faceKind === 'BOUNDED')).toHaveLength(0);
    expect(dc.faces[0].area2).toBe(0n);
    // the codex kernel's rule, quoted as the divergence it is: it throws
    // `DCEL face must have nonzero signed area` on exactly this input.
    expect(dc.faces[0].faceKind).toBe('DEGENERATE');
  });

  it('the arrangement quantizes through the ABI and reports its own noding residual', () => {
    const fab = { channels: [{ key: 'a', rank: 'artery', width: 2, line: [[0, 5], [10, 5]] },
      { key: 'b', rank: 'artery', width: 2, line: [[5, 0], [5, 10]] }], walls: [], water: null };
    const arr = buildBoundaryArrangement(fab);
    expect(arr.coordinateAbiVersion).toBe(COORDINATE_ABI_VERSION);
    expect(arr.boundaries.every((b) => b.geometry.every((p) => p.every(Number.isSafeInteger)))).toBe(true);
    expect(arr.residualProperCrossings).toBe(0);
    expect(arr.splitCount).toBeGreaterThan(0);       // the two kerb pairs really do cross
    expect(arr.cliffEdges).toBe(0);                  // declared and EMPTY, never invented
  });
});

describe('§297.4c · the substrate salt has ONE home and its text is FROZEN', () => {
  it('the legacy composer emits exactly what substrate.js used to build itself', () => {
    expect(legacySubstrateForkKey('S', 0)).toBe('S::substrate');
    expect(legacySubstrateForkKey('S', 3)).toBe('S::substrate::variant:3');
    expect(legacySubstrateForkKey('S')).toBe('S::substrate');
  });

  it('⛔⛔ IT IS DELIBERATELY *NOT* `fabricForkKey`, and the difference is the declared shift', () => {
    // Converting it re-rolls the heightfield on every leaf at every variant. The pin exists so a
    // later lane cannot make that change by accident and call it a refactor.
    expect(legacySubstrateForkKey('S', 3)).not.toBe(fabricForkKey('S', 'substrate', { variant: 3 }));
    expect(fabricForkKey('S', 'substrate', { variant: 3 })).toBe('S::map-fabric:v3::variant:3::substrate::y0');
    // and there is no argument that closes the gap
    for (const opts of [{}, { variant: 0 }, { variant: 3 }, { changeYear: 0 }]) {
      expect(fabricForkKey('S', 'substrate', opts)).not.toBe(legacySubstrateForkKey('S', opts.variant));
    }
  });

  it('the substrate composes no salt of its own any more', () => {
    const src = readFileSync(join(FABRIC, 'substrate.js'), 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
    expect(src).toContain('legacySubstrateForkKey(seeding.seed, seeding.variant)');
    expect(src).not.toMatch(/::substrate\$\{/);
    expect(src).not.toMatch(/`\$\{String\(seeding\.seed\)\}::substrate/);
  });
});

describe('§297.4b · water and parcels are published through VERIFYING accessors', () => {
  it('both are getters, both return the caller\'s own object, and the key ORDER is unmoved', () => {
    const st = makeWalledFixture();
    const f = buildFabric(st, buildTownMapModel(st, null), {});
    for (const name of ['water', 'parcels']) {
      const d = Object.getOwnPropertyDescriptor(f, name);
      expect(typeof d.get, name).toBe('function');
      expect(d.enumerable, name).toBe(true);
    }
    // ⭐ IDENTITY, NOT EQUALITY — two landed counterfactuals PUSH onto `f.parcels` to prove the
    // overlap and in-street censuses are non-vacuous. A guard that copied would break them.
    expect(f.parcels).toBe(f.parcels);
    expect(f.water).toBe(f.water);
    const n = f.parcels.length;
    f.parcels.push({ key: 'planted', character: 'x', polygon: [[0, 0], [1, 0], [1, 1]] });
    expect(f.parcels.length).toBe(n + 1);
    // the published key POSITIONS are the ones the data properties held
    const keys = Object.keys(f);
    expect(keys.indexOf('water')).toBeLessThan(keys.indexOf('parcels'));
    expect(keys.indexOf('parcels')).toBeLessThan(keys.indexOf('walls'));
  }, 120000);

  it('⛔ COUNTERFACTUAL — the guard CONVICTS a surface mutated before its first read', () => {
    const parcels = [{ key: 'a', character: 'burgage', polygon: [[0, 0], [1, 0], [1, 1]] }];
    const g = governSurface(parcels, parcelsText, 'parcels');
    parcels[0].polygon[0][0] = 5;                       // the mutation a raw handle permits
    expect(() => g.read()).toThrow(/STALE OR MUTATED SURFACE/);
    // …and a surface nobody touched reads clean, and memoizes
    const clean = [{ key: 'b', character: 'burgage', polygon: [[0, 0], [1, 0], [1, 1]] }];
    const h = governSurface(clean, parcelsText, 'parcels');
    expect(h.read()).toBe(clean);
    clean[0].polygon[0][0] = 9;                         // after the first read, memoized
    expect(h.read()).toBe(clean);
  });

  it('the serializers use the ONE topology quantum and see every drawn family', () => {
    expect(waterText(null)).toBe('∅');
    expect(waterText({ mode: 'river', kind: 'river', width: 1, bankSide: 1, line: [[0, 0]], body: [] }))
      .toContain('1.000000');
    // the back house is IN the parcel fingerprint — a fingerprint blind to a drawn family
    // cannot see a change confined to it
    const a = parcelsText([{ key: 'k', character: 'c', polygon: [[0, 0]], backHouse: [[1, 1]] }]);
    const b = parcelsText([{ key: 'k', character: 'c', polygon: [[0, 0]], backHouse: [[2, 2]] }]);
    expect(a).not.toBe(b);
  });
});
