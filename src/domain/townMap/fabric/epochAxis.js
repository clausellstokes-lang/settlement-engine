/**
 * domain/townMap/fabric/epochAxis.js — ⭐⭐⭐ THE EPOCH / VERSION AXIS (owner law ODQ §240;
 * chair dispatch §241.6). **THE ARCHITECTURE CURE AND THE OWNER'S LAW ARE THE SAME OBJECT.**
 *
 * ⭐⭐⭐ THE LAW, IN THE OWNER'S OWN ORDER: build the inner core, STOP, build the wall that
 * COMPLETELY BOUNDS it, THEN build the districts expanding outside it, repeated for as many
 * rings as the settlement's own history earned. core(E0) → circuit(E0) → ring(E1) →
 * circuit(E1) → ring(E2)… is **acyclic by construction**, with the epoch index playing the
 * part the year plays in §239.
 *
 * ⭐⭐⭐ WHAT WAS ACTUALLY WRONG, MEASURED BY MF-ARCH AND CURED HERE. Four of ten walled leaves
 * already carried two concentric circuits — but every ring on every leaf came from ONE node,
 * ONE input hash, ONE derivation pass: **the epochs existed in the OUTPUT and were absent from
 * the DERIVATION.** The older ring was a SCALED COPY of the modern silhouette (`shrinkAbout`),
 * which is the §157 "concentric decoration" defect that walls.js names in its own comment about
 * a different arm. And because every circuit was traced from the umbrella of the WHOLE town,
 * **1,331 of 19,563 drawn bodies (6.8%) stood outside the circuit traced from the umbrella they
 * helped form.** Under this module a circuit is traced from ITS OWN EPOCH'S FABRIC, so a body
 * only ever helps form the circuit that bounds it.
 *
 * ⭐⭐ THE RING COUNT IS DERIVED, NEVER A KNOB (§240.2, the chair's binding condition). A circuit
 * is raised when a settlement PASSES A TIER THRESHOLD — that is the moment the wall is also the
 * charter's proof (walls.js's own material precedence says so), and §5's footprint bands supply
 * the extent at each threshold as arithmetic rather than as a second opinion. A free "how many
 * rings" dial would be tuning wearing history's clothes.
 *
 * ⚠⚠ THE EPOCH BOUNDARY IS AN INERTIA SEAM (§240.4, the named hazard). Each epoch draws from its
 * OWN keyed stream (`wall.epoch.k`), never from one stream walked in ring order — otherwise
 * adding a later ring shifts every draw in an earlier one, which is the inertia law broken at
 * epoch granularity. Pinned directly: add a ring, and epoch 0 must come back byte-identical.
 *
 * PURITY: pure arithmetic and geometry. No Date, no Math.random, no runtime trig, no locale.
 */

import { TIER_PROFILE, FOOTPRINT_R } from './tierGrammar.js';
import { guardSimpleRing } from './fabricGeometry.js';

/**
 * ⭐ THE TIERS THAT EARN A CIRCUIT, in order. Below `town` §5's prior is "never walled", so the
 * ladder starts at the town threshold — which is exactly the extent `wallVintageRatio` has
 * always used for the single vintage ring, restated once and shared.
 */
export const CIRCUIT_THRESHOLDS = Object.freeze(['town', 'city', 'metropolis']);

/**
 * ⭐⭐⭐ G-42 · THE FABRIC LADDER'S OWN THRESHOLDS — **EVERY** tier, not only the walled ones.
 * A settlement lays new fabric each time it passes a tier threshold whether or not it could
 * afford a wall at that threshold, which is the whole of §257.3(a)'s correction.
 */
export const FABRIC_THRESHOLDS = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);

/**
 * ⭐⭐⭐ G-42 · HOW MANY FABRIC EPOCHS A TIER CAN SHOW, from PLAN §6.1's **measured** ladder —
 * thorp/hamlet 1 · village 1–2 · town 2–3 · city 2–4 · metropolis 3–4. This table is the
 * ceiling of that ladder; the floor arrives on its own, because a settlement that never passed
 * a second threshold has no second boundary to draw.
 */
export const TIER_EPOCH_CAP = Object.freeze({
  thorp: 1, hamlet: 1, village: 2, town: 3, city: 4, metropolis: 4,
});

