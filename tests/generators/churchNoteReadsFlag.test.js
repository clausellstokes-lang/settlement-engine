/**
 * W2-B-DECLARE item 5 (the layer map's measure 9, "lines that read wording"): the coherence note "economic activity
 * flows through religious institutions" reads the generator's own stored flag (`safetyProfile.flags.theocraticEconomy`),
 * never the situation sentence — which an isolated place never prints. On the census's corpus the flag and the
 * sentence disagree in 5 of 720 births; this is one (r2r-town-54): red when the note read the sentence.
 */
import { beforeAll, describe, expect, test } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

describe('the church-economy note reads the flag', () => {
  /** @type {any} */ let town;
  beforeAll(async () => {
    await loadGenerationLawPayloads();
    town = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: 'town' }), null, { seed: 'r2r-town-54', customContent: {} });
  }, 120_000);

  test('a theocratic economy whose situation sentence is suppressed still carries its note', () => {
    expect(town.economicState.safetyProfile.flags.theocraticEconomy).toBe(true);
    expect(String(town.economicState.situationDesc).toLowerCase()).not.toContain('church controls');
    expect(town.coherenceNotes.some((n) => n.type === 'power_economic' && /flows through religious institutions/.test(n.note))).toBe(true);
  });
});
