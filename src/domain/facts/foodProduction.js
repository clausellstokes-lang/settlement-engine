/**
 * domain/facts/foodProduction.js — THE PLACE'S OWN PRODUCTION BAND, AS A FACT A LINE MAY DECLARE (CLOSE-7, THE MIRROR; the
 * chair's RULING-R24 R24d of 2026-11-24, vetoable by the owner; on the veto list as new vocabulary).
 *
 * THE ONE READING: the food capacity's band as the capacity model writes it (`capacityModel.js :: deriveAllCapacities`,
 * `capacities.food_production.band`: production against need, imports not counted), read off the capacity profile THE
 * CALLER HOLDS. The vocabulary's `food production` atom reads it with that profile handed as its context
 * (`ctx.capacities`), as a card's own house is read with the card handed (`own house`).
 *
 * WHY HANDED AND NOT DERIVED HERE: `factsOf.js` names this leaf, and the capacity model reaches `factsOf.js` through
 * `threatProfile.js`; an import of the model here would close a dependency cycle (`tests/architecture/layerBoundaries.test.js`
 * holds the cycle set shrink-only). The one caller that declares it (`dailyLife.js`, the fare and Dawn Work's food branch)
 * already holds the model's profile, so the band read here is the band the fare's bound reads (`dailyLife.js :: fareBandOf`).
 *
 * WHAT IT IS FOR (R24d): the one cell where the page prints Famine and the place's own production is adequate or surplus.
 * There the lines that say the source failed (the fare's C7, Dawn Work's F6) exclude it, and the lines the chair gave in
 * their place (K2, K1) need it.
 *
 * Pure: no draw, no clock, no write.
 */

/**
 * The food production band of a capacity profile (`deriveAllCapacities(record)`), or undefined where it holds none.
 * @param {unknown} capacities @returns {string|undefined}
 */
export function foodProductionOf(capacities) {
  const band = /** @type {{ capacities?: Record<string, { band?: unknown }> } | null | undefined} */ (capacities)?.capacities?.food_production?.band;
  return typeof band === 'string' ? band : undefined;
}
