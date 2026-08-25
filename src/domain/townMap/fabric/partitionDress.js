/**
 * domain/townMap/fabric/partitionDress.js — ⭐⭐⭐ **DRESS-1 · THE STRUCTURAL INK.**
 * DESIGN_SPINE_COMPLETION §1 (DRESS-1 half) as amended by PA.3/PA.4/PA.6 and OA.1–OA.5.
 *
 * ⭐⭐⭐ **WHAT THIS FILE IS.** SPINE-1 built `projectPage`, which produces a fully-formed,
 * painter-ready page frame — and until now NOTHING CONSUMED IT AS INK: its only readers were a
 * census printing counts and a test asserting a bijection. §686.6(iii) says so in the ledger
 * (*"`renderFolio.mjs` holds no reference to `spinePartition`/`projectPage`/`partitionView`"*).
 * This module is the ink: page frame + wall publication + a closed lens vocabulary → SVG.
 *
 * ⭐⭐ **THE FOUR CURES IT IS BUILT AROUND, EACH A REVIEW CONVICTION, NOT A PREFERENCE:**
 *   I4  *"buildings/yards/plots merge into one pale texture"* → the street ground and the plot
 *       ground are SEPARATE TONES, and the separation is asserted by the census, not hoped for.
 *   I3  *"~60 % of fabric at near-paper value … the 320 px squint inverts"* → a VALUE FLOOR:
 *       no fabric fill sits within one value step of the paper. See `VALUE_STEP`.
 *   I7  *"stray grain-line family (stroke 0.25 / opacity 0.72, 814 subpaths) crosses streets,
 *       buildings, the river and the open sea"* → every grain line is SCANLINE-CLIPPED to the
 *       face that owns it. The clip is exact, so the §650.2 clip census reads a true zero.
 *   B7  *"flat-tinted footprints with no hips / two-tone planes / chimneys / eaves shadow; the
 *       ridge segments … OVERSHOOT eaves (max 52.6 u)"* → hf208's plan-view roof grammar, with
 *       the ridge clipped to **the run's own dissolved footprint** (PA.6), never the chunk.
 *   I10 *"symmetric tick-ladder band reads as railway … ditch is plain dashes"* → the band is
 *       coursed rubble-fill between two edges with the ditch as RADIATING HACHURE (hf314).
 *
 * ⭐⭐ **PA.6's LOOK, RULED AND OBEYED: the built band with visible toft ground wins.** A mass
 * draws the BUILT FOOTPRINT — the run IS the eaves line (hf208 / hf208's own plan rule) — and the
 * YARDS REMAIN GROUND at the plot-ground tone. That is what makes I4's separation visible at page
 * scale: three tones, not one wash.
 *
 * ⛔ **NO CONSTANT IS MINTED HERE.** Every number below is either (a) read from the estate's own
 * signed tables (`WALL_BAND`, `COMB_PITCH_FRONTAGES`, `TEXTURE_PITCH_FRONTAGES`,
 * `TEXTURE_PATCH_SHARE`, `STAIR_PITCH_FRONTAGES`, `V_QUAY_BAND`), (b) expressed in PLOT
 * FRONTAGES so it survives the tier ladder (renderFolio's own §179 lesson: ink stated in view
 * units is right at one tier and wrong at the rest), or (c) the §9.7 VALUE STEP restated. The two
 * wear thresholds are PA.4's chair-signed provisionals and live in `wallPublication.js`, not here.
 *
 * PURITY: pure. No `Date`, no `Math.random`, no rng — the dress reads the publication's already
 * seeded decisions. A view that draws is a view that cannot be re-derived (partitionView's law).
 */

import { r2, splitPolygon, centroid, absArea } from './fabricGeometry.js';
import { resolveLens, luminance, HATCH } from './folioLenses.js';
import { V_QUAY_BAND } from './waterWorks.js';
import {
  COMB_PITCH_FRONTAGES, TEXTURE_PITCH_FRONTAGES, TEXTURE_PATCH_SHARE, STAIR_PITCH_FRONTAGES,
} from './rampartWorks.js';

export const DRESS_SCHEMA_VERSION = 1;

/**
 * ⭐⭐ **THE VALUE STEP — RESTATED, NOT MINTED.** `folioLenses.lensContrast` already defines it:
 * *"each step ≈ 1.28×, so three ≈ 2.1×"*. I3's cure is "no fabric falls to paper", and the
 * estate's own unit for "one value apart" is this ratio. Using it means the floor is the same
 * quantity §9.7's binding sub-law is written in, on cream paper and on a night ground alike.
 */
export const VALUE_STEP = 1.28;

/**
 * ⭐ **THE GRAIN-LINE FAMILY, KEPT AND CLIPPED (I7).** The review did not convict the family's
 * WEIGHT — it convicted its REACH: *"crosses streets, buildings, the river, and the open sea"*.
 * The stroke and opacity are therefore carried forward verbatim and the cure is the clip.
 */
export const GRAIN = Object.freeze({ stroke: 0.25, opacity: 0.72 });

/** Draw order. Ground first, pieces over it, marks last — `PAGE_LAYERS` with the ink's own rows. */
export const DRESS_LAYERS = Object.freeze(['paper', 'fields', 'water', 'ground', 'voids',
  'masses', 'roofs', 'band', 'gates', 'crossings', 'quays', 'marks']);

/** Every `<g id>` the dress can emit, so the legend census has a closed roster to check against. */
export const DRESS_GROUPS = Object.freeze([
  'dress-paper', 'dress-fields', 'dress-grain', 'dress-water', 'dress-shore', 'dress-ground',
  'dress-street', 'dress-voids', 'dress-yards', 'dress-masses', 'dress-eaves', 'dress-ridges',
  'dress-hips', 'dress-planes', 'dress-chimneys', 'dress-unitlines', 'dress-band', 'dress-coursing',
  'dress-comb', 'dress-towers', 'dress-ditch', 'dress-stairs', 'dress-gates', 'dress-decks',
  'dress-ford', 'dress-stepping', 'dress-quays', 'dress-vquay', 'dress-relict',
  /** ⚠ E11's group belongs on this roster: the legend census found it TAUGHT-BUT-UNDRAWABLE on
   *  all 18 leaves, which is precisely the one-directional failure the census exists to catch —
   *  and it caught it in its own author's roster. */
  'dress-accessible',
]);

const DEG = Math.PI / 180;

/**
 * ⭐⭐⭐ **THE PAGE-REGISTER QUANTUM, AND IT IS A MEASURED CURE FOR A MEASURED RED.** The first
 * full-corpus render of this dress put the metropolis at **839,019 B against its signed 830,000 B
 * ceiling — OVER by 9,019 (1.09 %)**, and the byte table binds FIRST at town+ by §641.4's own
 * signature. Byte attribution found no single hog (the largest group was 14.5 %), so a cut would
 * have had to delete a whole family of marks the review asked for. The cause was elsewhere: every
 * coordinate was written at TWO decimals.
 *
 * ⭐ At page register the frame is ~1,200 world units drawn into 1,000–2,200 px, so **0.1 world
 * unit is 0.08–0.18 px** — under half a pixel at the highest raster this estate shoots.
 *
 * ⛔⛔ **AND THE CONTROL CORRECTED THE CLAIM THAT WAS FIRST WRITTEN HERE.** This comment said the
 * cure had *"NO drawing change"*. `harness/laneDRESS1/precisionControl.mjs` renders the metropolis
 * at both precisions and diffs the 2,200 px rasters, and the honest figures are:
 * **839,019 → 707,981 B (−131,038, −15.62 %)** with **max channel Δ 38 and mean Δ 0.0289 over
 * 4,840,000 px** — sub-perceptual in aggregate (0.011 % of the channel), NOT byte-identical.
 * Against the liveness plant (whole units) at max Δ 119 / mean Δ 0.163, the cure moves **5.6×
 * less in the mean**. THE SHAPES DRAWN ARE THE SAME SHAPES; what moves is where their vertices
 * land inside a pixel, which is an anti-aliasing shift at edges and nothing else. Recorded at its
 * measured size rather than as the zero the first sentence claimed.
 *
 * ⚠ `fabricGeometry.r2` IS DELIBERATELY NOT CHANGED. It is the LEGACY renderer's shared rounding;
 * moving it would move the shipped corpus render and take this wave's dormancy claim with it.
 * The quantum is local to the dress, which is the only surface it governs.
 */
export const PAGE_QUANTUM_DECIMALS = 1;

