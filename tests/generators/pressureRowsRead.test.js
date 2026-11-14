/**
 * tests/generators/pressureRowsRead.test.js — R2-CODE-A-6, CENSUS-2's writers in this lane's files
 * (`narrativeText.js :: PRESSURE_SENTENCES`, the hand-back's step 4 row): four rows said what the town lacks.
 * - wartime (losing)[2] "a workshop closed for want of a master" where the roster holds no house of craft: the
 *   workshop only where one stands (genPressureDetail's hasWorkshop; an "Access to" row is not one); a branch
 *   inside the drawn row.
 * - succession_void[5] "whoever the merchants and the creditors decide" where the roster holds no market: `market`.
 * - insurgency (criminal)[1] "The streets of X have gone quiet" and slave_revolt[0] "the enslaved hold whole
 *   districts" below the middling band: `population: ≥ middling` (the chair's ruling (f)).
 * - R2-CODE-A-7 (the hand-back's step 1 item 1; record 422): religious_conversion[1] "the courts are not equipped"
 *   in a town with no courthouse. RULED: the page names a court only where a courthouse stands on the roster; elsewhere
 *   the line speaks of the governing council (genPressureDetail's hasCourt; a branch inside the drawn row).
 * - R2-CODE-A-7 (step 1 item 2): POLITICAL_FLAVOR.economic_heavy[0] "didn't create the merchant class here" in towns
 *   whose roster holds no market (r2s-occupied-village-0): `market`; a refused row resolves to the hash argmax over the
 *   pool's admitted rows (historyCoherence.js :: flavorOf), only on the refused births.
 * A declared row refused resolves draw-free to the next admitted one (generatePressureSentence).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { PRESSURE_SENTENCES, POLITICAL_FLAVOR } from '../../src/generators/narrativeText.js';
import { declarationOf } from '../../src/domain/facts/factVocabulary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { clearActiveRng, setActiveRng } from '../../src/kernel/rngContext.js';

describe('A1 the rows declare what they name', () => {
  it('the workshop only where a house of craft stands', () => {
    const losing = { name: 'X', compound: { militaryEffective: 10, economyOutput: 10 } };
    expect(String(PRESSURE_SENTENCES.wartime({ ...losing, hasWorkshop: true })[2])).toContain('(a workshop closed for want of a master,');
    expect(String(PRESSURE_SENTENCES.wartime({ ...losing, hasWorkshop: false })[2])).toContain('(a trade left without its master,');
  });
  it('the merchants need a market; streets and districts need the middling band', () => {
    const prev = setActiveRng(createPRNG('pressureRowsRead'));
    try { expect(/** @type {any} */ (PRESSURE_SENTENCES.succession_void({ name: 'X' })[5]).needs).toEqual(['market']); } finally { clearActiveRng(prev); }
    const crim = PRESSURE_SENTENCES.insurgency({ name: 'X', compound: { criminalEffective: 60, militaryEffective: 10, economyOutput: 10 } });
    expect(/** @type {any} */ (crim[1]).needs).toEqual(['population: ≥ middling']);
    expect(/** @type {any} */ (PRESSURE_SENTENCES.slave_revolt({ name: 'X' })[0]).needs).toEqual(['population: ≥ middling']);
  });
});

describe('A1b the courts only where a courthouse stands', () => {
  it('the court is named only on a roster that holds one', () => {
    expect(String(/** @type {any} */ (PRESSURE_SENTENCES.religious_conversion({ name: 'X', hasCourt: true })[1]).text)).toContain('that the courts are not equipped');
    const none = String(/** @type {any} */ (PRESSURE_SENTENCES.religious_conversion({ name: 'X', hasCourt: false, govFaction: 'Town Council' })[1]).text);
    // anchored: the next line asserts the same row printed its council clause
    expect(none).not.toMatch(/court/i);
    expect(none).toContain('that Town Council is not equipped to resolve quickly');
  });
});

describe('A1c the history\'s merchant class needs a market', () => {
  it('economic_heavy[0] declares `market`', () => {
    expect(declarationOf(POLITICAL_FLAVOR.economic_heavy[0]).needs).toEqual(['market']);
  });
});

describe('A2 the census towns, born in the census shape', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  /** @param {string} seed */
  const born = (seed) => { const m = /** @type {RegExpMatchArray} */ (seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/)); return /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] }), null, { seed, customContent: {} })); };
  it('guard town: the line does not say what the town lacks (every row)', () => {
    expectNoSeedFailures(collectSeedFailures([
      ['r2s-wartime-thorp-3', /a workshop/],
      ['r2s-succession_void-thorp-2', /merchants/],
      ['r2s-insurgency-thorp-0', /streets/],
      ['r2s-slave_revolt-hamlet-3', /districts/],
      ['r2s-religious_conversion-town-2', /courts/],
    ], ([seed, words]) => {
      expect(String(born(seed).pressureSentence).length, `${seed}: a pressure line printed`).toBeGreaterThan(40);
      // anchored: the line above asserts the pressure line really printed
      expect(born(seed).pressureSentence, `${seed}: the line does not say what the town lacks`).not.toMatch(words);
    }), 'guard town: the line does not say what the town lacks');
  });
  it('keeps its row where the record bears it out (every row)', () => {
    expectNoSeedFailures(collectSeedFailures([
      ['r2s-wartime-city-3', /a workshop closed/],
      ['r2s-succession_void-metropolis-3', /the merchants and the creditors/],
      ['r2s-insurgency-city-3', /^The streets of/],
      ['r2s-slave_revolt-metropolis-0', /whole districts/],
      ['r2s-religious_conversion-city-0', /the courts are not equipped/],
    ], ([seed, words]) => {
      expect(born(seed).pressureSentence, `${seed} keeps its row where the record bears it out`).toMatch(words);
    }), 'keeps its row where the record bears it out');
  });
});

describe('A3 the history\'s character, born in the census shape', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  /** @param {string} seed */
  const born = (seed) => { const m = /** @type {RegExpMatchArray} */ (seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/)); return /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] }), null, { seed, customContent: {} })); };
  it('guard town r2s-occupied-village-0 (no market): no merchant class', () => {
    expect(String(born('r2s-occupied-village-0').history.historicalCharacter).length, 'a historical character printed').toBeGreaterThan(40);
    // anchored: the line above asserts the historical character really printed
    expect(born('r2s-occupied-village-0').history.historicalCharacter).not.toMatch(/merchant class/);
  });
  it('r2s-famine-town-0 (a market) keeps the line', () => {
    expect(born('r2s-famine-town-0').history.historicalCharacter).toMatch(/didn't create the merchant class/);
  });
});

describe('A4 a famine with fewer than two powers says no one eats well (R2-CODE-A-10, CENSUS-2 b/famine:plenty)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('the census\'s thorps and hamlets at a third of their need are not told someone eats well (every row)', () => {
    expectNoSeedFailures(collectSeedFailures([['r2s-famine-thorp-0', 'thorp'], ['r2s-famine-hamlet-0', 'hamlet']], ([seed, size]) => {
      const s = /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded', settType: size, selectedStresses: ['famine'], selectedStressesRandom: false }), null, { seed, customContent: {} }));
      expect(String(s.pressureSentence), `${seed}: the famine's power line prints`).toMatch(/^Since the \w+ failed, food is power in /);
      expect(String(s.pressureSentence), `${seed}: nobody eats well`).not.toMatch(/eats? well/); // anchored: the line above asserts the same sentence prints; red at 8e6fd5e58
    }), 'a famine with fewer than two powers says no one eats well');
  });
});