/**
 * ⛔ **NEVER MORE THAN FOUR.** PLAN §6.1 measured it over 313 plates: no plate shows a fifth
 * legible epoch. §263.2's differentiator rests on exactly this — Fantasy Town Generator ships
 * the same staged model with FREE parameters, and *"they cannot know that no plate in 313 shows
 * a fifth legible epoch; we measured it."* A ladder that returned five would spend the one
 * thing that makes ours stronger than theirs.
 */
export const EPOCH_CEILING = 4;

/**
 * ⭐⭐ HOW MANY CIRCUITS A SETTLEMENT MAY MAINTAIN AT ONCE, by the extent tier it reached.
 *
 * ⭐⭐⭐ §252.3(a) RULED THAT THE METROPOLIS CAP LIFTS **WITH** THE RUN CHAIN AND THEN **BY
 * MEASUREMENT UNDER §217**, and both conditions are now met: the run chain lands in this same
 * wave, and `laneMFW2-receipt.md` §6 carries the op-ceiling arithmetic for a third circuit with
 * its towers, gates and ditch against the metropolis's measured headroom. **2 → 3.**
 *
 * ⚠⚠ THE VALUES BELOW ARE A **MAINTENANCE** CAP AND NOT AN EARNING RULE, AND THE DIFFERENCE IS
 * WHERE §240.2 AND `walls.js` APPEAR TO DISAGREE. §240.2 says *a village earns zero circuits*;
 * `wallForm` says *a village that walls itself banks earth and plants timber*. Both are right:
 * the EARNING ladder (`deriveEpochs` below) offers a below-town settlement **no town+ threshold
 * and therefore no earned circuit**, while a dossier that states walls is a TRUTH OVERRIDE that
 * gets exactly ONE circuit and is reported as an override rather than as an economy. That is
 * J-A2-4, settled — see the `truth override` branch and J-W2-3.
 */
export const TIER_CIRCUIT_CAP = Object.freeze({
  thorp: 1, hamlet: 1, village: 1, town: 1, city: 2, metropolis: 3,
});

/**
 * ⭐ HOW FAR A SETTLEMENT MUST HAVE OUTGROWN ITS LAST CIRCUIT BEFORE IT BUYS ANOTHER. A wall was
 * the most expensive thing a town ever built, so it is not re-built for a few streets: the
 * previous ring must enclose less than this share of today's extent. §42/§43 VALUE, INHERITED —
 * it is the 0.86 `walls.js` already used for its single "the town outgrew its wall" test, moved
 * to the one place that decides how many circuits there are. ⚠ UNSOAKED; rides the tuning
 * signature.
 */
export const OUTGROWN_SHARE = 0.86;

/** The radius, in view units, of the disc covering a tier's FLOOR footprint share. */
function thresholdRadius(tier) {
  const prof = TIER_PROFILE[tier];
  return prof ? FOOTPRINT_R * Math.sqrt(prof.footprint[0]) : 0;
}

/**
 * ⭐⭐⭐ THE EPOCH LADDER. Every input is a FACT that exists before any circuit is traced, which
 * is what makes the whole pipeline acyclic: nothing here reads a wall.
 *
 * ⭐ AND THE FIRST FINDING IS ABOUT THE OLD DERIVATION. `wallVintageRatio` was read for four
 * waves as "the extent at the wall's build year", but its numerator is a CONSTANT — the town
 * threshold — so the recorded year only ever decided WHETHER a vintage exists, never how large
 * it was. This ladder keeps that fact and generalizes it honestly: the extent at circuit k is
 * the k-th tier threshold the settlement passed.
 *
 * @param {Object} a
 * @param {boolean} a.hasWalls        the vintage gate's answer — is there a wall at this year
 * @param {string}  a.extentTier      the tier the built extent was sized to (§161g high water)
 * @param {number}  a.builtRadius     today's built radius, view units
 * @param {any}     a.vintage         the compiled `wall-built-year` record, or null
 * @returns {{ circuits:number, extents:number[], epochs:Array<any>, reason:string }}
 */
