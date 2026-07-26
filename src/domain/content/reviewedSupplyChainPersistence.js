/**
 * Reviewed supply-chain persistence contract.
 *
 * Supply chains are derived graph artifacts, not authored vocabulary entries.
 * They therefore must never pass through the generic custom-definition
 * admission wall. This module gives that one reviewed-derived category its own
 * exact schema, immutable command plan, and revision-address helper while still
 * allowing the shared definition/revision ledger to preserve history.
 */

import {
  canonicalContentJson,
  detachContentJson,
  fingerprintContent,
  isPlainContentRecord,
} from './contentFingerprint.js';
import {
  confirmCustomSupplyChainReview,
  customSupplyChainProjectionFingerprint,
} from './customSupplyChainReview.js';
import {
  AUTHORABLE_CONTENT_CATEGORIES,
  authoredDataOf,
  contentRevisionHash,
  projectDefinitionHead,
} from './customContentVersioning.js';
import { TIER_ORDER } from '../../data/constants.js';
import {
  reviewedSupplyChainIdForNodeUids,
} from './customSupplyChainIdentity.js';

export { reviewedSupplyChainIdForNodeUids };

export const REVIEWED_SUPPLY_CHAIN_CATEGORY = 'supplyChains';
export const REVIEWED_SUPPLY_CHAIN_COMMAND_SCHEMA_VERSION = 1;
export const REVIEWED_SUPPLY_CHAIN_COMMAND_KIND = Object.freeze({
  CONFIRM: 'content.reviewed-supply-chain.confirm',
  REMOVE: 'content.reviewed-supply-chain.remove',
});
export const REVIEWED_DERIVED_CONTENT_CATEGORIES = Object.freeze([
  REVIEWED_SUPPLY_CHAIN_CATEGORY,
]);
export const PERSISTED_RUNTIME_CONTENT_CATEGORIES = Object.freeze([
  ...AUTHORABLE_CONTENT_CATEGORIES,
  ...REVIEWED_DERIVED_CONTENT_CATEGORIES,
]);

const SHA256_RE = /^[0-9a-f]{64}$/;
const MAX_TEXT = 240;
const MAX_LABEL = 1_000;
const MAX_NOTE = 4_000;
const MAX_NODES = 64;
const MAX_EDGES = 256;
const MAX_LIST = 128;
const MAX_REVISION_NUMBER = 2_147_483_647;
const MAX_LIFECYCLE_VERSION = 2_147_483_647;
const COMMAND_KEYS = new Set([
  'schemaVersion',
  'kind',
  'artifactId',
  'expectedHeadRevisionId',
  'expectedLifecycleVersion',
  'chain',
]);
const CHAIN_KEYS = new Set([
  'chainId',
  'status',
  'label',
  'resource',
  'resourceIcon',
  'resourceDepleted',
  'processingInstitutions',
  'outputs',
  'services',
  'exportable',
  'entrepot',
  'upstreamMissing',
  'upstreamNote',
  'needLabel',
  'needIcon',
  'needColor',
  'discovered',
  'verification',
]);
const PERSISTENCE_KEYS = new Set([
  'id',
  'definitionId',
  'revisionId',
  'revisionNumber',
  'contentHash',
  'localUid',
  'isCustom',
  'createdAt',
  'updatedAt',
  'archivedAt',
  'reviewedLifecycleVersion',
  '_schemaVersion',
  'commandReceipt',
]);
const DISCOVERED_KEYS = new Set(['nodes', 'edges', 'tradeEndpoints']);
const NODE_KEYS = new Set([
  'uid',
  'name',
  'kind',
  'role',
  'refId',
  'source',
  'tierMin',
  'tierMax',
  'definitionId',
  'revisionId',
  'revisionNumber',
  'contentHash',
]);
const EDGE_KEYS = new Set(['from', 'to', 'commodity']);
const TRADE_ENDPOINT_KEYS = new Set(['imports', 'exports']);
const ENDPOINT_KEYS = new Set(['label', 'source', 'counterpart']);
const VERIFICATION_KEYS = new Set([
  'state',
  'userName',
  'corrections',
  'review',
]);
const REVIEW_KEYS = new Set(['schemaVersion', 'projectionFingerprint']);
const NODE_KINDS = new Set(['institution', 'service', 'resource', 'good']);
const NODE_ROLES = new Set(['source', 'processor', 'sink']);
const NODE_SOURCES = new Set(['custom', 'prebuilt', 'reference']);

