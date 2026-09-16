/**
 * undoUnEase.test.js — Wave B regression for undoEvent.js#unEase.
 *
 * When an undone event's appended receipt is stripped from a SURVIVING
 * condition, unEase re-derives the condition without the easing. It reads
 * `restored.duration.expiresAtTicks` off deriveActiveCondition, which is typed
 * `ActiveCondition | null`. The null branch is unreachable in practice (unEase
 * always feeds deriveActiveCondition a fresh object literal, and it only nulls
 * on a falsy/non-object input), but the guard makes that honest: no throw, and
 * a sensible re-derived condition, on the real un-ease path.
 */
import { describe, it, expect } from 'vitest';
import { scrubUndoneEvent } from '../../../src/domain/events/undoEvent.js';

describe('unEase via scrubUndoneEvent', () => {
  const makeSettlement = () => ({
    activeConditions: [
      {
        id: 'condition.plague.xyz',
        archetype: 'plague',
        label: 'Plague',
        description: 'A wasting sickness.',
        severity: 0.5,
        severityBand: 'medium',
        status: 'easing',                       // wound-down by the undone RESOLVE_STRESSOR
        triggeredAt: { tick: 1, sourceEventType: 'PLAGUE', sourceEventTargetId: 'x' },
        duration: { elapsedTicks: 3, expiresAtTicks: 5 },
        affectedSystems: [],
        causes: [
          { source: 'generation' },              // onset (index 0) — condition survives
          { source: 'event', eventId: 'evt-1', note: 'RESOLVE_STRESSOR receipt' }, // to strip
        ],
      },
    ],
  });

  it('strips the undone event receipt and un-eases the survivor without throwing', () => {
    const settlement = makeSettlement();
    const logEntry = { event: { id: 'evt-1', type: 'RESOLVE_STRESSOR' } };

    let result;
    expect(() => { result = scrubUndoneEvent(settlement, logEntry); }).not.toThrow();

    // The condition survives (only its receipt was stripped, not the whole crisis).
    const cond = result.activeConditions.find(c => c.archetype === 'plague');
    expect(cond).toBeTruthy();

    // The undone event's receipt is gone.
    const receipts = (cond.causes || []).filter(c => c.source === 'event' && c.eventId === 'evt-1');
    expect(receipts).toHaveLength(0);

    // Re-derived to a sane shape: still a numeric expiry, no longer forced 'easing'.
    expect(typeof cond.duration.expiresAtTicks === 'number' || cond.duration.expiresAtTicks === null).toBe(true);
    expect(cond.status).not.toBe('easing');
  });

  it('is a no-op when the popped entry has no event id', () => {
    const settlement = makeSettlement();
    expect(scrubUndoneEvent(settlement, {})).toBe(settlement);
  });
});
