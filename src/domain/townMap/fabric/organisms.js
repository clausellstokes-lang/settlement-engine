/**
 * domain/townMap/fabric/organisms.js — THE DISTRICT-ORGANISM LAW (§5.0c, §161d, §161e).
 *
 * ⭐⭐ "DISTRICTS GROW OUTWARD; THE TOWN IS JUST THE UMBRELLA." This inverts the naive
 * pipeline. There is no blob that gets subdivided into quarters afterwards. Each
 * district is its OWN ORGANISM: it takes its own anchor, accretes outward from it at its
 * own rate, and the settlement is the EMERGENT UNION of what grew.
 *
 * The seven sub-laws, each implemented below and each cited at its call site:
 *  1  ANCHORS — suitability × category affinity × §161c siting ring, sampled under the
 *     §167 AFFINITY WEIGHT FUNCTION. Each district anchors INDEPENDENTLY.
 *  2  THE DECIDED LOBE COUNT — the number of independent anchors the FACTS support,
 *     tier-bounded. Never a fixed number per tier.
 *  3  MULTIPLICITY (§161e.2) — the same district TYPE instantiates MORE THAN ONCE where
 *     the dossier supports it: parishes plural, a grain market and a fish market as
 *     separate organisms, two poor fringes on two bad edges.
 *  4  ACCRETION — a per-organism lobe chain, every lobe TERRAIN-BOUNDED: refuse steep,
 *     refuse wet, refuse the far bank, prefer the road ribbon.
 *  5  INFLUENCE FIELDS (§161e.3) — an organism's extent is a SCALAR FIELD, not an
 *     exclusive polygon. Overlap is expected and is the point.
 *  6  THE RESIDENTIAL MATRIX (§161e.1) — housing is not a district, it is the connective
 *     tissue every organism grows within and over. A district with no dwellings in it is
 *     a rendering bug, not a zone.
 *  7  PER-ORGANISM GRAIN — each district's fabric REMEMBERS its own growth direction.
 *     MF-P1 measured this as the single mechanism that produces organic read at plan
 *     scale; noise INSIDE a quarter reads as noise, not as history.
 *
 * ⭐⭐ HOW THIS SATISFIES THE INERTIA LAW, which is the reason it is shaped this way.
 * Every organism derives from its OWN key and its OWN facts. Nothing here iterates all
 * organisms to produce a shared quantity — in particular there is NO global area
 * normalization (the prototype had one, and it meant that adding one district rescaled
 * every other district's geometry). The settlement's extent comes from POPULATION and
 * TIER via tierGrammar, facts that do not move when one shop opens.
 *
 * ⭐ AND THE ONE PLACE THAT WOULD HAVE BROKEN IT ANYWAY: an organism's SIZE reads its
 * member roll through a BAND, not a count. Adding the twelfth institution to an
 * eleven-member quarter must not resize the quarter — the built world has memory, and
 * one new shop is not an urban-renewal programme. The band is what makes the
 * counterfactual pin ("add one institution, everything else byte-identical") true rather
 * than approximately true.
 *
 * PURITY: no Date, no Math.random, no runtime trig, no localeCompare.
 */

import { fabricRng, hashUnit } from './fabricRng.js';
import { organismKey, compareKeys } from './lineage.js';
import { TRIG_N, cosI, sinI, unionDiscOutline, chaikin, absArea, centroid } from './fabricGeometry.js';
import { VIEW, sampleAt } from './substrate.js';
import { isFarBank, isInWater } from './waterMode.js';
import { suitabilityAt } from './suitability.js';

/**
 * CATEGORY PLACEMENT PRIORS — `ring` is the anchor's distance from the settlement centre
 * as a percent of the built extent, `spread` how far the affinity tolerates being moved.
 *
 * These mirror the LANDED priors (townMapModel.js's CATEGORY_PLACEMENT and
 * townLayoutV2.js's CATEGORY_CENTRALITY) and honour the quarters' own prose: civic and
 * noble central, criminal and industrial peripheral, waterfront categories pulled to the
 * water. They are restated here rather than imported because those constants are private
 * to their modules and the fabric must not reach into either — but they are the SAME
 * priors, deliberately, so an institution does not move when the fabric lights.
 * @type {Readonly<Record<string, { ring:number, spread:number }>>}
 */
export const CATEGORY_RING = Object.freeze({
  civic:       { ring: 0.12, spread: 0.10, dir: 0 },
  noble:       { ring: 0.24, spread: 0.12, dir: 2 },
  merchant:    { ring: 0.30, spread: 0.16, dir: 6 },
  religious:   { ring: 0.30, spread: 0.18, dir: 4 },
  arcane:      { ring: 0.38, spread: 0.18, dir: 10 },
  craft:       { ring: 0.42, spread: 0.20, dir: 12 },
  residential: { ring: 0.50, spread: 0.26, dir: 8 },
  foreign:     { ring: 0.62, spread: 0.18, dir: 5 },
  military:    { ring: 0.60, spread: 0.20, dir: 14 },
  criminal:    { ring: 0.72, spread: 0.20, dir: 9 },
  industrial:  { ring: 0.75, spread: 0.18, dir: 13 },
  other:       { ring: 0.48, spread: 0.24, dir: 8 },
});

