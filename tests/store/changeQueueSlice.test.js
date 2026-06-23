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
  registerBatchCommit,
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
    registerBatchCommit(null);
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
    // The link executor stands in for SettlementsPanel's cascade: it succeeds,
    // reports the (unchanged-for-this-test) settlement + the two affected rows.
    registerLinkExecutor(async () => ({ ok: true, settlement: store.getState().settlement, affectedIds: ['save_1', 'save_2'] }));
    // A cascade queue requires the atomic batch-commit; stub it as succeeding.
    registerBatchCommit(async () => true);
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

// ── Phase 4a.2: dual-row atomic commit (link / unlink / rename cascade) ────────
//
// A link/unlink writes TWO settlement rows (this settlement + the partner) and a
// rename's cascade can touch neighbour rows. The flush must commit the WHOLE
// affected-row set in ONE atomic write (the registered batch-commit), and a
// failed write must leave the queue intact + restore the pre-flush settlement so
// NEITHER row is partially applied.
describe('changeQueueSlice — dual-row atomic cascade commit', () => {
  let store;
  beforeEach(() => {
    store = makeStore();
    bootCanon(store);
    registerLinkExecutor(null);
    registerBatchCommit(null);
    saves.update.mockReset().mockResolvedValue(true);
  });

  test('a link commit routes through the ATOMIC batch-commit (one write set, both rows), not the single-row persist', async () => {
    const batchCommit = vi.fn().mockResolvedValue(true);
    // The cascade executor reports BOTH affected rows; the flush must hand
    // exactly that set to the single end-of-batch atomic commit.
    registerLinkExecutor(async () => ({ ok: true, settlement: store.getState().settlement, affectedIds: ['save_1', 'save_2'] }));
    registerBatchCommit(batchCommit);
    store.getState().queueChange('save_1', {
      type: 'link', humanLabel: 'Link Mossbridge',
      payload: { partnerSaveId: 'save_2', relType: 'ally', linkId: 'link_save_1_save_2', partnerName: 'Mossbridge' },
    });

    const res = await store.getState().flushQueue('save_1');
    expect(res.ok).toBe(true);
    // ONE atomic batch-commit, carrying BOTH rows…
    expect(batchCommit).toHaveBeenCalledTimes(1);
    const idsCommitted = batchCommit.mock.calls[0][0];
    expect(new Set(idsCommitted.map(String))).toEqual(new Set(['save_1', 'save_2']));
    // …and NOT the single-row persistSaveUpdate fast path.
    expect(saves.update).not.toHaveBeenCalled();
    // Queue cleared on success.
    expect(store.getState().listQueuedChanges('save_1')).toHaveLength(0);
  });

  test('a FAILED link commit KEEPS the queue and restores the pre-flush settlement (no partial apply to either row)', async () => {
    const preName = store.getState().settlement.name;
    // The batch-commit fails (it is the atomicity owner: it rolls BOTH rows back
    // locally and returns false). The flush must then restore the store + keep
    // the queue, so the retry runs from a clean base.
    registerLinkExecutor(async () => ({ ok: true, settlement: store.getState().settlement, affectedIds: ['save_1', 'save_2'] }));
    registerBatchCommit(async () => false);
    store.getState().queueChange('save_1', {
      type: 'link', humanLabel: 'Link Mossbridge',
      payload: { partnerSaveId: 'save_2', relType: 'ally', linkId: 'link_save_1_save_2', partnerName: 'Mossbridge' },
    });

    const res = await store.getState().flushQueue('save_1');
    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    // The queue survives the failure (retryable) and the settlement is restored.
    expect(store.getState().listQueuedChanges('save_1')).toHaveLength(1);
    expect(store.getState().settlement.name).toBe(preName);
    // The flavor chronicle line written during replay was rolled back too.
    expect(store.getState().eventLog.find(e => e.type === 'LINK_NEIGHBOUR')).toBeFalsy();
    expect(store.getState().flushSuppressPersist).toBe(false);
  });

  test('without a registered batch-commit a cascade queue REFUSES rather than half-writing', async () => {
    // The executor is present but the atomic commit is not — committing a link
    // here would corrupt the partner row, so the flush must refuse + keep queue.
    registerLinkExecutor(async () => ({ ok: true, settlement: store.getState().settlement, affectedIds: ['save_1', 'save_2'] }));
    registerBatchCommit(null);
    store.getState().queueChange('save_1', {
      type: 'unlink', humanLabel: 'Unlink Mossbridge',
      payload: { linkId: 'link_save_1_save_2', partnerId: 'save_2', partnerName: 'Mossbridge' },
    });
    const res = await store.getState().flushQueue('save_1');
    expect(res.ok).toBe(false);
    expect(store.getState().listQueuedChanges('save_1')).toHaveLength(1);
    expect(saves.update).not.toHaveBeenCalled();
  });

  test('syncActiveNeighbourFields reconciles the store network ONLY during a flush (so event + link orders converge)', () => {
    // Off-flush: a stray reconcile must not silently rewrite the live network.
    store.getState().syncActiveNeighbourFields({ neighbourNetwork: [{ id: 'x' }] });
    expect(store.getState().settlement.neighbourNetwork).toHaveLength(0);
    // During a flush the panel cascade pushes its neighbour result into the
    // store so a later event order builds on the link's network.
    store.setState({ flushSuppressPersist: true });
    store.getState().syncActiveNeighbourFields({
      neighbourNetwork: [{ id: 'save_2', linkId: 'link_save_1_save_2' }],
      interSettlementRelationships: [{ linkId: 'link_save_1_save_2', npcName: 'Envoy' }],
    });
    expect(store.getState().settlement.neighbourNetwork).toHaveLength(1);
    expect(store.getState().settlement.interSettlementRelationships).toHaveLength(1);
    store.setState({ flushSuppressPersist: false });
  });

  test('a rename commit is exactly ONE cloud write (the cascade batch-commit owns it; no second per-row persist)', async () => {
    const batchCommit = vi.fn().mockResolvedValue(true);
    registerLinkExecutor(async () => ({ ok: true, settlement: store.getState().settlement, affectedIds: ['save_1'] }));
    registerBatchCommit(batchCommit);
    store.getState().queueChange('save_1', {
      type: 'rename', humanLabel: 'Rename settlement to Ashford',
      payload: { renameType: 'settlement', targetId: 'save_1', oldName: 'Stoneford', newName: 'Ashford' },
    });

    const res = await store.getState().flushQueue('save_1');
    expect(res.ok).toBe(true);
    // The rename's store-side renameSettlement runs with flushSuppressPersist set,
    // so it does NOT fire its own persistSaveUpdate; the flush's single
    // end-of-batch batch-commit is the ONE write.
    expect(batchCommit).toHaveBeenCalledTimes(1);
    expect(saves.update).not.toHaveBeenCalled();
  });
});
