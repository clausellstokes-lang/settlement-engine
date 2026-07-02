/**
 * tests/store/pulseMutatorsInFlightGuard.test.js
 *
 * The multi-tick advance yields to the event loop between tick batches, and its
 * Phase-2 commit replaces the campaign worldState WHOLESALE from clones lifted
 * BEFORE that yield. Any other pulse mutator landing during the await was
 * therefore silently reverted when the advance committed (a rules edit vanished;
 * an undo popped its snapshot then evaporated) — and its persist interleaved
 * with the advance's.
 *
 * The fix gates every other pulse mutator (canonize / rules / apply-proposal /
 * dismiss-proposal / undo) on the SAME per-campaign advanceInFlight mark the
 * advance/resume actions already use: while the campaign is advancing they
 * no-op with their existing "nothing changed" value (null / false).
 *
 * These tests suspend the advance INSIDE the kernel (a gated mock — Phase 1 has
 * committed, Phase 2 is pending: the exact race window) and call the mutators.
 * They FAIL before the guard (the rules edit applies + returns rules; the
 * dismiss flips the proposal; the undo pops the snapshot) and PASS after.
 * recordPartyImpact stays UNGATED by design — the advance itself replays
 * drained party impacts through it while still marked in flight.
 */
import { beforeEach, describe, test, expect, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

// Multi-tick ON — the race window under test only exists on the interval path
// (the single-tick kernel runs synchronously between the two set() calls).
vi.mock('../../src/lib/flags.js', () => ({
  flag: vi.fn((name) => name === 'advanceMultiTick'),
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

// Gate the interval kernel: `arm()` makes the NEXT kernel call signal `entered`
// (Phase 1 is committed, Phase 2 pending) and park on `hold` until `release()`.
// The vi.mock factory runs lazily (module import time), so this const is
// initialized by the time the factory closes over it.
const kernelGate = {
  active: false,
  entered: /** @type {Promise<void>} */ (Promise.resolve()),
  _enteredRes: () => {},
  hold: /** @type {Promise<void>} */ (Promise.resolve()),
  _holdRes: () => {},
  arm() {
    this.active = true;
    this.entered = new Promise(res => { this._enteredRes = res; });
    this.hold = new Promise(res => { this._holdRes = res; });
  },
  release() {
    this.active = false;
    this._holdRes();
  },
};

vi.mock('../../src/domain/worldPulse/index.js', async (importActual) => {
  const actual = /** @type {any} */ (await importActual());
  return {
    ...actual,
    simulateCampaignWorldInterval: vi.fn(async (args) => {
      if (kernelGate.active) {
        kernelGate._enteredRes();
        await kernelGate.hold;
      }
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
      worldState: {
        rngSeed: 'store-seed',
        tick: 0,
        canonizedAt: '2026-01-01T00:00:00.000Z',
        proposals: [{
          id: 'prop-1',
          status: 'pending',
          kind: 'event',
          title: 'A pending proposal',
          settlementId: 'ashford',
          createdAt: '2026-01-15T00:00:00.000Z',
        }],
      },
    }];
  });
}

const worldOf = store => store.getState().campaigns[0].worldState;

describe('pulse mutators are gated while an advance is in flight', () => {
  beforeEach(() => {
    installLocalStorage();
    localStorage.removeItem('sf_campaigns');
    kernelGate.active = false;
  });

  test('rules / canonize / dismiss / apply no-op during the Phase-1→Phase-2 window and are NOT reverted by the commit', async () => {
    const store = makeStore();
    seedCanonized(store);

    kernelGate.arm();
    const advancing = store.getState().advanceCampaignWorld('camp-1', 'one_month', {
      now: '2026-02-01T00:00:00.000Z',
      autoResolve: true,
    });
    await kernelGate.entered; // Phase 1 committed; the wholesale Phase-2 commit is pending.
    expect(store.getState().isAdvanceInFlight('camp-1')).toBe(true);

    // A rules edit mid-advance is BLOCKED (pre-guard it applied, then Phase 2
    // silently reverted it — the classic lost write).
    const rules = await store.getState().updateCampaignSimulationRules('camp-1', { warLayerEnabled: true });
    expect(rules).toBeNull();
    expect(worldOf(store).simulationRules?.warLayerEnabled).not.toBe(true);

    // Canonize mid-advance is blocked with the same "nothing changed" contract.
    await expect(store.getState().canonizeCampaignWorld('camp-1')).resolves.toBeNull();

    // Proposal decisions mid-advance are blocked at the store seam (the panel
    // hides these controls while advancing, but the seam must hold regardless).
    await expect(store.getState().dismissWorldPulseProposal('camp-1', 'prop-1')).resolves.toBeNull();
    expect((worldOf(store).proposals || []).find(p => p.id === 'prop-1')?.status).toBe('pending');
    await expect(store.getState().applyWorldPulseProposal('camp-1', 'prop-1')).resolves.toBeNull();

    kernelGate.release();
    const result = await advancing;
    expect(result.ok).not.toBe(false);
    expect(worldOf(store).tick).toBeGreaterThan(0);
    // The blocked edit did not half-land anywhere the commit could resurrect.
    expect(worldOf(store).simulationRules?.warLayerEnabled).not.toBe(true);
    expect(store.getState().isAdvanceInFlight('camp-1')).toBe(false);

    // Once settled, the SAME mutator works — the gate is the in-flight mark,
    // not a wedge (warLayerEnabled also auto-activates settlementStrategy).
    const after = await store.getState().updateCampaignSimulationRules('camp-1', { warLayerEnabled: true });
    expect(after?.warLayerEnabled).toBe(true);
    expect(after?.settlementStrategyEnabled).toBe(true);
    expect(worldOf(store).simulationRules?.warLayerEnabled).toBe(true);
  });

  test('undoLastPulse mid-advance no-ops (keeps its snapshot) instead of popping an undo the commit would evaporate', async () => {
    const store = makeStore();
    seedCanonized(store);

    // A first COMPLETE advance parks one undo snapshot.
    const first = await store.getState().advanceCampaignWorld('camp-1', 'one_month', {
      now: '2026-02-01T00:00:00.000Z',
      autoResolve: true,
    });
    expect(first.ok).not.toBe(false);
    expect(store.getState().pulseUndoStack).toHaveLength(1);
    const tickAfterFirst = worldOf(store).tick;

    // Suspend a SECOND advance in the race window and try to undo the first.
    kernelGate.arm();
    const advancing = store.getState().advanceCampaignWorld('camp-1', 'one_month', {
      now: '2026-03-01T00:00:00.000Z',
      autoResolve: true,
    });
    await kernelGate.entered;
    // Pre-guard this returned true, consumed the snapshot, and restored tick 0 —
    // all of it then clobbered by the pending Phase-2 commit.
    await expect(store.getState().undoLastPulse('camp-1')).resolves.toBe(false);
    expect(store.getState().pulseUndoStack).toHaveLength(1);

    kernelGate.release();
    const result = await advancing;
    expect(result.ok).not.toBe(false);
    expect(worldOf(store).tick).toBeGreaterThan(tickAfterFirst);
    expect(store.getState().pulseUndoStack).toHaveLength(2);

    // Settled again → undo works and reverses exactly the second advance.
    await expect(store.getState().undoLastPulse('camp-1')).resolves.toBe(true);
    expect(worldOf(store).tick).toBe(tickAfterFirst);
  });
});
