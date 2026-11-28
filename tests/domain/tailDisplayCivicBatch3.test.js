/**
 * TAIL-DISPLAY-CIVIC · BATCH 3 (READ-ALL 19954; base: the batch-2 tip). The governance account
 * (domain/display/governanceAccount.js :: estrangedPowersOf) named a criminal row at the truce rung (`captureState:
 * 'equilibrium'`, type `tense`) as "at odds with" the hall, while that row's own narrative says the hall "leaves Thieves'
 * Guild alone because stamping it out would cost more than it saves" and the tab's DM line says the two leave each other
 * alone: 18 of the census's 720 towns at f663a2699. Such a row is no longer named as estranged; the account's seat and
 * standing still print, and a tense row at any other rung (the Occupation Authority's) is still "at odds with it".
 * Births of the census's own seeds (CENSUS-3 seedcfg.mjs :: cfgFor, the r2r- arm); cured pairs red at the base.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { governanceAccountOf, governanceStressTypesOf } from '../../src/domain/display/governanceAccount.js';
import { resolvePrimaryStress } from '../../src/generators/stressPriority.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** @param {string} seed */
const born = (seed) => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: seed.split('-')[1] }), null, { seed, customContent: {} });
/** @param {any} s */
const account = (s) => governanceAccountOf(s, { primaryStress: resolvePrimaryStress(governanceStressTypesOf(s)) })?.text || '';

// [seed, the sentence that must not print, the sentence of the account that still prints]
const CURED = [
  ['r2r-city-56', "The Thieves' Guild is at odds with it.", 'The Merchant Guild Council governs Spitzgate.'],
  ['r2r-metropolis-44', "The Thieves' Guild is at odds with it.", 'The Grand Guild Consortium governs Tallchowk.'],
  ['r2r-metropolis-59', "The Thieves' Guild is at odds with it.", 'The Democratic assembly governs Dongcheng.'], // point 124: the arrangement the town's id draws
];
const KEPT = [['r2r-thorp-27', 'The Occupation Authority is at odds with it.']];
const TEXT = new Map();
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...CURED, ...KEPT].map((r) => r[0]))) TEXT.set(seed, account(born(seed)));
}, 600000);

describe('batch 3: a truce with the underworld is not called being at odds', () => {
  test('the truce rows are not named as at odds; the account still prints', () => {
    expect(CURED.filter(([seed, gone, still]) => TEXT.get(seed).includes(gone) || !TEXT.get(seed).includes(still))
      .map(([seed]) => seed)).toEqual([]);
  });
  test('a tense row at another rung is still at odds', () => {
    expect(KEPT.filter(([seed, kept]) => !TEXT.get(seed).includes(kept))).toEqual([]);
  });
});
