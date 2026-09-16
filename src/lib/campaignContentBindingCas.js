/**
 * Canonical campaign-content binding compare-and-swap command.
 *
 * This module is transport-free. It constructs the exact fingerprinted payload
 * shared by the browser and PostgreSQL, admits server receipts before they can
 * influence store state, and supplies the local fallback with the same
 * compare/apply semantics. The campaign remains the only binding truth; there
 * is no client-side or server-side shadow binding record.
 */

import {
  admitCampaignContentBinding,
} from '../domain/content/campaignContentBinding.js';
import {
  admitCampaignContentBindingHistory,
} from '../domain/content/campaignContentBindingHistory.js';
import {
  canonicalContentJson,
  fingerprintContent,
  isPlainContentRecord,
} from '../domain/content/contentFingerprint.js';

export const CAMPAIGN_CONTENT_BINDING_CAS_SCHEMA_VERSION = 1;
export const CAMPAIGN_CONTENT_BINDING_CAS_KIND =
  'campaign.content-binding.cas';

const SHA256_RE = /^[0-9a-f]{64}$/;

function requiredSha256(value, field) {
  const hash = String(value || '');
  if (!SHA256_RE.test(hash)) {
    throw new TypeError(`${field} must be a lowercase SHA-256 fingerprint.`);
  }
  return hash;
}

function requiredText(value, field) {
  const text = String(value || '').trim();
  if (!text || text.length > 240) {
    throw new TypeError(`${field} is invalid.`);
  }
  return text;
}

/**
 * Build the command identity submitted to the saved-map CAS RPC.
 */
export function makeCampaignContentBindingCasCommand({
  campaignId,
  expectedBindingHash,
  targetBinding,
  contentBindingHistory,
  previewFingerprint,
}) {
  const admittedTarget = admitCampaignContentBinding(targetBinding);
  if (!admittedTarget.ok) {
    throw new TypeError(
      admittedTarget.message
      || admittedTarget.reason
      || 'Target campaign content binding is invalid.',
    );
  }
  const admittedHistory = admitCampaignContentBindingHistory(
    contentBindingHistory,
  );
  if (!admittedHistory.ok) {
    throw new TypeError(
      admittedHistory.message
      || admittedHistory.reason
      || 'Campaign content binding history is invalid.',
    );
  }
  const core = Object.freeze({
    schemaVersion: CAMPAIGN_CONTENT_BINDING_CAS_SCHEMA_VERSION,
    kind: CAMPAIGN_CONTENT_BINDING_CAS_KIND,
    campaignId: requiredText(campaignId, 'campaignId'),
    expectedBindingHash: requiredSha256(
      expectedBindingHash,
      'expectedBindingHash',
    ),
    targetBinding: admittedTarget.binding,
    contentBindingHistory: admittedHistory.history,
  });
  const fingerprint = fingerprintContent(core);
  const reviewHash = requiredSha256(
    previewFingerprint,
    'previewFingerprint',
  );
  return Object.freeze({
    ...core,
    fingerprint,
    commandId: `campaign-content-binding:${reviewHash}`,
  });
}

function admittedRemoteState(value) {
  if (value == null || value.remoteBinding == null) {
    return {
      binding: null,
      history: Object.freeze([]),
    };
  }
  const binding = admitCampaignContentBinding(value.remoteBinding);
  const history = admitCampaignContentBindingHistory(
    value.remoteBindingHistory || [],
  );
  if (!binding.ok || !history.ok) {
    throw new TypeError(
      'The campaign content conflict receipt contains invalid remote state.',
    );
  }
  return {
    binding: binding.binding,
    history: history.history,
  };
}

/**
 * Admit the RPC result before the store treats it as durable truth.
 */
export function admitCampaignContentBindingCasReceipt(value, command) {
  if (!isPlainContentRecord(value)) {
    throw new TypeError('Campaign content persistence returned no receipt.');
  }
  const receipt = value;
  if (
    receipt.schemaVersion !== CAMPAIGN_CONTENT_BINDING_CAS_SCHEMA_VERSION
    || receipt.commandId !== command.commandId
    || receipt.fingerprint !== command.fingerprint
    || String(receipt.campaignId || '') !== command.campaignId
  ) {
    throw new TypeError('Campaign content persistence returned a mismatched receipt.');
  }

  if (receipt.status === 'applied') {
    if (
      receipt.bindingHash !== command.targetBinding.bindingHash
      || receipt.previousBindingHash !== command.expectedBindingHash
    ) {
      throw new TypeError(
        'Campaign content persistence confirmed a different binding.',
      );
    }
    return Object.freeze({
      ok: true,
      status: 'applied',
      replayed: receipt.replayed === true,
      commandId: command.commandId,
      fingerprint: command.fingerprint,
      campaignId: command.campaignId,
      previousBindingHash: command.expectedBindingHash,
      bindingHash: command.targetBinding.bindingHash,
      appliedAt: typeof receipt.appliedAt === 'string'
        ? receipt.appliedAt
        : null,
    });
  }

  if (receipt.status === 'stale') {
    const remote = admittedRemoteState(receipt);
    const actualBindingHash = typeof receipt.actualBindingHash === 'string'
      ? receipt.actualBindingHash
      : remote.binding?.bindingHash || null;
    if (
      remote.binding
      && actualBindingHash !== remote.binding.bindingHash
    ) {
      throw new TypeError(
        'Campaign content conflict receipt has a mismatched remote hash.',
      );
    }
    return Object.freeze({
      ok: false,
      status: 'stale',
      reason: String(
        receipt.reason || 'campaign_content_binding_conflict',
      ),
      replayed: receipt.replayed === true,
      commandId: command.commandId,
      fingerprint: command.fingerprint,
      campaignId: command.campaignId,
      expectedBindingHash: command.expectedBindingHash,
      actualBindingHash,
      remoteBinding: remote.binding,
      remoteBindingHistory: remote.history,
      observedAt: typeof receipt.observedAt === 'string'
        ? receipt.observedAt
        : null,
    });
  }

  return Object.freeze({
    ok: false,
    status: receipt.status === 'reconcile-required'
      ? 'reconcile-required'
      : 'failed',
    reason: String(
      receipt.reason || 'campaign_content_persistence_failed',
    ),
    replayed: receipt.replayed === true,
    commandId: command.commandId,
    fingerprint: command.fingerprint,
    campaignId: command.campaignId,
  });
}

