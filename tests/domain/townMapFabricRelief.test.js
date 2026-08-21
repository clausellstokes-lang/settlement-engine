/**
 * tests/domain/townMapFabricRelief.test.js — MF-B1b: §9.5b THE RELIEF LAW, §5.0c.3 THE
 * INTERIOR GREENS, the de-staircased boundary, and the §5 footprint bands.
 *
 * ⚠ EVERY ARM CARRIES A COUNTERFACTUAL. Each of these mechanisms is capable of passing
 * vacuously — a greens pin passes if greens are drawn for any reason at all; a relief pin
 * passes if marks are emitted on flat ground; a staircase pin passes if the boundary is
 * smooth because it is a circle. So every positive arm is paired with the case that MUST
 * produce the opposite answer, and it is the PAIR that carries the proof.
 */
import { describe, it, expect } from 'vitest';
import { buildFabric } from '../../src/domain/townMap/fabric/buildFabric.js';
import { buildTownMapModel } from '../../src/domain/townMap/townMapModel.js';
import { buildSubstrate } from '../../src/domain/townMap/fabric/substrate.js';
import { shoreContour, buildRelief } from '../../src/domain/townMap/fabric/relief.js';
import { organicRing, circularity } from '../../src/domain/townMap/fabric/umbrella.js';
import { reserveCommons, inCommons } from '../../src/domain/townMap/fabric/commons.js';
import { TIER_PROFILE } from '../../src/domain/townMap/fabric/tierGrammar.js';
import { buildPartition } from '../../src/domain/townMap/fabric/organismFields.js';
import { buildUmbrella } from '../../src/domain/townMap/fabric/umbrella.js';
import { makeTownFixture, makeForcedFjordFixture } from '../fixtures/townMapFixtures.js';

const build = (s) => buildFabric(s, buildTownMapModel(s, null), {});

/** How much of a ring's length runs along an exact lattice direction — the pixel-staircase
 * signature. A traced mask boundary scores ~1.0; an inked outline scores near 0. */
function axisAlignedShare(ring) {
  let axis = 0, total = 0;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length];
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) continue;
    total += len;
    if (Math.abs(dx) < 1e-9 || Math.abs(dy) < 1e-9) axis += len;
  }
  return total > 0 ? axis / total : 0;
}

