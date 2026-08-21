/**
 * domain/townMap/fabric/parcels.js — BURGAGE SLICING: the fabric proper.
 *
 * ⭐⭐ BURGAGE SLICING, NOT RECURSIVE SUBDIVISION. MF-P1 records this as the single most
 * important craft correction of the whole programme: recursive halving along a polygon's
 * widest axis produces "triangles and slivers scattered on a void — the owner's original
 * conviction restated." A burgage plot is NARROW ON THE STREET AND DEEP BEHIND IT, cut
 * from a block that fronts a street along one edge, and slicing produces exactly the
 * packed, aligned, street-fronting quads the reference corpus shows.
 *
 * ⭐ THE BLOCK GRID IS BUILT IN THE ORGANISM'S OWN GRAIN FRAME AND THEN CULLED. Every
 * block and every plot is a rectangle in a rotated frame, so it is convex, exact and
 * free of degeneracy; the ORGANIC RAGGED EDGE comes from culling against the true
 * non-convex umbrella, which is also how a real town's edge happened — regular plots,
 * laid to a grain, stopping where the ground or the ownership stopped.
 *
 * ⭐⭐ THE §160.2 CRAFT LIST, which is what separates a town from corduroy. The chair's
 * eyes-on verdict on the prototype was "strip ranks too UNIFORM (needs yards,
 * cross-alleys, depth variance, gable-end breaks)". All four are mechanisms here, not
 * decorations:
 *
 *   YARDS            a burgage plot is a building AND its yard. The back half is not a
 *                    second building most of the time — it is open ground with a shed on
 *                    it. Building both halves everywhere is what made the ranks solid.
 *   DEPTH VARIANCE   plots on one rank are not the same depth: the back boundary follows
 *                    the ownership, not a ruler. The variance is per-plot and hashed, so
 *                    it is stable.
 *   CROSS-ALLEYS     every few plots a rank is broken by a narrow way to the back yards.
 *                    This is the single change that most breaks up the corduroy read.
 *   GABLE-END BREAKS occasionally a plot turns its gable to the street instead of its
 *                    side, or sets back from the frontage line. Real ranks are not
 *                    flush, and the eye reads the irregularity as age.
 *
 * ⭐ PARCEL-GRAIN DITHERING (§161e.3): each parcel takes ONE FLAT character from the
 * fields over its own centroid, hashed on its own lineage key. §9.2 forbids gradients,
 * and this is the era-legal — and more truthful — way to render an overlap: a real
 * street mixes trades by alternating shopfronts, not by fading.
 *
 * INERTIA: every plot's variation is a HASH OF ITS OWN LINEAGE KEY, never a stream draw,
 * so a plot's depth, its yard, its gable and its character do not move when a
 * neighbouring plot appears or disappears.
 *
 * PURITY: no Date, no Math.random, no runtime trig, no localeCompare.
 */

import { fabricRng, hashUnit } from './fabricRng.js';
import { parcelKey, compareKeys } from './lineage.js';
import { TRIG_N, cosI, sinI, absArea, centroid, convexHull, isSliver, offsetPolygonOutward, ringIndex } from './fabricGeometry.js';
import { VIEW, sampleAt } from './substrate.js';
import { buildableAt } from './groundRefusal.js';
import { plotDepthRatio, buildOutRung } from './tierGrammar.js';
import { sampleFields, ditherCharacter, ownerAt } from './organismFields.js';

/**
 * PLOT PROPORTIONS. §42/§43 VALUES, PROPOSED-WITH-RATIONALE — every one is a reading of
 * the historical burgage plot rather than a composition preference:
 *
 *  depthRatio   a burgage plot's depth against its street frontage. The attested English
 *               burgage runs roughly 1:4 to 1:8 (a "long acre" behind a narrow front);
 *               at plan scale anything past ~3.2 renders as a corridor, so the drawn
 *               ratio is the shallow end of the real range — declared, not hidden.
 *  yardShare    the share of a plot's DEPTH that is yard rather than building. Two
 *               thirds is the historically ordinary arrangement: house on the street,
 *               garden and workshop behind.
 *  backOdds     how often the back of the yard carries a building too (the back-house,
 *               the workshop, the stable). Rises with density.
 *  gableOdds    how often a plot turns its gable or sets back.
 *  frontJitter  how far a plot may sit off the frontage line, as a share of frontage.
 * ⚠ UNSOAKED; rides the tuning signature.
 */
export const PLOT_SHAPE = Object.freeze({
  // ⚠ THE DEPTH RATIO NO LONGER LIVES HERE. It is per-tier (a burgage plot is an URBAN
  // form; a hamlet's houses stand on crofts) and its ONE home is tierGrammar.plotDepthRatio,
  // because the extent derivation reads the plot's AREA from the same number this module
  // reads its SHAPE from. This entry is the DEFAULT the deriver falls back to.
  depthRatio: 2.35,
  yardShare: 0.44,
  backOdds: 0.34,
  gableOdds: 0.13,
  frontJitter: 0.16,
  /** ⭐ T-08: how often a holding stands BACK from the frontage line. The corpus's ranges are
   * flush — that continuity IS the street's wall — and the setback is the exception that
   * proves it: the house behind its forecourt, the plot rebuilt after a widening. §42/§43
   * VALUE, read off the reference frontages (hf72, hf56, hf13): roughly one holding in six
   * breaks the line. ⚠ UNSOAKED; rides the tuning signature. */
  setbackOdds: 0.17,
  // ⭐ THE REAR WING — the L-JOG, and it is a HISTORICAL FORM rather than a shape variation
  // added for visual interest. A burgage building of any substance is a street range with a
  // wing running back down ONE SIDE of its yard: the kitchen, the workshop, the brewhouse.
  // It is the single most characteristic footprint in the reference corpus (hf30's blocks
  // are almost entirely L and U plans), and a fabric of plain rectangles reads as a housing
  // estate whatever its ink weight. Only plots with the frontage to carry one get one — a
  // cottage on a split plot is a rectangle, correctly.
  wingOdds: 0.42,
  wingShare: 0.44,       // the share of the frontage the wing occupies
  wingDepth: 0.62,       // the wing's run into the yard, as a share of the built depth
  // ⛔ THE PARTY-WALL GAP. MF-B1 left 8.5% of a frontage between neighbours, which at plan
  // scale is a visible alley between every pair of houses — the "scattered dominoes" read
  // the chair convicted. Town buildings SHARE WALLS; the line between two houses is an ink
  // line, not a gap. The residual exists only so the ink of one does not merge with the ink
  // of the next into a single mass.
  partyGap: 0.035,
});

/**
 * ⭐⭐⭐ §17.6 THE ALLEY-GAP LAW (chair directive ODQ §190b — the owner LIKES the intra-block
 * slivers and wants them KEPT, organically derived).
 *
 * This is the POSITIVE side of §17's party-wall work: **the seeded party-wall decision IS
 * the gaps' source.** A terrace is not a solid; it is a run of buildings that MOSTLY share
 * their walls, and every place two of them do not share one is a gap with a reason. The
 * directive's own list is the vocabulary, and each row here carries its warrant:
 *
 *  ownership-seam   no party wall was rolled — two holdings that never agreed to build
 *                   together. The base case, and the only one whose frequency is a dial.
 *  rear-access      a deep plot row has to be able to get to its own back yards, so at
 *                   least one gap per block row is a THROUGH-PASSAGE by necessity. This is
 *                   the row the pin asserts; it is a requirement, not a probability.
 *  fire-break       ordered AND wealthy fabric buys a deliberate wider break. Historically
 *                   exact (every post-fire building ordinance in Europe mandates them) and
 *                   it is why a rich orderly quarter has FEW gaps but OBVIOUS ones.
 *  drainage-slit    the substrate's fall runs across the rank: a slit lets the water down
 *                   between the houses instead of through them.
 *  packing-wedge    a poor quarter's leftover — the run subdivided until the last width did
 *                   not fit a house, and the remainder stayed a wedge.
 *
 * ⭐ TWO KINDS, AND THE DIFFERENCE IS WHETHER A PERSON CAN WALK IT.
 *  THROUGH-PASSAGE  person-wide, NEVER cart-wide. It runs from the street line to the rear
 *                   yards, it is the street web's informal LOWEST RANK, and it MAY NOT BE
 *                   BLOCKED — a footprint across it is a defect, which is what the pin says.
 *  CLOSED SLOT      a dead sliver between two walls. The ink renders it as a dark seam for
 *                   free, because it is the gap between two inked outlines.
 *
 * ⚠ THE WIDTHS ARE IN PLOT FRONTAGES like every other length here, and the ceiling on a
 * passage is what makes it a passage: 0.55 of a frontage is about as wide as a person with
 * a yoke, and a cart needs a full one. A "passage" wide enough for a cart is a lane, and the
 * §160.2 hierarchy already has a rank for that.
 * §42/§43 VALUES, PROPOSED-WITH-RATIONALE. ⚠ UNSOAKED; ride the tuning signature.
 */
export const ALLEY_GAP = Object.freeze({
  party: 0.035,          // the ink line between two shared walls — not a gap, a wall
  slot: 0.16,            // a dead sliver: visible, unwalkable
  passage: 0.42,         // person-wide
  fireBreak: 0.62,       // deliberate, and the widest a §17.6 gap may be
  /** The base ownership-seam frequency, before order and wealth move it. */
  // ⚠ 0.11 AND CAPPED, RE-MEASURED. At 0.16 a POOR ward's seam frequency reached 0.16 ×
  // 2.10 × 1.30 = 0.44 — nearly half of every boundary a gap, which is not "many and
  // irregular", it is a row of detached cottages. MEASURED: the city's block build-out fell
  // from 0.62 to 0.54 against a reference band of 0.70–0.80. The cap is what keeps the
  // wealth and chaos multipliers from compounding into a different kind of fabric.
  seamBase: 0.11,
  seamCap: 0.26,
});

/**
 * How the seam frequency answers to ORDER × WEALTH (§17.6.3: "ordered rich = few and
 * deliberate; poor/chaotic = many and irregular"). One multiplier each, so the two dials
 * compose and neither can be read as the other.
 */
export const GAP_FREQUENCY = Object.freeze({
  wealth: { poor: 2.10, modest: 1.35, comfortable: 0.85, wealthy: 0.55 },
  /** Multiplied by (1 − lawfulness): a lawful fabric agrees to build together. */
  chaosGain: 1.30,
});

/**
 * ⭐ THE GAP DECISION (§17.6). ONE call per plot boundary, returning the kind, the width and
 * the REASON — because a gap with no reason is the "sprinkled decoration" the directive
 * forbids, and a reason that is never recorded cannot be audited.
 *
 * ⚠ THE ORDER OF THE TESTS IS THE ORDER OF NECESSITY: rear access is a REQUIREMENT (a deep
 * row that cannot reach its own back yards is a defect whatever the dials say), so it is
 * asked first and it overrides. Everything below it is a probability.
 *
 * @param {Object} a
 * @returns {{ kind:'party'|'passage'|'slot', width:number, reason:string }}
 */
