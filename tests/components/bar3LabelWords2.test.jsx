/** @vitest-environment jsdom */
/**
 * bar3LabelWords2.test.jsx — BAR3-LABELS-2 (the chair's directions of 2026-11-15, vetoable by the owner):
 *   · L1b: the Magic tab's reliance row NAMES what relies on magic, from the one leaf that counts the dependents
 *     (`magicProvisionShown.js :: magicDependentChainsShown`, `foodAmongMagicDependents`), each chain through its leaf
 *     (`chainPrintName`), the food supply as the food row names it ("by divine provision");
 *   · RULING L1c: "Religious acceptance: hostile" (or wary) beside a religious house that supplies the magic says what the
 *     hostility is toward (`religiousAcceptanceShown`): both facts stand;
 *   · L3: under a siege a chain card whose every live house the Services tab marks stopped does not print a working
 *     word (`economicsCrisisMarks.js :: chainCardUnderSiege`);
 *   · item 4 (C6511): "Trade connectivity: Collapsed" where the Economics tab prints goods arriving reads "Critical"
 *     (`foundationBandShown.js :: tradeArrivesOnPage`);
 *   · item 5 (C20093): "Criminal money finds little purchase … its officials have little reason to sell" is disqualified
 *     where the page prints a corrupt official (`facts/officialsInPay.js :: corruptOfficialsOf`).
 * Births of the census's own seeds (CENSUS-3 seedcfg.mjs, the r2r- and r2s- arms). Each NOT pair is red at the batch's
 * base (8b45191a5); each KEEP pair is green before and after.
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

import MagicTab from '../../src/components/new/tabs/MagicTab.jsx';
import SubstrateTab from '../../src/components/new/tabs/SubstrateTab.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { chainAsShown } from '../../src/domain/display/chainStateShown.js';
import { chainCardUnderSiege } from '../../src/domain/display/economicsCrisisMarks.js';
import { CRIME_LINE_DISQUALIFIERS, CRIME_LINE_FACTS, crimeLineFactsOf } from '../../src/domain/display/stateProse/crimeLineDisqualifiers.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** @param {string} seed */
const cfgFor = (seed) => {
  let m = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`));
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] });
  m = /** @type {RegExpMatchArray} */ (seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-(\\d+)$`)));
  return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
};
/** @type {Map<string, any>} */ const towns = new Map();
const town = (/** @type {string} */ seed) => {
  if (!towns.has(seed)) towns.set(seed, generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }));
  return towns.get(seed);
};
/** @param {any} t @returns {{ reliance: string, facets: string[] }} the Magic tab's reliance row and its envelope facets */
const magicRows = (t) => {
  const { container, unmount } = render(<MagicTab settlement={t} />);
  const reliance = container.querySelector('[data-testid="magic-reliance"]')?.textContent || '';
  const facets = [...container.querySelectorAll('[data-facet]')].map((n) => n.textContent || '');
  unmount();
  return { reliance, facets };
};
/** @param {any} t @returns {string[]} the Foundations rows, label and word run together as the page prints them */
const foundations = (t) => {
  const { container, unmount } = render(<SubstrateTab settlement={t} />);
  const rows = [...container.querySelectorAll('[data-substrate-row]')].map((n) => n.textContent || '');
  unmount();
  return rows;
};

