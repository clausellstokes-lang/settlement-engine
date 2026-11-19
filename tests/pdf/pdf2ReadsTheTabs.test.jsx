/** @vitest-environment jsdom */
/**
 * pdf2ReadsTheTabs.test.jsx — PDF-2 (BRIEF-BAR8, the sixth chair, 2026-11-17): THE PRINTED EXPORT AND THE FOUNDRY JOURNAL
 * READ WHAT THE TABS READ, SECOND PASS. Over fixed towns of the census's 720 and the wide read's 150, born in the test, each
 * arm collects every failure; the arms read the tab's own functions at run time, so a later change to those leaves is
 * followed, not frozen:
 *   (1) no PDF chain card (the Services chapter's card, the Economics chapter's flow row) lists a house the tab's card
 *       leaves off (`chainHouses.js :: chainHousesOf` handed the card and its town: ruling BR10 (3), amended);
 *   (2) the PDF's NEARBY RESOURCES prints every ground a house proves (the view model's `nearbyProven`, as the Resources
 *       tab and the journal's "Nearby resources" row print it);
 *   (5) no PDF chain card prints an output the tab's card withholds, and each says "Normally yields" where the tab's card
 *       does: the tab's card is `chainCardUnderSiege(town, c, chainAsShown(c, town))` (EconomicsTab.jsx:119), and its
 *       outputs `chainOutputsOnCard` of THAT chain (EconomicsTab.jsx:169);
 *   (6) the state word of the PDF's card, the flow row's state and the journal's chain row are the tab card's;
 *   (7) the journal's Economics page head line is the Economics tab's (`econOrdinaryTimesLine`), its short sentence
 *       included: this arm HOLDS (it passes at the base) and bites a journal that drops `incomeShort`
 *       (`journalPages.js :: economicsPage`'s `ordinaryTimesLine(..., incomeShort)`; the seat's MED 2).
 * Measured by the seat's probe at the base 3b06c724b over the 720: (1) 18 towns, (2) 134, (5) 42 (and 59 towns whose
 * card's "Normally yields" was not the tab's), (6) 37 in the PDF and 37 in the journal, (7) 0. Over the 150: 2, 27, 22 (30),
 * 18, 18, 0. At the seat's tip: 0 each. Negatives stand beside the positive anchors: towns that print none of these, and
 * agree.
 */
import { beforeAll, describe, expect, test, vi } from 'vitest';

