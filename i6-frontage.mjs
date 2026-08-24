/**
 * i6-frontage.mjs — REG-I0 · INSTRUMENT 6 · THE FRONTAGE METRICS, MINTED.
 *
 * §571.4's mechanism, in the owner's own terms: *"buildings are FREESTANDING rectangles with
 * gaps to every neighbour, so the eye cannot aggregate them into blocks; because blocks never
 * form, the street void has ragged edges and the network does not pop."* These are the three
 * figures that make that sentence measurable, and A2.2 orders their formulas MINTED — with
 * numerator and denominator NAMED, because a figure without its denominator is not a measurement.
 *
 * ⭐ THE ALGORITHM IS REG-0's, LIFTED (postPass.mjs §12 `frontageContinuity`, raster.mjs's
 * chamfer DT and components). Not re-derived: REG-0's published figures must reproduce to the
 * digit, and a euclidean DT in place of the chamfer moves the fourth decimal of every ratio.
 *
 * ═══════════════════ F1 · FRONTAGE-CONTINUITY RATIO ═══════════════════
 *
 *      ratio = FRONTED / PROBES
 *
 *   PROBES (denominator) — every probe point laid along the STREET WEB's two flanks that lands
 *     inside the URBAN envelope. One probe per ~1 view unit of centre-line, offset from the
 *     centre-line by (the street's own half-width + 1.2 units), on both sides. Probes outside
 *     the envelope, or off the 1000-unit frame, are not laid at all — the metric is about the
 *     TOWN's frontage, not the country lane's.
 *   FRONTED (numerator) — probes with at least one BUILT cell within 2.0 view units.
 *   UNITS: dimensionless, 0..1. A run of shops sharing party walls fronts continuously; a row
 *     of freestanding cottages fronts in dots.
 *
 * ═══════════════════ F2 · RUN STATISTICS ═══════════════════
 *
 *   A RUN is a maximal consecutive sequence of probes, walking one flank of one street, that
 *   are all fronted BY THE SAME BUILT COMPONENT. The run BREAKS when the probe is unfronted,
 *   when it leaves the envelope, or when the fronting component CHANGES — that last clause is
 *   the whole point: two abutting-but-separate buildings end a run, party-walled ones do not.
 *
 *      runs         = the count of runs                      (a COUNT, denominator = none)
 *      meanRunUnits = Σ run length in view units / runs       ← denominator NAMED: the run count
 *      p50/p90/max  = the same population's order statistics
 *
 *   ⭐ THE PAIR (ratio, meanRunUnits) IS THE INSTRUMENT, NOT EITHER ALONE. Fusing buildings does
 *   not change WHICH probes are fronted — the same ink is in the same places — so the RATIO is
 *   nearly invariant under fusion, while the RUN COUNT falls and the MEAN RUN LENGTH rises.
 *   REG-0 measured exactly that: city ratio 0.4958 → 0.4958 (unmoved) while runs 1709 → 1380 and
 *   meanRun 11.22 → 13.90. A wave reporting only the ratio would have concluded fusion did
 *   nothing.
 *
 * ═══════════════════ F3 · FREESTANDING FRACTION INTRAMUROS ═══════════════════
 *
 *      freestandingFraction = SOLITARY / INTRAMURAL BODIES
 *
 *   INTRAMURAL BODIES (denominator) — drawn building bodies whose centroid lies inside the
 *     circuit. Intramuros is derived from the drawing itself: the WALL ink and the WATER body
 *     are barriers (the river is the fourth wall — walls.js's own law, which is why a half-ring
 *     is lawful), a flood fills inward from the frame border, and what the flood cannot reach is
 *     inside. Where no enclosure forms, the instrument says so and falls back to the URBAN
 *     ENVELOPE, naming which denominator it used — never silently.
 *   SOLITARY (numerator) — bodies whose connected component in the FUSED mask contains exactly
 *     one body. A body that shares a party wall with any neighbour is not solitary.
 *   UNITS: dimensionless, 0..1. This is the figure §571.4's cure drives DOWN.
 *
 * ⚠ THE WALL-BAND QUESTION, NAMED RATHER THAN BURIED. REG-0's own base figures were measured on
 * a mask from which buildings crowding the wall band had already been STRUCK (its REGIME-B
 * clear-space move, `--wallband`). That is a specimen intervention, not a property of the sealed
 * render. This instrument therefore measures the render AS DRAWN by default, and `--reg0compat`
 * re-applies the strike so REG-0's published numbers reproduce. Both are reported in baselines.
 *
 * CONTROLS (--controls):
 *   POSITIVE  the REG-0 BEFORE/AFTER pair — runs must FALL and meanRun must RISE under fusion
 *   NEGATIVE  --fuse=0 — the fused mask becomes the built mask, so every figure must return to
 *             the base's exactly. A "fusion" that still moves the numbers at radius zero is
 *             measuring its own noise.
 *   NEGATIVE  --shatter=N — every building polygon shrunk about its own centroid by N%, which
 *             manufactures the §571.4 defect on purpose: runs must RISE, meanRun and the ratio
 *             must FALL, and the freestanding fraction must RISE.
 *   REPRODUCTION  --reg0compat must reproduce REG-0's own published city/village figures.
 *
 * Usage: node i6-frontage.mjs --svg=<render.svg> --frontage=<units> [--reg0compat] [--fuse=]
 *                             [--shatter=] [--grid=1400] [--json=]
 *        node i6-frontage.mjs --controls
 */
