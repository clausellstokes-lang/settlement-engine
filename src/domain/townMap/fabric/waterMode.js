/**
 * domain/townMap/fabric/waterMode.js — THE WATER-RELATIONSHIP LAW (§5.0b).
 *
 * ⭐ "HAS A RIVER" NEVER DEFAULTS TO "THE RIVER BISECTS THE TOWN."
 *
 * The reference generators' model-prior is default-bisection, and the chair recorded it
 * as a DEFECT TO OVERRIDE — it is on the standing critique list beside concentric drift
 * and sunburst fields. Historically, bridging or fording a river was among the most
 * expensive things a settlement could do, so a town that straddles its water EARNED
 * that, and the fabric must make it earn it here too.
 *
 * FOUR MODES, each with real fabric consequences:
 *   THROUGH   the river crosses the fabric; bridges become street continuations; wards
 *             split by bank. THE RAREST MODE, and it must be paid for.
 *   BANKSIDE  the town sits ON one bank; the waterfront is an EDGE (quays, mills, a
 *             water gate); the far bank stays countryside or holds a small bridgehead.
 *   NEAR      the river is a WALK away: the town sits on the rise or the road and is
 *             connected to its landing, mill or washing place by a lane. The water
 *             crosses the frame's COUNTRYSIDE, not the town.
 *   DRY       no watercourse: wells and cisterns gain prominence instead, and the well
 *             head becomes the thing the square is built around.
 *
 * WHAT PAYS FOR "THROUGH" — three things at once, because all three were needed in
 * reality: the traffic to justify a crossing (trade access), the population to build and
 * maintain one, and a river small enough at this point to bridge (the substrate's own
 * flow at the crossing). A metropolis on a major route straddles its river; a village on
 * the same river has a ford and sits on one side of it.
 *
 * ⭐ THE ONE-DECIDER RULE HOLDS: this module never decides WHETHER water exists. That is
 * siteGenesis's, through the landed model's `frame.water`. This decides only the
 * RELATIONSHIP, given that the water is there.
 *
 * DETERMINISM: pure; one bounded seeded roll on the near/bankside margin, from an
 * entity-keyed fork.
 */

import { fabricRng, keyedRandom } from './fabricRng.js';
import { chaikin, distToPolyline, ringIndex } from './fabricGeometry.js';
import { VIEW, sampleAt, drainageTrace, meanderChannel } from './substrate.js';
// ⚠ THE SHORE COMES FROM `relief.js` AND THE EDGE IS NEW — waterMode → relief → {substrate,
// umbrella, fabricGeometry, fabricRng}, all of which are upstream of waterMode already, so the
// fabric's module graph stays acyclic (pinned by derivationGraph.walker.test.js).
import { shoreContour } from './relief.js';

/**
 * ⭐⭐⭐ MF-PERF1 · WHERE THE WATER ACTUALLY RUNS — the DRAWN watercourse, lifted out of the
 * assembly and seated beside the relationship it is the input to.
 *
 * ⚠ IT IS A MOVE, NOT A CHANGE. Every line below stood in `buildFabric.js` stage 0 and is
 * carried across verbatim; the whole corpus is byte-identical across the move. It is here
 * because `buildFabric.js` stood at 791 effective lines against the 800 domain ceiling with
 * MF-W0's hazard note reading *"the next member added to the assembly breaks the ratchet"* —
 * and because this module is already the one home for what the water IS to this settlement.
 *
 * THE ONE-DECIDER RULE IS UNTOUCHED: `siteGenesis`, through the landed model's `frame.water`,
 * decides WHETHER there is water. The substrate decides WHERE. This composes the two.
 *
 * @param {Object} a
 * @param {any} a.modelWater  the LANDED model's `frame.water` — the only thing that says whether
 * @param {any} a.sub         the substrate (the heightfield the drainage and the shore come from)
 * @param {{seed:any, variant:number}} a.seeding
 * @param {number} a.builtRadius
 * @param {string} a.meanderKey  `fork('meander')` — composed by the assembly's ONE fork home
 * @returns {{kind:string, line:Array<[number,number]>, width:number, body?:any, seaShare?:number}|null}
 */