export function deriveEpochs(a) {
  // ⛔⛔ §240.2 · RING COUNT IS DERIVED, NEVER A KNOB — **AND SO IS EPOCH COUNT** (§257.3a).
  // The refusal is at the door rather than in a comment, because a caller that could pass
  // `epochs: 3` would make every downstream measurement of the ladder meaningless. This is the
  // arm §5 W2 exit 8's first counterfactual fires on.
  for (const k of Object.keys(a)) {
    if (!EPOCH_INPUTS.includes(k)) {
      throw new Error(`epochAxis: undeclared input '${k}' — the epoch ladder is DERIVED, never dialled (§240.2).`
        + ` Declared inputs: ${EPOCH_INPUTS.join(', ')}`);
    }
  }
  const tier = a.extentTier;
  const cap = TIER_CIRCUIT_CAP[tier] == null ? 1 : TIER_CIRCUIT_CAP[tier];
  // ⭐⭐⭐ G-42 · THE FABRIC LADDER COMES FIRST AND THE CIRCUITS ARE A **SUBSET** OF IT. That
  // ordering IS the cure: while the circuit ladder defined the epochs, an unwalled settlement
  // had exactly one vintage BY CONSTRUCTION, and six of sixteen exemplar leaves could not
  // express age at all.
  const fabric = deriveFabricEpochs(a);
  const bounds = fabric.boundaries;
  const walledFor = (extents) => {
    /** @type {Array<any>} */ const epochs = [];
    const set = new Set(extents.map((e) => e.toFixed(9)));
    let seenWalled = 0;
    for (let k = 0; k < bounds.length; k++) {
      const walled = set.has(bounds[k].extent.toFixed(9));
      if (walled) seenWalled++;
      epochs.push({
        index: k,
        extent: bounds[k].extent,
        threshold: bounds[k].tier,
        walled,
        // ⭐ THE KIND IS A FACT ABOUT THE RING, NOT ABOUT THE EPOCH'S POSITION. `old-core` is a
        // circuit a later circuit superseded — which is exactly the set `circuitDemotion.js`
        // takes as its subject.
        kind: walled
          ? (seenWalled < extents.length ? 'old-core' : 'main')
          : (k === bounds.length - 1 && extents.length ? 'suburb' : 'fabric'),
      });
    }
    return epochs;
  };

  if (!a.hasWalls) {
    return {
      circuits: 0,
      extents: [],
      epochs: walledFor([]),
      fabricEpochs: bounds.length,
      fabricReason: fabric.reason,
      reason: `no circuit at this year — the settlement is unwalled or its wall is not yet built;`
        + ` the fabric still carries ${bounds.length} epoch(s) (${fabric.reason}) — G-42: a wall is an`
        + ' EVENT WITHIN the epoch sequence, never its definition (§257.3a)',
    };
  }
  // ⚠ THE VINTAGE IS THE GATE, NOT THE SIZE. Where the founding age is unrecorded the ladder
  // cannot date any threshold, so it claims ONE circuit on today's fabric — UNDERSTATED rather
  // than invented, which is `walls.js`'s own standing rule for the same fact.
  const dated = !!(a.vintage && Number.isFinite(a.vintage.ageAtBuild) && Number.isFinite(a.vintage.year));
  const outermost = bounds[bounds.length - 1].extent;
  if (!dated) {
    return {
      circuits: 1, extents: [outermost], epochs: walledFor([outermost]),
      fabricEpochs: bounds.length, fabricReason: fabric.reason,
      reason: `vintage unknown — ONE circuit on today's fabric, understated rather than invented;`
        + ` the fabric carries ${bounds.length} epoch(s) regardless (G-42)`,
    };
  }
  // ⭐⭐⭐ THE CIRCUIT CANDIDATES ARE THE FABRIC BOUNDARIES AT A **TOWN+** THRESHOLD, so the
  // circuit ladder is a SUBSET of the epoch ladder by construction rather than by agreement —
  // which is exactly what §5 W2 exit 8's last clause asks to be provable.
  const candidates = bounds.filter((b) => b.tier && CIRCUIT_THRESHOLDS.indexOf(b.tier) >= 0)
    .map((b) => b.extent);
  if (!candidates.length) {
    // ⭐⭐ THE TRUTH OVERRIDE, NAMED. A settlement below the town threshold earns NO circuit
    // (§240.2) — and if its dossier says it is walled, that is a TRUTH, not an economy, and it
    // gets exactly one. Reporting it as an override is what settles J-A2-4 rather than leaving
    // the two laws to disagree silently.
    return {
      circuits: 1, extents: [outermost], epochs: walledFor([outermost]),
      fabricEpochs: bounds.length, fabricReason: fabric.reason,
      truthOverride: true,
      reason: `TRUTH OVERRIDE — a ${tier} earns zero circuits from growth (§240.2) and this`
        + ' dossier states walls, so ONE circuit stands on today\'s fabric as a stated fact rather'
        + ` than as an economy; the fabric carries ${bounds.length} epoch(s) (G-42)`,
    };
  }
  // ⭐ A LATER CIRCUIT IS EARNED, NOT MERELY PERMITTED: the previous ring must have been
  // outgrown. This is the one test `walls.js` already applied, now applied at every step.
  /** @type {number[]} */ const earned = [candidates[0]];
  for (let k = 1; k < candidates.length; k++) {
    if (earned[earned.length - 1] <= OUTGROWN_SHARE) earned.push(candidates[k]);
  }
  // ⭐⭐ WHEN THE CAP BINDS, A SETTLEMENT KEEPS ITS **CURRENT** CIRCUIT AND REMEMBERS ITS
  // **FIRST**, and that is history rather than convenience: an intermediate ring was the one
  // that got demolished and built over as the city expanded past it, while the first survives
  // as the change of GRAIN §11.1 draws (its stones long since quarried into the houses) and the
  // last survives because it is still the wall.
  const extents = earned.length <= cap
    ? earned
    : [earned[0]].concat(earned.slice(earned.length - (cap - 1)));
  return {
    circuits: extents.length,
    extents,
    epochs: walledFor(extents),
    fabricEpochs: bounds.length,
    fabricReason: fabric.reason,
    reason: `${extents.length} circuit(s), a SUBSET of ${bounds.length} fabric epoch(s), from the`
      + ` town+ thresholds this settlement passed (${earned.map((e) => e.toFixed(3)).join(' → ')}`
      + ` of today's extent; circuit cap ${cap} at ${tier})`
      + `${earned.length > extents.length ? `; ${earned.length - extents.length} intermediate ring(s) absorbed into the fabric` : ''}`
      + `; ${fabric.reason}`,
  };
}

