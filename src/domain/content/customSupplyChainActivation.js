/**
 * Runtime activation for reviewed custom supply chains.
 *
 * Confirmation answers an authoring question: "is this inferred relationship
 * a chain I intended?" It does not prove that a particular settlement can run
 * the chain. Generation answers that second question from the reviewed node
 * projection, the settlement tier, and the final materialized roster.
 *
 * This module deliberately keeps custom chains outside the native impairment
 * simulation. It only decides whether their bounded dossier projection and
 * trade endpoints are active. That preserves the existing simulation boundary
 * while preventing a reviewed-but-impossible chain from inventing commerce.
 */

import { passesTierGate } from '../customContentSchema.js';
import { compareCodepoint } from '../deterministicSort.js';
import {
  CUSTOM_SUPPLY_CHAIN_REVIEW_SCHEMA_VERSION,
  customSupplyChainDefinitionEvidence,
  customSupplyChainProjectionFingerprint,
} from './customSupplyChainReview.js';
import {
  projectCustomDefinitionIdentity,
} from './customDefinitionIdentityProjection.js';
import {
  projectReviewedTradeEndpointOwners,
} from './customTradeEndpointProjection.js';
import { isLiveInstitution } from '../institutions/institutionRoster.js';
export {
  promoteActiveCustomChainTrade,
} from './customTradeEndpointProjection.js';

/** @typedef {'institution'|'resource'|'service'|'good'} CustomChainNodeKind */
/**
 * @typedef {Object} ReviewedChainNode
 * @property {string} uid
 * @property {string} name
 * @property {CustomChainNodeKind} kind
 * @property {string} [role]
 * @property {string|null} [refId]
 * @property {string} [source]
 * @property {unknown} [tierMin]
 * @property {unknown} [tierMax]
 * @property {string|null} [definitionId]
 * @property {string|null} [revisionId]
 * @property {number|null} [revisionNumber]
 * @property {string|null} [contentHash]
 */
/**
 * @typedef {Object} RegistryEntry
 * @property {string} refId
 * @property {string} name
 * @property {string} category
 * @property {string} [source]
 * @property {string} [key]
 * @property {unknown} [tierMin]
 * @property {unknown} [tierMax]
 * @property {Record<string, unknown>} [raw]
 */
/**
 * @typedef {Object} RegistryLike
 * @property {(refId: string) => RegistryEntry|null} [resolve]
 * @property {(category: string) => RegistryEntry[]} [listAll]
 */
/**
 * @typedef {Object} CustomChainReason
 * @property {string} code
 * @property {string} component
 * @property {string} kind
 * @property {unknown} [tierMin]
 * @property {unknown} [tierMax]
 * @property {string} [requiredKind]
 */
/**
 * @typedef {Object} ConfirmedCustomChain
 * @property {string|null} [chainId]
 * @property {string} [label]
 * @property {string} [status]
 * @property {string|null} [resource]
 * @property {string[]} [processingInstitutions]
 * @property {string[]} [outputs]
 * @property {string[]} [upstreamMissing]
 * @property {{
 *   state?: string,
 *   review?: {schemaVersion?: number, projectionFingerprint?: string},
 * }} [verification]
 * @property {{
 *   nodes?: ReviewedChainNode[],
 *   tradeEndpoints?: {
 *     exports?: Array<string|{label?: string}>,
 *     imports?: Array<string|{label?: string}>,
 *   },
 * }} [discovered]
 */
/**
 * @typedef {Object} EvaluatedCustomChain
 * @property {string|null} chainId
 * @property {string} label
 * @property {string} status
 * @property {string|null} resource
 * @property {string[]} processingInstitutions
 * @property {string[]} outputs
 * @property {{state: string, evaluatedTier: string|null, reasons: CustomChainReason[]}} activation
 * @property {{exports: string[], imports: string[], promoted: boolean}} tradeEndpoints
 * @property {{
 *   exports:Array<Record<string,unknown>>,
 *   imports:Array<Record<string,unknown>>,
 * }} tradeEndpointOwners
 * @property {true} isCustom
 * @property {'custom'} source
 */
