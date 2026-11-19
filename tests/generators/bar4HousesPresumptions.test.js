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
 * The sixth class (`source`, the one-source foodways frame beside a subsistence holding of the roster, the food record
 * holding no grain: a split in the record, `foodLand.js` counting grain only off grain fields) is cured ON THE PAGE by the
 * chair's ruling FW1 (`foodways.js :: tilledOneFrame`): zero too.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { housePresumptionsOf } from '../helpers/housePresumptions.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { DESC_LATE_SIBLINGS } from '../../src/data/institutionDescVariants.js';
import { FOODWAYS_PRINT_SIBLINGS } from '../../src/data/foodwaysPrintSiblings.js';
import { CULTURE_PROFILES } from '../../src/data/cultureProfiles.js';
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
const CURED = ['sex', 'timber', 'answers', 'market', 'store', 'source'];

describe('BAR4-HOUSES H1: a house\'s description and the foodways line presume nothing their town denies', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('(a) the detector reads no instance of the six classes in the census\'s 720', () => {
    const failures = collectSeedFailures(SEEDS, (seed) => {
      expect(housePresumptionsOf(born(seed)).filter((i) => CURED.includes(i.cls)).map((i) => `${i.cls}: ${i.line} [${i.state}]`)).toEqual([]);
    });
    expectNoSeedFailures(failures, 'no house description or foodways line presumes what its town denies');
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
      // BAR4-SCENES-2 (2026-11-16, the chair's ruling of 12:16 UTC; re-keyed by identity): `timber at hand` has one home now, BAR4-RECORD's
      // reading (`timberAtHand.js` on `houseInputAtHand.js`, the input's kind `local`): the true state is a live timber ground of its own
      town({ institutions: [{ name: 'Sawmill (commercial)', desc: SAW }], config: { nearbyResources: ['managed_forest'] }, economicState: { activeChains: [TIMBER_CHAIN], foodSecurity: { foodRecord: { band: 'secure', foodSources: ['grain'] } } } }), {}],
    ['answers', town({ institutions: [{ name: 'Town council', desc: COUNCIL }], stress: [{ type: 'occupied' }] }), {},
      town({ institutions: [{ name: 'Town council', desc: COUNCIL }] }), {}],
    ['market', town({ stress: [{ type: 'under_siege' }] }), { foodwaysLine: VENDORS }, town(), { foodwaysLine: VENDORS }],
    ['source', town({ institutions: [{ name: 'Subsistence farming', desc: 'Each family tills a small holding, all of it for the table.' }], economicState: { activeChains: [], foodSecurity: { foodRecord: { band: 'secure', foodSources: ['game'] } } } }), { foodwaysLine: 'Its own food is game from the woods.' },
      town({ institutions: [{ name: 'Subsistence farming', desc: 'Each family tills a small holding, all of it for the table.' }], economicState: { activeChains: [], foodSecurity: { foodRecord: { band: 'secure', foodSources: ['grain'] } } } }), { foodwaysLine: 'Its own food is bread from the home fields.' }],
    ['store', town({ economicState: { activeChains: [], foodSecurity: { foodRecord: { band: 'famine', foodSources: ['grain'] } } } }), { foodwaysLine: HARVEST },
      town(), { foodwaysLine: HARVEST }],
  ]);
  // BAR4-CLOSE-SWEEP (2026-11-16, the sovereignty lighting law: no new `each`): one parameterless test over the classes, every row run
  it('(b) the positive control of each class: fires in the false state, silent in the true one (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(CONTROLS, ([cls, falseState, falseOpts, trueState, trueOpts]) => {
      expect(housePresumptionsOf(falseState, falseOpts).map((i) => i.cls), `${cls}: fires in the false state`).toEqual([cls]);
      expect(housePresumptionsOf(trueState, trueOpts).map((i) => i.cls), `${cls}: silent in the true one`).toEqual([]);
    }), '(b) every class\'s positive control');
  });

  it('(d) the surfaces agree (the chair\'s FW1b): the tab\'s call, the PDF\'s and Foundry\'s call and the stored identity print one line', () => {
    // a constructed record: a thorp of game, a Subsistence farming house, no grain (C33207's state)
    const rec = { tier: 'thorp', institutions: [{ name: 'Subsistence farming', desc: 'Each family tills a small holding, all of it for the table.' }], npcs: [],
      economicState: { activeChains: [], foodSecurity: { foodRecord: { band: 'secure', foodSources: ['game'], failedSource: null, foodwaysLine: 'Its own food is game from the woods.' } } } };
    const tab = foodwaysLineOf({ ...rec, economicState: rec.economicState }); // EconomicsTab.jsx: `s ? { ...s, economicState: eco } : …`
    const pdfAndFoundry = foodwaysLineOf(rec); // IdentityDailyLife.jsx, journalPages.js: the record
    const stored = foodwaysLineOf({ institutions: rec.institutions, economicState: rec.economicState }); // assembleSettlement.js (the culturalIdentity call): the roster and the economy
    expect(tab).toBe('Each holding grows for its own table, and beyond that its food is game from the woods.');
    expect(pdfAndFoundry).toBe(tab);
    expect(stored).toBe(tab);
    // and over the 720 the stored identity is the reader's own line
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const s = born(seed);
      if (s.culturalIdentity && foodwaysLineOf(s)) expect(s.culturalIdentity.foodways).toBe(foodwaysLineOf(s));
    });
    expectNoSeedFailures(failures, 'the stored foodways identity is the line the surfaces print');
  }, 600000);

  it('(e) each key of the print-time foodways table is a culture profile\'s own foodways row, spelled once more', () => {
    const rows = new Set(Object.values(CULTURE_PROFILES).flatMap((p) => p.foodways.map((/** @type {any} */ r) => (typeof r === 'string' ? r : r.text))));
    expect(Object.keys(FOODWAYS_PRINT_SIBLINGS).filter((k) => rows.has(k))).toEqual(Object.keys(FOODWAYS_PRINT_SIBLINGS));
  });

  // BAR4-SCENES-2 (2026-11-16, the chair's MU1 of 12:16 UTC: a twin whose state is reachable stays, proved by one constructed
  // record). The greek culture's market-supply twin prints in neither population; its state (the culture's market-supply sentence
  // in a town under a siege) is reached here: the same record prints the original in calm and the twin under the siege.
  it('(f) REACHABLE (MU1): the market-supply twin prints where a siege refuses the original, on one constructed record', () => {
    const [original, twin] = /** @type {any} */ (Object.values(FOODWAYS_PRINT_SIBLINGS).find((set) => set.some((l) => typeof l.twinOf === 'string' && /grain stores/.test(l.text))));
    expect(twin.twinOf).toBe(original.text);
    const rec = (/** @type {boolean} */ siege) => ({ economicState: { foodSecurity: { hasSiege: siege, hasFamine: false,
      foodRecord: { band: 'adequate', foodSources: ['grain'], failedSource: null, foodwaysLine: `Most meals start from bread. ${original.text}` } } } });
    const calm = String(foodwaysLineOf(rec(false))); const besieged = String(foodwaysLineOf(rec(true)));
    expect(calm).toContain(original.text);
    expect(besieged).toContain(twin.text);
    expectAbsentWithAnchor(besieged, original.text, twin.text, 'the besieged record prints the twin in the original\'s place');
    expect(besieged).toBe(calm.replace(original.text, twin.text));
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
    // the one-source frame beside a subsistence holding names both (FW1), and the plain frame still prints where no holding stands
    const frames = SEEDS.map((seed) => foodwaysLineOf(born(seed)) || '');
    expect(frames.filter((l) => /^(?:Each holding grows for its own table|What each holding grows goes to its own table)/.test(l)).length).toBeGreaterThan(0);
    expect(frames.filter((l) => /^(?:Its own food is|What it puts on the table itself is) /.test(l)).length).toBeGreaterThan(0);
  }, 600000);
});
