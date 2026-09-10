import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import {
  contentRuntimeFromEnvironment,
  makeCampaignContentBinding,
  makeLibraryContentEnvironmentRevision,
} from '../../src/domain/content/contentEnvironment.js';
import { campaigns as campaignService } from '../../src/lib/campaigns.js';
import { createCampaignSlice } from '../../src/store/campaignSlice.js';

vi.mock('../../src/generators/generateSettlementPipeline.js', () => ({
  generateSettlementPipeline: (config, _neighbour, options) => ({
    name: 'Preview Town',
    tier: config.settType || 'town',
    population: 1000,
    economicState: {
      prosperity: 'stable',
      primaryExports: [],
      primaryImports: [],
    },
    foodSupply: { status: 'adequate' },
    institutions: (options.customContent?.institutions || []).map(item => ({
      ...item,
      source: 'custom',
    })),
    nearbyResourcesCustom: [],
    availableServices: {},
  }),
}));

function installLocalStorage() {
  const values = new Map();
  globalThis.localStorage = {
    getItem: key => values.get(String(key)) ?? null,
    setItem: (key, value) => values.set(String(key), String(value)),
    removeItem: key => values.delete(String(key)),
    clear: () => values.clear(),
  };
}

function library(name, revision) {
  return {
    institutions: [{
      name,
      definitionId: 'definition:guild',
      revisionId: `revision:guild:${revision}`,
      localUid: 'lu_guild',
    }],
  };
}

function runtimeFor(content) {
  const environment = makeLibraryContentEnvironmentRevision(content);
  return contentRuntimeFromEnvironment(environment, content);
}

function makeStore(initialRuntime) {
  return create(immer((set, get) => ({
    auth: {
      user: { id: 'campaign-content-owner' },
      tier: 'premium',
      role: 'user',
    },
    savedSettlements: [],
    customRuntime: initialRuntime,
    getActiveCustomContentRuntime: () => get().customRuntime,
    ...createCampaignSlice(set, get),
  })));
}

