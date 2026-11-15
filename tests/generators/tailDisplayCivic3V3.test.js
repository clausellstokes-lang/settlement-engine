/**
 * TAIL-DISPLAY-CIVIC-3 · V3 (the chair's rulings of 2026-11-15; ruling D26 lends `safetyProfile.js` and `safetyLineTruth.js`):
 * SEVEN SAFETY LINES SAY ONLY WHAT THEIR TOWN BEARS. A line needs what it presumes:
 *  - the ordinary patrol (`STANDARD_PATROL`: "maintain standard patrol coverage", "walk the usual rounds", …) and the
 *    well-paid line ("patrol properly. They come when called"): no siege, an occupier who lets the watch walk, an order
 *    hunger has not eroded (the Power tab's own stability says each: "Critical (under siege)", "Suppressed (under
 *    occupation …)", "Desperate — hunger is eroding order"); in each the slot keeps its draw and prints its twin;
 *  - "Whatever the army's buyers will take is sold to them dear": a road (an isolated place has none);
 *  - "Deserters … need food and discretion, and some here give both": food to give (under hunger: shelter);
 *  - "Lodging and a way onward, sold quietly": a bed (the line now claims the way onward only);
 *  - "keep what rounds they can while the supplies they need are cut off": a supply a crisis SEVERED, not a town that
 *    runs on its stockpiles for want of a trade route (r2r-town-9: Very Safe, no crisis).
 * Births of the census's own seeds (CENSUS-3 seedcfg.mjs :: cfgFor); every cured pair red at the base, kept pairs green.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** @param {string} seed the census's seed: r2r-<size>-<n> or r2s-<stress>-<size>-<n> */
const cfgFor = (seed) => {
  const s = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  if (s) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [s[1]], selectedStressesRandom: false, settType: s[2] });
  return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: seed.split('-')[1] });
};
/** @param {string} seed @returns {string} the safety profile's guard line and its crime lines, joined */
const safetyOf = (seed) => {
  const sp = generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }).economicState?.safetyProfile || {};
  return [sp.guardEffectivenessDesc, ...(sp.crimeTypes || []).map((c) => `${c.type}: ${c.desc}`)].join('\n');
};

// [seed, what must not print, what prints instead]
const CURED = [
  ['r2s-under_siege-city-3', 'maintain standard patrol coverage', 'The garrison and city watch are held for the defence, and few patrols can be spared from it.'],
  ['r2s-occupied-city-1', 'maintain standard patrol coverage', 'The garrison and city watch walk only the rounds the occupiers allow.'],
  ['r2s-famine-city-0', 'walk the usual rounds', 'The garrison and city watch still walk the rounds, but hunger is eroding the order they keep.'],
  ['r2r-city-44', 'well equipped and patrol properly', 'The garrison and city watch are well paid and well equipped, but hunger is eroding the order they keep.'],
  ['r2s-wartime-thorp-2', "Whatever the army's buyers will take", 'deserter networks: Deserters passing through need shelter and discretion, and some here give both.'],
  ['r2s-wartime-thorp-2', 'need food and discretion', 'need shelter and discretion, and some here give both.'],
  ['r2s-mass_migration-thorp-3', 'Lodging and a way onward', 'black market passage: A way onward, sold quietly to newcomers who were told to move on.'],
  ['r2r-town-9', 'keep what rounds they can while the supplies they need are cut off', 'The garrison and town watch are well paid, well equipped and patrol properly.'],
];
// [seed, a true sibling that must still print]
const KEPT = [
  ['r2r-city-0', 'The garrison and city watch'],
  ['r2r-thorp-11', "war profiteering: Whatever the army's buyers will take is sold to them dear"],
  ['r2r-hamlet-5', 'Deserters passing through need food and discretion, and some here give both.'],
];
const TEXT = new Map();
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...CURED, ...KEPT].map((r) => r[0]))) TEXT.set(seed, safetyOf(seed));
}, 900000);

describe('V3: the seven safety lines say only what their town bears', () => {
  test.each(CURED)('%s: "%s" does not print; "%s" does', (seed, gone, instead) => {
    const t = TEXT.get(seed);
    expectAbsentWithAnchor(t, gone, instead, seed);
    expect(t).toContain(instead);
  });
  test.each(KEPT)('%s: "%s" still prints', (seed, kept) => {
    expect(TEXT.get(seed)).toContain(kept);
  });
});
