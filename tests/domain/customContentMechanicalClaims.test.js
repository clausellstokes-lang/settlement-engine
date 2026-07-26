/**
 * Executable truth table for every manifest field advertised as mechanical.
 *
 * The manifest is product copy and admission authority; this matrix is its
 * semantic verifier. Its keys must equal the manifest's mechanical field keys
 * exactly. Every probe crosses a real generation or domain consumer and
 * compares an activated condition with a control. Metadata-only assertions are
 * intentionally insufficient: a field cannot remain labelled "mechanical" if
 * no canonical observable changes.
 */

import { describe, expect, it } from 'vitest';

import { deriveSystemVariable } from '../../src/domain/causalState.js';
import { eligibleCustomContent } from '../../src/domain/customContentSchema.js';
import {
  CUSTOM_CONTENT_MANIFEST,
} from '../../src/domain/content/customContentManifest.js';
import {
  confirmCustomSupplyChainReview,
  customSupplyChainProjectionFingerprint,
  customSupplyChainReviewMatches,
} from '../../src/domain/content/customSupplyChainReview.js';
import {
  contentRevisionHash,
} from '../../src/domain/content/customContentVersioning.js';
import {
  evaluateConfirmedCustomSupplyChains,
} from '../../src/domain/content/customSupplyChainActivation.js';
import { deriveAllCapacities } from '../../src/domain/capacityModel.js';
import { corruptionPlaneMult } from '../../src/domain/worldPulse/piety.js';
import { inferSupplyChains } from '../../src/domain/inferSupplyChains.js';
import { computeFinishedGoodsDemand } from '../../src/generators/economy/finishedGoodsDemand.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { generateFoodSecurity } from '../../src/generators/foodGenerator.js';
import { withCustomContent } from '../../src/lib/dependencyEngine.js';
import { buildRegistry } from '../../src/lib/customRegistry.js';

const BASE_CONFIG = Object.freeze({
  settType: 'town',
  culture: 'germanic',
  terrainOverride: 'plains',
  tradeRouteAccess: 'road',
  monsterThreat: 'civilized',
});

function generate(customContent, {
  seed = 'mechanical-claim',
  tier = 'town',
  projectEligibility = false,
} = {}) {
  const runtime = projectEligibility
    ? eligibleCustomContent(customContent, { tier })
    : customContent;
  return generateSettlementPipeline(
    { ...BASE_CONFIG, settType: tier },
    null,
    { seed, customContent: runtime },
  );
}

function serviceNamed(settlement, name) {
  return Object.values(settlement.availableServices || {})
    .flatMap(bucket => (Array.isArray(bucket) ? bucket : []))
    .some(service => (
      (typeof service === 'string' ? service : service?.name) === name
    ));
}

function materialized(bucket, name) {
  if (bucket === 'institutions') {
    return settlement => settlement.institutions.some(
      institution => institution.name === name,
    );
  }
  if (bucket === 'resources') {
    return settlement => settlement.config.nearbyResourcesCustom.includes(name);
  }
  return settlement => serviceNamed(settlement, name);
}

/**
 * Find a real deterministic seed where one conditional field changes its
 * targeted canonical projection. The corpus is deliberately bounded; failure
 * means the advertised condition no longer has observable leverage.
 */
function boundedGenerationTransition({
  seedPrefix,
  controlContent,
  activatedContent,
  observe,
  accept = (control, activated) => control !== activated,
}) {
  for (let index = 0; index < 24; index += 1) {
    const seed = `${seedPrefix}-${index}`;
    const control = observe(generate(controlContent, { seed }));
    const activated = observe(generate(activatedContent, { seed }));
    if (accept(control, activated)) return { control, activated };
  }
  throw new Error(
    `${seedPrefix} had no targeted transition in its 24-seed corpus.`,
  );
}

function optionalInstitutionProbe(field, activatedValue) {
  const name = `Claim ${field} Hall`;
  const base = {
    localUid: `claim-${field}-hall`,
    name,
    category: 'economic',
  };
  return boundedGenerationTransition({
    seedPrefix: `claim-institution-${field}`,
    controlContent: { institutions: [base] },
    activatedContent: {
      institutions: [{ ...base, [field]: activatedValue }],
    },
    observe: materialized('institutions', name),
    accept: (control, activated) => control === false && activated === true,
  });
}

