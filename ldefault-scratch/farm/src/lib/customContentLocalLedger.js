/**
 * Offline immutable custom-content ledger.
 *
 * This module is the browser-local counterpart to migration 185's transactional
 * RPC. It owns storage keys, stable definitions, append-only revisions, pack
 * mappings, environment activation, command replay, and read projections. The
 * public service facade remains in customContent.js; keeping this substrate
 * separate makes the cloud/local authority split explicit and reviewable.
 *
 * The historical `sf_custom_content` value is written only as a compatibility
 * projection. `sf_custom_content_revision_ledger_v1` is the local authority.
 * Both keys are owner-scoped so signing in never adopts another owner's or the
 * anonymous browser library.
 */

import { CUSTOM_CONTENT_COMMAND_KIND } from '../domain/content/customContentCommands.js';
import {
  VANILLA_ENVIRONMENT_REVISION_ID,
} from '../domain/content/contentEnvironment.js';
import {
  authoredDataOf,
  contentRevisionHash,
  isAuthorableContentCategory,
  makeContentRevision,
  projectDefinitionHead,
} from '../domain/content/customContentVersioning.js';
import {
  detachContentJson,
  fingerprintContent,
} from '../domain/content/contentFingerprint.js';
import {
  backfillLegacyCustomContentLedger,
} from './customContentLocalLedgerMigration.js';
import {
  backfillLocalPackVersionEntries,
  localPackVersionKey,
  resolveEnvironmentFromLocalLedger,
} from './customContentLocalEnvironment.js';
import {
  withCustomContentLocalLock,
} from './customContentLocalMutex.js';
import {
  localPackEntryKey,
  migrateLegacyLocalPackEntryKeys,
} from './customContentLocalPackKeys.js';
import {
  EMPTY_CUSTOM_CONTENT,
  emptyCustomContentGroups,
  groupedFromLocalLedger,
} from './customContentLocalProjection.js';
import {
  clearLockedLocalArchive,
  clearLockedLocalArchivesAfterSnapshots,
  exportLockedLocalArchive,
  importLockedLocalArchive,
} from './customContentLocalArchiveSession.js';
import { readCustomContentLocalAuthority } from './customContentLocalAuthorityRead.js';
import {
  executeReviewedSupplyChainLocalAuthority,
} from './customContentLocalReviewedChains.js';
import {
  createCustomContentLocalQueries,
} from './customContentLocalQueries.js';

const LOCAL_KEY = 'sf_custom_content';
const LOCAL_KEY_PREFIX = 'sf_custom_content:';
const LOCAL_LEDGER_KEY = 'sf_custom_content_revision_ledger_v1';
const LOCAL_LEDGER_KEY_PREFIX = 'sf_custom_content_revision_ledger_v1:';
const LOCAL_LEDGER_SCHEMA_VERSION = 1;

export { EMPTY_CUSTOM_CONTENT, emptyCustomContentGroups };

function nowIso() {
  return new Date().toISOString();
}

export function makeCustomContentUuid() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  const random = () => Math.floor(Math.random() * 0x100000000)
    .toString(16)
    .padStart(8, '0');
  const hex = `${random()}${random()}${random()}${random()}`.slice(0, 32);
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    `4${hex.slice(13, 16)}`,
    `${((Number.parseInt(hex[16], 16) & 0x3) | 0x8).toString(16)}${hex.slice(17, 20)}`,
    hex.slice(20),
  ].join('-');
}

