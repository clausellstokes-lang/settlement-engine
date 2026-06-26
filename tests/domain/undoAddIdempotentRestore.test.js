/**
 * undoAddIdempotentRestore.test.js — regression for the idempotent un-remove
 * branch of ADD_INSTITUTION / ADD_FACTION.
 *
 * addInstitution/addFaction are idempotent by name: re-adding an entity that
 * already exists does NOT duplicate it — it re-activates the existing record
 * (status 'active', only REMOVAL-caused impairments cleared). That un-remove branch writes NO
 * createdByEventId, so undoEvent's withoutEventCreations (which only drops
 * records stamped with the popped event's id) cannot reach it. Without a
 * pre-event snapshot, undoing the ADD left the entity permanently resurrected
 * — the prior REMOVED/impaired state was lost (data integrity).
 *
 * The fix snapshots the entity-graph subtree for the ADD events, so undo
 * restores the exact pre-add state in both the create and the un-remove case.
 */

import { describe, it, expect } from 'vitest';
import { mutateSettlement } from '../../src/domain/events/mutate.js';
import { captureEventUndoSnapshot, scrubUndoneEvent } from '../../src/domain/events/undoEvent.js';

/** Apply an event the way the slice does, then undo it via the snapshot. */
function applyThenUndo(before, event) {
  const undo = captureEventUndoSnapshot(before, event);
  const after = mutateSettlement({ settlement: before, event });
  const undone = scrubUndoneEvent(after, { event, undo });
  return { after, undone };
}

describe('undo of an idempotent ADD restores the pre-add removed state', () => {
  it('REMOVE_INSTITUTION then ADD_INSTITUTION (same name): undoing the ADD returns it to REMOVED', () => {
    const base = {
      name: 'Oakmere',
      institutions: [{ id: 'institution.black_hand', name: 'Black Hand', category: 'criminal', status: 'active' }],
      npcs: [],
      powerStructure: { factions: [] },
      activeConditions: [],
    };

    // 1. Close the institution. It gains status 'removed' + a capacity impairment.
    const removeEvent = { id: 'e-remove', type: 'REMOVE_INSTITUTION', targetId: 'institution.black_hand' };
    const removed = mutateSettlement({ settlement: base, event: removeEvent });
    const removedInst = removed.institutions.find(i => i.id === 'institution.black_hand');
    expect(removedInst.status).toBe('removed');
    expect(removedInst.removedByEventId).toBe('e-remove');

    // 2. ADD_INSTITUTION with the same name takes the idempotent un-remove
    //    branch: re-activates the existing record, NO createdByEventId stamp.
    const addEvent = { id: 'e-add', type: 'ADD_INSTITUTION', targetId: 'institution.black_hand' };
    const { after, undone } = applyThenUndo(removed, addEvent);

    const reAdded = after.institutions.find(i => i.id === 'institution.black_hand');
    expect(reAdded.status).toBe('active');           // un-removed
    expect(reAdded.createdByEventId).toBeUndefined(); // the idempotent branch stamps nothing
    expect(after.institutions.length).toBe(1);        // idempotent — not duplicated

    // 3. Undo the ADD: the institution must return to its REMOVED pre-add
    //    state, not stay resurrected.
    expect(undone.institutions).toEqual(removed.institutions);
    const restored = undone.institutions.find(i => i.id === 'institution.black_hand');
    expect(restored.status).toBe('removed');
    expect(restored.removedByEventId).toBe('e-remove');
  });

  it('an impaired-then-readded FACTION keeps its unrelated impairment; undo restores the pre-add state', () => {
    // A faction carrying an UNRELATED (non-removal) impairment, re-added by name.
    // The idempotent re-add now only clears REMOVAL-caused impairments, so the
    // prior unrelated damage is KEPT (no blanket wipe). Undo still restores the
    // exact pre-add faction.
    const impaired = {
      name: 'Oakmere',
      institutions: [],
      npcs: [],
      powerStructure: {
        factions: [{
          id: 'faction.garrison', name: 'The Garrison', faction: 'The Garrison',
          status: 'active',
          impairments: [{ type: 'public_support', severity: 0.6, causeEventId: 'e-prior' }],
        }],
      },
      activeConditions: [],
    };

    const addEvent = { id: 'e-add-faction', type: 'ADD_FACTION', targetId: 'faction.The_Garrison' };
    const { after, undone } = applyThenUndo(impaired, addEvent);

    const reAdded = after.powerStructure.factions.find(f => f.id === 'faction.garrison');
    expect(reAdded.impairments).toEqual([{ type: 'public_support', severity: 0.6, causeEventId: 'e-prior' }]);  // re-add KEEPS the unrelated impairment
    expect(reAdded.createdByEventId).toBeUndefined();  // idempotent branch stamps nothing
    expect(after.powerStructure.factions.length).toBe(1);

    // Undo restores the pre-add impaired faction exactly.
    expect(undone.powerStructure).toEqual(impaired.powerStructure);
    const restored = undone.powerStructure.factions.find(f => f.id === 'faction.garrison');
    expect(restored.impairments).toEqual([{ type: 'public_support', severity: 0.6, causeEventId: 'e-prior' }]);
  });
});
