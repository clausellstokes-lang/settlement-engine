/** @vitest-environment jsdom */
/**
 * resourceChainsLikeTheTab.test.jsx — EXPORTS-B3 (2026-11-14; the measure EXPORTS-MEASURE-1 B3, the chair's ruling: candidate
 * A with the tab's word "Needs:"): THE EXPORT'S RESOURCE ROW PRINTS WHAT THE TAB'S CARD PRINTS.
 *
 * The PDF's RESOURCE CHAINS table (`pdf/sections/ResourcesProduction.jsx`) and the Foundry journal's Exploitation table
 * (`foundry/journalPages.js :: resourcesPage`) both read `pdf/lib/viewModelBodySlices.js :: resourcesSlice`'s `chainRows`. A
 * worked row printed the catalogue's processing houses and final products whole, so a thorp of nineteen with a shepherd
 * collective read "Livestock | full | Butcher, Tannery, Dairy farmer | leather goods, cheese, preserved meat" (r2r-thorp-14),
 * and a hamlet under siege "Mill, Bakers, Access to external mill" with neither (r2r-hamlet-0): 310 of the census's 720 towns
 * named a house the roster lacks. The Resources tab's card (`components/new/tabs/ResourcesTab.jsx :: ResourceChainCard`)
 * prints neither houses nor goods for a worked resource; an Unexploited card prints its first two goods and, under the word
 * "Needs:", the houses the live roster still lacks (`validationOnPage.js :: housesStillNeeded`).
 *
 * The guard: every house and every good a row prints on the PDF and on the journal is printed on the tab's card for the
 * same resource at the same grade (the card rendered here, as the tab renders it), and an Unexploited row's houses print
 * under "Needs:". Births in the app's own shape (the census's 720, the r2r- arm): the measure's towns, a siege in the
 * smallest and the largest size it reaches here, a famine, and the keep-guards (a town whose apothecary and alchemist
 * stand prints its worked herbs row still; a thorp lacking both prints them still, under "Needs:").
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

import { ResourceChainCard } from '../../src/components/new/tabs/ResourcesTab.jsx';
import { ResourcesProduction } from '../../src/pdf/sections/ResourcesProduction.jsx';
import { ChainRow } from '../../src/pdf/primitives/Visuals.jsx';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { buildJournalPages } from '../../src/foundry/journalPages.js';
import { exploitationGroupsShown } from '../../src/domain/display/validationOnPage.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

/** @type {Map<string, any>} */
const born = new Map();
/** The census's 720, the r2r- arm (SECOND-WAVE-CENSUS/births.mjs), each town born once for the file. @param {string} seed */
const birth720 = (seed) => {
  if (born.has(seed)) return born.get(seed);
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^r2r-(\w+)-\d+$/));
  const town = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, tradeRouteAccess: 'random_trade', culture: 'random_culture',
    monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true,
    magicExists: true, contentProfile: 'grounded', settType: m[1] }), null, { seed, customContent: {} });
  born.set(seed, town);
  return town;
};
/** Every element under a react(-pdf) tree, function components executed. @param {any} node @param {(n: any) => boolean} pred @param {any[]} acc */
const find = (node, pred, acc = []) => {
  if (node == null || typeof node !== 'object') return acc;
  if (Array.isArray(node)) { for (const n of node) find(n, pred, acc); return acc; }
  if (pred(node)) acc.push(node);
  if (typeof node.type === 'function') return find(node.type(node.props), pred, acc);
  return find(node.props?.children, pred, acc);
};
const low = (/** @type {unknown} */ x) => String(x ?? '').toLowerCase().trim();
const NEEDS = /^Needs: /;

/** What the tab's card prints for each resource at each grade, as the tab renders it: its "Needs:" houses and every other
 * word it shows (its goods among them). @param {any} town */
const tabCards = (town) => {
  /** @type {Map<string, { needs: string[], words: Set<string> }>} */
  const out = new Map();
  const shown = exploitationGroupsShown(town);
  for (const [stage, group] of Object.entries(shown)) for (const x of group) {
    const { container, unmount } = render(<ResourceChainCard chain={x.card} stage={stage}
      settlement={stage === 'unexploited' ? town : null} moved={stage === 'full' ? false : x.moved} />);
    const spans = [...container.querySelectorAll('span, div')].filter((e) => !e.children.length).map((e) => e.textContent || '');
    const needsLine = [...container.querySelectorAll('div')].map((d) => d.textContent || '').find((t) => NEEDS.test(t));
    unmount();
    const key = `${low(x.card.rawResource)}|${stage}`;
    const cur = out.get(key) || { needs: [], words: new Set() };
    if (needsLine) cur.needs.push(...needsLine.replace(NEEDS, '').split(', ').map(low));
    for (const t of spans) if (!NEEDS.test(t) && !/^Draws on: /.test(t)) cur.words.add(low(t));
    out.set(key, cur);
  }
  return out;
};

