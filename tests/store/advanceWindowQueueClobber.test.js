/**
 * tests/store/advanceWindowQueueClobber.test.js
 *
 * The async multi-tick advance (advanceCampaignWorld with advanceMultiTick ON, and
 * resolveIntervalMajors) opens a REAL await window between its two committing set()
 * calls: Phase 1 drains the queue and commits, then it AWAITS the pure interval
 * compute, then Phase 2 REPLACES the campaign's worldState wholesale from a clone
 * captured BEFORE the await (campaignPulseHelpers.applyWorldPulseResultToState).
 *
 * The advanceInFlight guard serializes advance-vs-advance and resume, but it did NOT
 * block a MEMBER settlement write landing inside that window. A queueSettlementEvent
 * (or the applyEvent clock-bound branch) that fires during the await appends to the
 * live worldState.pendingEvents, then Phase 2 overwrites worldState from the pre-await
 * clone — DROPPING the just-queued member event while reporting success to the caller.
 * That is a silent lost write of a real GM intention.
 *
 * The fix mirrors the existing changeQueueFlushing floor: while an advance is in
 * flight for that campaign, a member world-write no-ops (returns null) instead of
 * appending-then-being-clobbered, so the caller learns the intention was rejected and
 * can re-issue it after the advance settles.
 *
 * These tests block the pure pulse compute mid-await, fire a member write during the
 * window, then release. They FAIL before the fix (the caller sees a success result yet
 * the event is absent after Phase 2 — a lost write) and PASS after (the write is
 * cleanly rejected during the window; nothing is silently dropped).
 */
import { beforeEach, describe, test, expect, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

// Pin the advance path to MULTI-TICK so the real async await window between the
// drain set() and the wholesale-replace set() is exercised (the single-tick path's
// compute is synchronous and never yields).
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

// Gate the multi-tick interval compute on an externally-controlled promise so the
// advance suspends mid-await, exactly where a member write would land in production.
const pulseGate = { current: null };
function armGate() {
  let signalEntered;
  const entered = new Promise(res => { signalEntered = res; });
  let release;
  const gate = new Promise(res => { release = res; });
  return { gate, signalEntered, entered, release };
}

vi.mock('../../src/domain/worldPulse/index.js', async (importActual) => {
  const actual = /** @type {any} */ (await importActual());
  return {
    ...actual,
    simulateCampaignWorldInterval: vi.fn(async (args) => {
      const { gate, signalEntered } = pulseGate.current;
      signalEntered();
      await gate;
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
const pendingOf = store => worldOf(store).pendingEvents || [];

const memberEvent = {
  id: 'evt-window-1',
  type: 'CUT_TRADE_ROUTE',
  label: 'Sever the river road',
};

describe('async advance await-window member-write clobber (lost queued event)', () => {
  beforeEach(() => {
    installLocalStorage();
    localStorage.removeItem('sf_campaigns');
    const armed = armGate();
    pulseGate.current = armed;
  });

  test('a queueSettlementEvent fired during the await window is not silently clobbered', async () => {
    const store = makeStore();
    seedCanonized(store);
    expect(pendingOf(store)).toHaveLength(0);

    // Start the advance; it suspends inside the gated interval compute — i.e. AFTER
    // Phase 1 drained + committed, BEFORE Phase 2 replaces worldState wholesale.
    const advancePromise = store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-02-01T00:00:00.000Z' });
    await pulseGate.current.entered;
    expect(store.getState().isAdvanceInFlight('camp-1')).toBe(true);

    // A MEMBER queues an event in the window. Pre-fix this appends to the live
    // pendingEvents and returns success; Phase 2 then overwrites worldState from the
    // pre-await clone, dropping it. Post-fix it no-ops (null) so nothing is lost.
    const queued = store.getState().queueSettlementEvent('ashford', memberEvent);

    // Release Phase 2 and let the advance settle.
    pulseGate.current.release();
    await advancePromise;

    // Invariant: a write that REPORTED success must still be present after the
    // advance. Pre-fix `queued` is truthy yet the event is absent — a lost write.
    if (queued) {
      const present = pendingOf(store).some(e => e.event?.id === memberEvent.id);
      expect(present).toBe(true);
    } else {
      // Post-fix: the window write was cleanly rejected (no silent append-then-drop).
      expect(queued).toBeNull();
    }

    // The advance still completed exactly once.
    expect(worldOf(store).tick).toBe(4);
    expect(store.getState().isAdvanceInFlight('camp-1')).toBe(false);
  });

  test('the applyEvent clock-bound branch does not fall through to immediate apply during the window', async () => {
    const store = makeStore();
    seedCanonized(store);
    // Make the member the active, canon settlement so applyEvent takes the
    // clock-bound branch.
    store.setState(state => {
      state.activeSaveId = 'ashford';
      state.phase = 'canon';
      state.settlement = settlement('Ashford');
    });

    const advancePromise = store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-02-01T00:00:00.000Z' });
    await pulseGate.current.entered;
    expect(store.getState().isAdvanceInFlight('camp-1')).toBe(true);

    const tickBefore = worldOf(store).tick;
    const eventLogLenBefore = store.getState().eventLog.length;

    // applyEvent during the window. Pre-fix: queueSettlementEvent appends-then-is-
    // clobbered (lost), OR if the queue no-ops, applyEvent FALLS THROUGH and resolves
    // the event immediately on the member off-pulse (a clock-bound member must never
    // resolve off the world pulse). Post-fix: applyEvent returns null — no fall-through.
    const result = store.getState().applyEvent(memberEvent);
    expect(result).toBeNull();
    // No off-pulse immediate apply: the member's eventLog did not grow in the window.
    expect(store.getState().eventLog.length).toBe(eventLogLenBefore);

    pulseGate.current.release();
    await advancePromise;

    // The advance ran once; the spurious off-pulse resolution never happened.
    expect(worldOf(store).tick).toBe(tickBefore + 4);
  });
});
