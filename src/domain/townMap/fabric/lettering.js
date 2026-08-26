/**
 * domain/townMap/fabric/lettering.js — ⭐⭐⭐ §173 THE LETTERING SPLICE.
 *
 * ⭐⭐ WHY LETTERING IS A SEPARATE STAGE AT ALL, and it is the whole argument for this module:
 * **TEXT PLACEMENT IS THE ONE DECISION THAT CANNOT BE MADE UNTIL EVERYTHING ELSE ON THE PAGE
 * EXISTS.** A ward name has to know where the cartouche is; a marginal note has to know where
 * the legend is; an event caption has to know where its own mark ended up and where the other
 * captions went. Deriving letters inside the draw pass means each one is placed against a
 * page that is still being written, which is how "'XIOUS TRADES QUAR'" happened (§195.3) and
 * how two notes end up on top of each other.
 *
 * THE CHANNEL FOLLOWS `injectFog`'s PRECEDENT EXACTLY (fogGeometry.js:287): a PURE function
 * produces a self-contained fragment; a second pure function splices it in before the closing
 * tag; an EMPTY fragment returns the base BYTE-IDENTICAL. That last clause is the one that
 * makes the channel safe — a leaf with no lettering is bit-for-bit the leaf without this
 * module, so the splice can never be blamed for a byte it did not write.
 *
 * ⭐ THE OCCUPANCY MODEL IS A LIST OF RESERVED BOXES, NOT A RASTER. The chrome the draw pass
 * has already placed (cartouche, legend, compass) hands its boxes over; every letter this
 * module places joins the list as it is placed. It is O(n²) over a handful of items and it is
 * EXACT, which a coverage raster would not be.
 *
 * PURITY: pure functions returning strings. No Date, no Math.random, no runtime trig, no
 * Math.pow. Nothing here reads or writes the fabric.
 */

import { cosI, sinI, TRIG_N, r2, linePath, bearingIndex } from './fabricGeometry.js';

/** Escape for XML text content and attribute values. */
export const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * ⭐ THE TEXT METRIC, stated as an approximation because it IS one. There is no font engine
 * in a pure derivation, so a serif capital's advance is taken at 0.52 of the font size plus
 * the tracking. Every fit decision below therefore has a MARGIN built into it rather than a
 * promise: the §195.3 lesson is that a label which cannot fit must lose a WORD, and a
 * conservative metric is what makes that branch fire before the renderer clips anything.
 *
 * ⛔⛔⛔ **AND THE CLAIM IN THE PARAGRAPH ABOVE IS FALSE IN THE ONLY DIRECTION THAT MATTERS.
 * 0.52 IS NOT CONSERVATIVE; IT UNDERSTATES A SERIF CAPITAL BY 1.364×** (⟦CAR-WORDS⟧, ODQ
 * §713). MEASURED with `canvas.measureText` at 1000 px against the shipped stack itself —
 * Georgia, Iowan Old Style, Times New Roman and the generic serif, roman and italic — the
 * A–Z **maximum** advance averages **0.7093 em**, and no capital in the alphabet is as narrow
 * as 0.52 except `I` (0.3896), `J` (0.5176) and `S` (0.5610). `M` is 0.9272 and `W` is 1.0371.
 *
 * ⭐⭐ THE CLASS, AND IT IS THE THIRD SIGHTING IN THREE WAVES (§711.6, §712.7): **ONE SHARED
 * NUMBER READ BY THREE CONSUMERS, WRONG AT ALL THREE, AND NOTHING REDS — because each consumer
 * is internally consistent.** The three, and the direction each fails in:
 *   1. `glyphsAlong` steps glyph centres by `size·ADVANCE + tracking`, so a step of 6.61 u
 *      carries an `M` that is 9.74 u wide — a **47 % overlap**. That is review finding **C3**,
 *      `COMMON` rendering as `CCMYON`, reproduced here by arithmetic before it was believed.
 *   2. `textWidth` sizes the boxes `placeBox` reserves, so every marginal note and event
 *      caption reserves a box **~1.3× too narrow** and the collision avoidance under-reserves.
 *      That is **C3's SECOND clause** — "event labels pile over dense fabric *and each other*".
 *   3. `fitLabel` decides whether a name fits, so the §195.3 word-dropping branch **under-fires**
 *      and a label that cannot fit is never asked to lose its generic word.
 * ⭐ One constant explains both halves of a review finding that was filed as two.
 *
 * ⚠ THE TABLE IS THE **PER-GLYPH MAXIMUM ACROSS THE WHOLE STACK**, not Georgia's own metrics,
 * and that correction was itself measured: Georgia is **not** the widest face in its own stack
 * (33 per-glyph violations — Iowan's `O` is 0.8018 against Georgia's 0.7441). A table taken
 * from the first-choice face would still under-step wherever the reader's machine falls back.
 * Freezing the maximum is what makes the word "conservative" true.
 *
 * ⛔ IT IS FROZEN SOURCE, ON `trigTable.js`'s OWN PRECEDENT, and for the same reason: a metric
 * DERIVED at load is a metric a future edit can silently re-derive against a different font
 * set. These are literals; their provenance is the receipt, and a machine without Georgia gets
 * the same drawing as a machine with it.
 */
export const ADVANCE = 0.52;

/**
 * Per-glyph advance in ems — the maximum over {Georgia, Iowan Old Style, Times New Roman,
 * generic serif} × {roman, italic}. Anything absent takes `DEFAULT_ADVANCE`, which is wider
 * than every measured capital but `M` and `W`, so an unmeasured character over-reserves. Over-
 * reserving is the safe direction at every consumer above.
 */
export const DEFAULT_ADVANCE = 0.80;
export const CAP_ADVANCE = Object.freeze({
  A: 0.7222, B: 0.6670, C: 0.7070, D: 0.7808, E: 0.6533, F: 0.6108, G: 0.7422,
  H: 0.8149, I: 0.3896, J: 0.5176, K: 0.7222, L: 0.6108, M: 0.9272, N: 0.8081,
  O: 0.8018, P: 0.6108, Q: 0.8018, R: 0.7031, S: 0.5610, T: 0.6309, U: 0.7871,
  V: 0.7222, W: 1.0371, X: 0.7222, Y: 0.7222, Z: 0.6670,
  0: 0.6138, 1: 0.5562, 2: 0.5586, 3: 0.5562, 4: 0.5649, 5: 0.5562,
  6: 0.5659, 7: 0.5562, 8: 0.5962, 9: 0.5659,
  ' ': 0.2778, "'": 0.2153, '’': 0.3330, '.': 0.2778, ',': 0.2778, '-': 0.3740,
  '&': 0.8311, '·': 0.3330,
});

/**
 * ⭐ THE ONE METRIC SEAM. Both spellings live behind this, so the DORMANT arm is the legacy
 * arithmetic CHARACTER FOR CHARACTER — `emWidth` of a flat metric is `n × 0.52`, which is
 * exactly what every expression below used to compute inline. The dormancy of this whole
 * module is therefore a property of one function rather than of a diff.
 * @param {boolean} words  the ⟦CAR-WORDS⟧ arm
 */
