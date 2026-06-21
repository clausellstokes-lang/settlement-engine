/**
 * domain/worldPulse/occupation.js — the occupation STATE machine + the
 * CAPPED/DELAYED/CONDITIONAL occupier-benefit loop + burden/resistance/overextension.
 *
 * A successful conquest (warDeployment.js → cause:'conquest') becomes a STATEFUL
 * relationship recorded in `worldState.occupations`, keyed by the OCCUPIED settlement:
 *
 *     worldState.occupations[occupiedId] = {
 *       occupierId, state, sinceTick, stateHeld, resistance, benefitYield, lastTick
 *     }
 *
 * THE STATE MACHINE (pantheon hysteresis + bounded-transition idiom):
 *   contested → unstable → extractive → stabilized → vassalized       (advance)
 *   stabilized/extractive → unstable → contested → liberated          (slide back)
 * A fresh conquest STARTS at `contested`. It advances toward `stabilized` over ticks
 * ONLY when the occupier suppresses resistance / installs a compliant regime / secures
 * supply; under live resistance it stalls or slides back. NO 1-tick flips: a transition
 * requires a sustained suitability margin held for STATE_HOLD_TICKS (the dwell), and at
 * most ONE rung of movement per occupation per tick.
 *
 * ── THE SNOWBALL IS THE DANGER ZONE (sacred). ────────────────────────────────────
 * The occupier-benefit loop is a CROSS-SETTLEMENT feedback loop — the exact pathology
 * the pantheon containment cap exists to prevent. It is:
 *   - CAPPED: a per-occupation cap (PER_OCCUPATION_BENEFIT_CAP) AND a per-occupier total
 *     containment cap (OCCUPIER_BENEFIT_CONTAINMENT) bound how much war support ALL of an
 *     occupier's occupations can ever yield. Multiple occupations CANNOT compound into
 *     unbounded strength.
 *   - DELAYED: benefit ∝ the occupation STATE (contested ≈ 0; it rises only as the
 *     occupation STABILIZES over ticks). A just-conquered settlement yields ~0.
 *   - CONDITIONAL: benefit ∝ the occupied settlement's actual USEFULNESS (the military-
 *     capacity facets: manpower/institutions/materiel/logistics/economy/will + tier/pop)
 *     MINUS active resistance, AND scaled by the state.
 * Benefit is surfaced as a war_spoils condition on the OCCUPIER that EASES war_exhaustion
 * (extends supply endurance / sustains more fronts) — but the containment cap means the
 * relief is bounded no matter how many settlements an occupier holds. A soak test pins
 * this bound across a long run (occupation does not produce unbounded compounding strength).
 *
 * ── BURDEN + RESISTANCE (must be able to OUTWEIGH benefit). ───────────────────────
 * Each occupation imposes a garrison/admin burden on the OCCUPIER (occupation_burden →
 * economic_capacity + defense_readiness), and an `occupation_resistance` condition on the
 * OCCUPIED that GROWS when the occupied is intact/loyalist/populous/undevastated and
 * SHRINKS when devastated/compliant. OVEREXTENSION: each additional occupation an occupier
 * holds raises its per-occupation burden (too many occupations degrade the occupier). A
 * contested/resisted/distant occupation's burden is designed to outweigh its (near-zero)
 * benefit — only a STABILIZED, low-resistance occupation is net-positive.
 *
 * DETERMINISM (sacred): no Date.now/Math.random/argless new Date; pure (no rng — the
 * state machine is deterministic, like the pantheon). The ledger is deep-cloned + read-
 * last/write-next by the caller. PRE-TICK aggregation only (usefulness/resistance read
 * from the pre-tick snapshot). Codepoint-sorted iteration everywhere output order matters.
 *
 * CONDITIONAL MATERIALIZATION (byte-identity, sacred): the occupations ledger is ABSENT
 * from worldState while no occupation exists (it materializes ONLY on the first conquest),
 * so a legacy / war-off campaign carries no `occupations` key and stays byte-identical
 * under the dormancy oracle. (worldState.js deep-clones a PRESENT occupations ledger and
 * leaves an ABSENT one absent — never materializes it unconditionally, like pantheon/
 * warPosture.) GATED behind warLayerEnabled at the call site.
 */

import { clamp01 } from '../region/contestMath.js';
import { stablePart } from './worldState.js';
import { deriveMilitaryCapacity } from './militaryStrength.js';
import {
  normalizeRelationshipEdge,
  relationshipKeyFromEdge,
  ensureRelationshipState,
  relationshipRoles,
  getRelationshipSettlements,
} from './relationshipEvolution.js';

/** @param {any} a @param {any} b @returns {number} */
const codepoint = (a, b) => (String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0);

// ── State machine rungs ──────────────────────────────────────────────────────────
// An ordered ladder. A conquest enters at `contested`; it climbs toward `stabilized`
// (and can convert to `vassalized`) as resistance is suppressed and a compliant regime
// is installed, and slides back down under resistance. `liberated` is the exit rung —
// a liberated occupation is removed from the ledger (it has no entry).
const STATE_LADDER = Object.freeze(['contested', 'unstable', 'extractive', 'stabilized', 'vassalized']);
/** @type {Record<string, number>} */
const STATE_RANK = Object.freeze({ contested: 0, unstable: 1, extractive: 2, stabilized: 3, vassalized: 4 });

/**
 * The benefit SCALE per state (0..1) — the DELAY term. contested yields ~0; the yield
 * rises only as the occupation stabilizes. vassalized is the steady-state max (a willing
 * client pays more reliably than a freshly-occupied town). This is what makes a just-
 * conquered settlement yield nothing — the snowball cannot start from a fresh conquest.
 */
const STATE_BENEFIT_SCALE = Object.freeze({
  contested: 0.0,
  unstable: 0.12,
  extractive: 0.45,
  stabilized: 0.85,
  vassalized: 1.0,
});

/**
 * The burden SCALE per state (0..1). A contested/unstable occupation is the HEAVIEST to
 * hold (the garrison is fighting, not extracting); a stabilized/vassalized one is cheap
 * to administer. So a contested occupation is doubly bad for the occupier — near-zero
 * benefit AND maximum burden (the burden-outweighs-benefit guarantee for a fresh/resisted
 * conquest).
 */
