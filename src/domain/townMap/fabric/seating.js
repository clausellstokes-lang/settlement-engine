/**
 * domain/townMap/fabric/seating.js — THE SUPPLY-CHAIN ADJACENCY GRAPH (§161m) and THE
 * SEATING PASS (§175.1's COMPOSITION-ORDER LAW).
 *
 * ⭐⭐ THE COMPOSITION-ORDER LAW, four stages, in this order and no other:
 *
 *   1 CONSTITUTION  roster math only, NO GEOMETRY. Who belongs to which umbrella, how
 *                   many instances each type earns, which districts get founded.
 *                   (organisms.attributeInstitutions)
 *   2 ANCHORING     CATEGORY-LEVEL ONLY. Each organism finds its own ground.
 *                   (organisms.sampleAnchor)
 *   3 GROWTH        the organisms accrete; the umbrella emerges; the fabric packs.
 *   4 SEATING       ⭐ ONE GREEDY SEEDED PASS. Institutions are seated in a fixed order,
 *                   and each one's affinity evaluates TOWARD ALREADY-SEATED INSTITUTIONS
 *                   ONLY.
 *
 * ⛔⛔ STAGE 4 IS THE LOOP-BREAKER, AND IT IS NOW LAW. The obvious way to satisfy mutual
 * adjacency preferences — "the granary wants the mill, the mill wants the granary" — is a
 * relaxation loop run to a fixpoint. It is also a trap, three times over:
 *   • IT MAY NOT CONVERGE, and a non-convergent layout is a non-deterministic layout,
 *     which forfeits the whole same-seed contract.
 *   • IT COUPLES EVERY INSTITUTION TO EVERY OTHER, which destroys the §11.0 inertia law:
 *     adding one shop would nudge every other building in the settlement.
 *   • IT AVERAGES. A relaxed layout is the mean of its constraints, and the mean of a
 *     town's constraints is a diagram. Real towns are the PATH: the mill was here first,
 *     so the granary went beside it, so the market went beside THAT.
 * A single greedy pass in a fixed order IS that path. It terminates by construction, it
 * is byte-stable, and each institution's position depends only on the ones seated before
 * it — so a later arrival cannot move an earlier one.
 *
 * ⭐ THE TWO CONSTRAINT CLASSES (§161m), and the reason the graph is pinnable at all:
 *   PHYSICAL   absolute, NEVER violated at any chaos level. The port sits ON flowing or
 *              harbour water; the water-mill ON its race; the quarry AT its stone; the
 *              ferry AT its crossing. Pinnable as an INVARIANT, run at MAXIMUM chaos with
 *              a planted violation.
 *   LOGISTICAL order-scaled preferences. The garrison near the centre or the walls for
 *              dispatch; the mill close to the fields it grinds and the town it feeds;
 *              the granary BETWEEN mill and market; the smithy on the trafficked street;
 *              stables and coaching inns at the gates; the slaughter yard between the
 *              livestock market and the tanners (who stay downwind and downstream);
 *              warehouses between quay and market. Pinnable as a MONOTONE SATISFACTION
 *              SCORE, with a planted order-insensitive placer that must red.
 *
 * ⭐⭐ THE LAWFULNESS DIAL is what makes this legible rather than merely correct: the
 * satisfaction weight of the LOGISTICAL preferences scales with the settlement's order.
 * A LAWFUL town reads as a diagram of its own supply chains — everything where a
 * quartermaster would put it. A CHAOTIC one shows the same institutions SCATTERED into
 * seeded suboptimality: the granary three streets from the market because nobody planned
 * it. Disorder becomes legible as LOGISTICAL FRICTION, not just as crooked lanes.
 *
 * PURITY: no Date, no Math.random, no runtime trig, no localeCompare.
 */

import { fabricRng, hashUnit } from './fabricRng.js';
import { compareKeys } from './lineage.js';
import { VIEW, sampleAt } from './substrate.js';
import { TRIG_N, cosI, sinI } from './trigTable.js';
import { isInWater, isFarBank } from './waterMode.js';
import { ownerAt } from './organismFields.js';

/**
 * THE SUPPLY-CHAIN EDGES. Each row names the relationship in the dossier's own economy
 * (§8.2), and each is tagged PHYSICAL or LOGISTICAL. The archetype pair is the edge; the
 * weight is how strongly the preference pulls when the settlement is fully lawful.
 * @type {ReadonlyArray<{ from: string, to: string, kind: 'physical'|'logistical', weight: number, why: string }>}
 */
