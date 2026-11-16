/**
 * tests/generators/bar4HousesPresumptions.test.js — BAR4-HOUSES, KIND H1 (THE DESCRIPTION'S PRESUMPTION), KEPT AS A GUARD
 * (BRIEF-BAR4 amendment K4, 2026-11-16). The detector (`tests/helpers/housePresumptions.js :: housePresumptionsOf`) reads
 * every printed house description and the foodways line of a town against its settled record. Over the census's 720 (its
 * own rule: r2r-<tier>-0..59 and r2s-<crisis>-<tier>-0..3, born as CENSUS-3 seedcfg.mjs bears them):
 *   (a) THE ZERO: no instance of the five cured classes (sex, timber, answers, market, store); at 8aef8e7d46 the detector
 *       read 23 instances in 23 towns here, and 18 in 18 of the fresh 300 (seeds rand-101..130, the measure, not a test);
 *   (b) A POSITIVE CONTROL per class: a record constructed in the state that makes the class's line false, on which the
 *       detector MUST fire (so it cannot go blind), beside the same record in the true state, on which it is silent;
 *   (c) THE KEEPS: each cured original still prints where its town makes it true (the twin is printed only where refused).
 * The sixth class (`source`, the one-source foodways frame beside a house whose households till for the table, the food
 * record holding no grain) is A SPLIT IN THE RECORD (amendment K6: `foodLand.js` counts grain only off grain fields, the
 * roster holds the subsistence holdings): named for the chair, not cured here; held at its count (24) so it cannot grow.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { housePresumptionsOf } from '../helpers/housePresumptions.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { DESC_LATE_SIBLINGS } from '../../src/data/institutionDescVariants.js';
import { FOODWAYS_PRINT_SIBLINGS } from '../../src/data/cultureProfiles.js';
import { foodwaysLineOf } from '../../src/domain/foodways.js';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CRISES = ['famine', 'indebted', 'infiltrated', 'insurgency', 'mass_migration', 'monster_pressure', 'occupied', 'plague_onset',
  'politically_fractured', 'recently_betrayed', 'religious_conversion', 'slave_revolt', 'succession_void', 'under_siege', 'wartime'];
/** The census's 720, by its own rule (CENSUS-3 seeds.txt). */
const SEEDS = [
  ...TIERS.flatMap((t) => Array.from({ length: 60 }, (_, n) => `r2r-${t}-${n}`)),
  ...CRISES.flatMap((c) => TIERS.flatMap((t) => Array.from({ length: 4 }, (_, n) => `r2s-${c}-${t}-${n}`))),
];
const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's own configuration for its two seed families (CENSUS-3 seedcfg.mjs). @param {string} seed */
const cfgFor = (seed) => {
  const m = seed.match(/^r2r-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: m[1] });
  const r = /** @type {RegExpMatchArray} */ (seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/));
  return birthConfig({ ...DEFAULT_CONFIG, ...dials, selectedStresses: [r[1]], selectedStressesRandom: false, settType: r[2] });
};
/** @type {Map<string, any>} */
const births = new Map();
/** @param {string} seed @returns {any} */
const born = (seed) => {
  if (!births.has(seed)) births.set(seed, generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }));
  return births.get(seed);
};
const CURED = ['sex', 'timber', 'answers', 'market', 'store'];
/** The K6 split's count over the 720 at 8aef8e7d46: a ceiling, never raised. */
const SOURCE_SPLIT_CEILING = 24;

