import { describe, expect, it } from 'vitest';
import {
  deriveIsolationSupport,
  shouldAddMagicalSubstitution,
} from '../../src/generators/isolationSupport.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { checkStructuralValidity } from '../../src/generators/structuralValidator.js';

describe('isolation support model', () => {
  it('recognizes a mundane foodshed, reserves, and seasonal access', () => {
    const support = deriveIsolationSupport({
      tier: 'town',
      tradeRoute: 'isolated',
      institutions: [
        { name: 'Farmland' },
        { name: 'Grain fields' },
        { name: 'Granary' },
        { name: "Caravaneer's post" },
      ],
      config: {
        tradeRouteAccess: 'isolated',
        nearbyResources: ['grain_fields', 'grazing_land', 'foraging_areas'],
        nearbyResourcesDepleted: [],
        magicExists: false,
        priorityMagic: 0,
      },
    });
    expect(support.deficit).toBe(0);
    expect(support.magicDependent).toBe(false);
    expect(support.paths.map(path => path.type)).toEqual(expect.arrayContaining([
      'local_foodshed',
      'hinterland',
      'reserves',
      'seasonal_access',
    ]));
  });

  it('offers magical substitution only for a real gap at functional high magic', () => {
    const support = deriveIsolationSupport({
      tier: 'city',
      tradeRoute: 'isolated',
      institutions: [{ name: 'Town well' }],
      config: {
        tradeRouteAccess: 'isolated',
        nearbyResources: [],
        magicExists: true,
        priorityMagic: 80,
      },
    });
    expect(support.deficit).toBeGreaterThan(0);
    expect(shouldAddMagicalSubstitution(support, { magicExists: true, priorityMagic: 80 })).toBe(true);
    expect(shouldAddMagicalSubstitution(support, { magicExists: true, priorityMagic: 30 })).toBe(false);
    expect(shouldAddMagicalSubstitution(support, { magicExists: false, priorityMagic: 100 })).toBe(false);
  });

  it('scales magical transit to the remaining gap after mundane support', () => {
    const support = deriveIsolationSupport({
      tier: 'city',
      tradeRoute: 'isolated',
      institutions: [{ name: 'Teleportation circle' }],
      config: {
        tradeRouteAccess: 'isolated',
        nearbyResources: [],
        magicExists: true,
        priorityMagic: 80,
      },
    });
    const transit = support.paths.find(path => path.type === 'magical_transit');

    expect(transit.capacity).toBe(66);
    expect(support.capacity).toBe(support.requiredCapacity);
    expect(support.deficit).toBe(0);
    expect(support.magicDependent).toBe(true);
  });

  it('describes magic-dependent support without erasing mundane contribution', () => {
    const support = {
      capacity: 76,
      requiredCapacity: 70,
      magicDependent: true,
    };
    const { suggestions } = checkStructuralValidity([], {
      tier: 'city',
      tradeRouteAccess: 'isolated',
      _magicTradeOnly: true,
      _isolationSupport: support,
    });
    const magicalDependency = suggestions.find(
      item => item.institution === 'Magical Trade Infrastructure',
    );

    expect(magicalDependency.reason).toContain('76/70');
    expect(magicalDependency.reason).toContain('mundane local support still contributes');
    expect(magicalDependency.reason).not.toMatch(
      /every import and export|teleportation circle/i,
    );
  });

  it('preserves an explicit no-magic isolated town and labels any gap by design', () => {
    const settlement = generateSettlementPipeline(
      {
        settType: 'town',
        culture: 'germanic',
        terrainOverride: 'mountain',
        tradeRouteAccess: 'isolated',
        magicExists: false,
        priorityMagic: 0,
      },
      null,
      { seed: 'explicit-isolated-no-magic', customContent: {} },
    );
    expect(settlement.config.tradeRouteAccess).toBe('isolated');
    expect(settlement.isolationSupport.applicable).toBe(true);
    const isolationAnalysis = [
      ...(settlement.economicViability?.warnings || []),
      ...(settlement.economicViability?.dependencies || []),
    ].find(item => item.category === 'Economic Isolation');
    expect(isolationAnalysis).toBeTruthy();
    expect(isolationAnalysis.description).not.toMatch(
      /permanently stunted regardless of slider values/i,
    );
    expect(isolationAnalysis.description).toContain(
      `${settlement.isolationSupport.capacity}/${settlement.isolationSupport.requiredCapacity}`,
    );
    if (settlement.isolationSupport.deficit > 0) {
      expect(isolationAnalysis.title).toBe('Isolation Support Gap');
      expect(settlement.structuralViolations).toEqual(expect.arrayContaining([
        expect.objectContaining({
          type: 'isolation_violation',
          severity: 'by_design',
        }),
      ]));
      expect(settlement.generationCoherenceReceipt.status).toBe('coherent_with_authored_tensions');
    } else {
      expect(isolationAnalysis.title).toBe('Locally Sustained Isolation');
    }
  });

  it('random low/no-magic town+ never resolves to isolated', () => {
    for (let index = 0; index < 60; index += 1) {
      const settlement = generateSettlementPipeline(
        {
          settType: index % 3 === 0 ? 'town' : index % 3 === 1 ? 'city' : 'metropolis',
          culture: 'random_culture',
          terrainOverride: 'auto',
          tradeRouteAccess: 'random_trade',
          magicExists: index % 2 === 0 ? false : true,
          priorityMagic: index % 2 === 0 ? 0 : 25,
        },
        null,
        { seed: `random-isolation-${index}`, customContent: {} },
      );
      expect(settlement.config.tradeRouteAccess).not.toBe('isolated');
    }
  }, 60_000);

  it('repairs late random high-magic isolation gaps with tier-valid transit', () => {
    const city = generateSettlementPipeline(
      {
        settType: 'city',
        culture: 'random_culture',
        terrainOverride: 'auto',
        tradeRouteAccess: 'random_trade',
        magicExists: true,
        priorityMagic: 90,
      },
      null,
      { seed: 'high-magic-random-isolation-10', customContent: {} },
    );
    const metropolis = generateSettlementPipeline(
      {
        settType: 'metropolis',
        culture: 'random_culture',
        terrainOverride: 'auto',
        tradeRouteAccess: 'random_trade',
        magicExists: true,
        priorityMagic: 90,
      },
      null,
      { seed: 'high-magic-random-isolation-44', customContent: {} },
    );

    for (const settlement of [city, metropolis]) {
      expect(settlement.config.tradeRouteAccess).toBe('isolated');
      expect(settlement.isolationSupport.deficit).toBe(0);
      expect(settlement.generationCoherenceReceipt.status).not.toBe('needs_review');
    }
    expect(city.institutions.map(institution => institution.name)).not.toContain(
      'Airship docking (high magic)',
    );
  });
});