/** The PDF's chain rows as printed: [resource key, grade, houses cell, goods cell]. @param {any} town */
const pdfRows = (town) => {
  const vm = buildViewModel({ settlement: town });
  const rows = find(ResourcesProduction({ settlement: town, narrativeMode: false, vm, stateProse: null }), (n) => n.type === ChainRow);
  // The rows print in the chapter's group order; the slice's rows carry the resource's key, one to one by grade.
  const byGrade = (/** @type {string} */ g) => vm.resources.chainRows.filter((/** @type {any} */ c) => c.status === g);
  const keys = [...byGrade('full'), ...byGrade('partial'), ...byGrade('unexploited')];
  return rows.map((r, i) => ({ resource: low(keys[i]?.resource), grade: keys[i]?.status, houses: r.props.processing ?? null, goods: r.props.output ?? null }));
};
/** The journal's Exploitation rows as printed, each beside the slice row it prints. @param {any} town */
const journalRows = (town) => {
  const vm = buildViewModel({ settlement: town });
  const md = buildJournalPages(vm, { settlement: town }).find((p) => p.name === 'Resources & Production')?.markdown || '';
  const lines = (md.split('## Exploitation')[1] || '').split('\n').filter((l) => l.startsWith('| ') && !/^\| (Resource|---)/.test(l));
  // the journal's escapes struck (foundry-module/scripts/markdownEscape.js), so the cell reads as Foundry shows it
  const unesc = (/** @type {string} */ c) => c.replace(/\\(.)/g, '$1').replace(/&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim();
  return lines.map((l, i) => { const cells = l.split(' | ').map(unesc); const c = vm.resources.chainRows[i];
    return { resource: low(c?.resource), grade: c?.status, houses: cells[2] === '—' ? null : cells[2], goods: cells[3]?.replace(/ \|$/, '') === '—' ? null : cells[3]?.replace(/ \|$/, '') }; });
};

/** Every house or good a surface's row prints that the tab's card for that resource and grade does not, and every
 * Unexploited row whose houses print without the tab's word "Needs:". @param {any} town @param {'pdf'|'journal'} surface */
const notOnTheCard = (town, surface) => {
  const cards = tabCards(town);
  /** @type {string[]} */ const out = [];
  for (const r of (surface === 'pdf' ? pdfRows(town) : journalRows(town))) {
    const card = cards.get(`${r.resource}|${r.grade}`) || { needs: [], words: new Set() };
    if (r.houses) {
      if (r.grade === 'unexploited' && !NEEDS.test(r.houses)) out.push(`${r.resource} ${r.grade}: houses without "Needs:": ${r.houses}`);
      for (const h of String(r.houses).replace(NEEDS, '').split(', ')) if (!card.needs.includes(low(h))) out.push(`${r.resource} ${r.grade}: house ${h}`);
    }
    if (r.goods) for (const g of String(r.goods).split(', ')) if (!card.words.has(low(g))) out.push(`${r.resource} ${r.grade}: good ${g}`);
  }
  return out;
};
/** The houses and goods off the card (the label's arm is its own). @param {any} town @param {'pdf'|'journal'} surface */
const factsOffTheCard = (town, surface) => notOnTheCard(town, surface).filter((l) => !/without "Needs:"/.test(l));
/** The Unexploited rows whose houses print without "Needs:". @param {any} town @param {'pdf'|'journal'} surface */
const unlabelled = (town, surface) => notOnTheCard(town, surface).filter((l) => /without "Needs:"/.test(l));

afterEach(cleanup);

describe('the export\'s resource row prints what the tab\'s card prints (EXPORTS-B3, candidate A with "Needs:")', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('the PDF: a thorp of nineteen with a full livestock card prints no Butcher, Tannery or Dairy farmer, and no goods (r2r-thorp-14)', () => {
    const town = birth720('r2r-thorp-14');
    expect(town.institutions.map((/** @type {any} */ i) => i.name), 'anchored: no butcher, tannery or dairy here').not.toEqual(
      expect.arrayContaining([expect.stringMatching(/butcher|tanner|dairy/i)]));
    expect(pdfRows(town).some((r) => r.resource === 'livestock' && r.grade === 'full'), 'anchored: the worked row prints').toBe(true);
    expect(factsOffTheCard(town, 'pdf').filter((l) => / full: /.test(l))).toEqual([]);
  }, 180000);

  test('the journal: the same thorp\'s worked row (r2r-thorp-14)', () => {
    const town = birth720('r2r-thorp-14');
    expect(journalRows(town).some((r) => r.resource === 'livestock' && r.grade === 'full'), 'anchored: the worked row prints').toBe(true);
    expect(factsOffTheCard(town, 'journal').filter((l) => / full: /.test(l))).toEqual([]);
  }, 180000);

  test('under a siege: a hamlet\'s grain names no mill and no bakers it lacks, on the PDF and the journal (r2r-hamlet-0); the largest size (r2r-metropolis-14)', () => {
    const rows = ['r2r-hamlet-0', 'r2r-metropolis-14'].map((seed) => ({ seed, pdf: factsOffTheCard(birth720(seed), 'pdf'), journal: factsOffTheCard(birth720(seed), 'journal') }));
    expect(rows).toEqual([{ seed: 'r2r-hamlet-0', pdf: [], journal: [] }, { seed: 'r2r-metropolis-14', pdf: [], journal: [] }]);
  }, 180000);

  test('under a famine (r2r-hamlet-16, r2r-city-44)', () => {
    const rows = ['r2r-hamlet-16', 'r2r-city-44'].map((seed) => ({ seed, pdf: factsOffTheCard(birth720(seed), 'pdf'), journal: factsOffTheCard(birth720(seed), 'journal') }));
    expect(rows).toEqual([{ seed: 'r2r-hamlet-16', pdf: [], journal: [] }, { seed: 'r2r-city-44', pdf: [], journal: [] }]);
  }, 180000);

  test('an Unexploited row prints its houses under the tab\'s word "Needs:", on the PDF and the journal (r2r-thorp-14\'s hides; r2r-city-44\'s stone; r2r-thorp-0\'s herbs)', () => {
    const town = birth720('r2r-thorp-14');
    const pdf = pdfRows(town).find((r) => r.resource === 'animal hides');
    const jnl = journalRows(town).find((r) => r.resource === 'animal hides');
    expect([pdf?.grade, jnl?.grade], 'anchored: the hides row prints Unexploited').toEqual(['unexploited', 'unexploited']);
    expect(pdf?.houses).toBe("Needs: Tannery, Leatherworkers' guild");
    expect(jnl?.houses).toBe("Needs: Tannery, Leatherworkers' guild");
    expect(['r2r-thorp-14', 'r2r-city-44', 'r2r-thorp-0'].flatMap((seed) => [...unlabelled(birth720(seed), 'pdf'), ...unlabelled(birth720(seed), 'journal')])).toEqual([]);
  }, 180000);

  test('an Unexploited row prints only the houses and the first two goods its tab card prints (r2r-thorp-14\'s hides: four goods in the catalogue)', () => {
    const town = birth720('r2r-thorp-14');
    expect(pdfRows(town).find((r) => r.resource === 'animal hides')?.goods).toBe('boots, armor');
    expect(journalRows(town).find((r) => r.resource === 'animal hides')?.goods).toBe('boots, armor');
    expect([...factsOffTheCard(town, 'pdf'), ...factsOffTheCard(town, 'journal')].filter((l) => / unexploited: /.test(l))).toEqual([]);
  }, 180000);

  test('the keep-guards: a town whose apothecary and alchemist stand still prints its worked herbs row (r2r-town-1); a thorp lacking both still names them, under "Needs:" (r2r-thorp-0)', () => {
    const town = birth720('r2r-town-1');
    const want = { resource: 'medicinal herbs', grade: 'full' };
    expect(pdfRows(town).filter((r) => r.resource === want.resource).map((r) => r.grade)).toEqual([want.grade]);
    expect(journalRows(town).filter((r) => r.resource === want.resource).map((r) => r.grade)).toEqual([want.grade]);
    const thorp = birth720('r2r-thorp-0');
    for (const r of [...pdfRows(thorp), ...journalRows(thorp)].filter((x) => x.resource === 'medicinal herbs')) {
      expect(r.grade).toBe('unexploited');
      expect(String(r.houses).replace(NEEDS, '')).toBe('Apothecary, Alchemist shop');
      expect(low(r.goods)).toBe('healing potions, antidotes');
    }
    expect([...factsOffTheCard(thorp, 'pdf'), ...factsOffTheCard(thorp, 'journal')]).toEqual([]);
  }, 180000);
});
