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
/** @typedef {{ x: number, y: number, label: string, audience: 'dm'|'player' }} MapAnnotation */
/** @typedef {{ layoutVariant?: number, pins?: MapEditPin[], legendPrefs?: MapEditLegendPrefs, styleLens?: string, layoutLawVersion?: number, annotations?: MapAnnotation[], bespokeStyles?: Record<string, unknown>, seasonOverride?: string }} MapEdits */

/** IT-3 SEASON OVERRIDE — the bounded season a DM can PIN on a map ("this is the winter map"),
 *  independent of the live world clock. The 4-4-5 calendar's four quarters; null (absent) is the
 *  default ⇒ the map follows the live season (or is seasonless with no campaign). A denylist-safe,
 *  cosmetic-class key (checked ∉ PRIVATE_KEY_RE by the naming-trap test), the exact styleLens shape.
 *  @type {ReadonlyArray<'spring'|'summer'|'autumn'|'winter'>} */
export const SEASON_OVERRIDE_IDS = Object.freeze(['spring', 'summer', 'autumn', 'winter']);

// The full set of schema keys the container may ever carry — the naming-guard
// test asserts NONE match PRIVATE_KEY_RE (so a future public projection cannot
// silently strip one). Container keys + the pin sub-keys + the legendPref keys.
// `styleLens` (the chosen map lens — MAP STYLES) is a cosmetic, denylist-safe key:
// it rides the blob exactly like a legend pref, honored on every full-blob read
// (owner library, detail viewer, PDF, thumbnail); the anonymous-gallery drop is
// the pre-existing owner-gated §6 opt-in (mapEdits is not on PUBLIC_TOPLEVEL_KEYS).
//
// SM-5 DM PIN/ANNOTATION LAYER — `annotations` (+ x/y/label/audience sub-keys) is a
// COSMETIC-CLASS, denylist-safe container key: a DM's map markers ride the blob like
// a nudge. Every new key was checked ∉ PRIVATE_KEY_RE (the naming-trap test enforces
// it), so a public projection never SILENTLY strips one — instead the whole mapEdits
// container is (already) owner-gated off the anonymous gallery (mapEdits ∉
// PUBLIC_TOPLEVEL_KEYS), so a DM-only marker's TEXT never reaches a public viewer.
// NOTE the deliberate law distinction: `pins` (position NUDGES) are anchor-keyed,
// never coordinates; `annotations` (free DM markers) legitimately carry x/y because a
// marker has no backing element to key on — a different concept, not a law violation.
// The `audience` VALUE ('dm'|'player') is the export-visibility split (WYSIWYG law).
//
// S4-S6 BESPOKE STYLES — `bespokeStyles` (a per-settlement { [id]: TownMapStyle } of
// wall-validated saved map styles) is a COSMETIC-CLASS, denylist-safe container key: a saved
// Surveyor map style rides the blob like a lens choice. The key itself is re-checked ∉
// PRIVATE_KEY_RE (the naming-trap test enforces it). Its VALUE is an OPAQUE, wall-validated
// collection: the ids are user slugs and each style is a fixed known-role visual object
// (design/townMapStyleWall.validateBespokeStyle keeps only known roles + carries __resolved),
// so no arbitrary substance persists — and the whole mapEdits container is (already) owner-gated
// off the anonymous gallery (mapEdits ∉ PUBLIC_TOPLEVEL_KEYS), so the value's nested keys never
// reach a public projection. This is why only the CONTAINER key joins the schema list below (the
// collection's dynamic ids + role fields are not — and cannot be — a fixed vocabulary).
export const MAP_EDITS_SCHEMA_KEYS = Object.freeze([
  'layoutVariant', 'pins', 'legendPrefs', 'styleLens', 'layoutLawVersion', 'annotations', 'bespokeStyles', 'seasonOverride', // container
  'anchor', 'dx', 'dy',                    // pin
  'showLabels', 'showLegend',              // legendPrefs
  'x', 'y', 'label', 'audience',           // annotation
]);

/** The layout-law versions the model can render. v1 is the DORMANT default (absent
 *  ⇒ v1 ⇒ byte-identical to every pre-v2 settlement + golden); v2 is the semantic
 *  urban-planning engine, minted for new settlements and reachable by opt-in redraw.
 *  @type {ReadonlyArray<number>} */
