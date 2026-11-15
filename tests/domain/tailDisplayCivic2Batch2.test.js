/**
 * TAIL-DISPLAY-CIVIC-2 · BATCH 2 (READ-ALL 21394 21466; the chair's ruling X14; base: e633bd333). The governing power's
 * faith chip ("church guidance", "church sway": domain/display/governingModifierWords.js, the Power tab, the Summary and
 * the PDF's Power chapter) was borne out by `factsOf(...).sacredHouse`, which does not count a neighbour's church
 * ("Access to parish church") but does count a wayside shrine: the chip named a church over a shrine alone in 15 of the
 * census's 720 towns at the base. It now reads a house with clergy of the town's own (`clergyHouse.js`); the
 * sacred-house fact and its other readers are untouched. Where the chip goes silent the power prints its name and
 * strength alone (silent by design: an unborne modifier prints nothing). Births of the census's own seeds.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { governingModifierWordsOf } from '../../src/domain/display/governingModifierWords.js';
import { liveInstitutionNames } from '../../src/domain/facts/institutions.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** @param {string} seed */
const cfgFor = (seed) => {
  const s = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  if (s) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [s[1]], selectedStressesRandom: false, settType: s[2] });
  return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: seed.split('-')[1] });
};
const born = (/** @type {string} */ seed) => generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });

// [seed, the words that must not print]: a wayside shrine and a neighbour's church, and no church of the town's own
const CURED = [['r2r-thorp-34', 'church guidance'], ['r2s-slave_revolt-hamlet-0', 'church sway'], ['r2r-hamlet-2', 'church sway']];
// [seed, the words that still print]: a church of the village's own
const KEPT = [['r2r-village-3', 'church guidance'], ['r2r-village-23', 'church sway']];
const TOWN = new Map();
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...CURED, ...KEPT].map((r) => r[0]))) TOWN.set(seed, born(seed));
}, 600000);

describe('batch 2: the faith chip names a church only where the town keeps one', () => {
  test('over a wayside shrine alone the chip is silent', () => {
    expect(CURED.filter(([seed]) => !liveInstitutionNames(TOWN.get(seed)).includes('Wayside shrine')).map(([s]) => s), 'anchored: a shrine').toEqual([]);
    expect(CURED.filter(([seed, gone]) => governingModifierWordsOf(TOWN.get(seed)) === gone).map(([s]) => s)).toEqual([]);
  });
  test('a church of the town\'s own still bears the chip', () => {
    expect(KEPT.filter(([seed, kept]) => governingModifierWordsOf(TOWN.get(seed)) !== kept).map(([s]) => s)).toEqual([]);
  });
});
