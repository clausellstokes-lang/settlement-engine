/**
 * Executable neutrality contract for every presentation-only manifest field.
 *
 * Presentation values are allowed to change dossier copy, grouping, scene
 * intent, and exact revision provenance. They are not allowed to change the
 * settlement's canonical simulation. Each test mutates one admitted
 * presentation field in the all-category reference pack, runs the real
 * generator with the same seed, removes only named presentation/provenance
 * surfaces, and compares the remaining mechanics digest.
 */

import { describe, expect, it } from 'vitest';

import {
  admitCustomContentDefinition,
  CUSTOM_CONTENT_MANIFEST,
} from '../../src/domain/content/customContentManifest.js';
import {
  isMaterializedCustomContent,
} from '../../src/domain/content/customContentSemanticAuthority.js';
import {
  tradeLabelOwnership,
} from '../../src/domain/content/customTradeLabelOwnership.js';
import { fingerprintContent } from '../../src/domain/content/contentFingerprint.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { computeEffectiveMagicPresence } from '../../src/generators/priorityHelpers.js';
import { generateSafetyProfile } from '../../src/generators/safetyProfile.js';
import {
  generateResourceAnalysis,
} from '../../src/generators/resourceGenerator.js';
import {
  applyFactionInstitutionBoosts,
} from '../../src/generators/factionCorrelation.js';
import {
  computeBaseProsperity,
} from '../../src/generators/economy/prosperity.js';
import {
  generateTradeIncomeStreams,
} from '../../src/generators/economy/tradeGoods.js';
import {
  clearActiveRng,
  setActiveRng,
} from '../../src/kernel/rngContext.js';
import {
  confirmCustomSupplyChainReview,
} from '../../src/domain/content/customSupplyChainReview.js';
import {
  inferSupplyChains,
} from '../../src/domain/inferSupplyChains.js';
import {
  customContentReferencePack,
  identifyCustomContentPack,
} from '../fixtures/customContentReferencePack.js';

const CONFIG = Object.freeze({
  settType: 'town',
  culture: 'germanic',
  terrainOverride: 'plains',
  tradeRouteAccess: 'crossroads',
  monsterThreat: 'civilized',
});

const EXACT_NATIVE_COLLISION_CONFIG = Object.freeze({
  ...CONFIG,
  nearbyResourcesRandom: false,
  nearbyResources: [],
});

const NON_MECHANICAL_SETTLEMENT_SURFACES = Object.freeze([
  'arrivalScene',
  'coherenceNotes',
  'customContentProvenance',
  // The receipt certifies both mechanical state and intentionally mutable
  // presentation surfaces such as history and dramatic prose. It is
  // diagnostic provenance, not canonical simulation state, and has dedicated
  // executable contracts of its own.
  'generationCoherenceReceipt',
  'history',
  'pressureSentence',
  'settlementReason',
  'simulationTrace',
  'spatialLayout',
  'structuralSuggestions',
  'structuralViolations',
]);

const PRESENTATION_KEYS_BY_CATEGORY = new Map(
  CUSTOM_CONTENT_MANIFEST.categories.map(category => [
    category.key,
    new Set(
      category.fields
        .filter(field => field.effect === 'presentation')
        .map(field => field.key)
        .filter(key => key !== 'name'),
    ),
  ]),
);

const REFERENCE_BY_CATEGORY = Object.freeze({
  factions: 'custom:reference-aurora-compact',
  institutions: 'custom:reference-aurora-cart-shed',
  tradeGoods: 'custom:reference-aurora-field-rations',
});

function presentationCases() {
  return CUSTOM_CONTENT_MANIFEST.categories.flatMap(category => (
    category.authorable
      ? category.fields
        .filter(field => field.effect === 'presentation')
        .map(field => ({
          key: `${category.key}.${field.key}`,
          bucket: category.key,
          field,
        }))
      : []
  ));
}

