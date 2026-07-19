/**
 * domain/townMap/mapDress.js — THE SEASON + STATE PORTRAIT RESOLVER (THE ILLUSTRATED TOWN, IT-3).
 *
 * A PURE resolver that turns a settlement's live context (the campaign's worldState + the
 * settlement's own reads) into the bounded `MapDress` the ground-dress layer consumes
 * (groundDress.js). It is the SINGLE place the season/severity/state is derived — NEVER stored
 * on the settlement (design §3: "never stored on the settlement", the RealmStrip read pattern):
 *   • SEASON   — `worldState.calendar.season` (the live in-world clock).
 *   • SEVERITY — re-derived via `seasonalSeverityFor(worldState.rngSeed, year, settlementId)`
 *                (seasons.js), the seeded "no two winters alike" verdict; never persisted.
 *
 * DORMANCY (the law this file upholds): when there is nothing to dress — no campaign / no live
 * season — it returns `null`, and the caller passes `null` into buildTownMapDrawList ⇒ the
 * SEASONLESS BASE BYTES (byte-identical to every 2-arg golden + export). Standalone surfaces
 * (a library detail with no campaign, the anonymous gallery) hit exactly that path.
 *
 * PURITY: reads plain objects + calls the pure `seasonalSeverityFor` (no store, no Date, no
 * Math.random, no localeCompare — the townMap domain source-scan bans them). The threaded input
 * is `worldState` (not a bare calendar) because the SEVERITY draw needs `worldState.rngSeed`,
 * which the calendar object does not carry — the calendar alone is insufficient.
 */

import { seasonalSeverityFor } from '../worldPulse/seasons.js';

/** The bounded season vocabulary (the 4-4-5 calendar's four quarters). */
const SEASONS = Object.freeze(new Set(['spring', 'summer', 'autumn', 'winter']));

/** Normalize a raw calendar season to the bounded vocabulary (lowercased), else null — the
 *  same tolerant read RealmStrip uses (`String(cal.season||'').toLowerCase()`).
 *  @param {unknown} raw @returns {'spring'|'summer'|'autumn'|'winter'|null} */
function normSeason(raw) {
  const s = typeof raw === 'string' ? raw.toLowerCase() : '';
  return SEASONS.has(s) ? /** @type {'spring'|'summer'|'autumn'|'winter'} */ (s) : null;
}

/**
 * Resolve the season/severity portrait for a settlement's map. PURE. Returns `null` when there
 * is no live season to paint (no worldState / no calendar season) ⇒ the caller passes null ⇒
 * seasonless base bytes (the dormancy law).
 * @param {{ id?: string|number } | null | undefined} settlement
 * @param {{ calendar?: { season?: string, year?: number } | null, rngSeed?: string } | null | undefined} worldState
 * @returns {import('./groundDress.js').MapDress | null}
 */
export function resolveMapDress(settlement, worldState) {
  const calendar = worldState && typeof worldState === 'object' ? worldState.calendar : null;
  const season = normSeason(calendar ? calendar.season : null);
  if (!season) return null;

  const rngSeed = worldState && typeof worldState.rngSeed === 'string' ? worldState.rngSeed : null;
  const year = calendar && Number.isFinite(calendar.year) ? Number(calendar.year) : null;
  const settlementId = settlement && settlement.id != null ? settlement.id : null;
  const severity = (rngSeed && year != null && settlementId != null)
    ? seasonalSeverityFor(rngSeed, year, settlementId)
    : null;

  return { season, severity };
}
