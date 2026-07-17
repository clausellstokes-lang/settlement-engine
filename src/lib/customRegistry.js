/**
 * customRegistry - unified resolver for prebuilt + custom catalog content.
 *
 * Provides stable `refId`s so dependency references survive renames, cloud
 * round-trips, and grandfathered local items.
 *
 * Ref ID format:
 *   - Prebuilt: `prebuilt:<category>:<slug-of-name>`
 *   - Custom:   `custom:<localUid>`  (localUid lives inside the JSONB body
 *               so it survives Supabase round-trip; the row's `id` may
 *               change from a local string to a cloud UUID, localUid never
 *               does.)
 *
 * Categories surfaced here:
 *   institutions | resources | stressors | tradeGoods | resourceChains
 *
 * Used by:
 *   - EntityPicker UI (search + multi-select across prebuilt + custom)
 *   - Dependency validation (warn on dangling refs)
 *   - (Phase 2) generators that consume `produces` / `feedsChains` /
 *     `requiredInstitution` / `processingInstitutions` etc.
 */

import { institutionalCatalog } from '../data/institutionalCatalog.js';
import { slugify as kernelSlugify } from '../kernel/slugify.js';
import { INSTITUTION_SERVICES } from '../data/institutionServices.js';
import { RESOURCE_DATA, SPECIAL_RESOURCES } from '../data/resourceData.js';
import { GOODS_MODIFIERS_BY_TIER, IMPORT_GOODS_BY_TIER } from '../data/tradeGoodsData.js';
// Import the pure-data meta map, not the full stressTypes.js. The full
// file has runtime closures that capture _rng from generators/rngContext -
// loading it sync (which we do here, from app boot via dependencyEngine)
// would drag the generator chunk into the first-paint graph. The meta
// file has every field this enumerator reads (label, historyColour,
// viabilityNote) with zero imports.
import { STRESS_TYPE_META as STRESS_TYPE_MAP } from '../data/stressTypesMeta.js';

// ── Constants ───────────────────────────────────────────────────────────────

export const REGISTRY_CATEGORIES = [
  'institutions',
  'services',
  'resources',
  'stressors',
  'tradeGoods',
  'deities',
  'resourceChains',
];

/** Map our registry categories to the customContent slice keys (where they
 *  differ - most are 1:1). resourceChains is prebuilt-only for now. services
 *  carry BOTH: prebuilt entries derived from INSTITUTION_SERVICES (no separate
 *  catalog — institutions are the source of truth) plus user-created customs. */
export const CUSTOM_SLICE_KEY_FOR = {
  institutions:   'institutions',
  services:       'services',
  resources:      'resources',
  stressors:      'stressors',
  tradeGoods:     'tradeGoods',
  deities:        'deities',
  resourceChains: null,  // not yet user-creatable
};

// ── Helpers ─────────────────────────────────────────────────────────────────

export function slugify(s) {
  return kernelSlugify(s, { sep: '_' });
}

export function prebuiltRefId(category, name) {
  return `prebuilt:${category}:${slugify(name)}`;
}

export function customRefId(localUid) {
  return `custom:${localUid}`;
}

/** Stable id for a custom item. Prefer `localUid`, fall back to `id` (which
 *  may be a Supabase UUID or a legacy `inst_*` string). Ensures grandfathered
 *  items still resolve even if they pre-date the localUid migration. */
export function customRefIdFromItem(item) {
  if (!item) return null;
  return customRefId(item.localUid || item.id);
}

/** Parse a refId back into its parts. */
export function parseRefId(refId) {
  if (typeof refId !== 'string') return null;
  if (refId.startsWith('prebuilt:')) {
    const [, category, slug] = refId.split(':');
    return { source: 'prebuilt', category, slug };
  }
  if (refId.startsWith('custom:')) {
    const [, localUid] = refId.split(':', 2);
    // re-grab the rest in case the localUid contained colons (it shouldn't)
    const rest = refId.slice('custom:'.length);
    return { source: 'custom', localUid: rest || localUid };
  }
  if (refId.startsWith('deity:')) {
    // A minted deity identity ref: `deity:<scope>:<slug>` (scope = the authoring
    // account's localUid). Scope is the account-local unique token that keeps two
    // accounts' same-named homebrew deities from identity-merging. A scopeless
    // legacy form `deity:<name>` parses with an empty scope (name-identity only).
    const parts = refId.split(':');
    return parts.length >= 3
      ? { source: 'deity', scope: parts[1] || '', slug: parts.slice(2).join(':') }
      : { source: 'deity', scope: '', slug: parts[1] || '' };
  }
  return null;
}

