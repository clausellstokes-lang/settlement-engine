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

describe('undo reverts the NPC / corruption family (snapshot subtree)', () => {
  it('reverts IMPOSE_CORRUPTION — the NPC turns clean again', () => {
    const before = {
      name: 'Oakmere',
      institutions: [{ id: 'institution.blackhand', name: 'The Black Hand', category: 'criminal' }],
      npcs: [{ id: 'npc.aldric', name: 'Aldric', importance: 'notable', corrupt: false }],
    };
    const event = {
      id: 'e-impose', type: 'IMPOSE_CORRUPTION', targetId: 'npc.aldric',
      payload: { criminalInstitution: 'The Black Hand' },
    };
    const { after, undone } = applyThenUndo(before, event);

    // The event turned the NPC corrupt (durable, no provenance trail)…
    expect(after.npcs[0].corrupt).toBe(true);
    expect(after.npcs[0].corruptTies?.criminalInstitution).toBe('The Black Hand');
    // …and undo restored the exact pre-event roster (corrupt flags gone).
    expect(undone.npcs).toEqual(before.npcs);
  });

  it('reverts a PROMOTE_NPC standing swap', () => {
    const before = {
      name: 'Oakmere',
      npcs: [
        { id: 'npc.a', name: 'Aldric', importance: 'background', influence: 10, structuralRank: 5, factionAffiliation: 'Town Council' },
        { id: 'npc.b', name: 'Bryn', importance: 'notable', influence: 40, structuralRank: 1, factionAffiliation: 'Town Council' },
      ],
      powerStructure: { factions: [{ id: 'faction.council', faction: 'Town Council', power: 24 }] },
    };
    const event = { id: 'e-promote', type: 'PROMOTE_NPC', targetId: 'npc.a', payload: { swapWithNpcId: 'npc.b' } };
    const { after, undone } = applyThenUndo(before, event);

    // The two NPCs swapped standing…
    expect(after.npcs.find(n => n.id === 'npc.a').importance).toBe('notable');
    expect(after.npcs.find(n => n.id === 'npc.b').importance).toBe('background');
    // …and undo restored both records exactly (no swapped standing, no factionId stamp).
    expect(undone.npcs).toEqual(before.npcs);
  });

  it('reverts a KILL_NPC — the NPC is alive again and impairments are gone', () => {
    const before = {
      name: 'Oakmere',
      npcs: [{ id: 'npc.captain', name: 'Captain Vorin', importance: 'key', status: 'active', factionAffiliation: 'The Garrison' }],
      institutions: [{ id: 'institution.barracks', name: 'Barracks' }],
      powerStructure: { factions: [{ id: 'faction.garrison', faction: 'The Garrison', power: 30 }] },
      activeConditions: [],
    };
    const event = { id: 'e-kill', type: 'KILL_NPC', targetId: 'npc.captain' };
    const { after, undone } = applyThenUndo(before, event);

    // The NPC died (status 'dead' is not the 'impaired' the strip resets)…
    expect(after.npcs[0].status).toBe('dead');
    // …and undo restored the full pre-event entity graph.
    expect(undone.npcs).toEqual(before.npcs);
    expect(undone.institutions).toEqual(before.institutions);
    expect(undone.powerStructure).toEqual(before.powerStructure);
  });

  it('reverts a KILL_LEADER (pillar importance forced) the same way', () => {
    const before = {
      name: 'Oakmere',
      npcs: [{ id: 'npc.mayor', name: 'Mayor Pell', importance: 'notable', status: 'active' }],
      institutions: [],
      powerStructure: { factions: [] },
      activeConditions: [],
    };
    const event = { id: 'e-leader', type: 'KILL_LEADER', targetId: 'npc.mayor' };
    const { after, undone } = applyThenUndo(before, event);

    expect(after.npcs[0].status).toBe('dead');
    expect(after.npcs[0].importance).toBe('pillar'); // forced by KILL_LEADER
    expect(undone.npcs).toEqual(before.npcs);        // back to 'notable' / 'active'
  });

  it('reverts REMOVE_INSTITUTION — the institution reopens AND corruption ties are restored', () => {
    const before = {
      name: 'Oakmere',
      institutions: [{ id: 'institution.blackhand', name: 'The Black Hand', category: 'criminal', status: 'active' }],
      npcs: [{
        id: 'npc.sly', name: 'Sly', status: 'active',
        corrupt: true, corruptionVector: 'greed',
        corruptTies: { criminalInstitution: 'The Black Hand' },
      }],
      powerStructure: { factions: [] },
      activeConditions: [],
    };
    const event = { id: 'e-remove', type: 'REMOVE_INSTITUTION', targetId: 'institution.blackhand' };
    const { after, undone } = applyThenUndo(before, event);

    // The institution closed and severed the NPC's corruption tie (the exact
    // defect the audit reproduced: undo used to leave the NPC permanently clean).
    expect(after.institutions[0].removedByEventId).toBe('e-remove');
    expect(after.npcs[0].corrupt).toBe(false);
    // …and undo restored both subtrees exactly — the NPC is corrupt again.
    expect(undone.institutions).toEqual(before.institutions);
    expect(undone.npcs).toEqual(before.npcs);
  });
});
