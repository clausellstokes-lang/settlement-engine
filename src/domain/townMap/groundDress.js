/**
 * domain/townMap/groundDress.js — THE GROUND DRESS (THE ILLUSTRATED TOWN, IT-2).
 *
 * The parchment stops being empty. Ground dress extends the proven LANDFORM mark idiom
 * (dot / stroke / curve, PATTERN-not-colour — the engraver's register) from "special
 * features" to the WHOLE ground plane, emitted as the EXISTING five primitive op kinds
 * (poly | line | circle | rect | path — townMapDraw.js), so the SVG string / react-pdf
 * plate / thumbnail / raster all render it free, exactly like the glyph layer:
 *   (1) FIELD FURROWS   — ploughed patches in the farm belt, aligned to the approach roads.
 *   (2) TREE STIPPLES   — small wooded clumps at the outer margins (the woods edge).
 *   (3) WATER RIPPLES   — gentle ink curves along the coast / river.
 *   (4) MEADOW DOTTING  — sparse stipple on the open ground between the districts.
 *   (5) HEDGE TICKS     — short perpendicular ticks along the skeleton lanes.
 *   (6) WALL SHADOWS + LANDFORM RELIEF (IT2-b) — the ONE fixed NW light (SHADOW_DIR),
 *       shared with the glyph hatch so the whole illustrated plane is lit from one side.
 *
 * v1 COVERAGE LAW (design §2, the red-flag cure): the base dress derives ONLY from
 * features present in BOTH model generations (coast, river, districts, approach roads,
 * wall ring), so EVERY existing v1 settlement gets dressed. v2's frame.landform adds the
 * mountain-flank RELIEF enrichment ON TOP (IT2-b) — it never gates the base coverage.
 *
 * DORMANCY (THE WALL): the densities/weights come from the BOUNDED style fields
 * style.opacity.dress / style.stroke.dress, which ONLY the illustrated lens names. A style
 * that does not name them ⇒ ZERO dress ops ⇒ the prior output is byte-identical (the five
 * re-skin lenses AND the accessible lens never move — their goldens hold untouched).
 *
 * DETERMINISM / PURITY: seeded off the model's OWN stable geometry via createPRNG (NO
 * Math.random / Date / localeCompare — the src/domain/townMap purity scan + the domain
 * determinism lint ban them), using only + − × ÷ and Math.round/min/max/sqrt/imul (all
 * correctly-rounded IEEE-754, cross-machine stable — NEVER trig), and every emitted
 * coordinate is rounded ⇒ (model, style) → byte-identical ops across runs and machines.
 */

import { createPRNG } from '../../kernel/prng.js';
import { resolveTownMapStyle, DEFAULT_STYLE_ID } from '../../design/townMapStyles.js';
import { SHADOW_DIR } from '../../design/townGlyphs/glyphCompiler.js';

const VIEW = 1000;
const R = Math.round;
/** The four bounded seasons a bespoke skin may bias toward (IT-4 seasonBias fallback). */
const SEASON_BIAS = new Set(['spring', 'summer', 'autumn', 'winter']);
/** Round an opacity/weight to 2 decimals — a stable, machine-identical serialization
 *  (the SVG `num()` prints the shortest round-trip; rounding keeps season-muted values
 *  clean like 0.3, never a float tail). @param {number} v */
const R2 = (v) => Math.round(v * 100) / 100;

/**
 * THE SEASON + STATE DRESS CONTEXT (THE ILLUSTRATED TOWN, IT-3). A bounded, display-only
 * portrait of the town NOW — resolved by domain/townMap/mapDress.js from the campaign's
 * worldState + the settlement's own reads, NEVER stored on the settlement. Threaded into
 * `groundDressOps` as an OPTIONAL third argument; ABSENT (null/undefined) ⇒ the seasonless
 * base bytes (the dormancy law at season strength — every existing caller stays byte-
 * identical). Season swaps PARAMETERS on the existing marks; state adds bounded marks.
 * @typedef {Object} MapDress
 * @property {'spring'|'summer'|'autumn'|'winter'|null} [season]  the display season
 * @property {'drought'|'hard_winter'|'bountiful'|null} [severity]  the year's seeded verdict
 * @property {MapDressState|null} [state]  live state marks (IT3-b)
 * @property {MapDressFestival|null} [festival]  festival-week marks (Wave C, traditions §10)
 *
 * @typedef {Object} MapDressState
 * @property {boolean} [besieged]  siege works ring (war-state read)
 * @property {number} [scarLevel]  0..1 max scar severity ⇒ scar grain (0/absent ⇒ none)
 * @property {string[]} [rebuiltCategories]  district categories under rebirth ⇒ scaffold ticks
 *
 * @typedef {Object} MapDressFestival
 * @property {number} [scale]  the grandest in-window observance's scale band (0..6 ⇒ lantern density)
 */