function alternativeValue(bucket, field, current) {
  if (field.type === 'boolean') return current === true ? false : true;
  if (field.type === 'enum') {
    const values = Array.isArray(field.values) ? field.values : [];
    const alternative = values.find(value => value !== current);
    if (alternative !== undefined) return alternative;
    throw new Error(`${bucket}.${field.key} has no alternative enum value.`);
  }
  if (field.type === 'string') {
    if (field.key === 'name') {
      // A display label is not a native semantic key. Use adversarial labels
      // that collide with the engine's legacy keyword vocabulary so this
      // contract catches accidental name-driven mechanics rather than proving
      // neutrality with the mechanically inert suffix "Revised".
      const adversarialNames = {
        institutions:
          "State Granary Mill Teleportation Circle Mages' Guild Cathedral Hospital Market Watch Port",
        services:
          'Food Drink Healing Magic Crime Lodging Transport',
        resources:
          'grain_fields fertile_floodplain fishing_grounds river_mills',
        stressors:
          'Famine Plague Siege Occupied War Mass Migration',
        tradeGoods:
          'Weapons Armor Luxury Food Rations',
        factions:
          'Royal Merchant Guild Criminal Church Military',
        deities:
          'War Death Harvest Magic Law',
        traditions:
          'Harvest War Magic Trade Faith',
      };
      return adversarialNames[bucket] || `${current} Revised`;
    }
    return `Alternate ${bucket} ${field.key}`;
  }
  if (field.type === 'string-or-string-list') {
    if (Array.isArray(field.values)) {
      const currentValues = new Set(Array.isArray(current) ? current : [current]);
      const alternative = field.values.find(value => !currentValues.has(value));
      return alternative === undefined ? [] : [alternative];
    }
    if (field.category) {
      const reference = REFERENCE_BY_CATEGORY[field.category];
      if (!reference) {
        throw new Error(
          `${bucket}.${field.key} has no reference-pack category target.`,
        );
      }
      const currentValues = Array.isArray(current) ? current : [current];
      return currentValues.includes(reference) ? [] : [reference];
    }
    return ['alternate presentation value'];
  }
  throw new Error(`${bucket}.${field.key} has unsupported type ${field.type}.`);
}

function variantFor({ bucket, field }) {
  const pack = customContentReferencePack();
  const definition = pack[bucket][0];
  definition[field.key] = alternativeValue(
    bucket,
    field,
    definition[field.key],
  );
  const admission = admitCustomContentDefinition(bucket, definition, {
    allowSystemFields: true,
  });
  expect(admission, `${bucket}.${field.key} variant admission`).toMatchObject({
    ok: true,
  });
  return pack;
}

function generated(pack, seed, config = CONFIG) {
  return generateSettlementPipeline(
    config,
    null,
    {
      seed,
      customContent: identifyCustomContentPack(pack),
    },
  );
}

function withFixedRandom(value, action) {
  const previous = setActiveRng({ random: () => value });
  try {
    return action();
  } finally {
    clearActiveRng(previous);
  }
}

function customInstitution(name, category = 'residential') {
  return {
    name,
    category,
    isCustom: true,
    customDefinitionId: 'definition:institutions:presentation-probe',
    customDefinitionCategory: 'institutions',
  };
}

function referencePackWithName(bucket, name) {
  const pack = customContentReferencePack();
  const definition = pack[bucket][0];
  definition.name = name;
  definition.tierMin = 'thorp';
  definition.tierMax = 'metropolis';
  return pack;
}

function reviewedReferencePackWithTradeGoodName(name) {
  const source = customContentReferencePack();
  source.tradeGoods[0].name = name;
  const pack = identifyCustomContentPack(source);
  const supplyChains = inferSupplyChains(pack)
    .filter(chain => (
      chain.discovered?.nodes?.some(node => (
        node.refId === 'custom:reference-aurora-grain'
      ))
      && !chain.discovered?.nodes?.some(node => (
        node.refId === 'custom:reference-aurora-cart-shed'
      ))
      && chain.discovered?.nodes?.[
        chain.discovered.nodes.length - 1
      ]?.refId === 'custom:reference-aurora-field-rations'
    ))
    .map(chain => confirmCustomSupplyChainReview({
      ...chain,
      outputs: [name],
      exportable: true,
      discovered: {
        ...chain.discovered,
        tradeEndpoints: {
          imports: [],
          exports: [{ label: name }],
        },
      },
    }));
  expect(supplyChains.length).toBeGreaterThan(0);
  return { ...pack, supplyChains };
}

