/** @vitest-environment jsdom */
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
import { cleanup, fireEvent, render } from '@testing-library/react';

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
/**
 * The header row of each card whose title is `label`, as text (title, need, state), the Economic Flows section opened.
 * @param {any} town @param {string} label
 */
const cardHeaders = (town, label) => {
  const { container, unmount } = render(<EconomicsTab settlement={town} narrativeNote={null} />);
  for (const e of [...container.querySelectorAll('[aria-expanded="false"]')]) if (/Economic Flows/.test(e.textContent || '')) fireEvent.click(e);
  const rows = [...container.querySelectorAll('span')].filter((s) => s.textContent === label).map((s) => s.parentElement?.textContent || '');
  unmount();
  return rows;
};
/** @param {any} town @param {string} chainId */
const chainOf = (town, chainId) => town.economicState.activeChains.find((/** @type {any} */ c) => c.chainId === chainId);

afterEach(cleanup);

describe('a chain card under a crisis in force prints the state the crisis left it in (item 4(c))', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('a famine that failed the grain: the grain card reads Impaired, not Running (rw3-thorp-famine-1, #165)', () => {
    const town = birthApp('rw3-thorp-famine-1');
    expect(town.economicState.foodSecurity.foodRecord.failedSource, 'anchored: the famine failed the grain').toBe('grain');
    expect(chainOf(town, 'grain')?.status, 'anchored: the record keeps the calm state').toBe('running');
    const rows = cardHeaders(town, 'Grain & Bread');
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.map((r) => [r.includes('✓ Running'), r.includes('Impaired')])).toEqual(rows.map(() => [false, true]));
  }, 60000);

  test('a siege: hunting on the ground outside and an entrepôt read Impaired; a house of worship keeps its state (rw3-metropolis-under_siege-1, #273 #276)', () => {
    const town = birthApp('rw3-metropolis-under_siege-1');
    expect(chainOf(town, 'hunting')?.status, 'anchored: the hunt is recorded running').toBe('running');
    expect(chainOf(town, 'furs_north')?.status, 'anchored: the fur entrepôt is recorded running').toBe('running');
    for (const label of [chainOf(town, 'hunting').label, chainOf(town, 'furs_north').label]) {
      const rows = cardHeaders(town, label);
      expect(rows.length, label).toBeGreaterThan(0);
      expect(rows.some((r) => r.includes('✓ Running')), `${label} reads running under the siege`).toBe(false);
      expect(rows.every((r) => r.includes('Impaired')), label).toBe(true);
    }
    const lawRows = cardHeaders(town, chainOf(town, 'law_governance').label);
    expect(lawRows.some((r) => r.includes('○ Operational')), 'a court keeps its state under a siege').toBe(true);
  }, 60000);

  test('a service whose every house the Institutions tab marks impaired reads Impaired (rw3-town-under_siege+famine-1, #875)', () => {
    const town = birthApp('rw3-town-under_siege+famine-1');
    const port = town.economicState.institutionalServices.find((/** @type {any} */ s) => s.label === 'Port Revenue');
    expect(port?.institutions, 'anchored: the port revenue runs through the docks').toEqual(['docks/port facilities']);
    const rows = cardHeaders(town, 'Port Revenue');
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.map((r) => [r.includes('○ Operational'), r.includes('Impaired')])).toEqual(rows.map(() => [false, true]));
  }, 60000);

  test('a calm town keeps its running cards (rw3-hamlet-calm-1)', () => {
    const town = birthApp('rw3-hamlet-calm-1');
    const rows = cardHeaders(town, chainOf(town, 'iron').label);
    expect(rows.some((r) => r.includes('✓ Running'))).toBe(true);
  }, 60000);
});
