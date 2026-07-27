/**
 * undoFlatRowGuard.test.js — Wave R-3 lane A (atlas VI.10 #148, R-1 deferral).
 *
 * undoLastEvent assumed every eventLog row was an applyEvent-shaped entry
 * (`.event` + `beforeState`). The FLAT "library-row flavor" rows written by
 * destroySavedSettlement and renameSettlement carry no `.event`, so popping one:
 *   - assigned systemState = popped.beforeState (undefined),
 *   - dropped the record while the settlement blob kept its effect, and
 *   - PERSISTED the corruption (campaignState.systemState pickled to null).
 * Reproduced by probe on 2026-07-27 before the fix (ok:true, systemState
 * undefined, destruction record popped, corruption persisted).
 *
 * The chokepoint cure: undoLastEvent refuses typed (`entry_not_undoable`)
 * when the newest entry has no `beforeState`. But the refusal is a REFUSAL,
 * not a skip — undo only ever inspects the NEWEST entry, so a refused row
 * parked on top of the log JAMS every real event beneath it, permanently.
 * The rename row hit exactly that: one rename froze the whole timeline.
 *
 * The cure for the jam is the in-repo flavor precedent, not a weaker guard:
 * renameSettlement now stamps the settlement's OWN systemState as
 * beforeState/afterState (as recordCanonFlavorEntry already did), so the row
 * pops as a no-op and the refusal class shrinks to destroy-only. This file
 * pins both halves — the no-op pop, the un-jammed stack beneath it, the
 * per-lane stamp source (live vs saved-row snapshot), and the destroy row's
 * unchanged typed refusal.
 */
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

import { createSettlementSlice } from '../../src/store/settlementSlice.js';

const stubSlice = () => ({
  auth: { user: null, tier: 'free', loading: false },
  config: { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
  institutionToggles: {},
  categoryToggles: {},
  goodsToggles: {},
  servicesToggles: {},
  customContent: {},
  importedNeighbour: null,
  campaigns: [],
  campaignsLoaded: true,
  isTierAllowed: () => true,
  canSave: () => true,
  maxSaves: () => 50,
  setPurchaseModalOpen: () => {},
});

function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a) })));
}

const SYSTEM_STATE = {
  resilience: { value: 3 }, volatility: { value: 2 },
  externalThreat: { value: 1 }, resourcePressure: { value: 2 },
};

// A deliberately DIFFERENT snapshot, so a cross-settlement stamp is visible.
const OTHER_SYSTEM_STATE = {
  resilience: { value: 9 }, volatility: { value: 8 },
  externalThreat: { value: 7 }, resourcePressure: { value: 6 },
};

function seedActiveCanon(store) {
  store.setState(s => {
    s.savedSettlements = [{
      id: 'save-x', name: 'Doomed',
      settlement: { name: 'Testford', tier: 'town', institutions: [], npcs: [] },
    }];
    s.activeSaveId = 'save-x';
    s.settlement = { name: 'Testford', tier: 'town', institutions: [], npcs: [] };
    s.systemState = SYSTEM_STATE;
    s.phase = 'canon';
    s.eventLog = [];
  });
}

describe('undoLastEvent refuses flat library-row entries (VI.10 #148)', () => {
  let store;
  beforeEach(() => { store = makeStore(); seedActiveCanon(store); });

  test('a flat destroySavedSettlement row as newest entry refuses instead of corrupting', () => {
    const destroyed = store.getState().destroySavedSettlement('save-x', 'meteor', { confirmName: 'Testford' });
    expect(destroyed.ok).toBe(true);
    const before = store.getState().systemState;

    const result = store.getState().undoLastEvent();
    expect(result.ok).toBe(false);
    expect(result.action).toBe('undoLastEvent');
    expect(result.before.reason).toBe('entry_not_undoable');
    expect(result.before.entryType).toBe('DESTROY_SETTLEMENT');

    const after = store.getState();
    expect(after.systemState).toBe(before);
    expect(after.systemState).toEqual(SYSTEM_STATE);
    expect(after.eventLog).toHaveLength(1);
    expect(after.eventLog[0].type).toBe('DESTROY_SETTLEMENT');
    expect(after.settlement.status).toBe('destroyed');
    const row = after.savedSettlements[0];
    expect(row.campaignState.eventLog).toHaveLength(1);
  });

  test('registry-advertised flavor undo keeps working (beforeState is stamped)', () => {
    const recorded = store.getState().recordCanonFlavorEntry({
      type: 'OMEN', narrativeSummary: 'A comet crosses the night sky.',
    });
    expect(recorded).toBe(true);
    expect(store.getState().eventLog).toHaveLength(1);

    const result = store.getState().undoLastEvent();
    expect(result.ok).toBe(true);
    expect(store.getState().eventLog).toHaveLength(0);
    expect(store.getState().systemState).toEqual(SYSTEM_STATE);
  });

  test('canonical applyEvent-shaped entries still undo normally', () => {
    const priorState = { ...SYSTEM_STATE, volatility: { value: 5 } };
    store.setState(s => {
      s.eventLog = [{
        event: { id: 'evt-1', type: 'CUT_TRADE_ROUTE' },
        appliedAt: new Date().toISOString(),
        beforeState: priorState,
        afterState: SYSTEM_STATE,
      }];
    });
    const result = store.getState().undoLastEvent();
    expect(result.ok).toBe(true);
    expect(store.getState().eventLog).toHaveLength(0);
    expect(store.getState().systemState).toEqual(priorState);
  });
});

