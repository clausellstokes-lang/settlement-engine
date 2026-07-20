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

  test('THE RECALL RIDER: recall-npc stamps whereabouts.recall on a traveller; returning/hostage/non-traveller are safe no-ops (V-24a)', () => {
    // DESIGN_VISION_WAVE V-24a — the recall rider is committable and routes through applyNpcOp,
    // stamping whereabouts.recall (the marker the roads mover consumes to engage the return leg
    // early). Only an outbound/visiting traveller is a valid target.
    expect(COMMITTABLE_EDIT_KINDS).toContain('recall-npc');
    const store = makeStore();
    store.setState(s => {
      s.settlement = { id: 't1', name: 'Testholm', tier: 'town', npcs: [
        { id: 'npc.out', name: 'Outbound', role: 'envoy', whereabouts: { state: 'traveling', placeId: 'e', purposeKind: 'diplomacy', sinceTick: 10, expectedReturnTick: 40, missionId: 'road.t1.npc.out.10' } },
        { id: 'npc.vis', name: 'Visiting', role: 'merchant', whereabouts: { state: 'visiting', placeId: 'e', purposeKind: 'trade', sinceTick: 8, expectedReturnTick: 36, missionId: 'road.t1.npc.vis.8' } },
        { id: 'npc.back', name: 'Homeward', role: 'scholar', whereabouts: { state: 'returning', placeId: 'e', purposeKind: 'verification', sinceTick: 6, expectedReturnTick: 20, missionId: 'road.t1.npc.back.6' } },
        { id: 'npc.cap', name: 'Cap', role: 'merchant', whereabouts: { state: 'hostage', placeId: 'e', purposeKind: 'trade', sinceTick: 10, expectedReturnTick: null, missionId: 'road.t1.npc.cap.10' } },
        { id: 'npc.home', name: 'Homebody', role: 'ruler' },
      ] };
      s.phase = 'canon'; s.activeSaveId = null;
    });
    // An outbound traveller: admitted post-canon, marker stamped.
    expect(store.getState().queueEdit('recall-npc', { npcIndex: 0 })).not.toBe(null);
    store.getState().commitPendingEdits();
    expect(store.getState().settlement.npcs[0].whereabouts.recall).toBe(true);
    // A visiting traveller: marker stamped.
    store.getState().queueEdit('recall-npc', { npcIndex: 1 });
    store.getState().commitPendingEdits();
    expect(store.getState().settlement.npcs[1].whereabouts.recall).toBe(true);
    // A returning traveller (already homeward), a hostage, and a non-traveller are refused inside
    // applyNpcOp — the recall marker never appears on any of them.
    for (const idx of [2, 3, 4]) {
      store.getState().queueEdit('recall-npc', { npcIndex: idx });
      store.getState().commitPendingEdits();
      expect(store.getState().settlement.npcs[idx].whereabouts?.recall).toBeUndefined();
    }
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
