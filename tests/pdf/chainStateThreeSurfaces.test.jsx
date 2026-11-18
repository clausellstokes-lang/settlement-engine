/** @vitest-environment jsdom */
/**
 * chainStateThreeSurfaces.test.jsx — SURFACES-1 item 1 (LV-CHAINSTATE-PDF, LV-RUNNING-JOURNAL): A CHAIN'S STATE IS ONE
 * FACT ON THE TAB, THE PDF AND THE FOUNDRY JOURNAL.
 *
 * The Economics tab's chain card prints the state a crisis in force leaves (`domain/display/chainStateShown.js ::
 * chainAsShown`) in its chip's words (`EconomicsTab.jsx :: FLOW_STATUS`). The PDF's chain cards
 * (`pdf/sections/Services.jsx`) printed the record's stored state ("Active" on a grain chain beside "Field work and
 * trade have stopped", r2r-hamlet-0), its flow (`pdf/sections/SupplyChainFlow.jsx`) coloured and counted by it ("K
 * impaired" headers), and the journal printed the stored key ("*(entrepot)*"). Each now reads
 * `pdf/lib/chainStateOnPage.js` (the tab's reader, the tab's words). Births in the app's own shape (the census's 720,
 * SECOND-WAVE-CENSUS/births.mjs, the r2r- arm): a siege in the smallest and the largest size it reaches here, a famine,
 * an occupation, a chain with no state, and a guard town where the three already agreed.
 */
import { beforeAll, describe, expect, test, vi } from 'vitest';

vi.mock('../../src/store/index.js', () => {
  const data = { campaigns: [] };
  function useStore(selector) { return selector(data); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => data;
  return { useStore, default: useStore };
});

import { FLOW_STATUS } from '../../src/components/new/tabs/EconomicsTab.jsx';
import { Services } from '../../src/pdf/sections/Services.jsx';
import { EconomicsTrade } from '../../src/pdf/sections/EconomicsTrade.jsx';
import { StatusCard } from '../../src/pdf/primitives/Visuals.jsx';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { CHAIN_STATE_WORDS } from '../../src/pdf/lib/chainStateOnPage.js';
import { buildJournalPages } from '../../src/foundry/journalPages.js';
import { chainAsShown } from '../../src/domain/display/chainStateShown.js';
import { chainPrintName } from '../../src/domain/display/chainPrintName.js';
import { chainOutputsShown } from '../../src/domain/display/tradeListDisplay.js';
import { chainOutputsOnCard, chainCardUnderSiege } from '../../src/domain/display/economicsCrisisMarks.js'; // LEFT-PDF L2 (2026-11-17): the tab card's reading; PDF-2 (2026-11-17): the chain the tab's card renders
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

/** @param {string} seed */
const birth720 = (seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^r2r-(\w+)-\d+$/));
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, tradeRouteAccess: 'random_trade', culture: 'random_culture',
    monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true,
    magicExists: true, contentProfile: 'grounded', settType: m[1] }), null, { seed, customContent: {} });
};
/** Every element under a react(-pdf) tree, function components executed. @param {any} node @param {(n: any) => boolean} pred @param {any[]} acc */
const find = (node, pred, acc = []) => {
  if (node == null || typeof node !== 'object') return acc;
  if (Array.isArray(node)) { for (const n of node) find(n, pred, acc); return acc; }
  if (pred(node)) acc.push(node);
  if (typeof node.type === 'function') return find(node.type(node.props), pred, acc);
  return find(node.props?.children, pred, acc);
};
/** @param {any} node @param {string[]} acc @returns {string[]} */
const leaves = (node, acc = []) => {
  if (node == null || typeof node === 'boolean') return acc;
  if (typeof node === 'string' || typeof node === 'number') { acc.push(String(node)); return acc; }
  if (Array.isArray(node)) { for (const n of node) leaves(n, acc); return acc; }
  if (typeof node.type === 'function') return leaves(node.type(node.props), acc);
  return leaves(node.props?.children, acc);
};
/** The tab's chip word, its glyph struck. @param {string} key */
const tabWord = (key) => (key === '' ? '' : /** @type {Record<string, {label: string}>} */ (FLOW_STATUS)[key]?.label ?? FLOW_STATUS.operational.label).replace(/^[✓✦○]\s*/, '');

/** The chain the tab's card renders (`EconomicsTab.jsx :: chains`: `chainCardUnderSiege` over `chainAsShown`). @param {any} c @param {any} town */
const tabCard = (c, town) => chainCardUnderSiege(town, c, chainAsShown(c, town));
/** Every chain whose state a surface prints otherwise than the tab, as "<surface> <chain>: <printed> / <tab>". RE-KEYED BY
 * IDENTITY (PDF-2 item 6, BRIEF-BAR8, 2026-11-17; rule R8): "the tab" is the chain its card really renders (`tabCard`:
 * the card's word under a crisis that marks every house of the chain, EconomicsTab.jsx:119), not `chainAsShown` beneath it;
 * the claim and its form are kept. @param {any} town */