/**
 * ⚠ **A MODULE-SCOPED QUANTUM, AND IT EXISTS FOR EXACTLY ONE CALLER.** `precisionControl.mjs` has
 * to render the SAME geometry at two precisions to prove the cure invisible; re-rounding the
 * already-rounded output is a NO-OP, which is what the control's first execution actually
 * measured (`707981 → 707981, −0 B`) and reported as a −0 % saving. `dressPage` sets this from
 * `opts.decimals` on entry and restores it in a `finally`, so the default is the only value any
 * production caller ever sees and no state can survive a throw.
 */
let QUANTUM = 10 ** PAGE_QUANTUM_DECIMALS;
const q = (v) => Math.round(v * QUANTUM) / QUANTUM;

/** SVG path data for a closed ring at the page quantum. */
export function polyPath(poly) {
  let s = '';
  for (let i = 0; i < poly.length; i++) s += (i === 0 ? 'M' : 'L') + q(poly[i][0]) + ' ' + q(poly[i][1]);
  return s + 'Z';
}

/** SVG path data for an open polyline at the page quantum. */
export function linePath(pts) {
  let s = '';
  for (let i = 0; i < pts.length; i++) s += (i === 0 ? 'M' : 'L') + q(pts[i][0]) + ' ' + q(pts[i][1]);
  return s;
}

/**
 * ⭐⭐⭐ **DRESS ONE PAGE FRAME.**
 *
 * @param {any} page a `PARTITION_PAGE_FRAME` from `projectPage`
 * @param {{lens?:string, roadWidth?:number, walls?:any, water?:any, crossings?:any,
 *          quays?:any, accessible?:boolean, tier?:string}} [opts]
 */
export function dressPage(page, opts = {}) {
  const keptQuantum = QUANTUM;
  if (Number.isFinite(opts.decimals)) QUANTUM = 10 ** opts.decimals;
  try {
    return dressPageInner(page, opts);
  } finally {
    QUANTUM = keptQuantum;
  }
}

