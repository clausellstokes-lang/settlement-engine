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
import { chainOutputsShown, exportsAsPrinted, localProductionAsPrinted } from '../../src/domain/display/tradeListDisplay.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

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
/** The census's and the reader's shapes (REVIEW-W2-C-LEAVES render.rr3s.jsx :: cfgFor: r2r, r2s, rr3). @param {string} seed */
const birthAny = (seed) => {
  if (seed.startsWith('rr3-')) {
    const m = /** @type {RegExpMatchArray} */ (seed.match(/^rr3-(\w+)-([a-z_+]+)-([a-z_]+)-\d+$/));
    return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...(m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] }), settType: m[1],
      selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} });
  }
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
    selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^r2r-(\w+)-\d+$/) || seed.match(/^r2s-(\w+)-(\w+)-\d+$/));
  const cfg = seed.startsWith('r2r-') ? { ...DEFAULT_CONFIG, ...dials, settType: m[1] }
    : { ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
};
/** W2-C-LEAVES-12 ruling (3), at f9db28270: a card's output no house of its row stands for (a Mine and master-crafted weapons;
 * a Thatcher and milled lumber; Docks and ship construction with no shipyard), the reader's [11] and its MEDIUM pills. */
const OUTPUT_SILENT = [['r2r-hamlet-6', 'iron', 'Master-crafted weapons'], ['r2r-hamlet-40', 'iron', 'Master-crafted weapons'],
  ['r2s-famine-town-0', 'iron', 'Master-crafted weapons'], ['r2s-slave_revolt-village-0', 'timber', 'Milled lumber'],
  ['r2r-town-4', 'harbour_trade', 'Ship construction']];
