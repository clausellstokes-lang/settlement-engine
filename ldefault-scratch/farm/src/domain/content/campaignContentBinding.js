/**
 * Portable campaign content-binding authority.
 *
 * Bindings are immutable, content-addressed campaign cutoffs. This module is
 * intentionally synchronous because campaign creation and persistence
 * hydration must admit them before state changes. It depends on the compact
 * generated field contract, never the rich authoring vocabulary.
 */

import {
  authoredDataOf,
  contentRevisionHash,
  isAuthorableContentCategory,
} from './customContentVersioning.js';
import {
  admitReviewedSupplyChain,
  isReviewedDerivedContentCategory,
  PERSISTED_RUNTIME_CONTENT_CATEGORIES,
  reviewedSupplyChainContentHash,
  reviewedSupplyChainRevisionEntry,
} from './reviewedSupplyChainPersistence.js';
import {
  canonicalContentJson,
  fingerprintContent,
  isPlainContentRecord,
} from './contentFingerprint.js';
import {
  admitCustomContentDefinitionShape,
} from './customContentAdmission.js';
import { compareCodepoint } from '../deterministicSort.js';
import {
  legacyDefinitionEntry,
} from './contentEnvironmentLibrary.js';
import {
  admitContentEnvironmentRevision,
  cleanContentIdentifier,
  makeContentEnvironmentRevision,
} from './contentEnvironmentRevision.js';
import {
  CAMPAIGN_CONTENT_BINDING_SCHEMA_VERSION,
  CONTENT_ENVIRONMENT_SCHEMA_VERSION,
  VANILLA_CONTENT_ENVIRONMENT,
  VANILLA_ENVIRONMENT_REVISION_ID,
} from './contentEnvironmentDefaults.js';

export { CAMPAIGN_CONTENT_BINDING_SCHEMA_VERSION };

const SHA256_RE = /^[0-9a-f]{64}$/;

/**
 * @typedef {Record<string, unknown>} ContentRecord
 * @typedef {Readonly<{
 *   packId:string,
 *   packVersionId:string,
 *   manifestHash:string,
 *   order:number,
 * }>} ContentPackBinding
 * @typedef {Readonly<{
 *   schemaVersion:number,
 *   environmentId:string,
 *   environmentRevisionId:string,
 *   revisionNumber:number,
 *   source:string,
 *   packVersions:ReadonlyArray<ContentPackBinding>,
 *   directDefinitions:ReadonlyArray<unknown>,
 *   tunables:Readonly<Record<string, number|boolean>>,
 *   visualSelection:Readonly<Record<string, string>>,
 *   environmentHash:string,
 *   createdAt:string|null,
 * }>} ContentEnvironmentRevision
 * @typedef {Readonly<{
 *   definitionId:string,
 *   revisionId:string,
 *   contentHash:string,
 *   category:string,
 *   data:Readonly<ContentRecord>,
 * }>} ResolvedContentDefinition
 * @typedef {Readonly<{
 *   schemaVersion:number,
 *   source:string,
 *   environment:ContentEnvironmentRevision,
 *   resolvedDefinitions:ReadonlyArray<ResolvedContentDefinition>,
 *   bindingHash:string,
 * }>} CampaignContentBinding
 * @typedef {{
 *   environment?:ContentEnvironmentRevision|null,
 *   environmentId?:string,
 *   environmentRevisionId?:string,
 *   revisionNumber?:number,
 *   packVersions?:ReadonlyArray<ContentPackBinding>,
 *   tunables?:Record<string, number|boolean>,
 *   visualSelection?:Record<string, string>,
 *   source?:string,
 * }} CampaignBindingOptions
 * @typedef {{definitionId:string, revisionId:string, contentHash:string,
 *   category:string, data:ContentRecord}} LegacyDefinitionEntry
 * @typedef {{ok:true, binding:CampaignContentBinding,
 *   reason?:undefined, message?:undefined} |
 *   {ok:false, reason:string, message?:string,
 *   binding?:undefined}} CampaignBindingAdmission
 */

/**
 * Build a portable, immutable binding from the current authored library.
 *
 * Version-aware items contribute their exact definition and revision ids.
 * Legacy items receive explicit inferred identities so their observed cutoff
 * remains portable without claiming provenance that does not exist.
 *
 * @param {unknown} customContent
 * @param {CampaignBindingOptions} [options]
 * @returns {CampaignContentBinding}
 */
