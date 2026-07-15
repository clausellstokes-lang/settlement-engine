/**
 * mapEditPersist.test.js — SM-3 the applyMapEdit persist triple + lifecycle (§5/§7).
 *
 * applyMapEdit writes the blob-resident settlement.mapEdits through the applyEvent
 * persist triple (stamp editedAt → updateSavedSettlement → persistSaveUpdate), so a
 * cosmetic map edit never GHOSTS on reload. These pins assert:
 *   (a) live + in-memory entry + cloud write + reload all carry the edit;
 *   (b) COSMETIC-ALWAYS — it writes on a CANON-locked save (no canon guard), unlike
 *       renameNPC (the renameSettlement lane);
 *   (c) content edits are NOT events (campaignState eventLog is untouched);
 *   (d) clearing all edits DROPS the container ⇒ the blob is byte-identical to
 *       no-edits (the dormancy law), and that survives reload;
 *   (e) LIFECYCLE — the edit rides snapshot→revert and an undoLastEvent of an
 *       unrelated event (blob-resident free time travel);
 *   (f) guards — no cloud write for an unknown id, or while a change-queue flush
 *       owns the commit.
 */
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// Cloud-write seam: persistSaveUpdate → saves.update. Stub it so nothing touches
// Supabase; the mock lets us assert the durable write was requested.
vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

import { saves } from '../../src/lib/saves.js';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';

const stubSlice = () => ({
  auth: { user: null, tier: 'free', loading: false },
  config: { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
  institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
  customContent: {}, importedNeighbour: null, campaigns: [], campaignsLoaded: true,
  isTierAllowed: () => true, canSave: () => true, maxSaves: () => 50, setPurchaseModalOpen: () => {},
});

function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a) })));
}

