/**
 * factionRenameConvergence.test.js — ONE RENAME, EVERY SURFACE (owner queue #14).
 *
 * The atlas found two faction-rename lanes that were invisible to each other:
 * the store lane resolved the canonical roster and cascaded nothing, the library
 * lane cascaded broadly and wrote a mirror that is empty on generated saves. The
 * cascade itself is pinned in tests/domain/factionRename.test.js. THIS file pins
 * the convergence at the STORE seam, which is what the door commits through:
 *
 *   • the store action reaches the canonical roster AND the neighbour saves;
 *   • the rename survives a reload (the owner's most-bitten ghosting class);
 *   • the narrative blob is handed to its own registered writer;
 *   • the canon identity lock still refuses;
 *   • 'rename-faction' is admitted by the queue, refused with a TYPED reason
 *     when it cannot apply, and commits through the converged writer.
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

import { saves } from '../../src/lib/saves.js';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { nameOf } from '../../src/domain/rulingPower.js';

const OLD = 'Merchant Guild';
const NEW = 'The Amber Concord';
const SAVE_ID = 'save-host';
const PARTNER_ID = 'save-partner';
const HOST_NAME = 'Bridgeford';

const stubSlice = () => ({
  auth: { user: null, tier: 'free', loading: false },
  config: { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
  institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
  customContent: {}, importedNeighbour: null, campaigns: [], campaignsLoaded: true,
  isTierAllowed: () => true, canSave: () => true, maxSaves: () => 50, setPurchaseModalOpen: () => {},
  // The registered ai_data writer lives on aiSlice, which this harness does not
  // mount. Stub it so the call is observable without pulling the AI stack in.
  applyCosmeticRename: vi.fn(),
});

function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a) })));
}

/** A host settlement whose faction name appears on SEVEN distinct surfaces. */
function hostFixture() {
  return {
    id: 'town.bridgeford', tier: 'town', name: HOST_NAME, population: 1500,
    config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
    institutions: [{ id: 'inst.market', name: 'Market', factionSource: OLD }],
    powerStructure: {
      factions: [
        { id: 'fac.guild', faction: OLD, name: OLD, desc: `The ${OLD} keeps the tolls.`, isGoverning: true },
        { id: 'fac.militia', faction: 'Militia', name: 'Militia' },
      ],
      governingName: OLD,
      government: OLD,
      recentConflict: `The ${OLD} broke the grain cartel.`,
      factionRelationships: [{ pair: [OLD, 'Militia'], narrative: `${OLD} commands, Militia executes.` }],
      previousGovernments: [{ label: OLD, cause: 'election', tick: 2 }],
      conflicts: [],
    },
    npcs: [{ id: 'npc.aldis', name: 'Aldis', role: 'Guildmaster', factionAffiliation: OLD }],
    factions: [{ name: 'Traders', dominantCategory: 'merchant', powerFactionName: OLD }],
    interSettlementRelationships: [{ partnerSettlement: 'Elsewhere', factionName: OLD }],
    history: { historicalEvents: [], currentTensions: [] },
  };
}

/** A neighbour save whose links name the host's faction. */
function partnerRow() {
  return {
    id: PARTNER_ID, name: 'Elsewhere', tier: 'village',
    settlement: {
      name: 'Elsewhere',
      interSettlementRelationships: [
        { partnerSettlement: HOST_NAME, partnerFactionName: OLD, npcName: 'Someone' },
        { partnerSettlement: 'Third Town', partnerFactionName: OLD },
      ],
    },
    campaignState: { phase: 'draft', eventLog: [] },
    timestamp: '2020-01-01T00:00:00.000Z',
  };
}

function withActiveSave(store, { phase = 'draft' } = {}) {
  store.setState(s => {
    s.settlement = structuredClone(hostFixture());
    s.savedSettlements = [
      {
        id: SAVE_ID, name: HOST_NAME, tier: 'town',
        settlement: structuredClone(hostFixture()),
        campaignState: { phase, eventLog: [], systemState: {}, editedAt: null },
        timestamp: '2020-01-01T00:00:00.000Z',
      },
      partnerRow(),
    ];
    s.activeSaveId = SAVE_ID;
    s.phase = phase;
    s.eventLog = [];
    s.systemState = {};
    s.editedAt = null;
  });
}

const rowFor = (store, id) => store.getState().savedSettlements.find(s => s.id === id);

function reloadInto(entry) {
  const fresh = makeStore();
  fresh.getState().hydrateFromSave(entry);
  return fresh.getState().settlement;
}

beforeEach(() => { saves.update.mockClear(); });

