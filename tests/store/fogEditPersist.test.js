/**
 * fogEditPersist.test.js — DOOR 2 the applyFogEdit persist triple + dormancy (THE TABLE LAYER).
 *
 * applyFogEdit writes the blob-resident settlement.fogSessions through the applyMapEdit persist
 * idiom (stamp editedAt → sync the in-memory save entry → persistSaveUpdate), so a fog reveal
 * never GHOSTS on reload. These pins assert:
 *   (a) live + in-memory entry + cloud write + reload all carry the reveal;
 *   (b) DORMANCY — clearing to null DROPS the container ⇒ the blob reloads byte-identical to
 *       no-fog (drop-when-empty), never a hollow {};
 *   (c) COSMETIC-ALWAYS — it writes on a CANON-locked save (no canon guard);
 *   (d) content untouched beyond the container; guards (unknown id ⇒ no write).
 */
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

import { saves } from '../../src/lib/saves.js';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { createFogEditSlice } from '../../src/store/fogEditSlice.js';

const stubSlice = () => ({
  auth: { user: null, tier: 'free', loading: false },
  config: { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
  institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
  customContent: {}, importedNeighbour: null, campaigns: [], campaignsLoaded: true,
  isTierAllowed: () => true, canSave: () => true, maxSaves: () => 50, setPurchaseModalOpen: () => {},
});

function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a), ...createFogEditSlice(...a) })));
}

function fixture() {
  return {
    id: 'town.fogton', tier: 'town', name: 'Fogton', population: 1500,
    config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
    institutions: [
      { id: 'institution.granary', name: 'Granary', category: 'civic', status: 'active' },
      { id: 'institution.temple', name: 'Temple', category: 'religious', status: 'active' },
    ],
    economicState: { primaryExports: [], primaryImports: [] },
    powerStructure: { factions: [{ id: 'faction.council', name: 'Council' }], conflicts: [] },
    npcs: [], activeConditions: [],
  };
}

const SAVE_ID = 'save-fog-1';
const FOG = { 'friday-game': { name: 'Friday Game', districts: ['dA'], buildings: ['cat:granary'] } };

function withActiveSave(store) {
  const entry = {
    id: SAVE_ID, name: 'Fogton', tier: 'town',
    settlement: structuredClone(fixture()),
    campaignState: { phase: 'draft', eventLog: [], systemState: {}, editedAt: null },
    timestamp: '2020-01-01T00:00:00.000Z',
  };
  store.setState(s => {
    s.settlement = structuredClone(fixture());
    s.savedSettlements = [entry];
    s.activeSaveId = SAVE_ID;
    s.phase = 'draft';
    s.eventLog = [];
    s.systemState = {};
    s.editedAt = null;
  });
}

const persistedEntry = (store) => store.getState().savedSettlements.find(s => s.id === SAVE_ID);
function reloadInto(entry) {
  const fresh = makeStore();
  fresh.getState().hydrateFromSave(entry);
  return fresh.getState().settlement;
}
const stableJson = (v) => JSON.stringify(v);

beforeEach(() => { saves.update.mockClear(); });

describe('applyFogEdit — the persist triple', () => {
  let store;
  beforeEach(() => { store = makeStore(); withActiveSave(store); });

  test('live + entry + editedAt + cloud + reload all carry the reveal', async () => {
    store.getState().applyFogEdit(SAVE_ID, FOG);
    expect(store.getState().settlement.fogSessions).toEqual(FOG);        // live
    expect(persistedEntry(store).settlement.fogSessions).toEqual(FOG);   // entry synced
    expect(store.getState().editedAt).not.toBeNull();                    // editedAt stamped
    await vi.waitFor(() => expect(saves.update).toHaveBeenCalled());     // cloud write requested
    expect(reloadInto(persistedEntry(store)).fogSessions).toEqual(FOG);  // survives reload
  });

  test('editing does not disturb the settlement content beyond the container', () => {
    const before = structuredClone(store.getState().settlement);
    store.getState().applyFogEdit(SAVE_ID, FOG);
    const { fogSessions: _f, ...restAfter } = store.getState().settlement;
    expect(restAfter).toEqual(before); // only fogSessions was added
  });
});

describe('applyFogEdit — clear restores byte-identity (dormancy law)', () => {
  test('null container DROPS the key; the blob reloads byte-identical to no-fog', async () => {
    const store = makeStore();
    withActiveSave(store);
    const cleanReload = stableJson(reloadInto(persistedEntry(store)));

    store.getState().applyFogEdit(SAVE_ID, FOG);
    expect('fogSessions' in store.getState().settlement).toBe(true);

    store.getState().applyFogEdit(SAVE_ID, null); // hide/clear everything
    expect('fogSessions' in store.getState().settlement).toBe(false);        // dropped, not hollow {}
    expect('fogSessions' in persistedEntry(store).settlement).toBe(false);
    await vi.waitFor(() => expect(saves.update).toHaveBeenCalled());

    expect(stableJson(reloadInto(persistedEntry(store)))).toBe(cleanReload); // byte-identical
  });
});

describe('applyFogEdit — cosmetic-always + guards', () => {
  test('a CANON-locked save still accepts the fog reveal', async () => {
    const store = makeStore();
    withActiveSave(store);
    store.getState().refreshSystemState();
    store.getState().canonize();
    expect(store.getState().phase).toBe('canon');

    store.getState().applyFogEdit(SAVE_ID, FOG);
    expect(store.getState().settlement.fogSessions).toEqual(FOG); // wrote despite canon lock
    await vi.waitFor(() => expect(saves.update).toHaveBeenCalled());
  });

  test('unknown id: no mutation, no cloud write', async () => {
    const store = makeStore();
    withActiveSave(store);
    store.getState().applyFogEdit('no-such-save', FOG);
    expect('fogSessions' in store.getState().settlement).toBe(false);
    await new Promise(r => setTimeout(r, 0));
    expect(saves.update).not.toHaveBeenCalled();
  });
});
