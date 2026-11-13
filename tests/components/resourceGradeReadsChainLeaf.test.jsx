/** @vitest-environment jsdom */
/**
 * resourceGradeReadsChainLeaf.test.jsx — W2-C-LEAVES-3, P1: THE EXPLOITATION GRADE CARDS (the chair's ruling of
 * 2026-11-13 18:04; record 303: the chain model homes "worked here"; the cold list REVIEW-R2-STAGES #558 "Unexploited
 * Timber" beside Timber & Lumber running through Carpenters, #1065 "Unexploited Animal hides" beside a Tanner
 * (established), a Cobbler's guild and a Furrier's district).
 *
 * The Resources tab's, the dossier search's and the PDF's (and the Foundry journal's) cards read ONE reader,
 * `validationOnPage.js :: exploitationCardShown`, through the same reading as the "No one here works the …" sentence
 * (`resourceWorkReading`):
 *  - the model silent on the resource: the filed grade stands ("not known", never "not worked");
 *  - a chain works it, filed Unexploited: shown in the Partial group, its body the resource alone (no promised goods);
 *  - a chain works it, filed Partial or Full: the filed grade stands;
 *  - a modelled chain idle here, filed Partial or Full: the filed grade stands (the ruling's stop: 9 of 9 on the
 *    census's 720 are a hot spring's herbs, 8 of them beside an Apothecary: the record bears the analysis out).
 * The card never disagrees with the sentence.
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
import { exploitationGroupsShown, resourceGapLines, resourceWorkReading } from '../../src/domain/display/validationOnPage.js';
import { resourcesSlice } from '../../src/pdf/lib/viewModelBodySlices.js';
import { resourceDisplayName } from '../../src/domain/display/resourceDisplayName.js';
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
/** Each printed card's badge and resource, and its flow chips. @param {any} town */
const cardsOf = (town) => {
  const { container, unmount } = render(<ResourcesTab settlement={town} narrativeNote={null} />);
  const cards = [...container.querySelectorAll('span')].filter((s) => ['Unexploited', 'Partial', '✓ Fully exploited'].includes(s.textContent || ''))
    .map((badge) => {
      const head = /** @type {HTMLElement} */ (badge.parentElement);
      const card = /** @type {HTMLElement} */ (head.parentElement);
      const flow = /** @type {HTMLElement | null} */ (head.nextElementSibling);
      return { badge: badge.textContent, resource: head.children[1]?.textContent || '',
        chips: flow ? [...flow.querySelectorAll('span')].map((s) => s.textContent).filter((t) => t !== '→') : [], card };
    });
  const out = cards.map(({ badge, resource, chips }) => ({ badge, resource, chips }));
  unmount();
  return out;
};

/** The reader REVIEW-R2-STAGES's twenty towns (probes/REVIEW-R2-STAGES/seeds20.txt). */
const READER_SEEDS = [
  'rr2s-thorp-calm-rand-1',
  'rr2s-thorp-famine-rand-1',
  'rr2s-thorp-calm-port-1',
  'rr2s-hamlet-calm-rand-1',
  'rr2s-hamlet-under_siege-rand-1',
  'rr2s-hamlet-plague_onset-rand-1',
  'rr2s-village-calm-port-1',
  'rr2s-village-famine-rand-1',
  'rr2s-village-monster_pressure-rand-1',
  'rr2s-town-calm-rand-1',
  'rr2s-town-under_siege-rand-1',
  'rr2s-town-plague_onset-rand-1',
  'rr2s-town-indebted-port-1',
  'rr2s-city-calm-rand-1',
  'rr2s-city-famine-rand-1',
  'rr2s-city-under_siege+famine-rand-1',
  'rr2s-city-occupied-rand-1',
  'rr2s-metropolis-calm-rand-1',
  'rr2s-metropolis-wartime-rand-1',
  'rr2s-metropolis-plague_onset-port-1',
];

afterEach(cleanup);

