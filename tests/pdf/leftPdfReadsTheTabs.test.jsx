/** @vitest-environment jsdom */
/**
 * leftPdfReadsTheTabs.test.jsx — LEFT-PDF (BRIEF-LEFT, the sixth chair, 2026-11-17): THE PRINTED EXPORT AND THE FOUNDRY
 * JOURNAL READ WHAT THE TABS READ. A reader who prints a town meets no row the tab marks printed bare, and no list the tab
 * withholds. Over fixed towns of the census's 720 and the wide read's 150, each arm collects every failure:
 *   (L1)  every income share the PDF prints carries the Economics tab's mark, mark for mark
 *         (`economicsCrisisMarks.js :: incomeMarkShown`: its crisis half and its houses' short half; the row is
 *         `incomeDescShown`'s), and the journal's share names one word for each half; a share the tab leaves bare prints
 *         bare;
 *   (L2)  no PDF chain card that refuses its yield ("Normally yields") names an output the tab's card withholds
 *         (`economicsCrisisMarks.js :: chainOutputsOnCard`, ruling CY1): the Services chapter's flow line and the
 *         Economics chapter's flow rows;
 *   (L3)  every person page of the journal whose person's card on the tab prints its house's mark
 *         (`npcComponents.jsx :: houseMarkShown`, ruling CM1) prints it as its own line under the house line, and no other;
 *   (L19) the land list's view rows (the PDF's chapter and the journal read them) hold the Resources tab's grounds: the
 *         stored lists with the grounds the houses prove (`houseInputAtHand.js :: impliedGroundsOnPage`), a used-up ground
 *         under "Depleted", a proven one apart from the grounds of plenty; the journal prints them;
 *   (L29) the Outlook's list of impaired houses is one on the tab and in the PDF (`impairedListShown.js`, cured by
 *         BAR7-CARDS: this arm HOLDS it, and passes at the base).
 * Measured by the seat's probe at e0242a12a (base) over the 720: (L1) 29 towns in the PDF and 28 in the journal; (L2) 125;
 * (L3) 72; (L19) 172; (L29) 0. Over the 150 and the thirty (180 towns): 11, 11, 34, 35, 41, 0. At the seat's tip: 0 each.
 * A negative (towns that print no mark of these kinds) stands beside each positive anchor: the readings still agree.
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
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { buildJournalPages, esc } from '../../src/foundry/journalPages.js';
import { incomeMarkShown, incomeKindShown, incomeDescShown, chainOutputsOnCard, chainCardUnderSiege } from '../../src/domain/display/economicsCrisisMarks.js';
import { chainAsShown } from '../../src/domain/display/chainStateShown.js'; // PDF-2 (2026-11-17): the chain the tab's card renders
import { ordinaryIncomeLineOf } from '../../src/generators/economy/incomeLineSiblings.js'; // PDF-2b (2026-11-18): the Economics tab's own import
import { crisisMarkText, incomeShortOf, markedDescription, isVentureMark } from '../../src/domain/display/crisisStoppedRow.js';
import { chainOutputsShown } from '../../src/domain/display/tradeListDisplay.js';
import { houseMarkShown } from '../../src/components/new/npcComponents.jsx';
import { impliedGroundsOnPage } from '../../src/domain/facts/houseInputAtHand.js';
import { stressEffectsShown } from '../../src/domain/display/impairedListShown.js';
import { stressEffectsOf } from '../../src/domain/display/validationOnPage.js';
import { label } from '../../src/pdf/lib/format.js';
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
/** @param {any} node @param {string[]} acc @returns {string[]} */
const leaves = (node, acc = []) => {
  if (node == null || typeof node === 'boolean') return acc;
  if (typeof node === 'string' || typeof node === 'number') { acc.push(String(node)); return acc; }
  if (Array.isArray(node)) { for (const n of node) leaves(n, acc); return acc; }
  if (typeof node.type === 'function') return leaves(node.type(node.props), acc);
  return leaves(node.props?.children, acc);
};

