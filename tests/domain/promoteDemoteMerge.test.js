/**
 * #2c — Promote/Demote NPC merge.
 *
 * The composer now offers ONE action, "Promote/Demote NPC" (the relabeled
 * PROMOTE_NPC), and DEMOTE_NPC is folded out of the authoring menu. But the
 * standing swap is a single shared handler (a promote of A IS a demote of B), so
 * the DEMOTE_NPC type stays a FIRST-CLASS engine type for back-compat: an old
 * event log carrying a DEMOTE_NPC event must still apply AND undo correctly.
 *
 * What these pin:
 *   - the relabeled PROMOTE_NPC applies the standing swap (the merged action);
 *   - DEMOTE_NPC is hidden from the composer (NON_AUTHORABLE_EVENTS) yet remains
 *     a registry/mutate/batch/undo-recognized type;
 *   - an OLD DEMOTE_NPC event applies + undoes identically to PROMOTE_NPC (the
 *     shared handler + the shared undo round-trip).
 */

import { describe, test, expect } from 'vitest';

import { EVENT_REGISTRY, EVENT_TYPES, RERUN_KEYS_FOR_EVENT } from '../../src/domain/events/registry.js';
import { mutateSettlement } from '../../src/domain/events/mutate.js';
import { captureEventUndoSnapshot, scrubUndoneEvent } from '../../src/domain/events/undoEvent.js';
import { NON_AUTHORABLE_EVENTS } from '../../src/components/settlement/eventComposer/EventComposerConstants.js';

const NOW = '2026-06-23T00:00:00.000Z';

function fixture() {
  return {
    name: 'Oakmere',
    tier: 'town',
    institutions: [],
    activeConditions: [],
    config: {},
    powerStructure: { factions: [{ id: 'faction.the_garrison', faction: 'The Garrison', power: 30 }] },
    npcs: [
      { id: 'npc_rise', name: 'Captain Mara', factionAffiliation: 'The Garrison', importance: 'notable', influence: 30, structuralRank: 3 },
      { id: 'npc_fall', name: 'Sergeant Voss', factionAffiliation: 'The Garrison', importance: 'pillar', influence: 70, structuralRank: 1 },
    ],
  };
}

const swapEvent = (type, id) => ({
  id,
  type,
  targetId: 'npc_rise',
  payload: { swapWithNpcId: 'npc_fall' },
  cause: 'player_action',
});

function applyThenUndo(before, event) {
  const undo = captureEventUndoSnapshot(before, event);
  const after = mutateSettlement({ settlement: before, event, now: NOW });
  const undone = scrubUndoneEvent({ ...after }, { event, undo });
  return { after, undone };
}

describe('#2c — composer offers ONE merged action', () => {
  test('PROMOTE_NPC is relabeled "Promote/Demote NPC"', () => {
    expect(EVENT_REGISTRY.PROMOTE_NPC.label).toBe('Promote/Demote NPC');
  });

  test('DEMOTE_NPC is hidden from the authoring menu but stays a registry type', () => {
    expect(NON_AUTHORABLE_EVENTS.has('DEMOTE_NPC')).toBe(true);
    expect(NON_AUTHORABLE_EVENTS.has('PROMOTE_NPC')).toBe(false);
    // Still first-class in the engine (back-compat for old logs + world sim).
    expect(EVENT_TYPES).toContain('DEMOTE_NPC');
    expect(typeof EVENT_REGISTRY.DEMOTE_NPC.stateDeltas).toBe('function');
    expect(RERUN_KEYS_FOR_EVENT.DEMOTE_NPC).toEqual(['npcs', 'powerStructure', 'narrative']);
  });
});

describe('#2c — the merged action applies the standing swap', () => {
  test('"Promote/Demote NPC" (PROMOTE_NPC) swaps standing between the two NPCs', () => {
    const before = fixture();
    const after = mutateSettlement({ settlement: before, event: swapEvent('PROMOTE_NPC', 'ev-pd'), now: NOW });
    const rise = after.npcs.find(n => n.id === 'npc_rise');
    const fall = after.npcs.find(n => n.id === 'npc_fall');
    // The two exchanged importance / influence / structuralRank.
    expect(rise.importance).toBe('pillar');
    expect(rise.influence).toBe(70);
    expect(rise.structuralRank).toBe(1);
    expect(fall.importance).toBe('notable');
    expect(fall.influence).toBe(30);
    expect(fall.structuralRank).toBe(3);
  });
});

describe('#2c — back-compat: an OLD DEMOTE_NPC event still applies + undoes', () => {
  test('DEMOTE_NPC applies the SAME swap PROMOTE_NPC does', () => {
    const before = fixture();
    const promoted = mutateSettlement({ settlement: before, event: swapEvent('PROMOTE_NPC', 'ev-p'), now: NOW });
    const demoted = mutateSettlement({ settlement: before, event: swapEvent('DEMOTE_NPC', 'ev-d'), now: NOW });
    // The shared handler — the polarity is narrative, so the field swap is identical.
    for (const id of ['npc_rise', 'npc_fall']) {
      const p = promoted.npcs.find(n => n.id === id);
      const d = demoted.npcs.find(n => n.id === id);
      expect(d.importance).toBe(p.importance);
      expect(d.influence).toBe(p.influence);
      expect(d.structuralRank).toBe(p.structuralRank);
    }
  });

  test('an OLD DEMOTE_NPC event undoes cleanly back to the pre-swap standing', () => {
    const before = fixture();
    const { after, undone } = applyThenUndo(before, swapEvent('DEMOTE_NPC', 'ev-old-demote'));
    // The swap landed...
    expect(after.npcs.find(n => n.id === 'npc_rise').importance).toBe('pillar');
    // ...and undo restored every standing field to the original.
    for (const orig of before.npcs) {
      const back = undone.npcs.find(n => n.id === orig.id);
      expect(back.importance).toBe(orig.importance);
      expect(back.influence).toBe(orig.influence);
      expect(back.structuralRank).toBe(orig.structuralRank);
    }
  });
});
