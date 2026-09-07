/**
 * Cultural tradition is a bounded generation dimension, not a naming-only skin.
 *
 * It materializes structured local presentation and modest institution
 * likelihoods. It deliberately does not claim to be a complete simulation of
 * governance, law, warfare, or any real historical culture.
 */

import { describe, expect, it } from 'vitest';
import {
  CULTURE_PROFILE_KEYS,
  CULTURE_PROFILES,
  cultureInstitutionMultiplier,
  materializeCulturalIdentity,
  resolveCultureProfileKey,
} from '../../src/domain/cultureProfiles.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const DIMENSIONS = [
  'builtForm',
  'civicPattern',
  'exchangePattern',
  'foodways',
  'sacredLife',
  'defensePattern',
  'socialTexture',
];

describe('canonical culture profiles', () => {
  it('covers all eleven selectable traditions with every promised dimension', () => {
    expect(CULTURE_PROFILE_KEYS).toHaveLength(11);
    for (const key of CULTURE_PROFILE_KEYS) {
      const profile = CULTURE_PROFILES[key];
      expect(profile.key).toBe(key);
      expect(profile.label).toBeTruthy();
      expect(profile.scope).toBeTruthy();
      for (const dimension of DIMENSIONS) {
        expect(profile[dimension], `${key}.${dimension}`).toBeInstanceOf(Array);
        expect(profile[dimension].length, `${key}.${dimension}`).toBeGreaterThanOrEqual(2);
      }
      expect(profile.architecturalDetails.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('maps the stale mediterranean token to Latin instead of Germanic', () => {
    expect(resolveCultureProfileKey('mediterranean')).toBe('latin');
    expect(materializeCulturalIdentity('mediterranean').key).toBe('latin');
  });

  it('maps an unknown authored token to mixed rather than a silent specific fallback', () => {
    expect(resolveCultureProfileKey('lost_empire')).toBe('mixed');
    const identity = materializeCulturalIdentity('lost_empire');
    expect(identity.key).toBe('mixed');
    expect(identity.sourceKeys).toHaveLength(2);
  });

  it('keeps cultural institution weighting bounded and non-exclusive', () => {
    for (const key of CULTURE_PROFILE_KEYS) {
      for (const [category, name] of [
        ['Economy', 'Market square'],
        ['Defense', 'Palisade or earthworks'],
        ['Religious', 'Temple'],
        ['Crafts', 'Smithy'],
      ]) {
        const multiplier = cultureInstitutionMultiplier(key, category, name);
        expect(multiplier).toBeGreaterThanOrEqual(0.8);
        expect(multiplier).toBeLessThanOrEqual(1.3);
      }
    }
  });
});

describe('pipeline cultural identity', () => {
  it.each(CULTURE_PROFILE_KEYS)('%s emits its structured local identity', (culture) => {
    const settlement = generateSettlementPipeline(
      {
        settType: 'town',
        culture,
        terrainOverride: 'plains',
        tradeRouteAccess: 'road',
      },
      null,
      { seed: `culture-profile-${culture}`, customContent: {} },
    );
    expect(settlement.config.culture).toBe(culture);
    expect(settlement.culturalIdentity.key).toBe(culture);
    expect(settlement.culturalNotes).toContain(settlement.culturalIdentity.socialTexture);
    for (const dimension of DIMENSIONS) {
      expect(settlement.culturalIdentity[dimension], dimension).toBeTruthy();
    }
  });
});