/** @param {unknown} category */
export function isReviewedDerivedContentCategory(category) {
  return category === REVIEWED_SUPPLY_CHAIN_CATEGORY;
}

/** @param {unknown} value @param {string} field */
function record(value, field) {
  if (!isPlainContentRecord(value)) {
    throw new TypeError(`${field} must be an object.`);
  }
  return /** @type {Record<string, unknown>} */ (value);
}

/**
 * @param {Record<string, unknown>} value
 * @param {Set<string>} keys
 * @param {string} field
 */
function exactKeys(value, keys, field) {
  const unknown = Object.keys(value).filter(key => !keys.has(key));
  const missing = [...keys].filter(key => !Object.hasOwn(value, key));
  if (unknown.length || missing.length) {
    throw new TypeError(
      `${field} has an unsupported shape.`
      + (unknown.length ? ` Unknown: ${unknown.join(', ')}.` : '')
      + (missing.length ? ` Missing: ${missing.join(', ')}.` : ''),
    );
  }
}

/**
 * @param {unknown} value
 * @param {string} field
 * @param {{nullable?:boolean,max?:number}} [options]
 */
function boundedText(value, field, options = {}) {
  if (value == null && options.nullable) return null;
  if (
    typeof value !== 'string'
    || value.length === 0
    || value !== value.trim()
    || [...value].length > (options.max || MAX_TEXT)
  ) {
    throw new TypeError(`${field} must be bounded non-empty text.`);
  }
  return value;
}

/** @param {unknown} value @param {string} field */
function nullableText(value, field) {
  return value == null ? null : boundedText(value, field);
}

/**
 * @param {unknown} value
 * @param {string} field
 * @param {number} [max]
 */
function textList(value, field, max = MAX_LIST) {
  if (
    !Array.isArray(value)
    || value.length > max
    || value.some(entry => (
      typeof entry !== 'string'
      || entry.length === 0
      || entry !== entry.trim()
      || [...entry].length > MAX_TEXT
    ))
  ) {
    throw new TypeError(`${field} must be a bounded string array.`);
  }
  return [...value];
}

/** @param {unknown} value @param {string} field */
function booleanValue(value, field) {
  if (typeof value !== 'boolean') {
    throw new TypeError(`${field} must be boolean.`);
  }
  return value;
}

/**
 * Admit the durable lifecycle compare-and-swap generation. A reviewed
 * artifact starts at generation one and advances whenever its definition
 * lifecycle changes. Null is reserved for a create that has no definition yet.
 *
 * @param {unknown} value
 * @param {string} field
 * @param {{nullable?:boolean}} [options]
 */
function lifecycleVersion(value, field, options = {}) {
  if (value == null && options.nullable) return null;
  if (
    typeof value !== 'number'
    || !Number.isInteger(value)
    || value < 1
    || value > MAX_LIFECYCLE_VERSION
  ) {
    throw new TypeError(`${field} must be a positive 32-bit integer.`);
  }
  return Number(value);
}

/**
 * Strictly admit the exact object returned by
 * `confirmCustomSupplyChainReview`. Persistence metadata may be present on a
 * materialized ledger projection, but it is never part of the artifact body.
 *
 * @param {unknown} value
 * @param {{allowPersistenceFields?:boolean}} [options]
 */
