/** @vitest-environment jsdom */
/**
 * cultureBlockTwoSurfaces.test.jsx — EXPORTS-B24 · B2 (the chair's ruling on EXPORTS-MEASURE-1 B2): THE CULTURE BLOCK
 * OF THE PDF AND THE FOUNDRY JOURNAL.
 *
 * The PDF's CULTURAL IDENTITY (`pdf/sections/IdentityDailyLife.jsx`) printed the culture profile's raw fields in the
 * present tense of the place ("A ritual plaza at the centre, tribute coming in, and waterworks and gardens around it"
 * in a thorp of eleven, r2r-thorp-0), and the journal's Identity page its "Cultural notes". Ruled: (i) the scope line
 * prints through the tab's reader (`cultureScopeLine`); (ii) the six raw rows and the GENERATED notes print only in a
 * town or larger; (iii) there each row is held to its own declarations (r2r-town-6: "A lordly court…", which declares
 * `ruler: lord`, under an Arcane Council); (iv) the user's own notes print whole at every size. Births in the app's own
 * shape (the census's 720, SECOND-WAVE-CENSUS/births.mjs, the r2r- arm).
 */
import { beforeAll, describe, expect, test, vi } from 'vitest';

vi.mock('../../src/store/index.js', () => {
  const data = { campaigns: [] };
  function useStore(selector) { return selector(data); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => data;
  return { useStore, default: useStore };
});

import { IdentityDailyLife } from '../../src/pdf/sections/IdentityDailyLife.jsx';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { buildJournalPages, esc } from '../../src/foundry/journalPages.js';
import { foodwaysLineOf } from '../../src/domain/foodways.js';
import { cultureScopeLine } from '../../src/domain/summary/settlementQuickGuide.js';
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
/** @param {any} node @param {string[]} acc @returns {string[]} */
const leaves = (node, acc = []) => {
  if (node == null || typeof node === 'boolean') return acc;
  if (typeof node === 'string' || typeof node === 'number') { acc.push(String(node)); return acc; }
  if (Array.isArray(node)) { for (const n of node) leaves(n, acc); return acc; }
  if (typeof node.type === 'function') return leaves(node.type(node.props), acc);
  return leaves(node.props?.children, acc);
};
/** The six raw fields the ruling gates. */
const RAW = ['builtForm', 'civicPattern', 'exchangePattern', 'sacredLife', 'defensePattern', 'socialTexture'];
/** What the PDF's chapter and the journal's Identity page print of the culture. @param {any} town */
const printed = (town) => {
  const vm = buildViewModel({ settlement: town });
  const pdf = leaves(IdentityDailyLife({ settlement: town, narrativeMode: false, vm, stateProse: null }));
  const ci = pdf.indexOf('CULTURAL NOTES');
  const md = buildJournalPages(vm, { settlement: town }).find((p) => p.name === 'Identity & Daily Life')?.markdown || '';
  const c = town.culturalIdentity;
  return {
    pdf,
    rawRows: RAW.filter((f) => c[f] && pdf.includes(c[f])),
    notes: ci >= 0 ? pdf[ci + 1] : null,
    journalNotes: (md.split('\n').find((l) => l.startsWith('- **Cultural notes:**')) || null),
  };
};

describe('the culture block of the PDF and the journal (EXPORTS-B24 · B2)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test.each(['r2r-thorp-0', 'r2r-village-23'])('%s, a small place: no raw row, no generated notes; the scope line is the tab\'s', (seed) => {
    const town = birth720(seed);
    expect(['thorp', 'village'], 'anchored: a small place').toContain(town.tier);
    expect(RAW.every((f) => town.culturalIdentity[f]), 'anchored: the record holds the six raw rows').toBe(true);
    const p = printed(town);
    expect(p.rawRows).toEqual([]);
    expect(p.notes).toBe(null);
    expect(p.journalNotes).toBe(null);
    expect(cultureScopeLine(town), 'anchored: the tab prints a scope line').not.toBe('');
    expect(p.pdf, 'the scope line is the Overview\'s').toContain(cultureScopeLine(town));
    expect(p.pdf, 'the guard: the Foodways row still prints').toContain(foodwaysLineOf(town) || town.culturalIdentity.foodways);
  }, 180000);

  test('r2r-town-6, a town under an Arcane Council: the lordly-court row is not printed; its admitted rows are', () => {
    const town = birth720('r2r-town-6');
    expect(town.culturalIdentity.civicPattern, 'anchored: the row that declares ruler: lord').toMatch(/^A lordly court/);
    const p = printed(town);
    expect(p.rawRows).not.toContain('civicPattern');
    expect(p.rawRows.length, 'the guard: a town keeps its admitted rows').toBeGreaterThan(0);
  }, 180000);

  test('r2r-city-48, a city: the rows and the generated notes print, on the PDF and in the journal', () => {
    const town = birth720('r2r-city-48');
    const p = printed(town);
    expect(p.rawRows.length).toBeGreaterThanOrEqual(4);
    expect(p.notes).toBe(town.culturalNotes);
    expect(p.journalNotes).not.toBe(null);
  }, 180000);

  test.each(['r2r-thorp-0', 'r2r-town-6'])('%s: the notes the user wrote print whole, at every size', (seed) => {
    const town = birth720(seed);
    const own = 'The old mill-race floods every spring; the miller\'s family keeps the only boat.';
    town.culturalNotes = own;
    const p = printed(town);
    expect(p.notes).toBe(own);
    expect(p.journalNotes).toBe(`- **Cultural notes:** ${esc(own)}`);
  }, 180000);
});
