/**
 * townCartography/cartographyMorphology.js — A-10 LAYER 1 + LAYER 4, the one writer.
 *
 * THE URBAN MORPHOLOGY LAW (DESIGN_TOWN_CARTOGRAPHY §11d, BINDING on TC-2..TC-5)
 * opens with "STATE decides order vs chaos" and closes layer 4 with "grid cores
 * ONLY where a planned era earns them (planning maturity derived from age + law +
 * power stability — an authored table, engine facts only)". This module is that
 * derivation and the ONLY place either value is computed.
 *
 * ── WHY THIS IS NOT A STYLE KNOB ─────────────────────────────────────────────
 * The synthesis takes NO order/chaos/organic parameter. It takes a settlement and
 * asks this module what that settlement's own governance, economy and stress say
 * about how it is laid out. Two settlements with identical typed state must draw
 * with identical order, and a settlement whose council loses legitimacy must draw
 * measurably less orderly WITHOUT anyone touching a dial. That is the coherence
 * A-10 exists to guarantee, and it is only available if the reading is derived.
 *
 * ── ABSENCE IS NOT NEUTRALITY (the fabricRead law, honoured) ──────────────────
 * `fabricDriftOf` returns NULL when the urban-fabric layer is dark or the save
 * predates it. Null is NOT 0.5: a dark layer contributes NO term at all, and the
 * remaining terms carry the reading. Coalescing null to a mid value would let a
 * dormant subsystem silently vote on every map in the product.
 *
 * ── THE EVIDENCE IS PART OF THE OUTPUT (legibility law) ──────────────────────
 * Every reading carries the named terms that produced it. A map whose streets are
 * visibly chaotic must be able to say WHY in the settlement's own vocabulary, and
 * a term that cannot be named is a term that cannot be reviewed.
 *
 * Pure and deterministic: a function of the projected settlement alone, no rng, no
 * clock, no store, no draw. The seeded stages consume this reading; they never
 * write it.
 *
 * @enforced-by tests/domain/townCartographyMorphology.test.js
 */

import { fabricDriftOf, fabricStocksFor } from '../townMap/fabricRead.js';
import {
  CARTOGRAPHY_TIERS,
  TOWN_CARTOGRAPHY_TUNING,
  cartographyTierIndex,
} from './cartographyTuning.js';

const M = TOWN_CARTOGRAPHY_TUNING.MORPHOLOGY;

/**
 * THE CLOSED PLACEMENT VOCABULARY (A-8). Nothing outside this list may reach a
 * ward, a parcel, a record or a receipt.
 * @type {ReadonlyArray<string>}
 */
export const CARTOGRAPHY_PLACEMENTS = Object.freeze([
  'district', 'clustered', 'dispersed_orderly', 'dispersed_chaotic',
]);