function fixture() {
  return {
    id: 'town.mapton', tier: 'town', name: 'Mapton', population: 1500,
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

const SAVE_ID = 'save-map-1';
const PIN_EDITS = { pins: [{ anchor: 'cat:granary', dx: 12, dy: -8 }] };

/** Hydrate a DRAFT library save — the saved entry's settlement is a SEPARATE copy
 *  from the live one, so a fix that fails to sync the entry is caught. */
function withActiveSave(store) {
  const entry = {
    id: SAVE_ID, name: 'Mapton', tier: 'town',
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

/** Reload proof: open the persisted entry in a fresh store and return its live settlement. */
function reloadInto(entry) {
  const fresh = makeStore();
  fresh.getState().hydrateFromSave(entry);
  return fresh.getState().settlement;
}

beforeEach(() => { saves.update.mockClear(); });

describe('applyMapEdit — the persist triple (§5)', () => {
  let store;
  beforeEach(() => { store = makeStore(); withActiveSave(store); });

  test('live + entry + editedAt + cloud + reload all carry the cosmetic edit', async () => {
    store.getState().applyMapEdit(SAVE_ID, PIN_EDITS);

    expect(store.getState().settlement.mapEdits).toEqual(PIN_EDITS);        // live
    expect(persistedEntry(store).settlement.mapEdits).toEqual(PIN_EDITS);   // in-memory entry synced
    expect(store.getState().editedAt).not.toBeNull();                       // editedAt stamped
    await vi.waitFor(() => expect(saves.update).toHaveBeenCalled());        // cloud write requested

    expect(reloadInto(persistedEntry(store)).mapEdits).toEqual(PIN_EDITS);  // survives reload
  });

  test('content edits are NOT events — the persisted campaignState eventLog stays empty', async () => {
    store.getState().applyMapEdit(SAVE_ID, PIN_EDITS);
    await vi.waitFor(() => expect(saves.update).toHaveBeenCalled());
    expect(persistedEntry(store).campaignState?.eventLog ?? []).toEqual([]);
  });

  test('editing does not disturb the settlement content beyond the container', () => {
    const before = structuredClone(store.getState().settlement);
    store.getState().applyMapEdit(SAVE_ID, PIN_EDITS);
    const after = store.getState().settlement;
    const { mapEdits: _m, ...restAfter } = after;
    expect(restAfter).toEqual(before); // only mapEdits was added
  });
});

describe('applyMapEdit — cosmetic-always (no canon guard)', () => {
  test('a CANON-locked save still accepts the cosmetic edit (unlike renameNPC)', async () => {
    const store = makeStore();
    withActiveSave(store);
    store.getState().refreshSystemState();
    store.getState().canonize();
    expect(store.getState().phase).toBe('canon');

    store.getState().applyMapEdit(SAVE_ID, PIN_EDITS);

    expect(store.getState().settlement.mapEdits).toEqual(PIN_EDITS); // wrote despite canon lock
    await vi.waitFor(() => expect(saves.update).toHaveBeenCalled());
  });
});

describe('applyMapEdit — clear restores byte-identity (dormancy law)', () => {
  test('null / empty edits DROP the container; the blob reloads byte-identical to no-edits', async () => {
    const store = makeStore();
    withActiveSave(store);
    const cleanReload = stableJson(reloadInto(persistedEntry(store)));

    store.getState().applyMapEdit(SAVE_ID, PIN_EDITS);
    expect('mapEdits' in store.getState().settlement).toBe(true);

    store.getState().applyMapEdit(SAVE_ID, null); // reset
    expect('mapEdits' in store.getState().settlement).toBe(false);          // container dropped, not hollow {}
    expect('mapEdits' in persistedEntry(store).settlement).toBe(false);
    await vi.waitFor(() => expect(saves.update).toHaveBeenCalled());

    expect(stableJson(reloadInto(persistedEntry(store)))).toBe(cleanReload); // byte-identical
  });
});

describe('applyMapEdit — lifecycle (blob-resident survival)', () => {
  test('snapshot → revert carries the mapEdits container', () => {
    const store = makeStore();
    withActiveSave(store);
    store.getState().applyMapEdit(SAVE_ID, PIN_EDITS);
    store.getState().recordSnapshot({ saveId: SAVE_ID, label: 'with-edits' });
    const snapId = persistedEntry(store).versionHistory.at(-1).id;

    // Mutate away, then revert back to the snapshot taken WITH the edit.
    store.getState().applyMapEdit(SAVE_ID, null);
    expect('mapEdits' in store.getState().settlement).toBe(false);

    store.getState().revertToSnapshot({ saveId: SAVE_ID, snapshotId: snapId });
    expect(store.getState().settlement.mapEdits).toEqual(PIN_EDITS); // restored from the snapshot
  });

  test('an undoLastEvent of an unrelated event leaves mapEdits intact', () => {
    const store = makeStore();
    withActiveSave(store);
    store.getState().refreshSystemState();
    store.getState().canonize();
    store.getState().applyEvent({
      id: 'lc-undo', type: 'DAMAGE_INSTITUTION', targetId: 'institution.granary',
      payload: { severity: 0.8 }, cause: 'player_action',
    });
    store.getState().applyMapEdit(SAVE_ID, PIN_EDITS);
    expect(store.getState().settlement.mapEdits).toEqual(PIN_EDITS);

    store.getState().undoLastEvent();
    expect(store.getState().settlement.mapEdits).toEqual(PIN_EDITS); // the edit rode the undo
  });
});

describe('applyMapEdit — guards (no spurious writes)', () => {
  test('unknown id: no mutation, no cloud write', async () => {
    const store = makeStore();
    withActiveSave(store);
    store.getState().applyMapEdit('no-such-save', PIN_EDITS);

    expect('mapEdits' in store.getState().settlement).toBe(false);
    await new Promise(r => setTimeout(r, 0));
    expect(saves.update).not.toHaveBeenCalled();
  });

  test('a change-queue flush owns the commit: the edit lands in memory but defers the cloud write', async () => {
    const store = makeStore();
    withActiveSave(store);
    store.setState(s => { s.flushSuppressPersist = true; });

    store.getState().applyMapEdit(SAVE_ID, PIN_EDITS);

    expect(store.getState().settlement.mapEdits).toEqual(PIN_EDITS); // live mutation still happens
    await new Promise(r => setTimeout(r, 0));
    expect(saves.update).not.toHaveBeenCalled();                     // row write deferred
  });
});

function stableJson(v) { return JSON.stringify(v); }