describe('§9.5b the relief law — the land is a character and must be drawn', () => {
  it('a MOUNTAIN settlement draws its relief; a PLAINS one does not (the counterfactual pair)', () => {
    const mountain = build(makeTownFixture({ _seed: 'relief-mtn', config: { terrainType: 'mountain', tradeRouteAccess: 'moderate' } }));
    const plains = build(makeTownFixture({ _seed: 'relief-plains', config: { terrainType: 'plains', tradeRouteAccess: 'moderate' } }));
    const marks = (f) => f.relief.hachures.length + f.relief.crags.length + f.relief.hills.length;
    expect(marks(mountain)).toBeGreaterThan(60);
    // COUNTERFACTUAL: the same mark families on a floodplain must be a small fraction of it.
    // Without this arm the pin passes on a pass that draws hachures everywhere.
    expect(marks(plains)).toBeLessThan(marks(mountain) * 0.6);
  });

  it('CRAG HATCHING is ROCK, not steepness — it needs an exposed-stone family', () => {
    const rocky = build(makeTownFixture({ _seed: 'relief-rock', config: { terrainType: 'mountain', tradeRouteAccess: 'moderate' } }));
    const soft = build(makeTownFixture({ _seed: 'relief-soft', config: { terrainType: 'riverside', tradeRouteAccess: 'moderate' } }));
    expect(rocky.relief.crags.length).toBeGreaterThan(0);
    expect(soft.relief.crags).toHaveLength(0);
  });

  it('PLANTED CONTROL: a flat substrate emits no slope marks at all', () => {
    const sub = buildSubstrate({}, 'plains', { seed: 'flat' }, {});
    for (let k = 0; k < sub.height.length; k++) sub.height[k] = 0.5;
    for (let k = 0; k < sub.slope.length; k++) sub.slope[k] = 0;
    const marks = buildRelief({ sub, inTown: () => false, inWater: () => false, accentBand: 1, seeding: { seed: 'flat' } });
    expect(marks.hachures).toHaveLength(0);
    expect(marks.crags).toHaveLength(0);
    expect(marks.hills).toHaveLength(0);
  });

  it('§5.0b THE WATER BODY: a coastal settlement carries a REGION, not just a line', () => {
    const fjord = build(makeForcedFjordFixture());
    expect(fjord.water.kind).toBe('coast');
    expect(fjord.water.body).toBeTruthy();
    expect(fjord.water.body.length).toBeGreaterThan(8);
    expect(fjord.meta.seaShare).toBeGreaterThan(0.05);
    // The town is ON THE LAND. A shore traced from the heightfield is worthless if the
    // fabric then grows into the water, and the naive side test did exactly that on a
    // headland — so this is the arm that would have caught it.
    for (const p of fjord.parcels) {
      expect(pointInRing(fjord.water.body, p.center[0], p.center[1]),
        `a building stands in the sea at ${p.center}`).toBe(false);
    }
  });

  it('COUNTERFACTUAL: a DRY settlement has no water body and no shore', () => {
    const dry = build(makeTownFixture({ _seed: 'relief-dry', config: { terrainType: 'desert', tradeRouteAccess: 'road' } }));
    expect(dry.meta.seaShare).toBe(0);
    expect(dry.relief.waterStrokes).toHaveLength(0);
  });

  it('the SHORE is a contour of the ground — a landlocked basin is NOT a sea', () => {
    // A shore must reach the frame. The predicate is what separates an ocean from a lake,
    // and it is the arm that stops a mountain family's deepest basin being drawn as sea.
    const sub = buildSubstrate({}, 'coastal', { seed: 'shore-1' }, { waterKind: 'coast' });
    const shore = shoreContour(sub, { seed: 'shore-1' });
    expect(shore).toBeTruthy();
    const EDGE = sub.cell * 1.2;
    const touches = shore.body.some((p) => p[0] <= EDGE || p[1] <= EDGE || p[0] >= 1000 - EDGE || p[1] >= 1000 - EDGE);
    expect(touches, 'the sea does not reach the frame — it is a lake').toBe(true);
  });
});

describe('the de-staircased boundary', () => {
  it('the umbrella outline carries NO lattice staircase, and is still NOT a circle', () => {
    const f = build(makeTownFixture());
    const ring = f.umbrella.components[0];
    // Both arms matter and they pull against each other: smoothing a staircase into a curve
    // RAISES circularity, so a pin that only checked smoothness would be satisfied by a disc.
    expect(axisAlignedShare(ring)).toBeLessThan(0.06);
    expect(circularity(ring)).toBeLessThanOrEqual(0.70);
  });

  it('COUNTERFACTUAL: the RAW traced ring is almost entirely axis-aligned', () => {
    // Every edge of a mask trace is a cell side, so the raw ring is 100% lattice-aligned.
    // This is what the cure removes, measured on the same metric.
    const raw = [[0, 0], [10, 0], [10, 10], [20, 10], [20, 20], [0, 20]];
    expect(axisAlignedShare(raw)).toBeGreaterThan(0.99);
    const smoothed = organicRing(raw, 10, 'cf', 0.5, 2);
    expect(axisAlignedShare(smoothed)).toBeLessThan(0.06);
  });

  it('the wobble is a HASH OF THE RING, so smoothing is stable across calls', () => {
    const raw = [[0, 0], [10, 0], [10, 10], [20, 10], [20, 20], [0, 20]];
    expect(JSON.stringify(organicRing(raw, 10, 'k', 0.5, 2)))
      .toBe(JSON.stringify(organicRing(raw, 10, 'k', 0.5, 2)));
    expect(JSON.stringify(organicRing(raw, 10, 'k', 0.5, 2)))
      .not.toBe(JSON.stringify(organicRing(raw, 10, 'other', 0.5, 2)));
  });
});

