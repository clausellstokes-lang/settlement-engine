/**
 * domain/worldPulse/attrition.js — Phase B2 PER-ENGAGEMENT ATTRITION (pure).
 *
 * A deployed army is now STATEFUL: it carries an `currentEffectiveStrength` that
 * DEGRADES after every engagement (a siege attempt that held, a failed storm, a
 * successful storm, a withdrawal). This module is the pure, deterministic kernel
 * that computes that degradation — for BOTH the attacker AND the defender — given
 * the relative military strengths, the defensive advantage, the siege length
 * (deploymentAge), the target's terrain / fortifications, the army's supply
 * integrity / morale / magical support / food reserves, and the OUTCOME BAND of
 * the engagement (narrow-fail / decisive-fail / narrow-success / costly-success).
 *
 * The §9 property this enables: a depleted army's `currentEffectiveStrength` is
 * what the siege verdict reads downstream (warDeployment.resolveSiegeVerdict), so a
 * worn-down army can FAIL against a target it once out-classed — attrition has
 * teeth, war-spam is bounded, and a stalled campaign trends toward resolution.
 *
 * DETERMINISM CONTRACT (sacred): a PURE function of the deployment record + the two
 * capacity envelopes + the outcome band. NO Date.now / Math.random / argless new
 * Date, NO rng — the loss for a given (army-state, matchup, band) is byte-stable, so
 * the same engagement always degrades the same way independent of save order. The
 * loss is BOUNDED (a per-engagement cap) so a single tick can never annihilate an
 * army, and the floor is 0 so strength never goes negative. Attrition is applied to
 * a COPY (the caller writes the NEXT-tick ledger); this module never mutates input.
 *
 * Strict-clean (typecheck:domain:strict). No React/Zustand imports.
 */

const clamp01 = (/** @type {any} */ v) => Math.max(0, Math.min(1, Number(v) || 0));

/**
 * @typedef {'narrow_fail'|'decisive_fail'|'narrow_success'|'costly_success'|'withdrawal'|'hold'} OutcomeBand
 */

// ── Tunable attrition constants (calibration is load-bearing). ───────────────────
// Attrition is expressed as a FRACTION of an army's CURRENT effective strength lost
// in one engagement — a proportional bleed, so a strong army loses absolute points
// faster but degrades at a controlled rate, and a near-spent army can't lose more
// than it has (clamped at 0). The base is small (a single siege tick is a skirmish,
// not Cannae) and the band + modifiers scale it.
const BASE_ATTACKER_LOSS = 0.035; // a held/grinding siege tick costs the attacker ~3.5% of current strength
const BASE_DEFENDER_LOSS = 0.03;  // the defender bleeds a touch slower on home ground

// Per-engagement HARD CAP on the fraction lost — no single tick annihilates an
// army (the proposal's "bounded, deterministic" demand). Even a catastrophic storm
// costs at most this share in one tick.
const MAX_LOSS_FRACTION = 0.42;

// Outcome-band multipliers on the base loss. A storm (success) is the bloodiest;
// a decisive failure (thrown back from the walls) is costlier than a narrow one; a
// withdrawal is an orderly retreat (light); a mere HOLD (the siege ground on) is the
// baseline grind.
const BAND_ATTACKER = Object.freeze({
  hold:           1.0,   // the siege held — a normal grinding tick (kept light so a
                         // winning attacker stays in the plausible band long enough)
  narrow_fail:    1.8,   // thrown back, but the army is intact enough to try again
  decisive_fail:  3.0,   // a bloody repulse — the assault broke on the walls
  narrow_success: 1.6,   // the storm succeeded cleanly — modest cost
  costly_success: 2.6,   // a pyrrhic storm — the town fell but the army is gutted
  withdrawal:     0.8,   // an orderly retreat off a stalled siege
});
const BAND_DEFENDER = Object.freeze({
  hold:           0.9,   // the defenders held but spent men doing it
  narrow_fail:    0.7,   // they threw the attacker back cheaply
  decisive_fail:  0.5,   // a decisive defense — light defender losses
  narrow_success: 2.2,   // the walls fell — the garrison was overrun
  costly_success: 2.8,   // the town fell after a brutal fight — heavy defender losses
  withdrawal:     0.4,   // the besieger left — the defenders barely paid
});

