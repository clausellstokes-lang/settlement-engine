import { describe, expect, it } from 'vitest';
import {
  deriveIsolationSupport,
  isolationFoodImportShareOf,
  shouldAddMagicalSubstitution,
} from '../../src/generators/isolationSupport.js';
import { foodLandOf } from '../../src/generators/foodGenerator.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { checkStructuralValidity } from '../../src/generators/structuralValidator.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

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

  // FIX-FOOD-ISOLATION (the chair's ruling, 2026-11-07): the receipt says how much of the place's need
  // can reach it from outside — its import-bearing paths over the capacity its size needs — and the food
  // writer reads that bound. Anchored: the foodshed and the reserves (the harvest and the stores) are in
  // the receipt and out of the bound; a connected receipt bounds nothing.
  it('reads the food import bound from the paths that carry food in from outside', () => {
    const support = deriveIsolationSupport({
      tier: 'town',
      tradeRoute: 'isolated',
      institutions: [{ name: 'Farmland' }, { name: 'Grain fields' }, { name: 'Granary' }, { name: "Caravaneer's post" }],
      config: {
        tradeRouteAccess: 'isolated',
        nearbyResources: ['grain_fields', 'grazing_land', 'foraging_areas'],
        nearbyResourcesDepleted: [],
        magicExists: false,
        priorityMagic: 0,
      },
    });
    expect(support.paths.map(path => path.type)).toEqual(expect.arrayContaining(['local_foodshed', 'reserves']));
    // hinterland 10 (the town's 20% hinterland share of 52, second seat) + seasonal access 8 of the 52 a town
    // needs; the foodshed and the reserves' 6 are not imports.
    expect(support.paths.find(path => path.type === 'hinterland').capacity).toBe(10);
    expect(isolationFoodImportShareOf(support)).toBe(18 / 52);
    const connected = deriveIsolationSupport({ tier: 'town', tradeRoute: 'road', institutions: [], config: {} });
    expect(isolationFoodImportShareOf(connected)).toBeNull();
  });

  // FIX-FOOD-ISOLATION second seat (the chair's ruling, 2026-11-07): ONE source for how much the land grows.
  // The receipt's local foodshed is the food writer's own harvest share (foodGenerator.js :: foodLandOf) of the
  // capacity the tier needs, and its evidence says what it read. Anchored: the same town on poor land
  // scores lower, so the figure is the land's, not a constant.
  it('scores the local foodshed by the share of need the food writer grows', () => {
    const at = (terrainType) => deriveIsolationSupport({
      tier: 'town', tradeRoute: 'isolated', institutions: [{ name: 'Mills (2-5)' }],
      config: { tradeRouteAccess: 'isolated', terrainType, nearbyResources: [], magicExists: false, priorityMagic: 0 },
    });
    const plains = at('plains');
    const foodshed = plains.paths.find(path => path.type === 'local_foodshed');
    const land = foodLandOf('town', [{ name: 'Mills (2-5)' }], { tradeRouteAccess: 'isolated', terrainType: 'plains', nearbyResources: [] }, 'isolated');
    expect(foodshed.capacity).toBe(Math.round(land.grownShareOfNeed * 52));
    expect(foodshed.capacity, 'a plains town grows 99% of its need: 51 of 52').toBe(51);
    expect(foodshed.evidence).toEqual(['land:plains', 'grown:99% of need']);
    expect(plains.status, 'a town that grows its need is not untenable on food').toBe('viable');
    expect(at('mountain').paths.find(path => path.type === 'local_foodshed').capacity).toBeLessThan(foodshed.capacity);
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

  // RE-KEYED city/plains → metropolis/desert BY IDENTITY (FIX-FOOD-ISOLATION second seat, 2026-11-07), one
  // cause: the local foodshed is the land's harvest as the food writer grows it (foodLandOf), so a bare
  // plains city grows 77% of its need and its gap (12) sits under the 42 floor. A desert metropolis grows
  // 44% (38 of 88) with 4 of pack access, so the gap (46) is above the floor and the scaling is still driven.
  it('scales magical transit to the remaining gap after mundane support', () => {
    const support = deriveIsolationSupport({
      tier: 'metropolis',
      tradeRoute: 'isolated',
      institutions: [{ name: 'Teleportation circle' }],
      config: {
        tradeRouteAccess: 'isolated',
        terrainType: 'desert',
        nearbyResources: [],
        magicExists: true,
        priorityMagic: 80,
      },
    });
    const transit = support.paths.find(path => path.type === 'magical_transit');

    expect(transit.capacity).toBe(46);
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
    // The two toContain assertions above prove this reason is the live magic-dependency
    // prose, so the exclusion below measures WORDING rather than an absent string.
    // anchored: reason is pinned live by the '76/70' and mundane-contribution assertions
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
    // Asserted BEFORE the exclusion: the description must name this settlement's live
    // support paths, so the "no fatalism" assertion below cannot pass on an empty or
    // re-shaped description. RE-KEYED by identity (UPKEEP-9, the increment's #ww-522): the
    // anchor was this settlement's capacity ratio, which the page no longer prints (the
    // capacity sum is machinery); the paths are the same live record the ratio was read beside.
    const supportPaths = (settlement.isolationSupport.paths || []).map(path => path.type.replace(/_/g, ' ')).join(', ');
    expect(supportPaths.length).toBeGreaterThan(0);
    expect(isolationAnalysis.description).toContain(supportPaths);
    // anchored: the support-paths toContain above proves the description is live prose
    expect(isolationAnalysis.description).not.toMatch(/\d+\s*\/\s*\d+/);
    // anchored: the support-paths toContain above proves the description is live prose
    expect(isolationAnalysis.description).not.toMatch(
      /permanently stunted regardless of slider values/i,
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
    // The city DOES repair its gap with magical transit — a teleportation circle, the
    // tier-valid option — so that sibling is the anchor proving this roster is live and
    // travelled the isolation-repair path. 'Airship docking (high magic)' is the
    // metropolis-only option and must not appear on a city.
    expectAbsentWithAnchor(
      city.institutions.map(institution => institution.name),
      'Airship docking (high magic)',
      'Teleportation circle',
      'city isolation repair uses tier-valid transit',
    );
  });
});