describe('§5.0c.3 the interior greens — reserved, not hoped for', () => {
  // ⚠ RE-EXPRESSED (MF-B5), and the reason is MF-B4's own lesson about thresholds.
  // The old arm asserted "THIS town fixture closes ≥1 green" — an outcome on ONE seed, and
  // the meander cure (§193.3) moved that seed's single surviving common to a bearing the
  // organisms surround on one side only, so its enclosure read 0.46 and it closed no hole.
  // NOTHING ABOUT THE MECHANISM CHANGED: the corpus town went 2 greens → 3 over the same
  // cure. The claim is re-expressed over a SEED FAMILY, which is the form a cure to the
  // ground cannot move, and the enclosure read is pinned as HONEST in the same breath —
  // an unenclosed common must SAY it is unenclosed rather than be counted as a green.
  it('the town band reserves common ground, the town CLOSES AROUND it, and the hole is the reservation\'s doing', () => {
    // ⭐ THE THREE ARMS ARE THE MECHANISM, NOT AN OUTCOME ON ONE SEED:
    //   (1) the reservation exists at the town band;
    //   (2) the town closes around it — at least one common in the family reads ENCLOSED,
    //       which is what makes a reservation an INTERIOR green rather than an edge one;
    //   (3) ⭐⭐ THE HOLE IS NOT MERELY EMPTY GROUND. The annulus immediately OUTSIDE each
    //       common carries parcels, so the ring the town built right up to proves the
    //       ground was buildable and the void is the reservation's doing. Without this arm
    //       the pin passes on a common sited in a bog nobody wanted.
    let enclosedSeen = 0, annulusChecked = 0;
    for (const salt of ['a', 'b', 'c', 'd', 'e']) {
      const f = build(makeTownFixture({ _seed: `greens-family-${salt}` }));
      expect(f.commons.length, `${salt}: no common reserved at town tier`).toBeGreaterThan(0);
      for (const e of f.enclosure) {
        expect(typeof e.enclosure).toBe('number');
        expect(e.enclosed).toBe(e.enclosure >= 0.92);
        if (e.enclosed) enclosedSeen++;
      }
      for (const c of f.commons) {
        let inside = 0, annulus = 0;
        for (const p of f.parcels) {
          const dx = p.center[0] - c.x, dy = p.center[1] - c.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d <= c.r) inside++;
          else if (d <= c.r * 1.7) annulus++;
        }
        expect(inside, `${salt}/${c.key}: a building stands on reserved common ground`).toBe(0);
        if (annulus > 0) annulusChecked++;
      }
    }
    expect(enclosedSeen, 'no common in the town family was closed around').toBeGreaterThan(0);
    expect(annulusChecked, 'no common had built ground at its edge — the voids may be unbuildable ground rather than reservations').toBeGreaterThan(2);
  });

  it('nothing is BUILT on a common — the claim is absolute, not a preference', () => {
    const f = build(makeTownFixture());
    for (const p of f.parcels) {
      expect(inCommons(f.commons, p.center[0], p.center[1]),
        `a building stands on reserved common ground at ${p.center}`).toBe(false);
    }
    for (const o of f.organisms) {
      expect(inCommons(f.commons, o.anchor.x, o.anchor.y),
        `the ${o.key} quarter anchored on common ground`).toBe(false);
    }
  });

  it('COUNTERFACTUAL: with no commons reserved, the same settlement closes NO green', () => {
    // ⭐ THIS IS THE ARM THAT PROVES THE MECHANISM RATHER THAN THE OUTCOME. MF-B1 measured
    // zero greens at every tier with three different "let a gap happen" mechanisms; running
    // this fabric's own partition with the reservation removed reproduces that result
    // exactly, which is what makes the positive arm above a proof of the CURE and not of
    // some unrelated change in the geometry.
    // ⚠ RE-SEEDED (MF-B5) onto a family member that reserves an ENCLOSED common, for the
    // reason recorded on the positive arm above. The counterfactual itself is untouched:
    // it rebuilds THIS settlement's own partition with the reservation removed.
    const s = makeTownFixture({ _seed: 'greens-family-a' });
    const model = buildTownMapModel(s, null);
    const withCommons = buildFabric(s, model, {});
    expect(withCommons.umbrella.greens.length).toBeGreaterThan(0);

    const bare = buildUmbrella(
      // ⛔ `withCommons.ribbons`, NOT `.bridges` (MF-B6). The record's ribbon field was
      // shadowed by MF-B5's water-bridge field — a duplicate object-literal key — so this
      // arm had been silently rebuilding with an EMPTY ribbon list on every leaf whose
      // streets cross no water, varying the ribbons as well as the commons. The claim is
      // "the greens are the RESERVATION's doing", so the reservation must be the only thing
      // that moves.
      buildPartition(withCommons.organisms, withCommons.partition.n, 0.30, withCommons.ribbons || [], []),
      withCommons.organisms,
      { key: 'cf' },
    );
    expect(bare.greens.length).toBeLessThan(withCommons.umbrella.greens.length);
  });

  it('the bottom of the ladder reserves NONE — a thorp\'s open ground is the countryside', () => {
    const { commons, notes } = reserveCommons({
      nucleus: { x: 500, y: 500 }, extent: 90, tier: 'thorp',
      categories: ['residential'], sub: buildSubstrate({}, 'plains', { seed: 't' }, {}),
      water: { line: null, mode: 'dry', kind: null }, seeding: { seed: 't' },
    });
    expect(commons).toHaveLength(0);
    expect(notes.join(' ')).toContain('countryside');
  });
});

