/**
 * chainWorksThroughItsTrade.test.js — W2-C-LEAVES R3 (2026-11-13; the chair's ruling on REVIEW-R2-STAGES finding 4):
 * a chain works a resource only through a house whose trade is to extract or process it. The chain leaf read a
 * Fortifications chain through a palisade or walls as working the stone quarry, a Stone & Construction chain held by
 * a Brickmaker alone as quarrying, and the clergy at the hot springs as gathering the herbs; 8 true "No one here works
 * the …" lines were lost, and 22 stone lines read doubtful. `facts/chainWorking.js :: NOT_WORKED_THROUGH` is the closed
 * list; foraging households still work what they gather.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { configOf } from '../../components/pageCensusWalk.shared.mjs';
import { chainWorksResource } from '../../../src/domain/facts/chainWorking.js';
import { resourceGapLines } from '../../../src/domain/display/validationOnPage.js';

/** @param {string} seed */
const birthCensus = (seed) => {
  const parts = seed.split('-');
  const size = parts.at(-2); const crisis = seed.startsWith('r2s-') ? parts.slice(1, -2).join('-') : null;
  return generateSettlementPipeline(configOf({ size, crisis }, DEFAULT_CONFIG, birthConfig), null, { seed, customContent: {} });
};
/** @param {Record<string, unknown>} chain */
const rec = (chain) => ({ economicState: { activeChains: [{ status: 'running', resourceInputAvailable: true, ...chain }] } });

describe('a chain works a resource only through a house of that trade (R3)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('the unit: walls and a brickmaker do not quarry; the clergy do not gather herbs; a quarry and foragers do work', () => {
    expect(chainWorksResource(rec({ chainId: 'fortification', resourceInputKey: 'stone_quarry', processingInstitutions: ['Palisade'] }), 'stone_quarry')).toBe(false);
    expect(chainWorksResource(rec({ chainId: 'stone', resourceInputKey: 'stone_quarry', processingInstitutions: ['Brickmaker'] }), 'stone_quarry')).toBe(false);
    expect(chainWorksResource(rec({ chainId: 'stone', resourceInputKey: 'stone_quarry', processingInstitutions: ['Stone quarry', 'Brickmaker'] }), 'stone_quarry')).toBe(true);
    const springs = rec({ chainId: 'pilgrimage', resourceInputKey: 'hot_springs', processingInstitutions: ['Parish church'] });
    expect(chainWorksResource(springs, 'hot_springs', 'medicinal herbs'), 'the herbs').toBe(false);
    expect(chainWorksResource(springs, 'hot_springs'), 'the springs themselves are used').toBe(true);
    expect(chainWorksResource(rec({ chainId: 'forage', resourceInputKey: 'ancient_grove', processingInstitutions: ['Subsistence farming'] }), 'ancient_grove', 'medicinal herbs')).toBe(true);
  });

  test('the reader\'s towns: the true lines are back (palisade r2r-village-56, walls r2r-town-8, clergy r2r-village-38)', () => {
    const lines = (/** @type {string} */ seed) => resourceGapLines(birthCensus(seed)).map((g) => g.impact);
    expect(lines('r2r-village-56').some((l) => /^No one here works the stone near /.test(l))).toBe(true);
    expect(lines('r2r-town-8').some((l) => /^No one here works the stone near /.test(l))).toBe(true);
    expect(lines('r2r-village-38').some((l) => /^No one here works the medicinal herbs near /.test(l))).toBe(true);
  }, 120000);
});
