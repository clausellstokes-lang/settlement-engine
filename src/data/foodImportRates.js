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
