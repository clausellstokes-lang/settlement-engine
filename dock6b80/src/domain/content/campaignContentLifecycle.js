/**
 * Reviewed campaign content-binding migration.
 *
 * Campaign content truth lives in the campaign's canonical saved-map envelope:
 * `contentBinding` is the active immutable snapshot and
 * `contentBindingHistory` is the bounded set of immutable snapshots that have
 * been active. A rollback is a forward activation of one of those snapshots;
 * no definition, environment, or historical binding is rewritten.
 */

import {
  diffContentEnvironmentRevisions,
} from './contentEnvironmentRevision.js';
import {
  admitCampaignContentBindingHistory,
  MAX_CAMPAIGN_CONTENT_BINDING_REVISIONS,
  MAX_CAMPAIGN_CONTENT_HISTORY_BYTES,
  requireCampaignContentBinding,
} from './campaignContentBindingHistory.js';
import {
  canonicalContentJson,
  detachContentJson,
  fingerprintContent,
  isPlainContentRecord,
} from './contentFingerprint.js';
import { compareCodepoint } from '../deterministicSort.js';

export const CAMPAIGN_CONTENT_CHANGE_SCHEMA_VERSION = 1;
export {
  admitCampaignContentBindingHistory,
  MAX_CAMPAIGN_CONTENT_BINDING_REVISIONS,
  MAX_CAMPAIGN_CONTENT_HISTORY_BYTES,
};

const CHANGE_KINDS = new Set([
  'campaign.content-binding.migrate',
  'campaign.content-binding.rollback',
]);

/**
 * @typedef {Record<string, unknown>} ContentRecord
 * @typedef {'campaign.content-binding.migrate' |
 *   'campaign.content-binding.rollback'} CampaignContentChangeKind
 * @typedef {Readonly<{
 *   definitionId:string,
 *   revisionId:string,
 *   contentHash:string,
 *   category:string,
 * }>} ResolvedDefinition
 * @typedef {Readonly<{
 *   schemaVersion:number,
 *   source:string,
 *   environment:unknown,
 *   resolvedDefinitions:ReadonlyArray<ResolvedDefinition>,
 *   bindingHash:string,
 * }>} CampaignBinding
 * @typedef {Readonly<{
 *   definitionId:string,
 *   category:string|null,
 *   change:'added'|'removed'|'revision-changed',
 *   beforeRevisionId:string|null,
 *   afterRevisionId:string|null,
 *   beforeContentHash:string|null,
 *   afterContentHash:string|null,
 * }>} DefinitionChange
 * @typedef {Readonly<{
 *   schemaVersion:number,
 *   campaignId:string,
 *   authorityKey:string|null,
 *   kind:CampaignContentChangeKind,
 *   expectedBindingHash:string,
 *   targetBinding:CampaignBinding,
 *   targetBindingHash:string,
 *   sampleSeed:string|null,
 *   sampleFingerprint:string|null,
 * }>} CampaignContentChangePlan
 * @typedef {{
 *   campaignId:unknown,
 *   authorityKey:unknown,
 *   kind:CampaignContentChangeKind,
 *   currentBinding:CampaignBinding,
 *   targetBinding:CampaignBinding,
 *   sameSeedSample:unknown,
 * }} PreviewCoreInput
 * @typedef {{
 *   schemaVersion:number,
 *   plan:CampaignContentChangePlan,
 *   definitionChanges:ReadonlyArray<DefinitionChange>,
 *   environmentChanges:ReadonlyArray<unknown>,
 *   sameSeedSample:Readonly<ContentRecord>|null,
 * }} PreviewCore
 * @typedef {{
 *   campaignId?:unknown,
 *   authorityKey?:unknown,
 *   currentBinding:unknown,
 *   contentBindingHistory?:unknown,
 *   targetBinding:unknown,
 *   sameSeedSample?:unknown,
 *   kind?:string,
 * }} CampaignContentPreviewInput
 * @typedef {{
 *   campaignId?:unknown,
 *   authorityKey?:unknown,
 *   currentBinding:unknown,
 *   contentBindingHistory?:unknown,
 *   preview:unknown,
 * }} CampaignContentApplyInput
 */

/**
 * @param {CampaignBinding} beforeBinding
 * @param {CampaignBinding} afterBinding
 * @returns {DefinitionChange[]}
 */