/**
 * @typedef {Object} MaterializedCustomChainInputs
 * @property {Array<string|Record<string, unknown>>} institutions
 * @property {Array<string|Record<string, unknown>>} resources
 * @property {Array<string|Record<string, unknown>>} depletedResources
 * @property {Array<string|Record<string, unknown>>} services
 */
export const CUSTOM_CHAIN_ACTIVATION_STATE = Object.freeze({
  ACTIVE: 'active',
  BLOCKED: 'blocked',
  INELIGIBLE: 'ineligible',
});

const CATEGORY_BY_KIND = Object.freeze({
  institution: 'institutions',
  resource: 'resources',
  service: 'services',
  good: 'tradeGoods',
});

const KIND_BY_CATEGORY = /** @type {Readonly<Record<string, CustomChainNodeKind>>} */ (Object.freeze({
  institutions: 'institution',
  resources: 'resource',
  services: 'service',
  tradeGoods: 'good',
}));

/** @param {unknown} category @returns {CustomChainNodeKind} */
function kindForCategory(category) {
  return typeof category === 'string' ? KIND_BY_CATEGORY[category] || 'good' : 'good';
}

/**
 * These are the manifest-declared relationships whose meaning becomes
 * mechanical only inside a confirmed chain. Inputs gate the whole reviewed
 * path. `yields` is an output relation, so it gates only the yielded definition
 * that actually appears in this reviewed path—not unrelated sibling outputs.
 */
const RELATIONSHIPS_BY_KIND = Object.freeze({
  institution: Object.freeze([
    Object.freeze({
      key: 'requires',
      categories: Object.freeze(['resources', 'tradeGoods', 'services']),
      direction: 'input',
    }),
  ]),
  service: Object.freeze([
    Object.freeze({
      key: 'providedBy',
      categories: Object.freeze(['institutions']),
      direction: 'input',
    }),
    Object.freeze({
      key: 'requires',
      categories: Object.freeze(['resources', 'tradeGoods', 'services']),
      direction: 'input',
    }),
  ]),
  resource: Object.freeze([
    Object.freeze({
      key: 'yields',
      categories: Object.freeze(['tradeGoods', 'services']),
      direction: 'output',
    }),
  ]),
  good: Object.freeze([
    Object.freeze({
      key: 'requiredInstitution',
      categories: Object.freeze(['institutions']),
      direction: 'input',
    }),
    Object.freeze({
      key: 'requiredResources',
      categories: Object.freeze(['resources', 'tradeGoods', 'services']),
      direction: 'input',
    }),
  ]),
});

/** @param {unknown} value */
const normalize = value => String(value || '').trim().toLowerCase();
/** @param {unknown} value */
const identityText = value => String(value ?? '').trim();

/**
 * @param {unknown[]|null|undefined} items
 * @returns {Array<string|Record<string, unknown>>}
 */
function materializedEntitiesFrom(items) {
  return /** @type {Array<string|Record<string, unknown>>} */ ((items || []).filter(item => (
    typeof item === 'string'
    || Boolean(item && typeof item === 'object' && !Array.isArray(item))
  )));
}

/**
 * Preserve name-only legacy rosters while applying the canonical standing
 * predicate to identity-bearing institution rows.
 *
 * Current settlements materialize institution objects, which can retain a
 * ruined or closed row for history. Older activation callers legitimately
 * provide names because those save shapes have no lifecycle status to inspect.
 * Treating a string as a malformed institution would silently block every
 * otherwise-valid legacy reviewed chain.
 *
 * @param {unknown[]|null|undefined} items
 * @returns {Array<string|Record<string, unknown>>}
 */
function liveMaterializedInstitutions(items) {
  return materializedEntitiesFrom(items).filter(item => (
    typeof item === 'string' || isLiveInstitution(item)
  ));
}

