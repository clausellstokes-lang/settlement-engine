// @ts-check
/**
 * domain/display/severityInterval.js — THE INTERVAL TEST: A ROW THAT READS A RE-DERIVED SEVERITY PRINTS ONLY WHERE BOTH ENDS
 * OF THE SERVED BAND AGREE (RULING V29 (1), its rule ruled V33 (A); VEIL-56's PG; measured in
 * docs/chair/2026-11-27/eleventh/veil/v56/pg/PG-REPORT.md, M1).
 *
 * Every non-owner read withholds a condition's severity and serves its band (registry: conditions.severity, VR37); the
 * shared page puts back the band's fixed default (`pageRederive.js :: rederiveForPage`, `activeConditions.js ::
 * defaultSeverityForBand`) and marks the condition `severityFromBand`. The default is not the stored number (105 of 111 on
 * PG's pools), so a row that scales it can cross a band edge and print a band the owner's page does not (a FALSE BAND:
 * "Trade connectivity" Strained beside the owner's Adequate). The served band says only that the severity lies inside its
 * interval, so a row is printed only where it prints the SAME at every corner of the marked conditions' intervals; anywhere
 * else the served data cannot decide it and the row is not printed. It reads served data only (the band), so a printed row
 * tells nothing the band does not. On PG's pools: 0 wrong rows printed at every marker, 37 / 30 rows not printed.
 *
 * THE INTERVALS ARE THE ENGINE'S OWN: the cuts are read off `severityBand` itself (bisection, once), never typed here, so a
 * moved cut moves them; `deriveActiveCondition` clamps a severity to [0, 1]. An interval's open upper end is taken at its
 * cut less 1e-9. Monotone: no row moved twice inside a band on PG's pools (7 points per interval), so the corners decide it.
 * With more marked conditions than CORNER_LIMIT allows, every row any of them reads is not printed (fail closed).
 * The owner's own record carries no mark, so nothing here applies to it and every row prints as before. Pure.
 */
import { deriveAllActiveConditions, severityBand } from '../activeConditions.js';

const EPS = 1e-9;
const CORNER_LIMIT = 6; // 1 << 6 renders of the causal read at most

/** @type {Record<string, readonly [number, number]> | null} */
let intervals = null;
/** The engine's own band intervals, read off `severityBand` (its cuts by bisection). @returns {Record<string, readonly [number, number]>} */
function bandIntervals() {
  if (intervals) return intervals;
  /** @param {string} below the band under the cut @returns {number} */
  const cutAbove = (below) => {
    let lo = 0; let hi = 1;
    for (let i = 0; i < 60; i += 1) { const m = (lo + hi) / 2; if (severityBand(m) === below) lo = m; else hi = m; }
    return hi;
  };
  const [a, b, c] = [cutAbove('low'), cutAbove('medium'), cutAbove('high')];
  intervals = Object.freeze({ low: [0, a - EPS], medium: [a, b - EPS], high: [b, c - EPS], critical: [c, 1] });
  return intervals;
}

/**
 * The rows (variable keys) the served data cannot decide: those whose printed word differs between corners of the marked
 * conditions' band intervals. Empty where no condition carries the page's re-derive mark (every owner's record).
 * @param {any} settlement
 * @param {(s: any) => Record<string, string>} wordsOf the tab's printed word per variable key, over a settlement
 * @returns {Set<string>}
 */
export function severityUnsettledRows(settlement, wordsOf) {
  /** @type {any[]} */ const list = Array.isArray(settlement?.activeConditions) ? settlement.activeConditions : [];
  const iv = bandIntervals();
  /** @type {number[]} */ const marked = list.map((/** @type {any} */ c, /** @type {number} */ i) => (c && typeof c === 'object' && c.severityFromBand === true && iv[c.severityBand] ? i : -1)).filter((/** @type {number} */ i) => i >= 0);
  /** @type {Set<string>} */ const out = new Set();
  if (!marked.length) return out;
  if (marked.length > CORNER_LIMIT) {
    const ids = new Set(marked.map((/** @type {number} */ i) => list[i].id));
    for (const c of deriveAllActiveConditions(settlement)) {
      if (!ids.has(c.id)) continue;
      for (const k of c.affectedSystems || []) out.add(k);
      if (c.archetype === 'war_spoils') out.add('economic_capacity');
    }
    return out;
  }
  /** @type {Array<Record<string, string>>} */ const corners = [];
  for (let m = 0; m < (1 << marked.length); m += 1) {
    const at = new Map(marked.map((/** @type {number} */ i, /** @type {number} */ j) => [i, iv[list[i].severityBand][(m >> j) & 1]]));
    corners.push(wordsOf({ ...settlement, activeConditions: list.map((/** @type {any} */ c, /** @type {number} */ i) => (at.has(i) ? { ...c, severity: at.get(i) } : c)) }));
  }
  const keys = new Set(corners.flatMap((w) => Object.keys(w)));
  for (const k of keys) if (corners.some((w) => w[k] !== corners[0][k])) out.add(k);
  return out;
}