/**
 * ⭐⭐ THE BEARING PRIOR IS WHY A TOWN HAS INTERIOR GREENS AT ALL, and leaving it out was
 * a real defect worth recording. With a RING prior alone, every quarter anchors at its own
 * radius but at an arbitrary bearing, so five quarters pile into the same arc, their
 * influence fields merge into one solid mass, and the umbrella comes back with NO enclosed
 * gaps — §5.0c.3's breathing holes silently absent at every tier.
 *
 * The cure is the landed model's own second column: `CATEGORY_PLACEMENT` carries a `dir`
 * (a compass quarter per category) beside its `ring`, and the quarters separate AROUND the
 * centre rather than stacking on one side of it. The gaps between neighbouring quarters
 * then enclose real ground, which renders as the commons, the paddocks and the garden
 * plots that make a real town plan breathe.
 *
 * Bearing tolerance is DELIBERATELY WIDE (a quarter-turn), because the prior is a
 * disposition and the GROUND still decides: a category whose compass quarter is a marsh
 * takes the next best ground rather than sitting in the marsh to satisfy a table.
 */
export const BEARING_TOLERANCE = 4;

/**
 * ECONOMIC WEIGHT by district category — how fast an organism accretes, relative to the
 * residential matrix it grows through. §42/§43 VALUES, PROPOSED-WITH-RATIONALE: a market
 * quarter grows because trade compounds; a noble quarter is large per household and slow
 * to change hands; a criminal fringe accretes fast and thin because nobody is stopping
 * it and nobody is investing in it.
 * ⚠ UNSOAKED; rides the tuning signature.
 * @type {Readonly<Record<string, number>>}
 */
export const CATEGORY_GROWTH = Object.freeze({
  civic: 0.85, noble: 0.70, merchant: 1.25, religious: 0.90, arcane: 0.60,
  craft: 1.10, residential: 1.00, foreign: 0.80, military: 0.75,
  criminal: 1.15, industrial: 1.05, other: 0.90,
});

/**
 * MEMBER-ROLL BANDS. An organism's size reads which band its member count falls in, not
 * the count itself — see the inertia note in this file's header. The bands are
 * geometric because institutional presence is: the difference between 1 and 3 members is
 * a different KIND of quarter, the difference between 18 and 20 is not.
 */
export const MEMBER_BANDS = Object.freeze([0, 1, 3, 6, 11, 20, 36, 64]);

/**
 * ⭐ REACH_SPAN — how far a MEDIAN quarter reaches, as a share of the settlement's built
 * extent. §42/§43 VALUE, DERIVED BY MEASUREMENT, not chosen: the §5 tier grammar sizes
 * `builtRadius` so that a disc of that radius covers the tier's footprint band, so the
 * organisms' union has to actually COVER that disc or the tier reads too small on the leaf.
 *
 * ⚠ THE COVERAGE CURVE IS NOT LINEAR, which is why this was SWEPT rather than solved. Below
 * about 0.9 the quarters leave gaps and coverage tracks the reach ratio nearly one-for-one;
 * above it the union spills past the extent disc and coverage accelerates (measured at
 * span 0.90: town covered 1.72 of its own disc and rendered at 52% of the frame against a
 * 21–36% band — overshooting the band as badly as MF-B1 undershot it). Three points were
 * measured over 10 seeds × 6 tiers — 0.62, 0.68, 0.74 — and 0.71 is the value at which
 * village, town, city AND metropolis all land inside their §5 bands at the median.
 *
 * ⚠ THE BOTTOM OF THE LADDER IS DELIBERATELY NOT FITTED. A thorp comes in at ~1.0% against
 * a 1.4–3.0% band, because a ONE-ORGANISM settlement is a lobe CHAIN and never fills a
 * disc. That is not a residual to tune away: §5 says in terms that "the literal area
 * reading holds from town upward only — below that the map ZOOMS with the tier". Fitting
 * the thorp would mean re-introducing an organism-count term into the reach, which is
 * exactly the coupling this member just removed.
 * ⚠ UNSOAKED; rides the tuning signature. Re-measure with `laneMFB1b-diag.mjs` if the
 * member-band or growth tables move.
 */
export const REACH_SPAN = 0.71;

/** Which member band a roll size falls in. @param {number} count @returns {number} */
export function memberBand(count) {
  let band = 0;
  for (let i = 0; i < MEMBER_BANDS.length; i++) if (count >= MEMBER_BANDS[i]) band = i;
  return band;
}

/** How many candidate cells the anchor sampler considers. Enough for a real choice,
 * few enough that every candidate is genuinely viable ground. */