export function deriveWatercourse(a) {
  const { modelWater, sub, seeding, builtRadius, meanderKey } = a;
  const withProfile = a.withProfile === true;
  const seed = seeding.seed, variant = seeding.variant;
  // ⭐ §5 W1 EXIT 6 · THE WORKED WATERFRONT. The settlement's own seat and reach, so the
  // detail scale of both the sea and the channel can be damped where the town works them.
  // ⚠ IT IS THE LANDED MODEL'S SKELETON ANCHOR, NOT THE DERIVED NUCLEUS, and the reason is
  // causal rather than convenient: the water is derived at STAGE 0 and the nucleus is found
  // by a suitability field that READS the water, so a damping keyed on the nucleus would be
  // a cycle. The anchor is the settlement's own seat as the landed model states it, which is
  // the best statement of "where the town is" that exists before the town does.
  // ⚠ AN ABSENT ANCHOR DAMPS NOTHING and says so — never a guessed centre (a wrong worked
  // reach would straighten the wrong stretch of shore, which is worse than a wild one).
  const worked = a.worked && Number.isFinite(a.worked.x) && Number.isFinite(a.worked.y)
    ? { x: a.worked.x, y: a.worked.y, r: builtRadius }
    : null;
  if (modelWater && modelWater.kind === 'river') {
    const trace = drainageTrace(sub);
    // ⭐⭐⭐ THE MEANDER LAW (chair directive §193.3). The trace is a D8 lattice walk, so its
    // bearings are eight compass directions and its turns are multiples of 45° — MEASURED,
    // 81% of this town's river lay within 4° of an axis, in one 692-unit ruled line. Chaikin
    // cannot cure that (smoothing a straight line returns a straight line); the channel has
    // to be given the meander its valley permits. See substrate.meanderChannel — and note it
    // SMOOTHS ONCE ITSELF, which is why there is no chaikin call left on this path.
    const width = 7 + builtRadius * 0.030;
    const line = trace.length >= 4
      ? meanderChannel(sub, trace, meanderKey, { width, worked })
      : meanderChannel(sub, (modelWater.path || []).map((p) => [p[0], p[1]]), meanderKey, { width, worked });
    // ⭐⭐⭐ REG-BRIDGE · THE WIDTH PROFILE (ODQ §641.5). See `deriveWidthProfile` for why it is a
    // READING of the ground rather than a minted taper, and why the channel's own GEOMETRY is
    // computed first and never fed the profile: `meanderChannel` takes `width` to set its
    // wavelength and amplitude, so a profile handed to it would move every meander on every
    // river leaf and make the taper unattributable. The line is fixed; the profile dresses it.
    const widthProfile = withProfile ? deriveWidthProfile(sub, line, width) : null;
    return {
      kind: 'river', line, width, worked, workedReach: line.workedReach || null,
      ...(widthProfile ? { widthProfile } : {}),
    };
  }
  if (modelWater && modelWater.kind === 'coast') {
    // ⭐⭐ THE SEA IS A CONTOUR OF THE GROUND, NOT A RULED EDGE (§9.5b, relief.js's header).
    // The landed model's coast is a two-point path; jittering it produces a wobbly ruler
    // and, drawn as a stroke, an ocean that is invisible at a glance — which is precisely
    // what the fjord exemplar exposed. The substrate already knows where the low ground
    // is, so the shore is TRACED from it and the sea is a BODY. The one-decider rule is
    // untouched: the landed model still says WHETHER there is sea; this says only where it
    // reaches, exactly as the river has always done.
    const shore = shoreContour(sub, seeding, worked);
    if (shore) {
      return {
        kind: 'coast', line: shore.line, body: shore.body, width: 10, seaShare: shore.share,
        // §5 W1 exit 6's two scales and the damping measurement, carried out whole.
        coarse: shore.coarse, scales: shore.scales, detail: shore.detail, worked,
      };
    }
    // HONEST FALLBACK: ground with no low contour that reaches the frame has no sea to
    // draw. Recorded rather than invented — a straight ruled edge would be a fabrication.
    const base = (modelWater.path || []).map((p) => [p[0], p[1]]);
    /** @type {Array<[number,number]>} */ const pts = [];
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      // ⚠ THIS IS THE ONE SITE WHERE THE DROPPED SALT WAS **ACTIVE** RATHER THAN LATENT, and
      // MF-ARCH measured why: every other affected mechanic's INPUTS also carry the variant,
      // so its output moved at a reroll anyway. This fallback's input is the LANDED model's
      // two-point coast path, which is variant-invariant — so the jitter was identical at
      // every reroll. ⚠ THE CORPUS DOES NOT EXERCISE IT (every coastal leaf finds a shore
      // contour), so the cure is provable by construction and not by a moved sha.
      const jitter = (keyedRandom(seed, 'coast', 'jitter', i, { variant }) - 0.5) * 52;
      pts.push([
        base[0][0] + (base[1][0] - base[0][0]) * t,
        base[0][1] + (base[1][1] - base[0][1]) * t + jitter,
      ]);
    }
    return { kind: 'coast', line: chaikin(pts, 3, false), body: null, width: 10 };
  }
  return null;
}

/* ═══════════════════════════════════════════════════════════════════════════════════════════
 * ⭐⭐⭐ REG-BRIDGE · THE RIVER WIDTH PROFILE (owner §637 / chair §641.5)
 *
 * ⛔⛔ WHAT THIS EXISTS TO END, MEASURED BY REG-5: **the river had *A* width, not a width
 * profile.** One scalar per leaf (`7 + builtRadius * 0.030`), a constant-width stroke, and
 * therefore `span/narrows = 1.000–1.059 for every bridge in the corpus` — **every point of the
 * channel was a local narrows, so L-REG-32's siting law was not measurable at all.** A
 * constant-width river is also a generator's tell: the reference plates taper, and so does
 * every river that has ever existed.
 *
 * ⭐⭐ IT IS A READING OF THE GROUND, NOT A MINTED TAPER — the same doctrine `waterBearing`
 * states two functions down, and for the same reason. A taper minted from a hash would be a
 * seed-permanent world fact under THE PROMISE; a taper READ from the heightfield the river
 * already drains cannot contradict a later truth, because if the ground changes the reading
 * changes with it. **NOTHING HERE HASHES.** There is no `fabricRng`, no `hashUnit` and no new
 * random namespace — the variation is entirely the valley's own, which is why this derivation
 * owes neither of the two key registries (`stageManifest` S4 namespaces / the walker's
 * hand-minted inventory).
 *
 * THE THREE TERMS, each a named argument rather than a fudge factor:
 *
 *   ACCUMULATION  a river carries more water downstream than up, so it is wider downstream.
 *                 The substrate's own `flow` field IS that discharge. ⚠ THE RAW SAMPLE IS NOT
 *                 MONOTONE — MEASURED, it rises head→mouth on only 56–67 % of sampled steps,
 *                 because the DRAWN channel is the meandered line and wanders off the D8 trunk
 *                 the accumulation was computed on, and because both tails are run out past the
 *                 basin to the frame edge. **Discharge physically never decreases downstream**,
 *                 so the taper reads the RUNNING MAXIMUM head→mouth — the envelope the physics
 *                 guarantees — and not the noisy sample. `drainageTrace` returns headwater →
 *                 mouth in reading order, which is what makes "downstream" a fact here and not
 *                 a convention.
 *   CONFINEMENT   where the ground rises on both banks the valley pinches and the channel is
 *                 narrow; where it opens the river spreads. **This is the term that MAKES the
 *                 narrows a bridge can be sited at**, and it puts them where high ground is —
 *                 which is where a real crossing and a real crossing-town went.
 *   BEND          the outside of a meander is the cut bank; a bend is wider than a straight.
 *                 Read as the turn of the tangent across a ~1.5-width arc window.
 *
 * ⚠⚠ THE MEAN IS PRESERVED, AND THAT IS A DELIBERATE CHOICE. The profile is normalized so its
 * arc-weighted mean equals the nominal width exactly. A profile that also INFLATED the river
 * would move the water claim's area, the ground law's refusals, the field clip and the op/byte
 * spend — and the declared shift would then be "the river got bigger" tangled with "the river
 * got a shape". Preserving the mean makes this mint a REDISTRIBUTION, and every figure that
 * moves, moves because of the shape.
 *
 * ⚠ THE CHANNEL'S GEOMETRY IS COMPUTED FIRST AND IS NEVER FED THE PROFILE. `meanderChannel`
 * takes `width` to set its wavelength and amplitude; handing it a profile would move every
 * meander on every river leaf and make the taper unattributable.
 *
 * PURITY: `+ − × ÷ √` and a numeric sort. No Date, no Math.random, no runtime trig, no hash.
 * ═══════════════════════════════════════════════════════════════════════════════════════════ */