export const SUPPLY_EDGES = Object.freeze([
  { from: 'port', to: 'warehouse', kind: 'logistical', weight: 1.0, why: 'cargo lands and is stored before it is sold' },
  { from: 'warehouse', to: 'market', kind: 'logistical', weight: 0.9, why: 'the store feeds the stall' },
  { from: 'mill', to: 'granary', kind: 'logistical', weight: 1.0, why: 'flour goes straight to the store' },
  { from: 'granary', to: 'market', kind: 'logistical', weight: 0.9, why: 'the granary sits between mill and market' },
  { from: 'craft', to: 'market', kind: 'logistical', weight: 0.7, why: 'the workshop wants the trafficked street' },
  { from: 'hospitality', to: 'market', kind: 'logistical', weight: 0.6, why: 'the inn wants the traffic the market brings' },
  { from: 'garrison', to: 'hall', kind: 'logistical', weight: 0.8, why: 'dispatch: the garrison answers the seat' },
  { from: 'garrison', to: 'wallwork', kind: 'logistical', weight: 0.9, why: 'the garrison mans the works' },
  { from: 'noxious', to: 'noxious', kind: 'logistical', weight: 0.8, why: 'the stinking trades share one edge (and one watercourse)' },
  { from: 'kiln', to: 'extraction', kind: 'logistical', weight: 0.7, why: 'the kiln burns what the workings dig' },
  { from: 'caravan', to: 'warehouse', kind: 'logistical', weight: 0.8, why: 'the caravan yard unloads into the stores' },
  { from: 'worship', to: 'hall', kind: 'logistical', weight: 0.5, why: 'the two seats face each other across the square' },
  { from: 'cloisterQuad', to: 'worship', kind: 'logistical', weight: 0.7, why: 'the school belongs to the church that founded it' },
]);

/**
 * PHYSICAL SITE PREDICATES — absolute, at any chaos. Each returns whether a candidate
 * point satisfies the archetype's hard requirement. An archetype with no physical
 * requirement returns true everywhere, which is the honest default.
 * @type {Readonly<Record<string, (x:number, y:number, ctx:any) => boolean>>}
 */
export const PHYSICAL_SITE = Object.freeze({
  // The port sits ON the water's edge. Not near it — ON it.
  port: (x, y, ctx) => ctx.water.line != null && ctx.distToWater(x, y) < ctx.waterEdge,
  // The water-mill sits ON its race. Where there is no watercourse the mill degrades to
  // the WIND-HILL variant (high ground), and where there is neither it is an ordinary
  // workshop — a TOTAL degenerate chain, each step documented, never a silent drop.
  mill: (x, y, ctx) => (ctx.water.line != null && ctx.distToWater(x, y) < ctx.waterEdge * 2.2)
    || sampleAt(ctx.sub, ctx.sub.height, x, y) > 0.68,
  // The quarry and the adit sit AT their stone: exposed rock means real slope.
  // ⭐⭐ §15.7 — THE WORKINGS GO TO THE ORE, NOT TO THE HANDIEST SLOPE. A bare slope test
  // let the adit take whichever steep cell was nearest the quarter that owned it, which is
  // the "land designed for the settlement" read the clause exists to break. Where the
  // substrate has SITED the resource (and it sites it by a seeded rank, not by the argmax),
  // the workings must be AT it; the slope test survives as the honest fallback for a
  // settlement whose economy names no extractive resource at all.
  extraction: (x, y, ctx) => {
    if (ctx.oreSites && ctx.oreSites.length) {
      for (const r of ctx.oreSites) {
        const dx = x - r.x, dy = y - r.y;
        if (Math.sqrt(dx * dx + dy * dy) <= ctx.resourceReach) return true;
      }
      return false;
    }
    return sampleAt(ctx.sub, ctx.sub.slope, x, y) > 0.34;
  },
  // The circuit's works sit ON the boundary, which the wall member owns.
  wallwork: (x, y, ctx) => ctx.nearBoundary(x, y),
});

/**
 * @typedef {Object} SeatingResult
 * @property {import('./institutions.js').Landmark[]} seated
 * @property {number} satisfaction  0..1 — the LOGISTICAL score the pin asserts on
 * @property {number} physicalViolations  must be 0 at every chaos level
 * @property {string[]} notes
 */