// THE ONE FIXED LIGHT — NW, shared with the glyph hatch (SHADOW_DIR). The unit shadow-fall
// direction (SE, both components positive) the wall shadows + the flank relief hachures
// ride, so nothing is ever lit from a second direction (design §1). Correctly-rounded sqrt.
const SHADOW_MAG = Math.sqrt(SHADOW_DIR.dx * SHADOW_DIR.dx + SHADOW_DIR.dy * SHADOW_DIR.dy) || 1;
const SHADOW_UX = SHADOW_DIR.dx / SHADOW_MAG;
const SHADOW_UY = SHADOW_DIR.dy / SHADOW_MAG;

/** @typedef {ReturnType<typeof createPRNG>} Rng */
/** @typedef {import('./townMapDraw.js').DrawOp[]} Ops */
/** @typedef {import('./townMapModel.js').TownMapModel} Model */

/**
 * FNV-1a-style digest of the model's stable GEOMETRY → the master dress seed. The same
 * model ⇒ the same digest ⇒ the same dress; a different town's geometry ⇒ a different
 * digest ⇒ its own texture (so two structurally-alike settlements never wear an identical
 * dress). Pure integer ops only.
 * @param {import('./townMapModel.js').TownMapModel} model
 * @returns {number}
 */
function geometryDigest(model) {
  let h = 2166136261;
  /** @param {number} n */
  const push = (n) => { h = (Math.imul(h, 16777619) ^ (R(n) | 0)) >>> 0; };
  for (const d of model.districts || []) { push(d.centroid.x); push(d.centroid.y); }
  for (const r of (model.frame && model.frame.roads) || []) {
    push(r.from[0]); push(r.from[1]); push(r.to[0]); push(r.to[1]);
  }
  const w = model.frame && model.frame.water;
  if (w && Array.isArray(w.path)) for (const p of w.path) { push(p[0]); push(p[1]); }
  return h >>> 0;
}

/** A finite in-bounds test with a small margin. @param {number} v @param {number} [m] */
function onMap(v, m = 4) {
  return Number.isFinite(v) && v >= m && v <= VIEW - m;
}

/**
 * (1) FIELD FURROWS — a ploughed field patch in each approach road's OUTER band (the farm
 * belt near the map edge): parallel furrow lines flanking the road, ALIGNED to it.
 * SEASON (IT-3): WINTER mutes the furrows (snow-covered fields — fewer rows, lower opacity);
 * AUTUMN adds a harvest STUBBLE tick perpendicular across the band (the reaped field). Absent
 * season ⇒ neither branch ⇒ byte-identical to the base furrows.
 * @param {Ops} ops @param {Model} model @param {Rng} rng @param {string} ink
 * @param {number} wDress @param {number} oDress @param {number|null} coastY
 * @param {'spring'|'summer'|'autumn'|'winter'|null} season
 */
function pushFurrows(ops, model, rng, ink, wDress, oDress, coastY, season) {
  const winter = season === 'winter';
  const autumn = season === 'autumn';
  const oFur = winter ? R2(oDress * 0.6) : oDress;    // muted under snow
  const roads = (model.frame && model.frame.roads) || [];
  let ri = 0;
  for (const road of roads) {
    const fx = road.from[0], fy = road.from[1], tx = road.to[0], ty = road.to[1];
    const dx = tx - fx, dy = ty - fy;                 // road vector: edge → centre
    const mag = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / mag, uy = dy / mag;               // unit ALONG the road
    const px = -uy, py = ux;                          // unit perpendicular
    const f = rng.fork(`furrow:${ri++}`);
    const side = f.chance(0.5) ? 1 : -1;              // seeded flank
    const t = f.randFloat(0.18, 0.34);                // how far in from the edge (outer band)
    const bx = fx + ux * mag * t, by = fy + uy * mag * t;
    const gap = f.randFloat(26, 46);                  // clearance from the road centre
    const rows = (winter ? 2 : 3) + (f.chance(0.5) ? 1 : 0);  // winter: sparser furrows
    const len = f.randFloat(30, 46);
    for (let k = 0; k < rows; k++) {
      const off = gap + k * 9;
      const cxp = bx + px * off * side, cyp = by + py * off * side;
      const x1 = R(cxp - ux * len / 2), y1 = R(cyp - uy * len / 2);
      const x2 = R(cxp + ux * len / 2), y2 = R(cyp + uy * len / 2);
      if (coastY != null && (y1 > coastY || y2 > coastY)) continue;   // not into the sea
      if (!onMap(x1) || !onMap(x2) || !onMap(y1) || !onMap(y2)) continue;
      ops.push({ t: 'line', x1, y1, x2, y2, stroke: ink, strokeWidth: wDress, strokeOpacity: oFur });
      // AUTUMN harvest stubble: one short perpendicular tick straddling the furrow (the
      // reaped-field convention). Seeded off the row so it rides the same stream.
      if (autumn && k % 2 === 0) {
        const sh = 4;
        const hx1 = R(cxp - px * sh), hy1 = R(cyp - py * sh);
        const hx2 = R(cxp + px * sh), hy2 = R(cyp + py * sh);
        if (onMap(hx1) && onMap(hx2) && onMap(hy1) && onMap(hy2) && (coastY == null || (hy1 <= coastY && hy2 <= coastY))) {
          ops.push({ t: 'line', x1: hx1, y1: hy1, x2: hx2, y2: hy2, stroke: ink, strokeWidth: wDress, strokeOpacity: oDress });
        }
      }
    }
  }
}