export function metricFor(words) {
  return words === true
    ? { em: (ch) => (Object.prototype.hasOwnProperty.call(CAP_ADVANCE, ch) ? CAP_ADVANCE[ch] : DEFAULT_ADVANCE), words: true }
    : { em: () => ADVANCE, words: false };
}

/**
 * The sum of a string's per-glyph em advances.
 *
 * ⛔⛔ **THE LEGACY BRANCH IS THE LITERAL LEGACY EXPRESSION, AND THAT IS NOT TIDINESS — IT IS
 * THE DORMANCY PROOF.** `n × 0.52` and `0.52` added to itself n times are ARITHMETICALLY equal
 * and **not BIT-equal**: floating-point addition is not associative, and the sum accumulates a
 * different last ULP. The first spelling of this function summed in both cases, and the
 * comment above `metricFor` claimed the dormant arm was "the legacy arithmetic CHARACTER FOR
 * CHARACTER". ⭐ IT WAS ONE LEAF SHORT OF TRUE: 28 of 29 dormant leaves rounded identically and
 * `highwater-town-parchment.svg` did not — caught by a planted control, not by the green.
 * ⚠ THE CLASS, and this estate already writes it down for the trig table: **A DORMANCY CLAIM IS
 * A BIT CLAIM, AND "ARITHMETICALLY IDENTICAL" DOES NOT DISCHARGE IT.** A corpus one leaf smaller
 * would have shown a clean zero and shipped the drift.
 */
export function emWidth(s, metric = metricFor(false)) {
  if (!metric.words) return String(s).length * ADVANCE;   // the legacy expression, verbatim
  let w = 0;
  for (const ch of String(s)) w += metric.em(ch);
  return w;
}

export const textWidth = (s, fontSize, tracking = 0, metric = metricFor(false)) =>
  // ⛔ same law as `emWidth`: the dormant arm evaluates the ORIGINAL expression, not an
  // equivalent one. `n·(size·A + t)` ≠ `size·(n·A) + n·t` in the last ULP.
  (metric.words
    ? fontSize * emWidth(s, metric) + String(s).length * tracking
    : String(s).length * (fontSize * ADVANCE + tracking));

/**
 * ⭐⭐⭐ ⟦CAR-WORDS⟧ D5's GUARANTEE — **A QUARTER'S NAME IS WRITTEN INSIDE THE QUARTER.**
 *
 * R-DEVLOG **D5**: area-label placement wants the standard algorithm, not bespoke heuristics —
 * the reference author's own from-scratch labelling was imperfect *"particularly with curved
 * labels"* and he replaced it, five years later, with a straight-skeleton-based one.
 *
 * ⛔ MEASURED HERE BEFORE ANYTHING WAS WRITTEN, so the cure has a subject: of 51 ward labels
 * over the corpus, **THREE PUT EVERY ONE OF THEIR GLYPHS OUTSIDE THE QUARTER THEY NAME**
 * (`polycentric`, `highwater` and `crossing`, all on a "Market Quarter"), and the city leaf
 * writes **31 % of its ward glyphs outside their own wards**. The mechanism is two-fold and
 * both halves are measured: **6 of 101 named cells have their CENTROID outside their own
 * polygon** (a horseshoe quarter wrapped round the core has its centroid in the hole), and the
 * arc-of-radius path swings out of the quarter even when the centroid is inside it.
 *
 * ⭐ WHAT IS BUILT HERE IS **NOT A STRAIGHT SKELETON, AND SAYING SO IS THE POINT.** What D5
 * actually buys is a *containment guarantee*; a straight skeleton is one of two widely-used
 * ways to get it (the other being the pole of inaccessibility, which is what `polylabel` — the
 * other standard answer — computes). This takes the guarantee and not the algorithm: the
 * anchor moves to the deepest interior point, and the path is CLIPPED to the polygon. The
 * result is assertable as a hard 100 %, which "we implemented a straight skeleton" would not be.
 */

/** Is `pt` inside `poly`? Ray casting; no trig, so the purity law is untouched. */
export function pointInPolygon(pt, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
    if (((yi > pt[1]) !== (yj > pt[1])) && (pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi)) inside = !inside;
  }
  return inside;
}

/** Distance from a point to a polygon's boundary — negative outside, so it doubles as the test. */
export function signedDepth(pt, poly) {
  let best = Infinity;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const ax = poly[j][0], ay = poly[j][1], bx = poly[i][0], by = poly[i][1];
    const dx = bx - ax, dy = by - ay;
    const L2 = dx * dx + dy * dy;
    let t = L2 > 0 ? ((pt[0] - ax) * dx + (pt[1] - ay) * dy) / L2 : 0;
    if (t < 0) t = 0; else if (t > 1) t = 1;
    const d = Math.sqrt((pt[0] - ax - dx * t) ** 2 + (pt[1] - ay - dy * t) ** 2);
    if (d < best) best = d;
  }
  return pointInPolygon(pt, poly) ? best : -best;
}

/**
 * The POLE OF INACCESSIBILITY, by bounded grid refinement — the interior point furthest from
 * the boundary. Two passes of a fixed grid rather than a priority queue, because the answer
 * only has to be a good interior anchor and a bounded loop is a bounded cost: 2 × 17² depth
 * evaluations per quarter, and the fabric draws at most four of them a leaf.
 * ⚠ Returns the centroid unchanged when the centroid is already inside — so the 95 of 101
 * cells that were never wrong do not move, and the declared shift stays attributable.
 */
export function interiorAnchor(poly, centroid) {
  if (!poly || poly.length < 3) return centroid;
  if (pointInPolygon(centroid, poly)) return centroid;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of poly) {
    if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0];
    if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1];
  }
  let best = centroid, bestD = -Infinity;
  let ax0 = x0, ay0 = y0, ax1 = x1, ay1 = y1;
  for (let pass = 0; pass < 2; pass++) {
    const N = 16;
    const sx = (ax1 - ax0) / N, sy = (ay1 - ay0) / N;
    for (let i = 0; i <= N; i++) {
      for (let j = 0; j <= N; j++) {
        const p = [ax0 + sx * i, ay0 + sy * j];
        const d = signedDepth(p, poly);
        if (d > bestD) { bestD = d; best = p; }
      }
    }
    ax0 = best[0] - sx; ax1 = best[0] + sx; ay0 = best[1] - sy; ay1 = best[1] + sy;
  }
  return bestD > 0 ? best : centroid;
}

/**
 * Clip a label path to the polygon: the LONGEST RUN of consecutive points that are inside.
 * A run is what a label can be written along; the union of scattered interior points is not.
 * Returns `[]` when nothing survives, and the caller then drops the label rather than writing
 * it across a neighbour — a blank quarter is honest, which is §195.3's own rule for words.
 */