export function makeCampaignContentBinding(customContent, options = {}) {
  /** @type {LegacyDefinitionEntry[]} */
  const resolvedDefinitions = [];
  const seenDefinitionIds = new Set();
  const seenLocalUids = new Set();
  const library = isPlainContentRecord(customContent)
    ? /** @type {ContentRecord} */ (customContent)
    : {};
  for (const category of PERSISTED_RUNTIME_CONTENT_CATEGORIES) {
    const items = Array.isArray(library[category]) ? library[category] : [];
    for (const item of items) {
      if (!item) continue;
      const record = isPlainContentRecord(item)
        ? /** @type {ContentRecord} */ (item)
        : null;
      if (record?.archivedAt) continue;
      const entry = isReviewedDerivedContentCategory(category)
        ? reviewedSupplyChainRevisionEntry(item)
        : legacyDefinitionEntry(category, item);
      if (seenDefinitionIds.has(entry.definitionId)) {
        throw new TypeError(
          `Duplicate resolved definition "${entry.definitionId}".`,
        );
      }
      seenDefinitionIds.add(entry.definitionId);
      const entryData = /** @type {ContentRecord} */ (entry.data);
      const localUid = typeof entryData.localUid === 'string'
        ? entryData.localUid.trim()
        : '';
      if (localUid && seenLocalUids.has(localUid)) {
        throw new TypeError(
          `Duplicate resolved localUid "${localUid}".`,
        );
      }
      if (localUid) seenLocalUids.add(localUid);
      resolvedDefinitions.push(entry);
    }
  }
  resolvedDefinitions.sort((left, right) => (
    compareCodepoint(left.definitionId, right.definitionId)
    || compareCodepoint(left.category, right.category)
  ));

  if (
    resolvedDefinitions.length === 0
    && (
      !options.environment
      || options.environment.environmentRevisionId
        === VANILLA_ENVIRONMENT_REVISION_ID
    )
    && !options.packVersions?.length
    && Object.keys(options.tunables || {}).length === 0
    && Object.keys(options.visualSelection || {}).length === 0
  ) {
    const source = cleanContentIdentifier(
      String(options.source || 'vanilla'),
      'binding source',
    );
    const bindingCore = {
      schemaVersion: CAMPAIGN_CONTENT_BINDING_SCHEMA_VERSION,
      source,
      environment: options.environment || VANILLA_CONTENT_ENVIRONMENT,
      resolvedDefinitions: [],
    };
    return Object.freeze({
      ...bindingCore,
      resolvedDefinitions: Object.freeze([]),
      bindingHash: fingerprintContent(bindingCore),
    });
  }

  const directDefinitions = resolvedDefinitions.map(entry => ({
    definitionId: entry.definitionId,
    revisionId: entry.revisionId,
    contentHash: entry.contentHash,
    category: entry.category,
  }));
  const baseEnvironment = options.environment || null;
  const seedHash = fingerprintContent({
    directDefinitions,
    baseEnvironmentHash: baseEnvironment?.environmentHash || null,
    packVersions: options.packVersions || baseEnvironment?.packVersions || [],
  });
  // A campaign cutoff is its own constitutional environment revision. Reusing
  // a standalone active revision would be dishonest when its selected heads
  // differ from the campaign's resolved snapshot.
  const environment = makeContentEnvironmentRevision({
    environmentId: options.environmentId
      || `campaign-cutoff:${seedHash.slice(0, 24)}`,
    environmentRevisionId: options.environmentRevisionId
      || `campaign-cutoff-revision:${seedHash}`,
    revisionNumber:
      options.revisionNumber ?? baseEnvironment?.revisionNumber ?? 1,
    packVersions: options.packVersions || baseEnvironment?.packVersions || [],
    directDefinitions,
    tunables: options.tunables || baseEnvironment?.tunables || {},
    visualSelection: options.visualSelection
      || baseEnvironment?.visualSelection
      || {},
    source: options.source || 'legacy-inferred',
  });
  const portableResolved = resolvedDefinitions.map(entry => Object.freeze({
    definitionId: entry.definitionId,
    revisionId: entry.revisionId,
    contentHash: entry.contentHash,
    category: entry.category,
    data: Object.freeze(entry.data),
  }));
  const source = cleanContentIdentifier(
    String(options.source || 'legacy-inferred'),
    'binding source',
  );
  const bindingCore = {
    schemaVersion: CAMPAIGN_CONTENT_BINDING_SCHEMA_VERSION,
    source,
    environment,
    resolvedDefinitions: portableResolved,
  };
  return Object.freeze({
    ...bindingCore,
    resolvedDefinitions: Object.freeze(portableResolved),
    bindingHash: fingerprintContent(bindingCore),
  });
}