export function admitReviewedSupplyChain(value, options = {}) {
  try {
    const supplied = record(value, 'reviewed supply chain');
    const artifact = /** @type {Record<string, unknown>} */ ({});
    for (const [key, fieldValue] of Object.entries(supplied)) {
      if (
        options.allowPersistenceFields === true
        && PERSISTENCE_KEYS.has(key)
      ) continue;
      artifact[key] = fieldValue;
    }
    exactKeys(artifact, CHAIN_KEYS, 'reviewed supply chain');

    const chainId = boundedText(artifact.chainId, 'chainId');
    const status = boundedText(artifact.status, 'status');
    if (status !== 'confirmed') {
      throw new TypeError('status must be "confirmed".');
    }
    const discovered = record(artifact.discovered, 'discovered');
    exactKeys(discovered, DISCOVERED_KEYS, 'discovered');
    if (
      !Array.isArray(discovered.nodes)
      || discovered.nodes.length < 2
      || discovered.nodes.length > MAX_NODES
    ) {
      throw new TypeError('discovered.nodes must contain 2 to 64 nodes.');
    }

    const nodeUids = new Set();
    const nodes = discovered.nodes.map((rawNode, index) => {
      const node = record(rawNode, `discovered.nodes[${index}]`);
      exactKeys(node, NODE_KEYS, `discovered.nodes[${index}]`);
      const uid = boundedText(node.uid, `discovered.nodes[${index}].uid`);
      if (nodeUids.has(uid)) {
        throw new TypeError(`discovered.nodes repeats uid "${uid}".`);
      }
      nodeUids.add(uid);
      const kind = /** @type {string} */ (boundedText(
        node.kind,
        `discovered.nodes[${index}].kind`,
      ));
      const role = /** @type {string} */ (boundedText(
        node.role,
        `discovered.nodes[${index}].role`,
      ));
      const source = /** @type {string} */ (boundedText(
        node.source,
        `discovered.nodes[${index}].source`,
      ));
      if (!NODE_KINDS.has(kind)) {
        throw new TypeError(`discovered.nodes[${index}].kind is unsupported.`);
      }
      if (!NODE_ROLES.has(role)) {
        throw new TypeError(`discovered.nodes[${index}].role is unsupported.`);
      }
      if (!NODE_SOURCES.has(source)) {
        throw new TypeError(`discovered.nodes[${index}].source is unsupported.`);
      }
      const refId = nullableText(
        node.refId,
        `discovered.nodes[${index}].refId`,
      );
      if (
        (source === 'custom' && refId !== `custom:${uid}`)
        || (
          source === 'prebuilt'
          && !String(refId || '').startsWith('prebuilt:')
        )
        || (source === 'reference' && refId != null)
      ) {
        throw new TypeError(
          `discovered.nodes[${index}] has incoherent source identity.`,
        );
      }
      const tierMin = nullableText(
        node.tierMin,
        `discovered.nodes[${index}].tierMin`,
      );
      const tierMax = nullableText(
        node.tierMax,
        `discovered.nodes[${index}].tierMax`,
      );
      const tierMinIndex = tierMin == null ? 0 : TIER_ORDER.indexOf(tierMin);
      const tierMaxIndex = tierMax == null
        ? TIER_ORDER.length - 1
        : TIER_ORDER.indexOf(tierMax);
      if (
        tierMinIndex < 0
        || tierMaxIndex < 0
        || tierMinIndex > tierMaxIndex
      ) {
        throw new TypeError(
          `discovered.nodes[${index}] has invalid tier bounds.`,
        );
      }
      const contentHash = nullableText(
        node.contentHash,
        `discovered.nodes[${index}].contentHash`,
      );
      const definitionId = nullableText(
        node.definitionId,
        `discovered.nodes[${index}].definitionId`,
      );
      const revisionId = nullableText(
        node.revisionId,
        `discovered.nodes[${index}].revisionId`,
      );
      const revisionNumber = node.revisionNumber;
      const revisionNumberIsValid = (
        typeof revisionNumber === 'number'
        && Number.isInteger(revisionNumber)
        && revisionNumber >= 1
        && revisionNumber <= MAX_REVISION_NUMBER
      );
      if (
        contentHash != null
        && !SHA256_RE.test(contentHash)
      ) {
        throw new TypeError(
          `discovered.nodes[${index}].contentHash is invalid.`,
        );
      }
      if (
        source === 'custom'
        && (
          definitionId == null
          || revisionId == null
          || contentHash == null
          || !revisionNumberIsValid
        )
      ) {
        throw new TypeError(
          `discovered.nodes[${index}] lacks exact custom revision evidence.`,
        );
      }
      if (
        source !== 'custom'
        && (
          definitionId != null
          || revisionId != null
          || revisionNumber != null
          || contentHash != null
        )
      ) {
        throw new TypeError(
          `discovered.nodes[${index}] has unexpected revision evidence.`,
        );
      }
      if (
        revisionNumber != null
        && !revisionNumberIsValid
      ) {
        throw new TypeError(
          `discovered.nodes[${index}].revisionNumber is invalid.`,
        );
      }
      return {
        uid,
        name: boundedText(node.name, `discovered.nodes[${index}].name`),
        kind,
        role,
        refId,
        source,
        tierMin,
        tierMax,
        definitionId,
        revisionId,
        revisionNumber: revisionNumber == null
          ? null
          : revisionNumber,
        contentHash,
      };
    });
    if (
      chainId !== reviewedSupplyChainIdForNodeUids(
        nodes.map(node => node.uid),
      )
    ) {
      throw new TypeError('chainId does not match the canonical graph identity.');
    }

    if (
      !Array.isArray(discovered.edges)
      || discovered.edges.length > MAX_EDGES
    ) {
      throw new TypeError('discovered.edges must be a bounded array.');
    }
    const edgeIdentities = new Set();
    const edges = discovered.edges.map((rawEdge, index) => {
      const edge = record(rawEdge, `discovered.edges[${index}]`);
      exactKeys(edge, EDGE_KEYS, `discovered.edges[${index}]`);
      const normalized = {
        from: boundedText(edge.from, `discovered.edges[${index}].from`),
        to: boundedText(edge.to, `discovered.edges[${index}].to`),
        commodity: boundedText(
          edge.commodity,
          `discovered.edges[${index}].commodity`,
        ),
      };
      if (
        !nodeUids.has(normalized.from)
        || !nodeUids.has(normalized.to)
        || normalized.from === normalized.to
      ) {
        throw new TypeError(
          `discovered.edges[${index}] references an invalid node.`,
        );
      }
      const identity =
        `${normalized.from}\u0000${normalized.to}\u0000${normalized.commodity}`;
      if (edgeIdentities.has(identity)) {
        throw new TypeError(`discovered.edges[${index}] is duplicated.`);
      }
      edgeIdentities.add(identity);
      return normalized;
    });

    const endpoints = record(
      discovered.tradeEndpoints,
      'discovered.tradeEndpoints',
    );
    exactKeys(
      endpoints,
      TRADE_ENDPOINT_KEYS,
      'discovered.tradeEndpoints',
    );
    /**
     * @param {unknown} raw
     * @param {string} field
     */
    const normalizeEndpoints = (raw, field) => {
      if (!Array.isArray(raw) || raw.length > MAX_LIST) {
        throw new TypeError(`${field} must be a bounded array.`);
      }
      return raw.map((rawEndpoint, index) => {
        const endpoint = record(rawEndpoint, `${field}[${index}]`);
        exactKeys(endpoint, ENDPOINT_KEYS, `${field}[${index}]`);
        return {
          label: boundedText(endpoint.label, `${field}[${index}].label`),
          source: nullableText(endpoint.source, `${field}[${index}].source`),
          counterpart: nullableText(
            endpoint.counterpart,
            `${field}[${index}].counterpart`,
          ),
        };
      });
    };

    const verification = record(artifact.verification, 'verification');
    exactKeys(verification, VERIFICATION_KEYS, 'verification');
    if (verification.state !== 'confirmed') {
      throw new TypeError('verification.state must be "confirmed".');
    }
    const corrections = record(
      verification.corrections,
      'verification.corrections',
    );
    if (Object.keys(corrections).length > 0) {
      throw new TypeError(
        'verification.corrections is reserved and must remain empty.',
      );
    }
    const review = record(verification.review, 'verification.review');
    exactKeys(review, REVIEW_KEYS, 'verification.review');
    if (
      review.schemaVersion !== REVIEWED_SUPPLY_CHAIN_COMMAND_SCHEMA_VERSION
      || !SHA256_RE.test(String(review.projectionFingerprint || ''))
    ) {
      throw new TypeError('verification.review evidence is invalid.');
    }

    const chain = {
      chainId,
      status,
      label: boundedText(artifact.label, 'label', { max: MAX_LABEL }),
      resource: nullableText(artifact.resource, 'resource'),
      resourceIcon: typeof artifact.resourceIcon === 'string'
        && [...artifact.resourceIcon].length <= MAX_TEXT
        ? artifact.resourceIcon
        : (() => { throw new TypeError('resourceIcon is invalid.'); })(),
      resourceDepleted: booleanValue(
        artifact.resourceDepleted,
        'resourceDepleted',
      ),
      processingInstitutions: textList(
        artifact.processingInstitutions,
        'processingInstitutions',
      ),
      outputs: textList(artifact.outputs, 'outputs'),
      services: textList(artifact.services, 'services'),
      exportable: booleanValue(artifact.exportable, 'exportable'),
      entrepot: booleanValue(artifact.entrepot, 'entrepot'),
      upstreamMissing: textList(
        artifact.upstreamMissing,
        'upstreamMissing',
      ),
      upstreamNote: typeof artifact.upstreamNote === 'string'
        && [...artifact.upstreamNote].length <= MAX_NOTE
        ? artifact.upstreamNote
        : (() => { throw new TypeError('upstreamNote is invalid.'); })(),
      needLabel: boundedText(artifact.needLabel, 'needLabel'),
      needIcon: boundedText(artifact.needIcon, 'needIcon'),
      needColor: boundedText(artifact.needColor, 'needColor'),
      discovered: {
        nodes,
        edges,
        tradeEndpoints: {
          imports: normalizeEndpoints(
            endpoints.imports,
            'discovered.tradeEndpoints.imports',
          ),
          exports: normalizeEndpoints(
            endpoints.exports,
            'discovered.tradeEndpoints.exports',
          ),
        },
      },
      verification: {
        state: 'confirmed',
        userName: verification.userName == null
          ? null
          : boundedText(
              verification.userName,
              'verification.userName',
              { max: MAX_LABEL },
            ),
        corrections: {},
        review: {
          schemaVersion: REVIEWED_SUPPLY_CHAIN_COMMAND_SCHEMA_VERSION,
          projectionFingerprint: review.projectionFingerprint,
        },
      },
    };
    const projectionFingerprint =
      customSupplyChainProjectionFingerprint(chain);
    if (
      !projectionFingerprint
      || projectionFingerprint !== review.projectionFingerprint
    ) {
      throw new TypeError(
        'The confirmed review does not match the persisted chain projection.',
      );
    }
    if (
      canonicalContentJson(artifact)
      !== canonicalContentJson(chain)
    ) {
      throw new TypeError('The reviewed supply-chain shape is not canonical.');
    }
    return {
      ok: true,
      chain: Object.freeze(detachContentJson(chain)),
      errors: Object.freeze([]),
    };
  } catch (error) {
    return {
      ok: false,
      chain: null,
      errors: Object.freeze([
        error instanceof Error
          ? error.message
          : 'The reviewed supply chain is invalid.',
      ]),
    };
  }
}

