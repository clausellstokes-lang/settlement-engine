/**
 * tailDefeconExportSide.test.js — TAIL-DEFECON-C-2 (C1-E, the chair's ruling D18, 2026-11-15): the record's export list
 * (`economicState.primaryExports`, written by `computeActiveChains.js :: deriveExportsFromChains`) sends a good out only
 * where a house of THIS town digs, makes or works it: ONE TABLE of good to houses (`GOOD_WORKING_HOUSES`, the made
 * list's table too), read by all three export steps (a resource's trade goods; a chain's outputs; the entrepôt's
 * transit toll). Coal and peat are ungated by design; the defended pass's toll is kept (the pass is its house).
 *
 * Born as the census born its 720 (RECORD-MEASURE-1, `seedcfg.mjs`). Each GONE row was red at the base (fb341090c)
 * and names a good the town still exports; each KEEP row is a good exported where its house stands, green before and
 * after.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's r2r-/r2s- birth. @param {string} seed */
const birth = (seed) => {
  const s = seed.match(/^r2s-(\w+)-(\w+)-\d+$/);
  const over = s ? { selectedStresses: [s[1]], selectedStressesRandom: false, settType: s[2] }
    : { settType: /** @type {RegExpMatchArray} */ (seed.match(/^r2r-(\w+)-\d+$/))[1] };
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, ...over }), null, { seed, customContent: {} });
};
/** @type {Map<string, any>} */
const towns = new Map();
/** @param {string} seed */
const town = (seed) => {
  if (!towns.has(seed)) towns.set(seed, birth(seed));
  return towns.get(seed);
};
/** @param {string} seed @returns {string[]} */
const exportsOf = (seed) => town(seed).economicState.primaryExports || [];
/** @param {string} seed @returns {string[]} */
const housesOf = (seed) => (town(seed).institutions || []).map((/** @type {any} */ i) => String(i.name));

/** (seed, the good no house of the town works, a good the town still exports) */
const GONE = [
  ['r2r-thorp-2', 'Toll revenue', 'Medicinal herbs'],                 // a crossroads, no toll bridge, customs house or gate
  ['r2r-thorp-3', 'Pilgrim hospitality', 'Reeds and thatch'],         // hot springs, no inn, tavern, bathhouse or waystation
  // RE-KEYED BY IDENTITY (SEAM-ECON item 6, 2026-11-17; BRIEF-BAR6-SEAM rule S5): BAR6-RECORD's declared cure (b) sends raw
  // sand out only beside a glasshouse, so this thorp no longer exports its sibling 'Raw sand'; the same town and the same
  // gone good are kept, beside a good it still exports (its wool).
  ['r2r-thorp-10', 'Glass blanks', 'Raw wool'],                       // glass sand, no glassblower
  ['r2r-thorp-53', 'Sea salt', 'Salted fish'],                        // salt flats, no salt works
  ['r2r-hamlet-6', 'Quality tools and weapons', 'Iron ore'],          // a Mine runs the iron chain; no smith
  ['r2r-hamlet-40', 'Advanced weapons and armor', 'Grain surplus'],
  ['r2r-hamlet-29', 'Flour and meal', 'Grain surplus'],               // only "Access to external mill"
  ['r2r-hamlet-27', 'Barrels and containers', 'Salted fish'],         // no cooper
  ['r2r-hamlet-49', 'Camel leather', 'Date harvest'],                 // camel herds, no tanner
  ['r2s-succession_void-village-1', 'River craft', 'Salted fish'],    // no boatyard or shipyard
  ['r2r-village-6', 'Dyed cloth', 'Raw wool'],                        // no dyer
  ['r2r-town-20', 'Toll income (transit)', 'Milled flour'],           // the entrepôt's toll, no house takes it
  ['r2r-town-44', 'Bows and crossbows', 'Milled flour'],              // "Craft guilds", no bowyer
  ['r2r-town-50', 'Arrows (sheaf)', 'Sacred wood'],
  ['r2r-city-31', 'Glassware', 'Coal'],                               // no glassmaker (coal stays: ungated by design)
  ['r2s-famine-town-2', 'Ocean-going vessels', 'River craft'],        // no shipyard
  ['r2s-succession_void-town-0', 'Ship construction', 'Ship passage'],
  ['r2s-religious_conversion-city-1', 'Fine textiles', 'Transit trade'], // no weaver or tailor
  // D25 (the chair, 2026-11-15): the flats' twin name for the same salt; red at e6700483b, where it took Sea salt's place.
  ['r2r-thorp-53', 'Salt for preservation', 'Salted fish'],
  ['r2r-village-5', 'Salt for preservation', 'Cargo barges'],
  ['r2s-insurgency-village-3', 'Salt for preservation', 'Water rights'],
  // D33 (TAIL-DEFECON-C-4): a Maltster malts; it grinds no flour. What the mill site still gives it: its processed grain.
  ['r2r-hamlet-44', 'Flour and meal', 'Processed grain'],
  ['r2r-hamlet-44', 'Milled flour', 'Processed grain'],
];

