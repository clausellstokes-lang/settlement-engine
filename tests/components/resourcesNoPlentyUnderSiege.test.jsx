/** @vitest-environment jsdom */
/**
 * resourcesNoPlentyUnderSiege.test.jsx — W2-C-LEAVES-SIDE item 5 (2026-11-13; ROUND-3-CUT #937, MED): the Resources tab's
 * Nearby Resources listed "Abundant: Foraging Areas, Grain Fields, Hunting Grounds, Stone Quarry" under a siege and a
 * famine (rr2s-city-under_siege+famine-rand-1) while the Defense tab's food line says "The siege has taken the outlying
 * fields". The chair's ruling: under a siege in force a ground outside the walls is not printed with a word of plenty
 * unless the same row carries the siege's word in words the tab already has; otherwise the word of plenty is left out.
 * The grounds print first, unlabelled, under the section's own title (never under "Depleted").
 */
import React from 'react';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

vi.mock('../../src/store/index.js', () => {
  const data = { campaigns: [] };
  function useStore(selector) { return selector(data); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => data;
  return { useStore, default: useStore };
});
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));

import { ResourcesTab } from '../../src/components/new/tabs/ResourcesTab.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

/** The reader's own shape (REVIEW-R2-STAGES render.rr2s.jsx :: cfgFor). @param {string} seed */
const birthApp = (seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^rr2s-(\w+)-([a-z_+]+)-([a-z_]+)-\d+$/));
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false,
    selectedStresses: stresses, _randomizePriorities: true }), null, { seed, customContent: {} });
};
/** @param {any} s */
const textOf = (s) => { const { container } = render(<ResourcesTab settlement={s} />); return container.textContent || ''; };

afterEach(cleanup);

describe('no word of plenty for the grounds under a siege (#937)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('the reader\'s town: the grounds print, "Abundant" does not; a town at peace keeps the word', () => {
    const besieged = birthApp('rr2s-city-under_siege+famine-rand-1');
    const all = besieged.config.nearbyResources; const dep = besieged.config.nearbyResourcesDepleted || [];
    expect(all.filter((/** @type {string} */ k) => !dep.includes(k)).length, 'anchored: grounds not depleted').toBeGreaterThan(0);
    const t = textOf(besieged);
    expectAbsentWithAnchor(t, 'Abundant', 'Grain Fields', 'the besieged grounds print without the word of plenty');
    const calm = birthApp('rr2s-town-calm-rand-1');
    expect(textOf(calm)).toMatch(/Abundant/);
  }, 60000);
});
