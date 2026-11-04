/**
 * foodImportRates.js
 * Food-deficit import coverage for settlements without an open trade route —
 * the channel ladder shared by generation (economicGenerator, foodGenerator)
 * and the tick-time stockpile (domain/worldPulse/foodStockpile), so the three
 * food models cannot drift apart.
 *
 * Magical transport sits deliberately BELOW the road rate (0.35): it is
 * rationed, extraordinarily expensive, and carries necessities, not plenty.
 * A besieged airship dock runs the blockade at half throughput — frequent,
 * disciplined, timed runs, but the besieger keeps inventing countermeasures.
 * Minor routes are the trickle every isolated settlement still receives:
 * sanctioned caravans, pilgrimage traffic, protected convoys. A siege
 * severs them entirely (a teleportation circle is the only channel a
 * blockade cannot touch).
 */
export const FOOD_IMPORT_RATES = Object.freeze({
  teleport: 0.3,
  airship: 0.3,
  airshipBesieged: 0.15,
  minorRoutes: 0.08,
  minorRoutesVillage: 0.05,
});

/**
 * The share of its harvest a besieged place still brings in: the fields under the walls, with
 * the outlying farmland abandoned or razed. ONE dial, read by both food writers
 * (`generators/foodGenerator.js :: generateFoodSecurity` and
 * `generators/economy/foodBalance.js :: deriveFoodBalanceAnalysis`) and by the Defense tab's
 * Food endurance reading (`domain/defense/defenseFacts.js :: foodEnduranceOf`), so the siege
 * arithmetic cannot drift between the record and the line that reads it (X-52, ODQ §934.104).
 */
// 2026-11-04 (T1, the soak 1000 dry run §4, adopted by the chair under the owner's word "I leave it all
// to your judgment"): 0.6 -> 0.3. At 0.6, 404 of 1,000 places never ran out on half rations under siege
// (any place growing 84% or more of its need), 37 of 41 small places born besieged among them. The dry
// run's recomputation from the 1,000 records: places that never run out on half rations 404 -> 0; median
// months on full rations thorp 3.6 -> 2.2, village 3.0 -> 1.8, town 11.5 -> 8.2, city 13.9 -> 10.8,
// metropolis 20.7 -> 17.4 (docs/SOAK_1000_2026-11-03.md §4).
export const SIEGE_PRODUCTION_KEPT = 0.3;