function dressPageInner(page, opts) {
  const LENS = resolveLens(opts.lens);
  const rw = opts.roadWidth || 5;
  const T = tones(LENS, opts);
  const INK = inkScale(rw, LENS.ink);
  const out = [];
  const prims = { n: 0 };
  const census = {
    grainSegments: 0, grainOutside: 0, ridges: 0, ridgeClipped: 0, ridgeOutside: 0,
    masses: 0, planes: 0, hips: 0, chimneys: 0, unitLines: 0,
    bandFaces: 0, coursing: 0, towers: 0, gatehouses: 0, ditchHachure: 0,
    waterFaces: 0, shoreStrokes: 0, decks: 0, fords: 0, steppingStones: 0, quays: 0, vquay: 0,
    relictDressed: 0, relictSuppressed: 0,
  };
  const g = (id, body) => {
    if (!body) return;
    out.push(`<g id="${id}">${body}</g>`);
  };

  const F = page.frame;
  // ── PAPER ────────────────────────────────────────────────────────────────────────────────
  g('dress-paper', `<rect x="${r2(F.x)}" y="${r2(F.y)}" width="${r2(F.w)}" height="${r2(F.h)}"`
    + ` fill="${T.paper}"/>`);
  prims.n += 1;

  // ── FIELDS + THE GRAIN, CLIPPED (I7's cure) ──────────────────────────────────────────────
  {
    const fills = [];
    const grain = [];
    for (const f of page.fields) {
      if (f.ring.length < 3) continue;
      fills.push(polyPath(f.ring));
      // ⭐ THE GRAIN IS THE FURLONG'S OWN STRIP TEXTURE (hf140), and it is SCANLINE-CLIPPED to
      //   this face. A segment outside its face is the I7 defect and the census counts it.
      const ang = grainAngle(f.ring);
      for (const seg of hatchPolygon(f.ring, ang, rw * 1.15)) {
        grain.push(linePath(seg));
        census.grainSegments++;
      }
    }
    g('dress-fields', fills.length
      ? `<path d="${fills.join('')}" fill="${T.field}" stroke="none"/>` : '');
    // ⚠ THE GRAIN IS DRAWN IN THE FIELD'S OWN DARKER TONE, NOT IN INK. On the first render the
    //   countryside's corduroy OUT-SHOUTED the town at page scale — which is I3's inversion
    //   arriving from the other side (fabric not falling to paper, but the field rising past it).
    //   A furrow is a tonal texture in the corpus (hf140), not a drawn line in map ink.
    g('dress-grain', grain.length
      ? `<path d="${grain.join('')}" fill="none" stroke="${T.grain}" stroke-width="${GRAIN.stroke}"`
        + ` stroke-opacity="${GRAIN.opacity}"/>` : '');
    prims.n += fills.length + grain.length;
  }

  // ── WATER: the bank-bounded body with SHORE-PARALLEL strokes ──────────────────────────────
  {
    const body = [];
    const shore = [];
    const calm = [];
    for (const w of page.water) {
      if (w.ring.length < 3) continue;
      census.waterFaces++;
      body.push(polyPath(w.ring));
      // ⭐ hf322's RECESSION LINES: strokes PARALLEL TO SHORE, hugging the edge — never a
      //   perspective wave, and never a fill. Three inset rings, each thinner than the last.
      for (let k = 1; k <= 3; k++) {
        const r = insetRing(w.ring, rw * 0.30 * k);
        if (r && r.length >= 3) { shore.push(polyPath(r)); census.shoreStrokes++; }
      }
      // ⭐ HARBOUR WATER IS CALM-RULED (the charter's own word): a still body takes ruled
      //   horizontals rather than shore echoes, which is what makes a basin read as sheltered.
      if (w.kind === 'harbour' || w.kind === 'sea' || w.kind === 'lake' || w.kind === 'coast') {
        for (const seg of hatchPolygon(w.ring, 0, rw * 1.8)) calm.push(linePath(seg));
      }
    }
    g('dress-water', body.length
      ? `<path d="${body.join('')}" fill="${T.water}" stroke="none"/>` : '');
    g('dress-shore', shore.length || calm.length
      ? `<path d="${shore.concat(calm).join('')}" fill="none" stroke="${T.waterInk}"`
        + ` stroke-width="${INK.hair}" stroke-opacity="0.55"/>` : '');
    prims.n += body.length + shore.length + calm.length;
  }

  // ── GROUND: the STREET GAP as its own surface, at its own tone (I4's cure) ────────────────
  {
    const streets = [];
    for (const w of page.ways) {
      if (w.ring.length < 3) continue;
      streets.push(polyPath(w.ring));
    }
    g('dress-street', streets.length
      ? `<path d="${streets.join('')}" fill="${T.street}" stroke="none"/>` : '');
    prims.n += streets.length;
  }

  // ── VOIDS at their own register — never aggregated (§4 / L-REG-30 generalized) ────────────
  {
    const voids = [];
    for (const v of page.voids) if (v.ring.length >= 3) voids.push(polyPath(v.ring));
    g('dress-voids', voids.length
      ? `<path d="${voids.join('')}" fill="${T.voidGround}" stroke="${T.ink}"`
        + ` stroke-width="${INK.hair}" stroke-opacity="0.5"/>` : '');
    prims.n += voids.length;
  }

  // ── MASSES: PA.6's LOOK — the BUILT band over visible toft ground ─────────────────────────
  {
    const yards = [];
    const built = [];
    const nwPlane = [];
    const sePlane = [];
    const ridges = [];
    const hips = [];
    const eaves = [];
    const chimneys = [];
    const unit = [];
    for (const m of page.masses) {
      if (!m.ring || m.ring.length < 3) continue;
      census.masses++;
      // THE YARD IS GROUND. The chunk's own ring carries the toft; the BUILT footprint is the
      // run band inside it. Two rings, two tones — which is the whole of PA.6's ruled look.
      yards.push(polyPath(m.ring));
      for (const [ri, runRing] of (m.runRings || []).entries()) {
        if (!runRing || runRing.length < 3) continue;
        const ridge = (m.ridgeOfRun || m.ridges || [])[ri] || null;
        // ⭐⭐ **THE RUN IS THE EAVES LINE** (hf208, honouring the hf208/hf208-plan rule): the
        //     built footprint IS the run's dissolved ring, inset by a hair so the toft shows.
        const foot = insetRing(runRing, rw * 0.10) || runRing;
        built.push(polyPath(foot));
        // ⭐⭐ **RIDGE CLIPPED TO THE RUN'S OWN FOOTPRINT (PA.6) — B7's overshoot class dies.**
        if (ridge) {
          census.ridges++;
          const clipped = clipSegment(foot, ridge[0], ridge[1]);
          if (!clipped) { census.ridgeOutside++; continue; }
          if (!sameSeg(clipped, ridge)) census.ridgeClipped++;
          ridges.push(linePath(clipped));
          // ⭐ TWO-TONE PLANES, SE DARK (hf208 rule 4; NW light / SE shadow throughout the corpus)
          const [a, b] = splitPolygon(foot, clipped[0][0], clipped[0][1],
            clipped[1][0] - clipped[0][0], clipped[1][1] - clipped[0][1]);
          if (a && b) {
            const ca = centroid(a); const cb = centroid(b);
            const aIsSE = (ca[0] + ca[1]) > (cb[0] + cb[1]);
            sePlane.push(polyPath(aIsSE ? a : b));
            nwPlane.push(polyPath(aIsSE ? b : a));
            census.planes += 2;
          }
          // ⭐ HIPS AT RUN ENDS (hf208 rule 3): the ridge stops short and angled lines run from
          //   each ridge end to the footprint's two nearest corners.
          for (const end of [clipped[0], clipped[1]]) {
            for (const c of twoNearest(foot, end)) { hips.push(linePath([end, c])); census.hips++; }
          }
          // ⭐ CHIMNEYS ASTRIDE THE RIDGE (hf208 rule 9) — a square only; smoke is not drawn on
          //   a sound house. One per run, at the ridge's own third, and only where the run is
          //   large enough for the square to read at page scale.
          if (absArea(foot) > (rw * rw) * 1.6) {
            const p = lerp(clipped[0], clipped[1], 0.34);
            const s = rw * 0.16;
            chimneys.push(polyPath([[p[0] - s, p[1] - s], [p[0] + s, p[1] - s],
              [p[0] + s, p[1] + s], [p[0] - s, p[1] + s]]));
            census.chimneys++;
          }
        }
        // ⭐ EAVES SHADOW: a tick along the SE-facing edges of the footprint, one value step
        //   under the built tone. It is what stops the fabric reading as flat tint.
        for (const seg of seFacingEdges(foot)) eaves.push(linePath(seg));
      }
      // ⭐⭐ MEMBER UNIT-LINES (A1.2) — **HOLLOW WASH IS BANNED**: a 30-member mass is 31
      //     primitives, and the interior party lines are what make it an aggregation.
      for (const l of m.unitLines) { unit.push(linePath(l)); census.unitLines++; }
    }
    g('dress-yards', yards.length
      ? `<path d="${yards.join('')}" fill="${T.plotGround}" stroke="none"/>` : '');
    g('dress-masses', built.length
      ? `<path d="${built.join('')}" fill="${T.built}" stroke="${T.ink}"`
        + ` stroke-width="${INK.detail}"/>` : '');
    g('dress-planes', (nwPlane.length ? `<path d="${nwPlane.join('')}" fill="${T.roofNW}" stroke="none"/>` : '')
      + (sePlane.length ? `<path d="${sePlane.join('')}" fill="${T.roofSE}" stroke="none"/>` : ''));
    g('dress-eaves', eaves.length
      ? `<path d="${eaves.join('')}" fill="none" stroke="${T.eaves}" stroke-width="${INK.body}"`
        + ` stroke-linecap="butt"/>` : '');
    g('dress-ridges', ridges.length
      ? `<path d="${ridges.join('')}" fill="none" stroke="${T.ink}" stroke-width="${INK.body}"/>` : '');
    g('dress-hips', hips.length
      ? `<path d="${hips.join('')}" fill="none" stroke="${T.ink}" stroke-width="${INK.detail}"`
        + ` stroke-opacity="0.85"/>` : '');
    g('dress-chimneys', chimneys.length
      ? `<path d="${chimneys.join('')}" fill="${T.ink}" stroke="none"/>` : '');
    g('dress-unitlines', unit.length
      ? `<path d="${unit.join('')}" fill="none" stroke="${T.ink}" stroke-width="${INK.hair}"`
        + ` stroke-opacity="0.78"/>` : '');
    prims.n += yards.length + built.length + nwPlane.length + sePlane.length + ridges.length
      + hips.length + eaves.length + chimneys.length + unit.length;
  }

  // ── WALLS: REG-2's vocabulary re-targeted to the BAND FACE ────────────────────────────────
  if (opts.walls && opts.walls.circuits) {
    const bandFill = [];
    const coursing = [];
    const comb = [];
    const towers = [];
    const ditch = [];
    const stairs = [];
    const gates = [];
    const relict = [];
    for (const c of opts.walls.circuits) {
      // ⭐⭐ **B4's CURE: a relict ring is DRESSED or SUPPRESSED — never a bare floating slash.**
      //     The review found *"bare strokes … with no anatomy, no endpoints on any district
      //     edge, no legend row"*. A circuit whose wear has reached `crumbling` and which is not
      //     the outermost is DRESSED as a robbed stretch (hf123's "vanished wall" — the line
      //     survives as a property boundary), never stroked as a naked slash.
      const relictRing = c.index < opts.walls.circuits.length - 1;
      for (const f of c.fragments) {
        const bandPoly = bandOf(f.ring, c.band, f.closed);
        if (!bandPoly) continue;
        census.bandFaces++;
        if (relictRing && c.wear && c.wear.grade === 'crumbling') {
          // the dressed relict: the band's line kept as a BOUND, with the ditch's ghost, and
          // counted so a reader can tell dressing from suppression.
          relict.push(f.closed ? polyPath(f.ring) : linePath(f.ring));
          census.relictDressed++;
          continue;
        }
        bandFill.push(polyPath(bandPoly));
        // ⭐ COURSING IN PATCHES, NOT A CONTINUOUS LADDER (hf261 rung 4 — and it is what makes
        //   it affordable). The pitch and the patch share are the estate's own signed figures.
        const patch = hatchPolygon(bandPoly, 90, rw * TEXTURE_PITCH_FRONTAGES);
        const keep = Math.max(1, Math.round(patch.length * TEXTURE_PATCH_SHARE));
        for (let i = 0; i < keep; i++) { coursing.push(linePath(patch[i])); census.coursing++; }
        // ⭐ THE COMB on the OUTER edge only — hf103's MURUS SECUNDUS, and the reason I10's
        //   "symmetric tick-ladder reads as railway" dies: a comb on one edge is not a ladder.
        for (const seg of combTicks(f.ring, c.band, rw * COMB_PITCH_FRONTAGES, f.closed)) {
          comb.push(linePath(seg));
        }
        // ⭐ THE DITCH AS RADIATING HACHURE (I10's cure, hf314): strokes running OUTWARD from
        //   the outer edge, not a dashed line. Only where the run's own policy dug one.
        for (const [i, ri] of f.runOfVertex.entries()) {
          if (!f.runs[ri] || !f.runs[ri].ditch) continue;
          if (i % 2) continue;
          const n = outwardNormal(f.ring, i, f.closed);
          const p = f.ring[i];
          const o = c.band.stone / 2 + c.band.outer;
          ditch.push(linePath([[p[0] + n[0] * o, p[1] + n[1] * o],
            [p[0] + n[0] * (o + rw * 0.85), p[1] + n[1] * (o + rw * 0.85)]]));
          census.ditchHachure++;
        }
        // ⭐ WALL-STAIR FLIGHTS on the INNER face, and they are RARE (hf314) — one every
        //   ~9 frontages, which is the estate's own `STAIR_PITCH_FRONTAGES`.
        for (let i = 0; i < f.ring.length; i += Math.max(1, Math.round(STAIR_PITCH_FRONTAGES))) {
          const n = outwardNormal(f.ring, i, f.closed);
          const p = f.ring[i];
          const inn = c.band.stone / 2;
          stairs.push(linePath([[p[0] - n[0] * inn, p[1] - n[1] * inn],
            [p[0] - n[0] * (inn + rw * 0.4), p[1] - n[1] * (inn + rw * 0.4)]]));
        }
        // ⭐ TOWERS AS PLAN SHAPES STRADDLING THE BAND (hf315) — a type, never a repeat.
        for (const [ti, t] of f.towers.entries()) {
          towers.push(towerPlan(t, f.towerTypes[ti], c.band.stone, c.rung));
          census.towers++;
        }
        // ⭐ GATES SEATED **IN** THE BAND with hf313 anatomy — a gate that floats in a band gap
        //   is I10's second conviction. The passage is cut through the band and the flanking
        //   work is drawn on it.
        for (const gt of f.gates) {
          gates.push(gatePlan(gt, c.band, c.rung, rw));
          census.gatehouses++;
        }
      }
    }
    g('dress-band', bandFill.length
      ? `<path d="${bandFill.join('')}" fill="${T.bandGround}" stroke="${T.wall}"`
        + ` stroke-width="${INK.wall}" stroke-linejoin="round"/>` : '');
    g('dress-coursing', coursing.length
      ? `<path d="${coursing.join('')}" fill="none" stroke="${T.wall}" stroke-width="${INK.hair}"`
        + ` stroke-opacity="0.62"/>` : '');
    g('dress-comb', comb.length
      ? `<path d="${comb.join('')}" fill="none" stroke="${T.wall}" stroke-width="${INK.detail}"/>` : '');
    g('dress-ditch', ditch.length
      ? `<path d="${ditch.join('')}" fill="none" stroke="${T.ink}" stroke-width="${INK.hair}"`
        + ` stroke-opacity="0.7"/>` : '');
    g('dress-stairs', stairs.length
      ? `<path d="${stairs.join('')}" fill="none" stroke="${T.wall}" stroke-width="${INK.hair}"`
        + ` stroke-opacity="0.8"/>` : '');
    g('dress-towers', towers.length
      ? `<path d="${towers.join('')}" fill="${T.bandGround}" stroke="${T.wall}"`
        + ` stroke-width="${INK.strong}"/>` : '');
    g('dress-gates', gates.length
      ? `<path d="${gates.join('')}" fill="${T.paper}" stroke="${T.wall}"`
        + ` stroke-width="${INK.strong}"/>` : '');
    g('dress-relict', relict.length
      ? `<path d="${relict.join('')}" fill="none" stroke="${T.ink}" stroke-width="${INK.detail}"`
        + ` stroke-dasharray="${r2(rw * 0.9)} ${r2(rw * 0.5)}" stroke-opacity="0.65"/>` : '');
    prims.n += bandFill.length + coursing.length + comb.length + ditch.length + stairs.length
      + towers.length + gates.length + relict.length;
  }

  // ── CROSSINGS: decks OVER water with the shadow line · the FORD per PA.3 ──────────────────
  {
    const decks = [];
    const shadow = [];
    const ford = [];
    const stepping = [];
    for (const c of (page.crossings || [])) {
      const w = c.localWidth || rw * 2;
      if (c.kind === 'bridge') {
        const q = deckQuad(c, w, rw);
        if (q) {
          decks.push(polyPath(q));
          // ⭐ §649.2's FRESH-EYES EXIT: the deck reads as OVER the water because it casts a
          //   shadow line on the SE side. Without it a deck is a rectangle lying in the river.
          shadow.push(linePath([q[1], q[2]]));
          census.decks++;
        }
      } else if (c.kind === 'ford') {
        // ⭐⭐⭐ **PA.3 — THE FORD RULING, A TASTE CALL ALREADY MADE.** hf264-zoom-river-works is
        //   the BINDING PLATE: STIPPLE SHALLOWS across the widened reach, with SPLAYED FUNNEL
        //   APPROACH CHEVRONS on both banks. §649.2's "narrows + ripples" prose is CORRECTED and
        //   does not bind — and the widened reach is also §3e's own ford-at-the-wide-reach law.
        for (const d of fordStipple(c, w, rw)) ford.push(d);
        for (const d of fordChevrons(c, w, rw)) ford.push(d);
        census.fords++;
      } else if (c.kind === 'stepping' || c.kind === 'stones') {
        // ⭐ A DISTINCT CROSSING DRESS (PA.3), drawn only where truth mints it.
        for (const d of steppingStones(c, w, rw)) { stepping.push(d); census.steppingStones++; }
      }
    }
    g('dress-decks', decks.length
      ? `<path d="${decks.join('')}" fill="${T.deck}" stroke="${T.ink}" stroke-width="${INK.body}"/>`
        + (shadow.length ? `<path d="${shadow.join('')}" fill="none" stroke="${T.ink}"`
          + ` stroke-width="${INK.strong}" stroke-opacity="0.55"/>` : '') : '');
    g('dress-ford', ford.length
      ? `<path d="${ford.join('')}" fill="none" stroke="${T.waterInk}" stroke-width="${INK.hair}"`
        + ` stroke-linecap="round"/>` : '');
    g('dress-stepping', stepping.length
      ? `<path d="${stepping.join('')}" fill="${T.ink}" stroke="none"/>` : '');
    prims.n += decks.length + shadow.length + ford.length + stepping.length;
  }

  // ── QUAY / PIER INK on the moored faces, with V-QUAY at its SIGNED band ───────────────────
  {
    const quays = [];
    const vq = [];
    // ⚠ A QUAY RECORD CARRIES A **FACE ID**, NOT A RING (`partitionWater.mintQuays`), so the ring
    //   is resolved through the caller's own face reader rather than re-walked here — the view
    //   law again: the dress reads, it does not re-derive.
    const ringOfFace = opts.ringOfFace || (() => null);
    for (const q of (page.quays || [])) {
      const ring = q.ring || q.polygon || ringOfFace(q.face);
      if (!ring || ring.length < 3) continue;
      census.quays++;
      quays.push(polyPath(ring));
      // ⭐ V-QUAY AT ITS SIGNED BAND (SIGNED_CONSTANTS: 2–5 per drawn quay). The COUNT is the
      //   band's floor plus the quay's own size, never a roll — a dress opens no stream.
      // ⛔ `V_QUAY_BAND` IS A TUPLE `[2, 5]`, NOT `{min, max}` — the first spelling read
      //   `.min`/`.max` as `undefined`, `Math.max(undefined, …)` returned `NaN`, the loop never
      //   ran, and the census printed **`vquay: 0` on a leaf with a drawn quay**. The zero was the
      //   tell; without the census row it would have shipped as "this leaf has no furniture".
      const [vqLo, vqHi] = V_QUAY_BAND;
      const n = Math.max(vqLo, Math.min(vqHi, vqLo + Math.floor(absArea(ring) / (rw * rw * 4))));
      const c0 = centroid(ring);
      for (let i = 0; i < n; i++) {
        const t = (i + 0.5) / n;
        const p = alongRing(ring, t);
        const s = rw * 0.14;
        vq.push(polyPath([[p[0] - s, p[1] - s], [p[0] + s, p[1] - s],
          [p[0] + s, p[1] + s], [p[0] - s, p[1] + s]]));
        census.vquay++;
      }
      void c0;
    }
    g('dress-quays', quays.length
      ? `<path d="${quays.join('')}" fill="${T.plotGround}" stroke="${T.ink}"`
        + ` stroke-width="${INK.body}"/>` : '');
    g('dress-vquay', vq.length
      ? `<path d="${vq.join('')}" fill="${T.ink}" stroke="none"/>` : '');
    prims.n += quays.length + vq.length;
  }

  const svg = out.join('');
  return Object.freeze({
    artifactKind: 'PARTITION_PAGE_DRESS',
    schemaVersion: DRESS_SCHEMA_VERSION,
    svg,
    frame: F,
    lens: LENS.id,
    tones: Object.freeze(T),
    ink: Object.freeze(INK),
    groups: Object.freeze(out.map((s) => (s.match(/^<g id="([^"]+)"/) || [])[1]).filter(Boolean)),
    elements: out.length,
    primitives: prims.n,
    census: Object.freeze(census),
    reason: `${out.length} group(s), ${prims.n} primitive(s) on the ${LENS.id} lens:`
      + ` ${census.masses} mass(es) drawing ${census.ridges} ridge(s)`
      + ` (${census.ridgeClipped} clipped to their run's own footprint, ${census.ridgeOutside} refused),`
      + ` ${census.planes} roof plane(s), ${census.hips} hip(s), ${census.chimneys} chimney(s);`
      + ` ${census.bandFaces} band fragment(s) with ${census.towers} tower(s),`
      + ` ${census.gatehouses} gate(s), ${census.ditchHachure} ditch hachure(s);`
      + ` ${census.waterFaces} water face(s), ${census.decks} deck(s), ${census.fords} ford(s),`
      + ` ${census.quays} quay(s) carrying ${census.vquay} V-QUAY mark(s);`
      + ` ${census.grainSegments} grain segment(s), ${census.grainOutside} of them outside their face`,
  });
}

/* ══════════════════════════════════════════════════════════════════════════════════════════
 * THE TONE LADDER — I3's value floor and I4's separation, both computable
 * ════════════════════════════════════════════════════════════════════════════════════════ */

/**
 * ⭐⭐⭐ **THE THREE-TONE GROUND, AND WHY IT IS THREE.** Review I4: *"buildings/yards/plots merge
 * into one pale texture; §650 negative-space streets read only in regularized grids."* A negative
 * -space street can only read if the two sides of the gap DIFFER IN VALUE — so the street ground,
 * the plot (toft) ground and the built footprint are three separate tones, and `valueCensus`
 * asserts the separation rather than trusting it.
 *
 * ⭐⭐ **AND EVERY FABRIC TONE CLEARS THE PAPER BY A FULL VALUE STEP (I3).** `stepFrom` walks a
 * tone toward the ink until its WCAG contrast against the paper reaches `VALUE_STEP`. On a NIGHT
 * lens it walks toward the lens's own pale role instead, because "away from the paper" is a
 * direction, not a sign.
 */
export function tones(LENS, opts = {}) {
  const R = LENS.roles;
  const paper = R.paper;
  const away = LENS.night ? R.roads : R.ink;
  const t = (hex, k, rungs) => atLeast(paper, mix(hex, away, k), VALUE_STEP ** rungs, away);
  // ⛔⛔ **THE FIRST SPELLING OF THIS LADDER SHIPPED I4's OWN DEFECT AND MEASUREMENT CAUGHT IT.**
  // A single floor (*"walk until contrast ≥ VALUE_STEP"*) is a CEILING in disguise: every tone
  // paler than the floor lands EXACTLY on it. The town's first render read
  // `street #c6beac` against `plotGround #c7bfac` — a contrast ratio of **1.00**, which is review
  // I4 (*"buildings/yards/plots merge into one pale texture"*) re-created inside the cure for it.
  // ⭐ THE CURE IS A LADDER, NOT A FLOOR: each ground role is floored at its OWN RUNG of the value
  // step, so the roles are spaced BY CONSTRUCTION and `valueCensus` verifies the spacing it was
  // built with rather than hoping for it.
  // ⛔⛔ **AND THE SECOND SPELLING FAILED TOO, BY 0.06, FOR A REASON WORTH RECORDING.** Rungs
  // measured from the PAPER do not guarantee spacing between the RUNGS: the street landed at
  // 1.367 against its 1.280 rung and ate the gap, so `plot:street` read **1.220 against 1.280**.
  // ⭐ THE LADDER IS THEREFORE SEQUENTIAL — each rung is floored against the tone ABOVE IT, not
  // against the paper — which is the only spelling where "a full step apart" is what the number
  // means. Both failures are left in the record because the second is the interesting one.
  // ⛔⛔ **AND A THIRD FAILURE, ON THE NIGHT LENS, FOR A THIRD REASON — recorded because it is the
  // one that generalises.** "Away from the paper" is a DIRECTION, and on `darkFantasy` the paper
  // is a deep blue-grey ground: walking a ground role toward the INK moves it TOWARD the paper,
  // not away. Measured: `plot:street 1.000` and `built:paper 1.107`. So the walk picks its pole
  // from the tone's own side of the paper, and the poles are read off the LENS'S OWN ROLE TABLE
  // rather than assumed to be white and black.
  const poles = polesOf(R);
  const from = (hex) => (luminance(hex) >= luminance(paper) ? poles.light : poles.dark);
  const street = atLeast(paper, R.roads, VALUE_STEP, from(R.roads));
  // ⭐ THE GROUND LADDER DESCENDS TOWARD THE DARK POLE ON EVERY LENS — that is what makes a mass
  //   stand ON its yard and a yard stand IN its street, night palette included.
  const plotGround = atLeast(street, mix(R.roads, poles.dark, 0.22), VALUE_STEP, poles.dark);
  const built = atLeast(plotGround, R.roofs, VALUE_STEP, poles.dark);
  const field = atLeast(paper, mix(R.greens, from(R.greens), 0.06), VALUE_STEP, from(R.greens));
  return {
    paper,
    ink: R.ink,
    wall: R.walls,
    water: atLeast(paper, R.water, VALUE_STEP, from(R.water)),
    waterInk: mix(R.water, poles.dark, 0.45),
    field,
    /** RUNG 1 · the palest ground role — §9.7's own law, and the street IS the gap */
    street,
    /** ⭐ RUNG 2 · THE TOFT. A full step off the STREET, or the negative space stops reading. */
    plotGround,
    voidGround: atLeast(street, mix(R.roads, poles.dark, 0.10), VALUE_STEP ** 0.5, poles.dark),
    /** the furrow's own tone: the field, further down — a texture, never map ink */
    grain: mix(field, poles.dark, 0.34),
    /** ⭐ RUNG 3 · the built footprint, a full step under the toft it stands in */
    built,
    roofNW: built,
    roofSE: mix(built, poles.dark, 0.26),
    eaves: mix(R.roofs, poles.dark, 0.55),
    bandGround: mix(R.walls, R.paper, 0.42),
    deck: mix(built, poles.dark, 0.18),
    accessible: !!opts.accessible || LENS.pattern,
  };
}

/** Walk `hex` away from `paper` until its contrast against the paper reaches `want`. */
export function atLeast(paper, hex, want, away) {
  let cur = hex;
  for (let i = 0; i < 48 && contrast(paper, cur) < want; i++) cur = mix(cur, away, 0.06);
  return cur;
}

/** One value step off the paper — the floor I3's cure names. Kept for callers that want it bare. */
export function stepFrom(paper, hex, away) { return atLeast(paper, hex, VALUE_STEP, away); }

/**
 * ⭐⭐ **THE VALUE-HIERARCHY CENSUS (exit 2), COMPUTED FROM THE TONES THEMSELVES.** Two claims,
 * both from the review: I3 — *no fabric at near-paper value* — and I4 — *street ground ≠ plot
 * ground*. Both are properties of the ladder, so both are checkable without a raster.
 */
export function valueCensus(T) {
  const rows = [
    /** ⭐ I4's OWN ROW — the one the first spelling failed at 1.00 and the second at 1.220. */
    ['plot:street', contrast(T.street, T.plotGround), VALUE_STEP],
    /** ⭐ I3's OWN ROW: the mass clears the yard it stands in, and the gap it stands beside */
    ['built:plot', contrast(T.plotGround, T.built), VALUE_STEP],
    ['built:street', contrast(T.street, T.built), VALUE_STEP],
    /** the countryside genuinely lies on bare page, so it genuinely owes the paper a step */
    ['field:paper', contrast(T.paper, T.field), VALUE_STEP],
    ['roofSE:roofNW', contrast(T.roofNW, T.roofSE), 1.10],
  ];
  /**
   * ⚠⚠ **THREE PAIRS ARE REPORTED AND NOT FLOORED, AND EACH REFUSAL IS A RULING WITH A SOURCE —
   * this is the fourth correction this census forced on its own author.**
   *
   * `street:paper` — §9.7's binding sub-law is *"ROADS ARE THE PALEST ROLE ON THE PAGE"*. A street
   *   therefore CANNOT be walked further from the paper; on `accessible` the two are the same
   *   white by design. Flooring it would convict every lens for obeying the law above it. The
   *   street reads because the FABRIC AROUND IT is darker — which is `plot:street`, floored above.
   * `built:paper` — the built fabric never stands on bare page; it stands in its toft inside its
   *   street, and both of those pairs are floored. On a night lens the roofs sit near the ground's
   *   own value BY DESIGN (folioLenses: *"the paper is a deep blue-grey ground"*).
   * `water:paper` — i5's own header rules that **water is read by HUE, not value**, and i1 measures
   *   it on blue-minus-red for exactly that reason. A value floor is the wrong instrument here;
   *   i7's hue band is the water test.
   * All three ride as WATCH FIGURES so a drift is visible in a diff, exactly as i10's s* rides
   * beside the `wall:all` row.
   */
  const watch = [
    ['street:paper', contrast(T.paper, T.street)],
    ['built:paper', contrast(T.paper, T.built)],
    ['water:paper', contrast(T.paper, T.water)],
  ];
  const fails = rows.filter(([, v, f]) => !(v >= f - 1e-9));
  return {
    rows: rows.map(([k, v, f]) => ({ pair: k, ratio: Math.round(v * 1e4) / 1e4, floor: Math.round(f * 1e4) / 1e4, pass: v >= f - 1e-9 })),
    watch: watch.map(([k, v]) => ({ pair: k, ratio: Math.round(v * 1e4) / 1e4 })),
    ok: fails.length === 0,
    nearPaper: rows.filter(([k, v]) => k.endsWith(':paper') && v < VALUE_STEP).map(([k]) => k),
    reason: `${rows.length - fails.length}/${rows.length} value pair(s) clear their rung`
      + `${fails.length ? `; FAILING: ${fails.map(([k, v, f]) => `${k} ${v.toFixed(3)}<${f.toFixed(3)}`).join(', ')}` : ''}`
      + `; WATCH ${watch.map(([k, v]) => `${k} ${v.toFixed(3)}`).join(' · ')}`,
  };
}

/**
 * ⭐ THE LENS'S OWN TWO POLES, read off its role table rather than assumed. A night lens's dark
 * pole is its ink (`#05070B`) and its light pole its roads (`#6E7486`) — neither is white or
 * black, and hard-coding either is how a value ladder inverts on a palette it was not written for.
 */
export function polesOf(roles) {
  let light = null; let dark = null; let lo = Infinity; let hi = -Infinity;
  for (const hex of Object.values(roles)) {
    const l = luminance(hex);
    if (l > hi) { hi = l; light = hex; }
    if (l < lo) { lo = l; dark = hex; }
  }
  return { light, dark };
}

/** WCAG contrast ratio between two hexes, on `folioLenses.luminance`'s own formula. */
export function contrast(a, b) {
  const la = luminance(a); const lb = luminance(b);
  return la > lb ? (la + 0.05) / (lb + 0.05) : (lb + 0.05) / (la + 0.05);
}

/** Linear blend in sRGB space. Enough for a value ladder; no colour library is pulled in. */
export function mix(a, b, k) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * k));
  return `#${c.map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('')}`;
}