/** The census's towns: a share marked short (r2r-hamlet-10, r2r-village-13, r2r-village-28), a siege's share and person
 *  marks and a used-up ground (r2s-under_siege-hamlet-3, -village-0), outputs a refused card withholds (r2s-infiltrated-village-0,
 *  r2r-town-1, r2r-town-16), a marked keeper (r2r-thorp-45), a used-up ground off the stored list (r2r-hamlet-23), a proven
 *  ground (r2r-hamlet-8), the Outlook's impaired list (r2s-under_siege-village-3, -town-0); r2r-village-0 a used-up ground off the stored
 *  list (FAULTS-BIRTH FR8 (c), its isolated smith's iron); r2r-village-1 a pasture its common proves (FR24 (2)); r2r-village-17 prints none. */
const CENSUS = ['r2r-hamlet-10', 'r2r-village-13', 'r2r-village-28', 'r2s-under_siege-hamlet-3', 'r2s-under_siege-village-0',
  'r2s-infiltrated-village-0', 'r2r-town-1', 'r2r-town-16', 'r2r-thorp-45', 'r2r-hamlet-23', 'r2r-hamlet-8',
  'r2s-under_siege-village-3', 'r2s-under_siege-town-0', 'r2r-village-0',
  'r2r-village-1', 'r2r-village-17']; // FAULTS-BIRTH (2026-11-18): the negatives re-keyed (below); r2r-village-0 now reads a ground used up off the stored list
/** The wide read's 150: a famine's share (bar0-village-famine-rand-36), proven grounds (bar0-hamlet-calm-rand-27,
 *  bar0-hamlet-under_siege-rand-29), the Outlook's list (bar0-hamlet-under_siege-rand-27, -34), a refused card's withheld
 *  output (bar0-town-calm-rand-30); bar0-village-calm-rand-28 prints none. */
const WIDE = ['bar0-village-famine-rand-36', 'bar0-hamlet-calm-rand-27', 'bar0-hamlet-under_siege-rand-29',
  'bar0-hamlet-under_siege-rand-27', 'bar0-hamlet-under_siege-rand-34', 'bar0-town-calm-rand-30', 'bar0-village-calm-rand-28',
  'bar0-village-calm-rand-30'];
const SAMPLE = [...CENSUS, ...WIDE];
/** The towns that print no mark of these kinds and no proven or used-up ground: the readings agree there too. */
// FAULTS-BIRTH (2026-11-18, R8: re-keyed by identity): r2r-village-0, on no road, now reads its smith's iron used up under Depleted
// (FR8 (c)); the same negative on r2r-village-1, which prints none of these marks
// FAULTS-BIRTH FR24 (2) (2026-11-18, R8: re-keyed by identity again): r2r-village-1 and bar0-village-calm-rand-28 now print the
// pasture their Common grazing land proves; the same negative on r2r-village-17 and bar0-village-calm-rand-30, which print none
const NEGATIVES = ['r2r-village-17', 'bar0-village-calm-rand-30'];