// Relative-strength tilt: an army fighting UP (out-classed) bleeds faster; fighting
// DOWN (out-classing) bleeds slower. `relStrength` is attacker/defender effective
// ratio; the tilt is centered on a peer matchup (ratio 1.0 → ×1.0). Bounded so an
// overwhelming favourite still pays SOMETHING and a hopeless attacker doesn't lose
// 10× in a tick (the MAX_LOSS_FRACTION cap is the final backstop regardless).
const REL_STRENGTH_TILT = 0.5; // ±50% per unit of log-ratio, bounded below
const REL_TILT_MIN = 0.4;
const REL_TILT_MAX = 2.2;

// Siege length (deploymentAge, in ticks) compounds attrition: a long siege wears an
// army down through disease, desertion, and supply exhaustion even when it holds. A
// gentle per-tick ramp, capped so it plateaus (a 30-tick siege isn't 30× worse than
// a 1-tick one).
const AGE_ATTRITION_PER_TICK = 0.025;
const AGE_ATTRITION_CAP = 0.5; // up to +50% loss from a very long campaign

// Defensive-advantage scaling (the DEFENDER's terrain / fortifications): a fortified,
// well-walled target inflicts MORE attacker attrition and suffers LESS itself. Read
// from the defender's facets (institutions = walls+garrison) + a fortification read.
const FORTIFICATION_ATTACKER_SCALE = 0.6; // up to +60% attacker loss vs a maximally fortified town
const FORTIFICATION_DEFENDER_SHIELD = 0.4; // up to -40% defender loss behind strong walls

// Supply / morale / magic / food MITIGATE an army's own losses (a well-supplied,
// high-morale, magically-supported, well-provisioned army bleeds less). Each is a
// 0..1 facet; the combined mitigation is bounded so even a perfect army still pays.
const SUPPLY_MITIGATION = 0.30;   // full supply integrity → -30% loss
const MORALE_MITIGATION = 0.22;   // full morale → -22% loss
const MAGIC_MITIGATION = 0.18;    // full magic support → -18% loss
const FOOD_MITIGATION = 0.15;     // full food reserves → -15% loss
const MAX_MITIGATION = 0.65;      // never mitigate away more than 65% of a loss

/**
 * The fortification strength of a defender (0..1): its walls/garrison institutions
 * facet blended with any explicit fortification/terrain signal. Pure read.
 * @param {{ institutions?: number }} defenderFacets
 * @param {any} [defenderItem]  the defender snapshot item (terrain read), optional.
 * @returns {number} 0..1
 */
export function fortificationStrength(defenderFacets = {}, defenderItem = null) {
  const inst = clamp01((Number(defenderFacets?.institutions) || 0) / 100);
  // A terrain/fortification read from the settlement, when present — defensive
  // terrain (mountain/highland/marsh/island) and walls deepen the advantage.
  const s = defenderItem?.settlement || defenderItem || {};
  const terrain = String(s?.config?.terrain || s?.terrain || s?.geography?.terrain || '').toLowerCase();
  const terrainBonus = /mountain|highland|crag|cliff|marsh|swamp|island|fjord|canyon/.test(terrain) ? 0.18 : 0;
  return clamp01(inst * 0.85 + terrainBonus);
}

/**
 * The relative-strength tilt multiplier for an army's loss given the attacker/
 * defender effective ratio and which side this army is on. Fighting up the ratio
 * (out-classed) costs more; fighting down costs less. Bounded.
 * @param {number} attackerCurrent
 * @param {number} defenderCurrent
 * @param {boolean} isAttacker
 * @returns {number}
 */