const STATE_BURDEN_SCALE = Object.freeze({
  contested: 1.0,
  unstable: 0.85,
  extractive: 0.55,
  stabilized: 0.30,
  vassalized: 0.18,
});

/** Typed benefit-scale lookup (0 for an unknown state). Strict-clean string indexing.
 * @param {any} state @returns {number} */
const benefitScaleFor = (state) => /** @type {Record<string, number>} */ (STATE_BENEFIT_SCALE)[String(state)] ?? 0;
/** Typed burden-scale lookup (1 — heaviest — for an unknown state). Strict-clean.
 * @param {any} state @returns {number} */
const burdenScaleFor = (state) => /** @type {Record<string, number>} */ (STATE_BURDEN_SCALE)[String(state)] ?? 1;

// ── Hysteresis + containment tunables (calibration is load-bearing). ──────────────
// STATE_HOLD_TICKS — the dwell: a state transition only lands once the suitability has
// argued for the SAME direction for this many consecutive ticks (no 1-tick flips).
const STATE_HOLD_TICKS = 2;
// The suitability margin band: advance requires suitability ≥ ADVANCE_THRESHOLD; slide
// back requires it ≤ REGRESS_THRESHOLD. The gap between them is the sticky hysteresis
// band — inside it the state holds (a small wobble changes nothing).
const ADVANCE_THRESHOLD = 0.58;
const REGRESS_THRESHOLD = 0.34;
// Below this suitability a CONTESTED occupation collapses outright → liberated (the
// occupier never established control and the settlement throws it off).
const COLLAPSE_THRESHOLD = 0.12;

// ── Resistance dynamics (the occupied-side condition). ────────────────────────────
// Resistance is a 0..1 scalar on the occupation record, ratcheted each tick: it GROWS
// (toward a target ∝ the occupied's intactness/loyalty/population) and SHRINKS as the
// occupation stabilizes / the population is devastated / a compliant regime is installed.
const RESISTANCE_GROW_PER_TICK = 0.18;  // pull toward the intactness-driven target
const RESISTANCE_DECAY_PER_TICK = 0.14; // suppression/compliance erodes it
// A resistance condition is only surfaced once it clears this floor (a quiescent
// occupation does not stamp a resistance condition — byte-light).
const RESISTANCE_CONDITION_FLOOR = 0.20;

// ── Benefit caps (THE ANTI-SNOWBALL). ─────────────────────────────────────────────
// PER_OCCUPATION_BENEFIT_CAP — the most one occupation can EVER yield (0..1 war-support
// units), before the per-occupier containment. OCCUPIER_BENEFIT_CONTAINMENT — the HARD
// CAP on the SUM of all of an occupier's occupations' yields. This is the pantheon
// containment idiom: no matter how many settlements an occupier holds, its TOTAL benefit
// is bounded by OCCUPIER_BENEFIT_CONTAINMENT, so occupations cannot compound into
// unbounded strength. (Diminishing returns are applied BEFORE the cap so the cap is a
// hard ceiling, not just an asymptote.)
const PER_OCCUPATION_BENEFIT_CAP = 0.45;
const OCCUPIER_BENEFIT_CONTAINMENT = 0.9;
// Diminishing returns: each additional occupation contributes LESS to the total benefit
// (the occupier's administrative bandwidth is finite). The Nth occupation (sorted by
// yield, richest first) is discounted by DIMINISHING_BASE^(rank). Combined with the
// containment cap this guarantees a strictly bounded, converging total.
const DIMINISHING_BASE = 0.62;

// ── Burden caps + overextension. ──────────────────────────────────────────────────
// PER_OCCUPATION_BURDEN_CAP — the most one occupation can cost the occupier (0..1).
// OVEREXTENSION_PER_OCCUPATION — each occupation an occupier holds raises the per-
// occupation burden by this much (so the 4th occupation is costlier to hold than the
// 1st). UNLIKE the benefit (which is hard-capped at the occupier total), the burden is
// NOT total-capped — it scales with the count, so a greedy occupier degrades itself.
const PER_OCCUPATION_BURDEN_CAP = 0.6;
const OVEREXTENSION_PER_OCCUPATION = 0.12;

// The benefit→exhaustion-relief conversion. A unit of benefit eases this much
// war_exhaustion-equivalent severity on the occupier (the war_spoils condition is the
// inverse of war_exhaustion: it EXTENDS supply endurance). Bounded by the cap above.
const BENEFIT_RELIEF_SCALE = 0.55;

/** @param {any} v @param {number} [d] @returns {number} */
const num = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);

/**
 * A fresh occupation record at the `contested` rung. `resistance` starts moderate (a
 * just-conquered population has not yet organized, but the conquest itself breeds it).
 * @param {string} occupierId
 * @param {number} tick
 * @returns {{ occupierId: string, state: string, sinceTick: number, stateHeld: number, resistance: number, benefitYield: number, lastTick: number }}
 */
export function createOccupationRecord(occupierId, tick) {
  return {
    occupierId: String(occupierId),
    state: 'contested',
    sinceTick: Math.max(0, Math.floor(num(tick))),
    stateHeld: 0,
    resistance: 0.35,
    benefitYield: 0,
    lastTick: Math.max(0, Math.floor(num(tick))),
  };
}

/**
 * The numeric rung of a state label. Unknown labels resolve to the `contested` floor.
 * @param {string} state
 * @returns {number}
 */
function stateRank(state) {
  const r = STATE_RANK[state];
  return Number.isFinite(r) ? r : 0;
}

/**
 * The 0..1 USEFULNESS of an occupied settlement — the CONDITIONAL term of the benefit
 * loop. Reads the military-capacity facets (manpower/institutions/materiel/logistics/
 * economy/will) which already fold in tier/pop/economic_capacity/food/military &
 * defensive institutions/war-materiel/trade — exactly the proposal's usefulness list.
 * DEVASTATION (a heavy war_pressure / population collapse on the occupied) lowers it. A
 * pure read of the pre-tick snapshot item. The benefit a stabilized occupation yields is
 * proportional to THIS — a rich, intact city is worth occupying; a devastated thorpe is not.
 *
 * @param {any} item  the occupied settlement's pre-tick snapshot item.
 * @returns {number} 0..1
 */
