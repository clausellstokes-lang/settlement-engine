/**
 * contentSamplePreview.js — deterministic, save-free custom-content taste gate.
 *
 * The preview compares two settlements forged from the same seed and config:
 * one with the current content environment, one with the reviewed candidates
 * added. Previewable generation families are marked mandatory in the candidate
 * snapshot so the taste gate can usually expose them on the first run. Tier,
 * provider, and dependency gates still retain final authority. The override
 * exists only in the ephemeral snapshot and its actual materialization result
 * is disclosed in the receipt; authored definitions are never rewritten.
 *
 * The module does not import the settlement engine. A worker (or a headless
 * test) injects the canonical generator, preserving the app's lazy boundary.
 */

import {
  contentSampleDefinitionMaterialization,
  contentSampleDefinitionsFromSnapshot,
  forgeContentSampleCategoryFixtures,
} from './contentSampleCategoryFixtures.js';

const PREVIEWABLE_BUCKETS = new Set(['institutions', 'resources', 'services']);
const MAX_BUCKET_ITEMS = 200;

export const DEFAULT_CONTENT_PREVIEW_CONFIG = Object.freeze({
  settType: 'town',
  culture: 'germanic',
  terrainOverride: 'plains',
  tradeRouteAccess: 'road',
  monsterThreat: 'civilized',
  priorityEconomy: 55,
  priorityMilitary: 40,
  priorityMagic: 35,
  priorityReligion: 40,
  priorityCriminal: 30,
  magicExists: true,
});

/**
 * @typedef {Record<string, unknown>} ContentRecord
 * @typedef {Record<string, Array<ContentRecord>>} ContentSnapshot
 * @typedef {{
 *   bucket:string,
 *   localUid:string,
 *   name:string,
 *   reason:string,
 *   materialized?:boolean,
 *   materializationState?:'materialized'|'absent'|'ambiguous',
 * }}
 *   PreviewDisposition
 * @typedef {{
 *   name:string,
 *   localUid:string|null,
 *   serviceType?:string,
 *   institution?:string|null,
 * }} SampleEntity
 * @typedef {{
 *   name:string|null,
 *   tier:string|null,
 *   population:number|null,
 *   prosperity:string|null,
 *   foodStatus:string|null,
 *   exports:string[],
 *   imports:string[],
 *   institutions:SampleEntity[],
 *   resources:SampleEntity[],
 *   services:SampleEntity[],
 * }} ContentSampleProjection
 * @typedef {(config:ContentRecord, neighbour:null, options:ContentRecord) =>
 *   unknown} SettlementGenerator
 */

/**
 * @param {unknown} value
 * @returns {ContentRecord}
 */
function plainRecord(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {ContentRecord} */ (value)
    : {};
}

/**
 * @param {unknown} value
 * @returns {Record<string, Array<Record<string, unknown>>>}
 */
function copyContent(value) {
  const source = plainRecord(value);
  /** @type {Record<string, Array<Record<string, unknown>>>} */
  const out = {};
  for (const [bucket, items] of Object.entries(source)) {
    if (!Array.isArray(items)) continue;
    out[bucket] = items
      .filter((entry) => entry && typeof entry === 'object' && !Array.isArray(entry))
      .slice(0, MAX_BUCKET_ITEMS)
      .map((entry) => ({ ...entry }));
  }
  return out;
}

/**
 * @param {ContentRecord} entry
 * @param {string} bucket
 * @param {number} index
 */
function previewIdentity(entry, bucket, index) {
  const current = typeof entry.localUid === 'string' && entry.localUid
    ? entry.localUid
    : null;
  return current || `preview_${bucket}_${index}`;
}

/**
 * @param {string} bucket
 * @param {unknown} rawEntry
 * @param {number} index
 * @returns {ContentRecord}
 */
function forcedPreviewEntry(bucket, rawEntry, index) {
  const entry = /** @type {ContentRecord} */ ({
    ...plainRecord(rawEntry),
    localUid: previewIdentity(plainRecord(rawEntry), bucket, index),
    isCustom: true,
  });
  if (PREVIEWABLE_BUCKETS.has(bucket)) {
    entry.essential = true;
    if (bucket === 'resources' || bucket === 'services') {
      entry.criticality = 'critical';
    }
  }
  return entry;
}