const ANCHOR_CANDIDATES = 24;

/** Clamp to 0..1. */
function unit(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

/** Which of sixteen compass slots a vector points into. Trig-free: the L1 'diamond angle'
 * is monotone in the true angle and needs only + - / and a compare, so it partitions the
 * circle identically on every platform. */
function compassSlot(dx, dy, d) {
  if (d <= 0) return 0;
  const x = dx / d, y = dy / d;
  const ax = x < 0 ? -x : x, ay = y < 0 ? -y : y;
  const t = ax + ay > 0 ? ay / (ax + ay) : 0;
  const diamond = x >= 0 ? (y >= 0 ? t : 4 - t) : (y >= 0 ? 2 - t : 2 + t);
  const slot = Math.floor((diamond / 4) * 16);
  return slot < 0 ? 0 : slot > 15 ? 15 : slot;
}

/**
 * THE ANCHOR SAMPLER — §167's AFFINITY MATRIX LAW, wired at its interface.
 *
 * score = ring legality × adjacency absolutes × affinity field × suitability
 * and then a SEEDED ROLL picks under the weights. BIASED, NEVER DICTATED: a lawful town
 * lands its granary between its mill and its market most of the time; a chaotic one puts
 * it three streets away because nobody planned it. Taking the argmax instead would make
 * every settlement with the same categories place them identically, which is the
 * "diagram, not a town" failure.
 *
 * ⚠ PROVISIONAL-PENDING-ATLAS. `affinityField` is the seam TC31's per-entry atlas plugs
 * into. Until it lands the caller passes the §161m supply-chain edges as the interim
 * field; the SHAPE of the call is final and the atlas changes only what the field
 * returns.
 *
 * @param {Object} args
 * @param {import('./suitability.js').SuitabilityField} args.field
 * @param {import('./substrate.js').Substrate} args.sub
 * @param {{ x:number, y:number }} args.centre        the settlement's centre of gravity
 * @param {number} args.extent                        the built extent radius
 * @param {{ ring:number, spread:number }} args.ring   the category's ring prior
 * @param {(x:number, y:number) => number} [args.affinityField]  0..1+; the §167 hook
 * @param {(x:number, y:number) => boolean} [args.forbidden]     adjacency ABSOLUTES
 * @param {number} args.lawfulness                    0..1; scales the affinity term
 * @param {import('./fabricRng.js').FabricRng} args.rng
 * @returns {{ x:number, y:number, score:number }}
 */
export function sampleAnchor(args) {
  const { field, sub, centre, extent, ring, rng, lawfulness } = args;
  const affinityField = args.affinityField || (() => 1);
  const forbidden = args.forbidden || (() => false);
  const n = field.n;
  // ⭐ THE GROUND, NOT THE PAGE. A quarter's position inside its own town is a geographic
  // question; the leaf-composition term in `field.score` is a cartographic one and belongs
  // only to the nucleus search. See the two-fields note in ./suitability.js — reading the
  // wrong one here cost city and metropolis their §5 footprint bands.
  const suitField = field.ground || field.score;

  /** @type {Array<{ x:number, y:number, weight:number, score:number }>} */
  const cands = [];
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const x = (i + 0.5) * field.cell, y = (j + 0.5) * field.cell;
      // ADJACENCY ABSOLUTES — never violated at any chaos level. A port is on the water
      // or it is not a port; a quarter is not founded in the channel.
      if (forbidden(x, y)) continue;
      // RING LEGALITY — a gaussian-ish falloff about the category's own ring. Not a hard
      // band: an authority-central quarter can sit slightly out when the ground says so.
      const d = Math.sqrt((x - centre.x) * (x - centre.x) + (y - centre.y) * (y - centre.y));
      const want = ring.ring * extent;
      // ⛔ THE SITING RING MUST BIND, OR IT IS FURNITURE (§8.2). MF-B1 spelled the falloff
      // as 1/(1+off²) over a denominator of `spread × extent × 2`, which is so wide that a
      // central cell with twice the suitability beats a correctly-ringed one every time:
      // MEASURED, the §161c table's rings run 0.12→0.75 with a mean near 0.44 and the
      // anchors came back at a mean of 0.33 — every quarter, including the ones the table
      // puts on the fringe, bunched into the core. A prior that loses to ordinary variance
      // in the term it is supposed to modulate is not a prior. The denominator is now the
      // spread the table actually declares, and the falloff is SQUARED so that a quarter
      // sitting a full spread off its ring pays a real price and one sitting two spreads
      // off is effectively refused — while the shape stays soft enough that a category whose
      // compass quarter is a marsh still takes the next best ground (§5.0c's own caveat).
      const off = (d - want) / Math.max(1, ring.spread * extent);
      const soft = 1 / (1 + off * off);
      let ringLegality = soft * soft;
      // THE BEARING PRIOR (see BEARING_TOLERANCE). Compared through the frozen compass so
      // no runtime trig is needed: the candidate's own compass slot against the category's.
      if (ring.dir != null && d > extent * 0.04) {
        const slot = compassSlot(x - centre.x, y - centre.y, d);
        let delta = slot - ring.dir;
        while (delta > 8) delta -= 16;
        while (delta < -8) delta += 16;
        const adrift = (delta < 0 ? -delta : delta) / BEARING_TOLERANCE;
        ringLegality *= 1 / (1 + adrift * adrift);
      }
      const suit = suitField[j * n + i];
      if (suit <= 0.02) continue;
      // THE AFFINITY TERM scales with LAWFULNESS: a well-run settlement satisfies its
      // adjacency preferences; a lawless one is legibly indifferent to them.
      const aff = 1 + (affinityField(x, y) - 1) * lawfulness;
      const score = ringLegality * suit * Math.max(0.02, aff);
      cands.push({ x, y, weight: score * score * score, score });
    }
  }
  if (!cands.length) return { x: centre.x, y: centre.y, score: 0 };
  cands.sort((a, b) => (b.score - a.score) || (a.x - b.x) || (a.y - b.y));
  const pool = cands.slice(0, ANCHOR_CANDIDATES);
  const chosen = pool[rng.weighted(pool)];
  return { x: chosen.x, y: chosen.y, score: chosen.score };
}