export function occupiedUsefulness(item) {
  if (!item) return 0;
  const economicCapacityScore = item?.causal?.scores?.economic_capacity;
  const model = deriveMilitaryCapacity(item, {
    economicCapacityScore: Number.isFinite(economicCapacityScore) ? economicCapacityScore : undefined,
  });
  // theoreticalCapacity already weighs tier/pop/institutions/materiel/logistics/economy/
  // will into one 0..100 number — the latent worth of holding this settlement. Normalize.
  let usefulness = clamp01(num(model.theoreticalCapacity) / 100);
  // Devastation discount: a settlement ground down by the conquest (heavy war_pressure)
  // is worth less to extract from — scorched earth lowers the prize.
  const conditions = Array.isArray(item?.activeConditions) ? item.activeConditions : [];
  let devastation = 0;
  for (const c of conditions) {
    if (c?.archetype === 'war_pressure') devastation = Math.max(devastation, num(c.severity));
  }
  usefulness = clamp01(usefulness * (1 - 0.4 * clamp01(devastation)));
  return usefulness;
}

/**
 * The 0..1 RESISTANCE TARGET for an occupied settlement — what resistance trends toward.
 * Resistance GROWS when the occupied is INTACT (high usefulness/population, not
 * devastated) and LOYALIST (strong governing legitimacy — a populace that backed its old
 * rulers resents the occupier). It is LOW when the settlement is devastated/compliant.
 * Pure read of the pre-tick item.
 *
 * @param {any} item
 * @returns {number} 0..1
 */
export function resistanceTarget(item) {
  if (!item) return 0;
  const usefulness = occupiedUsefulness(item);
  // Loyalty: public legitimacy of the (pre-occupation) order — a legitimate prior regime
  // leaves a populace more willing to resist. Read the settlement's legitimacy score.
  const legit = num(item?.settlement?.powerStructure?.publicLegitimacy?.score, 50) / 100;
  // Population mass: a populous town can field a resistance; a hamlet cannot sustain one.
  const popRaw = item?.settlement?.population;
  const pop = typeof popRaw === 'number' ? popRaw : num(popRaw?.total, 0);
  const popMass = pop > 0 ? clamp01(Math.log10(Math.max(10, pop)) / 5) : 0;
  // Intact, loyalist, populous → high resistance target. Weighted blend, 0..1.
  let target = clamp01(0.5 * usefulness + 0.3 * clamp01(legit) + 0.2 * popMass);
  // A COMPLIANT (installed-puppet) regime dampens the will to resist — the occupier has a
  // local government doing its bidding, so even a populous loyalist town's resistance
  // trends LOWER. This is what lets a compliant occupation break out of `contested` and
  // stabilize (vs an intact, un-co-opted population that resists indefinitely).
  if (hasCompliantRegime(item)) target = clamp01(target * 0.45);
  return target;
}

/**
 * Does the occupied settlement carry a COMPLIANT (installed/puppet) regime? An occupation
 * authority faction with the 'occupier' modifier present AND governing-side factions
 * already disarmed signals a compliant regime is in place — which SUPPRESSES resistance
 * and SPEEDS stabilization. Pure read of the pre-tick item's powerStructure.
 * @param {any} item
 * @returns {boolean}
 */
function hasCompliantRegime(item) {
  const factions = item?.settlement?.powerStructure?.factions;
  if (!Array.isArray(factions)) return false;
  const hasOccupier = factions.some((/** @type {any} */ f) => Array.isArray(f?.modifiers) && f.modifiers.includes('occupier'));
  const localsSubdued = factions.some((/** @type {any} */ f) => Array.isArray(f?.modifiers) && (f.modifiers.includes('occupied') || f.modifiers.includes('disarmed')));
  return hasOccupier && localsSubdued;
}

/**
 * The 0..1 SUITABILITY for ADVANCING an occupation toward stabilization this tick — the
 * input to the state-machine hysteresis. HIGH when resistance is low, a compliant regime
 * is installed, and the occupier still physically holds it (an army still there or the
 * occupation freshly secured); LOW when resistance is high. The state machine advances
 * when suitability ≥ ADVANCE_THRESHOLD, regresses when ≤ REGRESS_THRESHOLD, holds inside
 * the band. Pure.
 *
 * @param {{ resistance: number }} record
 * @param {any} occupiedItem
 * @param {boolean} occupierStillPresent  is the occupier's army still committed here?
 * @returns {number} 0..1
 */
export function stabilizationSuitability(record, occupiedItem, occupierStillPresent) {
  const resistance = clamp01(num(record?.resistance));
  const compliant = hasCompliantRegime(occupiedItem) ? 0.22 : 0;
  // Garrison presence helps hold the ground while stabilizing.
  const garrison = occupierStillPresent ? 0.12 : 0;
  // Suitability falls ~1:1 with resistance; compliance + garrison lift it.
  return clamp01(0.7 - resistance + compliant + garrison);
}

/**
 * Advance ONE occupation's RESISTANCE for the tick (read-last/write-next). Resistance
 * grows toward its target (intact/loyalist/populous) and decays with suppression
 * (compliant regime) and state (a stabilized occupation has broken the resistance). The
 * net move is bounded per tick. Pure; returns the next resistance 0..1.
 *
 * @param {{ resistance: number, state: string }} record
 * @param {any} occupiedItem
 * @returns {number} 0..1
 */
export function advanceResistance(record, occupiedItem) {
  const prev = clamp01(num(record?.resistance));
  const target = resistanceTarget(occupiedItem);
  const compliant = hasCompliantRegime(occupiedItem);
  // The state itself suppresses resistance as the occupation matures (a vassalized client
  // resists least). The benefit scale (0 at contested → 1 at vassalized) is the maturity
  // proxy; (1 − scale) is how much the occupation is "still fighting" rather than holding.
  const stateSuppress = clamp01(1 - benefitScaleFor(record?.state));
  // Grow toward target; decay from suppression. A compliant regime accelerates the decay.
  const grow = prev < target ? Math.min(RESISTANCE_GROW_PER_TICK, target - prev) * clamp01(stateSuppress) : 0;
  const decay = RESISTANCE_DECAY_PER_TICK * (compliant ? 1.4 : 1) * (1 - clamp01(stateSuppress) * 0.5);
  return clamp01(prev + grow - decay);
}