export function clipRunToPolygon(pts, poly) {
  if (!poly || poly.length < 3) return pts;
  let bs = -1, bl = 0, cs = -1, cl = 0;
  for (let i = 0; i < pts.length; i++) {
    if (pointInPolygon(pts[i], poly)) {
      if (cs < 0) { cs = i; cl = 0; }
      cl++;
      if (cl > bl) { bl = cl; bs = cs; }
    } else { cs = -1; cl = 0; }
  }
  return bl >= 2 ? pts.slice(bs, bs + bl) : [];
}

/**
 * ⭐⭐ ⟦CAR-WORDS⟧ **L-REG-35's PLACER — THE EIGHT-POSITION RING.** The law is *"every dated
 * event label sits at its ADDRESSABLE PLACE"*, and a placer with three candidates answers a
 * weaker question than the law asks: it decides whether a label fits in one of three spots, and
 * if not the label is simply not drawn — an absence L-REG-35 must convict and the old code
 * could not even count.
 *
 * ⛔ IT WAS THE TRUE METRIC THAT EXPOSED THIS. With the boxes measured at their real width,
 * captions that had been drawn on top of one another stopped fitting and vanished instead —
 * `hamlet` 1 → 0, `village` and `mountain` 2 → 1. The pile-up was never the placer succeeding;
 * it was the placer succeeding **against a box that was 1.3× too narrow**. Widening the metric
 * without widening the search would have traded a legible defect for an invisible one.
 *
 * ⭐ THE RING IS THE STANDARD POINT-LABEL LADDER — eight positions in preference order, N and
 * S first because a horizontal label reads best above or below its mark, then the diagonals,
 * then flanking. Every candidate is WITHIN A LABEL-HEIGHT OF THE MARK, so a caption that lands
 * anywhere on the ring is still AT ITS ADDRESS; the ring buys placement, never distance.
 */
export function captionRing(x, y, r = 11) {
  return [
    { x, y: y - r + 2, anchor: 'middle' },
    { x, y: y + r + 7, anchor: 'middle' },
    { x: x + r, y: y + 3, anchor: 'start' },
    { x: x - r, y: y + 3, anchor: 'end' },
    { x: x + r * 0.8, y: y - r * 0.7 + 2, anchor: 'start' },
    { x: x - r * 0.8, y: y - r * 0.7 + 2, anchor: 'end' },
    { x: x + r * 0.8, y: y + r * 0.7 + 6, anchor: 'start' },
    { x: x - r * 0.8, y: y + r * 0.7 + 6, anchor: 'end' },
  ];
}

/** Do two boxes overlap? Boxes are {x, y, w, h}, y at the TOP. */
export function boxHits(a, b) {
  return !(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y);
}

/** Place a box at the first candidate that clears every reservation. Returns null if none. */
export function placeBox(candidates, w, h, reserved) {
  for (const c of candidates) {
    const box = { x: c.x - (c.anchor === 'middle' ? w / 2 : c.anchor === 'end' ? w : 0), y: c.y - h, w, h };
    if (box.x < 6 || box.y < 6 || box.x + box.w > 994 || box.y + box.h > 994) continue;
    let clash = false;
    for (const r of reserved) if (boxHits(box, r)) { clash = true; break; }
    if (!clash) return { ...c, box };
  }
  return null;
}

/**
 * ⭐⭐ THE CURVED WARD LABEL, ALONG ITS OWN QUARTER (§2.6: "curved uppercase ward labels along
 * ward interiors").
 *
 * ⛔ WHAT WAS WRONG BEFORE, and it is a small thing that made every leaf look machine-set:
 * the label path was a HORIZONTAL line through the ward's centroid with a seeded bow. So the
 * curve carried no information at all — a quarter running north-east had its name lying flat
 * across it, and two neighbouring wards bowed in unrelated directions because a hash chose.
 *
 * ⭐ THE CURE IS THAT A QUARTER'S NAME FOLLOWS THE QUARTER. Two cases, and the ward's own
 * geometry decides which:
 *   • A quarter set AROUND the centre takes the ARC of its own radius — the label curves with
 *     the town, which is what every period plan does and what makes the lettering read as
 *     part of the drawing rather than as a caption laid on top of it.
 *   • A quarter sitting ON the centre has no meaningful arc (its radius is smaller than its
 *     own half-width), so it takes its PRINCIPAL AXIS — the direction the quarter is longest
 *     in, measured from its own outline's second moments.
 * Both are derivations from the drawn shape, so a label can never disagree with the ward it
 * names.
 * @returns {{ pts:number[][], along:'arc'|'axis', reason:string }}
 */
