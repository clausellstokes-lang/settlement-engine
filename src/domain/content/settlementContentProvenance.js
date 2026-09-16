/**
 * Exact custom-content provenance retained on generated settlements.
 *
 * The editable library is not a valid historical source: definitions can move,
 * be archived, or be replaced by a later pack version. This receipt therefore
 * records only immutable definition tuples that were actually materialized in
 * the settlement, plus the exact environment that governed the run.
 *
 * Current materialized entities carry exact definition identity. Name matching
 * is confined to legacy output containers that already declare their values
 * custom; ambiguous duplicate names are omitted instead of being promoted
 * into false exact provenance.
 */

import { compareCodepoint } from '../deterministicSort.js';
import { fingerprintContent } from './contentFingerprint.js';

export const SETTLEMENT_CONTENT_PROVENANCE_SCHEMA_VERSION = 1;

const SHA256_RE = /^[0-9a-f]{64}$/;
const RECEIPT_KEYS = new Set([
  'schemaVersion',
  'scope',
  'environment',
  'bindingHash',
  'materializedDefinitions',
  'receiptHash',
]);
const ENVIRONMENT_REFERENCE_KEYS = new Set([
  'environmentId',
  'environmentRevisionId',
  'environmentHash',
  'source',
]);
const MATERIALIZED_DEFINITION_KEYS = new Set([
  'category',
  'definitionId',
  'revisionId',
  'contentHash',
  'localUid',
  'name',
  'surfaces',
]);
const MATERIALIZED_CATEGORIES = Object.freeze([
  'deities',
  'factions',
  'institutions',
  'resources',
  'services',
  'stressors',
  'supplyChains',
  'tradeGoods',
  'traditions',
]);

/**
 * @typedef {{
 *   category:string,
 *   surface:string,
 *   name:string,
 *   definitionId:string,
 * }} MaterializedCandidate
 * @typedef {{
 *   category:string,
 *   definitionId:string,
 *   revisionId:string,
 *   contentHash:string,
 *   localUid:string|null,
 *   name:string|null,
 * }} ExactContentDefinition
 * @typedef {{
 *   environmentId:string,
 *   environmentRevisionId:string,
 *   environmentHash:string,
 *   source:string|null,
 * }} SettlementContentEnvironmentReference
 * @typedef {{
 *   category:string,
 *   definitionId:string,
 *   revisionId:string,
 *   contentHash:string,
 *   localUid:string|null,
 *   name:string|null,
 *   surfaces:ReadonlyArray<string>,
 * }} MaterializedContentDefinition
 * @typedef {{
 *   schemaVersion:number,
 *   scope:'campaign'|'standalone',
 *   environment:SettlementContentEnvironmentReference|null,
 *   bindingHash:string|null,
 *   materializedDefinitions:ReadonlyArray<MaterializedContentDefinition>,
 *   receiptHash:string,
 * }} SettlementContentProvenance
 */

