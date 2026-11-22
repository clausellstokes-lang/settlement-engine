import { describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const CONFIG = Object.freeze({
  settType: 'town',
  culture: 'germanic',
  terrainOverride: 'plains',
  tradeRouteAccess: 'road',
});

function serviceNamed(settlement, name) {
  return Object.values(settlement.availableServices || {})
    .flatMap(entries => (Array.isArray(entries) ? entries : []))
    .find(entry => (
      (typeof entry === 'string' ? entry : entry?.name) === name
    ));
}

describe('custom-service provider activation', () => {
  it('keeps a critical service dormant when its declared provider is absent', () => {
    const settlement = generateSettlementPipeline(CONFIG, null, {
      seed: 'custom-service-missing-provider',
      customContent: {
        services: [{
          localUid: 'service-orphaned-ferry',
          name: 'Orphaned Astral Ferry',
          category: 'transport',
          criticality: 'critical',
          providedBy: ['custom:missing-provider'],
        }],
      },
    });

    expect(serviceNamed(settlement, 'Orphaned Astral Ferry')).toBeUndefined();
  });

  it('materializes the same critical service once its provider is present', () => {
    const settlement = generateSettlementPipeline(CONFIG, null, {
      seed: 'custom-service-present-provider',
      customContent: {
        institutions: [{
          localUid: 'astral-ferry-house',
          name: 'Astral Ferry House',
          category: 'economic',
          essential: true,
        }],
        services: [{
          localUid: 'astral-ferry-service',
          name: 'Astral Ferry',
          category: 'transport',
          criticality: 'critical',
          providedBy: ['custom:astral-ferry-house'],
        }],
      },
    });

    expect(serviceNamed(settlement, 'Astral Ferry')).toMatchObject({
      name: 'Astral Ferry',
      institution: 'Astral Ferry House',
      custom: true,
    });
  });

  it('does not bypass the service tier gate through its provider produces path', () => {
    const settlement = generateSettlementPipeline({
      ...CONFIG,
      settType: 'hamlet',
    }, null, {
      seed: 'custom-service-produced-tier-gate',
      customContent: {
        institutions: [{
          localUid: 'astral-ferry-house',
          name: 'Astral Ferry House',
          category: 'economic',
          essential: true,
          produces: ['custom:astral-ferry-service'],
        }],
        services: [{
          localUid: 'astral-ferry-service',
          name: 'Astral Ferry',
          category: 'transport',
          criticality: 'critical',
          tierMin: 'town',
          providedBy: ['custom:astral-ferry-house'],
        }],
      },
    });

    expect(settlement.institutions.some(
      institution => institution.name === 'Astral Ferry House',
    )).toBe(true);
    expect(serviceNamed(settlement, 'Astral Ferry')).toBeUndefined();
  });

  it('does not let a conflicting produces edge bypass the declared provider', () => {
    const settlement = generateSettlementPipeline(CONFIG, null, {
      seed: 'custom-service-conflicting-provider',
      customContent: {
        institutions: [{
          localUid: 'wrong-ferry-house',
          name: 'Wrong Ferry House',
          category: 'economic',
          essential: true,
          produces: ['custom:astral-ferry-service'],
        }],
        services: [{
          localUid: 'astral-ferry-service',
          name: 'Astral Ferry',
          category: 'transport',
          criticality: 'critical',
          providedBy: ['custom:missing-real-provider'],
        }],
      },
    });

    expect(settlement.institutions.some(
      institution => institution.name === 'Wrong Ferry House',
    )).toBe(true);
    expect(serviceNamed(settlement, 'Astral Ferry')).toBeUndefined();
  });

  it('does not let a native namesake impersonate an absent custom provider', () => {
    const settlement = generateSettlementPipeline(CONFIG, null, {
      seed: 'custom-service-native-provider-impostor',
      customContent: {
        institutions: [{
          localUid: 'custom-town-granary',
          name: 'Town granary',
          category: 'economic',
          essential: true,
          tierMin: 'city',
          produces: ['custom:granary-private-ledger'],
        }],
        services: [{
          localUid: 'granary-private-ledger',
          name: 'Granary Private Ledger',
          category: 'legal',
          criticality: 'critical',
          providedBy: ['custom:custom-town-granary'],
        }],
      },
    });

    expect(settlement.institutions).toEqual(expect.arrayContaining([
      expect.objectContaining({
        name: 'Town granary',
        source: 'required',
      }),
    ]));
    expect(settlement.institutions.some(institution => (
      institution.name === 'Town granary'
      && institution.source === 'custom'
    ))).toBe(false);
    expect(serviceNamed(settlement, 'Granary Private Ledger')).toBeUndefined();
  });

  it('does not let a custom namesake satisfy a prebuilt provider reference', () => {
    const settlement = generateSettlementPipeline(CONFIG, null, {
      seed: 'custom-service-prebuilt-provider-impostor',
      customContent: {
        institutions: [{
          localUid: 'custom-city-hall',
          name: 'City hall',
          category: 'government',
          essential: true,
        }],
        services: [{
          localUid: 'city-licence-review',
          name: 'City Licence Review',
          category: 'legal',
          criticality: 'critical',
          providedBy: ['prebuilt:institutions:city_hall'],
        }],
      },
    });

    expect(settlement.institutions).toEqual(expect.arrayContaining([
      expect.objectContaining({
        name: 'City hall',
        source: 'custom',
      }),
    ]));
    expect(settlement.institutions.some(institution => (
      institution.name === 'City hall'
      && institution.source !== 'custom'
    ))).toBe(false);
    expect(serviceNamed(settlement, 'City Licence Review')).toBeUndefined();
  });
});
