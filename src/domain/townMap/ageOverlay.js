/**
 * domain/townMap/ageOverlay.js — THE AGED MAP (VISION WAVE V-15). "The town wears
 * its history." A DERIVED-ONLY age overlay for the town map: growth THICKENING
 * where the fabric prospered, calamity SCARS that fade with a half-life measured in
 * DECADES, and reconstruction PATINA where a quarter was reborn.
 *
 * ── DERIVED-ONLY (the upgrade-restores law) ───────────────────────────────────
 * This NEVER mutates the stored layout or the town-map MODEL. It is a pure
 * op-emitter (the groundDress precedent) reading the settlement's `urbanFabric`
 * mirror via fabricRead (zero engine import). It is emitted as a SEPARATE overlay
 * layer — buildTownMapDrawList (the golden'd draw path) is NOT touched — so every
 * existing town-map golden (v1 / v2 / style) stays byte-identical by construction.
 *
 * ── THE DORMANCY WALL (mirrors groundDress) ──────────────────────────────────
 * ageOverlayOps returns [] unless the style names the bounded age fields
 * (style.opacity.age + style.stroke.age) — which only the age overlay's own style
 * names. So even if handed a base lens it emits nothing: it can never pollute the
 * golden draw list. Absent fabric ⇒ empty portrait ⇒ (near-)empty ops ⇒ the toggle
 * shows nothing; toggle OFF ⇒ the layer is not mounted ⇒ the base render is exact.
 *
 * ── THE SCRUB SEAM (V-3 coordination) ────────────────────────────────────────
 * The scars decay by AGE at `asOfWeek` (the shared timelapse scrub week, or live).
 * A scar not yet formed at asOfWeek is skipped; a scar decades old is faint. So the
 * V-3 scrubber, when a town map is open, walks the town's wear backward.
 *
 * DETERMINISM / PURITY: seeded off the model's own geometry via createPRNG; only
 * + − × ÷ and Math.round/min/max/pow (no Math.random / Date / trig — the townMap
 * purity + determinism lint bans them); every coordinate rounded ⇒ (model, style,
 * portrait) → byte-identical ops across runs and machines.
 *
 * @enforced-by tests/domain/ageOverlay.test.js + tests/property/ageOverlayGolden.test.js
 */

import { createPRNG } from '../../kernel/prng.js';
import { fabricStocksFor, fabricScarsOf, fabricRebirthsOf } from './fabricRead.js';

const VIEW = 1000;
const R = Math.round;
/** A calamity scar's half-life: one decade (10 years × 52 weeks). Its mark halves
 *  every decade — "a lingering mark with a half-life measured in decades." */
export const SCAR_DECADE_HALF_LIFE_WEEKS = 520;
/** Below this decayed severity a scar has faded from the fabric (no mark). */
const SCAR_FADE_FLOOR = 0.06;

/** A finite in-bounds test with a small margin. @param {number} v @param {number} [m] */
function onMap(v, m = 6) {
  return Number.isFinite(v) && v >= m && v <= VIEW - m;
}

/**
 * The decayed intensity of a mark of `severity` that formed `ageWeeks` ago, halving
 * every decade. ageWeeks ≤ 0 (not yet formed at the view week) ⇒ 0. Pure, total.
 * @param {number} severity @param {number} ageWeeks @returns {number}
 */
export function decadeDecay(severity, ageWeeks) {
  const s = Number.isFinite(severity) ? Math.max(0, Math.min(1, severity)) : 0;
  const a = Number.isFinite(ageWeeks) ? ageWeeks : 0;
  if (a < 0) return 0; // the mark does not exist yet at this scrub week
  return s * Math.pow(0.5, a / SCAR_DECADE_HALF_LIFE_WEEKS);
}

/**
 * @typedef {Object} AgePortrait
 * @property {Record<string, number>} growth   per-district-class prominence stock (0..1)
 * @property {Array<{ kind: string, week: number, displaySeverity: number }>} scars  decade-decayed to asOfWeek
 * @property {string[]} rebirthClasses         district classes reborn at/ before asOfWeek
 * @property {number} asOfWeek
 */

/**
 * Derive the town's age portrait from its urban-fabric memory, as of a view week.
 * Pure; empty (dark/absent fabric) ⇒ empty portrait ⇒ (near-)empty overlay.
 * @param {Object} args
 * @param {{ urbanFabric?: unknown }|null|undefined} args.settlement
 * @param {number} args.asOfWeek   the scrub / live week the portrait is drawn at
 * @returns {AgePortrait}
 */
export function deriveAgePortrait({ settlement, asOfWeek }) {
  const week = Number.isFinite(asOfWeek) ? Number(asOfWeek) : 0;
  const growth = fabricStocksFor(settlement);
  /** @type {Array<{ kind: string, week: number, displaySeverity: number }>} */
  const scars = [];
  for (const s of fabricScarsOf(settlement)) {
    const displaySeverity = decadeDecay(s.severity, week - s.week);
    if (displaySeverity >= SCAR_FADE_FLOOR) scars.push({ kind: s.kind, week: s.week, displaySeverity });
  }
  /** @type {Set<string>} */
  const rebirthSet = new Set();
  for (const r of fabricRebirthsOf(settlement)) {
    if (r.week <= week) for (const c of r.classes) rebirthSet.add(c);
  }
  return { growth, scars, rebirthClasses: [...rebirthSet].sort(), asOfWeek: week };
}

/** @typedef {import('./townMapDraw.js').DrawOp[]} Ops */
/** @typedef {import('./townMapModel.js').TownMapModel} Model */