export function decideGap(a) {
  const f = a.frontage;
  const wealthMul = GAP_FREQUENCY.wealth[String(a.wealth || 'modest')] == null
    ? GAP_FREQUENCY.wealth.modest : GAP_FREQUENCY.wealth[String(a.wealth || 'modest')];
  const chaosMul = 1 + (1 - Math.max(0, Math.min(1, a.lawfulness))) * (GAP_FREQUENCY.chaosGain - 1);

  // 1 · REAR ACCESS — a requirement, not a roll. A row of deep plots must be able to reach
  //     its own back yards, and about every fifth holding is where a real terrace put the
  //     entry. §17.6's pin asserts exactly this.
  if (a.needsAccess && a.sincePassage >= 6) {
    return { kind: 'passage', width: f * ALLEY_GAP.passage, reason: 'rear-access' };
  }
  const roll = hashUnit(`${a.key}|gap`);
  // 2 · FIRE BREAK — ordered AND wealthy only, and deliberately the widest gap in the law.
  if (a.lawfulness > 0.55 && (a.wealth === 'wealthy' || a.wealth === 'comfortable')
    && roll < 0.035 * a.lawfulness) {
    return { kind: 'passage', width: f * ALLEY_GAP.fireBreak, reason: 'fire-break' };
  }
  // 3 · DRAINAGE SLIT — the ground's own decision, so it does not answer to wealth or order.
  if (a.slopeAcross > 0.16 && roll < 0.10 + a.slopeAcross * 0.30) {
    return { kind: 'slot', width: f * ALLEY_GAP.slot, reason: 'drainage-slit' };
  }
  // 4 · PACKING WEDGE — the poor quarter's leftover.
  if (a.wealth === 'poor' && roll > 1 - 0.09 * chaosMul) {
    return { kind: 'slot', width: f * ALLEY_GAP.slot * 1.35, reason: 'packing-wedge' };
  }
  // 5 · OWNERSHIP SEAM — the base case: two holdings that never agreed to build together.
  const seam = Math.min(ALLEY_GAP.seamCap, ALLEY_GAP.seamBase * wealthMul * chaosMul);
  if (roll < seam) {
    // Half of them go all the way through to the yards; the rest die against a back wall.
    const through = hashUnit(`${a.key}|gapthru`) < 0.5;
    return through
      ? { kind: 'passage', width: f * ALLEY_GAP.passage, reason: 'ownership-seam' }
      : { kind: 'slot', width: f * ALLEY_GAP.slot, reason: 'ownership-seam' };
  }
  // ── OTHERWISE THE WALL IS SHARED. This is the density, and it is the common case.
  return { kind: 'party', width: f * ALLEY_GAP.party, reason: 'party-wall' };
}

/** Aspect floor below which a quad is a sliver and is dropped rather than drawn. */
const SLIVER_FLOOR = 0.13;

/**
 * ⭐⭐⭐ §10.A3 · WARD WEALTH STRATIFICATION — "per-ward material wash and PARCEL GRAIN
 * (tile-and-slate wards by the exchange; thatch-brown crowded parcels downwind)."
 *
 * ⛔ THE SOURCE WAS ALREADY IN HAND AND EXPRESSED NOTHING. The landed model gives every
 * district a `wealth` (poor | modest | comfortable | wealthy) and the fabric has carried it
 * on the organism since MF-B1 — MEASURED at this base: the city's eight quarters run poor
 * through wealthy and every one of them drew the SAME plot module, the SAME yard share and
 * the SAME roof tone. §8.2's failure mode again, on a field the truth layer already shows
 * in its click card: a reader could see the wealth in the dossier and not in the drawing.
 *
 * ⭐ WEALTH IS A GRAIN BEFORE IT IS A COLOUR, and that ordering matters. A poor ward is not
 * a brown ward — it is a ward of NARROWER PLOTS, SMALLER YARDS and MORE BUILDING ON THEM,
 * because subdivision is what poverty does to land tenure (§11.4's own falling-prosperity
 * clause states the mechanism: "the fine house splits into tenements"). A wealthy ward is
 * the reverse: wide frontages, deep gardens, the yard NOT built over. That reads at a
 * glance without any tone at all, which is the §9.1 ink-first law obeyed.
 * §42/§43 VALUES, PROPOSED-WITH-RATIONALE. ⚠ UNSOAKED; rides the tuning signature.
 * @type {Readonly<Record<string, { frontage:number, yard:number, back:number, tone:number }>>}
 */
export const WARD_GRAIN = Object.freeze({
  poor:        { frontage: 0.76, yard: 0.68, back: 1.30, tone: -0.10 },
  modest:      { frontage: 0.92, yard: 0.90, back: 1.10, tone: -0.03 },
  comfortable: { frontage: 1.08, yard: 1.12, back: 0.92, tone: 0.05 },
  wealthy:     { frontage: 1.26, yard: 1.34, back: 0.70, tone: 0.12 },
});

/**
 * ⭐ THE MATERIAL LADDER (§7's prosperity walk, per WARD rather than per settlement).
 * §5's own metropolis row asks for it in terms: "material palette differentiates rich/poor
 * quarters visually". The ladder is thatch → shingle → tile → slate, and the ward's wealth
 * sets where on it the ward's ordinary house sits — with a per-plot roll either side, so
 * the transition is PATCHY. §11.4 is explicit that re-roofing spreads "visibly patchy —
 * honesty over tidiness"; a ward in one flat material is a zoning map, not a town.
 * @type {ReadonlyArray<string>}
 */
export const MATERIALS = Object.freeze(['thatch', 'shingle', 'tile', 'slate']);

/** Where a ward's ordinary roof sits on the ladder, before the per-plot roll. */
const WEALTH_MATERIAL = Object.freeze({ poor: 0.15, modest: 0.90, comfortable: 1.70, wealthy: 2.55 });

/** Resolve a ward's grain row; an unknown wealth word degrades to `modest` and says so by
 * being the identity-ish row rather than by throwing — the model's vocabulary is not this
 * module's to police. */
export function wardGrain(wealth) {
  return WARD_GRAIN[String(wealth || 'modest').toLowerCase()] || WARD_GRAIN.modest;
}

/** The roof material of one plot: its ward's rung on the ladder, plus its own roll. */
export function plotMaterial(wealth, prosperityRank, key) {
  const base = WEALTH_MATERIAL[String(wealth || 'modest').toLowerCase()];
  const seat = (base == null ? 0.9 : base) + (prosperityRank - 2) * 0.22;
  const roll = (hashUnit(`${key}|mat`) - 0.5) * 1.1;
  const idx = Math.round(seat + roll);
  return MATERIALS[idx < 0 ? 0 : idx >= MATERIALS.length ? MATERIALS.length - 1 : idx];
}

/**
 * @typedef {Object} Parcel
 * @property {string} key            the lineage key (see ./lineage.js)
 * @property {Array<[number,number]>} polygon   the BUILDING quad
 * @property {Array<[number,number]>|null} yard the open ground behind it, or null
 * @property {[number,number]} center
 * @property {string|null} organismKey
 * @property {string} character      the dithered flat character (§161e.3)
 * @property {boolean} matrix        is this a plain dwelling of the residential matrix?
 * @property {number} area
 * @property {number} tone           0..1 stable per-parcel tone jitter
 * @property {boolean} derelict
 * @property {boolean} gable
 * @property {number} grainAngle
 */

/**
 * Build the fabric for ONE organism. Independent of every other organism except through
 * the shared partition and umbrella — which is what makes the inertia pin true.
 *
 * @param {Object} args
 * @returns {{ parcels: Parcel[], blocks: Array<Array<[number,number]>> }}
 */
