/** @vitest-environment jsdom */
/**
 * economicsImportsAreArrivals.test.jsx — W2-C-LEAVES item 4(b) (2026-11-13; REVIEW-W2A-3 R2; the census's row P6need,
 * "an import printed beside its own unmet need", 642 of 720 at the base).
 *
 * The Economics tab composed its Imports line inline from the trade imports AND the terrain's need list, so "Clay"
 * printed as arriving beside "No clay reaches the potter.". The tab now reads the leaf (`tradeListDisplay.js ::
 * importsAsPrinted`): the Imports pills are what trade brings; a need no import meets, under any name, prints apart
 * as "Needed, and not brought in: …".
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

import { EconomicsTab } from '../../src/components/new/tabs/EconomicsTab.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { configOf } from './pageCensusWalk.shared.mjs';
import { importsAsPrinted, plainGoodName } from '../../src/domain/display/tradeListDisplay.js';
import { ResourcesTab } from '../../src/components/new/tabs/ResourcesTab.jsx';
import { resourceDisplayName } from '../../src/domain/display/resourceDisplayName.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

/** The census's shape. @param {string} seed */
const birthCensus = (seed) => {
  const parts = seed.split('-');
  const size = parts.at(-2); const crisis = seed.startsWith('r2s-') ? parts.slice(1, -2).join('-') : null;
  return generateSettlementPipeline(configOf({ size, crisis }, DEFAULT_CONFIG, birthConfig), null, { seed, customContent: {} });
};
/** The census-3 shape (probes/CENSUS-3/seedcfg.mjs: the dials), for the towns of ruling (15). @param {string} seed */
const birthDials = (seed) => {
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
    selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/));
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] }),
    null, { seed, customContent: {} });
};
/** The Imports pills and the needs line, as printed. @param {any} town */
const tradeColumn = (town) => {
  const { container, unmount } = render(<EconomicsTab settlement={town} narrativeNote={null} />);
  const header = [...container.querySelectorAll('div')].find((d) => d.textContent === 'Imports');
  const pills = header ? [...(header.nextElementSibling?.querySelectorAll('span') || [])].map((x) => (x.textContent || '').trim()).filter(Boolean) : [];
  const needs = container.querySelector('[data-testid="economics-needs-not-met"]')?.textContent || '';
  unmount();
  return { found: Boolean(header), pills, needs };
};

afterEach(cleanup);

describe('the Imports line prints what trade brings; a need prints as a need (item 4(b))', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('r2r-city-2 (the review\'s town): clay is a need, not an import', () => {
    const town = birthCensus('r2r-city-2');
    expect(importsAsPrinted(town).needed, 'anchored: clay is a need no trade meets').toContain('clay');
    const { found, pills, needs } = tradeColumn(town);
    expect(found, 'anchored: the Imports column is printed').toBe(true);
    expect(pills.filter((p) => /^clay$/i.test(p))).toEqual([]);
    expect(needs).toMatch(/^Needed, and not brought in: .*\bclay\b.*\.$/);
  }, 60000);

  test('the grid\'s towns: no pill is a need, every need is said, and a need met under another name is not', () => {
    const seeds = ['r2r-city-0', 'r2r-town-17', 'r2r-metropolis-11', 'r2s-under_siege-town-1', 'r2r-village-6', 'r2r-hamlet-31'];
    expectNoSeedFailures(collectSeedFailures(seeds, (seed) => {
      const town = birthCensus(seed);
      const { needed } = importsAsPrinted(town);
      const { pills, needs } = tradeColumn(town);
      const shown = needed.map((n) => plainGoodName(resourceDisplayName(n) || n).toLowerCase()); // W2-C-LEAVES-13 (15): the plain name, by identity
      expect(pills.filter((p) => shown.includes(p.toLowerCase())), `${seed}: a need printed as an import`).toEqual([]);
      expect(shown.filter((n) => !needs.toLowerCase().includes(n)), `${seed}: a need not said`).toEqual([]);
    }), 'the Imports line and the needs disagree');
    // r2r-city-0 brings in luxury textiles: its luxury-goods need is met and is not said
    expect(tradeColumn(birthCensus('r2r-city-0')).needs.includes('luxury goods')).toBe(false);
  }, 240000);
  // W2-C-LEAVES-13, the chair's ruling (15): NO SURFACE PRINTS A CATALOGUE LABEL WITH A SLASH ("Needed, and not brought in:
  // … gold/silver ore", 60 towns of the census's 720 at f82214b96; the Resources card's "Gold/silver ore→gold/silver bars",
  // 13): the plain name ("gold and silver ore") through one leaf (tradeListDisplay.js :: plainGoodName) over the pills' seam.
  test('the needs line and the Resources card print the plain name, never a slash label (15)', () => {
    expect(plainGoodName('Gold/silver ore')).toBe('Gold and silver ore');
    expect(plainGoodName('gold/silver bars')).toBe('gold and silver bars');
    expect(plainGoodName('Copper ore')).toBe('Copper ore');
    // the smallest and the largest towns that print the need, an occupation, a famine and a siege among them
    expectNoSeedFailures(collectSeedFailures(['r2s-infiltrated-town-1', 'r2s-famine-town-0', 'r2s-under_siege-city-0',
      'r2s-occupied-metropolis-0', 'r2s-mass_migration-metropolis-3'], (seed) => {
      const town = birthDials(seed);
      expect(importsAsPrinted(town).needed, `${seed}: anchored, the record's need`).toContain('gold/silver ore');
      const { needs } = tradeColumn(town);
      expect(needs, `${seed}: the plain name`).toMatch(/\bgold and silver ore\b/);
      expect(needs, `${seed}: no slash label`).not.toMatch(/\//);
    }), 'a slash label on the needs line');
    // the Resources card: the smallest and the largest towns that print the precious-metals card (an occupied hamlet among them)
    expectNoSeedFailures(collectSeedFailures(['r2s-wartime-thorp-1', 'r2s-occupied-hamlet-1', 'r2s-succession_void-town-1'], (seed) => {
      const town = /** @type {any} */ (birthDials(seed));
      const { container, unmount } = render(<ResourcesTab settlement={town} narrativeNote={null} />);
      const t = container.textContent || ''; unmount();
      expect(t, `${seed}: anchored, the card's chain`).toMatch(/Gold and silver ore→gold and silver bars→/);
      // (the tab's prose fills, "No one here works the gold/silver ore …", are the next row's: economyStateProse / validationOnPage)
      expect(t, `${seed}: no slash label on the card`).not.toMatch(/Gold\/silver ore→|→gold\/silver bars/i);
    }), 'a slash label on the Resources card');
  }, 240000);
});
