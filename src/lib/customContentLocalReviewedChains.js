/**
 * Reviewed supply-chain authority for the offline immutable ledger.
 *
 * This is deliberately not a second custom-definition writer. It admits the
 * exact derived-chain command, verifies every custom node against the current
 * definition head, and appends or archives only the reviewed artifact. Storage
 * and locking are injected by `customContentLocalLedger` so this module owns
 * the domain transaction without owning browser persistence.
 */

import {
  admitReviewedSupplyChain,
  previewReviewedSupplyChainCommand,
  projectReviewedSupplyChainDefinitionHead,
  REVIEWED_SUPPLY_CHAIN_CATEGORY,
  REVIEWED_SUPPLY_CHAIN_COMMAND_KIND,
  reviewedSupplyChainContentHash,
} from '../domain/content/reviewedSupplyChainPersistence.js';
import {
  detachContentJson,
  fingerprintContent,
} from '../domain/content/contentFingerprint.js';
import {
  contentRevisionHash,
} from '../domain/content/customContentVersioning.js';

const CATEGORY_BY_KIND = Object.freeze({
  institution: 'institutions',
  service: 'services',
  resource: 'resources',
  good: 'tradeGoods',
});
const MAX_LIFECYCLE_VERSION = 2_147_483_647;

/**
 * @typedef {Object} LocalReviewedSupplyChainAuthority
 * @property {(ownerId:string, task:()=>unknown)=>Promise<unknown>} withLock
 * @property {(ownerId:string)=>Record<string, any>} load
 * @property {(ledger:Record<string, any>, ownerId:string)=>void} persist
 * @property {()=>string} makeRevisionId
 * @property {()=>string} now
 * @property {(input:Record<string, any>)=>Readonly<Record<string, any>>} receipt
 */

/**
 * Test one admitted custom node against the exact active owner-ledger head.
 *
 * @param {Record<string, any>} ledger
 * @param {Record<string, any>} node
 */
function customNodeEvidenceMismatch(ledger, node) {
  if (node.source !== 'custom') return false;
  const definition = ledger.definitions[node.definitionId];
  const revision = ledger.revisions[node.revisionId];
  const expectedCategory = CATEGORY_BY_KIND[node.kind];
  return (
    !definition
    || definition.category !== expectedCategory
    || definition.archivedAt != null
    || definition.localUid !== node.uid
    || definition.headRevisionId !== node.revisionId
    || !revision
    || revision.definitionId !== node.definitionId
    || revision.category !== expectedCategory
    || revision.revisionNumber !== node.revisionNumber
    || revision.contentHash !== node.contentHash
    || contentRevisionHash(expectedCategory, revision.data) !== node.contentHash
  );
}

/**
 * Apply one already-admitted command while the owner ledger lock is held.
 *
 * @param {{
 *   preview:{plan:Record<string, any>,fingerprint:string},
 *   ownerId:string,
 *   commandId:string,
 *   ledger:Record<string, any>,
 *   authority:LocalReviewedSupplyChainAuthority,
 * }} input
 */
