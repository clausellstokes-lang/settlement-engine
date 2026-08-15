/**
 * terrainOverrideResolution.test.js — direct coverage for the terrain branches.
 *
 * terrainOverride is the live terrain key: terrainHelpers.getTerrainType resolves
 * it, resolveResources selects terrain-specific resources from it, and
 * assembleInstitutions filters `terrainRequired` institutions against the resolved
 * terrainType. A bare `terrain` key is inert, so the golden/property/generation
 * corpora that swept it never actually exercised these branches.
 *
 * These are direct observable assertions — not hash pins — so mountain, desert,
 * and hills each have coverage that survives a manifest regeneration:
 *   - the resolved terrainType equals the override;
 *   - a terrain-specific resource for that terrain is reachable;
 *   - a resource belonging to a DIFFERENT terrain is absent (getCompatibleResources
 *     gates each terrain-specific resource to its own terrain);
 *   - a `terrainRequired` institution admits its terrains and is filtered out of
 *     the others (assembleInstitutions terrainRequired branch).
 *
 * Resource assertions read s.resourceAnalysis.availableResources (the resolved
 * roster the dossier renders); institution assertions read s.institutions.
 */

import { describe, test, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { RESOURCE_DATA } from '../../src/data/resourceData.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

function gen(config, seed) {
  return generateSettlementPipeline(config, null, { seed, customContent: {} });
}

// The terrain-specific resources, grouped by the terrain that owns them (the
// `terrain` field in RESOURCE_DATA). Derived from the catalog so it can't drift.
const TERRAIN_RESOURCES = Object.entries(RESOURCE_DATA)
  .filter(([, r]) => r.terrain)
  .reduce((acc, [key, r]) => ((acc[r.terrain] ||= []).push(key), acc), {});

const DESERT_RESOURCES = TERRAIN_RESOURCES.desert;   // oasis_water, date_palms, glass_sand, desert_salt, camel_herds
const MOUNTAIN_RESOURCES = TERRAIN_RESOURCES.mountain; // alpine_pasture, mountain_timber, hot_springs_mineral
const ALL_TERRAIN_RESOURCES = Object.values(TERRAIN_RESOURCES).flat();

function availableOf(s) {
  return new Set([
    ...(s.config?.nearbyResources || []),
    ...(s.resourceAnalysis?.availableResources || []),
  ]);
}
function hasInstitution(s, name) {
  return (s.institutions || []).some((i) => i.name === name);
}

// The catalog wires exactly two terrain-specific resource sets, so those are the
// two terrains whose resource pool is observably distinct. Both must be non-empty
// or the assertions below would pass vacuously.
test('the catalog actually carries terrain-specific resources (assertions are not vacuous)', () => {
  expect(DESERT_RESOURCES.length).toBeGreaterThan(0);
  expect(MOUNTAIN_RESOURCES.length).toBeGreaterThan(0);
});

describe('terrainOverride resolves to the terrain the pipeline generates', () => {
  const CASES = [
    ['plains', 'road'], ['hills', 'road'], ['forest', 'isolated'],
    ['riverside', 'river'], ['coastal', 'port'], ['mountain', 'road'], ['desert', 'road'],
  ];
  for (const [terrain, route] of CASES) {
    test(`${terrain} override → terrainType ${terrain}`, () => {
      const s = gen({ settType: 'town', culture: 'germanic', terrainOverride: terrain, tradeRouteAccess: route }, 'terr-type');
      expect(s.config?.terrainType).toBe(terrain);
    });
  }
});

describe('desert terrain — terrain-gated resources present, mountain resources absent', () => {
  // Robust across seeds: every desert settlement borders at least one desert
  // resource, and never a mountain one (getCompatibleResources gates each
  // terrain-specific resource to its own terrain).
  const SEEDS = ['d0', 'd1', 'd2', 'd3', 'd4', 'd5'];
  // seed-loop: collected — this loop REGISTERS one test() per seed rather than
  // asserting inside one, so vitest reports the true per-seed count itself (the
  // it.each shape). No early exit is possible: a failing seed is its own red.
  for (const seed of SEEDS) {
    test(`desert town (${seed}) has a desert resource and no mountain resource`, () => {
      const s = gen({ settType: 'town', culture: 'arabic', terrainOverride: 'desert', tradeRouteAccess: 'road' }, seed);
      const avail = availableOf(s);
      expect(DESERT_RESOURCES.some((r) => avail.has(r))).toBe(true);
      expect(MOUNTAIN_RESOURCES.some((r) => avail.has(r))).toBe(false);
    });
  }
});

describe('mountain terrain — terrain-gated resources present, desert resources absent', () => {
  const SEEDS = ['m0', 'm1', 'm2', 'm3', 'm4', 'm5'];
  // seed-loop: collected — registers one test() per seed (see the desert block above).
  for (const seed of SEEDS) {
    test(`mountain town (${seed}) has a mountain resource and no desert resource`, () => {
      const s = gen({ settType: 'town', culture: 'germanic', terrainOverride: 'mountain', tradeRouteAccess: 'road' }, seed);
      const avail = availableOf(s);
      expect(MOUNTAIN_RESOURCES.some((r) => avail.has(r))).toBe(true);
      expect(DESERT_RESOURCES.some((r) => avail.has(r))).toBe(false);
    });
  }
});

describe('non-terrain-specific terrains never borrow another terrain’s resources', () => {
  // hills carries no terrain-specific resources of its own, and plains/forest/
  // coastal/riverside are likewise gated out of the desert/mountain pools. This
  // is the negative side of the terrain gate: an override outside desert/mountain
  // must produce NO terrain-specific resource at all.
  const CASES = [
    ['plains', 'road'], ['hills', 'road'], ['forest', 'isolated'],
    ['riverside', 'river'], ['coastal', 'port'],
  ];
  for (const [terrain, route] of CASES) {
    test(`${terrain} town borders no desert- or mountain-specific resource`, () => {
      const failures = collectSeedFailures(['n0', 'n1', 'n2', 'n3'], (seed) => {
        const s = gen({ settType: 'town', culture: 'germanic', terrainOverride: terrain, tradeRouteAccess: route }, seed);
        const avail = availableOf(s);
        expect(ALL_TERRAIN_RESOURCES.some((r) => avail.has(r)), `seed ${seed}`).toBe(false);
      });
      expectNoSeedFailures(failures, `${terrain} borrows no terrain-specific resource`);
    });
  }
});

describe('terrainRequired institution filtering (assembleInstitutions terrainRequired branch)', () => {
  // 'Shepherd collective' (thorp catalog) declares terrainRequired ['plains','hills'].
  // The filter must ADMIT it on plains and hills and EXCLUDE it everywhere else.
  test('Shepherd collective is admitted on plains and hills', () => {
    const plains = gen({ settType: 'thorp', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road' }, 's0');
    // Culture weighting moved the old k2 probability draw. hill-4 is the
    // re-probed positive fixture; off-terrain exclusion remains swept below.
    const hills = gen({ settType: 'thorp', culture: 'germanic', terrainOverride: 'hills', tradeRouteAccess: 'road' }, 'hill-4');
    expect(hasInstitution(plains, 'Shepherd collective')).toBe(true);
    expect(hasInstitution(hills, 'Shepherd collective')).toBe(true);
  });

  // thorps are the cheapest tier to generate, so this off-terrain sweep can run
  // wide (8 seeds each) without a long wall time.
  test('Shepherd collective is filtered out of mountain, desert, coastal, and forest', () => {
    const OFF_TERRAIN = [['mountain', 'road'], ['desert', 'road'], ['coastal', 'port'], ['forest', 'isolated']];
    for (const [terrain, route] of OFF_TERRAIN) {
      for (let i = 0; i < 8; i++) {
        const s = gen({ settType: 'thorp', culture: 'germanic', terrainOverride: terrain, tradeRouteAccess: route }, `s${i}`);
        expect(hasInstitution(s, 'Shepherd collective')).toBe(false);
      }
    }
  });

  // 'Caravanserai' (town/city catalog) declares terrainRequired ['desert'].
  // Town-tier generation is heavy, so the off-terrain sweep runs 6 seeds each
  // (30 generations) — enough to catch a broken filter without a long wall time.
  // The per-terrain zero result is stable well beyond this (verified to 25 seeds).
  test('Caravanserai is admitted on desert and filtered out of every other terrain', () => {
    const desert = gen({ settType: 'town', culture: 'germanic', terrainOverride: 'desert', tradeRouteAccess: 'road' }, 'k4');
    expect(hasInstitution(desert, 'Caravanserai')).toBe(true);

    const OFF_TERRAIN = [['plains', 'road'], ['hills', 'road'], ['mountain', 'road'], ['forest', 'isolated'], ['coastal', 'port']];
    for (const [terrain, route] of OFF_TERRAIN) {
      for (let i = 0; i < 6; i++) {
        const s = gen({ settType: 'town', culture: 'germanic', terrainOverride: terrain, tradeRouteAccess: route }, `s${i}`);
        expect(hasInstitution(s, 'Caravanserai')).toBe(false);
      }
    }
  }, 30000);
});