function optionalResourceProbe(field, activatedValue) {
  const name = `Claim ${field} Crystal`;
  const base = {
    localUid: `claim-${field}-crystal`,
    name,
    category: 'mineral',
  };
  return boundedGenerationTransition({
    seedPrefix: `claim-resource-${field}`,
    controlContent: { resources: [base] },
    activatedContent: {
      resources: [{ ...base, [field]: activatedValue }],
    },
    observe: materialized('resources', name),
    accept: (control, activated) => control === false && activated === true,
  });
}

function serviceCriticalityProbe() {
  const provider = {
    localUid: 'claim-critical-service-hall',
    name: 'Claim Critical Service Hall',
    category: 'economic',
    essential: true,
  };
  const service = {
    localUid: 'claim-critical-service',
    name: 'Claim Critical Counsel',
    category: 'legal',
    providedBy: 'custom:claim-critical-service-hall',
  };
  return boundedGenerationTransition({
    seedPrefix: 'claim-service-criticality',
    controlContent: {
      institutions: [provider],
      services: [{ ...service, criticality: 'discretionary' }],
    },
    activatedContent: {
      institutions: [provider],
      services: [{ ...service, criticality: 'critical' }],
    },
    observe: settlement => serviceNamed(settlement, service.name),
    accept: (control, activated) => control === false && activated === true,
  });
}

function serviceCategoryProbe() {
  const provider = {
    localUid: 'claim-category-service-hall',
    name: 'Claim Category Service Hall',
    category: 'economic',
    essential: true,
  };
  const service = {
    localUid: 'claim-category-service',
    name: 'Claim Category Service',
    criticality: 'critical',
    providedBy: `custom:${provider.localUid}`,
  };

  for (let index = 0; index < 64; index += 1) {
    const seed = `claim-service-category-${index}`;
    const controlSettlement = generate({
      institutions: [provider],
      services: [{ ...service, category: 'legal' }],
    }, { seed, tier: 'thorp' });
    const activatedSettlement = generate({
      institutions: [provider],
      services: [{ ...service, category: 'healing' }],
    }, { seed, tier: 'thorp' });
    const control = deriveAllCapacities(controlSettlement)
      .capacities.healing.supply;
    const activated = deriveAllCapacities(activatedSettlement)
      .capacities.healing.supply;
    if (activated > control) return { control, activated };
  }
  throw new Error(
    'services.category had no healing-capacity transition in its 64-seed corpus.',
  );
}

function institutionProducesProbe() {
  const provider = {
    localUid: 'claim-producing-hall',
    name: 'Claim Producing Hall',
    category: 'economic',
    essential: true,
  };
  const service = {
    localUid: 'claim-produced-service',
    name: 'Claim Produced Service',
    category: 'legal',
    criticality: 'discretionary',
    providedBy: 'custom:claim-producing-hall',
  };
  return boundedGenerationTransition({
    seedPrefix: 'claim-institution-produces',
    controlContent: {
      institutions: [provider],
      services: [service],
    },
    activatedContent: {
      institutions: [{
        ...provider,
        produces: ['custom:claim-produced-service'],
      }],
      services: [service],
    },
    observe: settlement => serviceNamed(settlement, service.name),
    accept: (control, activated) => control === false && activated === true,
  });
}

function institutionSubsumesProbe() {
  const greater = {
    localUid: 'claim-greater-hall',
    name: 'Claim Greater Hall',
    category: 'economic',
    essential: true,
  };
  const lesser = {
    localUid: 'claim-lesser-hall',
    name: 'Claim Lesser Hall',
    category: 'economic',
  };
  return boundedGenerationTransition({
    seedPrefix: 'claim-institution-subsumes',
    controlContent: { institutions: [greater, lesser] },
    activatedContent: {
      institutions: [{
        ...greater,
        subsumes: ['custom:claim-lesser-hall'],
      }, lesser],
    },
    observe: materialized('institutions', lesser.name),
    accept: (control, activated) => control === true && activated === false,
  });
}

