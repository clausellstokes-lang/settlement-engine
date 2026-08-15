/**
 * Reviewed custom-chain activation is a settlement fact, not an authoring fact.
 *
 * These regressions use the real generator because the original defect lived
 * between otherwise-correct organs: each higher-tier definition was excluded
 * from a hamlet, yet its confirmed chain still appeared and promoted exports.
 */

import { describe, expect, it } from 'vitest';

import { eligibleCustomContent } from '../../src/domain/customContentSchema.js';
import { inferSupplyChains } from '../../src/domain/inferSupplyChains.js';
import {
  confirmCustomSupplyChainReview,
  customSupplyChainReviewMatches,
} from '../../src/domain/content/customSupplyChainReview.js';
import {
  evaluateConfirmedCustomSupplyChains,
} from '../../src/domain/content/customSupplyChainActivation.js';
import {
  contentRevisionHash,
} from '../../src/domain/content/customContentVersioning.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { buildRegistry } from '../../src/lib/customRegistry.js';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const LOW_TIERS = new Set(['thorp', 'hamlet', 'village']);

function sunwellDefinitions({
  institutionEssential = true,
  resourceName = 'Sunwell Ore',
} = {}) {
  return {
    resources: [{
      localUid: 'sunwell-resource',
      name: resourceName,
      category: 'mineral',
      tierMin: 'town',
      essential: true,
      commodities: ['sun ore'],
    }],
    institutions: [{
      localUid: 'sunwell-foundry',
      name: 'Sunwell Foundry',
      category: 'economic',
      tierMin: 'town',
      essential: institutionEssential,
      requires: ['custom:sunwell-resource'],
      produces: ['custom:sunwell-service'],
    }],
    services: [{
      localUid: 'sunwell-service',
      name: 'Sunsteel Craft',
      category: 'economic',
      tierMin: 'town',
      criticality: 'critical',
      providedBy: 'custom:sunwell-foundry',
    }],
    tradeGoods: [{
      localUid: 'sunwell-good',
      name: 'Sunsteel Ingots',
      requiredInstitution: 'custom:sunwell-foundry',
      requiredResources: ['custom:sunwell-resource'],
    }],
  };
}

function reviewedPack(options) {
  const rawDefinitions = sunwellDefinitions(options);
  const definitions = Object.fromEntries(
    Object.entries(rawDefinitions).map(([category, items]) => [
      category,
      items.map(item => versioned(category, item, 1)),
    ]),
  );
  const supplyChains = inferSupplyChains(definitions)
    .map(chain => confirmCustomSupplyChainReview(chain));
  expect(supplyChains.length).toBeGreaterThan(0);
  return { ...definitions, supplyChains };
}

function generate(
  tier,
  customContent,
  seed = `custom-chain-${tier}`,
  configOverrides = {},
) {
  // Mirror the application boundary: the store projects an eligible runtime
  // before invoking the generator. Reviewed chain snapshots remain present so
  // the runtime evaluator can explain "ineligible" instead of losing the fact.
  const runtime = eligibleCustomContent(customContent, { tier });
  return generateSettlementPipeline({
    settType: tier,
    culture: 'germanic',
    terrainOverride: 'plains',
    tradeRouteAccess: 'road',
    monsterThreat: 'civilized',
    ...configOverrides,
  }, null, { seed, customContent: runtime });
}

function customServiceNames(settlement) {
  return Object.values(settlement.availableServices || {})
    .flatMap(bucket => (Array.isArray(bucket) ? bucket : []))
    .filter(service => service && typeof service === 'object' && service.custom)
    .map(service => service.name);
}

function sunwellTrade(settlement) {
  return [
    ...(settlement.economicState?.primaryExports || []),
    ...(settlement.economicState?.primaryImports || []),
  ].filter(label => String(label).toLowerCase().includes('sun'));
}

function versioned(category, item, revisionNumber) {
  return {
    ...item,
    definitionId: `definition:${item.localUid}`,
    revisionId: `revision:${item.localUid}:${revisionNumber}`,
    revisionNumber,
    contentHash: contentRevisionHash(category, item),
  };
}