/** (seed, a good exported where a house that works it stands, that house) */
const KEEP = [
  ['r2r-thorp-16', 'Toll revenue', 'the defended pass'],              // the pass is its toll's house (no toll house stands)
  ['r2r-town-14', 'Toll revenue', 'Customs house'],                   // a crossroads with a customs house
  ['r2r-village-2', 'Toll income (transit)', 'Toll bridge'],
  ['r2r-hamlet-3', 'Sea salt', 'Salt works'],
  ['r2r-village-12', 'Pilgrim hospitality', "Travelers' inn"],
  ['r2r-village-36', 'Barrels and containers', 'Cooper'],
  ['r2r-town-10', 'Bows and crossbows', 'Bowyers & fletchers (guild)'],
  ['r2r-city-1', 'Glassware', 'Glassmakers'],
  ['r2r-hamlet-2', 'Quality tools and weapons', 'Resident smith (part-time)'],
  // RE-KEYED BY IDENTITY (TAIL-DEFECON-C-4, D33): this row kept a Maltster's "Flour and meal" (the 'mill' keyword read a
  // maltster as a mill); flour is ground by a GRAIN mill, so r2r-hamlet-44 is now a GONE row (above), and the claim moves
  // to r2r-village-27, whose Mill grinds it.
  ['r2r-village-27', 'Flour and meal', 'Mill'],
  ['r2s-indebted-town-1', 'Dyed cloth', 'Dyer'],
];

describe('C1-E: a good is exported only where a house that digs, makes or works it stands (D18)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('GONE (every row): seed does not export the good no house works; it still exports its sibling', () => {
    expectNoSeedFailures(collectSeedFailures(GONE, ([seed, gone, still]) => {
      const out = exportsOf(seed);
      expect(out, 'anchored: the list still exports').toContain(still);
      expectAbsentWithAnchor(out, gone, still, seed);
    }), 'GONE: no town exports a good no house of it works, and each still exports its sibling');
  }, 60000);

  test('KEEP (every row): seed exports the good where its house stands', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP, ([seed, good, house]) => {
      if (house === 'the defended pass') expect(town(seed).config?.nearbyResources || [], 'anchored: the pass').toContain('defended_pass');
      else expect(housesOf(seed), 'anchored: the house stands').toContain(house);
      expect(exportsOf(seed)).toContain(good);
    }), 'KEEP: each town exports the good its standing house works');
  }, 60000);

  test('coal and peat are ungated by design: coal still leaves r2r-city-31, which works no coal', () => {
    expect(housesOf('r2r-city-31').some((n) => /coal|collier|mine/i.test(n)), 'anchored: no coal house').toBe(false);
    expect(exportsOf('r2r-city-31')).toContain('Coal');
  }, 60000);
});

/**
 * (D19, the chair's ruling, 2026-11-15) AN AIR DOCK'S DOCKS: where an airship dock stands and no house works water but
 * the docks and the harbour master (the airship override seats those whatever the route), the service is the air's:
 * "Airship freight services (cargo, mooring)" in place of "Waterborne freight services (cargo, pilotage)". Each AIR row
 * was red at a10a457e2; each WATER row (a river or a sea beside the airship dock) keeps the water's word.
 */
const WATERBORNE = 'Waterborne freight services (cargo, pilotage)';
const AIRSHIP = 'Airship freight services (cargo, mooring)';
const AIR = ['r2r-metropolis-9', 'r2r-metropolis-44', 'r2s-occupied-metropolis-0'];
/** (seed, the water house beside the airship dock, the service's export) */
const WATER = [
  ['r2s-indebted-metropolis-1', 'Barge and river transport company', WATERBORNE],
  ['r2s-mass_migration-metropolis-2', 'River boatyard', WATERBORNE],
  ['r2r-metropolis-21', 'Shipyard', 'Maritime services (cargo, pilotage)'],
];

describe('D19: the docks of an air dock are not waterborne', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('AIR (every seed) exports the airship freight service, not the waterborne one', () => {
    expectNoSeedFailures(collectSeedFailures(AIR, (seed) => {
      expect(housesOf(seed), 'anchored: the airship dock').toContain('Airship docking (high magic)');
      expect(exportsOf(seed)).toContain(AIRSHIP);
      expectAbsentWithAnchor(exportsOf(seed), WATERBORNE, AIRSHIP, seed);
    }), 'AIR: each air-dock town exports the airship service and not the waterborne one');
  }, 60000);

  test('WATER (every row): seed, an airship dock beside a water house, keeps the water\'s service', () => {
    expectNoSeedFailures(collectSeedFailures(WATER, ([seed, house, service]) => {
      expect(housesOf(seed), 'anchored: the airship dock').toContain('Airship docking (high magic)');
      expect(housesOf(seed), 'anchored: the water house').toContain(house);
      expect(exportsOf(seed)).toContain(service);
      expectAbsentWithAnchor(exportsOf(seed), AIRSHIP, service, seed);
    }), 'WATER: each airship dock beside a water house keeps the water\'s word');
  }, 60000);
});