/**
 * (2) TREE-GLYPH STIPPLES — small wooded clumps at the outer margins, away from the water
 * band. Stipple canopy dots (opaque ink, tone from density — the landform idiom) with an
 * occasional trunk tick. SEASON (IT-3): WINTER draws BARE trees (a trunk + two branch ticks,
 * no canopy) — the leafless winter woods. Absent/other season ⇒ the full-canopy default
 * (byte-identical to the base woods).
 * @param {Ops} ops @param {Model} model @param {Rng} rng @param {string} ink
 * @param {number} wDress @param {number} oDress @param {number|null} coastY
 * @param {'spring'|'summer'|'autumn'|'winter'|null} season
 */
function pushWoods(ops, model, rng, ink, wDress, oDress, coastY, season) {
  const winter = season === 'winter';
  /** @type {Array<[number, number]>} */
  const corners = [[180, 180], [820, 180], [180, 820], [820, 820]];
  const f = rng.fork('woods');
  const order = f.shuffle(corners.map((_, i) => i));  // seeded corner order
  let placed = 0;
  for (const ci of order) {
    if (placed >= 2) break;                            // ≤ 2 clumps
    const [cx, cy] = corners[ci];
    if (coastY != null && cy > coastY - 20) continue;  // corner is in the sea — no woods
    const g = f.fork(`clump:${ci}`);
    const n = 4 + g.randInt(0, 3);                     // 4–7 trees
    for (let k = 0; k < n; k++) {
      const tx = R(cx + g.randInt(-52, 52));
      const ty = R(cy + g.randInt(-40, 40));
      if (!onMap(tx, 8) || !onMap(ty, 8)) continue;
      if (coastY != null && ty > coastY - 8) continue;
      const rad = 3 + (k % 2);
      if (winter) {
        // BARE TREE — a short trunk + two upward branch ticks, no canopy (the leafless woods).
        const th = 5 + (k % 2);
        ops.push({ t: 'line', x1: tx, y1: R(ty - th), x2: tx, y2: R(ty + th), stroke: ink, strokeWidth: wDress, strokeOpacity: oDress });
        ops.push({ t: 'line', x1: tx, y1: R(ty - th), x2: R(tx - 3), y2: R(ty - th - 3), stroke: ink, strokeWidth: wDress, strokeOpacity: oDress });
        ops.push({ t: 'line', x1: tx, y1: R(ty - th), x2: R(tx + 3), y2: R(ty - th - 3), stroke: ink, strokeWidth: wDress, strokeOpacity: oDress });
      } else {
        ops.push({ t: 'circle', cx: tx, cy: ty, r: rad, fill: ink });   // canopy stipple (opaque)
        if (g.chance(0.5)) {
          ops.push({ t: 'line', x1: tx, y1: R(ty + rad), x2: tx, y2: R(ty + rad + 5), stroke: ink, strokeWidth: wDress, strokeOpacity: oDress });
        }
      }
    }
    placed++;
  }
}

/**
 * (3) WATER RIPPLES — gentle ink curves along the coast / river (the engraver's water
 * lines), riding the water band parallel to the shore.
 * @param {Ops} ops @param {Model} model @param {Rng} rng @param {string} ink
 * @param {number} wDress @param {number} oDress
 */
