/**
 * Lazy runtime for the immutable custom-content persistence service.
 *
 * Migration 185 adds stable definitions, append-only revisions, pack versions,
 * content environments, and a transactional command RPC. The public
 * `add/update/delete` methods remain for existing UI callers, but each now
 * constructs the same reviewed command plan as bulk and Surveyor paths.
 *
 * Local development/offline mode uses an immutable local ledger with the same
 * expected-head semantics. The historical `sf_custom_content` projection is
 * maintained as a compatibility/read cache; it is not revision authority.
 */

import { supabase, isConfigured } from './supabase.js';
import {
  CUSTOM_CONTENT_COMMAND_KIND,
  previewCustomContentCommand,
} from '../domain/content/customContentCommands.js';
import {
  resolveContentEnvironmentSnapshot,
} from '../domain/content/contentEnvironmentResolution.js';
import {
  authoredDataOf,
  contentRevisionHash,
} from '../domain/content/customContentVersioning.js';
import {
  detachContentJson,
} from '../domain/content/contentFingerprint.js';
import {
  EMPTY_CUSTOM_CONTENT,
  clearLocalCustomContent,
  customContentCommandId,
  customContentLocalReceipt,
  emptyCustomContentGroups,
  executeLocalCustomContentCommand,
  listLocalArchivedCustomContent,
  listLocalContentEnvironmentRevisions,
  listLocalCustomContent,
  listLocalCustomContentRevisions,
  loadLocalActiveContentEnvironment,
  loadLocalContentPackState,
  makeCustomContentLocalUid,
  makeCustomContentUuid,
  readLocalCustomContentForMigration,
  resolveLocalContentEnvironment,
  resolveLocalCustomContentDefinition,
} from './customContentLocalLedger.js';
import {
  reviewedSupplyChainRevisionEntry,
} from '../domain/content/reviewedSupplyChainPersistence.js';
import {
  admitReviewedSupplyChainRpcReceipt,
  executeReviewedSupplyChainCommand,
  resolveReviewedSupplyChainIdentity,
} from './customContentReviewedSupplyChainService.js';
import {
  clearLocalCustomContentAfterArchive,
  clearLocalCustomContentArchivesAfterSnapshot,
  exportCustomContentArchive as exportArchive,
  exportLocalCustomContentArchive,
  importCustomContentArchive as importArchive,
  importLocalCustomContentArchive,
} from './customContentArchiveService.js';
import {
  fetchAllSupabaseRows,
  fetchSupabaseRowsByChunks,
} from './customContentSupabasePaging.js';
import {
  isMissingCustomContentSchema as isMissingRevisionSchema,
  isMissingReviewedLifecycleColumn,
  projectSupabaseContentHead,
  sameCanonicalContentValue as sameContentValue,
} from './customContentServiceSupport.js';

export { EMPTY_CUSTOM_CONTENT, admitReviewedSupplyChainRpcReceipt };

const definitionContext = new Map();

/**
 * Project a server definition/head join only when the reviewed artifact's full
 * immutable address agrees with its body. Body-only admission would allow a
 * corrupt revision number, hash, or cross-definition row to enter hydration.
 *
 * @param {Record<string, any>} definition
 * @param {Record<string, any>} revision
 */
function admittedSupabaseContentHead(definition, revision) {
  if (
    !revision
    || String(revision.definition_id) !== String(definition.id)
  ) return null;
  try {
    const item = projectSupabaseContentHead(definition, revision);
    if (!item) return null;
    if (definition.category === 'supplyChains') {
      reviewedSupplyChainRevisionEntry(item);
    }
    return item;
  } catch {
    return null;
  }
}

