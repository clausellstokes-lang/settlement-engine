/**
 * tests/generators/pressureHonoursNeeds.test.js — R2-CODE-A P1 (a), the chair's ruling of 2026-11-13
 * (the cold list REVIEW-W2A-3, HIGH #324, #854): "The siege has entered its second week; X controls
 * the rationing and the gates" printed in a hamlet and a town with no walls and no gate, though the
 * row declares `needs: ['gate']`. The pressure sentence's pick (`narrativeGenerator.js ::
 * generatePressureSentence`) read no row's declaration. It now honours each row's own `needs` AFTER
 * its one pick: a refused row resolves draw-free to the next admitted row of the same pool, so no
 * draw is added and an admitted pick prints exactly what it printed.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { foodWordShown } from '../../src/domain/display/foodWordShown.js';

/** @param {string} seed */
const born = (seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^rw3-(\w+)-([a-z_+]+)-\d+$/));
  return /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} }));
};

describe('the pressure sentence honours its rows\' declarations', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('no gate, so no "rationing and the gates"; the next siege row in its place (every row)', () => {
    expectNoSeedFailures(collectSeedFailures([['rw3-hamlet-under_siege-1'], ['rw3-town-under_siege+famine-1']], ([seed]) => {
      const s = born(seed);
      expect(factsOf(s).defence?.gate, `${seed}: no gate`).toBe(false);
      // anchored: the next line asserts the next siege row printed in its place
      expect(s.pressureSentence, `${seed}: no "rationing and the gates"`).not.toMatch(/the rationing and the gates/);
      expect(s.pressureSentence, `${seed}: the next siege row in its place`).toMatch(/cache in .* has been inventoried and argued over/);
    }), 'no gate, so no "rationing and the gates"; the next siege row in its place');
  });
  it('rw3-metropolis-under_siege-1: an admitted pick prints exactly the row it drew (its walls stand)', () => {
    const s = born('rw3-metropolis-under_siege-1');
    expect(s.pressureSentence).toMatch(/counts its mouths and its days of \w+ every morning/);
  });
});

// WORDS-2 E3, the tenth chair's RULING G13 (3): a calm small place that stores no quarrel falls to the small-place pool of
// `generatePressureSentence`; its thin-harvest and late-frost lines must agree with the food word the page prints
// (`display/foodWordShown.js`), so each declares `excludes: ['food: ≥ secure']`, and the pool honours a row's declaration after
// its one pick, as the stress pool does (no draw added). Red first by name on E3's G13 (1) tree without it: C dp-hamlet-104
// printed the thin harvest, C dp-hamlet-106 and -128 the late frost, V dp-hamlet-18 the thin harvest, each beside "Secure".
describe('G13 (3): the small-place pool says no thin harvest or late frost beside a printed Secure', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('C dp-hamlet-104, -106, -128 and V dp-hamlet-18: Secure printed, the pool line is another of the pool', () => {
    const FOOD_TALK = /^The harvest was thin this year|^The last frost came late and damaged the seedstock/;
    const POOL = /^A family moved away last spring|^A stranger passed through a month ago|^Two families have been in a quiet feud|^The question of who tends the shared fields|^A dispute over grazing rights and water access has been running/;
    expectNoSeedFailures(collectSeedFailures(['C dp-hamlet-104', 'C dp-hamlet-106', 'C dp-hamlet-128', 'V dp-hamlet-18'], (id) => {
      const [corpus, seed] = id.split(' ');
      const settType = seed.split('-')[1];
      const s = /** @type {any} */ (generateSettlementPipeline(birthConfig(corpus === 'C' ? { settType } : { ...DEFAULT_CONFIG, settType, _randomizePriorities: true }), null, { seed, customContent: {} }));
      expect(foodWordShown(s)?.label, `${id}: the page prints Secure`).toBe('Secure');
      expect(String(s.pressureSentence), `${id}: a line of the small-place pool prints`).toMatch(POOL);
      expect(FOOD_TALK.test(String(s.pressureSentence)) ? `${id}: ${s.pressureSentence}` : null).toBe(null);
    }), 'no thin harvest or late frost beside a printed Secure');
  }, 240_000);
  // RULING G16: the pool's own grazing line ("… has been running for two seasons without resolution") is drawn only where
  // herding leads, by the fact the cascade's quarrel reads (`foodRecord.foodSources[0] === 'livestock'`; the row declares it as
  // `needs: ['livestock'], excludes: ['grain']`, the source list being grain first, then the herds). Red first by name on E3's
  // G13 (3) tree: C dp-hamlet-42 and dp-thorp-32 (game leads), dp-thorp-17 (grain), V dp-thorp-43 (no home source) printed it.
  it('G16: C dp-hamlet-42, dp-thorp-17, dp-thorp-32 and V dp-thorp-43: herding does not lead, the pool prints another line', () => {
    const POOL = /^A family moved away last spring|^A stranger passed through a month ago|^Two families have been in a quiet feud|^The question of who tends the shared fields|^The harvest was thin this year|^The last frost came late/;
    expectNoSeedFailures(collectSeedFailures(['C dp-hamlet-42', 'C dp-thorp-17', 'C dp-thorp-32', 'V dp-thorp-43'], (id) => {
      const [corpus, seed] = id.split(' ');
      const settType = seed.split('-')[1];
      const s = /** @type {any} */ (generateSettlementPipeline(birthConfig(corpus === 'C' ? { settType } : { ...DEFAULT_CONFIG, settType, _randomizePriorities: true }), null, { seed, customContent: {} }));
      expect(s.economicState?.foodSecurity?.foodRecord?.foodSources?.[0] === 'livestock', `${id}: herding does not lead`).toBe(false);
      expect(String(s.pressureSentence), `${id}: another line of the small-place pool prints`).toMatch(POOL);
    }), 'the pool\'s grazing line only where herding leads');
  }, 240_000);
});
