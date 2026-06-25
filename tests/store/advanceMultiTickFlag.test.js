/**
 * tests/store/advanceMultiTickFlag.test.js — Advance-scaling Stage 1 store gate.
 *
 * Pins the flag-gated store path:
 *   • FLAG OFF (default) — advanceCampaignWorld runs the single-tick path
 *     UNCHANGED: one Advance advances exactly one tick, undo grows by exactly 1,
 *     and the WORLD_PULSE_ADVANCED analytics event fires ONCE.
 *   • FLAG ON — one Advance runs N real one-week ticks (one_month → tick +4),
 *     yet the store scaffolding still runs ONCE: undo grows by exactly 1 and the
 *     advance analytics event fires ONCE per interval (NOT once per tick).
 *
 * The flag is mocked so the test controls it directly; analytics `track` is
 * spied so we can count the per-interval advance event.
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

// Controllable flag. Default OFF; flipped per-test via setMultiTick().
let multiTickValue = false;
vi.mock('../../src/lib/flags.js', () => ({
  flag: vi.fn(name => (name === 'advanceMultiTick' ? multiTickValue : false)),
}));
function setMultiTick(v) { multiTickValue = v; }

// Spy on analytics.track so we can count the advance event per interval.
vi.mock('../../src/lib/analytics.js', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, track: vi.fn() };
});

import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { track, EVENTS } from '../../src/lib/analytics.js';

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
    name, tier: 'town', population: 1500,
    config: { tradeRouteAccess: 'road', priorityEconomy: 20 },
    institutions: [],
    economicState: { primaryImports: ['Bulk grain and foodstuffs'], primaryExports: [] },
    powerStructure: {
      publicLegitimacy: { score: 30, label: 'Contested' },
      factions: [{ faction: 'Merchant League', category: 'economy', power: 70 }],
      conflicts: [],
    },
    npcs: [{ id: 'reeve', name: 'Reeve Mara', importance: 'key' }],
    activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.72 }],
  };
}

function seedStore(store) {
  store.setState(state => {
    state.savedSettlements = [{
      id: 'ashford', name: 'Ashford', phase: 'canon',
      settlement: settlement('Ashford'),
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    }];
    state.campaigns = [{
      id: 'camp-1', name: 'Realm', settlementIds: ['ashford'],
      regionalGraph: ensureRegionalGraph(),
      wizardNews: { currentTick: 0, entries: [] },
      worldState: { rngSeed: 'store-seed', tick: 0, canonizedAt: '2026-01-01T00:00:00.000Z' },
    }];
  });
}

function advanceEventCount() {
  return track.mock.calls.filter(([event]) => event === EVENTS.WORLD_PULSE_ADVANCED).length;
}

describe('advanceMultiTick flag gate', () => {
  beforeEach(() => {
    installLocalStorage();
    setMultiTick(false);
    track.mockClear();
  });

  test('FLAG OFF: one Advance = one tick, undo +1, advance analytics fires once', async () => {
    const store = makeStore();
    seedStore(store);

    const result = await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-01-01T00:00:00.000Z' });

    expect(result.tick).toBe(1); // single coarse tick — unchanged legacy behavior
    expect(store.getState().campaigns[0].worldState.tick).toBe(1);
    expect(store.getState().pulseUndoStack.filter(s => s.campaignId === 'camp-1')).toHaveLength(1);
    expect(advanceEventCount()).toBe(1);
  });

  test('FLAG ON: one Advance runs 4 one-week ticks, but undo +1 and analytics fires ONCE', async () => {
    setMultiTick(true);
    const store = makeStore();
    seedStore(store);

    const result = await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-01-01T00:00:00.000Z' });

    // one_month = 4 real one-week ticks → terminal tick 4.
    expect(result.tick).toBe(4);
    expect(store.getState().campaigns[0].worldState.tick).toBe(4);
    // Scaffolding ran ONCE despite 4 ticks: undo grows by exactly one.
    expect(store.getState().pulseUndoStack.filter(s => s.campaignId === 'camp-1')).toHaveLength(1);
    // Analytics advance event fires ONCE per interval, not per tick.
    expect(advanceEventCount()).toBe(1);
    // pulseHistory carries the terminal pulse record (commit rode the final tick).
    expect(store.getState().campaigns[0].worldState.pulseHistory.length).toBeGreaterThan(0);
  });

  test('FLAG ON: a single undo reverts the WHOLE interval back to tick 0', async () => {
    setMultiTick(true);
    const store = makeStore();
    seedStore(store);

    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-01-01T00:00:00.000Z' });
    expect(store.getState().campaigns[0].worldState.tick).toBe(4);

    const undone = await store.getState().undoLastPulse('camp-1');
    expect(undone).toBe(true);
    expect(store.getState().campaigns[0].worldState.tick).toBe(0);
    expect(store.getState().pulseUndoStack.filter(s => s.campaignId === 'camp-1')).toHaveLength(0);
  });
});
