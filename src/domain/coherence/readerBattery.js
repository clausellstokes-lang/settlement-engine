/**
 * domain/coherence/readerBattery.js — THE READER BATTERY: the plausibility observations a DM
 * makes reading a generated settlement end to end (lane READER-INSTRUMENTS, 2026-11-04).
 *
 * The chair read three settlements as a DM would and found a fault family the soak ladder
 * never counted: pools and validators that never consult the record (the "fine print") —
 * the generator's own validation lines printed as facts, luxury imports in a thorp, a Mentor
 * and Successor across two trades, a living grievance from an occupation three centuries
 * gone, guards in hooks where there is no guard, a Tide Fair on a plains road, "Wants to Was
 * approached…", catalogue threshold notes, "Tailor's'", the Daily Life placeholder. The owner
 * (2026-11-04 ~15:25 UTC): "Add these kinds of observations to your 1000+ runs as well".
 *
 * These are INSTRUMENTS ONLY; nothing here cures anything (the cures are the READER WINDOW).
 * The soak counts them under the `reader:` family, one kind (`KIND_OF`), in a table of their
 * own outside the stop rule (scripts/audit/soak-review/aggregate.mjs).
 *
 * Every check reads RENDERED text (the surfaces `renderHarness.mjs :: renderSurfaces` paints:
 * the twenty tabs, the Tonight sheet, the PDF and the Foundry journal) and consults the RECORD
 * only for what IS (the roster, the institutions, the terrain and route, the tension's source
 * event). A finding has the battery's shape `{ check, surface, quote, detail }`; a sub-case is
 * the detail's leading `[tag]`, which the aggregate counts.
 *
 * Pure.
 */

import { collect, str } from './recordBattery.js';

/** @typedef {import('./coherenceBattery.js').BatteryFinding} BatteryFinding */

// ───────────────────────────── shared readers ─────────────────────────────

/** @param {string} text @returns {string[]} */
const linesOf = (text) => str(text).split('\n').map((x) => x.trim()).filter(Boolean);

/** @param {any} s @returns {string} the terrain the Resources tab names */
export function terrainOf(s) {
  return str(s?.config?.terrainType ?? s?.config?.terrainOverride ?? s?.terrain ?? s?.resourceAnalysis?.terrain);
}

/** @param {any} s @returns {string} */
export function routeOf(s) {
  return str(s?.config?.tradeRouteAccess ?? s?.tradeRouteAccess);
}

/** Navigable water by terrain or route (the soak's own `hasWater` reading, checks.mjs). */
const WATER_TERRAIN_WIDE = /coast|river|lake|marsh|swamp|island|delta|fjord|wetland|sea/i;
/** @param {any} s */
export const hasNavigableWater = (s) => WATER_TERRAIN_WIDE.test(terrainOf(s)) || routeOf(s) === 'port' || routeOf(s) === 'river';

// ───────────────────────── 1. validation-on-page ─────────────────────────

const REQUIRES_ACCESS = /\brequires? ([a-z ]+?) access\b/;
const NOT_COMPATIBLE = /\bis not compatible with\b/;
const LACKS_ACCESS = /\bexists but lacks access to\b/;

/**
 * The generator's own consistency checks rendered as facts: "X requires river access", "X is
 * not compatible with port access", "<house> exists but lacks access to <good>", and the
 * Viability page's stated count of critical issues against the Critical Issues it lists.
 * Sub-cases: `[structural]` (requires / not compatible), `[requires-on-water]` (a "requires
 * <water> access" where the terrain IS that water), `[gaps]` (the lacks-access lines A-05
 * counts), `[viability-count]`.
 * @param {any} s @param {Readonly<Record<string,string>>} surfaces
 */
export function validationOnPageFindings(s, surfaces) {
  /** @type {Array<{surface:string,quote:string,detail:string}>} */
  const out = [];
  const terrain = terrainOf(s);
  for (const [surface, text] of Object.entries(surfaces)) {
    const lines = linesOf(text);
    const structural = lines.find((x) => REQUIRES_ACCESS.test(x) || NOT_COMPATIBLE.test(x));
    if (structural) out.push({ surface, quote: structural, detail: `[structural] ${lines.filter((x) => REQUIRES_ACCESS.test(x) || NOT_COMPATIBLE.test(x)).length} lines` });
    const onWater = lines.find((x) => {
      const m = x.match(REQUIRES_ACCESS);
      if (!m) return false;
      const need = m[1].toLowerCase();
      return (/river/.test(need) && /river/i.test(terrain)) || (/coast|sea|port/.test(need) && /coast/i.test(terrain)) || (/lake/.test(need) && /lake/i.test(terrain));
    });
    if (onWater) out.push({ surface, quote: onWater, detail: `[requires-on-water] terrain ${terrain}, route ${routeOf(s)}` });
    const gap = lines.find((x) => LACKS_ACCESS.test(x));
    if (gap) out.push({ surface, quote: gap, detail: `[gaps] ${lines.filter((x) => LACKS_ACCESS.test(x)).length} lines` });
  }
  const viability = str(surfaces.viability);
  const stated = viability.match(/^(\d+) critical issues? prevents? /m);
  if (stated) {
    const listed = viability.match(/^Critical Issues \((\d+)\)/m);
    const n = Number(stated[1]);
    const m = listed ? Number(listed[1]) : 0;
    if (n !== m) out.push({ surface: 'viability', quote: stated[0].trim(), detail: `[viability-count] states ${n}, lists Critical Issues (${m})` });
  }
  return out;
}

// ───────────────────────────── the battery ─────────────────────────────

const RUNS = Object.freeze({
  'validation-on-page': validationOnPageFindings,
});

/** The checks, in report order (the soak prefixes each with `reader:`). */
export const READER_BATTERY_CHECKS = Object.freeze(Object.keys(RUNS));

/**
 * Every reader finding for one settlement and its rendered surfaces, in report order.
 * @param {unknown} settlement the generated record
 * @param {Readonly<Record<string, string>>} surfaces surface id → text (tabs by id, `tonight`, `pdf`, `foundry`)
 * @param {{ only?: ReadonlyArray<string> }} [options]
 * @returns {BatteryFinding[]}
 */
export function readerBattery(settlement, surfaces, options = {}) {
  if (settlement == null || typeof settlement !== 'object') return [];
  const wanted = Array.isArray(options?.only) ? new Set(options.only) : null;
  const text = Object.fromEntries(Object.entries(surfaces ?? {}).map(([k, v]) => [k, str(v)]));
  /** @type {BatteryFinding[]} */
  const out = [];
  for (const check of READER_BATTERY_CHECKS) {
    if (wanted && !wanted.has(check)) continue;
    const run = RUNS[/** @type {keyof typeof RUNS} */ (check)];
    // recordBattery.js :: collect's contract: an instrument that throws is a finding, never a
    // silent zero. Each reader row names its own surface, so the map runs per row here.
    /** @type {Array<{surface:string,quote:string,detail:string}>} */
    let rows;
    try {
      rows = run(settlement, text);
    } catch (error) {
      collect(check, 'record', () => { throw error; }, () => ({ quote: '', detail: '' }), out);
      continue;
    }
    for (const r of rows) out.push({ check, surface: r.surface, quote: str(r.quote).trim(), detail: str(r.detail) });
  }
  return out;
}