/**
 * @typedef {Object} Organism
 * @property {string} key
 * @property {string} districtId       the LANDED district id, or a founded id
 * @property {string|null} name
 * @property {string} category
 * @property {string} wealth
 * @property {string} safety
 * @property {number} instance         0 for the first instance of a type, 1.. for more
 * @property {boolean} founded         true when the fabric FOUNDED it (§161l founding rule)
 * @property {{ x:number, y:number }} anchor
 * @property {number} reach            the organism's own extent, view units
 * @property {number} weight           0..1 field strength
 * @property {number} grainAngle       trig index — the direction its fabric remembers
 * @property {Array<{x:number,y:number,r:number}>} lobes
 * @property {Array<[number,number]>} outline
 * @property {number} memberBand
 * @property {string[]} members        institution identity keys attributed here
 * @property {number} changeYear
 * @property {string} reason
 */

/**
 * GROW ONE ORGANISM. Everything it needs comes from its own key, its own facts and the
 * shared (immovable) substrate — never from its siblings.
 *
 * @param {Object} args
 * @param {any} args.district
 * @param {number} args.instance
 * @param {string[]} args.members
 * @param {import('./suitability.js').SuitabilityField} args.field
 * @param {import('./substrate.js').Substrate} args.sub
 * @param {import('./waterMode.js').WaterRelationship} args.water
 * @param {{ x:number, y:number }} args.centre
 * @param {number} args.extent
 * @param {number} args.lawfulness
 * @param {{ shape: { lobeSpread:number, roadBias:number } }} args.morphology
 * @param {Array<[number,number]>} args.ribbons
 * @param {{ seed: string|number, variant?: number }} args.seeding
 * @param {(x:number,y:number)=>number} [args.affinityField]
 * @returns {Organism}
 */
