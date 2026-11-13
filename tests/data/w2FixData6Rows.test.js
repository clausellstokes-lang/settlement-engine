/**
 * W2-FIX-DATA-6 (2026-11-13): the census's writers in the data lane's files (CENSUS-2, lane/census-2-2026-11-13 at
 * 2686272b1, `CENSUS-2.json` key `hits`), each read against its town's record at this lane's tip and reproduced false in a
 * census town (`r2r-<size>-<i>` every dial random; `r2s-<crisis>-<size>-<i>` the crisis forced, Random off), one arm per
 * cause.
 *
 * THIS FILE REDS WHEN a town prints one of those lines again where its record makes it false, or when the town it is true
 * in loses it.
 */
import { beforeAll, describe, expect, test } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

/** A census town, as its births script makes it. */
const bornCensus = (/** @type {string} */ seed) => {
  const forced = /^r2s-(.+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  const calm = /^r2r-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  const tier = forced ? forced[2] : /** @type {RegExpExecArray} */ (calm)[1];
  const cfg = forced ? { ...DEFAULT_CONFIG, ...dials, settType: tier, selectedStressesRandom: false, selectedStresses: [forced[1]] } : { ...DEFAULT_CONFIG, ...dials, settType: tier };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
};
/** @param {any} town @param {string} house */
const servicesOf = (town, house) => Object.values(town.availableServices || {}).flat().filter((/** @type {any} */ v) => v.institution === house);

describe('W2-FIX-DATA-6: the census writers in the data lane\'s files', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  test('CENSUS-2 b: under a siege the coaching inn takes no traveller off the road and sends no relay out (r2s-under_siege-city-2); a calm town keeps both lines (r2r-town-2)', () => {
    const besieged = servicesOf(bornCensus('r2s-under_siege-city-2'), 'Coaching inn').map((v) => String(v.desc));
    expect(besieged.filter((t) => /for travelers on the road|Reduces travel time/.test(t))).toEqual([]);
    expect(besieged).toContain('Beds, meals, and stabling, though with the roads held the rooms stand mostly empty.');
    expect(besieged).toContain('Relay horses kept for coaches and dispatch riders; while the siege holds the roads, none go out.');
    const calm = servicesOf(bornCensus('r2r-town-2'), 'Coaching inn').map((v) => String(v.desc));
    expect(calm).toContain('Beds, meals, and stabling for travelers on the road. Priced by quality.');
  }, 120_000);
});