function pushRipples(ops, model, rng, ink, wDress, oDress) {
  const w = model.frame && model.frame.water;
  if (!w || !Array.isArray(w.path) || w.path.length < 2) return;
  const f = rng.fork('ripple');
  if (w.kind === 'coast') {
    const shoreY = w.path[0][1];                        // the coast band top (e.g. 840)
    let rr = 0;
    for (const dyOff of [22, 46]) {
      for (let x = 140; x <= VIEW - 140; x += 150) {
        const g = f.fork(`c:${rr++}`);
        const y0 = shoreY + dyOff + g.randInt(-4, 4);
        const x0 = x + g.randInt(-16, 16);
        const amp = 4 + g.randInt(0, 3);
        /** @type {Array<[number, number]>} */
        const pts = [
          [R(x0), R(y0)], [R(x0 + 22), R(y0 - amp)],
          [R(x0 + 44), R(y0)], [R(x0 + 66), R(y0 - amp)],
        ];
        if (pts.some(([qx, qy]) => !onMap(qx) || qy > VIEW - 4 || qy < 4)) continue;
        ops.push({ t: 'poly', pts, closed: false, stroke: ink, strokeOpacity: oDress, strokeWidth: wDress });
      }
    }
  } else {
    let rr = 0;
    for (let i = 0; i < w.path.length - 1; i++) {
      const ax = w.path[i][0], ay = w.path[i][1], bx = w.path[i + 1][0], by = w.path[i + 1][1];
      const dx = bx - ax, dy = by - ay;
      const mag = Math.sqrt(dx * dx + dy * dy) || 1;
      const ux = dx / mag, uy = dy / mag, px = -uy, py = ux;
      for (const tt of [0.35, 0.7]) {
        const g = f.fork(`r:${rr++}`);
        const mx = ax + dx * tt, my = ay + dy * tt;
        const amp = 5 + g.randInt(0, 3);
        const off = g.randInt(-10, 10);
        const c0x = mx + px * off, c0y = my + py * off;
        /** @type {Array<[number, number]>} */
        const pts = [
          [R(c0x - ux * 14), R(c0y - uy * 14)],
          [R(c0x + px * amp), R(c0y + py * amp)],
          [R(c0x + ux * 14), R(c0y + uy * 14)],
        ];
        if (pts.some(([qx, qy]) => !onMap(qx) || !onMap(qy))) continue;
        ops.push({ t: 'poly', pts, closed: false, stroke: ink, strokeOpacity: oDress, strokeWidth: wDress });
      }
    }
  }
}

/**
 * (4) MEADOW DOTTING — sparse stipple on the open ground, away from the built districts
 * and the water. Opaque ink dots (tone from density — the landform idiom). SEASON (IT-3):
 * WINTER swaps the dot for a SNOW FLECK (a short horizontal tick, distinct in PATTERN so the
 * accessible lens still reads it by shape); DROUGHT severity thins the field + swaps in a
 * parched CRACK; BOUNTIFUL / HARD_WINTER thicken the count. Absent season+severity ⇒ the
 * base round dots at the base density (byte-identical).
 * @param {Ops} ops @param {Model} model @param {Rng} rng @param {string} ink
 * @param {number|null} coastY
 * @param {'spring'|'summer'|'autumn'|'winter'|null} season
 * @param {'drought'|'hard_winter'|'bountiful'|null} severity
 * @param {number} wDress @param {number} oDress
 */
function pushMeadow(ops, model, rng, ink, coastY, season, severity, wDress, oDress) {
  const winter = season === 'winter';
  const drought = severity === 'drought';
  const chance = drought ? 0.22 : (severity === 'bountiful' || severity === 'hard_winter') ? 0.44 : 0.34;
  const centroids = (model.districts || []).map((d) => d.centroid);
  const f = rng.fork('meadow');
  let cell = 0;
  for (let gx = 150; gx <= VIEW - 150; gx += 150) {
    for (let gy = 150; gy <= VIEW - 150; gy += 150) {
      const g = f.fork(`m:${cell++}`);
      if (!g.chance(chance)) continue;
      const x = R(gx + g.randInt(-46, 46));
      const y = R(gy + g.randInt(-46, 46));
      if (coastY != null && y > coastY - 10) continue;
      let near = false;
      for (const c of centroids) {
        const ddx = x - c.x, ddy = y - c.y;
        if (ddx * ddx + ddy * ddy < 100 * 100) { near = true; break; }
      }
      if (near) continue;
      if (winter) {
        ops.push({ t: 'line', x1: R(x - 2), y1: y, x2: R(x + 2), y2: y, stroke: ink, strokeWidth: wDress, strokeOpacity: oDress });  // snow fleck
      } else if (drought) {
        ops.push({ t: 'line', x1: R(x - 2), y1: R(y - 2), x2: R(x + 2), y2: R(y + 2), stroke: ink, strokeWidth: wDress, strokeOpacity: oDress });  // parched crack
      } else {
        ops.push({ t: 'circle', cx: x, cy: y, r: 2, fill: ink });
      }
    }
  }
}

/**
 * (5) PATH-SIDE HEDGE TICKS — short perpendicular ink ticks along the skeleton lanes (the
 * enclosure-hedge idiom), on the OUTER stretch away from the centre.
 * @param {Ops} ops @param {Model} model @param {Rng} rng @param {string} ink
 * @param {number} wDress @param {number} oDress @param {number|null} coastY
 */