/**
 * ⭐ THE TUNING SURFACE — PROPOSED-WITH-RATIONALE, the chair signs. Every row is dimensionless
 * (a fraction of the nominal width or of a range-normalized signal), so the table does not
 * change meaning between a thorp's brook and a metropolis's trunk river.
 *
 *  taper   the accumulation amplitude, ± about the mean. 0.34 makes the mouth ~2× the head
 *          before the other terms — the visible half of the mint, and the half the reference
 *          grammar (Watabou/FTG) shows most plainly.
 *  pinch   how far a fully confined valley narrows the channel. Bounded well under `taper` so a
 *          narrows is a LOCAL event on a downstream trend, not a competing trend of its own.
 *  bend    the cut-bank widening. Smallest of the three: a bend is a detail, not a régime.
 *  window  the arc window, in nominal widths, over which the tangent, the curvature and the
 *          bank samples are taken. Below ~1 width it reads polyline sampling noise.
 *  smooth  passes of a 1-2-1 kernel along arclength. A width that jitters vertex-to-vertex is
 *          noise wearing a river's clothes.
 *  lo/hi   hard bounds as a fraction of the nominal. `lo` keeps a headwater drawable at page
 *          register; `hi` keeps a mouth from swallowing its own banks.
 * ⚠ UNSOAKED; rides the tuning signature.
 */
export const RIVER_PROFILE = Object.freeze({
  taper: 0.34,
  pinch: 0.22,
  bend: 0.16,
  window: 1.5,
  smooth: 3,
  lo: 0.72,
  hi: 1.55,
});

/** A robust 0..1 normalization: the 5th–95th percentile range, clamped. A single outlier
 *  vertex must not squash a whole leaf's signal into one bucket. */
function rangeNorm(v) {
  const s = v.slice().sort((a, b) => a - b);
  const at = (p) => s[Math.min(s.length - 1, Math.max(0, Math.round(p * (s.length - 1))))];
  const lo = at(0.05), hi = at(0.95);
  const span = hi - lo;
  if (!(span > 1e-12)) return v.map(() => 0.5);      // a dead signal contributes nothing
  return v.map((x) => {
    const t = (x - lo) / span;
    return t < 0 ? 0 : t > 1 ? 1 : t;
  });
}

/**
 * THE PROFILE ITSELF. Returns per-vertex widths aligned to `line`, with the arclength they sit
 * on and the leaf's own min/mean/max — the figures the liveness census reads.
 *
 * @param {import('./substrate.js').Substrate} sub
 * @param {Array<[number,number]>} line   the DRAWN channel, headwater → mouth
 * @param {number} W0                     the nominal width this leaf would have had
 * @returns {{ w:number[], s:number[], min:number, mean:number, max:number, ratio:number,
 *   nominal:number, reason:string } | null}
 */
