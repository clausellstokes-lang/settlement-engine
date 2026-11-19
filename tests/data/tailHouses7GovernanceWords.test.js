/**
 * TAIL-HOUSES-4 batch 7 (2026-11-15; the chair's H18 (i) and batch 2's shape): a governing house's text claims who
 * governs where the record's government denies it, or gives its one person a sex. "City administration" (the city's
 * and the metropolis's government house) is described "less formally constituted than a council" / "a looser
 * arrangement than a council": every census town that prints one is governed by a council (26, 26, 18, 15 of the
 * same; READ-ALL B14388, 02783, B03373, 20218); the three texts now claim the house's own trade (its officials carry
 * out the city's business, whoever sits above it), not who governs. "Lord's appointee": "A man of the lord's
 * choosing governs" where the appointee is a woman (5 of 6; READ-ALL 02794, X9 15791): now "One of the lord's
 * choosing". Text only: the same pools, hash and index; no draw moved; no power atom read (H18).
 *
 * THIS FILE REDS WHEN a census town prints the old words again (each pair: the seed, the house, the old words that
 * must not print, the rewording's words that print instead).
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
/** @param {any} t */
const governedByCouncil = (t) => /Council|Senate|Assembly/.test(String(t.powerStructure?.government));
const ADMIN = 'City administration';
const APPOINTEE = "Lord's appointee";

/** [seed, house, the old words (must not print), the rewording's words (print instead)] */
const RED = [
  ['r2r-city-1', ADMIN, 'A looser arrangement than a council', 'whoever gives the orders'],
  ['r2r-city-5', ADMIN, 'A looser arrangement than a council', 'whoever gives the orders'],
  ['r2r-city-24', ADMIN, 'A looser arrangement than a council', 'whoever gives the orders'],
  ['r2r-city-8', ADMIN, 'Less formally constituted than a council', 'whoever sits above it'],
  ['r2r-city-32', ADMIN, 'Less formally constituted than a council', 'whoever sits above it'],
  ['r2r-city-44', ADMIN, 'Less formally constituted than a council', 'whoever sits above it'],
  ['r2r-city-35', ADMIN, 'less formally constituted than a council', 'whatever rules above it'],
  ['r2r-metropolis-1', ADMIN, 'less formally constituted than a council', 'whatever rules above it'],
  ['r2r-metropolis-14', ADMIN, 'less formally constituted than a council', 'whatever rules above it'],
  ['r2r-town-37', APPOINTEE, "A man of the lord's choosing", "One of the lord's choosing"],
  ['r2r-town-59', APPOINTEE, "A man of the lord's choosing", "One of the lord's choosing"],
];

/** [seed, house, the words its text still names]: green before and after. */
const KEEP = [
  ['r2s-under_siege-town-2', APPOINTEE, 'noble authority overrides whatever the town was accustomed to'],
  ['r2r-town-54', APPOINTEE, "Rule falls to the lord's appointee"],
];

describe('TAIL-HOUSES-4 batch 7: a governing house claims its own trade, not a government or a sex the record denies', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  test('the town prints the rewording, not the old words', () => {
    expectNoSeedFailures(collectSeedFailures(RED.map((r) => r.join('|')), (key) => {
      const [seed, house, old, now] = key.split('|');
      const t = bornCensus(seed);
      const text = textOf(t, house);
      expect(text, `${seed} prints a ${house}`).toBeDefined();
      if (house === ADMIN) expect(governedByCouncil(t), `${seed}: the record's government is a council`).toBe(true);
      expectAbsentWithAnchor(String(text), old, now, `${seed} ${house}`);
    }), 'a governing house claims nothing the record denies');
  }, 600_000);

  test('KEEP: the true sibling still prints', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP.map((r) => r.join('|')), (key) => {
      const [seed, house, words] = key.split('|');
      expect(String(textOf(bornCensus(seed), house)), `${seed} ${house}`).toContain(words);
    }), 'the true sibling still prints');
  }, 600_000);
});
