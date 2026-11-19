/**
 * tests/generators/incomeRowsBorneOut.test.js — UPKEEP-16, the chair's ruling (o) RE-RULED (2026-11-14, 13:08; candidate D
 * of INCOME-MEASURE-1): AN INCOME ROW IS BORNE OUT BY THE PAGE. A resource row ("Iron & Metalwork", "Stone Quarrying",
 * "Timber Trade", the two Fish titles) stands only where a house of its trade stands, or where the raw good is on the
 * town's own export list from ground it holds; a row kept with no house is titled by the good it sells, its line silent.
 * 476 false rows in 402 of the capacity reader's 972 towns at f4e9cd37b. Guarded on five born towns of the measure's
 * fifteen (each born exactly as the capacity reader's render5.mjs births it) and on hand-made rows.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { GOOD_SOLD_TITLES, RESOURCE_ROW_TRADES, keepRowsThePageBearsOut } from '../../src/generators/economy/incomeLineSiblings.js';
import { INCOME_SOURCE_FORMS } from '../../src/domain/worldPulse/treasury.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's birth: r2r-<size>-<i>, or r2s-<stress>-<size>-<i> (TAIL-DEFECON-C-2, D25: the Salt Sales pin's town is an r2s). @param {string} seed */
const born = (seed) => {
  const st = /^r2s-(\w+)-(\w+)-\d+$/.exec(seed);
  const over = st ? { selectedStresses: [st[1]], selectedStressesRandom: false, settType: st[2] } : { settType: /^r2r-(\w+)-\d+$/.exec(seed)?.[1] };
  return /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, ...over }), null, { seed, customContent: {} }));
};

const TRADES = { ...RESOURCE_ROW_TRADES, 'Fish & Maritime Produce': RESOURCE_ROW_TRADES['Fish & Preserved Produce'] };
/** The measure's false-row rule: a trade's row with no house of the trade whose good is not sold from the town's ground. @param {any} s */
const falseRows = (s) => {
  const roster = s.institutions.map((/** @type {any} */ i) => String(i.name).toLowerCase());
  const live = (s.config.nearbyResources || []).filter((/** @type {string} */ r) => !(s.config.nearbyResourcesDepleted || []).includes(r));
  return s.economicState.incomeSources.filter((/** @type {any} */ e) => {
    const t = /** @type {any} */ (TRADES)[e.source];
    if (!t || roster.some((/** @type {string} */ n) => t.house.test(n))) return false;
    return !t.goods.some((/** @type {any} */ g) => live.some((/** @type {string} */ r) => g.keys.some((/** @type {string} */ k) => r.startsWith(k))) && s.economicState.primaryExports.some((/** @type {unknown} */ x) => g.sold.test(String(x))));
  }).map((/** @type {any} */ e) => e.source);
};

/** @type {Record<string, any>} */ const S = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of ['r2r-hamlet-14', 'r2r-thorp-16', 'r2r-city-10', 'r2r-town-25', 'r2r-thorp-24', 'r2s-succession_void-town-0']) S[seed] = born(seed);
}, 240_000);