function pushHedges(ops, model, rng, ink, wDress, oDress, coastY) {
  const streets = (model.skeleton && model.skeleton.streets) || [];
  let si = 0;
  for (const st of streets) {
    const ax = st.from.x, ay = st.from.y, bx = st.to.x, by = st.to.y;
    const dx = bx - ax, dy = by - ay;
    const mag = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / mag, uy = dy / mag, px = -uy, py = ux;
    const f = rng.fork(`hedge:${si++}`);
    for (let k = 0; k < 3; k++) {
      const t = 0.45 + k * 0.18 + f.randFloat(-0.04, 0.04);
      const c0x = ax + dx * t, c0y = ay + dy * t;
      const side = (k % 2 === 0) ? 1 : -1;
      const inner = 4, len = 8;
      const x1 = R(c0x + px * inner * side), y1 = R(c0y + py * inner * side);
      const x2 = R(c0x + px * (inner + len) * side), y2 = R(c0y + py * (inner + len) * side);
      if (coastY != null && (y1 > coastY || y2 > coastY)) continue;
      if (!onMap(x1) || !onMap(x2) || !onMap(y1) || !onMap(y2)) continue;
      ops.push({ t: 'line', x1, y1, x2, y2, stroke: ink, strokeWidth: wDress, strokeOpacity: oDress });
    }
  }
}

/**
 * (6a) WALL SHADOWS — the fortification ring's drop shadow, cast to the SE by the ONE
 * fixed NW light (SHADOW_DIR, shared with the glyph hatch). A shadow line parallel to each
 * SE-FACING wall segment, offset outward-SE at the dress opacity — so the wall reads as
 * lifted off the ground, lit from the SAME side as the buildings. NW-facing segments face
 * the light and cast nothing. Absent walls ⇒ no shadows (v1 + v2 alike).
 * @param {Ops} ops @param {Model} model @param {string} ink @param {number} wDress @param {number} oDress
 */
function pushWallShadows(ops, model, ink, wDress, oDress) {
  const fort = model.fortifications;
  if (!fort || !Array.isArray(fort.walls) || fort.walls.length < 3) return;
  const walls = fort.walls;
  let cxs = 0, cys = 0;
  for (const p of walls) { cxs += p[0]; cys += p[1]; }
  const cx = cxs / walls.length, cy = cys / walls.length;   // ring centroid
  const off = 8;
  for (let i = 0; i < walls.length; i++) {
    const a = walls[i], b = walls[(i + 1) % walls.length];
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    // outward normal (points away from the ring centre)
    let nx = -(b[1] - a[1]), ny = (b[0] - a[0]);
    if ((mx - cx) * nx + (my - cy) * ny < 0) { nx = -nx; ny = -ny; }
    // only the SE-facing segments cast a ground shadow (normal agrees with the light fall)
    if (nx * SHADOW_UX + ny * SHADOW_UY <= 0) continue;
    const ox = SHADOW_UX * off, oy = SHADOW_UY * off;
    const x1 = R(a[0] + ox), y1 = R(a[1] + oy), x2 = R(b[0] + ox), y2 = R(b[1] + oy);
    if (!onMap(x1) || !onMap(x2) || !onMap(y1) || !onMap(y2)) continue;
    ops.push({ t: 'line', x1, y1, x2, y2, stroke: ink, strokeWidth: wDress, strokeOpacity: oDress });
  }
}

/**
 * (6b) LANDFORM RELIEF — NW-lit hachures on the v2 MOUNTAIN-FLANK crest (design §1/§2, the
 * v2 enrichment ON TOP of the base dress). Short downslope shadow strokes offset from the
 * crest curve by the ONE fixed NW light (SHADOW_DIR), at the dress opacity. v1 / marsh /
 * dune / plain models carry no such crest ⇒ no relief (the base dress already covers them).
 * @param {Ops} ops @param {Model} model @param {string} ink @param {number} wDress @param {number} oDress
 */
function pushRelief(ops, model, ink, wDress, oDress) {
  const landform = model.frame && model.frame.landform;
  if (!landform || landform.kind !== 'mountain-flank' || !Array.isArray(landform.marks)) return;
  let emitted = 0;
  for (const m of landform.marks) {
    if (emitted >= 8) break;
    if (m.m !== 'curve' || !Array.isArray(m.pts) || m.pts.length < 2) continue;
    for (let i = 0; i < m.pts.length && emitted < 8; i += 2) {   // every other crest point
      const px = m.pts[i][0], py = m.pts[i][1];
      const len = 12;
      const x1 = R(px + SHADOW_UX * 3), y1 = R(py + SHADOW_UY * 3);
      const x2 = R(px + SHADOW_UX * (3 + len)), y2 = R(py + SHADOW_UY * (3 + len));
      if (!onMap(x1) || !onMap(x2) || !onMap(y1) || !onMap(y2)) continue;
      ops.push({ t: 'line', x1, y1, x2, y2, stroke: ink, strokeWidth: wDress, strokeOpacity: oDress });
      emitted++;
    }
  }
}

