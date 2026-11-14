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
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

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

/** Every chain whose state a surface prints otherwise than the tab, as "<surface> <chain>: <printed> / <tab>". @param {any} town */
const disagreements = (town) => {
  const vm = buildViewModel({ settlement: town });
  const chains = town.economicState.activeChains;
  const tab = chains.map((/** @type {any} */ c) => ({ label: chainPrintName(c, town).label, key: String(chainAsShown(c, town).status ?? ''), need: c.needKey || 'other', raw: c.status }));
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
    expect(md).not.toContain('*(entrepot)*');
    expect(disagreements(town)).toEqual([]);
  }, 120000);

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