/**
 * Mint the STABLE, ACCOUNT-SCOPED identity ref for a deity — the id the embed
 * bridge stamps onto config.primaryDeityRef / the frozen snapshot's `_deityRef`,
 * and the key the pantheon ratchet identity-buckets by.
 *
 * Format `deity:<scope>:<slug>`, scope = the authoring account's local unique
 * token for the deity (its `localUid`, falling back to `id`). This closes the
 * cross-account identity-merge: two accounts' same-named homebrew deities
 * ("War Father" vs "War Father") carry DISTINCT localUids → distinct refs, so a
 * shared campaign keeps them two gods, while the SAME authored deity assigned to
 * several settlements within ONE account keeps its single identity (same localUid
 * → same ref → shared pantheon niche). The engine keeps treating the ref as
 * opaque; only the MINTING moved off the name — deityIdOf's bare `deity:<name>`
 * fallback (which name-collides) is now unreachable for an assigned deity.
 *
 * Returns null for a nameless raw. A scopeless raw (e.g. a future prebuilt deity
 * with no localUid) mints `deity:<slug>` — the shared global pool where
 * name-identity IS intentional.
 *
 * @param {{ name?: unknown, localUid?: unknown, id?: unknown } | null | undefined} raw
 * @returns {string|null}
 */
export function mintDeityRef(raw) {
  if (!raw) return null;
  const slug = slugify(raw.name);
  if (!slug) return null;
  const scope = raw.localUid != null ? String(raw.localUid)
    : raw.id != null ? String(raw.id)
    : null;
  return scope ? `deity:${scope}:${slug}` : `deity:${slug}`;
}

// ── Prebuilt enumerators ────────────────────────────────────────────────────
// Each returns: Array<RegistryEntry>
//   { refId, name, category, source: 'prebuilt' | 'custom', tags, desc, raw }

function enumeratePrebuiltInstitutions() {
  const out = new Map();  // dedupe by name (same institution appears in multiple tiers)
  for (const [tier, byTopCat] of Object.entries(institutionalCatalog || {})) {
    if (!byTopCat || typeof byTopCat !== 'object') continue;
    for (const [topCat, byName] of Object.entries(byTopCat)) {
      if (!byName || typeof byName !== 'object') continue;
      for (const [name, props] of Object.entries(byName)) {
        if (!name || out.has(name)) continue;
        out.set(name, {
          refId: prebuiltRefId('institutions', name),
          name,
          category: 'institutions',
          subcategory: topCat,
          source: 'prebuilt',
          tags: Array.isArray(props?.tags) ? props.tags : [],
          desc: props?.desc || '',
          tierMin: tier,
          raw: props || {},
        });
      }
    }
  }
  return Array.from(out.values());
}

function enumeratePrebuiltServices() {
  // Built-in services are NOT a separate hand-authored catalog — they live on
  // institutions (INSTITUTION_SERVICES: institution → { service → {on,p,desc} }),
  // which is the single source of truth the generation pipeline reads. We flatten
  // that map into registry entries so custom-content pickers can reference
  // built-in services, each tagged with its providing institution — exactly
  // mirroring how the pipeline presents services-by-institution.
  //
  // Deduped by service name (one pickable "Lodging" even though several
  // institutions offer it); the first provider encountered is the primary, and
  // additional providers are folded into the subcategory hint as "+N".
  const out = new Map();
  for (const [institution, services] of Object.entries(INSTITUTION_SERVICES || {})) {
    if (!services || typeof services !== 'object') continue;
    for (const [name, props] of Object.entries(services)) {
      if (!name) continue;
      const existing = out.get(name);
      if (existing) {
        if (!existing.providers.includes(institution)) existing.providers.push(institution);
        continue;
      }
      out.set(name, {
        refId: prebuiltRefId('services', name),
        name,
        category: 'services',
        source: 'prebuilt',
        tags: [],
        desc: props?.desc || '',
        providers: [institution],
        raw: props || {},
      });
    }
  }
  return Array.from(out.values()).map((e) => {
    const more = e.providers.length - 1;
    return {
      ...e,
      subcategory: more > 0 ? `${e.providers[0]} +${more}` : e.providers[0],
    };
  });
}

