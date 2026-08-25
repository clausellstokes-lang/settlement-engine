/**
 * addPlacementGate.test.js — store-hooks-state-7 pin.
 *
 * useMapBridge documents addPlacement as "the authoritative gate (campaign / canon
 * / no-duplicate)" and branches on { ok:false, reason } to toast a refusal — but
 * the store placed UNCONDITIONALLY and returned undefined, so a settlementPlaced
 * bridge event that bypassed WorldMap.handleDrop's pre-checks (a direct FMG
 * placement, a re-entrant echo) mutated placements with NO gate, and the documented
 * refusal copy was dead code. The gate now lives in the store, mirroring handleDrop's
 * three checks, so both entry points share ONE authority.
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/analytics.js', async (orig) => {
  const actual = await orig();
  return { ...actual, track: vi.fn() };
});

import { createMapSlice } from '../../src/store/mapSlice.js';

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: k => data.get(String(k)) ?? null,
    setItem: (k, v) => { data.set(String(k), String(v)); },
    removeItem: k => { data.delete(String(k)); },
    clear: () => { data.clear(); },
  };
}

const makeStore = () => create(immer((...a) => ({ ...createMapSlice(...a) })));
const placements = store => store.getState().mapState.placements;

function seed(store, { canon = true } = {}) {
  store.setState(s => {
    s.activeCampaignId = 'camp-1';
    s.savedSettlements = [{ id: 'ash', name: 'Ashford', campaignState: { phase: canon ? 'canon' : 'draft' } }];
  });
}

describe('addPlacement authoritative gate (store-hooks-state-7)', () => {
  beforeEach(() => { installLocalStorage(); });

  test('no active campaign → { ok:false, reason:"no-campaign" } and NO mutation', () => {
    const store = makeStore(); // activeCampaignId unset
    const res = store.getState().addPlacement({ burgId: 'b1', settlementId: 'ash', x: 1, y: 2 });
    expect(res).toEqual({ ok: false, reason: 'no-campaign' });
    expect(Object.keys(placements(store))).toHaveLength(0);
  });

  test('a NON-canon settlement → { ok:false, reason:"not-canon" } and NO mutation', () => {
    const store = makeStore();
    seed(store, { canon: false });
    const res = store.getState().addPlacement({ burgId: 'b1', settlementId: 'ash', x: 1, y: 2 });
    expect(res).toEqual({ ok: false, reason: 'not-canon' });
    expect(Object.keys(placements(store))).toHaveLength(0);
  });

  test('a canon settlement into an active campaign PLACES and returns { ok:true }', () => {
    const store = makeStore();
    seed(store);
    const res = store.getState().addPlacement({ burgId: 'b1', settlementId: 'ash', x: 1, y: 2, cellId: 'c1' });
    expect(res).toEqual({ ok: true });
    expect(placements(store).b1).toMatchObject({ settlementId: 'ash', x: 1, y: 2, cellId: 'c1' });
  });

  test('a DUPLICATE settlementId → { ok:false, reason:"duplicate" } and the first placement survives', () => {
    const store = makeStore();
    seed(store);
    store.getState().addPlacement({ burgId: 'b1', settlementId: 'ash', x: 1, y: 2 });
    const res = store.getState().addPlacement({ burgId: 'b2', settlementId: 'ash', x: 5, y: 6 });
    expect(res).toEqual({ ok: false, reason: 'duplicate' });
    expect(placements(store).b2).toBeUndefined();
    expect(placements(store).b1).toBeTruthy();
  });

  test('an empty burg (no settlementId) skips canon/duplicate but still needs a campaign', () => {
    const store = makeStore();
    seed(store);
    expect(store.getState().addPlacement({ burgId: 'empty1', x: 3, y: 4 })).toEqual({ ok: true });
    expect(placements(store).empty1).toBeTruthy();

    const noCamp = makeStore();
    expect(noCamp.getState().addPlacement({ burgId: 'e2', x: 1, y: 1 })).toEqual({ ok: false, reason: 'no-campaign' });
  });

  test('a rejected placement pushes NO undo snapshot (the gate returns before snapshotForUndo)', () => {
    const store = makeStore();
    seed(store, { canon: false });
    store.getState().addPlacement({ burgId: 'b1', settlementId: 'ash', x: 1, y: 2 });
    expect(store.getState().mapUndoStack || []).toHaveLength(0);
  });
});
