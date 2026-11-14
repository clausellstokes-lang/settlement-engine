/** @vitest-environment jsdom */
/**
 * economicsChainOutputsBorneOut.test.jsx — W2-C-LEAVES-6 item 7 (the round-three cut's #555: "Civil disputes · Criminal
 * trials · Notary services" under Outputs on a Law & Governance card in a town with a Town hall and no courthouse).
 * RULED: a chain card's Outputs pills follow the goods pills' rule (iii), the same reading
 * (domain/display/tradeListDisplay.js :: chainOutputsShown): an output prints only where the house that makes or offers
 * it stands on the live roster; an "Access to ..." row is no house here; a key that is not a good never prints.
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
import { liveInstitutionNames } from '../../src/domain/facts/institutions.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

/** The app's own shape (the readers' cfgFor). @param {string} seed */
const birthApp = (seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^(?:rww|rr2s|fr4)-(\w+)-([a-z_+]+)(?:-(rand|port|river|road|isolated|crossroads))?-\d+$/));
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  const route = m[3] && m[3] !== 'rand' ? { tradeRouteAccess: m[3] } : {};
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: stresses,
    _randomizePriorities: true }), null, { seed, customContent: {} });
};
/** @param {any} town @returns {string} the tab's text, the Economic Flows section opened */
const tabText = (town) => {
  const { container, unmount } = render(<EconomicsTab settlement={town} narrativeNote={null} />);
  for (const e of [...container.querySelectorAll('[aria-expanded="false"]')]) if (/Economic Flows/.test(e.textContent || '')) fireEvent.click(e);
  const t = container.textContent || '';
  unmount();
  return t;
};
/** @param {any} town @param {string} chainId */
const chainOf = (town, chainId) => (town.economicState.activeChains || []).find((/** @type {any} */ c) => c.chainId === chainId);
const COURT_OUTPUTS = ['Civil disputes', 'Criminal trials', 'Notary services'];

afterEach(cleanup);

describe('a chain card prints only the outputs its houses bear out (item 7)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('no court\'s work where no courthouse stands (#555, rr2s-town-plague_onset-rand-1); the guard town with a courthouse keeps it (rww-town-occupied-1)', () => {
    const town = birthApp('rr2s-town-plague_onset-rand-1');
    expect(chainOf(town, 'law_governance')?.outputs, 'anchored: the record\'s outputs').toEqual(expect.arrayContaining(COURT_OUTPUTS));
    expect(liveInstitutionNames(town).some((n) => /courthouse|court building/i.test(n)), 'anchored: no courthouse').toBe(false);
    const t = tabText(town);
    for (const o of COURT_OUTPUTS) expectAbsentWithAnchor(t, o, 'Outputs', 'a court\'s work without a courthouse');
    const guard = birthApp('rww-town-occupied-1');
    expect(liveInstitutionNames(guard), 'anchored').toContain('Courthouse');
    const g = tabText(guard);
    for (const o of COURT_OUTPUTS) expect(g, o).toContain(o);
  }, 60000);

  test('a house of worship reached only by an "Access to" row offers nothing here (rww-hamlet-calm-1); a church that stands keeps its outputs (rww-metropolis-calm-1)', () => {
    const hamlet = birthApp('rww-hamlet-calm-1');
    expect(chainOf(hamlet, 'parish'), 'anchored: the record\'s parish card').toBeTruthy();
    expect(liveInstitutionNames(hamlet), 'anchored: the church is a neighbour\'s').toContain('Access to parish church');
    const t = tabText(hamlet);
    for (const o of ['Education (basic)', 'Poor relief']) expectAbsentWithAnchor(t, o, 'Outputs', 'a church reached by an access row');
    const city = birthApp('rww-metropolis-calm-1');
    expect(tabText(city)).toContain('Education (basic)');
  }, 60000);
});