export function deriveWidthProfile(sub, line, W0) {
  const n = Array.isArray(line) ? line.length : 0;
  if (!sub || n < 8 || !(W0 > 0)) return null;

  // ── arclength, the profile's own parameter (the meander's is the same one).
  const s = [0];
  for (let i = 1; i < n; i++) {
    const dx = line[i][0] - line[i - 1][0], dy = line[i][1] - line[i - 1][1];
    s.push(s[i - 1] + Math.sqrt(dx * dx + dy * dy));
  }
  const total = s[n - 1];
  if (!(total > W0)) return null;

  const win = W0 * RIVER_PROFILE.window;
  const acc = new Array(n), conf = new Array(n), curv = new Array(n);
  for (let i = 0; i < n; i++) {
    // the window's two shoulders, taken on ARCLENGTH so a dense stretch and a sparse one get
    // the same physical window
    let a = i, b = i;
    while (a > 0 && s[i] - s[a] < win) a--;
    while (b < n - 1 && s[b] - s[i] < win) b++;
    const px = line[i][0], py = line[i][1];

    acc[i] = sampleAt(sub, sub.flow, px, py);

    // the window's chord is the local tangent; its perpendicular is the bank direction
    let tx = line[b][0] - line[a][0], ty = line[b][1] - line[a][1];
    const tl = Math.sqrt(tx * tx + ty * ty);
    if (tl > 1e-9) { tx /= tl; ty /= tl; } else { tx = 1; ty = 0; }
    const nx = -ty, ny = tx;
    const h0 = sampleAt(sub, sub.height, px, py);
    const hA = sampleAt(sub, sub.height, px + nx * win, py + ny * win);
    const hB = sampleAt(sub, sub.height, px - nx * win, py - ny * win);
    conf[i] = ((hA - h0) + (hB - h0)) / 2;

    // the turn of the tangent across the window — 0 straight, 2 at a reversal
    let ux = px - line[a][0], uy = py - line[a][1];
    let vx = line[b][0] - px, vy = line[b][1] - py;
    const ul = Math.sqrt(ux * ux + uy * uy) || 1, vl = Math.sqrt(vx * vx + vy * vy) || 1;
    ux /= ul; uy /= ul; vx /= vl; vy /= vl;
    let dot = ux * vx + uy * vy;
    if (dot > 1) dot = 1; else if (dot < -1) dot = -1;
    curv[i] = 1 - dot;
  }

  // ⭐ THE ACCUMULATION ENVELOPE. Discharge never falls downstream; the sample does, because the
  // drawn channel leaves the trunk the flow model was computed on. The running maximum is the
  // physics, and it is what a taper is entitled to read.
  for (let i = 1; i < n; i++) if (acc[i] < acc[i - 1]) acc[i] = acc[i - 1];

  const A = rangeNorm(acc), C = rangeNorm(conf), K = rangeNorm(curv);
  const f = new Array(n);
  for (let i = 0; i < n; i++) {
    f[i] = (1 + RIVER_PROFILE.taper * (A[i] - 0.5) * 2)
      * (1 - RIVER_PROFILE.pinch * C[i])
      * (1 + RIVER_PROFILE.bend * K[i]);
  }

  // ── smooth along arclength: 1-2-1, ends held. A jittering width is noise, not a river.
  for (let p = 0; p < RIVER_PROFILE.smooth; p++) {
    const g = f.slice();
    for (let i = 1; i < n - 1; i++) f[i] = (g[i - 1] + 2 * g[i] + g[i + 1]) / 4;
  }

  // ── arc-weighted mean → 1, then the hard bounds. Two passes, because clamping moves the mean
  //    and a normalization that is not re-checked is a bound nobody enforced.
  const wgt = new Array(n);
  for (let i = 0; i < n; i++) {
    const back = i > 0 ? s[i] - s[i - 1] : 0;
    const fwd = i < n - 1 ? s[i + 1] - s[i] : 0;
    wgt[i] = (back + fwd) / 2;
  }
  const wsum = wgt.reduce((t, x) => t + x, 0) || 1;
  for (let pass = 0; pass < 2; pass++) {
    let m = 0;
    for (let i = 0; i < n; i++) m += f[i] * wgt[i];
    m /= wsum;
    if (!(m > 1e-9)) break;
    for (let i = 0; i < n; i++) {
      let x = f[i] / m;
      if (x < RIVER_PROFILE.lo) x = RIVER_PROFILE.lo;
      else if (x > RIVER_PROFILE.hi) x = RIVER_PROFILE.hi;
      f[i] = x;
    }
  }

  const w = new Array(n);
  let min = Infinity, max = -Infinity, mean = 0;
  for (let i = 0; i < n; i++) {
    w[i] = W0 * f[i];
    if (w[i] < min) min = w[i];
    if (w[i] > max) max = w[i];
    mean += w[i] * wgt[i];
  }
  mean /= wsum;
  return {
    w, s, min, mean, max,
    ratio: max / min,
    nominal: W0,
    reason: `river width profile: ${min.toFixed(2)} … ${max.toFixed(2)} about a nominal ${W0.toFixed(2)}`
      + ` (${(max / min).toFixed(3)}× head-to-mouth spread, arc-mean ${mean.toFixed(2)});`
      + ' READ from the substrate — accumulation envelope, valley confinement, meander bend —'
      + ' and never hashed, so it cannot become a seed-permanent world fact',
  };
}

/**
 * ⭐⭐ THE ONE LOCAL-WIDTH SPELLING. Every consumer that asks a question ABOUT A PLACE on the
 * water — is this point wet, how far does the deck reach, how wide is the claim here — asks it
 * here, and every consumer that asks a LEAF-SCALE question (how far apart may two bridges
 * stand, how big a grid cell) keeps reading `rel.width`, which is unchanged and still nominal.
 *
 * ⛔ THE DISTANCE AND THE WIDTH COME FROM ONE WALK. `isInWater` runs hundreds of thousands of
 * times on a river leaf; asking for the nearest station twice would double the fabric's single
 * hottest predicate.
 *
 * @param {any} rel a water relationship (or a raw watercourse — both carry `line`/`width`)
 * @param {number} x @param {number} y
 * @returns {{ d:number, w:number }} distance to the centreline, and the LOCAL width there
 */
export function stationAt(rel, x, y) {
  const line = rel && rel.line;
  const W0 = (rel && rel.width) || 0;
  if (!line || line.length < 2) return { d: Infinity, w: W0 };
  const prof = rel.widthProfile;
  let best = Infinity, bi = 0, bt = 0;
  for (let i = 0; i + 1 < line.length; i++) {
    const ax = line[i][0], ay = line[i][1];
    const dx = line[i + 1][0] - ax, dy = line[i + 1][1] - ay;
    const L = dx * dx + dy * dy;
    let t = L > 0 ? ((x - ax) * dx + (y - ay) * dy) / L : 0;
    if (t < 0) t = 0; else if (t > 1) t = 1;
    const ex = x - (ax + dx * t), ey = y - (ay + dy * t);
    const d = ex * ex + ey * ey;
    if (d < best) { best = d; bi = i; bt = t; }
  }
  const d = Math.sqrt(best);
  if (!prof || !prof.w || prof.w.length !== line.length) return { d, w: W0 };
  return { d, w: prof.w[bi] + (prof.w[bi + 1] - prof.w[bi]) * bt };
}

