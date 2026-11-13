/**
 * nobleLineNamesTheSeat.test.js — COHERENCE-POWERS-8 (the lane's row #295, rw3-metropolis-under_siege-1): the noble
 * ladder's line "… structural influence the elected council cannot easily override." printed under a Ducal Governorship
 * ("A duke or duchess governs the metropolis by royal appointment"): there is no elected council. The line names the
 * elected council only where a Town, City or Grand Council holds the seat; elsewhere "the seat".
 * Measured on the census's 720 at this lane's tip: 4 lines, all under a duke or a guild consortium; 0 after (4 read
 * "the seat"). Every expected word is a literal.
 */
import { describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const DIALS = Object.freeze({ tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' });

describe('COHERENCE-POWERS-8 #295 · the noble line names the seat that is there', () => {
  it('r2r-metropolis-3 (a Ducal Governorship): "the seat cannot easily override", no elected council', async () => {
    await loadGenerationLawPayloads();
    const s = /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: 'metropolis' }), null, { seed: 'r2r-metropolis-3', customContent: {} }));
    expect(s.powerStructure.government).toBe('Ducal Governorship');
    const nobles = s.powerStructure.factions.find((/** @type {any} */ f) => f.faction === 'Noble Houses');
    expect(nobles.desc.startsWith('Landed noble families whose hereditary rights, land rents, and marriage networks give them structural influence the seat cannot easily override.')).toBe(true);
    for (const f of s.powerStructure.factions) expect(String(f.desc)).not.toMatch(/elected council/);
  }, 60000);
});