function tierGateProbe(bucket, field) {
  const isMinimum = field === 'tierMin';
  const eligibleTier = isMinimum ? 'town' : 'village';
  const ineligibleTier = isMinimum ? 'village' : 'town';
  const gate = isMinimum ? 'town' : 'village';
  const name = `Claim ${bucket} ${field}`;
  let customContent;

  if (bucket === 'institutions') {
    customContent = {
      institutions: [{
        localUid: `claim-${bucket}-${field}`,
        name,
        category: 'economic',
        essential: true,
        [field]: gate,
      }],
    };
  } else if (bucket === 'resources') {
    customContent = {
      resources: [{
        localUid: `claim-${bucket}-${field}`,
        name,
        category: 'mineral',
        essential: true,
        [field]: gate,
      }],
    };
  } else {
    const provider = {
      localUid: `claim-${bucket}-${field}-provider`,
      name: `Claim ${bucket} ${field} Provider`,
      category: 'economic',
      essential: true,
    };
    customContent = {
      institutions: [provider],
      services: [{
        localUid: `claim-${bucket}-${field}`,
        name,
        category: 'legal',
        criticality: 'critical',
        providedBy: `custom:${provider.localUid}`,
        [field]: gate,
      }],
    };
  }

  const observe = materialized(bucket, name);
  return {
    control: observe(generate(customContent, {
      seed: `claim-${bucket}-${field}`,
      tier: ineligibleTier,
      projectEligibility: true,
    })),
    activated: observe(generate(customContent, {
      seed: `claim-${bucket}-${field}`,
      tier: eligibleTier,
      projectEligibility: true,
    })),
  };
}

function providedByProbe() {
  const provider = {
    localUid: 'claim-provider-gate-hall',
    name: 'Claim Provider Gate Hall',
    category: 'economic',
    essential: true,
  };
  const service = {
    localUid: 'claim-provider-gate-service',
    name: 'Claim Provider Gate Service',
    category: 'legal',
    criticality: 'critical',
  };
  const observe = settlement => serviceNamed(settlement, service.name);
  return {
    control: observe(generate({
      institutions: [provider],
      services: [{
        ...service,
        providedBy: 'custom:archived-provider',
      }],
    }, { seed: 'claim-service-provider-gate' })),
    activated: observe(generate({
      institutions: [provider],
      services: [{
        ...service,
        providedBy: `custom:${provider.localUid}`,
      }],
    }, { seed: 'claim-service-provider-gate' })),
  };
}

function foodProjection(customContent, {
  tier = 'town',
  institutions = [],
  resources = [],
} = {}) {
  return withCustomContent(customContent, () => generateFoodSecurity(
    tier,
    institutions,
    {
      _population: 4_000,
      terrainType: 'plains',
      tradeRouteAccess: 'road',
      nearbyResources: resources,
      nearbyResourcesCustom: resources,
      nearbyResourcesDepleted: [],
      monsterThreat: 'civilized',
    },
  ));
}

function institutionFoodProbe() {
  const institution = {
    localUid: 'claim-food-institution',
    name: 'Azure Ledger',
    category: 'economic',
  };
  const present = [{ name: institution.name }];
  return {
    control: foodProjection({
      institutions: [{ ...institution, foodImpact: 'none' }],
    }, { institutions: present }).dailyProduction,
    activated: foodProjection({
      institutions: [{ ...institution, foodImpact: 'produces' }],
    }, { institutions: present }).dailyProduction,
  };
}

function resourceFoodProbe() {
  const resource = {
    localUid: 'claim-food-resource',
    name: 'Azure Crystal',
    category: 'mineral',
  };
  return {
    control: foodProjection({
      resources: [{ ...resource, foodImpact: 'none' }],
    }, { resources: [resource.name] }).dailyProduction,
    activated: foodProjection({
      resources: [{ ...resource, foodImpact: 'produces' }],
    }, { resources: [resource.name] }).dailyProduction,
  };
}

function providerBoundFoodProbe(bucket) {
  const provider = {
    localUid: `claim-${bucket}-food-provider`,
    name: `Claim ${bucket} Food Provider`,
    category: 'economic',
  };
  const dependencyField = bucket === 'services'
    ? 'providedBy'
    : 'requiredInstitution';
  const dependent = {
    localUid: `claim-${bucket}-food-dependent`,
    name: `Claim ${bucket} Food Dependent`,
    category: 'economic',
    [dependencyField]: `custom:${provider.localUid}`,
  };
  const institutions = [{ name: provider.name }];
  return {
    control: foodProjection({
      institutions: [provider],
      [bucket]: [{ ...dependent, foodImpact: 'none' }],
    }, { institutions }).dailyNeed,
    activated: foodProjection({
      institutions: [provider],
      [bucket]: [{ ...dependent, foodImpact: 'consumes' }],
    }, { institutions }).dailyNeed,
  };
}

