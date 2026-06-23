/**
 * changeQueueSlice tests — the stage → commit contract.
 *
 * These lock the highest-stakes guarantees of the pending-changes queue:
 *   1. Apply QUEUES, it does not execute (the settlement is untouched until
 *      commit), and a queued order is cancellable by id.
 *   2. flushQueue applies every order IN ORDER (forward references between
 *      orders resolve because each replay threads off the prior result).
 *   3. The commit is ATOMIC: a failed persist LEAVES the queue intact and
 *      restores the pre-flush settlement (no partial apply), so a retry runs
 *      from a clean base.
 *   4. A successful flush returns the committed settlement for the soft-refresh
 *      (re-derive, not reload) and clears the queue.
 *   5. Post-canon, a committed link order records a timeline (chronicle) entry,
 *      generalizing the rename precedent.
 *
 * The store is assembled from the real settlement + change-queue slices plus
 * the minimal companion stubs settlementSlice reads through — the same pattern
 * as settlementSlice.test.js — so the executors under replay are the live ones.
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// persistSaveUpdate (the single cloud write the flush awaits) is just
// savesService.update under the hood. Mock that one module so we can assert
// call-count (atomicity: ONE write per commit) and drive a failure — the same
// seam persistSaveUpdate.unify.test.js uses. Must be declared BEFORE the slice
// imports so the mock is hoisted in front of them.
vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn().mockResolvedValue(true) },
}));

import { saves } from '../../src/lib/saves.js';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import {
  createChangeQueueSlice,
  registerLinkExecutor,
} from '../../src/store/changeQueueSlice.js';

const stubSlice = (set, get) => ({
  auth: { user: null, tier: 'free', loading: false },
  config: { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
  institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
  customContent: {},
  importedNeighbour: null,
  campaigns: [],
  campaignsLoaded: true,
  isTierAllowed: () => true,
  canSave: () => true,
  maxSaves: () => 50,
  setPurchaseModalOpen: () => {},
  // The savedSettlements mirror the flush + executors write through.
  savedSettlements: [],
  updateSavedSettlement: (id, partial) => set(state => {
    const idx = state.savedSettlements.findIndex(s => String(s.id) === String(id));
    if (idx !== -1) state.savedSettlements[idx] = { ...state.savedSettlements[idx], ...partial };
  }),
});

function makeStore() {
  return create(immer((...a) => ({
    ...stubSlice(...a),
    ...createSettlementSlice(...a),
    ...createChangeQueueSlice(...a),
  })));
}

/** Minimal canon settlement with one institution so ADD_NPC / REMOVE work. */
function fixture() {
  return {
    tier: 'town',
    name: 'Stoneford',
    config: {},
    institutions: [{ id: 'inst_market', name: 'Market', status: 'active' }],
    npcs: [],
    factions: [],
    powerStructure: { factions: [] },
    neighbourNetwork: [],
    interSettlementRelationships: [],
  };
}

function bootCanon(store) {
  store.setState({
    settlement: fixture(),
    activeSaveId: 'save_1',
    phase: 'canon',
    eventLog: [],
    savedSettlements: [{ id: 'save_1', name: 'Stoneford', settlement: fixture() }],
  });
  // Re-derive systemState so applyEvent's reconciliation has a base.
  store.getState().refreshSystemState();
}

describe('changeQueueSlice — staging', () => {
  let store;
  beforeEach(() => {
    store = makeStore();
    bootCanon(store);
    registerLinkExecutor(null);
    saves.update.mockReset().mockResolvedValue(true);
  });

  test('queueChange stages an order WITHOUT executing it', () => {
    const before = store.getState().settlement.institutions.length;
    const id = store.getState().queueChange('save_1', {
      type: 'event',
      humanLabel: 'Add a tavern',
      payload: { event: { id: 'e1', type: 'ADD_INSTITUTION', targetId: 'tavern', payload: { label: 'Tavern' } } },
    });
    expect(id).toMatch(/^ord_save_1_event_1$/);
    // The queue holds one order…
    expect(store.getState().listQueuedChanges('save_1')).toHaveLength(1);
    // …and NOTHING was applied: no institution added, no timeline entry.
    expect(store.getState().settlement.institutions.length).toBe(before);
    expect(store.getState().eventLog).toHaveLength(0);
  });

  test('queue is keyed per save (opening another never shows a foreign queue)', () => {
    store.getState().queueChange('save_1', { type: 'rename', humanLabel: 'a', payload: {} });
    expect(store.getState().listQueuedChanges('save_1')).toHaveLength(1);
    expect(store.getState().listQueuedChanges('save_2')).toHaveLength(0);
  });

  test('cancelQueuedChange removes one order by id, cancel-safe across re-add', () => {
    const a = store.getState().queueChange('save_1', { type: 'rename', humanLabel: 'a', payload: {} });
    const b = store.getState().queueChange('save_1', { type: 'rename', humanLabel: 'b', payload: {} });
    store.getState().cancelQueuedChange('save_1', a);
    // A re-add must NOT collide with the surviving order's id (counter, not length).
    const c = store.getState().queueChange('save_1', { type: 'rename', humanLabel: 'c', payload: {} });
    const ids = store.getState().listQueuedChanges('save_1').map(o => o.id);
    expect(ids).toEqual([b, c]);
    expect(new Set(ids).size).toBe(2);
  });
});

