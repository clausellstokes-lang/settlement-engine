/**
 * TAIL-HOUSES-5 batch 10 (2026-11-15; the chair's ruling H20 (i) and its item (3), vetoable by the owner): a house claims
 * its own trade, not a politics or a town's living the record does not bear.
 *
 *   the city's Merchant guilds (15-40) (READ-ALL 15890, 15765, 02600): "Powerful political force." / "A force to be
 *     reckoned with in politics." / "Politically, a power in their own right." where no merchant, guild or trade power
 *     stands among the record's powers (16 of 42, 7 of 32, 8 of 33). The vocabulary holds no atom for a merchant power
 *     (`rival power` is any power's; `guild` holds wherever this house stands), so no twin can key: the three lines
 *     claim the guilds' trade instead (replacing 76 true lines: told to the chair before the push).
 *   the Woodcutter's camp (tonight's read of the newest lines): "Timber and the hauling of it keep the place alive." /
 *     "The settlement's living is timber and the carting of it." where timber is in none of the town's income sources
 *     (15 of 18: the harvest is most of the income); no atom reads the income or the exports by good, so the lines
 *     claim the camp's and the crews' own living.
 *
 * THIS FILE REDS WHEN a census town prints the old words again (each pair: the seed, the house, the old words that must
 * not print, the rewording's words that print instead, with the record's fact asserted).
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
const MG = 'Merchant guilds (15-40)';
const WC = "Woodcutter's camp";
/** The record bears no merchant power (the merchants' politics) / no timber income (the town's living). */
const MERCHANT_POWER = /merchant|guild|trade|mercantile|consortium|oligarch/i;
const denied = (/** @type {any} */ t, /** @type {string} */ house) => (house === MG
  ? !(t.powerStructure?.factions || []).some((/** @type {any} */ f) => MERCHANT_POWER.test(String(f.faction)) && !/thie/i.test(String(f.faction)))
  : !(t.economicState?.incomeSources || []).some((/** @type {any} */ s) => /timber/i.test(String(s.source))));

/** [seed, house, the old words (must not print), the rewording's words (print instead)] */
// BAR2-CLOSE-SWEEP-B (2026-11-15): BAR2-PLACES batch 1 (0d36c3820, PL4; its hand-back's row C0434) reworded the three Merchant
// guilds (15-40) lines again to claim no power where no merchant power stands; the nine MG rows read those words, the old
// politics words still out.
const RED = [
  ['r2r-city-6', MG, 'Powerful political force.', "They handle much of the city's trade."],
  ['r2r-city-42', MG, 'Powerful political force.', "They handle much of the city's trade."],
  ['r2r-city-48', MG, 'Powerful political force.', "They handle much of the city's trade."],
  ['r2r-city-2', MG, 'in politics', "Much of the city's trade is in their hands."],
  ['r2r-city-27', MG, 'in politics', "Much of the city's trade is in their hands."],
  ['r2s-under_siege-city-1', MG, 'in politics', "Much of the city's trade is in their hands."],
  ['r2r-city-15', MG, 'Politically', "Between them they handle much of the city's trade."],
  ['r2r-city-44', MG, 'Politically', "Between them they handle much of the city's trade."],
  ['r2r-city-54', MG, 'Politically', "Between them they handle much of the city's trade."],
  ['r2r-village-3', WC, 'keep the place alive', "are the camp's whole living"],
  ['r2r-village-20', WC, 'keep the place alive', "are the camp's whole living"],
  ['r2s-occupied-village-1', WC, 'keep the place alive', "are the camp's whole living"],
  ['r2r-hamlet-21', WC, "The settlement's living is timber", 'The crews live by timber'],
  ['r2r-hamlet-46', WC, "The settlement's living is timber", 'The crews live by timber'],
  ['r2r-village-29', WC, "The settlement's living is timber", 'The crews live by timber'],
];

/** [seed, house, the words its text still names]: the town's Merchant guilds (3-8) keep their trade line; green before and after. */
const KEEP = [
  ['r2r-town-6', 'Merchant guilds (3-8)', 'Each holds a grip on the trade in its particular wares'],
  ['r2r-town-1', 'Merchant guilds (3-8)', 'Each holds a grip on the trade in its particular wares'],
];

describe('TAIL-HOUSES-5 batch 10: a house claims its own trade, not a politics or a living the record does not bear', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  test('the town prints the rewording, not the old words', () => {
    expectNoSeedFailures(collectSeedFailures(RED.map((r) => r.join('|')), (key) => {
      const [seed, house, old, now] = key.split('|');
      const t = bornCensus(seed);
      const text = textOf(t, house);
      expect(text, `${seed} prints a ${house}`).toBeDefined();
      expect(denied(t, house), `${seed}: the record does not bear the old claim`).toBe(true);
      expectAbsentWithAnchor(String(text), old, now, `${seed} ${house}: the old words out, the cure's words in the same slot`);
    }), 'a house claims its own trade');
  }, 600_000);

  test('KEEP: the true sibling still prints', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP.map((r) => r.join('|')), (key) => {
      const [seed, house, words] = key.split('|');
      expect(String(textOf(bornCensus(seed), house)), `${seed} ${house}`).toContain(words);
    }), 'the true sibling still prints');
  }, 600_000);
});
