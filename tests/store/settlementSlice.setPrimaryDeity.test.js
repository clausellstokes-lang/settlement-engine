/**
 * settlementSlice.setPrimaryDeity — the STORE half of the embed-on-assign
 * bridge (Feature D / R1).
 *
 * Pins that the store action RESOLVES a deity ref against customContent (the
 * only place resolution may happen) and dispatches SET_PRIMARY_DEITY with the
 * snapshot already in the payload, so the committed settlement carries a
 * self-contained primaryDeitySnapshot. The resolution never happens in the
 * pulse — this test is the proof the boundary lives in the store layer.
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { customRefIdFromItem } from '../../src/lib/customRegistry.js';

const DEITY = {
  id: 'deit_1',
  localUid: 'lu_vael',
  name: 'Vael',
  alignmentAxis: 'good',
  temperamentAxis: 'warlike',
  rankAxis: 'major',
  domain: 'war',
  isCustom: true,
};

const stubSlice = (set, get) => ({
  auth: { user: null, tier: 'premium', loading: false },
  config: { settType: 'town' },
  institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
  customContent: { deities: [DEITY] },
  importedNeighbour: null,
  campaigns: [],
  campaignsLoaded: true,
  isTierAllowed: () => true,
  canSave: () => true,
  maxSaves: () => 50,
  setPurchaseModalOpen: () => {},
  canUseCustomContent: () => true,
});

function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a) })));
}

function fixture() {
  return {
    tier: 'town', name: 'Testford', population: 2000,
    config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
    institutions: [{ id: 'institution.temple', name: 'Temple', category: 'religious', status: 'active' }],
    economicState: { primaryExports: [], primaryImports: [] },
    powerStructure: { factions: [], conflicts: [] },
    npcs: [], activeConditions: [],
  };
}

describe('setPrimaryDeity — store-layer resolve + embed', () => {
  let store;
  beforeEach(() => {
    store = makeStore();
    store.setState(s => { s.settlement = fixture(); s.lastSeed = 'seed'; });
    store.getState().refreshSystemState();
  });

  test('resolves the ref and embeds a self-contained snapshot', () => {
    const ref = customRefIdFromItem(DEITY); // custom:lu_vael
    store.getState().setPrimaryDeity(ref);

    const config = store.getState().settlement.config;
    expect(config.primaryDeityRef).toBe(ref);
    expect(config.primaryDeitySnapshot).toMatchObject({
      _deityRef: ref,
      name: 'Vael',
      alignmentAxis: 'good',
      temperamentAxis: 'warlike',
      rankAxis: 'major',
      domain: 'war',
    });
  });

  test('the embedded snapshot is decoupled from later edits to the authored deity', () => {
    const ref = customRefIdFromItem(DEITY);
    store.getState().setPrimaryDeity(ref);
    // Mutate the authored deity in the store afterward.
    store.setState(s => { s.customContent.deities[0].rankAxis = 'cult'; s.customContent.deities[0].name = 'Renamed'; });
    const snap = store.getState().settlement.config.primaryDeitySnapshot;
    expect(snap.rankAxis).toBe('major');
    expect(snap.name).toBe('Vael');
  });

  test('passing null clears the assignment (back to dormant)', () => {
    const ref = customRefIdFromItem(DEITY);
    store.getState().setPrimaryDeity(ref);
    store.getState().setPrimaryDeity(null);
    const config = store.getState().settlement.config;
    expect('primaryDeityRef' in config).toBe(false);
    expect('primaryDeitySnapshot' in config).toBe(false);
  });

  test('an unknown ref is refused (no half-resolved embed)', () => {
    const res = store.getState().setPrimaryDeity('custom:lu_nonexistent');
    expect(res).toBeNull();
    expect('primaryDeitySnapshot' in store.getState().settlement.config).toBe(false);
  });
});
