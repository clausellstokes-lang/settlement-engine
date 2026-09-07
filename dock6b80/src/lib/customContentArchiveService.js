/**
 * Persistence facade for the canonical full-fidelity custom-content archive.
 *
 * The pure archive/remap modules own graph semantics. This module owns only the
 * authority split: an authenticated, server-atomic RPC in configured builds and
 * the mutex-protected immutable ledger in local/offline builds.
 */

import { supabase, isConfigured } from './supabase.js';
import {
  clearLocalCustomContentAfterArchive,
  clearLocalCustomContentArchivesAfterSnapshot,
  exportLocalCustomContentArchive,
  importLocalCustomContentArchive,
} from './customContentLocalLedger.js';
import {
  validateCustomContentArchive,
} from './customContentArchive.js';
import {
  prepareCustomContentArchiveImport,
} from './customContentArchiveImport.js';
import {
  fingerprintContent,
} from '../domain/content/contentFingerprint.js';

/** @param {unknown} error */
function isMissingArchiveSchema(error) {
  const record = error && typeof error === 'object'
    ? /** @type {Record<string, unknown>} */ (error)
    : {};
  return ['42P01', '42883', 'PGRST202', 'PGRST204', 'PGRST205']
    .includes(String(record.code || ''));
}

/** @param {unknown} error */
function archiveErrorRecord(error) {
  return error && typeof error === 'object'
    ? /** @type {Record<string, unknown>} */ (error)
    : {};
}

/**
 * A PostgreSQL/PostgREST refusal proves that its transaction did not commit.
 * Connection-class SQLSTATEs and transport/gateway failures remain ambiguous.
 *
 * @param {unknown} error
 * @param {unknown} status
 */
function isConfirmedArchiveRejection(error, status) {
  const record = archiveErrorRecord(error);
  const code = String(record.code || '').toUpperCase();
  if (isMissingArchiveSchema(error)) return true;
  // PGRST0xx is PostgREST's database-connection class. A gateway can lose
  // contact after dispatch, so those codes are not proof of rollback unless
  // the HTTP status itself is a definitive client refusal.
  if (/^PGRST[1-9][0-9]{2}$/.test(code)) return true;
  if (/^[0-9A-Z]{5}$/.test(code) && !code.startsWith('08')) return true;
  const httpStatus = Number(status || record.status || 0);
  return httpStatus >= 400 && httpStatus < 500;
}

/**
 * @param {unknown} error
 * @param {string} commandId
 * @param {ReturnType<typeof prepareCustomContentArchiveImport>} prepared
 * @param {'confirmed'|'unconfirmed'} persistenceState
 */
function archiveErrorReceipt(
  error,
  commandId,
  prepared,
  persistenceState,
) {
  const record = archiveErrorRecord(error);
  const schemaMissing = isMissingArchiveSchema(error);
  const code = schemaMissing
    ? 'custom_content_archive_schema_missing'
    : String(record.code || '').trim()
      || 'custom_content_archive_command_failed';
  const reason = schemaMissing
    ? 'Full custom-content archive persistence is not deployed.'
    : String(record.message || '').trim()
      || code;
  const confirmed = persistenceState === 'confirmed';
  return Object.freeze({
    ok: false,
    status: confirmed ? 'failed' : 'reconcile-required',
    commandId,
    code,
    reason,
    replayed: false,
    archiveFingerprint: prepared.archive.archiveFingerprint,
    identityMap: null,
    counts: null,
    persistence: Object.freeze({
      state: persistenceState,
      authority: 'supabase-transaction',
    }),
    needsReconciliation: !confirmed,
  });
}

/**
 * Resolve the authenticated cloud owner and fence an optional caller capture.
 *
 * @param {Record<string, any>} options
 */
async function archiveCloudOwner(options = {}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw Object.assign(new Error('Sign in to transfer custom content.'), {
      code: 'not_authenticated',
    });
  }
  if (
    options.ownerId
    && String(options.ownerId) !== String(user.id)
  ) {
    throw Object.assign(
      new Error('The signed-in account changed during custom-content transfer.'),
      { code: 'auth_session_changed' },
    );
  }
  return user;
}

