/**
 * realmForecast.test.js — W-COMPOSER-2 Stage 4: PREVIEW ≡ APPLY for THE
 * FORECAST (Composer V2 §10 — "Barring further edits, the forecast IS the
 * next tick").
 *
 * The joins pin: a queue-inclusive forecast over the pre-advance snapshot
 * equals the REAL committed advance byte-for-byte — same drain, same interval
 * orchestrator, same clones-in — modulo the store's own session stamps
 * (lastLivingAdvanceAt, a persistence-side mark the forecast deliberately
 * never writes: no-commit discipline).
 *
 * Harness mirrors campaignClockQueue.test.js with the multi-tick flag ON (the
 * GA path the forecast shares) and the advance worker OFF (in-thread compute).
 */
import { beforeEach, describe, test, expect, vi } from 'vitest';
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
      cache: vi.fn((campaigns = [], ownerId = 'anon') => { cached.set(ownerId, clone(campaigns)); }),
      list: vi.fn(() => Promise.resolve([])),
      upsert: vi.fn(campaign => Promise.resolve(campaign?.id)),
      delete: vi.fn(() => Promise.resolve()),
      isConfigured: false,
    },
  };
});

// Multi-tick ON (the GA default the forecast shares); worker OFF (in-thread).
vi.mock('../../src/lib/flags.js', () => ({
  flag: vi.fn(name => name === 'advanceMultiTick'),
}));

import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createCampaignRegionalSlice } from '../../src/store/campaignRegionalSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { simulatePendingFuture } from '../../src/domain/worldPulse/forecastRun.js';

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
  auth: { user: null, tier: 'free', loading: false },
  config: { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
  institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
  customContent: {}, importedNeighbour: null, campaigns: [], campaignsLoaded: true,
  isTierAllowed: () => true, canSave: () => true, maxSaves: () => 50, setPurchaseModalOpen: () => {},
});

function makeStore() {
  return create(immer((...a) => ({
    ...stubSlice(...a),
    ...createCampaignSlice(...a),
    ...createCampaignRegionalSlice(...a),
    ...createCampaignWorldPulseSlice(...a),
    ...createSettlementSlice(...a),
  })));
}

function fixture(name) {
  return {
    name, tier: 'town', population: 1800,
    config: { tradeRouteAccess: 'road', monsterThreat: 'safe' },
    institutions: [{ id: 'institution.granary', name: 'Granary', category: 'civic', status: 'active' }],
    economicState: { primaryImports: [], primaryExports: [] },
    powerStructure: {
      publicLegitimacy: { score: 40, label: 'Contested' },
      factions: [{ faction: 'Council', category: 'governance', power: 60 }],
      conflicts: [],
    },
    npcs: [{ id: 'reeve', name: 'Reeve Mara', importance: 'key' }],
    activeConditions: [],
  };
}

function seed(store, ids = ['ashford', 'brookmere']) {
  store.setState(state => {
    state.savedSettlements = ids.map(id => ({
      id, name: id, tier: 'town', settlement: fixture(id), seed: `${id}-seed`,
      campaignState: {
        phase: 'canon', eventLog: [], systemState: null, locks: {},
        generatedAt: '2026-01-01T00:00:00.000Z', editedAt: '2026-01-01T00:00:00.000Z',
        canonizedAt: '2026-01-01T00:00:00.000Z', lastExportAt: null,
      },
    }));
    state.campaigns = [{
      id: 'camp-1', name: 'Realm', settlementIds: [...ids],
      regionalGraph: ensureRegionalGraph(),
      wizardNews: { currentTick: 0, entries: [] },
      worldState: { rngSeed: 'forecast-seed', tick: 0, canonizedAt: '2026-01-01T00:00:00.000Z' },
    }];
  });
  store.getState().hydrateFromSave(store.getState().savedSettlements[0]);
  return store;
}

const NOW = '2026-02-01T00:00:00.000Z';

describe('THE FORECAST ≡ THE ADVANCE (the §10 preview≡apply pin)', () => {
  beforeEach(() => {
    installLocalStorage();
    localStorage.removeItem('sf_campaigns');
  });

  test('a queue-inclusive forecast equals the committed advance for the same inputs (worldState + members)', async () => {
    const store = seed(makeStore());
    store.getState().applyEvent({
      id: 'ev-q1', type: 'APPLY_STRESSOR', targetId: 'under_siege',
      payload: { stressorType: 'under_siege', label: 'Under Siege', severity: 0.7 }, cause: 'player_action',
    });
    store.getState().queueSettlementEvent('brookmere', {
      id: 'ev-q2', type: 'ADD_TRADE_GOOD', targetId: 'salt', payload: { direction: 'export', entrepot: false, label: 'salt' }, cause: 'player_action',
    });

    // THE FORECAST over the pre-advance snapshot (clone-and-discard).
    const pre = JSON.parse(JSON.stringify(store.getState().campaigns[0]));
    const preSaves = JSON.parse(JSON.stringify(store.getState().savedSettlements));
    const forecast = await simulatePendingFuture({ campaign: pre, saves: preSaves, interval: 'one_month', now: NOW });

    // THE REAL ADVANCE (same now, same interval, same world).
    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: NOW });

    const committed = JSON.parse(JSON.stringify(store.getState().campaigns[0].worldState));
    const forecasted = JSON.parse(JSON.stringify(forecast.result.worldState));
    // The store's session stamps are persistence-side marks the forecast
    // deliberately never writes (no-commit discipline).
    delete committed.lastLivingAdvanceAt;
    delete forecasted.lastLivingAdvanceAt;
    expect(forecasted).toEqual(committed);

    // Member settlements: the forecast's final states equal the committed ones.
    const committedById = new Map(store.getState().savedSettlements.map(s => [String(s.id), s.settlement]));
    for (const u of forecast.result.settlementUpdates) {
      expect(JSON.parse(JSON.stringify(u.settlement)))
        .toEqual(JSON.parse(JSON.stringify(committedById.get(String(u.saveId)))));
    }
  });
});
