/**
 * Small transport-neutral helpers shared by custom-content service lanes.
 */

import {
  canonicalContentJson,
} from '../domain/content/contentFingerprint.js';
import {
  projectDefinitionHead,
} from '../domain/content/customContentVersioning.js';
import {
  projectReviewedSupplyChainDefinitionHead,
} from '../domain/content/reviewedSupplyChainPersistence.js';

export function customContentNowIso() {
  return new Date().toISOString();
}

/** @param {unknown} error */
export function isMissingCustomContentSchema(error) {
  return ['42P01', '42883', 'PGRST202', 'PGRST204', 'PGRST205']
    .includes(/** @type {Record<string, any>} */ (error)?.code);
}

/** @param {unknown} error */
export function isMissingReviewedLifecycleColumn(error) {
  return ['42703', 'PGRST204']
    .includes(/** @type {Record<string, any>} */ (error)?.code);
}

/** @param {unknown} left @param {unknown} right */
export function sameCanonicalContentValue(left, right) {
  try {
    return canonicalContentJson(left) === canonicalContentJson(right);
  } catch {
    return false;
  }
}

/**
 * Translate one Supabase definition/head pair into the public camel-case read
 * model. Reviewed artifacts add their destination-owned lifecycle generation;
 * authorable definitions retain the established generic projection.
 *
 * @param {Record<string, any>} definition
 * @param {Record<string, any>} revision
 */
export function projectSupabaseContentHead(definition, revision) {
  const definitionRecord = {
    id: definition.id,
    category: definition.category,
    localUid: definition.local_uid,
    archivedAt: definition.archived_at,
    createdAt: definition.created_at,
    updatedAt: definition.updated_at,
    reviewedLifecycleVersion: definition.reviewed_lifecycle_version,
  };
  const revisionRecord = {
    id: revision.id,
    definitionId: revision.definition_id,
    revisionNumber: revision.revision_no,
    contentHash: revision.content_hash,
    data: revision.data,
    createdAt: revision.created_at,
  };
  return definition.category === 'supplyChains'
    ? projectReviewedSupplyChainDefinitionHead(
        definitionRecord,
        revisionRecord,
      )
    : projectDefinitionHead(definitionRecord, revisionRecord);
}
