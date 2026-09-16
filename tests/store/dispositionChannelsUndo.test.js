/**
 * WR-2 lifecycle pin: the real campaign advance/undo ring preserves the extended
 * dispositionStats entry byte-for-byte. This exercises capturePulseSnapshot via
 * advanceCampaignWorld and restorePulseSnapshotOnDraft via undoLastPulse; it does
 * not hand-build an undo entry or call either helper directly.
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

vi.mock('../../src/lib/campaigns.js', () => {
  const cached = new Map();
  const clone = value => JSON.parse(JSON.stringify(value));
  return {
    isCampaignActive: campaign => (campaign?.accessState || 'active') === 'active',
    campaigns: {
      loadCached: vi.fn((ownerId = 'anon') => clone(cached.get(ownerId) || [])),
      cache: vi.fn((campaigns = [], ownerId = 'anon') => {
        cached.set(ownerId, clone(campaigns));
      }),
      list: vi.fn(() => Promise.resolve([])),
      upsert: vi.fn(campaign => Promise.resolve(campaign?.id)),
      delete: vi.fn(() => Promise.resolve()),
      isConfigured: false,
    },
  };
});

vi.mock('../../src/lib/flags.js', () => ({
  flag: vi.fn(() => false),
}));

vi.mock('../../src/lib/analytics.js', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, track: vi.fn() };
});

import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { ensureWorldState } from '../../src/domain/worldPulse/worldState.js';

const NOW = '2026-01-01T00:00:00.000Z';

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: key => data.get(String(key)) ?? null,
    setItem: (key, value) => { data.set(String(key), String(value)); },
    removeItem: key => { data.delete(String(key)); },
    clear: () => { data.clear(); },
  };
}

const stubSlice = () => ({
  savedSettlements: [], settlement: null, activeSaveId: null, phase: 'draft',
  eventLog: [], locks: {}, generatedAt: null, editedAt: null, canonizedAt: null,
  lastExportAt: null,
});

function makeStore() {
  return create(immer((...args) => ({
    ...stubSlice(...args),
    ...createCampaignSlice(...args),
    ...createCampaignWorldPulseSlice(...args),
  })));
}

function settlement() {
  return {
    name: 'Ashford', tier: 'town', population: 1500,
    config: { tradeRouteAccess: 'road', priorityEconomy: 20 },
    institutions: [],
    economicState: {
      primaryImports: ['Bulk grain and foodstuffs'],
      primaryExports: [],
    },
    powerStructure: {
      publicLegitimacy: { score: 30, label: 'Contested' },
      factions: [{ faction: 'Merchant League', category: 'economy', power: 70 }],
      conflicts: [],
    },
    npcs: [{ id: 'reeve', name: 'Reeve Mara', importance: 'key' }],
    activeConditions: [],
  };
}

function extendedDispositionStats() {
  return {
    ashford: {
      wins: 7,
      losses: 3,
      score: 4,
      channels: {
        martial: { stock01: 0.72, band: 'marked' },
        mercantile: { stock01: 0.83, band: 'dominant' },
        diplomatic: { stock01: 0.31, band: 'measured' },
        insular: { stock01: 0.62, band: 'marked' },
      },
      updatedTick: 0,
    },
  };
}

function seedStore(store) {
  store.setState(state => {
    state.savedSettlements = [{
      id: 'ashford', name: 'Ashford', phase: 'canon',
      settlement: settlement(),
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    }];
    const campaign = { id: 'camp-1', name: 'Realm' };
    state.campaigns = [{
      ...campaign,
      settlementIds: ['ashford'],
      regionalGraph: ensureRegionalGraph(),
      wizardNews: { currentTick: 0, entries: [] },
      // Seed the canonical extended shape. The real restore path re-ensures this
      // snapshot, so byte equality below also catches a lossy normalizer.
      worldState: ensureWorldState({
        rngSeed: 'disposition-undo-seed',
        tick: 0,
        canonizedAt: NOW,
        simulationRules: { dispositionChannelsEnabled: true },
        dispositionStats: extendedDispositionStats(),
      }, campaign),
    }];
  });
}

const worldOf = store => store.getState().campaigns[0].worldState;

describe('WR-2 disposition-channel undo lifecycle', () => {
  beforeEach(() => {
    installLocalStorage();
  });

  test('a real advance and real undo restore every legacy and channel field exactly', async () => {
    const store = makeStore();
    seedStore(store);
    const before = JSON.stringify(worldOf(store).dispositionStats);

    const result = await store.getState().advanceCampaignWorld(
      'camp-1',
      'one_week',
      { now: NOW },
    );

    expect(result).toBeTruthy();
    expect(worldOf(store).tick).toBe(1);
    expect(store.getState().pulseUndoStack.filter(entry => entry.campaignId === 'camp-1'))
      .toHaveLength(1);
    // Guard the guard: the lit writer really touched the seeded stock before undo.
    expect(JSON.stringify(worldOf(store).dispositionStats)).not.toBe(before);

    expect(await store.getState().undoLastPulse('camp-1')).toBe(true);
    expect(worldOf(store).tick).toBe(0);
    expect(JSON.stringify(worldOf(store).dispositionStats)).toBe(before);
    expect(worldOf(store).dispositionStats).toEqual(extendedDispositionStats());
    expect(store.getState().pulseUndoStack.filter(entry => entry.campaignId === 'camp-1'))
      .toHaveLength(0);
  });
});