/**
 * ⭐ INK IN PLOT FRONTAGES, NEVER IN VIEW UNITS. renderFolio's §179 lesson, verbatim in effect:
 * *"the module the town was laid out in is the module its ink is drawn in, so the hierarchy
 * survives every tier automatically instead of being right at one and wrong at the rest."*
 */
export function inkScale(rw, mult = 1) {
  const s = (k, lo, hi) => Math.max(lo, Math.min(hi, rw * k)) * mult;
  return {
    hair: r2(s(0.030, 0.16, 0.55)),
    detail: r2(s(0.055, 0.26, 0.95)),
    body: r2(s(0.085, 0.40, 1.45)),
    strong: r2(s(0.130, 0.60, 2.20)),
    wall: r2(s(0.300, 1.80, 4.60)),
  };
}

/* ══════════════════════════════════════════════════════════════════════════════════════════
 * THE CLIP — one exact primitive, and every texture in this file goes through it
 * ════════════════════════════════════════════════════════════════════════════════════════ */

/**
 * ⭐⭐⭐ **SCANLINE HATCH, EXACTLY CLIPPED TO AN ARBITRARY (possibly non-convex) RING.** This is
 * I7's cure and the §650.2 clip census's own guarantee: a texture generated this way CANNOT leave
 * its face, because the spans are the ring's own interior intervals along each rule. No tolerance,
 * no snapping, and no `clipPath` element (which would cost an op per family and still not be
 * checkable by a census reading the path data).
 *
 * @param {Array<[number,number]>} ring
 * @param {number} angDeg rule direction in degrees
 * @param {number} pitch spacing between rules, in world units
 */