import { writeFileSync } from 'node:fs';
import { classify, PxMask, assertViewBox } from './lib/classify.mjs';
import { subpaths, isHex } from './lib/svg.mjs';
import { distanceTransform, close, dilate, components } from './lib/morph.mjs';
import { centroid, inPoly as polyIn, r2, r4, stats, verdict } from './lib/geom.mjs';

const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };
const HERE = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/reg-instruments';
const R0 = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/reg0';

export const NEAR_UNITS = 2.0;          // REG-0's fronting distance
export const PROBE_OFFSET = 1.2;        // REG-0's offset beyond the street's own half-width
export const ENVELOPE_UNITS = 22;       // REG-0's `urban` closing radius

/** shrink a polygon about its own centroid — the shatter control's one move */
const shrinkAbout = (poly, k) => { const c = centroid(poly); return poly.map(([x, y]) => [c[0] + (x - c[0]) * k, c[1] + (y - c[1]) * k]); };

/**
 * Build every mask the three figures need, from one classified render.
 * `wallbandUnits > 0` re-applies REG-0's REGIME-B strike; 0 measures the render as drawn.
 */
export function masksFor(svgPath, { lens = 'parchment', N = 1400, frontage = 6.25, wallbandUnits = 0, fuseUnits = null, shatter = 0, legacyStamp = false } = {}) {
  const { els, src } = classify(svgPath, lens);
  assertViewBox(src);

  // ── the wall band (REG-0's own derivation), only if asked for
  const wallLine = new PxMask(N);
  let wallSegs = 0;
  for (const r of els) {
    if (r.role !== 'wall' || !r.t.attrs.d) continue;
    const a = r.t.attrs;
    if (a['stroke-dasharray']) continue;
    if (Number(a['stroke-width'] || 0) < 2.5) continue;
    for (const sp of subpaths(a.d)) {
      for (let k = 0; k + 1 < sp.poly.length; k++) {
        const [x0, y0] = sp.poly[k], [x1, y1] = sp.poly[k + 1];
        if (Math.hypot(x1 - x0, y1 - y0) > 140) continue;
        if (legacyStamp) wallLine.stampSegLegacy(x0, y0, x1, y1, 0.6); else wallLine.stampSeg(x0, y0, x1, y1, 0.6);
        wallSegs++;
      }
    }
  }
  const wallBand = (wallbandUnits > 0 && wallSegs) ? dilate(wallLine, wallbandUnits) : null;

  const built = new PxMask(N);
  const waterM = new PxMask(N);
  const streetLines = [];
  const squarePolys = [];
  /** one record per drawn BODY — the F3 denominator's population */
  const bodies = [];
  let clearedSubpaths = 0;

  for (const r of els) {
    const a = r.t.attrs; const d = a.d;
    if (!d) continue;
    if (r.role === 'building' || r.role === 'landmark' || r.role === 'yard') {
      for (const sp of subpaths(d)) {
        if (sp.poly.length < 3) continue;
        const poly = shatter > 0 && r.role === 'building' ? shrinkAbout(sp.poly, 1 - shatter) : sp.poly;
        if (wallBand && r.role === 'building') {
          const c = centroid(poly);
          if (wallBand.at(c[0], c[1])) { clearedSubpaths++; continue; }
        }
        built.fillPoly(poly);
        if (r.role === 'building' || r.role === 'landmark') bodies.push({ role: r.role, c: centroid(poly) });
      }
    } else if (r.role === 'water') {
      if (isHex(a.fill)) for (const sp of subpaths(d)) if (sp.poly.length > 2) waterM.fillPoly(sp.poly);
    } else if (r.role === 'street' || r.role === 'square') {
      const hw = Math.max(0.6, Number(a['stroke-width'] || 2) / 2);
      for (const sp of subpaths(d)) if (sp.poly.length > 1) streetLines.push({ poly: sp.poly, hw });
      if (r.role === 'square') for (const sp of subpaths(d)) if (sp.poly.length > 2) squarePolys.push(sp.poly);
    }
  }
  const FUSE_R = fuseUnits != null ? fuseUnits : Math.max(0.7, Math.min(2.4, frontage * 0.20));
  const fused = FUSE_R > 0 ? close(built, FUSE_R) : built;
  const urban = close(built, ENVELOPE_UNITS);
  return { els, built, fused, urban, waterM, wallLine, wallSegs, streetLines, squarePolys, bodies, N, FUSE_R, clearedSubpaths };
}