export function packOrganism(args) {
  const {
    organism, organisms, partition, umbrella, web, sub, water, seeding,
    forbidden, prosperityRank, blockDepth, morphology,
  } = args;

  // §10.A3: the ward's own wealth sets its grain before anything else is measured from it.
  // ⛔⛔ BUT THE FRONTAGE MULTIPLIER IS AN **URBAN** DIFFERENTIATION, AND APPLYING IT AT THE
  // CENSUS TIERS BROKE THE 1:1 CLAIM. §181.2b makes the plot MODULE the fixed end of the
  // derivation below town — the extent was derived FROM it — and the two-pass calibration
  // is deliberately clamped to ±20% of it, so per-ward multipliers of 0.76–1.26 push the
  // effective module outside the band the calibration is allowed to correct within.
  // MEASURED: the hamlet's census error went from 10% to 29% the moment the grain landed.
  // ⭐ AND IT IS ALSO THE TRUTH. Subdivision is what poverty does to BOROUGH tenure, where
  // street frontage is the scarce thing; a hamlet's houses stand on crofts, and a poor
  // croft is not a narrower croft — it is a worse house on the same croft. So below town the
  // wealth shows in the MATERIAL and in the YARD, which is where it actually showed.
  // (The same reading as J-B2-3: the burgage plot is an urban form.)
  const grainRow = wardGrain(organism.wealth);
  const urban = args.tierScale && ['town', 'city', 'metropolis'].indexOf(args.tierScale.extentTier) >= 0;
  const grain = urban ? grainRow : { ...grainRow, frontage: 1 };
  const frontage = web.plotFrontage * grain.frontage;
  const rng = fabricRng(seeding.seed, `${organism.key}/pack`, {
    variant: seeding.variant,
    changeYear: organism.changeYear,
  });

  // The organism's own grain: the direction its streets run. u is ALONG the frontage,
  // v is INTO the block.
  const ux = cosI(organism.grainAngle), uy = sinI(organism.grainAngle);
  const vx = -uy, vy = ux;

  // Block dimensions. `blockAlong` is the rank's run before the block ends; `blockDeep`
  // is two plot depths back to back (the classic double-sided block, with the back
  // boundary of one rank against the back boundary of the next).
  // ⛔⛔ THE DEPTH CLAMP — THE OTHER HALF OF MF-A3's CLAMP, AND IT WAS MISSING.
  //
  // MF-A3 capped the plot FRONTAGE at a third of the built radius, because a thorp's few
  // dwellings divided into its small area produce plots wider than the settlement. Correct
  // — and it left the DEPTH derived from the clamped frontage by a fixed 2.35 ratio, so a
  // thorp's plots came out 0.71 × the built RADIUS deep: a burgage plot longer than the
  // whole hamlet it sits in. Every such plot straddles the settlement, its centroid lands
  // outside the umbrella, the ragged-edge cull removes it, and the tier renders EMPTY.
  // MEASURED at this base: the thorp exemplar produced 22 umbrella culls out of 34
  // candidates and finished with ZERO buildings on open ground the probe showed was 35%
  // buildable. ⭐ THE CLASS: a clamp applied to one axis of a derived shape silently moves
  // the aspect ratio into the other axis. Clamp the SHAPE, not one of its measurements.
  // ⭐ THE RATIO IS THE TIER'S OWN (see tierGrammar.PLOT_DEPTH_RATIO): a burgage strip in a
  // borough, a croft in a hamlet. With the true ratio the clamp below no longer binds at the
  // bottom of the ladder, so no plot's aspect is decided by a guard.
  const depthRatio = args.tierScale ? plotDepthRatio(args.tierScale.extentTier) : PLOT_SHAPE.depthRatio;
  // ⭐ THE BUILD-OUT RUNG (§181.2a). Yard share and back-house odds are a TIER-AND-
  // PROSPERITY fact, not a constant — see tierGrammar.BUILD_OUT for why the references'
  // 70–80% is the CITY's bar and copying it down the ladder would be the wrong reference.
  const rung = buildOutRung(
    args.tierScale ? args.tierScale.extentTier : 'town',
    prosperityRank,
  );
  const plotDepth = Math.min(
    frontage * depthRatio,
    (args.tierScale ? args.tierScale.builtRadius : Infinity) * 0.34,
  );
  // Cover the organism's own extent, with a margin so a block straddling the edge still
  // contributes its inside half.
  const span = organism.reach * 1.35;
  // ⛔ A BLOCK MAY NEVER BE LARGER THAN THE QUARTER IT SITS IN. The block dimensions are
  // a rhythm — how often a street recurs — and at the bottom of the ladder that rhythm is
  // longer than the whole settlement, so the grid produces ONE block whose plots all fall
  // outside the organism and are culled to nothing. Clamping to the span guarantees at
  // least one block that actually fits, which is what makes a hamlet render as a hamlet.
  const blockDeepRaw = plotDepth * (blockDepth === 1 ? 1 : 2);
  const blockAlongRaw = frontage * (blockDepth === 1 ? 5 : blockDepth === 2 ? 8 : 11);
  const blockDeep = Math.min(blockDeepRaw, span * 0.9);
  const blockAlong = Math.min(blockAlongRaw, span * 1.1);
  const cols = Math.ceil((span * 2) / blockAlong);
  const rows = Math.ceil((span * 2) / (blockDeep + web.widths.blockLane));

  /** @type {Parcel[]} */ const parcels = [];
  /** @type {Array<Array<[number,number]>>} */ const blocks = [];
  /** @type {Array<{key:string, organismKey:string, line:Array<[number,number]>}>} */
  const alleys = [];
  /** §17.6: the through-passages (drawn, walkable) and the closed slots (counted only —
   *  the ink renders a slot for free as the gap between two outlines). */
  /** @type {Array<any>} */ const passages = [];
  /** @type {Array<any>} */ const slots = [];

  const toWorld = (u, v) =>/** @type {[number,number]} */ ([
    organism.anchor.x + ux * u + vx * v,
    organism.anchor.y + uy * u + vy * v,
  ]);
  const quad = (u0, v0, u1, v1) => [toWorld(u0, v0), toWorld(u1, v0), toWorld(u1, v1), toWorld(u0, v1)];

  const orgIndex = organisms.indexOf(organism);

  for (let r = 0; r < rows; r++) {
    const v0 = -span + r * (blockDeep + web.widths.blockLane);
    // ROW JITTER: an organic quarter's ranks do not line up across a lane. A planned one
    // does — `blockRegular` is the morphology's own dial, so the difference between an
    // accreted quarter and a laid-out one is visible without a second mechanism.
    const rowShift = (hashUnit(`${organism.key}|row|${r}`) - 0.5) * blockAlong
      * (1 - morphology.shape.blockRegular);

    for (let c = 0; c < cols; c++) {
      const u0 = -span + c * (blockAlong + web.widths.organism) + rowShift;
      const blockU1 = u0 + blockAlong;
      const blockV1 = v0 + blockDeep;

      // Cull the whole block early when its centre is nowhere near the organism.
      const bc = toWorld((u0 + blockU1) / 2, (v0 + blockV1) / 2);
      const dcx = bc[0] - organism.anchor.x, dcy = bc[1] - organism.anchor.y;
      if (Math.sqrt(dcx * dcx + dcy * dcy) > organism.reach * 1.5) continue;

      // ⭐ THE BLOCK IS EMITTED ONLY IF IT BUILT SOMETHING (see the cull below). A block
      // whose every plot died on the ragged edge is not a city block; it is a rectangle
      // over a field, and the ink pass draws whatever it is given.
      const parcelsBefore = parcels.length;

      // ── THE RANKS. A double-deep block carries two ranks back to back, each fronting
      //    its own lane; a shallow block carries one.
      const ranks = blockDeep > plotDepth * 1.5 ? 2 : 1;
      for (let rank = 0; rank < ranks; rank++) {
        const frontV = rank === 0 ? v0 : blockV1;
        const dir = rank === 0 ? 1 : -1;             // which way the plot runs back

        // ⭐⭐ THE BLOCK IS THE GROUND ITS TENEMENTS STAND ON — A RANK RUN, NOT A CONVEX
        // HULL, and this is the STRUCTURAL half of the §181.2a build-out cure.
        //
        // ⛔ WHY THE HULL COULD NOT REACH THE REFERENCE. `convexHull` over every surviving
        // plot in a block is convex BY DEFINITION, so it spans every notch the ragged edge
        // and the culls cut into the rank — and every one of those notches counts as block
        // ground with no building on it. MEASURED: the hull ran 1.42× the sum of the plot
        // cells it enclosed, which caps the build-out ratio at ~0.58 no matter how much of
        // each plot is built. Tuning the yards further would have chased a denominator.
        // ⭐ THE CLASS: when a ratio stalls under every change to its numerator, the term
        // that is wrong is the denominator's DEFINITION.
        //
        // A rank run is also the RIGHT SHAPE twice over: it is a rectangle in the
        // organism's own grain (hf30's blocks are exactly that, not faceted polygons —
        // MF-B1b's §3.3 shortfall), and it is bounded by the two streets the plots front
        // and back onto, which is what a block IS.
        /** @type {{u0:number,u1:number,depth:number,n:number,id:number}|null} */ let run = null;
        let runSerial = 0;
        const closeRun = () => {
          // Two plots is the floor, unchanged: one surviving plot on the fringe is an
          // outlying house, and drawing a block behind it would put urban ground under a
          // farmstead.
          if (run && run.n >= 2) {
            const pad = frontage * 0.14;             // the block's share of its own lane
            blocks.push({
              polygon: [
                toWorld(run.u0 - pad, frontV - dir * pad * 0.5),
                toWorld(run.u1 + pad, frontV - dir * pad * 0.5),
                toWorld(run.u1 + pad, frontV + dir * (run.depth + pad * 0.5)),
                toWorld(run.u0 - pad, frontV + dir * (run.depth + pad * 0.5)),
              ],
              organismKey: organism.key,
              grainAngle: organism.grainAngle,
              // ⭐⭐ THE BLOCK REMEMBERS THE STREET IT FRONTS ONTO (§181.3a). A rank run is
              // bounded by two streets by definition — the one its plots front and the one
              // their yards back onto — and the FRONT is the one that is a street in the
              // town's own sense. Carrying it here is what lets the street web be assembled
              // from the fabric's own blocks rather than guessed at from the gaps between
              // them: the channel is the line these doors open onto.
              // ⚠ It is a fact about THIS run, so it is recorded here where the run's own
              // extent is known, and never re-derived from the polygon (whose corners have
              // already been padded outward into the lane).
              front: [toWorld(run.u0 - pad, frontV), toWorld(run.u1 + pad, frontV)],
              backLine: [
                toWorld(run.u0 - pad, frontV + dir * run.depth),
                toWorld(run.u1 + pad, frontV + dir * run.depth),
              ],
              row: r,
              col: c,
              rank,
              runSerial,
              depth: run.depth,
              // ⭐⭐ THE COLUMN GAPS — THE GRID'S OWN CROSS STREETS, recorded because a RUN'S
              // END IS NOT A STREET. A rank run stops wherever the culls refused the next
              // plot (the ragged edge, a terrain refusal, a compound), and MF-B3's first
              // spelling took those stopping points for cross streets: MEASURED, the
              // resulting `blockCross` rank covered THIRTY-SEVEN PER CENT of a city's
              // built-up area, because most of its centrelines were block interiors rather
              // than gaps. The grid leaves exactly one gap per column, of exactly
              // `widths.organism`, and these two points are its centre before and after this
              // block — the only places an across-grain street actually exists.
              gapBefore: toWorld(u0 - web.widths.organism * 0.5, frontV),
              gapAfter: toWorld(blockU1 + web.widths.organism * 0.5, frontV),
            });
          }
          if (run) runSerial++;
          run = null;
        };

        // ── CROSS-ALLEYS (§160.2): break the rank every few plots.
        const alleyEvery = CROSS_ALLEY_SPAN(organism.key, r, c, rank);
        let plotIndex = 0;
        let sinceAlley = 0;
        // §17.6 rear-access: how many plots since the last through-passage in THIS row.
        let sincePassage = 99;
        // The substrate's fall ACROSS the rank — a drainage slit only makes sense where the
        // water actually wants to run BETWEEN the houses rather than along them. Sampled on
        // the run's own v axis at the block's own centre, so it is a fact about this rank.
        const midU = (u0 + blockU1) / 2;
        const upA = toWorld(midU, frontV - dir * plotDepth * 0.5);
        const upB = toWorld(midU, frontV + dir * plotDepth * 1.5);
        const slopeAcross = Math.abs(
          sampleAt(sub, sub.height, upB[0], upB[1]) - sampleAt(sub, sub.height, upA[0], upA[1]),
        );
        // ⭐⭐⭐ THE PLOTS ARE CUT TO THE BLOCK, NOT TO A TEMPLATE (MF-B7 §3's named lever,
        // and it is the one member three separate findings pointed at).
        //
        // ⛔ WHAT THE TEMPLATE CUT DID. The old walk started at the block's corner, cut plots
        // at a jittered module until one did not fit, and let the CULLS delete whatever
        // straddled ground the fabric refused. Three measured consequences, all one defect:
        // the ground law still dropped 152–230 bodies per urban leaf AFTER the demotion arm;
        // the metropolis's build-out sat at 34.8 against a band of 34+; and §202's last six
        // landlocked bodies sat inside a solid mass ~33 units across with no gap anywhere in
        // it. ⭐ THE CLASS: **A REPAIR PASS CAN ONLY RECLAIM WHAT THE CUT LEFT LEGAL. A CUT
        // THAT RESPECTED THE BLOCK WOULD NOT CREATE THE DEBT.**
        //
        // ⭐ SO THE RANK IS SCANNED FIRST AND CUT SECOND. A quarter-module probe walks the
        // rank line asking the SAME questions the culls ask (the ragged edge, the right of
        // way, the partition owner, the terrain), which yields the CONTIGUOUS ADMISSIBLE
        // SPANS — the ground a surveyor would actually have had to lay out. Each span is then
        // divided into a WHOLE NUMBER of plots that exactly fill it. Nothing is left over,
        // because there is no leftover to leave: the module bends to the block, which is what
        // every real burgage row did (§17.4's own frontage law read forwards).
        const STEP = frontage * 0.25;
        const nSteps = Math.max(1, Math.ceil((blockU1 - u0) / STEP));
        const probeDeep = plotDepth * 0.42, probeFront = plotDepth * 0.06;
        /** Every cull the plot walk applies at a POINT, asked of the probe. */
        const admissible = (px, py) => {
          if (px < 6 || py < 6 || px > VIEW - 6 || py > VIEW - 6) return false;
          if (!insideAny(umbrella.components, px, py)) return false;
          if (forbidden(px, py)) return false;
          if (ownerAt(partition, px, py) !== orgIndex) return false;
          // ⭐ ONE HOME (§5 W1 exit 2). This read `slope > 0.80 && wet > 0.62`, in the
          // per-leaf-normalized unit — see groundRefusal.js for the 7.5× measurement.
          if (!buildableAt(sub, px, py)) return false;
          return true;
        };
        /** @type {Array<[number,number]>} */ const spans = [];
        {
          let open = -1;
          for (let i = 0; i <= nSteps; i++) {
            let ok = i < nSteps;
            if (ok) {
              const uu = u0 + (i + 0.5) * STEP;
              const a = toWorld(uu, frontV + dir * probeDeep);
              const b = toWorld(uu, frontV + dir * probeFront);
              ok = admissible(a[0], a[1]) && admissible(b[0], b[1]);
            }
            if (ok && open < 0) open = i;
            else if (!ok && open >= 0) { spans.push([u0 + open * STEP, u0 + i * STEP]); open = -1; }
          }
        }

        for (const [spanA, spanB] of spans) {
          // ⭐⭐ THE SERIES. T-08 measured the corpus's plot rows on hf72 and hf56: adjacent
          // plots in one series share their widths to within ±20–40%, NEVER exactly. So the
          // series takes ONE amplitude (a tight row or a loose one — a laid-out borough rank
          // against an accreted one) and every plot in it varies inside that, then the whole
          // row is NORMALISED back onto the span so the last plot ends where the block does.
          const spanKey = `${organism.key}|${r}|${c}|${rank}|${Math.round(spanA * 8)}`;
          const alleyW = web.widths.crossAlley;
          let n = Math.round((spanB - spanA) / frontage);
          if (n < 1) { if (spanB - spanA >= frontage * 0.62) n = 1; else continue; }
          let alleysHere = sinceAlley + n > alleyEvery ? Math.floor((sinceAlley + n - 1) / alleyEvery) : 0;
          let usable = (spanB - spanA) - alleysHere * alleyW;
          if (usable < frontage * 0.62) { alleysHere = 0; usable = spanB - spanA; }
          n = Math.max(1, Math.round(usable / frontage));
          // The amplitude of THIS row, and the per-plot draws inside it.
          const amp = 0.20 + hashUnit(`${spanKey}|amp`) * 0.20;
          /** @type {number[]} */ const draws = [];
          let sum = 0;
          for (let j = 0; j < n; j++) {
            const d = 1 + (hashUnit(`${spanKey}|w|${j}`) - 0.5) * 2 * amp;
            draws.push(d); sum += d;
          }
          const unit = usable / sum;                      // fits the span EXACTLY
          let u = spanA;
          let placed = 0;
          for (let j = 0; j < n; j++) {
          const w = draws[j] * unit;

          // ⚠ THE ALLEY DOES NOT CONSUME A PLOT ANY MORE, AND THE FIRST SPELLING'S `continue`
          // WAS A SILENT SUBTRACTION. `usable` above already deducted every alley this span
          // will carry, so the row's widths are computed on the ground the plots actually
          // get; taking a `j` for the alley as well would delete one house per alley — the
          // §17.6 register quietly costing the census a building at every ginnel.
          if (placed > 0 && sinceAlley >= alleyEvery && alleysHere > 0) {
            // The alley IS the gap. It also ENDS the block run — that is what an alley does
            // to a block. ⭐ AND IT IS A STREET, so it is RECORDED as one: an alley the web
            // knows about is the way to the back yards, and it is what makes a long rank read
            // as many holdings instead of as corduroy. It is emitted only where a run was
            // actually open — an alley beside nothing is not a way anywhere.
            const hadRun = !!run;
            const alleyDepth = run ? run.depth : plotDepth;
            closeRun();
            if (hadRun) {
              alleys.push({
                key: `alley.${organism.key}|${r}|${c}|${rank}|${plotIndex}`,
                organismKey: organism.key,
                line: [
                  toWorld(u + alleyW * 0.5, frontV),
                  toWorld(u + alleyW * 0.5, frontV + dir * alleyDepth),
                ],
              });
            }
            u += alleyW;
            alleysHere--;
            sinceAlley = 0;
          }

          const key = parcelKey(organism.key, r * cols + c, plotIndex, rank);

          // ── DEPTH VARIANCE (§160.2): each plot's back boundary is its own, and the
          //    SPREAD is the tier's (see buildOutRung.depthJitter).
          const dJit = (1 - rung.depthJitter / 2) + hashUnit(`${key}|d`) * rung.depthJitter;
          const depth = plotDepth * dJit;
          // ── THE YARD: the back share is open ground, not building. The share is the
          //    TIER'S OWN (a city core's yards were built over; a village's crofts were not).
          // §10.A3: a wealthy ward keeps its garden; a poor one builds over it.
          const built = depth * (1 - Math.min(0.92, rung.yardShare * grain.yard) * (0.78 + hashUnit(`${key}|y`) * 0.44));
          // ── GABLE-END BREAK + FRONT SETBACK (§160.2).
          const gable = hashUnit(`${key}|g`) < PLOT_SHAPE.gableOdds;
          // ⛔ BACKWARD-ONLY (§17.4, chair directive ODQ §190a). MF-B3's spelling was
          // `(hash − 0.35)`, so 35% of plots sat FORWARD of their own frontage line and
          // stood in the carriageway by construction. §11.2's ENCROACHMENT is a deliberate,
          // seeded, EVENT-DATED chaos drift — it is never packer output, and a jitter that
          // produces it by accident makes the deliberate mark unreadable as well as breaking
          // the right of way. A plot may SET BACK from the street; it may never advance into
          // it. ⭐ THE CLASS: a signed jitter on a quantity with a LEGAL SIDE is a law
          // violation half the time.
          // ⭐⭐⭐ T-08: **THE BUILDING TOUCHES THE STREET LINE.** MF-S1's strongest single
          // structural finding is that the continuous frontage line — a range whose front
          // walls all stand ON the street — is the most-repeated structure in the corpus (13
          // of 49 plates) and the thing b6 most conspicuously lacked. A setback drawn on
          // EVERY plot dissolves exactly that line: the ranks read as a scatter of similar
          // rectangles standing near a road rather than as a street with walls.
          // ⭐ SO THE SETBACK IS NOW THE EXCEPTION IT WAS IN THE RECORD. A minority of
          // holdings stand back — the house behind its forecourt, the one rebuilt after the
          // widening — and the rest are flush. The roll is the plot's own, so a range is
          // flush for six holdings and then breaks, which is what a real frontage does.
          const setsBack = hashUnit(`${key}|sb`) < PLOT_SHAPE.setbackOdds;
          const setback = setsBack ? (0.35 + hashUnit(`${key}|s`) * 0.65) * frontage * PLOT_SHAPE.frontJitter : 0;

          // ── §17.6 THE GAP DECISION FOR THIS PLOT'S LEFT BOUNDARY. Every gap on the leaf
          //    is one of these five, and a gap with no reason is not drawn. The decision is
          //    taken ONCE per boundary and belongs to the plot on its right, so two
          //    neighbours can never disagree about the wall between them.
          const gapCall = decideGap({
            key,
            frontage,
            wealth: organism.wealth,
            // ⭐⭐ §18.1 THE PRECINCT'S OWN ORDER, where one is bound. This ONE substitution is
            // the district-scale lawfulness inversion: inside a close the grain tightens, inside
            // a liberty it loosens, and the reader sees a jurisdiction without being told there
            // is one. See organisms.derivePrecincts.
            lawfulness: organism.precinct ? organism.precinct.order : morphology.civicOrder,
            slopeAcross, needsAccess: depth > frontage * 1.6, sincePassage,
            extentTier: (args.tierScale && args.tierScale.extentTier) || null,
          });
          // ⚠ `sincePassage` ONLY MOVES WHEN A PLOT IS ACTUALLY BUILT — see the emission at
          // the accept point below. A boundary decided on a candidate the culls then refused
          // is a decision about a house that does not exist.
          const gap = Math.max(0.12, gapCall.width);
          const bU0 = u + gap, bU1 = u + w;
          // ⚠ THE FRONT WALL SITS ON THE FRONTAGE LINE. It used to start `gap × 0.4` behind
          // it — a sixth of a frontage of paper between the range and its own street, on
          // every plot in the town — which is the frontage line dissolved by a rounding
          // allowance. §17.4 says facades sit ON the street line and that is how a street
          // gets its walls.
          const bV0 = frontV + dir * setback;
          const bV1 = frontV + dir * (built + setback);
          const yardV1 = frontV + dir * depth;

          // ── THE REAR WING (the L-jog). Wide enough to carry one, and the roll fired.
          const wing = !gable
            && w >= frontage * 0.86
            && hashUnit(`${key}|wing`) < PLOT_SHAPE.wingOdds;
          // Which side the wing runs down — its own hash, so a rank alternates the way a
          // real street does rather than combing every wing to one side.
          const wingRight = hashUnit(`${key}|wingside`) < 0.5;
          const wingU = (bU1 - bU0) * PLOT_SHAPE.wingShare;
          const wingV1 = frontV + dir * (built * (1 + PLOT_SHAPE.wingDepth) + setback);

          let poly;
          if (gable) {
            // A gable-end plot presents its NARROW face: the building runs deeper and
            // thinner within the same frontage, and the neighbours' rhythm breaks.
            poly = quad(bU0 + w * 0.16, bV0, bU1 - w * 0.16, frontV + dir * (built * 1.34 + setback));
          } else if (wing) {
            // Six points, walked so the ring stays simple: street range across the full
            // frontage, then the wing running back down one side of the yard.
            const wU0 = wingRight ? bU1 - wingU : bU0;
            const wU1 = wingRight ? bU1 : bU0 + wingU;
            poly = wingRight
              ? [toWorld(bU0, bV0), toWorld(bU1, bV0), toWorld(wU1, wingV1), toWorld(wU0, wingV1), toWorld(wU0, bV1), toWorld(bU0, bV1)]
              : [toWorld(bU0, bV0), toWorld(bU1, bV0), toWorld(bU1, bV1), toWorld(wU1, bV1), toWorld(wU1, wingV1), toWorld(wU0, wingV1)];
          } else {
            poly = quad(bU0, bV0, bU1, bV1);
          }

          // ⚠ THE CENTRE IS THE POLYGON'S OWN CENTROID, NOT THE DIAGONAL MIDPOINT. An L
          // plan's [0] and [2] corners are two ends of the street range, so the old
          // shorthand put an L-plot's centre on its front wall — and EVERY downstream cull
          // (the ragged edge, the forbidden ground, the partition owner, the terrain
          // refusals) tests that point. A building would have been kept or dropped on the
          // strength of ground it does not stand on.
          const c0 = centroid(poly);
          const cx = c0[0], cy = c0[1];
          const uStart = u;
          plotIndex++;
          sinceAlley++;
          u += w;

          // ── THE CULLS, in cheapest-first order. Each one is a law. ⚠ A CULL ALSO BREAKS
          //    THE BLOCK RUN: ground the fabric refused is not block ground, and a run that
          //    spanned the refusal would put urban tone over the very cell that said no.
          if (cx < 6 || cy < 6 || cx > VIEW - 6 || cy > VIEW - 6) { closeRun(); continue; }
          if (!insideAny(umbrella.components, cx, cy)) { closeRun(); continue; }  // the ragged edge
          // ⛔⛔ THE CULL TESTS THE BUILDING'S BODY, NOT ITS CENTRE (§17.4, chair directive
          // ODQ §190a). MF-B3 asked the forbidden predicate about the plot's CENTROID, and a
          // burgage plot runs 1.3–2.35 frontages deep — so its corners stand up to ~1.3
          // frontages from that point and a plot whose CENTRE cleared a carriageway by half
          // a width still put its front wall a plot-depth into the road. MEASURED before the
          // correction: about half of every urban leaf's footprints stood inside a drawn
          // carriageway, penetrating up to 6.5 view units.
          // ⭐ THE CLASS, and it is the one this pair of directives is really about: A
          // PREDICATE ABOUT GROUND, ASKED AT A POINT, IS NOT A PREDICATE ABOUT A BUILDING.
          // ⚠ The corners are tested TOO, not INSTEAD: the centre cull is cheapest and kills
          // most candidates, so it stays first and the body test only runs on survivors.
          if (forbidden(cx, cy)) { closeRun(); continue; }            // streets, squares, greens, water
          {
            let inClaim = false;
            for (let ci = 0; ci < poly.length; ci++) {
              if (forbidden(poly[ci][0], poly[ci][1])) { inClaim = true; break; }
            }
            if (inClaim) { closeRun(); continue; }
          }
          if (ownerAt(partition, cx, cy) !== orgIndex) { closeRun(); continue; }  // the partition is disjoint
          if (!buildableAt(sub, cx, cy)) { closeRun(); continue; }   // terrain disposes (§5 W1 exit 2)
          if (isSliver(poly, SLIVER_FLOOR)) { closeRun(); continue; }

          // ── §161e.3 PARCEL-GRAIN DITHERING.
          const sample = sampleFields(organisms, cx, cy);
          const dither = ditherCharacter(key, sample, organisms);

          // Decline is written in FABRIC, not in a colour wash: a derelict plot is a
          // ROOFLESS SHELL — its wall lines survive and its roof does not.
          const derelictOdds = prosperityRank <= 1 ? 0.14 : prosperityRank === 2 ? 0.05 : 0.015;

          // ⭐⭐ THE BACK-HOUSE (§181.2a) — the workshop, stable or brewhouse at the REAR
          // of the yard, and the historically right way to fill a block. `PLOT_SHAPE.backOdds`
          // has been declared since MF-A3 and drawn nothing; this is the lever MF-B1b named
          // as the cure for the density gap and held for a chair ruling, now taken.
          //
          // ⚠ IT IS AN OUTBUILDING ON ITS PLOT, NOT A SECOND PARCEL, and that distinction is
          // a TRUTH obligation rather than a bookkeeping one. At the census tiers the parcel
          // count IS the household count; emitting the barn as a parcel would inflate the
          // census by a third and make the 1:1 claim false while the drawing looked better.
          // A back-house belongs to the tenement in front of it, exactly as it did in law.
          //
          // It is refused where the wing already runs down the yard past the halfway point:
          // a plot has ONE yard, and drawing a barn through a kitchen wing is a draughting
          // error the ink pass would put a hard line straight through.
          const yardDepth = Math.abs(yardV1 - bV1);
          const wingRun = wing ? built * PLOT_SHAPE.wingDepth : 0;
          const backRoom = yardDepth - wingRun;
          /** @type {Array<[number,number]>|null} */
          let backHouse = null;
          let backV0 = yardV1;
          if (!gable && backRoom > frontage * 0.40
            && hashUnit(`${key}|back`) < Math.min(0.95, rung.backOdds * grain.back)) {
            // The back range runs across the plot's full width at the bottom of the yard,
            // its depth a share of the room left — deeper where the roll is generous.
            const bd = backRoom * (rung.backDepth * (0.80 + hashUnit(`${key}|backd`) * 0.40));
            backV0 = frontV + dir * (depth - bd);
            const bq = quad(bU0, backV0, bU1, yardV1);
            if (!isSliver(bq, SLIVER_FLOOR)) backHouse = bq; else backV0 = yardV1;
          }

          /** @type {Array<[number,number]>|null} */
          let yard = null;
          if (!gable && Math.abs(backV0 - bV1) > frontage * 0.30) {
            // The wing occupies one side of the yard, so the open ground is what is left
            // beside it — a yard drawn over its own building's wing is a drafting error
            // the ink pass would put a line straight through. The yard now also stops at
            // the back-house's front wall rather than running under it.
            const yq = wing
              ? (wingRight ? quad(bU0, bV1, bU1 - wingU, backV0) : quad(bU0 + wingU, bV1, bU1, backV0))
              : quad(bU0, bV1, bU1, backV0);
            if (!isSliver(yq, 0.05)) yard = yq;
          }

          // ⭐⭐ §17.6 THE GAP IS EMITTED AT THE ACCEPT POINT, NOT AT THE DECISION POINT, and
          //    the first spelling got this wrong with a measurable cost. The decision is
          //    taken while the candidate is still a candidate; the culls then refuse most of
          //    them (terrain, the ragged edge, the right of way), and emitting there gave a
          //    CITY 6,068 through-passages against 923 houses — passages between buildings
          //    that were never built. ⭐ THE CLASS: a fact about the relationship between two
          //    things may only be recorded once BOTH of them exist.
          if (gapCall.kind === 'passage') {
            passages.push({
              key: `passage.${key}`,
              organismKey: organism.key,
              reason: gapCall.reason,
              width: gapCall.width,
              line: [toWorld(uStart + gap * 0.5, frontV), toWorld(uStart + gap * 0.5, frontV + dir * depth)],
            });
            sincePassage = 0;
          } else {
            if (gapCall.kind === 'slot') {
              slots.push({ key: `slot.${key}`, reason: gapCall.reason, width: gapCall.width });
            }
            sincePassage++;
          }
          parcels.push({
            key,
            polygon: poly,
            yard,
            backHouse,
            wing,
            center: [cx, cy],
            // ⛔⛔ ATTRIBUTION FOLLOWS THE PARTITION; CHARACTER FOLLOWS THE FIELDS. MF-B1 set
            // `organismKey` from the DITHER — i.e. from whichever influence field happened to
            // be strongest over the parcel — so a plot standing squarely inside one quarter's
            // own click region was filed under a neighbour whose halo reached further. That is
            // two different answers to "whose ground is this?", which is exactly what §5.0c.5d
            // exists to forbid, and it broke §161e.1 silently: the city's religious quarter
            // showed 0 parcels and 0 dwellings while owning 328 partition cells, because every
            // building on its ground had been filed under the shadows district. The dwelling
            // GUARANTEE could not save it either — it converts a parcel belonging to the
            // organism, and by that count the organism had none to convert.
            //
            // The parcel already passed the `ownerAt(partition) === orgIndex` cull above, so
            // the partition's answer is in hand and it is the one the truth layer uses. The
            // dither keeps what it is for — the flat CHARACTER, the era-legal way an overlap
            // renders — and `characterFrom` records which field supplied it, so the mixing is
            // still legible without a second opinion about ownership.
            organismKey: organism.key,
            characterFrom: dither.organism ? dither.organism.key : null,
            character: dither.character,
            matrix: dither.matrix,
            area: absArea(poly),
            // §10.A3 THE WARD'S OWN WEALTH, carried to the ink: the material wash and a
            // tone bias, both per-parcel so the ward reads as patchy rather than zoned.
            wealth: String(organism.wealth || 'modest'),
            material: plotMaterial(organism.wealth, prosperityRank, key),
            tone: hashUnit(`${key}|t`),
            derelict: hashUnit(`${key}|x`) < derelictOdds,
            gable,
            grainAngle: organism.grainAngle,
            // ⭐⭐⭐ T-08 THE PLOT-SERIES BOUNDARY — THE TOFT LINE, AND IT IS THE GRAIN.
            //
            // ⛔ WHAT WAS MISSING AND WHY IT MATTERED MORE THAN IT LOOKS. §2.3.2's measured
            // weight ladder carries a rung the fabric never drew: PLOT-BOUNDARY TICK at
            // 0.4–0.6 of the fabric weight (hf35, hf56 native crops). Without it a plot is
            // legible only where a BUILDING stands, so the module count a reader can see is
            // the BUILDING count — and a burgage row is mostly toft. hf3 draws its garden
            // strips separated by tenure lines and hf10 its fenced kitchen-garden
            // rectangles: in the corpus the plot series carries the grain wherever the
            // buildings thin out, which is everywhere below town.
            // ⭐ ONE TWO-POINT LINE PER PLOT, from the street line to the plot's own back
            // boundary, at the plot's own side. It is the cheapest mark on the leaf and it
            // is the one that makes the settlement read as HOLDINGS.
            plotLine: [toWorld(uStart + gap * 0.5, frontV), toWorld(uStart + gap * 0.5, frontV + dir * depth)],
            // The back boundary of this holding, so the drawing can close the series with
            // the rear lane the tofts back onto (the block's own back line, per plot).
            plotBack: [toWorld(uStart + gap * 0.5, frontV + dir * depth), toWorld(u + w, frontV + dir * depth)],
          });

          // ── THE RUN EXTENDS. The block's ground reaches to this plot's back boundary —
          //    its own, not the grid's, so the block's rear edge is as ragged as the
          //    ownership behind it was.
          if (!run) { run = { u0: uStart, u1: uStart + w, depth, n: 1, id: blocks.length }; }
          else { run.u1 = uStart + w; run.depth = Math.max(run.depth, depth); run.n++; }
          // The parcel remembers which block run it belongs to — the LOD merge below needs
          // to know which buildings share a block before it may fuse any of them.
          parcels[parcels.length - 1].blockRun = `${organism.key}|${r}|${c}|${rank}|${runSerial}`;
          placed++;
          }
          closeRun();                                // the span ended
        }
      }
      void parcelsBefore;
    }
  }
  void rng; void water; void offsetPolygonOutward;
  return { parcels, blocks, alleys, passages, slots };
}

