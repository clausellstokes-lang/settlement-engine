/**
 * TAIL-HOUSES-5 batch 11 (2026-11-15; the three rows TAIL-HOUSES-4 left, by the chair's ruling H20): the Hunter's lodge
 * "sends out hunting parties" where the town has no hunting grounds (READ-ALL 17650: 6 of 6): THE ONE HEDGE FORM, the
 * hedge governing the verb ("Whenever game can be had, it sends out ..."). The Customs house's no-docks twins name "the
 * main roads" where the town is isolated (B11971 6 of 71, B06555 1 of 36): a twin's own twin is not read at the draw,
 * so the third text is resolved at the late re-read (`DESC_LATE_SIBLINGS`, `route: isolated`): "by road" / "along the
 * road". (17954, "Several inn districts" in a city under 5,000: the population band reads every city `large`: NAMED
 * for the size class, not cured.)
 *
 * THIS FILE REDS WHEN a census town prints the old words again (the record's fact asserted), or a road town loses its
 * main roads (KEEP).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

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

/** @param {any} t @param {string} house */
const textOf = (t, house) => (t.institutions || []).find((/** @type {any} */ i) => i.name === house)?.desc;
const HL = "Hunter's lodge";
const CH = 'Customs house';
const HUNTING = /hunting|game|forest|grove/i;
const denied = (/** @type {any} */ t, /** @type {string} */ house) => (house === HL
  ? !(t.config?.nearbyResources || []).some((/** @type {string} */ r) => HUNTING.test(r))
  : t.config?.tradeRouteAccess === 'isolated');

/** [seed, house, the old words (must not print), the cure's words (print instead)] */
const RED = [
  ['r2r-village-2', HL, 'Sends out hunting parties', 'Whenever game can be had, it sends out hunting parties'],
  ['r2r-town-34', HL, 'Sends out hunting parties', 'Whenever game can be had, it sends out hunting parties'],
  ['r2s-famine-town-1', HL, 'Sends out hunting parties', 'Whenever game can be had, it sends out hunting parties'],
  ['r2r-town-12', CH, 'by the main roads', 'entering and leaving by road.'],
  ['r2r-city-20', CH, 'by the main roads', 'entering and leaving by road.'],
  ['r2r-metropolis-9', CH, 'by the main roads', 'entering and leaving by road.'],
  ['r2r-metropolis-44', CH, 'along the main roads', 'passing along the road.'],
];

/** [seed, house, the words its text still names]: a road town keeps its main roads; green before and after. */
const KEEP = [
  ['r2r-town-8', CH, 'entering and leaving by the main roads'],
  ['r2r-city-1', CH, 'passing along the main roads'],
];

describe("TAIL-HOUSES-5 batch 11: the Hunter's lodge's hedge and the customs house's isolated twin", () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  test('the town prints the cure, not the old words', () => {
    expectNoSeedFailures(collectSeedFailures(RED.map((r) => r.join('|')), (key) => {
      const [seed, house, old, now] = key.split('|');
      const t = bornCensus(seed);
      const text = textOf(t, house);
      expect(text, `${seed} prints a ${house}`).toBeDefined();
      expect(denied(t, house), `${seed}: the record does not bear the old claim`).toBe(true);
      expectAbsentWithAnchor(String(text), old, now, `${seed} ${house}: the old words out, the cure's words in the same slot`);
    }), 'no hunting party or main road the record denies');
  }, 600_000);

  test('KEEP: a road town keeps its main roads', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP.map((r) => r.join('|')), (key) => {
      const [seed, house, words] = key.split('|');
      expect(String(textOf(bornCensus(seed), house)), `${seed} ${house}`).toContain(words);
    }), 'the true sibling still prints');
  }, 600_000);
});
