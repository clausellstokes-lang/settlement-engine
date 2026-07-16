/**
 * editActionPersist.test.js — the §10.4 persist-gap fix.
 *
 * applyUserEditAction / revertUserEditAction / renameNPC / renameFaction mutate
 * the live settlement blob. Before this fix they wrote ONLY the live store, so an
 * edit on a hydrated library save reached the persisted row (and therefore
 * survived a fresh reload) only if some LATER action happened to write the blob —
 * otherwise it GHOSTED. This is the owner's most-bitten "survives one path, ghosts
 * another" class (docs/DESIGN_SETTLEMENT_MAP.md §10.4).
 *
 * These pins assert the persist half is now present: on a hydrated save each edit
 *   (a) syncs the in-memory save entry (updateSavedSettlement),
 *   (b) stamps editedAt,
 *   (c) requests the durable cloud write (persistSaveUpdate → saves.update), and
 *   (d) SURVIVES a fresh hydrateFromSave (the reload proof).
 * And the guards: no persist without a hydrated save, on a canon-locked rename, on
 * a no-op revert, or while a change-queue flush owns the commit.
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// Cloud-write seam: persistSaveUpdate → saves.update. Stub it so the test never
// touches Supabase; the mock lets us assert the durable write was requested.
vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

import { saves } from '../../src/lib/saves.js';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { EDIT_KINDS, COMMITTABLE_EDIT_KINDS } from '../../src/domain/pendingEdits.js';

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
    id: 'town.bridgeford', tier: 'town', name: 'Bridgeford', population: 1500,
    config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
    arrivalScene: 'A stone bridge across the river.',
    institutions: [{ id: 'inst.market', name: 'Market', desc: 'A daily market.' }],
    powerStructure: {
      factions: [{ id: 'fac.guild', faction: 'Merchant Guild', name: 'Merchant Guild', desc: 'Old money.' }],
      conflicts: [],
    },
    npcs: [{ id: 'npc.aldis', name: 'Aldis', role: 'Guildmaster', secret: { what: 'Embezzles dues.' } }],
    history: { historicalEvents: [], currentTensions: [] },
  };
}

const SAVE_ID = 'save-1';

/** Hydrate a DRAFT library save into a store, exactly as opening it would. The
 *  saved entry's settlement is a SEPARATE copy from the live one, so a fix that
 *  fails to sync the entry is caught. */
