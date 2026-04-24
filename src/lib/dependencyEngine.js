/**
 * dependencyEngine — generator-side helpers that surface custom-content
 * dependency declarations to the engine.
 *
 * The generators (servicesGenerator, computeActiveChains, economicGenerator)
 * historically operated only on prebuilt catalog entries via name-string
 * matching. Custom items added via the Compendium can now declare:
 *
 *   institutions: { produces:        [tradeGoods refId, ...]
 *                   requires:        [resources refId, ...]
 *                   partOfChains:    [resourceChains refId, ...] }
 *
 *   resources:    { feedsChains:     [resourceChains refId, ...]
 *                   producedBy:      [institutions refId, ...]
 *                   enables:         [institutions refId, ...] }
 *
 *   stressors:    { affects:               [string category, ...]
 *                   disablesInstitutions:  [institutions refId, ...]
 *                   disablesGoods:         [tradeGoods refId, ...] }
 *
 *   tradeGoods:   { requiredInstitution:   institutions refId (single)
 *                   requiredResources:     [resources refId, ...]
 *                   partOfChains:          [resourceChains refId, ...] }
 *
 * This module:
 *   1. Builds a registry from the live store (`useStore.getState()`) on demand
 *   2. Indexes custom items by lowercased name for fast lookup from generators
 *      that pass institution/resource NAMES (not refIds)
 *   3. Exposes resolve helpers that convert refIds → human-readable names so
 *      legacy name-match code keeps working with custom-defined dependencies
 *
 * Usage from generators:
 *
 *   import { customDeps } from '../lib/dependencyEngine.js';
 *   const extras = customDeps.servicesProducedBy('My Bespoke Brewery');
 *   const chains = customDeps.chainsFedByResource('Glowmoss bog');
 *   const reqName = customDeps.resolveInstitutionRequirement('custom:lu_xyz');
 */

import { useStore } from '../store';
import { buildRegistry, parseRefId } from './customRegistry.js';

// ── Registry caching ────────────────────────────────────────────────────────
// Custom content rarely changes during a single generation pass. Cache the
// registry by (store-revision-key) so repeated calls in the same generation
// reuse it. We use a simple counter-style key: any add/update/delete in the
// slice bumps it via a getter on customContent itself (length sum + a hash of
// the latest updatedAt). Cheap to compute, safe to invalidate.

let _registryCache = null;
let _registryKey = null;

function currentKey(customContent) {
  if (!customContent) return 'empty';
  let count = 0;
  let latest = '';
  for (const k of Object.keys(customContent)) {
    const arr = customContent[k];
    if (!Array.isArray(arr)) continue;
    count += arr.length;
    for (const item of arr) {
      if (item?.updatedAt && item.updatedAt > latest) latest = item.updatedAt;
    }
  }
  return `${count}:${latest}`;
}

function getRegistry() {
  const cc = useStore.getState().customContent || {};
  const key = currentKey(cc);
  if (key === _registryKey && _registryCache) return _registryCache;
  _registryCache = buildRegistry(cc);
  _registryKey = key;
  return _registryCache;
}

// ── Name → custom-item indexes ──────────────────────────────────────────────
// Generators get plain names; map back to the underlying custom record so we
// can read its dependency fields.

function indexCustomByName(category) {
  const reg = getRegistry();
  const list = reg.listCustom(category);
  const byName = new Map();
  for (const e of list) {
    const k = (e.name || '').trim().toLowerCase();
    if (k) byName.set(k, e);
  }
  return byName;
}

function findCustomByName(category, name) {
  if (!name) return null;
  const idx = indexCustomByName(category);
  return idx.get(String(name).trim().toLowerCase()) || null;
}

// ── refId → name resolver ───────────────────────────────────────────────────

/** Resolve a refId (or bare name) to its display name for engine string-match
 *  pathways. Returns the input unchanged if it's already a name. */