/** The river's LOCAL width at (x,y) — the nominal width where no profile has been derived. */
export function widthAt(rel, x, y) {
  if (!rel || !rel.widthProfile) return (rel && rel.width) || 0;
  return stationAt(rel, x, y).w;
}

/** The local width at a VERTEX INDEX of the channel, for consumers walking the line itself. */
export function widthAtIndex(rel, i) {
  const prof = rel && rel.widthProfile;
  if (!prof || !prof.w || i < 0 || i >= prof.w.length) return (rel && rel.width) || 0;
  return prof.w[i];
}

/**
 * ⭐⭐⭐ §5 W1 EXIT 3 · `waterBearing` — THE BEARING THE WATER HOLDS ON THIS LEAF, **DERIVED
 * FROM SUBSTRATE GEOMETRY AND NEVER STORED.**
 *
 * ⛔⛔ WHY "DERIVED" IS THE WHOLE OF THE CRITERION AND NOT A COMPLIANCE DETAIL. A bearing
 * MINTED at generation and persisted would be a **seed-permanent world fact**, and THE
 * PROMISE governs those: a minted bearing is a claim about the world that can never
 * afterwards be wrong, and ODQ §251.5 already refused wind and sun bearings on exactly that
 * ground. `laneMFINT1-receipt.md` §3.2.3 refused the NEIGHBOUR bearing for the same reason —
 * *"a bearing does not exist anywhere in the dossier, and minting one is a seed-permanent
 * world fact under THE PROMISE."* ⭐ **THE WATER'S BEARING IS LAWFUL PRECISELY BECAUSE IT IS
 * NOT MINTED: it is a reading of ground that already exists**, so it cannot contradict a
 * later truth — if the ground changes, the reading changes with it, which is what a
 * derivation IS and what a stored fact can never be.
 *
 * THE TWO KINDS, and each reads the geometry the substrate produced:
 *   RIVER  the chord of the drawn channel, head to mouth. The channel is the drainage
 *          trace of the heightfield (`drainageTrace`), meandered and run out to the frame,
 *          so the bearing is the direction the LAND drains — not a hash and not a choice.
 *   COAST  the bearing from the dry ground's centroid to the sea body's centroid: the
 *          direction the water lies IN. The sea body is the traced level contour of the
 *          same heightfield (`shoreContour`), so this too is the ground speaking.
 *
 * ⚠ THE ANGLE IS COMPUTED WITHOUT RUNTIME TRIGONOMETRY (the purity law). `deg` is derived
 * from the unit vector by a rational octant reduction with a fixed-order polynomial for
 * `atan` on [0,1] — `+ − × ÷` only, cross-machine identical.
 * ⚠ `deg` IS A COMPASS BEARING IN THE VIEW FRAME: 0 = toward the top of the leaf (−y), 90 =
 * toward the right (+x), clockwise. Stated because a y-down frame inverts the intuition.
 *
 * @param {{kind:string, line:Array<[number,number]>, body?:any}|null} water
 * @param {import('./substrate.js').Substrate} sub
 * @returns {{ kind:string, deg:number, dx:number, dy:number, chord:number,
 *   from:[number,number], to:[number,number], source:string, reason:string }|null}
 */
export function waterBearing(water, sub) {
  if (!water) return null;
  /** @type {[number,number]} */ let from;
  /** @type {[number,number]} */ let to;
  let source;
  if (water.kind === 'coast' && water.body && water.body.length >= 3) {
    // The sea's own centroid against the DRY ground's centroid. Both are read off the
    // traced contour, so a leaf whose height field moves moves both.
    const sea = polyCentroid(water.body);
    const dry = dryCentroid(sub, water.body);
    from = dry; to = sea;
    source = 'the dry ground\'s centroid to the traced sea body\'s centroid';
  } else if (water.line && water.line.length >= 2) {
    from = [water.line[0][0], water.line[0][1]];
    to = [water.line[water.line.length - 1][0], water.line[water.line.length - 1][1]];
    source = water.kind === 'coast'
      ? 'the traced shore line\'s own chord (no sea body: the declared fallback)'
      : 'the drawn channel\'s chord, headwater to mouth';
  } else {
    return null;
  }
  const vx = to[0] - from[0], vy = to[1] - from[1];
  const chord = Math.sqrt(vx * vx + vy * vy);
  if (chord < 1e-9) return null;
  const ux = vx / chord, uy = vy / chord;
  const deg = compassDeg(ux, uy);
  return {
    kind: water.kind,
    deg,
    dx: ux,
    dy: uy,
    chord,
    from,
    to,
    source,
    reason: `§5 W1 exit 3 · waterBearing ${deg.toFixed(1)}° (compass, y-down frame): `
      + `${source}. DERIVED from the substrate's own geometry on every read and never stored `
      + '— a minted bearing would be a seed-permanent world fact under THE PROMISE (§251.5).',
  };
}

/** Area-weighted centroid of a closed ring. */
function polyCentroid(ring) {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i], q = ring[(i + 1) % ring.length];
    const f = p[0] * q[1] - q[0] * p[1];
    a += f; cx += (p[0] + q[0]) * f; cy += (p[1] + q[1]) * f;
  }
  if (Math.abs(a) < 1e-12) {
    let sx = 0, sy = 0;
    for (const p of ring) { sx += p[0]; sy += p[1]; }
    return /** @type {[number,number]} */ ([sx / ring.length, sy / ring.length]);
  }
  return /** @type {[number,number]} */ ([cx / (3 * a), cy / (3 * a)]);
}