function withActiveSave(store) {
  const entry = {
    id: SAVE_ID, name: 'Bridgeford', tier: 'town',
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

/** The persisted save entry a reload would read back. */
const persistedEntry = (store) => store.getState().savedSettlements.find(s => s.id === SAVE_ID);

/** Reload proof: open the persisted entry in a fresh store and return its live settlement. */
function reloadInto(entry) {
  const fresh = makeStore();
  fresh.getState().hydrateFromSave(entry);
  return fresh.getState().settlement;
}

beforeEach(() => { saves.update.mockClear(); });

describe('edit actions persist on a hydrated save (§10.4)', () => {
  let store;
  beforeEach(() => { store = makeStore(); withActiveSave(store); });

  test('renameNPC: live + entry + cloud + reload all carry the new name', async () => {
    store.getState().renameNPC(0, 'Aldric');

    expect(store.getState().settlement.npcs[0].name).toBe('Aldric');       // live
    expect(persistedEntry(store).settlement.npcs[0].name).toBe('Aldric');  // in-memory entry synced
    expect(store.getState().editedAt).not.toBeNull();                      // editedAt stamped
    await vi.waitFor(() => expect(saves.update).toHaveBeenCalled());       // cloud write requested

    expect(reloadInto(persistedEntry(store)).npcs[0].name).toBe('Aldric'); // survives reload
  });

  test('renameFaction: keeps .name AND .faction in sync, survives reload', async () => {
    store.getState().renameFaction(0, 'Free Company');

    const facLive = store.getState().settlement.powerStructure.factions[0];
    expect(facLive.name).toBe('Free Company');
    expect(facLive.faction).toBe('Free Company');
    await vi.waitFor(() => expect(saves.update).toHaveBeenCalled());

    const facReloaded = reloadInto(persistedEntry(store)).powerStructure.factions[0];
    expect(facReloaded.name).toBe('Free Company');
    expect(facReloaded.faction).toBe('Free Company');
  });

  test('applyUserEditAction: authored prose survives reload with _authored intact', async () => {
    store.getState().applyUserEditAction('npc', 0, 'secret.what', 'Sold the bridge tolls.');

    expect(persistedEntry(store).settlement.npcs[0].secret.what).toBe('Sold the bridge tolls.');
    await vi.waitFor(() => expect(saves.update).toHaveBeenCalled());

    const npc = reloadInto(persistedEntry(store)).npcs[0];
    expect(npc.secret.what).toBe('Sold the bridge tolls.');
    expect(npc._authored).toBe(true);
  });

  test('revertUserEditAction: the revert survives reload (does not resurrect the edit)', async () => {
    store.getState().applyUserEditAction('npc', 0, 'secret.what', 'Edited.');
    saves.update.mockClear();
    store.getState().revertUserEditAction('npc', 0, 'secret.what');

    expect(store.getState().settlement.npcs[0].secret.what).toBe('Embezzles dues.');
    await vi.waitFor(() => expect(saves.update).toHaveBeenCalled());

    const npc = reloadInto(persistedEntry(store)).npcs[0];
    expect(npc.secret.what).toBe('Embezzles dues.');
    expect(npc._authored).toBeUndefined();
  });

  test('the persisted campaignState carries NO new event (content edits are not events)', async () => {
    store.getState().renameNPC(0, 'Aldric');
    await vi.waitFor(() => expect(saves.update).toHaveBeenCalled());
    expect(persistedEntry(store).campaignState.eventLog).toEqual([]);
  });
});

describe('commitPendingEdits persists a queued town rename (§10.4 fifth gap)', () => {
  let store;
  beforeEach(() => { store = makeStore(); withActiveSave(store); });

  test('queued rename-settlement commits, persists, and survives reload — incl. the row `name` COLUMN', async () => {
    store.getState().queueEdit('rename-settlement', { newName: 'Newhaven' });
    store.getState().commitPendingEdits();

    expect(store.getState().settlement.name).toBe('Newhaven');       // live
    expect(persistedEntry(store).settlement.name).toBe('Newhaven');  // in-memory entry blob synced
    // state-lifecycle-1 / store-hooks-state-5: the ENTRY-LEVEL name (what the
    // library list, campaign folders, and the blob-less meta list read via
    // match?.name / row.name) — the exact surface that ghosted before the fix.
    expect(persistedEntry(store).name).toBe('Newhaven');
    await vi.waitFor(() => expect(saves.update).toHaveBeenCalled());  // cloud write requested
    // The DURABLE proof: the cloud partial carries the `name` column, so a real
    // reload-from-cloud (which reads row.name, NOT the blob) shows the new name.
    const nameWrite = saves.update.mock.calls.find(c => c[0] === SAVE_ID && c[1]?.name !== undefined);
    expect(nameWrite?.[1].name).toBe('Newhaven');
    expect(reloadInto(persistedEntry(store)).name).toBe('Newhaven');  // survives blob reload
  });

  test('canon town rename persists the `name` column AND appends a RENAME_SETTLEMENT flavor entry', async () => {
    // Route-through-renameSettlementImpl also gives the queue path the designed
    // canon behavior: a canon rename is recorded as a flavor timeline line. Mark
    // BOTH the live phase and the saved entry canon so it takes its canon arm.
    store.setState(s => {
      s.phase = 'canon';
      s.eventLog = [];
      const idx = s.savedSettlements.findIndex(x => x.id === SAVE_ID);
      s.savedSettlements[idx] = {
        ...s.savedSettlements[idx],
        campaignState: { phase: 'canon', eventLog: [], systemState: {}, editedAt: null },
      };
    });

    store.getState().queueEdit('rename-settlement', { newName: 'Kingsford' });
    store.getState().commitPendingEdits();

    expect(persistedEntry(store).name).toBe('Kingsford');
    expect(persistedEntry(store).settlement.name).toBe('Kingsford');
    await vi.waitFor(() => expect(saves.update).toHaveBeenCalled());
    const nameWrite = saves.update.mock.calls.find(c => c[0] === SAVE_ID && c[1]?.name === 'Kingsford');
    expect(nameWrite).toBeTruthy();
    // The canon flavor entry rides the persisted campaignState eventLog.
    const log = persistedEntry(store).campaignState.eventLog;
    expect(log.some(e => e.type === 'RENAME_SETTLEMENT')).toBe(true);
  });

  test('parity: a queued NPC rename AND town rename in one commit both survive', async () => {
    store.getState().queueEdit('rename-npc', { npcIndex: 0, newName: 'Aldric' });
    store.getState().queueEdit('rename-settlement', { newName: 'Newhaven' });
    store.getState().commitPendingEdits();

    await vi.waitFor(() => expect(saves.update).toHaveBeenCalled());
    const reloaded = reloadInto(persistedEntry(store));
    expect(reloaded.name).toBe('Newhaven');
    expect(reloaded.npcs[0].name).toBe('Aldric');
  });

  test('an unsaved-draft queued town rename still updates live memory (no cloud write)', async () => {
    const draft = makeStore();
    draft.setState(s => { s.settlement = fixture(); }); // no activeSaveId
    draft.getState().queueEdit('rename-settlement', { newName: 'Newhaven' });
    draft.getState().commitPendingEdits();

    expect(draft.getState().settlement.name).toBe('Newhaven'); // live rename preserved
    await new Promise(r => setTimeout(r, 0));
    expect(saves.update).not.toHaveBeenCalled();
  });
});

describe('queueEdit no-silent-drop contract: only committable kinds enter the queue', () => {
  let store;
  beforeEach(() => { store = makeStore(); withActiveSave(store); });

  test('every EDIT_KIND without a commit dispatcher is refused at enqueue (null, queue stays empty)', () => {
    const uncommittable = EDIT_KINDS.filter(k => !COMMITTABLE_EDIT_KINDS.includes(k));
    expect(uncommittable.length).toBeGreaterThan(0); // the scaffolding kinds still exist

    for (const kind of uncommittable) {
      // Pass a fat payload so refusal is by kind, not by a missing field.
      const result = store.getState().queueEdit(kind, { label: 'x', newName: 'x', npcIndex: 0 });
      expect(result).toBeNull();
    }
    expect(store.getState().pendingEditsQueue).toEqual([]); // nothing was queued-then-droppable
  });

  test('committable kinds are admitted (non-null) and enqueued in order', () => {
    const npc = store.getState().queueEdit('rename-npc', { npcIndex: 0, newName: 'Aldric' });
    const town = store.getState().queueEdit('rename-settlement', { newName: 'Newhaven' });

    expect(npc).not.toBeNull();
    expect(town).not.toBeNull();
    expect(store.getState().pendingEditsQueue.map(e => e.kind)).toEqual(['rename-npc', 'rename-settlement']);
  });

  test('commit after refused enqueues has nothing to drop and triggers no phantom persist', async () => {
    store.getState().queueEdit('add-institution', { label: 'Tavern' });
    store.getState().queueEdit('edit-prose', { text: 'x' });
    expect(store.getState().pendingEditsQueue).toEqual([]); // both refused

    store.getState().commitPendingEdits(); // no active edits → no-op
    await new Promise(r => setTimeout(r, 0));
    expect(saves.update).not.toHaveBeenCalled();
  });
});

describe('edit-persist guards (no spurious writes)', () => {
  test('no hydrated save: edit applies to live memory but requests no cloud write', async () => {
    const store = makeStore();
    store.setState(s => { s.settlement = fixture(); }); // no activeSaveId / savedSettlements

    store.getState().renameNPC(0, 'Aldric');
    store.getState().applyUserEditAction('npc', 0, 'secret.what', 'X');

    expect(store.getState().settlement.npcs[0].name).toBe('Aldric'); // live edit still lands
    await new Promise(r => setTimeout(r, 0));
    expect(saves.update).not.toHaveBeenCalled();
  });

  test('canon-locked renameNPC: no mutation, no persist', async () => {
    const store = makeStore();
    withActiveSave(store);
    store.setState(s => { s.phase = 'canon'; });

    store.getState().renameNPC(0, 'Aldric');

    expect(store.getState().settlement.npcs[0].name).toBe('Aldis'); // unchanged
    await new Promise(r => setTimeout(r, 0));
    expect(saves.update).not.toHaveBeenCalled();
  });

  test('no-op revert (path never edited): no persist', async () => {
    const store = makeStore();
    withActiveSave(store);

    store.getState().revertUserEditAction('npc', 0, 'secret.what');

    await new Promise(r => setTimeout(r, 0));
    expect(saves.update).not.toHaveBeenCalled();
  });

  test('a change-queue flush owns the commit: edit defers (flushSuppressPersist)', async () => {
    const store = makeStore();
    withActiveSave(store);
    store.setState(s => { s.flushSuppressPersist = true; });

    store.getState().renameNPC(0, 'Aldric');

    expect(store.getState().settlement.npcs[0].name).toBe('Aldric'); // live mutation still happens
    await new Promise(r => setTimeout(r, 0));
    expect(saves.update).not.toHaveBeenCalled();                     // but the row write is deferred
  });
});