/**
 * Add reviewed entries to an ephemeral custom-content snapshot.
 * @param {unknown} baseContent
 * @param {unknown} accepted
 */
export function buildContentPreviewSnapshot(baseContent, accepted) {
  const snapshot = copyContent(baseContent);
  /** @type {PreviewDisposition[]} */
  const forced = [];
  /** @type {PreviewDisposition[]} */
  const dormant = [];

  (Array.isArray(accepted) ? accepted : []).forEach((candidate, index) => {
    const candidateRecord = plainRecord(candidate);
    const bucket = typeof candidateRecord.bucket === 'string'
      ? candidateRecord.bucket
      : '';
    const entry = plainRecord(candidateRecord.entry);
    if (!bucket || !entry.name) return;
    const prepared = forcedPreviewEntry(bucket, entry, index);
    if (!Array.isArray(snapshot[bucket])) snapshot[bucket] = [];
    const existingIndex = prepared.localUid
      ? snapshot[bucket].findIndex((current) => current?.localUid === prepared.localUid)
      : -1;
    if (existingIndex >= 0) snapshot[bucket][existingIndex] = prepared;
    else snapshot[bucket].push(prepared);
    if (PREVIEWABLE_BUCKETS.has(bucket)) {
      forced.push({
        bucket,
        localUid: String(prepared.localUid || ''),
        name: String(prepared.name),
        reason: 'Marked mandatory in this unsaved sample; tier, provider, and dependency gates still apply.',
      });
    } else {
      dormant.push({
        bucket,
        localUid: String(prepared.localUid || ''),
        name: String(prepared.name),
        reason: 'Dormant in ordinary generation; exercised below only when a truthful category fixture exists.',
      });
    }
  });

  return { snapshot, forced, dormant };
}

/**
 * @param {unknown} settlement
 * @returns {SampleEntity[]}
 */
function customInstitutions(settlement) {
  const root = plainRecord(settlement);
  return (Array.isArray(root.institutions) ? root.institutions : [])
    .map(plainRecord)
    .filter((entry) => entry.source === 'custom' || entry.isCustom === true)
    .map((entry) => ({
      name: String(entry.name || ''),
      localUid: typeof entry.localUid === 'string' ? entry.localUid : null,
    }))
    .filter((entry) => entry.name);
}

/**
 * @param {unknown} settlement
 * @returns {SampleEntity[]}
 */
function customResources(settlement) {
  const root = plainRecord(settlement);
  const config = plainRecord(root.config);
  const custom = Array.isArray(config.nearbyResourceDefinitions)
    ? config.nearbyResourceDefinitions
    : Array.isArray(config.nearbyResourcesCustom)
      ? config.nearbyResourcesCustom
      : [];
  return custom.map((entry) => (
    typeof entry === 'string'
      ? { name: entry, localUid: null }
      : (() => {
          const record = plainRecord(entry);
          return {
            name: String(record.name || ''),
            localUid: typeof record.localUid === 'string'
              ? record.localUid
              : null,
          };
        })()
  )).filter((entry) => entry.name);
}

/**
 * @param {unknown} settlement
 * @returns {SampleEntity[]}
 */
function customServices(settlement) {
  const root = plainRecord(settlement);
  const services = plainRecord(root.availableServices);
  /** @type {SampleEntity[]} */
  const out = [];
  for (const [serviceType, entries] of Object.entries(services)) {
    if (!Array.isArray(entries)) continue;
    for (const rawEntry of entries) {
      const entry = plainRecord(rawEntry);
      if (entry.custom !== true) continue;
      out.push({
        name: String(entry.name || ''),
        localUid: typeof entry.localUid === 'string' ? entry.localUid : null,
        serviceType,
        institution: typeof entry.institution === 'string' ? entry.institution : null,
      });
    }
  }
  return out.filter((entry) => entry.name);
}

/**
 * @param {unknown} value
 * @returns {string[]}
 */
function stringList(value) {
  return Array.isArray(value)
    ? value.filter((entry) => typeof entry === 'string')
    : [];
}

/**
 * A deliberately small read model for the before/after sample. It contains
 * facts users can inspect and compare, not a prose claim about causality.
 */
/**
 * @param {unknown} settlement
 * @returns {ContentSampleProjection}
 */