/**
 * Produce the same immutable address tuple used by environment and campaign
 * bindings without pretending the artifact is an authored definition.
 *
 * @param {unknown} value
 */
export function reviewedSupplyChainRevisionEntry(value) {
  const admission = admitReviewedSupplyChain(value, {
    allowPersistenceFields: true,
  });
  if (!admission.ok) throw new TypeError(admission.errors.join(' '));
  const recordValue = record(value, 'reviewed supply-chain revision');
  const data = record(admission.chain, 'reviewed supply-chain data');
  const contentHash = contentRevisionHash(
    REVIEWED_SUPPLY_CHAIN_CATEGORY,
    data,
  );
  const definitionId = String(boundedText(
    recordValue.definitionId,
    'reviewed supply-chain definitionId',
  ));
  const revisionId = String(boundedText(
    recordValue.revisionId,
    'reviewed supply-chain revisionId',
  ));
  const revisionNumber = recordValue.revisionNumber;
  if (
    typeof revisionNumber !== 'number'
    || !Number.isInteger(revisionNumber)
    || revisionNumber < 1
    || revisionNumber > MAX_REVISION_NUMBER
  ) {
    throw new TypeError(
      'A reviewed supply chain must address one persisted positive revision.',
    );
  }
  if (
    !SHA256_RE.test(String(recordValue.contentHash || ''))
    || recordValue.contentHash !== contentHash
  ) {
    throw new TypeError(
      `Reviewed chain "${String(recordValue.chainId || '')}" `
      + 'does not match its declared content hash.',
    );
  }
  return Object.freeze({
    definitionId,
    revisionId,
    contentHash,
    category: REVIEWED_SUPPLY_CHAIN_CATEGORY,
    data,
  });
}

