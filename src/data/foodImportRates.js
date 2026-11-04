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
export const SIEGE_PRODUCTION_KEPT = 0.6;
