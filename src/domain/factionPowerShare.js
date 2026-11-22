/**
 * domain/factionPowerShare.js — THE DECLARED UNIT of `factions[].power`, and the ONE reader.
 *
 * ── THE UNIT, DECLARED ───────────────────────────────────────────────────────
 * `factions[].power` is an INTEGER PERCENT SHARE, 0–100, of a settlement's total faction
 * power. It is minted by `rulingStructure.normalizeAndAnnotateFactions`, which renormalises
 * the whole roster with `Math.round((power / totalPower) * 100)` — so a settlement's roster
 * sums to about 100 by construction — and it is read as a percent by every display surface
 * in the estate (`SummaryTab.jsx` prints `{f.power}%`; `PowerStrata.jsx` and
 * `viewModel.js:461` divide by the roster total; `roads/state.js:575` divides by 100).
 * The simulation moves it in the same unit: `applyWorldPulseFactionRoster.js:67/:88/:89`
 * writes `Math.round(power ± amount)`.
 *
 * ── WHY A LEAF, AND NOT A COMMENT ────────────────────────────────────────────
 * Because the unit was undeclared, SIX consumers each guessed it at read time with the same
 * magnitude sniff — `raw > 1 ? raw / 100 : raw` — which carries a 100× CLIFF AT EXACTLY 1: a
 * faction holding a 1 % share reads as 1.0, FULL power, and outranks a 60-share faction in
 * `factionCompetition`'s top-three ladder (§759.3 POWER-SNIFF-CLIFF). `disposition.js`'s copy
 * said so in its own header — "mirrors factionCompetition.factionPower" — which is the
 * signature of a duplicated read waiting to drift.
 *
 * ── REACHABILITY, MEASURED (T7/UNITS) ────────────────────────────────────────
 * Over 1,200 real settlements (6 tiers × 8 cultures × 5 terrains × 5 stress configs) the
 * generator emitted 8,074 faction rows with a finite power and the MINIMUM was 5 — no row at
 * 1, none in (0,1), so 0 of 8,074 readings move. The cliff is NOT reachable from generation
 * output, and the cure is therefore behaviour-preserving on every freshly generated world.
 * It is reachable in a LIVED world: `applyWorldPulseFactionRoster` adds and subtracts whole
 * points with no renormalisation and no floor, so a faction ground down over campaign years
 * arrives at 1 and, under the sniff, would have been read as the most powerful body in the
 * settlement. That is what this leaf removes.
 *
 * Pure, dependency-free, and imported by six modules across worldPulse, undercity and realm —
 * none of which may drag another's graph in.
 */

/**
 * The declared unit of `factions[].power`. Exported as a value so a registry row, a test or
 * a future seam-wide unit convention can name it rather than restate it.
 */
export const FACTION_POWER_UNIT = 'percent_0_100';

/**
 * A faction's share of local power as 0..1, or `null` when the value is not readable.
 *
 * NO MAGNITUDE SNIFF: the unit is declared above, so the division is unconditional. Callers
 * keep their OWN default for the null case — the estate's defaults genuinely differ by
 * meaning (an absent power is 0.5 "neutral" to `disposition`, 0 "no criminal weight" to
 * `supplyKernel`, and an index-derived descent to `factionCompetition`), and collapsing them
 * into one would be a second unit-less field wearing a new name.
 *
 * ⚠ STRICT ON PURPOSE: only an actual finite NUMBER is readable. It does NOT coerce, because
 * the six callers did not agree on coercion — two tested `Number.isFinite(raw)` on the raw
 * value (so a numeric string was never a power) while four coerced first. Coercing here would
 * have silently changed the strict two; each caller therefore keeps its own conversion, and
 * the sites are byte-equivalent for every value any writer produces.
 *
 * @param {unknown} raw the value read off the faction row
 * @returns {number|null} 0..1, or null when `raw` is not a finite number
 */
export function factionPowerShare01(raw) {
  if (typeof raw !== 'number' || !Number.isFinite(raw)) return null;
  const share = raw / 100;
  return share < 0 ? 0 : share > 1 ? 1 : share;
}
