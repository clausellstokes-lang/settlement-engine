/**
 * tests/store/advanceCampaignWorldInFlightGuard.test.js
 *
 * advanceCampaignWorld is async — it awaits the lazy simulation import, then the
 * cloud flush + the party-impact replays. Without an in-flight guard a double-click
 * re-enters the action a SECOND time before the first has settled, running TWO real
 * ticks (cloud increment + world drift) off one user intent.
 *
 * The fix marks the campaignId in-flight SYNCHRONOUSLY at the very top of the action
 * (before the first await) and clears it in a finally; a re-entrant call sees the
 * campaign already in flight and no-ops with { ok:false, reason:'advance_in_flight' }.
 *
 * This test fires TWO concurrent advanceCampaignWorld calls and asserts the heavy
 * kernel runs EXACTLY ONCE and the tick advances by exactly one — it FAILS before the
 * guard (kernel runs twice, tick advances twice) and PASSES after. It also checks the
 * isAdvanceInFlight selector toggles and is cleared on settle, and that a throwing
 * pulse still clears the flag (no permanent wedge).
 */
import { beforeEach, describe, test, expect, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

// Pin the advance path to SINGLE-TICK so each advance moves the clock by exactly
// one tick — the in-flight guard wraps BOTH paths identically (it's the outermost
// re-entry gate), so this just keeps the tick arithmetic deterministic for the
// assertions. (Multi-tick GA runs N weekly ticks per interval, which would make
// "advanced once" read as +4 for one_month and obscure the double-tick check.)
vi.mock('../../src/lib/flags.js', () => ({
  flag: vi.fn(() => false),
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

// Count + control BOTH advance paths (single-tick + multi-tick interval). Whichever
// the flag selects, the call count is what proves the guard ran the kernel once.
const pulseControl = { throws: false, single: 0, interval: 0 };
vi.mock('../../src/domain/worldPulse/index.js', async (importActual) => {
  const actual = /** @type {any} */ (await importActual());
  return {
    ...actual,
    advanceCampaignWorld: vi.fn((args) => {
      pulseControl.single += 1;
      if (pulseControl.throws) throw new Error('synthetic pulse failure');
      return actual.advanceCampaignWorld(args);
    }),
    simulateCampaignWorldInterval: vi.fn((args) => {
      pulseControl.interval += 1;
      if (pulseControl.throws) throw new Error('synthetic pulse failure');
      return actual.simulateCampaignWorldInterval(args);
    }),
  };
});

import { createSettlementSlice } from '../../src/store/settlementSlice.js';
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
  auth: { user: null, tier: 'free', loading: false },
  config: { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
  institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
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
  return create(immer((...a) => ({
    ...stubSlice(...a),
    ...createSettlementSlice(...a),
    ...createCampaignSlice(...a),
    ...createCampaignRegionalSlice(...a),
    ...createCampaignWorldPulseSlice(...a),
  })));
}

function settlement(name) {
  return {
    name,
    tier: 'town',
    population: 1500,
    config: { tradeRouteAccess: 'road', priorityEconomy: 20 },
    institutions: [],
    economicState: { primaryImports: ['Bulk grain and foodstuffs'], primaryExports: [] },
    powerStructure: {
      publicLegitimacy: { score: 30, label: 'Contested' },
      factions: [{ faction: 'Merchant League', category: 'economy', power: 70 }],
      conflicts: [],
    },
    npcs: [{ id: 'reeve', name: 'Reeve Mara', importance: 'key' }],
    activeConditions: [],
  };
}

function seedCanonized(store) {
  store.setState(state => {
    state.savedSettlements = [{
      id: 'ashford',
      name: 'Ashford',
      phase: 'canon',
      settlement: settlement('Ashford'),
      campaignState: {
        phase: 'canon', eventLog: [], systemState: null, locks: {},
        canonizedAt: '2026-01-01T00:00:00.000Z',
      },
    }];
    state.campaigns = [{
      id: 'camp-1',
      name: 'Realm',
      settlementIds: ['ashford'],
      regionalGraph: ensureRegionalGraph(),
      wizardNews: { currentTick: 0, entries: [] },
      worldState: { rngSeed: 'store-seed', tick: 0, canonizedAt: '2026-01-01T00:00:00.000Z' },
    }];
  });
}

const worldOf = store => store.getState().campaigns[0].worldState;
const kernelCalls = () => pulseControl.single + pulseControl.interval;

describe('advanceCampaignWorld in-flight guard (no double tick on double-click)', () => {
  beforeEach(() => {
    installLocalStorage();
    localStorage.removeItem('sf_campaigns');
    pulseControl.throws = false;
    pulseControl.single = 0;
    pulseControl.interval = 0;
  });

  test('two CONCURRENT advances run the kernel ONCE and advance the tick by one', async () => {
    const store = makeStore();
    seedCanonized(store);
    expect(worldOf(store).tick).toBe(0);

    // Fire both WITHOUT awaiting the first — the second re-enters while the first
    // is still suspended on its awaits. Pre-guard this runs the kernel twice.
    const p1 = store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-02-01T00:00:00.000Z' });
    const p2 = store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-02-01T00:00:00.000Z' });
    const [r1, r2] = await Promise.all([p1, p2]);

    // The heavy compute ran exactly once across BOTH advance paths.
    expect(kernelCalls()).toBe(1);
    // The tick advanced by exactly one (single real advance).
    expect(worldOf(store).tick).toBe(1);
    // Exactly one undo snapshot was pushed (one real advance).
    expect((store.getState().pulseUndoStack || []).filter(s => s.campaignId === 'camp-1')).toHaveLength(1);
    // Exactly one of the two calls is the no-op; the other is the real advance.
    const reasons = [r1, r2].map(r => r && r.reason);
    expect(reasons.filter(x => x === 'advance_in_flight')).toHaveLength(1);
    const real = [r1, r2].find(r => !(r && r.reason === 'advance_in_flight'));
    expect(real).toBeTruthy();
    expect(real.ok).not.toBe(false);
  });

  test('the in-flight flag is cleared after the advance settles (next advance works)', async () => {
    const store = makeStore();
    seedCanonized(store);

    expect(store.getState().isAdvanceInFlight('camp-1')).toBe(false);
    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-02-01T00:00:00.000Z' });
    expect(store.getState().isAdvanceInFlight('camp-1')).toBe(false);
    expect(worldOf(store).tick).toBe(1);

    // A LATER (sequential) advance is not blocked by a stale flag.
    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-03-01T00:00:00.000Z' });
    expect(worldOf(store).tick).toBe(2);
    expect(kernelCalls()).toBe(2);
  });

  test('a throwing advance still clears the in-flight flag (no permanent wedge)', async () => {
    const store = makeStore();
    seedCanonized(store);

    pulseControl.throws = true;
    await expect(
      store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-02-01T00:00:00.000Z' }),
    ).rejects.toThrow('synthetic pulse failure');

    // The finally cleared the mark even though the action threw.
    expect(store.getState().isAdvanceInFlight('camp-1')).toBe(false);

    // The campaign can advance once the pulse recovers.
    pulseControl.throws = false;
    const r = await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-03-01T00:00:00.000Z' });
    expect(r.ok).not.toBe(false);
    expect(worldOf(store).tick).toBe(1);
  });

  test('the guard is PER campaign — a second campaign advances concurrently', async () => {
    const store = makeStore();
    seedCanonized(store);
    // Add a second canonized campaign sharing the same member.
    store.setState(state => {
      state.campaigns.push({
        id: 'camp-2',
        name: 'Other Realm',
        settlementIds: ['ashford'],
        regionalGraph: ensureRegionalGraph(),
        wizardNews: { currentTick: 0, entries: [] },
        worldState: { rngSeed: 'store-seed-2', tick: 0, canonizedAt: '2026-01-01T00:00:00.000Z' },
      });
    });

    const p1 = store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-02-01T00:00:00.000Z' });
    const p2 = store.getState().advanceCampaignWorld('camp-2', 'one_month', { now: '2026-02-01T00:00:00.000Z' });
    const [r1, r2] = await Promise.all([p1, p2]);

    // DIFFERENT campaigns → both advances are real (the guard is keyed by id).
    expect(r1.ok).not.toBe(false);
    expect(r2.ok).not.toBe(false);
    expect(kernelCalls()).toBe(2);
    expect(store.getState().campaigns.find(c => c.id === 'camp-1').worldState.tick).toBe(1);
    expect(store.getState().campaigns.find(c => c.id === 'camp-2').worldState.tick).toBe(1);
  });
});
