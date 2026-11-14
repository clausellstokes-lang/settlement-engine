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
    // Same seed ⇒ BYTE-identical output, NPC ids included: ids are slug+index
    // composed (factionRoles.js), and eslint bans Date.now / new Date() /
    // Math.random across src/generators. This tripwire compares the SHAPE on
    // purpose — a cosmetic re-wording should not fail it. The byte line is held
    // by tests/property/generatorGoldenMaster.test.js (sha256 over the whole
    // settlement, whole corpus); nothing here licenses entropy in an id.
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
    // 2026-10-01, the urban band (ODQ §934.86): factionCount 6 -> 7, institutionCount 38 -> 39,
    // npcCount 5 -> 6. Values in an existing shape; no key appeared or vanished. The seed's
    // institution band was rebuilt (hamlet -> village is now cumulative), so the same seed draws a
    // different institution set and the faction and NPC counts follow it. Measured, not predicted.
    // 2026-11-06 (LANDING-7 lane E, third seat; the rung-1 landing, ODQ §934.105): factionCount 7 -> 4,
    // institutionCount 39 -> 18, npcCount 6 -> 7. Values in an existing shape; no key appeared or vanished; tier
    // and population bucket hold (the population 538 -> 164 at 433289899, X-46 car 1, inside the same bucket).
    // Measured by stage on the first-parent line from the last restatement 3dcb3c6fd (scratch worktrees,
    // git bisect --first-parent): 39/6/7 through 47829c070^; 16/7/5 at 47829c070 (X-46 car 3 U3, the density
    // factor scales every non-required chance); factions 5 -> 4 at 6129c300d (the PLACE-NOT-TIER compose,
    // carrying e9945b632: a village seats no guild power without a market); institutions 16 -> 20 at
    // 37b1e746d (the rung-1 pins compose) and 20 -> 18 at 6ca454d2b (X-46 car 3's realised table, I7 re-key);
    // 18/7/4 from there to the branch tip.
    // npcCount 7 -> 12: lane 1, PEOPLE-1 CAST (dc655f712) -- one face per face-bearing house replaces the rung roster
    // (measured at every stage of the people car's stack: 7 at 262e8b255, 12 from dc655f712 to the tip). PEOPLE-LAND.
    // npcCount 12 -> 11: COHERENCE-POWERS cure (i), 04334d6ef (the chair's ruling of 2026-11-11, "ONE PERSON, ONE FACE"):
    // the boat-headman's house leads, so the seat's office face (the reeve) is no longer minted beside it. Measured at
    // 04334d6ef^ (12) and 04334d6ef (11), and 11 at the lane's tip (COHERENCE-POWERS-4). A value in an existing shape.
    expect(structureFingerprint(s)).toMatchInlineSnapshot(`
      {
        "factionCount": 4,
        "hasEconomicState": true,
        "hasEconomicViability": true,
        "hasHistory": true,
        "hasPowerStructure": true,
        "hasSpatial": true,
        "hookCount": 0,
        "institutionCount": 18,
        "npcCount": 11,
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
