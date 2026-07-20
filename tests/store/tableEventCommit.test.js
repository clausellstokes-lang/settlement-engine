/**
 * tableEventCommit.test.js — R-1 THE SESSION LEDGER: the commit half.
 *
 * A table event enters the EXISTING pendingEdits queue as a 'table-event' with a
 * schema-walled directive; commitPendingEdits routes it (applyEditOp →
 * applyTableEvent) to an EXISTING engine effect. These pins assert:
 *   • the committed effect carries source:'table' on its receipt (provenance),
 *   • the free-text flavor rides a non-mechanical field and survives verbatim,
 *   • the effect + receipt PERSIST (survive a fresh reload — state-lifecycle),
 *   • a directive missing the source stamp or naming a non-table event type is a
 *     safe no-op (the eager dispatcher fails closed).
 */
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

import { saves } from '../../src/lib/saves.js';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { validateTableEvent, buildTableEffect, TABLE_EVENT_SOURCE } from '../../src/domain/tableLedger.js';

const stubSlice = () => ({
  auth: { user: null, tier: 'free', loading: false },
  config: { settType: 'town' },
  institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
  customContent: {}, importedNeighbour: null, campaigns: [], campaignsLoaded: true,
  isTierAllowed: () => true, canSave: () => true, maxSaves: () => 50, setPurchaseModalOpen: () => {},
});

const makeStore = () => create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a) })));

function canonFixture() {
  return {
    id: 'town.bridgeford', tier: 'town', name: 'Bridgeford', population: 1500,
    config: { monsterThreat: 'safe' },
    institutions: [{ id: 'inst.market', name: 'Market' }],
    powerStructure: { factions: [], conflicts: [] },
    stressors: [{ type: 'famine', name: 'famine', label: 'A failing harvest', severity: 0.6, status: 'active' }],
    npcs: [{ id: 'npc.aldis', name: 'Aldis', role: 'Guildmaster' }],
    history: { historicalEvents: [], currentTensions: [] },
  };
}

const SAVE_ID = 'save-canon-1';

/** Hydrate a CANONIZED library save (so events log into the timeline). */
function withCanonSave(store) {
  const entry = {
    id: SAVE_ID, name: 'Bridgeford', tier: 'town',
    settlement: structuredClone(canonFixture()),
    campaignState: { phase: 'canon', eventLog: [], systemState: {}, canonizedAt: '2020-01-01T00:00:00.000Z', editedAt: null },
    timestamp: '2020-01-01T00:00:00.000Z',
  };
  store.setState(s => {
    s.settlement = structuredClone(canonFixture());
    s.savedSettlements = [entry];
    s.activeSaveId = SAVE_ID;
    s.phase = 'canon';
    s.eventLog = [];
    s.systemState = {};
    s.canonizedAt = '2020-01-01T00:00:00.000Z';
    s.editedAt = null;
  });
}

const persistedEntry = (store) => store.getState().savedSettlements.find(s => s.id === SAVE_ID);
function reloadInto(entry) {
  const fresh = makeStore();
  fresh.getState().hydrateFromSave(entry);
  return fresh.getState();
}

/** Queue a validated table event exactly as the lazy panel would. */
function queueTableEvent(store, input) {
  const { ok, record } = validateTableEvent(input);
  expect(ok).toBe(true);
  return store.getState().queueEdit('table-event', { directive: buildTableEffect(record), record });
}

beforeEach(() => { saves.update.mockClear(); });

describe('R-1 the session ledger commits typed, bounded, source:table effects', () => {
  let store;
  beforeEach(() => { store = makeStore(); withCanonSave(store); });

  test('TABLE_EVENT_SOURCE is the literal the eager dispatcher stamps', () => {
    // The helper (settlementRenameHelpers) hard-codes 'table' to avoid pulling
    // tableLedger into first paint; this pin keeps the two in lockstep.
    expect(TABLE_EVENT_SOURCE).toBe('table');
  });

  test('an obligation commits an APPLY_STRESSOR receipt tagged source:table, persists, survives reload', async () => {
    const FLAVOR = "the party pledged the baron's ransom, and the debt fell on the town";
    const edit = queueTableEvent(store, {
      kind: 'obligation', magnitude: 'major', targets: { ref: 'debt', label: 'debt' }, flavor: FLAVOR,
    });
    expect(edit).not.toBeNull();
    store.getState().commitPendingEdits();

    // The receipt (an eventLog entry) carries the table provenance + verbatim flavor.
    const log = store.getState().eventLog;
    const receipt = log.find(e => e.event?.type === 'APPLY_STRESSOR');
    expect(receipt).toBeTruthy();
    expect(receipt.event.source).toBe('table');
    expect(receipt.event.tableFlavor).toBe(FLAVOR);
    // Free text is NOWHERE in the mechanical surface.
    const mechanical = JSON.stringify({ targetId: receipt.event.targetId, payload: receipt.event.payload });
    expect(mechanical).not.toContain('ransom');
    expect(mechanical).not.toContain('baron');

    await vi.waitFor(() => expect(saves.update).toHaveBeenCalled());
    // Survives reload: the receipt is on the persisted timeline.
    const reloaded = reloadInto(persistedEntry(store));
    const reloadedReceipt = reloaded.eventLog.find(e => e.event?.type === 'APPLY_STRESSOR');
    expect(reloadedReceipt?.event?.source).toBe('table');
  });

  test('an incident commits a canon flavor line tagged source:table (no mechanical delta), survives reload', async () => {
    const FLAVOR = 'The party drank the Guildmaster under the table.';
    queueTableEvent(store, { kind: 'incident', flavor: FLAVOR });
    const before = store.getState().systemState;
    store.getState().commitPendingEdits();

    const line = store.getState().eventLog.find(e => e.type === 'TABLE_INCIDENT');
    expect(line).toBeTruthy();
    expect(line.source).toBe('table');
    expect(line.narrativeSummary).toBe(FLAVOR);
    expect(line.flavor).toBe(true);
    // Pure flavor: no systemState change (before === after for the flavor entry).
    expect(line.beforeState).toEqual(before);

    await vi.waitFor(() => expect(saves.update).toHaveBeenCalled());
    const reloaded = reloadInto(persistedEntry(store));
    expect(reloaded.eventLog.some(e => e.type === 'TABLE_INCIDENT' && e.source === 'table')).toBe(true);
  });

  test('the eager dispatcher FAILS CLOSED on a directive missing the table source', () => {
    // A hand-crafted directive without the source stamp must be a no-op — no
    // receipt, no mutation. (Fabricates the payload to bypass the schema wall.)
    store.getState().queueEdit('table-event', {
      directive: { dispatch: 'applyEvent', event: { type: 'APPLY_STRESSOR', targetId: 'debt', payload: { severity: 0.8 } } },
    });
    store.getState().commitPendingEdits();
    expect(store.getState().eventLog.some(e => e.event?.type === 'APPLY_STRESSOR')).toBe(false);
  });

  test('the eager dispatcher FAILS CLOSED on a non-table event type', () => {
    store.getState().queueEdit('table-event', {
      directive: { dispatch: 'applyEvent', event: { type: 'DESTROY_SETTLEMENT', targetId: 'x', source: 'table' } },
    });
    store.getState().commitPendingEdits();
    expect(store.getState().eventLog.some(e => e.event?.type === 'DESTROY_SETTLEMENT')).toBe(false);
  });
});
