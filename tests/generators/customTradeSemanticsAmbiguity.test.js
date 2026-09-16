/**
 * Identity safety for custom trade-category projection.
 *
 * The canonical trade lists currently retain labels, not custom definition
 * ids. Category folding and neighbour bridges may therefore use a custom
 * `satisfies` value only when one definition owns that label. Current reviewed
 * endpoints carry exact identity; the name-only path remains solely for
 * custom-labelled legacy/editor projections. These tests pin both boundaries.
 */

import { describe, expect, it } from 'vitest';

import {
  projectCustomTradeSemantics,
} from '../../src/generators/steps/generateEconomy.js';
import {
  tradeLabelOwnership,
} from '../../src/domain/content/customTradeLabelOwnership.js';
import {
  withCustomContent,
} from '../../src/lib/dependencyEngine.js';

const NEIGHBOUR = Object.freeze({
  name: 'Southbank',
  relationshipType: 'friendly',
  primaryExports: [],
  primaryImports: ['Silk, fine dyes, and imported cloth'],
});

function definition(localUid, satisfies) {
  return {
    localUid,
    definitionId: `definition:${localUid}`,
    name: 'Twin Good',
    category: 'manufactured',
    satisfies,
  };
}

function project(customContent) {
  const economicState = {
    primaryExports: ['Twin Good'],
    primaryImports: [],
    customTradeLabels: {
      exports: ['Twin Good'],
      imports: [],
    },
  };
  withCustomContent(customContent, () => {
    projectCustomTradeSemantics(economicState, NEIGHBOUR);
  });
  return economicState;
}