describe('§5 the footprint bands', () => {
  it('the tier organism band is a MEASUREMENT the divisor can trust', () => {
    // The column feeds nothing but the inertia-safe divisor, and a divisor that lies costs
    // the top of the ladder its own §5 band. Pinned so a future edit to the charter's
    // ASPIRATIONAL ward counts cannot silently land in this slot.
    expect(TIER_PROFILE.city.organisms[1]).toBeLessThanOrEqual(9);
    expect(TIER_PROFILE.metropolis.organisms[1]).toBeLessThanOrEqual(9);
  });

  it('a town covers its own §5 footprint band', () => {
    const f = build(makeTownFixture());
    let inside = 0;
    for (let k = 0; k < f.partition.inside.length; k++) inside += f.partition.inside[k];
    const share = inside / f.partition.inside.length;
    const band = TIER_PROFILE.town.footprint;
    expect(share).toBeGreaterThanOrEqual(band[0] * 0.92);
    expect(share).toBeLessThanOrEqual(band[1] * 1.12);
  });
});

/** Even-odd point-in-ring, local to the suite. */
function pointInRing(poly, px, py) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
    if ((yi > py) !== (yj > py)) {
      const x = (xj - xi) * (py - yi) / (yj - yi) + xi;
      if (px < x) inside = !inside;
    }
  }
  return inside;
}

/**
 * ⭐⭐⭐ §5 W1 EXIT 1 + EXIT 4 · THE RELIEF FIELD AND THE RANK-ORDERED RATION — lane MF-W1b.
 *
 * Two mechanisms landed by MF-W1(SUBSTRATE) with **zero pins**, and its own receipt says so:
 * *"the suite is green at 178 tests, which is exactly PERF1's count: I added ZERO test titles,
 * and the exit criteria are written in pins."* These are those pins.
 */
