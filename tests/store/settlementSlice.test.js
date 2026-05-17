/**
 * settlementSlice integration tests — the critical round-trips that
 * keep saved campaigns truthful across reloads.
 *
 * Why these tests exist (audit reconciliation, CRIT category):
 *   1. saveSettlement → hydrateFromSave must round-trip campaign state
 *      (phase / eventLog / systemState / canonizedAt / locks) so opening
 *      a saved canon settlement actually shows that settlement's
 *      timeline, not whatever was last in the global slice.
 *   2. canonize → applyEvent → undoLastEvent must be reversible:
 *      undoing the last event restores the prior systemState and
 *      strips its impairments off institutions/factions.
 *   3. applyEvent must mutate the settlement (status flips, NPC death,
 *      impairment propagation) — not just adjust systemState.
 *
 * These were the CRIT items the audit kept flagging. Locking them in
 * tests means future slice refactors can't silently undo the fix.
 *
 * The tests use a real zustand store assembled from createSettlementSlice
 * plus minimal stubs for the auth / config / toggle / campaign / credits
 * dependencies the slice reads through. We don't load every slice in the
 * app because that drags in lazy-loaded React modules and the
 * dependencyEngine bootstrap; this test boots only what the contract
 * requires.
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { createPRNG } from '../../src/generators/prng.js';

// Minimal companion slices so settlementSlice's reads don't crash.
// These mirror the live shape just enough for the contracts under test.
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

// Lightweight settlement fixture — just enough for mutateSettlement to
// find institutions/factions by id.
function fixture() {
  return {
    tier: 'town',
    name: 'Testford',
    population: 2000,
    config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
    institutions: [
      { id: 'institution.granary', name: 'Granary', category: 'civic', status: 'active' },
      { id: 'institution.temple',  name: 'Temple',  category: 'religious', status: 'active' },
    ],
    powerStructure: {
      factions: [
        { id: 'faction.council', name: 'Council' },
        { id: 'faction.merchants', name: 'Merchants', controlsInstitutionIds: ['institution.granary'] },
      ],
      conflicts: [],
    },
    npcs: [],
  };
}

describe('settlementSlice — canonize lifecycle', () => {
  let store;
  beforeEach(() => {
    store = makeStore();
    // Seed the slice with a settlement directly (skip the generation
    // pipeline — these tests aren't validating generation, they're
    // validating lifecycle handlers).
    store.setState(s => {
      s.settlement = fixture();
      s.lastSeed = 'test-seed';
      s.systemState = null;  // hydrate via refreshSystemState
    });
    store.getState().refreshSystemState();
  });

  test('phase defaults to draft on a fresh slice', () => {
    expect(store.getState().phase).toBe('draft');
  });

  test('canonize flips phase, stamps canonizedAt, clears eventLog', () => {
    store.getState().canonize();
    const s = store.getState();
    expect(s.phase).toBe('canon');
    expect(typeof s.canonizedAt).toBe('string');
    expect(s.eventLog).toEqual([]);
  });

  test('uncanonize drops back to draft and clears the timeline', () => {
    store.getState().canonize();
    // Apply an event so the timeline isn't empty
    store.getState().applyEvent({
      id: 'ev1', type: 'DAMAGE_INSTITUTION', targetId: 'institution.granary',
      payload: { severity: 0.5 }, cause: 'player_action',
    });
    expect(store.getState().eventLog).toHaveLength(1);
    store.getState().uncanonize();
    const s = store.getState();
    expect(s.phase).toBe('draft');
    expect(s.eventLog).toEqual([]);
    expect(s.canonizedAt).toBeNull();
  });
});

describe('settlementSlice — applyEvent mutates entities', () => {
  let store;
  beforeEach(() => {
    store = makeStore();
    store.setState(s => { s.settlement = fixture(); s.lastSeed = 'test-seed'; });
    store.getState().refreshSystemState();
    store.getState().canonize();
  });

  test('DAMAGE_INSTITUTION flips status to impaired on the targeted institution', () => {
    store.getState().applyEvent({
      id: 'ev1', type: 'DAMAGE_INSTITUTION', targetId: 'institution.granary',
      payload: { severity: 0.7 }, cause: 'player_action',
    });
    const granary = store.getState().settlement.institutions.find(i => i.id === 'institution.granary');
    expect(granary.status).toBe('impaired');
    expect(granary.impairments[0].causeEventId).toBe('ev1');
  });

  test('DAMAGE_INSTITUTION propagates an impairment to the controlling faction', () => {
    store.getState().applyEvent({
      id: 'ev2', type: 'DAMAGE_INSTITUTION', targetId: 'institution.granary',
      payload: { severity: 1.0 }, cause: 'player_action',
    });
    const merchants = store.getState().settlement.powerStructure.factions
      .find(f => f.id === 'faction.merchants');
    expect(merchants.impairments?.length).toBeGreaterThan(0);
  });

  test('applyEvent in canon mode appends to eventLog', () => {
    store.getState().applyEvent({
      id: 'ev3', type: 'IMPAIR_INSTITUTION', targetId: 'institution.temple',
      payload: { dimension: 'legitimacy', severity: 0.6 }, cause: 'player_action',
    });
    expect(store.getState().eventLog).toHaveLength(1);
    expect(store.getState().eventLog[0].event.id).toBe('ev3');
  });

  test('applyEvent in draft mode mutates settlement but does NOT log', () => {
    store.getState().uncanonize();
    store.getState().applyEvent({
      id: 'ev4', type: 'DAMAGE_INSTITUTION', targetId: 'institution.granary',
      payload: { severity: 0.7 }, cause: 'authoring',
    });
    const granary = store.getState().settlement.institutions.find(i => i.id === 'institution.granary');
    expect(granary.status).toBe('impaired');           // mutated
    expect(store.getState().eventLog).toEqual([]);     // not logged
  });
});

describe('settlementSlice — applyPendingPreview integrity', () => {
  let store;
  beforeEach(() => {
    store = makeStore();
    store.setState(s => { s.settlement = fixture(); s.lastSeed = 'test-seed'; });
    store.getState().refreshSystemState();
    store.getState().canonize();
  });

  test('preview then applyPendingPreview commits the SAME event id', () => {
    const event = {
      id: 'preview-1', type: 'DAMAGE_INSTITUTION', targetId: 'institution.granary',
      payload: { severity: 0.8 }, cause: 'player_action',
    };
    store.getState().previewEvent(event);
    const logEntry = store.getState().applyPendingPreview();
    expect(logEntry.event.id).toBe('preview-1');
    expect(store.getState().eventLog[0].event.id).toBe('preview-1');
    expect(store.getState().pendingPreview).toBeNull();
  });

  test('applyPendingPreview is a no-op when nothing is pending', () => {
    const result = store.getState().applyPendingPreview();
    expect(result).toBeNull();
    expect(store.getState().eventLog).toEqual([]);
  });
});

describe('settlementSlice — undoLastEvent reverses impairments', () => {
  let store;
  beforeEach(() => {
    store = makeStore();
    store.setState(s => { s.settlement = fixture(); s.lastSeed = 'test-seed'; });
    store.getState().refreshSystemState();
    store.getState().canonize();
  });

  test('undo strips impairments tagged with the popped event id', () => {
    store.getState().applyEvent({
      id: 'ev-undo', type: 'DAMAGE_INSTITUTION', targetId: 'institution.granary',
      payload: { severity: 0.7 }, cause: 'player_action',
    });
    const granaryBefore = store.getState().settlement.institutions.find(i => i.id === 'institution.granary');
    expect(granaryBefore.status).toBe('impaired');

    store.getState().undoLastEvent();

    const granaryAfter = store.getState().settlement.institutions.find(i => i.id === 'institution.granary');
    expect(granaryAfter.status).toBe('active');
    expect(granaryAfter.impairments).toEqual([]);
    expect(store.getState().eventLog).toEqual([]);
  });

  test('undo does nothing in draft phase', () => {
    store.getState().uncanonize();
    // No event log in draft, so undo is a no-op
    store.getState().undoLastEvent();
    expect(store.getState().eventLog).toEqual([]);
  });
});

describe('settlementSlice — saveSettlement persists campaignState', () => {
  let store;
  beforeEach(() => {
    store = makeStore();
    store.setState(s => { s.settlement = fixture(); s.lastSeed = 'test-seed'; });
    store.getState().refreshSystemState();
  });

  test('a saved canonized settlement carries phase, eventLog, canonizedAt in campaignState', () => {
    store.getState().canonize();
    store.getState().applyEvent({
      id: 'save-test-1', type: 'IMPAIR_INSTITUTION', targetId: 'institution.temple',
      payload: { dimension: 'legitimacy', severity: 0.5 }, cause: 'player_action',
    });
    store.getState().saveSettlement(store.getState().settlement);

    const [save] = store.getState().savedSettlements;
    expect(save.campaignState).toBeTruthy();
    expect(save.campaignState.phase).toBe('canon');
    expect(save.campaignState.eventLog).toHaveLength(1);
    expect(save.campaignState.canonizedAt).toBeTruthy();
    expect(save.campaignState.systemState).toBeTruthy();
  });
});

describe('settlementSlice — hydrateFromSave restores the lifecycle', () => {
  let store;
  beforeEach(() => {
    store = makeStore();
  });

  test('opening a canon save restores phase + eventLog + systemState', () => {
    const save = {
      id: 'save-1',
      settlement: fixture(),
      seed: 'restored-seed',
      campaignState: {
        phase: 'canon',
        eventLog: [{ event: { id: 'logged-1', type: 'PLAGUE' }, appliedAt: new Date().toISOString(), beforeState: {}, afterState: {}, deltas: [], factionResponses: [], narrativeSummary: 'A plague' }],
        systemState: {
          resilience:       { value: 40, band: 'Vulnerable', drivers: [], risks: ['plague'] },
          volatility:       { value: 60, band: 'Strained',  drivers: [], risks: [] },
          externalThreat:   { value: 30, band: 'Vulnerable', drivers: [], risks: [] },
          resourcePressure: { value: 50, band: 'Strained',  drivers: [], risks: [] },
        },
        locks: {},
        generatedAt: '2026-01-01T00:00:00.000Z',
        editedAt:    '2026-04-01T00:00:00.000Z',
        canonizedAt: '2026-02-01T00:00:00.000Z',
        lastExportAt: null,
      },
    };
    store.getState().hydrateFromSave(save);

    const s = store.getState();
    expect(s.phase).toBe('canon');
    expect(s.eventLog).toHaveLength(1);
    expect(s.eventLog[0].event.id).toBe('logged-1');
    expect(s.systemState.resilience.value).toBe(40);
    expect(s.canonizedAt).toBe('2026-02-01T00:00:00.000Z');
    expect(s.lastSeed).toBe('restored-seed');
  });

  test('opening a legacy save without campaignState falls back to draft defaults', () => {
    const save = { id: 'save-legacy', settlement: fixture(), seed: 'legacy-seed' };
    store.getState().hydrateFromSave(save);
    const s = store.getState();
    expect(s.phase).toBe('draft');
    expect(s.eventLog).toEqual([]);
    expect(s.systemState).toBeTruthy();  // re-derived from settlement
  });
});
