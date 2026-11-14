/**
 * defenceTraditionReaders.test.js — W2-C-LEAVES-SIDE (2026-11-13; the chair's word, record 387): one home for "the town has
 * clergy with powers" and for the druid's tradition, the defence's tradition leaf, read in the magic fact's home
 * (facts/magic.js :: defenceHoldsDivine, defenceHoldsDruidic: the twins of defenceHoldsArcane).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { configOf } from '../../components/pageCensusWalk.shared.mjs';
import { defenceHoldsArcane, defenceHoldsDivine, defenceHoldsDruidic } from '../../../src/domain/facts/magic.js';

/** @param {string} seed */
const birthCensus = (seed) => {
  const parts = seed.split('-');
  const size = parts.at(-2); const crisis = seed.startsWith('r2s-') ? parts.slice(1, -2).join('-') : null;
  return generateSettlementPipeline(configOf({ size, crisis }, DEFAULT_CONFIG, birthConfig), null, { seed, customContent: {} });
};
/** @param {object} traditions */
const town = (traditions) => ({ defenseProfile: { traditions } });

describe('the defence\'s divine and druidic traditions, read in one home', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('the unit: each flag answers only for itself; no defence profile, no traditions, a non-boolean: no', () => {
    expect(defenceHoldsDivine(town({ hasDivine: true }))).toBe(true);
    expect(defenceHoldsDivine(town({ hasDivine: false, hasDruid: true }))).toBe(false);
    expect(defenceHoldsDruidic(town({ hasDruid: true }))).toBe(true);
    expect(defenceHoldsDruidic(town({ hasDivine: true }))).toBe(false);
    expect(defenceHoldsArcane(town({ hasDivine: true }))).toBe(false);
    for (const r of [{}, { defenseProfile: null }, { defenseProfile: {} }, town({ hasDivine: 'yes' }), null, undefined]) {
      expect(defenceHoldsDivine(r)).toBe(false);
      expect(defenceHoldsDruidic(r)).toBe(false);
    }
  });

  test('the census: r2r-thorp-0\'s defence holds the divine tradition, r2r-thorp-1\'s does not', () => {
    const held = birthCensus('r2r-thorp-0'); const not = birthCensus('r2r-thorp-1');
    expect(held.defenseProfile.traditions.hasDivine, 'anchored').toBe(true);
    expect(defenceHoldsDivine(held)).toBe(true);
    expect(defenceHoldsDivine(not)).toBe(false);
  }, 60000);
});
