/**
 * domain/townMap/asymmetrySources.js — SOURCED ASYMMETRY (owner refinement, #38).
 *
 * "nothing should be perfectly organic. there will always be slight or minor organic
 * asymmetry from the region, resources, people's habits… The best that we as people can
 * do is to plan around it or use them to our natural advantage." — the owner, 2026-07-17.
 *
 * The v2 layout engine does NOT wiggle districts with uniform noise (noise reads as
 * chaos, not history). Instead EVERY deformation has a NAMED CAUSE drawn from the
 * dossier, in three families:
 *   • REGION   — terrain roughness + water + slope. Rough country (hills/mountain/
 *     forest) leaves a small per-district grain; flat plains/desert come out clean.
 *   • RESOURCE — the settlement's actual exports (economicState.primaryExports, read
 *     through canonExports, which also honours the legacy `exports` alias) become
 *     resource sites (the tannery downstream, the quarry at the edge, the mill by the
 *     water) that pull their work-quarter toward them.
 *   • HABIT    — people's worn routes: market accretion at the trade-gate bearing, and
 *     desire paths between high-traffic institution pairs (the shortcut everyone walks).
 *
 * The planner then RESPONDS to these asymmetries (the plan-response law, applied in
 * townLayoutV2): the wall kinks to embrace what matters, the grid yields where a stream
 * cuts, the square sits where the desire paths converge. Plan-around or exploit; never
 * suppress. A settlement with NO sources comes out cleanly formal; one rich in sources
 * visibly deforms around them — and because distinctive irregularity is what makes
 * districts/edges/landmarks memorable, sourced asymmetry RAISES the Lynch rubric.
 *
 * PURE + deterministic (seed fork + dossier only): a resource's bearing is a codepoint
 * hash of the export NAME (stable, dossier-derived — never uniform rng), the regional
 * grain is seeded per district id and scaled by terrain, and every vector is built from
 * the correctly-rounded IEEE ops (incl. sqrt) — no trig, no Math.random, no Date, no
 * localeCompare. Any-cast baseline 0 for this file.
 */

import { clamp } from '../../kernel/math.js';

const VIEW = 1000;

/** Order-independent codepoint digit of a string (dossier-stable, no rng). @param {string} str */
function codeDigit(str) {
  let sum = 0;
  const s = String(str || '');
  for (let i = 0; i < s.length; i++) sum += s.charCodeAt(i);
  return sum;
}

/**
 * @typedef {Object} AsymmetrySource
 * @property {'region'|'resource'|'habit'} family
 * @property {string} cause          human-readable provenance ("quarry (stone export)")
 * @property {{x:number,y:number}} point  where the pull originates (0..1000 space)
 * @property {number} strength       0..1
 * @property {number} pullK          max displacement in view-units at full strength
 * @property {string[]|null} targets district categories this source pulls (null ⇒ none targeted)
 */

/** Terrain → a regional-grain amplitude (0 for flat, higher for broken country). The
 *  ONLY "organic" wiggle — and it is per-cause (region), per-district, and vanishes on
 *  flat land, so a featureless plains hamlet reads cleanly formal.
 *  @type {Readonly<Record<string, number>>} */
const TERRAIN_GRAIN = Object.freeze({
  plains: 0, desert: 3, riverside: 6, coastal: 6, forest: 12, hills: 18, mountain: 26,
});

/** An export keyword → { site work-category it pulls, a placement hint }. The tannery-
 *  downstream exemplar generalized: leather works sit downwind/downstream, quarries and
 *  mines at the rough edge, mills by the water, farm-goods toward the market. */
const EXPORT_RULES = Object.freeze([
  { re: /leather|hide|tann|fur|pelt/i,             target: 'industrial', hint: 'downstream', label: 'tannery' },
  { re: /stone|marble|slate|granite|quarry/i,      target: 'industrial', hint: 'edge',       label: 'quarry' },
  { re: /iron|ore|copper|silver|gold|tin|coal|mine/i, target: 'industrial', hint: 'edge',    label: 'mine' },
  { re: /timber|wood|lumber|mill/i,                target: 'industrial', hint: 'water',      label: 'mill' },
  { re: /salt|fish|preserved|meat/i,               target: 'merchant',   hint: 'water',      label: 'salthouse' },
  { re: /wool|cloth|textile|linen|dye|weav/i,      target: 'craft',      hint: 'core',       label: 'weavers' },
  { re: /grain|wheat|barley|produce|wine|ale|hop|honey/i, target: 'merchant', hint: 'gate', label: 'market-farms' },
  { re: /reagent|herb|alchem|arcane|scroll/i,      target: 'arcane',     hint: 'core',       label: 'reagent-works' },
]);