function enumeratePrebuiltResources() {
  const out = [];
  for (const [key, props] of Object.entries(RESOURCE_DATA || {})) {
    if (!key) continue;
    out.push({
      refId: prebuiltRefId('resources', key),
      name: props?.label || key,
      category: 'resources',
      subcategory: props?.category || 'other',
      source: 'prebuilt',
      tags: [],
      desc: props?.desc || '',
      key,
      raw: props || {},
    });
  }
  for (const [key, props] of Object.entries(SPECIAL_RESOURCES || {})) {
    if (!key) continue;
    out.push({
      refId: prebuiltRefId('resources', key),
      name: props?.label || key,
      category: 'resources',
      subcategory: 'special',
      source: 'prebuilt',
      tags: [],
      desc: props?.desc || '',
      key,
      raw: props || {},
    });
  }
  return out;
}

function enumeratePrebuiltStressors() {
  const out = [];
  for (const [key, props] of Object.entries(STRESS_TYPE_MAP || {})) {
    if (!key) continue;
    out.push({
      refId: prebuiltRefId('stressors', key),
      name: props?.label || key,
      category: 'stressors',
      subcategory: props?.historyColour || 'other',
      source: 'prebuilt',
      tags: [],
      desc: typeof props?.viabilityNote === 'string' ? props.viabilityNote : '',
      raw: props || {},
    });
  }
  return out;
}

function enumeratePrebuiltTradeGoods() {
  const out = new Map();  // dedupe by name across tiers + export/import
  const mint = (name, props, tier, direction) => {
    if (!name || !props || typeof props !== 'object') return;
    if (out.has(name)) {
      // remember it appears in both directions if so
      out.get(name).directions.add(direction);
      return;
    }
    out.set(name, {
      refId: prebuiltRefId('tradeGoods', name),
      name,
      category: 'tradeGoods',
      subcategory: props?.category || 'other',
      source: 'prebuilt',
      tags: [],
      desc: props?.desc || '',
      tierMin: tier,
      directions: new Set([direction]),
      raw: props || {},
    });
  };
  const ingest = (byTier, direction) => {
    for (const [tier, byName] of Object.entries(byTier || {})) {
      if (!byName || typeof byName !== 'object') continue;
      for (const [key, val] of Object.entries(byName)) {
        // Two shapes coexist: GOODS_MODIFIERS_BY_TIER is { name: props } (mint by
        // key); IMPORT_GOODS_BY_TIER is { group: [{ name, … }] } (mint each element
        // by its OWN .name — the group key is a bucket label, never a good). Reading
        // the group shape flat once minted the bucket keys (basic/fromHigher/…) as
        // phantom goods and skipped every real import good. [data-tables-1]
        if (Array.isArray(val)) {
          for (const item of val) mint(item?.name, item, tier, direction);
        } else {
          mint(key, val, tier, direction);
        }
      }
    }
  };
  ingest(GOODS_MODIFIERS_BY_TIER, 'export');
  ingest(IMPORT_GOODS_BY_TIER, 'import');
  return Array.from(out.values()).map(g => ({
    ...g,
    directions: Array.from(g.directions),
  }));
}