/** @param {Record<string, unknown[]>|null|undefined} availableServices */
function serviceEntitiesFrom(availableServices) {
  const services = Object.values(availableServices || {})
    .flatMap(bucket => (Array.isArray(bucket) ? bucket : []));
  return materializedEntitiesFrom(services);
}

/**
 * @param {ReviewedChainNode} node
 * @param {RegistryLike|null|undefined} registry
 * @returns {RegistryEntry|null}
 */
function registryEntryForNode(node, registry) {
  if (!registry || !node) return null;

  // Once a review carries stable identity, failure to resolve that exact
  // identity is authoritative. Falling through to a same-name definition
  // would let deletion silently rebind an old confirmation.
  if (node.refId) {
    return typeof registry.resolve === 'function'
      ? registry.resolve(node.refId)
      : null;
  }

  // Confirmed chains created before node snapshots carried refIds still retain
  // the custom localUid as `uid`. Resolve that stable identity before falling
  // back to a name match. A failed exact lookup must remain failed.
  if (
    node.uid
    && !String(node.uid).startsWith('seed-')
    && node?.source !== 'prebuilt'
    && node?.source !== 'reference'
  ) {
    return typeof registry.resolve === 'function'
      ? registry.resolve(`custom:${node.uid}`)
      : null;
  }

  const category = CATEGORY_BY_KIND[node.kind];
  const entries = category && typeof registry.listAll === 'function'
    ? registry.listAll(category)
    : [];
  const matches = entries.filter(
    entry => normalize(entry?.name) === normalize(node.name),
  );
  return matches.length === 1 ? matches[0] : null;
}

/**
 * Resolve current dependency identity without allowing a same-named entry from
 * the wrong category to satisfy the relationship.
 *
 * @param {string} ref
 * @param {readonly string[]} categories
 * @param {RegistryLike|null|undefined} registry
 * @returns {RegistryEntry|null}
 */
function registryEntryForReference(ref, categories, registry) {
  if (!registry) return null;
  if (String(ref).includes(':')) {
    if (typeof registry.resolve !== 'function') return null;
    const direct = registry.resolve(ref);
    return direct && categories.includes(direct.category) ? direct : null;
  }
  if (typeof registry.listAll !== 'function') return null;
  const key = normalize(ref);
  const matches = new Map();
  for (const category of categories) {
    for (const entry of registry.listAll(category)) {
      if (
        normalize(entry?.name) === key
        || normalize(entry?.key) === key
      ) {
        matches.set(entry.refId, entry);
      }
    }
  }
  return matches.size === 1 ? [...matches.values()][0] : null;
}

/**
 * Find the dependency snapshot the author actually reviewed. The stable ref is
 * authoritative; the name/key aliases exist only for legacy bare-name chains.
 *
 * @param {string} ref
 * @param {RegistryEntry|null} entry
 * @param {ReviewedChainNode[]} nodes
 * @returns {ReviewedChainNode|null}
 */
function reviewedNodeForReference(ref, entry, nodes) {
  const requestedRef = identityText(ref);
  const exactRef = identityText(entry?.refId)
    || (String(ref).includes(':') ? requestedRef : '');
  if (exactRef) {
    const exactMatches = nodes.filter(node => (
      identityText(node.refId) === exactRef
      || (
        !node.refId
        && exactRef.startsWith('custom:')
        && `custom:${identityText(node.uid)}` === exactRef
      )
    ));
    if (exactMatches.length === 1) return exactMatches[0];

    // A stable dependency reference is an identity claim. If that exact
    // reviewed node is absent or duplicated, a display-name match is not a
    // substitute.
    if (String(ref).includes(':') || exactMatches.length > 1) return null;
  }

  const aliases = new Set([
    normalize(requestedRef),
    normalize(entry?.name),
    normalize(entry?.key),
  ].filter(Boolean));
  const legacyMatches = nodes.filter(node => aliases.has(normalize(node.name)));
  return legacyMatches.length === 1 ? legacyMatches[0] : null;
}