export function makeCustomContentLocalUid() {
  return `lu_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function loadJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function safeOwnerKey(ownerId = 'anon') {
  return String(ownerId || 'anon').replace(/[^a-zA-Z0-9_-]/g, '_');
}

function localProjectionKey(ownerId = 'anon') {
  return String(ownerId || 'anon') === 'anon'
    ? LOCAL_KEY
    : `${LOCAL_KEY_PREFIX}${safeOwnerKey(ownerId)}`;
}

function localLedgerKey(ownerId = 'anon') {
  return String(ownerId || 'anon') === 'anon'
    ? LOCAL_LEDGER_KEY
    : `${LOCAL_LEDGER_KEY_PREFIX}${safeOwnerKey(ownerId)}`;
}

function legacyGrouped(ownerId = 'anon') {
  const raw = loadJson(localProjectionKey(ownerId), {});
  return {
    ...emptyCustomContentGroups(),
    ...(raw && typeof raw === 'object' ? raw : {}),
  };
}

function emptyLedger() {
  return {
    schemaVersion: LOCAL_LEDGER_SCHEMA_VERSION,
    definitions: {},
    revisions: {},
    packEntryDefinitions: {},
    packEntryRevisions: {},
    packs: {},
    packVersionEntries: {},
    activePacks: {},
    environments: {},
    activeEnvironmentRevisionId: null,
    commandReceipts: {},
    archiveImports: {},
  };
}

function loadLocalLedger(ownerId = 'anon') {
  const key = localLedgerKey(ownerId);
  const raw = readCustomContentLocalAuthority(
    key,
    LOCAL_LEDGER_SCHEMA_VERSION,
  );
  const ledger = raw ? { ...emptyLedger(), ...raw } : emptyLedger();
  let changed = migrateLegacyLocalPackEntryKeys(ledger);
  changed = backfillLegacyCustomContentLedger(
    ledger,
    legacyGrouped(ownerId),
  ) || changed;
  changed = backfillLocalPackVersionEntries(ledger) || changed;
  if (Object.keys(ledger.activePacks || {}).length === 0) {
    for (const pack of Object.values(ledger.packs || {})) {
      if (!pack?.packId || !pack?.packVersion || !pack?.manifestHash) continue;
      ledger.activePacks[pack.packId] = {
        packVersion: pack.packVersion,
        manifestHash: pack.manifestHash,
      };
      changed = true;
    }
  }
  if (changed) writeJson(key, ledger);
  return ledger;
}

function persistLocalLedger(ledger, ownerId = 'anon') {
  writeJson(localLedgerKey(ownerId), ledger);
  writeJson(localProjectionKey(ownerId), groupedFromLocalLedger(ledger));
}

function clearLocalLedgerStorage(ownerId) {
  writeJson(localProjectionKey(ownerId), {});
  localStorage.removeItem(localLedgerKey(ownerId));
}

const localArchiveStorage = Object.freeze({
  load: loadLocalLedger,
  persist: persistLocalLedger,
  clear: clearLocalLedgerStorage,
  safeOwnerKey,
  now: nowIso,
});

function cloneLedger(ledger) {
  return /** @type {ReturnType<typeof emptyLedger>} */ (
    detachContentJson(ledger)
  );
}

export function customContentLocalReceipt({
  commandId,
  status,
  reason = null,
  result = null,
  perEntry = [],
  replayed = false,
}) {
  return Object.freeze({
    ok: status === 'applied',
    status,
    commandId,
    reason,
    replayed,
    persistence: Object.freeze({
      state: status === 'applied' ? 'confirmed' : 'not-required',
      authority: 'local-immutable-ledger',
    }),
    result,
    perEntry: Object.freeze(perEntry),
  });
}

export function customContentCommandId(plan, fingerprint, ownerId) {
  const identity = fingerprintContent({
    ownerId: String(ownerId || 'anon'),
    kind: plan.kind,
    definitionId: plan.definitionId || null,
    packId: plan.pack?.packId || null,
    packVersion: plan.pack?.packVersion || null,
    environmentRevisionId: plan.environment?.environmentRevisionId || null,
    fingerprint,
  });
  return `cmd:custom-content:${identity}`;
}

function nextDefinitionId(plan, entry) {
  if (entry.definitionId) return String(entry.definitionId);
  if (plan.kind === CUSTOM_CONTENT_COMMAND_KIND.PACK_IMPORT) {
    return `pack-definition:${fingerprintContent({
      packId: plan.pack?.packId,
      packEntryId: entry.packEntryId,
    })}`;
  }
  return makeCustomContentUuid();
}

function applyEntriesToLedger(ledger, plan, timestamp) {
  const perEntry = [];
  const projections = [];
  for (const entry of plan.entries || []) {
    let definitionId = nextDefinitionId(plan, entry);
    const mapping = plan.kind === CUSTOM_CONTENT_COMMAND_KIND.PACK_IMPORT
      ? ledger.packEntryDefinitions[
          localPackEntryKey(plan.pack?.packId, entry.packEntryId)
        ]
      : null;
    if (mapping) definitionId = mapping;

    const existing = ledger.definitions[definitionId] || null;
    if (existing) {
      if (existing.category !== entry.category) {
        return {
          ok: false,
          reason: 'definition_category_immutable',
          definitionId,
        };
      }
      if (existing.archivedAt) {
        return {
          ok: false,
          reason: 'definition_archived',
          definitionId,
        };
      }
      const installedPackRevision = plan.kind
        === CUSTOM_CONTENT_COMMAND_KIND.PACK_IMPORT
        ? ledger.packEntryRevisions[
            localPackEntryKey(plan.pack?.packId, entry.packEntryId)
          ]
        : null;
      if (
        plan.kind === CUSTOM_CONTENT_COMMAND_KIND.PACK_IMPORT
        && mapping
        && !installedPackRevision
      ) {
        return {
          ok: false,
          reason: 'pack_mapping_revision_unavailable',
          definitionId,
        };
      }
      if (
        installedPackRevision
        && String(existing.headRevisionId) !== String(installedPackRevision)
      ) {
        return {
          ok: false,
          reason: 'pack_definition_head_changed',
          definitionId,
          actualHeadRevisionId: existing.headRevisionId,
        };
      }
      if (
        plan.kind === CUSTOM_CONTENT_COMMAND_KIND.PACK_IMPORT
        && mapping
        && !entry.expectedHeadRevisionId
      ) {
        return {
          ok: false,
          reason: 'pack_preview_expected_head_required',
          definitionId,
        };
      }
      if (
        plan.kind === CUSTOM_CONTENT_COMMAND_KIND.PACK_IMPORT
        && mapping
        && String(existing.headRevisionId)
          !== String(entry.expectedHeadRevisionId)
      ) {
        return {
          ok: false,
          reason: 'definition_head_changed',
          definitionId,
          actualHeadRevisionId: existing.headRevisionId,
        };
      }
      if (
        String(existing.headRevisionId || '')
        !== String(entry.expectedHeadRevisionId || '')
        && plan.kind !== CUSTOM_CONTENT_COMMAND_KIND.PACK_IMPORT
      ) {
        return {
          ok: false,
          reason: 'definition_head_changed',
          definitionId,
          actualHeadRevisionId: existing.headRevisionId,
        };
      }
    } else if (entry.expectedHeadRevisionId) {
      return {
        ok: false,
        reason: 'definition_unavailable',
        definitionId,
      };
    }

    const localUid = entry.data.localUid
      || existing?.localUid
      || makeCustomContentLocalUid();
    const conflictingDefinition = Object.values(ledger.definitions)
      .find(definition => (
        definition.id !== definitionId
        && String(definition.localUid) === String(localUid)
      ));
    if (conflictingDefinition) {
      return {
        ok: false,
        reason: 'local_uid_conflict',
        definitionId,
        conflictingDefinitionId: conflictingDefinition.id,
      };
    }
    const data = authoredDataOf({ ...entry.data, localUid });
    const nextHash = contentRevisionHash(entry.category, data);
    const currentRevision = existing
      ? ledger.revisions[existing.headRevisionId]
      : null;
    if (currentRevision?.contentHash === nextHash) {
      if (plan.kind === CUSTOM_CONTENT_COMMAND_KIND.PACK_IMPORT) {
        ledger.packEntryRevisions[
          localPackEntryKey(plan.pack?.packId, entry.packEntryId)
        ] = currentRevision.id;
      }
      projections.push(projectDefinitionHead(existing, currentRevision));
      perEntry.push({
        definitionId,
        revisionId: currentRevision.id,
        status: 'unchanged',
        category: entry.category,
        packEntryId: entry.packEntryId || null,
      });
      continue;
    }

    const revision = makeContentRevision({
      definitionId,
      category: entry.category,
      data,
      revisionNumber: (currentRevision?.revisionNumber || 0) + 1,
      parentRevisionId: currentRevision?.id || null,
      revisionId: makeCustomContentUuid(),
      createdAt: timestamp,
    });
    const definition = {
      id: definitionId,
      category: entry.category,
      localUid,
      headRevisionId: revision.id,
      archivedAt: null,
      createdAt: existing?.createdAt || timestamp,
      updatedAt: timestamp,
      legacyContentId: existing?.legacyContentId || null,
    };
    ledger.definitions[definitionId] = definition;
    ledger.revisions[revision.id] = revision;
    if (plan.kind === CUSTOM_CONTENT_COMMAND_KIND.PACK_IMPORT) {
      const mappingKey = localPackEntryKey(
        plan.pack?.packId,
        entry.packEntryId,
      );
      ledger.packEntryDefinitions[mappingKey] = definitionId;
      ledger.packEntryRevisions[mappingKey] = revision.id;
    }
    projections.push(projectDefinitionHead(definition, revision));
    perEntry.push({
      definitionId,
      revisionId: revision.id,
      status: existing ? 'updated' : 'created',
      category: entry.category,
      packEntryId: entry.packEntryId || null,
    });
  }
  return { ok: true, projections, perEntry };
}

function applyLifecycleToLedger(ledger, plan, timestamp) {
  const definition = ledger.definitions[plan.definitionId];
  if (!definition) return { ok: false, reason: 'definition_unavailable' };
  if (!isAuthorableContentCategory(definition.category)) {
    return {
      ok: false,
      reason: 'definition_lifecycle_category_unsupported',
    };
  }
  if (
    plan.expectedHeadRevisionId
    && String(plan.expectedHeadRevisionId) !== String(definition.headRevisionId)
  ) {
    return { ok: false, reason: 'definition_head_changed' };
  }
  if (plan.kind === CUSTOM_CONTENT_COMMAND_KIND.ARCHIVE) {
    definition.archivedAt = definition.archivedAt || timestamp;
  } else {
    definition.archivedAt = null;
  }
  definition.updatedAt = timestamp;
  return {
    ok: true,
    perEntry: [{
      definitionId: definition.id,
      revisionId: definition.headRevisionId,
      status: plan.kind === CUSTOM_CONTENT_COMMAND_KIND.ARCHIVE
        ? 'archived'
        : 'restored',
      category: definition.category,
      packEntryId: null,
    }],
    projections: plan.kind === CUSTOM_CONTENT_COMMAND_KIND.RESTORE
      ? [projectDefinitionHead(
          definition,
          ledger.revisions[definition.headRevisionId],
        )]
      : [],
    archivedProjections: plan.kind === CUSTOM_CONTENT_COMMAND_KIND.ARCHIVE
      ? [projectDefinitionHead(
          definition,
          ledger.revisions[definition.headRevisionId],
        )]
      : [],
  };
}

function executeLocalCustomContentCommandUnlocked(
  preview,
  options,
  ownerId,
) {
  const commandId = options.commandId
    || customContentCommandId(preview.plan, preview.fingerprint, ownerId);
  const ledger = loadLocalLedger(ownerId);
  const prior = ledger.commandReceipts[commandId];
  if (prior) {
    if (prior.fingerprint !== preview.fingerprint) {
      return customContentLocalReceipt({
        commandId,
        status: 'failed',
        reason: 'command_id_conflict',
      });
    }
    return customContentLocalReceipt({
      ...prior.receipt,
      commandId,
      replayed: true,
    });
  }

  // Work on a detached ledger. A failed late entry therefore discards every
  // earlier tentative write in the command, matching the database transaction.
  const next = cloneLedger(ledger);
  const timestamp = nowIso();
  let outcome;
  const packKey = preview.plan.pack
    ? localPackVersionKey(
        preview.plan.pack.packId,
        preview.plan.pack.packVersion,
      )
    : null;
  const existingPack = packKey ? next.packs[packKey] : null;
  const activePack = preview.plan.pack
    ? next.activePacks?.[preview.plan.pack.packId] || null
    : null;
  const environmentRevisionId =
    preview.plan.environment?.environmentRevisionId || null;
  const existingEnvironment = environmentRevisionId
    ? next.environments[environmentRevisionId]
    : null;
  const activeEnvironmentRevisionId = next.activeEnvironmentRevisionId
    || VANILLA_ENVIRONMENT_REVISION_ID;

  if (preview.plan.kind === CUSTOM_CONTENT_COMMAND_KIND.PACK_IMPORT
    && !preview.plan.entries?.length) {
    outcome = { ok: false, reason: 'pack_version_empty' };
  } else if (
    existingPack
    && (
      existingPack.manifestHash !== preview.plan.pack?.manifestHash
      || existingPack.importPlanHash !== preview.plan.pack?.importPlanHash
    )
  ) {
    outcome = { ok: false, reason: 'pack_version_immutable' };
  } else if (
    preview.plan.kind === CUSTOM_CONTENT_COMMAND_KIND.PACK_IMPORT
    && (
      String(activePack?.packVersion || '')
        !== String(preview.plan.pack?.expectedActivePackVersion || '')
      || String(activePack?.manifestHash || '')
        !== String(preview.plan.pack?.expectedActiveManifestHash || '')
    )
  ) {
    outcome = { ok: false, reason: 'pack_preview_stale' };
  } else if (
    preview.plan.kind === CUSTOM_CONTENT_COMMAND_KIND.PACK_IMPORT
    && existingPack
    && activePack?.packVersion !== preview.plan.pack?.packVersion
  ) {
    outcome = { ok: false, reason: 'pack_version_already_installed' };
  } else if (
    preview.plan.kind === CUSTOM_CONTENT_COMMAND_KIND.PACK_IMPORT
    && existingPack
  ) {
    const projections = [];
    const perEntry = [];
    for (const entry of preview.plan.entries || []) {
      const key = localPackEntryKey(
        preview.plan.pack?.packId,
        entry.packEntryId,
      );
      const definitionId = next.packEntryDefinitions[key];
      const definition = next.definitions[definitionId];
      const revision = definition
        ? next.revisions[definition.headRevisionId]
        : null;
      if (!definition || !revision) {
        outcome = { ok: false, reason: 'pack_version_incomplete' };
        break;
      }
      if (
        !entry.definitionId
        || String(entry.definitionId) !== String(definitionId)
      ) {
        outcome = {
          ok: false,
          reason: 'pack_mapping_definition_changed',
          definitionId,
        };
        break;
      }
      if (!entry.expectedHeadRevisionId) {
        outcome = {
          ok: false,
          reason: 'pack_preview_expected_head_required',
          definitionId,
        };
        break;
      }
      if (
        String(entry.expectedHeadRevisionId)
        !== String(definition.headRevisionId)
      ) {
        outcome = {
          ok: false,
          reason: 'definition_head_changed',
          definitionId,
          actualHeadRevisionId: definition.headRevisionId,
        };
        break;
      }
      projections.push(projectDefinitionHead(definition, revision));
      perEntry.push({
        definitionId,
        revisionId: revision.id,
        status: 'unchanged',
        category: definition.category,
        packEntryId: entry.packEntryId,
      });
    }
    outcome ||= { ok: true, projections, perEntry };
  } else if (
    existingEnvironment
    && existingEnvironment.environmentHash
      !== preview.plan.environment?.environmentHash
  ) {
    outcome = { ok: false, reason: 'environment_revision_immutable' };
  } else if (
    preview.plan.kind === CUSTOM_CONTENT_COMMAND_KIND.ENVIRONMENT_MIGRATE
    && preview.plan.expectedActiveEnvironmentRevisionId
      !== activeEnvironmentRevisionId
  ) {
    outcome = { ok: false, reason: 'content_environment_preview_stale' };
  } else if (
    preview.plan.kind === CUSTOM_CONTENT_COMMAND_KIND.ARCHIVE
    || preview.plan.kind === CUSTOM_CONTENT_COMMAND_KIND.RESTORE
  ) {
    outcome = applyLifecycleToLedger(next, preview.plan, timestamp);
  } else if (
    preview.plan.kind === CUSTOM_CONTENT_COMMAND_KIND.CREATE_REVISION
    || preview.plan.kind === CUSTOM_CONTENT_COMMAND_KIND.PACK_IMPORT
  ) {
    outcome = applyEntriesToLedger(next, preview.plan, timestamp);
  } else if (
    preview.plan.kind === CUSTOM_CONTENT_COMMAND_KIND.ENVIRONMENT_MIGRATE
  ) {
    const revisionId = preview.plan.environment?.environmentRevisionId;
    if (!revisionId) {
      outcome = { ok: false, reason: 'environment_revision_required' };
    } else {
      const resolution = resolveEnvironmentFromLocalLedger(
        next,
        preview.plan.environment,
      );
      if (resolution.ok === false) {
        outcome = {
          ok: false,
          reason: resolution.reason,
        };
      } else {
        next.environments[revisionId] = preview.plan.environment;
        next.activeEnvironmentRevisionId = revisionId;
        outcome = { ok: true, perEntry: [], projections: [] };
      }
    }
  } else {
    outcome = {
      ok: false,
      reason: 'unsupported_custom_content_command',
    };
  }

  if (!outcome.ok) {
    return customContentLocalReceipt({
      commandId,
      status: (
        outcome.reason === 'definition_head_changed'
        || outcome.reason === 'pack_definition_head_changed'
        || outcome.reason === 'pack_preview_stale'
        || outcome.reason === 'content_environment_preview_stale'
      )
        ? 'stale'
        : 'failed',
      reason: outcome.reason,
      result: outcome,
    });
  }
  const successfulOutcome = /** @type {{
   *   projections?: unknown[],
   *   archivedProjections?: unknown[],
   *   perEntry?: Array<{
   *     packEntryId?:unknown,
   *     definitionId?:unknown,
   *     revisionId?:unknown,
   *     category?:unknown,
   *   }>,
   * }} */ (outcome);
  if (preview.plan.kind === CUSTOM_CONTENT_COMMAND_KIND.PACK_IMPORT) {
    const immutablePackKey = String(packKey);
    next.packs[immutablePackKey] = preview.plan.pack;
    next.packVersionEntries[immutablePackKey] = (
      successfulOutcome.perEntry || []
    ).map((entry, ordinal) => ({
      packEntryId: entry.packEntryId,
      definitionId: entry.definitionId,
      revisionId: entry.revisionId,
      category: entry.category,
      ordinal,
    }));
    next.activePacks[preview.plan.pack.packId] = {
      packVersion: preview.plan.pack.packVersion,
      manifestHash: preview.plan.pack.manifestHash,
    };
  }
  const result = {
    items: successfulOutcome.projections || [],
    archivedItems: successfulOutcome.archivedProjections || [],
    pack: preview.plan.pack || null,
    environment: preview.plan.environment || null,
  };
  const receiptRecord = {
    status: 'applied',
    reason: null,
    result,
    perEntry: successfulOutcome.perEntry || [],
  };
  next.commandReceipts[commandId] = {
    fingerprint: preview.fingerprint,
    receipt: receiptRecord,
  };
  persistLocalLedger(next, ownerId);
  return customContentLocalReceipt({
    commandId,
    ...receiptRecord,
  });
}

export async function executeLocalCustomContentCommand(
  preview,
  options = {},
) {
  const ownerId = options.ownerId || options.ownerKey || 'anon';
  return withCustomContentLocalLock(ownerId, () => (
    executeLocalCustomContentCommandUnlocked(preview, options, ownerId)
  ));
}

/**
 * Local authority for the non-authorable reviewed-supply-chain command lane.
 *
 * The artifact shares the immutable revision graph so environment and archive
 * references remain ordinary exact addresses. Its writer is nevertheless
 * separate from generic definition authoring: only a strictly admitted
 * confirmation can append a head, and removal is an archive transition.
 *
 * @param {{
 *   plan:Record<string, any>,
 *   fingerprint:string,
 * }} preview
 * @param {{ownerId?:string,ownerKey?:string,commandId?:string}} [options]
 */
export async function executeLocalReviewedSupplyChainCommand(
  preview,
  options = {},
) {
  return executeReviewedSupplyChainLocalAuthority(preview, options, {
    withLock: withCustomContentLocalLock,
    load: loadLocalLedger,
    persist: persistLocalLedger,
    makeRevisionId: makeCustomContentUuid,
    now: nowIso,
    receipt: customContentLocalReceipt,
  });
}

export const {
  listLocalCustomContent,
  listLocalCustomContentRevisions,
  listLocalArchivedCustomContent,
  listLocalContentEnvironmentRevisions,
  loadLocalActiveContentEnvironment,
  resolveLocalContentEnvironment,
  loadLocalContentPackState,
  resolveLocalCustomContentDefinition,
  resolveLocalReviewedSupplyChainIdentity,
} = createCustomContentLocalQueries({
  withLock: withCustomContentLocalLock,
  load: loadLocalLedger,
});

export async function clearLocalCustomContent(options = {}) {
  const ownerId = options.ownerId || options.ownerKey || 'anon';
  return withCustomContentLocalLock(ownerId, () => {
    clearLocalLedgerStorage(ownerId);
  });
}

export async function readLocalCustomContentForMigration(options = {}) {
  const ownerId = options.ownerId || options.ownerKey || 'anon';
  return withCustomContentLocalLock(ownerId, () => {
    const grouped = groupedFromLocalLedger(loadLocalLedger(ownerId));
    const output = [];
    for (const [category, items] of Object.entries(grouped)) {
      for (const item of items || []) output.push({ category, item });
    }
    return output;
  });
}

/**
 * Export the complete immutable local authority, never merely its active-head
 * compatibility projection.
 */
export async function exportLocalCustomContentArchive(options = {}) {
  return exportLockedLocalArchive(options, localArchiveStorage);
}

/**
 * Clear a source only when no other tab appended after the uploaded snapshot.
 */
export async function clearLocalCustomContentAfterArchive(
  expectedLedgerFingerprint,
  options = {},
) {
  return clearLockedLocalArchive(
    expectedLedgerFingerprint,
    options,
    localArchiveStorage,
  );
}

/**
 * Atomically compare and clear every local source that formed one merged
 * upload. No source is removed unless all ledger fingerprints still match.
 */
export async function clearLocalCustomContentArchivesAfterSnapshot(
  snapshots,
) {
  return clearLockedLocalArchivesAfterSnapshots(
    snapshots,
    localArchiveStorage,
  );
}

/** Restore one canonical archive through the same deterministic graph remap. */
export async function importLocalCustomContentArchive(archive, options = {}) {
  return importLockedLocalArchive(archive, options, localArchiveStorage);
}
