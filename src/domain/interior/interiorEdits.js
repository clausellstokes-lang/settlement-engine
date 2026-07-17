/**
 * domain/interior/interiorEdits.js — the SCOPED cosmetic interior-edit sidecar (DOOR 3).
 *
 * The exact SM-3 mapEdits idiom (domain/townMap/mapEdits.js), scoped PER INSTITUTION:
 *   settlement.interiorEdits = { [institutionId]: { pins: {anchor,dx,dy}[], styleLens? } }
 * where institutionId is the map's stable anchor (catalogId → localUid → name-slug) and a
 * pin's `anchor` is a furnishing id from the interior model. Moving a piece of furniture
 * is the cosmetic edit; walls and rooms are structural (the envelope), never nudged.
 *
 * THE LAWS this file holds (mirrors mapEdits verbatim):
 *   • DORMANCY — absent ⇒ byte-identical: read never writes; normalize collapses an
 *     empty/edited-away container to `null` so the store DROPS the key and the blob is
 *     byte-identical to no-edits. Nothing here creates a container — only a real edit does.
 *   • KEY-NAMING TRAP — every SCHEMA key is denylist-safe (∉ PRIVATE_KEY_RE), pinned by
 *     interiorEdits.test.js, so a future gallery allowlisting can never silently strip a
 *     cosmetic key. `interiorEdits` is NOT on PUBLIC_TOPLEVEL_KEYS, so (like mapEdits) the
 *     whole container drops from public/gallery projections by the fail-closed allowlist.
 *   • EDITS-DELTA (survive re-derivation) — pins key on the model's stable furnishing id,
 *     so an interior re-derived after the institution changes hands re-applies every pin
 *     whose anchor still resolves and DROPS the dangling ones (never a throw, never a ghost).
 *
 * PURE: no Date / Math.random / localeCompare.
 */

import { coerceStyleId, DEFAULT_STYLE_ID } from '../../design/townMapStyles.js';
import { clamp } from '../../kernel/math.js';

/** @typedef {{ anchor: string, dx: number, dy: number }} InteriorPin */
/** @typedef {{ pins?: InteriorPin[], styleLens?: string }} InteriorEditEntry */
/** @typedef {Record<string, InteriorEditEntry>} InteriorEditsContainer */

/** The full set of SCHEMA keys the sidecar may carry — pinned ∉ PRIVATE_KEY_RE (the
 *  naming-guard). Note: the per-institution KEYS are institution ids (values-as-keys),
 *  never schema keys, and the container never reaches a public projection regardless.
 *  @type {ReadonlyArray<string>} */
export const INTERIOR_EDITS_SCHEMA_KEYS = Object.freeze([
  'interiorEdits',            // the settlement-level container key
  'pins', 'styleLens',        // per-institution entry
  'anchor', 'dx', 'dy',       // pin
]);

const VIEW = 1000;
const PIN_BOUND = 1000;

/** @param {number} v */
function roundInt(v) { return Math.round(v); }

/** The whole `settlement.interiorEdits` container, or null when absent/invalid. PURE —
 *  never writes it back (an unedited settlement stays byte-identical).
 *  @param {{ interiorEdits?: unknown } | null | undefined} settlement @returns {InteriorEditsContainer | null} */
export function readInteriorEdits(settlement) {
  const raw = settlement && typeof settlement === 'object' ? settlement.interiorEdits : null;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  return /** @type {InteriorEditsContainer} */ (raw);
}

/** The per-institution entry, or null. @param {InteriorEditsContainer | null | undefined} container
 *  @param {string} institutionId @returns {InteriorEditEntry | null} */
export function readInteriorEditEntry(container, institutionId) {
  if (!container || typeof container !== 'object') return null;
  const e = container[institutionId];
  return e && typeof e === 'object' && !Array.isArray(e) ? e : null;
}

/** The pins for one institution (whole-unit, in-bounds, non-zero), or []. @param {InteriorEditEntry | null | undefined} entry
 *  @returns {InteriorPin[]} */
export function readInteriorPins(entry) {
  const raw = entry && Array.isArray(entry.pins) ? entry.pins : [];
  /** @type {InteriorPin[]} */
  const out = [];
  for (const p of raw) {
    const anchor = p && typeof p.anchor === 'string' ? p.anchor : '';
    if (!anchor) continue;
    const dx = clamp(roundInt(Number.isFinite(p.dx) ? Number(p.dx) : 0), -PIN_BOUND, PIN_BOUND);
    const dy = clamp(roundInt(Number.isFinite(p.dy) ? Number(p.dy) : 0), -PIN_BOUND, PIN_BOUND);
    if (dx === 0 && dy === 0) continue;
    out.push({ anchor, dx, dy });
  }
  return out;
}

/** The chosen interior lens for one institution (coerced; default parchment).
 *  @param {InteriorEditEntry | null | undefined} entry @returns {string} */
export function readInteriorStyleLens(entry) {
  return coerceStyleId(entry && typeof entry.styleLens === 'string' ? entry.styleLens : undefined);
}

/** Canonicalize ONE entry to its minimal byte-stable form, or null when empty. Pins are
 *  de-duplicated by anchor, sorted for a stable stringify; the default lens is omitted.
 *  @param {InteriorEditEntry | null | undefined} entry @returns {InteriorEditEntry | null} */