/** @param {unknown} value @returns {Record<string, unknown>} */
function record(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/** @param {Record<string, unknown>} value @param {Set<string>} keys */
function hasExactKeys(value, keys) {
  const actual = Object.keys(value);
  return actual.length === keys.size && actual.every(key => keys.has(key));
}

/** @param {unknown} value @returns {string} */
function normalizedName(value) {
  return text(value).toLowerCase();
}

/** @param {unknown} value @returns {unknown[]} */
function array(value) {
  return Array.isArray(value) ? value : [];
}

/** @param {unknown} settlement @returns {unknown[]} */
function stressorsOf(settlement) {
  const source = record(settlement);
  const value = source.stressors ?? source.stress;
  return value == null ? [] : (Array.isArray(value) ? value : [value]);
}

/** @param {unknown} value @returns {string[]} */
function stringValues(value) {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(stringValues);
  if (!value || typeof value !== 'object') return [];
  return Object.values(record(value)).flatMap(stringValues);
}

/** @param {unknown} value @returns {boolean} */
function customObject(value) {
  const item = record(value);
  return Boolean(
    Object.keys(item).length > 0
    && (
      item.custom === true
      || item.isCustom === true
      || item.source === 'custom'
      || text(item.customDefinitionId)
      || text(item.definitionId)
    )
  );
}

/** @param {unknown} settlement @returns {MaterializedCandidate[]} */
function materializedCandidates(settlement) {
  const value = record(settlement);
  const config = record(value.config);
  const economy = record(value.economicState);
  /** @type {MaterializedCandidate[]} */
  const candidates = [];
  /**
   * @param {string} category
   * @param {string} surface
   * @param {unknown} entries
   * @param {{containerIsCustom?:boolean, useProjectedCategory?:boolean}} [options]
   */
  const add = (category, surface, entries, options = {}) => {
    for (const entry of array(entries)) {
      if (!options.containerIsCustom && !customObject(entry)) continue;
      const item = typeof entry === 'string' ? { name: entry } : record(entry);
      const projectedCategory = text(item.customDefinitionCategory);
      candidates.push({
        category: options.useProjectedCategory
          && MATERIALIZED_CATEGORIES.includes(projectedCategory)
          ? projectedCategory
          : category,
        surface,
        name: text(item.name ?? item.label ?? entry),
        definitionId: text(
          item.customDefinitionId
          ?? item.definitionId
          ?? record(item.contentRevision).definitionId,
        ),
      });
    }
  };

  add('institutions', 'institutions', value.institutions);
  const exactResourceDefinitions = array(
    config.nearbyResourceDefinitions
      ?? value.nearbyResourceDefinitions,
  );
  if (exactResourceDefinitions.length > 0) {
    add(
      'resources',
      'config.nearbyResourceDefinitions',
      exactResourceDefinitions,
      { containerIsCustom: true },
    );
  } else {
    add(
      'resources',
      'config.nearbyResourcesCustom',
      config.nearbyResourcesCustom ?? value.nearbyResourcesCustom,
      { containerIsCustom: true },
    );
  }
  for (const [bucket, services] of Object.entries(record(value.availableServices))) {
    add('services', `availableServices.${bucket}`, services, {
      useProjectedCategory: true,
    });
  }
  add('stressors', 'stressors', stressorsOf(value));
  add('traditions', 'traditions', value.traditions);
  add('factions', 'factions', [
    ...array(value.factions),
    ...array(record(value.powerStructure).factions),
  ]);
  add('deities', 'config.primaryDeitySnapshot', [
    config.primaryDeitySnapshot,
    ...array(config.cultDeitySnapshots),
  ].filter(Boolean));

  // Active custom endpoints retain exact definition identity even when their
  // display label is shared with a native good. Read that identity-bearing
  // sidecar before the legacy label projection below.
  add(
    'tradeGoods',
    'economicState.customTradeEndpoints',
    Object.values(record(economy.customTradeEndpoints)).flatMap(array),
    { useProjectedCategory: true },
  );
  const tradeLabels = [
    ...stringValues(economy.customTradeLabels),
    ...stringValues(economy.customCategoryExports),
    ...stringValues(economy.customCategoryImports),
  ];
  add(
    'tradeGoods',
    'economicState.customTradeLabels',
    tradeLabels,
    { containerIsCustom: true },
  );
  add(
    'supplyChains',
    'economicState.confirmedCustomSupplyChains',
    economy.confirmedCustomSupplyChains,
    { containerIsCustom: true },
  );

  return candidates;
}

/**
 * @param {string} category
 * @param {unknown} value
 * @returns {ExactContentDefinition|null}
 */
function exactDefinition(category, value) {
  const item = record(value);
  const definitionId = text(item.definitionId ?? item.id);
  const revisionId = text(item.revisionId);
  const contentHash = text(item.contentHash);
  if (!definitionId || !revisionId || !SHA256_RE.test(contentHash)) return null;
  return {
    category,
    definitionId,
    revisionId,
    contentHash,
    localUid: text(item.localUid) || null,
    name: text(item.name) || null,
  };
}

/**
 * @param {unknown} customContent
 * @returns {{
 *   byId:Map<string, ExactContentDefinition>,
 *   byCategoryName:Map<string, ExactContentDefinition[]>,
 * }}
 */
function definitionIndexes(customContent) {
  const content = record(customContent);
  /** @type {Map<string, ExactContentDefinition>} */
  const byId = new Map();
  /** @type {Map<string, ExactContentDefinition[]>} */
  const byCategoryName = new Map();
  for (const category of MATERIALIZED_CATEGORIES) {
    for (const value of array(content[category])) {
      const definition = exactDefinition(category, value);
      if (!definition) continue;
      byId.set(definition.definitionId, definition);
      const key = `${category}\u0000${normalizedName(definition.name)}`;
      const bucket = byCategoryName.get(key) || [];
      bucket.push(definition);
      byCategoryName.set(key, bucket);
    }
  }
  return { byId, byCategoryName };
}

/**
 * @param {unknown} settlement
 * @param {unknown} customContent
 */
function materializedDefinitions(settlement, customContent) {
  const { byId, byCategoryName } = definitionIndexes(customContent);
  /** @type {Map<string, Set<string>>} */
  const surfacesByDefinition = new Map();
  /** @type {Map<string, ExactContentDefinition>} */
  const definitionsById = new Map();

  for (const candidate of materializedCandidates(settlement)) {
    let definition = candidate.definitionId
      ? byId.get(candidate.definitionId)
      : null;
    if (!definition && candidate.name) {
      const key = `${candidate.category}\u0000${normalizedName(candidate.name)}`;
      const matches = byCategoryName.get(key) || [];
      if (matches.length === 1) [definition] = matches;
    }
    if (!definition || definition.category !== candidate.category) continue;
    definitionsById.set(definition.definitionId, definition);
    const surfaces = surfacesByDefinition.get(definition.definitionId) || new Set();
    surfaces.add(candidate.surface);
    surfacesByDefinition.set(definition.definitionId, surfaces);
  }

  return [...definitionsById.values()]
    .sort((left, right) => (
      compareCodepoint(left.definitionId, right.definitionId)
      || compareCodepoint(left.category, right.category)
    ))
    .map(definition => Object.freeze({
      ...definition,
      surfaces: Object.freeze(
        [...(surfacesByDefinition.get(definition.definitionId) || [])]
          .sort(compareCodepoint),
      ),
    }));
}

/** @param {unknown} context */
function environmentReference(context) {
  const environment = record(record(context).environment);
  if (
    !text(environment.environmentId)
    || !text(environment.environmentRevisionId)
    || !SHA256_RE.test(text(environment.environmentHash))
  ) {
    return null;
  }
  return Object.freeze({
    environmentId: text(environment.environmentId),
    environmentRevisionId: text(environment.environmentRevisionId),
    environmentHash: text(environment.environmentHash),
    source: text(environment.source) || null,
  });
}

/**
 * Build a tamper-evident receipt, or `null` when the run had no reviewed
 * environment and materialized no exactly versioned custom definition.
 *
 * @param {unknown} settlement
 * @param {unknown} [customContent]
 * @param {unknown} [context]
 */
export function buildSettlementContentProvenance(
  settlement,
  customContent = {},
  context = {},
) {
  const contextRecord = record(context);
  const environment = environmentReference(context);
  const definitions = materializedDefinitions(settlement, customContent);
  const bindingHash = SHA256_RE.test(text(contextRecord.bindingHash))
    ? text(contextRecord.bindingHash)
    : null;
  if (!environment && !bindingHash && definitions.length === 0) return null;

  const core = {
    schemaVersion: SETTLEMENT_CONTENT_PROVENANCE_SCHEMA_VERSION,
    scope: contextRecord.scope === 'campaign' ? 'campaign' : 'standalone',
    environment,
    bindingHash,
    materializedDefinitions: definitions,
  };
  return Object.freeze({
    ...core,
    materializedDefinitions: Object.freeze(definitions),
    receiptHash: fingerprintContent(core),
  });
}

/**
 * Admit a persisted provenance receipt at trust boundaries.
 *
 * The receipt is deliberately narrower than a full content environment. It is
 * a tamper-evident usage fact, so every key, identity, hash, and materialized
 * surface is checked before callers may treat it as an exact join.
 *
 * @param {unknown} value
 * @returns {{ok:true, provenance:Readonly<SettlementContentProvenance>}
 *   | {ok:false, reason:string, message:string}}
 */
export function admitSettlementContentProvenance(value) {
  try {
    const source = record(value);
    if (
      !hasExactKeys(source, RECEIPT_KEYS)
      || source.schemaVersion !== SETTLEMENT_CONTENT_PROVENANCE_SCHEMA_VERSION
      || !['campaign', 'standalone'].includes(String(source.scope))
      || !Array.isArray(source.materializedDefinitions)
      || source.materializedDefinitions.length > 2_000
    ) {
      throw new TypeError('Settlement content provenance has an invalid shape.');
    }

    let environment = null;
    if (source.environment != null) {
      const environmentRecord = record(source.environment);
      if (
        !hasExactKeys(environmentRecord, ENVIRONMENT_REFERENCE_KEYS)
        || !text(environmentRecord.environmentId)
        || !text(environmentRecord.environmentRevisionId)
        || !SHA256_RE.test(text(environmentRecord.environmentHash))
        || (
          environmentRecord.source != null
          && !text(environmentRecord.source)
        )
      ) {
        throw new TypeError(
          'Settlement content provenance has an invalid environment reference.',
        );
      }
      environment = Object.freeze({
        environmentId: text(environmentRecord.environmentId),
        environmentRevisionId: text(
          environmentRecord.environmentRevisionId,
        ),
        environmentHash: text(environmentRecord.environmentHash),
        source: environmentRecord.source == null
          ? null
          : text(environmentRecord.source),
      });
    }

    const seenDefinitions = new Set();
    const definitions = source.materializedDefinitions.map((rawDefinition) => {
      const definition = record(rawDefinition);
      const category = text(definition.category);
      const definitionId = text(definition.definitionId);
      const revisionId = text(definition.revisionId);
      const contentHash = text(definition.contentHash);
      const localUid = definition.localUid == null
        ? null
        : text(definition.localUid);
      const name = definition.name == null ? null : text(definition.name);
      const surfaces = Array.isArray(definition.surfaces)
        ? definition.surfaces.map(text)
        : [];
      if (
        !hasExactKeys(definition, MATERIALIZED_DEFINITION_KEYS)
        || !MATERIALIZED_CATEGORIES.includes(category)
        || !definitionId
        || !revisionId
        || !SHA256_RE.test(contentHash)
        || (definition.localUid != null && !localUid)
        || (definition.name != null && !name)
        || surfaces.length === 0
        || surfaces.some(surface => !surface)
        || new Set(surfaces).size !== surfaces.length
        || seenDefinitions.has(definitionId)
      ) {
        throw new TypeError(
          'Settlement content provenance has an invalid definition reference.',
        );
      }
      seenDefinitions.add(definitionId);
      return Object.freeze({
        category,
        definitionId,
        revisionId,
        contentHash,
        localUid,
        name,
        surfaces: Object.freeze([...surfaces]),
      });
    });
    const bindingHash = source.bindingHash == null
      ? null
      : text(source.bindingHash);
    if (bindingHash != null && !SHA256_RE.test(bindingHash)) {
      throw new TypeError(
        'Settlement content provenance has an invalid campaign binding hash.',
      );
    }
    /** @type {'campaign'|'standalone'} */
    const scope = source.scope === 'campaign' ? 'campaign' : 'standalone';
    const core = {
      schemaVersion: SETTLEMENT_CONTENT_PROVENANCE_SCHEMA_VERSION,
      scope,
      environment,
      bindingHash,
      materializedDefinitions: definitions,
    };
    if (
      !SHA256_RE.test(text(source.receiptHash))
      || fingerprintContent(core) !== text(source.receiptHash)
    ) {
      throw new TypeError(
        'Settlement content provenance receipt hash does not match.',
      );
    }
    return {
      ok: true,
      provenance: Object.freeze({
        ...core,
        materializedDefinitions: Object.freeze(definitions),
        receiptHash: text(source.receiptHash),
      }),
    };
  } catch (error) {
    return {
      ok: false,
      reason: 'settlement_content_provenance_invalid',
      message: error instanceof Error
        ? error.message
        : 'Settlement content provenance is invalid.',
    };
  }
}