export function wardLabelPath(part, centre, roomCap, words = false) {
  const poly = part.polygon || [];
  // ⭐ ⟦CAR-WORDS⟧ THE ANCHOR IS AN INTERIOR POINT. Dormant, it is the centroid exactly as
  // before; armed, a centroid that has fallen outside its own quarter is replaced by the
  // deepest point that has not. 95 of 101 named cells are unmoved by this line.
  const c = words === true ? interiorAnchor(poly, part.centroid) : part.centroid;
  const dx = c[0] - centre.x, dy = c[1] - centre.y;
  const radius = Math.sqrt(dx * dx + dy * dy);

  // The ward's own second moments about its centroid — the principal axis and the half-width.
  let sxx = 0, syy = 0, sxy = 0, n = 0;
  for (const p of poly) {
    const ux = p[0] - c[0], uy = p[1] - c[1];
    sxx += ux * ux; syy += uy * uy; sxy += ux * uy; n++;
  }
  if (n > 0) { sxx /= n; syy /= n; sxy /= n; }
  // ⭐ THE PRINCIPAL AXIS WITHOUT `atan2`, AND THAT IS NOT A STYLE CHOICE. The closed form is
  // ½·atan2(2·sxy, sxx − syy), and a single runtime trig call would break the cross-machine
  // ULP law the whole fabric is built on (townMapModel.js:17-20) and red the purity scan.
  // The variance along a direction is `sxx·c² + 2·sxy·c·s + syy·s²`, so the axis is simply
  // THE TABLE ENTRY THAT MAXIMISES IT — 64 exact evaluations against the frozen table, which
  // is also the resolution the answer is quantised to anyway.
  let axisIdx = 0, bestVar = -Infinity;
  for (let i = 0; i < TRIG_N / 2; i++) {
    const cu = cosI(i), su = sinI(i);
    const v = sxx * cu * cu + 2 * sxy * cu * su + syy * su * su;
    if (v > bestVar) { bestVar = v; axisIdx = i; }
  }
  const halfWidth = Math.sqrt(Math.max(sxx, syy)) * 1.9;
  const room = Math.min(halfWidth, roomCap);

  if (radius > halfWidth * 1.15 && radius > 40) {
    // THE ARC. The angular half-span is the room divided by the radius, in table steps.
    const centreIdx = bearingIndex(dx, dy);
    const span = Math.max(2, Math.min(TRIG_N / 5, Math.round((room / radius) * (TRIG_N / (Math.PI * 2)))));
    const pts = [];
    // ⚠ THE SWEEP IS ALWAYS THE SAME WAY ROUND HERE; the READING DIRECTION is normalised once,
    // in `glyphsAlong`, where the glyphs are actually placed. Deciding it twice — once by the
    // arc's sweep and once by the tangent — is how a label ends up mirrored on one side of a
    // leaf and upright on the other, which is exactly what the first spelling did.
    for (let k = -span; k <= span; k++) {
      const a = ((centreIdx + k) % TRIG_N + TRIG_N) % TRIG_N;
      pts.push([centre.x + cosI(a) * radius, centre.y + sinI(a) * radius]);
    }
    const kept = words === true ? clipRunToPolygon(pts, poly) : pts;
    return {
      pts: kept, along: 'arc', clipped: words === true && kept.length !== pts.length,
      reason: `arc of the quarter's own radius ${Math.round(radius)}u, span ±${span} steps`
        + (words === true && kept.length !== pts.length ? ` — CLIPPED to the ${kept.length} of ${pts.length} steps inside the quarter` : ''),
    };
  }
  // THE AXIS. A gentle bow AWAY from the centre so the name sits in the quarter rather than
  // cutting it in half.
  const ca = cosI(axisIdx), sa = sinI(axisIdx);
  const bow = Math.min(room * 0.16, 10);
  const pts = [];
  // ⚠ THE SAMPLE COUNT IS THE ARM'S, AND THE CURVE IS NOT. Seven points describe this bow to
  // the eye but not to a clipper: a 7-point polyline can only be trimmed in sixths, so a label
  // would keep a sixth of its run that lies outside the quarter or lose a sixth that lies
  // inside. Armed, the SAME parabola is sampled at 25 points — the curve is unchanged, only
  // its resolution — so the clip lands where the boundary actually is.
  const STEPS = words === true ? 12 : 3;
  for (let k = -STEPS; k <= STEPS; k++) {
    const t = k / STEPS;
    pts.push([c[0] + ca * room * t - sa * bow * (1 - t * t), c[1] + sa * room * t + ca * bow * (1 - t * t)]);
  }
  const kept = words === true ? clipRunToPolygon(pts, poly) : pts;
  return {
    pts: kept, along: 'axis', clipped: words === true && kept.length !== pts.length,
    reason: `principal axis of the quarter's own outline (radius ${Math.round(radius)}u < half-width ${Math.round(halfWidth)}u)`
      + (words === true && kept.length !== pts.length ? ` — CLIPPED to the ${kept.length} of ${pts.length} samples inside the quarter` : ''),
  };
}

/**
 * ⭐⭐⭐ THE CURVE IS DRAWN GLYPH BY GLYPH, NOT WITH `<textPath>`, AND THE REASON IS A FINDING
 * THAT INVALIDATES EVERY EYES-ON JUDGMENT THIS FAMILY HAS MADE OF ITS OWN WARD LABELS.
 *
 * ⛔⛔⛔ MEASURED THIS LANE, WITH A MINIMAL REPRODUCTION: **the harness's rasterizer DROPS
 * `<textPath>` SILENTLY.** A plain `<text>` renders (pixel minimum 0 against a 238 ground);
 * the identical string inside a `<textPath>` renders NOTHING, with `href` and with
 * `xlink:href`, nested and unnested. The SVG has been correct since MF-B1 — SVG2's `href` is
 * valid and a browser draws it — but every PNG the family has produced, and therefore every
 * zoom the owner and the chair have judged, has had **NO WARD NAMES ON IT AT ALL.**
 * ⭐ THE CLASS: **A RENDERER THAT SILENTLY DROPS AN ELEMENT MAKES A WHOLE FEATURE INVISIBLE TO
 * EVERY EYES-ON JUDGMENT WHILE EVERY CENSUS OVER THE MARKUP PASSES.** It is §195.0's vacuity
 * seen from the other end: there the census could not see what was drawn; here the picture
 * cannot see what the census counts.
 *
 * ⭐⭐ AND THE CURE IS THE BETTER ENGINEERING ANYWAY, which is why it is not a workaround.
 * `react-pdf` — the estate's own PDF-plate primitive set, which §0-bill-3 prices every op
 * against — has no `textPath` either, so a curved ward label built on it is unrenderable on
 * the dossier plate by construction. Placing each glyph at its own point on the curve, at the
 * local tangent, is what a draughtsman does by hand, renders in every target, and gives exact
 * control of the letter-spacing along the arc.
 * ⚠ THE ROTATION IS QUANTISED TO THE FROZEN 64-STEP TABLE (5.625° per step), because the
 * cross-machine ULP law forbids a runtime `atan2` here as everywhere else. At label sizes the
 * step is below what the eye reads as a tilt, and the whole fabric is drawn on that lattice.
 */
export function glyphsAlong(rawPts, text, size, tracking, metric = metricFor(false)) {
  // ⛔⛔ THE BASELINE RUNS LEFT TO RIGHT OR THE READER GETS MIRROR WRITING, AND THE FORENSIC
  // ZOOM IS THE ONLY REASON THIS WAS CAUGHT. The arc is generated round the settlement's
  // centre, so on one side of the leaf it runs east-to-west — and a glyph rotated to that
  // tangent is rotated 180°. MEASURED on the first render that showed ward names at all:
  // "RELIGIOUS QUARTER" came out upside down and reading bottom-to-top, in the middle of the
  // town, at full label size. ⭐ THE CLASS: **A ROTATION TAKEN FROM A PATH'S TANGENT INHERITS
  // THE PATH'S DIRECTION, AND A PATH HAS NO OPINION ABOUT WHICH WAY IS UP.** The cure is one
  // normalisation: if the run's net direction points left, walk it the other way.
  const first = rawPts[0], last = rawPts[rawPts.length - 1];
  const pts = (last && first && last[0] < first[0]) ? rawPts.slice().reverse() : rawPts;
  // Arc length along the path, so a glyph's position is a DISTANCE and not a vertex index.
  const seg = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const d = Math.sqrt((pts[i][0] - pts[i - 1][0]) ** 2 + (pts[i][1] - pts[i - 1][1]) ** 2);
    seg.push({ a: pts[i - 1], b: pts[i], d, s0: total });
    total += d;
  }
  if (!seg.length || total <= 0) return '';
  // ⭐ THE ADVANCE IS PER GLYPH. Under the legacy flat metric every entry is `size·0.52 +
  // tracking` and the walk below reduces, term for term, to the constant-step expression this
  // replaced: glyph i sat at `(total−width)/2 + adv/2 + i·adv`, and it still does. Under the
  // ⟦CAR-WORDS⟧ metric an `M` claims its own 0.9272 em and stops landing on its neighbour.
  // ⛔ THE DORMANT ARM RUNS THE ORIGINAL CONSTANT-STEP WALK, EXPRESSION FOR EXPRESSION. The
  // per-glyph walk below reduces to it arithmetically and NOT bit-for-bit — see `emWidth`.
  const flat = !metric.words;
  const advs = flat ? null : [...text].map((ch) => size * metric.em(ch) + tracking);
  const advF = size * ADVANCE + tracking;
  const width = flat ? text.length * advF : advs.reduce((a, b) => a + b, 0);
  let s = flat ? (total - width) / 2 + advF / 2 : (total - width) / 2;   // centred on the path
  let outp = '';
  let gi = -1;
  for (const chr of text) {
    gi++;
    const adv = flat ? advF : advs[gi];
    if (chr === ' ') { s += adv; continue; }
    let t = flat ? s : s + adv / 2;
    if (t < 0) t = 0; else if (t > total) t = total;
    let k = 0;
    while (k < seg.length - 1 && seg[k].s0 + seg[k].d < t) k++;
    const sg = seg[k];
    const f = sg.d > 0 ? (t - sg.s0) / sg.d : 0;
    const x = sg.a[0] + (sg.b[0] - sg.a[0]) * f;
    const y = sg.a[1] + (sg.b[1] - sg.a[1]) * f;
    const idx = bearingIndex(sg.b[0] - sg.a[0], sg.b[1] - sg.a[1]);
    const deg = Math.round((idx * 360 / TRIG_N) * 10) / 10;
    outp += `<text x="${r2(x)}" y="${r2(y)}" transform="rotate(${deg} ${r2(x)} ${r2(y)})">${esc(chr)}</text>`;
    s += adv;
  }
  return outp;
}

