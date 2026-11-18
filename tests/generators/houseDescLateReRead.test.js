/**
 * TAIL-HOUSES-5 batch 8 (2026-11-15; the chair's ruling H20 (ii), vetoable by the owner): THE LATE RE-READ REACHES A
 * HOUSE'S DESCRIPTION. A description whose claim is true or false by the POWERS is drawn before the powers exist; it is
 * declared in `institutionDescVariants.js :: DESC_LATE_SIBLINGS` (never read by the draw: nothing is drawn differently)
 * and `assembleSettlement.js :: readHouseDescsLate`, after the last roster write, stores its twin where the SETTLED
 * record refuses it.
 *
 *   the Household elder (READ-ALL 03029, 00186, 14950; the catalogue line with them): "speaks for the settlement" alone,
 *     unchosen: true only under one elder ruler (`ruler: elder`, not `ruling body`); every census Household elder sits
 *     under an Elder or a Household Council (37 of 37), so every one prints its twin.
 *   the Merchant oligarchy (X9 16785; its two siblings with it): civic power "solely", "monopolise", "exclusive": false
 *     where another power stands at Significant or above (`rival power`: 23 of 37); those print the twin.
 *
 * THIS FILE REDS WHEN a census town prints the refused claim again (each pair: the seed, the house, the words that must
 * not print, the twin's words that print instead, with the record's fact asserted), when a town the record admits
 * loses the original (KEEP), or when the late pass leaves its place after the last roster write.
 */
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, test } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { DESC_LATE_SIBLINGS } from '../../src/data/institutionDescVariants.js';
import { DESC_VARIANT_COLOUR_DECLARATIONS } from '../../src/data/institutionDescColour.js';
import { resolveSibling } from '../../src/domain/facts/drawDeclared.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { rivalPowerOf } from '../../src/domain/facts/rivalPower.js';
import { rulingBodyOf } from '../../src/domain/facts/rulingBody.js';

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
const ELDER = 'Household elder';
const OLIGARCHY = 'Merchant oligarchy';
/** The record's fact that refuses the original: a ruling body (the elder), a rival of standing (the oligarchy). */
const refusedBy = (/** @type {any} */ t, /** @type {string} */ house) => (house === ELDER ? rulingBodyOf(t) === true : rivalPowerOf(t) === true);

/** [seed, house, the refused words (must not print), the twin's words (print instead)] */
const RED = [
  ['r2r-thorp-2', ELDER, 'speaks for the settlement without ever being chosen', 'is the door people knock on first'],
  ['r2r-thorp-6', ELDER, 'speaks for the settlement without ever being chosen', 'is the door people knock on first'],
  ['r2r-thorp-5', ELDER, "carries the settlement's voice", 'is heard first on the'],
  ['r2r-thorp-21', ELDER, "carries the settlement's voice", 'is heard first on the'],
  ['r2r-thorp-28', ELDER, 'acts as de facto voice for the', 'is the person everyone goes to first'],
  ['r2r-thorp-49', ELDER, 'acts as de facto voice for the', 'is the person everyone goes to first'],
  ['r2r-city-39', OLIGARCHY, 'belongs solely to the wealthy merchant families', 'Civic power rests with the wealthy merchant families'],
  ['r2s-occupied-town-1', OLIGARCHY, 'belongs solely to the wealthy merchant families', 'Civic power rests with the wealthy merchant families'],
  ['r2r-town-10', OLIGARCHY, 'monopolise power here', 'hold the seat of power here'],
  ['r2r-city-43', OLIGARCHY, 'monopolise power here', 'hold the seat of power here'],
  ['r2r-town-45', OLIGARCHY, 'hold exclusive civic power', 'hold the civic offices'],
  ['r2r-city-30', OLIGARCHY, 'hold exclusive civic power', 'hold the civic offices'],
];

/** [seed, house, the original's words]: the settled record admits the original (no rival of standing): green before and after. */
const KEEP = [
  ['r2r-city-23', OLIGARCHY, 'Civic power belongs solely to the wealthy merchant families'],
  ['r2r-city-11', OLIGARCHY, 'monopolise power here'],
  ['r2r-city-29', OLIGARCHY, 'hold exclusive civic power'],
];

