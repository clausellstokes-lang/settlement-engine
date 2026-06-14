/**
 * undoSnapshotSubtree.test.js — regression for the undo snapshot covering
 * top-level settlement subtrees (powerStructure / neighbourNetwork).
 *
 * Before this, CHANGE_RULING_POWER left the entire government transfer in place
 * after undo (only the condition was scrubbed), and the relationship events
 * (BROKERED_ALLIANCE / SETTLEMENT_DISPUTE / OPENED_TRADE_ROUTE) were never
 * reverted at all — they stamped a _relationshipEventId that nothing read.
 *
 * The snapshot is captured pre-event by captureEventUndoSnapshot and restored
 * by scrubUndoneEvent (the path the Timeline Undo button walks).
 */

import { describe, it, expect } from 'vitest';
import { mutateSettlement } from '../../../src/domain/events/mutate.js';
import { captureEventUndoSnapshot, scrubUndoneEvent } from '../../../src/domain/events/undoEvent.js';

/** Apply an event the way the slice does, then undo it via the snapshot. */
function applyThenUndo(before, event) {
  const undo = captureEventUndoSnapshot(before, event);
  const after = mutateSettlement({ settlement: before, event });
  const undone = scrubUndoneEvent(after, { event, undo });
  return { after, undone };
}

describe('undo restores top-level settlement subtrees', () => {
  it('reverts a SETTLEMENT_DISPUTE relationship change', () => {
    const before = {
      name: 'Home',
      neighbourNetwork: [
        { id: 'n1', name: 'Stonehaven', relationshipType: 'neutral' },
        { id: 'n2', name: 'Irontown', relationshipType: 'trade_partner' },
      ],
    };
    const event = { id: 'e1', type: 'SETTLEMENT_DISPUTE', targetId: 'Stonehaven', payload: { relationshipType: 'hostile' } };
    const { after, undone } = applyThenUndo(before, event);

    // The event took effect…
    expect(after.neighbourNetwork.find(n => n.name === 'Stonehaven').relationshipType).toBe('hostile');
    // …and undo restored the exact pre-event link (no leftover stamp).
    expect(undone.neighbourNetwork).toEqual(before.neighbourNetwork);
  });

  it('reverts a BROKERED_ALLIANCE relationship change', () => {
    const before = {
      name: 'Home',
      neighbourNetwork: [{ id: 'n1', name: 'Stonehaven', relationshipType: 'rival' }],
    };
    const event = { id: 'e2', type: 'BROKERED_ALLIANCE', targetId: 'Stonehaven', payload: {} };
    const { after, undone } = applyThenUndo(before, event);
    expect(after.neighbourNetwork[0].relationshipType).toBe('allied');
    expect(undone.neighbourNetwork).toEqual(before.neighbourNetwork);
  });

  it('reverts the full CHANGE_RULING_POWER government transfer', () => {
    const before = {
      name: 'Oakmere',
      tier: 'town',
      institutions: [],
      npcs: [],
      activeConditions: [],
      powerStructure: {
        governingName: 'Town Council',
        publicLegitimacy: { score: 40, label: 'Contested', govMultiplier: 0.8, crimMultiplier: 1.15 },
        factions: [
          { faction: 'Town Council', power: 24, category: 'government', isGoverning: true },
          { faction: 'The Garrison', power: 30, category: 'military' },
          { faction: 'Merchant Guilds', power: 26, category: 'economy' },
        ],
        factionRelationships: [],
      },
    };
    const event = { id: 'e3', type: 'CHANGE_RULING_POWER', targetId: 'The Garrison', payload: { cause: 'coup' } };
    const { after, undone } = applyThenUndo(before, event);

    // The transfer reshaped the governing body…
    expect(after.powerStructure.governingName).not.toBe('Town Council');
    // …and undo restored the entire pre-event powerStructure subtree.
    expect(undone.powerStructure).toEqual(before.powerStructure);
  });

  it('drops an ADD_NPC-created NPC on undo', () => {
    const before = { name: 'Oakmere', npcs: [{ id: 'npc.existing', name: 'Aldric', role: 'Mayor' }] };
    const event = { id: 'e4', type: 'ADD_NPC', targetId: 'Brenna the Fence', payload: { role: 'Fence' } };
    const { after, undone } = applyThenUndo(before, event);

    // The NPC was added (stamped createdByEventId)…
    expect(after.npcs.length).toBe(2);
    expect(after.npcs.some(n => n.createdByEventId === 'e4')).toBe(true);
    // …and undo removed exactly it, leaving the original roster.
    expect(undone.npcs.map(n => n.id)).toEqual(['npc.existing']);
  });

  it('drops an ADD_INSTITUTION-created institution on undo', () => {
    const before = { name: 'Oakmere', institutions: [{ id: 'institution.granary', name: 'Granary' }] };
    const event = { id: 'e5', type: 'ADD_INSTITUTION', targetId: 'Thieves Guild' };
    const { after, undone } = applyThenUndo(before, event);
    expect(after.institutions.length).toBe(2);
    expect(undone.institutions.map(i => i.id)).toEqual(['institution.granary']);
  });
});