/** @param {ReviewedChainNode} node */
function isCustomNode(node) {
  if (node?.source === 'custom') return true;
  if (String(node?.refId || '').startsWith('custom:')) return true;
  // Legacy inferred nodes used the custom item's localUid directly. Seeded
  // built-ins were the only nodes with a synthetic `seed-` prefix.
  return Boolean(node?.uid) && !String(node.uid).startsWith('seed-')
    && node?.source !== 'prebuilt'
    && node?.source !== 'reference';
}

/** @param {ReviewedChainNode} node */
function hasStableNodeIdentity(node) {
  if (node?.refId) return true;
  return Boolean(node?.uid)
    && !String(node.uid).startsWith('seed-')
    && node?.source !== 'prebuilt'
    && node?.source !== 'reference';
}

/**
 * Compare the reviewed custom node to the current exact authored revision.
 *
 * @param {ReviewedChainNode} node
 * @param {RegistryEntry|null} entry
 * @returns {CustomChainReason|null}
 */
function revisionReason(node, entry) {
  if (!isCustomNode(node)) return null;
  if (!node.contentHash || !entry?.raw || entry.source !== 'custom') {
    return {
      code: 'review_evidence_missing',
      component: node.name,
      kind: node.kind,
    };
  }

  let current;
  try {
    current = customSupplyChainDefinitionEvidence(entry.category, entry.raw);
  } catch {
    return {
      code: 'review_evidence_missing',
      component: node.name,
      kind: node.kind,
    };
  }

  const definitionChanged = Boolean(node.definitionId)
    && node.definitionId !== current.definitionId;
  const revisionChanged = Boolean(node.revisionId)
    && node.revisionId !== current.revisionId;
  if (
    definitionChanged
    || revisionChanged
    || node.contentHash !== current.contentHash
  ) {
    return {
      code: 'reviewed_revision_changed',
      component: node.name,
      kind: node.kind,
    };
  }
  return null;
}

/**
 * @param {ReviewedChainNode} node
 * @param {string|null|undefined} tier
 * @param {RegistryEntry|null} entry
 * @returns {CustomChainReason|null}
 */
function tierReason(node, tier, entry) {
  const gate = {
    tierMin: node?.tierMin ?? entry?.raw?.tierMin ?? entry?.tierMin,
    tierMax: node?.tierMax ?? entry?.raw?.tierMax ?? entry?.tierMax,
  };
  if (passesTierGate(gate, tier)) return null;
  return {
    code: 'outside_tier',
    component: node.name,
    kind: node.kind,
    tierMin: gate.tierMin || null,
    tierMax: gate.tierMax || null,
  };
}

/**
 * @param {ReviewedChainNode} node
 * @param {MaterializedCustomChainInputs} materialized
 * @param {RegistryEntry|null} entry
 * @param {RegistryLike|null|undefined} registry
 * @returns {CustomChainReason|null}
 */