async function legacySupabaseList() {
  const data = await fetchAllSupabaseRows(() => supabase
    .from('custom_content')
    .select('id, category, data, created_at, updated_at')
    .order('updated_at', { ascending: false })
    .order('id', { ascending: true }));
  const grouped = emptyCustomContentGroups();
  for (const row of data || []) {
    if (!grouped[row.category]) grouped[row.category] = [];
    const item = {
      ...row.data,
      id: row.id,
      definitionId: row.id,
      isCustom: true,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
    if (row.category === 'supplyChains') {
      // The flat pre-185 table never had the dedicated reviewed command, so an
      // exact-looking graph here is still self-signed legacy input.
      continue;
    }
    grouped[row.category].push(item);
    definitionContext.set(String(row.id), {
      category: row.category,
      revisionId: null,
    });
  }
  return grouped;
}

const DEFINITION_COLUMNS =
  'id, category, local_uid, head_revision_id, archived_at, created_at, updated_at';

/**
 * Migration 188 adds reviewed lifecycle state after the immutable authorable
 * ledger shipped in 185. During a rolling deploy, retry the 185 projection
 * instead of falling all the way back to the obsolete flat table. Reviewed
 * rows are excluded because an absent generation cannot prove authority.
 *
 * @param {boolean} archived
 */
async function revisionedSupabaseDefinitions(archived) {
  const query = columns => () => {
    let builder = supabase
      .from('custom_content_definitions')
      .select(columns);
    builder = archived
      ? builder.not('archived_at', 'is', null)
      : builder.is('archived_at', null);
    return builder
      .order('updated_at', { ascending: false })
      .order('id', { ascending: true });
  };
  try {
    return await fetchAllSupabaseRows(query(
      `${DEFINITION_COLUMNS}, reviewed_lifecycle_version`,
    ));
  } catch (error) {
    if (!isMissingReviewedLifecycleColumn(error)) throw error;
    const definitions = await fetchAllSupabaseRows(query(DEFINITION_COLUMNS));
    return definitions.filter(
      definition => definition.category !== 'supplyChains',
    );
  }
}

async function revisionedSupabaseList() {
  const definitions = await revisionedSupabaseDefinitions(false);
  const revisionIds = (definitions || [])
    .map(definition => definition.head_revision_id)
    .filter(Boolean);
  const revisions = await fetchSupabaseRowsByChunks(
    revisionIds,
    chunk => () => supabase
      .from('custom_content_revisions')
      .select('id, definition_id, revision_no, schema_version, content_hash, data, created_at')
      .in('id', chunk)
      .order('id', { ascending: true }),
  );
  const revisionById = new Map(revisions.map(revision => [revision.id, revision]));
  const grouped = emptyCustomContentGroups();
  for (const definition of definitions || []) {
    const row = revisionById.get(definition.head_revision_id);
    if (!row) continue;
    const item = admittedSupabaseContentHead(definition, row);
    if (!item) continue;
    if (!grouped[definition.category]) grouped[definition.category] = [];
    grouped[definition.category].push(item);
    definitionContext.set(String(definition.id), {
      category: definition.category,
      revisionId: row.id,
    });
  }
  return grouped;
}

async function supabaseListRevisions(definitionId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const definitionResponse = await supabase
    .from('custom_content_definitions')
    .select('id, category, head_revision_id, archived_at')
    .eq('id', definitionId)
    .maybeSingle();
  if (definitionResponse.error) throw definitionResponse.error;
  if (!definitionResponse.data) return [];
  const rows = await fetchAllSupabaseRows(() => supabase
    .from('custom_content_revisions')
    .select(
      'id, definition_id, revision_no, parent_revision_id, schema_version, content_hash, data, created_at',
    )
    .eq('definition_id', definitionId)
    .order('revision_no', { ascending: false })
    .order('id', { ascending: false }));
  return rows.map(row => Object.freeze({
    id: row.id,
    definitionId: row.definition_id,
    category: definitionResponse.data.category,
    revisionNumber: row.revision_no,
    parentRevisionId: row.parent_revision_id,
    schemaVersion: row.schema_version,
    contentHash: row.content_hash,
    data: Object.freeze(detachContentJson(row.data || {})),
    createdAt: row.created_at,
    isHead: String(row.id) === String(definitionResponse.data.head_revision_id),
    definitionArchivedAt: definitionResponse.data.archived_at || null,
  }));
}

async function supabaseListEnvironmentRevisions() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const data = await fetchAllSupabaseRows(() => supabase
    .from('content_environment_revisions')
    .select('revision')
    .order('created_at', { ascending: false })
    .order('environment_revision_id', { ascending: true }));
  return (data || []).map(row => Object.freeze(detachContentJson(
    row.revision || {},
  )));
}

