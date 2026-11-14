/**
 * tests/generators/foodCrisisHeadingReadsRecord.test.js — R2-CODE-A-2, the cold list REVIEW-W2A-3 MEDIUM #1068:
 * "The occupiers are fed from local stores…" printed under the heading "Crisis Cutting the Food Supply" beside a
 * record that reads Secure with no gap ("Food Security Secure"; the imports close what the occupiers eat). The
 * crisis note's heading and its priority line read the LOCAL legacy surplus (`foodBalance.js ::
 * deriveFoodBalanceAnalysis`), a second home beside the canonical balance the same function publishes, and a crisis
 * that adds mouths (an occupation, an influx) was headed "Thinning the Harvest" where it thins none. They now read
 * the balance's own final gap and what it grows: a gap → "Cutting the Food Supply"; no gap → the harvest thinned (a
 * crisis that takes from the fields) or more mouths to feed (one that adds eaters), and whether what is grown still
 * covers what is eaten or the shortfall is made up. No draw: the heading is a T branch.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** @param {string} seed */
function born(seed) {
  const r = seed.match(/^r2r-(\w+)-\d+$/);
  const c = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const w = seed.match(/^rw3-(\w+)-([a-z_+]+)-\d+$/);
  const cfg = r ? { ...DEFAULT_CONFIG, ...DIALS, settType: r[1] }
    : c ? { ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [c[1]], selectedStressesRandom: false, settType: c[2] }
      : { ...DEFAULT_CONFIG, settType: w?.[1], selectedStressesRandom: false, selectedStresses: !w || w[2] === 'calm' ? [] : w[2].split('+'), _randomizePriorities: true };
  return /** @type {any} */ (generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} }));
}
const MOUTHS = /^The occupiers are fed from local stores|^Newcomers keep arriving/;

/** every food-supply crisis note of a town, against its own balance @param {any} s */
function check(s) {
  const fb = s.economicViability.metrics.foodBalance;
  const gap = (fb.deficit || 0) > 0;
  const grows = fb.dailyProduction >= fb.dailyNeed;
  const notes = (s.economicViability.issues || []).filter((/** @type {any} */ i) => i?.type === 'stress_consequence' && i?.category === 'Food Supply');
  for (const i of notes) {
    expect(i.title === 'Crisis Cutting the Food Supply', `${i.message} :: ${i.title} beside a gap of ${fb.deficit}`).toBe(gap);
    if (MOUTHS.test(i.message)) expect(i.title).not.toBe('Crisis Thinning the Harvest');
    if (/what is grown still covers what is eaten/.test(i.priorityNote)) expect(grows).toBe(true);
    if (/cut the harvest/.test(i.priorityNote)) expect(MOUTHS.test(i.message)).toBe(false);
  }
  return notes;
}

describe('the food-supply crisis heading reads the balance beside it', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('rw3-town-occupied-1 (#1068): occupiers, no gap (imports close it): more mouths to feed, the shortfall made up', () => {
    const s = born('rw3-town-occupied-1');
    const [n] = check(s);
    expect(n.title).toBe('Crisis Adding Mouths to Feed');
    expect(n.priorityNote).toBe('There are more mouths to feed, but the shortfall is still made up.');
  });
  it.each([['r2s-occupied-village-2'], ['r2r-village-28'], ['r2s-wartime-village-2'], ['r2s-plague_onset-thorp-2'], ['r2r-thorp-27'], ['r2s-occupied-thorp-3'], ['r2s-wartime-hamlet-0'], ['r2s-slave_revolt-village-3']])('%s: the heading and its line agree with the gap and the harvest', (seed) => {
    expect(check(born(seed)).length).toBeGreaterThan(0);
  });
});
