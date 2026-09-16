/**
 * Preview and injected execution for an admitted reconciliation session.
 *
 * This module creates stable, JSON-only command drafts. It deliberately does
 * not import or register the application command executor: production
 * persistence must arrive through one narrow adapter owned by the store/runtime
 * boundary, while tests can exercise recovery with an injected executor.
 */

import {
  SUCCESSFUL_COMMAND_STATUSES,
  cleanText,
  deepFreeze,
  detachedRecord,
  isRecord,
  reconciliationStableToken,
} from './importReconciliationShared.js';
import {
  admitReconciliationSession,
  reconciliationDecisionSummary,
} from './importReconciliationSession.js';

function draftIdFor(proposal, decision) {
  return `ird:${reconciliationStableToken(
    `${proposal.proposalId}:${decision.action}:${decision.targetSaveId || 'new'}`,
  )}`;
}

function campaignsForSave(session, saveId) {
  return session.scope.existingMemberships.find(
    membership => membership.saveId === String(saveId),
  )?.campaigns || [];
}

function commandDraftFor(session, proposal) {
  const decision = proposal.decision;
  if (decision.action === 'create') {
    return {
      schemaVersion: 1,
      draftId: draftIdFor(proposal, decision),
      proposalId: proposal.proposalId,
      kind: 'import.settlement.create-and-attach',
      executable: true,
      targets: {
        campaignId: session.scope.targetCampaignId,
        saveId: null,
      },
      expected: {
        sourceChecksum: session.source.checksum,
        membershipCampaignIds: [],
      },
      params: {
        entry: proposal.normalizedInput,
        sourceClaimIds: proposal.claimIds,
        relationshipPolicy: 'defer',
        campaignStatePolicy: 'draft',
      },
    };
  }
  const currentCampaigns = campaignsForSave(session, decision.targetSaveId);
  const membershipCampaignIds = currentCampaigns
    .map(campaign => campaign.campaignId)
    .sort();
  const targetCampaignId = session.scope.targetCampaignId;
  const alreadyMember = membershipCampaignIds.includes(targetCampaignId);
  const exactMembership = (
    membershipCampaignIds.length === 1
    && alreadyMember
  );
  return {
    schemaVersion: 1,
    draftId: draftIdFor(proposal, decision),
    proposalId: proposal.proposalId,
    kind: 'import.campaign.attach-existing',
    executable: !exactMembership,
    targets: {
      campaignId: session.scope.targetCampaignId,
      saveId: decision.targetSaveId,
    },
    expected: {
      sourceChecksum: session.source.checksum,
      membershipCampaignIds,
    },
    params: {
      sourceClaimIds: proposal.claimIds,
      preserveExistingSettlement: true,
      membershipPolicy: 'exclusive-rehome',
    },
    ...(exactMembership ? { satisfiedBy: 'exact_existing_membership' } : {}),
  };
}

/**
 * Build the exact command plan and user-visible effect summary. No draft exists
 * for skip/defer, and matching never carries source settlement content: a match
 * preserves the existing target instead of becoming an implicit replacement.
 *
 * @param {unknown} session
 */