/**
 * ⭐ THE SEATING PASS. One greedy seeded traversal.
 *
 * ORDER matters and is fixed: monumentals first (they claimed their ground first in
 * history too), then by archetype weight, then by instance key for a total order. Each
 * institution samples a bounded set of candidate points inside its own umbrella district,
 * scores them, and takes one under a seeded weighted roll.
 *
 * THE SCORE, in the §167 form:
 *   ring legality × PHYSICAL absolutes × affinity toward ALREADY-SEATED × suitability
 * with the affinity term scaled by the lawfulness dial.
 *
 * @param {Object} args @returns {SeatingResult}
 */
export function seatInstitutions(args) {
  const {
    landmarks, organisms, partition, umbrella, field, sub, water, web,
    lawfulness, seeding, tierScale: scale,
  } = args;

  const waterEdge = water.width ? water.width * 1.6 : 12;
  const distToWater = (x, y) => {
    if (!water.line) return Infinity;
    let best = Infinity;
    for (const p of water.line) {
      const d = Math.sqrt((p[0] - x) * (p[0] - x) + (p[1] - y) * (p[1] - y));
      if (d < best) best = d;
    }
    return best;
  };
  const nearBoundary = (x, y) => {
    for (const comp of umbrella.components) {
      for (const p of comp) {
        const d = Math.sqrt((p[0] - x) * (p[0] - x) + (p[1] - y) * (p[1] - y));
        if (d < scale.builtRadius * 0.10) return true;
      }
    }
    return false;
  };
  // ⭐ §15.7's SITED RESOURCES reach the seating pass here. The workings go to the ORE, and
  // the ore is deliberately not on the handiest slope (substrate.siteResources).
  // ⛔⛔ THE FILTER WAS TWO NEEDS AND `extraction` IS MORE THAN TWO TRADES. A SALT WORKS is an
  // extractive institution and salt's contract is `flat-pan`; held to the gems workings it
  // could satisfy nothing, and MEASURED on the mountain leaf that is exactly what happened —
  // *"Salt works (extraction) found no candidate satisfying its physical constraint"*, 317
  // units from the only site the filter admitted. ⭐ THE CLASS: **an archetype that bundles
  // several trades cannot be held to one trade's ground.** Every EXTRACTIVE contract counts.
  const EXTRACTIVE_NEEDS = ['workable-slope', 'exposed-stone', 'flat-pan'];
  const oreSites = (sub.resourceSites || []).filter((r) => EXTRACTIVE_NEEDS.indexOf(r.needs) >= 0);
  const ctx = {
    water, sub, waterEdge, distToWater, nearBoundary, oreSites,
    resourceReach: Math.max(70, (scale && scale.builtRadius ? scale.builtRadius : 200) * 0.42),
  };

  const orgByKey = new Map();
  for (const o of organisms) orgByKey.set(o.districtId, o);

  // ⭐ THE FIXED ORDER. Monumental first, then heavier archetypes, then by key. The tie-
  // break on the instance key is what makes the whole pass byte-stable.
  const order = landmarks.slice().sort((a, b) => (Number(b.monumental) - Number(a.monumental))
    || (b.size - a.size)
    || compareKeys(a.instanceKey, b.instanceKey));

  // ⭐⭐ §15.3's COMPOUND ORDERING arrives here as `preSeated`: the LARGE institutional
  // compounds have already taken their ground in an earlier call, and this pass seats the
  // ordinary institutions INTO what is left. They are in `seated` from the first line, so
  // every ordinary institution's affinity evaluates toward them — which is the correct
  // history as well as the correct code: the cathedral was there before the chandler.
  /** @type {import('./institutions.js').Landmark[]} */
  const seated = Array.isArray(args.preSeated) ? args.preSeated.slice() : [];
  /** @type {string[]} */ const notes = [];
  let physicalViolations = 0;
  let satisfactionSum = 0, satisfactionCount = 0;

  for (const lm of order) {
    const rng = fabricRng(seeding.seed, `seat.${lm.instanceKey}`, { variant: seeding.variant });
    const org = orgByKey.get(lm.districtId) || organisms[0];
    if (!org) { seated.push(lm); continue; }

    // ── CANDIDATES: a bounded ring of points around the organism's own body, plus its
    //    anchor. Bounded so the pass is O(N · K) rather than O(N · grid), and seeded so
    //    two institutions of the same archetype in the same quarter do not consider the
    //    identical set.
    /** @type {Array<{ x:number, y:number, weight:number, sat:number }>} */ const cands = [];
    const K = 40;
    for (let i = 0; i < K; i++) {
      const t = hashUnit(`${lm.instanceKey}|cand|${i}`);
      const u = hashUnit(`${lm.instanceKey}|candr|${i}`);
      // Angles are INTEGER INDICES into the frozen table — the cross-machine ULP law.
      const ang = Math.floor(t * TRIG_N);
      const rad = org.reach * (0.08 + u * 0.92) * ringPull(lm.ring);
      const x = org.anchor.x + cosI(ang) * rad;
      const y = org.anchor.y + sinI(ang) * rad;
      if (x < 20 || y < 20 || x > VIEW - 20 || y > VIEW - 20) continue;
      if (isInWater(water, x, y) && lm.archetype !== 'port') continue;
      if (isFarBank(water, x, y)) continue;

      // ── PHYSICAL ABSOLUTES.
      const physical = PHYSICAL_SITE[lm.archetype];
      if (physical && !physical(x, y, ctx)) continue;

      // ── RING LEGALITY (§161c). An OUTLYING institution wants to be outside the
      //    umbrella; an INTRAMURAL one wants to be inside it. The ring is a real
      //    disposition, so violating it costs rather than being impossible.
      const insideTown = ownerAt(partition, x, y) >= 0;
      const ringOk = lm.ring === 'outlying' ? !insideTown
        : lm.ring === 'extramural-near' ? !insideTown
          : lm.ring === 'edge' ? true
            : insideTown;
      const ringLegality = ringOk ? 1 : 0.06;

      // ── AFFINITY TOWARD ALREADY-SEATED ONLY (the loop-breaker).
      let sat = 0, want = 0;
      for (const edge of SUPPLY_EDGES) {
        if (edge.from !== lm.archetype) continue;
        want += edge.weight;
        let best = 0;
        for (const other of seated) {
          if (other.archetype !== edge.to) continue;
          const d = Math.sqrt((other.x - x) * (other.x - x) + (other.y - y) * (other.y - y));
          const near = 1 - Math.min(1, d / (scale.builtRadius * 0.55));
          if (near > best) best = near;
        }
        sat += best * edge.weight;
      }
      const satisfaction = want > 0 ? sat / want : 0;
      // THE LAWFULNESS DIAL. At lawfulness 0 the affinity term is flat and the roll is
      // driven by ground alone — the granary lands three streets from the market because
      // nobody planned it, which is the legible face of disorder.
      const affinity = 1 + satisfaction * 1.6 * lawfulness;

      const suit = field.score[cellOf(field, x, y)] || 0.02;
      const weight = ringLegality * affinity * Math.max(0.03, suit);
      cands.push({ x, y, weight: weight * weight, sat: satisfaction });
    }

    // ⭐⭐ THE PHYSICAL FALLBACK. A physical constraint is ABSOLUTE, so when the organism's
    // own ring offers no point that satisfies it, the answer is NOT to record a violation —
    // it is to look where the constraint actually lives. A port is on the water; so walk
    // THE WATER LINE. A quarry is at its stone; so walk the steepest ground. Measured
    // before this: 3 violations across 12 maximum-chaos settlements, every one a port or a
    // mill whose district happened to anchor inland. The degenerate chain is TOTAL and each
    // step is documented — water, then high ground for the wind-mill variant, then the
    // organism's anchor with the strain RECORDED, never a silent drop.
    if (!cands.length && PHYSICAL_SITE[lm.archetype]) {
      // ⭐⭐⭐ MF-W1b · **THE CHAIN PROBES THE GROUND THE CONSTRAINT LIVES ON**, which is what
      // this block's own comment has always claimed and what its body did not do.
      //
      // ⛔⛔ WHAT IT DID, AND THE MEASUREMENT THAT CONVICTS IT. Every archetype probed the
      // WATER LINE, and only a leaf with no watercourse at all fell through to a second arm
      // whose comment reads *"the steepest ground the substrate offers"* and whose body pushes
      // **64 UNIFORMLY RANDOM FRAME POINTS**. So:
      //   · on the FJORD, `Mills (2-5)` (an `extraction` body) probed 556 water points, of
      //     which **0 of 556** can satisfy an ore predicate — a dry-ground constraint tested
      //     only on water is a constraint tested nowhere;
      //   · on the HAMLET, the random arm sampled a frame of which **1.2%** satisfies the ore
      //     disc, i.e. an expected 0.8 hits in 64 draws — a coin flip wearing a search's name.
      // That is the whole of `physicalViolations` 1 → 7: the §161a resource cure made the
      // `extraction` predicate a small disc around a DELIBERATELY INCONVENIENT site (§15.7),
      // and the fallback never looked where the disc is. ⭐ THE CLASS, and it is this estate's
      // own most expensive one once more: **A COMMENT THAT NAMES A MECHANISM THE BODY DOES NOT
      // IMPLEMENT IS A DEFECT NOBODY CAN SEE**, because every reader checks the body against
      // the comment and finds them agreeing about intent.
      const probes = [];
      const physical = PHYSICAL_SITE[lm.archetype];
      // 1 · THE RESOURCE'S OWN SITES — where an extractive constraint actually lives.
      for (const r of oreSites) probes.push([r.x, r.y], [r.handiest.x, r.handiest.y]);
      // 2 · THE WATER LINE — where a port's and a mill's constraint lives.
      if (water.line) for (const p of water.line) probes.push(p);
      // 3 · THE STEEPEST GROUND THE SUBSTRATE OFFERS, actually ranked. The old arm's own
      //     words, finally executed: cells sorted by slope, ties on index for a total order.
      {
        /** @type {Array<{x:number,y:number,s:number,k:number}>} */ const steep = [];
        for (let j = 1; j < sub.n - 1; j += 2) {
          for (let i = 1; i < sub.n - 1; i += 2) {
            const k = j * sub.n + i;
            steep.push({ x: (i + 0.5) * sub.cell, y: (j + 0.5) * sub.cell, s: sub.slope[k], k });
          }
        }
        steep.sort((a, b) => (b.s - a.s) || (a.k - b.k));
        for (let i = 0; i < 64 && i < steep.length; i++) probes.push([steep[i].x, steep[i].y]);
      }
      void physical;
      for (const [px, py] of probes) {
        if (px < 12 || py < 12 || px > VIEW - 12 || py > VIEW - 12) continue;
        if (!PHYSICAL_SITE[lm.archetype](px, py, ctx)) continue;
        // Prefer the satisfying point NEAREST the organism it belongs to: the town's own
        // quay is the stretch of water closest to the quarter that uses it.
        const d = Math.sqrt((px - org.anchor.x) * (px - org.anchor.x) + (py - org.anchor.y) * (py - org.anchor.y));
        cands.push({ x: px, y: py, weight: 1 / (1 + d * d), sat: 0 });
      }
      if (cands.length) notes.push(`${lm.name} (${lm.archetype}) took its PHYSICAL site outside its district's ring — the constraint is absolute and the ground for it lies elsewhere`);
    }

    if (!cands.length) {
      // ⚠ AN UNPLACEABLE INSTITUTION IS A REPORTED DERIVATION EVENT, never a silent drop
      //   (§6: "constraint conflicts resolve by seeded retry, never silent drop"). It is
      //   seated at its organism's anchor and the reason is recorded.
      notes.push(`${lm.name} (${lm.archetype}) found no candidate satisfying its physical constraint — seated at its district anchor and RECORDED`);
      seated.push({ ...lm, x: org.anchor.x, y: org.anchor.y });
      if (PHYSICAL_SITE[lm.archetype]) physicalViolations++;
      continue;
    }
    const chosen = cands[rng.weighted(cands)];
    satisfactionSum += chosen.sat;
    satisfactionCount++;
    seated.push({ ...lm, x: chosen.x, y: chosen.y });
  }

  // ── §15.6 · THE BOUNDED REPAIR PASS ─────────────────────────────────────────
  // ⚠ SKIPPED on the COMPOUND pass (§15.3's first call): repairing a half-seated town would
  // move compounds against constraints the ordinary institutions have not yet expressed,
  // and the repair is defined as a pass over the FINISHED sheet.
  const repair = args.deferRepair
    ? { seated, repairs: [], unrepaired: [], notes: [] }
    : repairSeating({ seated, ctx, partition, field, water, scale, lawfulness, seeding });

  return {
    seated: repair.seated,
    satisfaction: satisfactionCount ? satisfactionSum / satisfactionCount : 0,
    physicalViolations,
    repairs: repair.repairs,
    unrepaired: repair.unrepaired,
    notes: notes.concat(repair.notes),
  };
}

