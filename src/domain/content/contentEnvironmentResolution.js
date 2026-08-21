/**
 * Exact historical resolution for immutable content environments.
 *
 * Environment records are addresses, not payloads. This module joins those
 * addresses to immutable definition revisions and published pack closures,
 * then delegates the final manifest and content-hash checks to the canonical
 * runtime compiler. Keeping the join explicit prevents current editable heads
 * from silently changing an older environment after it has been activated.
 */

import {
  admitContentEnvironmentRevision,
  contentRuntimeFromEnvironment,
  VANILLA_CONTENT_ENVIRONMENT,
} from './contentEnvironment.js';
import {
  detachContentJson,
  isPlainContentRecord,
} from './contentFingerprint.js';
import {
  admitReviewedSupplyChain,
  isReviewedDerivedContentCategory,
  PERSISTED_RUNTIME_CONTENT_CATEGORIES,
  reviewedSupplyChainContentHash,
} from './reviewedSupplyChainPersistence.js';

const SHA256_RE = /^[0-9a-f]{64}$/;

/**
 * @typedef {Record<string, unknown>} ContentRecord
 * @typedef {Readonly<Record<string,
 *   ReadonlyArray<ContentRecord>>>} ReadonlyContentLibrary
 * @typedef {{
 *   id?:unknown,
 *   revisionId?:unknown,
 *   definition_id?:unknown,
 *   definitionId?:unknown,
 *   revision_no?:unknown,
 *   revisionNumber?:unknown,
 *   content_hash?:unknown,
 *   contentHash?:unknown,
 *   data?:unknown,
 * }} ContentRevisionSnapshot
 * @typedef {ReturnType<typeof import(
 *   './contentEnvironment.js'
 * ).makeContentEnvironmentRevision>} ContentEnvironmentRevision
 * @typedef {{
 *   ok:true,
 *   environment:ContentEnvironmentRevision,
 *   customContent:ReadonlyContentLibrary,
 *   runtime:Readonly<ContentRecord>,
 * } | {
 *   ok:false,
 *   reason:string,
 *   message?:string,
 *   failures?:ReadonlyArray<Readonly<Record<string, unknown>>>,
 * }} ContentEnvironmentResolution
 */

/**
 * @param {unknown} value
 * @param {string} field
 */
function cleanIdentifier(value, field) {
  if (typeof value !== 'string' || !value.trim() || value.length > 240) {
    throw codedTypeError(
      'content_environment_pack_closure_invalid',
      `${field} is invalid.`,
    );
  }
  return value.trim();
}

/**
 * @param {unknown} value
 * @param {string} field
 */
function cleanSha256(value, field) {
  if (typeof value !== 'string' || !SHA256_RE.test(value)) {
    throw codedTypeError(
      'content_environment_pack_closure_invalid',
      `${field} must be a lowercase SHA-256 fingerprint.`,
    );
  }
  return value;
}

/**
 * Errors carry stable machine codes without introducing a bespoke error class
 * into the pure domain layer.
 *
 * @param {string} code
 * @param {string} message
 */
function codedTypeError(code, message) {
  return Object.assign(new TypeError(message), { code });
}

/**
 * Prove that every requested pack version is available and that every one of
 * its immutable entries occurs in the environment's direct revision set.
 *
 * @param {ContentEnvironmentRevision} environment
 * @param {ReadonlyArray<unknown>} packClosures
 */
function validatePackClosures(environment, packClosures) {
  const directByDefinition = new Map(
    environment.directDefinitions.map(reference => [
      reference.definitionId,
      reference,
    ]),
  );
  const expectedPackByKey = new Map(
    environment.packVersions.map(binding => [
      `${binding.packId}\u0000${binding.packVersionId}`,
      binding,
    ]),
  );
  const seenPackKeys = new Set();

  for (const [closureIndex, closureValue] of packClosures.entries()) {
    if (!isPlainContentRecord(closureValue)) {
      throw codedTypeError(
        'content_environment_pack_closure_invalid',
        `packClosures[${closureIndex}] must be an object.`,
      );
    }
    const closure = /** @type {ContentRecord} */ (closureValue);
    const packId = cleanIdentifier(
      closure.packId,
      `packClosures[${closureIndex}].packId`,
    );
    const packVersionId = cleanIdentifier(
      closure.packVersionId,
      `packClosures[${closureIndex}].packVersionId`,
    );
    const packKey = `${packId}\u0000${packVersionId}`;
    const expectedPack = expectedPackByKey.get(packKey);
    const manifestHash = cleanSha256(
      closure.manifestHash,
      `packClosures[${closureIndex}].manifestHash`,
    );
    if (
      !expectedPack
      || manifestHash !== expectedPack.manifestHash
      || seenPackKeys.has(packKey)
    ) {
      throw codedTypeError(
        'content_environment_pack_closure_mismatch',
        `packClosures[${closureIndex}] does not match the environment.`,
      );
    }
    seenPackKeys.add(packKey);
    validatePackEntries(closure, closureIndex, directByDefinition);
  }

  if (seenPackKeys.size !== expectedPackByKey.size) {
    throw codedTypeError(
      'content_environment_pack_closure_unavailable',
      'One or more requested pack-version closures are unavailable.',
    );
  }
}

