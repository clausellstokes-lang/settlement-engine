/**
 * foodwaysCultureLineHolds.test.js — UPKEEP-9, step 2(a) (2026-11-14): `foodGenerator.js :: generateFoodSecurity` handed
 * the culture's foodways rows on as bare text (`textOf`), so a declared row's condition was never read: the
 * mesoamerican "Intensive plots, terraces, raised fields, and tribute redistribution support dense populations."
 * (`needs: ['population: ≥ middling']`) printed in the food record's foodways line of 59 of the lane's 1,490 births,
 * every one a thorp, hamlet, village or small town (the round-three increment's #ww-1465). THE CURE: the rows are read
 * through `filterDeclared` where the line is chosen. THE GUARDS are three of the 59 (a thorp, a hamlet, a village): the
 * line must not print. THE TWIN GUARD is a town of the same culture, where the line is true and still prints.
 * Red at fb403c4ce.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

beforeAll(async () => { await loadGenerationLawPayloads(); });

/** The lane's rv2 shape: rv2-<crisis|calm>-<size>-<i>. */
const cfgFor = (seed) => {
  const m = /^rv2-([a-z_+]+)-(\w+)-\d+$/.exec(seed);
  if (!m) throw new Error(`seed shape ${seed}`);
  return birthConfig({ ...DEFAULT_CONFIG, settType: m[2], selectedStresses: m[1] === 'calm' ? [] : m[1].split('+'), selectedStressesRandom: false });
};
const birth = (seed) => generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
const DENSE = 'support dense populations';
const foodwaysOf = (s) => String(s.economicState?.foodSecurity?.foodRecord?.foodwaysLine ?? '');

describe('step 2(a): a culture\'s foodways line is kept only where its declaration holds', () => {
  test('GUARDS: a small place of the culture prints no "dense populations"', () => {
    for (const seed of ['rv2-calm-thorp-14', 'rv2-famine-hamlet-16', 'rv2-calm-village-16']) {
      const s = birth(seed);
      expect(s.config.cultureProfileKey, seed).toBe('mesoamerican');
      expect(foodwaysOf(s).length, seed).toBeGreaterThan(0);
      expect(foodwaysOf(s), seed).not.toContain(DENSE); // anchored: the line is asserted to print on the line above
    }
  });

  test('TWIN GUARD: a town of the culture still prints it', () => {
    const s = birth('rv2-calm-town-11');
    expect(s.config.cultureProfileKey).toBe('mesoamerican');
    expect(foodwaysOf(s)).toContain(DENSE);
  });
});
