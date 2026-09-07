/**
 * Canonical coherence owns a named assembly RNG substream.
 *
 * Presentation branches immediately before coherence may legitimately consume
 * different numbers of prose draws. That cannot change NPC secrets, faction
 * membership, or the prominent relationship chosen for the same canonical
 * settlement. This test emulates those variable presentation budgets and
 * exercises the real generateCoherence substreams.
 */

import { describe, expect, it } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { generateCoherence } from '../../src/generators/narrativeGenerator.js';
import { createPRNG } from '../../src/kernel/prng.js';
import {
  clearActiveRng,
  setActiveRng,
} from '../../src/kernel/rngContext.js';

function coherenceAfterPresentationDraws(settlement, drawCount) {
  const assemblyRng = createPRNG('assembly-coherence-isolation');
  const previousAssemblyRng = setActiveRng(assemblyRng);
  try {
    for (let index = 0; index < drawCount; index += 1) {
      assemblyRng.random();
    }
    const coherenceRng = assemblyRng.fork('canonical-coherence');
    const previousCoherenceRng = setActiveRng(coherenceRng);
    try {
      return generateCoherence(
        structuredClone(settlement),
        coherenceRng,
      );
    } finally {
      clearActiveRng(previousCoherenceRng);
    }
  } finally {
    clearActiveRng(previousAssemblyRng);
  }
}

describe('assembly coherence RNG isolation', () => {
  it('keeps NPC and faction mechanics stable across variable presentation draw counts', () => {
    const settlement = generateSettlementPipeline({
      settType: 'town',
      culture: 'germanic',
      terrainOverride: 'mountain',
      tradeRouteAccess: 'isolated',
      monsterThreat: 'civilized',
    }, null, {
      seed: 'assembly-coherence-input',
      customContent: {},
    });

    const shortPrelude = coherenceAfterPresentationDraws(settlement, 1);
    const longPrelude = coherenceAfterPresentationDraws(settlement, 17);
    const canonicalProjection = value => ({
      npcs: value.npcs,
      factions: value.factions,
      prominentRelationship: value.prominentRelationship,
    });

    expect(shortPrelude.npcs.length).toBeGreaterThan(0);
    expect(canonicalProjection(longPrelude))
      .toEqual(canonicalProjection(shortPrelude));
  });
});
