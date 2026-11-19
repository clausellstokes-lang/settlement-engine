/** @vitest-environment jsdom */
/**
 * bar3LabelWords3.test.jsx — BAR3-LABELS-3 (the chair's directions and rulings of 2026-11-15, vetoable by the owner):
 *   · item 0 (C7514 C18969 C7264): a chain card's "Grain export" and "Surplus food" are not printed where the food record
 *     offers no surplus or a famine stands (`tradeListDisplay.js :: chainOutputsShown`); "Agricultural produce" stands;
 *   · RULING L3b (C7371 C7595): under a siege that stops the field work, a Full exploitation card whose every chain card on
 *     the ground prints a word that is not working takes that word (`economicsCrisisMarks.js :: fullCardWordUnderSiege`),
 *     never "Fully exploited"; fish under an open sea stays worked;
 *   · RULING CL2: the crime desk's lines that say the hall's people are not for sale (DS-DEF-4 equilibrium v1, none v3)
 *     read 'an official who sells' (a corrupt official on the page strikes them); the lines that say only that the
 *     criminals' approach did not take (DS-POW-6 RECOVERING v2, DS-DEF-4 none v2) still read criminal pay alone.
 * Births of the census's own seeds (CENSUS-3 seedcfg.mjs, the r2r- and r2s- arms). Each NOT pair is red at the batch's
 * base (d38c247af); each KEEP pair is green before and after.
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
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { chainOutputsShown } from '../../src/domain/display/tradeListDisplay.js';
import { fullCardWordUnderSiege } from '../../src/domain/display/economicsCrisisMarks.js';
import { exploitationGroupsShown } from '../../src/domain/display/validationOnPage.js';
import { plainGoodName } from '../../src/domain/display/tradeListDisplay.js';
import { resourceDisplayName } from '../../src/domain/display/resourceDisplayName.js';
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
/** @param {any} t @returns {string[]} the floodplain chain card's outputs as the card prints them */
const floodplainOutputs = (t) => {
  const chain = (t?.economicState?.activeChains || []).find((/** @type {any} */ c) => c.chainId === 'floodplain_agriculture');
  return chain ? chainOutputsShown(chain, t) : [];
};
/** @param {any} t @returns {string} the Resources tab's text, as the page prints it */
const resourcesText = (t) => {
  const { container, unmount } = render(<ResourcesTab settlement={t} />);
  const text = container.textContent || '';
  unmount();
  return text;
};
/** @param {any} t @param {string} res @returns {any} the Full card of the resource */
const fullCard = (t, res) => exploitationGroupsShown(t).full.find((/** @type {any} */ x) => x.card.rawResource === res)?.card;

// item 0: [seed] the floodplain card prints neither surplus word where the record offers no surplus (the smallest size it
// reaches, the largest, an occupation); KEEP: a town whose record offers a surplus
const NO_SURPLUS = ['r2r-town-29', 'r2r-metropolis-50', 'r2s-occupied-town-1'];
const SURPLUS_KEEP = ['r2r-village-27', 'r2s-recently_betrayed-town-1'];
// L3b: [seed, resource] a Full card under a field-stopping siege whose every chain card prints Impaired
const SIEGE_FULL = [['r2r-hamlet-0', 'grain'], ['r2s-under_siege-city-3', 'livestock'], ['r2s-under_siege-metropolis-0', 'mountain_timber']];
// KEEP: fish under an open sea (the sea chain runs), and a fish card with a vulnerable sea chain beside an impaired river one
// RE-KEYED BY IDENTITY (DEBT-1, 2026-11-17): r2s-under_siege-city-0's fish card now takes "impaired": its every live Via
// house carries the siege's mark (the Fish market "Stopped by the siege.", the Salt works and the Cooper curtailed), which
// BAR7-ECON item 3 (C20287) reads as no working card. The page reads so (the Fishing & Seafood card prints Impaired). The same
// claim in another besieged port whose sea grounds (fishing_grounds) keep a working card: r2s-under_siege-town-9.
const SIEGE_FULL_KEEP = [['r2s-under_siege-town-9', 'fish'], ['r2s-under_siege-town-0', 'fish']];
// CL2: [block::pool, vid] the lines that say the hall's people are not for sale, and those that speak of the criminals' pay
const NOT_FOR_SALE = [['DS-DEF-4::capture equilibrium', 1], ['DS-DEF-4::capture none', 3]];
const APPROACH_ONLY = [['DS-POW-6::capture pressure RECOVERING (strong security, prosperity)', 2], ['DS-DEF-4::capture none', 2]];
// towns whose page prints a corrupt official and no official in criminal pay (by the census's record at d38c247af)
const CORRUPT_ONLY = ['r2r-town-25', 'r2r-city-6', 'r2r-metropolis-32'];
const NO_CORRUPT = ['r2r-hamlet-11', 'r2r-village-49'];

