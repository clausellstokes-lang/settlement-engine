/**
 * domain/worldPulse/reinforcement.js — the REINFORCEMENT FLOW (pure).
 *
 * A deployed army does not just bleed — its origin can FEED it. Each tick the home
 * settlement sends a PARTIAL, EXPENSIVE replenishment to its army in the field. The
 * flow is computed here as a pure, deterministic function of the origin's
 * population / economic capacity / military supply chains (materiel) / food / trade /
 * war-posture / legitimacy / manpower, the DISTANCE & route security to the front,
 * and whether the origin is ITSELF threatened (besieged / occupied / war-exhausted).
 *
 * Two hard properties (the §9 demands):
 *   1. NEVER FULL FREE RESTORE. The per-tick flow is capped well below the strength
 *      lost — a damaged army is replenished slowly and incompletely, so attrition
 *      always outruns reinforcement in a hard fight. It also can never push an army
 *      above its `maxStartStrength`.
 *   2. REINFORCING DRAINS THE ORIGIN. The flow is paid for: the caller stamps the
 *      reinforcement-cost conditions (economic_capacity / public_legitimacy /
 *      defense_readiness) whose SEVERITY this module computes ∝ the flow sent AND the
 *      deploymentAge (the LONGER deployed, the more it strains the home — feeding an
 *      army for a year costs more than feeding it for a month, even in a winning war).
 *
 * DETERMINISM CONTRACT (sacred): PURE function of the pre-tick origin envelope + the
 * deployment record. NO Date.now / Math.random / argless new Date, NO rng — the flow
 * for a given (origin-state, army-state) is byte-stable. The flow is BOUNDED and the
 * drain is BOUNDED. This module never mutates input.
 *
 * Strict-clean (typecheck:domain:strict). No React/Zustand imports.
 */

const clamp01 = (/** @type {any} */ v) => Math.max(0, Math.min(1, Number(v) || 0));

// ── Tunable reinforcement constants (calibration is load-bearing). ───────────────
// The flow is a FRACTION of the army's max start strength the origin can replenish
// per tick — small, so an army never snaps back to full. The base is scaled by the
// origin's capacity signals and DAMPED by its own threat / war-exhaustion.
const BASE_FLOW_FRACTION = 0.06;  // a healthy, secure origin tops up ~6% of max strength per tick
const MAX_FLOW_FRACTION = 0.10;   // hard cap on a single tick's replenishment (never a full restore)

// The origin-capacity signals blend into a 0..1 supply multiplier on the base flow.
// Each is centered so a neutral origin multiplies near 1.0. Weights sum loosely to 1
// across the "can it afford / raise / move" axes.
const W_ECONOMY = 0.26;     // economic_capacity — can it pay for the levy + materiel?
const W_MANPOWER = 0.22;    // population / manpower facet — bodies to send.
const W_MATERIEL = 0.16;    // military supply chains (materiel facet) — weapons to arm them.
const W_FOOD = 0.12;        // food reserves / logistics — grain for the march.
const W_TRADE = 0.10;       // trade connectivity — open routes to move supply.
const W_LEGITIMACY = 0.14;  // legitimacy — can the government raise a fresh levy at all?

// Route security & distance: a long, insecure supply line bleeds the flow. These are
// 0..1 (1 = short/secure). A maximally bad route nearly halves the flow.
const ROUTE_PENALTY = 0.45; // up to -45% flow on a long / unsafe route.

// If the origin is ITSELF besieged / occupied, it cannot reinforce abroad at all
// (its army is its only army; a besieged home keeps it). If merely war-exhausted, the
// flow is damped, not zeroed.
const EXHAUSTION_FLOW_DAMP = 0.6; // full war-exhaustion → -60% reinforcement.

// ── Origin DRAIN tunables. The cost the origin pays to reinforce. Severity ∝ the
// flow sent AND the deploymentAge — a long deployment strains the home even at a
// modest per-tick flow. The drain is bounded (a condition severity is 0..1). ───────
const DRAIN_FLOW_WEIGHT = 3.2;       // flowFraction (≤0.11) → up to ~0.35 severity from the flow alone
const DRAIN_AGE_PER_TICK = 0.012;    // each tick deployed adds to the strain…
const DRAIN_AGE_CAP = 0.4;           // …capped so it plateaus on a very long war
const DRAIN_FLOOR = 0.18;            // any active reinforcement effort costs at least this much

/**
 * Compute the per-tick reinforcement flow for a deployed army, and the origin-drain
 * severity that paying for it imposes. Pure + deterministic + bounded.
 *
 * @param {Object} args
 * @param {any} args.record               the stateful deployment record (carries maxStartStrength,
 *                                         currentEffectiveStrength, deploymentAge, logisticsBurden).
 * @param {Object} args.origin            the origin capacity envelope (0..1 normalized facets):
 * @param {number} args.origin.economy        economic_capacity 0..1.
 * @param {number} args.origin.manpower       manpower facet 0..1.
 * @param {number} args.origin.materiel       materiel (supply-chain) facet 0..1.
 * @param {number} args.origin.food           food/logistics facet 0..1.
 * @param {number} args.origin.trade          trade connectivity 0..1.
 * @param {number} args.origin.legitimacy     public legitimacy 0..1.
 * @param {number} [args.origin.warExhaustion] 0..1 non-reverting scar (damps the flow).
 * @param {boolean} [args.origin.threatened]  origin is itself besieged/occupied (zeroes the flow).
 * @returns {{ flowFraction: number, flowPoints: number, restoredStrength: number, drainSeverity: number, reasons: string[] }}
 */