function applyLockedReviewedSupplyChainCommand(input) {
  const {
    preview,
    ownerId,
    commandId,
    ledger,
    authority,
  } = input;
  const prior = ledger.commandReceipts[commandId];
  if (prior) {
    if (prior.fingerprint !== preview.fingerprint) {
      return authority.receipt({
        commandId,
        status: 'failed',
        reason: 'command_id_conflict',
      });
    }
    return authority.receipt({
      ...prior.receipt,
      commandId,
      replayed: true,
    });
  }

  const next = /** @type {Record<string, any>} */ (
    detachContentJson(ledger)
  );
  const finalizeRefusal = (details) => {
    const receiptRecord = {
      status: details.status,
      reason: details.reason,
      result: details.result || null,
      perEntry: [],
    };
    next.commandReceipts[commandId] = {
      fingerprint: preview.fingerprint,
      receipt: receiptRecord,
    };
    authority.persist(next, ownerId);
    return authority.receipt({
      commandId,
      ...receiptRecord,
    });
  };
  const artifactId = String(preview.plan.artifactId);
  const expectedHead = preview.plan.expectedHeadRevisionId;
  const expectedLifecycleVersion = preview.plan.expectedLifecycleVersion;
  const definition = next.definitions[artifactId] || null;
  const chainId = preview.plan.chain?.chainId || null;
  const conflictingArtifact = chainId == null
    ? null
    : Object.values(next.definitions || {}).find((candidate) => {
        if (
          candidate?.category !== REVIEWED_SUPPLY_CHAIN_CATEGORY
          || String(candidate.id) === artifactId
        ) return false;
        const candidateRevision = next.revisions?.[candidate.headRevisionId];
        return candidateRevision?.data?.chainId === chainId;
      });
  if (conflictingArtifact) {
    return finalizeRefusal({
      status: 'stale',
      reason: 'reviewed_supply_chain_identity_exists',
      result: {
        artifactId: conflictingArtifact.id,
        actualHeadRevisionId: conflictingArtifact.headRevisionId,
      },
    });
  }
  if (
    definition
    && definition.category !== REVIEWED_SUPPLY_CHAIN_CATEGORY
  ) {
    return finalizeRefusal({
      status: 'failed',
      reason: 'reviewed_artifact_category_immutable',
    });
  }
  const existingReviewedRevision = definition
    ? next.revisions[definition.headRevisionId]
    : null;
  if (
    definition
    && preview.plan.kind === REVIEWED_SUPPLY_CHAIN_COMMAND_KIND.CONFIRM
    && existingReviewedRevision?.data?.chainId !== chainId
  ) {
    return finalizeRefusal({
      status: 'failed',
      reason: 'reviewed_supply_chain_identity_immutable',
    });
  }
  if (
    String(definition?.headRevisionId || '')
    !== String(expectedHead || '')
  ) {
    return finalizeRefusal({
      status: 'stale',
      reason: definition
        ? 'reviewed_supply_chain_head_changed'
        : 'reviewed_supply_chain_unavailable',
      result: {
        artifactId,
        actualHeadRevisionId: definition?.headRevisionId || null,
      },
    });
  }
  const actualLifecycleVersion =
    definition?.reviewedLifecycleVersion ?? null;
  if (actualLifecycleVersion !== expectedLifecycleVersion) {
    return finalizeRefusal({
      status: 'stale',
      reason: 'reviewed_supply_chain_lifecycle_changed',
      result: {
        artifactId,
        actualHeadRevisionId: definition?.headRevisionId || null,
        actualLifecycleVersion,
      },
    });
  }
  if (
    definition
    && (
      !Number.isInteger(actualLifecycleVersion)
      || actualLifecycleVersion < 1
      || actualLifecycleVersion > MAX_LIFECYCLE_VERSION
    )
  ) {
    return finalizeRefusal({
      status: 'failed',
      reason: 'reviewed_supply_chain_lifecycle_invalid',
    });
  }

  const timestamp = authority.now();
  let item = null;
  let archivedItem = null;
  let status = 'unchanged';
  if (preview.plan.kind === REVIEWED_SUPPLY_CHAIN_COMMAND_KIND.CONFIRM) {
    const restoring = Boolean(definition?.archivedAt);
    const admission = admitReviewedSupplyChain(preview.plan.chain);
    if (!admission.ok) {
      return finalizeRefusal({
        status: 'failed',
        reason: 'reviewed_supply_chain_invalid',
        result: { errors: admission.errors },
      });
    }
    const admittedChain = /** @type {Record<string, any>} */ (
      admission.chain
    );
    if (
      admittedChain.discovered.nodes.some(node => (
        customNodeEvidenceMismatch(next, node)
      ))
    ) {
      return finalizeRefusal({
        status: 'stale',
        reason: 'reviewed_supply_chain_node_evidence_mismatch',
      });
    }

    const currentRevision = existingReviewedRevision;
    const contentHash = reviewedSupplyChainContentHash(admittedChain);
    if (currentRevision?.contentHash === contentHash) {
      if (restoring) {
        if (actualLifecycleVersion >= MAX_LIFECYCLE_VERSION) {
          return finalizeRefusal({
            status: 'failed',
            reason: 'reviewed_supply_chain_lifecycle_exhausted',
          });
        }
        definition.archivedAt = null;
        definition.updatedAt = timestamp;
        definition.reviewedLifecycleVersion = actualLifecycleVersion + 1;
        status = 'restored';
      }
      item = projectReviewedSupplyChainDefinitionHead(
        definition,
        currentRevision,
      );
    } else {
      if (
        definition
        && actualLifecycleVersion >= MAX_LIFECYCLE_VERSION
      ) {
        return finalizeRefusal({
          status: 'failed',
          reason: 'reviewed_supply_chain_lifecycle_exhausted',
        });
      }
      const revisionId = authority.makeRevisionId();
      const revision = Object.freeze({
        schemaVersion: 1,
        id: revisionId,
        definitionId: artifactId,
        category: REVIEWED_SUPPLY_CHAIN_CATEGORY,
        revisionNumber: (currentRevision?.revisionNumber || 0) + 1,
        parentRevisionId: currentRevision?.id || null,
        contentHash,
        data: admittedChain,
        createdAt: timestamp,
      });
      const nextDefinition = {
        id: artifactId,
        category: REVIEWED_SUPPLY_CHAIN_CATEGORY,
        localUid: definition?.localUid
          || `reviewed-chain:${fingerprintContent(
            admittedChain.chainId,
          ).slice(0, 32)}`,
        headRevisionId: revisionId,
        archivedAt: null,
        createdAt: definition?.createdAt || timestamp,
        updatedAt: timestamp,
        legacyContentId: definition?.legacyContentId || null,
        reviewedLifecycleVersion: definition
          ? actualLifecycleVersion + 1
          : 1,
      };
      next.definitions[artifactId] = nextDefinition;
      next.revisions[revisionId] = revision;
      item = projectReviewedSupplyChainDefinitionHead(
        nextDefinition,
        revision,
      );
      status = restoring ? 'restored' : definition ? 'updated' : 'created';
    }
  } else if (
    preview.plan.kind === REVIEWED_SUPPLY_CHAIN_COMMAND_KIND.REMOVE
  ) {
    if (!definition) {
      return finalizeRefusal({
        status: 'stale',
        reason: 'reviewed_supply_chain_unavailable',
      });
    }
    const revision = next.revisions[definition.headRevisionId];
    if (!revision) {
      return finalizeRefusal({
        status: 'failed',
        reason: 'reviewed_supply_chain_revision_unavailable',
      });
    }
    if (!definition.archivedAt) {
      if (actualLifecycleVersion >= MAX_LIFECYCLE_VERSION) {
        return finalizeRefusal({
          status: 'failed',
          reason: 'reviewed_supply_chain_lifecycle_exhausted',
        });
      }
      definition.archivedAt = timestamp;
      definition.updatedAt = timestamp;
      definition.reviewedLifecycleVersion = actualLifecycleVersion + 1;
    }
    archivedItem = projectReviewedSupplyChainDefinitionHead(
      definition,
      revision,
    );
    status = 'archived';
  } else {
    return finalizeRefusal({
      status: 'failed',
      reason: 'reviewed_supply_chain_command_unsupported',
    });
  }

  const receiptRecord = {
    status: 'applied',
    reason: null,
    result: {
      item,
      archivedItem,
      artifactId,
      headRevisionId: item?.revisionId || archivedItem?.revisionId || null,
    },
    perEntry: [{
      definitionId: artifactId,
      revisionId: item?.revisionId || archivedItem?.revisionId || null,
      category: REVIEWED_SUPPLY_CHAIN_CATEGORY,
      status,
    }],
  };
  next.commandReceipts[commandId] = {
    fingerprint: preview.fingerprint,
    receipt: receiptRecord,
  };
  authority.persist(next, ownerId);
  return authority.receipt({
    commandId,
    ...receiptRecord,
  });
}