/**
 * ⭐⭐⭐ §15.6 · THE BOUNDED REPAIR PASS — "greedy seating stands, followed by a bounded
 * deterministic repair pass: hard constraints, then soft preferences, then aesthetics, with
 * explicit diagnostics for every repair and every failure; SILENT NONSENSE IS FORBIDDEN."
 *
 * ⭐ WHY THIS DOES NOT RE-OPEN THE LOOP THE COMPOSITION-ORDER LAW CLOSED, which is the
 * question a reader should ask first. §175.1 forbids a RELAXATION LOOP — an iteration to a
 * fixpoint over mutual preferences — for three stated reasons: it may not converge, it
 * couples every institution to every other, and it AVERAGES a town into a diagram. This
 * pass has none of those properties:
 *   • it is a FIXED number of sweeps over a FIXED order, so it terminates by construction;
 *   • each repair moves ONE institution and reads only the seated set as it stands, exactly
 *     as the greedy pass did — no institution's position becomes a function of a later
 *     arrival's, so the §11.0 inertia law is untouched;
 *   • it repairs VIOLATIONS, not preferences — it never moves an institution that is merely
 *     sub-optimal, which is what would average the town.
 * The greedy pass remains the PATH; this is the surveyor going back over his own sheet and
 * finding he has drawn the tannery in the river.
 *
 * ⭐ THE THREE TIERS, IN ORDER, AND THE ORDER IS THE POINT. A repair that fixed an aesthetic
 * complaint by creating a hard violation would be worse than the complaint; running hard
 * first and never letting a later tier undo an earlier one's fix is what makes the pass
 * safe to run at all.
 *   HARD       in water · off the leaf · on ground the fabric forbids · a PHYSICAL site
 *              predicate violated. Absolute: these are drawings of impossible things.
 *   SOFT       the §161c siting ring violated (an OUTLYING abbey seated in the core).
 *              Real dispositions, so a violation costs and is repaired where a legal site
 *              is within reach.
 *   AESTHETIC  two monumental silhouettes overlapping. Not a truth error — two buildings
 *              CAN be close — but at plan scale two overlapping landmarks read as one
 *              malformed building, which fails the legibility ladder's LOOK layer.
 *
 * ⛔ AND EVERY FAILURE IS REPORTED. An institution the pass cannot repair keeps its seat and
 * gains a diagnostic naming the constraint it still violates. That is the §15.6 clause that
 * matters most: the map is allowed to be wrong, and is never allowed to be quietly wrong.
 */
