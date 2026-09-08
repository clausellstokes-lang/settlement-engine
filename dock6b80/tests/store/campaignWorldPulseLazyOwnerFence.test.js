/**
 * Lazy pulse mutators must re-check the campaign auth generation after their
 * dynamic import resolves. This pins the smallest path (proposal dismissal):
 * account A suspends on the fingerprint chunk, account B hydrates a same-UUID
 * campaign, and A's continuation must leave B's proposal untouched.
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const fingerprintControl = vi.hoisted(() => ({
  started: false,
  release: null,
}));

vi.mock('../../src/lib/pulseFingerprint.js', async () => {
  fingerprintControl.started = true;
  await new Promise(resolve => {
    fingerprintControl.release = resolve;
  });
  return {
    extractProposalDecision: vi.fn((proposal, decision) => ({ proposal, decision })),
    extractSimulationRules: vi.fn(() => ({})),
    extractPartyImpact: vi.fn(() => ({})),
  };
});

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

vi.mock('../../src/lib/campaigns.js', () => ({
  isCampaignActive: campaign => (campaign?.accessState || 'active') === 'active',
  campaigns: {
    cache: vi.fn(),
    upsert: vi.fn(campaign => Promise.resolve(campaign?.id)),
    isConfigured: false,
  },
}));

vi.mock('../../src/lib/analytics.js', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, track: vi.fn() };
});

import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';

function campaign(owner) {
  return {
    id: 'same-campaign',
    name: `Realm ${owner}`,
    settlementIds: [],
    worldState: {
      canonizedAt: '2026-01-01T00:00:00.000Z',
      tick: 1,
      proposals: [{ id: 'same-proposal', status: 'pending', owner }],
    },
  };
}

function makeStore() {
  return create(immer((...args) => ({
    auth: { user: { id: 'owner-a' }, session: { access_token: 'token-a' } },
    campaignSessionGeneration: 0,
    campaigns: [campaign('owner-a')],
    savedSettlements: [],
    isCampaignMutationLocked: () => false,
    ...createCampaignWorldPulseSlice(...args),
  })));
}

describe('campaign pulse lazy-mutator owner fence', () => {
  beforeEach(() => {
    fingerprintControl.started = false;
    fingerprintControl.release = null;
    globalThis.localStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
    };
  });

  test('a deferred dismissal from A cannot dismiss B same-id proposal', async () => {
    const store = makeStore();
    const pending = store.getState().dismissWorldPulseProposal(
      'same-campaign',
      'same-proposal',
    );

    await vi.waitFor(() => {
      expect(fingerprintControl.started).toBe(true);
      expect(fingerprintControl.release).toBeTypeOf('function');
    }, { timeout: 5_000 });

    store.setState(state => {
      state.campaignSessionGeneration += 1;
      state.advanceInFlight = [];
      state.pulseUndoStack = [];
      state.auth = { user: { id: 'owner-b' }, session: { access_token: 'token-b' } };
      state.campaigns = [campaign('owner-b')];
    });
    fingerprintControl.release();

    await expect(pending).resolves.toBeNull();
    expect(store.getState().campaigns[0]).toMatchObject({
      name: 'Realm owner-b',
      worldState: {
        proposals: [{ id: 'same-proposal', status: 'pending', owner: 'owner-b' }],
      },
    });
  });
});
