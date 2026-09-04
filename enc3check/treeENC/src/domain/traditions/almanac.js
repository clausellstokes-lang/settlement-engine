/**
 * domain/traditions/almanac.js — THE TRADITIONS wave (Engine Lift #4), slice T-5.
 *
 * `deriveTraditionAlmanac({ settlements, weekTick })` — the pure "coming this season"
 * read-model for the realm-level almanac line (RealmStrip). It reads ONLY the already-
 * projected `settlement.traditions` MIRROR (the T-2 mover's read-model) — never the
 * genesis leaf, never the corpus — so it adds ZERO of the traditions engine to the
 * eager RealmStrip chunk; a dark/absent campaign (no mirror) reduces to
 * `{ available: false }` and the caller renders NOTHING (byte-identical to today).
 *
 * PURITY (the dossierViewModel.deriveGranaryOutlook precedent): a true leaf — no store/
 * React import, no Date/Math.random. The season-of-week math is the canonical 4-4-5 week
 * clock (13 weeks/season, 52-week year), duplicated locally EXACTLY as dossierViewModel.js
 * duplicates it (never derived from month labels — DESIGN_TRADITIONS §17), so this leaf
 * pulls in no worldPulse engine module. Agrees with worldState.seasonForTick by construction.
 */

/** @typedef {import('./genesis.js').TraditionRec} TraditionRec */

// ── the canonical 4-4-5 week clock (mirrors worldState.seasonForTick / dossierViewModel) ──
const WEEKS_PER_SEASON = 13;
const WEEKS_PER_YEAR = 52;
/** @type {ReadonlyArray<'spring'|'summer'|'autumn'|'winter'>} */
const SEASONS = Object.freeze(['spring', 'summer', 'autumn', 'winter']);

/** @param {unknown} x @param {number} d @returns {number} */
function num(x, d) {
  const n = Number(x);
  return Number.isFinite(n) ? n : d;
}
/** Codepoint-stable compare (byte-stable ordering). @param {string} a @param {string} b @returns {number} */
function cmp(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * The season a 1-based week-of-year (1..52) falls in. Pure, total.
 * @param {number} weekOfYear @returns {'spring'|'summer'|'autumn'|'winter'}
 */
export function seasonOfWeek(weekOfYear) {
  const w0 = ((Math.floor(num(weekOfYear, 1)) - 1) % WEEKS_PER_YEAR + WEEKS_PER_YEAR) % WEEKS_PER_YEAR;
  return SEASONS[Math.floor(w0 / WEEKS_PER_SEASON)] || 'spring';
}

/**
 * The current in-world season + 1-based week-of-year for an elapsed-week tick. Pure.
 * @param {number} weekTick  canonical elapsed weeks (calendar.elapsedWeeks)
 * @returns {{ season: 'spring'|'summer'|'autumn'|'winter', weekOfYear: number }}
 */
export function clockOfTick(weekTick) {
  const weeks = Math.max(0, Math.floor(num(weekTick, 0)));
  const weekOfYear0 = weeks % WEEKS_PER_YEAR;
  return { season: SEASONS[Math.floor(weekOfYear0 / WEEKS_PER_SEASON)] || 'spring', weekOfYear: weekOfYear0 + 1 };
}

/** @typedef {{ id?: unknown, name?: unknown, settlement?: { name?: unknown, traditions?: unknown } }} AlmanacSave */
/** @typedef {{ name: string, settlementName: string, startWeekOfYear: number, weeks: number }} AlmanacEntry */

/**
 * The realm's "coming this season" almanac: every ACTIVE (non-suppressed) observance
 * across the member settlements whose window OPENS later in the CURRENT season and has
 * not yet arrived (startWeekOfYear >= the current week-of-year). Reads the mirror only;
 * absent ⇒ `{ available: false }` and the caller renders nothing. Pure, deterministic.
 * @param {{ settlements?: AlmanacSave[], weekTick?: number }} args
 * @returns {{ available: boolean, coming: AlmanacEntry[], count: number, season: string, display: string|null }}
 */
export function deriveTraditionAlmanac({ settlements, weekTick } = {}) {
  const { season, weekOfYear } = clockOfTick(weekTick ?? 0);
  const empty = { available: false, coming: /** @type {AlmanacEntry[]} */ ([]), count: 0, season, display: null };
  const saves = Array.isArray(settlements) ? settlements : [];

  /** @type {AlmanacEntry[]} */
  const coming = [];
  for (const sv of saves) {
    const s = sv && typeof sv === 'object' ? sv.settlement : null;
    const recs = s && Array.isArray(s.traditions) ? /** @type {TraditionRec[]} */ (s.traditions) : [];
    if (!recs.length) continue;
    const settlementName = String((s && s.name) || (sv && sv.name) || (sv && sv.id) || 'a settlement');
    for (const rec of recs) {
      if (!rec || typeof rec !== 'object' || rec.suppressedBy) continue; // a suppressed rite does not occur
      const win = rec.window && typeof rec.window === 'object' ? rec.window : null;
      const startWeekOfYear = Math.max(1, Math.min(52, Math.floor(num(win && win.startWeekOfYear, 1))));
      if (seasonOfWeek(startWeekOfYear) !== season) continue;   // not this season
      if (startWeekOfYear < weekOfYear) continue;               // already passed this year
      coming.push({
        name: String(rec.name || 'an observance'),
        settlementName,
        startWeekOfYear,
        weeks: Math.max(1, Math.min(2, Math.floor(num(win && win.weeks, 1)))),
      });
    }
  }
  if (!coming.length) return empty;

  coming.sort((a, b) => (a.startWeekOfYear - b.startWeekOfYear) || cmp(a.name, b.name) || cmp(a.settlementName, b.settlementName));
  const count = coming.length;
  const lead = coming[0];
  // A named lead when there is exactly one; a count otherwise (the realm strip stays terse).
  const display = count === 1
    ? `${lead.name} coming this season`
    : `${count} festivals coming this season`;
  return { available: true, coming, count, season, display };
}
