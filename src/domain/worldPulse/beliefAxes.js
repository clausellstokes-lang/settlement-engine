/**
 * beliefAxes.js — D-1 (deep-couplings): THE BELIEF AXES (demographic + cultural).
 *
 * ONE belief-axis machinery, TWO feeders (DESIGN_DEEP_COUPLINGS §5). BeliefRecord gains two
 * OPTIONAL fields, present ONLY where the virtual `beliefAxesEnabled` flag is lit (dormancy by
 * absence, law 12):
 *   • populationTrendBand — DEMOGRAPHIC: believed −2..+2 (emptying … swelling), a NUMERIC axis.
 *     Fed transitively through D-0: migration → (rumor) migration_flight event → (here) belief.
 *     An observer comes to believe — rightly, or with degraded fidelity and stale arrivals
 *     WRONGLY — that "City X is emptying out."
 *   • observanceLabel — CULTURAL: believed dominant rite `${motif}:${patronOrNull}`, the
 *     faithLabel twin (a CATEGORICAL axis). Fed by tradition-mutation beats once they clear the
 *     rumor floor (D-1c). THE STALENESS IS THE FEATURE: a rival that heard nothing still believes
 *     the OLD rite persists after politics rededicated it — fog-of-war about culture.
 *
 * beliefMap.js owns the writer (advanceBeliefMaps); this leaf is PURE fold/reconcile logic it
 * threads at three injection points (ground-truth derivation, report tagging, the axis fold) —
 * exactly the credibilityOf injection shape. ABSENT flag ⇒ never called ⇒ byte-identical.
 *
 * BELIEFS-NEVER-TRUTH (law 3): every value here is a BELIEVED state — the ground-truth reads
 * (populationHistory ring / traditions mirror) are the re-anchor/cold-start target only; nothing
 * here writes a population count or a tradition record's truth.
 *
 * PURE + lazy: no Date, no Math.random, no store/React, no import of beliefMap (one-way — beliefMap
 * imports this). Zero first-paint bytes (a worldPulse leaf).
 */

import { clamp, clamp01 } from '../../kernel/math.js';

/** Axis tuning (retuned in the checkpoint soak; DESIGN_DEEP_COUPLINGS does not owner-gate the
 *  D-1 tuning constants — the field SHAPE is the owner-visible surface, §14 Q2). */
export const AXIS_TUNING = Object.freeze({
  // The categorical-adoption fidelity floor — a fresh cultural beat at/above this aggregate
  // accuracy lets the observer ADOPT the current true observance; below it the stale rite
  // survives (low-fidelity culture-news does not overturn a settled view). Mirrors
  // BELIEF_TUNING.CAT_ADOPT_ACCURACY (kept local to avoid a beliefMap import cycle).
  CAT_ADOPT_ACCURACY: 0.6,
  // How many recent populationHistory entries the ground-truth trend reads.
  TREND_WINDOW: 6,
  // Net-delta / population ratio thresholds → the −2..+2 ground-truth trend band.
  TREND_STRONG: 0.15,
  TREND_MILD: 0.04,
  // A migration_flight's content magnitude band (1..3) → the trend push magnitude it implies.
  MAG_SCALE: Object.freeze({ 1: 0.8, 2: 1.4, 3: 2.0 }),
  // The rumor-fed observed trend's weight against the prior band in the demographic blend.
  OBS_WEIGHT: 0.6,
});

const TREND_MIN = -2;
const TREND_MAX = 2;

/** @param {unknown} v @param {number} fallback @returns {number} */
function finiteNumber(v, fallback) { return typeof v === 'number' && Number.isFinite(v) ? v : fallback; }

/** The belief-axes gate (DESIGN_DEEP_COUPLINGS law 1 idiom). Requires beliefsActive (checked by
 *  the caller — advanceBeliefMaps early-returns when beliefs are dormant) AND the virtual flag,
 *  ABSENT from DEFAULT_SIMULATION_RULES ⇒ dark everywhere until the owner lights it.
 *  @param {{ simulationRules?: Record<string, unknown> } | null | undefined} worldState @returns {boolean} */
export function beliefAxesActive(worldState) {
  const rules = worldState && typeof worldState === 'object' ? worldState.simulationRules : null;
  return !!(rules && typeof rules === 'object' && rules.beliefAxesEnabled === true);
}

