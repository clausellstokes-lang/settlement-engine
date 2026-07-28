/**
 * uncanonizeTombstone.test.js — Wave R-1 (atlas queue #25): the SESSION-ONLY
 * eventLog tombstone that makes canonize a real in-session inverse of uncanonize.
 *
 * The defect: uncanonize() wiped the canon eventLog irrecoverably while the
 * operation registry advertises canonize as its undo token. The cure: uncanonize
 * tombstones the log (store state, in NO persistence whitelist) keyed to the
 * world's identity; canonize restores it when — and only when — the key matches.
 * Across a reload the tombstone is gone by construction, so the registry's
 * 'action-partial' claim stays exactly true.
 *
 * PINS:
 *   A. uncanonize → canonize round trip restores the canon timeline in-session.
 *   B. reload-shaped state (a fresh store) does NOT falsely claim restore.
 *   C. a foreign-settlement tombstone never applies (and is left untouched).
 *   D. a draft-phase uncanonize never overwrites a live tombstone.
 *   E. the tombstone never enters a persistence payload (pickleCampaignState +
 *      the persisted save entry).
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// Keep the durable-persistence seam quiet (mirrors actionEnvelope.test.js):
// persistActiveSaveLifecycle drives persistSaveUpdate → saves.update.
vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

import { createSettlementSlice } from '../../src/store/settlementSlice.js';
// Harness derivation on the real path (the retired `refreshSystemState` store
// action was a harness-only door — owner queue #21).
import { deriveSystemState } from '../../src/domain/state/deriveSystemState.js';
import { pickleCampaignState, uncanonizeTombstoneKey } from '../../src/store/settlementSliceHelpers.js';

const stubSlice = (set, get) => ({
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

function fixture(name = 'Testford') {
  return {
    tier: 'town',
    name,
    population: 2000,
    config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
    institutions: [
      { id: 'institution.granary', name: 'Granary', category: 'civic', status: 'active' },
    ],
    economicState: { primaryExports: [], primaryImports: [] },
    powerStructure: { factions: [{ id: 'faction.council', name: 'Council' }], conflicts: [] },
    npcs: [],
    activeConditions: [],
  };
}

const DAMAGE = {
  id: 'tomb-ev1', type: 'DAMAGE_INSTITUTION', targetId: 'institution.granary',
  payload: { severity: 0.5 }, cause: 'player_action',
};

/** Boot a store holding an active save so persist paths run end-to-end. */
function seededStore({ name = 'Testford', saveId = 'save-1' } = {}) {
  const store = makeStore();
  store.setState(s => {
    s.settlement = fixture(name);
    s.lastSeed = 'tomb-seed';
    s.activeSaveId = saveId;
    s.savedSettlements = [{ id: saveId, name, settlement: fixture(name) }];
    s.systemState = deriveSystemState(s.settlement);
  });
  return store;
}

describe('uncanonize tombstone — the in-session canonize inverse (Wave R-1)', () => {
  let store;
  beforeEach(() => { store = seededStore(); });

  test('PIN A: uncanonize → canonize restores the canon timeline in-session', () => {
    store.getState().canonize();
    store.getState().applyEvent(DAMAGE);
    expect(store.getState().eventLog).toHaveLength(1);

    store.getState().uncanonize();
    expect(store.getState().eventLog).toEqual([]);
    expect(store.getState().phase).toBe('draft');
    expect(store.getState()._uncanonizeTombstone?.log).toHaveLength(1);

    store.getState().canonize();
    const s = store.getState();
    expect(s.phase).toBe('canon');
    expect(s.eventLog).toHaveLength(1);
    expect(s.eventLog[0].event?.id ?? s.eventLog[0].id).toBe('tomb-ev1');
    // Consumed: a second uncanonize→canonize cycle stashes the CURRENT log fresh.
    expect(s._uncanonizeTombstone).toBeNull();
  });

  test('PIN A2: the restored timeline is what persists (not the wipe)', () => {
    store.getState().canonize();
    store.getState().applyEvent(DAMAGE);
    store.getState().uncanonize();
    store.getState().canonize();
    const save = store.getState().savedSettlements.find(x => String(x.id) === 'save-1');
    expect(save.campaignState.eventLog).toHaveLength(1);
    expect(save.campaignState.phase).toBe('canon');
  });

  test('PIN B: a fresh store (reload-shaped state) does NOT restore', () => {
    store.getState().canonize();
    store.getState().applyEvent(DAMAGE);
    store.getState().uncanonize();

    // Same world identity, brand-new store — exactly what a reload produces:
    // the tombstone is store state, so it does not exist here.
    const reloaded = seededStore();
    expect(reloaded.getState()._uncanonizeTombstone).toBeNull();
    reloaded.getState().canonize();
    expect(reloaded.getState().eventLog).toEqual([]);
  });

  test('PIN C: a foreign-settlement tombstone never applies and is left untouched', () => {
    store.getState().canonize();
    store.getState().applyEvent(DAMAGE);
    store.getState().uncanonize();
    const tomb = store.getState()._uncanonizeTombstone;
    expect(tomb?.log).toHaveLength(1);

    // Switch the SAME store to a different save + settlement (hydrate-shaped).
    store.setState(s => {
      s.activeSaveId = 'save-2';
      s.settlement = fixture('Otherholm');
      s.phase = 'draft';
      s.eventLog = [];
      s.canonizedAt = null;
    });
    store.getState().canonize();
    expect(store.getState().eventLog).toEqual([]);
    // The foreign tombstone is neither applied nor consumed.
    expect(store.getState()._uncanonizeTombstone).toEqual(tomb);
  });

  test('PIN D: a draft-phase uncanonize never overwrites a live tombstone', () => {
    store.getState().canonize();
    store.getState().applyEvent(DAMAGE);
    store.getState().uncanonize();          // real canon→draft: stashes 1 event
    store.getState().uncanonize();          // draft no-op: must NOT stash the empty log
    expect(store.getState()._uncanonizeTombstone?.log).toHaveLength(1);
    store.getState().canonize();
    expect(store.getState().eventLog).toHaveLength(1);
  });

  test('PIN E: the tombstone never enters a persistence payload', () => {
    store.getState().canonize();
    store.getState().applyEvent(DAMAGE);
    store.getState().uncanonize();
    expect(store.getState()._uncanonizeTombstone).not.toBeNull();

    // The campaignState pickle is a strict whitelist — no tombstone key.
    const pickled = pickleCampaignState(store.getState());
    expect(Object.keys(pickled)).not.toContain('_uncanonizeTombstone');

    // The persisted save entry (updateSavedSettlement path) carries none either.
    const save = store.getState().savedSettlements.find(x => String(x.id) === 'save-1');
    expect(JSON.stringify(save)).not.toContain('_uncanonizeTombstone');
  });

  test('identity key derives from save + name + generation stamp', () => {
    const key = uncanonizeTombstoneKey({
      activeSaveId: 'save-9', settlement: { name: 'Keld' }, generatedAt: '2026-07-01T00:00:00Z',
    });
    expect(key).toBe('save-9::Keld::2026-07-01T00:00:00Z');
    // The unsaved-draft shape still yields a stable, matchable key.
    expect(uncanonizeTombstoneKey({ activeSaveId: null, settlement: null, generatedAt: null }))
      .toBe('::::');
  });
});
