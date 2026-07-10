import { describe, expect, test } from 'vitest';

import {
  pruneNpcStates,
  NPC_STATE_PRUNE_GRACE_TICKS,
  npcId,
} from '../../src/domain/worldPulse/index.js';

// B03 finding #1: npcStates accumulate ghosts forever when a roster is edited,
// an NPC is renamed, or a settlement is removed. pruneNpcStates mirrors
// pruneFactionStates — a grace window before a roster-absent state is dropped,
// and pruned ids stripped from surviving rivalryTargets[].

function snapshotWith(npcsBySettlement) {
  return {
    settlements: Object.entries(npcsBySettlement).map(([id, npcs]) => ({
      id,
      settlement: { npcs },
    })),
  };
}

function stateFor(settlementId, npc, index, patch = {}) {
  return {
    npcId: npcId(settlementId, npc, index),
    settlementId,
    name: npc.name,
    rivalryTargets: [],
    ...patch,
  };
}

describe('pruneNpcStates — ghost reconciliation', () => {
  test('a state still on the roster is untouched (identity no-op)', () => {
    const npc = { name: 'Tam' };
    const id = npcId('a', npc, 0);
    const worldState = { npcStates: { [id]: stateFor('a', npc, 0) } };
    const snapshot = snapshotWith({ a: [npc] });
    const next = pruneNpcStates(worldState, snapshot, { tick: 10 });
    expect(next).toBe(worldState); // same reference: nothing changed
  });

  test('a roster-absent state is stamped with missingSinceTick inside the grace window, not dropped', () => {
    const live = { name: 'Tam' };
    const ghostId = 'a:ghost';
    const worldState = {
      npcStates: {
        [npcId('a', live, 0)]: stateFor('a', live, 0),
        [ghostId]: { npcId: ghostId, settlementId: 'a', name: 'Gone', rivalryTargets: [] },
      },
    };
    const snapshot = snapshotWith({ a: [live] });
    const next = pruneNpcStates(worldState, snapshot, { tick: 5 });
    expect(next.npcStates[ghostId]).toBeTruthy();
    expect(next.npcStates[ghostId].missingSinceTick).toBe(5);
  });

  test('a roster-absent state past the grace window is pruned and stripped from rivalryTargets', () => {
    const live = { name: 'Tam' };
    const liveId = npcId('a', live, 0);
    const ghostId = 'a:ghost';
    const worldState = {
      npcStates: {
        [liveId]: stateFor('a', live, 0, { rivalryTargets: [ghostId, 'a:other'] }),
        [ghostId]: { npcId: ghostId, settlementId: 'a', name: 'Gone', rivalryTargets: [], missingSinceTick: 2 },
      },
    };
    const snapshot = snapshotWith({ a: [live] });
    const next = pruneNpcStates(worldState, snapshot, { tick: 2 + NPC_STATE_PRUNE_GRACE_TICKS });
    expect(next.npcStates[ghostId]).toBeUndefined();
    expect(next.npcStates[liveId].rivalryTargets).toEqual(['a:other']);
  });

  test('a ghost whose settlement was removed entirely is pruned once past the grace window', () => {
    const aliveNpc = { name: 'Tam' };
    const goneNpc = { name: 'Vex' };
    const goneId = npcId('b', goneNpc, 0);
    const worldState = {
      npcStates: {
        [npcId('a', aliveNpc, 0)]: stateFor('a', aliveNpc, 0),
        [goneId]: stateFor('b', goneNpc, 0, { missingSinceTick: 0 }),
      },
    };
    // Settlement 'b' is no longer in the snapshot at all.
    const snapshot = snapshotWith({ a: [aliveNpc] });
    const next = pruneNpcStates(worldState, snapshot, { tick: NPC_STATE_PRUNE_GRACE_TICKS });
    expect(next.npcStates[goneId]).toBeUndefined();
  });

  test('a previously-missing state that returns to the roster clears its absence stamp', () => {
    const npc = { name: 'Tam' };
    const id = npcId('a', npc, 0);
    const worldState = {
      npcStates: { [id]: stateFor('a', npc, 0, { missingSinceTick: 3 }) },
    };
    const snapshot = snapshotWith({ a: [npc] });
    const next = pruneNpcStates(worldState, snapshot, { tick: 9 });
    expect(next.npcStates[id]).toBeTruthy();
    expect(next.npcStates[id].missingSinceTick).toBeUndefined();
  });

  test('empty npcStates returns the worldState unchanged', () => {
    const worldState = { npcStates: {} };
    expect(pruneNpcStates(worldState, snapshotWith({ a: [] }), { tick: 1 })).toBe(worldState);
  });
});