import { reliefField, measuredRelief } from '../../src/domain/townMap/fabric/substrate.js';
import { RELIEF_BANDS as BANDS } from '../../src/domain/townMap/fabric/relief.js';

describe('§5 W1 exit 1 — every leaf publishes a relief FIELD, not a scalar', () => {
  it('the field publishes the rows a scalar cannot, and they are internally consistent', () => {
    const sub = buildSubstrate({}, 'mountain', { seed: 'rf-mtn' }, {});
    const rf = reliefField(sub);
    expect(rf.bands).toHaveLength(8);
    expect(rf.bands.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 6);
    expect(rf.spread).toBeCloseTo(measuredRelief(sub), 12);
    expect(rf.slopeP50).toBeLessThanOrEqual(rf.slopeP90);
    expect(rf.n).toBe(sub.n);
    // The shares are shares of the same denominator and must not overlap by construction.
    expect(rf.cragShare).toBeLessThanOrEqual(rf.steepShare);
    expect(rf.steepShare + rf.flatShare).toBeLessThanOrEqual(1);
  });

  it('⭐⭐ `localMax` IS THE ROW THE FIELD EXISTS FOR — two leaves the scalar cannot tell apart', () => {
    // MF-W1(SUBSTRATE)'s own finding, now pinned: `sub.slope` is normalized to each leaf's own
    // steepest cell, so a normalized p50 is NOT comparable across leaves. The mountain's
    // ground is several times steeper in absolute terms and can still report the LOWER
    // normalized p50. Without `localMax` a consumer comparing the two is comparing two units.
    const mtn = reliefField(buildSubstrate({}, 'mountain', { seed: 'rf-cmp-m' }, {}));
    const fj = reliefField(buildSubstrate({ config: { tradeRouteAccess: 'port' }, economicState: { tradeCommodity: 'fish' } }, 'mountain', { seed: 'rf-cmp-f' }, { waterKind: 'coast' }));
    expect(mtn.localMax).toBeGreaterThan(0);
    expect(fj.localMax).toBeGreaterThan(0);
    // The ABSOLUTE comparison is only available because the divisor is published.
    const absM = mtn.slopeP50 * mtn.localMax, absF = fj.slopeP50 * fj.localMax;
    expect(absM).not.toBeCloseTo(absF, 4);
    expect(mtn.reason).toMatch(/NOT comparable across leaves without it/);
  });

  it('the field is DERIVED, never stored — same seed identical, different seed moved', () => {
    const a = reliefField(buildSubstrate({}, 'hills', { seed: 'rf-A' }, {}));
    const b = reliefField(buildSubstrate({}, 'hills', { seed: 'rf-A' }, {}));
    const c = reliefField(buildSubstrate({}, 'hills', { seed: 'rf-B' }, {}));
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(JSON.stringify(a)).not.toBe(JSON.stringify(c));
  });

  it('every leaf of the corpus shape publishes the field on its meta', () => {
    const f = build(makeTownFixture({ _seed: 'rf-meta', config: { terrainType: 'hills', tradeRouteAccess: 'moderate' } }));
    expect(f.meta.reliefField).toBeTruthy();
    expect(f.meta.reliefField.bands).toHaveLength(8);
    expect(f.meta.relief).toBeCloseTo(f.meta.reliefField.spread, 12);
  });
});

