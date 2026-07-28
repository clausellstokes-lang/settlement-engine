/**
 * advanceInFlightMutatorGuard.test.js — store-2 pin.
 *
 * A multi-tick advance drains pendingEvents into a Phase-1 clone and REPLACES the
 * campaign worldState / regionalGraph wholesale in Phase-2. Any concurrent write to
 * those fields during the awaited advance window is silently destroyed. These mutators
 * were NOT gated by isAdvanceInFlight, so a DM's canon event / regional decision made
 * mid-advance returned success yet vanished. The fix gates each with a typed no-op.
 *
 * We drive the guard directly by marking advanceInFlight (the same synchronous mark the
 * advance action sets), then asserting each mutator no-ops AND leaves the campaign
 * byte-identical — and that WITHOUT the mark the same call would have written.
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
vi.mock('../../src/lib/analytics.js', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, track: vi.fn() };
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
  savedSettlements: [], settlement: null, activeSaveId: null, phase: 'draft',
  eventLog: [], locks: {}, generatedAt: null, editedAt: null, canonizedAt: null, lastExportAt: null,
});
function makeStore() {
  return create(immer((...a) => ({
    ...stubSlice(...a),
    ...createCampaignSlice(...a),
    ...createCampaignRegionalSlice(...a),
    ...createCampaignWorldPulseSlice(...a),
  })));
}
function settlement(name) {
  return {
    name, tier: 'town', population: 1500,
    config: {}, institutions: [],
    powerStructure: { publicLegitimacy: { score: 30 }, factions: [], conflicts: [] },
    npcs: [], activeConditions: [],
  };
}
function seedStore(store) {
  store.setState(state => {
    state.savedSettlements = [{
      id: 'ash', name: 'Ashford', phase: 'canon',
      settlement: settlement('Ashford'),
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    }];
    state.campaigns = [{
      id: 'camp-1', name: 'Realm', settlementIds: ['ash'],
      regionalGraph: ensureRegionalGraph(),
      wizardNews: { currentTick: 0, entries: [] },
      worldState: { rngSeed: 's', tick: 0, canonizedAt: '2026-01-01T00:00:00.000Z', pendingEvents: [] },
    }];
  });
}
const markInFlight = store => store.setState(state => { state.advanceInFlight = ['camp-1']; });
// A PARKED pause (paused mid-interval for verdicts, NOT in the advanceInFlight
// list) — the same clobber window, since resume restores worldState AND
// regionalGraph wholesale from the pre-interval snapshot (store-hooks-state-4).
const markPaused = store => store.setState(state => {
  state.campaigns[0].worldState.pausedAdvance = { cursor: { tick: 0 }, remaining: 1, interval: 'one_month' };
});
const snap = store => JSON.stringify(store.getState().campaigns[0]);
const EVENT = { id: 'e1', type: 'APPLY_STRESSOR', targetId: 'famine' };

describe('store-2 — mutators are gated by advanceInFlight', () => {
  beforeEach(() => { installLocalStorage(); });

  test('queueSettlementEvent no-ops (truthy typed reason) while advancing, and does NOT queue', async () => {
    const store = makeStore();
    seedStore(store);
    // Baseline: NOT in flight ⇒ the event queues normally.
    const ok = store.getState().queueSettlementEvent('ash', EVENT);
    expect(ok).toMatchObject({ queued: true });
    expect(store.getState().campaigns[0].worldState.pendingEvents).toHaveLength(1);

    // Now in flight: a second queue attempt returns the typed no-op and writes nothing.
    markInFlight(store);
    const before = snap(store);
    const res = store.getState().queueSettlementEvent('ash', EVENT);
    expect(res).toMatchObject({ queued: false, reason: 'advance_in_flight' });
    // Truthy so applyEvent's clock-bound branch short-circuits (does not fall through
    // to the equally-clobbered immediate-apply path).
    expect(res).toBeTruthy();
    expect(store.getState().campaigns[0].worldState.pendingEvents).toHaveLength(1); // unchanged
    expect(snap(store)).toBe(before);
  });

  test('cancelQueuedEvent no-ops (false) while advancing', () => {
    const store = makeStore();
    seedStore(store);
    const q = store.getState().queueSettlementEvent('ash', EVENT);
    markInFlight(store);
    const before = snap(store);
    expect(store.getState().cancelQueuedEvent('camp-1', q.queueId)).toBe(false);
    expect(snap(store)).toBe(before); // the pending event survived
  });

  test('setRegionalImpactStatus no-ops (null) while advancing', () => {
    const store = makeStore();
    seedStore(store);
    markInFlight(store);
    const before = snap(store);
    expect(store.getState().setRegionalImpactStatus('camp-1', 'any-id', 'ignored')).toBe(null);
    expect(snap(store)).toBe(before);
  });

  test('applyQueuedRegionalImpact no-ops (null) while advancing', async () => {
    const store = makeStore();
    seedStore(store);
    markInFlight(store);
    const before = snap(store);
    await expect(store.getState().applyQueuedRegionalImpact('camp-1', 'any-id')).resolves.toBe(null);
    expect(snap(store)).toBe(before);
  });

  test('undoCampaignStressorBridge no-ops (false) while advancing', () => {
    const store = makeStore();
    seedStore(store);
    markInFlight(store);
    const before = snap(store);
    expect(store.getState().undoCampaignStressorBridge('camp-1', { eventType: 'APPLY_STRESSOR', type: 'famine', settlementId: 'ash' })).toBe(false);
    expect(snap(store)).toBe(before);
  });

  // store-hooks-state-4 — resolveRegionalImpact + advanceCampaignRegionalImpacts
  // were the two regional mutators that MISSED the store-2 guard their siblings
  // received; applyQueuedRegionalImpact additionally lacked the parked-pause leg.
  test('advanceCampaignRegionalImpacts no-ops (null) while advancing', () => {
    const store = makeStore();
    seedStore(store);
    markInFlight(store);
    const before = snap(store);
    expect(store.getState().advanceCampaignRegionalImpacts('camp-1', 1)).toBe(null);
    expect(snap(store)).toBe(before);
  });

  test('advanceCampaignRegionalImpacts no-ops (null) while PARKED (paused)', () => {
    const store = makeStore();
    seedStore(store);
    markPaused(store);
    const before = snap(store);
    expect(store.getState().advanceCampaignRegionalImpacts('camp-1', 1)).toBe(null);
    expect(snap(store)).toBe(before);
  });

  test('resolveRegionalImpact no-ops (null) while advancing', async () => {
    const store = makeStore();
    seedStore(store);
    markInFlight(store);
    const before = snap(store);
    await expect(store.getState().resolveRegionalImpact('camp-1', 'any-id')).resolves.toBe(null);
    expect(snap(store)).toBe(before);
  });

  test('resolveRegionalImpact no-ops (null) while PARKED (paused)', async () => {
    const store = makeStore();
    seedStore(store);
    markPaused(store);
    const before = snap(store);
    await expect(store.getState().resolveRegionalImpact('camp-1', 'any-id')).resolves.toBe(null);
    expect(snap(store)).toBe(before);
  });

  test('applyQueuedRegionalImpact ALSO no-ops (null) while PARKED (paused) — the completed class', async () => {
    const store = makeStore();
    seedStore(store);
    markPaused(store);
    const before = snap(store);
    await expect(store.getState().applyQueuedRegionalImpact('camp-1', 'any-id')).resolves.toBe(null);
    expect(snap(store)).toBe(before);
  });
});

// store-registries (SB1) — the DM-reachable regional mutators that MISSED the
// store-2 / store-hooks-state-4 guard their siblings received. Each writes a field
// a running or PARKED advance restores WHOLESALE (worldState.stressors / regionalGraph
// / wizardNews), and each is reachable from a DM surface that can fire mid-advance:
//   • injectCampaignStressor       — surveyor AutonomyPanel nudge approval
//   • rebuildCampaignRegionalGraph — SettlementsPanel "Discover channels"
//   • setRegionalChannelStatus     — SettlementsPanel "confirm channel"
// The ripple-only twins (resolveCampaignStressor / setCampaignRegionalGraph) are
// DELIBERATELY left unguarded: their sole caller (settlementSlice.rippleEventThroughWorld)
// is upstream-gated by the queueSettlementEvent guard, so they never run in-flight —
// guarding them there would create a latent split-truth trap, not close a gap.
describe('store-registries — the missed regional DM mutators are gated (in-flight + parked)', () => {
  beforeEach(() => { installLocalStorage(); });

  const STRESSOR = { type: 'famine', label: 'Famine', originSettlementId: 'ash', affectedSettlementIds: ['ash'], severity: 0.5 };

  test('injectCampaignStressor: injects when idle, no-ops (null) both in-flight AND parked', () => {
    // Idle baseline — the injection lands (the guard is the block, not a wedge).
    const idle = makeStore(); seedStore(idle);
    expect(idle.getState().injectCampaignStressor('camp-1', STRESSOR)).toBeTruthy();
    expect(idle.getState().campaigns[0].worldState.stressors || []).toHaveLength(1);

    const inflight = makeStore(); seedStore(inflight); markInFlight(inflight);
    let before = snap(inflight);
    expect(inflight.getState().injectCampaignStressor('camp-1', STRESSOR)).toBe(null);
    expect(snap(inflight)).toBe(before);

    const parked = makeStore(); seedStore(parked); markPaused(parked);
    before = snap(parked);
    expect(parked.getState().injectCampaignStressor('camp-1', STRESSOR)).toBe(null);
    expect(snap(parked)).toBe(before);
  });

  test('rebuildCampaignRegionalGraph no-ops (null) both in-flight AND parked', () => {
    const inflight = makeStore(); seedStore(inflight); markInFlight(inflight);
    let before = snap(inflight);
    expect(inflight.getState().rebuildCampaignRegionalGraph('camp-1')).toBe(null);
    expect(snap(inflight)).toBe(before);

    const parked = makeStore(); seedStore(parked); markPaused(parked);
    before = snap(parked);
    expect(parked.getState().rebuildCampaignRegionalGraph('camp-1')).toBe(null);
    expect(snap(parked)).toBe(before);
  });

  test('setRegionalChannelStatus no-ops (null) both in-flight AND parked', () => {
    const inflight = makeStore(); seedStore(inflight); markInFlight(inflight);
    let before = snap(inflight);
    expect(inflight.getState().setRegionalChannelStatus('camp-1', 'any-ch', 'confirmed')).toBe(null);
    expect(snap(inflight)).toBe(before);

    const parked = makeStore(); seedStore(parked); markPaused(parked);
    before = snap(parked);
    expect(parked.getState().setRegionalChannelStatus('camp-1', 'any-ch', 'confirmed')).toBe(null);
    expect(snap(parked)).toBe(before);
  });

  // RETIRED (R-5b, owner queue #21): the setRegionalChannelVisibility pin went with
  // the op. It was the only member of this describe covering a mutator that no DM
  // surface could actually fire — its guard was written for parity with
  // setRegionalChannelStatus, against a "hide channel" control that never shipped.
  // The three pins above all cover REACHABLE doors, which is what this suite is for.
});
