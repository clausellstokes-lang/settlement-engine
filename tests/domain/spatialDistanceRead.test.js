/**
 * spatialDistanceRead.test.js — Phase 5.5 MODULATION item 1, the pure distance
 * reader over the frozen digest.
 *
 * Property tests (the wave's latency/weight proof, per the brief's gates):
 *   - hopWeeks MONOTONE non-decreasing in path cost;
 *   - the calibration ANCHOR holds (a median-primary-hop pair ≈ 1 week) and the
 *     derivation is deterministic across rebuilds;
 *   - distanceWeight is monotone non-increasing, ≤ 1, and FLOORED (never zeroes
 *     an established channel);
 *   - the constitutional gate: activeSpatialDigest only lights with the marker.
 */
import { describe, expect, it } from 'vitest';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import {
  hopWeeks,
  distanceWeight,
  pathCost,
  calibration,
  calibrationReceipt,
  activeSpatialDigest,
  distanceLegibility,
  mappedDistanceWeight,
  MATERIAL_ATTENUATION,
  PRIMARY_HOP_WEEKS_ANCHOR,
  DISTANCE_WEIGHT_FLOOR,
  MAX_HOP_WEEKS,
  isMapped,
} from '../../src/domain/spatial/distanceRead.js';
import {
  mappedSettlementIds,
  foundingsSinceMapped,
  foundingsSinceMappedNote,
} from '../../src/domain/spatial/canonMembership.js';

function fixtureDigest(count = 8) {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placements = placeSettlements(pack, count);
  return buildSpatialDigest({ pack, placements });
}

