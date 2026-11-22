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
import { membershipsOf } from '../../src/domain/people/membership.js';

const gen = (config, seed) => generateSettlementPipeline(config, null, { seed, customContent: {} });

// Enrichment adds these fields; count how many NPCs carry each.
// GREEN-TIP (2026-11-10, re-keyed by cause 15207301f, people-5b step 3 — the v2 record): a card's standing in the
// powers is its `memberships` (people/membership.js :: membershipsOf); the retired `factionAffiliation` is on no
// current card, generated or rerolled, so counting it read 0 on both rosters. The parity proved is unchanged.
function enrichmentCoverage(npcs) {
  return {
    memberships: npcs.filter((n) => membershipsOf(n).length > 0).length,
    structuralPosition: npcs.filter((n) => n.structuralPosition != null).length,
  };
}

describe('[generators-domain-3] rerolled NPCs get the same coherence enrichment as generated ones', () => {
  test('a regen roster carries memberships and structuralPosition like the generated one', () => {
    // CENSUS-1d (re-keyed by cause): the registry's `stable` entries are CALM_ONLY and refused under
    // any crisis; this seed rolled a succession void, under which every top NPC was `stable`, so the
    // anchor reads a CALM city (no stress selected) — the parity it proves is unchanged.
    const s = gen({ settType: 'city', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road', selectedStressesRandom: false, selectedStresses: [] }, 'd3-gen');
    const genCov = enrichmentCoverage(s.npcs || []);
    // the generated roster is non-vacuously enriched
    expect(genCov.memberships).toBeGreaterThan(0);
    expect(genCov.structuralPosition).toBeGreaterThan(0);

    const regen = regenNPCsPipeline(s, s.config || {}, { seed: 'd3-regen' });
    const regenCov = enrichmentCoverage(regen.npcs || []);
    // the regen roster is enriched too (pre-fix these were both 0)
    expect(regenCov.memberships).toBeGreaterThan(0);
    expect(regenCov.structuralPosition).toBeGreaterThan(0);
  });

  test('regen enrichment holds across tiers', () => {
    // MERGE-CAR-2 (2026-11-08, re-keyed by cause, arm 1's CENSUS-1d precedent): the town seed rolls a
    // succession void, under which CENSUS-4b's CALM_ONLY `stable` entries are refused (structuralPosition
    // 0 at the integration parent 7b3ffb6ee too — the sum held there by factionAffiliation alone, 10/6),
    // and the people car retired factionAffiliation from the card, so the composed tip read 0 + 0. Each
    // tier now reads a CALM settlement (no stress selected); the parity it proves is unchanged.
    for (const tier of ['town', 'village']) {
      const s = gen({ settType: tier, culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road', selectedStressesRandom: false, selectedStresses: [] }, `d3-${tier}`);
      const regen = regenNPCsPipeline(s, s.config || {}, { seed: `d3-${tier}-r` });
      const cov = enrichmentCoverage(regen.npcs || []);
      expect(cov.memberships + cov.structuralPosition).toBeGreaterThan(0);
    }
  });
});