describe('custom supply-chain activation across real generation tiers', () => {
  it('keeps town-minimum definitions and endpoints out of all lower tiers', () => {
    const pack = reviewedPack();

    for (const tier of TIERS) {
      const settlement = generate(tier, pack);
      const chains = settlement.economicState?.customChains || [];

      expect(chains.length, `${tier} should retain reviewed chain explanations`)
        .toBeGreaterThan(0);

      if (LOW_TIERS.has(tier)) {
        expect(
          settlement.institutions.filter(institution => institution.isCustom),
          `${tier} leaked its town-only institution`,
        ).toEqual([]);
        expect(
          settlement.config.nearbyResourcesCustom,
          `${tier} leaked its town-only resource`,
        ).toEqual([]);
        expect(
          customServiceNames(settlement),
          `${tier} leaked its town-only service`,
        ).toEqual([]);
        expect(
          new Set(chains.map(chain => chain.activation.state)),
          `${tier} treated confirmation as activation`,
        ).toEqual(new Set(['ineligible']));
        expect(
          chains.every(chain => chain.tradeEndpoints.promoted === false),
        ).toBe(true);
        expect(sunwellTrade(settlement), `${tier} invented Sunwell trade`)
          .toEqual([]);
        continue;
      }

      expect(settlement.institutions.some(
        institution => institution.name === 'Sunwell Foundry' && institution.isCustom,
      )).toBe(true);
      expect(settlement.config.nearbyResourcesCustom).toContain('Sunwell Ore');
      expect(customServiceNames(settlement)).toContain('Sunsteel Craft');
      expect(new Set(chains.map(chain => chain.activation.state)))
        .toEqual(new Set(['active']));
      expect(chains.every(chain => chain.tradeEndpoints.promoted)).toBe(true);
      expect(sunwellTrade(settlement).length).toBeGreaterThan(0);
    }
  });

  it('marks an eligible chain blocked when its optional provider does not materialize', () => {
    const pack = reviewedPack({ institutionEssential: false });
    let settlement = null;

    // The provider has the real 30% optional-institution roll. Search a bounded,
    // deterministic seed corpus for an absent provider instead of mocking the
    // generator and accidentally testing a different activation boundary.
    for (let index = 0; index < 20; index += 1) {
      const candidate = generate('town', pack, `custom-chain-blocked-${index}`);
      if (!candidate.institutions.some(
        institution => institution.name === 'Sunwell Foundry',
      )) {
        settlement = candidate;
        break;
      }
    }

    expect(settlement, 'bounded seed corpus should contain an absent optional provider')
      .toBeTruthy();
    const chains = settlement.economicState?.customChains || [];
    expect(chains.length).toBeGreaterThan(0);
    expect(new Set(chains.map(chain => chain.activation.state)))
      .toEqual(new Set(['blocked']));
    expect(chains.some(chain => chain.activation.reasons.some(
      reason => (
        reason.code === 'not_materialized'
        && reason.component === 'Sunwell Foundry'
      ),
    ))).toBe(true);
    expect(chains.every(chain => chain.tradeEndpoints.promoted === false))
      .toBe(true);
    expect(sunwellTrade(settlement)).toEqual([]);
  });

  it('does not treat a ruined custom institution as a live reviewed-chain provider', () => {
    const pack = reviewedPack();
    const settlement = generate(
      'town',
      pack,
      'custom-chain-ruined-provider',
    );
    const providerChains = pack.supplyChains.filter(chain => (
      chain.discovered.nodes.some(node => node.name === 'Sunwell Foundry')
    ));
    const registry = buildRegistry(pack);
    const runtime = {
      tier: 'town',
      resources: settlement.config.nearbyResourceDefinitions,
      depletedResources:
        settlement.config.nearbyResourceDefinitionsDepleted,
      availableServices: settlement.availableServices,
      registry,
    };
    const active = evaluateConfirmedCustomSupplyChains(providerChains, {
      ...runtime,
      institutions: settlement.institutions,
    });
    expect(active.every(chain => (
      chain.activation.state === 'active'
    ))).toBe(true);

    const ruinedInstitutions = settlement.institutions.map(institution => (
      institution.name === 'Sunwell Foundry'
        ? {
            ...institution,
            status: 'ruined',
            _worldPulseInactive: true,
          }
        : institution
    ));
    const blocked = evaluateConfirmedCustomSupplyChains(providerChains, {
      ...runtime,
      institutions: ruinedInstitutions,
    });

    expect(blocked.every(chain => (
      chain.activation.state === 'blocked'
    ))).toBe(true);
    expect(blocked.some(chain => chain.activation.reasons.some(reason => (
      reason.code === 'not_materialized'
      && reason.component === 'Sunwell Foundry'
    )))).toBe(true);
    expect(blocked.every(chain => (
      chain.tradeEndpoints.promoted === false
    ))).toBe(true);
  });

  it('replays the reviewed activation projection byte-identically', () => {
    const pack = reviewedPack();
    const first = generate('town', pack, 'custom-chain-replay');
    const second = generate('town', pack, 'custom-chain-replay');

    expect(JSON.stringify(first.economicState.customChains))
      .toBe(JSON.stringify(second.economicState.customChains));
    expect(JSON.stringify(first.economicState.customTradeLabels))
      .toBe(JSON.stringify(second.economicState.customTradeLabels));
  });

  it('keeps exact custom resource activation beside a rolled native namesake', () => {
    const pack = reviewedPack({ resourceName: 'iron_deposits' });
    const settlement = generate('town', pack, 'collision-probe-0');
    const exactResource = settlement.config.nearbyResourceDefinitions.find(
      definition => definition.localUid === 'sunwell-resource',
    );

    expect(settlement.config.nearbyResourcesNative)
      .toContain('iron_deposits');
    expect(settlement.config.nearbyResourcesCustom)
      .toContain('iron_deposits');
    expect(exactResource).toMatchObject({
      name: 'iron_deposits',
      source: 'custom',
      customDefinitionCategory: 'resources',
      customDefinitionId: 'definition:sunwell-resource',
      customDefinitionRevisionId: 'revision:sunwell-resource:1',
    });
    expect(settlement.economicState.customChains.every(
      chain => chain.activation.state === 'active',
    )).toBe(true);
    expect(
      settlement.customContentProvenance.materializedDefinitions,
    ).toContainEqual(expect.objectContaining({
      category: 'resources',
      definitionId: 'definition:sunwell-resource',
      revisionId: 'revision:sunwell-resource:1',
      surfaces: ['config.nearbyResourceDefinitions'],
    }));
  });

  it('matches a reviewed prebuilt resource label to its canonical runtime key', () => {
    const definitions = {
      institutions: [versioned('institutions', {
        localUid: 'meteor-forge',
        name: 'Star Forge',
        category: 'economic',
        tierMin: 'town',
        essential: true,
        requires: ['prebuilt:resources:iron_deposits'],
        produces: ['custom:meteor-good'],
      }, 1)],
      tradeGoods: [versioned('tradeGoods', {
        localUid: 'meteor-good',
        name: 'Meteor Tools',
        satisfies: 'military',
        requiredInstitution: 'custom:meteor-forge',
        requiredResources: ['prebuilt:resources:iron_deposits'],
      }, 1)],
    };
    const inferred = inferSupplyChains(definitions);
    const reviewed = inferred.filter(chain => chain.discovered.nodes.some(
      node => node.refId === 'prebuilt:resources:iron_deposits',
    )).map(chain => confirmCustomSupplyChainReview(chain));
    expect(reviewed.length).toBeGreaterThan(0);

    const settlement = generate(
      'town',
      { ...definitions, supplyChains: reviewed },
      'custom-chain-prebuilt-key',
      {
        nearbyResourcesRandom: false,
        nearbyResources: ['iron_deposits'],
        nearbyResourcesState: { iron_deposits: 'abundant' },
      },
    );

    expect(settlement.config.nearbyResources).toContain('iron_deposits');
    expect(settlement.economicState.customChains.every(
      chain => chain.activation.state === 'active',
    )).toBe(true);
    expect(settlement.economicState.customChains.every(
      chain => !chain.activation.reasons.some(
        reason => (
          reason.code === 'not_materialized'
          && reason.component === 'Iron Ore Deposits'
        ),
      ),
    )).toBe(true);
    expect(settlement.economicState.primaryExports).toContain('Weapons & armour');
    expect(settlement.economicState.customCategoryExports?.['Weapons & armour'])
      .toContain('Meteor Tools');
    expect(settlement.economicState.customTradeLabels?.exports)
      .toContain('Weapons & armour');
  });

  it('fails legacy confirmations closed when no dependency snapshot can be reviewed', () => {
    const settlement = generate('town', {
      supplyChains: [{
        chainId: 'legacy.phantom-silk',
        label: 'Legacy phantom silk',
        status: 'running',
        outputs: ['Phantom Silk'],
        verification: { state: 'confirmed' },
      }],
    }, 'custom-chain-legacy-fail-closed');

    expect(settlement.economicState.customChains).toEqual([
      expect.objectContaining({
        label: 'Legacy phantom silk',
        status: 'blocked',
        activation: expect.objectContaining({
          state: 'blocked',
          reasons: [expect.objectContaining({
            code: 'unreviewable_projection',
          })],
        }),
        tradeEndpoints: expect.objectContaining({
          promoted: false,
        }),
      }),
    ]);
    // LIVENESS ANCHOR: the town's own export list is real and populated, so the
    // exclusion below measures "the fail-closed legacy chain did not promote its
    // output", not "this settlement exports nothing at all". No individual vanilla
    // export is structurally guaranteed here (they follow the seeded resource
    // roll), so non-emptiness is the honest anchor.
    expect(settlement.economicState.primaryExports.length).toBeGreaterThan(0);
    // anchored: populated-export-list pin directly above.
    expect(settlement.economicState.primaryExports).not.toContain('Phantom Silk');
  });

  it('never rebinds deleted stable nodes to unrelated same-name replacements', () => {
    const original = {
      resources: [versioned('resources', {
        localUid: 'old-moon-salt',
        name: 'Moon Salt',
        category: 'mineral',
        essential: true,
        yields: ['custom:old-moon-glass'],
      }, 1)],
      tradeGoods: [versioned('tradeGoods', {
        localUid: 'old-moon-glass',
        name: 'Moon Glass',
        requiredResources: ['custom:old-moon-salt'],
      }, 1)],
    };
    const reviewed = inferSupplyChains(original)
      .map(chain => confirmCustomSupplyChainReview(chain));
    expect(reviewed.length).toBeGreaterThan(0);

    const replacements = {
      resources: [versioned('resources', {
        localUid: 'new-moon-salt',
        name: 'Moon Salt',
        category: 'mineral',
        essential: true,
        yields: ['custom:new-moon-glass'],
      }, 1)],
      tradeGoods: [versioned('tradeGoods', {
        localUid: 'new-moon-glass',
        name: 'Moon Glass',
        requiredResources: ['custom:new-moon-salt'],
      }, 1)],
      supplyChains: reviewed,
    };
    const settlement = generate(
      'town',
      replacements,
      'custom-chain-same-name-replacement',
    );
    const chains = settlement.economicState.customChains;

    expect(settlement.config.nearbyResourcesCustom).toContain('Moon Salt');
    expect(chains.every(chain => chain.activation.state === 'blocked')).toBe(true);
    expect(chains.some(chain => chain.activation.reasons.some(reason => (
      reason.code === 'definition_unavailable'
      && (reason.component === 'Moon Salt' || reason.component === 'Moon Glass')
    )))).toBe(true);
    expect([
      ...(settlement.economicState.primaryExports || []),
      ...(settlement.economicState.primaryImports || []),
    ].some(label => String(label).toLowerCase().includes('moon'))).toBe(false);
  });

  it('requires renewed review when an exact node revision changes', () => {
    const resourceV1 = versioned('resources', {
      localUid: 'star-resin',
      name: 'Star Resin',
      category: 'forest',
      essential: true,
      tierMax: 'metropolis',
      yields: ['custom:star-lacquer'],
    }, 1);
    const goodV1 = versioned('tradeGoods', {
      localUid: 'star-lacquer',
      name: 'Star Lacquer',
      requiredResources: ['custom:star-resin'],
    }, 1);
    const original = { resources: [resourceV1], tradeGoods: [goodV1] };
    const discoveredV1 = inferSupplyChains(original);
    const reviewed = discoveredV1
      .map(chain => confirmCustomSupplyChainReview(chain));

    const resourceV2 = versioned('resources', {
      ...resourceV1,
      tierMax: 'city',
    }, 2);
    const revised = { resources: [resourceV2], tradeGoods: [goodV1] };
    const discoveredV2 = inferSupplyChains(revised);

    expect(discoveredV2.map(chain => chain.chainId))
      .toEqual(discoveredV1.map(chain => chain.chainId));
    expect(customSupplyChainReviewMatches(reviewed[0], discoveredV1[0])).toBe(true);
    expect(customSupplyChainReviewMatches(reviewed[0], discoveredV2[0])).toBe(false);

    const settlement = generate(
      'town',
      { ...revised, supplyChains: reviewed },
      'custom-chain-stale-revision',
    );
    expect(settlement.economicState.customChains.every(
      chain => chain.activation.state === 'blocked',
    )).toBe(true);
    expect(settlement.economicState.customChains.some(
      chain => chain.activation.reasons.some(reason => (
        reason.code === 'reviewed_revision_changed'
        && reason.component === 'Star Resin'
      )),
    )).toBe(true);
    expect([
      ...(settlement.economicState.primaryExports || []),
      ...(settlement.economicState.primaryImports || []),
    ].some(label => String(label).toLowerCase().includes('star lacquer')))
      .toBe(false);
  });

  it('does not activate an exact reviewed provider from a same-name materialized definition', () => {
    const definitions = {
      institutions: [
        versioned('institutions', {
          localUid: 'twin-forge-a',
          name: 'Twin Forge',
          category: 'economic',
          essential: false,
          produces: ['custom:aster-blade'],
        }, 1),
        versioned('institutions', {
          localUid: 'twin-forge-b',
          name: 'Twin Forge',
          category: 'economic',
          essential: true,
        }, 1),
      ],
      tradeGoods: [versioned('tradeGoods', {
        localUid: 'aster-blade',
        name: 'Aster Blade',
        requiredInstitution: 'custom:twin-forge-a',
      }, 1)],
    };
    const supplyChains = inferSupplyChains(definitions)
      .filter(chain => chain.discovered.nodes.some(node => (
        node.refId === 'custom:twin-forge-a'
      )))
      .map(chain => confirmCustomSupplyChainReview(chain));
    expect(supplyChains.length).toBeGreaterThan(0);

    const [legacyExactMaterialization] = evaluateConfirmedCustomSupplyChains(
      supplyChains,
      {
        tier: 'town',
        institutions: [{
          name: 'Twin Forge',
          localUid: 'twin-forge-a',
        }],
        resources: [],
        depletedResources: [],
        availableServices: {},
        registry: buildRegistry(definitions),
      },
    );
    expect(legacyExactMaterialization.activation.state).toBe('active');

    let settlement = null;
    for (let index = 0; index < 30; index += 1) {
      const candidate = generate(
        'town',
        { ...definitions, supplyChains },
        `custom-chain-exact-materialization-${index}`,
      );
      const generatedTwin = candidate.institutions.find(
        institution => institution.name === 'Twin Forge',
      );
      if (
        generatedTwin?.customDefinitionId === 'definition:twin-forge-b'
      ) {
        settlement = candidate;
        break;
      }
    }

    expect(
      settlement,
      'bounded seed corpus should select the unrelated essential same-name provider',
    ).toBeTruthy();
    expect(settlement.institutions.some(institution => (
      institution.customDefinitionId === 'definition:twin-forge-a'
    ))).toBe(false);
    expect(settlement.economicState.customChains.every(chain => (
      chain.activation.state === 'blocked'
    ))).toBe(true);
    expect(settlement.economicState.customChains.some(chain => (
      chain.activation.reasons.some(reason => (
        reason.code === 'materialization_ambiguous'
        && reason.component === 'Twin Forge'
      ))
    ))).toBe(true);
    // LIVENESS ANCHOR: same reasoning as the fail-closed case — the vanilla export
    // list is seed-rolled, so non-emptiness is the honest proof that the blocked
    // ambiguous chain was excluded from a list that actually exists.
    expect(settlement.economicState.primaryExports.length).toBeGreaterThan(0);
    // anchored: populated-export-list pin directly above.
    expect(settlement.economicState.primaryExports).not.toContain('Aster Blade');
  });

  it('requires canonical discovered endpoints and ignores mutable render aliases', () => {
    const definitions = {
      resources: [versioned('resources', {
        localUid: 'glass-sand',
        name: 'Glass Sand',
        category: 'mineral',
        essential: true,
        yields: ['custom:clear-glass'],
      }, 1)],
      tradeGoods: [versioned('tradeGoods', {
        localUid: 'clear-glass',
        name: 'Clear Glass',
        requiredResources: ['custom:glass-sand'],
      }, 1)],
    };
    const discovered = inferSupplyChains(definitions)[0];
    expect(discovered).toBeTruthy();

    expect(() => confirmCustomSupplyChainReview({
      ...discovered,
      discovered: {
        ...discovered.discovered,
        tradeEndpoints: undefined,
      },
      outputs: ['Unreviewed Crown'],
    })).toThrow(/reviewable graph|revision evidence/i);

    const reviewed = confirmCustomSupplyChainReview(discovered);
    const tamperedAliases = {
      ...reviewed,
      resource: 'Unreviewed Mine',
      processingInstitutions: ['Unreviewed Works'],
      outputs: ['Unreviewed Crown'],
      upstreamMissing: ['Unreviewed Import'],
    };
    expect(customSupplyChainReviewMatches(tamperedAliases, discovered)).toBe(true);
    const copiedFingerprintOntoChangedGraph = {
      ...reviewed,
      discovered: {
        ...reviewed.discovered,
        edges: reviewed.discovered.edges.map((edge, index) => (
          index === 0
            ? { ...edge, commodity: 'Unreviewed Crown' }
            : edge
        )),
      },
    };
    expect(customSupplyChainReviewMatches(
      copiedFingerprintOntoChangedGraph,
      discovered,
    )).toBe(false);
    expect(customSupplyChainReviewMatches({
      ...reviewed,
      verification: {
        ...reviewed.verification,
        review: {
          ...reviewed.verification.review,
          schemaVersion: 99,
        },
      },
    }, discovered)).toBe(false);

    const [evaluated] = evaluateConfirmedCustomSupplyChains(
      [tamperedAliases],
      {
        tier: 'town',
        resources: ['Glass Sand'],
        depletedResources: [],
        institutions: [],
        availableServices: {},
        registry: buildRegistry(definitions),
      },
    );
    expect(evaluated.activation.state).toBe('active');
    expect(evaluated.resource).toBe('Glass Sand');
    expect(evaluated.processingInstitutions).toEqual([]);
    expect(evaluated.outputs).toEqual(['clear glass']);
    expect(evaluated.tradeEndpoints.exports).toEqual(['clear glass']);
    // The tampered `upstreamMissing` alias must not become an import. Measured
    // 2026-07-27: this projection's imports list is EXACTLY [] here, so a bare
    // exclusion could never distinguish "alias rejected" from "key missing".
    // The exact pin is strictly stronger and cannot go vacuous.
    expect(evaluated.tradeEndpoints.imports).toEqual([]);
    // The exports pin and the exact-emptiness pin above fix this projection's
    // shape before the alias exclusion below is asserted.
    // anchored: the exact-emptiness pin on the imports list sits directly above.
    expect(evaluated.tradeEndpoints.imports).not.toContain('Unreviewed Import');

    const [strippedEndpoints] = evaluateConfirmedCustomSupplyChains(
      [{
        ...reviewed,
        outputs: ['Unreviewed Crown'],
        discovered: {
          ...reviewed.discovered,
          tradeEndpoints: undefined,
        },
      }],
      {
        tier: 'town',
        resources: ['Glass Sand'],
        depletedResources: [],
        institutions: [],
        availableServices: {},
        registry: buildRegistry(definitions),
      },
    );
    expect(strippedEndpoints.activation.state).toBe('blocked');
    expect(strippedEndpoints.activation.reasons).toContainEqual(
      expect.objectContaining({ code: 'reviewed_projection_changed' }),
    );
    expect(strippedEndpoints.tradeEndpoints.exports).toEqual([]);
    expect(strippedEndpoints.tradeEndpoints.imports).toEqual([]);
  });
});