describe('MODULATION — distanceRead', () => {
  it('derives a deterministic calibration from the digest primary-hop distribution', () => {
    const d = fixtureDigest();
    const cal = calibration(d);
    expect(cal.derived).toBe(true);
    expect(cal.primaryHopCount).toBeGreaterThan(0);
    expect(cal.medianPrimaryHopCost).toBeGreaterThan(0);
    expect(cal.weeksPerCost).toBeCloseTo(PRIMARY_HOP_WEEKS_ANCHOR / cal.medianPrimaryHopCost, 12);
    // Rebuilding the SAME fixture yields a byte-identical digest ⇒ identical calibration.
    const cal2 = calibration(fixtureDigest());
    expect(cal2).toEqual(cal);
    // calibrationReceipt is the same pure value.
    expect(calibrationReceipt(d)).toEqual(cal);
  });

  it('calibration anchor: a median-primary-hop pair rounds to the anchor weeks', () => {
    const d = fixtureDigest();
    const { weeksPerCost, medianPrimaryHopCost } = calibration(d);
    // A hop at exactly the median primary cost ⇒ round(anchor) weeks.
    const atMedian = Math.max(1, Math.min(MAX_HOP_WEEKS, Math.round(medianPrimaryHopCost * weeksPerCost)));
    expect(atMedian).toBe(PRIMARY_HOP_WEEKS_ANCHOR);
  });

  it('hopWeeks is monotone non-decreasing in path cost', () => {
    const d = fixtureDigest();
    const from = d.settlementIds[0];
    const pairs = d.settlementIds.slice(1)
      .map((to) => ({ to, cost: pathCost(d, from, to), weeks: hopWeeks(d, from, to) }))
      .filter((p) => p.cost != null)
      .sort((a, b) => a.cost - b.cost);
    for (let i = 1; i < pairs.length; i++) {
      expect(pairs[i].weeks).toBeGreaterThanOrEqual(pairs[i - 1].weeks);
      expect(pairs[i].weeks).toBeGreaterThanOrEqual(1);
      expect(pairs[i].weeks).toBeLessThanOrEqual(MAX_HOP_WEEKS);
    }
  });

  it('hopWeeks is 0 for self and null for an unreachable/absent pair', () => {
    const d = fixtureDigest();
    expect(hopWeeks(d, d.settlementIds[0], d.settlementIds[0])).toBe(0);
    expect(hopWeeks(d, d.settlementIds[0], 'nonexistent')).toBeNull();
    expect(hopWeeks(d, 'ghost', 'phantom')).toBeNull();
  });

  it('distanceWeight is monotone non-increasing, ≤ 1, and floored', () => {
    const d = fixtureDigest();
    const from = d.settlementIds[0];
    const pairs = d.settlementIds.slice(1)
      .map((to) => ({ to, cost: pathCost(d, from, to), w: distanceWeight(d, from, to) }))
      .filter((p) => p.cost != null)
      .sort((a, b) => a.cost - b.cost);
    for (const p of pairs) {
      expect(p.w).toBeLessThanOrEqual(1);
      expect(p.w).toBeGreaterThanOrEqual(DISTANCE_WEIGHT_FLOOR);
    }
    for (let i = 1; i < pairs.length; i++) {
      expect(pairs[i].w).toBeLessThanOrEqual(pairs[i - 1].w + 1e-9);
    }
  });

  it('distanceWeight: full for self, floored for unreachable (never zero)', () => {
    const d = fixtureDigest();
    expect(distanceWeight(d, d.settlementIds[0], d.settlementIds[0])).toBe(1);
    expect(distanceWeight(d, d.settlementIds[0], 'nonexistent')).toBe(DISTANCE_WEIGHT_FLOOR);
    expect(DISTANCE_WEIGHT_FLOOR).toBeGreaterThan(0);
  });

  it('distanceLegibility surfaces a phrase only for a mapped, materially-distant tie', () => {
    const d = fixtureDigest();
    const from = d.settlementIds[0];
    // Adjacent / near ties (weight ≥ threshold) surface nothing.
    const near = d.settlementIds.slice(1).find((to) => mappedDistanceWeight(d, from, to) >= MATERIAL_ATTENUATION);
    if (near) expect(distanceLegibility(d, from, near)).toBeNull();
    // The farthest reachable tie materially attenuates ⇒ a phrase with a week count.
    const far = d.settlementIds.slice(1)
      .filter((to) => pathCost(d, from, to) != null)
      .sort((a, b) => (pathCost(d, from, b) - pathCost(d, from, a)))[0];
    const leg = distanceLegibility(d, from, far);
    if (mappedDistanceWeight(d, from, far) < MATERIAL_ATTENUATION) {
      expect(leg).not.toBeNull();
      expect(leg.weeks).toBeGreaterThanOrEqual(1);
      expect(['regional', 'distant']).toContain(leg.band);
      expect(leg.phrase).toMatch(/week/);
    }
    // Unmapped ⇒ no phrase (never spuriously attenuated).
    expect(distanceLegibility(d, from, 'ghost')).toBeNull();
  });

  it('activeSpatialDigest gates on the marker + a real digest (dormancy law)', () => {
    const d = fixtureDigest();
    expect(activeSpatialDigest({ spatialCanonVersion: 1, spatialDigest: d })).toBe(d);
    // No marker ⇒ dormant even with a digest present.
    expect(activeSpatialDigest({ spatialDigest: d })).toBeNull();
    expect(activeSpatialDigest({ spatialCanonVersion: 0, spatialDigest: d })).toBeNull();
    // Marker but no usable digest ⇒ dormant.
    expect(activeSpatialDigest({ spatialCanonVersion: 1 })).toBeNull();
    expect(activeSpatialDigest({ spatialCanonVersion: 1, spatialDigest: {} })).toBeNull();
    expect(activeSpatialDigest(null)).toBeNull();
  });
});