export const LAYOUT_LAW_VERSIONS = Object.freeze([1, 2]);

/** The default (dormant) layout-law version — the pre-v2 arrangement. */
export const DEFAULT_LAYOUT_LAW_VERSION = 1;

/** THE ONE DIAL — the layout-law version a NEWLY-created settlement mints under (the
 *  VERSIONING LAW's "new settlements mint v2"; the v2 taste veto is PROVISIONALLY PASSED).
 *  The three create chokepoints (SaveToLibraryButton / SettlementsPanel fork / BuyThisDossier
 *  save-first) stamp `newSettlementMapEdits()` onto the fresh blob. A taste veto reverts the
 *  default in ONE LINE: set this to `DEFAULT_LAYOUT_LAW_VERSION` (1) and new settlements mint
 *  v1 again — EXISTING settlements are untouched either way (they never pass through create). */
export const NEW_SETTLEMENT_LAYOUT_LAW_VERSION = 2;

/** The legendPref keys whose default is `false` (omitted when off).
 * @type {ReadonlyArray<'showLabels'|'showLegend'>} */
const LEGEND_PREF_KEYS = Object.freeze(['showLabels', 'showLegend']);

// Position-nudge bound: a single pin's offset is clamped so a runaway drag against
// a wall cannot grow the persisted delta without limit. The model additionally
// clamps the FINAL position to the 0..1000 viewBox, so this only bounds the stored
// value, never the render.
const PIN_BOUND = 1000;

// SM-5 DM annotations: coordinates live in the 0..1000 view space; labels are bounded
// (a marker note, not prose); the count is capped so the blob can't grow unbounded.
const VIEW_MAX = 1000;
const ANNOTATION_LABEL_MAX = 80;
const MAX_ANNOTATIONS = 50;

