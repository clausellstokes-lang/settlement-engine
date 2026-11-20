/**
 * charcoalBurnerWorksTheTimber.test.js — W2-C-LEAVES-SIDE item 6 (2026-11-13; the third seat's P1-b doubtful lines): "No
 * one here works the timber" beside a Charcoal burner ("Operates kilns in the surrounding woodland") in
 * r2s-plague_onset-hamlet-2, r2s-wartime-hamlet-0 and r2s-under_siege-village-0. The chair's ruling: a charcoal burner
 * works the timber: ONE named entry in the leaf's closed list (facts/chainWorking.js :: WORKED_BY_HOUSE) with its cause,
 * as the apothecary's entry was made. Measured on the census's 720: those three lose the line and their timber card
 * reads Partial; four towns gain "timber" as produced locally; no half-way line moves.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';
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
/** @param {string[]} houses @param {{ imports?: string[], depleted?: string[] }} [o] */
const town = (houses, o = {}) => ({
  config: { nearbyResources: ['managed_forest'], nearbyResourcesDepleted: o.depleted || [] },
  institutions: houses.map((name) => ({ name })), economicState: { activeChains: [], primaryImports: o.imports || [] },
});

describe('a charcoal burner works the timber of the town\'s own forest', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('the unit: the burner on a live forest works the timber; bought wood, a spent forest, a road to elsewhere, another good do not', () => {
    expect(chainWorksResource(town(['Charcoal burner']), ['managed_forest'], 'timber')).toBe(true);
    expect(chainWorksResource(town(['Charcoal burner'], { imports: ['Timber'] }), ['managed_forest'], 'timber'), 'timber bought').toBe(false);
    expect(chainWorksResource(town(['Charcoal burner'], { depleted: ['managed_forest'] }), ['managed_forest'], 'timber'), 'a spent forest').toBe(false);
    expect(chainWorksResource(town(['Access to charcoal burner']), ['managed_forest'], 'timber'), 'a road to elsewhere').toBe(false);
    expect(chainWorksResource(town(['Charcoal burner']), ['managed_forest'], 'game meat'), 'another good').toBe(false);
    expect(chainWorksResource(town([]), ['managed_forest'], 'timber'), 'no house').toBe(false);
  });

  test('the census: the three doubtful lines are gone where a charcoal burner stands on the town\'s own forest', () => {
    expectNoSeedFailures(collectSeedFailures(['r2s-plague_onset-hamlet-2', 'r2s-wartime-hamlet-0', 'r2s-under_siege-village-0'], (seed) => {
      const s = birthCensus(seed);
      expect(s.institutions.some((/** @type {any} */ i) => i.name === 'Charcoal burner'), `${seed}: anchored, the burner`).toBe(true);
      expect(resourceGapLines(s).map((g) => g.impact).filter((l) => /works the timber/.test(l)), seed).toEqual([]);
    }), 'a census town still says no one works the timber');
  }, 60000);
});
