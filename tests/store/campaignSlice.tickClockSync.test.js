/**
 * tests/store/campaignSlice.tickClockSync.test.js — Regional wave R1 pin (C3,
 * store path). The manual impact-advance button keeps incrementing the feed
 * clock (its job: aging impacts in campaigns whose world hasn't been pulsed),
 * but the next pulse RESYNCS wizardNews.currentTick to worldState.tick — a
 * press must never permanently skew where pulse news groups.
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: {
    update: vi.fn(() => Promise.resolve()),
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

import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createCampaignRegionalSlice } from '../../src/store/campaignRegionalSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

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
  savedSettlements: [],
  settlement: null,
  activeSaveId: null,
  phase: 'draft',
  eventLog: [],
  locks: {},
  generatedAt: null,
  editedAt: null,
  canonizedAt: null,
  lastExportAt: null,
});

function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(...a), ...createCampaignSlice(...a), ...createCampaignRegionalSlice(...a), ...createCampaignWorldPulseSlice(...a) })));
}

function settlement(name) {
  return {
    name,
    tier: 'town',
    population: 1500,
    config: { tradeRouteAccess: 'road' },
    institutions: [],
    economicState: { primaryExports: [], primaryImports: [] },
    powerStructure: { factions: [], conflicts: [] },
    npcs: [],
    activeConditions: [],
  };
}

describe('campaignSlice tick clock sync', () => {
  beforeEach(() => {
    installLocalStorage();
    localStorage.removeItem('sf_campaigns');
    localStorage.removeItem('dnd_settlement_saves');
  });

  test('manual +1 then pulse: the pulse resyncs the feed clock to the world tick', async () => {
    const store = makeStore();
    const ids = ['a', 'b', 'c'];
    store.setState(state => {
      state.savedSettlements = ids.map(id => ({
        id,
        name: `Town-${id.toUpperCase()}`,
        phase: 'canon',
        settlement: settlement(`Town-${id.toUpperCase()}`),
        campaignState: { phase: 'canon', eventLog: [], locks: {} },
      }));
      state.campaigns = [{
        id: 'camp-1',
        name: 'Realm',
        settlementIds: ids,
        regionalGraph: ensureRegionalGraph({
          queuedImpacts: [{
            id: 'regional_impact.delayed',
            kind: 'route_disruption',
            sourceSettlementId: 'a',
            targetSettlementId: 'b',
            severity: 0.4,
            status: 'queued',
            delayTicks: 1,
            ageTicks: 0,
            maxAgeTicks: 12,
          }],
        }),
        wizardNews: { currentTick: 0, entries: [] },
        worldState: {
          rngSeed: 'sync-seed',
          tick: 0,
          canonizedAt: '2026-06-01T00:00:00.000Z',
          stressors: [{ id: 'world_stressor.famine.realm', type: 'famine', severity: 0.7, affectedSettlementIds: ids }],
        },
      }];
    });

    // The manual button does its job: ages the queue, increments the feed clock.
    store.getState().advanceCampaignRegionalImpacts('camp-1', 1);
    expect(store.getState().campaigns[0].wizardNews.currentTick).toBe(1);
    expect(store.getState().campaigns[0].worldState.tick).toBe(0);

    const result = await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-06-01T00:00:00.000Z' });
    const campaign = store.getState().campaigns[0];

    // Multi-tick is GA: a one_month advance is 4 real one-week ticks, so the
    // terminal world tick is 4 (the famine is a minor, so the interval runs to
    // completion without pausing). The resync target is the full-interval tick.
    expect(result.tick).toBe(4);
    expect(campaign.worldState.tick).toBe(4);
    // The press skewed the clocks; the pulse heals it (no permanent drift).
    expect(campaign.wizardNews.currentTick).toBe(campaign.worldState.tick);
    // Every entry the interval produced is stamped within the advanced window
    // [0..4] (interior beats keep their own tick; the manual 'ready' entry sits
    // at tick 1), and the feed leads with a beat on the terminal tick 4 — the tick
    // the chronicle grounds on. None drifts past the resynced world clock.
    expect(campaign.wizardNews.entries.length).toBeGreaterThan(0);
    expect(campaign.wizardNews.entries.every(entry => entry.tick >= 0 && entry.tick <= 4)).toBe(true);
    expect(campaign.wizardNews.entries.some(entry => entry.tick === 4)).toBe(true);
  });
});
