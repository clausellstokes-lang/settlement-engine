/**
 * clandestineFacet.js — D6 THE UNDERWAYS engine-couplings substrate
 * (DESIGN_SIM_DEPTH_R2 §D6, the engine-couplings half).
 *
 * Every D6 coupling reads the CLANDESTINE facet through THE FACET LAW chokepoint
 * (cohesionWeave.facetOf), never an institution name string. TWO DECLARED SPELLINGS
 * COUNT and both are read here: the CATALOG's own facet kind — the G2 'Underground
 * network' rows declare `facets: { clandestine: 'clandestine', subterranean:
 * 'subterranean' }` — and the custom spelling this module shipped with, a
 * `facets: { institutionFunction: 'clandestine' }` map or a
 * `facet:institutionFunction:clandestine` tag. So a custom "Smugglers' warren"
 * COUNTS exactly like the catalog institution G2 landed (the facet law's
 * custom-content parity), whichever of the two it declares. The catalog +
 * generation half rides Track-G2 (golden-shifting); this half is dark-kernel/bounded
 * and DORMANT until a clandestine facet is present — absent facet ⇒ every modifier
 * reduces to its no-op value (×1 / +0) ⇒ byte-identical.
 *
 * ⛔ THE LANDED-DARK DEFECT THIS FILE CARRIED (ODQ §445.3, cured by HK-1): the read was
 * `institutionFunction` ALONE. `FACET_INFERENCE.institutionFunction` is
 * heals/feeds/arms/judges, and the catalog declares the `clandestine` KIND — so the
 * predicate was ALWAYS FALSE on catalog data and the whole D6 substrate was dead.
 * NEITHER kind gets an inference row: §I is DECLARED OVER INFERRED and this module's
 * contract is "declaring the facet counts whatever its English name", so a keyword
 * fallback is refused by design — which is also why an absent facet stays null and
 * every same-seed world is byte-identical across the cure.
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
 * DECLARES the clandestine facet — through the facet chokepoint — under either governed
 * spelling: the catalog's `clandestine` kind, or the custom `institutionFunction`
 * kind resolving to 'clandestine'. Genre-blind: a custom institution declaring the
 * facet counts whatever its English name.
 * @param {ReadonlyArray<unknown>|null|undefined} institutions
 * @returns {boolean}
 */
export function hasClandestineFacet(institutions) {
  const insts = Array.isArray(institutions) ? institutions : [];
  return insts.some((i) => {
    const inst = /** @type {Parameters<typeof facetOf>[0]} */ (i);
    // The catalog's declared kind FIRST (the G2 'Underground network' rows), then the
    // custom `institutionFunction: 'clandestine'` spelling. Both are DECLARED-only reads:
    // no FACET_INFERENCE table exists for `clandestine`, and the `institutionFunction`
    // table cannot yield it — so an undeclared institution resolves null on both arms.
    return facetOf(inst, 'clandestine') === 'clandestine'
      || facetOf(inst, 'institutionFunction') === 'clandestine';
  });
}

/** Convenience: read the clandestine facet off a settlement object (its institutions).
 * @param {{ institutions?: unknown }|null|undefined} settlement @returns {boolean} */
export function settlementHasUnderways(settlement) {
  return hasClandestineFacet(settlement && Array.isArray(settlement.institutions) ? settlement.institutions : undefined);
}
