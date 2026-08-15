/**
 * Exact review identity for inferred custom supply chains.
 *
 * A chain id describes graph topology and intentionally survives edits to the
 * definitions at those nodes. It is therefore not sufficient evidence that the
 * author reviewed the current meaning. This module binds confirmation to the
 * canonical graph projection and to the exact authored content hash captured
 * for every custom node.
 */

import { fingerprintContent } from './contentFingerprint.js';
import { contentRevisionHash } from './customContentVersioning.js';

export const CUSTOM_SUPPLY_CHAIN_REVIEW_SCHEMA_VERSION = 1;

/**
 * Deliberately partial read shapes for the reviewed graph. Admission remains
 * runtime-driven; these types document only the fields this fingerprinting
 * leaf actually reads and keep untrusted extras as `unknown`.
 *
 * @typedef {Record<string, unknown> & {
 *   uid?:unknown,
 *   name?:unknown,
 *   kind?:unknown,
 *   role?:unknown,
 *   refId?:unknown,
 *   source?:unknown,
 *   tierMin?:unknown,
 *   tierMax?:unknown,
 *   definitionId?:unknown,
 *   revisionId?:unknown,
 *   revisionNumber?:unknown,
 *   contentHash?:unknown,
 * }} ReviewNodeLike
 * @typedef {Record<string, unknown> & {
 *   from?:unknown,
 *   to?:unknown,
 *   commodity?:unknown,
 * }} ReviewEdgeLike
 * @typedef {Record<string, unknown> & {
 *   chainId?:unknown,
 *   label?:unknown,
 *   discovered?:{
 *     nodes?:ReviewNodeLike[],
 *     edges?:ReviewEdgeLike[],
 *     tradeEndpoints?:{imports?:unknown[],exports?:unknown[]},
 *   },
 *   verification?:Record<string, unknown> & {
 *     review?:{schemaVersion?:unknown,projectionFingerprint?:unknown},
 *   },
 * }} ReviewChainLike
 */

/** @param {unknown} value */
const text = value => String(value ?? '').trim();

/**
 * Capture exact revision evidence from one current custom definition.
 *
 * The computed hash is authoritative even when a legacy flat record has no
 * revision metadata. A declared hash is never trusted without recomputation.
 *
 * @param {string} category
 * @param {Record<string, unknown>} item
 */
export function customSupplyChainDefinitionEvidence(category, item) {
  return Object.freeze({
    definitionId: text(item.definitionId || item.id) || null,
    revisionId: text(item.revisionId) || null,
    revisionNumber: Number.isInteger(item.revisionNumber)
      ? Number(item.revisionNumber)
      : null,
    contentHash: contentRevisionHash(category, item),
  });
}

/** @param {unknown} endpoint */
function endpointProjection(endpoint) {
  if (typeof endpoint === 'string') {
    return { label: endpoint, source: null, counterpart: null };
  }
  const record = endpoint && typeof endpoint === 'object'
    ? /** @type {Record<string, unknown>} */ (endpoint)
    : {};
  return {
    label: text(record.label),
    source: text(record.source) || null,
    counterpart: text(record.counterpart) || null,
  };
}

/**
 * Compute the canonical review fingerprint for a discovered chain.
 *
 * The user-assigned chain label and runtime status are excluded. Node display
 * labels remain included because they are part of the graph the author saw and
 * confirmed, alongside node order, edges, trade endpoints, stable identity,
 * tier bounds, and exact custom revision evidence.
 *
 * @param {ReviewChainLike|null|undefined} chain
 * @returns {string|null}
 */