/**
 * @param {ContentRecord} closure
 * @param {number} closureIndex
 * @param {Map<string, ContentEnvironmentRevision['directDefinitions'][number]>}
 *   directByDefinition
 */
function validatePackEntries(closure, closureIndex, directByDefinition) {
  if (!Array.isArray(closure.entries) || closure.entries.length === 0) {
    throw codedTypeError(
      'content_environment_pack_closure_invalid',
      `packClosures[${closureIndex}].entries must be a nonempty array.`,
    );
  }
  const seenEntryIds = new Set();
  for (const [entryIndex, entryValue] of closure.entries.entries()) {
    if (!isPlainContentRecord(entryValue)) {
      throw codedTypeError(
        'content_environment_pack_closure_invalid',
        `packClosures[${closureIndex}].entries[${entryIndex}] must be an object.`,
      );
    }
    const entry = /** @type {ContentRecord} */ (entryValue);
    const field = `packClosures[${closureIndex}].entries[${entryIndex}]`;
    const packEntryId = cleanIdentifier(entry.packEntryId, `${field}.packEntryId`);
    const ordinal = Number(entry.ordinal);
    if (
      seenEntryIds.has(packEntryId)
      || !Number.isInteger(ordinal)
      || ordinal !== entryIndex
    ) {
      throw codedTypeError(
        'content_environment_pack_closure_invalid',
        `${field} has invalid identity or order.`,
      );
    }
    seenEntryIds.add(packEntryId);

    const definitionId = cleanIdentifier(entry.definitionId, `${field}.definitionId`);
    const revisionId = cleanIdentifier(entry.revisionId, `${field}.revisionId`);
    const category = String(entry.category || '');
    const direct = directByDefinition.get(definitionId);
    if (
      !direct
      || direct.revisionId !== revisionId
      || direct.category !== category
    ) {
      throw codedTypeError(
        'content_environment_pack_closure_mismatch',
        `Pack entry "${packEntryId}" is absent from the environment revision set.`,
      );
    }
  }
}

/**
 * @param {ReadonlyArray<unknown>} revisionSnapshots
 * @returns {Map<string, ContentRevisionSnapshot>}
 */
function indexRevisionSnapshots(revisionSnapshots) {
  const revisionById = new Map();
  for (const [index, snapshotValue] of revisionSnapshots.entries()) {
    if (!isPlainContentRecord(snapshotValue)) {
      throw codedTypeError(
        'content_environment_revision_snapshot_invalid',
        `revisionSnapshots[${index}] must be an object.`,
      );
    }
    const snapshot = /** @type {ContentRevisionSnapshot} */ (snapshotValue);
    const revisionId = cleanIdentifier(
      snapshot.revisionId ?? snapshot.id,
      `revisionSnapshots[${index}].revisionId`,
    );
    if (revisionById.has(revisionId)) {
      throw codedTypeError(
        'content_environment_revision_snapshot_ambiguous',
        `Duplicate revision snapshot "${revisionId}".`,
      );
    }
    revisionById.set(revisionId, snapshot);
  }
  return revisionById;
}

/**
 * @param {ContentEnvironmentRevision} environment
 * @param {Map<string, ContentRevisionSnapshot>} revisionById
 */
