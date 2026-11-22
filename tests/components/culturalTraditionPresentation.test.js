/**
 * Cultural-tradition presentation uses the canonical bounded profile corpus.
 *
 * New settlements persist a seed-materialized identity. Legacy saves do not,
 * so Daily Life still needs a fallback; that fallback must come from the same
 * researched-neutral design grammar instead of reviving a second stereotype
 * table.
 */

import { describe, expect, it } from 'vitest';
import {
  CULTURE_PROFILES,
} from '../../src/domain/cultureProfiles.js';
import {
  extractSettlementContext,
} from '../../src/components/new/dailyLifeLogic.js';

function legacySettlement(culture) {
  return {
    tier: 'village',
    population: 300,
    config: {
      culture,
      tradeRouteAccess: 'road',
      terrainOverride: 'plains',
      priorityMagic: 0,
    },
    institutions: [],
    economicState: {},
    economicViability: {},
    defenseProfile: {},
    powerStructure: {},
    history: {},
  };
}

describe('Daily Life cultural-tradition fallback', () => {
  it('uses the canonical profile for a legacy save', () => {
    const context = extractSettlementContext(
      legacySettlement('south_asian'),
    );

    expect(context.cultureCtx).toBe(
      CULTURE_PROFILES.south_asian.socialTexture[0],
    );
    expect(context.cultureCtx).not.toMatch(
      /\bcaste\b|who sits where|who eats with whom/i,
    );
  });

  it('prefers the settlement-specific materialized identity', () => {
    const settlement = {
      ...legacySettlement('germanic'),
      culturalIdentity: {
        socialTexture: 'A local, seed-materialized social texture.',
      },
    };

    expect(extractSettlementContext(settlement).cultureCtx).toBe(
      'A local, seed-materialized social texture.',
    );
  });
});
