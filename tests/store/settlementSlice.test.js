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
import { readFileSync } from 'node:fs';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createSettlementSlice } from '../../src/store/settlementSlice.js';
// The harness derives systemState on the REAL path (the same pure function every
// store writer calls inside its own set()); the old `refreshSystemState` store
// action existed only for harnesses and was retired with owner queue #21.
import { deriveSystemState } from '../../src/domain/state/deriveSystemState.js';
import { createPRNG } from '../../src/kernel/prng.js';
import {
  deriveGraphWithDiscoveredCandidates,
  setRegionalChannelStatus,
} from '../../src/domain/region/index.js';

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
  setCampaignRegionalGraph: (campaignId, graph) => set(state => {
    const campaign = state.campaigns.find(c => c.id === campaignId);
    if (campaign) campaign.regionalGraph = graph;
  }),
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
function fixture(overrides = {}) {
  const { config: configOverrides, economicState: economicOverrides, ...rest } = overrides;
  return {
    tier: 'town',
    name: 'Testford',
    population: 2000,
    config: { monsterThreat: 'safe', tradeRouteAccess: 'road', ...(configOverrides || {}) },
    institutions: [
      { id: 'institution.granary', name: 'Granary', category: 'civic', status: 'active' },
      { id: 'institution.temple',  name: 'Temple',  category: 'religious', status: 'active' },
    ],
    economicState: {
      primaryExports: [],
      primaryImports: [],
      ...(economicOverrides || {}),
    },
    powerStructure: {
      factions: [
        { id: 'faction.council', name: 'Council' },
        { id: 'faction.merchants', name: 'Merchants', controlsInstitutionIds: ['institution.granary'] },
      ],
      conflicts: [],
    },
    npcs: [],
    activeConditions: [],
    ...rest,
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
      s.systemState = deriveSystemState(s.settlement);
    });
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
    store.setState(s => {
      s.settlement = fixture();
      s.lastSeed = 'test-seed';
      s.systemState = deriveSystemState(s.settlement);
    });
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

describe('settlementSlice — the staleness law + the veto refusal (Composer V2 §2/§5)', () => {
  let store;
  beforeEach(() => {
    store = makeStore();
    store.setState(s => {
      s.settlement = fixture();
      s.lastSeed = 'test-seed';
      s.systemState = deriveSystemState(s.settlement);
    });
    store.getState().canonize();
  });

  // applyPendingPreview was RETIRED (the apply-prefers-pendingPreview bypass —
  // W-COMPOSER-1): apply always commits the freshly-built form event; the
  // preview↔commit identity holds via the staleness key + the compose-session
  // id instead of via a stored-preview preference.
  test('applyPendingPreview no longer exists on the store', () => {
    expect(store.getState().applyPendingPreview).toBeUndefined();
  });

  test('previewEvent stamps the staleness key: payload hash × settlement reference', () => {
    const event = {
      id: 'preview-1', type: 'DAMAGE_INSTITUTION', targetId: 'institution.granary',
      payload: { severity: 0.8 }, cause: 'player_action',
    };
    const before = store.getState().settlement;
    const preview = store.getState().previewEvent(event);
    expect(typeof preview._previewKey).toBe('string');
    expect(preview._forSettlement).toBe(before);
    // Same payload, different id ⇒ SAME key (the compose-session id is free to
    // re-mint without voiding the pane)…
    const again = store.getState().previewEvent({ ...event, id: 'preview-2' });
    expect(again._previewKey).toBe(preview._previewKey);
    // …but any payload divergence keys differently.
    const edited = store.getState().previewEvent({ ...event, payload: { severity: 0.3 } });
    expect(edited._previewKey).not.toBe(preview._previewKey);
    // And an apply replaces the settlement object — the reference half of the
    // key voids every open preview.
    store.getState().applyEvent(event);
    expect(store.getState().settlement).not.toBe(before);
  });

  test('a vetoed apply REFUSES: no eventLog entry, no settlement change, ok:false envelope', () => {
    const before = store.getState().settlement;
    const result = store.getState().applyEvent({
      id: 'veto-1', type: 'CHANGE_RULING_POWER', targetId: 'The Invisible Cabal',
      payload: { cause: 'coup' }, cause: 'player_action',
    });
    expect(result.ok).toBe(false);
    // The fixture seats no governing faction, so transferRulingPower's FIRST
    // gate fires; either power_* code is a refusal — the exact one is the
    // domain's own error, passed through verbatim.
    expect(result.veto.code).toBe('power_no_governing_faction');
    expect(typeof result.veto.message).toBe('string');
    expect(store.getState().eventLog).toEqual([]);          // NO phantom timeline entry
    expect(store.getState().settlement).toBe(before);       // nothing committed
    expect(store.getState().pendingPreview).toBeNull();     // the pane cleared
  });

  test('a DYNAMIC mid-batch veto (validateBatch cannot pre-catch it) surfaces as a refusal; the rest land', () => {
    // Both events pass reference validation; the SECOND vetoes at apply time
    // because the first already added the good (trade_good_already_present).
    const result = store.getState().applyEventBatch([
      { id: 'b-ok', type: 'ADD_TRADE_GOOD', targetId: 'Silk', payload: { direction: 'export', label: 'Silk' }, cause: 'player_action' },
      { id: 'b-veto', type: 'ADD_TRADE_GOOD', targetId: 'Silk', payload: { direction: 'export', label: 'Silk' }, cause: 'player_action' },
    ]);
    expect(result.ok).toBe(true);
    expect(result.logEntries).toHaveLength(1);
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0].code).toBe('trade_good_already_present');
    expect(store.getState().eventLog).toHaveLength(1);
    expect(store.getState().eventLog[0].event.id).toBe('b-ok');
  });
});