export function previewImportReconciliation(session) {
  const admission = admitReconciliationSession(session);
  if (admission.ok !== true) return admission;
  const current = admission.value;
  if (
    (current.stage !== 'reconciling' && current.stage !== 'previewed')
    || current.applicationReceipt
  ) {
    return {
      ok: false,
      code: 'application_already_started',
      error: 'This reconciliation has application receipts and cannot be re-planned.',
      value: current,
    };
  }
  const decisions = reconciliationDecisionSummary(current);
  if (decisions.undecided > 0) {
    return {
      ok: false,
      code: 'decisions_incomplete',
      error: `${decisions.undecided} settlement proposal${
        decisions.undecided === 1 ? ' still needs' : 's still need'
      } a decision.`,
      pendingProposalIds: current.proposals
        .filter(proposal => !proposal.decision)
        .map(proposal => proposal.proposalId),
      value: current,
    };
  }

  const actionable = current.proposals.filter(proposal => (
    proposal.decision.action === 'create' || proposal.decision.action === 'match'
  ));
  const commandDrafts = actionable.map(proposal => commandDraftFor(current, proposal));
  const membershipTransfers = commandDrafts
    .filter(draft => draft.kind === 'import.campaign.attach-existing')
    .map(draft => {
      const fromCampaigns = campaignsForSave(current, draft.targets.saveId)
        .filter(campaign => campaign.campaignId !== current.scope.targetCampaignId);
      return {
        proposalId: draft.proposalId,
        saveId: draft.targets.saveId,
        fromCampaigns,
        toCampaignId: current.scope.targetCampaignId,
      };
    })
    .filter(transfer => transfer.fromCampaigns.length > 0);
  const membershipsToAdd = commandDrafts.filter(draft => (
    draft.kind === 'import.settlement.create-and-attach'
    || (
      draft.kind === 'import.campaign.attach-existing'
      && !draft.expected.membershipCampaignIds.includes(current.scope.targetCampaignId)
    )
  )).length;
  const effects = {
    settlementsToCreate: decisions.create,
    existingSettlementsToReuse: decisions.match,
    membershipsToAdd,
    membershipsToRemove: membershipTransfers.reduce(
      (count, transfer) => count + transfer.fromCampaigns.length,
      0,
    ),
    settlementsToRehome: membershipTransfers.length,
    membershipsAlreadyPresent: commandDrafts.filter(draft => !draft.executable).length,
    skipped: decisions.skip,
    deferred: decisions.defer,
    relationshipsDeferred: current.unsupported.filter(
      issue => issue.code === 'relationships_deferred',
    ).length,
  };
  const preview = {
    epistemic: {
      class: 'bounded_projection',
      basis: 'structured_export_decisions_and_current_library',
      simulatesCommands: false,
    },
    decisionCounts: decisions,
    effects,
    membershipTransfers,
    conflictCount: current.conflicts.length,
    unresolvedConflictCount: current.conflicts.filter(conflict => !conflict.resolution).length,
    unsupportedCount: current.unsupported.length,
    commandDraftCount: commandDrafts.length,
    executableDraftCount: commandDrafts.filter(draft => draft.executable).length,
  };
  const value = deepFreeze(detachedRecord({
    ...current,
    stage: 'previewed',
    commandDrafts,
    preview,
    applicationReceipt: null,
  }));
  return { ok: true, value, preview: value.preview };
}

function commandReceiptSucceeded(receipt) {
  if (commandReceiptNeedsReconciliation(receipt)) return false;
  const status = cleanText(receipt?.status);
  return status
    ? SUCCESSFUL_COMMAND_STATUSES.has(status)
    : receipt?.ok === true;
}

function commandReceiptNeedsReconciliation(receipt) {
  return (
    receipt?.needsReconciliation === true
    || receipt?.status === 'reconcile_required'
  );
}

function normalizedDraftReceipt(draft, receipt, attempt) {
  const commandReceipt = isRecord(receipt)
    ? detachedRecord(receipt)
    : { status: 'failed', ok: false, reason: 'invalid_command_receipt' };
  return {
    draftId: draft.draftId,
    proposalId: draft.proposalId,
    attempt,
    status: cleanText(commandReceipt.status) || (
      commandReceipt.ok === true ? 'applied' : 'failed'
    ),
    ok: commandReceiptSucceeded(commandReceipt),
    needsReconciliation: commandReceiptNeedsReconciliation(commandReceipt),
    reason: cleanText(commandReceipt.reason) || null,
    commandReceipt,
  };
}

function noOpDraftReceipt(draft) {
  return {
    draftId: draft.draftId,
    proposalId: draft.proposalId,
    attempt: 0,
    status: 'applied',
    ok: true,
    needsReconciliation: false,
    reason: 'already_member',
    commandReceipt: {
      status: 'applied',
      ok: true,
      result: { effect: 'none', basis: draft.satisfiedBy },
    },
  };
}

function receiptFor(session, draftReceipts, attemptedAt) {
  const byDraft = new Map(draftReceipts.map(receipt => [receipt.draftId, receipt]));
  const failures = [];
  const pendingDraftIds = [];
  for (const draft of session.commandDrafts) {
    const receipt = byDraft.get(draft.draftId);
    if (!receipt || !receipt.ok) pendingDraftIds.push(draft.draftId);
    if (receipt && !receipt.ok) {
      failures.push({
        draftId: draft.draftId,
        proposalId: draft.proposalId,
        status: receipt.status,
        reason: receipt.reason,
        needsReconciliation: receipt.needsReconciliation,
      });
    }
  }
  const applied = failures.length === 0
    && pendingDraftIds.length === 0
    && draftReceipts.length === session.commandDrafts.length;
  return {
    schemaVersion: 1,
    receiptId: `receipt:${session.sessionId}`,
    sessionId: session.sessionId,
    sourceChecksum: session.source.checksum,
    status: applied ? 'applied' : 'failed_reconcilable',
    ok: applied,
    attemptedAt: cleanText(attemptedAt) || null,
    decisionCounts: session.preview.decisionCounts,
    commandReceipts: draftReceipts,
    failures,
    recovery: {
      kind: 'import-reconciliation-session',
      sessionId: session.sessionId,
      sourceChecksum: session.source.checksum,
      pendingDraftIds,
    },
  };
}