/** @type {Map<string, { t: any, vm: any, pdf: string[], svc: string[], journal: Array<{ name: string, markdown: string }> }>} */
const towns = new Map();
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of SAMPLE) {
    const t = generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
    const vm = buildViewModel({ settlement: t });
    const props = { settlement: t, narrativeMode: false, vm, stateProse: null };
    towns.set(seed, { t, vm, pdf: leaves(EconomicsTrade(props)), svc: leaves(Services(props)), journal: buildJournalPages(vm, { settlement: t }) });
  }
}, 900000);
/** Every element under a react(-pdf) tree that matches, function components executed. @param {any} node @param {(n: any) => boolean} pred @param {any[]} acc @returns {any[]} */
const findEls = (node, pred, acc = []) => {
  if (node == null || typeof node !== 'object') return acc;
  if (Array.isArray(node)) { for (const n of node) findEls(n, pred, acc); return acc; }
  if (pred(node)) acc.push(node);
  if (typeof node.type === 'function') return findEls(node.type(node.props), pred, acc);
  return findEls(node.props?.children, pred, acc);
};
/** @param {string} seed */
const town = (seed) => /** @type {{ t: any, vm: any, pdf: string[], svc: string[], journal: Array<{ name: string, markdown: string }> }} */ (towns.get(seed));
/** @param {{ journal: Array<{ name: string, markdown: string }> }} x @param {string} name */
const page = (x, name) => (x.journal.find((p) => p.name === name) || { markdown: '' }).markdown;
/** A leaf that reads as a mark set before this description ("Stopped by the siege. <desc>"). @param {string} l @param {string} desc */
const markedLeaf = (l, desc) => desc !== '' && l !== desc && l.endsWith(` ${desc}`) && /\.$/.test(l.slice(0, -desc.length - 1)) && l.length - desc.length <= 80;
/** @param {Iterable<string>} xs */
const sorted = (xs) => JSON.stringify([...new Set(xs)].sort());

describe('LEFT-PDF L1: an income share is marked in the PDF and the journal as the Economics tab marks it', () => {
  test('mark for mark, over the sample', () => {
    let marked = 0, short = 0;
    expectNoSeedFailures(collectSeedFailures(SAMPLE, (seed) => {
      const x = town(seed);
      const lines = (page(x, 'Economics & Trade').split('## Income')[1] || '').split('\n').filter((l) => l.startsWith('- '));
      /** @type {string[]} */ const bad = [];
      (x.vm.economics.incomeSources || []).forEach((/** @type {any} */ s, /** @type {number} */ i) => {
        const mark = incomeMarkShown(x.t, s);
        const desc = typeof s.desc === 'string' ? s.desc.trim() : '';
        if (mark) {
          marked++;
          if (!x.pdf.includes(markedDescription(mark, desc))) bad.push(`PDF ${s.source}: the tab's "${mark}" not printed`);
        } else if (x.pdf.some((l) => markedLeaf(l, desc))) bad.push(`PDF ${s.source}: a mark the tab does not print`);
        // the row as the tab's function gives it (its mark before the record's text). RE-KEYED BY IDENTITY (PDF-2b item 4,
        // 2026-11-18; rule R8): the tab's call is `incomeDescShown(s, src, ordinaryIncomeLineOf)` (EconomicsTab.jsx), a stored
        // short twin under no mark printing the trade's ordinary line; the PDF now reads it so, and the claim is kept.
        const row = incomeDescShown(x.t, s, ordinaryIncomeLineOf);
        if (row && !x.pdf.includes(row)) bad.push(`PDF ${s.source}: the tab's row "${row}" not printed`);
        // the journal: one word for each half of the tab's mark, after the share's name
        const halves = [crisisMarkText(x.t, incomeKindShown(x.t, s)), incomeShortOf(x.t, s)].filter(Boolean).length;
        if (incomeShortOf(x.t, s) !== null) short++;
        const m = new RegExp(`^- ${escapeRe(esc(label(s.source) || s.source))}(?: \\(([^)]+)\\))?: \\d+%$`).exec(lines[i] || '');
        if (!m) { bad.push(`journal ${s.source}: no line "${lines[i]}"`); return; }
        const words = m[1] ? m[1].split(', ') : [];
        if (words.length !== halves) bad.push(`journal ${s.source}: ${words.length} words for the tab's ${halves} marks ("${mark}")`);
        if (incomeShortOf(x.t, s) !== null && !isVentureMark(incomeShortOf(x.t, s)) && !words.includes('short')) bad.push(`journal ${s.source}: no "short" beside "${mark}"`);
      });
      expect(bad, seed).toEqual([]);
    }), 'every share of every town');
    expect(marked, 'the shares the tab marks in the sample').toBeGreaterThanOrEqual(5);
    expect(short, 'the shares marked short of their materials in the sample').toBeGreaterThanOrEqual(3);
  });
});