/**
 * Advance ONE occupation's STATE for the tick, applying the hysteresis dwell + a single-
 * rung-per-tick bound + the collapse→liberated exit. Pure. Returns the next state, the
 * next dwell counter, and whether the occupation was LIBERATED (it should exit the ledger).
 *
 * - suitability ≥ ADVANCE_THRESHOLD argues UP one rung; ≤ REGRESS_THRESHOLD argues DOWN
 *   one rung; inside the band the state holds (dwell resets).
 * - A transition only LANDS once the same direction has been argued for STATE_HOLD_TICKS
 *   consecutive ticks (the dwell). At most ONE rung of movement per tick.
 * - A `contested` occupation whose suitability collapses below COLLAPSE_THRESHOLD is
 *   LIBERATED outright (the occupier never took hold). A regression BELOW `contested`
 *   (rank 0) is likewise a liberation.
 *
 * @param {{ state: string, stateHeld: number }} record
 * @param {number} suitability  0..1 from stabilizationSuitability.
 * @returns {{ state: string, stateHeld: number, liberated: boolean }}
 */
export function advanceOccupationState(record, suitability) {
  const curRank = stateRank(record?.state);
  const curTier = STATE_LADDER[curRank];
  const s = clamp01(suitability);

  // Collapse: a contested occupation with no control left is thrown off entirely.
  if (curTier === 'contested' && s <= COLLAPSE_THRESHOLD) {
    return { state: 'contested', stateHeld: 0, liberated: true };
  }

  // Which direction does suitability argue for this tick?
  let dir = 0;
  if (s >= ADVANCE_THRESHOLD && curRank < STATE_LADDER.length - 1) dir = +1;
  else if (s <= REGRESS_THRESHOLD) dir = -1;

  if (dir === 0) {
    // Inside the sticky band — hold, reset the dwell.
    return { state: curTier, stateHeld: 0, liberated: false };
  }

  // A direction is argued. The dwell counts CONSECUTIVE same-direction ticks. We store a
  // SIGNED dwell: positive for advance-pressure, negative for regress-pressure, so a
  // flip of direction resets it (belt-and-suspenders against oscillation).
  const prevHeld = num(record?.stateHeld);
  const sameDir = Math.sign(prevHeld) === dir;
  const nextHeld = (sameDir ? prevHeld : 0) + dir;
  if (Math.abs(nextHeld) < STATE_HOLD_TICKS) {
    // Not matured yet — hold the state, carry the dwell.
    return { state: curTier, stateHeld: nextHeld, liberated: false };
  }

  // Matured — move ONE rung in the argued direction; reset the dwell.
  const nextRank = curRank + dir;
  if (nextRank < 0) {
    // Regressed below contested → liberated.
    return { state: 'contested', stateHeld: 0, liberated: true };
  }
  return { state: STATE_LADDER[Math.min(STATE_LADDER.length - 1, nextRank)], stateHeld: 0, liberated: false };
}

/**
 * Compute the CAPPED/DELAYED/CONDITIONAL benefit each occupier draws this tick, from the
 * NEXT-tick occupation ledger (states + resistance already advanced) and the pre-tick
 * snapshot (usefulness). THE ANTI-SNOWBALL lives here:
 *
 *   rawYield(occ) = usefulness(occupied) × STATE_BENEFIT_SCALE[state] × (1 − resistance)
 *   per-occupation cap  → min(rawYield, PER_OCCUPATION_BENEFIT_CAP)
 *   per occupier: sort its occupations richest-first, apply DIMINISHING_BASE^rank, SUM,
 *                 then HARD-CAP the sum at OCCUPIER_BENEFIT_CONTAINMENT.
 *
 * The containment cap is the keystone: an occupier's TOTAL benefit is bounded regardless
 * of how many settlements it holds, so occupations cannot compound into unbounded strength.
 *
 * @param {Record<string, any>} occupations  the NEXT-tick ledger (post state/resistance advance).
 * @param {(id:string)=>any} occupiedItemFor  pre-tick snapshot item for an occupied id.
 * @returns {{ perOccupier: Record<string, number>, perOccupation: Record<string, number> }}
 *   perOccupier: occupierId → total capped benefit (0..OCCUPIER_BENEFIT_CONTAINMENT).
 *   perOccupation: occupiedId → that occupation's (pre-diminishing, per-occupation-capped) yield.
 */
export function computeOccupierBenefit(occupations, occupiedItemFor) {
  /** @type {Record<string, number>} */
  const perOccupation = {};
  /** @type {Record<string, Array<{ occupiedId: string, yield: number }>>} */
  const byOccupier = {};
  // Codepoint-sorted occupied ids → deterministic aggregation.
  for (const occupiedId of Object.keys(occupations || {}).sort(codepoint)) {
    const rec = occupations[occupiedId];
    if (!rec?.occupierId) continue;
    const scale = benefitScaleFor(rec.state);
    if (scale <= 0) { perOccupation[occupiedId] = 0; continue; }
    const usefulness = occupiedUsefulness(occupiedItemFor(occupiedId));
    const resistance = clamp01(num(rec.resistance));
    // CONDITIONAL: ∝ usefulness × (1 − resistance); DELAYED: × state scale.
    const raw = usefulness * scale * (1 - resistance);
    const capped = Math.min(PER_OCCUPATION_BENEFIT_CAP, clamp01(raw));
    perOccupation[occupiedId] = capped;
    const occId = String(rec.occupierId);
    (byOccupier[occId] = byOccupier[occId] || []).push({ occupiedId, yield: capped });
  }

  /** @type {Record<string, number>} */
  const perOccupier = {};
  for (const occupierId of Object.keys(byOccupier).sort(codepoint)) {
    // Richest occupation first (so the diminishing discount hits the marginal ones),
    // codepoint tie-break for determinism.
    const list = byOccupier[occupierId].sort((a, b) => (b.yield - a.yield) || codepoint(a.occupiedId, b.occupiedId));
    let total = 0;
    for (let rank = 0; rank < list.length; rank += 1) {
      total += list[rank].yield * Math.pow(DIMINISHING_BASE, rank);
    }
    // HARD CONTAINMENT CAP — the anti-snowball ceiling.
    perOccupier[occupierId] = Math.min(OCCUPIER_BENEFIT_CONTAINMENT, total);
  }
  return { perOccupier, perOccupation };
}

