/**
 * deleteMemberPrunesCampaign.test.js — state-lifecycle-2 pin.
 *
 * Deleting a saved settlement used to leave campaign RESIDUE: the dead id lingered
 * in campaign.settlementIds (+ mapState placements) forever, and its queued
 * world-clock intentions survived until the next tick silently destroyed them
 * (see the removeFromCampaign contract: it prunes membership + queued intentions
 * "otherwise they'd be silently destroyed at the next tick"). The delete flows
 * never called it. The store delete chokepoint (removeSavedSettlement — the path
 * AccountPage's bulk delete uses) now prunes every campaign holding the id.
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

import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { createCampaignSlice } from '../../src/store/campaignSlice.js';
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
  savedSettlements: [], settlement: null, activeSaveId: null, phase: 'draft',
  eventLog: [], locks: {}, generatedAt: null, editedAt: null, canonizedAt: null, lastExportAt: null,
});
function makeStore() {
  return create(immer((...a) => ({
    ...stubSlice(...a),
    ...createSettlementSlice(...a),
    ...createCampaignSlice(...a),
  })));
}

function seed(store) {
  store.setState(state => {
    state.savedSettlements = [
      { id: 'ash', name: 'Ashford', settlement: { name: 'Ashford' }, campaignState: { phase: 'canon' } },
      { id: 'bram', name: 'Bramford', settlement: { name: 'Bramford' }, campaignState: { phase: 'canon' } },
    ];
    state.campaigns = [{
      id: 'camp-1', name: 'Realm', settlementIds: ['ash', 'bram'],
      regionalGraph: ensureRegionalGraph(),
      wizardNews: { currentTick: 0, entries: [] },
      worldState: {
        rngSeed: 's', tick: 0,
        pendingEvents: [
          { queueId: 'q1', saveId: 'ash', event: { id: 'e1', type: 'APPLY_STRESSOR' } },
          { queueId: 'q2', saveId: 'bram', event: { id: 'e2', type: 'APPLY_STRESSOR' } },
        ],
      },
    }];
  });
}

const campaignOf = store => store.getState().campaigns[0];

describe('state-lifecycle-2 — deleting a member prunes it from every holding campaign', () => {
  beforeEach(() => { installLocalStorage(); });

  test('removeSavedSettlement drops the id from settlementIds AND its queued pendingEvents', () => {
    const store = makeStore();
    seed(store);
    // Precondition: the campaign holds both members + both queued intentions.
    expect(campaignOf(store).settlementIds).toEqual(['ash', 'bram']);
    expect(campaignOf(store).worldState.pendingEvents.map(e => e.saveId)).toEqual(['ash', 'bram']);

    store.getState().removeSavedSettlement('ash');

    // The save is gone AND the campaign no longer references it anywhere.
    expect(store.getState().savedSettlements.map(s => s.id)).toEqual(['bram']);
    expect(campaignOf(store).settlementIds).toEqual(['bram']);
    const pending = campaignOf(store).worldState.pendingEvents;
    expect(pending.map(e => e.saveId)).toEqual(['bram']); // ash's queued intention pruned, not orphaned
  });

  test('the surviving member and its queued intention are untouched', () => {
    const store = makeStore();
    seed(store);
    store.getState().removeSavedSettlement('ash');
    expect(campaignOf(store).worldState.pendingEvents.find(e => e.queueId === 'q2')).toBeTruthy();
  });

  test('the save row itself is removed when its id type differs from the caller', () => {
    const store = makeStore();
    seed(store);
    store.setState(state => {
      state.savedSettlements[0].id = 7;
      state.campaigns[0].settlementIds[0] = '7';
      state.campaigns[0].worldState.pendingEvents[0].saveId = '7';
    });

    store.getState().removeSavedSettlement('7');

    expect(store.getState().savedSettlements.map(s => s.id)).toEqual(['bram']);
    expect(campaignOf(store).settlementIds).toEqual(['bram']);
    expect(campaignOf(store).worldState.pendingEvents.map(e => e.saveId)).toEqual(['bram']);
  });

  test('deleting a member that is in NO campaign is a plain save removal (no throw, no campaign churn)', () => {
    const store = makeStore();
    seed(store);
    store.setState(state => { state.savedSettlements.push({ id: 'lone', name: 'Lone', settlement: { name: 'Lone' } }); });
    const before = JSON.stringify(campaignOf(store));
    store.getState().removeSavedSettlement('lone');
    expect(store.getState().savedSettlements.some(s => s.id === 'lone')).toBe(false);
    expect(JSON.stringify(campaignOf(store))).toBe(before); // campaign untouched
  });

  test('an advancing campaign refuses before either the save or membership changes', () => {
    const store = makeStore();
    seed(store);
    store.setState(state => {
      state.advanceInFlight = ['camp-1'];
    });
    const beforeSaves = JSON.stringify(store.getState().savedSettlements);
    const beforeCampaign = JSON.stringify(campaignOf(store));

    expect(store.getState().removeSavedSettlement('ash')).toEqual({
      ok: false,
      reason: 'advance_in_flight',
      campaignId: 'camp-1',
    });
    expect(JSON.stringify(store.getState().savedSettlements)).toBe(beforeSaves);
    expect(JSON.stringify(campaignOf(store))).toBe(beforeCampaign);
  });

  test('a paused campaign refuses before either the save or membership changes', () => {
    const store = makeStore();
    seed(store);
    store.setState(state => {
      state.campaigns[0].worldState.pausedAdvance = { remaining: 2 };
    });
    const beforeSaves = JSON.stringify(store.getState().savedSettlements);
    const beforeCampaign = JSON.stringify(campaignOf(store));

    expect(store.getState().removeSavedSettlement('ash')).toEqual({
      ok: false,
      reason: 'advance_paused',
      campaignId: 'camp-1',
    });
    expect(JSON.stringify(store.getState().savedSettlements)).toBe(beforeSaves);
    expect(JSON.stringify(campaignOf(store))).toBe(beforeCampaign);
  });
});