describe('the rename row pops as a no-op instead of jamming undo (#148 follow-on)', () => {
  let store;
  beforeEach(() => { store = makeStore(); seedActiveCanon(store); });

  test('a real canon rename writes a stamped row that pops with zero state change', () => {
    const recorded = store.getState().renameSettlement('save-x', 'Newford');
    expect(recorded).toBe(true);

    const log = store.getState().eventLog;
    expect(log).toHaveLength(1);
    expect(log[0].type).toBe('RENAME_SETTLEMENT');
    // The flavor stamp: the settlement's OWN state on both sides, so the pop
    // reassigns exactly what was already there.
    expect(log[0].beforeState).toEqual(SYSTEM_STATE);
    expect(log[0].afterState).toEqual(SYSTEM_STATE);
    expect(log[0].flavor).toBe(true);

    const before = store.getState().systemState;
    const result = store.getState().undoLastEvent();
    expect(result.ok).toBe(true);
    expect(result.before.poppedEventType).toBe('RENAME_SETTLEMENT');

    const after = store.getState();
    expect(after.eventLog).toHaveLength(0);
    expect(after.systemState).toEqual(SYSTEM_STATE);
    expect(after.systemState).toBe(before);
    // The rename itself is NOT reverted — the row is flavor, and undoing a
    // chronicle line was never advertised as undoing the name edit.
    expect(after.settlement.name).toBe('Newford');
  });

  test('THE JAM: a rename no longer freezes the real event beneath it', () => {
    const PRIOR = { ...SYSTEM_STATE, volatility: { value: 5 } };
    // A genuine applyEvent-shaped entry, then a rename stacked on top of it.
    store.setState(s => {
      s.eventLog = [{
        event: { id: 'evt-1', type: 'CUT_TRADE_ROUTE' },
        appliedAt: new Date().toISOString(),
        beforeState: PRIOR,
        afterState: SYSTEM_STATE,
      }];
    });
    expect(store.getState().renameSettlement('save-x', 'Newford')).toBe(true);
    expect(store.getState().eventLog).toHaveLength(2);
    expect(store.getState().eventLog[1].type).toBe('RENAME_SETTLEMENT');

    // Pop 1 — the rename row, a no-op.
    const first = store.getState().undoLastEvent();
    expect(first.ok).toBe(true);
    expect(store.getState().eventLog).toHaveLength(1);
    expect(store.getState().systemState).toEqual(SYSTEM_STATE);

    // Pop 2 — the real event finally reverses. Before the fix BOTH calls
    // returned ok:false / entry_not_undoable and systemState never moved.
    const second = store.getState().undoLastEvent();
    expect(second.ok).toBe(true);
    expect(second.before.poppedEventType).toBe('CUT_TRADE_ROUTE');
    expect(store.getState().eventLog).toHaveLength(0);
    expect(store.getState().systemState).toEqual(PRIOR);
  });

  test('renaming a NON-active save stamps THAT save\'s snapshot, never the live one', () => {
    store.setState(s => {
      s.savedSettlements.push({
        id: 'save-y', name: 'Yonder',
        settlement: { name: 'Yonder', tier: 'town', institutions: [], npcs: [] },
        campaignState: { phase: 'canon', eventLog: [], systemState: OTHER_SYSTEM_STATE },
      });
    });
    expect(store.getState().renameSettlement('save-y', 'Yonderhold')).toBe(true);

    // The live log is untouched — this rename never targeted the active save.
    expect(store.getState().eventLog).toHaveLength(0);
    const row = store.getState().savedSettlements.find(s => s.id === 'save-y');
    const stamped = row.campaignState.eventLog.at(-1);
    expect(stamped.type).toBe('RENAME_SETTLEMENT');
    expect(stamped.beforeState).toEqual(OTHER_SYSTEM_STATE);
    expect(stamped.beforeState).not.toEqual(SYSTEM_STATE);

    // …and it survives the lifecycle that makes it undoable: hydrateFromSave
    // restores cs.systemState alongside cs.eventLog, so the pop is a true
    // no-op on the OTHER settlement rather than a cross-world state swap.
    store.getState().hydrateFromSave(row);
    expect(store.getState().eventLog).toHaveLength(1);
    const popped = store.getState().undoLastEvent();
    expect(popped.ok).toBe(true);
    expect(store.getState().eventLog).toHaveLength(0);
    expect(store.getState().systemState).toEqual(OTHER_SYSTEM_STATE);
  });

  test('with no snapshot to stamp the row stays unstamped and the refusal guards it', () => {
    // A canon save carrying no persisted systemState: stamping `null` would let
    // the pop BLANK a systemState that hydrateFromSave had re-derived, so the
    // field is omitted on purpose and the typed refusal keeps holding the row.
    store.setState(s => {
      s.savedSettlements.push({
        id: 'save-z', name: 'Nowhere',
        settlement: { name: 'Nowhere', tier: 'town', institutions: [], npcs: [] },
        campaignState: { phase: 'canon', eventLog: [] },
      });
    });
    expect(store.getState().renameSettlement('save-z', 'Somewhere')).toBe(true);
    const row = store.getState().savedSettlements.find(s => s.id === 'save-z');
    const stamped = row.campaignState.eventLog.at(-1);
    expect(stamped.type).toBe('RENAME_SETTLEMENT');
    expect('beforeState' in stamped).toBe(false);

    store.getState().hydrateFromSave(row);
    const refused = store.getState().undoLastEvent();
    expect(refused.ok).toBe(false);
    expect(refused.before.reason).toBe('entry_not_undoable');
    expect(refused.before.entryType).toBe('RENAME_SETTLEMENT');
    expect(store.getState().eventLog).toHaveLength(1);
  });

  test('NEGATIVE CONTROL: the pre-fix unstamped row shape still jams the stack', () => {
    // Hand-built in the shape renameSettlement wrote BEFORE the stamp landed.
    // This is the defect, pinned: undo inspects only the newest entry, so an
    // unstamped row on top refuses forever and the real event under it can
    // never be reached. If this ever goes green with ok:true on call 1, the
    // chokepoint refusal has regressed into the original corruption.
    const PRIOR = { ...SYSTEM_STATE, volatility: { value: 5 } };
    store.setState(s => {
      s.eventLog = [
        {
          event: { id: 'evt-1', type: 'CUT_TRADE_ROUTE' },
          appliedAt: new Date().toISOString(),
          beforeState: PRIOR,
          afterState: SYSTEM_STATE,
        },
        {
          id: 'rename.save-x.1', type: 'RENAME_SETTLEMENT', targetId: 'Oldford',
          timestamp: new Date().toISOString(),
          narrativeSummary: 'Oldford is now known as Testford.',
        },
      ];
    });
    for (const _pass of [1, 2]) {
      const refused = store.getState().undoLastEvent();
      expect(refused.ok).toBe(false);
      expect(refused.before.reason).toBe('entry_not_undoable');
      expect(refused.before.entryType).toBe('RENAME_SETTLEMENT');
    }
    expect(store.getState().eventLog).toHaveLength(2);
    expect(store.getState().systemState).toEqual(SYSTEM_STATE);
    expect(store.getState().systemState).not.toEqual(PRIOR);
  });

  test('a draft rename records no row at all (the canon gate is unchanged)', () => {
    store.setState(s => {
      s.phase = 'draft';
      s.savedSettlements[0].campaignState = { phase: 'draft', eventLog: [] };
    });
    expect(store.getState().renameSettlement('save-x', 'Draftford')).toBe(false);
    expect(store.getState().savedSettlements[0].campaignState.eventLog).toHaveLength(0);
  });
});