function tierBoundServiceFoodProbe() {
  const provider = {
    localUid: 'claim-tier-food-provider',
    name: 'Claim Tier Food Provider',
    category: 'economic',
  };
  const service = {
    localUid: 'claim-tier-food-service',
    name: 'Claim Tier Food Service',
    category: 'economic',
    tierMin: 'city',
    providedBy: `custom:${provider.localUid}`,
  };
  const institutions = [{ name: provider.name }];
  const neutral = {
    institutions: [provider],
    services: [{ ...service, foodImpact: 'none' }],
  };
  const consumer = {
    institutions: [provider],
    services: [{ ...service, foodImpact: 'consumes' }],
  };
  return {
    control: {
      hamlet: foodProjection(neutral, {
        tier: 'hamlet',
        institutions,
      }).dailyNeed,
      city: foodProjection(neutral, {
        tier: 'city',
        institutions,
      }).dailyNeed,
    },
    activated: {
      hamlet: foodProjection(consumer, {
        tier: 'hamlet',
        institutions,
      }).dailyNeed,
      city: foodProjection(consumer, {
        tier: 'city',
        institutions,
      }).dailyNeed,
    },
    verify({ control, activated }) {
      expect(activated.hamlet).toBe(control.hamlet);
      expect(activated.city).toBeGreaterThan(control.city);
    },
  };
}

function finishedGoodsProjection(customContent, institutions) {
  return withCustomContent(customContent, () => {
    const exports = [];
    const imports = [];
    computeFinishedGoodsDemand(
      'town',
      'road',
      institutions,
      [],
      exports,
      imports,
    );
    return { exports, imports };
  });
}

function institutionSupplyProbe(field) {
  const institution = {
    localUid: `claim-institution-${field}`,
    name: `Claim Institution ${field}`,
    category: 'economic',
    satisfies: 'military',
    economicWeight: 'backbone',
  };
  const institutions = [
    { name: 'Barracks' },
    { name: institution.name },
  ];
  const control = field === 'economicWeight'
    ? { ...institution, economicWeight: 'minor' }
    : { ...institution, satisfies: 'manufactured' };
  return {
    control: finishedGoodsProjection(
      { institutions: [control] },
      institutions,
    ),
    activated: finishedGoodsProjection(
      { institutions: [institution] },
      institutions,
    ),
  };
}

function tradeGoodSupplyProbe(field) {
  const provider = {
    localUid: `claim-good-${field}-provider`,
    name: `Claim Good ${field} Provider`,
    category: 'economic',
  };
  const tradeGood = {
    localUid: `claim-good-${field}`,
    name: `Claim Good ${field}`,
    category: 'manufactured',
    satisfies: 'military',
    economicWeight: 'backbone',
    requiredInstitution: `custom:${provider.localUid}`,
  };
  const institutions = [
    { name: 'Barracks' },
    { name: provider.name },
  ];
  const control = field === 'economicWeight'
    ? { ...tradeGood, economicWeight: 'minor' }
    : { ...tradeGood, satisfies: 'manufactured' };
  return {
    control: finishedGoodsProjection({
      institutions: [provider],
      tradeGoods: [control],
    }, institutions),
    activated: finishedGoodsProjection({
      institutions: [provider],
      tradeGoods: [tradeGood],
    }, institutions),
  };
}

function tradeGoodRequirementProbe() {
  const provider = {
    localUid: 'claim-good-required-provider',
    name: 'Claim Good Required Provider',
    category: 'economic',
  };
  const tradeGood = {
    localUid: 'claim-good-required',
    name: 'Claim Required Good',
    category: 'manufactured',
    satisfies: 'military',
    economicWeight: 'backbone',
    requiredInstitution: `custom:${provider.localUid}`,
  };
  const content = {
    institutions: [provider],
    tradeGoods: [tradeGood],
  };
  return {
    control: finishedGoodsProjection(content, [{ name: 'Barracks' }]),
    activated: finishedGoodsProjection(content, [
      { name: 'Barracks' },
      { name: provider.name },
    ]),
  };
}

function revisionedClaimContent(customContent) {
  return Object.fromEntries(
    Object.entries(customContent).map(([category, items]) => {
      if (!Array.isArray(items)) return [category, items];
      return [
        category,
        items.map((item) => {
          if (!item?.localUid || category === 'supplyChains') return item;
          return {
            ...item,
            definitionId: `definition:${category}:${item.localUid}`,
            revisionId: `revision:${category}:${item.localUid}:1`,
            revisionNumber: 1,
            contentHash: contentRevisionHash(category, item),
          };
        }),
      ];
    }),
  );
}

