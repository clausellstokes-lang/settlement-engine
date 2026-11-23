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
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

describe('the church-economy note reads the flag', () => {
  /** @type {any} */ let town;
  beforeAll(async () => {
    await loadGenerationLawPayloads();
    // BORN UNDER LAW 1 (THE FLIP, CLOSE-6 F-JOIN-2, 2026-11-23; the chair's ruling on the STOP, the bar4 (e2) form): this case, a
    // theocratic flag beside a secular seat whose note prints while the situation sentence is silent on the church, is extinct
    // lit: no r2r town of any size (0..199) nor r2s town, city or metropolis (0..11) of any crisis prints the note (1,740 lit
    // births searched; the flag stands in four, r2r-town-19, -85, r2s-insurgency-town-0, r2s-recently_betrayed-town-5, each
    // governed by a Church Council, so the note's secular seat never stands). PLAUSIBLE, by reading: the fortune law's purse
    // lifts the seat and moves the faith's label (r2r-town-54's is Significant lit), so a Strong faith leading the tithes beside a
    // secular seat no longer meets. Under both laws at 1 the town is the one the case was read on.
    town = generateSettlementPipeline({ ...birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: 'town' }), _seatLawVersion: 1, _fortuneLawVersion: 1 }, null, { seed: 'r2r-town-54', customContent: {} });
  }, 120_000);

  test('a theocratic economy whose situation sentence is suppressed still carries its note', () => {
    expect(town.economicState.safetyProfile.flags.theocraticEconomy).toBe(true);
    // the sentence is live (its trade clause prints) and silent on the church: the note may not read it
    expectAbsentWithAnchor(String(town.economicState.situationDesc).toLowerCase(), 'church controls', 'trade works', 'the situation sentence');
    expect(town.coherenceNotes.some((n) => n.type === 'power_economic' && /flows through religious institutions/.test(n.note))).toBe(true);
  });
});