/**
 * Materialize one reviewed definition head with its operational CAS
 * generation. The generation is persistence metadata: it is never included in
 * the immutable artifact body or content hash.
 *
 * @param {(Parameters<typeof projectDefinitionHead>[0] & {
 *   reviewedLifecycleVersion?:unknown
 * })} definition
 * @param {Parameters<typeof projectDefinitionHead>[1]} revision
 */
export function projectReviewedSupplyChainDefinitionHead(
  definition,
  revision,
) {
  const projected = projectDefinitionHead(
    /** @type {Parameters<typeof projectDefinitionHead>[0]} */ (definition),
    /** @type {Parameters<typeof projectDefinitionHead>[1]} */ (revision),
  );
  if (!projected) return null;
  return Object.freeze({
    ...projected,
    reviewedLifecycleVersion: lifecycleVersion(
      definition?.reviewedLifecycleVersion,
      'reviewed supply-chain lifecycle version',
    ),
  });
}

/**
 * Create a detached, hash-addressed command proposal. Exact expected-head
 * identity is required for both replacement and removal; a create carries a
 * null expected head.
 *
 * @param {unknown} input
 */
export function previewReviewedSupplyChainCommand(input) {
  const raw = record(input, 'reviewed supply-chain command');
  exactKeys(raw, COMMAND_KEYS, 'reviewed supply-chain command');
  if (
    raw.schemaVersion !== REVIEWED_SUPPLY_CHAIN_COMMAND_SCHEMA_VERSION
  ) {
    throw new TypeError('Reviewed supply-chain command version is unsupported.');
  }
  const kind = boundedText(raw.kind, 'kind');
  if (
    kind !== REVIEWED_SUPPLY_CHAIN_COMMAND_KIND.CONFIRM
    && kind !== REVIEWED_SUPPLY_CHAIN_COMMAND_KIND.REMOVE
  ) {
    throw new TypeError('Reviewed supply-chain command kind is unsupported.');
  }
  const artifactId = boundedText(raw.artifactId, 'artifactId');
  const expectedHeadRevisionId = raw.expectedHeadRevisionId == null
    ? null
    : boundedText(raw.expectedHeadRevisionId, 'expectedHeadRevisionId');
  const expectedLifecycleVersion = lifecycleVersion(
    raw.expectedLifecycleVersion,
    'expectedLifecycleVersion',
    { nullable: true },
  );
  let chain = null;
  if (kind === REVIEWED_SUPPLY_CHAIN_COMMAND_KIND.CONFIRM) {
    const admission = admitReviewedSupplyChain(raw.chain);
    if (!admission.ok) throw new TypeError(admission.errors.join(' '));
    chain = admission.chain;
  } else {
    if (raw.chain != null) {
      throw new TypeError('A remove command must not carry a chain body.');
    }
    if (!expectedHeadRevisionId) {
      throw new TypeError('A remove command requires the reviewed head revision.');
    }
    if (expectedLifecycleVersion == null) {
      throw new TypeError(
        'A remove command requires the reviewed lifecycle version.',
      );
    }
  }
  const plan = Object.freeze(detachContentJson({
    schemaVersion: REVIEWED_SUPPLY_CHAIN_COMMAND_SCHEMA_VERSION,
    kind,
    artifactId,
    expectedHeadRevisionId,
    expectedLifecycleVersion,
    chain,
  }));
  return Object.freeze({
    plan,
    fingerprint: fingerprintContent(plan),
  });
}

