/**
 * Session admission and explicit user decisions for import reconciliation.
 *
 * Keeping this separate from source parsing and command execution makes the
 * persisted/resumable session contract independently testable.
 */

import {
  IMPORT_RECONCILIATION_PARSER_VERSION,
  IMPORT_RECONCILIATION_SCHEMA_VERSION,
  RECONCILIATION_DECISION_SET,
  RECONCILIATION_STAGE_SET,
  cleanText,
  deepFreeze,
  detachedRecord,
  isRecord,
  reconciliationDiagnostic,
  sourceIdOf,
} from './importReconciliationShared.js';

/** @typedef {import('./importReconciliationTypes.js').ImportReconciliationDecision} ImportReconciliationDecision */
/** @typedef {import('./importReconciliationTypes.js').ImportReconciliationSession} ImportReconciliationSession */

const CANDIDATE_MATCH_CLASSES = new Set([
  'stable_source_id',
  'stable_import_provenance',
  'exact_name',
]);
const CANDIDATE_CONFIDENCE = new Set(['exact', 'candidate']);
const COMMAND_DRAFT_KINDS = new Set([
  'import.settlement.create-and-attach',
  'import.campaign.attach-existing',
]);

function isNullableText(value) {
  return value === null || typeof value === 'string';
}

function isStringArray(value) {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
}

function isNonNegativeNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function hasDecisionCounts(value) {
  return isRecord(value) && [
    'total',
    'undecided',
    'create',
    'match',
    'skip',
    'defer',
  ].every(field => isNonNegativeNumber(value[field]));
}

function hasNumericValues(value) {
  return isRecord(value) && Object.values(value).every(isNonNegativeNumber);
}

function hasCampaignMemberships(value) {
  return Array.isArray(value) && value.every(membership => (
    isRecord(membership)
    && Boolean(sourceIdOf(membership.saveId))
    && Array.isArray(membership.campaigns)
    && membership.campaigns.every(campaign => (
      isRecord(campaign)
      && Boolean(sourceIdOf(campaign.campaignId))
      && Boolean(cleanText(campaign.campaignName))
    ))
  ));
}

/**
 * @param {import('./importReconciliationTypes.js').ImportProposal} proposal
 * @param {unknown} decision
 * @returns {ImportReconciliationDecision}
 */
function checkedDecision(proposal, decision) {
  const decisionRecord = isRecord(decision) ? decision : null;
  const actionText = cleanText(
    typeof decision === 'string' ? decision : decisionRecord?.action,
  );
  if (!RECONCILIATION_DECISION_SET.has(actionText)) {
    throw new TypeError(`Unsupported reconciliation decision "${actionText || 'empty'}".`);
  }
  const action = /** @type {import('./importReconciliationTypes.js').ImportDecisionAction} */ (
    actionText
  );
  const targetSaveId = action === 'match'
    ? sourceIdOf(decisionRecord?.targetSaveId)
    : null;
  if (action === 'match') {
    if (!targetSaveId) throw new TypeError('A match decision requires targetSaveId.');
    if (!proposal.candidates.some(candidate => candidate.targetSaveId === targetSaveId)) {
      throw new TypeError('The selected match is not a candidate for this proposal.');
    }
  }
  return {
    action,
    targetSaveId,
    actor: cleanText(decisionRecord?.actor) || 'user',
    decidedAt: cleanText(decisionRecord?.decidedAt) || null,
  };
}

/**
 * Record one explicit create/match/skip/defer decision. Changing any decision
 * invalidates the prior preview and application receipt by construction.
 *
 * @param {unknown} session
 * @param {string} proposalId
 * @param {string|{action:string,targetSaveId?:unknown,actor?:unknown,decidedAt?:unknown}} decision
 */
export function decideImportProposal(session, proposalId, decision) {
  const admission = admitReconciliationSession(session);
  if (admission.ok !== true) return session;
  const current = admission.value;
  if (
    current.applicationReceipt
    || current.stage === 'applying'
    || current.stage === 'applied'
    || current.stage === 'failed_reconcilable'
  ) {
    throw new TypeError(
      'Applied or partially applied reconciliation decisions cannot be changed.',
    );
  }
  const proposal = current.proposals.find(item => item.proposalId === proposalId);
  if (!proposal) return session;
  const checked = checkedDecision(proposal, decision);
  return deepFreeze(detachedRecord({
    ...current,
    stage: 'reconciling',
    proposals: current.proposals.map(item => (
      item.proposalId === proposalId ? { ...item, decision: checked } : item
    )),
    conflicts: current.conflicts.map(conflict => (
      conflict.proposalId === proposalId
        ? {
            ...conflict,
            resolution: {
              action: checked.action,
              targetSaveId: checked.targetSaveId,
            },
          }
        : conflict
    )),
    commandDrafts: [],
    preview: null,
    applicationReceipt: null,
  }));
}

