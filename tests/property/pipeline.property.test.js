/**
 * Property-based tests for the full generation pipeline.
 *
 *   1. Generation never throws across the (tier × culture × terrainOverride ×
 *      tradeRouteAccess) config space
 *   2. Output is structurally complete — required fields present and
 *      well-typed, regardless of config
 *   3. Determinism — same seed produces structurally identical output
 *   4. Seed sensitivity — different seeds usually produce different
 *      structural fingerprints (no accidental seed bypass)
 *
 * Why properties on top of generation.test.js: the 10 fixtures hit
 * specific points in the config space. Properties fuzz the rest. If a
 * new tier × terrain combination breaks the engine, the fixed-fixture
 * tests miss it but a property catches it and shrinks the failure to a
 * minimal repro. numRuns is bounded by the cost of the full pipeline
 * (~10ms each): the single-generation properties run ~100 cases, while
 * the seed-sensitivity property runs fewer cases because each case does
 * 16 generations (8 paired runs), keeping the per-property wall time
 * comparable.
 */

import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

// Valid values cribbed from src/data/constants.js + existing fixtures.
// Random/custom tiers are excluded because they trigger different code
// paths the example tests cover better. terrainOverride is the LIVE terrain
// key (terrainHelpers.getTerrainType / resolveConfig read it; a bare `terrain`
// is inert), and its seven tokens are the vocabulary the pipeline actually
// resolves — so this axis fuzzes real terrain branches, not a dead field. The
// extra 'auto' token leaves terrainOverride unpinned, so the terrain comes from
// the route (route-derived terrain) — fuzzing that branch too.
const tier            = fc.constantFrom('thorp', 'hamlet', 'village', 'town', 'city', 'metropolis');
// SS2-F33: the REAL NAMING_DATA cultures — the prior list fuzzed a bogus 'mediterranean' that
// resolveNameCulture silently folds to germanic, so 8 of 11 real culture naming branches (latin,
// arabic, slavic, east_asian, mesoamerican, south_asian, steppe, greek) were never exercised by
// the deep-JSON byte-identity pin. These are the culture keys the pipeline actually resolves.
const culture         = fc.constantFrom('germanic', 'latin', 'celtic', 'arabic', 'norse', 'slavic', 'east_asian', 'mesoamerican', 'south_asian', 'steppe', 'greek');
const terrainOverride = fc.constantFrom('plains', 'hills', 'forest', 'riverside', 'coastal', 'mountain', 'desert', 'auto');
const tradeRoute      = fc.constantFrom('road', 'river', 'port', 'crossroads', 'isolated', 'none');
const monsterThreat   = fc.constantFrom('safe', 'civilized', 'frontier', 'plagued');

const configArb = fc.record({
  settType:         tier,
  culture,
  terrainOverride,
  tradeRouteAccess: tradeRoute,
  monsterThreat,
});

const SEED = 'pipeline-prop-test-2026-05';

function gen(config, opts = {}) {
  return generateSettlementPipeline(config, null, {
    seed: opts.seed ?? SEED,
    customContent: {},  // headless — no store dependency
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
    }), { numRuns: 100 });
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
    }), { numRuns: 100 });
  });

  test('same seed produces structurally identical output (determinism)', () => {
    fc.assert(fc.property(configArb, (config) => {
      const a = gen(config, { seed: SEED });
      const b = gen(config, { seed: SEED });
      expect(fingerprint(a)).toEqual(fingerprint(b));
    }), { numRuns: 100 });
  });

  test('same seed produces a DEEP-identical settlement (full-JSON determinism)', () => {
    // The fingerprint test above compares only 5 scalars — it would pass even
    // if names drifted, arrays reordered, or a stray Math.random()/Date.now()
    // crept into a deep field. This asserts the ENTIRE serialized settlement is
    // byte-identical across two same-seed runs, so fine-grained non-determinism
    // can no longer slip past CI. (The settlement is persisted as JSON, so
    // JSON.stringify equality is the real reproducibility contract.)
    fc.assert(fc.property(configArb, (config) => {
      const a = gen(config, { seed: SEED });
      const b = gen(config, { seed: SEED });
      expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    }), { numRuns: 100 });
    // 200 full-pipeline generations + full-JSON compares overrun the root 20s
    // testTimeout under machine load — a wall-clock false positive, not drift.
    // Same house allowance as the seed-sensitivity test below. ([tests-4]/[test-quality-7])
  }, 120_000);

  test('different seeds usually produce different fingerprints (seed sensitivity)', () => {
    // Catches the failure mode where someone accidentally bypasses the
    // PRNG and uses Math.random() (or a hardcoded value). We expect that
    // across 8 paired runs with different seeds, at least some pairs
    // differ — otherwise the seed has no effect.
    fc.assert(fc.property(configArb, (config) => {
      let differingPairs = 0;
      for (let i = 0; i < 8; i++) {
        const a = gen(config, { seed: `${SEED}-${i}-a` });
        const b = gen(config, { seed: `${SEED}-${i}-b` });
        if (JSON.stringify(fingerprint(a)) !== JSON.stringify(fingerprint(b))) {
          differingPairs++;
        }
      }
      // Allow up to 2 collisions out of 8 — small tiers (thorp/hamlet)
      // have a constrained output space where the fingerprint can
      // legitimately match across seeds. But if ALL 8 pairs match, the
      // seed is being ignored.
      expect(differingPairs).toBeGreaterThanOrEqual(3);
    }), { numRuns: 25 });
    // 8 pairs × 25 runs = 400 full-pipeline generations overrun the root 20s
    // testTimeout under machine load — a wall-clock false positive, not drift
    // (documented pre-existing env red in the ROUND21 plan). Same house allowance
    // as generatorGoldenMaster/distributionEnvelopes. ([tests-4]/[test-quality-7])
  }, 120_000);

  // Bonus: thorps are tiny — population should fit in the tier band.
  test('thorps stay under 60 population', () => {
    fc.assert(fc.property(culture, terrainOverride, (cul, terr) => {
      const s = gen({ settType: 'thorp', culture: cul, terrainOverride: terr, tradeRouteAccess: 'isolated' });
      expect(s.population).toBeLessThanOrEqual(60);
    }), { numRuns: 100 });
  });
});
