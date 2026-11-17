/** @vitest-environment jsdom */
/**
 * bar7EconTab.test.jsx — BAR7-ECON's guard (the chair's BRIEF-BAR7, section BAR7-ECON, 2026-11-17; vetoable by the owner).
 *
 * THE ECONOMICS TAB READS THE MARK AND THE LISTS IT PRINTS. Each arm reads named towns of the sixth read's thirty or the wide
 * read's 150 (REVIEW-BAR-0's bar0- shape, PAGE-COPY's seedcfg.mjs), with an anchor that the record still holds the premise and
 * a sibling that still prints. It fails at the joined line's 7e4a64a19 and passes at the seat's tip:
 *   (1) 8f   an income share whose every house the leaf marks takes the mark (the short one too); a share fed by a chain
 *            the siege impairs takes the siege's partial mark; the tab's head says what a row marked short is;
 *   (2) 8g   the service economy's card reads the leaf's worse state of its house, as the Institutions card head does;
 *   (3) 8i.resource  a ground's "Fully exploited" is not printed where every Via house of its chains is marked;
 *   (4) 8i.chainStopped (CY1)  a stopped chain's "Normally yields" names no service whose row is kept on offer;
 *   (5) 8j   a good whose every maker is marked short leaves the Exports and Produced locally;
 *   (6) 9h   the empty export column says the crisis where the crisis emptied it.
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
import { ResourcesTab } from '../../src/components/new/tabs/ResourcesTab.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import * as marks from '../../src/domain/display/economicsCrisisMarks.js';
import { rowMarkText, rowShortOf, SUPPLIED_LINE } from '../../src/domain/display/crisisStoppedRow.js';
import { housesShortOf } from '../../src/domain/facts/houseInputAtHand.js';
import { houseDependenceOf, INPUT } from '../../src/data/crisisDependence.js';
import { liveInstitutions } from '../../src/domain/institutions/institutionRoster.js';
import { CLOTH_SHORT_LINE, CLOTH_WORKED_LINE, METAL_SHORT_LINE, METAL_WORKED_LINE, ordinaryIncomeLineOf } from '../../src/generators/economy/incomeLineSiblings.js';
import { neededNamesShown } from '../../src/domain/display/criticalImportsShown.js';
import { exportsAsPrinted, localProductionAsPrinted } from '../../src/domain/display/tradeListDisplay.js';
import { chainAsShown } from '../../src/domain/display/chainStateShown.js';
import { serviceRowsOf } from '../../src/domain/dossier/entityLinks.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
/** seedcfg.mjs's bar0- arm, verbatim in shape (tests/domain/bar6SeamEcon.test.js reads it the same way). @param {string} seed */
const born = (seed) => {
  const m = new RegExp(`^bar0-${SIZE}-([a-z_+]+)-([a-z_]+)-\\d+$`).exec(seed);
  if (!m) throw new Error(`no shape for ${seed}`);
  const st = m[2] === 'calm' ? [] : m[2].split('+');
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true }), null, { seed, customContent: {} });
};
/** @type {Map<string, any>} */
const towns = new Map();
const town = (/** @type {string} */ seed) => { if (!towns.has(seed)) towns.set(seed, born(seed)); return towns.get(seed); };
const share = (/** @type {any} */ s, /** @type {string} */ title) => (s.economicState?.incomeSources || []).find((/** @type {any} */ x) => x.source === title);
/** The Economics tab as printed: its text, and the rendered container's own query. @param {any} s */
const economics = (s) => {
  const { container, unmount } = render(<EconomicsTab settlement={s} narrativeNote={null} />);
  const text = container.textContent || '';
  const head = container.querySelector('[data-testid="economics-ordinary-times"]')?.textContent || null;
  /** the smallest block whose text opens with this name and holds this word @param {string} name @param {string} word */
  const card = (name, word) => [...container.querySelectorAll('div')].map((d) => d.textContent || '')
    .filter((t) => t.startsWith(name) && t.includes(word)).sort((a, b) => a.length - b.length)[0] || null;
  const cards = { alchemical: card('Alchemical Trade', 'Via') };
  unmount();
  return { text, head, cards };
};