/** The centroid of the cells the sea body does NOT cover — the land's own middle. */
function dryCentroid(sub, body) {
  const idx = ringIndex(body);
  let sx = 0, sy = 0, n = 0;
  for (let j = 0; j < sub.n; j++) {
    for (let i = 0; i < sub.n; i++) {
      const x = (i + 0.5) * sub.cell, y = (j + 0.5) * sub.cell;
      if (idx.contains(x, y)) continue;
      sx += x; sy += y; n++;
    }
  }
  if (!n) return /** @type {[number,number]} */ ([VIEW / 2, VIEW / 2]);
  return /** @type {[number,number]} */ ([sx / n, sy / n]);
}

/**
 * A compass bearing in degrees from a unit vector, with NO runtime trigonometry.
 * 0 = −y (up the page), 90 = +x, clockwise. `atanUnit` is a fixed 5-term odd polynomial on
 * [0,1], accurate to ~1e-4 rad, which is far finer than any decision taken on this figure.
 */
function compassDeg(ux, uy) {
  // Convert to (east, north) with north = −y, then reduce to an octant.
  const e = ux, nn = -uy;
  const ae = e < 0 ? -e : e, an = nn < 0 ? -nn : nn;
  const t = ae <= an ? (an === 0 ? 0 : ae / an) : (ae === 0 ? 0 : an / ae);
  const a = atanUnit(t) * (180 / Math.PI);
  let d = ae <= an ? a : 90 - a;               // angle from the nearer axis, 0..45 → 0..90
  if (nn >= 0 && e >= 0) d = d;                // NE quadrant
  else if (nn < 0 && e >= 0) d = 180 - d;      // SE
  else if (nn < 0 && e < 0) d = 180 + d;       // SW
  else d = 360 - d;                            // NW
  return d >= 360 ? d - 360 : d;
}

/** atan(t) for t in [0,1], odd polynomial, `+ − × ÷` only. */
function atanUnit(t) {
  const t2 = t * t;
  return t * (0.9998660 + t2 * (-0.3302995 + t2 * (0.1801410 + t2 * (-0.0851330 + t2 * 0.0208351))));
}

/** The four modes. @type {ReadonlyArray<'through'|'bankside'|'near'|'dry'>} */
export const WATER_MODES = Object.freeze(['through', 'bankside', 'near', 'dry']);

/**
 * THE CROSSING BUDGET — what a settlement must muster before its fabric may straddle a
 * watercourse. §42/§43 VALUES, PROPOSED-WITH-RATIONALE; each is an argument:
 *
 *  popFloor    a bridge is a public work. Below town scale the settlement is a ford or a
 *              ferry, not a bridge town — so the floor sits at the town population band.
 *  routeFloor  0..1 from tradeRouteAccess. Nobody bridges a river for local traffic; the
 *              crossing exists because a ROUTE needed it, which is also why crossing
 *              towns are so often named for their crossing.
 *  flowCeiling the substrate's own flow at the crossing point. A trunk river at full
 *              accumulation is a different engineering problem from a tributary, and the
 *              settlement that straddles the big one has to be very large indeed.
 * ⚠ UNSOAKED; rides the tuning signature.
 */
export const CROSSING_BUDGET = Object.freeze({
  popFloor: 900,
  routeFloor: 0.55,
  flowCeiling: 0.86,
});

/** tradeRouteAccess → 0..1 crossing justification. */
const ROUTE_WEIGHT = Object.freeze({
  none: 0, isolated: 0, poor: 0.15, limited: 0.25, moderate: 0.5, road: 0.5,
  river: 0.72, good: 0.68, port: 0.7, crossroads: 0.95, major: 0.9,
  excellent: 0.88, critical: 1,
});

/** How close the nucleus must sit to the channel to count as BANKSIDE rather than NEAR,
 * as a fraction of the frame. A town is "on" its river when its market can smell it. */
export const BANKSIDE_REACH = 0.085;

/**
 * @typedef {Object} WaterRelationship
 * @property {'through'|'bankside'|'near'|'dry'} mode
 * @property {string|null} kind             'river' | 'coast' | null (the landed water kind)
 * @property {Array<[number,number]>|null} line   the watercourse in view space
 * @property {number} width
 * @property {[number, number]|null} crossing     where the fabric meets the water
 * @property {number} bankSide              +1 / −1: which side of the line the town sits
 * @property {string} reason
 * @property {{ population:number, route:number, flow:number, distance:number }} inputs
 */

/**
 * Derive the water relationship.
 *
 * @param {{ kind: string, line: Array<[number,number]>, width: number } | null} water
 *        the watercourse geometry (from the landed frame.water, meandered)
 * @param {{ x: number, y: number }} nucleus
 * @param {any} settlement
 * @param {import('./substrate.js').Substrate} sub
 * @param {{ seed: string|number, variant?: number }} seeding
 * @returns {WaterRelationship}
 */