export function projectContentSampleSettlement(settlement) {
  const root = plainRecord(settlement);
  const economy = plainRecord(root.economicState);
  const food = plainRecord(economy.foodSecurity);
  return {
    name: typeof root.name === 'string' ? root.name : null,
    tier: typeof root.tier === 'string' ? root.tier : null,
    population: typeof root.population === 'number'
      && Number.isFinite(root.population)
      ? root.population
      : null,
    prosperity: typeof economy.prosperity === 'string' ? economy.prosperity : null,
    // `foodStatus` is the preview's compact display name for the canonical
    // generator label. Do not fall back to old root-level food projections:
    // doing so can make the taste gate disagree with the food ledger and every
    // downstream consumer of economicState.foodSecurity.
    foodStatus: typeof food.label === 'string' ? food.label : null,
    exports: stringList(economy.primaryExports),
    imports: stringList(economy.primaryImports),
    institutions: customInstitutions(settlement),
    resources: customResources(settlement),
    services: customServices(settlement),
  };
}

/**
 * @param {ContentSampleProjection} before
 * @param {ContentSampleProjection} after
 */
function scalarChanges(before, after) {
  /** @type {Array<{field:string, before:unknown, after:unknown}>} */
  const changes = [];
  /** @type {Array<'tier'|'population'|'prosperity'|'foodStatus'>} */
  const keys = ['tier', 'population', 'prosperity', 'foodStatus'];
  for (const key of keys) {
    if (before[key] !== after[key]) {
      changes.push({ field: key, before: before[key], after: after[key] });
    }
  }
  return changes;
}

/** @param {string[]} before @param {string[]} after */
function addedStrings(before, after) {
  const prior = new Set(before);
  return after.filter((entry) => !prior.has(entry));
}

/** @param {SampleEntity[]} before @param {SampleEntity[]} after */
function addedEntities(before, after) {
  const prior = new Set(before.map((entry) => entry.localUid || entry.name));
  return after.filter((entry) => !prior.has(entry.localUid || entry.name));
}

/**
 * @param {ContentSampleProjection} before
 * @param {ContentSampleProjection} after
 */
export function compareContentSampleProjections(before, after) {
  return {
    scalarChanges: scalarChanges(before, after),
    addedExports: addedStrings(before.exports, after.exports),
    addedImports: addedStrings(before.imports, after.imports),
    materialized: {
      institutions: addedEntities(before.institutions, after.institutions),
      resources: addedEntities(before.resources, after.resources),
      services: addedEntities(before.services, after.services),
    },
  };
}

/**
 * Attach the result of canonical generation to each preview override. Setting
 * `essential`/`criticality` bypasses only the optional selection roll; it must
 * never be described as overriding a tier or dependency gate.
 *
 * @param {PreviewDisposition[]} dispositions
 * @param {ContentSampleProjection} projection
 * @param {Array<{bucket?:string,localUid?:string,name?:string}>} peers
 * @returns {PreviewDisposition[]}
 */
function resolvePreviewDispositions(dispositions, projection, peers) {
  /** @type {Record<string, SampleEntity[]>} */
  const entitiesByBucket = {
    institutions: projection.institutions,
    resources: projection.resources,
    services: projection.services,
  };
  return dispositions.map((disposition) => {
    const entities = entitiesByBucket[disposition.bucket] || [];
    const materialization = contentSampleDefinitionMaterialization(
      disposition,
      entities,
      peers,
    );
    const materialized = materialization.materialized;
    return {
      ...disposition,
      materialized,
      materializationState: materialization.state,
      reason: materialized
        ? 'Marked mandatory and materialized in this unsaved summary sample.'
        : materialization.state === 'ambiguous'
          ? 'A same-name entity materialized, but this name-only surface cannot prove which reviewed definition produced it.'
          : 'Marked mandatory, but canonical tier, provider, or dependency gates kept it out of this summary sample.',
    };
  });
}

/**
 * Execute the paired preview with an injected canonical generator.
 *
 * @param {{
 *   seed?:string,
 *   config?:object,
 *   baseContent?:Record<string, Array<object>>,
 *   accepted?:Array<{bucket:string, entry:object}>,
 * }} request
 * @param {SettlementGenerator} generateSettlement
 */