async function supabaseLoadActiveEnvironment() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('content_environment_activations')
    .select('environment_revision_id')
    .maybeSingle();
  if (error) throw error;
  if (!data?.environment_revision_id) return null;
  const response = await supabase
    .from('content_environment_revisions')
    .select('revision')
    .eq('environment_revision_id', data.environment_revision_id)
    .maybeSingle();
  if (response.error) throw response.error;
  return response.data?.revision || null;
}

async function supabaseLoadContentPackState(packId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return {
      packId: String(packId),
      activePackVersion: null,
      activeManifestHash: null,
      entries: {},
    };
  }
  const packResponse = await supabase
    .from('content_packs')
    .select('pack_id, active_pack_version, active_manifest_hash')
    .eq('pack_id', packId)
    .maybeSingle();
  if (packResponse.error) throw packResponse.error;

  const mappings = await fetchAllSupabaseRows(() => supabase
    .from('content_pack_entry_definitions')
    .select('pack_entry_id, definition_id')
    .eq('pack_id', packId)
    .order('pack_entry_id', { ascending: true }));
  const definitionIds = mappings.map(mapping => mapping.definition_id);
  const headByDefinition = new Map();
  if (definitionIds.length > 0) {
    const definitions = await fetchSupabaseRowsByChunks(
      definitionIds,
      chunk => () => supabase
        .from('custom_content_definitions')
        .select('id, head_revision_id')
        .in('id', chunk)
        .order('id', { ascending: true }),
    );
    for (const definition of definitions) {
      headByDefinition.set(definition.id, definition.head_revision_id);
    }
  }
  return Object.freeze({
    packId: String(packId),
    activePackVersion: packResponse.data?.active_pack_version || null,
    activeManifestHash: packResponse.data?.active_manifest_hash || null,
    entries: Object.freeze(Object.fromEntries(
      mappings.flatMap(mapping => {
        const revisionId = headByDefinition.get(mapping.definition_id);
        return revisionId ? [[mapping.pack_entry_id, {
          definitionId: mapping.definition_id,
          revisionId,
        }]] : [];
      }),
    )),
  });
}

async function supabaseListArchived() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return emptyCustomContentGroups();
  const definitions = await revisionedSupabaseDefinitions(true);
  const revisionIds = (definitions || [])
    .map(definition => definition.head_revision_id)
    .filter(Boolean);
  const revisionById = new Map();
  if (revisionIds.length) {
    const revisions = await fetchSupabaseRowsByChunks(
      revisionIds,
      chunk => () => supabase
        .from('custom_content_revisions')
        .select('id, definition_id, revision_no, content_hash, data, created_at')
        .in('id', chunk)
        .order('id', { ascending: true }),
    );
    for (const revision of revisions) {
      revisionById.set(revision.id, revision);
    }
  }
  const grouped = emptyCustomContentGroups();
  for (const definition of definitions || []) {
    const revision = revisionById.get(definition.head_revision_id);
    if (!revision) continue;
    const item = admittedSupabaseContentHead(definition, revision);
    if (!item) continue;
    if (!grouped[definition.category]) grouped[definition.category] = [];
    grouped[definition.category].push(item);
  }
  return grouped;
}

/**
 * Load one immutable pack-version closure. A version row and its manifest are
 * checked separately from entries so an honestly empty pack remains
 * distinguishable from an unavailable pack version.
 */
