/**
 * THE MAGIC SHARE IS THE SHARE OF THE POUNDS PUBLISHED (RECORD-MEASURE-3 row 4; the chair's ruling R4, candidate c4a).
 * At the base four thorps under a crisis held a food record with a magic share of 1 per cent made of 0.4 lb (a divine
 * provision through "Access to parish church"), while the published `magicOffset` read 0 lb and the reliance reading read
 * "none"; three printed "provided by spell or by prayer" beside "Reliance on magic: None". The writer hands the food
 * record the rounded pounds it publishes, so the share is of those pounds.
 *
 * The law: no food record holds a magic share above nought where the magic reading is none. The draw: the census's own
 * births (CENSUS-3 `seedcfg.mjs`, its r2r and r2s arms, verbatim): every thorp of the three crises the four came from,
 * the first six plain thorps, and two towns whose magic is relied upon (the anchors: the share still stands where
 * magic does). Each witness proves itself: the divine provision's path stands in its own land (`foodLandOf`).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { foodLandOf } from '../../src/generators/foodLand.js';
import { deriveMagicReliance } from '../../src/domain/magicReliance.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's births (seedcfg.mjs, its r2r and r2s arms), verbatim. @param {string} seed @returns {any} */
const born = (seed) => {
  const r2r = /^r2r-(\w+)-\d+$/.exec(seed);
  if (r2r) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: r2r[1] }), null, { seed, customContent: {} });
  const r2s = /** @type {RegExpExecArray} */ (/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed));
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [r2s[1]], selectedStressesRandom: false, settType: r2s[2] }), null, { seed, customContent: {} });
};
/** The four that held a magic share beside the reading none at the base. */
const WITNESSES = ['r2s-occupied-thorp-0', 'r2s-occupied-thorp-2', 'r2s-indebted-thorp-2', 'r2s-insurgency-thorp-2'];
/** Two whose magic is relied upon and whose food record holds a magic share at the base and after. */
const ANCHORS = ['r2r-thorp-16', 'r2r-village-21'];
const DRAW = [
  ...['occupied', 'indebted', 'insurgency'].flatMap((c) => [0, 1, 2, 3].map((i) => `r2s-${c}-thorp-${i}`)),
  ...[0, 1, 2, 3, 4, 5].map((i) => `r2r-thorp-${i}`),
  ...ANCHORS,
];

/** @type {Map<string, any>} */ const births = new Map();
const of = (/** @type {string} */ seed) => { if (!births.has(seed)) births.set(seed, born(seed)); return births.get(seed); };
const magicPctOf = (/** @type {any} */ s) => s.economicState.foodSecurity.foodRecord.magicPct;
const readingOf = (/** @type {any} */ s) => deriveMagicReliance(s).reading;

describe('R4: the food record\'s magic share is the share of the pounds published', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('every witness stands on the divine provision\'s path, its reading none, and its record holds no magic share', () => {
    const failures = collectSeedFailures(WITNESSES, (seed) => {
      const s = of(seed);
      const land = foodLandOf(s.tier, s.institutions, { ...s.config, _population: s.population }, s.config.tradeRouteAccess);
      expect(land.hasDivine, `${seed}: the divine provision's path stands`).toBe(true);
      expect(readingOf(s), `${seed}: the reliance reading`).toBe('none');
      expect(s.economicState.foodSecurity.magicOffset, `${seed}: the published pounds by magic`).toBe(0);
      expect(magicPctOf(s), `${seed}: the record's magic share`).toBe(0);
    });
    expectNoSeedFailures(failures, 'each witness holds no magic share of nought published pounds');
  });

  it('NO food record of the draw holds a magic share above nought where the magic reading is none', () => {
    const failures = collectSeedFailures(DRAW, (seed) => {
      const s = of(seed);
      if (readingOf(s) === 'none') expect(magicPctOf(s), seed).toBe(0);
    });
    expectNoSeedFailures(failures, 'no magic share beside the reading none');
    // The collection is live: the towns holding a magic share include the anchors, whose magic is relied upon.
    const holding = DRAW.filter((seed) => magicPctOf(of(seed)) > 0);
    for (const w of WITNESSES) expectAbsentWithAnchor(holding, w, ANCHORS[0], 'the draw\'s towns holding a magic share');
    expect(ANCHORS.every((seed) => readingOf(of(seed)) !== 'none' && magicPctOf(of(seed)) > 0)).toBe(true);
  });
});