/**
 * ⭐⭐⭐ THE LEVEL-OF-DETAIL MERGE (§181.2a, chair order) — WHAT FUNDS THE BUILD-OUT.
 *
 * Filling the blocks to hf30's density costs ONE PRIMITIVE PER BACK-HOUSE, and city and
 * metropolis were already at the op ceiling. MF-B1b named this exact lever and did not
 * pull it: "merge the residential-matrix buildings into block masses at overview zoom — a
 * true LOD, era-legal at that scale, and a change to what is DRAWN rather than to how it
 * is emitted."
 *
 * ⭐ IT IS ERA-LEGAL, AND THAT IS NOT A CONVENIENCE ARGUMENT. Look at hf30's outer wards:
 * the surveyor did not draw four hundred separate houses on the far side of the river, he
 * drew the BLOCK MASSES with a party-wall tick here and there. A pre-industrial plan at
 * overview scale renders distant ordinary fabric as continuous built ground, because that
 * is what it looks like and because ink is finite. The convention is the reference's own.
 *
 * ⛔⛔ AND IT MOVES A PRINTED PROMISE, SO IT MOVES IT HONESTLY. The cartouche prints
 * "FABRIC 1 : N HOUSEHOLDS (REPRESENTATIVE)", and N is households ÷ DRAWN SHAPES. Merging
 * eight houses into one mass makes that ratio eight times coarser THERE, so the printed
 * ratio must be recomputed from what is actually drawn — never left at the pre-merge
 * figure. `drawnShapes` below is that denominator, and the lens reads it rather than the
 * parcel count. A representativeness claim that does not track the drawing is the one kind
 * of dishonesty this whole family exists to refuse.
 *
 * ⛔ AND THE FIRST SPELLING OF THE GROUPING KEY WAS WRONG IN A WAY WORTH RECORDING. It
 * merged only parcels flagged `matrix` with character 'residential' — "the residential
 * matrix", read literally off MF-B1b's sentence. MEASURED: that is **185 of 848** parcels
 * at city, because §161e.3's dither gives most parcels their quarter's own character; the
 * merge found 7 masses and saved 34 primitives out of a 360-primitive overrun. ⭐ THE
 * CLASS: `matrix` and `character` answer two different questions — "is this anonymous
 * fabric?" and "what trade is on this street?" — and every ordinary parcel is anonymous
 * whatever tone the dither gave it. The landmarks are a SEPARATE record; a parcel is by
 * construction not one. So the run groups by (block run, CHARACTER), which keeps the
 * character mixing visible at LOD — a mass of craft fabric is still tinted craft — while
 * merging the fabric that is genuinely interchangeable at that zoom.
 *
 * WHAT IS NEVER MERGED, each for a reason that is about truth rather than pixels:
 *   • DERELICT plots — a roofless shell is §7's decline grammar speaking;
 *   • plots inside the LOD radius, which is where a reader looks first;
 *   • runs shorter than the floor: fusing two houses saves one op and loses a building;
 *   • anything at a census tier — merging there would destroy the 1:1 claim outright.
 *
 * @param {Object} args
 * @returns {{ masses: Array<any>, mergedKeys: Set<string>, drawnShapes: number, reason: string }}
 */
