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
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

/** @param {string} seed */
const born = (seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^rw3-(\w+)-([a-z_+]+)-\d+$/));
  return /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} }));
};

describe('the pressure sentence honours its rows\' declarations', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('no gate, so no "rationing and the gates"; the next siege row in its place (every row)', () => {
    for (const [seed] of [['rw3-hamlet-under_siege-1'], ['rw3-town-under_siege+famine-1']]) {
      const s = born(seed);
      expect(factsOf(s).defence?.gate, `${seed}: no gate`).toBe(false);
      expect(s.pressureSentence, `${seed}: no "rationing and the gates"`).not.toMatch(/the rationing and the gates/);
      expect(s.pressureSentence, `${seed}: the next siege row in its place`).toMatch(/cache in .* has been inventoried and argued over/);
    }
  });
  it('rw3-metropolis-under_siege-1: an admitted pick prints exactly the row it drew (its walls stand)', () => {
    const s = born('rw3-metropolis-under_siege-1');
    expect(s.pressureSentence).toMatch(/counts its mouths and its days of \w+ every morning/);
  });
});