/**
 * (7) STATE DRESS (IT3-b) — the town's LIVE condition, each mark gated on a read in `state`
 * (absent ⇒ zero ops ⇒ dormant, the dormancy law): a SIEGE WORKS ring of besieger palisade ticks
 * OUTSIDE the wall (or blocking the approach roads) when besieged; SCAR GRAIN crosshatch over the
 * built quarters when the urban-fabric mirror records scars (WHOLE-fabric, severity-scaled — the
 * read layer surfaces scars by severity, not per district); REBIRTH SCAFFOLD ticks on the
 * districts whose CLASS the mirror marks rebuilt (matched to district.category). All-ink, bounded,
 * NO trig (the domain purity scan bans it) — the ring rides the wall/road geometry, not cos/sin.
 * @param {Ops} ops @param {Model} model @param {Rng} rng @param {string} ink
 * @param {number} wDress @param {number} oDress @param {number|null} coastY @param {MapDressState} state
 */
function pushStateDress(ops, model, rng, ink, wDress, oDress, coastY, state) {
  /** on-map + not-into-the-sea guard for a segment.
   *  @param {number} x1 @param {number} y1 @param {number} x2 @param {number} y2 */
  const okSeg = (x1, y1, x2, y2) => onMap(x1) && onMap(x2) && onMap(y1) && onMap(y2)
    && (coastY == null || (y1 <= coastY && y2 <= coastY));

  // ── SIEGE WORKS RING — besieger palisade ticks encircling the town (design §3). Trig-free:
  //    ride the wall ring's OWN vertices (offset outward from the centroid) when walls exist,
  //    else block each APPROACH ROAD's outer end. Bounded.
  if (state.besieged) {
    const fort = model.fortifications;
    const walls = fort && Array.isArray(fort.walls) && fort.walls.length >= 3 ? fort.walls : null;
    if (walls) {
      let sx = 0, sy = 0;
      for (const p of walls) { sx += p[0]; sy += p[1]; }
      const cx = sx / walls.length, cy = sy / walls.length;   // ring centroid
      let placed = 0;
      for (let i = 0; i < walls.length && placed < 16; i++) {
        const a = walls[i], b = walls[(i + 1) % walls.length];
        const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
        let ox = mx - cx, oy = my - cy;                        // outward from the centre
        const om = Math.sqrt(ox * ox + oy * oy) || 1; ox /= om; oy /= om;
        const bx = mx + ox * 42, by = my + oy * 42;            // camp offset outside the wall
        const tx = -oy, ty = ox, len = 7;                      // tangent tick (the palisade line)
        const x1 = R(bx - tx * len), y1 = R(by - ty * len), x2 = R(bx + tx * len), y2 = R(by + ty * len);
        if (!okSeg(x1, y1, x2, y2)) continue;
        ops.push({ t: 'line', x1, y1, x2, y2, stroke: ink, strokeWidth: wDress, strokeOpacity: oDress });
        placed++;
      }
    } else {
      const roads = (model.frame && model.frame.roads) || [];
      let placed = 0;
      for (const road of roads) {
        if (placed >= 8) break;
        const fx = road.from[0], fy = road.from[1], tx0 = road.to[0], ty0 = road.to[1];
        const px = fx + (tx0 - fx) * 0.14, py = fy + (ty0 - fy) * 0.14;   // just in from the edge
        let dx = tx0 - fx, dy = ty0 - fy; const m = Math.sqrt(dx * dx + dy * dy) || 1; dx /= m; dy /= m;
        const nx = -dy, ny = dx, len = 8;                      // tick ACROSS the road (a blockade)
        const x1 = R(px - nx * len), y1 = R(py - ny * len), x2 = R(px + nx * len), y2 = R(py + ny * len);
        if (!okSeg(x1, y1, x2, y2)) continue;
        ops.push({ t: 'line', x1, y1, x2, y2, stroke: ink, strokeWidth: wDress, strokeOpacity: oDress });
        placed++;
      }
    }
  }

  // ── SCAR GRAIN — patched/damaged crosshatch over the built quarters, count from the worst
  //    scar severity (heavier scars ⇒ denser grain). Whole-fabric (not per district). Bounded.
  if (typeof state.scarLevel === 'number' && state.scarLevel > 0) {
    const districts = model.districts || [];
    const perDistrict = state.scarLevel >= 0.66 ? 2 : 1;
    const f = rng.fork('scar');
    let placed = 0;
    for (const d of districts) {
      if (placed >= 18) break;
      const g = f.fork(`d:${d.id}`);
      for (let k = 0; k < perDistrict && placed < 18; k++) {
        const cx = R(d.centroid.x + g.randInt(-14, 14)), cy = R(d.centroid.y + g.randInt(-14, 14));
        if (!onMap(cx, 6) || !onMap(cy, 6) || (coastY != null && cy > coastY)) continue;
        const x1 = R(cx - 4), y1 = R(cy - 4), x2 = R(cx + 4), y2 = R(cy + 4);  // a short damage tick
        ops.push({ t: 'line', x1, y1, x2, y2, stroke: ink, strokeWidth: wDress, strokeOpacity: oDress });
        placed++;
      }
    }
  }

  // ── REBIRTH SCAFFOLD — a small construction scaffold (two poles + a top brace) on each district
  //    whose CLASS the mirror marks rebuilt. Bounded to a handful of quarters.
  if (Array.isArray(state.rebuiltCategories) && state.rebuiltCategories.length > 0) {
    const rebuilt = new Set(state.rebuiltCategories);
    let placed = 0;
    for (const d of (model.districts || [])) {
      if (placed >= 6) break;
      if (!rebuilt.has(d.category)) continue;
      const cx = d.centroid.x, cy = d.centroid.y, h = 9;
      /** @type {Array<[number,number,number,number]>} */
      const poles = [
        [cx - 4, cy + 3, cx - 4, cy - h],       // left pole
        [cx + 4, cy + 3, cx + 4, cy - h],       // right pole
        [cx - 5, cy - h + 3, cx + 5, cy - h + 3], // top brace
      ];
      let any = false;
      for (const [ax, ay, bx, by] of poles) {
        const x1 = R(ax), y1 = R(ay), x2 = R(bx), y2 = R(by);
        if (!okSeg(x1, y1, x2, y2)) continue;
        ops.push({ t: 'line', x1, y1, x2, y2, stroke: ink, strokeWidth: wDress, strokeOpacity: oDress });
        any = true;
      }
      if (any) placed++;
    }
  }
}