export function mergeDistantMatrix(args) {
  const { parcels, centre, tierScale: scale } = args;
  const rung = LOD_RUNG[scale.tier];
  // ⛔⛔ THE RATIO'S DENOMINATOR IS DWELLING SHAPES, NOT DRAWN POLYGONS — and getting this
  // wrong produced a PRINTED FALSEHOOD of exactly the kind §5's legend law exists to
  // forbid. The cartouche says "FABRIC 1 : N HOUSEHOLDS": each drawn BUILDING stands for N
  // households. A BACK-HOUSE is an outbuilding on a tenement that already has a street
  // range — it houses nobody new — so counting it made the town print **1 : 0.92**, i.e.
  // "each building represents less than one household", which is not a coarser drawing but
  // an incoherent claim. ⭐ THE CLASS: when a printed ratio counts SHAPES, every shape it
  // counts must be an instance of the thing the ratio names.
  const drawnAll = () => parcels.length;
  if (!rung) {
    return {
      masses: [], mergedKeys: new Set(), drawnShapes: drawnAll(),
      reason: `no LOD at ${scale.tier}: every building is drawn as itself`,
    };
  }

  const inner = scale.builtRadius * rung.radius;
  /** @type {Map<string, any[]>} */ const byRun = new Map();
  for (const p of parcels) {
    if (!p.blockRun || p.derelict) continue;
    const dx = p.center[0] - centre.x, dy = p.center[1] - centre.y;
    if (Math.sqrt(dx * dx + dy * dy) < inner) continue;
    const groupKey = `${p.blockRun}|${p.character}`;
    const bucket = byRun.get(groupKey);
    if (bucket) bucket.push(p); else byRun.set(groupKey, [p]);
  }

  /** @type {Array<any>} */ const masses = [];
  const mergedKeys = new Set();
  for (const runKey of [...byRun.keys()].sort(compareKeys)) {
    const group = byRun.get(runKey).slice().sort((a, b) => compareKeys(a.key, b.key));
    if (group.length < rung.floor) continue;
    // ⚠ THE MASS IS CAPPED, because an uncapped one stops being a block mass and becomes a
    // WAREHOUSE. A fused run of fourteen houses draws as one enormous solid slab, which at
    // plan scale reads as a single great building — a truth error, not a style one: the
    // reader would take a residential rank for a monumental. Chunking at the cap keeps the
    // party-wall breaks that say "this is many houses" while still paying the op budget.
    for (let start = 0; start < group.length; start += MASS_CAP) {
      const chunk = group.slice(start, start + MASS_CAP);
      if (chunk.length < rung.floor) break;          // the tail is drawn as itself
      /** @type {Array<[number,number]>} */ const pts = [];
      for (const p of chunk) {
        for (const q of p.polygon) pts.push(q);
        if (p.backHouse) for (const q of p.backHouse) pts.push(q);
      }
      const hull = convexHull(pts);
      if (hull.length < 3) continue;
      masses.push({
        key: `mass.${runKey}#${start}`,
        polygon: hull,
        count: chunk.length,
        organismKey: chunk[0].organismKey,
        character: chunk[0].character,
        // ⚠ THE MASS TAKES ITS CHUNK'S MODAL MATERIAL, not its first roof's and not a new
        // one. A mass is ONE drawn roof, so it must be an instance of a real material —
        // the same law the character key already obeys and the same law that forbade
        // counting back-houses in the printed ratio. ⛔ AND IT MUST NOT BE THE GROUPING KEY:
        // splitting the runs by material as well cut the merge rate hard enough to put the
        // city and the fjord back OVER the ceiling (MEASURED: 2,254 and 2,352). The modal
        // reading keeps the merge and keeps the claim.
        // The members, so §17's enforcement can UN-MERGE a mass whose hull would overprint a
        // standing building (see groundLaw's mass pre-pass): the LOD is an optimization and
        // it gives way to the specific truth rather than covering it.
        memberKeys: chunk.map((q) => q.key),
        // ⭐⭐⭐ THE MASS KEEPS ITS INTERNAL STRUCTURE, AND THAT IS WHAT SEPARATES AN HONEST
        // LOD FROM THE CORPUS'S OWN WORST DEFECT. MF-S1's banned prior #4 is "empty blocks /
        // block-wash LOD — block outlines with no fabric inside" (hf25 loses two thirds of
        // its town that way, hf34 its northern wards), and the atlas warns in terms that the
        // op budget will tempt us into exactly it. hf60 shows the right answer: "blocks are
        // tan masses SUBDIVIDED BY VISIBLE PARTY-WALL LINES into individual units — the best
        // legible compromise between mass and detail."
        // ⭐ So a mass carries the plot lines of every holding it fused. It costs ONE
        // primitive per member against the THREE the members cost drawn separately (fill,
        // back-house, plot line) — the LOD still pays, and the reader still counts the
        // houses. Aggregation, never hollowing.
        unitLines: chunk.map((q) => q.plotLine).filter((l) => l && l.length === 2),
        material: modalKey(chunk.map((q) => q.material)),
        wealth: modalKey(chunk.map((q) => q.wealth)),
        grainAngle: chunk[0].grainAngle,
        // The mass carries the MEAN tone of what it replaced, so the fabric's value spread
        // does not collapse to one flat field at the edges.
        tone: chunk.reduce((s, p) => s + p.tone, 0) / chunk.length,
      });
      for (const p of chunk) mergedKeys.add(p.key);
    }
  }

  let drawn = 0;
  for (const p of parcels) if (!mergedKeys.has(p.key)) drawn++;
  drawn += masses.length;                          // a mass is ONE drawn building
  return {
    masses,
    mergedKeys,
    drawnShapes: drawn,
    reason: masses.length
      ? `LOD at ${scale.tier}: ${mergedKeys.size} matrix buildings beyond ${Math.round(inner)}u merged into ${masses.length} block masses (era-legal overview convention); the printed representativeness ratio is recomputed on ${drawn} drawn shapes`
      : `LOD armed at ${scale.tier} but no run reached the floor of ${rung.floor} — nothing merged`,
  };
}

