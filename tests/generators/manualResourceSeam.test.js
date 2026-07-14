/**
 * manualResourceSeam.test.js — config-seam pins for the manual resource mode.
 *
 * Covers the two G2 fixes that make manual resource selections reach generation:
 *   - [generators-pipeline-1] plain-'allow' selections (list membership) survive
 *     alongside abundant/depleted map overrides instead of being dropped the moment
 *     any single resource is marked abundant/depleted.
 *   - [generators-pipeline-2] manual-mode compatibility honours the terrain
 *     override, so terrain-specific resources the UI offered (desert/mountain,
 *     water unlocks) are not silently dropped at generation.
 *
 * Observable assertions on the resolved roster (survives a manifest regen), not
 * hash pins. Manual mode = config.nearbyResourcesRandom:false; the resolved roster
 * lands on s.config.nearbyResources.
 */

import { describe, test, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

function gen(config, seed) {
  return generateSettlementPipeline(config, null, { seed, customContent: {} });
}
function roster(s) {
  return new Set([
    ...(s.config?.nearbyResources || []),
    ...(s.resourceAnalysis?.availableResources || []),
  ]);
}

describe('[generators-pipeline-1] plain-allow selections survive an abundant/depleted marking', () => {
  // Three road-compatible universal resources selected (list = 'allow'), one of
  // them marked 'abundant'. Before the fix the roster collapses to just the
  // abundant one; after it, all three survive.
  test('list-only members survive alongside the abundant override', () => {
    const s = gen({
      settType: 'town', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road',
      nearbyResourcesRandom: false,
      nearbyResources: ['grain_fields', 'grazing_land', 'managed_forest'],
      nearbyResourcesState: { grain_fields: 'abundant' },
    }, 'p1-mixed');
    const r = roster(s);
    expect(r.has('grain_fields')).toBe(true);   // the abundant override
    expect(r.has('grazing_land')).toBe(true);    // plain 'allow' — must survive
    expect(r.has('managed_forest')).toBe(true);  // plain 'allow' — must survive
  });

  test('a depleted marking also does not drop the plain-allow siblings', () => {
    const s = gen({
      settType: 'town', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road',
      nearbyResourcesRandom: false,
      nearbyResources: ['grain_fields', 'grazing_land', 'managed_forest'],
      nearbyResourcesState: { grain_fields: 'depleted' },
    }, 'p1-depl');
    const r = roster(s);
    expect(r.has('grazing_land')).toBe(true);
    expect(r.has('managed_forest')).toBe(true);
    // and the depleted one is still on the roster, marked depleted
    expect(new Set(s.config?.nearbyResourcesDepleted || []).has('grain_fields')).toBe(true);
  });
});

describe('[generators-pipeline-2] manual mode honours the terrain override', () => {
  // date_palms is a desert-terrain resource: incompatible when terrain is null, so
  // pre-fix it never enters allCompatible and is dropped even when marked abundant.
  test('a desert resource marked abundant survives on a desert-override settlement', () => {
    const s = gen({
      settType: 'town', culture: 'arabic', terrainOverride: 'desert', tradeRouteAccess: 'road',
      nearbyResourcesRandom: false,
      nearbyResources: ['date_palms', 'grain_fields'],
      nearbyResourcesState: { date_palms: 'abundant' },
    }, 'p2-desert');
    expect(roster(s).has('date_palms')).toBe(true);
  });

  // Marking ONLY terrain resources in manual mode must not produce an empty roster.
  test('marking only terrain resources yields a non-empty roster (not silently emptied)', () => {
    const s = gen({
      settType: 'town', culture: 'germanic', terrainOverride: 'mountain', tradeRouteAccess: 'road',
      nearbyResourcesRandom: false,
      nearbyResources: ['mountain_timber'],
      nearbyResourcesState: { mountain_timber: 'abundant' },
    }, 'p2-mtn');
    expect(roster(s).has('mountain_timber')).toBe(true);
  });
});