describe('the grade cards read the chain leaf through the sentence\'s own reading (P1)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('the unit: silent model stands; a working chain moves Unexploited to Partial; an idle modelled chain with no house of the trade reads Unexploited', () => {
    const chain = (/** @type {string} */ status, available = true) => ({ chainId: 'timber', resourceInputKey: 'managed_forest',
      resourceInputAvailable: available, status, processingInstitutions: ['Carpenter'] });
    const town = (/** @type {object[]} */ chains, /** @type {Record<string, object[]>} */ exploitation) => ({ name: 'Testford',
      config: { nearbyResources: ['managed_forest'] }, institutions: [{ name: 'Carpenter' }],
      economicState: { activeChains: chains, primaryExports: [] }, resourceAnalysis: { exploitation, gaps: [] } });
    const TIMBER = { rawResource: 'timber', exportValue: 'medium', intermediateGoods: ['lumber', 'planks'], processingInstitutions: ['Sawmill'] };
    const stages = (/** @type {any} */ t) => Object.fromEntries(Object.entries(exploitationGroupsShown(t)).map(([k, v]) => [k, v.map((x) => x.card.rawResource)]));
    expect(stages(town([chain('running')], { unexploited: [TIMBER] }))).toEqual({ unexploited: [], partial: ['timber'], full: [] });
    expect(stages(town([chain('impaired')], { unexploited: [TIMBER] })), 'an idle chain: unexploited as filed').toEqual({ unexploited: ['timber'], partial: [], full: [] });
    expect(stages(town([], { fullyExploited: [TIMBER] })), 'the model silent: the filing stands').toEqual({ unexploited: [], partial: [], full: ['timber'] });
    // RE-KEYED BY IDENTITY (P1-a, the chair's ruling after P1): modelled, idle, filed Partial, and no house of the leaf's
    // WORKED_BY_HOUSE list at the good: the record bears the leaf out, so the card reads Unexploited (was: stands).
    expect(stages(town([chain('running', false)], { partiallyExploited: [TIMBER] })), 'modelled, idle, filed Partial, no such house: Unexploited')
      .toEqual({ unexploited: ['timber'], partial: [], full: [] });
    const { container, unmount } = render(<ResourcesTab settlement={town([chain('running')], { unexploited: [TIMBER] })} narrativeNote={null} />);
    expect(container.textContent).not.toMatch(/Unexploited/);
    expect(container.textContent, 'the moved card names no promised goods').not.toMatch(/planks/);
    unmount();
  });

  test('the reader\'s town: "Unexploited Timber" beside a timber chain through Carpenters is shown Partial, on the tab and in the PDF (rr2s-town-plague_onset-rand-1, #558)', () => {
    const town = birthApp('rr2s-town-plague_onset-rand-1');
    expect((town.resourceAnalysis.exploitation.unexploited || []).map((/** @type {any} */ c) => c.rawResource), 'anchored: the filing').toContain('timber');
    expect(resourceWorkReading(town, 'timber').worked, 'anchored: the leaf').toBe(true);
    const cards = cardsOf(town).filter((c) => c.resource === resourceDisplayName('timber'));
    expect(cards.map((c) => c.badge)).toEqual(['Partial']);
    expect(cards[0].chips, 'the body: the resource alone').toEqual([resourceDisplayName('timber')]);
    const rows = resourcesSlice(town).chainRows.filter((/** @type {any} */ r) => r.resource === 'timber');
    expect(rows.map((/** @type {any} */ r) => [r.status, r.processing, r.output])).toEqual([['partial', null, null]]);
  }, 60000);

  test('the reader\'s town: the hides beside a Tanner (established) are not Unexploited (rr2s-city-occupied-rand-1, #1065)', () => {
    const town = birthApp('rr2s-city-occupied-rand-1');
    const cards = cardsOf(town).filter((c) => c.resource === resourceDisplayName('animal hides'));
    expect(cards.length).toBe(1);
    expect(cards[0].badge).toBe('Partial');
  }, 60000);

  test('P1-a: the herbs a metropolis buys, its gathering grounds spent, are not "Fully exploited" and say nothing of a ground ready to work (rr2s-metropolis-calm-rand-1, #1160)', () => {
    const town = birthApp('rr2s-metropolis-calm-rand-1');
    expect((town.resourceAnalysis.exploitation.fullyExploited || []).map((/** @type {any} */ c) => c.rawResource), 'anchored: filed Full').toContain('medicinal herbs');
    expect(town.economicState.primaryImports, 'anchored: herbs come in by trade').toEqual(expect.arrayContaining(['Herbs and forage (local gathering areas exhausted)']));
    const { container, unmount } = render(<ResourcesTab settlement={town} narrativeNote={null} />);
    const text = container.textContent || '';
    unmount();
    const cards = cardsOf(town).filter((c) => c.resource === resourceDisplayName('medicinal herbs'));
    expect(cards.map((c) => c.badge)).toEqual(['Unexploited']);
    expect(cards[0].chips, 'the body: the resource alone').toEqual([resourceDisplayName('medicinal herbs')]);
    expect(text).not.toMatch(/Draws on: herb gathering areas/);
  }, 60000);

  test('on the reader\'s twenty towns: no Unexploited card beside a working chain, no Partial or Full card beside "No one here works", the PDF\'s groups the tab\'s', () => {
    /** @type {string[]} */ const faults = [];
    for (const seed of READER_SEEDS) {
      const town = birthApp(seed);
      const shown = exploitationGroupsShown(town);
      for (const x of shown.unexploited) if (resourceWorkReading(town, x.card.rawResource).worked) faults.push(`${seed}: Unexploited ${x.card.rawResource} beside a working chain`);
      const sentences = resourceGapLines(town).map((g) => g.impact).filter((t) => t.startsWith('No one here works'));
      for (const x of [...shown.partial, ...shown.full]) {
        const noun = String(x.card.rawResource).replace(/_/g, ' ').toLowerCase();
        if (sentences.some((t) => t.includes(`works the ${noun} near`))) faults.push(`${seed}: ${x.stage} ${x.card.rawResource} beside "${noun}" not worked`);
      }
      const rows = resourcesSlice(town).chainRows;
      for (const st of /** @type {const} */ (['unexploited', 'partial', 'full'])) {
        if (rows.filter((/** @type {any} */ r) => r.status === st).length !== shown[st].length) faults.push(`${seed}: the PDF's ${st} group differs`);
      }
    }
    expect(faults).toEqual([]);
  }, 240000);
});
