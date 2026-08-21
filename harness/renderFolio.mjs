/**
 * harness/renderFolio.mjs — THE SURVEYOR'S FOLIO LENS, as a LANE HARNESS.
 *
 * ⚠ THIS IS NOT LAND-READY SRC. The ten-role lens architecture is MF-4, which belongs to
 * train `mf-c`, not to this lane. This file exists so the foundation trains' geometry can
 * be SEEN and judged against the §157 reference corpus. A landing executor takes the
 * geometry, not this file.
 *
 * ⭐⭐⭐ THE INK PASS (chair directive, ODQ §179 — TARGET ZERO). The owner's verdict on the
 * MF-B1 exemplars was "not even remotely close", and the chair's diagnosis was exact: THE
 * B1 RENDER WAS A FLAT-COLOUR PARCEL MOSAIC IN THE RIGHT PALETTE, AND THE REFERENCES ARE
 * INK DRAWINGS. Everything below follows from taking §9.1 literally.
 *
 * THE FOUR THINGS THAT WERE ACTUALLY WRONG, each measured against hf30 at matched scale:
 *
 *  1 INK WEIGHT WAS AN ORDER OUT. A building outline ran 0.40 view units on a ~7-unit
 *    house — 1:18 — and rendered sub-pixel at 1000px, so the fabric read as flat colour
 *    with no drawn edge at all. hf30 runs about 1:12 with a HARD dark line. The ink scale
 *    below is therefore expressed IN PLOT FRONTAGES, not in view units: the module the
 *    town was laid out in is the module its ink is drawn in, so the hierarchy survives
 *    every tier automatically instead of being right at one and wrong at the rest.
 *  2 THERE WAS NO STREET, BECAUSE THERE WAS NO BLOCK. The whole umbrella was flooded in the
 *    road tone and the buildings floated in it, so a "street" was the same colour as the
 *    ground under the houses and could not read as a channel. Now the BLOCK carries its own
 *    ground and the street is the paper BETWEEN blocks — negative space, exactly as §2.1
 *    requires, and legible for the first time because the two sides differ in value.
 *  3 THE HATCHING VOCABULARIES WERE MISSING ENTIRELY. Furrows existed; rock, hachure, water
 *    and reed did not, so the §5.-1 substrate — which every placement decision already
 *    obeyed — reached the paint nowhere. They are LINES here, never fills (§9.5b).
 *  4 THE GROUND WAS A FLAT RECTANGLE OF ONE COLOUR. Real leaves are mottled. The aged
 *    ground below is FLAT WASH PATCHES at low contrast — era-legal by construction, since
 *    a gradient or a filter would be a §9.2 violation and this is neither.
 *
 * ⭐⭐ AND THE OP BUDGET IS PAID FOR BY BATCHING COLOUR, NOT BY CUTTING INK. Ink is where
 * the ops go, so the ink pass had to come first and the budget had to be found elsewhere.
 * Every family of marks that shares a style is emitted as ONE `<path>` carrying many
 * subpaths — identical pixels, one DOM node instead of hundreds. The one place that costs
 * anything is the fabric's per-building tone jitter, which is QUANTIZED to a small number
 * of steps so the buildings can batch by bucket; the step is finer than the eye resolves at
 * plan scale and the saving is an order of magnitude. Both counts are reported, because
 * they are different quantities and TC29 convicted conflating them.
 */

import { polyPath, linePath, r2, cosI, sinI, TRIG_N, centroid, widestAxis, absArea }
  from '../src/domain/townMap/fabric/fabricGeometry.js';
import { hashUnit } from '../src/domain/townMap/fabric/fabricRng.js';
import { resolveLens, lensAllows, HATCH } from '../src/domain/townMap/fabric/folioLenses.js';
import { scaleBarFor } from '../src/domain/townMap/fabric/measure.js';
import { letteringFragment, spliceLettering } from '../src/domain/townMap/fabric/lettering.js';
import { circuitDrawnRuns } from '../src/domain/townMap/fabric/wallCircuit.js';

/** THE TEN ROLES, in the warm folio palette (§9.7 as amended).
 * ⭐ ROOFS ARE MUCH DARKER THAN MF-B1's. The binding sub-law says roads are the palest role
 * and roofs sit at least three value steps darker; B1 honoured the ORDER but not the
 * DISTANCE, mixing roofs at 0.90 over cream so the fabric came out a pale tan barely
 * separated from the street. hf30's buildings are a mid-brown against cream paper — the
 * contrast IS the drawing. */
export const FOLIO = {
  paper: '#E9DEC3',      // aged cream leaf
  ink: '#2B2118',        // dark sepia-black
  roofs: '#8A5F3A',      // mid earth-brown — many value steps below the street
  water: '#7E8E97',
  greens: '#9FA47A',     // muted olive countryside
  roads: '#F3EBD6',      // THE PALEST ROLE ON THE PAGE
  walls: '#241B12',
  trees: '#61704A',
  labels: '#3E2C18',
  elements: '#EFE5CC',
};

/**
 * THE INK SCALE — the ONLY place a stroke width is chosen (§9.1), and every entry is a
 * MULTIPLE OF THE PLOT FRONTAGE rather than a view-unit constant. See note 1 in the header.
 * The ladder is the §9.1 hierarchy verbatim: wall → landmark silhouette → street-fronting
 * fabric edge → field boundary.
 */
/**
 * ⭐⭐⭐ THE OP CEILING IS PER TIER, AND THE RAISE IS OWNER-GRANTED, MEASURED AND PINNED
 * (ODQ §217, chair-relayed: the map budgets may rise "where necessary to reach the full
 * ambition", efficiency tried FIRST, the new figure recorded and ratcheted).
 *
 * ⛔ WHY ONE NUMBER COULD NOT HOLD. The landed ration was a single 2,200 for every leaf, and
 * MF-S1 measured the corpus's grain at ×1.7–×5.4 above what b6 drew. Closing that is not a
 * style change: a town at the measured T-01 grain carries ~1,000 holdings and a metropolis
 * ~2,850, each with a street range, a back range and a drawn plot boundary. A single ceiling
 * set for a thorp's 900 marks cannot also describe a metropolis's fabric, and the honest
 * consequence of keeping it would have been the atlas's own BANNED PRIOR #4 — "empty blocks /
 * block-wash LOD", hf25's rendering failure, which destroys the study layer at glance range.
 *
 * ⭐ EFFICIENCY WAS TRIED FIRST AND IS MEASURED SPENT. Two levers exist and both were run:
 *   · the LOD merge, re-opened at metropolis (radius 0.44 → 0.34, MASS_CAP 4 → 6) with the
 *     masses now carrying their members' plot lines so nothing is hollowed —
 *     **9,403 → 9,345, a saving of 0.6%**, at the cost of 93 city parcels. Reverted; the
 *     reason is that the ground law's mass pre-pass un-merges most of it (see LOD_RUNG).
 *   · style batching, which is already total: every family of marks that shares a style is
 *     ONE DOM node, and the element count is an order below the primitive count.
 *
 * THE FIGURES BELOW ARE THE MEASURED MAXIMUM OVER ALL SIXTEEN LEAVES × ALL SIX LENSES,
 * ROUNDED UP TO THE NEXT HUNDRED — a ratchet, not an allowance:
 *   thorp 927 → 1,000 · hamlet 1,046 → 1,100 · village 1,697 → 1,800 ·
 *   town 4,385 → 4,600 · city 6,151 → 6,400 · metropolis 9,403 → 9,700
 * ⚠⚠ AND THE FIRST SETTING WAS TOO TIGHT FOR A REASON WORTH RECORDING: two mid-pass rations
 * (the Accessible hatch, the roof-ridge ticks) SPEND AGAINST THE CEILING, so raising it
 * raises the measured maximum. MEASURED: pinning at the pre-raise maxima put the metropolis
 * at 9,491 against a 9,500 pin — nine primitives of margin, i.e. a ratchet that would red on
 * a rounding change. ⭐ THE CLASS: **A CEILING THAT ITS OWN CONSUMERS RATION AGAINST HAS A
 * FIXED POINT, AND THE PIN BELONGS AT THE FIXED POINT, NOT AT THE MEASUREMENT THAT PRECEDED
 * IT.** The figures above are the settled maxima, re-measured after the raise.
 * ⚠ RENDER COST AT THE NEW FIGURE, MEASURED: all six lenses of a metropolis render in
 * ~270 ms total (~45 ms a leaf), against ~90 ms at the old ceiling. The SVG is bigger; the
 * render is not slow.
 * ⚠ THE CEILING IS A RATCHET AND IT ONLY SHRINKS. A later lane that needs more must raise it
 * the same way: measure, record the cause, and move the pinned figure — never spend headroom.
 *
 * ⭐⭐ MF-W1b · **HAMLET 1,100 → 1,200, RAISED UNDER §217 WITH ITS CAUSE.** §5 W1's substrate
 * lands three new mark sources on this leaf — the relief ration re-ordered steepest-first
 * (MF-W1(SUBSTRATE)), the `buildable` refusal freeing ground the ploughland used to cover, and
 * the resource cure lifting `hamlet`'s relief 0.154 → 0.327 because it carries `iron_deposits`.
 * MEASURED at the old pin: **1,117 against 1,100**, i.e. 6 of 96 renders over, all of them this
 * one leaf across its six lenses.
 * ⚠ AND THE RAISE IS MEASURED AT THE FIXED POINT, NOT AT THE PRE-RAISE MAXIMUM — the caveat
 * three paragraphs up, applied to itself: two mid-pass rations SPEND against the ceiling, so
 * the maximum moves when the ceiling does. 1,200 is the next hundred above the settled
 * maximum re-measured after the raise, which is the same rule every other row was set by.
 * ⛔ NO HEADROOM WAS SPENT AND NOTHING WAS TUNED TO FIT: `MARK_BUDGET` is a tuning-signature
 * value and an owner carve-out, and MF-W1(SUBSTRATE)'s J-W1S-4 refused to touch it. This lane
 * refuses it too and moves the pin instead, which is what §217's own sentence above asks for.
 */
export const OP_CEILING_BY_TIER = Object.freeze({
  thorp: 1000, hamlet: 1200, village: 1800, town: 4600, city: 6400, metropolis: 9700,
});
/** The ceiling a leaf is priced against. */
export function opCeilingFor(tier) {
  return OP_CEILING_BY_TIER[tier] == null ? OP_CEILING_BY_TIER.town : OP_CEILING_BY_TIER[tier];
}
/** The legacy single figure, kept ONLY as the floor of the ladder so nothing reads a raise
 * where the tier has none. */
export const OP_CEILING = 2200;

/**
 * ⚠ THE TAIL RESERVE IS MEASURED, NOT GUESSED. Two mid-pass rations (the accessible hatch at
 * stage 11c, the roof-ridge ticks at stage 12) have to know what the REST of the pass costs
 * before they can spend: the landmarks' interior lines, the terraces, the bridges, the wall
 * and its gatehouses, the §10 state marks, the §18.1 precinct bounds, the chrome, the legend
 * and the §173 letters. MEASURED on the densest leaf in the corpus at ~430 primitives.
 * ⭐ THE CLASS: a mid-pass budget must reserve THE REST OF THE PASS, and "the rest of the
 * pass" is a number somebody has to measure. Reserving 120 put the coastal city's accessible
 * leaf 78 ops OVER the ceiling.
 */
const TAIL_RESERVE = 440;

/**
 * ⭐⭐⭐ THE WEIGHT LADDER IS THE §2.3.2 MEASURED TABLE (MF-S1), NOT A SET OF PREFERENCES.
 *
 * MF-S1 measured stroke widths on twelve reference plates normalised to a 5056 px leaf and
 * found the corpus's ratio p90/p25 = 2.8–5.7 (median 3.55), distributed as — with the
 * STREET-FRONTING BUILDING EDGE as the reference weight 1.0 —
 *   wall circuit 4.0–5.0 · landmark silhouette 2.5–3.5 · BLOCK SILHOUETTE 2.0 ·
 *   fronting edge 1.0 · INTERIOR PARTY WALL 0.5 · PLOT-BOUNDARY TICK 0.4–0.6 ·
 *   field boundary 0.25–0.4 · ghost register 0.38 dashed
 * ★ "A uniform-weight map is the conviction restated. The corpus never has fewer than five
 * distinct weights on one leaf." Table B graded b6 ⛔ MISSES on exactly this: the `fabric`
 * group carried ONE stroke-width for every building on the leaf.
 *
 * ⛔ THREE RUNGS WERE WRONG OR ABSENT AND THE BLOCK ONE WAS BACKWARDS. `block` sat at 0.78×
 * the fabric weight — LIGHTER than the buildings it is supposed to gather — so the block
 * silhouette could not have read even if it had been drawn. `party` and `plotTick` did not
 * exist at all, which is why every building on a b7 leaf carried the same outline and a
 * terrace read as one blob rather than as a row of holdings.
 */
const INK_SCALE = Object.freeze({
  wall: 0.55, wallOld: 0.26, gate: 0.62, tower: 0.15,
  landmark: 0.32, landmarkMinor: 0.10,
  // ⭐ 2.0× THE FRONTING EDGE (§2.3.2, hf40's native crop measured at exactly 2×).
  block: 0.230, fabric: 0.115,
  // ⭐ 0.5× — the interior unit division inside a mass. hf40 and hf50 native crops.
  party: 0.058,
  // ⭐ 0.4–0.6× — the plot-boundary tick. hf35, hf56 native crops.
  plotTick: 0.052,
  yard: 0.055, detail: 0.055,
  road: 0.06, river: 0.13, field: 0.045, furrow: 0.035,
  hachure: 0.055, crag: 0.06, terrace: 0.05, form: 0.038, water: 0.05,
});

/** Absolute floors and ceilings in view units. A thorp's frontage is ~26 units and a
 * metropolis's ~4.5, so an unclamped multiple would draw a thorp in fenceposts and a
 * metropolis in hairlines. The clamp is what keeps the DRAWING legible while the HIERARCHY
 * stays proportional. */
const INK_CLAMP = Object.freeze({
  wall: [1.8, 4.6], gate: [2.4, 5.8], tower: [0.8, 2.2],
  landmark: [1.05, 2.9], landmarkMinor: [0.4, 1.0],
  // ⚠ THE BLOCK'S CLAMP OPENS ABOVE THE FABRIC'S, because the LADDER is the point: a ceiling
  // that caught the block at the fabric's own ceiling would restore the uniform weight at
  // exactly the coarse tiers where the ladder is easiest to see.
  block: [1.05, 2.9], fabric: [0.62, 1.5],
  // ⚠ AND THE TWO FINE RUNGS HAVE THEIR OWN FLOORS, LOWER THAN `detail`'s. At the T-01 grain
  // a town's frontage is ~4.5 view units, so a 0.5× party wall is 0.26 — under `detail`'s
  // 0.30 floor, which would have silently flattened party and fabric into one weight at the
  // very tier the two-tier stroke exists for. ⭐ THE CLASS: a shared clamp is a shared
  // ceiling, and a ladder whose rungs share a clamp is not a ladder.
  party: [0.22, 0.78], plotTick: [0.20, 0.72],
  yard: [0.3, 0.75], detail: [0.3, 0.8],
  road: [0.35, 1.0], river: [0.7, 2.0], field: [0.26, 0.7], furrow: [0.2, 0.5],
  hachure: [0.3, 0.85], crag: [0.34, 0.9], terrace: [0.3, 0.8], form: [0.22, 0.6],
  water: [0.3, 0.8],
});

function inkScale(frontage, weight = 1) {
  /** @type {Record<string, number>} */ const out = {};
  for (const k of Object.keys(INK_SCALE)) {
    const raw = frontage * INK_SCALE[k];
    const c = INK_CLAMP[k] || INK_CLAMP[k === 'wallOld' ? 'wall' : 'fabric'];
    // ⭐ THE LENS'S `ink` IS A WEIGHT MULTIPLIER, NOT A COLOUR (folioLenses.js's own note:
    // §9.1 owns lineweight and §2.5 owns hue). It multiplies the RAW multiple and the clamp
    // still bites afterwards, so a heavy lens can reach the ceiling but never past it —
    // which is the ration law applied to ink instead of to accents.
    out[k] = Math.round(Math.max(c[0], Math.min(c[1], raw * weight)) * 100) / 100;
  }
  out.wallOld = Math.round(out.wall * 0.62 * 100) / 100;
  return out;
}

const hex2rgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const rgb2hex = (r, g, b) => '#' + [r, g, b].map((v) => {
  const c = Math.max(0, Math.min(255, Math.round(v)));
  return (c < 16 ? '0' : '') + c.toString(16);
}).join('');
/** Composite fg over bg at alpha a — returns a FLAT OPAQUE hex (§9.2). */
const mix = (bg, fg, a) => {
  const B = hex2rgb(bg), F = hex2rgb(fg);
  return rgb2hex(B[0] + (F[0] - B[0]) * a, B[1] + (F[1] - B[1]) * a, B[2] + (F[2] - B[2]) * a);
};
const shade = (hex, d) => {
  const c = hex2rgb(hex);
  const t = d > 0 ? 255 : 0, a = d < 0 ? -d : d;
  return rgb2hex(c[0] + (t - c[0]) * a, c[1] + (t - c[1]) * a, c[2] + (t - c[2]) * a);
};
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const rect = (cx, cy, w, h, a) => {
  const c = cosI(a), s = sinI(a);
  return [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]]
    .map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c]);
};
/**
 * ⭐ THE DITCH FOLLOWS THE WALL'S RUNS. The ditch is a closed offset ring; the wall is a set
 * of OPEN runs broken at the gates. Walking the ditch and keeping only the stations whose
 * nearest point on the circuit lies inside a run gives a ditch that starts and stops with the
 * stones — which is what a ditch is, and closes the §195.2 guide-leak finding.
 */