/**
 * ⭐ THE §195.3 WORD-DROPPING CURE, LIFTED OUT OF THE RENDERER. "A LABEL FITTED BY SHRINKING
 * HAS A FLOOR, AND BELOW THAT FLOOR IT TRUNCATES INSTEAD OF FAILING." Past the floor the
 * label loses a WORD — the GENERIC one first, which is period abbreviation practice — and a
 * single word that still will not fit is DROPPED entirely. A blank quarter is honest; half a
 * name is a drawing error the reader cannot tell from a word.
 */
export const GENERIC_WORD = /^(QUARTER|WARD|DISTRICT|QUARTIER|PRECINCT|END|SIDE)$/;
export const LABEL_FLOOR = 5.6;
export const LABEL_CEIL = 10.5;

export function fitLabel(name, room, tracking = 1.15, metric = metricFor(false)) {
  let words = String(name).toUpperCase().split(/\s+/).filter(Boolean);
  // `t.length * ADVANCE` was the em-width of the string under the flat metric; `emWidth` IS
  // that expression generalised, so the dormant arm computes the identical quotient.
  // ⛔ the legacy denominator was `t.length * ADVANCE`, written inline; `emWidth`'s legacy
  //   branch now returns exactly that, so this quotient is the original one bit for bit.
  const sizeFor = (t) => (room * 0.92 - t.length * tracking) / emWidth(t, metric);
  const fits = (t) => t.length > 0 && sizeFor(t) >= LABEL_FLOOR;
  const dropped = [];
  while (!fits(words.join(' ')) && words.length > 1) {
    const gi = words.findIndex((w) => GENERIC_WORD.test(w));
    dropped.push(words.splice(gi >= 0 ? gi : words.length - 1, 1)[0]);
  }
  const text = words.join(' ');
  if (!fits(text)) return { text: null, size: 0, dropped, reason: 'dropped whole: one word will not fit at the floor' };
  const size = Math.max(LABEL_FLOOR, Math.min(LABEL_CEIL, sizeFor(text)));
  return { text, size, dropped, reason: dropped.length ? `dropped ${dropped.join(', ')}` : 'whole' };
}

/**
 * ⭐⭐⭐ THE FRAGMENT. Everything above, emitted once, over the finished draw list.
 *
 * @param {Object} a
 * @param {Object} a.fabric        the finished fabric (read-only)
 * @param {Object} a.palette       the resolved ten roles
 * @param {Array}  a.reserved      boxes the draw pass has already claimed
 * @param {number} a.budget        ops left under the ceiling — chrome is not exempt (§12)
 * @param {boolean} a.allowNotes   the lens's own §12 suppression
 * @returns {{ fragment:string, ops:number, placed:Object, reason:string }}
 */