/** @param {string} s */
function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

describe('LEFT-PDF L2: no PDF chain card names an output the tab\'s card withholds', () => {
  test('the Services chapter\'s flow lines and the Economics chapter\'s flow rows, over the sample', () => {
    let withheldTowns = 0;
    expectNoSeedFailures(collectSeedFailures(SAMPLE, (seed) => {
      const x = town(seed);
      const withheld = new Set();
      // RE-KEYED BY IDENTITY (PDF-2 item 5, BRIEF-BAR8, 2026-11-17; rule R8): the tab's card hands `chainOutputsOnCard` the
      // chain it renders (`chainCardUnderSiege` over `chainAsShown`, EconomicsTab.jsx:119/169), not the stored chain; what it
      // withholds is read against the outputs of both; the claim and its form are kept.
      for (const c of x.t?.economicState?.activeChains || []) {
        const on = new Set(chainOutputsOnCard(chainCardUnderSiege(x.t, c, chainAsShown(c, x.t)), x.t));
        for (const o of [...chainOutputsShown(c, x.t), ...chainOutputsShown(chainAsShown(c, x.t), x.t)]) if (!on.has(o)) withheld.add(String(o).toLowerCase());
      }
      if (withheld.size) withheldTowns++;
      /** @type {string[]} */ const printed = [];
      // WIDENED (PDF-2b item 2, the chair's second reader's MED 1 (a), 2026-11-18): every output a card prints is read, a
      // refused card's ("Normally yields: …") and a bare one's: the Services card's flow line's last part, and each output
      // node of the Economics chapter's flow rows (`SupplyChainFlow.jsx :: ChainRow`, its `o-` keys). Before, only the text
      // after "Normally yields: " was read, so a card handed the stored chain (not refused, its outputs bare) went unread.
      for (const l of x.svc) { const parts = l.split(' » '); if (parts.length >= 2) printed.push(...parts[parts.length - 1].replace(/^Normally yields: /, '').split(', ')); }
      for (const n of findEls(EconomicsTrade({ settlement: x.t, narrativeMode: false, vm: x.vm, stateProse: null }), (m) => typeof m.key === 'string' && m.key.startsWith('o-'))) {
        printed.push(leaves(n).join('').replace(/^Normally yields: /, '').replace(/\s+EXPORT$/, ''));
      }
      expect(printed.filter((o) => withheld.has(String(o).toLowerCase())), `${seed}: outputs the tab's cards withhold`).toEqual([]);
    }), 'every card of every town');
    expect(withheldTowns, 'the towns where a tab card withholds an output').toBeGreaterThanOrEqual(4);
  });
});

describe('LEFT-PDF L3: the journal\'s person page prints the house\'s mark the tab\'s card prints, as its own line', () => {
  test('every person page, over the sample', () => {
    let markedPages = 0, pages = 0;
    expectNoSeedFailures(collectSeedFailures(SAMPLE, (seed) => {
      const x = town(seed);
      /** @type {string[]} */ const bad = [];
      for (const p of x.journal.filter((q) => q.name.startsWith('NPC — '))) {
        const npc = (x.t.npcs || []).find((/** @type {any} */ n) => n.name === p.name.slice(6));
        if (!npc) continue;
        pages++;
        const mark = houseMarkShown(npc, x.t);
        const rows = p.markdown.split('\n');
        const at = rows.findIndex((r) => r.startsWith('- **House:** '));
        const under = at >= 0 && /^ {2}- \*/.test(rows[at + 1] || '') ? rows[at + 1] : null;
        if (mark) { markedPages++; if (under !== `  - *${esc(mark)}*`) bad.push(`${npc.name}: the tab's "${mark}" printed as "${under}"`); }
        else if (under) bad.push(`${npc.name}: "${under}" where the tab's card prints no mark`);
      }
      expect(bad, seed).toEqual([]);
    }), 'every person page of every town');
    expect(pages, 'person pages read').toBeGreaterThanOrEqual(40);
    expect(markedPages, 'person pages whose house the tab marks').toBeGreaterThanOrEqual(5);
  });
});