describe('campaign content lifecycle store boundary', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    installLocalStorage();
  });

  test('reviews, durably applies, and rolls back through saved-map history', async () => {
    const firstRuntime = runtimeFor(library('Old Guild', 1));
    const store = makeStore(firstRuntime);
    const campaignId = store.getState().createCampaign('Content Realm');
    const firstHash = store.getState().campaigns[0].contentBinding.bindingHash;

    store.setState(state => {
      state.customRuntime = runtimeFor(library('New Guild', 2));
    });
    const preview = await store.getState()
      .previewCampaignContentBindingMigration(campaignId);
    expect(preview).toMatchObject({
      ok: true,
      sameSeedSample: {
        sameSeed: true,
        saved: false,
      },
    });

    const migrated = await store.getState()
      .applyCampaignContentBindingMigration(campaignId, preview);
    expect(migrated).toMatchObject({
      ok: true,
      status: 'applied',
      persistence: { state: 'confirmed' },
    });
    const afterMigration = store.getState().campaigns[0];
    expect(afterMigration.contentBinding.bindingHash).not.toBe(firstHash);
    expect(afterMigration.contentBindingHistory.map(binding => binding.bindingHash))
      .toContain(firstHash);

    const rollbackPreview = await store.getState()
      .previewCampaignContentBindingRollback(campaignId, firstHash);
    expect(rollbackPreview).toMatchObject({
      ok: true,
      plan: { kind: 'campaign.content-binding.rollback' },
    });
    const rollback = await store.getState()
      .applyCampaignContentBindingMigration(campaignId, rollbackPreview);
    expect(rollback).toMatchObject({
      ok: true,
      persistence: { state: 'confirmed' },
    });
    expect(store.getState().campaigns[0].contentBinding.bindingHash)
      .toBe(firstHash);
  });

  test('rejects replay of a reviewed plan after the binding head moved', async () => {
    const store = makeStore(runtimeFor(library('Old Guild', 1)));
    const campaignId = store.getState().createCampaign('Content Realm');
    store.setState(state => {
      state.customRuntime = runtimeFor(library('New Guild', 2));
    });
    const preview = await store.getState()
      .previewCampaignContentBindingMigration(campaignId);
    expect((await store.getState()
      .applyCampaignContentBindingMigration(campaignId, preview)).ok).toBe(true);

    expect(await store.getState()
      .applyCampaignContentBindingMigration(campaignId, preview))
      .toMatchObject({
        ok: false,
        status: 'stale',
        reason: 'campaign_content_binding_stale',
        persistence: { state: 'not-started' },
      });
  });

  test('a reviewed plan cannot cross an account-session boundary', async () => {
    const store = makeStore(runtimeFor(library('Old Guild', 1)));
    const campaignId = store.getState().createCampaign('Content Realm');
    store.setState(state => {
      state.customRuntime = runtimeFor(library('New Guild', 2));
    });
    const preview = await store.getState()
      .previewCampaignContentBindingMigration(campaignId);

    store.setState(state => {
      state.auth.user = { id: 'replacement-owner' };
      state.campaignSessionGeneration += 1;
    });
    expect(await store.getState()
      .applyCampaignContentBindingMigration(campaignId, preview))
      .toMatchObject({
        ok: false,
        status: 'stale',
        reason: 'campaign_content_authority_stale',
        persistence: { state: 'not-started' },
      });
  });

  test('refreshes the winning binding when another tab advances the campaign', async () => {
    const store = makeStore(runtimeFor(library('Old Guild', 1)));
    const campaignId = store.getState().createCampaign('Content Realm');
    const original = structuredClone(store.getState().campaigns[0]);

    store.setState(state => {
      state.customRuntime = runtimeFor(library('Requested Guild', 2));
    });
    const preview = await store.getState()
      .previewCampaignContentBindingMigration(campaignId);
    const winningBinding = makeCampaignContentBinding(
      library('Winning Guild', 3),
    );
    const remoteCampaign = {
      ...original,
      contentBinding: winningBinding,
      contentBindingHistory: [
        original.contentBinding,
        winningBinding,
      ],
      contentBindingStatus: 'pinned',
      pendingSync: false,
    };
    localStorage.setItem(
      'sf_campaigns:campaign-content-owner',
      JSON.stringify([remoteCampaign]),
    );

    const result = await store.getState()
      .applyCampaignContentBindingMigration(campaignId, preview);

    expect(result).toMatchObject({
      ok: false,
      status: 'stale',
      reason: 'campaign_content_binding_conflict',
      persistence: { state: 'conflict' },
      remoteBinding: {
        bindingHash: winningBinding.bindingHash,
      },
    });
    expect(store.getState().campaigns[0]).toMatchObject({
      contentBinding: {
        bindingHash: winningBinding.bindingHash,
      },
      contentBindingStatus: 'conflict-refreshed',
    });
  });

  test('a local CAS preserves unrelated fields written by another tab', async () => {
    const store = makeStore(runtimeFor(library('Old Guild', 1)));
    const campaignId = store.getState().createCampaign('Content Realm');
    store.setState(state => {
      state.customRuntime = runtimeFor(library('Requested Guild', 2));
    });
    const preview = await store.getState()
      .previewCampaignContentBindingMigration(campaignId);
    const key = 'sf_campaigns:campaign-content-owner';
    const cached = JSON.parse(localStorage.getItem(key));
    cached[0].mapState = {
      schemaVersion: 2,
      placements: {},
      marker: 'other-tab-map-edit',
    };
    localStorage.setItem(key, JSON.stringify(cached));

    const result = await store.getState()
      .applyCampaignContentBindingMigration(campaignId, preview);
    const persisted = JSON.parse(localStorage.getItem(key))[0];

    expect(result).toMatchObject({
      ok: true,
      status: 'applied',
      persistence: { state: 'confirmed' },
    });
    expect(persisted).toMatchObject({
      mapState: { marker: 'other-tab-map-edit' },
      contentBinding: {
        bindingHash: preview.plan.targetBindingHash,
      },
    });
  });

  test('keeps the exact review retryable when the durable answer is unknown', async () => {
    const store = makeStore(runtimeFor(library('Old Guild', 1)));
    const campaignId = store.getState().createCampaign('Content Realm');
    const originalHash = store.getState().campaigns[0].contentBinding.bindingHash;
    store.setState(state => {
      state.customRuntime = runtimeFor(library('Requested Guild', 2));
    });
    const preview = await store.getState()
      .previewCampaignContentBindingMigration(campaignId);
    const persistence = vi.spyOn(
      campaignService,
      'compareAndSwapContentBinding',
    ).mockRejectedValueOnce(
      Object.assign(new Error('response lost after commit'), {
        code: 'network_error',
      }),
    );

    const result = await store.getState()
      .applyCampaignContentBindingMigration(campaignId, preview);

    expect(persistence).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      ok: false,
      status: 'failed',
      reason: 'campaign_content_persistence_unknown',
      retryable: true,
      persistence: { state: 'unknown' },
    });
    expect(store.getState().campaigns[0]).toMatchObject({
      contentBinding: { bindingHash: originalHash },
      contentBindingStatus: 'persistence-unknown',
    });
  });
});