export function letteringFragment(a) {
  const { fabric, palette: P, reserved, budget, allowNotes } = a;
  const words = a.words === true;
  const metric = metricFor(words);
  const m = fabric.meta;
  const centre = m.centre || { x: 500, y: 500 };
  const serif = "Georgia,'Iowan Old Style','Times New Roman',serif";
  const out = [];
  const defs = [];
  const claimed = reserved.slice();
  let ops = 0;
  const placed = { wards: 0, wardsDropped: 0, notes: 0, captions: 0, neighbours: 0, wardsDuplicate: 0, captionsUnplaced: 0, notesUnplaced: 0 };
  // ⛔ CHECK FIRST, THEN CHARGE. The first spelling added the cost and THEN asked whether it
  // fitted, so a starved leaf was billed for lettering it did not draw — the city came back
  // 16 ops over the ceiling for four ward names that were never emitted. ⭐ THE CLASS: **A
  // BUDGET GUARD THAT MUTATES BEFORE IT DECIDES CHARGES FOR THE REFUSAL.**
  const spend = (n) => { if (ops + n > budget) return false; ops += n; return true; };

  // ── 1 · THE WARD NAMES, curved along their quarters.
  if (m.wardLabels) {
    const cands = fabric.umbrella.partition
      .map((p) => ({ p, org: fabric.organisms.find((o) => o.key === p.organismKey) }))
      .filter((r) => r.org && r.org.name)
      .sort((x, y) => y.p.area - x.p.area);
    const kept = [];
    // ⭐⭐ ⟦CAR-WORDS⟧ **THE CLUTTER LADDER HAD ONLY ONE RUNG, AND IT WAS THE WRONG ONE FOR THE
    // DEFECT THE CORPUS ACTUALLY HAS.** R-DEVLOG **D2** states the ladder: per-ward labels →
    // **ONE LABEL PER SAME-TYPE CLUSTER** → named organic districts, consolidating upward as
    // density grows. The loop below had the DISTANCE rung (a 150 u centroid separation) and a
    // hard cap of four, but no TYPE rung — so two quarters that carry the SAME NAME and stand
    // more than 150 u apart were both labelled.
    // ⛔ MEASURED: `town-2`, `polycentric` and `crossing` each print **"MARKET QUARTER" TWICE**
    // on one page. Independently, the §654 six-lens review filed the identical finding as **C2**
    // — "MARKET QUARTER printed twice on town-2/crossing/polycentric" — from a reader's eyes
    // rather than a census, which is as strong a triangulation as this programme gets.
    // ⚠ AND IT IS A SELECTION FIX, NOT A NAMING ONE. **L-REG-29 forbids inventing a toponym**
    // to tell the two apart, so the ladder does the only other thing available: the larger
    // quarter keeps the name and the smaller goes unlabelled. `cands` is already area-sorted,
    // so "first seen" IS "largest" and the rule needs no comparison of its own.
    const takenNames = new Set();
    for (const c of cands) {
      let clash = false;
      for (const k of kept) {
        const ddx = k.p.centroid[0] - c.p.centroid[0], ddy = k.p.centroid[1] - c.p.centroid[1];
        if (Math.sqrt(ddx * ddx + ddy * ddy) < 150) { clash = true; break; }
      }
      if (words && !clash) {
        const nm = String(c.org.name).toUpperCase();
        if (takenNames.has(nm)) { clash = true; placed.wardsDuplicate++; } else takenNames.add(nm);
      }
      if (!clash) kept.push(c);
      if (kept.length >= 4) break;
    }
    const rows = [];
    kept.forEach((c, i) => {
      const path = wardLabelPath(c.p, centre, 108, words);
      let len = 0;
      for (let k = 1; k < path.pts.length; k++) {
        len += Math.sqrt((path.pts[k][0] - path.pts[k - 1][0]) ** 2 + (path.pts[k][1] - path.pts[k - 1][1]) ** 2);
      }
      // ⛔ A CLIPPED PATH CAN COME BACK EMPTY, and that is the containment guarantee doing its
      // job rather than failing: a quarter with no interior run long enough to write along
      // loses its name instead of writing it across the neighbour it does not own.
      if (!path.pts.length || len <= 0) { placed.wardsDropped++; return; }
      const fit = fitLabel(c.org.name, len, 1.15, metric);
      if (!fit.text) { placed.wardsDropped++; return; }
      rows.push({ i, fit, path, along: path.along });
    });
    const wardOps = rows.reduce((n, r) => n + r.fit.text.length, 0);
    if (rows.length && spend(wardOps)) {
      out.push(`<g id="wardlabels" font-family="${serif}" fill="${P.labels}" text-anchor="middle"`
        + ` paint-order="stroke" stroke="${P.roads}" stroke-width="2" stroke-linejoin="round">`);
      for (const row of rows) {
        out.push(`<g data-along="${row.along}" font-size="${r2(row.fit.size)}">`
          + glyphsAlong(row.path.pts, row.fit.text, row.fit.size, 1.15, metric) + '</g>');
        placed.wards++;
      }
      out.push('</g>');
    }
    void defs;
  }

  // ── 2 · §12.1 THE MARGINALIA — fine italic in the MARGIN, which is where a marginal note
  //    goes. Each carries its own leader rule and each is placed against every box already
  //    claimed, so a note can never land on the cartouche or on another note.
  const notes = (fabric.immersion && allowNotes) ? fabric.immersion.notes.notes : [];
  if (notes.length) {
    const lines = [];
    let y = 46;
    for (const note of notes) {
      const w = textWidth(note.text, 7.6, 0.4, metric) + 16;
      const spot = placeBox([{ x: 30, y, anchor: 'start' }, { x: 30, y: y + 300, anchor: 'start' }], w, 11, claimed);
      if (!spot) { placed.notesUnplaced++; continue; }
      claimed.push(spot.box);
      lines.push({ x: spot.x, y: spot.y, text: note.text, cite: note.cite });
      y = spot.y + 17;
    }
    if (lines.length && spend(lines.length * 2)) {
      out.push(`<g id="marginalia" font-family="${serif}" font-style="italic" font-size="7.6"`
        + ` fill="${P.labels}" letter-spacing="0.4" fill-opacity="0.88">`);
      for (const l of lines) {
        // The leader rule: a hairline the length of the note, the mark a scribe puts under an
        // annotation so the eye separates it from the drawing it sits beside.
        // ⚠ THE LEADER RULE IS DRAWN THE LENGTH OF THE NOTE, so it reads the SAME metric the
        // note was measured with. Two spellings here would draw a rule that stops short of the
        // words it underlines — the metric defect showing up as an ornament that misses.
        out.push(`<path d="M${r2(l.x)} ${r2(l.y + 2.4)}L${r2(l.x + textWidth(l.text, 7.6, 0.4, metric))} ${r2(l.y + 2.4)}"`
          + ` stroke="${P.labels}" stroke-width="0.3" stroke-opacity="0.45" fill="none"/>`);
        out.push(`<text x="${r2(l.x)}" y="${r2(l.y)}" data-cite="${esc(l.cite)}">${esc(l.text)}</text>`);
        placed.notes++;
      }
      out.push('</g>');
    }
  }

  // ── 3 · §12.5 THE EVENT CAPTIONS, beside their own marks.
  const marks = fabric.immersion ? fabric.immersion.eventMarks.marks : [];
  if (marks.length) {
    const caps = [];
    for (const mk of marks) {
      const label = `${mk.label} · ${mk.year}`;
      const w = textWidth(label, 6.4, 0.3, metric);
      const spot = placeBox(words ? captionRing(mk.x, mk.y) : [
        { x: mk.x, y: mk.y - 9, anchor: 'middle' },
        { x: mk.x, y: mk.y + 18, anchor: 'middle' },
        { x: mk.x + 14, y: mk.y + 3, anchor: 'start' },
      ], w, 9, claimed);
      if (!spot) { placed.captionsUnplaced++; continue; }
      claimed.push(spot.box);
      caps.push({ x: spot.x, y: spot.y, anchor: spot.anchor, text: label, cite: mk.cite });
    }
    if (caps.length && spend(caps.length)) {
      out.push(`<g id="eventcaptions" font-family="${serif}" font-size="6.4" fill="${P.labels}"`
        + ` letter-spacing="0.3" paint-order="stroke" stroke="${P.paper}" stroke-width="1.6" stroke-linejoin="round">`);
      for (const c of caps) {
        out.push(`<text x="${r2(c.x)}" y="${r2(c.y)}" text-anchor="${c.anchor}" data-cite="${esc(c.cite)}">${esc(c.text)}</text>`);
        placed.captions++;
      }
      out.push('</g>');
    }
  }

  // ── 4 · §12.2 THE NEIGHBOUR EDGE. Empty on a standalone settlement BY LAW (§164a) — see
  //    immersion.deriveNeighbourEdges for the owner's two constraints.
  const edges = fabric.immersion ? fabric.immersion.neighbours.edges : [];
  if (edges.length && spend(edges.length * 2)) {
    out.push(`<g id="neighbouredges" font-family="${serif}" font-size="7.2" fill="${P.labels}" letter-spacing="0.5">`);
    for (const e of edges) {
      const label = e.travel ? `TO ${e.name.toUpperCase()} — ${e.travel.toUpperCase()}` : `TO ${e.name.toUpperCase()}`;
      const w = textWidth(label, 7.2, 0.5, metric);
      const spot = placeBox([{ x: e.x, y: e.y - 6, anchor: 'middle' }, { x: e.x, y: e.y + 14, anchor: 'middle' }], w, 10, claimed);
      if (!spot) continue;
      claimed.push(spot.box);
      out.push(`<path d="M${r2(e.x - 5)} ${r2(e.y)}L${r2(e.x + 5)} ${r2(e.y)}" stroke="${P.labels}" stroke-width="0.8" fill="none"/>`);
      out.push(`<text x="${r2(spot.x)}" y="${r2(spot.y)}" text-anchor="${spot.anchor}" data-cite="${esc(e.cite)}">${esc(label)}</text>`);
      placed.neighbours++;
    }
    out.push('</g>');
  }

  const fragment = out.length ? `<g id="lettering">${out.join('')}</g>` : '';
  return {
    fragment,
    ops,
    placed,
    reason: `§173 lettering splice: ${placed.wards} ward names (${placed.wardsDropped} dropped whole rather than `
      + `truncated), ${placed.notes} marginal notes, ${placed.captions} event captions, `
      + `${placed.neighbours} neighbour edges; ${ops} ops against a budget of ${budget}`
      // ⭐ THE SILENT DROPS ARE NAMED IN THE REASON. `placeBox` returning null used to be a bare
      // `continue`, so a caption that could not find room simply was not there and nothing said
      // so — the exact shape of absence L-REG-35's census exists to convict.
      + (words ? `; ⟦words⟧ ${placed.wardsDuplicate} same-name quarters consolidated, `
        + `${placed.captionsUnplaced} captions and ${placed.notesUnplaced} notes could not be placed` : ''),
  };
}

