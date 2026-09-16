/**
 * regenNpcEnrichment.test.js — [generators-domain-3].
 *
 * regenNPCsPipeline used to return the raw generateNPCs/generateRelationships/
 * generateFactions output — skipping the coherence-enrichment tail that runs in
 * full assembly (buildPoliticalNarrative → mergeNPCLists → enrichNPCsWithStructure).
 * So after "Reroll NPCs" every NPC ghosted its faction affiliation, criminal
 * secondary affiliation, condition goal, and structural-position card — a
 * structurally poorer shape than the generation path. The fix runs the same shared
 * enrichNpcCoherence tail in both paths.
 */

import { describe, test, expect } from 'vitest';
import { generateSettlementPipeline, regenNPCsPipeline } from '../../src/generators/generateSettlementPipeline.js';

const gen = (config, seed) => generateSettlementPipeline(config, null, { seed, customContent: {} });

// Enrichment adds these fields; count how many NPCs carry each.
function enrichmentCoverage(npcs) {
  return {
    factionAffiliation: npcs.filter((n) => n.factionAffiliation != null).length,
    structuralPosition: npcs.filter((n) => n.structuralPosition != null).length,
  };
}

describe('[generators-domain-3] rerolled NPCs get the same coherence enrichment as generated ones', () => {
  test('a regen roster carries factionAffiliation and structuralPosition like the generated one', () => {
    const s = gen({ settType: 'city', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road' }, 'd3-gen');
    const genCov = enrichmentCoverage(s.npcs || []);
    // the generated roster is non-vacuously enriched
    expect(genCov.factionAffiliation).toBeGreaterThan(0);
    expect(genCov.structuralPosition).toBeGreaterThan(0);

    const regen = regenNPCsPipeline(s, s.config || {}, { seed: 'd3-regen' });
    const regenCov = enrichmentCoverage(regen.npcs || []);
    // the regen roster is enriched too (pre-fix these were both 0)
    expect(regenCov.factionAffiliation).toBeGreaterThan(0);
    expect(regenCov.structuralPosition).toBeGreaterThan(0);
  });

  test('regen enrichment holds across tiers', () => {
    for (const tier of ['town', 'village']) {
      const s = gen({ settType: tier, culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road' }, `d3-${tier}`);
      const regen = regenNPCsPipeline(s, s.config || {}, { seed: `d3-${tier}-r` });
      const cov = enrichmentCoverage(regen.npcs || []);
      expect(cov.factionAffiliation + cov.structuralPosition).toBeGreaterThan(0);
    }
  });
});
