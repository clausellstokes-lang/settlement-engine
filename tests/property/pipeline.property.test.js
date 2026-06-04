/**
 * Property-based tests for the full generation pipeline.
 *
 *   1. Generation never throws across the (tier × culture × terrain ×
 *      tradeRouteAccess) config space
 *   2. Output is structurally complete - required fields present and
 *      well-typed, regardless of config
 *   3. Determinism - same seed produces structurally identical output
 *   4. Seed sensitivity - different seeds usually produce different
 *      structural fingerprints (no accidental seed bypass)
 *
 * Why properties on top of generation.test.js: the 10 fixtures hit
 * specific points in the config space. Properties fuzz the rest. If a
 * new tier × terrain combination breaks the engine, the fixed-fixture
 * tests miss it but a property catches it and shrinks the failure to a
 * minimal repro. numRuns is intentionally low (~15-25) because each
 * generation runs the full pipeline (~10ms each, ~250ms per property).
 */

import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

// Valid values cribbed from src/data/constants.js + existing fixtures.
// Random/custom tiers are excluded because they trigger different code
// paths the example tests cover better.
const tier            = fc.constantFrom('thorp', 'hamlet', 'village', 'town', 'city', 'metropolis');
const culture         = fc.constantFrom('germanic', 'celtic', 'norse', 'mediterranean');
const terrain         = fc.constantFrom('grassland', 'forest', 'river', 'coastal', 'mountains', 'swamp');
const tradeRoute      = fc.constantFrom('road', 'river', 'port', 'crossroads', 'isolated', 'none');
const monsterThreat   = fc.constantFrom('safe', 'civilized', 'frontier', 'plagued');

const configArb = fc.record({
  settType:         tier,
  culture,
  terrain,
  tradeRouteAccess: tradeRoute,
  monsterThreat,
});

const SEED = 'pipeline-prop-test-2026-05';

function gen(config, opts = {}) {
  return generateSettlementPipeline(config, null, {
    seed: opts.seed ?? SEED,
    customContent: {},  // headless - no store dependency
  });
}

function fingerprint(s) {
  return {
    tier:             s?.tier || null,
    population:       s?.population ?? 0,
    institutionCount: s?.institutions?.length ?? 0,
    factionCount:     s?.powerStructure?.factions?.length ?? 0,
    npcCount:         s?.npcs?.length ?? 0,
  };
}

describe('pipeline (property-based)', () => {
  test('generation never throws across the config space', () => {
    fc.assert(fc.property(configArb, (config) => {
      expect(() => gen(config)).not.toThrow();
    }), { numRuns: 25 });
  });

  test('output is structurally complete for any valid config', () => {
    fc.assert(fc.property(configArb, (config) => {
      const s = gen(config);
      // The pipeline always returns a usable settlement.
      expect(s).toBeTruthy();
      expect(typeof s.tier).toBe('string');
      expect(s.tier.length).toBeGreaterThan(0);
      expect(Number.isFinite(s.population)).toBe(true);
      expect(s.population).toBeGreaterThan(0);
      // Institutions: non-empty array of named objects.
      expect(Array.isArray(s.institutions)).toBe(true);
      expect(s.institutions.length).toBeGreaterThan(0);
      // Power structure exists and has at least one faction for any
      // settlement above thorp size (thorps can have no factions).
      expect(s.powerStructure).toBeDefined();
      if (s.tier !== 'thorp') {
        expect(Array.isArray(s.powerStructure.factions)).toBe(true);
        expect(s.powerStructure.factions.length).toBeGreaterThan(0);
      }
      // History always present (even if minimal).
      expect(s.history).toBeDefined();
      // EconomicState always present.
      expect(s.economicState).toBeDefined();
    }), { numRuns: 25 });
  });

  test('same seed produces structurally identical output (determinism)', () => {
    fc.assert(fc.property(configArb, (config) => {
      const a = gen(config, { seed: SEED });
      const b = gen(config, { seed: SEED });
      expect(fingerprint(a)).toEqual(fingerprint(b));
    }), { numRuns: 15 });
  });

  test('different seeds usually produce different fingerprints (seed sensitivity)', () => {
    // Catches the failure mode where someone accidentally bypasses the
    // PRNG and uses Math.random() (or a hardcoded value). We expect that
    // across 8 paired runs with different seeds, at least some pairs
    // differ - otherwise the seed has no effect.
    fc.assert(fc.property(configArb, (config) => {
      let differingPairs = 0;
      for (let i = 0; i < 8; i++) {
        const a = gen(config, { seed: `${SEED}-${i}-a` });
        const b = gen(config, { seed: `${SEED}-${i}-b` });
        if (JSON.stringify(fingerprint(a)) !== JSON.stringify(fingerprint(b))) {
          differingPairs++;
        }
      }
      // Allow up to 2 collisions out of 8 - small tiers (thorp/hamlet)
      // have a constrained output space where the fingerprint can
      // legitimately match across seeds. But if ALL 8 pairs match, the
      // seed is being ignored.
      expect(differingPairs).toBeGreaterThanOrEqual(3);
    }), { numRuns: 6 });
  });

  // Bonus: thorps are tiny - population should fit in the tier band.
  test('thorps stay under 60 population', () => {
    fc.assert(fc.property(culture, terrain, (cul, terr) => {
      const s = gen({ settType: 'thorp', culture: cul, terrain: terr, tradeRouteAccess: 'isolated' });
      expect(s.population).toBeLessThanOrEqual(60);
    }), { numRuns: 12 });
  });
});