function definitionChanges(beforeBinding, afterBinding) {
  const before = new Map(beforeBinding.resolvedDefinitions.map(entry => [
    entry.definitionId,
    entry,
  ]));
  const after = new Map(afterBinding.resolvedDefinitions.map(entry => [
    entry.definitionId,
    entry,
  ]));
  const definitionIds = [...new Set([
    ...before.keys(),
    ...after.keys(),
  ])].sort(compareCodepoint);
  return definitionIds.flatMap((definitionId) => {
    const prior = before.get(definitionId) || null;
    const next = after.get(definitionId) || null;
    if (prior?.contentHash === next?.contentHash) return [];
    return [Object.freeze({
      definitionId,
      category: next?.category || prior?.category || null,
      change: prior == null
        ? 'added'
        : next == null
          ? 'removed'
          : 'revision-changed',
      beforeRevisionId: prior?.revisionId || null,
      afterRevisionId: next?.revisionId || null,
      beforeContentHash: prior?.contentHash || null,
      afterContentHash: next?.contentHash || null,
    })];
  });
}

/**
 * @param {PreviewCoreInput} input
 * @returns {PreviewCore}
 */
function previewCore({
  campaignId,
  authorityKey,
  kind,
  currentBinding,
  targetBinding,
  sameSeedSample,
}) {
  const detachedSample = sameSeedSample == null
    ? null
    : detachContentJson(sameSeedSample);
  if (detachedSample != null && !isPlainContentRecord(detachedSample)) {
    throw new TypeError('sameSeedSample must be an object or null.');
  }
  const sample = detachedSample == null
    ? null
    : /** @type {ContentRecord} */ (detachedSample);
  const plan = Object.freeze({
    schemaVersion: CAMPAIGN_CONTENT_CHANGE_SCHEMA_VERSION,
    campaignId: String(campaignId || ''),
    authorityKey: authorityKey == null ? null : String(authorityKey),
    kind,
    expectedBindingHash: currentBinding.bindingHash,
    targetBinding,
    targetBindingHash: targetBinding.bindingHash,
    sampleSeed: typeof sample?.seed === 'string' ? sample.seed : null,
    sampleFingerprint: sample == null ? null : fingerprintContent(sample),
  });
  return {
    schemaVersion: CAMPAIGN_CONTENT_CHANGE_SCHEMA_VERSION,
    plan,
    definitionChanges: Object.freeze(
      definitionChanges(currentBinding, targetBinding),
    ),
    environmentChanges: diffContentEnvironmentRevisions(
      currentBinding.environment,
      targetBinding.environment,
    ),
    sameSeedSample: sample == null ? null : Object.freeze(sample),
  };
}

/**
 * Build the deterministic review receipt for a migration or rollback.
 *
 * The same-seed sample is evidence, not authority. Its fingerprint travels in
 * the plan so apply can prove it is activating the exact binding the user
 * reviewed without re-running generation under a possibly newer client.
 *
 * @param {CampaignContentPreviewInput} input
 */
export function previewCampaignContentBindingChange({
  campaignId,
  authorityKey = null,
  currentBinding,
  contentBindingHistory = [],
  targetBinding,
  sameSeedSample = null,
  kind = 'campaign.content-binding.migrate',
}) {
  try {
    if (!CHANGE_KINDS.has(kind)) {
      return { ok: false, reason: 'campaign_content_change_kind_unsupported' };
    }
    const changeKind = /** @type {CampaignContentChangeKind} */ (kind);
    const current = requireCampaignContentBinding(
      currentBinding,
      'currentBinding',
    );
    const target = requireCampaignContentBinding(
      targetBinding,
      'targetBinding',
    );
    const admittedHistory = admitCampaignContentBindingHistory(
      contentBindingHistory,
    );
    if (!admittedHistory.ok) return admittedHistory;
    if (current.bindingHash === target.bindingHash) {
      return { ok: false, reason: 'campaign_content_binding_already_active' };
    }
    if (
      changeKind === 'campaign.content-binding.rollback'
      && !admittedHistory.history.some(binding => (
        binding.bindingHash === target.bindingHash
      ))
    ) {
      return {
        ok: false,
        reason: 'campaign_content_rollback_target_unavailable',
      };
    }
    const core = previewCore({
      campaignId,
      authorityKey,
      kind: changeKind,
      currentBinding: current,
      targetBinding: target,
      sameSeedSample,
    });
    return Object.freeze({
      ok: true,
      ...core,
      previewFingerprint: fingerprintContent(core),
    });
  } catch (error) {
    return {
      ok: false,
      reason: 'campaign_content_change_invalid',
      message: error instanceof Error
        ? error.message
        : 'Campaign content change is invalid.',
    };
  }
}