vi.mock('../../src/store/index.js', () => {
  const data = { campaigns: [] };
  function useStore(selector) { return selector(data); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => data;
  return { useStore, default: useStore };
});

import { EconomicsTrade } from '../../src/pdf/sections/EconomicsTrade.jsx';
import { Services } from '../../src/pdf/sections/Services.jsx';
import { Institutions } from '../../src/pdf/sections/Institutions.jsx';
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import InstitutionsTab from '../../src/components/new/tabs/InstitutionsTab.jsx';
import { ServicesTab } from '../../src/components/new/tabs/ServicesTab.jsx';
import { ResourcesProduction } from '../../src/pdf/sections/ResourcesProduction.jsx';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { CHAIN_STATE_WORDS } from '../../src/pdf/lib/chainStateOnPage.js';
import { humanize, label } from '../../src/pdf/lib/format.js';
import { buildJournalPages, esc } from '../../src/foundry/journalPages.js';
import { chainCardUnderSiege, chainOutputsOnCard, econOrdinaryTimesLine, incomeDescShown } from '../../src/domain/display/economicsCrisisMarks.js';
import { ordinaryIncomeLineOf } from '../../src/generators/economy/incomeLineSiblings.js'; // the Economics tab's own import (EconomicsTab.jsx), not the PDF's copy
import { chainAsShown } from '../../src/domain/display/chainStateShown.js';
import { chainHousesOf } from '../../src/domain/display/chainHouses.js';
import { chainOutputsShown } from '../../src/domain/display/tradeListDisplay.js';
import { chainPrintName } from '../../src/domain/display/chainPrintName.js';
import { chainYieldRefused } from '../../src/domain/chainYield.js';
import { RESOURCE_DISPLAY_LABELS } from '../../src/domain/display/resourceDisplayName.js';
import { SUPPLIED_LINE } from '../../src/domain/display/crisisStoppedRow.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's births (r2r-/r2s-) and the wide read's (bar0-), as their instruments born them. @param {string} seed */
const cfgFor = (seed) => {
  let m = seed.match(new RegExp(`^r2r-${SIZE}-\\d+$`));
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] });
  m = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-\\d+$`));
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
  m = /** @type {RegExpMatchArray} */ (seed.match(new RegExp(`^bar0-${SIZE}-([a-z_+]+)-rand-\\d+$`)));
  return birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true });
};

const clean = (/** @type {unknown} */ t) => String(t).replace(/[\u200b-\u200d\u00ad\ufeff]/g, '').replace(/\s+/g, ' ').trim();
const low = (/** @type {unknown} */ x) => clean(x ?? '').toLowerCase().replace(/_/g, ' ');
/** One Text's leaves, function components executed. @param {any} node @param {string[]} acc @returns {string[]} */
const textOf = (node, acc) => {
  if (node == null || typeof node === 'boolean') return acc;
  if (typeof node === 'string' || typeof node === 'number') { acc.push(String(node)); return acc; }
  if (Array.isArray(node)) { for (const n of node) textOf(n, acc); return acc; }
  if (typeof node.type === 'function') return textOf(node.type(node.props), acc);
  return textOf(node.props?.children, acc);
};
/** @typedef {{ kind: string, chain: any, statusLabel: unknown, lines: string[] }} Card */
/**
 * The page as printed: one line a Text (its leaves joined), and each chain card's own lines kept apart (`ChainCard`, the
 * Services chapter's; `ChainRow`, the Economics chapter's flow), with the chain it was handed and the word it prints.
 * @param {any} node @param {string[]} out @param {Card[]} cards
 */
const walk = (node, out, cards) => {
  if (node == null || typeof node === 'boolean') return;
  if (typeof node === 'string' || typeof node === 'number') { const t = clean(node); if (t) out.push(t); return; }
  if (Array.isArray(node)) { for (const n of node) walk(n, out, cards); return; }
  if (typeof node.type === 'function') {
    const name = node.type.name;
    if (name === 'ChainCard' || name === 'ChainRow') {
      const el = node.type(node.props); /** @type {string[]} */ const own = [];
      walk(el, own, cards); out.push(...own);
      cards.push({ kind: name, chain: node.props.chain, statusLabel: name === 'ChainCard' ? (el?.props?.statusLabel ?? null) : null, lines: own });
      return;
    }
    walk(node.type(node.props), out, cards); return;
  }
  if (node.type === 'TEXT') { const t = clean(textOf(node.props?.children, []).join('')); if (t) out.push(t); return; }
  walk(node.props?.children, out, cards);
};
/** A card's printed tokens: its flow line's parts, each part's houses or outputs. @param {string[]} lines */
const tokens = (lines) => {
  const out = new Set();
  for (const l of lines) for (const a of l.split(' \u00bb ')) {
    const b = a.replace(/^Normally yields: /, '').replace(/ {1,2}EXPORT$/, '').replace(/ \(depleted\)$/, '');
    for (const c of b.split(/ \+ |, /)) out.add(low(c));
  }
  return out;
};
/** The tab's card (EconomicsTab.jsx:119): the state a crisis left, then the card's word. @param {any} t @param {any} c */
const tabCard = (t, c) => chainCardUnderSiege(t, c, chainAsShown(c, t));
/** The tab's chip word for a card (EconomicsTab.jsx :: FLOW_STATUS, its glyph struck). @param {any} shown */
const tabWord = (shown) => { const k = String(shown?.status ?? ''); return k === '' ? '' : (/** @type {Record<string, string>} */ (CHAIN_STATE_WORDS)[k] ?? CHAIN_STATE_WORDS.operational); };

/** The census's 720: a siege's cards, words and a proven ground (r2s-under_siege-village-0), an outbreak's
 *  (r2s-plague_onset-city-0), a famine's (r2s-famine-town-0), the mines a spent iron card listed (r2r-town-45,
 *  r2r-metropolis-9), a calm card's output the tab withholds (r2r-village-8), a proven ground (r2r-hamlet-8), a calm
 *  thorp's impaired parish (r2r-thorp-41), shares marked short (the head line's short sentence: r2r-hamlet-10,
 *  r2r-village-13); r2r-village-15 prints none of the chain and ground faults.
 *  RE-KEYED BY IDENTITY 2026-11-19 (LASTCLOSE-DOORS, the last close's whole check, C1 (b)): from r2r-village-0, whose live Common
 *  grazing land now proves its pasture (FAULTS-BIRTH's follow-ups, point 68, FR23): the PDF and the Resources tab both print
 *  `grazing_land`, true by the record (`groundsKeptOf`), so it is no longer a town with no proven ground. */
const CENSUS = ['r2s-under_siege-village-0', 'r2s-plague_onset-city-0', 'r2s-famine-town-0', 'r2r-town-45', 'r2r-metropolis-9',
  'r2r-village-8', 'r2r-hamlet-8', 'r2r-thorp-41', 'r2r-hamlet-10', 'r2r-village-13', 'r2r-village-15'];
/** The wide read's 150: a besieged and starving city with a spent iron card (bar0-city-under_siege+famine-rand-36), a
 *  besieged hamlet (bar0-hamlet-under_siege-rand-32), a proven ground (bar0-hamlet-calm-rand-27);
 *  bar0-village-calm-rand-30 prints none (RE-KEYED BY IDENTITY 2026-11-19, LASTCLOSE-DOORS: from bar0-village-calm-rand-28, whose
 *  common proves its pasture since point 68, printed on the PDF and the tab alike, true by the record). */
const WIDE = ['bar0-city-under_siege+famine-rand-36', 'bar0-hamlet-under_siege-rand-32', 'bar0-hamlet-calm-rand-27', 'bar0-village-calm-rand-30'];
const SAMPLE = [...CENSUS, ...WIDE];
/** The towns where the base printed none of arms (1), (2), (5), (6): the readings still agree there. */
const NEGATIVES = ['r2r-village-15', 'bar0-village-calm-rand-30']; // RE-KEYED 2026-11-19 (LASTCLOSE-DOORS, C1 (b)): from r2r-village-0 and bar0-village-calm-rand-28 (point 68's commons prove their pasture: a true ground, printed alike); each new one of the 720's (the 150's) villages that prints none of the faults (measured over r2r-village-0..59 and bar0-village-calm-rand-27..41: 9 and 8 qualify; the lowest taken)

/** @typedef {{ t: any, vm: any, svc: string[], eco: string[], res: string[], cards: Card[], journal: Array<{ name: string, markdown: string }> }} Town */
/** @type {Map<string, Town>} */
const towns = new Map();
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of SAMPLE) {
    const t = generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
    const vm = buildViewModel({ settlement: t });
    const props = { settlement: t, narrativeMode: false, vm, stateProse: null };
    /** @type {Card[]} */ const cards = []; /** @type {string[]} */ const svc = [], eco = [], res = [];
    walk(Services(props), svc, cards); walk(EconomicsTrade(props), eco, cards); walk(ResourcesProduction(props), res, []);
    towns.set(seed, { t, vm, svc, eco, res, cards, journal: buildJournalPages(vm, { settlement: t }) });
  }
}, 900000);
/** @param {string} seed */
const town = (seed) => /** @type {Town} */ (towns.get(seed));
/** The record's chain a card was handed (the record's own, or the tab's copy of it). @param {Town} x @param {Card} card */
const recordOf = (x, card) => {
  const recs = x.t?.economicState?.activeChains || [];
  return recs.find((/** @type {any} */ c) => c === card.chain) || recs.find((/** @type {any} */ c) => c?.chainId && c.chainId === card.chain?.chainId) || null;
};
/** @param {Town} x */
const econPage = (x) => (x.journal.find((p) => p.name === 'Economics & Trade') || { markdown: '' }).markdown;

describe('PDF-2 item 1: no PDF chain card lists a house the tab\'s card leaves off a spent ground (BR10 (3))', () => {
  test('the Services cards and the flow rows, over the sample', () => {
    let withheldCards = 0;
    expectNoSeedFailures(collectSeedFailures(SAMPLE, (seed) => {
      const x = town(seed); /** @type {string[]} */ const bad = [];
      const instNames = (x.t?.institutions || []).map((/** @type {any} */ i) => i?.name);
      for (const card of x.cards) {
        const rec = recordOf(x, card); if (!rec) continue;
        const nameOf = card.kind === 'ChainCard' ? (/** @type {{ name: string }} */ h) => low(humanize(h.name)) : (/** @type {{ name: string }} */ h) => low(h.name);
        const onTab = new Set(chainHousesOf(rec.processingInstitutions, instNames, { chain: tabCard(x.t, rec), town: x.t }).map(nameOf));
        const withheld = chainHousesOf(rec.processingInstitutions, instNames).map(nameOf).filter((n) => !onTab.has(n));
        if (withheld.length) withheldCards++;
        const printed = card.kind === 'ChainCard' ? tokens(card.lines) : new Set(card.lines.map(low));
        for (const h of withheld) if (printed.has(h)) bad.push(`${card.kind} ${rec.chainId}: "${h}" the tab's card leaves off`);
      }
      expect(bad, seed).toEqual([]);
    }), 'every card of every town');
    expect(withheldCards, 'the cards whose tab card leaves a house off (Services and flow)').toBeGreaterThanOrEqual(6);
  });
});

