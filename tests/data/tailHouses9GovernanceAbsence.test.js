/**
 * TAIL-HOUSES-5 batch 9 (2026-11-15; the chair's ruling H20 (i), vetoable by the owner): a governing house's text claims
 * an ABSENCE of government or an ELECTION the record's government denies, in every town that prints it. The Town
 * council (READ-ALL 29000, 28852, 03522; X9 29354, 29353, 29352): "no formal government in place", "where nothing
 * official exists", "in the absence of formal authority", where every printing town is governed by a named council
 * (24 of 24); the Village elder (21211 and its two siblings): "in the absence of formal authority", "in the want of
 * any formal power", "where no formal authority exists", under an Elder, a Household or a Priestly government (24 of
 * 24); the city's and the metropolis's Mayor and council (03508, 02461 and the catalogue line): "elected", "put in by
 * vote", under theocratic, merchant, military, arcane and other councils (29; true in a handful at most). The nine
 * texts are reworded to claim the house's own business and standing, not who governs or how it came to office: text
 * only, the same pools, hash and index; no draw moved; no power atom read.
 *
 * THIS FILE REDS WHEN a census town prints the old words again (each pair: the seed, the house, the old words that
 * must not print, the rewording's words that print instead, with the record's government asserted).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { INSTITUTION_DESC_VARIANTS } from '../../src/data/institutionDescVariants.js';

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
const TC = 'Town council';
const VE = 'Village elder';
const MC = 'Mayor and council';
/**
 * The Village elder's pool as the draw reads it ([catalogue desc, ...variants], index-stable), so its anchors are computed,
 * not spelt: TAIL-CLOSE-POOLS-3 reworded two of its members under the style law (`rather-than` struck) and the anchors moved
 * with them. @type {string[]}
 */
const VE_POOL = [String(institutionalCatalog.village.Government[VE].desc), ...INSTITUTION_DESC_VARIANTS[`village|Government|${VE}`]];

/** [seed, house, the old words (must not print), the rewording's words (print instead)] */
const RED = [
  ['r2r-town-1', TC, 'With no formal government in place', 'sees to the town\'s common business'],
  ['r2r-town-29', TC, 'With no formal government in place', 'sees to the town\'s common business'],
  ['r2r-town-13', TC, 'Where nothing official exists', 'settle its common business by consensus'],
  ['r2r-town-16', TC, 'Where nothing official exists', 'settle its common business by consensus'],
  ['r2s-famine-town-3', TC, 'in the absence of formal authority', 'sees to the town\'s common affairs'],
  ['r2s-occupied-town-0', TC, 'in the absence of formal authority', 'sees to the town\'s common affairs'],
  ['r2r-village-4', VE, 'in the absence of formal authority', VE_POOL[0]],
  ['r2r-village-15', VE, 'Where no formal authority exists', VE_POOL[2]],
  ['r2r-village-19', VE, 'In the want of any formal power', VE_POOL[1]],
  ['r2r-city-0', MC, 'An elected council', 'A civic council backed by a complete administrative staff'],
  ['r2r-city-12', MC, 'An elected council', 'A civic council backed by a complete administrative staff'],
  ['r2r-city-6', MC, 'Elected civic council', 'Civic council with full administrative apparatus'],
  ['r2r-city-45', MC, 'Elected civic council', 'Civic council with full administrative apparatus'],
  ['r2r-metropolis-40', MC, 'put in by vote', 'A civic council with the full apparatus of office beneath it'],
  ['r2r-metropolis-45', MC, 'put in by vote', 'A civic council with the full apparatus of office beneath it'],
];

/** [seed, house, the words its text still names]: the true siblings (the town tier's hedged Mayor and council), green before and after. */
const KEEP = [
  ['r2r-town-0', MC, 'whether elected or named to office'],
  ['r2r-town-3', MC, 'Elected or appointed town leadership'],
  ['r2r-town-6', MC, 'come to office by vote or appointment'],
];

describe('TAIL-HOUSES-5 batch 9: a governing house claims no absence of government and no election the record denies', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  test('the town prints the rewording, not the old words', () => {
    expectNoSeedFailures(collectSeedFailures(RED.map((r) => r.join('|')), (key) => {
      const [seed, house, old, now] = key.split('|');
      const t = bornCensus(seed);
      const text = textOf(t, house);
      expect(text, `${seed} prints a ${house}`).toBeDefined();
      expect(String(t.powerStructure?.government), `${seed}: the record names a government`).not.toBe('undefined');
      expectAbsentWithAnchor(String(text), old, now, `${seed} ${house}: the old words out, the cure's words in the same slot`);
    }), 'a governing house claims no absence of government and no election');
  }, 600_000);

  test('KEEP: the true sibling still prints', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP.map((r) => r.join('|')), (key) => {
      const [seed, house, words] = key.split('|');
      expect(String(textOf(bornCensus(seed), house)), `${seed} ${house}`).toContain(words);
    }), 'the true sibling still prints');
  }, 600_000);
});
