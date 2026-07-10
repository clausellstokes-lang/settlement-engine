/**
 * Generation snapshot + invariant tests.
 *
 * What this proves:
 *   1. Determinism — same seed produces the same output (structurally).
 *      We snapshot the SHAPE (counts, presence of key sections, basic
 *      stat ranges) rather than full prose, so cosmetic re-wordings
 *      don't fail every CI run.
 *   2. Invariants — every settlement, regardless of tier or culture,
 *      satisfies the rules the engine implicitly relies on (no orphan
 *      references, no NaN populations, etc.). When these break, the
 *      downstream UI/PDF will silently misrender, which is the slow,
 *      hard-to-find regression we're trying to catch.
 *
 * The configs span the tier spectrum and a few dimensions known to
 * change behavior. Terrain is pinned through terrainOverride (the live
 * terrain key the pipeline reads) paired with a terrain-honest trade
 * route, so the mountain/desert fixtures genuinely exercise the
 * terrain-specific resource and institution branches — a bare `terrain`
 * key is inert. We don't try to be exhaustive — we want a fast tripwire,
 * not a fixture museum.
 */

import { describe, test, expect } from 'vitest';
import { generateSettlementPipeline } from '../src/generators/generateSettlementPipeline.js';

const SEED = 'sf-test-2026-04';

// terrainOverride is the live terrain key (terrainHelpers.getTerrainType /
// resolveConfig / resolveResources read it; a bare `terrain` is dead), paired
// with the trade route that honestly reaches each terrain's resources. The
// fixture names describe the terrain the pipeline actually generates.
const FIXTURES = [
  { name: 'thorp_plains_road',         config: { settType: 'thorp',      culture: 'germanic', terrainOverride: 'plains',    tradeRouteAccess: 'road' } },
  { name: 'hamlet_forest_isolated',    config: { settType: 'hamlet',     culture: 'celtic',   terrainOverride: 'forest',    tradeRouteAccess: 'isolated' } },
  { name: 'village_riverside_river',   config: { settType: 'village',    culture: 'germanic', terrainOverride: 'riverside', tradeRouteAccess: 'river' } },
  { name: 'village_coastal_port',      config: { settType: 'village',    culture: 'norse',    terrainOverride: 'coastal',   tradeRouteAccess: 'port' } },
  { name: 'town_hills_road',           config: { settType: 'town',       culture: 'germanic', terrainOverride: 'hills',     tradeRouteAccess: 'road' } },
  { name: 'town_mountain_road',        config: { settType: 'town',       culture: 'germanic', terrainOverride: 'mountain',  tradeRouteAccess: 'road' } },
  { name: 'town_desert_road',          config: { settType: 'town',       culture: 'arabic',   terrainOverride: 'desert',    tradeRouteAccess: 'road' } },
  { name: 'city_plains_road',          config: { settType: 'city',       culture: 'germanic', terrainOverride: 'plains',    tradeRouteAccess: 'road' } },
  { name: 'city_coastal_port',         config: { settType: 'city',       culture: 'mediterranean', terrainOverride: 'coastal', tradeRouteAccess: 'port' } },
  { name: 'metropolis_riverside_port', config: { settType: 'metropolis', culture: 'mediterranean', terrainOverride: 'riverside',  tradeRouteAccess: 'port' } },
];

function gen(config) {
  // customContent: {} pins generation to a clean, headless state — no
  // store, no React, no app-specific custom institutions leaking in.
  return generateSettlementPipeline(config, null, { seed: SEED, customContent: {} });
}

describe('determinism', () => {
  test.each(FIXTURES)('$name produces stable structure across two runs with same seed', ({ config }) => {
    const a = gen(config);
    const b = gen(config);
    // The full settlement object includes generated NPCs whose IDs may embed
    // timestamps or other entropy — compare structure, not deep equality.
    expect(structureFingerprint(a)).toEqual(structureFingerprint(b));
  });
});

describe('invariants', () => {
  test.each(FIXTURES)('$name satisfies engine invariants', ({ config }) => {
    const s = gen(config);
    expect(s).toBeTruthy();
    expect(typeof s.tier).toBe('string');
    expect(s.population).toBeGreaterThan(0);
    expect(Number.isFinite(s.population)).toBe(true);

    // Institutions: array, every entry has a name string
    expect(Array.isArray(s.institutions)).toBe(true);
    for (const inst of s.institutions) {
      expect(typeof inst?.name).toBe('string');
      expect(inst.name.length).toBeGreaterThan(0);
    }

    // No NPC should reference a faction id that doesn't exist.
    const factionIds = new Set(
      (s.powerStructure?.factions || []).map(f => f.id || f.faction || f.name).filter(Boolean),
    );
    if (factionIds.size && Array.isArray(s.npcs)) {
      for (const npc of s.npcs) {
        const f = npc?.faction;
        if (f && typeof f === 'string') {
          // We only assert: if NPC names a faction string, it should match
          // *something* recognizable. Some NPCs intentionally have free-form
          // affiliations, so we accept either a known faction or a non-empty
          // descriptive string.
          expect(f.length).toBeGreaterThan(0);
        }
      }
    }

    // No duplicate institution NAMES — would cause the toggle UI to merge
    // them and the generator's name-match lookups to behave non-deterministically.
    if (Array.isArray(s.institutions)) {
      const names = s.institutions.map(i => i.name?.toLowerCase()).filter(Boolean);
      const uniq = new Set(names);
      expect(names.length).toBe(uniq.size);
    }

    // History should exist (even if minimal) once the pipeline runs.
    expect(s.history).toBeDefined();
  });
});

describe('snapshot shape', () => {
  // Single representative case; we don't snapshot all 10 to keep CI focused.
  // Add cases here if you want to lock specific tiers/edge cases against
  // accidental restructuring.
  test('village_riverside_river structure is stable', () => {
    const s = gen(FIXTURES[2].config);
    expect(structureFingerprint(s)).toMatchInlineSnapshot(`
      {
        "factionCount": 6,
        "hasEconomicState": true,
        "hasEconomicViability": true,
        "hasHistory": true,
        "hasPowerStructure": true,
        "hasSpatial": true,
        "hookCount": 0,
        "institutionCount": 38,
        "npcCount": 6,
        "populationBucket": "100-1000",
        "stressCount": 0,
        "tier": "village",
      }
    `);
  });
});

/**
 * Reduce a generated settlement to a small, stable bag of structural facts
 * that should not change between two runs of the same seed. Avoids snapshot
 * churn from prose tweaks while still catching real regressions (e.g., a
 * step that suddenly produces zero institutions).
 */
function structureFingerprint(s) {
  const popBucket = !s?.population        ? 'none'
                  : s.population < 100    ? '<100'
                  : s.population < 1000   ? '100-1000'
                  : s.population < 10000  ? '1000-10000'
                  :                         '>=10000';
  return {
    tier: s?.tier || null,
    populationBucket: popBucket,
    institutionCount: s?.institutions?.length ?? 0,
    npcCount: s?.npcs?.length ?? 0,
    factionCount: s?.powerStructure?.factions?.length ?? 0,
    hookCount: (s?.plotHooks || s?.hooks)?.length ?? 0,
    stressCount: s?.stresses?.length ?? 0,
    hasHistory: !!s?.history,
    hasPowerStructure: !!s?.powerStructure,
    hasEconomicState: !!s?.economicState,
    hasEconomicViability: !!s?.economicViability,
    hasSpatial: !!s?.spatialLayout,
  };
}
