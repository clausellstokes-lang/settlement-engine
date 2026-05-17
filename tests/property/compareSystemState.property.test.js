/**
 * Property-based tests for src/domain/state/compareSystemState.js
 *
 *   1. before === after ⇒ empty result (no spurious deltas)
 *   2. delta count == number of changed dimensions (no drops, no dupes)
 *   3. result is sorted by absolute change descending
 *
 * compareSystemState is the bridge between two SystemState snapshots
 * and the user-facing event log. If it drops a dimension, the user
 * silently loses information. If it duplicates one, the log gets noisy.
 * If it sorts wrong, the most important change buries itself.
 */

import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import { compareSystemState } from '../../src/domain/state/compareSystemState.js';
import { bandFor } from '../../src/domain/state/bands.js';

const DIMS = ['resilience', 'volatility', 'externalThreat', 'resourcePressure'];

function makeState(values) {
  const out = {};
  for (const k of DIMS) {
    const v = values[k] ?? 50;
    out[k] = { value: v, band: bandFor(v), drivers: [], risks: [] };
  }
  return out;
}

// Arbitrary for one full SystemState — values 0..100 per dim.
const stateArb = fc.record({
  resilience:       fc.integer({ min: 0, max: 100 }),
  volatility:       fc.integer({ min: 0, max: 100 }),
  externalThreat:   fc.integer({ min: 0, max: 100 }),
  resourcePressure: fc.integer({ min: 0, max: 100 }),
}).map(makeState);

describe('compareSystemState (property-based)', () => {
  test('before === after ⇒ empty result', () => {
    fc.assert(fc.property(stateArb, (s) => {
      expect(compareSystemState(s, s)).toEqual([]);
    }), { numRuns: 40 });
  });

  test('delta count equals number of changed dimensions', () => {
    fc.assert(fc.property(stateArb, stateArb, (before, after) => {
      const expectedChangedDims = DIMS.filter(k => before[k].value !== after[k].value).length;
      const deltas = compareSystemState(before, after);
      expect(deltas).toHaveLength(expectedChangedDims);
      // No duplicate keys.
      const keys = deltas.map(d => d.key);
      expect(new Set(keys).size).toBe(keys.length);
    }), { numRuns: 60 });
  });

  test('result is sorted by absolute change descending', () => {
    fc.assert(fc.property(stateArb, stateArb, (before, after) => {
      const deltas = compareSystemState(before, after);
      for (let i = 1; i < deltas.length; i++) {
        expect(Math.abs(deltas[i - 1].change)).toBeGreaterThanOrEqual(Math.abs(deltas[i].change));
      }
    }), { numRuns: 40 });
  });

  // Bonus: null inputs return [] without throwing.
  test('null/undefined inputs are safe', () => {
    expect(compareSystemState(null, makeState({}))).toEqual([]);
    expect(compareSystemState(makeState({}), null)).toEqual([]);
    expect(compareSystemState(null, null)).toEqual([]);
    expect(compareSystemState(undefined, undefined)).toEqual([]);
  });
});