/**
 * Extract the named asymmetry sources for a settlement. Deterministic in the dossier +
 * seed. @param {{
 *   terrain: string|null, core: {x:number,y:number}, waterAnchor: {x:number,y:number}|null,
 *   gatePoints: Array<{x:number,y:number}>, exports: string[], prosperity01: number,
 *   presentCategories: Set<string>, seed: string
 * }} arg
 * @returns {AsymmetrySource[]}
 */
export function extractAsymmetrySources(arg) {
  const { terrain, core, waterAnchor, gatePoints, exports, prosperity01, presentCategories, seed } = arg;
  /** @type {AsymmetrySource[]} */
  const out = [];

  // ── REGION: water pull (waterfront trades hug the water) ───────────────────
  if (waterAnchor) {
    out.push({
      family: 'region', cause: 'waterfront (the town meets the water)',
      point: { x: waterAnchor.x, y: waterAnchor.y }, strength: 0.9, pullK: 150,
      targets: ['industrial', 'foreign', 'merchant'],
    });
  }
  // ── REGION: slope — high ground draws the powerful, low ground the labouring ─
  if (terrain === 'hills' || terrain === 'mountain') {
    const upIdx = codeDigit(`${seed}::uphill`) % 16;
    const up = compassPoint(core, upIdx, 320);
    const strength = terrain === 'mountain' ? 0.8 : 0.55;
    out.push({ family: 'region', cause: `high ground (${terrain})`, point: up, strength, pullK: 120, targets: ['noble', 'civic', 'religious'] });
    const down = compassPoint(core, (upIdx + 8) % 16, 320);
    out.push({ family: 'region', cause: `low ground (${terrain})`, point: down, strength: strength * 0.8, pullK: 110, targets: ['industrial', 'residential'] });
  }

  // ── RESOURCE: exports become sited work-quarters (named, dossier-derived) ───
  const seenTargets = new Set();
  for (const ex of (Array.isArray(exports) ? exports : [])) {
    const rule = EXPORT_RULES.find((r) => r.re.test(ex));
    if (!rule) continue;
    if (seenTargets.has(rule.target + rule.hint)) continue; // one site per (target,hint)
    seenTargets.add(rule.target + rule.hint);
    const point = resourcePoint(rule.hint, core, waterAnchor, gatePoints, codeDigit(ex));
    out.push({
      family: 'resource', cause: `${rule.label} (${ex} export)`,
      point, strength: clamp(0.5 + prosperity01 * 0.4, 0, 1), pullK: 130, targets: [rule.target],
    });
  }

  // ── HABIT: market accretion at the busiest trade gate ──────────────────────
  if (gatePoints.length > 0 && (presentCategories.has('merchant') || presentCategories.has('civic'))) {
    const gate = gatePoints[0];
    out.push({
      family: 'habit', cause: 'market accretion (stalls crowd the trade gate)',
      point: { x: gate.x, y: gate.y }, strength: 0.7, pullK: 120, targets: ['merchant', 'civic'],
    });
  }

  return out;
}

/** A point at compass index `idx`, `pct`/1000 of the way out from a center.
 * @param {{x:number,y:number}} core @param {number} idx @param {number} pct
 * @returns {{x:number,y:number}} */
function compassPoint(core, idx, pct) {
  const COMPASS = COMPASS16[idx % 16];
  return { x: clamp(core.x + Math.round((COMPASS[0] * pct) / 100), 0, VIEW), y: clamp(core.y + Math.round((COMPASS[1] * pct) / 100), 0, VIEW) };
}

/** Where a resource site sits, by its placement hint.
 * @param {string} hint @param {{x:number,y:number}} core
 * @param {{x:number,y:number}|null} waterAnchor @param {Array<{x:number,y:number}>} gatePoints
 * @param {number} digit @returns {{x:number,y:number}} */
function resourcePoint(hint, core, waterAnchor, gatePoints, digit) {
  if (hint === 'water' && waterAnchor) return { x: waterAnchor.x, y: waterAnchor.y };
  if (hint === 'downstream' && waterAnchor) {
    // downstream ⇒ below the water anchor along the flow (toward higher y / the bottom)
    return { x: clamp(waterAnchor.x + 90, 0, VIEW), y: clamp(waterAnchor.y + 60, 0, VIEW) };
  }
  if (hint === 'gate' && gatePoints.length > 0) return { x: gatePoints[digit % gatePoints.length].x, y: gatePoints[digit % gatePoints.length].y };
  if (hint === 'core') return compassPoint(core, digit % 16, 120);
  // 'edge' (quarries/mines) — out at the rough periphery, seeded-consistent bearing
  return compassPoint(core, digit % 16, 360);
}

