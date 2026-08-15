/**
 * Custom-content foodImpact truth contract.
 *
 * These are intentionally full-pipeline tests. A helper-only tally can pass
 * while the later economy reconciliation replaces its result; that was the
 * original defect. The assertions therefore start at authored definitions and
 * end at economicState.foodSecurity, its viability view, and the stockpile
 * advanced during play.
 */

import { describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { advanceFoodStockpile } from '../../src/domain/worldPulse/foodStockpile.js';
import { generateFoodSecurity } from '../../src/generators/foodGenerator.js';

const CONFIG = Object.freeze({
  settType: 'town',
  culture: 'germanic',
  terrainOverride: 'plains',
  tradeRouteAccess: 'isolated',
  monsterThreat: 'civilized',
});
const SEED = 'custom-food-impact-canonical-truth';

const FOOD_INSTITUTION = Object.freeze({
  localUid: 'sun-terrace',
  name: 'Sun Terrace',
  category: 'cultural',
  essential: true,
});

function institutionContent(foodImpact) {
  return {
    institutions: [{ ...FOOD_INSTITUTION, foodImpact }],
  };
}

function generate(customContent, config = CONFIG, seed = SEED) {
  return generateSettlementPipeline(
    { ...config },
    null,
    { seed, customContent },
  );
}

function foodOf(settlement) {
  return settlement.economicState.foodSecurity;
}

function balanceOf(settlement) {
  return settlement.economicViability.metrics.foodBalance;
}

describe('custom foodImpact — canonical generation and tick integration', () => {
  it('keeps an abundant native food node active beside a depleted custom namesake', () => {
    const nativeConfig = {
      ...CONFIG,
      _population: 1500,
      nearbyResources: ['grain_fields'],
      nearbyResourcesNative: ['grain_fields'],
      nearbyResourcesNativeDepleted: [],
      nearbyResourcesCustom: [],
      nearbyResourcesDepleted: [],
    };
    const collisionConfig = {
      ...nativeConfig,
      nearbyResourcesCustom: ['grain_fields'],
      nearbyResourcesDepleted: ['grain_fields'],
      nearbyResourceDefinitions: [{
        name: 'grain_fields',
        localUid: 'custom-grain',
        customDefinitionId: 'definition:custom-grain',
        custom: true,
        source: 'custom',
      }],
      nearbyResourceDefinitionsDepleted: [{
        name: 'grain_fields',
        localUid: 'custom-grain',
        customDefinitionId: 'definition:custom-grain',
        custom: true,
        source: 'custom',
      }],
    };

    const native = generateFoodSecurity('town', [], nativeConfig);
    const collision = generateFoodSecurity('town', [], collisionConfig);

    expect(collision.activeChains).toEqual(native.activeChains);
    expect(collision.dailyProduction).toBe(native.dailyProduction);
  });

  it('changes canonical production or need and leaves viability as an exact view', () => {
    const neutral = generate(institutionContent('none'));
    const producer = generate(institutionContent('produces'));
    const consumer = generate(institutionContent('consumes'));

    const neutralFood = foodOf(neutral);
    const producerFood = foodOf(producer);
    const consumerFood = foodOf(consumer);

    // All three runs have the same seed, population, and required custom
    // institution. foodImpact is the only authored input that differs.
    expect(producer.population).toBe(neutral.population);
    expect(consumer.population).toBe(neutral.population);
    expect(producer.institutions.some(item => item.name === FOOD_INSTITUTION.name)).toBe(true);
    expect(consumer.institutions.some(item => item.name === FOOD_INSTITUTION.name)).toBe(true);

    expect(producerFood.dailyProduction).toBeGreaterThan(neutralFood.dailyProduction);
    expect(producerFood.dailyNeed).toBe(neutralFood.dailyNeed);
    expect(producerFood.deficitPct).toBeLessThan(neutralFood.deficitPct);
    expect(producerFood.customFoodImpact).toEqual({
      producers: 1,
      consumers: 0,
      agricultureCapacityBonus: 0.15,
      dailyNeedBonusPct: 0,
    });

    expect(consumerFood.dailyProduction).toBe(neutralFood.dailyProduction);
    expect(consumerFood.dailyNeed).toBeGreaterThan(neutralFood.dailyNeed);
    expect(consumerFood.deficitPct).toBeGreaterThan(neutralFood.deficitPct);
    expect(consumerFood.customFoodImpact).toEqual({
      producers: 0,
      consumers: 1,
      agricultureCapacityBonus: 0,
      dailyNeedBonusPct: 10,
    });

    // The viability record does not apply foodImpact a second time. It copies
    // the canonical quantities produced by generateFoodSecurity.
    for (const settlement of [neutral, producer, consumer]) {
      const canonical = foodOf(settlement);
      const view = balanceOf(settlement);
      expect(view.dailyProduction).toBe(canonical.dailyProduction);
      expect(view.dailyNeed).toBe(canonical.dailyNeed);
      expect(view.deficitPercent).toBe(canonical.deficitPct);
    }

    expect(JSON.stringify(generate(institutionContent('produces'))))
      .toBe(JSON.stringify(producer));
  });

  it('carries the generated food difference into the real stockpile tick', () => {
    // Three declarations make the one-week reserve movement exceed the
    // stockpile's two-decimal conservation precision. Both runs have the same
    // three institutions; only their foodImpact values differ.
    const institutions = [
      FOOD_INSTITUTION,
      {
        localUid: 'moon-ledger',
        name: 'Moon Ledger',
        category: 'cultural',
        essential: true,
      },
      {
        localUid: 'star-refectory',
        name: 'Star Refectory',
        category: 'cultural',
        essential: true,
      },
    ];
    const producer = generate({
      institutions: institutions.map(item => ({
        ...item,
        foodImpact: 'produces',
      })),
    });
    const consumer = generate({
      institutions: institutions.map(item => ({
        ...item,
        foodImpact: 'consumes',
      })),
    });

    const producerTick = advanceFoodStockpile(producer, {
      interval: 'one_week',
      tick: 1,
    });
    const consumerTick = advanceFoodStockpile(consumer, {
      interval: 'one_week',
      tick: 1,
    });

    expect(producerTick.changed).toBe(true);
    expect(consumerTick.changed).toBe(true);
    expect(producerTick.settlement.economicState.foodSecurity.stockpile)
      .toMatchObject({
        baseDeficitPct: foodOf(producer).deficitPct,
        baseSurplusPct: foodOf(producer).surplusPct,
      });
    expect(consumerTick.settlement.economicState.foodSecurity.stockpile)
      .toMatchObject({
        baseDeficitPct: foodOf(consumer).deficitPct,
        baseSurplusPct: foodOf(consumer).surplusPct,
      });
    expect(consumerTick.summary.effectiveDeficitPct)
      .toBeGreaterThan(producerTick.summary.effectiveDeficitPct);
    expect(consumerTick.summary.storageMonths)
      .toBeLessThan(producerTick.summary.storageMonths);

    // Tick-time bookkeeping spreads the canonical record rather than dropping
    // its authored-effect receipt.
    expect(producerTick.settlement.economicState.foodSecurity.customFoodImpact)
      .toEqual(foodOf(producer).customFoodImpact);
    expect(consumerTick.settlement.economicState.foodSecurity.customFoodImpact)
      .toEqual(foodOf(consumer).customFoodImpact);
  });

  it('activates all four registered categories through their declared gates', () => {
    const settlement = generate({
      institutions: [{
        localUid: 'provider',
        name: 'Amber Ledger',
        category: 'cultural',
        essential: true,
        foodImpact: 'produces',
      }],
      resources: [{
        localUid: 'spring',
        name: 'Cloudwell Spring',
        category: 'agricultural',
        essential: true,
        foodImpact: 'produces',
      }],
      services: [{
        localUid: 'table',
        name: 'Pilgrim Table',
        category: 'economic',
        providedBy: 'custom:provider',
        foodImpact: 'consumes',
      }],
      tradeGoods: [{
        localUid: 'rations',
        name: 'Ceremonial Rations',
        category: 'food_processed',
        requiredInstitution: 'custom:provider',
        foodImpact: 'consumes',
      }],
    }, {
      ...CONFIG,
      terrainOverride: 'mountain',
      tradeRouteAccess: 'road',
    }, 'custom-food-impact-four-categories');

    expect(settlement.institutions.some(item => item.name === 'Amber Ledger')).toBe(true);
    expect(settlement.config.nearbyResourcesCustom).toContain('Cloudwell Spring');
    expect(foodOf(settlement).customFoodImpact).toEqual({
      producers: 2,
      consumers: 2,
      agricultureCapacityBonus: 0.3,
      dailyNeedBonusPct: 20,
    });
  });

  it('does not count a custom resource after canonical depletion marks it inactive', () => {
    const resource = {
      localUid: 'spring',
      name: 'Cloudwell Spring',
      category: 'agricultural',
      essential: true,
    };
    const depletedConfig = {
      ...CONFIG,
      terrainOverride: 'mountain',
      tradeRouteAccess: 'road',
      resourceEdits: {
        added: [],
        removed: [],
        depleted: [resource.name],
        recovered: [],
      },
    };

    const depletedProducer = generate(
      { resources: [{ ...resource, foodImpact: 'produces' }] },
      depletedConfig,
      'custom-food-impact-depleted-resource',
    );
    const depletedNeutral = generate(
      { resources: [{ ...resource, foodImpact: 'none' }] },
      depletedConfig,
      'custom-food-impact-depleted-resource',
    );

    expect(depletedProducer.config.nearbyResourcesCustom).toContain(resource.name);
    expect(depletedProducer.config.nearbyResourcesDepleted).toContain(resource.name);
    expect(foodOf(depletedProducer).customFoodImpact).toBeUndefined();
    expect(foodOf(depletedProducer).dailyProduction)
      .toBe(foodOf(depletedNeutral).dailyProduction);
  });

  it('does not activate an ineligible service through its present provider', () => {
    const provider = {
      localUid: 'hamlet-provider',
      name: 'Hamlet Provider',
      category: 'economic',
      essential: true,
    };
    const service = {
      localUid: 'city-banquet',
      name: 'City Banquet',
      category: 'economic',
      criticality: 'critical',
      tierMin: 'city',
      providedBy: 'custom:hamlet-provider',
    };
    const hamletConfig = {
      ...CONFIG,
      settType: 'hamlet',
    };
    const consumer = generate({
      institutions: [provider],
      services: [{ ...service, foodImpact: 'consumes' }],
    }, hamletConfig, 'custom-food-impact-service-tier');
    const neutral = generate({
      institutions: [provider],
      services: [{ ...service, foodImpact: 'none' }],
    }, hamletConfig, 'custom-food-impact-service-tier');

    expect(consumer.institutions.some(item => item.name === provider.name))
      .toBe(true);
    expect(
      Object.values(consumer.availableServices || {})
        .flat()
        .some(item => (
          (typeof item === 'string' ? item : item?.name) === service.name
        )),
    ).toBe(false);
    expect(foodOf(consumer).customFoodImpact).toBeUndefined();
    expect(foodOf(consumer).dailyNeed).toBe(foodOf(neutral).dailyNeed);
  });

  it('retains same-name services separately and counts each exact visible definition', () => {
    const provider = {
      localUid: 'hall',
      definitionId: 'definition:hall',
      revisionId: 'revision:hall:1',
      contentHash: 'c'.repeat(64),
      name: 'Hall',
      category: 'economic',
      essential: true,
    };
    const first = {
      localUid: 'svc-a',
      definitionId: 'definition:svc-a',
      revisionId: 'revision:svc-a:1',
      contentHash: 'a'.repeat(64),
      name: 'Twin Meal',
      category: 'food',
      criticality: 'critical',
      providedBy: 'custom:hall',
      foodImpact: 'consumes',
    };
    const second = {
      ...first,
      localUid: 'svc-b',
      definitionId: 'definition:svc-b',
      revisionId: 'revision:svc-b:1',
      contentHash: 'b'.repeat(64),
    };
    const seed = 'same-name-food';
    const unique = generate({
      institutions: [provider],
      services: [first],
    }, CONFIG, seed);
    const ambiguous = generate({
      institutions: [provider],
      services: [first, second],
    }, CONFIG, seed);
    const neutral = generate({
      institutions: [provider],
      services: [
        { ...first, foodImpact: 'none' },
        { ...second, foodImpact: 'none' },
      ],
    }, CONFIG, seed);
    const visibleTwinMeals = Object.values(ambiguous.availableServices || {})
      .flat()
      .filter(service => (
        (typeof service === 'string' ? service : service?.name) === first.name
      ));

    expect(foodOf(unique).customFoodImpact).toMatchObject({
      consumers: 1,
      dailyNeedBonusPct: 10,
    });
    expect(visibleTwinMeals).toHaveLength(2);
    expect(
      visibleTwinMeals
        .map(service => service.customDefinitionId)
        .sort(),
    ).toEqual([
      first.definitionId,
      second.definitionId,
    ].sort());
    expect(foodOf(ambiguous).customFoodImpact).toMatchObject({
      consumers: 2,
      dailyNeedBonusPct: 20,
    });
    expect(foodOf(ambiguous).dailyNeed).toBeGreaterThan(foodOf(unique).dailyNeed);
    expect(foodOf(ambiguous).dailyNeed).toBeGreaterThan(foodOf(neutral).dailyNeed);
  });
});