export function forgeContentSample(request, generateSettlement) {
  if (typeof generateSettlement !== 'function') {
    throw new TypeError('forgeContentSample requires the canonical settlement generator');
  }
  const seed = typeof request?.seed === 'string' && request.seed
    ? request.seed
    : 'custom-content-taste-gate-v1';
  const config = {
    ...DEFAULT_CONTENT_PREVIEW_CONFIG,
    ...plainRecord(request?.config),
  };
  const baselineContent = copyContent(request?.baseContent);
  const { snapshot, forced, dormant } = buildContentPreviewSnapshot(
    baselineContent,
    request?.accepted,
  );

  const baseline = generateSettlement(
    { ...config },
    null,
    { seed, customContent: baselineContent },
  );
  const candidate = generateSettlement(
    { ...config },
    null,
    { seed, customContent: snapshot },
  );
  const before = projectContentSampleSettlement(baseline);
  const after = projectContentSampleSettlement(candidate);
  const fixtures = forgeContentSampleCategoryFixtures({
    seed,
    config,
    baselineContent,
    snapshot,
    accepted: request?.accepted,
    eventSettlement: candidate,
    generateSettlement,
    projectSettlement: projectContentSampleSettlement,
    compareProjections: (fixtureBefore, fixtureAfter) => (
      compareContentSampleProjections(
        /** @type {ContentSampleProjection} */ (fixtureBefore),
        /** @type {ContentSampleProjection} */ (fixtureAfter),
      )
    ),
  });

  return {
    schemaVersion: 2,
    seed,
    config,
    saved: false,
    baseline: before,
    candidate: after,
    diff: compareContentSampleProjections(before, after),
    forced: resolvePreviewDispositions(
      forced,
      after,
      contentSampleDefinitionsFromSnapshot(snapshot),
    ),
    dormant,
    fixtures,
  };
}

/**
 * Compare two complete, already-resolved content runtimes with one seed.
 *
 * Unlike the authoring taste gate above, this path does not force candidates
 * present or mutate either content snapshot. It is used when a campaign owner
 * reviews an environment migration: the before and after settlements are
 * ordinary canonical generations whose only varying input is the reviewed
 * runtime (definitions and bounded tunables).
 */
/**
 * @param {{
 *   seed?:string,
 *   config?:unknown,
 *   beforeRuntime?:unknown,
 *   afterRuntime?:unknown,
 *   explicitConfigFields?:unknown,
 * } | null | undefined} request
 * @param {SettlementGenerator} generateSettlement
 */
export function forgeContentRuntimeComparison(request, generateSettlement) {
  if (typeof generateSettlement !== 'function') {
    throw new TypeError(
      'forgeContentRuntimeComparison requires the canonical settlement generator',
    );
  }
  const seed = typeof request?.seed === 'string' && request.seed
    ? request.seed
    : 'campaign-content-migration-preview-v1';
  const baseConfig = {
    ...DEFAULT_CONTENT_PREVIEW_CONFIG,
    ...plainRecord(request?.config),
  };
  const beforeRuntime = plainRecord(request?.beforeRuntime);
  const afterRuntime = plainRecord(request?.afterRuntime);
  const beforeContent = copyContent(beforeRuntime.customContent);
  const afterContent = copyContent(afterRuntime.customContent);
  const beforeSettlement = generateSettlement(
    { ...baseConfig },
    null,
    {
      seed,
      customContent: beforeContent,
      contentTunables: plainRecord(beforeRuntime.tunables),
      explicitConfigFields: plainRecord(request?.explicitConfigFields),
    },
  );
  const afterSettlement = generateSettlement(
    { ...baseConfig },
    null,
    {
      seed,
      customContent: afterContent,
      contentTunables: plainRecord(afterRuntime.tunables),
      explicitConfigFields: plainRecord(request?.explicitConfigFields),
    },
  );
  const before = projectContentSampleSettlement(beforeSettlement);
  const after = projectContentSampleSettlement(afterSettlement);

  return {
    schemaVersion: 1,
    seed,
    sameSeed: true,
    saved: false,
    config: baseConfig,
    before,
    after,
    diff: compareContentSampleProjections(before, after),
    removed: compareContentSampleProjections(after, before),
  };
}