export function deriveWaterMode(water, nucleus, settlement, sub, seeding) {
  // ⭐ §5 W1 EXIT 6 · THE TWO-SCALE ROWS TRAVEL WITH THE RELATIONSHIP.
  // ⛔ THE RELATIONSHIP IS A NEW OBJECT, NOT A DECORATION OF THE WATERCOURSE, and every row
  // the watercourse carries has to be carried across BY NAME or it is silently dropped —
  // which is exactly what happened to `scales`, `coarse`, `detail` and `worked` on their
  // first run: the census printed an EMPTY two-scale section and nothing failed. ⭐ THE
  // CLASS: **a rebuild-into-a-new-object is a whitelist, and a row nobody added to the
  // whitelist reads as a feature that was never built.**
  const carried = water ? {
    coarse: water.coarse || null,
    scales: water.scales || null,
    detail: water.detail || null,
    worked: water.worked || null,
    workedReach: water.workedReach || null,
    // ⭐⭐ REG-BRIDGE · THE PROFILE RIDES THE WHITELIST. The header above this object states the
    // class in terms — *a rebuild-into-a-new-object is a whitelist, and a row nobody added to
    // the whitelist reads as a feature that was never built* — and the width profile is exactly
    // the shape of row that got dropped last time. ⛔ ABSENT, never `null`-with-a-key, so an
    // unarmed relationship is the same object it always was.
    ...(water.widthProfile ? { widthProfile: water.widthProfile } : {}),
  } : { coarse: null, scales: null, detail: null, worked: null, workedReach: null };
  const population = Number.isFinite(settlement?.population) ? Number(settlement.population) : 0;
  const access = String(settlement?.config?.tradeRouteAccess || '').toLowerCase();
  const route = ROUTE_WEIGHT[access] == null ? 0.5 : ROUTE_WEIGHT[access];

  if (!water || !Array.isArray(water.line) || water.line.length < 2) {
    return {
      ...carried,
      mode: 'dry',
      kind: null,
      line: null,
      width: 0,
      crossing: null,
      bankSide: 1,
      reason: 'no watercourse in the frame — the settlement lives on wells and cisterns, and its well head carries the prominence a landing would have had',
      inputs: { population, route, flow: 0, distance: Infinity },
    };
  }

  // The nearest point of the watercourse to the nucleus — the settlement's own reach to
  // its water, and the crossing candidate.
  let nearest = water.line[0], best = Infinity;
  for (const p of water.line) {
    const dx = p[0] - nucleus.x, dy = p[1] - nucleus.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < best) { best = d; nearest = p; }
  }
  const distance = distToPolyline(nucleus.x, nucleus.y, water.line);
  const flow = sampleAt(sub, sub.flow, nearest[0], nearest[1]);

  // Which side of the water the nucleus sits on — a stable sign from the cross product
  // against the local channel direction. Every bankside decision downstream reads it.
  let bankSide = 1;
  {
    let bi = 0, bd = Infinity;
    for (let i = 0; i < water.line.length; i++) {
      const dx = water.line[i][0] - nucleus.x, dy = water.line[i][1] - nucleus.y;
      const d = dx * dx + dy * dy;
      if (d < bd) { bd = d; bi = i; }
    }
    const a = water.line[Math.max(0, bi - 1)], b = water.line[Math.min(water.line.length - 1, bi + 1)];
    const cross = (b[0] - a[0]) * (nucleus.y - a[1]) - (b[1] - a[1]) * (nucleus.x - a[0]);
    bankSide = cross >= 0 ? 1 : -1;
  }

  // A coast is never crossed and never "near" in the river sense: the town is ON its
  // shore or it is not a coastal town.
  if (water.kind === 'coast') {
    return {
      ...carried,
      mode: 'bankside',
      kind: 'coast',
      line: water.line,
      // ⭐ THE BODY, carried from the shore contour (§9.5b). A coast that travels as a LINE
      // can only ever be drawn as a line, which is how a fjord town came to be rendered
      // with no sea in it. The region travels with the relationship so that every consumer
      // — the "is this water" absolute, the wall's half-ring, the lens — asks the same
      // polygon rather than each re-deriving a side test from the same open polyline.
      body: water.body || null,
      width: water.width,
      crossing: null,
      bankSide,
      reason: 'coastal: the shore is an EDGE, not a division — quays and the water gate face it and the fabric stops at the tide line',
      inputs: { population, route, flow, distance },
    };
  }

  const earnsCrossing = population >= CROSSING_BUDGET.popFloor
    && route >= CROSSING_BUDGET.routeFloor
    && flow <= CROSSING_BUDGET.flowCeiling;

  if (earnsCrossing) {
    return {
      ...carried,
      mode: 'through',
      kind: 'river',
      line: water.line,
      width: water.width,
      crossing: [nearest[0], nearest[1]],
      bankSide,
      reason: `EARNED a crossing: ${population} souls on a ${access || 'road'} route at a bridgeable reach (flow ${flow.toFixed(2)}) — the bridge is the reason the town is here, and the streets continue across it`,
      inputs: { population, route, flow, distance },
    };
  }

  if (distance <= VIEW * BANKSIDE_REACH) {
    return {
      ...carried,
      mode: 'bankside',
      kind: 'river',
      line: water.line,
      width: water.width,
      crossing: [nearest[0], nearest[1]],
      bankSide,
      reason: `bankside: the fabric reaches the water (${Math.round(distance)} units) but never pays for a crossing — a working waterfront on one side, countryside on the other`,
      inputs: { population, route, flow, distance },
    };
  }

  // NEAR — and it is a seeded margin, because the difference between "a short walk" and
  // "on the bank" is a matter of where the good ground happened to be.
  const rng = fabricRng(seeding.seed, 'water-mode', { variant: seeding.variant });
  const margin = rng.range(0.9, 1.35);
  if (distance <= VIEW * BANKSIDE_REACH * margin) {
    return {
      ...carried,
      mode: 'bankside',
      kind: 'river',
      line: water.line,
      width: water.width,
      crossing: [nearest[0], nearest[1]],
      bankSide,
      reason: `bankside by a margin: the settlement sits ${Math.round(distance)} units from the channel — close enough that its yards run down to the bank`,
      inputs: { population, route, flow, distance },
    };
  }

  return {
    ...carried,
    mode: 'near',
    kind: 'river',
    line: water.line,
    width: water.width,
    crossing: [nearest[0], nearest[1]],
    bankSide,
    reason: `near: the water is ${Math.round(distance)} units off — the town sits on the rise or the road and reaches its landing and mill by a lane; the river crosses the COUNTRYSIDE, not the town`,
    inputs: { population, route, flow, distance },
  };
}