/**
 * WHERE THE LOD BITES. §42/§43 VALUES, PROPOSED-WITH-RATIONALE.
 *  radius  how far out, as a share of the built radius, before merging begins. Inside it
 *          the reader is looking at individual buildings and must get them.
 *  floor   the shortest run that may fuse.
 * Only city and metropolis have rows: below that the fabric is small enough to draw whole,
 * and at the census tiers merging would destroy the 1:1 claim outright.
 * ⚠ UNSOAKED; rides the tuning signature.
 * @type {Readonly<Record<string, { radius:number, floor:number }>>}
 */
/** The longest run one LOD mass may fuse. See the note at its use. */
export const MASS_CAP = 4;

export const LOD_RUNG = Object.freeze({
  // ⭐ THE TOWN'S RUNG IS DELIBERATELY THE LIGHTEST TOUCH THAT WORKS: a far radius and a
  // longer floor, so only the outer fringe fuses and the town still reads as a place where
  // you can count the houses. §5's representative law begins at town, so the LOD is legal
  // here; the tier's own character is that it is still nearly countable, and the rung says so.
  // ⚠ RE-MEASURED AT MF-B4, AND THE REASON IS THAT THE FABRIC GOT DENSER. The module
  // correction (see streets.ladderWidths) roughly doubled the built share of every urban
  // leaf — the city went from 15% of its umbrella built to 29% on the same denominator —
  // so the same rung now leaves 90 more drawn shapes than it did, and the city and the
  // fjord finished 27 and 2 primitives OVER the 2,200 ceiling. The rung is the reference's
  // own overview convention and it is the correct place to pay: a denser town merges its
  // distant matrix EARLIER, exactly as hf30 does. The radii tighten by one step; nothing
  // else in the ink is cut, and the printed representativeness ratio follows the drawn
  // shapes automatically because it is recomputed on them (§181.2a).
  // ⛔ THE METROPOLIS RUNG WAS OPENED TO 0.62 AT MF-B6 AND THE CHANGE WAS REVERTED, MEASURED.
  // The build-out band's first suspect was the LOD — a merged run counts as ZERO parcel area
  // in the census while the leaf plainly draws it — and the metropolis has the corpus's
  // largest op headroom to spend on un-merging. MEASURED: opening the radius from 0.44 to
  // 0.62 moved the merge from 106 buildings to 102 and the drawn-shape count from 680 to
  // 702 — 22 buildings for 4 primitives, and the parcel share of the umbrella by 0.2 of a
  // point. ⭐ THE REASON IS THAT THE GROUND LAW GOT THERE FIRST: its mass pre-pass already
  // UN-MERGES any mass whose hull would overprint a standing building, so by the time the
  // leaf is drawn the LOD's reach is nearly spent whatever radius it started from. A dial
  // downstream of a law that overrides it is not a dial.
  // ⚠ RE-OPENED AT MF-B8, AND THIS TIME THE LOD PAYS BECAUSE THE MASS KEEPS ITS STRUCTURE.
  // MF-B6 tried opening the metropolis radius and reverted it, measured: the ground law's
  // mass pre-pass UN-MERGES any mass that would overprint a standing building, so the reach
  // was nearly spent whatever radius it started from. What changed is the OTHER side of the
  // trade: a mass now carries its members' plot lines (see `unitLines`), so merging costs the
  // reader nothing — the holdings are still counted — while it converts THREE primitives per
  // building (fill, back-house, plot line) into ONE. That is the §217 grant's "efficiency
  // first" applied where it does not cost fabric.
  // ⚠⚠ RE-OPENED AT MF-B8 AND REVERTED AGAIN, MEASURED — AND THE MEASUREMENT IS THE §217
  // GRANT'S "EFFICIENCY FIRST" DISCHARGED RATHER THAN ASSERTED. The trade looked good on
  // paper: a mass now carries its members' plot lines (`unitLines`), so merging costs the
  // reader nothing while converting THREE primitives per building (fill, back-house, plot
  // line) into ONE. MEASURED at metropolis with the radius opened 0.44 → 0.34 and MASS_CAP
  // 4 → 6: **9,403 → 9,345 primitives, a saving of 58 (0.6%)**, while the city lost 93
  // parcels and a point of measured grain. ⭐ THE REASON IS MF-B6's, UNCHANGED AND NOW
  // CONFIRMED FROM THE OTHER DIRECTION: the ground law's mass pre-pass UN-MERGES any mass
  // that would overprint a standing building, so the LOD's reach is nearly spent whatever
  // radius it starts from. **A DIAL DOWNSTREAM OF A LAW THAT OVERRIDES IT IS NOT A DIAL** —
  // and the op budget therefore has to be found by raising the ceiling, not by merging.
  town: { radius: 0.64, floor: 4 },
  city: { radius: 0.47, floor: 3 },
  metropolis: { radius: 0.44, floor: 3 },
});

