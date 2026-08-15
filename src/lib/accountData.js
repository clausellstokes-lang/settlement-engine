/**
 * accountData.js — Data & Privacy service: export and account-deletion request.
 *
 * Two user-data operations the Account page's "Data & Privacy" section needs,
 * kept out of the component so they're unit-testable and free of React:
 *
 *   • buildAccountExport(state) — assemble a portable JSON snapshot of the
 *     user's OWN data (profile basics, settlements, campaigns, private custom
 *     content, and export-only service records). Pure;
 *     takes a plain store snapshot so it's trivial to test and never touches
 *     the network.
 *   • downloadAccountExport(state) — wrap buildAccountExport in a browser
 *     download (Blob + anchor click). Returns the filename used.
 *   • requestAccountDeletion(user) — file a SOFT-DELETE request, never a client
 *     hard-delete. We route to the `account-actions` edge function if present;
 *     otherwise we record a row in `deletion_requests`. The client deliberately
 *     CANNOT erase the account itself (RLS forbids it) — a server job processes
 *     the request after a grace window. Returns { status, requestedAt }.
 *
 * Security note: deletion is intentionally a *request*, gated by confirmation in
 * the UI. Hard deletion requires the service-role key, which never ships to the
 * browser; doing it client-side would be both impossible (RLS) and unsafe.
 */

import { supabase, isConfigured } from './supabase.js';
import {
  CUSTOM_CONTENT_ARCHIVE_LIMITS,
  validateCustomContentArchive,
} from './customContentArchive.js';
import {
  authoredDataOf,
  contentRevisionHash,
} from '../domain/content/customContentVersioning.js';
import {
  isReviewedDerivedContentCategory,
  PERSISTED_RUNTIME_CONTENT_CATEGORIES,
  reviewedSupplyChainContentHash,
  reviewedSupplyChainRevisionEntry,
} from '../domain/content/reviewedSupplyChainPersistence.js';
import {
  inspectAccountContentReferences,
} from './accountContentPortability.js';
import {
  ACCOUNT_EXPORT_VERSION,
  MAX_IMPORT_BYTES,
  MAX_IMPORT_CAMPAIGNS,
  MAX_IMPORT_SETTLEMENTS,
  accountTransferByteLength,
} from './accountTransferContract.js';

export { ACCOUNT_EXPORT_VERSION };

const ACCOUNT_EXPORT_PREFLIGHT_SCHEMA_VERSION = 1;

/**
 * @typedef {{
 *   version:number,
 *   exportedAt:string,
 *   profile:{email:string|null,displayName:string|null,tier:string|null,avatarUrl:string|null},
 *   settlements:any[],
 *   campaigns:any[],
 *   customContentArchive:Record<string, any>|null,
 *   serviceRecords:{schemaVersion:number,importable:false,operatorMessages:any[],consentChanges:any[]},
 *   preflight:Record<string, any>,
 * }} AccountExportPayload
 */

function customContentCount(customContent) {
  if (!customContent || typeof customContent !== 'object') return 0;
  return PERSISTED_RUNTIME_CONTENT_CATEGORIES.reduce((total, category) => (
    total + (Array.isArray(customContent[category])
      ? customContent[category].length
      : 0)
  ), 0);
}

/**
 * Prove that the loaded editable projection is represented by exact active
 * heads in the authoritative archive. A count comparison alone can be fooled
 * by one missing active definition and one unrelated archived definition.
 *
 * @param {unknown} customContent
 * @param {Record<string, any>} archive
 */