function nativeInstitutionNames(settlement) {
  return settlement.institutions
    .filter(institution => !isMaterializedCustomContent(institution))
    .map(institution => institution.name)
    .sort();
}

function adversarialNameMatrixPacks() {
  const control = customContentReferencePack();
  // Materialize the settlement-bearing definitions at every tier so the
  // matrix exercises native small-settlement branches as well as town+.
  for (const bucket of ['institutions', 'services', 'resources']) {
    for (const definition of control[bucket] || []) {
      definition.tierMin = 'thorp';
      definition.tierMax = 'metropolis';
    }
  }
  const adversarial = structuredClone(control);
  for (const [bucket, definitions] of Object.entries(adversarial)) {
    for (const [index, definition] of definitions.entries()) {
      const adversarial = alternativeValue(
        bucket,
        { key: 'name', type: 'string' },
        definition.name,
      );
      // Preserve distinct display labels so this matrix isolates semantic
      // keyword leakage rather than exercising the separate duplicate-name
      // ambiguity contract.
      definition.name = definitions.length > 1
        ? `${adversarial} ${index + 1}`
        : adversarial;
    }
  }
  // Cover resource-only native gates that do not appear in the primary
  // generation digest at every route/tier (arcane institution odds, metal and
  // herb chains) as well as food/fishing semantics.
  adversarial.resources[0].name = [
    adversarial.resources[0].name,
    'magical_node',
    'iron_deposits',
    'rare_herbs',
  ].join(' ');
  return { control, adversarial };
}

const NAME_AUTHORITY_MATRIX = Object.freeze(
  ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']
    .flatMap(tier => [
      {
        label: `${tier}/plains/road`,
        config: {
          ...CONFIG,
          settType: tier,
          terrainOverride: 'plains',
          tradeRouteAccess: 'road',
        },
        seed: `presentation-name-probe-${tier}-road`,
      },
      {
        label: `${tier}/mountain/isolated`,
        config: {
          ...CONFIG,
          settType: tier,
          terrainOverride: 'mountain',
          tradeRouteAccess: 'isolated',
        },
        seed: `presentation-name-probe-${tier}-isolated`,
      },
      {
        label: `${tier}/coastal/port`,
        config: {
          ...CONFIG,
          settType: tier,
          terrainOverride: 'coastal',
          tradeRouteAccess: 'port',
        },
        seed: `presentation-name-probe-${tier}-port`,
      },
    ]),
);

function customNameTokens(...packs) {
  const tokenByName = new Map();
  for (const pack of packs) {
    for (const [bucket, definitions] of Object.entries(pack)) {
      for (const definition of definitions) {
        tokenByName.set(
          definition.name,
          `<custom:${bucket}:${definition.localUid}>`,
        );
      }
    }
  }
  return [...tokenByName.entries()]
    .sort((left, right) => right[0].length - left[0].length);
}

function normalizeCustomNames(value, replacements) {
  let normalized = String(value);
  for (const [name, token] of replacements) {
    normalized = normalized.replaceAll(name, token);
    normalized = normalized.replaceAll(name.toLowerCase(), token);
  }
  return normalized;
}