// ── Ground-truth axis derivation (cold-start seed + the re-anchor target) ──────
/**
 * The ground-truth demographic trend band from a settlement's populationHistory ring: the SIGN
 * of the recent net delta, banded to −2..+2. Empty/absent history ⇒ 0 (flat/unknown). Pure.
 * @param {Array<{ delta?: unknown, population?: unknown }> | null | undefined} history
 * @returns {number}
 */
export function trendBandFromHistory(history) {
  if (!Array.isArray(history) || !history.length) return 0;
  const recent = history.slice(-AXIS_TUNING.TREND_WINDOW);
  let netDelta = 0;
  for (const h of recent) netDelta += finiteNumber(h?.delta, 0);
  const refPop = Math.max(1, finiteNumber(recent[recent.length - 1]?.population, 0));
  const ratio = netDelta / refPop;
  const T = AXIS_TUNING;
  if (ratio <= -T.TREND_STRONG) return -2;
  if (ratio <= -T.TREND_MILD) return -1;
  if (ratio < T.TREND_MILD) return 0;
  if (ratio < T.TREND_STRONG) return 1;
  return 2;
}

/**
 * The ground-truth observance label from a settlement's traditions mirror: the DOMINANT rite's
 * motif + patron, `${motif}:${patronOrNull}`. Highest scaleBand wins; among the largest, a
 * PATRON-BEARING (devotional) rite wins over a patronless one (so a rededication — which changes
 * a devotional rite's patron — moves the believed observance, the axis's headline use case),
 * then earliest index (the founding order). Absent/empty mirror ⇒ null. Pure.
 * @param {Array<{ coreMotif?: { element?: unknown }, scaleBand?: unknown, deityRef?: unknown }> | null | undefined} traditions
 * @returns {string | null}
 */
export function observanceFromTraditions(traditions) {
  if (!Array.isArray(traditions) || !traditions.length) return null;
  let best = null;
  let bestBand = -Infinity;
  let bestHasPatron = false;
  for (const rec of traditions) {
    if (!rec || typeof rec !== 'object') continue;
    const band = finiteNumber(rec.scaleBand, 0);
    const hasPatron = typeof rec.deityRef === 'string' && !!rec.deityRef;
    // Higher band wins; tie ⇒ a patron-bearing rite wins; further tie ⇒ earliest (index order).
    if (band > bestBand || (band === bestBand && hasPatron && !bestHasPatron)) {
      bestBand = band; best = rec; bestHasPatron = hasPatron;
    }
  }
  if (!best) return null;
  const motif = best.coreMotif && typeof best.coreMotif === 'object' ? String(best.coreMotif.element || '') : '';
  const patron = typeof best.deityRef === 'string' && best.deityRef ? best.deityRef : null;
  return `${motif}:${patron ?? 'null'}`;
}

/**
 * The two ground-truth axis fields for a subject's snapshot item. Pure.
 * @param {{ settlement?: { populationHistory?: unknown, traditions?: unknown } } | null | undefined} item
 * @returns {{ populationTrendBand: number, observanceLabel: string | null }}
 */
export function axisGroundTruth(item) {
  const settlement = item && typeof item === 'object' ? item.settlement : null;
  const s = settlement && typeof settlement === 'object' ? settlement : {};
  return {
    populationTrendBand: trendBandFromHistory(/** @type {Array<{ delta?: unknown, population?: unknown }>} */ (s.populationHistory)),
    observanceLabel: observanceFromTraditions(/** @type {Array<{ coreMotif?: { element?: unknown }, scaleBand?: unknown, deityRef?: unknown }>} */ (s.traditions)),
  };
}

// ── The axis fold (run inside reconcileBelief when the flag is lit) ────────────
/**
 * A report as the axis fold reads it — the beliefMap BeliefReport with the two transient fields
 * beliefMap.reportsBySubject attaches for the axes (the raw content + the canonical eventRef).
 * @typedef {{ accuracy01: number, completeness01: number,
 *   content?: { what?: unknown, magnitude?: unknown, partyIds?: unknown } | null,
 *   eventRef?: string }} AxisReport
 */