function inspectLoadedContentArchive(customContent, archive) {
  if (!customContent || typeof customContent !== 'object') return [];
  const definitions = Array.isArray(archive?.ledger?.definitions)
    ? archive.ledger.definitions
    : [];
  const revisions = Array.isArray(archive?.ledger?.revisions)
    ? archive.ledger.revisions
    : [];
  const definitionById = new Map(
    definitions.map(definition => [String(definition.id), definition]),
  );
  const definitionByLocalUid = new Map(
    definitions.map(definition => [String(definition.localUid), definition]),
  );
  const revisionById = new Map(
    revisions.map(revision => [String(revision.id), revision]),
  );
  const errors = [];

  for (const category of PERSISTED_RUNTIME_CONTENT_CATEGORIES) {
    const items = Array.isArray(customContent[category])
      ? customContent[category]
      : [];
    for (const item of items) {
      try {
        const definition = definitionById.get(
          String(item?.definitionId || item?.id || ''),
        ) || definitionByLocalUid.get(String(item?.localUid || ''));
        const head = definition
          ? revisionById.get(String(definition.headRevisionId))
          : null;
        const declaredDefinitionId = String(
          item?.definitionId || item?.id || '',
        );
        const declaredRevisionId = String(item?.revisionId || '');
        if (isReviewedDerivedContentCategory(category)) {
          reviewedSupplyChainRevisionEntry(item);
        }
        const expectedHash = isReviewedDerivedContentCategory(category)
          ? reviewedSupplyChainContentHash(item)
          : contentRevisionHash(category, authoredDataOf(item));
        if (
          !definition
          || definition.archivedAt != null
          || definition.category !== category
          || String(definition.id) !== declaredDefinitionId
          || !head
          || String(head.id) !== declaredRevisionId
          || head.contentHash !== expectedHash
        ) {
          errors.push({
            code: 'account_export_content_archive_incomplete',
            message: `The authoritative custom-content archive does not contain the loaded ${category} definition "${String(item?.name || item?.localUid || 'unnamed')}".`,
          });
        }
      } catch {
        errors.push({
          code: 'account_export_content_projection_invalid',
          message: `A loaded ${category} definition could not be verified for export.`,
        });
      }
    }
  }
  return errors;
}

/**
 * A failed export is safer than a reassuring download that cannot be restored.
 * The structured diagnostics remain available to UI/tests while `message`
 * carries one concise, human-readable explanation.
 */
export class AccountExportPreflightError extends Error {
  /** @param {Readonly<Record<string, unknown>>} diagnostics */
  constructor(diagnostics) {
    const first = Array.isArray(diagnostics?.errors)
      ? diagnostics.errors[0]
      : null;
    super(
      first?.message
      || 'This account cannot be exported as one restorable file yet.',
    );
    this.name = 'AccountExportPreflightError';
    this.code = first?.code || 'account_export_preflight_failed';
    this.diagnostics = diagnostics;
  }
}

/** @param {unknown} value */
function serializedAccountExportByteLength(value) {
  return accountTransferByteLength(JSON.stringify(value, null, 2));
}

function emptyServiceRecordsLike(serviceRecords) {
  return {
    schemaVersion: Number(serviceRecords?.schemaVersion) || 1,
    importable: false,
    operatorMessages: [],
    consentChanges: [],
  };
}

/**
 * Construct and prove an account-transfer artifact without downloading it.
 *
 * The proof uses the canonical full-ledger archive validator, not a looser
 * exporter-only approximation. No data is truncated to satisfy a bound: an
 * over-limit or invalid account receives an explicit diagnostic and no
 * misleading "backup" object.
 *
 * @param {{
 *   auth?: any,
 *   savedSettlements?: any[],
 *   campaigns?: any[],
 *   customContent?: Record<string, any[]>,
 *   customContentArchive?: unknown,
 *   serviceRecords?: unknown,
 * }} state
 * @returns {{ok:true, value:AccountExportPayload,
 *   diagnostics:Readonly<Record<string, unknown>>}
 *   | {ok:false, diagnostics:Readonly<Record<string, unknown>>}}
 */