describe('settlementSlice — undoLastEvent reverses impairments', () => {
  let store;
  beforeEach(() => {
    store = makeStore();
    store.setState(s => {
      s.settlement = fixture();
      s.lastSeed = 'test-seed';
      s.systemState = deriveSystemState(s.settlement);
    });
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

// NOTE (F34): the 'saveSettlement persists campaignState' describe block was
// removed with the dead saveSettlement store action (no real save path called
// it — SaveToLibraryButton + the SAVE_SETTLEMENT auth intent hit
// savesService.save() directly). campaignState round-trip fidelity is still
// covered by the hydrateFromSave + active-save-integration blocks below, which
// exercise the pickleCampaignState → campaignState path used by the live save
// service. The revived first_save/third_save funnel is pinned in
// tests/store/saveMoments.test.js.

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

  test('hydrateFromSave clears session-only state so save A does not leak into save B', () => {
    // Pre-seed the slice as if the user had been working on save A: a queued
    // rename, a bumped edit clock, a pending successor prompt, and a draft
    // timeline. Opening a DIFFERENT save must not inherit any of it, or a
    // rename queued on A could commit against B (cross-identity mutation).
    store.setState(s => {
      s.activeSaveId = 'save-A';
      s.pendingEditsQueue = [{ id: 'edit-1', kind: 'rename-npc', payload: { npcIndex: 0, newName: 'Renamed' } }];
      s.pendingEditsClock = 7;
      s.pendingSuccession = { outgoingNpcId: 'npc-1', outgoingNpcName: 'Old Chief' };
      s.draftVersionHistory = [{ id: 'snap-A', kind: 'manual', label: 'A checkpoint', settlement: { name: 'Save A' } }];
    });

    store.getState().hydrateFromSave({ id: 'save-B', settlement: fixture(), seed: 'seed-B' });

    const s = store.getState();
    expect(s.activeSaveId).toBe('save-B');
    expect(s.pendingEditsQueue).toEqual([]);
    expect(s.pendingEditsClock).toBe(0);
    expect(s.pendingSuccession).toBeNull();
    expect(s.draftVersionHistory).toEqual([]);
  });
});

describe('settlementSlice — resetSettlementIdentity chokepoint (state-lifecycle-3 / store-5 / components-dossier-5)', () => {
  let store;
  beforeEach(() => { store = makeStore(); });

  // Seed the slice as if the user had been working on a CANON save A carrying the full
  // session residue + a live pipeline rail.
  const seedResidueAsCanonA = () => {
    store.setState(s => {
      s.settlement = fixture({ name: 'Town A' });
      s.activeSaveId = 'save-A';
      s.phase = 'canon';
      s.canonizedAt = '2026-02-01T00:00:00.000Z';
      s.eventLog = [{ event: { id: 'evt-A' } }];
      s.locks = { name: true };
      s.systemState = { resilience: { value: 11 } };
      s.pendingEditsQueue = [{ id: 'e', kind: 'rename-npc', payload: { npcIndex: 0, newName: 'X' } }];
      s.pendingEditsClock = 5;
      s.pendingSuccession = { outgoingNpcId: 'npc-1' };
      s.draftVersionHistory = [{ id: 'snap-A', kind: 'manual', label: 'A', settlement: { name: 'A' } }];
      s.pipelineHistory = [{ id: 'assembleInstitutions', ts: 1, summary: 'A run' }];
      s.pipelineRevealActive = true;
      s.lastRegenerationDelta = { changed: ['npcs'] };
      s.generationId = 'gen-A';
    });
  };

  const expectNoResidue = (s) => {
    expect(s.pendingEditsQueue).toEqual([]);
    expect(s.pendingEditsClock).toBe(0);
    expect(s.pendingSuccession).toBeNull();
    expect(s.draftVersionHistory).toEqual([]);
    // components-dossier-5: the rail must not render A's receipts against the new town.
    expect(s.pipelineHistory).toEqual([]);
    expect(s.pipelineRevealActive).toBe(false);
    expect(s.lastRegenerationDelta).toBeNull();
    expect(s.generationId).toBeNull();
  };

  test('setSettlement clears residue AND resets the lifecycle to a fresh draft (store-5)', () => {
    seedResidueAsCanonA();
    store.getState().setSettlement(fixture({ name: 'Town B' }));
    const s = store.getState();
    expect(s.settlement.name).toBe('Town B');
    expect(s.activeSaveId).toBeNull();
    // Lifecycle reset — no canon-A residue (else renames silently no-op under canon).
    expect(s.phase).toBe('draft');
    expect(s.eventLog).toEqual([]);
    expect(s.locks).toEqual({});
    expect(s.canonizedAt).toBeNull();
    // systemState re-derived from the NEW settlement, not the stale 11.
    expect(s.systemState).toBeTruthy();
    expect(s.systemState).not.toEqual({ resilience: { value: 11 } });
    expectNoResidue(s);
  });

  test('clearSettlement wipes the view + all residue', () => {
    seedResidueAsCanonA();
    store.getState().clearSettlement();
    const s = store.getState();
    expect(s.settlement).toBeNull();
    expect(s.activeSaveId).toBeNull();
    expect(s.phase).toBe('draft');
    expect(s.eventLog).toEqual([]);
    expect(s.canonizedAt).toBeNull();
    expect(s.systemState).toBeNull();
    expectNoResidue(s);
  });

  test('hydrateFromSave also clears the pipeline rail + regen delta (components-dossier-5)', () => {
    seedResidueAsCanonA();
    store.getState().hydrateFromSave({ id: 'save-B', settlement: fixture({ name: 'Town B' }), seed: 'b' });
    expectNoResidue(store.getState());
  });
});

describe('settlementSlice — resetSettlementIdentity is the single writer (structural prevention)', () => {
  const src = readFileSync(new URL('../../src/store/settlementSlice.js', import.meta.url), 'utf8');

  test('the chokepoint resets the FULL residue field list', () => {
    const body = src.slice(
      src.indexOf('function resetSettlementIdentity'),
      src.indexOf('export const createSettlementSlice'),
    );
    for (const field of [
      'pendingEditsQueue', 'pendingEditsClock', 'pendingSuccession', 'draftVersionHistory',
      'generationId', 'pipelineHistory', 'pipelineRevealActive', 'lastRegenerationDelta', 'pendingPreview',
    ]) {
      expect(body).toMatch(new RegExp(`state\\.${field}\\s*=`));
    }
  });

  test('exactly ONE definition and FOUR call sites — every identity swap routes through it', () => {
    // A new load path that hand-maintains its own inline reset list (the leak habitat)
    // would NOT bump this count; a new path that correctly routes through the chokepoint
    // makes it 5 and trips this pin, forcing a deliberate update. Hydration is
    // the one call allowed to preserve save-owned pending work across navigation.
    expect((src.match(/function resetSettlementIdentity/g) || []).length).toBe(1);
    const calls = src.match(
      /resetSettlementIdentity\(state(?:,\s*\{\s*preservePendingEdits:\s*true\s*\})?\);/g,
    ) || [];
    expect(calls).toHaveLength(4);
  });
});

describe('settlementSlice — regenSection lifecycle (state-lifecycle-4)', () => {
  let store;
  beforeEach(() => { store = makeStore(); });

  test('is a NO-OP on a CANON settlement (identity lock — matches renameNPC/renameFaction)', async () => {
    store.setState(s => {
      s.settlement = fixture({ name: 'Canon Town' });
      s.phase = 'canon';
    });
    const before = JSON.stringify(store.getState().settlement);
    await store.getState().regenSection('npcs');
    // Canon freezes the roster identity — the reroll never ran (a canon reroll would
    // silently invalidate campaign canon with no event-log entry).
    expect(JSON.stringify(store.getState().settlement)).toBe(before);
    expect(store.getState().lastRegenerationDelta).toBeNull();
  });

  test('a DRAFT reroll with an active save PERSISTS to that save (no ghost on reload)', async () => {
    // A real generation so regenNPCsPipeline has a valid roster to reroll.
    const gen = await store.getState().generateSettlement('fixed-seed');
    expect(gen).toBeTruthy();
    // Simulate a save hydrated into the live editor: draft phase + activeSaveId + entry.
    store.setState(s => {
      s.activeSaveId = 'save-D';
      s.phase = 'draft';
      s.savedSettlements = [{ id: 'save-D', settlement: s.settlement, campaignState: { phase: 'draft', eventLog: [] } }];
    });
    await store.getState().regenSection('npcs');
    const s = store.getState();
    // The reroll was written to the SAVE entry (settlement + campaignState) — previously
    // it lived only in memory and ghosted on reload.
    expect(s.savedSettlements[0].settlement).toEqual(s.settlement);
    expect(s.savedSettlements[0].campaignState).toBeTruthy();
    expect(s.savedSettlements[0].campaignState.systemState).toBeTruthy();
    expect(typeof s.editedAt).toBe('string');
  });
});

describe('settlementSlice — active save regional integration', () => {
  let store;
  beforeEach(() => {
    store = makeStore();
  });

  test('committed events update the active saved entry and lifecycle snapshot', () => {
    const save = {
      id: 'save-1',
      name: 'Testford',
      tier: 'town',
      settlement: fixture(),
      seed: 'save-seed',
      campaignState: {
        phase: 'canon',
        eventLog: [],
        systemState: null,
        locks: {},
        generatedAt: '2026-01-01T00:00:00.000Z',
        editedAt: '2026-01-01T00:00:00.000Z',
        canonizedAt: '2026-01-01T00:00:00.000Z',
        lastExportAt: null,
      },
    };
    store.setState(s => { s.savedSettlements = [save]; });
    store.getState().hydrateFromSave(save);

    store.getState().applyEvent({
      id: 'active-save-1',
      type: 'DAMAGE_INSTITUTION',
      targetId: 'institution.granary',
      payload: { severity: 0.8 },
      cause: 'player_action',
    });

    const entry = store.getState().savedSettlements[0];
    expect(store.getState().activeSaveId).toBe('save-1');
    expect(entry.settlement.institutions.find(i => i.id === 'institution.granary').status).toBe('impaired');
    expect(entry.campaignState.phase).toBe('canon');
    expect(entry.campaignState.eventLog).toHaveLength(1);
    expect(entry.campaignState.eventLog[0].event.id).toBe('active-save-1');
  });

  test('canon route events queue regional impacts on the active campaign graph', () => {
    const supplier = {
      id: 'supplier',
      name: 'Granary Ford',
      tier: 'town',
      settlement: fixture({
        name: 'Granary Ford',
        economicState: { primaryExports: ['Bulk grain and foodstuffs'] },
      }),
      campaignState: {
        phase: 'canon',
        eventLog: [],
        systemState: null,
        locks: {},
        generatedAt: null,
        editedAt: null,
        canonizedAt: '2026-01-01T00:00:00.000Z',
        lastExportAt: null,
      },
    };
    const buyer = {
      id: 'buyer',
      name: 'Millcross',
      tier: 'town',
      settlement: fixture({
        name: 'Millcross',
        economicState: { primaryImports: ['Grain and malt'] },
      }),
      campaignState: { phase: 'canon', eventLog: [], systemState: null, locks: {} },
    };
    let graph = deriveGraphWithDiscoveredCandidates([supplier, buyer]);
    for (const channel of graph.channels) {
      graph = setRegionalChannelStatus(graph, channel.id, 'confirmed');
    }

    store.setState(s => {
      s.savedSettlements = [supplier, buyer];
      s.campaigns = [{ id: 'camp-1', name: 'Trade Belt', settlementIds: ['supplier', 'buyer'], regionalGraph: graph }];
    });
    store.getState().hydrateFromSave(supplier);

    store.getState().applyEvent({
      id: 'route-cut-1',
      type: 'CUT_TRADE_ROUTE',
      targetId: 'east-road',
      payload: {},
      cause: 'player_action',
    });

    const campaign = store.getState().campaigns[0];
    expect(campaign.regionalGraph.queuedImpacts.length).toBeGreaterThan(0);
    expect(campaign.regionalGraph.queuedImpacts.some(i => i.targetSettlementId === 'buyer')).toBe(true);
  });
});

describe('settlementSlice — renameFaction (canonical powerStructure path)', () => {
  let store;
  beforeEach(() => {
    store = makeStore();
    store.setState(s => { s.settlement = fixture(); });
  });

  // AWAITED: renameFaction fetches domain/factionRename.js at the call seam to
  // keep the cascade off first paint, so the action returns a promise.
  test('renames a faction on powerStructure.factions (was a silent no-op on the empty legacy mirror)', async () => {
    // The fixture has factions on powerStructure.factions and no top-level
    // settlement.factions — the exact shape the old code could not rename.
    await store.getState().renameFaction(0, 'High Council');
    const factions = store.getState().settlement.powerStructure.factions;
    expect(factions[0].name).toBe('High Council');
    expect(factions[1].name).toBe('Merchants'); // sibling untouched
  });

  test('keeps .faction and .name in sync when the record labels on .faction', async () => {
    store.setState(s => {
      s.settlement.powerStructure.factions = [{ id: 'f1', faction: 'Old Guild', name: 'Old Guild' }];
    });
    await store.getState().renameFaction(0, 'New Guild');
    const f = store.getState().settlement.powerStructure.factions[0];
    expect(f.faction).toBe('New Guild');
    expect(f.name).toBe('New Guild');
  });

  test('out-of-range index is a safe no-op', async () => {
    // `.not.toThrow()` around an ASYNC action is vacuous — an async function
    // returns a rejected promise instead of throwing in the caller's frame, so
    // the old shape would have passed even if the writer blew up. Assert the
    // promise RESOLVES, and resolves to the idle envelope.
    await expect(store.getState().renameFaction(99, 'X'))
      .resolves.toMatchObject({ changed: false });
    expect(store.getState().settlement.powerStructure.factions[0].name).toBe('Council');
  });
});
