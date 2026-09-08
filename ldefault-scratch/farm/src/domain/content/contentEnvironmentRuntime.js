/**
 * Resolve standalone content environments against an editable account library.
 *
 * Campaign simulation never uses this moving-library resolver; it consumes the
 * immutable binding projection in `campaignContentBinding.js`. Keeping the two
 * paths separate makes that constitutional distinction visible in the graph.
 */

import {
  isPlainContentRecord,
} from './contentFingerprint.js';
import {
  emptyRuntimeContent,
  legacyDefinitionEntry,
} from './contentEnvironmentLibrary.js';
import {
  admitContentEnvironmentRevision,
} from './contentEnvironmentRevision.js';
import {
  CONTENT_ENVIRONMENT_SCHEMA_VERSION,
  VANILLA_CONTENT_ENVIRONMENT,
  VANILLA_ENVIRONMENT_REVISION_ID,
} from './contentEnvironmentDefaults.js';
import {
  isReviewedDerivedContentCategory,
  PERSISTED_RUNTIME_CONTENT_CATEGORIES,
  reviewedSupplyChainRevisionEntry,
} from './reviewedSupplyChainPersistence.js';

/**
 * @typedef {Record<string, unknown>} ContentRecord
 * @typedef {{definitionId:string, revisionId:string, contentHash:string,
 *   category:string, data:ContentRecord}} LegacyDefinitionEntry
 */

/**
 * Resolve an immutable standalone environment against the editable account
 * library without following a moving head.
 *
 * Every selected definition must still exist at the exact reviewed
 * definition/revision/content tuple. One missing, advanced, malformed, or
 * duplicated head fails the extension projection closed to vanilla. A partial
 * environment would be a third, unreviewed ruleset.
 *
 * @param {unknown} environment
 * @param {unknown} [customContent]
 */
export function contentRuntimeFromEnvironment(
  environment,
  customContent = {},
) {
  const admitted = admitContentEnvironmentRevision(
    environment || VANILLA_CONTENT_ENVIRONMENT,
  );
  if (!admitted.ok) {
    return Object.freeze({
      schemaVersion: CONTENT_ENVIRONMENT_SCHEMA_VERSION,
      environment: VANILLA_CONTENT_ENVIRONMENT,
      customContent: emptyRuntimeContent(),
      tunables: VANILLA_CONTENT_ENVIRONMENT.tunables,
      visualSelection: VANILLA_CONTENT_ENVIRONMENT.visualSelection,
      resolution: Object.freeze({
        ok: false,
        mode: 'failed-closed',
        reason: admitted.reason || 'content_environment_invalid',
        failures: Object.freeze([]),
      }),
    });
  }

  const active = admitted.environment;
  if (active.environmentRevisionId === VANILLA_ENVIRONMENT_REVISION_ID) {
    return Object.freeze({
      schemaVersion: CONTENT_ENVIRONMENT_SCHEMA_VERSION,
      environment: active,
      customContent: emptyRuntimeContent(),
      tunables: active.tunables,
      visualSelection: active.visualSelection,
      resolution: Object.freeze({
        ok: true,
        mode: 'vanilla',
        reason: null,
        failures: Object.freeze([]),
      }),
    });
  }

  /** @type {Map<string, Array<LegacyDefinitionEntry & {
   *   item:ContentRecord,
   *   category:string,
   * }>>} */
  const byDefinitionId = new Map();
  const selectedDefinitionIds = new Set(
    active.directDefinitions.map(entry => entry.definitionId),
  );
  const library = isPlainContentRecord(customContent)
    ? /** @type {ContentRecord} */ (customContent)
    : {};
  for (const category of PERSISTED_RUNTIME_CONTENT_CATEGORIES) {
    const items = Array.isArray(library[category]) ? library[category] : [];
    for (const item of items) {
      const record = isPlainContentRecord(item)
        ? /** @type {ContentRecord} */ (item)
        : null;
      if (!record || record.archivedAt) continue;
      const declaredAddress = (
        record.definitionId
        || record.id
        || record.localUid
      );
      if (
        declaredAddress != null
        && !selectedDefinitionIds.has(String(declaredAddress))
      ) {
        continue;
      }
      let entry;
      try {
        entry = isReviewedDerivedContentCategory(category)
          ? reviewedSupplyChainRevisionEntry(item)
          : legacyDefinitionEntry(category, item);
      } catch {
        continue;
      }
      const candidates = byDefinitionId.get(entry.definitionId) || [];
      candidates.push({ ...entry, item: record, category });
      byDefinitionId.set(entry.definitionId, candidates);
    }
  }

  const grouped = /** @type {Record<string, Array<ContentRecord>>} */ (
    Object.fromEntries(
      PERSISTED_RUNTIME_CONTENT_CATEGORIES.map(category => [category, []]),
    )
  );
  /** @type {Array<{definitionId:string, reason:string}>} */
  const failures = [];
  for (const reference of active.directDefinitions) {
    const candidates = byDefinitionId.get(reference.definitionId) || [];
    if (candidates.length !== 1) {
      failures.push(Object.freeze({
        definitionId: reference.definitionId,
        reason: candidates.length === 0
          ? 'definition_unavailable'
          : 'definition_identity_ambiguous',
      }));
      continue;
    }
    const candidate = candidates[0];
    if (!candidate) continue;
    if (
      candidate.revisionId !== reference.revisionId
      || candidate.contentHash !== reference.contentHash
      || candidate.category !== reference.category
    ) {
      failures.push(Object.freeze({
        definitionId: reference.definitionId,
        reason: 'definition_revision_mismatch',
      }));
      continue;
    }
    const bucket = grouped[reference.category];
    if (!bucket) continue;
    bucket.push(Object.freeze({
      ...candidate.data,
      id: reference.definitionId,
      definitionId: reference.definitionId,
      revisionId: reference.revisionId,
      contentHash: reference.contentHash,
      isCustom: true,
    }));
  }

  if (failures.length > 0) {
    return Object.freeze({
      schemaVersion: CONTENT_ENVIRONMENT_SCHEMA_VERSION,
      environment: active,
      customContent: emptyRuntimeContent(),
      tunables: VANILLA_CONTENT_ENVIRONMENT.tunables,
      visualSelection: VANILLA_CONTENT_ENVIRONMENT.visualSelection,
      resolution: Object.freeze({
        ok: false,
        mode: 'failed-closed',
        reason: 'content_environment_resolution_failed',
        failures: Object.freeze(failures),
      }),
    });
  }

  return Object.freeze({
    schemaVersion: CONTENT_ENVIRONMENT_SCHEMA_VERSION,
    environment: active,
    customContent: Object.freeze(Object.fromEntries(
      Object.entries(grouped).map(([category, items]) => [
        category,
        Object.freeze(items),
      ]),
    )),
    tunables: active.tunables,
    visualSelection: active.visualSelection,
    resolution: Object.freeze({
      ok: true,
      mode: 'reviewed',
      reason: null,
      failures: Object.freeze([]),
    }),
  });
}