describe('BAR3-LABELS-3: the surplus words read the food record; a Full card under a siege takes its chain card\'s word; the crime lines read who sells', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  afterEach(() => cleanup());

  test('item 0 NOT: "Grain export" and "Surplus food" with no surplus ("Agricultural produce" prints); KEEP: a surplus', () => {
    const failures = collectSeedFailures(NO_SURPLUS, (seed) => {
      const outs = floodplainOutputs(town(seed));
      expectAbsentWithAnchor(outs, 'Grain export', 'Agricultural produce', `${seed}: "Agricultural produce" prints, not "Grain export"`);
      expectAbsentWithAnchor(outs, 'Surplus food', 'Agricultural produce', `${seed}: "Agricultural produce" prints, not "Surplus food"`);
    });
    expectNoSeedFailures(failures, 'the surplus words read the food record');
    for (const seed of SURPLUS_KEEP) expect(floodplainOutputs(town(seed)), `${seed} keeps "Grain export"`).toContain('Grain export');
  }, 300_000);

  test('L3b NOT: "Fully exploited" on a ground whose every chain card is Impaired under the siege ("Impaired" prints); KEEP: the sea works', () => {
    const failures = collectSeedFailures(SIEGE_FULL.map((r) => r[0]), (seed) => {
      const [, res] = /** @type {string[]} */ (SIEGE_FULL.find((r) => r[0] === seed));
      const name = plainGoodName(resourceDisplayName(res));
      expectAbsentWithAnchor(resourcesText(town(seed)), `Fully exploited${name}`, `Impaired${name}`, `${seed}: "Impaired ${name}" prints, not "Fully exploited ${name}"`);
      expect(fullCardWordUnderSiege(town(seed), fullCard(town(seed), res)), `${seed} ${res}: the chain cards' word`).toBe('impaired');
    });
    expectNoSeedFailures(failures, 'the Full card takes its chain card\'s word');
    for (const [seed, res] of SIEGE_FULL_KEEP) expect(fullCardWordUnderSiege(town(seed), fullCard(town(seed), res)), `${seed} ${res} stays Full`).toBe(null);
  }, 300_000);

  test('CL2 NOT: "nothing is bought" and "business with the hall is straight" beside a corrupt official (the pool\'s next admitted line draws); KEEP: "did not take" stands', () => {
    // the declarations are found by their keys and the fact they read, never by their sentences (proseDrawnAnchors)
    /** @param {string} pool @param {number} vid @param {string} seed */
    const strikes = (pool, vid, seed) => {
      const decl = CRIME_LINE_DISQUALIFIERS[pool][vid];
      return CRIME_LINE_FACTS[/** @type {keyof typeof CRIME_LINE_FACTS} */ (decl?.falseWhere)](crimeLineFactsOf(town(seed), 'dm'));
    };
    const failures = collectSeedFailures(CORRUPT_ONLY, (seed) => {
      for (const [pool, vid] of NOT_FOR_SALE) expect(strikes(/** @type {string} */ (pool), /** @type {number} */ (vid), seed), `${seed}: ${pool} v${vid} is struck`).toBe(true);
      for (const [pool, vid] of APPROACH_ONLY) expect(strikes(/** @type {string} */ (pool), /** @type {number} */ (vid), seed), `${seed}: ${pool} v${vid} stands`).toBe(false);
    });
    expectNoSeedFailures(failures, 'the not-for-sale lines read the official who sells');
    for (const seed of NO_CORRUPT) for (const [pool, vid] of NOT_FOR_SALE) expect(strikes(/** @type {string} */ (pool), /** @type {number} */ (vid), seed), `${seed}: no corrupt official, ${pool} v${vid} stands`).toBe(false);
  }, 300_000);
});
