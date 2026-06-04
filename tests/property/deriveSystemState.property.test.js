/**
 * Property-based tests for src/domain/state/deriveSystemState.js
 *
 *   1. Always returns a valid SystemState shape - no throws, all four
 *      dimensions present with value in [0,100] and a valid band
 *   2. resilience monotonic: more impaired institutions ⇒ resilience
 *      never INCREASES
 *   3. externalThreat monotonic: more hostile neighbours ⇒ externalThreat
 *      never DECREASES
 *
 * The derive function is the public reduction surface for the engine -
 * the UI bar, the PDF SystemStateSnapshot, and the compareSystemState
 * delta logic all read it. The "tolerant of sparse inputs" guarantee
 * means partial/legacy/in-flight settlements never crash the render.
 */

import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import { deriveSystemState } from '../../src/domain/state/deriveSystemState.js';

const VALID_BANDS = new Set(['Stable', 'Strained', 'Vulnerable', 'Critical']);

function isValidDimension(d) {
  if (!d || typeof d !== 'object') return false;
  if (typeof d.value !== 'number') return false;
  if (d.value < 0 || d.value > 100) return false;
  if (!VALID_BANDS.has(d.band)) return false;
  if (!Array.isArray(d.drivers)) return false;
  if (!Array.isArray(d.risks)) return false;
  return true;
}

describe('deriveSystemState (property-based)', () => {
  test('returns a valid 4-dimension shape for arbitrary inputs', () => {
    // Pull arbitrary "reasonable" settlement shapes from a structured
    // arbitrary - we sample real fields rather than fully random JSON
    // so the test exercises the actual derivation paths.
    const settlementArb = fc.record({
      economicState: fc.record({
        prosperity: fc.option(fc.constantFrom('Wealthy', 'Prosperous', 'Modest', 'Subsistence', 'Struggling'), { nil: undefined }),
        foodSecurity: fc.option(fc.record({
          deficitMonths: fc.integer({ min: 0, max: 8 }),
          surplusMonths: fc.integer({ min: 0, max: 8 }),
        }), { nil: undefined }),
        exports: fc.array(fc.string({ minLength: 1, maxLength: 6 }), { maxLength: 8 }),
        imports: fc.array(fc.string({ minLength: 1, maxLength: 6 }), { maxLength: 8 }),
      }, { requiredKeys: [] }),
      institutions: fc.array(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 8 }),
          status: fc.constantFrom('active', 'impaired', 'critical', 'removed'),
        }),
        { maxLength: 8 },
      ),
      powerStructure: fc.record({
        factions:  fc.array(fc.record({ name: fc.string({ minLength: 1, maxLength: 6 }) }), { maxLength: 8 }),
        conflicts: fc.array(fc.record({ a: fc.string({ maxLength: 4 }) }), { maxLength: 4 }),
      }, { requiredKeys: [] }),
      config: fc.record({
        monsterThreat: fc.option(fc.constantFrom('safe', 'civilized', 'frontier', 'plagued'), { nil: undefined }),
        nearbyResourcesState: fc.dictionary(
          fc.string({ minLength: 1, maxLength: 6 }),
          fc.constantFrom('allow', 'depleted'),
          { maxKeys: 5 },
        ),
        tradeRouteAccess: fc.option(fc.constantFrom('none', 'isolated', 'road', 'river', 'port', 'crossroads'), { nil: undefined }),
      }, { requiredKeys: [] }),
      neighbourNetwork: fc.array(
        fc.record({
          relationshipType: fc.constantFrom('allied', 'friendly', 'neutral', 'cold_war', 'hostile'),
        }),
        { maxLength: 6 },
      ),
      stresses: fc.array(fc.record({ name: fc.string({ minLength: 1, maxLength: 8 }) }), { maxLength: 6 }),
    }, { requiredKeys: [] });

    fc.assert(fc.property(settlementArb, (s) => {
      const out = deriveSystemState(s);
      expect(isValidDimension(out.resilience)).toBe(true);
      expect(isValidDimension(out.volatility)).toBe(true);
      expect(isValidDimension(out.externalThreat)).toBe(true);
      expect(isValidDimension(out.resourcePressure)).toBe(true);
    }), { numRuns: 80 });

    // Edge cases: null and {} must not throw and must produce valid shape.
    expect(isValidDimension(deriveSystemState(null).resilience)).toBe(true);
    expect(isValidDimension(deriveSystemState({}).resilience)).toBe(true);
  });

  test('resilience is non-increasing as we add more impaired institutions', () => {
    // We start with an empty institutions[], then add 1, 2, 3... impaired
    // institutions. Resilience must never go UP.
    fc.assert(fc.property(fc.integer({ min: 0, max: 6 }), (extra) => {
      const baseline = deriveSystemState({ institutions: [] }).resilience.value;
      const impairedSettlement = {
        institutions: Array.from({ length: extra }, (_, i) => ({
          name: `inst${i}`,
          status: 'impaired',
        })),
      };
      const after = deriveSystemState(impairedSettlement).resilience.value;
      expect(after).toBeLessThanOrEqual(baseline);
    }), { numRuns: 20 });
  });

  test('externalThreat is non-decreasing as we add more hostile neighbours', () => {
    // Same idea, opposite direction: more hostiles ⇒ ≥ threat.
    fc.assert(fc.property(fc.integer({ min: 0, max: 5 }), (extra) => {
      const baseline = deriveSystemState({ neighbourNetwork: [] }).externalThreat.value;
      const hostile = {
        neighbourNetwork: Array.from({ length: extra }, () => ({ relationshipType: 'hostile' })),
      };
      const after = deriveSystemState(hostile).externalThreat.value;
      expect(after).toBeGreaterThanOrEqual(baseline);
    }), { numRuns: 20 });
  });

  // Bonus: resourcePressure non-decreasing as we deplete more resources.
  test('resourcePressure is non-decreasing as we deplete more resources', () => {
    fc.assert(fc.property(fc.integer({ min: 0, max: 6 }), (extra) => {
      const baseline = deriveSystemState({ config: {} }).resourcePressure.value;
      const state = {};
      for (let i = 0; i < extra; i++) state[`r${i}`] = 'depleted';
      const after = deriveSystemState({ config: { nearbyResourcesState: state } }).resourcePressure.value;
      expect(after).toBeGreaterThanOrEqual(baseline);
    }), { numRuns: 20 });
  });
});
