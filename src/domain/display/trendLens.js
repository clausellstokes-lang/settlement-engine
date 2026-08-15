/**
 * domain/display/trendLens.js — V-25e RADAR LENSES v1. Derived TREND indicators from a
 * settlement's populationHistory ring — the honest, minimal form of the "future-lens" family.
 *
 * TREND, NEVER PROPHECY: every reading is RETROSPECTIVE / present-perfect — what the ring HAS
 * done over the recent window — never a forecast. CLAIMS-PARITY (the V-10 discipline applied to
 * trends): each lens's reading is a pure function of the ring computation; there is no claim
 * without its enforcing fold. The band is taken over the POPULATION SERIES (so it stays coherent
 * with the visible population arc and is robust to both ring formats — plain numbers OR
 * {population} records), banded by the SAME thresholds the belief axes' demographic trend uses.
 *
 * Pure, deterministic, RNG/clock-free — a view-time read over the durable ring only. Zero
 * first-paint bytes (a display leaf, imported only by the lazy what-changed surface).
 *
 * @enforced-by tests/domain/trendLensClaimsParity.test.js
 */

import { AXIS_TUNING } from '../worldPulse/beliefAxes.js';

/** band (−2..+2) → the trend DIRECTION (a bucket, not a prediction). */
const DIRECTION = Object.freeze({ '-2': 'falling', '-1': 'falling', 0: 'steady', 1: 'rising', 2: 'rising' });
/** band → the RETROSPECTIVE reading verb. Strictly present-perfect (what HAS happened); a scan
 *  pin (trendLensClaimsParity) forbids any forecast vocabulary from ever entering this table. */
const POP_READING = Object.freeze({
  '-2': 'has been emptying',
  '-1': 'has been thinning',
  0: 'has held level',
  1: 'has been growing',
  2: 'has been swelling',
});

/** The population value from a ring entry — a plain number OR a {population} record.
 *  @param {unknown} entry @returns {number|null} */
function popOf(entry) {
  if (typeof entry === 'number') return Number.isFinite(entry) ? entry : null;
  const p = entry && typeof entry === 'object' ? Number(/** @type {Record<string, unknown>} */ (entry).population) : NaN;
  return Number.isFinite(p) ? p : null;
}

/**
 * The −2..+2 population trend band over the recent window, from the population SERIES — coherent
 * with the visible arc and robust to both ring formats. Same thresholds AXIS_TUNING uses. Fewer
 * than two readings ⇒ band 0, window < 2 (nothing to trend). Pure, total.
 * @param {unknown} history
 * @returns {{ band: number, net: number, window: number }}
 */
export function populationTrendBand(history) {
  const pops = /** @type {number[]} */ ((Array.isArray(history) ? history : []).map(popOf).filter((p) => p != null));
  if (pops.length < 2) return { band: 0, net: 0, window: pops.length };
  const win = pops.slice(-AXIS_TUNING.TREND_WINDOW);
  const first = win[0];
  const last = win[win.length - 1];
  const net = Math.round(last - first);
  const ratio = (last - first) / Math.max(1, first);
  const T = AXIS_TUNING;
  const band = ratio <= -T.TREND_STRONG ? -2
    : ratio <= -T.TREND_MILD ? -1
      : ratio < T.TREND_MILD ? 0
        : ratio < T.TREND_STRONG ? 1
          : 2;
  return { band, net, window: win.length };
}

/**
 * @typedef {Object} TrendLens
 * @property {string} id
 * @property {string} label
 * @property {number} band          −2..+2 (from populationTrendBand)
 * @property {'rising'|'steady'|'falling'} direction
 * @property {number} magnitude     the net change over the window (a factual past number)
 * @property {number} window        how many recent readings the reading covers
 * @property {string} reading       a retrospective sentence — never a forecast
 */

/**
 * Build the trend lenses for a settlement from its populationHistory ring. Fewer than two
 * readings ⇒ [] (nothing to trend yet). Pure, deterministic.
 * @param {{ settlement?: { populationHistory?: unknown }|null }} [args]
 * @returns {TrendLens[]}
 */
export function buildTrendLenses({ settlement } = {}) {
  const history = settlement && Array.isArray(settlement.populationHistory) ? settlement.populationHistory : [];
  // NB: destructured as windowSize (not `window`) — the engine spine must stay DOM-free
  // and worker-loadable; a local named `window` shadows the browser global and trips the
  // engineWorkerDomFree source-scan guard (its binding heuristic can't see a destructured
  // `window`). The public TrendLens field is still `window`.
  const { band, net, window: windowSize } = populationTrendBand(history);
  if (windowSize < 2) return [];
  const key = String(band);
  const direction = /** @type {'rising'|'steady'|'falling'} */ ((/** @type {Record<string, string>} */ (DIRECTION))[key] || 'steady');
  const verb = (/** @type {Record<string, string>} */ (POP_READING))[key] || 'has held level';
  const netClause = net !== 0 ? ` (net ${net > 0 ? '+' : ''}${net})` : '';
  return [{
    id: 'population',
    label: 'Population',
    band,
    direction,
    magnitude: net,
    window: windowSize,
    reading: `${verb} over the last ${windowSize} reading${windowSize === 1 ? '' : 's'}${netClause}`,
  }];
}