function missingMaterializationReason(node, materialized, entry, registry) {
  const aliases = new Set([
    normalize(node?.name),
    normalize(entry?.name),
    normalize(entry?.key),
  ].filter(Boolean));
  if (!aliases.size) return null;

  /** @param {string|Record<string, unknown>} entity */
  const entityName = entity => (
    typeof entity === 'string'
      ? normalize(entity)
      : normalize(entity?.name)
  );
  /**
   * @param {Array<string|Record<string, unknown>>} entities
   * @returns {'present'|'ambiguous'|'absent'}
   */
  const materializationStateIn = entities => {
    const candidates = entities.filter(entity => aliases.has(entityName(entity)));
    if (!candidates.length) return 'absent';
    if (entry?.source !== 'custom') {
      const expectedRefId = identityText(entry?.refId);
      let sawStableIdentity = false;
      for (const candidate of candidates) {
        if (typeof candidate === 'string') continue;
        const candidateRefId = identityText(candidate?.refId);
        if (!candidateRefId) continue;
        sawStableIdentity = true;
        if (expectedRefId && candidateRefId === expectedRefId) return 'present';
      }
      if (sawStableIdentity) return 'ambiguous';
      return registryNameUniquelyResolves(node, entry, registry)
        ? 'present'
        : 'ambiguous';
    }

    let expected;
    try {
      expected = entry.raw
        ? customSupplyChainDefinitionEvidence(entry.category, entry.raw)
        : null;
    } catch {
      return 'ambiguous';
    }
    const expectedRefId = identityText(entry?.refId);
    let sawCandidateIdentity = false;
    for (const candidate of candidates) {
      if (typeof candidate === 'string') continue;
      const projected = projectCustomDefinitionIdentity(candidate);
      const candidateDefinitionId = identityText(projected.customDefinitionId);
      const candidateRevisionId = identityText(
        projected.customDefinitionRevisionId,
      );
      const candidateContentHash = identityText(
        projected.customDefinitionContentHash,
      );
      const candidateRefId = identityText(candidate?.refId);
      const candidateLocalUid = identityText(candidate?.localUid);
      const candidateStableRefs = [
        candidateRefId,
        candidateLocalUid
          ? (
            candidateLocalUid.startsWith('custom:')
              ? candidateLocalUid
              : `custom:${candidateLocalUid}`
          )
          : '',
      ].filter(Boolean);
      const hasProjectedRevisionIdentity = Boolean(
        candidateDefinitionId
        || candidateRevisionId
        || candidateContentHash
      );
      if (hasProjectedRevisionIdentity || candidateStableRefs.length) {
        sawCandidateIdentity = true;
      }
      const stableIdentityMatches = (
        !candidateStableRefs.length
        || (
          Boolean(expectedRefId)
          && candidateStableRefs.every(refId => refId === expectedRefId)
        )
      );
      if (
        expected
        && stableIdentityMatches
        && (
          !expected.definitionId
          || candidateDefinitionId === identityText(expected.definitionId)
        )
        && (
          !expected.revisionId
          || candidateRevisionId === identityText(expected.revisionId)
        )
        && candidateContentHash === identityText(expected.contentHash)
      ) {
        return 'present';
      }
      if (
        !hasProjectedRevisionIdentity
        && candidateStableRefs.length
        && stableIdentityMatches
      ) {
        return 'present';
      }
    }
    if (sawCandidateIdentity) return 'ambiguous';

    // Some legacy surfaces (notably resource-name config arrays) have no room
    // for definition identity. They may satisfy an exact node only when the
    // current registry proves that the display name maps to one definition.
    return registryNameUniquelyResolves(node, entry, registry)
      ? 'present'
      : 'ambiguous';
  };

  if (node.kind === 'institution') {
    const state = materializationStateIn(materialized.institutions);
    if (state === 'absent') {
      return { code: 'not_materialized', component: node.name, kind: node.kind };
    }
    if (state === 'ambiguous') {
      return {
        code: 'materialization_ambiguous',
        component: node.name,
        kind: node.kind,
      };
    }
  }
  if (node.kind === 'resource') {
    const state = materializationStateIn(materialized.resources);
    if (state === 'absent') {
      return { code: 'not_materialized', component: node.name, kind: node.kind };
    }
    if (state === 'ambiguous') {
      return {
        code: 'materialization_ambiguous',
        component: node.name,
        kind: node.kind,
      };
    }
    const depletionState = materializationStateIn(materialized.depletedResources);
    if (depletionState === 'present') {
      return { code: 'resource_depleted', component: node.name, kind: node.kind };
    }
    if (depletionState === 'ambiguous') {
      return {
        code: 'materialization_ambiguous',
        component: node.name,
        kind: node.kind,
      };
    }
  }
  if (node.kind === 'service') {
    const state = materializationStateIn(materialized.services);
    if (state === 'absent') {
      return { code: 'not_materialized', component: node.name, kind: node.kind };
    }
    if (state === 'ambiguous') {
      return {
        code: 'materialization_ambiguous',
        component: node.name,
        kind: node.kind,
      };
    }
  }

  // Trade goods are the outputs this projection can promote. Unlike
  // institutions/resources/services, they do not have a separate materialized
  // settlement roster; their upstream reviewed nodes are their production gate.
  return null;
}