/**
 * Execute a previewed plan through an injected command-draft adapter.
 *
 * Successful prior receipts are never executed again. A reconcile-required
 * receipt is held unless the caller explicitly requests a durable replay check
 * and the receipt identifies one of this vertical's server-idempotent commands.
 * Ordinary known failures may be retried when this function is called again.
 *
 * @param {unknown} session
 * @param {{
 *   executeDraft?:(draft:object,options?:{reconcileDurable?:boolean})=>Promise<object>|object,
 *   priorReceipt?:object|null,
 *   attemptedAt?:string|null,
 *   reconcileDurable?:boolean,
 * }} [options]
 */
export async function applyImportReconciliation(session, options = {}) {
  const admission = admitReconciliationSession(session);
  if (admission.ok !== true) return admission;
  const current = admission.value;
  if (
    current.stage !== 'previewed'
    && current.stage !== 'failed_reconcilable'
    && current.stage !== 'applying'
  ) {
    return {
      ok: false,
      code: 'preview_required',
      error: 'Preview this reconciliation before applying it.',
      value: current,
    };
  }
  if (typeof options.executeDraft !== 'function') {
    return {
      ok: false,
      code: 'command_adapter_unavailable',
      error: 'No reconciliation command adapter is available; no changes were applied.',
      value: current,
    };
  }

  if (options.priorReceipt != null && !isRecord(options.priorReceipt)) {
    return {
      ok: false,
      code: 'prior_receipt_invalid',
      error: 'The supplied recovery receipt is malformed.',
      value: current,
    };
  }
  let prior = isRecord(options.priorReceipt)
    ? options.priorReceipt
    : current.applicationReceipt;
  if (
    isRecord(prior)
    && (
      prior.sessionId !== current.sessionId
      || prior.sourceChecksum !== current.source.checksum
    )
  ) {
    return {
      ok: false,
      code: 'prior_receipt_mismatch',
      error: 'The supplied recovery receipt belongs to a different import session.',
      value: current,
    };
  }
  if (isRecord(options.priorReceipt)) {
    const receiptAdmission = admitReconciliationSession({
      ...current,
      stage: options.priorReceipt.ok === true ? 'applied' : 'failed_reconcilable',
      applicationReceipt: options.priorReceipt,
    });
    if (receiptAdmission.ok !== true) {
      return {
        ok: false,
        code: 'prior_receipt_invalid',
        error: 'The supplied recovery receipt is malformed.',
        value: current,
      };
    }
    prior = receiptAdmission.value.applicationReceipt;
  }
  const priorReceipts = Array.isArray(prior?.commandReceipts)
    ? prior.commandReceipts
    : [];
  const byDraft = new Map(priorReceipts.map(receipt => [receipt.draftId, receipt]));
  const nextReceipts = [];

  for (const draft of current.commandDrafts) {
    const existing = byDraft.get(draft.draftId);
    const canCheckDurableOutcome = (
      options.reconcileDurable === true
      && commandReceiptNeedsReconciliation(existing)
      && cleanText(existing?.commandReceipt?.commandId)
      && (
        existing.commandReceipt.kind === 'import.settlement.create-and-attach'
        || existing.commandReceipt.kind === 'import.campaign.attach-existing'
      )
    );
    if (
      existing
      && (
        commandReceiptSucceeded(existing)
        || (
          commandReceiptNeedsReconciliation(existing)
          && !canCheckDurableOutcome
        )
      )
    ) {
      nextReceipts.push(existing);
      continue;
    }
    if (!draft.executable) {
      nextReceipts.push(noOpDraftReceipt(draft));
      continue;
    }
    const attempt = Math.max(0, Number(existing?.attempt) || 0) + 1;
    try {
      const receipt = await options.executeDraft(draft, {
        reconcileDurable: canCheckDurableOutcome,
      });
      nextReceipts.push(normalizedDraftReceipt(draft, receipt, attempt));
    } catch (error) {
      // A thrown adapter may have crossed a mutation seam. Hold it for
      // reconciliation, exactly as the application command executor does.
      nextReceipts.push(normalizedDraftReceipt(draft, {
        status: 'reconcile_required',
        ok: false,
        needsReconciliation: true,
        reason: error instanceof Error ? error.message : 'command_adapter_threw',
      }, attempt));
    }
  }

  const receipt = receiptFor(current, nextReceipts, options.attemptedAt);
  const value = deepFreeze(detachedRecord({
    ...current,
    stage: receipt.ok ? 'applied' : 'failed_reconcilable',
    applicationReceipt: receipt,
  }));
  return { ok: receipt.ok, value, receipt: value.applicationReceipt };
}
