/**
 * tests/store/advanceCampaignWorldAtomicRollback.test.js
 *
 * advanceCampaignWorld is two-phase: Phase 1 commits the queue DRAIN (player
 * intentions consumed off worldState.pendingEvents, member settlements + the
 * live view advanced) via set(); then a PURE organic pulse runs OUTSIDE the
 * producer; then Phase 2 commits the pulse result + the undo snapshot.
 *
 * The bug this guards: if the pure pulse THROWS, Phase 1's drain was already
 * committed — so the queued intentions would be silently consumed with NO tick
 * advanced and NO undo snapshot. Silent data loss.
 *
 * The fix wraps the pure compute in try/catch and, on throw, rolls the FULL
 * pre-drain snapshot back onto the draft (restorePulseSnapshot), making the whole
 * action atomic: a failed advance is a no-op. The error is re-thrown (preserving
 * the prior unguarded throw-propagation contract) so the caller learns it failed.
 *
 * This test exercises the REAL drain path (a real queued event flows through
 * drainCampaignQueueIntoState) and forces ONLY the pure pulse to throw by mocking
 * the single domain export advanceCampaignWorld; every other domain export stays
 * real, so the drain genuinely mutates state before the throw — a test that would
 * still pass if the rollback were reverted is impossible here.
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

// Mock ONLY the pure organic-pulse compute the slice calls (domainAdvanceCampaignWorld);
// keep every other worldPulse export real so the Phase-1 drain genuinely mutates
// state before the throw. The mock is toggled per-test via __pulseThrows.
const pulseControl = { throws: false };
vi.mock('../../src/domain/worldPulse/index.js', async (importActual) => {
  const actual = /** @type {any} */ (await importActual());
  return {
    ...actual,
    advanceCampaignWorld: vi.fn((args) => {
      if (pulseControl.throws) throw new Error('synthetic pulse failure');
      return actual.advanceCampaignWorld(args);
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
    activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.72 }],
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
  // Open the member as the active settlement so the live-view rollback is exercised.
  store.getState().hydrateFromSave(store.getState().savedSettlements[0]);
}

const stressorEvent = (id, type = 'under_siege') => ({
  id,
  type: 'APPLY_STRESSOR',
  targetId: type,
  payload: { stressorType: type, label: 'Under Siege', severity: 0.7 },
  cause: 'player_action',
});

const worldOf = store => store.getState().campaigns[0].worldState;
const pendingOf = store => worldOf(store).pendingEvents || [];

describe('advanceCampaignWorld atomic rollback when the pure pulse throws', () => {
  beforeEach(() => {
    installLocalStorage();
    localStorage.removeItem('sf_campaigns');
    pulseControl.throws = false;
  });

  test('a throwing pulse leaves the drained queue intact and no tick advanced (atomic)', async () => {
    const store = makeStore();
    seedCanonized(store);

    // Queue a real player intention. This proves the drain path is live: a tick
    // advance MUST drain it, so if rollback fails the queue is lost.
    store.getState().applyEvent(stressorEvent('ev-rollback'));
    expect(pendingOf(store)).toHaveLength(1);

    // Snapshot everything the drain would mutate, BEFORE the advance.
    const before = {
      tick: worldOf(store).tick,
      pendingLen: pendingOf(store).length,
      pendingId: pendingOf(store)[0]?.id,
      stressorLen: (worldOf(store).stressors || []).length,
      savedJson: JSON.stringify(store.getState().savedSettlements),
      liveSettlementJson: JSON.stringify(store.getState().settlement),
      liveEventLogJson: JSON.stringify(store.getState().eventLog),
      undoStackLen: (store.getState().pulseUndoStack || []).length,
    };

    // Force ONLY the pure pulse to throw — the drain runs (and commits) first.
    pulseControl.throws = true;
    await expect(
      store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-02-01T00:00:00.000Z' }),
    ).rejects.toThrow('synthetic pulse failure');

    // ── Atomicity assertions: the action is a complete no-op. ──
    // 1) The tick did NOT advance.
    expect(worldOf(store).tick).toBe(before.tick);
    // 2) The drained player intention is STILL queued (the whole point).
    expect(pendingOf(store)).toHaveLength(before.pendingLen);
    expect(pendingOf(store)[0]?.id).toBe(before.pendingId);
    // 3) No crisis twin leaked into the world from the (rolled-back) drain.
    expect((worldOf(store).stressors || []).length).toBe(before.stressorLen);
    // 4) No undo snapshot was pushed (a failed advance is not undoable).
    expect((store.getState().pulseUndoStack || []).length).toBe(before.undoStackLen);
    expect(store.getState().canUndoLastPulse('camp-1')).toBe(false);
    // 5) Member saves are byte-for-byte unchanged (drain's settlement/eventLog
    //    rewrite was reverted).
    expect(JSON.stringify(store.getState().savedSettlements)).toBe(before.savedJson);
    // 6) The live active view (settlement + eventLog) is unchanged too.
    expect(JSON.stringify(store.getState().settlement)).toBe(before.liveSettlementJson);
    expect(JSON.stringify(store.getState().eventLog)).toBe(before.liveEventLogJson);
  });

  test('after a rollback the SAME queued intention can be retried successfully', async () => {
    const store = makeStore();
    seedCanonized(store);
    store.getState().applyEvent(stressorEvent('ev-retry'));
    expect(pendingOf(store)).toHaveLength(1);

    // First advance throws → rolled back, queue preserved.
    pulseControl.throws = true;
    await expect(
      store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-02-01T00:00:00.000Z' }),
    ).rejects.toThrow('synthetic pulse failure');
    expect(pendingOf(store)).toHaveLength(1);
    expect(worldOf(store).tick).toBe(0);

    // Pulse recovers → the retry drains the queue and advances the tick exactly
    // as if the failure never happened (no double-drain, no lost intention).
    pulseControl.throws = false;
    const result = await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-03-01T00:00:00.000Z' });
    expect(result).toBeTruthy();
    expect(result.ok).not.toBe(false);
    expect(worldOf(store).tick).toBe(1);
    expect(pendingOf(store)).toHaveLength(0); // drained on the successful retry
    expect(store.getState().canUndoLastPulse('camp-1')).toBe(true);
    // The member logged its drained event on the successful tick.
    const ashford = store.getState().savedSettlements.find(s => s.id === 'ashford');
    expect((ashford.campaignState.eventLog || []).length).toBeGreaterThanOrEqual(1);
  });

  test('a throwing pulse with an EMPTY queue is still a no-op (no tick, no snapshot)', async () => {
    const store = makeStore();
    seedCanonized(store);
    expect(pendingOf(store)).toHaveLength(0);

    pulseControl.throws = true;
    await expect(
      store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-02-01T00:00:00.000Z' }),
    ).rejects.toThrow('synthetic pulse failure');

    expect(worldOf(store).tick).toBe(0);
    expect((store.getState().pulseUndoStack || []).length).toBe(0);
    expect(store.getState().canUndoLastPulse('camp-1')).toBe(false);
  });
});
