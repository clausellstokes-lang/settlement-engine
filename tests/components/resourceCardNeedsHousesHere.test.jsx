/** @vitest-environment jsdom */
/**
 * resourceCardNeedsHousesHere.test.jsx — W2-C-LEAVES-3, #452 (2026-11-13; the chair's note: it joins R1, the same
 * fault). The Resources tab's Unexploited card printed "Needs: Tannery, Leatherworkers' guild" beside a "Tanner
 * (established)" on the roster: the line printed the chain's list of houses (`resourceChains.js ::
 * processingInstitutions`) raw, so a house the town keeps under another name, or a house of the same finishing trade,
 * was still named as needed.
 *
 * RULED (as R1): a finisher is any house on the live roster that does that finishing; a need the roster's own house
 * meets is not listed. The line reads `validationOnPage.js :: housesStillNeeded`: the named houses the live roster
 * holds neither by kind (the catalogue's family, its ladder, and its scale group: "tanneryScale" holds Tanners and
 * Tanner (established), one trade at two sizes) nor by a house of the same trade (`FINISHING_TRADES`). A road to a
 * neighbour's house ("Access to …") meets nothing here. Where every named house stands, no "Needs:" line prints.
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

import { ResourceChainCard, ResourcesTab } from '../../src/components/new/tabs/ResourcesTab.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

/** The app's own shape, as the reader REVIEW-R2-STAGES born its towns (render.rr2s.jsx :: cfgFor). @param {string} seed */
const birthApp = (seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^rr2s-(\w+)-([a-z_+]+)-([a-z_]+)-\d+$/));
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false,
    selectedStresses: stresses, _randomizePriorities: true }), null, { seed, customContent: {} });
};
/** The "Needs:" lines a render prints. @param {HTMLElement} el */
const needsLines = (el) => [...el.querySelectorAll('div')].map((d) => d.textContent || '').filter((t) => /^Needs: /.test(t));

const HIDES = { rawResource: 'animal hides', exportValue: 'high', intermediateGoods: ['Leather'], finalProducts: [],
  processingInstitutions: ['Tannery', "Leatherworkers' guild"] };
/** @param {string[]} names */
const townOf = (names) => ({ name: 'Testford', config: {}, institutions: names.map((name) => ({ name })) });
/** @param {object | null} settlement */
const cardNeeds = (settlement) => {
  const { container, unmount } = render(<ResourceChainCard chain={HIDES} stage="unexploited" settlement={settlement} />);
  const lines = needsLines(container);
  unmount();
  return lines;
};

afterEach(cleanup);

describe('"Needs:" names only the houses the live roster does not hold (#452, ruled with R1)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('the unit: a Tanner (established) is the tannery; a cobbler finishes the leather; a road meets nothing', () => {
    expect(cardNeeds(townOf(['Tanner (established)'])), 'the master tanner\'s yard is the town\'s tannery').toEqual(["Needs: Leatherworkers' guild"]);
    expect(cardNeeds(townOf(['Tanners'])), 'the tannery by its own family').toEqual(["Needs: Leatherworkers' guild"]);
    expect(cardNeeds(townOf(['Tanner (established)', "Cobbler's guild"])), 'every named house stands: no line').toEqual([]);
    expect(cardNeeds(townOf(["Furrier's district"])), 'the furriers finish the leather; no tannery stands').toEqual(['Needs: Tannery']);
    expect(cardNeeds(townOf(['Access to tannery', 'Blacksmith'])), 'a road to elsewhere and another trade meet nothing')
      .toEqual(["Needs: Tannery, Leatherworkers' guild"]);
    expect(cardNeeds(townOf([])), 'an empty roster: the chain\'s whole list').toEqual(["Needs: Tannery, Leatherworkers' guild"]);
  });

  test('a ruined house meets no need (the live roster)', () => {
    const town = { name: 'Testford', config: {}, institutions: [{ name: 'Tanner (established)', status: 'ruined' }, { name: "Cobbler's guild" }] };
    expect(cardNeeds(town)).toEqual(['Needs: Tannery']);
  });

  test('the reader\'s town: a Tanner (established), a Cobbler\'s guild and a Furrier\'s district need nothing for the hides (rr2s-city-occupied-rand-1, #1065)', () => {
    const town = birthApp('rr2s-city-occupied-rand-1');
    const names = town.institutions.map((/** @type {{ name: string }} */ i) => i.name);
    expect(names, 'anchored: the roster').toEqual(expect.arrayContaining(['Tanner (established)', "Cobbler's guild", "Furrier's district"]));
    const hides = (town.resourceAnalysis?.exploitation?.unexploited || []).find((/** @type {{ rawResource: string }} */ c) => c.rawResource === 'animal hides');
    expect(hides?.processingInstitutions, 'anchored: the card the record files').toEqual(['Tannery', "Leatherworkers' guild"]);
    const { container, unmount } = render(<ResourcesTab settlement={town} narrativeNote={null} />);
    expect(needsLines(container).filter((t) => /Tannery|Leatherworkers/.test(t))).toEqual([]);
    unmount();
  }, 60000);

  test('a town with a Cobbler\'s guild and no tannery still needs the tannery (rr2s-town-under_siege-rand-1)', () => {
    const town = birthApp('rr2s-town-under_siege-rand-1');
    const { container, unmount } = render(<ResourcesTab settlement={town} narrativeNote={null} />);
    expect(needsLines(container)).toEqual(expect.arrayContaining(['Needs: Tannery']));
    expect(needsLines(container).filter((t) => /Leatherworkers/.test(t))).toEqual([]);
    unmount();
  }, 60000);
});
