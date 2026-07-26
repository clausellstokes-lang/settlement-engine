/**
 * Application-command adapter for immutable custom-content writes.
 *
 * Every authoring surface reaches one action. The action may be backed by the
 * migration-185 transactional RPC or the local immutable ledger, but it must
 * report the persistence authority it actually obtained.
 */

import {
  commandIdForValue,
  makeCommandEnvelope,
} from '../commandEnvelope.js';
import {
  COMMAND_STATUS,
  PERSISTENCE_STATE,
} from '../commandReceipts.js';
import {
  CUSTOM_CONTENT_COMMAND_KIND,
  verifyCustomContentPreview,
} from '../../../domain/content/customContentCommands.js';

function validate(command) {
  if (!command.ownerRef?.accountId && !command.ownerRef?.ownerKey) {
    return { ok: false, reason: 'content_owner_required' };
  }
  if (
    typeof command.expected?.sourceFingerprint !== 'string'
    || !/^[0-9a-f]{64}$/.test(command.expected.sourceFingerprint)
  ) {
    return { ok: false, reason: 'content_preview_fingerprint_required' };
  }
  if (
    !command.params?.plan
    || !verifyCustomContentPreview(
      command.params.plan,
      command.expected.sourceFingerprint,
    )
  ) {
    return { ok: false, reason: 'content_preview_fingerprint_mismatch' };
  }
  if (command.params.plan.kind !== command.kind) {
    return { ok: false, reason: 'content_command_kind_mismatch' };
  }
  return { ok: true };
}

function preflight(_command, context) {
  return typeof context.actions?.applyCustomContentCommand === 'function'
    ? { ok: true }
    : { ok: false, reason: 'no_custom_content_command_writer' };
}

function persistenceState(outcome) {
  const state = outcome?.persistence?.state || outcome?.persistenceState;
  if (Object.values(PERSISTENCE_STATE).includes(state)) return state;
  return outcome?.status === COMMAND_STATUS.APPLIED
    ? PERSISTENCE_STATE.UNCONFIRMED
    : PERSISTENCE_STATE.NOT_REQUIRED;
}

async function apply(command, context) {
  const outcome = await context.actions.applyCustomContentCommand(command);
  const reportedStatus = Object.values(COMMAND_STATUS).includes(outcome?.status)
    ? outcome.status
    : null;
  const reportedPersistence = persistenceState(outcome);
  const confirmedApplied = outcome?.ok === true
    && reportedStatus === COMMAND_STATUS.APPLIED
    && reportedPersistence === PERSISTENCE_STATE.CONFIRMED;
  const ambiguousSuccess = !confirmedApplied && (
    reportedStatus === COMMAND_STATUS.APPLIED
    || outcome?.ok === true
    || outcome == null
  );
  const status = confirmedApplied
    ? COMMAND_STATUS.APPLIED
    : ambiguousSuccess
      ? COMMAND_STATUS.RECONCILE_REQUIRED
      : reportedStatus || COMMAND_STATUS.FAILED;
  const persistence = status === COMMAND_STATUS.RECONCILE_REQUIRED
    ? PERSISTENCE_STATE.UNCONFIRMED
    : reportedPersistence;
  return {
    // An immutable content write is successful only when the selected
    // persistence authority says so explicitly. Missing, contradictory, or
    // unconfirmed success-shaped receipts may follow a mutation; classifying
    // them as an ordinary failure would invite a duplicate retry.
    ok: confirmedApplied,
    status,
    reason: outcome?.reason || (
      status === COMMAND_STATUS.RECONCILE_REQUIRED
        ? 'custom_content_persistence_unconfirmed'
        : null
    ),
    result: outcome?.result || null,
    domainReceipt: outcome?.domainReceipt || null,
    needsReconciliation: status === COMMAND_STATUS.RECONCILE_REQUIRED,
    persistence: { state: persistence },
  };
}

function spec(kind, description, atomicity = 'server-atomic') {
  return Object.freeze({
    kind,
    description,
    targetScope: 'global',
    delivery: 'writer-routed',
    atomicity,
    surveyor: kind === CUSTOM_CONTENT_COMMAND_KIND.CREATE_REVISION,
    validate,
    preflight,
    apply,
  });
}

export const customContentCreateRevisionSpec = spec(
  CUSTOM_CONTENT_COMMAND_KIND.CREATE_REVISION,
  'Create a definition or append one immutable content revision.',
);
export const customContentArchiveSpec = spec(
  CUSTOM_CONTENT_COMMAND_KIND.ARCHIVE,
  'Archive a custom-content definition without deleting its revisions.',
);
export const customContentRestoreSpec = spec(
  CUSTOM_CONTENT_COMMAND_KIND.RESTORE,
  'Restore an archived custom-content definition.',
);
export const customContentPackImportSpec = spec(
  CUSTOM_CONTENT_COMMAND_KIND.PACK_IMPORT,
  'Import or update one validated content-pack version atomically.',
);
export const customContentEnvironmentMigrateSpec = spec(
  CUSTOM_CONTENT_COMMAND_KIND.ENVIRONMENT_MIGRATE,
  'Create and bind a reviewed immutable content-environment revision.',
);
export const customContentMassUpdateSpec = spec(
  CUSTOM_CONTENT_COMMAND_KIND.MASS_UPDATE,
  'Append a reviewed set of definition revisions atomically.',
);

export const customContentCommandSpecs = Object.freeze([
  customContentCreateRevisionSpec,
  customContentArchiveSpec,
  customContentRestoreSpec,
  customContentPackImportSpec,
  customContentEnvironmentMigrateSpec,
  customContentMassUpdateSpec,
]);

/**
 * Convert a reviewed preview into the generic immutable command envelope.
 */
export function customContentCommand(preview, context = {}) {
  const plan = preview?.plan || preview;
  const fingerprint = preview?.fingerprint || context.previewFingerprint;
  if (!plan || typeof plan !== 'object' || !fingerprint) {
    throw new TypeError('A reviewed custom-content command preview is required.');
  }
  const ownerIdentity = context.accountId || context.ownerKey;
  if (!ownerIdentity) throw new TypeError('A custom-content command owner is required.');
  const identity = {
    ownerIdentity: String(ownerIdentity),
    kind: plan.kind,
    previewFingerprint: fingerprint,
    definitionId: plan.definitionId
      || plan.entries?.[0]?.definitionId
      || null,
    packId: plan.pack?.packId || null,
    packVersion: plan.pack?.packVersion || null,
    environmentRevisionId: plan.environment?.environmentRevisionId || null,
  };
  const source = context.source || {};
  const provenance = source.type === 'surveyor'
    ? 'surveyor'
    : source.type === 'system'
      ? 'system'
      : 'manual';
  return makeCommandEnvelope({
    schemaVersion: 1,
    commandId: context.commandId
      || commandIdForValue('custom-content', identity),
    kind: plan.kind,
    provenance,
    ownerRef: context.accountId
      ? { accountId: String(context.accountId) }
      : { ownerKey: String(context.ownerKey) },
    targets: {
      draftId: source.ref ? String(source.ref) : null,
      campaignId: context.campaignId ? String(context.campaignId) : null,
    },
    expected: {
      ...(context.expected || {}),
      sourceFingerprint: fingerprint,
      revision: context.expected?.revision || null,
    },
    params: {
      plan,
      source,
    },
    correlation: {
      sourceType: source.type || 'manual',
      sourceRef: source.ref || null,
    },
    requestedAt: context.requestedAt || null,
  });
}