function confirmedChains(customContent) {
  return inferSupplyChains(revisionedClaimContent(customContent))
    .map(chain => confirmCustomSupplyChainReview(chain));
}

function evaluatedChainProjection(reviewed, customContent, runtime) {
  return evaluateConfirmedCustomSupplyChains(reviewed, {
    tier: 'town',
    institutions: runtime.institutions || [],
    resources: runtime.resources || [],
    depletedResources: [],
    availableServices: runtime.availableServices || {},
    registry: buildRegistry(revisionedClaimContent(customContent)),
  }).map(chain => ({
    state: chain.activation.state,
    reasons: chain.activation.reasons,
    exports: chain.tradeEndpoints.exports,
    imports: chain.tradeEndpoints.imports,
    promoted: chain.tradeEndpoints.promoted,
  }));
}

function resourceCommoditiesProbe() {
  const shared = {
    institutions: [{
      localUid: 'claim-commodities-processor',
      name: 'Claim Commodities Processor',
      category: 'economic',
      requires: ['amber grain', 'silver pollen'],
      produces: ['custom:claim-commodities-good'],
    }],
    tradeGoods: [{
      localUid: 'claim-commodities-good',
      name: 'Claim Commodities Good',
      category: 'manufactured',
      requiredInstitution: 'custom:claim-commodities-processor',
    }],
  };
  const resource = {
    localUid: 'claim-commodities-resource',
    name: 'Claim Commodities Resource',
    category: 'agricultural',
  };
  const controlContent = revisionedClaimContent({
    ...shared,
    resources: [{ ...resource, commodities: ['amber grain'] }],
  });
  const activatedContent = revisionedClaimContent({
    ...shared,
    resources: [{ ...resource, commodities: ['silver pollen'] }],
  });
  const controlDiscovery = inferSupplyChains(controlContent)[0];
  const activatedDiscovery = inferSupplyChains(activatedContent)[0];
  if (!controlDiscovery || !activatedDiscovery) {
    throw new Error('resources.commodities did not produce both reviewable graphs.');
  }
  const controlReviewed = confirmCustomSupplyChainReview(controlDiscovery);
  const activatedReviewed = confirmCustomSupplyChainReview(
    activatedDiscovery,
  );
  const projection = chain => ({
    fingerprint: customSupplyChainProjectionFingerprint(chain),
    edges: chain.discovered.edges.map(edge => edge.commodity),
    imports: chain.discovered.tradeEndpoints.imports
      .map(endpoint => endpoint.label),
    exports: chain.discovered.tradeEndpoints.exports
      .map(endpoint => endpoint.label),
  });

  return {
    control: {
      projection: projection(controlReviewed),
      stillCurrentAfterChange: customSupplyChainReviewMatches(
        controlReviewed,
        activatedDiscovery,
      ),
    },
    activated: {
      projection: projection(activatedReviewed),
      stillCurrentAfterChange: customSupplyChainReviewMatches(
        activatedReviewed,
        activatedDiscovery,
      ),
    },
    verify({ control, activated }) {
      expect(control.projection.fingerprint)
        .not.toBe(activated.projection.fingerprint);
      expect(control.projection.edges)
        .not.toEqual(activated.projection.edges);
      expect(control.projection.imports)
        .not.toEqual(activated.projection.imports);
      expect(control.projection.exports)
        .toEqual(activated.projection.exports);
      expect(control.stillCurrentAfterChange).toBe(false);
      expect(activated.stillCurrentAfterChange).toBe(true);
    },
  };
}

/**
 * Input relationships are re-read from the exact reviewed definition. The
 * control chain is active; confirming a projection with one stable resource
 * dependency whose definition is eligible but absent from this settlement
 * must block endpoint promotion.
 */
