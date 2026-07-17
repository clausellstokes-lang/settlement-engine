/**
 * domain/townMap/mapEdits.js — the SM-3 cosmetic `settlement.mapEdits` container:
 * PURE, deterministic READ + MERGE ops over the blob-resident edit state.
 *
 * THE CONTAINER (design §5, Class A — cosmetic, map-native):
 *   { layoutVariant?: number,               // integer reroll salt (0/absent ⇒ base)
 *     pins?: { anchor, dx, dy }[],           // anchor-keyed position nudges
 *     legendPrefs?: { showLabels?, showLegend? } }  // view preferences
 *
 * LAWS enforced here (the constitutional ones for this file):
 *   • ABSENT ⇒ byte-identical (the dormancy law): `readMapEdits` NEVER writes, the
 *     generation pipeline never stamps the container, and `normalizeMapEdits`
 *     collapses an empty/edited-away container to `null` so the store action can
 *     DROP the key and return the blob byte-identical to no-edits. Nothing in this
 *     module (or the pipeline) creates a mapEdits container — only a real user edit
 *     does, through the merge ops below.
 *   • KEY-NAMING TRAP (recon catch, load-bearing): every schema key is denylist-
 *     safe. `MAP_EDITS_SCHEMA_KEYS` is pinned ∉ PRIVATE_KEY_RE by
 *     tests/domain/townMapEdits.test.js, so a future gallery allowlisting can never
 *     SILENTLY STRIP a cosmetic key (the `layoutSeed`/`hooks` trap). The schema
 *     deliberately uses `layoutVariant`, `pins`, `legendPrefs` — never `seed`,
 *     `hook`, `compass`, `chronicle`, `secret`, `private`, `dm…`.
 *   • ANCHOR-KEYED, NEVER COORDINATES: pins key on the stable anchorKey
 *     (catalogId / localUid / district id — the model's own anchor identity), so a
 *     roster drift drops a dangling pin gracefully (pinned in the model). No pin
 *     carries a random id (the pendingEdits lesson — never Math.random in persisted
 *     state); a pin is fully identified by its anchor.
 *
 * PURITY (the townMap domain source-scan, tests/domain/townMapModel.test.js): no
 * Date, no Math.random, no localeCompare. Codepoint string order is done with bare
 * `<`/`>` comparisons (localeCompare is banned). Any-cast baseline 0 for new files.
 */

import { coerceStyleId, DEFAULT_STYLE_ID } from '../../design/townMapStyles.js';

/** @typedef {{ anchor: string, dx: number, dy: number }} MapEditPin */
/** @typedef {{ showLabels?: boolean, showLegend?: boolean }} MapEditLegendPrefs */
/** @typedef {{ layoutVariant?: number, pins?: MapEditPin[], legendPrefs?: MapEditLegendPrefs, styleLens?: string }} MapEdits */

// The full set of schema keys the container may ever carry — the naming-guard
// test asserts NONE match PRIVATE_KEY_RE (so a future public projection cannot
// silently strip one). Container keys + the pin sub-keys + the legendPref keys.
// `styleLens` (the chosen map lens — MAP STYLES) is a cosmetic, denylist-safe key:
// it rides the blob exactly like a legend pref, honored on every full-blob read
// (owner library, detail viewer, PDF, thumbnail); the anonymous-gallery drop is
// the pre-existing owner-gated §6 opt-in (mapEdits is not on PUBLIC_TOPLEVEL_KEYS).
export const MAP_EDITS_SCHEMA_KEYS = Object.freeze([
  'layoutVariant', 'pins', 'legendPrefs', 'styleLens', // container
  'anchor', 'dx', 'dy',                    // pin
  'showLabels', 'showLegend',              // legendPrefs
]);

/** The legendPref keys whose default is `false` (omitted when off).
 * @type {ReadonlyArray<'showLabels'|'showLegend'>} */
const LEGEND_PREF_KEYS = Object.freeze(['showLabels', 'showLegend']);

