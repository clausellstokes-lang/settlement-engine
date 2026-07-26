/**
 * dependencyEngine — generator-side helpers that surface custom-content
 * dependency declarations to the engine.
 *
 * The generators (servicesGenerator, computeActiveChains, economicGenerator)
 * historically operated only on prebuilt catalog entries via name-string
 * matching. Custom items added via the Compendium can now declare:
 *
 *   institutions: { produces:        [tradeGoods | services refId, ...]
 *                   requires:        [resources | tradeGoods | services refId, ...]
 *                   subsumes:        [institutions refId, ...] }
 *
 *   services:     { providedBy:      institutions refId (single)
 *                   requires:        [resources | tradeGoods | services refId, ...] }
 *
 *   resources:    { yields:          [tradeGoods | services refId, ...]  // declared output
 *                   enables:         [institutions refId, ...] }
 *                 // legacy: `feedsChains` (resourceChains refId[]) is still read
 *                 // by chainsFedByResource for grandfathered data, but is no
 *                 // longer authored — discovery infers chains from yields now.
 *
 *   stressors:    { affects:               [string category, ...]
 *                   disablesInstitutions:  [institutions refId, ...]
 *                   disablesGoods:         [tradeGoods refId, ...] }
 *
 *   tradeGoods:   { requiredInstitution:   institutions refId (single)
 *                   requiredResources:     [resources | tradeGoods | services refId, ...] }
 *
 * This module:
 *   1. Builds a registry from a `customContent` blob on demand
 *   2. Indexes custom items by lowercased name for compatibility callers while
 *      refusing ambiguous same-name matches instead of choosing by array order
 *   3. Exposes resolve helpers that convert refIds → human-readable names so
 *      legacy name-match code keeps working with custom-defined dependencies
 *
 * IMPORTANT: this module is intentionally store-agnostic. The previous version
 * imported `useStore` directly, which made the generator transitively depend
 * on Zustand and React, blocking headless test/CI/script usage. Now the
 * customContent source is provided by the caller — the app wires it once at
 * init via `setCustomContentSource(getter)`, and the pipeline can pass a
 * snapshot directly via `withCustomContent(customContent, fn)`.
 *
 * Usage from generators (unchanged):
 *
 *   import { customDeps } from '../lib/dependencyEngine.js';
 *   const extras = customDeps.servicesProducedBy('My Bespoke Brewery');
 *
 * Wiring (app init):
 *
 *   import { setCustomContentSource } from './lib/dependencyEngine.js';
 *   setCustomContentSource(() => useStore.getState().customContent);
 */

import { buildRegistry, parseRefId } from './customRegistry.js';
import { getCustomContentSource, registerCustomDepsInvalidate } from './customContentSource.js';
import { passesTierGate } from '../domain/customContentSchema.js';
import {
  projectCustomDefinitionIdentity,
} from '../domain/content/customDefinitionIdentityProjection.js';
import {
  isMaterializedCustomContent,
} from '../domain/content/customContentSemanticAuthority.js';

// ── Custom content source (injected via the eager seam) ─────────────────────
// The generator should not import the Zustand store. Instead, the caller
// (app at init, or pipeline per-call) tells us where to read from. Default
// returns an empty object — generators always work, just with no custom
// content visible.
//
// DE-EAGER (2026-07-19): the getter now lives in lib/customContentSource.js —
// a tiny EAGER seam — so the store can wire it at boot WITHOUT statically
// importing this module (which would drag the whole registry + its enumerator
// code into the first-paint closure; it used to cost ~41 KB there). This module
// loads lazily with its real consumers (generation, Compendium, deity
// assignment) and reads the seam's getter on each registry build. The seam
// also lets the slice invalidate our cache without importing us: we register
// the invalidator there on load (before load there is no cache to invalidate).
// setCustomContentSource is re-exported below so headless callers (tests,
// scripts) keep their one-stop import; the app's boot wiring imports the seam
// directly.
export { setCustomContentSource } from './customContentSource.js';

let _override = null; // for withCustomContent()

