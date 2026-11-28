/**
 * TAIL-HOUSES-2 batch 4 (2026-11-15; READ-ALL WORKLIST-HOUSES, the chair's ruling H7 and its note of 00:38 UTC): a house
 * text names what the record denies in ordinary times, and batch 1's hedges take one form. The cartographers' guild names sea charts in a city with no coast (a
 * coast twin, DESC_VARIANT_SIBLINGS); a market charter or a message station names a crown or a noble the ruler is not; a
 * woodcutters' camp lives by charcoal wood where no charcoal burner stands. Each is reworded to claim no more than every
 * printing town bears. And batch 1's input hedges are brought to the one form "whenever <input> can be had" (the
 * vintner's and the glassblower's left as they stand: the record denies their input in every town that holds them).
 * No draw moved.
 *
 * THIS FILE REDS WHEN a census town where the record denies the old claim prints the old text again (each pair: the
 * seed, the house, the old text's words that must not print, the rewording's words that print in its place), or when
 * the house's text is no longer drawn there at all (the rewording is asserted present).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { atomHolds } from '../../src/domain/facts/factVocabulary.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { INSTITUTION_DESC_VARIANTS, DESC_VARIANT_SIBLINGS } from '../../src/data/institutionDescVariants.js';

const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

/** A census town, as its births script makes it. */
const bornCensus = (/** @type {string} */ seed) => {
  const forced = /^r2s-(.+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  const calm = /^r2r-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  const tier = forced ? forced[2] : /** @type {RegExpExecArray} */ (calm)[1];
  const cfg = forced ? { ...DEFAULT_CONFIG, ...dials, settType: tier, selectedStressesRandom: false, selectedStresses: [forced[1]] } : { ...DEFAULT_CONFIG, ...dials, settType: tier };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
};
/** @type {Map<string, any>} */ const born = new Map();
const town = (/** @type {string} */ seed) => { if (!born.has(seed)) born.set(seed, bornCensus(seed)); return born.get(seed); };
/** @param {any} t @param {string} name */
const instOf = (t, name) => (t.institutions || []).find((/** @type {any} */ i) => i.name === name);

/** What makes the old claim false in that town, read off the record. @type {Record<string, (t: any) => boolean>} */
const DENIED = {
  coast: (t) => atomHolds('coast', factsOf(t)) !== true,
  crown: (t) => atomHolds('ruler: lord', factsOf(t)) !== true,
  charcoal: (t) => !instOf(t, 'Charcoal burner'),
};

/** [seed, house, what denies it, the old text's words (must not print), the rewording's words (print instead)] */
const RED = [
  ['r2r-city-0', "Cartographer's guild", 'coast', 'sea charts', 'producing regional maps, property surveys'],
  ['r2r-metropolis-54', 'Message network (high magic)', 'crown', 'only the crown', 'only the richest powers keep one'],
  ['r2r-town-1', 'Weekly market', 'crown', 'Held by royal charter.', 'Held by charter.'],
  ['r2r-town-0', 'Weekly market', 'crown', 'Requires a charter from the crown.', 'Requires a market charter.'],
  ['r2r-town-2', 'Weekly market', 'crown', 'Royal charter required.', 'Charter required.'],
  ['r2r-village-14', 'Weekly market', 'crown', 'Requires royal/noble charter.', 'Requires a charter.'],
  ['r2r-village-25', 'Weekly market', 'crown', 'Held under royal or noble charter.', 'Held under charter.'],
  ["r2r-hamlet-21", "Woodcutter's camp", 'charcoal', 'wood for the charcoal kilns', 'The crews live by timber and the carting of it.'],
  ["r2r-hamlet-12", "Woodcutter's camp", 'charcoal', 'Timber, charcoal wood', 'Timber and the hauling of it are the camp\'s whole living.'],
];

/** [seed, house, the words its text still names] — true siblings: green before and after. */
const KEEP = [
  ['r2r-city-9', "Cartographer's guild", 'sea charts'],
  ['r2s-indebted-hamlet-0', "Woodcutter's camp", 'timber'],
  ['r2s-indebted-hamlet-0', 'Charcoal burner', 'charcoal'],
];

/** Batch 1's hedge forms before the one form (the chair's note, 00:38 UTC); the vintner's and glassblower's stand. */
const OLD_HEDGES = [/when there is clay/, /as far as the clay/, /clay reaches/, /beasts to (milk|run)/, /where one can be kept/, /beasts can be kept/, /saline source can be had/, /\bwhen brine can be had/, /wood to burn/, /whatever wood can be had/, /logs reach/, /\bwhen hides can be had/, /whenever they can be had/, /fish to be had/, /whatever catch/, /\bwhen fish can be had/, /ore reaches/];

/** Every description text of the catalogue and the variant table (and their twins). */
const allTexts = () => {
  /** @type {string[]} */ const out = [];
  for (const cats of Object.values(institutionalCatalog)) for (const houses of Object.values(/** @type {any} */ (cats))) for (const h of Object.values(/** @type {any} */ (houses))) if (h && typeof h.desc === 'string') out.push(h.desc);
  for (const pair of Object.values(INSTITUTION_DESC_VARIANTS)) for (const v of /** @type {any[]} */ (pair)) out.push(typeof v === 'string' ? v : v?.text);
  for (const set of Object.values(DESC_VARIANT_SIBLINGS)) for (const l of /** @type {any[]} */ (set)) out.push(l?.text);
  return out.filter((x) => typeof x === 'string');
};

describe('TAIL-HOUSES-2 batch 4: a house text claims no coast, crown or charcoal the record denies; one hedge form', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  test('where the record denies the old claim, the house prints the rewording, not the old text', () => {
    expectNoSeedFailures(collectSeedFailures(RED.map((r) => r.join('|')), (key) => {
      const [seed, house, denied, old, now] = key.split('|');
      const t = town(seed);
      const inst = instOf(t, house);
      expect(inst, `${seed} holds a ${house}`).toBeDefined();
      expect(DENIED[denied](t), `${seed}: the record denies the ${house}'s old claim (${denied})`).toBe(true);
      expectAbsentWithAnchor(String(inst.desc), old, now, `${seed} ${house}`);
    }), 'a house text claims nothing the record denies');
  }, 600_000);

  test('KEEP: the true sibling still prints (a coastal city keeps its sea charts)', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP.map((r) => r.join('|')), (key) => {
      const [seed, house, words] = key.split('|');
      const inst = instOf(town(seed), house);
      expect(inst, `${seed} holds a ${house}`).toBeDefined();
      expect(String(inst.desc), `${seed} ${house}`).toContain(words);
    }), 'the true sibling still prints');
  }, 600_000);

  test('ONE HEDGE FORM: no description text keeps one of batch 1\'s older hedges', () => {
    const texts = allTexts();
    const left = OLD_HEDGES.flatMap((re) => texts.filter((x) => re.test(x)).map((x) => `${re}: ${x}`));
    expect(left, 'each such hedge reads "whenever <input> can be had"').toEqual([]);
  });
});