export function growOrganism(args) {
  const {
    district, instance, members, field, sub, water, centre, extent,
    lawfulness, morphology, ribbons, seeding, expectedOrganisms,
  } = args;
  // ⚠ THE COMMONS ARRIVE AS A PREDICATE, NOT AS A MODULE IMPORT, and that is deliberate:
  // commons.js reads CATEGORY_RING from this file, so importing back would close a cycle
  // whose evaluation order decides whether a frozen table is defined at first use. A
  // one-way dependency plus a threaded predicate cannot have that failure mode.
  const reserved = args.reserved || (() => false);

  const key = instance === 0 ? organismKey(district) : `${organismKey(district)}~${instance}`;
  const category = String(district.category || 'other').toLowerCase();
  const ring = CATEGORY_RING[category] || CATEGORY_RING.other;
  // ⭐⭐⭐ §15.7 THE FIRE DATES THE GRAIN — the second of the peer review's path-dependence
  // proofs, and the one that makes a rebuilt quarter READ as rebuilt.
  //
  // "The rebuilt quarter's grain dates from its fire." A quarter that burned was re-laid by
  // the people who re-laid it, to the street lines and the ownership of THAT year — which is
  // why a fire scar is still legible in a modern city plan centuries later, as a patch of
  // different grain inside an older fabric. The mechanism is one line: the organism's
  // `changeYear` becomes the FIRE year where the record carries one for this district, and
  // the grain angle is hashed on it.
  //
  // ⚠ THE GRAIN HASH NOW READS THE YEAR, AND THAT IS A DECLARED SAME-SEED SHIFT. Before this
  // the angle was `hash(key|grain)` and a quarter's grain could not change for any reason at
  // all — which made the §11 drift grammar's "rebuilt quarter renders newer" unexpressible
  // in the one channel that carries it. Every quarter's angle moves once, by construction,
  // and the receipt records it.
  const firedAt = args.fireYearFor ? args.fireYearFor(String(district.id || '')) : null;
  const foundedYear = Number.isFinite(district.foundedYear) ? Math.trunc(district.foundedYear) : 0;
  const changeYear = Number.isFinite(firedAt) ? Math.trunc(firedAt) : foundedYear;
  const rng = fabricRng(seeding.seed, key, { variant: seeding.variant, changeYear });

  // ── 1. THE ANCHOR. Forbidden ground is absolute: never in the channel, never on the
  //    far bank unless the water mode is THROUGH, and NEVER on reserved common ground —
  //    §5.0c.3's greens are a legal claim that predates the quarter, so a quarter may grow
  //    around one but never over it. That refusal is the whole mechanism behind the
  //    interior greens (see commons.js).
  const forbidden = (x, y) => isInWater(water, x, y) || isFarBank(water, x, y) || reserved(x, y, 0);
  const anchor = sampleAnchor({
    field, sub, centre, extent, ring, rng, lawfulness,
    affinityField: args.affinityField,
    forbidden,
  });

  // ── 2. THE ORGANISM'S OWN REACH. From its growth rate and its BANDED member roll —
  //    never from a raw count (the inertia note in this file's header).
  //
  // ⛔⛔ THE 1/√N DIVISOR IS GONE, AND REMOVING IT IS THE CURE FOR THE §5 FOOTPRINT
  // SHORTFALL. MF-B1 divided every organism's reach by the square root of the tier's
  // expected organism count, on this argument: "five organisms each reaching half the
  // extent produce one solid mass with no interior greens." The argument was sound and the
  // instrument was wrong — it bought §5.0c.3's breathing holes BY STARVATION, shrinking the
  // whole settlement to make gaps appear, and it did not even buy them (MF-B1 measured ZERO
  // greens at every tier). What it did buy was measurable: at metropolis every quarter was
  // sized for a settlement of eleven, the union covered 0.41 of the extent the tier grammar
  // had sized, and the tier came in at 19.8% of the frame against a band of 58–72%.
  //
  // ⭐⭐ THE GREENS ARE NOW BOUGHT BY LAW INSTEAD (./commons.js): common ground is a claim
  // RESERVED BEFORE GROWTH that no quarter may cross. Once the greens have a mechanism of
  // their own, the reach is free to do its real job — say how far THIS quarter reaches
  // relative to its neighbours — and the settlement's EXTENT goes back to being what §5 and
  // §161f say it is: a function of tier and population, not of how many quarters happen to
  // be constituted. ⭐ THE CLASS: when a quantity is bent to produce a side effect, the side
  // effect usually fails and the quantity is definitely wrong. Give the side effect its own
  // mechanism and hand the quantity back.
  //
  // THE INERTIA LAW IS STRICTLY STRONGER FOR IT: the reach now reads NO count at all, live
  // or expected, so founding a district cannot resize any other quarter even in principle.
  const band = memberBand(members.length);
  const growth = CATEGORY_GROWTH[category] || CATEGORY_GROWTH.other;
  const bandShare = 0.45 + (band / (MEMBER_BANDS.length - 1)) * 0.55;
  const reach = extent * REACH_SPAN * (0.75 + bandShare * 0.60)
    * growth * (0.86 + hashUnit(`${key}|reach`) * 0.28);
  void expectedOrganisms;

  // ── 7. THE GRAIN. One angle per organism, hashed from its identity — so a quarter's
  //    streets all agree with each other and disagree with the next quarter's, which is
  //    what accretion looks like from above.
  const grainAngle = Math.floor(hashUnit(`${key}|grain|y${changeYear}`) * TRIG_N);

  // ── 4. ACCRETION. A chain of unequal lobes from the anchor, each one refusing ground
  //    the substrate forbids. Later lobes are smaller: newer growth is tighter growth.
  // ⭐ AN ORGANISM IS A CHAIN, NOT A BLOB — and this is what keeps the settlement's
  // outline OFF a circle. With few, fat lobes each quarter is a disc, several discs on
  // rings about one centre union into a bigger disc, and the plan comes back CONCENTRIC —
  // which is the reference generators' own defect and the one §5.0 and the §157 standing
  // critique both order overridden. More, smaller lobes make each quarter path-dependent
  // and elongated along whatever it grew toward, and their union is lumpy for reasons.
  const lobeTarget = Math.max(3, Math.round(3 + bandShare * 7));
  /** @type {Array<{x:number,y:number,r:number,gen:number}>} */
  const lobes = [{ x: anchor.x, y: anchor.y, r: reach * 0.34, gen: 0 }];
  let guard = 0;
  while (lobes.length < lobeTarget && guard++ < 240) {
    // Parent weighted toward the OUTER lobes: growth spreads rather than thickening the
    // core, which is what makes the plan path-dependent instead of concentric.
    // ⚠ `Math.sqrt`, NOT `Math.pow(u, 0.55)`. `Math.pow` is not correctly rounded and its
    // last-ULP result is not guaranteed identical across platforms, which would break the
    // cross-machine golden by exactly the mechanism the trig ban exists to prevent. sqrt
    // IS correctly rounded, and an exponent of 0.5 biases toward the outer lobes just as
    // 0.55 did — the shape of the bias is what matters, not its second decimal.
    const idx = Math.min(lobes.length - 1, Math.floor(Math.sqrt(rng.next()) * lobes.length));
    const parent = lobes[idx];

    // Direction: biased along the nearest RIBBON (the §5.-1.3 subseed road) when there
    // is one — ribbon development is how a polycentric town stretches into a dumbbell.
    let dx, dy;
    let ribbon = null;
    if (ribbons.length) {
      let bd = Infinity;
      for (const rp of ribbons) {
        const d = (rp[0] - parent.x) * (rp[0] - parent.x) + (rp[1] - parent.y) * (rp[1] - parent.y);
        if (d < bd) { bd = d; ribbon = rp; }
      }
    }
    if (ribbon && rng.chance(morphology.shape.roadBias)) {
      const rx = ribbon[0] - parent.x, ry = ribbon[1] - parent.y;
      const l = Math.sqrt(rx * rx + ry * ry) || 1;
      const wob = rng.int(-140, 140);
      dx = (rx / l) * cosI(wob) - (ry / l) * sinI(wob);
      dy = (rx / l) * sinI(wob) + (ry / l) * cosI(wob);
    } else {
      const a = rng.int(0, TRIG_N - 1);
      dx = cosI(a); dy = sinI(a);
    }

    const decay = 1 - (lobes.length / (lobeTarget + 2)) * 0.42;
    const r = reach * rng.range(0.12, 0.38) * decay * morphology.shape.lobeSpread + reach * 0.06;
    // Overlap ONLY just enough to stay connected. Heavy overlap merges every lobe into
    // one disc and erases the accretion entirely.
    const step = (parent.r + r) * rng.range(0.66, 1.00);
    const px = parent.x + dx * step, py = parent.y + dy * step;

    // TERRAIN DISPOSES: refuse steep, refuse wet, refuse water, refuse the far bank,
    // refuse the frame margin.
    if (px < 70 || py < 70 || px > VIEW - 70 || py > VIEW - 70) continue;
    if (forbidden(px, py)) continue;
    // ⛔ A LOBE IS A DISC, SO ITS CENTRE CLEARING THE COMMON IS NOT ENOUGH. Testing the
    // centre alone lets a quarter park its body half-over the green and the reservation
    // becomes advisory. The lobe must clear the claim by its OWN RADIUS or it is refused.
    if (reserved(px, py, r)) continue;
    if (sampleAt(sub, sub.slope, px, py) > 0.72) continue;
    if (sampleAt(sub, sub.wet, px, py) > 0.58) continue;
    if (suitabilityAt(field, px, py) < 0.06) continue;

    lobes.push({ x: px, y: py, r, gen: parent.gen + 1 });
  }

  const outline = chaikin(unionDiscOutline(anchor.x, anchor.y, lobes, 64), 1, true);

  return {
    key,
    districtId: String(district.id || `${category}.${instance}`),
    name: district.name || null,
    category,
    wealth: String(district.wealth || 'modest'),
    safety: String(district.safety || 'ordinary'),
    instance,
    founded: !!district.__founded,
    anchor: { x: anchor.x, y: anchor.y },
    reach,
    weight: unit(0.30 + bandShare * 0.55 + (growth - 1) * 0.15),
    grainAngle,
    lobes,
    outline,
    memberBand: band,
    members,
    changeYear,
    // §15.7: which YEAR this quarter's fabric dates from, and why — the replay-equivalence
    // pin asserts on this rather than on the angle, because an angle is a hash and a DATE
    // is the claim.
    grainDatedFrom: Number.isFinite(firedAt) ? 'fire' : 'founding',
    reason: `${category} organism, ${members.length} member(s) [band ${band}], anchored at suitability ${anchor.score.toFixed(3)} on the ${(ring.ring * 100).toFixed(0)}% ring`,
  };
}