export function normalizeInteriorEntry(entry) {
  if (!entry || typeof entry !== 'object') return null;
  /** @type {InteriorEditEntry} */
  const out = {};
  /** @type {Map<string, InteriorPin>} */
  const byAnchor = new Map();
  for (const p of readInteriorPins(entry)) byAnchor.set(p.anchor, p);
  if (byAnchor.size > 0) {
    out.pins = [...byAnchor.values()].sort((a, b) => (a.anchor < b.anchor ? -1 : a.anchor > b.anchor ? 1 : 0));
  }
  const lens = readInteriorStyleLens(entry);
  if (lens !== DEFAULT_STYLE_ID) out.styleLens = lens;
  return Object.keys(out).length > 0 ? out : null;
}

/** Canonicalize the WHOLE container: drop empty entries (dormancy). Keys sorted for a
 *  stable stringify. Returns null when nothing remains ⇒ the store drops the key.
 *  @param {InteriorEditsContainer | null | undefined} container @returns {InteriorEditsContainer | null} */
export function normalizeInteriorEdits(container) {
  if (!container || typeof container !== 'object') return null;
  /** @type {InteriorEditsContainer} */
  const out = {};
  for (const id of Object.keys(container).sort()) {
    const e = normalizeInteriorEntry(container[id]);
    if (e) out[id] = e;
  }
  return Object.keys(out).length > 0 ? out : null;
}

/** ACCUMULATE a furnishing nudge on an anchor for one institution. A resulting (0,0)
 *  removes the pin. Returns a NEW normalized container (or null when empty). Pure.
 *  @param {InteriorEditsContainer | null | undefined} container @param {string} institutionId
 *  @param {string} anchor @param {number} ddx @param {number} ddy @returns {InteriorEditsContainer | null} */
export function withInteriorPinNudge(container, institutionId, anchor, ddx, ddy) {
  const id = typeof institutionId === 'string' ? institutionId : '';
  const key = typeof anchor === 'string' ? anchor : '';
  if (!id || !key) return normalizeInteriorEdits(container);
  const base = normalizeInteriorEdits(container) || {};
  const entry = base[id] || {};
  const pins = Array.isArray(entry.pins) ? entry.pins.slice() : [];
  const existing = pins.find((p) => p.anchor === key);
  const dx = (existing ? existing.dx : 0) + (Number.isFinite(ddx) ? Number(ddx) : 0);
  const dy = (existing ? existing.dy : 0) + (Number.isFinite(ddy) ? Number(ddy) : 0);
  const nextPins = pins.filter((p) => p.anchor !== key);
  nextPins.push({ anchor: key, dx, dy });
  return normalizeInteriorEdits({ ...base, [id]: { ...entry, pins: nextPins } });
}

/** Choose the interior lens for one institution (default clears the key ⇒ dormancy). Pure.
 *  @param {InteriorEditsContainer | null | undefined} container @param {string} institutionId
 *  @param {string} lens @returns {InteriorEditsContainer | null} */
export function withInteriorStyleLens(container, institutionId, lens) {
  const id = typeof institutionId === 'string' ? institutionId : '';
  if (!id) return normalizeInteriorEdits(container);
  const base = normalizeInteriorEdits(container) || {};
  const entry = base[id] || {};
  return normalizeInteriorEdits({ ...base, [id]: { ...entry, styleLens: coerceStyleId(lens) } });
}

/**
 * THE EDITS-DELTA LAW. Apply an institution's cosmetic pins to a freshly-derived interior
 * model: nudge each FURNISHING whose id matches a pin anchor, clamped to the view; a pin
 * whose anchor no longer resolves (the interior re-derived under a new template) is
 * silently dropped. Walls / rooms / doors are structural and never moved. Returns a NEW
 * model (never mutates the input) so the projection stays pure.
 * @param {import('./interiorModel.js').InteriorModel} model
 * @param {InteriorEditEntry | null | undefined} entry
 * @returns {import('./interiorModel.js').InteriorModel}
 */
export function applyInteriorEdits(model, entry) {
  const pins = readInteriorPins(entry);
  if (!model || pins.length === 0) return model;
  const byAnchor = new Map(pins.map((p) => [p.anchor, p]));
  /** @type {import('./interiorModel.js').InteriorFurnishing[]} */
  const furnishings = model.furnishings.map((f) => {
    const pin = byAnchor.get(f.id);
    if (!pin) return f;
    const x = clamp(f.x + pin.dx, 0, VIEW - f.w);
    const y = clamp(f.y + pin.dy, 0, VIEW - f.h);
    return f.covert
      ? { id: f.id, kind: f.kind, roomId: f.roomId, x, y, w: f.w, h: f.h, covert: true }
      : { id: f.id, kind: f.kind, roomId: f.roomId, x, y, w: f.w, h: f.h };
  });
  return {
    interiorVersion: model.interiorVersion,
    seedFork: model.seedFork,
    meta: model.meta,
    bounds: model.bounds,
    rooms: model.rooms,
    walls: model.walls,
    doors: model.doors,
    furnishings,
  };
}