describe('TAIL-HOUSES-5 batch 8: the late re-read reaches a house description (H20 (ii))', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  test('a refused claim prints its twin, the record\'s refusing fact asserted', () => {
    expectNoSeedFailures(collectSeedFailures(RED.map((r) => r.join('|')), (key) => {
      const [seed, house, old, now] = key.split('|');
      const t = bornCensus(seed);
      const text = textOf(t, house);
      expect(text, `${seed} prints a ${house}`).toBeDefined();
      expect(refusedBy(t, house), `${seed}: the settled record refuses the original`).toBe(true);
      expectAbsentWithAnchor(String(text), old, now, `${seed} ${house}: the old words out, the cure's words in the same slot`);
    }), 'a house description claims no power the settled record denies');
  }, 600_000);

  test('KEEP: where the settled record admits it, the original prints', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP.map((r) => r.join('|')), (key) => {
      const [seed, house, words] = key.split('|');
      const t = bornCensus(seed);
      expect(refusedBy(t, house), `${seed}: no rival of standing`).toBe(false);
      expect(String(textOf(t, house)), `${seed} ${house}`).toContain(words);
    }), 'the admitted original still prints');
  }, 600_000);

  test('KEEP: under one elder ruler (a headman) the Household elder keeps its original; under a council, its twin', () => {
    const headman = factsOf({ powerStructure: { government: "Headman's Authority", factions: [] } });
    const council = factsOf({ powerStructure: { government: 'Elder Council', factions: [] } });
    for (const [key, set] of Object.entries(DESC_LATE_SIBLINGS)) {
      if (!/household head/i.test(key)) continue;
      const twin = set.find((/** @type {any} */ l) => l.twinOf === key);
      expect(resolveSibling(key, DESC_LATE_SIBLINGS, { facts: headman })).toBe(key);
      expect(resolveSibling(key, DESC_LATE_SIBLINGS, { facts: council })).toBe(twin.text);
    }
  });

  test('the table: every key is an original with one twin, and none is a colour line', () => {
    // BAR4-HOUSES (2026-11-16, H1 (ii) and (iii)): 8 → 11, the commercial sawmill's two timber lines and the town council's
    // "answers to no one" (their guard: tests/generators/bar4HousesPresumptions.test.js)
    // BAR5-MARKS (2026-11-16, L2; JOIN-16 point 1, re-pinned by CLOSE-DOORS-1A at the close of 2026-11-18): 11 → 26, the
    // fifteen lines the fact leaves under a crisis: the bowyers' and fletchers' seven, the hired company's billet three, the
    // cobbler's three, the metropolitan cathedral's three
    // BAR6-HOUSES (2026-11-16, SV1 and LAW 5 widened; JOIN-17 point 2, re-pinned by CLOSE-DOORS-1A): 26 → 30, the weekly
    // market's and the message network's crown lines (`sovereign`) and the brewery's two tavern lines
    // FAULTS-ROWS (2026-11-18, the sixth chair's FR3): 30 → 32, the Annual fair's two luxury lines read on `need not brought
    // in: luxury` (their guard: tests/generators/faultsRows.test.js)
    // FAULTS-ROWS (2026-11-18, the chair's FR12 (1)): 32 → 33, the fair's third line ("with fine goods on offer")
    // FAULTS-ROWS (2026-11-18, the chair's FR12 (2)): 33 → 35, the luxury quarter's two lines (their colour marks struck)
    // FAULTS-ROWS (2026-11-18, the chair's FR12 (3)): 35 → 36, the fish market's card on `fish bought in`
    // FAULTS-ROWS (2026-11-18, the chair's FR20 (2)): 36 → 38, the fish card's two siblings (the catalogue line and #0)
    expect(Object.keys(DESC_LATE_SIBLINGS)).toHaveLength(38);
    for (const [key, set] of Object.entries(DESC_LATE_SIBLINGS)) {
      expect(set).toHaveLength(2);
      expect(set[0].text).toBe(key);
      expect(set[1].twinOf).toBe(key);
      expect(Object.prototype.hasOwnProperty.call(DESC_VARIANT_COLOUR_DECLARATIONS, key), key).toBe(false);
    }
  });

  test('THE PLACE: the late pass runs after the label close (the last roster write) and the stress late re-read', () => {
    const src = readFileSync(new URL('../../src/generators/steps/assembleSettlement.js', import.meta.url), 'utf8');
    const close = src.indexOf('resolveFactionLabelsAtClose(settlement);');
    const stress = src.indexOf('for (const [e, kept] of stressLateReads) readStressEntry(e, kept);');
    const late = src.indexOf('readHouseDescsLate(settlement);');
    expect(close).toBeGreaterThan(0);
    expect(stress).toBeGreaterThan(close);
    expect(late).toBeGreaterThan(stress);
    expect(late).toBeLessThan(src.indexOf('settlement.simulationTrace = ctx.simulationTrace'));
  });
});