/** The declared input set of the epoch ladder. ⛔ Anything outside it is refused at the door. */
export const EPOCH_INPUTS = Object.freeze(['hasWalls', 'extentTier', 'builtRadius', 'vintage', 'foundingAge']);

/**
 * ⭐⭐⭐ G-42 · **THE FABRIC EPOCH LADDER** — the cure the chair ruled at §257.3(a):
 *
 * > **EPOCHS ARE FABRIC EPOCHS, NOT CIRCUIT EPOCHS. A wall is an EVENT WITHIN the epoch
 * > sequence, never its definition; a village that grew over two centuries has TWO VINTAGES AND
 * > NO WALL AT ALL.**
 *
 * ⛔ WHAT IT REPLACES, MEASURED. `deriveEpochs` minted one epoch per CIRCUIT plus a suburb, so
 * every unwalled leaf got exactly ONE epoch — thorp, hamlet, village, mountain, fjord and
 * year-018, **six of sixteen** — while PLAN §6.1 *measures* fabric epochs at village 1–2 and
 * town 2–3. Left uncured that makes vintage difference impossible below the wall line and
 * silently makes the walled/unwalled split EQUAL the tier line, which §251 measures as nearly
 * coincident: **invisible in the corpus and fatal in the output.**
 *
 * ⭐⭐ THE DERIVATION IS THE SAME FACT FAMILY §240 ALREADY USES, WHICH IS WHAT KEEPS THE CIRCUIT
 * LADDER A SUBSET RATHER THAN A SIBLING: the tier thresholds a settlement has passed, read off
 * §5's own footprint bands, with the founding age as the gate. **Nothing here is a knob** — a
 * caller cannot ask for three epochs any more than it can ask for three rings.
 *
 * ⛔⛔ AND THE ABSORPTION KEEPS THE **OUTERMOST**, WHICH IS THE OPPOSITE OF THE CIRCUIT RULE AND
 * IS DELIBERATE. §240 keeps a settlement's FIRST circuit because its stones survive as a change
 * of grain; but a metropolis's *thorp-sized* founding patch is 2.3% of its area and is not a
 * legible vintage at metropolis scale — it is inside the oldest surviving ring. Keeping the
 * outermost boundaries is also what makes the third circuit expressible at all: the
 * metropolis's town / city / metropolis thresholds are the outermost three it passed.
 *
 * @param {Object} a the same declared inputs `deriveEpochs` takes
 * @returns {{boundaries:Array<{tier:string|null, extent:number}>, reason:string}}
 */