describe('(o) re-ruled, D: an income row is borne out by the page', () => {
  it('no born town keeps a resource row the page does not bear out, and the shares sum to 100', () => {
    const failures = collectSeedFailures(Object.entries(S), ([seed, s]) => {
      expect(falseRows(s), seed).toEqual([]);
      expect(s.economicState.incomeSources.reduce((/** @type {number} */ n, /** @type {any} */ e) => n + e.percentage, 0), seed).toBe(100);
    });
    expectNoSeedFailures(failures, 'every born town keeps only rows the page bears out, its shares summing to 100');
  });
  it('r2r-hamlet-14: the Iron & Metalwork row with no house and nothing sold is taken off', () => {
    expectAbsentWithAnchor(S['r2r-hamlet-14'].economicState.incomeSources.map((/** @type {any} */ e) => e.source), 'Iron & Metalwork', 'Agricultural Rents');
  });
  it('r2r-city-10: the Stone Quarrying row with no house and no stone sold is taken off', () => {
    expectAbsentWithAnchor(S['r2r-city-10'].economicState.incomeSources.map((/** @type {any} */ e) => e.source), 'Stone Quarrying', 'Market Taxes');
  });
  it('r2r-thorp-16: coal sold under "Iron & Metalwork" with no house of the trade is titled "Coal Sales", its line silent', () => {
    const rows = S['r2r-thorp-16'].economicState.incomeSources;
    expectAbsentWithAnchor(rows.map((/** @type {any} */ e) => e.source), 'Iron & Metalwork', 'Coal Sales');
    const coal = rows.find((/** @type {any} */ e) => e.source === 'Coal Sales');
    expect(coal, 'the coal sale is kept').toBeTruthy();
    expect(coal.desc).toBe('');
  });
  it('r2r-town-25: the timber row the exports bear out (shipbuilding timber sold) is kept under its own title', () => {
    expect(S['r2r-town-25'].economicState.incomeSources.map((/** @type {any} */ e) => e.source)).toContain('Timber Trade');
  });
  // Re-keyed BY IDENTITY (TAIL-DEFECON-C-2, D25, the chair, 2026-11-15): r2r-thorp-24 stands no salt works, so since
  // D25 it exports no salt and keeps no salt row (Agricultural Rents alone, and no Fish row). The claim is kept in a
  // town that sells its flats' salt by a Salt works with no fisher.
  // Re-keyed BY IDENTITY (TAIL-CLOSE-DISPLAY-2, red 6): TAIL-DEFECON-2's declared move D10 (df2fa5ca) titles the rents
  // row "Harvest" where no lord's steward or reeve stands, and r2r-thorp-24 has neither: the same row, its present title.
  it('r2r-thorp-24: no salt works, no salt sold: neither a Salt Sales row nor a Fish row', () => {
    const sources = S['r2r-thorp-24'].economicState.incomeSources.map((/** @type {any} */ e) => e.source);
    expect(sources, 'anchored: the harvest row (the rents row\'s D10 title) stands').toContain('Harvest');
    expectAbsentWithAnchor(sources, 'Salt Sales', 'Harvest');
    expect(sources.filter((/** @type {string} */ t) => /^Fish & /.test(t))).toEqual([]);
  });
  it('r2s-succession_void-town-0: sea salt sold under a Fish title with no fisher is titled "Salt Sales"', () => {
    const s = S['r2s-succession_void-town-0'];
    expect(s.institutions.map((/** @type {any} */ i) => i.name), 'anchored: the salt works').toContain('Salt works');
    expect(s.economicState.primaryExports, 'anchored: the salt sold').toContain('Sea salt');
    const sources = s.economicState.incomeSources.map((/** @type {any} */ e) => e.source);
    expect(sources).toContain('Salt Sales');
    expect(sources.filter((/** @type {string} */ t) => /^Fish & /.test(t))).toEqual([]);
  });
  it('a hand-made table: the unhoused row goes, the housed row stays, the shares re-made from the weights', () => {
    const rows = [
      { source: 'Agricultural Rents', percentage: 60, weight: 60, desc: 'a' },
      { source: 'Stone Quarrying', percentage: 20, weight: 20, desc: 'b' },
      { source: 'Timber Trade', percentage: 20, weight: 20, desc: 'c' },
    ];
    keepRowsThePageBearsOut(rows, { roster: ['woodcutter'], ground: ['managed_forest'], exports: [] });
    expect(rows.map((e) => [e.source, e.percentage])).toEqual([['Agricultural Rents', 75], ['Timber Trade', 25]]);
  });
  it('every title a kept row may be given has its tax form in the treasury map (the map stays the census of titles)', () => {
    for (const t of GOOD_SOLD_TITLES) expect(Object.keys(INCOME_SOURCE_FORMS), t).toContain(t);
  });
});