/**
 * FESTIVAL DRESS (Wave C — DESIGN_TRADITIONS §10: "festival-week dress via the state-dress hook —
 * lanterns on the high street during the window"). Lantern dots strung along the town's HIGH STREET
 * (the single longest `model.skeleton.streets` segment — the principal thoroughfare, the pushHedges
 * spine) while an observance's window is open, the count rising with the festival's scale band (a
 * thorp rite hangs a few; a metropolis spectacle strings the whole street). Bounded low (≤ FEST_CAP,
 * inside the shared DRESS_CAP even stacked on the worst crisis-state dress), all-ink, deterministic
 * off the same season-aware stream; the marks are ADDED (never a parameter swap), so an ABSENT
 * festival ⇒ this is never called ⇒ byte-identical to the base — the dormancy law, exactly as
 * pushStateDress upholds it.
 * @param {Ops} ops @param {Model} model @param {Rng} rng @param {string} ink
 * @param {number|null} coastY @param {MapDressFestival} festival
 */
function pushFestivalDress(ops, model, rng, ink, coastY, festival) {
  const streets = (model.skeleton && model.skeleton.streets) || [];
  if (!streets.length) return;
  // The HIGH STREET = the longest thoroughfare (codepoint-free length compare, deterministic).
  let high = null; let bestLen = -1;
  for (const st of streets) {
    const dx = st.to.x - st.from.x, dy = st.to.y - st.from.y;
    const len = dx * dx + dy * dy;
    if (len > bestLen) { bestLen = len; high = st; }
  }
  if (!high) return;
  const scale = Number.isFinite(Number(festival.scale)) ? Math.max(0, Math.floor(Number(festival.scale))) : 0;
  const FEST_CAP = 8; // total lantern budget (≤ the shared DRESS_CAP headroom over the crisis stack)
  const count = Math.max(3, Math.min(FEST_CAP, 3 + scale)); // 3..8 lanterns by grandeur
  const ax = high.from.x, ay = high.from.y, dx = high.to.x - high.from.x, dy = high.to.y - high.from.y;
  const f = rng.fork('festival');
  for (let k = 0; k < count; k += 1) {
    const t = (k + 1) / (count + 1) + f.randFloat(-0.03, 0.03); // evenly strung, small jitter
    const cx = R(ax + dx * t), cy = R(ay + dy * t);
    if (!onMap(cx, 6) || !onMap(cy, 6) || (coastY != null && cy > coastY)) continue;
    ops.push({ t: 'circle', cx, cy, r: 1.8, fill: ink }); // a hung lantern (opaque, the meadow-fleck idiom)
  }
}