// [seed, what the reliance row names] (the smallest size, the largest, a siege)
const RELIANCE_NAMES = [
  ['r2r-thorp-34', ' · for food (magical provision)'],
  ['r2r-hamlet-27', ' · for Alchemy & Reagents'],
  ['r2s-under_siege-town-0', ' · for Hunting & Trapping and food (divine provision)'],
  ['r2r-metropolis-1', ' · for Bowyer & fletcher, Timber & Lumber and Spellcasting Services'],
];
// [seed, the facet that must not print, the facet that prints instead]
const ACCEPTANCE = [
  ['r2r-village-13', 'Religious acceptancehostile', "Religious acceptanceHostile outside the faith's own houses"],
  ['r2r-town-44', 'Religious acceptancehostile', "Religious acceptanceHostile outside the faith's own houses"],
  ['r2r-town-1', 'Religious acceptancewary', "Religious acceptanceWary outside the faith's own houses"],
];
const ACCEPTANCE_KEEP = [['r2r-village-3', 'Religious acceptancehostile'], ['r2r-city-36', 'Religious acceptancehostile']]; // no religious supplier
// [seed, chain id, the state that must not print, the state that prints instead]
const SIEGE_CHAINS = [
  ['r2r-metropolis-14', 'smuggling', 'entrepot', 'impaired'],
  ['r2s-under_siege-metropolis-3', 'smuggling', 'entrepot', 'impaired'],
  ['r2s-under_siege-hamlet-0', 'tavern_social', 'operational', 'impaired'],
  ['r2s-under_siege-village-0', 'tavern_social', 'operational', 'impaired'],
];
// BAR6-MARKS (2026-11-16): re-keyed by identity from r2s-under_siege-city-0's fishing, whose cooper (its one house the siege
// left unmarked) is now "Curtailed by the siege." (its timber came in by road: `houseInputAtHand.js ::
// housesWantingTradeInput`), so every house of that card carries the siege's mark and it prints "impaired" by SW1b, truly; no
// siege town of the 720 keeps a fishing card working at the seat's tip; r2s-under_siege-town-1's parish (the church and the
// foundling home) keeps "running": a house of it works on
const SIEGE_KEEP = [['r2s-under_siege-town-1', 'parish', 'running']]; // one of its houses works on
// RULING SW1b (the chair, 2026-11-15 23:41 UTC; vetoable by the owner; BAR3-CLOSE-SWEEP-A): every crisis that marks houses,
// not the siege alone. [seed, chain id, the state that must not print, the state that prints instead]
const CRISIS_CHAINS = [
  ['r2s-plague_onset-village-3', 'tavern_social', 'operational', 'impaired'], // its one inn: the outbreak's "Curtailed"
  ['r2s-famine-thorp-3', 'forage', 'running', 'impaired'], // its subsistence farming: the famine's "Scarce"
];
const CRISIS_KEEP = [
  ['r2s-famine-city-3', 'wine_spirits', 'entrepot'], // its Brewery scarce, its Vintner unmarked
  ['r2s-plague_onset-city-1', 'tavern_social', 'operational'], // its taverns curtailed, its bathhouse unmarked
];
const TRADE = [
  ['r2r-city-35', 'Trade connectivityCollapsed', 'Trade connectivityCritical'],
  ['r2s-indebted-city-1', 'Trade connectivityCollapsed', 'Trade connectivityCritical'],
];
// item 5: RECOVERING's v4 is struck where a corrupt official prints; kept where none
const CRIME_POOL = 'DS-POW-6::capture pressure RECOVERING (strong security, prosperity)';
const CRIME_STRUCK = ['r2r-metropolis-32', 'r2r-city-6', 'r2r-town-25'];
const CRIME_KEEP = ['r2r-hamlet-11', 'r2r-village-49'];