/**
 * Compute the BURDEN each occupier pays this tick — garrison + admin cost per occupation,
 * scaled by the occupation STATE (a contested occupation is the heaviest) and by
 * OVEREXTENSION (each occupation an occupier holds raises the per-occupation burden). The
 * burden is NOT total-capped: it scales with the count, so a greedy occupier degrades
 * itself (the overextension property). Returns occupierId → total burden severity.
 *
 * @param {Record<string, any>} occupations  the NEXT-tick ledger.
 * @returns {Record<string, number>}
 */
export function computeOccupierBurden(occupations) {
  /** @type {Record<string, Array<any>>} */
  const byOccupier = {};
  for (const occupiedId of Object.keys(occupations || {}).sort(codepoint)) {
    const rec = occupations[occupiedId];
    if (!rec?.occupierId) continue;
    (byOccupier[String(rec.occupierId)] = byOccupier[String(rec.occupierId)] || []).push(rec);
  }
  /** @type {Record<string, number>} */
  const out = {};
  for (const occupierId of Object.keys(byOccupier).sort(codepoint)) {
    const list = byOccupier[occupierId];
    const count = list.length;
    // Overextension: holding N occupations raises EACH occupation's burden.
    const overextension = OVEREXTENSION_PER_OCCUPATION * Math.max(0, count - 1);
    let total = 0;
    for (const rec of list) {
      const stateBurden = burdenScaleFor(rec.state);
      const resistance = clamp01(num(rec.resistance));
      // A resisted occupation is heavier (suppression ties down more force).
      const per = Math.min(PER_OCCUPATION_BURDEN_CAP, clamp01(0.18 * stateBurden + 0.5 * stateBurden * resistance + overextension));
      total += per;
    }
    out[occupierId] = total;
  }
  return out;
}

/**
 * Is `occupiedId` still physically occupied by `occupierId`'s army (a war_front / committed
 * deployment from the occupier onto it)? A liberated/relieved occupation loses this. Used to
 * tilt the stabilization suitability (a garrison helps hold the ground). Pure read of the
 * post-mint graph + deployments.
 * @param {any} graph
 * @param {Record<string, any>} deployments
 * @param {string} occupierId
 * @param {string} occupiedId
 * @returns {boolean}
 */
function occupierStillPresent(graph, deployments, occupierId, occupiedId) {
  const dep = deployments?.[occupierId];
  if (dep?.targetId && String(dep.targetId) === String(occupiedId)) return true;
  for (const channel of graph?.channels || []) {
    if (channel?.type !== 'war_front' || channel?.status !== 'confirmed') continue;
    if (String(channel.from) === String(occupierId) && String(channel.to) === String(occupiedId)) return true;
  }
  return false;
}

/**
 * A condition outcome (the coup-verdict / war-layer shape). Flows through
 * applyWorldPulseOutcomes UNCHANGED.
 * @param {{ id: string, archetype: string, targetSaveId: string, severity: number, headline: string, summary: string, reasons: string[], tick: number, sourceEventTargetId: string, causes: any[] }} args
 */
function conditionOutcome({ id, archetype, targetSaveId, severity, headline, summary, reasons, tick, sourceEventTargetId, causes }) {
  return {
    id,
    type: 'condition',
    candidateType: archetype,
    ruleId: `occupation_${archetype}`,
    ruleFamily: 'stressor',
    applyMode: 'auto',
    probability: 1,
    targetSaveId,
    severity: clamp01(severity),
    headline,
    summary,
    reasons,
    condition: {
      archetype,
      severity: clamp01(severity),
      triggeredAt: { tick, sourceEventType: 'OCCUPATION_LAYER', sourceEventTargetId },
      causes,
    },
  };
}

/**
 * The set of occupied settlement ids that this tick's conquests just created — each
 * conquest power_transfer (cause:'conquest') from the war layer seeds a fresh `contested`
 * occupation keyed by the conquered target, occupied by the toPower's occupier. Read from
 * the war layer's outcomes. Returns [{ occupiedId, occupierId }].
 *
 * @param {any[]} warOutcomes  evaluateWarLayer().outcomes
 * @returns {Array<{ occupiedId: string, occupierId: string }>}
 */
export function freshConquestsFrom(warOutcomes = []) {
  /** @type {Array<{ occupiedId: string, occupierId: string }>} */
  const out = [];
  for (const o of warOutcomes) {
    if (o?.type !== 'power_transfer' || o?.powerTransfer?.cause !== 'conquest') continue;
    const occupiedId = o.targetSaveId != null ? String(o.targetSaveId) : null;
    // The occupier id is stamped on the conquest's condition cause source (the occupier's
    // save id) — warDeployment emits `causes:[{ source: occupierId, ... }]`.
    const occupierId = o?.condition?.causes?.[0]?.source != null ? String(o.condition.causes[0].source) : null;
    if (occupiedId && occupierId) out.push({ occupiedId, occupierId });
  }
  return out.sort((a, b) => codepoint(a.occupiedId, b.occupiedId));
}

/**
 * Settlements liberated/relieved this tick (occupation broken). Read from the deployment-
 * return + occupation outcomes: an `occupation_lifted` or `siege_lifted` condition on a
 * settlement means it threw off / relieved its occupation. Those occupations exit the
 * ledger. Returns a Set of occupied ids.
 * @param {any[]} returnOutcomes  deploymentReturnOutcomes() results
 * @returns {Set<string>}
 */
export function liberatedIdsFrom(returnOutcomes = []) {
  const ids = new Set();
  for (const o of returnOutcomes) {
    const arche = o?.condition?.archetype || o?.candidateType;
    if ((arche === 'occupation_lifted' || arche === 'siege_lifted') && o?.targetSaveId != null) {
      ids.add(String(o.targetSaveId));
    }
  }
  return ids;
}

/**
 * Find the regional-graph edge between two settlements (either orientation), returning
 * its canonical relationship key + the raw edge. Null when no edge exists. Pure read.
 * @param {any} snapshot
 * @param {string} a
 * @param {string} b
 * @returns {{ key: string, edge: any }|null}
 */
function edgeBetween(snapshot, a, b) {
  for (const rawEdge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
    const { from: rawFrom, to: rawTo } = getRelationshipSettlements(rawEdge);
    const from = String(rawFrom ?? '');
    const to = String(rawTo ?? '');
    if ((from === String(a) && to === String(b)) || (from === String(b) && to === String(a))) {
      return { key: relationshipKeyFromEdge(rawEdge), edge: rawEdge };
    }
  }
  return null;
}

