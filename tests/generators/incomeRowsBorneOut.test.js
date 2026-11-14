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

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** @param {string} seed r2r-<size>-<i> */
const born = (seed) => /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: /^r2r-(\w+)-\d+$/.exec(seed)?.[1] }), null, { seed, customContent: {} }));

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
  for (const seed of ['r2r-hamlet-14', 'r2r-thorp-16', 'r2r-city-10', 'r2r-town-25', 'r2r-thorp-24']) S[seed] = born(seed);
}, 240_000);

describe('(o) re-ruled, D: an income row is borne out by the page', () => {
  it('no born town keeps a resource row the page does not bear out, and the shares sum to 100', () => {
    for (const [seed, s] of Object.entries(S)) {
      expect(falseRows(s), seed).toEqual([]);
      expect(s.economicState.incomeSources.reduce((/** @type {number} */ n, /** @type {any} */ e) => n + e.percentage, 0), seed).toBe(100);
    }
  });
  it('r2r-hamlet-14: the Iron & Metalwork row with no house and nothing sold is taken off', () => {
    expect(S['r2r-hamlet-14'].economicState.incomeSources.map((/** @type {any} */ e) => e.source)).not.toContain('Iron & Metalwork');
  });
  it('r2r-city-10: the Stone Quarrying row with no house and no stone sold is taken off', () => {
    expect(S['r2r-city-10'].economicState.incomeSources.map((/** @type {any} */ e) => e.source)).not.toContain('Stone Quarrying');
  });
  it('r2r-thorp-16: coal sold under "Iron & Metalwork" with no house of the trade is titled "Coal Sales", its line silent', () => {
    const rows = S['r2r-thorp-16'].economicState.incomeSources;
    expect(rows.map((/** @type {any} */ e) => e.source)).not.toContain('Iron & Metalwork');
    const coal = rows.find((/** @type {any} */ e) => e.source === 'Coal Sales');
    expect(coal, 'the coal sale is kept').toBeTruthy();
    expect(coal.desc).toBe('');
  });
  it('r2r-town-25: the timber row the exports bear out (shipbuilding timber sold) is kept under its own title', () => {
    expect(S['r2r-town-25'].economicState.incomeSources.map((/** @type {any} */ e) => e.source)).toContain('Timber Trade');
  });
  it('r2r-thorp-24: sea salt sold under a Fish title with no fisher is titled "Salt Sales"', () => {
    const sources = S['r2r-thorp-24'].economicState.incomeSources.map((/** @type {any} */ e) => e.source);
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
