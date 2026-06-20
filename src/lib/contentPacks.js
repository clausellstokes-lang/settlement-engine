/**
 * lib/contentPacks.js — export / import of custom-content "packs" (UX Phase 8).
 *
 * A pack is a portable JSON bundle of authored custom content (institutions,
 * services, resources, stressors, trade goods, factions, deities). It lets a
 * worldbuilder move a homebrew set between accounts/devices or share it.
 *
 * Two hard guarantees on IMPORT (the test gate):
 *
 *   1. RE-VALIDATION — every deity is re-run through `validateDeity` (the same
 *      check the store + the 049 DB CHECK apply); an invalid deity is rejected,
 *      never silently written. Other buckets are shape-checked (must be a named
 *      object).
 *
 *   2. RE-NAMESPACING — every imported custom item is minted a FRESH `localUid`,
 *      so an import can never collide with (or overwrite) an item the user
 *      already authored, even if the pack was exported from this very account.
 *      Crucially, dependency refIds INSIDE the pack (`custom:<oldUid>`) are
 *      rewritten to the new uids via an old→new map, so intra-pack links survive
 *      the round-trip while `prebuilt:*` refs (which are globally stable) are
 *      left untouched.
 *
 * Pure: no store, no React, no I/O. The UI layer reads a File, calls
 * `parseContentPack` + `prepareImport`, then commits the items through the
 * normal `addCustomItem` store action (which re-validates deities again — belt
 * and suspenders — and assigns its own ids).
 */

import { validateDeity } from '../domain/customContentSchema.js';

/** The buckets a pack carries. Dead buckets (tradeRoutes/powerPresets/
 *  defensePresets) and the discovered `supplyChains` bucket are intentionally
 *  excluded — packs ship only the hand-authored content lanes. */
export const PACK_BUCKETS = Object.freeze([
  'institutions',
  'services',
  'resources',
  'stressors',
  'tradeGoods',
  'factions',
  'deities',
]);

/** Dependency fields whose values are refId(s) that may point at a custom item
 *  in the SAME pack — these get rewritten on import. Mirrors the dependency
 *  declarations in CustomContent's CUSTOM_CATEGORIES. A field may be a scalar
 *  (single: true) or an array of refIds; we handle both. */
export const PACK_DEP_FIELDS = Object.freeze([
  'produces', 'requires', 'subsumes', 'providedBy', 'yields', 'enables',
  'disablesInstitutions', 'disablesGoods', 'requiredInstitution',
  'requiredResources', 'controls', 'rivals',
]);

export const CONTENT_PACK_FORMAT = 'settlementforge.content-pack';
export const CONTENT_PACK_VERSION = 1;

/** Mint a fresh, collision-resistant localUid (mirrors the slice's makeLocalUid
 *  shape, `lu_<base36-time>_<rand>`, so imported items look native). */