/**
 * Recover a migration_flight report's trend DIRECTION for the subject being reconciled: +1 when
 * the subject is the DESTINATION (swelling), −1 when it is the ORIGIN (emptying), 0 when it cannot
 * be resolved. Robust to dots in ids — the two known parties are tested by exact concatenation
 * against the canonical eventRef `migration.${origin}.${dest}.${departTick}`.
 * @param {AxisReport} report @param {string} subjectId @returns {number}
 */
function migrationDirectionFor(report, subjectId) {
  const parties = report.content && Array.isArray(report.content.partyIds) ? report.content.partyIds.map(String) : [];
  const other = parties.find((p) => p !== subjectId);
  if (other === undefined) return 0;
  const ref = String(report.eventRef || '');
  if (!ref.startsWith('migration.')) return 0;
  const mid = ref.slice('migration.'.length, ref.lastIndexOf('.')); // `${origin}.${dest}`
  if (mid === `${subjectId}.${other}`) return -1; // subject is the origin — emptying
  if (mid === `${other}.${subjectId}`) return 1; // subject is the destination — swelling
  return 0;
}

/**
 * Fold the two axes for one (observer, subject) belief. Pure, deterministic; runs AFTER the base
 * reconcile so the base fields are settled.
 *   • DEMOGRAPHIC: aggregate this window's fresh migration_flight reports (dir × magnitude ×
 *     fidelity) into an observed trend, blended with the prior band; no flight evidence ⇒ carry
 *     the prior band (or the cold ground-truth band). Believed, possibly wrong.
 *   • CULTURAL: a fresh tradition_change report at/above the adoption fidelity ADOPTS the current
 *     ground-truth observance; else the stale prior label survives (the fog-of-war feature).
 * @param {Object} args
 * @param {{ populationTrendBand?: number, observanceLabel?: string | null } | null} args.prior  the DECAYED prior (or null)
 * @param {{ populationTrendBand: number, observanceLabel: string | null }} args.groundTruth  the current ground-truth axes
 * @param {AxisReport[]} args.reports  this window's fresh reports (the beliefMap freshReports)
 * @param {string} args.subjectId
 * @returns {{ populationTrendBand: number, observanceLabel: string | null }}
 */
export function foldBeliefAxes({ prior, groundTruth, reports, subjectId }) {
  const T = AXIS_TUNING;
  const priorBand = prior && Number.isFinite(prior.populationTrendBand) ? Number(prior.populationTrendBand) : groundTruth.populationTrendBand;
  const priorLabel = prior && typeof prior === 'object' && 'observanceLabel' in prior ? prior.observanceLabel ?? null : groundTruth.observanceLabel;

  // DEMOGRAPHIC — aggregate the fresh migration_flight tellings.
  let trendSum = 0;
  let flightCount = 0;
  let culturalAdopt = false;
  for (const r of Array.isArray(reports) ? reports : []) {
    const what = r && r.content && typeof r.content === 'object' ? String(r.content.what || '') : '';
    if (what === 'migration_flight') {
      const dir = migrationDirectionFor(r, subjectId);
      if (dir === 0) continue;
      const mag = Math.max(1, Math.min(3, Math.round(finiteNumber(r.content?.magnitude, 1))));
      const fidelity = clamp01(r.accuracy01) * clamp01(r.completeness01);
      trendSum += dir * (/** @type {Record<number, number>} */ (T.MAG_SCALE)[mag] ?? 1) * fidelity;
      flightCount += 1;
    } else if (what === 'tradition_change') {
      // A fresh, faithful-enough culture beat unlocks adoption of the current true rite.
      if (clamp01(r.accuracy01) >= T.CAT_ADOPT_ACCURACY) culturalAdopt = true;
    }
  }

  let populationTrendBand = priorBand;
  if (flightCount > 0) {
    const observed = clamp(trendSum, TREND_MIN, TREND_MAX);
    populationTrendBand = clamp(Math.round(T.OBS_WEIGHT * observed + (1 - T.OBS_WEIGHT) * priorBand), TREND_MIN, TREND_MAX);
  }

  const observanceLabel = culturalAdopt ? groundTruth.observanceLabel : priorLabel;
  return { populationTrendBand, observanceLabel };
}