export function relativeStrengthTilt(attackerCurrent, defenderCurrent, isAttacker) {
  const a = Math.max(1e-3, Number(attackerCurrent) || 0);
  const d = Math.max(1e-3, Number(defenderCurrent) || 0);
  // log-ratio so a 2× edge and a ½× edge are symmetric. Positive ⇒ attacker stronger.
  const logRatio = Math.log(a / d);
  // The side that is WEAKER bleeds more. For the attacker, a positive logRatio
  // (stronger) REDUCES its loss; for the defender it INCREASES the defender's loss.
  const signed = isAttacker ? -logRatio : logRatio;
  const tilt = 1 + REL_STRENGTH_TILT * signed;
  return Math.max(REL_TILT_MIN, Math.min(REL_TILT_MAX, tilt));
}

/**
 * Compute the attrition (fraction of current effective strength lost, 0..1) for ONE
 * side of an engagement. Pure + deterministic + bounded.
 *
 * @param {Object} args
 * @param {boolean} args.isAttacker         which side this army is on.
 * @param {OutcomeBand} args.band           the engagement outcome band.
 * @param {number} args.attackerCurrent     0..100 — attacker (coalition) current capacity.
 * @param {number} args.defenderCurrent     0..100 — defender current capacity.
 * @param {number} args.deploymentAge       ticks the besieging army has been deployed.
 * @param {number} args.fortification       0..1 — the defender's fortification strength.
 * @param {{ supplyIntegrity?: number, morale?: number, magicSupport?: number, foodReserve?: number }} [args.facets]
 *        the THIS-army's mitigating facets (0..1 each). Defaults to neutral 0.5.
 * @returns {{ lossFraction: number, reasons: string[] }}
 */
export function computeEngagementAttrition({
  isAttacker,
  band,
  attackerCurrent,
  defenderCurrent,
  deploymentAge = 0,
  fortification = 0,
  facets = {},
}) {
  const reasons = [];
  const base = isAttacker ? BASE_ATTACKER_LOSS : BASE_DEFENDER_LOSS;
  const bandTable = isAttacker ? BAND_ATTACKER : BAND_DEFENDER;
  const bandMult = /** @type {Record<string, number>} */ (bandTable)[String(band)] ?? bandTable.hold;

  const tilt = relativeStrengthTilt(attackerCurrent, defenderCurrent, isAttacker);

  const ageRamp = 1 + Math.min(AGE_ATTRITION_CAP, Math.max(0, Number(deploymentAge) || 0) * AGE_ATTRITION_PER_TICK);

  // Fortification: raises attacker loss, shields the defender.
  const fort = clamp01(fortification);
  const fortMult = isAttacker
    ? 1 + FORTIFICATION_ATTACKER_SCALE * fort
    : 1 - FORTIFICATION_DEFENDER_SHIELD * fort;

  // Mitigation from this army's own supply / morale / magic / food.
  const supply = Number.isFinite(facets.supplyIntegrity) ? clamp01(facets.supplyIntegrity) : 0.5;
  const morale = Number.isFinite(facets.morale) ? clamp01(facets.morale) : 0.5;
  const magic = Number.isFinite(facets.magicSupport) ? clamp01(facets.magicSupport) : 0.5;
  const food = Number.isFinite(facets.foodReserve) ? clamp01(facets.foodReserve) : 0.5;
  const mitigation = Math.min(
    MAX_MITIGATION,
    SUPPLY_MITIGATION * supply + MORALE_MITIGATION * morale + MAGIC_MITIGATION * magic + FOOD_MITIGATION * food,
  );

  let loss = base * bandMult * tilt * ageRamp * fortMult * (1 - mitigation);
  loss = Math.max(0, Math.min(MAX_LOSS_FRACTION, loss));

  reasons.push(
    `${isAttacker ? 'Attacker' : 'Defender'} band ${band} (×${bandMult.toFixed(2)}), strength-tilt ×${tilt.toFixed(2)}, age-ramp ×${ageRamp.toFixed(2)}, fortification ×${fortMult.toFixed(2)}, mitigation ${(mitigation * 100).toFixed(0)}% → ${(loss * 100).toFixed(1)}% lost.`,
  );

  return { lossFraction: clamp01(loss), reasons };
}