async function supabaseLoadPackVersionClosure(binding) {
  const versionResponse = await supabase
    .from('content_pack_versions')
    .select('pack_id, pack_version, manifest_hash')
    .eq('pack_id', binding.packId)
    .eq('pack_version', binding.packVersionId)
    .eq('manifest_hash', binding.manifestHash)
    .maybeSingle();
  if (versionResponse.error) throw versionResponse.error;
  if (!versionResponse.data) return null;

  const entries = await fetchAllSupabaseRows(() => supabase
    .from('content_pack_version_entries')
    .select('pack_entry_id, definition_id, revision_id, category, ordinal')
    .eq('pack_id', binding.packId)
    .eq('pack_version', binding.packVersionId)
    .order('ordinal', { ascending: true })
    .order('pack_entry_id', { ascending: true }));
  return {
    packId: versionResponse.data.pack_id,
    packVersionId: versionResponse.data.pack_version,
    manifestHash: versionResponse.data.manifest_hash,
    entries: entries.map(entry => ({
      packEntryId: entry.pack_entry_id,
      definitionId: entry.definition_id,
      revisionId: entry.revision_id,
      category: entry.category,
      ordinal: entry.ordinal,
    })),
  };
}

/**
 * Resolve a standalone environment from immutable cloud revisions, including
 * historical revisions that are no longer definition heads.
 */
async function supabaseResolveContentEnvironment(environment) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return {
      ok: false,
      reason: 'not_authenticated',
    };
  }
  const directDefinitions = Array.isArray(environment?.directDefinitions)
    ? environment.directDefinitions
    : [];
  const revisions = await fetchSupabaseRowsByChunks(
    directDefinitions.map(reference => reference?.revisionId),
    chunk => () => supabase
      .from('custom_content_revisions')
      .select('id, definition_id, content_hash, data')
      .in('id', chunk)
      .order('id', { ascending: true }),
  );
  const requestedPacks = Array.isArray(environment?.packVersions)
    ? environment.packVersions
    : [];
  const closures = (
    await Promise.all(requestedPacks.map(supabaseLoadPackVersionClosure))
  ).filter(Boolean);
  return resolveContentEnvironmentSnapshot(
    environment,
    revisions,
    closures,
  );
}

async function supabaseList() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return emptyCustomContentGroups();
  try {
    return await revisionedSupabaseList();
  } catch (error) {
    // Additive deployment compatibility: clients may briefly precede migration
    // 185. Fall back only when the relation itself is absent; authorization,
    // validation, and network failures remain visible.
    if (isMissingRevisionSchema(error)) return legacySupabaseList();
    throw error;
  }
}

function appliedResultMatchesPlan(preview, result, perEntry) {
  if (
    !result
    || typeof result !== 'object'
    || !Array.isArray(result.items)
    || !Array.isArray(result.archivedItems)
    || !Array.isArray(result.perEntry)
    || !sameContentValue(result.perEntry, perEntry)
  ) {
    return false;
  }
  const plan = preview?.plan || {};
  const entries = Array.isArray(plan.entries) ? plan.entries : [];
  if (
    plan.kind === CUSTOM_CONTENT_COMMAND_KIND.CREATE_REVISION
    || plan.kind === CUSTOM_CONTENT_COMMAND_KIND.PACK_IMPORT
  ) {
    return (
      perEntry.length === entries.length
      && result.items.length === entries.length
      && result.archivedItems.length === 0
      && perEntry.every((row, index) => {
        const entry = entries[index];
        return (
          entry.definitionId == null
          || row?.definitionId === entry.definitionId
        )
          && typeof row?.revisionId === 'string'
          && row.revisionId.length > 0
          && row.category === entry.category
          && (row.packEntryId ?? null) === (entry.packEntryId ?? null);
      })
      && (
        plan.kind !== CUSTOM_CONTENT_COMMAND_KIND.PACK_IMPORT
        || sameContentValue(result.pack, plan.pack)
      )
    );
  }
  if (
    plan.kind === CUSTOM_CONTENT_COMMAND_KIND.ARCHIVE
    || plan.kind === CUSTOM_CONTENT_COMMAND_KIND.RESTORE
  ) {
    const row = perEntry[0];
    const archived = plan.kind === CUSTOM_CONTENT_COMMAND_KIND.ARCHIVE;
    return perEntry.length === 1
      && row?.definitionId === plan.definitionId
      && row?.revisionId === plan.expectedHeadRevisionId
      && row?.status === (archived ? 'archived' : 'restored')
      && result.items.length === (archived ? 0 : 1)
      && result.archivedItems.length === (archived ? 1 : 0);
  }
  if (plan.kind === CUSTOM_CONTENT_COMMAND_KIND.ENVIRONMENT_MIGRATE) {
    return perEntry.length === 0
      && result.items.length === 0
      && result.archivedItems.length === 0
      && sameContentValue(result.environment, plan.environment);
  }
  return false;
}