/**
 * Admit and execute one local reviewed-chain command through injected storage.
 *
 * @param {{plan:Record<string, any>,fingerprint:string}} preview
 * @param {{ownerId?:string,ownerKey?:string,commandId?:string}} options
 * @param {LocalReviewedSupplyChainAuthority} authority
 */
export async function executeReviewedSupplyChainLocalAuthority(
  preview,
  options,
  authority,
) {
  const ownerId = options.ownerId || options.ownerKey || 'anon';
  /** @type {{plan:Record<string, any>,fingerprint:string}} */
  let admittedPreview;
  try {
    admittedPreview = /** @type {{
      plan:Record<string, any>,
      fingerprint:string,
    }} */ (previewReviewedSupplyChainCommand(preview?.plan));
  } catch {
    return authority.receipt({
      commandId: options.commandId || 'cmd:reviewed-supply-chain:invalid',
      status: 'failed',
      reason: 'reviewed_supply_chain_plan_invalid',
    });
  }
  if (admittedPreview.fingerprint !== preview?.fingerprint) {
    return authority.receipt({
      commandId: options.commandId
        || 'cmd:reviewed-supply-chain:fingerprint-mismatch',
      status: 'failed',
      reason: 'reviewed_supply_chain_preview_fingerprint_mismatch',
    });
  }
  const commandId = options.commandId || (
    `cmd:reviewed-supply-chain:${fingerprintContent({
      ownerId: String(ownerId),
      fingerprint: admittedPreview.fingerprint,
      artifactId: admittedPreview.plan.artifactId,
    })}`
  );
  return authority.withLock(ownerId, () => (
    applyLockedReviewedSupplyChainCommand({
      preview: admittedPreview,
      ownerId,
      commandId,
      ledger: authority.load(ownerId),
      authority,
    })
  ));
}