afterEach(cleanup);
beforeAll(async () => { await loadGenerationLawPayloads(); }, 120000);

describe('BAR7-ECON item 1 (8f): an income share whose every house the leaf marks takes the mark', () => {
  // [seed (control), share, the mark it opens with]
  const MARKED = [
    ['bar0-city-under_siege+famine-rand-44', 'Wool & Textile Trade', /^Short of wool\. /], // C8021: the weavers and the fuller short
    ['bar0-town-occupied-rand-44', 'Wool & Textile Trade', /^Short of wool\. /], // C40674: the weavers short
    ['bar0-village-calm-rand-42', 'Iron & Metalwork', /^Short of iron\. /], // C41826 (C41825, its cell): the only smith short
    ['bar0-town-calm-rand-42', 'Apothecary & Alchemy', /^Short of /], // C33921: the alchemist shop short of its materials
    ['bar0-city-under_siege+famine-rand-43', 'Timber Trade', /^Curtailed by the siege\. /], // C4828: fed by "Timber & Lumber · Impaired"
  ];
  test('each control: the share opens with the mark; its line of ordinary times follows it', () => {
    expectNoSeedFailures(collectSeedFailures(MARKED, ([seed, title, mark]) => {
      const s = town(seed);
      const src = share(s, title);
      expect(src, `${seed}: anchored, the record holds the share ${title}`).toBeTruthy();
      const shown = marks.incomeDescShown(s, src);
      expect(shown, `${seed}: ${title} carries its mark`).toMatch(mark);
      expect(shown.endsWith(String(src.desc || '').trim()), `${seed}: the description of ordinary times follows the mark`).toBe(true);
    }), 'item 1: every control');
  }, 600000);
  test('a sibling still prints bare; the calm town\'s head says what a row marked short is', () => {
    const s = town('bar0-village-calm-rand-42');
    expect(marks.incomeDescShown(s, share(s, 'Fish & Maritime Produce'))).toBe('Catch landed here and sold fresh or preserved.'); // KEEP: its houses work
    const { head, text } = economics(s);
    expect(head).toBe(SUPPLIED_LINE);
    expect(text).toContain('Short of iron. Metal is smelted or worked here.');
  }, 300000);
});

describe('BAR7-ECON item 2 (8g): the service economy\'s card reads the leaf\'s worse state of its house', () => {
  test('C39519: "Alchemical Trade" through an alchemist shop the page marks short prints no "Operational"', () => {
    const s = town('bar0-town-occupied-rand-43');
    const shop = (s.institutions || []).find((/** @type {any} */ i) => i?.name === 'Alchemist shop');
    expect(shop && rowMarkText(s, 'house', shop), 'anchored: the alchemist shop carries a mark').toMatch(/^Short of /);
    const { cards } = economics(s);
    expect(cards.alchemical, 'anchored: the card prints').toBeTruthy();
    expect(cards.alchemical).not.toContain('Operational');
  }, 300000);
});

describe('BAR7-ECON item 3 (8i.resource): no "Fully exploited" over a ground whose every Via house is marked', () => {
  // [seed (control), the ground's printed name]
  const GROUNDS = [['bar0-hamlet-under_siege-rand-43', 'Fish'], ['bar0-city-under_siege+famine-rand-34', 'Mountain timber']];
  test('each town: the ground prints the chain cards\' word, not the healthy tick', () => {
    expectNoSeedFailures(collectSeedFailures(GROUNDS, ([seed, ground]) => {
      const { container, unmount } = render(<ResourcesTab settlement={town(seed)} />);
      const full = [...container.querySelectorAll('[data-testid="resource-full-under-siege"]')].map((d) => d.textContent || '');
      const text = container.textContent || '';
      unmount();
      expect(full.some((t) => t.includes(ground)), `${seed}: the ${ground} card takes the siege's word`).toBe(true);
      expect(text.includes(`✓ Fully exploited${ground}`), `${seed}: no healthy tick over ${ground}`).toBe(false);
    }), 'item 3: every ground');
  }, 600000);
});