/**
 * A name-only materialization is admissible only when it has one possible
 * registry meaning in the expected category.
 *
 * @param {ReviewedChainNode} node
 * @param {RegistryEntry|null} entry
 * @param {RegistryLike|null|undefined} registry
 */
function registryNameUniquelyResolves(node, entry, registry) {
  const category = entry?.category || CATEGORY_BY_KIND[node.kind];
  if (!category || typeof registry?.listAll !== 'function') return false;
  const aliases = new Set([
    normalize(node.name),
    normalize(entry?.name),
    normalize(entry?.key),
  ].filter(Boolean));
  const matches = registry.listAll(category).filter(candidate => (
    aliases.has(normalize(candidate?.name))
    || aliases.has(normalize(candidate?.key))
  ));
  return matches.length === 1 && (
    !entry?.refId || matches[0]?.refId === entry.refId
  );
}

/** @param {unknown} value */
function toList(value) {
  if (Array.isArray(value)) return value.filter(item => typeof item === 'string');
  return typeof value === 'string' && value ? [value] : [];
}

/**
 * Mechanical relationships belong to the current definition even when a stale
 * or fuzzy inferred path omits a node. Re-read every manifest-declared gate
 * rather than trusting the reviewed path shape alone.
 *
 * @param {ReviewedChainNode} node
 * @param {RegistryEntry|null} entry
 * @param {string|null|undefined} tier
 * @param {RegistryLike|null|undefined} registry
 * @param {MaterializedCustomChainInputs} materialized
 * @param {ReviewedChainNode[]} reviewedNodes
 * @returns {{ineligible: CustomChainReason[], blocked: CustomChainReason[]}}
 */
function definitionDependencyReasons(
  node,
  entry,
  tier,
  registry,
  materialized,
  reviewedNodes,
) {
  if (entry?.source !== 'custom' || !entry.raw) {
    return { ineligible: [], blocked: [] };
  }
  const ineligible = [];
  const blocked = [];

  for (const relationship of RELATIONSHIPS_BY_KIND[node.kind] || []) {
    for (const ref of toList(entry.raw[relationship.key])) {
      const dependency = registryEntryForReference(
        ref,
        relationship.categories,
        registry,
      );
      const reviewedDependency = reviewedNodeForReference(
        ref,
        dependency,
        reviewedNodes,
      );

      // `yields` may list several independent outputs. This chain is gated only
      // by the output the author reviewed into this path.
      if (relationship.direction === 'output' && !reviewedDependency) continue;

      if (!dependency && !reviewedDependency) {
        // Bare unresolved input labels are legacy external-import endpoints.
        // Stable definition refs, and singular provider relationships, are
        // closed-world promises and therefore fail closed when unavailable.
        if (
          String(ref).includes(':')
          || relationship.categories.length === 1
        ) {
          blocked.push({
            code: 'dependency_unavailable',
            component: node.name,
            kind: node.kind,
            requiredKind: relationship.categories.length === 1
              ? kindForCategory(relationship.categories[0])
              : 'component',
          });
        }
        continue;
      }

      const dependencyNode = reviewedDependency || {
        uid: dependency?.refId || ref,
        name: dependency?.name || ref,
        kind: kindForCategory(dependency?.category),
        refId: dependency?.refId || null,
        source: dependency?.source || 'reference',
        tierMin: dependency?.raw?.tierMin ?? dependency?.tierMin,
        tierMax: dependency?.raw?.tierMax ?? dependency?.tierMax,
      };
      const outsideTier = tierReason(dependencyNode, tier, dependency);
      if (outsideTier) {
        ineligible.push(outsideTier);
        continue;
      }

      const absent = missingMaterializationReason(
        dependencyNode,
        materialized,
        dependency,
        registry,
      );
      if (absent) blocked.push(absent);
    }
  }

  return { ineligible, blocked };
}