export function preflightAccountExport(state = {}) {
  const auth = state.auth || {};
  const settlements = Array.isArray(state.savedSettlements)
    ? state.savedSettlements
    : [];
  const campaigns = Array.isArray(state.campaigns) ? state.campaigns : [];
  const contentCount = customContentCount(state.customContent);
  const parsedServiceRecords = state.serviceRecords
    && typeof state.serviceRecords === 'object'
    && !Array.isArray(state.serviceRecords)
    ? /** @type {Record<string, unknown>} */ (state.serviceRecords)
    : null;
  const serviceRecords = parsedServiceRecords
    ? {
        schemaVersion: Number(parsedServiceRecords.schemaVersion) || 1,
        importable: false,
        operatorMessages: Array.isArray(parsedServiceRecords.operatorMessages)
          ? parsedServiceRecords.operatorMessages
          : [],
        consentChanges: Array.isArray(parsedServiceRecords.consentChanges)
          ? parsedServiceRecords.consentChanges
          : [],
      }
    : {
        schemaVersion: 1,
        importable: false,
        operatorMessages: [],
        consentChanges: [],
      };
  const errors = [];

  if (settlements.length > MAX_IMPORT_SETTLEMENTS) {
    errors.push({
      code: 'account_export_settlement_limit_exceeded',
      message: `This account has ${settlements.length} settlements; one restorable export supports at most ${MAX_IMPORT_SETTLEMENTS}.`,
    });
  }
  if (campaigns.length > MAX_IMPORT_CAMPAIGNS) {
    errors.push({
      code: 'account_export_campaign_limit_exceeded',
      message: `This account has ${campaigns.length} campaigns; one restorable export supports at most ${MAX_IMPORT_CAMPAIGNS}.`,
    });
  }
  let customContentArchive = null;
  let archiveBytes = 0;
  let archiveCounts = null;
  if (state.customContentArchive != null) {
    const archiveAdmission = validateCustomContentArchive(
      state.customContentArchive,
    );
    if (archiveAdmission.ok === false) {
      errors.push({
        code: 'account_export_content_archive_rejected',
        message: `Custom content is not restorable: ${
          archiveAdmission.message || archiveAdmission.reason
        }`,
      });
    } else {
      customContentArchive = archiveAdmission.archive;
      archiveBytes = archiveAdmission.byteLength;
      archiveCounts = archiveAdmission.counts;
      errors.push(...inspectLoadedContentArchive(
        state.customContent,
        customContentArchive,
      ));
    }
  } else if (contentCount > 0) {
    errors.push({
      code: 'account_export_content_archive_required',
      message: 'Full custom-content history must finish loading before this account can be exported.',
    });
  }

  const contentReferences = inspectAccountContentReferences(
    campaigns,
    customContentArchive,
  );
  if (!contentReferences.ok) {
    for (const error of contentReferences.errors) {
      errors.push({
        code: error.code,
        message: `Campaign content is not restorable at ${error.path}: ${error.message}.`,
      });
    }
  }

  const profile = {
    email: auth.user?.email || null,
    displayName: auth.displayName || null,
    tier: auth.tier || null,
    // DATA RIGHTS (DESIGN_PROFILE_IMAGE.md §4): the profile image belongs in the
    // export. The URL is exported rather than the bytes — the object is public,
    // immutable and content-addressed, so the link IS a durable reference to the
    // exact image, and inlining a base64 blob would bloat every export for a
    // fidelity nobody gains. null when the account has no image, which is an
    // ordinary state (the letter-circle is the permanent fallback), not a gap.
    avatarUrl: auth.avatarUrl || null,
  };
  const preflight = {
    schemaVersion: ACCOUNT_EXPORT_PREFLIGHT_SCHEMA_VERSION,
    status: 'portable',
    limits: {
      envelopeBytes: MAX_IMPORT_BYTES,
      settlements: MAX_IMPORT_SETTLEMENTS,
      campaigns: MAX_IMPORT_CAMPAIGNS,
      customContentArchiveBytes: CUSTOM_CONTENT_ARCHIVE_LIMITS.maxBytes,
      contentDefinitions: CUSTOM_CONTENT_ARCHIVE_LIMITS.definitions,
      contentRevisions: CUSTOM_CONTENT_ARCHIVE_LIMITS.revisions,
    },
    counts: {
      settlements: settlements.length,
      campaigns: campaigns.length,
      contentDefinitions: archiveCounts?.definitions || contentCount,
      contentRevisions: archiveCounts?.revisions || 0,
      archivedDefinitions: archiveCounts
        ? Math.max(0, archiveCounts.definitions - contentCount)
        : 0,
      contentEnvironments: archiveCounts?.environments || 0,
      contentCommandReceipts: archiveCounts?.commandReceipts || 0,
      campaignBindings: contentReferences.bindings,
      campaignBindingRevisions: contentReferences.bindingRevisions,
      receiptMappableBindingRevisions:
        contentReferences.packMappedRevisions,
      embeddedBindingRevisions: contentReferences.embeddedRevisions,
      operatorMessages: serviceRecords.operatorMessages.length,
      consentChanges: serviceRecords.consentChanges.length,
    },
    customContentArchive: customContentArchive
      ? {
          archiveFingerprint: customContentArchive.archiveFingerprint,
          bytes: archiveBytes,
          counts: archiveCounts,
        }
      : null,
  };
  const payload = /** @type {AccountExportPayload} */ ({
    version: ACCOUNT_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    profile,
    settlements,
    campaigns,
    customContentArchive,
    serviceRecords,
    preflight,
  });
  // downloadAccountExport writes this exact pretty-printed representation.
  // Measuring a compact surrogate here could approve a file whose actual
  // browser File.size later exceeds the import cap.
  const downloadBytes = serializedAccountExportByteLength(payload);
  // Service records are export-only and may grow for the lifetime of an
  // account. They must never consume the hostile-import envelope budget or
  // prevent the owner exporting otherwise-restorable product state. The
  // downloader splits them into a second complete JSON file when necessary.
  const restorablePayload = {
    ...payload,
    serviceRecords: emptyServiceRecordsLike(serviceRecords),
  };
  const envelopeBytes = serializedAccountExportByteLength(restorablePayload);
  if (envelopeBytes > MAX_IMPORT_BYTES) {
    errors.push({
      code: 'account_export_envelope_limit_exceeded',
      message: `This account's restorable data is ${envelopeBytes} bytes; one importable file supports at most ${MAX_IMPORT_BYTES} bytes.`,
    });
  }

  const diagnostics = Object.freeze({
    schemaVersion: ACCOUNT_EXPORT_PREFLIGHT_SCHEMA_VERSION,
    ok: errors.length === 0,
    envelopeBytes,
    downloadBytes,
    archiveBytes,
    counts: Object.freeze({ ...preflight.counts }),
    errors: Object.freeze(errors.map(error => Object.freeze(error))),
  });
  if (errors.length > 0) return { ok: false, diagnostics };
  return {
    ok: true,
    value: Object.freeze(payload),
    diagnostics,
  };
}

