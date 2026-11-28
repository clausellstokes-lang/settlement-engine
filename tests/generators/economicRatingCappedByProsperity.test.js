/**
 * THE ECONOMIC RATING IS CAPPED BY THE PROSPERITY WORD, IN THE RECORD (RECORD-MEASURE-3 row 1e; the chair's ruling R1,
 * candidate c1b). The Economic Survival score (`defenseProfile.scores.economic`) is mostly the stores laid by, and its
 * readers speak of money ("money in hand"; the guard line's purse word). At the base 55 of the census's 720 towns rated
 * it STRONG beside a printed prosperity of Poor or Struggling. The law: where the printed prosperity is Subsistence,
 * Struggling or Poor, the record never holds a STRONG economic band; the score is held one point below the band's cut.
 *
 * The draw: the census's own births (CENSUS-3 `seedcfg.mjs`, its r2r and r2s arms, verbatim), four towns of every tier,
 * and three of the 55 (a town, a city, a metropolis) as WITNESSES. Each witness proves itself: its uncapped arithmetic
 * (`defenceExactOf`, the parts before the whole point) reaches the Strong cut, so the cap is what holds it, not absence.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { defenceExactOf } from '../../src/generators/defenseGenerator.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { SCORE_BAND_CUTS, scoreBand } from '../../src/domain/display/defenseScoreBands.js';
import { PROSPERITY_TIERS, prosperityRank } from '../../src/data/constants.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
/** The census's births (seedcfg.mjs, its r2r and r2s arms), verbatim. @param {string} seed @returns {any} */
const born = (seed) => {
  const r2r = /^r2r-(\w+)-\d+$/.exec(seed);
  if (r2r) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: r2r[1] }), null, { seed, customContent: {} });
  const r2s = /** @type {RegExpExecArray} */ (/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed));
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [r2s[1]], selectedStressesRandom: false, settType: r2s[2] }), null, { seed, customContent: {} });
};
/** Three of the 55 that held STRONG beside Poor or Struggling at the base (a town, a city, a metropolis; one under a crisis). */
const WITNESSES = ['r2r-town-11', 'r2r-city-19', 'r2r-metropolis-7', 'r2s-under_siege-town-0'];
const DRAW = [...TIERS.flatMap((t) => [0, 1, 2, 3].map((i) => `r2r-${t}-${i}`)), ...WITNESSES];
/** The ladder's three lowest rungs, read from the canonical ladder itself. */
const BELOW_MEANS = PROSPERITY_TIERS.slice(0, prosperityRank('Poor') + 1);

/** @type {Map<string, any>} */ const births = new Map();
const of = (/** @type {string} */ seed) => { if (!births.has(seed)) births.set(seed, born(seed)); return births.get(seed); };
const isBelowMeans = (/** @type {any} */ s) => BELOW_MEANS.includes(String(s.economicState?.prosperity));

describe('R1: the Economic Survival rating is capped by the prosperity word, in the record', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('the ladder the law reads is Subsistence, Struggling and Poor', () => {
    expect(BELOW_MEANS).toEqual(['Subsistence', 'Struggling', 'Poor']);
  });

  it('every witness reaches the Strong cut in its own arithmetic, and the record holds it one below', () => {
    const failures = collectSeedFailures(WITNESSES, (seed) => {
      const s = of(seed);
      expect(isBelowMeans(s), `${seed}: a below-means prosperity (${s.economicState?.prosperity})`).toBe(true);
      expect(defenceExactOf(s).economic, `${seed}: the uncapped parts reach the Strong cut`).toBeGreaterThanOrEqual(SCORE_BAND_CUTS.strong);
      expect(s.defenseProfile.scores.economic, `${seed}: held one below the cut`).toBe(SCORE_BAND_CUTS.strong - 1);
    });
    expectNoSeedFailures(failures, 'each witness is held by the cap, not by absence');
  });

  it('NO town of the draw holds a STRONG economic band beside a Subsistence, Struggling or Poor prosperity', () => {
    const failures = collectSeedFailures(DRAW, (seed) => {
      const s = of(seed);
      if (isBelowMeans(s)) expect(scoreBand(s.defenseProfile.scores.economic), `${seed} (${s.economicState.prosperity})`).not.toBe('STRONG'); // anchored: the bands collection below
    });
    expectNoSeedFailures(failures, 'no Strong economic band beside a below-means prosperity');
    // The collection is live: the below-means towns' bands hold the witnesses' ADEQUATE (the cap's own landing).
    const belowMeansBands = DRAW.filter((seed) => isBelowMeans(of(seed))).map((seed) => scoreBand(of(seed).defenseProfile.scores.economic));
    const cappedBand = scoreBand(SCORE_BAND_CUTS.strong - 1);
    expectAbsentWithAnchor(belowMeansBands, 'STRONG', cappedBand, 'the below-means towns of the draw');
  });

  it('the cap is the prosperity word\'s alone: a town of means still rates STRONG', () => {
    const meansBands = DRAW.filter((seed) => !isBelowMeans(of(seed))).map((seed) => scoreBand(of(seed).defenseProfile.scores.economic));
    expect(meansBands).toContain('STRONG');
  });
});
