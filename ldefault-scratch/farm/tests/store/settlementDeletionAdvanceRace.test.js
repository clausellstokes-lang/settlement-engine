/**
 * A settlement deletion holds a campaign membership lock while its cloud batch
 * is pending. Fresh advances, resumes, and catch-up cursor seeding must not start
 * inside that await window. The catch-up case deliberately acquires the deletion
 * lock while loadWorldEngine is suspended, pinning the post-import recheck.
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));
vi.mock('../../src/lib/flags.js', () => ({ flag: vi.fn(() => false) }));
vi.mock('../../src/lib/campaigns.js', () => ({
  isCampaignActive: campaign => (campaign?.accessState || 'active') === 'active',
  campaigns: {
    loadCached: vi.fn(() => []),
    cache: vi.fn(),
    list: vi.fn(() => Promise.resolve([])),
    upsert: vi.fn(campaign => Promise.resolve(campaign?.id)),
    delete: vi.fn(() => Promise.resolve()),
    isConfigured: false,
  },
}));

const engineGate = {
  active: false,
  entered: Promise.resolve(),
  hold: Promise.resolve(),
  arm() {
    this.active = true;
    this.entered = new Promise(resolve => {
      this.signalEntered = resolve;
    });
    this.hold = new Promise(resolve => {
      this.releaseHold = resolve;
    });
  },
  release() {
    this.active = false;
    this.releaseHold?.();
  },
};

vi.mock('../../src/store/campaignAdvanceSession.js', async importActual => {
  const actual = await importActual();
  if (engineGate.active) {
    engineGate.signalEntered();
    await engineGate.hold;
  }
  return actual;
});

import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: key => data.get(String(key)) ?? null,
    setItem: (key, value) => { data.set(String(key), String(value)); },
    removeItem: key => { data.delete(String(key)); },
    clear: () => { data.clear(); },
  };
}

function makeStore() {
  return create(immer((...args) => ({
    savedSettlements: [{ id: 'ash', name: 'Ashford', settlement: { name: 'Ashford' } }],
    ...createCampaignSlice(...args),
    ...createCampaignWorldPulseSlice(...args),
  })));
}

function seed(store) {
  store.setState(state => {
    state.campaigns = [{
      id: 'camp-1',
      name: 'Realm',
      accessState: 'active',
      settlementIds: ['ash'],
      wizardNews: { currentTick: 0, entries: [] },
      worldState: {
        rngSeed: 'seed',
        tick: 0,
        canonizedAt: '2026-01-01T00:00:00.000Z',
        simulationRules: { worldProgression: 'autonomous' },
      },
    }];
  });
}

describe('settlement deletion serializes campaign advances', () => {
  beforeEach(() => {
    installLocalStorage();
    engineGate.active = false;
  });

  test('advance/resume refuse, and catch-up rechecks after its lazy import before seeding', async () => {
    const store = makeStore();
    seed(store);
    engineGate.arm();
    const catchingUp = store.getState().catchUpCampaignWorld('camp-1', {
      now: '2026-02-01T00:00:00.000Z',
    });
    await engineGate.entered;

    let finishDeletion;
    const deletionHold = new Promise(resolve => {
      finishDeletion = resolve;
    });
    const deleting = store.getState().withSettlementDeletionLock(['ash'], () => deletionHold);
    expect(store.getState().isCampaignMutationLocked('camp-1')).toBe(true);

    await expect(store.getState().advanceCampaignWorld('camp-1')).resolves.toEqual({
      ok: false,
      reason: 'settlement_deletion_in_flight',
    });
    await expect(store.getState().resolveIntervalMajors('camp-1')).resolves.toEqual({
      ok: false,
      reason: 'settlement_deletion_in_flight',
    });

    engineGate.release();
    await expect(catchingUp).resolves.toEqual({
      ok: false,
      weeksCaughtUp: 0,
      capped: false,
      reason: 'settlement_deletion_in_flight',
    });
    expect(store.getState().campaigns[0].worldState.lastLivingAdvanceAt).toBeUndefined();

    finishDeletion({ ok: true });
    await deleting;
    expect(store.getState().isCampaignMutationLocked('camp-1')).toBe(false);
  });

  test('an unassigned settlement id remains locked against add and duplicate delete', async () => {
    const store = makeStore();
    seed(store);
    store.setState(state => {
      state.campaigns[0].settlementIds = [];
    });

    let finishDeletion;
    const deletionHold = new Promise(resolve => {
      finishDeletion = resolve;
    });
    const deleting = store.getState().withSettlementDeletionLock(['ash'], () => deletionHold);

    expect(store.getState().getSettlementDeletionBlock(['ash'])).toMatchObject({
      ok: false,
      reason: 'settlement_deletion_in_flight',
      settlementId: 'ash',
    });
    expect(store.getState().addToCampaign('camp-1', 'ash')).toMatchObject({
      ok: false,
      reason: 'settlement_deletion_in_flight',
      settlementId: 'ash',
    });
    expect(store.getState().campaigns[0].settlementIds).toEqual([]);
    await expect(
      store.getState().withSettlementDeletionLock(['ash'], () => Promise.resolve({ ok: true })),
    ).resolves.toMatchObject({ ok: false, reason: 'settlement_deletion_in_flight' });

    finishDeletion({ ok: true });
    await deleting;
    expect(store.getState().getSettlementDeletionBlock(['ash'])).toBeNull();
  });

  test('an old-owner lock is cleared at the boundary and its finally cannot release B lock', async () => {
    const store = makeStore();
    seed(store);
    let finishA;
    const deletingA = store.getState().withSettlementDeletionLock(
      ['ash'],
      () => new Promise(resolve => {
        finishA = resolve;
      }),
    );
    expect(store.getState().campaignMutationLocks).toHaveLength(1);

    store.getState().clearCampaigns();
    store.setState(state => {
      state.auth = { user: { id: 'owner-b' } };
    });
    seed(store);
    expect(store.getState().campaignMutationLocks).toEqual([]);

    let finishB;
    const deletingB = store.getState().withSettlementDeletionLock(
      ['ash'],
      () => new Promise(resolve => {
        finishB = resolve;
      }),
    );
    const bToken = store.getState().campaignMutationLocks[0].token;
    finishA({ ok: true });
    await expect(deletingA).resolves.toMatchObject({ ok: false, reason: 'auth_session_changed' });
    expect(store.getState().campaignMutationLocks.map(lock => lock.token)).toEqual([bToken]);

    finishB({ ok: true });
    await expect(deletingB).resolves.toEqual({ ok: true });
    expect(store.getState().campaignMutationLocks).toEqual([]);
  });
});