const disagreements = (town) => {
  const vm = buildViewModel({ settlement: town });
  const chains = town.economicState.activeChains;
  const tab = chains.map((/** @type {any} */ c) => ({ label: chainPrintName(c, town).label, key: String(tabCard(c, town).status ?? ''), need: c.needKey || 'other', raw: c.status }));
  const byLabel = new Map(tab.map((/** @type {any} */ t) => [t.label, t]));
  /** @type {string[]} */ const out = [];
  for (const card of find(Services({ settlement: town, narrativeMode: false, vm, stateProse: null }), (n) => n.type === StatusCard)) {
    const t = byLabel.get(card.props.name); if (!t) continue;
    if ((card.props.statusLabel || '') !== tabWord(t.key)) out.push(`card ${card.props.name}: ${card.props.statusLabel} / ${tabWord(t.key)}`);
  }
  const et = EconomicsTrade({ settlement: town, narrativeMode: false, vm, stateProse: null });
  for (const row of find(et, (n) => typeof n.type === 'function' && n.type.name === 'ChainRow')) {
    const t = byLabel.get(chainPrintName(row.props.chain, town).label); if (!t) continue;
    if (String(row.props.chain.status ?? '') !== t.key) out.push(`flow ${t.label}: ${row.props.chain.status} / ${t.key}`);
  }
  for (const g of find(et, (n) => typeof n.type === 'function' && n.type.name === 'CategoryGroup')) {
    const printed = +(leaves(g).join(' ').match(/· (\d+) impaired/)?.[1] ?? 0);
    const want = tab.filter((/** @type {any} */ t) => t.need === g.props.needKey && t.raw !== 'unexploited' && t.key === 'impaired').length;
    if (printed !== want) out.push(`header ${g.props.needKey}: ${printed} impaired / ${want}`);
  }
  const md = buildJournalPages(vm, { settlement: town }).find((p) => p.name === 'Economics & Trade')?.markdown || '';
  const lines = (md.split('## Supply chains')[1] || '').split('\n').filter((l) => l.startsWith('- **'));
  lines.forEach((l, i) => { const st = l.match(/^- \*\*.*?\*\*(?: \*\((.*?)\)\*)?/)?.[1] ?? ''; if (st !== tabWord(tab[i].key).toLowerCase()) out.push(`journal #${i}: ${st} / ${tabWord(tab[i].key)}`); });
  return out;
};
/** SURFACES-1 item 2: every output a PDF chain row or card prints that the tab's card does not (its first three), as
 * "<surface> <chain>: <output>". RE-KEYED BY IDENTITY (LEFT-PDF L2, 2026-11-17): the tab's card reads
 * `economicsCrisisMarks.js :: chainOutputsOnCard` (BAR7-ECON item 4, ruling CY1: a refused yield names no service on
 * offer), not `tradeListDisplay.js :: chainOutputsShown` beneath it; the claim and its form are kept. @param {any} town */
const outputDisagreements = (town) => {
  const vm = buildViewModel({ settlement: town });
  const f = (/** @type {unknown} */ x) => String(x).toLowerCase().trim();
  // RE-KEYED BY IDENTITY (PDF-2 item 5, BRIEF-BAR8, 2026-11-17; rule R8): the tab's card hands `chainOutputsOnCard` the chain it
  // renders (`tabCard`), not the stored chain; the claim and its form are kept.
  const tab = new Map(town.economicState.activeChains.map((/** @type {any} */ c) => [chainPrintName(c, town).label, chainOutputsOnCard(tabCard(c, town), town).slice(0, 3).map(f)]));
  /** @type {string[]} */ const out = [];
  for (const row of find(EconomicsTrade({ settlement: town, narrativeMode: false, vm, stateProse: null }), (n) => typeof n.type === 'function' && n.type.name === 'ChainRow')) {
    const label = chainPrintName(row.props.chain, town).label; const want = tab.get(label) || [];
    const printed = find(row.type(row.props), (m) => typeof m.key === 'string' && m.key.startsWith('o-')).map((m) => f(leaves(m).join('').replace(/^Normally yields: /, '').replace(/\s+EXPORT$/, '')));
    for (const o of printed) if (!want.includes(o)) out.push(`flow ${label}: ${o}`);
  }
  for (const card of find(Services({ settlement: town, narrativeMode: false, vm, stateProse: null }), (n) => n.type === StatusCard)) {
    const want = tab.get(card.props.name) || []; const segs = String(card.props.description || '').split(' \u00bb ');
    if (want.length === 0 || segs.length < 2) continue;
    for (const o of segs[segs.length - 1].replace(/^Normally yields: /, '').split(', ').map(f)) if (!want.includes(o)) out.push(`card ${card.props.name}: ${o}`);
  }
  return out;
};
/** @param {any} town @param {string} label */
const cardOf = (town, label) => find(Services({ settlement: town, narrativeMode: false, vm: buildViewModel({ settlement: town }), stateProse: null }), (n) => n.type === StatusCard)
  .find((n) => n.props.name === label)?.props;