export function deriveFabricEpochs(a) {
  const tier = a.extentTier;
  const now = Math.max(1, a.builtRadius);
  const cap = Math.min(EPOCH_CEILING, TIER_EPOCH_CAP[tier] == null ? 1 : TIER_EPOCH_CAP[tier]);
  // ⚠ THE FOUNDING AGE IS THE GATE, EXACTLY AS THE VINTAGE IS THE CIRCUIT'S. A settlement with
  // no recorded age has no dated growth, so it has ONE epoch — understated rather than
  // invented, which is the standing rule everywhere else in this file.
  if (!Number.isFinite(a.foundingAge) || a.foundingAge <= 0) {
    return {
      boundaries: [{ tier: null, extent: 1 }],
      reason: 'no founding age recorded — ONE fabric epoch, understated rather than invented',
    };
  }
  /** @type {Array<{tier:string|null, extent:number}>} */ const passed = [];
  for (const t of FABRIC_THRESHOLDS) {
    const share = thresholdRadius(t) / now;
    if (share <= 0) continue;
    passed.push({ tier: t, extent: Math.min(1, share) });
    if (share >= 1) break;                     // beyond today's extent: not yet reached
    if (t === tier) break;                     // and never beyond the tier the extent reached
  }
  if (!passed.length) passed.push({ tier: null, extent: 1 });
  // The fabric beyond the last threshold was laid AFTER it — the suburb, arriving as a
  // consequence of the law rather than as a knife falling (§15.7).
  if (passed[passed.length - 1].extent < 1) passed.push({ tier: null, extent: 1 });
  const kept = passed.length <= cap ? passed : passed.slice(passed.length - cap);
  if (kept.length > EPOCH_CEILING) throw new Error('epochAxis: more than four legible epochs — PLAN §6.1 measures none over 313 plates');
  return {
    boundaries: kept,
    reason: `${kept.length} fabric epoch(s) at ${kept.map((b) => `${b.tier || 'outer'} ${b.extent.toFixed(3)}`).join(' → ')}`
      + ` (${passed.length} threshold(s) passed; epoch cap ${cap} at ${tier}, ceiling ${EPOCH_CEILING})`,
  };
}

/** The mean of a ring's vertices — the centre every epoch extent is taken about. */
export function ringCentroid(poly) {
  let x = 0, y = 0;
  for (const p of poly) { x += p[0]; y += p[1]; }
  return [x / poly.length, y / poly.length];
}

/** Shrink a ring toward a point by a share — the settlement's outline at an earlier extent. */
export function shrinkAbout(poly, c, k) {
  return poly.map(([x, y]) => /** @type {[number,number]} */ ([c[0] + (x - c[0]) * k, c[1] + (y - c[1]) * k]));
}

