/**
 * TAIL-HOUSES-4 batch 6 (2026-11-15; the chair's H17; READ-ALL WORKLIST-HOUSES B02898 and its two siblings, and the
 * H1 candidate B13370): a Fisher's landing is described landing and curing its catch, "the chief source of protein",
 * where the record's fisheries are spent and none live (`config.nearbyResourcesDepleted` holds every fishing resource
 * the town has): false in 12 of the 76 census landings. The `fish` atom cannot tell (it holds wherever fish is a food
 * source, spent or not), and the vocabulary has no spent-resource word, so the three texts (the catalogue line and the
 * two variants) take THE ONE HEDGE FORM, "whenever fish can be had": text only, the same pools, hash and index. No
 * draw moved.
 *
 * THIS FILE REDS WHEN a census town whose fisheries are spent prints a landing's old unhedged claim again (each pair:
 * the seed, the old words that must not print, the hedge that prints instead); KEEP: a town with a live fishery still
 * prints its landing's racks.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

/** A census town, as its births script makes it. */
const bornCensus = (/** @type {string} */ seed) => {
  const forced = /^r2s-(.+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  const calm = /^r2r-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  const tier = forced ? forced[2] : /** @type {RegExpExecArray} */ (calm)[1];
  const cfg = forced ? { ...DEFAULT_CONFIG, ...dials, settType: tier, selectedStressesRandom: false, selectedStresses: [forced[1]] } : { ...DEFAULT_CONFIG, ...dials, settType: tier };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
};
const HOUSE = "Fisher's landing";
/** @param {any} t */
const landing = (t) => (t.institutions || []).find((/** @type {any} */ i) => i.name === HOUSE)?.desc;
/** Every fishing resource the town has is spent. @param {any} t */
const fishSpent = (t) => {
  const depleted = t.config?.nearbyResourcesDepleted || [];
  const live = (t.config?.nearbyResources || []).filter((/** @type {string} */ k) => !depleted.includes(k));
  return depleted.some((/** @type {string} */ k) => /fish/.test(k)) && !live.some((/** @type {string} */ k) => /fish/.test(k));
};

const CRUDE = 'Near water, it is the chief source of protein.';
const JETTY = 'landed and cured.';
const ROUGH = 'salting fish. Primary protein source';
const HEDGE = 'whenever fish can be had';

/** [seed, the old words (must not print), the hedge (prints instead)]: the 12 census landings whose fisheries are spent. */
const RED = [
  ['r2r-hamlet-10', JETTY, HEDGE],
  ['r2s-indebted-hamlet-1', JETTY, HEDGE],
  ['r2r-village-11', CRUDE, HEDGE],
  ['r2r-village-35', CRUDE, HEDGE],
  ['r2s-under_siege-village-1', CRUDE, HEDGE],
  ['r2s-indebted-village-1', CRUDE, HEDGE],
  ['r2s-infiltrated-hamlet-0', CRUDE, HEDGE],
  ['r2s-wartime-hamlet-0', CRUDE, HEDGE],
  ['r2r-village-45', ROUGH, HEDGE],
  ['r2r-village-53', ROUGH, HEDGE],
  ['r2s-indebted-village-2', ROUGH, HEDGE],
  ['r2s-religious_conversion-village-3', ROUGH, HEDGE],
];

/** [seed, the words its landing still names]: a live fishery, each text: green before and after. */
const KEEP = [
  ['r2r-hamlet-5', 'salting-and-drying racks'],
  ['r2r-hamlet-8', 'racks for drying and salting the catch'],
  ['r2r-hamlet-17', 'racks for drying and salting fish'],
];

describe("TAIL-HOUSES-4 batch 6: a Fisher's landing claims its catch only in the one hedge form where the fisheries are spent", () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  test('where every fishery is spent, the landing prints the hedge, not the old claim', () => {
    expectNoSeedFailures(collectSeedFailures(RED.map((r) => r.join('|')), (key) => {
      const [seed, old, now] = key.split('|');
      const t = bornCensus(seed);
      const text = landing(t);
      expect(text, `${seed} prints a ${HOUSE}`).toBeDefined();
      expect(fishSpent(t), `${seed}: the record's fisheries are spent`).toBe(true);
      expect(String(text).toLowerCase(), seed).toContain(now); // the hedge may open its sentence
      // anchored: the same landing text (lowercased) is shown directly above to carry the hedge
      expect(String(text), seed).not.toContain(old);
    }), 'a spent fishery keeps no unhedged landing');
  }, 600_000);

  test('KEEP: a live fishery still prints its landing', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP.map((r) => r.join('|')), (key) => {
      const [seed, words] = key.split('|');
      const t = bornCensus(seed);
      expect(fishSpent(t), `${seed}: a live fishery`).toBe(false);
      expect(String(landing(t)), seed).toContain(words);
    }), 'the true sibling still prints');
  }, 600_000);
});