function reviewedInputRelationshipProbe(bucket, field) {
  const resource = {
    localUid: `claim-${bucket}-${field}-resource`,
    name: 'Asterium',
    category: 'mineral',
  };
  const institution = {
    localUid: `claim-${bucket}-${field}-institution`,
    name: 'Brasswright',
    category: 'economic',
    essential: true,
  };
  const service = {
    localUid: `claim-${bucket}-${field}-service`,
    name: 'Wayfinding',
    category: 'economic',
    criticality: 'critical',
    providedBy: `custom:${institution.localUid}`,
  };
  const tradeGood = {
    localUid: `claim-${bucket}-${field}-good`,
    name: 'Stormglass',
    category: 'manufactured',
    requiredInstitution: `custom:${institution.localUid}`,
  };

  let controlContent;
  let activatedContent;
  let runtime;
  if (bucket === 'institutions') {
    controlContent = {
      institutions: [{
        ...institution,
        produces: [`custom:${tradeGood.localUid}`],
      }],
      resources: [resource],
      tradeGoods: [tradeGood],
    };
    activatedContent = structuredClone(controlContent);
    activatedContent.institutions[0][field] = [
      `custom:${resource.localUid}`,
    ];
    runtime = { institutions: [institution.name] };
  } else if (bucket === 'services') {
    controlContent = {
      institutions: [institution],
      resources: [resource],
      services: [service],
    };
    activatedContent = structuredClone(controlContent);
    activatedContent.services[0][field] = [`custom:${resource.localUid}`];
    runtime = {
      institutions: [institution.name],
      availableServices: {
        equipment: [{ name: service.name }],
      },
    };
  } else {
    controlContent = {
      institutions: [institution],
      resources: [resource],
      tradeGoods: [tradeGood],
    };
    activatedContent = structuredClone(controlContent);
    activatedContent.tradeGoods[0][field] = [
      `custom:${resource.localUid}`,
    ];
    runtime = { institutions: [institution.name] };
  }

  const controlReviewed = confirmedChains(controlContent);
  const activatedReviewed = confirmedChains(activatedContent);
  if (controlReviewed.length === 0 || activatedReviewed.length === 0) {
    throw new Error(`${bucket}.${field} control produced no reviewable chain.`);
  }
  return {
    control: evaluatedChainProjection(
      controlReviewed,
      controlContent,
      runtime,
    ),
    activated: evaluatedChainProjection(
      activatedReviewed,
      activatedContent,
      runtime,
    ),
    verify({ control, activated }) {
      expect(control.every(chain => chain.promoted)).toBe(true);
      expect(activated.some(chain => (
        chain.state === 'blocked'
        && chain.promoted === false
        && chain.reasons.some(reason => (
          reason.code === 'not_materialized'
          && reason.component === resource.name
        ))
      ))).toBe(true);
    },
  };
}

/**
 * `resource.yields` is an output relationship: it creates a reviewable path to
 * the referenced output, but unrelated sibling yields cannot block another
 * confirmed path. Prove the field through the real inference + activation
 * boundary rather than pretending every library yield is globally mandatory.
 */
function resourceYieldsProbe() {
  const resource = {
    localUid: 'claim-resource-yields-source',
    name: 'Claim Yield Source',
    category: 'mineral',
  };
  const tradeGood = {
    localUid: 'claim-resource-yields-good',
    name: 'Claim Yielded Good',
    category: 'manufactured',
  };
  const controlContent = {
    resources: [resource],
    tradeGoods: [tradeGood],
  };
  const activatedContent = {
    resources: [{
      ...resource,
      yields: [`custom:${tradeGood.localUid}`],
    }],
    tradeGoods: [tradeGood],
  };
  const controlReviewed = confirmedChains(controlContent);
  const activatedReviewed = confirmedChains(activatedContent);
  const runtime = { resources: [resource.name] };

  return {
    control: evaluatedChainProjection(
      controlReviewed,
      controlContent,
      runtime,
    ),
    activated: evaluatedChainProjection(
      activatedReviewed,
      activatedContent,
      runtime,
    ),
    verify({ control, activated }) {
      expect(control).toEqual([]);
      expect(activated.length).toBeGreaterThan(0);
      expect(activated.every(chain => (
        chain.state === 'active' && chain.promoted
      ))).toBe(true);
    },
  };
}

function deitySettlement(axis, value) {
  return {
    population: 4_000,
    config: {
      primaryDeitySnapshot: {
        _deityRef: 'custom:claim-deity',
        name: 'Claim Deity',
        alignmentAxis: 'neutral',
        lawAxis: 'neutral',
        rankAxis: 'minor',
        [axis]: value,
      },
    },
    institutions: [],
  };
}

function claim(consumer, observation, probe) {
  return Object.freeze({ consumer, observation, probe });
}