function canonicalMechanicsProjection(settlement, replacements) {
  const projection = structuredClone(settlement);
  for (const key of NON_MECHANICAL_SETTLEMENT_SURFACES) delete projection[key];

  // Service category chooses a dossier grouping bucket. Flatten those buckets
  // before comparison while retaining whether each service materialized, its
  // provider, probability/forced state, and every non-presentation field.
  projection.availableServices = Object.values(
    projection.availableServices || {},
  )
    .flatMap(bucket => (Array.isArray(bucket) ? bucket : []))
    .sort((left, right) => {
      const leftName = typeof left === 'string' ? left : left?.name;
      const rightName = typeof right === 'string' ? right : right?.name;
      const normalizedLeft = normalizeCustomNames(
        leftName || '',
        replacements,
      );
      const normalizedRight = normalizeCustomNames(
        rightName || '',
        replacements,
      );
      if (normalizedLeft < normalizedRight) return -1;
      if (normalizedLeft > normalizedRight) return 1;
      return 0;
    });

  function visit(value) {
    if (typeof value === 'string') {
      return normalizeCustomNames(value, replacements);
    }
    if (Array.isArray(value)) {
      return value.map(child => (child === undefined ? null : visit(child)));
    }
    if (!value || typeof value !== 'object') return value;

    const record = value;
    const isCustom = record.custom === true
      || record.isCustom === true
      || record.source === 'custom'
      || typeof record.customDefinitionId === 'string';
    const identityMatch = typeof record.customDefinitionId === 'string'
      ? /^definition:([^:]+):/.exec(record.customDefinitionId)
      : null;
    const customCategory = record.customDefinitionCategory || identityMatch?.[1];
    const presentationKeys = PRESENTATION_KEYS_BY_CATEGORY.get(customCategory);
    const out = {};
    for (const [key, child] of Object.entries(record)) {
      // Match JSON's treatment of absent object members. Some canonical
      // simulation records deliberately retain optional keys with `undefined`
      // values; those keys cannot affect mechanics and are not accepted by the
      // content fingerprint serializer.
      if (child === undefined) continue;
      if (
        key.startsWith('customDefinition')
        || key === 'localUid'
        || (
          isCustom
          && (
            presentationKeys?.has(key)
            // Generated services retain the authored `description` under the
            // legacy dossier key `desc`; treat that one translation explicitly.
            || key === 'desc'
          )
        )
      ) continue;
      out[key] = visit(child);
    }
    return out;
  }

  return visit(projection);
}

function changedMechanicsPaths(left, right, path = '$', changes = []) {
  if (Object.is(left, right)) return changes;
  if (
    left == null
    || right == null
    || typeof left !== 'object'
    || typeof right !== 'object'
  ) {
    changes.push({ path, left, right });
    return changes;
  }
  if (Array.isArray(left) !== Array.isArray(right)) {
    changes.push({ path, left, right });
    return changes;
  }
  const keys = new Set([
    ...Object.keys(left),
    ...Object.keys(right),
  ]);
  for (const key of [...keys].sort()) {
    if (!Object.hasOwn(left, key) || !Object.hasOwn(right, key)) {
      changes.push({
        path: `${path}.${key}`,
        left: left[key],
        right: right[key],
      });
      continue;
    }
    changedMechanicsPaths(left[key], right[key], `${path}.${key}`, changes);
  }
  return changes;
}

const PRESENTATION_CASES = presentationCases();