/**
 * Build a portable, user-owned JSON object from a store snapshot. Pure — no
 * network, no side effects. We export STRUCTURE the user authored (their
 * settlements + campaigns) plus minimal profile identity, never internal
 * grants (role/credits) which aren't theirs to carry off. Custom content uses
 * the same checksummed, lossless ledger archive as local-to-cloud migration;
 * there is no weaker account-export-only representation.
 *
 * @param {{
 *   auth?: any,
 *   savedSettlements?: any[],
 *   campaigns?: any[],
 *   customContent?: Record<string, any[]>,
 *   customContentArchive?: unknown,
 *   serviceRecords?: unknown,
 * }} state
 */
export function buildAccountExport(state = {}) {
  const preflight = preflightAccountExport(state);
  if (!preflight.ok) {
    throw new AccountExportPreflightError(preflight.diagnostics);
  }
  return preflight.value;
}

/**
 * Build the actual download set. Ordinary accounts keep the familiar single
 * JSON. If export-only service history alone would cross the import safety cap,
 * the restorable account core and the complete non-importable service history
 * become two clearly named JSON files. No records are truncated.
 */
export function planAccountExportDownloads(state = {}) {
  const payload = buildAccountExport(state);
  const accountFilename = exportFilename(payload.profile?.email);
  const combinedJson = JSON.stringify(payload, null, 2);
  if (accountTransferByteLength(combinedJson) <= MAX_IMPORT_BYTES) {
    return [{ filename: accountFilename, json: combinedJson, importable: true }];
  }

  const serviceFilename = accountFilename.replace(/\.json$/, '-service-records.json');
  const accountPayload = {
    ...payload,
    serviceRecords: emptyServiceRecordsLike(payload.serviceRecords),
  };
  const accountJson = JSON.stringify(accountPayload, null, 2);
  if (accountTransferByteLength(accountJson) > MAX_IMPORT_BYTES) {
    // This should already have been rejected by preflight; retain a local
    // assertion so future envelope edits cannot make the planner lie.
    throw new Error('The restorable account export exceeds its import safety limit.');
  }
  const serviceJson = JSON.stringify({
    format: 'settlementforge.operator-service-records',
    formatVersion: 1,
    exportedAt: payload.exportedAt,
    account: { email: payload.profile?.email || null },
    serviceRecords: payload.serviceRecords,
  }, null, 2);
  return [
    { filename: accountFilename, json: accountJson, importable: true },
    { filename: serviceFilename, json: serviceJson, importable: false },
  ];
}