/**
 * ⭐ MULTIPLICITY (§161e.2) — how many INSTANCES of a district type the facts support.
 *
 * "Several parish-scale religious nodes instead of one 'religious quarter'; a grain
 * market and a fish market as separate organisms; two poor fringes on two bad edges."
 *
 * The count derives from the member roll (a quarter with twenty churches is not one
 * parish) and is TIER-BOUNDED (a village cannot support three markets whatever its
 * roster says). Instance 0 always exists; the rest are earned.
 *
 * @param {string} category @param {number} memberCount @param {string} tier
 * @returns {number}
 */
export function multiplicityCount(category, memberCount, tier) {
  const tierCap = { thorp: 1, hamlet: 1, village: 1, town: 2, city: 3, metropolis: 4 }[tier] || 1;
  // Categories that historically DID instantiate plurally. A civic centre is singular by
  // definition (one town hall); parishes, markets and poor fringes are not.
  const plural = { religious: 5, merchant: 6, craft: 8, industrial: 8, residential: 7, criminal: 9, foreign: 8 };
  const per = plural[category];
  if (!per) return 1;
  return Math.max(1, Math.min(tierCap, Math.floor(memberCount / per) + (memberCount >= per ? 1 : 0)));
}

/**
 * ⭐ THE ATTRIBUTION LAW (§161l.2) + THE FOUNDING RULE.
 *
 * "Every institution belongs to an umbrella district, and DISTRICTS ARE CONSTITUTED BY
 * THEIR MEMBERS." Placement does not put institutions IN districts; member institutions
 * DEFINE the organism — the parish is its church plus its households, the market quarter
 * is its market plus its traders.
 *
 * THE FOUNDING RULE: institutions whose natural umbrella DOES NOT YET EXIST seed it.
 * Enough unhoused peers FOUND the to-be-constructed district — this is HOW multiplicity
 * instances are born, and it is the same mechanism §11.5's economy shift will use when
 * the new smelter and its fellows found the smelting quarter.
 *
 * ⚠ THE DISPERSION LAW (§165.3) IS HONOURED HERE, and it is the reason this function
 * takes a `dispersed` predicate: CLUSTERED classes (tanners, goldsmiths, dyers — trades
 * with a real historical warrant for concentrating) may found a district. DISPERSED
 * classes (bakers, taverns, smithies — the trades that existed on every street) may NOT:
 * they belong to the residential matrix all around the settlement, and auto-founding a
 * "bakers' quarter" from five bakeries would be a fabrication with a straight face.
 *
 * Unattributable institutions fall to the matrix with their siting ring as their only
 * placement law — RECORDED, never orphaned silently.
 *
 * @param {Array<{ key:string, category:string, districtId:string|null, dispersed:boolean }>} institutions
 * @param {Array<any>} districts                      the landed districts
 * @param {number} foundingQuorum                     how many unhoused peers found one
 * @returns {{ rolls: Map<string, string[]>, founded: any[], matrix: string[], notes: string[] }}
 */