/**
 * Keep cloud and local receipts structurally identical for account restore and
 * premium-cutover callers.
 *
 * @param {unknown} left
 * @param {unknown} right
 */
function sameContentValue(left, right) {
  try {
    return fingerprintContent(left) === fingerprintContent(right);
  } catch {
    return false;
  }
}

/**
 * @param {ReturnType<typeof prepareCustomContentArchiveImport>} prepared
 * @param {string} commandId
 */
function archiveReceiptExpectation(prepared, commandId) {
  return Object.freeze({
    commandId,
    fingerprint: prepared.fingerprint,
    archiveFingerprint: prepared.archive.archiveFingerprint,
    identityMap: prepared.identityMap,
    counts: Object.freeze({
      definitions: prepared.transfer.definitions.length,
      revisions: prepared.transfer.revisions.length,
      packs: prepared.transfer.packs.length,
      packVersions: prepared.transfer.packVersions.length,
      packEntries: prepared.transfer.packVersionEntries.length,
      environments: prepared.transfer.environments.length,
    }),
  });
}

/**
 * Keep cloud and local receipts structurally identical, then admit a claimed
 * success against the exact command and graph that were sent. A malformed
 * success response is ambiguous rather than a confirmed refusal: the
 * transaction may have committed before its receipt was corrupted or lost.
 *
 * @param {unknown} receipt
 * @param {string} authority
 * @param {ReturnType<typeof archiveReceiptExpectation>} expectation
 */
function normalizeArchiveReceipt(receipt, authority, expectation) {
  const record = receipt && typeof receipt === 'object'
    ? /** @type {Record<string, any>} */ (receipt)
    : {};
  const result = record.result && typeof record.result === 'object'
    ? record.result
    : {};
  const reportedStatus = typeof record.status === 'string'
    ? record.status
    : null;
  const field = key => record[key] ?? result[key] ?? null;
  const fieldValues = key => [record, result].flatMap(source => (
    Object.hasOwn(source, key) ? [source[key]] : []
  ));
  const everyFieldValue = (key, matches) => {
    const values = fieldValues(key);
    return values.length > 0 && values.every(matches);
  };
  const semanticReplayValues = fieldValues('semanticReplay');
  const semanticReplayValuesAgree = (
    semanticReplayValues.length === 0
    || (
      semanticReplayValues.every(value => typeof value === 'boolean')
      && semanticReplayValues.every(
        value => value === semanticReplayValues[0],
      )
    )
  );
  const semanticReplay = (
    semanticReplayValues.length > 0
    && semanticReplayValues.every(value => value === true)
  );
  const archiveIdentityMatches = everyFieldValue(
    'archiveFingerprint',
    value => (
      value === expectation.archiveFingerprint
      || (
        semanticReplay
        && /^[0-9a-f]{64}$/.test(String(value || ''))
      )
    ),
  );
  const commandIdentityMatches = everyFieldValue(
    'commandId',
    value => value === expectation.commandId,
  ) && everyFieldValue(
    'fingerprint',
    value => value === expectation.fingerprint,
  );
  const identityMapMatches = everyFieldValue(
    'identityMap',
    value => sameContentValue(value, expectation.identityMap),
  );
  const countsMatch = everyFieldValue(
    'counts',
    value => sameContentValue(value, expectation.counts),
  );
  const confirmedApplied = record.ok === true
    && reportedStatus === 'applied'
    && commandIdentityMatches
    && archiveIdentityMatches
    && identityMapMatches
    && countsMatch
    && semanticReplayValuesAgree;
  const explicitRefusal = record.ok === false
    && ['failed', 'stale'].includes(reportedStatus)
    && commandIdentityMatches;
  const status = confirmedApplied
    ? 'applied'
    : explicitRefusal
      ? reportedStatus
      : 'reconcile-required';
  const needsReconciliation = status === 'reconcile-required';
  return Object.freeze({
    ...record,
    ok: confirmedApplied,
    status,
    reason: needsReconciliation
      ? 'custom_content_archive_receipt_mismatch'
      : record.reason || null,
    commandId: field('commandId'),
    fingerprint: field('fingerprint'),
    archiveFingerprint:
      field('archiveFingerprint'),
    identityMap: field('identityMap'),
    counts: field('counts'),
    needsReconciliation,
    persistence: Object.freeze({
      state: needsReconciliation
        ? 'unconfirmed'
        : ['applied', 'failed', 'stale'].includes(status)
        ? 'confirmed'
        : 'unconfirmed',
      authority,
    }),
  });
}