function alignRuns(ditch, runs, circuit) {
  const inRun = (x, y) => {
    let bestD = Infinity, hit = false;
    for (const r of runs) {
      for (let i = 0; i + 1 < r.length; i++) {
        const d = segDist(x, y, r[i][0], r[i][1], r[i + 1][0], r[i + 1][1]);
        if (d < bestD) { bestD = d; hit = true; }
      }
    }
    if (!hit) return false;
    let circD = Infinity;
    for (let i = 0; i < circuit.length; i++) {
      const a = circuit[i], b = circuit[(i + 1) % circuit.length];
      const d = segDist(x, y, a[0], a[1], b[0], b[1]);
      if (d < circD) circD = d;
    }
    // The station belongs to a run when the nearest RUN is (near enough) the nearest CIRCUIT.
    return bestD <= circD + 1e-6 + Math.max(2, bestD * 0.08);
  };
  const out = []; let cur = [];
  for (const p of ditch) {
    if (inRun(p[0], p[1])) cur.push(p);
    else { if (cur.length > 1) out.push(cur); cur = []; }
  }
  if (cur.length > 1) out.push(cur);
  return out;
}
function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy;
  let t = L > 0 ? ((px - ax) * dx + (py - ay) * dy) / L : 0;
  if (t < 0) t = 0; else if (t > 1) t = 1;
  return Math.sqrt((px - ax - dx * t) ** 2 + (py - ay - dy * t) ** 2);
}

/**
 * ⭐ §12.4 THE CHARGE GLYPHS — eight marks, all NATURAL OR OCCUPATIONAL. Each is a few
 * strokes in the same ink as the rest of the leaf: an escutcheon on a surveyor's plate is
 * drawn, not painted, and it is the same hand. See immersion.CHARGES for why the vocabulary
 * excludes every faith and culture mark by construction.
 */
function chargeGlyph(kind, x, y, s) {
  switch (kind) {
    case 'wave':
      return `M${r2(x - s)} ${r2(y)}q${r2(s * 0.5)} ${r2(-s * 0.6)} ${r2(s)} 0q${r2(s * 0.5)} ${r2(s * 0.6)} ${r2(s)} 0`;
    case 'peak':
      return `M${r2(x - s)} ${r2(y + s * 0.7)}L${r2(x)} ${r2(y - s * 0.8)}L${r2(x + s)} ${r2(y + s * 0.7)}`;
    case 'sheaf':
      return `M${r2(x)} ${r2(y - s)}L${r2(x)} ${r2(y + s)}M${r2(x - s * 0.55)} ${r2(y - s * 0.8)}L${r2(x - s * 0.3)} ${r2(y + s)}`
        + `M${r2(x + s * 0.55)} ${r2(y - s * 0.8)}L${r2(x + s * 0.3)} ${r2(y + s)}M${r2(x - s * 0.6)} ${r2(y + s * 0.3)}L${r2(x + s * 0.6)} ${r2(y + s * 0.3)}`;
    case 'fish':
      return `M${r2(x - s)} ${r2(y)}q${r2(s * 0.7)} ${r2(-s * 0.7)} ${r2(s * 1.4)} 0q${r2(-s * 0.7)} ${r2(s * 0.7)} ${r2(-s * 1.4)} 0`
        + `M${r2(x + s * 0.4)} ${r2(y)}L${r2(x + s)} ${r2(y - s * 0.5)}M${r2(x + s * 0.4)} ${r2(y)}L${r2(x + s)} ${r2(y + s * 0.5)}`;
    case 'wheel':
      return `M${r2(x - s)} ${r2(y)}a${r2(s)} ${r2(s)} 0 1 0 ${r2(s * 2)} 0a${r2(s)} ${r2(s)} 0 1 0 ${r2(-s * 2)} 0`
        + `M${r2(x - s)} ${r2(y)}L${r2(x + s)} ${r2(y)}M${r2(x)} ${r2(y - s)}L${r2(x)} ${r2(y + s)}`;
    case 'pick':
      return `M${r2(x - s)} ${r2(y - s * 0.5)}q${r2(s)} ${r2(-s * 0.6)} ${r2(s * 2)} 0M${r2(x)} ${r2(y - s * 0.7)}L${r2(x)} ${r2(y + s)}`;
    case 'tree':
      return `M${r2(x)} ${r2(y + s)}L${r2(x)} ${r2(y - s * 0.2)}`
        + `M${r2(x - s * 0.7)} ${r2(y - s * 0.2)}a${r2(s * 0.7)} ${r2(s * 0.7)} 0 1 0 ${r2(s * 1.4)} 0a${r2(s * 0.7)} ${r2(s * 0.7)} 0 1 0 ${r2(-s * 1.4)} 0`;
    case 'tower':
    default:
      return `M${r2(x - s * 0.6)} ${r2(y + s)}L${r2(x - s * 0.6)} ${r2(y - s * 0.6)}L${r2(x - s * 0.2)} ${r2(y - s * 0.6)}`
        + `L${r2(x - s * 0.2)} ${r2(y - s)}L${r2(x + s * 0.2)} ${r2(y - s)}L${r2(x + s * 0.2)} ${r2(y - s * 0.6)}`
        + `L${r2(x + s * 0.6)} ${r2(y - s * 0.6)}L${r2(x + s * 0.6)} ${r2(y + s)}Z`;
  }
}

/**
 * ⭐ THE LETTERING RESERVE — what §173's splice will need, priced BEFORE the legend spends.
 * It counts the same things the splice counts (a glyph per character of every ward name that
 * survives the ration, two ops a marginal note, one an event caption), so the two can never
 * disagree about the cost of the same page.
 */
function estimateLetteringOps(fabric, m, LENS) {
  let n = 0;
  if (m.wardLabels) {
    const cands = fabric.umbrella.partition
      .map((p) => ({ p, org: fabric.organisms.find((o) => o.key === p.organismKey) }))
      .filter((r) => r.org && r.org.name)
      .sort((a, b) => b.p.area - a.p.area);
    const kept = [];
    for (const c of cands) {
      let clash = false;
      for (const k of kept) {
        const dx = k.p.centroid[0] - c.p.centroid[0], dy = k.p.centroid[1] - c.p.centroid[1];
        if (Math.sqrt(dx * dx + dy * dy) < 150) { clash = true; break; }
      }
      if (!clash) kept.push(c);
      if (kept.length >= 4) break;
    }
    for (const c of kept) n += String(c.org.name).length;
  }
  if (fabric.immersion) {
    if (lensAllows(LENS.id, 'marginalia')) n += fabric.immersion.notes.notes.length * 2;
    n += fabric.immersion.eventMarks.marks.length;
    n += fabric.immersion.neighbours.edges.length * 2;
  }
  return n;
}

/** A short stroke centred on (x,y) along (dx,dy). The hatching primitive. */
const tick = (x, y, dx, dy, len) =>
  `M${r2(x - dx * len * 0.5)} ${r2(y - dy * len * 0.5)}L${r2(x + dx * len * 0.5)} ${r2(y + dy * len * 0.5)}`;

/**
 * ⭐ THE BATCH — the whole op budget in fifteen lines. Marks that share a style accumulate
 * into ONE path element. `d` grows, the element count does not. This is a DOM-node saving
 * with byte-identical pixels; it is NOT a level of detail and it does not drop a single
 * drawn shape, which is why the receipt reports it separately from the primitive count.
 */
function batcher(out, push, prims) {
  /** @type {Map<string, string[]>} */ const buckets = new Map();
  /** @type {string[]} */ const order = [];
  return {
    add(style, d) {
      if (!d) return;
      prims.n++;
      if (!buckets.has(style)) { buckets.set(style, []); order.push(style); }
      buckets.get(style).push(d);
    },
    flush(id) {
      if (!order.length) return;
      if (id) out.push(`<g id="${id}">`);
      for (const style of order) push(`<path d="${buckets.get(style).join('')}" ${style}/>`);
      if (id) out.push('</g>');
      buckets.clear(); order.length = 0;
    },
  };
}

/** §6 SHAPE ARCHETYPES, expressed as COMPONENT ARRANGEMENTS (§165.1 / §174.2 — the
 * variant selects an arrangement of the SAME parts; it never mints a new glyph kind). */
function archetypeShape(lm) {
  const s = lm.size, x = lm.x, y = lm.y, a = lm.rot, v = lm.variant || 0;
  switch (lm.archetype) {
    case 'worship': {
      const nave = rect(x, y, s * 0.72, s * 2.05, a);
      const parts = [nave];
      if (v === 0) parts.push(rect(x, y - s * 0.30, s * 1.75, s * 0.66, a));         // cruciform
      if (v === 1) parts.push(rect(x, y - s * 0.95, s * 0.62, s * 0.62, a));         // west tower
      if (v >= 2) { parts.push(rect(x, y + s * 0.92, s * 0.5, s * 0.36, a)); parts.push(rect(x + s * 0.6, y, s * 0.5, s * 0.8, a)); }
      return { solids: parts, voids: [], marks: [{ kind: 'ridge', poly: nave }, { kind: 'bays', poly: nave, n: 5 }] };
    }
    case 'cloister': case 'cloisterQuad': {
      const outer = rect(x, y, s * 1.9, s * 1.7, a);
      return { solids: [outer], voids: [rect(x, y, s * 1.0, s * 0.85, a)], marks: [{ kind: 'bays', poly: outer, n: 6 }] };
    }
    case 'hall': {
      const hall = rect(x, y, s * 2.1, s * 1.15, a);
      const parts = [hall];
      if (v % 2 === 0) parts.push(rect(x, y + s * 0.72, s * 0.85, s * 0.35, a));
      else parts.push(rect(x - s * 0.9, y, s * 0.5, s * 1.5, a));
      return { solids: parts, voids: [], marks: [{ kind: 'ridge', poly: hall }, { kind: 'bays', poly: hall, n: 4 }] };
    }
    case 'garrison': {
      const block = rect(x - s * 0.5, y, s * 1.15, s * 1.6, a);
      return { solids: [block], voids: [], marks: [{ kind: 'yard', poly: rect(x + s * 0.75, y, s * 1.25, s * 1.6, a) }, { kind: 'ridge', poly: block }] };
    }
    case 'market': {
      const solids = [];
      const n = 4 + (v % 3);
      for (let i = 0; i < n; i++) solids.push(rect(x + (i - (n - 1) / 2) * s * 0.46, y + (i % 2 ? s * 0.22 : -s * 0.22), s * 0.32, s * 0.72, a));
      return { solids, voids: [], marks: [] };
    }
    case 'warehouse': case 'granary': {
      const b = rect(x, y, s * (lm.archetype === 'granary' ? 1.3 : 0.9), s * (lm.archetype === 'granary' ? 1.5 : 2.3), a);
      return { solids: [b], voids: [], marks: [{ kind: 'ridge', poly: b }, { kind: 'bays', poly: b, n: 4 }] };
    }
    case 'port': {
      const solids = [];
      const piers = 2 + lm.rung;                                     // §161n: MORE piers, not bigger ones
      for (let i = 0; i < piers; i++) solids.push(rect(x + (i - (piers - 1) / 2) * s * 0.62, y, s * 0.24, s * 2.2, a));
      return { solids, voids: [], marks: [] };
    }
    case 'mill': {
      const b = rect(x, y, s * 1.15, s * 1.15, a);
      return { solids: [b], voids: [], marks: [{ kind: 'wheel', x: x + s * 0.78, y, r: s * 0.42 }, { kind: 'ridge', poly: b }] };
    }
    case 'hospitality': {
      const inn = rect(x, y, s * 1.5, s * 0.95, a);
      return { solids: [inn], voids: [], marks: [{ kind: 'ridge', poly: inn }, { kind: 'yard', poly: rect(x, y + s * 0.85, s * 1.1, s * 0.55, a) }] };
    }
    case 'noxious': {
      const b = rect(x, y, s * 0.95, s * 0.9, a);
      const marks = [];
      for (let i = 0; i < 4; i++) marks.push({ kind: 'pit', x: x + (i % 2 ? s * 0.62 : -s * 0.62), y: y + (i < 2 ? -s * 0.5 : s * 0.62), r: s * 0.20 });
      return { solids: [b], voids: [], marks };
    }
    case 'extraction': case 'kiln': {
      const b = rect(x, y, s * 1.0, s * 0.9, a);
      return { solids: [b], voids: [], marks: [{ kind: 'pit', x: x + s * 0.9, y, r: s * 0.4 }] };
    }
    case 'arcane': {
      return { solids: [rect(x, y, s * 0.8, s * 0.8, a)], voids: [], marks: [{ kind: 'wheel', x, y, r: s * 0.5 }] };
    }
    case 'water': return { solids: [], voids: [], marks: [{ kind: 'well', x, y, r: s * 0.42 }] };
    case 'wallwork': return { solids: [rect(x, y, s * 0.8, s * 0.8, a)], voids: [], marks: [] };
    case 'playhouse': case 'caravan': case 'waystation': case 'fairground': {
      const b = rect(x, y, s * 1.25, s * 1.0, a);
      return { solids: [b], voids: [], marks: [{ kind: 'yard', poly: rect(x, y + s * 0.9, s * 1.4, s * 0.7, a) }] };
    }
    default: {
      const b = rect(x, y, s * 1.15, s * 0.95, a);
      return { solids: [b], voids: [], marks: [] };
    }
  }
}

/**
 * THE DRESSED GROUND (§2.2) — rebuilt for MF-B1b, and the rebuild was an OP fix and an ART
 * fix at once. MF-B1 walked every segment of every (chaikin-smoothed, several-hundred-point)
 * road and water line and emitted three ranks of quads either side of each: 1,100–1,900
 * slivers per leaf, over half the whole element budget, and visually a fan of rays from
 * every junction — the reference generators' own "radial sunburst fields" defect, which the
 * §157 standing critique orders OVERRIDDEN.
 *
 * The cure is to stop treating the lane as a spine. Real strip fields are FURLONGS: a
 * bundle of parallel strips inside a bounded block of ground, and the blocks meet at
 * hedgerows at whatever angles the ground dictated. So the countryside is laid out as a
 * seeded scatter of FURLONG BLOCKS — each an irregular quad with its own ploughing angle —
 * culled against the town, the water and the frame. An order of magnitude fewer shapes,
 * each large enough to carry a hedge line and a furrow bundle, and no rays.
 */
function dressGround(fabric, rngKey, sample) {
  const { umbrella, meta, water } = fabric;
  /** @type {Array<{poly:number[][], tone:number, ang:number, furrow:boolean}>} */ const fields = [];
  /** @type {Array<{x:number,y:number,r:number}>} */ const trees = [];

  const inWater = (x, y) => {
    if (water.body && water.body.length > 2) return insideAny([water.body], x, y);
    return false;
  };
  const centre = meta.centre || { x: 500, y: 500 };
  // A coarse lattice of furlong blocks, each jittered off the lattice so the patchwork
  // reads as ownership rather than as graph paper.
  const N = 11;
  const step = 1000 / N;
  for (let j = -1; j <= N; j++) {
    for (let i = -1; i <= N; i++) {
      const k = `${rngKey}|furlong|${i}|${j}`;
      const cx = (i + 0.5) * step + (hashUnit(`${k}|x`) - 0.5) * step * 0.55;
      const cy = (j + 0.5) * step + (hashUnit(`${k}|y`) - 0.5) * step * 0.55;
      if (cx < -60 || cy < -60 || cx > 1060 || cy > 1060) continue;
      if (insideAny(umbrella.components, cx, cy)) continue;
      if (inWater(cx, cy)) continue;
      // ⛔⛔ FIELDS GO WHERE TILLAGE IS POSSIBLE, AND NOWHERE ELSE. Carpeting the whole leaf
      // in field quads was the second-worst thing on the page after the missing ink: a
      // MOUNTAIN village came back ploughed to the frame edge on 0.66 relief, which is a
      // §161a incoherence drawn at full size, and it buried the relief marks that were
      // supposed to be telling the reader it was a mountain. §2.2's dressed ground means the
      // map never floats on empty paper — it does NOT mean every acre is arable. Steep is
      // pasture or waste, wet is marsh, and both carry their own marks from the relief pass.
      const slope = sample.slope(cx, cy);
      const wet = sample.wet(cx, cy);
      if (slope > 0.28 || wet > 0.52) continue;
      // ⭐ AND THEY THIN WITH DISTANCE FROM THE TOWN THAT WORKS THEM. Open-field agriculture
      // reached about as far as a team could be walked out and back in a day; beyond the
      // furlongs came the waste, the moor and the wood. The falloff is measured from the
      // settlement's own centre in units of its own extent, so a metropolis's fields run to
      // the frame and a thorp's are a collar around it — which is also §5's frame-composition
      // walk expressed in the countryside instead of in the town.
      const dx = cx - centre.x, dy = cy - centre.y;
      const reachOut = Math.max(180, meta.builtRadius * 2.6);
      const t = Math.sqrt(dx * dx + dy * dy) / reachOut;
      if (hashUnit(`${k}|till`) < (t - 0.55) * 1.4) continue;
      const ang = Math.floor(hashUnit(`${k}|a`) * TRIG_N);
      const ca = cosI(ang), sa = sinI(ang);
      // Sized to TILE rather than overlap: two neighbours at the lattice pitch just meet.
      const w = step * (0.52 + hashUnit(`${k}|w`) * 0.42);
      const h = step * (0.46 + hashUnit(`${k}|h`) * 0.44);
      // Corner-jittered quad: a field boundary is a hedge, and a hedge is not a ruler.
      const poly = [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]].map(([px, py], ci) => {
        const jx = (hashUnit(`${k}|c${ci}x`) - 0.5) * step * 0.26;
        const jy = (hashUnit(`${k}|c${ci}y`) - 0.5) * step * 0.26;
        const qx = px + jx, qy = py + jy;
        return [cx + qx * ca - qy * sa, cy + qx * sa + qy * ca];
      });
      const c = centroid(poly);
      if (insideAny(umbrella.components, c[0], c[1])) continue;
      fields.push({ poly, tone: Math.floor(hashUnit(k) * 6), ang, furrow: hashUnit(`${k}|f`) < 0.44 });
      // Hedgerow trees on the field's own corners, rationed by the tier's accent band.
      if (hashUnit(`${k}|t`) < 0.5 * meta.accentBand) {
        const n = 1 + Math.floor(hashUnit(`${k}|tn`) * 3);
        for (let t = 0; t < n; t++) {
          const e = poly[(t + Math.floor(hashUnit(`${k}|te`) * 4)) % 4];
          trees.push({ x: e[0], y: e[1], r: 2.6 + hashUnit(`${k}|tr${t}`) * 2.4 });
        }
      }
    }
  }
  return { fields, trees };
}

