/**
 * WR-3 member-birth lifecycle: the real advance/store/persistence/undo path.
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const { saveUpdate, saveUpsert, saveDelete } = vi.hoisted(() => ({
  saveUpdate: vi.fn(() => Promise.resolve()),
  saveUpsert: vi.fn(entry => Promise.resolve(entry?.id)),
  saveDelete: vi.fn(id => Promise.resolve(id)),
}));

vi.mock('../../src/lib/saves.js', () => ({
  saves: {
    update: saveUpdate,
    upsert: saveUpsert,
    delete: saveDelete,
    isConfigured: false,
  },
}));

vi.mock('../../src/lib/campaigns.js', () => {
  const cached = new Map();
  const clone = value => JSON.parse(JSON.stringify(value));
  return {
    isCampaignActive: campaign => (campaign?.accessState || 'active') === 'active',
    campaigns: {
      loadCached: vi.fn((ownerId = 'anon') => clone(cached.get(ownerId) || [])),
      cache: vi.fn((campaigns = [], ownerId = 'anon') => cached.set(ownerId, clone(campaigns))),
      list: vi.fn(() => Promise.resolve([])),
      upsert: vi.fn(campaign => Promise.resolve(campaign?.id)),
      delete: vi.fn(() => Promise.resolve()),
      isConfigured: false,
    },
  };
});

vi.mock('../../src/lib/flags.js', () => ({ flag: vi.fn(() => false) }));
vi.mock('../../src/lib/analytics.js', async importOriginal => {
  const actual = await importOriginal();
  return { ...actual, track: vi.fn() };
});

import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { ensureWorldState } from '../../src/domain/worldPulse/worldState.js';
import { lineageMemberSaveId } from '../../src/domain/worldPulse/lineageMemberBirth.js';
import {
  foldMemberBirthsOntoCampaign,
  foldMemberBirthsOntoSaves,
  foldUpdatesOntoSaves,
  simulateCampaignWorldInterval,
} from '../../src/domain/worldPulse/advanceInterval.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { SIMULATION_RULE_PRESETS } from '../../src/domain/worldPulse/simulationRules.js';

const NOW = '2026-01-01T00:00:00.000Z';

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: key => data.get(String(key)) ?? null,
    setItem: (key, value) => data.set(String(key), String(value)),
    removeItem: key => data.delete(String(key)),
    clear: () => data.clear(),
  };
}

function makeStore() {
  return create(immer((...args) => ({
    savedSettlements: [], settlement: null, activeSaveId: null, phase: 'draft',
    eventLog: [], locks: {}, generatedAt: null, editedAt: null, canonizedAt: null,
    lastExportAt: null,
    ...createCampaignSlice(...args),
    ...createCampaignWorldPulseSlice(...args),
  })));
}

function parentSettlement() {
  return {
    name: 'Ashford', tier: 'city', population: 12000, culture: 'germanic',
    config: { tier: 'city', settType: 'city', tradeRouteAccess: 'road' },
    institutions: [], factions: [], npcs: [], activeConditions: [],
    populationHistory: [
      { tick: 4, delta: -20, population: 12030, outcomeId: 'lifecycle.grow.sat-a.4' },
      { tick: 7, delta: -30, population: 12000, outcomeId: 'lifecycle.grow.sat-a.7' },
    ],
    economicState: { prosperity: 'Stable', primaryImports: [], primaryExports: [] },
    powerStructure: { publicLegitimacy: { score: 50 }, factions: [], conflicts: [] },
  };
}

function seedStore(store) {
  const parent = parentSettlement();
  const campaign = { id: 'camp-1', name: 'Realm' };
  store.setState(state => {
    state.savedSettlements = [{
      id: 'ashford', name: 'Ashford', phase: 'canon', settlement: parent,
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    }];
    state.campaigns = [{
      ...campaign,
      settlementIds: ['ashford'],
      regionalGraph: ensureRegionalGraph({
        nodes: [{ id: 'ashford', name: 'Ashford', tier: 'city', settlementId: 'ashford', updatedAt: NOW }],
      }, { now: NOW }),
      wizardNews: { currentTick: 8, entries: [] },
      worldState: ensureWorldState({
        rngSeed: 'lineage-birth-store',
        tick: 8,
        canonizedAt: NOW,
        simulationRules: {
          settlementLifecycleEnabled: true,
          lineageClaimEnabled: true,
        },
        spatialLedgers: {
          satellites: {
            ashford: {
              steadings: {
                'sat-a': {
                  id: 'sat-a', name: 'Weirbrook', parentId: 'ashford',
                  tier: 'hamlet', population: 430, foundedTick: 1,
                  provenance: 'growth', orbit: 0, inflow: 430, backing01: 0.6,
                  charterPending: true, charterPendingSince: 8, history: ['A charter awaits.'],
                },
              },
            },
          },
        },
      }, campaign),
    }];
    state.activeSaveId = 'ashford';
    state.settlement = parent;
    state.phase = 'canon';
  });
}

describe('WR-3 lineage member birth persistence and undo', () => {
  beforeEach(() => {
    installLocalStorage();
    saveUpdate.mockClear();
    saveUpsert.mockClear();
    saveDelete.mockClear();
  });

  test('advance creates one canon child and undo deletes that exact birth', async () => {
    const store = makeStore();
    seedStore(store);
    const beforePopulation = 12000 + 430;

    const result = await store.getState().advanceCampaignWorld(
      'camp-1',
      'one_week',
      { now: NOW },
    );

    expect(result.memberBirths).toHaveLength(1);
    const birth = result.memberBirths[0];
    const after = store.getState();
    const campaign = after.campaigns[0];
    const child = after.savedSettlements.find(save => String(save.id) === String(birth.saveId));
    expect(child).toBeTruthy();
    expect(child.campaignState.phase).toBe('canon');
    expect(child.settlement.parentRef.birthId).toBe(birth.birthId);
    expect(campaign.settlementIds.map(String)).toEqual(['ashford', String(birth.saveId)]);
    expect(campaign.regionalGraph.edges.some(edge => edge.id === birth.graphEdge.id)).toBe(true);
    expect(campaign.worldState.spatialLedgers?.satellites?.ashford?.steadings || {}).toEqual({});
    expect(after.savedSettlements.reduce((sum, save) => sum + Number(save.settlement?.population || 0), 0))
      .toBe(beforePopulation);
    expect(saveUpsert).toHaveBeenCalledTimes(1);
    expect(after.pulseUndoStack[0].memberBirths).toEqual([
      { saveId: birth.saveId, birthId: birth.birthId },
    ]);

    expect(await store.getState().undoLastPulse('camp-1')).toBe(true);
    const undone = store.getState();
    expect(undone.savedSettlements.map(save => String(save.id))).toEqual(['ashford']);
    expect(undone.campaigns[0].settlementIds.map(String)).toEqual(['ashford']);
    expect(undone.campaigns[0].regionalGraph.edges.some(edge => edge.id === birth.graphEdge.id)).toBe(false);
    expect(undone.campaigns[0].worldState.spatialLedgers.satellites.ashford.steadings['sat-a'])
      .toBeTruthy();
    expect(saveDelete).toHaveBeenCalledWith(birth.saveId, undefined);
  });

  test('a composed interval carries the birth into the next-tick campaign roster', async () => {
    const store = makeStore();
    seedStore(store);
    const clone = value => JSON.parse(JSON.stringify(value));
    const sourceCampaign = clone(store.getState().campaigns[0]);
    const sourceSaves = clone(store.getState().savedSettlements);

    const result = await simulateCampaignWorldInterval({
      campaign: sourceCampaign,
      saves: sourceSaves,
      interval: 'one_month',
      commit: true,
      now: NOW,
    });

    expect(result.status).toBe('complete');
    expect(result.tick).toBe(12);
    expect(result.memberBirths).toHaveLength(1);
    const birth = result.memberBirths[0];
    expect(result.regionalGraph.nodes.some(node => String(node.id) === String(birth.saveId)))
      .toBe(true);
    // Graduation happens after the birth tick's ordinary member movers.  A
    // settlementUpdate for the newborn can therefore only come from a later
    // tick, making this a direct participation witness rather than a rebuild.
    expect(result.settlementUpdates.map(row => String(row.saveId)))
      .toContain(String(birth.saveId));
    expect(result.pulseRecord.timeTicks.map(row => String(row.saveId)))
      .toContain(String(birth.saveId));
    expect(result.worldState.pulseHistory.at(-1).timeTicks.map(row => String(row.saveId)))
      .toContain(String(birth.saveId));
    expect(result.worldState.spatialLedgers?.satellites?.ashford?.steadings || {})
      .toEqual({});
    const transported = structuredClone(result);
    expect(transported.memberBirths[0].save.settlement.parentRef.birthId)
      .toBe(birth.birthId);

    // These are the exact folds the interval uses between ticks. The final
    // output can therefore be rebuilt into the next pulse snapshot with the
    // child as a canon participant, not merely as a receipt-side projection.
    const nextCampaign = foldMemberBirthsOntoCampaign({
      ...sourceCampaign,
      worldState: result.worldState,
      regionalGraph: result.regionalGraph,
      wizardNews: result.wizardNews,
    }, result.memberBirths);
    const nextSaves = foldMemberBirthsOntoSaves(
      foldUpdatesOntoSaves(sourceSaves, result.settlementUpdates),
      result.memberBirths,
    );
    const nextSnapshot = buildWorldSnapshot({
      campaign: nextCampaign,
      saves: nextSaves,
      worldState: result.worldState,
      regionalGraph: result.regionalGraph,
    });
    expect(nextSnapshot.byId.has(String(birth.saveId))).toBe(true);
  });

  test('the sparse newborn dossier survives subsequent ticks under the ceiling rule stack', async () => {
    const store = makeStore();
    seedStore(store);
    const clone = value => JSON.parse(JSON.stringify(value));
    const campaign = clone(store.getState().campaigns[0]);
    campaign.worldState.simulationRules = {
      ...SIMULATION_RULE_PRESETS.full_simulation.rules,
      lineageClaimEnabled: true,
    };

    const result = await simulateCampaignWorldInterval({
      campaign,
      saves: clone(store.getState().savedSettlements),
      interval: 'one_month',
      commit: true,
      now: NOW,
    });

    expect(result.status).toBe('complete');
    expect(result.memberBirths).toHaveLength(1);
    expect(result.memberBirths[0].save.campaignState.phase).toBe('canon');
    expect(result.regionalGraph.nodes.some(node => (
      String(node.id) === String(result.memberBirths[0].saveId)
    ))).toBe(true);
  });

  test('a deterministic id cannot overwrite or reclaim an unrelated or detached save', async () => {
    const store = makeStore();
    seedStore(store);
    const childId = lineageMemberSaveId(['lineage-member', 'camp-1', 'ashford', 'sat-a']);
    const collision = {
      id: childId,
      name: 'Detached Weirbrook',
      phase: 'canon',
      settlement: {
        name: 'Detached Weirbrook',
        population: 777,
        parentRef: { birthId: `lineage.birth.${childId}`, parentId: 'ashford' },
      },
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    };
    store.setState(state => {
      // The save exists in the library but is deliberately not attached to the
      // campaign. Replaying the charter must not silently seize it.
      state.savedSettlements.push(collision);
    });

    await expect(store.getState().advanceCampaignWorld(
      'camp-1',
      'one_week',
      { now: NOW },
    )).rejects.toThrow(/Lineage member id collision/);

    const after = store.getState();
    expect(after.savedSettlements.find(save => String(save.id) === childId)?.settlement)
      .toEqual(collision.settlement);
    expect(after.campaigns[0].settlementIds.map(String)).toEqual(['ashford']);
    expect(saveUpsert).not.toHaveBeenCalled();
  });

  test('a birth minted by a resume segment is added to the existing interval undo', async () => {
    const store = makeStore();
    seedStore(store);
    const clone = value => value === undefined ? undefined : JSON.parse(JSON.stringify(value));

    store.setState(state => {
      const campaign = state.campaigns[0];
      const preWorldState = clone(campaign.worldState);
      const preRegionalGraph = clone(campaign.regionalGraph);
      const preWizardNews = clone(campaign.wizardNews);
      const preSaves = clone(state.savedSettlements);
      const preIntervalUndo = {
        campaignId: campaign.id,
        now: NOW,
        tick: preWorldState.tick,
        interval: 'one_week',
        worldState: clone(preWorldState),
        regionalGraph: clone(preRegionalGraph),
        wizardNews: clone(preWizardNews),
        saves: preSaves.map(save => ({
          id: save.id,
          settlement: clone(save.settlement),
          campaignState: clone(save.campaignState),
        })),
        active: {
          saveId: 'ashford',
          settlement: clone(state.settlement),
          systemState: clone(state.systemState),
          eventLog: clone(state.eventLog),
          phase: state.phase,
        },
      };
      state.pulseUndoStack = [preIntervalUndo];
      state.advanceSeqByCampaign = { 'camp-1': 1 };
      campaign.worldState = {
        ...campaign.worldState,
        pausedAdvance: {
          interval: 'one_week',
          ticksTotal: 1,
          ticksDone: 0,
          atTick: preWorldState.tick,
          resumeTick: 0,
          autoResolve: false,
          startedAt: NOW,
          now: NOW,
          preIntervalHistoryLen: Array.isArray(preWorldState.pulseHistory)
            ? preWorldState.pulseHistory.length
            : 0,
          pendingMajors: [],
          preSnapshot: {
            worldState: preWorldState,
            regionalGraph: preRegionalGraph,
            wizardNews: preWizardNews,
            saves: preSaves,
          },
          preIntervalUndo,
        },
      };
    });

    const resumed = await store.getState().resolveIntervalMajors('camp-1', {}, { now: NOW });
    expect(resumed.status).toBe('complete');
    expect(resumed.memberBirths).toHaveLength(1);
    const birth = resumed.memberBirths[0];
    expect(store.getState().pulseUndoStack[0].memberBirths).toEqual([
      { saveId: birth.saveId, birthId: birth.birthId },
    ]);

    expect(await store.getState().undoLastPulse('camp-1')).toBe(true);
    expect(store.getState().savedSettlements.some(save => String(save.id) === String(birth.saveId)))
      .toBe(false);
    expect(saveDelete).toHaveBeenCalledWith(birth.saveId, undefined);
  });

  test('undo clears an active newborn view when there was no pre-advance member open', async () => {
    const store = makeStore();
    seedStore(store);
    store.setState(state => {
      state.activeSaveId = null;
      state.settlement = null;
      state.systemState = null;
      state.eventLog = [];
      state.phase = 'draft';
    });

    const result = await store.getState().advanceCampaignWorld(
      'camp-1',
      'one_week',
      { now: NOW },
    );
    const birth = result.memberBirths[0];
    const child = store.getState().savedSettlements
      .find(save => String(save.id) === String(birth.saveId));
    store.setState(state => {
      state.activeSaveId = birth.saveId;
      state.settlement = child.settlement;
      state.systemState = child.campaignState.systemState;
      state.eventLog = child.campaignState.eventLog || [];
      state.phase = 'canon';
      state.locks = { settlementName: true };
      state.canonizedAt = NOW;
    });

    expect(await store.getState().undoLastPulse('camp-1')).toBe(true);
    const after = store.getState();
    expect(after.activeSaveId).toBeNull();
    expect(after.settlement).toBeNull();
    expect(after.systemState).toBeNull();
    expect(after.eventLog).toEqual([]);
    expect(after.phase).toBe('draft');
    expect(after.locks).toEqual({});
  });
});