/** …and guards, where a house of the good's row stands: the output keeps printing. */
const OUTPUT_KEPT = [['r2r-village-28', 'iron', 'Master-crafted weapons'], ['r2r-town-8', 'iron', 'Master-crafted weapons']];

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

    // W2-C-LEAVES-12, the chair's ruling (3) (REVIEW-W2-C-LEAVES [11], HIGH): A GOOD WITH NO MAKER ROW IS NOT PRINTED BY
    // DEFAULT. The card's default read any house of the chain by its name's first word: "Outputs: Master-crafted weapons"
    // on an Iron & Metalwork card whose only house is a Mine (21 of 21). The unit:
    const iron = { chainId: 'iron', processingInstitutions: ['Mine (open cast)', 'Mine', 'Blacksmith'], resourceInputKey: 'iron_deposits',
      outputs: ['Quality tools and weapons', 'Master-crafted weapons', 'Widgets of no row'] };
    /** @param {string[]} houses */
    const held = (houses) => ({ name: 'Testford', institutions: houses.map((name) => ({ name })), economicState: { activeChains: [iron] } });
    expect(chainOutputsShown(iron, held(['Mine (open cast)'])), 'a mine forges no blade').toEqual([]);
    expect(chainOutputsShown(iron, held(['Blacksmith'])), 'a smith does; a good of no row is made by no house')
      .toEqual(['Quality tools and weapons', 'Master-crafted weapons']);
    // …and on the births: the card's outputs, a house of each good's own row standing (a famine town among them)
    expectNoSeedFailures(collectSeedFailures([...OUTPUT_SILENT, ...OUTPUT_KEPT], (row) => {
      const [seed, chainId, good] = row;
      const town = /** @type {any} */ (birthAny(seed));
      expect(chainOf(town, chainId)?.outputs, `${seed}: anchored, the record's ${chainId} outputs`).toContain(good);
      const shown = chainOutputsShown(chainOf(town, chainId), town);
      if (OUTPUT_SILENT.includes(row)) expect(shown, `${seed}: ${good} with no house that makes it`).not.toContain(good);
      else expect(shown, `${seed}: ${good} beside the house that makes it`).toContain(good);
    }), 'a card names a good no house of the town makes');
  }, 120000);

  // W2-C-LEAVES-13, the chair's ruling (r2) of 2026-11-14: TWO TRUE OUTPUTS GIVEN BACK THEIR MAKERS. The twelfth seat's maker
  // table silenced "Rare spices and exotic dyes" on every Spices & Dyes card (507 of the reader's 1,824 births: the merchants
  // carry them) and the bards' "Magical entertainment" (585). A line is in its pool unless the town makes it false: the spices
  // print where a house that carries them stands, through a table ONLY THE CARD reads (the Exports keep them as transit; the
  // local list never names them); the bards' good where a bardic college stands and magic works here.
  test('the spices print where their carriers stand, the exports still transit; the bards\' magic where a bardic college stands (r2)', () => {
    const spices = { chainId: 'spices_dyes', status: 'running', entrepot: true, resource: null, processingInstitutions: ['Merchant guilds (3-8)', 'Luxury goods quarter', 'Annual fair'],
      outputs: ['Rare spices and exotic dyes'] };
    /** @param {string[]} houses @param {object} [extra] */
    const held = (houses, extra = {}) => ({ name: 'Testford', tier: 'town', config: { settType: 'town' }, institutions: houses.map((name) => ({ name })), economicState: { activeChains: [spices],
      primaryExports: ['Rare spices and exotic dyes (transit)'], localProduction: ['Rare spices and exotic dyes'] }, ...extra });
    for (const h of ['Merchant guilds (3-8)', 'Luxury goods quarter', 'Major annual fairs']) {
      expect(chainOutputsShown(spices, held([h])), `${h} carries the spices`).toEqual(['Rare spices and exotic dyes']);
    }
    expect(chainOutputsShown(spices, held(['Merchant warehouses'])), 'a warehouse stores: it carries no trade').toEqual([]);
    expect(chainOutputsShown(spices, held(['Access to merchant guilds (3-8)'])), 'a road to elsewhere carries nothing here').toEqual([]);
    expect(exportsAsPrinted(held(['Merchant guilds (3-8)'])), 'the export stays transit').toEqual(['Rare spices and exotic dyes (transit)']);
    expect(localProductionAsPrinted(held(['Merchant guilds (3-8)'])), 'never made here').toEqual([]);
    const bards = { chainId: 'performance', entrepot: false, resource: null, processingInstitutions: ['Traveling performers', 'Theater', 'Bardic college'],
      outputs: ['Performances', 'Music and song', 'Musical education', 'Magical entertainment'] };
    /** @param {string[]} houses @param {object} [config] */
    const town = (houses, config = { priorityMagic: 50 }) => ({ name: 'Testford', config, institutions: houses.map((name) => ({ name })), economicState: { activeChains: [bards] } });
    expect(chainOutputsShown(bards, town(['Bardic college'])), 'the bards\' college').toContain('Magical entertainment');
    expect(chainOutputsShown(bards, town(['Multiple theaters', 'Traveling performers'])), 'a theatre makes no magic').not.toContain('Magical entertainment');
    expect(chainOutputsShown(bards, town(['Bardic college'], { priorityMagic: 50, magicExists: false })), 'no magic works here').not.toContain('Magical entertainment');
    // …and on the births: a siege, a famine and an occupation among them, the smallest and the largest towns that reach each
    for (const seed of ['r2s-infiltrated-town-1', 'r2s-under_siege-town-0', 'rr3-city-occupied-rand-4', 'r2r-metropolis-8']) {
      const t = /** @type {any} */ (birthAny(seed));
      expect(liveInstitutionNames(t).some((n) => /merchant guilds|luxury goods quarter|annual fair/i.test(n)), `${seed}: anchored, a carrier stands`).toBe(true);
      expect(chainOutputsShown(chainOf(t, 'spices_dyes'), t), `${seed}: the spices the merchants carry`).toContain('Rare spices and exotic dyes');
      expect(localProductionAsPrinted(t), `${seed}: not made here`).not.toContain('Rare spices and exotic dyes');
      for (const x of exportsAsPrinted(t).filter((e) => e.startsWith('Rare spices'))) expect(x, `${seed}: carried through`).toMatch(/\(transit\)/);
    }
    for (const [seed, kept] of [['r2s-famine-city-0', true], ['r2s-occupied-metropolis-0', true], ['r2r-town-0', false]]) {
      const t = /** @type {any} */ (birthAny(seed));
      expect(liveInstitutionNames(t).some((n) => /bardic college/i.test(n)), `${seed}: anchored`).toBe(kept);
      expect(chainOutputsShown(chainOf(t, 'performance'), t).includes('Magical entertainment'), `${seed}: the bards' magic`).toBe(kept);
    }
  }, 180000);

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