/**
 * Admit the PostgreSQL receipt against the exact reviewed command. An RPC can
 * return after committing even when its response is incomplete, so malformed
 * success-shaped data is reconciliation-required rather than a safe failure.
 */
export function admitCustomContentRpcReceipt(data, commandId, preview) {
  const record = data && typeof data === 'object' ? data : {};
  const reportedStatus = typeof record.status === 'string'
    ? record.status
    : null;
  const result = record.result && typeof record.result === 'object'
    ? record.result
    : null;
  const perEntry = Array.isArray(record.perEntry)
    ? record.perEntry
    : [];
  const identityMatches = record.commandId === commandId
    && record.fingerprint === preview?.fingerprint;
  const confirmedApplied = identityMatches
    && record.ok === true
    && reportedStatus === 'applied'
    && appliedResultMatchesPlan(preview, result, perEntry);
  const confirmedRefusal = identityMatches
    && record.ok === false
    && ['failed', 'stale'].includes(reportedStatus);
  const confirmedConflict = reportedStatus === 'conflict';
  const status = confirmedApplied
    ? 'applied'
    : confirmedRefusal
      ? reportedStatus
      : confirmedConflict
        ? 'failed'
        : 'reconcile-required';
  const confirmed = confirmedApplied || confirmedRefusal || confirmedConflict;
  return Object.freeze({
    ok: confirmedApplied,
    status,
    commandId,
    fingerprint: record.fingerprint || null,
    reason: record.reason || (
      confirmedConflict
        ? 'command_id_conflict'
        : confirmed
          ? null
          : 'custom_content_rpc_receipt_mismatch'
    ),
    replayed: record.replayed === true,
    persistence: Object.freeze({
      state: confirmed ? 'confirmed' : 'unconfirmed',
      authority: 'supabase-transaction',
    }),
    result,
    perEntry: Object.freeze([...perEntry]),
    needsReconciliation: !confirmed,
  });
}

async function supabaseExecute(preview, options = {}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return customContentLocalReceipt({
      commandId: options.commandId || 'cmd:custom-content:unauthenticated',
      status: 'failed',
      reason: 'not_authenticated',
    });
  }
  if (options.ownerId && String(options.ownerId) !== String(user.id)) {
    return customContentLocalReceipt({
      commandId: options.commandId || 'cmd:custom-content:owner-changed',
      status: 'failed',
      reason: 'auth_session_changed',
    });
  }
  const commandId = options.commandId
    || customContentCommandId(preview.plan, preview.fingerprint, user.id);
  try {
    const { data, error } = await supabase.rpc('apply_custom_content_command', {
      p_expected_owner: user.id,
      p_command_id: commandId,
      p_preview_fingerprint: preview.fingerprint,
      p_plan: preview.plan,
    });
    if (error) {
      if (isMissingRevisionSchema(error)) throw Object.assign(
        new Error('Custom-content revision persistence is not deployed.'),
        { code: 'custom_content_revision_schema_missing', cause: error },
      );
      throw error;
    }
    return admitCustomContentRpcReceipt(data, commandId, preview);
  } catch (error) {
    return Object.freeze({
      ok: false,
      status: 'reconcile-required',
      commandId,
      reason: error?.code || error?.message || 'custom_content_command_ambiguous',
      replayed: false,
      persistence: Object.freeze({
        state: 'unconfirmed',
        authority: 'supabase-transaction',
      }),
      result: null,
      perEntry: Object.freeze([]),
      needsReconciliation: true,
    });
  }
}

