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
 *   • STATE    (IT3-b) — the town's live condition, ALL from EXISTING pure reads, each dormant-
 *                absent: BESIEGED via settlementWarStatus (worldState + regionalGraph); SCAR
 *                grain via fabricScarsOf (the urban-fabric mirror — dark ⇒ empty); REBIRTH
 *                classes via fabricRebirthsOf. Read-only; never stored on the settlement.
 *
 * DORMANCY (the law this file upholds): when there is nothing to dress — no live season AND no
 * state — it returns `null`, and the caller passes `null` into buildTownMapDrawList ⇒ the
 * SEASONLESS BASE BYTES (byte-identical to every 2-arg golden + export). Standalone surfaces
 * (a library detail with no campaign, the anonymous gallery) hit exactly that path. The state
 * reads are individually dormant-absent too — a settlement with no urban-fabric mirror + no
 * siege yields no state marks (the mirror is DARK by default).
 *
 * PURITY: reads plain objects + calls the pure seasons/warStatus/fabricRead selectors (no store,
 * no Date, no Math.random, no localeCompare — the townMap domain source-scan bans them). The
 * threaded input is `worldState` (not a bare calendar) because the SEVERITY draw needs
 * `worldState.rngSeed`, which the calendar object does not carry — the calendar alone is
 * insufficient; `regionalGraph` (optional) is needed only for the siege read.
 */

import { seasonalSeverityFor } from '../worldPulse/seasons.js';
import { settlementWarStatus } from '../display/warStatus.js';
import { fabricScarsOf, fabricRebirthsOf } from './fabricRead.js';
import { readMapEdits, readSeasonOverride } from './mapEdits.js';

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
 * Resolve the town's live STATE marks (IT3-b) — all from EXISTING pure reads, each dormant-
 * absent. Returns `null` when the town is in no notable state (no siege, no scars, no rebirth)
 * ⇒ contributes nothing to the dormancy decision. PURE.
 * @param {{ id?: string|number, urbanFabric?: unknown } | null | undefined} settlement
 * @param {unknown} worldState @param {unknown} regionalGraph
 * @returns {import('./groundDress.js').MapDressState | null}
 */
function resolveMapState(settlement, worldState, regionalGraph) {
  // SCAR grain — the worst stressor severity (0 ⇒ none). Whole-fabric, per the read layer:
  // fabricScarsOf surfaces scars by kind + severity, not per district (dark mirror ⇒ []).
  let scarLevel = 0;
  for (const s of fabricScarsOf(settlement)) if (s.severity > scarLevel) scarLevel = s.severity;

  // REBIRTH — the deduped set of district CLASSES the mirror marks rebuilt (dark ⇒ ∅). The
  // dress matches these against each district's `category` to place the scaffold.
  const rebuiltSet = new Set();
  for (const r of fabricRebirthsOf(settlement)) for (const c of r.classes) rebuiltSet.add(c);
  const rebuiltCategories = [...rebuiltSet].sort();  // codepoint order (no localeCompare)

  // BESIEGED — a live war-state read (worldState + regionalGraph, both required). There is NO
  // per-settlement siege flag on the settlement object; this is the war-status selector.
  let besieged = false;
  if (worldState && settlement && settlement.id != null) {
    const st = settlementWarStatus({ settlementId: settlement.id, worldState, regionalGraph });
    besieged = !!(st && Array.isArray(st.besiegedBy) && st.besiegedBy.length > 0);
  }

  if (!besieged && scarLevel <= 0 && rebuiltCategories.length === 0) return null;
  return { besieged, scarLevel, rebuiltCategories };
}

/**
 * Resolve the season + state portrait for a settlement's map. PURE. Returns `null` when there
 * is nothing to paint (no season AND no state) ⇒ the caller passes null ⇒ seasonless base bytes
 * (the dormancy law). The season is the DM's PINNED override (settlement.mapEdits.seasonOverride,
 * IT3-c) when set, else the live world clock — so a pinned map paints its season even with no
 * campaign (severity still derives from the live year when a worldState is present). `regionalGraph`
 * (optional) is needed only for the siege read — a surface without it (the thumbnail) still gets
 * scars + rebirth (settlement-only reads).
 * @param {{ id?: string|number, urbanFabric?: unknown, mapEdits?: unknown } | null | undefined} settlement
 * @param {{ calendar?: { season?: string, year?: number } | null, rngSeed?: string } | null | undefined} worldState
 * @param {unknown} [regionalGraph]
 * @returns {import('./groundDress.js').MapDress | null}
 */
export function resolveMapDress(settlement, worldState, regionalGraph = null) {
  const calendar = worldState && typeof worldState === 'object' ? worldState.calendar : null;
  // The PINNED override (IT3-c) wins over the live season; absent ⇒ follow the world clock.
  const season = readSeasonOverride(readMapEdits(settlement)) || normSeason(calendar ? calendar.season : null);
  const state = resolveMapState(settlement, worldState, regionalGraph);
  if (!season && !state) return null;

  const rngSeed = worldState && typeof worldState.rngSeed === 'string' ? worldState.rngSeed : null;
  const year = calendar && Number.isFinite(calendar.year) ? Number(calendar.year) : null;
  const settlementId = settlement && settlement.id != null ? settlement.id : null;
  const severity = (season && rngSeed && year != null && settlementId != null)
    ? seasonalSeverityFor(rngSeed, year, settlementId)
    : null;

  return { season, severity, state };
}
