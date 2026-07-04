/**
 * tests/store/changeQueueFlushInvariants.test.js — Store cluster finding #6.
 *
 * The flush's drain → compute → commit ATOMICITY used to rest on prose
 * invariants alone ("suppress each executor's own write; the flush owns ONE
 * end-of-batch persist"). This adds cheap always-on STRUCTURAL guards
 * (assertFlushInvariant) at the load-bearing transitions so a future edit that
 * breaks the ordering FAILS LOUDLY — routing into the flush's own rollback —
 * instead of silently double-writing or clearing the queue on an unpersisted
 * state.
 *
 * These tests lock:
 *   1. The guard helper itself (throws on a false invariant, no-ops on true).
 *   2. The happy-path flush still passes every guard (the guards don't break a
 *      normal commit).
 *   3. A mid-replay violation (an executor that clears the suppress flag) is
 *      caught → the flush rolls back and leaves the queue intact + retryable.
 */
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn().mockResolvedValue(true) },
}));

import { saves } from '../../src/lib/saves.js';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import {
  createChangeQueueSlice,
  registerLinkExecutor,
  registerBatchCommit,
  assertFlushInvariant,
} from '../../src/store/changeQueueSlice.js';

const stubSlice = (set) => ({
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

function fixture() {
  return {
    tier: 'town', name: 'Stoneford', config: {},
    institutions: [{ id: 'inst_market', name: 'Market', status: 'active' }],
    npcs: [], factions: [], powerStructure: { factions: [] },
    neighbourNetwork: [], interSettlementRelationships: [],
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
  store.getState().refreshSystemState();
}

const addTavern = {
  type: 'event', humanLabel: 'Add tavern',
  payload: { event: { id: 'e1', type: 'ADD_INSTITUTION', targetId: 'tavern', payload: { label: 'Tavern', category: 'civic' } } },
};

describe('assertFlushInvariant helper (finding #6)', () => {
  test('throws a distinctive error on a false invariant', () => {
    expect(() => assertFlushInvariant(false, 'my-check'))
      .toThrow(/changeQueue flush invariant violated: my-check/);
  });
  test('no-ops on a true invariant', () => {
    expect(() => assertFlushInvariant(true, 'ok')).not.toThrow();
  });
});

describe('flush passes its structural guards on the happy path (finding #6)', () => {
  let store;
  beforeEach(() => {
    store = makeStore();
    bootCanon(store);
    registerLinkExecutor(null);
    registerBatchCommit(null);
    saves.update.mockReset().mockResolvedValue(true);
  });

  test('a normal event commit succeeds — guards do not break the flow', async () => {
    store.getState().queueChange('save_1', addTavern);
    const res = await store.getState().flushQueue('save_1');
    expect(res.ok).toBe(true);
    expect(res.committed).toBe(1);
    expect(store.getState().listQueuedChanges('save_1')).toHaveLength(0);
    expect(saves.update).toHaveBeenCalledTimes(1);
    // Suppress flag cleared by the finally block.
    expect(store.getState().flushSuppressPersist).toBe(false);
  });
});

describe('a mid-replay invariant violation rolls back cleanly (finding #6)', () => {
  let store;
  beforeEach(() => {
    store = makeStore();
    bootCanon(store);
    registerBatchCommit(vi.fn().mockResolvedValue(true));
    saves.update.mockReset().mockResolvedValue(true);
  });
  // registerLinkExecutor / registerBatchCommit are module-global; clear them so a
  // later suite in the same run never inherits this suite's broken executor.
  afterEach(() => {
    registerLinkExecutor(null);
    registerBatchCommit(null);
  });

  test('an executor that clears flushSuppressPersist trips the pre-commit guard → rollback, queue intact', async () => {
    const before = store.getState().settlement.institutions.length;
    // A broken cascade executor that (illegally) clears the suppress flag mid-
    // replay. Structurally this is exactly the double-write hazard the guard
    // exists to catch: were it not caught, the end-of-batch write would be a
    // second, un-suppressed persist.
    registerLinkExecutor(async () => {
      store.setState({ flushSuppressPersist: false });
      return { ok: true, affectedIds: ['save_1'] };
    });

    // Queue an event (mutates the settlement) THEN a link (runs the broken
    // executor), so a failed guard must roll the event back too.
    store.getState().queueChange('save_1', addTavern);
    store.getState().queueChange('save_1', {
      type: 'link', humanLabel: 'Link a neighbour',
      payload: { linkId: 'lnk_1', partnerName: 'Elsewhere' },
    });

    const res = await store.getState().flushQueue('save_1');
    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    // No partial apply: the event was rolled back.
    expect(store.getState().settlement.institutions.length).toBe(before);
    expect(store.getState().eventLog).toHaveLength(0);
    // The queue is intact → retryable.
    expect(store.getState().listQueuedChanges('save_1')).toHaveLength(2);
    // The flush cleared its flags in the finally block.
    expect(store.getState().flushSuppressPersist).toBe(false);
    expect(store.getState().changeQueueFlushing).toBe(false);
  });
});
