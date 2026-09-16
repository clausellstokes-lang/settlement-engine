/**
 * Canonical resource-condition integration pins.
 *
 * These are metamorphic tests: the settlement roster and institutions stay
 * fixed while one resource changes from available to depleted. Every consumer
 * must move together — analysis, chain status, local production, shortage
 * imports, and prose — without changing unrelated resource semantics.
 */

import { afterEach, describe, expect, it } from 'vitest';

import {
  computeActiveChains,
  deriveLocalProductionFromChains,
} from '../../src/generators/computeActiveChains.js';
import { generateEconomicState } from '../../src/generators/economicGenerator.js';
import {
  resourceKeyForLabel,
} from '../../src/domain/resourceSemantics.js';
import {
  buildGenerationCoherenceReceipt,
} from '../../src/generators/generationCoherence.js';
import { clearActiveRng, setActiveRng } from '../../src/kernel/rngContext.js';
import {
  expectAbsentWithAnchor,
  expectPresentThenAbsent,
} from '../helpers/anchoredNegatives.js';

const QUARRY = { name: 'Stone quarry', category: 'Economic' };

const chainById = (chains, id) => (
  chains.find(chain => `${chain.needKey}.${chain.chainId}` === id)
);

afterEach(() => clearActiveRng());

describe('resource condition drives chains and local production together', () => {
  it('the final receipt rejects a derived view that resurrects depleted stone', () => {
    const receipt = buildGenerationCoherenceReceipt({
      tier: 'town',
      config: {
        tier: 'town',
        tradeRouteAccess: 'road',
        nearbyResources: ['stone_quarry'],
        nearbyResourcesNative: ['stone_quarry'],
        nearbyResourcesDepleted: ['stone_quarry'],
        nearbyResourcesNativeDepleted: ['stone_quarry'],
      },
      resourceAnalysis: {
        availableResources: ['stone_quarry', 'stone'],
      },
      economicState: {
        activeChains: [{
          resourceKey: 'stone_quarry',
          resourceCondition: 'available',
          resourceInputKey: 'stone_quarry',
          resourceInputCondition: 'available',
          resourceInputAvailable: true,
        }],
      },
      institutions: [],
      npcs: [],
      history: {},
      structuralViolations: [],
    });
    const resourceCheck = receipt.checks.find(
      check => check.id === 'resource_truth',
    );

    expect(resourceCheck.status).toBe('fail');
    expect(resourceCheck.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({
        path: 'resourceAnalysis.availableResources.stone_quarry',
      }),
      expect.objectContaining({
        path: 'economicState.activeChains[0].resourceCondition',
      }),
      expect.objectContaining({
        path: 'economicState.activeChains[0].resourceInputCondition',
      }),
      expect.objectContaining({
        path: 'economicState.activeChains[0].resourceInputAvailable',
      }),
    ]));
  });

  it('a depleted quarry remains diagnosable but produces no stone', () => {
    const resources = ['stone_quarry'];
    const availableChains = computeActiveChains(
      [QUARRY],
      resources,
      'town',
      'road',
      [],
      [],
    );
    const depletedChains = computeActiveChains(
      [QUARRY],
      resources,
      'town',
      'road',
      [],
      ['stone_quarry'],
    );

    const availableStone = chainById(availableChains, 'raw_extraction.stone');
    const depletedStone = chainById(depletedChains, 'raw_extraction.stone');

    expect(availableStone).toMatchObject({
      resourceKey: 'stone_quarry',
      resourceCondition: 'available',
      resourceInputCondition: 'available',
      resourceInputAvailable: true,
      status: 'running',
    });
    expect(depletedStone).toMatchObject({
      resourceKey: 'stone_quarry',
      resourceCondition: 'depleted',
      resourceInputCondition: 'depleted',
      resourceInputAvailable: false,
      status: 'impaired',
    });

    expect(
      deriveLocalProductionFromChains(availableChains, resources, []),
    ).toEqual(expect.arrayContaining(['stone', 'Quarried stone']));
    expect(
      deriveLocalProductionFromChains(
        depletedChains,
        resources,
        ['stone_quarry'],
      ),
    ).not.toEqual(expect.arrayContaining(['stone']));
  });

  it('a live substitute carries the chain without false depletion or magic prose', () => {
    const resources = ['fishing_grounds', 'river_fish'];
    const chains = computeActiveChains(
      [{ name: 'Fishmonger' }, { name: 'Druid circle' }],
      resources,
      'town',
      'river',
      [],
      ['fishing_grounds'],
      80,
    );
    const fishing = chainById(chains, 'food_security.fishing');

    expect(fishing).toMatchObject({
      resourceKey: 'fishing_grounds',
      resourceCondition: 'depleted',
      resourceInputKey: 'river_fish',
      resourceInputCondition: 'available',
      resourceInputAvailable: true,
      resourceDepleted: true,
      substituteActive: true,
      status: 'vulnerable',
    });
    expect(fishing.magicNote).toBeUndefined();
    expect(
      deriveLocalProductionFromChains(
        chains,
        resources,
        ['fishing_grounds'],
      ),
    ).toEqual(expect.arrayContaining(['fish', 'River fish']));
  });

  it('the economy condition flip removes production, adds one shortage, and corrects prose', () => {
    const baseConfig = {
      nearbyResources: ['stone_quarry'],
      nearbyResourcesNative: ['stone_quarry'],
      nearbyResourcesDepleted: [],
      nearbyResourcesNativeDepleted: [],
      priorityEconomy: 70,
      priorityMilitary: 50,
      priorityMagic: 0,
      magicExists: false,
    };

    setActiveRng({ random: () => 0.99 });
    const available = generateEconomicState(
      'town',
      [QUARRY],
      'road',
      {},
      baseConfig,
    );
    clearActiveRng();

    setActiveRng({ random: () => 0.99 });
    const depleted = generateEconomicState(
      'town',
      [QUARRY],
      'road',
      {},
      {
        ...baseConfig,
        nearbyResourcesDepleted: ['stone_quarry'],
        nearbyResourcesNativeDepleted: ['stone_quarry'],
      },
    );

    // Final economy normalization subsumes "Quarried stone" into its canonical
    // "stone" good; the lower-level assertion above pins the chain detail.
    expect(available.localProduction).toContain('stone');
    expect(depleted.localProduction).not.toEqual(
      expect.arrayContaining(['stone']),
    );
    expect(depleted.primaryImports).toContain(
      'Dressed stone (local quarry depleted)',
    );
    // The metamorphic pair itself is the anchor: the depletion-only import IS produced
    // (by the depleted run) and is NOT produced by the live-quarry run. A writer that
    // stopped emitting the line altogether reds on the presence half.
    expectPresentThenAbsent(
      depleted.primaryImports,
      available.primaryImports,
      'Dressed stone (local quarry depleted)',
      'the depletion import exists only while the quarry is depleted',
    );
    expect(
      chainById(depleted.activeChains, 'raw_extraction.stone'),
    ).toMatchObject({
      resourceCondition: 'depleted',
      status: 'impaired',
    });
    expect(
      depleted.incomeSources.some(source => (
        /local quarry provides/i.test(source.desc || '')
      )),
    ).toBe(false);
  });
});

