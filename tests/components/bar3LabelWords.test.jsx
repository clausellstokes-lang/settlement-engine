/** @vitest-environment jsdom */
/**
 * bar3LabelWords.test.jsx — BAR3-LABELS batch 1 (REVIEW-BAR-3's and the wide read's DISPLAY-CIVIC and DISPLAY-ECON rows of
 * the magic words and the Foundations labels; the chair's directions L1 and L2 of 2026-11-15, vetoable by the owner).
 *   · L1 C36557 C37313 C13260 C27624: a magic role row prints "absent" where the record holds nothing of that role
 *     (`magicProvisionShown.js :: magicRoleBandShown`, reading LB1's one home `magicRoleHeld`), never the dial's
 *     "occasional" or a healing house's "common";
 *   · L1 C18609 C36799 C4414: "Integral" needs two SEPARATE things held up by magic below the top band; a town's own magic
 *     trade (spellcasting, enchanting, alchemy) counts once (`relianceDepth`);
 *   · L1 C12975 C53812: "Healing capacity" is not printed above "strained" where the defence's Medical Readiness is None;
 *   · L2 C15810 C21298: "Law & order" and "Criminal opportunity" are not printed above "strained" under a crime wave;
 *   · L2 C39624: "Labor capacity" is not printed above "strained" where the crisis says conscription took the hands
 *     (`domain/display/foundationBandShown.js`).
 * Births of the census's own seeds (CENSUS-3 seedcfg.mjs, the r2r- and r2s- arms). Each NOT pair is red at the batch's
 * base (59185b62a); each KEEP pair is green before and after.
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
import SubstrateTab from '../../src/components/new/tabs/SubstrateTab.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { deriveMagicRelianceView } from '../../src/domain/display/dossierViewModel.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** @param {string} seed */
const cfgFor = (seed) => {
  let m = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`));
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] });
  m = /** @type {RegExpMatchArray} */ (seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-(\\d+)$`)));
  return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
};
/** @type {Map<string, any>} */ const towns = new Map();
const town = (/** @type {string} */ seed) => {
  if (!towns.has(seed)) towns.set(seed, generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }));
  return towns.get(seed);
};
/** @param {any} t @returns {string[]} the Magic tab's role rows */
const roleRows = (t) => {
  const { container, unmount } = render(<MagicTab settlement={t} />);
  const rows = [...container.querySelectorAll('[data-role-line]')].map((n) => n.textContent || '');
  unmount();
  return rows;
};
/** @param {any} t @returns {string[]} the Foundations rows, label and word run together as the page prints them */
const foundations = (t) => {
  const { container, unmount } = render(<SubstrateTab settlement={t} />);
  const rows = [...container.querySelectorAll('[data-substrate-row]')].map((n) => n.textContent || '');
  unmount();
  return rows;
};