/**
 * Emit the ground-dress draw ops for a model under a style. PURE + deterministic. Returns
 * [] for any style that does not name the dress fields (the dormancy law) — so only the
 * illustrated lens dresses the ground, and every other lens is byte-identical.
 * SEASON + STATE (IT-3): the OPTIONAL third `dress` argument re-skins the marks for the
 * town's current portrait — season swaps parameters (winter snow / bare trees / muted
 * furrows; autumn harvest stubble; drought crack; density from severity), and state adds
 * bounded marks (siege ring / scar grain / rebirth scaffold). The season+severity are FOLDED
 * INTO THE SEED so winter and summer of the same town differ deterministically. ABSENT
 * (null/undefined) ⇒ no seed suffix + no variant branch + no state ⇒ byte-identical to the
 * seasonless base (the dormancy law at season strength — every existing 2-arg caller is
 * unmoved). PURE: `dress` is a plain resolved context (domain/townMap/mapDress.js reads the
 * settlement/worldState; this emitter never touches either — so the golden path, which passes
 * no dress, is structurally byte-identical regardless of a settlement's live state).
 * @param {import('./townMapModel.js').TownMapModel | null | undefined} model
 * @param {string | object} [styleArg]  a style id or a resolved style
 * @param {MapDress | null} [dress]  the season/state context; null ⇒ seasonless base bytes
 * @returns {import('./townMapDraw.js').DrawOp[]}
 */
export function groundDressOps(model, styleArg = DEFAULT_STYLE_ID, dress = null) {
  /** @type {import('./townMapDraw.js').DrawOp[]} */
  const ops = [];
  if (!model || typeof model !== 'object') return ops;
  const style = resolveTownMapStyle(styleArg);
  const oDress = style.opacity ? style.opacity.dress : undefined;
  const wDress = style.stroke ? style.stroke.dress : undefined;
  // DORMANCY (THE WALL): a lens that does not name the dress fields draws nothing ⇒ the
  // prior output is byte-identical (the five re-skins + the accessible lens never move).
  if (oDress == null || wDress == null) return ops;

  const ink = style.palette.ink;
  // SEASON CONTEXT — bounded reads off the optional dress; absent ⇒ null ⇒ seasonless.
  const liveSeason = dress && typeof dress.season === 'string' ? dress.season : null;
  // SKIN SEASON BIAS (IT-4): a bespoke skin may carry a default-season leaning (its "dress
  // character"). It is a FALLBACK ONLY — the live world clock (dress.season) always wins — and is
  // bounded to the four quarters. A base lens carries no seasonBias ⇒ null ⇒ byte-identical dormancy.
  const styleBias = (typeof style.seasonBias === 'string' && SEASON_BIAS.has(style.seasonBias)) ? style.seasonBias : null;
  const season = liveSeason || styleBias;
  const severity = dress && typeof dress.severity === 'string' ? dress.severity : null;
  const state = dress && dress.state && typeof dress.state === 'object' ? dress.state : null;
  const festival = dress && dress.festival && typeof dress.festival === 'object' ? dress.festival : null;
  // Fold season+severity into the seed so a town's winter texture differs from its summer;
  // an ABSENT season leaves the seed EXACTLY `ground-dress:<digest>` ⇒ byte-identical.
  const seasonKey = season ? `:${season}${severity ? ':' + severity : ''}` : '';
  const rng = createPRNG(`ground-dress:${geometryDigest(model)}${seasonKey}`);
  const water = (model.frame && model.frame.water) || null;
  const coastY = water && water.kind === 'coast' && Array.isArray(water.path) && water.path[0]
    ? water.path[0][1]
    : null;

  pushFurrows(ops, model, rng, ink, wDress, oDress, coastY, season);
  pushWoods(ops, model, rng, ink, wDress, oDress, coastY, season);
  pushRipples(ops, model, rng, ink, wDress, oDress);
  pushMeadow(ops, model, rng, ink, coastY, season, severity, wDress, oDress);
  pushHedges(ops, model, rng, ink, wDress, oDress, coastY);
  // IT2-b — depth under the ONE fixed NW light (shared with the glyph hatch): the wall
  // ring's SE drop shadow + the v2 mountain-flank relief hachures.
  pushWallShadows(ops, model, ink, wDress, oDress);
  pushRelief(ops, model, ink, wDress, oDress);
  // IT3-b — STATE DRESS: siege works ring / scar grain / rebirth scaffold, each gated on a read
  // in `state` (absent ⇒ zero ops ⇒ dormant). Seeded off the same season-aware stream.
  if (state) pushStateDress(ops, model, rng, ink, wDress, oDress, coastY, state);
  // Wave C — FESTIVAL DRESS: lanterns on the high street during an observance's window, gated on
  // a read in `festival` (absent ⇒ zero ops ⇒ dormant, byte-identical). Same season-aware stream.
  if (festival) pushFestivalDress(ops, model, rng, ink, coastY, festival);

  return ops;
}