async function executePreview(preview, options = {}) {
  return isConfigured
    ? supabaseExecute(preview, options)
    : executeLocalCustomContentCommand(preview, options);
}

function appliedOrThrow(receipt) {
  if (receipt.ok) return receipt;
  const error = Object.assign(
    new Error(receipt.reason || 'Custom-content command was not applied.'),
    {
      code: receipt.reason || receipt.status,
      commandReceipt: receipt,
    },
  );
  throw error;
}

async function resolveDefinition(id, item = null, options = {}) {
  const cached = definitionContext.get(String(id));
  if (cached) return cached;
  if (options.category || item?.category) {
    return {
      category: options.category || item.category,
      revisionId: options.expectedHeadRevisionId || item?.revisionId || null,
    };
  }
  if (!isConfigured) {
    const definition = await resolveLocalCustomContentDefinition(id, options);
    if (definition) return definition;
  } else {
    const { data, error } = await supabase
      .from('custom_content_definitions')
      .select('category, head_revision_id')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    if (data) {
      return {
        category: data.category,
        revisionId: data.head_revision_id,
      };
    }
  }
  throw Object.assign(new Error('Custom-content definition is unavailable.'), {
    code: 'definition_unavailable',
  });
}

async function add(category, item, options = {}) {
  const definitionId = options.definitionId || makeCustomContentUuid();
  const preview = previewCustomContentCommand({
    kind: CUSTOM_CONTENT_COMMAND_KIND.CREATE_REVISION,
    entries: [{
      definitionId,
      category,
      data: {
        ...item,
        localUid: item?.localUid || makeCustomContentLocalUid(),
      },
    }],
  }, options);
  const receipt = appliedOrThrow(await executePreview(preview, options));
  const saved = receipt.result?.items?.[0] || {
    ...item,
    id: definitionId,
    definitionId,
    isCustom: true,
  };
  definitionContext.set(String(saved.definitionId || saved.id), {
    category,
    revisionId: saved.revisionId || null,
  });
  return Object.freeze({ ...saved, commandReceipt: receipt });
}

async function update(id, item, options = {}) {
  const context = await resolveDefinition(id, item, options);
  const expectedHeadRevisionId = options.expectedHeadRevisionId
    || item?.revisionId
    || context.revisionId;
  const preview = previewCustomContentCommand({
    kind: CUSTOM_CONTENT_COMMAND_KIND.CREATE_REVISION,
    entries: [{
      definitionId: String(id),
      expectedHeadRevisionId,
      category: context.category,
      data: item,
    }],
  }, options);
  const receipt = appliedOrThrow(await executePreview(preview, options));
  const saved = receipt.result?.items?.[0] || null;
  if (saved) {
    definitionContext.set(String(id), {
      category: context.category,
      revisionId: saved.revisionId,
    });
  }
  return Object.freeze({
    id,
    updatedAt: saved?.updatedAt || new Date().toISOString(),
    revisionId: saved?.revisionId || expectedHeadRevisionId,
    contentHash: saved?.contentHash || contentRevisionHash(
      context.category,
      authoredDataOf(item),
    ),
    item: saved,
    commandReceipt: receipt,
  });
}

async function archive(id, options = {}) {
  const context = await resolveDefinition(id, null, options);
  const preview = previewCustomContentCommand({
    kind: CUSTOM_CONTENT_COMMAND_KIND.ARCHIVE,
    definitionId: String(id),
    expectedHeadRevisionId: options.expectedHeadRevisionId || context.revisionId,
  });
  return appliedOrThrow(await executePreview(preview, options));
}

async function restore(id, options = {}) {
  const context = await resolveDefinition(id, null, options);
  const preview = previewCustomContentCommand({
    kind: CUSTOM_CONTENT_COMMAND_KIND.RESTORE,
    definitionId: String(id),
    expectedHeadRevisionId: options.expectedHeadRevisionId || context.revisionId,
  });
  return appliedOrThrow(await executePreview(preview, options));
}