/**
 * Vassalization integration: a STABILIZED occupation the state machine advanced to the
 * `vassalized` rung CONVERTS to a formal vassal relationship — the occupation matures
 * into a vassalage EDGE. Emitted as the canonical `relationship_label_change` outcome (the
 * SAME shape a subjugation contest emits, the labelProposal idiom) so the vassal edge
 * forms through relationshipEvolution's existing vassal-label apply path (state-first
 * seniority, channel bundle, hierarchy cascade) — NOT a parallel model. Keyed on the REAL occupier↔
 * occupied edge so applyRelationshipLabelToGraph can relabel it; skipped if no edge exists
 * (the apply path needs an edge to relabel). Codepoint-sorted; emits once on arrival.
 *
 * @param {Record<string, any>} occupations  the NEXT-tick ledger.
 * @param {any} snapshot   the pre-tick snapshot (for the occupier↔occupied edge).
 * @param {(id:string)=>any} nameFor
 * @param {number} tick
 * @param {Set<string>|null} [arrivedThisTick]  occupied ids that FIRST reached `vassalized`
 *   this tick (prevState !== 'vassalized'). Only these emit — a stable vassalized occupation,
 *   which also holds at stateHeld 0 / lastTick = tick, must NOT re-emit (finding 3).
 * @returns {any[]}
 */
export function vassalizationOutcomes(occupations, snapshot, nameFor, tick, arrivedThisTick = null) {
  const out = [];
  for (const occupiedId of Object.keys(occupations || {}).sort(codepoint)) {
    const rec = occupations[occupiedId];
    if (!rec?.occupierId) continue;
    if (rec.state !== 'vassalized') continue;
    // Emit ONCE, on the tick the occupation first ARRIVES at vassalized. A stable
    // vassalized occupation that merely HELD this tick also carries stateHeld 0 +
    // lastTick = tick (advanceOccupationState returns stateHeld 0 when the top rung
    // holds), so the old stateHeld/lastTick gate re-fired the relationship_label_change
    // + 'bends the knee' chronicle every tick. The arrived-this-tick signal is the
    // authoritative one-shot edge; fall back to the old gate only when it is not provided
    // (direct callers/tests that do not thread the prev-state transition).
    if (arrivedThisTick) {
      if (!arrivedThisTick.has(String(occupiedId))) continue;
    } else if (num(rec.stateHeld) !== 0 || num(rec.lastTick) !== num(tick)) {
      continue;
    }
    // The apply path RELABELS an existing edge — locate the real occupier↔occupied edge.
    const found = edgeBetween(snapshot, rec.occupierId, occupiedId);
    if (!found) continue;
    const occupierName = nameFor(rec.occupierId);
    const occupiedName = nameFor(occupiedId);
    const fromType = String(found.edge?.relationshipType || found.edge?.type || 'hostile');
    out.push({
      id: `world_outcome.occupation_vassalized.${stablePart(occupiedId)}.${tick}`,
      type: 'relationship',
      candidateType: 'occupation_vassalized',
      ruleId: 'occupation_vassalized',
      ruleFamily: 'relationship',
      applyMode: 'auto',
      probability: 1,
      relationshipKey: found.key,
      targetSaveId: String(rec.occupierId),
      severity: 0.5,
      headline: `${occupiedName} bends the knee to ${occupierName}`,
      summary: `${occupierName}'s occupation of ${occupiedName} has stabilized into formal vassalage — the occupied settlement now serves as a client state.`,
      reasons: [`Occupation stabilized to vassalized (resistance ${num(rec.resistance).toFixed(2)}).`],
      relationshipPatch: { proposedRelationshipType: 'vassal', trajectory: 'transitioning' },
      proposalPayload: {
        kind: 'relationship_label_change',
        relationshipKey: found.key,
        fromType,
        toType: 'vassal',
        reason: `${occupierName}'s occupation of ${occupiedName} stabilized into vassalage.`,
      },
      metadata: { fromType, toType: 'vassal' },
    });
  }
  return out;
}

/**
 * Evaluate the occupation layer for one tick — THE state machine + benefit/burden/
 * resistance. GATED + byte-identical when OFF (a pure no-op returning the existing
 * ledger untouched + empty outcomes).
 *
 * Sequencing (read-last/write-next, deterministic):
 *  1. SEED fresh conquests as `contested` occupations (keyed by occupied id).
 *  2. DROP liberated occupations (exit the ledger).
 *  3. For each surviving occupation (codepoint-sorted): advance RESISTANCE, then advance
 *     STATE (hysteresis dwell + single-rung + collapse→liberated), all from the PRE-TICK
 *     snapshot. A collapse drops the entry.
 *  4. Compute the CAPPED/DELAYED/CONDITIONAL per-occupier BENEFIT and the BURDEN.
 *  5. Emit: occupation_resistance (on the occupied), occupation_burden (on the occupier),
 *     war_spoils (the capped benefit relief, on the occupier), and vassalization
 *     relationship outcomes for occupations that reached `vassalized`.
 *
 * @param {Object} args
 * @param {any} args.snapshot        the SINGLE pre-tick snapshot (byId carries settlement + causal).
 * @param {any} args.worldState      carries the pre-tick occupations ledger.
 * @param {any} args.graph           the POST-mint regional graph (for garrison-presence reads).
 * @param {Record<string, any>} args.deployments  the live one-army ledger (post war-layer).
 * @param {any[]} [args.warOutcomes]  this tick's war-layer outcomes (fresh conquests).
 * @param {any[]} [args.returnOutcomes]  this tick's deployment-return outcomes (liberations).
 * @param {number} [args.tick]
 * @param {{ warLayerEnabled?: boolean }} [args.rules]
 * @returns {{ outcomes: any[], occupations: Record<string, any>, dispositionDeltas: Array<{id:string, outcome:'win'|'loss', magnitude?:number}> }}
 */