/**
 * Public-by-design test authority. When the manifest adds, removes, or
 * reclassifies a field, the exact-key assertion below forces an engineer to
 * name its canonical consumer and provide an observable activation proof.
 */
export const MECHANICAL_CLAIM_MATRIX = Object.freeze({
  'institutions.essential': claim(
    'assembleInstitutions',
    'the institution enters the canonical final roster',
    () => optionalInstitutionProbe('essential', true),
  ),
  'institutions.foodImpact': claim(
    'foodGenerator.generateFoodSecurity',
    'canonical daily food production changes',
    institutionFoodProbe,
  ),
  'institutions.economicWeight': claim(
    'dependencyEngine.finishedGoodsSupply',
    'the finished-goods import gap changes',
    () => institutionSupplyProbe('economicWeight'),
  ),
  'institutions.satisfies': claim(
    'dependencyEngine.finishedGoodsSupply',
    'a registered live demand key changes the finished-goods gap',
    () => institutionSupplyProbe('satisfies'),
  ),
  'institutions.tierMin': claim(
    'eligibleCustomContent',
    'the institution is absent below and present at its inclusive minimum',
    () => tierGateProbe('institutions', 'tierMin'),
  ),
  'institutions.tierMax': claim(
    'eligibleCustomContent',
    'the institution is absent above and present at its inclusive maximum',
    () => tierGateProbe('institutions', 'tierMax'),
  ),
  'institutions.produces': claim(
    'institutionServices',
    'the produced definition enters canonical available services',
    institutionProducesProbe,
  ),
  'institutions.requires': claim(
    'customSupplyChainActivation',
    'a confirmed path blocks when its current required input is absent',
    () => reviewedInputRelationshipProbe('institutions', 'requires'),
  ),
  'institutions.subsumes': claim(
    'assembleInstitutions',
    'the represented lesser institution leaves the canonical roster',
    institutionSubsumesProbe,
  ),
  'services.criticality': claim(
    'economyReconcilePass',
    'a critical service is forced into canonical available services',
    serviceCriticalityProbe,
  ),
  'services.category': claim(
    'capacityModel',
    'the canonical healing bucket changes live healing capacity',
    serviceCategoryProbe,
  ),
  'services.foodImpact': claim(
    'foodGenerator.generateFoodSecurity',
    'eligible provider-bound demand changes while ineligible demand stays inert',
    tierBoundServiceFoodProbe,
  ),
  'services.tierMin': claim(
    'eligibleCustomContent',
    'the service is absent below and present at its inclusive minimum',
    () => tierGateProbe('services', 'tierMin'),
  ),
  'services.tierMax': claim(
    'eligibleCustomContent',
    'the service is absent above and present at its inclusive maximum',
    () => tierGateProbe('services', 'tierMax'),
  ),
  'services.providedBy': claim(
    'economyReconcilePass',
    'only a resolved materialized provider activates the service',
    providedByProbe,
  ),
  'services.requires': claim(
    'customSupplyChainActivation',
    'a confirmed service path blocks when its current required input is absent',
    () => reviewedInputRelationshipProbe('services', 'requires'),
  ),
  'resources.criticality': claim(
    'resolveResources',
    'a critical resource enters the canonical resource roster',
    () => optionalResourceProbe('criticality', 'critical'),
  ),
  'resources.essential': claim(
    'resolveResources',
    'an essential resource enters the canonical resource roster',
    () => optionalResourceProbe('essential', true),
  ),
  'resources.foodImpact': claim(
    'foodGenerator.generateFoodSecurity',
    'canonical daily food production changes',
    resourceFoodProbe,
  ),
  'resources.commodities': claim(
    'inferSupplyChains',
    'the reviewed graph fingerprint, edge token, and unmatched import endpoint change',
    resourceCommoditiesProbe,
  ),
  'resources.tierMin': claim(
    'eligibleCustomContent',
    'the resource is absent below and present at its inclusive minimum',
    () => tierGateProbe('resources', 'tierMin'),
  ),
  'resources.tierMax': claim(
    'eligibleCustomContent',
    'the resource is absent above and present at its inclusive maximum',
    () => tierGateProbe('resources', 'tierMax'),
  ),
  'resources.yields': claim(
    'customSupplyChainActivation',
    'a declared output creates an activatable reviewed resource path',
    resourceYieldsProbe,
  ),
  'tradeGoods.economicWeight': claim(
    'dependencyEngine.finishedGoodsSupply',
    'the named good changes the finished-goods import or export projection',
    () => tradeGoodSupplyProbe('economicWeight'),
  ),
  'tradeGoods.foodImpact': claim(
    'foodGenerator.generateFoodSecurity',
    'provider-bound canonical daily food need changes',
    () => providerBoundFoodProbe('tradeGoods'),
  ),
  'tradeGoods.satisfies': claim(
    'dependencyEngine.finishedGoodsSupply',
    'only a registered live demand key changes the trade projection',
    () => tradeGoodSupplyProbe('satisfies'),
  ),
  'tradeGoods.requiredInstitution': claim(
    'dependencyEngine.finishedGoodsSupply',
    'the named good remains dormant until its provider is present',
    tradeGoodRequirementProbe,
  ),
  'tradeGoods.requiredResources': claim(
    'customSupplyChainActivation',
    'a confirmed good path blocks when its current required input is absent',
    () => reviewedInputRelationshipProbe(
      'tradeGoods',
      'requiredResources',
    ),
  ),
  'deities.alignmentAxis': claim(
    'worldPulse.piety',
    'an assigned deity changes the live corruption-pressure multiplier',
    () => ({
      control: corruptionPlaneMult({
        alignmentAxis: 'good',
        lawAxis: 'chaotic',
      }, 1),
      activated: corruptionPlaneMult({
        alignmentAxis: 'evil',
        lawAxis: 'chaotic',
      }, 1),
    }),
  ),
  'deities.lawAxis': claim(
    'causalState',
    'an assigned deity changes the canonical law-order score',
    () => ({
      control: deriveSystemVariable(
        'law_order',
        deitySettlement('lawAxis', 'chaotic'),
      )?.score,
      activated: deriveSystemVariable(
        'law_order',
        deitySettlement('lawAxis', 'lawful'),
      )?.score,
    }),
  ),
  'deities.rankAxis': claim(
    'causalState',
    'an assigned deity changes the canonical religious-authority score',
    () => ({
      control: deriveSystemVariable(
        'religious_authority',
        deitySettlement('rankAxis', 'cult'),
      )?.score,
      activated: deriveSystemVariable(
        'religious_authority',
        deitySettlement('rankAxis', 'major'),
      )?.score,
    }),
  ),
});

