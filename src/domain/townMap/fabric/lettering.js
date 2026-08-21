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
 */
export const ADVANCE = 0.52;
export const textWidth = (s, fontSize, tracking = 0) => s.length * (fontSize * ADVANCE + tracking);

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
export function wardLabelPath(part, centre, roomCap) {
  const c = part.centroid;
  const poly = part.polygon || [];
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
    return { pts, along: 'arc', reason: `arc of the quarter's own radius ${Math.round(radius)}u, span ±${span} steps` };
  }
  // THE AXIS. A gentle bow AWAY from the centre so the name sits in the quarter rather than
  // cutting it in half.
  const ca = cosI(axisIdx), sa = sinI(axisIdx);
  const bow = Math.min(room * 0.16, 10);
  const pts = [];
  for (let k = -3; k <= 3; k++) {
    const t = k / 3;
    pts.push([c[0] + ca * room * t - sa * bow * (1 - t * t), c[1] + sa * room * t + ca * bow * (1 - t * t)]);
  }
  return { pts, along: 'axis', reason: `principal axis of the quarter's own outline (radius ${Math.round(radius)}u < half-width ${Math.round(halfWidth)}u)` };
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
export function glyphsAlong(rawPts, text, size, tracking) {
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
  const adv = size * ADVANCE + tracking;
  const width = text.length * adv;
  let s = (total - width) / 2 + adv / 2;             // centred on the path
  let outp = '';
  for (const chr of text) {
    if (chr === ' ') { s += adv; continue; }
    let t = s;
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

export function fitLabel(name, room, tracking = 1.15) {
  let words = String(name).toUpperCase().split(/\s+/).filter(Boolean);
  const fits = (t) => t.length > 0 && ((room * 0.92 - t.length * tracking) / (t.length * ADVANCE)) >= LABEL_FLOOR;
  const dropped = [];
  while (!fits(words.join(' ')) && words.length > 1) {
    const gi = words.findIndex((w) => GENERIC_WORD.test(w));
    dropped.push(words.splice(gi >= 0 ? gi : words.length - 1, 1)[0]);
  }
  const text = words.join(' ');
  if (!fits(text)) return { text: null, size: 0, dropped, reason: 'dropped whole: one word will not fit at the floor' };
  const size = Math.max(LABEL_FLOOR, Math.min(LABEL_CEIL, (room * 0.92 - text.length * tracking) / (text.length * ADVANCE)));
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
  const m = fabric.meta;
  const centre = m.centre || { x: 500, y: 500 };
  const serif = "Georgia,'Iowan Old Style','Times New Roman',serif";
  const out = [];
  const defs = [];
  const claimed = reserved.slice();
  let ops = 0;
  const placed = { wards: 0, wardsDropped: 0, notes: 0, captions: 0, neighbours: 0 };
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
    for (const c of cands) {
      let clash = false;
      for (const k of kept) {
        const ddx = k.p.centroid[0] - c.p.centroid[0], ddy = k.p.centroid[1] - c.p.centroid[1];
        if (Math.sqrt(ddx * ddx + ddy * ddy) < 150) { clash = true; break; }
      }
      if (!clash) kept.push(c);
      if (kept.length >= 4) break;
    }
    const rows = [];
    kept.forEach((c, i) => {
      const path = wardLabelPath(c.p, centre, 108);
      let len = 0;
      for (let k = 1; k < path.pts.length; k++) {
        len += Math.sqrt((path.pts[k][0] - path.pts[k - 1][0]) ** 2 + (path.pts[k][1] - path.pts[k - 1][1]) ** 2);
      }
      const fit = fitLabel(c.org.name, len);
      if (!fit.text) { placed.wardsDropped++; return; }
      rows.push({ i, fit, path, along: path.along });
    });
    const wardOps = rows.reduce((n, r) => n + r.fit.text.length, 0);
    if (rows.length && spend(wardOps)) {
      out.push(`<g id="wardlabels" font-family="${serif}" fill="${P.labels}" text-anchor="middle"`
        + ` paint-order="stroke" stroke="${P.roads}" stroke-width="2" stroke-linejoin="round">`);
      for (const row of rows) {
        out.push(`<g data-along="${row.along}" font-size="${r2(row.fit.size)}">`
          + glyphsAlong(row.path.pts, row.fit.text, row.fit.size, 1.15) + '</g>');
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
      const w = textWidth(note.text, 7.6, 0.4) + 16;
      const spot = placeBox([{ x: 30, y, anchor: 'start' }, { x: 30, y: y + 300, anchor: 'start' }], w, 11, claimed);
      if (!spot) continue;
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
        out.push(`<path d="M${r2(l.x)} ${r2(l.y + 2.4)}L${r2(l.x + textWidth(l.text, 7.6, 0.4))} ${r2(l.y + 2.4)}"`
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
      const w = textWidth(label, 6.4, 0.3);
      const spot = placeBox([
        { x: mk.x, y: mk.y - 9, anchor: 'middle' },
        { x: mk.x, y: mk.y + 18, anchor: 'middle' },
        { x: mk.x + 14, y: mk.y + 3, anchor: 'start' },
      ], w, 9, claimed);
      if (!spot) continue;
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
      const w = textWidth(label, 7.2, 0.5);
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
      + `${placed.neighbours} neighbour edges; ${ops} ops against a budget of ${budget}`,
  };
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