/** The 16 integer unit directions (×100) — shared trig-free table. */
const COMPASS16 = Object.freeze([
  [0, -100], [38, -92], [71, -71], [92, -38],
  [100, 0], [92, 38], [71, 71], [38, 92],
  [0, 100], [-38, 92], [-71, 71], [-92, 38],
  [-100, 0], [-92, -38], [-71, -71], [-38, -92],
]);

/**
 * The NET sourced displacement for a district at `centroid` of `category`. Sums each
 * source's pull (toward its point, scaled by strength, capped so it never overshoots).
 * NO random term — a district with no relevant source does not move. @returns {{dx:number,dy:number}}
 * @param {{x:number,y:number}} centroid @param {string} category @param {AsymmetrySource[]} sources
 */
export function netDisplacement(centroid, category, sources) {
  let dx = 0;
  let dy = 0;
  for (const src of sources) {
    if (src.targets && !src.targets.includes(category)) continue;
    const vx = src.point.x - centroid.x;
    const vy = src.point.y - centroid.y;
    const dist = Math.sqrt(vx * vx + vy * vy) || 1;
    const mag = Math.min(src.strength * src.pullK, dist * 0.5);
    dx += (vx / dist) * mag;
    dy += (vy / dist) * mag;
  }
  return { dx: Math.round(dx), dy: Math.round(dy) };
}

/**
 * The small REGIONAL GRAIN offset for a district — the only "organic" wiggle, and it is
 * per-cause (terrain roughness), per-district (seeded by id), and ZERO on flat land. A
 * plains settlement gets a byte-clean formal grid; broken country visibly ripples.
 * @param {string} districtId @param {string|null} terrain @param {string} seed @returns {{dx:number,dy:number}}
 */
export function regionalGrain(districtId, terrain, seed) {
  const amp = TERRAIN_GRAIN[terrain || 'plains'] ?? 0;
  if (amp === 0) return { dx: 0, dy: 0 };
  const h = codeDigit(`${seed}::grain::${districtId}`);
  // deterministic spread into [-amp, amp] on each axis from two decorrelated digits
  const dx = ((h % (amp * 2 + 1)) - amp);
  const dy = (((h * 7 + 13) % (amp * 2 + 1)) - amp);
  return { dx, dy };
}

/**
 * Lean a district polygon toward its net pull — the quarter grows lopsided in the
 * direction of its cause (a teardrop toward the water, the resource, the gate). Corners
 * on the pull side stretch out; the opposite side is untouched. Zero pull ⇒ unchanged
 * (formal). @param {Array<[number,number]>} polygon @param {{x:number,y:number}} centroid
 * @param {{dx:number,dy:number}} disp @returns {Array<[number,number]>}
 */
export function leanPolygon(polygon, centroid, disp) {
  const mag = Math.sqrt(disp.dx * disp.dx + disp.dy * disp.dy);
  if (mag < 1) return polygon;
  const ux = disp.dx / mag;
  const uy = disp.dy / mag;
  return polygon.map(([px, py]) => {
    const cx = px - centroid.x;
    const cy = py - centroid.y;
    const clen = Math.sqrt(cx * cx + cy * cy) || 1;
    const align = (cx * ux + cy * uy) / clen; // -1..1: +1 on the pull side
    const stretch = 0.3 * Math.min(mag, 80) * Math.max(0, align);
    return /** @type {[number,number]} */ ([clamp(px + ux * stretch, 0, VIEW), clamp(py + uy * stretch, 0, VIEW)]);
  });
}

/**
 * Desire paths — the shortcuts people wear between high-traffic quarter pairs. Returns
 * district-id pairs to connect with a straightened path (a diagonal street the formal
 * grid never planned). Derived from category adjacency present in the settlement (the
 * inference layer — vetoable). @param {Array<{id:string,category:string}>} districts
 * @returns {Array<{ fromId:string, toId:string, cause:string }>}
 */
export function desirePaths(districts) {
  // High-traffic category affinities (the pairs a townsperson walks daily).
  const AFFINITY = [
    ['civic', 'merchant', 'petition-and-trade'],
    ['merchant', 'residential', 'daily-market-run'],
    ['military', 'civic', 'watch-to-hall'],
    ['religious', 'residential', 'the-faithful-walk'],
    ['craft', 'merchant', 'workshop-to-stall'],
  ];
  const byCat = new Map();
  for (const d of districts) if (!byCat.has(d.category)) byCat.set(d.category, d);
  /** @type {Array<{ fromId:string, toId:string, cause:string }>} */
  const out = [];
  for (const [a, b, cause] of AFFINITY) {
    const da = byCat.get(a);
    const db = byCat.get(b);
    if (da && db && da.id !== db.id) out.push({ fromId: da.id, toId: db.id, cause });
  }
  return out;
}