describe('changeQueueSlice — flush', () => {
  let store;
  beforeEach(() => {
    store = makeStore();
    bootCanon(store);
    registerLinkExecutor(null);
    saves.update.mockReset().mockResolvedValue(true);
  });

  test('flushQueue applies every order IN ORDER, then clears the queue', async () => {
    /* persist succeeds (default mock) */
    store.getState().queueChange('save_1', {
      type: 'event', humanLabel: 'Add tavern',
      payload: { event: { id: 'e1', type: 'ADD_INSTITUTION', targetId: 'tavern', payload: { label: 'Tavern', category: 'civic' } } },
    });
    store.getState().queueChange('save_1', {
      type: 'event', humanLabel: 'Add smithy',
      payload: { event: { id: 'e2', type: 'ADD_INSTITUTION', targetId: 'smithy', payload: { label: 'Smithy', category: 'craft' } } },
    });

    const res = await store.getState().flushQueue('save_1');
    expect(res.ok).toBe(true);
    expect(res.committed).toBe(2);
    // Both events applied, in order → two new timeline entries.
    expect(store.getState().eventLog).toHaveLength(2);
    expect(store.getState().eventLog[0].event.id).toBe('e1');
    expect(store.getState().eventLog[1].event.id).toBe('e2');
    // Queue cleared on success.
    expect(store.getState().listQueuedChanges('save_1')).toHaveLength(0);
    // Atomicity: ONE cloud write for the whole commit (not one per order).
    expect(saves.update).toHaveBeenCalledTimes(1);
  });

  test('a failed persist KEEPS the queue and restores the pre-flush settlement', async () => {
    saves.update.mockRejectedValueOnce(new Error("cloud down")); // persistSaveUpdate resolves false
    const beforeCount = store.getState().settlement.institutions.length;
    store.getState().queueChange('save_1', {
      type: 'event', humanLabel: 'Add tavern',
      payload: { event: { id: 'e1', type: 'ADD_INSTITUTION', targetId: 'tavern', payload: { label: 'Tavern', category: 'civic' } } },
    });

    const res = await store.getState().flushQueue('save_1');
    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    // No partial apply: settlement + timeline restored to the pre-flush base.
    expect(store.getState().settlement.institutions.length).toBe(beforeCount);
    expect(store.getState().eventLog).toHaveLength(0);
    // The queue is intact, so the commit is immediately retryable.
    expect(store.getState().listQueuedChanges('save_1')).toHaveLength(1);
    // The suppress flag was cleared by the finally block.
    expect(store.getState().flushSuppressPersist).toBe(false);
  });

  test('a successful flush returns the committed settlement for the soft-refresh', async () => {
        store.getState().queueChange('save_1', {
      type: 'event', humanLabel: 'Add tavern',
      payload: { event: { id: 'e1', type: 'ADD_INSTITUTION', targetId: 'tavern', payload: { label: 'Tavern', category: 'civic' } } },
    });
    const res = await store.getState().flushQueue('save_1');
    // The returned settlement IS the live store settlement (so detail can be
    // re-derived from it without a reload), and reflects the committed change.
    expect(res.settlement).toBe(store.getState().settlement);
    expect(res.settlement.institutions.length).toBeGreaterThan(1);
  });

  test('post-canon, a committed link order records a chronicle entry', async () => {
        // The link executor stands in for SettlementsPanel's cascade: it succeeds
    // and reports the (unchanged-for-this-test) settlement back.
    registerLinkExecutor(async () => ({ ok: true, settlement: store.getState().settlement }));
    store.getState().queueChange('save_1', {
      type: 'link', humanLabel: 'Link Mossbridge',
      payload: { linkedSaveId: 'save_2', relType: 'ally', partnerName: 'Mossbridge', linkId: 'link_1_2' },
    });

    const res = await store.getState().flushQueue('save_1');
    expect(res.ok).toBe(true);
    const entry = store.getState().eventLog.find(e => e.type === 'LINK_NEIGHBOUR');
    expect(entry).toBeTruthy();
    expect(entry.narrativeSummary).toContain('Mossbridge');
    // Flavor-only + undo-safe: carries a beforeState so undo is a no-op delta.
    expect(entry.flavor).toBe(true);
    expect('beforeState' in entry).toBe(true);
  });

  test('recordCanonFlavorEntry is a no-op off canon (draft never logs)', () => {
    store.setState({ phase: 'draft' });
    const recorded = store.getState().recordCanonFlavorEntry({
      type: 'LINK_NEIGHBOUR', narrativeSummary: 'x',
    });
    expect(recorded).toBe(false);
    expect(store.getState().eventLog).toHaveLength(0);
  });
});
