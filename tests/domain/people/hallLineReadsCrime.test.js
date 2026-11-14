/**
 * hallLineReadsCrime.test.js — POWERS-14 (P7.4's widest row, ww#375 "Free of the criminals. Nobody at the head of ...",
 * read on its page in its towns): THE HALL'S LINE DOES NOT DENY A CRIMINAL POWER THE TOWN STANDS. The DM view's hall
 * (people/patronage.js :: dmPowerViewOf → hallOf; the Power tab's DM panel and the PDF's DM chapter) printed the none
 * rung's first line, "Nobody at the head of <ruler> answers to a criminal house, and no criminal power here is strong
 * enough to push it.", in every town whose hall no agent holds: in 128 of the 587 the town stands an organized syndicate
 * (factsOf(record).crime, the Defense tab's "Criminal structure": r2r-city-0: "Criminal structure: Organized syndicate"; r2s-under_siege-metropolis-0: an assassins' guild, a smuggling
 * network, "A guard captain is on the payroll of the criminal network"). Read TRUE and kept: a semi-organized network
 * (59 towns: "lacks a single controlling authority") and a diffuse presence (30: "there is no boss"). Where a syndicate
 * stands the none rung takes the line that claims only the hall ("The head, the second and the third of <ruler> make
 * their own decisions; none of them takes orders from the criminals."), or, where the hall lacks a second or a third,
 * its third line, which counts no rank.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';
import { dmPowerViewOf } from '../../../src/domain/people/patronage.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** the census's 720 shape @param {string} seed */
function born(seed) {
  const calm = seed.match(/^r2r-(\w+)-\d+$/);
  const forced = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const cfg = calm ? { ...DEFAULT_CONFIG, ...DIALS, settType: calm[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, settType: forced[2], selectedStresses: [forced[1]], selectedStressesRandom: false };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
}
const DENIES = /no criminal power here is strong enough/;
// POWERS-15 (REVIEW-POWERS-5 D1): the line reworded to claim the criminals' standing only; RE-KEYED BY IDENTITY, the same line
const HALL_ONLY = /^None of the head, the second and the third of .+ takes orders from the criminals\.$/;

describe('POWERS-14 · the hall line reads the town\'s criminal structure', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('every town of the read prints the none rung\'s line its crime structure admits', () => {
    /** seed → [the crime structure read on its page, 'denies' | 'hall'] */
    const expected = /** @type {Record<string, [string, 'denies' | 'hall']>} */ ({
      // false before (read on the page): a criminal structure stands, and the line denied it
      'r2r-city-0': ['organized', 'hall'], 'r2s-under_siege-metropolis-0': ['organized', 'hall'], 'r2r-town-44': ['organized', 'hall'],
      // the guard towns, the first line kept: no criminal structure; a semi-organized network ("lacks a single
      // controlling authority") and a diffuse presence ("there is no boss"), read true beside it
      'r2r-village-0': ['semi-organized', 'denies'], 'r2r-thorp-8': ['diffuse', 'denies'], 'r2r-thorp-0': ['none', 'denies'], 'r2r-thorp-4': ['none', 'denies'], 'r2r-thorp-12': ['none', 'denies'],
    });
    expectNoSeedFailures(collectSeedFailures(Object.keys(expected), (seed) => {
      const s = born(seed);
      const [crime, kind] = expected[seed];
      expect(factsOf(s).crime, `${seed}: its crime structure`).toBe(crime);
      const hall = dmPowerViewOf(s)?.hall;
      expect(hall?.rung, `${seed}: the hall's rung`).toBe('none');
      if (kind === 'denies') expect(hall?.line, seed).toMatch(DENIES);
      else {
        expect(hall?.line, seed).toMatch(HALL_ONLY);
        expect(hall?.line, seed).not.toMatch(DENIES); // anchored: the line above asserts the hall-only twin printed
      }
    }), 'every town of the read prints the none rung\'s line its crime structure admits');
  }, 300_000);
});
