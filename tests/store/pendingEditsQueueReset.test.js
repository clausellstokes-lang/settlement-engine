/**
 * tests/store/pendingEditsQueueReset.test.js — surface finding: the
 * pendingEditsQueue survived every settlement-identity swap.
 *
 * hydrateFromSave / generateSettlement / clearSettlement / setSettlement all
 * reset pendingPreview/pendingChange but never pendingEditsQueue, so an
 * inline edit queued against settlement A (inlineEdit is default-on) sat in
 * the bar and committed against whatever settlement was live at commit time —
 * a rename staged for Mossbridge landed on Stoneford.
 *
 * These tests pin the reset at all four identity-swap sites, plus the
 * headline wrong-settlement commit scenario.
 */
import { describe, test, expect, beforeEach } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createSettlementSlice } from '../../src/store/settlementSlice.js';

// Minimal companion slices so settlementSlice's reads don't crash — mirrors
// the settlementSlice.test.js / worldConditionsRegen harnesses. The config
// forces an empty stressor pool so generateSettlement runs deterministically
// small.
const stubSlice = () => ({
  auth: { user: null, tier: 'free', loading: false },
  config: {
    settType: 'town',
    culture: 'germanic',
    tradeRouteAccess: 'road',
    monsterThreat: 'frontier',
    selectedStressesRandom: false,
    selectedStresses: [],
  },
  institutionToggles: {},
  categoryToggles: {},
  goodsToggles: {},
  servicesToggles: {},
  customContent: {},
  importedNeighbour: null,
  campaigns: [],
  campaignsLoaded: true,
  // AI session slots normally owned by aiSlice — present so hydrateFromSave
  // can reset them on the shared store.
  aiSettlement: null,
  aiDailyLife: null,
  aiDataVersion: null,
  aiSourceFingerprint: null,
  showNarrative: false,
  isTierAllowed: () => true,
  canSave: () => true,
  maxSaves: () => 50,
  setPurchaseModalOpen: () => {},
});

function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a) })));
}

function bareSettlement(name) {
  return { name, tier: 'town', population: 1000, institutions: [], powerStructure: { factions: [] }, npcs: [] };
}

const saveB = {
  id: 'save-b',
  settlement: bareSettlement('Stoneford'),
  campaignState: { phase: 'draft', eventLog: [], locks: {} },
};

describe('pendingEditsQueue resets on settlement identity swaps', () => {
  let store;
  beforeEach(() => {
    store = makeStore();
    store.setState(s => { s.settlement = bareSettlement('Mossbridge'); });
    store.getState().queueEdit('rename-settlement', { newName: 'New Mossbridge' });
    expect(store.getState().pendingEditsQueue).toHaveLength(1);
  });

  test('hydrateFromSave drops edits queued against the previously-open settlement', () => {
    store.getState().hydrateFromSave(saveB);
    expect(store.getState().pendingEditsQueue).toHaveLength(0);
  });

  test('a stale queued rename can no longer commit against the newly-opened save', () => {
    store.getState().hydrateFromSave(saveB);
    store.getState().commitPendingEdits();
    // Before the fix this renamed Stoneford to "New Mossbridge".
    expect(store.getState().settlement.name).toBe('Stoneford');
  });

  test('clearSettlement drops the queue', () => {
    store.getState().clearSettlement();
    expect(store.getState().pendingEditsQueue).toHaveLength(0);
  });

  test('setSettlement (draft restore) drops the queue', () => {
    store.getState().setSettlement(bareSettlement('Recovered Draft'));
    expect(store.getState().pendingEditsQueue).toHaveLength(0);
  });

  test('generateSettlement (regeneration) drops the queue', async () => {
    await store.getState().generateSettlement('pe-reset-seed-1');
    expect(store.getState().settlement).toBeTruthy();
    expect(store.getState().pendingEditsQueue).toHaveLength(0);
  });
});
