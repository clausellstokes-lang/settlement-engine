/**
 * Private, bounded reopen recovery for structured-import review sessions.
 *
 * The source export and normalized settlement entries never enter this cache.
 * A record contains only source identity, explicit decisions, target ids, and a
 * redacted command receipt. Reopening therefore requires the user to select the
 * same export again; its checksum reconstructs the deterministic proposals,
 * after which these decisions and durable command ids can be admitted.
 */

import {
  admitReconciliationSession,
  decideImportProposal,
} from './importReconciliationSession.js';
import {
  cleanText,
  deepFreeze,
  detachedRecord,
  isRecord,
  reconciliationStableToken,
  sourceIdOf,
} from './importReconciliationShared.js';

const RECOVERY_SCHEMA_VERSION = 2;
const RECOVERY_KEY_PREFIX = 'sf_import_reconciliation_recovery_v2:';
const MAX_RECOVERY_RECORDS = 12;
const MAX_RECOVERY_BYTES = 128 * 1024;

function storageFor(ownerId) {
  const owner = cleanText(ownerId);
  if (!owner || typeof localStorage === 'undefined') return null;
  return {
    key: `${RECOVERY_KEY_PREFIX}${reconciliationStableToken(owner)}`,
    ownerFingerprint: reconciliationStableToken(`owner:${owner}`),
  };
}

function readRecords(storage) {
  if (!storage) return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(storage.key) || '[]');
    return Array.isArray(parsed) ? parsed.filter(isRecord) : [];
  } catch {
    return [];
  }
}

function safeTargets(value) {
  const targets = isRecord(value) ? value : {};
  return {
    campaignId: sourceIdOf(targets.campaignId),
    saveId: sourceIdOf(targets.saveId),
    draftId: cleanText(targets.draftId) || null,
  };
}

function safePersistence(value) {
  return isRecord(value) && cleanText(value.state)
    ? { state: cleanText(value.state) }
    : { state: 'unknown' };
}

function safeDomainResult(value) {
  if (!isRecord(value)) return null;
  const result = {
    mode: cleanText(value.mode) || null,
    projection: cleanText(value.projection) || null,
    replayed: value.replayed === true,
    fingerprint: cleanText(value.fingerprint) || null,
    saveId: sourceIdOf(value.saveId),
    campaignId: sourceIdOf(value.campaignId),
    membershipPolicy: cleanText(value.membershipPolicy) || null,
  };
  if (isRecord(value.receipt)) {
    result.receipt = {
      importSessionId: cleanText(value.receipt.importSessionId) || null,
      sourceChecksum: cleanText(value.receipt.sourceChecksum) || null,
      kind: cleanText(value.receipt.kind) || null,
      campaignId: sourceIdOf(value.receipt.campaignId),
      saveId: sourceIdOf(value.receipt.saveId),
      membershipPolicy: cleanText(value.receipt.membershipPolicy) || null,
      previousCampaignIds: Array.isArray(value.receipt.previousCampaignIds)
        ? value.receipt.previousCampaignIds.map(sourceIdOf).filter(Boolean)
        : [],
      affectedCampaignIds: Array.isArray(value.receipt.affectedCampaignIds)
        ? value.receipt.affectedCampaignIds.map(sourceIdOf).filter(Boolean)
        : [],
      created: value.receipt.created === true,
      appliedAt: cleanText(value.receipt.appliedAt) || null,
    };
  }
  return result;
}

function safeCommandReceipt(value) {
  const command = isRecord(value) ? value : {};
  return {
    commandId: cleanText(command.commandId) || null,
    kind: cleanText(command.kind) || null,
    status: cleanText(command.status) || 'failed',
    ok: command.ok === true,
    reason: cleanText(command.reason) || null,
    needsReconciliation: command.needsReconciliation === true,
    replayed: command.replayed === true,
    attempt: Math.max(0, Number(command.attempt) || 0),
    targets: safeTargets(command.targets),
    persistence: safePersistence(command.persistence),
    result: safeDomainResult(command.result),
    transitions: Array.isArray(command.transitions)
      ? command.transitions.slice(-12).map(transition => ({
          status: cleanText(transition?.status) || 'unknown',
          at: cleanText(transition?.at) || null,
          reason: cleanText(transition?.reason) || null,
        }))
      : [],
  };
}