/* ══════════════════════════════════════════════════════════════════════════════════════════
 * ⭐⭐⭐ ⟦CAR-WORDS⟧ THE CARTOUCHE LANGUAGE — REG-8's own charter, and §570.5(vi)'s open finding.
 *
 * THE STANDING RULING, verbatim (ODQ §570.5(vi)): *"the cartouche leaks ENGINE VOCABULARY to
 * the user — 'FABRIC 1 : 3.8 HOUSEHOLDS (REPRESENTATIVE)', 'RELIEF 1.00' — a live violation of
 * the standing LEGIBILITY law and GAME-GRADE UX doctrine (translate formulas)."* It has been
 * open since it was written. What follows is the translation it asked for.
 *
 * ⛔ MEASURED OVER THE 18-LEAF CORPUS, so the denylist below is an inventory rather than a
 * guess — these are strings the sealed page actually prints today:
 *     FABRIC 1 : 0.4 HOUSEHOLDS (REPRESENTATIVE)   ← the token, the ratio, the parenthetical
 *     FABRIC 1 : 1 WITH THE HOUSING CENSUS          ← the token, a ratio
 *     REGULARIZED PLAN · FOUNDED MILITARY · WATER THROUGH   ← three raw enum members
 *     PLANNED PLAN · FOUNDED PLANNED · WATER DRY    ← ⛔ and "PLANNED PLAN" is a TAUTOLOGY
 *     FJORD (RECONCILED) · RELIEF 1.00              ← the token, a decimal, a parenthetical
 *
 * ⭐⭐ FINITE SEMANTICS HOLDS EXACTLY: every table below is a TYPED BUCKET LOOKUP over a CLOSED
 * vocabulary the fabric already owns. Nothing here composes a sentence, and nothing invents a
 * category — the clerk translates a member it was handed and refuses one it was not.
 * ⛔ AND THE REFUSAL IS THE IMPORTANT HALF: an unknown member returns `null` and the caller
 * OMITS THE CLAUSE. A table that fell through to the raw token would leak exactly the
 * vocabulary it exists to stop, silently, on the first member somebody adds.
 *
 * ⚠ THE TABLES ARE TOTAL OVER THEIR VOCABULARIES AND THE TEST PROVES IT THERE, NOT HERE.
 * `lettering.js` is stage S23 and the stage walker PINS its import list to `fabricGeometry.js`
 * alone (`stageManifest.walker.test.js:283`), so importing `waterMode.js`/`morphology.js`/
 * `foundingKind.js` to self-check would red the gate. The totality arm therefore lives in the
 * test, which may import both sides — and it must, because a table that silently loses a
 * member is the whole failure mode.
 * ══════════════════════════════════════════════════════════════════════════════════════════ */

/** §5.0's three morphology bands, as a plan reads them. */
export const MORPHOLOGY_WORDS = Object.freeze({
  organic: 'GREW AS IT WENT',
  regularized: 'STRAIGHTENED OVER TIME',
  planned: 'LAID OUT TO A PLAN',
});

/** The six founding kinds. Each says WHO put the place here. */
export const FOUNDING_WORDS = Object.freeze({
  organic: 'SETTLED BY THOSE WHO CAME',
  refuge: 'FOUNDED AS A REFUGE',
  religious: 'FOUNDED ABOUT A HOLY PLACE',
  charter: 'CHARTERED BY A LORD',
  military: 'FOUNDED AS A GARRISON',
  planned: 'FOUNDED BY DESIGN',
});

/** The four water modes, said as a relationship rather than as a mode. */
export const WATER_WORDS = Object.freeze({
  through: 'THE WATER RUNS THROUGH IT',
  bankside: 'SET ON THE BANK',
  near: 'WATER LIES NEARBY',
  dry: 'NO WATER NEARBY',
});

/** The eleven landform families, declared and reconciled alike. */
export const LANDFORM_WORDS = Object.freeze({
  plains: 'OPEN PLAIN', hills: 'ROLLING HILLS', forest: 'WOODED COUNTRY',
  riverside: 'RIVER COUNTRY', coastal: 'THE COAST', mountain: 'THE MOUNTAINS',
  desert: 'DRY COUNTRY', fjord: 'A FJORD', oasis: 'AN OASIS',
  fen: 'FEN COUNTRY', strand: 'THE STRAND',
});

/**
 * ⭐ RELIEF BECOMES A TYPED BUCKET, WHICH IS WHAT A READER CAN USE. `RELIEF 0.42` is a
 * derivation output printed raw: the reader has no scale to put it on and no unit to read it
 * in. The bands are the chair's, vetoably, and they are BANDS rather than a formula — the
 * §11.12a discipline (never a decorative relative unit) applied to words instead of to a bar.
 */
export const RELIEF_BANDS = Object.freeze([
  [0.15, 'LEVEL GROUND'], [0.35, 'GENTLY ROLLING'], [0.60, 'BROKEN GROUND'],
  [0.85, 'STEEP GROUND'], [Infinity, 'MOUNTAINOUS'],
]);
export function reliefWords(v) {
  if (!Number.isFinite(v)) return null;
  for (const [hi, w] of RELIEF_BANDS) if (v <= hi) return w;
  return null;
}

/**
 * ⭐⭐⭐ **THE ENUMERATED DENYLIST.** A2.2 chartered "an ENUMERATED denylist file"; five waves
 * later it had never been written, and DESIGN_REGISTER_PROGRAM.md:105's `FABRIC, RELIEF,
 * REPRESENTATIVE, …` — three tokens and an ellipsis — was the whole of it. This is the file.
 *
 * ⚠ IT IS A **WORD-BOUNDARY** LIST, NOT A SUBSTRING LIST, and that is load-bearing: `PLAN`
 * must convict `REGULARIZED PLAN` without convicting `PLAINS`, and `FABRIC` must convict the
 * cartouche without convicting a settlement genuinely named for cloth. The census applies it
 * with `\b`, and it is applied to **rendered `<text>` content only** — never to source, never
 * to `data-cite`, which is a DEBUG channel and is D1's separate system by design.
 */