// ── Prebuilt resource-chains: a LAZY-provided category (FP-G10 reclaim) ───────
// The resource-chains enumerator + its ~60 KB SUPPLY_CHAIN_NEEDS table
// (data/supplyChainData.js) were the SOLE first-paint (eager) importer of that
// table, dragging it into the eager `data` chunk for a registry category NO
// first-paint path consumes. The category is read only by
// dependencyEngine.chainsFedByResource — a legacy `feedsChains` resolver whose
// slug-reconstruction fallback is BYTE-IDENTICAL to the enumerated engineChainId
// (every SUPPLY_CHAIN_NEEDS chain id is already a slug, and a missing chain falls
// back on BOTH paths) — and by no live UI (feedsChains is no longer an authored
// dependency field, so no picker/summary surfaces the prebuilt chains). The
// enumerator + table now live in the lazy leaf lib/prebuiltResourceChains.js,
// which self-registers via registerPrebuiltResourceChains on load. Until it loads,
// this category is EMPTY — byte-identical, because chainsFedByResource falls back
// and nothing lists prebuilt resourceChains. computeActiveChains (the feedsChains
// consumer, on the lazy engine chunk) imports the leaf, so the catalog loads with
// generation and the capability stays live off the first-paint path.
// @enforced-by tests/build/vendorPdfLazy.test.js (first-paint byte budget) +
//   tests/lib/prebuiltResourceChains.test.js (fallback byte-identity + registration).
let _prebuiltResourceChainsEnum = null;

/**
 * Register the (lazy) prebuilt resource-chains enumerator. Called once from the
 * lib/prebuiltResourceChains.js leaf on its load. Idempotent; invalidates the
 * prebuilt cache so the next buildRegistry surfaces the freshly-loaded category.
 * @param {() => any[]} fn
 */
export function registerPrebuiltResourceChains(fn) {
  _prebuiltResourceChainsEnum = typeof fn === 'function' ? fn : null;
  _prebuiltCache = null;
}

// Cache prebuilt enumerations (these never change at runtime).
let _prebuiltCache = null;
function _safeEnum(fn, label) {
  try { return fn() || []; }
  catch (err) {
    // Catalog malformation must not take down the whole Compendium UI.
    if (typeof console !== 'undefined') {
      console.warn(`[customRegistry] ${label} enumerator failed:`, err);
    }
    return [];
  }
}
function getPrebuiltEntries() {
  if (_prebuiltCache) return _prebuiltCache;
  _prebuiltCache = {
    institutions:   _safeEnum(enumeratePrebuiltInstitutions, 'institutions'),
    services:       _safeEnum(enumeratePrebuiltServices, 'services'),  // derived from INSTITUTION_SERVICES
    resources:      _safeEnum(enumeratePrebuiltResources, 'resources'),
    stressors:      _safeEnum(enumeratePrebuiltStressors, 'stressors'),
    tradeGoods:     _safeEnum(enumeratePrebuiltTradeGoods, 'tradeGoods'),
    // Lazy-provided (see registerPrebuiltResourceChains above): [] until the
    // lib/prebuiltResourceChains.js leaf loads — byte-identical for every
    // consumer (chainsFedByResource falls back; nothing lists this category).
    resourceChains: _prebuiltResourceChainsEnum
      ? _safeEnum(_prebuiltResourceChainsEnum, 'resourceChains')
      : [],
  };
  return _prebuiltCache;
}

// ── Custom enumerators ──────────────────────────────────────────────────────