/** @param {CustomChainReason[]} reasons */
function uniqueReasons(reasons) {
  const seen = new Set();
  return reasons.filter(reason => {
    const key = [
      reason.code,
      reason.kind,
      normalize(reason.component),
      reason.tierMin || '',
      reason.tierMax || '',
      reason.requiredKind || '',
    ].join('|');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * @param {ConfirmedCustomChain} chain
 * @param {'exports'|'imports'} direction
 */
function endpointLabels(chain, direction) {
  const reviewed = chain?.discovered?.tradeEndpoints?.[direction];
  const fallback = direction === 'exports' ? chain?.outputs : chain?.upstreamMissing;
  const exactReview = chain?.verification?.review?.schemaVersion
    === CUSTOM_SUPPLY_CHAIN_REVIEW_SCHEMA_VERSION;
  const values = Array.isArray(reviewed)
    ? reviewed
    : (!exactReview && Array.isArray(fallback) ? fallback : []);
  const seen = new Set();
  const labels = [];
  for (const value of values) {
    const label = String(typeof value === 'string' ? value : value?.label || '').trim();
    const key = normalize(label);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    labels.push(label);
  }
  return labels;
}

/**
 * Rebuild every mechanical/rendered path field from the fingerprinted graph.
 * Top-level fields remain compatibility aliases for the authoring UI, but they
 * are not authority once an exact review exists.
 *
 * @param {ConfirmedCustomChain} chain
 */
function reviewedPathProjection(chain) {
  const nodes = Array.isArray(chain?.discovered?.nodes)
    ? chain.discovered.nodes
    : [];
  const source = nodes.find(node => node?.role === 'source') || nodes[0] || null;
  const sink = nodes.find(node => node?.role === 'sink')
    || nodes[nodes.length - 1]
    || null;
  const exports = endpointLabels(chain, 'exports');
  const processingInstitutions = [];
  const seenProcessors = new Set();
  for (const node of nodes) {
    if (node?.kind !== 'institution' && node?.kind !== 'service') continue;
    const label = String(node?.name || '').trim();
    const key = normalize(label);
    if (!key || seenProcessors.has(key)) continue;
    seenProcessors.add(key);
    processingInstitutions.push(label);
  }
  return {
    resource: source?.kind === 'resource'
      ? String(source.name || '').trim() || null
      : null,
    processingInstitutions,
    outputs: exports.length
      ? exports.slice(0, 4)
      : (sink?.name ? [String(sink.name)] : []),
  };
}

/**
 * Evaluate confirmed chain definitions against one final generated settlement
 * roster. The output is a bounded, deterministic dossier projection.
 *
 * @param {ConfirmedCustomChain[]} confirmedChains
 * @param {{
 *   tier?: string,
 *   institutions?: Array<Object|string>,
 *   resources?: Array<Object|string>,
 *   depletedResources?: Array<Object|string>,
 *   availableServices?: Record<string, Array<Object|string>>,
 *   registry?: RegistryLike,
 * }} runtime
 * @returns {EvaluatedCustomChain[]}
 */
export function evaluateConfirmedCustomSupplyChains(confirmedChains, runtime = {}) {
  const materialized = {
    institutions: liveMaterializedInstitutions(runtime.institutions),
    resources: materializedEntitiesFrom(runtime.resources),
    depletedResources: materializedEntitiesFrom(runtime.depletedResources),
    services: serviceEntitiesFrom(runtime.availableServices),
  };

  return (confirmedChains || [])
    .filter(chain => chain?.verification?.state === 'confirmed')
    .slice()
    .sort((a, b) => compareCodepoint(
      a.label || a.chainId || '',
      b.label || b.chainId || '',
    ))
    .map(chain => {
      const nodes = Array.isArray(chain?.discovered?.nodes)
        ? chain.discovered.nodes
        : [];
      const ineligible = [];
      const blocked = [];
      const reviewedFingerprint = chain?.verification?.review;
      const projectionFingerprint = customSupplyChainProjectionFingerprint(chain);

      if (nodes.length < 2) {
        blocked.push({
          code: 'unreviewable_projection',
          component: chain.label || chain.chainId || 'Custom chain',
          kind: 'chain',
        });
      } else if (
        reviewedFingerprint?.schemaVersion
          !== CUSTOM_SUPPLY_CHAIN_REVIEW_SCHEMA_VERSION
        || !reviewedFingerprint?.projectionFingerprint
      ) {
        blocked.push({
          code: 'review_evidence_missing',
          component: chain.label || chain.chainId || 'Custom chain',
          kind: 'chain',
        });
      } else if (
        !projectionFingerprint
        || reviewedFingerprint.projectionFingerprint !== projectionFingerprint
      ) {
        blocked.push({
          code: 'reviewed_projection_changed',
          component: chain.label || chain.chainId || 'Custom chain',
          kind: 'chain',
        });
      }

      for (const node of nodes) {
        const entry = registryEntryForNode(node, runtime.registry);
        const outsideTier = tierReason(node, runtime.tier, entry);
        if (outsideTier) {
          ineligible.push(outsideTier);
          continue;
        }

        // A deleted/archived custom definition cannot be resurrected merely
        // because an old chain snapshot still contains its label. New snapshots
        // carry source/refId; the uid rule keeps legacy confirmations fail-closed.
        if (
          (hasStableNodeIdentity(node) && !entry)
          || (isCustomNode(node) && entry?.source !== 'custom')
        ) {
          blocked.push({
            code: 'definition_unavailable',
            component: node.name,
            kind: node.kind,
          });
          continue;
        }

        const staleRevision = revisionReason(node, entry);
        if (staleRevision) {
          blocked.push(staleRevision);
          continue;
        }

        const absent = missingMaterializationReason(
          node,
          materialized,
          entry,
          runtime.registry,
        );
        if (absent) blocked.push(absent);

        const dependencies = definitionDependencyReasons(
          node,
          entry,
          runtime.tier,
          runtime.registry,
          materialized,
          nodes,
        );
        ineligible.push(...dependencies.ineligible);
        blocked.push(...dependencies.blocked);
      }

      const uniqueIneligible = uniqueReasons(ineligible);
      const uniqueBlocked = uniqueReasons(blocked);
      const state = uniqueIneligible.length
        ? CUSTOM_CHAIN_ACTIVATION_STATE.INELIGIBLE
        : uniqueBlocked.length
          ? CUSTOM_CHAIN_ACTIVATION_STATE.BLOCKED
          : CUSTOM_CHAIN_ACTIVATION_STATE.ACTIVE;
      const reasons = state === CUSTOM_CHAIN_ACTIVATION_STATE.INELIGIBLE
        ? uniqueIneligible
        : uniqueBlocked;
      const reviewedPath = reviewedPathProjection(chain);
      const exports = endpointLabels(chain, 'exports');
      const imports = endpointLabels(chain, 'imports');

      return {
        chainId: chain.chainId || null,
        label: chain.label || chain.chainId || 'Custom chain',
        status: state,
        resource: reviewedPath.resource,
        processingInstitutions: reviewedPath.processingInstitutions,
        outputs: reviewedPath.outputs,
        activation: {
          state,
          evaluatedTier: runtime.tier || null,
          reasons,
        },
        tradeEndpoints: {
          exports,
          imports,
          promoted: state === CUSTOM_CHAIN_ACTIVATION_STATE.ACTIVE,
        },
        tradeEndpointOwners: {
          exports: projectReviewedTradeEndpointOwners(
            chain,
            'exports',
            exports,
          ),
          imports: projectReviewedTradeEndpointOwners(
            chain,
            'imports',
            imports,
          ),
        },
        isCustom: true,
        source: 'custom',
      };
    });
}
