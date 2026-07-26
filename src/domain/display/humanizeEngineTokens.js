/**
 * domain/display/humanizeEngineTokens.js — THE PRESENTATION-BOUNDARY HUMANIZER
 * (fix wave 3: engine tokens must not reach reader prose).
 *
 * The reader-facing composers (chronicler's letter, world book, advance report)
 * historically passed engine values straight into prose: bare `tick <n>` counters,
 * camelCase simulationRules flag keys, snake_case schema tokens. This module is
 * the ONE chokepoint that turns those into the house voice, so every composer
 * spells them the same way and the no-engine-token walker
 * (tests/copy/proseLeak.test.js) can burn the remaining call sites down.
 *
 * PURE LEAF — no imports, no store, no clock, no rng. Display sidecar idiom:
 * the 4-line season derivation is a LOCAL COPY of worldPulse's seasonForTick
 * (the chronicleReadModel precedent — display never imports the engine chunk;
 * the unit test pins agreement with seasonForTick so the copies cannot drift).
 * Lazy by construction: imported only by lazy composer chunks, never the eager
 * first-paint closure.
 */

// The durable calendar (mirrors seasonForTick — pinned in the unit test).
const WEEKS_PER_YEAR = 52;
const WEEKS_PER_SEASON = 13;
const SEASONS = Object.freeze(['spring', 'summer', 'autumn', 'winter']);
/** @type {Readonly<Record<string, string>>} */
const SETTLEMENT_SIZE_LABELS = Object.freeze({
  thorp: 'Thorp',
  hamlet: 'Hamlet',
  village: 'Village',
  town: 'Town',
  city: 'City',
  capital: 'Metropolis',
  metropolis: 'Metropolis',
});

/**
 * A tick (elapsed weeks) as a calendar phrase the reader can live inside:
 * `the spring of year 1`. Total on garbage (non-finite ⇒ week 0).
 * @param {number} tick
 * @returns {string}
 */
export function tickCalendarLabel(tick) {
  const w = Math.max(0, Math.floor(Number(tick) || 0));
  const weekOfYear = w % WEEKS_PER_YEAR;
  const season = SEASONS[Math.floor(weekOfYear / WEEKS_PER_SEASON)] || 'spring';
  return `the ${season} of year ${Math.floor(w / WEEKS_PER_YEAR) + 1}`;
}

/**
 * A calendar label precise enough to distinguish adjacent Chronicle entries:
 * `week 8 of spring, year 1`.
 *
 * The Chronicle is weekly, so the season-only label above is intentionally too
 * coarse for its scrubber. This detail form delegates the durable season/year
 * wording to `tickCalendarLabel`; it adds only the week within that season.
 *
 * @param {number} tick
 * @returns {string}
 */
export function tickCalendarDetailLabel(tick) {
  const w = Math.max(0, Math.floor(Number(tick) || 0));
  const seasonAndYear = tickCalendarLabel(w)
    .replace(/^the /, '')
    .replace(' of year ', ', year ');
  return `week ${(w % WEEKS_PER_SEASON) + 1} of ${seasonAndYear}`;
}

/**
 * A schema token (snake_case, kebab-case, or camelCase) as plain lowercase
 * words: `succession_coup` → `succession coup`, `goalProgress` → `goal progress`.
 * Total on garbage (non-string ⇒ '').
 * @param {unknown} token
 * @returns {string}
 */
export function humanizeToken(token) {
  return String(token ?? '')
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * A stored settlement-size token as the product's reader-facing size name.
 *
 * The canonical six sizes have authored labels; the legacy `capital` token
 * resolves to the same final rung as `metropolis`. Unknown future or imported
 * tokens remain legible through the general token humanizer rather than leaking
 * underscores or silently disappearing.
 *
 * @param {unknown} value
 * @param {string} [fallback]
 * @returns {string}
 */
export function settlementSizeLabel(value, fallback = '') {
  const key = String(value ?? '').trim().toLowerCase();
  if (!key) return fallback;
  if (SETTLEMENT_SIZE_LABELS[key]) return SETTLEMENT_SIZE_LABELS[key];
  const words = humanizeToken(value);
  return words ? `${words.charAt(0).toUpperCase()}${words.slice(1)}` : fallback;
}

/**
 * A simulationRules flag key as a reader-facing layer name: `warLayerEnabled` →
 * `the war layer`, `faithSpreadEnabled` → `the faith spread`. Mechanical (strip
 * the `Enabled` suffix, space the camel humps, definite article) so every new
 * flag humanizes without a hand-kept table.
 * @param {string} key
 * @returns {string}
 */
export function humanizeFlagKey(key) {
  const words = humanizeToken(String(key ?? '').replace(/Enabled$/, ''));
  return words ? `the ${words}` : '';
}