/**
 * ⭐⭐⭐ THE CONTAINMENT CLOSURE — §240.1's "the wall that COMPLETELY BOUNDS it", made true BY
 * CONSTRUCTION rather than by clipping anything.
 *
 * ⛔ WHY IT IS NEEDED EVEN AFTER THE EPOCH RESTRICTION. `traceWalls` pulls each facet vertex
 * toward defensible ground within ±1.5 margins (rule 2, TERRAIN SERVICE) and then offsets the
 * perimeter outward by ONE margin — so a vertex can finish up to half a margin INSIDE the body
 * it was traced from, and the fabric in that notch is walled OUT of its own epoch. That is the
 * residue of MF-ARCH's 6.8%, and no amount of epoch assignment removes it: it is the trace
 * stepping off its own body.
 *
 * ⛔⛔ AND MY FIRST SPELLING WAS A RADIAL MAX ABOUT THE BODY'S CENTROID — one push per angular
 * sector, to the farthest body point in it. **MEASURED, IT PUSHED FACETS OUT BY UP TO 251 VIEW
 * UNITS ON A 392-UNIT CITY.** A morphological outline is not star-shaped: one long lobe makes
 * the sector's maximum radius wildly larger than the facet's, so the "closure" inflated the
 * whole quadrant. ⭐ THE CLASS: **A RADIAL REPAIR ASSUMES A STAR-SHAPED SUBJECT, AND A TRACED
 * TOWN OUTLINE IS NOT ONE** — the fix has to be as local as the defect.
 *
 * ⛔⛔ ⟦§297.5d⟧ **AND THIS PARAGRAPH USED TO SAY "LOCAL, ONE-SHOT AND BOUNDED BY THE PULL THAT
 * CAUSED IT", WHICH IS TRUE OF STEP 1 AND FALSE OF THE FUNCTION.** §297.5 ordered the correction
 * by name — *"boundEpoch's docstring corrected (the name-describes-belief class)"* — because a
 * reader who took that sentence at face value would model this as a single vertex nudge, and
 * three of its four real properties are the opposite:
 *
 *   the claim              │ what the code does
 *   ───────────────────────┼──────────────────────────────────────────────────────────────────
 *   ONE-SHOT               │ STEP 2 is a **capped sweep of `BOUND_ROUNDS` = 6 rounds**, each one
 *                          │ re-measuring and re-pushing. It stops early only when a round moves
 *                          │ nothing — which is a fixed point, not a single pass
 *   LOCAL                  │ STEP 1 is. STEP 2 translates whole EDGES, so a vertex moves because
 *                          │ of a body point nearest a DIFFERENT edge that shares it
 *   BOUNDED BY THE PULL    │ ⛔ NO. `translateEdgesOut` divides the travel by the cosine between
 *   THAT CAUSED IT         │ the bisector and each edge normal, **clamped at 0.2** — so a sharp
 *                          │ concave corner travels up to **FIVE TIMES** the gap it owes. That
 *                          │ clamp is exactly how a sound ring folds, which is why the kernel
 *                          │ guard had to move INSIDE this loop (MF-D0 §5.2)
 *   EXACT                  │ the cosine division makes the translation exact **where the clamp
 *                          │ does not bind**; at a corner sharper than ~78° it is an over-push
 *
 * ⭐ WHAT IS TRUE AND IS THE PROPERTY THAT MATTERS: **every round moves vertices OUTWARD ONLY, so
 * the sequence is monotone and terminates**, there is no convergence criterion and no tolerance,
 * and the circuit REPORTS its residual — so a cap that was ever too small reds a pin instead of
 * shipping a wall that does not bound its town. A facet already outside the body never moves in
 * STEP 1, so the trace's chords across the bays — circuit economy — survive that step intact.
 * ⚠ `BOUND_ROUNDS` and the 0.2 clamp are UNSOAKED and ride the tuning signature.
 *
 * @param {Array<[number,number]>} perim  the traced perimeter, before the working-margin offset
 * @param {Array<[number,number]>} body   the epoch's own fabric outline
 * @returns {{ ring:Array<[number,number]>, pushed:number, worst:number }}
 */
export function boundEpoch(perim, body) {
  if (perim.length < 3 || body.length < 3) return { ring: perim, pushed: 0, worst: 0 };
  const n = perim.length;
  // ── STEP 1 · NO FACET STANDS INSIDE THE BODY. Move it back onto the body's own boundary
  //    along the shortest way out. A facet already outside does not move at all, so the
  //    trace's chords across the bays — circuit economy — are untouched.
  let pushed = 0, worst = 0;
  let out = perim.map(([x, y]) => {
    if (!pointIn(body, x, y)) return /** @type {[number,number]} */ ([x, y]);
    const q = nearestOnRing(body, x, y);
    const d = Math.sqrt((q[0] - x) * (q[0] - x) + (q[1] - y) * (q[1] - y));
    pushed++;
    if (d > worst) worst = d;
    if (d < 1e-9) return /** @type {[number,number]} */ ([x, y]);
    const k = (d + PAD) / d;
    return /** @type {[number,number]} */ ([x + (q[0] - x) * k, y + (q[1] - y) * k]);
  });
  // ── STEP 2 · AND NO PART OF THE BODY STANDS OUTSIDE THE RING. ⛔ STEP 1 ALONE IS NOT
  //    ENOUGH AND THE MEASUREMENT SAID SO: with every VERTEX outside the body, the CHORD
  //    between two of them can still cut through it — a facet count of 20 on a lumpy outline
  //    leaves long straight runs. ⭐ THE CLASS: **A CONTAINMENT PROVED AT THE VERTICES IS NOT
  //    A CONTAINMENT OF THE POLYGON.**
  //
  // ⚠ IT IS A CAPPED SWEEP, NOT A SOLVER, AND THE DIFFERENCE IS WHAT MAKES IT ADMISSIBLE HERE.
  // Each round only ever moves vertices OUTWARD, so the sequence is monotone and terminates;
  // a round that moves nothing stops it. There is no convergence criterion and no tolerance —
  // and the circuit REPORTS its residual, so a cap that was ever too small reds a pin instead
  // of shipping a wall that does not bound its town.
  for (let round = 0; round < BOUND_ROUNDS; round++) {
    // ⚠ `out.length`, NOT the captured `n`. A repair can SHORTEN the ring, and `translateEdgesOut`
    // sizes its per-edge gap array from this argument — handing it a stale length would walk the
    // sweep off the end of its own polygon. `n` is unchanged on every ring that is never repaired.
    const step = translateEdgesOut(out, body, out.length);
    if (!step.pushed) break;
    // ⭐⭐⭐ §287.12 · THE KERNEL GUARD, AND THE CLOSURE IS THE THIRD PRODUCER OF A CROSSING RING.
    // ⛔ IT DOES NOT FIRE ON THE CORPUS AND IT FIRES ON A FIXTURE, WHICH IS THE WHOLE LESSON.
    // MF-D0's stage measurement (`laneMFD0-stage.log`) reads `CLOSE` equal to `OFFSET` on all
    // seventeen leaves — the sweep introduced nothing there — and the very first run of the new
    // all-ring pin convicted `closedWall.old-core.E0` on the metropolis FIXTURE. The sweep pushes
    // a vertex along its bisector divided by the cosine to its edge normal, floored at 0.2, so a
    // sharp concave corner travels FIVE TIMES the gap it owes; that is how a sound ring folds.
    // ⭐ THE CLASS, and MF-D0 walked into it while curing it: **A STAGE MEASURED ONLY OVER THE
    // CORPUS IS MEASURED OVER A SAMPLE, and "this stage introduces nothing" is a claim about the
    // sample.** The guard runs INSIDE the loop rather than after it, so a later round can re-push
    // any ground a repair exposed — which is what keeps `containmentResidual` at 0.
    out = guardSimpleRing(step.ring);
    pushed += step.pushed;
    if (step.worst > worst) worst = step.worst;
  }
  return { ring: out, pushed, worst };
}