export function customSupplyChainProjectionFingerprint(chain) {
  try {
    const discovered = chain?.discovered || {};
    if (
      !text(chain?.chainId)
      || !Array.isArray(discovered.nodes)
      || !Array.isArray(discovered.edges)
      || !Array.isArray(discovered.tradeEndpoints?.imports)
      || !Array.isArray(discovered.tradeEndpoints?.exports)
    ) {
      return null;
    }
    return fingerprintContent({
      schemaVersion: CUSTOM_SUPPLY_CHAIN_REVIEW_SCHEMA_VERSION,
      chainId: text(chain?.chainId),
      nodes: discovered.nodes.map(node => ({
        uid: text(node?.uid),
        name: text(node?.name),
        kind: text(node?.kind),
        role: text(node?.role),
        refId: text(node?.refId) || null,
        source: text(node?.source) || null,
        tierMin: text(node?.tierMin) || null,
        tierMax: text(node?.tierMax) || null,
        definitionId: text(node?.definitionId) || null,
        revisionId: text(node?.revisionId) || null,
        revisionNumber: Number.isInteger(node?.revisionNumber)
          ? Number(node.revisionNumber)
          : null,
        contentHash: text(node?.contentHash) || null,
      })),
      edges: discovered.edges.map(edge => ({
        from: text(edge?.from),
        to: text(edge?.to),
        commodity: text(edge?.commodity),
      })),
      tradeEndpoints: {
        imports: discovered.tradeEndpoints.imports.map(endpointProjection),
        exports: discovered.tradeEndpoints.exports.map(endpointProjection),
      },
    });
  } catch {
    return null;
  }
}

/**
 * Attach exact evidence at the moment an author confirms a discovered chain.
 *
 * @param {ReviewChainLike} chain
 * @param {{userName?:string|null}} [options]
 */
export function confirmCustomSupplyChainReview(chain, options = {}) {
  const nodes = Array.isArray(chain?.discovered?.nodes)
    ? chain.discovered.nodes
    : [];
  const hasCanonicalGraph = (
    text(chain?.chainId)
    && Array.isArray(chain?.discovered?.edges)
    && Array.isArray(chain?.discovered?.tradeEndpoints?.imports)
    && Array.isArray(chain?.discovered?.tradeEndpoints?.exports)
  );
  if (
    nodes.length < 2
    || !hasCanonicalGraph
    || nodes.some(node => (
      node?.source === 'custom'
      && (
        !text(node?.definitionId)
        || !text(node?.revisionId)
        || !Number.isInteger(node?.revisionNumber)
        || Number(node.revisionNumber) < 1
        || !text(node?.contentHash)
      )
    ))
  ) {
    throw new TypeError(
      'The supply-chain projection lacks an exact reviewable graph or definition revision evidence.',
    );
  }
  const projectionFingerprint = customSupplyChainProjectionFingerprint(chain);
  if (!projectionFingerprint) {
    throw new TypeError('The supply-chain projection cannot be reviewed safely.');
  }
  const userName = text(options.userName) || null;
  return {
    ...chain,
    ...(userName ? { label: userName } : {}),
    status: 'confirmed',
    verification: {
      ...(chain.verification || {}),
      state: 'confirmed',
      userName,
      review: {
        schemaVersion: CUSTOM_SUPPLY_CHAIN_REVIEW_SCHEMA_VERSION,
        projectionFingerprint,
      },
    },
  };
}

/**
 * True only when a saved confirmation covers this exact current projection.
 *
 * @param {ReviewChainLike|null|undefined} confirmed
 * @param {ReviewChainLike|null|undefined} current
 */
export function customSupplyChainReviewMatches(confirmed, current) {
  if (!confirmed || !current || confirmed.chainId !== current.chainId) return false;
  if (
    confirmed.verification?.review?.schemaVersion
      !== CUSTOM_SUPPLY_CHAIN_REVIEW_SCHEMA_VERSION
  ) {
    return false;
  }
  const reviewed = text(confirmed.verification?.review?.projectionFingerprint);
  const confirmedFingerprint = customSupplyChainProjectionFingerprint(confirmed);
  const currentFingerprint = customSupplyChainProjectionFingerprint(current);
  return Boolean(
    reviewed
    && confirmedFingerprint
    && currentFingerprint
    && reviewed === confirmedFingerprint
    && reviewed === currentFingerprint,
  );
}
