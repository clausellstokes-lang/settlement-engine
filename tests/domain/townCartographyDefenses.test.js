/**
 * townCartographyDefenses.test.js — wall, gate and bridge WITNESSES are coherent
 * with the field, and coherent by construction rather than by inspection.
 *
 * A gate is born from `sceneSegmentIntersection` between an arterial segment and a
 * wall segment, carrying the index of that wall segment. A bridge is born the same
 * way from a street segment and a water segment. So the pins below do not check
 * "is the gate roughly near a wall"; they check that the gate lies on the SEGMENT
 * IT NAMES, to within the half-unit each coordinate loses when the exact
 * intersection is quantized to the integer plan grid. Any larger error would mean
 * the record and the geometry had come apart.
 *
 * The totality half matters as much: below the walled band there are no walls, and
 * therefore no gates, on every seed. A gate without a wall is the shape of defect
 * this slice must make unrepresentable.
 *
 * @enforced-by this file
 */
import { describe, expect, test } from 'vitest';

import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import {
  cartographyFixture,
  cartographySeedFamily,
} from '../helpers/townCartographyFixture.js';
import { synthesizeTownSkeleton } from '../../src/domain/townCartography/cartographySynthesis.js';
import {
  CARTOGRAPHY_TIERS,
  TOWN_CARTOGRAPHY_TUNING,
  cartographyTierIndex,
} from '../../src/domain/townCartography/cartographyTuning.js';
import { scenePointSegmentDistanceSq } from '../../src/domain/townScene/sceneCompilePrimitives.js';

/** The largest displacement integer quantization can introduce: half a unit on
 *  each axis, so sqrt(0.5) ~= 0.708. One plan unit is a generous ceiling and any
 *  real incoherence overshoots it by orders of magnitude. */
const QUANTIZATION_TOLERANCE = 1;

describe('a gate is on a wall, always', () => {
  test('every gate lies on the wall segment it names', () => {
    const failures = collectSeedFailures(cartographySeedFamily(), (row) => {
      const result = synthesizeTownSkeleton(cartographyFixture(row));
      for (const gate of result.infrastructureCandidates.gates) {
        const wall = result.infrastructureCandidates.walls
          .find((candidate) => candidate.id === gate.wallId);
        expect(wall, `gate ${gate.id} names a wall that does not exist`).toBeTruthy();
        const ring = wall.ring;
        const a = ring[gate.wallSegment];
        const b = ring[(gate.wallSegment + 1) % ring.length];
        const distance = Math.sqrt(
          scenePointSegmentDistanceSq(gate.position[0], gate.position[1], a, b),
        );
        expect(distance).toBeLessThanOrEqual(QUANTIZATION_TOLERANCE);
      }
    });
    expectNoSeedFailures(failures, 'no gate stands in open ground');
  });

  test('every gate names an arterial that exists in the same synthesis', () => {
    const failures = collectSeedFailures(cartographySeedFamily(), (row) => {
      const result = synthesizeTownSkeleton(cartographyFixture(row));
      const arterialIds = new Set(result.streets.arterials.map((street) => street.id));
      for (const gate of result.infrastructureCandidates.gates) {
        expect(arterialIds.has(gate.streetId)).toBe(true);
      }
    });
    expectNoSeedFailures(failures, 'a gate always belongs to a road that uses it');
  });

  test('a walled settlement really does produce gates (the pins above are not vacuous)', () => {
    const result = synthesizeTownSkeleton(cartographyFixture({ tier: 'city' }));
    expect(result.infrastructureCandidates.walls.length).toBe(1);
    expect(result.infrastructureCandidates.gates.length).toBeGreaterThan(0);
  });
});