export function attributeInstitutions(institutions, districts, foundingQuorum) {
  /** @type {Map<string, string[]>} */ const rolls = new Map();
  for (const d of districts) rolls.set(String(d.id), []);
  /** @type {string[]} */ const matrix = [];
  /** @type {string[]} */ const notes = [];
  /** @type {Map<string, string[]>} */ const unhoused = new Map();

  const ordered = institutions.slice().sort((a, b) => compareKeys(a.key, b.key));
  for (const inst of ordered) {
    const did = inst.districtId ? String(inst.districtId) : '';
    if (did && rolls.has(did)) { rolls.get(did).push(inst.key); continue; }
    // No umbrella. A CLUSTERED trade queues to found one with its peers; a DISPERSED
    // trade goes straight to the matrix, which is where it historically belonged.
    if (inst.dispersed) {
      matrix.push(inst.key);
      continue;
    }
    const bucket = unhoused.get(inst.category) || [];
    bucket.push(inst.key);
    unhoused.set(inst.category, bucket);
  }

  /** @type {any[]} */ const founded = [];
  for (const category of [...unhoused.keys()].sort(compareKeys)) {
    const peers = unhoused.get(category);
    if (peers.length >= foundingQuorum) {
      const id = `fabric.founded.${category}`;
      founded.push({ id, name: null, category, wealth: 'modest', safety: 'ordinary', __founded: true });
      rolls.set(id, peers.slice());
      notes.push(`FOUNDED '${id}': ${peers.length} unhoused ${category} institutions reached the quorum of ${foundingQuorum} and constituted their own quarter (§161l founding rule)`);
    } else {
      for (const k of peers) matrix.push(k);
      notes.push(`${peers.length} ${category} institution(s) fell to the residential matrix — below the founding quorum of ${foundingQuorum}, sited by their §161c ring alone (recorded, not orphaned)`);
    }
  }
  return { rolls, founded, matrix, notes };
}

/**
 * Grow every organism for a settlement. The ONLY iteration over the whole district set
 * — and it produces no shared quantity: each call is independent, so the loop could run
 * in any order and yield the same bytes.
 * @param {Object} args
 * @returns {Organism[]}
 */