function appliedReceipt(command, replayed, appliedAt = null) {
  return admitCampaignContentBindingCasReceipt({
    schemaVersion: CAMPAIGN_CONTENT_BINDING_CAS_SCHEMA_VERSION,
    status: 'applied',
    replayed,
    commandId: command.commandId,
    fingerprint: command.fingerprint,
    campaignId: command.campaignId,
    previousBindingHash: command.expectedBindingHash,
    bindingHash: command.targetBinding.bindingHash,
    appliedAt,
  }, command);
}

function historyExtendsWithoutRewrite(
  actualHistory,
  proposedHistory,
  actualBindingHash,
  targetBindingHash,
) {
  if (proposedHistory.length < actualHistory.length) return false;
  for (let index = 0; index < actualHistory.length; index += 1) {
    if (
      canonicalContentJson(actualHistory[index])
      !== canonicalContentJson(proposedHistory[index])
    ) {
      return false;
    }
  }
  return proposedHistory.slice(actualHistory.length).every(binding => (
    binding.bindingHash === actualBindingHash
    || binding.bindingHash === targetBindingHash
  ));
}

/**
 * Local fallback with the same binding-hash CAS semantics as PostgreSQL.
 *
 * The returned campaign list patches only binding-owned fields on the current
 * cached campaign, preserving unrelated edits made by another local context.
 */
export function applyLocalCampaignContentBindingCas(
  campaigns,
  command,
  appliedAt = new Date().toISOString(),
) {
  const list = Array.isArray(campaigns) ? campaigns : [];
  const index = list.findIndex(campaign => (
    String(campaign?.id || '') === command.campaignId
  ));
  if (index < 0) {
    return {
      campaigns: list,
      receipt: admitCampaignContentBindingCasReceipt({
        schemaVersion: CAMPAIGN_CONTENT_BINDING_CAS_SCHEMA_VERSION,
        status: 'failed',
        reason: 'campaign_content_campaign_unavailable',
        replayed: false,
        commandId: command.commandId,
        fingerprint: command.fingerprint,
        campaignId: command.campaignId,
      }, command),
    };
  }

  const current = list[index];
  const actualBinding = admitCampaignContentBinding(current?.contentBinding);
  const actualHistory = admitCampaignContentBindingHistory(
    current?.contentBindingHistory || [],
  );
  if (!actualBinding.ok || !actualHistory.ok) {
    throw new TypeError(
      'The cached campaign content binding failed admission.',
    );
  }
  if (
    actualBinding.binding.bindingHash !== command.expectedBindingHash
    && actualBinding.binding.bindingHash
      !== command.targetBinding.bindingHash
  ) {
    return {
      campaigns: list,
      receipt: admitCampaignContentBindingCasReceipt({
        schemaVersion: CAMPAIGN_CONTENT_BINDING_CAS_SCHEMA_VERSION,
        status: 'stale',
        reason: 'campaign_content_binding_conflict',
        replayed: false,
        commandId: command.commandId,
        fingerprint: command.fingerprint,
        campaignId: command.campaignId,
        actualBindingHash: actualBinding.binding.bindingHash,
        remoteBinding: actualBinding.binding,
        remoteBindingHistory: actualHistory.history,
        observedAt: appliedAt,
      }, command),
    };
  }
  if (!historyExtendsWithoutRewrite(
    actualHistory.history,
    command.contentBindingHistory,
    actualBinding.binding.bindingHash,
    command.targetBinding.bindingHash,
  )) {
    return {
      campaigns: list,
      receipt: admitCampaignContentBindingCasReceipt({
        schemaVersion: CAMPAIGN_CONTENT_BINDING_CAS_SCHEMA_VERSION,
        status: 'stale',
        reason: 'campaign_content_binding_history_conflict',
        replayed: false,
        commandId: command.commandId,
        fingerprint: command.fingerprint,
        campaignId: command.campaignId,
        actualBindingHash: actualBinding.binding.bindingHash,
        remoteBinding: actualBinding.binding,
        remoteBindingHistory: actualHistory.history,
        observedAt: appliedAt,
      }, command),
    };
  }
  if (actualBinding.binding.bindingHash === command.targetBinding.bindingHash) {
    return {
      campaigns: list,
      receipt: appliedReceipt(command, true, current.updatedAt || appliedAt),
    };
  }
  const nextCampaign = {
    ...current,
    contentBinding: command.targetBinding,
    contentBindingHistory: command.contentBindingHistory,
    contentBindingStatus: 'pinned',
    updatedAt: appliedAt,
    pendingSync: false,
  };
  const next = [...list];
  next[index] = nextCampaign;
  return {
    campaigns: next,
    receipt: appliedReceipt(command, false, appliedAt),
  };
}

/**
 * Exact equality helper used only by tests and transport diagnostics.
 */
export function sameCampaignContentBindingCasCommand(left, right) {
  return canonicalContentJson(left) === canonicalContentJson(right);
}
