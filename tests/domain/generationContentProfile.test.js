import { describe, expect, it } from 'vitest';
import {
  allowsGeneratedContent,
  filterGeneratedContent,
  generatedContentTopicsOf,
  resolveGenerationContentProfile,
} from '../../src/domain/generationContentProfile.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

describe('generated-theme profiles', () => {
  it('defaults to grounded and requires explicit opt-in for coercive trade', () => {
    const grounded = resolveGenerationContentProfile();
    expect(grounded.id).toBe('grounded');
    expect(allowsGeneratedContent(grounded, 'Ordinary market tolls')).toBe(true);
    expect(allowsGeneratedContent(grounded, 'Slave market')).toBe(false);
    expect(allowsGeneratedContent(grounded, 'Human trafficking network')).toBe(false);
  });

  it('heroic excludes hard-drug and torture vocabulary; grim permits it', () => {
    const heroic = resolveGenerationContentProfile({ contentProfile: 'heroic' });
    const grim = resolveGenerationContentProfile({ contentProfile: 'grim' });
    for (const value of ['Opium smugglers', 'A torture chamber', 'Enslaved captives']) {
      expect(allowsGeneratedContent(heroic, value), value).toBe(false);
      expect(allowsGeneratedContent(grim, value), value).toBe(true);
    }
  });

  it('supports an explicit custom boundary record', () => {
    const custom = resolveGenerationContentProfile({
      contentProfile: 'custom',
      contentBoundaries: {
        slavery: true,
        human_trafficking: false,
        torture: true,
        hard_drugs: false,
      },
    });
    expect(custom.boundaries.slavery).toBe(true);
    expect(custom.boundaries.human_trafficking).toBe(false);
    expect(generatedContentTopicsOf('Slave trade through human trafficking')).toEqual([
      'human_trafficking',
      'slavery',
    ]);
  });

  it('filters with an exclusion receipt instead of silently dropping values', () => {
    const profile = resolveGenerationContentProfile({ contentProfile: 'grounded' });
    const result = filterGeneratedContent(
      ['Spice market', 'Slave market', 'Opium den'],
      profile,
    );
    expect(result.kept).toEqual(['Spice market', 'Opium den']);
    expect(result.excluded).toHaveLength(1);
    expect(result.excluded[0].topics).toContain('slavery');
  });
});

describe('pipeline content boundaries', () => {
  const visibleText = settlement => JSON.stringify({
    institutions: settlement.institutions,
    availableServices: settlement.availableServices,
    history: settlement.history,
    economicState: settlement.economicState,
    npcs: settlement.npcs,
  });

  it('grounded random city corpus does not generate excluded coercive themes', () => {
    const offenders = [];
    for (let index = 0; index < 40; index += 1) {
      const settlement = generateSettlementPipeline(
        {
          settType: index % 2 ? 'city' : 'metropolis',
          culture: 'random_culture',
          terrainOverride: 'plains',
          tradeRouteAccess: 'crossroads',
          priorityCriminal: 90,
          contentProfile: 'grounded',
        },
        null,
        { seed: `grounded-content-${index}`, customContent: {} },
      );
      const text = visibleText(settlement);
      if (/\bslave|enslaved|human trafficking|captive trade|forced labo(?:u)?r\b/i.test(text)) {
        offenders.push(settlement._seed);
      }
    }
    expect(offenders).toEqual([]);
  }, 60_000);
});
