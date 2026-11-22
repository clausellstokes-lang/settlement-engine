/**
 * Exact ownership for custom-definition trade endpoints.
 *
 * The canonical economy still exposes flat display-label arrays. Those arrays
 * cannot represent two different owners with the same spelling: a native
 * "Baked goods" export and a reviewed custom good named "Baked goods" collapse
 * to one string. These sidecars retain the missing source information without
 * changing the legacy display surface:
 *
 *   nativeTradeLabels     — labels already owned by the native economy;
 *   customTradeEndpoints  — one active custom endpoint per exact owner.
 *
 * Reviewed chains and direct finished-goods supply both write the same exact
 * owner shape. Authored `satisfies` semantics are resolved from immutable
 * custom-definition identity, never from an endpoint's display label. A
 * generic custom-chain output may still retain chain provenance, but it cannot
 * borrow the mechanics of a same-named trade-good definition.
 */

import { tradeCategoryLabelOf } from '../customContentSchema.js';
import { compareCodepoint } from '../deterministicSort.js';
import {
  projectCustomDefinitionIdentity,
} from './customDefinitionIdentityProjection.js';

const TRADE_DIRECTIONS = /** @type {const} */ (['exports', 'imports']);

/**
 * Partial read shapes for untrusted reviewed-chain and registry projections.
 * They enumerate only the fields this leaf consumes; all other admitted JSON
 * remains `unknown`.
 *
 * @typedef {Record<string, unknown> & {
 *   kind?:unknown,
 *   source?:unknown,
 *   name?:unknown,
 *   refId?:unknown,
 *   uid?:unknown,
 * }} TradeNodeLike
 * @typedef {Record<string, unknown> & {
 *   chainId?:unknown,
 *   discovered?:{nodes?:TradeNodeLike[]},
 *   activation?:{state?:unknown},
 *   tradeEndpoints?:Partial<Record<'exports'|'imports', unknown[]>>,
 *   tradeEndpointOwners?:Partial<
 *     Record<'exports'|'imports', Array<Record<string, unknown>>>
 *   >,
 * }} TradeChainLike
 * @typedef {Record<string, unknown> & {
 *   source?:unknown,
 *   category?:unknown,
 *   raw?:Record<string, unknown>,
 * }} TradeRegistryEntry
 * @typedef {Record<string, unknown> & {
 *   primaryExports?:unknown[],
 *   primaryImports?:unknown[],
 *   customTradeLabels?:Partial<Record<'exports'|'imports', string[]>>,
 *   nativeTradeLabels?:Partial<Record<'exports'|'imports', string[]>>,
 *   customTradeEndpoints?:Partial<
 *     Record<'exports'|'imports', Array<Record<string, unknown>>>
 *   >,
 * }} TradeEconomicState
 */

/** @param {unknown} value */
const normalize = value => String(value || '').trim().toLowerCase();

/** @param {unknown} value */
const text = value => String(value ?? '').trim();