describe('BAR4-HOUSES H1: a house\'s description and the foodways line presume nothing their town denies', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('(a) the detector reads no instance of the cured classes in the census\'s 720, and the K6 split holds its count', () => {
    let split = 0;
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const found = housePresumptionsOf(born(seed));
      split += found.filter((i) => i.cls === 'source').length;
      expect(found.filter((i) => CURED.includes(i.cls)).map((i) => `${i.cls}: ${i.line} [${i.state}]`)).toEqual([]);
    });
    expectNoSeedFailures(failures, 'no house description or foodways line presumes what its town denies');
    expect(split).toBeLessThanOrEqual(SOURCE_SPLIT_CEILING);
  }, 600000);

  // (b) the positive controls: each class's line in the state that makes it false (the detector fires), and in the state
  // that makes it true (silent). The record is the smallest the detector reads.
  /** @param {object} over @returns {any} */
  const town = (over = {}) => ({ tier: 'town', institutions: [], npcs: [], economicState: { activeChains: [], foodSecurity: { foodRecord: { band: 'secure', foodSources: ['grain'] } } }, ...over });
  const CRIER = 'At fixed times he stands in the market square and calls out the proclamations, the prices, and the news. His employer is the town, or else a guild.';
  const SAW = 'Water or ox power turns logs into planks and beams for the construction trade. A town with timber to hand supplies the region\'s building work, and keeps a standing crew to do it.';
  const COUNCIL = 'A loose council of leading citizens sees to the town\'s common business. It answers to no one in particular, but the work gets done.';
  const VENDORS = 'What it puts on the table itself is the herds\' milk and mutton. Market vendors and shared dining customs make food distribution visibly civic.';
  const HARVEST = 'Fermentation, pickling, and drying stretch the harvest through winter.';
  const TIMBER_CHAIN = { chainId: 'timber', status: 'running', resourceInputAvailable: true };
  /** [class, the record in the false state, options, the same in the true state, options] */
  const CONTROLS = /** @type {Array<[string, any, object, any, object]>} */ ([
    ['sex', town({ institutions: [{ name: 'Town crier', desc: CRIER }], npcs: [{ name: 'Ghalia al-Din', gender: 'female', institution: { key: 'Town crier' } }] }), {},
      town({ institutions: [{ name: 'Town crier', desc: CRIER }], npcs: [{ name: 'Tomas', gender: 'male', institution: { key: 'Town crier' } }] }), {}],
    ['timber', town({ institutions: [{ name: 'Sawmill (commercial)', desc: SAW }] }), {},
      town({ institutions: [{ name: 'Sawmill (commercial)', desc: SAW }], economicState: { activeChains: [TIMBER_CHAIN], foodSecurity: { foodRecord: { band: 'secure', foodSources: ['grain'] } } } }), {}],
    ['answers', town({ institutions: [{ name: 'Town council', desc: COUNCIL }], stress: [{ type: 'occupied' }] }), {},
      town({ institutions: [{ name: 'Town council', desc: COUNCIL }] }), {}],
    ['market', town({ stress: [{ type: 'under_siege' }] }), { foodwaysLine: VENDORS }, town(), { foodwaysLine: VENDORS }],
    ['store', town({ economicState: { activeChains: [], foodSecurity: { foodRecord: { band: 'famine', foodSources: ['grain'] } } } }), { foodwaysLine: HARVEST },
      town(), { foodwaysLine: HARVEST }],
  ]);
  it.each(CONTROLS)('(b) the positive control of class %s: fires in the false state, silent in the true one', (cls, falseState, falseOpts, trueState, trueOpts) => {
    expect(housePresumptionsOf(falseState, falseOpts).map((i) => i.cls)).toEqual([cls]);
    expect(housePresumptionsOf(trueState, trueOpts).map((i) => i.cls)).toEqual([]);
  });

  it('(c) the keeps: each cured original still prints in the 720 where its town makes it true, its twin where it does not', () => {
    const late = Object.keys(DESC_LATE_SIBLINGS);
    const food = Object.keys(FOODWAYS_PRINT_SIBLINGS);
    const twinsOf = (/** @type {Record<string, ReadonlyArray<any>>} */ table) => new Set(Object.values(table).flatMap((set) => set.filter((l) => typeof l.twinOf === 'string').map((l) => l.text)));
    const lateTwins = twinsOf(DESC_LATE_SIBLINGS); const foodTwins = twinsOf(FOODWAYS_PRINT_SIBLINGS);
    /** @type {Record<string, number>} */ const printed = {};
    for (const seed of SEEDS) { // seed-loop: collected — a tally of what prints, asserted once below over the whole 720
      const s = born(seed);
      for (const inst of s.institutions || []) if (typeof inst.desc === 'string' && (late.includes(inst.desc) || lateTwins.has(inst.desc))) printed[inst.desc] = (printed[inst.desc] || 0) + 1;
      const line = foodwaysLineOf(s) || '';
      for (const t of [...food, ...foodTwins]) if (line.includes(t)) printed[t] = (printed[t] || 0) + 1;
    }
    const at = (/** @type {string} */ t) => printed[t] || 0;
    // the sawmill's timber line where the town works timber (8 of the 720), its twin where it does not (11)
    expect(at(SAW) + at('A mill driven by water or ox, cutting planks and beams for builders. Sited near timber, it can meet a whole region\'s building needs. The crew is permanent.')).toBeGreaterThan(0);
    expect(at('Water or ox power turns logs into planks and beams for the construction trade whenever logs can be had, and a standing crew works it.') + at('A saw driven by water or ox, cutting planks and beams for builders whenever logs can be had. The crew is permanent.')).toBeGreaterThan(0);
    // the council's line where no occupation stands
    expect(at(COUNCIL)).toBeGreaterThan(0);
    // the culture's market and harvest lines where the market trades and the harvest is in; their twins under a siege, in want
    expect(at('Market vendors and shared dining customs make food distribution visibly civic.')).toBeGreaterThan(0);
    expect(at('Shared dining customs make food distribution visibly civic.')).toBeGreaterThan(0);
    expect(at(HARVEST)).toBeGreaterThan(0);
    expect(at('Fermentation, pickling, and drying are how the households make what food they have last.')).toBeGreaterThan(0);
  }, 600000);
});