describe('PDF-2 item 2: the PDF\'s NEARBY RESOURCES prints every ground a house proves', () => {
  test('over the sample', () => {
    let proven = 0;
    expectNoSeedFailures(collectSeedFailures(SAMPLE, (seed) => {
      const x = town(seed);
      const at = x.res.indexOf('NEARBY RESOURCES');
      const end = at < 0 ? -1 : x.res.slice(at + 1).findIndex((l) => /^[A-Z][A-Z &·0-9'-]{3,}$/.test(l));
      const block = at < 0 ? [] : x.res.slice(at + 1, end < 0 ? x.res.length : at + 1 + end);
      const want = (x.vm.resources?.nearbyProven || []).map((/** @type {string} */ g) => clean(Object.hasOwn(RESOURCE_DISPLAY_LABELS, g) ? /** @type {Record<string, string>} */ (RESOURCE_DISPLAY_LABELS)[g] : humanize(label(g))));
      proven += want.length;
      expect(want.filter((/** @type {string} */ w) => !block.includes(w)), `${seed}: proven grounds the chapter does not print`).toEqual([]);
      expect(block.includes('Abundant') ? want.filter((/** @type {string} */ w) => block.indexOf(w) > block.indexOf('Abundant')) : [], `${seed}: a proven ground under "Abundant"`).toEqual([]);
    }), 'every town');
    expect(proven, 'the grounds the houses prove in the sample').toBeGreaterThanOrEqual(5);
  });
});

describe('PDF-2 item 5: a PDF chain card prints the outputs of the chain the tab\'s card renders', () => {
  test('no output the tab\'s card withholds; "Normally yields" where the tab\'s card says it; over the sample', () => {
    let withheldTowns = 0, refusedCards = 0;
    expectNoSeedFailures(collectSeedFailures(SAMPLE, (seed) => {
      const x = town(seed); /** @type {string[]} */ const bad = []; let withheldHere = false;
      for (const card of x.cards) {
        const rec = recordOf(x, card); if (!rec) continue;
        const T = tabCard(x.t, rec);
        const onTab = new Set(chainOutputsOnCard(T, x.t).map(low));
        const all = new Set([...chainOutputsShown(rec, x.t), ...chainOutputsShown(chainAsShown(rec, x.t), x.t), ...(rec.outputs || [])].map(low));
        const withheld = [...all].filter((o) => !onTab.has(o));
        if (withheld.length) withheldHere = true;
        const printed = tokens(card.lines);
        for (const o of withheld) if (printed.has(o)) bad.push(`${card.kind} ${rec.chainId}: "${o}" the tab's card withholds`);
        if (onTab.size > 0) {
          const tabRefused = chainYieldRefused(T);
          if (tabRefused) refusedCards++;
          if (card.lines.some((l) => l.includes('Normally yields')) !== tabRefused) bad.push(`${card.kind} ${rec.chainId}: the tab's card says ${tabRefused ? '"Normally yields"' : '"Outputs"'}`);
        }
      }
      if (withheldHere) withheldTowns++;
      expect(bad, seed).toEqual([]);
    }), 'every card of every town');
    expect(withheldTowns, 'the towns where a tab card withholds an output').toBeGreaterThanOrEqual(5);
    expect(refusedCards, 'the cards whose tab card refuses its yield').toBeGreaterThanOrEqual(10);
  });
});

describe('PDF-2 item 6: the chain\'s state word is the tab card\'s on the PDF\'s card, the flow row and the journal', () => {
  test('over the sample', () => {
    let impaired = 0, rows = 0;
    expectNoSeedFailures(collectSeedFailures(SAMPLE, (seed) => {
      const x = town(seed); /** @type {string[]} */ const bad = [];
      for (const card of x.cards) {
        const rec = recordOf(x, card); if (!rec) continue;
        const T = tabCard(x.t, rec);
        if (card.kind === 'ChainCard') {
          if (String(T?.status) === 'impaired') impaired++;
          if (String(card.statusLabel ?? '') !== tabWord(T)) bad.push(`card ${rec.chainId}: "${card.statusLabel}" / the tab's "${tabWord(T)}"`);
        } else if (String(card.chain?.status ?? '') !== String(T?.status ?? '')) bad.push(`flow ${rec.chainId}: ${card.chain?.status} / the tab's ${T?.status}`);
      }
      const recs = x.t?.economicState?.activeChains || [];
      for (const l of (econPage(x).split('## Supply chains')[1] || '').split('\n## ')[0].split('\n').filter((r) => r.startsWith('- **'))) {
        const m = /^- \*\*(.+?)\*\*(?: \*\(([^)]*)\)\*)?/.exec(l); if (!m) continue;
        const rec = recs.find((/** @type {any} */ c) => esc(chainPrintName(c, x.t).label) === m[1]);
        if (!rec) { bad.push(`journal ${m[1]}: a chain row of no chain of the record`); continue; }
        rows++;
        if ((m[2] || '') !== tabWord(tabCard(x.t, rec)).toLowerCase()) bad.push(`journal ${m[1]}: "${m[2] || ''}" / the tab's "${tabWord(tabCard(x.t, rec))}"`);
      }
      expect(bad, seed).toEqual([]);
    }), 'every card and journal row of every town');
    expect(impaired, 'the cards the tab marks impaired').toBeGreaterThanOrEqual(10);
    expect(rows, 'the journal\'s chain rows read').toBeGreaterThanOrEqual(60);
  });
});

describe('PDF-2 item 7: the journal\'s Economics head line is the Economics tab\'s, its short sentence included', () => {
  test('over the sample (holds at the base; bites a journal that drops incomeShort)', () => {
    let supplied = 0;
    expectNoSeedFailures(collectSeedFailures(SAMPLE, (seed) => {
      const x = town(seed);
      const tab = econOrdinaryTimesLine(x.t, x.t.economicState);
      if (tab && tab.includes(SUPPLIED_LINE)) supplied++;
      const page = econPage(x).replace(/\\(.)/g, '$1');
      expect({ head: tab ? page.includes(tab) : true, supplied: page.includes(SUPPLIED_LINE) }, seed)
        .toEqual({ head: true, supplied: !!tab && tab.includes(SUPPLIED_LINE) });
    }), 'every town');
    expect(supplied, 'the towns whose tab head line says what a row marked short is').toBeGreaterThanOrEqual(2);
  });
});

describe('PDF-2b item 1 (item 3 of the section, LEFT-MARKS M3): the PDF\'s Services and Institutions chapters print the short sentence where their tabs print it', () => {
  // The nine towns whose only mark is a failed venture's (LEFT-MARKS's M3: their tabs print no "marked short" sentence) and
  // two whose tabs print it over a short mark (r2r-city-20; r2r-hamlet-27, the maltster's), each tab RENDERED, as
  // `tests/domain/leftMarks.test.js` renders them; each PDF chapter rendered to its text leaves.
  const VENTURE_ONLY = ['r2r-hamlet-26', 'r2r-hamlet-48', 'r2r-hamlet-57', 'r2r-town-13', 'r2r-town-18', 'r2s-under_siege-city-1',
    'r2s-politically_fractured-hamlet-0', 'r2s-infiltrated-town-1', 'r2s-wartime-city-3'];
  const SHORT_MARKED = ['r2r-city-20', 'r2r-hamlet-27'];
  test('the nine towns and the two beside them, every seed collected', () => {
    let printedOnTab = 0;
    expectNoSeedFailures(collectSeedFailures([...VENTURE_ONLY, ...SHORT_MARKED], (seed) => {
      const t = generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
      const vm = buildViewModel({ settlement: t });
      const props = { settlement: t, narrativeMode: false, vm, stateProse: null };
      const instTab = (render(React.createElement(InstitutionsTab, { settlement: t })).container.textContent || '').includes(SUPPLIED_LINE);
      cleanup();
      const svcTab = (render(React.createElement(ServicesTab, { services: t.availableServices, settlement: t, narrativeNote: null })).container.textContent || '').includes(SUPPLIED_LINE);
      cleanup();
      if (instTab || svcTab) printedOnTab++;
      /** @type {string[]} */ const inst = [], svc = [];
      walk(Institutions(props), inst, []); walk(Services(props), svc, []);
      expect({ institutions: inst.some((l) => l.includes(SUPPLIED_LINE)), services: svc.some((l) => l.includes(SUPPLIED_LINE)) }, `${seed}: the PDF's chapters / the tabs`)
        .toEqual({ institutions: instTab, services: svcTab });
      if (VENTURE_ONLY.includes(seed)) expect({ instTab, svcTab }, `${seed}: anchored: neither tab prints it (M3)`).toEqual({ instTab: false, svcTab: false });
    }), 'the M3 towns');
    expect(printedOnTab, 'the towns whose tab prints the sentence over a short mark').toBeGreaterThanOrEqual(1);
  }, 900000);
});

describe('PDF-2b item 4: the journal\'s chain row reads the record of its own row, never the next by index', () => {
  // A CONSTRUCTED RECORD (rule N7: no town of the 720, the 150 or the thirty holds a chain with no print label, so the view
  // model drops none): a town's chains with a chain of no label put first, whose tab card's word is not the first printed
  // row's. The view model drops it (`viewModelBodySlices.js`, UPKEEP-14 (j)); paired by bare index, the journal's first row
  // took its word.
  test('every journal chain row of the constructed towns says its own chain\'s word', () => {
    let built = 0;
    expectNoSeedFailures(collectSeedFailures(['r2s-under_siege-village-0', 'r2r-thorp-41', 'r2r-village-8'], (seed) => {
      const base = town(seed).t;
      const chains = base.economicState.activeChains;
      const first = chains.find((/** @type {any} */ c) => chainPrintName(c, base).label);
      const want = tabWord(tabCard(base, first));
      const dropped = ['impaired', 'vulnerable', 'running', 'operational'].map((status) => ({ ...first, label: '', status }))
        .find((c) => tabWord(tabCard(base, c)) !== want);
      expect(dropped, `${seed}: anchored: a chain of no label whose word is not the first row's`).toBeTruthy();
      const t = { ...base, economicState: { ...base.economicState, activeChains: [dropped, ...chains] } };
      expect(String(chainPrintName(dropped, t).label ?? ''), `${seed}: anchored: the chain prints no name`).toBe('');
      built++;
      const md = (buildJournalPages(buildViewModel({ settlement: t }), { settlement: t }).find((p) => p.name === 'Economics & Trade') || { markdown: '' }).markdown;
      /** @type {string[]} */ const bad = [];
      const rows = (md.split('## Supply chains')[1] || '').split('\n## ')[0].split('\n').filter((r) => r.startsWith('- **'));
      expect(rows.length, `${seed}: anchored: the journal prints the named chains`).toBe(chains.filter((/** @type {any} */ c) => chainPrintName(c, t).label).length);
      for (const l of rows) {
        const m = /^- \*\*(.+?)\*\*(?: \*\(([^)]*)\)\*)?/.exec(l); if (!m) continue;
        const rec = chains.find((/** @type {any} */ c) => esc(chainPrintName(c, t).label) === m[1]);
        if (!rec) { bad.push(`${m[1]}: a row of no chain`); continue; }
        if ((m[2] || '') !== tabWord(tabCard(t, rec)).toLowerCase()) bad.push(`${m[1]}: "${m[2] || ''}" / its own chain's "${tabWord(tabCard(t, rec))}"`);
      }
      expect(bad, seed).toEqual([]);
    }), 'the constructed towns');
    expect(built, 'the constructed towns').toBe(3);
  });
});