describe('BAR7-ECON item 4 (8i.chainStopped, ruling CY1): a stopped chain names no service kept on offer', () => {
  test('C7539: the harbour chain\'s "Normally yields" drops "Ship construction"; the shipyard\'s row stays on offer', () => {
    const s = town('bar0-city-under_siege+famine-rand-44');
    const record = (s.economicState.activeChains || []).find((/** @type {any} */ c) => c.chainId === 'harbour_trade');
    expect(record?.outputs, 'anchored: the record\'s chain yields ship construction').toContain('Ship construction');
    const shown = marks.chainCardUnderSiege(s, record, chainAsShown(record, s));
    const outs = marks.chainOutputsOnCard(shown, s);
    expect(outs).not.toContain('Ship construction');
    const row = serviceRowsOf(s.availableServices).map(({ svc }) => svc).find((svc) => svc.name === 'Ship construction');
    expect(row && rowMarkText(s, 'service', row), 'KEEP: the shipyard builds from its own timber (its row unmarked)').toBeNull();
  }, 300000);
});

describe('BAR7-ECON item 5 (8j): a good whose every maker is marked short leaves the lists', () => {
  // [seed, list, the good that leaves, a sibling that still prints]
  const GONE = [
    ['bar0-metropolis-calm-rand-27', 'exports', 'Fulled cloth', 'Milled flour'],
    ['bar0-metropolis-calm-rand-39', 'exports', 'Fulled cloth', 'Milled flour'],
  ];
  test('each town: the record lists the good, the page does not; its sibling prints', () => {
    expectNoSeedFailures(collectSeedFailures(GONE, ([seed, list, good, still]) => {
      const s = town(seed);
      const recorded = list === 'exports' ? s.economicState.primaryExports : s.economicState.localProduction;
      expect(recorded, `${seed}: anchored, the record lists ${good}`).toContain(good);
      const shown = list === 'exports' ? exportsAsPrinted(s) : localProductionAsPrinted(s);
      expect(shown, `${seed}: the sibling still prints`).toContain(still);
      expect(shown, `${seed}: ${good} leaves the ${list}`).not.toContain(good);
    }), 'item 5: every good');
  }, 600000);
  test('KEEP: a good an unmarked house makes stays (the 150\'s "Leather goods": its tanner short, its cobblers\' guild at work)', () => {
    const s = town('bar0-metropolis-calm-rand-39');
    expect(s.economicState.localProduction, 'anchored').toContain('Leather goods');
    expect(localProductionAsPrinted(s)).toContain('Leather goods');
  }, 300000);
});

describe('BAR7-ECON item 6 (9h): the empty export column says the crisis that emptied it', () => {
  // [seed (control), the line the column prints]
  const LINES = [
    ['bar0-hamlet-under_siege-rand-44', 'Nothing is sold outward while the siege lasts.'], // C20830
    ['bar0-village-famine-rand-28', 'Nothing is sold outward while the famine lasts.'], // the wide read's shape (raw wool, livestock)
    ['bar0-village-calm-rand-31', 'No significant exports.'], // KEEP: transit alone is no export, and no crisis
  ];
  test('each town: the line, and never the other', () => {
    expectNoSeedFailures(collectSeedFailures(LINES, ([seed, line]) => {
      const s = town(seed);
      expect(exportsAsPrinted(s), `${seed}: anchored, the column is empty`).toEqual([]);
      const { text } = economics(s);
      expect(text).toContain(line);
      const other = line === 'No significant exports.' ? 'Nothing is sold outward' : 'No significant exports.';
      expect(text.includes(other), `${seed}: the other line`).toBe(false);
    }), 'item 6: every town');
  }, 600000);
});

