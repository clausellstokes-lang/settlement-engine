/** @vitest-environment jsdom */
/**
 * bar2MagicWords.test.jsx — BAR2-LABELS batch 2 (REVIEW-BAR-2's DISPLAY-CIVIC, DISPLAY-ECON and DEFECON rows of the magic
 * words; the chair's ruling LB1 of 2026-11-15, vetoable by the owner). ONE HOME FOR THE MAGIC FACTS
 * (`domain/display/magicProvisionShown.js`): every magic word the page prints reads what the record shows magic DOES here.
 *   · C0031 C15424 C15425 C20948: the Overview's "Reliance on magic" is never above what the page shows magic doing
 *     (`relianceReadingShown`: a chain note the card does not print is not a dependent);
 *   · C11391 C17170 C22429: the Magic tab's headline word is the record's own level (`magicHeadlineWord`), the
 *     availability printing in the envelope below it;
 *   · C17182 C25208: a role row prints "absent" only where the record holds nothing of that role (`magicRoleHeld`);
 *   · C1229: "No arcane practitioners on the rolls" is not printed where a magical service is made here
 *     (`defenseDisplay.js :: ARCANE_NONE_WITH_SERVICE`).
 * Births of the census's own seeds (CENSUS-3 seedcfg.mjs, the r2r- arm). Each NOT pair is red at the batch's base
 * (f8042b61a); each KEEP pair is green before and after.
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

import MagicTab from '../../src/components/new/tabs/MagicTab.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { deriveMagicRelianceView } from '../../src/domain/display/dossierViewModel.js';
import { ARCANE_NONE, ARCANE_NONE_WITH_SERVICE, deriveSupportingCapabilities } from '../../src/domain/display/defenseDisplay.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** @type {Map<string, any>} */ const towns = new Map();
const town = (/** @type {string} */ seed) => {
  if (!towns.has(seed)) {
    const size = /** @type {RegExpMatchArray} */ (seed.match(/^r2r-(\w+)-\d+$/))[1];
    towns.set(seed, generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: size }), null, { seed, customContent: {} }));
  }
  return towns.get(seed);
};
/** @param {any} t @returns {string[]} the Magic tab's lines: its headline word and its role rows */
const magicTab = (t) => {
  const { container, unmount } = render(<MagicTab settlement={t} />);
  const head = container.querySelector('[data-testid="magic-tab"] > p')?.textContent || '';
  const roles = [...container.querySelectorAll('[data-role-line]')].map((n) => n.textContent || '');
  unmount();
  return [head, ...roles];
};
const arcaneNote = (/** @type {any} */ t) => (deriveSupportingCapabilities(t).find((c) => c.label === 'Arcane Support') || {}).note || '';

// [seed, what must not print, what prints instead]
const RELIANCE = [
  ['r2r-village-11', 'Relied upon', 'None'], // its one dependent a divine note on a town holding no divine tradition
  ['r2r-village-20', 'Relied upon', 'None'],
  ['r2r-town-45', 'Integral', 'Relied upon'], // one printed dependent
  ['r2r-city-21', 'Integral', 'Relied upon'],
];
const RELIANCE_KEEP = [['r2r-village-13', 'Relied upon'], ['r2r-village-12', 'Relied upon']];
// [seed, the role row that must not print, a sibling role row that still prints there (the liveness anchor)]
const ROLES = [
  ['r2r-village-13', 'Economic role: absent', 'Infrastructure role: absent'], ['r2r-village-13', 'Medical role: absent', 'Infrastructure role: absent'],
  ['r2r-hamlet-27', 'Military role: absent', 'Infrastructure role: common'], ['r2r-town-5', 'Military role: absent', 'Infrastructure role: common'],
];
const ROLES_KEEP = [['r2r-village-3', 'Military role: absent'], ['r2r-village-16', 'Military role: absent']];
// [seed, the headline that must not print, the level it prints]
const HEADLINE = [['r2r-city-14', 'Moderate', 'Low'], ['r2r-city-0', 'Moderate', 'Low'], ['r2r-thorp-8', 'Limited', 'Medium']];
const ARCANE = ['r2r-village-12', 'r2r-village-14', 'r2r-village-23'];
const ARCANE_KEEP = ['r2r-village-0', 'r2r-village-1'];

describe('BAR2-LABELS batch 2: every magic word reads what the record shows magic doing (LB1)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  afterEach(() => cleanup());

  test('NOT: the reliance word above what the page shows; KEEP: a printed dependent keeps it', () => {
    const failures = collectSeedFailures(RELIANCE.map((r) => r[0]), (seed) => {
      const [, not, instead] = /** @type {string[]} */ (RELIANCE.find((r) => r[0] === seed));
      const { word } = deriveMagicRelianceView(town(seed));
      expect(word, `${seed}: prints "${instead}", not "${not}"`).toBe(instead);
    });
    expectNoSeedFailures(failures, 'the reliance word reads the page');
    for (const [seed, word] of RELIANCE_KEEP) expect(deriveMagicRelianceView(town(seed)).word, `${seed} keeps its word`).toBe(word);
  }, 240_000);

  test('NOT: a role "absent" where the record holds the role (the row is left out); KEEP: absent where it holds none', () => {
    const failures = collectSeedFailures([...new Set(ROLES.map((r) => r[0]))], (seed) => {
      const lines = magicTab(town(seed));
      for (const [, row, anchor] of ROLES.filter((r) => r[0] === seed)) expectAbsentWithAnchor(lines, row, anchor, `${seed}: "${row}" left out (silent by design)`);
    });
    expectNoSeedFailures(failures, 'the role rows read the record');
    for (const [seed, row] of ROLES_KEEP) expect(magicTab(town(seed)), `${seed} keeps "${row}"`).toContain(row);
  }, 240_000);

  test('NOT: the envelope\'s availability as the headline; the record\'s own level prints', () => {
    for (const [seed, not, level] of HEADLINE) {
      const [head] = magicTab(town(seed));
      expect(head, `${seed}: prints "${level}", not "${not}"`).toBe(level);
    }
  }, 240_000);

  test('NOT: "No arcane practitioners on the rolls" beside a made magical service (its twin prints); KEEP: no service, the line', () => {
    for (const seed of ARCANE) expect(arcaneNote(town(seed)), `${seed}: the twin prints`).toBe(ARCANE_NONE_WITH_SERVICE);
    for (const seed of ARCANE_KEEP) expect(arcaneNote(town(seed)), `${seed} keeps the line`).toBe(ARCANE_NONE);
  }, 240_000);
});
