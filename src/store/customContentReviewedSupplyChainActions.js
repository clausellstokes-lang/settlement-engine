/**
 * Store orchestration for reviewed derived supply chains.
 *
 * These actions are intentionally outside generic definition authoring. They
 * build the dedicated immutable command, project only a confirmed authority
 * receipt, retain archived heads for restore, and reject owner changes across
 * every asynchronous boundary.
 */

import { customContentService } from '../lib/customContent.js';
import { invalidateCustomDepsIfLoaded } from '../lib/customContentSource.js';

const reviewedArtifactIdentity = item => String(
  item?.definitionId || item?.id || '',
);

/**
 * A command response may arrive after a newer command for the same artifact.
 * Lifecycle generation is the durable ordering token; equal generations must
 * also describe the same head and active/archive state.
 *
 * @param {Record<string, any>} state
 * @param {string} artifactId
 * @param {Record<string, any>} projected
 * @param {boolean} responseArchived
 */
function reviewedResponseWasSuperseded(
  state,
  artifactId,
  projected,
  responseArchived,
) {
  const candidates = [
    ...(state.customContent.supplyChains || []).map(item => ({
      item,
      archived: false,
    })),
    ...(state.customContentArchived.supplyChains || []).map(item => ({
      item,
      archived: true,
    })),
  ].filter(candidate => (
    reviewedArtifactIdentity(candidate.item) === String(artifactId)
  ));
  if (candidates.length === 0) return false;
  const responseGeneration = projected?.reviewedLifecycleVersion;
  if (!Number.isInteger(responseGeneration)) return true;
  const currentGeneration = Math.max(...candidates.map(candidate => (
    Number.isInteger(candidate.item?.reviewedLifecycleVersion)
      ? candidate.item.reviewedLifecycleVersion
      : -1
  )));
  if (currentGeneration > responseGeneration) return true;
  if (currentGeneration < responseGeneration) return false;
  return candidates.some(candidate => (
    candidate.item?.revisionId !== projected?.revisionId
    || candidate.archived !== responseArchived
  ));
}