function resolveNameFromRef(maybeRef) {
  if (!maybeRef) return '';
  if (typeof maybeRef !== 'string') return '';
  if (maybeRef.startsWith('prebuilt:') || maybeRef.startsWith('custom:')) {
    const reg = getRegistry();
    const e = reg.resolve(maybeRef);
    return e?.name || '';
  }
  return maybeRef;  // bare name
}

function resolveNamesFromRefs(refIds) {
  if (!Array.isArray(refIds)) return [];
  return refIds.map(resolveNameFromRef).filter(Boolean);
}

// ── Public helpers used by generators ───────────────────────────────────────

export const customDeps = {
  /** Force re-read of customContent (for tests or manual flush). */
  invalidate() { _registryCache = null; _registryKey = null; },

  // ── Services / produces ────────────────────────────────────────────────
  /**
   * Given an institution name (custom or prebuilt), return the list of
   * trade-good NAMES it declares it produces. Empty if no custom institution
   * by that name OR no `produces` field.
   */
  servicesProducedBy(institutionName) {
    const item = findCustomByName('institutions', institutionName);
    if (!item) return [];
    const refs = Array.isArray(item.raw?.produces) ? item.raw.produces : [];
    return resolveNamesFromRefs(refs);
  },

  // ── Resource → chain ───────────────────────────────────────────────────
  /**
   * Given a resource NAME (custom), return the engine-facing chain ids
   * (e.g. ['food_security.grain', ...]) it declares it feeds. Empty if no
   * custom resource by that name OR no `feedsChains` field.
   */
  chainsFedByResource(resourceName) {
    const item = findCustomByName('resources', resourceName);
    if (!item) return [];
    const refs = Array.isArray(item.raw?.feedsChains) ? item.raw.feedsChains : [];
    const reg = getRegistry();
    const out = [];
    for (const refId of refs) {
      const entry = reg.resolve(refId);
      if (entry?.engineChainId) out.push(entry.engineChainId);
      else {
        // Best-effort: if the slug embeds `<needKey>__<chainId>`, reconstruct
        const parsed = parseRefId(refId);
        if (parsed?.source === 'prebuilt' && parsed.category === 'resourceChains' && parsed.slug?.includes('__')) {
          const [needKey, chainId] = parsed.slug.split('__');
          if (needKey && chainId) out.push(`${needKey}.${chainId}`);
        }
      }
    }
    return out;
  },

  // ── Required institution for a trade good ──────────────────────────────
  /**
   * Resolve a trade good's `requiredInstitution` field — which may be a
   * legacy bare name (prebuilt EXPORT_GOODS_BY_TIER form) or a refId from
   * the custom system — to the institution NAME the engine should match
   * against in `settlement.institutions[].name`.
   */
  resolveInstitutionRequirement(maybeRefOrName) {
    return resolveNameFromRef(maybeRefOrName);
  },

  /**
   * For a custom trade good NAME, return its declared requiredInstitution
   * NAME (or '' if none / not custom). Lets the engine extend its existing
   * `requiredInstitution` check to custom-defined goods.
   */
  requiredInstitutionForGood(goodName) {
    const item = findCustomByName('tradeGoods', goodName);
    if (!item) return '';
    const ref = item.raw?.requiredInstitution;
    return ref ? resolveNameFromRef(ref) : '';
  },

  // ── Stressor effects ───────────────────────────────────────────────────
  /**
   * Given a stressor NAME, return the institutions it declares it disables.
   */
  institutionsDisabledByStressor(stressorName) {
    const item = findCustomByName('stressors', stressorName);
    if (!item) return [];
    const refs = Array.isArray(item.raw?.disablesInstitutions) ? item.raw.disablesInstitutions : [];
    return resolveNamesFromRefs(refs);
  },

  /** Trade-good names disabled by a stressor. */
  goodsDisabledByStressor(stressorName) {
    const item = findCustomByName('stressors', stressorName);
    if (!item) return [];
    const refs = Array.isArray(item.raw?.disablesGoods) ? item.raw.disablesGoods : [];
    return resolveNamesFromRefs(refs);
  },

  // ── Lower-level escape hatch ───────────────────────────────────────────
  registry() { return getRegistry(); },
};

export default customDeps;