/**
 * F1 + F2 — REG-0's `frontageContinuity`, lifted. Same probes, same 2.0-unit reach, same
 * run-break rule; only the mask differs between a base call and a fused call.
 */
export function frontageContinuity(mask, M) {
  const { urban, streetLines, N } = M;
  const D = distanceTransform(mask.a, mask.n, true);
  const lab = components(mask).labels;
  const near = NEAR_UNITS / mask.s;
  const S = mask.s, n = mask.n;
  const frontOf = (qx, qy) => {
    const rc = Math.ceil(near);
    const c0 = Math.floor(qx / S), r0 = Math.floor(qy / S);
    let best = -1, bd = Infinity;
    for (let dy = -rc; dy <= rc; dy++) for (let dx = -rc; dx <= rc; dx++) {
      const cx = c0 + dx, cy = r0 + dy;
      if (cx < 0 || cy < 0 || cx >= n || cy >= n) continue;
      const i = cy * n + cx;
      if (!mask.a[i]) continue;
      const d = Math.hypot(dx, dy);
      if (d <= near && d < bd) { bd = d; best = lab[i]; }
    }
    return best;
  };
  let tot = 0, hit = 0;
  const runs = [];
  const fronting = new Set();
  for (const sl of streetLines) {
    for (const side of [1, -1]) {
      let runLen = 0, runId = -2;
      for (let k = 0; k + 1 < sl.poly.length; k++) {
        const [x0, y0] = sl.poly[k], [x1, y1] = sl.poly[k + 1];
        const L = Math.hypot(x1 - x0, y1 - y0);
        if (L < 0.4 || L > 200) continue;
        const nx = -(y1 - y0) / L, ny = (x1 - x0) / L;
        const steps = Math.max(1, Math.round(L));
        for (let s = 0; s < steps; s++) {
          const t = s / steps, px = x0 + (x1 - x0) * t, py = y0 + (y1 - y0) * t;
          const qx = px + nx * side * (sl.hw + PROBE_OFFSET), qy = py + ny * side * (sl.hw + PROBE_OFFSET);
          if (qx < 1 || qy < 1 || qx >= 999 || qy >= 999) { if (runLen) { runs.push(runLen); runLen = 0; runId = -2; } continue; }
          if (!urban.at(qx, qy)) { if (runLen) { runs.push(runLen); runLen = 0; runId = -2; } continue; }
          tot++;
          const id = frontOf(qx, qy);
          if (id >= 0) {
            hit++; fronting.add(id);
            if (id === runId) runLen += L / steps;
            else { if (runLen) runs.push(runLen); runLen = L / steps; runId = id; }
          } else if (runLen) { runs.push(runLen); runLen = 0; runId = -2; }
        }
      }
      if (runLen) runs.push(runLen);
    }
  }
  const st = stats(runs);
  return {
    probes: tot, fronted: hit,
    ratio: tot ? r4(hit / tot) : null,
    runs: runs.length,
    meanRunUnits: st.mean, p50RunUnits: st.p50, p90RunUnits: st.p90, maxRunUnits: st.max,
    frontingMasses: fronting.size,
  };
}

