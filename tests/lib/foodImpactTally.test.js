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
});