/**
 * Is a point on the far bank — the side the settlement did NOT grow on? BANKSIDE and
 * NEAR growth refuse the far side entirely (that is what the mode MEANS); THROUGH
 * permits it. This is the predicate the organism accretion consults.
 * @param {WaterRelationship} rel @param {number} x @param {number} y @returns {boolean}
 */
export function isFarBank(rel, x, y) {
  if (!rel.line || rel.mode === 'through' || rel.mode === 'dry') return false;
  // ⛔ A SEA HAS NO FAR BANK INSIDE THE FRAME. Running the side test against a TRACED
  // coastline reports every headland beyond the nearest shore segment as "the far bank" and
  // forbids the settlement from growing along its own peninsula. For a coast the only
  // absolute is the water itself.
  if (rel.kind === 'coast') return isInWater(rel, x, y);
  let bi = 0, bd = Infinity;
  for (let i = 0; i < rel.line.length; i++) {
    const dx = rel.line[i][0] - x, dy = rel.line[i][1] - y;
    const d = dx * dx + dy * dy;
    if (d < bd) { bd = d; bi = i; }
  }
  const a = rel.line[Math.max(0, bi - 1)], b = rel.line[Math.min(rel.line.length - 1, bi + 1)];
  const cross = (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]);
  return (cross >= 0 ? 1 : -1) !== rel.bankSide;
}

/** Is a point IN the channel? Nothing is ever built there, in any mode.
 * @param {WaterRelationship} rel @param {number} x @param {number} y @returns {boolean} */
export function isInWater(rel, x, y) {
  if (!rel.line) return false;
  if (rel.kind === 'coast') {
    // ⚠ THE BODY'S BOUNDING BOX, MEMOIZED ON THE RELATIONSHIP ITSELF. This predicate is
    // called once per candidate plot, once per field cell and four times per drawn land, so
    // on a coastal city it runs hundreds of thousands of times against a traced shoreline of
    // many vertices — MEASURED at 0.52 s of a city build. A point outside the body's bbox is
    // outside the body, exactly, so the guard changes no answer anywhere.
    if (rel.body && rel.body.length >= 3) {
      let bb = rel.__bodyBox;
      if (!bb) {
        let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        for (const p of rel.body) {
          if (p[0] < x0) x0 = p[0];
          if (p[1] < y0) y0 = p[1];
          if (p[0] > x1) x1 = p[0];
          if (p[1] > y1) y1 = p[1];
        }
        bb = { x0, y0, x1, y1 };
        // Non-enumerable so the memo never reaches a hash, a golden or a serialization —
        // a cache that changes an object's own key set is a determinism hazard.
        Object.defineProperty(rel, '__bodyBox', { value: bb, enumerable: false, writable: false });
      }
      if (x < bb.x0 || x > bb.x1 || y < bb.y0 || y > bb.y1) return false;
    }
    // ⭐ THE BODY IS THE ANSWER WHEN THERE IS ONE. The side test below is a fallback that
    // is only correct for a shore that is roughly a straight edge — on a traced coastline
    // with a deep cove it reports the whole headland as sea, because "the far side of the
    // nearest segment" is not a containment test. A polygon knows what is inside it.
    // ⭐ THE BODY'S OWN Y-BANDED INDEX, memoized beside the bbox and under the same rule:
    // NON-ENUMERABLE, so a cache can never reach a hash, a golden or a serialization.
    if (rel.body && rel.body.length >= 3) {
      let ix = rel.__bodyIdx;
      if (!ix) {
        ix = ringIndex([rel.body]);
        Object.defineProperty(rel, '__bodyIdx', { value: ix, enumerable: false, writable: false });
      }
      return ix.contains(x, y);
    }
    return isFarBankRaw(rel, x, y);
  }
  // ⭐⭐ REG-BRIDGE · THE WET TEST IS ASKED AT THE LOCAL WIDTH once a profile exists.
  // ⛔ THE UNARMED SPELLING IS LEFT EXACTLY AS IT WAS, on purpose. `stationAt` computes the same
  // distance by the same formula, but "the same formula" is not "the same bits" once an
  // accumulation order differs, and this predicate decides where every parcel in the corpus may
  // stand. Branching on the profile's PRESENCE makes dormancy true by construction rather than
  // true by a float comparison nobody can inspect.
  if (!rel.widthProfile) return distToPolyline(x, y, rel.line) < rel.width * 0.62;
  const st = stationAt(rel, x, y);
  return st.d < st.w * 0.62;
}

/** Even-odd point-in-ring, local (the sea body is emphatically not convex). */
function pointInRing(poly, px, py) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
    if ((yi > py) !== (yj > py)) {
      const x = (xj - xi) * (py - yi) / (yj - yi) + xi;
      if (px < x) inside = !inside;
    }
  }
  return inside;
}

/** The raw side test, used by the coast case where "far bank" IS the water. */
function isFarBankRaw(rel, x, y) {
  let bi = 0, bd = Infinity;
  for (let i = 0; i < rel.line.length; i++) {
    const dx = rel.line[i][0] - x, dy = rel.line[i][1] - y;
    const d = dx * dx + dy * dy;
    if (d < bd) { bd = d; bi = i; }
  }
  const a = rel.line[Math.max(0, bi - 1)], b = rel.line[Math.min(rel.line.length - 1, bi + 1)];
  const cross = (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]);
  return (cross >= 0 ? 1 : -1) !== rel.bankSide;
}