export function repairSeating(args) {
  const { seated, ctx, partition, field, water, scale, lawfulness, seeding } = args;
  /** @type {string[]} */ const notes = [];
  /** @type {Array<{ key:string, tier:string, constraint:string, from:[number,number], to:[number,number] }>} */
  const repairs = [];
  /** @type {Array<{ key:string, tier:string, constraint:string }>} */ const unrepaired = [];

  const out = seated.map((lm) => ({ ...lm }));
  const ordered = out.slice().sort((a, b) => compareKeys(a.instanceKey, b.instanceKey));

  /** Does this seat violate a HARD constraint? Returns the constraint's name or null. */
  const hardFault = (lm) => {
    if (lm.x < 14 || lm.y < 14 || lm.x > VIEW - 14 || lm.y > VIEW - 14) return 'off the leaf';
    if (lm.archetype !== 'port' && isInWater(water, lm.x, lm.y)) return 'standing in the water';
    if (isFarBank(water, lm.x, lm.y) && lm.archetype !== 'port') return 'on the far bank with no crossing';
    const physical = PHYSICAL_SITE[lm.archetype];
    if (physical && !physical(lm.x, lm.y, ctx)) return `physical site predicate for '${lm.archetype}'`;
    return null;
  };

  /** Does this seat violate its §161c ring? */
  const softFault = (lm) => {
    const insideTown = ownerAt(partition, lm.x, lm.y) >= 0;
    if ((lm.ring === 'outlying' || lm.ring === 'extramural-near') && insideTown) {
      return `ring '${lm.ring}' seated INSIDE the fabric`;
    }
    if (lm.ring === 'intramural' && !insideTown) return "ring 'intramural' seated OUTSIDE the fabric";
    return null;
  };

  // A bounded, seeded ring of candidate points about a seat — the same instrument the
  // greedy pass used, so a repaired seat is a seat the pass could have chosen.
  const around = (lm, radius) => {
    /** @type {Array<[number,number]>} */ const pts = [];
    for (let i = 0; i < REPAIR_PROBES; i++) {
      const a = Math.floor(hashUnit(`${lm.instanceKey}|repair|${i}`) * TRIG_N);
      const r = radius * (0.25 + hashUnit(`${lm.instanceKey}|repairr|${i}`) * 0.95);
      pts.push([lm.x + cosI(a) * r, lm.y + sinI(a) * r]);
    }
    return pts;
  };

  const move = (lm, tier, constraint, ok) => {
    // Widening rings: a repair prefers the NEAREST legal ground, because an institution
    // that has to move is still the same institution and its neighbours have not changed.
    for (const radius of [scale.builtRadius * 0.18, scale.builtRadius * 0.45, scale.builtRadius * 1.1]) {
      let best = null, bestD = Infinity;
      for (const [x, y] of around(lm, radius)) {
        if (!ok(x, y)) continue;
        const d = (x - lm.x) * (x - lm.x) + (y - lm.y) * (y - lm.y);
        if (d < bestD) { bestD = d; best = [x, y]; }
      }
      if (best) {
        repairs.push({ key: lm.instanceKey, tier, constraint, from: [lm.x, lm.y], to: best });
        notes.push(`REPAIR (${tier}): ${lm.name} moved ${Math.round(Math.sqrt(bestD))}u — ${constraint}`);
        lm.x = best[0]; lm.y = best[1];
        return true;
      }
    }
    unrepaired.push({ key: lm.instanceKey, tier, constraint });
    notes.push(`⚠ UNREPAIRED (${tier}): ${lm.name} still violates ${constraint} — no legal site within reach, RECORDED rather than hidden`);
    return false;
  };

  // ── TIER 1 · HARD.
  for (const lm of ordered) {
    const fault = hardFault(lm);
    if (!fault) continue;
    move(lm, 'hard', fault, (x, y) => {
      const probe = { ...lm, x, y };
      return hardFault(probe) === null;
    });
  }

  // ── TIER 2 · SOFT. A soft repair may NEVER create a hard fault.
  for (const lm of ordered) {
    if (hardFault(lm)) continue;                 // still broken at tier 1: leave it alone
    const fault = softFault(lm);
    if (!fault) continue;
    move(lm, 'soft', fault, (x, y) => {
      const probe = { ...lm, x, y };
      return hardFault(probe) === null && softFault(probe) === null;
    });
  }

  // ── TIER 3 · AESTHETIC: monumental silhouettes may not overlap.
  const monuments = ordered.filter((l) => l.monumental);
  for (let i = 0; i < monuments.length; i++) {
    const lm = monuments[i];
    const clash = monuments.find((o, j) => j !== i && overlaps(o, lm));
    if (!clash) continue;
    move(lm, 'aesthetic', `monumental silhouette overlaps '${clash.name}'`, (x, y) => {
      const probe = { ...lm, x, y };
      if (hardFault(probe) || softFault(probe)) return false;
      return !monuments.some((o) => o !== lm && overlaps(o, probe));
    });
  }

  void field; void lawfulness; void seeding;
  return { seated: out, repairs, unrepaired, notes };
}

