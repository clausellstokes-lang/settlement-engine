/** @vitest-environment jsdom */
/**
 * resourcesCatalogueLabel.test.jsx — TAIL-DISPLAY-ECON-4 (the chair's ruling X26, 2026-11-15; vetoable by the owner):
 * A RESOURCE'S NAME HAS ONE HOME. The Resources tab's Nearby Resources chips (the grounds, abundant or depleted, and the
 * resource rows among the commodities available) print the catalogue's own label (`RESOURCE_DATA[k].label`, through the
 * seam's verbatim table `resourceDisplayName.js :: RESOURCE_DISPLAY_LABELS`), not the key run through a formatter: no
 * "Defended Pass" (READ-ALL B28788, B28789: a chip that read as a defence in towns with none) where the catalogue says
 * "Mountain Pass". Births of the census's own seeds. Each NOT pair and each chip check is red at the base (bb5ebff5c);
 * each KEEP is green before and after.
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
import { RESOURCE_DISPLAY_LABELS } from '../../src/domain/display/resourceDisplayName.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's own birth (CENSUS-3 seedcfg.mjs, its r2r-/r2s- arms). @param {string} seed */
const birth = (seed) => {
  const calm = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`));
  const crisis = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-(\\d+)$`));
  const cfg = calm ? { ...DEFAULT_CONFIG, ...DIALS, settType: calm[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [/** @type {RegExpMatchArray} */ (crisis)[1]], selectedStressesRandom: false, settType: /** @type {RegExpMatchArray} */ (crisis)[2] };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
};
/** @type {Map<string, any>} */ const towns = new Map();
const town = (/** @type {string} */ seed) => { if (!towns.has(seed)) towns.set(seed, birth(seed)); return towns.get(seed); };
const fmtKey = (/** @type {string} */ rk) => rk.replace(/_/g, ' ').replace(/\b./g, (c) => c.toUpperCase());
/** The chip words of the Nearby Resources section. @param {any} t @returns {string[]} */
const chipsOf = (t) => {
  const { container, unmount } = render(<ResourcesTab settlement={t} />);
  const head = [...container.querySelectorAll('button, div, span')].find((n) => n.textContent === 'Nearby Resources');
  let sec = head; while (sec && !(sec.textContent || '').includes('Commodities available') && !(sec.textContent || '').includes('Abundant')) sec = sec.parentElement;
  const words = sec ? [...sec.querySelectorAll('span')].filter((n) => n.children.length <= 1).map((n) => (n.firstChild?.textContent || '').trim()).filter(Boolean) : [];
  unmount();
  return words;
};

/** [seed, the formatter's word that must NOT print as a chip, the catalogue's label that prints instead] */
const NOT = /** @type {const} */ ([
  ['r2r-city-20', 'Defended Pass', 'Mountain Pass'],
  ['r2r-thorp-1', 'Iron Deposits', 'Iron Ore Deposits'],
  ['r2s-under_siege-thorp-0', 'Crossroads Position', 'Strategic Crossroads'],
  ['r2r-thorp-0', 'Hot Springs', 'Hot Springs / Healing Waters'],
]);
/** [seed, a chip whose catalogue label is the formatter's own word: it still prints] (green before and after) */
const KEEP = /** @type {const} */ ([
  ['r2r-thorp-0', 'Hunting Grounds'],
  ['r2r-city-20', 'Gemstone Deposits'],
  ['r2r-city-20', 'Mountain Timber'],
  ['r2s-famine-thorp-1', 'Ancient Grove'],
]);
const SEEDS = ['r2r-city-20', 'r2r-thorp-1', 'r2s-under_siege-thorp-0', 'r2r-thorp-0', 'r2s-famine-thorp-1'];

afterEach(cleanup);

describe('X26: the Nearby Resources chips print the catalogue\'s own label', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('each NOT row prints no chip of the formatter\'s word; instead: the catalogue\'s label (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(NOT, ([seed, old, label]) => {
      try {
        const chips = chipsOf(town(seed));
        expectAbsentWithAnchor(chips, old, label, `${seed}: the catalogue's label, not the formatter's word`);
      } finally { cleanup(); }
    }), 'every NOT row: the chip prints the catalogue\'s label, not the formatter\'s word');
  }, 120000);

  test('each KEEP row still prints its chip (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP, ([seed, label]) => {
      try {
        expect(chipsOf(town(seed)), `${seed} still prints the chip "${label}"`).toContain(label);
      } finally { cleanup(); }
    }), 'every KEEP row: the chip whose label is the formatter\'s own word still prints');
  }, 120000);

  test('each seed: every catalogue ground prints its label (and a label the formatter already gave is kept) (every seed)', () => {
    expectNoSeedFailures(collectSeedFailures(SEEDS, (seed) => {
      try {
        const t = town(seed);
        const custom = new Set(t.config?.nearbyResourcesCustom || []);
        const keys = (t.config?.nearbyResources || []).filter((/** @type {string} */ k) => !custom.has(k) && Object.hasOwn(RESOURCE_DISPLAY_LABELS, k));
        expect(keys.length, `${seed}: the town has a catalogue ground`).toBeGreaterThan(0);
        const chips = chipsOf(t);
        for (const k of keys) {
          if (fmtKey(k) !== RESOURCE_DISPLAY_LABELS[k]) expectAbsentWithAnchor(chips, fmtKey(k), RESOURCE_DISPLAY_LABELS[k], `${seed}: ${k}`);
          else expect(chips, `${seed}: ${k}`).toContain(RESOURCE_DISPLAY_LABELS[k]);
        }
      } finally { cleanup(); }
    }), 'every seed: every catalogue ground prints its label');
  }, 120000);
});
