/**
 * domain/display/settlementBeliefs.js — the BELIEF read-model (Phase 5.5 WAVE A),
 * the "what they believe vs what is true" band for the DM.
 *
 * Extends the STEP-3.5 information read-model (settlementRumors.js) from "what a
 * settlement has HEARD" to "what it now BELIEVES + how that diverges from the
 * truth" — the fog of war made watchable ("B believes A negligible; A is
 * formidable; B is about to march"). Follows the includeGroundTruth convention:
 *
 *   • PLAYER projection (includeGroundTruth: false, THE DEFAULT — fail closed):
 *     EMPTY. The belief map is inherently DM knowledge; a player never sees
 *     another settlement's internal model of the world, nor its own. This is the
 *     "player projection unchanged" guarantee — beliefs add nothing to a
 *     player-facing surface.
 *   • DM projection (includeGroundTruth: true — premium/DM only): the observer's
 *     belief about each subject it holds a model of, with a confidence + staleness
 *     band, and — when the caller supplies the current ground truth (`truthOf`) —
 *     a DIVERGENCE summary naming exactly where the belief is wrong.
 *
 * PRESENTATION ONLY. Pure; no store, no rng, no wall clock; INERT-NOT-CRASH on
 * absent/garbage ledgers; every list codepoint-sorted. Strict-clean; zero
 * any-casts.
 */

import { compareCodepoint } from '../deterministicSort.js';
import { GOVERNING_SEAT_KEY, strengthOfBand } from '../worldPulse/beliefMap.js';
import { getSpatialLedger } from '../spatial/distanceRead.js';

/** @typedef {import('../worldPulse/beliefMap.js').BeliefRecord} BeliefRecord */

