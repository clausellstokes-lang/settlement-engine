/** @vitest-environment jsdom */
/**
 * economicsProducedLocally.test.jsx — W2-C-LEAVES item 4(c), the "Produced locally" row (2026-11-13; the cold list
 * REVIEW-W2A-3 #45, #159, #192, #345, #382, #555: "timber" beside "No one here works the timber", "trade access" and
 * "luxury" printed as goods, "Religious services" and "Education (basic)" in a thorp that walks to a neighbour's church,
 * "clay", "pottery" and "Milled lumber" in a hamlet with no potter and no sawmill).
 *
 * The row reads `tradeListDisplay.js :: localProductionAsPrinted`: a resource's commodity where a chain works it here
 * (the chain leaf, record 303) or a house makes it; a chain's output where a working chain none of whose houses is a
 * road to elsewhere makes it; never the model's identifiers or a revenue.
 */
/**
 * economicsChainStateUnderCrisis.test.jsx — W2-C-LEAVES item 4(c), the chain cards (2026-11-13; the cold list
 * REVIEW-W2A-3 #165 "Grain & Bread … ✓ Running" under a famine that failed the grain harvest; #273 #276 hunting and an
 * entrepôt "✓ Running" under a siege whose record says field work and trade have stopped; #875 "Port Revenue …
 * ○ Operational" beside docks the Institutions tab marks impaired).
 *
 * The card's state reads `domain/display/chainStateShown.js` (the crisis home, the carrier home, the food record) and,
 * for a service, the Institutions tab's impaired houses (`tabHelpers.js :: computeChainSets`).
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

/** The app's own shape, as the reader REVIEW-W2A-3 born its towns. @param {string} seed */
const birthApp = (seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^rw3-(\w+)-([a-z_+]+)-\d+$/));
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: stresses,
    _randomizePriorities: true }), null, { seed, customContent: {} });
};
/** The pills under "Produced locally", as printed. @param {any} town */
const producedLocally = (town) => {
  const { container, unmount } = render(<EconomicsTab settlement={town} narrativeNote={null} />);
  const head = [...container.querySelectorAll('div')].find((d) => d.textContent === 'Produced locally');
  const pills = head ? [...(head.nextElementSibling?.querySelectorAll('span') || [])].map((s) => s.textContent || '') : [];
  unmount();
  return pills;
};

afterEach(cleanup);

describe('"Produced locally" prints what is made here (item 4(c))', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('a thorp that walks to a neighbour\'s church: no unworked timber, no "luxury", no church services (rw3-thorp-calm-2, #45)', () => {
    const town = birthApp('rw3-thorp-calm-2');
    expect(town.economicState.localProduction, 'anchored: the record lists them').toEqual(expect.arrayContaining(['timber', 'luxury', 'Religious services', 'Education (basic)']));
    const pills = producedLocally(town);
    expect(pills.length).toBeGreaterThan(0);
    expect(['timber', 'luxury', 'Religious services', 'Education (basic)'].filter((p) => pills.includes(p))).toEqual([]);
    expect(pills, 'what the thorp forages stays').toEqual(expect.arrayContaining(['Honey and beeswax', 'Foraged goods']));
  }, 60000);

  test('a hamlet with no potter, no sawmill and no church: no clay, pottery, milled lumber or church services (rw3-hamlet-calm-1, #192)', () => {
    const town = birthApp('rw3-hamlet-calm-1');
    const pills = producedLocally(town);
    expect(['clay', 'pottery', 'Milled lumber', 'Religious services', 'Education (basic)'].filter((p) => pills.includes(p))).toEqual([]);
    expect(pills, 'its smith\'s iron stays').toEqual(expect.arrayContaining(['iron', 'metalwork']));
  }, 60000);

  test('the model\'s identifier and an unworked resource leave; the catch stays (rw3-hamlet-under_siege-1, #345)', () => {
    const town = birthApp('rw3-hamlet-under_siege-1');
    const pills = producedLocally(town);
    expect(['timber', 'trade access'].filter((p) => pills.includes(p))).toEqual([]);
    expect(pills).toEqual(expect.arrayContaining(['fish', 'Salted fish']));
  }, 60000);
});