/**
 * Emit the AGE overlay draw ops for a model under an age style + portrait. PURE +
 * deterministic. Returns [] for any style that does not name the bounded age fields
 * (the dormancy wall — so it can never enter the golden draw list). Uses only the
 * shared five-op vocabulary.
 * @param {Model|null|undefined} model
 * @param {{ ink?: string, opacity?: { age?: number }, stroke?: { age?: number } }} ageStyle
 * @param {AgePortrait} portrait
 * @returns {import('./townMapDraw.js').DrawOp[]}
 */
export function ageOverlayOps(model, ageStyle, portrait) {
  /** @type {import('./townMapDraw.js').DrawOp[]} */
  const ops = [];
  if (!model || typeof model !== 'object') return ops;
  const oAge = ageStyle && ageStyle.opacity ? ageStyle.opacity.age : undefined;
  const wAge = ageStyle && ageStyle.stroke ? ageStyle.stroke.age : undefined;
  // THE DORMANCY WALL: a style that does not name the age fields draws nothing.
  if (oAge == null || wAge == null) return ops;
  const ink = (ageStyle && ageStyle.ink) || 'currentColor';
  const districts = Array.isArray(model.districts) ? model.districts : [];
  const water = (model.frame && model.frame.water) || null;
  const coastY = water && water.kind === 'coast' && Array.isArray(water.path) && water.path[0] ? water.path[0][1] : null;
  const rng = createPRNG(`age-overlay:${geometryDigest(model)}:${portrait.asOfWeek}`);

  // (1) GROWTH THICKENING — building-density infill in the districts whose class the
  //     fabric records as prospered (higher prominence stock ⇒ more infill dots).
  for (const d of districts) {
    const stock = typeof portrait.growth[d.category] === 'number' ? portrait.growth[d.category] : 0;
    if (stock <= 0) continue;
    const n = Math.min(5, Math.round(stock * 5)); // 0..5 infill marks by prominence
    const g = rng.fork(`grow:${d.id}`);
    for (let k = 0; k < n; k++) {
      const cx = R(d.centroid.x + g.randInt(-16, 16));
      const cy = R(d.centroid.y + g.randInt(-16, 16));
      if (!onMap(cx) || !onMap(cy) || (coastY != null && cy > coastY)) continue;
      ops.push({ t: 'circle', cx, cy, r: 1.5, fill: ink });
    }
  }

  // (2) CALAMITY SCARS — patched/damaged crosshatch over the built quarters, count +
  //     opacity from the WORST decade-decayed scar severity (fades over decades).
  const worst = portrait.scars.reduce((m, s) => Math.max(m, s.displaySeverity), 0);
  if (worst > 0) {
    const perDistrict = worst >= 0.5 ? 2 : 1;
    const sOpacity = Math.round(Math.max(0.15, Math.min(1, oAge * (0.4 + worst))) * 100) / 100;
    const f = rng.fork('scar');
    let placed = 0;
    for (const d of districts) {
      if (placed >= 18) break;
      const gg = f.fork(`d:${d.id}`);
      for (let k = 0; k < perDistrict && placed < 18; k++) {
        const cx = R(d.centroid.x + gg.randInt(-14, 14));
        const cy = R(d.centroid.y + gg.randInt(-14, 14));
        if (!onMap(cx) || !onMap(cy) || (coastY != null && cy > coastY)) continue;
        ops.push({ t: 'line', x1: R(cx - 4), y1: R(cy - 4), x2: R(cx + 4), y2: R(cy + 4), stroke: ink, strokeWidth: wAge, strokeOpacity: sOpacity });
        placed++;
      }
    }
  }

  // (3) RECONSTRUCTION PATINA — a small "fresh masonry" corner tick on each district
  //     whose class was reborn (the rebuilt quarter reads newer than its neighbours).
  if (portrait.rebirthClasses.length > 0) {
    const reborn = new Set(portrait.rebirthClasses);
    let placed = 0;
    for (const d of districts) {
      if (placed >= 6) break;
      if (!reborn.has(d.category)) continue;
      const cx = d.centroid.x, cy = d.centroid.y;
      const x1 = R(cx - 5), y1 = R(cy - 5), x2 = R(cx + 5), y2 = R(cy - 5);
      const x3 = R(cx + 5), y3 = R(cy + 5);
      if (onMap(x1) && onMap(y1) && onMap(x2) && onMap(x3) && onMap(y3) && (coastY == null || cy <= coastY)) {
        ops.push({ t: 'line', x1, y1, x2, y2, stroke: ink, strokeWidth: wAge, strokeOpacity: oAge });
        ops.push({ t: 'line', x1: x2, y1: y2, x2: x3, y2: y3, stroke: ink, strokeWidth: wAge, strokeOpacity: oAge });
        placed++;
      }
    }
  }

  return ops;
}

/**
 * FNV-1a digest of the model's stable geometry → the master age seed (the groundDress
 * digest, duplicated locally so the layer imports no sibling emitter). Pure integer ops.
 * @param {Model} model @returns {number}
 */
function geometryDigest(model) {
  let h = 2166136261;
  /** @param {number} n */
  const push = (n) => { h = (Math.imul(h, 16777619) ^ (R(n) | 0)) >>> 0; };
  for (const d of model.districts || []) { push(d.centroid.x); push(d.centroid.y); }
  for (const r of (model.frame && model.frame.roads) || []) { push(r.from[0]); push(r.from[1]); push(r.to[0]); push(r.to[1]); }
  return h >>> 0;
}