export function hatchPolygon(ring, angDeg, pitch) {
  if (!ring || ring.length < 3 || !(pitch > 0)) return [];
  const ca = Math.cos(angDeg * DEG); const sa = Math.sin(angDeg * DEG);
  // rotate into rule-space, band by the perpendicular coordinate
  const proj = ring.map(([x, y]) => [x * ca + y * sa, -x * sa + y * ca]);
  let lo = Infinity; let hi = -Infinity;
  for (const p of proj) { if (p[1] < lo) lo = p[1]; if (p[1] > hi) hi = p[1]; }
  const out = [];
  const n = proj.length;
  for (let v = Math.ceil(lo / pitch) * pitch; v <= hi; v += pitch) {
    const xs = [];
    for (let i = 0; i < n; i++) {
      const a = proj[i]; const b = proj[(i + 1) % n];
      if ((a[1] > v) === (b[1] > v)) continue;
      const t = (v - a[1]) / (b[1] - a[1]);
      xs.push(a[0] + (b[0] - a[0]) * t);
    }
    if (xs.length < 2) continue;
    xs.sort((p, q) => p - q);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      if (xs[k + 1] - xs[k] < 1e-6) continue;
      out.push([
        [xs[k] * ca - v * sa, xs[k] * sa + v * ca],
        [xs[k + 1] * ca - v * sa, xs[k + 1] * sa + v * ca],
      ]);
    }
  }
  return out;
}

