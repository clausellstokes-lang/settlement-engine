/**
 * Receiving-account remap for settlement custom-content provenance.
 *
 * Campaign bindings and settlement usage receipts are separate durable
 * artifacts, but their hashes form a join. Keeping this projection beside the
 * account binding remapper makes the ordering explicit without inflating the
 * core campaign portability module past its legibility budget.
 */

import {
  admitCampaignContentBinding,
} from '../domain/content/contentEnvironment.js';
import {
  fingerprintContent,
} from '../domain/content/contentFingerprint.js';
import {
  admitSettlementContentProvenance,
  SETTLEMENT_CONTENT_PROVENANCE_SCHEMA_VERSION,
} from '../domain/content/settlementContentProvenance.js';
import {
  remapAccountCampaignContentBinding,
} from './accountContentPortability.js';

const SHA256_RE = /^[0-9a-f]{64}$/;

/**
 * @typedef {{
 *   namespace:string,
 *   definitionIds:Map<string,string>,
 *   revisionIds:Map<string,string>,
 *   localUids:Map<string,string>,
 *   packIds:Map<string,string>,
 *   environmentIds:Map<string,string>,
 *   environmentRevisionIds:Map<string,string>,
 *   revisionContentHashes:Map<string,string>,
 *   revisionNumbers:Map<string,number>,
 *   environmentHashes:Map<string,string>,
 *   archiveBacked:boolean,
 *   importedData:Map<string,{
 *     data:Record<string,unknown>,definitionId:string,revisionId:string,
 *   }>,
 *   diagnostics:Readonly<Record<string,unknown>>,
 * }} AccountContentIdentityMap
 */

/**
 * Build the source-binding-hash → receiving binding join used by settlement
 * provenance. A settlement generated inside a campaign can point at either the
 * current cutoff or a historical cutoff, so both are included.
 *
 * @param {unknown} campaigns
 * @param {AccountContentIdentityMap} identityMap
 */
export function accountCampaignBindingDestinations(campaigns, identityMap) {
  const destinations = new Map();
  for (const rawCampaign of Array.isArray(campaigns) ? campaigns : []) {
    const candidates = [
      rawCampaign?.contentBinding,
      ...(Array.isArray(rawCampaign?.contentBindingHistory)
        ? rawCampaign.contentBindingHistory
        : []),
    ];
    for (const candidate of candidates) {
      const source = admitCampaignContentBinding(candidate);
      if (!source.ok) continue;
      const remapped = remapAccountCampaignContentBinding(
        source.binding,
        identityMap,
      );
      if (remapped.ok) {
        destinations.set(source.binding.bindingHash, remapped.binding);
      }
    }
  }
  return destinations;
}

/**
 * Rebuild a settlement's usage receipt in the receiving account namespace.
 *
 * Exact provenance is all-or-nothing per materialized definition. When the
 * archive command was not confirmed (or its receipt omits an identity/hash
 * pair), callers must remove the source receipt rather than present foreign
 * source ids as exact destination joins.
 *
 * @param {unknown} rawProvenance
 * @param {AccountContentIdentityMap} identityMap
 * @param {Map<string, Record<string, any>>} [bindingDestinations]
 */
export function remapAccountSettlementContentProvenance(
  rawProvenance,
  identityMap,
  bindingDestinations = new Map(),
) {
  if (rawProvenance == null) return { ok: true, provenance: null };
  const admitted = admitSettlementContentProvenance(rawProvenance);
  if (admitted.ok === false) {
    return {
      ok: false,
      code: admitted.reason,
      error: admitted.message,
    };
  }
  const source = admitted.provenance;
  const materializedDefinitions = [];
  for (const definition of source.materializedDefinitions) {
    const definitionId = identityMap.definitionIds.get(
      definition.definitionId,
    );
    const revisionId = identityMap.revisionIds.get(definition.revisionId);
    const contentHash = identityMap.revisionContentHashes.get(
      definition.revisionId,
    );
    const localUid = definition.localUid == null
      ? null
      : identityMap.localUids.get(definition.localUid);
    if (
      !definitionId
      || !revisionId
      || !SHA256_RE.test(String(contentHash || ''))
      || (definition.localUid != null && !localUid)
    ) {
      return {
        ok: false,
        code: 'settlement_content_provenance_identity_incomplete',
        error:
          'The archive receipt did not map every settlement content identity.',
      };
    }
    materializedDefinitions.push(Object.freeze({
      ...definition,
      definitionId,
      revisionId,
      contentHash,
      localUid: localUid || null,
    }));
  }

  const destinationBinding = source.bindingHash
    ? bindingDestinations.get(source.bindingHash) || null
    : null;
  let environment = null;
  if (destinationBinding?.environment) {
    environment = Object.freeze({
      environmentId: destinationBinding.environment.environmentId,
      environmentRevisionId:
        destinationBinding.environment.environmentRevisionId,
      environmentHash: destinationBinding.environment.environmentHash,
      source: destinationBinding.environment.source || null,
    });
  } else if (source.environment) {
    const environmentId = identityMap.environmentIds.get(
      source.environment.environmentId,
    );
    const environmentRevisionId = identityMap.environmentRevisionIds.get(
      source.environment.environmentRevisionId,
    );
    const environmentHash = identityMap.environmentHashes.get(
      source.environment.environmentRevisionId,
    );
    if (
      environmentId
      && environmentRevisionId
      && SHA256_RE.test(String(environmentHash || ''))
    ) {
      environment = Object.freeze({
        environmentId,
        environmentRevisionId,
        environmentHash,
        source: source.environment.source,
      });
    } else {
      return {
        ok: false,
        code: 'settlement_content_provenance_environment_incomplete',
        error:
          'The archive receipt did not map the settlement content environment.',
      };
    }
  }

  const core = {
    schemaVersion: SETTLEMENT_CONTENT_PROVENANCE_SCHEMA_VERSION,
    scope: destinationBinding ? 'campaign' : 'standalone',
    environment,
    // A campaign hash is exact only when that campaign cutoff was itself
    // rebuilt. Detached settlements keep exact definition/environment joins
    // but no longer pretend to belong to a foreign campaign constitution.
    bindingHash: destinationBinding?.bindingHash || null,
    materializedDefinitions,
  };
  const candidate = {
    ...core,
    receiptHash: fingerprintContent(core),
  };
  const verified = admitSettlementContentProvenance(candidate);
  if (verified.ok === false) {
    return {
      ok: false,
      code: verified.reason,
      error: verified.message,
    };
  }
  return { ok: true, provenance: verified.provenance };
}
