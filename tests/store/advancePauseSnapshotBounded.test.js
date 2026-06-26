/**
 * advancePauseSnapshotBounded.test.js — MEDIUM (perf): the pause cursor must not
 * retain a REDUNDANT full deep copy of the pre-tick world per pause segment.
 *
 * When a multi-tick Advance PAUSES it parks a resume cursor (worldState.pausedAdvance)
 * carrying the PRE-tick inputs the paused tick re-derives from (preSnapshot:
 * worldState + regionalGraph + wizardNews + saves). The kernel ALREADY hands those
 * as plain deep clones (they thread off the cloneJson'd sim inputs and the kernel
 * never aliases store state). The old code wrapped EACH field in a SECOND cloneJson,
 * so every pause of a multi-pause interval deep-copied the whole pre-tick world AGAIN
 * — doubling the cursor that is then serialized + persisted, unbounded across an
 * interval that re-pauses many times.
 *
 * The fix parks the kernel's references directly. These pins:
 *  - BOUNDED: the parked preSnapshot fields are the SAME objects the advance returned
 *    (no redundant re-clone). On the pre-fix code they were distinct (re-cloned) copies.
 *  - DETERMINISM: a resume of the parked cursor still replays byte-identically — the
 *    bounded representation feeds the SAME bytes to the kernel (this MUST stay green
 *    alongside worldPulseResumeDeterminism).
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
      cache: vi.fn((campaigns = [], ownerId = 'anon') => { cached.set(ownerId, clone(campaigns)); }),
      list: vi.fn(() => Promise.resolve([])),
      upsert: vi.fn(campaign => Promise.resolve(campaign?.id)),
      delete: vi.fn(() => Promise.resolve()),
      isConfigured: false,
    },
  };
});

vi.mock('../../src/lib/flags.js', () => ({
  flag: vi.fn(name => (name === 'advanceMultiTick' ? true : false)),
}));

vi.mock('../../src/lib/analytics.js', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, track: vi.fn() };
});

import { createCampaignSlice } from '../../src/store/campaignSlice.js';
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
  savedSettlements: [], settlement: null, activeSaveId: null, phase: 'draft',
  eventLog: [], locks: {}, generatedAt: null, editedAt: null, canonizedAt: null, lastExportAt: null,
});

function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(...a), ...createCampaignSlice(...a), ...createCampaignWorldPulseSlice(...a) })));
}

function settlement(name) {
  return {
    name, tier: 'town', population: 1800,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 30 },
    institutions: [],
    economicState: { primaryImports: ['Bulk grain and foodstuffs'], primaryExports: [] },
    powerStructure: {
      publicLegitimacy: { score: 40, label: 'Contested' },
      factions: [
        { faction: 'Merchant League', category: 'economy', power: 60 },
        { faction: 'Temple Wardens', category: 'religious', power: 48 },
      ],
      conflicts: [],
    },
    npcs: [{ id: `${name}-reeve`, name: `Reeve of ${name}`, importance: 'key' }],
    activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.5 }],
  };
}

// Rival/hostile two-edge graph so a multi-tick Advance PAUSES on the first major tick.
function seedStore(store) {
  store.setState(state => {
    state.savedSettlements = ['a', 'b', 'c'].map(id => ({
      id, name: id, phase: 'canon',
      settlement: settlement(id),
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    }));
    state.campaigns = [{
      id: 'camp-1', name: 'Realm', settlementIds: ['a', 'b', 'c'],
      regionalGraph: ensureRegionalGraph({
        edges: [
          { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'rival' },
          { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'hostile' },
        ],
      }),
      wizardNews: { currentTick: 0, entries: [] },
      worldState: { rngSeed: 'pause-store-seed', tick: 0, canonizedAt: '2026-01-01T00:00:00.000Z' },
    }];
  });
}

const NOW = '2026-01-01T00:00:00.000Z';
const CAMPAIGN_ID = 'camp-1';

describe('paused-advance cursor parks a BOUNDED (non-redundant) pre-tick snapshot', () => {
  beforeEach(() => {
    installLocalStorage();
  });

  test('the parked preSnapshot reuses the kernel pre-tick refs (no second deep copy)', async () => {
    const store = makeStore();
    seedStore(store);

    const result = await store.getState().advanceCampaignWorld(CAMPAIGN_ID, 'one_year', { now: NOW, autoResolve: false });
    expect(result.status).toBe('paused');

    const cursor = store.getState().campaigns[0].worldState.pausedAdvance;
    expect(cursor).toBeTruthy();

    // The kernel handed the advance its pre-tick inputs as plain deep clones; the
    // cursor parks THOSE references rather than deep-copying them a second time. On
    // the pre-fix code each field was wrapped in another cloneJson, so these would be
    // DISTINCT objects — the redundant per-pause full copy the fix removes.
    expect(cursor.preSnapshot.worldState).toBe(result.preWorldState);
    expect(cursor.preSnapshot.regionalGraph).toBe(result.preRegionalGraph);
    expect(cursor.preSnapshot.wizardNews).toBe(result.preWizardNews);
    expect(cursor.preSnapshot.saves).toBe(result.preSaves);
  });

  test('resume of the bounded cursor still replays byte-identically (determinism preserved)', async () => {
    // Park the cursor on a persisted campaign, then resume from two independent reloads
    // (now omitted) — they must converge bit-for-bit, proving the bounded snapshot feeds
    // the same bytes to the resume kernel.
    const origin = makeStore();
    seedStore(origin);
    const paused = await origin.getState().advanceCampaignWorld(CAMPAIGN_ID, 'one_year', { now: NOW, autoResolve: false });
    expect(paused.status).toBe('paused');
    const persistedCampaign = JSON.parse(JSON.stringify(origin.getState().campaigns[0]));
    const persistedSaves = JSON.parse(JSON.stringify(origin.getState().savedSettlements));

    const resumeOnce = () => {
      const store = makeStore();
      store.setState(state => {
        state.savedSettlements = JSON.parse(JSON.stringify(persistedSaves));
        state.campaigns = [JSON.parse(JSON.stringify(persistedCampaign))];
      });
      return store.getState().resolveIntervalMajors(CAMPAIGN_ID, {}).then(result => ({
        result,
        ws: store.getState().campaigns[0].worldState,
        regionalGraph: store.getState().campaigns[0].regionalGraph,
        wizardNews: store.getState().campaigns[0].wizardNews,
      }));
    };

    const a = await resumeOnce();
    const b = await resumeOnce();
    expect(a.result.status).toBe(b.result.status);
    expect(a.ws).toEqual(b.ws);
    expect(a.regionalGraph).toEqual(b.regionalGraph);
    expect(a.wizardNews).toEqual(b.wizardNews);
  });
});