describe('resource vocabulary does not cross material domains', () => {
  it('hunting yields game and furs, never livestock', () => {
    const resources = ['hunting_grounds'];
    const chains = computeActiveChains(
      [{ name: "Hunter's lodge" }],
      resources,
      'town',
      'road',
    );
    const local = deriveLocalProductionFromChains(chains, resources);

    expect(local).toEqual(expect.arrayContaining(['game meat', 'furs']));
    // 'game meat' is what the hunting chain DOES yield on this exact path, so it proves
    // the production list is live before we claim 'livestock' is kept out of it.
    expectAbsentWithAnchor(local, 'livestock', 'game meat', 'hunting yields game, never herd animals');
    expect(chainById(chains, 'food_security.hunting')).toMatchObject({
      resourceKey: 'hunting_grounds',
      resourceCondition: 'available',
    });
    expect(chainById(chains, 'food_security.livestock')).toBeUndefined();
  });

  it('camel herds satisfy livestock chains as a declared substitute', () => {
    const resources = ['camel_herds'];
    const chains = computeActiveChains(
      [{ name: 'Pack animal trader' }],
      resources,
      'town',
      'road',
    );
    const livestock = chainById(chains, 'food_security.livestock');

    expect(livestock).toMatchObject({
      resourceKey: 'grazing_land',
      resourceCondition: 'absent',
      resourceInputKey: 'camel_herds',
      resourceInputCondition: 'available',
      resourceInputAvailable: true,
      substituteActive: true,
      status: 'vulnerable',
    });
    expect(
      deriveLocalProductionFromChains(chains, resources),
    ).toContain('livestock');
  });

  it('coastal timber activates coastal shipbuilding, not river shipbuilding', () => {
    const chains = computeActiveChains(
      [{ name: 'Shipyard' }],
      ['shipbuilding_timber'],
      'town',
      'port',
    );

    expect(
      chainById(chains, 'raw_extraction.coastal_shipbuilding'),
    ).toMatchObject({
      resourceKey: 'shipbuilding_timber',
      resourceCondition: 'available',
      status: 'running',
    });
    expect(chainById(chains, 'raw_extraction.shipbuilding')).toBeUndefined();
  });

  it('reviewed labels resolve exactly and unknown prose fails closed', () => {
    expect(resourceKeyForLabel('Stone quarry')).toBe('stone_quarry');
    expect(resourceKeyForLabel('Coastal Timber')).toBe('shipbuilding_timber');
    expect(resourceKeyForLabel('Mountain Pass')).toBe('defended_pass');
    expect(resourceKeyForLabel('Camel Herds')).toBe('camel_herds');
    expect(resourceKeyForLabel('some timber near a pass')).toBeNull();
  });
});