function safeApplicationReceipt(receipt) {
  if (!isRecord(receipt)) return null;
  const recovery = isRecord(receipt.recovery) ? receipt.recovery : {};
  return {
    schemaVersion: 1,
    receiptId: cleanText(receipt.receiptId) || null,
    sessionId: cleanText(receipt.sessionId) || null,
    sourceChecksum: cleanText(receipt.sourceChecksum) || null,
    status: receipt.status === 'applied' ? 'applied' : 'failed_reconcilable',
    ok: receipt.ok === true,
    attemptedAt: cleanText(receipt.attemptedAt) || null,
    decisionCounts: isRecord(receipt.decisionCounts)
      ? detachedRecord(receipt.decisionCounts)
      : {},
    commandReceipts: Array.isArray(receipt.commandReceipts)
      ? receipt.commandReceipts.map(command => ({
          draftId: cleanText(command?.draftId),
          proposalId: cleanText(command?.proposalId),
          attempt: Math.max(0, Number(command?.attempt) || 0),
          status: cleanText(command?.status) || 'failed',
          ok: command?.ok === true,
          needsReconciliation: command?.needsReconciliation === true,
          reason: cleanText(command?.reason) || null,
          commandReceipt: safeCommandReceipt(command?.commandReceipt),
        }))
      : [],
    failures: Array.isArray(receipt.failures)
      ? receipt.failures.map(failure => ({
          draftId: cleanText(failure?.draftId),
          proposalId: cleanText(failure?.proposalId),
          status: cleanText(failure?.status) || 'failed',
          reason: cleanText(failure?.reason) || null,
          needsReconciliation: failure?.needsReconciliation === true,
        }))
      : [],
    recovery: {
      kind: 'import-reconciliation-session',
      sessionId: cleanText(recovery.sessionId) || null,
      sourceChecksum: cleanText(recovery.sourceChecksum) || null,
      pendingDraftIds: Array.isArray(recovery.pendingDraftIds)
        ? recovery.pendingDraftIds.map(cleanText).filter(Boolean)
        : [],
    },
  };
}

function decisionsFrom(session) {
  return (session.proposals || [])
    .filter(proposal => isRecord(proposal.decision))
    .map(proposal => ({
      proposalId: proposal.proposalId,
      action: proposal.decision.action,
      targetSaveId: proposal.decision.targetSaveId,
      actor: proposal.decision.actor,
      decidedAt: proposal.decision.decidedAt,
    }));
}

function reviewedDraftsFrom(session) {
  return (session.commandDrafts || []).map(draft => ({
    draftId: cleanText(draft?.draftId) || null,
    proposalId: cleanText(draft?.proposalId) || null,
    kind: cleanText(draft?.kind) || null,
    executable: draft?.executable === true,
    targets: safeTargets(draft?.targets),
    expectedMembershipCampaignIds: Array.isArray(
      draft?.expected?.membershipCampaignIds,
    )
      ? draft.expected.membershipCampaignIds.map(sourceIdOf).filter(Boolean).sort()
      : [],
  }));
}

function reviewedDraftsEqual(left, right) {
  try {
    return JSON.stringify(reviewedDraftsFrom(left)) === JSON.stringify(
      Array.isArray(right) ? right : [],
    );
  } catch {
    return false;
  }
}

/**
 * Persist one source-free recovery record and evict older siblings.
 */