/**
 * Run `fn()` with `customContent` as the override source. Useful for
 * tests, headless generation, and pipeline calls that want to pin a
 * specific snapshot rather than read live store state.
 */
export function withCustomContent(customContent, fn) {
  const prev = _override;
  _override = customContent || {};
  customDeps.invalidate();
  try {
    return fn();
  } finally {
    _override = prev;
    customDeps.invalidate();
  }
}

// ── Registry caching ────────────────────────────────────────────────────────
// Custom content rarely changes during a single generation pass. Cache the
// registry by (revision-key) so repeated calls in the same generation reuse
// it. We use a simple counter-style key: any add/update/delete in the slice
// bumps it via a getter on customContent itself (length sum + a hash of the
// latest updatedAt). Cheap to compute, safe to invalidate.

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
  const cc = (_override != null ? _override : getCustomContentSource()()) || {};
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
    if (!k) continue;
    const matches = byName.get(k) || [];
    matches.push(e);
    byName.set(k, matches);
  }
  return byName;
}

function findCustomByName(category, name) {
  if (!name) return null;
  const idx = indexCustomByName(category);
  const matches = idx.get(String(name).trim().toLowerCase()) || [];
  // Name-only lookup is a compatibility path. Two definitions with the same
  // display name are not permission to choose one by array order.
  return matches.length === 1 ? matches[0] : null;
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

/** @param {unknown} value */
function materializedValues(value) {
  if (Array.isArray(value)) return value;
  if (value instanceof Set) return [...value];
  return [];
}

/** @param {unknown} value */
function normalizedName(value) {
  return String(value || '').trim().toLowerCase();
}

/**
 * @param {unknown} value
 * @returns {Record<string, unknown>|null}
 */
function objectRecord(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : null;
}

/** @param {import('./customRegistry.js').RegistryEntry} entry */
function customEntryDefinitionId(entry) {
  return projectCustomDefinitionIdentity(entry?.raw)
    .customDefinitionId || '';
}

/** @param {import('./customRegistry.js').RegistryEntry} entry */
function customEntryLocalUid(entry) {
  const direct = String(entry?.raw?.localUid || '').trim();
  if (direct) return direct;
  const parsed = parseRefId(entry?.refId);
  return parsed?.source === 'custom' ? String(parsed.localUid || '').trim() : '';
}

/** @param {import('./customRegistry.js').RegistryEntry} entry */
function customEntryKey(entry) {
  const definitionId = customEntryDefinitionId(entry);
  if (definitionId) return `definition:${definitionId}`;
  const localUid = customEntryLocalUid(entry);
  return localUid ? `local:${localUid}` : `ref:${entry?.refId || ''}`;
}

function eligibleCustomEntries(category, tier) {
  return (getRegistry().listCustom(category) || [])
    .filter(entry => passesTierGate(entry.raw || {}, tier));
}

/**
 * Resolve the exact custom definitions represented by one materialized
 * settlement surface.
 *
 * Current entities carry immutable definition ids where the surface supports
 * them. Legacy surfaces may carry only a display name; that fallback is
 * accepted only when exactly one eligible definition in the category owns the
 * name. An explicit but stale identity never falls back to a convenient name.
 *
 * Repeated projections of the same exact entity (for example a lodging service
 * cross-listed under food) collapse by definition identity.
 *
 * @param {string} category
 * @param {unknown[]|Set<unknown>|undefined|null} materialized
 * @param {string|null|undefined} tier
 */
function resolveMaterializedCustomDefinitions(category, materialized, tier) {
  const candidates = eligibleCustomEntries(category, tier);
  const byDefinitionId = new Map();
  const byLocalUid = new Map();
  const byName = new Map();

  const index = (map, key, entry) => {
    if (!key) return;
    const matches = map.get(key) || [];
    matches.push(entry);
    map.set(key, matches);
  };

  for (const entry of candidates) {
    index(byDefinitionId, customEntryDefinitionId(entry), entry);
    index(byLocalUid, customEntryLocalUid(entry), entry);
    index(byName, normalizedName(entry.name), entry);
  }

  const resolved = new Map();
  const admitUnique = (matches) => {
    if (!Array.isArray(matches) || matches.length !== 1) return;
    const entry = matches[0];
    resolved.set(customEntryKey(entry), entry);
  };

  for (const value of materializedValues(materialized)) {
    const record = objectRecord(value);
    const projected = record
      ? projectCustomDefinitionIdentity(record)
      : {};
    const definitionId = projected.customDefinitionId || '';
    if (definitionId) {
      admitUnique(byDefinitionId.get(definitionId));
      continue;
    }

    const localUid = record
      ? String(record.localUid || '').trim()
      : '';
    if (localUid) {
      admitUnique(byLocalUid.get(localUid));
      continue;
    }

    // A generated built-in entity can share a label with a custom definition.
    // Its explicit non-custom source is evidence that the custom definition did
    // not materialize; only legacy objects with no source remain name-eligible.
    if (
      record
      && record.source
      && record.source !== 'custom'
      && record.custom !== true
      && record.isCustom !== true
    ) continue;

    const name = normalizedName(
      typeof value === 'string'
        ? value
        : record?.name ?? record?.label,
    );
    if (name) admitUnique(byName.get(name));
  }

  return [...resolved.values()];
}

/**
 * Definitions whose display name is itself an unambiguous compatibility
 * address. Used where the current activation contract is provider/presence
 * based and no generated entity surface exists yet.
 */
function unambiguousCustomDefinitions(category, tier) {
  const byName = new Map();
  for (const entry of eligibleCustomEntries(category, tier)) {
    const name = normalizedName(entry.name);
    if (!name) continue;
    const matches = byName.get(name) || [];
    matches.push(entry);
    byName.set(name, matches);
  }
  return [...byName.values()]
    .filter(matches => matches.length === 1)
    .map(matches => matches[0]);
}

function materializedInstitutionPresence(institutions, tier) {
  const values = materializedValues(institutions);
  const customEntries = resolveMaterializedCustomDefinitions(
    'institutions',
    values,
    tier,
  );
  return {
    nativeNames: new Set(
      values
        .filter(value => !isMaterializedCustomContent(value))
        .map(value => normalizedName(
          typeof value === 'string'
            ? value
            : objectRecord(value)?.name,
        ))
        .filter(Boolean),
    ),
    customEntryKeys: new Set(customEntries.map(customEntryKey)),
    customEntries,
  };
}

/**
 * Check an institution reference against the materialized roster without
 * reducing an exact `custom:<localUid>` address back to a display name.
 */
function institutionRequirementIsPresent(reference, presence) {
  const scalar = Array.isArray(reference) ? reference[0] : reference;
  if (typeof scalar !== 'string' || !scalar.trim()) return false;

  const reg = getRegistry();
  const parsed = parseRefId(scalar);
  if (parsed?.source === 'custom') {
    const resolved = reg.resolve(scalar);
    return Boolean(
      resolved?.source === 'custom'
      && resolved.category === 'institutions'
      && presence.customEntryKeys.has(customEntryKey(resolved)),
    );
  }
  if (parsed?.source === 'prebuilt') {
    const resolved = reg.resolve(scalar);
    return Boolean(
      resolved?.source === 'prebuilt'
      && resolved.category === 'institutions'
      && presence.nativeNames.has(normalizedName(resolved.name)),
    );
  }
  if (parsed) return false;

  // Bare names are legacy references. They remain usable only when the full
  // institution registry has one possible target for that display name.
  const name = normalizedName(scalar);
  const matches = (reg.listAll('institutions') || [])
    .filter(entry => normalizedName(entry.name) === name);
  if (matches.length === 0) return presence.nativeNames.has(name);
  if (matches.length !== 1) return false;
  const [resolved] = matches;
  return resolved.source === 'custom'
    ? presence.customEntryKeys.has(customEntryKey(resolved))
    : presence.nativeNames.has(name);
}

/**
 * Resolve one institution's `produces` references without reducing exact
 * custom targets to display names.
 *
 * @param {unknown} institution
 * @param {string|null|undefined} [tier]
 */
function contentProducedByInstitution(institution, tier) {
  const item = customInstitutionEntry(institution, tier);
  if (!item) return [];
  const refs = Array.isArray(item.raw?.produces) ? item.raw.produces : [];
  const reg = getRegistry();
  return refs
    .map((reference) => {
      const resolved = typeof reference === 'string'
        ? reg.resolve(reference)
        : null;
      const name = resolved?.name || resolveNameFromRef(reference);
      if (!name) return null;
      return {
        name,
        category: resolved?.category || null,
        source: resolved?.source || null,
        raw: resolved?.raw || null,
        refId: resolved?.refId || null,
      };
    })
    .filter(Boolean);
}

/**
 * Resolve a custom institution definition from an exact materialized entity.
 * Explicit native provenance forbids the legacy name fallback: a built-in and
 * a custom definition may intentionally share one display label.
 *
 * @param {unknown} institution
 * @param {string|null|undefined} [tier]
 */
function customInstitutionEntry(institution, tier) {
  const record = objectRecord(institution);
  const institutionName = typeof institution === 'string'
    ? institution
    : record?.name;
  if (record && isMaterializedCustomContent(record)) {
    return resolveMaterializedCustomDefinitions(
        'institutions',
        [record],
        tier,
      )[0] || null;
  }
  if (record?.source && record.source !== 'custom') return null;
  return findCustomByName('institutions', institutionName);
}

/**
 * Resolve exact subsumption targets without collapsing their identity to a
 * display name. Dangling structured references fail closed; bare legacy names
 * remain available to the caller as identity-less compatibility targets.
 *
 * @param {unknown} institution
 * @param {string|null|undefined} [tier]
 */
function subsumptionTargetsByInstitution(institution, tier) {
  const item = customInstitutionEntry(institution, tier);
  if (!item) return [];
  const refs = Array.isArray(item.raw?.subsumes) ? item.raw.subsumes : [];
  const reg = getRegistry();
  return refs
    .map((reference) => {
      const resolved = typeof reference === 'string'
        ? reg.resolve(reference)
        : null;
      const parsed = typeof reference === 'string'
        ? parseRefId(reference)
        : null;
      const name = resolved?.name || (parsed ? '' : resolveNameFromRef(reference));
      if (!name) return null;
      return {
        name,
        category: resolved?.category || null,
        source: resolved?.source || null,
        raw: resolved?.raw || null,
        refId: resolved?.refId || null,
      };
    })
    .filter(Boolean);
}

// ── Public helpers used by generators ───────────────────────────────────────

export const customDeps = {
  /** Force re-read of customContent (for tests or manual flush). */
  invalidate() { _registryCache = null; _registryKey = null; },

  /**
   * Resolve one native or custom institution requirement against the exact
   * materialized roster. Structured custom references require matching custom
   * definition identity; structured prebuilt references require a native
   * entity. A presentation label can satisfy neither across that boundary.
   */
  institutionRequirementIsPresent(
    reference,
    institutions,
    tier,
  ) {
    return institutionRequirementIsPresent(
      reference,
      materializedInstitutionPresence(institutions, tier),
    );
  },

  // ── Services / produces ────────────────────────────────────────────────
  /**
   * Resolve an institution's authored `produces` references without erasing
   * the target definition. Generator projections need the resolved entry—not
   * merely its display name—to retain exact revision provenance.
   *
   * Bare legacy names remain usable but have no invented identity.
   */
  contentProducedBy(institution, tier) {
    return contentProducedByInstitution(institution, tier);
  },

  /**
   * Given an institution name (custom or prebuilt), return the list of
   * trade-good NAMES it declares it produces. Empty if no custom institution
   * by that name OR no `produces` field.
   *
   * Compatibility projection for name-only consumers. New entity-producing
   * paths should use `contentProducedBy` so exact definition identity survives.
   */
  servicesProducedBy(institutionName) {
    return contentProducedByInstitution(institutionName).map(entry => entry.name);
  },

  /**
   * Return identity-bearing institutions declared as subsumption targets.
   * New callers should use this form so same-name custom/native entities remain
   * distinguishable.
   */
  subsumptionTargetsFor(institution, tier) {
    return subsumptionTargetsByInstitution(institution, tier);
  },

  /**
   * Compatibility projection for older name-only consumers.
   */
  subsumedBy(institution, tier) {
    return subsumptionTargetsByInstitution(institution, tier)
      .map(target => target.name);
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
   * legacy bare name (prebuilt GOODS_MODIFIERS_BY_TIER form) or a refId from
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

  // ── Finished-goods demand satisfaction (§14 trade flow) ────────────────
  /**
   * Local supply a settlement's PRESENT custom content contributes to a
   * finished-goods demand category (military/religious/maritime/luxury/
   * alchemical). A custom institution that declares `satisfies: <category>`
   * adds supply when it's present; a custom trade good that declares it adds
   * supply when its `requiredInstitution` is present (and is itself a named
   * export once local demand is covered). Supply scales with economicWeight.
   * Returns `{ supply, goods }`; identity-aware consumers may opt into
   * `tradeGoodOwners` without changing the compatibility result shape. A no-op
   * `{ supply:0, goods:[] }` leaves the existing gap math unchanged.
   * @param {string} category
   * @param {Array<unknown>|Set<string>} presentInstitutions - materialized
   *   institution entities; a Set of names remains a legacy-compatible input
   * @param {string|null|undefined} tier - resolved settlement tier
   * @param {{tradeGoods?:unknown[],includeTradeGoodOwners?:boolean}} [materialized]
   *   optional exact materialized trade-good entities and an opt-in projection
   *   of immutable endpoint owners for consumers that retain trade provenance
   */
  finishedGoodsSupply(category, presentInstitutions, tier, materialized = {}) {
    const includeTradeGoodOwners =
      materialized.includeTradeGoodOwners === true;
    const empty = includeTradeGoodOwners
      ? { supply: 0, goods: [], tradeGoodOwners: [] }
      : { supply: 0, goods: [] };
    if (!category) return empty;
    const WEIGHT = { minor: 1, moderate: 2, major: 3, backbone: 5 };
    const institutionPresence = materializedInstitutionPresence(
      presentInstitutions,
      tier,
    );
    const tradeGoods = Object.prototype.hasOwnProperty.call(
      materialized,
      'tradeGoods',
    )
      ? resolveMaterializedCustomDefinitions(
        'tradeGoods',
        materialized.tradeGoods,
        tier,
      )
      : unambiguousCustomDefinitions('tradeGoods', tier);
    let supply = 0;
    const goods = [];
    const tradeGoodOwners = [];
    for (const e of institutionPresence.customEntries) {
      if (e.raw?.satisfies !== category) continue;
      supply += WEIGHT[e.raw?.economicWeight] || 2;
    }
    for (const e of tradeGoods) {
      if (e.raw?.satisfies !== category) continue;
      const reqRef = e.raw?.requiredInstitution;
      if (reqRef) {
        // A DECLARED requirement gates the good. A dangling/dropped ref resolves to ''
        // (deleted institution, or prepareImport nulling a rejected target) — treat that
        // as gated-and-absent, NOT ungated: an unproducible good must not count as supply
        // or be named a local export. Only an UNDECLARED requirement is freely supplied.
        if (!institutionRequirementIsPresent(reqRef, institutionPresence)) {
          continue;
        }
      }
      supply += WEIGHT[e.raw?.economicWeight] || 2;
      if (e.name) {
        goods.push(e.name);
        if (includeTradeGoodOwners) {
          tradeGoodOwners.push({
            label: e.name,
            source: 'custom',
            chainId: null,
            refId: e.refId || null,
            customDefinitionCategory: 'tradeGoods',
            ...projectCustomDefinitionIdentity(e.raw),
          });
        }
      }
    }
    return includeTradeGoodOwners
      ? { supply, goods, tradeGoodOwners }
      : { supply, goods };
  },

  // ── Food-impact tally (§14) ────────────────────────────────────────────
  /**
   * Net food producers vs consumers among the PRESENT custom content, across
   * all four types: institutions + resources count by their own presence; a
   * service counts when its providedBy institution is present; a trade good
   * when its requiredInstitution is present. The resolved settlement tier is
   * checked here as well as at materialization: a direct headless caller may
   * supply the unfiltered reviewed library, and a present provider must not
   * activate a service whose own tier gate excludes this settlement.
   * Returns { producers, consumers }.
   * Exact definition identity is authoritative wherever a materialized entity
   * carries it. Name-only legacy surfaces activate a definition only when the
   * name is unambiguous in that category. Services are the exception because
   * their declared contract is provider presence, not a name-only roster: each
   * eligible service definition remains independently visible and therefore
   * contributes its own registered effect even when labels coincide.
   *
   * @param {Array<unknown>|Set<string>} presentInstitutions - materialized
   *   institution entities, or legacy institution names
   * @param {Array<unknown>|Set<string>} presentResources - materialized custom
   *   resources, currently name-only in generated settlement config
   * @param {string|null|undefined} tier - resolved settlement tier
   * @param {{services?:unknown[],tradeGoods?:unknown[]}} [materialized] -
   *   optional exact materializations for surfaces that retain entity identity
   */
  foodImpactTally(
    presentInstitutions,
    presentResources,
    tier,
    materialized = {},
  ) {
    const institutionPresence = materializedInstitutionPresence(
      presentInstitutions,
      tier,
    );
    const resources = resolveMaterializedCustomDefinitions(
      'resources',
      presentResources,
      tier,
    );
    const services = Object.prototype.hasOwnProperty.call(
      materialized,
      'services',
    )
      ? resolveMaterializedCustomDefinitions(
        'services',
        materialized.services,
        tier,
      )
      : eligibleCustomEntries('services', tier);
    const tradeGoods = Object.prototype.hasOwnProperty.call(
      materialized,
      'tradeGoods',
    )
      ? resolveMaterializedCustomDefinitions(
        'tradeGoods',
        materialized.tradeGoods,
        tier,
      )
      : unambiguousCustomDefinitions('tradeGoods', tier);
    let producers = 0;
    let consumers = 0;
    const add = (fi) => { if (fi === 'produces') producers += 1; else if (fi === 'consumes') consumers += 1; };
    for (const e of institutionPresence.customEntries) {
      add(e.raw?.foodImpact);
    }
    for (const e of resources) {
      add(e.raw?.foodImpact);
    }
    for (const e of services) {
      if (
        e.raw?.providedBy
        && institutionRequirementIsPresent(
          e.raw.providedBy,
          institutionPresence,
        )
      ) add(e.raw?.foodImpact);
    }
    for (const e of tradeGoods) {
      if (
        e.raw?.requiredInstitution
        && institutionRequirementIsPresent(
          e.raw.requiredInstitution,
          institutionPresence,
        )
      ) add(e.raw?.foodImpact);
    }
    return { producers, consumers };
  },

  // ── Confirmed custom supply chains (§14) ───────────────────────────────
  /**
   * The user's CONFIRMED custom supply chains (reviewed + named in the
   * Compendium), read from the active customContent. The final economy pass
   * evaluates their exact reviewed dependencies and may promote endpoints from
   * active chains into bounded trade lists. They remain outside the native
   * `activeChains` impairment/depth model, so confirmation alone never invents
   * tick-time chain physics. Empty when none.
   */
  confirmedSupplyChains() {
    const cc = (_override != null ? _override : getCustomContentSource()()) || {};
    const chains = Array.isArray(cc.supplyChains) ? cc.supplyChains : [];
    return chains.filter((c) => c?.verification?.state === 'confirmed');
  },

  // ── Lower-level escape hatch ───────────────────────────────────────────
  registry() { return getRegistry(); },
};

// DE-EAGER: hand the seam our invalidator so the (eager) slice can flush the
// registry cache after a cloud sync without statically importing this module.
// Registered at module load — before that there IS no cache, so the seam's
// no-op-when-unloaded is exact (the first build always reads the live source).
registerCustomDepsInvalidate(() => customDeps.invalidate());

export default customDeps;