/** Slugify an email into a safe filename stem. */
function exportFilename(email) {
  const stem = String(email || 'account').replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase();
  const date = new Date().toISOString().slice(0, 10);
  return `settlementforge-${stem || 'account'}-${date}.json`;
}

/**
 * Trigger a client-side download of the account export. Returns the filename
 * so callers/tests can assert on it. Guards the DOM/Blob APIs so a non-browser
 * environment (or a stubbed test) doesn't throw.
 *
 * @param {object} state store snapshot (see buildAccountExport)
 * @returns {string} the download filename
 */
export function downloadAccountExport(state = {}) {
  const downloads = planAccountExportDownloads(state);

  // Browser-only side effect; skip cleanly when the APIs are unavailable.
  if (typeof document !== 'undefined' && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
    for (const download of downloads) {
      const blob = new Blob([download.json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = download.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      try { URL.revokeObjectURL(url); } catch { /* ignore */ }
    }
  }
  return downloads[0].filename;
}

/**
 * File a SOFT-DELETE account-deletion request. Never hard-deletes client-side.
 *
 * Path 1 (preferred): an `account-actions` edge function with { action:
 * 'request_deletion' } — a server endpoint that flags the account and schedules
 * erasure after a grace window.
 * Path 2 (fallback): insert into a `deletion_requests` table (RLS lets a user
 * file their own request only).
 *
 * In local/mock mode (no Supabase) we resolve a synthetic queued result so the
 * UI flow is exercisable without a backend.
 *
 * @param {{ id?: string, email?: string }} user
 * @returns {Promise<{ status: 'queued', requestedAt: string }>}
 */
export async function requestAccountDeletion(user) {
  const requestedAt = new Date().toISOString();

  if (!isConfigured || !supabase) {
    // Local dev: no backend to route to; report queued so the UI can confirm.
    return { status: 'queued', requestedAt };
  }

  // Preferred: dedicated server endpoint.
  try {
    const { error } = await supabase.functions.invoke('account-actions', {
      body: { action: 'request_deletion' },
    });
    if (!error) return { status: 'queued', requestedAt };
  } catch {
    // Fall through to the table path.
  }

  // Fallback: record a deletion request row (server job picks it up).
  const { error: tableErr } = await supabase
    .from('deletion_requests')
    .insert({ user_id: user?.id || null, email: user?.email || null, requested_at: requestedAt });
  if (tableErr) {
    throw new Error('Could not submit your deletion request. Please contact support.');
  }
  return { status: 'queued', requestedAt };
}
