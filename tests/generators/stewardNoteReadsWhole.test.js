/**
 * stewardNoteReadsWhole.test.js — COHERENCE-POWERS-8 (round three #565, MED, broken text; rr2s-town-plague_onset-rand-1,
 * Systems/Power): the steward's standing note (power/factionStanding.js :: annotateFactionStanding) ended "…; both would
 * say themselves." It reads "…; each would say it does." Measured: 1 town of the reader's twenty, 0 of the census's 720
 * and the lane's 4,305 (a rare variant); 0 after. Every expected word is a literal.
 */
import { describe, expect, it } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

describe('COHERENCE-POWERS-8 #565 · the steward\'s note reads whole', () => {
  it('rr2s-town-plague_onset-rand-1 (the app\'s shape): "each would say it does", never "both would say themselves"', async () => {
    await loadGenerationLawPayloads();
    const cfg = birthConfig({ ...DEFAULT_CONFIG, settType: 'town', selectedStressesRandom: false, selectedStresses: ['plague_onset'], _randomizePriorities: true });
    const s = /** @type {any} */ (generateSettlementPipeline(cfg, null, { seed: 'rr2s-town-plague_onset-rand-1', customContent: {} }));
    const text = JSON.stringify(s.powerStructure.factions.map((/** @type {any} */ f) => f.desc));
    expect(text).toContain('Which one actually governs depends on the day and the question; each would say it does.');
    expectAbsentWithAnchor(text, 'both would say themselves', 'each would say it does', 'the steward note reads whole');
  }, 60000);
});