/** @param {unknown} session */
export function reconciliationDecisionSummary(session) {
  const counts = {
    total: 0,
    undecided: 0,
    create: 0,
    match: 0,
    skip: 0,
    defer: 0,
  };
  const proposals = isRecord(session) && Array.isArray(session.proposals)
    ? session.proposals
    : [];
  for (const proposal of proposals) {
    counts.total += 1;
    const action = isRecord(proposal) && isRecord(proposal.decision)
      ? cleanText(proposal.decision.action)
      : '';
    if (RECONCILIATION_DECISION_SET.has(action)) counts[action] += 1;
    else counts.undecided += 1;
  }
  return Object.freeze(counts);
}

/**
 * Runtime-admit a serialized reconciliation session or partial-result receipt.
 * This validates only reconciliation-owned fields instead of introducing a
 * universal parser framework.
 *
 * @param {unknown} value
 * @returns {
 *   | {ok:true,value:ImportReconciliationSession,diagnostic:Record<string, unknown>}
 *   | {ok:false,code:string,error:string,diagnostic:Record<string, unknown>}
 * }
 */
export function admitReconciliationSession(value) {
  try {
    if (!isRecord(value)) throw new TypeError('session_not_object');
    if (value.schemaVersion !== IMPORT_RECONCILIATION_SCHEMA_VERSION) {
      throw new TypeError('session_version_unsupported');
    }
    if (!cleanText(value.sessionId)) throw new TypeError('session_id_invalid');
    if (typeof value.stage !== 'string' || !RECONCILIATION_STAGE_SET.has(value.stage)) {
      throw new TypeError('session_stage_invalid');
    }
    if (
      !isRecord(value.source)
      || value.source.format !== 'settlementforge-account-export'
      || !Number.isInteger(value.source.envelopeVersion)
      || !isNonNegativeNumber(value.source.envelopeVersion)
      || value.source.parserVersion !== IMPORT_RECONCILIATION_PARSER_VERSION
      || !cleanText(value.source.checksum)
      || value.source.checksumAlgorithm !== 'fnv1a32+djb2+utf8-size'
      || !isNonNegativeNumber(value.source.sizeBytes)
      || !isNullableText(value.source.label)
      || !isNullableText(value.source.ingestedAt)
      || !isNullableText(value.source.storageRef)
    ) {
      throw new TypeError('session_source_invalid');
    }
    if (
      !isRecord(value.scope)
      || !sourceIdOf(value.scope.targetCampaignId)
      || !cleanText(value.scope.targetCampaignName)
      || !isStringArray(value.scope.targetMemberIds)
      || !hasCampaignMemberships(value.scope.existingMemberships)
      || !isNullableText(value.scope.sourceCampaignChoiceId)
      || !isNullableText(value.scope.sourceCampaignId)
      || !isNullableText(value.scope.sourceCampaignName)
    ) {
      throw new TypeError('session_target_invalid');
    }
    if (!Array.isArray(value.proposals)) throw new TypeError('session_proposals_invalid');
    if (!Array.isArray(value.claims)) throw new TypeError('session_claims_invalid');
    if (!Array.isArray(value.conflicts)) throw new TypeError('session_conflicts_invalid');
    if (!Array.isArray(value.unsupported)) throw new TypeError('session_unsupported_invalid');
    if (!Array.isArray(value.commandDrafts)) throw new TypeError('session_drafts_invalid');
    if (!value.claims.every(claim => (
      isRecord(claim)
      && Boolean(cleanText(claim.claimId))
      && Boolean(cleanText(claim.sourceLocation))
      && typeof claim.normalizedText === 'string'
      && Boolean(cleanText(claim.proposedKind))
      && Boolean(cleanText(claim.confidence))
      && Boolean(cleanText(claim.parserVersion))
    ))) {
      throw new TypeError('session_claims_invalid');
    }
    if (!value.conflicts.every(conflict => (
      isRecord(conflict)
      && Boolean(cleanText(conflict.conflictId))
      && Boolean(cleanText(conflict.proposalId))
      && Boolean(cleanText(conflict.code))
      && (
        conflict.resolution === null
        || (
          isRecord(conflict.resolution)
          && RECONCILIATION_DECISION_SET.has(cleanText(conflict.resolution.action))
          && isNullableText(conflict.resolution.targetSaveId)
        )
      )
    ))) {
      throw new TypeError('session_conflicts_invalid');
    }
    if (!value.unsupported.every(issue => (
      isRecord(issue)
      && Boolean(cleanText(issue.issueId))
      && Boolean(cleanText(issue.code))
      && Boolean(cleanText(issue.message))
    ))) {
      throw new TypeError('session_evidence_invalid');
    }

    const claimIds = new Set(value.claims.map(claim => claim.claimId));
    if (claimIds.size !== value.claims.length) throw new TypeError('claim_id_duplicate');
    const proposalIds = new Set();
    for (const proposal of value.proposals) {
      if (
        !isRecord(proposal)
        || !cleanText(proposal.proposalId)
        || !isStringArray(proposal.claimIds)
        || !proposal.claimIds.every(claimId => claimIds.has(claimId))
        || !Number.isInteger(proposal.sourceIndex)
        || !isNonNegativeNumber(proposal.sourceIndex)
        || !isNullableText(proposal.sourceSaveId)
        || !cleanText(proposal.sourceName)
        || !isNullableText(proposal.sourceTier)
        || !isStringArray(proposal.conflictIds)
        || !isStringArray(proposal.unsupportedIds)
      ) {
        throw new TypeError('proposal_invalid');
      }
      if (proposalIds.has(proposal.proposalId)) {
        throw new TypeError('proposal_id_duplicate');
      }
      proposalIds.add(proposal.proposalId);
      if (!isRecord(proposal.normalizedInput)) {
        throw new TypeError('proposal_input_invalid');
      }
      if (!Array.isArray(proposal.candidates)) {
        throw new TypeError('proposal_candidates_invalid');
      }
      if (!proposal.candidates.every(candidate => (
        isRecord(candidate)
        && Boolean(cleanText(candidate.candidateId))
        && Boolean(sourceIdOf(candidate.targetSaveId))
        && Boolean(cleanText(candidate.targetName))
        && CANDIDATE_MATCH_CLASSES.has(cleanText(candidate.matchClass))
        && CANDIDATE_CONFIDENCE.has(cleanText(candidate.confidence))
      ))) {
        throw new TypeError('proposal_candidate_invalid');
      }
      if (proposal.decision != null) {
        if (
          !isRecord(proposal.decision)
          || !cleanText(proposal.decision.actor)
          || !isNullableText(proposal.decision.decidedAt)
          || !isNullableText(proposal.decision.targetSaveId)
        ) {
          throw new TypeError('proposal_decision_invalid');
        }
        checkedDecision(
          /** @type {import('./importReconciliationTypes.js').ImportProposal} */ (proposal),
          proposal.decision,
        );
      }
    }

    const draftIds = new Set();
    for (const draft of value.commandDrafts) {
      if (
        !isRecord(draft)
        || !cleanText(draft.draftId)
        || !COMMAND_DRAFT_KINDS.has(cleanText(draft.kind))
        || typeof draft.executable !== 'boolean'
        || !isRecord(draft.targets)
        || !sourceIdOf(draft.targets.campaignId)
        || !isNullableText(draft.targets.saveId)
        || !isRecord(draft.expected)
        || !cleanText(draft.expected.sourceChecksum)
        || draft.expected.sourceChecksum !== value.source.checksum
        || !isStringArray(draft.expected.membershipCampaignIds)
        || !isRecord(draft.params)
      ) {
        throw new TypeError('command_draft_invalid');
      }
      if (draftIds.has(draft.draftId)) throw new TypeError('command_draft_id_duplicate');
      if (!proposalIds.has(draft.proposalId)) {
        throw new TypeError('command_draft_proposal_missing');
      }
      draftIds.add(draft.draftId);
    }

    if (
      value.preview != null
      && (
        !isRecord(value.preview)
        || !isRecord(value.preview.epistemic)
        || !hasDecisionCounts(value.preview.decisionCounts)
        || !hasNumericValues(value.preview.effects)
        || !Array.isArray(value.preview.membershipTransfers)
        || !value.preview.membershipTransfers.every(transfer => (
          isRecord(transfer)
          && Boolean(cleanText(transfer.proposalId))
          && Boolean(sourceIdOf(transfer.saveId))
          && Boolean(sourceIdOf(transfer.toCampaignId))
          && Array.isArray(transfer.fromCampaigns)
          && transfer.fromCampaigns.every(campaign => (
            isRecord(campaign)
            && Boolean(sourceIdOf(campaign.campaignId))
            && Boolean(cleanText(campaign.campaignName))
          ))
        ))
        || !isNonNegativeNumber(value.preview.conflictCount)
        || !isNonNegativeNumber(value.preview.unresolvedConflictCount)
        || !isNonNegativeNumber(value.preview.unsupportedCount)
        || !isNonNegativeNumber(value.preview.commandDraftCount)
        || !isNonNegativeNumber(value.preview.executableDraftCount)
      )
    ) {
      throw new TypeError('session_preview_invalid');
    }
    if (
      ['previewed', 'applying', 'applied', 'failed_reconcilable'].includes(value.stage)
      && !isRecord(value.preview)
    ) {
      throw new TypeError('session_preview_required');
    }
    const applicationReceipt = isRecord(value.applicationReceipt)
      ? value.applicationReceipt
      : null;
    const commandReceipts = applicationReceipt
      && Array.isArray(applicationReceipt.commandReceipts)
      ? applicationReceipt.commandReceipts
      : null;
    if (
      value.applicationReceipt != null
      && (
        !applicationReceipt
        || !commandReceipts
        || applicationReceipt.sessionId !== value.sessionId
        || applicationReceipt.sourceChecksum !== value.source.checksum
        || !hasDecisionCounts(applicationReceipt.decisionCounts)
        || !isRecord(applicationReceipt.recovery)
        || !Array.isArray(applicationReceipt.failures)
      )
    ) {
      throw new TypeError('session_receipt_invalid');
    }
    if (
      commandReceipts
      && !commandReceipts.every(receipt => (
        isRecord(receipt)
        && draftIds.has(receipt.draftId)
        && Boolean(cleanText(receipt.proposalId))
        && isNonNegativeNumber(receipt.attempt)
        && Boolean(cleanText(receipt.status))
        && typeof receipt.ok === 'boolean'
        && typeof receipt.needsReconciliation === 'boolean'
        && isNullableText(receipt.reason)
        && isRecord(receipt.commandReceipt)
      ))
    ) {
      throw new TypeError('session_command_receipts_invalid');
    }
    if (
      value.stage === 'reconciling'
      && (
        value.preview != null
        || value.commandDrafts.length > 0
        || value.applicationReceipt != null
      )
    ) {
      throw new TypeError('session_reconciling_state_invalid');
    }
    if (value.stage === 'previewed' && value.applicationReceipt != null) {
      throw new TypeError('session_previewed_receipt_invalid');
    }
    if (
      (value.stage === 'applied' || value.stage === 'failed_reconcilable')
      && !applicationReceipt
    ) {
      throw new TypeError('session_final_receipt_required');
    }
    if (
      value.stage === 'applied'
      && (
        applicationReceipt?.ok !== true
        || applicationReceipt?.status !== 'applied'
      )
    ) {
      throw new TypeError('session_applied_receipt_invalid');
    }
    if (
      value.stage === 'failed_reconcilable'
      && (
        applicationReceipt?.ok !== false
        || applicationReceipt?.status !== 'failed_reconcilable'
      )
    ) {
      throw new TypeError('session_failed_receipt_invalid');
    }

    const detached = detachedRecord(value);
    return {
      ok: true,
      value: deepFreeze(
        /** @type {ImportReconciliationSession} */ (/** @type {unknown} */ (detached)),
      ),
      diagnostic: reconciliationDiagnostic(
        'current',
        'session_admitted',
        'The reconciliation session was admitted.',
      ),
    };
  } catch (error) {
    const code = error instanceof Error ? error.message : 'session_invalid';
    return {
      ok: false,
      code,
      error: 'This reconciliation session is malformed or unsupported.',
      diagnostic: reconciliationDiagnostic(
        'rejected',
        code,
        'The reconciliation session was rejected.',
      ),
    };
  }
}