export function growOrganisms(args) {
  const { districts, rolls, tierScale: scale, ...rest } = args;
  // The TIER's expected organism count — the inertia-safe divisor (see growOrganism).
  const expectedOrganisms = Math.max(1, Math.round((scale.organismBand[0] + scale.organismBand[1]) / 2));
  /** @type {Organism[]} */ const out = [];
  const ordered = districts.slice().sort((a, b) => compareKeys(String(a.id), String(b.id)));
  for (const district of ordered) {
    const members = rolls.get(String(district.id)) || [];
    const instances = multiplicityCount(
      String(district.category || 'other').toLowerCase(),
      members.length,
      scale.tier,
    );
    // Members are split across instances round-robin by their own sorted order, so an
    // added member joins one instance and the others' rolls (and bytes) do not move.
    for (let i = 0; i < instances; i++) {
      const share = members.filter((_, mi) => mi % instances === i);
      out.push(growOrganism({ ...rest, district, instance: i, members: share, expectedOrganisms }));
    }
  }
  return out;
}

/** The settlement's centre of gravity — the area-weighted mean of the organisms'
 * outlines. Reported, never fed back into growth (feeding it back would couple every
 * organism to every other and break the inertia law). @param {Organism[]} orgs */
export function organismCentroid(orgs) {
  let ax = 0, ay = 0, aw = 0;
  for (const o of orgs) {
    const a = absArea(o.outline);
    const c = centroid(o.outline);
    ax += c[0] * a; ay += c[1] * a; aw += a;
  }
  return aw > 0 ? { x: ax / aw, y: ay / aw } : { x: VIEW / 2, y: VIEW / 2 };
}

/**
 * ⭐⭐ §18.1 LIBERTIES AND SANCTUARY PRECINCTS (ODQ §194's TOP-RANKED adopted rich).
 *
 * "A district-scale LOCAL INVERSION of the lawfulness dial — the cathedral close, the
 * sanctuary bound, the liberty where the town's law ran differently. Slots into the §5.0c
 * field machinery as a precinct flag on qualifying religious/chartered organisms: inside the
 * bound, the §161m adjacency weights and §11.2 order-drift read the PRECINCT'S order, not the
 * town's; the boundary renders as its own light dashed line with corner crosses."
 *
 * ⭐ THE INVERSION IS REAL AND IT IS MEASURABLE ON THE PAGE, which is the point. The precinct's
 * order replaces the town's in the §17.6 gap decision, so a close inside a lax town shows a
 * TIGHTER, more deliberate grain and a liberty inside a well-run one shows a looser, more
 * irregular one. That is a district-scale difference the reader can see without being told,
 * and it is one substitution rather than a second dial.
 *
 * ⛔⛔ THE CORNER MARK IS A STONE, NOT A CROSS, AND THAT IS A DELIBERATE DEPARTURE FROM THE
 * CHARTER'S OWN WORDING. §18.1 says "corner crosses (period practice)" — and it IS period
 * practice, in ONE culture. §3's setting-agnosticism and the deity doctrine (faith is culture,
 * never theology) both forbid baking one faith's mark into every settlement on the product,
 * and a sanctuary bound is exactly where that mark would be most conspicuous. The
 * setting-agnostic form of the same convention is the BOUNDARY STONE, which every culture that
 * marked a bound used. ⚠ CHAIR-VETOABLE: say "veto: restore the corner cross" and the glyph
 * changes in one place (`renderFolio`'s precinct pass).
 *
 * @returns {{ precincts: Array<{organismKey:string, kind:string, order:number, townOrder:number}>, reason:string }}
 */
export const PRECINCT = Object.freeze({
  /** How far a religious close's own order sits ABOVE the town's. §42/§43; unsoaked. */
  closeLift: 0.30,
  /** How far a liberty's own order sits BELOW it. */
  libertyDrop: 0.35,
});

export function derivePrecincts({ organisms, lawfulness }) {
  const town = Number.isFinite(lawfulness) ? Math.max(0, Math.min(1, lawfulness)) : 0.5;
  const precincts = [];
  for (const o of organisms) {
    const cat = String(o.category || '').toLowerCase();
    // ⚠ QUALIFYING IS A TYPED READ, never a name match. A precinct exists where the DISTRICT
    // CATEGORY says a separate jurisdiction sat — the religious close and the chartered
    // liberty are the two the estate's own category vocabulary can source.
    let kind = null;
    if (cat === 'religious') kind = 'close';
    else if (cat === 'criminal' || cat === 'foreign') kind = 'liberty';
    if (!kind) continue;
    const order = kind === 'close'
      ? Math.min(1, town + PRECINCT.closeLift)
      : Math.max(0, town - PRECINCT.libertyDrop);
    o.precinct = { kind, order };
    precincts.push({ organismKey: o.key, kind, order, townOrder: town });
  }
  return {
    precincts,
    reason: precincts.length
      ? `§18.1 ${precincts.length} precinct(s) invert the lawfulness dial locally against a town order of `
        + `${town.toFixed(2)}: ${precincts.map((p) => `${p.kind} ${p.order.toFixed(2)}`).join(', ')} — `
        + `the §17.6 gap decision inside the bound reads the PRECINCT'S order, so the grain differs visibly`
      : `§18.1: no religious close and no chartered liberty among ${organisms.length} organisms — no precinct is bound`,
  };
}