/**
 * ⭐⭐ **CLIP A SEGMENT TO A RING — PA.6's ridge clip, and B7's overshoot class dies here.** The
 * returned segment is the LONGEST interior span of the infinite line through `a`,`b` that also
 * lies within the original segment. `null` when the ridge lies wholly outside its own footprint,
 * which the census counts rather than silently drawing.
 */
export function clipSegment(ring, a, b) {
  const dx = b[0] - a[0]; const dy = b[1] - a[1];
  const L2 = dx * dx + dy * dy;
  if (L2 < 1e-12) return null;
  const ts = [0, 1];
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i]; const q = ring[(i + 1) % ring.length];
    const ex = q[0] - p[0]; const ey = q[1] - p[1];
    const den = dx * ey - dy * ex;
    if (Math.abs(den) < 1e-12) continue;
    const t = ((p[0] - a[0]) * ey - (p[1] - a[1]) * ex) / den;
    const u = ((p[0] - a[0]) * dy - (p[1] - a[1]) * dx) / den;
    if (u >= 0 && u <= 1 && t > 0 && t < 1) ts.push(t);
  }
  ts.sort((x, y) => x - y);
  let best = null; let bestLen = 0;
  for (let i = 0; i + 1 < ts.length; i++) {
    const m = (ts[i] + ts[i + 1]) / 2;
    const px = a[0] + dx * m; const py = a[1] + dy * m;
    if (!inRing(ring, px, py)) continue;
    const len = ts[i + 1] - ts[i];
    if (len > bestLen) { bestLen = len; best = [ts[i], ts[i + 1]]; }
  }
  if (!best || bestLen < 1e-9) return null;
  return [[a[0] + dx * best[0], a[1] + dy * best[0]], [a[0] + dx * best[1], a[1] + dy * best[1]]];
}

export function inRing(ring, px, py) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0]; const yi = ring[i][1];
    const xj = ring[j][0]; const yj = ring[j][1];
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/* ══════════════════════════════════════════════════════════════════════════════════════════
 * small ring arithmetic
 * ════════════════════════════════════════════════════════════════════════════════════════ */

function insetRing(ring, d) {
  if (!ring || ring.length < 3 || !(d > 0)) return ring;
  const c = centroid(ring);
  const out = ring.map(([x, y]) => {
    const dx = x - c[0]; const dy = y - c[1];
    const L = Math.hypot(dx, dy);
    if (L <= d * 1.05) return [x, y];
    return [x - (dx / L) * d, y - (dy / L) * d];
  });
  return out;
}

function grainAngle(ring) {
  // the furlong's strips run with the face's own long axis — never a global direction, which
  // is what makes hf140's "varying orientations" true rather than decorative.
  let bi = 0; let bj = 1; let bd = -1;
  for (let i = 0; i < ring.length; i++) {
    for (let j = i + 1; j < ring.length; j++) {
      const d = (ring[i][0] - ring[j][0]) ** 2 + (ring[i][1] - ring[j][1]) ** 2;
      if (d > bd) { bd = d; bi = i; bj = j; }
    }
  }
  return (Math.atan2(ring[bj][1] - ring[bi][1], ring[bj][0] - ring[bi][0]) / DEG) + 90;
}

function seFacingEdges(ring) {
  const out = [];
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i]; const b = ring[(i + 1) % ring.length];
    const nx = b[1] - a[1]; const ny = -(b[0] - a[0]);
    // SE is +x,+y on the page; an edge whose outward normal points that way catches the shadow
    if (nx + ny > 0) out.push([a, b]);
  }
  return out;
}

function twoNearest(ring, p) {
  const d = ring.map((q, i) => [i, (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2]);
  d.sort((a, b) => a[1] - b[1]);
  return d.slice(0, 2).map(([i]) => ring[i]);
}

function lerp(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }

function sameSeg(a, b) {
  return Math.abs(a[0][0] - b[0][0]) < 1e-9 && Math.abs(a[0][1] - b[0][1]) < 1e-9
    && Math.abs(a[1][0] - b[1][0]) < 1e-9 && Math.abs(a[1][1] - b[1][1]) < 1e-9;
}

function alongRing(ring, t) {
  let total = 0;
  const seg = [];
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i]; const b = ring[(i + 1) % ring.length];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    seg.push([a, b, L]); total += L;
  }
  let want = total * t;
  for (const [a, b, L] of seg) {
    if (want <= L) return lerp(a, b, L > 0 ? want / L : 0);
    want -= L;
  }
  return ring[0];
}

