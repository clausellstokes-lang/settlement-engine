import { describe, it, expect } from 'vitest';
import { customDeps, withCustomContent } from '../../src/lib/dependencyEngine.js';

// §14 — foodImpact now moves the deficit for all four custom types: institutions
// + resources by their own presence, services by their provider institution,
// trade goods by their required institution.
describe('customDeps.foodImpactTally', () => {
  it('counts all four types, gating services/goods by their institution', () => {
    const cc = {
      institutions: [
        { name: 'Granary', localUid: 'g', foodImpact: 'produces' },
        { name: 'Garrison', localUid: 'gr', foodImpact: 'consumes' },
      ],
      resources: [{ name: 'Floodplain', localUid: 'fp', foodImpact: 'produces' }],
      services: [{ name: 'Soup Kitchen', localUid: 'sk', foodImpact: 'consumes', providedBy: 'Granary' }],
      tradeGoods: [{ name: 'Grain shipments', localUid: 'gs', foodImpact: 'produces', requiredInstitution: 'Granary' }],
    };
    withCustomContent(cc, () => {
      // producers: Granary + Floodplain + Grain shipments(req Granary present) = 3
      // consumers: Garrison + Soup Kitchen(provider Granary present) = 2
      expect(customDeps.foodImpactTally(['Granary', 'Garrison'], ['Floodplain'])).toEqual({ producers: 3, consumers: 2 });
    });
  });

  it('skips services/goods whose gating institution is absent', () => {
    const cc = {
      services: [{ name: 'Soup Kitchen', localUid: 'sk', foodImpact: 'consumes', providedBy: 'Granary' }],
      tradeGoods: [{ name: 'Grain shipments', localUid: 'gs', foodImpact: 'produces', requiredInstitution: 'Granary' }],
    };
    withCustomContent(cc, () => {
      expect(customDeps.foodImpactTally([], [])).toEqual({ producers: 0, consumers: 0 });
    });
  });

  it('is an inert zero when there is no custom content', () => {
    withCustomContent({}, () => {
      expect(customDeps.foodImpactTally(['Anything'], ['Anything'])).toEqual({ producers: 0, consumers: 0 });
    });
  });

  it('uses exact materialized institution identity and rejects an ambiguous name fallback', () => {
    const first = {
      localUid: 'twin-granary-a',
      definitionId: 'definition:twin-granary-a',
      name: 'Twin Granary',
      foodImpact: 'produces',
    };
    const second = {
      localUid: 'twin-granary-b',
      definitionId: 'definition:twin-granary-b',
      name: 'Twin Granary',
      foodImpact: 'consumes',
    };

    withCustomContent({ institutions: [first, second] }, () => {
      expect(customDeps.foodImpactTally([first], [], 'town')).toEqual({
        producers: 1,
        consumers: 0,
      });
      expect(customDeps.foodImpactTally(['Twin Granary'], [], 'town')).toEqual({
        producers: 0,
        consumers: 0,
      });
      expect(customDeps.foodImpactTally([{
        name: first.name,
        customDefinitionId: 'definition:stale-or-foreign',
      }], [], 'town')).toEqual({
        producers: 0,
        consumers: 0,
      });
    });
  });

  it('deduplicates exact projections while keeping same-name service definitions distinct', () => {
    const provider = {
      localUid: 'meal-hall',
      definitionId: 'definition:meal-hall',
      name: 'Meal Hall',
    };
    const first = {
      localUid: 'twin-meal-a',
      definitionId: 'definition:twin-meal-a',
      name: 'Twin Meal',
      providedBy: 'custom:meal-hall',
      foodImpact: 'consumes',
    };
    const second = {
      localUid: 'twin-meal-b',
      definitionId: 'definition:twin-meal-b',
      name: 'Twin Meal',
      providedBy: 'custom:meal-hall',
      foodImpact: 'consumes',
    };

    withCustomContent({
      institutions: [provider],
      services: [first, second],
    }, () => {
      expect(customDeps.foodImpactTally(
        [provider],
        [],
        'town',
        { services: [first, first] },
      )).toEqual({
        producers: 0,
        consumers: 1,
      });
      expect(customDeps.foodImpactTally([provider], [], 'town')).toEqual({
        producers: 0,
        consumers: 2,
      });
    });
  });

  it('applies the same exact-or-unambiguous rule to resources and trade goods', () => {
    const provider = {
      localUid: 'ration-hall',
      definitionId: 'definition:ration-hall',
      name: 'Ration Hall',
    };
    const resourceA = {
      localUid: 'twin-field-a',
      definitionId: 'definition:twin-field-a',
      name: 'Twin Field',
      foodImpact: 'produces',
    };
    const resourceB = {
      localUid: 'twin-field-b',
      definitionId: 'definition:twin-field-b',
      name: 'Twin Field',
      foodImpact: 'produces',
    };
    const goodA = {
      localUid: 'twin-ration-a',
      definitionId: 'definition:twin-ration-a',
      name: 'Twin Ration',
      requiredInstitution: 'custom:ration-hall',
      foodImpact: 'consumes',
    };
    const goodB = {
      localUid: 'twin-ration-b',
      definitionId: 'definition:twin-ration-b',
      name: 'Twin Ration',
      requiredInstitution: 'custom:ration-hall',
      foodImpact: 'consumes',
    };

    withCustomContent({
      institutions: [provider],
      resources: [resourceA, resourceB],
      tradeGoods: [goodA, goodB],
    }, () => {
      expect(customDeps.foodImpactTally(
        [provider],
        [resourceA],
        'town',
        { tradeGoods: [goodA] },
      )).toEqual({
        producers: 1,
        consumers: 1,
      });
      expect(customDeps.foodImpactTally(
        [provider],
        ['Twin Field'],
        'town',
      )).toEqual({
        producers: 0,
        consumers: 0,
      });
    });
  });
});