function insideAny(components, x, y) {
  for (const poly of components) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
      if ((yi > y) !== (yj > y)) { const qx = (xj - xi) * (y - yi) / (yj - yi) + xi; if (x < qx) inside = !inside; }
    }
    if (inside) return true;
  }
  return false;
}

/** Render one fabric to SVG.
 * @returns {{ svg: string, elementCount: number, primitiveCount: number }} */
export function renderFolio(fabric, opts = {}) {
  // ⭐⭐⭐ THE LENS CONSUMER (mandate target 2). `folioLenses.js` held six complete ten-role
  // tables, the frozen-id contract, the Accessible hatch vocabulary and a computable §9.7
  // binding sub-law — and NOTHING CONSUMED IT: this lens drew one hard-coded parchment
  // palette. It now resolves the requested lens and draws through its roles, its ink weight
  // and its accent ration. ONE GEOMETRY, SIX TREATMENTS: nothing below this line changes a
  // coordinate, which is the five-lens reskin-family pin's own claim made true.
  const LENS = resolveLens(opts.lens);
  const P = LENS.roles;
  const m = fabric.meta;
  const out = [];
  let els = 0;
  const prims = { n: 0 };
  const push = (s) => { out.push(s); els++; };
  const B = batcher(out, push, prims);

  const frontage = fabric.web.plotFrontage;
  // §217: this leaf's own pinned ceiling — every mid-pass ration prices against it.
  const CEIL = opCeilingFor(m.tier);
  const INK = inkScale(frontage, LENS.ink);
  // §9.3's ration, scaled by the lens's own accent multiplier and still clamped by the tier.
  const accentBand = Math.max(0, Math.min(1.4, m.accentBand * LENS.accent));

  // ⛔ THE LEAF IS PARCHMENT, NOT A GREEN MAP. MF-B1 flooded the ground at 0.52 toward the
  // greens role and MF-B1b's first ink pass kept it at 0.42, which made every leaf read as
  // an olive field with a town on it — and, worse, dropped the contrast the relief marks
  // need: 204 hachures and 72 crag marks were DERIVED on the mountain exemplar and none of
  // them read, because sepia ink on olive is a whisper. Every leaf in the reference corpus
  // is CREAM with green only where something is growing. The ground is now paper with a
  // breath of green in it, and the field patches carry the colour.
  const groundBase = mix(P.paper, P.greens, 0.15);
  const FIELD_TONES = [
    mix(P.paper, P.greens, 0.26), mix(P.paper, P.greens, 0.50), mix(P.paper, P.greens, 0.70),
    mix(P.paper, P.trees, 0.30), shade(mix(P.paper, P.roofs, 0.24), 0.10), shade(mix(P.paper, P.greens, 0.60), -0.06),
  ];
  const roadTone = P.roads;
  // ⭐ THE URBAN WASH (§2.2): the warm ground the town sits on, one clear step DARKER than
  // the carriageway so the street web reads as the palest thing inside the walls.
  const urbanWash = mix(P.paper, P.roofs, 0.22);
  const yardTone = mix(P.paper, P.greens, 0.30);
  const waterTone = mix(P.paper, P.water, 0.72);
  const waterDeep = mix(P.paper, P.water, 0.86);
  const waterBank = mix(P.ink, P.water, 0.25);
  const treeTone = mix(P.paper, P.trees, 0.72);
  // ⭐⭐⭐ THE ROOF VALUE, MEASURED AGAINST THE CORPUS RATHER THAN CHOSEN (§2.3.1's role table).
  //
  // ⛔ THE MEASUREMENT, AND IT RUNS THE OPPOSITE WAY TO THE ASSUMPTION. MF-S1 measured the
  // corpus's roof band at **L 128–196** (hf72 #DEBB8E/#D2AD82/#B8926D = L 192/179/153; hf34
  // #BE9F7F/#AF8C69/#8C705A = L 164/147/119), median ≈ 160. b6/b7's roofs measured **L 112–137**,
  // median 120 — we are DARKER than the whole corpus, not lighter.
  // ⭐ AND MF-B1's CORRECTION IS UNTOUCHED, BECAUSE THAT CORRECTION WAS ABOUT A DISTANCE, NOT
  // A VALUE. §9.7's binding sub-law is "roofs at least three value steps below ROADS"; roads
  // sit at L 235, so b1's failed 0.90-over-cream roof (L≈210) was 25 L below the street and
  // unreadable. At L≈155 the roof is **80 L below the street — five clear steps** — which is
  // the corpus's own separation and nearly twice b1's.
  // ⭐⭐ IT IS ALSO THE GRAIN LEVER. A scan (and a reader) resolves a rank of abutting houses
  // only if the mass is LIGHTER than the party lines dividing it. With the whole roof band
  // below the plate's own dark threshold, a terrace is one blob and the two-tier stroke of
  // stage 11a has nothing to divide. Straddling the threshold — which is exactly what the
  // corpus's 128–196 does on a plate whose paper is 240 — is what makes the holdings count.
  const roofTone = mix(P.paper, P.roofs, 0.57);
  const inkTone = P.ink;
  const fieldInk = mix(P.paper, P.ink, 0.42);
  // The furrow line between two lands of one furlong — lighter than the hedge that bounds
  // the holding, because a baulk is a ridge of grass and a hedge is a wall of thorn.
  const furrowInk = mix(P.paper, P.ink, 0.22);
  const lightInk = mix(P.paper, P.ink, 0.30);
  // ⭐ §10.A3 / §7 THE MATERIAL WASH. The palette walks thatch → shingle → tile → slate, and
  // the walk is a VALUE walk as well as a hue one: thatch is the warm brown of straw, slate
  // the cold grey-blue of a roof that cost money. Flat opaque steps, so §9.2 is untouched.
  // ⚠ THE LADDER'S RUNGS MOVE WITH THE ROOF BAND (see roofTone): the WALK is unchanged —
  // thatch warm and dull, slate cold and dear — and only the band it walks inside is the
  // corpus's measured one instead of one nobody had measured.
  const MATERIAL_TONE = {
    thatch: shade(mix(P.paper, P.roofs, 0.60), -0.02),
    shingle: mix(P.paper, P.roofs, 0.57),
    // ⛔ THE ONE HARD-CODED HUE THE LENS PASS FOUND (MF-B5). Tile used to mix toward the
    //    literal '#8C3B22', so a fired-tile roof stayed brick-red on the NIGHT lens and on
    //    the high-contrast one — a role that did not follow its own scheme. ⭐ THE CLASS:
    //    ONE LITERAL COLOUR IN A ROLE-DRIVEN LENS IS A ROLE THAT DOES NOT EXIST. Tile is now
    //    the roofs role pushed toward the labels role, which is the warm earth-red every
    //    scheme already carries — and on a monochrome scheme it correctly stays monochrome.
    tile: shade(mix(mix(P.paper, P.roofs, 0.59), P.labels, 0.20), -0.02),
    slate: mix(mix(P.paper, P.roofs, 0.54), P.water, 0.42),
  };
  /**
   * ⭐⭐⭐ THE NESTED TONE JITTER (§2.3.3 property 7, MEASURED) — AND IT IS A GRAIN MECHANIC
   * AS MUCH AS AN AESTHETIC ONE.
   *
   * MF-S1 Table B: corpus `fill_tone_IQR` runs **6.1 – 100.1, median ≈ 18**; b6 measured
   * **4.0** at town, village and metropolis — ⛔ MISSES ×4. And the atlas says exactly how the
   * strong plates get there (hf34): "TWO NESTED LEVELS — a WARD-level sub-palette pick, then a
   * BUILDING-level jitter inside it. That nesting is what produces IQR ~50 without the plate
   * looking like confetti."
   *
   * ⭐⭐ AND THE SECOND EFFECT IS THE ONE THIS WAVE WAS LOOKING FOR. A rank of abutting houses
   * all drawn at ONE value is ONE dark mass to any reader and to any scan — the party walls
   * inside it cannot be seen because there is nothing for them to divide. Give the roofs the
   * corpus's own value SPREAD and the same rank resolves into individual holdings without a
   * single extra primitive. MEASURED at this base: the roof band ran L 112–137 (25 L) against
   * the corpus's 118–192 (74 L). This widens ours to ~L 100–165 — the same MEDIAN, so the
   * chair's "the fabric must not go pale" correction from MF-B1 stands untouched, and roughly
   * the corpus's spread around it.
   * ⚠ FLAT OPAQUE STEPS on a QUANTIZED ladder (9 rungs), so §9.2 is untouched and the fills
   * still batch by bucket.
   */
  const WARD_TONE_STEP = { poor: -0.055, modest: -0.015, comfortable: 0.030, wealthy: 0.070 };
  const roofStep = (tone, wealth) => {
    const ward = WARD_TONE_STEP[String(wealth || 'modest')] == null ? 0 : WARD_TONE_STEP[String(wealth || 'modest')];
    const step = Math.round(((tone == null ? 0.5 : tone) - 0.5) * 8) / 8;   // 9 rungs
    return ward + step * 0.34;
  };
  const CHARACTER_TINT = {
    residential: 0, merchant: 0.10, craft: 0.06, industrial: 0.14, noble: -0.10,
    civic: -0.06, religious: -0.04, criminal: 0.12, military: 0.02, foreign: 0.08, arcane: -0.02, other: 0,
  };

  const sub = fabric.substrate;
  const sampleField = (field) => (x, y) => {
    let i = Math.floor(x / sub.cell), j = Math.floor(y / sub.cell);
    if (i < 0) i = 0; else if (i >= sub.n) i = sub.n - 1;
    if (j < 0) j = 0; else if (j >= sub.n) j = sub.n - 1;
    return field[j * sub.n + i];
  };
  // ⭐⭐ THE COUNTRYSIDE IS NO LONGER DERIVED HERE. `fabric.fields` is a §161a TRUTH claim
  // about where this settlement grew its food (see fields.js), so the lens DRAWS it and
  // does not decide it. `dressGround` is retained only as the fallback for a fabric built
  // before the member landed, and it is dead on every current path.
  const ground = fabric.fields
    ? { fields: fabric.fields.parcels, trees: fabric.fields.trees }
    : dressGround(fabric, m.seed, { slope: sampleField(sub.slope), wet: sampleField(sub.wet) });
  const relief = fabric.relief || { hachures: [], crags: [], hills: [], terraces: [], formLines: [], marsh: [], waterStrokes: [] };

  out.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000" role="img" aria-label="${esc(m.name)} — settlement plan">`);
  out.push(`<title>${esc(m.name)} — ${esc(m.tier)}</title>`);

  // ── 0 · PAPER, then THE AGED GROUND (chair directive). Flat wash patches at low
  //    contrast: a leaf that has been folded, handled and stored is not one flat colour.
  //    ERA-LEGAL BY CONSTRUCTION — every patch is an opaque flat fill, so there is no
  //    gradient and no filter anywhere for §9.2 to object to.
  push(`<rect x="0" y="0" width="1000" height="1000" fill="${groundBase}"/>`);
  {
    const light = shade(groundBase, 0.055), dark = shade(groundBase, -0.05);
    for (const [tone, salt] of [[light, 'a'], [dark, 'b']]) {
      let d = '';
      // ⚠ 16 → 12 PATCHES PER TONE AT MF-B6, and this is the ration law choosing its victim
      // correctly. The aged ground is the ONE mark on the leaf that carries no information
      // about the world at all — it is texture, and §8.2 says an accent that says nothing
      // about the settlement is the first thing to cut when the budget is short. Eight
      // primitives a leaf, taken from the only pass where nothing is lost but mottle.
      for (let i = 0; i < 12; i++) {
        const k = `${m.seed}|age|${salt}|${i}`;
        const cx = hashUnit(`${k}|x`) * 1000, cy = hashUnit(`${k}|y`) * 1000;
        const rr = 90 + hashUnit(`${k}|r`) * 190;
        const pts = [];
        for (let s = 0; s < 10; s++) {
          const a = Math.round((s * TRIG_N) / 10);
          const rad = rr * (0.62 + hashUnit(`${k}|${s}`) * 0.72);
          pts.push([cx + cosI(a) * rad, cy + sinI(a) * rad * 0.78]);
        }
        d += polyPath(pts);
      }
      push(`<path d="${d}" fill="${tone}" stroke="none"/>`);
      prims.n += 12;
    }
  }

  // ── 1 · THE OPEN FIELDS (§16) — STRIPS THAT TILE, not patches that float. Batched by
  //    tone, so a countryside of a thousand lands costs six DOM nodes.
  //    ⭐ THE STRIP EDGE IS THE FURROW-LINE, the HEDGE is the holding's own boundary, and
  //    the two are different weights: §9.1's hierarchy ends at "field boundaries lightest",
  //    and inside a furlong the lands are lighter still.
  for (const f of ground.fields) {
    const poly = f.polygon || f.poly;
    B.add(`fill="${FIELD_TONES[f.tone % 6]}" stroke="${furrowInk}" stroke-width="${INK.furrow}" stroke-linejoin="round"`, polyPath(poly));
  }
  B.flush('fields');

  // 1b · THE HEDGEROWS AND BAULKS (§16.1) — the boundary between holdings, drawn once per
  //      furlong rather than once per land. One batched path for the whole parish.
  if (fabric.fields && fabric.fields.hedges && fabric.fields.hedges.length) {
    let d = '';
    for (const h of fabric.fields.hedges) { d += polyPath(h); prims.n++; }
    push(`<path d="${d}" fill="none" stroke="${fieldInk}" stroke-width="${INK.field}" stroke-linejoin="round"/>`);
  }

  // 1c · THE FIELD LANES (§16.3) — the tracks from the village out to the furlongs, running
  //      on the baulks. They are the street web's own continuation past the last house
  //      (§2.3), so they carry the roads role at a cart's width.
  if (fabric.fields && fabric.fields.lanes && fabric.fields.lanes.length) {
    let d = '';
    for (const l of fabric.fields.lanes) { d += linePath(l.line); prims.n++; }
    push(`<path d="${d}" fill="none" stroke="${mix(P.roads, P.greens, 0.20)}" stroke-width="${r2(Math.max(1.8, frontage * 0.28))}" stroke-linecap="round" stroke-linejoin="round"/>`);
    push(`<path d="${d}" fill="none" stroke="${fieldInk}" stroke-width="${INK.field}" stroke-opacity="0.5" stroke-linecap="round" stroke-linejoin="round"/>`);
  }

  // 1d · THE OUTLYING LANES (§161c) — the mill's own track, the quarry road, the lane to
  //      the abbey. Same role and weight as a field lane: this IS the road web past the last
  //      house, and a working building nobody can reach is a truth the map may not assert.
  if (fabric.outlyingLanes && fabric.outlyingLanes.length) {
    let d = '';
    for (const l of fabric.outlyingLanes) { d += linePath(l.line); prims.n++; }
    push(`<path d="${d}" fill="none" stroke="${mix(P.roads, P.greens, 0.20)}" stroke-width="${r2(Math.max(1.8, frontage * 0.30))}" stroke-linecap="round" stroke-linejoin="round"/>`);
    push(`<path d="${d}" fill="none" stroke="${fieldInk}" stroke-width="${INK.field}" stroke-opacity="0.5" stroke-linecap="round" stroke-linejoin="round"/>`);
  }

  // ── 2 · TERRACE LINES on the strips that needed them (§161b's visible work in the
  //    COUNTRYSIDE, not only inside the town). A terraced furlong is the single mark that
  //    says a settlement farmed a hillside because it had no valley to farm.
  {
    let d = '';
    for (const f of ground.fields) {
      if (!f.terraced) continue;
      const poly = f.polygon || f.poly;
      // The retaining line runs ACROSS the strip's own ploughing direction — a lynchet.
      const c = centroid(poly);
      const ca = cosI(f.ang), sa = sinI(f.ang);
      d += `M${r2(c[0] - ca * 9)} ${r2(c[1] - sa * 9)}L${r2(c[0] + ca * 9)} ${r2(c[1] + sa * 9)}`;
      prims.n++;
    }
    if (d) push(`<path d="${d}" fill="none" stroke="${mix(P.paper, P.ink, 0.62)}" stroke-width="${INK.terrace}" stroke-linecap="round"/>`);
  }

  // ── 3 · THE RELIEF PASS (§9.5b) — the land drawn in the era's own marks. All LINES.
  //    HILL PROFILES: a rounded bump with hatch strokes down its shaded flank — the little
  //    mountain sign of period maps. HACHURES: strokes down the slope, LENGTH carrying the
  //    steepness. CRAG: angular cross-hatch on exposed stone. Every one of them derives
  //    from the same substrate the accretion already obeyed.
  {
    // ⛔ THE MOLEHILL IS AN OUTLINE WITH HATCH UNDER IT, NOT A SPRAY OF STROKES FROM A LINE.
    // The first spelling hung three strokes off the crest arc and every hill on the leaf
    // read as a SHRUB — the era's hill sign became the era's tree sign, which is a legibility
    // failure and a truth failure at once (a reader would have taken high ground for
    // woodland). The period convention is a bounded profile — the little humped outline —
    // with short hatch strokes hanging INSIDE it down the shaded flank, and the strokes stop
    // short of the crest so the outline stays the dominant mark.
    let hills = '';
    for (const h of relief.hills) {
      const px = -h.dy, py = h.dx;                       // across the slope
      const a = [h.x - px * h.r, h.y - py * h.r];
      const b = [h.x + px * h.r, h.y + py * h.r];
      hills += `M${r2(a[0])} ${r2(a[1])}`
        + `Q${r2(h.x - h.dx * h.r * 1.35)} ${r2(h.y - h.dy * h.r * 1.35)} ${r2(b[0])} ${r2(b[1])}`;
      prims.n++;
      // ⚠ TWO HATCH STROKES, NOT THREE (MF-B3's declared relief ration). Every hill and
      // crag MARK survives — what falls is one interior hatch stroke apiece, which at plan
      // scale is below what the eye separates on a 10–20 unit sign. MEASURED: it returns
      // 117 primitives on the fjord, which is what carries the §181.3a street web onto the
      // most information-dense leaf in the corpus without cutting a single relief MARK.
      // §9.5b's acceptance test is "a fjord town must LOOK like a fjord town at a glance",
      // and that test is about the marks, not about their internal stroke count.
      for (let i = -1; i <= 1; i += 2) {
        const t = i * 0.42;
        // A point on the crest arc, then a SHORT tick down the shaded flank.
        const cxp = h.x + px * h.r * t - h.dx * h.r * 0.62 * (1 - t * t);
        const cyp = h.y + py * h.r * t - h.dy * h.r * 0.62 * (1 - t * t);
        hills += `M${r2(cxp)} ${r2(cyp)}L${r2(cxp + h.dx * h.r * 0.42)} ${r2(cyp + h.dy * h.r * 0.42)}`;
        prims.n++;
      }
    }
    if (hills) push(`<path d="${hills}" fill="none" stroke="${mix(P.paper, P.ink, 0.66)}" stroke-width="${INK.hachure}" stroke-linecap="round"/>`);

    let hach = '';
    for (const h of relief.hachures) {
      hach += `M${r2(h.x)} ${r2(h.y)}L${r2(h.x + h.dx * h.len)} ${r2(h.y + h.dy * h.len)}`;
      prims.n++;
    }
    if (hach) push(`<path d="${hach}" fill="none" stroke="${mix(P.paper, P.ink, 0.74)}" stroke-width="${INK.hachure}" stroke-linecap="round"/>`);

    let crag = '';
    for (const c of relief.crags) {
      const ca = cosI(c.ang), sa = sinI(c.ang);
      // A crag mark is an angular outline with cross-hatch inside it — stone, not a hill.
      crag += `M${r2(c.x - ca * c.r)} ${r2(c.y - sa * c.r)}L${r2(c.x - sa * c.r * 0.6)} ${r2(c.y + ca * c.r * 0.6)}`
        + `L${r2(c.x + ca * c.r)} ${r2(c.y + sa * c.r)}`;
      prims.n++;
      for (let i = -1; i <= 1; i += 2) {
        crag += tick(c.x + ca * c.r * i * 0.5, c.y + sa * c.r * i * 0.5, -sa, ca, c.r * 1.1);
        prims.n++;
      }
    }
    if (crag) push(`<path d="${crag}" fill="none" stroke="${mix(P.paper, P.ink, 0.86)}" stroke-width="${INK.crag}" stroke-linecap="round" stroke-linejoin="round"/>`);

    let form = '';
    for (const l of relief.formLines) { form += linePath(l); prims.n++; }
    if (form) push(`<path d="${form}" fill="none" stroke="${mix(P.paper, P.ink, 0.44)}" stroke-width="${INK.form}"/>`);

    let reeds = '';
    for (const r of relief.marsh) {
      reeds += `M${r2(r.x - 3.4)} ${r2(r.y)}L${r2(r.x + 3.4)} ${r2(r.y)}M${r2(r.x - 1.8)} ${r2(r.y - 2.4)}L${r2(r.x + 1.8)} ${r2(r.y - 2.4)}`;
      prims.n += 2;
    }
    if (reeds) push(`<path d="${reeds}" fill="none" stroke="${mix(P.paper, P.water, 0.75)}" stroke-width="${INK.form}"/>`);
  }

  // ── 4 · TREES — batched into one path of small circles drawn as arc pairs.
  {
    let d = '';
    for (const t of ground.trees) {
      d += `M${r2(t.x - t.r)} ${r2(t.y)}a${r2(t.r)} ${r2(t.r)} 0 1 0 ${r2(t.r * 2)} 0a${r2(t.r)} ${r2(t.r)} 0 1 0 ${r2(-t.r * 2)} 0`;
      prims.n++;
    }
    if (d) push(`<path d="${d}" fill="${treeTone}" stroke="${inkTone}" stroke-width="${INK.field}" stroke-opacity="0.55"/>`);
  }

  // ── 4b · ⭐⭐ §12.3 THE WALK-SCALE RINGS, over the countryside and UNDER the town — a range
  //    mark is a note on the ground, not a thing drawn over the houses. Dashed, at the
  //    lightest ink on the page, and only the rungs the true measure says fit (see
  //    immersion.deriveWalkRings; on this corpus that is one or two per leaf and the leaf
  //    that fits none draws none).
  if (fabric.immersion && lensAllows(LENS.id, 'walkRings')) {
    for (const ring of fabric.immersion.rings.rings) {
      const cxr = m.centre ? m.centre.x : 500, cyr = m.centre ? m.centre.y : 500;
      push(`<circle cx="${r2(cxr)}" cy="${r2(cyr)}" r="${r2(ring.r)}" fill="none"`
        + ` stroke="${mix(P.paper, P.ink, 0.34)}" stroke-width="${INK.form}"`
        + ` stroke-dasharray="${r2(frontage * 0.5)} ${r2(frontage * 1.1)}" stroke-opacity="0.62"/>`);
      prims.n++;
    }
  }

  // ── 4c · ⭐ §12.5 THE COUNTRYSIDE EVENT MARKS. A dated stone or a camp ground, in calm ink,
  //    where the record says something happened. The caption is spliced in later (§173).
  if (fabric.immersion) {
    let d = '';
    for (const mk of fabric.immersion.eventMarks.marks) {
      const s = Math.max(3.2, frontage * 0.55);
      if (mk.kind === 'stone') {
        // A standing stone with its own shadow-side hatch — the period's memorial mark.
        d += `M${r2(mk.x - s * 0.5)} ${r2(mk.y + s)}L${r2(mk.x - s * 0.38)} ${r2(mk.y - s * 0.9)}`
          + `L${r2(mk.x + s * 0.38)} ${r2(mk.y - s * 0.75)}L${r2(mk.x + s * 0.5)} ${r2(mk.y + s)}Z`
          + `M${r2(mk.x - s * 1.1)} ${r2(mk.y + s)}L${r2(mk.x + s * 1.1)} ${r2(mk.y + s)}`;
      } else {
        // A camp ground: three tent gables on a line. Nothing more; the register law holds.
        for (let i = -1; i <= 1; i++) {
          const px = mk.x + i * s * 1.3;
          d += `M${r2(px - s * 0.55)} ${r2(mk.y + s * 0.5)}L${r2(px)} ${r2(mk.y - s * 0.6)}L${r2(px + s * 0.55)} ${r2(mk.y + s * 0.5)}Z`;
        }
      }
      prims.n++;
    }
    if (d) push(`<path d="${d}" fill="none" stroke="${mix(P.paper, P.ink, 0.78)}" stroke-width="${INK.detail}" stroke-linejoin="round"/>`);
  }

  // ── 5 · THE WATER BODY (§5.0b at its mode, §9.5b's "a fjord town must LOOK like a fjord
  //    town at a glance"). A REGION with a heavy inked shore, then the period's own open-
  //    water convention: strokes parallel to the shore, tight at the edge, opening seaward.
  if (fabric.water.body && fabric.water.body.length > 2) {
    push(`<path d="${polyPath(fabric.water.body)}" fill="${waterTone}" stroke="none"/>`);
    prims.n++;
    let strokes = '';
    for (const l of (relief.waterStrokes || [])) { strokes += linePath(l); prims.n++; }
    if (strokes) push(`<path d="${strokes}" fill="none" stroke="${mix(waterTone, P.water, 0.55)}" stroke-width="${INK.water}"/>`);
    push(`<path d="${linePath(fabric.water.line)}" fill="none" stroke="${waterBank}" stroke-width="${INK.river}" stroke-linecap="round" stroke-linejoin="round"/>`);
    prims.n++;
  }
  // ⛔⛔ THE RIVER IS NOT DRAWN HERE ANY MORE, AND THAT IS THE CURE (chair directive §195.1:
  //    "streams clip to open ground — they run under houses"). A watercourse painted at
  //    stage 5 is painted BEFORE the urban wash and the fabric, so the moment it enters the
  //    town it vanishes under them: the reader sees a river that flows into a settlement and
  //    stops. It cannot be fixed by clipping the river — a river through a town is a real
  //    river and the reference plates draw it whole. ⭐ THE FIX IS THE ORDER: the channel is
  //    painted ABOVE the urban ground, and no building can lie in it because the water is
  //    now a ground-law CLAIM (waterWorks.waterClaims) and every footprint was clipped out
  //    of it. The two halves are the same decision seen from either end.
  const paintRiver = () => {
    if (!fabric.water.line || fabric.water.kind !== 'river') return;
    push(`<path d="${linePath(fabric.water.line)}" fill="none" stroke="${waterDeep}" stroke-width="${r2(fabric.water.width)}" stroke-linecap="round" stroke-linejoin="round"/>`);
    push(`<path d="${linePath(fabric.water.line)}" fill="none" stroke="${waterBank}" stroke-width="${INK.river}" stroke-linecap="round" stroke-linejoin="round"/>`);
    prims.n += 2;
  };

  // ── 6 · THE URBAN GROUND (§181.3a — AND IT IS NO LONGER THE STREET TONE).
  //
  // ⛔ WHAT WAS WRONG, and it is the reason the web never read as a web. The umbrella was
  //    flooded in `roads` — THE PALEST ROLE ON THE PAGE — so every gap in the fabric wore
  //    the street's own colour: the alley between two ranks, the ground a terrain cull
  //    refused, the paddock nobody built on. A settlement whose every gap is a street has
  //    no streets, because a street is a thing the eye can FOLLOW.
  // ⭐ THE URBAN WASH IS §2.2's OWN WORD FOR THIS GROUND: "the town sits on its own warm-
  //    grey urban wash that lifts it from the land". It lifts the town off the countryside
  //    and sits a clear step DARKER than the carriageway, so the channels drawn over it in
  //    §7 are the palest thing inside the walls — which is the §9.7 binding sub-law
  //    finally true of roads alone.
  {
    let d = '';
    for (const comp of fabric.umbrella.components) { d += polyPath(comp); prims.n++; }
    if (d) push(`<path d="${d}" fill="${urbanWash}" stroke="${mix(P.paper, P.ink, 0.38)}" stroke-width="${INK.road}" stroke-linejoin="round"/>`);
  }
  // 6a · THE WATERCOURSE, ABOVE THE URBAN GROUND — see the note at stage 5.
  paintRiver();
  // 6a2 · ⭐⭐ §12.8 THE PENTIMENTO — the high-water ghost as EARLIER-SURVEY UNDERDRAWING.
  //    ⭐ IT IS DRAWN HERE AND NOWHERE ELSE, and the position in the order IS the mark. An
  //    underdrawing sits ON the ground and UNDER the current ink: above the urban wash, below
  //    the streets, the fabric and the wall. Painted later it would read as a second town;
  //    painted earlier the wash would bury it. ⚠ IT IS AN OUTLINE, NEVER A FILL, so it is
  //    deliberately NOT a filled body and does NOT join the §195.0 census — a pentimento is a
  //    drawing of what is NOT THERE, and clipping it out of a street would be a category
  //    error. The census helper records that exemption by name.
  if (fabric.immersion && lensAllows(LENS.id, 'pentimento') && fabric.immersion.pentimento.ghosts.length) {
    let d = '';
    for (const g of fabric.immersion.pentimento.ghosts) { d += polyPath(g); prims.n++; }
    push(`<path d="${d}" fill="none" stroke="${mix(urbanWash, P.ink, 0.30)}" stroke-width="${INK.field}" stroke-opacity="0.55" stroke-linejoin="round"/>`);
  }

  // 6b · THE INTERIOR GREENS (§5.0c.3) — the commons, drawn as the unbuilt ground they are.
  {
    let d = '';
    for (const g of fabric.umbrella.greens) { d += polyPath(g); prims.n++; }
    if (d) push(`<path d="${d}" fill="${FIELD_TONES[0]}" stroke="${fieldInk}" stroke-width="${INK.field}" stroke-linejoin="round"/>`);
  }

  // ── ⭐⭐ 6c · §250.5 · THE FILLED-DITCH GARDENS — a curving ribbon of long narrow plots
  //    immediately OUTSIDE an old wall line, following the superseded ring exactly. They are
  //    green because they are gardens and they are NARROW because a ditch is narrow: the
  //    shape is the fossil, and it is the cheapest way a reader sees where a wall used to be.
  {
    const gardens = (fabric.demotion && fabric.demotion.gardens) || [];
    if (gardens.length) {
      let d = '';
      for (const g of gardens) { d += polyPath(g.polygon); prims.n++; }
      push(`<path d="${d}" fill="${mix(P.paper, P.trees, 0.34)}" stroke="${fieldInk}" stroke-width="${INK.field}" stroke-linejoin="round"/>`);
    }
  }

  // ── 7 · THE STREET WEB (§181.3a) — SIX RANKS OF CARRIAGEWAY, DRAWN AS THE PALE GROUND
  //    THEY ARE. Every channel is stroked at the width the forbidden-ground predicate
  //    reserved for it, so the paint lands exactly on the gap the packer left: the street
  //    is negative space in the DERIVATION and positive ink on the PAGE, which is the only
  //    way the hierarchy can read. Batched by rank — six DOM nodes for a whole town's web.
  //
  //    ⭐ THE RANK ORDER IS THE PAINTING ORDER, widest last, so a lane meeting the high
  //    street reads as joining it rather than as cutting across it.
  {
    // ⭐⭐ §17.6 THE PASSAGE IS IN THE WEB AND IS NOT PAINTED, and that is an ink decision
    // with a reason rather than a saving. A through-passage is PERSON-WIDE by law — at plan
    // scale it is a hairline, and the gap between the two inked facades either side of it
    // ALREADY draws it, exactly as the directive says a closed slot renders itself as a dark
    // seam. Painting a pale carriageway under it would draw the gap twice and make a
    // person-wide passage read as a cart lane, inverting the §160.2 hierarchy the ranks
    // exist to carry. It stays in the WEB (reachability, and the §17.4 enforcement treats it
    // as a claim so nothing may be built across it) and out of the PAINT.
    // ⚠ MEASURED: painting them cost 200–390 primitives a leaf and put four exemplars over
    // the 2,200 ceiling.
    // ⭐⭐ §5 W2 · TWO NEW RANKS, AND BOTH ARE WALLS THAT BECAME STREETS.
    //   `wallLane` — §239.2's wall-side street, the intervallum drawn as the carriageway it
    //     always was. It is painted BEFORE the arteries so a gate road reads as running THROUGH
    //     it rather than being cut by it.
    //   `ringOld`  — §250.5's demoted circuit. It is the WIDEST ordinary rank on the leaf after
    //     the high street, because its carriageway is a whole intervallum wide, and that width
    //     is exactly why a reader sees it as older than the fabric it runs through.
    const RANK_ORDER = ['alley', 'blockLane', 'blockCross', 'lane', 'seam', 'wallLane', 'ringOld', 'artery', 'high'];
    const channels = fabric.channels || [];
    for (const rank of RANK_ORDER) {
      let d = '';
      let n = 0;
      for (const ch of channels) {
        if (ch.rank !== rank) continue;
        d += linePath(ch.line);
        n++;
      }
      if (!d) continue;
      prims.n += n;
      // The widest ranks carry a kerb line; the alleys do not — an alley is a gap between
      // two walls and the walls ARE its ink (§9.1's hierarchy, which stops at the fabric
      // edge and never gives a back way a line of its own).
      const w = channels.find((c) => c.rank === rank).width;
      // ⭐⭐⭐ §201 A.1 THE ALLEY REGISTER (owner catch, chair directive ODQ §201). AN ALLEY IS
      // BLOCK-INTERIOR SPACE, NOT A STREET, AND IT MAY NOT WEAR THE STREET'S COLOUR.
      // ⛔ Every rank was stroked in `roadTone` — the palest role on the page — so a ginnel
      // between two ranks read as a pale carriageway running through the block, and the eye
      // could not tell a route from a gap. That is the §9.7 hierarchy inverted at its finest
      // scale: the whole point of ROADS ARE THE PALEST ROLE is that the pale web IS the route
      // web. An alley takes its BLOCK's ground instead — the same yard tone the plots behind
      // it stand on — so it reads as what it is: the space between buildings.
      // ⭐⭐ §250.5 · THE OLD WALL LANE TAKES ITS OWN PAVEMENT TONE — one step off the ordinary
      //    carriageway, never a different colour. A demoted circuit is a street the town has
      //    been walking for two centuries; the tell is that it is *older*, and on a period plan
      //    older paving is the mark, not a highlight. ⚠ It is deliberately a SMALL step: §252.3c
      //    and G-40(ii) both measure that the corpus separates ordinary vintages at Δ median L
      //    ≈ 5–10 and reserves ≈40 for a catastrophe — a ring street painted 40 apart would
      //    read as a fire, not as age.
      const chTone = rank === 'alley' ? yardTone
        : rank === 'ringOld' ? mix(roadTone, P.ink, 0.10)
          : roadTone;
      push(`<path d="${d}" fill="none" stroke="${chTone}" stroke-width="${r2(w)}" stroke-linecap="round" stroke-linejoin="round"/>`);
      if (rank === 'high' || rank === 'artery') {
        push(`<path d="${d}" fill="none" stroke="${lightInk}" stroke-width="${r2(w + INK.road * 2)}" stroke-opacity="0.22" stroke-linecap="round"/>`);
      }
    }
  }

  // ── 8 · SQUARES — holes in the fabric, inked (§160.2's "the market quarter needs its hole").
  //    ⭐ THE SQUARE IS THE ONE PLACE THE CARRIAGEWAY WIDENS INTO A ROOM, so it is drawn
  //    AFTER the web and in the same tone: the web runs into it and stops, which is what a
  //    market place is — the void the streets organize around.
  for (const sq of fabric.web.squares) {
    B.add(`fill="${roadTone}" stroke="${mix(P.paper, P.ink, 0.46)}" stroke-width="${INK.road}" stroke-linejoin="round"`, polyPath(sq.polygon));
  }
  B.flush('squares');

  // ── 9 · THE BLOCK GROUND IS GONE, AND ITS ABSENCE IS THE POINT (§181.3a).
  //    MF-B2 drew a tone under every rank run so that the gaps BETWEEN blocks would read as
  //    channels — painting the not-street to imply the street. With the street itself
  //    derived and drawn, the block ground is exactly redundant: the fabric's own buildings
  //    are its darkest mark, the urban wash is its ground, and the carriageway is the pale
  //    web between them. Dropping it also PAYS for the web — measured, the block fills cost
  //    215 primitives at city against the channel pass's own cost.

  // ── 10 · YARDS — open ground behind the street range, one batched path.
  //    ⭐ RATIONED BY SIZE, and this is a REAL op saving rather than a batching one. The
  //    block ground beneath already reads as open ground, so a yard only earns a shape of
  //    its own where it is big enough to read AS a yard; the small ones were drawing a
  //    barely-distinguishable tone over a tone at a cost of one primitive each (861 of them
  //    at metropolis). Drawn largest-first so the ones that survive are the ones that say
  //    something.
  {
    // A merged run has no yards to show: the mass IS the block's built ground at that zoom.
    const mergedKeys = (fabric.lod && fabric.lod.mergedKeys) || new Set();
    const yards = fabric.parcels.filter((p) => p.yard && !mergedKeys.has(p.key))
      .sort((a, b) => absArea(b.yard) - absArea(a.yard));
    // ⚠ 0.34 → 0.26 AT MF-B4. §17.6's alley-gap law puts real, derived, owner-wanted gaps
    // through the blocks, and §17.4's kerb clipping leaves the block ground visible along
    // every street — so the block already reads as open ground in more places than it did,
    // and a small yard drawing a tone over a tone says correspondingly less. The LARGEST
    // yards, which are the ones that read AS yards, are untouched.
    // ⭐⭐ AT THE CENSUS TIERS EVERY TOFT IS DRAWN, AND THE RATION DOES NOT APPLY — because at
    // those tiers the toft IS the grain. hf10 draws each thorp house "free in its own toft
    // with a FENCED KITCHEN-GARDEN RECTANGLE"; hf3 separates its village garden strips with
    // tenure lines. A ration written for a town of eight hundred yards is a ration that
    // deletes the entire structure of a hamlet of forty. MEASURED: the census tiers carry
    // 43–104 yards against a town's 800+, so drawing all of them costs a rounding error.
    const censusTier = !m.representative;
    const keep = censusTier ? yards : yards.slice(0, Math.max(24, Math.round(yards.length * 0.26)));
    let d = '';
    for (const p of keep) { d += polyPath(p.yard); prims.n++; }
    if (d) push(`<g id="yards"><path d="${d}" fill="${yardTone}" stroke="${inkTone}" stroke-width="${censusTier ? INK.plotTick : INK.yard}" stroke-opacity="${censusTier ? 0.78 : 0.5}" stroke-linejoin="round"/></g>`);
  }

  // ── 11 · THE FABRIC — every building INKED at fabric weight (§9.1, the chair's target
  //    zero). Batched by QUANTIZED tone bucket: identical pixels, one node per bucket.
  //    ⚠ THE QUANTIZATION IS THE ONLY VISUAL CONCESSION IN THE WHOLE OP BUDGET, and it is
  //    declared: the per-building jitter runs on 7 steps instead of a continuum, a
  //    difference below what the eye resolves at plan scale and worth an order of magnitude
  //    of DOM nodes.
  {
    /** @type {Map<string,string[]>} */ const buckets = new Map();
    const order = [];
    let derelict = '';
    // ⭐ THE LOD MASSES first, in the same tone buckets — distant ordinary fabric drawn as
    // the continuous built ground the reference draws it as (§181.2a).
    const merged = (fabric.lod && fabric.lod.mergedKeys) || new Set();
    for (const mass of ((fabric.lod && fabric.lod.masses) || [])) {
      const mTint = CHARACTER_TINT[mass.character] == null ? 0 : CHARACTER_TINT[mass.character];
      const fill = shade(MATERIAL_TONE[mass.material] || roofTone, roofStep(mass.tone, mass.wealth) - mTint);
      if (!buckets.has(fill)) { buckets.set(fill, []); order.push(fill); }
      buckets.get(fill).push(polyPath(mass.polygon));
      prims.n++;
    }
    for (const p of fabric.parcels) {
      if (merged.has(p.key)) continue;
      if (p.derelict) { derelict += polyPath(p.polygon); prims.n++; continue; }
      const tint = CHARACTER_TINT[p.character] == null ? 0 : CHARACTER_TINT[p.character];
      // §10.A3: the ward's material is the BASE the per-plot jitter and the character tint
      // ride on, so a slate quarter reads as slate whatever trade is on its street.
      const base = MATERIAL_TONE[p.material] || roofTone;
      const fill = shade(base, roofStep(p.tone, p.wealth) - tint);
      if (!buckets.has(fill)) { buckets.set(fill, []); order.push(fill); }
      buckets.get(fill).push(polyPath(p.polygon));
      prims.n++;
      // ⭐ THE BACK-HOUSE shares its tenement's tone bucket, so filling the blocks out to
      // the reference's density costs DOM nodes not at all and primitives one apiece.
      if (p.backHouse) { buckets.get(fill).push(polyPath(p.backHouse)); prims.n++; }
    }
    // ⭐ §10.A3 THE SHANTY HUTS, in the same ink as the fabric and none of its order: they
    // carry no yard, no block and no rank, which is what a shanty IS.
    for (const hut of ((fabric.shanty && fabric.shanty.huts) || [])) {
      const step = Math.round((hut.tone - 0.5) * 6) / 6;
      const fill = shade(MATERIAL_TONE.thatch, step * 0.15 + 0.06);
      if (!buckets.has(fill)) { buckets.set(fill, []); order.push(fill); }
      buckets.get(fill).push(polyPath(hut.polygon));
      prims.n++;
    }
    out.push(`<g id="fabric" stroke="${inkTone}" stroke-width="${INK.fabric}" stroke-linejoin="round">`);
    for (const fill of order.sort()) push(`<path d="${buckets.get(fill).join('')}" fill="${fill}"/>`);
    // A DERELICT plot is a ROOFLESS SHELL — its wall lines survive and its roof does not.
    if (derelict) push(`<path d="${derelict}" fill="none" stroke-dasharray="${r2(frontage * 0.22)} ${r2(frontage * 0.16)}"/>`);
    out.push('</g>');
  }

  // ── 11a · ⭐⭐⭐ GAP-D / T-07 / T-08 · THE TWO-TIER STROKE AND THE PLOT SERIES.
  //
  // MF-S1's single largest identified visual-quality lever, and its own words: "at town+ the
  // DOMINANT PACKING FORM IS THE ABUTTING RANGE, not the detached solid… all draw blocks as
  // ONE SILHOUETTE at weight W subdivided by INTERNAL UNIT LINES at ~0.5 W" — measured on
  // hf40's native crop at exactly 2:1. §17.1 already legislated ABUTMENT; nothing named the
  // STROKE, which is the thing that makes abutment legible rather than merely true.
  //
  // ⭐ THREE MARKS, THREE WEIGHTS, AND EACH ONE IS DOING A DIFFERENT JOB:
  //   PLOT LINE (0.5×)  every holding's own side boundary, running from the street line to
  //                     the back of its toft. Inside the range it IS the party wall; behind
  //                     it, it is the tenure line hf3 draws between its garden strips. ONE
  //                     line does both, because in the record it was one line.
  //   BLOCK FRONT (2×)  the continuous frontage — the heavy line the whole rank shares. This
  //                     is what T-08 says b6 most conspicuously lacked, and it is what turns
  //                     a row of quads into a street with walls.
  //   BLOCK BACK (2×)   the back lane the tofts run to, which is what closes the block.
  {
    const merged = (fabric.lod && fabric.lod.mergedKeys) || new Set();
    let plotD = '';
    for (const p of fabric.parcels) {
      if (merged.has(p.key) || !p.plotLine) continue;
      plotD += linePath(p.plotLine); prims.n++;
    }
    // The LOD masses keep their unit lines: a mass is a block of holdings, not a slab.
    for (const mass of ((fabric.lod && fabric.lod.masses) || [])) {
      for (const l of (mass.unitLines || [])) { plotD += linePath(l); prims.n++; }
    }
    if (plotD) {
      push(`<path d="${plotD}" fill="none" stroke="${inkTone}" stroke-width="${INK.plotTick}" stroke-opacity="0.72" stroke-linecap="round"/>`);
    }
    let frontD = '', backD = '';
    for (const b of (fabric.blocks || [])) {
      if (b.front && b.front.length === 2) { frontD += linePath(b.front); prims.n++; }
      if (b.backLine && b.backLine.length === 2) { backD += linePath(b.backLine); prims.n++; }
    }
    if (frontD) push(`<path d="${frontD}" fill="none" stroke="${inkTone}" stroke-width="${INK.block}" stroke-linecap="square"/>`);
    // ⚠ THE BACK LINE IS LIGHTER THAN THE FRONT AND THAT IS NOT A COMPROMISE. A block's front
    // is a STREET WALL and its back is a boundary between two men's gardens; drawing them at
    // one weight says the block is a box, which is the read the silhouette exists to refuse.
    if (backD) push(`<path d="${backD}" fill="none" stroke="${inkTone}" stroke-width="${INK.party}" stroke-opacity="0.8" stroke-dasharray="${r2(frontage * 0.9)} ${r2(frontage * 0.5)}"/>`);
  }

  // ── 11b · ⭐⭐ §16.5 THE COUNTRYSIDE'S OWN DWELLINGS and §5.0e THE FAUBOURG.
  //    The steadings sit in the fields at cottage rung; the faubourg strings along the gate
  //    roads; the lean-tos cling to the wall's outer face. All three are FILLED BODIES and
  //    all three went through the ground law (see buildFabric stage 6f), so nothing here is
  //    drawn that the census has not counted.
  {
    let steads = '', faub = '', lean = '';
    for (const h of (fabric.habitation || [])) for (const poly of (h.solids || [])) { steads += polyPath(poly); prims.n++; }
    for (const b of ((fabric.faubourgs && fabric.faubourgs.buildings) || [])) { faub += polyPath(b.polygon); prims.n++; }
    for (const b of ((fabric.faubourgs && fabric.faubourgs.leanTos) || [])) { lean += polyPath(b.polygon); prims.n++; }
    if (steads) push(`<path d="${steads}" fill="${shade(MATERIAL_TONE.thatch, 0.04)}" stroke="${inkTone}" stroke-width="${INK.fabric}" stroke-linejoin="round"/>`);
    if (faub) push(`<path d="${faub}" fill="${shade(roofTone, 0.06)}" stroke="${inkTone}" stroke-width="${INK.fabric}" stroke-linejoin="round"/>`);
    // ⭐ THE LEAN-TO IS DRAWN LIGHTER THAN THE FABRIC. It is a shed against somebody else's
    // wall, not a house — and the value difference is the §5.0e tell doing its work in ink.
    if (lean) push(`<path d="${lean}" fill="${mix(P.paper, P.roofs, 0.55)}" stroke="${inkTone}" stroke-width="${INK.yard}" stroke-linejoin="round"/>`);
  }

  // ── 11c · ⭐⭐⭐ THE ACCESSIBLE LENS'S REAL HATCH GEOMETRY (TC29's §0.0 resolution: "an
  //    accessibility lens whose patterns are cosmetic is not an accessibility lens").
  //
  // ⭐ THE HATCH BELONGS TO THE WARD, NOT TO THE BUILDING, and that is the whole design.
  // "Patterns replace hue" describes how a hand-coloured plate was distinguished for a
  // PRINTER WHO HAD NO COLOUR — and what such a plate hatched was a WASH, which is a region.
  // Hatching every roof individually would be 800 tiny line bundles at plan scale, unreadable
  // and unaffordable; hatching the quarter's own ground at the character's angle and pitch is
  // the period's own device and it carries exactly the information the hue carried.
  //
  // ⚠ AND IT IS PAID FOR BY THE ACCENT IT REPLACES. Hue carries nothing on this lens, so the
  // ROOF-RIDGE TICK — a texture accent whose whole job is to say "this filled quad is a
  // building" — gives way to a hatch that says the same thing and a category besides. The
  // trade is measured, declared, and the reason TC29 could say Accessible EXITS the
  // one-geometry reskin family: this leaf legitimately carries different ops.
  const patterned = LENS.pattern;
  if (patterned) {
    // ⚠ THE TAIL RESERVE IS MEASURED, NOT GUESSED, AND THE FIRST SPELLING WAS BOTH. The hatch
    // runs at stage 11c and everything from the ridge to the lettering splice is still to
    // come; reserving 120 put the coastal city's accessible leaf 78 ops OVER the ceiling.
    // MEASURED on the densest leaf in the corpus, the tail from here to the splice costs
    // ~430 primitives (landmarks' interior lines, terraces, bridges, the wall and its
    // gatehouses, the state marks, the precinct bounds, the chrome, the legend, the letters).
    // ⭐ THE CLASS: a mid-pass budget must reserve THE REST OF THE PASS, and "the rest of the
    // pass" is a number somebody has to measure.
    const budget = Math.max(0, CEIL - prims.n - TAIL_RESERVE);
    /** @type {Map<string, string[]>} */ const byStyle = new Map();
    let spent = 0;
    for (const part of fabric.umbrella.partition) {
      const org = fabric.organisms.find((o) => o.key === part.organismKey);
      const ch = String((org && org.character) || (org && org.category) || 'other').toLowerCase();
      const row = HATCH[ch] || HATCH.other;
      if (!row || !row.pitch) continue;                  // pitch 0 = the matrix is the ground
      const poly = part.polygon;
      if (!poly || poly.length < 3) continue;
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const p of poly) {
        if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0];
        if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1];
      }
      const ca = cosI(row.ang), sa = sinI(row.ang);
      const pitch = Math.max(3.2, frontage * row.pitch * 2.2);
      const cxp = (x0 + x1) / 2, cyp = (y0 + y1) / 2;
      const half = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0)) * 0.5;
      const style = `stroke="${mix(P.paper, P.ink, 0.55)}" stroke-width="${INK.furrow}" fill="none"`;
      let d = '';
      for (let t = -half; t <= half; t += pitch) {
        if (spent >= budget) break;
        // A ruled line across the ward at the character's angle, clipped to its own bbox —
        // the bbox is the honest bound at plan scale and it costs one segment, not a clip.
        const mxp = cxp - sa * t, myp = cyp + ca * t;
        const ax = mxp - ca * half, ay = myp - sa * half;
        const bx = mxp + ca * half, by = myp + sa * half;
        d += `M${r2(Math.max(x0, Math.min(x1, ax)))} ${r2(Math.max(y0, Math.min(y1, ay)))}`
          + `L${r2(Math.max(x0, Math.min(x1, bx)))} ${r2(Math.max(y0, Math.min(y1, by)))}`;
        spent++; prims.n++;
      }
      if (d) {
        if (!byStyle.has(style)) byStyle.set(style, []);
        byStyle.get(style).push(d);
      }
    }
    for (const [style, ds] of byStyle) push(`<path d="${ds.join('')}" ${style}/>`);
  }

  // ── 12 · ROOF-RIDGE TICKS — the interior detail line that turns a filled quad into a
  //    drawn building. Hard-rationed, one batched path.
  //    ⚠ ZERO ON A PATTERN LENS (see 11c): the hatch has taken over the job and paid for it.
  if (accentBand > 0.25 && !patterned) {
    // Rationed by SIZE and by the tier's accent band — the ridge is the interior line that
    // turns a filled quad into a drawn building, and a big roof is where it reads. The
    // small end of the fabric carries its ink on its outline alone, which is also what the
    // reference corpus does at these scales.
    const lodKeys = (fabric.lod && fabric.lod.mergedKeys) || new Set();
    // ⭐ RATIONED HARDER THAN THE ACCENT BAND ALONE (§9.3). At `accentBand` the ridge tick
    // was drawn on 78% of a town's buildings — 490 primitives, a fifth of the whole ceiling,
    // on the one accent that says least at plan scale once the blocks are built out to the
    // reference's density. hf30 draws the ridge on its LARGE roofs and lets the small fabric
    // carry its ink on its outline alone. Capping the share at 0.30 is that reading, and it
    // is what pays for the build-out and the countryside at the same time.
    const ranked = fabric.parcels.filter((p) => !lodKeys.has(p.key)).sort((a, b) => b.area - a.area)
      // ⚠ 0.26 RATHER THAN MF-B3's 0.30, RE-MEASURED BECAUSE THE FABRIC GOT DENSER. The cap
      // is a SHARE, so a leaf that gained 90 drawn roofs gained 27 ridge ticks with them —
      // and the city finished 6 primitives over the ceiling. ⚠ 0.26 → 0.23 again after the
      // §17/§17.4/§17.6 ground laws landed: the LOD masses that GAVE WAY to standing
      // buildings restore those buildings to the ink, which is the correct trade and it has
      // a price. The ridge is the accent that
      // says least at plan scale once the blocks are built out; hf30 draws it on its large
      // roofs and lets the small fabric carry its ink on its outline alone. Every relief
      // MARK, every building and every street survives; one accent narrows its ration.
      // ⚠ 0.23 → 0.17, RE-MEASURED ONCE MORE (MF-B5), and the trade is named. §5.0e's
      // faubourg and §16.5's steadings put REAL BUILDINGS on the coastal city's leaf — 15
      // faubourg houses, 13 lean-tos and 27 countryside steadings — which took it 49
      // primitives over the 2,200 ceiling. ⭐ THE RATION LAW'S OWN ANSWER IS THAT AN ACCENT
      // GIVES WAY, NEVER A BUILDING OR A STREET, and no OP_CEILING raise is proposed here
      // because a ratchet raise is an owner-gated class. Every relief mark, every street,
      // every building on every leaf survives; one interior detail line narrows its share.
      // ⚠ 0.17 → 0.15, RE-MEASURED A THIRD TIME (MF-B6), and the trade is named exactly.
      // §12's whole immersion suite lands on this leaf — the walk ring, the dated stones and
      // camp grounds, the derived device in the cartouche, the pentimento, the §10 state
      // marks — and it took the coastal city 23 primitives over the 2,200 ceiling. ⭐ THE
      // RATION LAW'S OWN ANSWER IS THAT AN ACCENT GIVES WAY, NEVER A BUILDING OR A STREET,
      // and NO OP_CEILING RAISE IS PROPOSED: a ratchet raise is an owner-gated class. Every
      // relief mark, every street, every building and every §12 mark on every leaf survives;
      // one interior detail line narrows its share for the third time.
      // ⭐⭐⭐ AND THE RATION IS NOW COMPUTABLE RATHER THAN HAND-TUNED FOR A FOURTH TIME. Every
      // previous lane re-measured this share by hand when a new member arrived (0.30 → 0.26 →
      // 0.23 → 0.17 → 0.15), which is a constant standing in for a calculation. The ration
      // law says an ACCENT gives way and a BUILDING, a STREET — and now a NAME — never does,
      // so the ridge takes the share it can afford: its own band, capped by what is left once
      // the rest of the pass and the §173 letters are reserved. A leaf at its ceiling loses
      // ridge ticks and keeps its place-names, automatically, on every leaf and every lens.
      .slice(0, Math.max(0, Math.min(
        Math.round(fabric.parcels.length * Math.min(0.15, accentBand)),
        CEIL - prims.n - TAIL_RESERVE - estimateLetteringOps(fabric, m, LENS),
      )));
    let d = '';
    for (const b of ranked) {
      if (b.derelict) continue;
      const w = widestAxis(b.polygon);
      if (w.len < frontage * 0.75) continue;
      const c = b.center, h = w.len * (b.wing ? 0.22 : 0.30);
      d += `M${r2(c[0] - w.dx * h)} ${r2(c[1] - w.dy * h)}L${r2(c[0] + w.dx * h)} ${r2(c[1] + w.dy * h)}`;
      prims.n++;
    }
    if (d) push(`<path d="${d}" fill="none" stroke="${inkTone}" stroke-width="${INK.detail}" stroke-opacity="0.55"/>`);
  }

  // ── 13 · LANDMARKS — §6 archetypes at HEAVIER ink with interior detail lines (ridge
  //    lines, bay divisions, yard walls). These stay individual elements on purpose: each
  //    carries `data-anchor`, and the truth layer hit-tests them.
  out.push('<g id="landmarks">');
  {
    let ridges = '', bays = '', yards = '';
    for (const lm of fabric.landmarks) {
      // ⭐⭐⭐ THE LENS DRAWS THE POLYGONS IT IS GIVEN (chair directive §195.0). The
      // arrangement used to be COMPOSED HERE, downstream of both ground-law censuses, so
      // the shapes on the page were shapes nothing had ever measured. They are now derived
      // in institutionShapes.js, clipped by the ground law like every other footprint, and
      // arrive on the record. `archetypeShape` remains only as the pre-B5 fallback.
      const sh = lm.solids
        ? { solids: lm.solids, voids: lm.voids || [], marks: lm.marks || [] }
        : archetypeShape(lm.monumental ? lm : { ...lm, archetype: 'ordinary' });
      const weight = lm.monumental ? INK.landmark : INK.fabric;
      const fill = lm.monumental
        ? mix(roofTone, P.ink, lm.prominent ? 0.52 : 0.34)
        : shade(roofTone, (hashUnit(`${lm.instanceKey}|tone`) - 0.5) * 0.15);
      for (const p of sh.solids) {
        push(`<path d="${polyPath(p)}" fill="${fill}" stroke="${inkTone}" stroke-width="${weight}" stroke-linejoin="round" data-anchor="${esc(lm.anchorKey)}"/>`);
        prims.n++;
      }
      if (!lm.monumental) continue;
      for (const v of sh.voids) { push(`<path d="${polyPath(v)}" fill="${roadTone}" stroke="${inkTone}" stroke-width="${INK.landmarkMinor}"/>`); prims.n++; }
      for (const mk of sh.marks) {
        if (mk.kind === 'ridge') {
          const c = centroid(mk.poly), w = widestAxis(mk.poly), h = w.len * 0.36;
          ridges += `M${r2(c[0] - w.dx * h)} ${r2(c[1] - w.dy * h)}L${r2(c[0] + w.dx * h)} ${r2(c[1] + w.dy * h)}`;
          prims.n++;
        } else if (mk.kind === 'bays') {
          // BAY DIVISIONS: the cross lines of a great roof. This is the detail that
          // separates a monumental silhouette from a large rectangle.
          const c = centroid(mk.poly), w = widestAxis(mk.poly);
          const px = -w.dy, py = w.dx;
          for (let i = 1; i < mk.n; i++) {
            const t = (i / mk.n - 0.5) * w.len * 0.86;
            const bx = c[0] + w.dx * t, by = c[1] + w.dy * t;
            bays += tick(bx, by, px, py, w.len * 0.30);
            prims.n++;
          }
        } else if (mk.kind === 'yard') {
          yards += polyPath(mk.poly); prims.n++;
        } else if (mk.kind === 'wheel' || mk.kind === 'well') {
          push(`<circle cx="${r2(mk.x)}" cy="${r2(mk.y)}" r="${r2(mk.r)}" fill="none" stroke="${inkTone}" stroke-width="${weight}"/>`);
          prims.n++;
        } else if (mk.kind === 'pit') {
          push(`<circle cx="${r2(mk.x)}" cy="${r2(mk.y)}" r="${r2(mk.r)}" fill="${mix(P.paper, P.ink, 0.34)}" stroke="${inkTone}" stroke-width="${INK.detail}"/>`);
          prims.n++;
        }
      }
    }
    if (yards) push(`<path d="${yards}" fill="none" stroke="${inkTone}" stroke-width="${INK.landmarkMinor}" stroke-dasharray="${r2(frontage * 0.3)} ${r2(frontage * 0.22)}"/>`);
    if (ridges) push(`<path d="${ridges}" fill="none" stroke="${mix(P.ink, P.paper, 0.45)}" stroke-width="${INK.detail}"/>`);
    if (bays) push(`<path d="${bays}" fill="none" stroke="${mix(P.ink, P.paper, 0.35)}" stroke-width="${INK.detail}"/>`);
  }
  out.push('</g>');

  // ── 13b · §161b THE VISIBLE WORK — the strain the §5.-1c solver recorded, drawn at
  //    last, in LINES and on the ground that demanded each one (see terraform.js).
  if (fabric.terraform && fabric.terraform.works.length) {
    let d = '';
    for (const w of fabric.terraform.works) {
      for (const l of w.lines) { d += linePath(l); prims.n++; }
    }
    if (d) push(`<path d="${d}" fill="none" stroke="${mix(P.paper, P.ink, 0.70)}" stroke-width="${INK.terrace}" stroke-linecap="round" stroke-linejoin="round"/>`);
  }

  // ── 14 · TERRACES — §161b's visible work, drawn INSIDE the town on the ground that
  //    forced it. Above the fabric, because a terrace wall retains the houses on it.
  {
    let d = '';
    for (const t of relief.terraces) { d += linePath(t); prims.n++; }
    if (d) push(`<path d="${d}" fill="none" stroke="${mix(P.paper, P.ink, 0.78)}" stroke-width="${INK.terrace}" stroke-linecap="round"/>`);
  }

  // ── 14b · ⭐⭐ THE BRIDGES (§2.3, chair directive §195.1). A street that crosses the water
  //    and carries no bridge says the town fords its own river at every lane. The deck is the
  //    road's own width; the parapets are the two lines that make it read as a structure
  //    rather than as a road drawn over blue.
  for (const br of (fabric.bridges || [])) {
    const dx = cosI(br.along), dy = sinI(br.along);
    const nx = -dy, ny = dx;
    const half = Math.max(br.span * 0.85, br.width * 0.9);
    const w2 = br.width * 0.5;
    const deck = [
      [br.x - dx * half - nx * w2, br.y - dy * half - ny * w2],
      [br.x + dx * half - nx * w2, br.y + dy * half - ny * w2],
      [br.x + dx * half + nx * w2, br.y + dy * half + ny * w2],
      [br.x - dx * half + nx * w2, br.y - dy * half + ny * w2],
    ];
    push(`<path d="${polyPath(deck)}" fill="${roadTone}" stroke="none"/>`);
    prims.n++;
    // The parapets, and a pier line under the middle — the period's own bridge mark.
    let d = `M${r2(deck[0][0])} ${r2(deck[0][1])}L${r2(deck[1][0])} ${r2(deck[1][1])}`
      + `M${r2(deck[3][0])} ${r2(deck[3][1])}L${r2(deck[2][0])} ${r2(deck[2][1])}`;
    prims.n += 2;
    for (const t of [-0.33, 0.33]) {
      const px = br.x + dx * half * t, py = br.y + dy * half * t;
      d += `M${r2(px - nx * w2)} ${r2(py - ny * w2)}L${r2(px + nx * w2)} ${r2(py + ny * w2)}`;
      prims.n++;
    }
    push(`<path d="${d}" fill="none" stroke="${inkTone}" stroke-width="${INK.landmarkMinor}" stroke-linecap="round"/>`);
  }

  // ── 15 · WALLS — the heaviest ink on the page, tower dots, gate BREAKS and piers.
  // ⭐⭐⭐ §230 · THE LENS PULLS THE DRAWN RUNS THROUGH THE CIRCUIT NODE'S ACCESSOR. It used to
  // roll its own split — dropping every ring vertex within the gate radius, the exact defect
  // MF-B7 cured inside `wallClaims` and left standing here — so the ink opened at one width
  // and the reservation at another, on every walled leaf, with no census able to see it. The
  // accessor verifies the node's content hash, so a lens handed a stale or mutated circuit
  // throws instead of drawing the wrong wall.
  const drawnRuns = circuitDrawnRuns(fabric.wallCircuit);
  // ⭐⭐⭐ §250.5 · A SUPERSEDED CIRCUIT IS NOT DRAWN AS A WALL, BECAUSE IT IS NOT ONE ANY MORE.
  //    ⛔ MY FIRST SPELLING EMITTED THE FOSSILS AND WENT ON STROKING THE FULL OLD CURTAIN
  //    UNDERNEATH THEM, and the 3,000 px zoom is what showed it: the city read as a town with
  //    TWO WALLS rather than as a town with a biography. The law says the old thing BECOMES the
  //    new thing — so an epoch the demotion has taken is drawn ONLY by what it became: its ring
  //    street (pale, in the web above), its surviving stubs, its tower rounds, its filled-ditch
  //    gardens and its gate widenings. ⭐ *That is how a town looks old at a glance without
  //    drawing a single ruin* — and drawing the wall as well is drawing the ruin.
  //    ⚠ A ring the demotion did NOT reach still draws as a wall, so a leaf whose fossil ladder
  //    is absent degrades to the old picture rather than to an invisible one.
  const demotedEpochs = new Set(((fabric.demotion && fabric.demotion.ringStreets) || []).map((r) => r.epoch));
  for (const ring of fabric.walls) {
    if (ring.kind === 'old-core' && demotedEpochs.has(ring.epoch)) continue;
    const w = ring.kind === 'old-core' ? INK.wallOld : INK.wall;
    const runs = drawnRuns.filter((r) => r.ring === ring).map((r) => r.line);
    // The ring's own mean — used ONLY to point a beak or a D's open back OUTWARD, which is a
    // question about the mark's orientation and not about where anything stands.
    let cx0 = 0, cy0 = 0;
    for (const p of ring.polygon) { cx0 += p[0]; cy0 += p[1]; }
    cx0 /= ring.polygon.length; cy0 /= ring.polygon.length;
    // ── ⭐⭐⭐ §5 W2 · THE RUN CHAIN IS **VISIBLE INK**, NOT ONLY A DERIVATION. §205.3 is ruled:
    //    *a cliff flank needs NO wall — drawing one is the violation* — so a terrain-surrender
    //    run is stroked at its own thickness (0.45 of the curtain: a parapet) and a water
    //    termination at 0.55 (the river wall the town could afford because the water did the
    //    work). Everything else is the curtain. The weight comes from `runBands[j].stone`,
    //    which is the SAME number the reservation was computed from — the ink and the claim
    //    cannot disagree about how thick this wall is.
    // ⚠ ONE PATH PER DISTINCT THICKNESS, not one per run: the batching is what keeps a
    //    thirty-five-run metropolis inside its §217 op ceiling.
    /** @type {Map<number, string>} */ const byWeight = new Map();
    if (ring.runs && ring.runs.length && ring.runOfVertex) {
      for (const r of drawnRuns.filter((x) => x.ring === ring)) {
        // Which typed run owns this drawn piece: the nearest ring vertex to its midpoint.
        const mid = r.line[Math.floor(r.line.length / 2)];
        let bi = 0, bd = Infinity;
        for (let i = 0; i < ring.polygon.length; i++) {
          const p = ring.polygon[i];
          const dd = (p[0] - mid[0]) * (p[0] - mid[0]) + (p[1] - mid[1]) * (p[1] - mid[1]);
          if (dd < bd) { bd = dd; bi = i; }
        }
        const run = ring.runs[ring.runOfVertex[bi]] || ring.runs[0];
        const ww = r2(w * (run.thickness == null ? 1 : run.thickness));
        byWeight.set(ww, (byWeight.get(ww) || '') + linePath(r.line));
        prims.n++;
      }
    }
    let d = '';
    if (!byWeight.size) for (const r of runs) { d += linePath(r); prims.n++; }
    // ⛔ THE DITCH IS A FACT ABOUT THE WALL, SO IT ENDS WHERE THE WALL ENDS (chair directive
    // §195.2). The b4 leaf drew the ditch as a CLOSED dashed loop while the circuit itself
    // was a half-ring against the river — a dashed arc sailing round open countryside where
    // no stones stand, which reads as construction geometry left in the paint. It is now
    // drawn as OPEN RUNS matching the wall's own runs, so a ditch exists exactly where a
    // wall does. (It is a real work, not a guide: §161b digs it and §12.7's legend names it.)
    // ⭐⭐ AND THE DITCH IS NOW PER RUN AS WELL. A ditch is dug where the ground allowed it and
    //    where it was worth digging: NOT before a scarp that is its own ditch, NOT before a
    //    river that is its own moat. The ditch stations are filtered by the typed run that owns
    //    the nearest ring vertex — the SAME `runOfVertex` map the ink and the claim use.
    if (ring.ditch && runs.length) {
      const ditchRuns = alignRuns(ring.ditch, runs, ring.polygon);
      let dd = '';
      for (const r of ditchRuns) {
        if (ring.runs && ring.runOfVertex) {
          const mid = r[Math.floor(r.length / 2)];
          let bi = 0, bd = Infinity;
          for (let i = 0; i < ring.polygon.length; i++) {
            const p = ring.polygon[i];
            const q = (p[0] - mid[0]) * (p[0] - mid[0]) + (p[1] - mid[1]) * (p[1] - mid[1]);
            if (q < bd) { bd = q; bi = i; }
          }
          const run = ring.runs[ring.runOfVertex[bi]];
          if (run && run.ditch === false) continue;
        }
        dd += linePath(r); prims.n++;
      }
      if (dd) push(`<path d="${dd}" fill="none" stroke="${mix(P.paper, P.ink, 0.38)}" stroke-width="${INK.road}" stroke-dasharray="${r2(frontage * 0.6)} ${r2(frontage * 0.4)}"/>`);
    }
    if (d) push(`<path d="${d}" fill="none" stroke="${P.walls}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`);
    for (const ww of [...byWeight.keys()].sort((a, b) => a - b)) {
      push(`<path d="${byWeight.get(ww)}" fill="none" stroke="${P.walls}" stroke-width="${ww}" stroke-linecap="round" stroke-linejoin="round"/>`);
    }
    {
      // ⭐⭐ **A TOWER IS A TYPE, NOT A REPEAT** (§1.1.13b). hf315 draws ten genuinely different
      //    towers and the open-backed D and the beaked tower are FUNCTIONAL choices: the beak
      //    presents an angle to the shot that is coming, the D is open at the back because the
      //    cheap ones were. Drawn as four distinct marks batched into four paths.
      const paths = { drum: '', square: '', 'open-backed-D': '', beaked: '', angle: '' };
      const kinds = ring.towerTypes || [];
      for (let i = 0; i < ring.towers.length; i++) {
        const t = ring.towers[i];
        const kind = paths[kinds[i]] === undefined ? 'drum' : kinds[i];
        const rr = w * 1.05;
        if (kind === 'square' || kind === 'angle') {
          // A square/angle tower is a solid block set square to the page — the mark a bank or
          // a palisade corner takes, and the one a mismatched join takes.
          const k = kind === 'angle' ? rr * 1.25 : rr;
          paths[kind] += `M${r2(t[0] - k)} ${r2(t[1] - k)}h${r2(k * 2)}v${r2(k * 2)}h${r2(-k * 2)}z`;
        } else if (kind === 'beaked') {
          // The beak points AWAY from the ring's centre — outward, at the approach.
          const nx = t[0] - cx0, ny = t[1] - cy0;
          const L = Math.sqrt(nx * nx + ny * ny) || 1;
          const ux = nx / L, uy = ny / L;
          paths.beaked += `M${r2(t[0] + ux * rr * 2.0)} ${r2(t[1] + uy * rr * 2.0)}`
            + `L${r2(t[0] - uy * rr)} ${r2(t[1] + ux * rr)}`
            + `L${r2(t[0] - ux * rr)} ${r2(t[1] - uy * rr)}`
            + `L${r2(t[0] + uy * rr)} ${r2(t[1] - ux * rr)}z`;
        } else if (kind === 'open-backed-D') {
          // Open at the rear: a half-round on the outer face, closed by the curtain itself.
          const nx = t[0] - cx0, ny = t[1] - cy0;
          const L = Math.sqrt(nx * nx + ny * ny) || 1;
          const ux = nx / L, uy = ny / L;
          paths['open-backed-D'] += `M${r2(t[0] - uy * rr)} ${r2(t[1] + ux * rr)}`
            + `A${r2(rr)} ${r2(rr)} 0 0 1 ${r2(t[0] + uy * rr)} ${r2(t[1] - ux * rr)}`
            + `L${r2(t[0] + uy * rr - ux * rr * 0.15)} ${r2(t[1] - ux * rr - uy * rr * 0.15)}z`;
        } else {
          paths.drum += `M${r2(t[0] - rr)} ${r2(t[1])}a${r2(rr)} ${r2(rr)} 0 1 0 ${r2(rr * 2)} 0a${r2(rr)} ${r2(rr)} 0 1 0 ${r2(-rr * 2)} 0`;
        }
        prims.n++;
      }
      for (const k of ['drum', 'square', 'open-backed-D', 'beaked', 'angle']) {
        if (paths[k]) push(`<path d="${paths[k]}" fill="${P.walls}" stroke="none"/>`);
      }
    }
    // ⭐⭐ THE GATEHOUSE (chair directive §195.4): "the road passes through a STRUCTURE, not a
    //    gap in a line." The b4 gate was two stub dashes either side of a break, which reads
    //    as a drafting omission. A gate was the most heavily built thing on a circuit — a
    //    tower pair with a passage between them (§161m.4) — so it is drawn as one: two solid
    //    piers flanking the road, and the passage between them left as paper.
    let bd = '';
    {
      let piers = '';
      for (const g of ring.gates) {
        const nx = -g.dy, ny = g.dx, o = m.builtRadius * 0.045;
        // A BRICKED gate (§161g) is drawn CLOSED — the most legible demotion tell there is.
        if (g.bricked) bd += `M${r2(g.x + nx * o)} ${r2(g.y + ny * o)}L${r2(g.x - nx * o)} ${r2(g.y - ny * o)}`;
        // The pier: a short solid block, square to the wall, on each side of the opening.
        const pw = w * 2.1, pl = o * 0.62;
        for (const side of [1, -1]) {
          const cx = g.x + nx * o * (1 - 0.30) * side * (side > 0 ? 1 : 1) * (side > 0 ? 1 : 1);
          void cx;
          const px = g.x + nx * o * 0.72 * side, py = g.y + ny * o * 0.72 * side;
          const q = [
            [px - g.dx * pw - nx * pl, py - g.dy * pw - ny * pl],
            [px + g.dx * pw - nx * pl, py + g.dy * pw - ny * pl],
            [px + g.dx * pw + nx * pl, py + g.dy * pw + ny * pl],
            [px - g.dx * pw + nx * pl, py - g.dy * pw + ny * pl],
          ];
          piers += polyPath(q);
          prims.n++;
        }
      }
      if (piers) push(`<path d="${piers}" fill="${P.walls}" stroke="${P.walls}" stroke-width="${r2(w * 0.5)}" stroke-linejoin="round"/>`);
    }
    if (bd) push(`<path d="${bd}" fill="none" stroke="${P.walls}" stroke-width="${INK.wall}" stroke-linecap="round"/>`);

    // ⭐⭐ THE WATER GATE (§161m.3, chair directive §195.1). Where the circuit crosses the
    //    channel the wall does not stop — it closes with a marked work. The arch is drawn as
    //    a pair of abutments on the banks; a GRATED one carries its bars, which is the same
    //    one-glance order read as the §5.0e wall foot.
    for (const wg of (ring.waterGates || [])) {
      const nx = -wg.dy, ny = wg.dx;
      const half = wg.span * 0.62, ab = w * 2.4;
      let ad = '';
      for (const side of [1, -1]) {
        const bx = wg.x + wg.dx * half * side, by = wg.y + wg.dy * half * side;
        ad += `M${r2(bx - nx * ab)} ${r2(by - ny * ab)}L${r2(bx + nx * ab)} ${r2(by + ny * ab)}`;
        prims.n++;
      }
      push(`<path d="${ad}" fill="none" stroke="${P.walls}" stroke-width="${r2(w * 1.15)}" stroke-linecap="round"/>`);
      if (wg.grated) {
        let bars = '';
        for (let i = 1; i <= 4; i++) {
          const t = (i / 5 - 0.5) * 2 * half;
          const bx = wg.x + wg.dx * t, by = wg.y + wg.dy * t;
          bars += `M${r2(bx - nx * ab * 0.5)} ${r2(by - ny * ab * 0.5)}L${r2(bx + nx * ab * 0.5)} ${r2(by + ny * ab * 0.5)}`;
          prims.n++;
        }
        push(`<path d="${bars}" fill="none" stroke="${P.walls}" stroke-width="${INK.gate}" stroke-linecap="round"/>`);
      }
    }
  }

  // ── ⭐⭐⭐ 15a · §250.5 · THE FOSSILS OF A SUPERSEDED CIRCUIT. Drawn AFTER the standing wall
  //    because that is the reading order: this is what the wall the town outgrew has become.
  //    ⭐ AND IT IS HOW A TOWN LOOKS OLD AT A GLANCE WITHOUT DRAWING A SINGLE RUIN.
  if (fabric.demotion && (fabric.demotion.dwellings.length || fabric.demotion.stubs.length
    || fabric.demotion.widenings.length)) {
    const dm = fabric.demotion;
    // THE TOWER ROUNDS — ⭐ a CIRCLE where every other footprint on the leaf is rectilinear.
    // They are drawn in the FABRIC's own roof ink, not the wall's: they are houses now.
    if (dm.dwellings.length) {
      let d = '';
      for (const b of dm.dwellings) { d += polyPath(b.polygon); prims.n++; }
      push(`<path d="${d}" fill="${roofTone}" stroke="${inkTone}" stroke-width="${INK.fabric}" stroke-linejoin="round"/>`);
    }
    // THE SURVIVING MASONRY — a free-standing fragment inside the fabric, at wall weight.
    // ⚠ IT IS NOT A RUIN GLYPH. A stub is a piece of the old curtain that nobody pulled down;
    // drawing it at wall weight is what says so, and a rubble hatch would be inventing a
    // vocabulary §214's wall arm does not have.
    if (dm.stubs.length) {
      let d = '';
      for (const s of dm.stubs) { d += linePath(s.line); prims.n++; }
      push(`<path d="${d}" fill="none" stroke="${P.walls}" stroke-width="${r2(INK.wallOld * 1.35)}" stroke-linecap="butt"/>`);
    }
    // THE GATE WIDENINGS — a break in the frontage line where the ring street meets a radial.
    // The widening is drawn as the pale carriageway it became, in the ring street's own tone.
    if (dm.widenings.length) {
      let d = '';
      for (const g of dm.widenings) {
        d += `M${r2(g.x - g.radius)} ${r2(g.y)}a${r2(g.radius)} ${r2(g.radius)} 0 1 0 ${r2(g.radius * 2)} 0a${r2(g.radius)} ${r2(g.radius)} 0 1 0 ${r2(-g.radius * 2)} 0`;
        prims.n++;
      }
      push(`<path d="${d}" fill="${mix(roadTone, P.ink, 0.10)}" stroke="none"/>`);
    }
  }

  // ── 15b · ⭐⭐ §10 THE STATE EXPRESSIONS, in CALM INK. Drawn after the wall because a barred
  //    gate and a besieger's camp are both facts ABOUT the circuit. The register law is
  //    absolute: a siege is a row of small tents on a road, a plague is four short bars, a
  //    famine is a market place with its stall rows marked out and nothing on them. Nothing
  //    here is coloured differently from the rest of the leaf.
  if (fabric.stateMarks) {
    const S = fabric.stateMarks;
    let tents = '';
    for (const b of S.bodies) { tents += polyPath(b.polygon); prims.n++; }
    if (tents) {
      push(`<path d="${tents}" fill="${mix(P.paper, P.roofs, 0.42)}" stroke="${inkTone}" stroke-width="${INK.yard}" stroke-linejoin="round"/>`);
    }
    let ink = '', hollow = '';
    for (const mk of S.marks) {
      if (mk.kind === 'barredGate' || mk.kind === 'quarantineBar') {
        const nx = -mk.dy, ny = mk.dx, o = m.builtRadius * 0.035;
        for (let i = -1; i <= 1; i++) {
          const t = i * o * 0.42;
          ink += `M${r2(mk.x + nx * o + mk.dx * t)} ${r2(mk.y + ny * o + mk.dy * t)}`
            + `L${r2(mk.x - nx * o + mk.dx * t)} ${r2(mk.y - ny * o + mk.dy * t)}`;
          prims.n++;
        }
      } else if (mk.kind === 'watchFire') {
        // A watch-fire is a ring with a cross in it — a fire kept, not a fire burning.
        ink += `M${r2(mk.x - mk.r)} ${r2(mk.y)}a${r2(mk.r)} ${r2(mk.r)} 0 1 0 ${r2(mk.r * 2)} 0a${r2(mk.r)} ${r2(mk.r)} 0 1 0 ${r2(-mk.r * 2)} 0`
          + `M${r2(mk.x - mk.r * 0.6)} ${r2(mk.y - mk.r * 0.6)}L${r2(mk.x + mk.r * 0.6)} ${r2(mk.y + mk.r * 0.6)}`;
        prims.n++;
      } else if (mk.kind === 'barricade') {
        const L = Math.sqrt(mk.dx * mk.dx + mk.dy * mk.dy) || 1;
        const nx = -mk.dy / L, ny = mk.dx / L, h = mk.w * 0.6;
        ink += `M${r2(mk.x - nx * h)} ${r2(mk.y - ny * h)}L${r2(mk.x + nx * h)} ${r2(mk.y + ny * h)}`;
        prims.n++;
      } else if (mk.kind === 'trampled') {
        for (let i = -2; i <= 2; i++) {
          const c2 = cosI(mk.ang), s2 = sinI(mk.ang);
          const px = mk.x - s2 * i * mk.r * 0.32, py = mk.y + c2 * i * mk.r * 0.32;
          ink += `M${r2(px - c2 * mk.r * 0.5)} ${r2(py - s2 * mk.r * 0.5)}L${r2(px + c2 * mk.r * 0.5)} ${r2(py + s2 * mk.r * 0.5)}`;
          prims.n++;
        }
      } else if (mk.kind === 'emptyStall') {
        hollow += polyPath(mk.polygon); prims.n++;
      } else if (mk.kind === 'publicWork') {
        ink += `M${r2(mk.x - mk.r)} ${r2(mk.y)}a${r2(mk.r)} ${r2(mk.r)} 0 1 0 ${r2(mk.r * 2)} 0a${r2(mk.r)} ${r2(mk.r)} 0 1 0 ${r2(-mk.r * 2)} 0`
          + `M${r2(mk.x - mk.r * 0.45)} ${r2(mk.y)}a${r2(mk.r * 0.45)} ${r2(mk.r * 0.45)} 0 1 0 ${r2(mk.r * 0.9)} 0a${r2(mk.r * 0.45)} ${r2(mk.r * 0.45)} 0 1 0 ${r2(-mk.r * 0.9)} 0`;
        prims.n++;
      }
    }
    if (hollow) push(`<path d="${hollow}" fill="none" stroke="${inkTone}" stroke-width="${INK.yard}" stroke-opacity="0.75" stroke-linejoin="round"/>`);
    if (ink) push(`<path d="${ink}" fill="none" stroke="${P.walls}" stroke-width="${INK.landmarkMinor}" stroke-linecap="round"/>`);
  }

  // ── 15c · ⭐⭐ §18.1 THE SANCTUARY / LIBERTY BOUND. A light dashed line round the precinct's
  //    own ward, with a BOUNDARY STONE at each corner of its bounding compass. See
  //    organisms.derivePrecincts for why the corner mark is a STONE and not the charter's
  //    "cross" — a sanctuary bound is exactly where one culture's mark would be most
  //    conspicuous, and the deity doctrine forbids it.
  if (fabric.precincts && fabric.precincts.length) {
    let d = '', stones = '';
    for (const pr of fabric.precincts) {
      const part = fabric.umbrella.partition.find((q) => q.organismKey === pr.organismKey);
      if (!part || !part.polygon || part.polygon.length < 3) continue;
      // The bound is the ward's own outline pulled IN by a plot frontage: a precinct wall
      // stood inside the ground it enclosed, and the pull keeps the dashes off the fabric.
      const c = part.centroid;
      const pull = frontage * 0.9;
      const ring = part.polygon.map((p) => {
        const vx = p[0] - c[0], vy = p[1] - c[1];
        const L = Math.sqrt(vx * vx + vy * vy) || 1;
        return [p[0] - (vx / L) * pull, p[1] - (vy / L) * pull];
      });
      d += polyPath(ring);
      prims.n++;
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const p of ring) {
        if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0];
        if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1];
      }
      const sr = Math.max(1.6, frontage * 0.28);
      for (const [sx, sy] of [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]) {
        stones += `M${r2(sx - sr)} ${r2(sy)}L${r2(sx)} ${r2(sy - sr * 1.4)}L${r2(sx + sr)} ${r2(sy)}L${r2(sx)} ${r2(sy + sr * 1.4)}Z`;
        prims.n++;
      }
    }
    if (d) push(`<path d="${d}" fill="none" stroke="${mix(P.paper, P.ink, 0.58)}" stroke-width="${INK.field}" stroke-dasharray="${r2(frontage * 0.7)} ${r2(frontage * 0.5)}"/>`);
    if (stones) push(`<path d="${stones}" fill="${mix(P.paper, P.ink, 0.66)}" stroke="none"/>`);
  }

  // ── 16 · WARD LABELS ARE NO LONGER DRAWN HERE (§173, MF-B6). Every letter on this leaf now
  //    goes through the LETTERING SPLICE at the foot of this function — a separate stage over
  //    the FINISHED draw list, on `injectFog`'s precedent. See lettering.js for why text
  //    placement is the one decision that cannot be made while the page is still being
  //    written, and for the curved-along-its-quarter derivation that replaces the horizontal
  //    bow this block used to draw (a bow a HASH chose, carrying no information about the
  //    quarter it named).

  // ── 17 · THE FOLIO CHROME — cartouche + compass.
  //    ⛔ THE CARTOUCHE OVERPRINT (target 7), and the cause was not the text. The scale bar
  //    was drawn at `cy0 + ch − 9`, which is the SAME baseline the morphology line uses, so
  //    "10 PLOT FRONTAGES" printed straight through "WATER BANKSIDE" in every exemplar that
  //    had both. The bar now has its own rule at the foot of a taller box, and the metadata
  //    lines have a declared leading instead of hand-placed offsets — which is also what
  //    stops the next line that gets added from silently landing on top of something.
  const serif = "Georgia,'Iowan Old Style','Times New Roman',serif";
  const cw = 348, ch = 116, cx0 = 26, cy0 = 1000 - ch - 26;
  const LEAD = 14.5;
  push(`<rect x="${cx0}" y="${cy0}" width="${cw}" height="${ch}" fill="${mix(P.paper, P.elements, 0.55)}" stroke="${inkTone}" stroke-width="1.3"/>`);
  push(`<rect x="${cx0 + 4.5}" y="${cy0 + 4.5}" width="${cw - 9}" height="${ch - 9}" fill="none" stroke="${inkTone}" stroke-width="0.6"/>`);
  push(`<text x="${cx0 + 16}" y="${cy0 + 33}" font-family="${serif}" font-size="23" fill="${P.labels}" letter-spacing="1.1">${esc(m.name)}</text>`);
  push(`<text x="${cx0 + 16}" y="${cy0 + 51}" font-family="${serif}" font-size="10.5" fill="${inkTone}" letter-spacing="1.5">${esc(String(m.tier).toUpperCase())} · ${esc(String(m.population))} SOULS · ${esc(String(m.prosperity).toUpperCase())}</text>`);
  {
    const ratio = m.representative ? `FABRIC 1 : ${m.representationRatio.toFixed(1)} HOUSEHOLDS (REPRESENTATIVE)` : 'FABRIC 1 : 1 WITH THE HOUSING CENSUS';
    const lines = [
      ratio,
      `${m.morphology.toUpperCase()} PLAN · FOUNDED ${m.foundingKind.toUpperCase()} · WATER ${m.waterMode.toUpperCase()}`,
      `${String(m.landform).toUpperCase()}${m.forcedReconciliation ? ' (RECONCILED)' : ''} · RELIEF ${m.relief.toFixed(2)}`,
    ];
    lines.forEach((t, i) => {
      push(`<text x="${cx0 + 16}" y="${r2(cy0 + 66 + i * LEAD)}" font-family="${serif}" font-size="8.4" fill="${inkTone}" letter-spacing="0.9" opacity="0.84">${esc(t)}</text>`);
    });
  }
  // ⭐⭐⭐ THE SCALE BAR IS TRUE (§11.12a, MF-B6). It used to read "10 PLOT FRONTAGES" — honest,
  // and RELATIVE, which is exactly what §11.12a forbids ("never as decorative relative
  // units"). It now consumes the minted measure: a round count of units chosen off the
  // 1/2/5 ladder, drawn at its own true length, with a QUARTER DIVISION at the left end
  // (the surveyor's habit — the first interval is subdivided so a reader can step off a
  // fraction). ⚠ The UNIT NAME is PENDING-OB-4 and prints PACES until the owner's table is
  // signed; the LENGTH is derived and does not move when the name does.
  {
    const bar = fabric.measure
      ? scaleBarFor(fabric.measure, cw * 0.42)
      : { drawnUnits: fabric.web.plotFrontage * 10, label: '10 PLOT FRONTAGES' };
    const drawnBar = Math.max(24, Math.min(bar.drawnUnits, cw * 0.42));
    const bx = cx0 + cw - 18 - drawnBar, by = cy0 + ch - 13;
    let d = `M${r2(bx)} ${r2(by)}L${r2(bx + drawnBar)} ${r2(by)}`
      + `M${r2(bx)} ${r2(by - 3.4)}L${r2(bx)} ${r2(by + 3.4)}`
      + `M${r2(bx + drawnBar)} ${r2(by - 3.4)}L${r2(bx + drawnBar)} ${r2(by + 3.4)}`;
    for (let q = 1; q <= 3; q++) {
      const qx = bx + (drawnBar / 4) * (q / 4) * 4 * 0.25;
      d += `M${r2(qx)} ${r2(by - 2)}L${r2(qx)} ${r2(by + 2)}`;
    }
    push(`<path d="${d}" stroke="${inkTone}" stroke-width="1.2" fill="none"/>`);
    push(`<text x="${r2(bx + drawnBar / 2)}" y="${r2(by - 5.5)}" font-family="${serif}" font-size="7" fill="${inkTone}" text-anchor="middle">${esc(bar.label)}</text>`);
  }

  // ⭐⭐ §12.4 THE DERIVED DEVICE, in the cartouche. Culture-neutral charges from the
  // settlement's own facts (see immersion.deriveHeraldry for why the vocabulary is natural
  // and occupational only). A settlement whose facts earn no charge bears NO arms, and the
  // shield is not drawn at all — §8.2 rather than an empty escutcheon.
  if (fabric.immersion && fabric.immersion.heraldry.charges.length) {
    const H = fabric.immersion.heraldry;
    const sx = cx0 + cw - 44, sy = cy0 + 14, sw = 30, sh = 36;
    const shield = `M${r2(sx)} ${r2(sy)}h${r2(sw)}v${r2(sh * 0.55)}`
      + `q0 ${r2(sh * 0.45)} ${r2(-sw / 2)} ${r2(sh * 0.45)}`
      + `q${r2(-sw / 2)} 0 ${r2(-sw / 2)} ${r2(-sh * 0.45)}Z`;
    push(`<path d="${shield}" fill="${mix(P.paper, P.elements, 0.30)}" stroke="${inkTone}" stroke-width="1.0"/>`);
    const mx = sx + sw / 2, my = sy + sh * 0.42;
    // THE FIELD DIVISION — one line, in the ink, which is what a division IS.
    let dv = '';
    if (H.field === 'perFess') dv = `M${r2(sx)} ${r2(sy + sh * 0.42)}h${r2(sw)}`;
    else if (H.field === 'perPale') dv = `M${r2(mx)} ${r2(sy)}v${r2(sh * 0.86)}`;
    else if (H.field === 'perBend') dv = `M${r2(sx)} ${r2(sy)}L${r2(sx + sw)} ${r2(sy + sh * 0.8)}`;
    if (dv) push(`<path d="${dv}" fill="none" stroke="${inkTone}" stroke-width="0.7" stroke-opacity="0.7"/>`);
    let g = '';
    H.charges.forEach((ch2, i) => {
      const px = H.charges.length > 1 && H.field === 'perPale' ? mx + (i ? 7 : -7) : mx;
      const py = H.charges.length > 1 && H.field !== 'perPale' ? my + (i ? 8 : -9) : my;
      g += chargeGlyph(ch2, px, py, 6.2);
    });
    push(`<path d="${g}" fill="none" stroke="${P.labels}" stroke-width="0.85" stroke-linecap="round" stroke-linejoin="round"/>`);
    prims.n += 2 + H.charges.length;
  }

  const nx0 = 918, ny0 = 84, nr = 30;
  push(`<circle cx="${nx0}" cy="${ny0}" r="${nr}" fill="${mix(P.paper, P.elements, 0.4)}" stroke="${inkTone}" stroke-width="0.9"/>`);
  push(`<circle cx="${nx0}" cy="${ny0}" r="${nr * 0.72}" fill="none" stroke="${inkTone}" stroke-width="0.45"/>`);
  {
    let d = '';
    for (let k = 0; k < 8; k++) {
      const a = Math.round((k * TRIG_N) / 8);
      const rIn = k % 2 === 0 ? nr * 0.12 : nr * 0.10;
      const rOut = k % 2 === 0 ? nr : nr * 0.55;
      d += `M${r2(nx0 + cosI(a) * rOut)} ${r2(ny0 + sinI(a) * rOut)}L${r2(nx0 + cosI(a - 22) * rIn)} ${r2(ny0 + sinI(a - 22) * rIn)}L${r2(nx0 + cosI(a + 22) * rIn)} ${r2(ny0 + sinI(a + 22) * rIn)}Z`;
    }
    push(`<path d="${d}" fill="${mix(P.paper, P.ink, 0.60)}" stroke="${inkTone}" stroke-width="0.55"/>`);
  }
  push(`<text x="${nx0}" y="${ny0 - nr - 7}" font-family="${serif}" font-size="13" fill="${P.labels}" text-anchor="middle">N</text>`);

  // ── 18 · ⭐⭐ THE IN-WORLD LEGEND (§12.7, and the chair's §195.2 disposal).
  //
  // §12.7: "a period legend box teaching the map's own conventions — onboarding as
  // immersion." It is also the DISPOSAL the chair asked for on the dashed and dotted marks:
  // "if the dotted boxes are reserved-compound markers they need either the legend or
  // removal." They are neither guides nor compounds — a dotted outline is a ROOFLESS SHELL
  // (§161g's ruin grammar) and a dashed ring outside the wall is its DITCH (§161b's visible
  // work). Both are real, derived, sourced marks; what they lacked was a place that says so.
  // ⭐ AND THE LEGEND IS DERIVED, NOT PRINTED. Only the conventions THIS leaf actually uses
  // appear — a town with no ditch has no ditch row — so the box can never teach a mark the
  // reader cannot find, which is the §8.2 one-source rule applied to chrome.
  /** The legend's own box, handed to the §173 splice so no letter lands on it. */
  let legendBox = null;
  if (lensAllows(LENS.id, 'legend') && m.wardLabels !== undefined) {
    const rows = [];
    if (fabric.walls.some((w) => w.ditch)) rows.push({ kind: 'ditch', text: 'DITCH AND BANK BEFORE THE WALL' });
    if (fabric.walls.some((w) => (w.gates || []).length)) rows.push({ kind: 'gate', text: 'GATEHOUSE — THE ROAD PASSES THROUGH' });
    if (fabric.walls.some((w) => (w.waterGates || []).length)) rows.push({ kind: 'watergate', text: 'WATER GATE, BARRED' });
    if ((fabric.bridges || []).length) rows.push({ kind: 'bridge', text: 'BRIDGE' });
    if (fabric.parcels.some((p) => p.derelict)) rows.push({ kind: 'derelict', text: 'ROOFLESS SHELL — STANDING WALLS, NO ROOF' });
    if (fabric.landmarks.some((l) => l.monumental)) rows.push({ kind: 'landmark', text: 'HALL, CHURCH OR OTHER GREAT BUILDING' });
    if (fabric.umbrella.greens.length) rows.push({ kind: 'green', text: 'COMMON GROUND — GRAZED, NEVER BUILT' });
    // ⭐⭐ THE LEGEND IS OP-PRICED INSIDE THE CEILING (§12's own clause: "chrome is not exempt
    // from the ration law"). It is drawn LAST, so the budget it has left is known exactly —
    // and a leaf at its ceiling teaches fewer conventions rather than breaking the ration.
    // The rows are already in importance order, so what falls off the end is the least
    // load-bearing convention on the page. MEASURED: the coastal city keeps five of seven.
    // ⛔⛔ AND THE LEGEND NOW RESERVES ROOM FOR THE LETTERS FIRST. The legend self-rations to
    // fill whatever the draw pass left, which made it GREEDY: at the coastal city it ate the
    // last of the budget and the §173 splice came back with ZERO ward names, zero marginalia
    // and zero event captions — the leaf lost its own place-names to keep a row explaining
    // what a bridge is. ⭐ THE PRIORITY IS EXPLICIT NOW AND IT IS THE RIGHT WAY ROUND: **NAMES
    // BEFORE CONVENTIONS.** The reserve is the lettering's own estimated cost, computed from
    // the same ward candidates the splice will keep, so it is a measurement rather than a
    // margin.
    const letterReserve = estimateLetteringOps(fabric, m, LENS);
    const budget = Math.max(0, CEIL - prims.n - 4 - letterReserve);
    if (rows.length > Math.floor(budget / 2)) rows.length = Math.max(0, Math.floor(budget / 2));
    if (rows.length) {
      const lw = 300, lh = 18 + rows.length * 15, lx = 1000 - lw - 26, ly = 1000 - lh - 26;
      legendBox = { x: lx - 2, y: ly - 2, w: lw + 4, h: lh + 4 };
      push(`<rect x="${lx}" y="${ly}" width="${lw}" height="${lh}" fill="${mix(P.paper, P.elements, 0.55)}" stroke="${inkTone}" stroke-width="0.9"/>`);
      push(`<rect x="${r2(lx + 3)}" y="${r2(ly + 3)}" width="${r2(lw - 6)}" height="${r2(lh - 6)}" fill="none" stroke="${inkTone}" stroke-width="0.35"/>`);
      out.push(`<g id="legend" font-family="${serif}" font-size="7.4" fill="${P.labels}" letter-spacing="0.5">`);
      rows.forEach((row, i) => {
        const y = ly + 15 + i * 15, kx = lx + 12;
        // The swatch is DRAWN IN THE SAME INK AS THE MARK IT NAMES — a legend whose sample
        // does not match the page teaches the wrong thing, which is worse than no legend.
        if (row.kind === 'ditch') push(`<path d="M${r2(kx)} ${r2(y - 2)}L${r2(kx + 22)} ${r2(y - 2)}" fill="none" stroke="${mix(P.paper, P.ink, 0.38)}" stroke-width="${INK.road}" stroke-dasharray="${r2(frontage * 0.6)} ${r2(frontage * 0.4)}"/>`);
        else if (row.kind === 'derelict') push(`<rect x="${r2(kx + 4)}" y="${r2(y - 7)}" width="14" height="9" fill="none" stroke="${inkTone}" stroke-width="${INK.fabric}" stroke-dasharray="${r2(frontage * 0.22)} ${r2(frontage * 0.16)}"/>`);
        else if (row.kind === 'gate') push(`<path d="M${r2(kx + 2)} ${r2(y - 7)}h5v9h-5zM${r2(kx + 15)} ${r2(y - 7)}h5v9h-5z" fill="${P.walls}" stroke="none"/>`);
        else if (row.kind === 'watergate') push(`<path d="M${r2(kx + 2)} ${r2(y - 7)}v9M${r2(kx + 20)} ${r2(y - 7)}v9M${r2(kx + 8)} ${r2(y - 6)}v7M${r2(kx + 14)} ${r2(y - 6)}v7" fill="none" stroke="${P.walls}" stroke-width="${INK.gate}"/>`);
        else if (row.kind === 'bridge') push(`<path d="M${r2(kx + 1)} ${r2(y - 6)}h20v7h-20zM${r2(kx + 8)} ${r2(y - 6)}v7M${r2(kx + 14)} ${r2(y - 6)}v7" fill="${roadTone}" stroke="${inkTone}" stroke-width="${INK.landmarkMinor}"/>`);
        else if (row.kind === 'landmark') push(`<rect x="${r2(kx + 3)}" y="${r2(y - 7)}" width="16" height="9" fill="${mix(roofTone, P.ink, 0.42)}" stroke="${inkTone}" stroke-width="${INK.landmark}"/>`);
        else push(`<rect x="${r2(kx + 3)}" y="${r2(y - 7)}" width="16" height="9" fill="${FIELD_TONES[0]}" stroke="${fieldInk}" stroke-width="${INK.field}"/>`);
        prims.n++;
        push(`<text x="${r2(lx + 44)}" y="${r2(y)}">${esc(row.text)}</text>`);
        prims.n++;
      });
      out.push('</g>');
    }
  }

  out.push('</svg>');

  // ── 19 · ⭐⭐⭐ §173 THE LETTERING SPLICE — a SEPARATE STAGE OVER THE FINISHED DRAW LIST.
  //
  // Everything above is now written. The chrome has claimed its boxes and can hand them
  // over; the event marks are on the ground and their captions can be placed beside them;
  // the quarters are drawn and their names can follow their own shapes. `injectFog`'s
  // contract holds exactly: an EMPTY fragment returns the base BYTE-IDENTICAL, so a leaf
  // with nothing to letter is bit-for-bit the leaf without this stage.
  const base = out.join('\n');
  const reserved = [
    { x: cx0 - 2, y: cy0 - 2, w: cw + 4, h: ch + 4 },                       // the cartouche
    { x: nx0 - nr - 6, y: ny0 - nr - 22, w: nr * 2 + 12, h: nr * 2 + 28 },  // the compass
  ];
  if (legendBox) reserved.push(legendBox);
  const lettering = letteringFragment({
    fabric,
    palette: P,
    reserved,
    // §12: chrome is not exempt from the ration law. The splice spends what the draw pass
    // left and no more — and because it runs LAST, the budget it has is known exactly.
    budget: Math.max(0, CEIL - prims.n),
    allowNotes: lensAllows(LENS.id, 'marginalia'),
  });
  prims.n += lettering.ops;
  els += lettering.fragment ? 1 : 0;

  void absArea; void opts;
  return {
    svg: spliceLettering(base, lettering.fragment),
    elementCount: els,
    primitiveCount: prims.n,
    opCount: els,
    lettering: lettering.reason,
  };
}
