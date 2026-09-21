/**
 * generateStrayConfigSeed.test.js - a `seed` left in the stored config must never
 * break generation (reported on production 2026-09-16).
 *
 * THE DEFECT, reproduced on settlementforge.com before this cure: "Fork this sample"
 * stamped `seed` into the config (FoundingWorlds + SettlementsPanel.forkSample,
 * since 2026-07-21); the pipeline has refused a config carrying `seed` since Lane
 * PT2-1 (2026-08-03, "the config bag has no `seed`"), so the fork failed, and the
 * config is persisted, so every later "Forge" in that browser showed "Generation
 * failed / The forge stalled before your settlement took shape".
 *
 * The cure lives at the one path that hands the config to the pipeline
 * (store/settlementGenerateAction.js drops a config-level `seed`), so these arms run
 * the REAL action and the REAL pipeline on a real store: the gap that let this ship
 * is that no test ever ran a fork's config through generation. Each arm names the
 * control that reds without the cure.
 */
import { describe, test, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import {
  SAMPLE_SETTLEMENTS,
  forkConfigFor,
  forkSeedFor,
} from '../../src/data/sampleSettlements.js';
import { codeOnly } from '../helpers/codeOnlySource.js';

const stubSlice = (config) => (set) => ({
  auth: { user: null, tier: 'free', loading: false },
  config,
  institutionToggles: {},
  categoryToggles: {},
  goodsToggles: {},
  servicesToggles: {},
  customContent: {},
  importedNeighbour: null,
  campaigns: [],
  campaignsLoaded: true,
  setCampaignRegionalGraph: (campaignId, graph) => set((state) => {
    const campaign = state.campaigns.find((c) => c.id === campaignId);
    if (campaign) campaign.regionalGraph = graph;
  }),
  isTierAllowed: () => true,
  // ⛔ THE STUB IS A FREE ACCOUNT, SO IT MUST BE ABLE TO ANSWER THE CAPABILITY QUESTION
  // (§934.34). The generation lane's read of `canCustomizePreGeneration` FAILS CLOSED
  // (review wave 2 car 8): a store that cannot be asked is treated as unable, and the
  // lane then forges from DEFAULT_CONFIG — which would quietly replace this stub's own
  // `config` and make every arm below measure the defaults instead of the fixture.
  canCustomizePreGeneration: () => true,
  canSave: () => true,
  maxSaves: () => 50,
  setPurchaseModalOpen: () => {},
});

function storeWith(config) {
  const stub = stubSlice(config);
  return create(immer((...a) => ({ ...stub(...a), ...createSettlementSlice(...a) })));
}

const TOWN = { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' };

describe('a stray config `seed` never breaks generation', () => {
  test('a stored config carrying `seed` (a browser that once forked a sample) still generates', async () => {
    // CONTROL: without the drop in settlementGenerateAction this rejects with
    // "[generateSettlementPipeline] the first argument is the generation config, and it carries a `seed` key".
    const store = storeWith({ ...TOWN, seed: 'mossgate-004-anon', _forkedFromSample: 'sample-mossgate' });
    const settlement = await store.getState().generateSettlement('fresh-roll-1');
    expect(settlement).toBeTruthy();
    expect(store.getState().settlement).toBe(settlement);
    expect(store.getState().lastSeed).toBe('fresh-roll-1');
  });

  test('Forge with NO seed argument over a poisoned config rolls fresh worlds, never the stray seed', async () => {
    // The Forge button calls generateSettlement() with no argument. A cure that fell back
    // to the stray config seed would pass every seeded arm here and still turn every roll
    // in a forked browser into the same Mossgate.
    const store = storeWith({ ...TOWN, seed: 'mossgate-004-anon' });
    const first = await store.getState().generateSettlement();
    expect(first).toBeTruthy();
    const firstSeed = store.getState().lastSeed;
    expect(firstSeed).toBeTruthy();
    expect(firstSeed).not.toBe('mossgate-004-anon');
    expect(Object.hasOwn(first._config || {}, 'seed')).toBe(false);
    await store.getState().generateSettlement();
    expect(store.getState().lastSeed).not.toBe(firstSeed);
  });

  test('neither fork surface puts `seed` into its config patch', () => {
    // A store-level drop would hide a writer that re-stamps the key (generation would
    // still pass while the key returned to persisted state and to saved rows), so the
    // two writers are pinned at the source: both load forkConfigFor(sample), and no
    // `seed` property appears in the patch they build.
    const read = (rel) => codeOnly(readFileSync(join(process.cwd(), rel), 'utf8'));
    const library = read('src/components/SettlementsPanel.jsx');
    const libraryPatch = library.slice(library.indexOf('const forkedConfig = {'));
    const libraryBlock = libraryPatch.slice(0, libraryPatch.indexOf('};') + 2);
    expect(libraryBlock).toContain('forkConfigFor(sample)');
    // anchored: the line above proves this block is the live fork patch (it loads forkConfigFor), so no seed here is a real absence
    expect(libraryBlock).not.toMatch(/\bseed\s*[,:}]/);

    const landing = read('src/components/generate/FoundingWorlds.jsx');
    const call = landing.slice(landing.indexOf('updateConfig({'));
    const landingPatch = call.slice(0, call.indexOf(');') + 2);
    expect(landingPatch).toContain('forkConfigFor(sample)');
    // anchored: the line above proves this is the live updateConfig patch (it loads forkConfigFor), so no seed here is a real absence
    expect(landingPatch).not.toMatch(/\bseed\s*[,:}]/);
  });

  test('the stray key is INERT: the world is decided by the argument seed alone', async () => {
    // The same argument seed over a clean config and a poisoned one must be the same
    // world: this catches a cure that let the config seed WIN over the argument.
    const clean = await storeWith({ ...TOWN }).getState().generateSettlement('inert-check');
    const poisoned = await storeWith({ ...TOWN, seed: 'mossgate-004-anon' }).getState().generateSettlement('inert-check');
    expect(poisoned.name).toBe(clean.name);
    expect(poisoned.population).toBe(clean.population);
    expect(JSON.stringify(poisoned.npcs.map((n) => n.name))).toBe(JSON.stringify(clean.npcs.map((n) => n.name)));
  });

  test('the stored config itself is left alone (the drop is a read-path copy, not a storage write)', async () => {
    const store = storeWith({ ...TOWN, seed: 'mossgate-004-anon' });
    await store.getState().generateSettlement('read-path-only');
    expect(store.getState().config.seed).toBe('mossgate-004-anon');
  });

  test('every Founding World forks through the real action into a settlement', async () => {
    // One named test that loops over the live sample table (a loop-generated title would
    // park this file in the lighting census), failing by the offending sample's id.
    expect(SAMPLE_SETTLEMENTS.length).toBeGreaterThan(0);
    for (const sample of SAMPLE_SETTLEMENTS) {
      // The fork's own shape: the sample config minus its seed, the seed as the argument.
      const config = { ...forkConfigFor(sample), _forkedFromSample: sample.id };
      expect(Object.hasOwn(config, 'seed'), sample.id).toBe(false);
      const settlement = await storeWith(config).getState().generateSettlement(forkSeedFor(sample, 'user1234'));
      expect(settlement, sample.id).toBeTruthy();
      expect(settlement.tier, sample.id).toBeTruthy();
    }
  });
});