/** A hair beyond the boundary, so a held vertex is OUTSIDE it rather than ON it. */
const PAD = 1e-3;

/**
 * ⭐⭐ SUBDIVIDE A RING SO NO SEGMENT IS LONGER THAN `maxSeg` — the closure's subject.
 *
 * ⛔ THE SLIVER THIS EXISTS FOR. Containment tested at a polygon's VERTICES misses a real shape:
 * two epoch vertices can both stand INSIDE the ring while the epoch's EDGE between them bulges
 * out of it, and a body sitting in that bulge is walled out with every vertex test passing.
 * MEASURED at the end: one body of 15,175, its centroid **0.016 units** inside the epoch's own
 * boundary and 12.4 units outside the wall.
 *
 * ⛔⛔ AND I RECORDED THIS MECHANISM AS REFUTED BEFORE IT WAS — the correction matters more than
 * the code. Densifying first measured "32 bodies before, 32 after", so it was removed as
 * machinery that does nothing. It was measured against a population **dominated by bodies on the
 * half-ring's water flank**, which no closure can or should reach: the river is the fourth wall.
 * With that exemption applied the same change moves the number to zero. ⭐ THE CLASS, and it is
 * MF-ARCH's own "comparing two predicates means varying one thing" from the other side:
 * **A NEGATIVE RESULT MEASURED AGAINST A CONFOUNDED POPULATION IS NOT A NEGATIVE RESULT.**
 */
export function densify(poly, maxSeg) {
  if (poly.length < 2 || !(maxSeg > 0)) return poly;
  /** @type {Array<[number,number]>} */ const out = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    out.push(a);
    const d = Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1]));
    const steps = Math.floor(d / maxSeg);
    for (let k = 1; k <= steps; k++) {
      const t = k / (steps + 1);
      out.push(/** @type {[number,number]} */ ([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]));
    }
  }
  return out;
}

/** How many outward sweeps the closure may take. ⚠ EXACT, and reported: the ring publishes
 *  `containmentResidual`, which is pinned at 0 on every ring of every walled leaf. */
export const BOUND_ROUNDS = 6;