function resolveDefinitionGroups(environment, revisionById) {
  /** @type {Record<string, Array<ContentRecord>>} */
  const grouped = {};
  for (const category of PERSISTED_RUNTIME_CONTENT_CATEGORIES) {
    grouped[category] = [];
  }
  /** @type {Array<Readonly<Record<string, unknown>>>} */
  const failures = [];

  for (const reference of environment.directDefinitions) {
    const snapshot = revisionById.get(reference.revisionId);
    const definitionId = snapshot == null
      ? null
      : String(snapshot.definitionId ?? snapshot.definition_id ?? '');
    const declaredHash = snapshot == null
      ? null
      : String(snapshot.contentHash ?? snapshot.content_hash ?? '');
    if (
      snapshot == null
      || definitionId !== reference.definitionId
      || declaredHash !== reference.contentHash
      || !isPlainContentRecord(snapshot.data)
    ) {
      failures.push(Object.freeze({
        definitionId: reference.definitionId,
        revisionId: reference.revisionId,
        reason: snapshot == null
          ? 'definition_revision_unavailable'
          : 'definition_revision_snapshot_mismatch',
      }));
      continue;
    }
    if (isReviewedDerivedContentCategory(reference.category)) {
      const admission = admitReviewedSupplyChain(snapshot.data);
      const revisionNumber = Number(
        snapshot.revisionNumber ?? snapshot.revision_no,
      );
      if (
        !admission.ok
        || !Number.isInteger(revisionNumber)
        || revisionNumber < 1
        || revisionNumber > 2_147_483_647
        || reviewedSupplyChainContentHash(snapshot.data)
          !== reference.contentHash
      ) {
        failures.push(Object.freeze({
          definitionId: reference.definitionId,
          revisionId: reference.revisionId,
          reason: 'reviewed_artifact_revision_invalid',
        }));
        continue;
      }
    }
    grouped[reference.category].push({
      .../** @type {ContentRecord} */ (detachContentJson(snapshot.data)),
      id: reference.definitionId,
      definitionId: reference.definitionId,
      revisionId: reference.revisionId,
      contentHash: reference.contentHash,
      isCustom: true,
      ...(isReviewedDerivedContentCategory(reference.category)
        ? {
            revisionNumber: Number(
              snapshot.revisionNumber ?? snapshot.revision_no,
            ),
          }
        : {}),
    });
  }
  return { grouped, failures };
}

/**
 * Resolve one immutable standalone environment from exact revision snapshots.
 *
 * @param {unknown} environment
 * @param {unknown} revisionSnapshots
 * @param {unknown} packClosures
 * @returns {ContentEnvironmentResolution}
 */
export function resolveContentEnvironmentSnapshot(
  environment,
  revisionSnapshots = [],
  packClosures = [],
) {
  const admission = admitContentEnvironmentRevision(
    environment || VANILLA_CONTENT_ENVIRONMENT,
  );
  if (admission.ok === false) {
    return {
      ok: false,
      reason: admission.reason,
      ...(admission.message ? { message: admission.message } : {}),
    };
  }
  if (!Array.isArray(revisionSnapshots)) {
    return {
      ok: false,
      reason: 'content_environment_revision_snapshot_invalid',
    };
  }
  if (!Array.isArray(packClosures)) {
    return {
      ok: false,
      reason: 'content_environment_pack_closure_invalid',
    };
  }

  try {
    validatePackClosures(admission.environment, packClosures);
    const revisionById = indexRevisionSnapshots(revisionSnapshots);
    const { grouped, failures } = resolveDefinitionGroups(
      admission.environment,
      revisionById,
    );
    if (failures.length > 0) {
      return {
        ok: false,
        reason: 'content_environment_resolution_failed',
        failures: Object.freeze(failures),
      };
    }

    const runtime = contentRuntimeFromEnvironment(admission.environment, grouped);
    const resolution = isPlainContentRecord(runtime.resolution)
      ? /** @type {ContentRecord} */ (runtime.resolution)
      : null;
    if (resolution?.ok !== true) {
      const runtimeFailures = Array.isArray(resolution?.failures)
        ? resolution.failures
          .filter(isPlainContentRecord)
          .map(failure => Object.freeze({ ...failure }))
        : [];
      return {
        ok: false,
        reason: String(
          resolution?.reason || 'content_environment_resolution_failed',
        ),
        failures: Object.freeze(runtimeFailures),
      };
    }
    return {
      ok: true,
      environment: admission.environment,
      customContent: /** @type {ReadonlyContentLibrary} */ (
        runtime.customContent
      ),
      runtime,
    };
  } catch (error) {
    return {
      ok: false,
      reason: typeof error === 'object' && error && 'code' in error
        ? String(error.code)
        : 'content_environment_resolution_invalid',
      message: error instanceof Error ? error.message : String(error),
    };
  }
}
