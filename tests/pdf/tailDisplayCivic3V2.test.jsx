/** @vitest-environment jsdom */
/**
 * TAIL-DISPLAY-CIVIC-3 · V2 (the chair's ruling of 2026-11-15; READ-ALL B29895, the journal's 35544 35551 35555): THE FOOD
 * A FAMINE FAILED IS NOT PRINTED "FULLY EXPLOITED". The Resources tab's exploitation rows (`validationOnPage.js ::
 * exploitationGroupsShown`) printed the famine's failed source in the Full group, and the PDF's chain table and the
 * Foundry journal ("| Fish | full | — | — |") read the same rows: 15 of the census's 44 famine towns at cb4ae58f0. The row
 * reads the record's failed source (`economicState.foodSecurity.foodRecord.failedSource`, `famineFailedResourceOf`) and is
 * shown FAILED on every surface: the tab's card "✗ Failed this year", the PDF's group "Failed this year", the
 * journal's "| Fish | failed |". Kept: the same resource "Fully exploited" in a town with no famine, and a famine town's
 * other full rows. Births of the census's own seeds (CENSUS-3 seedcfg.mjs :: cfgFor); every cured pair red at the base.
 */
import React from 'react';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

vi.mock('../../src/store/index.js', () => {
  const data = { campaigns: [] };
  function useStore(selector) { return selector(data); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => data;
  return { useStore, default: useStore };
});
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));

import { ResourceChainCard } from '../../src/components/new/tabs/ResourcesTab.jsx';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { buildJournalPages } from '../../src/foundry/journalPages.js';
import { exploitationGroupsShown } from '../../src/domain/display/validationOnPage.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** @param {string} seed the census's seed: r2r-<size>-<n> or r2s-<stress>-<size>-<n> */
const cfgFor = (seed) => {
  const s = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  if (s) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [s[1]], selectedStressesRandom: false, settType: s[2] });
  return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: seed.split('-')[1] });
};
/** @param {any} town @returns {string} the tab's cards' text, every group */
const tabText = (town) => Object.entries(exploitationGroupsShown(town)).flatMap(([stage, group]) => group.map((x) => {
  const { container, unmount } = render(<ResourceChainCard chain={x.card} stage={stage} settlement={town} moved={x.moved} />);
  const t = container.textContent || ''; unmount(); return t;
})).join('\n');
/** @param {any} town @returns {{ pdf: string[], journal: string }} the PDF slice's rows (resource|status) and the journal's table */
const exportsOf = (town) => {
  const vm = buildViewModel({ settlement: town });
  const md = buildJournalPages(vm, { settlement: town }).find((p) => p.name === 'Resources & Production')?.markdown || '';
  return { pdf: vm.resources.chainRows.map((/** @type {any} */ c) => `${String(c.resource).toLowerCase()}|${c.status}`), journal: md };
};

// [seed, the failed resource, its journal cell as printed]
const CURED = [
  ['r2r-hamlet-28', 'fish', 'Fish'],
  ['r2s-famine-village-0', 'grain', 'Grain'],
  ['r2s-famine-thorp-1', 'livestock', 'Livestock'],
  ['r2s-famine-metropolis-1', 'fish', 'Fish'],
  ['r2s-famine-city-3', 'grain', 'Grain'],
];
// [seed, a resource that still prints Full, its journal cell]
const KEPT = [
  ['r2s-famine-city-3', 'livestock', 'Livestock'], // a famine town's other full row (its failed source is grain)
  ['r2s-famine-metropolis-3', 'clay', 'Clay'],
];
const BORN = new Map();
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...CURED, ...KEPT].map((r) => r[0]))) BORN.set(seed, generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }));
}, 900000);
afterEach(() => cleanup());

describe('V2: the food a famine failed is shown failed, on the tab and on every export', () => {
  test('each CURED town: its failed food is not "Fully exploited"; it prints "Failed this year" (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(CURED, ([seed, res, cell]) => {
      try {
        const town = BORN.get(seed);
        const g = exploitationGroupsShown(town);
        const placed = Object.entries(g).flatMap(([stage, group]) => group.map((x) => `${stage}|${String(x.card.rawResource)}`));
        expectAbsentWithAnchor(placed, `full|${res}`, `failed|${res}`, `${seed}: the exploitation groups`);
        expect(g.failed.map((x) => String(x.card.rawResource)), `${seed}: ${res} is in the failed group`).toContain(res);
        expect(tabText(town), `${seed}: the tab prints "Failed this year" for ${res}`).toContain(`✗ Failed this year${cell}`);
        const { pdf, journal } = exportsOf(town);
        expectAbsentWithAnchor(pdf, `${res}|full`, `${res}|failed`, `${seed}: the PDF chain rows`);
        expect(pdf, `${seed}: the PDF prints ${res} failed`).toContain(`${res}|failed`);
        expectAbsentWithAnchor(journal, `| ${cell} | full |`, `| ${cell} | failed | — | — |`, `${seed}: the journal table`);
        expect(journal, `${seed}: the journal prints ${cell} failed`).toContain(`| ${cell} | failed | — | — |`);
      } finally { cleanup(); }
    }), 'V2: every CURED town shows its failed food failed, on the tab, the PDF and the journal');
  });
  test('each KEPT town: its resource still prints full (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(KEPT, ([seed, res, cell]) => {
      try {
        const town = BORN.get(seed);
        expect(exploitationGroupsShown(town).full.map((x) => String(x.card.rawResource)), `${seed}: ${res} still prints full`).toContain(res);
        expect(exportsOf(town).journal, `${seed}: the journal prints ${cell} full`).toContain(`| ${cell} | full |`);
      } finally { cleanup(); }
    }), 'V2: every KEPT town still prints its resource full');
  });
});
