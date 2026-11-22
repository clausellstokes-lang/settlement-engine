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

  it('accumulates field intent through the door, and honours recordIntent:false', () => {
    // This pin used to end by calling resetConfig() to clear the intent bag.
    // resetConfig was RETIRED (R-5b, owner queue #21) as a dead op, so the pin is
    // re-pointed at what is actually reachable. NOTE THE HONEST CONSEQUENCE: intent
    // is now ADD-ONLY at runtime — nothing in the client clears the whole bag. That
    // is not a regression, because resetConfig had no caller either; the capability
    // was already unreachable, and this test is what stops it being re-imagined as
    // present. The one real control is updateConfig's `recordIntent: false`, which
    // writes a value WITHOUT claiming the user authored it — the flag the
    // environment-default layer reads.
    store.getState().updateConfig({
      priorityEconomy: 50,
      magicExists: true,
    });
    expect(store.getState().configExplicitFields).toEqual({
      priorityEconomy: true,
      magicExists: true,
    });

    // Intent accumulates; a later admitted write adds to the bag, never resets it.
    // (Only REGISTERED tunables record intent — monsterThreat is an admitted config
    // key but not a tunable, so it lands a value and claims no authorship.)
    store.getState().updateConfig({ priorityMagic: 80, monsterThreat: 'civilized' });
    expect(store.getState().config.monsterThreat).toBe('civilized');
    expect(store.getState().configExplicitFields).toEqual({
      priorityEconomy: true,
      magicExists: true,
      priorityMagic: true,
    });

    // recordIntent:false lands the VALUE without claiming authorship.
    store.getState().updateConfig({ priorityReligion: 71 }, { recordIntent: false });
    expect(store.getState().config.priorityReligion).toBe(71);
    expect(store.getState().configExplicitFields).toEqual({
      priorityEconomy: true,
      magicExists: true,
      priorityMagic: true,
    });
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
