/**
 * TAIL-CRISIS batch 5 (READ-ALL-3, the exports' read, the chair's note X9; the seat TAIL-CRISIS-3): THE CRISIS SUMMARY'S
 * VANTAGE LINES CLAIM NO MARKET, NO LOOKOUTS, NO STORES AND NO SHORTAGE THE TOWN DOES NOT HOLD
 * (`domain/crisis/crisisSummaryVantage.js :: CRISIS_SUMMARY_POOLS`; the PDF's cover and overview hand no facts, so each line
 * is reworded to be true in every town that prints it). One collected test on births of the census's own seeds (CENSUS-3
 * seedcfg.mjs, the r2r-/r2s- arms, copied): each FALSE pair is a (seed, words) the town printed at the base and must not
 * print now, with what prints in its place; each KEEP pair a true sibling that prints at both.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { crisisSummaryForSurface } from '../../src/domain/crisis/crisisSummaryVantage.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

/** @type {Map<string, any>} */
const born = new Map();
/** @type {(seed: string) => any} */
let birth;

beforeAll(async () => {
  const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
  const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
  const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
  await loadGenerationLawPayloads();
  birth = (seed) => {
    if (born.has(seed)) return born.get(seed);
    let m = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`));
    let cfg;
    if (m) cfg = birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] });
    else {
      m = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-(\\d+)$`));
      if (!m) throw new Error(`no configuration for ${seed}`);
      cfg = birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
    }
    const s = generateSettlementPipeline(cfg, null, { seed, customContent: {} });
    born.set(seed, s);
    return s;
  };
}, 120000);

/** Every vantage line the town prints for its crises, on the export surfaces and the Tonight sheet. @param {any} s */
const lines = (s) => [].concat(s.stress || []).filter(Boolean)
  .flatMap((e) => ['cover', 'overview', 'defence', 'tonight'].map((surface) => crisisSummaryForSurface(e, s.name, /** @type {any} */ (surface)) || ''))
  .join('\n').replaceAll(String(born.get(lastSeed)?.name ?? '\u0000'), '{name}');
/** @type {string} */
let lastSeed = '';
/** @param {string} seed */
const said = (seed) => { lastSeed = seed; return lines(birth(seed)); };

/** [seed, words that must NOT print, what prints in their place] (READ-ALL-3 row ids) */
const FALSE = [
  ['r2s-mass_migration-thorp-3', 'Food in {name} is running short', '{name} has many more mouths to feed than it had, and there is not work enough for the newcomers.'], // 10399 16309
  ['r2s-mass_migration-thorp-2', 'food is running short', 'With so many new mouths in {name}, there is not work for everyone who wants it.'], // 31407
  ['r2s-wartime-thorp-2', 'the food stores are guarded day and night', 'In {name} whatever food is put by is watched day and night, and nobody carrying a sack goes unquestioned.'], // 13667
  ['r2s-plague_onset-thorp-0', 'Fewer people come to market', 'Fewer people come to {name} since the sickness began, and fewer goods come with them.'], // 09896
  ['r2s-plague_onset-thorp-2', 'fewer come to market', 'Travel is discouraged in {name}, and fewer come and go than before the sickness.'], // 29529 08228
  ['r2s-monster_pressure-thorp-3', 'Lookouts around', 'People in {name} keep an eye on the roads and the edges of the fields, and nobody lingers outside once the light goes.'], // 15776
];

/** [seed, a true sibling that must still print] */
const KEEP = [
  ['r2s-wartime-thorp-2', '{name} is at war: army carts pass through, and the war is all anyone talks about.'], // parked (the walker's door): unchanged
];

describe('TAIL-CRISIS batch 5: the vantage lines claim nothing the town does not hold', () => {
  it('no FALSE words print, and the line every printing town bears prints in their place', () => {
    const failures = collectSeedFailures(FALSE, ([seed, gone, instead]) => {
      const text = said(seed);
      expectAbsentWithAnchor(text, gone, instead, seed);
    });
    expectNoSeedFailures(failures, 'a FALSE phrase printed, or the line in its place did not');
  }, 300000);
  it('every KEEP sibling still prints', () => {
    const failures = collectSeedFailures(KEEP, ([seed, kept]) => {
      expect(said(seed), seed).toContain(kept);
    });
    expectNoSeedFailures(failures, 'a KEEP sibling no longer prints');
  }, 300000);
});