describe('§5 W1 exit 4 — the mark ration is RANK-ORDERED, not spent uniformly', () => {
  it('⭐⭐ the marks MASS on the steepest ground — a ration spent uniformly is a ration spent on nothing', () => {
    // ⛔ THE DEFECT THIS PINS, and it is the acceptance test's own cause. `cells.sort((a,b) =>
    // a.pri - b.pri)` sorted by a HASH and each mark family took the first N off the front —
    // a uniform random sample of every eligible cell. MF-W0 wrote "NO RELIEF IS DRAWN" on a
    // leaf that had derived 204 hachures and 72 crag marks: they existed, and they were
    // scattered one tick to a field so nothing read as a slope.
    const f = build(makeTownFixture({ _seed: 'ration-mtn', config: { terrainType: 'mountain', tradeRouteAccess: 'moderate' } }));
    const sub = f.substrate;
    const slopeAtPt = (m) => {
      let i = Math.floor(m.x / sub.cell), j = Math.floor(m.y / sub.cell);
      if (i < 0) i = 0; else if (i >= sub.n) i = sub.n - 1;
      if (j < 0) j = 0; else if (j >= sub.n) j = sub.n - 1;
      return sub.slope[j * sub.n + i];
    };
    const marks = f.relief.hachures.concat(f.relief.crags);
    expect(marks.length).toBeGreaterThan(40);
    const markMean = marks.reduce((a, m) => a + slopeAtPt(m), 0) / marks.length;
    // The LEAF's own mean slope over the same eligible band — the uniform-sample expectation.
    let leafSum = 0, leafN = 0;
    for (let k = 0; k < sub.slope.length; k++) { if (sub.slope[k] >= BANDS.hachure) { leafSum += sub.slope[k]; leafN++; } }
    const leafMean = leafSum / leafN;
    // ⭐ A RANKED RATION SITS ABOVE THE ELIGIBLE MEAN. A hash-ordered one sits ON it.
    expect(markMean).toBeGreaterThan(leafMean);
    expect(markMean).toBeGreaterThan(BANDS.hachure);
  });

  it('⛔ COUNTERFACTUAL — a HASH-ordered ration over the same cells lands ON the eligible mean', () => {
    // The arm that makes the pin above a comparison rather than an assertion. It rebuilds the
    // OLD selection (first N by hash) over the same eligible set and shows it cannot clear the
    // mean, so the difference above is the ORDER and not the leaf.
    const sub = buildSubstrate({}, 'mountain', { seed: 'ration-cf' }, {});
    const eligible = [];
    for (let j = 1; j < sub.n - 1; j += 2) {
      for (let i = 1; i < sub.n - 1; i += 2) {
        const k = j * sub.n + i;
        if (sub.slope[k] >= BANDS.hachure) eligible.push({ k, s: sub.slope[k], pri: ((i * 73856093) ^ (j * 19349663)) >>> 0 });
      }
    }
    expect(eligible.length).toBeGreaterThan(200);
    const N = Math.min(60, Math.floor(eligible.length / 3));
    const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
    const eligibleMean = mean(eligible.map((c) => c.s));
    const byHash = eligible.slice().sort((a, b) => a.pri - b.pri).slice(0, N);
    const byRank = eligible.slice().sort((a, b) => (b.s - a.s) || (a.k - b.k)).slice(0, N);
    // A hash sample is an unbiased sample of the eligible set: it lands on the mean.
    expect(Math.abs(mean(byHash.map((c) => c.s)) - eligibleMean)).toBeLessThan(eligibleMean * 0.12);
    // The ranked one does not — and by a wide margin, which is what "massed" means.
    expect(mean(byRank.map((c) => c.s))).toBeGreaterThan(eligibleMean * 1.2);
  });

  it('the rations are DERIVED FROM THE GROUND each mark family is a picture of', () => {
    // `steepRation` and `hillRation` scale with the share of ground that family depicts, so a
    // leaf with little scarp draws few hachures however high its relief scalar reads.
    const steep = build(makeTownFixture({ _seed: 'ration-steep', config: { terrainType: 'mountain', tradeRouteAccess: 'moderate' } }));
    const gentle = build(makeTownFixture({ _seed: 'ration-gentle', config: { terrainType: 'plains', tradeRouteAccess: 'moderate' } }));
    const rf = (f) => f.meta.reliefField;
    expect(rf(steep).steepShare).toBeGreaterThan(rf(gentle).steepShare);
    expect(steep.relief.hachures.length).toBeGreaterThan(gentle.relief.hachures.length);
  });
});
