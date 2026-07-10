/**
 * Status-impairment severity + covert awareness (5th-layer review, status-impair cluster).
 *
 * Two regressions guarded here:
 *   (1) HIGH — a restoration patch (negative severity, e.g. a popular leader's
 *       legitimacy bonus from assignNpcToRole) must NOT push a clean entity to
 *       'impaired'. Before the fix, withImpairment bumped status unconditionally
 *       and effectiveStatus / deriveSystemState read the entity as impaired, so
 *       a CLEAN institution showed impaired and resilience DROPPED.
 *   (2) LOW — effectiveStatus / isFullyActive must be covert-aware: a covert-only
 *       capture is impaired-by-status but hidden by design, so the public-facing
 *       predicates report ACTIVE. deriveSystemState reuses the SAME predicate.
 */

import { describe, test, expect } from 'vitest';
import {
  STATUS_ACTIVE, STATUS_IMPAIRED,
  effectiveStatus, withImpairment, isFullyActive, isCovertOnlyImpairment,
} from '../../src/domain/entities/status.js';
import { assignNpcToRole } from '../../src/domain/entities/npcs.js';
import { deriveSystemState } from '../../src/domain/state/deriveSystemState.js';

describe('non-positive-severity impairments do not drive impaired status (HIGH)', () => {
  test('withImpairment does NOT bump a clean entity for a negative-severity restoration', () => {
    const next = withImpairment({ name: 'Council', status: STATUS_ACTIVE, impairments: [] }, {
      type: 'legitimacy', severity: -0.4, causeEventId: 'e1', description: 'Popular new leader is widely accepted.',
    });
    expect(next.status).toBe(STATUS_ACTIVE);
    expect(effectiveStatus(next)).toBe(STATUS_ACTIVE);
    expect(isFullyActive(next)).toBe(true);
    // The restoration patch is still recorded for provenance/undo.
    expect(next.impairments).toHaveLength(1);
  });

  test('a zero-severity impairment is also inert for status', () => {
    const next = withImpairment({ name: 'X' }, {
      type: 'capacity', severity: 0, causeEventId: 'e0', description: 'No-op',
    });
    expect(effectiveStatus(next)).toBe(STATUS_ACTIVE);
  });

  test('positive severity still bumps to impaired (unchanged)', () => {
    const next = withImpairment({ name: 'X' }, {
      type: 'capacity', severity: 0.6, causeEventId: 'e1', description: 'Burned',
    });
    expect(next.status).toBe(STATUS_IMPAIRED);
    expect(effectiveStatus(next)).toBe(STATUS_IMPAIRED);
  });

  test('a positive impairment plus a negative restoration is still impaired', () => {
    let inst = withImpairment({ name: 'X' }, { type: 'capacity', severity: 0.7, causeEventId: 'e1' });
    inst = withImpairment(inst, { type: 'legitimacy', severity: -0.4, causeEventId: 'e2' });
    expect(effectiveStatus(inst)).toBe(STATUS_IMPAIRED);
  });

  test('popular-leader appointment leaves a clean institution active, resilience intact', () => {
    // The popular branch pushes a severity -0.4 legitimacy bonus.
    const { restorations } = assignNpcToRole({
      npc: { name: 'Aldric', id: 'npc1' },
      institutionId: 'inst1',
      role: 'mayor',
      quality: 'popular',
      eventId: 'fill-1',
    });
    expect(restorations).toHaveLength(1);
    expect(restorations[0].impairment.severity).toBeLessThan(0);

    // Apply that restoration to an otherwise-clean institution.
    const cleanInst = { id: 'inst1', name: 'Town Hall', status: STATUS_ACTIVE, impairments: [] };
    const restored = withImpairment(cleanInst, restorations[0].impairment);
    expect(effectiveStatus(restored)).toBe(STATUS_ACTIVE);

    // deriveSystemState must NOT count it as an impaired institution.
    const before = deriveSystemState({ institutions: [cleanInst] }).resilience.value;
    const after = deriveSystemState({ institutions: [restored] }).resilience.value;
    expect(after).toBe(before);
    expect(deriveSystemState({ institutions: [restored] }).resilience.risks)
      .not.toEqual(expect.arrayContaining([expect.stringContaining('impaired institution')]));
  });
});

describe('covert-only impairments are hidden from public status (LOW)', () => {
  const covertCaptured = {
    name: 'Captured Guild', status: STATUS_IMPAIRED,
    impairments: [{ type: 'influence', severity: 0.5, causeEventId: 'covert-1', covert: true }],
  };

  test('isCovertOnlyImpairment is exported and recognizes covert-only sets', () => {
    expect(isCovertOnlyImpairment(covertCaptured)).toBe(true);
    expect(isCovertOnlyImpairment({ impairments: [] })).toBe(false);
    expect(isCovertOnlyImpairment({
      impairments: [{ type: 'influence', severity: 0.5, covert: true }, { type: 'capacity', severity: 0.4 }],
    })).toBe(false);
  });

  test('effectiveStatus / isFullyActive treat a covert-only entity as active', () => {
    expect(effectiveStatus(covertCaptured)).toBe(STATUS_ACTIVE);
    expect(isFullyActive(covertCaptured)).toBe(true);
  });

  test('deriveSystemState still excludes covert-only institutions from the impaired count', () => {
    const value = deriveSystemState({ institutions: [covertCaptured] }).resilience.value;
    const baseline = deriveSystemState({ institutions: [] }).resilience.value;
    expect(value).toBe(baseline);
  });
});