function makeReviewedArtifactId() {
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

/**
 * @param {{
 *   set:(recipe:(state:Record<string, any>)=>void)=>void,
 *   get:()=>Record<string, any>,
 *   ownerIdFromState:(state:Record<string, any>)=>string,
 *   localWrite:(content:unknown, ownerId:string)=>void,
 *   commandFailure:(reason:string,status?:string)=>Readonly<Record<string, any>>,
 * }} dependencies
 */
export function createReviewedSupplyChainActions(dependencies) {
  const {
    set,
    get,
    ownerIdFromState,
    localWrite,
    commandFailure,
  } = dependencies;

  /**
   * Persist one strictly reviewed derived supply-chain artifact.
   *
   * @param {{
   *   kind?:string,
 *   artifactId?:string|null,
 *   expectedHeadRevisionId?:string|null,
 *   expectedLifecycleVersion?:number|null,
   *   chain?:Record<string, unknown>|null,
   *   previewFingerprint?:string|null,
   * }} [request]
   */
  const applyReviewedSupplyChainCommand = async (request = {}) => {
    const {
      previewReviewedSupplyChainCommand,
      REVIEWED_SUPPLY_CHAIN_COMMAND_KIND,
    } = await import(
      '../domain/content/reviewedSupplyChainPersistence.js'
    );
    const artifactId = request.artifactId || makeReviewedArtifactId();
    let preview;
    try {
      preview = previewReviewedSupplyChainCommand({
        schemaVersion: 1,
        kind: request.kind,
        artifactId,
        expectedHeadRevisionId: request.expectedHeadRevisionId || null,
        expectedLifecycleVersion:
          request.expectedLifecycleVersion ?? null,
        chain: request.chain || null,
      });
    } catch (error) {
      const reason = error instanceof Error
        ? error.message
        : 'Invalid reviewed supply-chain command.';
      const receipt = commandFailure(reason);
      set((state) => {
        state.customContentError = reason;
        state.customContentLastCommandReceipt = receipt;
      });
      return receipt;
    }
    if (
      request.previewFingerprint
      && request.previewFingerprint !== preview.fingerprint
    ) {
      const receipt = commandFailure(
        'The reviewed supply-chain preview is stale.',
        'stale',
      );
      set((state) => {
        state.customContentError = receipt.reason;
        state.customContentLastCommandReceipt = receipt;
      });
      return receipt;
    }

    const ownerId = ownerIdFromState(get());
    const receipt = await customContentService
      .executeReviewedSupplyChainCommand(preview, { ownerId });
    const confirmed = (
      receipt?.ok === true
      && receipt.status === 'applied'
      && receipt.persistence?.state === 'confirmed'
    );
    if (ownerIdFromState(get()) !== ownerId) {
      const changedOwner = commandFailure('auth_session_changed', 'stale');
      set((state) => {
        state.customContentError = changedOwner.reason;
        state.customContentLastCommandReceipt = changedOwner;
      });
      return changedOwner;
    }
    if (!confirmed) {
      set((state) => {
        state.customContentError = receipt?.reason
          || 'The reviewed supply chain was not persisted.';
        state.customContentLastCommandReceipt = receipt;
      });
      return receipt;
    }
    const responseArchived =
      request.kind === REVIEWED_SUPPLY_CHAIN_COMMAND_KIND.REMOVE;
    const projected = responseArchived
      ? receipt.result?.archivedItem
      : receipt.result?.item;
    if (
      !projected
      || reviewedResponseWasSuperseded(
        get(),
        artifactId,
        projected,
        responseArchived,
      )
    ) {
      return Object.freeze({
        ...receipt,
        ok: false,
        status: 'stale',
        reason: 'reviewed_supply_chain_response_superseded',
        needsReconciliation: false,
      });
    }

    set((state) => {
      const bucket = state.customContent.supplyChains || [];
      if (request.kind === REVIEWED_SUPPLY_CHAIN_COMMAND_KIND.REMOVE) {
        state.customContent.supplyChains = bucket.filter(item => (
          String(item.definitionId || item.id) !== String(artifactId)
        ));
        const archivedItem = receipt.result?.archivedItem;
        if (archivedItem) {
          const archivedBucket =
            state.customContentArchived.supplyChains || [];
          state.customContentArchived.supplyChains = [
            archivedItem,
            ...archivedBucket.filter(item => (
              String(item.definitionId || item.id) !== String(artifactId)
            )),
          ];
        }
      } else {
        const item = receipt.result?.item;
        if (item) {
          const index = bucket.findIndex(existing => (
            String(existing.definitionId || existing.id)
              === String(artifactId)
          ));
          if (index >= 0) bucket[index] = item;
          else bucket.unshift(item);
          state.customContent.supplyChains = bucket;
          state.customContentArchived.supplyChains = (
            state.customContentArchived.supplyChains || []
          ).filter(archived => (
            String(archived.definitionId || archived.id)
              !== String(artifactId)
          ));
        }
      }
      localWrite(state.customContent, ownerIdFromState(state));
      state.customContentError = null;
      state.customContentLastCommandReceipt = receipt;
    });
    invalidateCustomDepsIfLoaded();
    return receipt;
  };

  /**
   * Confirm a discovered chain or append a new immutable review revision.
   *
   * @param {Record<string, unknown>} chain
   */
  const saveReviewedSupplyChain = async (chain) => {
    const { reviewedSupplyChainRevisionEntry } = await import(
      '../domain/content/reviewedSupplyChainPersistence.js'
    );
    const persistedCandidates = [
      ...(get().customContent.supplyChains || []),
      ...(get().customContentArchived.supplyChains || []),
    ].filter((item) => {
      try {
        reviewedSupplyChainRevisionEntry(item);
        return (
          Number.isInteger(item?.reviewedLifecycleVersion)
          && item.reviewedLifecycleVersion >= 1
        );
      } catch {
        return false;
      }
    });
    let existing = persistedCandidates.find(
      item => item?.chainId === chain?.chainId,
    );
    if (!existing) {
      const ownerId = ownerIdFromState(get());
      const identity = await customContentService
        .resolveReviewedSupplyChainIdentity(chain?.chainId, { ownerId });
      if (ownerIdFromState(get()) !== ownerId) {
        return commandFailure('auth_session_changed', 'stale');
      }
      if (identity) {
        existing = {
          definitionId: identity.artifactId,
          revisionId: identity.headRevisionId,
          reviewedLifecycleVersion: identity.lifecycleVersion,
        };
      }
    }
    return get().applyReviewedSupplyChainCommand({
      kind: 'content.reviewed-supply-chain.confirm',
      artifactId: existing?.definitionId || existing?.id || null,
      expectedHeadRevisionId: existing?.revisionId || null,
      expectedLifecycleVersion:
        existing?.reviewedLifecycleVersion ?? null,
      chain,
    });
  };

  /**
   * Archive one reviewed chain by exact artifact/head identity.
   *
   * @param {string} artifactId
   */
  const removeReviewedSupplyChain = async (artifactId) => {
    const existing = (get().customContent.supplyChains || []).find(item => (
      String(item?.definitionId || item?.id) === String(artifactId)
    ));
    if (!existing) {
      return commandFailure(
        'reviewed_supply_chain_unavailable',
        'stale',
      );
    }
    return get().applyReviewedSupplyChainCommand({
      kind: 'content.reviewed-supply-chain.remove',
      artifactId: existing.definitionId || existing.id,
      expectedHeadRevisionId: existing.revisionId,
      expectedLifecycleVersion: existing.reviewedLifecycleVersion,
      chain: null,
    });
  };

  return Object.freeze({
    applyReviewedSupplyChainCommand,
    saveReviewedSupplyChain,
    removeReviewedSupplyChain,
  });
}