function outwardNormal(ring, i, closed) {
  const n = ring.length;
  const a = ring[(i - 1 + n) % n]; const b = ring[(i + 1) % n];
  const dx = b[0] - a[0]; const dy = b[1] - a[1];
  const L = Math.hypot(dx, dy) || 1;
  let nx = dy / L; let ny = -dx / L;
  if (closed) {
    const c = centroid(ring);
    if ((ring[i][0] - c[0]) * nx + (ring[i][1] - c[1]) * ny < 0) { nx = -nx; ny = -ny; }
  }
  return [nx, ny];
}

/** The band FACE as a polygon: the ring offset both ways by half the stone. */
function bandOf(ring, band, closed) {
  if (!ring || ring.length < 3) return null;
  const h = band.stone / 2;
  const outer = [];
  const inner = [];
  for (let i = 0; i < ring.length; i++) {
    const n = outwardNormal(ring, i, closed);
    outer.push([ring[i][0] + n[0] * h, ring[i][1] + n[1] * h]);
    inner.push([ring[i][0] - n[0] * h, ring[i][1] - n[1] * h]);
  }
  return outer.concat(inner.reverse());
}

function combTicks(ring, band, pitch, closed) {
  const out = [];
  const h = band.stone / 2;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i]; const b = ring[(i + 1) % ring.length];
    if (!closed && i === ring.length - 1) break;
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const k = Math.max(1, Math.floor(L / pitch));
    const n = outwardNormal(ring, i, closed);
    for (let j = 0; j < k; j++) {
      const p = lerp(a, b, (j + 0.5) / k);
      out.push([[p[0] + n[0] * h, p[1] + n[1] * h],
        [p[0] + n[0] * (h + pitch * 0.45), p[1] + n[1] * (h + pitch * 0.45)]]);
    }
  }
  return out;
}

/** hf315's ten tower plans, reduced to the five kinds `TOWER_TYPES` actually mints. */
function towerPlan(t, kind, stone, rung) {
  const [x, y] = t;
  const r = stone * ((rung && rung.towerScale) || 1);
  if (kind === 'drum') {
    return `M${q(x - r)} ${q(y)}a${q(r)} ${q(r)} 0 1 0 ${q(r * 2)} 0`
      + `a${q(r)} ${q(r)} 0 1 0 ${q(-r * 2)} 0Z`;
  }
  if (kind === 'beaked') {
    return polyPath([[x - r, y - r], [x + r * 0.2, y - r], [x + r * 1.5, y],
      [x + r * 0.2, y + r], [x - r, y + r]]);
  }
  if (kind === 'open-backed-D') {
    return `M${q(x)} ${q(y - r)}a${q(r)} ${q(r)} 0 0 1 0 ${q(r * 2)}`;
  }
  if (kind === 'angle') {
    return polyPath([[x - r, y - r * 0.8], [x + r, y - r * 0.8], [x + r * 0.8, y + r],
      [x - r * 0.8, y + r]]);
  }
  return polyPath([[x - r, y - r], [x + r, y - r], [x + r, y + r], [x - r, y + r]]);
}

/**
 * ⭐ hf313's PLAN VIGNETTES, seated **IN** the band. The passage is a rectangle cut through the
 * band along the gate's own normal; the anatomy from the rung decides what flanks it.
 */
function gatePlan(g, band, rung, rw) {
  const half = band.stone * (rung && rung.gate === 'twin-drum' ? 1.9 : rung && rung.gate === 'block' ? 1.5 : 1.1);
  const depth = band.stone / 2 + band.outer * 0.35;
  const dx = g.dx || 1; const dy = g.dy || 0;
  const L = Math.hypot(dx, dy) || 1;
  const nx = dx / L; const ny = dy / L;
  const tx = -ny; const ty = nx;
  const p = [g.x, g.y];
  const quad = [
    [p[0] + tx * half - nx * depth, p[1] + ty * half - ny * depth],
    [p[0] + tx * half + nx * depth, p[1] + ty * half + ny * depth],
    [p[0] - tx * half + nx * depth, p[1] - ty * half + ny * depth],
    [p[0] - tx * half - nx * depth, p[1] - ty * half - ny * depth],
  ];
  let d = polyPath(quad);
  if (rung && rung.gate === 'twin-drum' && !g.water) {
    // hf313's twin drums, one at each end of the passage
    const r = band.stone * 0.9;
    for (const s of [1, -1]) {
      const cx = p[0] + tx * half * s; const cy = p[1] + ty * half * s;
      d += `M${q(cx - r)} ${q(cy)}a${q(r)} ${q(r)} 0 1 0 ${q(r * 2)} 0a${q(r)} ${q(r)} 0 1 0 ${q(-r * 2)} 0Z`;
    }
  }
  if (g.water) {
    // ⭐ hf313's WATER GATE: a NARROWER work with NO flanking drums, and the chain boom drawn
    //   link by link across the passage. The narrowing is the plate's own anatomy.
    const b0 = [p[0] + tx * half * 0.7, p[1] + ty * half * 0.7];
    const b1 = [p[0] - tx * half * 0.7, p[1] - ty * half * 0.7];
    const links = 5;
    for (let i = 0; i < links; i++) {
      // ⚠ NAMED `link`, NOT `q` — the module's page-quantum function is `q`, and a local of that
      //   name SHADOWS it: `q(q[0] - r)` would call an array. The same shadowing class
      //   `rampartWorks.js:415` records (*"the loop counter was `a` and it shadowed the argument
      //   object"*), caught here by a test rather than by a census that failed to move.
      const link = lerp(b0, b1, (i + 0.5) / links);
      const r = rw * 0.10;
      d += `M${q(link[0] - r)} ${q(link[1])}a${q(r)} ${q(r)} 0 1 0 ${q(r * 2)} 0a${q(r)} ${q(r)} 0 1 0 ${q(-r * 2)} 0Z`;
    }
  }
  return d;
}

function deckQuad(c, w, rw) {
  if (!c.at) return null;
  const [x, y] = c.at;
  const half = Math.max(w, rw) * 0.62;
  const d = rw * 0.55;
  return [[x - half, y - d], [x + half, y - d], [x + half, y + d], [x - half, y + d]];
}

/**
 * ⭐⭐⭐ **PA.3's FORD, DRAWN FROM hf264.** STIPPLE SHALLOWS across the widened reach: short
 * broken-water ticks laid in staggered rows over the crossing's own span. The stipple is what a
 * shallow reads as from above; a ring or a dot-chain is the glyph the §646 sweep struck.
 */
function fordStipple(c, w, rw) {
  const out = [];
  if (!c.at) return out;
  const [x, y] = c.at;
  const half = Math.max(w, rw) * 0.9;
  const rows = 4;
  const cols = 7;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const ox = (j % 2) * (half / cols);
      const px = x - half + ox + (i * 2 * half) / cols;
      const py = y - rw * 0.7 + (j * rw * 1.4) / rows;
      out.push(linePath([[px, py], [px + rw * 0.22, py]]));
    }
  }
  return out;
}

/** ⭐ SPLAYED FUNNEL APPROACH CHEVRONS on BOTH banks (PA.3 / hf264) — the road opening out. */
function fordChevrons(c, w, rw) {
  const out = [];
  if (!c.at) return out;
  const [x, y] = c.at;
  const half = Math.max(w, rw) * 0.9;
  for (const s of [-1, 1]) {
    for (let k = 1; k <= 3; k++) {
      const spread = rw * 0.55 * k;
      const ay = y + s * (rw * 0.9 + k * rw * 0.42);
      out.push(linePath([[x - spread, ay], [x, y + s * rw * 0.75], [x + spread, ay]]));
      void half;
    }
  }
  return out;
}

function steppingStones(c, w, rw) {
  const out = [];
  if (!c.at) return out;
  const [x, y] = c.at;
  const span = Math.max(w, rw) * 1.1;
  const n = Math.max(3, Math.round(span / (rw * 0.55)));
  for (let i = 0; i < n; i++) {
    const px = x - span + (i * 2 * span) / (n - 1);
    const s = rw * 0.16;
    out.push(polyPath([[px - s, y - s * 0.7], [px + s, y - s * 0.7],
      [px + s, y + s * 0.7], [px - s, y + s * 0.7]]));
  }
  return out;
}