export function evaluateOccupations({ snapshot, worldState, graph, deployments = {}, warOutcomes = [], returnOutcomes = [], tick = 0, rules = {} }) {
  const existing = (worldState?.occupations && typeof worldState.occupations === 'object') ? worldState.occupations : {};
  if (!rules?.warLayerEnabled) {
    // OFF: pure no-op. Return the existing ledger untouched (absent stays absent).
    return { outcomes: [], occupations: existing, dispositionDeltas: [] };
  }

  const t = Math.max(0, Math.floor(num(tick)));
  const nameFor = (/** @type {any} */ id) => {
    const item = snapshot?.byId?.get?.(String(id));
    return item?.name || item?.settlement?.name || String(id);
  };
  const itemFor = (/** @type {any} */ id) => snapshot?.byId?.get?.(String(id));

  // ── Step 1+2: seed fresh conquests, drop liberated ones. Work on a COPY (read-last/
  // write-next — never mutate worldState's ledger). ────────────────────────────────
  /** @type {Record<string, any>} */
  const occupations = {};
  for (const id of Object.keys(existing).sort(codepoint)) {
    occupations[id] = { ...existing[id] };
  }
  const liberatedIds = liberatedIdsFrom(returnOutcomes);
  for (const { occupiedId, occupierId } of freshConquestsFrom(warOutcomes)) {
    // A fresh conquest seeds a contested occupation. IDEMPOTENCY (finding 2): if the SAME
    // occupier already holds this settlement, treat the re-conquest as a NO-OP — do not
    // reset it to `contested`/0.35 resistance, which would rewind all stabilization
    // progress every tick a stale war_front re-fires the conquest. Only a DIFFERENT
    // occupier (a genuine re-conquest) overwrites the record (one occupier per settlement).
    const prior = occupations[occupiedId];
    if (prior?.occupierId && String(prior.occupierId) === String(occupierId)) continue;
    occupations[occupiedId] = createOccupationRecord(occupierId, t);
  }
  // Liberated settlements exit the ledger (a returning army broke the occupation).
  for (const occupiedId of [...liberatedIds].sort(codepoint)) {
    if (occupations[occupiedId]) delete occupations[occupiedId];
  }

  /** @type {any[]} */
  const outcomes = [];
  /** @type {Array<{id:string, outcome:'win'|'loss', magnitude?:number}>} */
  const dispositionDeltas = [];
  // Occupied ids that FIRST reached `vassalized` this tick (prevState !== 'vassalized').
  // The vassalization relationship outcome fires ONCE on arrival, not every tick the
  // occupation holds at vassalized (finding 3).
  /** @type {Set<string>} */
  const arrivedAtVassalized = new Set();

  // ── Step 3: advance resistance + state for each surviving occupation. ─────────────
  for (const occupiedId of Object.keys(occupations).sort(codepoint)) {
    const rec = occupations[occupiedId];
    if (!rec?.occupierId) { delete occupations[occupiedId]; continue; }
    // A vanished occupied/occupier (no longer a canon member) → drop the entry.
    if (!snapshot?.byId?.has?.(occupiedId) || !snapshot?.byId?.has?.(String(rec.occupierId))) {
      delete occupations[occupiedId];
      continue;
    }
    const occupiedItem = itemFor(occupiedId);
    const present = occupierStillPresent(graph, deployments, rec.occupierId, occupiedId);

    // Resistance first (from the pre-tick state), then suitability, then state.
    const nextResistance = advanceResistance(rec, occupiedItem);
    const suitability = stabilizationSuitability({ ...rec, resistance: nextResistance }, occupiedItem, present);
    const advanced = advanceOccupationState(rec, suitability);

    if (advanced.liberated) {
      // The occupation collapsed (the occupier lost control). Exit the ledger; the
      // occupied settlement banks a (re)liberation; the occupier banks a disposition loss.
      delete occupations[occupiedId];
      dispositionDeltas.push({ id: String(rec.occupierId), outcome: 'loss', magnitude: 0.6 });
      const occupiedName = nameFor(occupiedId);
      const occupierName = nameFor(rec.occupierId);
      outcomes.push(conditionOutcome({
        id: `world_outcome.occupation_collapsed.${stablePart(occupiedId)}.${t}`,
        archetype: 'occupation_lifted',
        targetSaveId: occupiedId,
        severity: 0.3,
        headline: `${occupiedName} throws off ${occupierName}`,
        summary: `The occupation of ${occupiedName} collapsed under resistance — ${occupierName} could never hold it, and the settlement reclaims its own authority.`,
        reasons: [`Occupation suitability collapsed (resistance ${nextResistance.toFixed(2)}).`],
        tick: t,
        sourceEventTargetId: String(rec.occupierId),
        causes: [{ source: occupiedId, effect: 'occupation_lifted', reason: `${occupiedName}'s resistance broke ${occupierName}'s occupation.` }],
      }));
      continue;
    }

    const prevState = rec.state;
    occupations[occupiedId] = {
      ...rec,
      state: advanced.state,
      stateHeld: advanced.stateHeld,
      resistance: nextResistance,
      lastTick: t,
    };
    // A stabilization advance banks a small disposition WIN for the occupier (a
    // consolidating empire grows more confident); a regression a small loss.
    if (stateRank(advanced.state) > stateRank(prevState)) {
      dispositionDeltas.push({ id: String(rec.occupierId), outcome: 'win', magnitude: 0.3 });
    } else if (stateRank(advanced.state) < stateRank(prevState)) {
      dispositionDeltas.push({ id: String(rec.occupierId), outcome: 'loss', magnitude: 0.3 });
    }
    // Record the one-shot arrival edge for the vassalization outcome (finding 3): the
    // occupation just CLIMBED to vassalized from a lower rung this tick.
    if (advanced.state === 'vassalized' && prevState !== 'vassalized') {
      arrivedAtVassalized.add(String(occupiedId));
    }

    // ── Resistance condition on the OCCUPIED (grows on intact/loyalist, shrinks on
    // devastated/compliant). Only surfaced once it clears the floor (byte-light). ────
    if (nextResistance >= RESISTANCE_CONDITION_FLOOR) {
      const occupiedName = nameFor(occupiedId);
      const occupierName = nameFor(rec.occupierId);
      outcomes.push(conditionOutcome({
        id: `world_outcome.occupation_resistance.${stablePart(occupiedId)}.${t}`,
        archetype: 'occupation_resistance',
        targetSaveId: occupiedId,
        severity: nextResistance,
        headline: `${occupiedName} resists its occupiers`,
        summary: `Sabotage, noncompliance, and an organizing resistance harry ${occupierName}'s grip on ${occupiedName}.`,
        reasons: [`Resistance at ${nextResistance.toFixed(2)} (occupation ${advanced.state}).`],
        tick: t,
        sourceEventTargetId: String(rec.occupierId),
        causes: [{ source: occupiedId, effect: 'occupation_resistance', reason: `${occupiedName} resists ${occupierName}'s occupation.` }],
      }));
    }
  }

  // ── Step 4: the CAPPED/DELAYED/CONDITIONAL benefit + the burden. ──────────────────
  const { perOccupier: benefit } = computeOccupierBenefit(occupations, itemFor);
  const burden = computeOccupierBurden(occupations);

  // ── Step 5: emit per-occupier burden + war_spoils (capped benefit relief). ────────
  // Iterate the union of occupiers (codepoint-sorted) so each occupier gets one of each.
  const occupierIds = [...new Set([...Object.keys(benefit), ...Object.keys(burden)])].sort(codepoint);
  for (const occupierId of occupierIds) {
    if (!snapshot?.byId?.has?.(occupierId)) continue;
    const occupierName = nameFor(occupierId);
    const occCount = Object.keys(occupations).filter(id => String(occupations[id]?.occupierId) === occupierId).length;

    const burdenSeverity = clamp01(num(burden[occupierId]));
    if (burdenSeverity > 0) {
      outcomes.push(conditionOutcome({
        id: `world_outcome.occupation_burden.${stablePart(occupierId)}.${t}`,
        archetype: 'occupation_burden',
        targetSaveId: occupierId,
        severity: burdenSeverity,
        headline: `${occupierName} is stretched thin holding its conquests`,
        summary: `Garrisons, administrators, and suppression tie down ${occupierName}'s strength across ${occCount} occupation${occCount === 1 ? '' : 's'}.`,
        reasons: [`Occupation burden ${burdenSeverity.toFixed(2)} across ${occCount} occupation${occCount === 1 ? '' : 's'} (overextension scales with count).`],
        tick: t,
        sourceEventTargetId: occupierId,
        causes: [{ source: occupierId, effect: 'occupation_burden', reason: `${occupierName} garrisons and administers ${occCount} occupied settlement${occCount === 1 ? '' : 's'}.` }],
      }));
    }

    // war_spoils: the CAPPED benefit relief. It EASES war_exhaustion (extends supply
    // endurance), modelled as an easing condition whose severity is the capped benefit.
    const benefitYield = clamp01(num(benefit[occupierId]));
    if (benefitYield > 0) {
      const relief = clamp01(benefitYield * BENEFIT_RELIEF_SCALE);
      outcomes.push({
        id: `world_outcome.war_spoils.${stablePart(occupierId)}.${t}`,
        type: 'condition',
        candidateType: 'war_spoils',
        ruleId: 'occupation_war_spoils',
        ruleFamily: 'stressor',
        applyMode: 'auto',
        probability: 1,
        targetSaveId: occupierId,
        severity: relief,
        headline: `${occupierName} draws strength from its occupations`,
        summary: `Tribute, levies, and materiel from stabilized occupations sustain ${occupierName}'s war effort.`,
        reasons: [`Occupier benefit ${benefitYield.toFixed(2)} (HARD-CAPPED at ${OCCUPIER_BENEFIT_CONTAINMENT}); relief ${relief.toFixed(2)} eases war exhaustion.`],
        // war_spoils is the INVERSE of war_exhaustion — it RELIEVES economic_capacity. The
        // apply path treats it as an easing condition (status 'easing'); it feeds the
        // homeostasis dial the OTHER way (extending endurance), bounded by the cap.
        condition: {
          archetype: 'war_spoils',
          severity: relief,
          status: 'easing',
          triggeredAt: { tick: t, sourceEventType: 'OCCUPATION_LAYER', sourceEventTargetId: occupierId },
          causes: [{ source: occupierId, effect: 'war_spoils', reason: `${occupierName} extracts war support from its stabilized occupations (capped).` }],
        },
      });
    }
    // Stamp the benefit yield onto the record for surfacing/debug (read-last/write-next).
    for (const occupiedId of Object.keys(occupations)) {
      if (String(occupations[occupiedId]?.occupierId) === occupierId) {
        occupations[occupiedId] = { ...occupations[occupiedId], benefitYield };
      }
    }
  }

  // ── Vassalization: a stabilized occupation converts to a vassal edge. Fires ONCE on
  // the tick the occupation first reaches vassalized (arrivedAtVassalized), never again
  // while it holds there (finding 3). ──────────────────────────────────────────────────
  for (const v of vassalizationOutcomes(occupations, snapshot, nameFor, t, arrivedAtVassalized)) outcomes.push(v);

  return { outcomes, occupations, dispositionDeltas };
}