/** Two landmark silhouettes overlap when their footprint discs do. The size field is the
 * archetype's own drawn weight, so this is the drawing's question asked in the drawing's
 * own units. */
function overlaps(a, b) {
  const r = (a.size + b.size) * SILHOUETTE_R;
  const dx = a.x - b.x, dy = a.y - b.y;
  return dx * dx + dy * dy < r * r;
}

/** How many probes a repair considers per ring. Bounded — §15.6 says bounded. */
const REPAIR_PROBES = 24;

/** View units of footprint per unit of `size`, for the overlap test. §42/§43 VALUE,
 * read off the lens: `archetypeShape` draws a hall at about 2.1 × size across. */
const SILHOUETTE_R = 1.15;

/** How far out from the organism's anchor a ring wants to sit, as a multiplier. */
function ringPull(ring) {
  return ring === 'outlying' ? 2.1 : ring === 'extramural-near' ? 1.45 : ring === 'edge' ? 1.05 : 0.72;
}

/** Cell index into a suitability field. */
function cellOf(field, x, y) {
  let i = Math.floor(x / field.cell), j = Math.floor(y / field.cell);
  if (i < 0) i = 0; else if (i >= field.n) i = field.n - 1;
  if (j < 0) j = 0; else if (j >= field.n) j = field.n - 1;
  return j * field.n + i;
}