/**
 * F3 — freestanding fraction intramuros. Intramuros is flooded from the frame border with the
 * WALL ink and the WATER body as barriers; what the flood cannot reach is inside the circuit.
 */
/**
 * @param {object} M              masks from masksFor()
 * @param {object} [opt]
 * @param {number} [opt.gateBridgeUnits]  radius that bridges a drawn gate break
 * @param {Array}  [opt.circuitPoly]      the MODEL's own `walls[].closedPolygon`, when a caller
 *   has it. ⭐ PREFERRED, AND THE FLOOD IS THE FALLBACK RATHER THAN THE OTHER WAY ROUND.
 *   MEASURED on the sealed city: the drawn circuit does not enclose anything at ANY bridging
 *   radius (0 → 45 units all give 0 enclosed cells), because the ink is a HALF-RING that the
 *   water law then CUTS twelve more times (REG-0's own `wallWaterClip.wetCuts = 12`). The
 *   drawing is right and the flood is the wrong instrument for it: a circuit that lawfully
 *   stops at the water is not a closed curve in ink, and no amount of dilation makes it one.
 *   `closedPolygon` is the fabric's published answer to exactly this question — "the circuit as
 *   it would stand if the river were not the fourth wall".
 */
export function freestanding(M, { gateBridgeUnits = 18, circuitPoly = null } = {}) {
  const { built, fused, urban, waterM, wallLine, wallSegs, bodies, N } = M;
  // ── the barrier: wall ink + water.
  // ⚠⚠ BITTEN: a bare dilate of the wall ink LEAKS, and the leak is lawful geometry — the
  // circuit is drawn with GATE BREAKS in it (renderFolio §15, "gate BREAKS and piers"), and the
  // city's gate radius is ~29 units. A flood started at the frame border walks straight in
  // through a gate and reports NO ENCLOSURE on a leaf that plainly has a wall. The cure is a
  // morphological CLOSE at a stated gate-bridging radius: wide enough to span a gate, narrow
  // enough not to swallow the streets behind it. The radius is published on every result, so a
  // later wave can argue with the number instead of re-discovering the leak.
  const barrier = new PxMask(N);
  if (wallSegs) {
    const w = close(dilate(wallLine, 1.6), gateBridgeUnits);
    for (let i = 0; i < barrier.a.length; i++) if (w.a[i]) barrier.a[i] = 1;
  }
  for (let i = 0; i < barrier.a.length; i++) if (waterM.a[i]) barrier.a[i] = 1;
  // ── flood from the frame border
  const outside = new Uint8Array(N * N);
  const stack = new Int32Array(N * N);
  let sp = 0;
  const push = (i) => { if (!outside[i] && !barrier.a[i]) { outside[i] = 1; stack[sp++] = i; } };
  for (let x = 0; x < N; x++) { push(x); push((N - 1) * N + x); }
  for (let y = 0; y < N; y++) { push(y * N); push(y * N + N - 1); }
  while (sp > 0) {
    const p = stack[--sp];
    const x = p % N, y = (p / N) | 0;
    if (x > 0) push(p - 1);
    if (x < N - 1) push(p + 1);
    if (y > 0) push(p - N);
    if (y < N - 1) push(p + N);
  }
  const s = built.s;
  const enclosedCells = (() => { let c = 0; for (let i = 0; i < outside.length; i++) if (!outside[i] && !barrier.a[i]) c++; return c; })();
  const insideAt = (x, y) => {
    const cx = Math.floor(x / s), cy = Math.floor(y / s);
    if (cx < 0 || cy < 0 || cx >= N || cy >= N) return false;
    return !outside[cy * N + cx] && !barrier.a[cy * N + cx];
  };
  // ⚠ enclosure must be REAL. A half-ring that never closes, or an unwalled leaf, floods
  // everywhere; the instrument says so and names the fallback denominator rather than
  // reporting a fraction of a population it invented.
  const floodFormed = wallSegs > 0 && enclosedCells > (N * N) * 0.002;
  const enclosureFormed = !!circuitPoly || floodFormed;
  const scope = circuitPoly
    ? "intramuros (the model's own walls[].closedPolygon)"
    : (floodFormed ? 'intramuros (flood-derived, wall+water barrier)' : 'urban envelope (NO ENCLOSURE FORMED IN INK — fallback, named)');
  const inScope = circuitPoly
    ? (x, y) => polyIn(circuitPoly, x, y)
    : (floodFormed ? insideAt : (x, y) => !!urban.at(x, y));

  // ── how many BODIES share each fused component
  const comps = components(fused);
  const perComp = new Map();
  const tagged = [];
  for (const b of bodies) {
    const cx = Math.floor(b.c[0] / s), cy = Math.floor(b.c[1] / s);
    if (cx < 0 || cy < 0 || cx >= N || cy >= N) continue;
    const id = comps.labels[cy * N + cx];
    if (id < 0) continue;                       // a centroid in a hole — not attributable
    perComp.set(id, (perComp.get(id) || 0) + 1);
    tagged.push({ ...b, comp: id });
  }
  let denom = 0, solitary = 0;
  for (const b of tagged) {
    if (!inScope(b.c[0], b.c[1])) continue;
    denom++;
    if (perComp.get(b.comp) === 1) solitary++;
  }
  return {
    scope, enclosureFormed, floodEnclosureFormed: floodFormed, enclosedCells, gateBridgeUnits,
    circuitFromModel: !!circuitPoly,
    bodiesDrawn: bodies.length, bodiesAttributed: tagged.length,
    intramuralBodies: denom, solitaryBodies: solitary,
    freestandingFraction: denom ? r4(solitary / denom) : null,
    fusedComponents: comps.count,
    bodiesPerFusedComponent: denom ? r2(denom / new Set(tagged.filter((b) => inScope(b.c[0], b.c[1])).map((b) => b.comp)).size) : null,
  };
}

