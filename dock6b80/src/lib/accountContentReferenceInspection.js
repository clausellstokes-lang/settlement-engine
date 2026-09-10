/**
 * Read-only custom-content reference inspection for account portability.
 *
 * Account export has to prove that every campaign reference is either present
 * in the accompanying content artifact or safe to preserve as an immutable
 * embedded snapshot. Reviewed-derived supply chains are stricter: their graph
 * authority lives in the full ledger archive, so a pack-only export may never
 * treat their self-contained campaign copy as portable proof.
 *
 * This module owns source-address enumeration and export preflight only.
 * Receiving-account identity construction and binding remap stay in
 * accountContentPortability.js.
 */

import {
  admitCampaignContentBinding,
} from '../domain/content/contentEnvironment.js';
import {
  admitCampaignContentBindingHistory,
} from '../domain/content/campaignContentLifecycle.js';
import {
  isReviewedDerivedContentCategory,
} from '../domain/content/reviewedSupplyChainPersistence.js';
import {
  isPlainContentRecord,
} from '../domain/content/contentFingerprint.js';
import {
  PACK_BUCKETS,
} from './contentPacks.js';

/** @param {unknown} value */
function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/** @param {unknown} value */
function plainRecord(value) {
  return isPlainContentRecord(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/**
 * Stable tuple key shared by preflight and receiving-account identity joins.
 *
 * @param {string} definitionId
 * @param {string} revisionId
 * @param {string} contentHash
 */
export function accountContentRevisionKey(
  definitionId,
  revisionId,
  contentHash,
) {
  return `${definitionId}\u0000${revisionId}\u0000${contentHash}`;
}

/**
 * The pack itself is authoritative for the source tuple. New exports populate
 * both fields; older v2 exports fall back to the same legacy identities used by
 * makeCampaignContentBinding.
 *
 * @param {string} bucket
 * @param {Record<string, unknown>} entry
 */
function sourceIdentity(bucket, entry) {
  const contentHash = cleanText(entry.contentHash);
  const definitionId = cleanText(entry.sourceDefinitionId)
    || cleanText(entry.localUid)
    || cleanText(entry.packEntryId);
  const revisionId = cleanText(entry.sourceRevisionId)
    || (contentHash ? `legacy-revision:${contentHash}` : '');
  return {
    bucket,
    packEntryId: cleanText(entry.packEntryId),
    sourceDefinitionId: definitionId,
    sourceRevisionId: revisionId,
    sourceLocalUid: cleanText(entry.localUid),
    contentHash,
  };
}

/**
 * Enumerate the deterministic source-address manifest carried by a strict pack.
 *
 * @param {unknown} pack
 */
export function accountPackSourceIdentities(pack) {
  if (!isPlainContentRecord(pack) || !isPlainContentRecord(pack.content)) {
    return Object.freeze([]);
  }
  const identities = [];
  for (const bucket of PACK_BUCKETS) {
    const entries = Array.isArray(pack.content[bucket])
      ? pack.content[bucket]
      : [];
    for (const rawEntry of entries) {
      if (!isPlainContentRecord(rawEntry)) continue;
      identities.push(Object.freeze(sourceIdentity(
        bucket,
        /** @type {Record<string, unknown>} */ (rawEntry),
      )));
    }
  }
  return Object.freeze(identities);
}

/**
 * Enumerate exact immutable revision tuples carried by a full ledger archive.
 * The archive validator remains the authority for graph integrity; this helper
 * only builds the campaign-reference join used by account preflight.
 *
 * @param {unknown} archive
 */
function accountArchiveSourceRevisions(archive) {
  const ledger = plainRecord(plainRecord(archive).ledger);
  const revisions = Array.isArray(ledger.revisions) ? ledger.revisions : [];
  return revisions.flatMap((rawRevision) => {
    const revision = plainRecord(rawRevision);
    const definitionId = cleanText(revision.definitionId);
    const revisionId = cleanText(revision.id);
    const contentHash = cleanText(revision.contentHash);
    return definitionId && revisionId && contentHash
      ? [{ definitionId, revisionId, contentHash }]
      : [];
  });
}

/**
 * Inspect every campaign binding without mutation. Invalid constitutional data
 * is an export blocker: silently carrying it into a "complete" backup would
 * guarantee an import warning or fallback.
 *
 * @param {unknown} campaigns
 * @param {unknown} pack
 */
export function inspectAccountContentReferences(campaigns, pack) {
  const sourceRecord = plainRecord(pack);
  const archiveRevisions =
    sourceRecord.format === 'settlementforge.custom-content-ledger'
      ? accountArchiveSourceRevisions(pack)
      : [];
  const packIdentities = archiveRevisions.length === 0
    ? accountPackSourceIdentities(pack)
    : [];
  const exactPortableRevisions = new Set([
    ...packIdentities.map(identity => (
      accountContentRevisionKey(
        identity.sourceDefinitionId,
        identity.sourceRevisionId,
        identity.contentHash,
      )
    )),
    ...archiveRevisions.map(identity => (
      accountContentRevisionKey(
        identity.definitionId,
        identity.revisionId,
        identity.contentHash,
      )
    )),
  ]);
  const portableDefinitions = new Set([
    ...packIdentities.map(identity => identity.sourceDefinitionId),
    ...archiveRevisions.map(identity => identity.definitionId),
  ]);
  const errors = /** @type {Array<{
   *   code:string,path:string,message:string,
   * }>} */ ([]);
  let bindings = 0;
  let bindingRevisions = 0;
  let packMappedRevisions = 0;
  let embeddedRevisions = 0;

  /**
   * @param {unknown} rawBinding
   * @param {string} path
   */
  function inspectBinding(rawBinding, path) {
    const admitted = admitCampaignContentBinding(rawBinding);
    if (!admitted.ok) {
      errors.push({
        code: 'campaign_content_binding_invalid',
        path,
        message: admitted.message || admitted.reason,
      });
      return;
    }
    bindings += 1;
    for (const definition of admitted.binding.resolvedDefinitions) {
      bindingRevisions += 1;
      const key = accountContentRevisionKey(
        definition.definitionId,
        definition.revisionId,
        definition.contentHash,
      );
      if (
        exactPortableRevisions.has(key)
        && portableDefinitions.has(definition.definitionId)
      ) {
        packMappedRevisions += 1;
      } else if (isReviewedDerivedContentCategory(definition.category)) {
        errors.push({
          code: 'reviewed_supply_chain_archive_identity_required',
          path,
          message:
            'Reviewed supply chains require their exact full-ledger archive identity.',
        });
      } else {
        embeddedRevisions += 1;
      }
    }
  }

  const sourceCampaigns = Array.isArray(campaigns) ? campaigns : [];
  sourceCampaigns.forEach((campaign, campaignIndex) => {
    if (!campaign || typeof campaign !== 'object') return;
    if (campaign.contentBinding != null) {
      inspectBinding(
        campaign.contentBinding,
        `campaigns[${campaignIndex}].contentBinding`,
      );
    }
    if (campaign.contentBindingHistory != null) {
      const admittedHistory = admitCampaignContentBindingHistory(
        campaign.contentBindingHistory,
      );
      if (!admittedHistory.ok) {
        errors.push({
          code: 'campaign_content_binding_history_invalid',
          path: `campaigns[${campaignIndex}].contentBindingHistory`,
          message: admittedHistory.message || admittedHistory.reason,
        });
      } else {
        admittedHistory.history.forEach((binding, historyIndex) => {
          inspectBinding(
            binding,
            `campaigns[${campaignIndex}].contentBindingHistory[${historyIndex}]`,
          );
        });
      }
    }
  });

  return Object.freeze({
    ok: errors.length === 0,
    bindings,
    bindingRevisions,
    packMappedRevisions,
    embeddedRevisions,
    errors: Object.freeze(errors.map(error => Object.freeze(error))),
  });
}