// bulkInsert() retired 2026-07-27 (R-5b #6) with content.definition.mass-update:
// it had zero callers (the local→cloud cutover uses importArchive), and a batch
// of N definitions is a create-revision preview with N entries.

async function importPack(pack, prepared, options = {}) {
  if (prepared?.rejected?.length || prepared?.diagnostics?.atomic === false) {
    return Object.freeze({
      ok: false,
      status: 'failed',
      commandId: null,
      reason: 'pack_preview_has_rejections',
      persistence: Object.freeze({ state: 'not-required' }),
      result: { rejected: prepared.rejected || [] },
      perEntry: Object.freeze([]),
    });
  }
  const installed = options.installedState || await (
    isConfigured
      ? supabaseLoadContentPackState(pack.packId)
      : loadLocalContentPackState(pack.packId, options)
  );
  const preview = previewCustomContentCommand({
    kind: CUSTOM_CONTENT_COMMAND_KIND.PACK_IMPORT,
    pack: {
      packId: pack.packId,
      packVersion: pack.packVersion,
      manifestHash: pack.manifestHash,
      name: pack.name,
      // The immutable command journal is also the archive source of truth.
      // Persist the admitted v2 manifest whole so a later account restore does
      // not quietly discard license, tunables, dependencies, or future fields.
      manifest: pack,
      expectedActivePackVersion: installed.activePackVersion,
      expectedActiveManifestHash: installed.activeManifestHash,
    },
    entries: (prepared?.items || []).map(entry => {
      const existing = installed.entries?.[entry.packEntryId] || null;
      return {
        definitionId: existing?.definitionId || entry.definitionId || null,
        expectedHeadRevisionId:
          existing?.revisionId || entry.expectedHeadRevisionId || null,
        packEntryId: entry.packEntryId,
        category: entry.bucket,
        data: entry.item,
      };
    }),
  }, options);
  if (
    options.previewFingerprint
    && options.previewFingerprint !== preview.fingerprint
  ) {
    return Object.freeze({
      ok: false,
      status: 'stale',
      commandId: null,
      reason: 'pack_preview_fingerprint_mismatch',
      persistence: Object.freeze({ state: 'not-required' }),
      result: null,
      perEntry: Object.freeze([]),
    });
  }
  return executePreview(preview, options);
}

async function localClear(options = {}) {
  await clearLocalCustomContent(options);
  definitionContext.clear();
}

export const customContentService = {
  list: isConfigured ? supabaseList : listLocalCustomContent,
  listCustomContentRevisions: isConfigured
    ? supabaseListRevisions
    : listLocalCustomContentRevisions,
  loadArchivedCustomContent: isConfigured
    ? supabaseListArchived
    : listLocalArchivedCustomContent,
  listContentEnvironmentRevisions: isConfigured
    ? supabaseListEnvironmentRevisions
    : listLocalContentEnvironmentRevisions,
  loadActiveContentEnvironment: isConfigured
    ? supabaseLoadActiveEnvironment
    : loadLocalActiveContentEnvironment,
  resolveContentEnvironment: isConfigured
    ? supabaseResolveContentEnvironment
    : resolveLocalContentEnvironment,
  loadContentPackState: isConfigured
    ? supabaseLoadContentPackState
    : loadLocalContentPackState,
  executeCommand: executePreview,
  executeReviewedSupplyChainCommand,
  resolveReviewedSupplyChainIdentity,
  add,
  update,
  // Compatibility name. Destructive delete is intentionally no longer exposed;
  // callers archive the definition and immutable revisions remain referenceable.
  delete: archive,
  archive,
  restore,
  importPack,
  exportArchive,
  importArchive,
  localExportArchive: exportLocalCustomContentArchive,
  localImportArchive: importLocalCustomContentArchive,
  localClearAfterArchive: clearLocalCustomContentAfterArchive,
  localClearArchivesAfterSnapshot:
    clearLocalCustomContentArchivesAfterSnapshot,
  localList: listLocalCustomContent,
  localClear,
  readLocalForMigration: readLocalCustomContentForMigration,
  isConfigured,
};
