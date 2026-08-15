/**
 * campaignWorldPulseControlLayer.test.js — CL-0 gates (d) + (e) at the store.
 *
 * (d) FROZEN progression guard: worldProgression 'frozen' no-ops advance /
 *     resume / preview with a typed reason (the isAdvanceInFlight discipline),
 *     preserves the world byte-for-byte, and unfreezing restores everything.
 * (e) rulesetLog receipts: an EFFECTIVE rules change appends an object-keyed
 *     (rc_<tick>_<seq>) receipt to the conditionally-materialized
 *     worldState.rulesetLog plus a kind:'ruleset_change' wizard-news entry;
 *     a no-op write appends neither; an untouched campaign carries neither.
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: {
    update: vi.fn(() => Promise.resolve()),
    isConfigured: false,
  },
}));

vi.mock('../../src/lib/campaigns.js', () => {
  const cached = new Map();
  const clone = value => JSON.parse(JSON.stringify(value));
  return {
    isCampaignActive: campaign => (campaign?.accessState || 'active') === 'active',
    campaigns: {
      loadCached: vi.fn((ownerId = 'anon') => clone(cached.get(ownerId) || [])),
      cache: vi.fn((campaigns = [], ownerId = 'anon') => {
        cached.set(ownerId, clone(campaigns));
      }),
      list: vi.fn(() => Promise.resolve([])),
      upsert: vi.fn(campaign => Promise.resolve(campaign?.id)),
      delete: vi.fn(() => Promise.resolve()),
      isConfigured: false,
    },
  };
});

import { createCampaignSlice } from '../../src/store/campaignSlice.js';
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
  return create(immer((...a) => ({ ...stubSlice(...a), ...createCampaignSlice(...a), ...createCampaignWorldPulseSlice(...a) })));
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
    activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.72 }],
  };
}

function seedStore(store) {
  store.setState(state => {
    state.savedSettlements = [{
      id: 'ashford',
      name: 'Ashford',
      phase: 'canon',
      settlement: settlement('Ashford'),
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    }];
    state.campaigns = [{
      id: 'camp-1',
      name: 'Realm',
      settlementIds: ['ashford'],
      regionalGraph: ensureRegionalGraph(),
      wizardNews: { currentTick: 0, entries: [] },
      worldState: { rngSeed: 'cl0-store-seed', tick: 0, canonizedAt: '2026-01-01T00:00:00.000Z' },
    }];
  });
}

describe('CL-0 (d) — the FROZEN progression guard', () => {
  beforeEach(() => {
    installLocalStorage();
    localStorage.removeItem('sf_campaigns');
  });

  test('frozen no-ops advance/resume/preview with typed reasons, preserves state, and unfreezes clean', async () => {
    const store = makeStore();
    seedStore(store);

    // Freeze the world through the same rules seam the dialog uses.
    const frozenRules = await store.getState().updateCampaignSimulationRules('camp-1', { worldProgression: 'frozen' });
    expect(frozenRules.worldProgression).toBe('frozen');

    const before = JSON.stringify(store.getState().campaigns[0].worldState);

    // Advance no-ops with the typed reason; nothing about the world moved.
    const advanced = await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-01-01T00:00:00.000Z' });
    expect(advanced).toEqual({ ok: false, reason: 'world_frozen' });
    expect(JSON.stringify(store.getState().campaigns[0].worldState)).toBe(before);
    expect(store.getState().campaigns[0].worldState.tick).toBe(0);

    // Resume is a real-tick path too — same guard, same typed reason.
    const resumed = await store.getState().resolveIntervalMajors('camp-1', {}, { now: '2026-01-01T00:00:00.000Z' });
    expect(resumed).toEqual({ ok: false, reason: 'world_frozen' });

    // Preview honors the EFFECTIVE rules: the stored frozen world previews
    // nothing, but the dialog's unfrozen what-if draft still previews.
    expect(await store.getState().previewCampaignWorldPulse('camp-1', 'one_month', { now: '2026-01-01T00:00:00.000Z' })).toBeNull();
    const whatIf = await store.getState().previewCampaignWorldPulse('camp-1', 'one_month', {
      now: '2026-01-01T00:00:00.000Z',
      simulationRules: { worldProgression: 'dm_advanced' },
    });
    expect(whatIf?.tick).toBe(1);
    // The what-if preview never mutated the frozen world.
    expect(JSON.stringify(store.getState().campaigns[0].worldState)).toBe(before);

    // Unfreeze: everything restores — the very next advance runs normally.
    await store.getState().updateCampaignSimulationRules('camp-1', { worldProgression: 'dm_advanced' });
    const result = await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-01-01T00:00:00.000Z' });
    expect(result.tick).toBe(1);
    expect(store.getState().campaigns[0].worldState.tick).toBe(1);
  });

  test('the guard is byte-invisible to legacy campaigns (virtual read)', async () => {
    const store = makeStore();
    seedStore(store);
    // No profile keys anywhere — the guard reads dm_advanced and advances.
    const result = await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-01-01T00:00:00.000Z' });
    expect(result.tick).toBe(1);
  });
});

describe('CL-0 (e) — rulesetLog receipts + ruleset_change news', () => {
  beforeEach(() => {
    installLocalStorage();
    localStorage.removeItem('sf_campaigns');
  });

  test('an effective change appends an object-keyed receipt and a ruleset_change entry', async () => {
    const store = makeStore();
    seedStore(store);

    await store.getState().updateCampaignSimulationRules('camp-1', { warLayerEnabled: true });
    const world = store.getState().campaigns[0].worldState;

    // OBJECT keyed rc_<tick>_<seq> (deepCloneConditionalLedger rejects arrays).
    expect(Array.isArray(world.rulesetLog)).toBe(false);
    expect(Object.keys(world.rulesetLog)).toEqual(['rc_0_0']);
    const receipt = world.rulesetLog.rc_0_0;
    expect(receipt.tick).toBe(0);
    expect(receipt.changedKeys).toContain('warLayerEnabled');
    expect(receipt.from.warLayerEnabled).toBe(false);
    expect(receipt.to.warLayerEnabled).toBe(true);
    expect(receipt.preset).toBe(world.simulationRules.presetId);
    expect(Array.isArray(receipt.coercions)).toBe(true);

    // The realm-scoped, fiction-level news receipt.
    const entries = store.getState().campaigns[0].wizardNews.entries;
    const news = entries.find(e => e.kind === 'ruleset_change');
    expect(news).toBeTruthy();
    expect(news.scope).toBe('realm');
    expect(news.headline).toMatch(/^World law changed: /);
    expect(news.headline).toContain('war can now begin on its own');
  });

  test('receipts accumulate object-keyed with a per-tick sequence', async () => {
    const store = makeStore();
    seedStore(store);
    await store.getState().updateCampaignSimulationRules('camp-1', { tradeFlowsEnabled: false });
    await store.getState().updateCampaignSimulationRules('camp-1', { tradeFlowsEnabled: true });
    const log = store.getState().campaigns[0].worldState.rulesetLog;
    expect(Object.keys(log).sort()).toEqual(['rc_0_0', 'rc_0_1']);
    for (const key of Object.keys(log)) expect(key).toMatch(/^rc_\d+_\d+$/);
  });

  test('a no-op write appends NOTHING (absent when untouched)', async () => {
    const store = makeStore();
    seedStore(store);

    // Writing the current effective values changes nothing → no receipt at all.
    await store.getState().updateCampaignSimulationRules('camp-1', { warLayerEnabled: false });
    expect(store.getState().campaigns[0].worldState.rulesetLog).toBeUndefined();
    expect(store.getState().campaigns[0].wizardNews.entries.filter(e => e.kind === 'ruleset_change')).toEqual([]);

    // An effective change materializes the log; a repeat of it does not grow it.
    await store.getState().updateCampaignSimulationRules('camp-1', { warLayerEnabled: true });
    await store.getState().updateCampaignSimulationRules('camp-1', { warLayerEnabled: true });
    expect(Object.keys(store.getState().campaigns[0].worldState.rulesetLog)).toEqual(['rc_0_0']);
  });

  test('an untouched campaign carries NO rulesetLog and NO profile keys, even across an advance', async () => {
    const store = makeStore();
    seedStore(store);
    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: '2026-01-01T00:00:00.000Z' });
    const world = store.getState().campaigns[0].worldState;
    expect(world.tick).toBe(1);
    expect(world.rulesetLog).toBeUndefined();
    for (const key of ['worldProgression', 'politicalAutonomy', 'spatialMode', 'travelMode', 'infoMode', 'profileVersion']) {
      expect(world.simulationRules).not.toHaveProperty(key);
    }
  });

  test('the faith-gate PAIR write turns faith spread on (the dropped-write fix)', async () => {
    const store = makeStore();
    seedStore(store);
    // Pre-CL0 bug (verified at HEAD): a lone { faithSpreadEnabled: true } patch
    // was silently DROPPED — the stored legacy mirror religionDynamicsEnabled:false
    // is authoritative in the normalizer's lockstep, so the gate could never turn
    // faith on. LivingWorldGates + the dialog's faith row now pair-write.
    const rules = await store.getState().updateCampaignSimulationRules('camp-1', {
      faithSpreadEnabled: true,
      religionDynamicsEnabled: true,
    });
    expect(rules.faithSpreadEnabled).toBe(true);
    expect(rules.religionDynamicsEnabled).toBe(true);
    // And back off, same pair discipline.
    const off = await store.getState().updateCampaignSimulationRules('camp-1', {
      faithSpreadEnabled: false,
      religionDynamicsEnabled: false,
    });
    expect(off.faithSpreadEnabled).toBe(false);
    // The receipt trail recorded both effective changes (mirror flips are
    // receipt noise and are folded into the canonical key's entry).
    const log = store.getState().campaigns[0].worldState.rulesetLog;
    expect(Object.keys(log)).toEqual(['rc_0_0', 'rc_0_1']);
    expect(log.rc_0_0.changedKeys).toContain('faithSpreadEnabled');
    expect(log.rc_0_0.changedKeys).not.toContain('religionDynamicsEnabled');
  });

  test('the receipt survives the worldState normalization round-trip', async () => {
    const store = makeStore();
    seedStore(store);
    await store.getState().updateCampaignSimulationRules('camp-1', { migrationFlowsEnabled: false });
    // getCampaignWorldState runs ensureWorldState — the conditional-ledger
    // strip/clone/spread must carry the receipts through, not drop them.
    const world = store.getState().getCampaignWorldState('camp-1');
    expect(Object.keys(world.rulesetLog)).toEqual(['rc_0_0']);
    expect(world.rulesetLog.rc_0_0.changedKeys).toContain('migrationFlowsEnabled');
  });
});