/**
 * Re-admit a review receipt and apply it against the current binding hash.
 *
 * @param {CampaignContentApplyInput} input
 */
export function applyReviewedCampaignContentBindingChange({
  campaignId,
  authorityKey = null,
  currentBinding,
  contentBindingHistory = [],
  preview,
}) {
  try {
    if (!isPlainContentRecord(preview) || preview.ok !== true) {
      return { ok: false, status: 'failed', reason: 'campaign_content_preview_invalid' };
    }
    const plan = preview.plan;
    if (
      !isPlainContentRecord(plan)
      || plan.schemaVersion !== CAMPAIGN_CONTENT_CHANGE_SCHEMA_VERSION
      || typeof plan.kind !== 'string'
      || !CHANGE_KINDS.has(plan.kind)
      || String(plan.campaignId || '') !== String(campaignId || '')
    ) {
      return { ok: false, status: 'failed', reason: 'campaign_content_preview_invalid' };
    }
    const planKind = /** @type {CampaignContentChangeKind} */ (plan.kind);
    if (
      plan.authorityKey !== (
        authorityKey == null ? null : String(authorityKey)
      )
    ) {
      return {
        ok: false,
        status: 'stale',
        reason: 'campaign_content_authority_stale',
      };
    }
    const current = requireCampaignContentBinding(
      currentBinding,
      'currentBinding',
    );
    if (current.bindingHash !== plan.expectedBindingHash) {
      return { ok: false, status: 'stale', reason: 'campaign_content_binding_stale' };
    }
    const target = requireCampaignContentBinding(
      plan.targetBinding,
      'targetBinding',
    );
    if (target.bindingHash !== plan.targetBindingHash) {
      return { ok: false, status: 'failed', reason: 'campaign_content_target_hash_mismatch' };
    }
    const admittedHistory = admitCampaignContentBindingHistory(
      contentBindingHistory,
    );
    if (!admittedHistory.ok) {
      return {
        ok: false,
        status: 'failed',
        reason: admittedHistory.reason,
      };
    }
    if (
      planKind === 'campaign.content-binding.rollback'
      && !admittedHistory.history.some(binding => (
        binding.bindingHash === target.bindingHash
      ))
    ) {
      return {
        ok: false,
        status: 'stale',
        reason: 'campaign_content_rollback_target_unavailable',
      };
    }
    const expectedCore = previewCore({
      campaignId,
      authorityKey,
      kind: planKind,
      currentBinding: current,
      targetBinding: target,
      sameSeedSample: preview.sameSeedSample,
    });
    if (
      preview.previewFingerprint !== fingerprintContent(expectedCore)
      || canonicalContentJson({
        schemaVersion: preview.schemaVersion,
        plan: preview.plan,
        definitionChanges: preview.definitionChanges,
        environmentChanges: preview.environmentChanges,
        sameSeedSample: preview.sameSeedSample,
      }) !== canonicalContentJson(expectedCore)
    ) {
      return { ok: false, status: 'stale', reason: 'campaign_content_preview_stale' };
    }

    const history = [...admittedHistory.history];
    for (const binding of [current, target]) {
      if (!history.some(entry => entry.bindingHash === binding.bindingHash)) {
        history.push(binding);
      }
    }
    if (history.length > MAX_CAMPAIGN_CONTENT_BINDING_REVISIONS) {
      return {
        ok: false,
        status: 'failed',
        reason: 'campaign_content_history_limit_exceeded',
      };
    }
    const nextHistory = admitCampaignContentBindingHistory(history);
    if (!nextHistory.ok) {
      return {
        ok: false,
        status: 'failed',
        reason: nextHistory.reason,
      };
    }
    return Object.freeze({
      ok: true,
      status: 'applied',
      binding: target,
      history: nextHistory.history,
      previousBindingHash: current.bindingHash,
      bindingHash: target.bindingHash,
      previewFingerprint: preview.previewFingerprint,
    });
  } catch (error) {
    return {
      ok: false,
      status: 'failed',
      reason: 'campaign_content_change_invalid',
      message: error instanceof Error
        ? error.message
        : 'Campaign content change is invalid.',
    };
  }
}
