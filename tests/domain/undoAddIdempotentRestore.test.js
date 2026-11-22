/**
 * undoAddIdempotentRestore.test.js — regression for ADD_INSTITUTION's
 * idempotent un-remove branch and ADD_FACTION's duplicate-refusal boundary.
 *
 * ADD_INSTITUTION can lawfully re-open a removed institution. That branch
 * writes no createdByEventId, so undo needs the pre-event entity snapshot.
 * Factions have no removal lifecycle: a duplicate ADD_FACTION is refused and
 * therefore never becomes a loggable event that could require undo.
 *
 * The institution pin proves the snapshot restores the exact pre-add state;
 * the faction pin proves the checked/legacy mutation boundary stays intact.
 */

import { describe, it, expect } from 'vitest';
import { mutateSettlement, mutateSettlementChecked } from '../../src/domain/events/mutate.js';
import { captureEventUndoSnapshot, scrubUndoneEvent } from '../../src/domain/events/undoEvent.js';

/** Apply an event the way the slice does, then undo it via the snapshot. */
function applyThenUndo(before, event) {
  const undo = captureEventUndoSnapshot(before, event);
  const after = mutateSettlement({ settlement: before, event });
  const undone = scrubUndoneEvent(after, { event, undo });
  return { after, undone };
}

// Landed events wave — needs a pre-add entity-graph snapshot for the supported
// ADD_INSTITUTION reopen path in src/domain/events/undoEvent.js.
describe('idempotent ADD lifecycle and undo boundaries', () => {
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

  it('a duplicate ADD_FACTION is refused before an undoable event exists', () => {
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
    const checked = mutateSettlementChecked({ settlement: impaired, event: addEvent });
    const legacy = mutateSettlement({ settlement: impaired, event: addEvent });

    expect(checked.veto).toMatchObject({
      code: 'faction_already_present',
      detail: 'The Garrison',
    });
    expect(checked.settlement).toEqual(impaired);
    expect(legacy).toEqual(impaired);
  });
});