/** @param {unknown} plan @param {unknown} fingerprint */
export function verifyReviewedSupplyChainPreview(plan, fingerprint) {
  try {
    return fingerprintContent(plan) === String(fingerprint || '');
  } catch {
    return false;
  }
}

/**
 * Hash only the strictly admitted artifact body.
 *
 * @param {unknown} value
 */
export function reviewedSupplyChainContentHash(value) {
  const admission = admitReviewedSupplyChain(value, {
    allowPersistenceFields: true,
  });
  if (!admission.ok) throw new TypeError(admission.errors.join(' '));
  return contentRevisionHash(
    REVIEWED_SUPPLY_CHAIN_CATEGORY,
    authoredDataOf(admission.chain),
  );
}

/**
 * Remap a reviewed chain alongside the definition/revision graph in a portable
 * archive import. Custom-node addresses and hashes are evidence, so copying the
 * old values after author-definition remap would make a superficially intact
 * but permanently stale confirmation.
 *
 * @param {unknown} value
 * @param {{
 *   localUids:Map<string,string>,
 *   definitionIds:Map<string,string>,
 *   revisionIds:Map<string,string>,
 *   revisionNumbers:Map<string,number>,
 *   contentHashes:Map<string,string>,
 * }} mappings
 */
export function remapReviewedSupplyChain(value, mappings) {
  const admission = admitReviewedSupplyChain(value, {
    allowPersistenceFields: true,
  });
  if (!admission.ok) throw new TypeError(admission.errors.join(' '));
  const chain = /** @type {{
   *   chainId:string,
   *   discovered:{
   *     nodes:Array<Record<string, unknown> & {
   *       uid:string,
   *       source:string,
   *       definitionId?:string|null,
   *       revisionId?:string|null,
   *     }>,
   *     edges:Array<Record<string, unknown> & {from:string,to:string}>,
   *   },
   *   verification:{userName?:string|null},
   * } & Record<string, unknown>} */ (
    detachContentJson(admission.chain)
  );
  const uidMap = new Map();
  chain.discovered.nodes = chain.discovered.nodes.map(
    /** @param {Record<string, unknown> & {
     *   uid:string,
     *   source:string,
     *   definitionId?:string|null,
     *   revisionId?:string|null,
     * }} node @param {number} index */ (
      node,
      index,
    ) => {
      if (node.source !== 'custom') return node;
      const destinationUid = mappings.localUids.get(node.uid);
      const destinationDefinitionId = node.definitionId == null
        ? null
        : mappings.definitionIds.get(node.definitionId);
      const destinationRevisionId = node.revisionId == null
        ? null
        : mappings.revisionIds.get(node.revisionId);
      const destinationRevisionNumber = node.revisionId == null
        ? null
        : mappings.revisionNumbers.get(node.revisionId);
      const destinationContentHash = node.revisionId == null
        ? null
        : mappings.contentHashes.get(node.revisionId);
      if (
        !destinationUid
        || (node.definitionId != null && !destinationDefinitionId)
        || (node.revisionId != null && !destinationRevisionId)
        || (
          node.revisionId != null
          && (
            typeof destinationRevisionNumber !== 'number'
            || !Number.isInteger(destinationRevisionNumber)
            || destinationRevisionNumber < 1
            || destinationRevisionNumber > MAX_REVISION_NUMBER
          )
        )
        || (node.revisionId != null && !destinationContentHash)
      ) {
        throw new TypeError(
          `Reviewed chain custom node ${index} has no archive identity mapping.`,
        );
      }
      uidMap.set(node.uid, destinationUid);
      return {
        ...node,
        uid: destinationUid,
        refId: `custom:${destinationUid}`,
        definitionId: destinationDefinitionId,
        revisionId: destinationRevisionId,
        revisionNumber: destinationRevisionNumber,
        contentHash: destinationContentHash,
      };
    },
  );
  chain.discovered.edges = chain.discovered.edges.map(
    /** @param {Record<string, unknown> & {from:string,to:string}} edge */ edge => ({
      ...edge,
      from: uidMap.get(edge.from) || edge.from,
      to: uidMap.get(edge.to) || edge.to,
    }),
  );
  chain.chainId = reviewedSupplyChainIdForNodeUids(
    chain.discovered.nodes.map(
      node => node.uid,
    ),
  );
  const confirmed = confirmCustomSupplyChainReview(chain, {
    userName: chain.verification.userName,
  });
  const remapped = admitReviewedSupplyChain(confirmed);
  if (!remapped.ok) throw new TypeError(remapped.errors.join(' '));
  return remapped.chain;
}