export function makePackLocalUid() {
  return `lu_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Build a pack object from the current customContent blob, restricted to the
 * given buckets (defaults to all PACK_BUCKETS). Strips per-row metadata that is
 * meaningless off-device (`id`, `createdAt`, `updatedAt`, `isCustom`, the schema
 * version) but PRESERVES `localUid` + every dependency refId so intra-pack links
 * can be rewritten on import.
 *
 * @param {Record<string, any[]>} customContent
 * @param {{ buckets?: string[], name?: string }} [opts]
 * @returns {{ format: string, version: number, name: string, exportedAt: string, content: Record<string, any[]> }}
 */
export function buildContentPack(customContent, { buckets, name } = {}) {
  const want = Array.isArray(buckets) && buckets.length ? buckets : PACK_BUCKETS;
  /** @type {Record<string, any[]>} */
  const content = {};
  for (const bucket of want) {
    if (!PACK_BUCKETS.includes(bucket)) continue;
    const items = Array.isArray(customContent?.[bucket]) ? customContent[bucket] : [];
    content[bucket] = items.map(stripForPack);
  }
  return {
    format: CONTENT_PACK_FORMAT,
    version: CONTENT_PACK_VERSION,
    name: String(name || 'Custom content pack'),
    exportedAt: new Date().toISOString(),
    content,
  };
}

/** Drop columns that live outside the JSONB body / are device-local. Keeps
 *  localUid + dependency refs so the importer can re-namespace. */
function stripForPack(item) {
  if (!item || typeof item !== 'object') return item;
  const { id: _id, createdAt: _c, updatedAt: _u, isCustom: _ic, _schemaVersion: _sv, ...rest } = item;
  return rest;
}

/**
 * Parse + shape-validate an untrusted pack (e.g. the JSON of an uploaded file).
 * Returns { ok, pack, error }. Does NOT re-namespace or deep-validate items —
 * that's `prepareImport` — but rejects a payload that isn't a recognizable pack.
 *
 * @param {unknown} raw a parsed-JSON object (or a JSON string).
 * @returns {{ ok: boolean, pack?: any, error?: string }}
 */
export function parseContentPack(raw) {
  /** @type {any} */
  let obj = raw;
  if (typeof raw === 'string') {
    try { obj = JSON.parse(raw); }
    catch { return { ok: false, error: 'Not valid JSON.' }; }
  }
  if (!obj || typeof obj !== 'object') return { ok: false, error: 'Not a content pack.' };
  if (obj.format !== CONTENT_PACK_FORMAT) {
    return { ok: false, error: 'Unrecognized file — not a SettlementForge content pack.' };
  }
  if (!obj.content || typeof obj.content !== 'object') {
    return { ok: false, error: 'Pack has no content.' };
  }
  return { ok: true, pack: obj };
}

/**
 * Re-namespace + re-validate a parsed pack into a flat list of items ready to
 * commit via `addCustomItem(bucket, item)`.
 *
 * Steps:
 *   1. Mint a fresh localUid for EVERY custom item and build an old→new map
 *      keyed by `custom:<oldUid>`.
 *   2. Rewrite every dependency refId field through that map (scalar or array);
 *      a ref to a custom item NOT in the pack is dropped (it can't resolve), a
 *      `prebuilt:*` ref is kept verbatim.
 *   3. Re-validate deities through `validateDeity`; collect rejects with reasons.
 *
 * @param {any} pack a pack object that already passed `parseContentPack`.
 * @returns {{ items: Array<{ bucket: string, item: any }>, rejected: Array<{ bucket: string, name: string, errors: string[] }>, counts: Record<string, number> }}
 */
export function prepareImport(pack) {
  const content = pack?.content && typeof pack.content === 'object' ? pack.content : {};

  // ── Pass 1: mint fresh uids + build the old→new refId map ─────────────────
  const refMap = new Map(); // `custom:<oldUid>` → `custom:<newUid>`
  /** @type {Array<{ bucket: string, src: any, item: any }>} */
  const staged = [];
  for (const bucket of PACK_BUCKETS) {
    const items = Array.isArray(content[bucket]) ? content[bucket] : [];
    for (const src of items) {
      if (!src || typeof src !== 'object') continue;
      const oldUid = src.localUid || src.id;
      const newUid = makePackLocalUid();
      if (oldUid) refMap.set(`custom:${oldUid}`, `custom:${newUid}`);
      staged.push({ bucket, src, item: { ...stripForPack(src), localUid: newUid } });
    }
  }

  // ── Pass 2: rewrite dependency refs through the map ───────────────────────
  for (const { item } of staged) {
    for (const field of PACK_DEP_FIELDS) {
      if (!(field in item)) continue;
      item[field] = remapRefValue(item[field], refMap);
    }
  }

  // ── Pass 3: re-validate (deities hard-validated; others shape-checked) ─────
  /** @type {Array<{ bucket: string, item: any }>} */
  const accepted = [];
  /** @type {Array<{ bucket: string, name: string, errors: string[] }>} */
  const rejected = [];
  for (const { bucket, item } of staged) {
    if (bucket === 'deities') {
      const { ok, errors } = validateDeity(item);
      if (!ok) { rejected.push({ bucket, name: String(item?.name || '(unnamed)'), errors }); continue; }
    } else if (!item || !String(item.name || '').trim()) {
      rejected.push({ bucket, name: '(unnamed)', errors: ['Item needs a name.'] });
      continue;
    }
    accepted.push({ bucket, item });
  }

  /** @type {Record<string, number>} */
  const counts = {};
  for (const { bucket } of accepted) counts[bucket] = (counts[bucket] || 0) + 1;

  return { items: accepted, rejected, counts };
}

/** Rewrite a single dep-field value (scalar refId or array of refIds) through
 *  the old→new map. Custom refs not in the map are dropped; prebuilt refs and
 *  bare strings pass through. */
function remapRefValue(value, refMap) {
  const one = (ref) => {
    if (typeof ref !== 'string') return null;
    if (ref.startsWith('custom:')) return refMap.get(ref) || null; // unresolved custom ref → drop
    return ref; // prebuilt:* or bare-name → keep
  };
  if (Array.isArray(value)) {
    return value.map(one).filter((r) => r != null);
  }
  return one(value); // scalar (single: true). null when an unresolved custom ref.
}