/** The most common value in a list, ties broken by sort order so the answer is stable. */
function modalKey(list) {
  /** @type {Map<string, number>} */ const counts = new Map();
  for (const v of list) counts.set(v, (counts.get(v) || 0) + 1);
  let best = null, bestN = -1;
  for (const k of [...counts.keys()].sort(compareKeys)) {
    const n = counts.get(k);
    if (n > bestN) { bestN = n; best = k; }
  }
  return best;
}

/** How many plots run before a cross-alley breaks the rank — hashed per rank, so the
 * interval varies across the town the way real back-lanes do. */
function CROSS_ALLEY_SPAN(orgKey, r, c, rank) {
  const [lo, hi] = [4, 9];
  return lo + Math.floor(hashUnit(`${orgKey}|alley|${r}|${c}|${rank}`) * (hi - lo + 1));
}

/**
 * ⭐ §161e.1's LAST RESORT: one dwelling for a quarter the packer left empty. It walks a
 * fixed spiral of rings out from the organism's own anchor and takes the first point every
 * cull would have accepted — the same culls, in the same order, so the plant can never
 * stand anywhere an ordinary plot could not. Returns null when the quarter's ground truly
 * admits nothing, which is then a REPORTED fact rather than a silent absence.
 */
function plantDwelling(organism, args, frontage, forbidden) {
  const { partition, umbrella, sub, organisms } = args;
  const orgIndex = organisms.slice().sort((a, b) => compareKeys(a.key, b.key)).indexOf(organism);
  const ux = cosI(organism.grainAngle), uy = sinI(organism.grainAngle);
  const vx = -uy, vy = ux;
  const w = frontage * 0.86, d = frontage * 0.86;
  // ⛔⛔ A SPIRAL OVER A CONTINUUM IS A SAMPLE, AND A SAMPLE CAN MISS. The first spelling
  // walked concentric rings of sample points out from the anchor; MEASURED, it returned
  // null on a quarter that owns 327 partition cells, because the admissible ground was a
  // band the ring radii stepped over. ⭐ THE CLASS: when the ground you are searching is
  // already enumerated somewhere, SEARCH THE ENUMERATION. The partition IS the list of
  // cells this quarter owns, so the walk is over that list — complete by construction,
  // ordered nearest-first so the plant lands at the quarter's heart rather than its corner,
  // and index-tie-broken so it is byte-stable.
  const P = partition;
  /** @type {Array<{x:number,y:number,d:number,k:number}>} */ const cells = [];
  for (let j = 0; j < P.n; j++) {
    for (let i = 0; i < P.n; i++) {
      const k = j * P.n + i;
      if (P.inside[k] !== 1 || P.owner[k] !== orgIndex) continue;
      const cx = (i + 0.5) * P.cell, cy = (j + 0.5) * P.cell;
      const dx = cx - organism.anchor.x, dy = cy - organism.anchor.y;
      cells.push({ x: cx, y: cy, d: dx * dx + dy * dy, k });
    }
  }
  cells.sort((p, q) => (p.d - q.d) || (p.k - q.k));
  {
    for (const c of cells) {
      const cx = c.x, cy = c.y;
      if (cx < 6 || cy < 6 || cx > VIEW - 6 || cy > VIEW - 6) continue;
      if (!insideAny(umbrella.components, cx, cy)) continue;
      if (forbidden(cx, cy)) continue;
      if (ownerAt(partition, cx, cy) !== orgIndex) continue;
      if (!buildableAt(sub, cx, cy)) continue;                      // terrain disposes (§5 W1 exit 2)
      const key = parcelKey(organism.key, 9999, 0, 0);
      const poly = [
        [cx - (ux * w + vx * d) / 2, cy - (uy * w + vy * d) / 2],
        [cx + (ux * w - vx * d) / 2, cy + (uy * w - vy * d) / 2],
        [cx + (ux * w + vx * d) / 2, cy + (uy * w + vy * d) / 2],
        [cx - (ux * w - vx * d) / 2, cy - (uy * w - vy * d) / 2],
      ];
      return {
        key,
        polygon: poly,
        yard: null,
        backHouse: null,
        wing: false,
        center: [cx, cy],
        organismKey: organism.key,
        characterFrom: organism.key,
        character: 'residential',
        matrix: true,
        area: absArea(poly),
        wealth: String(organism.wealth || 'modest'),
        material: plotMaterial(organism.wealth, 2, key),
        tone: hashUnit(`${key}|t`),
        derelict: false,
        gable: false,
        grainAngle: organism.grainAngle,
        planted: true,
      };
    }
  }
  return null;
}

/** Is a point inside any umbrella component?
 * ⚠ INDEXED, not merely bbox-guarded (MF-B4). It runs once per candidate plot — and after
 * the module correction that is roughly five times as many candidates as MF-B3 measured,
 * against organic rings of hundreds of vertices. `ringIndex` is EXACT (see its header): an
 * edge that does not span the query's y cannot change the crossing parity. Profiled at
 * 779 ms of a 4.8 s city build before the index. The cache is keyed on the component ARRAY
 * identity, so a rebuilt umbrella gets a rebuilt index. */
const BOX_CACHE = new WeakMap();
function insideAny(components, x, y) {
  let idx = BOX_CACHE.get(components);
  if (!idx) { idx = ringIndex(components); BOX_CACHE.set(components, idx); }
  return idx.contains(x, y);
}


/**
 * Pack every organism, then CALIBRATE the roof count.
 *
 * ⭐ THE TWO-PASS CALIBRATION, carried over from MF-P1 and still necessary: the culls
 * (the ragged edge, the streets, the squares, the terrain, the slivers) remove a share of
 * plots that is NOT analytically predictable from the plot width, because it depends on
 * the shape of the umbrella. So pass 1 measures the yield, and pass 2 repacks at a
 * corrected frontage. Count scales as 1/width², so the correction is a square root.
 *
 * It is DETERMINISTIC because every organism's variation is a hash of its own keys —
 * pass 2 redraws exactly what pass 1 drew, at a different module.
 *
 * @param {Object} args
 * @returns {{ parcels: Parcel[], blocks: Array<Array<[number,number]>>, frontage: number, passes: number }}
 */
