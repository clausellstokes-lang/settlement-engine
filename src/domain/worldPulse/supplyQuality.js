/**
 * domain/worldPulse/supplyQuality.js — the WAR-SUPPLY DEPLOYED-QUALITY leaf (W-C1 item 3).
 *
 * THE GAP (verified in PHASE5_ENGINE_COMPANION §W-C: `supplyCompleteness` feeds TRADE
 * only — tradeWar.js / tradeSalience.js — and NO consumer wires it into deployed force
 * QUALITY). So a blockaded, feedstock-starved war economy fields exactly the same army as
 * a self-sufficient arsenal. This leaf closes that gap: it reads `supplyCompleteness` over
 * the CORE WAR-KIT commodities (the owner's "iron→smelting→weapons, leather, horses,
 * provisioning") and derives a DEPLOYED-QUALITY multiplier the war layer applies to the
 * army it commits — equipment quality scales deployed stats AND attrition.
 *
 * FLOORED, NEVER ZERO: a chainless settlement still fields a DEGRADED force (it scavenges,
 * buys, and improvises kit), so quality ∈ [FLOOR, 1] — a self-sufficient arsenal approaches
 * 1.0, a settlement that sources none of its own kit sits at the floor.
 *
 * IT DOES NOT FEED READINESS ACCRUAL (the owner's split: readiness = training/posture;
 * supply = kit). readiness comes from war experience through martialReadiness; this is the
 * orthogonal materiel axis, consumed ONLY at the deployment stat site.
 *
 * PURE: no rng, no wall-clock, no mutation. Reads only the pre-tick snapshot through
 * `supplyCompleteness` (itself pure + per-snapshot memoized). Deterministic — a fixed
 * commodity basket, order-free reduce.
 */

import { supplyCompleteness } from './supplyCompleteness.js';

/** @typedef {{ byId?: { get?: (id: string) => unknown }, regionalGraph?: unknown }} PulseSnapshotLike */

export const SUPPLY_QUALITY_TUNING = Object.freeze({
  // The CORE war-kit basket probed via supplyCompleteness — the owner's
  // "iron→smelting→weapons, leather, horses, provisioning" mapped to the canonical
  // goodsCatalog ids: the finished arms, the metal feedstock, leather (armour/tack),
  // livestock (mounts/draft), and marching provisions. A settlement's mean completeness
  // over this basket is its martial self-sufficiency.
  WAR_KIT: Object.freeze(['arms', 'iron', 'leather', 'livestock', 'provisions']),
  // FLOOR: quality ∈ [FLOOR, 1]. CONSTRAINT (not history): FLOOR > 0 so a settlement that
  // sources NONE of its own war kit still deploys a degraded force (never a zero-strength
  // army — the owner's floor). A fully self-supplying arsenal reaches 1.0 (no penalty).
  FLOOR: 0.55,
});

/** @param {number} x @returns {number} */
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);

/**
 * 0..1 mean supply-completeness of a settlement over the CORE WAR-KIT basket — its martial
 * self-sufficiency. A settlement that produces/supplies none of the basket reads ~0; a
 * self-sufficient arsenal with healthy chains reads ~1. Pure.
 * @param {PulseSnapshotLike} snapshot   the SINGLE pre-tick world snapshot
 * @param {string|number} settlementId
 * @returns {number}
 */
export function warKitCompleteness(snapshot, settlementId) {
  const kit = SUPPLY_QUALITY_TUNING.WAR_KIT;
  if (!kit.length) return 0;
  let acc = 0;
  for (const commodity of kit) acc += clamp01(supplyCompleteness(snapshot, String(settlementId), commodity));
  return acc / kit.length;
}

/**
 * The FLOORED deployed-quality multiplier (FLOOR..1) for a settlement's committed army —
 * `FLOOR + (1 − FLOOR) × warKitCompleteness`. A self-sufficient war economy fields a
 * full-quality force (≈1.0); a supply-starved / chainless one fields a degraded force at
 * the floor (never zero). The war layer scales the deployed strength AND the equipment/
 * supply facets (attrition mitigation) by this. Pure.
 * @param {PulseSnapshotLike} snapshot   the SINGLE pre-tick world snapshot
 * @param {string|number} settlementId
 * @returns {number} FLOOR..1
 */
export function deployedQualityMult(snapshot, settlementId) {
  const T = SUPPLY_QUALITY_TUNING;
  const completeness = warKitCompleteness(snapshot, settlementId);
  return T.FLOOR + (1 - T.FLOOR) * clamp01(completeness);
}