export const OCCUPATION_TUNING = Object.freeze({
  STATE_LADDER,
  STATE_RANK,
  STATE_BENEFIT_SCALE,
  STATE_BURDEN_SCALE,
  STATE_HOLD_TICKS,
  ADVANCE_THRESHOLD,
  REGRESS_THRESHOLD,
  COLLAPSE_THRESHOLD,
  RESISTANCE_GROW_PER_TICK,
  RESISTANCE_DECAY_PER_TICK,
  RESISTANCE_CONDITION_FLOOR,
  PER_OCCUPATION_BENEFIT_CAP,
  OCCUPIER_BENEFIT_CONTAINMENT,
  DIMINISHING_BASE,
  PER_OCCUPATION_BURDEN_CAP,
  OVEREXTENSION_PER_OCCUPATION,
  BENEFIT_RELIEF_SCALE,
});

/**
 * Detect a vassal edge `homeId` is the JUNIOR of (re-export of the deploymentReturn idiom
 * for occupation-aware liberation in tests/integration). Pure read of the pre-tick edges.
 * @param {any} snapshot
 * @param {string} homeId
 * @returns {string|null} the overlord id, or null.
 */
export function vassalOverlordOf(snapshot, homeId) {
  const states = snapshot?.worldState?.relationshipStates || {};
  for (const rawEdge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
    const edge = normalizeRelationshipEdge(rawEdge);
    const relState = ensureRelationshipState(edge, states[relationshipKeyFromEdge(rawEdge)]);
    if (relState.relationshipType !== 'vassal') continue;
    const roles = relationshipRoles(edge, relState);
    if (String(roles.juniorId) === String(homeId)) return String(roles.seniorId ?? '');
  }
  return null;
}