describe('LEFT-PDF L19: the land list holds the Resources tab\'s grounds', () => {
  test('the view rows the PDF\'s chapter and the journal read, and the journal\'s print, over the sample', () => {
    let proven = 0, used = 0;
    expectNoSeedFailures(collectSeedFailures(SAMPLE, (seed) => {
      const x = town(seed);
      // the Resources tab's reading (ResourcesTab.jsx, "Nearby Resources"), line for line
      const cfg = x.t.config || {};
      const allRes = [...(cfg.nearbyResources || [])].sort();
      const implied = impliedGroundsOnPage(x.t);
      const depleted = [...new Set([...(cfg.nearbyResourcesDepleted || []), ...implied.used])].sort();
      const abundant = allRes.filter((rk) => !depleted.includes(rk));
      const there = implied.there.filter((rk) => !allRes.includes(rk));
      proven += there.length; used += implied.used.length;
      const r = x.vm.resources;
      expect({ abundant: sorted(r.nearbyAbundant || []), proven: sorted(r.nearbyProven || []), depleted: sorted(r.nearbyDepleted || []) }, seed)
        .toEqual({ abundant: sorted(abundant), proven: sorted(there), depleted: sorted(depleted) });
      const res = page(x, 'Resources & Production');
      const count = (/** @type {string} */ key) => { const m = new RegExp(`\\*\\*${key}:\\*\\* (.*)`).exec(res); return m ? m[1].split(', ').length : 0; };
      expect({ near: count('Nearby resources'), depleted: count('Depleted') }, `${seed}: the journal's rows`).toEqual({ near: abundant.length + there.length, depleted: depleted.length });
    }), 'every town');
    expect(proven, 'the grounds the houses prove in the sample').toBeGreaterThanOrEqual(3);
    expect(used, 'the grounds the houses tell used up in the sample').toBeGreaterThanOrEqual(2);
  });
});

describe('LEFT-PDF L29 (holds BAR7-CARDS item 3): the Outlook\'s impaired list is one on the tab and in the PDF', () => {
  test('over the sample', () => {
    let listed = 0;
    expectNoSeedFailures(collectSeedFailures(SAMPLE, (seed) => {
      const x = town(seed);
      const desc = (/** @type {any} */ i) => JSON.stringify(i?.description ?? null);
      const tab = stressEffectsShown(stressEffectsOf(x.t.economicViability || {}), x.t).map(desc);
      if (JSON.stringify(stressEffectsOf(x.t.economicViability || {})).includes('critically impaired by siege')) listed++;
      expect((x.vm.viability?.stressConsequences || []).map(desc), seed).toEqual(tab);
    }), 'every town');
    expect(listed, 'the towns whose record lists houses critically impaired by siege').toBeGreaterThanOrEqual(3);
  });
});

describe('LEFT-PDF: the negatives print none of these marks, and agree', () => {
  test('every negative town prints none of these marks', () => {
    expectNoSeedFailures(collectSeedFailures(NEGATIVES, (seed) => {
      const x = town(seed);
      expect((x.vm.economics.incomeSources || []).filter((/** @type {any} */ s) => incomeMarkShown(x.t, s) !== null), 'a share the tab marks').toEqual([]);
      expect(impliedGroundsOnPage(x.t), 'a ground the houses prove or tell used up').toEqual({ there: [], used: [] });
      expect(x.journal.filter((p) => p.name.startsWith('NPC — ') && /\n {2}- \*/.test(p.markdown)).map((p) => p.name), 'a person page with a house mark').toEqual([]);
    }), 'every negative town prints none of these marks, and agrees');
  });
});