export function persistImportReconciliationRecovery(
  session,
  ownerId,
  { receipt = session?.applicationReceipt || null, updatedAt = null } = {},
) {
  const admission = admitReconciliationSession(session);
  const storage = storageFor(ownerId);
  if (admission.ok !== true || !storage) return null;
  const current = admission.value;
  const record = {
    schemaVersion: RECOVERY_SCHEMA_VERSION,
    recoveryId: `irr:${reconciliationStableToken(
      `${current.sessionId}:${storage.ownerFingerprint}`,
    )}`,
    ownerFingerprint: storage.ownerFingerprint,
    sessionId: current.sessionId,
    sourceChecksum: current.source.checksum,
    targetCampaignId: current.scope.targetCampaignId,
    sourceCampaignChoiceId: current.scope.sourceCampaignChoiceId,
    stage: current.stage,
    decisions: decisionsFrom(current),
    reviewedDrafts: reviewedDraftsFrom(current),
    receipt: safeApplicationReceipt(receipt),
    updatedAt: cleanText(updatedAt) || new Date().toISOString(),
  };
  let encoded = JSON.stringify(record);
  if (encoded.length > MAX_RECOVERY_BYTES) {
    // Preserve decision/reopen identity and the minimal per-command authority
    // when verbose transition history exceeds the strict private-cache bound.
    if (record.receipt) {
      record.receipt.commandReceipts = record.receipt.commandReceipts.map(command => ({
        ...command,
        commandReceipt: {
          ...command.commandReceipt,
          transitions: [],
          result: null,
        },
      }));
    }
    encoded = JSON.stringify(record);
  }
  if (encoded.length > MAX_RECOVERY_BYTES) return null;

  const next = readRecords(storage)
    .filter(candidate => (
      candidate.sessionId !== record.sessionId
      || candidate.sourceChecksum !== record.sourceChecksum
    ));
  next.unshift(record);
  try {
    localStorage.setItem(
      storage.key,
      JSON.stringify(next.slice(0, MAX_RECOVERY_RECORDS)),
    );
    return deepFreeze(detachedRecord(record));
  } catch {
    return null;
  }
}

/**
 * A recovered receipt may be attached only to the exact plan it originally
 * governed. In particular, a campaign-membership change after a lost response
 * must not turn an old unknown command into a newly reviewed rehome.
 */
export function importRecoveryPlanMatchesSession(session, recovery) {
  const admission = admitReconciliationSession(session);
  if (admission.ok !== true || admission.value.stage === 'reconciling') {
    return false;
  }
  return reviewedDraftsEqual(admission.value, recovery?.reviewedDrafts);
}

/**
 * Load one exact owner/source/target recovery record.
 */
export function loadImportReconciliationRecovery({
  ownerId,
  sessionId,
  sourceChecksum,
  targetCampaignId,
}) {
  const storage = storageFor(ownerId);
  if (!storage) return null;
  const record = readRecords(storage).find(candidate => (
    candidate.schemaVersion === RECOVERY_SCHEMA_VERSION
    && candidate.ownerFingerprint === storage.ownerFingerprint
    && candidate.sessionId === sessionId
    && candidate.sourceChecksum === sourceChecksum
    && candidate.targetCampaignId === targetCampaignId
    && Array.isArray(candidate.decisions)
    && Array.isArray(candidate.reviewedDrafts)
    && (
      candidate.receipt == null
      || isRecord(candidate.receipt)
    )
  ));
  if (!record) return null;
  try {
    return deepFreeze(detachedRecord(record));
  } catch {
    return null;
  }
}

/**
 * Reapply only still-valid explicit decisions to a freshly admitted session.
 * Candidate drift is skipped, never coerced into a different match.
 */
export function restoreImportReconciliationDecisions(session, recovery) {
  let current = session;
  const restoredProposalIds = [];
  const skippedProposalIds = [];
  for (const decision of Array.isArray(recovery?.decisions)
    ? recovery.decisions
    : []) {
    try {
      const before = current;
      current = decideImportProposal(current, decision.proposalId, {
        action: decision.action,
        targetSaveId: decision.targetSaveId,
        actor: decision.actor || 'user',
        decidedAt: decision.decidedAt || null,
      });
      if (current === before) skippedProposalIds.push(decision.proposalId);
      else restoredProposalIds.push(decision.proposalId);
    } catch {
      skippedProposalIds.push(decision.proposalId);
    }
  }
  return {
    session: current,
    receipt: safeApplicationReceipt(recovery?.receipt),
    restoredProposalIds,
    skippedProposalIds,
    recoveryId: cleanText(recovery?.recoveryId) || null,
  };
}

/**
 * Return a source-free JSON receipt suitable for a user-requested download.
 */
export function serializeImportReconciliationRecovery(record) {
  if (!isRecord(record)) return null;
  try {
    const detached = detachedRecord(record);
    const encoded = JSON.stringify(detached, null, 2);
    return encoded.length <= MAX_RECOVERY_BYTES ? encoded : null;
  } catch {
    return null;
  }
}