/**
 * Strictly admit a portable campaign binding.
 *
 * @param {unknown} value
 * @returns {CampaignBindingAdmission}
 */
export function admitCampaignContentBinding(value) {
  try {
    if (!isPlainContentRecord(value)) {
      return { ok: false, reason: 'content_binding_not_object' };
    }
    if (value.schemaVersion !== CAMPAIGN_CONTENT_BINDING_SCHEMA_VERSION) {
      return { ok: false, reason: 'content_binding_version_unsupported' };
    }
    const record = /** @type {ContentRecord} */ (value);
    const environmentAdmission = admitContentEnvironmentRevision(
      record.environment,
    );
    if (environmentAdmission.ok === false) return environmentAdmission;
    const environment = environmentAdmission.environment;
    if (!Array.isArray(record.resolvedDefinitions)) {
      return { ok: false, reason: 'content_resolution_not_array' };
    }
    const seenDefinitions = new Set();
    const seenLocalUids = new Set();
    /** @type {ResolvedContentDefinition[]} */
    const resolvedDefinitions = record.resolvedDefinitions.map(
      (entry, index) => {
        if (!isPlainContentRecord(entry)) {
          throw new TypeError(`resolvedDefinitions[${index}] is invalid.`);
        }
        const resolvedRecord = /** @type {ContentRecord} */ (entry);
        if (!isPlainContentRecord(resolvedRecord.data)) {
          throw new TypeError(`resolvedDefinitions[${index}] is invalid.`);
        }
        const category = String(resolvedRecord.category || '');
        if (
          !isAuthorableContentCategory(category)
          && !isReviewedDerivedContentCategory(category)
        ) {
          throw new TypeError(
            `resolvedDefinitions[${index}] has an unsupported category.`,
          );
        }
        const definitionId = cleanContentIdentifier(
          resolvedRecord.definitionId,
          'definitionId',
        );
        if (seenDefinitions.has(definitionId)) {
          throw new TypeError(
            `Duplicate resolved definition "${definitionId}".`,
          );
        }
        seenDefinitions.add(definitionId);
        let manifestDefinition;
        let contentHash;
        if (isReviewedDerivedContentCategory(category)) {
          const artifactAdmission = admitReviewedSupplyChain(
            resolvedRecord.data,
          );
          if (!artifactAdmission.ok) {
            throw new TypeError(
              `resolvedDefinitions[${index}] failed reviewed-artifact admission.`,
            );
          }
          manifestDefinition = /** @type {ContentRecord} */ (
            artifactAdmission.chain
          );
          contentHash = reviewedSupplyChainContentHash(manifestDefinition);
        } else {
          const data = authoredDataOf(resolvedRecord.data);
          const manifestAdmission = admitCustomContentDefinitionShape(
            category,
            data,
            { allowSystemFields: true },
          );
          if (!manifestAdmission.ok) {
            throw new TypeError(
              `resolvedDefinitions[${index}] failed manifest admission.`,
            );
          }
          manifestDefinition = /** @type {ContentRecord} */ (
            manifestAdmission.definition
          );
          contentHash = contentRevisionHash(category, data);
        }
        const localUid = typeof manifestDefinition.localUid === 'string'
          ? manifestDefinition.localUid.trim()
          : '';
        if (localUid && seenLocalUids.has(localUid)) {
          throw new TypeError(
            `Duplicate resolved localUid "${localUid}".`,
          );
        }
        if (localUid) seenLocalUids.add(localUid);
        if (contentHash !== resolvedRecord.contentHash) {
          throw new TypeError(
            `resolvedDefinitions[${index}] hash mismatch.`,
          );
        }
        return {
          definitionId,
          revisionId: cleanContentIdentifier(
            resolvedRecord.revisionId,
            'revisionId',
          ),
          contentHash,
          category,
          data: manifestDefinition,
        };
      },
    );
    const directByDefinition = new Map(
      environment.directDefinitions.map(entry => [
        entry.definitionId,
        entry,
      ]),
    );
    if (directByDefinition.size !== resolvedDefinitions.length) {
      return {
        ok: false,
        reason: 'content_binding_environment_parity_mismatch',
      };
    }
    for (const resolved of resolvedDefinitions) {
      const direct = directByDefinition.get(resolved.definitionId);
      if (
        !direct
        || direct.revisionId !== resolved.revisionId
        || direct.contentHash !== resolved.contentHash
        || direct.category !== resolved.category
      ) {
        return {
          ok: false,
          reason: 'content_binding_environment_parity_mismatch',
        };
      }
    }
    const core = {
      schemaVersion: Number(record.schemaVersion),
      source: cleanContentIdentifier(
        String(record.source || 'personal'),
        'binding source',
      ),
      environment,
      resolvedDefinitions,
    };
    if (
      !SHA256_RE.test(String(record.bindingHash || ''))
      || fingerprintContent(core) !== record.bindingHash
    ) {
      return { ok: false, reason: 'content_binding_hash_mismatch' };
    }
    const binding = {
      ...core,
      resolvedDefinitions,
      bindingHash: String(record.bindingHash),
    };
    // Constitutional data may not retain unknown fields in storage while
    // silently dropping them from the admitted runtime projection.
    if (canonicalContentJson(value) !== canonicalContentJson(binding)) {
      return { ok: false, reason: 'content_binding_shape_mismatch' };
    }
    return {
      ok: true,
      binding: Object.freeze({
        ...core,
        resolvedDefinitions: Object.freeze(
          resolvedDefinitions.map(definition => Object.freeze(definition)),
        ),
        bindingHash: String(record.bindingHash),
      }),
    };
  } catch (error) {
    return {
      ok: false,
      reason: 'content_binding_invalid',
      message: error instanceof Error
        ? error.message
        : 'Invalid content binding.',
    };
  }
}