/** @param {number} v @param {number} lo @param {number} hi */
function clampNum(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

/** Coerce an audience to the SAFE default: a marker is DM-only unless explicitly
 *  marked player-visible (fail-closed — a stray value never leaks to players).
 *  @param {unknown} v @returns {'dm'|'player'} */
function coerceAudience(v) { return v === 'player' ? 'player' : 'dm'; }

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

/** The chosen layout-law version (1 or 2). Absent / unknown / any non-2 value ⇒ the
 * dormant v1 default (so every pre-v2 settlement and golden stays byte-identical);
 * only an explicit 2 selects the v2 semantic-planning engine.
 * @param {MapEdits | null | undefined} edits
 * @returns {number} */
export function readLayoutLawVersion(edits) {
  return edits && Number(edits.layoutLawVersion) === 2 ? 2 : DEFAULT_LAYOUT_LAW_VERSION;
}

/** The DM's PINNED season override (IT-3), or `null` when unset/invalid — the map then follows
 * the live world clock. A value outside the bounded 4-quarter vocabulary coerces to null (the
 * dormancy default). Read-only; the renderer's resolveMapDress prefers this over the live season.
 * @param {MapEdits | null | undefined} edits
 * @returns {'spring'|'summer'|'autumn'|'winter'|null} */
export function readSeasonOverride(edits) {
  const v = edits && typeof edits.seasonOverride === 'string' ? edits.seasonOverride : '';
  // Iterate the bounded vocab so the returned value carries the literal-union type (no any-cast).
  for (const s of SEASON_OVERRIDE_IDS) if (s === v) return s;
  return null;
}

/**
 * The DM annotation markers, validated + canonicalized: each carries a whole-unit
 * in-bounds (x, y), a bounded non-empty label, and a fail-closed audience ('dm'
 * unless explicitly 'player'). Malformed / label-less entries are dropped; the list
 * is capped and sorted for a stable stringify (byte-stability, the dormancy law).
 * Pure — never writes.
 * @param {MapEdits | null | undefined} edits
 * @returns {MapAnnotation[]}
 */
export function readAnnotations(edits) {
  const raw = edits && Array.isArray(edits.annotations) ? edits.annotations : [];
  /** @type {MapAnnotation[]} */
  const out = [];
  for (const a of raw) {
    if (!a || typeof a !== 'object') continue;
    const label = typeof a.label === 'string' ? a.label.trim().slice(0, ANNOTATION_LABEL_MAX) : '';
    if (!label) continue;
    if (!Number.isFinite(a.x) || !Number.isFinite(a.y)) continue;
    const x = clampNum(roundInt(Number(a.x)), 0, VIEW_MAX);
    const y = clampNum(roundInt(Number(a.y)), 0, VIEW_MAX);
    out.push({ x, y, label, audience: coerceAudience(a.audience) });
  }
  // Canonical order: y, then x, then label (deterministic — no localeCompare).
  out.sort((p, q) => (p.y - q.y) || (p.x - q.x) || (p.label < q.label ? -1 : p.label > q.label ? 1 : 0));
  return out.slice(0, MAX_ANNOTATIONS);
}

/**
 * The saved bespoke-style collection ({ [id]: TownMapStyle }) — per-settlement, blob-resident.
 * PURE — never writes. Absent / non-object ⇒ {}. Only entries that are wall-validated
 * (`__resolved:true`, the readBespokeStyle contract in bespokeStyles.js) survive, so a stray
 * value never resolves as a style and the dormancy collapse (below) can tell empty from present.
 * @param {MapEdits | null | undefined} edits
 * @returns {Record<string, unknown>}
 */
export function readBespokeStyles(edits) {
  const raw = edits && typeof edits.bespokeStyles === 'object' && edits.bespokeStyles && !Array.isArray(edits.bespokeStyles)
    ? /** @type {Record<string, unknown>} */ (edits.bespokeStyles) : {};
  /** @type {Record<string, unknown>} */
  const out = {};
  for (const id of Object.keys(raw)) {
    const v = raw[id];
    if (v && typeof v === 'object' && !Array.isArray(v) && /** @type {{ __resolved?: boolean }} */ (v).__resolved === true) {
      out[id] = v;
    }
  }
  return out;
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

  // layoutLawVersion: kept ONLY for v2 (the default v1 ⇒ omitted ⇒ byte-identical to
  // no-edit, the dormancy law — exactly the styleLens pattern). This is what pins the
  // versioning law: an absent marker renders v1 unchanged; only an explicit v2 flips.
  const version = readLayoutLawVersion(edits);
  if (version !== DEFAULT_LAYOUT_LAW_VERSION) out.layoutLawVersion = version;

  // annotations: kept ONLY when non-empty (absent ⇒ byte-identical dormancy — a map
  // with no DM markers stringifies exactly like no-edit). Validated + sorted above.
  const annotations = readAnnotations(edits);
  if (annotations.length > 0) out.annotations = annotations;

  // bespokeStyles: kept ONLY when the collection holds ≥1 wall-validated (__resolved) style
  // (absent / empty ⇒ byte-identical dormancy — deleting the LAST bespoke style returns the
  // blob to no-edit, the flip-back law's storage half). readBespokeStyles drops stray entries.
  const bespokeStyles = readBespokeStyles(edits);
  if (Object.keys(bespokeStyles).length > 0) out.bespokeStyles = bespokeStyles;

  // seasonOverride: kept ONLY for a valid pinned season (absent / invalid ⇒ omitted ⇒
  // byte-identical dormancy — clearing the pin returns the blob to no-edit, the exact styleLens
  // pattern). This is what pins the season-override law: an absent marker follows the live clock.
  const seasonOverride = readSeasonOverride(edits);
  if (seasonOverride) out.seasonOverride = seasonOverride;

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

/** ADD a DM annotation marker at (x, y) with a label + audience. Returns a NEW
 * normalized container. A label-less / out-of-bounds marker is dropped by normalize.
 * The default audience is DM-only (fail-closed); pass 'player' for a player-visible
 * marker. Pure — never mutates `edits`.
 * @param {MapEdits | null | undefined} edits
 * @param {{ x: number, y: number, label: string, audience?: 'dm'|'player' }} annotation
 * @returns {MapEdits | null} */
export function withAnnotation(edits, annotation) {
  const base = normalizeMapEdits(edits) || {};
  const list = Array.isArray(base.annotations) ? base.annotations.slice() : [];
  const a = annotation && typeof annotation === 'object' ? annotation : { x: 0, y: 0, label: '' };
  list.push({ x: Number(a.x), y: Number(a.y), label: String(a.label || ''), audience: coerceAudience(a.audience) });
  return normalizeMapEdits({ ...base, annotations: list });
}

/** REMOVE the annotation at `index` (into the canonical/sorted list readAnnotations
 * returns). Out-of-range ⇒ unchanged. Pure.
 * @param {MapEdits | null | undefined} edits @param {number} index
 * @returns {MapEdits | null} */
export function withoutAnnotationAt(edits, index) {
  const base = normalizeMapEdits(edits) || {};
  const list = Array.isArray(base.annotations) ? base.annotations.slice() : [];
  if (!Number.isInteger(index) || index < 0 || index >= list.length) return normalizeMapEdits(base);
  list.splice(index, 1);
  return normalizeMapEdits({ ...base, annotations: list });
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

/** PIN (or clear) the season override (IT-3): a DM fixes "this is the winter map", independent
 * of the live world clock. Passing a value OUTSIDE the bounded vocabulary (or null / '') CLEARS
 * the pin ⇒ byte-identical dormancy (the map follows the live season again — the exact styleLens
 * flip-back). Non-destructive: season is display-only, so no edit is ever lost by re-pinning.
 * @param {MapEdits | null | undefined} edits @param {string | null} season @returns {MapEdits | null} */
export function withSeasonOverride(edits, season) {
  const base = normalizeMapEdits(edits) || {};
  // undefined (no match) CLEARS the key ⇒ normalizeMapEdits drops it (byte-identical dormancy).
  /** @type {'spring'|'summer'|'autumn'|'winter'|undefined} */
  let next;
  for (const s of SEASON_OVERRIDE_IDS) if (s === season) { next = s; break; }
  return normalizeMapEdits({ ...base, seasonOverride: next });
}

/** THE OPT-IN REDRAW (VERSIONING LAW): switch a settlement's map to a layout-law
 * version NON-DESTRUCTIVELY. Every OTHER edit — pins, lens, legend prefs, reroll
 * salt — is preserved verbatim (it merges over the existing container), because the
 * cosmetic anchors (catalogId / localUid / district id) are version-independent, so a
 * v1 pin still nudges the same building under v2. Selecting v1 clears the key ⇒
 * byte-identical dormancy (a redraw back to the original arrangement loses nothing).
 * A non-{1,2} value coerces to the v1 default.
 * @param {MapEdits | null | undefined} edits @param {number} version @returns {MapEdits | null} */
export function withLayoutLawVersion(edits, version) {
  const base = normalizeMapEdits(edits) || {};
  const v = Number(version) === 2 ? 2 : DEFAULT_LAYOUT_LAW_VERSION;
  return normalizeMapEdits({ ...base, layoutLawVersion: v });
}

/** SET the per-settlement bespoke-style collection (the S4-S6 style-overhaul accept path's
 * durable half). Returns a NEW normalized container merged over the existing one, preserving
 * every OTHER edit (pins, lens, legend, annotations) — or `null` when the whole container is
 * now empty. An empty / all-invalid collection DROPS the `bespokeStyles` key, so deleting the
 * last saved style returns the blob byte-identical to no-edit (the flip-back / dormancy law).
 * The collection is expected to be built with domain/townMap/bespokeStyles.js's addBespokeStyle
 * (each entry wall-validated, __resolved); normalize re-checks and drops any that are not. Pure.
 * @param {MapEdits | null | undefined} edits
 * @param {Record<string, unknown> | null | undefined} collection
 * @returns {MapEdits | null} */
export function withBespokeStyles(edits, collection) {
  const base = normalizeMapEdits(edits) || {};
  const next = (collection && typeof collection === 'object' && !Array.isArray(collection)) ? collection : {};
  return normalizeMapEdits({ ...base, bespokeStyles: next });
}

/** The mapEdits container a NEWLY-created settlement is minted with so it renders
 * under the v2 engine (the VERSIONING LAW's "new settlements mint v2"). Pure — a
 * caller at the settlement-CREATE boundary (never the generation pipeline, so the
 * generator golden is untouched) stamps this onto the fresh blob; EXISTING settlements
 * never pass through create again, so they stay v1. The version is THE ONE DIAL
 * (NEW_SETTLEMENT_LAYOUT_LAW_VERSION) so a taste veto reverts in one line.
 * @returns {MapEdits} */
export function newSettlementMapEdits() {
  return { layoutLawVersion: NEW_SETTLEMENT_LAYOUT_LAW_VERSION };
}