describe('a chain\'s state is one fact on the tab, the PDF and the journal (SURFACES-1 item 1)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('the PDF\'s words are the tab\'s chip words, every state', () => {
    for (const [key, word] of Object.entries(CHAIN_STATE_WORDS)) expect(word, key).toBe(tabWord(key));
    expect(Object.keys(CHAIN_STATE_WORDS).sort()).toEqual(Object.keys(FLOW_STATUS).sort());
  });

  test('under a siege the card, the flow and the journal say Impaired where the tab does (r2r-hamlet-0, r2r-metropolis-14)', () => {
    const rows = ['r2r-hamlet-0', 'r2r-metropolis-14'].map((seed) => ({ seed, out: disagreements(birth720(seed)) }));
    const hamlet = birth720('r2r-hamlet-0');
    const grain = hamlet.economicState.activeChains.find((/** @type {any} */ c) => chainPrintName(c, hamlet).label === 'Grain & Bread');
    expect(grain?.status, 'anchored: the record stores the calm state').toBe('running');
    expect(cardOf(hamlet, 'Grain & Bread')?.statusLabel).toBe('Impaired');
    expect(rows).toEqual([{ seed: 'r2r-hamlet-0', out: [] }, { seed: 'r2r-metropolis-14', out: [] }]);
  }, 180000);

  test('under a famine that failed a chain\'s ground (r2r-hamlet-16, r2r-city-44)', () => {
    const rows = ['r2r-hamlet-16', 'r2r-city-44'].map((seed) => ({ seed, out: disagreements(birth720(seed)) }));
    expect(rows).toEqual([{ seed: 'r2r-hamlet-16', out: [] }, { seed: 'r2r-city-44', out: [] }]);
  }, 180000);

  test('under an occupation the journal prints the tab\'s word, never the stored key (r2r-thorp-1)', () => {
    const town = birth720('r2r-thorp-1');
    const md = buildJournalPages(buildViewModel({ settlement: town }), { settlement: town }).find((p) => p.name === 'Economics & Trade')?.markdown || '';
    expect(town.economicState.activeChains.some((/** @type {any} */ c) => c.status === 'entrepot'), 'anchored: an entrepôt chain').toBe(true);
    expect(md).toContain('*(entrepôt)*');
    expectAbsentWithAnchor(md, '*(entrepot)*', '*(entrepôt)*', 'the journal prints the tab word');
    expect(disagreements(town)).toEqual([]);
  }, 120000);

  test('the outputs the PDF\'s flow and cards print are the tab card\'s (SURFACES-1 item 2): a parish service with no church, a siege, a famine, the guard town', () => {
    // PDF-2b item 3 (the chair's second reader's MED 1 (b), 2026-11-18): four towns added whose cards hold an output the tab's
    // card withholds (PDF-2's item 5 at its base: r2r-village-8 "Milled lumber", r2r-village-17 "Charcoal", r2r-village-25
    // "Quality tools and weapons"; r2r-thorp-38, a refused forage card); the five above held none.
    const seeds = ['r2r-thorp-0', 'r2r-hamlet-0', 'r2r-hamlet-16', 'r2r-metropolis-14', 'r2r-city-0', 'r2r-village-8', 'r2r-village-17', 'r2r-village-25', 'r2r-thorp-38'];
    const thorp = birth720('r2r-thorp-0');
    const faith = thorp.economicState.activeChains.find((/** @type {any} */ c) => chainPrintName(c, thorp).label === 'Faith & Worship');
    expect(faith?.outputs, 'anchored: the record stores the parish outputs').toContain('Religious services');
    expect(chainOutputsShown(faith, thorp), 'anchored: the tab prints none (no church here)').toEqual([]);
    expect(seeds.map((seed) => ({ seed, out: outputDisagreements(birth720(seed)) }))).toEqual(seeds.map((seed) => ({ seed, out: [] })));
    const city = birth720('r2r-city-0');
    const printed = find(EconomicsTrade({ settlement: city, narrativeMode: false, vm: buildViewModel({ settlement: city }), stateProse: null }), (m) => typeof m.key === 'string' && m.key.startsWith('o-'));
    expect(printed.length, 'the guard: the flow still prints the outputs the tab prints').toBeGreaterThan(10);
  }, 180000);

  test('a chain run only through a neighbour\'s house prints no state on the card (r2r-thorp-0); the guard town agrees whole (r2r-city-0)', () => {
    const thorp = birth720('r2r-thorp-0');
    const faith = cardOf(thorp, 'Faith & Worship');
    expect(faith, 'anchored: the card prints').toBeTruthy();
    expect(faith?.statusLabel).toBe('');
    expect(disagreements(thorp)).toEqual([]);
    const city = birth720('r2r-city-0');
    expect(disagreements(city)).toEqual([]);
    const words = city.economicState.activeChains.map((/** @type {any} */ c) => cardOf(city, chainPrintName(c, city).label)?.statusLabel);
    expect(words, 'the guard: working chains still print a working word').toContain('Running');
  }, 180000);
});