/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
function isRecord(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function tradeLabel(value) {
  if (typeof value === 'string') return value;
  if (!isRecord(value)) return '';
  return text(value.label ?? value.name ?? value.good);
}

/**
 * Stable key for one custom endpoint owner. The chain id remains part of the
 * key because one definition can legitimately be the reviewed endpoint of
 * multiple active paths, and those paths are distinct provenance.
 *
 * @param {Record<string, unknown>} endpoint
 */
function endpointOwnerKey(endpoint) {
  return [
    normalize(endpoint.label),
    text(endpoint.chainId),
    text(endpoint.customDefinitionId),
    text(endpoint.refId),
    text(endpoint.nodeUid),
  ].join('|');
}

/**
 * Build identity-bearing endpoint owners from the fingerprinted reviewed
 * graph. Only an exact, unique custom trade-good node can project immutable
 * definition identity. Other reviewed outputs retain chain ownership but no
 * authored trade-good mechanics.
 *
 * @param {TradeChainLike} chain
 * @param {'exports'|'imports'} direction
 * @param {string[]} labels
 * @returns {Array<Record<string, unknown>>}
 */
export function projectReviewedTradeEndpointOwners(
  chain,
  direction,
  labels,
) {
  /** @type {TradeNodeLike[]} */
  const nodes = Array.isArray(chain?.discovered?.nodes)
    ? chain.discovered.nodes
    : [];
  return (labels || []).map(label => {
    const owner = {
      label,
      source: 'custom',
      chainId: text(chain?.chainId) || null,
    };
    const matches = nodes.filter(node => (
      node?.kind === 'good'
      && node?.source === 'custom'
      && normalize(node?.name) === normalize(label)
    ));
    if (matches.length !== 1) return owner;

    const [node] = matches;
    return {
      ...owner,
      refId: text(node.refId) || null,
      nodeUid: text(node.uid) || null,
      customDefinitionCategory: 'tradeGoods',
      ...projectCustomDefinitionIdentity(node),
    };
  });
}

/**
 * Resolve the current authored semantics for identity-bearing endpoint owners.
 * Every projected revision field that exists on the endpoint must still match
 * the active registry head. This is defensive redundancy over chain activation:
 * stale or forged sidecar data fails closed instead of gaining `satisfies`.
 *
 * Generic reviewed-chain endpoints are returned with `satisfies: null`; they
 * remain custom-owned presentation but carry no borrowed definition mechanics.
 *
 * @param {unknown} endpoints
 * @param {{
 *   resolve?:(refId:string)=>TradeRegistryEntry|null,
 *   listCustom?:(category:string)=>TradeRegistryEntry[],
 * }} registry
 * @returns {Array<Record<string, unknown> & {label:string, satisfies:string|null}>}
 */
export function resolveCustomTradeEndpointSemantics(endpoints, registry) {
  const resolved = [];
  for (const rawEndpoint of Array.isArray(endpoints) ? endpoints : []) {
    if (!isRecord(rawEndpoint)) continue;
    const label = tradeLabel(rawEndpoint);
    if (!label) continue;

    let satisfies = null;
    if (
      rawEndpoint.customDefinitionCategory === 'tradeGoods'
      && text(rawEndpoint.customDefinitionId)
    ) {
      const refId = text(rawEndpoint.refId);
      let entry = refId && typeof registry?.resolve === 'function'
        ? registry.resolve(refId)
        : null;
      if (!entry && typeof registry?.listCustom === 'function') {
        const wantedDefinitionId = text(rawEndpoint.customDefinitionId);
        const matches = registry.listCustom('tradeGoods').filter(candidate => (
          text(
            projectCustomDefinitionIdentity(candidate?.raw)
              .customDefinitionId,
          ) === wantedDefinitionId
        ));
        entry = matches.length === 1 ? matches[0] : null;
      }

      if (entry?.source === 'custom' && entry?.category === 'tradeGoods') {
        const current = projectCustomDefinitionIdentity(entry.raw);
        const identityKeys = [
          'customDefinitionId',
          'customDefinitionRevisionId',
          'customDefinitionContentHash',
          'customDefinitionVersion',
          'customDefinitionFingerprint',
        ];
        const exact = identityKeys.every(key => (
          rawEndpoint[key] == null
          || String(rawEndpoint[key]) === String(current[key] ?? '')
        ));
        const authored = text(entry.raw?.satisfies);
        if (exact && authored) satisfies = authored;
      }
    }

    resolved.push({
      ...rawEndpoint,
      label,
      satisfies,
    });
  }
  return resolved.sort((left, right) => compareCodepoint(
    endpointOwnerKey(left),
    endpointOwnerKey(right),
  ));
}

/**
 * Project one direction of a mixed native/custom flat trade list.
 *
 * Exact endpoint owners may fold into authored categories. Legacy custom label
 * provenance remains compatible through `legacySatisfies`, but it is consulted
 * only for labels already declared custom. Native namesakes are retained beside
 * the folded custom category instead of being relabelled or erased.
 *
 * @param {unknown[]} labels
 * @param {{
 *   endpoints?:Array<Record<string, unknown> & {label:string,satisfies:string|null}>,
 *   nativeLabels?:unknown[]|null,
 *   priorCustom?:Set<string>,
 *   legacySatisfies?:Map<string,string>,
 * }} [options]
 * @returns {{
 *   labels:unknown[],
 *   members:Record<string,string[]>,
 *   custom:string[],
 *   semanticClaims:Array<{label:string,satisfies:string,owner:Record<string,unknown>|null}>,
 * }}
 */
export function projectOwnedCustomTradeDirection(labels, options = {}) {
  const input = Array.isArray(labels) ? labels : [];
  const priorCustom = options.priorCustom instanceof Set
    ? options.priorCustom
    : new Set();
  const legacySatisfies = options.legacySatisfies instanceof Map
    ? options.legacySatisfies
    : new Map();
  const hasNativeSidecar = Array.isArray(options.nativeLabels);
  const nativeValues = hasNativeSidecar
    ? /** @type {unknown[]} */ (options.nativeLabels)
    : [];
  const native = new Set(
    nativeValues
      .map(normalize)
      .filter(Boolean),
  );
  const inputKeys = new Set(input.map(tradeLabel).map(normalize).filter(Boolean));

  /** @type {Map<string, Array<Record<string, unknown> & {label:string,satisfies:string|null}>>} */
  const exactByLabel = new Map();
  for (const endpoint of options.endpoints || []) {
    const key = normalize(endpoint.label);
    if (!key || !inputKeys.has(key)) continue;
    exactByLabel.set(key, [...(exactByLabel.get(key) || []), endpoint]);
  }

  /** @type {Array<{label:string,satisfies:string,owner:Record<string,unknown>|null}>} */
  const semanticClaims = [];
  /** @type {unknown[]} */
  const out = [];
  /** @type {Set<string>} */
  const seenLabels = new Set();
  /** @type {Record<string, string[]>} */
  const members = {};
  /** @type {string[]} */
  const custom = [];
  /** @type {Set<string>} */
  const customSeen = new Set();

  /** @param {unknown} value */
  const pushLabel = value => {
    const key = normalize(tradeLabel(value));
    if (!key || seenLabels.has(key)) return;
    seenLabels.add(key);
    out.push(value);
  };
  /** @param {string} value */
  const markCustom = value => {
    const key = normalize(value);
    if (!key || customSeen.has(key)) return;
    customSeen.add(key);
    custom.push(value);
  };
  /** @param {string} category @param {string} member */
  const addMember = (category, member) => {
    const bucket = (members[category] = members[category] || []);
    const key = normalize(member);
    if (!bucket.some(value => normalize(value) === key)) bucket.push(member);
  };

  for (const rawLabel of input) {
    const label = tradeLabel(rawLabel);
    const key = normalize(label);
    if (!key) continue;
    const exactEndpoints = exactByLabel.get(key) || [];
    const legacySatisfiesValue = (
      exactEndpoints.length === 0
      && priorCustom.has(key)
    )
      ? legacySatisfies.get(key) || null
      : null;
    const isCustomOwned = exactEndpoints.length > 0 || priorCustom.has(key);

    if (!isCustomOwned) {
      pushLabel(rawLabel);
      continue;
    }

    // Missing native ownership beside a new exact endpoint is treated
    // conservatively. The writer always emits both sidecars, but an old or
    // partial save must never lose a possibly-native flat label.
    const nativeOwned = native.has(key)
      || (exactEndpoints.length > 0 && !hasNativeSidecar);
    if (nativeOwned) pushLabel(rawLabel);

    /** @type {Array<{
     *   label:string,
     *   satisfies:string,
     *   owner:Record<string,unknown>|null,
     * }>} */
    const claims = exactEndpoints
      .filter(endpoint => Boolean(endpoint.satisfies))
      .map(endpoint => ({
        label,
        satisfies: /** @type {string} */ (endpoint.satisfies),
        owner: endpoint,
      }));
    if (legacySatisfiesValue) {
      claims.push({
        label,
        satisfies: legacySatisfiesValue,
        owner: null,
      });
    }
    semanticClaims.push(...claims);

    if (!claims.length) {
      if (!nativeOwned) {
        pushLabel(rawLabel);
        markCustom(label);
      }
      continue;
    }
    for (const claim of claims) {
      const category = tradeCategoryLabelOf(claim.satisfies)
        || claim.satisfies;
      addMember(category, label);
      pushLabel(category);
      markCustom(category);
    }
  }

  return {
    labels: out,
    members,
    custom,
    semanticClaims,
  };
}

/**
 * Promote active reviewed endpoints while retaining both owners when a custom
 * label already exists in the native flat list.
 *
 * @param {TradeEconomicState} economicState
 * @param {TradeChainLike[]} evaluatedChains
 * @returns {{ exports: string[], imports: string[] }}
 */
export function promoteActiveCustomChainTrade(
  economicState,
  evaluatedChains,
) {
  const priorCustomLabels = economicState.customTradeLabels || {};
  const existingNative = economicState.nativeTradeLabels || {};
  const existingCustomEndpoints = economicState.customTradeEndpoints || {};
  /** @type {{exports:string[],imports:string[]}} */
  const appended = { exports: [], imports: [] };
  /** @type {Record<'exports'|'imports', Set<string>>} */
  const seen = {
    exports: new Set(
      (economicState.primaryExports || []).map(tradeLabel).map(normalize),
    ),
    imports: new Set(
      (economicState.primaryImports || []).map(tradeLabel).map(normalize),
    ),
  };
  /** @type {Record<'exports'|'imports', string[]>} */
  const native = { exports: [], imports: [] };
  /** @type {Record<'exports'|'imports', Array<Record<string, unknown>>>} */
  const customEndpoints = { exports: [], imports: [] };

  for (const direction of TRADE_DIRECTIONS) {
    const customBefore = new Set(
      (priorCustomLabels[direction] || []).map(normalize),
    );
    const nativeSeen = new Set();
    for (const value of [
      ...(existingNative[direction] || []),
      ...(
        direction === 'exports'
          ? economicState.primaryExports || []
          : economicState.primaryImports || []
      ).filter(
        /** @param {unknown} value */
        value => !customBefore.has(normalize(tradeLabel(value))),
      ),
    ]) {
      const label = tradeLabel(value);
      const key = normalize(label);
      if (!key || nativeSeen.has(key)) continue;
      nativeSeen.add(key);
      native[direction].push(label);
    }
    const endpointSeen = new Set();
    for (const endpoint of existingCustomEndpoints[direction] || []) {
      if (!isRecord(endpoint) || !tradeLabel(endpoint)) continue;
      const key = endpointOwnerKey(endpoint);
      if (endpointSeen.has(key)) continue;
      endpointSeen.add(key);
      customEndpoints[direction].push({ ...endpoint });
    }

    for (const chain of evaluatedChains || []) {
      if (chain?.activation?.state !== 'active') continue;
      const labels = chain?.tradeEndpoints?.[direction] || [];
      /** @type {Array<Record<string, unknown>>} */
      const owners = chain?.tradeEndpointOwners?.[direction] || [];
      for (const rawLabel of labels) {
        const label = tradeLabel(rawLabel);
        const key = normalize(label);
        if (!key) continue;
        const matchingOwners = owners.filter(
          /** @param {Record<string, unknown>} owner */
          owner => normalize(owner?.label) === key,
        );
        const projectedOwners = matchingOwners.length
          ? matchingOwners
          : [{
            label,
            source: 'custom',
            chainId: text(chain?.chainId) || null,
          }];
        for (const owner of projectedOwners) {
          const ownerKey = endpointOwnerKey(owner);
          if (endpointSeen.has(ownerKey)) continue;
          endpointSeen.add(ownerKey);
          customEndpoints[direction].push({ ...owner, label });
        }
        if (seen[direction].has(key)) continue;
        seen[direction].add(key);
        appended[direction].push(label);
      }
    }
  }

  if (appended.exports.length) {
    economicState.primaryExports = [
      ...(economicState.primaryExports || []),
      ...appended.exports,
    ];
  }
  if (appended.imports.length) {
    economicState.primaryImports = [
      ...(economicState.primaryImports || []),
      ...appended.imports,
    ];
  }

  const hasCustomEndpoints = TRADE_DIRECTIONS.some(
    direction => customEndpoints[direction].length > 0,
  );
  if (hasCustomEndpoints) {
    economicState.nativeTradeLabels = native;
    economicState.customTradeEndpoints = customEndpoints;
  }

  if (appended.exports.length || appended.imports.length) {
    /** @param {string[]|undefined} before @param {string[]} added */
    const merge = (before, added) => {
      const merged = [...(before || [])];
      const mergedSeen = new Set(merged.map(normalize));
      for (const label of added) {
        const key = normalize(label);
        if (!key || mergedSeen.has(key)) continue;
        mergedSeen.add(key);
        merged.push(label);
      }
      return merged;
    };
    economicState.customTradeLabels = {
      exports: merge(priorCustomLabels.exports, appended.exports),
      imports: merge(priorCustomLabels.imports, appended.imports),
    };
  }

  return appended;
}
