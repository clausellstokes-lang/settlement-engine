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
});