export function measure(svgPath, opts) {
  const M = masksFor(svgPath, opts);
  const base = frontageContinuity(M.built, M);
  const fusedFC = M.FUSE_R > 0 ? frontageContinuity(M.fused, M) : base;
  const fs = freestanding(M, { circuitPoly: opts.circuitPoly || null });
  return {
    svg: svgPath, grid: M.N, frontage: opts.frontage, fuseRadiusUnits: r2(M.FUSE_R),
    wallbandUnits: opts.wallbandUnits || 0, buildingsClearedByWallband: M.clearedSubpaths,
    streetPolylines: M.streetLines.length, builtCells: M.built.count(), fusedCells: M.fused.count(),
    F1F2_base: base, F1F2_fused: fusedFC, F3: fs,
  };
}

/* ────────────────────────────── CLI ────────────────────────────── */
if (import.meta.url === `file://${process.argv[1]}`) {
  if (process.argv.includes('--controls')) {
    const CITY = `${R0}/out/base-city-city-parchment.svg`;
    const VILL = `${R0}/out/base-village-village-parchment.svg`;
    const out = {};
    process.stdout.write('── REPRODUCTION · --reg0compat must reproduce REG-0\'s own published base figures\n');
    for (const [name, svg, frontage, want] of [
      ['city', CITY, 6.25, { probes: 38696, fronted: 19186, ratio: 0.4958, runs: 1709, meanRunUnits: 11.22, frontingMasses: 609 }],
      ['village', VILL, 13.75, { probes: 3948, fronted: 2576, ratio: 0.6525, runs: 176, meanRunUnits: 14.66, frontingMasses: 68 }],
    ]) {
      const M = masksFor(svg, { frontage, wallbandUnits: r2(frontage * 1.15), legacyStamp: true });
      const got = frontageContinuity(M.built, M);
      const same = Object.keys(want).every((k) => (typeof want[k] === 'number' && Math.abs(got[k] - want[k]) <= (k === 'meanRunUnits' ? 0.02 : 0)));
      out[`repro_${name}`] = { want, got, same };
      process.stdout.write(`   ${name.padEnd(8)} ${same ? 'REPRODUCED' : 'DIFFERS'}\n`);
      for (const k of Object.keys(want)) process.stdout.write(`      ${k.padEnd(15)} REG-0=${String(want[k]).padEnd(9)} here=${got[k]}\n`);
    }

    process.stdout.write('\n── POSITIVE · fusion must cut the RUN COUNT and lengthen the RUN, at a near-invariant ratio\n');
    const Mc = masksFor(CITY, { frontage: 6.25, wallbandUnits: 7.19 });
    const b = frontageContinuity(Mc.built, Mc), f = frontageContinuity(Mc.fused, Mc);
    process.stdout.write(`   base   ratio=${b.ratio} runs=${b.runs} meanRun=${b.meanRunUnits} masses=${b.frontingMasses}\n`);
    process.stdout.write(`   fused  ratio=${f.ratio} runs=${f.runs} meanRun=${f.meanRunUnits} masses=${f.frontingMasses}\n`);
    out.fusion = { base: b, fused: f };

    process.stdout.write('\n── NEGATIVE · --fuse=0 must return every fused figure to the base exactly\n');
    const M0 = masksFor(CITY, { frontage: 6.25, wallbandUnits: 7.19, fuseUnits: 0 });
    const z = frontageContinuity(M0.fused, M0);
    const zeroOk = z.ratio === b.ratio && z.runs === b.runs && z.frontingMasses === b.frontingMasses;
    process.stdout.write(`   fuse=0 ratio=${z.ratio} runs=${z.runs} masses=${z.frontingMasses}  → ${zeroOk ? 'IDENTICAL to base' : 'DIFFERS (BROKEN)'}\n`);

    process.stdout.write('\n── NEGATIVE · --shatter=0.35 manufactures the §571.4 defect; runs must RISE and the ratio FALL\n');
    const Ms = masksFor(CITY, { frontage: 6.25, wallbandUnits: 7.19, shatter: 0.35 });
    const sh = frontageContinuity(Ms.built, Ms);
    const shF = freestanding(Ms), bF = freestanding(Mc);
    process.stdout.write(`   shattered ratio=${sh.ratio} runs=${sh.runs} meanRun=${sh.meanRunUnits}  freestanding=${shF.freestandingFraction} (${shF.scope})\n`);
    process.stdout.write(`   intact    ratio=${b.ratio} runs=${b.runs} meanRun=${b.meanRunUnits}  freestanding=${bF.freestandingFraction} (${bF.scope})\n`);
    out.shatter = { shattered: sh, shatteredF3: shF, intact: b, intactF3: bF };

    const live = [
      ['reproduces REG-0 city base', out.repro_city.same],
      ['reproduces REG-0 village base', out.repro_village.same],
      ['fusion cuts the run count', f.runs < b.runs],
      ['fusion lengthens the mean run', f.meanRunUnits > b.meanRunUnits],
      ['fusion leaves the ratio near-invariant', Math.abs(f.ratio - b.ratio) < 0.01],
      ['fuse=0 is identical to the base', zeroOk],
      ['shatter raises the run count', sh.runs > b.runs],
      ['shatter lowers the ratio', sh.ratio < b.ratio],
      ['shatter raises the freestanding fraction', shF.freestandingFraction > bF.freestandingFraction],
    ];
    process.stdout.write('\n── LIVENESS\n');
    for (const [n, ok] of live) process.stdout.write(`   ${ok ? 'ok    ' : 'BROKEN'} ${n}\n`);
    writeFileSync(`${HERE}/out/i6-controls.json`, JSON.stringify({ ...out, liveness: live }, null, 2));
    process.stdout.write(`\nI6_CONTROLS ${live.every((l) => l[1]) ? 'LIVE' : 'BROKEN'}\n`);
  } else {
    const svg = arg('svg', `${R0}/out/base-city-city-parchment.svg`);
    const frontage = Number(arg('frontage', '6.25'));
    const opts = {
      lens: arg('lens', 'parchment'), N: Number(arg('grid', '1400')), frontage,
      wallbandUnits: process.argv.includes('--reg0compat') ? r2(frontage * 1.15) : Number(arg('wallband', '0')),
      legacyStamp: process.argv.includes('--reg0compat'),
      fuseUnits: process.argv.includes('--fuse=') || arg('fuse', null) != null ? Number(arg('fuse', '0')) : null,
      shatter: Number(arg('shatter', '0')),
    };
    const res = measure(svg, opts);
    const json = arg('json', null);
    if (json) writeFileSync(json, JSON.stringify(res, null, 2));
    process.stdout.write(JSON.stringify(res, null, 2) + '\nI6_DONE\n');
  }
}
