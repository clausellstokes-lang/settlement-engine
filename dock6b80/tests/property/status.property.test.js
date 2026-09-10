/**
 * Property-based tests for src/domain/entities/status.js
 *
 * The example-based tests (entities.test.js) pin specific scenarios;
 * these properties pin INVARIANTS across the whole input space:
 *   1. withImpairment is idempotent on (type, causeEventId)
 *   2. removed/destroyed status is sticky under impairment
 *   3. severityFor stays in [0, 1] and is monotonic non-decreasing
 *
 * Why this matters: severity math, status transitions, and impairment
 * list mutation are the load-bearing pieces of the event pipeline. A
 * regression here breaks every downstream consumer (UI badges,
 * propagation, PDF rendering). Properties catch the class of bug that
 * example tests miss — the unusual input you never thought to write.
 */

import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import {
  STATUS_ACTIVE, STATUS_IMPAIRED, STATUS_REMOVED, STATUS_DESTROYED, STATUS_VACANT,
  withImpairment, effectiveStatus, severityFor,
} from '../../src/domain/entities/status.js';

// Reusable arbitraries — keep them small enough that the test runner
// stays fast (hundreds of runs * shrinking can dominate CI time).
const impairmentType = fc.constantFrom(
  'capacity', 'legitimacy', 'influence', 'wealth', 'staffing',
  'infrastructure', 'access', 'corruption',
);
// fc.double covers the [0,1] severity range used everywhere in the
// engine. fc.float would also work for these specific bounds (0 and 1
// are exact in float32), but using double matches the engine math.
const severity = fc.double({ min: 0, max: 1, noNaN: true });
const causeId  = fc.string({ minLength: 1, maxLength: 12 });
const impairment = fc.record({
  type: impairmentType,
  severity,
  causeEventId: causeId,
  description: fc.string({ maxLength: 40 }),
});

describe('status (property-based)', () => {
  test('withImpairment is idempotent on (type, causeEventId)', () => {
    fc.assert(fc.property(
      impairment,
      fc.record({ name: fc.string({ minLength: 1, maxLength: 12 }) }),
      (imp, entity) => {
        const once  = withImpairment(entity, imp);
        const twice = withImpairment(once, imp);
        // Re-applying the same (type, cause) impairment must not grow
        // the list. The second call replaces the first, never appends.
        expect(twice.impairments.length).toBe(once.impairments.length);
        // And the surviving impairment carries the latest severity.
        const surviving = twice.impairments.find(
          i => i.type === imp.type && i.causeEventId === imp.causeEventId,
        );
        expect(surviving).toBeTruthy();
        expect(surviving.severity).toBe(imp.severity);
      },
    ), { numRuns: 50 });
  });

  test('removed/destroyed/vacant status is sticky under any impairment', () => {
    const stickyStatus = fc.constantFrom(STATUS_REMOVED, STATUS_DESTROYED, STATUS_VACANT);
    fc.assert(fc.property(
      stickyStatus,
      impairment,
      (status, imp) => {
        const entity = { name: 'X', status };
        const next = withImpairment(entity, imp);
        // The status field must not be downgraded from a terminal state.
        expect(next.status).toBe(status);
        // effectiveStatus should also report the same terminal status
        // (vacant maps to vacant; removed/destroyed pass through).
        expect(effectiveStatus(next)).toBe(status);
      },
    ), { numRuns: 50 });
  });

  test('severityFor stays in [0,1] and is monotonic non-decreasing', () => {
    // For an entity accumulating impairments of one type, the aggregate
    // severity must never exceed 1 and must never decrease as we add
    // more non-negative-severity impairments. This is the compounding-
    // but-bounded contract the propagation engine depends on.
    fc.assert(fc.property(
      fc.array(severity, { minLength: 1, maxLength: 8 }),
      (severities) => {
        let entity = { name: 'X' };
        let lastAgg = 0;
        for (let i = 0; i < severities.length; i++) {
          entity = withImpairment(entity, {
            type: 'capacity',
            severity: severities[i],
            causeEventId: `e${i}`,
            description: '_',
          });
          const agg = severityFor(entity, 'capacity');
          expect(agg).toBeGreaterThanOrEqual(0);
          expect(agg).toBeLessThanOrEqual(1);
          expect(agg).toBeGreaterThanOrEqual(lastAgg - 1e-9); // float slack
          lastAgg = agg;
        }
      },
    ), { numRuns: 50 });
  });

  // Bonus: sanity-anchor — effectiveStatus on bare entity is 'active'.
  // Not strictly a property, but cheap and catches the dumbest regression.
  test('effectiveStatus default is active', () => {
    expect(effectiveStatus({ name: 'X' })).toBe(STATUS_ACTIVE);
    expect(effectiveStatus({ name: 'X', impairments: [] })).toBe(STATUS_ACTIVE);
    expect(effectiveStatus({ name: 'X', impairments: [{ type: 'capacity', severity: 0.5, causeEventId: 'e' }] }))
      .toBe(STATUS_IMPAIRED);
  });
});