// ── WEAVE SEAM-5 · the owed-re-canonize signal ──────────────────────────────
describe('SEAM-5 — how far behind its realm a frozen canon is', () => {
  const canonized = (count = 8) => ({ spatialCanonVersion: 1, spatialDigest: fixtureDigest(count) });

  it('⭐ agrees with isMapped on every id — the two-spellings hazard, pinned rather than promised', () => {
    // THE ONE RISK THIS LEAF CREATES. `distanceRead.isMapped` already answers "did
    // the canon map this settlement", and it could not be imported here: it lives in
    // the ~53 kB frozen-digest reader whose own docblock says it never reaches first
    // paint, and the consumer is a settings control on the first-paint side. So the
    // read was extracted rather than imported — the house leaf move — and a second
    // spelling of one membership is exactly the drift that would follow. This is the
    // pin that reds if the canon's membership field ever moves under either of them.
    const world = canonized(12);
    const ids = world.spatialDigest.settlementIds;
    const mapped = mappedSettlementIds(world);
    expect(mapped).toBeInstanceOf(Set);
    for (const id of ids) {
      expect(mapped.has(String(id))).toBe(isMapped(world.spatialDigest, id));
    }
    // …and on ids the canon never saw, both say no.
    for (const ghost of ['ghost', 's999', '']) {
      expect(mapped.has(ghost)).toBe(isMapped(world.spatialDigest, ghost));
    }
  });

  it('counts the seats the canon never saw, and only those', () => {
    const world = canonized(8);
    const mappedIds = world.spatialDigest.settlementIds.map(String);
    expect(foundingsSinceMapped(world, mappedIds)).toBe(0);
    expect(foundingsSinceMapped(world, [...mappedIds, 'new001', 'new002', 'new003'])).toBe(3);
    // A repeated id is one PLACE, so it counts once.
    expect(foundingsSinceMapped(world, [...mappedIds, 'new001', 'new001'])).toBe(1);
    // A canon that mapped a seat the campaign has since dropped is not "behind".
    expect(foundingsSinceMapped(world, mappedIds.slice(0, 3))).toBe(0);
  });

  it('an UNMAPPED realm is not a realm behind on its mapping', () => {
    // No canon ⇒ 0, never "all of them". The control says "Map geography" there and
    // counts nothing, so a count would be a sentence nobody sees and a number that
    // means the opposite of what it says.
    for (const world of [null, undefined, {}, { spatialCanonVersion: 0, spatialDigest: fixtureDigest() },
      { spatialCanonVersion: 1 }, { spatialCanonVersion: 1, spatialDigest: {} }]) {
      expect(mappedSettlementIds(world)).toBeNull();
      expect(foundingsSinceMapped(world, ['a', 'b', 'c'])).toBe(0);
      expect(foundingsSinceMappedNote(world, ['a', 'b', 'c'])).toBeNull();
    }
  });

  it('speaks the count in world words and mints no digit', () => {
    // §754.3 as the owner ruled it: abstract engine scalars die at mint, honest
    // concrete counts in world words stay. The exact sentences are pinned here so the
    // copy is proved without rendering a component — the control holds a conditional
    // and no wording of its own.
    const world = canonized(8);
    const ids = world.spatialDigest.settlementIds.map(String);
    const note = (extra) => foundingsSinceMappedNote(world, [...ids, ...extra]);

    expect(note([])).toBeNull();                       // nothing to say, so nothing said
    expect(note(['n1'])).toEqual({
      count: 1,
      phrase: 'One settlement has been founded since this realm was mapped. Re-map to bring it into the canon.',
    });
    expect(note(['n1', 'n2', 'n3'])).toEqual({
      count: 3,
      phrase: 'Three settlements have been founded since this realm was mapped. Re-map to bring them into the canon.',
    });
    // Past the closed table the word is 'several', which is honest rather than wrong.
    const many = note(Array.from({ length: 30 }, (_, i) => `n${i}`));
    expect(many.count).toBe(30);
    expect(many.phrase).toMatch(/^Several settlements have been founded/);
    // NO DIGIT ON THIS PATH, at any count.
    for (const n of [1, 2, 7, 24, 30]) {
      const phrase = note(Array.from({ length: n }, (_, i) => `x${i}`)).phrase;
      expect(phrase).toMatch(/settlements? (has|have) been founded since this realm was mapped/);
      // anchored: the positive toMatch above proves the sentence is really there, so a phrase that emptied or drifted cannot satisfy this by absence
      expect(phrase).not.toMatch(/[0-9]/);
    }
  });
});