/** @param {unknown} v @param {number} fallback @returns {number} */
function finiteNumber(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

// ── In-world bands (fiction-not-internals; the DM reads these + the raw numbers) ─
const STRENGTH_WORDS = Object.freeze(['negligible', 'slight', 'middling', 'formidable', 'overwhelming']);
/** @param {number} band */
export function strengthBandWord(band) {
  return STRENGTH_WORDS[Math.max(0, Math.min(4, Math.round(finiteNumber(band, 2))))];
}

/** A confidence 0..1 → the DM's shorthand for how sure the settlement is.
 *  @param {number} confidence01 */
export function beliefConfidenceBand(confidence01) {
  const c = finiteNumber(confidence01, 0);
  if (c >= 0.8) return 'certain';
  if (c >= 0.5) return 'confident';
  if (c >= 0.2) return 'uncertain';
  return 'vague';
}

/** How long since the belief was last refreshed → a staleness band.
 *  @param {number} agoTicks */
export function beliefStalenessBand(agoTicks) {
  const age = Math.max(0, finiteNumber(agoTicks, 0));
  if (age <= 2) return 'current';
  if (age <= 8) return 'aging';
  return 'stale';
}

const READINESS_WORDS = Object.freeze([
  { at: 0.75, word: 'in the field' },
  { at: 0.5, word: 'mobilizing' },
  { at: 0.25, word: 'on alert' },
  { at: 0, word: 'at peace' },
]);
/** @param {number} readiness */
function readinessWord(readiness) {
  const r = finiteNumber(readiness, 0);
  for (const { at, word } of READINESS_WORDS) if (r >= at) return word;
  return 'at peace';
}

/**
 * The current ground truth about a subject, as the caller supplies it for the
 * divergence join (all optional — the read-model reports only the axes provided).
 * @typedef {Object} SubjectTruth
 * @property {number} [strengthBand]   true strength band 0..4
 * @property {number} [readiness]      true war readiness 0..1
 * @property {string} [allianceLabel]  true relationship label (observer↔subject)
 * @property {string | null} [faithLabel]  true dominant faith
 */

/**
 * The divergence lines between a belief and the supplied truth — plain in-world
 * phrases the DM reads at a glance. Empty when the belief matches (or no truth
 * supplied).
 * @param {BeliefRecord} rec @param {SubjectTruth | null} truth @returns {string[]}
 */
function divergenceOf(rec, truth) {
  if (!truth) return [];
  /** @type {string[]} */
  const out = [];
  if (Number.isFinite(truth.strengthBand)) {
    const trueBand = Math.round(Number(truth.strengthBand));
    if (trueBand !== rec.strengthBand) {
      out.push(rec.strengthBand < trueBand
        ? `underestimates ${strengthBandWord(trueBand)} strength as ${strengthBandWord(rec.strengthBand)}`
        : `overestimates ${strengthBandWord(trueBand)} strength as ${strengthBandWord(rec.strengthBand)}`);
    }
  }
  if (Number.isFinite(truth.readiness)) {
    const believedWord = readinessWord(rec.readiness);
    const trueWord = readinessWord(Number(truth.readiness));
    if (believedWord !== trueWord) out.push(`believes them ${believedWord}; they are ${trueWord}`);
  }
  if (typeof truth.allianceLabel === 'string' && truth.allianceLabel && truth.allianceLabel !== rec.allianceLabel) {
    out.push(`still reads the bond as ${rec.allianceLabel}; it is now ${truth.allianceLabel}`);
  }
  if ('faithLabel' in truth && (truth.faithLabel ?? null) !== (rec.faithLabel ?? null)) {
    out.push(`believes their faith ${rec.faithLabel || 'unknown'}; it is ${truth.faithLabel || 'unknown'}`);
  }
  return out;
}

/**
 * The belief band a settlement holds, projected for a viewer. Pure selector.
 * PLAYER (includeGroundTruth false, the default) ⇒ [] — beliefs are DM-only.
 * DM ⇒ one row per subject the observer models (codepoint-sorted), each with the
 * raw belief, a confidence + staleness band, and (when `truthOf` is supplied) the
 * divergence against the current truth.
 *
 * @param {Object} args
 * @param {{ tick?: number, spatialLedgers?: unknown } | null | undefined} args.worldState
 * @param {unknown} args.observerId
 * @param {boolean} [args.includeGroundTruth]  DM/premium ⇒ true; player ⇒ false (default).
 * @param {string} [args.factionId]  which faction slot (v1: the governing seat).
 * @param {((subjectId: string) => SubjectTruth | null) | null} [args.truthOf]  the DM's
 *   truth provider for the divergence join; null ⇒ belief only.
 * @param {(id: string) => string} [args.nameFor]  settlement id → display name.
 * @returns {Array<Record<string, unknown>>}
 */
export function settlementBeliefs({
  worldState,
  observerId,
  includeGroundTruth = false,
  factionId = GOVERNING_SEAT_KEY,
  truthOf = null,
  nameFor = (id) => String(id),
} = /** @type {never} */ ({})) {
  if (!includeGroundTruth) return []; // player projection: beliefs are DM-only
  if (observerId == null) return [];
  const maps = asObject(getSpatialLedger(worldState, 'beliefMaps'));
  const byFaction = asObject(maps[String(observerId)]);
  const bySubject = asObject(byFaction[String(factionId)]);
  const tick = Math.max(0, finiteNumber(worldState?.tick, 0));
  return Object.keys(bySubject)
    .sort(compareCodepoint)
    .map((subjectId) => {
      const raw = bySubject[subjectId];
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
      const rec = /** @type {BeliefRecord} */ (raw);
      const agoTicks = Math.max(0, tick - Math.max(0, finiteNumber(rec.lastUpdateTick, 0)));
      const truth = truthOf ? truthOf(String(subjectId)) : null;
      return {
        subjectId: String(subjectId),
        subjectName: nameFor(String(subjectId)),
        believed: {
          readiness: finiteNumber(rec.readiness, 0),
          readinessWord: readinessWord(rec.readiness),
          strengthBand: Math.max(0, Math.min(4, Math.round(finiteNumber(rec.strengthBand, 2)))),
          strengthWord: strengthBandWord(rec.strengthBand),
          strength01: strengthOfBand(rec.strengthBand),
          allianceLabel: String(rec.allianceLabel || 'unknown'),
          faithLabel: rec.faithLabel ?? null,
        },
        confidence01: finiteNumber(rec.confidence01, 0),
        confidence: beliefConfidenceBand(rec.confidence01),
        agoTicks,
        staleness: beliefStalenessBand(agoTicks),
        divergence: divergenceOf(rec, truth),
      };
    })
    .filter((row) => row != null);
}

/**
 * Panel-presence gate: does this world carry ANY belief map? Dormant (no key) ⇒
 * false ⇒ no "what they believe" surface renders ⇒ byte-identical UI.
 * @param {{ spatialLedgers?: unknown } | null | undefined} worldState
 */
export function hasBeliefMaps(worldState) {
  const maps = getSpatialLedger(worldState, 'beliefMaps');
  return !!maps && typeof maps === 'object' && !Array.isArray(maps) && Object.keys(maps).length > 0;
}
