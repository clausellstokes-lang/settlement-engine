/**
 * tests/domain/events/restoreScope.test.js
 *
 * RESTORE_INSTITUTION / RESTORE_FACTION recover ONE prior impairment, not the
 * whole impairment list. A blanket clear would wipe impairments from UNRELATED
 * in-timeline events the restore was never meant to undo. With no explicit
 * causeEventId the restore undoes the MOST RECENT impairment; an explicit
 * causeEventId undoes exactly that one.
 */

import { describe, it, expect } from 'vitest';
import { mutateSettlement } from '../../../src/domain/events/mutate.js';

const restore = (s, type, targetId, payload) => mutateSettlement({
  settlement: s, event: { id: 'e_restore', type, targetId, payload },
});

describe('RESTORE_INSTITUTION scoping', () => {
  const settlement = () => ({
    name: 'Town',
    institutions: [
      {
        id: 'i1', name: 'Granary', status: 'impaired',
        impairments: [
          // Two impairments from two SEPARATE in-timeline events.
          { type: 'capacity',   severity: 0.4, causeEventId: 'old_fire' },
          { type: 'legitimacy', severity: 0.3, causeEventId: 'recent_scandal' },
        ],
      },
    ],
  });

  it('without a causeEventId, undoes only the MOST RECENT impairment — leaves unrelated ones intact', () => {
    const next = restore(settlement(), 'RESTORE_INSTITUTION', 'Granary');
    const granary = next.institutions.find(i => i.id === 'i1');
    const causes = (granary.impairments || []).map(i => i.causeEventId);
    // The unrelated, older impairment must survive.
    expect(causes).toContain('old_fire');
    // The most-recent one was the thing restored.
    expect(causes).not.toContain('recent_scandal');
    // Still impaired (one impairment remains), not falsely reset to active.
    expect(granary.status).toBe('impaired');
  });

  it('with an explicit causeEventId, undoes exactly that impairment', () => {
    const next = restore(settlement(), 'RESTORE_INSTITUTION', 'Granary', { causeEventId: 'old_fire' });
    const granary = next.institutions.find(i => i.id === 'i1');
    const causes = (granary.impairments || []).map(i => i.causeEventId);
    expect(causes).toEqual(['recent_scandal']);
  });

  it('clearing the last remaining impairment returns the institution to active', () => {
    const single = {
      name: 'Town',
      institutions: [
        { id: 'i1', name: 'Granary', status: 'impaired', impairments: [{ type: 'capacity', severity: 0.4, causeEventId: 'only' }] },
      ],
    };
    const next = restore(single, 'RESTORE_INSTITUTION', 'Granary');
    const granary = next.institutions.find(i => i.id === 'i1');
    expect(granary.impairments).toEqual([]);
    expect(granary.status).toBe('active');
  });
});

describe('RESTORE_FACTION scoping', () => {
  const settlement = () => ({
    name: 'Town',
    powerStructure: {
      factions: [
        {
          id: 'f1', name: 'Merchants', faction: 'Merchants', status: 'impaired',
          impairments: [
            { type: 'wealth',         severity: 0.4, causeEventId: 'old_levy' },
            { type: 'public_support', severity: 0.3, causeEventId: 'recent_riot' },
          ],
        },
      ],
    },
  });

  it('without a causeEventId, undoes only the most recent impairment — leaves unrelated ones intact', () => {
    const next = restore(settlement(), 'RESTORE_FACTION', 'Merchants');
    const f = next.powerStructure.factions.find(x => x.id === 'f1');
    const causes = (f.impairments || []).map(i => i.causeEventId);
    expect(causes).toContain('old_levy');
    expect(causes).not.toContain('recent_riot');
  });
});