/** @param {unknown} value @returns {Record<string, unknown>} */
function record(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {number} value @returns {number} */
function unit(value) {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

/** @param {unknown} value @returns {number|null} */
function finiteOrNull(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

/**
 * The revealed stressor severities. COVERT conditions are skipped outright: a
 * concealed corruption may never shape a surface a player can see (the
 * audienceProjection law), and the map is such a surface.
 *
 * The archetype match follows the spelling townScene/buildingProfiles.js already
 * uses for the same conditions in this same lane. Forking a second condition
 * grammar here is exactly how two surfaces come to disagree about whether a town
 * is corrupt.
 *
 * @param {unknown} activeConditions
 * @returns {{ corruption01: number, unrest01: number }}
 */
function stressorSeverities(activeConditions) {
  const conditions = Array.isArray(activeConditions) ? activeConditions : [];
  let corruption01 = 0;
  let unrest01 = 0;
  for (const raw of conditions) {
    const item = record(raw);
    if (item.covert === true) continue;
    const text = [item.id, item.label, item.archetype, item.status]
      .map((value) => String(value || '').toLowerCase())
      .join(' ');
    const severityRaw = finiteOrNull(item.severity);
    const severity = severityRaw === null ? 0.5 : unit(severityRaw);
    if (/corrupt|taint|blight|smuggl|graft/.test(text)) {
      corruption01 = Math.max(corruption01, severity);
    }
    if (/unrest|riot|revolt|strife|siege|occupation|banditry|feud/.test(text)) {
      unrest01 = Math.max(unrest01, severity);
    }
  }
  return { corruption01, unrest01 };
}

/**
 * Power CONCENTRATION: the leading faction's share of all declared faction power.
 * One hand on the tiller lays out a town; five hands negotiating do not. Returns
 * null when no faction declares power at all, so the term is dropped rather than
 * defaulted (a settlement with no power structure has no opinion about order).
 *
 * @param {unknown} powerStructure
 * @returns {number|null}
 */
function powerConcentration(powerStructure) {
  const power = record(powerStructure);
  const factions = Array.isArray(power.factions) ? power.factions : [];
  let total = 0;
  let leading = 0;
  for (const raw of factions) {
    const value = finiteOrNull(record(raw).power);
    if (value === null || value <= 0) continue;
    total += value;
    if (value > leading) leading = value;
  }
  return total > 0 ? unit(leading / total) : null;
}

/** The mean accumulated fabric stock, or null when the fabric layer is dark.
 *  @param {unknown} settlement @returns {number|null} */
function fabricAccumulation(settlement) {
  const stocks = fabricStocksFor(/** @type {{ urbanFabric?: unknown }} */ (record(settlement)));
  const values = Object.keys(stocks).map((key) => stocks[key]);
  if (values.length === 0) return null;
  let sum = 0;
  for (const value of values) sum += value;
  return unit(sum / values.length);
}

/**
 * @typedef {object} MorphologyReading
 * @property {number} tierIndex position on CARTOGRAPHY_TIERS
 * @property {number} order01 0 chaotic ... 1 orderly (A-10 layer 1)
 * @property {number} planning01 0 unplanned ... 1 matured planning (A-10 layer 4)
 * @property {boolean} gridCore whether a planned era has earned a grid core
 * @property {boolean} walled whether the tier sits at or above the walled band
 * @property {'district'|'clustered'|'dispersed_orderly'|'dispersed_chaotic'} placement
 * @property {Readonly<Record<string, number|null>>} evidence the named terms, in
 *   the settlement's own vocabulary; a null term is one this settlement does not
 *   carry and therefore did not vote.
 */

/**
 * THE READING. A-10 layers 1 and 4, derived from typed engine facts only.
 *
 * @param {unknown} settlement the audience-projected settlement
 * @returns {MorphologyReading}
 */
export function readTownMorphology(settlement) {
  const value = record(settlement);
  const tierIndex = cartographyTierIndex(value.tier);
  const power = record(value.powerStructure);
  const legitimacy = finiteOrNull(power.legitimacy) ?? finiteOrNull(value.legitimacy);
  const concentration = powerConcentration(value.powerStructure);
  const drift = fabricDriftOf(/** @type {{ urbanFabric?: unknown }} */ (value));
  const accumulation = fabricAccumulation(value);
  const age = finiteOrNull(value.age);
  const { corruption01, unrest01 } = stressorSeverities(value.activeConditions);

  // Layer 1. Each present term is a signed deflection from the neutral 0.5; an
  // absent term deflects nothing. Deliberately additive and transcendental-free:
  // + - * / only, so the same seed reads the same order on every JS engine.
  let order = 0.5;
  if (legitimacy !== null) order += M.LEGITIMACY_WEIGHT * (unit(legitimacy) - 0.5) * 2;
  if (concentration !== null) order += M.CONCENTRATION_WEIGHT * (concentration - 0.5) * 2;
  if (drift !== null) order -= M.FABRIC_DRIFT_WEIGHT * (drift - 0.5) * 2;
  order -= M.CORRUPTION_WEIGHT * corruption01;
  order -= M.UNREST_WEIGHT * unrest01;
  const order01 = unit(order);

  // Layer 4. A weighted mean over the terms this settlement actually carries, so
  // a dark fabric layer or an unrecorded age lowers no one's planning maturity.
  let planningSum = M.PLANNING_ORDER_WEIGHT * order01
    + M.PLANNING_TIER_WEIGHT * (tierIndex / (CARTOGRAPHY_TIERS.length - 1));
  let planningWeight = M.PLANNING_ORDER_WEIGHT + M.PLANNING_TIER_WEIGHT;
  if (accumulation !== null) {
    planningSum += M.PLANNING_FABRIC_WEIGHT * accumulation;
    planningWeight += M.PLANNING_FABRIC_WEIGHT;
  }
  if (age !== null) {
    planningSum += M.PLANNING_AGE_WEIGHT
      * unit(Math.max(0, age) / M.PLANNING_AGE_SATURATION);
    planningWeight += M.PLANNING_AGE_WEIGHT;
  }
  const planning01 = unit(planningSum / planningWeight);

  const placement = order01 >= M.PLACEMENT_ORDER_FLOOR
    ? ((concentration ?? 0) >= M.PLACEMENT_CONCENTRATION_FLOOR ? 'district' : 'clustered')
    : order01 >= M.PLACEMENT_ORDER_MIDDLE ? 'dispersed_orderly' : 'dispersed_chaotic';

  return Object.freeze({
    tierIndex,
    order01,
    planning01,
    // Three conditions, all necessary: the maturity mean, the tier floor, and the
    // ORDER floor. The third is a gate rather than a term because the mean lets
    // age and size outvote law, and a lawless grid is a contradiction A-10 does
    // not permit however old or large the settlement is.
    gridCore: planning01 >= M.GRID_CORE_PLANNING_FLOOR
      && tierIndex >= M.GRID_CORE_TIER_INDEX
      && order01 >= M.GRID_CORE_ORDER_FLOOR,
    walled: tierIndex >= TOWN_CARTOGRAPHY_TUNING.WALLED_TIER_INDEX,
    placement: /** @type {'district'|'clustered'|'dispersed_orderly'|'dispersed_chaotic'} */ (placement),
    evidence: Object.freeze({
      legitimacy01: legitimacy === null ? null : unit(legitimacy),
      concentration01: concentration,
      fabricDrift01: drift,
      fabricAccumulation01: accumulation,
      ageTicks: age,
      corruption01,
      unrest01,
    }),
  });
}
