/**
 * npcOpsCovenant.test.js — DESIGN_NPC_LIFECYCLE §2 store-integration pins: the three
 * typed NPC ops flow through the standing covenant (queueEdit → commitPendingEdits →
 * mutation → persist), each is COMMITTABLE (no silent drop), and they work POST-CANON
 * (edits change the future, never the past — unlike the canon-locked rename-npc).
 */
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));
import { saves } from '../../src/lib/saves.js';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { COMMITTABLE_EDIT_KINDS } from '../../src/domain/pendingEdits.js';

const stubSlice = () => ({
  auth: { user: null, tier: 'free', loading: false },
  config: { settType: 'town', culture: 'germanic' },
  institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
  customContent: {}, importedNeighbour: null, campaigns: [], campaignsLoaded: true,
  isTierAllowed: () => true, canSave: () => true, maxSaves: () => 50, setPurchaseModalOpen: () => {},
});
const makeStore = () => create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a) })));

function loadSettlement(store, phase = 'draft') {
  store.setState(s => {
    s.settlement = {
      id: 't1', name: 'Testholm', tier: 'town',
      npcs: [{ id: 'npc.bran', name: 'Bran', role: 'merchant', factionLink: 'guild-A', institutionId: 'market-A', personality: { dominant: 'honest' }, goal: { short: 'profit_from_change', long: 'expand_influence' } }],
    };
    s.phase = phase;
    s.activeSaveId = null;
  });
}

beforeEach(() => { saves.update.mockClear(); });

describe('NPC ops flow through the covenant (queueEdit → commit)', () => {
  test('all four NPC-op kinds are committable (no silent drop)', () => {
    for (const k of ['edit-npc', 'reassign-npc', 'stasis-npc', 'return-npc']) {
      expect(COMMITTABLE_EDIT_KINDS).toContain(k);
    }
  });

  test('EDIT_NPC: queue + commit writes the declared facet and syncs the native field', () => {
    const store = makeStore(); loadSettlement(store);
    const q = store.getState().queueEdit('edit-npc', { npcIndex: 0, facetKind: 'temperament', value: 'incorruptible' });
    expect(q).not.toBe(null); // admitted to the queue
    store.getState().commitPendingEdits();
    const npc = store.getState().settlement.npcs[0];
    expect(npc.facets.temperament).toBe('incorruptible'); // declared facet (facet law)
    expect(npc.personality.dominant).toBe('incorruptible'); // native field synced (propagates)
  });

  test('EDIT_NPC: an unknown facet kind is a safe no-op at commit', () => {
    const store = makeStore(); loadSettlement(store);
    store.getState().queueEdit('edit-npc', { npcIndex: 0, facetKind: 'hairColor', value: 'blue' });
    store.getState().commitPendingEdits();
    expect(store.getState().settlement.npcs[0].facets).toBeUndefined();
  });

  test('REASSIGN_NPC: seat-held fields move; relationship-bearing id is preserved', () => {
    const store = makeStore(); loadSettlement(store);
    store.getState().queueEdit('reassign-npc', { npcIndex: 0, target: { institutionId: 'temple-B', factionLink: 'faith-B' } });
    store.getState().commitPendingEdits();
    const npc = store.getState().settlement.npcs[0];
    expect(npc.institutionId).toBe('temple-B');
    expect(npc.factionLink).toBe('faith-B');
    expect(npc.id).toBe('npc.bran'); // id stable → people-held edges still find them
  });

  test('STASIS + RETURN: reversible lifecycle state through the covenant', () => {
    const store = makeStore(); loadSettlement(store);
    store.getState().queueEdit('stasis-npc', { npcIndex: 0, reason: 'journey' });
    store.getState().commitPendingEdits();
    expect(store.getState().settlement.npcs[0].stasis).toEqual({ reason: 'journey' });
    store.getState().queueEdit('return-npc', { npcIndex: 0 });
    store.getState().commitPendingEdits();
    expect(store.getState().settlement.npcs[0].stasis).toBeUndefined();
  });

  test("THE PARTY'S HAND: ransom/rescue stamp the release marker on a hostage; non-hostage is a safe no-op (§11)", () => {
    // DESIGN_THE_ROADS §11 — the two roads ops are committable and route through applyNpcOp,
    // stamping whereabouts.partyRelease (the marker the mover consumes). Hostages live in
    // canon campaigns, so this exercises the post-canon path.
    for (const k of ['ransom-npc', 'rescue-npc']) expect(COMMITTABLE_EDIT_KINDS).toContain(k);
    const store = makeStore();
    store.setState(s => {
      s.settlement = { id: 't1', name: 'Testholm', tier: 'town', npcs: [
        { id: 'npc.cap', name: 'Cap', role: 'merchant', whereabouts: { state: 'hostage', placeId: 'e', purposeKind: 'trade', sinceTick: 10, expectedReturnTick: null, missionId: 'road.t1.npc.cap.10' } },
        { id: 'npc.home', name: 'Homebody', role: 'ruler' },
      ] };
      s.phase = 'canon'; s.activeSaveId = null;
    });
    expect(store.getState().queueEdit('ransom-npc', { npcIndex: 0 })).not.toBe(null); // admitted post-canon
    store.getState().commitPendingEdits();
    expect(store.getState().settlement.npcs[0].whereabouts.partyRelease).toBe('ransom');
    store.getState().queueEdit('rescue-npc', { npcIndex: 0 });
    store.getState().commitPendingEdits();
    expect(store.getState().settlement.npcs[0].whereabouts.partyRelease).toBe('rescue');
    // A party op on a NON-hostage is refused inside applyNpcOp — no whereabouts appears.
    store.getState().queueEdit('ransom-npc', { npcIndex: 1 });
    store.getState().commitPendingEdits();
    expect(store.getState().settlement.npcs[1].whereabouts).toBeUndefined();
  });

  test('EDITS CHANGE THE FUTURE, NEVER THE PAST: the NPC ops work POST-CANON', () => {
    const store = makeStore(); loadSettlement(store, 'canon');
    // rename-npc is identity-locked post-canon (refused at the queue seam)…
    expect(store.getState().queueEdit('rename-npc', { npcIndex: 0, newName: 'Nope' })).toBe(null);
    // …but the lifecycle ops are explicitly future-changing and are admitted.
    expect(store.getState().queueEdit('edit-npc', { npcIndex: 0, facetKind: 'goal', value: 'restore_order' })).not.toBe(null);
    expect(store.getState().queueEdit('stasis-npc', { npcIndex: 0, reason: 'missing' })).not.toBe(null);
    store.getState().commitPendingEdits();
    const npc = store.getState().settlement.npcs[0];
    expect(npc.facets.goal).toBe('restore_order');
    expect(npc.goal.short).toBe('restore_order');
    expect(npc.stasis).toEqual({ reason: 'missing' });
  });
});