describe('PDF-2b item 4 (item 4 of the section): an income share\'s row in the PDF is the Economics tab\'s, its ordinary line under no mark', () => {
  test('every share, over the sample', () => {
    let twins = 0;
    expectNoSeedFailures(collectSeedFailures(SAMPLE, (seed) => {
      const x = town(seed); /** @type {string[]} */ const bad = [];
      for (const sh of x.vm.economics?.incomeSources || []) {
        const tab = clean(incomeDescShown(x.t, sh, ordinaryIncomeLineOf) || ''); // the tab's call (EconomicsTab.jsx: incomeDescShown(s, src, ordinaryIncomeLineOf))
        if (!tab) continue;
        if (tab !== clean(incomeDescShown(x.t, sh) || '')) twins++;
        if (!x.eco.some((l) => l.includes(tab))) bad.push(`${sh.source}: the tab's row "${tab}" not printed`);
      }
      expect(bad, seed).toEqual([]);
    }), 'every share of every town');
    expect(twins, 'the shares whose stored short twin the tab replaces with the trade\'s ordinary line').toBeGreaterThanOrEqual(3);
  });
});

describe('PDF-2: the negatives print none of these faults, and agree', () => {
  // PDF-2b item 5 (the chair, 2026-11-18): one plain test looping over the negatives, every seed through
  // `collectSeedFailures` (the law `sovereigntyLightingContract.walker.test.js`: no new file parked by `each`).
  test('every negative, each seed collected', () => {
    expectNoSeedFailures(collectSeedFailures(NEGATIVES, (seed) => {
      const x = town(seed);
      expect(x.cards.length, `${seed}: anchored: the PDF prints its chain cards`).toBeGreaterThan(0);
      const instNames = (x.t?.institutions || []).map((/** @type {any} */ i) => i?.name);
      for (const c of x.t?.economicState?.activeChains || []) {
        expect(chainHousesOf(c.processingInstitutions, instNames, { chain: tabCard(x.t, c), town: x.t }).length, `${seed} ${c.chainId}: a house the tab's card leaves off`).toBe(chainHousesOf(c.processingInstitutions, instNames).length);
        expect(String(tabCard(x.t, c)?.status), `${seed} ${c.chainId}: the tab's card`).toBe(String(chainAsShown(c, x.t)?.status));
      }
      expect(x.vm.resources?.nearbyProven || [], `${seed}: a proven ground`).toEqual([]);
    }), 'every negative');
  });
});