function mechanicalManifestFields() {
  return CUSTOM_CONTENT_MANIFEST.categories
    .flatMap(category => category.fields
      .filter(field => field.effect === 'mechanical')
      .map(field => `${category.key}.${field.key}`))
    .sort();
}

function manifestField(key) {
  const [bucket, fieldKey] = key.split('.');
  return CUSTOM_CONTENT_MANIFEST.categories
    .find(category => category.key === bucket)
    ?.fields.find(field => field.key === fieldKey);
}

describe('custom-content mechanical claim truth matrix', () => {
  it('has exactly one executable claim for every mechanical manifest field', () => {
    expect(Object.keys(MECHANICAL_CLAIM_MATRIX).sort())
      .toEqual(mechanicalManifestFields());
  });

  it('does not let custom subsumption remove an essential custom institution', () => {
    const greater = {
      localUid: 'essential-greater-hall',
      name: 'Essential Greater Hall',
      category: 'economic',
      essential: true,
      subsumes: ['custom:essential-lesser-hall'],
    };
    const lesser = {
      localUid: 'essential-lesser-hall',
      name: 'Essential Lesser Hall',
      category: 'economic',
      essential: true,
    };

    const settlement = generate(
      { institutions: [greater, lesser] },
      { seed: 'essential-custom-subsumption' },
    );

    expect(settlement.institutions).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: greater.name, required: true }),
      expect.objectContaining({ name: lesser.name, required: true }),
    ]));
  });

  it.each(Object.entries(MECHANICAL_CLAIM_MATRIX))(
    '%s changes its declared canonical observable',
    (key, entry) => {
      const field = manifestField(key);
      expect(field).toMatchObject({
        effect: 'mechanical',
        activation: 'conditional',
      });
      expect(field.consumers).toContain(entry.consumer);
      expect(entry.observation.length).toBeGreaterThan(0);

      const result = entry.probe();
      if (result.verify) {
        result.verify(result);
      } else {
        expect(result.activated).not.toEqual(result.control);
      }
    },
  );
});