describe('custom-content presentation-only claim neutrality', () => {
  it('discovers at least one presentation field in every authorable category', () => {
    const covered = new Set(
      PRESENTATION_CASES.map(({ bucket }) => bucket),
    );
    for (const bucket of CUSTOM_CONTENT_MANIFEST.authorableBuckets) {
      expect(covered.has(bucket), bucket).toBe(true);
    }
  });

  it.each(PRESENTATION_CASES)(
    '$key leaves the canonical mechanics digest unchanged',
    ({ key, bucket, field }) => {
      const controlPack = customContentReferencePack();
      const variantPack = variantFor({ bucket, field });
      const replacements = customNameTokens(controlPack, variantPack);
      const seed = `presentation-neutrality:${key}`;
      const control = generated(controlPack, seed);
      const variant = generated(variantPack, seed);
      const controlMechanics = canonicalMechanicsProjection(
        control,
        replacements,
      );
      const variantMechanics = canonicalMechanicsProjection(
        variant,
        replacements,
      );
      const changedPaths = changedMechanicsPaths(
        controlMechanics,
        variantMechanics,
      );

      expect(
        fingerprintContent(variantMechanics),
        `${key}; changed mechanics: ${[
          ...changedPaths.slice(0, 8),
          ...changedPaths.slice(-8),
        ]
          .map(change => (
            `${change.path}=${JSON.stringify(change.left)}`
            + `=>${JSON.stringify(change.right)}`
          ))
          .join(', ')}`,
      ).toBe(fingerprintContent(controlMechanics));
    },
  );

  it.each(NAME_AUTHORITY_MATRIX)(
    'keeps adversarial custom names mechanically inert at $label',
    ({ config, seed, label }) => {
      const { control, adversarial } = adversarialNameMatrixPacks();
      const replacements = customNameTokens(control, adversarial);
      const controlMechanics = canonicalMechanicsProjection(
        generated(control, seed, config),
        replacements,
      );
      const adversarialMechanics = canonicalMechanicsProjection(
        generated(adversarial, seed, config),
        replacements,
      );
      const changes = changedMechanicsPaths(
        controlMechanics,
        adversarialMechanics,
      );
      expect(
        fingerprintContent(adversarialMechanics),
        `${label}; changed mechanics: ${changes
          .slice(0, 16)
          .map(change => (
            `${change.path}=${JSON.stringify(change.left)}`
            + `=>${JSON.stringify(change.right)}`
          ))
          .join(', ')}`,
      ).toBe(fingerprintContent(controlMechanics));
    },
  );

  it('keeps exact criminal institution-name collisions out of safety', () => {
    const config = {
      priorityMilitary: 5,
      priorityCriminal: 5,
      monsterThreat: 'civilized',
    };
    const control = withFixedRandom(0.01, () => generateSafetyProfile(
      config,
      'thorp',
      [customInstitution('Quiet Hall')],
    ));
    const adversarial = withFixedRandom(0.01, () => generateSafetyProfile(
      config,
      'thorp',
      [customInstitution("Thieves' Guild Chapter")],
    ));

    expect(adversarial).toEqual(control);
  });

  it('keeps custom institution names and categories out of prosperity', () => {
    const config = {
      tier: 'village',
      tradeRouteAccess: 'road',
      priorityEconomy: 35,
      priorityMagic: 0,
      monsterThreat: 'civilized',
    };
    const observe = institution => withFixedRandom(0.01, () => (
      computeBaseProsperity(
        'village',
        'road',
        [institution],
        config,
        [],
        [],
      )
    ));
    const control = observe(customInstitution('Quiet Hall'));

    expect(observe(customInstitution('State Granary'))).toEqual(control);
    expect(observe(customInstitution('Quiet Hall', 'Economy'))).toEqual(control);
  });

  it.each(['magical_node', 'ancient_grove'])(
    'keeps exact custom resource key %s out of native magic scoring',
    (resourceKey) => {
      const config = {
        priorityMagic: 50,
        nearbyResources: [resourceKey],
        nearbyResourcesCustom: [resourceKey],
      };
      expect(computeEffectiveMagicPresence([], config)).toEqual(
        computeEffectiveMagicPresence([], {
          ...config,
          nearbyResources: [],
          nearbyResourcesCustom: [],
        }),
      );
    },
  );

  it.each([
    ['iron_deposits', 'exact-resource-iron_deposits-0'],
    ['magical_node', 'exact-resource-magical_node-2'],
    ['deep_harbour', 'exact-resource-deep_harbour-11'],
  ])(
    'keeps exact custom resource name %s out of native institution assembly',
    (resourceName, seed) => {
      const control = generated(
        referencePackWithName('resources', 'Quiet Custom Resource'),
        seed,
        EXACT_NATIVE_COLLISION_CONFIG,
      );
      const adversarial = generated(
        referencePackWithName('resources', resourceName),
        seed,
        EXACT_NATIVE_COLLISION_CONFIG,
      );

      expect(nativeInstitutionNames(adversarial))
        .toEqual(nativeInstitutionNames(control));
    },
  );

  it.each(['grain_fields', 'magical_node'])(
    'retains exact custom resource identity when %s already occupies the flat roster',
    (resourceName) => {
      const seed = `exact-resource-materialization:${resourceName}`;
      const control = generated(
        referencePackWithName('resources', 'Quiet Custom Resource'),
        seed,
        {
          ...EXACT_NATIVE_COLLISION_CONFIG,
          nearbyResources: [resourceName],
        },
      );
      const collision = generated(
        referencePackWithName('resources', resourceName),
        seed,
        {
          ...EXACT_NATIVE_COLLISION_CONFIG,
          nearbyResources: [resourceName],
        },
      );

      expect(
        collision.config.nearbyResources.filter(name => name === resourceName),
      ).toHaveLength(1);
      expect(collision.config.nearbyResourcesNative).toContain(resourceName);
      expect(collision.config.nearbyResourcesCustom).toContain(resourceName);
      // Source sidecars retain both identities behind one display row. The
      // custom rename cannot erase the selected native resource's mechanics.
      expect(nativeInstitutionNames(collision))
        .toEqual(nativeInstitutionNames(control));
    },
  );

  it('preserves rolled native mechanics through a custom name collision', () => {
    let seed = null;
    let control = null;
    for (let index = 0; index < 24; index += 1) {
      const candidateSeed = `collision-probe-${index}`;
      const candidate = generated(
        referencePackWithName('resources', 'Quiet Custom Resource'),
        candidateSeed,
        CONFIG,
      );
      if (!candidate.config.nearbyResourcesNative.includes('iron_deposits')) {
        continue;
      }
      seed = candidateSeed;
      control = candidate;
      break;
    }
    expect(
      seed,
      'bounded collision corpus must include a native iron roll',
    ).not.toBeNull();
    const collision = generated(
      referencePackWithName('resources', 'iron_deposits'),
      seed,
      CONFIG,
    );

    expect(control.config.nearbyResourcesNative).toContain('iron_deposits');
    expect(collision.config.nearbyResourcesNative).toContain('iron_deposits');
    expect(collision.config.nearbyResourcesCustom).toContain('iron_deposits');
    expect(nativeInstitutionNames(collision))
      .toEqual(nativeInstitutionNames(control));
    expect(collision.resourceAnalysis.resourceChains)
      .toEqual(control.resourceAnalysis.resourceChains);
    expect(collision.economicState.activeChains)
      .toEqual(control.economicState.activeChains);
  });

  it('does not grant native resource mechanics to a custom-only exact key', () => {
    const resourceName = 'grain_fields';
    const seed = 'custom-only-exact-resource';
    const customOnly = generated(
      referencePackWithName('resources', resourceName),
      seed,
      EXACT_NATIVE_COLLISION_CONFIG,
    );
    const absent = generated(
      referencePackWithName('resources', 'Quiet Custom Resource'),
      seed,
      EXACT_NATIVE_COLLISION_CONFIG,
    );

    expect(customOnly.config.nearbyResourcesNative).not.toContain(resourceName);
    expect(customOnly.config.nearbyResourcesCustom).toContain(resourceName);
    expect(nativeInstitutionNames(customOnly))
      .toEqual(nativeInstitutionNames(absent));
  });

  it('replays native-only exhaustion without deleting a custom namesake', () => {
    const resourceName = 'iron_deposits';
    const settlement = generated(
      referencePackWithName('resources', resourceName),
      'collision-probe-0',
      {
        ...CONFIG,
        resourceEdits: {
          added: [],
          removed: [],
          removedNative: [resourceName],
          depleted: [],
          recovered: [],
        },
      },
    );

    expect(settlement.config.nearbyResources).toContain(resourceName);
    expect(settlement.config.nearbyResourcesNative)
      .not.toContain(resourceName);
    expect(settlement.config.nearbyResourcesCustom).toContain(resourceName);
  });

  it('preserves native and reviewed-custom trade owners with the same label', () => {
    const config = {
      settType: 'town',
      culture: 'germanic',
      terrainOverride: 'plains',
      tradeRouteAccess: 'road',
      monsterThreat: 'civilized',
      // This contract needs a real native Baked goods owner. Terrain describes
      // production potential, not an export; provide the chain's native grain
      // input explicitly so the collision test cannot pass or fail with a
      // resource roll unrelated to label ownership.
      nearbyResourcesRandom: false,
      nearbyResources: ['grain_fields'],
    };
    const generateTradeCase = name => generateSettlementPipeline(
      config,
      null,
      {
        seed: 'trade-collision-0',
        customContent: reviewedReferencePackWithTradeGoodName(name),
      },
    );
    const control = generateTradeCase('Quiet Custom Good');
    const collision = generateTradeCase('Baked goods');

    expect(control.economicState.primaryExports).toEqual(
      expect.arrayContaining(['Baked goods', 'Weapons & armour']),
    );
    expect(control.economicState.primaryExports)
      .not.toContain('Quiet Custom Good');
    expect(control.economicState.customCategoryExports?.['Weapons & armour'])
      .toContain('Quiet Custom Good');
    expect(control.economicState.nativeTradeLabels?.exports)
      .not.toContain('Quiet Custom Good');
    expect(control.economicState.customTradeEndpoints?.exports)
      .toContainEqual(expect.objectContaining({
        label: 'Quiet Custom Good',
        customDefinitionId:
          'definition:tradeGoods:reference-aurora-field-rations',
      }));
    expect(control.economicState.customTradeEndpoints?.exports.some(
      endpoint => (
        endpoint.chainId === null
        && endpoint.customDefinitionId
          === 'definition:tradeGoods:reference-aurora-field-rations'
      ),
    )).toBe(true);

    expect(collision.economicState.primaryExports).toEqual(
      expect.arrayContaining(['Baked goods', 'Weapons & armour']),
    );
    expect(collision.economicState.customCategoryExports?.['Weapons & armour'])
      .toContain('Baked goods');
    expect(collision.economicState.nativeTradeLabels?.exports)
      .toContain('Baked goods');
    expect(collision.economicState.customTradeEndpoints?.exports)
      .toContainEqual(expect.objectContaining({
        label: 'Baked goods',
        refId: 'custom:reference-aurora-field-rations',
        customDefinitionCategory: 'tradeGoods',
        customDefinitionId:
          'definition:tradeGoods:reference-aurora-field-rations',
      }));
    expect(collision.economicState.customTradeLabels?.exports)
      .toContain('Weapons & armour');
    expect(collision.economicState.customTradeLabels?.exports)
      .not.toContain('Baked goods');
    expect(tradeLabelOwnership(
      collision.economicState,
      'exports',
      'Baked goods',
    )).toMatchObject({
      custom: true,
      native: true,
      mixed: true,
    });
  });

  it.each([
    ['Town granary', 'exact-duplicate-Town granary-0'],
    ['Market square', 'exact-duplicate-Market square-0'],
    ['Weekly market', 'exact-duplicate-Weekly market-0'],
  ])(
    'materializes custom institution identity beside native %s',
    (institutionName, seed) => {
      const settlement = generated(
        referencePackWithName('institutions', institutionName),
        seed,
        EXACT_NATIVE_COLLISION_CONFIG,
      );
      const matches = settlement.institutions.filter(
        institution => institution.name === institutionName,
      );

      expect(
        matches.filter(isMaterializedCustomContent),
      ).toEqual([
        expect.objectContaining({
          source: 'custom',
          localUid: 'reference-aurora-provisioners',
          customDefinitionId:
            'definition:institutions:reference-aurora-provisioners',
        }),
      ]);
      expect(
        matches.some(institution => !isMaterializedCustomContent(institution)),
      ).toBe(true);
    },
  );

  it.each([
    ['City walls and gates', 'exact-inst-City walls and gates-0'],
    ['Garrison', 'exact-inst-Garrison-0'],
    ["Mages' guild", "exact-inst-Mages' guild-3"],
  ])(
    'keeps exact custom institution name %s out of native upgrade collapse',
    (institutionName, seed) => {
      const control = generated(
        referencePackWithName('institutions', 'Quiet Custom Institution'),
        seed,
        EXACT_NATIVE_COLLISION_CONFIG,
      );
      const adversarial = generated(
        referencePackWithName('institutions', institutionName),
        seed,
        EXACT_NATIVE_COLLISION_CONFIG,
      );

      expect(nativeInstitutionNames(adversarial))
        .toEqual(nativeInstitutionNames(control));
    },
  );

  it('does not let a custom dock label reserve the native airship cascade', () => {
    const settlement = generated(
      referencePackWithName('institutions', 'Docks/port facilities'),
      'airship-trace-0',
      {
        ...CONFIG,
        settType: 'metropolis',
        terrainOverride: 'plains',
        tradeRouteAccess: 'road',
        priorityMagic: 95,
        magicExists: true,
        // The assertion concerns whether a custom namesake reserves the native
        // docks identity, not whether this seed happens to win the airship's
        // low-probability catalog roll. Establish the native cascade trigger
        // through the public force-toggle seam.
        _institutionToggles: {
          'metropolis::Exotic::Airship docking (high magic)': {
            allow: true,
            require: true,
          },
        },
      },
    );
    const docks = settlement.institutions.filter(
      institution => institution.name === 'Docks/port facilities',
    );

    expect(settlement.institutions).toContainEqual(
      expect.objectContaining({ name: 'Airship docking (high magic)' }),
    );
    expect(docks.some(isMaterializedCustomContent)).toBe(true);
    expect(docks).toContainEqual(expect.objectContaining({
      source: 'generated',
    }));
    expect(settlement.simulationTrace).toContainEqual(
      expect.objectContaining({
        targetId: 'institution.docks_port_facilities',
        step: 'cascadePass',
        result: 'airship_triggered',
      }),
    );
  });

  it('keeps a custom display name from reserving a faction-boost identity', () => {
    const boosts = [{
      factionCategory: 'economy',
      factionName: 'Merchant Compact',
      power: 40,
      catalogCategories: ['Economy', 'Crafts'],
      strength: 'strong',
    }];
    const observe = institutionName => withFixedRandom(0, () => (
      applyFactionInstitutionBoosts(
        boosts,
        [customInstitution(institutionName)],
        'town',
        { settType: 'town', tradeRouteAccess: 'road' },
      ).map(institution => institution.name)
    ));

    expect(observe('Town granary')).toEqual(observe('Quiet Hall'));
  });

  it('keeps custom institution names and tags out of native resource chains', () => {
    const analyze = institution => generateResourceAnalysis(
      'plains',
      ['grain'],
      [],
      [institution],
      {},
    );
    const control = analyze({
      ...customInstitution('Quiet Hall'),
      tags: ['decorative'],
    });

    expect(analyze({
      ...customInstitution('Quiet Hall'),
      tags: ['food'],
    })).toEqual(control);
    expect(analyze({
      ...customInstitution('Mill'),
      tags: ['decorative'],
    })).toEqual(control);
  });

  it('keeps custom institution labels out of native export prerequisites', () => {
    const observe = institution => withFixedRandom(0, () => (
      generateTradeIncomeStreams(
        'village',
        [institution],
        'road',
        {},
        { nearbyResources: [] },
      ).exports
    ));
    const control = observe(customInstitution('Quiet Hall'));
    const adversarial = observe(customInstitution('Mill'));
    const native = observe({ name: 'Mill', source: 'generated' });

    expect(adversarial).toEqual(control);
    expect(adversarial).not.toContain('Milled flour');
    expect(native).toContain('Milled flour');
  });
});