export function packFabric(args) {
  const { organisms, tierScale: scale, web } = args;
  const ordered = organisms.slice().sort((a, b) => compareKeys(a.key, b.key));

  // ⭐⭐⭐ THE LADDER IS RE-DERIVED INSIDE THE LOOP (MF-B4). See streets.ladderWidths for the
  // measured 2.2–2.8× module mismatch this closes. `widthsFor` and `forbiddenFor` are the
  // two factories that make the reservation, the paint and the plot ONE module at every
  // pass; a caller that supplies neither gets MF-B3's behaviour exactly, which is what keeps
  // the smaller consumers (and the pins that build a pack directly) working unchanged.
  const widthsFor = args.widthsFor || null;
  const forbiddenFor = args.forbiddenFor || null;
  /** @type {{ web:any, forbidden:Function, forbiddenPhysical:Function }|null} */ let lastFrame = null;
  const frame = (frontage) => {
    if (!widthsFor) {
      return { web: { ...web, plotFrontage: frontage }, forbidden: args.forbidden, forbiddenPhysical: args.forbiddenPhysical };
    }
    const widths = widthsFor(frontage);
    const scaledWeb = { ...web, plotFrontage: frontage, widths };
    const f = forbiddenFor ? forbiddenFor(scaledWeb) : { forbidden: args.forbidden, forbiddenPhysical: args.forbiddenPhysical };
    return { web: scaledWeb, forbidden: f.forbidden, forbiddenPhysical: f.forbiddenPhysical };
  };
  const run = (frontage) => {
    const fr = frame(frontage);
    lastFrame = fr;
    /** @type {Parcel[]} */ const parcels = [];
    /** @type {Array<Array<[number,number]>>} */ const blocks = [];
    /** @type {Array<any>} */ const alleys = [];
    /** @type {Array<any>} */ const passages = [];
    /** @type {Array<any>} */ const slots = [];
    for (const organism of ordered) {
      const got = packOrganism({
        ...args, organism, organisms: ordered, web: fr.web, forbidden: fr.forbidden,
      });
      for (const p of got.parcels) parcels.push(p);
      for (const b of got.blocks) blocks.push(b);
      for (const a of got.alleys) alleys.push(a);
      for (const a of got.passages) passages.push(a);
      for (const a of got.slots) slots.push(a);
    }
    return { parcels, blocks, alleys, passages, slots };
  };

  // THREE passes, a FIXED count — never a loop to a tolerance. A convergence loop would
  // make the parcel count (and therefore every byte downstream) depend on a threshold
  // being met, which is a determinism hazard dressed as an optimisation. Three fixed
  // corrections bring the yield inside about 15% of the target on every tier measured,
  // and the residual is honest: the culls belong to the ground, not to the arithmetic.
  //
  // ⭐⭐ AT THE CENSUS TIERS THE CORRECTION IS BOUNDED, AND THE BOUND IS THE WHOLE POINT
  // OF §181.2b. The extent was derived FROM the module there, so a correction free to move
  // the module by 3× (which is what the unbounded spelling did: a 15-unit village module
  // came back at 8.6) simply re-derives the old sparse leaf through the back door. The
  // clamp is ±20%, and that is not an arbitrary tolerance — it is INSIDE the per-plot
  // frontage jitter the packer already draws (0.74–1.36 of the module), so a corrected
  // module is still a module a surveyor would have recognised. Whatever the culls take
  // beyond it is REPORTED as a census shortfall rather than absorbed silently.
  const moduleFixed = scale && scale.plotModule ? scale.plotModule : 0;
  const bound = moduleFixed
    ? { lo: moduleFixed * 0.80, hi: moduleFixed * 1.20 }
    : { lo: 0, hi: Infinity };
  const clampModule = (v) => (v < bound.lo ? bound.lo : v > bound.hi ? bound.hi : v);
  let frontage = web.plotFrontage;
  let out = run(frontage);
  let passes = 1;
  for (let pass = 0; pass < 3; pass++) {
    if (scale.roofs <= 0) break;
    // ⛔ A ZERO YIELD IS THE ONE CASE THAT MUST NOT GIVE UP, and MF-B1's spelling did
    // exactly that: `if (out.parcels.length === 0) break` treats "nothing fitted" as
    // "nothing to correct", so a settlement one pass away from rendering rendered empty.
    // Zero yield means the module is too big for the ground, which is the correction the
    // loop exists to make — so halve and try again, inside the same FIXED pass count (a
    // convergence loop would make the parcel count depend on a threshold being met, which
    // is a determinism hazard dressed as an optimisation).
    if (out.parcels.length === 0) {
      const halved = clampModule(frontage * 0.5);
      if (halved === frontage) break;                 // already at the module's floor
      frontage = halved;
      out = run(frontage);
      passes++;
      continue;
    }
    const ratio = Math.sqrt(out.parcels.length / scale.roofs);
    const corrected = clampModule(frontage * Math.max(0.30, Math.min(2.6, ratio)));
    if (Math.abs(corrected - frontage) <= frontage * 0.03) break;
    frontage = corrected;
    out = run(frontage);
    passes++;
  }
  // ⭐⭐ THE DWELLING GUARANTEE (§161e.1), MADE STRUCTURAL RATHER THAN HOPED FOR.
  // "A district with no dwellings in it is a rendering bug, not a zone." The dither gives
  // each parcel a matrix chance proportional to the matrix floor's share of the local
  // field total — which is correct on average and says NOTHING about the worst case: a
  // small, strongly-charactered quarter (a compact religious precinct) can draw six
  // parcels and lose the matrix roll on all six. Measured: `org.district.religious_quarter`
  // rendered with zero dwellings, i.e. a church with no parish living around it.
  // So the guarantee is enforced, not sampled: any organism that ends the pack with no
  // residential parcel has its LOWEST-HASHED parcel converted. Lowest-hashed, not first or
  // nearest, so the choice is stable under the inertia law — the same parcel becomes the
  // priest's house in every year that has it.
  const housed = new Set();
  for (const p of out.parcels) if (p.character === 'residential' && p.organismKey) housed.add(p.organismKey);
  const owned = new Set();
  for (const p of out.parcels) if (p.organismKey) owned.add(p.organismKey);
  let planted = 0;
  for (const organism of ordered) {
    if (housed.has(organism.key)) continue;
    let pick = null, best = Infinity;
    for (const p of out.parcels) {
      if (p.organismKey !== organism.key) continue;
      const h = hashUnit(`${p.key}|dwelling-guarantee`);
      if (h < best) { best = h; pick = p; }
    }
    if (pick) { pick.character = 'residential'; pick.matrix = true; continue; }

    // ⛔⛔ THE GUARANTEE HAD A HOLE AND MF-B3's OWN CHANGES FELL THROUGH IT. The conversion
    // above can only re-label a parcel the organism ALREADY HAS; an organism that ended the
    // pack with NONE was left with nothing, and §161e.1 is explicit that "a district with
    // no dwellings in it is a RENDERING BUG, not a zone." MEASURED: with the quarter lanes
    // reserved (§181.3a) and the village green enlarged (§16.4), the city's compact
    // religious quarter lost its last plot and the proof went red.
    // ⭐ THE CLASS: a guarantee expressed as a RE-LABEL is only as strong as the supply it
    // relabels. Made structural, it PLANTS: a walk outward from the organism's own anchor
    // to the first admissible cell, so a quarter always houses somebody. The walk is a
    // fixed spiral over a fixed ring count — bounded, deterministic, and it reports.
    // ⚠ THE GUARANTEE MUST PLANT AGAINST THE LAST PASS'S GROUND, not the first pass's.
    // With the ladder re-derived per pass the forbidden set narrows as the module does, and
    // planting against a stale (wider) reservation would refuse cells the fabric itself
    // ended up building on.
    const liveForbidden = (lastFrame && lastFrame.forbidden) || args.forbidden;
    const livePhysical = (lastFrame && lastFrame.forbiddenPhysical) || args.forbiddenPhysical;
    let planted1 = plantDwelling(organism, args, frontage, liveForbidden);
    if (!planted1 && livePhysical) {
      // ⭐⭐ §11.2's ENCROACHMENT, AS THE LAST RESORT — and it is the charter's own answer
      // rather than a relaxation invented to make a proof pass. MEASURED on the coastal
      // city: the religious quarter held 67 dry cells, of which 26 lay under the market
      // place and 41 under the lanes that converge on the settlement's heart — NOT ONE cell
      // free. A quarter with no room did what every real one did: it built on the street
      // line. The plant is therefore retried against the ABSOLUTES ALONE (water, commons,
      // squares, greens — the things nothing was ever built on), and the house is stamped
      // `encroached` so the leaf can say what it is instead of pretending it is ordinary.
      planted1 = plantDwelling(organism, args, frontage, livePhysical);
      if (planted1) planted1.encroached = true;
    }
    if (planted1) { out.parcels.push(planted1); planted++; }
  }
  void owned;
  return {
    ...out, frontage, passes,
    // ⭐ THE SETTLEMENT'S OWN LADDER, at the module the pack DISCOVERED. Everything that
    // draws a street reads this, never `buildStreetWeb`'s provisional estimate.
    widths: (lastFrame && lastFrame.web && lastFrame.web.widths) || web.widths,
    web: (lastFrame && lastFrame.web) || web,
    forbidden: (lastFrame && lastFrame.forbidden) || args.forbidden,
    // The mismatch this lane closed, REPORTED rather than absorbed: how far the discovered
    // module sits from the estimate the street web was first laid out in.
    moduleDrift: Math.round((frontage / (web.plotFrontage || frontage)) * 1000) / 1000,
    plantedDwellings: planted,
    encroachedDwellings: out.parcels.filter((p) => p.encroached).length,
  };
}

/**
 * ⭐⭐⭐ §10.A3 · THE SHANTY FRINGE — "a SHANTY FRINGE accreting OUTSIDE THE GATES on the
 * poor side WHEN POVERTY AND POPULATION PRESSURE CO-OCCUR."
 *
 * ⭐ THE CO-OCCURRENCE IS THE WHOLE RULE, and it is what keeps this from being decoration.
 * Poverty alone does not build a shanty — a poor village is a village of poor houses, on
 * its own crofts, inside its own hedges. A shanty is what happens when people who cannot
 * afford a plot arrive somewhere that has no plots left: POVERTY × PRESSURE. So the
 * condition reads BOTH — a ward the model calls `poor`, and a pressure signal (that ward's
 * own `lawless`/`unsafe` safety, or a settlement whose prosperity is at the bottom of the
 * engine's own band) — at a tier that HAS an outside-the-gates to sprawl into.
 *
 * ⭐ AND IT IS NOT A DISTRICT. The huts carry no burgage plot, no yard, no block and no
 * rank: they are a scatter along the road, at a fraction of the module, at whatever angle
 * the ground left. That absence IS the expression — a shanty is precisely the fabric that
 * was never laid out, and drawing it with the packer's grain would make it a poor SUBURB,
 * which is a different and much tidier thing.
 *
 * ⚠ THEY ARE DWELLINGS, so they join the printed representativeness denominator; they are
 * NOT parcels, so they never touch the §5 census claim (which is a claim about the tiers
 * where every household has a plot, and these households do not).
 *
 * @param {Object} args
 * @returns {{ huts: Array<any>, reason: string, fired: boolean }}
 */
export function buildShantyFringe(args) {
  const {
    organisms, umbrella, web, sub, water, tierScale: scale, prosperityRank, seeding, forbidden,
  } = args;
  // A settlement below town has no gates and no landless: §5's own tier table gives the
  // suburb to town and above, and the shanty is the suburb's poorest form.
  const TIERS = ['town', 'city', 'metropolis'];
  if (TIERS.indexOf(scale.extentTier) < 0) {
    return { huts: [], fired: false, reason: `no shanty below town: ${scale.extentTier} has no outside-the-gates` };
  }
  const poor = organisms
    .filter((o) => String(o.wealth || '').toLowerCase() === 'poor')
    .sort((a, b) => (b.reach - a.reach) || compareKeys(a.key, b.key));
  if (!poor.length) {
    return { huts: [], fired: false, reason: 'no poor ward: poverty and pressure did not co-occur' };
  }
  const ward = poor[0];
  const pressed = /lawless|unsafe/.test(String(ward.safety || '').toLowerCase()) || prosperityRank <= 1;
  if (!pressed) {
    return {
      huts: [], fired: false,
      reason: `a poor ward exists (${ward.key}) but no pressure signal — poverty alone builds poor HOUSES, not a shanty`,
    };
  }

  // THE POOR SIDE: outward from the settlement's heart, past the poorest ward.
  const cx = scale.centreX == null ? ward.anchor.x : scale.centreX;
  const cy = scale.centreY == null ? ward.anchor.y : scale.centreY;
  let dx = ward.anchor.x - cx, dy = ward.anchor.y - cy;
  let d = Math.sqrt(dx * dx + dy * dy);
  if (d < 1) { dx = 1; dy = 0; d = 1; }
  const ux = dx / d, uy = dy / d;
  const module = web.plotFrontage * 0.46;            // a hut, not a house
  const start = scale.builtRadius * 0.92;
  const span = scale.builtRadius * 0.55;

  /** @type {Array<any>} */ const huts = [];
  const CAP = 34;                                    // rationed like every other mark
  for (let i = 0; i < CAP * 3 && huts.length < CAP; i++) {
    const k = `shanty.${ward.key}|${i}`;
    const t = start + hashUnit(`${k}|t`) * span;
    const lateral = (hashUnit(`${k}|l`) - 0.5) * scale.builtRadius * 0.62;
    const x = cx + ux * t - uy * lateral;
    const y = cy + uy * t + ux * lateral;
    if (x < 12 || y < 12 || x > VIEW - 12 || y > VIEW - 12) continue;
    if (insideAny(umbrella.components, x, y)) continue;   // OUTSIDE the gates, by definition
    if (forbidden(x, y)) continue;
    // ⚠ THE SHANTY HAD ITS OWN PAIR (0.72 / 0.66) AND IT IS NOT A DIFFERENT LAW. A hovel
    // on a crag is the same impossibility as a hall on a crag; the shanty's difference is
    // that it stands OUTSIDE the gates, which the line above already says.
    if (!buildableAt(sub, x, y)) continue;
    const ang = Math.floor(hashUnit(`${k}|a`) * TRIG_N);
    const w = module * (0.72 + hashUnit(`${k}|w`) * 0.70);
    const h = module * (0.62 + hashUnit(`${k}|h`) * 0.60);
    const c = cosI(ang), s = sinI(ang);
    const poly = [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]]
      .map(([px, py]) => /** @type {[number,number]} */ ([x + px * c - py * s, y + px * s + py * c]));
    huts.push({
      key: k,
      polygon: poly,
      center: [x, y],
      organismKey: ward.key,
      character: 'residential',
      wealth: 'poor',
      material: 'thatch',
      tone: hashUnit(`${k}|t2`),
      area: absArea(poly),
      grainAngle: ang,
      shanty: true,
    });
  }
  void water;
  return {
    huts,
    fired: huts.length > 0,
    reason: huts.length
      ? `SHANTY FRINGE: ${huts.length} huts outside the gates on the ${ward.key} side —`
        + ` a POOR ward (${ward.wealth}) under PRESSURE (${ward.safety || 'prosperity floor'});`
        + ` no plots, no yards, no block — the fabric that was never laid out`
      : `poverty and pressure co-occur at ${ward.key} but no ground outside the gates accepted a hut`,
  };
}
