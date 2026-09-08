/**
 * Read model for the offline custom-content revision ledger.
 *
 * Querying active heads, history, environments, packs, and reviewed artifact
 * identities is a separate responsibility from mutating the ledger. The
 * storage reader and owner lock are injected so these projections remain easy
 * to exercise without exposing the browser persistence substrate.
 */

import {
  admitReviewedSupplyChain,
  REVIEWED_SUPPLY_CHAIN_CATEGORY,
} from '../domain/content/reviewedSupplyChainPersistence.js';
import {
  detachContentJson,
} from '../domain/content/contentFingerprint.js';
import { compareCodepoint } from '../domain/deterministicSort.js';
import {
  resolveEnvironmentFromLocalLedger,
} from './customContentLocalEnvironment.js';
import {
  parseLocalPackEntryKey,
} from './customContentLocalPackKeys.js';
import {
  groupedFromLocalLedger,
  revisionHistoryFromLocalLedger,
} from './customContentLocalProjection.js';

/**
 * @param {{
 *   withLock:(ownerId:string, task:()=>unknown)=>Promise<unknown>,
 *   load:(ownerId:string)=>Record<string, any>,
 * }} authority
 */
export function createCustomContentLocalQueries(authority) {
  /** @param {Record<string, any>} options */
  const ownerOf = options => options.ownerId || options.ownerKey || 'anon';

  /** @param {Record<string, any>} [options] */
  const listLocalCustomContent = (options = {}) => {
    const ownerId = ownerOf(options);
    return authority.withLock(ownerId, () => (
      groupedFromLocalLedger(authority.load(ownerId))
    ));
  };

  /**
   * @param {string} definitionId
   * @param {Record<string, any>} [options]
   */
  const listLocalCustomContentRevisions = (
    definitionId,
    options = {},
  ) => {
    const ownerId = ownerOf(options);
    return authority.withLock(ownerId, () => (
      revisionHistoryFromLocalLedger(
        authority.load(ownerId),
        definitionId,
      )
    ));
  };

  /** @param {Record<string, any>} [options] */
  const listLocalArchivedCustomContent = (options = {}) => {
    const ownerId = ownerOf(options);
    return authority.withLock(ownerId, () => (
      groupedFromLocalLedger(authority.load(ownerId), {
        includeArchived: true,
        onlyArchived: true,
      })
    ));
  };

  /** @param {Record<string, any>} [options] */
  const listLocalContentEnvironmentRevisions = (options = {}) => {
    const ownerId = ownerOf(options);
    return authority.withLock(ownerId, () => (
      Object.values(authority.load(ownerId).environments || {})
        .sort((left, right) => (
          Number(right.revisionNumber || 0)
          - Number(left.revisionNumber || 0)
          || compareCodepoint(
            String(right.environmentRevisionId || ''),
            String(left.environmentRevisionId || ''),
          )
        ))
        .map(environment => Object.freeze(detachContentJson(environment)))
    ));
  };

  /** @param {Record<string, any>} [options] */
  const loadLocalActiveContentEnvironment = (options = {}) => {
    const ownerId = ownerOf(options);
    return authority.withLock(ownerId, () => {
      const ledger = authority.load(ownerId);
      return ledger.environments?.[ledger.activeEnvironmentRevisionId] || null;
    });
  };

  /**
   * @param {Record<string, any>} environment
   * @param {Record<string, any>} [options]
   */
  const resolveLocalContentEnvironment = (environment, options = {}) => {
    const ownerId = ownerOf(options);
    return authority.withLock(ownerId, () => (
      resolveEnvironmentFromLocalLedger(
        authority.load(ownerId),
        environment,
      )
    ));
  };

  /**
   * @param {string} packId
   * @param {Record<string, any>} [options]
   */
  const loadLocalContentPackState = (packId, options = {}) => {
    const ownerId = ownerOf(options);
    return authority.withLock(ownerId, () => {
      const ledger = authority.load(ownerId);
      const active = ledger.activePacks?.[String(packId)] || null;
      const entries = {};
      for (const [key, definitionId] of Object.entries(
        ledger.packEntryDefinitions || {},
      )) {
        const parsed = parseLocalPackEntryKey(key);
        if (parsed?.packId !== String(packId)) continue;
        const definition = ledger.definitions?.[definitionId];
        if (!definition) continue;
        entries[parsed.packEntryId] = {
          definitionId,
          revisionId: definition.headRevisionId,
        };
      }
      return Object.freeze({
        packId: String(packId),
        activePackVersion: active?.packVersion || null,
        activeManifestHash: active?.manifestHash || null,
        entries: Object.freeze(entries),
      });
    });
  };

  /**
   * @param {string} id
   * @param {Record<string, any>} [options]
   */
  const resolveLocalCustomContentDefinition = (id, options = {}) => {
    const ownerId = ownerOf(options);
    return authority.withLock(ownerId, () => {
      const definition = authority.load(ownerId).definitions[String(id)];
      if (!definition) return null;
      return {
        category: definition.category,
        revisionId: definition.headRevisionId,
      };
    });
  };

  /**
   * Resolve an active or archived reviewed chain to the one exact head required
   * for a restore or replacement compare-and-swap.
   *
   * @param {string} chainId
   * @param {Record<string, any>} [options]
   */
  const resolveLocalReviewedSupplyChainIdentity = (
    chainId,
    options = {},
  ) => {
    const ownerId = ownerOf(options);
    return authority.withLock(ownerId, () => {
      const ledger = authority.load(ownerId);
      const matches = Object.values(ledger.definitions || {}).flatMap(
        (definition) => {
          if (
            definition?.category !== REVIEWED_SUPPLY_CHAIN_CATEGORY
          ) return [];
          const revision = ledger.revisions?.[definition.headRevisionId];
          if (revision?.data?.chainId !== String(chainId)) return [];
          const admission = admitReviewedSupplyChain(revision.data);
          if (!admission.ok) return [];
          return [{
            artifactId: definition.id,
            headRevisionId: definition.headRevisionId,
            lifecycleVersion: definition.reviewedLifecycleVersion,
            archived: Boolean(definition.archivedAt),
          }];
        },
      );
      return matches.length === 1 ? Object.freeze(matches[0]) : null;
    });
  };

  return Object.freeze({
    listLocalCustomContent,
    listLocalCustomContentRevisions,
    listLocalArchivedCustomContent,
    listLocalContentEnvironmentRevisions,
    loadLocalActiveContentEnvironment,
    resolveLocalContentEnvironment,
    loadLocalContentPackState,
    resolveLocalCustomContentDefinition,
    resolveLocalReviewedSupplyChainIdentity,
  });
}
