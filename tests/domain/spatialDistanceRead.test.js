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
} from '../../src/domain/spatial/distanceRead.js';

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
