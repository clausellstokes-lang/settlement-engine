/**
 * customRegistry — unified resolver for prebuilt + custom catalog content.
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
import { RESOURCE_DATA, SPECIAL_RESOURCES } from '../data/resourceData.js';
import { EXPORT_GOODS_BY_TIER, IMPORT_GOODS_BY_TIER } from '../data/tradeGoodsData.js';
import { STRESS_TYPE_MAP } from '../data/stressTypes.js';
import { SUPPLY_CHAIN_NEEDS } from '../data/supplyChainData.js';

// ── Constants ───────────────────────────────────────────────────────────────

export const REGISTRY_CATEGORIES = [
  'institutions',
  'resources',
  'stressors',
  'tradeGoods',
  'resourceChains',
];

/** Map our registry categories to the customContent slice keys (where they
 *  differ — most are 1:1). resourceChains is prebuilt-only for now. */
export const CUSTOM_SLICE_KEY_FOR = {
  institutions:   'institutions',
  resources:      'resources',
  stressors:      'stressors',
  tradeGoods:     'tradeGoods',
  resourceChains: null,  // not yet user-creatable
};

// ── Helpers ─────────────────────────────────────────────────────────────────

export function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
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
  return null;
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
  const ingest = (byTier, direction) => {
    for (const [tier, byName] of Object.entries(byTier || {})) {
      if (!byName || typeof byName !== 'object') continue;
      for (const [name, props] of Object.entries(byName)) {
        if (!name) continue;
        if (out.has(name)) {
          // remember it appears in both directions if so
          out.get(name).directions.add(direction);
          continue;
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
      }
    }
  };
  ingest(EXPORT_GOODS_BY_TIER, 'export');
  ingest(IMPORT_GOODS_BY_TIER, 'import');
  return Array.from(out.values()).map(g => ({
    ...g,
    directions: Array.from(g.directions),
  }));
}

function enumeratePrebuiltResourceChains() {
  // Sourced from SUPPLY_CHAIN_NEEDS (need_group → chains[]) which is what the
  // engine matches against. Each chain's refId slug encodes the full chain id
  // (`<needKey>__<chainId>`) so consumers can reconstruct `<needKey>.<chainId>`
  // to compare with the engine's chain ids.
  const out = [];
  for (const [needKey, need] of Object.entries(SUPPLY_CHAIN_NEEDS || {})) {
    if (!needKey) continue;
    const chains = Array.isArray(need?.chains) ? need.chains : [];
    for (const chain of chains) {
      if (!chain || typeof chain !== 'object') continue;
      const slug = `${needKey}__${slugify(chain.id || chain.label || '')}`;
      out.push({
        refId: `prebuilt:resourceChains:${slug}`,
        name: chain.label || chain.id || slug,
        category: 'resourceChains',
        subcategory: need?.label || needKey,
        source: 'prebuilt',
        tags: chain.exportable ? ['exportable'] : [],
        desc: Array.isArray(chain.outputs) && chain.outputs.length
          ? `→ ${chain.outputs.slice(0, 4).join(', ')}`
          : (chain.resource ? `from ${chain.resource}` : ''),
        // Engine-facing chain id (matches `${needKey}.${chain.id}` exactly)
        engineChainId: chain.id ? `${needKey}.${chain.id}` : null,
        raw: chain,
      });
    }
  }
  return out;
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
    resources:      _safeEnum(enumeratePrebuiltResources, 'resources'),
    stressors:      _safeEnum(enumeratePrebuiltStressors, 'stressors'),
    tradeGoods:     _safeEnum(enumeratePrebuiltTradeGoods, 'tradeGoods'),
    resourceChains: _safeEnum(enumeratePrebuiltResourceChains, 'resourceChains'),
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
    resources:      enumerateCustom('resources', customContent),
    stressors:      enumerateCustom('stressors', customContent),
    tradeGoods:     enumerateCustom('tradeGoods', customContent),
    resourceChains: [],
  };

  // Flat refId -> entry index. Custom entries override prebuilt on collision
  // (which can happen if a user names a custom item identically to a prebuilt
  // — different refId namespaces, no actual collision, but we still favor
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
      // Best-effort: a bare name (legacy form) — try prebuilt name lookup.
      // This lets older saves whose deps stored raw names still resolve.
      const parsed = parseRefId(refId);
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