export function computeReinforcement({ record, origin }) {
  const r = record || {};
  /** @type {any} */
  const o = origin || {};
  const reasons = [];
  const maxStart = Number(r.maxStartStrength) || 0;
  const current = Number.isFinite(r.currentEffectiveStrength) ? r.currentEffectiveStrength : maxStart;

  // An origin that is itself besieged/occupied keeps its army at home — no flow.
  if (o.threatened) {
    reasons.push('Origin is itself besieged/occupied — it cannot spare reinforcements.');
    return { flowFraction: 0, flowPoints: 0, restoredStrength: current, drainSeverity: 0, reasons };
  }

  // The origin-capacity supply multiplier (0..~1.3), a weighted blend of the signals.
  const economy = clamp01(o.economy);
  const manpower = clamp01(o.manpower);
  const materiel = clamp01(o.materiel);
  const food = clamp01(o.food);
  const trade = clamp01(o.trade);
  const legitimacy = clamp01(o.legitimacy);
  const supplyMult =
    W_ECONOMY * economy
    + W_MANPOWER * manpower
    + W_MATERIEL * materiel
    + W_FOOD * food
    + W_TRADE * trade
    + W_LEGITIMACY * legitimacy;
  // supplyMult ∈ [0, ~1]. Re-center so a neutral (all-0.5) origin ≈ 1.0× the base.
  const centeredMult = 0.4 + 1.2 * supplyMult;

  // Route security & distance from the logistics burden on the record (0 = short/safe,
  // 1 = long/unsafe). A bad route bleeds the flow.
  const burden = clamp01(r.logisticsBurden);
  const routeMult = 1 - ROUTE_PENALTY * burden;

  // War-exhaustion damps a tired home's ability to keep feeding the front.
  const scar = clamp01(o.warExhaustion);
  const exhaustionMult = 1 - EXHAUSTION_FLOW_DAMP * scar;

  let flowFraction = BASE_FLOW_FRACTION * centeredMult * routeMult * exhaustionMult;
  flowFraction = Math.max(0, Math.min(MAX_FLOW_FRACTION, flowFraction));

  // The points it actually restores — capped so it never exceeds the deficit (an army
  // at full strength receives nothing) NOR pushes above maxStartStrength.
  const deficit = Math.max(0, maxStart - current);
  const flowPoints = Math.min(flowFraction * maxStart, deficit);
  const restoredStrength = Math.min(maxStart, current + flowPoints);

  // The origin-drain severity ∝ the flow sent AND the deploymentAge. Even a winning
  // war that sends a steady trickle keeps straining the home, and the longer the army
  // is out, the heavier the cumulative burden. Only a flow that actually went out
  // costs anything (a full-strength army that received nothing imposes no drain).
  const ageStrain = Math.min(DRAIN_AGE_CAP, (Number(r.deploymentAge) || 0) * DRAIN_AGE_PER_TICK);
  const drainSeverity = flowPoints > 0
    ? clamp01(DRAIN_FLOOR + DRAIN_FLOW_WEIGHT * flowFraction + ageStrain)
    : 0;

  reasons.push(
    `Reinforcement flow ${(flowFraction * 100).toFixed(1)}% of max (supply ×${centeredMult.toFixed(2)}, route ×${routeMult.toFixed(2)}, exhaustion ×${exhaustionMult.toFixed(2)}) restored ${flowPoints.toFixed(1)} pts; origin drain ${drainSeverity.toFixed(2)} (age strain ${ageStrain.toFixed(2)}).`,
  );

  return { flowFraction, flowPoints, restoredStrength, drainSeverity, reasons };
}

/**
 * Apply the computed reinforcement to a stateful deployment record, returning the
 * replenished copy (the caller persists it next-tick; never mutates input). The
 * army's `currentEffectiveStrength` rises by the flow (capped at maxStartStrength),
 * `reinforcementFlow` records the last flow, and morale/supply RECOVER a little (fresh
 * troops and supply lift spirits) — bounded so reinforcement can't restore a gutted
 * army to mint condition in one tick.
 *
 * @param {any} record
 * @param {{ flowPoints: number, flowFraction: number, restoredStrength: number }} flow
 * @returns {any} the replenished record copy.
 */
export function applyReinforcementToRecord(record, flow) {
  const r = record || {};
  if (!flow || !(flow.flowPoints > 0)) {
    return { ...r, reinforcementFlow: 0 };
  }
  const lift = (/** @type {number} */ v, /** @type {number} */ amount) =>
    Math.min(1, (Number.isFinite(v) ? v : 0.5) + amount);
  return {
    ...r,
    currentEffectiveStrength: flow.restoredStrength,
    reinforcementFlow: flow.flowFraction,
    // Fresh manpower/supply lift morale and supply integrity a touch (≤ a fraction of
    // the flow), never a full reset.
    morale: lift(r.morale, flow.flowFraction * 0.6),
    supplyIntegrity: lift(r.supplyIntegrity, flow.flowFraction * 0.8),
  };
}

export const REINFORCEMENT_TUNING = Object.freeze({
  BASE_FLOW_FRACTION,
  MAX_FLOW_FRACTION,
  W_ECONOMY,
  W_MANPOWER,
  W_MATERIEL,
  W_FOOD,
  W_TRADE,
  W_LEGITIMACY,
  ROUTE_PENALTY,
  EXHAUSTION_FLOW_DAMP,
  DRAIN_FLOW_WEIGHT,
  DRAIN_AGE_PER_TICK,
  DRAIN_AGE_CAP,
  DRAIN_FLOOR,
});
