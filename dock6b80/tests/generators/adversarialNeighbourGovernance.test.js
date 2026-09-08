/**
 * adversarialNeighbourGovernance.test.js — [generators-pipeline-3].
 *
 * generatePower's gate now checks the REAL relationship vocabulary
 * (hostile/rival/cold_war via isAdversarialRelationship) instead of the dead
 * 'hostile_rival'/'tense' Set, so an adversarial neighbour finally militarizes
 * governance narrative — the "Ongoing tensions with {neighbour}" recentConflict.
 * A neutral neighbour must NOT surface that line (tradeRouteArg stays null).
 */

import { describe, test, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const NEIGHBOUR = { name: 'Grimhold', tier: 'town', settType: 'town', population: { total: 900 } };

function gen(relType, seed) {
  return generateSettlementPipeline({
    settType: 'town', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road',
    _importedNeighbor: NEIGHBOUR, neighbourRelType: relType,
  }, null, { seed, customContent: {} });
}
function tensionHits(relType) {
  let hits = 0;
  for (let i = 0; i < 12; i++) {
    const rc = gen(relType, `p3-${i}`).powerStructure?.recentConflict;
    if (rc && rc.includes('Ongoing tensions with Grimhold')) hits++;
  }
  return hits;
}

describe('[generators-pipeline-3] adversarial neighbours militarize governance narrative', () => {
  for (const rel of ['hostile', 'rival', 'cold_war']) {
    test(`a ${rel} neighbour surfaces the "Ongoing tensions" recentConflict`, () => {
      // Before the fix the gate could never pass these values, so this was 0.
      expect(tensionHits(rel)).toBeGreaterThan(0);
    });
  }

  test('a neutral neighbour never surfaces the tension line', () => {
    expect(tensionHits('neutral')).toBe(0);
  });
});