/**
 * Apply an engagement's attrition to a STATEFUL deployment record, returning the
 * degraded copy (the caller persists it as next-tick state — this never mutates the
 * input). The army's `currentEffectiveStrength` is reduced by the loss fraction;
 * `accumulatedAttrition` ratchets up; supply/morale/equipment erode in step (a
 * battered army is also less supplied and lower-morale — these feed the NEXT
 * engagement's mitigation). Strength floors at 0; the ratios floor at a small
 * minimum so a battered-but-surviving army isn't mathematically annihilated.
 *
 * @param {any} record   the stateful deployment record (see warDeployment seedDeploymentState).
 * @param {Object} args
 * @param {boolean} args.isAttacker
 * @param {OutcomeBand} args.band
 * @param {number} args.attackerCurrent
 * @param {number} args.defenderCurrent
 * @param {number} args.fortification
 * @returns {{ record: any, lossFraction: number, lostPoints: number, reasons: string[] }}
 */
export function applyAttritionToRecord(record, { isAttacker, band, attackerCurrent, defenderCurrent, fortification }) {
  const r = record || {};
  const current = Number.isFinite(r.currentEffectiveStrength) ? r.currentEffectiveStrength : (Number(r.maxStartStrength) || 0);
  const facets = {
    supplyIntegrity: r.supplyIntegrity,
    morale: r.morale,
    magicSupport: r.magicSupport,
    foodReserve: r.foodReserve,
  };
  const { lossFraction, reasons } = computeEngagementAttrition({
    isAttacker,
    band,
    attackerCurrent,
    defenderCurrent,
    deploymentAge: Number(r.deploymentAge) || 0,
    fortification,
    facets,
  });
  const lostPoints = current * lossFraction;
  const nextStrength = Math.max(0, current - lostPoints);
  // Battle wears down the supporting facets too — supply/morale/equipment erode at a
  // fraction of the strength loss, feeding the next engagement's mitigation. Floored
  // at 0.05 so they degrade but never hit a true zero (which would lock the army into
  // maximal future loss).
  const erode = (/** @type {number} */ v, /** @type {number} */ scale) =>
    Math.max(0.05, (Number.isFinite(v) ? v : 0.5) - lossFraction * scale);
  const next = {
    ...r,
    currentEffectiveStrength: nextStrength,
    accumulatedAttrition: clamp01((Number(r.accumulatedAttrition) || 0) + lossFraction),
    morale: erode(r.morale, 0.8),
    supplyIntegrity: erode(r.supplyIntegrity, 0.5),
    equipmentCondition: erode(r.equipmentCondition, 0.6),
  };
  return { record: next, lossFraction, lostPoints, reasons };
}

export const ATTRITION_TUNING = Object.freeze({
  BASE_ATTACKER_LOSS,
  BASE_DEFENDER_LOSS,
  MAX_LOSS_FRACTION,
  BAND_ATTACKER,
  BAND_DEFENDER,
  REL_STRENGTH_TILT,
  REL_TILT_MIN,
  REL_TILT_MAX,
  AGE_ATTRITION_PER_TICK,
  AGE_ATTRITION_CAP,
  FORTIFICATION_ATTACKER_SCALE,
  FORTIFICATION_DEFENDER_SHIELD,
  SUPPLY_MITIGATION,
  MORALE_MITIGATION,
  MAGIC_MITIGATION,
  FOOD_MITIGATION,
  MAX_MITIGATION,
});