export const ENGINE_VOCABULARY_DENYLIST = Object.freeze([
  // §570.5(vi)'s three, verbatim
  'FABRIC', 'RELIEF', 'REPRESENTATIVE',
  // the morphology band members, printed raw as `X PLAN`
  'REGULARIZED', 'MORPHOLOGY',
  // the water-mode members, printed raw as `WATER X`
  'BANKSIDE', 'WATERMODE',
  // the derivation's own nouns
  'RECONCILED', 'RECONCILIATION', 'LANDFORM', 'FOUNDINGKIND', 'EXTENTTIER',
  'CENSUS', 'HOUSEHOLDS', 'PARTITION', 'PRIMITIVE', 'CENTROID', 'POLYGON',
  'SEED', 'DERIVED', 'DORMANT', 'ARMED', 'LOD', 'RATIO', 'INDEX', 'NULL', 'UNDEFINED',
]);

/**
 * ⭐ THE FORMULA-PATTERN ARM. A2.2 names three classes and only three — *"ratios, decimals,
 * ALL-CAPS parentheticals"* — so the arm is exactly three predicates and no more. A pattern
 * arm that grew a fourth class of its own would be a lane legislating.
 * ⚠ `exempt` carries the ones that are NOT formulas and must never be convicted: the scale
 * bar's count is a MEASURE (§11.12a says it must be true and printed), a year is a DATE, and a
 * population is a COUNT of people. Each is a number a reader can use.
 */
export const FORMULA_PATTERNS = Object.freeze([
  { id: 'ratio', re: /\d\s*:\s*\d/, why: 'a ratio, printed as arithmetic' },
  { id: 'decimal', re: /\d+\.\d+/, why: 'a bare decimal with no unit the reader can read it in' },
  { id: 'allcapsParen', re: /\([A-Z][A-Z ]{2,}\)/, why: 'an ALL-CAPS parenthetical — a flag, not a phrase' },
]);

/**
 * Scan one rendered string. Returns the findings; empty means clean.
 * @param {string} s
 * @returns {Array<{ kind:'token'|'formula', hit:string, why:string }>}
 */
export function scanWords(s) {
  const out = [];
  const t = String(s);
  const up = t.toUpperCase();
  for (const w of ENGINE_VOCABULARY_DENYLIST) {
    const re = new RegExp(`(^|[^A-Z])${w}([^A-Z]|$)`);
    if (re.test(up)) out.push({ kind: 'token', hit: w, why: 'engine vocabulary on a user surface (L-REG-11)' });
  }
  for (const p of FORMULA_PATTERNS) if (p.re.test(t)) out.push({ kind: 'formula', hit: p.id, why: p.why });
  return out;
}

/**
 * ⭐⭐ THE CARTOUCHE'S THREE METADATA LINES, TRANSLATED. Returns the lines to print; a clause
 * whose member is unknown is OMITTED rather than guessed, so the sheet can be short but never
 * wrong.
 *
 * ⛔⛔ AND ONE LINE IS **DELIBERATELY NOT A RATIO**, because the ratio's own DIRECTION does not
 * hold across the corpus. `representationRatio` is documented as *households per drawn shape*
 * (`measure.js:187`) and MEASURED it runs **0.4 to 6.9** — below 1 on real leaves, which means
 * the page draws MORE shapes than there are households, while `representative` is true. A
 * translated sentence of the form "each house stands for N households" would therefore be
 * FALSE on exactly the leaves the sentence exists for. **That is the §711.6/§712.7 class caught
 * one consumer before it printed**: the cure is to say the true thing the reader needs — whether
 * the houses are one-for-one — and to leave the suspect number to the docket that owns it.
 */
export function cartoucheLines(m) {
  const lines = [];
  lines.push(m.representative
    ? 'THE HOUSES STAND FOR THE HOUSING, NOT ONE FOR ONE'
    : 'EVERY HOUSE DRAWN IS A HOUSE THAT STANDS');
  const plan = MORPHOLOGY_WORDS[m.morphology] || null;
  const found = FOUNDING_WORDS[m.foundingKind] || null;
  const clause = [found, plan].filter(Boolean).join(' · ');
  if (clause) lines.push(clause);
  const land = LANDFORM_WORDS[m.landform] || null;
  const water = WATER_WORDS[m.waterMode] || null;
  const rel = reliefWords(m.relief);
  const third = [land, rel, water].filter(Boolean).join(' · ');
  if (third) lines.push(third);
  // ⛔⛔ **THE RECONCILIATION IS SAID, NEVER DROPPED — AND THE REASON IS THE SHARPEST THING THIS
  // CAR FOUND.** `(RECONCILED)` is an ALL-CAPS parenthetical and the formula arm convicts it, so
  // the obvious translation is to delete it. **That would be the worst outcome available.**
  // MEASURED: `town-2` is a DECLARED RIVERSIDE TOWN, `city` and `migration` are DECLARED COASTAL,
  // and all three are solved to landform `fjord` at relief **1.00** — 3 of 18 leaves, 2 of 12
  // distinct sites. The word `(RECONCILED)` is the ONLY thing on the sheet telling a reader that
  // the landform was SOLVED FOR rather than observed. Translate it away and the page stops
  // reading like an engine and starts reading like a confident falsehood: `A FJORD ·
  // MOUNTAINOUS · SET ON THE BANK`, of a river town.
  // ⭐ THE CLASS, and it is a WORDS-layer law rather than a one-off: **A LEGIBILITY PASS OVER A
  // SURFACE THAT IS WRONG MAKES THE WRONGNESS MORE CREDIBLE, NOT LESS.** Engine vocabulary is
  // ugly, and ugliness is a warning; the cure for a leaking derivation is to fix the derivation,
  // and the words layer's duty in the meantime is to carry the epistemic status in words a
  // reader can act on. The landform defect itself is `substrate.js`'s solver — out of this car's
  // boundary, reported, and PINNED by census so a fourth leaf reds.
  if (m.forcedReconciliation) lines.push('NO OTHER GROUND FITS THE FACTS OF THIS PLACE');
  return lines;
}

/**
 * Splice a lettering fragment into a finished leaf. `injectFog`'s contract, verbatim: an
 * EMPTY fragment returns the base BYTE-IDENTICAL.
 */
export function spliceLettering(baseSvg, fragment) {
  if (!fragment || typeof baseSvg !== 'string') return baseSvg;
  const i = baseSvg.lastIndexOf('</svg>');
  if (i < 0) return baseSvg;
  return baseSvg.slice(0, i) + fragment + baseSvg.slice(i);
}