describe('a bridge is on water, always', () => {
  test('every bridge lies on the water segment it names', () => {
    const failures = collectSeedFailures(cartographySeedFamily(), (row) => {
      const fixture = cartographyFixture(row);
      const result = synthesizeTownSkeleton(fixture);
      const waterBodies = fixture.terrain.waterBodies;
      for (const bridge of result.infrastructureCandidates.bridges) {
        const body = waterBodies[bridge.waterIndex];
        expect(body, `bridge ${bridge.id} names a water body that does not exist`).toBeTruthy();
        // The synthesis works on the segment-capped path, so containment is checked
        // against the full source polyline: a point on a capped segment is on the
        // water body either way, and this is the stricter reading.
        let best = Number.POSITIVE_INFINITY;
        for (let i = 0; i < body.path.length - 1; i += 1) {
          best = Math.min(best, scenePointSegmentDistanceSq(
            bridge.position[0], bridge.position[1], body.path[i], body.path[i + 1],
          ));
        }
        expect(Math.sqrt(best)).toBeLessThanOrEqual(QUANTIZATION_TOLERANCE);
      }
    });
    expectNoSeedFailures(failures, 'no bridge stands on dry land');
  });

  test('a dry settlement has no bridges, a watered one does (the transition)', () => {
    const watered = synthesizeTownSkeleton(cartographyFixture({ tier: 'city', site: 'river' }));
    const dry = synthesizeTownSkeleton(cartographyFixture({
      tier: 'city', site: 'plain', withWater: false,
    }));
    expect(watered.infrastructureCandidates.bridges.length).toBeGreaterThan(0);
    expect(dry.infrastructureCandidates.bridges).toEqual([]);
    // anchored: the watered sibling above proves the producer can emit bridges at
    // all, so the empty array is a measured absence rather than a dead pipeline.
    expectAbsentWithAnchor(
      dry.infrastructureCandidates.bridges.map((bridge) => bridge.id).concat(['carto:anchor']),
      'carto:bridge:0',
      'carto:anchor',
    );
  });

  test('every bridge names a street that exists in the same synthesis', () => {
    const failures = collectSeedFailures(cartographySeedFamily(), (row) => {
      const result = synthesizeTownSkeleton(cartographyFixture(row));
      const streetIds = new Set([
        ...result.streets.arterials.map((street) => street.id),
        ...result.streets.lanes.map((street) => street.id),
      ]);
      for (const bridge of result.infrastructureCandidates.bridges) {
        expect(streetIds.has(bridge.streetId)).toBe(true);
      }
    });
    expectNoSeedFailures(failures, 'a bridge always carries a road across');
  });
});

describe('the walled band is total, and no gate exists without a wall', () => {
  test('walls appear at and only at the walled band, on every tier', () => {
    const failures = collectSeedFailures(CARTOGRAPHY_TIERS, (tier) => {
      const result = synthesizeTownSkeleton(cartographyFixture({ tier, seedKey: `band-${tier}` }));
      const expected = cartographyTierIndex(tier) >= TOWN_CARTOGRAPHY_TUNING.WALLED_TIER_INDEX;
      expect(result.morphology.walled).toBe(expected);
      expect(result.infrastructureCandidates.walls.length > 0).toBe(expected);
    });
    expectNoSeedFailures(failures, 'the walled band is total over the tier ladder');
  });

  test('a settlement with no wall has no gate, on every seed', () => {
    const failures = collectSeedFailures(cartographySeedFamily(), (row) => {
      const result = synthesizeTownSkeleton(cartographyFixture(row));
      if (result.infrastructureCandidates.walls.length === 0) {
        expect(result.infrastructureCandidates.gates).toEqual([]);
      }
    });
    expectNoSeedFailures(failures, 'a gate cannot outlive its wall');
  });

  test('the unwalled case is actually exercised by the corpus (anti-vacuity)', () => {
    const unwalled = cartographySeedFamily()
      .map((row) => synthesizeTownSkeleton(cartographyFixture(row)))
      .filter((result) => result.infrastructureCandidates.walls.length === 0);
    expect(unwalled.length).toBeGreaterThan(0);
    for (const result of unwalled) expect(result.infrastructureCandidates.gates.length).toBe(0);
  });

  test('the wall ring is a closed polygon with at least three vertices, capped', () => {
    const failures = collectSeedFailures(cartographySeedFamily(), (row) => {
      const result = synthesizeTownSkeleton(cartographyFixture(row));
      for (const wall of result.infrastructureCandidates.walls) {
        expect(wall.ring.length).toBeGreaterThanOrEqual(3);
        expect(wall.ring.length).toBeLessThanOrEqual(TOWN_CARTOGRAPHY_TUNING.WALL_VERTICES);
        // A closed ring is stored WITHOUT a duplicated first vertex: the closing
        // segment is implicit, and a duplicate would make one wall segment degenerate.
        expect(wall.ring[0]).not.toEqual(wall.ring[wall.ring.length - 1]);
      }
    });
    expectNoSeedFailures(failures, 'the ring is well formed on every seed');
  });
});
