/**
 * clandestineFacet.js — D6 THE UNDERWAYS engine-couplings substrate
 * (DESIGN_SIM_DEPTH_R2 §D6, the engine-couplings half).
 *
 * Every D6 coupling reads the CLANDESTINE facet through THE FACET LAW chokepoint
 * (cohesionWeave.facetOf), never an institution name string — so a custom
 * "Smugglers' warren" declaring `facets: { institutionFunction: 'clandestine' }`
 * (or a `facet:institutionFunction:clandestine` tag) COUNTS exactly like the
 * catalog institution G2 lands (the facet law's custom-content parity). The
 * catalog + generation half rides Track-G2 (golden-shifting); this half is
 * dark-kernel/bounded and DORMANT until a clandestine facet is present — absent
 * facet ⇒ every modifier reduces to its no-op value (×1 / +0) ⇒ byte-identical.
 *
 * Lazy leaf: imported only by dormant worldPulse kernels ⇒ zero eager bytes.
 */
import { facetOf } from '../spatial/cohesionWeave.js';

/** Bounded, owner-retunable coupling coefficients. Each is the amount a clandestine
 *  facet shifts an existing bounded lever; all default OFF (the facet-absent path never
 *  reads them). */
export const UNDERWAYS_TUNING = Object.freeze({
  // M7 smuggling substrate: a clandestine endpoint adds bounded network reach
  // (success up ⇒ detection down, since detection is 1 − success).
  SMUGGLE_NETWORK_BONUS: 0.15,
  // Siege + blockade endurance: a bounded supply-trickle floor. FOOD_TRICKLE is an
  // import-retention share (land siege, foodStockpile); INTERDICTION_RELIEF discounts
  // the naval/spatial siege interdiction (warDeployment) — land–sea parity.
  FOOD_TRICKLE: 0.15,
  INTERDICTION_RELIEF: 0.2,
  // Covert-operations affinity: an exposure-roll discount (a multiplier < 1) and a
  // conspiracy-formation ease (a bounded boost factor).
  EXPOSURE_DISCOUNT: 0.85,
  CONSPIRACY_EASE: 0.2,
});

/**
 * A settlement's institutions shelter clandestine operations when any institution
 * resolves — through the facet chokepoint — to the CLANDESTINE function (declared or,
 * once G2's catalog lands, catalog-declared). Genre-blind: a custom institution
 * declaring the facet counts whatever its English name.
 * @param {ReadonlyArray<any>|null|undefined} institutions
 * @returns {boolean}
 */
export function hasClandestineFacet(institutions) {
  const insts = Array.isArray(institutions) ? institutions : [];
  return insts.some((i) => facetOf(i, 'institutionFunction') === 'clandestine');
}

/** Convenience: read the clandestine facet off a settlement object (its institutions).
 * @param {any} settlement @returns {boolean} */
export function settlementHasUnderways(settlement) {
  return hasClandestineFacet(settlement && settlement.institutions);
}