/**
 * ⭐⭐⭐ **L-REG-34 · THE LEGEND, AND IT IS A ROSTER RATHER THAN A PICTURE.** The exit is
 * *"every legend row locatable, every glyph taught"* — a two-directional census, so the legend
 * has to be a DATA object the census can walk, not a block of SVG a reader has to squint at.
 * Each row names the group it teaches, the mark, and the PLATE it is drawn from, so a row that
 * teaches nothing and a group that is taught nowhere are both findable by machine.
 *
 * ⛔ THE `plate` COLUMN IS NOT DECORATION. The detail register binds per class, and a row with no
 * plate is a mark this estate invented — which is the exact failure `hf61-chrome-plate` is the
 * hard anti-exemplar for (*"ornament simulated without meaning"*).
 */
export const DRESS_LEGEND = Object.freeze([
  { group: 'dress-paper', mark: 'the sheet', teaches: 'the page ground', plate: 'hf303 master key' },
  { group: 'dress-fields', mark: 'open tone', teaches: 'field ground outside the settled pieces', plate: 'hf140 plains open-field' },
  { group: 'dress-grain', mark: 'parallel strip lines', teaches: 'the furlong\'s selion strips', plate: 'hf140' },
  { group: 'dress-water', mark: 'flat wash inside its banks', teaches: 'water body, bank-bounded', plate: 'hf377 water textures' },
  { group: 'dress-shore', mark: 'shore-parallel recession lines', teaches: 'the water\'s edge and its calm', plate: 'hf322 waterfront edge' },
  { group: 'dress-street', mark: 'the palest ground', teaches: 'the way as a GAP — there is no street object', plate: 'hf320 street hierarchy' },
  { group: 'dress-voids', mark: 'an outlined open ground', teaches: 'square / market / green', plate: 'hf259 market voids' },
  { group: 'dress-yards', mark: 'the toft tone', teaches: 'the plot\'s own ground behind the building', plate: 'hf120 burgage frontage' },
  { group: 'dress-masses', mark: 'the built footprint', teaches: 'the eaves line of a party run', plate: 'hf208 roof ticks' },
  { group: 'dress-planes', mark: 'two tints per roof', teaches: 'NW light, SE shadow — one value step', plate: 'hf208' },
  { group: 'dress-eaves', mark: 'a tick along the SE edge', teaches: 'the cast shadow at the eaves', plate: 'hf208' },
  { group: 'dress-ridges', mark: 'one line down the long axis', teaches: 'ONE ridge per party run', plate: 'hf208 / hf378' },
  { group: 'dress-hips', mark: 'angled lines to the corners', teaches: 'a hipped end', plate: 'hf208' },
  { group: 'dress-chimneys', mark: 'a small square astride the ridge', teaches: 'a lived-in house', plate: 'hf208 / hf90' },
  { group: 'dress-unitlines', mark: 'interior party lines', teaches: 'the members inside an aggregated mass', plate: 'hf378 density ladder' },
  { group: 'dress-band', mark: 'a double-edged band', teaches: 'the wall as thin FACE, not a stroke', plate: 'hf261 wall ladder' },
  { group: 'dress-coursing', mark: 'ticks across the band, in patches', teaches: 'coursed masonry', plate: 'hf261 rung 4' },
  { group: 'dress-comb', mark: 'a comb on the OUTER edge', teaches: 'merlons — and a one-sided comb is not a railway', plate: 'hf103 / hf314' },
  { group: 'dress-towers', mark: 'plan shapes straddling the band', teaches: 'a tower is a TYPE, not a repeat', plate: 'hf315 tower variety' },
  { group: 'dress-ditch', mark: 'strokes radiating outward', teaches: 'the ditch — hachure, never dashes', plate: 'hf314 wall head' },
  { group: 'dress-stairs', mark: 'short rungs on the inner face', teaches: 'wall-stair flights, and they are rare', plate: 'hf314' },
  { group: 'dress-gates', mark: 'a passage cut through the band', teaches: 'a gate is SEATED IN the wall', plate: 'hf313 gate anatomy' },
  { group: 'dress-relict', mark: 'a dashed line where a wall stood', teaches: 'a robbed circuit surviving as a boundary', plate: 'hf123 wall seam' },
  { group: 'dress-decks', mark: 'a deck with a shadow line', teaches: 'the bridge passes OVER the water', plate: 'hf263 bridge types' },
  { group: 'dress-ford', mark: 'stipple with splayed chevrons', teaches: 'a ford — shallow because it is wide', plate: 'hf264 river works' },
  { group: 'dress-stepping', mark: 'a line of small slabs', teaches: 'stepping stones — a DISTINCT crossing', plate: 'hf264' },
  { group: 'dress-quays', mark: 'a worked edge on the water', teaches: 'a quay face', plate: 'hf122 quay basin' },
  { group: 'dress-vquay', mark: 'bollards on the quay', teaches: 'the V-QUAY furniture band', plate: 'hf122 / hf133' },
  { group: 'dress-accessible', mark: 'ruled hatch by direction and pitch', teaches: 'category carried by PATTERN, not hue', plate: '§9.7 accessible' },
]);

/**
 * ⭐⭐ **L-REG-34's CENSUS, BOTH DIRECTIONS.** *Every legend row locatable* (the group it teaches
 * is actually drawn) and *every glyph taught* (every drawn group has a row). A one-directional
 * spelling passes a legend that teaches marks the page does not carry — which is `hf61`'s failure
 * exactly, and the reason the census is written as a bijection rather than as a lookup.
 */
export function legendCensus(dress) {
  const drawn = new Set(dress.groups);
  const taught = new Set(DRESS_LEGEND.map((r) => r.group));
  const untaught = [...drawn].filter((gp) => !taught.has(gp));
  // a legend row for a group this LEAF does not draw is lawful (an unwalled leaf has no band);
  // a row for a group the DRESS CANNOT EVER draw is not.
  const unlocatable = [...taught].filter((gp) => !DRESS_GROUPS.includes(gp));
  const plateless = DRESS_LEGEND.filter((r) => !r.plate || r.plate.length < 4).map((r) => r.group);
  return {
    drawn: drawn.size,
    taught: taught.size,
    untaught,
    unlocatable,
    plateless,
    ok: untaught.length === 0 && unlocatable.length === 0 && plateless.length === 0,
    reason: `${drawn.size} group(s) drawn, ${taught.size} taught;`
      + ` ${untaught.length} drawn-but-untaught, ${unlocatable.length} taught-but-undrawable,`
      + ` ${plateless.length} row(s) with no corpus plate`,
  };
}

/**
 * ⭐⭐ **E11 · THE ACCESSIBLE-LENS ARM — structurally homeless until ink existed, and this is the
 * ink.** §9.7: *"patterns replace hue"* means REAL HATCH GEOMETRY, and `folioLenses.HATCH` already
 * holds the closed table (angle index into the 64-step trig table, pitch in frontages). This
 * function is the consumer that table never had: given a page and a character per mass, it emits
 * the category hatch, clipped by the same exact primitive everything else in this file uses — so
 * the accessible lens cannot leak a pattern outside the face that owns it either.
 */
export function accessibleHatch(page, opts = {}) {
  const rw = opts.roadWidth || 5;
  const charOf = opts.characterOf || (() => 'residential');
  const out = [];
  let segs = 0;
  const byClass = {};
  for (const m of page.masses) {
    const ch = charOf(m) || 'other';
    const row = HATCH[ch] || HATCH.other;
    if (!row.pitch) { byClass[ch] = byClass[ch] || 0; continue; }
    const ang = (row.ang / 64) * 360;
    for (const rr of (m.runRings || [])) {
      if (!rr || rr.length < 3) continue;
      for (const seg of hatchPolygon(rr, ang, rw * row.pitch)) { out.push(linePath(seg)); segs++; }
    }
    byClass[ch] = (byClass[ch] || 0) + 1;
  }
  return Object.freeze({
    svg: out.length ? `<g id="dress-accessible"><path d="${out.join('')}" fill="none"`
      + ` stroke="#000000" stroke-width="0.4"/></g>` : '',
    segments: segs,
    byClass: Object.freeze(byClass),
    vocabulary: Object.freeze(Object.keys(HATCH)),
    reason: `${segs} hatch segment(s) over ${page.masses.length} mass(es);`
      + ` ${Object.keys(byClass).length} character class(es) drawn of ${Object.keys(HATCH).length}`
      + ` in the closed vocabulary — an unhatched class (pitch 0) is the MATRIX, not an omission`,
  });
}