function enumerateCustom(category, customContent) {
  const sliceKey = CUSTOM_SLICE_KEY_FOR[category];
  if (!sliceKey) return [];
  const items = Array.isArray(customContent?.[sliceKey]) ? customContent[sliceKey] : [];
  const out = [];
  for (const item of items) {
    if (!item || typeof item !== 'object') continue;
    const refId = customRefIdFromItem(item);
    if (!refId) continue;
    out.push({
      refId,
      name: item.name || '(unnamed)',
      category,
      subcategory: item.category || item.subcategory || 'custom',
      source: 'custom',
      tags: typeof item.tags === 'string'
        ? item.tags.split(',').map(t => t.trim()).filter(Boolean)
        : (Array.isArray(item.tags) ? item.tags : []),
      desc: item.description || item.desc || '',
      tierMin: item.tierMin,
      raw: item,
    });
  }
  return out;
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * A resolved registry entry (prebuilt or custom), as produced by the
 * enumerators above.
 * @typedef {object} RegistryEntry
 * @property {string} refId
 * @property {string} name
 * @property {string} category
 * @property {string} [subcategory]
 * @property {string} source - 'prebuilt' | 'custom'
 * @property {string[]} [tags]
 * @property {string} [desc]
 * @property {*} [tierMin]
 * @property {*} [raw]
 */

/**
 * Build a registry view from current customContent.
 *
 * @param {object} customContent - the customContentSlice state.customContent
 * @returns {{
 *   listAll: (category: string) => RegistryEntry[],
 *   listPrebuilt: (category: string) => RegistryEntry[],
 *   listCustom: (category: string) => RegistryEntry[],
 *   resolve: (refId: string) => RegistryEntry | null,
 *   resolveMany: (refIds: string[]) => RegistryEntry[],
 *   validate: (refIds: string[]) => { ok: string[], missing: string[] },
 *   index: Map<string, RegistryEntry>,
 * }}
 */
export function buildRegistry(customContent) {
  const prebuilt = getPrebuiltEntries();
  const custom = {
    institutions:   enumerateCustom('institutions', customContent),
    services:       enumerateCustom('services', customContent),
    resources:      enumerateCustom('resources', customContent),
    stressors:      enumerateCustom('stressors', customContent),
    tradeGoods:     enumerateCustom('tradeGoods', customContent),
    deities:        enumerateCustom('deities', customContent),
    resourceChains: [],
  };

  // Flat refId -> entry index. Custom entries override prebuilt on collision
  // (which can happen if a user names a custom item identically to a prebuilt
  // - different refId namespaces, no actual collision, but we still favor
  // custom in `resolve` for predictability).
  const index = new Map();
  for (const cat of REGISTRY_CATEGORIES) {
    for (const e of prebuilt[cat] || []) index.set(e.refId, e);
    for (const e of custom[cat] || [])   index.set(e.refId, e);
  }

  return {
    listAll(category) {
      return [...(prebuilt[category] || []), ...(custom[category] || [])];
    },
    listPrebuilt(category) {
      return prebuilt[category] || [];
    },
    listCustom(category) {
      return custom[category] || [];
    },
    resolve(refId) {
      if (!refId) return null;
      const direct = index.get(refId);
      if (direct) return direct;
      const parsed = parseRefId(refId);
      // A minted deity identity ref (`deity:<scope>:<slug>`) round-trips back to
      // its authored deity via the scope (the localUid). The engine never does
      // this — refs stay opaque there — but authoring surfaces that re-open the
      // editor from an embedded snapshot resolve the source record this way.
      if (parsed?.source === 'deity' && parsed.scope) {
        const viaScope = index.get(`custom:${parsed.scope}`);
        if (viaScope) return viaScope;
      }
      // Best-effort: a bare name (legacy form) - try prebuilt name lookup.
      // This lets older saves whose deps stored raw names still resolve.
      if (!parsed) {
        // Treat as a bare name across all categories.
        const slug = slugify(refId);
        for (const cat of REGISTRY_CATEGORIES) {
          const hit = (prebuilt[cat] || []).find(e => slugify(e.name) === slug);
          if (hit) return hit;
        }
      }
      return null;
    },
    resolveMany(refIds) {
      if (!Array.isArray(refIds)) return [];
      const out = [];
      for (const r of refIds) {
        const e = this.resolve(r);
        if (e) out.push(e);
      }
      return out;
    },
    validate(refIds) {
      const ok = [], missing = [];
      if (!Array.isArray(refIds)) return { ok, missing };
      for (const r of refIds) {
        if (this.resolve(r)) ok.push(r);
        else missing.push(r);
      }
      return { ok, missing };
    },
    index,
  };
}

/** Convenience: build a registry directly from the zustand store getState(). */
export function buildRegistryFromStore(getState) {
  const s = typeof getState === 'function' ? getState() : getState;
  return buildRegistry(s?.customContent || {});
}