/** @param {Record<string, any>} [options] */
async function supabaseExportArchive(options = {}) {
  const user = await archiveCloudOwner(options);
  const { data, error } = await supabase.rpc(
    'export_custom_content_archive',
    { p_expected_owner: user.id },
  );
  if (error) {
    if (isMissingArchiveSchema(error)) {
      throw Object.assign(
        new Error('Full custom-content archive persistence is not deployed.'),
        { code: 'custom_content_archive_schema_missing', cause: error },
      );
    }
    throw error;
  }
  const admission = validateCustomContentArchive(data);
  if (admission.ok === false) {
    throw Object.assign(
      new Error(
        admission.message
        || 'The server returned an invalid custom-content archive.',
      ),
      { code: admission.reason || 'custom_content_archive_invalid' },
    );
  }
  return admission.archive;
}

/**
 * @param {unknown} archive
 * @param {Record<string, any>} [options]
 */
async function supabaseImportArchive(archive, options = {}) {
  const user = await archiveCloudOwner(options);
  const prepared = prepareCustomContentArchiveImport(archive, {
    destinationOwnerId: user.id,
    sourceKey: options.sourceKey,
    activationPolicy: options.activationPolicy,
  });
  const commandId = options.commandId || prepared.commandId;
  try {
    const response = await supabase.rpc(
      'import_custom_content_archive',
      {
        p_expected_owner: user.id,
        p_command_id: commandId,
        p_fingerprint: prepared.fingerprint,
        p_bundle: prepared.bundle,
      },
    );
    if (response.error) {
      return archiveErrorReceipt(
        response.error,
        commandId,
        prepared,
        isConfirmedArchiveRejection(response.error, response.status)
          ? 'confirmed'
          : 'unconfirmed',
      );
    }
    return normalizeArchiveReceipt(
      response.data,
      'supabase-transaction',
      archiveReceiptExpectation(prepared, commandId),
    );
  } catch (error) {
    return archiveErrorReceipt(
      error,
      commandId,
      prepared,
      isConfirmedArchiveRejection(error, null)
        ? 'confirmed'
        : 'unconfirmed',
    );
  }
}

/**
 * Export is a data-rights operation and deliberately has no premium check.
 *
 * @param {Record<string, any>} [options]
 */
export async function exportCustomContentArchive(options = {}) {
  if (isConfigured) return supabaseExportArchive(options);
  const archive = await exportLocalCustomContentArchive(options);
  const admission = validateCustomContentArchive(archive);
  if (admission.ok === false) {
    throw new TypeError(admission.message || admission.reason);
  }
  return admission.archive;
}

/**
 * Cloud entitlement is enforced transactionally by migration 187; local mode
 * is gated by the store action before reaching this persistence seam.
 *
 * @param {unknown} archive
 * @param {Record<string, any>} [options]
 */
export async function importCustomContentArchive(archive, options = {}) {
  if (isConfigured) return supabaseImportArchive(archive, options);
  const ownerId = options.ownerId || options.ownerKey || 'anon';
  const prepared = prepareCustomContentArchiveImport(archive, {
    destinationOwnerId: String(ownerId),
    sourceKey: options.sourceKey,
    activationPolicy: options.activationPolicy,
  });
  const receipt = await importLocalCustomContentArchive(archive, options);
  return normalizeArchiveReceipt(
    receipt,
    'local-immutable-ledger',
    archiveReceiptExpectation(prepared, prepared.commandId),
  );
}

export {
  clearLocalCustomContentAfterArchive,
  clearLocalCustomContentArchivesAfterSnapshot,
  exportLocalCustomContentArchive,
  importLocalCustomContentArchive,
};