// ── AFTER THE SECOND READER (the chair's message of 2026-11-17, about 06:27 UTC; vetoable by the owner) ──────────────────────
describe('point (1): a stored short twin prints only under a mark; an unmarked share prints its trade\'s ordinary line', () => {
  // [seed, share, the stored twin, the line printed]: one town on each side, for metal and for cloth
  const ROWS = [
    ['bar0-metropolis-calm-rand-42', 'Iron & Metalwork', METAL_SHORT_LINE, METAL_WORKED_LINE], // unmarked: the smiths at work
    ['bar0-village-calm-rand-44', 'Iron & Metalwork', METAL_SHORT_LINE, `Short of iron. ${METAL_SHORT_LINE}`], // marked: the twin stays
    ['bar0-metropolis-calm-rand-42', 'Wool & Textile Trade', CLOTH_SHORT_LINE, CLOTH_WORKED_LINE], // unmarked
    ['bar0-city-wartime-rand-43', 'Wool & Textile Trade', CLOTH_SHORT_LINE, /^(?:Short of|Curtailed by|Stopped by|Scarce in)[^.]*\. .*Little cloth is made here/], // marked
  ];
  test('each town: the record stores the twin; the tab prints the line of its side (the tab\'s own call)', () => {
    expectNoSeedFailures(collectSeedFailures(ROWS, ([seed, title, twin, printed]) => {
      const s = town(seed);
      const src = share(s, title);
      expect(src?.desc, `${seed}: anchored, the record stores the short twin`).toBe(twin);
      const shown = marks.incomeDescShown(s, src, ordinaryIncomeLineOf);
      if (printed instanceof RegExp) expect(shown).toMatch(printed); else expect(shown).toBe(printed);
    }), 'point (1): every row');
  }, 600000);
  test('the tab prints it so: the unmarked metropolis shows no short twin', () => {
    const { text } = economics(town('bar0-metropolis-calm-rand-42'));
    expect(text).toContain(METAL_WORKED_LINE);
    expect(text).not.toContain(METAL_SHORT_LINE);
  }, 300000);
});

describe('point (2): one good once on the needs line, never two goods merged', () => {
  test('the measured pairs merge; two goods do not', () => {
    expect(neededNamesShown(['timber', 'mountain timber', 'stone'])).toEqual(['mountain timber', 'stone']);
    expect(neededNamesShown(['fine glass sand', 'fine glass sand'])).toEqual(['fine glass sand']);
    expect(neededNamesShown(['timber (for large vessels)', 'timber'])).toEqual(['timber (for large vessels)']);
    expect(neededNamesShown(['iron', 'iron ore'])).toEqual(['iron', 'iron ore']); // two goods
    expect(neededNamesShown(['salt', 'desert salt'])).toEqual(['salt', 'desert salt']); // no pair declared: both said
  });
});

describe('point (4): the lists\' short reading equals the page\'s mark, house for house', () => {
  // the guard's own towns and the controls' (the 30 and the 150), every live house
  const SAMPLE = ['bar0-city-under_siege+famine-rand-44', 'bar0-village-calm-rand-42', 'bar0-town-calm-rand-42', 'bar0-town-occupied-rand-43',
    'bar0-town-occupied-rand-44', 'bar0-metropolis-calm-rand-27', 'bar0-metropolis-calm-rand-39', 'bar0-metropolis-calm-rand-42',
    'bar0-hamlet-under_siege-rand-44', 'bar0-village-famine-rand-28'];
  test('`everyMakerShortHere`\'s set (the fact, a house whose dependence holds INPUT) is `rowShortOf`\'s, in every town', () => {
    let read = 0;
    expectNoSeedFailures(collectSeedFailures(SAMPLE, (seed) => {
      const s = town(seed);
      const fact = housesShortOf(s);
      for (const h of liveInstitutions(s)) {
        const name = String(h?.name ?? '');
        if (!name) continue;
        read++;
        const lists = fact.has(name) && houseDependenceOf(h).includes(INPUT);
        expect(lists, `${seed}: ${name}`).toBe(rowShortOf(s, 'house', /** @type {any} */ (h)) !== null);
      }
    }), 'point (4): every town');
    expect(read, 'anti-vacuity: houses were read').toBeGreaterThan(200);
  }, 600000);
});
