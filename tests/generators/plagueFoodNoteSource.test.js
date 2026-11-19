/**
 * tests/generators/plagueFoodNoteSource.test.js — R2-CODE-A-3, round three's cut (lane ra), HIGH #1312 and
 * MED #203: "The plague has killed or sickened many who work the fields. Those still standing face a short
 * harvest and a hard winter." in rr2s-metropolis-plague_onset-port-1 and rr2s-hamlet-plague_onset-rand-1, both
 * fed by fish (foodSources ['fish']) and under an outbreak the crisis card calls not yet a plague. The onset's
 * food note (`foodBalance.js :: deriveFoodBalanceAnalysis`) now says the sickness is spreading among those who
 * bring in the food the record says the place lives on (its largest source).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

describe("the reader's two fishing towns under an outbreak, born as the app births them", () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  /** @param {string} seed @param {string} settType @param {object} [route] */
  const born = (seed, settType, route = {}) => /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType, selectedStressesRandom: false, selectedStresses: ['plague_onset'], _randomizePriorities: true }), null, { seed, customContent: {} }));
  /** @param {any} s */
  const notes = (s) => (s.economicViability?.issues || []).filter((i) => i?.type === 'stress_consequence').map((i) => i.message);
  it('the note names the boats, not the fields, and calls no onset a plague (every row)', () => {
    expectNoSeedFailures(collectSeedFailures([
      ['rr2s-metropolis-plague_onset-port-1', 'metropolis', { tradeRouteAccess: 'port' }],
      ['rr2s-hamlet-plague_onset-rand-1', 'hamlet', {}],
    ], ([seed, settType, route]) => {
      const s = born(seed, settType, route);
      expect(s.economicState.foodSecurity.foodRecord.foodSources[0], `${seed}: fish first`).toBe('fish');
      expect(notes(s).filter((m) => /work the fields|The plague has/.test(m)), `${seed}: not the fields, and no onset called a plague`).toEqual([]);
      expect(notes(s), `${seed}: the note names the boats`).toContain('The sickness is spreading among those who crew the boats, and the ones still at sea face a thin catch and a hard winter.');
    }), 'the note names the boats, not the fields, and calls no onset a plague');
  });
});