describe('store lane — the converged cascade', () => {
  let store;
  beforeEach(() => { store = makeStore(); withActiveSave(store); });

  // AWAITED throughout this describe: renameFaction fetches its cascade module
  // (domain/factionRename.js) at the call seam so it stays off first paint, so
  // the action envelope is a promise. Reading the result without awaiting would
  // score every assertion below against `undefined`.
  test('one rename moves the roster, the seat, the roster members and the attribution', async () => {
    const result = await store.getState().renameFaction(0, NEW);
    expect(result.changed).toBe(true);
    expect(result.oldName).toBe(OLD);

    const s = store.getState().settlement;
    expect(nameOf(s.powerStructure.factions[0])).toBe(NEW);
    expect(s.powerStructure.factions[0].name).toBe(NEW);
    expect(s.powerStructure.governingName).toBe(NEW);
    expect(s.powerStructure.government).toBe(NEW);
    expect(s.powerStructure.factionRelationships[0].pair).toEqual([NEW, 'Militia']);
    expect(s.powerStructure.factionRelationships[0].narrative).toBe(`${NEW} commands, Militia executes.`);
    expect(s.powerStructure.recentConflict).toBe(`The ${NEW} broke the grain cartel.`);
    expect(s.npcs[0].factionAffiliation).toBe(NEW);
    expect(s.institutions[0].factionSource).toBe(NEW);
    expect(s.factions[0].powerFactionName).toBe(NEW);
    expect(s.interSettlementRelationships[0].factionName).toBe(NEW);
    // The sibling faction and the recorded lineage are untouched.
    expect(nameOf(s.powerStructure.factions[1])).toBe('Militia');
    expect(s.powerStructure.previousGovernments[0].label).toBe(OLD);
  });

  test('the rename reaches the saved row and survives a reload', async () => {
    await store.getState().renameFaction(0, NEW);
    expect(nameOf(rowFor(store, SAVE_ID).settlement.powerStructure.factions[0])).toBe(NEW);
    await vi.waitFor(() => expect(saves.update).toHaveBeenCalled());
    const reloaded = reloadInto(rowFor(store, SAVE_ID));
    expect(nameOf(reloaded.powerStructure.factions[0])).toBe(NEW);
    expect(reloaded.npcs[0].factionAffiliation).toBe(NEW);
    expect(reloaded.powerStructure.governingName).toBe(NEW);
  });

  test('neighbour saves that link back to this settlement are cascaded and persisted', async () => {
    const result = await store.getState().renameFaction(0, NEW);
    expect(result.modifiedSaveIds).toEqual([PARTNER_ID]);
    const links = rowFor(store, PARTNER_ID).settlement.interSettlementRelationships;
    expect(links[0].partnerFactionName).toBe(NEW);
    // A link pointing at a DIFFERENT settlement keeps the old name: two towns
    // may legitimately host same-named factions.
    expect(links[1].partnerFactionName).toBe(OLD);
  });

  test('the narrative blob is handed to its own registered writer, per touched save', async () => {
    await store.getState().renameFaction(0, NEW);
    const calls = store.getState().applyCosmeticRename.mock.calls.map(([arg]) => arg);
    expect(calls.map(c => c.saveId)).toEqual([SAVE_ID, PARTNER_ID]);
    for (const call of calls) {
      expect(call.oldName).toBe(OLD);
      expect(call.newName).toBe(NEW);
    }
  });

  test('canon freezes faction identity, and an empty or unchanged name is a no-op', async () => {
    await store.getState().renameFaction(0, '   ');
    await store.getState().renameFaction(0, OLD);
    await store.getState().renameFaction(99, NEW);
    expect(nameOf(store.getState().settlement.powerStructure.factions[0])).toBe(OLD);

    store.setState(s => { s.phase = 'canon'; });
    expect((await store.getState().renameFaction(0, NEW)).changed).toBe(false);
    expect(nameOf(store.getState().settlement.powerStructure.factions[0])).toBe(OLD);
  });
});

describe('the queue door — rename-faction is committable with typed refusals', () => {
  let store;
  beforeEach(() => { store = makeStore(); withActiveSave(store); });

  test('a valid rename is admitted, staged against the faction target, and commits', async () => {
    const intent = await store.getState().queueEdit('rename-faction', { factionIndex: 0, newName: NEW });
    expect(intent).not.toBeNull();
    expect(intent.targetRef.type).toBe('faction');
    expect(intent.targetRef.id).toBe('0');
    expect(store.getState().settlement.powerStructure.factions[0].faction).toBe(OLD); // staged, not applied

    await store.getState().commitPendingEdits();
    expect(nameOf(store.getState().settlement.powerStructure.factions[0])).toBe(NEW);
    expect(store.getState().settlement.powerStructure.governingName).toBe(NEW);
    expect(store.getState().pendingEditsQueue).toEqual([]);
  });

  test('the commit leaves an applied receipt carrying a snapshot undo token', async () => {
    await store.getState().queueEdit('rename-faction', { factionIndex: 0, newName: NEW });
    await store.getState().commitPendingEdits();
    const receipt = (store.getState().pendingEditReceipts || []).at(-1);
    expect(receipt.status).toBe('applied');
    expect(receipt.undoToken?.kind).toBe('snapshot');
  });

  test('refusals are typed, not silent', async () => {
    // No name.
    expect(await store.getState().queueEdit('rename-faction', { factionIndex: 0, newName: '  ' })).toBeNull();
    // Unchanged name.
    expect(await store.getState().queueEdit('rename-faction', { factionIndex: 0, newName: OLD })).toBeNull();
    // Missing target.
    expect(await store.getState().queueEdit('rename-faction', { factionIndex: 99, newName: NEW })).toBeNull();
    // No index at all.
    expect(await store.getState().queueEdit('rename-faction', { newName: NEW })).toBeNull();
    expect(store.getState().pendingEditsQueue).toEqual([]);
  });

  test('a canonized settlement refuses the rename at the queue boundary', async () => {
    store.setState(s => { s.phase = 'canon'; });
    expect(await store.getState().queueEdit('rename-faction', { factionIndex: 0, newName: NEW })).toBeNull();
    expect(store.getState().pendingEditsQueue).toEqual([]);
  });
});