describe('custom trade semantic identity', () => {
  it('folds and category-links one unambiguous custom label', () => {
    const result = project({
      tradeGoods: [definition('unique-good', 'luxury')],
    });

    expect(result.primaryExports).toEqual(['Luxury goods']);
    expect(result.customCategoryExports).toEqual({
      'Luxury goods': ['Twin Good'],
    });
    expect(result.tradeLinks).toContainEqual(expect.objectContaining({
      good: 'Twin Good',
      direction: 'export',
      partner: NEIGHBOUR.name,
      viaCategory: true,
    }));
  });

  it('keeps an ambiguous label raw and is independent of registry order', () => {
    const military = definition('military-good', 'military');
    const luxury = definition('luxury-good', 'luxury');
    const firstOrder = project({ tradeGoods: [military, luxury] });
    const reversedOrder = project({ tradeGoods: [luxury, military] });

    expect(reversedOrder).toEqual(firstOrder);
    expect(firstOrder.primaryExports).toEqual(['Twin Good']);
    expect(firstOrder.customTradeLabels).toEqual({
      exports: ['Twin Good'],
      imports: [],
    });
    expect(firstOrder.customCategoryExports).toBeUndefined();
    expect(firstOrder.tradeLinks).toBeUndefined();
  });

  it('treats cross-category same-name definitions as ambiguous too', () => {
    const result = project({
      institutions: [definition('military-institution', 'military')],
      tradeGoods: [definition('luxury-good', 'luxury')],
    });

    expect(result.primaryExports).toEqual(['Twin Good']);
    expect(result.customCategoryExports).toBeUndefined();
    expect(result.tradeLinks).toBeUndefined();
  });

  it('keeps a native namesake beside an exact custom category projection', () => {
    const economicState = {
      primaryExports: ['Baked goods', 'Weapons & armour'],
      primaryImports: [],
      nativeTradeLabels: {
        exports: ['Baked goods', 'Weapons & armour'],
        imports: [],
      },
      customTradeEndpoints: {
        exports: [{
          label: 'Baked goods',
          source: 'custom',
          chainId: 'chain:bakery',
          refId: 'custom:exact-good',
          customDefinitionCategory: 'tradeGoods',
          customDefinitionId: 'definition:exact-good',
        }],
        imports: [],
      },
    };

    withCustomContent({
      tradeGoods: [{
        ...definition('exact-good', 'military'),
        name: 'Baked goods',
      }],
    }, () => {
      projectCustomTradeSemantics(economicState, NEIGHBOUR);
    });

    expect(economicState.primaryExports).toEqual([
      'Baked goods',
      'Weapons & armour',
    ]);
    expect(economicState.customCategoryExports).toEqual({
      'Weapons & armour': ['Baked goods'],
    });
    expect(economicState.customTradeLabels).toEqual({
      exports: ['Weapons & armour'],
      imports: [],
    });
    expect(economicState.customTradeEndpoints.exports).toEqual([
      expect.objectContaining({
        label: 'Baked goods',
        customDefinitionId: 'definition:exact-good',
      }),
    ]);
  });

  it('never grants authored semantics to an unproven custom-chain label', () => {
    const economicState = {
      primaryExports: ['Baked goods'],
      primaryImports: [],
      nativeTradeLabels: {
        exports: ['Baked goods'],
        imports: [],
      },
      customTradeEndpoints: {
        exports: [{
          label: 'Baked goods',
          source: 'custom',
          chainId: 'chain:generic-output',
        }],
        imports: [],
      },
    };

    withCustomContent({
      tradeGoods: [{
        ...definition('unrelated-good', 'military'),
        name: 'Baked goods',
      }],
    }, () => {
      projectCustomTradeSemantics(economicState, NEIGHBOUR);
    });

    expect(economicState.primaryExports).toEqual(['Baked goods']);
    expect(economicState.customCategoryExports).toBeUndefined();
    expect(economicState.customTradeLabels).toBeUndefined();
    expect(tradeLabelOwnership(
      economicState,
      'exports',
      'Baked goods',
    )).toMatchObject({
      custom: true,
      native: true,
      mixed: true,
      customOnly: false,
    });
  });

  it('does not grant native catalog trade links to a custom-only namesake', () => {
    const economicState = {
      primaryExports: ['Iron'],
      primaryImports: [],
      nativeTradeLabels: {
        exports: [],
        imports: [],
      },
      customTradeEndpoints: {
        exports: [{
          label: 'Iron',
          source: 'custom',
          chainId: 'chain:generic-iron',
        }],
        imports: [],
      },
    };
    const ironBuyer = {
      name: 'Irontown',
      relationshipType: 'friendly',
      primaryExports: [],
      primaryImports: ['Iron'],
    };

    withCustomContent({}, () => {
      projectCustomTradeSemantics(economicState, ironBuyer);
    });

    expect(economicState.primaryExports).toEqual(['Iron']);
    expect(economicState.tradeLinks).toBeUndefined();
  });

  it('retains native catalog trade links for a proven dual-owned label', () => {
    const economicState = {
      primaryExports: ['Iron'],
      primaryImports: [],
      nativeTradeLabels: {
        exports: ['Iron'],
        imports: [],
      },
      customTradeEndpoints: {
        exports: [{
          label: 'Iron',
          source: 'custom',
          chainId: 'chain:generic-iron',
        }],
        imports: [],
      },
    };
    const ironBuyer = {
      name: 'Irontown',
      relationshipType: 'friendly',
      primaryExports: [],
      primaryImports: ['Iron'],
    };

    withCustomContent({}, () => {
      projectCustomTradeSemantics(economicState, ironBuyer);
    });

    expect(economicState.tradeLinks).toContainEqual(expect.objectContaining({
      good: 'Iron',
      goodId: 'iron',
      direction: 'export',
      partner: 'Irontown',
    }));
  });

  it('reads the compact PDF ownership projection without flattening sources', () => {
    expect(tradeLabelOwnership({
      customTradeLabels: { exports: [], imports: [] },
      tradeLabelSources: {
        native: { exports: ['Twin Loaf'], imports: [] },
        custom: {
          exports: [{ label: 'Twin Loaf', customDefinitionId: 'good:twin' }],
          imports: [],
        },
      },
    }, 'exports', 'Twin Loaf')).toMatchObject({
      custom: true,
      native: true,
      mixed: true,
      customOnly: false,
    });
  });
});
