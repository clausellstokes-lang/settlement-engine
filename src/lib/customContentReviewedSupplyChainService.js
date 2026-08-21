/**
 * Persistence transport for reviewed derived supply chains.
 *
 * Generic custom-content service methods author vocabulary definitions. This
 * module owns the intentionally separate reviewed-artifact RPC, strict receipt
 * admission, and active-or-archived identity lookup. Local and cloud paths
 * expose the same command contract while retaining their distinct authorities.
 */

import { supabase, isConfigured } from './supabase.js';
import {
  customContentLocalReceipt,
  executeLocalReviewedSupplyChainCommand,
  resolveLocalReviewedSupplyChainIdentity,
} from './customContentLocalLedger.js';
import {
  admitReviewedSupplyChain,
  previewReviewedSupplyChainCommand,
  REVIEWED_SUPPLY_CHAIN_COMMAND_KIND,
  reviewedSupplyChainContentHash,
  reviewedSupplyChainRevisionEntry,
} from '../domain/content/reviewedSupplyChainPersistence.js';
import {
  fingerprintContent,
} from '../domain/content/contentFingerprint.js';
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

const MAX_LIFECYCLE_VERSION = 2_147_483_647;

/**
 * Admit an RPC receipt against the exact reviewed command proposal.
 *
 * Success-shaped but incomplete data is reconciliation-required because the
 * transaction may have committed before a response was damaged in transit.
 *
 * @param {unknown} value
 * @param {string} commandId
 * @param {{plan:Record<string, any>,fingerprint:string}} preview
 */
export function admitReviewedSupplyChainRpcReceipt(
  value,
  commandId,
  preview,
) {
  const record = value && typeof value === 'object'
    ? /** @type {Record<string, any>} */ (value)
    : {};
  const result = record.result && typeof record.result === 'object'
    ? record.result
    : null;
  const identityMatches = (
    record.commandId === commandId
    && record.fingerprint === preview.fingerprint
    && result?.artifactId === preview.plan.artifactId
  );
  const projected = result?.item || result?.archivedItem || null;
  const projectionAdmission = projected
    ? admitReviewedSupplyChain(projected, {
        allowPersistenceFields: true,
      })
    : null;
  let revisionEntry;
  try {
    revisionEntry = projected
      ? reviewedSupplyChainRevisionEntry(projected)
      : null;
  } catch {
    revisionEntry = null;
  }
  const headMatches = (
    typeof result?.headRevisionId === 'string'
    && result.headRevisionId.length > 0
    && projected?.revisionId === result.headRevisionId
    && projected?.definitionId === preview.plan.artifactId
  );
  const projectedHash = projectionAdmission?.ok
    ? reviewedSupplyChainContentHash(projected)
    : null;
  const lifecycle = projected?.reviewedLifecycleVersion;
  const expectedLifecycle = preview.plan.expectedLifecycleVersion;
  const lifecycleMatches = (
    Number.isInteger(lifecycle)
    && lifecycle >= 1
    && lifecycle <= MAX_LIFECYCLE_VERSION
    && (
      expectedLifecycle == null
        ? lifecycle === 1
        : (
            lifecycle === expectedLifecycle
            || (
              expectedLifecycle < MAX_LIFECYCLE_VERSION
              && lifecycle === expectedLifecycle + 1
            )
          )
    )
  );
  const kindMatches = (
    preview.plan.kind === REVIEWED_SUPPLY_CHAIN_COMMAND_KIND.CONFIRM
      ? Boolean(
          result?.item
          && !result?.archivedItem
          && result.item.archivedAt == null
          && projectionAdmission?.ok
          && revisionEntry
          && projectedHash === result.item.contentHash
          && projectedHash === reviewedSupplyChainContentHash(
            preview.plan.chain,
          )
          && sameContentValue(
            projectionAdmission.chain,
            preview.plan.chain,
          ),
        )
      : Boolean(
          result?.archivedItem
          && !result?.item
          && projectionAdmission?.ok
          && revisionEntry
          && result.archivedItem.archivedAt
          && projectedHash === result.archivedItem.contentHash
          && result.archivedItem.revisionId
            === preview.plan.expectedHeadRevisionId,
        )
  );
  const confirmedApplied = (
    identityMatches
    && record.ok === true
    && record.status === 'applied'
    && headMatches
    && kindMatches
    && lifecycleMatches
  );
  const confirmedRefusal = (
    identityMatches
    && record.ok === false
    && ['failed', 'stale'].includes(record.status)
  );
  const status = confirmedApplied
    ? 'applied'
    : confirmedRefusal
      ? record.status
      : 'reconcile-required';
  return Object.freeze({
    ...record,
    ok: confirmedApplied,
    status,
    commandId,
    fingerprint: record.fingerprint || null,
    reason: record.reason || (
      status === 'reconcile-required'
        ? 'reviewed_supply_chain_rpc_receipt_mismatch'
        : null
    ),
    persistence: Object.freeze({
      state: status === 'reconcile-required' ? 'unconfirmed' : 'confirmed',
      authority: 'supabase-transaction',
    }),
    result,
    perEntry: Object.freeze(
      Array.isArray(record.perEntry) ? [...record.perEntry] : [],
    ),
    needsReconciliation: status === 'reconcile-required',
  });
}