/**
 * Project a campaign binding into the grouped shape consumed by simulation.
 *
 * @param {unknown} binding
 * @returns {Record<string, Array<ContentRecord>>}
 */
export function customContentFromCampaignBinding(binding) {
  const admitted = admitCampaignContentBinding(binding);
  const grouped = /** @type {Record<string, Array<ContentRecord>>} */ (
    Object.fromEntries(
      PERSISTED_RUNTIME_CONTENT_CATEGORIES.map(category => [category, []]),
    )
  );
  if (admitted.ok === false) {
    return /** @type {Record<string, Array<ContentRecord>>} */ (
      Object.freeze(Object.fromEntries(
        Object.entries(grouped).map(([category, items]) => [
          category,
          Object.freeze(items),
        ]),
      ))
    );
  }
  for (const resolved of admitted.binding.resolvedDefinitions) {
    const bucket = grouped[resolved.category];
    if (!bucket) continue;
    bucket.push(Object.freeze({
      ...resolved.data,
      id: resolved.definitionId,
      definitionId: resolved.definitionId,
      revisionId: resolved.revisionId,
      contentHash: resolved.contentHash,
      isCustom: true,
    }));
  }
  return /** @type {Record<string, Array<ContentRecord>>} */ (
    Object.freeze(Object.fromEntries(
      Object.entries(grouped).map(([category, items]) => [
        category,
        Object.freeze(items),
      ]),
    ))
  );
}

/**
 * Full runtime projection for an admitted campaign binding.
 *
 * @param {unknown} binding
 */
export function contentRuntimeFromCampaignBinding(binding) {
  const admitted = admitCampaignContentBinding(binding);
  const environment = admitted.ok
    ? admitted.binding.environment
    : VANILLA_CONTENT_ENVIRONMENT;
  return Object.freeze({
    schemaVersion: CONTENT_ENVIRONMENT_SCHEMA_VERSION,
    environment,
    customContent: customContentFromCampaignBinding(binding),
    tunables: environment.tunables,
    visualSelection: environment.visualSelection,
  });
}