// [seed, the row that must not print, the row that prints instead]
const ROLES = [
  ['r2r-thorp-0', 'Military role: occasional', 'Military role: absent'],
  ['r2r-metropolis-40', 'Military role: occasional', 'Military role: absent'],
  ['r2s-under_siege-thorp-1', 'Military role: occasional', 'Military role: absent'],
  ['r2r-thorp-4', 'Medical role: common', 'Medical role: absent'],
  ['r2r-metropolis-1', 'Medical role: common', 'Medical role: absent'],
  ['r2r-city-1', 'Medical role: integral', 'Medical role: absent'],
];
// [seed, the row that still prints] (the record holds the role)
const ROLES_KEEP = [['r2r-town-10', 'Military role: occasional'], ['r2r-village-8', 'Medical role: common']];
// [seed, what must not print, what prints instead]
const RELIANCE = [
  ['r2r-city-11', 'Integral', 'Relied upon'],
  ['r2r-metropolis-3', 'Integral', 'Relied upon'],
  ['r2s-wartime-city-2', 'Integral', 'Relied upon'],
];
const RELIANCE_KEEP = [['r2r-town-56', 'Integral'], ['r2r-city-5', 'Integral']]; // the trade and the food; a marsh note and the food
const FOUNDATIONS = [
  ['r2r-thorp-4', 'Healing capacityAdequate', 'Healing capacityStrained'],
  ['r2r-hamlet-1', 'Healing capacityAdequate', 'Healing capacityStrained'],
  ['r2s-under_siege-hamlet-0', 'Healing capacityAdequate', 'Healing capacityStrained'],
  ['r2r-city-1', 'Law & orderSurplus', 'Law & orderStrained'],
  ['r2r-town-15', 'Law & orderAdequate', 'Law & orderStrained'],
  // RE-ANCHORED AT POINT 116 (the trouble law lit, 2026-11-25; LAND-116, the chair's ruling B): r2s-occupied-city-1 lit holds no crime wave and
  // no r2s-occupied city does; the first r2s city of the census's order with a crime wave whose row bands Adequate without
  // it (the crime wave set aside in scratch) is r2s-indebted-city-2.
  ['r2s-indebted-city-2', 'Law & orderAdequate', 'Law & orderStrained'],
  ['r2r-thorp-1', 'Criminal opportunityContained', 'Criminal opportunityElevated'],
  // RE-ANCHORED AT POINT 116 (the trouble law lit, 2026-11-25; LAND-116, the chair's ruling B): r2r-metropolis-1 lit holds no crime wave and no
  // r2r metropolis of the census bands Contained without its crime wave; the first metropolis of the census's order that
  // does is r2s-politically_fractured-metropolis-0 (A JUDGEMENT: the other arm, the same size).
  ['r2s-politically_fractured-metropolis-0', 'Criminal opportunityContained', 'Criminal opportunityElevated'],
  ['r2s-wartime-city-0', 'Labor capacityAdequate', 'Labor capacityStrained'],
  ['r2s-wartime-metropolis-1', 'Labor capacityAdequate', 'Labor capacityStrained'],
];
const FOUNDATIONS_KEEP = [
  ['r2r-village-0', 'Healing capacityAdequate'], // a healer or clergy kept
  ['r2r-town-10', 'Law & orderSurplus'], // no crime wave
];

describe('BAR3-LABELS batch 1: the magic words and the Foundations labels say what the record holds (L1, L2)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  afterEach(() => cleanup());

  test('NOT: a magic role row above what the record holds of the role ("absent" prints); KEEP: a held role keeps its band', () => {
    const failures = collectSeedFailures([...new Set(ROLES.map((r) => r[0]))], (seed) => {
      const rows = roleRows(town(seed));
      for (const [, not, instead] of ROLES.filter((r) => r[0] === seed)) {
        expectAbsentWithAnchor(rows, not, instead, `${seed}: "${instead}" prints, not "${not}"`);
      }
    });
    expectNoSeedFailures(failures, 'the role rows read the record');
    for (const [seed, row] of ROLES_KEEP) expect(roleRows(town(seed)), `${seed} keeps "${row}"`).toContain(row);
  }, 300_000);

  test('NOT: "Integral" where the one dependent is the town\'s own magic trade; KEEP: two separate dependents', () => {
    const failures = collectSeedFailures(RELIANCE.map((r) => r[0]), (seed) => {
      const [, not, instead] = /** @type {string[]} */ (RELIANCE.find((r) => r[0] === seed));
      expect(deriveMagicRelianceView(town(seed)).word, `${seed}: prints "${instead}", not "${not}"`).toBe(instead);
    });
    expectNoSeedFailures(failures, 'the reliance word reads the depth');
    for (const [seed, word] of RELIANCE_KEEP) expect(deriveMagicRelianceView(town(seed)).word, `${seed} keeps its word`).toBe(word);
  }, 300_000);

  test('NOT: a Foundations row above what the page says of it (the capped word prints); KEEP: no such state, the word', () => {
    const failures = collectSeedFailures([...new Set(FOUNDATIONS.map((r) => r[0]))], (seed) => {
      const rows = foundations(town(seed));
      for (const [, not, instead] of FOUNDATIONS.filter((r) => r[0] === seed)) {
        expectAbsentWithAnchor(rows, not, instead, `${seed}: "${instead}" prints, not "${not}"`);
      }
    });
    expectNoSeedFailures(failures, 'the Foundations rows read the page');
    for (const [seed, row] of FOUNDATIONS_KEEP) expect(foundations(town(seed)), `${seed} keeps "${row}"`).toContain(row);
  }, 300_000);
});