describe('BAR3-LABELS-2: the reliance row names its dependents; four labels say what the record holds (L1b, L1c, L3, 4, 5)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  afterEach(() => cleanup());

  test('L1b: the reliance row names what relies on magic, each chain through its leaf and the food as the food row names it', () => {
    const failures = collectSeedFailures(RELIANCE_NAMES.map((r) => r[0]), (seed) => {
      const [, names] = /** @type {string[]} */ (RELIANCE_NAMES.find((r) => r[0] === seed));
      expect(magicRows(town(seed)).reliance, `${seed} names its dependents`).toContain(names);
    });
    expectNoSeedFailures(failures, 'the reliance row names its dependents');
  }, 300_000);

  test('L1c NOT: a bare hostile word beside a religious supplier (the qualified word prints); KEEP: no religious supplier', () => {
    const failures = collectSeedFailures(ACCEPTANCE.map((r) => r[0]), (seed) => {
      const [, not, instead] = /** @type {string[]} */ (ACCEPTANCE.find((r) => r[0] === seed));
      expectAbsentWithAnchor(magicRows(town(seed)).facets, not, instead, `${seed}: "${instead}" prints, not "${not}"`);
    });
    expectNoSeedFailures(failures, 'the acceptance word says what it is toward');
    for (const [seed, row] of ACCEPTANCE_KEEP) expect(magicRows(town(seed)).facets, `${seed} keeps "${row}"`).toContain(row);
  }, 300_000);

  test('L3 NOT: a working word on a chain whose every house the siege stops ("impaired" prints); KEEP: a house works on', () => {
    const failures = collectSeedFailures(SIEGE_CHAINS.map((r) => r[0]), (seed) => {
      const [, id, not, instead] = /** @type {string[]} */ (SIEGE_CHAINS.find((r) => r[0] === seed));
      const chain = town(seed).economicState.activeChains.find((/** @type {any} */ c) => c.chainId === id);
      const shown = chainCardUnderSiege(town(seed), chain, chainAsShown(chain, town(seed))).status;
      expect(shown, `${seed} ${id}: "${instead}", not "${not}"`).toBe(instead);
    });
    expectNoSeedFailures(failures, 'the chain card reads the houses\' marks');
    for (const [seed, id, state] of SIEGE_KEEP) {
      const chain = town(seed).economicState.activeChains.find((/** @type {any} */ c) => c.chainId === id);
      expect(chainCardUnderSiege(town(seed), chain, chainAsShown(chain, town(seed))).status, `${seed} ${id} keeps "${state}"`).toBe(state);
    }
  }, 300_000);

  test('SW1b NOT: a working word on a chain whose every house an outbreak or a famine marks ("impaired" prints); KEEP: a house unmarked', () => {
    const failures = collectSeedFailures(CRISIS_CHAINS.map((r) => r[0]), (seed) => {
      const [, id, not, instead] = /** @type {string[]} */ (CRISIS_CHAINS.find((r) => r[0] === seed));
      const chain = town(seed).economicState.activeChains.find((/** @type {any} */ c) => c.chainId === id);
      expect(chainAsShown(chain, town(seed)).status, `${seed} ${id}: the card as given reads "${not}"`).toBe(not);
      expect(chainCardUnderSiege(town(seed), chain, chainAsShown(chain, town(seed))).status, `${seed} ${id}: "${instead}", not "${not}"`).toBe(instead);
    });
    expectNoSeedFailures(failures, 'the chain card reads every crisis\'s marks');
    for (const [seed, id, state] of CRISIS_KEEP) {
      const chain = town(seed).economicState.activeChains.find((/** @type {any} */ c) => c.chainId === id);
      expect(chainCardUnderSiege(town(seed), chain, chainAsShown(chain, town(seed))).status, `${seed} ${id} keeps "${state}"`).toBe(state);
    }
  }, 300_000);

  test('item 4 NOT: "Collapsed" where trade arrives on the page ("Critical" prints)', () => {
    const failures = collectSeedFailures(TRADE.map((r) => r[0]), (seed) => {
      const [, not, instead] = /** @type {string[]} */ (TRADE.find((r) => r[0] === seed));
      expectAbsentWithAnchor(foundations(town(seed)), not, instead, `${seed}: "${instead}" prints, not "${not}"`);
    });
    expectNoSeedFailures(failures, 'the trade row reads what the page prints arriving');
  }, 300_000);

  test('item 5: RECOVERING v4 ("officials have little reason to sell") is struck beside a corrupt official; KEEP: none, it stands', () => {
    // the declaration is found by the fact it reads, never by its sentence (proseDrawnAnchors): RECOVERING's v4
    const decl = CRIME_LINE_DISQUALIFIERS[CRIME_POOL][4];
    expect(decl?.falseWhere, 'v4 reads the official who sells').toBe('an official who sells');
    const strikes = (/** @type {string} */ seed) => CRIME_LINE_FACTS[/** @type {keyof typeof CRIME_LINE_FACTS} */ (decl?.falseWhere)](crimeLineFactsOf(town(seed), 'dm'));
    const failures = collectSeedFailures(CRIME_STRUCK, (seed) => { expect(strikes(seed), `${seed}: a corrupt official strikes the line`).toBe(true); });
    expectNoSeedFailures(failures, 'the disqualifier reads the page\'s corrupt officials');
    for (const seed of CRIME_KEEP) expect(strikes(seed), `${seed}: no corrupt official, the line stands`).toBe(false);
  }, 300_000);
});
