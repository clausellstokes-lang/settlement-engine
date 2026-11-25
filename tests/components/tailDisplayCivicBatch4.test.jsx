/** @vitest-environment jsdom */
/**
 * TAIL-DISPLAY-CIVIC · BATCH 4 (the chair's ruling X8 of 2026-11-14, vetoable by the owner; READ-ALL 16764 16767; base:
 * the batch-3 tip). THE RULING AUTHORITY ROW IS NOT PRINTED ABOVE WHAT THE RECORD SAYS OF THE SAME GOVERNMENT: the
 * Foundations row keeps the causal composite, capped by the record (domain/display/rulingAuthorityShown.js): under a
 * legitimacy crisis or fractured governance at most "Strained", the row's own word below Adequate; under a contested
 * legitimacy at most "Adequate". 164 of the census's 720 towns at f663a2699 printed the row above its cap. Births of the
 * census's own seeds (CENSUS-3 seedcfg.mjs :: cfgFor); cured pairs red at the base, keeps green.
 */
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { rulingAuthorityBandShown, rulingAuthorityCapOf } from '../../src/domain/display/rulingAuthorityShown.js';
import SubstrateTab from '../../src/components/new/tabs/SubstrateTab.jsx';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's cfgFor, its r2r- and r2s- arms. @param {string} seed */
function born(seed) {
  const r = seed.match(/^r2r-(\w+)-(\d+)$/);
  const m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  const conf = r ? { ...DEFAULT_CONFIG, ...DIALS, settType: r[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] };
  return generateSettlementPipeline(birthConfig(conf), null, { seed, customContent: {} });
}
afterEach(cleanup);
/** @param {any} s */
function rulingWord(s) {
  const { container } = render(<SubstrateTab settlement={s} />);
  const row = [...container.querySelectorAll('[data-substrate-row]')].find((r) => r.firstChild?.textContent === 'Ruling authority');
  const word = row ? row.lastChild.textContent : null;
  cleanup();
  return word;
}

// [seed, the word that must not print, the word that prints]
const CURED = [
  ['r2r-thorp-58', 'Adequate', 'Strained'],
  ['r2s-plague_onset-thorp-3', 'Surplus', 'Adequate'],
  ['r2r-hamlet-0', 'Adequate', 'Strained'],
];
// [seed, the word that still prints]
// RE-PICKED BY THE PREMISE (THE FLIP, CLOSE-6 F-FORTUNE-2, 2026-11-23; the chair's ruling): the row's case is a Surplus row with
// no cap. Lit, r2r-city-27's composite bands 'adequate'; r2r-city-95 is the lowest r2r-city of 200 lit whose Ruling authority
// bands 'surplus' with no cap (`rulingAuthorityCapOf` null: 95 149). The original word kept (was r2r-city-27)
// RE-ANCHORED AT POINT 116 (the trouble law lit, 2026-11-25; LAND-116, the chair's ruling B): r2r-city-95's lit composite bands
// 'adequate'; of r2r-city 0..199 the one whose row bands 'surplus' with no cap is r2r-city-149 (the flip's second).
const KEPT = [['r2r-city-149', 'Surplus'], ['r2r-hamlet-10', 'Adequate'], ['r2s-succession_void-city-0', 'Strained']];
const WORD = new Map();
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const [seed] of [...CURED, ...KEPT]) WORD.set(seed, rulingWord(born(seed)));
}, 600000);

describe('batch 4: the ruling authority row is capped by the record', () => {
  test('the cured rows print the capped word', () => {
    expect(CURED.filter(([seed, , now]) => WORD.get(seed) !== now).map(([seed, gone]) => `${seed}: ${WORD.get(seed)} (was ${gone})`)).toEqual([]);
  });
  test('the rows at or below their cap keep their word', () => {
    expect(KEPT.filter(([seed, kept]) => WORD.get(seed) !== kept).map(([seed]) => `${seed}: ${WORD.get(seed)}`)).toEqual([]);
  });
  test('the leaf: a cap only lowers', () => {
    const crisis = { powerStructure: { publicLegitimacy: { label: 'Legitimacy Crisis', governanceFractured: true } } };
    const contested = { powerStructure: { publicLegitimacy: { label: 'Contested' } } };
    expect([rulingAuthorityCapOf(crisis), rulingAuthorityCapOf(contested), rulingAuthorityCapOf({})]).toEqual(['strained', 'adequate', null]);
    expect(['surplus', 'adequate', 'strained', 'critical', 'collapsed'].map((b) => rulingAuthorityBandShown(crisis, b)))
      .toEqual(['strained', 'strained', 'strained', 'critical', 'collapsed']);
    expect(['surplus', 'adequate', 'strained'].map((b) => rulingAuthorityBandShown(contested, b))).toEqual(['adequate', 'adequate', 'strained']);
  });
});
