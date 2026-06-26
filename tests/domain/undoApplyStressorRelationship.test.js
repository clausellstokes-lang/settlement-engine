/**
 * undoApplyStressorRelationship.test.js — regression for APPLY_STRESSOR's
 * instigator-soured neighbour relationship surviving its own undo.
 *
 * applyStressor (mutateWorld.js) flips a named instigator neighbour's
 * relationshipType on this settlement's neighbourNetwork — a WAR-type stressor
 * sours it to 'hostile', an infiltration to a lighter DM-chosen relationship.
 * The whole neighbourNetwork array is rewritten, with no scrubbable provenance
 * the undo strip can reach (the _relationshipEventId stamp is read nowhere).
 *
 * APPLY_STRESSOR was absent from undoEvent's SNAPSHOT_SETTLEMENT_KEYS, so undo
 * had no pre-event copy of neighbourNetwork to restore — the soured edge
 * persisted permanently (data integrity). Same class as the ADD_* idempotent
 * un-remove bug (undoAddIdempotentRestore.test.js) and the sibling relationship
 * events (BROKERED_ALLIANCE / SETTLEMENT_DISPUTE / OPENED_TRADE_ROUTE) that
 * already snapshot neighbourNetwork.
 *
 * The fix adds APPLY_STRESSOR → ['neighbourNetwork'] to SNAPSHOT_SETTLEMENT_KEYS
 * (alongside its existing stressorEdits config snapshot), so undo restores the
 * neighbour's exact pre-event relationship.
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

describe('undo of APPLY_STRESSOR restores the instigator-soured neighbour relationship', () => {
  it('a war stressor sours a trade partner to hostile; undo returns it to trade_partner', () => {
    const before = {
      name: 'Oakmere',
      institutions: [],
      npcs: [],
      activeConditions: [],
      stressors: [],
      config: {},
      neighbourNetwork: [
        { id: 'Riverford', name: 'Riverford', neighbourName: 'Riverford', relationshipType: 'trade_partner', displayRelationshipType: 'trade_partner' },
        { id: 'Hollowfen', name: 'Hollowfen', neighbourName: 'Hollowfen', relationshipType: 'neutral', displayRelationshipType: 'neutral' },
      ],
    };

    const event = {
      id: 'e-siege',
      type: 'APPLY_STRESSOR',
      targetId: 'siege',
      payload: { stressorType: 'siege', instigatorNeighbour: 'Riverford', severity: 0.6 },
    };

    const { after, undone } = applyThenUndo(before, event);

    // The stressor onset soured the named instigator to hostile.
    const flipped = after.neighbourNetwork.find(l => l.id === 'Riverford');
    expect(flipped.relationshipType).toBe('hostile');
    expect(flipped.displayRelationshipType).toBe('hostile');
    // The unrelated neighbour is untouched.
    expect(after.neighbourNetwork.find(l => l.id === 'Hollowfen').relationshipType).toBe('neutral');

    // Undo must restore the EXACT pre-event neighbourNetwork — the soured edge
    // returns to 'trade_partner', not stay hostile.
    expect(undone.neighbourNetwork).toEqual(before.neighbourNetwork);
    const restored = undone.neighbourNetwork.find(l => l.id === 'Riverford');
    expect(restored.relationshipType).toBe('trade_partner');
    expect(restored.displayRelationshipType).toBe('trade_partner');
    // No provenance debris left on the restored link.
    expect(restored._relationshipEventId).toBeUndefined();
  });
});
