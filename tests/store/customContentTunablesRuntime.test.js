import { beforeEach, describe, expect, it } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  makeCampaignContentBinding,
  makeContentEnvironmentRevision,
} from '../../src/domain/content/contentEnvironment.js';
import { createConfigSlice } from '../../src/store/configSlice.js';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';

function runtime(tunables = {}) {
  return {
    schemaVersion: 1,
    environment: null,
    customContent: {},
    tunables,
    visualSelection: {},
  };
}

function makeStore(standaloneRuntime = runtime()) {
  return create(immer((set, get) => ({
    auth: { user: null, tier: 'free', loading: false },
    institutionToggles: {},
    categoryToggles: {},
    goodsToggles: {},
    servicesToggles: {},
    customContent: {},
    importedNeighbour: null,
    campaigns: [],
    activeCampaignId: null,
    isTierAllowed: () => true,
    canSave: () => true,
    maxSaves: () => 50,
    setPurchaseModalOpen: () => {},
    getActiveCustomContentRuntime: () => standaloneRuntime,
    ...createConfigSlice(set, get),
    ...createSettlementSlice(set, get),
  })));
}

describe('store generation resolves the correct content environment', () => {
  let store;

  beforeEach(() => {
    store = makeStore(runtime({ priorityEconomy: 87 }));
    store.setState(state => {
      // Random is an explicit request to roll priorities and would correctly
      // supersede both stored and environment values.
      state.randomSliderMode = false;
      state.config.settType = 'town';
      state.config.culture = 'germanic';
      state.config.terrainOverride = 'plains';
      state.config.tradeRouteAccess = 'road';
      state.config.monsterThreat = 'civilized';
    });
  });

  it('uses the reviewed standalone runtime without mutating visible config', async () => {
    const before = store.getState().config.priorityEconomy;
    const settlement = await store.getState().generateSettlement(
      'store-content-tunable',
    );

    expect(before).toBe(50);
    expect(store.getState().config.priorityEconomy).toBe(50);
    expect(settlement._config.priorityEconomy).toBe(87);
  });

  it('records a same-valued UI write as explicit intent', async () => {
    store.getState().updateConfig({ priorityEconomy: 50 });
    expect(store.getState().configExplicitFields).toEqual({
      priorityEconomy: true,
    });

    const settlement = await store.getState().generateSettlement(
      'store-content-tunable-explicit',
    );
    expect(settlement._config.priorityEconomy).toBe(50);
  });

  it('clears field intent with the ordinary generation-config reset', () => {
    store.getState().updateConfig({
      priorityEconomy: 50,
      magicExists: true,
    });
    expect(store.getState().configExplicitFields).toEqual({
      priorityEconomy: true,
      magicExists: true,
    });

    store.getState().resetConfig();
    expect(store.getState().configExplicitFields).toEqual({});
  });

  it('disables environment defaults with the existing custom-content gate', async () => {
    store.getState().updateConfig({ useCustomContent: false });
    const settlement = await store.getState().generateSettlement(
      'store-content-tunable-disabled',
    );
    expect(settlement._config.priorityEconomy).toBe(50);
  });

  it('prefers an active campaign pinned environment over the account runtime', async () => {
    const environment = makeContentEnvironmentRevision({
      environmentId: 'campaign-setting',
      environmentRevisionId: 'campaign-setting:v1',
      tunables: { priorityEconomy: 73 },
    });
    const contentBinding = makeCampaignContentBinding({}, {
      source: 'campaign-test',
      environment,
    });
    store.setState(state => {
      state.activeCampaignId = 'campaign-1';
      state.campaigns = [{
        id: 'campaign-1',
        accessState: 'active',
        contentBinding,
      }];
    });

    const settlement = await store.getState().generateSettlement(
      'store-content-tunable-campaign',
    );
    expect(settlement._config.priorityEconomy).toBe(73);
  });
});
