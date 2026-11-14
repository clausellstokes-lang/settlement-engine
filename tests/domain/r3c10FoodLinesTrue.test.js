/**
 * A LINE THAT NAMES WHERE THE FOOD COMES FROM READS THE FOOD RECORD (R3-CODE-C-10; the chair's rulings in
 * docs/chair/2026-11-14/briefs/BRIEF-R3-CODE-C-10.md on the chair's lane, vetoable by the owner; the ninth seat's
 * FOR THE JOIN 4, 5 and 7 in docs/chair/2026-11-13/R3-CODE-C-HANDBACK.md).
 *
 * (a) THE HERDING LINE · "herding" is a livestock word (domain/foodways.js :: SOURCE_WORDS.livestock): the culture's
 *   sentence "Herding and mixed farming produce a strongly seasonal food calendar." is drawn into the foodways line only
 *   where the food record holds a herd. r2r-city-1 (a city of 13,260 fed by its grain alone): "Most meals start from the
 *   field grain. Herding and mixed farming produce a strongly seasonal food calendar." (124 of the 1,722 births).
 *
 * The towns are born as the reader's probes bear them (REVIEW-R3-CODE-C births.mjs :: cfgFor), as the ninth seat's guard
 * (tests/domain/r3c9ReaderLinesTrue.test.js) bears them. Each arm collects first and asserts on the collection, and
 * asserts that it saw the culture whose line it watches (a guard that never meets its line proves nothing).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { CULTURE_PROFILES } from '../../src/data/cultureProfiles.js';
import { foodwaysLineOf } from '../../src/domain/foodways.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const SIZES = '(thorp|hamlet|village|town|city|metropolis)';
/** The reader's cfgFor (r2r-, r2s-, rr3-, rr3p-), in effect verbatim. @param {string} seed */
const cfgFor = (seed) => {
  let m = seed.match(/^r2r-(\w+)-(\d+)$/);
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] });
  m = seed.match(new RegExp(`^r2s-(\\w+)-${SIZES}-(\\d+)$`));
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
  m = seed.match(new RegExp(`^rr3p-${SIZES}-([a-z_+]+)-([a-z_]+)-(\\d+)$`));
  if (m) {
    const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
    return birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), monsterThreat: 'plagued', priorityMilitary: 10 + (Number(m[4]) % 3) * 10 });
  }
  m = /** @type {RegExpMatchArray} */ (seed.match(new RegExp(`^rr3-${SIZES}-([a-z_+]+)-([a-z_]+)-(\\d+)$`)));
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true });
};
/** @param {string} seed */
const bear = (seed) => generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });

const HERDING = /\bherding\b/i;
/** @param {any} s the culture the town's foodways line drew from */
const cultureHerds = (s) => (CULTURE_PROFILES[/** @type {keyof typeof CULTURE_PROFILES} */ (s.config?.cultureProfileKey)]?.foodways || [])
  .some((/** @type {any} */ line) => HERDING.test(typeof line === 'string' ? line : String(line?.text || '')));
/** @param {any} s every copy of the line: the one reader's (every surface), the food record's, the identity record's */
const copiesOf = (s) => [foodwaysLineOf(s) || '', String(s.economicState.foodSecurity.foodRecord.foodwaysLine || ''), String(s.culturalIdentity?.foodways || '')];

/**
 * (a)'s towns, whose culture speaks of herding and whose food record holds no herd: a thorp of 28 under a famine with no
 * source of its own, the smallest (a thorp of 6 whose catch failed), a hamlet on its catch, a village on its mill and
 * game, a village whose grain failed, a city on its grain, a metropolis on its fish.
 */
const NO_HERD_TOWNS = ['r2s-famine-thorp-2', 'rr3p-thorp-famine-rand-0', 'r2r-hamlet-18', 'r2r-village-42', 'r2s-famine-village-0', 'r2r-city-1', 'r2r-metropolis-11'];
/** Towns of the same culture whose record holds a herd: the sentence stands. */
const HERD_TOWNS = ['r2r-thorp-36', 'r2r-village-6'];

/** @type {Array<any>} */ let noHerdTowns = [];
/** @type {Array<any>} */ let herdTowns = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  noHerdTowns = NO_HERD_TOWNS.map(bear);
  herdTowns = HERD_TOWNS.map(bear);
}, 180000);

describe('(a) the herding line: a culture sentence that claims herding is drawn only where the food record holds a herd', () => {
  it('no copy of the foodways line claims herding where no herd feeds the town', () => {
    const seen = noHerdTowns.map((s) => ({ town: s.name, culture: cultureHerds(s), sources: s.economicState.foodSecurity.foodRecord.foodSources, herding: copiesOf(s).filter((line) => HERDING.test(line)) }));
    // The arm met the culture it watches, in towns with no herd.
    expect(seen.map((t) => [t.culture, t.sources.includes('livestock')])).toEqual(NO_HERD_TOWNS.map(() => [true, false]));
    expect(seen.filter((t) => t.herding.length)).toEqual([]);
  });

  it('where the record holds a herd, the sentence still stands on every copy', () => {
    const seen = herdTowns.map((s) => ({ town: s.name, herds: s.economicState.foodSecurity.foodRecord.foodSources.includes('livestock'), herding: copiesOf(s).every((line) => HERDING.test(line)) }));
    expect(seen.map((t) => [t.herds, t.herding])).toEqual(HERD_TOWNS.map(() => [true, true]));
  });
});