/** ONE outward sweep: every edge translated by the deepest excursion of the body across it. */
function translateEdgesOut(out, body, n) {
  /** @type {number[]} */ const gap = new Array(n).fill(0);
  for (const p of body) {
    if (pointIn(out, p[0], p[1])) continue;
    let bi = 0, bd2 = Infinity;
    for (let i = 0; i < n; i++) {
      const q = nearestOnSegment(out[i], out[(i + 1) % n], p[0], p[1]);
      const d2 = (p[0] - q[0]) * (p[0] - q[0]) + (p[1] - q[1]) * (p[1] - q[1]);
      if (d2 < bd2) { bd2 = d2; bi = i; }
    }
    const d = Math.sqrt(bd2);
    if (d > gap[bi]) gap[bi] = d;
  }
  // ⛔ THE PUSH DIRECTION IS THE RING'S OWN OUTWARD NORMAL, NOT THE DIRECTION OF THE BODY POINT
  // THAT DEMANDED IT. My first spelling used the latter and MEASURED 33 epoch points still
  // outside a dry metropolis ring: a direction nearly parallel to the edge slides the vertex
  // ALONG the curtain instead of growing the polygon. ⭐ THE CLASS: **A REPAIR THAT TAKES ITS
  // DIRECTION FROM THE OFFENDER RATHER THAN FROM THE BOUNDARY CAN FAIL TO REPAIR** — the §232
  // lesson (a "move it back inside" aimed at a centroid) read from the other side.
  //
  // ⛔⛔ AND THE SECOND SPELLING UNDERSHOT BY A COSINE. A vertex moves along the BISECTOR of its
  // two edge normals, so moving it `g` gains only `g·cos θ` of perpendicular clearance on each
  // edge. ⭐ THE CLASS: **A CORNER MOVED ALONG ITS BISECTOR DOES NOT TRANSLATE ITS EDGES BY THE
  // SAME DISTANCE.** The travel is divided by that cosine, which makes the translation exact.
  /** @type {Array<[number,number]>} */ const norm = [];
  for (let i = 0; i < n; i++) norm.push(edgeNormal(out, i, n));
  let pushed = 0, worst = 0;
  const ring = out.map((v, j) => {
    const a = (j - 1 + n) % n;
    if (gap[a] <= 0 && gap[j] <= 0) return v;
    let bx = norm[a][0] + norm[j][0], by = norm[a][1] + norm[j][1];
    const L = Math.sqrt(bx * bx + by * by);
    if (L < 1e-9) return v;
    bx /= L; by /= L;
    const need = (g, m) => (g <= 0 ? 0 : g / Math.max(0.2, bx * m[0] + by * m[1]));
    const t = Math.max(need(gap[a], norm[a]), need(gap[j], norm[j])) + PAD;
    pushed++;
    if (t > worst) worst = t;
    return /** @type {[number,number]} */ ([v[0] + bx * t, v[1] + by * t]);
  });
  return { ring, pushed, worst };
}

/** The OUTWARD unit normal of edge i, oriented by testing a hair along it from the edge's own
 *  midpoint against the ring's interior. Winding-agnostic, so a trace that comes back clockwise
 *  on one leaf and anticlockwise on another is not a bug waiting to happen. */
function edgeNormal(poly, i, n) {
  const a = poly[i], b = poly[(i + 1) % n];
  let nx = b[1] - a[1], ny = -(b[0] - a[0]);
  const L = Math.sqrt(nx * nx + ny * ny);
  if (L < 1e-12) return /** @type {[number,number]} */ ([0, 0]);
  nx /= L; ny /= L;
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
  if (pointIn(poly, mx + nx * 0.05, my + ny * 0.05)) { nx = -nx; ny = -ny; }
  return /** @type {[number,number]} */ ([nx, ny]);
}

/** The closest point on one segment. */
function nearestOnSegment(a, b, px, py) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const L = dx * dx + dy * dy;
  let t = L > 0 ? ((px - a[0]) * dx + (py - a[1]) * dy) / L : 0;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  return /** @type {[number,number]} */ ([a[0] + dx * t, a[1] + dy * t]);
}

/** The closest point on a closed ring's boundary. */
function nearestOnRing(poly, px, py) {
  let best = poly[0], bestD2 = Infinity;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const L = dx * dx + dy * dy;
    let t = L > 0 ? ((px - a[0]) * dx + (py - a[1]) * dy) / L : 0;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    const qx = a[0] + dx * t, qy = a[1] + dy * t;
    const d2 = (px - qx) * (px - qx) + (py - qy) * (py - qy);
    if (d2 < bestD2) { bestD2 = d2; best = [qx, qy]; }
  }
  return best;
}

/** Even-odd point-in-ring. */
export function pointIn(poly, px, py) {
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
