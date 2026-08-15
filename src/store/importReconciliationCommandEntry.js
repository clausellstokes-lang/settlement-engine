/**
 * Lazy bridge from campaignSlice to the application command plane.
 *
 * Loading this module is the start of the command. It captures current owner
 * state, validates the reviewed context, and installs the transient lock
 * synchronously before its first await. The import surface therefore remains
 * lazy without opening a race between validation and transaction execution.
 */

let importReconciliationLockSequence = 0;

function refusal(draft, reason, status = 'failed') {
  return {
    kind: draft?.kind || null,
    status,
    ok: false,
    reason,
    needsReconciliation: false,
  };
}

export async function executeImportReconciliationDraftFromStore({
  set,
  get,
  draft,
  options,
}) {
  const state = get();
  const ownerId = state.auth?.user?.id == null
    ? null
    : String(state.auth.user.id);
  const campaignId = draft?.targets?.campaignId == null
    ? null
    : String(draft.targets.campaignId);
  const saveId = draft?.targets?.saveId == null
    ? null
    : String(draft.targets.saveId);
  const importSessionId = typeof options?.importSessionId === 'string'
    ? options.importSessionId.trim()
    : '';
  const sourceChecksum = typeof options?.sourceChecksum === 'string'
    ? options.sourceChecksum.trim()
    : '';
  if (!ownerId || !campaignId || !importSessionId || !sourceChecksum) {
    return refusal(draft, 'import_command_context_incomplete');
  }
  if (sourceChecksum !== draft?.expected?.sourceChecksum) {
    return refusal(draft, 'source_checksum_changed');
  }
  if (
    typeof state.getCampaignMutationBlock !== 'function'
    || typeof state.getSettlementDeletionBlock !== 'function'
  ) {
    return refusal(draft, 'import_lock_authority_unavailable');
  }

  const expectedCampaignIds = Array.isArray(
    draft?.expected?.membershipCampaignIds,
  )
    ? draft.expected.membershipCampaignIds.map(String)
    : [];
  const campaignIds = [...new Set([campaignId, ...expectedCampaignIds])];
  let blocked = null;
  for (const candidateId of campaignIds) {
    blocked = state.getCampaignMutationBlock(candidateId);
    if (blocked) break;
  }
  if (!blocked && saveId) {
    blocked = state.getSettlementDeletionBlock([saveId]);
  }
  if (blocked) {
    return refusal(draft, blocked.reason || 'import_target_busy');
  }

  const campaignGeneration = Number(state.campaignSessionGeneration) || 0;
  const token = `import-reconciliation-${++importReconciliationLockSequence}`;
  set((current) => {
    current.campaignMutationLocks = [
      ...(current.campaignMutationLocks || []),
      {
        token,
        campaignIds,
        settlementIds: saveId ? [saveId] : [],
        reason: 'import_reconciliation_in_flight',
        ownerId,
        generation: campaignGeneration,
      },
    ];
  });
  try {
    const [
      { runImportReconciliationCommand },
      { runImportReconciliationCommandTransaction },
    ] = await Promise.all([
      import('../application/commands/importReconciliationCommandRuntime.js'),
      import('./importReconciliationCommandTransaction.js'),
    ]);
    return await runImportReconciliationCommand(draft, {
      ownerId,
      importSessionId,
      sourceChecksum,
      journalScope: get,
      now: options?.requestedAt || new Date().toISOString(),
      reconcileDurable: options?.reconcileDurable === true,
      apply: command => runImportReconciliationCommandTransaction({
        set,
        get,
        command,
      }),
    });
  } finally {
    set((current) => {
      current.campaignMutationLocks = (
        current.campaignMutationLocks || []
      ).filter(lock => lock.token !== token);
    });
  }
}