/**
 * Execute the non-authorable reviewed-artifact command.
 *
 * @param {{plan:Record<string, any>,fingerprint:string}} preview
 * @param {{ownerId?:string,commandId?:string}} [options]
 */
export async function executeReviewedSupplyChainCommand(
  preview,
  options = {},
) {
  let admittedPreview;
  try {
    admittedPreview = previewReviewedSupplyChainCommand(preview?.plan);
  } catch {
    return customContentLocalReceipt({
      commandId: options.commandId || 'cmd:reviewed-supply-chain:invalid',
      status: 'failed',
      reason: 'reviewed_supply_chain_plan_invalid',
    });
  }
  if (admittedPreview.fingerprint !== preview?.fingerprint) {
    return customContentLocalReceipt({
      commandId: options.commandId
        || 'cmd:reviewed-supply-chain:fingerprint-mismatch',
      status: 'failed',
      reason: 'reviewed_supply_chain_preview_fingerprint_mismatch',
    });
  }
  preview = admittedPreview;
  if (!isConfigured) {
    return executeLocalReviewedSupplyChainCommand(preview, options);
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return customContentLocalReceipt({
      commandId: options.commandId
        || 'cmd:reviewed-supply-chain:unauthenticated',
      status: 'failed',
      reason: 'not_authenticated',
    });
  }
  if (options.ownerId && String(options.ownerId) !== String(user.id)) {
    return customContentLocalReceipt({
      commandId: options.commandId
        || 'cmd:reviewed-supply-chain:owner-changed',
      status: 'failed',
      reason: 'auth_session_changed',
    });
  }
  const commandId = options.commandId
    || `cmd:reviewed-supply-chain:${fingerprintContent({
      ownerId: user.id,
      fingerprint: preview.fingerprint,
      artifactId: preview.plan.artifactId,
    })}`;
  try {
    const { data, error } = await supabase.rpc(
      'apply_reviewed_supply_chain_command',
      {
        p_expected_owner: user.id,
        p_command_id: commandId,
        p_preview_fingerprint: preview.fingerprint,
        p_plan: preview.plan,
      },
    );
    if (error) {
      if (isMissingRevisionSchema(error)) {
        throw Object.assign(
          new Error('Reviewed supply-chain persistence is not deployed.'),
          {
            code: 'reviewed_supply_chain_schema_missing',
            cause: error,
          },
        );
      }
      throw error;
    }
    return admitReviewedSupplyChainRpcReceipt(data, commandId, preview);
  } catch (error) {
    const failure = /** @type {Record<string, any>} */ (error);
    return Object.freeze({
      ok: false,
      status: 'reconcile-required',
      commandId,
      fingerprint: preview.fingerprint,
      reason: failure?.code
        || failure?.message
        || 'reviewed_supply_chain_command_ambiguous',
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

/**
 * Find the unique active-or-archived artifact head for one discovered chain.
 *
 * @param {string} chainId
 * @param {{ownerId?:string}} [options]
 */
export async function resolveReviewedSupplyChainIdentity(
  chainId,
  options = {},
) {
  if (!isConfigured) {
    return resolveLocalReviewedSupplyChainIdentity(chainId, options);
  }
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  if (options.ownerId && String(options.ownerId) !== String(user.id)) {
    return null;
  }
  let definitions;
  try {
    definitions = await fetchAllSupabaseRows(() => supabase
      .from('custom_content_definitions')
      .select('id, category, local_uid, head_revision_id, archived_at, created_at, updated_at, reviewed_lifecycle_version')
      .eq('category', 'supplyChains')
      .order('updated_at', { ascending: false })
      .order('id', { ascending: true }));
  } catch (error) {
    // A 185-187 database cannot prove reviewed lifecycle authority. Return no
    // identity during the rolling window; never reinterpret a generationless
    // row as a confirmed artifact.
    if (
      isMissingRevisionSchema(error)
      || isMissingReviewedLifecycleColumn(error)
    ) return null;
    throw error;
  }
  const revisions = await fetchSupabaseRowsByChunks(
    definitions.map(definition => definition.head_revision_id),
    chunk => () => supabase
      .from('custom_content_revisions')
      .select('id, definition_id, revision_no, content_hash, data, created_at')
      .in('id', chunk)
      .order('id', { ascending: true }),
  );
  const revisionById = new Map(revisions.map(revision => [
    revision.id,
    revision,
  ]));
  const matches = definitions.flatMap((definition) => {
    const revision = revisionById.get(definition.head_revision_id);
    if (
      !revision
      || String(revision.definition_id) !== String(definition.id)
      || revision.data?.chainId !== String(chainId)
    ) return [];
    let item;
    try {
      item = projectSupabaseContentHead(definition, revision);
      reviewedSupplyChainRevisionEntry(item);
    } catch {
      return [];
    }
    return [{
      artifactId: definition.id,
      headRevisionId: definition.head_revision_id,
      lifecycleVersion:
        /** @type {Record<string, any>} */ (item)
          .reviewedLifecycleVersion,
      archived: Boolean(definition.archived_at),
    }];
  });
  return matches.length === 1 ? Object.freeze(matches[0]) : null;
}
