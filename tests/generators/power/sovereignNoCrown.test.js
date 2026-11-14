/**
 * sovereignNoCrown.test.js — COHERENCE-POWERS-7 (the cold list REVIEW-W2A-3, MEDIUM #706 #707 #709 #712): A TOWN THAT
 * GOVERNS ITSELF HAS NO CROWN. rw3-city-wartime-1 is ruled by its City-State Council beside the roster's City-state
 * government ("The settlement governs itself and its surrounding territory as an independent polity. No higher lord, no
 * external charter."), yet wartime printed "Crown supply carts take what they need first", "A crown officer came last
 * week…", "Crown-appointed emergency body…" and "Crown authority flows through military channels now." The independent
 * polity is the disqualifier of each; the line keeps every other claim it makes, without the crown. Draw-free.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { buildWartimeNarrative } from '../../../src/generators/power/governingStressVignettes.js';

describe('COHERENCE-POWERS-7 · no crown where the town governs itself', () => {
  it('the wartime vignette: a self-governing town names no crown; any other keeps its words', () => {
    const poor = { militaryEffective: 40, economyOutput: 40 }; const rich = { militaryEffective: 70, economyOutput: 60 };
    for (const [flags, kept] of [[poor, 'Prices have risen and will rise again.'], [rich, 'The men who left to fight have not come back.']]) {
      const free = buildWartimeNarrative(flags, 'City-State Council', ['city-state government']);
      expect(free).toContain(kept);
      expect(free).not.toMatch(/crown/i); // anchored: the same vignette's crown-free sentence is asserted on this text just above
      expect(buildWartimeNarrative(flags, 'Royal Authority', ['royal palace'])).toMatch(/crown/i);
    }
  });
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('rw3-city-wartime-1: no crown on the Power tab\'s powers or in its account of the war', () => {
    const s = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'city', selectedStressesRandom: false,
      selectedStresses: ['wartime'], _randomizePriorities: true }), null, { seed: 'rw3-city-wartime-1', customContent: {} });
    expect(s.institutions.some((i) => i.name === 'City-state government'), 'premise: the town governs itself').toBe(true);
    const texts = [...s.powerStructure.factions.map((f) => f.desc), s.powerStructure.recentConflict];
    expect(texts.filter((t) => /\bcrown\b/i.test(String(t || '')))).toEqual([]);
    expect(String(s.powerStructure.factions.find((f) => f.faction === 'War Council')?.desc)).toMatch(/^Emergency body /);
  }, 60_000);
});
