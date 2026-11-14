/**
 * sampleForkPriorities.test.js — A FOUNDING WORLD'S FORK IS FORGED AT THE CARD'S OWN
 * FIVE PRIORITIES, AND THE VISITOR'S SLIDER MODE IS LEFT ALONE.
 *
 * THE DEFECT (measured 2026-11-10, FOUNDING-WORLDS rehearsal): each curated card states
 * its five priority dials ("lf-033's resolved priority roll, kept exactly"), yet the store
 * ships `randomSliderMode: true`, and store/settlementGenerateAction.js spread the
 * `_randomizePriorities: true` it derives from that flag AFTER the config's own keys. So
 * every fresh visitor's "Visit" re-rolled the card's priorities, and the promises those
 * dials carry fell with them (20 suffixed forks: Black Crag's guild government 5/20 at
 * the card's dials, 3/20 rolled; Mossgate's church-council tension 16/20 at the dials,
 * 6/20 rolled).
 *
 * THE CURE (the chair's ruling N5b, under the owner's word of 2026-11-10): one condition
 * on the action's existing fail-closed `isSampleFork` (the house's own form; the
 * allowance exemption and the curated tier floor are scoped by the same variable): a
 * sample fork does not add the roll. Nothing writes the visitor's mode.
 *
 * The arms run the REAL action and the REAL pipeline on a real store with the slider
 * mode at its shipped default (`true`), through the fork's own shape (the card's config
 * minus its seed, `_forkedFromSample`, the intent as the argument — both doors,
 * FoundingWorlds and SettlementsPanel.forkSample, pass GENERATION_INTENT_SAMPLE_FORK).
 * CONTROL: without the condition the first arm reds, each card's priorities rolled.
 */
import { describe, test, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { SAMPLE_SETTLEMENTS, forkConfigFor, forkSeedFor } from '../../src/data/sampleSettlements.js';
import { GENERATION_INTENT_SAMPLE_FORK } from '../../src/lib/generationIntent.js';
import { codeOnly } from '../helpers/codeOnlySource.js';

/** @param {Record<string, unknown>} config */
function storeWith(config) {
  const stub = (/** @type {any} */ set) => ({
    auth: { user: null, tier: 'free', loading: false },
    config,
    // The shipped default (store/configSlice.js). The point of every arm below.
    randomSliderMode: DEFAULT_RANDOM_SLIDER_MODE,
    institutionToggles: {},
    categoryToggles: {},
    goodsToggles: {},
    servicesToggles: {},
    customContent: {},
    importedNeighbour: null,
    campaigns: [],
    campaignsLoaded: true,
    setCampaignRegionalGraph: (/** @type {string} */ campaignId, /** @type {any} */ graph) => set((/** @type {any} */ state) => {
      const campaign = state.campaigns.find((/** @type {any} */ c) => c.id === campaignId);
      if (campaign) campaign.regionalGraph = graph;
    }),
    isTierAllowed: () => true,
    canCustomizePreGeneration: () => true,
    canSave: () => true,
    maxSaves: () => 50,
    setPurchaseModalOpen: () => {},
  });
  return create(immer((/** @type {any[]} */ ...a) => ({ ...stub(a[0]), ...createSettlementSlice(...a) })));
}

const DEFAULT_RANDOM_SLIDER_MODE = true;
const PRIORITY_KEYS = ['priorityEconomy', 'priorityMilitary', 'priorityReligion', 'priorityCriminal', 'priorityMagic'];
/** The resolved dials the pipeline used, as the dossier's economy records them. */
const resolvedOf = (/** @type {any} */ s) => {
  const p = s.economicState.priorities;
  return { priorityEconomy: p.economy, priorityMilitary: p.military, priorityReligion: p.religion, priorityCriminal: p.criminal, priorityMagic: p.magic };
};
/** @param {any} sample */
const cardDials = (sample) => Object.fromEntries(PRIORITY_KEYS.map((k) => [k, sample.config[k]]));
/** @param {any} sample */
const forkConfig = (sample) => ({ ...DEFAULT_CONFIG, ...forkConfigFor(sample), _forkedFromSample: sample.id });

describe('a Founding World fork keeps the card\'s five priorities', () => {
  test('every card, forked at the default slider mode, is forged at its own five dials', async () => {
    expect(SAMPLE_SETTLEMENTS.length).toBe(3);
    for (const sample of SAMPLE_SETTLEMENTS) {
      // Anchored: the card states all five dials, so equality below is not vacuous.
      expect(PRIORITY_KEYS.every((k) => typeof sample.config[k] === 'number'), sample.id).toBe(true);
      const store = storeWith(forkConfig(sample));
      const forged = await store.getState().generateSettlement(forkSeedFor(sample, 'visitor1234'), { intent: GENERATION_INTENT_SAMPLE_FORK });
      expect(forged, sample.id).toBeTruthy();
      expect(resolvedOf(forged), sample.id).toEqual(cardDials(sample));
    }
  });

  test('the visitor\'s slider mode is unchanged afterwards, and an ordinary generation still rolls', async () => {
    const sample = SAMPLE_SETTLEMENTS.find((s) => s.id === 'sample-blackcrag');
    const store = storeWith(forkConfig(sample));
    // Anchored: the stub's `true` IS the shipped default, read off the slice's source.
    expect(codeOnly(readFileSync(join(process.cwd(), 'src/store/configSlice.js'), 'utf8'))).toMatch(/randomSliderMode:\s*true,/);
    await store.getState().generateSettlement(forkSeedFor(sample, 'visitor1234'), { intent: GENERATION_INTENT_SAMPLE_FORK });
    expect(store.getState().randomSliderMode).toBe(true);
    // The same config and the same seed WITHOUT the intent is an ordinary forge, and it
    // must still roll: a cure that switched the roll off for everyone would pass the arm
    // above and fail this one.
    const ordinary = await store.getState().generateSettlement(forkSeedFor(sample, 'visitor1234'));
    expect(ordinary).toBeTruthy();
    // anchored: the first arm proves the same fork resolves EXACTLY to cardDials, so a differing roll here is a real roll
    expect(resolvedOf(ordinary)).not.toEqual(cardDials(sample));
  });

  test('both fork doors pass the sample-fork intent (the condition is reached from each)', () => {
    const read = (/** @type {string} */ rel) => codeOnly(readFileSync(join(process.cwd(), rel), 'utf8'));
    const library = read('src/components/SettlementsPanel.jsx');
    expect(library).toMatch(/generateSettlement\(seed,\s*\{\s*intent:\s*GENERATION_INTENT_SAMPLE_FORK\s*\}\)/);
    const create = read('src/components/generate/FoundingWorlds.jsx');
    expect(create).toMatch(/generate\(seed,\s*\{\s*intent:\s*GENERATION_INTENT_SAMPLE_FORK,/);
  });
});