// Position-nudge bound: a single pin's offset is clamped so a runaway drag against
// a wall cannot grow the persisted delta without limit. The model additionally
// clamps the FINAL position to the 0..1000 viewBox, so this only bounds the stored
// value, never the render.
const PIN_BOUND = 1000;

/** @param {number} v @param {number} lo @param {number} hi */
function clampNum(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

/** Round to a stable integer (persisted deltas are whole view-units).
 * @param {number} v */
function roundInt(v) { return Math.round(v); }

/**
 * READ-TIME container default (design §5 "container defaulting on read"). Returns
 * the settlement's mapEdits container, or `null` when absent/invalid. PURE — never
 * writes the container back onto the settlement, so an unedited settlement stays
 * byte-identical (the pipeline never stamps it; only a real edit does).
 * @param {{ mapEdits?: unknown } | null | undefined} settlement
 * @returns {MapEdits | null}
 */
export function readMapEdits(settlement) {
  const raw = settlement && typeof settlement === 'object' ? settlement.mapEdits : null;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  return /** @type {MapEdits} */ (raw);
}

/**
 * Read the view preferences (showLabels / showLegend) as concrete booleans. The
 * viewer honors these for EVERY viewer (they ride the blob, like a position
 * nudge); only CHANGING them is gated. Default both false ⇒ the unedited map is
 * exactly the SM-2 look (no labels, no legend).
 * @param {MapEdits | null | undefined} edits
 * @returns {{ showLabels: boolean, showLegend: boolean }}
 */
export function readLegendPrefs(edits) {
  const lp = edits && typeof edits.legendPrefs === 'object' && edits.legendPrefs ? edits.legendPrefs : {};
  return { showLabels: !!lp.showLabels, showLegend: !!lp.showLegend };
}

/** The layoutVariant as a non-negative integer (0 ⇒ base arrangement).
 * @param {MapEdits | null | undefined} edits */
export function readLayoutVariant(edits) {
  const v = edits && Number.isInteger(edits.layoutVariant) ? Number(edits.layoutVariant) : 0;
  return v > 0 ? v : 0;
}

/** The chosen map lens id, coerced to a valid style (default: parchment). The
 * renderer reads this to skin the map; an unknown/absent value is the default lens.
 * @param {MapEdits | null | undefined} edits */
export function readStyleLens(edits) {
  return coerceStyleId(edits && typeof edits.styleLens === 'string' ? edits.styleLens : undefined);
}

/**
 * Canonicalize a container to its minimal byte-stable form, or `null` when it
 * carries no real edit. Keeps `layoutVariant` only when > 0; keeps `pins` only
 * when non-empty (each a whole-unit, in-bounds, non-zero nudge, sorted by anchor
 * for a stable stringify); keeps `legendPrefs` only for its truthy keys. An
 * all-empty result is `null` so the caller DROPS the container ⇒ byte-identity.
 * @param {MapEdits | null | undefined} edits
 * @returns {MapEdits | null}
 */
export function normalizeMapEdits(edits) {
  if (!edits || typeof edits !== 'object') return null;
  /** @type {MapEdits} */
  const out = {};

  const variant = readLayoutVariant(edits);
  if (variant > 0) out.layoutVariant = variant;

  const rawPins = Array.isArray(edits.pins) ? edits.pins : [];
  /** @type {Map<string, MapEditPin>} */
  const byAnchor = new Map();
  for (const p of rawPins) {
    const anchor = p && typeof p.anchor === 'string' ? p.anchor : '';
    if (!anchor) continue;
    const dx = clampNum(roundInt(Number.isFinite(p.dx) ? Number(p.dx) : 0), -PIN_BOUND, PIN_BOUND);
    const dy = clampNum(roundInt(Number.isFinite(p.dy) ? Number(p.dy) : 0), -PIN_BOUND, PIN_BOUND);
    if (dx === 0 && dy === 0) { byAnchor.delete(anchor); continue; } // a zeroed pin is a no-op ⇒ drop
    byAnchor.set(anchor, { anchor, dx, dy });
  }
  if (byAnchor.size > 0) {
    const pins = [...byAnchor.values()].sort((a, b) => (a.anchor < b.anchor ? -1 : a.anchor > b.anchor ? 1 : 0));
    out.pins = pins;
  }

  const lp = readLegendPrefs(edits);
  /** @type {MapEditLegendPrefs} */
  const legendPrefs = {};
  for (const k of LEGEND_PREF_KEYS) if (lp[k]) legendPrefs[k] = true;
  if (Object.keys(legendPrefs).length > 0) out.legendPrefs = legendPrefs;

  // styleLens: kept ONLY for a non-default lens (the default parchment ⇒ omitted ⇒
  // byte-identical to no-edit, the dormancy law). An unknown id coerces to default.
  const lens = readStyleLens(edits);
  if (lens !== DEFAULT_STYLE_ID) out.styleLens = lens;

  return Object.keys(out).length > 0 ? out : null;
}

/**
 * ACCUMULATE a position nudge on an anchor: the new absolute pin offset is the
 * existing one plus (ddx, ddy) view-units. A resulting (0,0) removes the pin
 * (drag-back-to-origin restores the base placement). Returns a NEW normalized
 * container (or null when the result is empty). Pure — never mutates `edits`.
 * @param {MapEdits | null | undefined} edits
 * @param {string} anchor
 * @param {number} ddx  incremental nudge, view-units
 * @param {number} ddy
 * @returns {MapEdits | null}
 */
export function withPinNudge(edits, anchor, ddx, ddy) {
  const key = typeof anchor === 'string' ? anchor : '';
  if (!key) return normalizeMapEdits(edits);
  const base = normalizeMapEdits(edits) || {};
  const pins = Array.isArray(base.pins) ? base.pins.slice() : [];
  const existing = pins.find((p) => p.anchor === key);
  const dx = (existing ? existing.dx : 0) + (Number.isFinite(ddx) ? Number(ddx) : 0);
  const dy = (existing ? existing.dy : 0) + (Number.isFinite(ddy) ? Number(ddy) : 0);
  const nextPins = pins.filter((p) => p.anchor !== key);
  nextPins.push({ anchor: key, dx, dy });
  return normalizeMapEdits({ ...base, pins: nextPins });
}

/** Set the layoutVariant salt (a reroll). Non-negative integer; 0 clears it.
 * @param {MapEdits | null | undefined} edits @param {number} variant */
export function withLayoutVariant(edits, variant) {
  const base = normalizeMapEdits(edits) || {};
  const v = Number.isFinite(variant) ? Math.max(0, Math.trunc(Number(variant))) : 0;
  return normalizeMapEdits({ ...base, layoutVariant: v });
}

/** The next reroll salt: current + 1 (deterministic, monotone).
 * @param {MapEdits | null | undefined} edits */
export function nextLayoutVariant(edits) { return readLayoutVariant(edits) + 1; }

/** Set one legend preference (showLabels / showLegend). A falsey value clears it.
 * @param {MapEdits | null | undefined} edits @param {string} key @param {boolean} value */
export function withLegendPref(edits, key, value) {
  if (key !== 'showLabels' && key !== 'showLegend') return normalizeMapEdits(edits);
  const base = normalizeMapEdits(edits) || {};
  const legendPrefs = { ...(base.legendPrefs || {}), [key]: !!value };
  return normalizeMapEdits({ ...base, legendPrefs });
}

/** Choose the map lens (MAP STYLES). Selecting the default (parchment) clears the
 * key ⇒ byte-identical dormancy. Non-destructive: this only skins the derived view,
 * never the geometry, so no edit is ever lost by re-skinning.
 * @param {MapEdits | null | undefined} edits @param {string} lens */
export function withStyleLens(edits, lens) {
  const base = normalizeMapEdits(edits) || {};
  return normalizeMapEdits({ ...base, styleLens: coerceStyleId(lens) });
}
