/**
 * Fail-closed contract for legacy name-only dependency lookups.
 *
 * These helpers predate immutable definition ids and still accept display
 * names. A duplicate name must resolve to neither definition; selecting the
 * last array entry would make mechanics depend on library order.
 */

import { describe, expect, it } from 'vitest';

import {
  customDeps,
  withCustomContent,
} from '../../src/lib/dependencyEngine.js';

function ambiguousLibrary(reverse = false) {
  const ordered = (first, second) => (
    reverse ? [second, first] : [first, second]
  );
  return {
    institutions: ordered(
      {
        localUid: 'twin-hall-a',
        name: 'Twin Hall',
        produces: ['custom:meal-a'],
        subsumes: ['custom:lesser-a'],
      },
      {
        localUid: 'twin-hall-b',
        name: 'Twin Hall',
        produces: ['custom:meal-b'],
        subsumes: ['custom:lesser-b'],
      },
    ),
    resources: ordered(
      {
        localUid: 'twin-field-a',
        name: 'Twin Field',
        feedsChains: ['prebuilt:resourceChains:food_security__grain'],
      },
      {
        localUid: 'twin-field-b',
        name: 'Twin Field',
        feedsChains: ['prebuilt:resourceChains:manufacturing__timber'],
      },
    ),
    stressors: ordered(
      {
        localUid: 'twin-crisis-a',
        name: 'Twin Crisis',
        disablesInstitutions: ['custom:twin-hall-a'],
        disablesGoods: ['custom:meal-a'],
      },
      {
        localUid: 'twin-crisis-b',
        name: 'Twin Crisis',
        disablesInstitutions: ['custom:twin-hall-b'],
        disablesGoods: ['custom:meal-b'],
      },
    ),
    tradeGoods: ordered(
      {
        localUid: 'meal-a',
        name: 'Twin Meal',
        requiredInstitution: 'custom:twin-hall-a',
      },
      {
        localUid: 'meal-b',
        name: 'Twin Meal',
        requiredInstitution: 'custom:twin-hall-b',
      },
    ),
  };
}

function legacyLookupProjection(customContent) {
  return withCustomContent(customContent, () => ({
    produced: customDeps.servicesProducedBy('Twin Hall'),
    subsumed: customDeps.subsumedBy('Twin Hall'),
    chains: customDeps.chainsFedByResource('Twin Field'),
    requiredInstitution: customDeps.requiredInstitutionForGood('Twin Meal'),
    disabledInstitutions:
      customDeps.institutionsDisabledByStressor('Twin Crisis'),
    disabledGoods: customDeps.goodsDisabledByStressor('Twin Crisis'),
  }));
}

describe('dependencyEngine ambiguous legacy names', () => {
  it('resolves no arbitrary definition in either library order', () => {
    const expected = {
      produced: [],
      subsumed: [],
      chains: [],
      requiredInstitution: '',
      disabledInstitutions: [],
      disabledGoods: [],
    };

    expect(legacyLookupProjection(ambiguousLibrary(false))).toEqual(expected);
    expect(legacyLookupProjection(ambiguousLibrary(true))).toEqual(expected);
  });

  it('uses exact custom identity while refusing native same-name entities', () => {
    const library = {
      institutions: [
        {
          localUid: 'twin-hall-custom',
          name: 'Twin Hall',
          produces: ['custom:twin-counsel'],
          subsumes: ['custom:twin-annex'],
        },
        {
          localUid: 'twin-annex',
          name: 'Twin Annex',
        },
      ],
      services: [{
        localUid: 'twin-counsel',
        name: 'Twin Counsel',
      }],
    };
    const nativeTwin = {
      name: 'Twin Hall',
      source: 'generated',
    };
    const customTwin = {
      name: 'Twin Hall',
      source: 'custom',
      isCustom: true,
      localUid: 'twin-hall-custom',
    };

    withCustomContent(library, () => {
      expect(customDeps.contentProducedBy(nativeTwin)).toEqual([]);
      expect(customDeps.subsumptionTargetsFor(nativeTwin)).toEqual([]);
      expect(customDeps.contentProducedBy(customTwin)).toEqual([
        expect.objectContaining({
          name: 'Twin Counsel',
          source: 'custom',
        }),
      ]);
      expect(customDeps.subsumptionTargetsFor(customTwin)).toEqual([
        expect.objectContaining({
          name: 'Twin Annex',
          source: 'custom',
        }),
      ]);
    });
  });
});
